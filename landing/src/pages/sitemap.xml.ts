import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const site = import.meta.env.SITE;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const paths = __BUILD_MODE__ === 'release' ? ['/', '/privacy/', '/terms/', '/boundaries/'] : [];
  const urls = paths
    .map((path) => `<url><loc>${new URL(`${base}${path}`, site).toString()}</loc></url>`)
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
