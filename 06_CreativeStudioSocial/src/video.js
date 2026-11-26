/* VIDEO STUDIO: rolki 9:16 — oś czasu (9 ścieżek), animacje, klatki kluczowe, podgląd z dźwiękiem, eksport MP4 (WebCodecs) */
const TRACKS = [['bg', 'Tło'], ['video', 'Wideo'], ['image', 'Obrazy'], ['text', 'Tekst'], ['graphic', 'Grafiki'], ['anim', 'Animacje'], ['voice', 'Głos'], ['music', 'Muzyka'], ['sfx', 'Efekty dźw.']];
const ATRK = ['voice', 'music', 'sfx'];
const newReel = (name) => { const F = FORMATS.story; return { id: uid('r'), name: name || 'Rolka', fmt: 'story', w: F.w, h: F.h, dur: 30, fps: 30, bg: { type: 'color', c1: '#000000' }, layers: [], audio: [], style: 'dynamic', meta: {} }; };

const Video = {
  built: false, selId: null, selKind: 'layer', t: 0, playing: false, zoom: 1, snap: true, loop: false, vids: new Map(), mc: null, ac: null, src: null, hist: null,
  get reel() { const p = P.cur; return p.reels.find((r) => r.id === p.curReel) || null; },
  get selLayer() { const r = this.reel; return r && this.selKind === 'layer' && this.selId ? r.layers.find((l) => l.id === this.selId) || null : null; },
  get selAudio() { const r = this.reel; return r && this.selKind === 'audio' && this.selId ? r.audio.find((a) => a.id === this.selId) || null : null; },
  setHist() { this.hist = new History(() => this.reel, (s) => { const i = P.cur.reels.findIndex((x) => x.id === s.id); if (i >= 0) P.cur.reels[i] = s; }); },

  build() {
    const root = $('#m-video'); root.innerHTML = '';
    this.left = h('div', { class: 'panel', id: 'v-left' }); this.right = h('div', { class: 'panel r', id: 'v-right' });
    this.bar = h('div', { class: 'tool' }); this.host = h('div', { class: 'stagehost vprev' });
    const center = h('div', { id: 'v-center' }, this.bar, this.host);
    this.tlBar = h('div', { class: 'tl-bar' }); this.names = h('div', { class: 'tl-names' }); this.inner = h('div', { class: 'tl-inner' }); this.scroll = h('div', { class: 'tl-scroll' }, this.inner);
    const tl = h('div', { id: 'v-tl' }, this.tlBar, h('div', { class: 'tl-wrap' }, this.names, this.scroll));
    root.append(this.left, center, this.right, tl); this.built = true;
    this.scroll.addEventListener('scroll', () => { this.names.scrollTop = this.scroll.scrollTop; });
    this.names.addEventListener('wheel', (e) => { this.scroll.scrollTop += e.deltaY; });
    this.stage = new Stage(this.host, {
      scene: () => this.reel, sel: () => this.selLayer, select: (id) => { this.select('layer', id); }, visible: (l, t) => l.track !== 'bg' && t >= l.t0 - 1e-6 && t <= l.t1 + 1e-6,
      change: (k) => (k === 'commit' ? this.commit() : this.panelsLive()), draw: () => ({ video: (l) => { const v = this.vids.get(l.id); return v ? v.el : null; } }),
      onEdit: () => { const t = $('textarea[data-k="text.s"]', this.right); if (t) { t.focus(); t.select(); } }, key: (e) => this.onKey(e),
    });
    this.buildBar(); this.buildTlBar();
    window.addEventListener('keydown', (e) => { if (S.tab !== 'video' || e.target.closest('input,textarea,select,.modal')) return; this.onKey(e); });
  },
  buildBar() {
    const b = (t, fn, cls, title) => h('button', { class: 'btn ' + (cls || ''), onclick: fn, title: title || '' }, t);
    this.playBtn = b('▶ Odtwarzaj', () => this.toggle(), 'pri', 'Spacja'); this.timeEl = h('span', { class: 'time', style: { fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--acc)', minWidth: '120px' } });
    this.loopBtn = b('⟲ Pętla', () => { this.loop = !this.loop; this.loopBtn.classList.toggle('on', this.loop); }, '', 'Zapętl odtwarzanie');
    this.safeBtn = b('Strefy', () => { this.stage.safe = !this.stage.safe; this.safeBtn.classList.toggle('on', this.stage.safe); this.stage.overlay(); }, '', 'Pokaż strefy zasłaniane przez interfejs aplikacji');
    this.bar.append(b('⏮', () => this.seek(0), '', 'Na początek (Home)'), this.playBtn, this.timeEl, this.loopBtn, this.safeBtn, h('span', { style: { flex: 1 } }),
      b('Eksport ▾', (e) => popMenu(e.currentTarget, [{ t: 'Eksportuj MP4 (IG / YouTube / TikTok / Facebook)…', i: '🎬', fn: () => this.exportDialog() }, { t: 'Bieżąca klatka jako okładka publikacji', i: '📌', fn: () => this.frameAsCover() }, { t: 'Bieżąca klatka (PNG)', i: '🖼', fn: () => this.framePng() }, '-', { t: 'Miks audio (WAV) tej rolki', i: '🎧', fn: () => this.exportMixWav() }]), 'pri'));
  },
  buildTlBar() {
    const b = (t, fn, title, cls) => h('button', { class: 'btn sm ' + (cls || ''), onclick: fn, title: title || '' }, t);
    this.snapBtn = b('Przyciąganie', () => { this.snap = !this.snap; this.snapBtn.classList.toggle('on', this.snap); }, 'Przyciągaj krawędzie klipów do kursora i innych klipów', 'on');
    this.tlBar.append(b('－', () => this.setZoom(this.zoom / 1.4), 'Oddal oś czasu'), b('＋', () => this.setZoom(this.zoom * 1.4), 'Przybliż oś czasu'), b('Dopasuj', () => this.setZoom(1), 'Cała rolka w widoku'), this.snapBtn,
      h('span', { class: 'sep', style: { width: '1px', height: '20px', background: 'var(--bd)' } }), b('✂ Przetnij (S)', () => this.split(), 'Przetnij zaznaczony klip w miejscu kursora'), b('⧉ Duplikuj', () => this.dupSel(), 'Duplikuj zaznaczony klip (Ctrl+D)'), b('🗑 Usuń', () => this.delSel(), 'Usuń zaznaczony klip (Delete)', 'bad'),
      h('span', { style: { flex: 1 } }), h('span', { class: 'fine' }, 'Przeciągnij klip = przesuń, krawędź = przytnij, linijka = przewijanie'));
  },
  show() {
    if (!this.built) this.build(); const p = P.cur;
    if (!this.reel) { if (p.reels.length) p.curReel = p.reels[0].id; else { const r = newReel('Rolka 1'); p.reels.push(r); p.curReel = r.id; touch(); } }
    this.setHist(); this.t = Math.min(this.t, this.reel.dur); this.selId = null; this.panels(); requestAnimationFrame(() => { this.stage.fit(); this.fitBase(); this.tl(); }); this.ensureVideos().then(() => this.stage.render(this.t));
  },
  hide() { this.pause(); },

  // ── Panele ──
  panels() { this.leftPanel(); this.rightPanel(); this.updTime(); },
  panelsLive() { const l = this.selLayer; if (!l) return; for (const k of ['x', 'y', 'w', 'h', 'rot']) { const i = $(`input[data-pk="${k}"]`, this.right); if (i && document.activeElement !== i) i.value = rnd(l[k], 1); } },
  leftPanel() {
    const L = this.left, p = P.cur, r = this.reel; L.innerHTML = '';
    const sel = h('select', { 'aria-label': 'Rolka', onchange: (e) => { this.pause(); p.curReel = e.target.value; this.t = 0; this.selId = null; this.setHist(); this.mc = null; this.panels(); this.fitBase(); this.tl(); this.stage.fit(); this.ensureVideos(); touch(); } }, p.reels.map((x) => h('option', { value: x.id, selected: x.id === p.curReel }, x.name)));
    L.append(h('div', { class: 'ph' }, 'Rolka'), h('div', { class: 'sec' }, sel, h('div', { class: 'row', style: { marginTop: '6px' } },
      h('button', { class: 'btn sm', onclick: () => { const n = newReel('Rolka ' + (p.reels.length + 1)); p.reels.push(n); p.curReel = n.id; touch(); this.show(); } }, '＋ Nowa'),
      h('button', { class: 'btn sm', onclick: () => { const c = jclone(r); c.id = uid('r'); c.name = r.name + ' (wariant)'; c.layers.forEach((l) => { l.id = uid('l'); }); c.audio.forEach((a) => { a.id = uid('au'); }); p.reels.push(c); p.curReel = c.id; touch(); this.show(); toast('Utworzono wariant rolki', 'ok'); } }, 'Duplikuj'),
      h('button', { class: 'btn sm', onclick: (e) => popMenu(e.currentTarget, [{ t: 'Zmień nazwę…', i: '✎', fn: () => { const n = prompt('Nazwa:', r.name); if (n) { r.name = n; touch(); this.leftPanel(); } } }, { t: 'Usuń rolkę', i: '🗑', fn: () => { if (!confirm('Usunąć „' + r.name + '”?')) return; p.reels = p.reels.filter((x) => x !== r); p.curReel = p.reels[0] ? p.reels[0].id : null; touch(); this.show(); } }]) }, '⋯')),
      h('div', { class: 'fine', style: { marginTop: '6px' } }, 'Format 9:16 (1080×1920), ' + r.fps + ' fps, ' + fmtTime(r.dur))));
    L.append(h('div', { class: 'ph' }, 'Import rolki'), h('div', { class: 'sec' }, h('button', { class: 'btn', style: { width: '100%' }, title: 'Skrypt rolki z dokumentu „Rolki” (projekt Agent John): tekst na ekranie z czasami, skrypt lektora, opis', onclick: () => Rolka.dialog() }, '📥 Rolka z dokumentu (Agent John)')));
    L.append(h('div', { class: 'ph' }, 'Dodaj na oś czasu'), h('div', { class: 'sec' }, h('div', { class: 'row' },
      h('button', { class: 'btn', onclick: (e) => popMenu(e.currentTarget, TPL_KINDS.map(([k, n]) => ({ t: n, i: '＋', fn: () => this.addScene(k) }))) }, '＋ Scena z szablonu'),
      h('button', { class: 'btn', onclick: () => this.addLayer('text') }, 'T Tekst')), h('div', { class: 'row', style: { marginTop: '6px' } },
      h('button', { class: 'btn', onclick: (e) => popMenu(e.currentTarget, [{ t: 'Prostokąt', i: '▭', fn: () => this.addLayer('shape', 'rect') }, { t: 'Elipsa', i: '◯', fn: () => this.addLayer('shape', 'ellipse') }, { t: 'Pasek', i: '▬', fn: () => this.addLayer('shape', 'line') }]) }, '▭ Kształt'),
      h('button', { class: 'btn', onclick: (e) => popMenu(e.currentTarget, [{ t: 'Obraz z komputera…', i: '🖼', fn: () => this.addMedia('image', false) }, { t: 'Obraz: biblioteka / Drive / link…', i: '🗂', fn: () => this.addMedia('image', true) }, { t: 'Wideo z komputera…', i: '🎬', fn: () => this.addMedia('video', false) }, { t: 'Wideo: biblioteka / Drive / link…', i: '🗂', fn: () => this.addMedia('video', true) }]) }, '🖼 Obraz / wideo')),
      h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn pri', title: 'Wideo z Twoją twarzą w kole lub prostokącie (z dźwiękiem)', onclick: (e) => popMenu(e.currentTarget, [{ t: 'Importuj: biblioteka / Drive / link…', i: '🗂', fn: () => this.addMedia('video', true, { pip: true }) }, { t: 'Plik z komputera / telefonu…', i: '📁', fn: () => this.addMedia('video', false, { pip: true }) }]) }, '🗣 Gadająca głowa')),
      h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn', onclick: (e) => popMenu(e.currentTarget, [['agrad', 'Płynący gradient'], ['orbs', 'Rozmyte kule'], ['particles', 'Cząsteczki'], ['confetti', 'Konfetti'], ['stripes', 'Pasy'], ['bar', 'Pasek postępu']].map(([k, n]) => ({ t: n, i: '✦', fn: () => this.addLayer('fx', k) }))) }, '✦ Animowane tło'),
        h('button', { class: 'btn', onclick: (e) => popMenu(e.currentTarget, [{ t: 'Głos / lektor…', i: '🎙', fn: () => this.addAudio('voice') }, { t: 'Muzyka…', i: '🎵', fn: () => this.addAudio('music') }, { t: 'Efekt dźwiękowy…', i: '🔔', fn: () => this.addAudio('sfx') }]) }, '🎧 Dźwięk')),
      h('div', { class: 'hint', style: { marginTop: '8px' }, html: rich('Klip trafia w miejsce kursora (czerwona linia). (Nagrywanie i obróbka głosu: zakładka Audio.)') })));
    L.append(h('div', { class: 'ph' }, 'Napisy'), h('div', { class: 'sec' }, h('button', { class: 'btn', style: { width: '100%' }, onclick: () => this.subtitlesDialog() }, 'Napisy z nagrania głosu (Whisper)'), h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('Rozpoznaje mowę z klipów na ścieżce „Głos” i układa napisy w bezpiecznej strefie. (Wymaga działania Workera AI.)') })));
    const m = r.meta || {}; if (m.concept || m.hook) L.append(h('div', { class: 'ph' }, m.source || 'Z asystenta'), h('div', { class: 'sec hint', html: rich((m.hook ? '„' + m.hook + '” ' : '') + (m.concept ? m.concept : '')) + (m.music ? '<br>' + rich('Muzyka: ' + m.music) : '') + (m.shots ? '<br>' + rich('Ujęcia: ' + m.shots) : '') + (m.how ? '<br>' + rich('Jak mówić: ' + m.how) : '') + (m.caution ? '<br>' + rich('Zastrzeżenia: ' + m.caution) : '') }));
  },
  rightPanel() {
    const R = this.right, r = this.reel; R.innerHTML = ''; if (!r) return; const cb = (k) => { this.stage.render(); if (k === 'commit') this.commit(); };
    const a = this.selAudio, l = this.selLayer;
    if (a) {
      const cbA = (k) => { if (k === 'commit') this.commit(true); };
      R.append(h('div', { class: 'ph' }, 'Klip dźwięku: ' + ({ voice: 'głos', music: 'muzyka', sfx: 'efekt' }[a.track])), h('div', { class: 'sec' }, fld({ k: 'name', t: 'text', label: 'Nazwa' }, a, cbA), rowOf(fld({ k: 't0', t: 'num', label: 'Start (s)', min: 0, step: 0.05 }, a, cbA), fld({ k: 'dur', t: 'num', label: 'Długość (s)', min: 0.1, step: 0.05 }, a, cbA)), fld({ k: 'in', t: 'num', label: 'Początek w nagraniu (s)', min: 0, step: 0.05 }, a, cbA),
        fld({ k: 'gain', t: 'range', label: 'Głośność klipu', min: -30, max: 12, step: 0.5, unit: ' dB' }, a, cbA), rowOf(fld({ k: 'fi', t: 'num', label: 'Fade-in (s)', min: 0, step: 0.05 }, a, cbA), fld({ k: 'fo', t: 'num', label: 'Fade-out (s)', min: 0, step: 0.05 }, a, cbA)),
        a.track !== 'voice' ? fld({ k: 'loop', t: 'chk', label: 'Zapętl do końca klipu' }, a, cbA) : null, a.track === 'music' ? fld({ k: 'duck', t: 'chk', label: 'Ścisz pod głosem (ducking)' }, a, cbA) : null,
        h('div', { class: 'hint', html: rich('Poziom końcowy ustawia normalizacja do (' + P.cur.mix.target + ' LUFS), a ducking: (−' + P.cur.mix.duckDepth + ' dB). Zmienisz je w ustawieniach rolki.') })));
      return;
    }
    if (l) {
      const dur = Math.max(0.1, Math.min(l.t1, r.dur) - l.t0);
      R.append(h('div', { class: 'ph' }, 'Warstwa', h('span', {}, ...[['⬆', 'Wyżej', 1], ['⬇', 'Niżej', -1]].map(([t, ti, d]) => h('button', { class: 'btn sm', title: ti, onclick: () => this.z(d) }, t)))), h('div', { class: 'sec' }, fld({ k: 'name', t: 'text', label: 'Nazwa' }, l, cb), rowOf(fld({ k: 't0', t: 'num', label: 'Początek (s)', min: 0, step: 0.1 }, l, cb), fld({ k: 't1', t: 'num', label: 'Koniec (s)', min: 0.1, step: 0.1 }, l, cb)), h('div', { class: 'row' }, fld({ k: 'lock', t: 'chk', label: 'Zablokuj' }, l, cb), fld({ k: 'hide', t: 'chk', label: 'Ukryj' }, l, cb))));
      R.append(...layerFields(l, cb));
      const an = (key, title, withDir) => [h('div', { class: 'ph' }, title), h('div', { class: 'sec' }, fld({ k: `anim.${key}.p`, t: 'sel', label: 'Rodzaj', opts: ANIMS }, l, cb), rowOf(fld({ k: `anim.${key}.d`, t: 'num', label: 'Czas (s)', min: 0.05, step: 0.05 }, l, cb), fld({ k: `anim.${key}.dl`, t: 'num', label: 'Opóźnienie (s)', min: 0, step: 0.05 }, l, cb)), fld({ k: `anim.${key}.e`, t: 'sel', label: 'Przyspieszenie (easing)', opts: EASES }, l, cb), fld({ k: `anim.${key}.dir`, t: 'sel', label: 'Kierunek', opts: DIRS }, l, cb))];
      R.append(...an('in', 'Animacja wejścia'), ...an('out', 'Animacja wyjścia'));
      R.append(h('div', { class: 'ph' }, 'Animacja ciągła'), h('div', { class: 'sec' }, fld({ k: 'anim.loop.p', t: 'sel', label: 'Rodzaj', opts: LOOPS }, l, cb), rowOf(fld({ k: 'anim.loop.amp', t: 'num', label: 'Siła', step: 0.1, min: 0 }, l, cb), fld({ k: 'anim.loop.spd', t: 'num', label: 'Tempo', step: 0.1, min: 0.1 }, l, cb))),
        h('div', { class: 'ph' }, 'Gotowe style animacji'), h('div', { class: 'sec' }, h('div', { class: 'row' }, [['calm', 'Spokojny'], ['dynamic', 'Dynamiczny'], ['punchy', 'Mocny']].map(([k, n]) => h('button', { class: 'btn sm', onclick: () => { animateLayers([l], k, dur); this.commit(); this.panels(); this.stage.render(); } }, n)))));
      // klatki kluczowe
      const kfs = h('div', { class: 'zebra' }); (l.kf || []).forEach((k, i) => kfs.append(h('div', { style: { padding: '6px 8px' } }, rowOf(fld({ k: 't', t: 'num', label: 't (s od startu)', step: 0.1, min: 0 }, k, cb), fld({ k: 'x', t: 'num', label: 'X' }, k, cb), fld({ k: 'y', t: 'num', label: 'Y' }, k, cb)), rowOf(fld({ k: 's', t: 'num', label: 'Skala ×', step: 0.05 }, k, cb), fld({ k: 'r', t: 'num', label: 'Obrót °' }, k, cb), fld({ k: 'o', t: 'num', label: 'Kryjące ×', step: 0.05, min: 0, max: 1 }, k, cb)), rowOf(fld({ k: 'e', t: 'sel', label: 'Easing do następnej', opts: EASES }, k, cb), h('button', { class: 'btn sm bad fix', title: 'Usuń klatkę', onclick: () => { l.kf.splice(i, 1); this.commit(); this.panels(); this.stage.render(); } }, '🗑')))));
      R.append(h('div', { class: 'ph' }, 'Klatki kluczowe', h('button', { class: 'btn sm', title: 'Dodaje klatkę w miejscu kursora', onclick: () => { const lt = clamp(this.t - l.t0, 0, Math.max(0, l.t1 - l.t0)); (l.kf = l.kf || []).push({ t: rnd(lt, 2), x: l.x, y: l.y, s: 1, r: 0, o: 1, e: 'inOutCubic' }); l.kf.sort((p, q) => p.t - q.t); this.commit(); this.panels(); this.stage.render(); } }, '＋ w kursorze')), (l.kf || []).length ? kfs : h('div', { class: 'sec hint', html: rich('Brak. Klatki kluczowe nadpisują położenie X/Y z panelu „Pozycja” (wartości pośrednie są interpolowane).') }));
      return;
    }
    // ustawienia rolki
    const m = P.cur.mix, cbR = (k) => { if (k === 'commit') { this.commit(true); this.fitBase(); this.tl(); } };
    R.append(h('div', { class: 'ph' }, 'Ustawienia rolki'), h('div', { class: 'sec' }, fld({ k: 'name', t: 'text', label: 'Nazwa' }, r, cbR), fld({ k: 'dur', t: 'num', label: 'Długość rolki (s)', min: 1, max: 600, step: 1 }, r, cbR), fld({ k: 'bg.c1', t: 'color', label: 'Kolor tła (pod warstwami)' }, r, (k) => { this.stage.render(); if (k === 'commit') this.commit(); }), fld({ k: 'style', t: 'sel', label: 'Styl animacji scen z szablonu', opts: [['calm', 'Spokojny'], ['dynamic', 'Dynamiczny'], ['punchy', 'Mocny']] }, r, cbR)),
      h('div', { class: 'ph' }, 'Miks i głośność (wspólne z Audio)'), h('div', { class: 'sec' }, fld({ k: 'target', t: 'num', label: 'Docelowa głośność (LUFS)', min: -24, max: -8, step: 0.5 }, m, cbR), fld({ k: 'tp', t: 'num', label: 'Maks. true peak (dBTP)', min: -3, max: 0, step: 0.1 }, m, cbR), fld({ k: 'duckDepth', t: 'num', label: 'Ducking: ściszenie muzyki (dB)', min: 0, max: 24, step: 1 }, m, cbR), fld({ k: 'musicDb', t: 'num', label: 'Domyślna głośność nowej muzyki (dB)', min: -30, max: 0, step: 1 }, m, cbR)),
      h('div', { class: 'ph' }, 'Limity długości'), h('div', { class: 'sec' }, ...[['Instagram Reels', 90], ['YouTube Shorts', 180], ['TikTok', 600], ['Facebook Reels', 90]].map(([n, mx]) => h('div', { class: 'row', style: { margin: '3px 0' } }, h('span', {}, n), h('span', { class: 'tag fix ' + (r.dur <= mx ? 'ok' : 'warn') }, 'do ' + mx + ' s' + (r.dur <= mx ? ' ✔' : ' ▲')))), h('div', { class: 'hint', html: rich('Bezpieczny wspólny profil: (≤ 90 s, 1080×1920, 30 fps, MP4 H.264 + AAC).') })));
  },

  // ── Zaznaczanie / commit ──
  select(kind, id) { this.selKind = kind; this.selId = id; this.panels(); this.stage.render(); this.tlMarks(); },
  commit(audio) { this.syncVideoAudio(); if (this.hist) this.hist.mark(); if (audio) this.mc = null; touch(); this.tl(); this.rightPanelSoft(); this.stage.render(); },
  rightPanelSoft() { const a = document.activeElement; if (a && this.right.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return; this.rightPanel(); },
  undo() { if (this.hist && this.hist.undo()) { this.selId = null; this.mc = null; this.panels(); this.tl(); this.stage.render(); touch(); } },
  redo() { if (this.hist && this.hist.redo()) { this.selId = null; this.mc = null; this.panels(); this.tl(); this.stage.render(); touch(); } },
  ensureDur(t) { const r = this.reel; if (t > r.dur) { r.dur = Math.ceil(t); this.fitBase(); } },

  // ── Dodawanie ──
  nextStart() { const r = this.reel; const ends = r.layers.filter((l) => l.track === 'bg' && l.t1 < 1e5).map((l) => l.t1); return ends.length ? Math.max(...ends) : 0; },
  addScene(kind, c, dur, noRender) {
    const r = this.reel, t0 = noRender ? c.__t0 : this.nextStart(); dur = dur || 4; const bgN = r.layers.filter((l) => l.track === 'bg').length;
    const ls = sceneToReel(kind, Object.assign({}, c || TPL_SAMPLE[kind], { handle: P.cur.brand.handle }), t0, dur, r.style, r.layers.length); let k = bgN;
    for (const l of ls) { if (l.track === 'bg') r.layers.splice(k++, 0, l); else r.layers.push(l); }
    this.ensureDur(t0 + dur); if (!noRender) { this.afterAdd(ls[ls.length - 1]); this.seek(t0 + 0.01); }
  },
  addLayer(type, kind) {
    const r = this.reel, t0 = Math.min(this.t, Math.max(0, r.dur - 1)), l = mkLayer(type, { x: r.w / 2, y: r.h / 2 }); l.t0 = t0; l.t1 = t0 + 4;
    if (type === 'text') { l.w = r.w * 0.8; l.text.size = 84; l.text.color = '#ffffff'; l.text.font = P.cur.brand.headingFont; l.text.stroke.w = 0; l.text.shadow.on = true; }
    if (type === 'shape') { l.shape.kind = kind; l.shape.fill = P.cur.brand.colors.accent; l.w = kind === 'line' ? r.w * 0.5 : 360; l.h = kind === 'line' ? 14 : 360; }
    if (type === 'fx') { l.fx.kind = kind; l.w = r.w; l.h = r.h; Object.assign(l.fx, { c1: P.cur.brand.colors.accent, c2: P.cur.brand.colors.primary, c3: mix(P.cur.brand.colors.accent, '#ffffff', 0.4) }); if (kind === 'bar') { l.w = r.w * 0.7; l.h = 18; l.y = r.h - SAFE.bottom + 30; } l.t0 = 0; l.t1 = r.dur; l.track = 'anim'; }
    animateLayers([l], r.style, 4); this.ensureDur(l.t1); r.layers.push(l); this.afterAdd(l);
  },
  async addMedia(kind, lib, opt) {
    opt = opt || {}; let id, tt; try {
      if (lib) { const a = await assetPicker(kind === 'image' ? ['image', 'ai', 'logo'] : ['video'], 'Importuj ' + (kind === 'image' ? 'obraz' : 'wideo')); if (!a) return; id = a.id; }
      else { const fs = await pickFiles(kind === 'image' ? 'image/*' : 'video/*,.mov,.mp4,.m4v,.webm,.mkv,.3gp', false); if (!fs[0]) return; tt = toast('Wczytuję „' + fs[0].name + '” (' + fmtSize(fs[0].size) + ')…', 'info', 120000); id = await Assets.add(fs[0], kind); }
      const rec = await Assets.rec(id); if (rec.err) throw new Error(rec.err); const r = this.reel, ar = (rec.w || 9) / (rec.h || 16), t0 = Math.min(this.t, Math.max(0, r.dur - 1));
      const l = mkLayer(kind, { x: r.w / 2, y: r.h / 2 }); l.t0 = t0; l.name = rec.name.slice(0, 22);
      if (kind === 'image') { l.w = Math.min(r.w * 0.9, rec.w || 800); l.h = l.w / ar; l.img.assetId = id; IMGS.set(id, await Assets.img(id)); l.t1 = t0 + 4; r.layers.push(l); }
      else {
        l.w = r.w; l.h = r.h; l.video.assetId = id; l.video.fit = 'cover'; l.t1 = t0 + Math.min(rec.dur || 5, 120); l.name = (opt.pip ? 'Gadająca głowa: ' : 'Wideo: ') + l.name;
        const bgN = r.layers.filter((x) => x.track === 'bg').length; r.layers.splice(bgN, 0, l); // wideo pod tekstami i grafikami (nad tłem)
        if (opt.pip) { Object.assign(l.video, { shape: 'circle', bw: 8, bc: P.cur.brand.colors.accent, glow: 28 }); this.applyPip(l, { shape: 'circle', size: 'm', pos: 'bc' }); }
      }
      this.ensureDur(l.t1); animateLayers([l], r.style, l.t1 - l.t0); if (kind === 'video') { l.anim.in = opt.pip ? { p: 'zoom', d: 0.5, dl: 0, e: 'outBack', dir: 'bottom' } : { p: 'none', d: 0.6, dl: 0, e: 'outCubic', dir: 'bottom' }; l.anim.out.p = 'none'; }
      await this.ensureVideos(); let audio = false; if (kind === 'video') audio = await this.attachVideoAudio(l);
      if (tt) tt.remove(); this.afterAdd(l); if (kind === 'video') toast(audio ? 'Dodano wideo z dźwiękiem (ścieżka „Głos”).' : 'Dodano wideo. Brak odczytywalnego dźwięku w pliku.', audio ? 'ok' : 'warn', 5000);
    } catch (e) { if (tt) tt.remove(); toast('Nie udało się dodać pliku: ' + errText(e), 'bad', 12000); }
  },
  // Gadająca głowa: kształt (koło / zaokrąglony / prostokąt / pełny ekran), rozmiar i miejsce w bezpiecznej strefie
  applyPip(l, o) {
    const r = this.reel, c = l.video, W = r.w, H = r.h; o = o || {}; if (o.shape) c.shape = o.shape; if (o.size) c.size = o.size; if (o.pos) c.pos = o.pos;
    const shape = c.shape || 'rect', size = c.size || 'm', pos = c.pos || 'bc';
    if (shape === 'full') { l.w = W; l.h = H; l.x = W / 2; l.y = H / 2; c.r = 0; return; }
    const f = { s: 0.3, m: 0.46, l: 0.7, xl: 0.94 }[size] || 0.46, room = W - SAFE.left - SAFE.right, w = Math.min(Math.round(W * f), room), h = shape === 'circle' ? w : Math.round(w * 1.25);
    l.w = w; l.h = h; if (shape === 'round') c.r = Math.round(w * 0.09); else if (shape === 'rect') c.r = 0;
    const px = pos[1] === 'l' ? SAFE.left + w / 2 : pos[1] === 'r' ? W - SAFE.right - w / 2 : (SAFE.left + W - SAFE.right) / 2, py = pos[0] === 't' ? SAFE.top + h / 2 : pos[0] === 'm' ? H / 2 : H - SAFE.bottom - h / 2;
    l.x = Math.round(px); l.y = Math.round(py);
  },
  // Dźwięk z pliku wideo → klip na ścieżce „Głos” powiązany z warstwą (przesuwa się i przycina razem z nią)
  async attachVideoAudio(l) {
    const r = this.reel, id = l.video.assetId; if (!id) return false; let A = null; try { A = await Assets.audio(id); } catch (e) { A = null; }
    if (!A || !A.chs || !A.chs[0] || A.chs[0].length < 2000) return false;
    const it = { id: uid('au'), track: 'voice', assetId: id, name: 'Dźwięk: ' + l.name.replace(/^(Wideo|Gadająca głowa): /, '').slice(0, 22), t0: l.t0, in: l.video.in || 0, dur: Math.max(0.1, Math.min(l.t1, r.dur) - l.t0), srcDur: A.chs[0].length / A.fs, gain: 0, fi: 0.01, fo: 0.03, loop: false, duck: false, link: l.id };
    it.lk = this.lkSig(l); r.audio.push(it); this.mc = null; return true;
  },
  lkSig(l) { const c = l.video; return JSON.stringify([l.t0, Math.min(l.t1, this.reel.dur), c.in || 0, c.speed || 1, !!c.mute, c.vol || 0, !!l.hide]); },
  syncVideoAudio() {
    const r = this.reel; if (!r || !r.audio) return; r.audio = r.audio.filter((a) => {
      if (!a.link) return true; const l = r.layers.find((x) => x.id === a.link); if (!l) return false; const sig = this.lkSig(l); if (a.lk === sig) return true; const c = l.video, sp = c.speed || 1;
      a.t0 = l.t0; a.in = c.in || 0; a.dur = Math.max(0.1, Math.min(l.t1, r.dur) - l.t0); a.gain = (Math.abs(sp - 1) > 0.01 || c.mute || l.hide) ? -90 : (c.vol || 0); a.lk = sig; this.mc = null; return true;
    });
  },
  async addAudio(track) {
    try {
      const src = await new Promise((res) => { modal('Skąd wziąć dźwięk?', h('div', {}, [['takes', '🎙 Nagrania z Audio Studio'], ['lib', '🗂 Biblioteka / Drive / link'], ['file', '📁 Plik z komputera (MP3, WAV, M4A…)']].map(([k, n]) => h('button', { class: 'btn', style: { display: 'block', width: '100%', margin: '6px 0', textAlign: 'left' }, onclick: (e) => { res(k); e.target.closest('.modal-back').remove(); } }, n))), [{ t: 'Anuluj', fn: () => { res(null); } }]); });
      if (!src) return; let id, name;
      if (src === 'file') { const fs = await pickFiles('audio/*', false); if (!fs[0]) return; id = await Assets.add(fs[0], 'audio'); name = fs[0].name; }
      else if (src === 'lib') { const a = await assetPicker(['audio', 'voice', 'music', 'sfx'], 'Importuj dźwięk'); if (!a) return; id = a.id; name = a.name; }
      else { const tk = (P.cur.audio.takes || []); if (!tk.length) { toast('Brak nagrań w Audio Studio. Nagraj lub wgraj głos w zakładce Audio.', 'warn'); return; } const pick = await new Promise((res) => { const m = modal('Nagrania z Audio Studio', h('div', { class: 'zebra' }, tk.map((x) => h('div', { class: 'take', onclick: () => { res(x); m.close(); } }, h('span', {}, x.name), h('span', { class: 'fine' }, fmtTime(x.dur))))), [{ t: 'Anuluj', fn: () => res(null) }]); }); if (!pick) return; id = pick.assetId; name = pick.name; }
      const rec = await Assets.rec(id); if (!rec || !rec.dur) throw new Error('Nie udało się odczytać dźwięku' + (rec && rec.err ? ': ' + rec.err : '')); const r = this.reel, m = P.cur.mix, t0 = Math.min(this.t, Math.max(0, r.dur - 0.5));
      const it = { id: uid('au'), track, assetId: id, name: String(name).replace(/\.[a-z0-9]+$/i, '').slice(0, 30), t0, in: 0, dur: track === 'music' ? Math.max(1, r.dur - t0) : Math.min(rec.dur, Math.max(0.5, r.dur - t0)), srcDur: rec.dur, gain: track === 'music' ? m.musicDb + 0 : track === 'sfx' ? -6 : 0, fi: track === 'music' ? 1 : 0.01, fo: track === 'music' ? 1.5 : 0.03, loop: track === 'music', duck: track === 'music' };
      if (track !== 'music' && t0 + rec.dur > r.dur) this.ensureDur(t0 + rec.dur); r.audio.push(it); this.mc = null; this.commit(true); this.select('audio', it.id); toast('Dodano dźwięk na ścieżkę „' + TRACKS.find((x) => x[0] === track)[1] + '”', 'ok');
    } catch (e) { toast('Nie udało się dodać dźwięku: ' + errText(e), 'bad', 7000); }
  },
  afterAdd(l) { this.commit(); if (l) { this.select('layer', l.id); } this.stage.render(); },
  async fromPlan(plan, opts) { // plan z asystenta → rolka
    const r = newReel((plan.concept || 'Rolka').slice(0, 30)); r.style = opts.style || 'dynamic'; r.meta = { concept: plan.concept, hook: plan.hook, music: plan.music, cta: plan.cta, caption: plan.caption, hashtags: plan.hashtags };
    P.cur.reels.push(r); P.cur.curReel = r.id; let t = 0; const script = [];
    for (const [i, s] of (plan.scenes || []).entries()) { const d = clamp(+s.dur || 4, 2, 15), kind = TPL_KINDS.some((k) => k[0] === s.kind) ? s.kind : (i === 0 ? 'cover' : 'point'); this.addScene(kind, Object.assign({}, s, { __t0: t, idx: i, total: plan.scenes.length, num: s.num != null ? s.num : i }), d, true); if (s.voice) script.push(s.voice); t += d; }
    r.dur = Math.ceil(t) || 30; P.cur.audio.script = script.join('\n\n'); if (plan.caption) P.cur.publish.caption = plan.caption; if (plan.hashtags) P.cur.publish.hashtags = [].concat(plan.hashtags).map((x) => '#' + String(x).replace(/^#/, '')).join(' ');
    touch(); return r;
  },

  // ── Edycja klipów ──
  allClips() { const r = this.reel; return [...r.layers.map((l) => ({ it: l, kind: 'layer', t0: l.t0, t1: Math.min(l.t1, r.dur) })), ...r.audio.map((a) => ({ it: a, kind: 'audio', t0: a.t0, t1: a.t0 + a.dur }))]; },
  curClip() { const l = this.selLayer, a = this.selAudio; return l ? { it: l, kind: 'layer' } : a ? { it: a, kind: 'audio' } : null; },
  split() {
    const c = this.curClip(), t = this.t, r = this.reel; if (!c) { toast('Zaznacz klip do przecięcia.', 'warn'); return; } const it = c.it;
    if (c.kind === 'layer') { if (t <= it.t0 + 0.05 || t >= Math.min(it.t1, r.dur) - 0.05) { toast('Ustaw kursor wewnątrz klipu.', 'warn'); return; } const b = jclone(it); b.id = uid('l'); b.t0 = t; it.t1 = t; it.anim.out = { p: 'none', d: 0.4, dl: 0, e: 'inCubic', dir: 'bottom' }; b.anim.in = { p: 'none', d: 0.6, dl: 0, e: 'outCubic', dir: 'bottom' }; b.kf = (b.kf || []).map((k) => Object.assign({}, k, { t: Math.max(0, k.t - (t - it.t0)) })); if (b.type === 'video') b.video.in += (t - it.t0) * (b.video.speed || 1); r.layers.splice(r.layers.indexOf(it) + 1, 0, b); this.commit(); this.select('layer', b.id); }
    else { if (t <= it.t0 + 0.05 || t >= it.t0 + it.dur - 0.05) { toast('Ustaw kursor wewnątrz klipu.', 'warn'); return; } const b = jclone(it); b.id = uid('au'); b.t0 = t; b.in = it.in + (t - it.t0); b.dur = it.t0 + it.dur - t; it.dur = t - it.t0; b.fi = 0.01; it.fo = 0.01; r.audio.push(b); this.commit(true); this.select('audio', b.id); }
  },
  dupSel() { const c = this.curClip(), r = this.reel; if (!c) return; if (c.kind === 'layer') { const b = jclone(c.it); b.id = uid('l'); const d = Math.min(c.it.t1, r.dur) - c.it.t0; b.t0 = c.it.t0 + d; b.t1 = b.t0 + d; this.ensureDur(b.t1); r.layers.push(b); this.commit(); this.select('layer', b.id); } else { const b = jclone(c.it); b.id = uid('au'); b.t0 = c.it.t0 + c.it.dur; this.ensureDur(b.t0 + b.dur); r.audio.push(b); this.commit(true); this.select('audio', b.id); } },
  delSel() { const c = this.curClip(), r = this.reel; if (!c) return; if (c.kind === 'layer') r.layers = r.layers.filter((l) => l !== c.it); else r.audio = r.audio.filter((a) => a !== c.it); this.selId = null; this.commit(c.kind === 'audio'); this.panels(); },
  z(d) { const r = this.reel, l = this.selLayer; if (!l) return; const i = r.layers.indexOf(l), j = clamp(i + d, 0, r.layers.length - 1); r.layers.splice(i, 1); r.layers.splice(j, 0, l); this.commit(); this.stage.render(); },
  onKey(e) {
    const c = e.ctrlKey || e.metaKey, k = e.key.toLowerCase(); let used = true;
    if (e.key === ' ') this.toggle(); else if (c && k === 'z') (e.shiftKey ? this.redo() : this.undo()); else if (c && k === 'y') this.redo(); else if (c && k === 'd') this.dupSel(); else if (e.key === 'Delete' || e.key === 'Backspace') this.delSel();
    else if (!c && k === 's') this.split(); else if (e.key === 'Home') this.seek(0); else if (e.key === 'End') this.seek(this.reel.dur); else if (e.key === 'ArrowLeft') this.seek(this.t - (e.shiftKey ? 1 : 1 / this.reel.fps)); else if (e.key === 'ArrowRight') this.seek(this.t + (e.shiftKey ? 1 : 1 / this.reel.fps));
    else if (e.key === 'Escape') { this.selId = null; this.panels(); this.stage.render(); this.tlMarks(); } else used = false;
    if (used) e.preventDefault(); return used;
  },

  // ── Oś czasu ──
  fitBase() { const r = this.reel; if (!r) return; const w = this.scroll.clientWidth || 800; this.base = Math.max(8, (w - 60) / Math.max(1, r.dur)); },
  pps() { return (this.base || 20) * this.zoom; },
  setZoom(z) { this.zoom = clamp(z, 0.25, 12); this.tl(); },
  tl() {
    const r = this.reel; if (!r) return; if (!this.base) this.fitBase(); const pps = this.pps(), W = Math.max(this.scroll.clientWidth, r.dur * pps + 80); this.inner.style.width = W + 'px'; this.inner.innerHTML = '';
    // Klipy nakładające się w czasie układamy w osobne pasy (inaczej jeden zasłania drugi).
    const items = {}; TRACKS.forEach(([k]) => { items[k] = []; });
    for (const l of r.layers) { const tr = items[l.track] ? l.track : 'graphic'; items[tr].push({ it: l, kind: 'layer', tr, t0: l.t0, t1: Math.min(l.t1, r.dur) }); }
    for (const a of r.audio) items[a.track].push({ it: a, kind: 'audio', tr: a.track, t0: a.t0, t1: a.t0 + a.dur });
    const laneN = {}; for (const k in items) { const ends = []; items[k].sort((a, b) => a.t0 - b.t0); for (const c of items[k]) { let i = ends.findIndex((e) => e <= c.t0 + 0.001); if (i < 0) { i = ends.length; ends.push(0); } ends[i] = c.t1; c.lane = i; } laneN[k] = Math.max(1, ends.length); }
    const LH = (k) => (laneN[k] > 1 ? 22 : 30), RH = (k) => laneN[k] * LH(k);
    this.names.innerHTML = ''; this.names.append(h('div', { style: { height: '24px', borderBottom: '1px solid var(--bd)' } })); TRACKS.forEach(([k, n]) => this.names.append(h('div', { style: { height: RH(k) + 'px' }, title: laneN[k] > 1 ? n + ': ' + laneN[k] + ' nakładające się warstwy' : n }, n)));
    const ruler = h('div', { class: 'tl-ruler', style: { width: W + 'px' } }); ruler.addEventListener('pointerdown', (e) => this.scrub(e));
    let step = [0.5, 1, 2, 5, 10, 15, 30, 60].find((s) => s * pps >= 56) || 60; for (let s = 0; s <= r.dur + 1e-6; s += step) ruler.append(h('i', { style: { left: s * pps + 'px' } }, fmtTime(s))); this.inner.append(ruler);
    const rows = {}; TRACKS.forEach(([k]) => { const row = h('div', { class: 'tl-track', style: { width: W + 'px', height: RH(k) + 'px' } }); row.addEventListener('pointerdown', (e) => { if (e.target === row) { this.scrub(e); if (this.selId) { this.selId = null; this.panels(); this.stage.render(); this.tlMarks(); } } }); rows[k] = row; this.inner.append(row); });
    for (const k in items) for (const c of items[k]) rows[k].append(this.clipEl(c.it, c.kind, k, c.t0, c.t1, pps, c.lane, LH(k), laneN[k] > 1));
    this.ph = h('div', { class: 'playhead' }); this.inner.append(this.ph); this.updPlayhead(); this.names.scrollTop = this.scroll.scrollTop;
  },
  tlMarks() { $$('.clip', this.inner).forEach((c) => c.classList.toggle('sel', c.dataset.id === this.selId)); },
  clipEl(it, kind, tr, t0, t1, pps, lane, lh, stacked) {
    const el = h('div', { class: 'clip ' + tr + (it.id === this.selId ? ' sel' : ''), title: it.name + ' (' + t0.toFixed(1) + '–' + t1.toFixed(1) + ' s)', style: Object.assign({ left: t0 * pps + 'px', width: Math.max(8, (t1 - t0) * pps) + 'px' }, stacked ? { top: 2 + lane * lh + 'px', height: lh - 4 + 'px', padding: '0 14px', lineHeight: lh - 6 + 'px' } : {}) }, it.name, h('div', { class: 'eh l' }), h('div', { class: 'eh rr' }));
    el.dataset.id = it.id; el.style.opacity = it.hide ? 0.45 : 1; el.addEventListener('pointerdown', (e) => this.dragClip(e, it, kind, e.target.classList.contains('l') ? 'l' : e.target.classList.contains('rr') ? 'r' : 'm', el));
    if (kind === 'audio') { const cv = h('canvas', { width: Math.max(8, Math.round((t1 - t0) * pps)), height: 24 }); el.prepend(cv); this.wave(cv, it); } return el;
  },
  async wave(cv, a) {
    try { const A = await Assets.audio(a.assetId); if (!A) return; const w = cv.width, pk = DSP.peaks(A.chs[0], w, Math.floor(a.in * A.fs), Math.min(A.chs[0].length, Math.floor((a.in + a.dur) * A.fs))), x = cv.getContext('2d'); x.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < w; i++) { const mn = pk[2 * i], mx = pk[2 * i + 1]; x.fillRect(i, 12 - mx * 12, 1, Math.max(1, (mx - mn) * 12)); } } catch (e) { /* brak podglądu fali */ }
  },
  snapT(t, ex) {
    if (!this.snap) return t; const pps = this.pps(), tol = 8 / pps, pts = [0, this.reel.dur, this.t]; for (const c of this.allClips()) if (c.it !== ex) pts.push(c.t0, c.t1);
    let best = null; for (const p of pts) { const d = Math.abs(p - t); if (d <= tol && (best == null || d < Math.abs(best - t))) best = p; } return best == null ? t : best;
  },
  dragClip(e, it, kind, mode, el) {
    if (e.button !== 0) return; e.preventDefault(); e.stopPropagation(); this.select(kind, it.id); if (it.lock) return;
    const r = this.reel, pps = this.pps(), x0 = e.clientX, isA = kind === 'audio', o = { t0: it.t0, t1: isA ? it.t0 + it.dur : Math.min(it.t1, r.dur), in: it.in }; let moved = false;
    const apply = (t0, t1) => { if (isA) { it.t0 = t0; it.dur = Math.max(0.1, t1 - t0); } else { it.t0 = t0; it.t1 = t1; } el.style.left = t0 * pps + 'px'; el.style.width = Math.max(8, (t1 - t0) * pps) + 'px'; };
    const mv = (ev) => {
      const d = (ev.clientX - x0) / pps; if (Math.abs(ev.clientX - x0) > 2) moved = true; if (!moved) return;
      if (mode === 'm') { const len = o.t1 - o.t0; let a = Math.max(0, o.t0 + d); const cand = [this.snapT(a, it), this.snapT(a + len, it) - len].filter((x) => Math.abs(x - a) > 1e-9); if (cand.length) a = cand.sort((x, y) => Math.abs(x - a) - Math.abs(y - a))[0]; a = Math.max(0, a); apply(a, a + len); }
      else if (mode === 'l') { let a = this.snapT(Math.max(0, o.t0 + d), it); a = clamp(a, 0, o.t1 - 0.1); if (isA) { const nin = o.in + (a - o.t0); if (nin < 0) a = o.t0 - o.in; it.in = Math.max(0, o.in + (a - o.t0)); } else if (it.type === 'video') it.video.in = Math.max(0, (this._vin0 = this._vin0 == null ? it.video.in : this._vin0) + (a - o.t0) * (it.video.speed || 1)); apply(a, o.t1); }
      else { let b = this.snapT(o.t1 + d, it); b = Math.max(o.t0 + 0.1, b); if (isA && !it.loop && it.srcDur) b = Math.min(b, o.t0 + (it.srcDur - it.in)); apply(o.t0, b); }
      this.t = this.t; this.stage.render();
    };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); this._vin0 = null; if (moved) { this.ensureDur(isA ? it.t0 + it.dur : it.t1 > 1e5 ? 0 : it.t1); this.commit(isA); } };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  },
  scrub(e) {
    const r = this.reel; e.preventDefault(); const rect = this.inner.getBoundingClientRect(), pps = this.pps(); const f = (ev) => this.seek(clamp((ev.clientX - rect.left) / pps, 0, r.dur), true);
    f(e); const up = () => { window.removeEventListener('pointermove', f); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', f); window.addEventListener('pointerup', up);
  },
  updPlayhead() { if (this.ph) this.ph.style.left = this.t * this.pps() + 'px'; },
  updTime() { if (this.timeEl && this.reel) this.timeEl.textContent = fmtTime(this.t) + ' / ' + fmtTime(this.reel.dur); },
  keepVisible() { const x = this.t * this.pps(), s = this.scroll; if (x < s.scrollLeft + 10 || x > s.scrollLeft + s.clientWidth - 30) s.scrollLeft = Math.max(0, x - s.clientWidth * 0.3); },

  // ── Odtwarzanie ──
  seek(t, scrubbing) {
    const r = this.reel; if (!r) return; t = clamp(t, 0, r.dur); const was = this.playing; if (was) { this.pause(); } this.t = t; this.stage.render(t); this.updPlayhead(); this.updTime(); this.syncVideos(t, false); if (was && !scrubbing) this.play();
  },
  toggle() { this.playing ? this.pause() : this.play(); },
  async play() {
    const r = this.reel; if (this.playing) return; if (this.t >= r.dur - 0.03) this.t = 0; this.playing = true; this.playBtn.textContent = '⏸ Pauza';
    try { await this.ensureVideos(); await this.startAudio(this.t); } catch (e) { toast('Podgląd dźwięku niedostępny: ' + errText(e), 'warn', 6000); }
    if (!this.playing) return; this.clk0 = performance.now(); this.t00 = this.t;
    const loop = () => {
      if (!this.playing) return; let t = this.t00 + (performance.now() - this.clk0) / 1000;
      if (t >= r.dur) { if (this.loop) { this.t = 0; this.stopAudio(); this.startAudio(0).then(() => { this.clk0 = performance.now(); this.t00 = 0; }); this.raf = requestAnimationFrame(loop); return; } this.t = r.dur; this.pause(); this.stage.render(this.t); this.updPlayhead(); this.updTime(); return; }
      this.t = t; this.syncVideos(t, true); this.stage.render(t); this.updPlayhead(); this.updTime(); this.keepVisible(); this.raf = requestAnimationFrame(loop);
    }; this.raf = requestAnimationFrame(loop);
  },
  pause() { if (!this.playing && !this.src) { this.playBtn && (this.playBtn.textContent = '▶ Odtwarzaj'); return; } this.playing = false; cancelAnimationFrame(this.raf); this.stopAudio(); if (this.playBtn) this.playBtn.textContent = '▶ Odtwarzaj'; for (const v of this.vids.values()) v.el.pause(); },
  stopAudio() { if (this.src) { try { this.src.stop(); } catch (e) { /* już zatrzymane */ } this.src = null; } },
  async startAudio(t) {
    const m = await this.mixReel(); if (!m || m.none || !this.playing) return; if (!this.ac) this.ac = new AudioContext({ sampleRate: 48000 }); await this.ac.resume();
    const buf = this.ac.createBuffer(2, m.chs[0].length, 48000); buf.copyToChannel(m.chs[0], 0); buf.copyToChannel(m.chs[1], 1); const s = this.ac.createBufferSource(); s.buffer = buf; s.connect(this.ac.destination); s.start(0, Math.min(t, m.chs[0].length / 48000 - 0.01)); this.src = s;
  },
  async mixReel() {
    const r = this.reel, mx = P.cur.mix, key = JSON.stringify([r.audio.map((a) => [a.assetId, a.track, a.t0, a.in, a.dur, a.gain, a.fi, a.fo, a.loop, a.duck]), r.dur, mx.duckDepth, mx.duckAttack, mx.duckRelease, mx.target, mx.tp]);
    if (this.mc && this.mc.key === key) return this.mc; if (!r.audio.length) return (this.mc = { key, none: true });
    const clips = []; for (const a of r.audio) { const A = await Assets.audio(a.assetId); if (!A) continue; clips.push({ track: a.track, chs: A.chs, t0: a.t0, in: a.in, out: a.in + a.dur, t1: a.t0 + a.dur, vol: a.gain, fadeIn: a.fi, fadeOut: a.fo, loop: !!a.loop, duck: a.duck !== false }); }
    await tick(); const m = DSP.mixdown(clips, 48000, r.dur, { duck: { depth: mx.duckDepth, attack: mx.duckAttack, release: mx.duckRelease } }); await tick();
    const n = DSP.loudnessNormalize(m.chs, 48000, mx.target, mx.tp), qc = DSP.qc(n.chs, 48000, { target: mx.target, tp: mx.tp, voice: m.voice, music: m.music });
    return (this.mc = { key, chs: n.chs, qc, fs: 48000, voice: m.voice, music: m.music });
  },
  async ensureVideos() {
    const r = this.reel; if (!r) return; for (const l of r.layers) if (l.type === 'video' && l.video.assetId) {
      let v = this.vids.get(l.id); if (v && v.asset === l.video.assetId) continue; const u = await Assets.url(l.video.assetId); if (!u) continue; const el = document.createElement('video'); el.muted = true; el.playsInline = true; el.preload = 'auto'; el.src = u;
      await new Promise((res) => { el.onloadeddata = res; el.onerror = res; setTimeout(res, 8000); }); if (!el.videoWidth) toast('Przeglądarka nie wyświetla obrazu z „' + l.name + '” (kodek, np. HEVC/H.265). Użyj MP4 H.264 lub nagraj w trybie „Najbardziej zgodny”.', 'bad', 12000); el.addEventListener('seeked', () => { if (!this.playing) this.stage.render(); }); this.vids.set(l.id, { el, asset: l.video.assetId });
    }
  },
  syncVideos(t, playing) {
    const r = this.reel; for (const l of r.layers) { if (l.type !== 'video') continue; const v = this.vids.get(l.id); if (!v) continue; const el = v.el, inR = t >= l.t0 && t <= l.t1, tt = Math.max(0, l.video.in + (t - l.t0) * (l.video.speed || 1)); if (!inR) { if (!el.paused) el.pause(); continue; } el.playbackRate = clamp(l.video.speed || 1, 0.25, 4); if (playing) { if (Math.abs(el.currentTime - tt) > 0.35) el.currentTime = tt; if (el.paused) el.play().catch(() => {}); } else { if (!el.paused) el.pause(); if (Math.abs(el.currentTime - tt) > 0.02) el.currentTime = tt; } }
  },
  async seekVideos(t) {
    const r = this.reel, ps = []; for (const l of r.layers) { if (l.type !== 'video') continue; const v = this.vids.get(l.id); if (!v || t < l.t0 || t > l.t1) continue; const el = v.el, tt = Math.max(0, l.video.in + (t - l.t0) * (l.video.speed || 1)); if (Math.abs(el.currentTime - tt) < 0.002 && el.readyState >= 2) continue; ps.push(new Promise((res) => { const done = () => { el.removeEventListener('seeked', done); res(); }; el.addEventListener('seeked', done); el.currentTime = Math.min(tt, (el.duration || tt + 1) - 0.001); setTimeout(res, 2000); })); }
    if (ps.length) await Promise.all(ps);
  },

  // ── Klatka / okładka ──
  async frameBlob(t, type) { const r = this.reel; await preloadScene(r); await this.ensureVideos(); await this.seekVideos(t); const c = document.createElement('canvas'); c.width = r.w; c.height = r.h; drawScene(c.getContext('2d'), r, t, { video: (l) => { const v = this.vids.get(l.id); return v ? v.el : null; } }); return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob zwrócił null'))), type || 'image/png', 0.93)); },
  async framePng() { try { download(await this.frameBlob(this.t), fname(slug(this.reel.name) + '_klatka', 'png')); } catch (e) { toast('Nie udało się zapisać klatki: ' + errText(e), 'bad'); } },
  async frameAsCover() { try { const b = await this.frameBlob(this.t), id = await Assets.add(new File([b], 'okladka_rolki.png', { type: 'image/png' }), 'image'); P.cur.publish.cover = id; touch(); toast('Ustawiono okładkę publikacji z klatki ' + fmtTime(this.t), 'ok'); } catch (e) { toast(errText(e), 'bad'); } },
  async exportMixWav() { try { const m = await this.mixReel(); if (!m || m.none) { toast('Rolka nie ma dźwięku.', 'warn'); return; } download(new Blob([DSP.wav(m.chs, 48000, 16)], { type: 'audio/wav' }), fname(slug(this.reel.name) + '_miks', 'wav')); } catch (e) { toast(errText(e), 'bad'); } },

  // ── Napisy ──
  subtitlesDialog() {
    const r = this.reel, voices = r.audio.filter((a) => a.track === 'voice'); if (!voices.length) { toast('Najpierw dodaj klip na ścieżkę „Głos”.', 'warn'); return; }
    const words = h('input', { type: 'number', value: 5, min: 2, max: 10 }), up = h('input', { type: 'checkbox', style: { width: 'auto', flex: 'none' } }), place = h('select', {}, [['low', 'Dół (nad strefą interfejsu)'], ['mid', 'Środek ekranu'], ['top', 'Góra (pod strefą interfejsu)']].map(([v, n]) => h('option', { value: v }, n)));
    modal('Napisy z nagrania głosu', h('div', {}, h('div', { class: 'hint', html: rich('Mowa jest rozpoznawana przez Whisper w Workerze (chmura). Napisy powstają jako zwykłe warstwy tekstu, które możesz dalej edytować.') }), h('div', { class: 'row', style: { marginTop: '8px' } }, h('div', { class: 'fld' }, h('label', {}, 'Słów w jednej linii'), words), h('div', { class: 'fld' }, h('label', {}, 'Pozycja'), place)), h('label', { class: 'row', style: { gap: '6px' } }, up, h('span', { class: 'fine' }, 'WERSALIKI'))),
      [{ t: 'Rozpoznaj i dodaj napisy', cls: 'pri', keep: true, fn: async (close) => { close(); const pr = progressModal('Napisy'); try { let n = 0; for (const [i, a] of voices.entries()) { pr.set(i / voices.length, 'rozpoznawanie mowy: ' + a.name); const A = await Assets.audio(a.assetId), s0 = Math.floor(a.in * A.fs), s1 = Math.min(A.chs[0].length, Math.floor((a.in + a.dur) * A.fs)), seg = await AI.stt(wav16k([A.chs[0].subarray(s0, s1)], A.fs)); n += this.addSubtitles(seg, a.t0, +words.value || 5, place.value, up.checked); if (pr.cancel) break; } pr.close(); this.commit(); this.panels(); toast('Dodano ' + n + ' linii napisów.', n ? 'ok' : 'warn'); } catch (e) { pr.close(); toast('Napisy nieudane: ' + errText(e), 'bad', 9000); } } }, { t: 'Anuluj' }]);
  },
  addSubtitles(segments, off, perLine, place, upper) {
    const r = this.reel, y = place === 'top' ? SAFE.top + 160 : place === 'mid' ? r.h * 0.55 : r.h - SAFE.bottom - 120; let n = 0;
    for (const s of segments || []) { const w = String(s.text || '').trim().split(/\s+/).filter(Boolean); if (!w.length) continue; const chunks = []; for (let i = 0; i < w.length; i += perLine) chunks.push(w.slice(i, i + perLine)); const dur = Math.max(0.3, (s.end || 0) - (s.start || 0)), tot = w.length; let c0 = 0;
      for (const ch of chunks) { const d = dur * ch.length / tot, l = mkLayer('text', { x: r.w / 2, y, w: r.w - 2 * SAFE.left - 40 }); l.t0 = off + (s.start || 0) + c0; l.t1 = l.t0 + d; c0 += d; l.name = 'Napis: ' + ch.slice(0, 3).join(' '); l.track = 'text'; Object.assign(l.text, { s: ch.join(' '), size: 64, weight: 800, color: '#ffffff', font: P.cur.brand.bodyFont, upper: !!upper, lh: 1.15 }); l.text.bg = { on: true, c: 'rgba(0,0,0,.62)', pad: 18, r: 16 }; l.anim.in = { p: 'pop', d: 0.18, dl: 0, e: 'outBack', dir: 'bottom' }; l.anim.out = { p: 'fade', d: 0.08, dl: 0, e: 'inCubic', dir: 'bottom' }; r.layers.push(l); n++; } }
    return n;
  },

  // ── Eksport ──
  netCheck() { const r = this.reel; return [['Instagram Reels', r.dur >= 3 && r.dur <= 90], ['YouTube Shorts', r.dur <= 180], ['TikTok', r.dur >= 3 && r.dur <= 600], ['Facebook Reels', r.dur >= 3 && r.dur <= 90]]; },
  async exportDialog() {
    this.pause(); const r = this.reel, fps = h('select', {}, [30, 24, 60].map((v) => h('option', { value: v, selected: v === 30 }, v + ' fps' + (v === 30 ? ' (zalecane)' : '')))), br = h('select', {}, [[6, '6 Mb/s (lżejszy plik)'], [8, '8 Mb/s (zalecane)'], [12, '12 Mb/s (najwyższa jakość)']].map(([v, n]) => h('option', { value: v, selected: v === 8 }, n)));
    const info = h('div', { class: 'hint' }, 'Sprawdzam możliwości przeglądarki…'); const cap = await this.capabilities(); info.innerHTML = rich(cap.html);
    modal('Eksport MP4', h('div', {}, info, h('div', { class: 'row', style: { marginTop: '8px' } }, h('div', { class: 'fld' }, h('label', {}, 'Klatki na sekundę'), fps), h('div', { class: 'fld' }, h('label', {}, 'Przepływność wideo'), br)),
      h('div', { class: 'fine', style: { marginTop: '6px' } }, 'Rolka: ' + fmtTime(r.dur) + ', ' + r.w + '×' + r.h + ', ' + r.layers.length + ' warstw, ' + r.audio.length + ' klipów dźwięku'), h('div', { style: { marginTop: '8px' } }, this.netCheck().map(([n, ok]) => h('span', { class: 'tag ' + (ok ? 'ok' : 'warn'), style: { marginRight: '6px' } }, n + (ok ? ' ✔' : ' ▲ długość'))))),
      [{ t: 'Eksportuj', cls: 'pri', keep: true, fn: (close) => { close(); this.runExport({ fps: +fps.value, bitrate: +br.value * 1e6 }); } }, { t: 'Anuluj' }]);
  },
  async capabilities() {
    const c = { v: false, a: false, opus: false, vcodec: null, acodec: null };
    try { if (window.VideoEncoder) for (const cd of ['avc1.640028', 'avc1.4d0028', 'avc1.42E028']) { const s = await VideoEncoder.isConfigSupported({ codec: cd, width: 1080, height: 1920, bitrate: 8e6, framerate: 30, avc: { format: 'avc' } }); if (s.supported) { c.v = true; c.vcodec = cd; break; } } } catch (e) { /* brak */ }
    try { if (window.AudioEncoder) { c.a = (await AudioEncoder.isConfigSupported({ codec: 'mp4a.40.2', sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 })).supported; c.opus = (await AudioEncoder.isConfigSupported({ codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 160000 })).supported; } } catch (e) { /* brak */ }
    c.html = c.v ? (c.a ? 'Wykryto kodowanie sprzętowe/programowe: (H.264 + AAC). Plik: MP4 gotowy dla IG, YouTube, TikTok i Facebooka.' : 'Wykryto (H.264), ale ta przeglądarka nie koduje AAC. ' + (c.opus ? 'Dźwięk zostanie zapisany jako (Opus) w MP4: YouTube go przyjmie, Instagram i TikTok mogą odrzucić. Do pełnej zgodności użyj Chrome na Windows lub macOS.' : 'Dźwięk nie zostanie zapisany.')) : 'Ta przeglądarka nie obsługuje WebCodecs H.264. Użyję trybu awaryjnego (WebM, nagrywanie w czasie rzeczywistym). Nie jest zgodny z Instagramem i TikTokiem bez konwersji.'; return c;
  },
  async runExport(o) {
    const r = this.reel, pr = progressModal('Eksport rolki'), t0 = Date.now(); let blob, kind = 'mp4', note = '';
    try {
      pr.set(0, 'przygotowanie zasobów'); await preloadScene(r); await this.ensureVideos(); const cap = await this.capabilities();
      if (cap.v) { const res = await this.encodeMP4(o, pr, cap); blob = res.blob; note = res.note; } else { blob = await this.encodeWebM(o, pr); kind = 'webm'; note = 'tryb awaryjny WebM'; }
      if (pr.cancel) { pr.close(); toast('Eksport anulowany.', 'warn'); return; } pr.close();
      const nm = fname(slug(r.name), kind), id = await Assets.add(new File([blob], nm, { type: blob.type }), 'render'); P.cur.publish.video = id; P.cur.publish.videoInfo = { name: nm, size: blob.size, dur: r.dur, w: r.w, h: r.h, fps: o.fps, kind, note, ts: Date.now(), qc: this.mc && this.mc.qc ? this.mc.qc.items.map((x) => ({ k: x.k, v: x.v, ok: x.ok })) : null }; touch();
      let probe = null; try { probe = await this.probe(blob); } catch (e) { probe = { err: errText(e) }; }
      const sec = ((Date.now() - t0) / 1000).toFixed(1); download(blob, nm);
      modal('Eksport zakończony', h('div', {}, h('table', { class: 'qc' }, ...[['Plik', nm], ['Rozmiar', fmtSize(blob.size)], ['Czas eksportu', sec + ' s'], ['Format', kind === 'mp4' ? 'MP4 (H.264' + (note.includes('AAC') ? ' + AAC' : note.includes('Opus') ? ' + Opus' : ', bez dźwięku') + ')' : 'WebM (awaryjny)'], ['Wymiary / FPS', r.w + '×' + r.h + ' @ ' + o.fps], ['Test odczytu w przeglądarce', probe && !probe.err ? 'OK: ' + probe.w + '×' + probe.h + ', ' + probe.dur.toFixed(2) + ' s' : 'BŁĄD: ' + (probe && probe.err)]].map(([a, b]) => h('tr', {}, h('td', {}, a), h('td', {}, b)))),
        this.mc && this.mc.qc ? h('div', { class: 'hint', style: { marginTop: '8px' }, html: rich('Dźwięk: (' + this.mc.qc.lufs.toFixed(1) + ' LUFS), true peak (' + this.mc.qc.tp.toFixed(1) + ' dBTP). Pełny raport: zakładka Audio.') }) : h('div', { class: 'hint', style: { marginTop: '8px' } }, 'Rolka nie ma ścieżki dźwiękowej.'), h('div', { class: 'hint', html: rich('Plik zapisano też w bibliotece projektu i wybrano go do (Publikacji).') })), [{ t: 'Zamknij' }]);
    } catch (e) { pr.close(); if (/^cancel$/.test(e && e.message)) { toast('Eksport anulowany.', 'warn'); return; } console.error(e); toast('Eksport nieudany: ' + errText(e), 'bad', 12000); }
  },
  probe(blob) { return new Promise((res, rej) => { const v = document.createElement('video'); v.preload = 'metadata'; v.muted = true; v.onloadedmetadata = () => res({ w: v.videoWidth, h: v.videoHeight, dur: v.duration }); v.onerror = () => rej(new Error('przeglądarka nie odczytuje pliku')); v.src = URL.createObjectURL(blob); setTimeout(() => rej(new Error('limit czasu odczytu')), 8000); }); },
  async encodeMP4(o, pr, cap) {
    const r = this.reel, W = r.w, H = r.h, fps = o.fps || 30, N = Math.round(r.dur * fps); pr.set(0, 'miks dźwięku'); const mix = await this.mixReel(); const hasA = mix && !mix.none && (cap.a || cap.opus), acodec = hasA ? (cap.a ? 'aac' : 'opus') : null;
    const target = new Mp4Muxer.ArrayBufferTarget(), muxer = new Mp4Muxer.Muxer({ target, video: { codec: 'avc', width: W, height: H, frameRate: fps }, audio: hasA ? { codec: acodec, numberOfChannels: 2, sampleRate: 48000 } : undefined, fastStart: 'in-memory', firstTimestampBehavior: 'offset' });
    let err = null; const venc = new VideoEncoder({ output: (c, m) => muxer.addVideoChunk(c, m), error: (e) => { err = e; } }); venc.configure({ codec: cap.vcodec, width: W, height: H, bitrate: o.bitrate || 8e6, framerate: fps, avc: { format: 'avc' }, latencyMode: 'quality' });
    if (hasA) { const aenc = new AudioEncoder({ output: (c, m) => muxer.addAudioChunk(c, m), error: (e) => { err = e; } }); aenc.configure({ codec: acodec === 'aac' ? 'mp4a.40.2' : 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: acodec === 'aac' ? 192000 : 160000 }); const total = mix.chs[0].length, CH = 48000;
      for (let i = 0; i < total; i += CH) { if (pr.cancel) throw new Error('cancel'); const n = Math.min(CH, total - i), buf = new Float32Array(n * 2); buf.set(mix.chs[0].subarray(i, i + n), 0); buf.set(mix.chs[1].subarray(i, i + n), n); const ad = new AudioData({ format: 'f32-planar', sampleRate: 48000, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round(i / 48000 * 1e6), data: buf }); aenc.encode(ad); ad.close(); while (aenc.encodeQueueSize > 8) await sleep(2); if (err) throw err; } await aenc.flush(); aenc.close(); }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const ctx = cv.getContext('2d', { alpha: false }), opts = { video: (l) => { const v = this.vids.get(l.id); return v ? v.el : null; } };
    for (let i = 0; i < N; i++) {
      if (pr.cancel) throw new Error('cancel'); if (err) throw err; const t = i / fps; await this.seekVideos(t); ctx.clearRect(0, 0, W, H); drawScene(ctx, r, t, opts);
      const vf = new VideoFrame(cv, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) }); venc.encode(vf, { keyFrame: i % (fps * 2) === 0 }); vf.close(); while (venc.encodeQueueSize > 6) await sleep(2);
      if (i % 4 === 0) { pr.set(i / N, 'klatka ' + i + ' / ' + N); await tick(); }
    }
    await venc.flush(); venc.close(); if (err) throw err; muxer.finalize(); return { blob: new Blob([target.buffer], { type: 'video/mp4' }), note: hasA ? (acodec === 'aac' ? 'H.264 + AAC' : 'H.264 + Opus (brak AAC w przeglądarce)') : 'H.264 bez dźwięku' };
  },
  async encodeWebM(o, pr) {
    const r = this.reel, fps = o.fps || 30, cv = document.createElement('canvas'); cv.width = r.w; cv.height = r.h; const ctx = cv.getContext('2d'), stream = cv.captureStream(fps), mix = await this.mixReel(); let ac = null, src = null;
    if (mix && !mix.none) { ac = new AudioContext({ sampleRate: 48000 }); const dst = ac.createMediaStreamDestination(), buf = ac.createBuffer(2, mix.chs[0].length, 48000); buf.copyToChannel(mix.chs[0], 0); buf.copyToChannel(mix.chs[1], 1); src = ac.createBufferSource(); src.buffer = buf; src.connect(dst); stream.addTrack(dst.stream.getAudioTracks()[0]); }
    const mt = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m)); if (!mt) throw new Error('Przeglądarka nie obsługuje nagrywania wideo (MediaRecorder).');
    const rec = new MediaRecorder(stream, { mimeType: mt, videoBitsPerSecond: o.bitrate || 8e6 }), chunks = []; rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); }; const done = new Promise((res) => { rec.onstop = res; });
    const opts = { video: (l) => { const v = this.vids.get(l.id); return v ? v.el : null; } }; rec.start(250); if (src) src.start(); const t0 = performance.now();
    await new Promise((res) => { const f = () => { const t = (performance.now() - t0) / 1000; if (pr.cancel || t >= r.dur) { res(); return; } this.syncVideos(t, true); drawScene(ctx, r, t, opts); pr.set(t / r.dur, 'nagrywanie w czasie rzeczywistym'); requestAnimationFrame(f); }; f(); });
    rec.stop(); await done; if (ac) ac.close(); for (const v of this.vids.values()) v.el.pause(); return new Blob(chunks, { type: 'video/webm' });
  },
};
