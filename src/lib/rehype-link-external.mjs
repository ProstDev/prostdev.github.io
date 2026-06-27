// rehype-link-external — make EXTERNAL links in rendered Markdown/MDX open in a new tab
// AND append the site's external-arrow icon ("opens in a new tab") at BUILD time.
//
// The site convention: an outbound link gets target="_blank" rel="noopener" + a trailing
// inline external-arrow SVG (see src/components/Icon.astro `external`, ReaderNotes.astro,
// and the PLAYGROUND/BUTTON pill in remark-callouts.mjs). This plugin applies that
// convention automatically to every prose link instead of authors hand-decorating each one.
//
// Internal (NO new tab, NO icon): relative (/…, ./…, ../…), in-page (#…), protocol-relative
// or absolute to prostdev.com / www.prostdev.com, and mailto:/tel: (any non-http scheme).
// External: any other absolute http(s) URL. Hrefs that don't parse are treated as internal.
//
// Mirrors the repo's other build-time transforms (rehype-tables.mjs / remark-callouts.mjs):
// unist-util-visit over hast `element` nodes, no client runtime, no-JS / crawler-safe. rehype
// runs AFTER markdown→hast, so a Markdown `[text](url)` is a real <a> element here. Raw-HTML /
// MDX JSX anchors are mdxJsxTextElement/mdxJsxFlowElement (NOT type 'element'), so they're never
// matched — that's why the remark-callouts pills aren't touched.

import { visit } from 'unist-util-visit';

const INTERNAL_HOSTS = new Set(['prostdev.com', 'www.prostdev.com']);

// The external-arrow icon as a hast element (mirrors Icon.astro `external`). camelCase keys
// are the canonical property-information names that serialize to the hyphenated SVG attrs:
// strokeWidth→stroke-width, strokeLineCap→stroke-linecap, strokeLineJoin→stroke-linejoin,
// ariaHidden→aria-hidden, className→class.
function externalIcon() {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: ['external-icon'],
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '1.8',
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      ariaHidden: 'true',
    },
    children: [
      {
        type: 'element',
        tagName: 'path',
        properties: {
          d: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
        },
        children: [],
      },
    ],
  };
}

// Decide whether an href points off-site. Defensive: anything we can't parse, or that
// resolves to a prostdev host, is INTERNAL (no new tab, no icon).
function isExternal(href) {
  if (typeof href !== 'string') return false;
  const v = href.trim();
  if (v === '') return false;

  // Protocol-relative: //host/path  → resolve host against our internal set. (Checked BEFORE
  // the leading-'/' case below, which would otherwise treat it as a root-relative path.)
  if (v.startsWith('//')) {
    const host = v.slice(2).split(/[/?#]/)[0].toLowerCase();
    return !INTERNAL_HOSTS.has(host);
  }
  // Root-relative / current-dir / parent-dir / in-page → internal.
  if (v.startsWith('/') || v.startsWith('#') || v.startsWith('./') || v.startsWith('../')) {
    return false;
  }
  // Any scheme (mailto:, tel:, http:, https:, …). Only http(s) can be external.
  const scheme = v.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme) {
    const s = scheme[1].toLowerCase();
    if (s !== 'http' && s !== 'https') return false;
    try {
      const host = new URL(v).hostname.toLowerCase();
      return !INTERNAL_HOSTS.has(host);
    } catch {
      return false; // malformed absolute URL — leave it alone.
    }
  }
  // No scheme, no leading slash/dot/hash (e.g. a bare "foo/bar" relative path) → internal.
  return false;
}

export default function rehypeLinkExternal() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const props = node.properties || (node.properties = {});

      if (!props.href) return;           // anchors without href (named anchors) — skip.
      if (props.target) return;          // already decorated / author opted-in — idempotent.
      if (!isExternal(props.href)) return; // internal / mailto / tel / in-page — skip.

      props.target = '_blank';
      props.rel = 'noopener';
      node.children.push(externalIcon());
    });
  };
}
