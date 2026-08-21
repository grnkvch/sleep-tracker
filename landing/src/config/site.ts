export const SITE = {
  contentVersion: 'v4',
  defaultLocale: 'ru',
  reportViewports: [
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 }
  ],
  macroTargets: {
    hero: 5,
    pain: 15,
    benefits: 20,
    product: 40,
    offer: 20
  }
} as const;
