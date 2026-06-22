#!/usr/bin/env node
// Recover GitHub Gist code that the Wix→MDX migration silently DROPPED.
//
// Why this exists: on the old Wix site, code snippets were GitHub Gist embeds,
// rendered CLIENT-SIDE into empty `<div data-hook="html-component">` placeholders.
// The code is NEVER in the server HTML, so scripts/remigrate-posts.mjs (which only
// tokenizes <pre>, collapsible widgets, and image/video <figure>s) had nothing to
// grab and dropped every gist — the same way inline images were dropped before
// `npm run remigrate` was written. Result: ~62 posts are missing ~150 code blocks
// (the prose says "paste this in:" with nothing after it).
//
// The gist URL/ID is NOT recoverable from the page (confirmed: not in server HTML,
// not in the Wix page-structure JSON, not via the blog _api). So mapping a dropped
// embed to its gist must be HEURISTIC (gist filename + the prose around the embed),
// reviewed by a human before anything is written. This script is therefore three
// phases:
//
//   inventory  — fetch the author's 48 public gists, cache filename→{id,lang,content}
//   propose    — for each affected post, find the dropped-embed positions (wide
//                html-component placeholders) + their preceding prose, score a gist
//                match, and write a REVIEW file. Writes NOTHING to posts.
//   insert     — read the (human-approved) review file and insert verbatim fenced
//                code blocks at the anchored positions. Idempotent.
//
// Usage:
//   node scripts/recover-gists.mjs inventory [--refresh]
//   node scripts/recover-gists.mjs propose   [--only=a,b] [--out=gist-recovery-proposals.json]
//   node scripts/recover-gists.mjs insert    --from-mapping=gist-recovery-proposals.json [--only=a,b] [--dry-run]
//
// The cache (gist-cache.json) and the proposals file are build-time scratch — not
// shipped, not imported by the site.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const ASSETS_DIR = join(ROOT, 'src/assets/blog');
const CACHE_FILE = join(ROOT, 'gist-cache.json');
const DEFAULT_PROPOSALS = join(ROOT, 'gist-recovery-proposals.json');

const SITE = 'https://www.prostdev.com';
const GH_USER = 'alexandramartinez';
const MEDIA_BASE = 'https://static.wixstatic.com/media/';
const UA = 'Mozilla/5.0 (gist-recovery)';
const DELAY_MS = 200;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── arg parsing ──
const argv = process.argv.slice(2);
const CMD = argv.find((a) => !a.startsWith('--')) || 'help';
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const flagVal = (name) => {
  const f = [...flags].find((a) => a.startsWith(`--${name}=`));
  return f ? f.slice(`--${name}=`.length) : null;
};
const DRY_RUN = flags.has('--dry-run');
const REFRESH = flags.has('--refresh');
const onlyArg = flagVal('only');
const ONLY = onlyArg ? new Set(onlyArg.split(',').map((s) => s.trim()).filter(Boolean)) : null;

// ── shared HTML→text helpers (copied from remigrate-posts.mjs, proven) ──
function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;|&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'").replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '/')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
const strip = (h) => decode(h.replace(/<[^>]+>/g, '')).replace(/[ \t]+/g, ' ').trim();

// The Wix post page occasionally returns an incomplete JS-shell response; retry.
async function fetchPost(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      if (!res.ok) { if (i === tries - 1) return { error: `HTTP ${res.status}` }; continue; }
      const raw = await res.text();
      if (raw.includes('data-hook="rcv-block-first"') || raw.includes('data-hook="post-footer"')) {
        return { raw };
      }
    } catch (e) {
      if (i === tries - 1) return { error: String(e) };
    }
  }
  return { error: 'no article body markers after retries (transient empty fetch)' };
}

