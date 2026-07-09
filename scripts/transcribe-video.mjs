#!/usr/bin/env node
// Transcribes a LOCAL video/audio file into text using whisper.cpp, entirely on-device — no API,
// no upload, no key. This is the raw-transcript companion to `analyze-video.mjs` (which sends the
// video to Gemini): use this to get a first-draft transcript of an UNPUBLISHED recording BEFORE it
// hits YouTube (so you don't have to wait for YouTube's auto-captions), then clean it into the
// ProstDev sectioned house style per `.claude/docs/transcript-cleaning.md` (or hand it to the
// `transcript-cleaner` subagent).
//
// WHY whisper.cpp (and not Gemini here): transcription is a solved, cheap, offline task. whisper.cpp
// runs locally on Apple Silicon in seconds for a short clip, has no rate limit / quota, and the
// audio never leaves the machine. Gemini's value is WATCHING (frames/pacing/legibility) — different
// job, different tool. (Note: Gemini 2.5 Pro is NOT on the free tier — analyze-video defaults to
// Flash; see .env.example.)
//
// It shells out to two Homebrew tools — install once:
//   brew install ffmpeg whisper-cpp
// ffmpeg extracts a 16 kHz mono WAV (what whisper wants); whisper-cli does the transcription. The
// model file is downloaded to scripts/.whisper-models/ on first run and reused after.
//
// Usage:
//   node scripts/transcribe-video.mjs ./my-recording.mp4          # → prints transcript, writes .txt next to it
//   node scripts/transcribe-video.mjs ./clip.mov --model=small.en # bigger model = more accurate, slower
//   node scripts/transcribe-video.mjs ./clip.mp4 --out=/tmp/t.txt # choose the output path
//   node scripts/transcribe-video.mjs ./clip.mp4 --vtt            # also emit a timestamped .vtt (chapter hunting)
//   node scripts/transcribe-video.mjs ./clip.mp4 --keep-wav       # keep the extracted WAV
//
// Models (English-only .en are faster/enough for a clean screencast; drop the .en for multilingual):
//   tiny.en (~75MB, fastest) · base.en (~140MB, DEFAULT, good) · small.en (~460MB) · medium.en (~1.5GB)
//
// Output is a LIGHTLY-cleaned transcript (whisper's per-line breaks joined into paragraphs), NOT the
// final article — it still needs the domain fix-dictionary + `###` sectioning pass. Exit 0 on
// success; exit 2 on a missing tool / bad file / download or transcription failure.

import { existsSync, mkdirSync, statSync, renameSync, rmSync, createWriteStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename, extname, resolve } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODEL_DIR = join(ROOT, 'scripts', '.whisper-models');
const MODEL_BASE_URL = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main';

// ---- flags ----
const argv = process.argv.slice(2);
const getOpt = (name, dflt) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : dflt;
};
const has = (name) => argv.includes(`--${name}`);
const POSITIONAL = argv.find((a) => !a.startsWith('--'));
const MODEL = getOpt('model', 'base.en');
const WANT_VTT = has('vtt');
const KEEP_WAV = has('keep-wav');

function fail(msg) {
  console.error(`transcribe-video: ${msg}`);
  process.exit(2);
}

// Resolve a Homebrew-installed binary; PATH in a spawned shell may not include /opt/homebrew/bin.
function findBin(name) {
  for (const p of [`/opt/homebrew/bin/${name}`, `/usr/local/bin/${name}`, name]) {
    const r = spawnSync(p, ['--version'], { encoding: 'utf8' });
    if (r.status === 0 || r.stdout || r.stderr) return p; // exists (some print version to stderr)
  }
  return null;
}

function run(bin, args, label) {
  const r = spawnSync(bin, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (r.error) fail(`${label} failed to launch: ${r.error.message}`);
  if (r.status !== 0) fail(`${label} exited ${r.status}: ${(r.stderr || r.stdout || '').trim().slice(-500)}`);
  return r;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const total = Number(res.headers.get('content-length')) || 0;
  let seen = 0;
  const out = createWriteStream(dest);
  const reader = res.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out.write(value);
    seen += value.length;
    if (total) process.stderr.write(`\r  downloading model… ${((seen / total) * 100).toFixed(0)}%`);
  }
  out.end();
  await new Promise((r) => out.on('close', r));
  process.stderr.write('\r  downloading model… done   \n');
}

