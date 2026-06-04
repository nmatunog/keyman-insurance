import { error, json, now, readJson } from '../../lib/auth.js';
import { sendWaitlistConfirmationEmail } from '../../lib/waitlistEmail.js';

const LIST_TYPES = new Set(['masterclass', 'community']);

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const email = String(body.email || '')
    .trim()
    .toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error('Valid email is required');
  }

  const listType = String(body.list_type || body.listType || 'masterclass').toLowerCase();
  if (!LIST_TYPES.has(listType)) {
    return error('Invalid list type');
  }

  const consent = body.consent !== false && body.consent !== 'false';
  if (!consent) return error('Consent is required');

  const source = String(body.source || 'homepage').slice(0, 64) || 'homepage';
  const id = crypto.randomUUID();
  const ts = now();

  try {
    await context.env.DB.prepare(
      `INSERT INTO waitlist_signups (id, created_at, email, list_type, source, consent)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(id, ts, email, listType, source, consent ? 1 : 0)
      .run();
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes('UNIQUE') || msg.includes('unique')) {
      const emailResult = await sendWaitlistConfirmationEmail(context.env, email, listType);
      return json({
        ok: true,
        already_registered: true,
        list_type: listType,
        email_sent: Boolean(emailResult.sent),
        redirect: `/welcome.html?type=${listType}&confirmed=1&email=${encodeURIComponent(email)}`,
        message:
          listType === 'masterclass'
            ? 'You are already on the Master Class priority waitlist.'
            : 'You are already on the GIYA community list.',
      });
    }
    throw e;
  }

  const emailResult = await sendWaitlistConfirmationEmail(context.env, email, listType);

  return json({
    ok: true,
    id,
    list_type: listType,
    email_sent: Boolean(emailResult.sent),
    redirect: `/welcome.html?type=${listType}&confirmed=1&email=${encodeURIComponent(email)}`,
    message:
      listType === 'masterclass'
        ? 'You are on the Master Class priority waitlist. We will email you before launch.'
        : 'Welcome to GIYA. Check your inbox for confirmation.',
  });
}
