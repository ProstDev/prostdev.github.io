// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkCallouts from './src/lib/remark-callouts.mjs';
import rehypeTables from './src/lib/rehype-tables.mjs';
import rehypeLinkExternal from './src/lib/rehype-link-external.mjs';
import shikiCodeTitle from './src/lib/shiki-code-title.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://prostdev.com',
  trailingSlash: 'ignore',
  // This post was first migrated under a SHORTENED slug that never existed on Wix
  // (the live URL is the long one). Redirect the old short path to the canonical
  // live slug so any stale internal/SEO link doesn't 404.
  redirects: {
    '/post/getting-started-with-anypoint-code-builder':
      '/post/getting-started-with-anypoint-code-builder-in-vs-code-beginner-guide',
  },
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Transform GitHub alert blockquotes (`> [!NOTE]`) into styled callout boxes at build time.
    // See src/lib/remark-callouts.mjs + the `.callout*` styles in src/styles/global.css.
    remarkPlugins: [remarkCallouts],
    // Wrap GFM tables in a responsive scroll container + add scope="col" to headers.
    // See src/lib/rehype-tables.mjs + the `.table-wrap` / `.prose table` styles in global.css.
    // Then decorate EXTERNAL links with target="_blank" rel="noopener" + the external-arrow
    // icon — see src/lib/rehype-link-external.mjs + `.prose :where(a) .external-icon` in global.css.
    rehypePlugins: [rehypeTables, rehypeLinkExternal],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // DataWeave has no built-in Shiki grammar; alias to Scala for decent
      // highlighting of its functional/typed syntax.
      langAlias: {
        dataweave: 'scala',
        dwl: 'scala',
      },
      // Lift an optional `title="file.ext"` from a fence's meta onto a
      // `data-title` attr; CodeBlockEnhancer renders it in the header bar.
      transformers: [shikiCodeTitle()],
      wrap: true,
    },
  },
});
