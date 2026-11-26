/* BRAND STUDIO: kolory (ręcznie / brand.md), fonty, logo, referencje (analiza), siła identyfikacji, biblioteki szablonów i animacji */
function parseBrandMd(txt) {
  const out = { colors: {}, hf: null, bf: null, style: null, handle: null, auto: false }, extra = [];
  const hexRe = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/, norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
  const roles = { primary: 'primary', main: 'primary', glowny: 'primary', podstawowy: 'primary', background: 'background', bg: 'background', tlo: 'background', base: 'background', accent: 'accent', akcent: 'accent', secondary: 'accent' };
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:[-*+]\s*)?\**\s*([^:：#\n]+?)\s*\**\s*[:：]\s*(.+?)\s*$/); const hx = line.match(hexRe);
    if (m) {
      const k = norm(m[1]), v = m[2].replace(/\*+/g, '').trim(), vh = v.match(hexRe);
      if (/heading|naglow|tytul/.test(k) && /font|czcionk/.test(k + ' font')) { out.hf = v.replace(/^\[|\]$/g, '').trim(); continue; }
      if (/body|tresc|tekst/.test(k) && /font|czcionk/.test(k)) { out.bf = v.replace(/^\[|\]$/g, '').trim(); continue; }
      if (/^style|^styl/.test(k)) { out.style = v; continue; }
      if (/handle|uchwyt|instagram|konto/.test(k) && /^@/.test(v)) { out.handle = v; continue; }
      if (vh) { const role = roles[k.replace(/\s*color|\s*kolor/g, '').trim()] || roles[k.split(/\s+/)[0]]; const hv = '#' + (vh[1].length === 3 ? vh[1].split('').map((c) => c + c).join('') : vh[1]).toUpperCase(); if (role && !out.colors[role]) out.colors[role] = hv; else extra.push(hv); continue; }
    }
    if (hx) extra.push('#' + (hx[1].length === 3 ? hx[1].split('').map((c) => c + c).join('') : hx[1]).toUpperCase());
  }
  const need = ['primary', 'background', 'accent'].filter((r) => !out.colors[r]); const pool = [...new Set(extra)].filter((x) => !Object.values(out.colors).includes(x));
  if (need.length && pool.length) {
    out.auto = true; const byL = pool.slice().sort((a, b) => lum(a) - lum(b)), sat = (x) => { const [r, g, b] = hex2rgb(x); return Math.max(r, g, b) - Math.min(r, g, b); };
    if (need.includes('background') && pool.length) { const x = byL.pop(); out.colors.background = x; pool.splice(pool.indexOf(x), 1); byL.splice(byL.indexOf(x), 1); }
    if (need.includes('primary') && pool.length) { const x = pool.slice().sort((a, b) => lum(a) - lum(b))[0]; out.colors.primary = x; pool.splice(pool.indexOf(x), 1); }
    if (need.includes('accent') && pool.length) { const x = pool.slice().sort((a, b) => sat(b) - sat(a))[0]; out.colors.accent = x; }
  }
  return out;
}
function brandToMd(b) { return `# Brand Identity\n\nPrimary: ${b.colors.primary}\nBackground: ${b.colors.background}\nAccent: ${b.colors.accent}\n\nHeading Font: ${b.headingFont}\nBody Font: ${b.bodyFont}\n\nStyle: ${b.style}\n${b.handle ? '\nHandle: ' + b.handle + '\n' : ''}${b.rules ? '\n## Zasady wizualne (z analizy referencji)\n' + b.rules + '\n' : ''}`; }

