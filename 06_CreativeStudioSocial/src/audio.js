/* AUDIO STUDIO: nagrywanie, edycja fali, obróbka głosu (szum, EQ, kompresja, de-ess, cisza), tempo i wysokość niezależnie, raport jakości */
const FX_DEF = () => ({ dc: { on: false, sens: 0.5 }, dn: { on: false, amount: 0.6, reverb: false }, sl: { on: false, thresh: -45, minMs: 450, keepMs: 140 }, eq: { on: false, preset: 'glos' }, ds: { on: false, amount: 0.5 }, cp: { on: false, thresh: -20, ratio: 3, makeup: 3 }, tempo: { on: false, pct: 100 }, pitch: { on: false, semi: 0 }, norm: { on: false, target: -16, tp: -1 } });
const micErr = (e) => ({ NotAllowedError: 'Dostęp do mikrofonu jest zablokowany. Kliknij ikonę kłódki obok adresu strony, wybierz Mikrofon i zezwól.', NotFoundError: 'Nie znaleziono mikrofonu. Podłącz go i spróbuj ponownie.', NotReadableError: 'Mikrofon jest zajęty przez inną aplikację. Zamknij ją i spróbuj ponownie.', SecurityError: 'Przeglądarka blokuje mikrofon na tej stronie (wymagane HTTPS).' }[e && e.name] || ('Nie udało się uruchomić mikrofonu: ' + errText(e)));

