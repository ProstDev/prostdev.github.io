import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const CATEGORIES = [
  'Challenges',
  'Tutorials',
  'Guides',
  'Opinion',
  'News',
] as const;

/**
 * Canonical tag vocabulary. `tags` is a z.enum over this list, so a typo or an un-approved tag
 * FAILS the build (content sync) naming the offending file — this is what keeps tag sprawl from
 * creeping back (we collapsed 98 free-form tags → this set). To introduce a NEW tag, add it here
 * first, then use it. Keep alphabetized; preserve brand/acronym casing (DataWeave, CloudHub,
 * cURL, macOS, CI/CD, MUnit…). The `.claude/scripts/normalize-tags.mjs` merge map must stay in
 * sync with this list. See CLAUDE.md "Conventions" and the `add-post` skill.
 */
const TAGS = [
  'AI',
  'Algorithms',
  'Anypoint Code Builder',
  'Anypoint Exchange',
  'Anypoint MQ',
  'Anypoint Platform',
  'Anypoint Studio',
  'API',
  'APIKit',
  'AsyncAPI',
  'AWS',
  'Azure DevOps',
  'CI/CD',
  'Claude Code',
  'CloudHub',
  'Content Creation',
  'CurieTech AI',
  'cURL',
  'Data Cloud',
  'DataWeave',
  'Dell Boomi',
  'Docker',
  'Error Handling',
  'Flex Gateway',
  'GitHub',
  'GitHub Actions',
  'Google BigQuery',
  'Grafana',
  'Groovy',
  'Hardware',
  'HTTP',
  'Java',
  'JMS',
  'JSON',
  'JWT',
  'Kafka',
  'Killercoda',
  'Kubernetes',
  'Logging',
  'macOS',
  'Markdown',
  'Maven',
  'Mobile',
  'MuleSoft',
  'MUnit',
  'MySQL',
  'Networking',
  'Ollama',
  'Oracle',
  'PostgreSQL',
  'Postman',
  'Python',
  'RAML',
  'REST',
  'Runtime Fabric',
  'Salesforce',
  'SAML',
  'Security',
  'Smart Home',
  'Solace',
  'SonarQube',
  'Spring',
  'SSO',
  'Testing',
  'Twilio',
  'Visual Studio Code',
] as const;

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /**
       * Post author. Defaults to the site owner; ProstDev is a guest-writer blog, so posts
       * written by someone else MUST set this to the true author (the live Wix JSON-LD
       * `author.name` is the source of truth). Drives the visible byline + JSON-LD on
       * `/post/<slug>`. Normalize the owner to "Alex Martinez" (never "Alexandra Martinez").
       */
      author: z.string().default('Alex Martinez'),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORIES),
      tags: z.array(z.enum(TAGS)).default([]),
      heroImage: image().optional(),
      /** Optional related YouTube video to embed at the top of the post. */
      youtubeId: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const transcripts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/transcripts' }),
  schema: z
    .object({
      /** Optional: note the language or whether it's auto-generated. */
      source: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { blog, transcripts };
export { CATEGORIES, TAGS };
