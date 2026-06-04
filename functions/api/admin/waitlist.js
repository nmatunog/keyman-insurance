import { json, requireAdmin } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const { response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const url = new URL(context.request.url);
  const listType = url.searchParams.get('list_type');
  const limit = Math.min(500, Math.max(1, parseInt(url.searchParams.get('limit') || '200', 10)));

  let sql = `SELECT id, created_at, email, list_type, source, consent FROM waitlist_signups`;
  const binds = [];

  if (listType === 'masterclass' || listType === 'community') {
    sql += ` WHERE list_type = ?`;
    binds.push(listType);
  }
  sql += ` ORDER BY created_at DESC LIMIT ?`;
  binds.push(limit);

  const { results } = await context.env.DB.prepare(sql).bind(...binds).all();

  const stats = await context.env.DB.prepare(
    `SELECT list_type, COUNT(*) AS count FROM waitlist_signups GROUP BY list_type`
  ).all();

  return json({
    ok: true,
    signups: results || [],
    stats: stats?.results || [],
  });
}
