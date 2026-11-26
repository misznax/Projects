/* POWŁOKA: zakładki, menu, projekty, wersje, eksport/import, asystent treści, status integracji, O autorze, Sugestie */
const S = {
  tab: 'brand',
  mods: { brand: Brand, ideas: Ideas, creative: Creative, video: Video, audio: AudioStudio, publish: Publish },
  names: [['brand', 'Marka'], ['ideas', 'Pomysły'], ['creative', 'Grafiki'], ['video', 'Wideo'], ['audio', 'Audio'], ['publish', 'Publikacja']],
  go(tab, force) {
    if (!P.cur) return; if (tab === this.tab && !force) return; const prev = this.mods[this.tab]; if (prev && prev.hide && tab !== this.tab) prev.hide();
    this.tab = tab; $$('.tab').forEach((b) => { b.classList.toggle('on', b.dataset.tab === tab); b.setAttribute('aria-selected', b.dataset.tab === tab); }); $$('.mod').forEach((m) => m.classList.toggle('on', m.id === 'm-' + tab));
    try { this.mods[tab].show(); } catch (e) { console.error(e); toast('Nie udało się otworzyć zakładki: ' + errText(e), 'bad', 9000); }
  },
};

// ── Czytnik ZIP (tylko nasz format: bez kompresji) ──
async function readZip(blob) {
  const buf = await blob.arrayBuffer(), dv = new DataView(buf), u8 = new Uint8Array(buf), out = [], dec = new TextDecoder(); let p = 0;
  while (p + 30 <= buf.byteLength && dv.getUint32(p, true) === 0x04034b50) {
    const method = dv.getUint16(p + 8, true), size = dv.getUint32(p + 18, true), nl = dv.getUint16(p + 26, true), el = dv.getUint16(p + 28, true); if (method !== 0) throw new Error('Skompresowany ZIP nie jest obsługiwany (użyj pliku zapisanego przez tę aplikację).');
    const name = dec.decode(u8.subarray(p + 30, p + 30 + nl)), start = p + 30 + nl + el; out.push({ name, data: u8.subarray(start, start + size) }); p = start + size;
  }
  if (!out.length) throw new Error('To nie jest pakiet projektu.'); return out;
}
async function exportProject() {
  const pr = progressModal('Eksport projektu'); try {
    await saveNow(); const files = [], all = (await DBI.all('assets')).filter((a) => a.pid === P.cur.id); files.push({ name: 'project.json', data: JSON.stringify({ app: APP.name, ver: APP.ver, project: P.cur }) });
    for (const [i, a] of all.entries()) { pr.set(i / Math.max(1, all.length), a.name); const { blob, ...meta } = a; files.push({ name: 'assets/' + a.id + '.json', data: JSON.stringify(meta) }); files.push({ name: 'assets/' + a.id + '.bin', data: blob }); await tick(); if (pr.cancel) { pr.close(); return; } }
    const z = await makeZip(files); pr.close(); download(z, fname('projekt', 'zip')); toast('Zapisano pakiet projektu (' + all.length + ' zasobów, ' + fmtSize(z.size) + ')', 'ok');
  } catch (e) { pr.close(); toast('Eksport projektu nieudany: ' + errText(e), 'bad', 9000); }
}
async function importProject(file) {
  const pr = progressModal('Import projektu'); try {
    const fs = await readZip(file), pj = fs.find((f) => f.name === 'project.json'); if (!pj) throw new Error('Brak project.json w pakiecie.'); const d = JSON.parse(new TextDecoder().decode(pj.data)); if (!d.project) throw new Error('Uszkodzony project.json.');
    const exists = await DBI.get('projects', d.project.id); const proj = d.project; if (exists) { proj.id = uid('p'); proj.name += ' (import)'; } const metas = fs.filter((f) => /^assets\/.+\.json$/.test(f.name)); let n = 0;
    for (const m of metas) { pr.set(n++ / metas.length, 'zasoby'); const meta = JSON.parse(new TextDecoder().decode(m.data)), bin = fs.find((f) => f.name === m.name.replace(/\.json$/, '.bin')); if (!bin) continue; const ex = await DBI.get('assets', meta.id); if (ex) continue; meta.blob = new Blob([bin.data], { type: meta.type || '' }); meta.pid = proj.id; await DBI.put('assets', meta); await tick(); }
    await DBI.put('projects', proj); pr.close(); await openProject(proj.id); toast('Zaimportowano projekt „' + proj.name + '”.', 'ok');
  } catch (e) { pr.close(); toast('Import nieudany: ' + errText(e), 'bad', 9000); }
}

