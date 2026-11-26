/* Creative Studio Social — rdzeń: narzędzia, magazyn (IndexedDB), projekt, historia, UI-pomocniki */
const APP = { name: 'Creative Studio Social', ver: 'v0.02', author: 'Michał Rzekiecki', mail: 'michus@gmail.com' };
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = (p = 'x') => p + Math.random().toString(36).slice(2, 9);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tick = () => new Promise((r) => setTimeout(r, 0));
const jclone = (o) => JSON.parse(JSON.stringify(o));
function debounce(fn, ms) { let t; const f = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; f.now = (...a) => { clearTimeout(t); fn(...a); }; return f; }
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v; else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k === 'html') e.innerHTML = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (k in e && k !== 'list') { try { e[k] = v; } catch { e.setAttribute(k, v); } } else e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
// Czytelność (ZASADY #17): (nawiasy) = jasnoniebieski, „cudzysłowy” = żółty
function rich(s) { return esc(s).replace(/\(([^()]*)\)/g, '<span class="par">($1)</span>').replace(/„([^”]*)”/g, '<span class="quo">„$1”</span>'); }
const fmtTime = (s) => { s = Math.max(0, s || 0); const m = Math.floor(s / 60), r = s - m * 60; return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1); };
const fmtSize = (b) => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB';
const stamp = () => { const d = new Date(), p = (n) => String(n).padStart(2, '0'); return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()); };
const slug = (s) => String(s || 'projekt').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32) || 'projekt';
const fname = (what, ext) => `CSS_${APP.ver}_${slug(P.cur ? P.cur.name : 'projekt')}_${what}_${stamp()}.${ext}`; // wersja w nazwie pliku (ZASADY #9)
function download(blob, name) { const a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); }
function errText(e) { return (e && (e.message || e.name)) ? (e.name && e.name !== 'Error' ? e.name + ': ' : '') + (e.message || '') : String(e); }

// ── Toast / modal / menu ──
function toast(msg, kind = 'info', ms = 3600) {
  let box = $('#toasts'); if (!box) { box = h('div', { id: 'toasts' }); document.body.append(box); }
  const t = h('div', { class: 'toast ' + kind, role: 'status' }, msg); box.append(t); setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms); return t;
}
function modal(title, body, buttons) {
  const back = h('div', { class: 'modal-back' }), box = h('div', { class: 'modal', role: 'dialog', 'aria-label': title });
  const close = () => { back.remove(); document.removeEventListener('keydown', onk); };
  const onk = (e) => { if (e.key === 'Escape') close(); }; document.addEventListener('keydown', onk);
  box.append(h('h2', {}, title), typeof body === 'string' ? h('div', { class: 'mbody', html: body }) : h('div', { class: 'mbody' }, body));
  const row = h('div', { class: 'mrow' });
  for (const b of buttons || [{ t: 'Zamknij' }]) row.append(h('button', { class: 'btn ' + (b.cls || ''), onclick: async () => { if (b.fn) { const r = await b.fn(close); if (r === false) return; } if (!b.keep) close(); } }, b.t));
  box.append(row); back.append(box); back.addEventListener('mousedown', (e) => { if (e.target === back) close(); }); document.body.append(back); return { close, box };
}
function popMenu(anchor, items) {
  $$('.popmenu').forEach((m) => m.remove());
  const m = h('div', { class: 'popmenu' }); const r = anchor.getBoundingClientRect();
  for (const it of items) { if (it === '-') { m.append(h('hr')); continue; } m.append(h('button', { class: 'mi', onclick: () => { m.remove(); it.fn(); } }, h('i', {}, it.i || ''), it.t)); }
  document.body.append(m); const w = m.offsetWidth; m.style.left = clamp(r.right - w, 4, innerWidth - w - 4) + 'px'; m.style.top = (r.bottom + 4) + 'px';
  setTimeout(() => document.addEventListener('mousedown', function f(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('mousedown', f); } }), 0);
  return m;
}
function progressModal(title) { // pasek postępu z możliwością anulowania (ZASADY #18: %, czas, anulowanie)
  const bar = h('div', { class: 'pbar' }, h('i')), info = h('div', { class: 'pinfo' }, 'Start…'), st = { cancel: false, t0: Date.now() };
  const mm = modal(title, h('div', {}, bar, info), [{ t: 'Anuluj', fn: () => { st.cancel = true; return true; } }]);
  st.set = (p, txt) => { bar.firstChild.style.width = clamp(p * 100, 0, 100) + '%'; const el = (Date.now() - st.t0) / 1000, eta = p > 0.03 ? el / p - el : null; info.textContent = Math.round(p * 100) + '% · ' + (txt || '') + (eta != null ? ' · pozostało ~' + Math.ceil(eta) + ' s' : ''); };
  st.close = mm.close; return st;
}

