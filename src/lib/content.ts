import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, TAGS } from '@/content.config';
import type { Series } from '@/data/series';
import { VIDEOS, watchUrl, isScheduled } from '@/data/videos';

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

/**
 * The scheduling FACT for a post, environment-free: is its `pubDate` still in the future relative
 * to `now`? Twin of `isScheduled()` for videos (src/data/videos.ts). `draft` is a SEPARATE lever
 * ("never build"), not "scheduled" — so this reports ONLY the future-date embargo. The prod publish
 * gate (getPosts, `pubDate <= now`) is the exact complement of this predicate, and the config-time
 * sitemap reader (scheduled-slugs.mjs) mirrors it from raw frontmatter (astro.config.mjs can't import
 * astro:content). All three agree except for a post crossing pubDate DURING a build — its own build's
 * `new Date()` snapshots differ by ms — which only ever leaves a just-published post briefly absent
 * from the sitemap (never a teaser IN it), and self-heals on the next 15-min cron build.
 */
export function isPostScheduled(
  post: CollectionEntry<'blog'>,
  now: Date = new Date()
): boolean {
  return post.data.pubDate > now;
}

/**
 * Posts a build should RENDER AS PAGES — the published set (getPosts) PLUS scheduled (future-dated,
 * non-draft) posts. A scheduled post builds a `noindex` "coming soon" TEASER at `/post/<slug>` (+
 * its `/og/post/<slug>.png` card) so a link shared before publish returns 200 with the correct OG
 * preview (LinkedIn caches it once; the body later swaps to the full article at the SAME URL — no
 * re-scrape needed). Used ONLY by the page + OG-image getStaticPaths (post/[slug].astro,
 * og/post/[slug].png.ts). Everything that LISTS or FEEDS posts (blog index, homepage, RSS, sitemap,
 * llms, `.md`, tag/category) keeps calling getPosts(), so teasers never leak into those. `draft:true`
 * is still excluded (never built). This is getPosts() minus the `pubDate <= now` clause; in DEV
 * nothing is gated, so it returns the same set as getPosts().
 */
export async function getRenderablePosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) =>
    isProd ? data.draft !== true : true
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

/**
 * One entry in the content calendar (the .ics feed + the /calendar page consume this).
 * `companion` is set on a video whose article ships alongside it, carrying that article's
 * title + URL so the event can link straight to it — without emitting a second, near-
 * duplicate entry.
 */
export interface CalendarItem {
  kind: 'video' | 'article';
  title: string;
  description: string;
  /** When it publishes (the scheduling instant). */
  date: Date;
  /** Whether `date` carried a time (timed event) or was a bare YYYY-MM-DD (all-day). */
  dateOnly: boolean;
  /** Where the event points: the YouTube watch page for videos, the post URL for articles. */
  url: string;
  /** For a video: the companion article publishing with it (title + on-site URL), if any. */
  companion?: { title: string; url: string };
}

/**
 * Upcoming content for the calendar — the deliberate INVERSE of the prod publish gates:
 * `getPosts()` and `publishedVideos()` HIDE future-dated content, but a calendar wants
 * exactly that future set. So this reads the RAW blog collection + RAW VIDEOS array and
 * keeps only entries whose publish instant is still ahead of `now`.
 *
 * Scope (decided with Alex, July 2026): every upcoming VIDEO, plus every upcoming ARTICLE
 * that has NO companion video. A post carrying a `youtubeId` is a companion — it's folded
 * into its video's entry (as `companion`) instead of getting its own, so a video + its
 * write-up don't show as two near-identical events on the same day. Sorted soonest-first.
 */
export async function upcomingCalendarItems(now: Date = new Date()): Promise<CalendarItem[]> {
  // Raw collection — NOT getPosts() (which gates out the future we want here).
  const posts = await getCollection('blog', ({ data }) => data.draft !== true);

  // Map youtubeId -> the scheduled companion post's title + URL, so a video entry can
  // link straight to its write-up.
  const companionByVideoId = new Map<string, { title: string; url: string }>();
  for (const p of posts) {
    if (p.data.youtubeId && p.data.pubDate > now) {
      companionByVideoId.set(p.data.youtubeId, { title: p.data.title, url: postUrl(p.id) });
    }
  }

  const items: CalendarItem[] = [];

  for (const v of VIDEOS) {
    // Same scheduling FACT as the prod publish gate — via the shared seam, so the two can't
    // drift. The calendar wants the INVERSE of what a prod build shows: keep only the scheduled
    // (future-dated) videos, and (unlike isVideoPublished) regardless of prod/dev.
    if (!isScheduled(v, now)) continue;
    items.push({
      kind: 'video',
      title: v.title,
      description: v.description,
      date: new Date(v.publishedAt),
      dateOnly: /^\d{4}-\d{2}-\d{2}$/.test(v.publishedAt),
      url: watchUrl(v.youtubeId),
      companion: companionByVideoId.get(v.youtubeId),
    });
  }

  for (const p of posts) {
    if (p.data.pubDate <= now) continue;
    if (p.data.youtubeId) continue; // companion — folded into its video's entry above
    items.push({
      kind: 'article',
      title: p.data.title,
      description: p.data.description,
      date: p.data.pubDate,
      // z.coerce.date() drops the original string, so we infer all-day from the instant:
      // a bare YYYY-MM-DD post lands at UTC midnight; a timed ISO datetime won't.
      dateOnly: p.data.pubDate.getUTCHours() === 0 && p.data.pubDate.getUTCMinutes() === 0,
      url: postUrl(p.id),
    });
  }

  return items.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Rough reading time from raw markdown body. */
export function readingTime(body: string | undefined): string {
  const words = (body ?? '').trim().split(/\s+/).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min read`;
}
