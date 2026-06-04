/** Public advisor labels for readiness survey (mirrors functions/lib/advisorTierLabels.js) */
export const READINESS_TIER_LABELS = {
  General: 'Explorer Advisor',
  Warm: 'Developing Advisor',
  MasterClass: 'Emerging Specialist',
  InnerCircle: 'GIYA Fellow Candidate',
};

export function readinessTierLabel(tier) {
  return READINESS_TIER_LABELS[tier] || READINESS_TIER_LABELS.General;
}

/** Platform membership progression (beyond the survey) */
export const MEMBERSHIP_LABELS = {
  discover: 'GIYA Discover',
  professional: 'GIYA Professional',
  legacyConsultant: 'Legacy Consultant',
  fellow: 'GIYA Fellow',
};