// ── Analiza referencji (po stronie przeglądarki, bez kluczy) ──
async function analyzeImage(blob) {
  const im = await Assets.imgFromBlob(blob), s = 96 / Math.max(im.naturalWidth, im.naturalHeight), c = document.createElement('canvas'); c.width = Math.max(8, Math.round(im.naturalWidth * s)); c.height = Math.max(8, Math.round(im.naturalHeight * s));
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, c.width, c.height); const d = x.getImageData(0, 0, c.width, c.height).data, px = []; for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) px.push([d[i], d[i + 1], d[i + 2]]);
  const K = 5; let cen = []; for (let k = 0; k < K; k++) cen.push(px[Math.floor((k + 0.5) * px.length / K)].slice()); let asg = new Array(px.length).fill(0);
  for (let it = 0; it < 9; it++) { const sum = cen.map(() => [0, 0, 0, 0]); px.forEach((p, i) => { let b = 0, bd = 1e9; for (let k = 0; k < K; k++) { const dd = (p[0] - cen[k][0]) ** 2 + (p[1] - cen[k][1]) ** 2 + (p[2] - cen[k][2]) ** 2; if (dd < bd) { bd = dd; b = k; } } asg[i] = b; const q = sum[b]; q[0] += p[0]; q[1] += p[1]; q[2] += p[2]; q[3]++; }); cen = cen.map((cc, k) => sum[k][3] ? [sum[k][0] / sum[k][3], sum[k][1] / sum[k][3], sum[k][2] / sum[k][3]] : cc); }
  const cnt = new Array(K).fill(0); asg.forEach((a) => cnt[a]++); const palette = cen.map((cc, k) => ({ hex: rgb2hex(...cc), share: cnt[k] / px.length })).filter((p) => p.share > 0.015).sort((a, b) => b.share - a.share);
  let sb = 0, ss = 0, sc2 = 0; const L = px.map((p) => (0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]) / 255); L.forEach((v) => { sb += v; }); const mean = sb / L.length; L.forEach((v) => { sc2 += (v - mean) ** 2; });
  px.forEach((p) => { const mx = Math.max(...p), mn = Math.min(...p); ss += mx ? (mx - mn) / mx : 0; });
  let edge = 0; for (let yy = 1; yy < c.height - 1; yy++) for (let xx = 1; xx < c.width - 1; xx++) { const i = (yy * c.width + xx) * 4, j = i + 4, k = i + c.width * 4; if (Math.abs(d[i] - d[j]) + Math.abs(d[i] - d[k]) > 60) edge++; }
  return { palette, bright: mean, sat: ss / px.length, contrast: Math.sqrt(sc2 / L.length), white: palette[0] ? palette[0].share : 0, aspect: im.naturalWidth / im.naturalHeight, edge: edge / (c.width * c.height) };
}
function describeRefs(rs) {
  if (!rs.length) return ''; const avg = (k) => rs.reduce((a, r) => a + r.an[k], 0) / rs.length, t = [];
  t.push(avg('bright') > 0.62 ? 'jasne tła' : avg('bright') < 0.38 ? 'ciemne tła' : 'średnia jasność'); t.push(avg('contrast') > 0.28 ? 'wysoki kontrast' : 'stonowany kontrast'); t.push(avg('sat') > 0.45 ? 'nasycone kolory' : 'stonowana kolorystyka'); t.push(avg('white') > 0.45 ? 'dużo przestrzeni (jedno dominujące tło)' : 'bogatsze, wielobarwne kadry'); t.push(avg('edge') > 0.16 ? 'gęsta treść / dużo tekstu' : 'minimalistyczna treść');
  const asp = avg('aspect'); t.push(asp < 0.6 ? 'format 9:16' : asp < 0.9 ? 'format 4:5' : asp < 1.15 ? 'format kwadratowy' : 'format poziomy'); return t.join(', ');
}
function imgThumbEl(id) { const i = h('img', { alt: '' }); Assets.url(id).then((u) => { if (u) i.src = u; }); return i; }

