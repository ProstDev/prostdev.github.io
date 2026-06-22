#!/usr/bin/env node
// Verbatim re-migration of Wix blog posts WITH inline images.
//
// The original migration (.claude/scripts/wix-extract.mjs + the wix-post-migrator
// agent) dropped every inline body image: Wix renders images as
// `<figure data-hook="figure-IMAGE"> → <wow-image id="e0d344_…~mv2.ext">`, a block
// type the old extractor's regex never matched. This script re-extracts each
// already-migrated post straight from the live Wix HTML, this time keeping the
// images IN their original document position, downloading the full-res originals
// into src/assets/blog/, and rewriting the post body — while leaving the curated
// frontmatter (category, tags, heroImage, youtubeId) byte-for-byte untouched.
//
// Scope = the existing src/content/blog/*.mdx files (the filesystem IS the slug
// manifest). The hero image (src/assets/blog/{slug}.{ext}) is never touched, and the
// in-body copy of the hero is de-duplicated against it so it isn't shown twice.
//
// NOTE: this carries its OWN extraction (it does not import wix-extract.mjs) because
// that script's block loop has a latent zero-width-match infinite loop on
// image-heavy posts. The proven decode/strip/inline/fetch helpers are copied
// verbatim; only the buggy block loop is replaced with a correct single-pass
// tokenizer that also understands image figures.
//
// DOES NOT RECOVER GITHUB GIST CODE. On Wix, code snippets were GitHub Gist embeds
// rendered CLIENT-SIDE into empty `<div data-hook="html-component">` placeholders —
// the code is NEVER in the server HTML this tokenizer scans, so it (like wix-extract)
// silently drops every gist. ~17 posts are still missing ~60 such blocks. That gap is
// handled separately by scripts/recover-gists.mjs (`npm run recover-gists`), which
// fetches the author's public gists and inserts hand-confirmed matches; the rest are
// listed in gist-recovery-todo.md for manual paste. Re-running remigrate will NOT
// restore gist code — don't assume it does.
//
// Usage:
//   node scripts/remigrate-posts.mjs                    # all posts: rewrite bodies + download images
//   node scripts/remigrate-posts.mjs --dry-run          # report only, write nothing
//   node scripts/remigrate-posts.mjs --only=a,b,c       # just these slugs
//   node scripts/remigrate-posts.mjs --no-images        # rewrite bodies, skip image download
//   node scripts/remigrate-posts.mjs --force            # re-download images that already exist

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'src/assets/blog');
const BLOG_DIR = join(ROOT, 'src/content/blog');

const SITE = 'https://www.prostdev.com';
const MEDIA_BASE = 'https://static.wixstatic.com/media/';
const UA = 'Mozilla/5.0 (migration)';
const DELAY_MS = 200; // be polite between network requests
const SENT = ''; // private-use sentinel wrapping code-block placeholders

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const NO_IMAGES = args.has('--no-images');
const FORCE = args.has('--force');
const onlyArg = [...args].find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? new Set(onlyArg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean)) : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── HTML → Markdown helpers (copied verbatim from .claude/scripts/wix-extract.mjs) ──

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

// Wrap inner emphasis text in markers, but KEEP any leading/trailing whitespace
// OUTSIDE the markers. Wix often puts the boundary space inside the <strong>/<em>
// (e.g. `<strong>Pick CurieTech AI </strong>if…`); trimming it glued the bold to the
// next word (`**Pick CurieTech AI**if`), and a strong wrapping ONLY a space produced
// an empty `****`. Emit nothing when the content is blank.
function emphasize(html, marker) {
  // Strip tags but DON'T decode entities here — inline() decodes once at the very end,
  // after its final tag-strip. Decoding now would turn `&lt;dependencies&gt;` into a
  // literal `<dependencies>` that the final strip then eats, leaving an empty `****`.
  const inner = html.replace(/<[^>]+>/g, '').replace(/[ \t]+/g, ' ');
  const core = inner.trim();
  if (!core) return inner.includes(' ') ? ' ' : ''; // all-whitespace → just the space
  const lead = /^\s/.test(inner) ? ' ' : '';
  const trail = /\s$/.test(inner) ? ' ' : '';
  return `${lead}${marker}${core}${marker}${trail}`;
}

