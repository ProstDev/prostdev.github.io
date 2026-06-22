/**
 * Manual video catalog for ProstDev.
 *
 * HOW TO ADD A NEW VIDEO:
 *   1. Add a Video entry to VIDEOS below with its youtubeId, a unique `slug`,
 *      title, description, and the playlist id(s) it belongs to. Keep a
 *      multi-part series CONTIGUOUS in Part 1 → N order (section pages + the
 *      prev/next pager read array order; nothing sorts).
 *   2. Prepend its `slug` to LATEST_SLUGS (below the array) — that hand-ordered,
 *      newest-first list (across ALL playlists) is what drives the homepage
 *      "Latest videos" row. It is intentionally separate from VIDEOS array order.
 *      (The featured HERO is separate again: it's FEATURED_SLUG — the most-viewed
 *      pick — not necessarily the newest upload.)
 *   3. (Optional) Add a transcript at src/content/transcripts/<youtubeId>.md
 *      to make it AI-readable + searchable.
 *   4. Commit & push — the deploy rebuilds the site.
 *
 * LOWER-PRIORITY ("MORE FROM THE CHANNEL") PLAYLISTS:
 *   Mark a back-catalog/niche playlist with `tier: 'more'` (see the Playlist type) and
 *   append it to the END of PLAYLISTS. Such playlists are kept OFF the homepage and only
 *   surfaced on /videos (search, sitemap, and llms.txt still index every video). Their
 *   videos are findable, not focal — so do NOT add their slugs to LATEST_SLUGS (that list
 *   feeds the homepage Latest row, which would make them focal).
 */

export interface Playlist {
  /** Stable id used to link videos -> playlists and to build section pages. */
  id: string;
  /** Page slug (also used by section pages where applicable). */
  slug: string;
  title: string;
  description: string;
  /** Year(s) the series was published, e.g. "2023" or "2023–2024" — shown under the title on /videos. */
  years?: string;
  /** YouTube playlist URL for a "watch full playlist" link. */
  playlistUrl?: string;
  /**
   * Prominence tier. Omitted/`'primary'` = focal: shown on the homepage and may have a
   * dedicated nav/section page. `'more'` = lower-priority back-catalog: kept OFF the
   * homepage, surfaced only on /videos (plus search, sitemap, and llms.txt, which index
   * every video automatically). Findable, not focal.
   */
  tier?: 'primary' | 'more';
}

export interface Video {
  youtubeId: string;
  /** URL slug -> /video/<slug>. Keep stable once published. */
  slug: string;
  title: string;
  description: string;
  /** Playlist ids this video belongs to (first is treated as primary). */
  playlists: string[];
  /** e.g. "26:45" — shown on cards. */
  duration?: string;
  /** ISO date (YYYY-MM-DD) — used for ordering/JSON-LD when present. */
  publishedAt?: string;
  /** External resources for the video (GitHub repo, Playground links, docs). */
  links?: { label: string; url: string }[];
}

export const PLAYLISTS: Playlist[] = [
  {
    id: 'ai-showdown',
    slug: 'mulesoft-ai',
    title: 'AI Showdown: MuleSoft Edition (2026)',
    years: '2026',
    description:
      'Comparing AI coding tools (Claude, CurieTech, and more) for MuleSoft developers in 2026. Each video puts two or more AIs head-to-head on the same DataWeave or MuleSoft challenge — same input, same expected output, side-by-side execution times and code reviews.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hi-88p-_FNUezYCHrEF_bjl',
  },
  {
    id: 'learn-acb',
    slug: 'learn-acb',
    title: 'Learn Anypoint Code Builder (ACB)',
    years: '2025',
    description:
      "Your go-to guide for getting started with Anypoint Code Builder (ACB) — MuleSoft's next-generation IDE for API development. Whether you're a beginner or transitioning from Studio, learn how to design, implement, test, and deploy APIs using ACB's modern developer tools.",
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hh9SszYvsAnLYiV9-WCpqPP',
  },
  {
    id: 'mulesoft-ai-2025',
    slug: 'adventures-mulesoft-ai',
    title: 'Adventures in MuleSoft + AI (2025)',
    years: '2025',
    description:
      'Exploring what happens when you mix APIs, integrations, and AI tooling. Real experiments with Cursor, CurieTech AI, and MuleSoft.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hhX9c0mNlV68IONicyEh4fo',
  },
  {
    id: 'mulesoft-from-start',
    slug: 'mulesoft-from-start',
    title: "MuleSoft from Start: A Beginner's Guide",
    years: '2023',
    description:
      'We walk through the basics of MuleSoft, API-led connectivity, and how to start building integrations using Anypoint Platform and Anypoint Studio.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hhqwnhkIlyhbgra4kPZKc9x',
  },
  {
    // Lower-priority ('more' tier): kept off the homepage + nav, surfaced on /videos
    // (listed after the primary series). Its /curietech section page is still reachable
    // (the /videos row heading links to it via sectionHref) — see SECTION_PAGE_SLUGS.
    id: 'curietech',
    slug: 'curietech',
    title: 'From Zero to API with MuleSoft, CurieTech AI & Anypoint Code Builder (2025)',
    years: '2025',
    description:
      'A step-by-step series that goes from absolutely nothing to a fully functional MuleSoft API — with the help of CurieTech AI and Anypoint Code Builder (ACB). Watch how AI accelerates every part of the development process, from API spec generation to implementation, testing, and deployment.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hi6woWDZhkLHU-ZudF9k5kW',
    tier: 'more',
  },
  {
    // Lower-priority ('more' tier): kept off the homepage + nav, surfaced on /videos.
    // Has a /cicd-github-actions section page (in SECTION_PAGE_SLUGS) so its videos'
    // breadcrumbs resolve — reachable but NOT in the nav.
    id: 'cicd-github-actions',
    slug: 'cicd-github-actions',
    title: 'MuleSoft CI/CD with GitHub Actions',
    years: '2023–2024',
    description:
      'Build a complete CI/CD pipeline to deploy your MuleSoft apps with GitHub Actions — from a basic CloudHub deploy to encrypted properties, MUnit testing with coverage gates, Connected App authentication for MFA, and deploying to CloudHub 2.0.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hgKOR7uvNsfXOZrXyFVQUHt',
    tier: 'more',
  },
  {
    // Lower-priority ('more' tier): kept off the homepage + nav, surfaced on /videos.
    // Has a /datacloud-mulesoft section page (in SECTION_PAGE_SLUGS) so its videos'
    // breadcrumbs resolve — reachable but NOT in the nav.
    id: 'datacloud-mulesoft',
    slug: 'datacloud-mulesoft',
    title: 'Data Cloud + MuleSoft Integration',
    years: '2024',
    description:
      'Integrate Salesforce Data Cloud with MuleSoft end to end — set up the Connected App, Ingestion API, and Data Stream, deploy a ready-made Mule app to CloudHub, call it from Postman, secure it with basic authentication in API Manager, and load data with the bulk operations.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6himjzGQytbUTg0rkMmbO6uC',
    tier: 'more',
  },
  {
    // Lower-priority ('more' tier): kept off the homepage + nav, surfaced on /videos.
    // Has a /dataweave-challenges section page (in SECTION_PAGE_SLUGS) so its videos'
    // breadcrumbs resolve — reachable but NOT in the nav.
    id: 'dataweave-challenges',
    slug: 'dataweave-challenges',
    title: 'DataWeave Challenges',
    years: '2023',
    description:
      'A series of bite-sized DataWeave programming challenges — each video sets up a puzzle (max-of-paragraphs, Rock Paper Scissors scoring, palindromes, Tower of Hanoi, tail recursion, and more) for you to solve on the DataWeave Playground, with clues and full solutions in the companion ProstDev article.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hi0mJJ--sykGIhKVLrGCN-v',
    tier: 'more',
  },
  {
    // Lower-priority ('more' tier): kept off the homepage + nav, surfaced on /videos.
    // Has a /getting-to-the-point section page (in SECTION_PAGE_SLUGS) so its videos'
    // breadcrumbs resolve — reachable but NOT in the nav.
    id: 'getting-to-the-point',
    slug: 'getting-to-the-point',
    title: 'Getting to the point',
    years: '2020–2021',
    description:
      'Bite-sized MuleSoft and DataWeave 2.0 tips, each explained in under 30 seconds — quick answers to common questions like concatenating objects, extracting digits, match/case, and date math with the Periods module.',
    playlistUrl:
      'https://www.youtube.com/playlist?list=PLb61lESgk6hg9lR-FYLup2zyyOLuirmLP',
    tier: 'more',
  },
];

