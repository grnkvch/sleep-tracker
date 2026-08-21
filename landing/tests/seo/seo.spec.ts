import { expect, test } from '@playwright/test';
import { profiles } from '../fixtures/profiles';

for (const profile of profiles) {
  test(`${profile.name}: preview SEO contract`, async ({ page, request }) => {
    const response = await page.goto(profile.url);
    const html = await response?.text();
    expect(html).toContain('Малыш плохо спит — подскажем, что делать шаг за шагом');
    await expect(page).toHaveTitle(/Помощник по детскому сну/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Отмечайте сны малыша/
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    const robots = await request.get(new URL('/robots.txt', profile.url).toString());
    expect(await robots.text()).toContain('Disallow: /');
  });
}
