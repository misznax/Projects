/* WYSYŁKA GOTOWYCH ROLEK NA GOOGLE DRIVE (folder „Gotowe rolki”)
   Przeglądarka → Worker (api/s/gas, api/s/gput) → skrypt Google użytkownika (apps-script/Code.gs, kod wstawiany z build.py jako GAS_CODE) + sesja wznawialnego uploadu Drive.
   Nic nie wymaga kluczy: skrypt działa na koncie użytkownika, a Worker przepuszcza tylko dwa adresy (skrypt script.google.com i sesję uploadu googleapis.com).
   Po wysyłce plik leży na Drive, więc czat agenta (Drive) go widzi, w przeciwieństwie do biblioteki projektu, która jest tylko w IndexedDB przeglądarki. */
const DriveUp = {
  K: 'css-gas', KT: 'css-gas-token', CH: 8 * 1048576,
  cfg() { try { const c = JSON.parse(localStorage.getItem(this.K) || 'null'); return c && c.url && c.token ? c : null; } catch { return null; } },
  save(c) { try { localStorage.setItem(this.K, JSON.stringify(c)); } catch { /* brak pamięci */ } },
  token() { let t = ''; try { t = localStorage.getItem(this.KT) || ''; } catch { t = ''; } if (!t) { const a = new Uint8Array(18); crypto.getRandomValues(a); t = [...a].map((x) => 'abcdefghjkmnpqrstuvwxyz23456789'[x % 31]).join(''); try { localStorage.setItem(this.KT, t); } catch { /* nic */ } } return t; },
  code() { return GAS_CODE.replace('__TOKEN__', this.token()); },
  urlOk(u) { return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]{20,200}\/exec$/.test(String(u || '').trim()); },
  errMsg(j, st) {
    const c = j && j.code;
    if (st === 403 || c === 'forbidden') return 'Brak dostępu do serwera (zaloguj się ponownie do aplikacji).';
    if (st === 429 || c === 'rate') return 'Za dużo zapytań w ostatniej godzinie. Spróbuj za kilka minut.';
    if (c === 'bad_url') return 'To nie jest adres aplikacji internetowej skryptu Google. Powinien zaczynać się od https://script.google.com/macros/s/ i kończyć na /exec.';
    if (c === 'gas_private') return 'Skrypt wymaga logowania. W skrypcie: Wdróż → Zarządzaj wdrożeniami → ołówek → „Kto ma dostęp: Wszyscy” → Wdróż.';
    if (c === 'gas_html') return 'Skrypt zwrócił stronę zamiast odpowiedzi. Sprawdź adres (koniec /exec) i czy po wklejeniu kodu zrobiłeś nowe wdrożenie.';
    if (c === 'net') return 'Brak połączenia ze skryptem Google: ' + ((j && j.msg) || '');
    if (c === 'too_big') return 'Za duży kawałek pliku.';
    if (j && j.error === 'token') return 'Hasło w skrypcie jest inne niż w aplikacji. Skopiuj kod skryptu z okna „Ustawienia Drive” jeszcze raz i wdróż nową wersję.';
    if (j && j.error) return 'Skrypt zgłosił błąd: ' + j.error;
    return 'Nieoczekiwana odpowiedź serwera' + (st ? ' (HTTP ' + st + ')' : '') + '.';
  },
  async gas(payload, url, token) {
    const c = this.cfg(); url = url || (c && c.url); token = token || (c && c.token); if (!url) throw new Error('Drive nie jest skonfigurowany (⚙ Ustawienia Drive).');
    let r; try { r = await fetch('api/s/gas', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url, payload: Object.assign({ token }, payload) }) }); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); }
    let j = null; try { j = await r.json(); } catch { /* nie JSON */ }
    if (!r.ok || !j || j.ok !== true) throw new Error(this.errMsg(j, r.status));
    return j;
  },
  async put(session, chunk, range) { // jeden kawałek przez Workera; odpowiedź {status, range, body}
    let r; try { r = await fetch('api/s/gput?u=' + encodeURIComponent(session), { method: 'PUT', headers: { 'x-content-range': range }, body: chunk }); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); }
    let j = null; try { j = await r.json(); } catch { /* nie JSON */ }
    if (!r.ok || !j || typeof j.status !== 'number') throw new Error(this.errMsg(j, r.status));
    return j;
  },
  next(range, def) { const m = /bytes=0-(\d+)/.exec(range || ''); return m ? +m[1] + 1 : def; }, // ile bajtów Drive już przyjął
  // Wysyła blob do folderu „Gotowe rolki”. pr: progressModal. Zwraca {id, name, url, folder}.
  async upload(blob, name, mime, pr) {
    pr.set(0, 'łączenie z Drive'); const s = await this.gas({ action: 'init', name, mime: mime || 'video/mp4', size: blob.size }); if (!s.url) throw new Error('Skrypt nie zwrócił adresu sesji wysyłania.');
    const total = blob.size; let off = 0, fin = null, stall = 0; const t0 = Date.now();
    while (off < total) {
      if (pr.cancel) throw new Error('cancel');
      const before = off, end = Math.min(off + this.CH, total), range = 'bytes ' + off + '-' + (end - 1) + '/' + total; let out = null, err = null;
      for (let tr = 0; tr < 4 && !out; tr++) {
        try { out = await this.put(s.url, blob.slice(off, end), range); }
        catch (e) { // błąd sieci: pytamy Drive, ile bajtów już ma, i próbujemy dalej od tego miejsca
          err = e; if (pr.cancel) throw new Error('cancel'); await sleep(1200 * (tr + 1));
          try { const q = await this.put(s.url, new Blob([]), 'bytes */' + total); if (q.status === 200 || q.status === 201 || q.status === 308) out = q; } catch { /* kolejna próba */ }
        }
      }
      if (!out) throw err || new Error('Wysyłanie przerwane.');
      if (out.status === 200 || out.status === 201) { try { fin = JSON.parse(out.body); } catch { fin = {}; } off = total; break; }
      if (out.status !== 308) throw new Error('Drive odrzucił plik (HTTP ' + out.status + '): ' + String(out.body || '').slice(0, 200));
      off = this.next(out.range, 0);
      if (off <= before) { if (++stall > 3) throw new Error('Drive nie przyjmuje danych (brak postępu po kilku próbach).'); } else stall = 0;
      const el = (Date.now() - t0) / 1000, sp = el > 1 ? off / 1e6 / el : 0;
      pr.set(off / total, 'wysyłanie na Drive: ' + (off / 1e6).toFixed(1) + ' z ' + (total / 1e6).toFixed(1) + ' MB' + (sp ? ' (' + sp.toFixed(1) + ' MB/s)' : ''));
    }
    if (!fin) throw new Error('Drive nie potwierdził zapisu pliku.');
    return { id: fin.id, name: fin.name || name, url: fin.webViewLink || (fin.id ? 'https://drive.google.com/file/d/' + fin.id + '/view' : ''), folder: s.folder || '' };
  },
  // Opis rolki jako plik tekstowy obok wideo (czat agenta czyta go razem z plikiem)
  captionText() {
    const p = P.cur.publish || {}, r = (typeof Video !== 'undefined' && Video.reel) || null, m = (r && r.meta) || {};
    const parts = [P.cur.name ? 'Projekt: ' + P.cur.name : '', m.concept ? 'Koncepcja: ' + m.concept : '', m.hook ? 'Hook: ' + m.hook : '', p.title ? 'Tytuł: ' + p.title : '', p.caption ? 'Opis:\n' + p.caption : '', p.hashtags ? 'Hashtagi: ' + p.hashtags : '', p.schedule ? 'Planowany termin: ' + p.schedule : ''].filter(Boolean);
    return parts.length > 1 ? parts.join('\n\n') + '\n' : '';
  },
  // Pełny przepływ z oknem postępu; zwraca wynik albo null (anulowano). Błędy lecą dalej do wywołującego.
  async deliver(blob, name) {
    const pr = progressModal('Wysyłanie na Drive'); let res;
    try {
      res = await this.upload(blob, name, blob.type || 'video/mp4', pr);
      let txt = ''; const t = this.captionText(); if (t) { pr.set(0.98, 'zapis opisu obok pliku'); txt = name.replace(/\.[^.]+$/, '') + '_opis.txt'; try { await this.gas({ action: 'text', name: txt, text: t }); } catch (e) { console.warn('Opis na Drive:', e); txt = ''; } }
      pr.close(); (P.cur.publish = P.cur.publish || {}).drive = { id: res.id, name: res.name, url: res.url, folder: res.folder, size: blob.size, ts: Date.now(), text: txt }; touch(); return res;
    } catch (e) { pr.close(); if (/^cancel$/.test(e && e.message)) { toast('Wysyłanie na Drive anulowane.', 'warn'); return null; } throw e; }
  },
  resultBox(res) {
    return h('div', {}, h('div', { class: 'hint', html: rich('Plik jest na Twoim Drive w folderze (Gotowe rolki). Czat agenta z dostępem do Drive widzi go tam, razem z plikiem „_opis.txt”, jeśli opis był wpisany.') }),
      h('div', { style: { marginTop: '8px', lineHeight: '1.7' } }, 'Plik: ', h('a', { href: res.url, target: '_blank', rel: 'noopener' }, res.name), h('br'), res.folder ? h('span', {}, 'Folder: ', h('a', { href: res.folder, target: '_blank', rel: 'noopener' }, 'Gotowe rolki')) : null));
  },
  // Wysyła rolkę już zapisaną w Publikacji (publish.video)
  async sendPublished() {
    const p = P.cur.publish, info = p && p.videoInfo; if (!p || !p.video || !info) { toast('Najpierw wyeksportuj rolkę (Wideo → Eksport).', 'warn'); return; }
    if (!this.cfg()) { this.setup(() => this.sendPublished()); return; }
    const b = await Assets.blob(p.video); if (!b) { toast('Brak pliku wideo w bibliotece. Wyeksportuj rolkę ponownie.', 'bad'); return; }
    try { const res = await this.deliver(b, info.name); if (res) { modal('Wysłano na Drive', this.resultBox(res), [{ t: 'Zamknij' }]); if (typeof Publish !== 'undefined' && S.tab === 'publish') Publish.render(); } }
    catch (e) { console.error(e); modal('Nie udało się wysłać na Drive', h('div', {}, h('div', { class: 'warnrow bad' }, errText(e)), h('div', { class: 'hint', style: { marginTop: '8px' }, html: rich('Rolka jest zapisana w bibliotece projektu: wyślij ją ponownie z Publikacji (☁ Wyślij na Drive) albo sprawdź (⚙ Ustawienia Drive).') })), [{ t: 'Ustawienia Drive', cls: 'pri', fn: () => { this.setup(); } }, { t: 'Zamknij' }]); }
  },
  // Okno ustawień: kod skryptu, kroki wdrożenia, adres, test
  setup(after) {
    const c = this.cfg(), code = this.code();
    const url = h('input', { type: 'text', placeholder: 'https://script.google.com/macros/s/…/exec', value: c ? c.url : '', style: { width: '100%', margin: '6px 0' } });
    const ta = h('textarea', { readonly: true, rows: 5, style: { width: '100%', fontFamily: 'monospace', fontSize: '11px' } }); ta.value = code;
    const st = h('div', { class: 'hint', style: { marginTop: '6px' } }), L = (href, t) => h('a', { href, target: '_blank', rel: 'noopener' }, t);
    const body = h('div', { style: { lineHeight: '1.55' } },
      h('div', { class: 'hint', html: rich('Jednorazowo (ok. 3 minut, bez kluczy). Skrypt działa na Twoim koncie Google i zapisuje rolki w folderze (Gotowe rolki) na Twoim Drive; stamtąd widzi je czat agenta.') }),
      h('div', { style: { margin: '8px 0' } }, '1. Otwórz ', L('https://script.google.com/home/projects/create', 'script.google.com → Nowy projekt'), ' (to samo konto Google, co Drive).', h('br'), '2. Usuń domyślny kod i wklej poniższy (przycisk obok). Zapisz (Ctrl+S).'),
      ta, h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn', onclick: () => navigator.clipboard.writeText(code).then(() => toast('Skopiowano kod skryptu', 'ok')).catch(() => { ta.select(); toast('Zaznaczono kod: skopiuj Ctrl+C', 'warn'); }) }, '📋 Kopiuj kod skryptu')),
      h('div', { style: { margin: '8px 0' } }, '3. Wdróż → Nowe wdrożenie → typ „Aplikacja internetowa” → Wykonaj jako: (Ja) → Kto ma dostęp: (Wszyscy) → Wdróż. Przy pytaniu o uprawnienia: Autoryzuj dostęp → wybierz konto → (Zaawansowane) → „Przejdź do … (niebezpieczne)” → Zezwól. To Twój własny skrypt.', h('br'), '4. Skopiuj „Adres URL aplikacji internetowej” (kończy się na /exec) i wklej tutaj:'),
      url, st);
    const run = async (close) => {
      const u = url.value.trim(); if (!this.urlOk(u)) { st.className = 'warnrow bad'; st.textContent = this.errMsg({ code: 'bad_url' }); return false; }
      st.className = 'hint'; st.textContent = 'Sprawdzam połączenie…';
      try { const j = await this.gas({ action: 'ping' }, u, this.token()); this.save({ url: u, token: this.token() }); st.className = 'hint'; st.textContent = ''; toast('Drive połączony. Folder: ' + (j.name || 'Gotowe rolki'), 'ok', 6000); if (after) setTimeout(after, 150); return true; }
      catch (e) { st.className = 'warnrow bad'; st.textContent = errText(e); return false; }
    };
    modal('☁ Ustawienia Drive: Gotowe rolki', body, [{ t: 'Zapisz i sprawdź', cls: 'pri', fn: run }, ...(c ? [{ t: 'Odłącz', cls: 'bad', fn: () => { try { localStorage.removeItem(this.K); } catch { /* nic */ } toast('Drive odłączony.', 'warn'); } }] : []), { t: 'Zamknij' }]);
  },
};