export const VIDEOS: Video[] = [
  {
    youtubeId: 'C0QB4Z1LwxM',
    slug: 'claude-code-vs-curietech-advent-of-code-dataweave',
    title:
      'Claude Code vs CurieTech AI: Solving Advent of Code 2025 Days 1 & 2 in DataWeave (MuleSoft)',
    description:
      'Two AI coding tools go head-to-head solving Advent of Code 2025 in DataWeave. Who writes cleaner, faster MuleSoft transformations — Claude Code or CurieTech AI?',
    playlists: ['ai-showdown'],
    duration: '26:45',
    publishedAt: '2026-05-28',
    links: [
      {
        label: 'GitHub repo — all solutions + Playground links',
        url: 'https://github.com/alexandramartinez/adventofcode-2025',
      },
    ],
  },
  {
    youtubeId: '9cOjP7x2DLk',
    slug: 'cursor-ai-acb-build-mulesoft-apps-test-drive',
    title: 'Can AI Build MuleSoft Apps? Cursor AI + Anypoint Code Builder Test Drive',
    description:
      'Putting Cursor AI together with Anypoint Code Builder to see whether an AI editor can actually build a working MuleSoft app.',
    playlists: ['mulesoft-ai-2025'],
    duration: '27:22',
    links: [
      {
        label: 'GitHub repo — Mule best practice template',
        url: 'https://github.com/alexandramartinez/mule-best-practice-template',
      },
    ],
  },
  {
    youtubeId: 'pH_rZN8MCEw',
    slug: 'cursor-ai-recreate-mulesoft-project-best-practices',
    title:
      'Can Cursor AI Recreate a MuleSoft Project Using Best Practices? (Spoiler: Not Really)',
    description:
      'Asking Cursor AI to rebuild a MuleSoft project following best practices — and seeing where it falls short without guidance.',
    playlists: ['mulesoft-ai-2025'],
    duration: '13:28',
    links: [
      {
        label: 'GitHub repo — Mule best practice template',
        url: 'https://github.com/alexandramartinez/mule-best-practice-template',
      },
    ],
  },
  {
    youtubeId: '8qEXJRJX27E',
    slug: 'teaching-cursor-ai-mulesoft-best-practices-rules',
    title: 'Teaching Cursor AI Best Practices for MuleSoft with Rules (Big Improvement!)',
    description:
      'Using Cursor rules to teach the AI MuleSoft best practices — and the big jump in code quality that results.',
    playlists: ['mulesoft-ai-2025'],
    duration: '30:31',
    links: [
      {
        label: 'Cursor rules MDC file (gist)',
        url: 'https://gist.github.com/alexandramartinez/672974672611fd1d44c47f0b0918d79e',
      },
      {
        label: 'GitHub repo — Mule best practice template (from Part 1)',
        url: 'https://github.com/alexandramartinez/mule-best-practice-template',
      },
    ],
  },
  {
    youtubeId: 'bbHcjmtFdiI',
    slug: 'curietech-ai-real-world-dataweave-challenges',
    title: 'CurieTech AI vs Real-World DataWeave Challenges – Did It Deliver?',
    description:
      'Throwing real-world DataWeave transformation challenges at CurieTech AI to see how it handles practical MuleSoft problems.',
    playlists: ['mulesoft-ai-2025'],
    duration: '20:56',
    links: [
      {
        label: 'Challenge 1 — DataWeave Programming Challenge 4',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-4',
      },
      {
        label: 'Challenge 2 — DataWeave Programming Challenge 7',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-7',
      },
    ],
  },
  {
    youtubeId: 'J3A-3HhOAVk',
    slug: 'curietech-ai-fastest-dataweave-code',
    title: 'Is CurieTech AI Smart Enough to Pick the Fastest DataWeave Code?',
    description:
      'Testing whether CurieTech AI can identify and generate the fastest-performing DataWeave solution among the options.',
    playlists: ['mulesoft-ai-2025'],
    duration: '06:09',
    links: [
      {
        label: 'Blog post — DataWeave map/filter vs reduce: which is faster?',
        url: 'https://www.prostdev.com/post/exposing-dataweave-map-filter-vs-reduce-which-is-faster',
      },
    ],
  },
  {
    youtubeId: 'x0WgKgeH2kE',
    slug: 'cursor-vs-curietech-munit-tests-mulesoft',
    title: 'Cursor AI vs CurieTech AI: Who Writes Better MUnit Tests for MuleSoft?',
    description:
      'A head-to-head comparison of Cursor AI and CurieTech AI generating MUnit tests for a MuleSoft application.',
    playlists: ['mulesoft-ai-2025'],
    duration: '18:26',
    links: [
      {
        label: 'GitHub repo — MUnit test results from CurieTech AI',
        url: 'https://github.com/alexandramartinez/my-process-api-munits-curietechai',
      },
    ],
  },
  {
    youtubeId: 'vguu_u0OQNE',
    slug: 'curietech-ai-mulesoft-best-practices-github-pr',
    title:
      'CurieTech AI Wrote My MuleSoft Best Practices — AND Opened a GitHub Pull Request!',
    description:
      'CurieTech AI documents MuleSoft best practices and goes a step further by opening a GitHub pull request on its own.',
    playlists: ['mulesoft-ai-2025'],
    duration: '07:12',
    links: [
      {
        label: 'GitHub repo — with the generated pull request',
        url: 'https://github.com/alexandramartinez/test',
      },
      {
        label: 'Cursor MDC file with best practices used (gist)',
        url: 'https://gist.github.com/alexandramartinez/672974672611fd1d44c47f0b0918d79e',
      },
    ],
  },
  {
    youtubeId: 'x1_aMbHr3w4',
    slug: 'curietech-ai-code-insights-single-multi-repo-review-lens',
    title:
      "Testing CurieTech AI's Code Insights: Single Repo, Multi Repo, and Code Review Lens",
    description:
      "Exploring CurieTech AI's Code Insights across a single repo, multiple repos, and its code review lens for MuleSoft projects.",
    playlists: ['mulesoft-ai-2025'],
    duration: '10:24',
    links: [
      {
        label: 'GitHub repo — test repo with PR',
        url: 'https://github.com/alexandramartinez/test',
      },
      {
        label: 'Cursor best practices rules file (used in CurieTech too) (gist)',
        url: 'https://gist.github.com/alexandramartinez/672974672611fd1d44c47f0b0918d79e',
      },
    ],
  },
  {
    youtubeId: 'U8KChXTgABw',
    slug: 'generate-oas-raml-specs-curietech-ai-api-spec-generator',
    title:
      "Generate OAS & RAML Specifications Instantly with CurieTech AI's API Spec Generator Agent",
    description:
      "Using CurieTech AI's API Spec Generator agent to instantly produce OAS and RAML specifications for a MuleSoft API.",
    playlists: ['mulesoft-ai-2025'],
    duration: '09:33',
  },
  {
    youtubeId: 'dlODB4cjXyU',
    slug: 'why-start-using-anypoint-code-builder',
    title: 'Why You Should Start Using Anypoint Code Builder (Even If You Love Studio)',
    description:
      "An honest look at why Studio developers should give Anypoint Code Builder a try — what's better, what's different, and what to expect.",
    playlists: ['learn-acb'],
    duration: '11:56',
    links: [
      { label: 'Git — downloads', url: 'https://git-scm.com/downloads' },
      { label: 'Visual Studio Code', url: 'https://code.visualstudio.com/' },
      { label: 'Cursor AI', url: 'https://cursor.com' },
    ],
  },
  {
    youtubeId: 'GgCUNWGDaS4',
    slug: 'getting-started-acb-vscode-hello-world',
    title:
      'Getting Started with MuleSoft Anypoint Code Builder (ACB) in VS Code | Beginner Setup + Hello World',
    description:
      'Install Anypoint Code Builder in VS Code and build your first "Hello World" Mule app from scratch.',
    playlists: ['learn-acb'],
    duration: '25:54',
  },
  {
    youtubeId: 'cki1MOLC1CE',
    slug: 'design-rest-api-acb-openapi',
    title:
      'How to Design a REST API in Anypoint Code Builder (OpenAPI + VS Code + Exchange) (Part 1)',
    description:
      'Design a REST API spec using OpenAPI inside Anypoint Code Builder and publish it to Exchange.',
    playlists: ['learn-acb'],
    duration: '15:40',
  },
  {
    youtubeId: 'SIcxoyL5NtY',
    slug: 'scaffold-api-spec-acb-project-tour',
    title:
      'Scaffold an API Spec in Anypoint Code Builder (ACB) + VS Code Project Tour & Tips (Part 2)',
    description:
      'Scaffold a Mule project from your published OpenAPI spec in Anypoint Code Builder, then tour the generated flows in both XML and UI views and run it locally.',
    playlists: ['learn-acb'],
    duration: '11:07',
  },
  {
    youtubeId: '5xgb0bbzWBs',
    slug: 'import-jars-anypoint-code-builder',
    title: 'Apparently I Lied: How to Import JARs in Anypoint Code Builder (ACB)',
    description:
      'A correction to an earlier video — you actually CAN import a JAR into ACB. Export a deployable archive from Studio, then import it as a fresh ACB project.',
    playlists: ['learn-acb'],
    duration: '06:02',
  },
  {
    youtubeId: 'uV_ncdIoJQI',
    slug: 'implementing-apis-acb-mysql-docker',
    title: 'Start Implementing APIs in Anypoint Code Builder (ACB) with MySQL + Docker (Part 3)',
    description:
      'Start implementing your scaffolded API in ACB: spin up a MySQL database in Docker and build the GET-all-tasks flow with DataWeave-generated SQL.',
    playlists: ['learn-acb'],
    duration: '26:06',
    links: [
      {
        label: 'GitHub repo — todo-api-impl',
        url: 'https://github.com/alexandramartinez/todo-api-impl',
      },
      {
        label: 'docker-compose.yml (gist)',
        url: 'https://gist.github.com/alexandramartinez/3174ad0bc44ed1c7031e479522968a66',
      },
      {
        label: 'create-table-template.sql (gist)',
        url: 'https://gist.github.com/alexandramartinez/1531f62f4fdab02056c74d8df7963d03',
      },
      {
        label: 'get-all-tasks.xml (gist)',
        url: 'https://gist.github.com/alexandramartinez/7afb5fb85bb1e9425fe7f77e2587cd7a',
      },
      {
        label: 'get-all-tasks-request.dwl (gist)',
        url: 'https://gist.github.com/alexandramartinez/88723e3d977e854b5390cc863ccd9328',
      },
      {
        label: 'get-all-tasks-response.dwl (gist)',
        url: 'https://gist.github.com/alexandramartinez/594c0e5e68babcebee89bc48dd9ed871',
      },
    ],
  },
  {
    youtubeId: '_GY38ZvP8fI',
    slug: 'acb-full-crud-mysql-docker-debugging',
    title:
      'MuleSoft Anypoint Code Builder (ACB) Full CRUD Tutorial | MySQL + Docker + Debugging (Part 4)',
    description:
      'Build a complete CRUD REST API in Anypoint Code Builder backed by MySQL running in Docker, then debug it locally.',
    playlists: ['learn-acb'],
    duration: '36:42',
    links: [
      {
        label: 'GitHub repo — todo-api-impl',
        url: 'https://github.com/alexandramartinez/todo-api-impl',
      },
    ],
  },
  {
    youtubeId: '_tCTfZ4YkH0',
    slug: 'handling-404-errors-acb-choice-raise-error',
    title:
      "Handling 404 Errors in MuleSoft's Anypoint Code Builder (ACB) | Choice + Raise Error (Part 5)",
    description:
      'Add robust error handling to your ACB API: use the Choice router and Raise Error to return clean 404 responses when a resource is not found.',
    playlists: ['learn-acb'],
    duration: '11:49',
    links: [
      {
        label: 'GitHub repo — todo-api-impl',
        url: 'https://github.com/alexandramartinez/todo-api-impl',
      },
    ],
  },
  {
    youtubeId: 'aAHpfYED3So',
    slug: 'generate-oas-api-spec-curietech-ai',
    title: 'Generating an OAS API Spec with CurieTech AI | MuleSoft API Designer (Part 1)',
    description:
      'Let CurieTech AI generate an OpenAPI (OAS) spec for a To-Do Task Management API, then refine it in API Designer.',
    playlists: ['curietech'],
    duration: '10:06',
    links: [
      {
        label: 'GitHub repo — todo-app-mule-curietechai',
        url: 'https://github.com/alexandramartinez/todo-app-mule-curietechai',
      },
    ],
  },
  {
    youtubeId: 'NbjMNK5XUAw',
    slug: 'implement-crud-rest-api-acb-curietech-ai',
    title:
      'Implementing the CRUD REST API in Anypoint Code Builder with CurieTech AI | MuleSoft App (Part 2)',
    description:
      'CurieTech AI implements the full CRUD REST API in Anypoint Code Builder, wiring up the flows, MySQL database connector, and externalized properties.',
    playlists: ['curietech'],
    duration: '23:29',
    links: [
      {
        label: 'GitHub repo — todo-app-mule-curietechai',
        url: 'https://github.com/alexandramartinez/todo-app-mule-curietechai',
      },
    ],
  },
  {
    youtubeId: '6mhbcYTLaMo',
    slug: 'debugging-mulesoft-api-curietech-ai-acb-postman',
    title:
      'Debugging MuleSoft API with CurieTech AI & Anypoint Code Builder | Local & Postman (Part 3)',
    description:
      'Run and debug the To-Do CRUD API locally — fixing SQL syntax with parameterized queries, the auto-increment ID, and the update flow using ACB breakpoints and Postman.',
    playlists: ['curietech'],
    duration: '16:58',
    links: [
      {
        label: 'GitHub repo — todo-app-mule-curietechai',
        url: 'https://github.com/alexandramartinez/todo-app-mule-curietechai',
      },
    ],
  },
  {
    youtubeId: '79x16XivYXQ',
    slug: 'generate-munit-tests-mulesoft-curietech-ai',
    title: 'Generating MUnit Tests for MuleSoft APIs with CurieTech AI | Test Coverage (Part 4)',
    description:
      "Use CurieTech AI's MUnit Test Generator to create passing tests for each flow, then merge the pull requests and push coverage toward 100%.",
    playlists: ['curietech'],
    duration: '19:39',
    links: [
      {
        label: 'GitHub repo — todo-app-mule-curietechai',
        url: 'https://github.com/alexandramartinez/todo-app-mule-curietechai',
      },
    ],
  },
  {
    youtubeId: 'EE1QLCuzGVk',
    slug: 'build-mcp-server-10-minutes-curietech-ai',
    title:
      'I Built a Full MCP Server in 10 Minutes Using CurieTech AI -- WHAT?! | YouTube API | MuleSoft | ACB',
    description:
      'Build a working YouTube MCP server with MuleSoft and CurieTech AI in about 10 minutes.',
    playlists: ['mulesoft-ai-2025'],
    duration: '25:20',
    links: [
      {
        label: 'GitHub repo — full code + setup instructions',
        url: 'https://github.com/alexandramartinez/youtube-mcp-server-mule',
      },
    ],
  },
  {
    youtubeId: 'xzi8peU87v0',
    slug: 'mulesoft-from-start-planning-the-outline',
    title: "Session 0: Planning the Outline | MuleSoft from Start: A Beginner's Guide",
    description:
      'Kick off the beginner series by planning what we will build and learn across the MuleSoft from Start guide.',
    playlists: ['mulesoft-from-start'],
    duration: '38:02',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'I6BWPoD639A',
    slug: 'mulesoft-from-start-mulesoft-overview',
    title: "Session 1: MuleSoft Overview | MuleSoft from Start: A Beginner's Guide",
    description:
      'A high-level overview of what MuleSoft is, the Anypoint Platform, and how the pieces fit together.',
    playlists: ['mulesoft-from-start'],
    duration: '34:47',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'M4gYW2o9IKc',
    slug: 'mulesoft-from-start-what-is-an-api',
    title:
      "Session 2: What is an API? and API-Led Connectivity? | MuleSoft from Start: A Beginner's Guide",
    description:
      'Understand APIs and the API-led connectivity approach that underpins MuleSoft integration design.',
    playlists: ['mulesoft-from-start'],
    duration: '35:39',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'XIrCqwmTPQs',
    slug: 'mulesoft-from-start-design-api-specification',
    title:
      "Session 3: Design an API Specification in Design Center | MuleSoft from Start: A Beginner's Guide",
    description:
      'Design a blog REST API from scratch — write down the requirements, then build the API specification in Anypoint Platform Design Center.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'ho5GQJD8Hxo',
    slug: 'mulesoft-from-start-test-publish-api-spec',
    title:
      "Session 4: Test & Publish the API Spec to Exchange | MuleSoft from Start: A Beginner's Guide",
    description:
      'Finish the API specification, test it with the mocking service, publish it to Exchange, and scaffold the implementation in Anypoint Studio with APIkit.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'K9ntwKz9vds',
    slug: 'mulesoft-from-start-develop-api-anypoint-studio',
    title:
      "Session 5: Develop the API in Anypoint Studio | MuleSoft from Start: A Beginner's Guide",
    description:
      'Implement the API in Anypoint Studio — global elements, per-environment property files, and an Object Store-backed flow for the articles resource.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: '75IJ1WFa9iA',
    slug: 'mulesoft-from-start-debug-mule-application',
    title:
      "Session 6: Debug the Mule Application in Anypoint Studio | MuleSoft from Start: A Beginner's Guide",
    description:
      'Refactor the Mule app into per-resource config files and subflows, then step through it with the Anypoint Studio debugger, breakpoints, and the DataWeave Playground.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'SUwnqoq8ZbI',
    slug: 'mulesoft-from-start-deploy-cloudhub-runtime-manager',
    title:
      "Session 7: Deploy the Mule App to CloudHub Runtime Manager | MuleSoft from Start: A Beginner's Guide",
    description:
      'Deploy the finished Mule application to CloudHub from Anypoint Studio, set the environment property, and test the live API and Object Store in Runtime Manager.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'OWfqLMPQMpE',
    slug: 'mulesoft-from-start-cicd-api-autodiscovery',
    title:
      "Session 8: Set up CI/CD & API Autodiscovery (API Manager) | MuleSoft from Start: A Beginner's Guide",
    description:
      'Wire up a CI/CD pipeline with GitHub Actions and connect the deployed app to API Manager with API autodiscovery to secure it with a basic authentication policy.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'PYOBr3I2rk0',
    slug: 'mulesoft-from-start-munit-testing',
    title:
      "Session 9: Test your Mule app with MUnit testing | MuleSoft from Start: A Beginner's Guide",
    description:
      'Wrap up the series by testing the Mule application with MUnit — writing tests manually and exploring how to add them to a CI/CD pipeline.',
    playlists: ['mulesoft-from-start'],
    duration: '—',
    links: [
      {
        label: 'GitHub repo — mulesoft-from-start',
        url: 'https://github.com/alexandramartinez/mulesoft-from-start',
      },
    ],
  },
  {
    youtubeId: 'fcFJ3Jhgaw4',
    slug: 'cicd-mulesoft-github-actions-cloudhub-deploy',
    title:
      'Part 1: How to set up a CI/CD pipeline to deploy your MuleSoft apps to CloudHub using GitHub Actions',
    description:
      'Set up your first CI/CD pipeline with GitHub Actions to build and deploy a Mule application to CloudHub — split into build and deploy jobs, with Anypoint Platform credentials stored as GitHub repository secrets.',
    playlists: ['cicd-github-actions'],
    links: [
      {
        label: 'ProstDev article — Part 1',
        url: 'https://www.prostdev.com/post/how-to-set-up-a-ci-cd-pipeline-to-deploy-your-mulesoft-apps-to-cloudhub-using-github-actions',
      },
    ],
  },
  {
    youtubeId: 'qao50tJn_zs',
    slug: 'cicd-mulesoft-github-actions-encrypted-properties',
    title:
      'Part 2: CI/CD pipeline with MuleSoft and GitHub Actions - secured/encrypted properties',
    description:
      'Extend the CI/CD pipeline to decrypt secure properties at deploy time — store the decryption key as a GitHub secret, pass it through the Maven command, and wire it to the secure.key property in the pom.xml.',
    playlists: ['cicd-github-actions'],
    links: [
      {
        label: 'ProstDev article — Part 2',
        url: 'https://www.prostdev.com/post/part-2-ci-cd-pipeline-with-mulesoft-and-github-actions-secured-encrypted-properties',
      },
    ],
  },
  {
    youtubeId: 'ksAOahtpd6g',
    slug: 'cicd-mulesoft-github-actions-munit-testing',
    title:
      'Part 3: CI/CD pipeline with MuleSoft and GitHub Actions - MUnit testing',
    description:
      'Add a test job that runs your MUnit tests in the CI/CD pipeline — set up Nexus Enterprise credentials as GitHub secrets and a .maven/settings.xml so the build can resolve the MuleSoft EE repository.',
    playlists: ['cicd-github-actions'],
    links: [
      {
        label: 'ProstDev article — Part 3',
        url: 'https://www.prostdev.com/post/part-3-ci-cd-pipeline-with-mulesoft-and-github-actions-munit-testing',
      },
    ],
  },
  {
    youtubeId: 'DKQA5gRXvn0',
    slug: 'cicd-mulesoft-github-actions-munit-coverage',
    title:
      'Part 4: CI/CD pipeline with MuleSoft and GitHub Actions - MUnit minimum coverage percentage',
    description:
      'Enforce a minimum MUnit coverage percentage in the pipeline — configure failBuild and required coverage in the pom.xml, and upload the MUnit coverage reports as workflow artifacts.',
    playlists: ['cicd-github-actions'],
    links: [
      {
        label: 'ProstDev article — Part 4',
        url: 'https://www.prostdev.com/post/part-4-ci-cd-pipeline-with-mulesoft-and-github-actions-munit-minimum-coverage-percentage',
      },
      {
        label: 'Maven Configuration for Coverage docs',
        url: 'https://docs.mulesoft.com/munit/latest/coverage-maven-concept',
      },
    ],
  },
  {
    youtubeId: 'jvtw3fcSyKY',
    slug: 'cicd-mulesoft-github-actions-connected-app-mfa',
    title:
      'Part 5: CI/CD pipeline with MuleSoft and GitHub Actions - Enabling MFA through a Connected App',
    description:
      'Authenticate the pipeline with a Connected App instead of a username/password so it works with MFA-enabled Enterprise accounts — create the app and scopes in Access Management, then wire its client ID and secret through GitHub secrets and the pom.xml.',
    playlists: ['cicd-github-actions'],
    links: [
      {
        label: 'ProstDev article — Part 5',
        url: 'https://www.prostdev.com/post/part-5-ci-cd-pipeline-with-mulesoft-and-github-actions-enabling-mfa-through-a-connected-app',
      },
    ],
  },
  {
    youtubeId: 'hfQaYcjUB9c',
    slug: 'cicd-mulesoft-github-actions-cloudhub-2',
    title:
      'Part 6: CI/CD pipeline with MuleSoft and GitHub Actions - Deploying to CloudHub 2.0',
    description:
      'Deploy a Mule application to CloudHub 2.0 with GitHub Actions — configure the pom.xml for CloudHub 2.0, publish to Exchange, and authenticate with a Connected App via a Maven settings.xml.',
    playlists: ['cicd-github-actions'],
    links: [
      {
        label: 'ProstDev article — Part 6',
        url: 'https://www.prostdev.com/post/part-6-ci-cd-pipeline-with-mulesoft-and-github-actions-deploying-to-cloudhub-2-0',
      },
      {
        label: 'GitHub repo — github-actions (cloudhub2 branch)',
        url: 'https://github.com/alexandramartinez/github-actions/tree/cloudhub2',
      },
    ],
  },
  {
    youtubeId: 'WVkf2ni-S6s',
    slug: 'datacloud-mulesoft-connected-app-ingestion-api-data-stream',
    title:
      'Data Cloud/MuleSoft Integration Part 1: Connected App, Ingestion API, & Data Stream (Salesforce)',
    description:
      'Set up everything Salesforce Data Cloud needs before the MuleSoft integration — create the Connected App with CDP scopes, enable the username/password OAuth flow, configure the Ingestion API and its schema, and deploy a Data Stream.',
    playlists: ['datacloud-mulesoft'],
    links: [
      {
        label: 'ProstDev article — Part 1',
        url: 'https://www.prostdev.com/post/part-1-data-cloud-mulesoft-integration',
      },
      {
        label: 'GitHub repo — datacloud-mulesoft-integration',
        url: 'https://github.com/alexandramartinez/datacloud-mulesoft-integration',
      },
    ],
  },
  {
    youtubeId: 'A48011haXRw',
    slug: 'datacloud-mulesoft-deploy-mule-app-cloudhub',
    title:
      'Data Cloud/MuleSoft Integration Part 2: Deploy your own Mule app on Anypoint Platform (CloudHub)',
    description:
      'No MuleSoft experience needed — download the prebuilt integration JAR and deploy it to CloudHub 2.0 from Runtime Manager, set the Salesforce/CDP credentials as protected properties, and grab the public endpoint URL.',
    playlists: ['datacloud-mulesoft'],
    links: [
      {
        label: 'ProstDev article — Part 2',
        url: 'https://www.prostdev.com/post/part-2-data-cloud-mulesoft-integration',
      },
      {
        label: 'GitHub repo — datacloud-mulesoft-integration',
        url: 'https://github.com/alexandramartinez/datacloud-mulesoft-integration',
      },
    ],
  },
  {
    youtubeId: 'CNAnWwUxycg',
    slug: 'datacloud-mulesoft-call-integration-postman',
    title:
      'Data Cloud/MuleSoft Integration Part 3: Call your integration with Postman',
    description:
      'Use the provided Postman collection to call the integration — generate a Data Cloud schema, run SOQL queries, and insert and delete records in Salesforce Data Cloud through the deployed Mule app.',
    playlists: ['datacloud-mulesoft'],
    links: [
      {
        label: 'ProstDev article — Part 3',
        url: 'https://www.prostdev.com/post/part-3-data-cloud-mulesoft-integration',
      },
      {
        label: 'GitHub repo — datacloud-mulesoft-integration',
        url: 'https://github.com/alexandramartinez/datacloud-mulesoft-integration',
      },
    ],
  },
  {
    youtubeId: 'r_AM3P8Y-_Q',
    slug: 'datacloud-mulesoft-secure-api-basic-auth-api-manager',
    title:
      'Data Cloud/MuleSoft Integration Part 4: Secure your API with basic authentication in API Manager',
    description:
      'Lock down the public endpoint with a basic authentication policy in API Manager — no code required. Create the API instance, upgrade to the autodiscovery-enabled JAR, apply the policy, and update the Postman collection with credentials.',
    playlists: ['datacloud-mulesoft'],
    links: [
      {
        label: 'ProstDev article — Part 4',
        url: 'https://www.prostdev.com/post/part-4-data-cloud-mulesoft-integration',
      },
      {
        label: 'GitHub repo — datacloud-mulesoft-integration',
        url: 'https://github.com/alexandramartinez/datacloud-mulesoft-integration',
      },
    ],
  },
  {
    youtubeId: 'iGlPOy_EMlE',
    slug: 'manually-authenticate-salesforce-data-cloud-mulesoft',
    title:
      'How to manually authenticate to Salesforce Data Cloud through a MuleSoft integration',
    description:
      'When a Data Cloud connector operation is missing, do the auth by hand: authenticate to Salesforce first, exchange that token for a Data Cloud token, then call the Data Cloud API — built and debugged in Anypoint Code Builder.',
    playlists: ['datacloud-mulesoft'],
    links: [
      {
        label: 'GitHub repo — data-cloud-auth',
        url: 'https://github.com/alexandramartinez/data-cloud-auth',
      },
    ],
  },
  {
    youtubeId: 'hbrxfIfP4fI',
    slug: 'datacloud-mulesoft-insert-data-bulk-operations',
    title:
      'Data Cloud/MuleSoft Integration Part 5: Insert Data with the BULK operations',
    description:
      'Get past the 200-record streaming limit by inserting data into Salesforce Data Cloud with the bulk operations — covering the updates made to the integration since Part 3.',
    playlists: ['datacloud-mulesoft'],
    links: [
      {
        label: 'ProstDev article — Part 5',
        url: 'https://www.prostdev.com/post/part-5-data-cloud-mulesoft-integration',
      },
      {
        label: 'GitHub repo — datacloud-mulesoft-integration',
        url: 'https://github.com/alexandramartinez/datacloud-mulesoft-integration',
      },
    ],
  },
  {
    youtubeId: 'JviC_4lSQEk',
    slug: 'dataweave-challenge-1-add-numbers-paragraphs-max',
    title:
      'DataWeave programming challenge #1: Add numbers separated by paragraphs and get the max number',
    description:
      'Sum the numbers within each paragraph of a text input, then return the largest paragraph total — all in DataWeave. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-1',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F1',
      },
    ],
  },
  {
    youtubeId: 'cZVwl55yTWo',
    slug: 'dataweave-challenge-2-rock-paper-scissors-score',
    title: 'DataWeave programming challenge #2: Rock Paper Scissors game score system',
    description:
      'Score a series of Rock Paper Scissors rounds in DataWeave — 0 for a loss, 3 for a draw, 6 for a win — and total it out of 30. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-2',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F2',
      },
    ],
  },
  {
    youtubeId: '8owpvAhYfEs',
    slug: 'dataweave-challenge-3-count-palindrome-phrases-strings-module',
    title:
      'DataWeave programming challenge #3: Count palindrome phrases using the Strings module',
    description:
      'Identify which phrases are palindromes (ignoring case, spaces, and punctuation), then sum the character counts of those phrases using the DataWeave Strings module. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-3',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F3',
      },
    ],
  },
  {
    youtubeId: '_3GJtx-NK8M',
    slug: 'dataweave-challenge-4-tower-of-hanoi-puzzle',
    title: 'DataWeave programming challenge #4: Solve the Tower of Hanoi mathematical puzzle',
    description:
      'Model and solve the Tower of Hanoi puzzle in DataWeave across multiple scenarios — moving disks between dynamically named towers without hard-coding their names. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-4',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F4',
      },
      {
        label: 'Play the game online',
        url: 'https://www.mathsisfun.com/games/towerofhanoi.html',
      },
    ],
  },
  {
    youtubeId: 'Dk1MZQ7T-GM',
    slug: 'dataweave-challenge-5-reverse-words-keep-punctuation',
    title:
      "DataWeave programming challenge #5: Reverse a phrase's words, but keep the punctuation",
    description:
      'Reverse the word order of each phrase in DataWeave while leaving punctuation marks fixed in their original positions. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-5',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F5',
      },
    ],
  },
  {
    youtubeId: 'fgzImvWfgHY',
    slug: 'dataweave-challenge-6-tail-recursion-factorial',
    title:
      'DataWeave programming challenge #6: Using tail-recursion to get the factorial of a number',
    description:
      'Write a tail-recursive DataWeave function to factorial each positive number in a list (regular recursion hits the limit), sum the results, then slice out specific digit positions as a number. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-6',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F6',
      },
    ],
  },
  {
    youtubeId: 'qBiFkditGbk',
    slug: 'dataweave-challenge-7-modify-values-json-structure',
    title: 'DataWeave programming challenge #7: Modify certain values from a JSON structure',
    description:
      'Uppercase every value in a nested JSON structure in DataWeave — except the values under any "this" field — which the right built-in function makes simple. Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-7',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F7',
      },
    ],
  },
  {
    youtubeId: '4BThMEAJ02s',
    slug: 'dataweave-challenge-8-sum-digits-one-digit',
    title: 'DataWeave programming challenge #8: Sum all digits to get a 1-digit number',
    description:
      'Repeatedly sum the digits of a set of numbers in DataWeave until a single-digit result remains (the digital root). Clues and full solutions are in the companion article.',
    playlists: ['dataweave-challenges'],
    links: [
      {
        label: 'Read the article',
        url: 'https://www.prostdev.com/post/dataweave-programming-challenge-8',
      },
      {
        label: 'Solve on the Playground',
        url: 'https://dataweave.mulesoft.com/learn/playground?projectMethod=GHRepo&repo=alexandramartinez%2Fdataweave-challenges&path=challenges%2F8',
      },
    ],
  },
  {
    youtubeId: 'AmmmMmGtKh4',
    slug: 'hello-world-java-vs-python-vs-mule',
    title:
      'Printing Hello World: Java vs. Python vs. Mule. Under 30 seconds! | Getting to the point',
    description:
      'A quick side-by-side of printing "Hello World" in Java, Python, and Mule — in under 30 seconds.',
    playlists: ['getting-to-the-point'],
  },
  {
    youtubeId: 'IsTkTXgH1Lk',
    slug: '3-ways-concatenate-objects-dataweave',
    title:
      '3 ways to concatenate objects in DataWeave 2.0. Under 30 seconds! | Getting to the point',
    description:
      'Three different ways to concatenate objects in DataWeave 2.0, explained in under 30 seconds.',
    playlists: ['getting-to-the-point'],
  },
  {
    youtubeId: 'db90-xE4fgU',
    slug: 'extracting-digits-string-dataweave-flatten-scan-joinby',
    title:
      'Extracting digits from a string in DataWeave 2.0 using flatten, scan, joinBy. Under 30 seconds!',
    description:
      'Extract just the digits from a string in DataWeave 2.0 by combining flatten, scan, and joinBy — in under 30 seconds.',
    playlists: ['getting-to-the-point'],
  },
  {
    youtubeId: 'j0uGZsdgLjg',
    slug: 'match-case-literal-values-dataweave',
    title:
      'Match / case for literal values in DataWeave 2.0. Under 30 seconds! | Getting to the point',
    description:
      'Use match / case to branch on literal values in DataWeave 2.0, explained in under 30 seconds.',
    playlists: ['getting-to-the-point'],
  },
  {
    youtubeId: 'MAZC_pLl-2c',
    slug: 'years-months-days-between-dates-dataweave-periods',
    title:
      'Retrieving years months & days between two dates in DataWeave 2.0 using between from Periods module',
    description:
      'Get the years, months, and days between two dates in DataWeave 2.0 with the between function from the Periods module — in under 30 seconds.',
    playlists: ['getting-to-the-point'],
  },
];

