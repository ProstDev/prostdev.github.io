import { describe, it, expect } from 'vitest';
import { buildBreadcrumbList, byline, buildItemListPage } from './jsonld';
import { SITE } from '@/config';

// These builders concentrate structured-data shape whose KEY ORDER is load-bearing (Seo.astro
// emits them via JSON.stringify verbatim). The invariants worth pinning are the ones a route
// used to hand-maintain and could silently break: the auto-numbered 1-based positions, the
// implicit Home root, and order preservation.

describe('buildBreadcrumbList', () => {
  it('prepends an implicit Home root at SITE.url, then the trail, positioned 1-based', () => {
    const out = buildBreadcrumbList([
      { name: 'Blog', url: `${SITE.url}/blog` },
      { name: 'A Post', url: `${SITE.url}/post/a` },
    ]);
    expect(out['@context']).toBe('https://schema.org');
    expect(out['@type']).toBe('BreadcrumbList');
    expect(out.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog` },
      { '@type': 'ListItem', position: 3, name: 'A Post', item: `${SITE.url}/post/a` },
    ]);
  });

  it('emits just the Home crumb for an empty trail', () => {
    const out = buildBreadcrumbList([]);
    expect(out.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
    ]);
  });
});

describe('byline', () => {
  it('defaults the author to the site owner and always publishes as the org', () => {
    const out = byline();
    expect(out.author).toEqual({ '@type': 'Person', name: SITE.author });
    expect(out.publisher).toEqual({ '@type': 'Organization', name: SITE.name });
  });

  it('uses a per-post byline when given one', () => {
    expect(byline('Guest Writer').author).toEqual({
      '@type': 'Person',
      name: 'Guest Writer',
    });
  });
});

describe('buildItemListPage', () => {
  it('wraps an ItemList in a CollectionPage with 1-based ListItems in input order', () => {
    const out = buildItemListPage({
      name: 'Tag: DataWeave',
      description: 'Posts tagged DataWeave.',
      url: `${SITE.url}/tag/dataweave`,
      items: [
        { name: 'First', url: `${SITE.url}/post/first` },
        { name: 'Second', url: `${SITE.url}/post/second` },
      ],
    });
    expect(out['@context']).toBe('https://schema.org');
    expect(out['@type']).toBe('CollectionPage');
    expect(out.name).toBe('Tag: DataWeave');
    expect(out.description).toBe('Posts tagged DataWeave.');
    expect(out.url).toBe(`${SITE.url}/tag/dataweave`);
    expect(out.mainEntity).toEqual({
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, url: `${SITE.url}/post/first`, name: 'First' },
        { '@type': 'ListItem', position: 2, url: `${SITE.url}/post/second`, name: 'Second' },
      ],
    });
  });

  it('emits an empty ItemList for no items', () => {
    const out = buildItemListPage({
      name: 'Empty',
      description: 'Nothing here.',
      url: `${SITE.url}/tag/empty`,
      items: [],
    });
    expect((out.mainEntity as Record<string, unknown>).itemListElement).toEqual([]);
  });
});
