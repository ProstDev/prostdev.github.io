import { describe, it, expect, vi } from 'vitest';

// Stub the two Astro-only imports that content.ts pulls in transitively, so this pure
// data helper can be unit-tested off the build:
//   - astro:content — content.ts calls getCollection('blog', …). Return [] posts so the
//     calendar's VIDEO branch is what we assert. (The article branch is exercised elsewhere.)
//   - @/content.config — only CATEGORIES/TAGS are used, and only by OTHER helpers; stub it so
//     the real config's zod schema + glob loader don't evaluate at import time.
vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => []),
}));
vi.mock('@/content.config', () => ({ CATEGORIES: [], TAGS: [] }));

import { upcomingCalendarItems } from './content';
import { VIDEOS, isScheduled } from '@/data/videos';

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