/**
 * Homepage "Latest videos" row — a HAND-MAINTAINED, newest-first list spanning
 * ALL playlists (it is NOT a single playlist, and NOT array order). This must
 * mirror the real upload order on the YouTube channel / prostdev.com home.
 *
 * The `VIDEOS` array above stays in canonical series-ascending order (so section
 * pages and the prev/next pager read Part 1 → N); recency is expressed here
 * instead. When you publish a video, add its slug to the TOP of this list.
 */
export const LATEST_SLUGS: string[] = [
  'claude-code-vs-curietech-advent-of-code-dataweave', // Advent of Code (AI Showdown)
  'handling-404-errors-acb-choice-raise-error', // Learn ACB — Part 5
  'acb-full-crud-mysql-docker-debugging', // Learn ACB — Part 4
  'implementing-apis-acb-mysql-docker', // Learn ACB — Part 3
  'import-jars-anypoint-code-builder', // Learn ACB — JARs
  'scaffold-api-spec-acb-project-tour', // Learn ACB — Part 2
];

// ---- Derived helpers -------------------------------------------------------

/** Homepage "latest" videos, newest-first, in LATEST_SLUGS order. */
export function latestVideos(limit = LATEST_SLUGS.length): Video[] {
  return LATEST_SLUGS.slice(0, limit)
    .map((slug) => getVideo(slug))
    .filter((v): v is Video => Boolean(v));
}

