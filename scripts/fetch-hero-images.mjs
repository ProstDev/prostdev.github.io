#!/usr/bin/env node
// Fetch hero images for blog posts from the old Wix site into src/assets/blog/.
//
// Why this exists: the `wix-post-migrator` subagent intentionally skips images
// (it only notes the source URL), so migrated posts land without a hero. This
// script closes that gap. It is idempotent and safe to re-run as more posts are
// migrated.
//
// How it works:
//   1. Scrape the Wix blog index (/blog, /blog/page/2 … until an empty page).
//      Each post card contains BOTH the /post/{slug} link and that post's
//      static.wixstatic.com image — verified that the card image media-id equals
//      the post's hero image media-id. So one fetch per index page maps every
//      slug to its image; no need to fetch all ~170 post pages.
//   2. Download the FULL-RES original (strip Wix's /v1/fill/... transform) to
//      src/assets/blog/{slug}.{ext}. Skips files that already exist (unless --force).
//   3. For each already-migrated src/content/blog/{slug}.mdx that has NO heroImage,
//      insert `heroImage: ../../assets/blog/{slug}.{ext}` into its frontmatter.
//
// Usage:
//   node scripts/fetch-hero-images.mjs            # download missing, wire MDX
//   node scripts/fetch-hero-images.mjs --force    # re-download even if file exists
//   node scripts/fetch-hero-images.mjs --no-mdx   # download only, don't touch MDX
//   node scripts/fetch-hero-images.mjs --dry-run  # report what it would do, write nothing

import { mkdir, readFile, readdir, writeFile, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ASSETS_DIR = join(ROOT, 'src/assets/blog');
const BLOG_DIR = join(ROOT, 'src/content/blog');

const SITE = 'https://www.prostdev.com';
const MEDIA_BASE = 'https://static.wixstatic.com/media/';
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const MAX_PAGES = 30; // safety cap; loop stops earlier on an empty page
const DELAY_MS = 200; // be polite between requests

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const NO_MDX = args.has('--no-mdx');
const DRY_RUN = args.has('--dry-run');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// Extract a slug -> {mediaId, ext} map from a single Wix blog index page.
// In each post card the image markup comes BEFORE the /post/{slug} link, so we
// pair every post link with the nearest blog image (e0d344_) preceding it. (A
// naive split-on-link is off-by-one — it grabs the next card's image and leaves
// the last card with none.)
function parseIndexPage(html) {
  const found = new Map();
  // All blog content images, in document order. e0d344_ is the blog media prefix
  // (11062b_ is header/footer social icons — excluded by the prefix filter).
  const imgRe = /static\.wixstatic\.com\/media\/(e0d344_[a-f0-9]+~mv2\.(png|jpe?g|webp))/gi;
  const imgs = [];
  let m;
  while ((m = imgRe.exec(html))) imgs.push({ pos: m.index, mediaId: m[1], ext: normExt(m[2]) });

  const linkRe = /href="https:\/\/www\.prostdev\.com\/post\/([a-z0-9-]+)"/g;
  while ((m = linkRe.exec(html))) {
    const slug = m[1];
    if (found.has(slug)) continue; // first occurrence wins
    // Nearest image whose position precedes this link.
    let best = null;
    for (const im of imgs) {
      if (im.pos < m.index) best = im;
      else break;
    }
    if (!best) continue;
    found.set(slug, { mediaId: best.mediaId, ext: best.ext });
  }
  return found;
}

function normExt(ext) {
  const e = ext.toLowerCase();
  return e === 'jpeg' ? 'jpg' : e;
}

async function collectSlugMap() {
  const map = new Map();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = page === 1 ? `${SITE}/blog` : `${SITE}/blog/page/${page}`;
    let html;
    try {
      html = await fetchText(url);
    } catch (err) {
      // A 404 here just means we walked past the last page.
      console.log(`  page ${page}: stop (${err.message})`);
      break;
    }
    const pageMap = parseIndexPage(html);
    if (pageMap.size === 0) {
      console.log(`  page ${page}: 0 posts — stopping`);
      break;
    }
    let added = 0;
    for (const [slug, info] of pageMap) {
      if (!map.has(slug)) {
        map.set(slug, info);
        added++;
      }
    }
    console.log(`  page ${page}: ${pageMap.size} cards, ${added} new (total ${map.size})`);
    await sleep(DELAY_MS);
  }
  return map;
}