// Inline-level conversion: links, bold, italic inside a chunk of HTML.
function inline(h) {
  h = h.replace(/<br\s*\/?>/gi, ' ');
  // links — drop Wix internal auto-ToC anchors (#viewer-…), keep just their text
  h = h.replace(/<a\b[^>]*href="(#viewer-[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, txt) => strip(txt));
  // An external link with NO visible text is a Wix icon/duplicate anchor (it often
  // precedes the real text link to the same URL, e.g. `[](url)[net-tools API](url)`);
  // emit nothing so it doesn't leave a bare `[](url)`. Use the raw tag-stripped text
  // (entities intact) — decode happens once at the end, like emphasize().
  h = h.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, txt) => {
    const t = txt.replace(/<[^>]+>/g, '').replace(/[ \t]+/g, ' ').trim();
    return t ? `[${t}](${href})` : '';
  });
  h = h.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => emphasize(t, '**'));
  h = h.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => emphasize(t, '*'));
  // Merge adjacent bold runs. Wix often splits `**Remember:**` into
  // `<strong>Remember</strong><strong>:</strong>`, which concatenates to
  // `**Remember****:**` — the `****` (a bold-close butting a bold-open) renders as a
  // stray run. Collapsing every `****` rejoins the text: `**Remember:**`. (emphasize()
  // already prevents empty bolds, so a `****` can only be such a junction.)
  h = h.replace(/\*\*\*\*/g, '');
  return decode(h.replace(/<[^>]+>/g, '')).replace(/[ \t]+/g, ' ').trim();
}

// The Wix post page is ~1.2 MB and occasionally returns an incomplete / JS-shell
// response (body markers absent). Retry a few times before giving up.
async function fetchPost(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      if (!res.ok) { if (i === tries - 1) return { error: `HTTP ${res.status}` }; continue; }
      const raw = await res.text();
      if (raw.includes('data-hook="rcv-block-first"') || raw.includes('data-hook="post-footer"')) {
        return { raw };
      }
      // markers missing → transient empty/shell response; retry
    } catch (e) {
      if (i === tries - 1) return { error: String(e) };
    }
  }
  return { error: 'no article body markers after retries (transient empty fetch)' };
}

// ── Image download (full-res original; adapted from scripts/fetch-hero-images.mjs) ──

function normExt(ext) {
  const e = ext.toLowerCase();
  return e === 'jpeg' ? 'jpg' : e;
}
const extOf = (mediaId) => normExt(mediaId.split('.').pop());

async function downloadImage(mediaId, destPath) {
  const url = MEDIA_BASE + mediaId; // bare media URL = full-res, no /v1/fill/… transform
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`non-image content-type: ${ct}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return buf.length;
}

// ── Body post-processing (the "kept cleanups") ──

// Shift every heading so the shallowest becomes ## (preserves relative hierarchy).
function normalizeHeadings(md) {
  const levels = [...md.matchAll(/^(#{1,6}) /gm)].map((m) => m[1].length);
  if (!levels.length) return md;
  const shift = Math.max(0, 2 - Math.min(...levels));
  if (!shift) return md;
  return md.replace(/^(#{1,6}) /gm, (_, h) => '#'.repeat(Math.min(6, h.length + shift)) + ' ');
}

// Ordered list of opening-fence language tags from a body (one entry per code block).
function fenceLangs(md) {
  const langs = [];
  let inFence = false;
  for (const line of md.split('\n')) {
    if (/^```/.test(line)) {
      if (!inFence) langs.push(line.slice(3).trim());
      inFence = !inFence;
    }
  }
  return langs;
}

// Re-apply language tags to the bare opening fences of a freshly extracted body,
// positionally, ONLY when the fence count matches the prior body. Returns
// { md, applied, mismatch }.
function applyFenceLangs(md, langs) {
  const newCount = fenceLangs(md).length;
  if (newCount === 0) return { md, applied: 0, mismatch: false };
  if (newCount !== langs.length) return { md, applied: 0, mismatch: true };
  let i = 0, inFence = false, applied = 0;
  const out = md.split('\n').map((line) => {
    if (/^```/.test(line)) {
      if (!inFence) {
        const lang = langs[i++];
        inFence = true;
        if (lang) { applied++; return '```' + lang; }
        return '```';
      }
      inFence = false;
      return '```';
    }
    return line;
  });
  return { md: out.join('\n'), applied, mismatch: false };
}

