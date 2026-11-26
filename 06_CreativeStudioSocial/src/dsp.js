/* DSP — czysty JS (bez Web Audio), działa w przeglądarce i w Node (testy). Kanały = tablice Float32Array. */
const DSP = (function () {
  const PI = Math.PI, TWO_PI = PI * 2;
  const dB = (x) => 20 * Math.log10(Math.max(x, 1e-12));
  const lin = (d) => Math.pow(10, d / 20);

  // ── FFT radix-2 (in-place) ──
  const _tw = {};
  function twiddles(n) {
    if (_tw[n]) return _tw[n];
    const c = new Float64Array(n / 2), s = new Float64Array(n / 2);
    for (let i = 0; i < n / 2; i++) { c[i] = Math.cos(TWO_PI * i / n); s[i] = -Math.sin(TWO_PI * i / n); }
    const rev = new Uint32Array(n); let bits = Math.log2(n);
    for (let i = 0; i < n; i++) { let r = 0; for (let b = 0; b < bits; b++) if (i & (1 << b)) r |= 1 << (bits - 1 - b); rev[i] = r; }
    return (_tw[n] = { c, s, rev });
  }
  function fft(re, im, inverse) {
    const n = re.length, { c, s, rev } = twiddles(n);
    for (let i = 0; i < n; i++) { const j = rev[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
    for (let size = 2; size <= n; size <<= 1) {
      const half = size >> 1, step = n / size;
      for (let i = 0; i < n; i += size) {
        for (let j = 0, k = 0; j < half; j++, k += step) {
          const wr = c[k], wi = inverse ? -s[k] : s[k];
          const a = i + j, b = a + half;
          const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        }
      }
    }
    if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }

  // ── Biquad (RBJ) ──
  function biquad(type, fs, f0, Q, gainDb) {
    const A = Math.pow(10, (gainDb || 0) / 40), w0 = TWO_PI * f0 / fs, cw = Math.cos(w0), sw = Math.sin(w0), al = sw / (2 * (Q || 0.7071));
    let b0, b1, b2, a0, a1, a2;
    switch (type) {
      case 'lp': b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = b0; a0 = 1 + al; a1 = -2 * cw; a2 = 1 - al; break;
      case 'hp': b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = b0; a0 = 1 + al; a1 = -2 * cw; a2 = 1 - al; break;
      case 'bp': b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * cw; a2 = 1 - al; break;
      case 'peak': b0 = 1 + al * A; b1 = -2 * cw; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cw; a2 = 1 - al / A; break;
      case 'ls': { const t = 2 * Math.sqrt(A) * al; b0 = A * ((A + 1) - (A - 1) * cw + t); b1 = 2 * A * ((A - 1) - (A + 1) * cw); b2 = A * ((A + 1) - (A - 1) * cw - t); a0 = (A + 1) + (A - 1) * cw + t; a1 = -2 * ((A - 1) + (A + 1) * cw); a2 = (A + 1) + (A - 1) * cw - t; break; }
      case 'hs': { const t = 2 * Math.sqrt(A) * al; b0 = A * ((A + 1) + (A - 1) * cw + t); b1 = -2 * A * ((A - 1) + (A + 1) * cw); b2 = A * ((A + 1) + (A - 1) * cw - t); a0 = (A + 1) - (A - 1) * cw + t; a1 = 2 * ((A - 1) - (A + 1) * cw); a2 = (A + 1) - (A - 1) * cw - t; break; }
      default: throw new Error('biquad: ' + type);
    }
    return { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: a1 / a0, a2: a2 / a0 };
  }
  function applyBiquad(x, c, inPlace) {
    const y = inPlace ? x : new Float32Array(x.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < x.length; i++) {
      const xi = x[i], yi = c.b0 * xi + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
      x2 = x1; x1 = xi; y2 = y1; y1 = yi; y[i] = yi;
    }
    return y;
  }

  // ── Pomiary ──
  const peak = (x) => { let m = 0; for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > m) m = a; } return m; };
  const peakDb = (chs) => dB(Math.max(...chs.map(peak)));
  function rms(x, a, b) { let s = 0; a = a || 0; b = b == null ? x.length : b; for (let i = a; i < b; i++) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, b - a)); }
  function clipCount(chs, thr) { thr = thr || 0.9999; let n = 0; for (const x of chs) for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) >= thr) n++; return n; }

  // K-weighting wg ITU-R BS.1770-4 (współczynniki liczone dla dowolnego fs)
  function kWeight(x, fs) {
    const K1 = Math.tan(PI * 1681.974450955533 / fs), Q1 = 0.7071752369554196, Vh = Math.pow(10, 3.999843853973347 / 20), Vb = Math.pow(Vh, 0.4996667741545416);
    const a01 = 1 + K1 / Q1 + K1 * K1;
    const s1 = { b0: (Vh + Vb * K1 / Q1 + K1 * K1) / a01, b1: 2 * (K1 * K1 - Vh) / a01, b2: (Vh - Vb * K1 / Q1 + K1 * K1) / a01, a1: 2 * (K1 * K1 - 1) / a01, a2: (1 - K1 / Q1 + K1 * K1) / a01 };
    const K2 = Math.tan(PI * 38.13547087602444 / fs), Q2 = 0.5003270373238773, a02 = 1 + K2 / Q2 + K2 * K2;
    const s2 = { b0: 1, b1: -2, b2: 1, a1: 2 * (K2 * K2 - 1) / a02, a2: (1 - K2 / Q2 + K2 * K2) / a02 };
    return applyBiquad(applyBiquad(x, s1), s2);
  }
  // Głośność zintegrowana (LUFS), bramki: -70 LUFS bezwzględna, -10 LU względna
  function integratedLoudness(chs, fs) {
    const w = chs.map((x) => kWeight(x, fs)), N = w[0].length, blk = Math.round(0.4 * fs), step = Math.round(0.1 * fs);
    if (N < blk) return -Infinity;
    const zs = [];
    for (let s = 0; s + blk <= N; s += step) {
      let z = 0;
      for (const x of w) { let e = 0; for (let i = s; i < s + blk; i++) e += x[i] * x[i]; z += e / blk; }
      zs.push(z);
    }
    const L = (z) => -0.691 + 10 * Math.log10(Math.max(z, 1e-20));
    const abs = zs.filter((z) => L(z) > -70);
    if (!abs.length) return -Infinity;
    const rel = L(abs.reduce((a, b) => a + b, 0) / abs.length) - 10;
    const fin = abs.filter((z) => L(z) > rel);
    if (!fin.length) return -Infinity;
    return L(fin.reduce((a, b) => a + b, 0) / fin.length);
  }
  // Szczyt rzeczywisty (dBTP) — nadpróbkowanie 4× oknem sinc (Kaiser-like Hann)
  let _tp = null;
  function tpKernel() {
    if (_tp) return _tp;
    const L = 12, ph = [];
    for (let p = 1; p < 4; p++) {
      const k = new Float64Array(2 * L);
      for (let j = 0; j < 2 * L; j++) { const t = j - (L - 1) - p / 4, sinc = Math.abs(t) < 1e-9 ? 1 : Math.sin(PI * t) / (PI * t); k[j] = sinc * (0.5 + 0.5 * Math.cos(PI * t / L)); }
      ph.push(k);
    }
    return (_tp = { L, ph });
  }
  function truePeak(chs) {
    const { L, ph } = tpKernel(); let m = 0;
    for (const x of chs) {
      m = Math.max(m, peak(x));
      for (let i = L; i < x.length - L; i++) { // tylko okolice potencjalnych szczytów
        const a = Math.abs(x[i]); if (a < 0.4 || a < Math.abs(x[i - 1]) * 0.7) continue;
        for (let p = 0; p < 3; p++) { let s = 0; const k = ph[p]; for (let j = 0; j < 2 * L; j++) s += x[i - (L - 1) + j] * k[j]; if (Math.abs(s) > m) m = Math.abs(s); }
      }
    }
    return dB(m);
  }

  // ── Resampling (Lanczos, z antyaliasingiem przy ratio>1) ──
  // step = o ile próbek wejścia przesuwamy się na 1 próbkę wyjścia (step>1 = skraca i podnosi ton)
  function resampleStep(x, step, outLen) {
    const a = 8, sc = Math.max(1, step), out = new Float32Array(outLen), N = x.length;
    for (let o = 0; o < outLen; o++) {
      const c = o * step, i0 = Math.floor(c - a * sc), i1 = Math.ceil(c + a * sc); let s = 0, wsum = 0;
      for (let i = i0; i <= i1; i++) {
        const t = (i - c) / sc; if (t <= -a || t >= a) continue;
        const l = t === 0 ? 1 : (Math.sin(PI * t) / (PI * t)) * (Math.sin(PI * t / a) / (PI * t / a));
        wsum += l; if (i >= 0 && i < N) s += x[i] * l;
      }
      out[o] = wsum ? s / wsum : 0;
    }
    return out;
  }
  // zmiana częstotliwości próbkowania (np. 44100 → 48000)
  function resampleRate(chs, fsIn, fsOut) { if (fsIn === fsOut) return chs; const step = fsIn / fsOut, n = Math.round(chs[0].length / step); return chs.map((x) => resampleStep(x, step, n)); }

  // ── WSOLA: zmiana tempa bez zmiany wysokości (ratio>1 = szybciej) ──
  function wsola(chs, ratio, fs) {
    if (Math.abs(ratio - 1) < 1e-4) return chs.map((x) => Float32Array.from(x));
    const N = chs[0].length, win = Math.max(256, (Math.round(0.03 * fs) >> 1) << 1), Hs = win >> 1, Ha = Hs * ratio, tol = Math.round(0.016 * fs);
    const D = 4, mono = new Float32Array(Math.ceil(N / D)); // zdecymowana suma do szukania korelacji
    for (let i = 0; i < mono.length; i++) { let s = 0; for (let c = 0; c < chs.length; c++) for (let d = 0; d < D; d++) { const v = chs[c][i * D + d]; if (v !== undefined) s += v; } mono[i] = s / (D * chs.length); }
    const outLen = Math.round(N / ratio) + win, outs = chs.map(() => new Float32Array(outLen)), hann = new Float32Array(win);
    for (let i = 0; i < win; i++) hann[i] = 0.5 - 0.5 * Math.cos(TWO_PI * i / win);
    let prev = 0; const frames = Math.ceil((N / ratio) / Hs) + 1;
    for (let k = 0; k < frames; k++) {
      const nominal = Math.round(k * Ha); let pos = nominal;
      if (k > 0) {
        const tgt = prev + Hs, wd = win / D | 0, lo = Math.max(0, nominal - tol), hi = Math.min(N - win, nominal + tol);
        if (hi >= lo && tgt + win <= N) {
          let best = -Infinity, bp = Math.min(Math.max(nominal, lo), hi);
          for (let p = lo; p <= hi; p += D) { // zgrubnie na zdecymowanym sygnale
            let c = 0, e = 1e-9; const pd = p / D | 0, td = tgt / D | 0;
            for (let i = 0; i < wd; i += 1) { const a = mono[pd + i] || 0, b = mono[td + i] || 0; c += a * b; e += a * a; }
            const sc = c / Math.sqrt(e); if (sc > best) { best = sc; bp = p; }
          }
          let b2 = -Infinity, fp = bp; // dokładnie ±D na pełnej rozdzielczości (kanał 0)
          const x0 = chs[0];
          for (let p = Math.max(lo, bp - D); p <= Math.min(hi, bp + D); p++) {
            let c = 0, e = 1e-9; for (let i = 0; i < win; i += 2) { const a = x0[p + i], b = x0[tgt + i]; c += a * b; e += a * a; }
            const sc = c / Math.sqrt(e); if (sc > b2) { b2 = sc; fp = p; }
          }
          pos = fp;
        } else pos = Math.min(Math.max(nominal, 0), Math.max(0, N - win));
      }
      pos = Math.min(Math.max(pos, 0), Math.max(0, N - win)); prev = pos;
      const o0 = k * Hs; if (o0 + win > outLen) break;
      for (let c = 0; c < chs.length; c++) { const x = chs[c], y = outs[c]; for (let i = 0; i < win; i++) y[o0 + i] += x[pos + i] * hann[i]; }
    }
    const L = Math.round(N / ratio);
    return outs.map((y) => y.subarray(0, L));
  }
  // zmiana wysokości (półtony) bez zmiany czasu trwania: rozciągnij o r, potem resample
  function pitchShift(chs, semitones, fs) {
    if (Math.abs(semitones) < 1e-3) return chs.map((x) => Float32Array.from(x));
    const r = Math.pow(2, semitones / 12), N = chs[0].length;
    const st = wsola(chs, 1 / r, fs); // wydłuża o r
    return st.map((x) => resampleStep(x, r, N));
  }

  // ── STFT: denoise + de-reverb ──
  function stftProcess(chs, fs, fn) {
    const n = 2048, hop = 512, win = new Float64Array(n);
    for (let i = 0; i < n; i++) win[i] = 0.5 - 0.5 * Math.cos(TWO_PI * i / n);
    const N = chs[0].length, frames = Math.ceil((N + n) / hop), pad = n;
    const outs = [];
    for (let c = 0; c < chs.length; c++) {
      const x = chs[c], L = N + 2 * pad, y = new Float64Array(L), nrm = new Float64Array(L), re = new Float64Array(n), im = new Float64Array(n);
      const mags = [], phs = [];
      for (let f = 0; f < frames; f++) {
        const s = f * hop - pad;
        for (let i = 0; i < n; i++) { const v = s + i >= 0 && s + i < N ? x[s + i] : 0; re[i] = v * win[i]; im[i] = 0; }
        fft(re, im, false);
        const m = new Float32Array(n / 2 + 1), p = new Float32Array(n / 2 + 1);
        for (let k = 0; k <= n / 2; k++) { m[k] = Math.hypot(re[k], im[k]); p[k] = Math.atan2(im[k], re[k]); }
        mags.push(m); phs.push(p);
      }
      const gains = fn(mags, c); // zwraca tablicę wzmocnień [frame][bin]
      for (let f = 0; f < frames; f++) {
        const m = mags[f], p = phs[f], g = gains[f];
        for (let k = 0; k <= n / 2; k++) { const v = m[k] * g[k]; re[k] = v * Math.cos(p[k]); im[k] = v * Math.sin(p[k]); if (k > 0 && k < n / 2) { re[n - k] = re[k]; im[n - k] = -im[k]; } }
        im[0] = 0; im[n / 2] = 0;
        fft(re, im, true);
        const s = f * hop;
        for (let i = 0; i < n; i++) { y[s + i] += re[i] * win[i]; nrm[s + i] += win[i] * win[i]; }
      }
      const out = new Float32Array(N);
      for (let i = 0; i < N; i++) { const d = nrm[i + pad]; out[i] = d > 1e-6 ? y[i + pad] / d : 0; }
      outs.push(out);
    }
    return outs;
  }
  // amount 0..1 (siła), reverb 0..1; profil szumu: z cichych klatek (percentyl 15) albo z zakresu noiseRange [a,b] w sekundach
  function denoise(chs, fs, opt) {
    const amount = opt.amount == null ? 0.5 : opt.amount, rev = opt.reverb || 0;
    if (amount <= 0 && rev <= 0) return chs.map((x) => Float32Array.from(x));
    const alpha = 1 + 2.2 * amount, gmin = lin(-(6 + 22 * amount)), hop = 512, K = 1025;
    return stftProcess(chs, fs, (mags) => {
      const F = mags.length, noise = new Float32Array(K);
      if (opt.noiseRange) {
        const a = Math.max(0, Math.floor((opt.noiseRange[0] * fs) / hop)), b = Math.min(F - 1, Math.ceil((opt.noiseRange[1] * fs) / hop));
        let cnt = 0; for (let f = a; f <= b; f++) { for (let k = 0; k < K; k++) noise[k] += mags[f][k] * mags[f][k]; cnt++; }
        if (cnt) for (let k = 0; k < K; k++) noise[k] /= cnt; else opt.noiseRange = null;
      }
      if (!opt.noiseRange) {
        const tmp = new Float32Array(F);
        for (let k = 0; k < K; k++) { for (let f = 0; f < F; f++) tmp[f] = mags[f][k] * mags[f][k]; const s = Float32Array.from(tmp).sort(); noise[k] = s[Math.floor(F * 0.15)] * 5.5; /* percentyl 15% rozkładu wykładniczego ≈ 0,16 średniej */ }
      }
      const ns = new Float32Array(K); // wygładzenie profilu po częstotliwości
      for (let k = 0; k < K; k++) { let s = 0, c = 0; for (let j = -3; j <= 3; j++) { const q = k + j; if (q >= 0 && q < K) { s += noise[q]; c++; } } ns[k] = s / c; }
      const G = [], prevG = new Float32Array(K).fill(1), lag = 7; const smooth = [];
      for (let f = 0; f < F; f++) {
        const g = new Float32Array(K), m = mags[f];
        for (let k = 0; k < K; k++) {
          const p = m[k] * m[k] + 1e-12; let sub = alpha * ns[k] * (amount > 0 ? 1 : 0);
          if (rev > 0 && f >= lag) { const pl = mags[f - lag][k]; sub += rev * 0.55 * Math.min(pl * pl, p) * Math.exp(-0.5); }
          let v = Math.max(gmin, 1 - sub / p); v = Math.sqrt(v);
          const att = v < prevG[k] ? 0.8 : 0.33; // szybkie zamykanie, wolniejsze otwieranie (mniej „muzykalnego szumu”)
          v = prevG[k] * (1 - att) + v * att; prevG[k] = v; g[k] = v;
        }
        smooth.push(g);
      }
      for (let f = 0; f < F; f++) { const g = smooth[f], o = new Float32Array(K); for (let k = 0; k < K; k++) { o[k] = (g[Math.max(0, k - 1)] + 2 * g[k] + g[Math.min(K - 1, k + 1)]) / 4; } G.push(o); }
      return G;
    });
  }

  // ── Trzaski (declick) ──
  function declick(chs, fs, sens) {
    sens = sens || 7; let fixed = 0;
    const out = chs.map((x) => {
      const y = Float32Array.from(x), n = y.length; let avg = 1e-4;
      for (let i = 2; i < n - 8; i++) {
        const pred = 2 * y[i - 1] - y[i - 2], r = Math.abs(y[i] - pred);
        if (r > sens * avg && r > 0.04) { // początek zakłócenia: interpoluj do powrotu (maks. 24 próbki)
          let j = i + 1; while (j < Math.min(n - 4, i + 24)) { const rr = Math.abs(y[j] - (2 * y[j - 1] - y[j - 2])); if (rr < sens * avg * 0.6) break; j++; }
          const a = y[i - 1], b = y[j], d = a - y[i - 2], e = y[j + 1] - b; const len = j - i + 1;
          for (let q = 0; q < len; q++) { const t = (q + 1) / (len + 1); const h00 = 2 * t * t * t - 3 * t * t + 1, h10 = t * t * t - 2 * t * t + t, h01 = -2 * t * t * t + 3 * t * t, h11 = t * t * t - t * t; y[i + q] = h00 * a + h10 * d * (len + 1) + h01 * b + h11 * e * (len + 1); }
          fixed++; i = j + 1;
        } else avg = avg * 0.999 + r * 0.001;
      }
      return y;
    });
    return { chs: out, fixed };
  }

  // ── Korektor ──
  const EQ_PRESETS = {
    glos: [{ t: 'hp', f: 80, q: 0.7 }, { t: 'peak', f: 250, q: 1, g: -2 }, { t: 'peak', f: 3500, q: 1, g: 2.5 }, { t: 'hs', f: 10000, q: 0.7, g: 1.5 }],
    meski: [{ t: 'hp', f: 70, q: 0.7 }, { t: 'peak', f: 200, q: 1, g: -2.5 }, { t: 'peak', f: 3000, q: 1, g: 2.5 }, { t: 'hs', f: 9000, q: 0.7, g: 1.5 }],
    zenski: [{ t: 'hp', f: 100, q: 0.7 }, { t: 'peak', f: 300, q: 1, g: -1.5 }, { t: 'peak', f: 4000, q: 1, g: 2 }, { t: 'hs', f: 10000, q: 0.7, g: 2 }],
    telefon: [{ t: 'hp', f: 120, q: 0.7 }, { t: 'peak', f: 400, q: 1, g: -3 }, { t: 'peak', f: 2800, q: 0.9, g: 3 }, { t: 'lp', f: 12000, q: 0.7 }],
  };
  function eq(chs, fs, bands) { return chs.map((x) => { let y = x; for (const b of bands) y = applyBiquad(y, biquad(b.t, fs, b.f, b.q || 0.7, b.g || 0)); return y === x ? Float32Array.from(x) : y; }); }

  // ── Kompresor dynamiki (feed-forward, sprzężony stereo) ──
  function compress(chs, fs, o) {
    const th = o.thresh == null ? -18 : o.thresh, ratio = o.ratio || 3, atk = Math.exp(-1 / (fs * (o.attack || 8) / 1000)), rel = Math.exp(-1 / (fs * (o.release || 120) / 1000)), knee = o.knee == null ? 6 : o.knee, mk = o.makeup || 0, N = chs[0].length;
    const out = chs.map(() => new Float32Array(N)); let env = 0, g = 0;
    for (let i = 0; i < N; i++) {
      let a = 0; for (const x of chs) { const v = Math.abs(x[i]); if (v > a) a = v; }
      env = a > env ? atk * env + (1 - atk) * a : rel * env + (1 - rel) * a;
      const lv = dB(env); let over = lv - th, gr = 0;
      if (2 * over < -knee) gr = 0; else if (2 * Math.abs(over) <= knee) gr = (1 / ratio - 1) * (over + knee / 2) ** 2 / (2 * knee); else gr = (1 / ratio - 1) * over;
      g = gr < g ? atk * g + (1 - atk) * gr : rel * g + (1 - rel) * gr; // g ≤ 0 (dB)
      const m = lin(g + mk); for (let c = 0; c < chs.length; c++) out[c][i] = chs[c][i] * m;
    }
    return out;
  }
  // ── De-esser (redukcja sybilantów w paśmie 4,5–9 kHz) ──
  function deess(chs, fs, o) {
    const amt = o.amount == null ? 0.5 : o.amount, f0 = o.freq || 6500; if (amt <= 0) return chs.map((x) => Float32Array.from(x));
    const bp = biquad('bp', fs, f0, 1.2), N = chs[0].length, rel = Math.exp(-1 / (fs * 0.05)), atk = Math.exp(-1 / (fs * 0.002));
    const bands = chs.map((x) => applyBiquad(x, bp)); const out = chs.map(() => new Float32Array(N));
    let e = 0, eb = 0, g = 1;
    for (let i = 0; i < N; i++) {
      let a = 0, b = 0; for (let c = 0; c < chs.length; c++) { a = Math.max(a, Math.abs(chs[c][i])); b = Math.max(b, Math.abs(bands[c][i])); }
      e = a > e ? atk * e + (1 - atk) * a : rel * e + (1 - rel) * a; eb = b > eb ? atk * eb + (1 - atk) * b : rel * eb + (1 - rel) * b;
      const ratio = eb / (e + 1e-9); let tg = 1; const thr = o.thresh || 0.45; if (eb > 0.01 && ratio > thr) tg = Math.max(lin(-12 * amt), Math.pow(thr / ratio, 1 + amt));
      g = tg < g ? 0.2 * g + 0.8 * tg : 0.995 * g + 0.005 * tg;
      for (let c = 0; c < chs.length; c++) out[c][i] = chs[c][i] + (g - 1) * bands[c][i];
    }
    return out;
  }

  // ── Cisza ──
  function removeSilence(chs, fs, o) {
    const thr = lin(o.thresh == null ? -45 : o.thresh), minMs = o.minMs || 350, keepMs = o.keepMs == null ? 120 : o.keepMs, w = Math.round(0.02 * fs), N = chs[0].length, nb = Math.floor(N / w);
    const loud = new Uint8Array(nb);
    for (let b = 0; b < nb; b++) { let m = 0; for (const x of chs) m = Math.max(m, rms(x, b * w, (b + 1) * w)); loud[b] = m > thr ? 1 : 0; }
    const regions = []; let b = 0;
    while (b < nb) { if (loud[b]) { b++; continue; } let e = b; while (e < nb && !loud[e]) e++; if ((e - b) * w / fs * 1000 >= minMs) regions.push([b * w, e * w]); b = e; }
    const keep = Math.round(keepMs / 1000 * fs), xf = Math.round(0.006 * fs), segs = []; let cur = 0;
    for (const [a, c] of regions) { const cutA = a + Math.floor(keep / 2), cutB = c - Math.ceil(keep / 2); if (cutB - cutA > 2 * xf) { segs.push([cur, cutA]); cur = cutB; } }
    segs.push([cur, N]);
    if (segs.length === 1) return { chs: chs.map((x) => Float32Array.from(x)), cuts: 0, removed: 0 };
    let total = 0; for (const [a, c] of segs) total += c - a;
    const out = chs.map(() => new Float32Array(total)); let p = 0, first = true;
    for (const [a, c] of segs) {
      for (let ch = 0; ch < chs.length; ch++) out[ch].set(chs[ch].subarray(a, c), p);
      if (!first) for (let i = 0; i < xf; i++) { const t = i / xf; for (let ch = 0; ch < chs.length; ch++) { out[ch][p + i] = chs[ch][a + i] * t + (chs[ch][a - xf + i] !== undefined ? chs[ch][a - xf + i] * 0 : 0); } }
      p += c - a; first = false;
    }
    return { chs: out, cuts: segs.length - 1, removed: (N - total) / fs };
  }

  // ── Limiter z wyprzedzeniem + normalizacja głośności ──
  function limit(chs, fs, ceilDb, relMs) {
    const ceil = lin(ceilDb), look = Math.round(0.005 * fs), N = chs[0].length, rel = Math.exp(-1 / (fs * (relMs || 80) / 1000));
    const need = new Float32Array(N); for (let i = 0; i < N; i++) { let a = 0; for (const x of chs) { const v = Math.abs(x[i]); if (v > a) a = v; } need[i] = a > ceil ? ceil / a : 1; }
    const g = new Float32Array(N); // minimalne okno + wygładzenie
    let cur = 1;
    // min w oknie wyprzedzającym (deque)
    const dq = []; const mn = new Float32Array(N);
    for (let i = N - 1; i >= 0; i--) { while (dq.length && need[dq[dq.length - 1]] >= need[i]) dq.pop(); dq.push(i); while (dq[0] > i + look) dq.shift(); mn[i] = need[dq[0]]; }
    for (let i = 0; i < N; i++) { const t = mn[i]; cur = t < cur ? cur + (t - cur) * (1 - Math.exp(-1 / (look / 3))) : rel * cur + (1 - rel) * t; if (cur > t) cur = Math.min(cur, t + (cur - t) * 0.0); g[i] = Math.min(cur, 1); }
    // zabezpieczenie: gwarantuj brak przekroczeń
    const out = chs.map((x) => { const y = new Float32Array(N); for (let i = 0; i < N; i++) { let v = x[i] * g[i]; if (v > ceil) v = ceil; else if (v < -ceil) v = -ceil; y[i] = v; } return y; });
    return out;
  }
  function loudnessNormalize(chs, fs, target, tpCeil) {
    const cur = integratedLoudness(chs, fs); if (!isFinite(cur)) return { chs, lufs: cur, gain: 0 };
    const scale = (g) => { const k = lin(g); return chs.map((x) => { const o = new Float32Array(x.length); for (let i = 0; i < x.length; i++) o[i] = x[i] * k; return o; }); };
    const base = target - cur; let gain = base, best = null;
    // Limiter odbiera część głośności → dobieramy wzmocnienie iteracyjnie (max +9 dB ponad bazę, żeby nie zniekształcać).
    for (let it = 0; it < 4; it++) {
      let y = scale(gain);
      for (let pass = 0; pass < 3; pass++) {
        y = limit(y, fs, tpCeil - 0.2 - pass * 0.3, 60);
        const tp = truePeak(y); if (tp <= tpCeil + 0.01) break;
        const k = lin(tpCeil - tp - 0.05); y = y.map((x) => { const o = new Float32Array(x.length); for (let i = 0; i < x.length; i++) o[i] = x[i] * k; return o; });
      }
      const l = integratedLoudness(y, fs); best = { chs: y, lufs: l, gain };
      if (!isFinite(l) || Math.abs(l - target) <= 0.3) break;
      gain += target - l; if (gain - base > 9) break;
    }
    return best;
  }

  // ── Ducking: obwiednia wzmocnienia muzyki wg głosu (wynik w tej samej częstotliwości co sygnał) ──
  function duckEnvelope(voice, fs, o) {
    const N = voice[0].length, depth = lin(-(o.depth == null ? 10 : o.depth)), atk = Math.exp(-1 / (fs * (o.attack || 0.08))), rel = Math.exp(-1 / (fs * (o.release || 0.45))), w = Math.round(0.02 * fs), nb = Math.floor(N / w);
    const lv = new Float32Array(nb); for (let b = 0; b < nb; b++) { let m = 0; for (const x of voice) m = Math.max(m, rms(x, b * w, (b + 1) * w)); lv[b] = dB(m); }
    const sorted = Float32Array.from(lv).sort(), p90 = sorted[Math.floor(nb * 0.9)] || -60, thr = Math.max(-55, p90 - 24), hold = Math.round((o.hold || 0.25) * fs / w);
    const act = new Uint8Array(nb); for (let b = 0; b < nb; b++) if (lv[b] > thr) { for (let h = 0; h <= hold && b + h < nb; h++) act[b + h] = 1; }
    const env = new Float32Array(N); let g = 1; const look = Math.round((o.lookahead || 0.06) * fs);
    for (let i = 0; i < N; i++) { const b = Math.min(nb - 1, Math.floor((i + look) / w)), t = act[b] ? depth : 1; g = t < g ? atk * g + (1 - atk) * t : rel * g + (1 - rel) * t; env[i] = g; }
    return env;
  }

  // ── Waveform ──
  function peaks(x, buckets, a, b) { a = a || 0; b = b == null ? x.length : b; const out = new Float32Array(buckets * 2), span = (b - a) / buckets; for (let k = 0; k < buckets; k++) { let mn = 0, mx = 0; const s = Math.floor(a + k * span), e = Math.max(s + 1, Math.floor(a + (k + 1) * span)); for (let i = s; i < e && i < x.length; i++) { const v = x[i]; if (v < mn) mn = v; if (v > mx) mx = v; } out[2 * k] = mn; out[2 * k + 1] = mx; } return out; }

  // ── Zapis WAV (16/24 bit PCM) ──
  function wav(chs, fs, bits) {
    bits = bits || 16; const nCh = chs.length, N = chs[0].length, bps = bits / 8, dataLen = N * nCh * bps, buf = new ArrayBuffer(44 + dataLen), v = new DataView(buf);
    const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); v.setUint32(4, 36 + dataLen, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nCh, true); v.setUint32(24, fs, true); v.setUint32(28, fs * nCh * bps, true); v.setUint16(32, nCh * bps, true); v.setUint16(34, bits, true); ws(36, 'data'); v.setUint32(40, dataLen, true);
    let p = 44;
    for (let i = 0; i < N; i++) for (let c = 0; c < nCh; c++) { let s = Math.max(-1, Math.min(1, chs[c][i])); if (bits === 16) { v.setInt16(p, s < 0 ? s * 32768 : s * 32767, true); p += 2; } else { const q = Math.round(s < 0 ? s * 8388608 : s * 8388607); v.setUint8(p, q & 255); v.setUint8(p + 1, (q >> 8) & 255); v.setUint8(p + 2, (q >> 16) & 255); p += 3; } }
    return buf;
  }

  // ── Miks: klipy audio → stereo (ducking muzyki pod głosem, fade, pan, pętla) ──
  // clip: {track:'voice'|'music'|'sfx', chs (źródło), t0, in, out (s w źródle), vol (dB), fadeIn, fadeOut, loop, pan(-1..1), duck}
  function mixdown(clips, fs, dur, o) {
    o = o || {}; const N = Math.ceil(dur * fs), L = new Float32Array(N), R = new Float32Array(N), voice = [new Float32Array(N), new Float32Array(N)], music = [new Float32Array(N), new Float32Array(N)];
    const place = (cl, tgtL, tgtR) => {
      const src = cl.chs, sN = src[0].length, i0 = Math.floor((cl.in || 0) * fs), i1 = Math.min(sN, cl.out == null ? sN : Math.floor(cl.out * fs)), len = Math.max(0, i1 - i0); if (!len) return;
      const g = lin(cl.vol || 0), pan = cl.pan || 0, gl = g * Math.cos((pan + 1) * PI / 4), gr = g * Math.sin((pan + 1) * PI / 4), start = Math.floor(cl.t0 * fs), endAt = cl.t1 != null ? Math.min(N, Math.floor(cl.t1 * fs)) : N;
      const fi = Math.round((cl.fadeIn || 0) * fs), fo = Math.round((cl.fadeOut || 0) * fs);
      const clipLen = cl.loop ? Math.max(0, endAt - start) : Math.min(len, Math.max(0, N - start)), total = cl.t1 != null ? Math.min(clipLen, endAt - start) : clipLen;
      for (let i = 0; i < total; i++) {
        const oi = start + i; if (oi < 0 || oi >= N) continue;
        let a = 1; if (fi && i < fi) a = i / fi; if (fo && i > total - fo) a = Math.min(a, Math.max(0, (total - i) / fo));
        const si = i0 + (cl.loop ? i % len : i), l = src[0][si], r = (src[1] || src[0])[si];
        tgtL[oi] += l * gl * a; tgtR[oi] += r * gr * a;
      }
    };
    for (const cl of clips) if (cl.track === 'voice') place(cl, voice[0], voice[1]);
    for (const cl of clips) if (cl.track === 'music') place(cl, music[0], music[1]);
    let env = null; if (clips.some((c) => c.track === 'music' && c.duck !== false) && clips.some((c) => c.track === 'voice')) env = duckEnvelope(voice, fs, o.duck || {});
    for (let i = 0; i < N; i++) { const e = env ? env[i] : 1; L[i] = voice[0][i] + music[0][i] * e; R[i] = voice[1][i] + music[1][i] * e; }
    const sfx = [new Float32Array(N), new Float32Array(N)]; for (const cl of clips) if (cl.track === 'sfx') place(cl, sfx[0], sfx[1]);
    for (let i = 0; i < N; i++) { L[i] += sfx[0][i]; R[i] += sfx[1][i]; }
    return { chs: [L, R], voice, music, duck: env };
  }

  // ── Raport jakości wyjściowego audio ──
  function qc(chs, fs, o) {
    o = o || {}; const target = o.target == null ? -14 : o.target, tpMax = o.tp == null ? -1 : o.tp;
    const lufs = integratedLoudness(chs, fs), tp = truePeak(chs), pk = peakDb(chs), clips = clipCount(chs);
    const rl = chs.length > 1 ? 20 * Math.log10((rms(chs[0]) + 1e-9) / (rms(chs[1]) + 1e-9)) : 0;
    const items = [];
    items.push({ k: 'Głośność zintegrowana', v: isFinite(lufs) ? lufs.toFixed(1) + ' LUFS' : '—', ok: isFinite(lufs) && Math.abs(lufs - target) <= 1.5 ? 'ok' : (isFinite(lufs) && Math.abs(lufs - target) <= 3 ? 'warn' : 'bad'), hint: 'cel ' + target + ' LUFS (±1,5 LU)' });
    items.push({ k: 'Szczyt rzeczywisty (true peak)', v: tp.toFixed(1) + ' dBTP', ok: tp <= tpMax + 0.05 ? 'ok' : 'bad', hint: 'maks. ' + tpMax + ' dBTP' });
    items.push({ k: 'Szczyt próbki', v: pk.toFixed(1) + ' dBFS', ok: pk < -0.1 ? 'ok' : 'bad', hint: 'poniżej 0 dBFS' });
    items.push({ k: 'Przesterowanie (clipping)', v: clips + ' próbek', ok: clips === 0 ? 'ok' : 'bad', hint: 'ma być 0' });
    items.push({ k: 'Balans kanałów L/R', v: rl.toFixed(1) + ' dB', ok: Math.abs(rl) < 1.5 ? 'ok' : 'warn', hint: 'różnica < 1,5 dB' });
    let dc = 0; for (const x of chs) { let s = 0; for (let i = 0; i < x.length; i += 7) s += x[i]; dc = Math.max(dc, Math.abs(s / (x.length / 7))); }
    items.push({ k: 'Składowa stała (DC)', v: dc.toFixed(4), ok: dc < 0.005 ? 'ok' : 'warn', hint: '< 0,005' });
    if (o.voice && o.music) {
      const lv = integratedLoudness(o.voice, fs), lm = integratedLoudness(o.music, fs);
      if (isFinite(lv) && isFinite(lm)) { const d = lv - lm; items.push({ k: 'Głos względem muzyki', v: (d >= 0 ? '+' : '') + d.toFixed(1) + ' LU', ok: d >= 8 ? 'ok' : (d >= 4 ? 'warn' : 'bad'), hint: 'głos min. 8 LU nad muzyką (przed duckingiem: sprawdź poziomy)' }); }
    }
    // nadmierna kompresja: różnica szczyt–RMS (crest factor)
    const crest = pk - dB(Math.max(...chs.map((x) => rms(x)))); items.push({ k: 'Dynamika (crest factor)', v: crest.toFixed(1) + ' dB', ok: crest >= 9 ? 'ok' : (crest >= 6 ? 'warn' : 'bad'), hint: 'poniżej 6 dB = przekompresowane' });
    return { lufs, tp, pk, clips, items };
  }

  return { dB, lin, fft, biquad, applyBiquad, peak, peakDb, rms, clipCount, kWeight, integratedLoudness, truePeak, resampleStep, resampleRate, wsola, pitchShift, denoise, declick, eq, EQ_PRESETS, compress, deess, removeSilence, limit, loudnessNormalize, duckEnvelope, peaks, wav, mixdown, qc };
})();
if (typeof module !== 'undefined') module.exports = DSP;
