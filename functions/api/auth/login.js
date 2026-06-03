import {
  error,
  json,
  now,
  publicUser,
  readJson,
  sessionCookieHeader,
  SESSION_DAYS,
  validEmail,
  verifyPassword,
} from '../../lib/auth.js';
import { syncMembershipForUser } from '../../lib/membership.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await readJson(request);
  if (!body) return error('Invalid JSON body');

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  if (!validEmail(email)) return error('Valid email required');
  if (!password) return error('Password required');

  const user = await env.DB.prepare(
    'SELECT id, email, name, role, tier, status, password_hash FROM users WHERE email = ?'
  )
    .bind(email)
    .first();

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return error('Invalid email or password', 401);
  }

  if (user.status === 'suspended') return error('Account suspended', 403);

  const sessionId = crypto.randomUUID();
  const ts = now();
  const expires = ts + SESSION_DAYS * 86400;

  await env.DB.prepare(
    'INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  )
    .bind(sessionId, user.id, expires, ts)
    .run();

  await syncMembershipForUser(env, user.id);
  const fresh = await env.DB.prepare(
    'SELECT id, email, name, role, tier, status FROM users WHERE id = ?'
  )
    .bind(user.id)
    .first();

  return json(
    { ok: true, user: publicUser(fresh || user) },
    200,
    { 'Set-Cookie': sessionCookieHeader(sessionId, SESSION_DAYS * 86400) }
  );
}
