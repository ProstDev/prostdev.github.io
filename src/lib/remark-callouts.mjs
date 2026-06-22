// remark-callouts — render GitHub alert blockquotes as styled callout boxes at BUILD time.
//
// Authoring (also what the `.md`/llms endpoints serve, verbatim):
//     > [!NOTE]
//     > body text…
// is transformed into:
//     <div class="callout callout--note" role="note">
//       <p class="callout__title"><svg class="callout__icon" …/><span>Note</span></p>
//       <div class="callout__body"><p>body text…</p></div>
//     </div>
// Six status types: NOTE, TIP, IMPORTANT, WARNING, CAUTION, DOCS. Styling + per-theme colors
// live in src/styles/global.css under the `.callout*` section.
//
// PLUS one SPECIAL type — PLAYGROUND — that does NOT render a title/body box. It's a call-to-
// action for "run this in the DataWeave Playground" links:
//     > [!PLAYGROUND]
//     > [Solve on the Playground](https://dataweave.mulesoft.com/learn/playground?…)
// renders as an accent PILL anchor (🚀 rocket EMOJI + label + external-arrow), opt-in and repeatable
// mid-post (e.g. one per code stage in a gradual tutorial). The contained link supplies the href
// + visible label; inline prose Playground mentions are left as plain links. Styling lives under
// the `.playground-btn` section in global.css. See the "Callouts / admonitions" Convention.
//
// WHY a remark plugin (the repo's first): no-JS / crawler-safe, no flash, and `[!NOTE]` is
// understood natively by GitHub + LLMs — the right fit for this site's machine-readability bet.
// We emit mdxJsxFlowElement nodes (NOT raw HTML strings) so a bare `<` in the inlined SVG can't
// break the MDX parse. The icon shapes mirror src/components/Icon.astro (keep them in sync) —
// the 6 callout icons, plus `external` for the PLAYGROUND pill (whose rocket is a 🚀 emoji glyph).

import { visit } from 'unist-util-visit';

// type → { label, icon shapes }. Icon paths copied from Icon.astro (stroke style, viewBox 24).
const TYPES = {
  NOTE: { type: 'note', label: 'Note', shapes: [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M12 11v5M12 8h.01' }]] },
  TIP: { type: 'tip', label: 'Tip', shapes: [['path', { d: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.5l.1.7h5.2l.1-.7c.1-.6.4-1.1.9-1.5A6 6 0 0 0 12 3z' }]] },
  IMPORTANT: { type: 'important', label: 'Important', shapes: [['circle', { cx: '12', cy: '12', r: '9' }], ['path', { d: 'M12 8v5M12 16h.01' }]] },
  WARNING: { type: 'warning', label: 'Warning', shapes: [['path', { d: 'M10.3 3.9 2 18.3A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.7-2.7L13.7 3.9a2 2 0 0 0-3.4 0z' }], ['path', { d: 'M12 9v4M12 16h.01' }]] },
  CAUTION: { type: 'caution', label: 'Caution', shapes: [['path', { d: 'M7.9 2.5h8.2L21.5 7.9v8.2L16.1 21.5H7.9L2.5 16.1V7.9z' }], ['path', { d: 'M12 8v5M12 16h.01' }]] },
  DOCS: { type: 'docs', label: 'Docs', shapes: [['path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z' }], ['path', { d: 'M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5' }]] },
  // Special CTA — rendered as a pill anchor, not a box (see the PLAYGROUND branch below).
  // No `shapes` — its rocket is a 🚀 emoji glyph, not an inline SVG.
  PLAYGROUND: { type: 'playground', label: 'Open in DataWeave Playground' },
  // Generic CTA pill — same accent button as PLAYGROUND but with NO rocket (label + external
  // arrow only). For any "download this" / "go here" call-to-action recovered from a Wix button.
  BUTTON: { type: 'button', label: 'Button' },
};

// External-arrow icon (Icon.astro `external`) — the site convention for "opens in a new tab".
const EXTERNAL_SHAPES = [['path', { d: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }]];

const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|DOCS|PLAYGROUND|BUTTON)\][^\S\n]*\n?/;

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });
const el = (name, attrs, children = []) => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes: Object.entries(attrs).map(([k, v]) => attr(k, v)),
  children,
});

function iconEl(shapes, className = 'callout__icon') {
  const svgAttrs = {
    class: className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  };
  const children = shapes.map(([tag, a]) => el(tag, a));
  return el('svg', svgAttrs, children);
}

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || index === null) return;
      const firstPara = node.children?.[0];
      if (!firstPara || firstPara.type !== 'paragraph') return;
      const firstText = firstPara.children?.[0];
      if (!firstText || firstText.type !== 'text') return;

      const m = firstText.value.match(MARKER);
      if (!m) return;

      const def = TYPES[m[1]];
      // Strip the marker (and the following newline) from the leading text node.
      firstText.value = firstText.value.slice(m[0].length);
      // If that leaves an empty leading text node, drop it so the body doesn't start blank.
      if (firstText.value === '') firstPara.children.shift();

      // PLAYGROUND / BUTTON — render a pill anchor instead of the title/body box. Find the first
      // link in the (marker-stripped) blockquote body; its url is the href, its text the visible
      // label. Both share the `.playground-btn` pill styling; PLAYGROUND adds a 🚀 rocket glyph.
      if (def.type === 'playground' || def.type === 'button') {
        let link = null;
        visit(node, 'link', (n) => {
          if (!link) link = n;
        });
        if (!link) return; // no link to wrap — leave the blockquote untouched, don't crash.
        const children = [];
        if (def.type === 'playground') {
          // Rocket EMOJI (not the SVG icon) — the author prefers the 🚀 glyph here.
          children.push(
            el('span', { class: 'playground-btn__icon', 'aria-hidden': 'true' }, [
              { type: 'text', value: '🚀' },
            ])
          );
        }
        children.push(el('span', { class: 'playground-btn__label' }, link.children));
        children.push(iconEl(EXTERNAL_SHAPES, 'playground-btn__ext'));
        const anchor = el(
          'a',
          { class: 'playground-btn', href: link.url, target: '_blank', rel: 'noopener' },
          children
        );
        parent.children[index] = anchor;
        return;
      }

      const title = el('p', { class: 'callout__title' }, [
        iconEl(def.shapes),
        el('span', {}, [{ type: 'text', value: def.label }]),
      ]);
      const body = el('div', { class: 'callout__body' }, node.children);
      const wrapper = el(
        'div',
        { class: `callout callout--${def.type}`, role: 'note' },
        [title, body]
      );

      parent.children[index] = wrapper;
    });
  };
}
