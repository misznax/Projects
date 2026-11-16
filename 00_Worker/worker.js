// Worker "projects": jedna usługa dla wszystkich aplikacji z repo (foldery NN_*) + portal z logowaniem i dostępem.
// Adres -> aplikacja: apps.json (host) albo ścieżka /NN/. Dostęp: konto = e-mail (logowanie linkiem z poczty albo Cloudflare Access),
// na każdą aplikację próba (TRIAL_DAYS dni od pierwszego wejścia) lub abonament nadany przez właściciela (/admin).
// API wspólne: /api/transcript, /api/ask, /api/n/* (Notatnik), /api/state/<app>, /api/me, /api/stats. Limity dzienne: access.js (QUOTA).
import APPS from './apps.json';
import CATALOG from './catalog.json';
import * as AX from './access.js';
import * as AU from './auth.js';
import * as PG from './pages.js';

const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const HTML = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'content-security-policy': PG.CSP, 'x-content-type-options': 'nosniff', 'x-robots-tag': 'noindex', 'referrer-policy': 'same-origin' } });
const GO = (loc, cookie) => { const h = new Headers({ location: loc, 'cache-control': 'no-store' }); if (cookie) h.append('set-cookie', cookie); return new Response(null, { status: 303, headers: h }); };

// ── Transkrypcja YouTube (bez kluczy) ──
const UA_APP = 'com.google.android.youtube/20.10.38 (Linux; U; Android 14) gzip';
const dec = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const CLIENTS = [
  { ua: UA_APP, c: { clientName: 'ANDROID', clientVersion: '20.10.38', androidSdkVersion: 34 } },
  { ua: 'com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)', c: { clientName: 'IOS', clientVersion: '20.10.4', deviceMake: 'Apple', deviceModel: 'iPhone16,2', osName: 'iPhone', osVersion: '18.3.2.22D82' } },
  { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', c: { clientName: 'WEB_EMBEDDED_PLAYER', clientVersion: '1.20250101.00.00' }, embed: true },
  { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36', c: { clientName: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER', clientVersion: '2.0' }, embed: true },
];
async function tracksViaPlayer(id, why) {
  for (const k of CLIENTS) {
    try {
      const ctx = { client: { ...k.c, hl: 'pl', gl: 'PL' } };
      if (k.embed) ctx.thirdParty = { embedUrl: 'https://www.youtube.com/watch?v=' + id };
      const r = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
        method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': k.ua, 'accept-language': 'pl-PL,pl;q=0.9' },
        body: JSON.stringify({ context: ctx, videoId: id, contentCheckOk: true, racyCheckOk: true }),
      });
      if (!r.ok) { why.push(k.c.clientName + ' HTTP ' + r.status); continue; }
      const j = await r.json();
      const t = j?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (t?.length) return t;
      const ps = j?.playabilityStatus;
      why.push(k.c.clientName + ': ' + (ps?.status || '?') + (ps?.reason ? ' – ' + ps.reason : '') + (ps && !t ? ' (brak ścieżek napisów)' : ''));
    } catch (e) { why.push(k.c.clientName + ' ' + String(e.message || e).slice(0, 60)); }
  }
  return null;
}
async function tracksViaWatch(id, why) {
  const r = await fetch('https://www.youtube.com/watch?v=' + id + '&hl=pl', { headers: { 'accept-language': 'pl-PL,pl;q=0.9', cookie: 'CONSENT=YES+1; SOCS=CAI', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' } });
  if (!r.ok) { why.push('WATCH HTTP ' + r.status); return null; }
  const m = (await r.text()).match(/"captionTracks":(\[.*?\]),"audioTracks"/s) || [];
  try { return m[1] ? JSON.parse(m[1]) : null; } catch { return null; }
}
const pick = (t) => t.find((x) => x.languageCode === 'pl' && x.kind !== 'asr') || t.find((x) => x.languageCode === 'pl') || t.find((x) => x.kind !== 'asr') || t[0];

export function parseCaptions(body) {
  body = body.trim();
  let parts = [], end = 0;
  if (body.startsWith('{')) {
    for (const e of JSON.parse(body).events || []) {
      if (!e.segs) continue;
      const t = e.segs.map((g) => g.utf8 || '').join('').replace(/\n/g, ' ').trim();
      if (t) parts.push(t);
      end = Math.max(end, ((e.tStartMs || 0) + (e.dDurationMs || 0)) / 1000);
    }
  } else {
    for (const m of body.matchAll(/<text start="([\d.]+)"(?: dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g)) {
      const t = dec(dec(m[3])).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (t) parts.push(t);
      end = Math.max(end, +m[1] + +(m[2] || 0));
    }
  }
  return { text: parts.join(' ').replace(/\s+/g, ' ').trim(), dur: Math.round(end) };
}

async function transcript(id) {
  const why = [];
  let tracks = await tracksViaPlayer(id, why);
  if (!tracks?.length) { try { tracks = await tracksViaWatch(id, why); } catch (e) { why.push('WATCH ' + String(e.message || e).slice(0, 60)); } }
  if (!tracks?.length) return { code: 'no_captions', detail: why.join(' | ') || 'brak ścieżek napisów' };
  const t = pick(tracks), base = t.baseUrl.replace(/&fmt=[^&]*/, '');
  for (const u of [base + '&fmt=json3', base]) {
    try {
      const r = await fetch(u, { headers: { 'user-agent': UA_APP, 'accept-language': 'pl-PL,pl;q=0.9' } });
      if (!r.ok) continue;
      const body = await r.text();
      if (!body) continue;
      const p = parseCaptions(body);
      if (p.text.length >= 40) return { ...p, lang: t.languageCode + (t.kind === 'asr' ? ' (auto)' : '') };
    } catch {}
  }
  return { code: 'no_mcp', detail: 'ścieżka napisów jest, ale YouTube zwrócił pustą treść (blokada serwera)' };
}

// ── Streszczanie: Claude (gdy jest ANTHROPIC_API_KEY), inaczej Workers AI ──
function sse(stream, pick) {
  const rd = stream.getReader(), td = new TextDecoder(), te = new TextEncoder();
  let buf = '';
  return new ReadableStream({
    async pull(ctrl) {
      for (;;) {
        const { done, value } = await rd.read();
        if (done) { ctrl.close(); return; }
        buf += td.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop();
        let out = '';
        for (const l of lines) {
          if (!l.startsWith('data:')) continue;
          const d = l.slice(5).trim();
          if (!d || d === '[DONE]') continue;
          try { out += pick(JSON.parse(d)) || ''; } catch {}
        }
        if (out) { ctrl.enqueue(te.encode(out)); return; }
      }
    },
    cancel() { rd.cancel(); },
  });
}
async function ask(request, env) {
  let d; try { d = await request.json(); } catch { return J({ code: 'bad' }, 400); }
  const prompt = String(d.prompt || '');
  if (prompt.length < 20 || prompt.length > 200000) return J({ code: 'bad' }, 400);
  const head = { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' };
  if (env.ANTHROPIC_API_KEY) {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: d.tier === 'quick' ? (env.MODEL_QUICK || 'claude-haiku-5-5') : (env.MODEL || 'claude-sonnet-5-5'), max_tokens: 4096, stream: true, messages: [{ role: 'user', content: prompt }] }),
    });
    if (!r.ok) return J({ code: 'upstream', status: r.status }, 502);
    return new Response(sse(r.body, (j) => j.type === 'content_block_delta' && j.delta?.text), { headers: head });
  }
  if (env.AI) {
    const s = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', { messages: [{ role: 'user', content: prompt }], stream: true, max_tokens: 2048 });
    return new Response(sse(s, (j) => j.response), { headers: head });
  }
  return J({ code: 'no_sample' }, 501);
}

const hostApp = (host) => { const k = host.split('.')[0]; return Object.hasOwn(APPS, k) ? APPS[k] : undefined; };
const byNn = (nn) => CATALOG.find((a) => a.nn === nn);

// Adres aplikacji: na własnej domenie podadres (nawyk.smialo.org), poza nią (workers.dev, localhost) ścieżka /NN/.
const baseDomain = (host) => { const p = host.split('.'); return p.length >= 3 && !host.endsWith('.workers.dev') ? p.slice(-2).join('.') : ''; };
const appUrl = (url, a) => { const b = baseDomain(url.hostname); return b ? `https://${a.sub}.${b}/` : `/${a.nn}/`; };
const orderUrl = (a) => `${PG.ORDER}?app=${encodeURIComponent(a.id)}`;
const wantsHtml = (r) => r.method === 'GET' && /text\/html/.test(r.headers.get('accept') || '');
const sameOrigin = (r, url) => { const o = r.headers.get('origin'); return o ? o === url.origin : r.headers.get('sec-fetch-site') === 'same-origin'; };

async function ipHash(request, env) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode((request.headers.get('cf-connecting-ip') || '?') + '|' + (env.STATS_SALT || 'projects')));
  return [...new Uint8Array(d)].slice(0, 10).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Licznik odwiedzin: unikalne adresy IP (tylko hash SHA-256 z solą, bez surowego IP), per aplikacja ──
