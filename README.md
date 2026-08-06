# ProstDev

**Where MuleSoft mastery meets fun.** ProstDev is a learning hub for MuleSoft developers —
easy-to-follow video tutorials, AI experiments, and deep-dive articles on MuleSoft, DataWeave,
Anypoint Code Builder, and integration.

This repository is the open-source site behind **[prostdev.com](https://prostdev.com)** — a fast,
static Astro site, hosted free on GitHub Pages (the rebuild of the original Wix site).

### Watch & read

- 🎥 **YouTube — [@prostdev](https://www.youtube.com/@prostdev)** — the main event. Hands-on
  MuleSoft and DataWeave tutorials, walkthroughs, and experiments.
- 🌐 **Website — [prostdev.com](https://prostdev.com)** — every video plus a searchable blog.
- 💼 **LinkedIn — [ProstDev](https://www.linkedin.com/company/prostdev)**

## What's inside

- **Video tutorials** — each with a written, AI-readable transcript so you can search, skim, or
  read along.
- **~140 blog posts** — tutorials, guides, challenges, and opinion pieces, many contributed by
  guest authors from the MuleSoft community.
- **Full-text search** across every post and transcript.
- **Built for AI & LLMs too** — machine-readable [`/llms.txt`](https://prostdev.com/llms.txt) plus
  a raw-markdown version of every page (`/post/<slug>.md`, `/video/<slug>.md`), so AI assistants
  can read the content cleanly.

## Built with

[Astro 5](https://astro.build) · Tailwind CSS v4 · MDX · [Pagefind](https://pagefind.app) search ·
deployed to GitHub Pages.

## Running it locally

```bash
npm install
npm run dev                      # http://localhost:4321
npm run build && npm run preview # production build — search works here
```

> Search (Pagefind) and the `.md` / `/llms.txt` endpoints only exist in a built site — use
> `build && preview`, not `dev`. Contributor and deploy notes live alongside the source.

## License

This project is **free for noncommercial use, but may not be used to generate revenue.** Two
licenses apply:

- **Source code** — [PolyForm Noncommercial License 1.0.0](LICENSE). Read, fork, study, and reuse
  the code for any *noncommercial* purpose. Commercial use is not permitted.
- **Written & media content** — blog posts (`src/content/blog/`), transcripts
  (`src/content/transcripts/`), and other editorial content are licensed under
  [Creative Commons BY-NC 4.0](LICENSE-CONTENT): share and adapt with attribution, but **no
  commercial use**.

Learning from it, forking it, and noncommercial reuse (with credit) are welcome — using any of it
to make money is not. For commercial licensing, contact **alex@prostdev.com**.

Guest-authored posts remain © their respective authors (see each post's `author` field), published
here under the same noncommercial terms.

