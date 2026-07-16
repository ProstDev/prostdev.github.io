/**
 * Section pages for ProstDev.
 *
 * A SECTION is a curated landing page (e.g. /learn-acb) composed of one or more
 * PLAYLIST blocks. It is PRESENTATION: the catalog facts (title, description,
 * playlistUrl) live on the Playlist in `videos.ts`; a Section only adds the page
 * slug, an optional SEO title, and a per-block intro `hook`.
 *
 * HOW TO ADD / CHANGE A SECTION PAGE:
 *   1. Add or edit a Section below. `slug` is the flat top-level URL (/<slug>).
 *      Each block names a `playlistId` from PLAYLISTS + an optional `hook`.
 *   2. That's it — `src/pages/[section].astro` renders every entry here, and
 *      `sectionHref` derives heading/breadcrumb links from it. No page file to
 *      create, no slug list to keep in sync.
 *
 * RENDERING (see [section].astro): the FIRST block is the page's <h1> with no
 * divider; each later block is an <h2> in a top-bordered divider. Heading level
 * and divider are derived from block position — don't put them in the config.
 *
 * A playlist may appear as a block in a section OTHER than its own slug (e.g.
 * `mulesoft-ai-2025` is the secondary block on /mulesoft-ai). `sectionHref`
 * resolves any such playlist to its OWNING section, so its videos' breadcrumbs
 * and the /videos row heading point at the page that actually renders it.
 */

import { getPlaylist, videosInPlaylist, type Playlist, type Video } from './videos';

export interface SectionBlock {
  /** A playlist id from PLAYLISTS. Its title/description/playlistUrl are the catalog source of truth. */
  playlistId: string;
  /** Optional intro paragraph shown above the grid (the "Ready to move beyond Studio?" line). */
  hook?: string;
}

export interface Section {
  /** Flat top-level page slug → /<slug>. Also the value video breadcrumbs resolve to. */
  slug: string;
  /**
   * Document <title> override. When omitted, falls back to the first block's
   * playlist.title (the visible <h1>). Set it only where the SEO title differs
   * from the heading.
   */
  seoTitle?: string;
  /** One or more playlist blocks, rendered top-to-bottom. */
  blocks: SectionBlock[];
}

export const SECTIONS: Section[] = [
  {
    slug: 'mulesoft-from-start',
    seoTitle: "MuleSoft from Start: A Beginner's Guide",
    blocks: [
      {
        playlistId: 'mulesoft-from-start',
        hook: 'New to MuleSoft? This beginner-friendly series is the perfect place to start.',
      },
    ],
  },
  {
    slug: 'learn-acb',
    seoTitle: 'Learn Anypoint Code Builder (ACB)',
    blocks: [
      {
        playlistId: 'learn-acb',
        hook: 'Ready to move beyond Anypoint Studio?',
      },
    ],
  },
  {
    slug: 'mulesoft-ai',
    blocks: [
      {
        playlistId: 'ai-showdown',
        hook: 'New episodes as I test more AI coding tools against real MuleSoft work. 🚀',
      },
      {
        playlistId: 'mulesoft-ai-2025',
        hook: "Looking for the 2025 series? Here's the full Adventures in MuleSoft + AI playlist.",
      },
    ],
  },
  {
    slug: 'curietech',
    seoTitle: 'From Zero to API with CurieTech AI',
    blocks: [
      {
        playlistId: 'curietech',
        hook: 'In this step-by-step series, we go from absolutely nothing to a fully functional MuleSoft API — with the help of CurieTech AI and Anypoint Code Builder (ACB).',
      },
    ],
  },
  {
    slug: 'cicd-github-actions',
    seoTitle: 'MuleSoft CI/CD with GitHub Actions',
    blocks: [
      {
        playlistId: 'cicd-github-actions',
        hook: 'Automate your MuleSoft deployments from a single git push.',
      },
    ],
  },
  {
    slug: 'datacloud-mulesoft',
    seoTitle: 'Data Cloud + MuleSoft Integration',
    blocks: [
      {
        playlistId: 'datacloud-mulesoft',
        hook: 'Connect Salesforce Data Cloud to MuleSoft, end to end.',
      },
    ],
  },
  {
    slug: 'dataweave-challenges',
    seoTitle: 'DataWeave Challenges',
    blocks: [
      {
        playlistId: 'dataweave-challenges',
        hook: 'Sharpen your DataWeave skills, one puzzle at a time.',
      },
    ],
  },
  {
    slug: 'getting-to-the-point',
    seoTitle: 'Getting to the Point: Quick MuleSoft & DataWeave Tips',
    blocks: [
      {
        playlistId: 'getting-to-the-point',
        hook: 'Quick MuleSoft and DataWeave answers, each in under 30 seconds.',
      },
    ],
  },
  {
    slug: 'other-videos',
    seoTitle: 'Other MuleSoft & DataWeave Videos',
    blocks: [
      {
        playlistId: 'other-videos',
        hook: "One-off tutorials and tips that don't fit a series — but are worth a watch.",
      },
    ],
  },
];

/** A block with its playlist + videos resolved. `videos` respects the scheduling gate. */
export interface ResolvedBlock extends SectionBlock {
  playlist: Playlist;
  videos: Video[];
}

/**
 * Resolve a block's `playlistId` to its Playlist + published videos. Throws a
 * named error (mirroring the old `getPlaylist('x')!`, but readable) if the id is
 * unknown — so a config typo fails the build loudly instead of at a bare `!`.
 */
export function resolveBlock(block: SectionBlock): ResolvedBlock {
  const playlist = getPlaylist(block.playlistId);
  if (!playlist) {
    throw new Error(
      `SECTIONS: block references unknown playlistId '${block.playlistId}'. ` +
        `Add it to PLAYLISTS in src/data/videos.ts or fix the id in src/data/sections.ts.`,
    );
  }
  return { ...block, playlist, videos: videosInPlaylist(block.playlistId) };
}

/** Look up a Section by its page slug. */
export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug);
}

/** playlist id -> the Section that renders it (first section wins if ever shared). */
const SECTION_BY_PLAYLIST_ID = new Map<string, Section>();
for (const section of SECTIONS) {
  for (const block of section.blocks) {
    if (!SECTION_BY_PLAYLIST_ID.has(block.playlistId)) {
      SECTION_BY_PLAYLIST_ID.set(block.playlistId, section);
    }
  }
}

/**
 * Section-page href for a playlist's heading/breadcrumb link, or undefined if no
 * section renders it. Resolves to the OWNING section — a playlist shown only as a
 * secondary block (e.g. mulesoft-ai-2025) links to that section's page, not to a
 * page of its own (which may not exist).
 */
export function sectionHref(playlist: Playlist): string | undefined {
  const section = SECTION_BY_PLAYLIST_ID.get(playlist.id);
  return section ? `/${section.slug}` : undefined;
}
