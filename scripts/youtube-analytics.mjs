#!/usr/bin/env node
// Fetches PUBLIC statistics for the hand-maintained video catalog (src/data/videos.ts)
// from the LIVE YouTube Data API v3 and prints a ranked performance review. It is
// READ-ONLY — it NEVER edits the catalog (mirrors scripts/sync-youtube-metadata.mjs).
//
// SCOPE — read this before expecting "analytics":
//   This uses the YouTube DATA API v3 (part=snippet,statistics) with a simple API key.
//   It sees only PUBLIC counters: viewCount, likeCount, commentCount. That's enough for a
//   real performance review (top/bottom, engagement, views/day, per-playlist rollups).
//   It is NOT the YouTube ANALYTICS API — watch time, retention, traffic sources,
//   impressions/CTR, subscriber growth, and revenue live there and require OAuth 2.0
//   (channel-owner consent), which this script deliberately does not do.
//
// What it reports:
//   • Channel totals (sum/mean/median views; like & comment totals with gap counts).
//   • Featured-hero cross-check — is FEATURED_SLUG still the actual most-viewed video?
//     (videos.ts documents it as "the channel's most-viewed video".) Suggestion only.
//   • Rankings: top/bottom by views, top by engagement rate, top by views/day-since-publish.
//   • Per-playlist rollups (grouped by each video's PRIMARY playlist), primary vs 'more' tier.
//
// Usage:
//   node scripts/youtube-analytics.mjs              # human report to stdout
//   node scripts/youtube-analytics.mjs --top=5      # bound each ranked list to N rows (default 10)
//   node scripts/youtube-analytics.mjs --only=a,b   # restrict to specific youtubeIds
//   node scripts/youtube-analytics.mjs --json       # machine JSON to stdout
// Needs YOUTUBE_API_KEY — put it in a repo-root .env (copy .env.example → .env), or export
// it, or (in CI) the repo's Actions secret. An exported/CI value wins over .env.
// Exit 0 on a clean report; exit 2 on a missing key or a fetch/parse failure so an API
// outage never masquerades as "0 views everywhere".
//
// Quota: videos.list is 1 unit/call for up to 50 ids REGARDLESS of `part`, so ~71 videos =
// 2 units of the default 10,000/day. Negligible — runnable hundreds of times a day.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEOS_TS = join(ROOT, 'src/data/videos.ts');

// Load a repo-root .env if present (Node ≥20.6 native — no dotenv dep). An already-set
// YOUTUBE_API_KEY WINS: loadEnvFile does NOT override process.env, so this is safe in CI
// (the key arrives via `env:`) and for `export YOUTUBE_API_KEY=…`. A missing .env is fine —
// that's the export-only path. See .env.example for the template.
try {
  process.loadEnvFile(join(ROOT, '.env'));
} catch (err) {
  if (err?.code !== 'ENOENT') console.error(`youtube-analytics: could not read .env — ${err.message}`);
}
const API = 'https://www.googleapis.com/youtube/v3';
const UA = 'prostdev-youtube-analytics (+https://prostdev.com)';
const DELAY_MS = 200; // polite gap between API calls (matches the other fetch scripts)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- flags (parsed like scripts/sync-youtube-metadata.mjs) ----
const argv = process.argv.slice(2);
const flags = new Set(argv);
const JSON_MODE = flags.has('--json');
const ONLY = new Set(
  (argv.find((a) => a.startsWith('--only=')) ?? '')
    .replace('--only=', '')
    .split(',')
    .filter(Boolean),
);
const TOP = Math.max(1, Number((argv.find((a) => a.startsWith('--top=')) ?? '').replace('--top=', '')) || 10);

// ---- HTTP (verbatim from sync-youtube-metadata.mjs) ----
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

// YouTube snippet titles come HTML-encoded (`&amp;`, `&#39;`, …); decode for readable labels.
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// ---- catalog parse (regex, the house style — no TS loader under bare node) ----
// Same anchoring as sync-youtube-metadata.mjs, plus each entry's `playlists` array (for
// per-playlist rollups) and MINUS `duration` (unused here). Pure: takes the file text.
function parseCatalog(src) {
  const start = src.indexOf('export const VIDEOS: Video[] = [');
  if (start === -1) throw new Error('Could not locate the VIDEOS array in videos.ts');
  const end = src.indexOf('\n];', start); // the array's own closer; keeps PLAYLISTS/coverVideoId out
  if (end === -1) throw new Error('Could not locate the end of the VIDEOS array');
  const body = src.slice(start, end);

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
      publishedAt: parseField(block, 'publishedAt'),
      playlists: parsePlaylists(block),
    };
  });
}

