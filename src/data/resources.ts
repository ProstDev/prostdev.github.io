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
 *      one-to-three-sentence `description`. Add a longer `note` if useful, and credit creators with
 *      `authors: [AUTHORS['<key>']]` from the shared registry (src/data/authors.ts; omit for Alex's
 *      own entries, list more than one to co-credit). The "MuleSoft Ambassador" cover badge is
 *      DERIVED from an author's `isAmbassador` flag in the registry (see resourceIsAmbassador) — set
 *      it once on the person there, not per-resource; add a new person to AUTHORS if not listed.
 *      A `description` states only what's OBSERVABLE (type, what it does, the tools it lists) — do
 *      NOT repeat a resource's own marketing claims as fact ("runs client-side / no data leaves
 *      your browser", "fastest", "secure") unless verified; on our site they read as our endorsement.
 *   2. If the `type` is new, add it to ResourceType + RESOURCE_TYPE_LABEL + RESOURCE_TYPE_ICON.
 *   2b. Add subject `tags` (a CLOSED enum, like the blog's) — the /resources page renders them as a
 *      second filter row (Type × Tag, AND-combined; buttons only, NO archive route). Assign only
 *      tags the resource OBSERVABLY fits. To add a new tag, extend ResourceTag + RESOURCE_TAG_LABEL.
 *   3. (Optional) Give it a real logo: drop the file in `src/assets/resources/`, `import` it at the
 *      top of this file, and set it as the entry's `image`. Without one, the card shows a generated
 *      icon tile (brand gradient + the type's Icon).
 *   4. Commit & push — the deploy rebuilds the site (the card grid + type filter + llms.txt update
 *      automatically from this array).
 */
import type { ImageMetadata } from 'astro';
import type { IconName } from '@/components/icon-names';
import { AUTHORS, hasAmbassador, type Author } from '@/data/authors';
// Real cover images (optional, 16:9 works best). Drop a screenshot in `src/assets/resources/`
// named after the entry's `id`, uncomment its import, and set it as that entry's `image`.
// Without one, the card shows a generated gradient cover with the type icon.
import fluxmuleCover from '@/assets/resources/fluxmule.jpg';
import anypointPlatformChromeExtensionCover from '@/assets/resources/anypoint-platform-chrome-extension.png';
import anypointMonitorCover from '@/assets/resources/anypoint-monitor.png';
import mulesoftCommunityThemeCover from '@/assets/resources/mulesoft-community-theme.png';
import prostdevSkillsCover from '@/assets/resources/prostdev-skills.png';
import mattPocockSkillsCover from '@/assets/resources/matt-pocock-skills.png';
import dataweaveStudioCover from '@/assets/resources/dataweave-studio.jpg';
import dataweaveStudioForWindowsCover from '@/assets/resources/dataweave-studio-for-windows.jpg';
import dwcodeCover from '@/assets/resources/dwcode.png';
import mulefdCover from '@/assets/resources/mulefd.png';
import integrationTrailsCover from '@/assets/resources/integration-trails.png';
import upendraMulesoftToolsCover from '@/assets/resources/upendra-mulesoft-tools.png';
import muleySolutionsToolsCover from '@/assets/resources/muley-solutions-tools.png';
import mulesoftCommunitySlackCover from '@/assets/resources/mulesoft-community-slack.png';
import mclsMuleSecurePropertiesCover from '@/assets/resources/mcls-mule-secure-properties.jpeg';
import muleflowBizviewCover from '@/assets/resources/muleflow-bizview.jpg';
import muleflowVisualizerForBitbucketCover from '@/assets/resources/muleflow-visualizer-for-bitbucket.jpg';
import muleflowVisualizerForGithubCover from '@/assets/resources/muleflow-visualizer-for-github.jpg';
import muleyeForAndroidCover from '@/assets/resources/muleye-for-android.jpg';
import muleyeForIosCover from '@/assets/resources/muleye-for-ios.jpg';

export type ResourceType =
  | 'chrome-extension'
  | 'vscode-extension'
  | 'vscode-theme'
  | 'agent-skills'
  | 'ide'
  | 'challenges'
  | 'slack'
  | 'mobile-app'
  | 'tool';

/**
 * Subject tags — a CLOSED enum (mirrors the blog's `TAGS`). These cross-cut `type`: several tools
 * of different types can share a tag (e.g. MuleFD and the MuleFlow extensions are all `visualizer`s).
 * Drives the second filter row on /resources. To add one, extend this + RESOURCE_TAG_LABEL.
 */
export type ResourceTag =
  | 'ai'
  | 'cli'
  | 'dataweave'
  | 'formatter'
  | 'learning'
  | 'monitoring'
  | 'security'
  | 'visualizer';

/** Human-readable label per tag — drives the filter chips + card chips. Alphabetical by label. */
export const RESOURCE_TAG_LABEL: Record<ResourceTag, string> = {
  ai: 'AI',
  cli: 'CLI',
  dataweave: 'DataWeave',
  formatter: 'Formatter',
  learning: 'Learning',
  monitoring: 'Monitoring',
  security: 'Security',
  visualizer: 'Visualizer',
};

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
  /**
   * Subject tags (closed `ResourceTag` enum) — cross-cutting the `type`. Drives the second filter
   * row and the card's tag chips. Assign only tags the resource observably fits; omit if none apply.
   */
  tags?: ResourceTag[];
  /** Off-site link (Chrome Web Store, VSCode Marketplace, GitHub, etc.). */
  url: string;
  /** One-to-three-sentence blurb shown on the card. */
  description: string;
  /** Optional longer explanation shown under the blurb. */
  note?: string;
  /**
   * Creators to credit — reference the shared registry, e.g. `[AUTHORS['edgar-moran']]` (list more
   * than one to credit co-creators). Omit for Alex's own resources.
   */
  authors?: Author[];
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
  'mobile-app': 'Mobile app',
  slack: 'Slack',
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
  'mobile-app': 'phone',
  slack: 'slack',
  tool: 'wrench',
  'vscode-extension': 'vscode',
  'vscode-theme': 'vscode',
};

/** Icon for a resource: its explicit `icon`, else the per-type fallback. */
export function resourceIcon(resource: Resource): IconName {
  return resource.icon ?? RESOURCE_TYPE_ICON[resource.type];
}

/**
 * True when any of the resource's credited authors is a MuleSoft Ambassador (drives the cover
 * badge). Derived from the shared author registry — a resource with no authors (Alex's own, or an
 * entity like MuleSoft) is only badged if that author is flagged in AUTHORS.
 */
export function resourceIsAmbassador(resource: Resource): boolean {
  return hasAmbassador(resource.authors);
}

// Ordered alphabetically by `title` (case-insensitive). Keep new entries in that order.
export const RESOURCES: Resource[] = [
  {
    id: 'anypoint-monitor',
    title: 'Anypoint Monitor',
    type: 'vscode-extension',
    tags: ['monitoring'],
    url: 'https://marketplace.visualstudio.com/items?itemName=EdgarMoran.anypoint-monitor',
    description:
      'A VSCode extension that surfaces Anypoint Platform monitoring data without leaving your editor.',
    image: anypointMonitorCover,
    authors: [AUTHORS['edgar-moran']],
  },
  {
    id: 'anypoint-platform-chrome-extension',
    title: 'Anypoint Platform Chrome extension',
    type: 'chrome-extension',
    url: 'https://chromewebstore.google.com/detail/anypoint-platform-chrome/gofndnflkobgljnjjalmehnlamoifmhc',
    description:
      'Browser helpers for the Anypoint Platform that speed up everyday navigation and inspection tasks.',
    image: anypointPlatformChromeExtensionCover,
    authors: [AUTHORS['edgar-moran']],
  },
  {
    id: 'dataweave-studio',
    title: 'DataWeave Studio (VSCode extension)',
    type: 'vscode-extension',
    secondaryTypes: ['ide'],
    tags: ['dataweave'],
    url: 'https://marketplace.visualstudio.com/items?itemName=ashutosh-vijay.dataweave-studio',
    description:
      'The VSCode extension build of DataWeave Studio — run, test, and debug DataWeave 2.0 transforms inside your editor without Anypoint Studio, with the engine and runtime bundled in for offline use.',
    image: dataweaveStudioCover,
    authors: [AUTHORS['ashutosh-vijay']],
  },
  {
    id: 'dataweave-studio-for-windows',
    title: 'DataWeave Studio for Windows',
    type: 'ide',
    tags: ['dataweave'],
    url: 'https://apps.microsoft.com/detail/9nwd4l4j7d92',
    description:
      'The Windows desktop build of DataWeave Studio, distributed through the Microsoft Store — a local IDE for running, testing, and debugging DataWeave 2.0 transforms without Anypoint Studio.',
    image: dataweaveStudioForWindowsCover,
    authors: [AUTHORS['ashutosh-vijay']],
  },
  {
    id: 'dwcode',
    title: 'DWCode',
    type: 'challenges',
    tags: ['dataweave', 'learning'],
    url: 'https://dwcode.vercel.app/',
    description:
      'A browser-based DataWeave practice platform — coding problems, a playground, contests, and a leaderboard to sharpen your DataWeave skills.',
    image: dwcodeCover,
    authors: [AUTHORS['bighnesh-kumar-sahoo'], AUTHORS['priyanshu-dhawan']],
  },
  {
    id: 'fluxmule',
    title: 'FluxMule',
    type: 'chrome-extension',
    secondaryTypes: ['ide'],
    url: 'https://chromewebstore.google.com/detail/fluxmule/imnkaohplcoblbkccemmdbbpbnenhjec',
    description:
      'A Chrome extension that streamlines working inside the Anypoint Platform right from your browser.',
    image: fluxmuleCover,
    authors: [AUTHORS['alexander-deroui-villar']],
  },
  {
    id: 'integration-trails',
    title: 'Integration Trails',
    type: 'challenges',
    tags: ['dataweave', 'learning'],
    url: 'https://app.integrationtrails.io/challenges',
    description:
      'A hands-on learning platform for integration developers — practice DataWeave and MuleSoft skills through graded challenges, structured trails, and a gamified XP leaderboard.',
    image: integrationTrailsCover,
    authors: [AUTHORS['patryk-bandurski']],
  },
  {
    id: 'matt-pocock-skills',
    title: 'Matt Pocock Skills',
    type: 'agent-skills',
    tags: ['ai'],
    url: 'https://github.com/mattpocock/skills',
    description:
      'A collection of AI agent skills I reach for a lot — TDD, debugging, code review, domain modeling, and more.',
    note: 'Not MuleSoft-specific, but I use these a lot in my day-to-day.',
    image: mattPocockSkillsCover,
    authors: [AUTHORS['matt-pocock']],
  },
  {
    id: 'mcls-mule-secure-properties',
    title: 'MCLS Mule Secure Properties',
    type: 'vscode-extension',
    tags: ['security'],
    url: 'https://marketplace.visualstudio.com/items?itemName=MasterCompcouk.mcls-mule-secure-properties',
    description:
      'A VSCode extension that previews, encrypts, and decrypts MuleSoft secure properties in YAML and .properties files.',
    image: mclsMuleSecurePropertiesCover,
    authors: [AUTHORS['lukasz-skowronek']],
  },
  {
    id: 'mule-xml-formatter',
    title: 'Mule XML Formatter',
    type: 'vscode-extension',
    tags: ['formatter'],
    url: 'https://marketplace.visualstudio.com/items?itemName=SravanNerella.mule-xml-formatter',
    description:
      'A VSCode extension that formats Mule XML config files consistently — tidying indentation and structure so your flow XML stays clean and readable.',
    authors: [AUTHORS['sravan-nerella']],
  },
  {
    id: 'mulefd',
    title: 'MuleFD',
    type: 'tool',
    tags: ['cli', 'visualizer'],
    url: 'https://github.com/manikmagar/mulefd',
    description:
      'A CLI tool that reads Mule 3/4 app config and generates visual flow diagrams — mapping how flows connect, spotting unused or recursive flows, and untangling flow spaghetti.',
    image: mulefdCover,
    authors: [AUTHORS['manik-magar']],
  },
  {
    id: 'muleflow-bizview',
    title: 'MuleFlow BizView',
    type: 'chrome-extension',
    tags: ['visualizer'],
    url: 'https://chromewebstore.google.com/detail/muleflow-bizview/jjglahhpajacblleceggnmgjdoaaehpn',
    description:
      'A Chrome extension that turns a MuleSoft project into interactive diagrams — an overview map of how flows connect and left-to-right flowcharts for each flow — and searches across the business logic (DataWeave, SQL, HTTP parameters). Exports diagrams to Draw.io, LucidChart, or PNG.',
    image: muleflowBizviewCover,
    authors: [AUTHORS['ronald-vega']],
  },
  {
    id: 'muleflow-visualizer-for-bitbucket',
    title: 'MuleFlow Visualizer for Bitbucket',
    type: 'chrome-extension',
    tags: ['visualizer'],
    url: 'https://chromewebstore.google.com/detail/muleflow-visualizer/kfnggnohaknfjipdnkkfibdgkhecbfkg',
    description:
      'A Chrome extension that renders MuleSoft XML files as flow diagrams directly in Bitbucket Cloud — showing flows, subflows, and MUnit tests, with pull-request diff support and a component search.',
    image: muleflowVisualizerForBitbucketCover,
    authors: [AUTHORS['ronald-vega']],
  },
  {
    id: 'muleflow-visualizer-for-github',
    title: 'MuleFlow Visualizer for GitHub',
    type: 'chrome-extension',
    tags: ['visualizer'],
    url: 'https://chromewebstore.google.com/detail/muleflow-visualizer-for-g/miooblfebdbnpnliffkpmbdgnbhomgjf',
    description:
      'A Chrome extension that renders MuleSoft XML files as flow diagrams directly in GitHub — on both repository files and pull-request diffs — with a component search and a property inspector.',
    image: muleflowVisualizerForGithubCover,
    authors: [AUTHORS['ronald-vega']],
  },
  {
    id: 'mulesoft-community-theme',
    title: 'MuleSoft Community Theme',
    type: 'vscode-theme',
    url: 'https://marketplace.visualstudio.com/items?itemName=ProstDev.mulesoft-community-theme',
    description:
      'A VSCode color theme tuned for MuleSoft development — clear, comfortable syntax colors for DataWeave and XML config.',
    image: mulesoftCommunityThemeCover,
    authors: [AUTHORS['alex-martinez'], AUTHORS['naveen-namachivayam']],
  },
  {
    id: 'muley-solutions-tools',
    title: 'Muley Solutions Tools',
    type: 'tool',
    tags: ['ai'],
    url: 'https://muley.solutions/tools',
    description:
      'A curated directory of working MuleSoft Agent Fabric and Anypoint Platform tools and interactive demos — agentic asset designers, an Omni Gateway policy marketplace, agent/MCP testing toolkits, network tracers, and connectors — filterable by category and each linking out to the live tool or demo.',
    image: muleySolutionsToolsCover,
    authors: [AUTHORS['philipp-schone'], AUTHORS['farhan-modjdehi']],
  },
  {
    id: 'muleye-for-android',
    title: 'Muleye for Android',
    type: 'mobile-app',
    tags: ['monitoring'],
    url: 'https://play.google.com/store/apps/details?id=com.moran.anypointmobile',
    description:
      'An Android app for monitoring and managing the Anypoint Platform from your phone — check application status, runtime versions, and replicas, stream and filter logs (ERROR/WARN/INFO/DEBUG), view metrics, start/stop/restart deployments, and switch across environments, accounts, and business groups. Supports CloudHub 1.0, CloudHub 2.0, and Hybrid apps.',
    image: muleyeForAndroidCover,
    authors: [AUTHORS['edgar-moran']],
  },
  {
    id: 'muleye-for-ios',
    title: 'Muleye for iOS',
    type: 'mobile-app',
    tags: ['monitoring'],
    url: 'https://apps.apple.com/us/app/muleye/id6752311018',
    description:
      'An iOS app for monitoring and managing the Anypoint Platform from your phone — check application status, runtime versions, and replicas, stream and filter logs (ERROR/WARN/INFO/DEBUG), view metrics, start/stop/restart deployments, and switch across environments, accounts, and business groups. Supports CloudHub 1.0, CloudHub 2.0, and Hybrid apps.',
    image: muleyeForIosCover,
    authors: [AUTHORS['edgar-moran']],
  },
  {
    id: 'dataweave-slack',
    title: 'Official DataWeave Language Slack Workspace',
    type: 'slack',
    tags: ['dataweave'],
    url: 'https://join.slack.com/t/dataweavelanguage/shared_invite/zt-1ewv2igp0-3ZiqQqaMdO_utwaEjxBpTw',
    description:
      'A community Slack workspace focused on the DataWeave language — ask questions, share transforms, and connect with other DataWeave developers. The link is an open invite to join.',
    authors: [AUTHORS['mulesoft']],
  },
  {
    id: 'mulesoft-community-slack',
    title: 'Official MuleSoft Community Slack Workspace',
    type: 'slack',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScfuc3_R8sEl23xLkZBPIs6n7--HFhyuZewJiJKsKzQbnY9HQ/viewform',
    description:
      'A community Slack workspace for MuleSoft developers to ask questions, share tips, and connect. The link opens a Google Form to request an invite.',
    image: mulesoftCommunitySlackCover,
    authors: [AUTHORS['mulesoft']],
  },
  {
    id: 'prostdev-skills',
    title: 'ProstDev Skills',
    type: 'agent-skills',
    tags: ['ai'],
    url: 'https://github.com/ProstDev/skills',
    description:
      'The AI agent skills I use for MuleSoft content and development, packaged so you can install and run them yourself.',
    image: prostdevSkillsCover,
    authors: [AUTHORS['alex-martinez']],
  },
  {
    id: 'upendra-mulesoft-tools',
    title: "Upendra's MuleSoft Tools",
    type: 'tool',
    tags: ['formatter', 'security'],
    url: 'https://upendra-thunuguntla.github.io/#tools',
    description:
      'A growing collection of free, browser-based MuleSoft dev tools — a Secure Properties generator, JSON↔RAML and RAML↔OAS converters, YAML↔Properties converters, a MuleSoft log to cURL converter, a Mule XML SDK helper, a cron expression builder, and more.',
    image: upendraMulesoftToolsCover,
    authors: [AUTHORS['upendra-thunuguntla']],
  },
  // TODO: try it first, then add. FlowSpace — https://nqnconsulting.com/flowspace
  // by NQN Consulting (https://www.linkedin.com/in/nqnconsulting/). Type + description TBD.
];
