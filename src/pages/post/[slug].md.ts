import type { APIRoute } from 'astro';
import { getPosts, formatDate, getSeriesParts } from '@/lib/content';
import { getSeriesForPost, seriesPosition } from '@/data/series';
import { SITE } from '@/config';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
  const { title, description, author, pubDate, category, tags, readerNotes } = post.data;

  const frontmatter = [
    `# ${title}`,
    '',
    `> ${description}`,
    '',
    `- **Author:** ${author}`,
    `- **Published:** ${formatDate(pubDate)}`,
    `- **Category:** ${category}`,
    tags.length ? `- **Tags:** ${tags.join(', ')}` : null,
    `- **Source:** ${SITE.url}/post/${post.id}`,
    '',
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');

  // Series navigation as a machine-readable block (AEO) — mirrors the on-page
  // prev/next + jump menu, driven by src/data/series.ts.
  let seriesBlock = '';
  const series = getSeriesForPost(post.id);
  if (series) {
    const parts = await getSeriesParts(series, post.id);
    const pos = seriesPosition(series, post.id);
    seriesBlock =
      `## Series: ${series.title} (Part ${pos} of ${parts.length})\n\n` +
      parts
        .map((p) =>
          p.isCurrent
            ? `${p.position}. ${p.title} (this post)`
            : `${p.position}. [${p.title}](${SITE.url}/post/${p.slug})`
        )
        .join('\n') +
      '\n\n---\n\n';
  }

  const body = post.body ?? '';

  // Curated reader comments preserved from the old Wix site (AEO) — mirrors ReaderNotes.astro.
  // Verbatim; a note may carry a code snippet, serialized as a fenced block.
  let notesBlock = '';
  if (readerNotes && readerNotes.length > 0) {
    notesBlock =
      '\n\n---\n\n## Reader notes\n\n' +
      readerNotes
        .map((n) => {
          const reply = n.replyTo ? `↳ Reply to ${n.replyTo} — ` : '';
          const head = `${reply}**${n.author}**${n.date ? ` (${formatDate(n.date)})` : ''}`;
          const prose = n.text ? `${head}: ${n.text}` : head;
          const code = n.code
            ? `\n\n\`\`\`${n.lang ?? ''}\n${n.code.replace(/\n+$/, '')}\n\`\`\``
            : '';
          return prose + code;
        })
        .join('\n\n');
  }

  return new Response(frontmatter + seriesBlock + body + notesBlock, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
