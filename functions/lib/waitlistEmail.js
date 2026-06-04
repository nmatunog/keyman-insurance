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
  if (!res.ok) return { sent: false, reason: data.message || `Resend HTTP ${res.status}` };
  return { sent: true, id: data.id };
}

function buildWaitlistConfirmationEmail(listType, env) {
  const base = siteUrl(env);
  const exploreUrl = `${base}/?welcome=1`;
  const registerUrl = `${base}/register.html?source=community`;

  if (listType === 'masterclass') {
    const subject = 'You are on the GIYA Master Class priority waitlist';
    const text = `Thank you for reserving your spot on the GIYA Master Class priority waitlist.

What happens next:
1. We saved your email — no payment required today.
2. Explore GIYA resources while you wait: ${exploreUrl}
3. We will email you before the Master Class opens with launch details.

You do not need an account for the waitlist. If you want calculators and saved progress later, you may create a free Discover account: ${registerUrl}

GIYA — Guiding Advisors. Protecting Legacies.
${base}`;

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#141416;max-width:560px;margin:0 auto;padding:24px">
<p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8A7340">GIYA · Confirmed</p>
<h1 style="font-size:22px;color:#0A0A0B">You are on the priority waitlist</h1>
<p>Thank you. Your spot for the <strong>Business Insurance Master Class</strong> is reserved. There is nothing to pay today.</p>
<ol style="padding-left:20px;color:#374151">
<li>We saved your email on the waitlist.</li>
<li><a href="${exploreUrl}" style="color:#8A7340;font-weight:600">Explore GIYA</a> — assessment, Keyman tools, and frameworks.</li>
<li>We will email you before launch with your invitation.</li>
</ol>
<p style="margin:24px 0"><a href="${exploreUrl}" style="display:inline-block;background:#C4A052;color:#0A0A0B;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700">Start exploring</a></p>
<p style="font-size:13px;color:#6B7280">No login required for the waitlist. Optional free account: <a href="${registerUrl}" style="color:#8A7340">register</a></p>
</body></html>`;

    return { subject, text, html };
  }

  const subject = 'Welcome to GIYA — free community access confirmed';
  const text = `Thank you for joining the GIYA community list (free membership — Step 4).

Your journey:
1. Keyman Resource Center: ${base}/keyman/
2. Advisor Readiness Assessment: ${base}/readiness/
3. Personalized result after assessment
4. Free membership — confirmed (this email)
5. Nurture — frameworks and updates by email
6–8. Professional, Academies, GIYA Elite — only when you choose

Explore now: ${exploreUrl}
Optional account: ${registerUrl}

We will not ask you to purchase anything to start exploring.

GIYA — Guiding Advisors. Protecting Legacies.
${base}`;

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,system-ui,sans-serif;line-height:1.6;color:#141416;max-width:560px;margin:0 auto;padding:24px">
<p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8A7340">GIYA · Confirmed</p>
<h1 style="font-size:22px;color:#0A0A0B">Welcome to the GIYA community</h1>
<p>Your <strong>free membership</strong> request is confirmed. You are on our community list for case studies, frameworks, and updates.</p>
<ol style="padding-left:20px;color:#374151">
<li><a href="${base}/keyman/" style="color:#8A7340;font-weight:600">Keyman Resource Center</a></li>
<li><a href="${base}/readiness/" style="color:#8A7340;font-weight:600">Advisor Readiness Assessment</a> (~3 min)</li>
<li>Free membership confirmed — nurture emails follow</li>
<li>Optional: <a href="${registerUrl}" style="color:#8A7340">free account</a> to sign in later</li>
</ol>
<p style="margin:24px 0"><a href="${exploreUrl}" style="display:inline-block;background:#C4A052;color:#0A0A0B;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:700">Start exploring</a></p>
</body></html>`;

  return { subject, text, html };
}

/** Send list confirmation email. Never throws. */
export async function sendWaitlistConfirmationEmail(env, email, listType) {
  if (!email) return { sent: false, reason: 'no email' };
  const payload = buildWaitlistConfirmationEmail(listType, env);
  return sendViaResend(env, email, payload);
}

export { buildWaitlistConfirmationEmail };
