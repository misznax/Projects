/* Silnik pozy kończyn (prawa strona; lewa = lustro).
   Segmenty sztywne: tułów+miednica(0) obojczyk(1) łopatka(2) ramię(3) łokieć/kość łokciowa(4) kość promieniowa(5) dłoń(6), pomocnicze skrętu przedramienia(7,8), udo(9) podudzie+strzałka+rzepka(10) stopa(11).
   Kości i znaczniki: ruch sztywny. Mięśnie, więzadła, nerwy, naczynia: skinning (4 wpływy na wierzchołek, wagi policzone offline
   wg odległości do kości), CPU + odświeżenie drzew BVH, więc wybieranie i najechanie działają na ciele w pozie. */
import * as THREE from 'three';
import { segDQ, skinDQ, skinLBS, skinDelta, collide } from './dqs.js';
const D2R = Math.PI / 180;

// zakresy ruchu zdrowego dorosłego, w stopniach.
// min/max = MAKSYMALNY zdrowy zakres (górna granica piśmiennictwa: AAOS / Kapandji / Norkin & White, ruch bierny do końca zakresu),
// nmin/nmax = zakres typowy ("norma", ruch czynny, WHO / Luttgens & Hamilton). Zielone na suwaku = norma, bursztynowe = do maksimum.
export const DOF = [
  { k: 'gElev', g: 'Obręcz barkowa', n: 'Unoszenie ⟷ opuszczanie', neg: 'opuszczanie', pos: 'unoszenie', min: -10, max: 35, nmin: -10, nmax: 35, norm: 'unoszenie do ok. 35°, opuszczanie do ok. 10°' },
  { k: 'gProt', g: 'Obręcz barkowa', n: 'Protrakcja ⟷ retrakcja', neg: 'retrakcja', pos: 'protrakcja', min: -20, max: 25, nmin: -20, nmax: 25, norm: 'protrakcja do ok. 25°, retrakcja do ok. 20°' },
  { k: 'F', g: 'Staw ramienny', n: 'Zgięcie ⟷ wyprost', neg: 'wyprost', pos: 'zgięcie', min: -60, max: 180, nmin: -45, nmax: 170, norm: 'zgięcie 170–180°, wyprost 45–60°' },
  { k: 'A', g: 'Staw ramienny', n: 'Odwodzenie ⟷ przywodzenie', neg: 'przywodzenie', pos: 'odwodzenie', min: -50, max: 180, nmin: -30, nmax: 170, norm: 'odwodzenie 170–180°, przywodzenie 30–50° (tylko z lekkim zgięciem — przed tułowiem)' },
  { k: 'R', g: 'Staw ramienny', n: 'Rotacja wewn. ⟷ zewn.', neg: 'zewnętrzna', pos: 'wewnętrzna', min: -100, max: 90, nmin: -90, nmax: 70, norm: 'zewnętrzna 90° (maks. ok. 100° przy ramieniu odwiedzionym), wewnętrzna 70° (maks. ok. 90°) — zakres zależy od uniesienia ramienia' },
  { k: 'E', g: 'Łokieć', n: 'Zgięcie łokcia', neg: 'przeprost', pos: 'zgięcie', min: -10, max: 150, nmin: 0, nmax: 140, norm: 'zgięcie 140–150°, wyprost 0° (przeprost do 10° bywa fizjologiczny)' },
  { k: 'Pr', g: 'Przedramię', n: 'Odwrót ⟷ nawrót', neg: 'odwrót (supinacja)', pos: 'nawrót (pronacja)', min: -90, max: 90, nmin: -80, nmax: 80, norm: 'supinacja 80–90°, pronacja 80–90° (0° = kciuk do góry)' },
  { k: 'wFE', g: 'Nadgarstek', n: 'Wyprost ⟷ zgięcie dłoniowe', neg: 'wyprost (grzbietowo)', pos: 'zgięcie dłoniowe', min: -70, max: 80, nmin: -60, nmax: 60, norm: 'zgięcie dłoniowe 60–80°, grzbietowe (wyprost) 60–70°' },
  { k: 'wDev', g: 'Nadgarstek', n: 'Odchylenie promieniowe ⟷ łokciowe', neg: 'promieniowe', pos: 'łokciowe', min: -20, max: 30, nmin: -20, nmax: 30, norm: 'promieniowe 20°, łokciowe 30°' },
  { k: 'hF', g: 'Staw biodrowy', n: 'Zgięcie ⟷ wyprost', neg: 'wyprost', pos: 'zgięcie', min: -30, max: 130, nmin: -20, nmax: 120, norm: 'zgięcie 120–130° (przy wyprostowanym kolanie ok. 90° — ogranicza je napięcie tylnej grupy uda), wyprost 20–30°' },
  { k: 'hA', g: 'Staw biodrowy', n: 'Odwodzenie ⟷ przywodzenie', neg: 'przywodzenie', pos: 'odwodzenie', min: -35, max: 50, nmin: -30, nmax: 45, norm: 'odwodzenie 45–50°, przywodzenie 30–35°' },
  { k: 'hR', g: 'Staw biodrowy', n: 'Rotacja wewn. ⟷ zewn.', neg: 'zewnętrzna', pos: 'wewnętrzna', min: -60, max: 50, nmin: -45, nmax: 45, norm: 'rotacja wewnętrzna 40–50°, zewnętrzna 45–60°' },
  { k: 'kF', g: 'Kolano', n: 'Zgięcie kolana', neg: 'przeprost', pos: 'zgięcie', min: -5, max: 150, nmin: 0, nmax: 140, norm: 'zgięcie 135–150°, wyprost 0° (przeprost do ok. 5°)' },
  { k: 'aF', g: 'Kostka i stopa', n: 'Zgięcie grzbietowe ⟷ podeszwowe', neg: 'zgięcie podeszwowe', pos: 'zgięcie grzbietowe', min: -55, max: 30, nmin: -50, nmax: 20, norm: 'grzbietowe 20–30° (przy zgiętym kolanie więcej), podeszwowe 50–55°' },
  { k: 'aI', g: 'Kostka i stopa', n: 'Inwersja ⟷ ewersja', neg: 'ewersja', pos: 'inwersja', min: -20, max: 40, nmin: -15, nmax: 35, norm: 'inwersja 30–40° (podeszwa do środka), ewersja 15–20°' },
];
export const REST = { gElev: 0, gProt: 0, F: 0, A: 0, R: 0, E: 0, Pr: -90, wFE: 0, wDev: 0, hF: 0, hA: 0, hR: 0, kF: 0, aF: 0, aI: 0 };
const COUPLING = 0.30; // naturalny skręt zewnętrzny ramienia przy odwodzeniu (paradoks Codmana) — dodawany do suwaka R automatycznie
// rotacja „naturalna” dla danego uniesienia (suwak R pokazuje rzeczywisty skręt kości ramiennej względem pozycji neutralnej w danej płaszczyźnie)
export function natR(F, A) { const e = Math.hypot(F, A); if (e < 1e-9) return 0; const p = Math.atan2(F, A); return -COUPLING * Math.max(0, Math.cos(p)) * e; }
// zakresy zależne od pozycji (maksymalny zdrowy zakres): rotacja zależy od uniesienia ramienia, przywiedzenie od zgięcia (ramię przed tułowiem)
export function limits(v) {
  const e = Math.hypot(v.F, v.A), s = Math.sin(Math.min(e, 90) * D2R), t = e > 90 ? (e - 90) / 90 : 0;
  const er = e <= 90 ? 90 + 10 * s : 100 - 10 * t, ir = e <= 90 ? 70 + 20 * s : 90 - 30 * t;
  const amin = -(ADD0 + (50 - ADD0) * Math.min(1, Math.max(0, v.F) / 45));
  const hmax = 90 + 40 * Math.min(1, Math.max(0, v.kF || 0) / 70); // zgięcie biodra z wyprostowanym kolanem ograniczają ścięgna uda
  return { R: [-er, ir], A: [amin, 180], hF: [-30, hmax] };
}
const ADD0 = 12; // przywiedzenie przy ramieniu opuszczonym (dalej ramię wchodziłoby w tułów)

