/**
 * Build-time Open Graph card generation.
 *
 * The site is static (GitHub Pages, no runtime), so we render social-share PNGs during
 * `astro build` inside `.png.ts` endpoints with @vercel/og's `ImageResponse` (Satori + resvg).
 * This module is the single source of truth: it loads the bundled Inter fonts once, exposes
 * image-loading helpers, and builds the shared card element tree.
 *
 * Satori does NOT run React — it accepts a plain element-tree object literal
 * (`{ type, props: { style, children } }`), so endpoints stay `.ts` (no JSX/React dependency).
 * Notable Satori limits this design works around:
 *   - no `filter: blur()` → we darken the hero with a linear-gradient scrim instead;
 *   - fonts must be passed explicitly as TTF/OTF buffers (not woff2);
 *   - background images must be embedded bytes (a `data:` URI), not a bare path.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from '@vercel/og';

// --- Brand palette (mirrors the cyan/violet tokens in src/styles/global.css) ---
const BRAND_DEEP = '#0b3a52'; // deep base behind the gradient
const BRAND_500 = '#1593cc';
const BRAND_300 = '#54c8ee';
const VIOLET = '#7c5cff'; // far stop of the signature cyan→violet brand gradient
// Deep-space starfield backdrop — the brand's "launch into MuleSoft" motif.
const STARFIELD = `linear-gradient(160deg, #050d17 0%, ${BRAND_DEEP} 70%, #123a63 100%)`;

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// --- Fonts: read the bundled static Inter TTFs once and reuse across every render in the build ---
let fontCache: { name: string; data: Buffer; weight: 400 | 800; style: 'normal' }[] | null = null;

export function loadFonts() {
  if (!fontCache) {
    // Resolve from the project root (process.cwd() during `astro build`), NOT import.meta.url —
    // the endpoint runs from dist/pages/** where a relative ../assets path no longer points at src.
    const read = (file: string) => fs.readFileSync(path.resolve(process.cwd(), 'src/assets/fonts', file));
    fontCache = [
      { name: 'Inter', data: read('Inter-Regular.ttf'), weight: 400, style: 'normal' },
      { name: 'Inter', data: read('Inter-ExtraBold.ttf'), weight: 800, style: 'normal' },
    ];
  }
  return fontCache;
}

const MIME: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif' };

// The ProstDev rocket logo, read once and reused across every card render in the build.
let logoCache: string | null | undefined;

export function loadLogo(): string | null {
  if (logoCache === undefined) {
    logoCache = loadLocalImage(path.resolve(process.cwd(), 'public/logo.png'));
  }
  return logoCache;
}

/** Read a local image file and return a base64 `data:` URI Satori can embed, or null if unreadable. */
export function loadLocalImage(absPath: string): string | null {
  try {
    const ext = absPath.split('.').pop()?.toLowerCase() ?? '';
    const mime = MIME[ext];
    if (!mime) return null;
    const bytes = fs.readFileSync(absPath);
    return `data:${mime};base64,${bytes.toString('base64')}`;
  } catch {
    return null;
  }
}

/** Fetch a remote image (e.g. a YouTube thumbnail) and return a `data:` URI, or null on failure. */
export async function fetchRemoteImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const mime = res.headers.get('content-type') ?? 'image/jpeg';
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

/**
 * Resolve a post's hero image to a `data:` URI by reading its source `.mdx` frontmatter.
 * `data.heroImage` is an `ImageMetadata` (hashed `.src`), not a disk path — so we read the raw
 * `heroImage: ../../assets/blog/<name>.<ext>` line and resolve it against the post file on disk.
 */
export function loadPostHero(filePath: string): string | null {
  try {
    // post.filePath is relative to the project root (e.g. src/content/blog/<slug>.mdx) — anchor it.
    const postAbs = path.resolve(process.cwd(), filePath);
    const src = fs.readFileSync(postAbs, 'utf-8');
    const m = src.match(/^heroImage:\s*(\S+)\s*$/m);
    if (!m) return null;
    const heroAbs = path.resolve(path.dirname(postAbs), m[1]);
    return loadLocalImage(heroAbs);
  } catch {
    return null;
  }
}

// --- Card layout constants (see card() below) ---
const PAD_Y = 54;
const CONTENT_H = OG_HEIGHT - 2 * PAD_Y; // 522 — the vertical band the hero card + text column fill
const RING = 10; // cyan→violet gradient ring thickness around the hero card

/** A deterministic starfield layer (real positioned dots — Satori won't tile radial-gradients). */
function starLayer(count = 44) {
  const stars: any[] = [];
  for (let i = 0; i < count; i++) {
    const x = (i * 173 + 37) % OG_WIDTH;
    const y = (i * 97 + 53) % OG_HEIGHT;
    const s = 2 + (i % 4);
    stars.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          left: x,
          top: y,
          width: s,
          height: s,
          borderRadius: 9999,
          backgroundColor: i % 5 === 0 ? BRAND_300 : '#ffffff',
          opacity: 0.5 + (i % 3) * 0.2,
        },
      },
    });
  }
  return stars;
}

