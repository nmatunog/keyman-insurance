import { calculateLeadScore } from './scoreCalculator';
import { getSupabase, isSupabaseConfigured } from './supabase';

const API_SUBMIT = '/api/assessments/submit';
const API_SEND_RESOURCES = '/api/assessments/send-resources';

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

function apiPayload(formData, scoring) {
  return {
    ...formData,
    resource_permission: formData.resource_permission === 'Yes',
    lead_score: scoring.score,
    lead_tier: scoring.tier,
    lead_tier_label: scoring.tierLabel,
  };
}

async function saveToGiyaApi(formData, scoring) {
  const res = await fetch(API_SUBMIT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload(formData, scoring)),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Unable to save assessment. Please try again.');
  }
  return data;
}

/** Retry bonus-email delivery when full submit did not run (e.g. static local server). */
async function sendBonusEmail(formData, scoring) {
  const res = await fetch(API_SEND_RESOURCES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload(formData, scoring)),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    return { email_sent: false, email_reason: data.error || 'email_api_unavailable' };
  }
  return {
    email_sent: Boolean(data.email_sent),
    email_reason: data.email_reason || null,
  };
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
      emailSent: Boolean(data.email_sent),
      emailReason: data.email_reason || null,
    };
  } catch (giyaErr) {
    const email = await sendBonusEmail(formData, scoring);
    if (channels.includes('supabase') || email.email_sent) {
      return {
        ok: true,
        scoring,
        channel: channels.includes('supabase') ? 'supabase+email_retry' : 'email_retry',
        emailSent: email.email_sent,
        emailReason: email.email_reason,
        giyaError: giyaErr.message,
      };
    }
    if (channels.includes('supabase')) {
      return {
        ok: true,
        scoring,
        channel: 'supabase',
        emailSent: false,
        emailReason: email.email_reason || giyaErr.message,
      };
    }
    throw giyaErr;
  }
}
