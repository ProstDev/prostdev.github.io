/**
 * Blog post series catalog for ProstDev.
 *
 * Some blog posts are multi-part series (CI/CD CloudHub Parts 1–6, DataWeave
 * Programming Challenges 1–8, …). This file is the SINGLE SOURCE OF TRUTH for
 * which posts belong to which series and in what order — mirroring src/data/
 * videos.ts, where "array order IS the ordering" (nothing sorts).
 *
 * HOW TO ADD / EDIT A SERIES:
 *   1. Add (or edit) a Series entry below: a stable `id`, a human `title`, and
 *      `posts` — the post slugs (= the .mdx filename without extension, which is
 *      also the CollectionEntry id and the /post/<slug> URL) listed in Part 1 → N
 *      order. Reordering or inserting a part is a one-line array edit here; you do
 *      NOT touch the individual posts.
 *   2. That's it. /post/<slug> renders prev/next arrows + a "jump to any part"
 *      menu, and /post/<slug>.md gets a "## Series" block — all derived from this
 *      list. Titles are resolved from the blog collection at build time (see
 *      getSeriesParts in src/lib/content.ts), so they never drift out of sync.
 *
 * GUARDS (fail the build loudly, like the tag-slug collision guard in content.ts):
 *   - A slug may appear in only ONE series (the import-time IIFE below).
 *   - Every slug must be a real post — checked in getSeriesParts (which has the
 *     collection), throwing and naming the offending slug + series id.
 *
 * Single-post "series" add no navigation value, so only group posts with ≥2 parts.
 */

export interface Series {
  /** Stable id used in code + the .md endpoint. */
  id: string;
  /** Human title for the jump-menu summary + the .md "## Series" heading. */
  title: string;
  /** Post slugs (= filename without extension) in Part 1 → N order. */
  posts: string[];
}

