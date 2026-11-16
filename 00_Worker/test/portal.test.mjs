import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker.js';
import * as AX from '../access.js';
import { b64u } from '../auth.js';
import { makeEnv, mk, login, cookieOf, installRewriter } from './helpers.mjs';

installRewriter();
const setup = (over) => { const env = makeEnv(over); return { env, call: mk(worker, env) }; };
const row = (env, sql, ...p) => env.DB.raw.prepare(sql).get(...p);
const text = (r) => r.text();

test('canon: aliasy jednego adresu dają jeden klucz', () => {
  assert.equal(AX.canon('Jan.Kowalski+test@Gmail.com'), 'jankowalski@gmail.com');
  assert.equal(AX.canon('a.b@googlemail.com'), 'ab@gmail.com');
  assert.equal(AX.canon('a.b+x@firma.pl'), 'a.b@firma.pl');
  assert.equal(AX.canon('bez-malpy'), '');
});

test('statusOf: nowa → próba → wygasła, abonament i blokada', () => {
  const cfg = { trialDays: 3 }, now = 1e12, D = AX.DAY;
  assert.equal(AX.statusOf(null, null, now, cfg).st, 'new');
  assert.equal(AX.statusOf({ trial_start: now - D }, null, now, cfg).st, 'trial');
  assert.equal(AX.statusOf({ trial_start: now - 3 * D - 1 }, null, now, cfg).st, 'expired');
  assert.equal(AX.statusOf({ trial_start: now - 9 * D, paid_until: now + D }, null, now, cfg).st, 'paid');
  assert.equal(AX.statusOf(null, { paid_until: now + D }, now, cfg).st, 'paid');          // wpis „wszystkie aplikacje”
  assert.equal(AX.statusOf({ paid_until: now - D }, null, now, cfg).st, 'expired');
  assert.equal(AX.statusOf({ paid_until: now + D, blocked: 1 }, null, now, cfg).st, 'blocked');
  assert.equal(AX.statusOf(null, { blocked: 1 }, now, cfg).st, 'blocked');
});

test('grant: miesiące dolicza się do końca abonamentu, data wygrywa, zły okres to błąd', async () => {
  const { env } = setup(); await AX.ensureSchema(env);
  const now = Date.UTC(2026, 0, 31);
  const a = await AX.grant(env, 'o', { email: 'x@y.pl', app: '02', months: 1 }, now);
  assert.equal(new Date(a).getUTCMonth(), 2);                       // 31 stycznia + 1 mies. = 3 marca (JS przelicza dzień)
  const b = await AX.grant(env, 'o', { email: 'x@y.pl', app: '02', months: 6 }, now);
  assert.ok(b > a, 'drugi zakup dolicza się do pierwszego');
  const until = Date.UTC(2030, 5, 1);
  assert.equal(await AX.grant(env, 'o', { email: 'x@y.pl', app: '03', until }, now), until);
  await assert.rejects(AX.grant(env, 'o', { email: 'x@y.pl', app: '02', months: 5 }, now), /bad_period/);
  await assert.rejects(AX.grant(env, 'o', { email: 'nie-email', app: '02', months: 1 }, now), /bad_email/);
  await assert.rejects(AX.grant(env, 'o', { email: 'x@y.pl', app: 'zz', months: 1 }, now), /bad_app/);
});

test('logowanie: link z poczty → potwierdzenie → sesja; link działa tylko raz', async () => {
  const { env, call } = setup();
  const r = await call('/auth/login', { method: 'POST', form: { email: 'Jan.K+x@Gmail.com', next: '/' } });
  assert.equal(r.status, 200);
  assert.equal(env.sent.length, 1);
  assert.equal(env.sent[0].to, 'Jan.K+x@Gmail.com');
  const link = env.sent[0].text.match(/https?:\/\/\S+/)[0];
  assert.match(link, /^https:\/\/projects\.smialo\.org\/auth\/verify\?t=[\w-]{40,}$/);
  const t = new URL(link).searchParams.get('t');
  const g = await call('/auth/verify?t=' + t);                     // sam podgląd linku (np. skaner poczty) nie zużywa tokenu
  assert.equal(g.status, 200); assert.match(await text(g), /Potwierdź logowanie/);
  const v = await call('/auth/verify', { method: 'POST', form: { t } });
  assert.equal(v.status, 303);
  const ck = v.headers.get('set-cookie');
  assert.match(ck, /^ps=[\w-]+\.[\w-]+; Path=\/; Max-Age=\d+; HttpOnly; Secure; SameSite=Lax$/);
  const home = await call('/', { cookie: cookieOf(v) });
  assert.equal(home.status, 200); assert.match(await text(home), /Twoje aplikacje/);
  const again = await call('/auth/verify', { method: 'POST', form: { t } });
  assert.equal(again.status, 400);
  assert.equal((await call('/auth/verify?t=' + t)).status, 400);
});

