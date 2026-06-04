/**
 * Advisor Readiness Scoring Engine v1 (server mirror)
 * Keep in sync with readiness-assessment/src/services/readinessEngine.js
 */
import { readinessTierLabel } from './advisorTierLabels.js';

export const CATEGORY_WEIGHTS = {
  experience: 0.25,
  opportunity: 0.25,
  confidence: 0.2,
  interest: 0.15,
  commitment: 0.15,
};

export const ADVISOR_TYPES = [
  { min: 0, max: 39, id: 'explorer', label: 'Explorer Advisor', tier: 'General' },
  { min: 40, max: 54, id: 'developing', label: 'Developing Advisor', tier: 'Warm' },
  { min: 55, max: 69, id: 'emerging', label: 'Emerging Specialist', tier: 'MasterClass' },
  { min: 70, max: 84, id: 'advanced', label: 'Advanced Practitioner', tier: 'MasterClass' },
  { min: 85, max: 100, id: 'fellow', label: 'GIYA Fellow Candidate', tier: 'InnerCircle' },
];

const GIYA_PATH = [
  'Free Membership',
  'Business Insurance Academy',
  'Master Class',
  'Professional Certification',
];

function normDash(value) {
  return String(value || '')
    .replace(/[\u2013\u2014]/g, '-')
    .trim();
}

function lookup(map, key, fallback = 25) {
  const k = normDash(key);
  if (map[k] !== undefined) return map[k];
  return fallback;
}

function scoreExperience(data) {
  const years = lookup(
    {
      'Less than 1 Year': 15,
      '1-3 Years': 35,
      '4-7 Years': 55,
      '8-15 Years': 75,
      'More than 15 Years': 95,
    },
    data.years_in_service,
    20
  );
  const cases = lookup(
    {
      None: 8,
      '1-3': 30,
      '4-10': 55,
      '11-20': 80,
      'More than 20': 100,
    },
    data.keyman_cases,
    10
  );
  return Math.round(years * 0.45 + cases * 0.55);
}

function scoreOpportunity(data) {
  const network = lookup(
    {
      'Less than 10': 15,
      '10-25': 35,
      '26-50': 55,
      '51-100': 75,
      'More than 100': 95,
    },
    data.business_owner_network,
    20
  );
  const discussed = lookup(
    {
      0: 10,
      '1-5': 35,
      '6-10': 55,
      '11-20': 75,
      'More than 20': 95,
    },
    data.discussed_last_12_months,
    15
  );
  const markets = Array.isArray(data.markets) ? data.markets : [];
  const marketBreadth = markets.length ? Math.min(95, 38 + markets.length * 10) : 20;
  return Math.round(network * 0.45 + discussed * 0.35 + marketBreadth * 0.2);
}

function scoreConfidence(data) {
  return lookup(
    {
      Beginner: 20,
      Developing: 45,
      Confident: 70,
      Advanced: 95,
    },
    data.confidence_level,
    30
  );
}

function scoreInterest(data) {
  const topics = Array.isArray(data.advanced_topics) ? data.advanced_topics : [];
  const topicScore = Math.min(100, 22 + topics.length * 11);
  const mc = String(data.masterclass_interest || '');
  const mcScore =
    mc === 'Yes, definitely' ? 100 : mc === 'Possibly' ? 58 : mc === 'Not at this time' ? 22 : 35;
  return Math.round(topicScore * 0.55 + mcScore * 0.45);
}

function scoreCommitment(data) {
  return lookup(
    {
      '1-3': 28,
      '4-10': 58,
      '11-20': 82,
      'More than 20': 100,
    },
    data.conversation_commitment,
    25
  );
}

function weightedTotal(categories) {
  return Math.round(
    categories.experience * CATEGORY_WEIGHTS.experience +
      categories.opportunity * CATEGORY_WEIGHTS.opportunity +
      categories.confidence * CATEGORY_WEIGHTS.confidence +
      categories.interest * CATEGORY_WEIGHTS.interest +
      categories.commitment * CATEGORY_WEIGHTS.commitment
  );
}

export function resolveAdvisorType(score) {
  const clamped = Math.min(100, Math.max(0, score));
  return (
    ADVISOR_TYPES.find((t) => clamped >= t.min && clamped <= t.max) ||
    ADVISOR_TYPES[0]
  );
}

function commitmentConversationTarget(commitment) {
  const c = normDash(commitment);
  if (c === 'More than 20') return { count: 10, label: '10 Keyman conversations' };
  if (c === '11-20') return { count: 8, label: '8 Keyman conversations' };
  if (c === '4-10') return { count: 5, label: '5 Keyman conversations' };
  return { count: 3, label: '3 Keyman conversations' };
}

function confidencePhrase(level) {
  const l = String(level || '').toLowerCase();
  if (l === 'advanced') return 'strong confidence';
  if (l === 'confident') return 'solid confidence';
  if (l === 'developing') return 'moderate confidence';
  return 'building confidence';
}