/** Brand wordmark: rocket logo + `ProstDev` (cyan) `.com` (white). The ONLY place the logo appears. */
function wordmark(logo: string | null) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 34 },
      children: [
        logo ? { type: 'img', props: { src: logo, width: 52, height: 52, style: { width: 52, height: 52 } } } : null,
        {
          type: 'div',
          props: {
            style: { display: 'flex', fontWeight: 800 },
            children: [
              { type: 'span', props: { style: { color: BRAND_300 }, children: 'ProstDev' } },
              { type: 'span', props: { style: { color: '#ffffff' }, children: '.com' } },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

/**
 * Build the shared OG card element tree — ProstDev's "launch into MuleSoft" identity: a deep-space
 * starfield backdrop, the post's hero image in a cyan→violet gradient-ring card (when present), a
 * big white title, and the rocket wordmark. The title is vertically centered in its column and the
 * wordmark is bottom-aligned to the hero card's bottom edge.
 * @param title Large headline (post title / site tagline). Clamped for very long strings.
 * @param bg    Optional hero image `data:` URI. With it → ring-card split; without → full-width title.
 */
export function card({ title, bg }: { title: string; bg?: string | null }) {
  // Safety net for runaway titles: Satori line-clamps below, but cap the string too.
  const safeTitle = title.length > 120 ? `${title.slice(0, 117)}…` : title;
  const logo = loadLogo();

  // Pick the LARGEST font that still fits: Satori has no text-measurement API at build time, so we
  // estimate the wrapped line count from the title length and column width. Bold Inter averages
  // ~0.58em/glyph, and because words can't split mid-wrap a line rarely fills completely — so we
  // discount effective capacity by ~12% and round up. This deliberately OVER-estimates lines so the
  // chosen font never clips (better a touch small than a cut-off last line). Tuned against the real
  // catalog (titles run 20–119 chars).
  const fitFontSize = (width: number, maxHeight: number, sizes: number[]) => {
    const len = safeTitle.length;
    for (const fs of sizes) {
      const charsPerLine = Math.max(1, Math.floor((width / (fs * 0.58)) * 0.88));
      const lines = Math.ceil(len / charsPerLine);
      if (lines * fs * 1.1 <= maxHeight) return fs;
    }
    return sizes[sizes.length - 1];
  };

  // A very long title can't breathe in the narrow left column beside the hero — past this length we
  // drop the hero and give the headline the full 1000px width instead (verified: the catalog runs to
  // ~119 chars, and titles over ~95 hit the font floor in the split layout).
  const showHero = bg && safeTitle.length <= 95;

  const frameChildren: any[] = [
    { type: 'div', props: { style: { position: 'absolute', top: 0, left: 0, width: OG_WIDTH, height: OG_HEIGHT, backgroundImage: STARFIELD } } },
    ...starLayer(),
  ];

  if (showHero) {
    // --- With a hero: title (centered) + wordmark (bottom) on the left, ring hero card on the right ---
    const cardImgH = CONTENT_H - 2 * RING; // inner image height so the ring wrapper == CONTENT_H
    frameChildren.push({
      type: 'div',
      props: {
        style: { position: 'relative', display: 'flex', alignItems: 'flex-start', width: '100%', height: '100%', padding: `${PAD_Y}px 56px`, color: '#ffffff' },
        children: [
          {
            type: 'div',
            props: {
              // Title vertically centered; wordmark pinned to the bottom (== hero card bottom edge).
              style: { position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 560, height: CONTENT_H },
              children: [
                (() => {
                  // Left column is 560px wide; reserve the bottom band for the wordmark so a tall
                  // centered title clears it (CONTENT_H minus ~2× the wordmark zone).
                  const budget = CONTENT_H - 160;
                  const fs = fitFontSize(560, budget, [64, 60, 56, 52, 48, 44]);
                  return { type: 'div', props: { style: { display: 'flex', fontSize: fs, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1, maxHeight: budget, overflow: 'hidden' }, children: safeTitle } };
                })(),
                { type: 'div', props: { style: { position: 'absolute', left: 0, bottom: 0, display: 'flex' }, children: [wordmark(logo)] } },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1, height: CONTENT_H, alignItems: 'center', justifyContent: 'flex-end' },
              children: [
                {
                  // Gradient ring wrapper (padding = ring thickness) around the hero card.
                  type: 'div',
                  props: {
                    style: { display: 'flex', padding: RING, borderRadius: 30 + RING, backgroundImage: `linear-gradient(135deg, ${BRAND_300} 0%, ${VIOLET} 100%)` },
                    children: [
                      { type: 'img', props: { src: bg, width: 462, height: cardImgH, style: { width: 462, height: cardImgH, objectFit: 'cover', borderRadius: 30 } } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    });
  } else {
    // --- No hero (default card / posts missing a hero): full-width centered title + bottom wordmark ---
    frameChildren.push({
      type: 'div',
      props: {
        style: { position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: '64px 72px', color: '#ffffff' },
        children: [
          (() => {
            // Full width (maxWidth 1000); the title is centered, so cap its height well short of the
            // frame to keep clearance above the bottom wordmark on the longest (5-line) titles.
            const fs = fitFontSize(1000, 360, [76, 72, 68, 64, 60, 56, 52]);
            return { type: 'div', props: { style: { display: 'flex', fontSize: fs, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1, maxHeight: 360, overflow: 'hidden', maxWidth: 1000 }, children: safeTitle } };
          })(),
          { type: 'div', props: { style: { position: 'absolute', left: 72, bottom: 64, display: 'flex' }, children: [wordmark(logo)] } },
        ],
      },
    });
  }

  return {
    type: 'div',
    props: {
      style: { display: 'flex', position: 'relative', width: OG_WIDTH, height: OG_HEIGHT, backgroundColor: BRAND_DEEP, fontFamily: 'Inter' },
      children: frameChildren,
    },
  };
}

/**
 * The homepage / fallback OG card: a centered brand cover — the rocket logo + big `ProstDev.com`
 * wordmark, with the tagline as a smaller subheading beneath it. Distinct from card() (which fronts
 * a specific post/video title); this one sells the brand itself, so it's kept separate and the
 * per-post/per-video cards are untouched.
 * @param tagline Small subheading under the wordmark.
 */
export function defaultCard({ tagline }: { tagline: string }) {
  const logo = loadLogo();
  return {
    type: 'div',
    props: {
      style: { display: 'flex', position: 'relative', width: OG_WIDTH, height: OG_HEIGHT, backgroundColor: BRAND_DEEP, fontFamily: 'Inter' },
      children: [
        { type: 'div', props: { style: { position: 'absolute', top: 0, left: 0, width: OG_WIDTH, height: OG_HEIGHT, backgroundImage: STARFIELD } } },
        ...starLayer(),
        {
          type: 'div',
          props: {
            style: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '64px 72px', color: '#ffffff' },
            children: [
              {
                // Big brand wordmark: rocket logo + `ProstDev` (cyan) `.com` (white).
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: 28, fontSize: 128, fontWeight: 800, letterSpacing: -3 },
                  children: [
                    logo ? { type: 'img', props: { src: logo, width: 132, height: 132, style: { width: 132, height: 132 } } } : null,
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex' },
                        children: [
                          { type: 'span', props: { style: { color: BRAND_300 }, children: 'ProstDev' } },
                          { type: 'span', props: { style: { color: '#ffffff' }, children: '.com' } },
                        ],
                      },
                    },
                  ].filter(Boolean),
                },
              },
              {
                // Tagline subheading.
                type: 'div',
                props: {
                  style: { display: 'flex', marginTop: 28, fontSize: 48, fontWeight: 400, color: '#ffffff', letterSpacing: -0.5 },
                  children: tagline,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

/**
 * Build a "bare" card: a full-bleed background image with NO title or wordmark overlay.
 * Used for videos, whose YouTube thumbnails ALREADY bake in their own title + branding — overlaying
 * our card's title on top produced unreadable text-on-text. The image is `objectFit: cover`'d to the
 * 1200×630 OG frame (a 16:9 thumbnail loses ~22px top/bottom, keeping its centered title + face).
 * Falls back to the branded `card()` when the image is missing.
 */
export function bareImageCard({ title, bg }: { title: string; bg?: string | null }) {
  if (!bg) return card({ title, bg });
  return {
    type: 'div',
    props: {
      style: { display: 'flex', width: OG_WIDTH, height: OG_HEIGHT, backgroundColor: BRAND_DEEP },
      children: [
        {
          type: 'img',
          props: {
            src: bg,
            width: OG_WIDTH,
            height: OG_HEIGHT,
            style: { width: OG_WIDTH, height: OG_HEIGHT, objectFit: 'cover' },
          },
        },
      ],
    },
  };
}

/** Render a card element tree to a 1200×630 PNG `ImageResponse` (a `Response` subclass). */
export function renderCard(element: ReturnType<typeof card> | ReturnType<typeof bareImageCard> | ReturnType<typeof defaultCard>): ImageResponse {
  return new ImageResponse(element as any, { width: OG_WIDTH, height: OG_HEIGHT, fonts: loadFonts() });
}