test('logowanie: token wygasa po 15 minutach, śmieciowy token odpada', async () => {
  const { env, call } = setup();
  await call('/auth/login', { method: 'POST', form: { email: 'a@b.pl' } });
  const t = new URL(env.sent[0].text.match(/https?:\/\/\S+/)[0]).searchParams.get('t');
  env.DB.raw.prepare('UPDATE auth_tok SET exp = ?').run(Date.now() - 1);
  assert.equal((await call('/auth/verify', { method: 'POST', form: { t } })).status, 400);
  assert.equal((await call('/auth/verify', { method: 'POST', form: { t: "x' OR 1=1 --" } })).status, 400);
});

test('logowanie: parametr next nie robi przekierowania poza serwis', async () => {
  const { env, call } = setup();
  for (const bad of ['//evil.com', 'https://evil.com', '/\\evil.com', 'javascript:alert(1)']) {
    const n = env.sent.length;
    await call('/auth/login', { method: 'POST', form: { email: 'a@b.pl', next: bad } });
    const t = new URL(env.sent[n].text.match(/https?:\/\/\S+/)[0]).searchParams.get('t');
    const v = await call('/auth/verify', { method: 'POST', form: { t } });
    assert.equal(v.headers.get('location'), '/', bad);
  }
  await call('/auth/login', { method: 'POST', form: { email: 'a@b.pl', next: '/05/' } });
  const t = new URL(env.sent.at(-1).text.match(/https?:\/\/\S+/)[0]).searchParams.get('t');
  assert.equal((await call('/auth/verify', { method: 'POST', form: { t } })).headers.get('location'), '/05/');
});

test('logowanie: zły adres, brak konfiguracji poczty, limity', async () => {
  let { env, call } = setup();
  assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'to nie jest email' } })).status, 400);
  assert.equal(env.sent.length, 0);
  ({ env, call } = setup({ EMAIL: undefined }));
  assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'a@b.pl' } })).status, 503);
  ({ env, call } = setup());
  for (let i = 0; i < 5; i++) assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'ten@sam.pl' } })).status, 200);
  assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'ten@sam.pl' } })).status, 429);   // 6. w godzinę
  assert.equal(env.sent.length, 5);
  ({ env, call } = setup({ MAIL_DAILY: '2' }));
  await call('/auth/login', { method: 'POST', form: { email: 'a1@b.pl' } }); await call('/auth/login', { method: 'POST', form: { email: 'a2@b.pl' } });
  assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'a3@b.pl' } })).status, 429);       // dzienny sufit wysyłek
  ({ env, call } = setup({ EMAIL: { send: async () => { throw new Error('boom'); } } }));
  assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'a@b.pl' } })).status, 502);
});

test('logowanie: żądania z innego źródła (CSRF) są odrzucane', async () => {
  const { call } = setup();
  assert.equal((await call('/auth/login', { method: 'POST', form: { email: 'a@b.pl' }, headers: { origin: 'https://evil.example' } })).status, 403);
  assert.equal((await call('/auth/logout', { method: 'POST', headers: { origin: 'https://evil.example' } })).status, 403);
});