/**
 * Homepage hero — the single video featured at the top of the homepage, currently the
 * channel's most-viewed video (caption: "most viewed"). DECOUPLED from LATEST_SLUGS on
 * purpose: the most-viewed video is not necessarily the newest upload, so it does NOT belong
 * in the upload-ordered "Latest videos" list. Update this slug when the featured video changes.
 */
export const FEATURED_SLUG = 'getting-started-acb-vscode-hello-world';

/** Homepage hero video (see FEATURED_SLUG). Throws at build if the slug is stale. */
export function featuredVideo(): Video {
  const v = getVideo(FEATURED_SLUG);
  if (!v) throw new Error(`FEATURED_SLUG "${FEATURED_SLUG}" not found in VIDEOS`);
  return v;
}

export function getPlaylist(id: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.id === id);
}

/** Focal playlists (tier omitted or 'primary') — shown on the homepage + /videos. */
export function primaryPlaylists(): Playlist[] {
  return PLAYLISTS.filter((p) => (p.tier ?? 'primary') === 'primary');
}

/** Lower-priority playlists (tier 'more') — surfaced only under /videos, not the homepage. */
export function morePlaylists(): Playlist[] {
  return PLAYLISTS.filter((p) => p.tier === 'more');
}

/**
 * Slugs of playlists that have a dedicated section page → drives heading links.
 * Includes the focal nav pages PLUS back-catalog ('more'-tier) playlists whose
 * section page exists ONLY so breadcrumbs/`/videos` headings resolve — they are
 * still kept out of the nav and the homepage (see `tier` on Playlist).
 */
