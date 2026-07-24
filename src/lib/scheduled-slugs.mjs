// Config-safe (plain .mjs, NO `astro:content`) list of SCHEDULED post slugs, read from raw
// frontmatter on disk. astro.config.mjs's sitemap `filter` uses it to EXCLUDE scheduled posts'
// teaser URLs from the sitemap — which is load-bearing: the deploy guard (.github/workflows/
// deploy.yml) skips a scheduled rebuild when the built sitemap equals the live one, so if a
// teaser URL leaked into the sitemap it would already be "live" and the post's reveal at pubDate
// would never trigger a deploy. Keeping teasers OUT restores the guard's invariant ("a reveal only
// ever ADDS a URL"). Mirrors the raw-frontmatter read in src/lib/og-image.ts (loadPostHero) and the
// scheduling gate in src/lib/content.ts (getPosts / getRenderablePosts). `js-yaml` is a dep already.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

/**
 * Slugs of posts that are SCHEDULED — `draft !== true` AND `pubDate > now` — read from raw
 * frontmatter. A scheduled post builds a `noindex` teaser page (see getRenderablePosts) but must
 * stay out of the sitemap until it reveals. `dir` is injectable for tests.
 * @param {Date} now
 * @param {string} dir  blog content dir, relative to cwd
 * @returns {Set<string>} scheduled post slugs (filename without extension)
 */
export function scheduledPostSlugs(now = new Date(), dir = 'src/content/blog') {
  const out = new Set();
  const abs = path.resolve(process.cwd(), dir);
  for (const file of fs.readdirSync(abs)) {
    if (!/\.mdx?$/.test(file)) continue;
    const src = fs.readFileSync(path.join(abs, file), 'utf-8');
    const m = src.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const fm = yaml.load(m[1]) ?? {};
    if (fm.draft === true) continue;
    if (fm.pubDate && new Date(fm.pubDate) > now) out.add(file.replace(/\.mdx?$/, ''));
  }
  return out;
}

/**
 * Extract the post slug from a sitemap URL like `https://prostdev.com/post/<slug>` (with or without
 * a trailing slash), or `null` for any non-post URL (home, /blog, /category/*, /video/*, …).
 * @param {string} url
 * @returns {string | null}
 */
export function postSlugFromUrl(url) {
  return url.match(/\/post\/([^/]+)\/?$/)?.[1] ?? null;
}
