import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, TAGS } from '@/content.config';
import type { Series } from '@/data/series';

const isProd = import.meta.env.PROD;

/**
 * All blog posts a build should expose, newest first.
 *
 * PROD gate = two levers:
 *   - `draft: true`        → "not ready", never built.
 *   - `pubDate` in the FUTURE → SCHEDULED: committed & pushed now, but produces no page,
 *     no RSS/llms/sitemap entry until a build runs AT OR AFTER that instant. `pubDate` is
 *     `z.coerce.date()`, so a full ISO datetime works ('2026-07-21T18:00:00Z'), not just a
 *     bare date. Pair with the cron rebuild in .github/workflows/deploy.yml so the reveal
 *     happens automatically (see the video twin gate `isVideoPublished` in src/data/videos.ts).
 * In DEV (`npm run dev`) nothing is gated, so you can preview scheduled/draft posts locally.
 */
export async function getPosts(): Promise<CollectionEntry<'blog'>[]> {
  const now = new Date();
  const posts = await getCollection('blog', ({ data }) =>
    isProd ? data.draft !== true && data.pubDate <= now : true
  );
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

/** Unique sorted tag list across posts. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

/** Category list with post counts, in CATEGORIES declaration order (stable UI, not alpha). */
export async function getCategories(): Promise<{ category: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.data.category, (counts.get(p.data.category) ?? 0) + 1);
  return CATEGORIES.map((category) => ({ category, count: counts.get(category) ?? 0 })).filter(
    (c) => c.count > 0
  );
}

/** Posts carrying a given tag (display form), newest first (getPosts order preserved). */
export async function getPostsByTag(tag: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPosts();
  return posts.filter((p) => (p.data.tags as readonly string[]).includes(tag));
}

/** Posts in a given category, newest first. */
export async function getPostsByCategory(category: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.data.category === category);
}

/**
 * URL-safe slug for a tag: lowercase, collapse any run of non-alphanumerics to a single hyphen,
 * trim hyphens. e.g. 'CI/CD' → 'ci-cd', 'Anypoint Studio' → 'anypoint-studio', 'cURL' → 'curl'.
 */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// slug → display map, built once from the canonical TAGS list (slugify is lossy, so we reverse
// via a lookup). Import-time guard: two canonical tags must never slug to the same value — if a
// future tag collides, fail the build loudly here rather than silently dropping a tag page.
const SLUG_TO_TAG: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const tag of TAGS) {
    const slug = tagSlug(tag);
    if (map.has(slug)) {
      throw new Error(
        `Tag slug collision: "${tag}" and "${map.get(slug)}" both slugify to "${slug}". ` +
          `Rename one in TAGS (src/content.config.ts).`
      );
    }
    map.set(slug, tag);
  }
  return map;
})();

/** Reverse a tag slug back to its canonical display form, or undefined if unknown. */
export function tagFromSlug(slug: string): string | undefined {
  return SLUG_TO_TAG.get(slug);
}

/** Archive URL for a tag. */
export function tagUrl(tag: string): string {
  return `/tag/${tagSlug(tag)}`;
}

/** Archive URL for a category (lowercased, e.g. 'Tutorials' → '/category/tutorials'). */
export function categoryUrl(category: string): string {
  return `/category/${category.toLowerCase()}`;
}

export function postUrl(id: string): string {
  return `/post/${id}`;
}

/** All non-draft (in prod) skills, ordered alphabetically by title. */
export async function getSkills(): Promise<CollectionEntry<'skills'>[]> {
  const skills = await getCollection('skills', ({ data }) =>
    isProd ? data.draft !== true : true
  );
  return skills.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export function skillUrl(id: string): string {
  return `/skill/${id}`;
}

/**
 * Resolve a series' registry slugs to renderable parts {slug, title, position, isCurrent},
 * pulling each post's display title from the blog collection at build time (the registry in
 * src/data/series.ts stores only slugs, so titles never drift). Throws — naming the slug + series
 * id — if a registry slug has no matching post, the existence check the import-time guard in
 * series.ts can't do without collection access. `position` is 1-based.
 */
export async function getSeriesParts(
  series: Series,
  currentSlug: string
): Promise<{ slug: string; title: string; position: number; isCurrent: boolean }[]> {
  const all = await getCollection('blog');
  const byId = new Map(all.map((p) => [p.id, p]));
  return series.posts.map((slug, i) => {
    const post = byId.get(slug);
    if (!post) {
      throw new Error(
        `Series "${series.id}" references unknown post slug "${slug}" ` +
          `(src/data/series.ts). No src/content/blog/${slug}.mdx found.`
      );
    }
    return {
      slug,
      title: post.data.title,
      position: i + 1,
      isCurrent: slug === currentSlug,
    };
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    // pubDate is parsed as UTC midnight (bare YYYY-MM-DD via z.coerce.date());
    // render in UTC so the displayed day matches the date in frontmatter / the
    // live site, regardless of the build machine's timezone.
    timeZone: 'UTC',
  });
}

/** Rough reading time from raw markdown body. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min read`;
}