const SECTION_PAGE_SLUGS = new Set([
  'mulesoft-ai',
  'learn-acb',
  'mulesoft-from-start',
  'curietech',
  'cicd-github-actions',
  'datacloud-mulesoft',
  'dataweave-challenges',
  'getting-to-the-point',
]);

/** Section-page href for a playlist's heading link, or undefined if it has no section page. */
export function sectionHref(p: Playlist): string | undefined {
  return SECTION_PAGE_SLUGS.has(p.slug) ? `/${p.slug}` : undefined;
}

export function getVideo(slug: string): Video | undefined {
  return VIDEOS.find((v) => v.slug === slug);
}

/**
 * Look up a catalog video by its YouTube id. Used to link a blog post's
 * embedded video to its /video/<slug> page (which carries the transcript).
 */
export function getVideoByYoutubeId(youtubeId: string): Video | undefined {
  return VIDEOS.find((v) => v.youtubeId === youtubeId);
}

/** Videos belonging to a playlist, in catalog order. */
export function videosInPlaylist(playlistId: string): Video[] {
  return VIDEOS.filter((v) => v.playlists.includes(playlistId));
}

/**
 * Previous/next video within a playlist, in catalog order. Used by the video
 * page to let viewers move through a series without going back to the section
 * page. `prev` is the earlier entry, `next` the later one (undefined at the ends).
 */
