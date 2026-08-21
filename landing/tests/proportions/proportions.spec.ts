import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { profiles, viewports } from '../fixtures/profiles';

test('macro sections keep a content-first hierarchy without spacer geometry', async ({ page }) => {
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
      const heroHeight = Number(measured.hero ?? 0);
      const painHeight = Number(measured.pain ?? 0);
      const benefitsHeight = Number(measured.benefits ?? 0);
      const productHeight = Number(measured.product ?? 0);
      const offerHeight = Number(measured.offer ?? 0);
      const ratios = Object.fromEntries(
        Object.entries(measured).map(([key, value]) => [key, (value / total) * 100])
      );
      const sectionStyles = await page.locator('[data-macro]').evaluateAll((sections) =>
        Object.fromEntries(
          sections.map((section) => {
            const styles = getComputedStyle(section);
            return [
              section.getAttribute('data-macro'),
              {
                minBlockSize: styles.minBlockSize,
                paddingBlockStart: Number.parseFloat(styles.paddingBlockStart),
                paddingBlockEnd: Number.parseFloat(styles.paddingBlockEnd)
              }
            ];
          })
        )
      );
      const styles = sectionStyles as Record<
        string,
        { minBlockSize: string; paddingBlockStart: number; paddingBlockEnd: number }
      >;
      const maxPadding = viewport.width < 600 ? 64 : 128;
      const hierarchy = {
        allSectionsRendered: [
          heroHeight,
          painHeight,
          benefitsHeight,
          productHeight,
          offerHeight
        ].every((height) => height > 0),
        productIsLargest: productHeight === Math.max(...Object.values(measured)),
        heroIsSmallerThanProduct: heroHeight < productHeight,
        painIsSmallerThanProduct: painHeight < productHeight,
        benefitsIsSmallerThanProduct: benefitsHeight < productHeight,
        offerIsSmallerThanProduct: offerHeight < productHeight,
        noForcedMacroHeight: Object.values(styles).every(
          (style) => style.minBlockSize === '0px' || style.minBlockSize === 'auto'
        ),
        modularPadding: Object.values(styles).every(
          (style) => style.paddingBlockStart <= maxPadding && style.paddingBlockEnd <= maxPadding
        )
      };
      report.push({
        profile: profile.name,
        viewport,
        heights: measured,
        ratios,
        sectionStyles: styles,
        hierarchy
      });
      await page.screenshot({
        path: `docs/reports/screenshots/${profile.name}-${viewport.width}x${viewport.height}.png`,
        fullPage: true
      });
      expect(
        hierarchy,
        `${profile.name} ${viewport.width}x${viewport.height}: ${JSON.stringify(ratios)}`
      ).toEqual(Object.fromEntries(Object.keys(hierarchy).map((key) => [key, true])));
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
