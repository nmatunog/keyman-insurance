import { error, json, now, readJson } from '../../lib/auth.js';
import { sendSpikeWorkshopInquiryEmails } from '../../lib/spikeWorkshopEmail.js';

const DESIGNATIONS = new Set([
  'agency_director',
  'unit_manager',
  'training_head',
  'facilitator',
  'experienced_mentor',
]);

const TIMELINES = new Set(['asap', 'within_3_months', 'later_this_year', 'exploratory']);

export async function onRequestPost(context) {
  const body = await readJson(context.request);

  const fullName = String(body.full_name || body.fullName || '').trim().slice(0, 120);
  const designation = String(body.designation || '').trim().toLowerCase();
  const agencyName = String(body.agency_name || body.agencyName || '').trim().slice(0, 160);
  const mobile = String(body.mobile || body.mobileNo || '').trim().slice(0, 40);
  const email = String(body.email || body.workEmail || '')
    .trim()
    .toLowerCase();
  const city = String(body.city || body.cityLocation || '').trim().slice(0, 120) || null;
  const estRookies = parseOptionalInt(body.est_rookies ?? body.estRookies);
  const estMentors = parseOptionalInt(body.est_mentors ?? body.estMentors);
  const implTimeline = String(body.impl_timeline || body.implPeriod || 'asap').trim().toLowerCase();
  const notes = String(body.notes || body.onboardingChallenge || '').trim().slice(0, 4000) || null;
  const source = String(body.source || 'spike_mentor_workshop').slice(0, 64);

  if (!fullName) return error('Full name is required');
  if (!DESIGNATIONS.has(designation)) return error('Valid role or designation is required');
  if (!agencyName) return error('Agency or organization is required');
  if (!mobile) return error('Mobile number is required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error('Valid work email is required');
  }
  if (!TIMELINES.has(implTimeline)) return error('Invalid implementation timeline');

  const id = crypto.randomUUID();
  const ts = now();

  await context.env.DB.prepare(
    `INSERT INTO spike_workshop_inquiries (
      id, created_at, full_name, designation, agency_name, mobile, email,
      city, est_rookies, est_mentors, impl_timeline, notes, source, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`
  )
    .bind(
      id,
      ts,
      fullName,
      designation,
      agencyName,
      mobile,
      email,
      city,
      estRookies,
      estMentors,
      implTimeline,
      notes,
      source
    )
    .run();

  const inquiry = {
    full_name: fullName,
    designation,
    agency_name: agencyName,
    mobile,
    email,
    city,
    est_rookies: estRookies,
    est_mentors: estMentors,
    impl_timeline: implTimeline,
    notes,
  };

  const emailResult = await sendSpikeWorkshopInquiryEmails(context.env, inquiry);

  return json({
    ok: true,
    id,
    message:
      'Thank you. Your implementation request was received. We will contact you to schedule a briefing.',
    email_sent: Boolean(emailResult.submitter?.sent),
    admin_notified: Boolean(emailResult.admin?.sent),
  });
}

function parseOptionalInt(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