const AudioStudio = {
  built: false, sel: null, cur: 0, view: null, playing: false, ac: null, src: null, qcCache: new Map(), peaksCache: null,
  get A() { return P.cur.audio; },
  get take() { return this.A.takes.find((t) => t.id === this.A.cur) || null; },
  fx() { const d = FX_DEF(), f = this.A.fx || (this.A.fx = {}); for (const k of Object.keys(d)) f[k] = Object.assign(d[k], f[k] || {}); return f; },
  async audio() { const t = this.take; return t ? Assets.audio(t.assetId) : null; },
  async addTake(chs, fs, name, parent, kind) { const id = await Assets.putAudio(chs, fs, name + '.wav', kind || 'voice'), t = { id: uid('t'), name, assetId: id, dur: chs[0].length / fs, created: Date.now(), parent: parent || null }; this.A.takes.unshift(t); if (this.A.takes.length > 40) this.A.takes.length = 40; this.A.cur = t.id; this.sel = null; this.cur = 0; this.view = null; touch(); return t; },

  build() {
    const root = $('#m-audio'); root.innerHTML = '';
    this.left = h('div', { class: 'panel' }); this.right = h('div', { class: 'panel r' }); this.center = h('div', { class: 'pad', style: { overflow: 'auto', minWidth: 0 } }); root.append(this.left, this.center, this.right); this.built = true;
    this.cv = h('canvas', { 'aria-label': 'Kształt fali nagrania' }); this.wave = h('div', { class: 'wave' }, this.cv); this.scr = h('input', { type: 'range', min: 0, max: 1000, value: 0, style: { width: '100%' }, 'aria-label': 'Przewijanie widoku fali', oninput: () => this.onScroll() });
    this.timeEl = h('span', { style: { fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--acc)', minWidth: '150px' } }); this.meter = h('div', { class: 'meter', style: { width: '160px' } }, h('i'));
    this.playBtn = h('button', { class: 'btn pri', onclick: () => this.toggle(), title: 'Spacja' }, '▶ Odtwarzaj');
    const b = (t, fn, ti, c) => h('button', { class: 'btn sm ' + (c || ''), onclick: fn, title: ti || '' }, t);
    this.edit = h('div', { class: 'row', style: { marginTop: '8px' } }, b('Przytnij do zaznaczenia', () => this.opTrim(), 'Zostaw tylko zaznaczony fragment'), b('Wytnij zaznaczenie', () => this.opCut(), 'Usuń zaznaczony fragment, resztę sklej'), b('Wycisz zaznaczenie', () => this.opSilence()), b('Fade-in', () => this.opFade('in'), 'Narastanie głośności na początku zaznaczenia (lub nagrania)'), b('Fade-out', () => this.opFade('out')), b('Zaznacz całość', () => { const t = this.take; if (t) { this.sel = { a: 0, b: t.dur }; this.draw(); } }));
    this.scriptEl = h('textarea', { rows: 6, placeholder: 'Tekst lektora (zostanie wyświetlony podczas nagrywania). Możesz go pobrać z Asystenta.', oninput: (e) => { this.A.script = e.target.value; touch(); } }); this.scriptEl.value = this.A.script || '';
    this.center.append(h('div', { class: 'row', style: { marginBottom: '8px' } }, this.playBtn, h('button', { class: 'btn fix', onclick: () => this.stop(), title: 'Stop' }, '■'), this.timeEl, h('span', { style: { flex: 1 } }), this.meter, b('＋', () => this.zoomBy(0.6), 'Przybliż falę'), b('－', () => this.zoomBy(1 / 0.6), 'Oddal falę'), b('Całość', () => { this.view = null; this.draw(); })), this.wave, this.scr, this.edit,
      h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('Kliknij falę = kursor, przeciągnij = zaznaczenie, kółko myszy = zoom. (Każda obróbka tworzy nowe nagranie, oryginał zostaje.)') }), h('h3', {}, 'Skrypt lektora'), this.scriptEl, h('div', { class: 'row', style: { marginTop: '6px' } }, b('Pobierz z rolki (asystent)', () => { const s = this.A.script; if (!s) toast('Skrypt pojawi się po zaplanowaniu rolki w Asystencie.', 'warn'); }), b('Wyczyść', () => { this.A.script = ''; this.scriptEl.value = ''; touch(); })));
    this.wave.addEventListener('pointerdown', (e) => this.waveDown(e)); this.wave.addEventListener('wheel', (e) => { e.preventDefault(); this.zoomBy(e.deltaY > 0 ? 1.25 : 0.8, this.xToT(e.clientX)); }, { passive: false }); this.wave.addEventListener('dblclick', () => { const t = this.take; if (t) { this.sel = { a: 0, b: t.dur }; this.draw(); } });
    new ResizeObserver(() => this.draw()).observe(this.wave); window.addEventListener('keydown', (e) => { if (S.tab === 'audio' && e.key === ' ' && !e.target.closest('input,textarea,select,.modal,button')) { e.preventDefault(); this.toggle(); } });
  },
  show() { if (!this.built) this.build(); this.scriptEl.value = this.A.script || ''; if (!this.take && this.A.takes.length) this.A.cur = this.A.takes[0].id; this.panels(); this.draw(); },
  hide() { this.stop(); },
  panels() { this.leftPanel(); this.rightPanel(); this.draw(); },

  leftPanel() {
    const L = this.left, tk = this.A.takes; L.innerHTML = '';
    L.append(h('div', { class: 'ph' }, 'Nagrania głosu'), h('div', { class: 'sec' }, h('div', { class: 'row' }, h('button', { class: 'btn pri', onclick: () => this.record() }, '🎙 Nagraj'), h('button', { class: 'btn', onclick: async () => { const fs = await pickFiles('audio/*,video/*', true); for (const f of fs) await this.importFile(f); } }, '📁 Wgraj plik'), h('button', { class: 'btn', title: 'Nagrania z telefonu z folderu Creative Studio > Audio Input na Google Drive', onclick: () => this.driveModal() }, '☁ Z Drive'))));
    const list = h('div', { class: 'zebra' }); tk.forEach((t) => list.append(h('div', { class: 'take' + (t.id === this.A.cur ? ' on' : ''), onclick: () => { this.stop(); this.A.cur = t.id; this.sel = null; this.cur = 0; this.view = null; this.panels(); } }, h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, (t.parent ? '↳ ' : '') + t.name), h('span', { style: { display: 'flex', gap: '4px', alignItems: 'center' } }, h('span', { class: 'fine' }, fmtTime(t.dur)), h('button', { class: 'btn sm', title: 'Więcej', onclick: (e) => { e.stopPropagation(); this.takeMenu(e.currentTarget, t); } }, '⋯')))));
    L.append(tk.length ? list : h('div', { class: 'sec hint', html: rich('Brak nagrań. Nagraj głos mikrofonem, wgraj plik (MP3, WAV, M4A, a także ścieżkę z pliku wideo) albo pobierz nagranie z telefonu przez „☁ Z Drive”.') }));
    L.append(h('div', { class: 'ph' }, 'Muzyka i efekty'), h('div', { class: 'sec' }, h('div', { class: 'row' }, h('button', { class: 'btn', onclick: async () => { const fs = await pickFiles('audio/*', true); for (const f of fs) await this.importAsset(f, 'music'); } }, '🎵 Wgraj muzykę'), h('button', { class: 'btn', onclick: async () => { const fs = await pickFiles('audio/*', true); for (const f of fs) await this.importAsset(f, 'sfx'); } }, '🔔 Wgraj efekt')), h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('Używaj muzyki, do której masz prawa (np. własna, z licencją). (Aplikacja nie dołącza żadnej muzyki.)') })), h('div', { class: 'zebra', id: 'musLib' }));
    this.musList();
  },
  async musList() {
    const box = $('#musLib', this.left); if (!box) return; const items = (await Assets.list()).filter((a) => a.kind === 'music' || a.kind === 'sfx'); box.innerHTML = '';
    for (const a of items) box.append(h('div', { class: 'take' }, h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, (a.kind === 'music' ? '🎵 ' : '🔔 ') + a.name), h('span', { style: { display: 'flex', gap: '4px' } }, h('button', { class: 'btn sm', title: 'Odsłuchaj', onclick: async () => { const A = await Assets.audio(a.id); this.playChs(A.chs, A.fs, 0, null); } }, '▶'), h('button', { class: 'btn sm', title: 'Dodaj do rolki', onclick: () => this.assetToReel(a) }, '＋ rolka'), h('button', { class: 'btn sm bad', title: 'Usuń z biblioteki', onclick: async () => { if (await askYes('Usunąć „' + a.name + '”?', 'Usuń', 'bad')) { await Assets.del(a.id); this.musList(); } } }, '🗑'))));
  },
  async assetToReel(a) {
    const p = P.cur; if (!p.reels.length) { const r = newReel('Rolka 1'); p.reels.push(r); p.curReel = r.id; } const r = p.reels.find((x) => x.id === p.curReel) || p.reels[0]; p.curReel = r.id; const m = p.mix, music = a.kind === 'music';
    r.audio.push({ id: uid('au'), track: music ? 'music' : 'sfx', assetId: a.id, name: a.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 30), t0: 0, in: 0, dur: music ? r.dur : Math.min(a.dur || 2, r.dur), srcDur: a.dur || 0, gain: music ? m.musicDb : -6, fi: music ? 1 : 0.01, fo: music ? 1.5 : 0.03, loop: music, duck: music }); touch(); toast('Dodano do rolki „' + r.name + '” (zakładka Wideo).', 'ok');
  },
  async takeToReel(t) {
    const p = P.cur; if (!p.reels.length) { const r = newReel('Rolka 1'); p.reels.push(r); p.curReel = r.id; } const r = p.reels.find((x) => x.id === p.curReel) || p.reels[0]; p.curReel = r.id; const t0 = r.audio.filter((a) => a.track === 'voice').reduce((m, a) => Math.max(m, a.t0 + a.dur), 0);
    r.audio.push({ id: uid('au'), track: 'voice', assetId: t.assetId, name: t.name.slice(0, 30), t0, in: 0, dur: t.dur, srcDur: t.dur, gain: 0, fi: 0.01, fo: 0.03, loop: false, duck: false }); if (t0 + t.dur > r.dur) r.dur = Math.ceil(t0 + t.dur); touch(); toast('Dodano głos do rolki „' + r.name + '” (zakładka Wideo).', 'ok');
  },
  takeMenu(anchor, t) {
    popMenu(anchor, [{ t: 'Dodaj do rolki jako głos', i: '🎞', fn: () => this.takeToReel(t) }, { t: 'Transkrypcja (Whisper)…', i: '📝', fn: () => this.transcribe(t) }, { t: 'Pobierz WAV', i: '⬇', fn: async () => { const A = await Assets.audio(t.assetId); download(new Blob([DSP.wav(A.chs, A.fs, 24)], { type: 'audio/wav' }), fname(slug(t.name), 'wav')); } }, { t: 'Zmień nazwę…', i: '✎', fn: async () => { const n = await askText('Nazwa nagrania', t.name); if (n) { t.name = n; touch(); this.leftPanel(); } } }, '-', { t: 'Usuń nagranie', i: '🗑', fn: async () => { if (!await askYes('Usunąć „' + t.name + '”? (Klipy użyte w rolkach przestaną grać.)')) return; this.A.takes = this.A.takes.filter((x) => x !== t); if (this.A.cur === t.id) this.A.cur = this.A.takes[0] ? this.A.takes[0].id : null; touch(); this.panels(); } }]);
  },
  // ── Z Google Drive: folder „Creative Studio > Audio Input” udostępniony linkiem (Worker pośredniczy: api/s/drive/*) ──
  driveId(s) { s = String(s || '').trim(); const m = s.match(/\/folders\/([\w-]{10,})/) || s.match(/[?&]id=([\w-]{10,})/) || (/^[\w-]{10,}$/.test(s) ? [0, s] : null); return m ? m[1] : ''; },
  driveErr(j, st) { return ({ private: 'Folder nie jest udostępniony linkiem. W Drive: prawy klik na folderze → Udostępnij → Dostęp ogólny → „Każdy, kto ma link” (Wyświetlający).', not_found: 'Nie znaleziono folderu lub pliku. Sprawdź link.', rate: 'Limit zapytań na godzinę. Spróbuj za chwilę.', too_big: 'Plik większy niż 250 MB.', bad: 'Nieprawidłowy link.', net: 'Worker nie połączył się z Google Drive: ' + ((j && j.msg) || '') }[j && j.code]) || (st === 403 ? 'Odmowa dostępu (403). Zaloguj się ponownie (Cloudflare Access).' : 'Błąd Drive (HTTP ' + st + ((j && j.msg) ? ': ' + j.msg : '') + ')'); },
  async driveFetchList(id) { let r; try { r = await fetch('api/s/drive/list?id=' + encodeURIComponent(id)); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); } let j = {}; try { j = await r.json(); } catch { /* nie JSON */ } if (!r.ok) throw new Error(this.driveErr(j, r.status)); return j.files || []; },
  async driveDownload(f, pr) {
    let r; try { r = await fetch('api/s/drive/get?id=' + encodeURIComponent(f.id)); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); }
    if (!r.ok) { let j = {}; try { j = await r.json(); } catch { /* nie JSON */ } throw new Error(this.driveErr(j, r.status)); }
    const tot = +r.headers.get('content-length') || 0, parts = []; let got = 0;
    if (r.body && r.body.getReader) { const rd = r.body.getReader(); for (;;) { if (pr.cancel) { rd.cancel(); throw new Error('przerwano'); } const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; pr.set(tot ? Math.min(0.95, got / tot) : 0.5, (got / 1e6).toFixed(1) + (tot ? ' / ' + (tot / 1e6).toFixed(1) : '') + ' MB'); } }
    else parts.push(new Uint8Array(await r.arrayBuffer()));
    if (!got && !parts.length) throw new Error('pusty plik'); return new File(parts, f.name, { type: r.headers.get('content-type') || '' });
  },
  driveModal() {
    const KEY = 'css-drive-folder', DK = 'css-drive-done', AUD = /\.(m4a|mp3|wav|aac|ogg|oga|opus|flac|aif|aiff|caf|amr|3gp|wma|mp4|m4v|mov|webm)$/i;
    let done = []; try { done = JSON.parse(localStorage.getItem(DK) || '[]'); } catch { done = []; }
    const box = h('div', { class: 'drv' }), M = modal('☁ Nagrania z Google Drive', box, [{ t: 'Zamknij' }]);
    const save = () => { try { localStorage.setItem(DK, JSON.stringify(done.slice(-300))); } catch { /* brak miejsca */ } };
    const imp = async (f, mark) => {
      const pr = progressModal('Pobieranie z Drive: ' + f.name);
      try { const file = await this.driveDownload(f, pr); pr.close(); const ok = await this.importFile(file); if (ok) { if (!done.includes(f.id)) done.push(f.id); save(); if (mark) mark(); } return ok; }
      catch (e) { pr.close(); toast('Drive: ' + errText(e), 'bad', 9000); return false; }
    };
    const setup = () => {
      const inp = h('input', { type: 'text', placeholder: 'https://drive.google.com/drive/folders/…', style: { width: '100%', margin: '8px 0' } });
      box.innerHTML = '';
      box.append(
        h('div', { class: 'hint' }, 'Jednorazowa konfiguracja (ok. 1 min):'),
        h('div', { style: { margin: '6px 0', lineHeight: '1.5' } }, '1. W Drive utwórz folder „Creative Studio”, a w nim „Audio Input”.', h('br'), '2. Prawy klik na „Audio Input” → Udostępnij → Dostęp ogólny → „Każdy, kto ma link” (Wyświetlający).', h('br'), '3. Skopiuj link do folderu i wklej tutaj:'),
        inp,
        h('div', { class: 'hint' }, 'Link zapisuje się tylko w tej przeglądarce. Kto zna link, może odsłuchać pliki z tego folderu, więc nie wrzucaj tam nic prywatnego.'),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn pri', onclick: () => { const v = this.driveId(inp.value); if (!v) { toast('To nie wygląda na link do folderu Google Drive.', 'bad'); return; } try { localStorage.setItem(KEY, v); } catch { /* tryb prywatny */ } show(v); } }, 'Zapisz i pokaż nagrania')));
      setTimeout(() => inp.focus(), 30);
    };
    const show = async (id) => {
      box.innerHTML = ''; box.append(h('div', { class: 'hint' }, 'Wczytuję listę z Drive…'));
      let files; try { files = await this.driveFetchList(id); } catch (e) { box.innerHTML = ''; box.append(h('div', { class: 'warnrow bad' }, errText(e)), h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => show(id) }, '↻ Spróbuj ponownie'), h('button', { class: 'btn', onclick: () => { try { localStorage.removeItem(KEY); } catch { /* */ } setup(); } }, 'Zmień folder'))); return; }
      const aud = files.filter((f) => !f.folder && AUD.test(f.name)).sort((a, b) => b.name.localeCompare(a.name, 'pl', { numeric: true })), other = files.length - aud.length;
      box.innerHTML = '';
      const marks = {}, list = h('div', { class: 'zebra', style: { maxHeight: '48vh', overflow: 'auto' } });
      const rowFor = (f) => {
        const st = h('span', { class: 'hint' }, done.includes(f.id) ? '✓ wczytano' : ''), btn = h('button', { class: 'btn', onclick: async () => { btn.disabled = true; await imp(f, upd); btn.disabled = false; } }, done.includes(f.id) ? 'Wczytaj ponownie' : 'Wczytaj');
        const upd = () => { st.textContent = '✓ wczytano'; btn.textContent = 'Wczytaj ponownie'; };
        marks[f.id] = upd; return h('div', { class: 'take', style: { cursor: 'default', alignItems: 'center' } }, h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: f.name }, f.name, f.date ? h('span', { class: 'hint' }, '  ·  ' + f.date) : null), st, btn);
      };
      aud.forEach((f) => list.append(rowFor(f)));
      const left = () => aud.filter((f) => !done.includes(f.id)), hdr = h('div', { class: 'hint', style: { marginBottom: '6px' } }), bulk = h('button', { class: 'btn pri', onclick: async (e) => { e.target.disabled = true; for (const f of left()) { if (!(await imp(f, marks[f.id]))) break; } e.target.disabled = false; } });
      const upBulk = () => { const n = left().length; hdr.textContent = aud.length ? aud.length + ' nagr. w folderze' + (other ? ' (pominięto ' + other + ' innych plików)' : '') + ', nowych: ' + n : files.length ? 'Brak plików audio w folderze (' + files.length + ' innych).' : 'Folder jest pusty. Wrzuć nagranie z telefonu do „Audio Input” i odśwież.'; bulk.textContent = 'Wczytaj nowe (' + n + ')'; bulk.style.display = n ? '' : 'none'; };
      Object.keys(marks).forEach((k) => { const u = marks[k]; marks[k] = () => { u(); upBulk(); }; }); upBulk();
      box.append(hdr, aud.length ? list : null,
        h('div', { class: 'row', style: { marginTop: '8px' } },
          bulk,
          h('button', { class: 'btn', onclick: () => show(id) }, '↻ Odśwież'), h('button', { class: 'btn', onclick: () => { try { localStorage.removeItem(KEY); } catch { /* */ } setup(); } }, 'Zmień folder')));
    };
    let id = ''; try { id = this.driveId(localStorage.getItem(KEY) || ''); } catch { id = ''; }
    if (id) show(id); else setup();
    return M;
  },
  async importFile(f) { const pr = progressModal('Wczytywanie ' + f.name); try { pr.set(0.3, 'dekodowanie'); const A = await Assets.decode(f); pr.set(0.8, 'zapis'); const t = await this.addTake(A.chs, A.fs, f.name.replace(/\.[a-z0-9]+$/i, '').slice(0, 40)); pr.close(); this.panels(); toast('Wczytano: ' + t.name + ' (' + fmtTime(t.dur) + ')', 'ok'); return true; } catch (e) { pr.close(); toast('Nie udało się wczytać „' + f.name + '”: ' + errText(e), 'bad', 9000); return false; } },
  async importAsset(f, kind) { try { const id = await Assets.add(f, kind), rec = await Assets.rec(id); if (rec.err) throw new Error(rec.err); this.musList(); toast('Dodano: ' + f.name, 'ok'); } catch (e) { toast('Nie udało się dodać pliku: ' + errText(e), 'bad', 8000); } },

  // ── Nagrywanie: okno z edytowalnym prompterem (zmiana rozmiaru, przeciąganie, powolne przewijanie) ──
  async record() {
    let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 } }); } catch (e) { toast(micErr(e), 'bad', 10000); return; }
    const ac = new AudioContext(), an = ac.createAnalyser(); an.fftSize = 1024; ac.createMediaStreamSource(stream).connect(an); const rec = new MediaRecorder(stream), chunks = []; rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    const cfg = this.A.prompter = Object.assign({ size: 44, wpm: 110, align: 'left', col: 'center', width: 92, mirror: false, guide: true, auto: true }, this.A.prompter || {});
    const mt = h('div', { class: 'meter', style: { flex: 1 } }, h('i')), tm = h('div', { style: { fontSize: '26px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', minWidth: '70px' } }, '0:00'), peak = h('div', { class: 'fine', style: { flex: 2 } }, 'Poziom szczytowy: —'), st = { t0: 0, run: false, pk: -90, raf: 0 }, buf = new Float32Array(an.fftSize);
    const ta = h('textarea', { spellcheck: false, 'aria-label': 'Tekst lektora (edytowalny)', placeholder: 'Wpisz lub wklej tekst lektora. Zapisuje się w skrypcie projektu.' }); ta.value = this.A.script || '';
    const wrap = h('div', { class: 'rec-pr' }, ta), guide = h('div', { class: 'rec-guide' }); wrap.append(guide);
    const sc = { on: false, pos: 0, last: 0 }, words = () => (ta.value.trim().match(/\S+/g) || []).length, total = () => Math.max(0, ta.scrollHeight - ta.clientHeight);
    const lab = h('span', { class: 'fine', style: { whiteSpace: 'nowrap' } }), bScroll = h('button', { class: 'btn sm', title: 'Start/pauza przewijania (Spacja poza polem tekstu)', onclick: () => setScroll(!sc.on) });
    const setScroll = (on) => { if (on && sc.pos >= total() - 1) { sc.pos = 0; ta.scrollTop = 0; } sc.on = on; sc.last = performance.now(); bScroll.textContent = on ? '⏸ Pauza' : '▶ Przewijaj'; bScroll.classList.toggle('on', on); };
    const eta = () => { const w = words(), s = w / Math.max(20, cfg.wpm) * 60; lab.textContent = cfg.wpm + ' słów/min · cały tekst ~' + fmtTime(s) + ' (' + w + ' słów)'; };
    const layout = () => { const H = wrap.clientHeight, W = wrap.clientWidth; ta.style.fontSize = cfg.size + 'px'; ta.style.lineHeight = '1.45'; ta.style.textAlign = cfg.align; ta.style.padding = Math.round(H * 0.38) + 'px 24px ' + Math.round(H * 0.62) + 'px'; const w = Math.round(W * cfg.width / 100); ta.style.width = w + 'px'; ta.style.left = cfg.col === 'left' ? '0' : cfg.col === 'right' ? (W - w) + 'px' : Math.round((W - w) / 2) + 'px'; ta.style.transform = cfg.mirror ? 'scaleX(-1)' : ''; guide.style.display = cfg.guide ? '' : 'none'; guide.style.top = Math.round(H * 0.38) + 'px'; guide.style.height = Math.round(cfg.size * 1.45) + 'px'; eta(); };
    const save = () => { touch(); layout(); };
    const loop = () => {
      an.getFloatTimeDomainData(buf); let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v)); const db = DSP.dB(m); st.pk = Math.max(st.pk, db); mt.firstChild.style.width = clamp((db + 60) / 60 * 100, 0, 100) + '%';
      if (st.run) { tm.textContent = fmtTime((performance.now() - st.t0) / 1000); peak.textContent = 'Poziom szczytowy: ' + st.pk.toFixed(1) + ' dBFS' + (st.pk > -1 ? ' ▲ za głośno, odsuń mikrofon' : st.pk < -24 && performance.now() - st.t0 > 2500 ? ' ▲ za cicho, zbliż mikrofon' : ''); }
      const now = performance.now(); if (sc.on) { const T = Math.max(3, words() / Math.max(20, cfg.wpm) * 60), v = total() / T; sc.pos = Math.min(total(), sc.pos + v * (now - sc.last) / 1000); ta.scrollTop = sc.pos; if (sc.pos >= total() - 0.5) setScroll(false); } sc.last = now; st.raf = requestAnimationFrame(loop);
    };
    ta.addEventListener('scroll', () => { if (Math.abs(ta.scrollTop - sc.pos) > 2) sc.pos = ta.scrollTop; }); // ręczne przewinięcie (kółko, pasek) przesuwa punkt startu
    ta.addEventListener('input', () => { this.A.script = ta.value; if (this.scriptEl) this.scriptEl.value = ta.value; touch(); eta(); });
    const cleanup = () => { cancelAnimationFrame(st.raf); stream.getTracks().forEach((t) => t.stop()); ac.close(); ro.disconnect(); document.removeEventListener('keydown', onKey); back.remove(); };
    const bStart = h('button', { class: 'btn pri', onclick: () => { if (!st.run) { chunks.length = 0; rec.start(); st.run = true; st.t0 = performance.now(); st.pk = -90; bStart.textContent = '■ Zatrzymaj'; if (cfg.auto) setScroll(true); } else { rec.stop(); st.run = false; setScroll(false); bStart.disabled = true; bStart.textContent = 'Zapisywanie…'; } } }, '● Nagrywaj');
    const rng = (key, min, max, step, fmt, cb) => { const v = h('span', { class: 'fine', style: { minWidth: '34px', textAlign: 'right' } }), i = h('input', { type: 'range', min, max, step, value: cfg[key], style: { flex: 1, minWidth: '70px' } }), upd = () => { v.textContent = fmt(cfg[key]); }; i.oninput = () => { cfg[key] = +i.value; upd(); (cb || save)(); }; upd(); return [i, v]; };
    const chk = (key, label) => { const i = h('input', { type: 'checkbox', checked: !!cfg[key] }); i.onchange = () => { cfg[key] = i.checked; save(); }; return h('label', { class: 'fine', style: { display: 'inline-flex', gap: '4px', alignItems: 'center', whiteSpace: 'nowrap' } }, i, label); };
    const seg = (key, opts) => { const d = h('div', { class: 'seg', style: { flex: 'none' } }); const draw = () => [...d.children].forEach((b, i) => b.classList.toggle('on', opts[i][0] === cfg[key])); opts.forEach(([v, n, tt], i) => d.append(h('button', { title: tt || '', onclick: () => { cfg[key] = v; draw(); save(); } }, n))); draw(); return d; };
    const [rW, vW] = rng('wpm', 40, 260, 5, (x) => x + '', () => { eta(); touch(); }), [rS, vS] = rng('size', 18, 110, 1, (x) => x + ' px'), [rC, vC] = rng('width', 35, 100, 1, (x) => x + '%');
    const bFull = h('button', { class: 'btn sm', title: 'Pełny ekran / okno', onclick: () => { win.classList.toggle('full'); setTimeout(layout, 30); } }, '⛶');
    const bClose = h('button', { class: 'btn sm', onclick: async () => { if (st.run && !await askYes('Przerwać nagrywanie i odrzucić je?', 'Odrzuć nagranie', 'bad')) return; if (st.run) { rec.ondataavailable = null; try { rec.stop(); } catch (e) { /* ok */ } } cleanup(); } }, st.run ? 'Anuluj' : 'Anuluj');
    const hd = h('div', { class: 'rec-hd' }, h('span', {}, 'Nagrywanie głosu'), h('span', { class: 'fine', style: { flex: 1 } }, 'przeciągnij za ten pasek · rozciągnij za prawy dolny róg'), bFull, bClose);
    const tool1 = h('div', { class: 'rec-tools' }, bScroll, h('span', { class: 'fine' }, 'Tempo'), rW, vW, h('span', { class: 'fine' }, 'słów/min'), h('button', { class: 'btn sm', onclick: () => { setScroll(false); sc.pos = 0; ta.scrollTop = 0; } }, '⇧ Początek'), h('button', { class: 'btn sm', onclick: () => { setScroll(false); sc.pos = total(); ta.scrollTop = sc.pos; } }, '⇩ Koniec'), chk('auto', 'przewijaj z nagraniem'));
    const tool2 = h('div', { class: 'rec-tools' }, h('span', { class: 'fine' }, 'Tekst'), rS, vS, h('span', { class: 'fine' }, 'Szerokość'), rC, vC, seg('align', [['left', '≡', 'Tekst do lewej'], ['center', '≣', 'Tekst na środku'], ['right', '≡', 'Tekst do prawej']]), seg('col', [['left', '◧', 'Kolumna z lewej'], ['center', '▣', 'Kolumna na środku'], ['right', '◨', 'Kolumna z prawej']]), chk('mirror', 'lustro'), chk('guide', 'linia czytania'));
    const win = h('div', { class: 'modal rec-win', role: 'dialog', 'aria-label': 'Nagrywanie głosu' }, hd, h('div', { class: 'rec-tools' }, mt, tm, peak, bStart), tool1, tool2, lab, wrap, h('div', { class: 'hint' }, 'Kliknij w tekst, aby go poprawić (zapisuje się w skrypcie). Kółko myszy przewija ręcznie, tempo działa od miejsca, w którym stoisz. Nagrywam surowy sygnał, szum i głośność poprawisz potem w obróbce.'));
    const back = h('div', { class: 'modal-back rec-back' }, win); document.body.append(back);
    const pos = (() => { try { return JSON.parse(localStorage.getItem('css-recwin')) || {}; } catch (e) { return {}; } })(); const W0 = Math.min(innerWidth * 0.94, 860), H0 = Math.min(innerHeight * 0.9, 700); win.style.width = clamp(pos.w || W0, 440, innerWidth - 8) + 'px'; win.style.height = clamp(pos.h || H0, 420, innerHeight - 8) + 'px'; win.style.left = clamp(pos.x == null ? (innerWidth - (pos.w || W0)) / 2 : pos.x, 0, Math.max(0, innerWidth - 120)) + 'px'; win.style.top = clamp(pos.y == null ? (innerHeight - (pos.h || H0)) / 2 : pos.y, 0, Math.max(0, innerHeight - 60)) + 'px';
    const keep = () => { if (win.classList.contains('full')) return; try { localStorage.setItem('css-recwin', JSON.stringify({ x: win.offsetLeft, y: win.offsetTop, w: win.offsetWidth, h: win.offsetHeight })); } catch (e) { /* opcjonalne */ } };
    const ro = new ResizeObserver(() => { layout(); keep(); }); ro.observe(wrap); ro.observe(win);
    hd.addEventListener('pointerdown', (e) => { if (e.target.closest('button') || win.classList.contains('full')) return; const x0 = e.clientX - win.offsetLeft, y0 = e.clientY - win.offsetTop; const mv = (ev) => { win.style.left = clamp(ev.clientX - x0, -win.offsetWidth + 120, innerWidth - 120) + 'px'; win.style.top = clamp(ev.clientY - y0, 0, innerHeight - 40) + 'px'; }, up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); keep(); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); });
    const onKey = (e) => { if (e.key === ' ' && !e.target.closest('textarea,input,select,button')) { e.preventDefault(); setScroll(!sc.on); } }; document.addEventListener('keydown', onKey);
    setScroll(false); layout(); loop();
    rec.onstop = async () => { try { const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' }); cleanup(); const A = await Assets.decode(blob), d = new Date(), name = 'Nagranie ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); await this.addTake(A.chs, A.fs, name); this.panels(); toast('Zapisano: ' + name, 'ok'); } catch (e) { cleanup(); toast('Nie udało się zapisać nagrania: ' + errText(e), 'bad', 9000); } };
  },

  // ── Fala ──
  getView() { const t = this.take; if (!t) return { a: 0, b: 1 }; return this.view || { a: 0, b: t.dur }; },
  xToT(x) { const r = this.wave.getBoundingClientRect(), v = this.getView(); return clamp(v.a + (x - r.left) / r.width * (v.b - v.a), 0, this.take ? this.take.dur : 0); },
  zoomBy(k, at) { const t = this.take; if (!t) return; const v = this.getView(), c = at == null ? (v.a + v.b) / 2 : at, len = clamp((v.b - v.a) * k, 0.05, t.dur); let a = c - (c - v.a) * (len / (v.b - v.a)); a = clamp(a, 0, t.dur - len); this.view = len >= t.dur - 1e-6 ? null : { a, b: a + len }; this.draw(); },
  onScroll() { const t = this.take; if (!t || !this.view) return; const len = this.view.b - this.view.a, a = (this.scr.value / 1000) * (t.dur - len); this.view = { a, b: a + len }; this.draw(true); },
  waveDown(e) {
    const t = this.take; if (!t || e.button !== 0) return; e.preventDefault(); const t0 = this.xToT(e.clientX), x0 = e.clientX; let moved = false;
    const mv = (ev) => { if (Math.abs(ev.clientX - x0) > 3) moved = true; if (!moved) return; const t1 = this.xToT(ev.clientX); this.sel = { a: Math.min(t0, t1), b: Math.max(t0, t1) }; this.draw(); };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (!moved) { this.sel = null; this.cur = t0; if (this.playing) this.play(); } this.draw(); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  },
  async draw(noScr) {
    const cv = this.cv, t = this.take, dpr = Math.min(devicePixelRatio || 1, 2), w = this.wave.clientWidth, hh = this.wave.clientHeight; if (!w) return; if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(hh * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(hh * dpr); }
    const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, hh); x.fillStyle = '#0b0e10'; x.fillRect(0, 0, w, hh);
    if (!t) { x.fillStyle = '#8b98a0'; x.font = '14px Segoe UI'; x.textAlign = 'center'; x.fillText('Nagraj głos lub wgraj plik, aby zobaczyć falę', w / 2, hh / 2); this.timeEl.textContent = '0:00.0 / 0:00.0'; return; }
    const A = await this.audio(); if (!A || this.take !== t) return; const v = this.getView(), fs = A.fs, a = Math.floor(v.a * fs), b = Math.min(A.chs[0].length, Math.ceil(v.b * fs)), n = Math.floor(w);
    x.strokeStyle = '#2a3338'; x.beginPath(); x.moveTo(0, hh / 2); x.lineTo(w, hh / 2); x.stroke(); const pk = DSP.peaks(A.chs[0], n, a, b), pk2 = A.chs[1] ? DSP.peaks(A.chs[1], n, a, b) : pk;
    x.fillStyle = '#17b3a3'; for (let i = 0; i < n; i++) { const mx = Math.max(pk[2 * i + 1], pk2[2 * i + 1]), mn = Math.min(pk[2 * i], pk2[2 * i]); x.fillRect(i, hh / 2 - mx * hh * 0.46, 1, Math.max(1, (mx - mn) * hh * 0.46)); }
    if (this.sel) { const s = (this.sel.a - v.a) / (v.b - v.a) * w, e = (this.sel.b - v.a) / (v.b - v.a) * w; x.fillStyle = 'rgba(196,238,60,.2)'; x.fillRect(s, 0, e - s, hh); x.fillStyle = '#c4ee3c'; x.fillRect(s, 0, 1, hh); x.fillRect(e, 0, 1, hh); }
    const cx = (this.cur - v.a) / (v.b - v.a) * w; if (cx >= 0 && cx <= w) { x.fillStyle = '#ff6b5e'; x.fillRect(cx, 0, 2, hh); }
    x.fillStyle = '#8b98a0'; x.font = '10px Segoe UI'; x.textAlign = 'left'; const step = [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 30, 60].find((s) => s / (v.b - v.a) * w >= 60) || 60; for (let s = Math.ceil(v.a / step) * step; s < v.b; s += step) { const px = (s - v.a) / (v.b - v.a) * w; x.fillRect(px, 0, 1, 6); x.fillText(fmtTime(s), px + 3, 12); }
    this.timeEl.textContent = fmtTime(this.cur) + ' / ' + fmtTime(t.dur) + (this.sel ? '  ·  zazn. ' + (this.sel.b - this.sel.a).toFixed(2) + ' s' : '');
    if (!noScr) { const len = v.b - v.a; this.scr.disabled = !this.view; this.scr.value = this.view ? Math.round(v.a / Math.max(1e-6, t.dur - len) * 1000) : 0; }
  },

  // ── Odtwarzanie ──
  toggle() { this.playing ? this.stop() : this.play(); },
  async play() { const A = await this.audio(); if (!A) return; const a = this.sel ? this.sel.a : this.cur, b = this.sel ? this.sel.b : null; this.playChs(A.chs, A.fs, a, b, true); },
  playChs(chs, fs, a, b, main) {
    this.stopSrc(); if (!this.ac) this.ac = new AudioContext(); this.ac.resume(); const buf = this.ac.createBuffer(chs.length, chs[0].length, fs); chs.forEach((c, i) => buf.copyToChannel(c, i)); const s = this.ac.createBufferSource(); s.buffer = buf; const an = this.ac.createAnalyser(); an.fftSize = 1024; s.connect(an); an.connect(this.ac.destination);
    const end = b == null ? buf.duration : b; s.start(0, a, Math.max(0.01, end - a)); this.src = s; const st0 = this.ac.currentTime, tb = new Float32Array(1024); this.playing = !!main; if (main) this.playBtn.textContent = '⏸ Pauza';
    const f = () => { if (this.src !== s) return; const t = a + (this.ac.currentTime - st0); an.getFloatTimeDomainData(tb); let m = 0; for (const v of tb) m = Math.max(m, Math.abs(v)); this.meter.firstChild.style.width = clamp((DSP.dB(m) + 60) / 60 * 100, 0, 100) + '%'; if (main) { this.cur = Math.min(t, end); this.draw(true); } if (t >= end) { this.stopSrc(); if (main) { this.playing = false; this.playBtn.textContent = '▶ Odtwarzaj'; this.cur = this.sel ? this.sel.a : 0; this.draw(); } return; } requestAnimationFrame(f); }; requestAnimationFrame(f);
  },
  stopSrc() { if (this.src) { const s = this.src; this.src = null; try { s.stop(); } catch (e) { /* ok */ } } this.meter && (this.meter.firstChild.style.width = '0%'); },
  stop() { this.stopSrc(); this.playing = false; if (this.playBtn) this.playBtn.textContent = '▶ Odtwarzaj'; },

  // ── Operacje edycyjne (nowe nagranie, oryginał zostaje) ──
  async withTake(fn, label) { const t = this.take; if (!t) { toast('Najpierw wybierz nagranie.', 'warn'); return; } const A = await this.audio(); try { const r = await fn(A.chs, A.fs, t); if (!r) return; await this.addTake(r.chs, A.fs, t.name.replace(/ · .*$/, '') + ' · ' + label, t.id); this.panels(); } catch (e) { toast('Operacja nieudana: ' + errText(e), 'bad', 8000); } },
  opTrim() { if (!this.sel) { toast('Zaznacz fragment na fali.', 'warn'); return; } const s = this.sel; return this.withTake((chs, fs) => ({ chs: chs.map((x) => x.slice(Math.floor(s.a * fs), Math.floor(s.b * fs))) }), 'przycięte'); },
  opCut() { if (!this.sel) { toast('Zaznacz fragment na fali.', 'warn'); return; } const s = this.sel; return this.withTake((chs, fs) => ({ chs: chs.map((x) => { const a = Math.floor(s.a * fs), b = Math.floor(s.b * fs), o = new Float32Array(x.length - (b - a)); o.set(x.subarray(0, a), 0); o.set(x.subarray(b), a); const f = Math.min(Math.round(0.005 * fs), a, o.length - a); for (let i = 0; i < f; i++) { const k = i / f; o[a - f + i] *= 1 - k * 0.0; o[a + i] *= k; } return o; }) }), 'wycięte'); },
  opSilence() { if (!this.sel) { toast('Zaznacz fragment na fali.', 'warn'); return; } const s = this.sel; return this.withTake((chs, fs) => ({ chs: chs.map((x) => { const o = Float32Array.from(x), a = Math.floor(s.a * fs), b = Math.floor(s.b * fs); for (let i = a; i < b; i++) o[i] = 0; return o; }) }), 'wyciszone'); },
  opFade(dir) { const s = this.sel; return this.withTake((chs, fs, t) => { const a = Math.floor((s ? s.a : 0) * fs), b = Math.floor((s ? s.b : Math.min(t.dur, 1)) * fs); return { chs: chs.map((x) => { const o = Float32Array.from(x); for (let i = a; i < b && i < o.length; i++) { const k = (i - a) / Math.max(1, b - a); o[i] *= dir === 'in' ? k : 1 - k; } return o; }) }; }, dir === 'in' ? 'fade-in' : 'fade-out'); },

  // ── Panel obróbki ──
  rightPanel() {
    const R = this.right, f = this.fx(), t = this.take; R.innerHTML = ''; const cb = () => touch();
    const step = (key, title, tip, ...fields) => h('div', { class: 'sec' }, fld({ k: key + '.on', t: 'chk', label: title }, f, cb), h('div', { class: 'hint', style: { margin: '0 0 4px 24px' } }, tip), ...fields);
    R.append(h('div', { class: 'ph' }, 'Obróbka głosu'), h('div', { class: 'sec' }, h('button', { class: 'btn sea', style: { width: '100%' }, disabled: !t, onclick: () => this.autoVoice(), title: 'Redukcja szumu, trzaski, korektor głosu, kompresja, de-esser i normalizacja jednym kliknięciem' }, '✨ Auto: popraw głos')),
      step('dc', 'Usuń trzaski i kliknięcia', 'Naprawia krótkie impulsy (np. kliknięcia ust, mikrofonu).', fld({ k: 'dc.sens', t: 'range', label: 'Czułość', min: 0.1, max: 1, step: 0.05 }, f, cb)),
      step('dn', 'Redukcja szumu', 'Odejmowanie widmowe: profil szumu z najcichszych fragmentów.', fld({ k: 'dn.amount', t: 'range', label: 'Siła', min: 0.1, max: 1, step: 0.05 }, f, cb), fld({ k: 'dn.reverb', t: 'chk', label: 'Zmniejsz pogłos (eksperymentalne)' }, f, cb)),
      step('sl', 'Usuń długie pauzy', 'Skraca ciszę dłuższą niż próg czasu, zostawia naturalny oddech.', rowOf(fld({ k: 'sl.thresh', t: 'num', label: 'Próg (dB)', min: -70, max: -20 }, f, cb), fld({ k: 'sl.minMs', t: 'num', label: 'Min. pauza (ms)', min: 100, step: 50 }, f, cb), fld({ k: 'sl.keepMs', t: 'num', label: 'Zostaw (ms)', min: 20, step: 10 }, f, cb))),
      step('eq', 'Korektor (EQ)', 'Przycina dudnienie, podbija czytelność.', fld({ k: 'eq.preset', t: 'sel', label: 'Profil', opts: [['glos', 'Głos uniwersalny'], ['meski', 'Głos męski'], ['zenski', 'Głos żeński'], ['telefon', 'Nagranie z telefonu']] }, f, cb)),
      step('ds', 'De-esser', 'Łagodzi syczące głoski s, sz, cz.', fld({ k: 'ds.amount', t: 'range', label: 'Siła', min: 0.1, max: 1, step: 0.05 }, f, cb)),
      step('cp', 'Kompresja dynamiki', 'Wyrównuje głośność mówienia.', rowOf(fld({ k: 'cp.thresh', t: 'num', label: 'Próg (dB)', min: -40, max: -5 }, f, cb), fld({ k: 'cp.ratio', t: 'num', label: 'Stosunek', min: 1.5, max: 10, step: 0.5 }, f, cb), fld({ k: 'cp.makeup', t: 'num', label: 'Wzmocnienie (dB)', min: 0, max: 12 }, f, cb))),
      step('tempo', 'Tempo bez zmiany wysokości', 'Przyspiesza lub zwalnia mowę, nie zmieniając barwy.', fld({ k: 'tempo.pct', t: 'range', label: 'Tempo', min: 60, max: 160, step: 1, unit: ' %' }, f, cb)),
      step('pitch', 'Wysokość bez zmiany tempa', 'Podnosi lub obniża głos w półtonach.', fld({ k: 'pitch.semi', t: 'range', label: 'Półtony', min: -12, max: 12, step: 0.5 }, f, cb)),
      step('norm', 'Normalizacja głośności', 'Wyrównanie do zadanej głośności z limiterem szczytów.', rowOf(fld({ k: 'norm.target', t: 'num', label: 'Cel (LUFS)', min: -24, max: -8, step: 0.5 }, f, cb), fld({ k: 'norm.tp', t: 'num', label: 'Maks. true peak (dBTP)', min: -3, max: 0, step: 0.1 }, f, cb))),
      h('div', { class: 'sec' }, h('button', { class: 'btn pri', style: { width: '100%' }, disabled: !t, onclick: () => this.applyChain() }, 'Zastosuj zaznaczone kroki (nowe nagranie)')));
    R.append(h('div', { class: 'ph' }, 'Raport jakości nagrania', h('button', { class: 'btn sm', onclick: () => { this.qcCache.clear(); this.qcBox(); } }, 'Odśwież')), h('div', { id: 'qcTake', class: 'sec' }), h('div', { class: 'ph' }, 'Miks rolki (głos + muzyka)', h('button', { class: 'btn sm', onclick: () => this.mixBox() }, 'Odśwież')), h('div', { id: 'qcMix', class: 'sec' }));
    this.qcBox(); this.mixBox();
  },
  qcTable(items) { return h('table', { class: 'qc' }, ...items.map((i) => h('tr', { title: i.hint || '' }, h('td', {}, i.k), h('td', {}, i.v), h('td', {}, h('span', { class: 'tag fix ' + i.ok }, { ok: 'OK', warn: 'uwaga', bad: 'błąd' }[i.ok]))))); },
  async qcBox() {
    const box = $('#qcTake', this.right), t = this.take; if (!box) return; box.innerHTML = ''; if (!t) { box.append(h('div', { class: 'hint' }, 'Wybierz nagranie.')); return; } let q = this.qcCache.get(t.id);
    if (!q) { box.append(h('div', { class: 'hint' }, 'Analizuję…')); await tick(); const A = await this.audio(); if (!A) return; q = DSP.qc(A.chs, A.fs, { target: this.fx().norm.target, tp: this.fx().norm.tp }); this.qcCache.set(t.id, q); } if (this.take !== t) return; box.innerHTML = ''; box.append(this.qcTable(q.items), h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Cel dla samego głosu ustawia krok „Normalizacja”. Końcowy cel (rolka) jest w ustawieniach rolki.'));
  },
  async mixBox() {
    const box = $('#qcMix', this.right); if (!box) return; box.innerHTML = ''; const p = P.cur, r = p.reels.find((x) => x.id === p.curReel); if (!r || !r.audio.length) { box.append(h('div', { class: 'hint', html: rich('Rolka nie ma jeszcze dźwięku. W zakładce (Wideo) dodaj głos, muzykę lub efekty, albo użyj „Dodaj do rolki”.') })); return; }
    box.append(h('div', { class: 'hint' }, 'Miksuję…')); try { const m = await Video.mixReel(); box.innerHTML = ''; if (!m || m.none) { box.append(h('div', { class: 'hint' }, 'Brak dźwięku do miksu.')); return; }
      box.append(this.qcTable(m.qc.items), h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => Video.exportMixWav() }, 'Pobierz miks (WAV)'), h('button', { class: 'btn sm', onclick: () => { this.stop(); this.playChs(m.chs, 48000, 0, null); } }, '▶ Odsłuchaj miks')), h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('Ducking: muzyka ścisza się o (' + p.mix.duckDepth + ' dB) pod głosem. Ustawienia: Wideo → ustawienia rolki.') }));
    } catch (e) { box.innerHTML = ''; box.append(h('div', { class: 'hint', style: { color: 'var(--bad)' } }, 'Miks nieudany: ' + errText(e))); }
  },
  autoVoice() { const f = this.fx(); Object.assign(f.dc, { on: true, sens: 0.5 }); Object.assign(f.dn, { on: true, amount: 0.6 }); Object.assign(f.eq, { on: true, preset: 'glos' }); Object.assign(f.ds, { on: true, amount: 0.5 }); Object.assign(f.cp, { on: true, thresh: -20, ratio: 3, makeup: 3 }); Object.assign(f.norm, { on: true, target: -16, tp: -1 }); f.sl.on = false; f.tempo.on = false; f.pitch.on = false; this.rightPanel(); return this.applyChain('Auto: głos'); },
  async applyChain(label) {
    const f = this.fx(), t = this.take; if (!t) { toast('Najpierw wybierz nagranie.', 'warn'); return; } const on = ['dc', 'dn', 'sl', 'eq', 'ds', 'cp', 'tempo', 'pitch', 'norm'].filter((k) => f[k].on); if (!on.length) { toast('Zaznacz co najmniej jeden krok obróbki.', 'warn'); return; }
    const pr = progressModal('Obróbka głosu'), names = { dc: 'trzaski', dn: 'redukcja szumu', sl: 'cisza', eq: 'korektor', ds: 'de-esser', cp: 'kompresja', tempo: 'tempo', pitch: 'wysokość', norm: 'normalizacja' };
    try {
      const A = await this.audio(); let chs = A.chs, fs = A.fs; const info = [];
      for (const [i, k] of on.entries()) {
        if (pr.cancel) { pr.close(); toast('Anulowano.', 'warn'); return; } pr.set(i / on.length, names[k]); await tick();
        if (k === 'dc') { const r = DSP.declick(chs, fs, f.dc.sens); chs = r.chs; info.push('trzaski ' + r.fixed); }
        else if (k === 'dn') chs = DSP.denoise(chs, fs, { amount: f.dn.amount, reverb: f.dn.reverb });
        else if (k === 'sl') { const r = DSP.removeSilence(chs, fs, { thresh: f.sl.thresh, minMs: f.sl.minMs, keepMs: f.sl.keepMs }); chs = r.chs; info.push('pauz ' + r.cuts); }
        else if (k === 'eq') chs = DSP.eq(chs, fs, DSP.EQ_PRESETS[f.eq.preset]);
        else if (k === 'ds') chs = DSP.deess(chs, fs, { amount: f.ds.amount });
        else if (k === 'cp') chs = DSP.compress(chs, fs, { thresh: f.cp.thresh, ratio: f.cp.ratio, makeup: f.cp.makeup });
        else if (k === 'tempo') chs = DSP.wsola(chs, f.tempo.pct / 100, fs);
        else if (k === 'pitch') chs = DSP.pitchShift(chs, f.pitch.semi, fs);
        else if (k === 'norm') { const r = DSP.loudnessNormalize(chs, fs, f.norm.target, f.norm.tp); chs = r.chs; info.push('gain ' + r.gain.toFixed(1) + ' dB'); }
      }
      pr.set(0.95, 'zapis'); const tk = await this.addTake(chs, fs, t.name.replace(/ · .*$/, '') + ' · ' + (typeof label === 'string' ? label : on.map((k) => names[k]).join(', ')).slice(0, 40), t.id); pr.close(); this.panels(); toast('Gotowe: nowe nagranie „' + tk.name + '” (oryginał zachowany). ' + info.join(', '), 'ok', 6000);
    } catch (e) { pr.close(); console.error(e); toast('Obróbka nieudana: ' + errText(e), 'bad', 9000); }
  },
  async transcribe(t) {
    const pr = progressModal('Transkrypcja'); try { pr.set(0.3, 'wysyłanie do Whisper (Worker)'); const A = await Assets.audio(t.assetId), seg = await AI.stt(wav16k(A.chs, A.fs)); pr.close(); const txt = seg.map((s) => s.text.trim()).join(' ');
      modal('Transkrypcja: ' + t.name, h('div', {}, h('textarea', { rows: 10, value: txt, readonly: true }), h('div', { class: 'hint', style: { marginTop: '6px' } }, seg.length + ' segmentów.')), [{ t: 'Wstaw do skryptu', cls: 'pri', fn: () => { this.A.script = txt; this.scriptEl.value = txt; touch(); } }, { t: 'Zamknij' }]); } catch (e) { pr.close(); toast('Transkrypcja nieudana: ' + errText(e), 'bad', 9000); }
  },
};
