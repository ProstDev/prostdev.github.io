# ADR-0001 — OG-image endpoints stay per-type, not a unified dispatcher

- **Status:** Accepted
- **Date:** 2026-07-16
- **Deciders:** Alex Martinez

## Context

Social-share (OG) card PNGs are generated at build time by four route files:

- `src/pages/og/default.png.ts` (7 lines)
- `src/pages/og/post/[slug].png.ts` (15 lines)
- `src/pages/og/skill/[slug].png.ts` (15 lines)
- `src/pages/og/video/[slug].png.ts` (23 lines)

The real rendering depth already lives in one deep module, `src/lib/og-image.ts`
(`card` / `bareImageCard` / `renderCard` / `loadPostHero` / `fetchRemoteImage`). The four
endpoints are thin adapters over it.

An architecture review (July 2026) listed, as a *Speculative* candidate, unifying the four
into a single `og/[...type].png.ts` that dispatches by type — noting it as "listed for
completeness" and marginal. This ADR records why we declined it, so future reviews don't
re-surface it.

## Decision

Keep one OG endpoint per content type. Do **not** collapse them into a type-dispatching route.

## Rationale

The four endpoints look like duplication but share almost nothing beyond the Astro
`getStaticPaths` + `GET` shell. What actually differs per type:

- **Data source** — `getPosts()` / `getSkills()` / `publishedVideos()`, and `default` has no
  `getStaticPaths` at all.
- **Card function** — post/skill use `card()` (title overlaid on a hero image); video uses
  `bareImageCard()` (full-bleed YouTube thumbnail, no overlay — the thumbnail already bakes in
  the title, and overlaying produced text-on-text).
- **Fetch model** — video is `async` and fetches a remote thumbnail with a maxres→hq fallback;
  post/skill do a synchronous `loadPostHero(filePath)`.

A unified dispatcher would have to union three `getStaticPaths` (three data sources) and branch
on type for both the card function and the sync/async fetch. Net change ≈ −5 lines, but it
**fails the deletion test**: deleting the four files for one router does not concentrate
complexity — it scatters each content type's OG logic behind a branch and destroys locality.
Today "how is a video's OG card made?" is answered by one legible 23-line file; behind a
dispatcher it becomes a case in a multi-type switch. The seam is already in the right place
(`og-image.ts`); the endpoints are correctly shallow adapters, which is what a route file
should be.

## Consequences

- Adding a new OG card type = add one small endpoint file (the established pattern), not a new
  branch in a shared router.
- The genuine micro-duplication between the post and skill endpoints (both:
  collection → `getStaticPaths` → `card({ title, eyebrow, bg: loadPostHero(filePath) })`) is
  accepted as-is; each `GET` body is three lines and the two differ in `eyebrow`/title source,
  so a shared helper would take nearly as many arguments as it removes lines.
- Related cleanup done alongside this decision: `og/video/[slug].png.ts` annotated its props
  with `(typeof VIDEOS)[number]` referencing an unimported `VIDEOS` (a dangling identifier
  `astro build` tolerated but `astro check` would flag). Switched to the exported `Video` type.
