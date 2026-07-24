import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scheduledPostSlugs, postSlugFromUrl } from './scheduled-slugs.mjs';

// This helper is LOAD-BEARING: astro.config.mjs uses it to keep scheduled posts' teaser URLs out
// of the sitemap, which is what lets the deploy guard fire the pubDate reveal (see the file header
// + .github/workflows/deploy.yml). These tests pin that contract against a temp fixture dir.

const NOW = new Date('2026-07-20T00:00:00Z');
let dir: string;

const write = (name: string, fm: string) =>
  fs.writeFileSync(path.join(dir, name), `---\n${fm}\n---\n\nBody.\n`, 'utf-8');

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scheduled-slugs-'));
  write('future.mdx', 'title: Future\npubDate: 2999-01-01'); // scheduled
  write('future-timed.md', 'title: Timed\npubDate: 2026-07-20T18:00:00Z'); // scheduled (later today)
  write('past.mdx', 'title: Past\npubDate: 2000-01-01'); // published
  write('boundary.mdx', 'title: Boundary\npubDate: 2026-07-20T00:00:00Z'); // == now → NOT scheduled
  write('future-draft.mdx', 'title: Draft\npubDate: 2999-01-01\ndraft: true'); // draft → never
  fs.writeFileSync(path.join(dir, 'notes.txt'), 'ignored', 'utf-8'); // non-md → skipped
  // Odd-but-valid content the fn must SKIP rather than throw on (see the "never throws" test).
  fs.writeFileSync(path.join(dir, 'no-frontmatter.md'), 'Just a body, no --- block.\n', 'utf-8');
  fs.writeFileSync(path.join(dir, 'empty-frontmatter.mdx'), '---\n---\n\nBody.\n', 'utf-8'); // yaml → undefined
  write('no-pubdate.md', 'title: No Date'); // frontmatter but no pubDate key
});

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('scheduledPostSlugs — exactly the future-dated, non-draft posts', () => {
  it('returns only future-dated non-draft slugs (both .md and .mdx)', () => {
    const got = scheduledPostSlugs(NOW, dir);
    expect([...got].sort()).toEqual(['future', 'future-timed']);
  });

  it('excludes past-dated, the exact boundary, drafts, and non-markdown files', () => {
    const got = scheduledPostSlugs(NOW, dir);
    expect(got.has('past')).toBe(false);
    expect(got.has('boundary')).toBe(false); // pubDate == now publishes (matches getPosts `<= now`)
    expect(got.has('future-draft')).toBe(false);
    expect(got.has('notes')).toBe(false);
  });

  it('SKIPS (never throws on) odd-but-valid files: no frontmatter, empty frontmatter, no pubDate', () => {
    // This fn runs at astro.config.mjs LOAD, so an unhandled throw here kills the whole
    // test→build→deploy chain — not just this feature. A malformed-but-parseable post must be
    // silently skipped, not fatal. (Genuinely INVALID yaml still throws — that's fail-closed and
    // Astro's own loader rejects it too; see the add-tests note.)
    const got = scheduledPostSlugs(NOW, dir);
    expect(got.has('no-frontmatter')).toBe(false);
    expect(got.has('empty-frontmatter')).toBe(false);
    expect(got.has('no-pubdate')).toBe(false);
    // and the good one still comes through, proving the skips didn't abort the scan early:
    expect(got.has('future')).toBe(true);
  });

  it('the invariant the cron reveal depends on: a scheduled slug LEAVES the set once now passes it', () => {
    // Before its date → scheduled (out of sitemap). After → not scheduled (enters sitemap →
    // built ≠ live → deploy). This is the exact property that swaps the teaser to the full post.
    expect(scheduledPostSlugs(NOW, dir).has('future')).toBe(true);
    const after = new Date('2999-06-01T00:00:00Z');
    expect(scheduledPostSlugs(after, dir).has('future')).toBe(false);
  });
});

describe('postSlugFromUrl — extract a /post/<slug> from a sitemap URL', () => {
  it('returns the slug with or without a trailing slash', () => {
    expect(postSlugFromUrl('https://prostdev.com/post/my-post')).toBe('my-post');
    expect(postSlugFromUrl('https://prostdev.com/post/my-post/')).toBe('my-post');
  });

  it('returns null for non-post URLs (home, blog, category, video)', () => {
    expect(postSlugFromUrl('https://prostdev.com/')).toBeNull();
    expect(postSlugFromUrl('https://prostdev.com/blog/')).toBeNull();
    expect(postSlugFromUrl('https://prostdev.com/category/tutorials/')).toBeNull();
    expect(postSlugFromUrl('https://prostdev.com/video/some-video')).toBeNull();
  });

  it('is anchored to the LAST segment: a nested path or a bare /post/ is null, not a slug', () => {
    // The regex ends `([^/]+)\/?$`, so the slug must be the final segment — a single-segment id,
    // which every blog id is (flat filenames from the glob loader). Pins that `/post/` alone
    // yields null (no empty-string slug) and a deeper path doesn't capture the wrong segment.
    expect(postSlugFromUrl('https://prostdev.com/post/')).toBeNull();
    expect(postSlugFromUrl('https://prostdev.com/post/a/b')).toBeNull(); // not `a`
  });

  it('KNOWN LIMITATION: `/post/` mid-path false-matches (harmless — the site emits no such URL)', () => {
    // Documenting, not endorsing: the pattern isn't origin-anchored, so a URL that merely CONTAINS
    // /post/<x> as its tail matches. The sitemap only ever emits real /post/<slug> + /blog, /video,
    // /category, /tag, root — none nest `/post/` — so this can't fire in practice. If a future route
    // ever ends in `/post/<x>`, tighten the anchor here.
    expect(postSlugFromUrl('https://prostdev.com/blog/post/x')).toBe('x');
  });

  it('the sitemap filter contract: scheduled post URL is dropped, published + non-post kept', () => {
    const scheduled = scheduledPostSlugs(NOW, dir);
    const keep = (url: string) => {
      const slug = postSlugFromUrl(url);
      return !(slug && scheduled.has(slug));
    };
    expect(keep('https://prostdev.com/post/future')).toBe(false); // scheduled → dropped
    expect(keep('https://prostdev.com/post/past')).toBe(true); // published → kept
    expect(keep('https://prostdev.com/')).toBe(true); // home → kept
    expect(keep('https://prostdev.com/video/future')).toBe(true); // not a post → kept
  });
});
