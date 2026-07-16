import type { APIRoute } from 'astro';
import { publishedVideos, getPlaylist, watchUrl, type Video } from '@/data/videos';
import { getTranscript } from '@/lib/transcripts';
import { renderMarkdown, type DocSection } from '@/lib/markdown-export';
import { SITE } from '@/config';

export async function getStaticPaths() {
  return publishedVideos().map((video) => ({ params: { slug: video.slug }, props: { video } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { video } = props as { video: Video };
  const transcript = await getTranscript(video.youtubeId);
  const playlist = getPlaylist(video.playlists[0]);

  const sections: DocSection[] = [
    { heading: 'About this video', body: video.description },
  ];

  if (video.links && video.links.length > 0) {
    sections.push({
      heading: 'Resources',
      body: video.links.map((link) => `- [${link.label}](${link.url})`).join('\n'),
    });
  }

  sections.push({
    heading: 'Transcript',
    body: transcript
      ? (transcript.body ?? '')
      : '_Transcript not yet available. Auto-generated captions are available on YouTube._',
  });

  const md = renderMarkdown({
    title: video.title,
    description: video.description,
    meta: [
      { label: 'Watch', value: watchUrl(video.youtubeId) },
      { label: 'Page', value: `${SITE.url}/video/${video.slug}` },
      playlist ? { label: 'Series', value: playlist.title } : null,
      video.duration && video.duration !== '—'
        ? { label: 'Duration', value: video.duration }
        : null,
    ],
    sections,
  });

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
