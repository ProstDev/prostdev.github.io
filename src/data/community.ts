/**
 * Community creators catalog for ProstDev.
 *
 * A hand-curated showcase of blogs, YouTube channels, portfolios, and newsletters from the MuleSoft
 * community — the people actively creating content worth following. Each is an off-site link (no
 * on-site detail page). The Community tab splits these across two pages by medium: /community/blogs
 * (blogs, newsletters, and portfolios — the written/reading side) and /community/channels (YouTube).
 * Both render cards with a type badge, a blurb, an optional longer note, author attribution, and —
 * for official MuleSoft Ambassadors — a highlight badge on the cover. See communityBlogs() /
 * communityChannels() below for the split.
 *
 * HOW TO ADD A CREATOR:
 *   1. Add a CommunityLink entry below (in alphabetical order by `title`, case-insensitive — see the
 *      COMMUNITY array) with a unique `id`, its `title`, `type`, off-site `url`, and a
 *      one-to-three-sentence `description`. Add a longer `note` and an `authors` list if useful.
 *      One card per LINK — if someone has both a blog AND a channel, add two entries.
 *      A `description` states only what's OBSERVABLE (what the site/channel is, the topics it
 *      covers) — do NOT repeat the creator's own marketing copy as fact; on our site it reads as
 *      Alex's endorsement.
 *   2. Credit the creator with `authors: [AUTHORS['<key>']]` from the shared registry
 *      (src/data/authors.ts). The "MuleSoft Ambassador" cover badge is DERIVED from that author's
 *      `isAmbassador` flag in the registry (see communityIsAmbassador) — set it once on the person
 *      there, not per-card. Add a new person to AUTHORS if they aren't already listed.
 *   3. If the `type` is new, add it to CommunityType + COMMUNITY_TYPE_LABEL + COMMUNITY_TYPE_ICON.
 *   4. (Optional) Give it a real cover: drop the file in `src/assets/community/` (named after the
 *      `id`), `import` it at the top of this file, and set it as the entry's `image`. Without one,
 *      the card shows a generated icon tile (brand gradient + the type's Icon). Cover FIT is
 *      `coverStyle` (see the field): a square logo (a YouTube avatar) → 'avatar' (centered on the
 *      gradient, app-icon look; the default for `type: 'youtube'`); a landscape screenshot →
 *      'cover'. The `/add-community-creator` skill has the avatar-fetch workflow.
 *   5. Commit & push — the deploy rebuilds the site (the card grid + type filter + llms.txt update
 *      automatically from this array).
 */
import type { ImageMetadata } from 'astro';
import type { IconName } from '@/components/icon-names';
import { AUTHORS, hasAmbassador, type Author } from '@/data/authors';
// Real cover images (optional). Drop a file in `src/assets/community/` named after the entry's `id`,
// `import` it here, and set it as that entry's `image`. Without one, the card shows a generated
// gradient cover with the type icon. Two fits (see `coverStyle` + CommunityCard.astro): a landscape
// SCREENSHOT fills the 16:9 cover edge-to-edge ('cover'); a square LOGO/avatar (what YouTube gives)
// sits centered on the brand gradient like an app icon ('avatar', the default for `type: 'youtube'`).
import aiPickedAlexApproved from '@/assets/community/ai-picked-alex-approved.jpg';
import anotherIntegrationBlog from '@/assets/community/another-integration-blog.png';
import bridgingTheGapYoutube from '@/assets/community/bridging-the-gap-youtube.jpg';
import exploreAndLearnByNkYoutube from '@/assets/community/explore-and-learn-by-nk-youtube.jpg';
import flowState from '@/assets/community/flow-state.png';
import jitendraBafnaDzone from '@/assets/community/jitendra-bafna-dzone.png';
import mule4developerYoutube from '@/assets/community/mule4developer-youtube.jpg';
import mulesoftAiAgentforceAcademyYoutube from '@/assets/community/mulesoft-ai-agentforce-academy-youtube.jpg';
import mulesoftTechzone from '@/assets/community/mulesoft-techzone.jpg';
import qaInsightsYoutube from '@/assets/community/qa-insights-youtube.jpg';
import stutiTankYoutube from '@/assets/community/stuti-tank-youtube.jpg';
import yourIntegrationBuddyYoutube from '@/assets/community/your-integration-buddy-youtube.jpg';

