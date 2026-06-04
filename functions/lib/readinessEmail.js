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
    join: `${base}/#community-signup`,
    keyman: `${base}/keyman/`,
    waitlist: `${base}/#waitlist`,
    masterClass: `${base}/#business-academy`,
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

Your next step (free):
Join the GIYA community: ${links.join}

Explore the Keyman Resource Center: ${links.keyman}

Interested in advanced learning later?
Master Class waitlist (no purchase today): ${links.waitlist}

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
  <h2 style="font-size:16px;color:#0A0A0B;margin-top:24px">Your two complimentary guides</h2>
  <p style="font-size:14px;color:#374151;margin:0 0 12px">Delivered because you completed the assessment:</p>
  <ul style="padding-left:20px">
    <li style="margin-bottom:8px"><a href="${links.discovery}" style="color:#8A7340;font-weight:600">Keyman Discovery Framework</a></li>
    <li style="margin-bottom:8px"><a href="${links.conversation}" style="color:#8A7340;font-weight:600">Business Insurance Conversation Guide</a></li>
  </ul>
  ${lead.resource_permission === false ? '<p style="font-size:13px;color:#6B7280">You opted out of future GIYA updates; these two guides are still yours to keep.</p>' : ''}
  <h2 style="font-size:16px;color:#0A0A0B;margin-top:24px">Your next step — join free</h2>
  <p style="font-size:14px;color:#374151">Case studies, frameworks, resource updates, and Master Class invitations.</p>
  <p style="margin:20px 0">
    <a href="${links.join}" style="display:inline-block;background:#C4A052;color:#0A0A0B;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700;font-size:15px">Join GIYA</a>
  </p>
  <p style="font-size:13px;color:#6B7280;margin-top:24px">Interested in advanced learning? <a href="${links.masterClass}" style="color:#8A7340">Learn about the Master Class</a> · <a href="${links.waitlist}" style="color:#8A7340">Priority waitlist</a> (launching soon).</p>
  <p style="font-size:13px;color:#6B7280">Then explore GIYA as a <strong>free member</strong>: <a href="${links.join}" style="color:#8A7340">Join the community</a> (case studies, frameworks, and learning roadmaps).</p>
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

const RESEND_SANDBOX_FROM = 'GIYA <onboarding@resend.dev>';

function isResendSandboxLimit(reason) {
  const r = String(reason || '').toLowerCase();
  return (
    r.includes('only send') ||
    r.includes('testing emails') ||
    r.includes('verify a domain') ||
    r.includes('not authorized to send')
  );
}

async function sendViaResend(env, to, payload, options = {}) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY not configured', provider: 'resend' };

  const from = options.from || env.GIYA_EMAIL_FROM || RESEND_SANDBOX_FROM;
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
    const reason = data.message || data.error || `Resend HTTP ${res.status}`;
    return { sent: false, reason, provider: 'resend', status: res.status };
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

async function notifyAdminFailedAdvisorEmail(env, lead, scoring, failReason) {
  const admin = env.GIYA_ADMIN_EMAIL;
  if (!admin || !env.RESEND_API_KEY) return { sent: false };

  const links = bonusLinks(env);
  const first = lead.full_name?.split(/\s+/)[0] || 'Advisor';
  const subject = `[GIYA] Forward assessment guides to ${lead.email}`;
  const text = `An advisor completed the Keyman Readiness Assessment but automatic email to them failed.

Advisor: ${lead.full_name}
Email: ${lead.email}
Score: ${scoring.score ?? lead.lead_score ?? '—'}/100
Tier: ${scoring.tier ?? lead.lead_tier ?? '—'}

Failure: ${failReason}

Please forward these links:
1. Keyman Discovery Framework — ${links.discovery}
2. Business Insurance Conversation Guide — ${links.conversation}

Until joingiya.com is verified in Resend, only the Resend account owner inbox receives automated mail.`;

  const html = `<p>An advisor completed the assessment but did not receive the automated email.</p>
<ul><li><strong>${escapeHtml(lead.full_name)}</strong> · <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></li>
<li>Score: ${scoring.score ?? '—'}/100 · ${escapeHtml(scoring.tier || '')}</li></ul>
<p style="color:#6B7280;font-size:13px">${escapeHtml(failReason)}</p>
<p><a href="${links.discovery}">Keyman Discovery Framework</a><br>
<a href="${links.conversation}">Business Insurance Conversation Guide</a></p>`;

  return sendViaResend(env, admin, { subject, text, html }, { from: RESEND_SANDBOX_FROM });
}

/**
 * Send post-assessment follow-up with bonus resource links. Never throws.
 */
export async function sendReadinessFollowUpEmail(env, lead, scoring) {
  if (!lead?.email) return { sent: false, reason: 'no email' };

  const payload = buildReadinessEmail(lead, scoring, env);

  let resendResult = await sendViaResend(env, lead.email, payload);
  if (
    !resendResult.sent &&
    env.GIYA_EMAIL_FROM &&
    !String(env.GIYA_EMAIL_FROM).includes('resend.dev')
  ) {
    resendResult = await sendViaResend(env, lead.email, payload, { from: RESEND_SANDBOX_FROM });
  }

  if (resendResult.sent) {
    return { sent: true, provider: 'resend', id: resendResult.id };
  }

  let cfResult = { sent: false, reason: 'EMAIL binding not configured', provider: 'cloudflare' };
  if (!isResendSandboxLimit(resendResult.reason)) {
    cfResult = await sendViaCloudflareEmail(env, lead.email, payload);
    if (cfResult.sent) return cfResult;
  }

  const primaryReason = resendResult.reason || cfResult.reason;
  const adminNotify = await notifyAdminFailedAdvisorEmail(env, lead, scoring, primaryReason);

  if (isResendSandboxLimit(primaryReason)) {
    return {
      sent: false,
      reason: 'resend_domain_pending',
      detail: primaryReason,
      admin_notified: Boolean(adminNotify.sent),
    };
  }

  return {
    sent: false,
    reason: primaryReason,
    detail: cfResult.reason !== primaryReason ? cfResult.reason : undefined,
    admin_notified: Boolean(adminNotify.sent),
  };
}

export { buildReadinessEmail, bonusLinks };
