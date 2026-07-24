/**
 * schema.org JSON-LD builders — the one home for structured-data shape.
 *
 * Several routes (post / tag / category) hand-built an identical `BreadcrumbList`,
 * and posts re-typed the same author/publisher entities, tag+category the same
 * `CollectionPage`+`ItemList`. A schema.org tweak meant N synchronized edits, and the
 * boilerplate buried each page's real logic. These builders concentrate that knowledge so
 * a route's frontmatter reads as intent (`buildBreadcrumbList([{ name, url }])`) not plumbing.
 *
 * KEY ORDER IS LOAD-BEARING: `Seo.astro` renders each object via `JSON.stringify`, so the
 * emitted `<script type="application/ld+json">` reflects insertion order verbatim. Every
 * literal below preserves the order the routes emitted before this module existed — the
 * refactor is byte-identical structured data. Divergent entity bodies (`BlogPosting`,
 * `TechArticle`, `FAQPage`) stay inline in their routes: their per-type shape genuinely
 * differs, so folding them behind a builder would relocate quirks, not remove them.
 */
import { SITE } from '@/config';

/** One hop in a breadcrumb trail (the crumbs AFTER the implicit Home root). */
export interface Crumb {
  name: string;
  url: string;
}

/**
 * A `BreadcrumbList` rooted at Home (`SITE.url`), then the given trail. Positions are
 * auto-numbered from 1, so callers pass only the variable crumbs, e.g.
 * `buildBreadcrumbList([{ name: 'Blog', url: `${SITE.url}/blog` }, { name: title, url }])`.
 */
export function buildBreadcrumbList(trail: Crumb[]): Record<string, unknown> {
  const items = [{ name: 'Home', url: SITE.url }, ...trail];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/**
 * The `author` (Person) + `publisher` (Organization) pair shared by the Article schemas.
 * Spread into a `BlogPosting`/`TechArticle` object. `author` defaults to the site owner;
 * posts pass their per-post byline.
 */
export function byline(author: string = SITE.author): {
  author: Record<string, unknown>;
  publisher: Record<string, unknown>;
} {
  return {
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: SITE.name },
  };
}

/** One entry in a collection page's item list. */
export interface ListEntry {
  url: string;
  name: string;
}

/**
 * A `CollectionPage` wrapping an `ItemList` — the tag & category archive schema. `items`
 * are emitted in order as 1-based `ListItem`s.
 */
export function buildItemListPage(opts: {
  name: string;
  description: string;
  url: string;
  items: ListEntry[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: it.url,
        name: it.name,
      })),
    },
  };
}
