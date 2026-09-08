import type { APIRoute } from 'astro';
import { defaultCard, renderCard } from '@/lib/og-image';

/** Branded fallback OG card → dist/og/default.png. Replaces the old static public/og-default.png. */
export const GET: APIRoute = () =>
  renderCard(defaultCard({ tagline: 'MuleSoft tutorials, DataWeave & AI' }));