async function ensureModel() {
  if (!existsSync(MODEL_DIR)) mkdirSync(MODEL_DIR, { recursive: true });
  const file = `ggml-${MODEL}.bin`;
  const path = join(MODEL_DIR, file);
  if (existsSync(path) && statSync(path).size > 1e6) return path;
  console.error(`↓ model ${MODEL} not cached — fetching ${file}…`);
  try {
    await download(`${MODEL_BASE_URL}/${file}`, path);
  } catch (e) {
    try { rmSync(path); } catch {}
    fail(`could not download model "${MODEL}" — ${e.message}\n  Valid: tiny.en, base.en, small.en, medium.en, large-v3 (drop .en for multilingual).`);
  }
  return path;
}

// whisper.cpp emits one line per caption segment. Join them back into readable paragraphs: a blank
// line stays a paragraph break; consecutive non-empty lines are joined with spaces. This is the
// LIGHT clean — the domain fix-dictionary + `###` sectioning is still a separate human/agent pass.
function paragraphize(txt) {
  const lines = txt.split('\n').map((l) => l.trim());
  const out = [];
  let buf = [];
  const flush = () => { if (buf.length) { out.push(buf.join(' ')); buf = []; } };
  for (const l of lines) {
    if (!l) flush();
    else buf.push(l);
  }
  flush();
  return out.join('\n\n').replace(/[ \t]+/g, ' ').trim() + '\n';
}

async function main() {
  if (!POSITIONAL) {
    fail('no input file. Usage: node scripts/transcribe-video.mjs <video-or-audio-file> [--model=base.en] [--vtt]');
  }
  const input = resolve(POSITIONAL);
  if (!existsSync(input) || !statSync(input).isFile()) fail(`not a file: ${input}`);

  const ffmpeg = findBin('ffmpeg');
  if (!ffmpeg) fail('ffmpeg not found. Install it:  brew install ffmpeg');
  const whisper = findBin('whisper-cli');
  if (!whisper) fail('whisper-cli not found. Install it:  brew install whisper-cpp');

  const modelPath = await ensureModel();

  // 1) Extract 16 kHz mono WAV (whisper's expected input).
  const stem = basename(input, extname(input));
  const wav = join(dirname(input), `${stem}.whisper.wav`);
  console.error(`↑ extracting audio from ${basename(input)}…`);
  run(ffmpeg, ['-y', '-i', input, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav], 'ffmpeg');

  // 2) Transcribe. whisper-cli writes <outPrefix>.txt (and .vtt with -ovtt).
  const outPrefix = join(dirname(input), `${stem}.transcribe`);
  console.error(`⏳ whisper (${MODEL}) transcribing…`);
  const wargs = ['-m', modelPath, '-f', wav, '-otxt', '-of', outPrefix, '-np'];
  if (WANT_VTT) wargs.splice(2, 0, '-ovtt');
  run(whisper, wargs, 'whisper-cli');

  const rawTxt = await readFile(`${outPrefix}.txt`, 'utf8');
  const cleaned = paragraphize(rawTxt);

  // 3) Write the cleaned transcript.
  const outPath = getOpt('out', join(dirname(input), `${stem}.transcript.txt`));
  await writeFile(outPath, cleaned);
  try { rmSync(`${outPrefix}.txt`); } catch {}
  if (!KEEP_WAV) { try { rmSync(wav); } catch {} }

  console.error(`✅ wrote ${outPath}` + (WANT_VTT ? ` and ${outPrefix}.vtt` : ''));
  console.error(
    '   Next: clean into ProstDev `###` sections per .claude/docs/transcript-cleaning.md\n' +
      '   (or hand it to the transcript-cleaner subagent), then save as\n' +
      '   src/content/transcripts/<youtubeId>.md once the video is published.',
  );
  process.stdout.write(cleaned);
}

main().catch((e) => fail(e.message));
