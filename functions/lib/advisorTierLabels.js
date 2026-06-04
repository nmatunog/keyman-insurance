/**
 * Readiness survey tiers (internal keys stored in D1).
 * Public labels are advisor-centric — not sales terms like "Warm Prospect".
 */
export const READINESS_TIER_LABELS = {
  General: 'Explorer Advisor',
  Warm: 'Developing Advisor',
  MasterClass: 'Emerging Specialist',
  InnerCircle: 'GIYA Fellow Candidate',
};

/** Membership & progression labels (platform) */
export const MEMBERSHIP_ADVISOR_LABELS = {
  discover: 'GIYA Discover',
  professional: 'GIYA Professional',
  fellow: 'GIYA Fellow',
  legacyConsultant: 'Legacy Consultant',
};

export function readinessTierLabel(tier) {
  return READINESS_TIER_LABELS[tier] || READINESS_TIER_LABELS.General;
}

export function applyReadinessTierLabels(scoring) {
  const tier = scoring.tier || 'General';
  return {
    ...scoring,
    tier,
    tierLabel: readinessTierLabel(tier),
  };
}
