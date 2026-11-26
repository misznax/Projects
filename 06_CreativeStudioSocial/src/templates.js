/* Szablony w stylu marki (Śmiało): ciemne tło z poświatą, gradient pomarańcz → żółć, szkło, pasek postępu, pigułki, diagramy.
   Wygląd steruje DNA (brand.dna, uczone z karuzel w zakładce „Pomysły”) + paleta (palOf). Tekst: *gradient*, ~fiolet~, **pogrubienie**. */
const TPL_KINDS = [['cover', 'Okładka / hook'], ['point', 'Punkt (tekst + wniosek)'], ['list', 'Lista numerowana'], ['quote', 'Cytat'], ['stat', 'Liczba / statystyka'], ['photo', 'Zdjęcie + tytuł'], ['steps', 'Stopnie (słupki)'], ['flow', 'Schemat / pętla'], ['chips', 'Lista rośnie (chipy)'], ['meter', 'Przed / po (paski)'], ['recap', 'Podsumowanie'], ['cta', 'Zakończenie (CTA)']];
const DNA_DEFAULT = { glows: [{ x: 1.02, y: -0.02, r: 0.95, c: 'v', a: 0.5 }, { x: -0.05, y: 1.05, r: 0.85, c: 'a', a: 0.34 }], grid: 0.035, grain: 0.05, progress: true, caps: true, italic: true, titleW: 800, glass: true, handle: true };
const _mctx = document.createElement('canvas').getContext('2d');
const A = (hex, a) => hex + Math.round(clamp(a, 0, 1) * 255).toString(16).padStart(2, '0');
let _hl = { g: [[0, '#FF5A00'], [0.35, '#FF5A00'], [0.675, '#FFA000'], [1, '#FFE600']], v: '#8B6CFF' };
function measureH(l) { if (l.type !== 'text') return l.h; const lay = layoutText(_mctx, l); return Math.max(l.text.size * l.text.lh, lay.h + 2 * lay.pad); }
function measureW(s, o) { _mctx.save(); _mctx.font = `${o.italic ? 'italic ' : ''}${o.weight || 400} ${o.size}px "${o.font}", sans-serif`; if ('letterSpacing' in _mctx) _mctx.letterSpacing = (o.ls || 0) + 'px'; const w = _mctx.measureText(s).width; _mctx.restore(); return w; }
function TXT(s, o) {
  const l = mkLayer('text', { x: o.x || 0, y: o.y || 0, w: o.w || 800 }); Object.assign(l.text, { s, font: o.font, size: Math.round(o.size), weight: o.weight || 700, color: o.color, align: o.align || 'center', lh: o.lh || 1.15, italic: !!o.italic, upper: !!o.upper, ls: o.ls || 0, hl: jclone(o.hl || _hl) });
  if (o.allg) l.text.allg = true; if (o.glow) l.text.shadow = { on: true, x: 0, y: 0, b: o.glow.b, c: o.glow.c };
  l.name = o.name || String(s).replace(/[\n*~]/g, ' ').trim().slice(0, 22); if (o.op != null) l.op = o.op; if (o.bg) { l.text.bg = Object.assign(l.text.bg, o.bg, { on: true }); } return l;
}
function SHP(kind, o) {
  const l = mkLayer('shape', { x: o.x, y: o.y, w: o.w, h: o.h, name: o.name || 'Kształt' }); Object.assign(l.shape, { kind, fill: o.fill || '#ffffff', fill2: o.fill2 || '', gAngle: o.gAngle == null ? 90 : o.gAngle, r: o.r || 0 });
  for (const k of ['stops', 'grad', 'glass']) if (o[k] != null) l.shape[k] = o[k]; if (o.stroke) l.shape.stroke = o.stroke; if (o.shadow) l.shape.shadow = Object.assign({ on: true, x: 0, y: 0 }, o.shadow);
  if (o.op != null) l.op = o.op; if (o.rot) l.rot = o.rot; return l;
}
function stack(items, top, bottom, gap, valign) { // pionowy układ warstw w zakresie [top,bottom]
  const hs = items.map(measureH), tot = hs.reduce((a, b) => a + b, 0) + gap * (items.length - 1); let y = top + Math.max(0, (bottom - top - tot)) * (valign == null ? 0.5 : valign);
  items.forEach((l, i) => { l.y = y + hs[i] / 2; y += hs[i] + gap; }); return items;
}
// Tło „poświata” z palety i DNA (v = wariant układu plam: 0 bazowy, 1 odbicie, 2 z siatką)
function glowBg(pal, dna, v, strong) {
  const col = (k) => pal[k] || k, k = strong ? 1.3 : 1, mir = !!dna.mirror && v % 3 === 1;
  const gl = (dna.glows && dna.glows.length ? dna.glows : DNA_DEFAULT.glows).map((g) => ({ x: mir ? 1 - g.x : g.x, y: g.y, r: g.r, c: col(g.c), a: Math.min(0.92, g.a * k) }));
  return { type: 'glow', c1: pal.bg, glows: gl, grid: v % 3 === 2 ? (dna.grid || 0.035) : 0, grain: dna.grain == null ? 0.05 : dna.grain };
}
function themeFor(variant, seq) {
  const b = P.cur.brand, pal = palOf(b), dna = Object.assign({}, DNA_DEFAULT, b.dna || {}), hlG = { g: gradStops(pal), v: pal.v }, v = seq || 0;
  if (variant === 'accent') return { v: 'accent', bg: { type: 'grad', c1: pal.a, c2: pal.b, angle: 20 }, fg: pal.on, ac: pal.on, mut: mix(pal.on, pal.a, 0.3), vi: pal.on, onAc: pal.b, bgc: pal.a, pal, dna, hl: { g: [[0, pal.on], [1, pal.on]], v: pal.on } };
  if (variant === 'light') { const ac = mix(pal.a, '#000000', 0.12); return { v: 'light', bg: { type: 'color', c1: '#F4F1EC' }, fg: '#0B1014', ac, mut: '#5B646E', vi: '#6A4CE0', onAc: pal.on, bgc: '#F4F1EC', pal, dna, hl: { g: [[0, ac], [1, pal.m]], v: '#6A4CE0' }, light: true }; }
  const strong = variant === 'grad'; return { v: variant === 'grad' ? 'grad' : 'dark', bg: glowBg(pal, dna, v, strong), fg: pal.ink, ac: pal.a, mut: pal.mut, vi: pal.v, onAc: pal.on, bgc: pal.bg, pal, dna, hl: hlG };
}
function pickVariant(kind, seq) {
  const b = P.cur.brand, strict = b.strictness == null ? 80 : b.strictness; if (strict >= 55) return 'dark'; const pool = ['dark', 'grad', 'accent', 'light']; return pool[(seq * 7 + kind.length) % pool.length]; // luźniejsza identyfikacja: więcej wariantów
}
// Automatyczne wyróżnienie końcówki tytułu gradientem (gdy autor nie wstawił znaczników)
function autoHL(s) {
  s = String(s || ''); if (/[*~]/.test(s)) return s; const lines = s.split('\n'), last = lines.pop().trim().split(/\s+/).filter(Boolean), n = last.length; if (n < 2) return s; const k = n <= 3 ? 1 : n <= 5 ? 2 : 3, a = last.slice(0, n - k).join(' '), g = last.slice(n - k).join(' ');
  return [...lines, (a ? a + ' ' : '') + '*' + g + '*'].join('\n');
}
function makeScene(kind, c, fmt, seq) {
  const b = P.cur.brand, F = FORMATS[fmt] || FORMATS.post45, W = F.w, H = F.h, land = W / H > 1.4, u = land ? H / 1350 : W / 1080, tall = H / W > 1.5; seq = seq || 0; c = c || {};
  const th = themeFor(c.theme || pickVariant(kind, seq), seq), pal = th.pal, dna = th.dna, strict = b.strictness == null ? 80 : b.strictness, loose = strict < 40; _hl = th.hl;
  const hf = loose && seq % 3 === 1 ? b.bodyFont : b.headingFont, bf = b.bodyFont, m = (land ? 110 : 90) * u, cw = Math.min(W - 2 * m, (land ? 1180 : 960) * u), cx = m + cw / 2, handle = c.handle != null ? c.handle : b.handle;
  const top = tall ? SAFE.top : 150 * u, bot = tall ? H - SAFE.bottom : H - 200 * u, footY = H - 105 * u, glass = dna.glass !== false;
  const sc = { w: W, h: H, bg: jclone(th.bg), layers: [] }, L = sc.layers, post = !tall && c.nofoot !== true;
  const T = (s, o) => TXT(s, Object.assign({ x: cx, w: cw, font: bf, align: 'left', color: th.fg }, o));
  const title = (s, o) => { const t = String(s || ''), n = t.replace(/[*~]/g, '').length, size = n <= 14 ? 150 : n <= 26 ? 128 : n <= 42 ? 110 : n <= 70 ? 94 : 80; return T(th.v === 'accent' ? t : autoHL(t), Object.assign({ size: size * u, font: hf, weight: dna.titleW || 800, italic: dna.italic !== false, upper: dna.caps !== false, lh: 1.04, name: 'Tytuł' }, o)); };
  const body = (s, o) => T(s, Object.assign({ size: 42 * u, weight: 400, lh: 1.38, name: 'Treść' }, o));
  const key = (s, o) => T(s, Object.assign({ size: 42 * u, weight: 500, lh: 1.38, color: th.vi, name: 'Wniosek' }, o));
  const note = (s, o) => T(s, Object.assign({ size: 28 * u, weight: 400, lh: 1.35, color: th.mut, name: 'Notka' }, o));
  const grad = (o) => Object.assign({ stops: gradStops(pal), gAngle: 0 }, o); const dkGrad = th.v === 'accent' || th.light;
  const gcard = (x, y, w, h, o) => SHP('rect', Object.assign({ x, y, w, h, r: 34 * u, fill: A(th.light ? '#000000' : '#FFFFFF', 0.05), glass: glass && !th.light, stroke: { w: 2 * u, c: A(th.light ? '#000000' : '#FFFFFF', 0.12) }, name: 'Karta (szkło)' }, o));
  const arrow = (x1, y1, x2, y2, o) => { o = o || {}; const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI, hs = 30 * u, ux = dx / len, uy = dy / len, col = o.c || th.ac, mid = len - hs;
    return [SHP('rect', { x: x1 + ux * mid / 2, y: y1 + uy * mid / 2, w: mid + 2 * u, h: 5 * u, r: 2.5 * u, fill: col, rot: ang, name: 'Strzałka' }), SHP('tri', { x: x2 - ux * hs / 2, y: y2 - uy * hs / 2, w: hs, h: hs * 0.95, fill: col, rot: ang, name: 'Grot' })]; };
  const pill = (txt, x, y) => { const size = 24 * u, ls = 3.2 * u, tw = measureW(String(txt).toUpperCase(), { font: bf, size, weight: 600, ls }), pw = tw + 48 * u, ph = 58 * u;
    return [SHP('rect', { x: x + pw / 2, y, w: pw, h: ph, r: ph / 2, fill: A(th.ac, 0.1), stroke: { w: 2 * u, c: A(th.ac, 0.7) }, name: 'Pigułka' }), TXT(txt, { x: x + pw / 2, y, w: pw + 20 * u, size, font: bf, weight: 600, color: th.ac, upper: true, ls, name: 'Etykieta' })]; };
  const tagItems = () => (c.tag ? pill(c.tag, m, top - (tall ? 0 : 0) + 20 * u) : []);
  const progress = () => { if (dna.progress === false || !(c.total > 1) || c.idx == null || tall) return; const n = Math.min(c.total, 12), gap = 10 * u, w = (cw - gap * (n - 1)) / n, on = Math.floor(c.idx * n / c.total);
    for (let i = 0; i < n; i++) L.push(i <= on ? SHP('rect', grad({ x: m + w / 2 + i * (w + gap), y: 92 * u, w, h: 9 * u, r: 4.5 * u, shadow: { c: A(pal.a, 0.6), b: 16 * u }, name: 'Postęp ' + (i + 1) })) : SHP('rect', { x: m + w / 2 + i * (w + gap), y: 92 * u, w, h: 9 * u, r: 4.5 * u, fill: A(th.light ? '#000000' : '#FFFFFF', 0.14), name: 'Postęp ' + (i + 1) })); };
  const foot = () => { if (!post) return; const lgY = footY;
    if (b.logos && b.logos[0]) { const lg = mkLayer('image', { x: m + 33 * u, y: lgY, w: 66 * u, h: 66 * u, name: 'Logo' }); lg.img.assetId = b.logos[0]; lg.img.fit = 'contain'; L.push(lg); }
    const mid = c.foot != null ? c.foot : kind === 'cta' && b.site ? b.site : (c.total > 1 && c.idx != null ? `${c.idx + 1} / ${c.total}` : ''); if (mid) L.push(TXT(mid, { x: W / 2 - 10 * u, y: lgY, w: 420 * u, size: 28 * u, font: bf, weight: 500, color: th.mut, name: 'Numer slajdu' }));
    if (handle) L.push(TXT(handle, { x: W - m - 200 * u, y: lgY, w: 400 * u, size: 28 * u, font: bf, weight: 500, color: th.mut, align: 'right', name: 'Uchwyt konta' })); };
  const photoTop = () => { // zdjęcie u góry z wtopieniem w tło (jak okładka karuzeli)
    const ph = H * 0.66, im = mkLayer('image', { x: W / 2, y: ph / 2, w: W, h: ph, name: 'Zdjęcie' }); im.img.assetId = c.assetId; im.img.fit = 'cover'; im.img.b = 0.85;
    L.push(im, SHP('rect', { x: W / 2, y: ph - H * 0.17, w: W, h: H * 0.34, fill: A(pal.bg, 0), fill2: pal.bg, gAngle: 90, name: 'Wtopienie' })); };
  const sw = (hot) => ({ stops: hot ? gradStops(pal) : null, fill: hot ? pal.a : A('#FFFFFF', 0.06) });
  let items;
  progress();
  if (kind === 'cover') {
    if (c.assetId) photoTop();
    items = [title(c.title || 'Tytuł, który zatrzymuje kciuk')]; if (c.text) items.push(body(c.text, { size: 46 * u, color: th.fg }));
    L.push(...tagItems()); stack(items, top + (c.tag ? 70 * u : 0), bot, 40 * u, c.assetId ? 1 : 0.58); L.push(...items);
    if (c.total > 1 && !tall) L.push(...arrow(W - m - 150 * u, bot + 8 * u, W - m - 20 * u, bot + 8 * u, { c: th.ac }), TXT('Przesuń', { x: W - m - 300 * u, y: bot + 8 * u, w: 200 * u, size: 30 * u, font: bf, weight: 600, color: th.ac, align: 'right', name: 'Przesuń' }));
    foot();
  } else if (kind === 'point') {
    items = [title(c.title || 'Najważniejsza myśl')]; items[0].text.size = Math.round((String(c.title || '').length > 40 ? 84 : 104) * u);
    if (c.text) items.push(body(c.text)); if (c.key) items.push(key(c.key)); if (c.note) items.push(note(c.note, { name: 'Źródło' }));
    L.push(...tagItems()); stack(items, top + (c.tag ? 70 * u : 0), bot, 38 * u, tall ? 0.4 : 0.06); L.push(...items); foot();
  } else if (kind === 'list') {
    const its = (c.items && c.items.length ? c.items : ['Pierwszy punkt', 'Drugi punkt', 'Trzeci punkt']).slice(0, 6), t = title(c.title || 'Lista'); t.text.size = Math.round(100 * u); const hT = measureH(t); t.y = top + hT / 2; L.push(...tagItems(), t); let y = top + hT + 56 * u;
    its.forEach((s, i) => { const tx = T(s, { x: m + 100 * u + (cw - 100 * u) / 2, w: cw - 100 * u, size: 40 * u, weight: 500, lh: 1.3, name: 'Pozycja ' + (i + 1) }), h = measureH(tx);
      L.push(TXT(String(i + 1), { x: m + 45 * u, y: y + 30 * u, w: 90 * u, size: 66 * u, font: hf, weight: 800, italic: true, allg: true, align: 'left', lh: 1, name: 'Nr ' + (i + 1) })); tx.y = y + Math.max(h, 60 * u) / 2; tx.x = m + 100 * u + (cw - 100 * u) / 2; L.push(tx); y += Math.max(h, 60 * u) + 34 * u; });
    if (c.key) { const k = key(c.key); stack([k], y + 10 * u, bot, 0, 0); L.push(k); } foot();
  } else if (kind === 'quote') {
    const q = T('„', { size: 300 * u, font: hf, weight: 900, italic: true, allg: true, op: 0.9, lh: 1, w: 300 * u, x: m + 150 * u, y: top + 90 * u, name: 'Cudzysłów' }), t = T(c.title || 'Cytat, który warto zapamiętać.', { size: (String(c.title || '').length > 90 ? 70 : 88) * u, font: hf, weight: 800, italic: true, lh: 1.08, name: 'Cytat' }); items = [t];
    if (c.author) items.push(T('— ' + c.author, { size: 38 * u, weight: 600, color: th.vi, name: 'Autor' })); stack(items, top + 300 * u, bot, 44 * u, 0.1); L.push(q, ...items); foot();
  } else if (kind === 'stat') {
    const n = T(String(c.num != null ? c.num : '73%'), { size: 330 * u, font: hf, weight: 900, italic: true, allg: true, lh: 1, glow: { b: 70 * u, c: A(pal.a, 0.45) }, name: 'Liczba' }); items = [n, title(c.title || 'Co oznacza ta liczba', { size: 80 * u })];
    if (c.text) items.push(body(c.text, { color: th.mut, name: 'Komentarz' })); L.push(...tagItems()); stack(items, top + (c.tag ? 70 * u : 0), bot, 30 * u, 0.4); L.push(...items); foot();
  } else if (kind === 'photo') {
    if (c.assetId) sc.bg = { type: 'image', assetId: c.assetId, c1: '#000', dark: 0.12 }; const g = SHP('rect', { x: W / 2, y: H * 0.74, w: W, h: H * 0.52, fill: A(pal.bg, 0), fill2: A(pal.bg, 0.94), gAngle: 90, name: 'Przyciemnienie' });
    items = [title(c.title || 'Tytuł na zdjęciu', { color: '#ffffff' })]; if (c.text) items.push(body(c.text, { color: '#EEF1F4' })); L.push(g); stack(items, H * 0.5, bot, 30 * u, 1); L.push(...items); foot();
  } else if (kind === 'steps') {
    const its = (c.items && c.items.length ? c.items : ['Pierwszy krok', 'Drugi krok', 'Trzeci krok']).slice(0, 4), n = its.length, t = title(c.title || 'Stopnie'); t.text.size = Math.round(100 * u); const hT = measureH(t); t.y = top + hT / 2; L.push(...tagItems(), t);
    const extra = [c.text ? body(c.text, { size: 38 * u, color: th.vi }) : null, c.note ? note(c.note) : null].filter(Boolean), exH = extra.reduce((a, l) => a + measureH(l) + 20 * u, 0), yb = bot - exH, maxH = Math.min(520 * u, yb - (top + hT + 60 * u)), gap = 22 * u, bw = (cw - gap * (n - 1)) / n;
    its.forEach((s, i) => { const h = maxH * (0.46 + 0.54 * (n > 1 ? i / (n - 1) : 1)), x = m + bw / 2 + i * (bw + gap), c1 = mix(pal.a, pal.b, i / n * 0.9), c2 = mix(pal.a, pal.b, Math.min(1, (i + 1) / n * 0.9 + 0.1));
      L.push(SHP('rect', { x, y: yb - h / 2, w: bw, h, r: 24 * u, fill: c2, fill2: c1, gAngle: 90, name: 'Słupek ' + (i + 1) }), TXT(String(i + 1), { x: x - bw / 2 + 68 * u, y: yb - h + 56 * u, w: 100 * u, size: 70 * u, font: hf, weight: 900, italic: true, color: pal.on, align: 'left', lh: 1, name: 'Nr ' + (i + 1) }));
      const cap = TXT(s, { x, w: bw - 36 * u, size: 29 * u, font: bf, weight: 600, color: pal.on, align: 'left', lh: 1.2, name: 'Opis ' + (i + 1) }); cap.y = yb - 22 * u - measureH(cap) / 2; L.push(cap); });
    stack(extra, yb + 20 * u, bot + 20 * u, 20 * u, 0); L.push(...extra); foot();
  } else if (kind === 'flow') {
    const nd = (c.nodes && c.nodes.length >= 4 ? c.nodes : ['Ruch, który boli', 'Lęk', 'Unik', 'Ulga']).slice(0, 4), t = title(c.title || 'Schemat'); t.text.size = Math.round(100 * u); const hT = measureH(t); t.y = top + hT / 2; L.push(...tagItems(), t);
    const gx = 150 * u, nw = (cw - gx) / 2, nh = 92 * u, y1 = top + hT + 90 * u, y2 = y1 + 270 * u, xl = m + nw / 2, xr = m + cw - nw / 2, pos = [[xl, y1], [xr, y1], [xr, y2], [xl, y2]], hot = c.hot == null ? 3 : c.hot;
    nd.forEach((s, i) => { const [x, y] = pos[i], h = i === hot; L.push(h ? SHP('rect', grad({ x, y, w: nw, h: nh, r: 22 * u, shadow: { c: A(pal.a, 0.45), b: 30 * u }, name: 'Węzeł ' + (i + 1) })) : gcard(x, y, nw, nh, { r: 22 * u, stroke: { w: 2.5 * u, c: A(pal.a, 0.55) }, name: 'Węzeł ' + (i + 1) }), TXT(s, { x, y, w: nw - 30 * u, size: 34 * u, font: bf, weight: 600, color: h ? pal.on : th.fg, name: 'Etykieta ' + (i + 1) })); });
    const pd = 16 * u; L.push(...arrow(xl + nw / 2 + pd, y1, xr - nw / 2 - pd, y1), ...arrow(xr, y1 + nh / 2 + pd, xr, y2 - nh / 2 - pd), ...arrow(xr - nw / 2 - pd, y2, xl + nw / 2 + pd, y2), ...arrow(xl, y2 - nh / 2 - pd, xl, y1 + nh / 2 + pd));
    items = [c.text ? body(c.text, { color: th.fg }) : null, c.key ? key(c.key) : null].filter(Boolean); stack(items, y2 + nh / 2 + 50 * u, bot + 20 * u, 26 * u, 0); L.push(...items); foot();
  } else if (kind === 'chips') {
    const its = (c.items && c.items.length ? c.items : ['Pierwszy ruch', 'Drugi ruch', 'Trzeci ruch']).slice(0, 12), t = title(c.title || 'Lista rośnie'); t.text.size = Math.round(100 * u); const hT = measureH(t); t.y = top + hT / 2; L.push(...tagItems(), t);
    const hot = c.hot == null ? its.length - 1 : c.hot, ch = 66 * u, gap = 16 * u; let x = m, y = top + hT + 70 * u;
    its.forEach((s0, i) => { const struck = /^[-~]/.test(s0), s = struck ? s0.slice(1).trim() : s0, o = { font: bf, size: 31 * u, weight: 500 }, w = measureW(s, o) + 56 * u; if (x + w > m + cw + 1) { x = m; y += ch + gap; }
      const h = i === hot; L.push(SHP('rect', { x: x + w / 2, y: y + ch / 2, w, h: ch, r: ch / 2, fill: h ? A(pal.a, 0.14) : A(th.light ? '#000000' : '#FFFFFF', 0.05), stroke: { w: 2 * u, c: h ? A(pal.a, 0.85) : A(th.light ? '#000000' : '#FFFFFF', 0.13) }, name: 'Chip ' + (i + 1) }), TXT(s, { x: x + w / 2, y: y + ch / 2, w: w + 20 * u, size: o.size, font: bf, weight: 500, color: struck ? th.mut : th.fg, name: 'Chip tekst ' + (i + 1) }));
      if (struck) L.push(SHP('rect', { x: x + w / 2, y: y + ch / 2, w: w - 52 * u, h: 3 * u, fill: th.mut, name: 'Przekreślenie' })); x += w + gap; });
    items = [c.text ? body(c.text) : null, c.key ? key(c.key) : null].filter(Boolean); stack(items, y + ch + 60 * u, bot + 20 * u, 28 * u, 0); L.push(...items); foot();
  } else if (kind === 'meter') {
    const t = title(c.title || 'Zmierz to'); t.text.size = Math.round(100 * u); const hT = measureH(t); t.y = top + hT / 2; L.push(...tagItems(), t); const pre = c.text ? body(c.text, { size: 40 * u }) : null; let y = top + hT + 36 * u; if (pre) { stack([pre], y, y + 400 * u, 0, 0); L.push(pre); y += measureH(pre) + 56 * u; }
    L.push(T(c.label || 'PRZYKŁAD', { x: cx, y: y + 12 * u, size: 24 * u, weight: 600, ls: 3.2 * u, color: th.mut, upper: true, name: 'Etykieta sekcji' })); y += 56 * u;
    const bars = (c.items && c.items.length ? c.items : ['Przed|7|10', 'Po 5 powtórzeniach|4|10']).slice(0, 4);
    bars.forEach((s, i) => { const [lab, v, mx, txt] = String(s).split('|'), vt = txt && txt.trim() ? txt.trim() : `${v}/${mx || 10}`, vl = vt.length > 9, val = parseFloat(v) || 0, max = parseFloat(mx) || 10, fw = Math.max(26 * u, cw * clamp(val / max, 0, 1));
      L.push(T(lab, { size: 31 * u, weight: 500, color: th.mut, y: y + 18 * u, name: 'Etykieta ' + (i + 1) }), TXT(vt, { x: m + cw - (vl ? 230 : 120) * u, y: y + (vl ? 24 : 14) * u, w: (vl ? 460 : 240) * u, size: (vl ? 36 : 54) * u, font: hf, weight: 800, italic: true, color: th.fg, align: 'right', lh: 1, name: 'Wartość ' + (i + 1) }));
      y += 56 * u; L.push(SHP('rect', { x: cx, y: y + 10 * u, w: cw, h: 20 * u, r: 10 * u, fill: A(th.light ? '#000000' : '#FFFFFF', 0.09), name: 'Tor ' + (i + 1) }), SHP('rect', grad({ x: m + fw / 2, y: y + 10 * u, w: fw, h: 20 * u, r: 10 * u, shadow: { c: A(pal.a, 0.5), b: 18 * u }, name: 'Pasek ' + (i + 1) }))); y += 78 * u; });
    if (c.key) { const k = key(c.key, { weight: 600 }); stack([k], y + 20 * u, bot + 20 * u, 0, 0); L.push(k); } foot();
  } else if (kind === 'recap') {
    const its = (c.items && c.items.length ? c.items : ['Pierwsza rzecz', 'Druga rzecz', 'Trzecia rzecz', 'Czwarta rzecz']).slice(0, 6), t = title(c.title || (its.length + ' rzeczy do zapisania')); t.text.size = Math.round(100 * u); const hT = measureH(t); t.y = top + hT / 2; L.push(...tagItems(), t); let y = top + hT + 56 * u;
    its.forEach((s, i) => { const tx = T(s, { x: m + 90 * u + (cw - 90 * u) / 2, w: cw - 90 * u, size: 37 * u, weight: 400, lh: 1.25, name: 'Pozycja ' + (i + 1) }), h = Math.max(measureH(tx), 56 * u);
      L.push(TXT(String(i + 1), { x: m + 40 * u, y: y + 28 * u, w: 80 * u, size: 62 * u, font: hf, weight: 800, italic: true, allg: true, align: 'left', lh: 1, name: 'Nr ' + (i + 1) })); tx.y = y + h / 2; L.push(tx); y += h + 28 * u; });
    if (c.text || c.cta) { const tx = c.text ? body(c.text, { x: cx, w: cw - 80 * u, size: 36 * u, lh: 1.3, name: 'Treść karty' }) : null, hb = tx ? measureH(tx) : 0, bh = c.cta ? 84 * u : 0, ch = 60 * u + hb + (tx && c.cta ? 34 * u : 0) + bh, cy = Math.min(bot - ch / 2 + 20 * u, y + 20 * u + ch / 2);
      L.push(gcard(cx, cy, cw, ch)); let yy = cy - ch / 2 + 30 * u; if (tx) { tx.y = yy + hb / 2; tx.x = cx; L.push(tx); yy += hb + 34 * u; }
      if (c.cta) { const bw = measureW(c.cta, { font: bf, size: 31 * u, weight: 700 }) + 70 * u; L.push(SHP('rect', grad({ x: m + 40 * u + bw / 2, y: yy + bh / 2, w: bw, h: bh, r: bh / 2, name: 'Przycisk' })), TXT(c.cta, { x: m + 40 * u + bw / 2, y: yy + bh / 2, w: bw + 20 * u, size: 31 * u, font: bf, weight: 700, color: pal.on, name: 'Tekst przycisku' })); } }
    foot();
  } else { // cta
    const t = title(c.title || 'Zapisz ten post i wróć do niego'); items = [t]; if (c.text) items.push(body(c.text, { size: 44 * u })); L.push(...tagItems()); stack(items, top + (c.tag ? 70 * u : 0), bot - 220 * u, 36 * u, tall ? 0.3 : 0.12); L.push(...items);
    const bw = Math.min(cw, measureW(c.cta || 'Obserwuj po więcej', { font: bf, size: 40 * u, weight: 800 }) + 120 * u), by = bot - 60 * u; L.push(SHP('rect', grad({ x: m + bw / 2, y: by, w: bw, h: 116 * u, r: 58 * u, shadow: { c: A(pal.a, 0.5), b: 40 * u }, name: 'Przycisk' })), TXT(c.cta || 'Obserwuj po więcej', { x: m + bw / 2, y: by, w: bw, size: 40 * u, font: bf, weight: 800, color: pal.on, name: 'Tekst przycisku' }));
    foot();
  }
  return sc;
}
// przykładowa treść do podglądu szablonów (motyw: powrót do ruchu po kontuzji)
const TPL_SAMPLE = {
  cover: { tag: 'Psychologia sportu', title: 'Po kontuzji boisz się ćwiczenia?', text: 'To nie słabość… to mechanizm', total: 9, idx: 0 },
  point: { title: 'Wracasz do treningu', text: 'Chcesz wykonać ruch, który znasz.\nZaczynasz mimo niechęci… brzuch się zaciska, jest ciężko.\n\nZamieniasz ćwiczenie na łatwiejsze – napięcie znika.', key: 'Mózg notuje: ulga to znak, że zrobiłeś dobrze', total: 9, idx: 2 },
  list: { title: '3 nawyki na dziś', items: ['Szklanka wody po przebudzeniu', '10 minut spaceru', 'Ostatni posiłek 3 h przed snem'], key: 'Zacznij od jednego, resztę dodasz za tydzień', total: 9, idx: 3 },
  quote: { title: 'Konsekwencja bije motywację.', author: 'Michał', total: 9, idx: 4 },
  stat: { num: '73%', title: 'osób rezygnuje po 3 tygodniach', text: 'dlatego plan musi być prosty', total: 9, idx: 4 },
  photo: { title: 'Trening zaczyna się w głowie', text: 'Zdjęcie dodasz w edytorze', total: 9, idx: 5 },
  steps: { title: '3 stopnie powrotu', items: ['Zielone światło od lekarza lub fizjo', 'Mały zakres, lekki ciężar', 'Dokładasz, gdy poprzedni nudzi'], text: 'Od poziomu 2 przekraczasz zakres dopiero, gdy wcześniejszy etap odczuwasz jako opanowany.', total: 9, idx: 6 },
  flow: { title: 'Ulga to nagroda', nodes: ['Ruch, który boli', 'Lęk', 'Unik', 'Ulga'], text: 'Mózg powtarza to, po czym przychodzi ulga', key: 'Dlatego następnym razem unik przychodzi szybciej', total: 9, idx: 3 },
  chips: { title: 'Lista rośnie', items: ['~Ten jeden ruch', '~Wyskoki', '~Martwy ciąg', 'Bieg', 'Podciąganie', 'Przysiad', 'Pompki'], text: 'Zaczyna się od jednego ruchu…\n\nza miesiąc dochodzi drugi, potem trzeci.', key: 'Wkrótce plan układa strach, a nie Ty…', total: 9, idx: 5 },
  meter: { title: 'Zmierz strach', text: 'Przed ruchem oceń lęk od 0 do 10.\nPo serii oceń jeszcze raz…', items: ['Przed|7|10', 'Po 5 powtórzeniach|4|10'], key: 'Liczba to dowód – którego unikanie Ci odbierało :)', total: 9, idx: 7 },
  recap: { title: '4 rzeczy do zapisania', items: ['Ulga to nagroda, więc **mózg** ją **powtarza**', 'Unikanie **podtrzymuje** lęk', 'Wracaj stopniami, od najłatwiejszego', 'Mierz strach **liczbą**, nie opinią'], text: 'Napisz w komentarzu ruch, który budzi obawy.', cta: 'jaki ruch budzi obawy u Ciebie?', total: 9, idx: 8 },
  cta: { title: 'Zapisz ten post', text: 'Przyda się, gdy zabraknie motywacji', cta: 'Obserwuj po więcej', total: 9, idx: 8 },
};

