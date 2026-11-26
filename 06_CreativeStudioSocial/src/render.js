/* Renderer wspólny dla Creative, Video (podgląd) i eksportu: jedna funkcja drawScene(ctx, scene, t) */
const FORMATS = {
  post45: { n: 'Post 4:5 (1080×1350)', w: 1080, h: 1350 }, square: { n: 'Post 1:1 (1080×1080)', w: 1080, h: 1080 }, story: { n: 'Story / Rolka 9:16 (1080×1920)', w: 1080, h: 1920 },
  cover: { n: 'Okładka rolki (1080×1920)', w: 1080, h: 1920 }, land: { n: 'Poziomo 16:9 (1920×1080)', w: 1920, h: 1080 }, thumb: { n: 'Miniatura YouTube (1280×720)', w: 1280, h: 720 },
};
const SAFE = { top: 250, bottom: 340, left: 60, right: 120 }; // przybliżone strefy UI Instagrama/TikToka dla 1080×1920
const FONTS_SYS = ['Georgia', 'Segoe UI', 'Arial', 'Arial Black', 'Impact', 'Trebuchet MS', 'Verdana', 'Tahoma', 'Palatino Linotype', 'Times New Roman', 'Courier New', 'Comic Sans MS', 'Franklin Gothic Medium', 'Gill Sans', 'system-ui', 'serif', 'sans-serif', 'monospace'];
const allFonts = () => [...(P.cur ? (P.cur.brand.fonts || []).map((f) => f.family) : []), ...FONTS_SYS];

const EASE = {
  linear: (t) => t, inQuad: (t) => t * t, outQuad: (t) => t * (2 - t), inCubic: (t) => t * t * t, outCubic: (t) => 1 - Math.pow(1 - t, 3), inOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outExpo: (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t), outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: (t) => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1,
  outBounce: (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; },
  inBack: (t) => { const c1 = 1.70158; return (c1 + 1) * t * t * t - c1 * t * t; },
};
const EASES = [['outCubic', 'Miękkie wyhamowanie'], ['outExpo', 'Szybki start, łagodne dojście'], ['outBack', 'Z odbiciem (back)'], ['outElastic', 'Sprężyna'], ['outBounce', 'Odbicie (bounce)'], ['inOutCubic', 'Płynne S'], ['linear', 'Liniowo'], ['inCubic', 'Przyspieszenie'], ['inBack', 'Cofnięcie i wyrzut']];
const ANIMS = [['none', 'Brak'], ['fade', 'Pojawienie (fade)'], ['slide', 'Wjazd (slide)'], ['rise', 'Uniesienie'], ['zoom', 'Przybliżenie (zoom in)'], ['zoomout', 'Oddalenie (zoom out)'], ['pop', 'Wyskok (pop)'], ['reveal', 'Odsłonięcie maską (wipe)'], ['circle', 'Maska kołowa'], ['blur', 'Rozmycie ruchu (motion blur)'], ['spin', 'Obrót'], ['typewriter', 'Maszyna do pisania (tekst)'], ['words', 'Słowo po słowie (kinetyczny tekst)'], ['chars', 'Litera po literze (kinetyczny tekst)'], ['lines', 'Linia po linii (tekst)']];
const LOOPS = [['none', 'Brak'], ['float', 'Unoszenie'], ['pulse', 'Pulsowanie'], ['kenburns', 'Ken Burns (powolny zoom)'], ['parallax', 'Parallax (przesuw w głębi)'], ['sway', 'Kołysanie']];
const DIRS = [['left', 'z lewej'], ['right', 'z prawej'], ['top', 'z góry'], ['bottom', 'z dołu']];
const IMGS = new Map(); // assetId -> HTMLImageElement (preload)
const VIDS = new Map(); // layerId -> HTMLVideoElement
const _lay = new Map();

