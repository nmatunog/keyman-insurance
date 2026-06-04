import { calculateLeadScore as scoreFromEngine } from './readinessEngine.js';

/** @typedef {Record<string, unknown>} AssessmentPayload */

/** Normalize en-dash/em-dash ranges for scoring comparisons */
export function normDash(value) {
  return String(value || '')
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
}

/**
 * Advisor Readiness Scoring Engine v1 (weighted categories).
 * Internal tiers unchanged for D1: General, Warm, MasterClass, InnerCircle.
 */
export function calculateLeadScore(data) {
  const { score, tier, tierLabel, report } = scoreFromEngine(data);
  return { score, tier, tierLabel, report };
}

export function normalizeAssessmentBody(body) {
  if (!body || typeof body !== 'object') return null;
  const email = String(body.email || '')
    .trim()
    .toLowerCase();
  const fullName = String(body.full_name || body.fullName || '').trim();
  if (!email || !fullName) return null;

  const arr = (v) => (Array.isArray(v) ? v.map(String) : []);

  return {
    full_name: fullName,
    email,
    mobile: String(body.mobile || '').trim() || null,
    agency: String(body.agency || '').trim() || null,
    years_in_service: String(body.years_in_service || body.yearsInService || '') || null,
    keyman_cases: String(body.keyman_cases || body.keymanCases || '') || null,
    confidence_level: String(body.confidence_level || body.confidenceLevel || '') || null,
    challenge_areas: arr(body.challenge_areas || body.challengeAreas),
    business_owner_network: String(body.business_owner_network || body.businessOwnerNetwork || '') || null,
    discussed_last_12_months:
      String(body.discussed_last_12_months || body.discussedLast12Months || '') || null,
    markets: arr(body.markets || body.markets),
    advanced_topics: arr(body.advanced_topics || body.advancedTopics),
    masterclass_interest: String(body.masterclass_interest || body.masterclassInterest || '') || null,
    preferred_format: String(body.preferred_format || body.preferredFormat || '') || null,
    resource_permission: body.resource_permission === true || body.resourcePermission === 'Yes' || body.resource_permission === 'Yes',
    conversation_commitment:
      String(body.conversation_commitment || body.conversationCommitment || '') || null,
  };
}
