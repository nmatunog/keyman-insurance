import { error, json, now, readJson, requireAuth } from '../../lib/auth.js';
import { resolveCoursePricing, resolveMembershipPricing } from '../../lib/founding.js';
import { COURSES, MEMBERSHIP } from '../../lib/pricing.js';
import { createPaymongoCheckout } from '../../lib/paymongo.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const body = await readJson(request);
  if (!body) return error('Invalid JSON body');

  const skuType = body.skuType === 'course' ? 'course' : 'membership';
  const provider = body.provider || 'paymongo';
  const siteUrl = env.GIYA_SITE_URL || 'https://joingiya.com';
  const subId = crypto.randomUUID();
  const ts = now();

  let quote;
  let tier;
  let courseId = null;
  let tierLabel;
  /** @type {'monthly'|'annual'} */
  let billingPeriod;

  if (skuType === 'course') {
    courseId = body.courseId || body.tier || 'bi_series';
    if (!COURSES[courseId]) return error('Unknown course');
    quote = await resolveCoursePricing(env, courseId);
    tier = courseId;
    tierLabel = COURSES[courseId].label;
    billingPeriod = 'annual';
  } else {
    tier = body.tier;
    billingPeriod = body.billingPeriod === 'annual' ? 'annual' : 'monthly';
    if (!['basic', 'advanced', 'master'].includes(tier)) {
      return error('Invalid membership tier');
    }
    if (!MEMBERSHIP[tier]) return error('Unknown membership tier');
    quote = await resolveMembershipPricing(env, tier, billingPeriod);
    tierLabel = MEMBERSHIP[tier].label;
  }

  if (!quote) return error('Unable to resolve pricing');

  const { amountPhp, isFounding, founding, rateLabel } = quote;
  const refPrefix = skuType === 'course' ? 'CRS' : 'MEM';
  const paymentRef = `GIYA-${refPrefix}-${subId.slice(0, 8).toUpperCase()}`;

  await env.DB.prepare(
    `INSERT INTO subscriptions
     (id, user_id, tier, billing_period, amount_php, payment_provider, payment_ref, status, is_founding, sku_type, course_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`
  )
    .bind(
      subId,
      user.id,
      tier,
      billingPeriod,
      amountPhp,
      provider,
      paymentRef,
      isFounding ? 1 : 0,
      skuType,
      courseId,
      ts,
      ts
    )
    .run();

  const checkoutOpts = {
    user,
    tier,
    tierLabel,
    skuType,
    courseId,
    billingPeriod: skuType === 'course' ? 'one_time' : billingPeriod,
    amountPhp,
    subId,
    paymentRef,
    siteUrl,
    isFounding,
  };

  if (provider === 'stripe' && env.STRIPE_SECRET_KEY) {
    const checkout = await createStripeCheckout(env, checkoutOpts);
    if (checkout.error) return error(checkout.error, 502);
    return json({
      ok: true,
      provider: 'stripe',
      skuType,
      subscriptionId: subId,
      paymentRef,
      amountPhp,
      isFounding,
      rateLabel,
      founding,
      checkoutUrl: checkout.url,
    });
  }

  if (provider === 'paymongo' && env.PAYMONGO_SECRET_KEY) {
    const checkout = await createPaymongoCheckout(env, checkoutOpts);
    if (checkout.error) return error(checkout.error, 502);
    return json({
      ok: true,
      provider: 'paymongo',
      skuType,
      subscriptionId: subId,
      paymentRef,
      amountPhp,
      isFounding,
      rateLabel,
      founding,
      checkoutUrl: checkout.url,
    });
  }

  const gcash = formatGcash(env.GIYA_GCASH_NUMBER || '09209648523');
  const bankLine = env.GIYA_BANK_DETAILS || 'GoTyme Bank · NILO MATUNOG · 010330299152';

  return json({
    ok: true,
    provider: 'manual',
    skuType,
    subscriptionId: subId,
    paymentRef,
    amountPhp,
    isFounding,
    rateLabel,
    founding,
    tier,
    courseId,
    billingPeriod: checkoutOpts.billingPeriod,
    instructions: {
      title:
        skuType === 'course'
          ? isFounding
            ? 'Complete BI Series cohort payment'
            : 'Complete BI Series enrollment payment'
          : isFounding
            ? 'Complete founding membership payment'
            : 'Complete membership payment',
      reference: paymentRef,
      amount: amountPhp,
      currency: 'PHP',
      rateLabel,
      channels: [
        {
          method: 'GCash',
          label: env.GIYA_GCASH_LABEL || 'Giya Gcash',
          detail: gcash,
          accountName: env.GIYA_ACCOUNT_NAME || 'NILO MATUNOG',
          qrImage: `${siteUrl}/assets/payments/gcash-qr.png`,
          steps: [`Send ${formatPhp(amountPhp)} to GCash ${gcash}`, `Reference: ${paymentRef}`],
        },
        {
          method: 'GoTyme (InstaPay)',
          label: env.GIYA_BANK_NAME || 'GoTyme Bank',
          detail: bankLine,
          accountName: env.GIYA_ACCOUNT_NAME || 'NILO MATUNOG',
          accountNumber: env.GIYA_ACCOUNT_NUMBER || '010330299152',
          qrImage: `${siteUrl}/assets/payments/gotyme-qr.png`,
          steps: [`Transfer ${formatPhp(amountPhp)} via InstaPay or scan QR`, `Reference: ${paymentRef}`],
        },
      ],
      note:
        skuType === 'course'
          ? 'Admin confirms your cohort seat after payment (usually within 1 business day).'
          : 'Admin activates your 12-month academy access after verification.',
    },
  });
}

function formatGcash(num) {
  const d = String(num).replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('09')) {
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  return num;
}

function formatPhp(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);
}

async function createStripeCheckout(env, opts) {
  const { user, tier, tierLabel, billingPeriod, amountPhp, subId, paymentRef, siteUrl, isFounding, skuType } =
    opts;
  const periodLabel = billingPeriod === 'one_time' ? 'one-time enrollment' : billingPeriod;
  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', `${siteUrl}/account.html?paid=1&ref=${paymentRef}`);
  params.set('cancel_url', `${siteUrl}/account.html`);
  params.set('client_reference_id', subId);
  params.set('customer_email', user.email);
  params.set('line_items[0][price_data][currency]', 'php');
  params.set('line_items[0][price_data][unit_amount]', String(amountPhp * 100));
  params.set(
    'line_items[0][price_data][product_data][name]',
    `${tierLabel} — ${periodLabel}${isFounding ? ' (Founding)' : ''}`
  );
  params.set('line_items[0][quantity]', '1');
  params.set('metadata[giya_subscription_id]', subId);
  params.set('metadata[giya_tier]', tier);
  params.set('metadata[giya_sku_type]', skuType);
  params.set('metadata[giya_payment_ref]', paymentRef);
  params.set('metadata[giya_is_founding]', isFounding ? '1' : '0');

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) return { error: data.error?.message || 'Stripe checkout failed' };
  return { url: data.url };
}
