import type { LaunchConfig, VerifiedFacts } from '../config/content-schema';

export function collectReleaseBlockers({
  launch,
  facts,
  siteUrl,
  contentStatus,
  demoStatus,
  legalStatus
}: {
  launch: LaunchConfig;
  facts: VerifiedFacts;
  siteUrl?: string;
  contentStatus: string;
  demoStatus: string;
  legalStatus: string;
}) {
  const blockers: string[] = [];
  if (!siteUrl) blockers.push('SITE_URL');
  if (!launch.primary.url) blockers.push(`launch.${launch.profile}.primary.url`);
  if (launch.profile === 'hybrid' && !launch.secondary?.url) {
    blockers.push('launch.hybrid.secondary.url');
  }
  if (contentStatus !== 'ready') blockers.push('content.releaseStatus');
  if (demoStatus === 'illustrative') blockers.push('demo.status');
  if (legalStatus !== 'verified') blockers.push('legal.status');
  if (facts.methodology.enabled && facts.methodology.status !== 'verified') {
    blockers.push('facts.methodology');
  }
  if (facts.testimonials.enabled && facts.testimonials.status !== 'verified') {
    blockers.push('facts.testimonials');
  }
  if (facts.pricing.enabled && (!facts.pricing.currency || facts.pricing.status !== 'verified')) {
    blockers.push('facts.pricing');
  }
  return blockers;
}
