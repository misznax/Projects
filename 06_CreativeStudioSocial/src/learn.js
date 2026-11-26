/* UCZENIE SIĘ Z MATERIAŁU INSTRUKTAŻOWEGO (karuzela / rolka): z gotowych grafik odczytuje tło (poświaty), kolory, pasek postępu,
   stopkę, bloki tekstu i zdjęcie → „DNA” stylu, które steruje szablonami (brand.dna). Wszystko lokalnie w przeglądarce, bez kluczy. */
const Learn = {
  rgb2hsv(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let hh = 0; if (d) { if (mx === r) hh = ((g - b) / d) % 6; else if (mx === g) hh = (b - r) / d + 2; else hh = (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; } return [hh, mx ? d / mx : 0, mx]; },
  cls(r, g, b) { const [hh, s, v] = this.rgb2hsv(r, g, b); if (s < 0.22 || v < 0.12) return null; if (hh >= 235 && hh <= 300) return 'v'; if (hh >= 5 && hh <= 52) return 'a'; return null; }, // v = fiolet, a = pomarańcz/żółć
  // Analiza jednego obrazu (HTMLImageElement) → cechy
  analyze(im) {
    const W = 108, H = Math.max(24, Math.round(W * im.naturalHeight / im.naturalWidth)), c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, W, H); const d = x.getImageData(0, 0, W, H).data, n = W * H;
    const Lm = new Float32Array(n), cl = new Array(n); for (let i = 0; i < n; i++) { const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2]; Lm[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; cl[i] = this.cls(r, g, b); }
    // tło bazowe = średnia z najciemniejszych 25% pikseli
    const idx = Array.from({ length: n }, (_, i) => i).sort((p, q) => Lm[p] - Lm[q]), dk = idx.slice(0, Math.floor(n * 0.25)); let br = 0, bg = 0, bb = 0; for (const i of dk) { br += d[i * 4]; bg += d[i * 4 + 1]; bb += d[i * 4 + 2]; } const base = [br / dk.length, bg / dk.length, bb / dk.length];
    // poświaty: komórki 9×(9·H/W), tylko piksele „tła” (bez jasnego tekstu)
    const GX = 9, GY = Math.max(6, Math.round(GX * H / W)), cw = W / GX, ch = H / GY, cells = { v: [], a: [] }; let photoCells = 0;
    for (let gy = 0; gy < GY; gy++) for (let gx = 0; gx < GX; gx++) {
      let sr = 0, sg = 0, sb = 0, k = 0, vr = 0, mu = 0; const px = [];
      for (let yy = Math.floor(gy * ch); yy < Math.floor((gy + 1) * ch); yy++) for (let xx = Math.floor(gx * cw); xx < Math.floor((gx + 1) * cw); xx++) { const i = yy * W + xx; if (Math.max(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]) > 158) continue; sr += d[i * 4]; sg += d[i * 4 + 1]; sb += d[i * 4 + 2]; k++; px.push(Lm[i]); }
      if (k < 6) continue; const r = sr / k, g = sg / k, b = sb / k; mu = px.reduce((a, q) => a + q, 0) / k; for (const q of px) vr += (q - mu) ** 2; vr = Math.sqrt(vr / k);
      if (gy < GY * 0.65 && vr > 0.1 && mu > 0.17) photoCells++; const dl = Math.hypot(r - base[0], g - base[1], b - base[2]) / 255, cc = this.cls(r, g, b); if (cc && dl > 0.07) cells[cc].push({ gx, gy, s: dl });
    }
    const glows = []; for (const key of ['v', 'a']) { const cs = cells[key]; if (!cs.length) continue; const pk = cs.reduce((a, q) => (q.s > a.s ? q : a)), strong = cs.filter((q) => q.s >= pk.s * 0.4); if (pk.s < 0.1) continue;
      let px = (pk.gx + 0.5) / GX, py = (pk.gy + 0.5) / GY; px = px < 0.2 ? -0.02 : px > 0.8 ? 1.02 : px; py = py < 0.2 ? -0.02 : py > 0.8 ? 1.04 : py; const area = strong.length / (GX * GY);
      glows.push({ x: +px.toFixed(2), y: +py.toFixed(2), r: +clamp(0.45 + Math.sqrt(area) * 1.1, 0.6, 1.1).toFixed(2), c: key, a: +clamp(pk.s * 1.25, 0.15, 0.8).toFixed(2), peak: +pk.s.toFixed(3) }); }
    // pasek postępu: górne 12% obrazu w wyższej rozdzielczości; liczymy ciągi pomarańczowych segmentów na najlepszym rzędzie
    let seg = 0; { const pw = 360, ph = Math.max(10, Math.round(pw * im.naturalHeight / im.naturalWidth * 0.12)), pc = document.createElement('canvas'); pc.width = pw; pc.height = ph; const px2 = pc.getContext('2d', { willReadFrequently: true }); px2.drawImage(im, 0, 0, im.naturalWidth, im.naturalHeight * 0.12, 0, 0, pw, ph); const pd = px2.getImageData(0, 0, pw, ph).data;
      for (let yy = 0; yy < ph; yy++) { let inRun = false, r = 0, cover = 0; for (let xx = 0; xx < pw; xx++) { const i = (yy * pw + xx) * 4, on = this.cls(pd[i], pd[i + 1], pd[i + 2]) === 'a' && Math.max(pd[i], pd[i + 1], pd[i + 2]) > 170; if (on) cover++; if (on && !inRun) r++; inRun = on; } if (cover / pw > 0.04 && cover / pw < 0.9 && r > seg) seg = r; } }
    const hasProgress = seg >= 1;
    // pasma tekstu: jasne piksele (L>0.55) pogrupowane w pasy poziome
    const rows = []; for (let yy = 0; yy < H; yy++) { let k = 0, ora = 0, vio = 0; for (let xx = 0; xx < W; xx++) { const i = yy * W + xx; if (Lm[i] > 0.5) { k++; if (cl[i] === 'a') ora++; else if (cl[i] === 'v') vio++; } } rows.push({ k: k / W, ora: ora / W, vio: vio / W }); }
    const bands = []; let cur = null; rows.forEach((r, yy) => { if (r.k > 0.018) { if (!cur) cur = { y0: yy, y1: yy, ora: 0, vio: 0, k: 0 }; cur.y1 = yy; cur.ora += r.ora; cur.vio += r.vio; cur.k += r.k; } else if (cur) { if (cur.y1 - cur.y0 >= 1) bands.push(cur); cur = null; } }); if (cur) bands.push(cur);
    const tb = bands.map((b) => ({ y0: +(b.y0 / H).toFixed(3), y1: +((b.y1 + 1) / H).toFixed(3), h: +((b.y1 - b.y0 + 1) / H).toFixed(3), grad: b.ora > b.k * 0.35, violet: b.vio > b.k * 0.25 })).filter((b) => b.y0 > 0.09 && b.y1 < 0.9);
    const title = tb.filter((b) => b.grad).sort((a, b) => b.h - a.h)[0] || null, foot = (() => { let l = 0, r2 = 0; for (let yy = Math.floor(H * 0.88); yy < H; yy++) for (let xx = 0; xx < W; xx++) { const i = yy * W + xx; if (Lm[i] > 0.2) { if (xx < W * 0.25) l++; else if (xx > W * 0.6) r2++; } } return { logo: l > 4, handle: r2 > 6 }; })();
    const photo = photoCells / (GX * GY * 0.65) > 0.3, big = Lm.reduce((a, q) => a + (q > 0.5 ? 1 : 0), 0) / n;
    // paleta pomocnicza: 6-bitowe kubełki o największym udziale (bez szarości)
    const bk = new Map(); for (let i = 0; i < n; i += 1) { const r = d[i * 4] >> 5, g = d[i * 4 + 1] >> 5, b = d[i * 4 + 2] >> 5, k = (r << 6) | (g << 3) | b; const o = bk.get(k) || { n: 0, r: 0, g: 0, b: 0 }; o.n++; o.r += d[i * 4]; o.g += d[i * 4 + 1]; o.b += d[i * 4 + 2]; bk.set(k, o); }
    const pal = [...bk.values()].map((o) => ({ hex: rgb2hex(o.r / o.n, o.g / o.n, o.b / o.n), share: o.n / n, hsv: this.rgb2hsv(o.r / o.n, o.g / o.n, o.b / o.n) })).filter((p) => p.hsv[1] > 0.45 && p.hsv[2] > 0.5).sort((a, b) => b.share - a.share).slice(0, 4).map((p) => ({ hex: p.hex, share: +p.share.toFixed(3) }));
    return { base: rgb2hex(...base), glows, progress: { on: hasProgress, segments: seg }, bands: tb, titleBand: title, footer: foot, photo, textShare: +big.toFixed(3), accents: pal, size: [im.naturalWidth, im.naturalHeight] };
  },
  // Zgrubna klasyfikacja slajdu (gdy autor nie podał rodzaju)
  classify(f, i, n) {
    if (f.photo) return i === 0 ? 'cover' : 'photo'; if (i === 0) return 'cover'; if (i === n - 1) return 'recap';
    const g = f.bands.filter((b) => b.grad).length, v = f.bands.filter((b) => b.violet).length; if (f.bands.length <= 3 && g) return 'stat'; if (f.bands.length >= 7) return 'list'; if (v) return 'point'; return 'point';
  },
  // Agregacja cech wielu slajdów → DNA
  dna(feats) {
    const med = (a) => { a = a.slice().sort((p, q) => p - q); return a.length ? a[Math.floor(a.length / 2)] : 0; }, out = { glows: [], progress: feats.filter((f) => f.progress.on).length >= feats.length * 0.4, grain: 0.05, grid: 0.035, caps: true, italic: true, titleW: 800, glass: true };
    for (const key of ['v', 'a']) { const gs = feats.map((f) => f.glows.find((g) => g.c === key)).filter(Boolean); if (gs.length < Math.max(1, feats.length * 0.3)) continue; out.glows.push({ x: med(gs.map((g) => g.x)), y: med(gs.map((g) => g.y)), r: med(gs.map((g) => g.r)), c: key, a: +med(gs.map((g) => g.a)).toFixed(2) }); }
    if (!out.glows.length) out.glows = jclone(DNA_DEFAULT.glows); out.titleBands = med(feats.map((f) => (f.titleBand ? f.titleBand.y0 : 0.1))); out.footer = feats.filter((f) => f.footer.logo).length >= feats.length / 2 ? 'logo+handle' : 'handle'; return out;
  },
  async fromBlobs(blobs) { const feats = []; for (const b of blobs) { const im = await Assets.imgFromBlob(b); feats.push(this.analyze(im)); await tick(); } return { feats, dna: this.dna(feats), kinds: feats.map((f, i) => this.classify(f, i, feats.length)) }; },
  // Wideo (rolka) → klatki co ~1,2 s (do 12) → analiza jak karuzeli
  async fromVideo(file) {
    const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.src = URL.createObjectURL(file); await new Promise((res, rej) => { v.onloadedmetadata = res; v.onerror = () => rej(new Error('Nie można odczytać wideo')); }); const D = v.duration || 10, N = Math.min(12, Math.max(3, Math.round(D / 1.2))), c = document.createElement('canvas'), blobs = [];
    c.width = v.videoWidth; c.height = v.videoHeight; const x = c.getContext('2d'); for (let i = 0; i < N; i++) { v.currentTime = Math.min(D - 0.05, (i + 0.5) * D / N); await new Promise((r) => { v.onseeked = r; }); x.drawImage(v, 0, 0); blobs.push(await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85))); } URL.revokeObjectURL(v.src); return this.fromBlobs(blobs);
  },
  describe(dna) { const g = (dna.glows || []).map((q) => (q.c === 'v' ? 'fioletowa' : 'pomarańczowa') + ' poświata ' + (q.y < 0.5 ? 'u góry' : 'na dole') + ' ' + (q.x < 0.5 ? 'z lewej' : 'z prawej')).join(', '); return [g, dna.progress ? 'pasek postępu na górze' : 'bez paska postępu', dna.footer === 'logo+handle' ? 'stopka: logo + @konto' : 'stopka: @konto'].filter(Boolean).join(' · '); },
};