// ── IndexedDB ──
const DBI = {
  db: null,
  open() {
    if (this.db) return this.db;
    return (this.db = new Promise((res, rej) => {
      const r = indexedDB.open('css-v1', 1);
      r.onupgradeneeded = () => { const d = r.result; d.createObjectStore('projects', { keyPath: 'id' }); d.createObjectStore('assets', { keyPath: 'id' }); const v = d.createObjectStore('versions', { keyPath: 'id' }); v.createIndex('pid', 'pid'); };
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
  },
  async tx(store, mode, fn) { const d = await this.open(); return new Promise((res, rej) => { const t = d.transaction(store, mode), s = t.objectStore(store), q = fn(s); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); },
  get(store, k) { return this.tx(store, 'readonly', (s) => s.get(k)); },
  put(store, v) { return this.tx(store, 'readwrite', (s) => s.put(v)); },
  del(store, k) { return this.tx(store, 'readwrite', (s) => s.delete(k)); },
  all(store) { return this.tx(store, 'readonly', (s) => s.getAll()); },
  byIndex(store, idx, key) { return this.tx(store, 'readonly', (s) => s.index(idx).getAll(key)); },
};

// ── Zasoby (blob w IndexedDB + cache dekodowania) ──
const Assets = {
  c: new Map(),
  async add(file, kind, extra) {
    const id = uid('a'), rec = { id, name: file.name || (kind + id), type: file.type || '', size: file.size, kind, created: Date.now(), blob: file, pid: P.cur ? P.cur.id : null, ...(extra || {}) };
    try {
      if ((file.type || '').startsWith('image/')) { const im = await this.imgFromBlob(file); rec.w = im.naturalWidth; rec.h = im.naturalHeight; }
      else if ((file.type || '').startsWith('video/')) { const v = await this.videoMeta(file); Object.assign(rec, v); }
      else if ((file.type || '').startsWith('audio/') || kind === 'audio') { const a = await this.decode(file); rec.dur = a.chs[0].length / a.fs; }
    } catch (e) { rec.err = errText(e); }
    await DBI.put('assets', rec); this.c.delete(id); return id;
  },
  async rec(id) { return DBI.get('assets', id); },
  async blob(id) { const r = await this.rec(id); return r && r.blob; },
  async url(id) { const c = this.c.get(id) || {}; if (c.url) return c.url; const b = await this.blob(id); if (!b) return null; c.url = URL.createObjectURL(b); this.c.set(id, c); return c.url; },
  imgFromBlob(b) { return new Promise((res, rej) => { const u = URL.createObjectURL(b), i = new Image(); i.onload = () => { res(i); }; i.onerror = () => rej(new Error('Nie można odczytać obrazu')); i.src = u; }); },
  async img(id) { const c = this.c.get(id) || {}; if (c.img) return c.img; const b = await this.blob(id); if (!b) return null; c.img = await this.imgFromBlob(b); this.c.set(id, c); return c.img; },
  videoMeta(b) { return new Promise((res, rej) => { const v = document.createElement('video'); v.preload = 'metadata'; v.muted = true; v.onloadedmetadata = () => res({ w: v.videoWidth, h: v.videoHeight, dur: v.duration }); v.onerror = () => rej(new Error('Nie można odczytać wideo')); v.src = URL.createObjectURL(b); }); },
  async video(id) { const c = this.c.get(id) || {}; if (c.vid) return c.vid; const u = await this.url(id); if (!u) return null; const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = u; await new Promise((r) => { v.onloadeddata = r; v.onerror = r; }); c.vid = v; this.c.set(id, c); return v; },
  async decode(blobOrBuf) { const buf = blobOrBuf instanceof ArrayBuffer ? blobOrBuf : await blobOrBuf.arrayBuffer(); const ctx = new OfflineAudioContext(2, 1, 48000); const ab = await ctx.decodeAudioData(buf.slice(0)); const chs = []; for (let i = 0; i < Math.min(2, ab.numberOfChannels); i++) chs.push(Float32Array.from(ab.getChannelData(i))); if (chs.length === 1) chs.push(Float32Array.from(chs[0])); return { chs, fs: ab.sampleRate }; },
  async audio(id) { const c = this.c.get(id) || {}; if (c.aud) return c.aud; const b = await this.blob(id); if (!b) return null; c.aud = await this.decode(b); this.c.set(id, c); return c.aud; },
  async del(id) { this.c.delete(id); await DBI.del('assets', id); },
  async list(kind) { const a = await DBI.all('assets'); return a.filter((x) => (!kind || x.kind === kind) && (!P.cur || x.pid === P.cur.id || !x.pid)).sort((a, b) => b.created - a.created); },
  async putAudio(chs, fs, name, kind) { const blob = new Blob([DSP.wav(chs, fs, 16)], { type: 'audio/wav' }); return this.add(new File([blob], name, { type: 'audio/wav' }), kind || 'audio'); },
};

// ── Projekt ──
const DEFAULT_BRAND = () => ({ colors: { primary: '#FF5A00', background: '#05070A', accent: '#FFE600' }, headingFont: 'Barlow Condensed', bodyFont: 'Inter', style: 'Ciemne tło z poświatą, gradient pomarańcz → żółć, szkło', strictness: 80, logos: [], refs: [], rules: '', fonts: [], handle: '@trenuj.smialo', styles: [], auto: true, pal: null, dna: null, look: 'glow' });
function newProject(name) {
  return { id: uid('p'), name: name || 'Nowy projekt', v: 1, created: Date.now(), updated: Date.now(), brand: DEFAULT_BRAND(), posts: [], reels: [], curPost: null, curSlide: 0, curReel: null, audio: { takes: [], cur: null, fx: {} }, mix: { duckDepth: 10, duckAttack: 0.08, duckRelease: 0.45, musicDb: -14, target: -14, tp: -1 }, publish: { nets: { ig: true, yt: true, tt: true, fb: true }, caption: '', hashtags: '', title: '', schedule: '', cover: null, checks: {} }, calendar: [], log: [] };
}
const P = { cur: null, dirty: false, saving: false };
const bus = { l: {}, on(e, f) { (this.l[e] = this.l[e] || []).push(f); }, emit(e, a) { (this.l[e] || []).forEach((f) => { try { f(a); } catch (x) { console.error(x); } }); } };
function setSaveState(t, bad) { const e = $('#saveState'); if (e) { e.textContent = t; e.className = bad ? 'bad' : ''; } }
async function saveNow() {
  if (!P.cur) return; P.cur.updated = Date.now();
  try { await DBI.put('projects', P.cur); P.dirty = false; setSaveState('Zapisano ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })); } catch (e) { setSaveState('Błąd zapisu: ' + errText(e), true); toast('Nie udało się zapisać projektu: ' + errText(e), 'bad'); }
}
const saveSoon = debounce(saveNow, 1200);
function touch() { P.dirty = true; setSaveState('Zmiany…'); saveSoon(); }
async function snapshot(label) { if (!P.cur) return; await saveNow(); const id = P.cur.id + '@' + Date.now(); await DBI.put('versions', { id, pid: P.cur.id, ts: Date.now(), label: label || 'auto', data: jclone(P.cur) }); const all = (await DBI.byIndex('versions', 'pid', P.cur.id)).sort((a, b) => b.ts - a.ts); for (const v of all.slice(30)) await DBI.del('versions', v.id); }
setInterval(() => { if (P.cur && P.dirty) snapshot('autosave'); }, 10 * 60 * 1000);
async function listProjects() { return (await DBI.all('projects')).sort((a, b) => b.updated - a.updated); }
async function openProject(id) {
  const p = await DBI.get('projects', id); if (!p) throw new Error('Brak projektu'); P.cur = migrate(p); localStorage.setItem('css-last', id); await brandBoot();
  for (const f of P.cur.brand.fonts || []) loadFontAsset(f).catch(() => {});
  bus.emit('project'); return P.cur;
}
function migrate(p) {
  const d = newProject(), legacy = p.brand && p.brand.auto == null; for (const k of Object.keys(d)) if (p[k] == null) p[k] = d[k]; for (const k of Object.keys(d.brand)) if (p.brand[k] == null) p.brand[k] = d.brand[k]; for (const k of Object.keys(d.mix)) if (p.mix[k] == null) p.mix[k] = d.mix[k];
  if (legacy) p.brand.auto = p.brand.colors.primary === '#FF5A00' || (p.brand.colors.primary === '#123456' && !(p.brand.logos || []).length); // marka z v0.01 bez własnych zmian przechodzi na automat
  return p;
}
async function loadFontAsset(f) { const b = await Assets.blob(f.assetId); if (!b) return; const ff = new FontFace(f.family, await b.arrayBuffer()); await ff.load(); document.fonts.add(ff); }
async function duplicateProject() { await snapshot('przed duplikacją'); const c = jclone(P.cur); c.id = uid('p'); c.name = P.cur.name + ' (kopia)'; c.created = c.updated = Date.now(); await DBI.put('projects', c); toast('Zduplikowano projekt', 'ok'); }

// ── Historia (cofnij/ponów) na migawkach JSON wskazanego fragmentu stanu ──
class History {
  constructor(get, set) { this.get = get; this.set = set; this.st = []; this.i = -1; this.reset(); }
  reset() { this.st = [JSON.stringify(this.get())]; this.i = 0; }
  mark() { const s = JSON.stringify(this.get()); if (s === this.st[this.i]) return false; this.st = this.st.slice(0, this.i + 1); this.st.push(s); if (this.st.length > 120) this.st.shift(); this.i = this.st.length - 1; return true; }
  undo() { if (this.i <= 0) return false; this.i--; this.set(JSON.parse(this.st[this.i])); return true; }
  redo() { if (this.i >= this.st.length - 1) return false; this.i++; this.set(JSON.parse(this.st[this.i])); return true; }
}

// ── Mały ZIP (bez kompresji) ──
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = t[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }; })();
async function makeZip(files) { // files: [{name, data: Blob|Uint8Array|string}]
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  for (const f of files) {
    const nm = enc.encode(f.name); let u8 = typeof f.data === 'string' ? enc.encode(f.data) : f.data instanceof Blob ? new Uint8Array(await f.data.arrayBuffer()) : f.data;
    const crc = CRC(u8), d = new Date(), dt = ((d.getFullYear() - 1980) << 9 | (d.getMonth() + 1) << 5 | d.getDate()), tm = (d.getHours() << 11 | d.getMinutes() << 5 | (d.getSeconds() >> 1));
    const lh = new DataView(new ArrayBuffer(30)); lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true); lh.setUint16(10, tm, true); lh.setUint16(12, dt, true); lh.setUint32(14, crc, true); lh.setUint32(18, u8.length, true); lh.setUint32(22, u8.length, true); lh.setUint16(26, nm.length, true);
    parts.push(lh.buffer, nm, u8);
    const ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(12, tm, true); ch.setUint16(14, dt, true); ch.setUint32(16, crc, true); ch.setUint32(20, u8.length, true); ch.setUint32(24, u8.length, true); ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
    cen.push(ch.buffer, nm); off += 30 + nm.length + u8.length;
  }
  let cl = 0; for (const c of cen) cl += c.byteLength;
  const end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cl, true); end.setUint32(16, off, true);
  return new Blob([...parts, ...cen, end.buffer], { type: 'application/zip' });
}

// ── Kolory ──
const hex2rgb = (x) => { x = x.replace('#', ''); if (x.length === 3) x = x.split('').map((c) => c + c).join(''); const n = parseInt(x, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgb2hex = (r, g, b) => '#' + [r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
const lum = (hx) => { const [r, g, b] = hex2rgb(hx).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const readable = (bg) => lum(bg) > 0.42 ? '#111111' : '#ffffff';
const mix = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return rgb2hex(lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t)); };
