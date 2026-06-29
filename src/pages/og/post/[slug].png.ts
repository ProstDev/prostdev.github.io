import type { APIRoute } from 'astro';
import { getPosts } from '@/lib/content';
import { card, renderCard, loadPostHero } from '@/lib/og-image';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

/** Per-post OG card: post title over its hero image → dist/og/post/<slug>.png. */
export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
  const bg = loadPostHero(post.filePath ?? '');
  return renderCard(card({ title: post.data.title, eyebrow: post.data.category, bg }));
};