export const SERIES: Series[] = [
  {
    id: 'cicd-cloudhub',
    title: 'CI/CD Pipeline with MuleSoft & GitHub Actions',
    posts: [
      'how-to-set-up-a-ci-cd-pipeline-to-deploy-your-mulesoft-apps-to-cloudhub-using-github-actions',
      'part-2-ci-cd-pipeline-with-mulesoft-and-github-actions-secured-encrypted-properties',
      'part-3-ci-cd-pipeline-with-mulesoft-and-github-actions-munit-testing',
      'part-4-ci-cd-pipeline-with-mulesoft-and-github-actions-munit-minimum-coverage-percentage',
      'part-5-ci-cd-pipeline-with-mulesoft-and-github-actions-enabling-mfa-through-a-connected-app',
      'part-6-ci-cd-pipeline-with-mulesoft-and-github-actions-deploying-to-cloudhub-2-0',
    ],
  },
  {
    id: 'datacloud-mulesoft',
    title: 'Data Cloud + MuleSoft Integration',
    posts: [
      'part-1-data-cloud-mulesoft-integration',
      'part-2-data-cloud-mulesoft-integration',
      'part-3-data-cloud-mulesoft-integration',
      'part-4-data-cloud-mulesoft-integration',
      'part-5-data-cloud-mulesoft-integration',
    ],
  },
  {
    id: 'dataweave-challenges',
    title: 'DataWeave Programming Challenges',
    posts: [
      'dataweave-programming-challenge-1',
      'dataweave-programming-challenge-2',
      'dataweave-programming-challenge-3',
      'dataweave-programming-challenge-4',
      'dataweave-programming-challenge-5',
      'dataweave-programming-challenge-6',
      'dataweave-programming-challenge-7',
      'dataweave-programming-challenge-8',
    ],
  },
  {
    id: 'understanding-apis',
    title: 'Understanding APIs',
    posts: [
      'understanding-apis-part-1-what-is-an-api',
      'understanding-apis-part-2-api-analogies-and-examples',
      'understanding-apis-part-3-what-are-http-methods',
      'understanding-apis-part-4-what-is-a-uri',
      'understanding-apis-part-5-intro-to-postman-and-query-parameters',
      'understanding-apis-part-6-what-are-http-status-codes',
    ],
  },
  {
    id: 'empty-values-dataweave',
    title: 'How to Check for Empty Values in an Array in DataWeave',
    posts: [
      'how-to-check-for-empty-values-in-an-array-in-dataweave-part-1-sizeof-groupby-isempty-default',
      'how-to-check-for-empty-values-in-an-array-in-dataweave-part-2-sizeof-filter-isempty-default',
      'how-to-check-for-empty-values-in-an-array-in-dataweave-part-3-isempty-filter',
      'how-to-check-for-empty-values-in-an-array-in-dataweave-part-4-arrays-module',
    ],
  },
  {
    id: 'github-readme',
    title: 'How to Create a README for Your GitHub Profile',
    posts: [
      'how-to-create-a-readme-file-for-your-github-profile-part-1-intro-to-git-github-and-readme-files',
      'how-to-create-a-readme-file-for-your-github-profile-part-2-markdown-basics',
    ],
  },
  {
    id: 'runtime-fabric-oci',
    title: 'MuleSoft Runtime Fabric on Oracle Cloud Infrastructure (OCI)',
    posts: [
      'mulesoft-runtime-fabric-deployed-on-oracle-cloud-infrastructure-oci-part-1',
      'mulesoft-runtime-fabric-deployed-on-oracle-cloud-infrastructure-oci-part-2-mgmt-operations',
    ],
  },
  {
    id: 'sso-saml-idcs',
    title: 'Anypoint Platform SSO/SAML Configuration with Oracle IDCS',
    posts: [
      'anypoint-platform-single-sign-on-sso-saml-configuration-with-oracle-idcs-part-1',
      'anypoint-platform-single-sign-on-sso-saml-configuration-with-oracle-idcs-part-2',
    ],
  },
  {
    id: 'down-the-rabbit-hole',
    title: 'Down the Rabbit Hole',
    posts: [
      'down-the-rabbit-hole-vol-1-using-gpus-in-mulesoft',
      'down-the-rabbit-hole-vol-2-guis-in-mulesoft',
    ],
  },
  {
    id: 'scatter-gather-mule',
    title: 'Scatter-Gather Integration Pattern (Mule 4)',
    posts: [
      'intro-to-scatter-gather-integration-pattern',
      'scatter-gather-integration-pattern-mule-4-part-2',
    ],
  },
  {
    id: 'reviewing-sorting-algorithms',
    title: 'Reviewing Sorting Algorithms',
    posts: [
      'reviewing-sorting-algorithms-bubble-sort',
      'reviewing-sorting-algorithms-selection-sort',
      'reviewing-sorting-algorithms-insertion-sort',
      'reviewing-sorting-algorithms-merge-sort',
    ],
  },
  {
    id: 'scaffold-mule-flows-studio',
    title: 'Scaffolding Mule Flows from a Published API Spec (Anypoint Studio)',
    posts: [
      'scaffold-mule-flows-from-published-api-specification',
      're-scaffold-mule-flows-exchange-api-spec-studio',
    ],
  },
  {
    id: 'solace-pubsub-mulesoft',
    title: 'Integrate Solace PubSub+ Cloud with MuleSoft',
    posts: [
      'how-to-integrate-solace-pubsub-cloud-with-mulesoft',
      'how-to-integrate-solace-pubsub-cloud-with-mulesoft-negative-scenario-error-handling',
    ],
  },
  {
    id: 'power-of-curl',
    title: 'The Power of cURL',
    posts: [
      'the-power-of-curl',
      'the-power-of-curl-part-ii',
    ],
  },
  {
    id: 'ai-showdown-mulesoft',
    title: 'AI Showdown: MuleSoft Edition (2026)',
    posts: [
      'claude-code-vs-curietech-dataweave',
      'ai-showdown-3-ais-design-api-led-connectivity-in-mulesoft',
      'ai-showdown-hard-mode-claude-code-vs-mulesoft-vibes',
    ],
  },
];

/** The series a post belongs to, or undefined if it isn't part of one. */
export function getSeriesForPost(slug: string): Series | undefined {
  return SERIES.find((s) => s.posts.includes(slug));
}

/** 1-based position of a post within its series (0 if not found). */
export function seriesPosition(series: Series, slug: string): number {
  return series.posts.indexOf(slug) + 1;
}

/**
 * Prev/next slugs within a series, mirroring playlistNeighbors in videos.ts.
 * Returns undefined for a slug at a series boundary (or not in the series).
 */
export function seriesNeighbors(
  series: Series,
  slug: string
): { prev?: string; next?: string } {
  const i = series.posts.indexOf(slug);
  if (i === -1) return {};
  return { prev: series.posts[i - 1], next: series.posts[i + 1] };
}

// Import-time guard: no slug may appear in two series. (Existence of each slug as
// a real post is checked in getSeriesParts, which has collection access.)
(() => {
  const seen = new Map<string, string>();
  for (const s of SERIES) {
    for (const slug of s.posts) {
      if (seen.has(slug)) {
        throw new Error(
          `Series slug collision: "${slug}" is in both "${s.id}" and "${seen.get(slug)}" ` +
            `(src/data/series.ts). A post may belong to only one series.`
        );
      }
      seen.set(slug, s.id);
    }
  }
})();
