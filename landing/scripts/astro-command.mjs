import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const child = spawn('pnpm', ['exec', 'astro', ...args], {
  stdio: 'inherit',
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }
});
child.on('exit', (code) => process.exit(code ?? 1));
