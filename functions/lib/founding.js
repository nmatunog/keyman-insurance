import { TIERS } from './pricing.js';

const PAID_TIER_IDS = ['basic', 'advanced', 'master'];

/** Count founding slots in use (paid + pending checkout holds). */
export async function getFoundingUsed(env, tier) {
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM subscriptions
     WHERE tier = ? AND is_founding = 1 AND status IN ('paid', 'pending')`
  )
    .bind(tier)
    .first();
  return Number(row?.n || 0);
}

export async function getFoundingStatus(env, tier) {
  const config = TIERS[tier];
  const limit = config?.foundingLimit ?? 0;
  if (!limit) {
    return { limit: 0, used: 0, remaining: 0, full: false, available: false };
  }
  const used = await getFoundingUsed(env, tier);
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
  const out = {};
  for (const tier of PAID_TIER_IDS) {
    out[tier] = await getFoundingStatus(env, tier);
  }
  return out;
}

/**
 * Resolve amount and founding flag for checkout.
 * @param {object} env
 * @param {string} tier
 * @param {'monthly'|'annual'} billingPeriod
 */
export async function resolveCheckoutPricing(env, tier, billingPeriod) {
  const config = TIERS[tier];
  if (!config) return null;

  const founding = await getFoundingStatus(env, tier);
  const isAnnual = billingPeriod === 'annual';

  if (founding.available) {
    return {
      amountPhp: isAnnual ? config.priceAnnual : config.priceMonthly,
      isFounding: true,
      founding: founding,
      rateLabel: 'Founding member rate',
    };
  }

  const listMonthly = config.listPriceMonthly ?? config.priceMonthly;
  const listAnnual = config.listPriceAnnual ?? config.priceAnnual;

  return {
    amountPhp: isAnnual ? listAnnual : listMonthly,
    isFounding: false,
    founding: founding,
    rateLabel: founding.limit ? 'Standard rate (founding promo full)' : 'Standard rate',
  };
}
