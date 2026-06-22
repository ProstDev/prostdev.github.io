// rehype-tables — make Markdown/GFM tables responsive + more accessible at BUILD time.
//
// remark-gfm emits a bare `<table><thead>…<tbody>…</table>`. Two problems that pure CSS
// can't fix well on its own:
//   1. A wide table on a narrow (~360px) screen pushes the WHOLE PAGE sideways. WCAG 2.1
//      1.4.10 (Reflow) wants the TABLE to scroll inside its own box instead. The robust fix
//      is an `overflow-x:auto` WRAPPER element — NOT `display:block;overflow` on the <table>
//      itself, which strips the table's ARIA semantics in some browsers. So we wrap here.
//   2. The header cells have no `scope="col"`. Browsers infer it for simple tables, but WCAG
//      technique H63 calls for it explicitly — cheap robustness for screen readers.
//
// Mirrors the repo's first build-time transform, src/lib/remark-callouts.mjs (same
// unist-util-visit approach). Styling lives in src/styles/global.css under `.table-wrap` /
// `.prose table`. No-JS / crawler-safe, no client runtime.

import { visit } from 'unist-util-visit';

export default function rehypeTables() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === null) return;
      // Avoid double-wrapping if the tree is visited more than once.
      if (parent.type === 'element' && parent.tagName === 'div' &&
          parent.properties?.className?.includes?.('table-wrap')) return;

      // 1. Add scope="col" to every header cell in the table's <thead>.
      visit(node, 'element', (el) => {
        if (el.tagName === 'th' && !el.properties?.scope) {
          el.properties = { ...el.properties, scope: 'col' };
        }
      });

      // 2. Wrap the <table> in a horizontally-scrollable container. The wrapper is the
      // scroll region; role + tabindex make it keyboard-focusable so keyboard-only users
      // can scroll it (WCAG 2.1.1), with an accessible name announcing it as a table.
      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['table-wrap'],
          role: 'region',
          tabindex: '0',
          'aria-label': 'Table',
        },
        children: [node],
      };
      parent.children[index] = wrapper;
    });
  };
}
