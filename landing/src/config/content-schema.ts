import { z } from 'zod';

const nullableText = z.string().min(1).nullable();

export const demoSchema = z.object({
  status: z.literal('illustrative'),
  caption: z.string().min(1),
  interfaceCaption: z.string().min(1),
  todayLabel: z.string().min(1),
  lastWakeLabel: z.string().min(1),
  lastWakeTime: z.string().min(1),
  lastSleepLabel: z.string().min(1),
  lastSleepDuration: z.string().min(1),
  nextSleepLabel: z.string().min(1),
  nextSleepWindow: z.string().min(1),
  preparationLabel: z.string().min(1),
  preparationTime: z.string().min(1),
  reasonTitle: z.string().min(1),
  reasonText: z.string().min(1),
  productWakeLabel: z.string().min(1),
  productDurationText: z.string().min(1),
  whatNextTitle: z.string().min(1),
  whyTitle: z.string().min(1),
  productReasonText: z.string().min(1),
  beforeLabel: z.string().min(1),
  beforeValue: z.string().min(1),
  eventLabel: z.string().min(1),
  eventValue: z.string().min(1),
  afterLabel: z.string().min(1),
  afterValue: z.string().min(1),
  historyCaption: z.string().min(1),
  historyDays: z
    .array(
      z.object({
        day: z.string().min(1),
        intervals: z.array(z.string().min(1)).min(1)
      })
    )
    .min(3)
    .max(5)
});

export const channelSchema = z.enum(['telegram', 'pwa']);
export const profileSchema = z.enum(['telegram', 'pwa', 'hybrid']);

const ctaSchema = z.object({
  channel: channelSchema,
  label: z.string().min(1),
  previewLabel: z.string().min(1),
  description: z.string().min(1),
  url: z.url().nullable(),
  fallbackUrl: z.string().startsWith('#')
});

export const launchSchema = z.object({
  profile: profileSchema,
  channelBadge: z.string().min(1),
  heroVariant: z.enum(['chat', 'app', 'neutral']),
  choiceLabel: z.string().min(1).optional(),
  primary: ctaSchema,
  secondary: ctaSchema.nullable(),
  qrEnabled: z.boolean(),
  seoSuffix: z.string().min(1).nullable()
});

const statusSchema = z.enum(['unverified', 'verified']);

export const factsSchema = z.object({
  methodology: z.object({
    enabled: z.boolean(),
    status: statusSchema,
    description: nullableText,
    sources: z.array(z.url())
  }),
  expertReview: z.object({
    enabled: z.boolean(),
    status: statusSchema,
    expertName: nullableText,
    qualification: nullableText,
    consentConfirmed: z.boolean()
  }),
  pricing: z.object({
    enabled: z.boolean(),
    status: statusSchema,
    monthly: z.number().positive().nullable(),
    yearly: z.number().positive().nullable(),
    currency: nullableText
  }),
  trial: z.object({
    enabled: z.boolean(),
    status: statusSchema,
    durationDays: z.number().int().positive().nullable(),
    cardRequired: z.boolean().nullable(),
    autoRenewal: z.boolean().nullable()
  }),
  testimonials: z.object({
    enabled: z.boolean(),
    status: statusSchema,
    entries: z.array(
      z.object({
        quote: z.string().min(1),
        author: z.string().min(1),
        consentConfirmed: z.literal(true)
      })
    )
  })
});

export const shellSchema = z.object({
  skipLink: z.string().min(1),
  header: z.object({
    logoLabel: z.string().min(1),
    benefitsLink: z.string().min(1),
    productLink: z.string().min(1),
    cta: z.string().min(1)
  }),
  footer: z.object({
    description: z.string().min(1),
    privacy: z.string().min(1),
    terms: z.string().min(1),
    boundaries: z.string().min(1),
    copyright: z.string().min(1)
  })
});

export type DemoContent = z.infer<typeof demoSchema>;
export type LaunchConfig = z.infer<typeof launchSchema>;
export type LaunchProfile = z.infer<typeof profileSchema>;
export type VerifiedFacts = z.infer<typeof factsSchema>;
export type ShellCopy = z.infer<typeof shellSchema>;
