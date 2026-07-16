import { describe, it, expect } from 'vitest';
import {
  isScheduled,
  isVideoPublished,
  latestVideos,
  videosInPlaylist,
  playlistNeighbors,
  type Video,
  type CatalogCtx,
} from './videos';

// The catalog helpers read module globals (VIDEOS/LATEST_SLUGS) and the env (isProd) by
// default. Every one takes an optional CatalogCtx so a test can drive the SAME function the
// site runs with a fixture catalog + a frozen `now` + prod:true — the scheduling gate then
// executes on its real call path (the filter-before-slice bug included), not on a copy.

const NOW = new Date('2026-07-16T12:00:00Z');
const PAST = '2026-01-01T00:00:00Z';
const FUTURE = '2026-12-31T00:00:00Z';

function video(slug: string, over: Partial<Video> = {}): Video {
  return {
    youtubeId: `yt-${slug}`,
    slug,
    title: slug,
    description: `${slug} description`,
    playlists: ['fixture-playlist'],
    ...over,
  };
}

describe('isScheduled — the environment-free scheduling fact', () => {
  it('is false when there is no publishedAt (always live)', () => {
    expect(isScheduled(video('no-date'), NOW)).toBe(false);
  });

  it('is false for a past publishedAt', () => {
    expect(isScheduled(video('past', { publishedAt: PAST }), NOW)).toBe(false);
  });

  it('is false at the exact boundary (== now counts as published)', () => {
    expect(isScheduled(video('boundary', { publishedAt: NOW.toISOString() }), NOW)).toBe(false);
  });

  it('is true only for a strictly future publishedAt', () => {
    expect(isScheduled(video('future', { publishedAt: FUTURE }), NOW)).toBe(true);
  });
});

describe('isVideoPublished — the prod policy layered on isScheduled', () => {
  const future = video('future', { publishedAt: FUTURE });

  it('hides a scheduled video in prod', () => {
    expect(isVideoPublished(future, { now: NOW, prod: true })).toBe(false);
  });

  it('shows a scheduled video in dev (nothing gated locally)', () => {
    expect(isVideoPublished(future, { now: NOW, prod: false })).toBe(true);
  });

  it('always shows a video with no publishedAt, even in prod', () => {
    expect(isVideoPublished(video('evergreen'), { now: NOW, prod: true })).toBe(true);
  });
});

describe('latestVideos — filter BEFORE slice (regression: commit 9d29051)', () => {
  // Two of the top three "latest" picks are scheduled. A scheduled pick must be SKIPPED
  // over, not counted against the limit — or it leaves a hole in the homepage grid.
  const fixture: Video[] = [
    video('sched-1', { publishedAt: FUTURE }),
    video('live-1', { publishedAt: PAST }),
    video('sched-2', { publishedAt: FUTURE }),
    video('live-2', { publishedAt: PAST }),
    video('live-3', { publishedAt: PAST }),
    video('live-4', { publishedAt: PAST }),
    video('live-5', { publishedAt: PAST }),
  ];
  const slugs = fixture.map((v) => v.slug);
  const ctx: CatalogCtx = { videos: fixture, slugs, now: NOW, prod: true };

  it('fills the full limit with real videos when scheduled picks sit near the top', () => {
    const latest = latestVideos(4, ctx);
    expect(latest).toHaveLength(4);
    expect(latest.map((v) => v.slug)).toEqual(['live-1', 'live-2', 'live-3', 'live-4']);
  });

  it('never returns a scheduled video', () => {
    expect(latestVideos(6, ctx).every((v) => !isScheduled(v, NOW))).toBe(true);
  });

  it('in dev, scheduled picks are shown (no gating) and DO occupy slots', () => {
    const latest = latestVideos(4, { ...ctx, prod: false });
    expect(latest.map((v) => v.slug)).toEqual(['sched-1', 'live-1', 'sched-2', 'live-2']);
  });
});

describe('videosInPlaylist + playlistNeighbors — the gate reaches the pager', () => {
  const fixture: Video[] = [
    video('a', { playlists: ['p'], publishedAt: PAST }),
    video('b', { playlists: ['p'], publishedAt: FUTURE }), // scheduled — hidden in prod
    video('c', { playlists: ['p'], publishedAt: PAST }),
  ];
  const ctx: CatalogCtx = { videos: fixture, now: NOW, prod: true };

  it('omits scheduled videos from a playlist listing in prod', () => {
    expect(videosInPlaylist('p', ctx).map((v) => v.slug)).toEqual(['a', 'c']);
  });

  it('prev/next skip over a scheduled entry (no scheduled neighbor surfaces)', () => {
    // With 'b' hidden, 'a' and 'c' are adjacent — a's next is c, not the scheduled b.
    const { next } = playlistNeighbors('p', 'a', ctx);
    expect(next?.slug).toBe('c');
    expect(next && isScheduled(next, NOW)).toBeFalsy();
  });
});
