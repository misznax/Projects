// Tożsamość użytkownika. Dwa źródła, w tej kolejności:
//  1) Cloudflare Access (nagłówek Cf-Access-Jwt-Assertion, weryfikowany podpisem; wymaga ACCESS_TEAM) – plan B / konto właściciela,
//  2) własna sesja po logowaniu linkiem z e-maila (ciasteczko `ps` podpisane SESSION_SECRET + wpis w D1, więc da się je unieważnić).
// Wszystko „fail-closed”: bez poprawnej tożsamości nie ma dostępu.
import { canon, isEmail, hit, memoPos } from './access.js';

const te = new TextEncoder(), td = new TextDecoder();
export const b64u = (u8) => btoa(String.fromCharCode(...u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const unb64u = (s) => Uint8Array.from(atob(String(s).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
export const rand = (n = 32) => b64u(crypto.getRandomValues(new Uint8Array(n)));
export async function sha256(s) { return b64u(new Uint8Array(await crypto.subtle.digest('SHA-256', te.encode(s)))); }
async function hmacKey(secret) { return crypto.subtle.importKey('raw', te.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
export async function sign(secret, data) { return b64u(new Uint8Array(await crypto.subtle.sign('HMAC', await hmacKey(secret), te.encode(data)))); }
function safeEq(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

export const owners = (env) => new Set(String(env.OWNER_EMAILS || '').split(/[,;\s]+/).map(canon).filter(Boolean));
export const isOwner = (env, email) => owners(env).has(canon(email));
export const isLocal = (url) => url.hostname === 'localhost' || url.hostname === '127.0.0.1';

// ── Cloudflare Access ──
let certs = null;
async function accessEmail(request, env) {
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt || !env.ACCESS_TEAM) return null;
  try {
    const [h, p, s] = jwt.split('.');
    const head = JSON.parse(td.decode(unb64u(h))), pay = JSON.parse(td.decode(unb64u(p)));
    if (!pay.exp || pay.exp * 1000 < Date.now() || !pay.email) return null;
    if (env.ACCESS_AUD && ![].concat(pay.aud).includes(env.ACCESS_AUD)) return null;
    if (!certs || certs.t < Date.now() - 36e5) certs = { t: Date.now(), keys: (await (await fetch(`https://${env.ACCESS_TEAM}/cdn-cgi/access/certs`)).json()).keys };
    const jwk = certs.keys.find((k) => k.kid === head.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    if (!(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, unb64u(s), te.encode(h + '.' + p)))) return null;
    return String(pay.email);
  } catch { return null; }
}

// ── Sesja własna ──
export const COOKIE = 'ps';
const SESSION_DAYS = 30;
export function cookieDomain(url, env) {
  if (env.COOKIE_DOMAIN) return env.COOKIE_DOMAIN;
  const parts = url.hostname.split('.');
  return parts.length >= 3 && !url.hostname.endsWith('.workers.dev') ? '.' + parts.slice(-2).join('.') : '';
}
const cookieStr = (url, env, value, maxAge) => `${COOKIE}=${value}; Path=/; ${cookieDomain(url, env) ? `Domain=${cookieDomain(url, env)}; ` : ''}Max-Age=${maxAge}; HttpOnly; ${isLocal(url) ? '' : 'Secure; '}SameSite=Lax`;
export const readCookie = (request, name) => (request.headers.get('cookie') || '').split(/;\s*/).map((c) => c.split('=')).find((c) => c[0] === name)?.slice(1).join('=') || '';

export async function createSession(env, url, email, ua = '') {
  const id = rand(24), now = Date.now(), exp = now + SESSION_DAYS * 864e5;
  await env.DB.prepare('INSERT INTO sess (id, email, created, exp, last, ua) VALUES (?1, ?2, ?3, ?4, ?3, ?5)').bind(id, canon(email), now, exp, String(ua).slice(0, 160)).run();
  return cookieStr(url, env, id + '.' + await sign(env.SESSION_SECRET, id), SESSION_DAYS * 86400);
}
export const clearCookie = (url, env) => cookieStr(url, env, '', 0);

async function sessionEmail(request, env) {
  if (!env.SESSION_SECRET || !env.DB) return null;
  const raw = readCookie(request, COOKIE); const dot = raw.indexOf('.');
  if (dot < 1) return null;
  const id = raw.slice(0, dot);
  if (!safeEq(raw.slice(dot + 1), await sign(env.SESSION_SECRET, id))) return null;
  const r = await memoPos(env, 'ses|' + id, async () => {
    const now = Date.now();
    const s = await env.DB.prepare('SELECT s.email, s.exp, s.last, u.raw FROM sess s LEFT JOIN users u ON u.email = s.email WHERE s.id = ?1').bind(id).first();
    if (!s || s.exp < now) return { ok: false };
    if (now - s.last > 36e5) await env.DB.prepare('UPDATE sess SET last = ?2 WHERE id = ?1').bind(id, now).run().catch(() => {});
    return { ok: true, email: s.raw || s.email, sid: id };
  });
  return r.ok ? r : null;
}
export async function endSession(request, env) {
  const raw = readCookie(request, COOKIE), id = raw.slice(0, Math.max(0, raw.indexOf('.')));
  if (id && env.DB) await env.DB.prepare('DELETE FROM sess WHERE id = ?1').bind(id).run();
}

// Zwraca { email (jak wpisany), key (kanoniczny), via } albo null.
export async function identify(request, env) {
  const url = new URL(request.url);
  if (isLocal(url) && env.DEV_EMAIL) return { email: env.DEV_EMAIL, key: canon(env.DEV_EMAIL), via: 'dev' };
  const a = await accessEmail(request, env);
  if (a) return { email: a, key: canon(a), via: 'access' };
  const s = await sessionEmail(request, env);
  return s ? { email: s.email, key: canon(s.email), via: 'session', sid: s.sid } : null;
}

// ── Logowanie linkiem z e-maila ──
const TOKEN_MIN = 15;
export const safeNext = (n) => (typeof n === 'string' && /^\/(?!\/|\\)[^\s]{0,300}$/.test(n) ? n : '/');
export const mailReady = (env) => !!(env.EMAIL && env.SESSION_SECRET && env.MAIL_FROM && env.DB);

export async function issueLink(env, url, email, ip, next) {
  const key = canon(email), token = rand(32);
  await env.DB.prepare('INSERT INTO auth_tok (h, email, raw, exp, ip, created, next) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)').bind(await sha256(token), key, String(email).trim(), Date.now() + TOKEN_MIN * 60000, ip, Date.now(), safeNext(next)).run();
  return `${url.origin}/auth/verify?t=${token}`;
}

// Ograniczenia: 5 wniosków / godz. na adres, 20 / godz. na IP, 3 / 10 min na adres w serii.
export async function loginAllowed(env, email, ipHash) {
  const k = canon(email);
  const [a, b] = await Promise.all([hit(env, 'lm:' + k, 36e5), hit(env, 'li:' + ipHash, 36e5)]);
  return a <= 5 && b <= 20;
}
export async function sendLoginMail(env, to, link) {
  const from = { email: env.MAIL_FROM, name: env.MAIL_NAME || 'Projects · Web Elegance' };
  const text = `Cześć!\n\nKliknij, aby zalogować się do Projects:\n${link}\n\nLink działa przez ${TOKEN_MIN} minut i tylko raz. Jeśli to nie Ty o niego prosiłeś(-aś), zignoruj tę wiadomość.\n\nProjects · Web Elegance`;
  const html = `<!doctype html><html lang="pl"><body style="margin:0;background:#EEF6F6;font-family:Arial,Helvetica,sans-serif;color:#0A2A33"><div style="max-width:520px;margin:0 auto;padding:32px 20px"><div style="background:#fff;border-radius:18px;padding:32px 28px;border:1px solid #D4E4E6"><p style="margin:0 0 6px;font-size:13px;letter-spacing:.04em;color:#0B6F78;font-weight:700">PROJECTS · WEB ELEGANCE</p><h1 style="margin:0 0 14px;font-size:24px;line-height:1.25">Twój link do logowania</h1><p style="margin:0 0 22px;line-height:1.55;color:#3C5A62">Kliknij przycisk, a wejdziesz do swoich aplikacji. Bez hasła.</p><p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;background:#0B6F78;color:#fff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px">Zaloguj się</a></p><p style="margin:0;font-size:13px;line-height:1.5;color:#5A7279">Link działa przez ${TOKEN_MIN} minut i tylko raz. Jeśli to nie Ty o niego prosiłeś(-aś), zignoruj tę wiadomość. Przycisk nie działa? Skopiuj adres:<br><span style="word-break:break-all">${link}</span></p></div></div></body></html>`;
  return env.EMAIL.send({ from, to, subject: 'Twój link do logowania · Projects', html, text });
}

// Zużywa token (jednorazowo). Zwraca { email, raw, next } albo null.
export async function consumeToken(env, token) {
  if (!/^[\w-]{20,80}$/.test(token || '')) return null;
  const h = await sha256(token), now = Date.now();
  const r = await env.DB.prepare('UPDATE auth_tok SET used = 1 WHERE h = ?1 AND used = 0 AND exp > ?2 RETURNING email, raw, next').bind(h, now).first();
  if (!r) return null;
  await env.DB.prepare('INSERT INTO users (email, raw, created, last_login, logins) VALUES (?1, ?2, ?3, ?3, 1) ON CONFLICT(email) DO UPDATE SET last_login = ?3, logins = logins + 1, raw = ?2').bind(r.email, r.raw || r.email, now).run();
  return r;
}
export async function peekToken(env, token) {
  if (!/^[\w-]{20,80}$/.test(token || '')) return null;
  return env.DB.prepare('SELECT email, raw FROM auth_tok WHERE h = ?1 AND used = 0 AND exp > ?2').bind(await sha256(token), Date.now()).first();
}
export const maskEmail = (e) => { const [l, d] = String(e).split('@'); return (l.length <= 2 ? l[0] + '*' : l[0] + '***' + l.slice(-1)) + '@' + d; };
export { isEmail, canon };
