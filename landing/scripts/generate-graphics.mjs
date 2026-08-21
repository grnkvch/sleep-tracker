import { access } from 'node:fs/promises';

const assets = [
  '../public/favicon.svg',
  '../public/social/telegram.svg',
  '../public/social/pwa.svg',
  '../public/social/hybrid.svg'
];

await Promise.all(assets.map((asset) => access(new URL(asset, import.meta.url))));
process.stdout.write(
  'Editable SVG assets are present. Product graphics are rendered from HTML/CSS.\n'
);
