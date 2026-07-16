import type { APIRoute } from 'astro';
import { getPosts, formatDate, getSeriesParts } from '@/lib/content';
import { getSeriesForPost, seriesPosition } from '@/data/series';
import { renderMarkdown, type DocSection } from '@/lib/markdown-export';
import { SITE } from '@/config';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getPosts>>[number] };
  const { title, description, author, pubDate, category, tags, readerNotes, faqs } = post.data;

  const sections: DocSection[] = [];

  // Series navigation as a machine-readable block (AEO) — mirrors the on-page
  // prev/next + jump menu, driven by src/data/series.ts.
  const series = getSeriesForPost(post.id);
  if (series) {
    const parts = await getSeriesParts(series, post.id);
    const pos = seriesPosition(series, post.id);
    sections.push({
      heading: `Series: ${series.title} (Part ${pos} of ${parts.length})`,
      body: parts
        .map((p) =>
          p.isCurrent
            ? `${p.position}. ${p.title} (this post)`
            : `${p.position}. [${p.title}](${SITE.url}/post/${p.slug})`
        )
        .join('\n'),
    });
  }

  // The body follows the header (or the series block, if any). When a series
  // block precedes it, it needs its own `---` divider.
  sections.push({ body: post.body ?? '', rule: Boolean(series) });

  // Curated reader comments preserved from the old Wix site (AEO) — mirrors ReaderNotes.astro.
  // Verbatim; a note may carry a code snippet, serialized as a fenced block.
  if (readerNotes && readerNotes.length > 0) {
    sections.push({
      heading: 'Reader notes',
      rule: true,
      body: readerNotes
        .map((n) => {
          const reply = n.replyTo ? `↳ Reply to ${n.replyTo} — ` : '';
          const head = `${reply}**${n.author}**${n.date ? ` (${formatDate(n.date)})` : ''}`;
          const fence = (code?: string, lang?: string) =>
            code ? `\n\n\`\`\`${lang ?? ''}\n${code.replace(/\n+$/, '')}\n\`\`\`` : '';
          // Ordered prose/code segments take precedence over the flat text/code fields.
          const parts =
            n.parts && n.parts.length > 0
              ? n.parts
              : [{ text: n.text, code: n.code, lang: n.lang }];
          const segments = parts
            .map((p) => (p.text ? p.text : '') + fence(p.code, p.lang))
            .filter((s) => s !== '')
            .join('\n\n');
          return segments ? `${head}: ${segments}` : head;
        })
        .join('\n\n'),
    });
  }

  // FAQ section (AEO) — mirrors Faqs.astro + the FAQPage JSON-LD. Verbatim Q&A so all surfaces agree.
  if (faqs && faqs.length > 0) {
    sections.push({
      heading: 'FAQs',
      rule: true,
      body: faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join('\n\n'),
    });
  }

  const md = renderMarkdown({
    title,
    description,
    headerRule: true,
    meta: [
      { label: 'Author', value: author },
      { label: 'Published', value: formatDate(pubDate) },
      { label: 'Category', value: category },
      tags.length ? { label: 'Tags', value: tags.join(', ') } : null,
      { label: 'Source', value: `${SITE.url}/post/${post.id}` },
    ],
    sections,
  });

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