async function downloadImage(mediaId, destPath) {
  // Full-res original: the bare media URL with no /v1/fill/... transform.
  const url = MEDIA_BASE + mediaId;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(`non-image content-type: ${ct}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!DRY_RUN) await writeFile(destPath, buf);
  return buf.length;
}

// Insert a heroImage line into an MDX frontmatter block if absent.
// Returns 'added' | 'has-hero' | 'no-frontmatter' | 'no-image'.
async function wireHeroImage(slug, ext, downloadedSlugs) {
  const mdxPath = join(BLOG_DIR, `${slug}.mdx`);
  if (!existsSync(mdxPath)) return 'no-mdx-file';
  if (!downloadedSlugs.has(slug)) return 'no-image';
  const src = await readFile(mdxPath, 'utf8');
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return 'no-frontmatter';
  if (/^heroImage:/m.test(fm[1])) return 'has-hero';
  const line = `heroImage: ../../assets/blog/${slug}.${ext}`;
  // Insert just before the closing --- of the frontmatter block.
  const closeIdx = src.indexOf('\n---', fm.index + 3);
  const updated = src.slice(0, closeIdx) + `\n${line}` + src.slice(closeIdx);
  if (!DRY_RUN) await writeFile(mdxPath, updated);
  return 'added';
}

async function main() {
  console.log(`ProstDev hero-image fetcher${DRY_RUN ? ' (DRY RUN)' : ''}\n`);
  await mkdir(ASSETS_DIR, { recursive: true });

  console.log('1. Scraping Wix blog index for slug → image map…');
  const slugMap = await collectSlugMap();
  console.log(`   → ${slugMap.size} slugs with images found\n`);

  console.log('2. Downloading full-res hero images…');
  const downloaded = new Set();
  const skipped = [];
  const failed = [];
  for (const [slug, { mediaId, ext }] of slugMap) {
    const dest = join(ASSETS_DIR, `${slug}.${ext}`);
    if (!FORCE && existsSync(dest)) {
      skipped.push(slug);
      downloaded.add(slug); // already present → eligible for MDX wiring
      continue;
    }
    try {
      const bytes = await downloadImage(mediaId, dest);
      downloaded.add(slug);
      console.log(`   ✓ ${slug}.${ext} (${(bytes / 1024).toFixed(0)} KB)`);
      await sleep(DELAY_MS);
    } catch (err) {
      failed.push({ slug, reason: err.message });
      console.log(`   ✗ ${slug}: ${err.message}`);
    }
  }

  let mdxAdded = 0;
  const mdxOther = {};
  if (!NO_MDX) {
    console.log('\n3. Wiring heroImage into migrated MDX (where missing)…');
    for (const [slug, { ext }] of slugMap) {
      const result = await wireHeroImage(slug, ext, downloaded);
      if (result === 'added') {
        mdxAdded++;
        console.log(`   + ${slug}.mdx`);
      } else {
        mdxOther[result] = (mdxOther[result] || 0) + 1;
      }
    }
  }

  console.log('\n── Summary ──────────────────────────────────');
  console.log(`Slugs found in index : ${slugMap.size}`);
  console.log(`Downloaded           : ${downloaded.size - skipped.length}`);
  console.log(`Skipped (existing)   : ${skipped.length}`);
  console.log(`Failed               : ${failed.length}`);
  if (failed.length) {
    for (const f of failed) console.log(`   - ${f.slug}: ${f.reason}`);
  }
  if (!NO_MDX) {
    console.log(`MDX heroImage added  : ${mdxAdded}`);
    const detail = Object.entries(mdxOther)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
    if (detail) console.log(`MDX skipped          : ${detail}`);
  }
  if (DRY_RUN) console.log('\n(DRY RUN — no files were written)');
}

main().catch((err) => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
