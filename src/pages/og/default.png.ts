import type { APIRoute } from 'astro';
import { card, renderCard } from '@/lib/og-image';
import { SITE } from '@/config';

/** Branded fallback OG card → dist/og/default.png. Replaces the old static public/og-default.png. */
export const GET: APIRoute = () =>
  renderCard(card({ title: 'MuleSoft tutorials, DataWeave & Anypoint Code Builder', eyebrow: SITE.tagline }));
