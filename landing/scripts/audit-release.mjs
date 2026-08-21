import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
import { launchSchema, factsSchema, demoSchema } from '../src/config/content-schema.ts';
import { collectReleaseBlockers } from '../src/lib/release.ts';

const profile = process.env.LAUNCH_PROFILE ?? 'hybrid';
const launch = launchSchema.parse(
  YAML.parse(
    await readFile(new URL(`../src/content/launch/${profile}.yaml`, import.meta.url), 'utf8')
  )
);
const facts = factsSchema.parse(
  YAML.parse(await readFile(new URL('../src/content/facts/verified.yaml', import.meta.url), 'utf8'))
);
const demo = demoSchema.parse(
  YAML.parse(
    await readFile(new URL('../src/content/landing/demo.ru.yaml', import.meta.url), 'utf8')
  )
);
const landingSource = await readFile(
  new URL('../src/content/landing/ru.mdx', import.meta.url),
  'utf8'
);
const contentStatus = landingSource.match(/releaseStatus:\s*([^\s]+)/)?.[1] ?? 'missing';
const legalStatus = landingSource.match(/legalStatus:\s*([^\s]+)/)?.[1] ?? 'missing';
const blockers = collectReleaseBlockers({
  launch,
  facts,
  demoStatus: demo.status,
  siteUrl: process.env.SITE_URL,
  contentStatus,
  legalStatus
});

if (blockers.length > 0) {
  process.stderr.write(`Release blocked by:\n${blockers.map((item) => `- ${item}`).join('\n')}\n`);
  process.exit(1);
}

process.stdout.write('Release audit passed.\n');
