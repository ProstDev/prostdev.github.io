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
      /**
       * Curated, genuinely-helpful reader comments preserved from the old Wix site. OPTIONAL;
       * a post with none renders no section. Wix's comment text is client-rendered and NOT
       * recoverable from the page HTML, so these are supplied by the user (copy/screenshot from
       * the live post) and kept VERBATIM — never fabricated. A note may include a code snippet
       * (e.g. a reader's DataWeave solution). Rendered by ReaderNotes.astro + the .md endpoint.
       */
      readerNotes: z
        .array(
          z.object({
            author: z.string(),
            text: z.string().optional(),
            code: z.string().optional(),
            lang: z.string().optional(),
            /**
             * Ordered prose/code segments — use INSTEAD of `text`/`code` when a single comment
             * interleaves prose and code (e.g. a question, then a JSON response, then "In the
             * console:", then a log). Each part is a prose chunk and/or a code block, rendered in
             * order. When present, `parts` takes precedence over the flat `text`/`code` fields.
             */
            parts: z
              .array(
                z.object({
                  text: z.string().optional(),
                  code: z.string().optional(),
                  lang: z.string().optional(),
                })
              )
              .optional(),
            date: z.coerce.date().optional(),
            /** Author this note replies to — renders the note indented/nested as a reply. */
            replyTo: z.string().optional(),
          })
        )
        .optional(),
      /**
       * Optional FAQ section appended to the end of the post for AEO (answer-engine optimization).
       * Renders a `## FAQs` <details> disclosure section (Faqs.astro) AND emits FAQPage JSON-LD on
       * `/post/<slug>` + a `## FAQs` block on `/post/<slug>.md`. A post with none renders no section.
       * HARD RULE: every answer must be grounded in the post's OWN body — never fabricate facts.
       * `answer` is inline prose only (may contain `code` chips + bare URLs; NO block elements —
       * no lists/code fences — so the JSON-LD acceptedAnswer.text stays clean). See the add-faqs skill.
       */
      faqs: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .optional(),
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

/**
 * Shared library of Claude Code / AI-agent SKILLS the author uses — NOT an auto-mirror of the
 * `.claude/` tooling that builds this site (that's a private submodule the build can't read).
 * Each entry is a hand-authored MDX page in `src/content/skills/`, with the verbatim `SKILL.md`
 * pasted into a fenced code block for readers to see + copy. See `/skills`.
 *
 * `tags` is FREE-FORM here (not the closed blog `TAGS` enum): AI-skill topics (Claude Code, MDX,
 * AEO, automation) are a different vocabulary from the MuleSoft/DataWeave blog tags, and a closed
 * enum would fail the build on every new tag — friction against the paste-in workflow. Promote to
 * a closed `SKILL_TAGS` enum only if we later want tag-archive/filter pages.
 */
const skills = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/skills' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /** Short hook shown under the title on the detail page. */
      tagline: z.string().optional(),
      difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      /** Optional Icon.astro name rendered on the card/detail header. */
      icon: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog, transcripts, skills };
export { CATEGORIES, TAGS };