export type CommunityType = 'youtube' | 'blog' | 'portfolio' | 'newsletter';

/**
 * Human-readable label per type — drives the filter chips and the card badge. Ordered
 * alphabetically by label (the filter chips render in this key order).
 */
export const COMMUNITY_TYPE_LABEL: Record<CommunityType, string> = {
  blog: 'Blog',
  newsletter: 'Newsletter',
  portfolio: 'Portfolio',
  youtube: 'YouTube',
};

/** Fallback Icon.astro name per type (every name here already exists in Icon.astro). */
export const COMMUNITY_TYPE_ICON: Record<CommunityType, IconName> = {
  blog: 'file-text',
  newsletter: 'mail',
  portfolio: 'globe',
  youtube: 'youtube',
};

export interface CommunityLink {
  /** Stable kebab-case slug — used for list keys, filter data attributes, and the cover filename. */
  id: string;
  title: string;
  /** Primary type — drives the card's lead badge, icon, and filter bucket. */
  type: CommunityType;
  /** Off-site link (blog, YouTube channel, portfolio site, newsletter, etc.). */
  url: string;
  /** One-to-three-sentence blurb shown on the card. States only what's observable. */
  description: string;
  /** Optional longer explanation shown under the blurb. */
  note?: string;
  /**
   * Creator(s) to credit — reference the shared registry, e.g. `[AUTHORS['jitendra-bafna']]` (list
   * more than one to credit co-creators). Omit when the `title` already names the person.
   */
  authors?: Author[];
  /** Optional Icon.astro name for the type BADGE pill; falls back to COMMUNITY_TYPE_ICON[type]. */
  icon?: IconName;
  /**
   * Optional Icon.astro name for the generated COVER-tile watermark ONLY (the badge pill keeps
   * `icon`). Use to brand the cover — e.g. `'medium'` for a Medium blog — without changing the
   * type-badge icon. Only applies when the entry has no `image`; falls back to the badge icon.
   */
  coverIcon?: IconName;
  /**
   * Optional real cover (a local asset `import`ed above). When absent, the card renders a generated
   * icon tile (brand gradient + the type's Icon) instead.
   */
  image?: ImageMetadata;
  /**
   * How `image` fills the 16:9 cover. 'cover' = a landscape screenshot filling edge-to-edge; 'avatar'
   * = a square logo centered on the brand gradient (the app-icon look). Defaults to 'avatar' for
   * `type: 'youtube'` (channels supply square avatars) and 'cover' otherwise.
   */
  coverStyle?: 'cover' | 'avatar';
  /**
   * Optional `[topLeft, bottomRight]` CSS colors for the avatar tile's gradient, so a logo sits on a
   * backdrop pulled from its OWN brand palette instead of the generic ProstDev brand blue. Only
   * affects 'avatar'-style covers (a screenshot 'cover' fills the tile edge-to-edge). Omit to keep
   * the brand-blue default — best for monochrome / line-art logos that have no saturated color to
   * pull. To pick values for a new logo, eyeball its two most prominent brand colors, or run:
   *   node -e 'const s=require("sharp");s("src/assets/community/<id>.jpg").resize(64,64).raw().toBuffer({resolveWithObject:true}).then(({data,info})=>{const b={};for(let i=0;i<data.length;i+=info.channels){const[r,g,bl]=[data[i],data[i+1],data[i+2]];const mx=Math.max(r,g,bl)/255,mn=Math.min(r,g,bl)/255,l=(mx+mn)/2,sat=mx===mn?0:l>.5?(mx-mn)/(2-mx-mn):(mx-mn)/(mx+mn);if(sat<.2||l<.15||l>.9)continue;const k=[r,g,bl].map(v=>Math.round(v/32)*32).join(",");b[k]=(b[k]||0)+1}console.log(Object.entries(b).sort((a,c)=>c[1]-a[1]).slice(0,5))})'
   */
  coverGradient?: [string, string];
}

