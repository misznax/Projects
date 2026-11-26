/* Stage — interaktywna scena (przesuwanie, skalowanie, obrót, przyciąganie), wspólna dla Creative i Video */
class Stage {
  constructor(host, o) {
    this.o = o; this.host = host; this.safe = false; this.t = 0; this.drag = null;
    this.cv = h('canvas', { class: 'stage-cv' }); this.ov = h('div', { class: 'stage-ov' }); this.wrap = h('div', { class: 'stage-wrap' }, this.cv, this.ov);
    host.innerHTML = ''; host.append(this.wrap); host.tabIndex = 0;
    this.ro = new ResizeObserver(() => this.fit()); this.ro.observe(host);
    this.cv.addEventListener('pointerdown', (e) => this.down(e)); this.ov.addEventListener('pointerdown', (e) => this.down(e));
    this.cv.addEventListener('dblclick', (e) => { const l = this.hit(e); if (l && o.onEdit) o.onEdit(l); });
    window.addEventListener('pointermove', this._mv = (e) => this.move(e)); window.addEventListener('pointerup', this._up = (e) => this.up(e));
    host.addEventListener('keydown', (e) => this.key(e));
  }
  destroy() { this.ro.disconnect(); window.removeEventListener('pointermove', this._mv); window.removeEventListener('pointerup', this._up); }
  get sc() { return this.o.scene(); }
  fit() {
    const sc = this.sc; if (!sc) return; const pw = this.host.clientWidth - 24, ph = this.host.clientHeight - 24; if (pw < 50 || ph < 50) return;
    const k = Math.min(pw / sc.w, ph / sc.h), dpr = Math.min(window.devicePixelRatio || 1, 2); this.k = k;
    this.wrap.style.width = Math.round(sc.w * k) + 'px'; this.wrap.style.height = Math.round(sc.h * k) + 'px';
    const cw = Math.round(sc.w * k * dpr), ch = Math.round(sc.h * k * dpr); if (this.cv.width !== cw || this.cv.height !== ch) { this.cv.width = cw; this.cv.height = ch; }
    this.render(this.t);
  }
  render(t) {
    const sc = this.sc; if (!sc) return; if (t != null) this.t = t; if (!this.k) { this.fit(); return; }
    const ctx = this.cv.getContext('2d'), k = this.cv.width / sc.w; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, this.cv.width, this.cv.height); ctx.setTransform(k, 0, 0, k, 0, 0);
    drawScene(ctx, sc, this.t, this.o.draw ? this.o.draw() : {});
    preloadScene(sc).then((c) => { if (c) this.render(); });
    this.overlay();
  }
  overlay() {
    const sc = this.sc, k = this.k, ov = this.ov; ov.innerHTML = '';
    if (this.safe) { const mk = (cls, st) => ov.append(h('div', { class: 'safe ' + cls, style: st })); if (sc.h / sc.w > 1.5) { mk('t', { left: 0, top: 0, right: 0, height: SAFE.top * k + 'px' }); mk('b', { left: 0, bottom: 0, right: 0, height: SAFE.bottom * k + 'px' }); mk('l', { left: 0, top: SAFE.top * k + 'px', bottom: SAFE.bottom * k + 'px', width: SAFE.left * k + 'px' }); mk('r', { right: 0, top: SAFE.top * k + 'px', bottom: SAFE.bottom * k + 'px', width: SAFE.right * k + 'px' }); ov.append(h('div', { class: 'safe-lbl', style: { top: (SAFE.top * k + 4) + 'px' } }, 'strefa bezpieczna (UI Instagrama/TikToka)')); } else { const m = 54 * k; mk('t', { left: 0, top: 0, right: 0, height: m + 'px' }); mk('b', { left: 0, bottom: 0, right: 0, height: m + 'px' }); } }
    const l = this.o.sel(); if (!l || l.hide) return;
    const box = h('div', { class: 'selbox' + (l.lock ? ' locked' : ''), style: { left: l.x * k + 'px', top: l.y * k + 'px', width: l.w * k + 'px', height: l.h * k + 'px', transform: `translate(-50%,-50%) rotate(${l.rot}deg)` } });
    if (!l.lock) { for (const hd of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) box.append(h('i', { class: 'hd ' + hd, 'data-h': hd })); box.append(h('i', { class: 'hd rot', 'data-h': 'rot' })); }
    ov.append(box); this.box = box;
    if (this.drag && this.drag.guides) for (const g of this.drag.guides) ov.append(h('div', { class: 'guide ' + g.a, style: g.a === 'v' ? { left: g.p * k + 'px' } : { top: g.p * k + 'px' } }));
  }
  pt(e) { const r = this.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * this.sc.w, y: (e.clientY - r.top) / r.height * this.sc.h }; }
  hit(e) {
    const p = this.pt(e), sc = this.sc, full = (l) => l.type === 'fx' && l.w >= sc.w * 0.9 && l.h >= sc.h * 0.9; // efekt na cały ekran łapie klik dopiero, gdy pod kursorem nie ma nic innego
    for (let pass = 0; pass < 2; pass++) for (let i = sc.layers.length - 1; i >= 0; i--) {
      const l = sc.layers[i]; if (l.hide || l.lock || (this.o.visible && !this.o.visible(l, this.t)) || (pass === 0 && full(l))) continue;
      const a = -l.rot * Math.PI / 180, dx = p.x - l.x, dy = p.y - l.y, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a);
      if (Math.abs(lx) <= l.w / 2 && Math.abs(ly) <= l.h / 2) return l;
    }
    return null;
  }
  down(e) {
    if (e.button !== 0) return; this.host.focus({ preventScroll: true }); const sc = this.sc, p = this.pt(e), hd = e.target.dataset && e.target.dataset.h, cur = this.o.sel();
    if (hd && cur) { this.drag = { mode: hd === 'rot' ? 'rot' : 'size', hd, l: cur, start: p, orig: jclone(cur), moved: false }; e.preventDefault(); return; }
    const l = this.hit(e); this.o.select(l ? l.id : null);
    if (l) { this.drag = { mode: 'move', l, start: p, orig: { x: l.x, y: l.y }, moved: false }; e.preventDefault(); }
  }
  move(e) {
    const d = this.drag; if (!d) return; const p = this.pt(e), l = d.l, sc = this.sc; d.moved = true; d.guides = [];
    if (d.mode === 'move') {
      let nx = d.orig.x + (p.x - d.start.x), ny = d.orig.y + (p.y - d.start.y); const th = 10 / this.k;
      if (!e.altKey) { // przyciąganie środka i krawędzi do środka sceny, krawędzi sceny i innych warstw
        const xs = [sc.w / 2, 0, sc.w], ys = [sc.h / 2, 0, sc.h]; for (const o of sc.layers) if (o !== l && !o.hide && (!this.o.visible || this.o.visible(o, this.t))) { xs.push(o.x, o.x - o.w / 2, o.x + o.w / 2); ys.push(o.y, o.y - o.h / 2, o.y + o.h / 2); }
        let bx = th, by = th, sx = null, sy = null;
        for (const off of [0, -l.w / 2, l.w / 2]) for (const c of xs) { const dd = Math.abs(nx + off - c); if (dd < bx) { bx = dd; sx = c - off; d.gx = c; } }
        for (const off of [0, -l.h / 2, l.h / 2]) for (const c of ys) { const dd = Math.abs(ny + off - c); if (dd < by) { by = dd; sy = c - off; d.gy = c; } }
        if (sx != null) { nx = sx; d.guides.push({ a: 'v', p: d.gx }); } if (sy != null) { ny = sy; d.guides.push({ a: 'h', p: d.gy }); }
      }
      l.x = Math.round(nx * 10) / 10; l.y = Math.round(ny * 10) / 10;
    } else if (d.mode === 'rot') {
      let a = Math.atan2(p.y - l.y, p.x - l.x) * 180 / Math.PI + 90; if (e.shiftKey) a = Math.round(a / 15) * 15; l.rot = Math.round(a * 10) / 10;
    } else {
      const o = d.orig, a = -o.rot * Math.PI / 180, dx = p.x - o.x, dy = p.y - o.y, px = dx * Math.cos(a) - dy * Math.sin(a), py = dx * Math.sin(a) + dy * Math.cos(a), hd = d.hd;
      const hx = hd.includes('e') ? 1 : hd.includes('w') ? -1 : 0, hy = hd.includes('s') ? 1 : hd.includes('n') ? -1 : 0, ax = -hx * o.w / 2, ay = -hy * o.h / 2;
      let nw = hx ? Math.max(20, Math.abs(px - ax)) : o.w, nh = hy ? Math.max(20, Math.abs(py - ay)) : o.h;
      const keep = hx && hy && (o.type === 'image' || o.type === 'video' || e.shiftKey || o.type === 'text');
      if (keep) { const s = Math.max(nw / o.w, nh / o.h); nw = o.w * s; nh = o.h * s; }
      const cxl = hx ? ax + hx * nw / 2 : 0, cyl = hy ? ay + hy * nh / 2 : 0, ca = o.rot * Math.PI / 180;
      l.x = Math.round((o.x + cxl * Math.cos(ca) - cyl * Math.sin(ca)) * 10) / 10; l.y = Math.round((o.y + cxl * Math.sin(ca) + cyl * Math.cos(ca)) * 10) / 10; l.w = Math.round(nw);
      if (l.type === 'text') { if (hx && hy) l.text.size = Math.max(8, Math.round(o.text.size * nw / o.w)); } else l.h = Math.round(nh);
    }
    this.render(); if (this.o.change) this.o.change('live');
  }
  up() { const d = this.drag; this.drag = null; if (d && d.moved) { this.render(); if (this.o.change) this.o.change('commit'); } else if (d) this.overlay(); }
  key(e) {
    const l = this.o.sel(); const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (this.o.key && this.o.key(e)) return;
    if (!l || l.lock) return; const st = e.shiftKey ? 10 : 1; let m = true;
    if (e.key === 'ArrowLeft') l.x -= st; else if (e.key === 'ArrowRight') l.x += st; else if (e.key === 'ArrowUp') l.y -= st; else if (e.key === 'ArrowDown') l.y += st; else m = false;
    if (m) { e.preventDefault(); this.render(); if (this.o.change) this.o.change('commit'); }
  }
}
