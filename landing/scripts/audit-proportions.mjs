import { spawnSync } from 'node:child_process';

const result = spawnSync('pnpm', ['exec', 'playwright', 'test', 'tests/proportions'], {
  stdio: 'inherit'
});
process.exit(result.status ?? 1);
