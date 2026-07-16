# CONTEXT — ProstDev domain glossary

Shared vocabulary for the video catalog and the pages built from it. Use these terms
as defined here in code, issues, and docs; don't drift to synonyms.

## Glossary

**Video** — one YouTube tutorial in the catalog (`VIDEOS` in `src/data/videos.ts`). Has a
stable `slug` (→ `/video/<slug>`), a `youtubeId`, and the playlist ids it belongs to. A
future `publishedAt` hides it in prod (the scheduling gate, `isVideoPublished`).

**Playlist** — a catalog fact: a named YouTube series (`PLAYLISTS` in `src/data/videos.ts`)
with a `title`, `description`, optional `playlistUrl`, and a prominence `tier`
(`primary` = focal / homepage-eligible, `more` = findable back-catalog). A Playlist owns the
canonical title/description; it is NOT a page.

**Section** — a curated landing page (e.g. `/learn-acb`) composed of one or more Playlist
**blocks** (`SECTIONS` in `src/data/sections.ts`, rendered by `src/pages/[section].astro`). A
Section is PRESENTATION only: it adds the page `slug`, an optional `seoTitle`, and a per-block
intro `hook`. It reuses the Playlist's title/description as the heading and meta. One Section
can compose several Playlists (e.g. `/mulesoft-ai` renders `ai-showdown` + `mulesoft-ai-2025`),
so a Playlist may be shown on a Section whose slug isn't its own.

**Owning section** — the Section that renders a given Playlist. `sectionHref(playlist)`
(`sections.ts`) resolves a Playlist to its owning Section's URL, so a Playlist's video
breadcrumbs and its `/videos` row heading link to the page that actually shows it — even when
that Playlist appears only as a secondary block.

**Scheduled** — a Video whose `publishedAt` is still in the FUTURE relative to a given instant.
`isScheduled(v, now)` (`videos.ts`) is the single, environment-free home of that fact. It is the
one seam two policies build on: the **scheduling gate** `isVideoPublished` (prod HIDES scheduled
videos; dev shows everything) and the content calendar (`upcomingCalendarItems`, which wants
exactly the scheduled set, in any environment). Because both read `isScheduled`, the gate and the
calendar can't drift. A Video with no `publishedAt` is never scheduled (always live). The blog
twin is the `pubDate` gate in `src/lib/content.ts`.

## Notes

- Section ≠ Playlist: catalog truth lives on the Playlist; a Section only arranges Playlists
  into a page. Don't duplicate a Playlist's title/description into a Section unless the SEO
  title genuinely differs (then use `seoTitle`).
- Adding a section page = add a `Section` to `SECTIONS`. There is no per-page `.astro` file and
  no slug list to keep in sync (the retired `SECTION_PAGE_SLUGS` Set).
- Scheduling ≠ prod policy: `isScheduled` is the time FACT; `isVideoPublished` layers the
  hide-in-prod POLICY on top. Don't re-implement the `publishedAt > now` comparison anywhere —
  route through `isScheduled` (this is what commit 9d29051's bug + `videos.catalog.test.ts` guard).