async function track(request, env, app) {
  if (!env.DB) return;
  const ua = request.headers.get('user-agent') || '';
  if (/bot|crawl|spider|uptime|monitor|curl|wget|preview/i.test(ua)) return;
  const ip = request.headers.get('cf-connecting-ip') || '';
  if (!ip) return;
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + '|' + (env.STATS_SALT || 'projects')));
  const h = [...new Uint8Array(d)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
  const now = Date.now();
  await env.DB.prepare('INSERT INTO visits (h, app, first_ts, last_ts, n, country) VALUES (?1, ?2, ?3, ?3, 1, ?4) ON CONFLICT(h, app) DO UPDATE SET last_ts = ?3, n = n + 1').bind(h, app, now, request.cf?.country || null).run();
}
async function stats(env) {
  const a = await env.DB.prepare('SELECT app, COUNT(*) AS unique_ip, SUM(n) AS views, MAX(last_ts) AS last FROM visits GROUP BY app ORDER BY app').all();
  const c = await env.DB.prepare('SELECT app, country, COUNT(*) AS ip FROM visits GROUP BY app, country ORDER BY ip DESC LIMIT 30').all();
  return { apps: a.results, countries: c.results };
}

// ── Zapis stanu aplikacji w chmurze (np. Nawyk): D1, klucz = kanoniczny e-mail zalogowanego + nazwa aplikacji ──
async function appState(request, env, app, u) {
  if (request.method === 'GET') {
    const r = await env.DB.prepare('SELECT t, data FROM app_state WHERE u = ?1 AND app = ?2').bind(u, app).first();
    return J({ ok: true, data: r ? JSON.parse(r.data) : null });
  }
  if (request.method === 'PUT') {
    if (+(request.headers.get('content-length') || 0) > 4e5) return J({ code: 'too_big' }, 413);
    let b; try { b = await request.json(); } catch { return J({ code: 'bad' }, 400); }
    if (!b || typeof b !== 'object' || Array.isArray(b)) return J({ code: 'bad' }, 400);
    const data = JSON.stringify(b);
    if (data.length > 4e5) return J({ code: 'too_big' }, 413);
    await env.DB.prepare('INSERT INTO app_state (u, app, t, data) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(u, app) DO UPDATE SET t = ?3, data = ?4').bind(u, app, Math.floor(+b.t || Date.now()), data).run();
    return J({ ok: true });
  }
  return J({ code: 'method' }, 405);
}

