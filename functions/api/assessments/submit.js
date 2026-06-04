import { error, json, now, readJson } from '../../lib/auth.js';
import { calculateLeadScore, normalizeAssessmentBody } from '../../lib/leadScore.js';
import { sendReadinessFollowUpEmail } from '../../lib/readinessEmail.js';

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const data = normalizeAssessmentBody(body);
  if (!data) return error('Full name and valid email are required');

  const { score, tier, tierLabel } = calculateLeadScore(data);
  const id = crypto.randomUUID();
  const ts = now();

  await context.env.DB.prepare(
    `INSERT INTO assessments (
      id, created_at, full_name, email, mobile, agency, years_in_service,
      keyman_cases, confidence_level, challenge_areas, business_owner_network,
      discussed_last_12_months, markets, advanced_topics, masterclass_interest,
      preferred_format, resource_permission, conversation_commitment,
      lead_score, lead_tier, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      ts,
      data.full_name,
      data.email,
      data.mobile,
      data.agency,
      data.years_in_service,
      data.keyman_cases,
      data.confidence_level,
      JSON.stringify(data.challenge_areas),
      data.business_owner_network,
      data.discussed_last_12_months,
      JSON.stringify(data.markets),
      JSON.stringify(data.advanced_topics),
      data.masterclass_interest,
      data.preferred_format,
      data.resource_permission ? 1 : 0,
      data.conversation_commitment,
      score,
      tier,
      'keyman_readiness'
    )
    .run();

  const emailResult = await sendReadinessFollowUpEmail(
    context.env,
    { ...data, lead_score: score, lead_tier: tier },
    { score, tier, tierLabel }
  );

  return json({
    ok: true,
    id,
    lead_score: score,
    lead_tier: tier,
    lead_tier_label: tierLabel,
    email_sent: Boolean(emailResult.sent),
    email_reason: emailResult.sent ? null : emailResult.reason || 'send_failed',
    admin_notified: Boolean(emailResult.admin_notified),
  });
}
