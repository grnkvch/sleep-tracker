import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const body =
    __BUILD_MODE__ === 'release'
      ? `User-agent: *\nAllow: ${base}/\nSitemap: ${new URL(`${base}/sitemap.xml`, import.meta.env.SITE).toString()}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
