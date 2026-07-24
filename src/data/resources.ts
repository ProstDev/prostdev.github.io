/**
 * Community resources catalog for ProstDev.
 *
 * A hand-curated showcase of community-built MuleSoft tooling Alex Martinez uses and recommends —
 * Chrome extensions, VSCode extensions/themes, IDEs, and reusable AI agent skill sets. Each is
 * an off-site link (no on-site detail page); the /resources page renders these as cards with a type
 * badge, a blurb, an optional longer note, and author attribution.
 *
 * HOW TO ADD A RESOURCE:
 *   1. Add a Resource entry below (in alphabetical order by `title`, case-insensitive — see the
 *      RESOURCES array) with a unique `id`, its `title`, `type`, off-site `url`, and a
 *      one-to-three-sentence `description`. Add a longer `note` and an `authors` list if useful
 *      (omit `authors` for self-authored entries; a resource can credit more than one creator).
 *   2. If the `type` is new, add it to ResourceType + RESOURCE_TYPE_LABEL + RESOURCE_TYPE_ICON.
 *   3. (Optional) Give it a real logo: drop the file in `src/assets/resources/`, `import` it at the
 *      top of this file, and set it as the entry's `image`. Without one, the card shows a generated
 *      icon tile (brand gradient + the type's Icon).
 *   4. Commit & push — the deploy rebuilds the site (the card grid + type filter + llms.txt update
 *      automatically from this array).
 */
import type { ImageMetadata } from 'astro';
import type { IconName } from '@/components/icon-names';
// Real cover images (optional, 16:9 works best). Drop a screenshot in `src/assets/resources/`
// named after the entry's `id`, uncomment its import, and set it as that entry's `image`.
// Without one, the card shows a generated gradient cover with the type icon.
import fluxmuleCover from '@/assets/resources/fluxmule.jpg';
import anypointPlatformChromeExtensionCover from '@/assets/resources/anypoint-platform-chrome-extension.png';
import anypointMonitorCover from '@/assets/resources/anypoint-monitor.png';
import mulesoftCommunityThemeCover from '@/assets/resources/mulesoft-community-theme.png';
import prostdevSkillsCover from '@/assets/resources/prostdev-skills.png';
import mattPocockSkillsCover from '@/assets/resources/matt-pocock-skills.png';
import dataweaveStudioCover from '@/assets/resources/dataweave-studio.png';
import dwcodeCover from '@/assets/resources/dwcode.png';
import mulefdCover from '@/assets/resources/mulefd.png';
import integrationTrailsCover from '@/assets/resources/integration-trails.png';

export type ResourceType =
  | 'chrome-extension'
  | 'vscode-extension'
  | 'vscode-theme'
  | 'agent-skills'
  | 'ide'
  | 'challenges'
  | 'tool';

export interface Resource {
  /** Stable kebab-case slug — used for list keys and filter data attributes. */
  id: string;
  title: string;
  /** Primary type — drives the card's lead badge, icon, and default filter bucket. */
  type: ResourceType;
  /**
   * Additional types this resource ALSO belongs to (e.g. an IDE that ships as a VSCode extension
   * too). Renders extra badges, and the card appears under each of these filter chips as well as
   * its primary `type`. Keep off `type` to avoid duplicates.
   */
  secondaryTypes?: ResourceType[];
  /** Off-site link (Chrome Web Store, VSCode Marketplace, GitHub, etc.). */
  url: string;
  /** One-to-three-sentence blurb shown on the card. */
  description: string;
  /** Optional longer explanation shown under the blurb. */
  note?: string;
  /**
   * Creators to credit. Omit for Alex's own resources. Each has a `name` and optional profile
   * `url` (LinkedIn, GitHub, etc.); list more than one to credit co-creators.
   */
  authors?: { name: string; url?: string }[];
  /** Optional Icon.astro name; falls back to RESOURCE_TYPE_ICON[type]. */
  icon?: IconName;
  /**
   * Optional real logo (a local asset `import`ed above). When absent, the card renders a generated
   * icon tile (brand gradient + the type's Icon) instead.
   */
  image?: ImageMetadata;
}

/**
 * Human-readable label per type — drives the filter chips and the card badge. Ordered
 * alphabetically by label (the filter chips render in this key order).
 */
export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  'agent-skills': 'Agent skills',
  challenges: 'Challenges',
  'chrome-extension': 'Chrome extension',
  ide: 'IDE',
  tool: 'Tool',
  'vscode-extension': 'VSCode extension',
  'vscode-theme': 'VSCode theme',
};

/** Fallback Icon.astro name per type (every name here already exists in Icon.astro). */
export const RESOURCE_TYPE_ICON: Record<ResourceType, IconName> = {
  'agent-skills': 'github',
  challenges: 'trophy',
  'chrome-extension': 'chrome',
  ide: 'terminal',
  tool: 'wrench',
  'vscode-extension': 'vscode',
  'vscode-theme': 'vscode',
};

/** Icon for a resource: its explicit `icon`, else the per-type fallback. */
export function resourceIcon(resource: Resource): IconName {
  return resource.icon ?? RESOURCE_TYPE_ICON[resource.type];
}

