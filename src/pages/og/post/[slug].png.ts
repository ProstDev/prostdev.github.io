import type { APIRoute } from 'astro';
import { getRenderablePosts } from '@/lib/content';
import { card, renderCard, loadPostHero } from '@/lib/og-image';

export async function getStaticPaths() {
  // getRenderablePosts() (not getPosts()) so a SCHEDULED post's OG card builds too — it's byte-
  // identical to the published card, so a link shared before publish previews correctly. See the
  // teaser branch in src/pages/post/[slug].astro.
  const posts = await getRenderablePosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

/** Per-post OG card: post title over its hero image → dist/og/post/<slug>.png. */
export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getRenderablePosts>>[number] };
  const bg = loadPostHero(post.filePath ?? '');
  return renderCard(card({ title: post.data.title, eyebrow: post.data.category, bg }));
};
