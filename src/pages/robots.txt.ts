import type { APIRoute } from 'astro';
import { SITE } from '@/config';

/** robots.txt — allow everything, point crawlers at the sitemap + llms.txt. */
export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI crawlers welcome — see llms.txt for a curated index',
    `Sitemap: ${SITE.url}/sitemap-index.xml`,
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
