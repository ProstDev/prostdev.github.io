import type { APIRoute } from 'astro';
import { getPosts, getSkills, getTags, getCategories, tagUrl, categoryUrl } from '@/lib/content';
import { VIDEOS, PLAYLISTS } from '@/data/videos';
import { SITE } from '@/config';

/**
 * llms.txt — https://llmstxt.org
 * A curated, link-rich index of the site for LLMs / AI crawlers.
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const skills = await getSkills();
  const categories = await getCategories();
  const tags = await getTags();

  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push('');
  lines.push(`> ${SITE.description}`);
  lines.push('');
  lines.push(
    'ProstDev is a MuleSoft education project by Alex Martinez. The primary content is YouTube video tutorials; blog posts provide written, in-depth companions. Each video and post has a machine-readable Markdown version (append `.md` to its URL).'
  );
  lines.push('');

  // Videos grouped by playlist/series
  lines.push('## Video series');
  lines.push('');
  for (const pl of PLAYLISTS) {
    const vids = VIDEOS.filter((v) => v.playlists.includes(pl.id));
    if (!vids.length) continue;
    lines.push(`### ${pl.title}`);
    lines.push('');
    for (const v of vids) {
      lines.push(`- [${v.title}](${SITE.url}/video/${v.slug}): ${v.description}`);
    }
    lines.push('');
  }

  // Blog posts
  lines.push('## Blog posts');
  lines.push('');
  for (const p of posts) {
    lines.push(`- [${p.data.title}](${SITE.url}/post/${p.id}): ${p.data.description}`);
  }
  lines.push('');

  // Claude Code skills — reusable AI-agent skills the author shares (not site build tooling).
  if (skills.length) {
    lines.push('## Claude Code skills');
    lines.push('');
    lines.push(
      'Reusable Claude Code / AI-agent skills Alex Martinez uses and shares. Each has a machine-readable Markdown version (append `.md` to its URL).'
    );
    lines.push('');
    for (const s of skills) {
      lines.push(`- [${s.data.title}](${SITE.url}/skill/${s.id}): ${s.data.description}`);
    }
    lines.push('');
  }

  // Topic map — categories (content type) + tags (subject), each an archive of related posts.
  lines.push('## Topics');
  lines.push('');
  lines.push('Posts are organized by category (the kind of post) and tags (the subject).');
  lines.push('');
  lines.push('### Categories');
  lines.push('');
  for (const { category, count } of categories) {
    lines.push(`- [${category}](${SITE.url}${categoryUrl(category)}): ${count} posts`);
  }
  lines.push('');
  lines.push('### Tags');
  lines.push('');
  for (const { tag, count } of tags) {
    if (count < 2) continue; // skip thin single-post tags (noindexed archives)
    lines.push(`- [${tag}](${SITE.url}${tagUrl(tag)}): ${count} posts`);
  }
  lines.push('');

  lines.push('## Full content');
  lines.push('');
  lines.push(`- [llms-full.txt](${SITE.url}/llms-full.txt): All posts and video transcripts concatenated as Markdown.`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
