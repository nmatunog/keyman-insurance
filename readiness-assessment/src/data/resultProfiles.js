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
    congratulatory:
      'Congratulations — your assessment shows you are well positioned to move forward now. Enrolling in the GIYA Business Insurance Academy is the clearest next step to turn readiness into consistent cases and client conversations.',
    nextStep:
      'Start with the Academy for curriculum, tools, and case frameworks — then join the Master Class waitlist for advanced live sessions.',
    primaryCta: { label: 'Enroll in Business Insurance Academy', href: SITE_LINKS.enrollBi, icon: 'enroll' },
    secondaryCta: { label: 'Join Master Class waitlist', href: SITE_LINKS.waitlist, icon: 'waitlist' },
  },
  MasterClass: {
    readinessLabel: 'Master Class Candidate',
    stars: 4,
    headline: 'You are a strong candidate for advanced training',
    summary:
      'Your experience, network, and interest align with advisors who benefit most from small-group Master Class work on Keyman, buy-sell, and succession design.',
    congratulatory:
      'Congratulations — you are among the advisors best positioned to advance right now. The Business Insurance Academy gives you the structured path to master Keyman, buy-sell, and succession cases while you wait for Master Class invitations.',
    nextStep:
      'Enroll in the Academy today to begin immediately; your waitlist spot keeps you in line for small-group advanced labs.',
    primaryCta: { label: 'Enroll in BI Academy now — ₱7,990', href: SITE_LINKS.enrollBi, icon: 'enroll' },
    secondaryCta: { label: 'Reserve Master Class waitlist spot', href: SITE_LINKS.waitlist, icon: 'waitlist' },
  },
  InnerCircle: {
    readinessLabel: 'Advanced / Inner Circle',
    stars: 5,
    headline: 'You show advanced readiness for high-level case work',
    summary:
      'Your profile suggests you are prepared for MDRT-level business insurance conversations, coaching, and inner-circle advanced case labs.',
    congratulatory:
      'Congratulations — your results place you in our top readiness tier. You are best positioned to move forward by enrolling in the Business Insurance Academy now and unlocking the full GIYA toolkit while we prioritize you for coaching and inner-circle invitations.',
    nextStep:
      'Complete Academy enrollment to access curriculum and calculators today; Elite membership includes all Academies if you want the full ecosystem.',
    primaryCta: { label: 'Enroll in Business Insurance Academy', href: SITE_LINKS.enrollBi, icon: 'enroll' },
    secondaryCta: { label: 'View Elite & Academy pricing', href: SITE_LINKS.academyPricing, icon: 'academy' },
  },
};

/** Tiers that receive the BI enrollment congratulations block */
export const BI_READY_TIERS = new Set(['Warm', 'MasterClass', 'InnerCircle']);

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
