/**
 * shiki-code-title — a tiny build-time Shiki transformer that lifts an optional
 * `title="…"` from a fence's meta string onto a `data-title` attribute on the
 * rendered `<pre>`, so authors can label a code block with a filename:
 *
 *   ```java title="User.java"
 *   …
 *   ```
 *
 * The client-side CodeBlockEnhancer reads `pre.dataset.title` and renders it in
 * the block's header bar. Default (no `title=`) → no attribute → no filename, so
 * existing blocks are untouched.
 *
 * Astro 5.7's Shiki integration forwards the raw fence meta to a transformer via
 * `this.options.meta.__raw` (see node_modules/@astrojs/markdown-remark/dist/
 * shiki.js — `meta: options?.meta ? { __raw: options?.meta } : void 0`). Our
 * transformer is spread LAST into Shiki's transformer list, so Astro's own
 * transformer has already set `data-language` by the time `pre()` runs here.
 *
 * Registered in astro.config.mjs under markdown.shikiConfig.transformers.
 */

// Matches title="…" or title='…' anywhere in the meta string.
const TITLE_RE = /\btitle=(?:"([^"]*)"|'([^']*)')/;

export default function shikiCodeTitle() {
  return {
    name: 'shiki-code-title',
    pre(node) {
      const raw = this.options?.meta?.__raw;
      if (!raw) return;
      const m = TITLE_RE.exec(raw);
      const title = m && (m[1] ?? m[2]);
      if (!title) return;
      node.properties['data-title'] = title;
    },
  };
}
