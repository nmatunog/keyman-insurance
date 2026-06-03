import { error, json, requireAdmin } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const { user, response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const { results } = await context.env.DB.prepare(
    `SELECT id, email, name, role, tier, status, created_at, updated_at
     FROM users ORDER BY created_at DESC LIMIT 200`
  ).all();

  const stats = await context.env.DB.prepare(
    `SELECT
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
       SUM(CASE WHEN role = 'mentee' THEN 1 ELSE 0 END) AS mentees,
       SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins
     FROM users`
  ).first();

  const { results: pendingPayments } = await context.env.DB.prepare(
    `SELECT s.id, s.tier, s.amount_php, s.payment_provider, s.payment_ref, s.status, s.created_at,
            u.email, u.name
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     WHERE s.status = 'pending'
     ORDER BY s.created_at DESC LIMIT 50`
  ).all();

  return json({
    ok: true,
    admin: { email: user.email, name: user.name },
    stats,
    members: results,
    pendingPayments,
  });
}
