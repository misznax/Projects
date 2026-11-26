/* POMYSŁY: pomysły z Drive (ideas.json), posty z Instagrama (ig.json), wzorzec karuzeli (ref.json), slot na materiał instruktażowy.
   Z pomysłu powstaje plan: rolka (gdy są karty z czasem) albo karuzela dobrana do STRUKTURY treści (liczby → paski/liczba, spór → ostrzeżenie, źródło → osobny slajd).
   Różnicowanie: ostrzega o powtórkach (z postami i innymi pomysłami), podpowiada brakujący format, a seed pomysłu zmienia wariant tła i nagłówków. */
const STOPW = new Set(['przed', 'przez', 'jest', 'ktory', 'ktora', 'ktore', 'oraz', 'tego', 'tylko', 'jako', 'bedzie', 'czyli', 'ale', 'albo', 'takze', 'podczas', 'miedzy', 'kiedy', 'tych', 'tym', 'tej', 'nawet', 'wiecej', 'mniej', 'bardzo', 'moze', 'mozna', 'nie', 'sie']);
const DOM = new Set(['trenin', 'cwicze', 'cwicz', 'trenuj', 'trenow', 'badani', 'wynik', 'mozna']); // słowa obecne prawie wszędzie: nie świadczą o powtórce
const tokens = (s) => new Set(String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOPW.has(w)).map((w) => w.slice(0, 6)).filter((w) => !DOM.has(w)));
const jaccard = (a, b) => { let i = 0; for (const x of a) if (b.has(x)) i++; return i / ((a.size + b.size - i) || 1); };
const hash32 = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const pickBy = (seed, arr) => arr[seed % arr.length];
const cap1 = (s) => { s = String(s || '').trim().toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); };
const fdate = (d) => { try { return new Date(d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }); } catch (e) { return d; } };
const plu = (n, a, b, c) => n === 1 ? a : (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) ? b : c;
const ideaText = (it) => [it.title, it.hook, it.summary, (it.spoken || []).join(' '), (it.cards || []).map((c) => c.text).join(' ')].join(' ');

