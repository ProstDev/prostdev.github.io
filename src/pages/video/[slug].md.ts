import type { APIRoute } from 'astro';
import { VIDEOS, getPlaylist, watchUrl, type Video } from '@/data/videos';
import { getTranscript } from '@/lib/transcripts';
import { SITE } from '@/config';

export async function getStaticPaths() {
  return VIDEOS.map((video) => ({ params: { slug: video.slug }, props: { video } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { video } = props as { video: Video };
  const transcript = await getTranscript(video.youtubeId);
  const playlist = getPlaylist(video.playlists[0]);

  const parts = [
    `# ${video.title}`,
    '',
    `> ${video.description}`,
    '',
    `- **Watch:** ${watchUrl(video.youtubeId)}`,
    `- **Page:** ${SITE.url}/video/${video.slug}`,
    playlist ? `- **Series:** ${playlist.title}` : null,
    video.duration && video.duration !== '—' ? `- **Duration:** ${video.duration}` : null,
    '',
    '## About this video',
    '',
    video.description,
    '',
  ].filter((l) => l !== null);

  if (video.links && video.links.length > 0) {
    parts.push('## Resources', '');
    for (const link of video.links) {
      parts.push(`- [${link.label}](${link.url})`);
    }
    parts.push('');
  }

  if (transcript) {
    parts.push('## Transcript', '', transcript.body ?? '');
  } else {
    parts.push(
      '## Transcript',
      '',
      '_Transcript not yet available. Auto-generated captions are available on YouTube._'
    );
  }

  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
