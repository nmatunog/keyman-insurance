import { error, json, requireAdmin } from '../../lib/auth.js';
import { formatAssessmentRow } from '../../lib/assessments.js';

const ALLOWED_TIERS = new Set(['General', 'Warm', 'MasterClass', 'InnerCircle']);

export async function onRequestGet(context) {
  const { response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const url = new URL(context.request.url);
  const tierFilter = url.searchParams.get('tier');
  const limit = Math.min(500, Math.max(1, parseInt(url.searchParams.get('limit') || '200', 10)));

  let sql = `SELECT id, created_at, full_name, email, mobile, agency, years_in_service,
    keyman_cases, confidence_level, challenge_areas, business_owner_network,
    discussed_last_12_months, markets, advanced_topics, masterclass_interest,
    preferred_format, resource_permission, conversation_commitment,
    lead_score, lead_tier, source
    FROM assessments`;
  const binds = [];

  if (tierFilter && ALLOWED_TIERS.has(tierFilter)) {
    sql += ` WHERE lead_tier = ?`;
    binds.push(tierFilter);
  }
  sql += ` ORDER BY created_at DESC LIMIT ?`;
  binds.push(limit);

  const stmt = context.env.DB.prepare(sql);
  const { results } = binds.length ? await stmt.bind(...binds).all() : await stmt.bind(limit).all();

  const leads = (results || []).map(formatAssessmentRow).filter(Boolean);

  const tierStats = await context.env.DB.prepare(
    `SELECT lead_tier, COUNT(*) AS count FROM assessments GROUP BY lead_tier`
  ).all();

  const total = await context.env.DB.prepare(`SELECT COUNT(*) AS total FROM assessments`).first();

  return json({
    ok: true,
    total: Number(total?.total) || 0,
    tierStats: tierStats?.results || [],
    leads,
  });
}
