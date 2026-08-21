import { expect, test } from '@playwright/test';

test('capture key hybrid compositions for review', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4175/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-macro="hero"]')).toBeVisible();
  for (const selector of [
    '[data-macro="hero"]',
    '.benefits-grid',
    '.central-demo',
    '[data-macro="offer"]'
  ]) {
    const name = selector.replace(/[^a-z]+/gi, '-').replace(/^-|-$/g, '');
    await page
      .locator(selector)
      .screenshot({ path: `docs/reports/screenshots/visual-${name}.png` });
  }
});
