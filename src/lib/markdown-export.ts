/**
 * Document model for the machine-readable `.md` endpoints (post / skill / video).
 *
 * These endpoints all emit the same shape — an `# H1`, a `> blockquote`
 * description, a bullet list of metadata, then a series of `## sections` — but
 * each used to hand-assemble the exact newline choreography inline, so the
 * shared header was copied three ways and drifted easily.
 *
 * `renderMarkdown(doc)` owns that assembly: an endpoint describes WHAT the doc
 * contains (title, description, meta bullets, section bodies) and this module
 * decides HOW it serializes to bytes. Section *bodies* stay with their endpoint
 * — they're unique per content type (series/notes/faqs vs resources/transcript)
 * and passed in as ready-made Markdown strings — so this module never grows a
 * per-type branch.
 *
 * The output is byte-for-byte what the endpoints emitted before, including one
 * historical quirk: on posts & skills the header's `---` divider is followed by
 * a SINGLE newline (`headerRule`), whereas every divider BETWEEN sections uses a
 * blank line on each side (`rule`).
 */

export interface MetaItem {
  label: string;
  value: string | number;
}

export interface DocSection {
  /** Rendered as `## {heading}`; omit for a raw body-only block (e.g. a post body). */
  heading?: string;
  /** Markdown appended verbatim. */
  body: string;
  /**
   * Prefix this section with a `---` thematic-break divider (blank line on each
   * side). Ignored for the FIRST section when `headerRule` is set — the header's
   * own divider already separates it.
   */
  rule?: boolean;
}

export interface MarkdownDoc {
  title: string;
  description: string;
  /** Bullet list under the blockquote. Falsy entries are dropped, so callers can
   *  inline conditionals (`tags.length ? {…} : null`). */
  meta: Array<MetaItem | null | false | undefined>;
  /**
   * Emit a `---` after the meta list; the first section then attaches directly
   * beneath it with a single newline (posts & skills). Omit for docs that flow
   * straight into their first `##` section with a blank line (videos).
   */
  headerRule?: boolean;
  sections?: DocSection[];
}

export function renderMarkdown(doc: MarkdownDoc): string {
  const bullets = doc.meta
    .filter((m): m is MetaItem => Boolean(m))
    .map((m) => `- **${m.label}:** ${m.value}`);

  let out = [`# ${doc.title}`, '', `> ${doc.description}`, '', ...bullets].join('\n');

  if (doc.headerRule) out += '\n\n---';

  (doc.sections ?? []).forEach((section, i) => {
    if (doc.headerRule && i === 0) {
      // The header's `---` already sits above; attach with a single newline.
      out += '\n';
    } else {
      out += section.rule ? '\n\n---\n\n' : '\n\n';
    }
    if (section.heading) out += `## ${section.heading}\n\n`;
    out += section.body;
  });

  return out;
}
