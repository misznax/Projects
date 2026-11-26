/* Pomocnicy formularzy powiązanych ze ścieżką w obiekcie (np. 'text.size') */
const getp = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const setp = (o, p, v) => { const ks = p.split('.'), l = ks.pop(); const t = ks.reduce((a, k) => a[k], o); t[l] = v; };
const rnd = (v, d = 2) => (typeof v === 'number' ? Math.round(v * 10 ** d) / 10 ** d : v);
function fld(spec, obj, cb) { // spec: {k,t,label,min,max,step,opts,unit,tip}; cb('live'|'commit')
  const v = getp(obj, spec.k); let el, wrapCls = 'fld';
  const set = (x) => { setp(obj, spec.k, x); cb('live'); };
  switch (spec.t) {
    case 'num': el = h('input', { type: 'number', value: rnd(v), min: spec.min, max: spec.max, step: spec.step || 1, oninput: (e) => { if (e.target.value !== '') set(+e.target.value); }, onchange: () => cb('commit') }); el.dataset.pk = spec.k; break;
    case 'range': { const out = h('span', { class: 'tag off fix' }, rnd(v)); el = h('div', { class: 'row' }, h('input', { type: 'range', min: spec.min, max: spec.max, step: spec.step || 1, value: v, oninput: (e) => { out.textContent = rnd(+e.target.value) + (spec.unit || ''); set(+e.target.value); }, onchange: () => cb('commit') }), out); out.textContent = rnd(v) + (spec.unit || ''); break; }
    case 'color': { const tx = h('input', { type: 'text', value: v || '', spellcheck: false, onchange: (e) => { if (/^#[0-9a-fA-F]{6,8}$/.test(e.target.value) || e.target.value === '') { set(e.target.value); cb('commit'); } } }); const pk = h('input', { type: 'color', value: /^#[0-9a-fA-F]{6}/.test(v || '') ? v.slice(0, 7) : '#000000', oninput: (e) => { tx.value = e.target.value; set(e.target.value); }, onchange: () => cb('commit') }); el = h('div', { class: 'row' }, pk, tx); break; }
    case 'text': el = h('input', { type: 'text', value: v || '', oninput: (e) => set(e.target.value), onchange: () => cb('commit') }); break;
    case 'area': el = h('textarea', { rows: spec.rows || 3, value: v || '', oninput: (e) => set(e.target.value), onchange: () => cb('commit') }); el.dataset.k = spec.k; break;
    case 'sel': el = h('select', { onchange: (e) => { set(spec.num ? +e.target.value : e.target.value); cb('commit'); } }, spec.opts.map(([val, lb]) => h('option', { value: val, selected: String(val) === String(v) }, lb))); break;
    case 'chk': el = h('label', { class: 'row', style: { gap: '8px', cursor: 'pointer' } }, h('input', { type: 'checkbox', checked: !!v, style: { flex: 'none', width: 'auto' }, onchange: (e) => { set(e.target.checked); cb('commit'); } }), h('span', {}, spec.label)); return h('div', { class: wrapCls }, el);
    case 'seg': { const bs = spec.opts.map(([val, lb]) => h('button', { class: String(val) === String(v) ? 'on' : '', title: spec.tip || '', onclick: (e) => { setp(obj, spec.k, val); cb('commit'); bs.forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); } }, lb)); el = h('div', { class: 'seg' }, bs); break; }
    default: el = h('span', {}, String(v));
  }
  return h('div', { class: wrapCls }, spec.label ? h('label', {}, spec.label) : null, el);
}
const rowOf = (...f) => h('div', { class: 'row' }, ...f);
function section(title, ...kids) { return [h('div', { class: 'ph' }, title), h('div', { class: 'sec' }, ...kids)]; }
function pickFiles(accept, multi) { return new Promise((res) => { const i = h('input', { type: 'file', accept, multiple: !!multi }); i.onchange = () => res([...i.files]); i.oncancel = () => res([]); i.click(); }); }
// wybór zasobu: biblioteka (wszystkie projekty) / folder Drive / link / urządzenie → patrz import.js
function assetPicker(kinds, title) { return Importer.pick(kinds, title); }

// Wspólny panel właściwości warstwy (Creative + Video): pozycja + pola zależne od typu
function layerFields(l, cb) {
  const pos = [rowOf(fld({ k: 'x', t: 'num', label: 'X' }, l, cb), fld({ k: 'y', t: 'num', label: 'Y' }, l, cb)), rowOf(fld({ k: 'w', t: 'num', label: 'Szerokość', min: 10 }, l, cb), l.type === 'text' ? h('div') : fld({ k: 'h', t: 'num', label: 'Wysokość', min: 10 }, l, cb)), rowOf(fld({ k: 'rot', t: 'num', label: 'Obrót °' }, l, cb), fld({ k: 'op', t: 'range', label: 'Przezroczystość', min: 0, max: 1, step: 0.01 }, l, cb))];
  const out = [h('div', { class: 'ph' }, 'Pozycja'), h('div', { class: 'sec' }, ...pos)];
  if (l.type === 'text') {
    out.push(h('div', { class: 'ph' }, 'Tekst'), h('div', { class: 'sec' }, fld({ k: 'text.s', t: 'area', rows: 3 }, l, cb), fld({ k: 'text.font', t: 'sel', label: 'Font', opts: allFonts().map((f) => [f, f]) }, l, cb),
      rowOf(fld({ k: 'text.size', t: 'num', label: 'Rozmiar', min: 8, max: 600 }, l, cb), fld({ k: 'text.weight', t: 'sel', label: 'Grubość', num: true, opts: [[300, 'Lekki'], [400, 'Zwykły'], [500, 'Średni'], [600, 'Półgruby'], [700, 'Gruby'], [800, 'Extra'], [900, 'Czarny']] }, l, cb)),
      fld({ k: 'text.color', t: 'color', label: 'Kolor' }, l, cb), fld({ k: 'text.align', t: 'seg', opts: [['left', '⟸'], ['center', '≡'], ['right', '⟹']] }, l, cb),
      rowOf(fld({ k: 'text.lh', t: 'num', label: 'Interlinia', step: 0.05, min: 0.6, max: 3 }, l, cb), fld({ k: 'text.ls', t: 'num', label: 'Odstęp liter', step: 0.5 }, l, cb)),
      rowOf(fld({ k: 'text.italic', t: 'chk', label: 'Kursywa' }, l, cb), fld({ k: 'text.upper', t: 'chk', label: 'WERSALIKI' }, l, cb))),
    h('div', { class: 'ph' }, 'Efekty tekstu'), h('div', { class: 'sec' }, rowOf(fld({ k: 'text.stroke.w', t: 'num', label: 'Obrys (px)', min: 0, max: 40 }, l, cb), fld({ k: 'text.stroke.c', t: 'color', label: 'Kolor obrysu' }, l, cb)),
      fld({ k: 'text.shadow.on', t: 'chk', label: 'Cień' }, l, cb), rowOf(fld({ k: 'text.shadow.y', t: 'num', label: 'Cień Y' }, l, cb), fld({ k: 'text.shadow.b', t: 'num', label: 'Rozmycie', min: 0 }, l, cb)),
      fld({ k: 'text.bg.on', t: 'chk', label: 'Podkład pod tekstem' }, l, cb), rowOf(fld({ k: 'text.bg.c', t: 'color', label: 'Kolor podkładu' }, l, cb), fld({ k: 'text.bg.pad', t: 'num', label: 'Margines', min: 0 }, l, cb), fld({ k: 'text.bg.r', t: 'num', label: 'Zaokrąglenie', min: 0 }, l, cb))));
  } else if (l.type === 'image') {
    out.push(h('div', { class: 'ph' }, 'Obraz'), h('div', { class: 'sec' }, fld({ k: 'img.fit', t: 'seg', label: 'Dopasowanie', opts: [['cover', 'Wypełnij'], ['contain', 'Zmieść']] }, l, cb), fld({ k: 'img.r', t: 'range', label: 'Zaokrąglenie rogów', min: 0, max: 540, step: 1 }, l, cb), fld({ k: 'img.flipX', t: 'chk', label: 'Odbij poziomo' }, l, cb),
      fld({ k: 'img.b', t: 'range', label: 'Jasność', min: 0.2, max: 2, step: 0.05 }, l, cb), fld({ k: 'img.c', t: 'range', label: 'Kontrast', min: 0.2, max: 2, step: 0.05 }, l, cb), fld({ k: 'img.s', t: 'range', label: 'Nasycenie', min: 0, max: 2, step: 0.05 }, l, cb), fld({ k: 'img.blur', t: 'range', label: 'Rozmycie', min: 0, max: 40, step: 1 }, l, cb)));
  } else if (l.type === 'shape') {
    out.push(h('div', { class: 'ph' }, 'Kształt'), h('div', { class: 'sec' }, fld({ k: 'shape.kind', t: 'sel', label: 'Rodzaj', opts: [['rect', 'Prostokąt'], ['ellipse', 'Elipsa'], ['line', 'Pasek']] }, l, cb), fld({ k: 'shape.fill', t: 'color', label: 'Wypełnienie' }, l, cb), fld({ k: 'shape.fill2', t: 'color', label: 'Drugi kolor (gradient, puste = brak)' }, l, cb), fld({ k: 'shape.gAngle', t: 'num', label: 'Kąt gradientu °' }, l, cb), fld({ k: 'shape.r', t: 'range', label: 'Zaokrąglenie', min: 0, max: 400, step: 1 }, l, cb), rowOf(fld({ k: 'shape.stroke.w', t: 'num', label: 'Obrys', min: 0 }, l, cb), fld({ k: 'shape.stroke.c', t: 'color', label: 'Kolor obrysu' }, l, cb)), fld({ k: 'shape.shadow.on', t: 'chk', label: 'Cień' }, l, cb)));
  } else if (l.type === 'video') {
    const c = l.video, redo = () => { cb('live'); cb('commit'); }, segB = (label, key, opts, onpick) => h('div', { class: 'fld' }, h('label', {}, label), h('div', { class: 'seg' }, opts.map(([v, n, tip]) => h('button', { class: String(c[key] || (key === 'shape' ? 'rect' : '')) === String(v) ? 'on' : '', title: tip || '', onclick: (e) => { onpick(v); redo(); [...e.currentTarget.parentNode.children].forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); } }, n))));
    out.push(h('div', { class: 'ph' }, 'Gadająca głowa / wideo'), h('div', { class: 'sec' },
      segB('Kształt', 'shape', [['circle', '⬤ Koło', 'Wideo w kole'], ['round', '▢ Zaokrąglony'], ['rect', '▭ Prostokąt'], ['full', '⛶ Pełny ekran']], (v) => Video.applyPip(l, { shape: v })),
      segB('Rozmiar', 'size', [['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']], (v) => Video.applyPip(l, { size: v })),
      h('div', { class: 'fld' }, h('label', {}, 'Miejsce (w bezpiecznej strefie)'), h('div', { class: 'pipgrid' }, [['tl', '↖'], ['tc', '↑'], ['tr', '↗'], ['ml', '←'], ['mc', '•'], ['mr', '→'], ['bl', '↙'], ['bc', '↓'], ['br', '↘']].map(([v, n]) => h('button', { class: c.pos === v ? 'on' : '', title: 'Ustaw w tym miejscu', onclick: (e) => { Video.applyPip(l, { pos: v }); redo(); [...e.currentTarget.parentNode.children].forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); } }, n)))),
      fld({ k: 'video.fit', t: 'seg', label: 'Dopasowanie', opts: [['cover', 'Wypełnij'], ['contain', 'Zmieść']] }, l, cb), fld({ k: 'video.zoom', t: 'range', label: 'Przybliżenie kadru', min: 1, max: 3, step: 0.01, unit: '×' }, l, cb), rowOf(fld({ k: 'video.ox', t: 'range', label: 'Kadr: w prawo', min: -0.5, max: 0.5, step: 0.01 }, l, cb), fld({ k: 'video.oy', t: 'range', label: 'Kadr: w dół', min: -0.5, max: 0.5, step: 0.01 }, l, cb)), fld({ k: 'video.flipX', t: 'chk', label: 'Lustro (odbicie poziome)' }, l, cb)),
      h('div', { class: 'ph' }, 'Ramka i poświata'), h('div', { class: 'sec' }, rowOf(fld({ k: 'video.bw', t: 'range', label: 'Grubość ramki', min: 0, max: 30, step: 1 }, l, cb), fld({ k: 'video.bc', t: 'color', label: 'Kolor ramki i poświaty' }, l, cb)), fld({ k: 'video.glow', t: 'range', label: 'Poświata', min: 0, max: 80, step: 1 }, l, cb), (c.shape === 'rect' || c.shape === 'round' || !c.shape) ? fld({ k: 'video.r', t: 'range', label: 'Zaokrąglenie rogów', min: 0, max: 540, step: 1 }, l, cb) : null),
      h('div', { class: 'ph' }, 'Czas i dźwięk'), h('div', { class: 'sec' }, rowOf(fld({ k: 'video.in', t: 'num', label: 'Start w pliku (s)', min: 0, step: 0.1 }, l, cb), fld({ k: 'video.speed', t: 'num', label: 'Prędkość ×', min: 0.25, max: 4, step: 0.05 }, l, cb)), fld({ k: 'video.vol', t: 'range', label: 'Głośność dźwięku z wideo', min: -30, max: 12, step: 0.5, unit: ' dB' }, l, cb), fld({ k: 'video.mute', t: 'chk', label: 'Wycisz dźwięk z wideo' }, l, cb),
        h('div', { class: 'hint', html: rich('Dźwięk z pliku trafia na ścieżkę „Głos” (przesuwa się razem z klipem; przy prędkości innej niż 1× jest wyciszony).') })));
  } else if (l.type === 'fx') {
    out.push(h('div', { class: 'ph' }, 'Animacja tła'), h('div', { class: 'sec' }, fld({ k: 'fx.kind', t: 'sel', label: 'Rodzaj', opts: [['agrad', 'Płynący gradient'], ['orbs', 'Rozmyte kule'], ['particles', 'Cząsteczki'], ['confetti', 'Konfetti'], ['stripes', 'Pasy'], ['bar', 'Pasek postępu']] }, l, cb), rowOf(fld({ k: 'fx.c1', t: 'color', label: 'Kolor 1' }, l, cb), fld({ k: 'fx.c2', t: 'color', label: 'Kolor 2' }, l, cb), fld({ k: 'fx.c3', t: 'color', label: 'Kolor 3' }, l, cb)), rowOf(fld({ k: 'fx.n', t: 'num', label: 'Ilość', min: 1, max: 80 }, l, cb), fld({ k: 'fx.spd', t: 'num', label: 'Szybkość', step: 0.1, min: 0.1, max: 5 }, l, cb))));
  }
  return out;
}

// mono 16 kHz WAV do rozpoznawania mowy (mały plik: limit Workera to 8 MB ≈ 250 s)
function wav16k(chs, fs) { const x = chs.length > 1 ? chs[0].map((v, i) => (v + chs[1][i]) / 2) : chs[0], k = Math.max(1, Math.round(fs / 16000)), n = Math.floor(x.length / k), o = new Float32Array(n); for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < k; j++) s += x[i * k + j]; o[i] = s / k; } return new Blob([DSP.wav([o], fs / k, 16)], { type: 'audio/wav' }); }
