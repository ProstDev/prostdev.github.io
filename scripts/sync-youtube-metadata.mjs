#!/usr/bin/env node
// Checks the hand-maintained video catalog (src/data/videos.ts) against the LIVE
// YouTube Data API v3 and REPORTS the drift — it NEVER edits the catalog.
//
// The catalog is the source of truth for the EDITORIAL layer (slug, description,
// playlists, links, LATEST_SLUGS/FEATURED_SLUG/tier). This only reconciles the three
// FACTUAL fields YouTube owns:
//   • title       — you may rename a video on YouTube; the catalog should follow.
//   • duration     — often left blank at publish (or the '—' "unknown" sentinel).
//   • publishedAt  — often left blank at publish.
// It also flags videos the API no longer returns (deleted/private → dead embed) and,
// with --discover, channel uploads not yet in the catalog (a "run /add-video" nudge).
//
// description is DELIBERATELY never touched: the catalog description is a curated 1-2
// sentence SEO summary distinct from the long YouTube description.
//
// Usage:
//   node scripts/sync-youtube-metadata.mjs              # human report to stdout
//   node scripts/sync-youtube-metadata.mjs --discover   # also list channel uploads not in the catalog
//   node scripts/sync-youtube-metadata.mjs --only=a,b   # restrict to specific youtubeIds
//   node scripts/sync-youtube-metadata.mjs --json       # machine JSON to stdout
// Needs YOUTUBE_API_KEY in the environment. In GitHub Actions it also appends
// booleans/markdown to $GITHUB_OUTPUT and $GITHUB_STEP_SUMMARY so the workflow can
// open/update ONE tracking issue. Exit 0 whether or not there's drift (the workflow
// decides); exit 2 on a missing key or a fetch/parse failure so an API outage doesn't
// masquerade as "in sync".
//
// Quota: videos.list is 1 unit/call for up to 50 ids, so ~67 videos = 2 units; discovery
// adds ~3 (channels.list + a couple playlistItems pages). The default quota is 10,000/day.

import { readFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEOS_TS = join(ROOT, 'src/data/videos.ts');
const DISCOVER_IGNORE_TS = join(ROOT, 'src/data/youtube-discover-ignore.ts');

// Load a repo-root .env if present (Node ≥20.6 native — no dotenv dep). An already-set
// YOUTUBE_API_KEY WINS: loadEnvFile does NOT override process.env, so this is safe in CI
// (the key arrives via `env:`) and for `export YOUTUBE_API_KEY=…`. A missing .env is fine —
// that's the export-only path. See .env.example for the template.
try {
  process.loadEnvFile(join(ROOT, '.env'));
} catch (err) {
  if (err?.code !== 'ENOENT') console.error(`sync-youtube-metadata: could not read .env — ${err.message}`);
}

const API = 'https://www.googleapis.com/youtube/v3';
const UA = 'prostdev-youtube-sync (+https://prostdev.com)';
const HANDLE = 'prostdev'; // the channel @handle — mirrors `youtube:` in src/config.ts
const DELAY_MS = 200; // polite gap between API calls (matches the other fetch scripts)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- flags (parsed like scripts/fetch-hero-images.mjs) ----
const argv = process.argv.slice(2);
const flags = new Set(argv);
const DISCOVER = flags.has('--discover');
const JSON_MODE = flags.has('--json');
const ONLY = new Set(
  (argv.find((a) => a.startsWith('--only=')) ?? '')
    .replace('--only=', '')
    .split(',')
    .filter(Boolean),
);

// ---- HTTP ----
async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // NEVER interpolate `url` — it carries `?key=`. Use status + the API's own message
    // (e.g. "API key not valid"), which never echoes the key.
    const msg = data?.error?.message ?? res.statusText;
    throw new Error(`YouTube API HTTP ${res.status}: ${msg}`);
  }
  return data;
}

