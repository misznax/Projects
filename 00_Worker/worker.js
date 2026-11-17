// Worker "projects": jedna usługa dla wszystkich aplikacji z repo (foldery NN_*).
// Adres -> aplikacja: apps.json (host) albo ścieżka /NN/. API wspólne: /api/transcript, /api/ask, /api/n/* (Notatnik).
// Dostęp: Cloudflare Access przed Workerem; /api/* dodatkowo sprawdza token Access (zmienna ACCESS_TEAM).
import APPS from './apps.json';

const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const b64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

// ── Cloudflare Access: weryfikacja tokena (gdy ustawiono ACCESS_TEAM, np. "moje.cloudflareaccess.com") ──
let certs = null;
async function accessOk(request, env) {
  const url = new URL(request.url);
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true;
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return request.headers.get('Sec-Fetch-Site') === 'same-origin'; // wywołanie z własnej strony (Access chroni cały adres)
  if (!env.ACCESS_TEAM) return true; // bez zmiennej: wystarcza obecność nagłówka (Access jest przed Workerem)
  try {
    const [h, p, s] = jwt.split('.');
    const head = JSON.parse(new TextDecoder().decode(b64u(h))), pay = JSON.parse(new TextDecoder().decode(b64u(p)));
    if (!pay.exp || pay.exp * 1000 < Date.now()) return false;
    if (env.ACCESS_AUD && ![].concat(pay.aud).includes(env.ACCESS_AUD)) return false;
    if (!certs || certs.t < Date.now() - 36e5) certs = { t: Date.now(), keys: (await (await fetch(`https://${env.ACCESS_TEAM}/cdn-cgi/access/certs`)).json()).keys };
    const jwk = certs.keys.find((k) => k.kid === head.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(s), new TextEncoder().encode(h + '.' + p));
  } catch { return false; }
}

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

const hostApp = (host) => APPS[host.split('.')[0]];

// ── Licznik odwiedzin: unikalne adresy IP (tylko hash SHA-256 z solą, bez surowego IP), per aplikacja ──
const PUBLIC_UNTIL = { anatomia: '2026-12-31T23:59:59+01:00' }; // adres publiczny działa do tej daty, potem 410
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
  if (!env.DB) return { code: 'no_db' };
  const a = await env.DB.prepare('SELECT app, COUNT(*) AS unique_ip, SUM(n) AS views, MAX(last_ts) AS last FROM visits GROUP BY app ORDER BY app').all();
  const c = await env.DB.prepare('SELECT app, country, COUNT(*) AS ip FROM visits GROUP BY app, country ORDER BY ip DESC LIMIT 30').all();
  return { apps: a.results, countries: c.results };
}

// ── Zapis stanu aplikacji w chmurze (np. Nawyk): D1. Tożsamość: e-mail z Cloudflare Access, a bez Access — tajny klucz synchronizacji (nagłówek X-Sync-Key, w bazie tylko jego skrót) ──
const STATE_APPS = ['nawyk'];
let stateReady = false;
async function sha256hex(t) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function appState(request, env, app) {
  if (!env.DB) return J({ code: 'no_db' }, 501);
  if (!STATE_APPS.includes(app)) return J({ code: 'not_found' }, 404);
  let u = (request.headers.get('Cf-Access-Authenticated-User-Email') || '').trim().toLowerCase().slice(0, 120);
  if (!u) {
    const k = request.headers.get('X-Sync-Key') || '';
    if (!/^[A-Za-z0-9_-]{24,64}$/.test(k)) return J({ code: 'no_user' }, 401); // bez e-maila i bez poprawnego klucza nic nie zapisujemy ani nie oddajemy
    u = 'k:' + await sha256hex(k);
  }
  if (!stateReady) {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS app_state (u TEXT NOT NULL, app TEXT NOT NULL, t INTEGER NOT NULL, data TEXT NOT NULL, PRIMARY KEY (u, app))').run();
    stateReady = true;
  }
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
    const ex = await env.DB.prepare('SELECT 1 AS x FROM app_state WHERE u = ?1 AND app = ?2').bind(u, app).first();
    if (!ex) {
      const c = await env.DB.prepare('SELECT COUNT(*) AS n FROM app_state').first();
      if (c && c.n >= 3000) return J({ code: 'full' }, 507); // bezpiecznik przed zaśmieceniem bazy
    }
    await env.DB.prepare('INSERT INTO app_state (u, app, t, data) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(u, app) DO UPDATE SET t = ?3, data = ?4').bind(u, app, Math.floor(+b.t || Date.now()), data).run();
    return J({ ok: true });
  }
  return J({ code: 'method' }, 405);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      if (!(await accessOk(request, env))) return J({ code: 'forbidden' }, 403);
      if (url.pathname === '/api/transcript') {
        const id = url.searchParams.get('id') || '';
        if (!/^[\w-]{11}$/.test(id)) return J({ code: 'bad' }, 400);
        const t = await transcript(id);
        return t.code ? J(t, t.code === 'no_captions' ? 404 : 502) : J(t);
      }
      if (url.pathname === '/api/stats') return J(await stats(env));
      const sm = url.pathname.match(/^\/api\/state\/([a-z0-9_-]+)$/);
      if (sm) return appState(request, env, sm[1]);
      if (url.pathname === '/api/n/status') return J({ stt: !!(env.OPENAI_API_KEY || env.AI), diar: !!env.OPENAI_API_KEY, claude: !!env.ANTHROPIC_API_KEY });
      // 04 Notatnik Słuchacza: proxy do OpenAI (transkrypcja + mówcy) i Claude (notatki, autorzy, weryfikacja); klucze tylko jako sekrety Workera
      if (url.pathname === '/api/n/stt' && request.method === 'POST') {
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
      if (url.pathname === '/api/n/claude' && request.method === 'POST') {
        if (!env.ANTHROPIC_API_KEY) return J({ code: 'no_key' }, 501);
        let b; try { b = await request.json(); } catch { return J({ code: 'bad' }, 400); }
        const models = ['claude-haiku-5-5', 'claude-sonnet-5-5'];
        const body = { model: models.includes(b.model) ? b.model : models[0], max_tokens: Math.min(+b.max_tokens || 1800, 3000), system: String(b.system || '').slice(0, 2000), messages: Array.isArray(b.messages) ? b.messages.slice(0, 1) : [] };
        if (b.tools) body.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }];
        const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify(body) });
        return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
      }
      if (url.pathname === '/api/ask' && request.method === 'POST') return ask(request, env);
      return J({ code: 'not_found' }, 404);
    }
    const nn = hostApp(url.hostname);
    const exp = PUBLIC_UNTIL[url.hostname.split('.')[0]];
    if (nn && exp && Date.now() > Date.parse(exp)) return new Response('Ten tymczasowy adres wygasł.', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8' } });
    const pm = url.pathname.match(/^\/(\d\d)(\/|\/index\.html)?$/);
    const page = nn ? (url.pathname === '/' || url.pathname === '/index.html') : !!pm;
    if (page && request.method === 'GET' && env.DB) ctx.waitUntil(track(request, env, nn || pm[1]).catch(() => {}));
    if (nn) url.pathname = '/' + nn + (url.pathname === '/' ? '/' : url.pathname);
    return env.ASSETS.fetch(new Request(url, request));
  },
};
