/** @typedef {'preview'|'basic'|'advanced'|'master'} MembershipTier */
/** @typedef {'monthly'|'annual'|'one_time'} BillingPeriod */

/** SKU 1 — Live cohort courses (one-time per enrollment, not annual subs) */
export const COURSES = {
  bi_series: {
    id: 'bi_series',
    skuType: 'course',
    label: 'Business Insurance Series',
    shortLabel: 'BI Series',
    format: '4–6 day live intensive',
    billing: 'one_time',
    priceOneTime: 14990,
    listPriceOneTime: 19990,
    promoNote: 'Founding cohort rate — limited seats per run (live event, not a 12-month subscription)',
    foundingLimit: 40,
    description:
      'Live cohort: entity risk, buy-sell, key person, corporate prospecting. Includes session materials; replay window per cohort.',
    duration: '4–6 days',
  },
};

/** SKU 2 — GIYA Academy membership (recurring digital platform + benefits) */
export const MEMBERSHIP = {
  preview: {
    id: 'preview',
    skuType: 'membership',
    label: 'GIYA Academy — Preview',
    shortLabel: 'Preview',
    priceMonthly: 0,
    priceAnnual: 0,
    includesBiSeries: false,
    description: 'Free sampler — partial Module 1, 1 calculator, 1 script (included in GIYA Discover)',
  },
  basic: {
    id: 'basic',
    skuType: 'membership',
    label: 'GIYA Academy — Core',
    shortLabel: 'Core',
    priceMonthly: 990,
    priceAnnual: 9990,
    listPriceMonthly: 1499,
    listPriceAnnual: 14990,
    promoNote: 'Founding rate — first 100 members at Core digital benefits',
    foundingLimit: 100,
    includesBiSeries: false,
    description:
      '12-month academy access: Modules 1–2, calculators, pitch scripts. BI Series live cohort sold separately.',
  },
  advanced: {
    id: 'advanced',
    skuType: 'membership',
    label: 'GIYA Academy — Professional',
    shortLabel: 'Professional',
    priceMonthly: 3990,
    priceAnnual: 39990,
    listPriceMonthly: 4990,
    listPriceAnnual: 49900,
    promoNote: 'Founding rate — first 30 members; includes 1 BI Series cohort seat',
    foundingLimit: 30,
    includesBiSeries: true,
    description:
      '12-month academy access: Core benefits + Module 3, BIR tools, templates. Includes one BI Series (4–6 day) enrollment.',
  },
  master: {
    id: 'master',
    skuType: 'membership',
    label: 'GIYA Academy — Complete',
    shortLabel: 'Complete',
    priceMonthly: 6990,
    priceAnnual: 69990,
    listPriceMonthly: 5990,
    listPriceAnnual: 59990,
    promoNote: 'Founding rate — first 10 members; includes BI Series + full digital + certification',
    foundingLimit: 10,
    includesBiSeries: true,
    description:
      '12-month academy access: full digital library, case labs, board decks, certification track. Includes one BI Series enrollment.',
  },
};

/** @deprecated Use MEMBERSHIP — kept for imports */
export const TIERS = MEMBERSHIP;

export const ELITE_PLANNED = {
  id: 'elite',
  label: 'GIYA Elite — All-Access',
  description:
    'Planned: all live courses + Complete-level digital access + mentorship. Separate SKU from membership and single-course enrollment.',
};

export const TIER_ORDER = { preview: 0, basic: 1, advanced: 2, master: 3 };

export const MEMBERSHIP_PAID_IDS = ['basic', 'advanced', 'master'];
export const COURSE_IDS = Object.keys(COURSES);

export const PAYMENT_CHANNELS = {
  stripe: {
    id: 'stripe',
    label: 'Card (Visa / Mastercard)',
    provider: 'stripe',
    enabled: true,
    note: 'International and local cards via Stripe Checkout',
  },
  paymongo: {
    id: 'paymongo',
    label: 'GCash / Maya / QR Ph',
    provider: 'paymongo',
    enabled: true,
    note: 'Philippines e-wallets at PayMongo Checkout',
  },
  manual: {
    id: 'manual',
    label: 'Bank transfer / GCash direct',
    provider: 'manual',
    enabled: true,
    note: 'Admin verifies payment and activates your access',
  },
};

/**
 * @param {MembershipTier} tier
 * @param {'monthly'|'annual'} period
 */
export function getMembershipPricePhp(tier, period) {
  const t = MEMBERSHIP[tier];
  if (!t || tier === 'preview') return 0;
  return period === 'annual' ? t.priceAnnual : t.priceMonthly;
}

/** @param {keyof COURSES} courseId */
export function getCoursePricePhp(courseId, useFoundingPrice) {
  const c = COURSES[courseId];
  if (!c) return 0;
  if (useFoundingPrice) return c.priceOneTime;
  return c.listPriceOneTime ?? c.priceOneTime;
}

export function formatPhp(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function publicMembershipPricing(tier) {
  return {
    skuType: 'membership',
    id: tier.id,
    label: tier.label,
    shortLabel: tier.shortLabel,
    priceMonthly: tier.priceMonthly,
    priceAnnual: tier.priceAnnual,
    listPriceMonthly: tier.listPriceMonthly ?? null,
    listPriceAnnual: tier.listPriceAnnual ?? null,
    promoNote: tier.promoNote ?? null,
    foundingLimit: tier.foundingLimit ?? null,
    includesBiSeries: !!tier.includesBiSeries,
    description: tier.description,
    billing: 'recurring',
  };
}

export function publicCoursePricing(course) {
  return {
    skuType: 'course',
    id: course.id,
    label: course.label,
    shortLabel: course.shortLabel,
    format: course.format,
    duration: course.duration,
    priceOneTime: course.priceOneTime,
    listPriceOneTime: course.listPriceOneTime ?? null,
    promoNote: course.promoNote ?? null,
    foundingLimit: course.foundingLimit ?? null,
    description: course.description,
    billing: 'one_time',
  };
}

/** @deprecated */
export function publicTierPricing(tier) {
  return publicMembershipPricing(tier);
}

/** @deprecated */
export function getPricePhp(tier, period) {
  return getMembershipPricePhp(tier, period);
}