// ── Fabryka warstw ──
function mkLayer(type, o) {
  const base = { id: uid('l'), type, name: { text: 'Tekst', image: 'Obraz', shape: 'Kształt', video: 'Wideo', fx: 'Efekt' }[type] || type, x: 540, y: 960, w: 600, h: 200, rot: 0, op: 1, t0: 0, t1: 1e6, track: { text: 'text', image: 'image', shape: 'graphic', video: 'video', fx: 'anim' }[type], lock: false, hide: false, kf: [], anim: { in: { p: 'none', d: 0.6, dl: 0, e: 'outCubic', dir: 'bottom' }, out: { p: 'none', d: 0.4, dl: 0, e: 'inCubic', dir: 'bottom' }, loop: { p: 'none', amp: 1, spd: 1 } } };
  const d = {
    text: { text: { s: 'Twój tekst', font: P.cur ? P.cur.brand.headingFont : 'Georgia', size: 84, weight: 700, italic: false, color: '#ffffff', align: 'center', lh: 1.15, ls: 0, upper: false, stroke: { w: 0, c: '#000000' }, shadow: { on: false, x: 0, y: 6, b: 16, c: 'rgba(0,0,0,.45)' }, bg: { on: false, c: '#000000', pad: 28, r: 18 }, pad: 0 }, autoH: true },
    image: { img: { assetId: null, fit: 'cover', r: 0, flipX: false, b: 1, c: 1, s: 1, blur: 0 }, w: 600, h: 600 },
    shape: { shape: { kind: 'rect', fill: '#ffffff', fill2: '', gAngle: 90, r: 0, stroke: { w: 0, c: '#ffffff' }, shadow: { on: false, x: 0, y: 8, b: 20, c: 'rgba(0,0,0,.35)' } }, w: 400, h: 400 },
    video: { video: { assetId: null, in: 0, speed: 1, vol: 0, mute: false, fit: 'cover', r: 0 }, w: 1080, h: 1920 },
    fx: { fx: { kind: 'orbs', c1: '#ffffff', c2: '#888888', c3: '#444444', n: 24, spd: 1 }, w: 1080, h: 1920 },
  }[type];
  return Object.assign(base, jclone(d), o || {});
}

// ── Układ tekstu ──
function fontStr(tx, size) { return `${tx.italic ? 'italic ' : ''}${tx.weight} ${size || tx.size}px "${tx.font}", sans-serif`; }
function layoutText(ctx, l) {
  const tx = l.text, pad = (tx.bg.on ? tx.bg.pad : 0) + (tx.pad || 0), key = [tx.s, tx.font, tx.size, tx.weight, tx.italic, tx.ls, tx.upper, l.w, pad, tx.lh, tx.align].join('|');
  const hit = _lay.get(key); if (hit) return hit;
  ctx.save(); ctx.font = fontStr(tx); if ('letterSpacing' in ctx) ctx.letterSpacing = (tx.ls || 0) + 'px';
  const maxW = Math.max(20, l.w - 2 * pad), lines = [], src = tx.upper ? String(tx.s).toUpperCase() : String(tx.s);
  for (const para of src.split('\n')) {
    const words = para.split(' '); let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    lines.push(cur);
  }
  const lh = tx.size * tx.lh, out = { lines: [], lh, h: lines.length * lh, pad };
  for (const s of lines) {
    const w = ctx.measureText(s).width, words = []; let x = 0;
    for (const part of s.split(/( )/)) { if (part === '') continue; const pw = ctx.measureText(part).width; if (part !== ' ') words.push({ s: part, x, w: pw }); x += pw; }
    const chars = []; for (let i = 0; i < s.length; i++) { const x0 = ctx.measureText(s.slice(0, i)).width; chars.push({ s: s[i], x: x0, w: ctx.measureText(s[i]).width }); }
    out.lines.push({ s, w, words, chars });
  }
  ctx.restore(); if (_lay.size > 300) _lay.clear(); _lay.set(key, out); return out;
}

