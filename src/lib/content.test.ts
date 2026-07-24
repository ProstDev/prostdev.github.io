import { describe, it, expect, vi, afterEach } from 'vitest';

// Stub the two Astro-only imports that content.ts pulls in transitively, so this pure
// data helper can be unit-tested off the build:
//   - astro:content — content.ts calls getCollection('blog', filter). The mock APPLIES the filter
//     callback to `blogFixtures` (default [] → the calendar tests below see no posts, unchanged),
//     so getPosts/getRenderablePosts can be exercised on real fixtures. Referenced lazily (only
//     when getCollection is invoked at test time, after `blogFixtures` is assigned) — no TDZ.
//   - @/content.config — only CATEGORIES/TAGS are used, and only by OTHER helpers; stub it so
//     the real config's zod schema + glob loader don't evaluate at import time.
let blogFixtures: any[] = [];
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (_name: string, filter?: (e: any) => boolean) =>
    filter ? blogFixtures.filter(filter) : blogFixtures.slice()
  ),
}));
vi.mock('@/content.config', () => ({ CATEGORIES: [], TAGS: [] }));

import { upcomingCalendarItems, isPostScheduled } from './content';
import { VIDEOS, isScheduled } from '@/data/videos';

/** Minimal blog entry shape the pure helpers read (id + data.pubDate + data.draft). */
const makePost = (id: string, iso: string, draft = false): any => ({
  id,
  data: { pubDate: new Date(iso), draft },
});

describe('upcomingCalendarItems — never drifts from the scheduling gate', () => {
  // The bug class this whole seam guards against: the calendar hand-copied the "is it in the
  // future?" comparison instead of sharing it. This pins the property that made drift possible —
  // for the same `now`, a video is in the calendar's upcoming set IFF isScheduled says so.
  const now = new Date('2020-01-01T00:00:00Z'); // before every real publishedAt → all scheduled

  it('the upcoming VIDEO set equals the isScheduled set for the same now', async () => {
    const items = await upcomingCalendarItems(now);
    const videoIds = items
      .filter((i) => i.kind === 'video')
      .map((i) => i.url.replace('https://www.youtube.com/watch?v=', ''))
      .sort();
    const scheduledIds = VIDEOS.filter((v) => isScheduled(v, now))
      .map((v) => v.youtubeId)
      .sort();
    expect(videoIds).toEqual(scheduledIds);
  });

  it('excludes everything once now is past all publish instants', async () => {
    const far = new Date('2999-01-01T00:00:00Z');
    const items = await upcomingCalendarItems(far);
    expect(items.filter((i) => i.kind === 'video')).toHaveLength(0);
  });

  it('is sorted soonest-first', async () => {
    const items = await upcomingCalendarItems(now);
    const times = items.map((i) => i.date.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });
});

describe('isPostScheduled — the future-date fact (twin of video isScheduled)', () => {
  const now = new Date('2026-07-20T00:00:00Z');

  it('is false for a past pubDate', () => {
    expect(isPostScheduled(makePost('p', '2026-07-19T00:00:00Z'), now)).toBe(false);
  });

  it('is false at the exact boundary (pubDate == now) — published, not scheduled', () => {
    // Mirrors the getPosts gate `pubDate <= now`: at the instant it's due, it publishes.
    expect(isPostScheduled(makePost('p', '2026-07-20T00:00:00Z'), now)).toBe(false);
  });

  it('is true for a strictly-future pubDate', () => {
    expect(isPostScheduled(makePost('p', '2026-07-21T00:00:00Z'), now)).toBe(true);
  });

  it('reports purely on date — a future-dated DRAFT is still "scheduled" by this predicate', () => {
    // draft is a separate lever; getRenderablePosts excludes drafts, not this fact.
    expect(isPostScheduled(makePost('p', '2999-01-01T00:00:00Z', true), now)).toBe(true);
  });
});

describe('getRenderablePosts — pages set = published + scheduled, minus drafts (prod)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  // Fixtures use far-past / far-future dates so the wall-clock comparison inside getPosts is
  // deterministic regardless of when the suite runs. getPosts/getRenderablePosts read
  // import.meta.env.PROD at module load, so force it via stubEnv + resetModules + dynamic import.
  const fixtures = () => [
    makePost('past', '2000-01-01T00:00:00Z'),
    makePost('future', '2999-01-01T00:00:00Z'),
    makePost('future-draft', '2999-01-01T00:00:00Z', true),
    makePost('past-draft', '2000-01-01T00:00:00Z', true),
  ];

  it('in PROD includes past + future non-draft, excludes both drafts', async () => {
    vi.stubEnv('PROD', true);
    vi.resetModules();
    blogFixtures = fixtures();
    const { getRenderablePosts } = await import('./content');
    const ids = (await getRenderablePosts()).map((p) => p.id).sort();
    expect(ids).toEqual(['future', 'past']);
  });

  it('in PROD differs from getPosts by exactly the scheduled (future non-draft) post', async () => {
    vi.stubEnv('PROD', true);
    vi.resetModules();
    blogFixtures = fixtures();
    const mod = await import('./content');
    const published = (await mod.getPosts()).map((p) => p.id).sort();
    const renderable = (await mod.getRenderablePosts()).map((p) => p.id).sort();
    expect(published).toEqual(['past']); // getPosts hides the future one
    expect(renderable).toEqual(['future', 'past']); // getRenderablePosts keeps it (as a teaser)
  });

  it('returns newest-first', async () => {
    vi.stubEnv('PROD', true);
    vi.resetModules();
    blogFixtures = fixtures();
    const { getRenderablePosts } = await import('./content');
    const ids = (await getRenderablePosts()).map((p) => p.id);
    expect(ids).toEqual(['future', 'past']); // 2999 before 2000
  });

  it('in DEV is ungated — everything (drafts + future) shows, the SAME set as getPosts', async () => {
    // Both gates are `isProd ? … : true`, so locally a scheduled OR draft post previews and the
    // two seams AGREE. Pins that the teaser work didn't accidentally start gating dev — the exact
    // regression that would make `npm run dev` hide a post you're still writing.
    vi.stubEnv('PROD', false);
    vi.resetModules();
    blogFixtures = fixtures();
    const mod = await import('./content');
    const renderable = (await mod.getRenderablePosts()).map((p) => p.id).sort();
    const published = (await mod.getPosts()).map((p) => p.id).sort();
    const all = ['future', 'future-draft', 'past', 'past-draft'];
    expect(renderable).toEqual(all); // nothing gated
    expect(published).toEqual(all); // getPosts is also ungated in dev
    expect(renderable).toEqual(published); // …so the two sets are identical locally
  });
});
