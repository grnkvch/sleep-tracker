import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

const profile = process.env.LAUNCH_PROFILE ?? 'hybrid';
const rawBase = process.env.BASE_PATH ?? '/';
const base = rawBase === '/' ? '/' : `${rawBase.replace(/\/$/, '')}/`;

if (!['telegram', 'pwa', 'hybrid'].includes(profile)) {
  throw new Error(`Unknown LAUNCH_PROFILE: ${profile}`);
}

export default defineConfig({
  integrations: [mdx()],
  output: 'static',
  site: process.env.SITE_URL || undefined,
  base,
  outDir: `./dist/${profile}`,
  build: {
    assets: '_assets',
    format: 'directory'
  },
  vite: {
    define: {
      __LAUNCH_PROFILE__: JSON.stringify(profile),
      __BUILD_MODE__: JSON.stringify(process.env.BUILD_MODE ?? 'preview')
    }
  }
});
