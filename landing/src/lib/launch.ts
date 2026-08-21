import YAML from 'yaml';
import telegramSource from '../content/launch/telegram.yaml?raw';
import pwaSource from '../content/launch/pwa.yaml?raw';
import hybridSource from '../content/launch/hybrid.yaml?raw';
import { launchSchema, type LaunchConfig, type LaunchProfile } from '../config/content-schema';

const sources: Record<LaunchProfile, string> = {
  telegram: telegramSource,
  pwa: pwaSource,
  hybrid: hybridSource
};

export function getLaunchConfig(profile: LaunchProfile): LaunchConfig {
  const config = launchSchema.parse(YAML.parse(sources[profile]));
  if (config.profile !== profile) {
    throw new Error(`Launch profile mismatch: expected ${profile}, received ${config.profile}`);
  }
  return config;
}

export function resolveCta(config: LaunchConfig, mode: 'preview' | 'release') {
  return [config.primary, config.secondary]
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => ({
      ...item,
      href: mode === 'release' && item.url ? item.url : item.fallbackUrl,
      resolvedLabel: mode === 'release' && item.url ? item.label : item.previewLabel
    }));
}
