import { error, getSessionUser, json, sessionCookieHeader } from '../../lib/auth.js';

export async function onRequestPost(context) {
  const user = await getSessionUser(context.request, context.env);
  if (user?.sessionId) {
    await context.env.DB.prepare('DELETE FROM sessions WHERE id = ?')
      .bind(user.sessionId)
      .run();
  }
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookieHeader('', 0) });
}
