import { spawnSync } from 'node:child_process';

const profiles = ['telegram', 'pwa', 'hybrid'];
const mode = process.env.BUILD_MODE ?? 'preview';

for (const profile of profiles) {
  const result = spawnSync('pnpm', ['exec', 'astro', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      LAUNCH_PROFILE: profile,
      BUILD_MODE: mode,
      ASTRO_TELEMETRY_DISABLED: '1'
    }
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
