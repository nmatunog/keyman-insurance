import { calculateLeadScore } from './scoreCalculator';
import { getSupabase, isSupabaseConfigured } from './supabase';

const API_SUBMIT = '/api/assessments/submit';

function toRow(formData, scoring) {
  return {
    full_name: formData.full_name.trim(),
    email: formData.email.trim().toLowerCase(),
    mobile: formData.mobile?.trim() || null,
    agency: formData.agency?.trim() || null,
    years_in_service: formData.years_in_service || null,
    keyman_cases: formData.keyman_cases || null,
    confidence_level: formData.confidence_level || null,
    challenge_areas: formData.challenge_areas || [],
    business_owner_network: formData.business_owner_network || null,
    discussed_last_12_months: formData.discussed_last_12_months || null,
    markets: formData.markets || [],
    advanced_topics: formData.advanced_topics || [],
    masterclass_interest: formData.masterclass_interest || null,
    preferred_format: formData.preferred_format || null,
    resource_permission: formData.resource_permission === 'Yes' || formData.resource_permission === true,
    conversation_commitment: formData.conversation_commitment || null,
    lead_score: scoring.score,
    lead_tier: scoring.tier,
    source: 'keyman_readiness',
  };
}

async function saveToSupabase(row) {
  const supabase = getSupabase();
  const { error } = await supabase.from('assessments').insert(row);
  if (error) throw error;
}

async function saveToGiyaApi(formData, scoring) {
  const res = await fetch(API_SUBMIT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      resource_permission: formData.resource_permission === 'Yes',
      lead_score: scoring.score,
      lead_tier: scoring.tier,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Unable to save assessment. Please try again.');
  }
  return data;
}

export async function submitAssessment(formData) {
  const scoring = calculateLeadScore(formData);
  const row = toRow(formData, scoring);
  const channels = [];

  if (isSupabaseConfigured()) {
    try {
      await saveToSupabase(row);
      channels.push('supabase');
    } catch (err) {
      console.warn('Supabase insert failed:', err?.message || err);
    }
  }

  try {
    const data = await saveToGiyaApi(formData, scoring);
    channels.push('giya');
    return {
      ok: true,
      scoring: {
        score: data.lead_score ?? scoring.score,
        tier: data.lead_tier ?? scoring.tier,
        tierLabel: data.lead_tier_label ?? scoring.tierLabel,
      },
      channel: channels.join('+') || 'giya',
    };
  } catch (giyaErr) {
    if (channels.includes('supabase')) {
      return { ok: true, scoring, channel: 'supabase' };
    }
    throw giyaErr;
  }
}
