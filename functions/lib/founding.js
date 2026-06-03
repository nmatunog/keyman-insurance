import { COURSES, MEMBERSHIP, MEMBERSHIP_PAID_IDS } from './pricing.js';

/** Count founding slots in use (paid + pending checkout holds). */
export async function getFoundingUsed(env, tier, skuType = 'membership') {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM subscriptions
     WHERE tier = ? AND COALESCE(sku_type, 'membership') = ? AND is_founding = 1 AND status IN ('paid', 'pending')`
  )
    .bind(tier, skuType)
    .first();
  return Number(row?.n || 0);
}

export async function getFoundingStatus(env, tier, skuType = 'membership') {
  const config = skuType === 'course' ? COURSES[tier] : MEMBERSHIP[tier];
  const limit = config?.foundingLimit ?? 0;
  if (!limit) {
    return { limit: 0, used: 0, remaining: 0, full: false, available: false };
  }
  const used = await getFoundingUsed(env, tier, skuType);
  const remaining = Math.max(0, limit - used);
  return {
    limit,
    used,
    remaining,
    full: remaining <= 0,
    available: remaining > 0,
  };
}

export async function getAllFoundingStatus(env) {
  const membership = {};
  for (const tier of MEMBERSHIP_PAID_IDS) {
    membership[tier] = await getFoundingStatus(env, tier, 'membership');
  }
  const courses = {};
  for (const id of Object.keys(COURSES)) {
    courses[id] = await getFoundingStatus(env, id, 'course');
  }
  return { membership, courses };
}

/**
 * Membership checkout (monthly / annual).
 */
export async function resolveMembershipPricing(env, tier, billingPeriod) {
  const config = MEMBERSHIP[tier];
  if (!config) return null;

  const founding = await getFoundingStatus(env, tier, 'membership');
  const isAnnual = billingPeriod === 'annual';

  if (founding.available) {
    return {
      amountPhp: isAnnual ? config.priceAnnual : config.priceMonthly,
      isFounding: true,
      founding,
      rateLabel: 'Founding membership rate',
      skuType: 'membership',
      billingPeriod,
    };
  }

  const listMonthly = config.listPriceMonthly ?? config.priceMonthly;
  const listAnnual = config.listPriceAnnual ?? config.priceAnnual;

  return {
    amountPhp: isAnnual ? listAnnual : listMonthly,
    isFounding: false,
    founding,
    rateLabel: founding.limit ? 'Standard membership (founding full)' : 'Standard membership',
    skuType: 'membership',
    billingPeriod,
  };
}

/**
 * Course checkout (one-time cohort enrollment).
 */
export async function resolveCoursePricing(env, courseId) {
  const config = COURSES[courseId];
  if (!config) return null;

  const founding = await getFoundingStatus(env, courseId, 'course');

  if (founding.available) {
    return {
      amountPhp: config.priceOneTime,
      isFounding: true,
      founding,
      rateLabel: 'Founding cohort rate',
      skuType: 'course',
      billingPeriod: 'one_time',
    };
  }

  return {
    amountPhp: config.listPriceOneTime ?? config.priceOneTime,
    isFounding: false,
    founding,
    rateLabel: founding.limit ? 'Standard cohort rate (founding full)' : 'Standard cohort rate',
    skuType: 'course',
    billingPeriod: 'one_time',
  };
}

/** @deprecated */
export async function resolveCheckoutPricing(env, tier, billingPeriod) {
  return resolveMembershipPricing(env, tier, billingPeriod);
}
