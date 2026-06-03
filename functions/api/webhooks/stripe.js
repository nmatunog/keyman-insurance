import { json, now } from '../../lib/auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response('Webhook not configured', { status: 503 });

  const payload = await request.text();
  const sig = request.headers.get('Stripe-Signature') || '';

  // Verify Stripe signature (simplified — production should use stripe SDK)
  const valid = await verifyStripeSignature(payload, sig, secret);
  if (!valid) return new Response('Invalid signature', { status: 400 });

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response('Invalid payload', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const subId = session.metadata?.giya_subscription_id || session.client_reference_id;
    const tier = session.metadata?.giya_tier;
    if (subId && tier) {
      const ts = now();
      const sub = await env.DB.prepare('SELECT user_id, billing_period FROM subscriptions WHERE id = ?')
        .bind(subId)
        .first();
      if (sub) {
        const periodSec = sub.billing_period === 'annual' ? 365 * 86400 : 30 * 86400;
        await env.DB.batch([
          env.DB.prepare(
            `UPDATE subscriptions SET status = 'paid', payment_ref = ?, starts_at = ?, ends_at = ?, updated_at = ? WHERE id = ?`
          ).bind(session.id, ts, ts + periodSec, ts, subId),
          env.DB.prepare(
            `UPDATE users SET tier = ?, status = 'active', updated_at = ? WHERE id = ?`
          ).bind(tier, ts, sub.user_id),
        ]);
      }
    }
  }

  return json({ received: true });
}

async function verifyStripeSignature(payload, header, secret) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const [k, v] = p.split('=');
      return [k, v];
    })
  );
  const timestamp = parts.t;
  const v1 = parts.v1;
  if (!timestamp || !v1) return false;

  const signed = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed));
  const expected = [...new Uint8Array(sig)].map((b) => b.toFixed(0).padStart(2, '0')).join('');
  return timingSafeEqual(expected, v1);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
