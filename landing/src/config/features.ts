import type { VerifiedFacts } from './content-schema';

export function getFeatures(facts: VerifiedFacts) {
  return {
    methodology:
      facts.methodology.enabled &&
      facts.methodology.status === 'verified' &&
      Boolean(facts.methodology.description),
    expertReview:
      facts.expertReview.enabled &&
      facts.expertReview.status === 'verified' &&
      facts.expertReview.consentConfirmed,
    pricing:
      facts.pricing.enabled &&
      facts.pricing.status === 'verified' &&
      Boolean(facts.pricing.currency) &&
      (facts.pricing.monthly !== null || facts.pricing.yearly !== null),
    trial:
      facts.trial.enabled &&
      facts.trial.status === 'verified' &&
      facts.trial.durationDays !== null &&
      facts.trial.cardRequired !== null &&
      facts.trial.autoRenewal !== null,
    testimonials:
      facts.testimonials.enabled &&
      facts.testimonials.status === 'verified' &&
      facts.testimonials.entries.length > 0 &&
      facts.testimonials.entries.every((entry) => entry.consentConfirmed)
  };
}
