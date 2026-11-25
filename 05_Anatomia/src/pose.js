/* Silnik pozy kończyny górnej (prawa strona; lewa = lustro).
   Segmenty sztywne: tułów(0) obojczyk(1) łopatka(2) ramię(3) łokieć/kość łokciowa(4) kość promieniowa(5) dłoń(6).
   Kości i znaczniki: ruch sztywny. Mięśnie, więzadła, nerwy, naczynia: skinning (4 wpływy na wierzchołek, wagi policzone offline
   wg odległości do kości), CPU + odświeżenie drzew BVH, więc wybieranie i najechanie działają na ciele w pozie. */
import * as THREE from 'three';
const D2R = Math.PI / 180;

// zakresy ruchu zdrowego dorosłego (wartości wg piśmiennictwa: AAOS / Kapandji), w stopniach
export const DOF = [
  { k: 'gElev', g: 'Obręcz barkowa', n: 'Unoszenie ⟷ opuszczanie', neg: 'opuszczanie', pos: 'unoszenie', min: -10, max: 35, norm: 'unoszenie do ok. 35°, opuszczanie do ok. 10°' },
  { k: 'gProt', g: 'Obręcz barkowa', n: 'Protrakcja ⟷ retrakcja', neg: 'retrakcja', pos: 'protrakcja', min: -20, max: 25, norm: 'protrakcja do ok. 25°, retrakcja do ok. 20°' },
  { k: 'F', g: 'Staw ramienny', n: 'Zgięcie ⟷ wyprost', neg: 'wyprost', pos: 'zgięcie', min: -60, max: 180, norm: 'zgięcie 0–180°, wyprost 0–60°' },
  { k: 'A', g: 'Staw ramienny', n: 'Odwodzenie ⟷ przywodzenie', neg: 'przywodzenie', pos: 'odwodzenie', min: -30, max: 180, norm: 'odwodzenie 0–180°, przywodzenie do ok. 30°' },
  { k: 'R', g: 'Staw ramienny', n: 'Rotacja wewn. ⟷ zewn.', neg: 'zewnętrzna', pos: 'wewnętrzna', min: -90, max: 70, norm: 'rotacja zewnętrzna do 90°, wewnętrzna do 70°' },
  { k: 'E', g: 'Łokieć', n: 'Zgięcie łokcia', neg: 'wyprost', pos: 'zgięcie', min: 0, max: 145, norm: 'zgięcie 0–145° (wyprost 0°)' },
  { k: 'Pr', g: 'Przedramię', n: 'Odwrót ⟷ nawrót', neg: 'odwrót (supinacja)', pos: 'nawrót (pronacja)', min: -90, max: 85, norm: 'supinacja do 90°, pronacja do 85° (0° = kciuk do góry)' },
  { k: 'wFE', g: 'Nadgarstek', n: 'Wyprost ⟷ zgięcie dłoniowe', neg: 'wyprost (grzbietowo)', pos: 'zgięcie dłoniowe', min: -70, max: 80, norm: 'zgięcie dłoniowe 80°, grzbietowe (wyprost) 70°' },
  { k: 'wDev', g: 'Nadgarstek', n: 'Odchylenie promieniowe ⟷ łokciowe', neg: 'promieniowe', pos: 'łokciowe', min: -20, max: 30, norm: 'promieniowe 20°, łokciowe 30°' },
];
export const REST = { gElev: 0, gProt: 0, F: 0, A: 0, R: 0, E: 0, Pr: -90, wFE: 0, wDev: 0 };
const COUPLING = 0.30; // naturalny skręt zewnętrzny ramienia przy odwodzeniu (paradoks Codmana)

