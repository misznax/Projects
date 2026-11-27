/* MINIATURA Z HOOKIEM: okładka rolki rysowana w kodzie (bez generatywnej AI), płótno 1080×1920.
   Cały tekst leży w pasie bezpiecznym siatki profilu Instagrama (3:4, y 240 do 1680) i w kolumnie x 90 do 990.
   Spec: { kicker: 'EFEKT REFLEKTORA', lines: ['MYŚLISZ, ŻE', '*KTOŚ PATRZY*', 'JAK ĆWICZYSZ?'], sub: 'Sprawdzono to na koszulkach' }
   Linia w gwiazdkach dostaje gradient pomarańcz → żółć i jest największa. Opcjonalnie zdjęcie (klatka rolki) pod spodem. */
const Cover = {
  W: 1080, H: 1920,
  // z hooka robi spec: do 3 linii o zbliżonej długości, środkowa wyróżniona
  fromHook(hook, kicker, sub) {
    const w = String(hook || '').replace(/[?.!]+$/, '').toUpperCase().split(/\s+/).filter(Boolean); if (!w.length) return { kicker: kicker || '', lines: [], sub: sub || '' };
    const n = Math.min(3, Math.max(1, Math.round(w.length / 2.5))), tot = w.join(' ').length, lines = []; let cur = [];
    for (const x of w) { cur.push(x); if (lines.length < n - 1 && cur.join(' ').length >= tot / n) { lines.push(cur.join(' ')); cur = []; } } if (cur.length) lines.push(cur.join(' '));
    if (/[?]$/.test(String(hook).trim())) lines[lines.length - 1] += '?'; const hl = lines.length > 1 ? 1 : 0; lines[hl] = '*' + lines[hl] + '*'; return { kicker: kicker || '', lines, sub: sub || '' };
  },
  rnd(seed) { let s = 2166136261; for (const ch of String(seed)) { s ^= ch.charCodeAt(0); s = Math.imul(s, 16777619); } return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 10000) / 10000; }; },
  hexPath(g, x, y, r) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } g.closePath(); },
  glow(g, x, y, r, c) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); },
  async img(src) { return new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }); },
  // klatka z pliku wideo (blob) w chwili t: do tła miniatury
  async frameFrom(blob, t) {
    const u = URL.createObjectURL(blob), v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = u;
    try {
      await new Promise((ok, no) => { v.onloadedmetadata = ok; v.onerror = () => no(new Error('Nie da się odczytać wideo.')); });
      await new Promise((ok) => { v.onseeked = ok; v.currentTime = Math.min(Math.max(0, t || 0.5), Math.max(0, (v.duration || 1) - 0.1)); });
      const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext('2d').drawImage(v, 0, 0); return c;
    } finally { URL.revokeObjectURL(u); }
  },
  fit(g, txt, font, max, start, min) { let s = start; do { g.font = font(s); if (g.measureText(txt).width <= max) break; s -= 4; } while (s > (min || 60)); return s; },
  async render(spec, opt) {
    opt = opt || {}; spec = spec || {}; if (typeof Fonts !== 'undefined') await Fonts.load();
    try { await Promise.all(['italic 900 100px "Barlow Condensed"', 'italic 800 60px "Barlow Condensed"', '600 40px Inter', '400 30px Inter'].map((f) => document.fonts.load(f, 'ĄĘŁŚŻ'))); } catch (e) { /* zostaje font zastępczy */ }
    const W = this.W, H = this.H, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), R = this.rnd((spec.lines || []).join('|') + (spec.kicker || ''));
    g.fillStyle = '#05070A'; g.fillRect(0, 0, W, H);
    if (opt.frame) { const f = opt.frame, k = Math.max(W / f.width, H / f.height), w = f.width * k, hh = f.height * k; g.drawImage(f, (W - w) / 2, (H - hh) / 2, w, hh); const sh = g.createLinearGradient(0, 0, 0, H); sh.addColorStop(0, 'rgba(5,7,10,.92)'); sh.addColorStop(0.4, 'rgba(5,7,10,.55)'); sh.addColorStop(0.7, 'rgba(5,7,10,.45)'); sh.addColorStop(1, 'rgba(5,7,10,.93)'); g.fillStyle = sh; g.fillRect(0, 0, W, H); }
    this.glow(g, 540, 60, 900, 'rgba(255,140,30,.42)'); this.glow(g, 930, 1780, 760, 'rgba(139,108,255,.30)'); this.glow(g, 120, 1100, 520, 'rgba(255,90,0,.10)');
    // siatka sześciokątów (znak marki): cienka kratka + kilka rozświetlonych w stożku
    const r = 60, dx = r * Math.sqrt(3), dy = r * 1.5; g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.055)';
    for (let row = -1; row * dy < H + r; row++) for (let col = -1; col * dx < W + dx; col++) {
      const x = col * dx + (row % 2 ? dx / 2 : 0), y = row * dy; this.hexPath(g, x, y, r - 3); g.stroke();
      const inCone = Math.abs(x - 540) < 60 + y * 0.42 && y < 1330; if (inCone && R() < 0.17) { g.fillStyle = 'rgba(255,' + (150 + Math.floor(R() * 80)) + ',60,' + (0.05 + R() * 0.13).toFixed(3) + ')'; this.hexPath(g, x, y, r - 3); g.fill(); }
    }
    // stożek reflektora i plama światła na podłodze
    g.save(); g.globalCompositeOperation = 'screen'; const cone = g.createLinearGradient(0, -40, 0, 1340); cone.addColorStop(0, 'rgba(255,226,150,.50)'); cone.addColorStop(0.55, 'rgba(255,170,70,.20)'); cone.addColorStop(1, 'rgba(255,140,40,.05)');
    g.fillStyle = cone; g.beginPath(); g.moveTo(470, -40); g.lineTo(610, -40); g.lineTo(1010, 1340); g.lineTo(70, 1340); g.closePath(); g.fill();
    g.translate(540, 1360); g.scale(1, 0.17); const pool = g.createRadialGradient(0, 0, 0, 0, 0, 470); pool.addColorStop(0, 'rgba(255,224,150,.60)'); pool.addColorStop(1, 'rgba(255,150,40,0)'); g.fillStyle = pool; g.beginPath(); g.arc(0, 0, 470, 0, 7); g.fill(); g.restore();
    // kicker: nazwa zjawiska (fioletowa pigułka, akcent marki)
    const kick = (spec.kicker || '').toUpperCase(); let y = 420;
    if (kick) { g.font = '600 40px Inter'; g.letterSpacing = '7px'; const tw = g.measureText(kick).width, pw = tw + 80, ph = 78; g.fillStyle = '#8B6CFF'; g.beginPath(); g.roundRect((W - pw) / 2, y - ph / 2, pw, ph, ph / 2); g.fill(); g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(kick, W / 2 + 3, y + 3); g.letterSpacing = '0px'; y += 150; }
    // hook: do 3 linii, linia w gwiazdkach = gradient i największy rozmiar
    const lines = (spec.lines || []).map((s) => String(s || '').trim()).filter(Boolean).slice(0, 4); g.textAlign = 'center'; g.textBaseline = 'alphabetic'; const maxW = 900;
    for (const raw of lines) {
      const hl = /^\*.*\*$/.test(raw), txt = raw.replace(/^\*|\*$/g, ''), font = (s) => 'italic 900 ' + s + 'px "Barlow Condensed"', sz = this.fit(g, txt, font, maxW, hl ? 300 : 200, 90); g.font = font(sz); y += sz * 0.86;
      g.lineJoin = 'round'; g.lineWidth = 14; g.strokeStyle = 'rgba(5,7,10,.70)'; g.strokeText(txt, W / 2, y);
      if (hl) { const tw = g.measureText(txt).width, gr = g.createLinearGradient(W / 2 - tw / 2, 0, W / 2 + tw / 2, 0); gr.addColorStop(0, '#FF5A00'); gr.addColorStop(1, '#FFE600'); g.fillStyle = gr; } else g.fillStyle = '#F5F7FA';
      g.fillText(txt, W / 2, y); y += sz * 0.14 + 14;
    }
    if (spec.sub) { y += 52; const sz = this.fit(g, spec.sub, (s) => '600 ' + s + 'px Inter', maxW, 50, 30); g.font = '600 ' + sz + 'px Inter'; g.fillStyle = 'rgba(245,247,250,.92)'; g.shadowColor = 'rgba(5,7,10,.8)'; g.shadowBlur = 14; g.fillText(spec.sub, W / 2, y); g.shadowBlur = 0; }
    // sygnatura: logo lewy dół, @ prawy dół (w pasie bezpiecznym)
    const logo = await this.img(opt.logo || 'logo.svg'); if (logo) g.drawImage(logo, 90, 1500, 150, 131);
    g.textAlign = 'right'; g.textBaseline = 'alphabetic'; g.font = 'italic 800 60px "Barlow Condensed"'; const hn = 'trenuj.smialo', hw = g.measureText(hn).width; g.fillStyle = '#F5F7FA'; g.fillText(hn, 990, 1618); g.fillStyle = '#FF7A1A'; g.fillText('@', 990 - hw - 2, 1618);
    return await new Promise((ok) => c.toBlob(ok, 'image/png'));
  },
};
