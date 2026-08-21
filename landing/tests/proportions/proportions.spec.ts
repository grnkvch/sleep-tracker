import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { profiles, viewports } from '../fixtures/profiles';

const targets = { hero: 5, pain: 15, benefits: 20, product: 40, offer: 20 } as const;

test('macro sections keep the literal 5/15/20/40/20 geometry', async ({ page }) => {
  const report: Array<Record<string, unknown>> = [];
  await mkdir('docs/reports/screenshots', { recursive: true });

  for (const profile of profiles) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(profile.url, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const heights = await page
        .locator('[data-macro]')
        .evaluateAll((sections) =>
          Object.fromEntries(
            sections.map((section) => [
              section.getAttribute('data-macro'),
              section.getBoundingClientRect().height
            ])
          )
        );
      const measured = heights as Record<string, number>;
      const total = Object.values(measured).reduce((sum, value) => sum + Number(value), 0);
      const ratios = Object.fromEntries(
        Object.entries(measured).map(([key, value]) => [key, (value / total) * 100])
      );
      const tolerance = viewport.width < 600 ? 2 : 1.5;
      const checks = Object.fromEntries(
        Object.entries(targets).map(([key, target]) => [
          key,
          Math.abs(Number(ratios[key]) - target) <= tolerance
        ])
      );
      report.push({
        profile: profile.name,
        viewport,
        heights: measured,
        ratios,
        tolerance,
        checks
      });
      await page.screenshot({
        path: `docs/reports/screenshots/${profile.name}-${viewport.width}x${viewport.height}.png`,
        fullPage: true
      });
      expect(
        checks,
        `${profile.name} ${viewport.width}x${viewport.height}: ${JSON.stringify(ratios)}`
      ).toEqual(Object.fromEntries(Object.keys(targets).map((key) => [key, true])));
      expect(await page.locator('[data-spacer], .spacer').count()).toBe(0);
    }
  }

  await writeFile('docs/reports/proportions.json', `${JSON.stringify(report, null, 2)}\n`);
  const rows = report.map((item) => {
    const ratios = item.ratios as Record<string, number>;
    return `| ${item.profile} | ${(item.viewport as { width: number; height: number }).width}x${(item.viewport as { width: number; height: number }).height} | ${Object.entries(
      ratios
    )
      .map(([key, value]) => `${key} ${value.toFixed(1)}%`)
      .join(' · ')} |`;
  });
  await writeFile(
    'docs/reports/proportions.md',
    ['# Proportions', '', '| Profile | Viewport | Ratios |', '|---|---|---|', ...rows, ''].join(
      '\n'
    )
  );
});