// YouTube snippet titles come HTML-encoded (`&amp;`, `&#39;`, …); decode before diffing
// or "Days 1 & 2" would false-flag against "Days 1 &amp; 2".
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// ---- catalog parse (regex, the house style — no TS loader under bare node) ----
function readCatalog() {
  const src = readFileSync(VIDEOS_TS, 'utf8');
  const start = src.indexOf('export const VIDEOS: Video[] = [');
  if (start === -1) throw new Error('Could not locate the VIDEOS array in videos.ts');
  const end = src.indexOf('\n];', start); // the array's own closer; keeps PLAYLISTS/coverVideoId out
  if (end === -1) throw new Error('Could not locate the end of the VIDEOS array');
  const body = src.slice(start, end);

  // Each entry starts at a `youtubeId: '…'` line; that anchors the per-entry block.
  const idRe = /\n\s*youtubeId: '([^']+)',/g;
  const marks = [];
  let m;
  while ((m = idRe.exec(body))) marks.push({ id: m[1], at: m.index });

  return marks.map((mk, i) => {
    const block = body.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : body.length);
    return {
      youtubeId: mk.id,
      slug: parseField(block, 'slug'),
      title: parseTitle(block),
      duration: parseField(block, 'duration'),
      publishedAt: parseField(block, 'publishedAt'),
    };
  });
}