// ── Stan animacji warstwy w czasie t ──
function interpKf(l, lt, st) {
  const k = l.kf; if (!k || !k.length) return; const a = k.slice().sort((p, q) => p.t - q.t); let i = 0; while (i < a.length - 1 && lt >= a[i + 1].t) i++;
  const A = a[i], B = a[Math.min(i + 1, a.length - 1)]; let u = B.t > A.t ? clamp((lt - A.t) / (B.t - A.t), 0, 1) : 1; u = (EASE[A.e] || EASE.inOutCubic)(u); if (lt <= a[0].t) { u = 0; }
  const g = (p, d) => { const x = A[p] == null ? d : A[p], y = B[p] == null ? d : B[p]; return lerp(x, y, lt >= a[a.length - 1].t ? 1 : u); };
  if (A.x != null || B.x != null) st.x = g('x', l.x); if (A.y != null || B.y != null) st.y = g('y', l.y); st.s *= g('s', 1); st.r += g('r', 0); st.o *= g('o', 1);
}
function applyPreset(st, cfg, v, l, W, H) {
  if (!cfg || cfg.p === 'none') return; const p = cfg.p, d = cfg.dir || 'bottom', dist = Math.max(160, Math.max(W, H) * 0.22), vv = v, ov = clamp(v, 0, 1);
  const off = (amt) => { const k = (1 - vv) * amt; if (d === 'left') st.dx -= k; else if (d === 'right') st.dx += k; else if (d === 'top') st.dy -= k; else st.dy += k; };
  switch (p) {
    case 'fade': st.o *= ov; break;
    case 'slide': off(dist); st.o *= clamp(ov * 1.8, 0, 1); break;
    case 'rise': off(90); st.o *= ov; break;
    case 'zoom': st.s *= 0.55 + 0.45 * vv; st.o *= ov; break;
    case 'zoomout': st.s *= 1.6 - 0.6 * vv; st.o *= ov; break;
    case 'pop': st.s *= Math.max(0, vv); st.o *= clamp(ov * 3, 0, 1); break;
    case 'reveal': st.clip = { k: 'wipe', v: ov, d }; break;
    case 'circle': st.clip = { k: 'circle', v: ov }; break;
    case 'blur': st.blur += (1 - ov) * 32; st.o *= clamp(ov * 1.5, 0, 1); st.dy += (1 - vv) * 30; break;
    case 'spin': st.r += (1 - vv) * -140; st.s *= 0.4 + 0.6 * vv; st.o *= ov; break;
    case 'typewriter': st.unit = (kind, i, n) => ({ a: kind === 'chars' ? (i < Math.floor(ov * n + 1e-6) ? 1 : 0) : 1, dy: 0, sc: 1 }); st.unitKind = 'chars'; break;
    case 'words': case 'chars': case 'lines': st.unitKind = p; st.unit = (kind, i, n) => { const u = clamp(vv * (n + 0.9) - i, 0, 1.4), e = EASE.outBack(clamp(u, 0, 1)); return { a: clamp(u * 1.6, 0, 1), dy: (1 - e) * 46, sc: 0.78 + 0.22 * e }; }; break;
  }
}
function layerState(l, t, W, H) {
  const D = Math.max(0.001, l.t1 - l.t0), lt = t - l.t0, a = l.anim || {};
  const st = { x: l.x, y: l.y, dx: 0, dy: 0, s: 1, sx: 1, sy: 1, r: 0, o: 1, blur: 0, clip: null, unit: null, unitKind: null, kb: 1, kbx: 0, kby: 0 };
  interpKf(l, lt, st);
  const vin = a.in && a.in.p !== 'none' ? (EASE[a.in.e] || EASE.outCubic)(clamp((lt - (a.in.dl || 0)) / Math.max(0.01, a.in.d), 0, 1)) : 1;
  const vout = a.out && a.out.p !== 'none' ? 1 - (EASE[a.out.e] || EASE.inCubic)(clamp((lt - (D - a.out.d - (a.out.dl || 0))) / Math.max(0.01, a.out.d), 0, 1)) : 1;
  if (a.in && a.in.p !== 'none' && lt < (a.in.dl || 0)) st.o = 0;
  applyPreset(st, a.in, vin, l, W, H); if (vout < 1 || (a.out && a.out.p !== 'none' && lt > D - a.out.d - (a.out.dl || 0))) applyPreset(st, a.out, vout, l, W, H);
  const lp = a.loop; if (lp && lp.p !== 'none') {
    const amp = lp.amp == null ? 1 : lp.amp, spd = lp.spd == null ? 1 : lp.spd, ph = lt * spd * Math.PI * 2 * 0.5;
    if (lp.p === 'float') st.dy += Math.sin(ph) * 14 * amp; else if (lp.p === 'pulse') st.s *= 1 + Math.sin(ph * 1.6) * 0.035 * amp; else if (lp.p === 'sway') st.r += Math.sin(ph) * 2.2 * amp;
    else if (lp.p === 'kenburns') { const u = clamp(lt / D, 0, 1); st.kb = 1 + 0.14 * amp * u; st.kbx = (u - 0.5) * -26 * amp; st.kby = (u - 0.5) * -16 * amp; }
    else if (lp.p === 'parallax') { const u = lt / D; st.dx += (u - 0.5) * 90 * amp; st.kb = 1.06 * (1 + 0.02 * amp); }
  }
  return st;
}

