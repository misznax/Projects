// Uprawnienia do aplikacji: próba, abonament, blokada, limity dzienne. Czysta logika + D1 (bez zależności od Workera).
// Klucz użytkownika = adres e-mail w postaci kanonicznej (małe litery, bez „+tag”, w Gmailu bez kropek), żeby próby nie mnożyć aliasami.
export const DAY = 864e5;
export const MONTHS = { '1': 1, '6': 6, '12': 12 };
export const ALL = '*';                         // wpis „wszystkie aplikacje”

export const settings = (env) => ({
  trialDays: Math.max(1, +env.TRIAL_DAYS || 3),
  gateOff: env.GATE === 'off',                  // wyłącznik awaryjny: wszyscy zalogowani mają dostęp
});

// Dzienne limity kosztownych wywołań [próba, abonament]; nadpisywalne zmienną QUOTAS (JSON).
export const QUOTA = {
  ask: [15, 80],          // streszczenia (Claude / Workers AI)
  transcript: [20, 120],  // napisy YouTube
  stt: [400, 1500],       // fragmenty audio 30 s (Notatnik)
  claude: [60, 300],      // notatki, autorzy, weryfikacja (Notatnik)
  state: [600, 4000],     // zapisy stanu aplikacji w chmurze
};

// Krótka pamięć podręczna w obrębie instancji Workera: pamięta TYLKO wyniki pozytywne (ok:true), więc start próby czy wykupienie
// działają od razu, a blokada/koniec dostępu wchodzą w życie najpóźniej po CACHE_TTL ms (domyślnie 20 s). Oszczędza zapytania D1 przy ładowaniu zasobów.
const POS = new Map();
export async function memoPos(env, key, fn) {
  const ttl = +env.CACHE_TTL >= 0 ? +env.CACHE_TTL : 20000, now = Date.now(), c = POS.get(key);
  if (c && c.t > now) return c.v;
  const v = await fn();
  if (v?.ok && ttl > 0) { if (POS.size > 2000) POS.clear(); POS.set(key, { t: now + ttl, v }); }
  return v;
}