// ── Projekty / wersje ──
async function projectsDialog() {
  const list = await listProjects(), box = h('div', { class: 'zebra' });
  const m = modal('Projekty', h('div', {}, box), [{ t: 'Zamknij' }]);
  for (const p of list) box.append(h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 10px' } }, h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { fontWeight: 600 } }, p.name + (P.cur && p.id === P.cur.id ? '  (otwarty)' : '')), h('div', { class: 'fine' }, 'Zmieniono ' + new Date(p.updated).toLocaleString('pl-PL') + ' · ' + p.posts.length + ' grafik, ' + p.reels.length + ' rolek')), h('button', { class: 'btn sm pri', onclick: async () => { await saveNow(); await openProject(p.id); m.close(); } }, 'Otwórz'), h('button', { class: 'btn sm bad', onclick: async () => { if (!confirm('Usunąć projekt „' + p.name + '” wraz z zasobami?')) return; for (const a of (await DBI.all('assets')).filter((a) => a.pid === p.id)) await Assets.del(a.id); for (const v of await DBI.byIndex('versions', 'pid', p.id)) await DBI.del('versions', v.id); await DBI.del('projects', p.id); if (P.cur && P.cur.id === p.id) { const rest = await listProjects(); if (rest.length) await openProject(rest[0].id); else await createProject('Nowy projekt'); } m.close(); projectsDialog(); } }, 'Usuń')));
}
async function createProject(name) { const p = newProject(name); await DBI.put('projects', p); await openProject(p.id); }
async function versionsDialog() {
  await snapshot('ręczna migawka'); const vs = (await DBI.byIndex('versions', 'pid', P.cur.id)).sort((a, b) => b.ts - a.ts), box = h('div', { class: 'zebra' });
  const m = modal('Wersje projektu', h('div', {}, h('div', { class: 'hint', html: rich('Migawki powstają automatycznie co 10 minut zmian, przy duplikacji i po kliknięciu tego okna. (Przywrócenie zachowuje bieżący stan jako nową migawkę.) Przechowuję 30 ostatnich.') }), box), [{ t: 'Zamknij' }]);
  for (const v of vs) box.append(h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', padding: '7px 10px' } }, h('div', { style: { flex: 1 } }, h('div', {}, new Date(v.ts).toLocaleString('pl-PL')), h('div', { class: 'fine' }, v.label + ' · ' + v.data.posts.length + ' grafik, ' + v.data.reels.length + ' rolek')), h('button', { class: 'btn sm', onclick: async () => { if (!confirm('Przywrócić tę wersję? Bieżący stan zapiszę jako migawkę.')) return; await snapshot('przed przywróceniem'); const d = jclone(v.data); d.id = P.cur.id; await DBI.put('projects', d); await openProject(d.id); m.close(); toast('Przywrócono wersję z ' + new Date(v.ts).toLocaleString('pl-PL'), 'ok'); } }, 'Przywróć')));
}

// ── Status integracji (uczciwy: co działa, co wymaga konfiguracji) ──
async function integrationsDialog() {
  const body = h('div', {}, h('div', { class: 'hint' }, 'Sprawdzam Workera…')); modal('Status integracji', body, [{ t: 'Odśwież', keep: true, fn: () => { integrationsFill(body, true); return false; } }, { t: 'Zamknij' }]); integrationsFill(body);
}
async function integrationsFill(body, force) {
  body.innerHTML = ''; body.append(h('div', { class: 'hint' }, 'Sprawdzam Workera…')); const s = await AI.status(force); body.innerHTML = '';
  const rows = [
    ['Edytor grafik, wideo, audio, eksport MP4', 'ok', 'działa w przeglądarce, bez serwera', ''],
    ['Zapis projektów (IndexedDB w tej przeglądarce)', 'ok', 'działa', 'Dane są tylko na tym urządzeniu. Użyj menu → „Eksport projektu” jako kopii. Synchronizacja w chmurze: planowana (v0.03, wymaga R2).'],
    ['Asystent tekstu (scenariusze, opisy, karuzele)', s.error ? 'bad' : (s.ai && (s.ai.claude || s.ai.llama) ? 'ok' : 'bad'), s.error ? 'Worker nie odpowiada: ' + s.error : (s.ai && s.ai.claude ? 'Claude (klucz ustawiony)' : s.ai && s.ai.llama ? 'Llama (Workers AI, bez klucza)' : 'brak modelu'), 'Jakość najlepsza z kluczem ANTHROPIC_API_KEY w Workerze.'],
    ['Obrazy AI (FLUX schnell)', s.error ? 'bad' : (s.img && s.img.flux ? 'ok' : 'bad'), s.img && s.img.flux ? 'Workers AI' : 'niedostępne', 'Bez zachowania tożsamości osób: do portretów użyj własnych zdjęć.'],
    ['Rozpoznawanie mowy (Whisper)', s.error ? 'bad' : (s.ai && s.ai.stt ? 'ok' : 'bad'), s.ai && s.ai.stt ? 'Workers AI' : 'niedostępne', 'Napisy i transkrypcja.'],
    ['Analiza obrazów referencyjnych przez model (vision)', s.ckey ? 'ok' : 'warn', s.ckey ? 'klucz Claude ustawiony' : 'wymaga konfiguracji', 'Bez klucza działa lokalna analiza kolorów i jasności. Ustaw sekret ANTHROPIC_API_KEY (GitHub Actions / Cloudflare).'],
    ['Instagram / YouTube / TikTok / Facebook: publikacja przez API', 'warn', 'wymaga konfiguracji', 'W v0.02: pakiet do wgrania + otwarcie stron nadawczych. Automat wymaga publicznego magazynu plików (R2) oraz tokenów (Metricool lub Meta Graph, YouTube Data API, TikTok Content Posting API z audytem aplikacji). Plan: v0.03.'],
    ['Kodowanie MP4 AAC (WebCodecs) w tej przeglądarce', 'info', 'sprawdzane przy eksporcie', 'Chrome na Windows/macOS: H.264 + AAC. Inne: tryb awaryjny.'],
  ];
  body.append(h('table', { class: 'qc' }, ...rows.map(([n, st, v, hint]) => h('tr', {}, h('td', {}, h('div', {}, n), hint ? h('div', { class: 'fine' }, hint) : null), h('td', {}, h('span', { class: 'tag ' + ({ ok: 'ok', warn: 'warn', bad: 'bad', info: 'off' }[st]) }, v))))));
  try { const est = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null, per = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : null; if (est) body.append(h('div', { class: 'hint', style: { marginTop: '8px' }, html: rich('Pamięć przeglądarki: (' + fmtSize(est.usage || 0) + ' z ' + fmtSize(est.quota || 0) + '), trwałość: ' + (per ? 'tak' : 'nie gwarantowana') + '.') })); } catch (e) { /* brak API */ }
}

// ── Asystent treści ──
function assistantDialog() {
  const brief = h('textarea', { rows: 4, placeholder: 'np. „Rolka: 3 błędy w przysiadzie, które niszczą kolana. Pokazuję poprawną technikę.”' }), dur = h('select', {}, [15, 30, 45, 60, 90].map((v) => h('option', { value: v, selected: v === 30 }, v + ' s'))), style = h('select', {}, [['dynamic', 'Dynamiczny'], ['calm', 'Spokojny'], ['punchy', 'Mocny']].map(([v, n]) => h('option', { value: v }, n))), out = h('div', {});
  const m = modal('Asystent treści', h('div', {}, h('div', { class: 'fld' }, h('label', {}, 'Pomysł / temat'), brief), h('div', { class: 'row' }, h('div', { class: 'fld' }, h('label', {}, 'Długość rolki'), dur), h('div', { class: 'fld' }, h('label', {}, 'Styl animacji'), style)), h('div', { class: 'hint', html: rich('Z jednego pomysłu powstaje (koncepcja, hook, sceny, tekst lektora, opis i hashtagi, karuzela). Każdy element możesz potem przerobić ręcznie.') }), out),
    [{ t: 'Zaplanuj', cls: 'pri', keep: true, fn: async () => {
      if (!brief.value.trim()) { toast('Wpisz pomysł.', 'warn'); return false; } out.innerHTML = ''; out.append(h('div', { class: 'hint' }, 'AI układa plan… (do 30 s)'));
      try {
        const plan = await assistantPlan(brief.value.trim(), { dur: +dur.value }); out.innerHTML = ''; if (!plan || !Array.isArray(plan.scenes) || !plan.scenes.length) throw new Error('Model nie zwrócił scen.');
        out.append(h('div', { class: 'card', style: { marginTop: '10px' } }, h('div', { html: rich('Koncepcja: ' + (plan.concept || '—')) }), h('div', { html: rich('Hook: „' + (plan.hook || '—') + '”') }), h('table', { class: 'qc', style: { marginTop: '8px' } }, ...plan.scenes.map((s, i) => h('tr', {}, h('td', {}, (i + 1) + '.'), h('td', {}, (s.dur || 4) + ' s'), h('td', {}, h('b', {}, s.title || ''), s.voice ? h('div', { class: 'fine' }, 'Lektor: ' + s.voice) : null))))), plan.music ? h('div', { class: 'hint', html: rich('Muzyka: ' + plan.music) }) : null,
          h('div', { class: 'row', style: { marginTop: '10px' } }, h('button', { class: 'btn pri', onclick: async () => { m.close(); const r = await Video.fromPlan(plan, { style: style.value }); S.go('video', true); toast('Utworzono rolkę „' + r.name + '”. Skrypt lektora czeka w zakładce Audio.', 'ok', 7000); } }, 'Utwórz rolkę'), plan.carousel && plan.carousel.length ? h('button', { class: 'btn', onclick: () => { m.close(); const sl = plan.carousel.map((c, i) => { const kind = TPL_KINDS.some((k) => k[0] === c.kind) ? c.kind : (i === 0 ? 'cover' : i === plan.carousel.length - 1 ? 'cta' : 'point'), sc = makeScene(kind, Object.assign({}, c, { total: plan.carousel.length, idx: i, num: i }), 'post45', i); sc.id = uid('s'); return sc; }); Creative.newPost('post45', (plan.concept || 'Karuzela').slice(0, 28), sl); S.go('creative', true); toast('Utworzono karuzelę (' + sl.length + ' slajdów).', 'ok'); } }, 'Utwórz karuzelę') : null,
            h('button', { class: 'btn', onclick: () => { const p = P.cur.publish; if (plan.caption) p.caption = plan.caption; if (plan.hashtags) p.hashtags = [].concat(plan.hashtags).map((x) => '#' + String(x).replace(/^#/, '')).join(' '); if (plan.hook && !p.title) p.title = String(plan.hook).slice(0, 90); touch(); toast('Wstawiono opis i hashtagi do Publikacji.', 'ok'); } }, 'Wstaw opis do Publikacji')));
      } catch (e) { out.innerHTML = ''; out.append(h('div', { class: 'hint', style: { color: 'var(--bad)' } }, 'Nie udało się: ' + errText(e))); }
      return false;
    } }, { t: 'Zamknij' }]);
}

// ── O autorze / Sugestie / skróty ──
function aboutDialog() {
  modal('O autorze', h('div', {}, h('div', { style: { fontSize: '20px', fontWeight: 700 } }, APP.name), h('div', { class: 'fine' }, 'Wersja ' + APP.ver), h('p', {}, 'Autor: ' + APP.author), h('p', { class: 'hint', html: rich('Studio do tworzenia treści na Instagram, YouTube, TikTok i Facebook: grafiki, rolki, dźwięk i publikacja w jednym miejscu. (Dane projektów zostają w Twojej przeglądarce.)') }), h('p', { class: 'fine' }, 'Strona: ', h('a', { href: 'https://smialo.org', target: '_blank', rel: 'noopener', style: { color: 'var(--acc2)' } }, 'smialo.org'), ' · kontakt: ' + APP.mail), h('p', { class: 'fine' }, 'Użyte biblioteki: mp4-muxer (MIT). Przetwarzanie dźwięku: własny kod (bez GPL).')), [{ t: 'Zamknij' }]);
}
function suggestDialog() {
  const t = h('textarea', { rows: 6, placeholder: 'Co sprawiłoby, że ta aplikacja byłaby jeszcze lepsza?' }), a = h('a', { class: 'btn pri', target: '_blank', rel: 'noopener' }, 'Wyślij e-mailem'), msg = h('div', { class: 'hint' }), upd = () => { a.href = 'mailto:' + APP.mail + '?subject=' + encodeURIComponent(APP.name + ' ' + APP.ver + ' – sugestia') + '&body=' + encodeURIComponent(t.value); }; t.addEventListener('input', upd); upd();
  modal('Sugestie', h('div', {}, t, h('div', { class: 'row', style: { marginTop: '8px' } }, a, h('button', { class: 'btn', onclick: async () => { try { await navigator.clipboard.writeText(t.value); msg.textContent = 'Skopiowano. Wklej w wiadomości na ' + APP.mail + '.'; } catch (e) { t.select(); msg.textContent = 'Zaznaczone — skopiuj (Ctrl/Cmd+C) i wyślij na ' + APP.mail + '.'; } } }, 'Kopiuj')), msg), [{ t: 'Zamknij' }]);
}
function shortcutsDialog() {
  const rows = [['Ctrl+1…6', 'Przełącz zakładki'], ['Ctrl+Z / Ctrl+Y', 'Cofnij / ponów (Grafiki, Wideo)'], ['Spacja', 'Odtwarzaj / pauza (Wideo, Audio)'], ['S', 'Przetnij klip w miejscu kursora (Wideo)'], ['Delete', 'Usuń zaznaczoną warstwę / klip'], ['Ctrl+D', 'Duplikuj warstwę / klip'], ['Strzałki', 'Przesuń warstwę o 1 px (Shift: 10 px); w Wideo: klatka po klatce'], ['Home / End', 'Początek / koniec rolki'], ['Dwuklik na tekście', 'Edytuj tekst warstwy']];
  modal('Skróty klawiszowe', h('table', { class: 'qc' }, ...rows.map(([k, v]) => h('tr', {}, h('td', {}, h('b', {}, k)), h('td', {}, v)))), [{ t: 'Zamknij' }]);
}
function mainMenu(anchor) {
  popMenu(anchor, [{ t: 'Projekty…', i: '📁', fn: projectsDialog }, { t: 'Nowy projekt', i: '＋', fn: async () => { const n = prompt('Nazwa projektu:', 'Projekt ' + new Date().toLocaleDateString('pl-PL')); if (n) { await saveNow(); await createProject(n); } } }, { t: 'Duplikuj projekt', i: '⧉', fn: async () => { await duplicateProject(); } }, { t: 'Wersje projektu…', i: '🕘', fn: versionsDialog }, '-',
    { t: 'Eksport projektu (ZIP z zasobami)', i: '📦', fn: exportProject }, { t: 'Import projektu (ZIP)…', i: '📥', fn: async () => { const f = await pickFiles('.zip,application/zip', false); if (f[0]) await importProject(f[0]); } }, '-', { t: 'Status integracji', i: '🔌', fn: integrationsDialog }, { t: 'Skróty klawiszowe', i: '⌨', fn: shortcutsDialog }, { t: 'Sugestie', i: '💡', fn: suggestDialog }, { t: 'O autorze', i: 'ℹ', fn: aboutDialog }]);
}

// ── Start ──
async function boot() {
  $('#verTag').textContent = APP.ver; document.title = APP.name + ' ' + APP.ver; const main = $('#main'), tabs = $('#tabs');
  for (const [k, n] of S.names) { main.append(h('section', { class: 'mod', id: 'm-' + k })); tabs.append(h('button', { class: 'tab', role: 'tab', 'data-tab': k, onclick: () => S.go(k) }, n)); }
  $('#btnAI').onclick = assistantDialog; $('#btnMenu').onclick = (e) => mainMenu(e.currentTarget);
  const nm = $('#projName'); nm.addEventListener('change', () => { if (P.cur) { P.cur.name = nm.value.trim() || 'Projekt'; nm.value = P.cur.name; touch(); } });
  bus.on('project', () => { nm.value = P.cur.name; S.go(S.tab, true); });
  window.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && /^[1-6]$/.test(e.key) && !e.target.closest('input,textarea,select')) { e.preventDefault(); S.go(S.names[+e.key - 1][0]); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && P.cur && P.dirty) saveNow(); }); window.addEventListener('beforeunload', () => { if (P.cur && P.dirty) saveNow(); });
  window.addEventListener('error', (e) => { if (e.message && !/ResizeObserver/.test(e.message)) toast('Błąd aplikacji: ' + e.message, 'bad', 9000); }); window.addEventListener('unhandledrejection', (e) => { console.error(e.reason); toast('Błąd: ' + errText(e.reason), 'bad', 9000); });
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* opcjonalne */ }
  try {
    const last = localStorage.getItem('css-last'), list = await listProjects(); let id = list.find((p) => p.id === last) ? last : (list[0] && list[0].id);
    if (!id) { await createProject('Mój pierwszy projekt'); toast('Marka i pomysły ładują się same (Drive, Instagram). Zacznij od zakładki Pomysły: wybierz temat i kliknij „Utwórz w edytorze”.', 'info', 9000); } else await openProject(id);
  } catch (e) { console.error(e); toast('Nie udało się otworzyć bazy projektów: ' + errText(e) + '. Sprawdź, czy przeglądarka nie blokuje danych witryn (tryb prywatny).', 'bad', 15000); }
}
boot();