// ── 04 Notatnik Słuchacza: proxy do OpenAI (transkrypcja + mówcy) i Claude (notatki, autorzy, weryfikacja); klucze tylko jako sekrety Workera ──
async function notatnikStt(request, env) {
  if (+(request.headers.get('content-length') || 0) > 8e6) return J({ code: 'too_big' }, 413);
  if (!env.OPENAI_API_KEY) { // bez klucza OpenAI: Whisper z Workers AI (bez rozpoznawania mówców)
    if (!env.AI) return J({ code: 'no_key' }, 501);
    const f = (await request.formData()).get('file');
    if (!f) return J({ code: 'bad' }, 400);
    const u8 = new Uint8Array(await f.arrayBuffer()); let bin = ''; for (let i = 0; i < u8.length; i += 8192) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
    const o = await env.AI.run('@cf/openai/whisper-large-v3-turbo', { audio: btoa(bin), language: 'pl' });
    const segs = (o.segments || []).map((s) => ({ speaker: 'A', start: s.start, end: s.end, text: s.text }));
    return J({ segments: segs.length ? segs : [{ speaker: 'A', start: 0, end: 30, text: o.text || '' }] });
  }
  const r = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { Authorization: 'Bearer ' + env.OPENAI_API_KEY, 'content-type': request.headers.get('content-type') || '' }, body: request.body });
  return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