// title may be single- OR double-quoted (the file switches quote style to avoid escaping
// an apostrophe) and may wrap onto the line after `title:`.
function parseTitle(block) {
  const m = block.match(/title:\s*(['"])((?:\\.|(?!\1)[\s\S])*?)\1/);
  if (!m) return null;
  return m[2].replace(/\\(['"\\])/g, '$1'); // unescape \' \" \\ (none today, but be safe)
}

function parseField(block, name) {
  const m = block.match(new RegExp(`\\b${name}: '([^']*)'`));
  return m ? m[1] : null;
}

// Uploads DELIBERATELY excluded from the catalog (livestreams, meetups, #Codetober, Shorts,
// podcasts) — see src/data/youtube-discover-ignore.ts. Subtracted from --discover so only
// genuinely new uploads surface. A missing file is fine (nothing to ignore); regex-parsed the
// same way as the catalog since there's no TS loader under bare node.
function readDiscoverIgnore() {
  let src;
  try {
    src = readFileSync(DISCOVER_IGNORE_TS, 'utf8');
  } catch (err) {
    if (err?.code === 'ENOENT') return new Set();
    throw err;
  }
  const start = src.indexOf('DISCOVER_IGNORE_IDS');
  const body = start === -1 ? src : src.slice(start);
  const ids = new Set();
  const re = /'([A-Za-z0-9_-]{11})'/g;
  let m;
  while ((m = re.exec(body))) ids.add(m[1]);
  return ids;
}

// ---- parsers ----
// ISO-8601 video length → total seconds. Rejects multi-day (P#D…) and all-zero so a
// garbage value is never reported as a fill.
function isoDurationToSeconds(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? '');
  if (!m) return null;
  const total = +(m[1] || 0) * 3600 + +(m[2] || 0) * 60 + +(m[3] || 0);
  return total > 0 ? total : null;
}

function secondsToDisplay(total) {
  const h = Math.floor(total / 3600);
  const min = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

// A catalog display duration ('26:45', '3:53', '1:02:03', '—') → seconds. Blank/'—'/
// unparseable → null. Compared seconds-to-seconds so the file's padding inconsistency
// ('06:02' vs '6:02') never registers as false drift.
function displayToSeconds(str) {
  if (!str || str === '—') return null;
  const parts = str.split(':').map(Number);
  if (parts.some((n) => Number.isNaN(n))) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

// RFC-3339 publishedAt → YYYY-MM-DD in UTC (matches video/[slug].astro + the UTC-dates rule).
function publishedToDate(rfc) {
  const d = new Date(rfc ?? '');
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function watchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}

// ---- API ----
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function fetchVideos(ids, key) {
  const map = new Map();
  for (const group of chunk(ids, 50)) {
    const url = `${API}/videos?part=snippet,contentDetails&maxResults=50&id=${group.join(',')}&key=${key}`;
    const data = await fetchJson(url);
    for (const item of data.items ?? []) map.set(item.id, item);
    await sleep(DELAY_MS);
  }
  return map;
}

// Channel uploads not in the catalog. Cheap path only: channels.list → uploads playlist
// → playlistItems paging (1 unit each). NEVER search.list (100 units + eventually-consistent).
async function discover(key, knownIds) {
  const ch = await fetchJson(`${API}/channels?part=contentDetails&forHandle=${HANDLE}&key=${key}`);
  const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error(`Could not resolve the uploads playlist for @${HANDLE}`);
  const found = [];
  let pageToken = '';
  do {
    const url =
      `${API}/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploads}` +
      `${pageToken ? `&pageToken=${pageToken}` : ''}&key=${key}`;
    const data = await fetchJson(url);
    for (const item of data.items ?? []) {
      const id = item.contentDetails?.videoId;
      if (id && !knownIds.has(id)) found.push({ id, title: decodeEntities(item.snippet?.title ?? '') });
    }
    pageToken = data.nextPageToken ?? '';
    await sleep(DELAY_MS);
  } while (pageToken);
  return found;
}

// ---- diff (pure) ----
// A catalog publishedAt strictly in the future = a SCHEDULED premiere. YouTube's API doesn't
// return a not-yet-public video, so `apiMap` won't have it — that's expected, NOT a dead embed.
// `now` is injected (not read inside) so this stays a pure function and the caller owns the clock.
function computeDiff(catalog, apiMap, now = new Date()) {
  const findings = [];
  for (const v of catalog) {
    const item = apiMap.get(v.youtubeId);
    if (!item) {
      const publishTime = v.publishedAt ? new Date(v.publishedAt).getTime() : NaN;
      if (Number.isFinite(publishTime) && publishTime > now.getTime()) continue; // scheduled premiere
      findings.push({ kind: 'missing_from_api', youtubeId: v.youtubeId, slug: v.slug });
      continue;
    }
    const apiTitle = decodeEntities((item.snippet?.title ?? '').trim());
    const apiSecs = isoDurationToSeconds(item.contentDetails?.duration);
    const apiDate = publishedToDate(item.snippet?.publishedAt);

    if (apiTitle && v.title != null && apiTitle !== v.title.trim()) {
      findings.push({ kind: 'title_drift', youtubeId: v.youtubeId, slug: v.slug, from: v.title.trim(), to: apiTitle });
    }

    const catSecs = displayToSeconds(v.duration);
    if (apiSecs != null) {
      if (catSecs == null) {
        findings.push({ kind: 'duration_fill', youtubeId: v.youtubeId, slug: v.slug, to: secondsToDisplay(apiSecs) });
      } else if (catSecs !== apiSecs) {
        findings.push({ kind: 'duration_drift', youtubeId: v.youtubeId, slug: v.slug, from: v.duration, to: secondsToDisplay(apiSecs) });
      }
    }

    if (apiDate) {
      if (!v.publishedAt) {
        findings.push({ kind: 'published_fill', youtubeId: v.youtubeId, slug: v.slug, to: apiDate });
      } else if (v.publishedAt !== apiDate) {
        findings.push({ kind: 'published_drift', youtubeId: v.youtubeId, slug: v.slug, from: v.publishedAt, to: apiDate });
      }
    }
  }
  return findings;
}

// ---- rendering ----
// [kind, heading, one-line detail renderer]. Order = report order (fills first, then
// "verify by hand" drifts, then dead embeds, then discovery).
const GROUPS = [
  ['published_fill', '📅 Publish date to fill', (f) => `→ \`${f.to}\``],
  ['duration_fill', '⏱️ Duration to fill', (f) => `→ \`${f.to}\``],
  ['title_drift', '✏️ Title changed on YouTube', (f) => `\n    was: ${f.from}\n    now: ${f.to}`],
  ['published_drift', '⚠️ Publish date differs — verify by hand', (f) => `catalog \`${f.from}\` → API \`${f.to}\``],
  ['duration_drift', '⚠️ Duration differs — verify by hand', (f) => `catalog \`${f.from}\` → API \`${f.to}\``],
  ['missing_from_api', "🚫 Not returned by the API — verify it isn't deleted/private", () => ''],
];

function label(f) {
  return f.slug ? `\`${f.slug}\`` : `\`${f.youtubeId}\``;
}

function renderBody(findings, newVids) {
  let body = '';
  for (const [kind, heading, detail] of GROUPS) {
    const rows = findings.filter((f) => f.kind === kind);
    if (!rows.length) continue;
    body += `\n### ${heading} (${rows.length})\n\n`;
    for (const f of rows) {
      const d = detail(f);
      body += `- ${label(f)}${d ? ` — ${d}` : ''} · [watch](${watchUrl(f.youtubeId)})\n`;
    }
  }
  if (newVids.length) {
    body += `\n### 🆕 New on the channel — not in the catalog (${newVids.length})\n\n`;
    for (const v of newVids) body += `- ${v.title} · [watch](${watchUrl(v.id)}) · run \`/add-video\`\n`;
  }
  body += `\n<sub>Opened automatically by \`scripts/sync-youtube-metadata.mjs\` via the \`sync-youtube-metadata\` workflow. Edit \`src/data/videos.ts\` by hand — this never edits the catalog.</sub>`;
  return body;
}

function emitOutputs(kv) {
  if (process.env.GITHUB_OUTPUT) {
    for (const [k, v] of Object.entries(kv)) {
      appendFileSync(process.env.GITHUB_OUTPUT, `${k}<<__EOF__\n${v}\n__EOF__\n`);
    }
  }
}

// ---- main ----
try {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY is not set (add it as a GitHub Actions secret / export it locally)');

  const catalog = readCatalog();
  if (!catalog.length) throw new Error('Parsed 0 videos from videos.ts — the file layout may have changed');
  const knownIds = new Set(catalog.map((v) => v.youtubeId));

  const scope = ONLY.size ? catalog.filter((v) => ONLY.has(v.youtubeId)) : catalog;
  const apiMap = await fetchVideos(scope.map((v) => v.youtubeId), key);
  const findings = computeDiff(scope, apiMap);
  // Treat the deliberately-excluded back-catalog as "already known" so discover() skips it —
  // only GENUINELY new uploads surface as a nudge.
  const discoverKnown = new Set([...knownIds, ...readDiscoverIgnore()]);
  const newVids = DISCOVER ? await discover(key, discoverKnown) : [];

  const counts = {
    fill: findings.filter((f) => f.kind.endsWith('_fill')).length,
    drift: findings.filter((f) => f.kind.endsWith('_drift')).length,
    dead: findings.filter((f) => f.kind === 'missing_from_api').length,
    neu: newVids.length,
  };
  const total = findings.length + newVids.length;
  const hasDrift = total > 0;
  const body = hasDrift ? renderBody(findings, newVids) : '';

  if (JSON_MODE) {
    console.log(JSON.stringify({ counts, findings, newVids }, null, 2));
  } else {
    console.log(`YouTube catalog sync — ${catalog.length} videos checked (${apiMap.size} returned by the API)`);
    if (!hasDrift) {
      console.log(`\n✓ In sync — titles match and every duration/publishedAt is present.`);
    } else {
      console.log(
        `\n⚠ ${total} item(s): ${counts.fill} to fill, ${counts.drift} to verify, ${counts.dead} dead embed(s), ${counts.neu} new on channel.`,
      );
      console.log(body.replace(/^### /gm, '\n').replace(/<sub>[\s\S]*$/, '').trimEnd());
      console.log(`\n→ Edit src/data/videos.ts by hand (this never edits the catalog).`);
    }
  }

  emitOutputs({
    drift: String(hasDrift),
    fill_count: String(counts.fill),
    drift_count: String(counts.drift),
    dead_count: String(counts.dead),
    new_count: String(counts.neu),
    issue_title: `YouTube metadata sync — ${total} item(s) to review`,
    issue_body: body,
  });
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      hasDrift
        ? `### ⚠ YouTube catalog — ${total} item(s) to review\n${body}\n`
        : `### ✓ YouTube catalog in sync\n\n${catalog.length} videos checked; titles match and every duration/publishedAt is present.\n`,
    );
  }
  process.exit(0);
} catch (err) {
  console.error(`sync-youtube-metadata: ${err.message}`);
  // A missing key / API outage / parse failure is NOT "in sync" — surface as a failed run.
  process.exit(2);
}
