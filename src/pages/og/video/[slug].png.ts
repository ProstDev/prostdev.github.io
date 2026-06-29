import type { APIRoute } from 'astro';
import { VIDEOS, getPlaylist, thumbnail } from '@/data/videos';
import { card, renderCard, fetchRemoteImage } from '@/lib/og-image';

export async function getStaticPaths() {
  return VIDEOS.map((video) => ({ params: { slug: video.slug }, props: { video } }));
}

/** Per-video OG card: video title over its YouTube thumbnail → dist/og/video/<slug>.png. */
export const GET: APIRoute = async ({ props }) => {
  const { video } = props as { video: (typeof VIDEOS)[number] };
  // maxres can be missing on some videos; fall back to the always-present hq thumbnail.
  const bg =
    (await fetchRemoteImage(thumbnail(video.youtubeId, 'max'))) ??
    (await fetchRemoteImage(thumbnail(video.youtubeId, 'hq')));
  const eyebrow = getPlaylist(video.playlists[0])?.title ?? 'Video';
  return renderCard(card({ title: video.title, eyebrow, bg }));
};
