import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parse } from 'node:path';

const profiles = ['telegram', 'pwa', 'hybrid'];
const expectedMacros = ['hero', 'pain', 'benefits', 'product', 'offer'];
const expectedH1 = 'Малыш плохо спит — подскажем, что делать шаг за шагом';
const expectedSubtitle =
  'Онлайн-помощник для родителей, который учитывает режим и каждый сон малыша.';
const forbidden = [
  'TODO',
  'PLACEHOLDER',
  '[Плейсхолдер]',
  'Lorem ipsum',
  'example.com',
  '<bot_username>',
  'идеальный сон',
  'гарантированный результат',
  'полный контроль',
  'решим все проблемы'
];
const report = [];

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const profile of profiles) {
  const html = await readFile(new URL(`../dist/${profile}/index.html`, import.meta.url), 'utf8');
  const text = strip(html);
  const macroOrder = [...html.matchAll(/data-macro="([^"]+)"/g)].map((match) => match[1]);
  const checks = {
    fiveMacros: JSON.stringify(macroOrder) === JSON.stringify(expectedMacros),
    oneH1: (html.match(/<h1(?:\s|>)/g) ?? []).length === 1,
    fixedH1: text.includes(expectedH1),
    fixedSubtitle: text.includes(expectedSubtitle),
    heroCta: /data-placement="hero"/.test(html),
    offerCta: /data-placement="offer"/.test(html),
    figuresDescribed:
      (html.match(/<figure(?:\s|>)/g) ?? []).length ===
      (html.match(/<figcaption(?:\s|>)/g) ?? []).length,
    noForbiddenMarkers: forbidden.every((marker) => !text.includes(marker)),
    previewDemoLabels:
      text.includes('Рекомендация после короткого сна') &&
      text.includes('Что помощник покажет после отметки сна') &&
      !text.includes('Пример подсказки') &&
      !text.includes('Пример интерфейса'),
    noHintNouns: !/\bподсказ(?:ка|ки|ку|ке|кой|ок|ками|ках)\b/i.test(text),
    pricing:
      text.includes('1 месяц') &&
      text.includes('990 ₽') &&
      text.includes('1 год · выгоднее') &&
      text.includes('5 990 ₽') &&
      text.includes('Около 500 ₽ в месяц') &&
      text.includes('Экономия 5 890 ₽'),
    profileMatches: html.includes(`data-launch-profile="${profile}"`),
    hybridChoice:
      profile !== 'hybrid' ||
      ((html.match(/data-placement="hero"/g) ?? []).length === 2 &&
        (html.match(/data-placement="offer"/g) ?? []).length === 2)
  };
  report.push({ profile, checks, passed: Object.values(checks).every(Boolean) });
}

await mkdir(new URL('../docs/reports/', import.meta.url), { recursive: true });
await writeFile(
  new URL('../docs/reports/content-audit.json', import.meta.url),
  `${JSON.stringify(report, null, 2)}\n`
);
const markdown = [
  '# Content audit',
  '',
  '| Profile | Result |',
  '|---|---|',
  ...report.map((item) => `| ${item.profile} | ${item.passed ? 'PASS' : 'FAIL'} |`),
  ''
].join('\n');
await writeFile(new URL('../docs/reports/content-audit.md', import.meta.url), markdown);

if (report.some((item) => !item.passed)) {
  process.stderr.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(1);
}

process.stdout.write('Content audit passed for telegram, pwa, and hybrid.\n');