// ── Sceny wideo: szablon → warstwy osi czasu (z animacjami) ──
function bgToLayer(bg, W, H, t0, t1) {
  let l; if (bg.type === 'image') { l = mkLayer('image', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło (obraz)' }); l.img.assetId = bg.assetId; l.img.fit = 'cover'; l.anim.loop = { p: 'kenburns', amp: 1, spd: 1 }; }
  else if (bg.type === 'glow') { l = mkLayer('fx', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło (poświata)' }); l.fx.kind = 'nightglow'; l.fx.bg = jclone(bg); l.fx.spd = 1; }
  else if (bg.type === 'grad' || bg.type === 'agrad') { l = mkLayer('shape', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło (gradient)' }); l.shape.fill = bg.c1; l.shape.fill2 = bg.c2; l.shape.gAngle = bg.angle || 90; }
  else { l = mkLayer('shape', { x: W / 2, y: H / 2, w: W, h: H, name: 'Tło' }); l.shape.fill = bg.c1; }
  l.track = 'bg'; l.t0 = t0; l.t1 = t1; return l;
}
function animateLayers(layers, style, dur) {
  let i = 0;
  for (const l of layers) {
    if (l.track === 'bg') continue; const a = l.anim; i++; const dl = Math.min(0.1 * i, dur * 0.4);
    if (style === 'calm') a.in = { p: l.type === 'text' ? 'rise' : 'fade', d: 0.8, dl, e: 'outCubic', dir: 'bottom' };
    else if (style === 'punchy') a.in = { p: l.type === 'shape' ? 'reveal' : (l.type === 'text' && /Tytu|Wezw|Liczba|Cytat/.test(l.name) ? 'pop' : 'slide'), d: 0.55, dl, e: 'outBack', dir: i % 2 ? 'left' : 'right' };
    else a.in = { p: l.type === 'text' ? (/Tytu|Wezw|Cytat|Opis|Liczba/.test(l.name) ? 'words' : 'rise') : l.type === 'shape' ? 'reveal' : 'zoom', d: l.type === 'text' ? 0.9 : 0.6, dl, e: 'outCubic', dir: 'left' };
    a.out = { p: 'fade', d: 0.3, dl: 0, e: 'inCubic', dir: 'bottom' };
  }
  return layers;
}
function sceneToReel(kind, c, t0, dur, style, seq) { // zwraca warstwy z przesuniętym czasem
  const sc = makeScene(kind, Object.assign({}, c, { total: 0, idx: null }), 'story', seq), t1 = t0 + dur, out = [];
  out.push(bgToLayer(sc.bg, sc.w, sc.h, t0, t1)); for (const l of sc.layers) { l.t0 = t0; l.t1 = t1; out.push(l); }
  animateLayers(out, style || 'dynamic', dur); return out;
}
