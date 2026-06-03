import { getSessionUser, json, publicUser } from '../../lib/auth.js';
import { getAllFoundingStatus } from '../../lib/founding.js';
import { ELITE_PLANNED, PAYMENT_CHANNELS, TIERS, publicTierPricing } from '../../lib/pricing.js';

export async function onRequestGet(context) {
  const user = await getSessionUser(context.request, context.env);
  const founding = await getAllFoundingStatus(context.env);
  const pricing = Object.fromEntries(
    Object.entries(TIERS).map(([k, v]) => [
      k,
      { ...publicTierPricing(v), founding: founding[k] || null },
    ])
  );

  if (!user) {
    return json({
      ok: true,
      authenticated: false,
      user: null,
      pricing,
      paymentChannels: PAYMENT_CHANNELS,
      elite: ELITE_PLANNED,
      membershipNote:
        'One subscription unlocks BI Academy benefits at your chosen depth. Elite All-Access (planned) includes all programs — not an add-on to Complete.',
    });
  }

  return json({
    ok: true,
    authenticated: true,
    user: publicUser(user),
    pricing,
    paymentChannels: PAYMENT_CHANNELS,
    elite: ELITE_PLANNED,
    membershipNote:
      'One subscription unlocks BI Academy benefits at your chosen depth. Elite All-Access (planned) includes all programs — not an add-on to Complete.',
  });
}
