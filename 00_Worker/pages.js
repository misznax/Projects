// Strony portalu renderowane po stronie Workera (bez JavaScriptu u klienta): logowanie, panel, blokada, administracja.
// Motyw: jasny wariant morskiego motywu oferty (twojastrona.smialo.org), czcionki z /_p/fonts, ikony z /_p/icons.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const CSP = "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'";
export const ORDER = 'https://twojastrona.smialo.org/zamow-aplikacje/';
export const STORE = 'https://twojastrona.smialo.org/aplikacje/';

const TZ = 'Europe/Warsaw';
export const fmtDate = (ts) => new Date(ts).toLocaleDateString('pl-PL', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' });
export const fmtDT = (ts) => new Date(ts).toLocaleString('pl-PL', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const days = (n) => `${n} ${n === 1 ? 'dzień' : 'dni'}`;
const hours = (n) => `${n} ${n === 1 ? 'godzinę' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 > 20) ? 'godziny' : 'godzin'}`;

// Opis stanu dostępu: { label (krótko), tone (ok|warn|bad|new) }
export function stateText(s, cfg) {
  if (s.owner) return { label: 'Konto właściciela', tone: 'ok' };
  switch (s.st) {
    case 'paid': return { label: `Abonament do ${fmtDate(s.until)}`, tone: s.daysLeft <= 7 ? 'warn' : 'ok' };
    case 'trial': return { label: s.daysLeft <= 1 ? `Próba: zostało ${hours(s.hoursLeft)}` : `Próba: zostało ${days(s.daysLeft)}`, tone: 'warn' };
    case 'expired': return { label: s.wasPaid ? `Abonament wygasł ${fmtDate(s.paidEnded)}` : 'Próba zakończona', tone: 'bad' };
    case 'blocked': return { label: 'Dostęp wstrzymany', tone: 'bad' };
    default: return { label: `${days(cfg.trialDays)} próby za darmo`, tone: 'new' };
  }
}

const FONT = (n, f, w, r) => `@font-face{font-family:"${n}";font-style:normal;font-weight:${w};font-display:swap;src:url(/_p/fonts/${f}.woff2) format("woff2");unicode-range:${r}}`;
const R_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const R_LAT = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const CSS = `${FONT('Marcellus', 'marcellus-latin-ext-400-normal', 400, R_EXT)}${FONT('Marcellus', 'marcellus-latin-400-normal', 400, R_LAT)}${FONT('Plus Jakarta Sans', 'plus-jakarta-sans-latin-ext-wght-normal', '200 800', R_EXT)}${FONT('Plus Jakarta Sans', 'plus-jakarta-sans-latin-wght-normal', '200 800', R_LAT)}
:root{--bg:#F2F7F6;--ink:#0A2A33;--muted:#48646C;--line:rgba(10,42,51,.14);--deep:#06262D;--teal:#0B6F78;--teal-d:#085862;--aqua:#4CC9C0;--mint:#D8F1EE;--card:#fff;--err:#A3341F;--warn:#8A5A0B;--serif:"Marcellus",Georgia,"Times New Roman",serif;--sans:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;--r:12px;--shadow:0 1px 2px rgba(6,38,45,.06),0 22px 50px -28px rgba(6,38,45,.42)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 var(--sans);min-height:100dvh;display:flex;flex-direction:column}
a{color:var(--teal-d)}a:hover{color:var(--ink)}
:focus-visible{outline:3px solid var(--aqua);outline-offset:2px;border-radius:6px}
.hd{display:flex;align-items:center;gap:16px;padding:14px max(20px,calc((100% - 1040px)/2 + 20px));background:#fff;border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--ink);font:400 22px/1 var(--serif);letter-spacing:.01em}
.brand small{font:500 13px/1 var(--sans);color:var(--muted);margin-left:2px}
.mark{display:grid;grid-template-columns:1fr 1fr;gap:3px;width:28px;height:28px}.mark i{border-radius:6px}
.hd form{margin:0 0 0 auto;display:flex;align-items:center;gap:12px;font-size:14px;color:var(--muted)}
.hd .who{max-width:34vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
main{flex:1;width:100%;max-width:1040px;margin:0 auto;padding:44px 20px 64px}
main.narrow{max-width:520px}
h1{font:400 clamp(30px,5vw,42px)/1.12 var(--serif);margin:0 0 10px;letter-spacing:.005em}
h2{font:400 24px/1.2 var(--serif);margin:0 0 12px}
.lead{margin:0 0 28px;color:var(--muted);max-width:60ch}
.btn,button.btn{appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 24px;border-radius:999px;background:var(--teal);color:#fff;font:700 15px/1 var(--sans);text-decoration:none;transition:background .15s,transform .15s}
.btn:hover{background:var(--teal-d);color:#fff}.btn:active{transform:translateY(1px)}
.btn.line{background:transparent;color:var(--teal-d);box-shadow:inset 0 0 0 1.5px var(--teal)}.btn.line:hover{background:var(--mint);color:var(--ink)}
.btn.sm{min-height:36px;padding:0 16px;font-size:13px}
.btn.ghost{background:transparent;color:var(--muted);box-shadow:inset 0 0 0 1px var(--line);font-weight:600}.btn.ghost:hover{background:#fff;color:var(--ink)}
.btn.danger{background:var(--err)}.btn.danger:hover{background:#7d2716}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);padding:30px 28px}
label{display:block;font-weight:600;font-size:14px;margin:0 0 6px}
input[type=email],input[type=text],input[type=date],select{width:100%;min-height:48px;padding:0 14px;border:1.5px solid var(--line);border-radius:10px;background:#fff;color:var(--ink);font:16px var(--sans)}
input:focus,select:focus{border-color:var(--teal);outline:3px solid rgba(76,201,192,.45);outline-offset:0}
.fld{margin:0 0 16px}
.msg{padding:12px 14px;border-radius:10px;margin:0 0 18px;font-size:15px}.msg.err{background:#FBE9E5;color:var(--err)}.msg.ok{background:var(--mint);color:var(--teal-d)}
.fine{font-size:13px;color:var(--muted);margin:16px 0 0}
.strip{display:flex;justify-content:center;gap:14px;margin:0 0 26px}.strip img{width:54px;height:54px;border-radius:14px;box-shadow:0 14px 22px -16px rgba(6,38,45,.6)}
.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,440px),1fr));gap:20px;margin:30px 0 0}
.tile{display:grid;grid-template-columns:76px 1fr;gap:20px;align-items:start;background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:var(--shadow)}
.tile .ic{width:76px;height:76px;border-radius:20px;box-shadow:0 20px 28px -18px var(--c2,#06262D)}
.tile h2{margin:0 0 2px;font-size:25px}.tile p{margin:0 0 12px;color:var(--muted);font-size:15px}
.tile .act{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.tile form{margin:0}
.chip{display:inline-flex;align-items:center;gap:7px;font:600 13px/1 var(--sans);padding:7px 11px;border-radius:999px;background:#EEF3F3;color:var(--muted);margin:0 0 14px}
.chip::before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}
.chip.ok{background:var(--mint);color:var(--teal-d)}.chip.warn{background:#FCF1D8;color:var(--warn)}.chip.bad{background:#FBE9E5;color:var(--err)}.chip.new{background:#E5F0FB;color:#1F4E87}
.foot{padding:22px 20px;text-align:center;font-size:13px;color:var(--muted)}
.lock{text-align:center}.lock .ic{width:96px;height:96px;border-radius:26px;margin:0 auto 20px;display:block;box-shadow:0 26px 34px -20px var(--c2,#06262D)}
.lock .act{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:22px}.lock form{margin:0}
.owner{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:0 0 6px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin:0 0 28px}
.stats div{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px}.stats b{display:block;font:700 28px/1.1 var(--sans)}.stats span{font-size:13px;color:var(--muted)}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;align-items:end}
.tw{overflow-x:auto;background:#fff;border:1px solid var(--line);border-radius:14px}
table{border-collapse:collapse;width:100%;font-size:14px;min-width:760px}
th,td{padding:11px 14px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}th{font-weight:700;background:#F6FAF9;white-space:nowrap}tr:last-child td{border-bottom:0}
td .chip{margin:0;padding:5px 9px;font-size:12px}
details summary{cursor:pointer;color:var(--teal-d);font-weight:600}details form{display:inline-block;margin:8px 8px 0 0}
.log{font-size:13px;color:var(--muted);margin:10px 0 0;padding:0;list-style:none}.log li{padding:5px 0;border-bottom:1px dashed var(--line)}
@media (max-width:560px){.tile{grid-template-columns:60px 1fr;padding:18px;gap:14px}.tile .ic{width:60px;height:60px;border-radius:16px}.card{padding:24px 20px}.hd .who{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}`;

const MARK = (apps) => `<span class="mark" aria-hidden="true">${apps.slice(0, 4).map((a) => `<i style="background:linear-gradient(135deg,${esc(a.c1)},${esc(a.c2)})"></i>`).join('')}</span>`;

export function layout({ title, body, user, apps = [], narrow = false, host }) {
  const out = user ? `<form method="post" action="/auth/logout"><span class="who" title="${esc(user.email)}">${esc(user.email)}</span><button class="btn sm ghost" type="submit">Wyloguj</button></form>` : '';
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light"><title>${esc(title)} · Projects</title><link rel="icon" href="/_p/icons/nawyk.svg" type="image/svg+xml"><style>${CSS}</style></head><body><header class="hd"><a class="brand" href="/">${MARK(apps)}Projects<small>Web Elegance</small></a>${out}</header><main${narrow ? ' class="narrow"' : ''}>${body}</main><footer class="foot"><a href="${STORE}">Oferta i opisy aplikacji</a> · ${esc(host || '')}</footer></body></html>`;
}

const iconUrl = (id) => `/_p/icons/${id}.svg`;
const strip = (apps) => `<div class="strip">${apps.map((a) => `<img src="${iconUrl(a.id)}" alt="" width="54" height="54">`).join('')}</div>`;
const hidden = (n, v) => `<input type="hidden" name="${esc(n)}" value="${esc(v)}">`;

export function loginPage({ apps, cfg, next = '/', email = '', error = '', host }) {
  return layout({ title: 'Logowanie', apps, host, narrow: true, body: `${strip(apps)}<div class="card"><h1>Zaloguj się</h1><p class="lead" style="margin-bottom:22px">Podaj adres e-mail. Wyślemy link, który wpuści Cię do aplikacji. Bez hasła.</p>${error ? `<p class="msg err" role="alert">${esc(error)}</p>` : ''}<form method="post" action="/auth/login">${hidden('next', next)}<div class="fld"><label for="e">Adres e-mail</label><input id="e" type="email" name="email" value="${esc(email)}" autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false" required autofocus></div><button class="btn" type="submit" style="width:100%">Wyślij link do logowania</button></form><p class="fine">Pierwszy raz? Konto powstaje samo. Każda aplikacja ma ${days(cfg.trialDays)} próby, od pierwszego wejścia.</p></div>` });
}

export function sentPage({ apps, email, host }) {
  return layout({ title: 'Sprawdź skrzynkę', apps, host, narrow: true, body: `${strip(apps)}<div class="card"><h1>Sprawdź skrzynkę</h1><p class="lead" style="margin-bottom:14px">Jeśli adres <b>${esc(email)}</b> jest poprawny, link do logowania już do niego idzie. Działa 15 minut i tylko raz.</p><p class="fine" style="margin:0">Nie ma wiadomości? Zajrzyj do spamu albo <a href="/auth/login?e=${encodeURIComponent(email)}">poproś o nowy link</a>.</p></div>` });
}

export function confirmPage({ apps, masked, token, host }) {
  return layout({ title: 'Potwierdź logowanie', apps, host, narrow: true, body: `${strip(apps)}<div class="card"><h1>Potwierdź logowanie</h1><p class="lead" style="margin-bottom:22px">Logujesz się jako <b>${esc(masked)}</b>.</p><form method="post" action="/auth/verify">${hidden('t', token)}<button class="btn" type="submit" style="width:100%">Wchodzę</button></form><p class="fine">To nie Ty? Zamknij tę kartę, nic się nie stanie.</p></div>` });
}

export function badLinkPage({ apps, host, why = '' }) {
  return layout({ title: 'Link nie działa', apps, host, narrow: true, body: `${strip(apps)}<div class="card"><h1>Ten link już nie działa</h1><p class="lead" style="margin-bottom:22px">${esc(why || 'Link do logowania działa 15 minut i tylko raz. Poproś o nowy.')}</p><a class="btn" href="/auth/login" style="width:100%">Wyślij nowy link</a></div>` });
}

export function messagePage({ apps, title, text, user, host, cta }) {
  return layout({ title, apps, user, host, narrow: true, body: `<div class="card"><h1>${esc(title)}</h1><p class="lead" style="margin-bottom:${cta ? 22 : 0}px">${esc(text)}</p>${cta ? `<a class="btn" href="${esc(cta[1])}">${esc(cta[0])}</a>` : ''}</div>` });
}

// Panel: kafelki aplikacji ze stanem i właściwym przyciskiem.
export function dashboardPage({ user, owner, apps, cfg, host }) {
  const tiles = apps.map((a) => {
    const t = stateText(a.s, cfg), ok = a.s.st === 'trial' || a.s.st === 'paid';
    let act;
    if (ok) act = `<a class="btn" href="${esc(a.url)}">Otwórz</a>${a.s.st === 'trial' ? `<a class="btn line" href="${esc(a.order)}">Wykup dostęp</a>` : ''}`;
    else if (a.s.st === 'new') act = `<form method="post" action="/trial">${hidden('app', a.nn)}<button class="btn" type="submit">Zacznij próbę</button></form><a class="btn line" href="${esc(a.order)}">Wykup dostęp</a>`;
    else if (a.s.st === 'blocked') act = `<a class="btn line" href="${esc(a.order)}">Napisz do nas</a>`;
    else act = `<a class="btn" href="${esc(a.order)}">Wykup dostęp</a>`;
    return `<article class="tile" style="--c1:${esc(a.c1)};--c2:${esc(a.c2)}"><img class="ic" src="${iconUrl(a.id)}" alt="" width="76" height="76"><div><h2>${esc(a.name)}</h2><p>${esc(a.tagline)}</p><span class="chip ${t.tone}">${esc(t.label)}</span><div class="act">${act}</div></div></article>`;
  }).join('');
  const ownerBar = owner ? `<p class="owner"><a class="btn sm line" href="/admin">Administracja</a><span class="fine" style="margin:0">Konto właściciela: pełny dostęp do wszystkich aplikacji.</span></p>` : '';
  return layout({ title: 'Twoje aplikacje', apps, user, host, body: `<h1>Twoje aplikacje</h1><p class="lead">Wybierz aplikację. Dane i ustawienia są przypisane do Twojego adresu e-mail, więc wrócisz do nich z każdego urządzenia.</p>${ownerBar}<section class="tiles" aria-label="Aplikacje">${tiles}</section>` });
}

// Blokada przy wejściu do aplikacji bez ważnego dostępu.
export function lockPage({ user, app, s, cfg, order, host, apps }) {
  const t = stateText(s, cfg);
  let h1, text, act;
  if (s.st === 'new') {
    h1 = `Zacznij próbę: ${app.name}`; text = `Masz ${days(cfg.trialDays)} na sprawdzenie aplikacji. Czas liczy się od teraz, bez karty i bez zobowiązań.`;
    act = `<form method="post" action="/trial">${hidden('app', app.nn)}<button class="btn" type="submit">Zaczynam próbę</button></form><a class="btn line" href="${esc(order)}">Wykup dostęp</a>`;
  } else if (s.st === 'blocked') {
    h1 = 'Dostęp wstrzymany'; text = 'Dostęp do tej aplikacji jest wstrzymany. Napisz do nas, to wyjaśnimy.'; act = `<a class="btn" href="${esc(order)}">Napisz do nas</a>`;
  } else {
    h1 = s.wasPaid ? 'Abonament wygasł' : 'Próba dobiegła końca'; text = s.wasPaid ? `Abonament na ${app.name} skończył się ${fmtDate(s.paidEnded)}. Przedłużysz go w jednej wiadomości.` : `Próba aplikacji ${app.name} się skończyła. Żeby korzystać dalej, wykup dostęp. Twoje dane zostają.`;
    act = `<a class="btn" href="${esc(order)}">Wykup dostęp</a>`;
  }
  return layout({ title: app.name, apps, user, host, narrow: true, body: `<div class="card lock" style="--c2:${esc(app.c2)}"><img class="ic" src="${iconUrl(app.id)}" alt="" width="96" height="96"><span class="chip ${t.tone}">${esc(t.label)}</span><h1>${esc(h1)}</h1><p class="lead" style="margin:0 auto">${esc(text)}</p><div class="act">${act}<a class="btn ghost" href="/">Wszystkie aplikacje</a></div></div>` });
}

// Administracja: właściciel nadaje i odbiera dostęp. Wszystko zwykłymi formularzami (bez JS).
export function adminPage({ user, apps, cfg, host, counts, rows, q, log, flash }) {
  const appName = (n) => (n === '*' ? 'Wszystkie' : apps.find((a) => a.nn === n)?.name || n);
  const opts = `<option value="*">Wszystkie aplikacje</option>${apps.map((a) => `<option value="${esc(a.nn)}">${esc(a.name)}</option>`).join('')}`;
  const act = (r, name, label, extra = '', cls = 'btn sm ghost') => `<form method="post" action="/admin/act">${hidden('do', name)}${hidden('email', r.email)}${hidden('app', r.app)}${extra}<button class="${cls}" type="submit">${label}</button></form>`;
  const body = rows.map((r) => {
    const t = stateText(r.s, cfg);
    return `<tr><td>${esc(r.raw || r.email)}<br><span class="fine" style="margin:0">${r.last_login ? 'logowanie ' + fmtDT(r.last_login) : 'nie logował(a) się'}</span></td><td>${esc(appName(r.app))}</td><td><span class="chip ${t.tone}">${esc(t.label)}</span></td><td>${r.trial_start ? fmtDate(r.trial_start) : '–'}</td><td>${r.paid_until ? fmtDate(r.paid_until) : '–'}${r.plan ? `<br><span class="fine" style="margin:0">${esc(r.plan)}</span>` : ''}</td><td>${esc(r.note || '')}</td><td><details><summary>Akcje</summary>${[1, 6, 12].map((m) => act(r, 'grant', `+${m} mies.`, hidden('months', m))).join('')}${act(r, r.blocked ? 'unblock' : 'block', r.blocked ? 'Odblokuj' : 'Zablokuj')}${r.app !== '*' && r.trial_start ? act(r, 'reset_trial', 'Zeruj próbę') : ''}${r.paid_until ? act(r, 'revoke', 'Cofnij abonament', '', 'btn sm danger') : ''}</details></td></tr>`;
  }).join('') || `<tr><td colspan="7" style="color:var(--muted)">Brak wpisów${q ? ' dla „' + esc(q) + '”' : ''}.</td></tr>`;
  const logHtml = (log || []).map((l) => `<li>${fmtDT(l.ts)} · ${esc(l.actor || '-')} · <b>${esc(l.action)}</b> ${esc(l.email || '')} ${l.app ? '(' + esc(appName(l.app)) + ')' : ''} ${esc(l.detail || '')}</li>`).join('');
  return layout({ title: 'Administracja', apps, user, host, body: `<h1>Administracja</h1><p class="lead">Kto ma dostęp, do kiedy i do czego. Zmiany działają od razu.</p>${flash ? `<p class="msg ${flash.err ? 'err' : 'ok'}" role="status">${esc(flash.text)}</p>` : ''}<div class="stats"><div><b>${counts.users}</b><span>kont</span></div><div><b>${counts.trial}</b><span>w próbie</span></div><div><b>${counts.paid}</b><span>z abonamentem</span></div><div><b>${counts.expired}</b><span>wygasłych</span></div><div><b>${counts.blocked}</b><span>zablokowanych</span></div></div>
<div class="card" style="margin:0 0 30px"><h2>Nadaj dostęp</h2><form method="post" action="/admin/act">${hidden('do', 'grant')}<div class="grid2"><div class="fld"><label for="ge">E-mail</label><input id="ge" type="email" name="email" required autocapitalize="off"></div><div class="fld"><label for="ga">Aplikacja</label><select id="ga" name="app">${opts}</select></div><div class="fld"><label for="gm">Okres</label><select id="gm" name="months"><option value="1">1 miesiąc</option><option value="6">6 miesięcy</option><option value="12">12 miesięcy</option></select></div><div class="fld"><label for="gu">Albo do dnia</label><input id="gu" type="date" name="until"></div><div class="fld"><label for="gn">Notatka</label><input id="gn" type="text" name="note" maxlength="120" placeholder="np. faktura 12/2026"></div></div><button class="btn" type="submit">Nadaj</button></form><p class="fine">Miesiące dolicza się do dotychczasowego końca abonamentu (albo do dziś, gdy wygasł). Data wygrywa z okresem.</p></div>
<h2>Konta</h2><form method="get" action="/admin" style="display:flex;gap:10px;margin:0 0 14px"><input type="text" name="q" value="${esc(q)}" placeholder="Szukaj po e-mailu" aria-label="Szukaj po e-mailu"><button class="btn" type="submit">Szukaj</button></form><div class="tw"><table><thead><tr><th>E-mail</th><th>Aplikacja</th><th>Stan</th><th>Próba od</th><th>Abonament do</th><th>Notatka</th><th></th></tr></thead><tbody>${body}</tbody></table></div><h2 style="margin-top:34px">Ostatnie zmiany</h2><ul class="log">${logHtml || '<li>Brak.</li>'}</ul>` });
}