async function notatnikClaude(request, env) {
  if (!env.ANTHROPIC_API_KEY) return J({ code: 'no_key' }, 501);
  let b; try { b = await request.json(); } catch { return J({ code: 'bad' }, 400); }
  const models = ['claude-haiku-5-5', 'claude-sonnet-5-5'];
  const body = { model: models.includes(b.model) ? b.model : models[0], max_tokens: Math.min(+b.max_tokens || 1800, 3000), system: String(b.system || '').slice(0, 2000), messages: Array.isArray(b.messages) ? b.messages.slice(0, 1) : [] };
  if (b.tools) body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }];
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}

// Które API należy do której aplikacji i jaki limit dzienny je obejmuje.
const API_MAP = [
  [/^\/api\/transcript$/, '03', 'transcript'],
  [/^\/api\/ask$/, '03', 'ask'],
  [/^\/api\/n\/stt$/, '04', 'stt'],
  [/^\/api\/n\/claude$/, '04', 'claude'],
  [/^\/api\/n\/status$/, '04', null],
];

// Czy ta osoba ma teraz dostęp do aplikacji nn? Zwraca { ok, s, owner, tier }.
async function access(env, id, nn) {
  if (AU.isOwner(env, id.key)) return { ok: true, owner: true, tier: 'paid', s: { st: 'paid', owner: true } };
  return AX.memoPos(env, 'acc|' + id.key + '|' + nn, async () => {
    const s = await AX.statusFor(env, id.key, nn);
    const ok = s.st === 'trial' || s.st === 'paid' || AX.settings(env).gateOff;
    return { ok, s, tier: s.st === 'paid' ? 'paid' : 'trial' };
  });
}

async function api(request, env, url, id) {
  const p = url.pathname, owner = AU.isOwner(env, id.key);
  if (request.method !== 'GET' && request.method !== 'HEAD' && !sameOrigin(request, url)) return J({ code: 'bad_origin' }, 403);
  if (p === '/api/me') {
    const st = await AX.statusesFor(env, id.key, CATALOG);
    return J({ email: id.email, owner, apps: CATALOG.map((a) => ({ id: a.id, nn: a.nn, ...(owner ? { st: 'paid', owner: true } : st[a.nn]) })) });
  }
  if (p === '/api/stats') return owner ? J(await stats(env)) : J({ code: 'forbidden' }, 403);
  let nn, kind;
  const sm = p.match(/^\/api\/state\/([a-z0-9_-]+)$/);
  if (sm) {
    const a = CATALOG.find((x) => x.id === sm[1] && x.state);
    if (!a) return J({ code: 'not_found' }, 404);
    nn = a.nn; kind = request.method === 'PUT' ? 'state' : null;
  } else {
    const m = API_MAP.find((x) => x[0].test(p));
    if (!m) return J({ code: 'not_found' }, 404);
    [, nn, kind] = m;
  }
  const g = await access(env, id, nn);
  if (!g.ok) return J({ code: 'no_access', st: g.s.st }, 403);
  if (kind && !g.owner) {
    const q = await AX.bump(env, id.key, kind, g.tier);
    if (!q.ok) return J({ code: 'quota', limit: q.limit, n: q.n }, 429);
  }
  if (sm) return appState(request, env, sm[1], id.key);
  if (p === '/api/transcript') {
    const vid = url.searchParams.get('id') || '';
    if (!/^[\w-]{11}$/.test(vid)) return J({ code: 'bad' }, 400);
    const t = await transcript(vid);
    return t.code ? J(t, t.code === 'no_captions' ? 404 : 502) : J(t);
  }
  if (p === '/api/n/status') return J({ stt: !!(env.OPENAI_API_KEY || env.AI), diar: !!env.OPENAI_API_KEY, claude: !!env.ANTHROPIC_API_KEY });
  if (p === '/api/n/stt' && request.method === 'POST') return notatnikStt(request, env);
  if (p === '/api/n/claude' && request.method === 'POST') return notatnikClaude(request, env);
  if (p === '/api/ask' && request.method === 'POST') return ask(request, env);
  return J({ code: 'method' }, 405);
}

