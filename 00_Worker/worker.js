// Worker "projects": jedna usługa dla wszystkich aplikacji z repo (foldery NN_*).
// Adres -> aplikacja: apps.json (host) albo ścieżka /NN/. API wspólne: /api/transcript, /api/ask.
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
  if (!jwt) return false;
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

async function tracksViaPlayer(id) {
  const r = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST', headers: { 'content-type': 'application/json', 'user-agent': UA_APP, 'accept-language': 'pl-PL,pl;q=0.9' },
    body: JSON.stringify({ context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38', androidSdkVersion: 34, hl: 'pl', gl: 'PL' } }, videoId: id, contentCheckOk: true, racyCheckOk: true }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j?.captions?.playerCaptionsTracklistRenderer?.captionTracks || null;
}
async function tracksViaWatch(id) {
  const r = await fetch('https://www.youtube.com/watch?v=' + id + '&hl=pl', { headers: { 'accept-language': 'pl-PL,pl;q=0.9', cookie: 'CONSENT=YES+1; SOCS=CAI', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' } });
  if (!r.ok) return null;
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
  let tracks = null;
  try { tracks = await tracksViaPlayer(id); } catch {}
  if (!tracks?.length) { try { tracks = await tracksViaWatch(id); } catch {} }
  if (!tracks?.length) return { code: 'no_captions' };
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
  return { code: 'no_mcp' }; // napisy są, ale YouTube nie wydał treści temu serwerowi
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      if (!(await accessOk(request, env))) return J({ code: 'forbidden' }, 403);
      if (url.pathname === '/api/transcript') {
        const id = url.searchParams.get('id') || '';
        if (!/^[\w-]{11}$/.test(id)) return J({ code: 'bad' }, 400);
        const t = await transcript(id);
        return t.code ? J(t, t.code === 'no_captions' ? 404 : 502) : J(t);
      }
      if (url.pathname === '/api/ask' && request.method === 'POST') return ask(request, env);
      return J({ code: 'not_found' }, 404);
    }
    const nn = hostApp(url.hostname);
    if (nn) url.pathname = '/' + nn + (url.pathname === '/' ? '/' : url.pathname);
    return env.ASSETS.fetch(new Request(url, request));
  },
};
