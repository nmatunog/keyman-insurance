import {
  error,
  hashPassword,
  json,
  now,
  readJson,
  validEmail,
  validPassword,
} from '../../lib/auth.js';

/** One-time admin bootstrap — requires GIYA_SETUP_SECRET */
export async function onRequestPost(context) {
  const { request, env } = context;
  const secret = (env.GIYA_SETUP_SECRET || '').trim();
  if (!secret) return error('Setup not configured. Set GIYA_SETUP_SECRET in Cloudflare.', 503);

  const auth = request.headers.get('Authorization') || '';
  const headerToken = request.headers.get('X-GIYA-Setup-Token') || '';
  const body = await readJson(request);
  const bodyToken = body?.setupToken || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : headerToken.trim() || String(bodyToken).trim();

  if (!token || token !== secret) return error('Unauthorized', 401);

  const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users WHERE role = ?')
    .bind('admin')
    .first();
  if (count?.n > 0) return error('Admin already exists', 409);

  if (!body) return error('Invalid JSON body');

  const email = (body.email || env.GIYA_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = body.password || env.GIYA_ADMIN_PASSWORD || '';
  const name = (body.name || 'GIYA Admin').trim();

  if (!validEmail(email)) return error('Valid admin email required');
  if (!validPassword(password)) return error('Admin password must be at least 8 characters');

  const id = crypto.randomUUID();
  const ts = now();
  const passwordHash = await hashPassword(password);

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, name, role, tier, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'admin', 'elite', 'active', ?, ?)`
  )
    .bind(id, email, passwordHash, name, ts, ts)
    .run();

  return json({
    ok: true,
    message: 'Admin account created. Sign in at /login.html then open /admin/',
    email,
  }, 201);
}