// ── Logowanie ──
async function authRoutes(request, env, url, id, apps) {
  const p = url.pathname, host = url.hostname, cfg = AX.settings(env);
  const page = (fn, o = {}, st = 200) => HTML(fn({ apps, cfg, host, ...o }), st);
  if (p === '/auth/login' && request.method === 'GET') {
    const next = AU.safeNext(url.searchParams.get('next') || '/');
    if (id) return GO(next);
    return page(PG.loginPage, { next, email: url.searchParams.get('e') || '' });
  }
  if (p === '/auth/login' && request.method === 'POST') {
    if (!sameOrigin(request, url)) return HTML('Niedozwolone żądanie.', 403);
    const f = await request.formData(), email = String(f.get('email') || '').trim(), next = AU.safeNext(String(f.get('next') || '/'));
    if (!AX.isEmail(email)) return page(PG.loginPage, { next, email, error: 'Podaj poprawny adres e-mail.' }, 400);
    if (!AU.mailReady(env)) return page(PG.loginPage, { next, email, error: 'Logowanie nie jest jeszcze włączone. Napisz do nas, a wpuścimy Cię ręcznie.' }, 503);
    const day = new Date().toISOString().slice(0, 10);
    const [okAddr, okDay] = [await AU.loginAllowed(env, email, await ipHash(request, env)), (await AX.hit(env, 'ld:' + day, 864e5)) <= (+env.MAIL_DAILY || 300)];
    if (!okAddr || !okDay) return page(PG.loginPage, { next, email, error: 'Za dużo prób logowania. Spróbuj za godzinę.' }, 429);
    try {
      const link = await AU.issueLink(env, url, email, await ipHash(request, env), next);
      await AU.sendLoginMail(env, email, link);
    } catch (e) {
      console.error('mail', String(e?.message || e));
      return page(PG.loginPage, { next, email, error: 'Nie udało się wysłać wiadomości. Spróbuj za chwilę.' }, 502);
    }
    return page(PG.sentPage, { email });
  }
  if (p === '/auth/verify' && request.method === 'GET') {
    const t = url.searchParams.get('t') || '', r = await AU.peekToken(env, t);
    return r ? page(PG.confirmPage, { masked: AU.maskEmail(r.raw || r.email), token: t }) : page(PG.badLinkPage, {}, 400);
  }
  if (p === '/auth/verify' && request.method === 'POST') {
    if (!sameOrigin(request, url)) return HTML('Niedozwolone żądanie.', 403);
    const r = await AU.consumeToken(env, String((await request.formData()).get('t') || ''));
    if (!r) return page(PG.badLinkPage, {}, 400);
    if ((await AX.getRows(env, r.email, AX.ALL)).all?.blocked) return page(PG.badLinkPage, { why: 'To konto jest wstrzymane. Napisz do nas.' }, 403);
    return GO(AU.safeNext(r.next), await AU.createSession(env, url, r.raw || r.email, request.headers.get('user-agent') || ''));
  }
  if (p === '/auth/logout' && request.method === 'POST') {
    if (!sameOrigin(request, url)) return HTML('Niedozwolone żądanie.', 403);
    await AU.endSession(request, env);
    return GO('/', AU.clearCookie(url, env));
  }
  return null;
}