export function createPose({ onPose, base = '' }) {
  const st = { ready: false, J: null, segs: [], boneSeg: new Map(), vals: { ...REST }, rhythm: true, queue: [], rigid: [], skinned: [], meta: {}, bins: {}, cols: {}, sdf: [], sdfMeta: null, sdfP: null, mode: 'delta', alpha: 0.4, wrap: true, dlts: {}, lazy: [], lazyN: 0, dirty: false, M: null, anim: null };
  const NSEG = 12, QR = new Float32Array(NSEG * 4), QD = new Float32Array(NSEG * 4), MA = new Float32Array(NSEG * 12), INV = [], ROT = [];
  for (let i = 0; i < NSEG; i++) { INV.push(new Float32Array(12)); ROT.push(new Float32Array(9)); }
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
    const L = limits(o); o.A = clamp(o.A, L.A[0], L.A[1]); o.R = clamp(o.R, L.R[0], L.R[1]); o.hF = clamp(o.hF, L.hF[0], L.hF[1]);
    return o;
  }
  function compute(v) {
    const J = st.J, M = Array.from({ length: NSEG }, () => new THREE.Matrix4());
    const gh = V(J.gh), el = V(J.el), sc = J.sc, ac = J.ac;
    const vd = el.clone().sub(gh).normalize(), u = vd.clone().negate();
    const l = new THREE.Vector3(-1, 0, 0); l.addScaledVector(u, -l.dot(u)).normalize();
    const a = new THREE.Vector3().crossVectors(u, l);
    const e = Math.hypot(v.F, v.A), p = e < 1e-9 ? 0 : Math.atan2(v.F, v.A);
    const h = l.clone().multiplyScalar(Math.cos(p)).addScaledVector(a, Math.sin(p));
    const k = new THREE.Vector3().crossVectors(vd, h); if (k.lengthSq() < 1e-12) k.copy(a); k.normalize();
    const Qs = new THREE.Quaternion().setFromAxisAngle(k, e * D2R);
    const tw = v.R;
    const Qt = new THREE.Quaternion().setFromAxisAngle(u, tw * D2R);
    const Qh = Qs.clone().multiply(Qt); // kwaternion ciągły względem parametrów (bez zmiany półkuli) — potrzebny do mieszania > 180°
    const Rh = new THREE.Matrix4().makeRotationFromQuaternion(Qh);
    const rh = st.rhythm ? e : 0;
    const qa = (ax, deg) => new THREE.Quaternion().setFromAxisAngle(V(ax).normalize(), deg * D2R);
    const Mcl = rotAbout(sc, J.clav_elev, v.gElev + 0.12 * rh).multiply(rotAbout(sc, J.clav_retr, 0.08 * rh - v.gProt));
    const Qcl = qa(J.clav_elev, v.gElev + 0.12 * rh).multiply(qa(J.clav_retr, 0.08 * rh - v.gProt));
    const Msc = Mcl.clone().multiply(rotAbout(ac, J.scap_up, 0.22 * rh));
    const Qsc = Qcl.clone().multiply(qa(J.scap_up, 0.22 * rh));
    const ghp = gh.clone().applyMatrix4(Msc);
    const Mh = new THREE.Matrix4().makeTranslation(ghp.x, ghp.y, ghp.z).multiply(Rh).multiply(new THREE.Matrix4().makeTranslation(-gh.x, -gh.y, -gh.z));
    const Qel = qa(J.el_axis, v.E), Qpr = qa(J.pr_axis, v.Pr + 90);
    const Mu = Mh.clone().multiply(rotAbout(J.el, J.el_axis, v.E)); const Qu = Qh.clone().multiply(Qel);
    const Mr = Mu.clone().multiply(rotAbout(J.pr_p, J.pr_axis, v.Pr + 90)); const Qr = Qu.clone().multiply(Qpr);
    const Mw = Mr.clone().multiply(rotAbout(J.wr, J.wr_dev, v.wDev)).multiply(rotAbout(J.wr, J.wr_fe, v.wFE));
    const Qw = Qr.clone().multiply(qa(J.wr_dev, v.wDev)).multiply(qa(J.wr_fe, v.wFE));
    M[1] = Mcl; M[2] = Msc; M[3] = Mh; M[4] = Mu; M[5] = Mr; M[6] = Mw;
    // pomocnicze segmenty skrętu przedramienia: 1/3 i 2/3 nawrócenia (tkanki skręcają się wzdłuż przedramienia)
    M[7] = Mu.clone().multiply(rotAbout(J.pr_p, J.pr_axis, (v.Pr + 90) / 3)); M[8] = Mu.clone().multiply(rotAbout(J.pr_p, J.pr_axis, (v.Pr + 90) * 2 / 3));
    // kończyna dolna: biodro (obrót wokół jednego punktu: rotacja → odwodzenie → zgięcie), kolano, kostka + staw podskokowy
    const Mfe = rotAbout(J.hip, J.hip_f, v.hF).multiply(rotAbout(J.hip, J.hip_a, v.hA)).multiply(rotAbout(J.hip, J.hip_r, v.hR));
    const Qfe = qa(J.hip_f, v.hF).multiply(qa(J.hip_a, v.hA)).multiply(qa(J.hip_r, v.hR));
    const Mti = Mfe.clone().multiply(rotAbout(J.knee, J.knee_f, v.kF)), Qti = Qfe.clone().multiply(qa(J.knee_f, v.kF));
    const Mfo = Mti.clone().multiply(rotAbout(J.ank, J.ank_f, v.aF)).multiply(rotAbout(J.stj, J.stj_axis, v.aI)), Qfo = Qti.clone().multiply(qa(J.ank_f, v.aF)).multiply(qa(J.stj_axis, v.aI));
    M[9] = Mfe; M[10] = Mti; M[11] = Mfo;
    M.q = [new THREE.Quaternion(), Qcl, Qsc, Qh, Qu, Qr, Qw, Qu.clone().multiply(qa(J.pr_axis, (v.Pr + 90) / 3)), Qu.clone().multiply(qa(J.pr_axis, (v.Pr + 90) * 2 / 3)), Qfe, Qti, Qfo];
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
  const fetchBin = (name) => fetch(`${base}${name}`).then((r) => { if (!r.ok) throw new Error(name + ' ' + r.status); return r.arrayBuffer(); });
  function loadBin(key) {
    if (!st.bins[key]) st.bins[key] = fetchBin(`skin_${key}.bin`).then((b) => new Uint8Array(b)).catch((e) => { console.warn('skin', e); return null; });
    return st.bins[key];
  }
  function loadCol(key) {
    if (!st.cols[key]) st.cols[key] = fetchBin(`col_${key}.bin`).then((b) => new Int8Array(b)).catch((e) => { console.warn('col', e); return null; });
    return st.cols[key];
  }
  function loadDlt(key) {
    if (!st.dlts[key]) st.dlts[key] = fetchBin(`dlt_${key}.bin`).then((b) => { const i = new Int16Array(b), f = new Float32Array(i.length); for (let k = 0; k < i.length; k++) f[k] = i[k] * 1e-4; return f; }).catch((e) => { console.warn('dlt', e); return null; });
    return st.dlts[key];
  }
  function loadSdf() { // pola odległości kości (≈4 MB) — doczytywane przy pierwszym ruchu
    if (st.sdfP || !st.sdfMeta) return st.sdfP;
    st.sdfP = fetchBin('pose_sdf.bin').then((b) => {
      const all = new Int16Array(b);
      for (const [sg, m] of Object.entries(st.sdfMeta)) st.sdf[+sg] = { o: m.o, h: m.h, n: m.n, d: all.subarray(m.off, m.off + m.n[0] * m.n[1] * m.n[2]) };
      for (const q of st.skinned) q.stale = true; if (!isRest()) { st.dirty = true; }
    }).catch((e) => { console.warn('sdf', e); });
    return st.sdfP;
  }
  function skinned(key, name, objs) { // objs[0] i kopie współdzielą geometrię; dane (wagi, delty, kolizje) doczytywane dopiero przy pierwszym ruchu
    const rec = { key, name, objs, on: false }; st.lazy.push(rec); st.lazyN++;
    if (!st.ready) st.queue.push(() => { if (!isRest()) activate(rec); }); else if (!isRest()) activate(rec);
  }
  function activateAll() { if (!st.lazyN) return; for (const r of st.lazy) if (!r.on) activate(r); }
  function activate(rec) {
    if (rec.on || !st.ready) return; rec.on = true; st.lazyN--; const { key, name, objs } = rec;
    const go = async () => {
      const ent = st.meta[key] && st.meta[key].get(name); if (!ent) return;
      const bin = await loadBin(key); if (!bin) return; const col = await loadCol(key), dl = await loadDlt(key);
      const geom = objs[0].geometry, pa = geom.attributes.position; if (!pa || pa.count !== ent.cnt) { console.warn('skin: niezgodna liczba wierzchołków', name, pa && pa.count, ent.cnt); return; }
      objs[0].updateMatrix(); const N0 = objs[0].matrix.clone(), N0i = N0.clone().invert(); const cnt = ent.cnt;
      const pos0 = Float32Array.from(pa.array), nor0 = geom.attributes.normal ? Float32Array.from(geom.attributes.normal.array) : null;
      const pw0 = new Float32Array(cnt * 3), nw0 = nor0 ? new Float32Array(cnt * 3) : null, v = new THREE.Vector3(), nm = new THREE.Matrix3().getNormalMatrix(N0);
      for (let i = 0; i < cnt; i++) { v.set(pos0[i * 3], pos0[i * 3 + 1], pos0[i * 3 + 2]).applyMatrix4(N0); pw0[i * 3] = v.x; pw0[i * 3 + 1] = v.y; pw0[i * 3 + 2] = v.z; if (nor0) { v.set(nor0[i * 3], nor0[i * 3 + 1], nor0[i * 3 + 2]).applyMatrix3(nm).normalize(); nw0[i * 3] = v.x; nw0[i * 3 + 1] = v.y; nw0[i * 3 + 2] = v.z; } }
      const ident = N0.equals(new THREE.Matrix4());
      const s = { name, objs, geom, W: bin.subarray(ent.off * 8, (ent.off + ent.cnt) * 8), C: col ? col.subarray(ent.off * 8, (ent.off + ent.cnt) * 8) : null, D: dl ? dl.subarray(ent.off * 3, (ent.off + ent.cnt) * 3) : null, cnt, N0, N0i, ident, nm: new THREE.Matrix3().getNormalMatrix(N0i), pos0, nor0, pw0, nw0, Pw: new Float32Array(cnt * 3), Nw: nor0 ? new Float32Array(cnt * 3) : null, stale: false };
      st.skinned.push(s);
      if (!isRest()) { s.stale = true; sync(); }
    };
    go();
  }
  /* przygotowanie klatki: kwaternion + translacja każdego segmentu, macierze odwrotne do kolizji */
  function prepFrame(M) {
    const q = M.q || [];
    for (let i = 0; i < NSEG; i++) {
      const e = M[i].elements; segDQ(QR, QD, i, q[i] || { x: 0, y: 0, z: 0, w: 1 }, [e[12], e[13], e[14]]);
      const o = i * 12; for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) MA[o + c * 3 + r] = e[c * 4 + r]; MA[o + 9] = e[12]; MA[o + 10] = e[13]; MA[o + 11] = e[14];
      const R = ROT[i]; for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) R[c * 3 + r] = e[c * 4 + r];
      const iv = M[i].clone().invert().elements, V = INV[i]; for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) V[c * 3 + r] = iv[c * 4 + r]; V[9] = iv[12]; V[10] = iv[13]; V[11] = iv[14];
    }
  }
  function skinOne(s, M) {
    const g = s.geom, pos = g.attributes.position.array, nor = g.attributes.normal ? g.attributes.normal.array : null;
    if (isRest()) { pos.set(s.pos0); if (nor && s.nor0) nor.set(s.nor0); }
    else {
      if (M.q && M !== st.fM) { prepFrame(M); st.fM = M; }
      if (st.mode === 'delta' && s.D) skinDelta(s.cnt, s.W, s.pw0, s.D, s.nw0, MA, QR, s.Pw, s.Nw);
      else if (st.alpha <= 0) skinLBS(s.cnt, s.W, s.pw0, s.nw0, MA, s.Pw, s.Nw);
      else if (st.alpha >= 1) skinDQ(s.cnt, s.W, s.pw0, s.nw0, QR, QD, s.Pw, s.Nw, 0);
      else { // domieszka: (1−α)·LBS + α·DQS
        if (!s.P2) { s.P2 = new Float32Array(s.cnt * 3); s.N2 = s.Nw ? new Float32Array(s.cnt * 3) : null; }
        skinLBS(s.cnt, s.W, s.pw0, s.nw0, MA, s.Pw, s.Nw); skinDQ(s.cnt, s.W, s.pw0, s.nw0, QR, QD, s.P2, s.N2, 0);
        const a = st.alpha, b = 1 - a, P = s.Pw, Q = s.P2, N = s.Nw, N2 = s.N2, n3 = s.cnt * 3;
        for (let i = 0; i < n3; i++) P[i] = b * P[i] + a * Q[i];
        if (N) for (let i = 0; i < n3; i++) N[i] = b * N[i] + a * N2[i];
      }
      if (st.wrap && s.C && st.sdf.length) collide(s.cnt, s.C, st.sdf, INV, ROT, s.Pw, 2);
      const P = s.Pw, N = s.Nw;
      if (s.ident) { pos.set(P); if (nor && N) nor.set(N); }
      else { const e = s.N0i.elements, cnt = s.cnt;
        for (let i = 0; i < cnt; i++) { const i3 = i * 3, x = P[i3], y = P[i3 + 1], z = P[i3 + 2]; pos[i3] = e[0] * x + e[4] * y + e[8] * z + e[12]; pos[i3 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]; pos[i3 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]; }
        if (nor && N) { const m = s.nm.elements; for (let i = 0; i < cnt; i++) { const i3 = i * 3, x = N[i3], y = N[i3 + 1], z = N[i3 + 2]; let a = m[0] * x + m[3] * y + m[6] * z, b = m[1] * x + m[4] * y + m[7] * z, c = m[2] * x + m[5] * y + m[8] * z; const l = Math.hypot(a, b, c) || 1; nor[i3] = a / l; nor[i3 + 1] = b / l; nor[i3 + 2] = c / l; } } }
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
  function withNat(prev, patch) { // ruch F/A bez jawnego R: ramię skręca się naturalnie (zewn. przy odwodzeniu)
    const q = { ...patch }; if (!('R' in q) && ('F' in q || 'A' in q)) { const f = 'F' in q ? q.F : prev.F, a = 'A' in q ? q.A : prev.A; q.R = prev.R + natR(f, a) - natR(prev.F, prev.A); } return q;
  }
  function set(patch) { st.vals = clampVals({ ...st.vals, ...withNat(st.vals, patch) }); mark(); activateAll(); if (st.wrap) loadSdf(); }
  function setMode(a) { st.mode = a === 'delta' ? 'delta' : 'mix'; st.alpha = a === 'lbs' ? 0 : a === 'dqs' ? 1 : a === 'delta' ? st.alpha : +a; for (const q of st.skinned) q.stale = true; mark(); }
  function setWrap(on) { st.wrap = !!on; for (const q of st.skinned) q.stale = true; mark(); if (on) loadSdf(); }
  function reset() { st.anim = null; st.vals = { ...REST }; mark(); }
  function setRhythm(on) { st.rhythm = !!on; mark(); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function animateTo(target, ms = 800, done) {
    activateAll(); if (st.wrap) loadSdf();
    const from = { ...st.vals }; let tg = { ...target };
    if (!('R' in tg)) { const f = 'F' in tg ? tg.F : from.F, a = 'A' in tg ? tg.A : from.A; tg.R = natR(f, a); } // bez jawnego R: skręt naturalny
    const to = clampVals({ ...from, ...tg }), t0 = performance.now();
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
    st.J = j.joint; st.segs = j.segs; st.sdfMeta = j.sdf || null; for (const [b, s] of Object.entries(j.bone)) st.boneSeg.set(b, s);
    for (const [key, arr] of Object.entries(j.skin)) { const m = new Map(); for (const e of arr) m.set(e.n, e); st.meta[key] = m; }
    st.ready = true; st.M = compute(st.vals);
    const q = st.queue; st.queue = []; for (const f of q) f();
  }).catch((e) => { console.warn('pose.json', e); });
  const settled = () => Promise.all([...Object.values(st.bins), ...Object.values(st.cols), ...Object.values(st.dlts), st.sdfP].filter(Boolean)).then(() => new Promise((r) => setTimeout(r, 120))); // dane skinningu doczytane
  return { st, ready, settled, rigid, skinned, sync, flush, set, reset, setMode, setWrap, loadSdf, setRhythm, animateTo, tick, xp, segOfBone, get vals() { return st.vals; }, get rhythm() { return st.rhythm; }, isRest, get active() { return !!st.anim; }, limits: () => limits(st.vals), segIndex: (n) => st.segs.indexOf(n) };
}
