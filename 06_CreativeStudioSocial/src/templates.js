/* Szablony generowane z marki: układ, motyw (jasny/ciemny/akcent/gradient), siła trzymania się identyfikacji */
const TPL_KINDS = [['cover', 'Okładka / hook'], ['point', 'Punkt z numerem'], ['list', 'Lista'], ['quote', 'Cytat'], ['stat', 'Liczba / statystyka'], ['photo', 'Zdjęcie + tytuł'], ['cta', 'Zakończenie (CTA)']];
const _mctx = document.createElement('canvas').getContext('2d');
function measureH(l) { if (l.type !== 'text') return l.h; const lay = layoutText(_mctx, l); return Math.max(l.text.size * l.text.lh, lay.h + 2 * lay.pad); }
function TXT(s, o) {
  const l = mkLayer('text', { x: o.x || 0, y: o.y || 0, w: o.w || 800 }); Object.assign(l.text, { s, font: o.font, size: Math.round(o.size), weight: o.weight || 700, color: o.color, align: o.align || 'center', lh: o.lh || 1.15, italic: !!o.italic, upper: !!o.upper, ls: o.ls || 0 });
  l.name = o.name || String(s).replace(/\n/g, ' ').slice(0, 22); if (o.op != null) l.op = o.op; if (o.bg) { l.text.bg = Object.assign(l.text.bg, o.bg, { on: true }); } return l;
}
function SHP(kind, o) { const l = mkLayer('shape', { x: o.x, y: o.y, w: o.w, h: o.h, name: o.name || 'Kształt' }); Object.assign(l.shape, { kind, fill: o.fill, fill2: o.fill2 || '', gAngle: o.gAngle == null ? 90 : o.gAngle, r: o.r || 0 }); if (o.op != null) l.op = o.op; return l; }
function stack(items, top, bottom, gap, valign) { // pionowy układ warstw w zakresie [top,bottom]
  const hs = items.map(measureH), tot = hs.reduce((a, b) => a + b, 0) + gap * (items.length - 1); let y = top + Math.max(0, (bottom - top - tot)) * (valign == null ? 0.5 : valign);
  items.forEach((l, i) => { l.y = y + hs[i] / 2; y += hs[i] + gap; }); return items;
}
function themeFor(variant) {
  const b = P.cur.brand, C = b.colors; const dk = (x) => lum(x) > 0.45 ? mix(x, '#000000', 0.62) : x;
  if (variant === 'dark') { const bg = dk(C.primary), fg = contrast(C.background, bg) >= 7 ? C.background : '#ffffff'; return { v: variant, bg: { type: 'color', c1: bg }, fg, ac: C.accent, mut: mix(fg, bg, 0.45), onAc: readable(C.accent), bgc: bg }; }
  if (variant === 'accent') { const bg = C.accent, fg = contrast(C.primary, bg) >= 4.5 ? C.primary : readable(bg); return { v: variant, bg: { type: 'color', c1: bg }, fg, ac: contrast(C.primary, bg) >= 3 ? C.primary : readable(bg), mut: mix(fg, bg, 0.4), onAc: readable(C.primary), bgc: bg }; }
  if (variant === 'grad') { const c1 = dk(C.primary), c2 = mix(c1, C.accent, 0.55), fg = readable(c1); return { v: variant, bg: { type: 'grad', c1, c2, angle: 135 }, fg, ac: C.accent, mut: mix(fg, c1, 0.4), onAc: readable(C.accent), bgc: c1 }; }
  const bg = C.background, fg = contrast(C.primary, bg) >= 4.5 ? C.primary : readable(bg); return { v: 'light', bg: { type: 'color', c1: bg }, fg, ac: contrast(C.accent, bg) >= 2.2 ? C.accent : mix(C.accent, '#000000', 0.25), mut: mix(fg, bg, 0.5), onAc: readable(C.accent), bgc: bg };
}
function pickVariant(kind, seq) {
  const b = P.cur.brand, strict = b.strictness == null ? 80 : b.strictness, base = { cover: 'dark', point: 'light', list: 'light', quote: 'accent', stat: 'dark', photo: 'dark', cta: 'accent' }[kind] || 'light';
  if (strict >= 55) return base; const pool = ['light', 'dark', 'accent', 'grad']; return pool[(seq * 7 + kind.length) % pool.length]; // luźniejsza identyfikacja: więcej wariantów
}
function makeScene(kind, c, fmt, seq) {
  const b = P.cur.brand, F = FORMATS[fmt] || FORMATS.post45, W = F.w, H = F.h, u = W / 1080, tall = H / W > 1.5; seq = seq || 0; c = c || {};
  const th = themeFor(c.theme || pickVariant(kind, seq)), strict = b.strictness == null ? 80 : b.strictness, loose = strict < 40;
  const hf = loose && seq % 3 === 1 ? b.bodyFont : b.headingFont, bf = b.bodyFont, m = 96 * u, top = tall ? SAFE.top + 30 : 96 * u, bot = tall ? H - SAFE.bottom - 10 : H - 110 * u, cw = W - 2 * m;
  const sc = { w: W, h: H, bg: jclone(th.bg), layers: [] }; const L = sc.layers, cx = W / 2, handle = c.handle != null ? c.handle : b.handle;
  const foot = () => { if (handle) L.push(TXT(handle, { x: m + 190 * u, y: bot + (tall ? 8 : 24) * u, w: 380 * u, size: 32 * u, font: bf, weight: 500, color: th.mut, align: 'left', name: 'Uchwyt konta' })); if (c.total > 1 && c.idx != null) L.push(TXT(`${c.idx + 1} / ${c.total}`, { x: W - m - 100 * u, y: bot + (tall ? 8 : 24) * u, w: 200 * u, size: 32 * u, font: bf, weight: 600, color: th.mut, align: 'right', name: 'Numer slajdu' })); };
  const logo = () => { if (b.logos && b.logos[0]) { const lg = mkLayer('image', { x: m + 70 * u, y: top - 20 * u, w: 140 * u, h: 70 * u, name: 'Logo' }); lg.img.assetId = b.logos[0]; lg.img.fit = 'contain'; L.push(lg); } };
  const decor = () => { if (!loose) return null; const k = (seq + kind.length) % 3; if (k === 0) return SHP('ellipse', { x: W - 80 * u, y: 120 * u, w: 420 * u, h: 420 * u, fill: th.ac, op: 0.16, name: 'Dekor koło' }); if (k === 1) return SHP('rect', { x: W / 2, y: H - 30 * u, w: W, h: 60 * u, fill: th.ac, op: 0.9, name: 'Dekor pas' }); return SHP('ellipse', { x: 60 * u, y: H - 120 * u, w: 360 * u, h: 360 * u, fill: th.ac, op: 0.14, name: 'Dekor koło' }); };
  if (c.assetId && (kind === 'cover' || kind === 'photo')) { sc.bg = { type: 'image', assetId: c.assetId, c1: '#000', dark: kind === 'cover' ? 0.5 : 0.1 }; th.fg = '#ffffff'; th.mut = '#e5e5e5'; }
  const d = decor(); if (d) L.push(d);
  const fit = (s, big, mid, small) => { const n = String(s).length; return n > 70 ? small : n > 38 ? mid : big; };
  if (kind === 'cover') {
    const items = [SHP('rect', { x: 0, y: 0, w: 130 * u, h: 12 * u, fill: th.ac, name: 'Akcent' }), TXT(c.title || 'Tytuł, który zatrzymuje kciuk', { w: cw, size: fit(c.title || '', 124 * u, 100 * u, 80 * u), font: hf, weight: 800, color: th.fg, align: 'left', lh: 1.08, name: 'Tytuł' })];
    if (c.text) items.push(TXT(c.text, { w: cw, size: 46 * u, font: bf, weight: 400, color: th.mut, align: 'left', lh: 1.3, name: 'Podtytuł' }));
    items[0].x = m + 65 * u; items.slice(1).forEach((l) => { l.x = m + cw / 2; }); stack(items, top + 60 * u, bot - 40 * u, 44 * u, 0.55); L.push(...items);
    if (c.total > 1) L.push(TXT('Przesuń →', { x: W - m - 130 * u, y: bot - 70 * u, w: 300 * u, size: 38 * u, font: bf, weight: 700, color: th.ac, align: 'right', name: 'Przesuń' })); logo(); foot();
  } else if (kind === 'point') {
    const num = TXT(String(c.num != null ? c.num : (c.idx || 0)).padStart(2, '0'), { w: 500 * u, size: 230 * u, font: hf, weight: 800, color: th.ac, align: 'left', lh: 1, name: 'Numer' }), title = TXT(c.title || 'Najważniejsza myśl', { w: cw, size: fit(c.title || '', 76 * u, 64 * u, 54 * u), font: hf, weight: 700, color: th.fg, align: 'left', lh: 1.12, name: 'Tytuł' }), bar = SHP('rect', { w: 110 * u, h: 8 * u, fill: th.ac, x: 0, y: 0, name: 'Akcent' }), body = TXT(c.text || 'Rozwiń myśl w dwóch, trzech zdaniach. Konkretnie, bez waty.', { w: cw, size: 44 * u, font: bf, weight: 400, color: th.fg, align: 'left', lh: 1.4, name: 'Treść' });
    num.x = m + cw / 2; title.x = m + cw / 2; body.x = m + cw / 2; bar.x = m + 55 * u; stack([num, title, bar, body], top, bot - 30 * u, 34 * u, 0.12); L.push(num, title, bar, body); foot();
  } else if (kind === 'list') {
    const its = (c.items && c.items.length ? c.items : ['Pierwszy punkt', 'Drugi punkt', 'Trzeci punkt']).slice(0, 6), title = TXT(c.title || 'Lista', { w: cw, size: fit(c.title || '', 76 * u, 64 * u, 54 * u), font: hf, weight: 800, color: th.fg, align: 'left', lh: 1.1, x: m + cw / 2, name: 'Tytuł' }); const hT = measureH(title);
    const avail = bot - top - hT - 80 * u, row = Math.min(150 * u, avail / its.length); title.y = top + hT / 2; L.push(title);
    its.forEach((s, i) => { const y = top + hT + 70 * u + row * i + row / 2; L.push(SHP('ellipse', { x: m + 34 * u, y, w: 62 * u, h: 62 * u, fill: th.ac, name: 'Punkt ' + (i + 1) }), TXT(String(i + 1), { x: m + 34 * u, y, w: 62 * u, size: 32 * u, font: hf, weight: 800, color: th.onAc, name: 'Nr ' + (i + 1) }), TXT(s, { x: m + 70 * u + (cw - 70 * u) / 2, y, w: cw - 70 * u, size: 42 * u, font: bf, weight: 500, color: th.fg, align: 'left', lh: 1.25, name: 'Pozycja ' + (i + 1) })); }); foot();
  } else if (kind === 'quote') {
    const q = TXT('„', { x: m + 120 * u, y: top + 150 * u, w: 400 * u, size: 520 * u, font: hf, weight: 800, color: th.fg, op: 0.2, align: 'left', lh: 1, name: 'Cudzysłów' }), t = TXT(c.title || 'Cytat, który warto zapamiętać.', { x: cx, w: cw, size: fit(c.title || '', 70 * u, 58 * u, 48 * u), font: hf, weight: 600, italic: true, color: th.fg, align: 'center', lh: 1.25, name: 'Cytat' }), items = [t];
    if (c.author) items.push(TXT('— ' + c.author, { x: cx, w: cw, size: 38 * u, font: bf, weight: 600, color: th.mut, name: 'Autor' })); stack(items, top + 40 * u, bot - 30 * u, 46 * u, 0.5); L.push(q, ...items); foot();
  } else if (kind === 'stat') {
    const n = TXT(String(c.num != null ? c.num : '73%'), { x: cx, w: cw, size: 300 * u, font: hf, weight: 800, color: th.ac, name: 'Liczba' }), items = [n, TXT(c.title || 'Co oznacza ta liczba', { x: cx, w: cw, size: 58 * u, font: hf, weight: 700, color: th.fg, name: 'Opis' })];
    if (c.text) items.push(TXT(c.text, { x: cx, w: cw, size: 38 * u, font: bf, weight: 400, color: th.mut, lh: 1.35, name: 'Źródło / komentarz' })); stack(items, top, bot - 20 * u, 36 * u, 0.5); L.push(...items); foot();
  } else if (kind === 'photo') {
    const g = SHP('rect', { x: cx, y: H * 0.72, w: W, h: H * 0.56, fill: '#00000000', fill2: '#000000dd', gAngle: 90, name: 'Przyciemnienie' }); const t = TXT(c.title || 'Tytuł na zdjęciu', { x: cx, w: cw, size: fit(c.title || '', 92 * u, 76 * u, 60 * u), font: hf, weight: 800, color: '#ffffff', align: 'left', lh: 1.1, name: 'Tytuł' }); t.x = m + cw / 2;
    if (!c.assetId) { sc.bg = { type: 'grad', c1: th.bgc, c2: mix(th.bgc, th.ac, 0.5), angle: 135 }; }
    const items = [t]; if (c.text) { const s = TXT(c.text, { x: m + cw / 2, w: cw, size: 40 * u, font: bf, weight: 400, color: '#f0f0f0', align: 'left', lh: 1.3, name: 'Podpis' }); items.push(s); } stack(items, H * 0.55, bot - 10 * u, 28 * u, 1); L.push(g, ...items); foot();
  } else { // cta
    const t = TXT(c.title || 'Zapisz ten post i wróć do niego', { x: cx, w: cw, size: fit(c.title || '', 100 * u, 82 * u, 64 * u), font: hf, weight: 800, color: th.fg, lh: 1.1, name: 'Wezwanie' }), s = c.text ? TXT(c.text, { x: cx, w: cw, size: 44 * u, font: bf, weight: 400, color: th.mut, lh: 1.35, name: 'Dopisek' }) : null;
    const btn = SHP('rect', { x: cx, y: 0, w: 640 * u, h: 120 * u, r: 60 * u, fill: th.fg === '#ffffff' || lum(th.fg) > 0.5 ? th.ac : th.fg, name: 'Przycisk' }), bt = TXT(c.cta || 'Obserwuj po więcej', { x: cx, y: 0, w: 600 * u, size: 44 * u, font: bf, weight: 800, color: readable(th.fg === '#ffffff' || lum(th.fg) > 0.5 ? th.ac : th.fg), name: 'Tekst przycisku' });
    const items = [t]; if (s) items.push(s); items.push(btn); stack(items, top, bot - 40 * u, 54 * u, 0.5); bt.y = btn.y; L.push(...items, bt); foot();
  }
  return sc;
}
// przykładowa treść do podglądu szablonów
const TPL_SAMPLE = { cover: { title: 'Jak odzyskać energię w 7 dni', text: 'Prosty plan, który działa', total: 6, idx: 0 }, point: { title: 'Zacznij od snu', text: 'Stała pora wstawania poprawia regenerację bardziej niż kolejny suplement.', num: 1, total: 6, idx: 1 }, list: { title: '3 nawyki na dziś', items: ['Szklanka wody po przebudzeniu', '10 minut spaceru', 'Ostatni posiłek 3 h przed snem'], total: 6, idx: 2 }, quote: { title: 'Konsekwencja bije motywację.', author: 'Michał', total: 6, idx: 3 }, stat: { num: '73%', title: 'osób rezygnuje po 3 tygodniach', text: 'dlatego plan musi być prosty', total: 6, idx: 4 }, photo: { title: 'Trening zaczyna się w głowie', text: 'Zdjęcie dodasz w edytorze', total: 6, idx: 5 }, cta: { title: 'Zapisz ten post', text: 'Przyda się, gdy zabraknie motywacji', cta: 'Obserwuj po więcej', total: 6, idx: 5 } };