export function playlistNeighbors(
  playlistId: string,
  slug: string
): { prev?: Video; next?: Video } {
  const list = videosInPlaylist(playlistId);
  const i = list.findIndex((v) => v.slug === slug);
  if (i === -1) return {};
  return { prev: list[i - 1], next: list[i + 1] };
}

/** Map a section page slug to its playlist. */
export function playlistBySlug(slug: string): Playlist | undefined {
  return PLAYLISTS.find((p) => p.slug === slug);
}

/**
 * YouTube thumbnail URL.
 * - 'hq'  → hqdefault.jpg (480×360), always exists — good for cards.
 * - 'max' → maxresdefault.jpg (1280×720), only exists if the uploader set a custom
 *           thumbnail. Use for large/hero renders; pair with an onerror fallback to 'hq'.
 */
export function thumbnail(youtubeId: string, quality: 'hq' | 'max' = 'hq'): string {
  const file = quality === 'max' ? 'maxresdefault' : 'hqdefault';
  return `https://i.ytimg.com/vi/${youtubeId}/${file}.jpg`;
}

export function watchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

/**
 * EXTERNAL PLAYLISTS — YouTube playlists shown ONLY at the bottom of /videos (the
 * "Fun side-quests" and "Community" sections). Intentionally DECOUPLED from VIDEOS/PLAYLISTS:
 *   - NOT in the video catalog, so they never appear in llms.txt / llms-full.txt, the
 *     sitemap, search, section pages, the homepage, or the nav (all iterate VIDEOS/PLAYLISTS).
 *   - Each card is just a cover thumbnail + caption that LINKS OUT to the real YouTube
 *     playlist in a new tab — we do NOT add the individual videos here.
 * `coverVideoId` is the FIRST video in each playlist (its maxresdefault.jpg is the cover,
 * with an hq fallback via thumbnail()). To add one: append an entry below; nothing else changes.
 */
