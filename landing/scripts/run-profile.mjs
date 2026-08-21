import { spawn } from 'node:child_process';

const [action = 'dev', profile = 'hybrid', ...extraArgs] = process.argv.slice(2);
const profiles = new Set(['telegram', 'pwa', 'hybrid']);
const actions = new Set(['dev', 'build', 'preview']);

if (!profiles.has(profile) || !actions.has(action)) {
  process.stderr.write(
    'Usage: node scripts/run-profile.mjs <dev|build|preview> <telegram|pwa|hybrid>\n'
  );
  process.exit(1);
}

const args = ['exec', 'astro', action, ...extraArgs];
const child = spawn('pnpm', args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    LAUNCH_PROFILE: profile,
    BUILD_MODE: process.env.BUILD_MODE ?? 'preview',
    ASTRO_TELEMETRY_DISABLED: '1'
  }
});

child.on('exit', (code) => process.exit(code ?? 1));
