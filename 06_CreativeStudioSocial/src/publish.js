/* PUBLISHING STUDIO: walidacja pod sieci (IG / YouTube / TikTok / Facebook), opis i hashtagi, pakiet do wgrania, bramka zatwierdzania, FINAL PUBLISH, dziennik, kalendarz treści */
const NETS = {
  ig: { n: 'Instagram Reels', ic: '📸', url: 'https://www.instagram.com/', max: 90, cap: 2200 },
  yt: { n: 'YouTube Shorts', ic: '▶', url: 'https://studio.youtube.com/', max: 180, title: 100, desc: 5000 },
  tt: { n: 'TikTok', ic: '♪', url: 'https://www.tiktok.com/tiktokstudio/upload', max: 600, cap: 2200 },
  fb: { n: 'Facebook Reels', ic: 'f', url: 'https://business.facebook.com/latest/reels_composer', max: 90, cap: 63000 },
};
const APPROVAL = [['content', 'Materiał jest gotowy i obejrzany w całości (obraz, animacje, dźwięk)'], ['brand', 'Zgodność z marką (kolory, fonty, logo, ton)'], ['text', 'Pisownia i treść opisu sprawdzone, bez obietnic zdrowotnych bez pokrycia'], ['sound', 'Dźwięk: czytelny głos, bez przesterowań, poziom zgodny z raportem'], ['rights', 'Mam prawa do muzyki, zdjęć i innych materiałów w publikacji'], ['owner', 'Właściciel konta zatwierdza publikację']];
const pad2 = (n) => String(n).padStart(2, '0');

