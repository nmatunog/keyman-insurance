/** Client-side mirror of functions/lib/leadScore.js */
function normDash(value) {
  return String(value || '')
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
}

export function calculateLeadScore(data) {
  let score = 0;

  const network = normDash(data.business_owner_network);
  if (['26-50', '51-100', 'More than 100'].includes(network)) score += 10;
  if (['51-100', 'More than 100'].includes(network)) score += 5;
  if (network === 'More than 100') score += 5;

  const discussed = normDash(data.discussed_last_12_months);
  if (['11-20', 'More than 20'].includes(discussed)) score += 5;
  if (discussed === 'More than 20') score += 5;

  if (data.masterclass_interest === 'Yes, definitely') score += 20;

  const topics = data.advanced_topics || [];
  if (topics.includes('Buy-Sell Agreements')) score += 10;
  if (topics.includes('Business Succession Planning')) score += 10;
  if (topics.includes('Advanced Keyman Planning')) score += 5;

  if (data.keyman_cases && data.keyman_cases !== 'None') score += 10;

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
