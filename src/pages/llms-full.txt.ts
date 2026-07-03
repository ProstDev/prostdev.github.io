import type { APIRoute } from 'astro';
import { getPosts, getSkills, formatDate } from '@/lib/content';
import { VIDEOS, getPlaylist, watchUrl } from '@/data/videos';
import { getTranscript } from '@/lib/transcripts';
import { SITE } from '@/config';

/**
 * llms-full.txt — full-context dump for LLM ingestion: every blog post body
 * and every available video transcript, as Markdown.
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const skills = await getSkills();
  const out: string[] = [];

  out.push(`# ${SITE.name} — Full Content Export`);
  out.push('');
  out.push(`> ${SITE.description}`);
  out.push('');
  out.push('---');
  out.push('');

  // Blog posts
  out.push('# Blog Posts');
  out.push('');
  for (const p of posts) {
    out.push(`## ${p.data.title}`);
    out.push('');
    out.push(`Source: ${SITE.url}/post/${p.id} | Published: ${formatDate(p.data.pubDate)} | Category: ${p.data.category}`);
    out.push('');
    out.push(p.body ?? '');
    out.push('');
    out.push('---');
    out.push('');
  }

  // Claude Code skills
  if (skills.length) {
    out.push('# Claude Code Skills');
    out.push('');
    for (const s of skills) {
      out.push(`## ${s.data.title}`);
      out.push('');
      out.push(`Source: ${SITE.url}/skill/${s.id} | Published: ${formatDate(s.data.pubDate)}`);
      out.push('');
      out.push(s.body ?? '');
      out.push('');
      out.push('---');
      out.push('');
    }
  }

  // Video transcripts
  out.push('# Video Transcripts');
  out.push('');
  for (const v of VIDEOS) {
    const transcript = await getTranscript(v.youtubeId);
    if (!transcript) continue;
    const pl = getPlaylist(v.playlists[0]);
    out.push(`## ${v.title}`);
    out.push('');
    out.push(`Watch: ${watchUrl(v.youtubeId)} | Page: ${SITE.url}/video/${v.slug}${pl ? ` | Series: ${pl.title}` : ''}`);
    out.push('');
    out.push(transcript.body ?? '');
    out.push('');
    out.push('---');
    out.push('');
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
