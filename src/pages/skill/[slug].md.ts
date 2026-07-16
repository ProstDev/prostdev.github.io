import type { APIRoute } from 'astro';
import { getSkills, formatDate } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown-export';
import { SITE } from '@/config';

export async function getStaticPaths() {
  const skills = await getSkills();
  return skills.map((skill) => ({ params: { slug: skill.id }, props: { skill } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { skill } = props as { skill: Awaited<ReturnType<typeof getSkills>>[number] };
  const { title, description, difficulty, tags, pubDate, updatedDate } = skill.data;
  const updated =
    updatedDate && updatedDate.valueOf() !== pubDate.valueOf() ? updatedDate : null;

  const md = renderMarkdown({
    title,
    description,
    headerRule: true,
    meta: [
      difficulty ? { label: 'Difficulty', value: difficulty } : null,
      tags.length ? { label: 'Tags', value: tags.join(', ') } : null,
      { label: 'Added', value: formatDate(pubDate) },
      updated ? { label: 'Last modified', value: formatDate(updated) } : null,
      { label: 'Source', value: `${SITE.url}/skill/${skill.id}` },
    ],
    sections: [{ body: skill.body ?? '' }],
  });

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
