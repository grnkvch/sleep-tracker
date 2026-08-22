import { expect, test } from '@playwright/test';
import { profiles } from '../fixtures/profiles';

for (const profile of profiles) {
  test(`${profile.name}: primary page works`, async ({ page }) => {
    await page.goto(profile.url);
    await expect(page.locator('main[data-landing-content]')).toBeVisible();
    await expect(page.locator('[data-macro]')).toHaveCount(5);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Малыш плохо спит — подскажем, что делать шаг за шагом'
    );
    await expect(page.locator('[data-placement="hero"]')).toHaveCount(
      profile.name === 'hybrid' ? 2 : 1
    );
    await expect(page.locator('[data-placement="offer"]')).toHaveCount(
      profile.name === 'hybrid' ? 2 : 1
    );
    for (const link of await page
      .locator('[data-placement="hero"], [data-placement="offer"]')
      .all()) {
      await expect(link).toHaveAttribute('href', '#product-demo');
    }
    await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
  });
}

test('legal pages and 404 are available', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/', '/boundaries/']) {
    const response = await page.goto(`http://127.0.0.1:4175${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  const response = await page.goto('http://127.0.0.1:4175/not-found/');
  expect(response?.status()).toBe(404);
});

test('hybrid hero switches between Telegram and web examples', async ({ page }) => {
  await page.goto('http://127.0.0.1:4175/');
  const telegram = page.locator('#hero-channel-telegram');
  const web = page.locator('#hero-channel-web');

  await expect(telegram).toBeChecked();
  await expect(page.locator('.channel-preview__panel--telegram')).toBeVisible();
  await page.locator('label[for="hero-channel-web"]').click();
  await expect(web).toBeChecked();
  await expect(page.locator('.channel-preview__panel--web')).toBeVisible();
  await expect(page.locator('.channel-preview__panel--telegram')).toBeHidden();
});

test('full page remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4175/');
  await expect(page.locator('[data-macro]')).toHaveCount(5);
  await expect(page.getByRole('link', { name: 'Начать в Telegram' }).first()).toBeVisible();
  await context.close();
});
