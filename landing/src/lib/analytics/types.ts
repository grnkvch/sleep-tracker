import type { LaunchProfile } from '../../config/content-schema';

export type LandingEvent =
  | {
      name: 'cta_click';
      placement: 'header' | 'hero' | 'offer';
      channel: 'telegram' | 'pwa';
      launchProfile: LaunchProfile;
    }
  | {
      name: 'channel_choice';
      channel: 'telegram' | 'pwa';
      placement: 'hero' | 'offer';
    };

export interface AnalyticsAdapter {
  track(event: LandingEvent): void;
}