const Publish = {
  built: false,
  get p() { return P.cur.publish; },
  get reel() { return P.cur.reels.find((r) => r.id === P.cur.curReel) || null; },
  build() { const root = $('#m-publish'); root.innerHTML = ''; this.L = h('div', { class: 'pad', style: { overflow: 'auto', minHeight: 0 } }); this.R = h('div', { class: 'pad', style: { overflow: 'auto', minHeight: 0, borderLeft: '1px solid var(--bd)' } }); root.append(this.L, this.R); this.built = true; },
  show() { if (!this.built) this.build(); const p = this.p; p.kind = p.kind || 'video'; p.approval = p.approval || {}; p.nets = Object.assign({ ig: true, yt: true, tt: true, fb: true }, p.nets); this.render(); },
  render() { this.left(); this.right(); },
  tags() { return String(this.p.hashtags || '').split(/[\s,]+/).filter(Boolean).map((x) => '#' + x.replace(/^#+/, '')); },
  compose(n) {
    const p = this.p, tg = this.tags().join(' '), cap = (p.caption || '').trim();
    if (n === 'yt') { const title = (p.title || cap.split('\n')[0] || '').slice(0, 100); return { title, text: cap + (tg ? '\n\n' + tg : '') }; }
    return { title: p.title || '', text: cap + (tg ? '\n\n' + tg : '') };
  },
  post() { const c = P.cur, id = this.p.postId || c.curPost; return c.posts.find((x) => x.id === id) || null; },

  // ── Walidacja ──
  validate(n) {
    const p = this.p, N = NETS[n], out = [], add = (ok, t) => out.push({ ok, t }), info = p.videoInfo, r = this.reel, c = this.compose(n), tags = this.tags();
    if (p.kind === 'video') {
      if (!p.video || !info) add('bad', 'Brak wyeksportowanego wideo. Zrób eksport w zakładce Wideo.');
      else {
        add(info.kind === 'mp4' ? 'ok' : 'bad', info.kind === 'mp4' ? 'Format MP4: ' + (info.note || 'H.264') : 'Plik WebM: ' + N.n + ' wymaga MP4. Wyeksportuj w Chrome na Windows lub macOS.');
        if (info.note && /Opus/.test(info.note) && n !== 'yt') add('warn', 'Dźwięk Opus w MP4: ta sieć może go odrzucić (wymaga AAC).');
        if (info.note && /bez dźwięku/.test(info.note)) add('warn', 'Rolka bez ścieżki dźwiękowej: zasięg bywa niższy.');
        add(info.w === 1080 && info.h === 1920 ? 'ok' : 'warn', 'Wymiary ' + info.w + '×' + info.h + (info.w === 1080 && info.h === 1920 ? ' (9:16)' : ', zalecane 1080×1920'));
        add(info.dur <= N.max ? 'ok' : 'bad', 'Długość ' + info.dur.toFixed(1) + ' s' + (info.dur <= N.max ? ' (limit ' + N.max + ' s)' : ' przekracza limit ' + N.max + ' s'));
        if (info.dur < 3) add('bad', 'Minimalna długość to 3 s.');
        add(info.fps <= 60 ? 'ok' : 'warn', info.fps + ' fps'); add(info.size < 1e9 ? 'ok' : 'warn', 'Rozmiar ' + fmtSize(info.size));
        if (r && r.dur !== info.dur) add('warn', 'Rolka w edytorze (' + r.dur + ' s) różni się od eksportu (' + info.dur.toFixed(1) + ' s). Wyeksportuj ponownie.');
        if (info.qc) { const l = info.qc.find((x) => /Głośność/.test(x.k)), t = info.qc.find((x) => /true peak/.test(x.k)); if (l) add(l.ok, 'Głośność ' + l.v); if (t) add(t.ok, 'Szczyt ' + t.v); }
      }
    } else {
      const post = this.post(); if (!post) add('bad', 'Wybierz projekt graficzny (karuzelę).'); else {
        const k = post.slides.length; if (n === 'ig') add(k <= 20 ? 'ok' : 'bad', k + ' slajdów (limit karuzeli: 20)'); else if (n === 'tt') add(k <= 35 ? 'ok' : 'bad', k + ' zdjęć (tryb zdjęć TikTok: do 35)'); else if (n === 'fb') add(k <= 10 ? 'ok' : 'warn', k + ' zdjęć (zalecane do 10)'); else add('bad', 'YouTube nie przyjmuje karuzel zdjęć. Użyj rolki lub posta społeczności.');
        add(post.fmt === 'post45' || post.fmt === 'square' ? 'ok' : 'warn', 'Format: ' + FORMATS[post.fmt].n);
      }
    }
    if (n === 'ig') { add((c.text.length <= N.cap) ? 'ok' : 'bad', 'Opis ' + c.text.length + ' / ' + N.cap + ' znaków'); add(tags.length <= 30 ? (tags.length <= 5 ? 'ok' : 'warn') : 'bad', tags.length + ' hashtagów' + (tags.length > 5 ? ' (Instagram w aplikacji mógł ograniczyć do 5, zalecane 3–5)' : '')); if (!(p.caption || '').trim()) add('warn', 'Pusty opis: dodaj pierwszą linię, która zatrzyma kciuk.'); }
    if (n === 'tt') { add(c.text.length <= N.cap ? 'ok' : 'bad', 'Opis z hashtagami ' + c.text.length + ' / ' + N.cap + ' znaków'); if (tags.length > 5) add('warn', tags.length + ' hashtagów: na TikToku lepiej 3–5 trafnych.'); }
    if (n === 'yt') { add(c.title ? (c.title.length <= N.title ? 'ok' : 'bad') : 'bad', c.title ? 'Tytuł ' + c.title.length + ' / ' + N.title : 'Brak tytułu (wymagany)'); add(c.text.length <= N.desc ? 'ok' : 'bad', 'Opis ' + c.text.length + ' / ' + N.desc); if (tags.length > 15) add('warn', 'Powyżej 15 hashtagów YouTube ignoruje wszystkie.'); }
    if (n === 'fb') add(c.text.length <= N.cap ? 'ok' : 'bad', 'Opis ' + c.text.length + ' znaków');
    add(p.cover ? 'ok' : 'warn', p.cover ? 'Okładka ustawiona' : 'Brak okładki (zostanie wybrana automatycznie z klatki)');
    if (p.schedule) { const d = new Date(p.schedule); add(d.getTime() > Date.now() ? 'ok' : 'warn', 'Termin: ' + d.toLocaleString('pl-PL') + (d.getTime() > Date.now() ? '' : ' (w przeszłości)')); }
    return out;
  },
  worst(n) { const v = this.validate(n); return v.some((x) => x.ok === 'bad') ? 'bad' : v.some((x) => x.ok === 'warn') ? 'warn' : 'ok'; },

  // ── Lewa kolumna: treść ──
  left() {
    const L = this.L, p = this.p, c = P.cur; L.innerHTML = ''; const cb = (k) => { if (k === 'commit' || k === 'live') touch(); if (k === 'commit') this.right(); };
    const info = p.videoInfo; const mat = h('div', {});
    if (p.kind === 'video') { mat.append(info && p.video ? h('div', { class: 'card' }, h('table', { class: 'qc' }, ...[['Plik', info.name], ['Rozmiar', fmtSize(info.size)], ['Długość', info.dur.toFixed(1) + ' s'], ['Wymiary', info.w + '×' + info.h + ' @ ' + info.fps + ' fps'], ['Kodeki', info.note || info.kind], ['Wyeksportowano', new Date(info.ts).toLocaleString('pl-PL')]].map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, b))))) : h('div', { class: 'hint', html: rich('Brak wyeksportowanej rolki. Zaprojektuj ją w zakładce (Wideo) i wybierz Eksport → MP4.') }), h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn', onclick: () => S.go('video') }, 'Przejdź do Wideo'), info && p.video ? h('button', { class: 'btn', onclick: async () => { const b = await Assets.blob(p.video); if (b) download(b, info.name); } }, 'Pobierz plik') : null, info && p.video ? h('button', { class: 'btn sea', title: 'Wysyła plik do folderu „Gotowe rolki” na Twoim Drive (tam widzi go czat agenta)', onclick: () => DriveUp.sendPublished() }, '☁ Wyślij na Drive') : null, h('button', { class: 'btn', title: 'Połącz Drive: jednorazowa konfiguracja skryptu', onclick: () => DriveUp.setup() }, '⚙ Drive')), p.drive ? h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Na Drive: ', h('a', { href: p.drive.url, target: '_blank', rel: 'noopener' }, p.drive.name), p.drive.folder ? h('span', {}, ' · ', h('a', { href: p.drive.folder, target: '_blank', rel: 'noopener' }, 'folder Gotowe rolki')) : null, ' · ' + new Date(p.drive.ts).toLocaleString('pl-PL')) : null); }
    else { const sel = h('select', { onchange: (e) => { p.postId = e.target.value; touch(); this.right(); } }, c.posts.map((x) => h('option', { value: x.id, selected: x.id === (p.postId || c.curPost) }, x.name + ' (' + x.slides.length + ' szt.)'))); mat.append(c.posts.length ? sel : h('div', { class: 'hint', html: rich('Brak projektów graficznych. Utwórz karuzelę w zakładce (Grafiki).') })); }
    L.append(h('h3', { style: { marginTop: 0 } }, 'Treść publikacji'), h('div', { class: 'fld' }, h('label', {}, 'Rodzaj materiału'), fld({ k: 'kind', t: 'seg', opts: [['video', 'Rolka (wideo)'], ['images', 'Karuzela / zdjęcia']] }, p, (k) => { touch(); this.render(); })), mat);
    const cov = h('div', { class: 'row', style: { marginTop: '8px' } }, p.cover ? h('div', { class: 'thumbs' }, h('div', { class: 'th', style: { width: '54px', height: '96px' } }, imgThumbEl(p.cover))) : h('span', { class: 'hint' }, 'Brak okładki.'), h('button', { class: 'btn', onclick: async () => { const a = await assetPicker(['image', 'ai'], 'Okładka – importuj obraz'); if (a) { p.cover = a.id; touch(); this.render(); } } }, 'Wybierz…'), p.cover ? h('button', { class: 'btn bad', onclick: () => { p.cover = null; touch(); this.render(); } }, 'Usuń') : null);
    L.append(h('div', { class: 'fld', style: { marginTop: '10px' } }, h('label', {}, 'Okładka (z klatki rolki: zakładka Wideo → Eksport; ze slajdu: Grafiki → Eksport)'), cov));
    const cnt = (el, max) => { const s = h('span', { class: 'fine' }); const f = () => { s.textContent = el.value.length + (max ? ' / ' + max : ''); s.style.color = max && el.value.length > max ? 'var(--bad)' : ''; }; el.addEventListener('input', f); f(); return s; };
    const title = h('input', { type: 'text', value: p.title || '', placeholder: 'Tytuł (YouTube, opcjonalnie Facebook)', oninput: (e) => { p.title = e.target.value; touch(); }, onchange: () => this.right() }), cap = h('textarea', { rows: 7, placeholder: 'Pierwsza linia zatrzymuje kciuk. Potem treść i jedno wezwanie do działania.', oninput: (e) => { p.caption = e.target.value; touch(); }, onchange: () => this.right() }), tg = h('textarea', { rows: 2, placeholder: '#trening #zdrowie …', oninput: (e) => { p.hashtags = e.target.value; touch(); }, onchange: () => this.right() }); cap.value = p.caption || ''; tg.value = p.hashtags || '';
    const sch = h('input', { type: 'datetime-local', value: p.schedule || '', onchange: (e) => { p.schedule = e.target.value; touch(); this.right(); } });
    L.append(h('div', { class: 'fld' }, h('label', {}, 'Tytuł'), title, cnt(title, 100)), h('div', { class: 'fld' }, h('label', {}, 'Opis (caption)'), cap, cnt(cap, 2200)), h('div', { class: 'fld' }, h('label', {}, 'Hashtagi'), tg), h('div', { class: 'row' }, h('button', { class: 'btn sea', onclick: () => this.aiText() }, '✨ AI: opis, tytuł i hashtagi'), h('button', { class: 'btn', onclick: () => navigator.clipboard.writeText(this.compose('ig').text).then(() => toast('Skopiowano opis z hashtagami', 'ok')).catch((e) => toast('Nie udało się skopiować: ' + errText(e), 'bad')) }, 'Kopiuj opis')),
      h('div', { class: 'fld', style: { marginTop: '10px' } }, h('label', {}, 'Planowany termin publikacji (przypomnienie i kalendarz)'), sch), h('div', { class: 'hint', html: rich('Aplikacja sama niczego nie publikuje bez Twojego zatwierdzenia (bramka po prawej).') }));
  },
  async aiText() {
    const p = this.p, r = this.reel, pr = progressModal('Piszę opis'); try {
      pr.set(0.3, 'AI'); const ctx = [r && r.meta && r.meta.concept ? 'Koncepcja: ' + r.meta.concept : '', r && r.meta && r.meta.hook ? 'Hook: ' + r.meta.hook : '', P.cur.audio.script ? 'Skrypt lektora: ' + P.cur.audio.script.slice(0, 1500) : '', p.caption ? 'Obecny opis: ' + p.caption : '', 'Cel: leady B2C dla trenera personalnego, CTA do kontaktu (smialo.org).'].filter(Boolean).join('\n');
      const j = await AI.json('Jesteś copywriterem social media dla polskiego trenera personalnego. Piszesz po polsku, konkretnie, bez waty, bez obietnic zdrowotnych bez pokrycia, bez myślników jako ozdobników. ' + BRAND_CTX(), ctx + '\nZwróć JSON: {"title":"max 90 znaków, dla YouTube","caption":"opis: pierwsza linia zatrzymuje (max 110 znaków), potem 2-4 krótkie zdania, jedno CTA; max 900 znaków","hashtags":["5 trafnych, polskie lub branżowe, bez #"]}', 1500);
      if (j.title) p.title = String(j.title).slice(0, 100); if (j.caption) p.caption = String(j.caption); if (j.hashtags) p.hashtags = [].concat(j.hashtags).map((x) => '#' + String(x).replace(/^#/, '')).join(' '); touch(); pr.close(); this.render(); toast('Wstawiono opis, tytuł i hashtagi. Sprawdź i popraw.', 'ok');
    } catch (e) { pr.close(); toast('Nie udało się wygenerować opisu: ' + errText(e), 'bad', 9000); }
  },

  // ── Prawa kolumna: sieci, bramka, dziennik, kalendarz ──
  right() {
    const R = this.R, p = this.p; R.innerHTML = ''; R.append(h('h3', { style: { marginTop: 0 } }, 'Sieci docelowe'));
    for (const [k, N] of Object.entries(NETS)) {
      const v = this.validate(k), w = this.worst(k), on = !!p.nets[k]; const card = h('div', { class: 'netcard', style: { opacity: on ? 1 : 0.55 } }, h('h4', {}, h('label', { style: { display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: on, style: { width: 'auto', flex: 'none' }, onchange: (e) => { p.nets[k] = e.target.checked; touch(); this.right(); } }), h('span', {}, N.ic + '  ' + N.n)), h('span', { class: 'tag ' + w }, { ok: 'gotowe', warn: 'uwagi', bad: 'błędy' }[w])), ...v.map((x) => h('div', { class: 'chk ' + x.ok }, x.t)),
        h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => window.open(N.url, '_blank', 'noopener') }, 'Otwórz stronę wgrywania ↗'), h('button', { class: 'btn sm', onclick: () => { const c = this.compose(k); navigator.clipboard.writeText((c.title && k === 'yt' ? c.title + '\n\n' : '') + c.text).then(() => toast('Skopiowano opis dla ' + N.n, 'ok')).catch((e) => toast(errText(e), 'bad')); } }, 'Kopiuj opis'))); R.append(card);
    }
    R.append(h('div', { class: 'hint', html: rich('Tryb publikacji w wersji (' + APP.ver + '): (pakiet do wgrania + otwarcie stron nadawczych). Automatyczne wysyłanie przez API wymaga kont i tokenów, patrz „Status integracji” w menu.') }));
    // bramka zatwierdzania
    const done = APPROVAL.filter(([k]) => p.approval[k]).length, anyNet = Object.keys(NETS).some((k) => p.nets[k]), errs = Object.keys(NETS).filter((k) => p.nets[k] && this.worst(k) === 'bad'), ready = done === APPROVAL.length && anyNet && !errs.length;
    R.append(h('h3', {}, 'Zatwierdzanie (' + done + ' / ' + APPROVAL.length + ')'), h('div', { class: 'zebra' }, APPROVAL.map(([k, t], i) => h('label', { class: 'chk', style: { cursor: 'pointer', padding: '7px 9px' } }, h('input', { type: 'checkbox', checked: !!p.approval[k], style: { width: 'auto', flex: 'none' }, onchange: (e) => { p.approval[k] = e.target.checked; touch(); this.right(); } }), h('span', {}, (i + 1) + '. ' + t)))));
    const fin = h('button', { class: 'btn pri', style: { width: '100%', marginTop: '10px', padding: '12px', fontSize: '15px' }, disabled: !ready, onclick: () => this.finalPublish(), title: ready ? '' : 'Wymaga: wszystkie kroki zatwierdzone, min. 1 sieć, brak błędów' }, 'FINAL PUBLISH');
    R.append(fin, h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich(ready ? 'Gotowe. Zostanie przygotowany (pakiet ZIP) dla wybranych sieci i otwarte strony wgrywania. Opublikujesz ręcznie jednym kliknięciem w serwisie.' : (!anyNet ? 'Zaznacz co najmniej jedną sieć.' : errs.length ? 'Popraw błędy w: ' + errs.map((k) => NETS[k].n).join(', ') + '.' : 'Zaznacz wszystkie kroki zatwierdzenia.')) }));
    // dziennik
    const lg = P.cur.log || (P.cur.log = []); R.append(h('h3', {}, 'Dziennik'), lg.length ? h('div', { class: 'zebra' }, lg.slice(0, 15).map((e) => h('div', { style: { padding: '6px 9px' } }, h('div', { class: 'fine' }, new Date(e.ts).toLocaleString('pl-PL')), h('div', {}, e.t)))) : h('div', { class: 'hint' }, 'Brak wpisów.'));
    this.calendar();
  },
  log(t) { (P.cur.log = P.cur.log || []).unshift({ ts: Date.now(), t }); if (P.cur.log.length > 100) P.cur.log.length = 100; touch(); },

  // ── FINAL PUBLISH ──
  finalPublish() {
    const p = this.p, nets = Object.keys(NETS).filter((k) => p.nets[k]);
    modal('FINAL PUBLISH: ostatnie potwierdzenie', h('div', {}, h('p', {}, 'Przygotuję pakiet i otworzę strony wgrywania dla: ' + nets.map((k) => NETS[k].n).join(', ') + '.'), h('div', { class: 'hint', html: rich('Nic nie zostanie opublikowane automatycznie. (W serwisie sam zatwierdzisz publikację.) Pakiet zawiera plik, okładkę, opisy gotowe do wklejenia i metadane.') })), [{ t: 'Tak, przygotuj', cls: 'pri', fn: () => this.doFinal(nets) }, { t: 'Wróć' }]);
  },
  async doFinal(nets) {
    const pr = progressModal('Przygotowanie pakietu'); try {
      const p = this.p, files = []; pr.set(0.1, 'zbieranie plików');
      if (p.kind === 'video') { const b = await Assets.blob(p.video); if (!b) throw new Error('Brak pliku wideo w bibliotece. Wyeksportuj rolkę ponownie.'); files.push({ name: 'wideo/' + p.videoInfo.name, data: b }); }
      else { const post = this.post(); if (!post) throw new Error('Nie wybrano projektu graficznego.'); for (let i = 0; i < post.slides.length; i++) { pr.set(0.1 + 0.5 * i / post.slides.length, 'slajd ' + (i + 1)); files.push({ name: `obrazy/slajd_${pad2(i + 1)}.png`, data: await Creative.renderBlob(post.slides[i], 'image/png') }); await tick(); } }
      if (p.cover) { const cb = await Assets.blob(p.cover); if (cb) files.push({ name: 'okladka.png', data: cb }); }
      for (const k of nets) { const c = this.compose(k); files.push({ name: `opisy/${k}_${slug(NETS[k].n)}.txt`, data: (c.title && k === 'yt' ? 'TYTUŁ:\n' + c.title + '\n\nOPIS:\n' : '') + c.text + '\n' }); }
      const meta = { aplikacja: APP.name + ' ' + APP.ver, autor: APP.author, projekt: P.cur.name, wygenerowano: new Date().toISOString(), sieci: nets, rodzaj: p.kind, plik: p.videoInfo || null, termin: p.schedule || null, zatwierdzenia: p.approval };
      files.push({ name: 'metadane.json', data: JSON.stringify(meta, null, 2) }); files.push({ name: 'CZYTAJ.txt', data: 'Pakiet publikacji: ' + P.cur.name + '\n\n1. Otwórz stronę wgrywania danej sieci (otworzyły się w nowych kartach).\n2. Wgraj plik z folderu wideo/ (lub obrazy/).\n3. Wklej opis z folderu opisy/.\n4. Ustaw okładkę (okladka.png), jeśli sieć o nią pyta.\n5. Zatwierdź publikację w serwisie.\n' });
      pr.set(0.8, 'pakowanie'); const zip = await makeZip(files); pr.close(); download(zip, fname('pakiet', 'zip'));
      nets.forEach((k, i) => setTimeout(() => window.open(NETS[k].url, '_blank', 'noopener'), i * 250)); this.log('FINAL PUBLISH: pakiet dla ' + nets.map((k) => NETS[k].n).join(', ') + ' (wgrywanie ręczne).');
      if (p.schedule) this.addCal({ title: P.cur.name, date: p.schedule.slice(0, 10), time: p.schedule.slice(11, 16), nets, status: 'ready' }, true); this.right(); toast('Pakiet pobrany, strony wgrywania otwarte. Jeśli przeglądarka zablokowała okna, użyj przycisków „Otwórz stronę wgrywania”.', 'ok', 9000);
    } catch (e) { pr.close(); toast('Nie udało się przygotować pakietu: ' + errText(e), 'bad', 10000); this.log('Błąd pakietu: ' + errText(e)); }
  },

  // ── Kalendarz treści ──
  addCal(e, silent) { const c = P.cur.calendar; c.push(Object.assign({ id: uid('c'), date: '', time: '18:00', title: '', nets: ['ig'], status: 'plan', note: '' }, e)); c.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)); touch(); if (!silent) this.right(); },
  calendar() {
    const R = this.R, cal = P.cur.calendar.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)); const today = new Date().toISOString().slice(0, 10);
    R.append(h('h3', {}, 'Kalendarz treści'), h('div', { class: 'row', style: { marginBottom: '8px' } }, h('button', { class: 'btn', onclick: () => this.calModal() }, '＋ Dodaj wpis'), h('button', { class: 'btn sea', onclick: () => this.aiPlan() }, '✨ Plan tygodnia (AI)'), h('button', { class: 'btn', onclick: () => this.ics() }, 'Eksport .ics')));
    if (!cal.length) { R.append(h('div', { class: 'hint', html: rich('Pusto. Dodaj wpis ręcznie albo poproś AI o plan tygodnia (na bazie marki i filarów treści).') })); return; }
    const box = h('div', { class: 'zebra' }); const st = { plan: ['off', 'pomysł'], ready: ['warn', 'gotowe'], done: ['ok', 'opublikowane'] }; let lastDay = '';
    for (const e of cal) { const d = new Date(e.date + 'T12:00'), day = isNaN(d) ? e.date : d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }); box.append(h('div', { style: { padding: '7px 9px', display: 'flex', gap: '8px', alignItems: 'center', opacity: e.date < today && e.status !== 'done' ? 0.65 : 1 } }, h('div', { style: { minWidth: '112px' } }, h('div', { style: { fontWeight: 600 } }, day === lastDay ? '' : day), h('div', { class: 'fine' }, e.time || '')), h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, e.title || '(bez tytułu)'), h('div', { class: 'fine' }, (e.nets || []).map((k) => NETS[k] ? NETS[k].n : k).join(' · ') + (e.note ? ' · ' + e.note : ''))), h('span', { class: 'tag fix ' + st[e.status][0] }, st[e.status][1]), h('button', { class: 'btn sm', onclick: () => this.calModal(e) }, '✎'), h('button', { class: 'btn sm bad', onclick: () => { P.cur.calendar = P.cur.calendar.filter((x) => x !== e); touch(); this.right(); } }, '🗑'))); lastDay = day; }
    R.append(box);
  },
  calModal(e) {
    const o = e ? Object.assign({}, e, { nets: (e.nets || []).slice() }) : { title: this.p.title || P.cur.name, date: new Date().toISOString().slice(0, 10), time: '18:00', nets: Object.keys(NETS).filter((k) => this.p.nets[k]), status: 'plan', note: '' };
    modal(e ? 'Edytuj wpis' : 'Nowy wpis w kalendarzu', h('div', {}, fld({ k: 'title', t: 'text', label: 'Temat / tytuł' }, o, () => {}), rowOf(h('div', { class: 'fld' }, h('label', {}, 'Data'), h('input', { type: 'date', value: o.date, onchange: (x) => { o.date = x.target.value; } })), fld({ k: 'time', t: 'text', label: 'Godzina (HH:MM)' }, o, () => {})), fld({ k: 'status', t: 'seg', label: 'Status', opts: [['plan', 'Pomysł'], ['ready', 'Gotowe'], ['done', 'Opublikowane']] }, o, () => {}), h('div', { class: 'fld' }, h('label', {}, 'Sieci'), h('div', { class: 'chips' }, Object.entries(NETS).map(([k, N]) => { const c = h('span', { class: 'chip' + (o.nets.includes(k) ? ' on' : ''), onclick: () => { o.nets.includes(k) ? o.nets.splice(o.nets.indexOf(k), 1) : o.nets.push(k); c.classList.toggle('on'); } }, N.n); return c; }))), fld({ k: 'note', t: 'text', label: 'Notatka' }, o, () => {})),
      [{ t: 'Zapisz', cls: 'pri', fn: () => { if (!o.date) { toast('Podaj datę.', 'warn'); return false; } if (e) { Object.assign(e, o); P.cur.calendar.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)); touch(); this.right(); } else this.addCal(o); } }, { t: 'Anuluj' }]);
  },
  async aiPlan() {
    const pr = progressModal('Plan tygodnia'); try { pr.set(0.3, 'AI układa plan'); const start = new Date(); start.setDate(start.getDate() + 1); const j = await AI.json('Jesteś strategiem treści Instagram/TikTok/YouTube dla polskiego trenera personalnego (leady B2C, zdrowie, trening). Planujesz konkretne tematy, różnorodne formaty, bez waty. ' + BRAND_CTX(), `Zaplanuj 5 publikacji na najbliższe 7 dni od ${start.toISOString().slice(0, 10)}. Zwróć tablicę JSON: [{"date":"YYYY-MM-DD","time":"HH:MM","title":"konkretny temat (max 80 znaków)","format":"rolka|karuzela|story","note":"jednozdaniowy hook"}]`, 1800); const arr = (Array.isArray(j) ? j : j.items || []).slice(0, 7); if (!arr.length) throw new Error('Pusta odpowiedź'); for (const x of arr) this.addCal({ date: x.date, time: x.time || '18:00', title: x.title, nets: ['ig', 'tt', 'yt', 'fb'].filter((k) => this.p.nets[k]), status: 'plan', note: [x.format, x.note].filter(Boolean).join(': ') }, true); pr.close(); this.right(); toast('Dodano ' + arr.length + ' pomysłów do kalendarza.', 'ok'); } catch (e) { pr.close(); toast('Nie udało się ułożyć planu: ' + errText(e), 'bad', 9000); }
  },
  ics() {
    const cal = P.cur.calendar; if (!cal.length) { toast('Kalendarz jest pusty.', 'warn'); return; } const z = (d, t) => d.replace(/-/g, '') + 'T' + (t || '1800').replace(':', '') + '00'; const esc2 = (s) => String(s || '').replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Creative Studio Social//PL', ...cal.flatMap((e) => ['BEGIN:VEVENT', 'UID:' + e.id + '@css', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART:' + z(e.date, e.time), 'SUMMARY:' + esc2(e.title), 'DESCRIPTION:' + esc2((e.nets || []).map((k) => NETS[k] ? NETS[k].n : k).join(', ') + (e.note ? ' | ' + e.note : '')), 'END:VEVENT']), 'END:VCALENDAR'];
    download(new Blob([lines.join('\r\n')], { type: 'text/calendar' }), fname('kalendarz', 'ics'));
  },
};
