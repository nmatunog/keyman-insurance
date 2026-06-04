/** Personalized thank-you copy — relationship ladder (community → waitlist → course later) */
export const RESULT_STORAGE_KEY = 'giya_readiness_result';

export const SITE_LINKS = {
  joinCommunity: '/#community-signup',
  waitlist: '/#waitlist',
  masterClassLearn: '/#business-academy',
  keymanResource: '/keyman/',
  register: '/register.html',
  home: '/',
};

export const BONUS_RESOURCES = [
  {
    title: 'Keyman Discovery Framework',
    href: '/assets/bonus/keyman-discovery-framework.html',
  },
  {
    title: 'Business Insurance Conversation Guide',
    href: '/assets/bonus/business-insurance-conversation-guide.html',
  },
];

/** Public-facing advisor profile (not internal lead tier) */
export const ADVISOR_PROFILES = {
  General: {
    profileTitle: 'Emerging Business Insurance Advisor',
    stars: 2,
    headline: 'You are at the curiosity-to-engagement stage',
    summary:
      'You have taken the right first step. Your focus now is building familiarity with GIYA frameworks and steady practice conversations — not jumping to a major purchase.',
  },
  Warm: {
    profileTitle: 'Developing Business Insurance Advisor',
    stars: 3,
    headline: 'You are building meaningful readiness',
    summary:
      'Your network and interest show real potential. The next win is joining the GIYA community, using shared case studies, and staying on the learning path before any major investment.',
  },
  MasterClass: {
    profileTitle: 'Strategic Planning Advisor',
    stars: 4,
    headline: 'You are well positioned for advanced growth',
    summary:
      'Your experience aligns with advisors who benefit from community learning, Master Class previews, and structured case work — trust first, then depth.',
  },
  InnerCircle: {
    profileTitle: 'Advanced Advisor',
    stars: 5,
    headline: 'You show advanced advisory readiness',
    summary:
      'Your profile suggests you are ready for high-level conversations. We will prioritize you for community leadership, Master Class invitations, and future inner-circle opportunities.',
  },
};

export const COMMUNITY_BENEFITS = [
  'Case studies & advisor frameworks',
  'Resource updates & learning roadmaps',
  'Master Class invitations',
  'Keyman & business insurance tools',
];

export function getResultProfile(tier) {
  return ADVISOR_PROFILES[tier] || ADVISOR_PROFILES.General;
}

/** Personalized growth pillar from assessment answers */
export function getGrowthOpportunity(insights) {
  const markets = insights?.markets || [];
  const topics = insights?.advancedTopics || [];

  if (markets.includes('Medical Practices')) {
    return {
      area: 'Health Planning',
      detail: 'Your market focus suggests integrating health and protection conversations with business-owner relationships.',
    };
  }

  const estateSignals = topics.some(
    (t) =>
      t.includes('Succession') ||
      t.includes('Buy-Sell') ||
      t.includes('Estate')
  );
  const familyBiz = markets.includes('Family Businesses');

  if (estateSignals && familyBiz) {
    return {
      area: 'Estate Conservation',
      detail: 'Your interests point toward succession, family business continuity, and legacy planning alongside insurance solutions.',
    };
  }

  if (estateSignals) {
    return {
      area: 'Business Insurance & Succession',
      detail: 'Buy-sell and succession topics pair naturally with Keyman and business continuity planning.',
    };
  }

  return {
    area: 'Business Insurance',
    detail: 'Keyman, business continuity, and owner conversations are your strongest near-term growth lever.',
  };
}

/** Map 0–100+ score to display */
export function scoreToDisplay(score) {
  const clamped = Math.min(100, Math.max(0, score));
  let stars = 2;
  if (clamped >= 81) stars = 5;
  else if (clamped >= 51) stars = 4;
  else if (clamped >= 21) stars = 3;
  return { percent: clamped, stars };
}

export function saveResultPayload(payload) {
  try {
    sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function loadResultPayload() {
  try {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
