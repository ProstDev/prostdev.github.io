#!/usr/bin/env node
// Watches an ACTUAL video (frames + audio + on-screen text, not just the transcript) with
// Google's Gemini API and returns a timestamped, MuleSoft-tutorial-specific critique. This is
// the one thing the transcript/thumbnail tools can't do: it SEES pacing, dead air, whether your
// code font is legible, filler words, a weak first-10-seconds hook, missing chapters/CTA.
//
// WHY GEMINI (and not Claude/GPT here): Gemini natively ingests video. For a PUBLISHED video it
// reads the YouTube URL DIRECTLY — no download, no ffmpeg, no yt-dlp. For an UNPUBLISHED local
// recording it uploads the file via Gemini's File API first, then analyzes it.
//
// The rubric is derived from .claude/skills/youtube-growth/PLAYBOOK.md (the 30s retention cliff,
// code legibility, hook, filler, chapters, CTA, fairness). Views = watch-time = AdSense, and most
// tutorial drop-off is VISUAL/PACING — exactly what a video-native model can catch.
//
// Usage:
//   node scripts/analyze-video.mjs --slug=<catalog-slug>     # a published catalog video (looks up its youtubeId)
//   node scripts/analyze-video.mjs --id=<youtubeId>          # a published video by raw id
//   node scripts/analyze-video.mjs "https://youtu.be/XXXX"   # any public YouTube URL
//   node scripts/analyze-video.mjs ./showdown-apiled.mp4     # a LOCAL recording (pre-publish — best case)
//   node scripts/analyze-video.mjs <target> --json           # machine JSON instead of the human report
//   node scripts/analyze-video.mjs <target> --model=gemini-2.5-pro   # override model (default gemini-2.5-flash)
//   node scripts/analyze-video.mjs <target> --focus="the first 60s only"  # extra instruction appended to the rubric
//
// Needs GEMINI_API_KEY — free from https://aistudio.google.com (see .env.example). Put it in the
// repo-root .env (copy .env.example → .env), or export it. An exported/CI value wins over .env.
// Optional: set GEMINI_API_KEY_2 (and _3) as automatic fallbacks — if the primary key is
// rate-limited / out of quota / invalid, the script advances to the next key and retries.
// This is READ-ONLY toward YouTube; the only write is a temporary File-API upload for local files.
//
// Exit 0 on a clean report; exit 2 on a missing key, a bad target, or an API/parse failure so an
// outage never masquerades as "no problems found".
//
// Cost note: video is ~300 tokens/sec at default sampling, so a 20-min tutorial is a chunky call.
// The free tier does a few/day; --model=gemini-2.5-flash (default) keeps it cheap. Long videos on
// the free tier can hit rate limits — flip on billing (pay-per-use, cents/video) if you batch.

import { readFileSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEOS_TS = join(ROOT, 'src/data/videos.ts');

// Load a repo-root .env if present (Node ≥20.6 native — no dotenv dep). An already-set
// GEMINI_API_KEY WINS: loadEnvFile does NOT override process.env (safe for CI / `export`).
try {
  process.loadEnvFile(join(ROOT, '.env'));
} catch (err) {
  if (err?.code !== 'ENOENT') console.error(`analyze-video: could not read .env — ${err.message}`);
}

const API = 'https://generativelanguage.googleapis.com/v1beta';
const UPLOAD_API = 'https://generativelanguage.googleapis.com/upload/v1beta';

// ---- flags ----
const argv = process.argv.slice(2);
const flags = new Set(argv);
const JSON_MODE = flags.has('--json');
const getOpt = (name, dflt) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
};
const SLUG = getOpt('slug');
const ID = getOpt('id');
const MODEL = getOpt('model', 'gemini-2.5-flash');
const FOCUS = getOpt('focus', '');
// The first non-flag positional is a URL or local path.
const POSITIONAL = argv.find((a) => !a.startsWith('--'));

