function siteUrl(env) {
  return String(env.GIYA_SITE_URL || 'https://joingiya.com').replace(/\/$/, '');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const DESIGNATION_LABELS = {
  agency_director: 'Agency Director / Manager',
  unit_manager: 'Unit Manager / Branch Head',
  training_head: 'Training & Development Head',
  facilitator: 'Rookie Facilitator / Sales Coach',
  experienced_mentor: 'Experienced Mentor / Leader',
};

const TIMELINE_LABELS = {
  asap: 'Immediate / Next Quarter',
  within_3_months: 'Within 3 Months',
  later_this_year: 'Later this Year',
  exploratory: 'Exploratory / Planning Phase',
};

export function spikeDesignationLabel(key) {
  return DESIGNATION_LABELS[key] || key || '—';
}

export function spikeTimelineLabel(key) {
  return TIMELINE_LABELS[key] || key || '—';
}

async function sendViaResend(env, to, payload) {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY not configured' };

  const from = env.GIYA_EMAIL_FROM || 'Nilo Matunog <hello@joingiya.com>';
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
    return { sent: false, reason: data.message || data.error || `Resend HTTP ${res.status}` };
  }
  return { sent: true, id: data.id };
}

export async function sendSpikeWorkshopInquiryEmails(env, inquiry) {
  const base = siteUrl(env);
  const first = inquiry.full_name?.split(/\s+/)[0] || 'there';
  const designation = spikeDesignationLabel(inquiry.designation);
  const timeline = spikeTimelineLabel(inquiry.impl_timeline);

  const confirmSubject = 'GIYA SPIKE Mentor Workshop — we received your request';
  const confirmText = `Hi ${first},

Thank you for requesting a SPIKE Mentor Development Workshop implementation briefing for ${inquiry.agency_name}.

We received your details and will contact you at ${inquiry.email} or ${inquiry.mobile} to discuss scheduling, cohort size, and agency integration.

Workshop page: ${base}/spike/mentor-workshop/

Nilo B. Matunog
GIYA Institute — Guiding Advisors. Protecting Legacies.
${base}`;

  const confirmHtml = `<!DOCTYPE html><html><body style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#141416;max-width:560px;margin:0 auto;padding:24px">
  <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#173A67;margin:0 0 8px">GIYA Institute · SPIKE</p>
  <h1 style="font-size:22px;margin:0 0 16px;color:#0A0A0B">Implementation request received</h1>
  <p>Hi ${escapeHtml(first)},</p>
  <p>Thank you for requesting a <strong>SPIKE Mentor Development Workshop</strong> briefing for <strong>${escapeHtml(inquiry.agency_name)}</strong>.</p>
  <p>We will contact you at <strong>${escapeHtml(inquiry.email)}</strong> or <strong>${escapeHtml(inquiry.mobile)}</strong> to discuss next steps.</p>
  <p style="margin:24px 0"><a href="${base}/spike/mentor-workshop/" style="display:inline-block;background:#173A67;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">View workshop overview</a></p>
  <p style="font-size:13px;color:#6B7280">Nilo B. Matunog · GIYA Institute<br><a href="${base}" style="color:#173A67">joingiya.com</a></p>
</body></html>`;

  const submitterResult = await sendViaResend(env, inquiry.email, {
    subject: confirmSubject,
    text: confirmText,
    html: confirmHtml,
  });

  const admin = env.GIYA_ADMIN_EMAIL;
  let adminResult = { sent: false, reason: 'GIYA_ADMIN_EMAIL not set' };
  if (admin) {
    const adminSubject = `[GIYA SPIKE] Workshop inquiry — ${inquiry.agency_name}`;
    const adminText = `New SPIKE Mentor Workshop implementation request

Name: ${inquiry.full_name}
Role: ${designation}
Agency: ${inquiry.agency_name}
Email: ${inquiry.email}
Mobile: ${inquiry.mobile}
City: ${inquiry.city || '—'}
Est. rookies: ${inquiry.est_rookies ?? '—'}
Est. mentors: ${inquiry.est_mentors ?? '—'}
Timeline: ${timeline}
Notes: ${inquiry.notes || '—'}

Admin: ${base}/admin/`;

    adminResult = await sendViaResend(env, admin, {
      subject: adminSubject,
      text: adminText,
      html: `<pre style="font-family:monospace;font-size:13px">${escapeHtml(adminText)}</pre>`,
    });
  }

  return { submitter: submitterResult, admin: adminResult };
}
