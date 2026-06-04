import { readinessTierLabel } from './advisorTierLabels.js';

/** @typedef {Record<string, unknown>} AssessmentRow */

export function parseJsonArray(value) {
  if (Array.isArray(value)) return value.map(String);
  try {
    const parsed = JSON.parse(String(value || '[]'));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function formatAssessmentRow(row) {
  if (!row) return null;
  const createdAt = Number(row.created_at) || 0;
  return {
    id: String(row.id),
    created_at: createdAt,
    created_at_iso: createdAt ? new Date(createdAt * 1000).toISOString() : null,
    full_name: String(row.full_name || ''),
    email: String(row.email || ''),
    mobile: row.mobile ? String(row.mobile) : null,
    agency: row.agency ? String(row.agency) : null,
    years_in_service: row.years_in_service ? String(row.years_in_service) : null,
    keyman_cases: row.keyman_cases ? String(row.keyman_cases) : null,
    confidence_level: row.confidence_level ? String(row.confidence_level) : null,
    challenge_areas: parseJsonArray(row.challenge_areas),
    business_owner_network: row.business_owner_network ? String(row.business_owner_network) : null,
    discussed_last_12_months: row.discussed_last_12_months
      ? String(row.discussed_last_12_months)
      : null,
    markets: parseJsonArray(row.markets),
    advanced_topics: parseJsonArray(row.advanced_topics),
    masterclass_interest: row.masterclass_interest ? String(row.masterclass_interest) : null,
    preferred_format: row.preferred_format ? String(row.preferred_format) : null,
    resource_permission: Boolean(row.resource_permission),
    conversation_commitment: row.conversation_commitment
      ? String(row.conversation_commitment)
      : null,
    lead_score: Number(row.lead_score) || 0,
    lead_tier: String(row.lead_tier || 'General'),
    lead_tier_label: readinessTierLabel(row.lead_tier),
    source: String(row.source || 'keyman_readiness'),
  };
}

export function buildOutreachEmail(lead) {
  const name = lead.full_name?.split(/\s+/)[0] || 'there';
  const subject = 'Your GIYA Keyman Readiness Assessment — next steps';
  const body = `Hi ${name},

Thank you for completing the GIYA Keyman Readiness Assessment.

Your readiness profile: ${lead.lead_tier_label} (score ${lead.lead_score}/100).

I'd like to invite you to the next step in your Business Insurance journey — whether that's the Business Insurance Academy, our Master Class waiting list, or a short conversation about your practice goals.

Would you have 15 minutes this week for a quick call?

Best regards,
Nilo B. Matunog, PFA · RFP
GIYA — Guiding Advisors. Protecting Legacies.`;
  return { subject, body };
}
