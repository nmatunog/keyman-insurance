import { json, requireAdmin } from '../../lib/auth.js';

export async function onRequestGet(context) {
  const { response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const limit = Math.min(500, Math.max(1, parseInt(new URL(context.request.url).searchParams.get('limit') || '200', 10)));

  const { results } = await context.env.DB.prepare(
    `SELECT id, created_at, name, email, discipline, contribution_type, message, source
     FROM contributor_submissions
     ORDER BY created_at DESC
     LIMIT ?`
  )
    .bind(limit)
    .all();

  return json({ ok: true, submissions: results || [] });
}
