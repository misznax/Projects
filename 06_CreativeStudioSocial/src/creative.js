/* CREATIVE STUDIO: posty, karuzele, okładki, stories — warstwy, edycja, obrazy AI, eksport */
const Creative = {
  built: false, selId: null, hist: null, clip: null,
  get post() { const p = P.cur; return p.posts.find((x) => x.id === p.curPost) || null; },
  get slide() { const p = this.post; return p ? p.slides[clamp(P.cur.curSlide, 0, p.slides.length - 1)] : null; },
  get sel() { const s = this.slide; return s && this.selId ? s.layers.find((l) => l.id === this.selId) || null : null; },
  newPost(fmt, name, slides) {
    const F = FORMATS[fmt], post = { id: uid('post'), name: name || 'Post ' + (P.cur.posts.length + 1), fmt, slides: slides || [] };
    if (!post.slides.length) post.slides.push(makeScene('cover', { title: 'Tytuł, który zatrzymuje kciuk', text: 'Podtytuł w jednym zdaniu', total: 1, idx: 0 }, fmt, 0));
    post.slides.forEach((s) => { s.id = s.id || uid('s'); }); P.cur.posts.push(post); P.cur.curPost = post.id; P.cur.curSlide = 0; this.selId = null; touch(); return post;
  },
  build() {
    const root = $('#m-creative'); root.innerHTML = '';
    this.left = h('div', { class: 'panel' }); this.right = h('div', { class: 'panel r' }); this.host = h('div', { class: 'stagehost' });
    this.tool = h('div', { class: 'tool' }); const center = h('div', { class: 'center' }, this.tool, this.host); root.append(this.left, center, this.right); this.built = true;
    this.stage = new Stage(this.host, { scene: () => this.slide, sel: () => this.sel, select: (id) => { this.selId = id; this.panels(); this.stage.render(); }, change: (k) => (k === 'commit' ? this.commit() : this.panelsLive()), onEdit: () => { const t = $('textarea[data-k="text.s"]', this.right); if (t) { t.focus(); t.select(); } }, key: (e) => this.onKey(e) });
    this.buildTools();
  },
  buildTools() {
    const T = this.tool; T.innerHTML = '';
    const b = (t, fn, cls, title) => h('button', { class: 'btn ' + (cls || ''), onclick: fn, title: title || '' }, t);
    this.safeBtn = b('Strefy', () => { this.stage.safe = !this.stage.safe; this.safeBtn.classList.toggle('on', this.stage.safe); this.stage.overlay(); }, '', 'Pokaż strefy zasłaniane przez interfejs aplikacji');
    T.append(b('T  Tekst', () => this.addText()), b('▭ Kształt', (e) => popMenu(e.currentTarget, [{ t: 'Prostokąt', i: '▭', fn: () => this.addShape('rect') }, { t: 'Elipsa', i: '◯', fn: () => this.addShape('ellipse') }, { t: 'Linia / pasek', i: '▬', fn: () => this.addShape('line') }])),
      b('🖼 Obraz', (e) => popMenu(e.currentTarget, [{ t: 'Z komputera…', i: '📁', fn: () => this.addImageFile() }, { t: 'Z biblioteki zasobów…', i: '🗂', fn: () => this.addImageLib() }, { t: 'Wygeneruj obraz AI…', i: '🪄', fn: () => this.aiImage() }])),
      h('span', { class: 'sep' }), b('↶', () => this.undo(), '', 'Cofnij (Ctrl+Z)'), b('↷', () => this.redo(), '', 'Ponów (Ctrl+Y)'), this.safeBtn, h('span', { class: 'sep' }),
      b('✨ Z tematu', () => this.aiCarousel(), 'sea', 'AI układa karuzelę ze slajdów'), h('span', { style: { flex: 1 } }),
      b('Eksport ▾', (e) => popMenu(e.currentTarget, [{ t: 'Bieżący slajd (PNG)', i: '🖼', fn: () => this.exportOne('png') }, { t: 'Bieżący slajd (JPG)', i: '🖼', fn: () => this.exportOne('jpg') }, { t: 'Wszystkie slajdy (ZIP z PNG)', i: '📦', fn: () => this.exportAll() }, '-', { t: 'Użyj bieżącego slajdu jako okładki publikacji', i: '📌', fn: () => this.useAsCover() }]), 'pri'));
  },
  show() {
    if (!this.built) this.build(); const p = P.cur;
    if (!this.post) { if (p.posts.length) { p.curPost = p.posts[0].id; } else this.newPost('post45', 'Karuzela 1'); }
    this.hist = new History(() => this.post, (s) => { const i = P.cur.posts.findIndex((x) => x.id === s.id); if (i >= 0) P.cur.posts[i] = s; });
    this.panels(); requestAnimationFrame(() => { this.stage.fit(); });
  },
  // ── Panele ──
  panels() { this.leftPanel(); this.rightPanel(); },
  panelsLive() { const l = this.sel; if (!l) return; for (const k of ['x', 'y', 'w', 'h', 'rot']) { const i = $(`input[data-pk="${k}"]`, this.right); if (i && document.activeElement !== i) i.value = rnd(l[k], 1); } },
  leftPanel() {
    const L = this.left, p = P.cur, post = this.post; L.innerHTML = '';
    const sel = h('select', { 'aria-label': 'Projekt graficzny', onchange: (e) => { p.curPost = e.target.value; p.curSlide = 0; this.selId = null; this.hist = new History(() => this.post, (s) => { const i = P.cur.posts.findIndex((x) => x.id === s.id); if (i >= 0) P.cur.posts[i] = s; }); this.panels(); this.stage.fit(); touch(); } }, p.posts.map((x) => h('option', { value: x.id, selected: x.id === p.curPost }, x.name)));
    L.append(h('div', { class: 'ph' }, 'Projekty graficzne'), h('div', { class: 'sec' }, sel, h('div', { class: 'row', style: { marginTop: '6px' } },
      h('button', { class: 'btn sm', onclick: (e) => popMenu(e.currentTarget, Object.entries(FORMATS).map(([k, f]) => ({ t: f.n, i: '＋', fn: () => { this.newPost(k); this.show(); } }))) }, '＋ Nowy'),
      h('button', { class: 'btn sm', title: 'Kopia jako wariant (inny układ do wypróbowania)', onclick: () => { const c = jclone(post); c.id = uid('post'); c.name = post.name + ' (wariant)'; c.slides.forEach((s) => { s.id = uid('s'); }); p.posts.push(c); p.curPost = c.id; touch(); this.show(); toast('Utworzono wariant', 'ok'); } }, 'Duplikuj'),
      h('button', { class: 'btn sm', onclick: (e) => popMenu(e.currentTarget, [{ t: 'Zmień nazwę…', i: '✎', fn: () => { const n = prompt('Nazwa:', post.name); if (n) { post.name = n; touch(); this.panels(); } } }, { t: 'Zmień format…', i: '▭', fn: () => this.changeFormat() }, { t: 'Usuń projekt', i: '🗑', fn: () => { if (!confirm('Usunąć „' + post.name + '”?')) return; p.posts = p.posts.filter((x) => x !== post); p.curPost = p.posts[0] ? p.posts[0].id : null; touch(); this.show(); } }]) }, '⋯')),
      h('div', { class: 'fine', style: { marginTop: '6px' } }, FORMATS[post.fmt].n)));
    L.append(h('div', { class: 'ph' }, 'Slajdy (' + post.slides.length + ')', h('span', {}, h('button', { class: 'btn sm', title: 'Dodaj slajd z szablonu marki', onclick: (e) => popMenu(e.currentTarget, [...TPL_KINDS.map(([k, n]) => ({ t: n, i: '＋', fn: () => this.addSlide(k) })), '-', { t: 'Pusty slajd', i: '▢', fn: () => this.addSlide(null) }]) }, '＋'))));
    const films = h('div', { class: 'films' }); post.slides.forEach((s, i) => {
      const cv = thumb(s, 0, 190), f = h('div', { class: 'film' + (i === p.curSlide ? ' on' : ''), onclick: () => { p.curSlide = i; this.selId = null; this.panels(); this.stage.fit(); } }, cv, h('span', { class: 'n' }, i + 1)); f.dataset.i = i; films.append(f);
      f.draggable = true; f.ondragstart = (e) => e.dataTransfer.setData('text/plain', String(i)); f.ondragover = (e) => e.preventDefault(); f.ondrop = (e) => { e.preventDefault(); const from = +e.dataTransfer.getData('text/plain'); if (from !== i) { const [m] = post.slides.splice(from, 1); post.slides.splice(i, 0, m); p.curSlide = i; this.commit(); this.panels(); } };
    }); L.append(films, h('div', { class: 'sec' }, h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => this.dupSlide() }, 'Duplikuj'), h('button', { class: 'btn sm bad', onclick: () => this.delSlide() }, 'Usuń')), h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('Przeciągnij miniatury, aby zmienić kolejność slajdów.') })));
  },
  rightPanel() {
    const R = this.right, s = this.slide; R.innerHTML = ''; if (!s) return; const cb = (k) => { this.stage.render(); if (k === 'commit') this.commit(); };
    const list = h('div', { class: 'zebra' }); [...s.layers].reverse().forEach((l) => {
      const on = l.id === this.selId, ic = { text: 'T', image: '🖼', shape: '▭', video: '🎬', fx: '✦' }[l.type];
      list.append(h('div', { class: 'lyr' + (on ? ' on' : ''), onclick: () => { this.selId = l.id; this.panels(); this.stage.render(); } }, h('span', {}, ic), h('span', { class: 'nm' }, l.name), h('button', { title: l.hide ? 'Pokaż' : 'Ukryj', onclick: (e) => { e.stopPropagation(); l.hide = !l.hide; this.commit(); this.panels(); } }, l.hide ? '🚫' : '👁'), h('button', { title: l.lock ? 'Odblokuj' : 'Zablokuj', onclick: (e) => { e.stopPropagation(); l.lock = !l.lock; this.commit(); this.panels(); } }, l.lock ? '🔒' : '🔓')));
    });
    R.append(h('div', { class: 'ph' }, 'Warstwy', h('span', {}, ...[['⬆', 'Wyżej', 1], ['⬇', 'Niżej', -1]].map(([t, ti, d]) => h('button', { class: 'btn sm', title: ti, onclick: () => this.z(d) }, t)), h('button', { class: 'btn sm', title: 'Duplikuj warstwę (Ctrl+D)', onclick: () => this.dupLayer() }, '⧉'), h('button', { class: 'btn sm bad', title: 'Usuń warstwę (Delete)', onclick: () => this.delLayer() }, '🗑'))), list.childNodes.length ? list : h('div', { class: 'sec hint' }, 'Brak warstw. Dodaj tekst, kształt lub obraz.'));
    const l = this.sel;
    if (l) {
      if (l.type === 'image') R.append(h('div', { class: 'ph' }, 'Obraz — akcje'), h('div', { class: 'sec' }, rowOf(h('button', { class: 'btn', onclick: () => this.replaceImage() }, 'Zmień obraz'), h('button', { class: 'btn', title: 'Usuwa jednolite tło (np. białe) wypełnianiem od brzegów', onclick: () => this.removeBg() }, 'Usuń jednolite tło'))));
      R.append(...layerFields(l, cb));
    }
    const bg = s.bg; R.append(h('div', { class: 'ph' }, 'Tło slajdu'), h('div', { class: 'sec' }, fld({ k: 'type', t: 'seg', opts: [['color', 'Kolor'], ['grad', 'Gradient'], ['image', 'Obraz']] }, bg, (k) => { if (k === 'commit') { this.commit(); this.panels(); } this.stage.render(); }),
      fld({ k: 'c1', t: 'color', label: 'Kolor 1' }, bg, cb), bg.type === 'grad' ? [fld({ k: 'c2', t: 'color', label: 'Kolor 2' }, bg, cb), fld({ k: 'angle', t: 'num', label: 'Kąt °' }, bg, cb)] : null,
      bg.type === 'image' ? [h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => this.bgImage() }, 'Wybierz obraz tła'), h('button', { class: 'btn', onclick: () => this.aiImage(true) }, '🪄 AI')), fld({ k: 'dark', t: 'range', label: 'Przyciemnienie', min: 0, max: 0.9, step: 0.05 }, bg, cb)] : null,
      h('div', { class: 'row', style: { marginTop: '6px' } }, [['Marka: ciemne', 'dark'], ['jasne', 'light'], ['akcent', 'accent']].map(([t, v]) => h('button', { class: 'btn sm', onclick: () => { s.bg = jclone(themeFor(v).bg); this.commit(); this.panels(); this.stage.render(); } }, t)))));
  },
  // ── Operacje ──
  commit() { if (this.hist) this.hist.mark(); touch(); const i = P.cur.curSlide, f = $$('.film', this.left)[i]; if (f && this.slide) { const nc = thumb(this.slide, 0, 190); f.replaceChild(nc, f.firstChild); } this.rightPanelSoft(); },
  rightPanelSoft() { const a = document.activeElement; if (a && this.right.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return; this.rightPanel(); },
  undo() { if (this.hist && this.hist.undo()) { this.selId = null; this.panels(); this.stage.render(); touch(); } },
  redo() { if (this.hist && this.hist.redo()) { this.selId = null; this.panels(); this.stage.render(); touch(); } },
  add(l) { const s = this.slide; s.layers.push(l); this.selId = l.id; this.commit(); this.panels(); this.stage.render(); },
  addText() { const s = this.slide, b = P.cur.brand; const l = mkLayer('text', { x: s.w / 2, y: s.h / 2, w: s.w * 0.7 }); l.text.font = b.bodyFont; l.text.color = readable(s.bg.c1 || '#fff'); l.text.size = Math.round(s.w * 0.06); this.add(l); },
  addShape(kind) { const s = this.slide, l = mkLayer('shape', { x: s.w / 2, y: s.h / 2, w: kind === 'line' ? s.w * 0.4 : s.w * 0.3, h: kind === 'line' ? 12 : s.w * 0.3 }); l.shape.kind = kind; l.shape.fill = P.cur.brand.colors.accent; l.name = { rect: 'Prostokąt', ellipse: 'Elipsa', line: 'Pasek' }[kind]; this.add(l); },
  async addImageFile() { const fs = await pickFiles('image/*', true); for (const f of fs) { const id = await Assets.add(f, 'image'); this.addImageAsset(id); } },
  async addImageLib() { const a = await assetPicker(['image', 'ai', 'logo'], 'Wstaw obraz z biblioteki'); if (a) this.addImageAsset(a.id); },
  async addImageAsset(id) { const rec = await Assets.rec(id), s = this.slide, ar = (rec.w || 1) / (rec.h || 1), w = Math.min(s.w * 0.8, rec.w || 600), l = mkLayer('image', { x: s.w / 2, y: s.h / 2, w, h: w / ar }); l.img.assetId = id; l.name = rec.name.slice(0, 22); IMGS.set(id, await Assets.img(id)); this.add(l); },
  async replaceImage() { const l = this.sel; const fs = await pickFiles('image/*', false); if (!fs[0]) return; const id = await Assets.add(fs[0], 'image'); l.img.assetId = id; IMGS.set(id, await Assets.img(id)); this.commit(); this.stage.render(); },
  async bgImage() { const a = await assetPicker(['image', 'ai'], 'Obraz tła'); let id = a && a.id; if (!a) { const fs = await pickFiles('image/*'); if (!fs[0]) return; id = await Assets.add(fs[0], 'image'); } this.slide.bg.assetId = id; IMGS.set(id, await Assets.img(id)); this.commit(); this.stage.render(); },
  async removeBg() {
    const l = this.sel; try {
      const im = await Assets.img(l.img.assetId), c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, c.width, c.height), px = d.data, W = c.width, H = c.height;
      const corner = [0, (W - 1) * 4, (H - 1) * W * 4, ((H - 1) * W + W - 1) * 4].map((i) => [px[i], px[i + 1], px[i + 2]]), bg = corner.reduce((a, q) => [a[0] + q[0] / 4, a[1] + q[1] / 4, a[2] + q[2] / 4], [0, 0, 0]), tol = 46, seen = new Uint8Array(W * H), st = [];
      const near = (i) => Math.hypot(px[i * 4] - bg[0], px[i * 4 + 1] - bg[1], px[i * 4 + 2] - bg[2]) < tol; for (let i = 0; i < W; i++) { st.push(i, (H - 1) * W + i); } for (let j = 0; j < H; j++) { st.push(j * W, j * W + W - 1); }
      while (st.length) { const i = st.pop(); if (seen[i] || !near(i)) continue; seen[i] = 1; const xx = i % W, yy = (i / W) | 0; if (xx > 0) st.push(i - 1); if (xx < W - 1) st.push(i + 1); if (yy > 0) st.push(i - W); if (yy < H - 1) st.push(i + W); }
      let n = 0; for (let i = 0; i < W * H; i++) if (seen[i]) { px[i * 4 + 3] = 0; n++; } if (n < W * H * 0.01) { toast('Nie wykryłem jednolitego tła przy brzegach obrazu.', 'warn'); return; } x.putImageData(d, 0, 0);
      const blob = await new Promise((r) => c.toBlob(r, 'image/png')), id = await Assets.add(new File([blob], 'bez_tla.png', { type: 'image/png' }), 'image'); l.img.assetId = id; IMGS.set(id, await Assets.img(id)); this.commit(); this.stage.render(); toast('Usunięto tło (' + Math.round(n / (W * H) * 100) + '% obrazu).', 'ok');
    } catch (e) { toast('Nie udało się usunąć tła: ' + errText(e), 'bad'); }
  },
  addSlide(kind) { const p = this.post, i = p.slides.length; const s = kind ? makeScene(kind, Object.assign({}, TPL_SAMPLE[kind], { total: i + 1, idx: i }), p.fmt, i) : { w: FORMATS[p.fmt].w, h: FORMATS[p.fmt].h, bg: jclone(themeFor('light').bg), layers: [] }; s.id = uid('s'); p.slides.push(s); P.cur.curSlide = p.slides.length - 1; this.selId = null; this.commit(); this.panels(); this.stage.fit(); },
  dupSlide() { const p = this.post, c = jclone(this.slide); c.id = uid('s'); c.layers.forEach((l) => { l.id = uid('l'); }); p.slides.splice(P.cur.curSlide + 1, 0, c); P.cur.curSlide++; this.commit(); this.panels(); this.stage.fit(); },
  delSlide() { const p = this.post; if (p.slides.length < 2) { toast('Projekt musi mieć co najmniej jeden slajd.', 'warn'); return; } p.slides.splice(P.cur.curSlide, 1); P.cur.curSlide = clamp(P.cur.curSlide, 0, p.slides.length - 1); this.selId = null; this.commit(); this.panels(); this.stage.fit(); },
  changeFormat() { const p = this.post, sel = h('select', {}, Object.entries(FORMATS).map(([k, f]) => h('option', { value: k, selected: k === p.fmt }, f.n))); modal('Zmień format', h('div', {}, sel, h('p', { class: 'hint', html: rich('Warstwy zostaną przeskalowane proporcjonalnie i wyśrodkowane. (Sprawdź wynik po zmianie.)') })), [{ t: 'Zmień', cls: 'pri', fn: () => { const F = FORMATS[sel.value], o = FORMATS[p.fmt], k = Math.min(F.w / o.w, F.h / o.h), ox = (F.w - o.w * k) / 2, oy = (F.h - o.h * k) / 2; for (const s of p.slides) { for (const l of s.layers) { l.x = l.x * k + ox; l.y = l.y * k + oy; l.w *= k; l.h *= k; if (l.type === 'text') l.text.size = Math.round(l.text.size * k); } s.w = F.w; s.h = F.h; } p.fmt = sel.value; this.commit(); this.show(); } }, { t: 'Anuluj' }]); },
  z(d) { const s = this.slide, l = this.sel; if (!l) return; const i = s.layers.indexOf(l), j = clamp(i + d, 0, s.layers.length - 1); s.layers.splice(i, 1); s.layers.splice(j, 0, l); this.commit(); this.panels(); this.stage.render(); },
  dupLayer() { const l = this.sel; if (!l) return; const c = jclone(l); c.id = uid('l'); c.x += 30; c.y += 30; c.name += ' (kopia)'; this.slide.layers.push(c); this.selId = c.id; this.commit(); this.panels(); this.stage.render(); },
  delLayer() { const s = this.slide, l = this.sel; if (!l) return; s.layers = s.layers.filter((x) => x !== l); this.selId = null; this.commit(); this.panels(); this.stage.render(); },
  onKey(e) {
    const c = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (c && k === 'z') { e.preventDefault(); e.shiftKey ? this.redo() : this.undo(); return true; } if (c && k === 'y') { e.preventDefault(); this.redo(); return true; }
    if (c && k === 'd') { e.preventDefault(); this.dupLayer(); return true; } if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); this.delLayer(); return true; }
    if (c && k === 'c' && this.sel) { this.clip = jclone(this.sel); return true; } if (c && k === 'v' && this.clip) { const l = jclone(this.clip); l.id = uid('l'); l.x += 30; l.y += 30; this.slide.layers.push(l); this.selId = l.id; this.commit(); this.panels(); this.stage.render(); return true; }
    if (e.key === 'Escape') { this.selId = null; this.panels(); this.stage.render(); return true; } if (e.key === ']') { this.z(1); return true; } if (e.key === '[') { this.z(-1); return true; } return false;
  },
  // ── AI ──
  async aiCarousel() {
    const topic = h('textarea', { rows: 4, placeholder: 'np. „5 błędów, które sabotują regenerację po treningu”' }), n = h('input', { type: 'number', value: 7, min: 4, max: 10 }), fmt = h('select', {}, [['post45', 'Post 4:5'], ['square', 'Kwadrat 1:1']].map(([k, v]) => h('option', { value: k }, v)));
    modal('Karuzela z tematu (AI)', h('div', {}, h('div', { class: 'fld' }, h('label', {}, 'Temat / brief'), topic), h('div', { class: 'row' }, h('div', { class: 'fld' }, h('label', {}, 'Liczba slajdów'), n), h('div', { class: 'fld' }, h('label', {}, 'Format'), fmt)), h('p', { class: 'hint', html: rich('AI układa sekwencję: hook → treść → zakończenie z CTA. Każdy slajd zostaje w pełni edytowalny. (Model: Claude, a bez klucza Llama.)') })),
      [{ t: 'Generuj', cls: 'pri', keep: true, fn: async (close) => {
        if (!topic.value.trim()) { toast('Wpisz temat.', 'warn'); return false; } const pr = progressModal('Układam karuzelę'); pr.set(0.2, 'pisanie slajdów'); close();
        try {
          const N = clamp(+n.value || 7, 4, 10), sl = await AI.json('Jesteś copywriterem i strategiem treści dla polskiego trenera personalnego. Piszesz zwięźle i konkretnie, po polsku, bez waty. ' + BRAND_CTX(), `Temat: ${topic.value}\nZwróć tablicę JSON z dokładnie ${N} slajdami: [{"kind":"cover|point|list|quote|stat|steps|flow|chips|meter|recap|cta","title":"max 12 słów","text":"max 28 słów (opcjonalnie)","key":"wniosek, 1 zdanie (opcjonalnie)","items":["dla list/steps/chips/recap, max 5; w chips ~ na początku = przekreślone; w meter: etykieta|wartość|max|opis"],"nodes":["dla flow: dokładnie 4 węzły pętli"],"num":"dla stat"}]. Pierwszy = cover (mocny hook), ostatni = cta lub recap. ZRÓŻNICUJ rodzaje: liczby → stat/meter, kroki → steps, mechanizm → flow, lista → list/chips; nie rób samych point. Nie zmyślaj liczb ani badań.`, 3000);
          const arr = (Array.isArray(sl) ? sl : sl.slides || []).slice(0, N); if (!arr.length) throw new Error('Pusta odpowiedź');
          const slides = arr.map((c, i) => { const kind = TPL_KINDS.some((k) => k[0] === c.kind) ? c.kind : (i === 0 ? 'cover' : i === arr.length - 1 ? 'cta' : 'point'); const sc = makeScene(kind, Object.assign({}, c, { total: arr.length, idx: i, num: c.num != null ? c.num : i }), fmt.value, i); sc.id = uid('s'); return sc; });
          pr.close(); this.newPost(fmt.value, topic.value.slice(0, 28), slides); this.show(); toast('Gotowe: ' + slides.length + ' ' + plu(slides.length, 'slajd', 'slajdy', 'slajdów') + '. Edytuj każdy z osobna.', 'ok');
        } catch (e) { pr.close(); toast('Nie udało się wygenerować karuzeli: ' + errText(e), 'bad', 8000); }
      } }, { t: 'Anuluj' }]);
  },
  aiImage(asBg) {
    const prompt = h('textarea', { rows: 4, placeholder: 'np. „trener personalny w jasnej siłowni, naturalne światło, realistyczne zdjęcie”' }), tr = h('input', { type: 'checkbox', checked: true, style: { width: 'auto', flex: 'none' } }), size = h('select', {}, [['768x1024', 'Pion 3:4'], ['1024x1024', 'Kwadrat'], ['1024x768', 'Poziom 4:3'], ['576x1024', 'Pion 9:16']].map(([v, t]) => h('option', { value: v }, t))), n = h('select', {}, [1, 2, 3].map((v) => h('option', { value: v }, v + (v === 1 ? ' wariant' : ' warianty'))));
    const styles = ['realistyczne zdjęcie', 'studio, jasne tło', 'lifestyle, naturalne światło', 'minimalizm', 'ilustracja', 'kinowe światło']; const chosen = new Set(['realistyczne zdjęcie']); const chips = h('div', { class: 'chips' }, styles.map((s) => { const c = h('span', { class: 'chip' + (chosen.has(s) ? ' on' : ''), onclick: () => { chosen.has(s) ? chosen.delete(s) : chosen.add(s); c.classList.toggle('on'); } }, s); return c; }));
    const out = h('div', { class: 'cards', style: { marginTop: '10px' } }); const st = h('div', { class: 'hint' }, 'Sprawdzam dostępność generatora…'); AI.status().then((s) => { st.innerHTML = rich(s.img && s.img.flux ? 'Generator: FLUX (Workers AI), działa w chmurze bez dodatkowego klucza.' : 'Generator niedostępny: ' + (s.error || 'brak bindingu AI w Workerze')); });
    modal('Obraz AI', h('div', {}, st, h('div', { class: 'fld' }, h('label', {}, 'Opis obrazu'), prompt), h('label', { class: 'row', style: { gap: '6px', margin: '4px 0' } }, tr, h('span', { class: 'fine' }, 'Przetłumacz opis na angielski (lepsze wyniki)')), chips, h('div', { class: 'row', style: { marginTop: '8px' } }, h('div', { class: 'fld' }, h('label', {}, 'Proporcje'), size), h('div', { class: 'fld' }, h('label', {}, 'Warianty'), n)), out),
      [{ t: 'Generuj', cls: 'pri', keep: true, fn: async () => {
        if (!prompt.value.trim()) { toast('Wpisz opis obrazu.', 'warn'); return false; } out.innerHTML = ''; const [w, hh] = size.value.split('x').map(Number); let p = prompt.value.trim(); if (tr.checked) p = await AI.translate(p); p += ', ' + [...chosen].join(', ') + ', high quality, sharp focus';
        const tasks = Array.from({ length: +n.value }, (_, i) => (async () => { const ph = h('div', { class: 'card' }, h('div', { class: 'hint', style: { padding: '30px 6px', textAlign: 'center' } }, 'Generuję…')); out.append(ph); try { const blob = await AI.image(p, { w, h: hh, steps: 6, seed: Math.floor(Math.random() * 1e9) }), id = await Assets.add(new File([blob], 'ai_' + stamp() + '_' + (i + 1) + '.jpg', { type: blob.type }), 'ai'); ph.innerHTML = ''; ph.append(imgThumbEl(id), h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sm pri', onclick: async () => { if (asBg === true) { this.slide.bg = { type: 'image', assetId: id, c1: '#000', dark: 0.25 }; IMGS.set(id, await Assets.img(id)); this.commit(); this.panels(); this.stage.render(); } else this.addImageAsset(id); toast('Wstawiono', 'ok'); } }, asBg === true ? 'Jako tło' : 'Wstaw'))); } catch (e) { ph.innerHTML = ''; ph.append(h('div', { class: 'hint', style: { color: 'var(--bad)' } }, 'Błąd: ' + errText(e))); } })());
        await Promise.all(tasks); return false;
      } }, { t: 'Zamknij' }]);
  },
  // ── Eksport ──
  async renderBlob(sc, type, q) { await preloadScene(sc); const c = document.createElement('canvas'); c.width = sc.w; c.height = sc.h; const x = c.getContext('2d'); if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); } drawScene(x, sc, 0, {}); return new Promise((r, j) => c.toBlob((b) => (b ? r(b) : j(new Error('toBlob zwrócił null'))), type, q)); },
  async exportOne(fmt) { try { const b = await this.renderBlob(this.slide, fmt === 'jpg' ? 'image/jpeg' : 'image/png', 0.93); download(b, fname(slug(this.post.name) + '_slajd' + (P.cur.curSlide + 1), fmt)); } catch (e) { toast('Eksport nieudany: ' + errText(e), 'bad'); } },
  async exportAll() { const pr = progressModal('Eksport slajdów'); try { const files = [], p = this.post; for (let i = 0; i < p.slides.length; i++) { if (pr.cancel) break; pr.set(i / p.slides.length, 'slajd ' + (i + 1)); files.push({ name: `slajd_${String(i + 1).padStart(2, '0')}.png`, data: await this.renderBlob(p.slides[i], 'image/png') }); await tick(); } if (!pr.cancel) { download(await makeZip(files), fname(slug(p.name), 'zip')); toast('Zapisano ZIP z ' + files.length + ' slajdami', 'ok'); } } catch (e) { toast('Eksport nieudany: ' + errText(e), 'bad'); } pr.close(); },
  async useAsCover() { try { const b = await this.renderBlob(this.slide, 'image/png'), id = await Assets.add(new File([b], 'okladka.png', { type: 'image/png' }), 'image'); P.cur.publish.cover = id; touch(); toast('Ustawiono okładkę publikacji.', 'ok'); } catch (e) { toast(errText(e), 'bad'); } },
};