/**
 * The avatar-tile gradient for a link: a `linear-gradient(...)` CSS string built from its
 * `coverGradient` (top-left → bottom-right, matching the brand tile's `to-br` direction), or `null`
 * to fall back to the default brand-blue gradient class in CommunityCard.astro.
 */
export function communityCoverGradient(link: CommunityLink): string | null {
  if (!link.coverGradient) return null;
  const [a, b] = link.coverGradient;
  return `linear-gradient(to bottom right, ${a}, ${b})`;
}

/** Cover fit for a link: its explicit `coverStyle`, else 'avatar' for YouTube, 'cover' otherwise. */
export function communityCoverStyle(link: CommunityLink): 'cover' | 'avatar' {
  return link.coverStyle ?? (link.type === 'youtube' ? 'avatar' : 'cover');
}

/** Icon for a link's type BADGE pill: its explicit `icon`, else the per-type fallback. */
export function communityIcon(link: CommunityLink): IconName {
  return link.icon ?? COMMUNITY_TYPE_ICON[link.type];
}

/** Icon for a link's generated COVER watermark: its explicit `coverIcon`, else the badge icon. */
export function communityCoverIcon(link: CommunityLink): IconName {
  return link.coverIcon ?? communityIcon(link);
}

/** True when any of the link's credited authors is a MuleSoft Ambassador (drives the cover badge). */
export function communityIsAmbassador(link: CommunityLink): boolean {
  return hasAmbassador(link.authors);
}

