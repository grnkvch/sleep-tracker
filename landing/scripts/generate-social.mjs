import { readFile } from 'node:fs/promises';

for (const profile of ['telegram', 'pwa', 'hybrid']) {
  const source = await readFile(
    new URL(`../public/social/${profile}.svg`, import.meta.url),
    'utf8'
  );
  if (!/width="1200" height="630"/.test(source)) {
    throw new Error(`Invalid social card dimensions: ${profile}`);
  }
}
process.stdout.write('Social cards are 1200x630.\n');
