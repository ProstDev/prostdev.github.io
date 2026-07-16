/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// Reuse Astro's Vite config so tests resolve the `@/*` path alias (tsconfig paths)
// exactly like the app does — no duplicate alias map to keep in sync.
export default getViteConfig({
  test: {
    // Node environment: the catalog + calendar helpers are pure data, no DOM.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
