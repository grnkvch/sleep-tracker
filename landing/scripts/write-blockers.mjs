import { copyFile } from 'node:fs/promises';

await copyFile(
  new URL('../docs/BLOCKERS.md', import.meta.url),
  new URL('../docs/reports/release-blockers.md', import.meta.url)
);
process.stdout.write('Release blockers report refreshed.\n');