// ── Rysowanie ──
function rr(ctx, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); if (r <= 0) { ctx.rect(x, y, w, h); return; } ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function fillGrad(ctx, x, y, w, h, c1, c2, angle) { const a = (angle || 0) * Math.PI / 180, cx = x + w / 2, cy = y + h / 2, L = Math.abs(w * Math.cos(a)) / 2 + Math.abs(h * Math.sin(a)) / 2, g = ctx.createLinearGradient(cx - Math.cos(a) * L, cy - Math.sin(a) * L, cx + Math.cos(a) * L, cy + Math.sin(a) * L); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; }
const rng = (seed) => { let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
function applyClip(ctx, c, w, h) {
  ctx.beginPath();
  if (c.k === 'circle') { const R = Math.hypot(w, h) / 2 * c.v; ctx.arc(0, 0, Math.max(0.01, R), 0, Math.PI * 2); }
  else { const v = c.v; if (c.d === 'left') ctx.rect(-w / 2, -h / 2, w * v, h); else if (c.d === 'right') ctx.rect(w / 2 - w * v, -h / 2, w * v, h); else if (c.d === 'top') ctx.rect(-w / 2, -h / 2, w, h * v); else ctx.rect(-w / 2, h / 2 - h * v, w, h * v); }
  ctx.clip();
}
function drawBg(ctx, bg, W, H, t) {
  ctx.save();
  if (bg.type === 'image' && bg.assetId && IMGS.get(bg.assetId)) { const im = IMGS.get(bg.assetId), s = Math.max(W / im.naturalWidth, H / im.naturalHeight); ctx.fillStyle = bg.c1 || '#000'; ctx.fillRect(0, 0, W, H); ctx.drawImage(im, (W - im.naturalWidth * s) / 2, (H - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); }
  else if (bg.type === 'grad') { ctx.fillStyle = fillGrad(ctx, 0, 0, W, H, bg.c1, bg.c2, bg.angle == null ? 90 : bg.angle); ctx.fillRect(0, 0, W, H); }
  else if (bg.type === 'agrad') { const a = (bg.angle || 90) + t * 18; ctx.fillStyle = fillGrad(ctx, 0, 0, W, H, bg.c1, bg.c2, a); ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W * (0.5 + 0.3 * Math.sin(t * 0.7)), H * (0.4 + 0.2 * Math.cos(t * 0.5)), 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7); g.addColorStop(0, (bg.c3 || bg.c2) + '66'); g.addColorStop(1, '#00000000'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  else { ctx.fillStyle = bg.c1 || '#fff'; ctx.fillRect(0, 0, W, H); }
  if (bg.dark) { ctx.fillStyle = `rgba(0,0,0,${bg.dark})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
function drawText(ctx, l, st) {
  const tx = l.text, lay = layoutText(ctx, l), pad = lay.pad; if (l.autoH !== false) l.h = Math.max(tx.size * tx.lh, lay.h + 2 * pad);
  const w = l.w, h = l.h;
  if (tx.bg.on) { ctx.save(); ctx.fillStyle = tx.bg.c; rr(ctx, -w / 2, -h / 2, w, h, tx.bg.r); ctx.fill(); ctx.restore(); }
  ctx.font = fontStr(tx); if ('letterSpacing' in ctx) ctx.letterSpacing = (tx.ls || 0) + 'px'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  if (tx.shadow.on) { ctx.shadowColor = tx.shadow.c; ctx.shadowBlur = tx.shadow.b; ctx.shadowOffsetX = tx.shadow.x; ctx.shadowOffsetY = tx.shadow.y; }
  const top = -lay.h / 2; let gi = 0; const kind = st.unitKind, total = kind === 'lines' ? lay.lines.length : kind === 'words' ? lay.lines.reduce((a, q) => a + q.words.length, 0) : lay.lines.reduce((a, q) => a + q.chars.length, 0);
  lay.lines.forEach((ln, li) => {
    const y = top + li * lay.lh + lay.lh / 2, x0 = tx.align === 'left' ? -w / 2 + pad : tx.align === 'right' ? w / 2 - pad - ln.w : -ln.w / 2;
    const drawStr = (s, x, yy) => { if (tx.stroke.w > 0) { ctx.strokeStyle = tx.stroke.c; ctx.lineWidth = tx.stroke.w * 2; ctx.strokeText(s, x, yy); } ctx.fillStyle = tx.color; ctx.fillText(s, x, yy); };
    if (!st.unit) { drawStr(ln.s, x0, y); return; }
    if (kind === 'lines') { const u = st.unit('lines', gi++, total); ctx.save(); ctx.globalAlpha *= u.a; ctx.translate(0, u.dy); drawStr(ln.s, x0, y); ctx.restore(); return; }
    const arr = kind === 'words' ? ln.words : ln.chars;
    for (const un of arr) { const u = st.unit(kind, gi++, total); if (u.a <= 0.003) continue; ctx.save(); ctx.globalAlpha *= u.a; const cx = x0 + un.x + un.w / 2; ctx.translate(cx, y + u.dy); ctx.scale(u.sc, u.sc); drawStr(un.s, -un.w / 2, 0); ctx.restore(); }
  });
}
function coverRect(iw, ih, w, h, fit, k) { const s = (fit === 'contain' ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih)) * (k || 1); return [-iw * s / 2, -ih * s / 2, iw * s, ih * s]; }
function drawMedia(ctx, el, iw, ih, l, cfg, st) {
  const w = l.w, h = l.h; ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, cfg.r || 0); ctx.clip();
  const f = []; if (cfg.b != null && cfg.b !== 1) f.push(`brightness(${cfg.b})`); if (cfg.c != null && cfg.c !== 1) f.push(`contrast(${cfg.c})`); if (cfg.s != null && cfg.s !== 1) f.push(`saturate(${cfg.s})`); if (cfg.blur) f.push(`blur(${cfg.blur}px)`);
  if (f.length) ctx.filter = (ctx.filter && ctx.filter !== 'none' ? ctx.filter + ' ' : '') + f.join(' ');
  if (cfg.flipX) ctx.scale(-1, 1); const [x, y, rw, rh] = coverRect(iw, ih, w, h, cfg.fit, st.kb); ctx.drawImage(el, x + (st.kbx || 0), y + (st.kby || 0), rw, rh); ctx.restore();
}
function drawShape(ctx, l) {
  const s = l.shape, w = l.w, h = l.h; ctx.save();
  if (s.shadow && s.shadow.on) { ctx.shadowColor = s.shadow.c; ctx.shadowBlur = s.shadow.b; ctx.shadowOffsetX = s.shadow.x; ctx.shadowOffsetY = s.shadow.y; }
  ctx.fillStyle = s.fill2 ? fillGrad(ctx, -w / 2, -h / 2, w, h, s.fill, s.fill2, s.gAngle) : s.fill;
  if (s.kind === 'ellipse') { ctx.beginPath(); ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); } else rr(ctx, -w / 2, -h / 2, w, h, s.kind === 'line' ? h / 2 : s.r);
  ctx.fill(); if (s.stroke && s.stroke.w > 0) { ctx.shadowColor = 'transparent'; ctx.strokeStyle = s.stroke.c; ctx.lineWidth = s.stroke.w; ctx.stroke(); } ctx.restore();
}
function drawFx(ctx, l, t, lt) {
  const f = l.fx, w = l.w, h = l.h, R = rng(l.id), D = Math.max(0.1, l.t1 - l.t0), spd = f.spd == null ? 1 : f.spd; ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
  const cols = [f.c1, f.c2, f.c3].filter(Boolean);
  if (f.kind === 'agrad') { ctx.fillStyle = fillGrad(ctx, -w / 2, -h / 2, w, h, f.c1, f.c2, 90 + lt * 22 * spd); ctx.fillRect(-w / 2, -h / 2, w, h); }
  else if (f.kind === 'orbs') { for (let i = 0; i < Math.min(f.n || 8, 40); i++) { const r0 = R(), r1 = R(), r2 = R(), r3 = R(), rad = (0.12 + r2 * 0.28) * Math.max(w, h), x = (r0 - 0.5) * w + Math.sin(lt * spd * (0.15 + r3 * 0.25) + i) * w * 0.18, y = (r1 - 0.5) * h + Math.cos(lt * spd * (0.12 + r3 * 0.2) + i * 1.7) * h * 0.12, g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, cols[i % cols.length] + '55'); g.addColorStop(1, cols[i % cols.length] + '00'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h); } }
  else if (f.kind === 'particles') { for (let i = 0; i < (f.n || 40); i++) { const r0 = R(), r1 = R(), r2 = R(), r3 = R(), x = (r0 - 0.5) * w + Math.sin(lt * spd * 0.6 + i) * 18, y = (((r1 - lt * spd * (0.02 + r3 * 0.05)) % 1) + 1) % 1 * h - h / 2, s = 2 + r2 * 7, a = 0.25 + 0.55 * Math.abs(Math.sin(lt * spd * 1.2 + i)); ctx.globalAlpha = a; ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill(); } }
  else if (f.kind === 'confetti') { for (let i = 0; i < (f.n || 60); i++) { const r0 = R(), r1 = R(), r2 = R(), r3 = R(), x = (r0 - 0.5) * w + Math.sin(lt * spd * 1.1 + i * 3) * 30, y = (((r1 + lt * spd * (0.1 + r3 * 0.18)) % 1) + 1) % 1 * h - h / 2; ctx.save(); ctx.translate(x, y); ctx.rotate(lt * spd * (1 + r2 * 4) + i); ctx.fillStyle = cols[i % cols.length]; ctx.fillRect(-7, -4, 14, 8); ctx.restore(); } }
  else if (f.kind === 'bar') { const u = clamp(lt / D, 0, 1); ctx.fillStyle = f.c2; rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.fillStyle = f.c1; rr(ctx, -w / 2, -h / 2, Math.max(h, w * u), h, h / 2); ctx.fill(); }
  else if (f.kind === 'stripes') { ctx.rotate(-0.4); const sw = 90; for (let i = -30; i < 30; i++) { ctx.fillStyle = i % 2 ? f.c1 + '33' : f.c2 + '22'; ctx.fillRect(i * sw + ((lt * 30 * spd) % (sw * 2)), -h, sw, h * 2); } }
  ctx.restore();
}
function drawLayer(ctx, l, t, W, H, opts) {
  if (l.hide || t < l.t0 - 1e-6 || t > l.t1 + 1e-6) return;
  const st = layerState(l, t, W, H); if (st.o <= 0.002) return;
  ctx.save(); ctx.translate(st.x + st.dx, st.y + st.dy); ctx.rotate((l.rot + st.r) * Math.PI / 180); ctx.scale(st.s * st.sx, st.s * st.sy); ctx.globalAlpha *= clamp(l.op * st.o, 0, 1); if (st.blur > 0.2) ctx.filter = `blur(${st.blur.toFixed(1)}px)`;
  if (st.clip) applyClip(ctx, st.clip, l.w, l.h);
  try {
    if (l.type === 'text') drawText(ctx, l, st);
    else if (l.type === 'image') { const im = IMGS.get(l.img.assetId); if (im) drawMedia(ctx, im, im.naturalWidth, im.naturalHeight, l, l.img, st); else { ctx.fillStyle = 'rgba(128,128,128,.25)'; ctx.fillRect(-l.w / 2, -l.h / 2, l.w, l.h); } }
    else if (l.type === 'shape') drawShape(ctx, l);
    else if (l.type === 'video') { const v = opts && opts.video ? opts.video(l, t) : null; if (v && v.readyState >= 2 && v.videoWidth) drawMedia(ctx, v, v.videoWidth, v.videoHeight, l, l.video, st); else { ctx.fillStyle = '#222'; ctx.fillRect(-l.w / 2, -l.h / 2, l.w, l.h); } }
    else if (l.type === 'fx') drawFx(ctx, l, t, t - l.t0);
  } catch (e) { console.warn('drawLayer', l.type, e); }
  ctx.restore();
}
function drawScene(ctx, sc, t, opts) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sc.w, sc.h); ctx.clip(); drawBg(ctx, sc.bg, sc.w, sc.h, t); for (const l of sc.layers) drawLayer(ctx, l, t, sc.w, sc.h, opts); ctx.restore(); }
async function preloadScene(sc) {
  const ids = new Set(); if (sc.bg && sc.bg.assetId) ids.add(sc.bg.assetId); for (const l of sc.layers) if (l.type === 'image' && l.img.assetId) ids.add(l.img.assetId);
  let changed = false; for (const id of ids) if (!IMGS.has(id)) { try { const im = await Assets.img(id); if (im) { IMGS.set(id, im); changed = true; } } catch (e) { console.warn('asset', id, e); } }
  return changed;
}
// miniatura sceny (do list slajdów)
function thumb(sc, t, wpx) { const c = document.createElement('canvas'), k = wpx / sc.w; c.width = wpx; c.height = Math.round(sc.h * k); const x = c.getContext('2d'); x.scale(k, k); drawScene(x, sc, t || 0, {}); return c; }
