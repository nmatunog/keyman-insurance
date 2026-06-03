const SESSION_COOKIE = 'giya_session';
const SESSION_DAYS = 14;

export { SESSION_COOKIE, SESSION_DAYS };

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

export function error(message, status = 400) {
  return json({ ok: false, error: message }, status);
}

export function now() {
  return Math.floor(Date.now() / 1000);
}

export async function hashPassword(password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hash = new Uint8Array(bits);
  return `pbkdf2:${b64(salt)}:${b64(hash)}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, saltB64, hashB64] = stored.split(':');
  if (scheme !== 'pbkdf2' || !saltB64 || !hashB64) return false;
  const salt = unb64(saltB64);
  const expected = unb64(hashB64);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

function b64(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function unb64(str) {
  const s = atob(str);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

export function sessionCookieHeader(sessionId, maxAgeSec) {
  const parts = [
    `${SESSION_COOKIE}=${sessionId}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSec}`,
  ];
  if (maxAgeSec > 0) parts.push('Secure');
  else parts.push('Max-Age=0');
  return parts.join('; ');
}

export function parseCookies(request) {
  const header = request.headers.get('Cookie') || '';
  const out = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(rest.join('='));
  }
  return out;
}

export async function getSessionUser(request, env) {
  const cookies = parseCookies(request);
  const sessionId = cookies[SESSION_COOKIE];
  if (!sessionId) return null;

  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.role, u.tier, u.status
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at > ?`
  )
    .bind(sessionId, now())
    .first();

  if (!row) return null;
  return { ...row, sessionId };
}

export function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tier: user.tier,
    status: user.status,
  };
}

export async function requireAuth(request, env) {
  const user = await getSessionUser(request, env);
  if (!user) return { user: null, response: error('Not authenticated', 401) };
  if (user.status === 'suspended') {
    return { user: null, response: error('Account suspended', 403) };
  }
  return { user, response: null };
}

export async function requireAdmin(request, env) {
  const { user, response } = await requireAuth(request, env);
  if (response) return { user: null, response };
  if (user.role !== 'admin') return { user: null, response: error('Admin access required', 403) };
  return { user, response: null };
}

export function readJson(request) {
  return request.json().catch(() => null);
}

export function validEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}
