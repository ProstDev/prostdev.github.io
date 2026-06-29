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

// --- Brand palette (mirrors the cyan tokens in src/styles/global.css) ---
const BRAND_DEEP = '#0b3a52'; // deep base behind the gradient
const BRAND_500 = '#1593cc';
const BRAND_300 = '#54c8ee';
const SCRIM = 'linear-gradient(180deg, rgba(8,30,42,0.48) 0%, rgba(8,30,42,0.86) 60%, rgba(8,30,42,0.97) 100%)';

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

/**
 * Build the shared OG card element tree.
 * @param title   Large headline (post/video title). Clamped for very long strings.
 * @param eyebrow Small uppercase kicker above the title (category / section / tagline).
 * @param bg      Optional background image `data:` URI; falls back to a brand gradient.
 */
export function card({ title, eyebrow, bg }: { title: string; eyebrow: string; bg?: string | null }) {
  // Safety net for runaway titles: Satori line-clamps below, but cap the string too.
  const safeTitle = title.length > 120 ? `${title.slice(0, 117)}…` : title;
  const logo = loadLogo();

  const layers: any[] = [];

  if (bg) {
    layers.push({
      type: 'img',
      props: {
        src: bg,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        style: { position: 'absolute', top: 0, left: 0, width: OG_WIDTH, height: OG_HEIGHT, objectFit: 'cover' },
      },
    });
  }

  // Dark gradient scrim for text contrast (Satori has no blur).
  layers.push({
    type: 'div',
    props: { style: { position: 'absolute', top: 0, left: 0, width: OG_WIDTH, height: OG_HEIGHT, backgroundImage: SCRIM } },
  });

  // Foreground content column.
  layers.push({
    type: 'div',
    props: {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '64px 72px',
        color: '#ffffff',
      },
      children: [
        // Eyebrow — a solid cyan pill so the kicker stays legible over ANY background (busy
        // thumbnail or plain gradient), echoing the site's category/tag chips. `alignSelf:
        // flex-start` shrinks the pill to its text instead of stretching the full width.
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignSelf: 'flex-start',
              backgroundColor: BRAND_300,
              color: BRAND_DEEP,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '10px 24px',
              borderRadius: 9999,
            },
            children: eyebrow,
          },
        },
        // Title (clamped to ~4 lines)
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -1,
              maxHeight: 4 * 68 * 1.1,
              overflow: 'hidden',
              // Lift the title off busy thumbnails (faces, title-card lettering) on top of the scrim.
              textShadow: '0 2px 12px rgba(0,0,0,0.75)',
            },
            children: safeTitle,
          },
        },
        // Footer: brand logo + wordmark — `ProstDev` in the cyan brand accent, `.com` white.
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 16, fontSize: 34 },
            children: [
              logo
                ? { type: 'img', props: { src: logo, width: 52, height: 52, style: { width: 52, height: 52 } } }
                : null,
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
        },
      ],
    },
  });

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        position: 'relative',
        width: OG_WIDTH,
        height: OG_HEIGHT,
        backgroundColor: BRAND_DEEP,
        fontFamily: 'Inter',
      },
      children: layers,
    },
  };
}

/**
 * Build a "bare" card: a full-bleed background image with NO scrim, eyebrow, title, or wordmark.
 * Used for videos, whose YouTube thumbnails ALREADY bake in their own title + branding — overlaying
 * our card's title on top produced unreadable text-on-text. The image is `objectFit: cover`'d to the
 * 1200×630 OG frame (a 16:9 thumbnail loses ~22px top/bottom, keeping its centered title + face).
 * Falls back to the branded gradient `card()` when the image is missing.
 */
export function bareImageCard({ title, eyebrow, bg }: { title: string; eyebrow: string; bg?: string | null }) {
  if (!bg) return card({ title, eyebrow, bg });
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
export function renderCard(element: ReturnType<typeof card> | ReturnType<typeof bareImageCard>): ImageResponse {
  return new ImageResponse(element as any, { width: OG_WIDTH, height: OG_HEIGHT, fonts: loadFonts() });
}
