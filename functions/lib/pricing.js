/** @typedef {'preview'|'basic'|'advanced'|'master'} Tier */
/** @typedef {'monthly'|'annual'} BillingPeriod */

export const PROGRAMS = {
  business_insurance: {
    id: 'business_insurance',
    name: 'Business Insurance Academy',
    shortName: 'BI Academy',
  },
};

export const TIERS = {
  preview: {
    id: 'preview',
    program: 'business_insurance',
    label: 'BI Academy — Preview',
    shortLabel: 'Preview',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Free sampler — partial Module 1, 1 calculator run, 1 pitch script (included in GIYA Discover)',
  },
  basic: {
    id: 'basic',
    program: 'business_insurance',
    label: 'BI Academy — Core',
    shortLabel: 'Core',
    priceMonthly: 990,
    priceAnnual: 9990,
    listPriceMonthly: 1499,
    listPriceAnnual: 14990,
    promoNote: 'Founding rate — first 100 seats at Core benefits (Modules 1–2, calculators, scripts)',
    foundingLimit: 100,
    description: 'Core benefits: full Modules 1–2, unlimited calculators, all pitch scripts',
  },
  advanced: {
    id: 'advanced',
    program: 'business_insurance',
    label: 'BI Academy — Professional',
    shortLabel: 'Professional',
    priceMonthly: 3990,
    priceAnnual: 39990,
    listPriceMonthly: 4990,
    listPriceAnnual: 49900,
    promoNote: 'Founding rate — first 30 seats at Professional benefits (+ Module 3, BIR tools, templates)',
    foundingLimit: 30,
    description: 'Professional benefits: everything in Core + Module 3, BIR tools, outreach templates',
  },
  master: {
    id: 'master',
    program: 'business_insurance',
    label: 'BI Academy — Complete',
    shortLabel: 'Complete',
    priceMonthly: 6990,
    priceAnnual: 69990,
    listPriceMonthly: 5990,
    listPriceAnnual: 59990,
    promoNote: 'Founding rate — first 10 seats at Complete benefits (full academy, case labs, certification)',
    foundingLimit: 10,
    description: 'Complete benefits: everything in Professional + case labs, board decks, certification track',
  },
};

/** Planned — invitation + checkout when live */
export const ELITE_PLANNED = {
  id: 'elite',
  label: 'GIYA Elite — All-Access',
  description:
    'All live Master Class programs at Complete depth, plus mentorship circles, deal review, and priority access. Not billed with BI Academy tiers.',
};

export const TIER_ORDER = { preview: 0, basic: 1, advanced: 2, master: 3 };

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
    note: 'Philippines e-wallets at PayMongo checkout',
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
 * @param {Tier} tier
 * @param {BillingPeriod} period
 */
export function getPricePhp(tier, period) {
  const t = TIERS[tier];
  if (!t || tier === 'preview') return 0;
  return period === 'annual' ? t.priceAnnual : t.priceMonthly;
}

export function formatPhp(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Public pricing fields for API / frontend */
export function publicTierPricing(tier) {
  const program = PROGRAMS[tier.program];
  return {
    id: tier.id,
    programId: tier.program,
    programName: program?.name ?? tier.program,
    label: tier.label,
    shortLabel: tier.shortLabel,
    priceMonthly: tier.priceMonthly,
    priceAnnual: tier.priceAnnual,
    listPriceMonthly: tier.listPriceMonthly ?? null,
    listPriceAnnual: tier.listPriceAnnual ?? null,
    promoNote: tier.promoNote ?? null,
    foundingLimit: tier.foundingLimit ?? null,
    description: tier.description,
  };
}
