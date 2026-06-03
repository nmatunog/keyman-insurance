/** Personalized thank-you copy and CTAs by lead tier */
export const RESULT_STORAGE_KEY = 'giya_readiness_result';

export const SITE_LINKS = {
  waitlist: '/#waitlist',
  academyPricing: '/#academy-pricing',
  businessAcademy: '/#business-academy',
  enrollBi: '/account.html#business_insurance',
  register: '/register.html',
  home: '/',
};

export const RESULT_PROFILES = {
  General: {
    readinessLabel: 'Foundation Builder',
    stars: 2,
    headline: 'You are building your Business Insurance foundation',
    summary:
      'Your profile shows early-stage readiness. Focus on discovery conversations and foundational Keyman concepts before advanced case design.',
    nextStep:
      'Start with GIYA Discover resources, then explore the Business Insurance Academy when you are ready to go deeper.',
    primaryCta: { label: 'Join the Master Class waitlist', href: SITE_LINKS.waitlist, icon: 'waitlist' },
    secondaryCta: { label: 'View Business Insurance Academy', href: SITE_LINKS.academyPricing, icon: 'academy' },
  },
  Warm: {
    readinessLabel: 'Developing Advisor',
    stars: 3,
    headline: 'You are developing solid Business Insurance readiness',
    summary:
      'You have meaningful opportunity in your network and growing interest in advanced topics. Structured training will accelerate your confidence and case flow.',
    nextStep:
      'Reserve your spot on the Master Class waiting list and review Academy enrollment to unlock tools and curriculum.',
    primaryCta: { label: 'Reserve my Master Class spot', href: SITE_LINKS.waitlist, icon: 'waitlist' },
    secondaryCta: { label: 'Enroll in BI Academy (₱7,990)', href: SITE_LINKS.enrollBi, icon: 'enroll' },
  },
  MasterClass: {
    readinessLabel: 'Master Class Candidate',
    stars: 4,
    headline: 'You are a strong candidate for advanced training',
    summary:
      'Your experience, network, and interest align with advisors who benefit most from small-group Master Class work on Keyman, buy-sell, and succession design.',
    nextStep:
      'Join the waiting list for priority invitations, or enroll now in the Business Insurance Academy to begin immediately.',
    primaryCta: { label: 'Join Master Class waiting list', href: SITE_LINKS.waitlist, icon: 'waitlist' },
    secondaryCta: { label: 'Enroll in BI Academy now', href: SITE_LINKS.enrollBi, icon: 'enroll' },
  },
  InnerCircle: {
    readinessLabel: 'Advanced / Inner Circle',
    stars: 5,
    headline: 'You show advanced readiness for high-level case work',
    summary:
      'Your profile suggests you are prepared for MDRT-level business insurance conversations, coaching, and inner-circle advanced case labs.',
    nextStep:
      'We will prioritize you for Master Class and coaching invitations. Enroll in the Academy or Elite membership to unlock full platform access today.',
    primaryCta: { label: 'Priority waitlist — reserve now', href: SITE_LINKS.waitlist, icon: 'waitlist' },
    secondaryCta: { label: 'Go to enrollment & billing', href: SITE_LINKS.enrollBi, icon: 'enroll' },
  },
};

export function getResultProfile(tier) {
  return RESULT_PROFILES[tier] || RESULT_PROFILES.General;
}

/** Map 0–100+ score to a 0–100 display and star count */
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
