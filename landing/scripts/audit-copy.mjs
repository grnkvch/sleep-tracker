import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/components/', import.meta.url));
const allowed = new Set([]);
const findings = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (['.astro', '.ts', '.js'].includes(extname(entry.name))) {
      const lines = (await readFile(path, 'utf8')).split('\n');
      lines.forEach((line, index) => {
        if (/[А-Яа-яЁё]/.test(line) && !allowed.has(`${path}:${index + 1}`)) {
          findings.push({ path, line: index + 1, context: line.trim() });
        }
      });
    }
  }
}

await walk(root);

if (findings.length > 0) {
  process.stderr.write(`${JSON.stringify(findings, null, 2)}\n`);
  process.exit(1);
}

process.stdout.write('Copy audit passed: components contain no Russian marketing copy.\n');
