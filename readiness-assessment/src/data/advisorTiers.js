/** Public advisor labels for readiness survey (mirrors functions/lib/advisorTierLabels.js) */
export const READINESS_TIER_LABELS = {
  General: 'Emerging Advisor',
  Warm: 'Developing Advisor',
  MasterClass: 'Strategic Advisor',
  InnerCircle: 'Strategic Advisor',
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
