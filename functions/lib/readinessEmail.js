const TIER_LABELS = {
  General: 'Foundation Builder',
  Warm: 'Developing Advisor',
  MasterClass: 'Master Class Candidate',
  InnerCircle: 'Advanced / Inner Circle',
};

function siteUrl(env) {
  return String(env.GIYA_SITE_URL || 'https://joingiya.com').replace(/\/$/, '');
}

function bonusLinks(env) {
  const base = siteUrl(env);
  return {
    discovery: `${base}/assets/bonus/keyman-discovery-framework.html`,
    conversation: `${base}/assets/bonus/business-insurance-conversation-guide.html`,
    readiness: `${base}/readiness/`,
    academy: `${base}/#academy-pricing`,
    waitlist: `${base}/#waitlist`,
    enroll: `${base}/account.html#business_insurance`,
  };
}

function buildReadinessEmail(lead, scoring, env) {
  const links = bonusLinks(env);
  const first = lead.full_name?.split(/\s+/)[0] || 'Advisor';
  const tierLabel = scoring.tierLabel || TIER_LABELS[scoring.tier] || scoring.tier;
  const score = scoring.score ?? lead.lead_score ?? 0;
  const subject = `Your GIYA Keyman Readiness results + bonus resources`;

  const text = `Hi ${first},

Thank you for completing the GIYA Keyman Readiness Assessment.

Your readiness profile: ${tierLabel} (score ${score}/100).

Your complimentary resources:

1. Keyman Discovery Framework
   ${links.discovery}

2. Business Insurance Conversation Guide
   ${links.conversation}

Recommended next steps:
- Business Insurance Academy: ${links.enroll}
- Master Class waiting list: ${links.waitlist}

Save the Business. Protect the Family. Preserve the Legacy.

Nilo B. Matunog, PFA · RFP
GIYA — Guiding Advisors. Protecting Legacies.
${siteUrl(env)}`;

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#141416;max-width:560px;margin:0 auto;padding:24px">
  <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8A7340;margin:0 0 8px">GIYA Discover</p>
  <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:#0A0A0B">Your Keyman Readiness results</h1>
  <p>Hi ${escapeHtml(first)},</p>
  <p>Thank you for completing the <strong>Keyman Readiness Assessment</strong>.</p>
  <p style="background:#F5F3EE;border-left:4px solid #C4A052;padding:12px 16px;border-radius:8px">
    <strong>${escapeHtml(tierLabel)}</strong><br>
    Readiness score: <strong>${score}</strong> / 100
  </p>
  <h2 style="font-size:16px;color:#0A0A0B;margin-top:24px">Your bonus resources</h2>
  <ul style="padding-left:20px">
    <li style="margin-bottom:8px"><a href="${links.discovery}" style="color:#8A7340;font-weight:600">Keyman Discovery Framework</a></li>
    <li style="margin-bottom:8px"><a href="${links.conversation}" style="color:#8A7340;font-weight:600">Business Insurance Conversation Guide</a></li>
  </ul>
  <h2 style="font-size:16px;color:#0A0A0B">Move forward</h2>
  <p>
    <a href="${links.enroll}" style="display:inline-block;background:#0A0A0B;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600;font-size:14px;margin-right:8px">Enroll in BI Academy</a>
    <a href="${links.waitlist}" style="display:inline-block;border:2px solid #C4A052;color:#8A7340;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:600;font-size:14px">Master Class waitlist</a>
  </p>
  <p style="font-style:italic;color:#8A7340;margin-top:28px">Save the Business. Protect the Family. Preserve the Legacy.</p>
  <p style="font-size:13px;color:#6B7280">Nilo B. Matunog, PFA · RFP<br>
  <a href="${siteUrl(env)}" style="color:#8A7340">joingiya.com</a></p>
</body></html>`;

  return { subject, text, html, links };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendViaResend(env, to, payload) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY not configured' };

  const from = env.GIYA_EMAIL_FROM || 'GIYA <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: env.GIYA_ADMIN_EMAIL || undefined,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { sent: false, reason: data.message || `Resend HTTP ${res.status}` };
  }
  return { sent: true, provider: 'resend', id: data.id };
}

async function sendViaCloudflareEmail(env, to, payload) {
  if (!env.EMAIL?.send) return { sent: false, reason: 'EMAIL binding not configured' };

  const fromEmail = env.GIYA_EMAIL_FROM_ADDRESS || 'hello@joingiya.com';
  const fromName = env.GIYA_EMAIL_FROM_NAME || 'GIYA';

  try {
    const response = await env.EMAIL.send({
      to,
      from: { email: fromEmail, name: fromName },
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: env.GIYA_ADMIN_EMAIL || undefined,
    });
    return { sent: true, provider: 'cloudflare', id: response?.messageId };
  } catch (e) {
    return { sent: false, reason: e.message || 'Cloudflare Email send failed' };
  }
}

/**
 * Send post-assessment follow-up with bonus resource links. Never throws.
 */
export async function sendReadinessFollowUpEmail(env, lead, scoring) {
  if (!lead?.email) return { sent: false, reason: 'no email' };
  if (lead.resource_permission === false) {
    return { sent: false, reason: 'user opted out of resources' };
  }

  const payload = buildReadinessEmail(lead, scoring, env);

  let result = await sendViaResend(env, lead.email, payload);
  if (!result.sent) {
    result = await sendViaCloudflareEmail(env, lead.email, payload);
  }

  return result;
}

export { buildReadinessEmail, bonusLinks };
