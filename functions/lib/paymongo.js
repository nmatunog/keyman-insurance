/** PayMongo Checkout API v2 helpers */

export function paymongoAuthHeader(secretKey) {
  const token = btoa(`${secretKey}:`);
  return `Basic ${token}`;
}

export async function createPaymongoCheckout(env, opts) {
  const {
    user,
    tier,
    tierLabel: tierLabelIn,
    billingPeriod,
    amountPhp,
    paymentRef,
    subId,
    siteUrl,
    isFounding = false,
  } = opts;

  const tierLabel = tierLabelIn || tier.charAt(0).toUpperCase() + tier.slice(1);
  const periodLabel = billingPeriod === 'annual' ? 'Annual' : 'Monthly';
  const foundingTag = isFounding ? ' · Founding' : '';
  const amountCentavo = Math.round(amountPhp * 100);

  const body = {
    data: {
      attributes: {
        billing: {
          name: user.name || user.email,
          email: user.email,
        },
        cancel_url: `${siteUrl}/account.html?cancelled=1`,
        success_url: `${siteUrl}/account.html?paid=1&ref=${encodeURIComponent(paymentRef)}`,
        description: `GIYA ${tierLabel || tier} — ${periodLabel}${foundingTag}`,
        line_items: [
          {
            amount: amountCentavo,
            currency: 'PHP',
            name: `GIYA ${tierLabel || tier} (${periodLabel})`,
            quantity: 1,
            description: `BI Academy — ${tierLabel}`,
          },
        ],
        payment_method_types: ['gcash', 'paymaya', 'qrph', 'card'],
        reference_number: paymentRef,
        send_email_receipt: true,
        show_description: true,
        show_line_items: true,
        metadata: {
          giya_subscription_id: subId,
          giya_tier: tier,
          giya_payment_ref: paymentRef,
          giya_is_founding: isFounding ? '1' : '0',
          giya_user_id: user.id,
        },
      },
    },
  };

  const res = await fetch('https://api.paymongo.com/v2/checkout_sessions', {
    method: 'POST',
    headers: {
      Authorization: paymongoAuthHeader(env.PAYMONGO_SECRET_KEY),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.errors?.[0]?.detail ||
      data?.errors?.[0]?.title ||
      data?.message ||
      'PayMongo checkout failed';
    return { error: msg };
  }

  const checkoutUrl = data?.data?.attributes?.checkout_url;
  const sessionId = data?.data?.id;
  if (!checkoutUrl) return { error: 'PayMongo did not return a checkout URL' };

  return { url: checkoutUrl, sessionId };
}

/**
 * Verify Paymongo-Signature header (HMAC-SHA256 of raw body).
 * @param {string} rawBody
 * @param {string} signatureHeader
 * @param {string} webhookSecret
 */
export async function verifyPaymongoWebhook(rawBody, signatureHeader, webhookSecret) {
  if (!webhookSecret || !signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => {
      const idx = p.indexOf('=');
      if (idx === -1) return [p.trim(), ''];
      return [p.slice(0, idx).trim(), p.slice(idx + 1).trim()];
    })
  );

  const timestamp = parts.t;
  const signature = parts.te || parts.v1 || parts.sig;
  if (!timestamp || !signature) return false;

  const payload = `${timestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');

  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function parsePaymongoPaidEvent(body) {
  const root = body?.data;
  if (!root) return null;

  const eventType = root.type || body?.type;
  if (eventType !== 'checkout_session.payment.paid') return null;

  const session = root.data || root.attributes?.data || root;
  const attrs = session.attributes || session;
  const metadata = attrs.metadata || {};
  const reference = attrs.reference_number || metadata.giya_payment_ref;

  return {
    subscriptionId: metadata.giya_subscription_id,
    tier: metadata.giya_tier,
    paymentRef: reference,
    sessionId: session.id,
  };
}