function fail(msg) {
  console.error(`analyze-video: ${msg}`);
  process.exit(2);
}

// Key list, tried in order. GEMINI_API_KEY_2 is an OPTIONAL fallback used automatically when the
// primary hits a quota / rate-limit / invalid-key error (isKeyRetryable below). Add more with
// GEMINI_API_KEY_3, … — they're picked up positionally.
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean);
if (!API_KEYS.length) {
  fail(
    'GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com, then add it to a\n' +
      '  repo-root .env (copy .env.example → .env) or `export GEMINI_API_KEY=…`.\n' +
      '  Optional: add GEMINI_API_KEY_2 as an automatic fallback if the first is rate-limited.',
  );
}
let keyIdx = 0;
const currentKey = () => API_KEYS[keyIdx];
const keyName = (i) => (i === 0 ? 'GEMINI_API_KEY' : `GEMINI_API_KEY_${i + 1}`);

// A failure worth retrying on the NEXT key: quota exhausted, rate-limited, or the key itself is
// bad/unauthorized. (A genuine 400 about the request body, or a 404, is NOT — another key won't
// help, so we let it surface.)
function isKeyRetryable(status, msg) {
  if (status === 429 || status === 403) return true; // rate limit / daily quota / not authorized
  if (status === 400 && /api[_ ]?key/i.test(msg)) return true; // "API key not valid"
  return false;
}

