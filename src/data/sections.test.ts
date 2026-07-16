import { describe, it, expect } from 'vitest';
import { SECTIONS, resolveBlock, getSection, sectionHref } from './sections';
import { getPlaylist, videosInPlaylist, type Playlist } from './videos';

// sections.ts is pure config + lookups over the real catalog (it imports ./videos with no Astro
// stubs — the catalog test proves that resolves cleanly). These pin the build-guard throw, the
// slug lookups, and the OWNING-section rule that a secondary block must still link to its page.

describe('resolveBlock', () => {
  it('resolves a real block to its Playlist + gate-respecting videos', () => {
    const resolved = resolveBlock({ playlistId: 'learn-acb' });
    expect(resolved.playlist.id).toBe('learn-acb');
    expect(resolved.videos).toEqual(videosInPlaylist('learn-acb'));
  });

  it('throws the named build guard on an unknown playlistId', () => {
    expect(() => resolveBlock({ playlistId: 'does-not-exist' })).toThrow(
      /unknown playlistId 'does-not-exist'/,
    );
  });
});

describe('getSection', () => {
  it('finds a section by its page slug', () => {
    expect(getSection('learn-acb')?.slug).toBe('learn-acb');
  });

  it('returns undefined for an unknown slug', () => {
    expect(getSection('nope')).toBeUndefined();
  });
});

describe('sectionHref', () => {
  it("maps a section's own playlist to its page", () => {
    expect(sectionHref(getPlaylist('learn-acb')!)).toBe('/learn-acb');
  });

  it('resolves a secondary-block playlist to its OWNING section, not a page of its own', () => {
    // mulesoft-ai-2025 renders only as the second block on /mulesoft-ai — it has no page itself.
    expect(sectionHref(getPlaylist('mulesoft-ai-2025')!)).toBe('/mulesoft-ai');
  });

  it('returns undefined for a playlist no section renders', () => {
    const orphan = { id: 'not-in-any-section' } as Playlist;
    expect(sectionHref(orphan)).toBeUndefined();
  });
});

describe('SECTIONS config invariants', () => {
  it('has a unique slug per section', () => {
    const slugs = SECTIONS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
