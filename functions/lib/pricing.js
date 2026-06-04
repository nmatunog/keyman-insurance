/** @typedef {'preview'|'professional'|'elite'} MembershipTierId */
/** @typedef {'monthly'|'annual'} BillingPeriod */

/** Platform membership — learning community vs full ecosystem */
export const MEMBERSHIP = {
  preview: {
    id: 'preview',
    skuType: 'membership',
    label: 'GIYA Discover',
    shortLabel: 'Discover',
    priceMonthly: 0,
    priceAnnual: 0,
    academyDiscountPct: 0,
    includesAllAcademies: false,
    features: ['Advisor Readiness Assessment', 'Newsletter', 'Webinars'],
    description: 'Free entry — assessment, newsletter, and webinars.',
  },
  professional: {
    id: 'professional',
    skuType: 'membership',
    label: 'GIYA Professional',
    shortLabel: 'Professional',
    priceMonthly: 999,
    priceAnnual: 9990,
    academyDiscountPct: 20,
    includesAllAcademies: false,
    features: [
      'Community',
      'Monthly Master Class',
      'Resource library',
      'Case studies',
      '20% discount on all Academies',
    ],
    description: 'Learning community — plus 20% off every Academy purchase.',
  },
  elite: {
    id: 'elite',
    skuType: 'membership',
    label: 'GIYA Fellow',
    shortLabel: 'GIYA Fellow',
    priceMonthly: 2999,
    priceAnnual: 29990,
    academyDiscountPct: 100,
    includesAllAcademies: true,
    features: [
      'Everything in Professional',
      'Access to ALL Academies',
      'Coaching sessions',
      'By invitation',
    ],
    description: 'GIYA Fellow — full ecosystem, all Academies and coaching. By invitation.',
    graduateTitle: 'Legacy Consultant',
    graduateNote: 'Advisors who complete Master Class academies may earn the Legacy Consultant designation.',
  },
};

/** Standalone Academy purchases (one-time) */
export const ACADEMIES = {
  business_insurance: {
    id: 'business_insurance',
    skuType: 'academy',
    label: 'Business Insurance Academy',
    shortLabel: 'Business Insurance',
    priceOneTime: 7990,
    status: 'live',
    description: 'Entity risk, buy-sell, key person, corporate prospecting — SEC, Civil Code, BIR aligned.',
  },
  estate_conservation: {
    id: 'estate_conservation',
    skuType: 'academy',
    label: 'Estate Conservation Academy',
    shortLabel: 'Estate Conservation',
    priceOneTime: 7990,
    status: 'coming_soon',
    description: 'TRAIN, trusts, non-probate transfers.',
  },
  health_planning: {
    id: 'health_planning',
    skuType: 'academy',
    label: 'Health Planning Academy',
    shortLabel: 'Health Planning',
    priceOneTime: 7990,
    status: 'coming_soon',
    description: 'Critical illness, HMO integration, funding strategies.',
  },
  wealth_management: {
    id: 'wealth_management',
    skuType: 'academy',
    label: 'Wealth Management Academy',
    shortLabel: 'Wealth Management',
    priceOneTime: 9990,
    status: 'coming_soon',
    description: 'Portfolio, goals-based planning, HNW service design.',
  },
  succession_planning: {
    id: 'succession_planning',
    skuType: 'academy',
    label: 'Succession Planning Academy',
    shortLabel: 'Succession Planning',
    priceOneTime: 12990,
    status: 'coming_soon',
    description: 'Business succession, continuity, and legacy transfer.',
  },
};

/** @deprecated */
export const TIERS = MEMBERSHIP;
export const COURSES = ACADEMIES;

export const TIER_ORDER = { preview: 0, professional: 1, elite: 2 };
/** Gating ladder for BI tools (preview < professional community < elite / owned academy) */
export const ACCESS_ORDER = { preview: 0, professional: 1, elite: 2 };

export const MEMBERSHIP_PAID_IDS = ['professional', 'elite'];
export const ACADEMY_IDS = Object.keys(ACADEMIES);
export const LIVE_ACADEMY_IDS = ACADEMY_IDS.filter((id) => ACADEMIES[id].status === 'live');

export const PAYMENT_CHANNELS = {
  manual: {
    id: 'manual',
    label: 'GCash or GoTyme (direct)',
    provider: 'manual',
    enabled: true,
    note: 'Send to our GCash or GoTyme account — fastest, no extra fees. Include your payment reference.',
    recommended: true,
  },
  paymongo: {
    id: 'paymongo',
    label: 'Visa / Mastercard',
    provider: 'paymongo',
    enabled: true,
    note: 'Pay with credit or debit card via PayMongo Checkout',
  },
  stripe: {
    id: 'stripe',
    label: 'Card (Stripe)',
    provider: 'stripe',
    enabled: false,
    note: 'Optional — enable when STRIPE_SECRET_KEY is configured',
  },
};

export function getMembershipPricePhp(tier, period) {
  const t = MEMBERSHIP[tier];
  if (!t || tier === 'preview') return 0;
  return period === 'annual' ? t.priceAnnual : t.priceMonthly;
}

export function getAcademyListPricePhp(academyId) {
  return ACADEMIES[academyId]?.priceOneTime ?? 0;
}

export function applyAcademyDiscount(listPrice, membershipTierId) {
  const m = MEMBERSHIP[membershipTierId];
  if (!m || !m.academyDiscountPct) return { amountPhp: listPrice, discountPct: 0, rateLabel: 'Standard academy price' };
  if (m.includesAllAcademies) {
    return { amountPhp: 0, discountPct: 100, rateLabel: 'Included in GIYA Fellow' };
  }
  const pct = m.academyDiscountPct;
  const amountPhp = Math.round(listPrice * (1 - pct / 100));
  return {
    amountPhp,
    discountPct: pct,
    rateLabel: `Professional member — ${pct}% off`,
  };
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
    academyDiscountPct: tier.academyDiscountPct,
    includesAllAcademies: tier.includesAllAcademies,
    features: tier.features,
    description: tier.description,
    billing: 'recurring',
  };
}

export function publicAcademyPricing(academy, memberTier = 'preview') {
  const list = academy.priceOneTime;
  const discounted = applyAcademyDiscount(list, memberTier);
  return {
    skuType: 'academy',
    id: academy.id,
    label: academy.label,
    shortLabel: academy.shortLabel,
    priceOneTime: list,
    priceForYou: discounted.amountPhp,
    discountPct: discounted.discountPct,
    rateLabel: discounted.rateLabel,
    status: academy.status,
    description: academy.description,
    billing: 'one_time',
  };
}

export function publicTierPricing(tier) {
  return publicMembershipPricing(tier);
}

export function getPricePhp(tier, period) {
  return getMembershipPricePhp(tier, period);
}

/** Map legacy DB tiers to new membership for display */
export function normalizeMembershipTier(tier) {
  if (tier === 'basic' || tier === 'advanced') return 'professional';
  if (tier === 'master') return 'elite';
  if (tier === 'professional' || tier === 'elite' || tier === 'preview') return tier;
  return 'preview';
}

/** Effective content access for BI academy gating */
export function effectiveAccessTier(membershipTier, ownedAcademyIds = []) {
  const m = normalizeMembershipTier(membershipTier);
  if (m === 'elite') return 'elite';
  if (ownedAcademyIds.includes('business_insurance')) return 'elite';
  return m;
}