// title may be single- OR double-quoted and may wrap onto the line after `title:`.
function parseTitle(block) {
  const m = block.match(/title:\s*(['"])((?:\\.|(?!\1)[\s\S])*?)\1/);
  if (!m) return null;
  return m[2].replace(/\\(['"\\])/g, '$1'); // unescape \' \" \\
}

function parseField(block, name) {
  const m = block.match(new RegExp(`\\b${name}: '([^']*)'`));
  return m ? m[1] : null;
}

// Playlist ids for one entry. Every catalog entry uses a single-line array (verified: no
// entry lists 2+ playlists, none wrap), so match the [...] on one line and pull each quoted
// id. The FIRST id is the PRIMARY playlist (Video type doc, videos.ts).
function parsePlaylists(block) {
  const m = block.match(/\bplaylists:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

// id -> { title, tier } from the PLAYLISTS array — for rollup labels + primary/'more' split.
function parsePlaylistMeta(src) {
  const start = src.indexOf('export const PLAYLISTS: Playlist[] = [');
  if (start === -1) throw new Error('Could not locate the PLAYLISTS array in videos.ts');
  const end = src.indexOf('\n];', start);
  if (end === -1) throw new Error('Could not locate the end of the PLAYLISTS array');
  const body = src.slice(start, end);

  const idRe = /\n\s*id: '([^']+)',/g;
  const marks = [];
  let m;
  while ((m = idRe.exec(body))) marks.push({ id: m[1], at: m.index });

  const map = new Map();
  marks.forEach((mk, i) => {
    const block = body.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : body.length);
    map.set(mk.id, { title: parseTitle(block) ?? mk.id, tier: parseField(block, 'tier') ?? 'primary' });
  });
  return map;
}

function parseFeaturedSlug(src) {
  const m = src.match(/export const FEATURED_SLUG = '([^']+)'/);
  if (!m) throw new Error('Could not locate FEATURED_SLUG in videos.ts');
  return m[1];
}

// First entry of LATEST_SLUGS (the newest hand-listed upload) — for the informational note.
function parseLatestFirst(src) {
  const start = src.indexOf('export const LATEST_SLUGS: string[] = [');
  if (start === -1) throw new Error('Could not locate LATEST_SLUGS in videos.ts');
  const m = src.slice(start + 'export const LATEST_SLUGS: string[] = ['.length).match(/'([^']+)'/);
  return m ? m[1] : null;
}

// ---- metrics helpers ----
// statistics values are STRINGS ("12345"); likeCount/commentCount are ABSENT when the
// uploader hid them. Return undefined for absent/garbage (never coerce to 0 — that would
// fake engagement data), a finite Number otherwise. Distinguishes "hidden" from "zero".
function stat(item, field) {
  const raw = item?.statistics?.[field];
  if (raw === undefined) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

// RFC-3339 publishedAt → YYYY-MM-DD in UTC (matches sync-youtube + the repo UTC-dates rule).
function publishedToDate(rfc) {
  const d = new Date(rfc ?? '');
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// Whole days since a YYYY-MM-DD publish date, in UTC, floored, min 1 so a video published
// "today" (0 days) never divides by zero / shows Infinity.
// NOTE: new Date()/Date.now() are FINE in a plain node script — the CLAUDE.md ban is scoped
// to Workflow scripts only. Pinning the date to …T00:00:00Z + Date.now() keeps this all UTC.
function daysSince(dateStr) {
  if (!dateStr) return undefined;
  const then = new Date(`${dateStr}T00:00:00Z`);
  if (isNaN(then.getTime())) return undefined;
  return Math.max(1, Math.floor((Date.now() - then.getTime()) / 86_400_000));
}

// (likes + comments) / views. undefined if views 0/missing OR both like & comment hidden.
// If ONLY one is hidden, count the present one (the row is flagged partial elsewhere).
function engagementFraction(views, likes, comments) {
  if (!views) return undefined;
  if (likes === undefined && comments === undefined) return undefined;
  return ((likes ?? 0) + (comments ?? 0)) / views;
}

function mean(nums) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : undefined;
}

function median(nums) {
  if (!nums.length) return undefined;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// Records sorted by keyFn (skipping undefined/non-finite keys), top n. dir 'asc' for bottom-N.
function ranked(records, keyFn, n, dir = 'desc') {
  const withKey = records
    .map((r) => ({ r, k: keyFn(r) }))
    .filter((x) => x.k !== undefined && x.k !== null && Number.isFinite(x.k));
  withKey.sort((a, b) => (dir === 'desc' ? b.k - a.k : a.k - b.k));
  return withKey.slice(0, n).map((x) => x.r);
}

// ---- formatting ----
const chip = (s) => '`' + s + '`';
const fmtInt = (n) => (n === undefined ? '—' : Math.round(n).toLocaleString('en-US'));
const fmtPct = (x) => (x === undefined ? '—' : `${(x * 100).toFixed(2)}%`);
const fmtRate = (x) => (x === undefined ? '—' : x.toFixed(1));

// ---- API ----
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function fetchVideos(ids, key) {
  const map = new Map();
  for (const group of chunk(ids, 50)) {
    const url = `${API}/videos?part=snippet,statistics&maxResults=50&id=${group.join(',')}&key=${key}`;
    const data = await fetchJson(url);
    for (const item of data.items ?? []) map.set(item.id, item);
    await sleep(DELAY_MS);
  }
  return map;
}

// ---- compute (pure) ----
function computeMetrics(catalog, apiMap) {
  const records = [];
  const missing = [];
  for (const v of catalog) {
    const item = apiMap.get(v.youtubeId);
    if (!item) {
      missing.push({ youtubeId: v.youtubeId, slug: v.slug });
      continue;
    }
    const views = stat(item, 'viewCount');
    const likes = stat(item, 'likeCount');
    const comments = stat(item, 'commentCount');
    const date = v.publishedAt || publishedToDate(item.snippet?.publishedAt);
    const days = daysSince(date);
    records.push({
      youtubeId: v.youtubeId,
      slug: v.slug,
      title: v.title,
      playlists: v.playlists,
      views,
      likes,
      comments,
      date,
      days,
      engagement: engagementFraction(views, likes, comments),
      partialEngagement: (likes === undefined) !== (comments === undefined),
      viewsPerDay: views && days ? views / days : undefined,
    });
  }
  return { records, missing };
}

function rollupByPlaylist(records, playlistMeta) {
  const buckets = new Map();
  for (const r of records) {
    const pid = r.playlists[0] ?? '__unknown__';
    if (!buckets.has(pid)) buckets.set(pid, []);
    buckets.get(pid).push(r);
  }
  const rows = [];
  for (const [pid, recs] of buckets) {
    const meta = playlistMeta.get(pid);
    const views = recs.map((r) => r.views).filter((n) => n !== undefined);
    const engs = recs.map((r) => r.engagement).filter((n) => n !== undefined);
    const totalViews = views.reduce((a, b) => a + b, 0);
    rows.push({
      id: pid,
      title: meta?.title ?? (pid === '__unknown__' ? '(unknown playlist)' : pid),
      tier: meta?.tier ?? 'primary',
      count: recs.length,
      totalViews,
      avgViews: views.length ? totalViews / views.length : undefined,
      avgEngagement: mean(engs),
    });
  }
  rows.sort((a, b) => b.totalViews - a.totalViews);
  return rows;
}

// ---- render (human) ----
function plRow(count, totalViews, avgViews, avgEng, title) {
  return (
    '  ' +
    String(count).padStart(6) +
    '  ' +
    String(totalViews).padStart(12) +
    '  ' +
    String(avgViews).padStart(10) +
    '  ' +
    String(avgEng).padStart(9) +
    '  ' +
    title
  );
}

function renderPlaylistTable(rows) {
  const lines = [plRow('videos', 'total views', 'avg views', 'avg engmt', 'playlist')];
  for (const row of rows) {
    lines.push(plRow(row.count, fmtInt(row.totalViews), fmtInt(row.avgViews), fmtPct(row.avgEngagement), row.title));
  }
  return lines.join('\n');
}

function rankLine(i, value, slug, suffix = '') {
  return `  ${String(i + 1).padStart(3)}. ${String(value).padStart(11)}  ${chip(slug)}${suffix}`;
}

// ---- main ----
try {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY is not set (add it to a repo-root .env — copy .env.example — or export it)');

  const src = readFileSync(VIDEOS_TS, 'utf8');
  const catalog = parseCatalog(src);
  if (!catalog.length) throw new Error('Parsed 0 videos from videos.ts — the file layout may have changed');
  const playlistMeta = parsePlaylistMeta(src);
  const featuredSlug = parseFeaturedSlug(src);
  const latestFirst = parseLatestFirst(src);

  const scope = ONLY.size ? catalog.filter((v) => ONLY.has(v.youtubeId)) : catalog;
  if (!scope.length) throw new Error('No catalog videos matched --only=… (check the youtubeIds)');

  const apiMap = await fetchVideos(scope.map((v) => v.youtubeId), key);
  const { records, missing } = computeMetrics(scope, apiMap);

  // ---- aggregates ----
  const viewVals = records.map((r) => r.views).filter((n) => n !== undefined);
  const likeVals = records.map((r) => r.likes).filter((n) => n !== undefined);
  const commentVals = records.map((r) => r.comments).filter((n) => n !== undefined);
  const totals = {
    videos: scope.length,
    returned: records.length,
    totalViews: viewVals.reduce((a, b) => a + b, 0),
    totalLikes: likeVals.reduce((a, b) => a + b, 0),
    likesCount: likeVals.length,
    totalComments: commentVals.reduce((a, b) => a + b, 0),
    commentsCount: commentVals.length,
    meanViews: mean(viewVals),
    medianViews: median(viewVals),
  };

  const topViews = ranked(records, (r) => r.views, TOP);
  const bottomViews = ranked(records, (r) => r.views, TOP, 'asc');
  const topEngagement = ranked(records, (r) => r.engagement, TOP);
  const topViewsPerDay = ranked(records, (r) => r.viewsPerDay, TOP);

  const mostViewed = ranked(records, (r) => r.views, 1)[0];
  const featuredRec = records.find((r) => r.slug === featuredSlug);
  const featuredIsCurrent = Boolean(mostViewed && mostViewed.slug === featuredSlug);

  const rollupRows = rollupByPlaylist(records, playlistMeta);
  const primaryRollup = rollupRows.filter((r) => r.tier !== 'more');
  const moreRollup = rollupRows.filter((r) => r.tier === 'more');

  const vpdRanked = ranked(records, (r) => r.viewsPerDay, records.length);
  const latestIdx = latestFirst ? vpdRanked.findIndex((r) => r.slug === latestFirst) : -1;

  // ---- JSON mode (return before any human output) ----
  if (JSON_MODE) {
    const jsonRec = (r) => ({
      slug: r.slug,
      youtubeId: r.youtubeId,
      views: r.views ?? null,
      likes: r.likes ?? null,
      comments: r.comments ?? null,
      engagementRate: r.engagement ?? null,
      viewsPerDay: r.viewsPerDay ?? null,
      days: r.days ?? null,
      date: r.date ?? null,
      partialEngagement: r.partialEngagement,
      playlist: r.playlists[0] ?? null,
    });
    console.log(
      JSON.stringify(
        {
          scope: ONLY.size ? 'only' : 'all',
          totals,
          featuredCheck: {
            featuredSlug,
            featuredViews: featuredRec?.views ?? null,
            mostViewedSlug: mostViewed?.slug ?? null,
            mostViewedViews: mostViewed?.views ?? null,
            isCurrent: featuredIsCurrent,
          },
          rankings: {
            topViews: topViews.map(jsonRec),
            bottomViews: bottomViews.map(jsonRec),
            topEngagement: topEngagement.map(jsonRec),
            topViewsPerDay: topViewsPerDay.map(jsonRec),
          },
          playlists: { primary: primaryRollup, more: moreRollup },
          latestNote:
            latestIdx >= 0 ? { slug: latestFirst, rank: latestIdx + 1, of: vpdRanked.length } : { slug: latestFirst, rank: null, of: vpdRanked.length },
          missing,
        },
        null,
        2,
      ),
    );
    process.exit(0);
  }

  // ---- human report ----
  const scopeNote = ONLY.size ? ' · scoped to --only' : '';
  console.log(`YouTube public metrics — ${scope.length} video(s) checked (${records.length} returned by the API)${scopeNote}`);

  const likesHidden = records.length - totals.likesCount;
  const commentsOff = records.length - totals.commentsCount;
  if (likesHidden || commentsOff || missing.length) {
    console.log(
      `⚠ ${likesHidden} hide likes, ${commentsOff} have comments off, ${missing.length} missing from the API.`,
    );
  } else {
    console.log(`✓ Likes & comments are public on every video; none missing from the API.`);
  }

  const likeQual = totals.likesCount === records.length ? `(all ${records.length})` : `(${totals.likesCount} of ${records.length})`;
  const commentQual = totals.commentsCount === records.length ? `(all ${records.length})` : `(${totals.commentsCount} of ${records.length})`;
  console.log(`\n📊 Channel totals${scopeNote}`);
  console.log(`  Videos:         ${fmtInt(totals.videos)}  (${records.length} returned by the API)`);
  console.log(`  Total views:    ${fmtInt(totals.totalViews)}`);
  console.log(`  Total likes:    ${fmtInt(totals.totalLikes)}   ${likeQual}`);
  console.log(`  Total comments: ${fmtInt(totals.totalComments)}   ${commentQual}`);
  console.log(`  Mean views:     ${fmtInt(totals.meanViews)}`);
  console.log(`  Median views:   ${fmtInt(totals.medianViews)}`);

  console.log(`\n👑 Featured-hero cross-check${scopeNote}`);
  console.log(`  FEATURED_SLUG = ${chip(featuredSlug)}  (${fmtInt(featuredRec?.views)} views${featuredRec ? '' : ', not in scope'})`);
  if (mostViewed) {
    console.log(`  Most-viewed   = ${chip(mostViewed.slug)}  (${fmtInt(mostViewed.views)} views)`);
    if (featuredIsCurrent) {
      console.log(`  ✓ Featured hero is the most-viewed video.`);
    } else {
      console.log(`  ⚠ Featured hero is NOT the most-viewed video${ONLY.size ? ' (within --only scope)' : ''}.`);
      console.log(`    → Consider updating FEATURED_SLUG in src/data/videos.ts (this never edits it).`);
    }
  } else {
    console.log(`  (no view data in scope — cannot determine the most-viewed video)`);
  }

  console.log(`\n🔥 Top ${Math.min(TOP, topViews.length)} by views`);
  topViews.forEach((r, i) => console.log(rankLine(i, fmtInt(r.views), r.slug)));

  console.log(`\n🐌 Bottom ${Math.min(TOP, bottomViews.length)} by views`);
  bottomViews.forEach((r, i) => console.log(rankLine(i, fmtInt(r.views), r.slug)));

  console.log(`\n⚡ Top ${Math.min(TOP, topEngagement.length)} by engagement rate   (likes + comments ÷ views)`);
  topEngagement.forEach((r, i) => console.log(rankLine(i, fmtPct(r.engagement), r.slug, r.partialEngagement ? ' *' : '')));
  if (topEngagement.some((r) => r.partialEngagement)) {
    console.log(`  * likes or comments hidden — rate counts only the visible half`);
  }

  console.log(`\n📈 Top ${Math.min(TOP, topViewsPerDay.length)} by views/day since publish   (normalizes old vs. new)`);
  topViewsPerDay.forEach((r, i) =>
    console.log(rankLine(i, `${fmtRate(r.viewsPerDay)}/day`, r.slug, `   (${r.date ?? '?'}, ${fmtInt(r.views)} views)`)),
  );

  if (primaryRollup.length) {
    console.log(`\n🗂️  By playlist — primary series`);
    console.log(renderPlaylistTable(primaryRollup));
  }
  if (moreRollup.length) {
    console.log(`\n🗂️  By playlist — more from the channel`);
    console.log(renderPlaylistTable(moreRollup));
  }

  if (latestFirst) {
    console.log(`\n🆕 Latest-upload note (informational)`);
    if (latestIdx >= 0) {
      console.log(`  LATEST_SLUGS[0] = ${chip(latestFirst)} ranks #${latestIdx + 1} of ${vpdRanked.length} by views/day.`);
    } else {
      console.log(`  LATEST_SLUGS[0] = ${chip(latestFirst)} — no views/day data (not in scope, or missing a date).`);
    }
    console.log(`  (LATEST is upload order, not a performance signal — informational only.)`);
  }

  if (missing.length) {
    console.log(`\n🚫 Not returned by the API — verify not deleted/private (${missing.length})`);
    for (const v of missing) console.log(`  - ${chip(v.slug ?? v.youtubeId)} · https://www.youtube.com/watch?v=${v.youtubeId}`);
  }

  process.exit(0);
} catch (err) {
  console.error(`youtube-analytics: ${err.message}`);
  // A missing key / API outage / parse failure is NOT a clean report — surface as a failed run.
  process.exit(2);
}