// MDX safety: outside code fences, escape characters MDX would read as JSX /
// expression syntax. After inline() has stripped real tags, any surviving `<` / `{`
// / `}` is literal prose, so escaping all of them to entities is lossless on render
// and guarantees the MDX build doesn't choke. Never touches text inside ``` fences.
function mdxSafe(md) {
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/</g, '&lt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')))
    .join('');
}

// ── Per-post extraction ──

// Given the index of the '<' that opens a <div…>, return the index just past its
// matching </div> by counting nested <div>/</div>. Used to bound Wix collapsible
// widgets, whose markup the flat block regexes can't span.
function matchBalancedDiv(html, openLt) {
  let depth = 0;
  const re = /<div\b|<\/div>/gi;
  re.lastIndex = openLt;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].toLowerCase() === '</div>') { depth--; if (depth === 0) return re.lastIndex; }
    else depth++;
  }
  return html.length;
}

// Some posts (the DataWeave challenges) keep their clues + solution code inside Wix
// "collapsible" accordion widgets. Each item is a `collapsible-list-item-title` div
// followed by a `collapsible-list-item-body` div. Crucially, the SOLUTION code is
// stored as one <p> per line (not a <pre>), so the flat extractor turned it into
// double-spaced prose — and a bare `import … from …` line breaks the MDX build.
//
// We pre-process those widgets in place: each title becomes a `### ` heading, each
// prose body is left as paragraphs (picked up normally downstream), and each body
// whose text begins with `%dw 2.0` is rejoined line-by-line and emitted as a code
// placeholder so it lands in a verbatim ```dataweave fence. The code text is the
// author's own, recovered from the live HTML — nothing is invented.
function preprocessCollapsibles(html, codes) {
  const compRe = /data-hook="collapsible-list-component"/gi;
  let m;
  const comps = [];
  while ((m = compRe.exec(html))) {
    const open = html.lastIndexOf('<', m.index);
    comps.push([open, matchBalancedDiv(html, open)]);
  }
  if (!comps.length) return html;

  // Rebuild the document, replacing each component region with flattened markdown
  // wrapped in sentinels so it survives the block pass as a single CODE/heading run.
  let out = '';
  let cursor = 0;
  for (const [a, b] of comps) {
    out += html.slice(cursor, a);
    const region = html.slice(a, b);
    const titleRe = /data-hook="collapsible-list-item-title"[^>]*>([\s\S]*?)<\/div>/gi;
    const titles = [];
    let t;
    while ((t = titleRe.exec(region))) titles.push({ pos: t.index, title: strip(t[1]), end: titleRe.lastIndex });
    for (let i = 0; i < titles.length; i++) {
      const segEnd = i + 1 < titles.length ? titles[i + 1].pos : region.length;
      const seg = region.slice(titles[i].end, segEnd);
      // Raw <p>…</p> markup (formatting intact) AND a tags-stripped, newline-joined
      // version (to test for / emit code).
      const rawParas = [...seg.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)].map((x) => x[0]);
      const text = [...seg.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .map((x) => decode(x[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')))
        .join('\n');
      // Title → a `### ` subheading (wrapped in <p> so the block pass keeps it).
      if (titles[i].title) out += `<p>### ${titles[i].title}</p>`;
      if (/^\s*%dw\s+2\.0/.test(text)) {
        codes.push(text.replace(/\s+$/, ''));
        out += `${SENT}CODE${codes.length - 1}${SENT}`;
      } else {
        // Prose clue: pass the original <p> markup through so links/bold survive.
        out += rawParas.join('');
      }
    }
    cursor = b;
  }
  out += html.slice(cursor);
  return out;
}

// Wix renders nested lists as `<li aria-level="N"><p>TEXT</p>[<ul>…</ul>]</li>` —
// the nested <ul> sits INSIDE the parent <li>, before its </li>. A flat non-greedy
// `<li>…</li>` match therefore stops at the CHILD's </li>, merging parent + first
// child text (`tested two ways:Day 1: …`) and losing the indentation. Here we turn
// each <li> into a LIST placeholder carrying its nesting level + its OWN <p> text
// (every <li> is immediately followed by its own <p>, verified across the catalog),
// then strip the now-meaningless list wrapper tags. Indentation is applied on emit.
function preprocessLists(html, lists) {
  let out = html.replace(/<li\b([^>]*)>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_, attrs, inner) => {
    const level = +((attrs.match(/aria-level="(\d+)"/) || [])[1] || 1);
    lists.push({ level, html: inner });
    return `${SENT}LIST${lists.length - 1}${SENT}`;
  });
  // Drop leftover list scaffolding (the <ul>/<ol>/<li> wrappers around the markers).
  out = out.replace(/<\/?(ul|ol|li)\b[^>]*>/gi, '');
  return out;
}

// Build the ordered token stream from the isolated article HTML.
// Tokens: {block, html} | {code: n} | {list: n} | {img: mediaId, alt}
function tokenize(bodyHtml) {
  const codes = [];
  const lists = [];
  // Flatten any collapsible accordion widgets first (recovers solution code as
  // CODE placeholders + clue titles as headings), THEN normalize lists, THEN <pre>.
  let body = preprocessCollapsibles(bodyHtml, codes);
  body = preprocessLists(body, lists);
  // Code blocks → sentinel placeholders (preserve inner newlines verbatim).
  body = body.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, inner) => {
    codes.push(decode(inner.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')));
    return `${SENT}CODE${codes.length - 1}${SENT}`;
  });
  body = body.replace(/<div type="empty-line"[^>]*>\s*<\/div>/gi, '\n\n');

  // One combined regex, NO empty alternative → cannot zero-width-loop. List items
  // are already LIST placeholders, so `li` is no longer matched as a block tag.
  // figure-VIDEO is the companion-video embed; we tokenize it (as {vid:true}) only so
  // a heading left empty after dropping it (the video now renders at top via
  // youtubeId) can be removed downstream — its markup itself is never emitted.
  const re = new RegExp(
    '<(h[1-6]|blockquote|p)\\b[^>]*>([\\s\\S]*?)<\\/\\1>' +
      '|<figure\\b[^>]*data-hook="figure-(IMAGE|VIDEO)"[\\s\\S]*?<\\/figure>' +
      `|${SENT}LIST(\\d+)${SENT}` +
      `|${SENT}CODE(\\d+)${SENT}`,
    'gi'
  );

  const tokens = [];
  for (const m of body.matchAll(re)) {
    if (m[5] !== undefined) {
      tokens.push({ code: +m[5] });
    } else if (m[4] !== undefined) {
      tokens.push({ list: +m[4] });
    } else if (m[1] !== undefined) {
      tokens.push({ block: m[1].toLowerCase(), html: m[2] });
    } else if (m[3] && m[3].toUpperCase() === 'VIDEO') {
      tokens.push({ vid: true }); // companion video embed → not emitted; see above
    } else {
      const id = (m[0].match(/<wow-image\b[^>]*\bid="(e0d344_[a-f0-9]+~mv2\.[a-z]+)"/i) || [])[1];
      if (!id) continue; // non-Wix-blog figure (e.g. social icon) — ignore
      const cap = (m[0].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || [])[1] || '';
      tokens.push({ img: id, alt: cap ? strip(cap) : '' });
    }
  }
  return { tokens, codes, lists };
}

async function processPost(slug, report) {
  const mdxPath = join(BLOG_DIR, `${slug}.mdx`);
  const src = await readFile(mdxPath, 'utf8');
  const fmMatch = src.match(/^(---\r?\n[\s\S]*?\r?\n---)\r?\n/);
  if (!fmMatch) { report.failed.push({ slug, reason: 'no frontmatter block' }); return; }
  const frontmatter = fmMatch[1];
  const oldBody = src.slice(fmMatch[0].length);
  const hasYoutube = /^youtubeId:/m.test(frontmatter);

  const got = await fetchPost(`${SITE}/post/${slug}`);
  await sleep(DELAY_MS);
  if (got.error) { report.failed.push({ slug, reason: got.error }); return; }
  const raw = got.raw;

  // Hero media-id (the in-body copy of this is de-duplicated, never re-emitted).
  const heroId = (raw.match(/property="og:image" content="[^"]*\/(e0d344_[a-f0-9]+~mv2\.[a-z]+)/) || [])[1] || null;

  // Isolate the article body (rcv-block-first → post-footer).
  const bs = raw.indexOf('data-hook="rcv-block-first"');
  let be = raw.indexOf('data-hook="post-footer"');
  if (be < 0) be = raw.length;
  const { tokens, codes, lists } = tokenize(raw.slice(raw.lastIndexOf('<', bs), be));

  // Resolve tokens to markdown blocks, downloading non-hero images in order.
  const idToIndex = new Map(); // mediaId → sequential N (1-based, non-hero only)
  let nextIndex = 0;
  let heroSkipped = 0;
  let downloaded = 0;
  let reused = 0;
  const out = [];

  const VID = `${SENT}VID${SENT}`; // transient marker; removed during assembly
  for (const t of tokens) {
    if (t.vid) { out.push(VID); continue; } // companion video; see empty-heading cleanup
    if (t.code !== undefined) {
      const code = codes[t.code].replace(/\s+$/, '');
      // Auto-tag DataWeave (the one unambiguous language signature) so recovered
      // solution code lands in a ```dataweave fence; everything else stays bare and
      // gets its language via positional carry-over from the prior body downstream.
      const lang = /^\s*%dw\s+2\.0/.test(code) ? 'dataweave' : '';
      out.push('```' + lang + '\n' + code + '\n```');
      continue;
    }
    if (t.img !== undefined) {
      if (heroId && t.img === heroId) {
        heroSkipped++;
        if (hasYoutube) report.youtubeHeroReview.push(slug);
        continue; // already rendered as the frontmatter hero — don't duplicate
      }
      let n = idToIndex.get(t.img);
      if (n === undefined) {
        n = ++nextIndex;
        idToIndex.set(t.img, n);
        const ext = extOf(t.img);
        const dest = join(ASSETS_DIR, `${slug}-${n}.${ext}`);
        if (!DRY_RUN && !NO_IMAGES) {
          if (existsSync(dest) && !FORCE) {
            reused++;
          } else {
            try {
              await downloadImage(t.img, dest);
              downloaded++;
              await sleep(DELAY_MS);
            } catch (err) {
              report.imageFailures.push({ slug, mediaId: t.img, reason: err.message });
              idToIndex.delete(t.img);
              nextIndex--; // reuse this index for the next good image
              continue; // can't reference a file that isn't on disk → omit + log
            }
          }
        }
      }
      const ext = extOf(t.img);
      out.push(`![${t.alt}](../../assets/blog/${slug}-${n}.${ext})`);
      continue;
    }
    if (t.list !== undefined) {
      const item = lists[t.list];
      const txt = inline(item.html);
      if (!txt) continue;
      // 2 spaces of indent per nesting level beyond the first (CommonMark sub-list).
      out.push('  '.repeat(Math.max(0, item.level - 1)) + '- ' + txt);
      continue;
    }
    // text block
    const txt = inline(t.html);
    if (!txt) continue;
    if (/^h[1-6]$/.test(t.block)) out.push('#'.repeat(+t.block[1]) + ' ' + txt);
    else if (t.block === 'blockquote') out.push('> ' + txt);
    else out.push(txt);
  }

  // Drop a heading whose section contained ONLY the companion video (now rendered at
  // the top via youtubeId) — e.g. a "Watch the full breakdown" heading left empty.
  // Walk blocks: a heading followed by nothing but VID marker(s) up to the next
  // heading (or EOF) is removed along with those markers.
  let videoHeadingsDropped = 0;
  const kept = [];
  for (let i = 0; i < out.length; i++) {
    const isHeading = /^#{1,6} /.test(out[i]);
    if (isHeading) {
      let j = i + 1;
      let sawVid = false;
      while (j < out.length && !/^#{1,6} /.test(out[j])) {
        if (out[j] === VID) sawVid = true;
        else { sawVid = false; break; } // real content in the section → keep heading
        j++;
      }
      if (sawVid) { videoHeadingsDropped++; i = j - 1; continue; } // skip heading + its VID(s)
    }
    if (out[i] !== VID) kept.push(out[i]);
  }
  if (videoHeadingsDropped) report.videoHeadings = (report.videoHeadings || 0) + videoHeadingsDropped;

  // Assemble + verbatim-friendly cleanups.
  let md = kept
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    // collapse blank lines between consecutive list items (any indent level)
    .replace(/(^[ \t]*- .*)\n\n(?=[ \t]*- )/gm, '$1\n')
    .trim();

  md = normalizeHeadings(md);
  const { md: relangged, applied, mismatch } = applyFenceLangs(md, fenceLangs(oldBody));
  md = relangged;
  if (mismatch) report.fenceMismatch.push(slug);
  md = md.replace(/Alexandra Martinez/g, 'Alex Martinez');
  md = mdxSafe(md);

  const finalDoc = `${frontmatter}\n\n${md}\n`;
  if (!DRY_RUN) await writeFile(mdxPath, finalDoc);

  report.ok.push({
    slug,
    images: idToIndex.size,
    downloaded,
    reused,
    heroSkipped,
    fenceApplied: applied,
    fenceMismatch: mismatch,
    oldChars: oldBody.trim().length,
    newChars: md.length,
    delta: md.length - oldBody.trim().length,
  });
}

async function main() {
  console.log(`ProstDev verbatim re-migration${DRY_RUN ? ' (DRY RUN)' : ''}${NO_IMAGES ? ' (no images)' : ''}\n`);

  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.mdx')).map((f) => f.slice(0, -4));
  let slugs = files;
  if (ONLY) {
    slugs = files.filter((s) => ONLY.has(s));
    const missing = [...ONLY].filter((s) => !files.includes(s));
    if (missing.length) console.log(`  (no .mdx for: ${missing.join(', ')})`);
  }
  console.log(`Processing ${slugs.length} post(s)…\n`);

  const report = { ok: [], failed: [], imageFailures: [], fenceMismatch: [], youtubeHeroReview: [] };

  for (const slug of slugs) {
    try {
      await processPost(slug, report);
      const r = report.ok[report.ok.length - 1];
      if (r && r.slug === slug) {
        const flag = r.fenceMismatch ? ' ⚠fence' : '';
        console.log(
          `  ✓ ${slug} — img:${r.images} (dl ${r.downloaded}, reuse ${r.reused}, hero-skip ${r.heroSkipped}), Δ${r.delta >= 0 ? '+' : ''}${r.delta} chars${flag}`
        );
      } else {
        const f = report.failed[report.failed.length - 1];
        console.log(`  ✗ ${slug} — ${f && f.slug === slug ? f.reason : 'skipped'}`);
      }
    } catch (err) {
      report.failed.push({ slug, reason: String(err) });
      console.log(`  ✗ ${slug} — ${err}`);
    }
  }

  // ── Summary ──
  const totalImgs = report.ok.reduce((a, r) => a + r.images, 0);
  const totalDl = report.ok.reduce((a, r) => a + r.downloaded, 0);
  console.log('\n── Summary ──────────────────────────────────');
  console.log(`Posts processed      : ${report.ok.length}`);
  console.log(`Posts failed         : ${report.failed.length}`);
  console.log(`Inline images        : ${totalImgs} (downloaded ${totalDl})`);
  console.log(`Hero copies skipped  : ${report.ok.reduce((a, r) => a + r.heroSkipped, 0)}`);
  if (report.videoHeadings) console.log(`Empty video headings : ${report.videoHeadings} dropped`);
  if (report.fenceMismatch.length) {
    console.log(`Fence-lang mismatch  : ${report.fenceMismatch.length} → left bare, review:`);
    for (const s of report.fenceMismatch) console.log(`   - ${s}`);
  }
  if (report.youtubeHeroReview.length) {
    console.log(`youtubeId + hero-skip: ${report.youtubeHeroReview.length} (cover not shown anywhere — review):`);
    for (const s of [...new Set(report.youtubeHeroReview)]) console.log(`   - ${s}`);
  }
  if (report.imageFailures.length) {
    console.log(`Image download fails : ${report.imageFailures.length} (omitted from body):`);
    for (const f of report.imageFailures) console.log(`   - ${f.slug}: ${f.mediaId} (${f.reason})`);
  }
  if (report.failed.length) {
    console.log('Failed posts (left unchanged):');
    for (const f of report.failed) console.log(`   - ${f.slug}: ${f.reason}`);
  }
  // Biggest body deltas — likely prose drift to eyeball against git diff.
  const drift = [...report.ok].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 10);
  if (drift.length) {
    console.log('\nLargest body deltas (spot-check these against git diff):');
    for (const r of drift) console.log(`   ${r.delta >= 0 ? '+' : ''}${r.delta} chars — ${r.slug}`);
  }
  if (DRY_RUN) console.log('\n(DRY RUN — no files were written)');
}

main().catch((err) => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
