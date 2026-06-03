/** @typedef {Record<string, unknown>} AssessmentPayload */

/** Normalize en-dash/em-dash ranges for scoring comparisons */
export function normDash(value) {
  return String(value || '')
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
}

/**
 * Hidden lead scoring for Keyman Readiness Assessment.
 * Tiers: General (0–20), Warm (21–50), MasterClass (51–80), InnerCircle (81+)
 */
export function calculateLeadScore(data) {
  let score = 0;

  const network = normDash(data.business_owner_network);
  if (['26-50', '51-100', 'More than 100'].includes(network)) score += 10;
  if (['51-100', 'More than 100'].includes(network)) score += 5;
  if (network === 'More than 100') score += 5;

  const discussed = normDash(data.discussed_last_12_months);
  if (['11-20', 'More than 20'].includes(discussed)) score += 5;
  if (discussed === 'More than 20') score += 5;

  if (String(data.masterclass_interest || '') === 'Yes, definitely') score += 20;

  const topics = Array.isArray(data.advanced_topics) ? data.advanced_topics : [];
  if (topics.includes('Buy-Sell Agreements')) score += 10;
  if (topics.includes('Business Succession Planning')) score += 10;
  if (topics.includes('Advanced Keyman Planning')) score += 5;

  const keyman = String(data.keyman_cases || '');
  if (keyman && keyman !== 'None') score += 10;

  const commit = normDash(data.conversation_commitment);
  if (['4-10', '11-20', 'More than 20'].includes(commit)) score += 10;
  if (['11-20', 'More than 20'].includes(commit)) score += 5;
  if (commit === 'More than 20') score += 5;

  let tier = 'General';
  let tierLabel = 'General Follow-Up';
  if (score >= 81) {
    tier = 'InnerCircle';
    tierLabel = 'Potential Inner Circle / Coaching Candidate';
  } else if (score >= 51) {
    tier = 'MasterClass';
    tierLabel = 'Master Class Candidate';
  } else if (score >= 21) {
    tier = 'Warm';
    tierLabel = 'Warm Prospect';
  }

  return { score, tier, tierLabel };
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
