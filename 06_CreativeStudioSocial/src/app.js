/* POWŁOKA: zakładki, menu, projekty, wersje, eksport/import, asystent treści, status integracji, O autorze, Sugestie */
const S = {
  tab: 'brand',
  mods: { brand: Brand, ideas: Ideas, creative: Creative, video: Video, audio: AudioStudio, publish: Publish },
  names: [['brand', 'Marka'], ['ideas', 'Pomysły'], ['creative', 'Grafiki'], ['audio', 'Audio'], ['video', 'Wideo'], ['publish', 'Publikacja']],
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
// Pakiet projektu: project.json + wszystkie zasoby (ZIP bez kompresji). pr: progressModal. Zwraca {z, n} albo null (anulowano).
async function buildProjectZip(pr) {
  await saveNow(); const files = [], all = (await DBI.all('assets')).filter((a) => a.pid === P.cur.id); files.push({ name: 'project.json', data: JSON.stringify({ app: APP.name, ver: APP.ver, project: P.cur }) });
  for (const [i, a] of all.entries()) { pr.set(i / Math.max(1, all.length), a.name); const { blob, ...meta } = a; files.push({ name: 'assets/' + a.id + '.json', data: JSON.stringify(meta) }); files.push({ name: 'assets/' + a.id + '.bin', data: blob }); await tick(); if (pr.cancel) return null; }
  return { z: await makeZip(files), n: all.length };
}
async function exportProject() {
  const pr = progressModal('Eksport projektu'); try {
    const r = await buildProjectZip(pr); pr.close(); if (!r) return; download(r.z, fname('projekt', 'zip')); toast('Zapisano pakiet projektu (' + r.n + ' zasobów, ' + fmtSize(r.z.size) + ')', 'ok');
  } catch (e) { pr.close(); toast('Eksport projektu nieudany: ' + errText(e), 'bad', 9000); }
}
// ── Numeracja rolek i folder na Drive ──
// Numer = litera typu (R rolka, K karuzela, P post) + 3 cyfry, np. R001. Nadawany raz na początku, na stałe, nigdy nie używany ponownie.
// Źródło prawdy: arkusz „Lista rolek” na Drive (folder „Śmiało – Rolki”). Studio zna numery z rolki.json (topics[].num) i z nazw folderów na Drive.
// Folder rolki: Materiały/R001-Efekt reflektora (w produkcji) → Opublikowane/R001-Efekt reflektora (po publikacji).
const NUM_RE = /^([RKP])(\d{3,})(?=$|[-\s])/;
const stripNum = (s) => String(s || '').replace(/^[RKP]\d{3,}\s*[-–:]?\s*/, '').replace(/^T\d{2,}\s+/, '').trim();
function planItem(id) { return id ? ((Publish.topics || []).find((x) => x.id === id) || (Publish.plan || []).find((x) => x.id === id) || null) : null; }
function reelNum(p) { p = p || P.cur; const pb = (p && p.publish) || {}; if (pb.num) return pb.num; const t = planItem(pb.planId); return (t && t.num) || ''; }
function reelTitle(p) { p = p || P.cur; const pb = p.publish || {}; return stripNum((pb.auto && pb.auto.title) || pb.title || p.name) || 'Rolka'; }
function reelFolderName(p) { p = p || P.cur; const n = reelNum(p), t = reelTitle(p).replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim(); return ((n ? n + '-' : '') + t).slice(0, 90) || 'Rolka'; }
function reelDone(p) { p = p || P.cur; const pb = p.publish || {}; if (pb.done) return true; const t = planItem(pb.planId); return !!(t && /^opublikowan/i.test(t.status || '')); }
function reelPath(p) { p = p || P.cur; return DriveUp.path(reelFolderName(p), reelDone(p)); }
// Kolejny wolny numer danego typu: największy znany (rolki.json, projekty w tej przeglądarce, licznik lokalny, foldery na Drive) + 1
async function nextNum(typ) {
  await Publish.loadPlan(); let max = (Publish.pool && +Publish.pool[typ]) || 0;
  const note = (s) => { const m = NUM_RE.exec(String(s || '')); if (m && m[1] === typ) max = Math.max(max, +m[2]); };
  for (const t of [...(Publish.topics || []), ...(Publish.plan || [])]) note(t.num);
  for (const p of await listProjects()) note((p.publish || {}).num);
  try { max = Math.max(max, +localStorage.getItem('css-num-' + typ) || 0); } catch { /* brak pamięci */ }
  if (DriveUp.cfg()) { try { const n = await DriveUp.names(); for (const k of Object.keys(n)) for (const nm of n[k] || []) note(nm); } catch (e) { console.warn('Numeracja bez Drive:', e); } }
  try { localStorage.setItem('css-num-' + typ, String(max + 1)); } catch { /* brak pamięci */ }
  return typ + String(max + 1).padStart(3, '0');
}
function newReelPrompt() { return newReelDialog(); }
// Archiwum rolki na Drive: folder „numer-tytuł” w Materiały (albo Opublikowane, gdy rolka już wyszła) ze wszystkim w jednym miejscu:
// rolka, podkład muzyczny, miniatura, opis i hashtagi, projekt Studia (ZIP ze wszystkimi materiałami). Ponowna archiwizacja nadpisuje pliki o tych samych nazwach.
async function archiveProject() {
  if (!DriveUp.cfg()) { DriveUp.setup(() => archiveProject()); return; }
  await Publish.loadPlan(); const p = P.cur, pb = p.publish || (p.publish = {}), sub = reelPath(), nm = reelFolderName(); let r;
  const pr = progressModal('Archiwizacja projektu'); try { r = await buildProjectZip(pr); pr.close(); if (!r) return; } catch (e) { pr.close(); toast('Archiwizacja nieudana: ' + errText(e), 'bad', 9000); return; }
  try {
    const opt = { draft: true, sub, replace: true }, extra = [], pf = nm + ' - '; // nazwy plików: „R001-Efekt reflektora - rolka (final).mp4” (numer w nazwie, gdy plik wyląduje poza folderem)
    const zip = await DriveUp.deliver(r.z, pf + 'projekt Studia.zip', Object.assign({ mime: 'application/zip' }, opt)); if (!zip) return;
    if (pb.video) { const b = await Assets.blob(pb.video); if (b) { const v = await DriveUp.deliver(b, pf + 'rolka (final).mp4', opt); if (v) extra.push('rolka'); } }
    const used = new Set(); for (const rl of p.reels || []) for (const a of rl.audio || []) if (a.track === 'music' && a.assetId) used.add(a.assetId);
    for (const id of used) { const rec = await Assets.rec(id); if (rec && rec.blob) { const ext = (/\.[a-z0-9]{2,4}$/i.exec(rec.name || '') || ['.mp3'])[0], bn = String(rec.name || 'podkład').replace(/\.[a-z0-9]{2,4}$/i, '').replace(/[\\/:*?"<>|]+/g, ' ').trim(); const m = await DriveUp.deliver(rec.blob, pf + 'podkład muzyczny (' + bn + ')' + ext, Object.assign({ mime: rec.blob.type || 'audio/mpeg' }, opt)); if (m) extra.push('podkład'); } }
    if (pb.cover) { const b = await Assets.blob(pb.cover); if (b) { const c = await DriveUp.deliver(b, pf + 'miniatura.png', Object.assign({ mime: 'image/png' }, opt)); if (c) extra.push('miniatura'); } }
    const cap = [pb.title ? 'Tytuł: ' + pb.title : '', pb.caption || '', pb.hashtags || ''].filter(Boolean).join('\n\n'); if (cap) { await DriveUp.text(pf + 'opis i hashtagi.txt', cap + '\n', sub); extra.push('opis'); }
    p.archived = { ts: Date.now(), name: nm, path: sub, folder: zip.folder || '' }; touch(); await saveNow();
    modal('Rolka zarchiwizowana na Drive', h('div', {}, h('div', { style: { lineHeight: '1.7' } }, 'Folder: ', zip.folder ? h('a', { href: zip.folder, target: '_blank', rel: 'noopener' }, sub) : sub), h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('W folderze: projekt Studia (ZIP ze wszystkimi materiałami)' + (extra.length ? ', ' + extra.join(', ') : '') + '. Żeby wrócić do projektu: pobierz ZIP z folderu i wybierz (⋯ → Import projektu (ZIP)).') })),
      [{ t: '➕ Nowa rolka', cls: 'pri', fn: newReelPrompt }, { t: 'Zostań w tym projekcie' }]);
    if (typeof Publish !== 'undefined' && S.tab === 'publish') Publish.render();
  } catch (e) { console.error(e); modal('Archiwizacja na Drive nieudana', h('div', {}, h('div', { class: 'warnrow bad' }, errText(e)), h('div', { class: 'hint', style: { marginTop: '8px' } }, 'Sprawdź (⚙ Drive) albo pobierz ZIP z projektem (⋯ → Eksport projektu) i przeciągnij go do folderu na Drive.')), [{ t: 'Zamknij' }]); }
}
// Rolka wyszła: folder przechodzi z Materiały do Opublikowane (cały folder z plikami). Studio nie edytuje arkusza „Lista rolek”: status i datę wpisuje Agent John.
async function markPublished() {
  if (!DriveUp.cfg()) { DriveUp.setup(() => markPublished()); return; }
  await Publish.loadPlan(); const p = P.cur, pb = p.publish || (p.publish = {}), nm = reelFolderName(), from = DriveUp.path(nm, false), to = DriveUp.DIR_DONE;
  try {
    if (!reelDone(p)) { await DriveUp.mkdir(from); const r = await DriveUp.move(from, to); if (p.archived) { p.archived.path = DriveUp.path(nm, true); if (r && r.folder) p.archived.folder = r.folder; } }
    pb.done = true; pb.doneTs = pb.doneTs || Date.now(); touch(); await saveNow();
    if (typeof Publish !== 'undefined' && S.tab === 'publish') Publish.render();
    toast(nm + ': folder jest w Opublikowane. Status w Liście rolek zaktualizuje Agent John.', 'ok', 7000);
  } catch (e) { console.error(e); toast('Nie przeniesiono folderu: ' + errText(e), 'bad', 10000); }
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
// Status projektu: pusty (bez grafik, rolek, plików użytkownika, opisu) albo lista zawartości. Pliki marki (logo, fonty, wzorce) się nie liczą.
const BRAND_KINDS = ['logo', 'font', 'ref'];
function projContent(p, assets) {
  const pb = p.publish || {}, parts = [], a = (assets || []).filter((x) => !BRAND_KINDS.includes(x.kind));
  if ((p.posts || []).length) parts.push(p.posts.length + ' grafik');
  if ((p.reels || []).length) parts.push(p.reels.length + ' rolek');
  if (a.length) parts.push(a.length + ' plików');
  if (p.audio && (p.audio.takes || []).length) parts.push('nagrania');
  if (pb.video) parts.push('wyeksportowana rolka');
  if (pb.cover) parts.push('miniatura');
  if ((pb.caption || '').trim() || (pb.hashtags || '').trim()) parts.push('opis');
  return { empty: !parts.length, parts, planId: pb.planId || '', archived: p.archived || null };
}
async function projInfos(list) { const by = {}; for (const a of await DBI.all('assets')) (by[a.pid] = by[a.pid] || []).push(a); const o = {}; for (const p of list) o[p.id] = projContent(p, by[p.id]); return o; }
async function deleteProject(p) { for (const a of (await DBI.all('assets')).filter((a) => a.pid === p.id)) await Assets.del(a.id); for (const v of await DBI.byIndex('versions', 'pid', p.id)) await DBI.del('versions', v.id); await DBI.del('projects', p.id); }
async function projectsDialog() {
  await saveNow(); const list = await listProjects(), inf = await projInfos(list), box = h('div', { class: 'zebra' });
  const empties = list.filter((p) => inf[p.id].empty && !inf[p.id].planId && !(P.cur && p.id === P.cur.id));
  const m = modal('Projekty', h('div', {}, h('div', { class: 'hint', style: { marginBottom: '8px' } }, list.length + ' w tej przeglądarce. „Pusty” = bez grafik, rolek, własnych plików i opisu.'), box), [
    { t: '➕ Nowa rolka', cls: 'pri', fn: () => newReelDialog() },
    ...(empties.length ? [{ t: '🗑 Usuń puste (' + empties.length + ')', cls: 'bad', fn: async (close) => { if (!await askYes('Usunąć ' + empties.length + ' pustych projektów bez tematu? W nich nic nie ma, bieżący projekt zostaje.', 'Usuń', 'bad')) return false; for (const p of empties) await deleteProject(p); close(); toast('Usunięto puste projekty: ' + empties.length, 'ok'); projectsDialog(); return false; } }] : []),
    { t: 'Zamknij' }]);
  for (const p of list) {
    const i = inf[p.id], isCur = P.cur && p.id === P.cur.id, st = i.empty ? (i.planId ? 'temat ' + i.planId + ', bez materiałów' : 'pusty') : i.parts.join(', ');
    box.append(h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 10px' } },
      h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { fontWeight: 600 } }, p.name + (isCur ? '  (otwarty)' : '')),
        h('div', { class: 'fine', style: { color: i.empty ? 'var(--warn)' : 'var(--ok)' } }, (i.empty ? '○ ' : '● ') + st + (i.planId && !i.empty ? ' · temat ' + i.planId : '')),
        i.archived ? h('div', { class: 'fine' }, '☁ Drive: ' + i.archived.name + ' · ' + new Date(i.archived.ts).toLocaleDateString('pl-PL')) : null,
        h('div', { class: 'fine' }, 'Zmieniono ' + new Date(p.updated).toLocaleString('pl-PL'))),
      h('button', { class: 'btn sm pri', onclick: async () => { await saveNow(); await openProject(p.id); m.close(); } }, 'Otwórz'),
      h('button', { class: 'btn sm bad', onclick: async () => { if (!await askYes('Usunąć projekt „' + p.name + '” (' + st + ') wraz z zasobami? Tego nie da się cofnąć.', 'Usuń', 'bad')) return; await deleteProject(p); if (P.cur && P.cur.id === p.id) { const rest = await listProjects(); if (rest.length) await openProject(rest[0].id); else await createProject('Pusta rolka'); } m.close(); projectsDialog(); } }, 'Usuń')));
  }
}
async function createProject(name) { const p = newProject(name); await DBI.put('projects', p); await openProject(p.id); }
// Nowa rolka: temat z listy planu (rolki.json → topics) albo pusta rolka. Każda rolka dostaje numer od początku (R001…). Pusty bieżący projekt jest używany ponownie.
async function startReel(title, topic, typ) {
  await saveNow(); await Publish.loadPlan(); const num = (topic && topic.num) || await nextNum(typ || 'R'), name = num + ' ' + title;
  const list = await listProjects(), inf = await projInfos(list), ci = P.cur && inf[P.cur.id]; let reused = false;
  if (ci && ci.empty) { reused = true; P.cur.name = name; }
  else { const np = newProject(name); await DBI.put('projects', np); await openProject(np.id); }
  const pb = P.cur.publish; pb.planId = topic ? topic.id : ''; pb.title = topic ? topic.title : ''; pb.num = num; pb.done = false; pb.auto = null;
  touch(); await saveNow(); if (reused) bus.emit('project');
  if (DriveUp.cfg()) DriveUp.mkdir(reelPath()).catch((e) => console.warn('Folder rolki na Drive:', e)); // folder od razu: numer jest widoczny na Drive i nie zostanie nadany drugi raz
  toast(name + ': ' + (reused ? 'użyłem pustego projektu, nie powstał kolejny.' : 'nowy projekt gotowy.'), 'ok', 6000);
}
// Spontaniczny pomysł na rolkę: 1-2 zdania, zapis jako nowy wiersz (status „pomysł”) w arkuszu „Lista rolek” na Drive; okno zostaje otwarte na kolejny pomysł
function ideaDialog() {
  const ta = h('textarea', { rows: 3, maxlength: 280, placeholder: 'Pomysł na rolkę w 1-2 zdaniach, np. „Dlaczego po przerwie wracamy z za dużym ciężarem i jak tego uniknąć”', style: { width: '100%' } }), cnt = h('span', { class: 'fine fix' }, '0/280'),
    typ = h('select', { 'aria-label': 'Typ', class: 'fix', style: { width: 'auto' } }, h('option', { value: 'R' }, 'Rolka'), h('option', { value: 'K' }, 'Karuzela'), h('option', { value: 'P' }, 'Post')), out = h('div', { style: { marginTop: '8px' } });
  ta.addEventListener('input', () => { cnt.textContent = ta.value.length + '/280'; });
  modal('💡 Spontaniczny pomysł', h('div', {}, h('div', { class: 'hint', style: { marginBottom: '6px' }, html: rich('Pomysł trafia jako nowy wiersz (status „pomysł”) do arkusza „Lista rolek” na Drive, razem z pozostałymi. Numer i dopracowanie nadaje potem Agent John.') }), ta, h('div', { class: 'row', style: { marginTop: '6px' } }, typ, cnt), out),
    [{ t: '💾 Zapisz do Listy rolek', cls: 'pri', keep: true, fn: async () => {
      const text = ta.value.trim(); if (!text) { toast('Wpisz pomysł (1-2 zdania).', 'warn'); return false; }
      out.innerHTML = ''; out.append(h('div', { class: 'hint' }, 'Zapisuję w Liście rolek…')); const r = await QuickIdea.save(text, typ.value); out.innerHTML = '';
      if (r.ok) {
        out.append(h('div', { class: 'warnrow', style: { borderColor: 'var(--ok)' } }, h('b', {}, (r.dup ? '✔ Ten pomysł już jest w Liście rolek' : '✔ Zapisano w Liście rolek') + ' (wiersz ' + r.row + '). '), r.url ? h('a', { href: r.url, target: '_blank', rel: 'noopener' }, 'Otwórz arkusz') : null)); ta.value = ''; cnt.textContent = '0/280'; ta.focus(); toast('Pomysł zapisany w Liście rolek (wiersz ' + r.row + ').', 'ok');
      } else if (r.pending) {
        out.append(h('div', { class: 'warnrow bad' }, 'Nie zapisano w arkuszu: ' + r.err), h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Pomysł czeka w kolejce w tej przeglądarce i sam wyśle się, gdy naprawisz Drive (przy zapisie kolejnego pomysłu albo po odświeżeniu strony).'), h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sm', onclick: () => DriveUp.setup(() => QuickIdea.flush(true)) }, '⚙ Ustawienia Drive'), h('button', { class: 'btn sm', onclick: async () => { const n = await QuickIdea.flush(true); if (n) out.innerHTML = ''; } }, 'Wyślij ponownie'))); ta.value = ''; cnt.textContent = '0/280';
      } else out.append(h('div', { class: 'warnrow bad' }, r.err));
      return false;
    } }, { t: 'Zamknij' }]);
  setTimeout(() => ta.focus(), 40);
}
async function newReelDialog() {
  await saveNow(); await Publish.loadPlan(); const topics = Publish.topics || [], list = await listProjects(), inf = await projInfos(list), cur = P.cur, curEmpty = !!(cur && inf[cur.id] && inf[cur.id].empty), by = {};
  for (const p of list) { const k = inf[p.id].planId; if (k && !by[k]) by[k] = p; }
  let m; const go = async (title, topic, typ) => { m.close(); await startReel(title, topic, typ); };
  const nm = h('input', { type: 'text', value: 'Rolka bez tematu ' + new Date().toLocaleDateString('pl-PL'), style: { flex: 1, minWidth: 0 } });
  const typ = h('select', { title: 'Typ: numer to litera typu i 3 cyfry' }, h('option', { value: 'R' }, 'Rolka (R)'), h('option', { value: 'K' }, 'Karuzela (K)'), h('option', { value: 'P' }, 'Post (P)'));
  const box = h('div', { style: { maxHeight: '50vh', overflow: 'auto' } });
  for (const [pr, ttl] of [[1, 'Priorytet 1 (pierwsze 4 tygodnie)'], [2, 'Priorytet 2 (rezerwa)'], [3, 'Partia 2 (dowody w ig-04)']]) {
    const key = (t, i) => { const m = NUM_RE.exec(t.num || ''); return m ? 'RKP'.indexOf(m[1]) * 1e6 + (+m[2]) : 3e6 + i; }, ts = topics.map((t, i) => [t, key(t, i)]).filter(([t]) => (t.prio || 3) === pr).sort((x, y) => x[1] - y[1]).map(([t]) => t); if (!ts.length) continue; const z = h('div', { class: 'zebra' }); box.append(h('h3', {}, ttl), z);
    for (const t of ts) {
      const ex = by[t.id], isCur = ex && cur && ex.id === cur.id, done = /^opublikowan/.test(t.status || ''), held = t.status === 'wstrzymane';
      let act;
      if (ex && !isCur) act = h('button', { class: 'btn sm', onclick: async () => { m.close(); await saveNow(); await openProject(ex.id); } }, 'Otwórz projekt');
      else if (isCur) act = h('span', { class: 'fine' }, 'bieżący projekt');
      else if (done) act = h('span', { class: 'fine' }, 'opublikowana');
      else if (t.num) act = h('button', { class: 'btn sm pri', onclick: () => go(t.title, t) }, held ? 'Wybierz mimo to' : 'Wybierz');
      else act = h('span', { style: { display: 'flex', gap: '4px' }, title: 'Temat nie ma jeszcze numeru (format do ustalenia). Wybierz format, a numer nada się od razu.' }, h('button', { class: 'btn sm pri', onclick: () => go(t.title, t, 'R') }, 'jako rolka'), h('button', { class: 'btn sm', onclick: () => go(t.title, t, 'K') }, 'jako karuzela'));
      z.append(h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', padding: '7px 10px' } }, h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { fontWeight: 600 } }, (t.num || 'bez numeru') + ' · ' + t.title), h('div', { class: 'fine' }, [t.format, (held || done) ? t.status : '', 'bank ' + t.id, t.note].filter(Boolean).join(' · ')), t.hook ? h('div', { class: 'fine', style: { fontStyle: 'italic' } }, '„' + t.hook + '”') : null), act));
    }
  }
  if (!topics.length) box.append(h('div', { class: 'warnrow' }, 'Lista tematów (rolki.json) się nie wczytała. Użyj pustej rolki.'));
  m = modal('Nowa rolka', h('div', {}, h('div', { class: 'hint', style: { marginBottom: '8px' } }, curEmpty ? 'Bieżący projekt „' + cur.name + '” jest pusty, więc użyję go ponownie (nie powstanie kolejny).' : 'Bieżący projekt „' + (cur ? cur.name : '') + '” zostaje zapisany w przeglądarce (⋯ → Projekty…).'),
    h('div', { class: 'fld' }, h('label', {}, 'Pusta rolka, bez tematu (numer nadaje się od razu, kolejny wolny)'), h('div', { class: 'row', style: { gap: '8px' } }, typ, nm, h('button', { class: 'btn', onclick: () => go(nm.value.trim() || 'Rolka bez tematu', null, typ.value) }, 'Pusta rolka'))),
    h('div', { class: 'fld' }, h('label', {}, 'Albo wybierz temat z listy (hooki to propozycje robocze)')), box), [{ t: '💡 Spontaniczny pomysł', fn: () => { setTimeout(ideaDialog, 0); } }, { t: 'Anuluj' }]);
}
async function versionsDialog() {
  await snapshot('ręczna migawka'); const vs = (await DBI.byIndex('versions', 'pid', P.cur.id)).sort((a, b) => b.ts - a.ts), box = h('div', { class: 'zebra' });
  const m = modal('Wersje projektu', h('div', {}, h('div', { class: 'hint', html: rich('Migawki powstają automatycznie co 10 minut zmian, przy duplikacji i po kliknięciu tego okna. (Przywrócenie zachowuje bieżący stan jako nową migawkę.) Przechowuję 30 ostatnich.') }), box), [{ t: 'Zamknij' }]);
  for (const v of vs) box.append(h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', padding: '7px 10px' } }, h('div', { style: { flex: 1 } }, h('div', {}, new Date(v.ts).toLocaleString('pl-PL')), h('div', { class: 'fine' }, v.label + ' · ' + v.data.posts.length + ' grafik, ' + v.data.reels.length + ' rolek')), h('button', { class: 'btn sm', onclick: async () => { if (!await askYes('Przywrócić tę wersję? Bieżący stan zapiszę jako migawkę.', 'Przywróć')) return; await snapshot('przed przywróceniem'); const d = jclone(v.data); d.id = P.cur.id; await DBI.put('projects', d); await openProject(d.id); m.close(); toast('Przywrócono wersję z ' + new Date(v.ts).toLocaleString('pl-PL'), 'ok'); } }, 'Przywróć')));
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
  popMenu(anchor, [{ t: 'Projekty…', i: '📁', fn: projectsDialog }, { t: 'Nowa rolka (temat z listy lub pusta)', i: '＋', fn: newReelDialog }, { t: 'Spontaniczny pomysł na rolkę…', i: '💡', fn: ideaDialog }, { t: 'Duplikuj projekt', i: '⧉', fn: async () => { await duplicateProject(); } }, { t: 'Wersje projektu…', i: '🕘', fn: versionsDialog }, '-',
    { t: 'Archiwizuj rolkę na Drive (folder numer + nazwa)', i: '☁', fn: archiveProject }, { t: 'Eksport projektu (ZIP z zasobami)', i: '📦', fn: exportProject }, { t: 'Import projektu (ZIP)…', i: '📥', fn: async () => { const f = await pickFiles('.zip,application/zip', false); if (f[0]) await importProject(f[0]); } }, '-', { t: 'Status integracji', i: '🔌', fn: integrationsDialog }, { t: 'Skróty klawiszowe', i: '⌨', fn: shortcutsDialog }, { t: 'Sugestie', i: '💡', fn: suggestDialog }, { t: 'O autorze', i: 'ℹ', fn: aboutDialog }]);
}

// ── Start ──
async function boot() {
  $('#verTag').textContent = APP.ver; document.title = APP.name + ' ' + APP.ver; const main = $('#main'), tabs = $('#tabs');
  for (const [k, n] of S.names) { main.append(h('section', { class: 'mod', id: 'm-' + k })); tabs.append(h('button', { class: 'tab', role: 'tab', 'data-tab': k, onclick: () => S.go(k) }, n)); }
  $('#btnIdea').onclick = ideaDialog; $('#btnAI').onclick = assistantDialog; $('#btnMenu').onclick = (e) => mainMenu(e.currentTarget);
  const nm = $('#projName'); nm.addEventListener('change', () => { if (P.cur) { P.cur.name = nm.value.trim() || 'Projekt'; nm.value = P.cur.name; touch(); } });
  bus.on('project', () => { nm.value = P.cur.name; S.go(S.tab, true); });
  window.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && /^[1-6]$/.test(e.key) && !e.target.closest('input,textarea,select')) { e.preventDefault(); S.go(S.names[+e.key - 1][0]); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && P.cur && P.dirty) saveNow(); }); window.addEventListener('beforeunload', () => { if (P.cur && P.dirty) saveNow(); });
  window.addEventListener('error', (e) => { if (e.message && !/ResizeObserver/.test(e.message)) toast('Błąd aplikacji (' + APP.ver + '): ' + e.message, 'bad', 9000); }); window.addEventListener('unhandledrejection', (e) => { console.error(e.reason); toast('Błąd (' + APP.ver + '): ' + errText(e.reason), 'bad', 9000); });
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { /* opcjonalne */ }
  try {
    const last = localStorage.getItem('css-last'), list = await listProjects(); let id = list.find((p) => p.id === last) ? last : (list[0] && list[0].id);
    if (!id) { await createProject('Mój pierwszy projekt'); toast('Marka i pomysły ładują się same (Drive, Instagram). Zacznij od zakładki Pomysły: wybierz temat i kliknij „Utwórz w edytorze”.', 'info', 9000); } else await openProject(id);
  } catch (e) { console.error(e); toast('Nie udało się otworzyć bazy projektów: ' + errText(e) + '. Sprawdź, czy przeglądarka nie blokuje danych witryn (tryb prywatny).', 'bad', 15000); }
}
// ── Nowa wersja: strona bywa otwarta godzinami, a poprawki wdrażają się same. Baner „odśwież” (projekt zapisuje się automatycznie) ──
let updShown = false;
async function checkUpdate() {
  if (updShown) return;
  try {
    const r = await fetch('version.json?v=' + Date.now(), { cache: 'no-store' }); if (!r.ok) return;
    const j = await r.json(), m = /^v[\d.]+$/.test(j.ver || '') ? [0, j.ver] : null; if (!m || m[1] === APP.ver) return;
    const num = (x) => x.slice(1).split('.').map(Number); const a = num(m[1]), b = num(APP.ver); let newer = false; for (let i = 0; i < Math.max(a.length, b.length); i++) { if ((a[i] || 0) !== (b[i] || 0)) { newer = (a[i] || 0) > (b[i] || 0); break; } } if (!newer) return;
    updShown = true; const bar = h('div', { style: { position: 'fixed', left: '50%', bottom: '16px', transform: 'translateX(-50%)', zIndex: 9999, background: '#14532d', color: '#fff', padding: '10px 14px', borderRadius: '10px', boxShadow: '0 6px 24px rgba(0,0,0,.45)', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px', maxWidth: '92vw' } },
      h('span', {}, 'Dostępna nowa wersja ' + m[1] + ' (masz ' + APP.ver + '). Projekt zapisuje się sam.'),
      h('button', { class: 'btn pri', onclick: async () => { if (typeof Video !== 'undefined' && Video.exporting && !await askYes('Trwa eksport. Odświeżenie go przerwie. Odświeżyć mimo to?', 'Odśwież mimo to', 'bad')) return; try { if (P.cur && P.dirty) await saveNow(); } catch (e) { /* zapis w tle i tak działa */ } location.reload(); } }, 'Odśwież teraz'),
      h('button', { class: 'btn', onclick: () => bar.remove() }, 'Później')); document.body.append(bar);
  } catch (e) { /* brak sieci: sprawdzimy później */ }
}
setTimeout(() => { try { QuickIdea.flush(); } catch (e) { /* kolejka pomysłów: następna próba przy zapisie */ } }, 5000);
setTimeout(checkUpdate, 15000); setInterval(checkUpdate, 5 * 60 * 1000); document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
boot();