function networkPhrase(network) {
  const n = normDash(network);
  if (['51-100', 'More than 100'].includes(n)) return 'a strong business-owner network';
  if (['26-50', '10-25'].includes(n)) return 'a growing business-owner network';
  return 'an expanding owner pipeline';
}

function interestPhrase(data) {
  const topics = data.advanced_topics || [];
  if (topics.some((t) => t.includes('Succession') || t.includes('Buy-Sell'))) {
    return 'high interest in advanced planning';
  }
  if (data.masterclass_interest === 'Yes, definitely') {
    return 'clear appetite for Master Class depth';
  }
  if (topics.length >= 3) return 'broad advanced-topic curiosity';
  return 'focused interest in business insurance growth';
}

function deriveStrengths(data, categories) {
  const strengths = [];
  const challenges = data.challenge_areas || [];

  if (categories.opportunity >= 55) {
    strengths.push('Strong business owner network');
  }
  if (categories.interest >= 55 || (data.advanced_topics || []).length >= 2) {
    strengths.push('Clear interest in advanced planning');
  }
  if (categories.commitment >= 55 || data.masterclass_interest === 'Yes, definitely') {
    strengths.push('High commitment to growth');
  }
  if (categories.experience >= 60) {
    strengths.push('Meaningful Keyman case experience');
  }
  if (categories.confidence >= 65) {
    strengths.push('Confident in business-owner conversations');
  }
  if (normDash(data.years_in_service) === 'More than 15 Years' || normDash(data.years_in_service) === '8-15 Years') {
    strengths.push('Solid industry tenure');
  }
  if (!challenges.includes('Finding Prospects') && categories.opportunity >= 45) {
    strengths.push('Active prospecting momentum');
  }

  const defaults = [
    'Curiosity about protecting business legacies',
    'Willingness to invest in advisor development',
  ];
  const merged = [...new Set([...strengths, ...defaults])];
  return merged.slice(0, 3);
}

function deriveGaps(data, categories) {
  const gaps = [];
  const challenges = data.challenge_areas || [];
  const cases = normDash(data.keyman_cases);

  if (cases === 'None' || cases === '1-3' || categories.experience < 45) {
    gaps.push('Low Keyman case experience');
  }
  if (
    challenges.includes('Finding Prospects') ||
    challenges.includes('Opening Conversations') ||
    categories.opportunity < 45
  ) {
    gaps.push('Prospecting consistency');
  }
  if (
    challenges.includes('Quantifying Business Risk') ||
    challenges.includes('Presenting Solutions') ||
    categories.confidence < 50
  ) {
    gaps.push('Advanced case design knowledge');
  }
  if (challenges.includes('Closing Cases')) {
    gaps.push('Case closing rhythm');
  }
  if (challenges.includes('Explaining Tax Implications')) {
    gaps.push('Tax-efficient structure fluency');
  }
  if (normDash(data.discussed_last_12_months) === '0' || normDash(data.discussed_last_12_months) === '1-5') {
    gaps.push('Owner conversation volume');
  }

  const defaults = ['Structured 30-day practice plan', 'Deeper Keyman frameworks'];
  const merged = [...new Set([...gaps, ...defaults])];
  return merged.slice(0, 3);
}

function deriveFastestWin(data, categories) {
  const target = commitmentConversationTarget(data.conversation_commitment);
  const challenges = data.challenge_areas || [];

  if (challenges.includes('Finding Prospects') || categories.opportunity < 40) {
    return {
      title: 'Your highest ROI action',
      action: `Schedule ${target.count} dedicated prospecting blocks and hold ${target.label}`,
      timeframe: 'within the next 30 days',
      detail: 'Consistency in owner outreach compounds faster than adding new products.',
    };
  }

  if (normDash(data.keyman_cases) === 'None' || categories.experience < 45) {
    return {
      title: 'Your highest ROI action',
      action: `Conduct ${target.label}`,
      timeframe: 'within the next 30 days',
      detail: 'Each conversation builds case pattern recognition and referral confidence.',
    };
  }

  return {
    title: 'Your highest ROI action',
    action: `Run ${target.label} using the Keyman Discovery Framework`,
    timeframe: 'within the next 30 days',
    detail: 'Pair each meeting with one quantified risk insight to advance case design.',
  };
}

function rankMarkets(data) {
  const markets = Array.isArray(data.markets) ? data.markets : [];
  if (!markets.length) return { market: 'SMEs', reason: 'Default focus for scalable Keyman conversations.' };

  const topics = data.advanced_topics || [];
  const scores = markets.map((market) => {
    let score = 50;
    if (market === 'Medical Practices' && topics.some((t) => t.includes('Executive') || t.includes('Keyman'))) {
      score += 25;
    }
    if (market === 'Medical Practices') score += 15;
    if (market === 'Family Businesses' && topics.some((t) => t.includes('Succession') || t.includes('Buy-Sell'))) {
      score += 22;
    }
    if (market === 'Corporate Accounts' && normDash(data.business_owner_network) === 'More than 100') {
      score += 18;
    }
    if (market === 'Construction' || market === 'Manufacturing') score += 8;
    if (data.confidence_level === 'Advanced' || data.confidence_level === 'Confident') score += 10;
    return { market, score };
  });
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  return {
    market: top.market,
    reason: `You have ${confidencePhrase(data.confidence_level)}, ${interestPhrase(data)}, and ${networkPhrase(data.business_owner_network)}.`,
  };
}

