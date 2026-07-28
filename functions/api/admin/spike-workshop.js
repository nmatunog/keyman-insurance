import { json, requireAdmin } from '../../lib/auth.js';
import { spikeDesignationLabel, spikeTimelineLabel } from '../../lib/spikeWorkshopEmail.js';

export async function onRequestGet(context) {
  const { response } = await requireAdmin(context.request, context.env);
  if (response) return response;

  const limit = Math.min(500, Math.max(1, parseInt(new URL(context.request.url).searchParams.get('limit') || '200', 10)));

  const { results } = await context.env.DB.prepare(
    `SELECT id, created_at, full_name, designation, agency_name, mobile, email,
            city, est_rookies, est_mentors, impl_timeline, notes, source, status
     FROM spike_workshop_inquiries
     ORDER BY created_at DESC
     LIMIT ?`
  )
    .bind(limit)
    .all();

  const inquiries = (results || []).map((row) => ({
    ...row,
    designation_label: spikeDesignationLabel(row.designation),
    impl_timeline_label: spikeTimelineLabel(row.impl_timeline),
  }));

  const stats = await context.env.DB.prepare(
    `SELECT status, COUNT(*) AS count FROM spike_workshop_inquiries GROUP BY status`
  ).all();

  return json({ ok: true, inquiries, stats: stats?.results || [] });
}
