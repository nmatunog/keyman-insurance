/** @typedef {'preview'|'basic'|'advanced'|'master'} Tier */
/** @typedef {'monthly'|'annual'} BillingPeriod */

export const TIERS = {
  preview: {
    id: 'preview',
    label: 'Preview',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Free sampler — 1 calculator run, partial Module 1',
  },
  basic: {
    id: 'basic',
    label: 'GIYA Founding Members (Basic)',
    priceMonthly: 990,
    priceAnnual: 9990,
    listPriceMonthly: 1499,
    listPriceAnnual: 14990,
    promoNote: 'Introductory founding rate — first 100 members',
    foundingLimit: 100,
    description: 'Full Modules 1–2, unlimited calculators, all pitch scripts',
  },
  advanced: {
    id: 'advanced',
    label: 'Founding GIYA Advanced',
    priceMonthly: 3990,
    priceAnnual: 39990,
    listPriceMonthly: 4990,
    listPriceAnnual: 49900,
    promoNote: 'Introductory founding rate — first 30 members',
    foundingLimit: 30,
    description: 'Everything in Basic + Modules 3, BIR tools, outreach templates',
  },
  master: {
    id: 'master',
    label: 'Master Class — Founding Members',
    priceMonthly: 6990,
    priceAnnual: 69990,
    listPriceMonthly: 5990,
    listPriceAnnual: 59990,
    promoNote: 'Introductory founding rate — first 10 members',
    foundingLimit: 10,
    description: 'Full academy, case labs, board decks, certification track',
  },
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
  return {
    id: tier.id,
    label: tier.label,
    priceMonthly: tier.priceMonthly,
    priceAnnual: tier.priceAnnual,
    listPriceMonthly: tier.listPriceMonthly ?? null,
    listPriceAnnual: tier.listPriceAnnual ?? null,
    promoNote: tier.promoNote ?? null,
    foundingLimit: tier.foundingLimit ?? null,
    description: tier.description,
  };
}