function deriveGrowthFocus(data, recommendedMarket) {
  const topics = data.advanced_topics || [];
  if (recommendedMarket.market === 'Medical Practices') {
    return {
      area: 'Medical Practice Keyman',
      detail: 'Pair owner continuity conversations with practice valuation and partner protection themes.',
    };
  }
  if (topics.some((t) => t.includes('Succession') || t.includes('Buy-Sell'))) {
    return {
      area: 'Succession & Buy-Sell',
      detail: 'Your topic choices align with continuity planning and multi-owner structures.',
    };
  }
  return {
    area: 'Business Insurance',
    detail: 'Keyman, continuity, and owner-risk conversations are your highest-leverage growth lane.',
  };
}

function buildActionPlan30(fastestWin, growthFocus) {
  return [
    fastestWin.action,
    `Document insights after each conversation in your GIYA growth focus: ${growthFocus.area}.`,
    'Review one Business Insurance case study per week in free membership.',
    'Book a Master Class preview when you complete your conversation target.',
  ];
}

function deriveEmailSequence(advisorType) {
  const base = ['Welcome + your readiness score', 'Your 30-day action checklist', 'Case study: Keyman win'];
  if (advisorType.id === 'explorer' || advisorType.id === 'developing') {
    return [...base, 'Framework: opening owner conversations', 'Invite: free advisor briefing'];
  }
  if (advisorType.id === 'emerging') {
    return [...base, 'Master Class invitation', 'Academy curriculum preview'];
  }
  return [...base, 'Elite ecosystem overview', 'Fellow pathway: contribution standards'];
}

function profileCopy(advisorType) {
  const copy = {
    explorer: {
      headline: 'You are exploring your advisory foundation',
      summary:
        'Your profile shows early-stage readiness. Lean on GIYA frameworks, free membership roadmaps, and steady owner conversations before advanced programs.',
    },
    developing: {
      headline: 'You are building meaningful client readiness',
      summary:
        'Momentum is forming across network and interest. A structured 30-day plan and community case studies will accelerate your next wins.',
    },
    emerging: {
      headline: 'You are emerging as a business insurance specialist',
      summary:
        'Your experience and appetite fit advisors ready for Master Class depth, structured cases, and academy-level design — trust first, then depth.',
    },
    advanced: {
      headline: 'You are an advanced practitioner in motion',
      summary:
        'Your weighted readiness supports advanced case work, academy enrollment, and Professional membership when you want more structure.',
    },
    fellow: {
      headline: 'You show Fellow-candidate readiness',
      summary:
        'Your profile aligns with top-tier advisors. Explore GIYA Elite when you want the full ecosystem; Fellow remains earned through contribution.',
    },
  };
  return copy[advisorType.id] || copy.explorer;
}

export function buildReadinessReport(data) {
  const categories = {
    experience: scoreExperience(data),
    opportunity: scoreOpportunity(data),
    confidence: scoreConfidence(data),
    interest: scoreInterest(data),
    commitment: scoreCommitment(data),
  };

  const score = weightedTotal(categories);
  const advisorType = resolveAdvisorType(score);
  const tier = advisorType.tier;
  const tierLabel = readinessTierLabel(tier);
  const recommendedMarket = rankMarkets(data);
  const growthFocus = deriveGrowthFocus(data, recommendedMarket);
  const strengths = deriveStrengths(data, categories);
  const gaps = deriveGaps(data, categories);
  const fastestWin = deriveFastestWin(data, categories);
  const actionPlan30 = buildActionPlan30(fastestWin, growthFocus);
  const profile = profileCopy(advisorType);

  return {
    score,
    tier,
    tierLabel,
    advisorType: advisorType.label,
    advisorTypeId: advisorType.id,
    categories,
    categoryWeights: CATEGORY_WEIGHTS,
    profileTitle: advisorType.label,
    headline: profile.headline,
    summary: profile.summary,
    strengths,
    gaps,
    fastestWin,
    recommendedMarket,
    growthFocus,
    actionPlan30,
    recommendedAcademy: 'Business Insurance Academy',
    recommendedPath: GIYA_PATH,
    emailSequence: deriveEmailSequence(advisorType),
  };
}

export function calculateLeadScore(data) {
  const report = buildReadinessReport(data);
  return {
    score: report.score,
    tier: report.tier,
    tierLabel: report.advisorType,
    report,
  };
}
