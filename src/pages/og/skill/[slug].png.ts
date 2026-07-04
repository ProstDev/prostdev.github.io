import type { APIRoute } from 'astro';
import { getSkills } from '@/lib/content';
import { card, renderCard, loadPostHero } from '@/lib/og-image';

export async function getStaticPaths() {
  const skills = await getSkills();
  return skills.map((skill) => ({ params: { slug: skill.id }, props: { skill } }));
}

/** Per-skill OG card: skill title over its hero image (if any) → dist/og/skill/<slug>.png. */
export const GET: APIRoute = ({ props }) => {
  const { skill } = props as { skill: Awaited<ReturnType<typeof getSkills>>[number] };
  const bg = loadPostHero(skill.filePath ?? '');
  return renderCard(card({ title: skill.data.displayName ?? skill.data.title, eyebrow: 'Skill', bg }));
};
