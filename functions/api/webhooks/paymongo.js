import { json, now } from '../../lib/auth.js';
import { parsePaymongoPaidEvent, verifyPaymongoWebhook } from '../../lib/paymongo.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const rawBody = await request.text();

  const webhookSecret = env.PAYMONGO_WEBHOOK_SECRET;
  if (webhookSecret) {
    const sig = request.headers.get('Paymongo-Signature') || request.headers.get('paymongo-signature');
    const valid = await verifyPaymongoWebhook(rawBody, sig || '', webhookSecret);
    if (!valid) return new Response('Invalid signature', { status: 401 });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const paid = parsePaymongoPaidEvent(body);
  if (!paid?.subscriptionId && !paid?.paymentRef) {
    return json({ received: true, skipped: true });
  }

  const ts = now();
  let sub = null;

  if (paid.subscriptionId) {
    sub = await env.DB.prepare('SELECT * FROM subscriptions WHERE id = ?')
      .bind(paid.subscriptionId)
      .first();
  }
  if (!sub && paid.paymentRef) {
    sub = await env.DB.prepare('SELECT * FROM subscriptions WHERE payment_ref = ?')
      .bind(paid.paymentRef)
      .first();
  }

  if (!sub) return json({ received: true, error: 'subscription_not_found' });

  const tier = paid.tier || sub.tier;
  const periodSec = sub.billing_period === 'annual' ? 365 * 86400 : 30 * 86400;
  const providerRef = paid.sessionId || sub.payment_ref;

  await env.DB.batch([
    env.DB.prepare(
      `UPDATE subscriptions SET status = 'paid', payment_provider = 'paymongo', payment_ref = ?, starts_at = ?, ends_at = ?, updated_at = ? WHERE id = ?`
    ).bind(providerRef, ts, ts + periodSec, ts, sub.id),
    env.DB.prepare(
      `UPDATE users SET tier = ?, status = 'active', updated_at = ? WHERE id = ?`
    ).bind(tier, ts, sub.user_id),
  ]);

  return json({ received: true, fulfilled: true });
}