// ---- catalog parse (same house-style regex as youtube-analytics.mjs) ----
function parseCatalog(src) {
  const start = src.indexOf('export const VIDEOS: Video[] = [');
  if (start === -1) throw new Error('Could not locate the VIDEOS array in videos.ts');
  const end = src.indexOf('\n];', start);
  if (end === -1) throw new Error('Could not locate the end of the VIDEOS array');
  const body = src.slice(start, end);

  const idRe = /\n\s*youtubeId: '([^']+)',/g;
  const marks = [];
  let m;
  while ((m = idRe.exec(body))) marks.push({ id: m[1], at: m.index });

  return marks.map((mk, i) => {
    const block = body.slice(mk.at, i + 1 < marks.length ? marks[i + 1].at : body.length);
    const slugM = block.match(/\bslug: '([^']*)'/);
    const titleM = block.match(/title:\s*(['"])((?:\\.|(?!\1)[\s\S])*?)\1/);
    return {
      youtubeId: mk.id,
      slug: slugM ? slugM[1] : null,
      title: titleM ? titleM[2].replace(/\\(['"\\])/g, '$1') : null,
    };
  });
}

function resolveYouTubeId(raw) {
  // Accept a bare id, a youtu.be/… , or a youtube.com/watch?v=… URL.
  const s = String(raw).trim();
  const short = s.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (short) return short[1];
  const long = s.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (long) return long[1];
  if (/^[A-Za-z0-9_-]{6,}$/.test(s)) return s; // looks like a raw id
  return null;
}

// ---- HTTP: never interpolate the URL into an error (it carries ?key=) ----
async function apiFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON (rare) — leave data null, fall through to status */
  }
  if (!res.ok) {
    const msg = data?.error?.message ?? res.statusText ?? `HTTP ${res.status}`;
    const err = new Error(`Gemini API HTTP ${res.status}: ${msg}`);
    err.status = res.status; // so the key-fallback loop can classify it (isKeyRetryable)
    err.apiMessage = msg;
    throw err;
  }
  return { data, headers: res.headers };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MIME_BY_EXT = {
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.wmv': 'video/x-ms-wmv',
  '.3gpp': 'video/3gpp',
};

// Upload a LOCAL file with the resumable File API, then poll until it's ACTIVE (Gemini has to
// finish processing the video before it can be referenced in generateContent).
async function uploadLocalFile(path) {
  const st = statSync(path);
  const mime = MIME_BY_EXT[extname(path).toLowerCase()];
  if (!mime) fail(`unrecognized video extension for "${path}" — supported: ${Object.keys(MIME_BY_EXT).join(', ')}`);
  const sizeMB = (st.size / 1e6).toFixed(1);
  if (!JSON_MODE) console.error(`↑ uploading ${basename(path)} (${sizeMB} MB, ${mime}) to Gemini File API…`);

  // 1) Start a resumable session — the upload URL comes back in a response header.
  const start = await apiFetch(`${UPLOAD_API}/files?key=${currentKey()}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(st.size),
      'X-Goog-Upload-Header-Content-Type': mime,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: basename(path) } }),
  });
  const uploadUrl = start.headers.get('x-goog-upload-url');
  if (!uploadUrl) throw new Error('File API did not return an upload URL (X-Goog-Upload-URL)');

  // 2) Upload the bytes and finalize in one shot.
  const bytes = await readFile(path); // opens + closes internally (no leaked FileHandle)
  const up = await apiFetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Content-Length': String(st.size),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: bytes,
  });
  let file = up.data?.file;
  if (!file?.name) throw new Error('File API upload did not return a file resource');

  // 3) Poll files.get until state === ACTIVE (PROCESSING while Gemini decodes the video).
  let waited = 0;
  while (file.state === 'PROCESSING') {
    if (!JSON_MODE) process.stderr.write(`\r  processing… ${waited}s`);
    await sleep(3000);
    waited += 3;
    const g = await apiFetch(`${API}/${file.name}?key=${currentKey()}`);
    file = g.data;
    if (waited > 600) throw new Error('file stuck in PROCESSING for >10min — giving up');
  }
  if (!JSON_MODE && waited) process.stderr.write('\r  processing… done   \n');
  if (file.state !== 'ACTIVE') throw new Error(`uploaded file is in state ${file.state}, not ACTIVE`);
  return { fileUri: file.uri, mimeType: file.mimeType ?? mime };
}

// ---- the rubric (derived from PLAYBOOK.md) ----
function buildPrompt(label) {
  const rubric = `You are a YouTube retention coach reviewing a MuleSoft / DataWeave developer
tutorial for the channel "ProstDev - Fun MuleSoft Tutorials". The channel is AdSense-monetized, so
the ONLY goal is: more people watching, LONGER. You are WATCHING the actual video — use what you SEE
and HEAR, not just the words. Be specific and honest; this creator wants to fix real problems.

Ground every point in a timestamp (MM:SS). Judge against these levers, in priority order:

1. THE HOOK (first ~10-15s) — HIGHEST leverage. A past video lost ~57% of clickers in 32 seconds.
   Does the open state the surprising result/payoff immediately, or does it warm up (slow intro,
   logo animation, "hey guys, in today's video…")? Call out the exact moment a viewer would bail.
2. RETENTION / PACING — where does it drag? dead air, long silences, repeated info, cursor-hunting,
   reading the screen verbatim, tangents. Name the timestamps most likely to cause drop-off.
3. CODE / SCREEN LEGIBILITY — is the code font big enough to read at mobile size (100-150px)? Is the
   IDE/terminal zoom adequate? Any moment where on-screen text is too small, low-contrast, or the
   important part is off-screen / scrolled past too fast?
4. DELIVERY — filler words (um, uh, like, "so basically"), energy dips, unclear audio, rushed or
   mumbled explanations. Rough count of filler in the first minute if notable.
5. STRUCTURE — are there clear chapters/sections a viewer can self-navigate? Is there a mid-video
   re-hook or does momentum sag? Is the payoff/result delivered clearly at the end?
6. CTA & PACKAGING PROMISE — is there a clear call to action (subscribe / comment / repo link)? Does
   the actual content deliver on what the title/thumbnail implied (no bait-and-switch)?
7. FAIRNESS (comparison videos only) — if tools are compared, is every contestant given a genuine
   win before criticism, and is no MuleSoft/Salesforce-associated tool framed as "the loser"?

${FOCUS ? `EXTRA FOCUS FROM THE CREATOR: ${FOCUS}\n\n` : ''}Return your review as STRICT JSON with this shape (no markdown, no prose outside the JSON):
{
  "summary": "2-3 sentence overall verdict — the single biggest thing to fix.",
  "hook_verdict": "how the first 10-15s lands, and the exact moment a viewer is most likely to bail",
  "estimated_bail_timestamp": "MM:SS — where you'd predict the steepest early drop",
  "findings": [
    { "timestamp": "MM:SS", "category": "hook|pacing|legibility|delivery|structure|cta|fairness",
      "severity": "high|medium|low", "issue": "what's wrong", "fix": "the concrete change to make" }
  ],
  "what_works": ["specific strengths worth keeping, with timestamps where relevant"],
  "top_3_fixes": ["the three highest-leverage changes, most impactful first"]
}

The video under review: ${label}.`;
  return rubric;
}

// Pull the model's text out of a generateContent response, tolerant of shape.
function extractText(resp) {
  const parts = resp?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) return parts.map((p) => p.text ?? '').join('').trim();
  return '';
}

// The model is asked for strict JSON but may wrap it in a ```json fence — strip and parse.
function parseModelJson(text) {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  // Fall back to the outermost {...} if there's leading/trailing chatter.
  if (!t.startsWith('{')) {
    const first = t.indexOf('{');
    const last = t.lastIndexOf('}');
    if (first !== -1 && last > first) t = t.slice(first, last + 1);
  }
  return JSON.parse(t);
}

async function analyze(videoPart, label) {
  if (!JSON_MODE) console.error(`\n⏳ ${MODEL} is watching the video — this can take a minute for a long one…`);
  const body = {
    contents: [{ role: 'user', parts: [videoPart, { text: buildPrompt(label) }] }],
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  };
  const { data } = await apiFetch(`${API}/models/${MODEL}:generateContent?key=${currentKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = extractText(data);
  if (!text) throw new Error('model returned an empty response');
  let review;
  try {
    review = parseModelJson(text);
  } catch {
    // Don't lose the analysis if JSON parsing fails — hand back the raw text.
    review = { summary: '(model did not return valid JSON — raw output below)', raw: text };
  }
  return review;
}

// ---- human report ----
const SEV_ICON = { high: '🔴', medium: '🟡', low: '⚪' };
function printReport(review, label) {
  const line = '─'.repeat(78);
  console.log(`\n${line}\n  VIDEO REVIEW — ${label}\n  model: ${MODEL}\n${line}`);
  if (review.raw) {
    console.log('\n' + review.raw + '\n');
    return;
  }
  if (review.summary) console.log(`\n${review.summary}\n`);
  if (review.hook_verdict) {
    console.log(`🎣 HOOK: ${review.hook_verdict}`);
    if (review.estimated_bail_timestamp) console.log(`   ↳ predicted steepest early drop: ${review.estimated_bail_timestamp}`);
    console.log('');
  }
  if (Array.isArray(review.top_3_fixes) && review.top_3_fixes.length) {
    console.log('⭐ TOP 3 FIXES (most impactful first):');
    review.top_3_fixes.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
    console.log('');
  }
  if (Array.isArray(review.findings) && review.findings.length) {
    console.log(`🔎 FINDINGS (${review.findings.length}):`);
    // High severity first, then medium, then low; keep timestamp order within a tier.
    const order = { high: 0, medium: 1, low: 2 };
    const sorted = [...review.findings].sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3));
    for (const f of sorted) {
      const icon = SEV_ICON[f.severity] ?? '•';
      console.log(`   ${icon} [${f.timestamp ?? '--:--'}] (${f.category ?? '?'}) ${f.issue ?? ''}`);
      if (f.fix) console.log(`       → ${f.fix}`);
    }
    console.log('');
  }
  if (Array.isArray(review.what_works) && review.what_works.length) {
    console.log('✅ WHAT WORKS (keep doing this):');
    review.what_works.forEach((w) => console.log(`   • ${w}`));
    console.log('');
  }
  console.log(`${line}\n  Tip: paste the top fixes into the youtube-growth PLAYBOOK per-video log.\n${line}\n`);
}

// ---- main ----
async function main() {
  const src = readFileSync(VIDEOS_TS, 'utf8');
  let videoPart; // the generateContent `part` referencing the video
  let label; // human label for the report

  // A positional that is a real path on disk → local file. (statSync throws if it doesn't exist.)
  let isLocalPath = false;
  if (POSITIONAL && !/^https?:\/\//.test(POSITIONAL)) {
    try {
      isLocalPath = statSync(POSITIONAL).isFile();
    } catch {
      isLocalPath = false;
    }
  }

  // Resolve the target ONCE (which video, and its human label). For a URL we can also build the
  // videoPart here since it's key-independent; a local file is uploaded PER KEY inside the loop
  // below (an upload is scoped to the key's own project, so a key swap must re-upload).
  if (!isLocalPath) {
    // Resolve a YouTube id from --slug (catalog), --id, or the positional URL/id.
    let ytId = null;
    let title = null;
    if (SLUG) {
      const catalog = parseCatalog(src);
      const hit = catalog.find((v) => v.slug === SLUG);
      if (!hit) fail(`no catalog video with slug "${SLUG}" (check src/data/videos.ts)`);
      ytId = hit.youtubeId;
      title = hit.title;
    } else if (ID) {
      ytId = resolveYouTubeId(ID);
    } else if (POSITIONAL) {
      ytId = resolveYouTubeId(POSITIONAL);
    }
    if (!ytId) {
      fail(
        'no video specified. Pass one of:\n' +
          '  --slug=<catalog-slug>   --id=<youtubeId>   a YouTube URL   or a local file path\n' +
          '  e.g. node scripts/analyze-video.mjs --slug=getting-started-acb-vscode-hello-world',
      );
    }
    // Try to enrich the label with the catalog title if we can find it by id.
    if (!title) {
      const hit = parseCatalog(src).find((v) => v.youtubeId === ytId);
      title = hit?.title ?? null;
    }
    const url = `https://www.youtube.com/watch?v=${ytId}`;
    videoPart = { fileData: { fileUri: url } };
    label = title ? `"${title}" (${url})` : url;
  } else {
    label = `local recording ${basename(POSITIONAL)}`;
  }

  // One attempt = (upload the local file if needed) + analyze, all under currentKey(). On a
  // key-level failure (rate limit / quota / bad key) advance to the next key and retry the WHOLE
  // attempt; any other error surfaces immediately (a second key won't fix a bad request).
  let review;
  for (;;) {
    try {
      if (isLocalPath) {
        const uploaded = await uploadLocalFile(POSITIONAL);
        videoPart = { fileData: { fileUri: uploaded.fileUri, mimeType: uploaded.mimeType } };
      }
      review = await analyze(videoPart, label);
      break;
    } catch (err) {
      const retryable = isKeyRetryable(err.status, err.apiMessage ?? err.message ?? '');
      const hasNext = keyIdx + 1 < API_KEYS.length;
      if (retryable && hasNext) {
        console.error(
          `⚠️  ${keyName(keyIdx)} failed (${err.status ?? '?'}: ${err.apiMessage ?? err.message}).` +
            ` Falling back to ${keyName(keyIdx + 1)}…`,
        );
        keyIdx += 1;
        continue;
      }
      // Out of keys, or a non-key error — give the user an actionable message.
      if (retryable && !hasNext) {
        fail(`all ${API_KEYS.length} key(s) failed. Last error — ${err.message}`);
      }
      throw err;
    }
  }

  if (JSON_MODE) {
    console.log(JSON.stringify({ label, model: MODEL, keyUsed: keyName(keyIdx), review }, null, 2));
  } else {
    printReport(review, label);
  }
}

main().catch((err) => fail(err.message));