// Ordered alphabetically by `title` (case-insensitive). Keep new entries in that order.
export const RESOURCES: Resource[] = [
  {
    id: 'anypoint-monitor',
    title: 'Anypoint Monitor',
    type: 'vscode-extension',
    url: 'https://marketplace.visualstudio.com/items?itemName=EdgarMoran.anypoint-monitor',
    description:
      'A VSCode extension that surfaces Anypoint Platform monitoring data without leaving your editor.',
    image: anypointMonitorCover,
    authors: [{ name: 'Edgar Moran', url: 'https://www.linkedin.com/in/yucelmoran/' }],
  },
  {
    id: 'anypoint-platform-chrome-extension',
    title: 'Anypoint Platform Chrome extension',
    type: 'chrome-extension',
    url: 'https://chromewebstore.google.com/detail/anypoint-platform-chrome/gofndnflkobgljnjjalmehnlamoifmhc',
    description:
      'Browser helpers for the Anypoint Platform that speed up everyday navigation and inspection tasks.',
    image: anypointPlatformChromeExtensionCover,
    authors: [{ name: 'Edgar Moran', url: 'https://www.linkedin.com/in/yucelmoran/' }],
  },
  {
    id: 'dataweave-studio',
    title: 'DataWeave Studio',
    type: 'ide',
    secondaryTypes: ['vscode-extension'],
    url: 'https://github.com/Ashutosh-Vijay/DataWeave-Studio',
    description:
      'A local IDE for DataWeave 2.0 — run, test, and debug transforms without Anypoint Studio. Available as a desktop app or a VSCode extension, with the engine and runtime bundled in for offline use.',
    image: dataweaveStudioCover,
    authors: [{ name: 'Ashutosh Vijay', url: 'https://www.linkedin.com/in/ashutosh-vijay/' }],
  },
  {
    id: 'dwcode',
    title: 'DWCode',
    type: 'challenges',
    url: 'https://dwcode.vercel.app/',
    description:
      'A browser-based DataWeave practice platform — coding problems, a playground, contests, and a leaderboard to sharpen your DataWeave skills.',
    image: dwcodeCover,
    authors: [
      { name: 'Bighnesh Kumar Sahoo', url: 'https://www.linkedin.com/in/bighnesh18/' },
      { name: 'Priyanshu Dhawan', url: 'https://www.linkedin.com/in/priyanshuthe1/' },
    ],
  },
  {
    id: 'fluxmule',
    title: 'FluxMule',
    type: 'chrome-extension',
    url: 'https://chromewebstore.google.com/detail/fluxmule/imnkaohplcoblbkccemmdbbpbnenhjec',
    description:
      'A Chrome extension that streamlines working inside the Anypoint Platform right from your browser.',
    image: fluxmuleCover,
    authors: [
      {
        name: 'Alexander Deroui Villar',
        url: 'https://www.linkedin.com/in/alexander-deroui-villar-66297ba7/',
      },
    ],
  },
  {
    id: 'integration-trails',
    title: 'Integration Trails',
    type: 'challenges',
    url: 'https://app.integrationtrails.io/challenges',
    description:
      'A hands-on learning platform for integration developers — practice DataWeave and MuleSoft skills through graded challenges, structured trails, and a gamified XP leaderboard.',
    image: integrationTrailsCover,
    authors: [{ name: 'Patryk Bandurski', url: 'https://www.linkedin.com/in/patryk-bandurski/' }],
  },
  {
    id: 'matt-pocock-skills',
    title: 'Matt Pocock Skills',
    type: 'agent-skills',
    url: 'https://github.com/mattpocock/skills',
    description:
      'A collection of AI agent skills I reach for a lot — TDD, debugging, code review, domain modeling, and more.',
    note: 'Not MuleSoft-specific, but I use these a lot in my day-to-day.',
    image: mattPocockSkillsCover,
    authors: [{ name: 'Matt Pocock', url: 'https://www.linkedin.com/in/mapocock/' }],
  },
  {
    id: 'mulefd',
    title: 'MuleFD',
    type: 'tool',
    url: 'https://github.com/manikmagar/mulefd',
    description:
      'A CLI tool that reads Mule 3/4 app config and generates visual flow diagrams — mapping how flows connect, spotting unused or recursive flows, and untangling flow spaghetti.',
    image: mulefdCover,
    authors: [{ name: 'Manik Magar', url: 'https://www.linkedin.com/in/manikmagar/' }],
  },
  {
    id: 'mulesoft-community-theme',
    title: 'MuleSoft Community Theme',
    type: 'vscode-theme',
    url: 'https://marketplace.visualstudio.com/items?itemName=ProstDev.mulesoft-community-theme',
    description:
      'A VSCode color theme tuned for MuleSoft development — clear, comfortable syntax colors for DataWeave and XML config.',
    image: mulesoftCommunityThemeCover,
    authors: [
      { name: 'Alex Martinez', url: 'https://www.linkedin.com/in/alexandra-n-martinez/' },
      { name: 'NaveenKumar Namachivayam', url: 'https://www.linkedin.com/in/naveenkumarn/' },
    ],
  },
  {
    id: 'prostdev-skills',
    title: 'ProstDev Skills',
    type: 'agent-skills',
    url: 'https://github.com/ProstDev/skills',
    description:
      'The AI agent skills I use for MuleSoft content and development, packaged so you can install and run them yourself.',
    image: prostdevSkillsCover,
    authors: [{ name: 'Alex Martinez', url: 'https://www.linkedin.com/in/alexandra-n-martinez/' }],
  },
  // TODO: try it first, then add. FlowSpace — https://nqnconsulting.com/flowspace
  // by NQN Consulting (https://www.linkedin.com/in/nqnconsulting/). Type + description TBD.
];
