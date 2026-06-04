import { error, json, now, readJson } from '../../lib/auth.js';

const CONTRIBUTION_TYPES = new Set(['article', 'case_study', 'research', 'template']);
const DISCIPLINES = new Set([
  'wealth',
  'business_insurance',
  'health',
  'estate',
  'succession',
  'practice_leadership',
  'other',
]);

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '')
    .trim()
    .toLowerCase();
  const discipline = String(body.discipline || 'other').toLowerCase();
  const contributionType = String(body.contribution_type || body.contributionType || '')
    .toLowerCase()
    .replace(/\s+/g, '_');
  const message = String(body.message || '').trim().slice(0, 4000);
  const source = String(body.source || 'homepage').slice(0, 64) || 'homepage';

  if (!name) return error('Name is required');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return error('Valid email is required');
  }
  if (!CONTRIBUTION_TYPES.has(contributionType)) {
    return error('Invalid contribution type');
  }
  if (!DISCIPLINES.has(discipline)) return error('Invalid discipline');

  const consent = body.consent !== false && body.consent !== 'false';
  if (!consent) return error('Consent is required');

  const id = crypto.randomUUID();
  const ts = now();

  await context.env.DB.prepare(
    `INSERT INTO contributor_submissions (id, created_at, name, email, discipline, contribution_type, message, source, consent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(id, ts, name, email, discipline, contributionType, message || null, source, consent ? 1 : 0)
    .run();

  return json({
    ok: true,
    id,
    message: 'Thank you. Your contribution idea was received. The GIYA team will review it.',
  });
}
