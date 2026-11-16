// Podgląd lokalny portalu (bez Cloudflare): node --import ./test/register.mjs test/preview.mjs [port]
// Zmienne: DEV_EMAIL (wymusza tożsamość na localhost), OWNER_EMAILS. Maile z linkami trafiają na konsolę.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from '../worker.js';
import * as AX from '../access.js';
import { makeDB, installRewriter } from './helpers.mjs';
installRewriter();
const dist = fileURLToPath(new URL('../dist', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.js': 'text/javascript', '.css': 'text/css' };
const env = {
  DB: makeDB(), SESSION_SECRET: 'preview-secret-preview-secret-12345', MAIL_FROM: 'logowanie@smialo.org', OWNER_EMAILS: process.env.OWNER_EMAILS || 'owner@example.com', DEV_EMAIL: process.env.DEV_EMAIL || '', CACHE_TTL: '0',
  EMAIL: { send: async (m) => { console.log('MAIL →', m.to, m.text.match(/https?:\/\/\S+/)[0]); return { messageId: 'x' }; } },
  ASSETS: { fetch: async (req) => {
    let p = normalize(decodeURIComponent(new URL(req.url).pathname)).replace(/^(\.\.[/\\])+/, '');
    let f = join(dist, p); try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch { return new Response('nie ma', { status: 404 }); }
    try { return new Response(await readFile(f), { headers: { 'content-type': TYPES[extname(f)] || 'application/octet-stream' } }); } catch { return new Response('nie ma', { status: 404 }); }
  } },
};
const port = +process.argv[2] || 8795;
if (process.env.SEED) { // przykładowe stany: próba, abonament, wygasła, nowa
  await AX.ensureSchema(env); const D = AX.DAY, now = Date.now(), u = AX.canon(process.env.SEED);
  const ins = (app, ts, pd) => env.DB.raw.prepare('INSERT INTO ent (email, app, trial_start, paid_until, plan, created, updated) VALUES (?,?,?,?,?,?,?)').run(u, app, ts, pd, pd ? '6 mies.' : null, now, now);
  ins('02', now - D, null); ins('03', null, now + 20 * D); ins('04', now - 9 * D, null);
  for (const [e, a, ts, pd] of [['jan@kowalski.pl', '02', now - 2 * D, null], ['anna@firma.pl', '*', null, now + 170 * D], ['piotr@poczta.pl', '05', now - 5 * D, null]]) env.DB.raw.prepare('INSERT INTO ent (email, app, trial_start, paid_until, plan, note, created, updated) VALUES (?,?,?,?,?,?,?,?)').run(e, a, ts, pd, pd ? '6 mies.' : null, pd ? 'faktura 11/2026' : null, now, now);
}
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const r = await worker.fetch(new Request('http://localhost:' + port + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks), redirect: 'manual' }), env, { waitUntil: (p) => p });
  const h = {}; r.headers.forEach((v, k) => { h[k] = v; }); const sc = r.headers.getSetCookie?.(); if (sc?.length) h['set-cookie'] = sc;
  res.writeHead(r.status, h); res.end(Buffer.from(await r.arrayBuffer()));
}).listen(port, () => console.log('podgląd: http://localhost:' + port));
