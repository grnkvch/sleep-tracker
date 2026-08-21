import type { AnalyticsAdapter } from './types';

export const noopAnalytics: AnalyticsAdapter = {
  track() {}
};