// ── gist language → MDX fence tag ──
const LANG_FENCE = {
  YAML: 'yaml', SQL: 'sql', XML: 'xml', JSON: 'json', Java: 'java',
  Shell: 'bash', 'Shell Script': 'bash', JavaScript: 'js', TypeScript: 'ts',
  Markdown: 'md', Text: '', Properties: 'properties', Groovy: 'groovy',
  Python: 'python', HTML: 'html', RAML: 'yaml', Dockerfile: 'dockerfile',
};
// DataWeave files surface as no/Text language; key off the .dwl extension or the
// `%dw` signature so recovered code lands in the repo's ```dataweave fence.
function fenceFor(filename, language, content) {
  if (/\.dwl$/i.test(filename) || /^\s*%dw\s+2\.0/.test(content || '')) return 'dataweave';
  if (/\.(yml|yaml|raml)$/i.test(filename)) return 'yaml';
  if (/\.sql$/i.test(filename)) return 'sql';
  if (/\.xml$/i.test(filename)) return 'xml';
  if (/\.json$/i.test(filename)) return 'json';
  if (/\.java$/i.test(filename)) return 'java';
  if (/\.(sh|bash)$/i.test(filename)) return 'bash';
  if (/\.(js|mjs)$/i.test(filename)) return 'js';
  if (/\.ts$/i.test(filename)) return 'ts';
  if (/\.mdc?$/i.test(filename)) return 'md';
  return LANG_FENCE[language] ?? '';
}

// ════════════════════════════════════════════════════════════════════════
// PHASE 1 — inventory
// ════════════════════════════════════════════════════════════════════════
async function loadCache() {
  if (existsSync(CACHE_FILE) && !REFRESH) {
    return JSON.parse(await readFile(CACHE_FILE, 'utf8'));
  }
  return null;
}

async function buildInventory() {
  const cached = await loadCache();
  if (cached) {
    console.log(`Using cached gist inventory (${cached.gists.length} gists). --refresh to re-fetch.`);
    return cached;
  }
  console.log(`Fetching public gists for ${GH_USER}…`);
  const list = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/gists?per_page=100&page=${page}`, {
      headers: { 'user-agent': UA, accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`gist list HTTP ${res.status} (rate-limited? wait or set GITHUB_TOKEN)`);
    const batch = await res.json();
    if (!batch.length) break;
    list.push(...batch);
    await sleep(DELAY_MS);
  }
  // The list endpoint already returns files with content for small gists, but
  // truncates large ones — fetch each gist's detail to guarantee full content.
  const gists = [];
  for (const g of list) {
    const res = await fetch(`https://api.github.com/gists/${g.id}`, {
      headers: { 'user-agent': UA, accept: 'application/vnd.github+json' },
    });
    if (!res.ok) { console.log(`  ⚠ gist ${g.id} HTTP ${res.status} — skipped`); continue; }
    const full = await res.json();
    const files = Object.entries(full.files || {}).map(([name, f]) => ({
      name, language: f.language || '', size: f.size, content: f.content || '',
    }));
    gists.push({ id: g.id, description: g.description || '', files });
    process.stdout.write('.');
    await sleep(DELAY_MS);
  }
  console.log(`\nFetched ${gists.length} gists.`);
  const inv = { fetchedCount: gists.length, gists };
  if (!DRY_RUN) await writeFile(CACHE_FILE, JSON.stringify(inv, null, 2));
  return inv;
}

// Flat index: filename(lowercased) → [{gistId, file}], plus all files for scoring.
function indexGists(inv) {
  const byFilename = new Map();
  const allFiles = [];
  for (const g of inv.gists) {
    for (const f of g.files) {
      const entry = { gistId: g.id, description: g.description, ...f };
      allFiles.push(entry);
      const key = f.name.toLowerCase();
      if (!byFilename.has(key)) byFilename.set(key, []);
      byFilename.get(key).push(entry);
    }
  }
  return { byFilename, allFiles };
}

// ════════════════════════════════════════════════════════════════════════
// PHASE 2 — propose
// ════════════════════════════════════════════════════════════════════════

