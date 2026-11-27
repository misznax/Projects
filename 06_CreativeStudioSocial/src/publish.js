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
  show() { if (!this.built) this.build(); const p = this.p; p.kind = p.kind || 'video'; p.approval = p.approval || {}; p.nets = Object.assign({ ig: true, yt: true, tt: true, fb: true }, p.nets); p.mode = p.mode || 'auto'; this.render(); this.loadPlan().then(async () => { let ch = this.autofill(); if (!p.cover && p.coverSpec && (p.coverSpec.lines || []).length && p.kind === 'video') { try { ch = (await this.makeCover(true)) || ch; } catch (e) { console.warn('miniatura', e); } } if (ch && S.tab === 'publish') this.render(); }); },
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
    { const pe = this.planEntry(); if (pe && pe.sources && pe.sources.length) { const has = /(Źródło|Źródła|Zrodlo|Source)\s*:/i.test(p.caption || ''); add(has ? 'ok' : 'warn', has ? 'Opis zawiera linię ze źródłem' : 'W opisie brakuje linii ze źródłem, a plan agenta ją ma'); } }
    add(p.cover ? 'ok' : 'warn', p.cover ? 'Miniatura ustawiona' : 'Brak miniatury (wygeneruj ją w sekcji 2)');
    if (p.schedule) { const d = new Date(p.schedule); add(d.getTime() > Date.now() ? 'ok' : 'warn', 'Termin: ' + d.toLocaleString('pl-PL') + (d.getTime() > Date.now() ? '' : ' (w przeszłości)')); }
    return out;
  },
  worst(n) { const v = this.validate(n); return v.some((x) => x.ok === 'bad') ? 'bad' : v.some((x) => x.ok === 'warn') ? 'warn' : 'ok'; },

  // ── Plan agenta (public/rolki.json): opis ze źródłami, hashtagi i tekst miniatury wpisują się same ──
  plan: null, topics: [], pool: {},
  async loadPlan() {
    if (this.plan) return this.plan;
    try { const r = await fetch('rolki.json?v=' + Date.now(), { cache: 'no-store' }); const j = r.ok ? await r.json() : null; this.plan = j && Array.isArray(j.reels) ? j.reels : []; this.topics = j && Array.isArray(j.topics) ? j.topics : []; this.pool = (j && j.numeracja) || {}; } catch (e) { this.plan = []; this.topics = []; this.pool = {}; }
    return this.plan;
  },
  planEntry() { return (this.plan || []).find((x) => x.id === this.p.planId) || null; },
  // wpisuje tylko puste pola (nic nie nadpisuje); zwraca true, gdy coś zmieniono
  autofill() {
    const p = this.p, pl = this.plan || []; if (!pl.length) return false;
    if (!p.planId) { const a = pl.find((x) => x.active); if (a) p.planId = a.id; }
    const e = this.planEntry(); if (!e) return false; let ch = false;
    if (!(p.caption || '').trim() && e.caption) { p.caption = e.caption; ch = true; }
    if (!(p.hashtags || '').trim() && e.hashtags) { p.hashtags = e.hashtags; ch = true; }
    if (!(p.title || '').trim() && e.title) { p.title = e.title; ch = true; }
    if ((!p.coverSpec || !(p.coverSpec.lines || []).some((x) => String(x).trim())) && e.cover) { p.coverSpec = jclone(e.cover); ch = true; }
    const nsig = e.id + ':' + (e.nets || []).join(','); if (e.nets && p.netsFromPlan !== nsig) { for (const k of Object.keys(NETS)) p.nets[k] = e.nets.includes(k); p.netsFromPlan = nsig; ch = true; }
    if (ch) { p.auto = { id: e.id, title: e.title, ts: Date.now() }; touch(); this.log('Opis, hashtagi i tekst miniatury wpisane automatycznie z planu agenta: ' + e.id + ' ' + e.title); }
    return ch;
  },
  async applyPlan(id) {
    const e = (this.plan || []).find((x) => x.id === id), p = this.p; if (!e) { p.planId = ''; touch(); this.render(); return; }
    if (((p.caption || '').trim() || (p.hashtags || '').trim()) && p.planId !== id && !await askYes('Zastąpić opis, hashtagi i tekst miniatury tekstem z planu: ' + e.id + ' ' + e.title + '?', 'Zastąp')) { this.render(); return; }
    p.planId = id; p.caption = e.caption || ''; p.hashtags = e.hashtags || ''; p.title = e.title || ''; p.coverSpec = e.cover ? jclone(e.cover) : null; p.cover = null; p.auto = { id: e.id, title: e.title, ts: Date.now() }; touch(); this.log('Wczytano z planu agenta: ' + e.id + ' ' + e.title);
    try { await this.makeCover(true); } catch (er) { console.warn(er); } this.render();
  },
  // miniatura z hookiem: rysowana w kodzie (bez AI); useFrame = klatka wyeksportowanej rolki jako tło
  async makeCover(silent, useFrame) {
    const p = this.p; let spec = p.coverSpec;
    if (!spec || !(spec.lines || []).some((x) => String(x).trim())) { const m = (this.reel && this.reel.meta) || {}; if (!m.hook) { if (!silent) toast('Wpisz linie miniatury (hook) albo wybierz tekst z planu agenta.', 'warn'); return false; } spec = p.coverSpec = Cover.fromHook(m.hook, m.concept || ''); }
    let frame = null; if (useFrame) { try { const vb = p.video ? await Assets.blob(p.video) : null; if (!vb) throw new Error('brak wyeksportowanego wideo'); frame = await Cover.frameFrom(vb, +p.coverT || 0.6); } catch (e) { toast('Klatka niedostępna (' + errText(e) + '), robię samą grafikę.', 'warn'); } }
    const b = await Cover.render(spec, { frame }); if (!b) throw new Error('Nie udało się narysować miniatury.');
    p.cover = await Assets.add(new File([b], fname('miniatura_' + slug(spec.kicker || P.cur.name), 'png'), { type: 'image/png' }), 'image', { desc: 'Miniatura z hookiem: ' + (spec.lines || []).join(' ').replace(/\*/g, ''), origin: 'Publikacja' }); touch(); if (!silent) toast('Miniatura gotowa.', 'ok'); return true;
  },
  netsPl() { const m = { ig: 'Instagramie (Reel)', fb: 'Facebooku (Reel)', yt: 'YouTube (Shorts)', tt: 'TikToku' }, a = Object.keys(NETS).filter((k) => this.p.nets[k]).map((k) => m[k] || NETS[k].n); return a.length > 1 ? a.slice(0, -1).join(', ') + ' i ' + a[a.length - 1] : (a[0] || 'Instagramie'); },
  agentCmd() { const p = this.p; return 'Opublikuj ' + reelFolderName() + ' na ' + this.netsPl() + ' ' + (p.schedule ? 'o ' + new Date(p.schedule).toLocaleString('pl-PL') : 'od razu') + ' przez Metricool. Materiały są na Drive: Śmiało – Rolki / ' + reelPath().replace('/', ' / ') + '. Po publikacji: status i data w Liście rolek, folder do Opublikowane.'; },
  // tryb automatyczny: plik + miniatura + opis na Drive, resztę (Metricool) robi agent na Twoje polecenie
  async sendAuto() {
    const p = this.p, info = p.videoInfo; if (!p.video || !info) { toast('Najpierw wyeksportuj rolkę w pełnej jakości (Wideo → Eksport).', 'warn'); return; }
    if (!DriveUp.cfg()) { DriveUp.setup(() => this.sendAuto()); return; }
    try {
      const vb = await Assets.blob(p.video); if (!vb) throw new Error('Brak pliku wideo w bibliotece. Wyeksportuj rolkę ponownie.');
      const res = await DriveUp.deliver(vb, info.name, { sub: reelPath() }); if (!res) return;
      let cv = null; if (p.cover) { const cb = await Assets.blob(p.cover); if (cb) cv = await DriveUp.deliver(cb, info.name.replace(/\.[^.]+$/, '') + '_miniatura.png', { draft: true, sub: reelPath() }); }
      this.log('Pakiet wysłany na Drive dla agenta: ' + res.name + (cv ? ' i miniatura' : ' (bez miniatury)'));
      modal('Pakiet jest na Drive', h('div', {}, DriveUp.resultBox(res), cv ? h('div', { style: { marginTop: '6px' } }, 'Miniatura: ', h('a', { href: cv.url, target: '_blank', rel: 'noopener' }, cv.name)) : h('div', { class: 'warnrow' }, 'Bez miniatury: wygeneruj ją w sekcji 2 i wyślij ponownie.'), h('div', { class: 'hint', style: { marginTop: '8px' } }, 'Napisz agentowi w czacie: ' + this.agentCmd())),
        [{ t: 'Skopiuj polecenie', cls: 'pri', keep: true, fn: () => { navigator.clipboard.writeText(this.agentCmd()).then(() => toast('Skopiowano polecenie dla agenta', 'ok')).catch((e) => toast(errText(e), 'bad')); return false; } }, { t: 'Zamknij' }]);
      this.render();
    } catch (e) { console.error(e); modal('Nie udało się wysłać na Drive', h('div', {}, h('div', { class: 'warnrow bad' }, errText(e)), h('div', { class: 'hint', style: { marginTop: '8px' } }, 'Sprawdź ⚙ Drive albo użyj trybu ręcznego (pakiet ZIP).')), [{ t: 'Zamknij' }]); }
  },
  sec(num, title, hint, ...kids) {
    return h('div', { class: 'pubsec', style: { border: '1px solid var(--bd)', borderRadius: '12px', padding: '12px 14px', margin: '0 0 12px', background: 'var(--p2)' } },
      h('h3', { style: { margin: '0 0 6px', display: 'flex', gap: '9px', alignItems: 'center' } }, h('span', { style: { background: '#8B6CFF', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flex: 'none' } }, String(num)), title),
      hint ? h('div', { class: 'hint', style: { margin: '0 0 8px' } }, hint) : null, ...kids);
  },

  // ── Lewa kolumna: 1 Materiał, 2 Miniatura, 3 Opis i hashtagi, 4 Termin ──
  left() {
    const L = this.L, p = this.p, c = P.cur; L.innerHTML = ''; const info = p.videoInfo, mat = h('div', {});
    if (p.kind === 'video') {
      mat.append(...[info && p.video ? h('div', { class: 'card' }, h('table', { class: 'qc' }, ...[['Plik', info.name], ['Rozmiar', fmtSize(info.size)], ['Długość', info.dur.toFixed(1) + ' s'], ['Wymiary', info.w + '×' + info.h + ' @ ' + info.fps + ' fps'], ['Kodeki', info.note || info.kind], ['Wyeksportowano', new Date(info.ts).toLocaleString('pl-PL')]].map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, b))))) : h('div', { class: 'hint' }, 'Brak wyeksportowanej rolki. Zaprojektuj ją w zakładce Wideo i wybierz Eksport → Pełna jakość.'),
        h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn', onclick: () => S.go('video') }, 'Przejdź do Wideo'), info && p.video ? h('button', { class: 'btn', onclick: async () => { const b = await Assets.blob(p.video); if (b) download(b, info.name); } }, 'Pobierz plik') : null),
        p.drive ? h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Na Drive: ', h('a', { href: p.drive.url, target: '_blank', rel: 'noopener' }, p.drive.name), p.drive.folder ? h('span', {}, ' · ', h('a', { href: p.drive.folder, target: '_blank', rel: 'noopener' }, 'folder rolki na Drive')) : null, ' · ' + new Date(p.drive.ts).toLocaleString('pl-PL')) : null].filter(Boolean));
    } else { const sel = h('select', { onchange: (e) => { p.postId = e.target.value; touch(); this.right(); } }, c.posts.map((x) => h('option', { value: x.id, selected: x.id === (p.postId || c.curPost) }, x.name + ' (' + x.slides.length + ' szt.)'))); mat.append(c.posts.length ? sel : h('div', { class: 'hint' }, 'Brak projektów graficznych. Utwórz karuzelę w zakładce Grafiki.')); }
    L.append(this.sec(1, 'Materiał', 'Plik z eksportu w pełnej jakości. Szkic tu nie trafia.', h('div', { class: 'fld' }, h('label', {}, 'Rodzaj materiału'), fld({ k: 'kind', t: 'seg', opts: [['video', 'Rolka (wideo)'], ['images', 'Karuzela / zdjęcia']] }, p, () => { touch(); this.render(); })), mat));

    // 2. Miniatura z hookiem
    const sp = p.coverSpec || { kicker: '', lines: [], sub: '' }, ens = () => (p.coverSpec = p.coverSpec || sp), regen = (fr) => async () => { try { await this.makeCover(false, fr); this.render(); } catch (e) { toast('Miniatura nieudana: ' + errText(e), 'bad', 9000); } };
    const kick = h('input', { type: 'text', value: sp.kicker || '', placeholder: 'Nazwa zjawiska, np. EFEKT REFLEKTORA', oninput: (e) => { ens().kicker = e.target.value; touch(); } }), lines = h('textarea', { rows: 3, placeholder: 'Hook w 2 do 3 liniach. Linia w gwiazdkach ma gradient: *KTOŚ PATRZY*', oninput: (e) => { ens().lines = e.target.value.split('\n'); touch(); } }), sub = h('input', { type: 'text', value: sp.sub || '', placeholder: 'Podpis, np. Sprawdzono to na koszulkach', oninput: (e) => { ens().sub = e.target.value; touch(); } }); lines.value = (sp.lines || []).join('\n');
    const prev = p.cover ? h('div', { style: { width: '135px', height: '240px', flex: 'none', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--bd)', background: '#05070A' } }, (() => { const im = imgThumbEl(p.cover); im.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block'; return im; })()) : h('div', { class: 'hint', style: { width: '135px', height: '240px', flex: 'none', border: '1px dashed var(--bd)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '8px' } }, 'Brak miniatury');
    L.append(this.sec(2, 'Miniatura z hookiem', 'Rysowana w kodzie z marki (ciemne tło, reflektor, fiolet jako akcent), bez AI. Hook pokazuje problem, który widz chce rozwiązać. Treść leży w pasie bezpiecznym siatki profilu.',
      h('div', { class: 'row', style: { alignItems: 'flex-start', gap: '12px' } }, prev, h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { class: 'fld' }, h('label', {}, 'Nazwa zjawiska'), kick), h('div', { class: 'fld' }, h('label', {}, 'Hook (linie)'), lines), h('div', { class: 'fld' }, h('label', {}, 'Podpis'), sub))),
      h('div', { class: 'row', style: { marginTop: '8px', flexWrap: 'wrap' } }, h('button', { class: 'btn pri', onclick: regen(false) }, '✨ Wygeneruj'), p.video ? h('button', { class: 'btn', title: 'Używa klatki wyeksportowanej rolki jako tła', onclick: regen(true) }, '🎞 Z klatki') : null, h('button', { class: 'btn', onclick: async () => { const a = await assetPicker(['image', 'ai'], 'Miniatura: wybierz obraz'); if (a) { p.cover = a.id; touch(); this.render(); } } }, 'Własna…'), p.cover ? h('button', { class: 'btn', onclick: async () => { const b = await Assets.blob(p.cover); if (b) download(b, fname('miniatura', 'png')); } }, 'PNG') : null, p.cover ? h('button', { class: 'btn bad', onclick: () => { p.cover = null; touch(); this.render(); } }, 'Usuń') : null)));

    // 3. Opis i hashtagi (ze źródłami)
    const cnt = (el, max) => { const s = h('span', { class: 'fine' }); const f = () => { s.textContent = el.value.length + (max ? ' / ' + max : ''); s.style.color = max && el.value.length > max ? 'var(--bad)' : ''; }; el.addEventListener('input', f); f(); return s; };
    const title = h('input', { type: 'text', value: p.title || '', placeholder: 'Tytuł (YouTube, opcjonalnie Facebook)', oninput: (e) => { p.title = e.target.value; touch(); }, onchange: () => this.right() }), cap = h('textarea', { rows: 9, placeholder: 'Pierwsza linia zatrzymuje kciuk. Potem treść, jedno wezwanie do działania i linia ze źródłem.', oninput: (e) => { p.caption = e.target.value; touch(); }, onchange: () => this.right() }), tg = h('textarea', { rows: 2, placeholder: '#trening #zdrowie …', oninput: (e) => { p.hashtags = e.target.value; touch(); }, onchange: () => this.right() }); cap.value = p.caption || ''; tg.value = p.hashtags || '';
    const pl = this.plan || [], hasSrc = /(Źródło|Źródła|Zrodlo|Source)\s*:/i.test(p.caption || '');
    L.append(this.sec(3, 'Opis i hashtagi', 'Wpisują się same z planu agenta (razem ze źródłami). Możesz je poprawić ręcznie.',
      pl.length ? h('div', { class: 'fld' }, h('label', {}, 'Tekst z planu agenta'), h('select', { onchange: (e) => this.applyPlan(e.target.value) }, h('option', { value: '' }, '(bez planu)'), pl.map((x) => h('option', { value: x.id, selected: x.id === p.planId }, x.id + ' · ' + x.title + (x.active ? ' (do publikacji)' : ''))))) : h('div', { class: 'hint' }, 'Plan agenta (rolki.json) się nie wczytał: wpisz opis ręcznie.'),
      p.auto ? h('div', { class: 'hint', style: { marginBottom: '6px' } }, '✓ Wpisano automatycznie: ' + p.auto.id + ' ' + p.auto.title + ' · ' + new Date(p.auto.ts).toLocaleString('pl-PL')) : null,
      h('div', { class: 'fld' }, h('label', {}, 'Tytuł'), title, cnt(title, 100)), h('div', { class: 'fld' }, h('label', {}, 'Opis (caption)'), cap, cnt(cap, 2200), h('div', { class: 'hint', style: { color: hasSrc ? 'var(--ok)' : 'var(--warn)' } }, hasSrc ? '✓ Opis ma linię ze źródłem' : '⚠ W opisie nie ma linii ze źródłem (📚 Źródło: …)')), h('div', { class: 'fld' }, h('label', {}, 'Hashtagi'), tg),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => navigator.clipboard.writeText(this.compose('ig').text).then(() => toast('Skopiowano opis z hashtagami', 'ok')).catch((e) => toast('Nie udało się skopiować: ' + errText(e), 'bad')) }, 'Kopiuj opis'), h('button', { class: 'btn', title: 'Dodatkowa opcja: AI proponuje inną wersję', onclick: () => this.aiText() }, '✨ Napisz inaczej (AI)'))));

    // 4. Termin
    const sch = h('input', { type: 'datetime-local', value: p.schedule || '', onchange: (e) => { p.schedule = e.target.value; touch(); this.right(); } });
    L.append(this.sec(4, 'Termin', 'Pusty = od razu. W trybie automatycznym agent ustawia godzinę w Metricool.', sch));
  },
  async aiText() {
    const p = this.p, r = this.reel, pr = progressModal('Piszę opis'); try {
      pr.set(0.3, 'AI'); const ctx = [r && r.meta && r.meta.concept ? 'Koncepcja: ' + r.meta.concept : '', r && r.meta && r.meta.hook ? 'Hook: ' + r.meta.hook : '', P.cur.audio.script ? 'Skrypt lektora: ' + P.cur.audio.script.slice(0, 1500) : '', p.caption ? 'Obecny opis: ' + p.caption : '', 'Cel: leady B2C dla trenera personalnego, CTA do kontaktu (smialo.org).'].filter(Boolean).join('\n');
      const j = await AI.json('Jesteś copywriterem social media dla polskiego trenera personalnego. Piszesz po polsku, konkretnie, bez waty, bez obietnic zdrowotnych bez pokrycia, bez myślników jako ozdobników. ' + BRAND_CTX(), ctx + '\nZwróć JSON: {"title":"max 90 znaków, dla YouTube","caption":"opis: pierwsza linia zatrzymuje (max 110 znaków), potem 2-4 krótkie zdania, jedno CTA; max 900 znaków","hashtags":["5 trafnych, polskie lub branżowe, bez #"]}', 1500);
      if (j.title) p.title = String(j.title).slice(0, 100); if (j.caption) p.caption = String(j.caption); if (j.hashtags) p.hashtags = [].concat(j.hashtags).map((x) => '#' + String(x).replace(/^#/, '')).join(' '); touch(); pr.close(); this.render(); toast('Wstawiono opis, tytuł i hashtagi. Sprawdź i popraw.', 'ok');
    } catch (e) { pr.close(); toast('Nie udało się wygenerować opisu: ' + errText(e), 'bad', 9000); }
  },

  // ── Prawa kolumna: 5 Sieci i kontrola, 6 Zatwierdzenie, 7 Publikacja (automatyczna / ręczna), historia ──
  right() {
    const R = this.R, p = this.p; R.innerHTML = ''; p.mode = p.mode || 'auto';
    const nets = h('div', {});
    for (const [k, N] of Object.entries(NETS)) {
      const v = this.validate(k), w = this.worst(k), on = !!p.nets[k]; const card = h('div', { class: 'netcard', style: { opacity: on ? 1 : 0.55 } }, h('h4', {}, h('label', { style: { display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: on, style: { width: 'auto', flex: 'none' }, onchange: (e) => { p.nets[k] = e.target.checked; touch(); this.right(); } }), h('span', {}, N.ic + '  ' + N.n)), on ? h('span', { class: 'tag ' + w }, { ok: 'gotowe', warn: 'uwagi', bad: 'błędy' }[w]) : null), ...(on ? v.map((x) => h('div', { class: 'chk ' + x.ok }, x.t)) : []),
        on ? h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn sm', onclick: () => window.open(N.url, '_blank', 'noopener') }, 'Otwórz stronę wgrywania ↗'), h('button', { class: 'btn sm', onclick: () => { const c = this.compose(k); navigator.clipboard.writeText((c.title && k === 'yt' ? c.title + '\n\n' : '') + c.text).then(() => toast('Skopiowano opis dla ' + N.n, 'ok')).catch((e) => toast(errText(e), 'bad')); } }, 'Kopiuj opis')) : null); nets.append(card);
    }
    R.append(this.sec(5, 'Sieci i kontrola', 'Zaznacz, gdzie publikujesz. Pod nazwą sieci widać kontrolę pliku i opisu (zielone = gotowe).', nets));
    const done = APPROVAL.filter(([k]) => p.approval[k]).length, anyNet = Object.keys(NETS).some((k) => p.nets[k]), errs = Object.keys(NETS).filter((k) => p.nets[k] && this.worst(k) === 'bad'), ready = done === APPROVAL.length && anyNet && !errs.length;
    const why = !anyNet ? 'Zaznacz co najmniej jedną sieć.' : errs.length ? 'Popraw błędy w: ' + errs.map((k) => NETS[k].n).join(', ') + '.' : done < APPROVAL.length ? 'Zaznacz wszystkie kroki zatwierdzenia.' : '';
    R.append(this.sec(6, 'Zatwierdzenie (' + done + ' / ' + APPROVAL.length + ')', 'Bez kompletu zaznaczeń publikacja jest zablokowana.', h('div', { class: 'zebra' }, APPROVAL.map(([k, t], i) => h('label', { class: 'chk', style: { cursor: 'pointer', padding: '7px 9px' } }, h('input', { type: 'checkbox', checked: !!p.approval[k], style: { width: 'auto', flex: 'none' }, onchange: (e) => { p.approval[k] = e.target.checked; touch(); this.right(); } }), h('span', {}, (i + 1) + '. ' + t))))));
    const modeSeg = fld({ k: 'mode', t: 'seg', opts: [['auto', 'Metricool (zalecana)'], ['manual', 'Ręczna (ZIP)']] }, p, () => { touch(); this.right(); });
    const vOk = !!(p.video && p.videoInfo), whyA = !vOk ? 'brak wyeksportowanej rolki. Wejdź w Wideo → Eksport w pełnej jakości (nie Szkic), potem wróć tu.' : why, readyA = ready && vOk, step = (n, t) => h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', margin: '10px 0 4px', fontWeight: 600 } }, h('span', { style: { background: 'var(--acc, #8B6CFF)', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flex: 'none' } }, n), h('span', {}, t));
    const auto = h('div', {}, h('div', { class: 'hint', style: { margin: '6px 0' } }, 'Idzie przez Metricool na: ' + this.netsPl() + '. Nic nie jest publikowane bez Twojego polecenia w czacie.'),
      readyA ? null : h('div', { class: 'warnrow', style: { margin: '6px 0' } }, 'Przycisk 1 jest wyszarzony, bo: ' + whyA),
      step(1, 'Wyślij plik, miniaturę i opis na Drive'),
      h('div', { class: 'row', style: { flexWrap: 'wrap' } }, h('button', { class: 'btn pri', style: { flex: 1, padding: '12px', fontSize: '15px' }, disabled: !readyA, onclick: () => this.sendAuto(), title: readyA ? '' : whyA }, '☁ Wyślij na Drive'), h('button', { class: 'btn', title: 'Połącz Drive: jednorazowa konfiguracja skryptu', onclick: () => DriveUp.setup() }, '⚙ Drive')),
      step(2, 'Napisz agentowi w czacie (wystarczy: publikuj)'),
      h('div', { class: 'hint', style: { margin: '2px 0 6px' } }, 'To zwykłe zdanie do czatu z agentem, nic się nie wysyła samo. Możesz je skopiować albo napisać własnymi słowami, np. publikuj od razu.'), h('div', { class: 'hint', style: { padding: '8px 10px', border: '1px dashed var(--bd)', borderRadius: '8px', userSelect: 'all' } }, this.agentCmd()),
      h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn pri', onclick: () => navigator.clipboard.writeText(this.agentCmd()).then(() => toast('Skopiowano polecenie dla agenta', 'ok')).catch((e) => toast(errText(e), 'bad')) }, '📋 Skopiuj polecenie')),
      step(3, 'Agent ustawia publikację w Metricool i podaje link do wpisu'));
    const manual = h('div', {}, h('div', { class: 'hint', style: { margin: '6px 0' } }, 'Pobierasz pakiet ZIP (plik, miniatura, opisy, metadane) i wgrywasz sam: otwierają się strony wgrywania wybranych sieci. Nic nie jest wysyłane automatycznie.'),
      h('button', { class: 'btn pri', style: { width: '100%', padding: '12px', fontSize: '15px' }, disabled: !ready, onclick: () => this.finalPublish(), title: ready ? '' : why }, 'FINAL PUBLISH (pakiet ZIP)'), ready ? null : h('div', { class: 'hint', style: { marginTop: '6px', color: 'var(--warn)' } }, why));
    R.append(this.sec(7, 'Publikacja', 'Wybierz tryb. Zalecany: Metricool przez agenta (3 kroki poniżej).', modeSeg, p.mode === 'manual' ? manual : auto));
    const ar = P.cur.archived;
    R.append(this.sec(8, 'Po publikacji: archiwum i nowa rolka', 'Numer rolki: ' + (reelNum() || 'brak (wybierz temat w oknie Nowa rolka)') + '. Archiwum zapisuje wszystko w jednym folderze na Drive (rolka, podkład, miniatura, opis, projekt Studia), żeby nic się nie zgubiło. Po publikacji folder przechodzi z Materiały do Opublikowane.',
      h('div', { class: 'row', style: { flexWrap: 'wrap' } }, h('button', { class: 'btn pri', style: { flex: 1, padding: '12px' }, onclick: () => archiveProject() }, '📦 Archiwizuj na Drive (' + reelPath() + ')'), h('button', { class: 'btn', disabled: reelDone(), title: reelDone() ? 'Folder jest już w Opublikowane' : 'Przenosi cały folder rolki z Materiały do Opublikowane', onclick: () => markPublished() }, reelDone() ? '✔ Folder w Opublikowane' : '✔ Opublikowana: przenieś do Opublikowane'), h('button', { class: 'btn', onclick: () => exportProject(), title: 'Pobiera ZIP z projektem na ten komputer' }, '⬇ Pobierz ZIP'), h('button', { class: 'btn', onclick: () => newReelPrompt() }, '➕ Nowa rolka')),
      ar ? h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Zarchiwizowano ' + new Date(ar.ts).toLocaleString('pl-PL') + ': ', ar.folder ? h('a', { href: ar.folder, target: '_blank', rel: 'noopener' }, ar.path || ar.name) : (ar.path || ar.name)) : null));
    const lg = P.cur.log || (P.cur.log = []); R.append(h('h3', { style: { margin: '18px 0 6px' } }, 'Historia'), lg.length ? h('div', { class: 'zebra' }, lg.slice(0, 15).map((e) => h('div', { style: { padding: '6px 9px' } }, h('div', { class: 'fine' }, new Date(e.ts).toLocaleString('pl-PL')), h('div', {}, e.t)))) : h('div', { class: 'hint' }, 'Brak wpisów.'));
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
