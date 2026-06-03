import { error, json, now, readJson, requireAdmin } from '../../../lib/auth.js';

export async function onRequestPatch(context) {
  const { user, response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const id = context.params.id;
  const body = await readJson(context.request);
  if (!body) return error('Invalid JSON body');

  const target = await context.env.DB.prepare('SELECT id, role FROM users WHERE id = ?')
    .bind(id)
    .first();
  if (!target) return error('Member not found', 404);
  if (target.role === 'admin' && target.id !== user.id) {
    return error('Cannot modify other admin accounts', 403);
  }

  const allowedTier = ['preview', 'professional', 'elite', 'basic', 'advanced', 'master'];
  const allowedStatus = ['pending', 'active', 'suspended'];
  const allowedRole = ['member', 'mentee', 'admin'];

  const updates = [];
  const binds = [];

  if (body.tier !== undefined) {
    if (!allowedTier.includes(body.tier)) return error('Invalid tier');
    updates.push('tier = ?');
    binds.push(body.tier);
  }
  if (body.status !== undefined) {
    if (!allowedStatus.includes(body.status)) return error('Invalid status');
    updates.push('status = ?');
    binds.push(body.status);
  }
  if (body.role !== undefined) {
    if (!allowedRole.includes(body.role)) return error('Invalid role');
    updates.push('role = ?');
    binds.push(body.role);
  }
  if (body.name !== undefined) {
    updates.push('name = ?');
    binds.push(String(body.name).trim() || null);
  }

  if (!updates.length) return error('No valid fields to update');

  updates.push('updated_at = ?');
  binds.push(now());
  binds.push(id);

  await context.env.DB.prepare(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
  )
    .bind(...binds)
    .run();

  const updated = await context.env.DB.prepare(
    'SELECT id, email, name, role, tier, status, created_at, updated_at FROM users WHERE id = ?'
  )
    .bind(id)
    .first();

  return json({ ok: true, member: updated });
}
