import type { APIRoute } from 'astro';
import { getPosts, getTags, getCategories, tagUrl, categoryUrl } from '@/lib/content';
import { PLAYLISTS, videosInPlaylist } from '@/data/videos';
import {
  RESOURCES,
  RESOURCE_TYPE_LABEL,
  RESOURCE_TAG_LABEL,
  resourceIsAmbassador,
} from '@/data/resources';
import { COMMUNITY, COMMUNITY_TYPE_LABEL, communityIsAmbassador } from '@/data/community';
import { SITE } from '@/config';

/**
 * llms.txt — https://llmstxt.org
 * A curated, link-rich index of the site for LLMs / AI crawlers.
 */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
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
    const vids = videosInPlaylist(pl.id); // gated: scheduled videos excluded in prod
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

  // Community resources — community-built MuleSoft tooling Alex Martinez recommends. Each links
  // straight to its off-site store/repo (no on-site page).
  if (RESOURCES.length) {
    lines.push('## Community resources');
    lines.push('');
    lines.push(
      'Community-built MuleSoft tools worth knowing — Chrome/VSCode extensions, themes, and reusable AI agent skills.'
    );
    lines.push('');
    for (const r of RESOURCES) {
      if (r.url === '#') continue; // skip placeholders that aren't live yet
      const by = r.authors?.length ? ` (by ${r.authors.map((a) => a.name).join(' and ')})` : '';
      const tags = r.tags?.length
        ? ` [${r.tags.map((t) => RESOURCE_TAG_LABEL[t]).join(', ')}]`
        : '';
      const amb = resourceIsAmbassador(r) ? ' [MuleSoft Ambassador]' : '';
      lines.push(
        `- [${r.title}](${r.url}) — ${RESOURCE_TYPE_LABEL[r.type]}${tags}${amb}${by}: ${r.description}`
      );
    }
    lines.push('');
  }

  // Community creators — MuleSoft community blogs, channels, portfolios, and newsletters worth
  // following. Each links straight off-site (no on-site page). Ambassadors are flagged.
  if (COMMUNITY.length) {
    lines.push('## Community blogs & channels');
    lines.push('');
    lines.push(
      'MuleSoft community creators worth following — blogs, YouTube channels, portfolios, and newsletters. Entries marked [MuleSoft Ambassador] are on the official MuleSoft Ambassadors roster.'
    );
    lines.push('');
    for (const c of COMMUNITY) {
      if (c.url === '#') continue; // skip placeholders that aren't live yet
      const by = c.authors?.length ? ` (by ${c.authors.map((a) => a.name).join(' and ')})` : '';
      const amb = communityIsAmbassador(c) ? ' [MuleSoft Ambassador]' : '';
      lines.push(
        `- [${c.title}](${c.url}) — ${COMMUNITY_TYPE_LABEL[c.type]}${amb}${by}: ${c.description}`
      );
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