// ── Sceny wideo: szablon → warstwy osi czasu (z animacjami) ──
function bgToLayer(bg, W, H, t0, t1) {
  let l; if (bg.type === 'image') { l = mkLayer('image', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło (obraz)' }); l.img.assetId = bg.assetId; l.img.fit = 'cover'; l.anim.loop = { p: 'kenburns', amp: 1, spd: 1 }; }
  else if (bg.type === 'grad' || bg.type === 'agrad') { l = mkLayer('shape', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło (gradient)' }); l.shape.fill = bg.c1; l.shape.fill2 = bg.c2; l.shape.gAngle = bg.angle || 90; }
  else { l = mkLayer('shape', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło' }); l.shape.fill = bg.c1; }
  l.track = 'bg'; l.t0 = t0; l.t1 = t1; return l;
}
function animateLayers(layers, style, dur) {
  let i = 0;
  for (const l of layers) {
    if (l.track === 'bg') continue; const a = l.anim; i++; const dl = Math.min(0.12 * i, dur * 0.35);
    if (style === 'calm') a.in = { p: l.type === 'text' ? 'rise' : 'fade', d: 0.8, dl, e: 'outCubic', dir: 'bottom' };
    else if (style === 'punchy') a.in = { p: l.type === 'shape' ? 'reveal' : (l.type === 'text' && /Tytu|Wezw|Liczba|Cytat/.test(l.name) ? 'pop' : 'slide'), d: 0.55, dl, e: 'outBack', dir: i % 2 ? 'left' : 'right' };
    else a.in = { p: l.type === 'text' ? (/Tytu|Wezw|Cytat|Opis/.test(l.name) ? 'words' : 'rise') : l.type === 'shape' ? 'reveal' : 'zoom', d: l.type === 'text' ? 0.9 : 0.6, dl, e: 'outCubic', dir: 'left' };
    a.out = { p: 'fade', d: 0.3, dl: 0, e: 'inCubic', dir: 'bottom' };
  }
  return layers;
}
function sceneToReel(kind, c, t0, dur, style, seq) { // zwraca warstwy z przesuniętym czasem
  const sc = makeScene(kind, Object.assign({}, c, { total: 0, idx: null }), 'story', seq), t1 = t0 + dur, out = [];
  out.push(bgToLayer(sc.bg, sc.w, sc.h, t0, t1)); for (const l of sc.layers) { l.t0 = t0; l.t1 = t1; out.push(l); }
  animateLayers(out, style || 'dynamic', dur); return out;
}
