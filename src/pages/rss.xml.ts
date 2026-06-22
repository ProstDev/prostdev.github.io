import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts } from '@/lib/content';
import { SITE } from '@/config';

export const GET: APIRoute = async (context) => {
  const posts = await getPosts();
  return rss({
    title: `${SITE.name} Blog`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/post/${post.id}`,
    })),
  });
};
