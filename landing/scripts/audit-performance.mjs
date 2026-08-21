import { gzipSync } from 'node:zlib';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const profiles = ['telegram', 'pwa', 'hybrid'];
const budgets = { html: 400 * 1024, css: 45 * 1024, js: 10 * 1024, total: 400 * 1024 };
const results = [];

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await files(path)));
    else result.push(path);
  }
  return result;
}

for (const profile of profiles) {
  const root = fileURLToPath(new URL(`../dist/${profile}/`, import.meta.url));
  const sizes = { html: 0, css: 0, js: 0, total: 0 };
  for (const path of await files(root)) {
    const extension = extname(path).slice(1);
    const body = await readFile(path);
    const gzipped = gzipSync(body).byteLength;
    sizes.total += gzipped;
    if (extension in sizes) sizes[extension] += gzipped;
  }
  const checks = Object.fromEntries(
    Object.entries(budgets).map(([key, value]) => [key, sizes[key] <= value])
  );
  results.push({
    profile,
    gzipBytes: sizes,
    budgets,
    checks,
    passed: Object.values(checks).every(Boolean)
  });
}

await writeFile(
  new URL('../docs/reports/performance.json', import.meta.url),
  `${JSON.stringify(results, null, 2)}\n`
);

if (results.some((result) => !result.passed)) {
  process.stderr.write(`${JSON.stringify(results, null, 2)}\n`);
  process.exit(1);
}

process.stdout.write('Static performance budgets passed.\n');