// Ordered alphabetically by `title` (case-insensitive). Keep new entries in that order.
export const COMMUNITY: CommunityLink[] = [
  {
    id: 'ai-picked-alex-approved',
    title: 'AI Picked, Alex Approved',
    type: 'newsletter',
    url: 'https://www.linkedin.com/newsletters/ai-picked-alex-approved-7348737640038350849/',
    description:
      'MuleSoft, Salesforce, AI, and Claude. News plus honest, practitioner takes, with help from the machines.',
    authors: [AUTHORS['alex-martinez']],
    image: aiPickedAlexApproved,
    coverStyle: 'avatar',
    // Full-bleed purple robot mascot; the tile follows its own diagonal edge tones (deep purple
    // top-left → light lavender bottom-right) so the square sits seamlessly on its own colors.
    coverGradient: ['#7a4edc', '#cf93f6'],
  },
  {
    id: 'another-integration-blog',
    title: 'Another Integration Blog',
    type: 'blog',
    url: 'https://medium.com/another-integration-blog',
    description:
      'A multi-author MuleSoft community publication on Medium — hands-on integration posts spanning CloudHub 2.0, PGP data-in-transit security, VM vs. Anypoint MQ messaging patterns, and automating Anypoint API Manager, alongside AI/Agentforce pieces on MuleSoft Vibes, the Omni Gateway, and governing REST APIs as MCP tools.',
    image: anotherIntegrationBlog,
    coverStyle: 'avatar',
    // The logo is a WHITE rounded-square (teal border, node-grid "M") — vanishes on white, so it
    // sits on a teal backdrop pulled from its own border to read as a framed app icon.
    coverGradient: ['#13847a', '#0a3d38'],
  },
  {
    id: 'bridging-the-gap-blog',
    title: 'Bridging the Gap',
    type: 'blog',
    url: 'https://bridgingthegap.eu.com/',
    description:
      'A vendor-agnostic blog on enterprise application integration — integration patterns and architectural styles (event-driven, broker, API-led), domain-driven design, system coupling, and the sociotechnical side of integration work.',
    authors: [AUTHORS['karol-skrzymowski']],
    image: bridgingTheGapYoutube,
    coverStyle: 'avatar',
    coverGradient: ['#ffffff', '#ffffff'],
  },
  {
    id: 'bridging-the-gap-youtube',
    title: 'Bridging the Gap',
    type: 'youtube',
    url: 'https://www.youtube.com/@BridgingTheGap-eu-com',
    description:
      'The video home of Bridging the Gap, including the "Loosely Coupled" live-stream series where guests discuss API design, cognitive load, stakeholder management, and integration careers.',
    authors: [AUTHORS['karol-skrzymowski']],
    image: bridgingTheGapYoutube,
    coverGradient: ['#ffffff', '#ffffff'],
  },
  {
    id: 'decipher-middleware',
    title: 'DecipherMiddleware',
    type: 'blog',
    url: 'https://blog.deciphermiddleware.in/',
    description:
      'An integration-engineering blog spanning MuleSoft and Oracle SOA/OIC — Anypoint Platform how-tos (Auth0 SSO, CloudHub 2.0 custom domains, DataWeave logging, connecting CLI coding agents to the MuleSoft MCP server), plus Oracle Database and PL/SQL posts and the occasional AI or Raspberry Pi side project.',
    authors: [AUTHORS['pranav-davar']],
  },
  {
    id: 'explore-and-learn-by-nk-youtube',
    title: 'Explore & learn by NK',
    type: 'youtube',
    url: 'https://www.youtube.com/@mdnaseemk',
    description:
      'Naseem Khan’s MuleSoft channel — beginner tutorials (API-led connectivity, Anypoint Code Builder, RAML vs. OAS, Object Store TTL) and AI-integration demos (MuleSoft Vibes custom rules, the Omni Gateway and MCP Bridge, generating MUnit tests), plus a developer-to-architect roadmap, Mule 4 interview Q&A, and Bhagalpur/Bhubaneswar MuleSoft meetup recordings.',
    authors: [AUTHORS['naseem-khan']],
    image: exploreAndLearnByNkYoutube,
    // The channel art is a full-bleed graphic split warm-brown (left) → navy (right); the tile
    // gradient follows that diagonal so the square sits seamlessly on its own edge tones.
    coverGradient: ['#3a2418', '#152238'],
  },
  {
    id: 'flow-state',
    title: 'Flow State',
    type: 'newsletter',
    url: 'https://www.linkedin.com/newsletters/flow-state-7454156473347022848',
    description:
      'A LinkedIn newsletter on AI-driven integration and MuleSoft tips.',
    authors: [AUTHORS['patryk-bandurski']],
    image: flowState,
    coverStyle: 'avatar',
    // Pulled from the logo: its amber network nodes → the dark navy nodes.
    coverGradient: ['#e0a020', '#0f2430'],
  },
  {
    id: 'indresh-gupta-medium',
    title: 'Indresh Gupta on Medium',
    type: 'blog',
    url: 'https://medium.com/@indreshgupta01',
    description:
      'Indresh Gupta’s Medium — MuleSoft and integration posts spanning beginner guides, DataWeave 2.0 practice sessions, and deeper pieces on integration patterns (the sidecar proxy pattern, underrated patterns every developer should know), the correlation and tracing module, Anypoint Partner Manager for B2B, and performance pitfalls like using foreach to aggregate arrays in Mule 4.',
    authors: [AUTHORS['indresh-gupta']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'jitendra-bafna-dzone',
    title: 'Jitendra Bafna on DZone',
    type: 'blog',
    url: 'https://dzone.com/users/2963306/jacky85.html',
    description:
      'Jitendra Bafna’s DZone profile — a deep back catalog of MuleSoft and integration tutorials: exception strategies and error handling in Anypoint Studio, Parallel ForEach vs. ForEach, publishing common assets to Exchange and Nexus, securing data with the Mule Credentials Vault and PGP, MUnit testing, RAML API design, and Apache Camel data-transformation pieces.',
    authors: [AUTHORS['jitendra-bafna']],
    image: jitendraBafnaDzone,
    // The white DZone logo is baked onto DZone's own navy→teal brand gradient, so it fills the tile.
    coverStyle: 'cover',
  },
  {
    id: 'jitendra-bafna-medium',
    title: 'Jitendra Bafna on Medium',
    type: 'blog',
    url: 'https://medium.com/@jitendra.bafna',
    description:
      'Jitendra Bafna’s Medium — a MuleSoft & AI series covering the Omni API Gateway, Agent Fabric, the Agent Scanner, and MCP Server/Bridge, alongside plain-language explainers on federated AI and edge AI.',
    authors: [AUTHORS['jitendra-bafna']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'juan-cruz-basso-youtube',
    title: 'Juan Cruz Basso',
    type: 'youtube',
    url: 'https://www.youtube.com/@JuanCBasso',
    description:
      'A bilingual (Spanish/English) MuleSoft channel — opinion pieces on API-led and API governance, walkthroughs of Mule Vibes, Agent Fabric, and the MCP Server, plus MuleSoft/Agentforce meetup and workshop recordings.',
    authors: [AUTHORS['juan-cruz-basso']],
    // YouTube's brand tile is a white play button on red — muted toward a deep maroon backdrop.
    coverGradient: ['#c8102e', '#4a0d18'],
  },
  {
    id: 'mehak-garg-medium',
    title: 'Mehak Garg on Medium',
    type: 'blog',
    url: 'https://medium.com/@mehakg911',
    description:
      'Mehak Garg’s Medium — hands-on Mule 4 developer posts, including a series on building intelligent integrations with MuleSoft Vibes, end-to-end AI-assisted API development with CurieTech, a custom connector for HashiCorp Vault and a custom policy on Java 17, a TestCase-first approach to MUnit tests, and notes on the Mule Java 17 transition.',
    authors: [AUTHORS['mehak-garg']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'mule4developer-medium',
    title: 'Mule4Developer',
    type: 'blog',
    url: 'https://medium.com/@Mule4Developer',
    description:
      'Darvesh Lodhi’s Medium — hands-on Mule 4 developer posts spanning core integration and AI: building an Omni Gateway proxy API, generating daily transaction files across S3/Azure/SFTP, converting HTML to JSON with generic DataWeave, OpenAPI (OAS) in Mule 4, Salesforce Change Data Capture with MuleSoft, RAML URI vs. query parameters, and fixing connection timeouts and slow API calls.',
    authors: [AUTHORS['darvesh-lodhi']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'mule4developer-youtube',
    title: 'Mule4Developer',
    type: 'youtube',
    url: 'https://www.youtube.com/@mule4developer',
    description:
      'Darvesh Lodhi’s MuleSoft channel — beginner-friendly Anypoint Studio and DataWeave tutorials (creating your first Mule project, Transform Message, cache scope, HTTPS endpoints, map/filter/flatten) alongside short quick-tips and a walkthrough of building an Omni Gateway API proxy to protect any external REST API.',
    authors: [AUTHORS['darvesh-lodhi']],
    image: mule4developerYoutube,
    // White-square mule badge sits app-icon style on a deep teal→navy tile pulled from its own
    // circuitry colors (the white logo square stays white; only the backdrop is colored).
    coverGradient: ['#155e63', '#0a2233'],
  },
  {
    id: 'stuti-tank-youtube',
    title: 'MuleSoft Unleashed',
    type: 'youtube',
    url: 'https://www.youtube.com/@stutitank06',
    description:
      'Stuti Tank’s MuleSoft channel — a daily "MuleSoft DataWeave 2.0" tutorial series (external files, large-payload streaming, CSV/SOAP/multipart handling, performance tuning) plus AI-integration explainers on Agent Fabric, the Omni Gateway, MCP tool discovery, and MuleSoft Vibes.',
    authors: [AUTHORS['stuti-tank']],
    image: stutiTankYoutube,
    // White-square blue-ringed badge sits app-icon style on a blue→navy tile pulled from its own
    // ring color (the white logo square stays white; only the backdrop is colored).
    coverGradient: ['#1e5fb0', '#0a2340'],
  },
  {
    id: 'mulesoft-ai-agentforce-academy-youtube',
    title: 'MuleSoft, AI & Agentforce – Zero to Hero Academy',
    type: 'youtube',
    url: 'https://www.youtube.com/@muletechnologyacademy-zero5625',
    description:
      'Jitendra Bafna’s YouTube academy — a long-running "MuleSoft & AI" episode series on MCP servers, the Omni Gateway, Agent-to-Agent (A2A) integration, and MuleSoft + Valkey/Redis integration.',
    authors: [AUTHORS['jitendra-bafna']],
    image: mulesoftAiAgentforceAcademyYoutube,
    // Pulled from the logo: its bright teal circuitry → the deep navy backdrop.
    coverGradient: ['#0aa2c0', '#052a3d'],
  },
  {
    id: 'mulesoft-techzone',
    title: 'MuleSoft-TechZone',
    type: 'youtube',
    url: 'https://youtube.com/@mulesofttechzone',
    description:
      'A YouTube channel of hands-on MuleSoft tutorials — Mule 4 fundamentals and Anypoint Code Builder, plus step-by-step series on MuleSoft Agent Fabric, Omni Gateway, and MCP, and Agentforce/Agentblazer certification walkthroughs.',
    authors: [AUTHORS['sravan-lingam']],
    image: mulesoftTechzone,
    // Pulled from the channel logo: its badge yellow → the ring's purple.
    coverGradient: ['#e6c93f', '#6020e0'],
  },
  {
    id: 'mule-trains-blog',
    title: 'MuleTrains',
    type: 'blog',
    url: 'https://www.mule.org.in/',
    description:
      'A MuleSoft tutorials blog spanning core integration and agentic AI — DataWeave how-tos (the lines function, finding duplicate values in an array), Mule 4 walkthroughs (generating QR codes with ZXing, integrating Okta OAuth 2.0 OIDC), production-issue troubleshooting, and a beginner series on the MuleSoft DX MCP server, MCP servers, and navigating an Agent Network.',
    authors: [AUTHORS['kancharla-sandeep-sai-kumar']],
  },
  {
    id: 'pranav-davar-medium',
    title: 'Pranav Davar on Medium',
    type: 'blog',
    url: 'https://medium.com/@pranavdavar9',
    description:
      'Pranav Davar’s Medium — hands-on MuleSoft and integration posts, including installing the DataWeave CLI on Windows, custom attributes in Anypoint Partner Manager, and a deep dive on Object Store V2 expiration.',
    authors: [AUTHORS['pranav-davar']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'qa-insights-blog',
    title: 'QAInsights',
    type: 'blog',
    url: 'https://qainsights.com/',
    description:
      'A performance-testing and QA blog centered on Apache JMeter and, increasingly, AI in performance engineering — building an MCP server for JMeter docs, getting AI coding CLIs to test efficiently, and hands-on comparisons of AI dev tools (Feather Wand, Codex, Claude Code) for JMeter work.',
    authors: [AUTHORS['naveen-namachivayam']],
    image: qaInsightsYoutube,
    coverStyle: 'avatar',
    // Pulled from the logo: its amber magnifier → the teal accent.
    coverGradient: ['#ffc040', '#008080'],
  },
  {
    id: 'qa-insights-youtube',
    title: 'QAInsights',
    type: 'youtube',
    url: 'https://www.youtube.com/@QAInsights',
    description:
      'A performance-testing channel on Apache JMeter and AI in performance engineering — JMeter plugin development (AI error-analyst listeners, Ollama assertions, custom functions), JMeter tooling (JMeter Studio, the Prism multi-tab and SuperKey command-center plugins, the PerfAtlas plugin directory), and LLM speed/benchmarking demos.',
    authors: [AUTHORS['naveen-namachivayam']],
    image: qaInsightsYoutube,
    // Pulled from the logo: its amber magnifier → the teal accent.
    coverGradient: ['#ffc040', '#008080'],
  },
  {
    id: 'rahul-kumar-medium',
    title: 'Rahul Kumar on Medium',
    type: 'blog',
    url: 'https://medium.com/@rahulkumarofficial',
    description:
      'Rahul Kumar’s Medium — MuleSoft developer posts, including a multi-part "Mastering Modern MuleSoft Batch Processing" series (DLQ architecture, engine configuration, breaking the synchronous barrier), API policy and DataWeave 2.0 guides, tuning Mule for massive ETL workloads, and fixing common Salesforce errors.',
    authors: [AUTHORS['rahul-kumar']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'sravan-nerella-medium',
    title: 'Sravan Nerella on Medium',
    type: 'blog',
    url: 'https://medium.com/@sravannerella007',
    description:
      'Sravan Nerella’s Medium — posts on MuleSoft Vibes and agent skills, spec-driven development, writing MUnit tests with AI agents, and integration-architecture explainers (reverse proxies vs. load balancers vs. gateways).',
    authors: [AUTHORS['sravan-nerella']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'stuti-tank-medium',
    title: 'Stuti Tank on Medium',
    type: 'blog',
    url: 'https://medium.com/@stutitank06',
    description:
      'Stuti Tank’s Medium — MuleSoft posts on building MCP servers to expose Mule flows as AI tools, Anypoint Platform deployment, VM vs. Anypoint MQ messaging patterns in Mule 4, and advanced DataWeave memory management.',
    authors: [AUTHORS['stuti-tank']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'suman-chatterjee-medium',
    title: 'Suman Chatterjee on Medium',
    type: 'blog',
    url: 'https://medium.com/@sumanc',
    description:
      'Suman Chatterjee’s Medium — MuleSoft and integration posts alongside broader engineering topics: MuleSoft anti-patterns and optimizations, MDC and NDC logging in MuleSoft, the control plane vs. runtime/data plane, networking fundamentals (IPsec, SSL/TLS), algorithm primers (greedy algorithms, time and space complexity), and AI pieces like vectorless retrieval-augmented generation.',
    authors: [AUTHORS['suman-chatterjee']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'upendra-thunuguntla-medium',
    title: 'Upendra Thunuguntla on Medium',
    type: 'blog',
    url: 'https://upendra-thunuguntla.medium.com/',
    description:
      'Upendra Thunuguntla’s Medium — hands-on MuleSoft developer posts on DataWeave scripting, RAML datatypes, CloudHub schedulers, Mule runtime migration (4.4 → 4.6 on JDK 17), and observability with Grafana.',
    authors: [AUTHORS['upendra-thunuguntla']],
    coverIcon: 'medium',
    // Medium's brand tile is near-black behind a white mark.
    coverGradient: ['#242424', '#000000'],
  },
  {
    id: 'your-integration-buddy-youtube',
    title: 'Your Integration Buddy',
    type: 'youtube',
    url: 'https://www.youtube.com/@YourIntegrationBuddy',
    description:
      'A MuleSoft tutorial channel spanning AI and core integration — Agent Fabric, securing an MCP server with MuleSoft, MuleSoft Vibes setup, and the Agent-to-Agent (A2A) protocol, alongside deep dives on Intelligent Document Processing, custom policy implementation, CloudHub 2.0 migration, and Anypoint Code Builder walkthroughs.',
    authors: [AUTHORS['vikas-sharma']],
    image: yourIntegrationBuddyYoutube,
    // The logo is a gold figure/text on a black square — a warm, lighter gold-brown tile lifts the
    // black square off the background and makes the gold read.
    coverGradient: ['#6b5424', '#2b2010'],
  },
];

/**
 * The Community tab splits by medium across two pages. `channels` = video (YouTube); `blogs` =
 * everything you read (blogs, newsletters, portfolios). Keep these two buckets exhaustive over
 * CommunityType — a new `type` must be added to one of them here, or it renders on neither page.
 */
export const CHANNEL_TYPES = ['youtube'] as const satisfies readonly CommunityType[];
export const BLOG_TYPES = ['blog', 'newsletter', 'portfolio'] as const satisfies readonly CommunityType[];

/** Creators shown on /community/blogs — blogs, newsletters, and portfolios, in catalog order. */
export function communityBlogs(): CommunityLink[] {
  return COMMUNITY.filter((c) => (BLOG_TYPES as readonly CommunityType[]).includes(c.type));
}

/** Creators shown on /community/channels — YouTube channels, in catalog order. */
export function communityChannels(): CommunityLink[] {
  return COMMUNITY.filter((c) => (CHANNEL_TYPES as readonly CommunityType[]).includes(c.type));
}