// ── Administracja (tylko OWNER_EMAILS) ──
const FLASH = { grant: 'Nadano dostęp.', block: 'Zablokowano.', unblock: 'Odblokowano.', reset_trial: 'Wyzerowano próbę.', revoke: 'Cofnięto abonament.' };
const FERR = { bad_email: 'Niepoprawny e-mail.', bad_app: 'Nieznana aplikacja.', bad_period: 'Podaj okres albo datę końca w przyszłości.', bad: 'Nieznana operacja.' };
async function adminRoutes(request, env, url, id, apps) {
  const cfg = AX.settings(env), now = Date.now();
  if (url.pathname === '/admin' && request.method === 'GET') {
    const q = (url.searchParams.get('q') || '').trim().slice(0, 80), f = url.searchParams.get('f'), x = url.searchParams.get('x');
    const rows = await AX.adminList(env, { q }), allRows = new Map(rows.filter((r) => r.app === AX.ALL).map((r) => [r.email, r]));
    for (const r of rows) r.s = AX.statusOf(r, r.app === AX.ALL ? r : allRows.get(r.email), now, cfg);
    return HTML(PG.adminPage({ user: id, apps, cfg, host: url.hostname, counts: await AX.adminCounts(env, apps, now), rows, q, log: await AX.adminAudit(env, 15), flash: FERR[x] ? { err: true, text: FERR[x] } : FLASH[f] ? { text: FLASH[f] } : null }));
  }
  if (url.pathname === '/admin/act' && request.method === 'POST') {
    if (!sameOrigin(request, url)) return HTML('Niedozwolone żądanie.', 403);
    const f = await request.formData(), g = (k) => String(f.get(k) || '').trim(), act = g('do'), email = g('email'), app = g('app') || AX.ALL;
    const fail = (x) => GO('/admin?x=' + x);
    if (!AX.isEmail(email)) return fail('bad_email');
    if (app !== AX.ALL && !byNn(app)) return fail('bad_app');
    try {
      if (act === 'grant') {
        const until = g('until') ? Date.parse(g('until') + 'T23:59:59+01:00') : 0;
        if (g('until') && !(until > now)) return fail('bad_period');
        await AX.grant(env, id.key, { email, app, months: until ? 0 : +g('months'), until, note: g('note') || null });
      } else if (act === 'block' || act === 'unblock') await AX.setBlocked(env, id.key, email, app, act === 'block');
      else if (act === 'reset_trial') await AX.resetTrial(env, id.key, email, app);
      else if (act === 'revoke') await AX.revoke(env, id.key, email, app);
      else return fail('bad');
    } catch (e) { return fail(FERR[e.message] ? e.message : 'bad'); }
    return GO('/admin?f=' + act);
  }
  return null;
}

