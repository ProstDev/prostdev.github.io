/**
 * Books catalog for ProstDev.
 *
 * A hand-curated showcase of MuleSoft / integration books worth reading, written by people in the
 * community. Each is an off-site link (no on-site detail page); the /community/books page renders
 * these as cards with the book's portrait cover, title, subtitle, a blurb, author attribution, and —
 * when any author is a MuleSoft Ambassador — a highlight badge on the cover.
 *
 * HOW TO ADD A BOOK:
 *   1. Add a Book entry below (in alphabetical order by `title`, case-insensitive) with a unique
 *      kebab-case `id`, its `title`, off-site `url` (the publisher/retailer page), a one-to-three
 *      sentence `description`, and an `authors` list. Add an optional `subtitle`, `publisher`, and
 *      `year`. A `description` states only what's OBSERVABLE — do NOT repeat the publisher's marketing
 *      copy as fact; on our site it reads as Alex's endorsement.
 *   2. Credit each author with `authors: [AUTHORS['<key>']]` from the shared registry
 *      (src/data/authors.ts). The "MuleSoft Ambassador" cover badge is DERIVED from an author's
 *      `isAmbassador` flag there (see bookIsAmbassador) — set it once on the person, not per-book.
 *      Add a new person to AUTHORS if they aren't already listed.
 *   3. Give it a cover: drop the file in `src/assets/books/` (named after the `id`), `import` it at
 *      the top of this file, and set it as the entry's `cover`. Book covers are portrait — a real
 *      cover is expected (no generated fallback tile).
 *   4. Commit & push — the deploy rebuilds the site (the /community/books grid + llms.txt update
 *      automatically from this array).
 */
import type { ImageMetadata } from 'astro';
import { AUTHORS, hasAmbassador, type Author } from '@/data/authors';
// Real covers. Drop a portrait cover image in `src/assets/books/` named after the entry's `id`,
// `import` it here, and set it as that entry's `cover`.
import mulesoftForSalesforceDevelopers from '@/assets/books/mulesoft-for-salesforce-developers.jpg';
import mulesoftPlatformArchitectsGuide from '@/assets/books/mulesoft-platform-architects-guide.jpg';

export interface Book {
  /** Stable kebab-case slug — used for list keys and the cover filename. */
  id: string;
  title: string;
  /** Optional subtitle, shown under the title. */
  subtitle?: string;
  /** Off-site link — the publisher or retailer product page. */
  url: string;
  /** One-to-three-sentence blurb shown on the card. States only what's observable. */
  description: string;
  /**
   * Author(s) to credit — reference the shared registry, e.g. `[AUTHORS['jitendra-bafna']]` (list
   * more than one to credit co-authors).
   */
  authors: Author[];
  /** Optional publisher name (e.g. "Packt"). */
  publisher?: string;
  /** Optional publication year. */
  year?: number;
  /**
   * An earlier edition of this book, shown as a small cross-link sub-line INSIDE this card (not as
   * its own card) — for a superseded edition still worth pointing at (e.g. one Alex co-authored).
   */
  previousEdition?: {
    /** The earlier edition's publisher/retailer page. */
    url: string;
    /** Human label for the link, e.g. "1st edition". */
    label: string;
    /** Optional publication year, shown in parentheses. */
    year?: number;
    /** Optional short parenthetical, e.g. "co-authored by Alex Martinez". */
    note?: string;
  };
  /** The book's portrait cover (a local asset `import`ed above). */
  cover: ImageMetadata;
}

/** True when any of the book's authors is a MuleSoft Ambassador (drives the cover badge). */
export function bookIsAmbassador(book: Book): boolean {
  return hasAmbassador(book.authors);
}

// Ordered alphabetically by `title` (case-insensitive). Keep new entries in that order.
export const BOOKS: Book[] = [
  {
    id: 'mulesoft-for-salesforce-developers',
    title: 'MuleSoft for Salesforce Developers',
    subtitle:
      'A complete guide for achieving MuleSoft certification readiness and building AI-driven API solutions',
    url: 'https://www.packtpub.com/en-us/product/mulesoft-for-salesforce-developers-9781835882337',
    description:
      'A hands-on guide to MuleSoft for developers coming from the Salesforce ecosystem — API-led connectivity, building and deploying integrations on Anypoint Platform, DataWeave transformations, connecting MuleSoft with Salesforce, and preparing for MuleSoft certification, with newer material on AI-driven API solutions.',
    authors: [AUTHORS['akshata-sawant'], AUTHORS['arul-christhuraj-alphonse']],
    publisher: 'Packt',
    year: 2025,
    // The 1st edition (2022) was co-authored by Alex Martinez alongside Akshata and Arul. It's
    // superseded by this 2nd edition, but shown as a cross-link so Alex's authorship stays visible.
    previousEdition: {
      url: 'https://www.packtpub.com/en-us/product/mulesoft-for-salesforce-developers-9781801074223',
      label: '1st edition',
      year: 2022,
      note: 'co-authored by Alex Martinez',
    },
    cover: mulesoftForSalesforceDevelopers,
  },
  {
    id: 'mulesoft-platform-architects-guide',
    title: "MuleSoft Platform Architect's Guide",
    subtitle:
      "A practical guide to using Anypoint Platform's capabilities to architect, deliver, and operate APIs",
    url: 'https://www.packtpub.com/en-us/product/mulesoft-platform-architects-guide-9781805129622',
    description:
      'A practitioner guide to architecting on Anypoint Platform — API-led connectivity and application networks, deployment models (CloudHub 1.0/2.0, Runtime Fabric, on-premises), high availability and disaster recovery, security and API management, and the operational side of running MuleSoft at scale.',
    authors: [AUTHORS['jitendra-bafna'], AUTHORS['jim-andrews']],
    publisher: 'Packt',
    year: 2024,
    cover: mulesoftPlatformArchitectsGuide,
  },
];
