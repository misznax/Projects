// ── Szybkie dekodowanie wideo do eksportu ──
// Mini-demuxer MP4/MOV (H.264) + WebCodecs VideoDecoder: klatki źródła dekodowane po kolei, każda raz,
// zamiast przewijania elementu <video> dla każdej klatki eksportu (to było główne źródło wolnego eksportu).
// Każdy problem (inny kodek, fragmentowany MP4, lustro, kilka edycji, błąd dekodera) = null albo wyjątek,
// a eksport wraca wtedy do wolnej, ale pewnej metody z przewijaniem.
const FastVid = (() => {
  const u32 = (v, o) => v.getUint32(o), i32 = (v, o) => v.getInt32(o), u16 = (v, o) => v.getUint16(o);
  const u64 = (v, o) => v.getUint32(o) * 4294967296 + v.getUint32(o + 4);
  const i64 = (v, o) => v.getInt32(o) * 4294967296 + v.getUint32(o + 4);
  const tp = (v, o) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));
  const hex2 = (n) => n.toString(16).padStart(2, '0');
  const bad = (m) => { throw new Error('FastVid: ' + m); };
  function boxes(v, s, e) { // pudełka w zakresie [s, e)
    const out = []; let p = s;
    while (p + 8 <= e) {
      let sz = u32(v, p), hd = 8; const ty = tp(v, p + 4);
      if (sz === 1) { sz = u64(v, p + 8); hd = 16; } else if (sz === 0) sz = e - p;
      if (sz < hd || p + sz > e) break; out.push({ ty, s: p, b: p + hd, e: p + sz }); p += sz;
    }
    return out;
  }
  const find = (bx, ty) => bx.find((x) => x.ty === ty);

  // czytnik pliku z oknem 8 MB (odczyty sekwencyjne = mało operacji na Blob)
  class Reader {
    constructor(blob) { this.b = blob; this.win = null; this.ws = 0; this.we = 0; }
    async read(off, len) {
      if (off + len > this.b.size) bad('odczyt poza plikiem');
      if (!this.win || off < this.ws || off + len > this.we) { const we = Math.min(this.b.size, off + Math.max(len, 8 << 20)); this.win = new Uint8Array(await this.b.slice(off, we).arrayBuffer()); this.ws = off; this.we = we; }
      return this.win.subarray(off - this.ws, off - this.ws + len);
    }
  }

  async function readMoov(blob) { // znajdź pudełko moov (w iPhone'ach zwykle na końcu pliku)
    let p = 0; const size = blob.size;
    while (p + 8 <= size) {
      const hv = new DataView(await blob.slice(p, Math.min(size, p + 16)).arrayBuffer()); let sz = u32(hv, 0), hd = 8; const ty = tp(hv, 4);
      if (sz === 1) { sz = u64(hv, 8); hd = 16; } else if (sz === 0) sz = size - p;
      if (sz < hd) bad('uszkodzone pudełko');
      if (ty === 'moov') return new DataView(await blob.slice(p, p + sz).arrayBuffer());
      p += sz;
    }
    return bad('brak moov');
  }

  function parse(v, fileSize) { // → opis ścieżki wideo i tablice próbek (kolejność dekodowania)
    const moov = find(boxes(v, 0, v.byteLength), 'moov'); if (!moov) bad('brak moov');
    for (const trak of boxes(v, moov.b, moov.e).filter((x) => x.ty === 'trak')) {
      const tk = boxes(v, trak.b, trak.e), mdia = find(tk, 'mdia'); if (!mdia) continue; const md = boxes(v, mdia.b, mdia.e), hdlr = find(md, 'hdlr');
      if (!hdlr || tp(v, hdlr.b + 8) !== 'vide') continue;
      // obrót z macierzy tkhd (telefony: portret = obrót 90°)
      const tkhd = find(tk, 'tkhd'); if (!tkhd) bad('brak tkhd'); const mo = tkhd.b + (v.getUint8(tkhd.b) === 1 ? 52 : 40);
      const a = i32(v, mo) / 65536, b = i32(v, mo + 4) / 65536, c = i32(v, mo + 12) / 65536, d = i32(v, mo + 16) / 65536;
      if (a * d - b * c <= 0) bad('lustrzane odbicie w kontenerze'); const rot = ((Math.round(Math.atan2(b, a) * 180 / Math.PI) % 360) + 360) % 360; if (rot % 90) bad('obrót ' + rot + '°');
      const mdhd = find(md, 'mdhd'), ts = u32(v, mdhd.b + (v.getUint8(mdhd.b) === 1 ? 20 : 12)); if (!ts) bad('brak skali czasu');
      // lista edycji: dokładnie jedna niepusta pozycja (przesunięcie początku przez klatki B)
      let mediaTime = 0; const edts = find(tk, 'edts');
      if (edts) { const elst = find(boxes(v, edts.b, edts.e), 'elst'); if (elst) { const ver = v.getUint8(elst.b), cnt = u32(v, elst.b + 4); let p = elst.b + 8; const mts = []; for (let k = 0; k < cnt; k++) { if (ver === 1) { mts.push(i64(v, p + 8)); p += 20; } else { mts.push(i32(v, p + 4)); p += 12; } } if (mts.some((x) => x < 0) || mts.length > 1) bad('złożona lista edycji'); mediaTime = mts[0] || 0; } }
      const minf = find(md, 'minf'), stbl = minf && find(boxes(v, minf.b, minf.e), 'stbl'); if (!stbl) bad('brak stbl'); const sb = boxes(v, stbl.b, stbl.e);
      const stsd = find(sb, 'stsd'); if (!stsd) bad('brak stsd'); const es = stsd.b + 8, esz = u32(v, es), ety = tp(v, es + 4); if (ety !== 'avc1') bad('kodek ' + ety + ' (tylko H.264 avc1)');
      const avcC = find(boxes(v, es + 8 + 78, es + esz), 'avcC'); if (!avcC) bad('brak avcC');
      const desc = new Uint8Array(v.buffer.slice(v.byteOffset + avcC.b, v.byteOffset + avcC.e)), codec = 'avc1.' + [1, 2, 3].map((i) => hex2(v.getUint8(avcC.b + i))).join('');
      const w0 = u16(v, es + 32), h0 = u16(v, es + 34);
      const stts = find(sb, 'stts'), stsz = find(sb, 'stsz'), stsc = find(sb, 'stsc'), stco = find(sb, 'stco') || find(sb, 'co64'); if (!stts || !stsz || !stsc || !stco) bad('brak tablic próbek');
      const n = u32(v, stsz.b + 8); if (!n) bad('brak próbek (fragmentowany MP4?)'); const fixed = u32(v, stsz.b + 4), size = new Uint32Array(n); for (let i = 0; i < n; i++) size[i] = fixed || u32(v, stsz.b + 12 + i * 4);
      const dts = new Float64Array(n); { let p = stts.b + 8, i = 0, t = 0; const cnt = u32(v, stts.b + 4); for (let k = 0; k < cnt; k++, p += 8) { const c = u32(v, p), dl = u32(v, p + 4); for (let j = 0; j < c && i < n; j++) { dts[i++] = t; t += dl; } } if (i < n) bad('stts krótsze niż próbki'); }
      const cto = new Float64Array(n); const ctts = find(sb, 'ctts'); if (ctts) { const ver = v.getUint8(ctts.b), cnt = u32(v, ctts.b + 4); let p = ctts.b + 8, i = 0; for (let k = 0; k < cnt; k++, p += 8) { const c = u32(v, p), o = ver === 1 ? i32(v, p + 4) : u32(v, p + 4); for (let j = 0; j < c && i < n; j++) cto[i++] = o; } }
      const key = new Uint8Array(n); const stss = find(sb, 'stss'); if (stss) { const cnt = u32(v, stss.b + 4); for (let k = 0; k < cnt; k++) { const s = u32(v, stss.b + 8 + k * 4) - 1; if (s >= 0 && s < n) key[s] = 1; } } else key.fill(1);
      if (!key[0]) bad('pierwsza próbka nie jest klatką kluczową');
      const off = new Float64Array(n), nc = u32(v, stco.b + 4), is64 = stco.ty === 'co64', sc = u32(v, stsc.b + 4); { let ei = 0, si = 0; for (let ch = 0; ch < nc; ch++) { while (ei + 1 < sc && u32(v, stsc.b + 8 + (ei + 1) * 12) <= ch + 1) ei++; const spc = u32(v, stsc.b + 8 + ei * 12 + 4); let o = is64 ? u64(v, stco.b + 8 + ch * 8) : u32(v, stco.b + 8 + ch * 4); for (let j = 0; j < spc && si < n; j++) { off[si] = o; o += size[si]; si++; } } if (si < n) bad('stsc/stco krótsze niż próbki'); }
      for (let i = 0; i < n; i++) if (off[i] + size[i] > fileSize) bad('próbka poza plikiem');
      // czasy prezentacji (µs, czas kontenera); przesunięcie listy edycji dodawane dopiero przy szukaniu klatki
      const pts = new Float64Array(n); let mn = Infinity; for (let i = 0; i < n; i++) { pts[i] = Math.round((dts[i] + cto[i]) * 1e6 / ts); if (pts[i] < mn) mn = pts[i]; } const shift = mn < 0 ? -mn : 0; if (shift) for (let i = 0; i < n; i++) pts[i] += shift;
      const ord = Uint32Array.from({ length: n }, (_, i) => i).sort((p, q) => pts[p] - pts[q] || p - q), lastKey = new Int32Array(n); for (let i = 0, k = 0; i < n; i++) { if (key[i]) k = i; lastKey[i] = k; }
      return { n, off, size, pts, key, ord, lastKey, codec, desc, rot, w0, h0, mediaUs: Math.round(mediaTime * 1e6 / ts) + shift };
    }
    return bad('brak ścieżki wideo');
  }

  class Clip {
    constructor(info, blob, maxDim) { Object.assign(this, info); this.rd = new Reader(blob); this.maxDim = maxDim || 1920; this.canvas = document.createElement('canvas'); this.ctx = null; this.dec = null; this.pend = []; this.fed = 0; this.curUs = null; this.err = null; this.waiter = null; this.eof = false; }
    mkDec() {
      this.dec = new VideoDecoder({ output: (f) => { this.pend.push(f); this.wake(); }, error: (e) => { this.err = e; this.wake(); } });
      this.dec.addEventListener('dequeue', () => this.wake()); this.dec.configure({ codec: this.codec, description: this.desc });
    }
    wake() { const w = this.waiter; if (w) { this.waiter = null; w(); } }
    wait(ms) { return new Promise((res, rej) => { const t = setTimeout(() => { this.waiter = null; rej(new Error('FastVid: limit czasu dekodera')); }, ms); this.waiter = () => { clearTimeout(t); res(); }; }); }
    restart(at) { for (const f of this.pend) f.close(); this.pend = []; this.err = null; this.eof = false; this.curUs = null; this.fed = at; if (this.dec && this.dec.state !== 'closed') { try { this.dec.reset(); this.dec.configure({ codec: this.codec, description: this.desc }); return; } catch (e) { try { this.dec.close(); } catch (e2) { /* już zamknięty */ } } } this.mkDec(); }
    findIdx(tt) { // pozycja w kolejności prezentacji: ostatnia klatka o czasie ≤ tt
      const target = tt * 1e6 + this.mediaUs, ord = this.ord, pts = this.pts; let lo = 0, hi = this.n - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (pts[ord[mid]] <= target) lo = mid; else hi = mid - 1; } return lo;
    }
    draw(f) {
      const sw = f.displayWidth, sh = f.displayHeight, rot = this.rot, swap = rot % 180 !== 0;
      if (!this.ctx) { const s = Math.min(1, this.maxDim / Math.max(sw, sh)); this.s = s; const cw = Math.round((swap ? sh : sw) * s), ch = Math.round((swap ? sw : sh) * s); this.canvas.width = cw; this.canvas.height = ch; this.ctx = this.canvas.getContext('2d'); this.canvas.videoWidth = cw; this.canvas.videoHeight = ch; this.canvas.readyState = 4; }
      const c = this.ctx, W = this.canvas.width, H = this.canvas.height; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
      if (rot === 90) { c.translate(W, 0); c.rotate(Math.PI / 2); } else if (rot === 180) { c.translate(W, H); c.rotate(Math.PI); } else if (rot === 270) { c.translate(0, H); c.rotate(-Math.PI / 2); }
      c.drawImage(f, 0, 0, sw * this.s, sh * this.s);
    }
    // klatka źródła dla czasu tt (s od początku pliku) → canvas z polami videoWidth / videoHeight / readyState (jak element <video>)
    async frame(tt) {
      const di = this.ord[this.findIdx(tt)], want = this.pts[di]; if (this.curUs === want) return this.canvas;
      const kf = this.lastKey[di];
      if (!this.dec || this.dec.state === 'closed' || (this.curUs !== null && want < this.curUs) || kf > this.fed) this.restart(kf);
      const t0 = performance.now();
      for (;;) {
        if (this.err) throw this.err;
        while (this.pend.length && this.pend[0].timestamp < want) this.pend.shift().close();
        if (this.pend.length && this.pend[0].timestamp >= want) break;
        if (performance.now() - t0 > 15000) bad('limit czasu klatki');
        if (this.fed < this.n && !this.eof) {
          let c = 0; while (this.fed < this.n && c < 2 && this.dec.decodeQueueSize < 3 && this.pend.length < 8) { const i = this.fed++; const data = await this.rd.read(this.off[i], this.size[i]); this.dec.decode(new EncodedVideoChunk({ type: this.key[i] ? 'key' : 'delta', timestamp: this.pts[i], data })); c++; }
          if (c) continue; await this.wait(4000);
        } else if (!this.eof) { this.eof = true; await this.dec.flush(); } // koniec pliku: wypchnij zaległe klatki
        else if (!this.pend.length) bad('brak klatki na końcu strumienia');
      }
      const f = this.pend.shift(); try { this.draw(f); this.curUs = f.timestamp; } finally { f.close(); }
      return this.canvas;
    }
    close() { for (const f of this.pend) f.close(); this.pend = []; if (this.dec && this.dec.state !== 'closed') { try { this.dec.close(); } catch (e) { /* już zamknięty */ } } this.dec = null; }
  }

  return {
    // → obiekt z metodą frame(t) i close(), albo null, gdy tego pliku nie da się obsłużyć szybką metodą
    async open(blob, maxDim) {
      try {
        if (!window.VideoDecoder || !window.EncodedVideoChunk || !blob) return null;
        const info = parse(await readMoov(blob), blob.size); const sup = await VideoDecoder.isConfigSupported({ codec: info.codec, description: info.desc }); if (!sup.supported) bad('dekoder nie obsługuje ' + info.codec);
        return new Clip(info, blob, maxDim);
      } catch (e) { console.info('Szybkie dekodowanie niedostępne dla tego pliku:', e && e.message); return null; }
    },
  };
})();
