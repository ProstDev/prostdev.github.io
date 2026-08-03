/**
 * The canonical set of inline-SVG icon names rendered by `Icon.astro`.
 *
 * Lives in its own `.ts` module (not exported from the `.astro` frontmatter) so plain TypeScript
 * data files — e.g. `src/data/resources.ts` — can import the type without pulling an `.astro`
 * component through esbuild. Keep in sync with the render branches in `Icon.astro`.
 */
export type IconName =
  | 'youtube'
  | 'github'
  | 'linkedin'
  | 'slack'
  | 'vscode'
  | 'chrome'
  | 'sun'
  | 'moon'
  | 'search'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  | 'copy'
  | 'check'
  | 'external'
  | 'markdown'
  | 'mail'
  | 'menu'
  | 'close'
  | 'rocket'
  | 'wrench'
  | 'terminal'
  | 'trophy'
  | 'play'
  | 'file-text'
  | 'sparkles'
  | 'info'
  | 'lightbulb'
  | 'alert-circle'
  | 'alert-triangle'
  | 'alert-octagon'
  | 'book'
  | 'calendar';