export function createPose({ onPose, base = '' }) {
  const st = { ready: false, J: null, segs: [], boneSeg: new Map(), vals: { ...REST }, rhythm: true, queue: [], rigid: [], skinned: [], meta: {}, bins: {}, dirty: false, M: null, anim: null };
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const rotAbout = (pivot, axis, deg) => { // obrót o deg wokół osi przechodzącej przez pivot (współrzędne spoczynkowe)
    const m = new THREE.Matrix4(); if (!deg) return m;
    const a = V(axis).normalize(), p = V(pivot);
    return m.makeTranslation(p.x, p.y, p.z).multiply(new THREE.Matrix4().makeRotationAxis(a, deg * D2R)).multiply(new THREE.Matrix4().makeTranslation(-p.x, -p.y, -p.z));
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  function clampVals(v) {
    const o = { ...v };
    for (const d of DOF) o[d.k] = clamp(+o[d.k] || 0, d.min, d.max);
    const e = Math.hypot(o.F, o.A); if (e > 180) { o.F *= 180 / e; o.A *= 180 / e; }
    return o;
  }
  function compute(v) {
    const J = st.J, M = Array.from({ length: 7 }, () => new THREE.Matrix4());
    const gh = V(J.gh), el = V(J.el), sc = J.sc, ac = J.ac;
    const vd = el.clone().sub(gh).normalize(), u = vd.clone().negate();
    const l = new THREE.Vector3(-1, 0, 0); l.addScaledVector(u, -l.dot(u)).normalize();
    const a = new THREE.Vector3().crossVectors(u, l);
    const e = Math.hypot(v.F, v.A), p = e < 1e-9 ? 0 : Math.atan2(v.F, v.A);
    const h = l.clone().multiplyScalar(Math.cos(p)).addScaledVector(a, Math.sin(p));
    const k = new THREE.Vector3().crossVectors(vd, h); if (k.lengthSq() < 1e-12) k.copy(a); k.normalize();
    const Qs = new THREE.Quaternion().setFromAxisAngle(k, e * D2R);
    const tw = v.R - COUPLING * Math.max(0, Math.cos(p)) * e;
    const Qt = new THREE.Quaternion().setFromAxisAngle(u, tw * D2R);
    const Rh = new THREE.Matrix4().makeRotationFromQuaternion(Qs.multiply(Qt));
    const rh = st.rhythm ? e : 0;
    const Mcl = rotAbout(sc, J.clav_elev, v.gElev + 0.12 * rh).multiply(rotAbout(sc, J.clav_retr, 0.08 * rh - v.gProt));
    const Msc = Mcl.clone().multiply(rotAbout(ac, J.scap_up, 0.22 * rh));
    const ghp = gh.clone().applyMatrix4(Msc);
    const Mh = new THREE.Matrix4().makeTranslation(ghp.x, ghp.y, ghp.z).multiply(Rh).multiply(new THREE.Matrix4().makeTranslation(-gh.x, -gh.y, -gh.z));
    const Mu = Mh.clone().multiply(rotAbout(J.el, J.el_axis, v.E));
    const Mr = Mu.clone().multiply(rotAbout(J.pr_p, J.pr_axis, v.Pr + 90));
    const Mw = Mr.clone().multiply(rotAbout(J.wr, J.wr_dev, v.wDev)).multiply(rotAbout(J.wr, J.wr_fe, v.wFE));
    M[1] = Mcl; M[2] = Msc; M[3] = Mh; M[4] = Mu; M[5] = Mr; M[6] = Mw;
    return M;
  }
  const isRest = () => DOF.every((d) => Math.abs(st.vals[d.k] - REST[d.k]) < 1e-6);

  /* ---------- rejestracja obiektów ---------- */
  const segOfBone = (b) => (st.boneSeg.has(b) ? st.boneSeg.get(b) : 0);
  function rigid(objs, seg) { // objs[0] = prawa strona (źródło), reszta = lustrzane kopie
    if (!st.ready) { st.queue.push(() => rigid(objs, typeof seg === 'function' ? seg() : seg)); return; }
    seg = typeof seg === 'function' ? seg() : seg; if (!seg) return;
    objs[0].updateMatrix(); const r = { objs, seg, N0: objs[0].matrix.clone() }; st.rigid.push(r);
    if (!isRest()) placeRigid(r, st.M || compute(st.vals));
  }
  function placeRigid(r, M) {
    const m = new THREE.Matrix4().multiplyMatrices(M[r.seg], r.N0), o = r.objs[0];
    m.decompose(o.position, o.quaternion, o.scale);
    for (let i = 1; i < r.objs.length; i++) { const c = r.objs[i]; c.position.copy(o.position); c.quaternion.copy(o.quaternion); c.scale.copy(o.scale); }
  }
  function loadBin(key) {
    if (!st.bins[key]) st.bins[key] = fetch(`${base}skin_${key}.bin`).then((r) => { if (!r.ok) throw new Error(key + ' ' + r.status); return r.arrayBuffer(); }).then((b) => new Uint8Array(b)).catch((e) => { console.warn('skin', e); return null; });
    return st.bins[key];
  }
  function skinned(key, name, objs) { // objs[0] i kopie współdzielą geometrię
    const go = async () => {
      const ent = st.meta[key] && st.meta[key].get(name); if (!ent) return;
      const bin = await loadBin(key); if (!bin) return;
      const geom = objs[0].geometry, pa = geom.attributes.position; if (!pa || pa.count !== ent.cnt) { console.warn('skin: niezgodna liczba wierzchołków', name, pa && pa.count, ent.cnt); return; }
      objs[0].updateMatrix(); const N0 = objs[0].matrix.clone();
      const s = { name, objs, geom, W: bin.subarray(ent.off * 8, (ent.off + ent.cnt) * 8), cnt: ent.cnt, N0, N0i: N0.clone().invert(), pos0: Float32Array.from(pa.array), nor0: geom.attributes.normal ? Float32Array.from(geom.attributes.normal.array) : null, stale: false };
      st.skinned.push(s);
      if (!isRest()) { s.stale = true; sync(); }
    };
    if (!st.ready) st.queue.push(go); else go();
  }
  const A = Array.from({ length: 7 }, () => new Float32Array(16));
  function skinOne(s, M) {
    const g = s.geom, pos = g.attributes.position.array, nor = g.attributes.normal ? g.attributes.normal.array : null;
    if (isRest()) { pos.set(s.pos0); if (nor && s.nor0) nor.set(s.nor0); }
    else {
      const tmp = new THREE.Matrix4();
      for (let i = 1; i < 7; i++) { tmp.copy(s.N0i).multiply(M[i]).multiply(s.N0); A[i].set(tmp.elements); }
      const W = s.W, p0 = s.pos0, n0 = s.nor0;
      for (let i = 0, c = s.cnt; i < c; i++) {
        const b = i * 8, i3 = i * 3, x = p0[i3], y = p0[i3 + 1], z = p0[i3 + 2];
        let px = 0, py = 0, pz = 0, nx = 0, ny = 0, nz = 0, nxx = 0, nyy = 0, nzz = 0;
        if (n0) { nxx = n0[i3]; nyy = n0[i3 + 1]; nzz = n0[i3 + 2]; }
        for (let k = 0; k < 4; k++) {
          const w8 = W[b + 4 + k]; if (!w8) break; const w = w8 / 255, sg = W[b + k];
          if (sg === 0) { px += w * x; py += w * y; pz += w * z; nx += w * nxx; ny += w * nyy; nz += w * nzz; continue; }
          const m = A[sg];
          px += w * (m[0] * x + m[4] * y + m[8] * z + m[12]); py += w * (m[1] * x + m[5] * y + m[9] * z + m[13]); pz += w * (m[2] * x + m[6] * y + m[10] * z + m[14]);
          nx += w * (m[0] * nxx + m[4] * nyy + m[8] * nzz); ny += w * (m[1] * nxx + m[5] * nyy + m[9] * nzz); nz += w * (m[2] * nxx + m[6] * nyy + m[10] * nzz);
        }
        pos[i3] = px; pos[i3 + 1] = py; pos[i3 + 2] = pz;
        if (nor) { const l = Math.hypot(nx, ny, nz) || 1; nor[i3] = nx / l; nor[i3 + 1] = ny / l; nor[i3 + 2] = nz / l; }
      }
    }
    g.attributes.position.needsUpdate = true; if (nor) g.attributes.normal.needsUpdate = true;
    g.boundingBox = null; g.boundingSphere = null;
    if (g.boundsTree) g.boundsTree.refit();
    s.stale = false;
  }
  const visible = (s) => s.objs.some((o) => o.visible);
  function sync() { // dociąga pozę do siatek, które właśnie stały się widoczne
    if (!st.ready) return; let any = false;
    for (const s of st.skinned) if (s.stale && visible(s)) { skinOne(s, st.M || (st.M = compute(st.vals))); any = true; }
    if (any) onPose();
  }
  function flush() {
    if (!st.dirty || !st.ready) return; st.dirty = false;
    const M = st.M = compute(st.vals);
    for (const r of st.rigid) placeRigid(r, M);
    for (const s of st.skinned) { if (visible(s)) skinOne(s, M); else s.stale = true; }
    onPose();
  }
  const mark = () => { st.dirty = true; };
  function set(patch) { st.vals = clampVals({ ...st.vals, ...patch }); mark(); }
  function reset() { st.anim = null; st.vals = { ...REST }; mark(); }
  function setRhythm(on) { st.rhythm = !!on; mark(); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function animateTo(target, ms = 800, done) {
    const from = { ...st.vals }, to = clampVals({ ...st.vals, ...target }), t0 = performance.now();
    st.anim = { from, to, t0, ms, done };
  }
  function tick(now) { // wołane z pętli renderowania; zwraca true, gdy trwa animacja
    const a = st.anim; if (!a) return false;
    const k = Math.min(1, (now - a.t0) / a.ms), e = ease(k), v = {};
    for (const d of DOF) v[d.k] = a.from[d.k] + (a.to[d.k] - a.from[d.k]) * e;
    st.vals = v; mark(); if (k >= 1) { st.anim = null; st.vals = clampVals(a.to); if (a.done) a.done(); }
    return true;
  }
  // punkt (współrzędne spoczynkowe prawej strony) -> punkt po pozie dla segmentu
  const tmpP = new THREE.Vector3();
  function xp(seg, p) { if (!st.ready || !seg || isRest()) return p; const M = st.M || (st.M = compute(st.vals)); return tmpP.copy(p).applyMatrix4(M[seg]).clone(); }

  const ready = fetch(base + 'pose.json').then((r) => r.json()).then((j) => {
    st.J = j.joint; st.segs = j.segs; for (const [b, s] of Object.entries(j.bone)) st.boneSeg.set(b, s);
    for (const [key, arr] of Object.entries(j.skin)) { const m = new Map(); for (const e of arr) m.set(e.n, e); st.meta[key] = m; }
    st.ready = true; st.M = compute(st.vals);
    const q = st.queue; st.queue = []; for (const f of q) f();
  }).catch((e) => { console.warn('pose.json', e); });
  return { st, ready, rigid, skinned, sync, flush, set, reset, setRhythm, animateTo, tick, xp, segOfBone, get vals() { return st.vals; }, get rhythm() { return st.rhythm; }, isRest, get active() { return !!st.anim; }, segIndex: (n) => st.segs.indexOf(n) };
}
