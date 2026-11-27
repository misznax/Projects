// ── Import materiałów (obraz / wideo / dźwięk) ──
// Jedno okno ze źródłami: 🗂 biblioteka (wszystkie projekty) | ☁ folder Google Drive | 🔗 link do pliku | 📁 plik z urządzenia.
// Materiały z innych czatów i projektów Claude trafiają na Drive (lub GitHub) – tu wybierasz je z listy albo wklejasz link.
const Importer = {
  FK: 'css-imp-folder', FK0: 'css-drive-folder', AK: 'css-imp-all',
  EXT: { image: /\.(jpe?g|png|webp|gif|avif)$/i, video: /\.(mp4|m4v|mov|webm|mkv|3gp)$/i, audio: /\.(m4a|mp3|wav|aac|ogg|oga|opus|flac|aif|aiff|caf|amr|wma)$/i },
  LBL: { image: 'obraz', video: 'wideo', audio: 'dźwięk' },
  cls(kinds) { kinds = kinds || []; return kinds.includes('video') ? 'video' : kinds.some((k) => ['audio', 'voice', 'music', 'sfx'].includes(k)) ? 'audio' : 'image'; },
  fits(cls, name, type) { type = type || ''; if (type.startsWith(cls + '/') || this.EXT[cls].test(name || '')) return true; return cls === 'audio' && (type.startsWith('video/') || this.EXT.video.test(name || '')); }, // dźwięk można wyciągnąć też z wideo
  accept(cls) { return { image: 'image/*', video: 'video/*,.mov,.mp4,.m4v,.webm,.mkv,.3gp', audio: 'audio/*,video/*,.m4a,.mp3,.wav,.aac,.ogg,.opus,.flac' }[cls]; },
  err(j, st, isFile) {
    const c = j && j.code;
    if (c === 'private') return isFile ? 'Plik nie jest udostępniony linkiem. W Drive: prawy klik na plik → Udostępnij → Dostęp ogólny → „Każdy, kto ma link”.' : AudioStudio.driveErr(j, st);
    if (c === 'host') return 'Ten adres nie jest obsługiwany. Wklej link do pliku z Google Drive, GitHub (publiczne repo) lub Dropbox.';
    return AudioStudio.driveErr(j, st);
  },
  async download(url, name, pr) {
    let r; try { r = await fetch(url); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); }
    if (!r.ok) { let j = {}; try { j = await r.json(); } catch { /* nie JSON */ } throw new Error(this.err(j, r.status, true)); }
    const tot = +r.headers.get('content-length') || 0, parts = []; let got = 0;
    if (r.body && r.body.getReader) { const rd = r.body.getReader(); for (;;) { if (pr.cancel) { rd.cancel(); throw new Error('przerwano'); } const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; pr.set(tot ? Math.min(0.95, got / tot) : 0.5, (got / 1e6).toFixed(1) + (tot ? ' / ' + (tot / 1e6).toFixed(1) : '') + ' MB'); } }
    else { const b = new Uint8Array(await r.arrayBuffer()); parts.push(b); got = b.length; }
    if (!got) throw new Error('pusty plik');
    let nm = name; if (!nm) { const xf = r.headers.get('x-filename'); if (xf) { try { nm = decodeURIComponent(xf); } catch { nm = xf; } } }
    let ty = (r.headers.get('content-type') || '').split(';')[0].trim(); if (ty === 'application/octet-stream' || ty === 'binary/octet-stream') ty = ''; // typ dobierze Assets.add po rozszerzeniu
    return new File(parts, nm || 'plik', { type: ty });
  },
  // pobiera plik z adresu Workera, sprawdza typ i zapisuje jako zasób projektu → rekord zasobu (lub null)
  async fetchAsset(url, name, cls, extra) {
    const pr = progressModal('Pobieranie: ' + (name || 'plik'));
    try {
      const file = await this.download(url, name, pr);
      if (!this.fits(cls, file.name, file.type)) throw new Error('„' + file.name + '” nie wygląda na ' + this.LBL[cls] + ' (typ: ' + (file.type || 'nieznany') + ').');
      pr.set(0.97, 'zapis'); const id = await Assets.add(file, cls === 'audio' ? 'audio' : cls, extra); pr.close();
      return await Assets.rec(id);
    } catch (e) { pr.close(); toast('Import: ' + errText(e), 'bad', 9000); return null; }
  },
  // Okno wyboru. Zwraca rekord zasobu (jak dawny assetPicker) albo null.
  pick(kinds, title) {
    kinds = kinds || ['image']; const cls = this.cls(kinds), self = this;
    return new Promise((res) => {
      let done = false, M, iv, cur = 'lib', pv = null, pvId = null; const fin = (v) => { if (done) return; done = true; clearInterval(iv); if (pv) { try { pv.pause(); } catch (e) { /* nic */ } } if (M) M.close(); res(v); };
      const playPrev = async (a, btn) => { if (pv && pvId === a.id && !pv.paused) { pv.pause(); btn.textContent = '▶'; return; } if (pv) pv.pause(); view.querySelectorAll('.pvb').forEach((x) => { x.textContent = '▶'; }); const u = await Assets.url(a.id); if (!u) return; pv = new Audio(u); pvId = a.id; pv.onended = () => { btn.textContent = '▶'; }; btn.textContent = '⏸'; try { await pv.play(); } catch (e) { btn.textContent = '▶'; } };
      const tabs = h('div', { class: 'seg imptabs' }), view = h('div', { class: 'impv' }), body = h('div', { class: 'imp' }, tabs, view);
      const T = [['lib', '🗂 Biblioteka'], ['brand', '🏷 Marka'], ['drive', '☁ Google Drive'], ['link', '🔗 Z linku'], ['dev', '📁 Z urządzenia']];
      const go = (k) => { cur = k; [...tabs.children].forEach((b, i) => b.classList.toggle('on', T[i][0] === k)); view.innerHTML = ''; ({ lib, brand, drive, link, dev })[k](); };
      T.forEach(([k, n]) => tabs.append(h('button', { onclick: () => go(k) }, n)));

      // 1. biblioteka: zasoby tego i (opcjonalnie) innych projektów
      const lib = async () => {
        view.append(h('div', { class: 'hint' }, 'Wczytuję bibliotekę…'));
        const [all, prj] = await Promise.all([DBI.all('assets'), listProjects().catch(() => [])]); if (cur !== 'lib') return;
        const names = {}; prj.forEach((p) => { names[p.id] = p.name; });
        let showAll = true; try { showAll = localStorage.getItem(self.AK) !== '0'; } catch { /* tryb prywatny */ }
        const mine = (x) => !P.cur || x.pid === P.cur.id || !x.pid;
        const ok = (a) => a.kind !== 'font' && (kinds.includes(a.kind) || (cls === 'image' && (a.type || '').startsWith('image/')) || (cls === 'audio' && a.kind === 'video'));
        const draw = () => {
          view.innerHTML = '';
          const items = all.filter((a) => ok(a) && (showAll || mine(a))).sort((a, b) => (mine(b) - mine(a)) || b.created - a.created), other = all.filter((a) => ok(a) && !mine(a)).length;
          view.append(h('label', { class: 'row', style: { gap: '8px', cursor: 'pointer', margin: '0 0 8px' } }, h('input', { type: 'checkbox', checked: showAll, style: { flex: 'none', width: 'auto' }, onchange: (e) => { showAll = e.target.checked; try { localStorage.setItem(self.AK, showAll ? '1' : '0'); } catch { /* nic */ } draw(); } }), h('span', {}, 'Pokaż też materiały z innych projektów' + (other ? ' (' + other + ')' : ''))));
          if (!items.length) {
            view.append(h('div', { class: 'warnrow' }, 'Biblioteka nie ma jeszcze ' + (cls === 'image' ? 'obrazów' : cls === 'video' ? 'wideo' : 'dźwięków') + '. Wczytaj je tutaj:'),
              h('div', { class: 'row' }, h('button', { class: 'btn pri', onclick: () => go('drive') }, '☁ Z folderu Drive'), h('button', { class: 'btn', onclick: () => go('link') }, '🔗 Z linku'), h('button', { class: 'btn', onclick: () => go('dev') }, '📁 Z urządzenia')),
              h('div', { class: 'hint', style: { marginTop: '8px' } }, 'Pliki z innych czatów i projektów Claude: poproś tam o zapis na Google Drive (np. folder „Creative Studio > Materiały”), udostępnij folder linkiem i wybierz go w „Z folderu Drive”.')); return;
          }
          const grid = h('div', { class: 'cards impgrid' });
          for (const a of items) {
            const isImg = (a.type || '').startsWith('image/'), isAud = (a.type || '').startsWith('audio') || ['audio', 'voice', 'music', 'sfx'].includes(a.kind), foreign = !mine(a);
            const media = isImg ? imgThumbEl(a.id) : isAud ? h('div', { style: { padding: '12px 6px', textAlign: 'center' } }, h('button', { class: 'btn pvb', title: 'Odsłuch', onclick: (e) => { e.stopPropagation(); playPrev(a, e.currentTarget); } }, '▶')) : vidThumbEl(a.id);
            grid.append(h('div', { class: 'card', style: { cursor: 'pointer' }, title: a.name + (a.desc ? '\n' + a.desc : ''), onclick: () => fin(a) }, media,
              h('div', { style: { fontSize: '12px', marginTop: '6px', wordBreak: 'break-word' } }, a.name),
              a.desc ? h('div', { class: 'fine' }, a.desc) : null,
              h('div', { class: 'fine' }, [isAud ? 'dźwięk' : isImg ? 'obraz' : 'wideo', a.dur ? fmtTime(a.dur) : '', a.size ? fmtSize(a.size) : '', a.origin || ''].filter(Boolean).join(' · ')),
              h('div', { class: 'fine' }, '📁 ' + (foreign ? (names[a.pid] || 'inny projekt') : 'ten projekt'))));
          }
          view.append(grid);
        };
        draw();
      };

      // 1b. biblioteka marki: gotowe zakończenia, podkłady i dzwonki z Drive. Opis, podgląd i odsłuch bez wgrywania, plik trafia do biblioteki projektu dopiero po „Użyj”
      const brand = async () => {
        view.append(h('div', { class: 'hint' }, 'Wczytuję bibliotekę marki…'));
        let man; try { man = await BrandLib.manifest(); } catch (e) { if (cur === 'brand') { view.innerHTML = ''; view.append(h('div', { class: 'warnrow bad' }, errText(e))); } return; }
        if (cur !== 'brand') return; view.innerHTML = '';
        const groups = cls === 'video' ? [['Zakończenia', man.endings]] : cls === 'audio' ? [['Podkłady', man.beds], ['Dzwonki', man.bells]] : [], n = groups.reduce((x, g) => x + (g[1] || []).length, 0);
        view.append(h('div', { class: 'hint', style: { marginBottom: '6px' } }, n ? 'Gotowe elementy marki z Drive. Odsłuch i podgląd działają bez wgrywania, plik trafia do biblioteki projektu po „Użyj”. ' : 'Biblioteka marki nie ma nic dla typu: ' + self.LBL[cls] + '. ', man.folder ? h('a', { href: man.folder, target: '_blank', rel: 'noopener' }, 'Folder na Drive') : null));
        for (const [title, arr] of groups) { if (!(arr || []).length) continue; view.append(h('div', { class: 'ph' }, title)); for (const it of arr) { const b = h('button', { class: 'btn pri', style: { alignSelf: 'center' }, onclick: async () => { b.disabled = true; const rec = await BrandLib.asset(it, cls); b.disabled = false; if (rec) fin(rec); } }, 'Użyj'); view.append(BrandLib.card(it, cls, null, b)); } }
      };

      // 2. folder Google Drive (z podfolderami)
      const drive = () => {
        let saved = ''; try { saved = AudioStudio.driveId(localStorage.getItem(self.FK) || '') || AudioStudio.driveId(localStorage.getItem(self.FK0) || ''); } catch { saved = ''; }
        const setup = () => {
          view.innerHTML = ''; const inp = h('input', { type: 'text', placeholder: 'https://drive.google.com/drive/folders/…', style: { width: '100%', margin: '8px 0' } });
          view.append(h('div', { style: { lineHeight: '1.5' } }, '1. Na Google Drive utwórz folder (np. „Creative Studio > Materiały”) i wrzuć tam pliki – także te z innych czatów i projektów Claude.', h('br'), '2. Prawy klik na folderze → Udostępnij → Dostęp ogólny → „Każdy, kto ma link” (Wyświetlający).', h('br'), '3. Wklej link do folderu:'), inp,
            h('div', { class: 'hint' }, 'Link zapisuje się tylko w tej przeglądarce. Kto zna link, widzi pliki z folderu – nie wrzucaj tam nic prywatnego.'),
            h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn pri', onclick: () => { const v = AudioStudio.driveId(inp.value); if (!v) { toast('To nie wygląda na link do folderu Google Drive.', 'bad'); return; } try { localStorage.setItem(self.FK, v); } catch { /* nic */ } show(v, []); } }, 'Zapisz i pokaż pliki')));
          setTimeout(() => inp.focus(), 30);
        };
        const show = async (id, stack) => {
          view.innerHTML = ''; view.append(h('div', { class: 'hint' }, 'Wczytuję listę z Drive…'));
          let files; try { files = await AudioStudio.driveFetchList(id); } catch (e) { if (cur !== 'drive') return; view.innerHTML = ''; view.append(h('div', { class: 'warnrow bad' }, errText(e)), h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => show(id, stack) }, '↻ Spróbuj ponownie'), h('button', { class: 'btn', onclick: () => { try { localStorage.removeItem(self.FK); } catch { /* nic */ } setup(); } }, 'Zmień folder'))); return; }
          if (cur !== 'drive') return; view.innerHTML = '';
          const dirs = files.filter((f) => f.folder).sort((a, b) => a.name.localeCompare(b.name, 'pl', { numeric: true })), media = files.filter((f) => !f.folder && self.fits(cls, f.name, '')).sort((a, b) => b.name.localeCompare(a.name, 'pl', { numeric: true })), skipped = files.length - dirs.length - media.length;
          const list = h('div', { class: 'zebra', style: { maxHeight: '44vh', overflow: 'auto' } });
          dirs.forEach((f) => list.append(h('div', { class: 'take', style: { alignItems: 'center' }, onclick: () => show(f.id, [...stack, id]) }, h('span', {}, '📁 ' + f.name), h('span', { class: 'hint' }, 'otwórz ›'))));
          media.forEach((f) => { const b = h('button', { class: 'btn', onclick: async () => { b.disabled = true; const rec = await self.fetchAsset('api/s/drive/get?id=' + encodeURIComponent(f.id), f.name, cls); b.disabled = false; if (rec) fin(rec); } }, 'Importuj'); list.append(h('div', { class: 'take', style: { cursor: 'default', alignItems: 'center' } }, h('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, title: f.name }, f.name, f.date ? h('span', { class: 'hint' }, '  ·  ' + f.date) : null), b)); });
          view.append(h('div', { class: 'hint', style: { marginBottom: '6px' } }, (media.length ? media.length + ' plik(ów): ' + self.LBL[cls] : 'W tym folderze brak plików typu: ' + self.LBL[cls]) + (dirs.length ? ', podfolderów: ' + dirs.length : '') + (skipped ? ' (pominięto ' + skipped + ' innych)' : '')), dirs.length || media.length ? list : null,
            h('div', { class: 'row', style: { marginTop: '8px' } }, stack.length ? h('button', { class: 'btn', onclick: () => show(stack[stack.length - 1], stack.slice(0, -1)) }, '‹ Wyżej') : null, h('button', { class: 'btn', onclick: () => show(id, stack) }, '↻ Odśwież'), h('button', { class: 'btn', onclick: () => { try { localStorage.removeItem(self.FK); } catch { /* nic */ } setup(); } }, 'Zmień folder')));
        };
        if (saved) show(saved, []); else setup();
      };

      // 3. link do pliku (Drive / GitHub / Dropbox) lub do folderu Drive
      const link = () => {
        const inp = h('input', { type: 'text', placeholder: 'https://drive.google.com/file/d/…  albo link GitHub / Dropbox', style: { width: '100%', margin: '8px 0' } });
        const run = async () => {
          const v = inp.value.trim(); if (!/^https:\/\//i.test(v)) { toast('Wklej pełny adres zaczynający się od https://', 'bad'); return; }
          if (/drive\.google\.com\/.*\/folders\//.test(v)) { const id = AudioStudio.driveId(v); if (id) { try { localStorage.setItem(self.FK, id); } catch { /* nic */ } go('drive'); return; } }
          go0.disabled = true; const rec = await self.fetchAsset('api/s/link?url=' + encodeURIComponent(v), '', cls); go0.disabled = false; if (rec) fin(rec);
        };
        const go0 = h('button', { class: 'btn pri', onclick: run }, 'Importuj'); inp.onkeydown = (e) => { if (e.key === 'Enter') run(); };
        view.append(h('div', {}, 'Wklej link do pliku (' + self.LBL[cls] + ') udostępnionego linkiem:'), inp, h('div', { class: 'row' }, go0),
          h('div', { class: 'hint', style: { marginTop: '8px', lineHeight: '1.5' } }, 'Obsługiwane: Google Drive (plik: „Każdy, kto ma link”), GitHub (publiczne repo, link do pliku), Dropbox. Link do folderu Drive otworzy listę plików. Limit pliku: 250 MB.'));
        setTimeout(() => inp.focus(), 30);
      };

      // 4. plik z urządzenia
      const dev = () => {
        view.append(h('div', { class: 'hint', style: { marginBottom: '8px' } }, 'Plik z tego komputera lub telefonu (' + self.LBL[cls] + ').'),
          h('button', { class: 'btn pri', onclick: async () => { const fs = await pickFiles(self.accept(cls), false); if (!fs[0]) return; const tt = toast('Wczytuję „' + fs[0].name + '” (' + fmtSize(fs[0].size) + ')…', 'info', 120000); try { const id = await Assets.add(fs[0], cls === 'audio' ? 'audio' : cls); tt.remove(); fin(await Assets.rec(id)); } catch (e) { tt.remove(); toast('Nie udało się wczytać: ' + errText(e), 'bad', 8000); } } }, 'Wybierz plik…'));
      };

      M = modal(title || 'Importuj materiały', body, [{ t: 'Anuluj', fn: () => { fin(null); } }]);
      iv = setInterval(() => { if (!M.box.isConnected) fin(null); }, 400); // zamknięcie Esc / klikiem w tło też kończy obietnicę
      go('lib');
    });
  },
};
function vidThumbEl(id) { const v = h('video', { preload: 'metadata', playsinline: true, style: { width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '6px', background: '#000', display: 'block' } }); v.muted = true; Assets.url(id).then((u) => { if (u) v.src = u + '#t=0.4'; }); return v; }
