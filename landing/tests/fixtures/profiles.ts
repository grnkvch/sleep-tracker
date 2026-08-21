export const profiles = [
  { name: 'telegram', url: 'http://127.0.0.1:4173/' },
  { name: 'pwa', url: 'http://127.0.0.1:4174/' },
  { name: 'hybrid', url: 'http://127.0.0.1:4175/' }
] as const;

export const viewports = [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 }
] as const;
