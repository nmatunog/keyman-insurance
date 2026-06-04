import { error, json, readJson } from '../../lib/auth.js';
import { sendReadinessFollowUpEmail } from '../../lib/readinessEmail.js';

/** Send assessment bonus email only (retry path if full submit failed). */
export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const email = String(body.email || '')
    .trim()
    .toLowerCase();
  const fullName = String(body.full_name || body.fullName || '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error('Valid email is required');
  }
  if (!fullName) return error('Full name is required');

  const score = Number(body.lead_score ?? body.score ?? 0) || 0;
  const tier = String(body.lead_tier || body.tier || 'General');
  const tierLabel = String(body.lead_tier_label || body.tierLabel || tier);
  const resourcePermission =
    body.resource_permission === true ||
    body.resource_permission === 'Yes' ||
    body.resourcePermission === true;

  const emailResult = await sendReadinessFollowUpEmail(
    context.env,
    {
      email,
      full_name: fullName,
      resource_permission: resourcePermission,
      lead_score: score,
      lead_tier: tier,
    },
    { score, tier, tierLabel }
  );

  return json({
    ok: true,
    email_sent: Boolean(emailResult.sent),
    email_reason: emailResult.reason || null,
  });
}