const CHIP = (txt, href) => `<a id="pw-chip" href="${PG.esc(href)}" style="position:fixed;left:12px;bottom:12px;z-index:2147483000;font:600 12px/1 system-ui,sans-serif;background:#06262D;color:#fff;padding:9px 13px;border-radius:999px;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:.93">${PG.esc(txt)}</a>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url), p = url.pathname;
    if (p.startsWith('/_p/')) { // czcionki i ikony portalu: publiczne, długo w pamięci podręcznej
      const r = await env.ASSETS.fetch(new Request(url, request)), h = new Headers(r.headers);
      if (r.ok) h.set('cache-control', 'public, max-age=86400');
      return new Response(r.body, { status: r.status, headers: h });
    }
    if (!env.DB) return new Response('Brak konfiguracji bazy (DB).', { status: 503 });
    await AX.ensureSchema(env);
    const cfg = AX.settings(env);
    const hostA = hostApp(url.hostname), pm = p.match(/^\/(\d\d)(\/.*)?$/);
    const target = hostA ? byNn(hostA) : pm ? byNn(pm[1]) : null;
    const id = await AU.identify(request, env);

    if (p.startsWith('/auth/')) { const r = await authRoutes(request, env, url, id, CATALOG); if (r) return r; return HTML('Nie ma takiej strony.', 404); }

    // Wszystko poniżej wymaga zalogowania.
    const toLogin = () => {
      if (p.startsWith('/api/')) return J({ code: 'unauthorized' }, 401);
      if (request.method === 'GET' && (wantsHtml(request) || p === '/' || /^\/\d\d\/?$/.test(p))) return GO('/auth/login?next=' + encodeURIComponent(AU.safeNext(p + url.search)));
      return new Response('Zaloguj się.', { status: 401 });
    };

    if (p.startsWith('/api/')) return id ? api(request, env, url, id) : toLogin();

    if (p === '/admin' || p === '/admin/act') {
      if (!id) return toLogin();
      if (!AU.isOwner(env, id.key)) return HTML('Nie ma takiej strony.', 404);
      return adminRoutes(request, env, url, id, CATALOG);
    }

    if (p === '/trial' && request.method === 'POST') {
      if (!id) return toLogin();
      if (!sameOrigin(request, url)) return HTML('Niedozwolone żądanie.', 403);
      const a = byNn(String((await request.formData()).get('app') || ''));
      if (!a) return GO('/');
      if (!AU.isOwner(env, id.key)) { const s = await AX.statusFor(env, id.key, a.nn); if (s.st === 'new') { await AX.startTrial(env, id.key, a.nn); await AX.audit(env, id.key, 'trial', id.key, a.nn); } }
      return GO(appUrl(url, a));
    }

    if (target) {
      if (!id) return toLogin();
      const g = await access(env, id, target.nn);
      if (!g.ok) {
        if (wantsHtml(request) || p === '/' || /^\/\d\d\/?$/.test(p)) return HTML(PG.lockPage({ user: id, app: target, s: g.s, cfg, order: orderUrl(target), host: url.hostname, apps: CATALOG }), 403);
        return J({ code: 'no_access', st: g.s.st }, 403);
      }
      const isPage = hostA ? (p === '/' || p === '/index.html') : /^\/\d\d(\/|\/index\.html)?$/.test(p);
      if (isPage && request.method === 'GET') ctx.waitUntil(track(request, env, target.nn).catch(() => {}));
      if (hostA) url.pathname = '/' + target.nn + (p === '/' ? '/' : p);
      let r = await env.ASSETS.fetch(new Request(url, request));
      const h = new Headers(r.headers); h.set('cache-control', 'private, no-cache');
      r = new Response(r.body, { status: r.status, statusText: r.statusText, headers: h });
      const chip = !g.owner && (g.s.st === 'trial' || (g.s.st === 'paid' && g.s.daysLeft <= 7)) && /text\/html/.test(h.get('content-type') || '');
      if (chip) {
        const t = PG.stateText(g.s, cfg).label + ' · Wykup dostęp';
        return new HTMLRewriter().on('body', { element(e) { e.append(CHIP(t, orderUrl(target)), { html: true }); } }).transform(r);
      }
      return r;
    }

    // Portal: panel albo ekran logowania.
    if (p === '/' || p === '/index.html') {
      if (!id) return HTML(PG.loginPage({ apps: CATALOG, cfg, next: '/', host: url.hostname }));
      const owner = AU.isOwner(env, id.key), st = owner ? null : await AX.statusesFor(env, id.key, CATALOG);
      const apps = CATALOG.map((a) => ({ ...a, s: owner ? { st: 'paid', owner: true } : st[a.nn], url: appUrl(url, a), order: orderUrl(a) }));
      return HTML(PG.dashboardPage({ user: id, owner, apps, cfg, host: url.hostname }));
    }
    return HTML('Nie ma takiej strony.', 404);
  },
};