export interface ExternalPlaylist {
  title: string;
  /** Full YouTube playlist URL (opens in a new tab). */
  playlistUrl: string;
  /** YouTube id of the playlist's first video — used as the cover image. */
  coverVideoId: string;
  /** Optional small muted note under the title, e.g. "Up until 2020". */
  note?: string;
}

export const FUN_PLAYLISTS: ExternalPlaylist[] = [
  { title: 'Advent of Code 2022', playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hjaRIF0ZD3G4WWiPgCMGTki', coverVideoId: 'vHYwvwxjio8' },
  { title: 'Battlesnake',         playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hi60IazebMZ7pmZBZeIcEKt', coverVideoId: '23sdn0_YSxk' },
  { title: 'Anypoint Speedway',   playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hgoDYsuinEgmX-t0nx0k1cH', coverVideoId: 'MpXFIdqchII' },
  { title: '#Codetober 2021',     playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hioiVjDvdYoJZDIqyJiFq9D', coverVideoId: 'hVbdR4ZIhDQ' },
  { title: '#Codetober 2022',     playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hgaHlxhO0gqNjrOBreDi3uD', coverVideoId: 'w8fOzZOj0D0' },
  { title: '#Codetober 2023',     playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hiKA2QyXn4hdwu0jqnM4_s9', coverVideoId: 'PHfN7Ah9mpc' },
];

export const COMMUNITY_PLAYLISTS: ExternalPlaylist[] = [
  { title: 'Online Spanish MuleSoft Meetups', playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hgxrpNJlhyiPIw_mPZokrj3', coverVideoId: 'hRwqprErzzQ', note: 'Up until 2020' },
  { title: 'Toronto MuleSoft Meetups',        playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hjIzjTReyZV41_DBRq_pA2k', coverVideoId: 'Pz7J9eHJTrY', note: 'Up until 2020' },
  { title: 'Women Who Mule',                  playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hjJjbzmbHhW0D333JmeHLhA', coverVideoId: 'AMVpzmk_XOI', note: 'Up until 2021' },
  { title: 'MuleSoft Community live streams', playlistUrl: 'https://www.youtube.com/playlist?list=PLb61lESgk6hjrsNRpMT2I1G_kCMyx7JOl', coverVideoId: 'xjrG6oE3f7s', note: 'Up until 2023' },
];
