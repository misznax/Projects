// Środowisko testowe: D1 na node:sqlite, atrapy ASSETS / EMAIL / HTMLRewriter.
import { DatabaseSync } from 'node:sqlite';

export function makeDB() {
  const db = new DatabaseSync(':memory:');
  const wrap = (sql, params = []) => ({
    bind: (...p) => wrap(sql, p),
    run: async () => { const r = db.prepare(sql).run(...params); return { success: true, meta: { changes: r.changes } }; },
    first: async () => db.prepare(sql).get(...params) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...params) }),
    _exec: () => db.prepare(sql).run(...params),
  });
  const d1 = {
    prepare: (sql) => wrap(sql),
    batch: async (stmts) => { for (const s of stmts) s._exec(); return []; },
    raw: db,
  };
  db.exec('CREATE TABLE visits (h TEXT, app TEXT, first_ts INTEGER, last_ts INTEGER, n INTEGER, country TEXT, PRIMARY KEY (h, app))');
  return d1;
}

// Prosta atrapa HTMLRewriter: obsługuje on('body', { element(e) { e.append(html, { html: true }) } }).
export function installRewriter() {
  globalThis.HTMLRewriter = class {
    constructor() { this.h = []; }
    on(sel, h) { this.h.push([sel, h]); return this; }
    transform(res) {
      const hs = this.h;
      const body = new ReadableStream({ async start(c) {
        const t = await res.text(), add = [];
        for (const [sel, h] of hs) if (sel === 'body') h.element?.({ append: (s) => add.push(s) });
        c.enqueue(new TextEncoder().encode(t.replace('</body>', add.join('') + '</body>'))); c.close();
      } });
      return new Response(body, { status: res.status, headers: res.headers });
    }
  };
}

export function makeEnv(over = {}) {
  const sent = [];
  const env = {
    DB: makeDB(),
    ASSETS: { fetch: async (req) => { const u = new URL(req.url); return u.pathname.startsWith('/_p/') ? new Response('x', { headers: { 'content-type': 'font/woff2' } }) : u.pathname.includes('missing') ? new Response('nie ma', { status: 404 }) : new Response(`<html><body>APP ${u.pathname}</body></html>`, { headers: { 'content-type': u.pathname.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8' } }); } },
    EMAIL: { send: async (m) => { sent.push(m); return { messageId: 'm' + sent.length }; } },
    SESSION_SECRET: 'test-secret-test-secret-test-secret', MAIL_FROM: 'logowanie@smialo.org', OWNER_EMAILS: 'owner@example.com', CACHE_TTL: '0',
    ...over,
  };
  env.sent = sent;
  return env;
}

export const ctx = { waitUntil: (p) => p };
export function mk(worker, env) {
  return async (path, { method = 'GET', host = 'projects.smialo.org', cookie = '', headers = {}, form, json, origin = true, accept = 'text/html' } = {}) => {
    const h = new Headers({ accept, ...headers });
    if (cookie) h.set('cookie', cookie);
    let body;
    if (form) { body = new URLSearchParams(form).toString(); h.set('content-type', 'application/x-www-form-urlencoded'); }
    if (json) { body = JSON.stringify(json); h.set('content-type', 'application/json'); }
    if (origin && method !== 'GET' && !h.has('origin')) h.set('origin', 'https://' + host);
    h.set('cf-connecting-ip', headers['cf-connecting-ip'] || '203.0.113.7');
    return worker.fetch(new Request('https://' + host + path, { method, headers: h, body, redirect: 'manual' }), env, ctx);
  };
}
export const cookieOf = (res) => (res.headers.get('set-cookie') || '').split(';')[0];

// Cały proces logowania: zwraca ciasteczko sesji.
export async function login(call, env, email, host = 'projects.smialo.org') {
  const n = env.sent.length;
  const r = await call('/auth/login', { method: 'POST', host, form: { email, next: '/' } });
  if (r.status !== 200) throw new Error('login ' + r.status);
  const link = new URL(env.sent[n].text.match(/https?:\/\/\S+/)[0]);
  const tok = link.searchParams.get('t');
  const v = await call('/auth/verify', { method: 'POST', host, form: { t: tok } });
  if (v.status !== 303) throw new Error('verify ' + v.status);
  return cookieOf(v);
}
