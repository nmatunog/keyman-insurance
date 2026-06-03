import {
  error,
  hashPassword,
  json,
  now,
  readJson,
  requireAuth,
  validPassword,
  verifyPassword,
} from '../../lib/auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const body = await readJson(request);
  if (!body) return error('Invalid JSON body');

  const currentPassword = body.currentPassword || '';
  const newPassword = body.newPassword || '';

  if (!currentPassword) return error('Current password is required');
  if (!validPassword(newPassword)) return error('New password must be at least 8 characters');
  if (currentPassword === newPassword) return error('New password must be different from current password');

  const row = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?')
    .bind(user.id)
    .first();

  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    return error('Current password is incorrect', 401);
  }

  const passwordHash = await hashPassword(newPassword);
  const ts = now();

  await env.DB.batch([
    env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').bind(
      passwordHash,
      ts,
      user.id
    ),
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ? AND id != ?').bind(
      user.id,
      user.sessionId
    ),
  ]);

  return json({ ok: true, message: 'Password updated successfully' });
}