test('sesja: podrobione ciasteczko nie działa, wylogowanie kasuje sesję', async () => {
  const { env, call } = setup();
  const ck = await login(call, env, 'a@b.pl');
  assert.equal((await call('/', { cookie: ck })).status, 200);
  const [id] = ck.slice(3).split('.');
  assert.equal((await call('/api/me', { cookie: 'ps=' + id + '.AAAA', accept: 'application/json' })).status, 401);
  assert.equal((await call('/api/me', { cookie: 'ps=nieistnieje.AAAA', accept: 'application/json' })).status, 401);
  const out = await call('/auth/logout', { method: 'POST', cookie: ck });
  assert.equal(out.status, 303); assert.match(out.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal(row(env, 'SELECT COUNT(*) n FROM sess').n, 0);
  assert.equal((await call('/api/me', { cookie: ck, accept: 'application/json' })).status, 401);
});

test('portal: bez logowania ekran logowania, zasoby /_p publiczne, nieznane ścieżki 404', async () => {
  const { call } = setup();
  const h = await call('/'); assert.equal(h.status, 200); assert.match(await text(h), /Zaloguj się/);
  assert.match(h.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal((await call('/_p/fonts/x.woff2')).status, 200);
  assert.equal((await call('/cokolwiek')).status, 404);
  assert.equal((await call('/01/')).status, 404);                              // StartupBoard to aplikacja PC, nie ma jej w katalogu webowym
});

test('bramka: nowy → ekran blokady, start próby → wejście z plakietką; po 3 dniach blokada', async () => {
  const { env, call } = setup();
  const ck = await login(call, env, 'nowy@x.pl');
  const un = await call('/05/'); assert.equal(un.status, 303); assert.match(un.headers.get('location'), /^\/auth\/login\?next=%2F05%2F$/);
  const lock = await call('/05/', { cookie: ck });
  assert.equal(lock.status, 403); const lt = await text(lock); assert.match(lt, /Zacznij próbę: Anatomia 3D/); assert.match(lt, /3 dni próby/);
  assert.equal((await call('/05/app.js', { cookie: ck, accept: '*/*' })).status, 403);   // zasoby też są za bramką
  const st = await call('/trial', { method: 'POST', cookie: ck, form: { app: '05' } });
  assert.equal(st.status, 303); assert.equal(st.headers.get('location'), '/05/');
  const ok = await call('/05/', { cookie: ck }); assert.equal(ok.status, 200);
  const body = await text(ok); assert.match(body, /APP \/05\//); assert.match(body, /id="pw-chip"/); assert.match(body, /Próba: zostało 3 dni/);
  assert.equal((await call('/05/app.js', { cookie: ck, accept: '*/*' })).status, 200);
  assert.equal((await call('/03/', { cookie: ck })).status, 403);                         // próba jest osobna dla każdej aplikacji
  env.DB.raw.prepare('UPDATE ent SET trial_start = ?').run(Date.now() - 3 * AX.DAY - 1000);
  const ex = await call('/05/', { cookie: ck }); assert.equal(ex.status, 403); assert.match(await text(ex), /Próba dobiegła końca/);
  assert.equal((await call('/trial', { method: 'POST', cookie: ck, form: { app: '05' } })).status, 303);
  assert.equal((await call('/05/', { cookie: ck })).status, 403);                          // drugiej próby nie da się wystartować
});

test('bramka: abonament, wpis „wszystkie aplikacje”, blokada i wygaśnięcie', async () => {
  const { env, call } = setup();
  const ck = await login(call, env, 'klient@x.pl');
  await AX.grant(env, 'o', { email: 'klient@x.pl', app: '03', months: 1 });
  const ok = await call('/03/', { cookie: ck }); assert.equal(ok.status, 200); assert.doesNotMatch(await text(ok), /pw-chip/);   // abonament na długo: bez plakietki
  assert.equal((await call('/04/', { cookie: ck })).status, 403);
  await AX.grant(env, 'o', { email: 'klient@x.pl', app: '*', months: 12 });
  assert.equal((await call('/04/', { cookie: ck })).status, 200);
  await AX.setBlocked(env, 'o', 'klient@x.pl', '04', true);
  assert.equal((await call('/04/', { cookie: ck })).status, 403);
  assert.equal((await call('/03/', { cookie: ck })).status, 200);                           // blokada dotyczy jednej aplikacji
  await AX.setBlocked(env, 'o', 'klient@x.pl', '*', true);
  assert.equal((await call('/03/', { cookie: ck })).status, 303);                           // blokada całego konta kasuje sesje
  env.DB.raw.prepare('UPDATE ent SET blocked = 0, paid_until = ?').run(Date.now() - 1000);
  const ck2 = await login(call, env, 'klient@x.pl');
  const ex = await call('/03/', { cookie: ck2 }); assert.equal(ex.status, 403); assert.match(await text(ex), /Abonament wygasł/);
});

test('bramka: aliasy adresu dzielą jedną próbę', async () => {
  const { env, call } = setup();
  const a = await login(call, env, 'Jan.Kowalski@gmail.com'), b = await login(call, env, 'jankowalski+drugi@gmail.com');
  await call('/trial', { method: 'POST', cookie: a, form: { app: '02' } });
  assert.equal((await call('/02/', { cookie: b })).status, 200);
  assert.equal(row(env, 'SELECT COUNT(*) n FROM ent').n, 1);
});

test('adresy aplikacji: portal linkuje /NN/, stare podadresy nadal działają', async () => {
  const { env, call } = setup();
  const ck = await login(call, env, 'a@b.pl');
  await call('/trial', { method: 'POST', cookie: ck, form: { app: '02' } });
  const r = await call('/', { host: 'nawyk.smialo.org', cookie: ck }); assert.equal(r.status, 200); assert.match(await text(r), /APP \/02\//);
  assert.equal((await call('/', { host: 'esencja.smialo.org', cookie: ck })).status, 403);
  const un = await call('/', { host: 'nawyk.smialo.org' }); assert.equal(un.status, 303); assert.equal(un.headers.get('location'), '/auth/login?next=%2F');
  const home = await text(await call('/', { cookie: ck })); assert.match(home, /href="\/02\/"/);
  const wd = await call('/', { host: 'projects.konto.workers.dev', cookie: ck });
  assert.equal(wd.status, 200); assert.match(await text(wd), /href="\/02\/"/);               // poza własną domeną: ścieżki /NN/
});

test('API: bez sesji 401, aplikacja musi mieć dostęp, CSRF, limity dzienne', async () => {
  const { env, call } = setup({ QUOTAS: JSON.stringify({ state: [2, 5] }) });
  assert.equal((await call('/api/n/status', { accept: 'application/json' })).status, 401);
  const ck = await login(call, env, 'a@b.pl');
  const j = { cookie: ck, accept: 'application/json' };
  assert.equal((await call('/api/n/status', j)).status, 403);                               // brak próby Notatnika
  assert.equal((await call('/api/state/nawyk', j)).status, 403);
  await call('/trial', { method: 'POST', cookie: ck, form: { app: '02' } });
  await call('/trial', { method: 'POST', cookie: ck, form: { app: '04' } });
  assert.equal((await call('/api/n/status', j)).status, 200);
  assert.equal((await call('/api/state/nawyk', j)).status, 200);
  assert.equal((await call('/api/state/esencja', j)).status, 404);                          // stan tylko dla aplikacji, które go używają
  assert.equal((await call('/api/state/nawyk', { ...j, method: 'PUT', json: { t: 1, x: 1 }, headers: { origin: 'https://evil.example' } })).status, 403);
  assert.equal((await call('/api/state/nawyk', { ...j, method: 'PUT', json: { t: 1, x: 1 }, origin: false })).status, 403);
  assert.equal((await call('/api/state/nawyk', { ...j, method: 'PUT', json: { t: 1, x: 1 } })).status, 200);
  assert.equal((await call('/api/state/nawyk', { ...j, method: 'PUT', json: { t: 2, x: 2 } })).status, 200);
  const q = await call('/api/state/nawyk', { ...j, method: 'PUT', json: { t: 3, x: 3 } });
  assert.equal(q.status, 429); assert.equal((await q.json()).limit, 2);                      // limit próby, zapisy ponad limit odpadają
  assert.deepEqual((await (await call('/api/state/nawyk', j)).json()).data, { t: 2, x: 2 });
  assert.equal((await call('/api/stats', j)).status, 403);                                  // statystyki tylko dla właściciela
});

test('API: stan aplikacji jest osobny dla każdego konta', async () => {
  const { env, call } = setup();
  const a = await login(call, env, 'ala@x.pl'), b = await login(call, env, 'ola@x.pl');
  for (const ck of [a, b]) await call('/trial', { method: 'POST', cookie: ck, form: { app: '02' } });
  await call('/api/state/nawyk', { cookie: a, method: 'PUT', json: { t: 1, moje: 'ala' }, accept: 'application/json' });
  assert.equal((await (await call('/api/state/nawyk', { cookie: b, accept: 'application/json' })).json()).data, null);
  assert.equal((await (await call('/api/state/nawyk', { cookie: a, accept: 'application/json' })).json()).data.moje, 'ala');
});

test('właściciel: pełny dostęp bez próby i bez limitów, panel i statystyki', async () => {
  const { env, call } = setup();
  const ck = await login(call, env, 'Owner@Example.com');
  for (const n of ['02', '03', '04', '05']) assert.equal((await call(`/${n}/`, { cookie: ck })).status, 200, n);
  assert.doesNotMatch(await text(await call('/02/', { cookie: ck })), /pw-chip/);
  assert.equal((await call('/api/stats', { cookie: ck, accept: 'application/json' })).status, 200);
  const home = await text(await call('/', { cookie: ck })); assert.match(home, /Administracja/); assert.match(home, /Konto właściciela/);
  assert.equal(row(env, 'SELECT COUNT(*) n FROM ent').n, 0);
});

test('administracja: tylko właściciel; nadawanie, blokowanie, cofanie; CSRF; ucieczka HTML', async () => {
  const { env, call } = setup();
  const user = await login(call, env, 'zwykly@x.pl'), own = await login(call, env, 'owner@example.com');
  assert.equal((await call('/admin', { cookie: user })).status, 404);
  assert.equal((await call('/admin/act', { method: 'POST', cookie: user, form: { do: 'grant', email: 'zwykly@x.pl', app: '*', months: '12' } })).status, 404);
  assert.equal(row(env, 'SELECT COUNT(*) n FROM ent').n, 0);
  assert.equal((await call('/admin')).status, 303);
  const act = (form, o = {}) => call('/admin/act', { method: 'POST', cookie: own, form, ...o });
  assert.equal((await act({ do: 'grant', email: 'zwykly@x.pl', app: '05', months: '6', note: '<img src=x onerror=alert(1)>' }, { headers: { origin: 'https://evil.example' } })).status, 403);
  const g = await act({ do: 'grant', email: 'zwykly@x.pl', app: '05', months: '6', note: '<img src=x onerror=alert(1)>' });
  assert.equal(g.headers.get('location'), '/admin?f=grant');
  assert.equal((await call('/05/', { cookie: user })).status, 200);
  const page = await text(await call('/admin', { cookie: own })); assert.match(page, /zwykly@x\.pl/); assert.doesNotMatch(page, /<img src=x/); assert.match(page, /&lt;img src=x/);
  assert.match(await text(await call('/admin?q=zwykly', { cookie: own })), /<td>zwykly@x\.pl/);
  assert.doesNotMatch(await text(await call('/admin?q=nikt', { cookie: own })), /<td>zwykly@x\.pl/);   // w tabeli; dziennik zmian pokazuje wszystko
  assert.equal((await act({ do: 'block', email: 'zwykly@x.pl', app: '05' })).status, 303);
  assert.equal((await call('/05/', { cookie: user })).status, 403);
  await act({ do: 'unblock', email: 'zwykly@x.pl', app: '05' });
  assert.equal((await call('/05/', { cookie: user })).status, 200);
  await act({ do: 'revoke', email: 'zwykly@x.pl', app: '05' });
  assert.equal((await call('/05/', { cookie: user })).status, 403);
  assert.match((await act({ do: 'grant', email: 'zly', app: '05', months: '1' })).headers.get('location'), /x=bad_email/);
  assert.match((await act({ do: 'grant', email: 'a@b.pl', app: '99', months: '1' })).headers.get('location'), /x=bad_app/);
  assert.match((await act({ do: 'grant', email: 'a@b.pl', app: '05', months: '7' })).headers.get('location'), /x=bad_period/);
  assert.match((await act({ do: 'grant', email: 'a@b.pl', app: '05', until: '2020-01-01' })).headers.get('location'), /x=bad_period/);
  assert.equal((await act({ do: 'grant', email: 'a@b.pl', app: '05', until: '2099-01-01' })).headers.get('location'), '/admin?f=grant');
  assert.ok(row(env, 'SELECT COUNT(*) n FROM audit').n === 5);
});

test('dostęp awaryjny: GATE=off wpuszcza każdego zalogowanego', async () => {
  const { env, call } = setup({ GATE: 'off' });
  const ck = await login(call, env, 'a@b.pl');
  assert.equal((await call('/05/', { cookie: ck })).status, 200);
});

test('Cloudflare Access: poprawny token wpuszcza, błędny podpis i obcy odbiorca nie', async () => {
  const kp = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = { ...(await crypto.subtle.exportKey('jwk', kp.publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (u, ...r) => String(u).startsWith('https://tim.cloudflareaccess.com/cdn-cgi/access/certs') ? new Response(JSON.stringify({ keys: [jwk] })) : realFetch(u, ...r);
  const enc = (o) => b64u(new TextEncoder().encode(JSON.stringify(o)));
  const jwt = async (pay, key = kp.privateKey) => { const h = enc({ alg: 'RS256', kid: 'k1' }), p = enc(pay); return `${h}.${p}.${b64u(new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(h + '.' + p))))}`; };
  try {
    const { env, call } = setup({ ACCESS_TEAM: 'tim.cloudflareaccess.com', ACCESS_AUD: 'aud1', SESSION_SECRET: undefined });
    const exp = Math.floor(Date.now() / 1000) + 600;
    const good = await jwt({ email: 'przez@access.pl', exp, aud: ['aud1'] });
    const me = await call('/api/me', { headers: { 'cf-access-jwt-assertion': good }, accept: 'application/json' });
    assert.equal(me.status, 200); assert.equal((await me.json()).email, 'przez@access.pl');
    const other = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign']);
    for (const bad of [await jwt({ email: 'x@y.pl', exp, aud: ['aud1'] }, other.privateKey), await jwt({ email: 'x@y.pl', exp: exp - 9999, aud: ['aud1'] }), await jwt({ email: 'x@y.pl', exp, aud: ['inny'] }), 'a.b.c'])
      assert.equal((await call('/api/me', { headers: { 'cf-access-jwt-assertion': bad }, accept: 'application/json' })).status, 401);
    assert.equal((await call('/api/me', { headers: { 'cf-access-authenticated-user-email': 'owner@example.com' }, accept: 'application/json' })).status, 401);   // sam nagłówek z e-mailem nic nie znaczy
    // bez ACCESS_TEAM nagłówek Access jest ignorowany
    const { call: c2 } = setup({ SESSION_SECRET: undefined });
    assert.equal((await c2('/api/me', { headers: { 'cf-access-jwt-assertion': good }, accept: 'application/json' })).status, 401);
    void env;
  } finally { globalThis.fetch = realFetch; }
});

test('panel: etykiety stanu po polsku', async () => {
  const { stateText } = await import('../pages.js'), cfg = { trialDays: 3 }, D = AX.DAY, now = Date.now();
  assert.equal(stateText({ st: 'new' }, cfg).label, '3 dni próby za darmo');
  assert.equal(stateText(AX.statusOf({ trial_start: now - D }, null, now, cfg), cfg).label, 'Próba: zostało 2 dni');
  assert.equal(stateText(AX.statusOf({ trial_start: now - 3 * D + 36e5 }, null, now, cfg), cfg).label, 'Próba: zostało 1 godzinę');
  assert.equal(stateText(AX.statusOf({ trial_start: now - 3 * D + 3 * 36e5 }, null, now, cfg), cfg).label, 'Próba: zostało 3 godziny');
  assert.match(stateText(AX.statusOf({ paid_until: now + 30 * D }, null, now, cfg), cfg).label, /^Abonament do \d\d\.\d\d\.\d{4}$/);
  assert.equal(stateText({ st: 'blocked' }, cfg).tone, 'bad');
});