export function canon(email) {
  let e = String(email || '').trim().toLowerCase();
  const at = e.lastIndexOf('@');
  if (at < 1) return '';
  let local = e.slice(0, at), dom = e.slice(at + 1);
  if (dom === 'googlemail.com') dom = 'gmail.com';
  local = local.replace(/\+.*$/, '');
  if (dom === 'gmail.com') local = local.replace(/\./g, '');
  return local && dom ? local + '@' + dom : '';
}
export const isEmail = (s) => /^[^\s@<>"',;:()\\]{1,64}@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(String(s || '').trim()) && String(s).length <= 120;

export function addMonths(ts, m) { const d = new Date(ts); d.setUTCMonth(d.getUTCMonth() + m); return d.getTime(); }

// Stan dostępu do jednej aplikacji z wpisów: own (ta aplikacja) i all (wpis „*”).
export function statusOf(own, all, now, cfg) {
  if (own?.blocked || all?.blocked) return { st: 'blocked' };
  const paid = Math.max(own?.paid_until || 0, all?.paid_until || 0);
  if (paid > now) return { st: 'paid', until: paid, daysLeft: Math.ceil((paid - now) / DAY) };
  const ts = own?.trial_start;
  if (ts) {
    const end = ts + cfg.trialDays * DAY;
    if (now < end) return { st: 'trial', until: end, daysLeft: Math.ceil((end - now) / DAY), hoursLeft: Math.ceil((end - now) / 36e5), frac: (now - ts) / (end - ts) };
    return { st: 'expired', until: end, wasPaid: paid > 0, paidEnded: paid };
  }
  if (paid > 0) return { st: 'expired', wasPaid: true, paidEnded: paid };
  return { st: 'new' };
}

const READY = new WeakMap();   // po uchwycie bazy: schemat zakładany raz na instancję Workera
export function ensureSchema(env) {
  let ready = READY.get(env.DB);
  if (!ready) {
    const q = (s) => env.DB.prepare(s);
    ready = env.DB.batch([
      q('CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, raw TEXT NOT NULL, created INTEGER NOT NULL, last_login INTEGER, logins INTEGER NOT NULL DEFAULT 0)'),
      q('CREATE TABLE IF NOT EXISTS ent (email TEXT NOT NULL, app TEXT NOT NULL, trial_start INTEGER, paid_until INTEGER, plan TEXT, blocked INTEGER NOT NULL DEFAULT 0, note TEXT, created INTEGER NOT NULL, updated INTEGER NOT NULL, PRIMARY KEY (email, app))'),
      q('CREATE TABLE IF NOT EXISTS usage (email TEXT NOT NULL, day TEXT NOT NULL, kind TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (email, day, kind))'),
      q('CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, actor TEXT, action TEXT NOT NULL, email TEXT, app TEXT, detail TEXT)'),
      q('CREATE TABLE IF NOT EXISTS auth_tok (h TEXT PRIMARY KEY, email TEXT NOT NULL, raw TEXT, exp INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0, ip TEXT, created INTEGER NOT NULL, next TEXT)'),
      q('CREATE TABLE IF NOT EXISTS sess (id TEXT PRIMARY KEY, email TEXT NOT NULL, created INTEGER NOT NULL, exp INTEGER NOT NULL, last INTEGER NOT NULL, ua TEXT)'),
      q('CREATE INDEX IF NOT EXISTS sess_email ON sess (email)'),
      q('CREATE TABLE IF NOT EXISTS rl (k TEXT PRIMARY KEY, n INTEGER NOT NULL, t INTEGER NOT NULL)'),
      q('CREATE TABLE IF NOT EXISTS app_state (u TEXT NOT NULL, app TEXT NOT NULL, t INTEGER NOT NULL, data TEXT NOT NULL, PRIMARY KEY (u, app))'),
    ]).catch((e) => { READY.delete(env.DB); throw e; });
    READY.set(env.DB, ready);
  }
  return ready;
}

export async function getRows(env, email, app) {
  const r = await env.DB.prepare('SELECT * FROM ent WHERE email = ?1 AND app IN (?2, ?3)').bind(email, app, ALL).all();
  const rows = r.results || [];
  return { own: rows.find((x) => x.app === app) || null, all: rows.find((x) => x.app === ALL) || null };
}

export async function statusFor(env, email, app, now = Date.now()) {
  const { own, all } = await getRows(env, email, app);
  return { ...statusOf(own, all, now, settings(env)), own, all };
}

// Wszystkie aplikacje użytkownika naraz (panel).
export async function statusesFor(env, email, apps, now = Date.now()) {
  const r = await env.DB.prepare('SELECT * FROM ent WHERE email = ?1').bind(email).all();
  const rows = r.results || [], all = rows.find((x) => x.app === ALL) || null, cfg = settings(env);
  return Object.fromEntries(apps.map((a) => [a.nn, statusOf(rows.find((x) => x.app === a.nn) || null, all, now, cfg)]));
}

export async function startTrial(env, email, app, now = Date.now()) {
  await env.DB.prepare('INSERT INTO ent (email, app, trial_start, created, updated) VALUES (?1, ?2, ?3, ?3, ?3) ON CONFLICT(email, app) DO UPDATE SET trial_start = COALESCE(trial_start, ?3), updated = ?3').bind(email, app, now).run();
}

export async function audit(env, actor, action, email, app, detail) {
  await env.DB.prepare('INSERT INTO audit (ts, actor, action, email, app, detail) VALUES (?1, ?2, ?3, ?4, ?5, ?6)').bind(Date.now(), actor || null, action, email || null, app || null, detail ? String(detail).slice(0, 300) : null).run();
}

// Nadanie dostępu: months (1/6/12) dolicza się do późniejszej z dat: teraz / dotychczasowy koniec; until (ms) ustawia datę wprost.
export async function grant(env, actor, { email, app, months, until, plan, note }, now = Date.now()) {
  const e = canon(email);
  if (!e) throw new Error('bad_email');
  if (app !== ALL && !/^\d\d$/.test(app)) throw new Error('bad_app');
  const cur = (await env.DB.prepare('SELECT paid_until FROM ent WHERE email = ?1 AND app = ?2').bind(e, app).first())?.paid_until || 0;
  let paid;
  if (until) paid = +until; else if (MONTHS[String(months)]) paid = addMonths(Math.max(now, cur), MONTHS[String(months)]); else throw new Error('bad_period');
  if (!(paid > 0)) throw new Error('bad_period');
  await env.DB.prepare('INSERT INTO ent (email, app, paid_until, plan, blocked, note, created, updated) VALUES (?1, ?2, ?3, ?4, 0, ?5, ?6, ?6) ON CONFLICT(email, app) DO UPDATE SET paid_until = ?3, plan = COALESCE(?4, plan), blocked = 0, note = COALESCE(?5, note), updated = ?6').bind(e, app, paid, plan || (months ? months + ' mies.' : 'ręcznie'), note || null, now).run();
  await audit(env, actor, 'grant', e, app, `do ${new Date(paid).toISOString().slice(0, 10)}${months ? ` (+${months} mies.)` : ''}`);
  return paid;
}
export async function setBlocked(env, actor, email, app, blocked) {
  const e = canon(email), now = Date.now();
  await env.DB.prepare('INSERT INTO ent (email, app, blocked, created, updated) VALUES (?1, ?2, ?3, ?4, ?4) ON CONFLICT(email, app) DO UPDATE SET blocked = ?3, updated = ?4').bind(e, app, blocked ? 1 : 0, now).run();
  if (blocked && app === ALL) await env.DB.prepare('DELETE FROM sess WHERE email = ?1').bind(e).run();
  await audit(env, actor, blocked ? 'block' : 'unblock', e, app);
}
export async function resetTrial(env, actor, email, app) {
  const e = canon(email);
  await env.DB.prepare('UPDATE ent SET trial_start = NULL, updated = ?3 WHERE email = ?1 AND app = ?2').bind(e, app, Date.now()).run();
  await audit(env, actor, 'reset_trial', e, app);
}
export async function revoke(env, actor, email, app) {
  const e = canon(email);
  await env.DB.prepare('UPDATE ent SET paid_until = NULL, plan = NULL, updated = ?3 WHERE email = ?1 AND app = ?2').bind(e, app, Date.now()).run();
  await audit(env, actor, 'revoke', e, app);
}

export async function adminList(env, { q = '', limit = 300 } = {}) {
  const like = '%' + String(q).toLowerCase().replace(/[%_]/g, '') + '%';
  const r = await env.DB.prepare('SELECT e.email, u.raw, e.app, e.trial_start, e.paid_until, e.plan, e.blocked, e.note, e.updated, u.last_login FROM ent e LEFT JOIN users u ON u.email = e.email WHERE e.email LIKE ?1 ORDER BY e.updated DESC LIMIT ?2').bind(like, limit).all();
  return r.results || [];
}
export async function adminAudit(env, n = 15) {
  return ((await env.DB.prepare('SELECT ts, actor, action, email, app, detail FROM audit ORDER BY id DESC LIMIT ?1').bind(n).all()).results) || [];
}
export async function adminCounts(env, apps, now = Date.now()) {
  const cfg = settings(env), rows = (await env.DB.prepare('SELECT * FROM ent').all()).results || [];
  const users = (await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first())?.n || 0;
  const by = { trial: 0, paid: 0, expired: 0, blocked: 0 };
  const all = new Map(rows.filter((r) => r.app === ALL).map((r) => [r.email, r]));
  for (const r of rows) if (r.app !== ALL) { const s = statusOf(r, all.get(r.email), now, cfg).st; if (s in by) by[s]++; }
  return { users, ...by, apps: apps.length };
}

// Limity dzienne: zwraca { ok, n, limit }. Zlicza także odrzucone wywołania (nie da się ich „odzyskać” ponawianiem).
export async function bump(env, email, kind, tier, now = Date.now()) {
  let tab = QUOTA;
  if (env.QUOTAS) { try { tab = { ...QUOTA, ...JSON.parse(env.QUOTAS) }; } catch { /* zostają domyślne */ } }
  const lim = tab[kind]; if (!lim) return { ok: true, n: 0, limit: Infinity };
  const limit = tier === 'paid' ? lim[1] : lim[0], day = new Date(now).toISOString().slice(0, 10);
  const r = await env.DB.prepare('INSERT INTO usage (email, day, kind, n) VALUES (?1, ?2, ?3, 1) ON CONFLICT(email, day, kind) DO UPDATE SET n = n + 1 RETURNING n').bind(email, day, kind).first();
  return { ok: (r?.n || 1) <= limit, n: r?.n || 1, limit };
}

// Proste okno czasowe dla ograniczeń (logowanie): zwraca liczbę wywołań w oknie.
export async function hit(env, key, windowMs, now = Date.now()) {
  const r = await env.DB.prepare('INSERT INTO rl (k, n, t) VALUES (?1, 1, ?2) ON CONFLICT(k) DO UPDATE SET n = CASE WHEN ?2 - t > ?3 THEN 1 ELSE n + 1 END, t = CASE WHEN ?2 - t > ?3 THEN ?2 ELSE t END RETURNING n').bind(key, now, windowMs).first();
  return r?.n || 1;
}
