import {
  error,
  hashPassword,
  json,
  now,
  readJson,
  validEmail,
  validPassword,
} from '../../lib/auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await readJson(request);
  if (!body) return error('Invalid JSON body');

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const name = (body.name || '').trim() || null;
  const role = body.role === 'mentee' ? 'mentee' : 'member';

  if (!validEmail(email)) return error('Valid email required');
  if (!validPassword(password)) return error('Password must be at least 8 characters');

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first();
  if (existing) return error('Email already registered', 409);

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const ts = now();

  const source = String(body.source || '').toLowerCase();
  const status = source === 'community' || source === 'welcome' ? 'active' : 'pending';

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, role, tier, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'preview', ?, ?, ?)`
  )
    .bind(id, email, passwordHash, name, role, status, ts, ts)
    .run();

  return json({
    ok: true,
    message:
      status === 'active'
        ? 'Free Discover account created. Sign in and start exploring.'
        : 'Account created. Sign in after admin approval, or subscribe to activate immediately.',
    user: { id, email, name, role, tier: 'preview', status },
    redirect: status === 'active' ? '/login.html?return=/?welcome=1' : '/login.html',
  }, 201);
}
