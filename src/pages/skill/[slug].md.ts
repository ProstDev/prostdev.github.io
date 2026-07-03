import type { APIRoute } from 'astro';
import { getSkills, formatDate } from '@/lib/content';
import { SITE } from '@/config';

export async function getStaticPaths() {
  const skills = await getSkills();
  return skills.map((skill) => ({ params: { slug: skill.id }, props: { skill } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { skill } = props as { skill: Awaited<ReturnType<typeof getSkills>>[number] };
  const { title, description, difficulty, tags, pubDate } = skill.data;

  const frontmatter = [
    `# ${title}`,
    '',
    `> ${description}`,
    '',
    difficulty ? `- **Difficulty:** ${difficulty}` : null,
    tags.length ? `- **Tags:** ${tags.join(', ')}` : null,
    `- **Published:** ${formatDate(pubDate)}`,
    `- **Source:** ${SITE.url}/skill/${skill.id}`,
    '',
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');

  const body = skill.body ?? '';

  return new Response(frontmatter + body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