const Ideas = {
  built: false, selId: null, last: null, busy: false,
  list() { const sy = (SYNC.ideas && SYNC.ideas.items) || [], loc = (P.cur.ideasLocal || []).map((x) => Object.assign({ local: true }, x)); return [...loc, ...sy]; },
  posts() { return (SYNC.ig && SYNC.ig.posts) || []; },
  get cur() { return this.list().find((x) => x.id === this.selId) || null; },

  // ── Różnicowanie: powtórki + brakujący format ──
  checks(it) { // pokrycie haseł tematu (tytuł + hook + streszczenie) w treści posta lub innego pomysłu
    const core = tokens([it.title, it.hook, it.summary].join(' ')), out = []; if (core.size < 2) return out;
    const ov = (other) => { let i = 0; for (const x of core) if (other.has(x)) i++; return { i, r: i / core.size }; };
    for (const p of this.posts()) { const { i, r } = ov(tokens(p.caption)); if (i >= 3 && r >= 0.5) out.push({ lv: r >= 0.7 ? 'bad' : 'warn', text: `Temat pokrywa się z postem z ${fdate(p.date)} (${i} wspólne hasła z ${core.size})`, url: p.url }); }
    for (const o of this.list()) { if (o.id === it.id) continue; const { i, r } = ov(tokens([o.title, o.hook, o.summary].join(' '))); if (i >= 3 && r >= 0.55) out.push({ lv: 'warn', text: `Powtarza temat pomysłu „${o.title}” (${i} wspólne hasła)` }); }
    return out;
  },
  balance() {
    const ps = this.posts(); if (!ps.length) return null; const n = (t) => ps.filter((p) => p.type === t).length, car = n('CAROUSEL_ALBUM'), reel = n('REEL') + n('VIDEO'), img = n('IMAGE');
    const hint = reel === 0 ? 'Rolka da zasięg (w ostatnich 30 dniach: 0 rolek).' : car === 0 ? 'Karuzela da zaangażowanie (w ostatnich 30 dniach: 0 karuzel).' : 'Formaty są wyważone.';
    return `Ostatnie 30 dni: ${car} ${plu(car, 'karuzela', 'karuzele', 'karuzel')}, ${reel} ${plu(reel, 'rolka', 'rolki', 'rolek')}, ${img} ${plu(img, 'zdjęcie', 'zdjęcia', 'zdjęć')}. ${hint}`;
  },

  // ── Plan z pomysłu ──
  plan(it, format) {
    const hasCards = it.cards && it.cards.length; format = format || (hasCards ? 'rolka' : 'karuzela');
    return format === 'rolka' ? this.planReel(it) : this.planCarousel(it);
  },
  caption(it) { const first = it.hook || it.title, body = it.summary || (it.spoken || []).slice(1, 3).join(' '); return [first, body, it.src ? 'Źródło: ' + it.src : ''].filter(Boolean).join('\n\n'); },
  tag(it) { return it.tag || (SYNC.brand && SYNC.brand.tags && SYNC.brand.tags[0]) || null; },
  splitCard(txt) { const m = String(txt).match(/^([^:]{2,40}):\s*(.+)$/); return m ? [m[1].trim(), m[2].trim()] : [String(txt).trim(), '']; },
  pct(txt) { const m = String(txt).match(/(\d+[,.]?\d*(?:\s*-\s*\d+[,.]?\d*)?)\s*%/); return m ? { num: m[1].replace(/\s/g, '') + '%', rest: String(txt).replace(m[0], '').replace(/\s+(DO|OD)\s*$/i, '').replace(/\s{2,}/g, ' ').trim() } : null; },
  cardsToScenes(it, total) { // karty tekstu na ekranie (z czasem) → sceny: pierwszy = cover, procenty = stat, ostatni = cta, reszta = point
    const cards = it.cards, sp = it.spoken || [], T = total || it.dur || (cards[cards.length - 1].t + 4);
    return cards.map((c, i) => {
      const next = cards[i + 1] ? cards[i + 1].t : T, dur = clamp(next - c.t, 2, 15), voice = sp.filter((_, k) => Math.min(cards.length - 1, Math.floor(k * cards.length / Math.max(1, sp.length))) === i).join(' '), pc = this.pct(c.text), [lead, rest] = this.splitCard(c.text);
      if (i === 0) return { kind: 'cover', title: c.text, text: it.title, dur, voice, tag: this.tag(it) };
      if (i === cards.length - 1) return { kind: 'cta', title: c.text, cta: 'Obserwuj po więcej', dur, voice };
      if (pc) { const [l2] = this.splitCard(pc.rest || c.text); return { kind: 'stat', num: pc.num, title: this.splitCard(c.text)[0].replace(/%.*$/, '').trim() || l2, text: (rest || '').replace(pc.num.replace('%', ''), '').replace(/%/, '').replace(/\s+(DO|OD)\s*$/i, '').trim().toLowerCase(), dur, voice }; }
      return { kind: 'point', title: lead, text: rest ? cap1(rest) : '', dur, voice };
    });
  },
  planReel(it) {
    const scenes = this.cardsToScenes(it), why = it.cards && it.cards.length ? 'Ma karty tekstu na ekranie z czasem i skrypt lektora: pasuje do rolki.' : 'Brak kart z czasem: sceny z punktów pomysłu.';
    if (!(it.cards && it.cards.length)) { const c = this.planCarousel(it); return { format: 'rolka', why, scenes: c.slides.map((s) => Object.assign({ dur: 4 }, s)), hook: it.hook || it.title, caption: c.caption }; }
    return { format: 'rolka', why, scenes, hook: it.hook || scenes[0].title, concept: it.title, dur: it.dur, caption: this.caption(it) };
  },
  planCarousel(it) {
    const seed = hash32(it.id), lv = (SYNC.ideas && SYNC.ideas.levels) || {}, facts = it.facts || [], s = [], tag = this.tag(it);
    if (it.cards && it.cards.length) { const sc = this.cardsToScenes(it).map((x) => { const o = Object.assign({}, x); delete o.dur; delete o.voice; return o; }); const ev = this.evidence(it, lv, seed); return { format: 'karuzela', why: 'Karuzela z kart rolki: każda karta = slajd, na końcu źródło.', slides: [...sc.slice(0, -1), ...(ev ? [ev] : []), sc[sc.length - 1]], caption: this.caption(it) }; }
    s.push({ kind: 'cover', tag, title: it.title, text: !it.compare && it.summary && it.summary.length < 70 ? it.summary : '' });
    let why = 'Temat bez kart czasowych: karuzela dobrana do struktury treści.';
    if (it.compare) { s.push({ kind: 'point', tag: 'Sporne', title: pickBy(seed, ['Badania się różnią', 'Dowody są sprzeczne']), text: it.summary || '' }); why = 'Wyniki są sprzeczne: zaczynamy od ostrzeżenia, potem liczby obok siebie.'; }
    else if (it.summary && facts.length < 2 && !(it.items && it.items.length)) s.push({ kind: 'point', title: pickBy(seed, ['Co mówią badania', 'W skrócie']), text: it.summary });
    if (facts.length >= 2) { s.push({ kind: 'meter', title: pickBy(seed >> 2, ['W liczbach', 'Co wyszło w badaniach']), text: it.compare ? '' : (it.summary || ''), label: 'WYNIKI BADAŃ', items: facts.map((f) => `${f.label}|${f.value}|${f.max}|${f.txt || ''}`) }); if (!why.includes('liczby')) why = 'Są liczby z badań: slajd z paskami zamiast samego tekstu.'; }
    else if (facts.length === 1) s.push({ kind: 'stat', num: facts[0].txt || String(facts[0].value), title: facts[0].label });
    if (it.items && it.items.length) s.push(it.items.length >= 3 ? { kind: 'list', title: 'Najważniejsze', items: it.items.slice(0, 5) } : { kind: 'point', title: it.items[0], text: it.items.slice(1).join(' ') });
    if (it.note) s.push({ kind: 'point', title: 'Ważne zastrzeżenie', text: it.note });
    const ev = this.evidence(it, lv, seed); if (ev) s.push(ev);
    s.push({ kind: 'cta', title: 'Zapisz ten post', text: 'Przyda się, gdy będziesz układać plan.', cta: 'Obserwuj po więcej' });
    return { format: 'karuzela', why, slides: s, caption: this.caption(it) };
  },
  evidence(it, lv, seed) { if (!it.src && !it.level) return null; return { kind: 'point', tag: 'Skąd to wiemy', title: 'Źródło i siła dowodów', text: it.src || '', key: it.level ? 'Poziom dowodów: ' + (lv[it.level] || it.level) : '' }; },

  // ── Budowa projektu z planu ──
  slidesFrom(plan, fmt) { const n = plan.slides.length, off = hash32(this.selId || 'x') % 3; return plan.slides.map((c, i) => { const sc = makeScene(c.kind, Object.assign({}, c, { total: n, idx: i, num: c.num != null ? c.num : i }), fmt, i + off); sc.id = uid('s'); return sc; }); },
  makeCarousel(it) {
    const plan = this.plan(it, 'karuzela'), fmt = 'post45', slides = this.slidesFrom(plan, fmt); Creative.newPost(fmt, it.title.slice(0, 28), slides); if (plan.caption) { P.cur.publish.caption = (P.cur.publish.caption ? P.cur.publish.caption + '\n\n' : '') + plan.caption; }
    touch(); S.go('creative', true); toast('Karuzela z pomysłu: ' + slides.length + ' ' + plu(slides.length, 'slajd', 'slajdy', 'slajdów') + ' w stylu marki. Edytuj każdy z osobna.', 'ok', 6000);
  },
  async makeReel(it) {
    const plan = this.plan(it, 'rolka'); const r = await Video.fromPlan({ concept: it.title, hook: plan.hook, caption: plan.caption, scenes: plan.scenes }, { style: 'dynamic' }); S.go('video', true); toast('Rolka „' + r.name + '”: ' + plan.scenes.length + ' ' + plu(plan.scenes.length, 'scena', 'sceny', 'scen') + ', skrypt lektora jest w zakładce Audio.', 'ok', 7000);
  },
  async aiExpand(it) {
    if (this.busy) return; this.busy = true; const pr = progressModal('Rozwijam pomysł (AI)'); pr.set(0.2, 'układanie slajdów');
    try {
      const ref = SYNC.ref || {}, clean = jclone(it); delete clean.variants; delete clean.doc; delete clean.shots;
      const arr = await AI.json('Jesteś copywriterem polskiego trenera personalnego (psychologia sportu, nauka o treningu). Piszesz zwięźle, konkretnie, bez waty, bez myślników jako ozdobników. Używasz WYŁĄCZNIE faktów z podanego pomysłu: nie zmyślasz liczb, badań ani źródeł. ' + BRAND_CTX(),
        `Pomysł (JSON): ${JSON.stringify(clean)}\nStruktura wzorcowej karuzeli marki: ${ref.structure || 'cover → point → … → recap'}.\nDostępne rodzaje slajdów: cover, point, list, quote, stat, steps, flow, chips, meter, recap, cta.\nPola: title (max 8 słów), text (max 30 słów), key (wniosek, 1 zdanie), note (źródło), tag, items[] (list/steps/chips/recap; w chips "~" na początku = przekreślony), nodes[] (dokładnie 4 węzły pętli dla flow), num (stat), meter: items ["etykieta|wartość|max|opis"].\nZwróć tablicę JSON z 7–9 slajdami. Pierwszy: cover, ostatni: cta lub recap. ZRÓŻNICUJ rodzaje (nie same point): dopasuj do treści (liczby → meter/stat, kroki → steps, mechanizm → flow, lista → chips/list).`, 3400);
      const sl = (Array.isArray(arr) ? arr : arr.slides || []).filter((c) => TPL_KINDS.some((k) => k[0] === c.kind)); if (sl.length < 4) throw new Error('Model zwrócił za mało slajdów.');
      const slides = this.slidesFrom({ slides: sl }, 'post45'); pr.close(); Creative.newPost('post45', it.title.slice(0, 28) + ' (AI)', slides); touch(); S.go('creative', true); toast('Gotowe: ' + slides.length + ' ' + plu(slides.length, 'slajd', 'slajdy', 'slajdów') + ' z AI.', 'ok');
    } catch (e) { pr.close(); toast('AI nie rozwinęło pomysłu: ' + errText(e) + ' Użyj planu automatycznego.', 'bad', 8000); } finally { this.busy = false; }
  },

  // ── UI ──
  show() { if (!this.built) this.build(); this.render(); },
  build() { const root = $('#m-ideas'); root.innerHTML = ''; this.left = h('div', { class: 'panel pad' }); this.main = h('div', { class: 'panel r pad', style: { borderLeft: 0, background: 'var(--bg)' } }); root.append(this.left, this.main); this.built = true; },
  render() {
    this.renderLeft(); this.renderMain();
  },
  syncLine() { const a = SYNC.ideas && SYNC.ideas.syncedAt, b = SYNC.ig && SYNC.ig.syncedAt, c = SYNC.brand && SYNC.brand.syncedAt; return `Drive: ${a ? fdate(a) : 'brak'} · Instagram: ${b ? fdate(b) : 'brak'} · Marka: ${c ? fdate(c) : 'wbudowana'}`; },
  renderLeft() {
    const L = this.left; L.innerHTML = ''; const list = this.list();
    L.append(h('div', { class: 'autocard' }, h('div', { style: { fontWeight: 700 } }, 'Dane z automatu'), h('div', { class: 'fine' }, this.syncLine()), h('div', { class: 'fine' }, 'Pomysły i posty ładują się same z Drive i Instagrama (odświeża je zadanie w chmurze), nic nie wgrywasz.'),
      h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sm', onclick: async () => { await syncLoad(true); if (P.cur.brand.auto) { applyAutoBrand(P.cur.brand); touch(); } this.render(); toast('Odświeżono dane z automatu.', 'ok'); } }, 'Odśwież teraz'), h('button', { class: 'btn sm', onclick: () => this.addLocal() }, '＋ Własny pomysł'))));
    const bal = this.balance(); if (bal) L.append(h('div', { class: 'hint', style: { margin: '8px 0' } }, bal));
    L.append(h('div', { class: 'ph' }, 'Pomysły (' + list.length + ')'));
    const box = h('div', { class: 'ideas' }); for (const it of list) {
      const ck = this.checks(it), has = it.cards && it.cards.length, lv = it.level ? h('span', { class: 'lv fix lv' + it.level, title: ((SYNC.ideas && SYNC.ideas.levels) || {})[it.level] || '' }, it.level) : null;
      box.append(h('div', { class: 'idea' + (it.id === this.selId ? ' on' : ''), onclick: () => { this.selId = it.id; this.render(); } }, h('div', { style: { display: 'flex', gap: '6px', alignItems: 'flex-start' } }, h('div', { style: { flex: 1, fontWeight: 600 } }, it.title), lv),
        h('div', { class: 'fine' }, (has ? 'rolka' : it.local ? 'własny' : 'temat') + (it.status ? ' · ' + it.status : '') + (ck.length ? ' · ⚠ ' + ck.length : ''))));
    } L.append(box);
    L.append(h('div', { class: 'ph', style: { marginTop: '14px' } }, 'Materiał instruktażowy (karuzela / rolka)'), this.learnBox());
  },
  learnBox() {
    const b = P.cur.brand, ref = SYNC.ref, dna = b.dna, box = h('div', { class: 'sec' });
    box.append(h('div', { class: 'hint', html: rich('Wgraj gotową karuzelę (obrazy) albo rolkę (wideo). Aplikacja odczyta z niej tło (poświaty), kolory, pasek postępu, stopkę i bloki tekstu, a szablony przejmą ten styl. Domyślnie działa wzorzec poniżej, uczony z Twojej karuzeli z Instagrama.') }));
    if (ref) { const th = h('div', { class: 'thumbs' }); for (const s of ref.slides || []) th.append(h('div', { class: 'th', title: s.kind }, h('img', { src: s.img, alt: s.kind }))); box.append(h('div', { class: 'fine', style: { marginTop: '6px' } }, 'Wzorzec: ' + ref.name), th, h('div', { class: 'fine' }, 'Struktura: ' + ref.structure)); }
    if (dna) box.append(h('div', { class: 'hint', style: { marginTop: '6px' } }, 'Odczytany styl: ' + Learn.describe(dna) + (b.dnaUser ? ' (z Twojego materiału)' : '')));
    box.append(h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn', onclick: () => this.learnFrom(false) }, 'Wgraj obrazy karuzeli'), h('button', { class: 'btn', onclick: () => this.learnFrom(true) }, 'Wgraj wideo rolki')));
    if (b.dnaUser) box.append( h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sm', onclick: () => { delete b.dnaUser; applyAutoBrand(b); touch(); this.render(); toast('Wrócono do wzorca z automatu.', 'ok'); } }, 'Wróć do wzorca z automatu')));
    return box;
  },
  async learnFrom(video) {
    const fs = await pickFiles(video ? 'video/*' : 'image/jpeg,image/png,image/webp', !video); if (!fs.length) return; const pr = progressModal('Uczę się z materiału'); pr.set(0.3, 'analiza');
    try {
      const r = video ? await Learn.fromVideo(fs[0]) : await Learn.fromBlobs(fs.slice(0, 14)); pr.close();
      modal('Co odczytałem z materiału', h('div', {}, h('div', {}, Learn.describe(r.dna)), h('div', { class: 'fine', style: { margin: '6px 0' } }, 'Przypuszczalne rodzaje slajdów (zgrubnie): ' + r.kinds.join(' → ')), h('div', { class: 'fine' }, 'Tło bazowe: ' + (r.feats[0] ? r.feats[0].base : '?') + ' · pasek postępu: ' + (r.dna.progress ? 'tak' : 'nie') + ' · poświaty: ' + r.dna.glows.map((g) => `${g.c === 'v' ? 'fiolet' : 'pomarańcz'} (${g.x}, ${g.y})`).join(', ')), h('div', { class: 'hint', html: rich('„Użyj tego stylu” ustawia poświaty, pasek postępu i stopkę we wszystkich szablonach tego projektu. Kolory i fonty zostają z marki.') })),
        [{ t: 'Użyj tego stylu', cls: 'pri', fn: () => { const b = P.cur.brand; b.dnaUser = Object.assign({}, b.dna || {}, r.dna); b.dna = jclone(b.dnaUser); touch(); this.render(); Brand.refreshRight && Brand.refreshRight(); toast('Szablony używają teraz stylu z Twojego materiału.', 'ok'); } }, { t: 'Zamknij' }]);
    } catch (e) { pr.close(); toast('Nie udało się odczytać materiału: ' + errText(e), 'bad', 7000); }
  },
  addLocal() {
    const ta = h('textarea', { rows: 8, placeholder: 'Pierwsza linia = tytuł\nKolejne linie = punkty (opcjonalnie)\n\nnp.\n3 błędy w przysiadzie\nKolana do środka\nPięty odrywają się\nPlecy zaokrąglone' });
    modal('Własny pomysł', ta, [{ t: 'Dodaj', cls: 'pri', fn: () => { const ls = ta.value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean); if (!ls.length) return false; const it = { id: uid('i'), type: 'temat', title: ls[0], status: 'szkic' }; if (ls.length > 1) it.items = ls.slice(1); (P.cur.ideasLocal = P.cur.ideasLocal || []).push(it); touch(); this.selId = it.id; this.render(); } }, { t: 'Anuluj' }]);
  },
  renderMain() {
    const M = this.main; M.innerHTML = ''; const it = this.cur;
    if (!it) { M.append(h('h3', { style: { marginTop: 0 } }, 'Pomysły'), h('div', { class: 'hint', html: rich('Wybierz pomysł z listy. Aplikacja zaproponuje format (rolka albo karuzela), ułoży slajdy w stylu marki i ostrzeże, gdy temat powtarza się z tym, co już wyszło.') }), h('div', { class: 'hint' }, this.syncLine())); return; }
    const lvT = ((SYNC.ideas && SYNC.ideas.levels) || {})[it.level], ck = this.checks(it);
    M.append(h('h3', { style: { marginTop: 0 } }, it.title), h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' } }, it.status ? h('span', { class: 'tag off' }, it.status) : null, it.level ? h('span', { class: 'tag ' + ({ M: 'ok', U: 'warn', O: 'bad', H: 'bad' }[it.level] || 'off') }, 'dowody: ' + (lvT || it.level)) : null, it.doc ? h('a', { class: 'fine', target: '_blank', rel: 'noopener', href: 'https://docs.google.com/document/d/' + it.doc + '/edit' }, 'otwórz w Drive') : null));
    for (const c of ck) M.append(h('div', { class: 'warnrow ' + c.lv }, '⚠ ' + c.text + ' ', c.url ? h('a', { href: c.url, target: '_blank', rel: 'noopener' }, 'zobacz') : null));
    const hasCards = it.cards && it.cards.length, fmts = hasCards ? ['rolka', 'karuzela'] : ['karuzela', 'rolka'], strip = h('div', { class: 'strip' }), info = h('div', { class: 'hint' }), mode = { v: fmts[0] };
    const draw = () => { strip.innerHTML = ''; let pl; try { pl = this.plan(it, mode.v); } catch (e) { info.textContent = 'Plan nie powiódł się: ' + errText(e); return; } const reel = mode.v === 'rolka', items = reel ? pl.scenes : pl.slides, n = items.length; info.innerHTML = ''; info.append(h('div', {}, h('b', {}, (reel ? 'Rolka: ' : 'Karuzela: ')), pl.why)); if (n < 5 && !reel) info.append(h('div', { style: { color: 'var(--warn)' } }, 'Mało materiału (' + n + ' ' + plu(n, 'slajd', 'slajdy', 'slajdów') + '). „Rozwiń z AI” doda kroki, schemat i listy.'));
      items.forEach((c, i) => { try { const sc = makeScene(c.kind, Object.assign({}, c, { total: reel ? 0 : n, idx: reel ? null : i, num: c.num != null ? c.num : i }), reel ? 'story' : 'post45', i + (hash32(it.id) % 3)); strip.append(h('div', { class: 'card sm' }, thumb(sc, 0, reel ? 150 : 190), h('div', { class: 'cap' }, h('span', {}, (i + 1) + '. ' + (TPL_KINDS.find((k) => k[0] === c.kind) || [0, c.kind])[1])))); } catch (e) { console.warn(e); } }); };
    const seg = h('div', { class: 'seg', style: { margin: '10px 0' } }, fmts.map((f) => h('button', { class: f === mode.v ? 'on' : '', onclick: (e) => { mode.v = f; [...seg.children].forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); draw(); } }, f === 'rolka' ? 'Rolka (9:16)' : 'Karuzela (4:5)')));
    M.append(seg, info, strip, h('div', { class: 'row', style: { marginTop: '10px', flexWrap: 'wrap' } }, h('button', { class: 'btn pri', onclick: () => (mode.v === 'rolka' ? this.makeReel(it) : this.makeCarousel(it)) }, 'Utwórz w edytorze'), h('button', { class: 'btn', onclick: () => this.aiExpand(it) }, 'Rozwiń z AI (karuzela)'), h('button', { class: 'btn', onclick: () => { const p = this.plan(it, mode.v); navigator.clipboard.writeText((mode.v === 'rolka' ? p.scenes.map((s) => s.title + (s.text ? ' – ' + s.text : '')) : p.slides.map((s) => s.title || '')).join('\n')).then(() => toast('Skopiowano teksty.', 'ok')); } }, 'Kopiuj teksty')));
    draw();
    const sec = (t, ...k) => M.append(h('div', { class: 'ph', style: { marginTop: '14px' } }, t), h('div', { class: 'sec' }, ...k));
    if (it.hook) sec('Hook', h('div', {}, it.hook));
    if (it.spoken) sec('Mówione', ...it.spoken.map((s) => h('div', { style: { marginBottom: '4px' } }, s)));
    if (it.cards) sec('Tekst na ekranie', h('table', { class: 'qc' }, ...it.cards.map((c) => h('tr', {}, h('td', {}, Math.floor(c.t / 60) + ':' + String(c.t % 60).padStart(2, '0')), h('td', {}, c.text)))));
    if (it.shots) sec('Ujęcia', ...it.shots.map((s) => h('div', { class: 'fine' }, s)));
    if (it.variants) for (const v of it.variants) sec('Wariant: ' + v.label, h('div', {}, v.hook), h('div', { class: 'fine' }, (v.cards || []).join(' / ')));
    if (it.items) sec('Punkty', ...it.items.map((s) => h('div', {}, '• ' + s)));
    if (it.src || it.note) sec('Źródło i zastrzeżenia', it.src ? h('div', { class: 'fine' }, it.src) : null, it.note ? h('div', { class: 'fine' }, it.note) : null);
  },
};