const Brand = {
  built: false, raf: 0,
  build() {
    const root = $('#m-brand'); root.innerHTML = ''; this.left = h('div', { class: 'panel' }); this.right = h('div', { class: 'panel r pad', style: { borderLeft: 0, background: 'var(--bg)' } }); root.append(this.left, this.right); this.built = true; this.render();
  },
  async set(fn) { fn(P.cur.brand); touch(); this.refreshRight(); },
  render() {
    const b = P.cur.brand, L = this.left; L.innerHTML = '';
    const colorRow = (role, label) => {
      const inp = h('input', { type: 'text', value: b.colors[role], maxlength: 7, spellcheck: false, 'aria-label': label + ' HEX' }), pick = h('input', { type: 'color', value: b.colors[role], 'aria-label': label }), badge = h('span', { class: 'tag off' });
      const upd = (v) => { if (!/^#[0-9a-fA-F]{6}$/.test(v)) return; b.colors[role] = v.toUpperCase(); this.detach(); this.syncPal(b); inp.value = b.colors[role]; pick.value = b.colors[role].toLowerCase(); touch(); this.refreshRight(); bd(); };
      const bd = () => { const c = contrast(b.colors.primary, b.colors.background); badge.textContent = role === 'primary' ? 'kontrast z tłem ' + c.toFixed(1) + ':1' : ''; badge.className = 'tag ' + (c >= 4.5 ? 'ok' : c >= 3 ? 'warn' : 'bad'); if (role !== 'primary') badge.style.display = 'none'; };
      pick.oninput = () => upd(pick.value); inp.onchange = () => upd(inp.value.startsWith('#') ? inp.value : '#' + inp.value); bd();
      return h('div', { class: 'fld' }, h('label', {}, label), h('div', { class: 'row' }, pick, inp, badge));
    };
    const fontSel = (key, label) => { const s = h('select', { 'aria-label': label }); for (const f of allFonts()) s.append(h('option', { value: f, selected: f === b[key] }, f)); s.onchange = () => { b[key] = s.value; this.detach(); touch(); this.refreshRight(); }; return h('div', { class: 'fld' }, h('label', {}, label), s); };
    this.autoBox = h('div', {}); L.append(this.autoBox); this.updCard();
    L.append(h('div', { class: 'ph' }, 'Kolory marki (ręczna zmiana odpina markę od automatu)'), h('div', { class: 'sec' },
      colorRow('primary', 'Primary (kolor główny)'), colorRow('background', 'Background (tło bazowe)'), colorRow('accent', 'Accent (akcent)'),
      h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn', onclick: () => this.importMd() }, 'Wczytaj brand.md'), h('button', { class: 'btn', onclick: () => this.pasteMd() }, 'Wklej brand.md'), h('button', { class: 'btn', onclick: () => download(new Blob([brandToMd(b)], { type: 'text/markdown' }), fname('brand', 'md')) }, 'Zapisz brand.md')),
      h('div', { class: 'hint', style: { marginTop: '6px' }, html: rich('Nie musisz niczego wgrywać: marka sama się ładuje z repo marki. Plik brand.md jest tylko dla innych marek (format: „Primary: #123456”, „Background: #F5F2ED”, „Accent: #D49B65”).') })));
    L.append(h('div', { class: 'ph' }, 'Typografia'), h('div', { class: 'sec' }, fontSel('headingFont', 'Font nagłówków'), fontSel('bodyFont', 'Font tekstu'),
      h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => this.uploadFont() }, 'Dodaj własny font (TTF/OTF/WOFF)')),
      h('div', { class: 'fld' }, h('label', {}, 'Styl marki (słowa kluczowe)'), h('input', { type: 'text', value: b.style, onchange: (e) => { b.style = e.target.value; touch(); } })),
      h('div', { class: 'fld' }, h('label', {}, 'Uchwyt konta (stopka grafik)'), h('input', { type: 'text', value: b.handle || '', placeholder: '@twoje.konto', onchange: (e) => { b.handle = e.target.value.trim(); this.detach(); touch(); this.refreshRight(); } }))));
    const logos = h('div', { class: 'thumbs' }); for (const id of b.logos) logos.append(h('div', { class: 'th' }, imgThumbEl(id), h('button', { class: 'x', title: 'Usuń logo', onclick: () => { b.logos = b.logos.filter((x) => x !== id); touch(); this.render(); this.refreshRight(); } }, '✕')));
    L.append(h('div', { class: 'ph' }, 'Biblioteka logo'), h('div', { class: 'sec' }, logos, h('button', { class: 'btn', style: { marginTop: '8px' }, onclick: () => this.pick('image/png,image/svg+xml,image/webp,image/jpeg', true, async (fs) => { for (const f of fs) b.logos.push(await Assets.add(f, 'logo')); touch(); this.render(); this.refreshRight(); }) }, 'Dodaj logo (PNG/SVG/WEBP)')));
    const refs = h('div', { class: 'thumbs' }); for (const r of b.refs) refs.append(h('div', { class: 'th', title: r.name }, r.pdf ? h('div', { style: { padding: '18px 6px', fontSize: '12px', textAlign: 'center' } }, 'PDF') : imgThumbEl(r.id), h('button', { class: 'x', onclick: () => { b.refs = b.refs.filter((x) => x.id !== r.id); touch(); this.render(); this.refreshRight(); } }, '✕')));
    L.append(h('div', { class: 'ph' }, 'Przykładowe projekty (referencje)'), h('div', { class: 'sec' }, refs,
      h('div', { class: 'row', style: { marginTop: '8px' } }, h('button', { class: 'btn', onclick: () => this.pick('image/jpeg,image/png,image/webp,application/pdf', true, (fs) => this.addRefs(fs)) }, 'Dodaj referencje (JPG/PNG/WEBP/PDF)')),
      h('div', { class: 'row', style: { marginTop: '6px' } }, h('button', { class: 'btn sea', onclick: () => this.suggestPalette() }, 'Zaproponuj kolory z referencji'), h('button', { class: 'btn sea', onclick: () => this.aiStyle() }, 'Analiza stylu (AI)')),
      h('div', { class: 'fld' }, h('label', {}, 'Zasady wizualne marki (wynik analizy, możesz edytować)'), h('textarea', { rows: 4, value: b.rules || '', placeholder: 'Po analizie AI pojawią się tu zasady: kompozycja, typografia, hierarchia, tła…', onchange: (e) => { b.rules = e.target.value; touch(); } })),
      h('div', { class: 'hint', html: rich('Analiza działa lokalnie: paleta, jasność, kontrast, nasycenie, ilość przestrzeni. „Analiza stylu (AI)” dodatkowo czyta kompozycję i typografię (wymaga klucza Claude w Workerze, PDF poza analizą).') })));
    const slv = h('span', { class: 'tag off' }, b.strictness + '%'); const sl = h('input', { type: 'range', min: 0, max: 100, value: b.strictness, 'aria-label': 'Intensywność trzymania się identyfikacji' }); sl.oninput = () => { b.strictness = +sl.value; slv.textContent = sl.value + '%'; }; sl.onchange = () => { touch(); this.refreshRight(); };
    L.append(h('div', { class: 'ph' }, 'Trzymanie się identyfikacji'), h('div', { class: 'sec' }, h('div', { class: 'row' }, sl, slv.classList.add('fix') || slv), h('div', { class: 'hint', html: rich('100% = tylko kolory i fonty marki, powtarzalne układy. Poniżej 55% = więcej wariantów tła, dekoracji i układów (kolory zostają z marki). Poniżej 40% = także zamiana fontów.') })));
    const sty = h('div', { class: 'zebra' }); for (const s of b.styles || []) sty.append(h('div', { class: 'row', style: { padding: '4px 8px' } }, h('span', {}, s.name), h('button', { class: 'btn sm fix', onclick: () => { Object.assign(b, jclone({ colors: s.colors, headingFont: s.headingFont, bodyFont: s.bodyFont, style: s.style, strictness: s.strictness })); touch(); this.render(); this.refreshRight(); } }, 'Zastosuj'), h('button', { class: 'btn sm bad fix', onclick: () => { b.styles = b.styles.filter((x) => x !== s); touch(); this.render(); } }, '✕')));
    L.append(h('div', { class: 'ph' }, 'Zapisane style graficzne'), h('div', { class: 'sec' }, sty, h('button', { class: 'btn', style: { marginTop: '8px' }, onclick: () => { const n = prompt('Nazwa stylu:', 'Styl ' + ((b.styles || []).length + 1)); if (!n) return; b.styles = b.styles || []; b.styles.push({ name: n, colors: jclone(b.colors), headingFont: b.headingFont, bodyFont: b.bodyFont, style: b.style, strictness: b.strictness }); touch(); this.render(); } }, 'Zapisz bieżący styl')));
    this.renderRight();
  },
  detach() { const b = P.cur.brand; if (!b.auto) return; b.auto = false; this.updCard(); },
  syncPal(b) { // ręczna zmiana 3 kolorów przesuwa odpowiadające im kolory palety (gradient, poświata), reszta zostaje
    if (!b.pal) return; const p = b.pal, C = b.colors; p.a = C.primary; p.bg = C.background; p.sf = mix(C.background, '#FFFFFF', 0.045); p.b = C.accent; p.m = mix(p.a, p.b, 0.5); p.on = readable(p.a);
  },
  updCard() {
    if (!this.autoBox) return; const b = P.cur.brand, s = brandSrc(), pal = palOf(b), on = !!b.auto, box = this.autoBox; box.innerHTML = '';
    const live = !!SYNC.brand, when = s.updated ? fdate(s.updated) : '?';
    box.append(h('div', { class: 'autocard' }, h('div', { style: { fontWeight: 700 } }, on ? 'Marka z automatu' : 'Marka ręczna (odpięta od automatu)'),
      h('div', { class: 'fine' }, (live ? 'Źródło: ' + (s.source || 'repo marki') : 'Źródło: wbudowana kopia (brak pliku z danymi)') + ' · stan z ' + when),
      h('div', { class: 'sws' }, ...['a', 'm', 'b', 'v', 'bg', 'ink'].map((k) => h('i', { style: { background: pal[k] || '#000' }, title: k + ' ' + (pal[k] || '') }))),
      h('div', { class: 'fine' }, `${b.headingFont} + ${b.bodyFont}${b.handle ? ' · ' + b.handle : ''}${s.site ? ' · ' + s.site : ''}`),
      b.dna ? h('div', { class: 'fine', style: { marginTop: '4px' } }, 'Styl grafik (z karuzeli ' + (b.dnaUser ? 'wgranej przez Ciebie' : ((SYNC.ref && SYNC.ref.name) || 'wzorcowej')) + '): ' + Learn.describe(b.dna)) : null,
      h('div', { class: 'row', style: { marginTop: '8px' } },
        h('button', { class: 'btn sm', onclick: async () => { await syncLoad(true); if (P.cur.brand.auto) applyAutoBrand(P.cur.brand); touch(); this.render(); toast('Odświeżono dane marki.', 'ok'); } }, 'Odśwież'),
        on ? h('button', { class: 'btn sm', onclick: () => { b.auto = false; touch(); this.updCard(); toast('Marka odpięta. Edytujesz ją ręcznie.', 'info'); } }, 'Odepnij (ręcznie)')
          : h('button', { class: 'btn sm pri', onclick: async () => { applyAutoBrand(b); await ensureLogo(b); touch(); this.render(); this.refreshRight(); toast('Marka znów z automatu.', 'ok'); } }, 'Przypnij do automatu'))));
  },
  pick(accept, multi, cb) { const i = h('input', { type: 'file', accept, multiple: !!multi }); i.onchange = () => i.files.length && cb([...i.files]); i.click(); },
  importMd() { this.pick('.md,.txt,text/markdown,text/plain', false, async ([f]) => this.applyMd(await f.text())); },
  pasteMd() { const ta = h('textarea', { rows: 10, placeholder: '# Brand Identity\nPrimary: #123456\nBackground: #F5F2ED\nAccent: #D49B65' }); modal('Wklej brand.md', ta, [{ t: 'Zastosuj', cls: 'pri', fn: () => this.applyMd(ta.value) }, { t: 'Anuluj' }]); },
  applyMd(txt) {
    const r = parseBrandMd(txt), b = P.cur.brand, n = Object.keys(r.colors).length; if (!n) { toast('Nie znalazłem kolorów HEX w pliku (oczekuję np. „Primary: #123456”).', 'bad', 6000); return; }
    Object.assign(b.colors, r.colors); this.detach(); this.syncPal(b); if (r.hf) b.headingFont = r.hf; if (r.bf) b.bodyFont = r.bf; if (r.style) b.style = r.style; if (r.handle) b.handle = r.handle; touch(); this.render();
    toast(`Wczytano ${n}/3 kolory` + (r.auto ? ' (role przypisane automatycznie, sprawdź)' : '') + (r.hf && !allFonts().includes(r.hf) ? '. Font „' + r.hf + '” nie jest zainstalowany: dodaj go przyciskiem fontu.' : ''), r.auto || n < 3 ? 'warn' : 'ok', 6000);
  },
  uploadFont() { this.pick('.ttf,.otf,.woff,.woff2', true, async (fs) => { const b = P.cur.brand; for (const f of fs) { try { const fam = f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), id = await Assets.add(f, 'font'), rec = { family: fam, assetId: id }; await loadFontAsset(rec); b.fonts.push(rec); toast('Dodano font „' + fam + '”', 'ok'); } catch (e) { toast('Font nie załadował się: ' + errText(e), 'bad'); } } touch(); this.render(); }); },
  async addRefs(files) {
    const b = P.cur.brand; for (const f of files) { try { if (f.type === 'application/pdf') { b.refs.push({ id: await Assets.add(f, 'ref'), name: f.name, pdf: true }); continue; } const id = await Assets.add(f, 'ref'), an = await analyzeImage(f); b.refs.push({ id, name: f.name, an }); } catch (e) { toast('Referencja „' + f.name + '”: ' + errText(e), 'bad'); } }
    b.rules = b.rules || ''; touch(); this.render(); toast('Przeanalizowano referencje: ' + describeRefs(b.refs.filter((r) => r.an)), 'ok', 7000);
  },
  suggestPalette() {
    const b = P.cur.brand, rs = b.refs.filter((r) => r.an); if (!rs.length) { toast('Najpierw dodaj referencje (obrazy).', 'warn'); return; }
    const all = []; rs.forEach((r) => r.an.palette.forEach((p) => all.push({ hex: p.hex, w: p.share / rs.length }))); const merged = []; for (const p of all.sort((a, b2) => b2.w - a.w)) { const m = merged.find((q) => { const a = hex2rgb(q.hex), c = hex2rgb(p.hex); return Math.hypot(a[0] - c[0], a[1] - c[1], a[2] - c[2]) < 48; }); if (m) m.w += p.w; else merged.push({ ...p }); }
    const sat = (x) => { const [r, g, bb] = hex2rgb(x); return (Math.max(r, g, bb) - Math.min(r, g, bb)) / 255; }; const bgc = merged.slice().sort((a, c) => (lum(c.hex) * c.w) - (lum(a.hex) * a.w))[0] || merged[0];
    const dark = merged.filter((m) => m !== bgc).sort((a, c) => (lum(a.hex) - lum(c.hex)))[0] || merged[0], acc = merged.filter((m) => m !== bgc && m !== dark).sort((a, c) => sat(c.hex) * (1 + c.w) - sat(a.hex) * (1 + a.w))[0] || merged[merged.length - 1];
    const sw = (hx, nm) => h('div', { style: { flex: 1 } }, h('div', { class: 'sw', style: { background: hx, color: readable(hx) } }, nm), h('div', { class: 'fine' }, hx));
    modal('Propozycja kolorów z referencji', h('div', {}, h('div', { class: 'row' }, sw(dark.hex.toUpperCase(), 'Primary'), sw(bgc.hex.toUpperCase(), 'Background'), sw(acc.hex.toUpperCase(), 'Accent')), h('p', { class: 'hint', html: rich('Opis stylu z analizy: ' + describeRefs(rs) + '. (Role możesz później zmienić ręcznie.)') })), [{ t: 'Użyj tych kolorów', cls: 'pri', fn: () => { b.colors = { primary: dark.hex.toUpperCase(), background: bgc.hex.toUpperCase(), accent: acc.hex.toUpperCase() }; b.style = (b.style ? b.style + '; ' : '') + describeRefs(rs).split(',').slice(0, 2).join(','); touch(); this.render(); } }, { t: 'Anuluj' }]);
  },
  async aiStyle() {
    const b = P.cur.brand, imgs = b.refs.filter((r) => !r.pdf).slice(0, 4); if (!imgs.length) { toast('Dodaj referencje w JPG/PNG/WEBP.', 'warn'); return; }
    const st = await AI.status(true); if (!st.ckey) { toast('Analiza AI obrazów wymaga klucza Claude (ANTHROPIC_API_KEY) w Workerze. Zostaje analiza lokalna: ' + describeRefs(b.refs.filter((r) => r.an)), 'warn', 8000); return; }
    const pr = progressModal('Analiza stylu referencji (AI)'); pr.set(0.1, 'przygotowanie obrazów');
    try {
      const b64 = []; for (const r of imgs) { const im = await Assets.img(r.id), s = Math.min(1, 900 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); b64.push(c.toDataURL('image/jpeg', 0.82).split(',')[1]); }
      pr.set(0.4, 'analiza'); const t = await AI.vision('Jesteś dyrektorem artystycznym. Analizujesz grafiki z Instagrama marki i wyciągasz wspólne zasady (nie kopiujesz jednego projektu). Pisz po polsku, konkretnie.', b64, 'Zwróć JSON: {"kompozycja":"","uklad":"","proporcje":"","typografia":"","hierarchia":"","kolory":"","tla":"","przejscia":"","estetyka":"","zasady":["max 8 krótkich, wykonalnych zasad do generowania nowych grafik"]}. Tylko JSON.', 1600);
      const m = t.match(/\{[\s\S]*\}/); const j = JSON.parse(m[0]); b.analysis = j; b.rules = (j.zasady || []).join('; '); touch(); pr.close(); this.render(); toast('Zasady wizualne zapisane w marce.', 'ok');
    } catch (e) { pr.close(); toast('Analiza AI nieudana: ' + errText(e), 'bad', 7000); }
  },
  renderRight() {
    const R = this.right, b = P.cur.brand; R.innerHTML = '';
    const sw = (role, label) => h('div', { style: { flex: 1 } }, h('div', { class: 'sw', style: { background: b.colors[role], color: readable(b.colors[role]) } }, label), h('div', { class: 'fine' }, b.colors[role]));
    R.append(h('h3', { style: { marginTop: 0 } }, 'Brand Kit'), h('div', { class: 'row' }, sw('primary', 'Primary'), sw('background', 'Background'), sw('accent', 'Accent')),
      h('div', { class: 'card', style: { marginTop: '12px', background: b.colors.background, color: b.colors.primary } }, h('div', { style: { fontFamily: `"${b.headingFont}"`, fontSize: '30px', fontWeight: 800, lineHeight: 1.1 } }, 'Nagłówek marki: ' + P.cur.name), h('div', { style: { fontFamily: `"${b.bodyFont}"`, fontSize: '16px', marginTop: '6px' } }, 'Tekst podstawowy, który ma się dobrze czytać. ', h('b', { style: { color: b.colors.accent } }, 'Akcent'), ' i ', h('u', {}, 'wyróżnienia'), '.'), h('span', { style: { display: 'inline-block', marginTop: '10px', background: b.colors.accent, color: readable(b.colors.accent), padding: '6px 16px', borderRadius: '99px', fontWeight: 700 } }, 'Przycisk CTA')));
    this.tplBox = h('div', { class: 'cards' }); this.animBox = h('div', { class: 'cards' });
    R.append(h('h3', {}, 'Zestaw szablonów (na bazie marki)'), h('div', { class: 'hint', html: rich('Szablony przeliczają się po każdej zmianie marki. W zakładce „Grafiki” dodasz je jednym kliknięciem.') }), this.tplBox, h('h3', {}, 'Biblioteka przejść i animacji'), h('div', { class: 'hint', html: rich('Podgląd na żywo każdej animacji (wejścia, kinetyczny tekst, maski, ruch ciągły). Używasz ich w zakładce „Wideo”.') }), this.animBox);
    this.refreshRight();
  },
  refreshRight: debounce(function () { Brand._refreshRight(); }, 120),
  _refreshRight() {
    if (!this.tplBox || !P.cur) return; this.tplBox.innerHTML = '';
    TPL_KINDS.forEach(([k, n], i) => { try { const sc = makeScene(k, TPL_SAMPLE[k], 'post45', i); this.tplBox.append(h('div', { class: 'card' }, thumb(sc, 0, 220), h('div', { class: 'cap' }, h('span', {}, n)))); } catch (e) { console.warn(e); } });
    this.minis = []; this.animBox.innerHTML = '';
    for (const [p, n] of ANIMS.filter((a) => a[0] !== 'none')) this.mini(n, { in: { p, d: 1.1, dl: 0.1, e: p === 'pop' ? 'outBack' : 'outCubic', dir: 'left' } });
    for (const [p, n] of LOOPS.filter((a) => a[0] !== 'none')) this.mini(n + ' (ruch ciągły)', null, { p, amp: 1.3, spd: 1 });
  },
  mini(name, inn, loop) {
    const b = P.cur.brand, sc = { w: 400, h: 300, bg: { type: 'color', c1: b.colors.primary }, layers: [] }; const l = mkLayer('text', { x: 200, y: 150, w: 360, t0: 0, t1: 2.6 }); Object.assign(l.text, { s: 'Aa Tekst', size: 74, font: b.headingFont, color: b.colors.background, weight: 800 });
    if (inn) l.anim.in = inn.in; if (loop) l.anim.loop = loop; l.anim.out = { p: 'fade', d: 0.35, dl: 0, e: 'inCubic', dir: 'bottom' };
    if (loop && loop.p === 'kenburns') { const im = mkLayer('shape', { x: 200, y: 150, w: 400, h: 300, t0: 0, t1: 2.6 }); im.shape.fill = b.colors.accent; sc.layers.push(im); }
    sc.layers.push(l); const c = document.createElement('canvas'); c.width = 280; c.height = 210; this.animBox.append(h('div', { class: 'card' }, c, h('div', { class: 'cap' }, h('span', {}, name)))); this.minis.push({ c, sc });
  },
  show() {
    if (!this.built) this.build(); cancelAnimationFrame(this.raf);
    const loop = (ts) => { if (S.tab !== 'brand') return; const t = (ts / 1000) % 3; for (const m of this.minis || []) { const x = m.c.getContext('2d'); x.setTransform(280 / 400, 0, 0, 280 / 400, 0, 0); drawScene(x, m.sc, t, {}); } this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
  },
};
