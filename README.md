# ProstDev

The ProstDev website — MuleSoft video tutorials and AI-friendly blog posts. Built with
[Astro](https://astro.build), hosted free on GitHub Pages.

Replaces the previous Wix site. **Primary focus: YouTube videos.** Secondary focus:
SEO/AEO-optimized blog posts that AI and search engines can read.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

```bash
npm run build      # astro build + pagefind (search index)
npm run preview    # serve the production build locally (search works here)
```

> Search (Pagefind) only works against a built site — use `npm run build && npm run preview`,
> not `npm run dev`.

## Add a new video

Edit [`src/data/videos.ts`](src/data/videos.ts):

1. Add a `Video` entry near the **top** of the `VIDEOS` array (newest first) with a unique
   `slug`, the `youtubeId`, title, description, and which `playlists` it belongs to.
2. (Optional but recommended) Add a transcript at
   `src/content/transcripts/<youtubeId>.md` so the video is AI-readable and searchable.
3. Commit & push — GitHub Actions rebuilds and deploys automatically.

Each video gets a page at `/video/<slug>`, a raw-markdown version at `/video/<slug>.md`, and
is included in `/llms.txt` + `/llms-full.txt`.

## Add a blog post

Create `src/content/blog/<slug>.mdx` with frontmatter:

```yaml
---
title: 'Your title'
description: 'One-sentence summary (used for SEO + cards).'
pubDate: 2026-01-15
category: Tutorials   # Challenges | Tutorials | Guides | Opinion | News
tags: [MuleSoft, DataWeave]
youtubeId: abc123      # optional — embeds the video at the top
heroImage: ./cover.png # optional
draft: false           # drafts are hidden in production
---
```

Posts render at `/post/<slug>` with an auto "On this page" nav, a Copy/View-as-Markdown menu,
and `/post/<slug>.md` raw markdown.

## Machine-readable / AEO endpoints

- `/llms.txt` — curated index of all videos + posts ([llmstxt.org](https://llmstxt.org) format)
- `/llms-full.txt` — every post body + video transcript concatenated
- `/post/<slug>.md`, `/video/<slug>.md` — raw markdown per page
- `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`

## Deploy / DNS cutover

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to
GitHub Pages. The custom domain is set via [`public/CNAME`](public/CNAME) (`prostdev.com`).

**One-time setup:**

1. In the GitHub repo: **Settings → Pages → Source → GitHub Actions**.
2. Verify the site works at the temporary `*.github.io` URL.
3. **Then** update DNS at your registrar (away from Wix):
   - Apex `prostdev.com`: A records to GitHub Pages IPs
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and AAAA records for IPv6 if desired).
   - `www`: CNAME → `<github-username>.github.io`.
4. In Settings → Pages, set the custom domain to `prostdev.com` and enable **Enforce HTTPS**.

Keep Wix live until the new site is verified, to avoid downtime.

## License

This project is **free for noncommercial use, but may not be used to generate revenue.**
Two licenses apply:

- **Source code** — [PolyForm Noncommercial License 1.0.0](LICENSE). You may read, fork,
  study, and reuse the code for any *noncommercial* purpose. Commercial use is not permitted.
- **Written & media content** — blog posts (`src/content/blog/`), transcripts
  (`src/content/transcripts/`), and other editorial content are licensed under
  [Creative Commons BY-NC 4.0](LICENSE-CONTENT): share and adapt with attribution, but
  **no commercial use**.

In short: learning from it, forking it, and non-commercial reuse (with credit) are welcome —
using any of it to make money is not. For commercial licensing, contact alex@prostdev.com.

Guest-authored posts remain © their respective authors (see each post's `author` field),
published here under the same noncommercial terms.
