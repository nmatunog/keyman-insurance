import { now } from './auth.js';
import { MEMBERSHIP_PAID_IDS, normalizeMembershipTier } from './pricing.js';

/**
 * Enforce recurring membership: Elite/Professional access only while a paid
 * membership subscription is active (ends_at in the future).
 */
export async function syncMembershipForUser(env, userId) {
  const ts = now();

  const user = await env.DB.prepare('SELECT id, tier, role, status FROM users WHERE id = ?')
    .bind(userId)
    .first();
  if (!user) return { active: null, lapsed: false };
  if (user.role === 'admin') return { active: null, lapsed: false, admin: true };

  await env.DB.prepare(
    `UPDATE subscriptions SET status = 'cancelled', updated_at = ?
     WHERE user_id = ? AND COALESCE(sku_type, 'membership') = 'membership'
     AND status = 'paid' AND ends_at IS NOT NULL AND ends_at <= ?`
  )
    .bind(ts, userId, ts)
    .run();

  const active = await env.DB.prepare(
    `SELECT id, tier, ends_at, billing_period FROM subscriptions
     WHERE user_id = ? AND COALESCE(sku_type, 'membership') = 'membership'
     AND status = 'paid' AND tier IN ('professional', 'elite')
     AND (ends_at IS NULL OR ends_at > ?)
     ORDER BY ends_at DESC LIMIT 1`
  )
    .bind(userId, ts)
    .first();

  if (active) {
    const tier = normalizeMembershipTier(active.tier);
    if (user.tier !== tier || user.status !== 'active') {
      await env.DB.prepare(
        `UPDATE users SET tier = ?, status = 'active', updated_at = ? WHERE id = ?`
      )
        .bind(tier, ts, userId)
        .run();
    }
    return {
      active: {
        tier,
        endsAt: active.ends_at,
        billingPeriod: active.billing_period,
        subscriptionId: active.id,
      },
      lapsed: false,
    };
  }

  const paidTier = normalizeMembershipTier(user.tier);
  if (MEMBERSHIP_PAID_IDS.includes(paidTier)) {
    const previousTier = paidTier;
    await env.DB.prepare(`UPDATE users SET tier = 'preview', updated_at = ? WHERE id = ?`)
      .bind(ts, userId)
      .run();
    return { active: null, lapsed: true, previousTier };
  }

  return { active: null, lapsed: false };
}

export function membershipAccessMessage(sync) {
  if (sync?.admin) return null;
  if (sync?.active?.tier) {
    const end = sync.active.endsAt;
    if (!end) return 'Membership active.';
    const d = new Date(end * 1000).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `Membership active through ${d}. Renew before lapse to keep Elite/Professional benefits.`;
  }
  if (sync?.lapsed) {
    const was = sync.previousTier === 'elite' ? 'GIYA Fellow' : 'GIYA Professional';
    return `${was} has ended. Academy and coaching access are paused until you renew. Standalone Academy purchases you own separately are unchanged.`;
  }
  return null;
}
