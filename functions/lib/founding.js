import { ACADEMIES, MEMBERSHIP, normalizeMembershipTier } from './pricing.js';
import { applyAcademyDiscount, getMembershipPricePhp } from './pricing.js';

export async function getAllFoundingStatus() {
  return { membership: {}, academies: {} };
}

export async function resolveMembershipPricing(env, tier, billingPeriod) {
  const config = MEMBERSHIP[tier];
  if (!config || tier === 'preview') return null;

  const isAnnual = billingPeriod === 'annual';
  return {
    amountPhp: getMembershipPricePhp(tier, billingPeriod),
    isFounding: false,
    founding: null,
    rateLabel: isAnnual ? 'Annual membership' : 'Monthly membership',
    skuType: 'membership',
    billingPeriod,
  };
}

/**
 * Academy one-time checkout — Professional 20% off; Elite included.
 */
export async function resolveAcademyPricing(env, academyId, user) {
  const config = ACADEMIES[academyId];
  if (!config) return null;
  if (config.status !== 'live') return { error: 'This academy is not open for enrollment yet' };

  const memberTier =
    user?.status === 'active' ? normalizeMembershipTier(user.tier) : 'preview';
  const { amountPhp, discountPct, rateLabel } = applyAcademyDiscount(config.priceOneTime, memberTier);

  if (amountPhp === 0 && discountPct === 100) {
    return { error: 'This academy is included in your GIYA Elite membership' };
  }

  return {
    amountPhp,
    isFounding: false,
    founding: null,
    rateLabel,
    skuType: 'academy',
    billingPeriod: 'one_time',
    listPricePhp: config.priceOneTime,
    discountPct,
  };
}

export async function getUserOwnedAcademies(env, userId) {
  const ids = Object.keys(ACADEMIES);
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const { results } = await env.DB.prepare(
    `SELECT DISTINCT tier FROM subscriptions
     WHERE user_id = ? AND COALESCE(sku_type, 'membership') IN ('academy', 'course')
     AND status = 'paid' AND tier IN (${placeholders})`
  )
    .bind(userId, ...ids)
    .all();
  return (results || []).map((r) => r.tier);
}

export async function resolveCheckoutPricing(env, tier, billingPeriod) {
  return resolveMembershipPricing(env, tier, billingPeriod);
}