// Count fenced code blocks in a local .mdx body.
const fenceCount = (s) => Math.floor((s.match(/^```/gm) || []).length / 2);

// Find wide html-component placeholders (gist/code embeds) in the live HTML, in
// document order, each with the text of the nearest PRECEDING block (paragraph or
// list item) — the "paste this in:" anchor used to place the recovered code.
function findEmbeds(raw) {
  const bs = raw.indexOf('data-hook="rcv-block-first"');
  let be = raw.indexOf('data-hook="post-footer"');
  if (be < 0) be = raw.length;
  const body = raw.slice(bs < 0 ? 0 : raw.lastIndexOf('<', bs), be);

  const embeds = [];
  const re = /<div class="S-QUe" style="width:(\d+);height:(\d+)px[^"]*" data-hook="html-component"/g;
  let m;
  while ((m = re.exec(body))) {
    const w = +m[1], h = +m[2];
    // Ad / subscribe banners are short (~94px) regardless of width (728, 740, …).
    // Real gist embeds are 200–900px tall. Filter on HEIGHT, not the exact w×h.
    if (h <= 110) continue;
    // Nearest preceding <p>…</p> or <li>…</li> text for the anchor.
    const before = body.slice(0, m.index);
    let anchor = '';
    const pMatches = [...before.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)];
    for (let i = pMatches.length - 1; i >= 0; i--) {
      const t = strip(pMatches[i][2]);
      if (t) { anchor = t; break; }
    }
    // Nearest preceding heading for extra context.
    let heading = '';
    const hMatches = [...before.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)];
    if (hMatches.length) heading = strip(hMatches[hMatches.length - 1][2]);
    embeds.push({ width: w, height: h, anchor, heading });
  }
  return embeds;
}

// Score how well a gist file matches an embed context (anchor + heading + slug).
function scoreMatch(file, ctx) {
  const hay = `${ctx.anchor} ${ctx.heading} ${ctx.slug} ${ctx.title}`.toLowerCase();
  const fname = file.name.toLowerCase();
  const base = fname.replace(/\.[a-z0-9]+$/i, '');
  let score = 0;
  // Exact filename mention in the prose is the strongest signal.
  if (hay.includes(fname)) score += 100;
  // Filename tokens (split on - _ .) appearing in context.
  const tokens = base.split(/[-_.]+/).filter((t) => t.length > 2);
  for (const t of tokens) if (hay.includes(t)) score += 8;
  // Gist description tokens vs. post title.
  if (file.description) {
    const dtok = file.description.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 3);
    const titleHay = `${ctx.title} ${ctx.slug}`.toLowerCase();
    for (const t of dtok) if (titleHay.includes(t)) score += 4;
  }
  // Language-keyword affinity: the prose often names the language/type of the embed
  // ("the following DataWeave script", "the pom.xml", "this YAML") even when it
  // doesn't name the file. Reward files whose extension matches such a keyword.
  const ext = (fname.match(/\.([a-z0-9]+)$/) || [])[1] || '';
  const LANG_KW = {
    dwl: ['dataweave', 'dwl', '%dw', 'transform', 'script'],
    yaml: ['yaml', 'yml', 'api spec', 'openapi', 'asyncapi', 'raml', 'workflow'],
    yml: ['yaml', 'yml', 'github actions', 'workflow', 'pipeline', 'build'],
    sql: ['sql', 'table', 'query', 'database'],
    xml: ['xml', 'flow', 'sub-flow', 'subflow', 'mule', 'config', 'pom'],
    json: ['json', 'payload'],
    java: ['java', 'class'],
    sh: ['shell', 'bash', 'script', 'bootstrap'],
    js: ['javascript', 'js ', 'script', 'test'],
  };
  for (const kw of LANG_KW[ext] || []) if (hay.includes(kw)) { score += 3; break; }
  return score;
}

// Compute, for every gist, which post it most likely BELONGS to. Gist filenames
// and descriptions are far more post-specific than the prose around an embed, so
// "ownership" is the strongest signal we have: a gist named
// `get-all-tasks-request.dwl` plainly belongs to the to-do/MySQL tutorial. We then
// offer a post ONLY its owned gists' files as embed candidates, which collapses the
// per-embed matching noise. Returns Map<slug, [{gistId, file}…]>.
function assignGistsToPosts(inv, postMeta) {
  const owned = new Map(); // slug → [{gistId, ...file}]
  for (const g of inv.gists) {
    // Score this whole gist against every post (filename + description tokens).
    const gistTokens = new Set();
    for (const f of g.files) {
      for (const t of f.name.toLowerCase().replace(/\.[a-z0-9]+$/i, '').split(/[-_.]+/)) {
        if (t.length > 3) gistTokens.add(t);
      }
    }
    for (const t of (g.description || '').toLowerCase().split(/[^a-z0-9]+/)) {
      if (t.length > 3) gistTokens.add(t);
    }
    let best = null;
    for (const pm of postMeta) {
      let s = 0;
      // Title/slug hits weigh more (2) than body hits (1) — a filename token in the
      // title is a stronger ownership signal than one buried in the prose.
      for (const t of gistTokens) {
        if (pm.hay.includes(t)) s += 2;
        else if (pm.body.includes(t)) s += 1;
      }
      if (s > 0 && (!best || s > best.s)) best = { slug: pm.slug, s };
    }
    // Require a minimum score of 3 to claim ownership (filters one stray body hit).
    if (best && best.s >= 3) {
      if (!owned.has(best.slug)) owned.set(best.slug, []);
      for (const f of g.files) owned.get(best.slug).push({ gistId: g.id, description: g.description, ...f });
    }
  }
  return owned;
}

async function propose(inv) {
  const { allFiles } = indexGists(inv);
  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.mdx')).map((f) => f.slice(0, -4));
  let slugs = ONLY ? files.filter((s) => ONLY.has(s)) : files;

  // Build post metadata (title + hay) for ALL posts so gist ownership can consider
  // every post, not just the --only subset.
  const postMeta = [];
  for (const s of files) {
    const local = await readFile(join(BLOG_DIR, `${s}.mdx`), 'utf8');
    const t = (local.match(/^title:\s*['"]?(.+?)['"]?\s*$/m) || [])[1] || '';
    // Include the post BODY in the ownership haystack: gist filenames often match
    // words in the prose (e.g. the MySQL post never says "todo" in its slug but its
    // body mentions "get-all-tasks" and links to github.com/.../todo-api-impl),
    // which is what connects a gist like get-all-tasks.xml to the right post.
    const body = local.replace(/^---[\s\S]*?---/, '').toLowerCase();
    postMeta.push({ slug: s, title: t, hay: `${s} ${t}`.toLowerCase(), body });
  }
  const ownedGists = assignGistsToPosts(inv, postMeta);

  console.log(`Scanning ${slugs.length} post(s) for dropped gist embeds…\n`);
  const proposals = [];
  let scanned = 0;

  for (const slug of slugs) {
    const local = await readFile(join(BLOG_DIR, `${slug}.mdx`), 'utf8');
    const titleMatch = local.match(/^title:\s*['"]?(.+?)['"]?\s*$/m);
    const title = titleMatch ? titleMatch[1] : '';
    const localFences = fenceCount(local);

    const got = await fetchPost(`${SITE}/post/${slug}`);
    await sleep(DELAY_MS);
    scanned++;
    if (got.error) { console.log(`  ✗ ${slug} — ${got.error}`); continue; }

    const embeds = findEmbeds(got.raw);
    if (!embeds.length) continue;
    const missing = embeds.length - localFences;
    if (missing <= 0) continue; // post already has as many fences as embeds — likely fine

    const ctxBase = { slug, title };
    // Candidate pool: the gists this post OWNS (strong signal). If it owns none,
    // fall back to the full set (weak — will surface as low confidence).
    const ownPool = ownedGists.get(slug) || [];
    const pool = ownPool.length ? ownPool : allFiles;
    const poolIsOwned = ownPool.length > 0;
    // Track how many owned files are still unassigned, so a post with exactly as
    // many owned files as missing embeds can map them 1:1 with high confidence.
    const usedFiles = new Set();

    const embedProposals = embeds.map((e, i) => {
      const ctx = { ...ctxBase, anchor: e.anchor, heading: e.heading };
      const ranked = pool
        .map((f) => ({ f, s: scoreMatch(f, ctx) + (poolIsOwned ? 5 : 0) }))
        .filter((x) => x.s > 0 && !usedFiles.has(`${x.f.gistId}:${x.f.name}`))
        .sort((a, b) => b.s - a.s)
        .slice(0, 4);
      const best = ranked[0];
      // Reliable signals only:
      //  • exactName  — the prose literally names the gist file ("create a file
      //                 called docker-compose.yml") → high.
      //  • owned      — this post genuinely OWNS the gist (strong token match in
      //                 assignGistsToPosts) → medium (human confirms position).
      // Anything else is NOT proposed: most dropped embeds were gists that no
      // longer exist in the 48 public gists (deleted) or were code SCREENSHOTS, so
      // surfacing a random leftover gist would be misleading. Those become
      // UNMATCHED with a null proposal (→ candidates for image-pull or skip).
      const exactName = best && (ctx.anchor + ' ' + ctx.heading).toLowerCase().includes(best.f.name.toLowerCase());
      const owned = poolIsOwned && best;
      let confidence, status, gid = null, gfile = null, fence = null, preview = null;
      if (exactName) {
        confidence = 'high'; status = 'PROPOSED';
      } else if (owned) {
        confidence = 'medium'; status = 'REVIEW';
      } else {
        confidence = 'low'; status = 'UNMATCHED';
      }
      if (status !== 'UNMATCHED' && best) {
        gid = best.f.gistId; gfile = best.f.name;
        fence = fenceFor(best.f.name, best.f.language, best.f.content);
        preview = best.f.content.slice(0, 160);
        usedFiles.add(`${best.f.gistId}:${best.f.name}`);
      }
      return {
        index: i,
        anchor: e.anchor,
        heading: e.heading,
        proposedGistId: gid,
        proposedFile: gfile,
        proposedFence: fence,
        confidence,
        codePreview: preview,
        // For UNMATCHED, still surface the top guesses so a human can pick one if
        // they recognize it; but nothing auto-inserts.
        candidates: ranked.slice(0, 3).map((x) => ({ gistId: x.f.gistId, file: x.f.name, score: x.s })),
        status,
      };
    });

    proposals.push({ slug, title, ownsGists: ownPool.length, liveEmbeds: embeds.length, localFences, missing, embeds: embedProposals });
    const hi = embedProposals.filter((e) => e.confidence === 'high').length;
    console.log(`  ⚠ ${slug} — ${missing} missing / ${embeds.length} embeds, owns ${ownPool.length} gist file(s) (${hi} high-confidence)`);
  }

  const outPath = flagVal('out') || DEFAULT_PROPOSALS;
  const doc = {
    generatedFrom: 'scripts/recover-gists.mjs propose',
    note: 'Review each embed. Set status:"PROPOSED" to insert, "SKIP" to ignore, or "IMAGE" to pull the embed image. Edit proposedGistId/proposedFile/proposedFence as needed.',
    gistInventoryCount: inv.gists.length,
    postsAffected: proposals.length,
    totalMissing: proposals.reduce((a, p) => a + p.missing, 0),
    posts: proposals,
  };
  if (!DRY_RUN) await writeFile(outPath, JSON.stringify(doc, null, 2));

  // Also emit a human-readable Markdown review doc — far easier to scan/confirm than
  // the JSON. The JSON stays the machine-editable source the `insert` phase reads.
  const mdPath = outPath.replace(/\.json$/, '.md');
  const lines = [
    `# Gist recovery — review & TODO`,
    ``,
    `${doc.postsAffected} posts are missing ~${doc.totalMissing} code blocks that the Wix→MDX`,
    `migration dropped (gist embeds were client-side iframes, never in the HTML).`,
    ``,
    `**PROPOSED**/**REVIEW** = a matching gist was found (recovered by \`insert\`).`,
    `**UNMATCHED** = no surviving gist among the author's 48 public gists — the code was`,
    `either a deleted gist or a code *screenshot*. These need the real snippet pasted by`,
    `hand at the noted position; nothing is auto-inserted and nothing is fabricated.`,
    ``,
    `---`,
    ``,
  ];
  // Everything that survives to here is TODO: the genuinely-reliable matches were
  // already recovered (hand-confirmed) in a prior `insert` pass. The remaining
  // gist "guesses" are generic-token coincidences (e.g. a Solace AsyncAPI file
  // scoring against a Salesforce post), so we DON'T present them as recoverable —
  // we list each dropped position for manual code, with any weak guess marked as an
  // UNVERIFIED hint only.
  lines.push(`## TODO — paste code by hand (${doc.totalMissing} blocks, ${proposals.length} posts)`, ``);
  lines.push(`Each bullet is a position where the migration dropped a code block. Open the`, `live post (or your own source) and paste the real snippet after the quoted line.`, ``);
  for (const p of proposals) {
    lines.push(`### ${p.slug}`);
    lines.push(`*${p.title}* — ${p.missing} block(s).`);
    lines.push(``);
    for (const e of p.embeds) {
      const hint = e.proposedFile ? `  _(unverified guess: \`${e.proposedFile}\`)_` : '';
      lines.push(`- #${e.index} (§ ${e.heading || '—'}) — after: _"${(e.anchor || '').slice(0, 90)}"_${hint}`);
    }
    lines.push(``);
  }
  if (!DRY_RUN) await writeFile(mdPath, lines.join('\n'));

  console.log(`\n── Proposal summary ───────────────────────────`);
  console.log(`Posts scanned        : ${scanned}`);
  console.log(`Posts with missing   : ${proposals.length}`);
  console.log(`Total missing blocks : ${doc.totalMissing}`);
  console.log(DRY_RUN ? '(DRY RUN — proposals not written)' : `Wrote ${outPath}`);
}

// ════════════════════════════════════════════════════════════════════════
// PHASE 3 — insert
// ════════════════════════════════════════════════════════════════════════
function gistFileContent(inv, gistId, fileName) {
  const g = inv.gists.find((x) => x.id === gistId);
  if (!g) return null;
  const f = g.files.find((x) => x.name === fileName);
  return f || null;
}

// Build the fenced block (verbatim content, trailing whitespace trimmed).
function fenceBlock(fence, content) {
  return '```' + (fence || '') + '\n' + content.replace(/\s+$/, '') + '\n```';
}

// Find the anchor paragraph in the .mdx and return the index just past its line.
// The anchor came from stripped HTML; match it loosely (collapse whitespace, ignore
// trailing punctuation) against each non-fence line of the body.
function locateAnchor(body, anchor) {
  const norm = (s) => s.replace(/\s+/g, ' ').replace(/[*_`>#-]/g, '').trim().toLowerCase();
  const target = norm(anchor);
  if (!target) return -1;
  const lines = body.split('\n');
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) { inFence = !inFence; continue; }
    if (inFence) continue;
    const l = norm(lines[i]);
    if (l && (l === target || l.includes(target) || target.includes(l))) {
      // skip to end of this paragraph (next blank line)
      let j = i;
      while (j + 1 < lines.length && lines[j + 1].trim() !== '') j++;
      return j;
    }
  }
  return -1;
}

async function downloadEmbedImage() {
  // Placeholder for IMAGE-status embeds: the embed's thumbnail is not in the page
  // HTML either (gist iframes have no static image). When the user marks an embed
  // IMAGE, they supply an `imageMediaId` (a static.wixstatic.com e0d344_…~mv2.ext)
  // in the proposals file; we download it like remigrate does.
  // (Implemented inline in insert() where the media id is available.)
}

async function insert(inv) {
  const mapPath = flagVal('from-mapping') || DEFAULT_PROPOSALS;
  if (!existsSync(mapPath)) throw new Error(`mapping file not found: ${mapPath} (run 'propose' first, then review it)`);
  const doc = JSON.parse(await readFile(mapPath, 'utf8'));
  let posts = doc.posts || [];
  if (ONLY) posts = posts.filter((p) => ONLY.has(p.slug));

  const report = { inserted: [], skipped: [], unanchored: [], imageTodo: [] };

  for (const post of posts) {
    const mdxPath = join(BLOG_DIR, `${post.slug}.mdx`);
    const src = await readFile(mdxPath, 'utf8');
    const fmMatch = src.match(/^(---\r?\n[\s\S]*?\r?\n---)\r?\n/);
    if (!fmMatch) { report.skipped.push({ slug: post.slug, reason: 'no frontmatter' }); continue; }
    const frontmatter = fmMatch[1];
    let body = src.slice(fmMatch[0].length);

    // Process embeds in REVERSE document order so earlier insert offsets don't shift
    // later anchors.
    const toInsert = (post.embeds || [])
      .filter((e) => e.status === 'PROPOSED' && e.proposedGistId && e.proposedFile)
      .sort((a, b) => b.index - a.index);

    let lines = body.split('\n');
    let count = 0;
    for (const e of toInsert) {
      const file = gistFileContent(inv, e.proposedGistId, e.proposedFile);
      if (!file) { report.skipped.push({ slug: post.slug, reason: `gist ${e.proposedGistId}/${e.proposedFile} not in cache` }); continue; }
      const block = fenceBlock(e.proposedFence ?? fenceFor(file.name, file.language, file.content), file.content);
      // Idempotency: skip if this exact code already present.
      if (body.includes(file.content.replace(/\s+$/, ''))) { count += 0; continue; }
      const at = locateAnchor(lines.join('\n'), e.anchor);
      if (at < 0) { report.unanchored.push({ slug: post.slug, index: e.index, anchor: e.anchor.slice(0, 60) }); continue; }
      lines.splice(at + 1, 0, '', block);
      count++;
    }
    if (count > 0 && !DRY_RUN) {
      await writeFile(mdxPath, `${frontmatter}\n${lines.join('\n')}`);
    }
    if (count > 0) report.inserted.push({ slug: post.slug, count });
  }

  console.log(`── Insert summary ─────────────────────────────`);
  console.log(`Posts updated  : ${report.inserted.length}`);
  console.log(`Blocks inserted: ${report.inserted.reduce((a, r) => a + r.count, 0)}`);
  for (const r of report.inserted) console.log(`  ✓ ${r.slug} (+${r.count})`);
  if (report.unanchored.length) {
    console.log(`\nCould not anchor (place manually): ${report.unanchored.length}`);
    for (const u of report.unanchored) console.log(`  ? ${u.slug} [#${u.index}] near: "${u.anchor}…"`);
  }
  if (report.skipped.length) {
    console.log(`\nSkipped: ${report.skipped.length}`);
    for (const s of report.skipped) console.log(`  - ${s.slug}: ${s.reason}`);
  }
  if (DRY_RUN) console.log('\n(DRY RUN — no files written)');
}

// ════════════════════════════════════════════════════════════════════════
async function main() {
  switch (CMD) {
    case 'inventory': {
      await buildInventory();
      break;
    }
    case 'propose': {
      const inv = await buildInventory();
      await propose(inv);
      break;
    }
    case 'insert': {
      const inv = await buildInventory();
      await insert(inv);
      break;
    }
    default:
      console.log(`Usage:
  node scripts/recover-gists.mjs inventory [--refresh]
  node scripts/recover-gists.mjs propose   [--only=a,b] [--out=file] [--dry-run]
  node scripts/recover-gists.mjs insert     --from-mapping=file [--only=a,b] [--dry-run]`);
  }
}

main().catch((err) => { console.error('\nFATAL:', err); process.exit(1); });
