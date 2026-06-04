/** Personalized thank-you copy — relationship ladder (community → waitlist → course later) */
import { readinessTierLabel } from './advisorTiers';

export const RESULT_STORAGE_KEY = 'giya_readiness_result';

export const SITE_LINKS = {
  keymanResource: '/keyman/',
  assessment: '/readiness/assessment',
  joinCommunity: '/#community-signup',
  nurture: '/#platform',
  professionalPlans: '/#giya-plans',
  masterClassLearn: '/',
  waitlist: '/#waitlist',
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

/** Thank-you profiles keyed by internal tier (General / Warm / MasterClass / InnerCircle) */
export const ADVISOR_PROFILES = {
  General: {
    profileTitle: 'Emerging Advisor',
    stars: 2,
    headline: 'You are building your advisory foundation',
    summary:
      'You are at the curiosity-to-engagement stage. Focus on GIYA frameworks, steady owner conversations, and free community learning — not a major purchase yet.',
  },
  Warm: {
    profileTitle: 'Developing Advisor',
    stars: 3,
    headline: 'You are growing meaningful client readiness',
    summary:
      'Your network and interest show real potential. Join the GIYA community, use shared case studies, and stay on the learning path before advanced programs.',
  },
  MasterClass: {
    profileTitle: 'Strategic Advisor',
    stars: 4,
    headline: 'You are well positioned for advanced case work',
    summary:
      'Your experience fits advisors who benefit from Master Class previews, structured cases, and deeper business-insurance design — trust first, then depth.',
  },
  InnerCircle: {
    profileTitle: 'Strategic Advisor',
    stars: 5,
    headline: 'You show advanced advisory readiness',
    summary:
      'Your profile aligns with our highest-readiness advisors. When you are ready, explore GIYA Elite membership (₱2,999/mo) for the full ecosystem — all Academies and coaching. GIYA Fellow is earned through contribution.',
  },
};

export const GROWTH_ROADMAP_BENEFITS = [
  'Personalized Learning Path',
  'Business Insurance Frameworks',
  'Case Studies',
  'Monthly Advisor Briefings',
  'Master Class Invitations',
];

/** @deprecated use GROWTH_ROADMAP_BENEFITS */
export const COMMUNITY_BENEFITS = GROWTH_ROADMAP_BENEFITS;

export function getResultProfile(tier, report) {
  if (report?.profileTitle) {
    return {
      profileTitle: report.profileTitle,
      headline: report.headline,
      summary: report.summary,
      stars: scoreToDisplay(report.score).stars,
    };
  }
  const base = ADVISOR_PROFILES[tier] || ADVISOR_PROFILES.General;
  return {
    ...base,
    profileTitle: readinessTierLabel(tier),
  };
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

/** User-facing copy for post-assessment email status (hide infra errors). */
export function emailDeliveryMessage(emailSent, emailReason) {
  if (emailSent === true) {
    return {
      tone: 'ok',
      text: 'We sent these two guides to your inbox. Check spam or promotions if you do not see them within a few minutes.',
    };
  }
  if (emailSent === false && emailReason === 'resend_domain_pending') {
    return {
      tone: 'warn',
      text: 'Your guides are ready above. GIYA is enabling email to all advisor addresses — our team may forward your copies shortly. Save the links now.',
    };
  }
  if (emailSent === false) {
    return {
      tone: 'warn',
      text: 'Your guides are always available using the links above. If you expected an email, check spam or try again later.',
    };
  }
  return {
    tone: 'ok',
    text: 'If you opted in to email updates, your two guides are on the way. Check spam if needed.',
  };
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
