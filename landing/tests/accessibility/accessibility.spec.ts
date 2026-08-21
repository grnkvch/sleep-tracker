import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { profiles } from '../fixtures/profiles';

for (const profile of profiles) {
  test(`${profile.name}: no serious accessibility violations`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(profile.url);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((item) =>
      ['critical', 'serious'].includes(item.impact ?? '')
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}

test('keyboard focus reaches the primary action', async ({ page }) => {
  await page.goto('http://127.0.0.1:4175/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.brand-mark')).toBeFocused();
});
