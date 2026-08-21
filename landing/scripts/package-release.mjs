import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { relative, join } from 'node:path';
import { zipSync, strToU8 } from 'fflate';

const profiles = ['telegram', 'pwa', 'hybrid'];
const releaseRoot = new URL('../release/', import.meta.url);
const manifest = {
  contentVersion: 'v4',
  buildMode: process.env.BUILD_MODE ?? 'preview',
  buildDate: new Date().toISOString(),
  artifacts: []
};

async function collect(root, directory = root, output = {}) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(root, path, output);
    else output[relative(root, path).replaceAll('\\', '/')] = new Uint8Array(await readFile(path));
  }
  return output;
}

await mkdir(releaseRoot, { recursive: true });

for (const profile of profiles) {
  const root = new URL(`../dist/${profile}/`, import.meta.url);
  const entries = await collect(root.pathname);
  entries['BUILD.txt'] = strToU8(
    `profile=${profile}\ncontentVersion=v4\nmode=${manifest.buildMode}\n`
  );
  const archive = zipSync(entries, { level: 9 });
  const name = `landing-${profile}.zip`;
  await writeFile(new URL(name, releaseRoot), archive);
  manifest.artifacts.push({
    profile,
    file: name,
    bytes: archive.byteLength,
    sha256: createHash('sha256').update(archive).digest('hex')
  });
}

await writeFile(new URL('manifest.json', releaseRoot), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write('Release packages created.\n');
