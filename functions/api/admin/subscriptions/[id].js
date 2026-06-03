import { error, json, now, readJson, requireAdmin } from '../../../lib/auth.js';

/** Approve a manual / pending subscription and upgrade member tier */
export async function onRequestPost(context) {
  const { user, response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const subId = context.params.id;
  const body = await readJson(context.request);
  const action = body?.action || 'approve';

  const sub = await context.env.DB.prepare(
    'SELECT * FROM subscriptions WHERE id = ?'
  )
    .bind(subId)
    .first();
  if (!sub) return error('Subscription not found', 404);

  const ts = now();

  if (action === 'approve') {
    const skuType = sub.sku_type || 'membership';
    const periodSec =
      skuType === 'academy' || skuType === 'course'
        ? 365 * 86400
        : sub.billing_period === 'annual'
          ? 365 * 86400
          : 30 * 86400;
    const stmts = [
      context.env.DB.prepare(
        `UPDATE subscriptions SET status = 'paid', starts_at = ?, ends_at = ?, updated_at = ? WHERE id = ?`
      ).bind(ts, ts + periodSec, ts, subId),
    ];
    if (skuType === 'membership') {
      stmts.push(
        context.env.DB.prepare(
          `UPDATE users SET tier = ?, status = 'active', updated_at = ? WHERE id = ?`
        ).bind(sub.tier, ts, sub.user_id)
      );
    } else {
      stmts.push(
        context.env.DB.prepare(`UPDATE users SET status = 'active', updated_at = ? WHERE id = ?`).bind(
          ts,
          sub.user_id
        )
      );
    }
    await context.env.DB.batch(stmts);
    return json({ ok: true, message: 'Payment approved' });
  }

  if (action === 'reject') {
    await context.env.DB.prepare(
      `UPDATE subscriptions SET status = 'cancelled', updated_at = ? WHERE id = ?`
    )
      .bind(ts, subId)
      .run();
    return json({ ok: true, message: 'Payment rejected' });
  }

  return error('Unknown action');
}
