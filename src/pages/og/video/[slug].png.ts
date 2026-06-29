import type { APIRoute } from 'astro';
import { VIDEOS, getPlaylist, thumbnail } from '@/data/videos';
import { bareImageCard, renderCard, fetchRemoteImage } from '@/lib/og-image';

export async function getStaticPaths() {
  return VIDEOS.map((video) => ({ params: { slug: video.slug }, props: { video } }));
}

/**
 * Per-video OG card → dist/og/video/<slug>.png. YouTube thumbnails already bake in the video's own
 * title + ProstDev branding, so we serve the thumbnail full-bleed (no overlaid title/scrim — that
 * produced text-on-text). `cover`-fit to 1200×630 in renderCard. Branded gradient fallback if the
 * thumbnail can't be fetched.
 */
export const GET: APIRoute = async ({ props }) => {
  const { video } = props as { video: (typeof VIDEOS)[number] };
  // maxres can be missing on some videos; fall back to the always-present hq thumbnail.
  const bg =
    (await fetchRemoteImage(thumbnail(video.youtubeId, 'max'))) ??
    (await fetchRemoteImage(thumbnail(video.youtubeId, 'hq')));
  const eyebrow = getPlaylist(video.playlists[0])?.title ?? 'Video';
  return renderCard(bareImageCard({ title: video.title, eyebrow, bg }));
};
