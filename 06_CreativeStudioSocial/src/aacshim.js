/* KODER AAC-LC W WASM: dla przeglądarek bez własnego AAC (np. Firefox). Plik public/aac-worker.js to niezmieniony worker z paczki @mediabunny/aac-encoder (MPL-2.0,
   libavcodec z FFmpeg, LGPL 2.1; patrz public/aac-NOTICE.txt). Ładuje się dopiero wtedy, gdy natywnego AAC brak. Protokół workera: {id, command:{type:'init'|'encode'|'flush', data}}. */
const AacWasm = {
  url: 'aac-worker.js', _ok: null, prime: 1024,
  forced() { try { return !!window.__forceAacWasm || localStorage.getItem('css-force-aac-wasm') === '1'; } catch { return !!window.__forceAacWasm; } },
  // Czy da się uruchomić koder (worker + WebAssembly + plik). Wynik jest zapamiętany; błąd = false, aplikacja zostaje przy Opus.
  async probe() {
    if (this._ok !== null) return this._ok;
    if (!window.Worker || !window.WebAssembly) return (this._ok = false);
    let e = null; try { e = await Promise.race([this.open({ sampleRate: 48000, channels: 2, bitrate: 192000 }, () => {}, () => {}), new Promise((_, rej) => setTimeout(() => rej(new Error('limit czasu ładowania kodera AAC')), 25000))]); this._ok = true; }
    catch (x) { console.warn('Koder AAC (WASM) niedostępny:', x); this._ok = false; }
    try { if (e) e.close(); } catch { /* nic */ }
    return this._ok;
  },
  // Otwiera koder. out(chunk, meta) jak w AudioEncoder (chunk: byteLength, copyTo, type, timestamp, duration w µs); err(e) przy awarii workera.
  async open(cfg, out, err) {
    const E = new AacWasmEncoder(cfg, out, err); await E.init(); return E;
  },
};
class AacWasmEncoder {
  constructor(cfg, out, err) {
    this.sr = cfg.sampleRate || 48000; this.ch = cfg.channels || 2; this.br = cfg.bitrate || 192000; this.out = out; this.err = err; this.w = null; this.id = 0; this.pend = new Map(); this.dead = null;
    this.ctx = 0; this.fs = 1024; this.pb = null; this.pf = 0; this.skip = AacWasm.prime; this.pk = 0; this.encodeQueueSize = 0;
  }
  call(command, tr) {
    return new Promise((res, rej) => { if (this.dead) { rej(this.dead); return; } const id = ++this.id; this.pend.set(id, { res, rej }); try { this.w.postMessage({ id, command }, tr || []); } catch (e) { this.pend.delete(id); rej(e); } });
  }
  fail(e) { this.dead = e instanceof Error ? e : new Error(String((e && e.message) || e || 'błąd kodera AAC')); for (const p of this.pend.values()) p.rej(this.dead); this.pend.clear(); try { if (this.w) this.w.terminate(); } catch { /* nic */ } this.w = null; if (this.err) this.err(this.dead); }
  async init() {
    this.w = new Worker(AacWasm.url);
    this.w.onmessage = (ev) => { const d = ev.data, p = this.pend.get(d.id); if (!p) return; this.pend.delete(d.id); if (d.success) p.res(d.data); else p.rej(d.error instanceof Error ? d.error : new Error(String((d.error && d.error.message) || d.error || 'błąd kodera AAC'))); };
    this.w.onerror = (ev) => this.fail(new Error('Nie udało się uruchomić kodera AAC: ' + (ev && ev.message ? ev.message : 'plik aac-worker.js niedostępny')));
    const r = await this.call({ type: 'init', data: { numberOfChannels: this.ch, sampleRate: this.sr, bitrate: this.br } });
    this.ctx = r.ctx; this.fs = r.frameSize || 1024; this.pb = new Float32Array(this.fs * this.ch);
  }
  // Wejście: dźwięk planarny (kanał 0 w buf[0..n), kanał 1 w buf[n..2n)), n ramek. Dane są składane w ramki kodera (zwykle 1024 próbki).
  async encodePlanar(buf, n) {
    const ch = this.ch; let i = 0;
    if (this.skip > 0) { const s = Math.min(this.skip, n); this.skip -= s; i = s; } // opóźnienie kodera (1024 próbki): pomijamy tyle z początku, żeby po odtworzeniu dźwięk leżał dokładnie tam, gdzie obraz
    while (i < n) {
      const take = Math.min(this.fs - this.pf, n - i);
      for (let c = 0; c < ch; c++) { const src = buf.subarray(c * n + i, c * n + i + take); for (let k = 0; k < take; k++) this.pb[(this.pf + k) * ch + c] = src[k]; }
      this.pf += take; i += take;
      if (this.pf === this.fs) await this.sendFrame();
    }
  }
  async sendFrame() {
    const data = this.pb.buffer.slice(0); this.pf = 0; this.pb.fill(0); this.encodeQueueSize = 1;
    const r = await this.call({ type: 'encode', data: { ctx: this.ctx, audioData: data, timestamp: this.pk * this.fs } }, [data]); this.encodeQueueSize = 0; this.emit(r.packets);
  }
  emit(pk) {
    for (const p of pk || []) {
      const d = new Uint8Array(p.encodedData), ts = Math.round(this.pk * this.fs / this.sr * 1e6), dur = Math.round(this.fs / this.sr * 1e6); this.pk++;
      this.out({ byteLength: d.byteLength, type: 'key', timestamp: ts, duration: dur, copyTo(dst) { dst.set(d); } }, undefined);
    }
  }
  async flush() {
    if (this.pf > 0) { this.pb.fill(0, this.pf * this.ch); await this.sendFrame(); } // resztę dopełniamy ciszą do pełnej ramki
    const r = await this.call({ type: 'flush', data: { ctx: this.ctx } }); this.emit(r.packets);
  }
  close() { try { if (this.w) this.w.terminate(); } catch { /* nic */ } this.w = null; this.dead = this.dead || new Error('koder zamknięty'); }
}
