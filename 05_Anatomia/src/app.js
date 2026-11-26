import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { TRYB, ROLA } from './analysis.js';
import { createPose, DOF, REST, natR, limits } from './pose.js';
import { TESTS, TEST_ZONES, TEST_INTRO, TEST_DISCLAIMER } from './tests.js';
import { AREAS, TRIG, SYMPTOM_EXAMPLES, POS_EXAMPLES, parseText, run as runSym } from './symptoms.js';

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const DATA = JSON.parse(document.getElementById('data').textContent);
const VERSION = DATA.version;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').toLowerCase();

/* ---------- dane ---------- */
const REGION_NAME = Object.fromEntries(DATA.regions);
const REG_ORDER = ['bark', 'ramie', 'przedramie', 'dlon', 'glowa', 'tulow', 'podudzie'];
const G = DATA.groups; // key -> grupa mięśniowa
const MUS = new Map(DATA.muscles.map((m) => [m.id, m]));
const BON = new Map(DATA.bones.map((b) => [b.id, b]));
const LMS = new Map(DATA.lms.map((l) => [l.id, l]));
const JN = DATA.joints, JMAP = new Map(JN.map((j) => [j.id, j])), SHP = DATA.shapes, MIDX = DATA.mid;
const MIDB = new Set(DATA.bones.filter((b) => b.kind === 'axial' || /sternum|Xiphoid|^Vertebra|^Sacrum|^Coccyx/.test(b.en)).map((b) => b.id));
const isG = (k) => Object.prototype.hasOwnProperty.call(DATA.groups, k);
const ANT = new Map(), MJ = new Map(); // antagoniści (klucz grupy -> Set) i stawy, w których mięsień działa
const addTo = (m, k, v) => { if (!m.has(k)) m.set(k, v instanceof Set ? new Set() : []); };
for (const j of JN) for (const pr of j.pairs) {
  const A = pr[1].filter(isG), B = pr[3].filter(isG);
  for (const [L, ruch] of [[A, pr[0]], [B, pr[2]]]) for (const k of L) { if (!MJ.has(k)) MJ.set(k, []); if (!MJ.get(k).some((x) => x.j === j.id && x.ruch === ruch)) MJ.get(k).push({ j: j.id, ruch }); }
  for (const a of A) for (const b of B) if (a !== b) { if (!ANT.has(a)) ANT.set(a, new Set()); if (!ANT.has(b)) ANT.set(b, new Set()); ANT.get(a).add(b); ANT.get(b).add(a); }
}
const capOwn = new Map(); for (const j of JN) for (const c of j.caps) { if (!capOwn.has(c)) capOwn.set(c, []); capOwn.get(c).push(j); }
const OTHER = new Set(['extret', 'flexret', 'palmapo']);
// mięśnie uda (region „tułów”), które pokazujemy też w widoku „Podudzie i stopa” (kolano)
const LEGX = new Set(['rectfem', 'vastlat', 'vastmed', 'vastint', 'sartorius', 'pectineus', 'addlong', 'addbrev', 'addmag', 'gracilis', 'bicfem', 'semitend', 'semimem', 'tfl']);
const LEGXB = new Set(['Q001']); // udowa
for (const [k, g] of Object.entries(G)) { g.key = k; g.parts = DATA.muscles.filter((m) => m.grp === k); g.lms = []; }
const lmsByBone = new Map();
for (const l of DATA.lms) { if (!lmsByBone.has(l.bone)) lmsByBone.set(l.bone, []); lmsByBone.get(l.bone).push(l); }
const patchesByGrp = new Map(); const patchesByBone = new Map();
for (const p of DATA.patches) {
  if (!patchesByGrp.has(p.grp)) patchesByGrp.set(p.grp, []); patchesByGrp.get(p.grp).push(p);
  if (!patchesByBone.has(p.bone)) patchesByBone.set(p.bone, []); patchesByBone.get(p.bone).push(p);
}

/* ---------- scena ---------- */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.42;
const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 30);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.09; controls.minDistance = 0.025; controls.maxDistance = 4;
controls.screenSpacePanning = true; controls.rotateSpeed = 0.9; controls.zoomSpeed = 1.0; controls.autoRotateSpeed = 1.6;
const key = new THREE.DirectionalLight(0xfff3e6, 1.05); key.position.set(0.6, 1.2, 1.4); scene.add(key);
const rim = new THREE.DirectionalLight(0xbcd2ff, 0.55); rim.position.set(-1.2, 0.4, -1.0); scene.add(rim);
scene.add(new THREE.HemisphereLight(0xffffff, 0x2a2e3a, 0.22));
const headlight = new THREE.DirectionalLight(0xffffff, 0.22); scene.add(headlight, headlight.target);

let needsRender = true; const dirty = () => { needsRender = true; };
controls.addEventListener('change', dirty);

/* ---------- materiały ---------- */
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const musMat = (g) => { // każdy mięsień ma własny kolor (data.groups[k].col — rozłożone tak, by sąsiednie mięśnie się różniły)
  const col = G[g].col; const h = hash(g);
  const c = col ? new THREE.Color(col) : new THREE.Color().setHSL((h % 360) / 360, 0.6, 0.45);
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0, envMapIntensity: 0.85 });
};
const MAT = {
  bone: new THREE.MeshStandardMaterial({ color: 0xe9e0c9, roughness: 0.68, metalness: 0, envMapIntensity: 0.8 }),
  ctx: new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.8, metalness: 0 }),
  ghost: new THREE.MeshStandardMaterial({ color: 0x9aa3b2, roughness: 0.9, transparent: true, opacity: 0.11, depthWrite: false }),
  ghostBone: new THREE.MeshStandardMaterial({ color: 0xcfd6e6, roughness: 0.9, transparent: true, opacity: 0.16, depthWrite: false }),
  cap: new THREE.MeshStandardMaterial({ color: 0xa9c7ff, roughness: 0.6, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
  hiBone: new THREE.MeshStandardMaterial({ color: 0xffe08a, roughness: 0.5, emissive: 0x3a2a00 }),
  org: new THREE.MeshBasicMaterial({ color: 0x2f8cff, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }),
  ins: new THREE.MeshBasicMaterial({ color: 0xffa21f, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }),
};
const tintCache = new Map(), fadeCache = new Map();
const FADE = 0.6; // po najechaniu na mięsień reszta modelu traci 40% krycia
function tintOf(k, em, opq) { // własny kolor mięśnia + poświata (em) i ew. półprzezroczystość (opq)
  const key = k + '|' + em + '|' + opq; let m = tintCache.get(key);
  if (!m) { const base = grpMat[k]; m = base.clone(); m.emissive = base.color.clone().multiplyScalar(em); m.roughness = 0.42; m.userData = { base, opq }; tintCache.set(key, m); }
  const o = m.userData.base.opacity * m.userData.opq; m.opacity = o; m.transparent = o < 1; m.depthWrite = o >= 0.65; return m;
}
function fadeOf(mat) {
  let f = fadeCache.get(mat); if (!f) { f = mat.clone(); f.transparent = true; f.depthWrite = false; fadeCache.set(mat, f); }
  f.opacity = (mat.opacity ?? 1) * FADE; return f;
}
const capMats = new Map(); const capMatFor = (j) => { if (!capMats.has(j.shape)) capMats.set(j.shape, new THREE.MeshStandardMaterial({ color: SHP[j.shape].c, roughness: 0.5, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, emissive: new THREE.Color(SHP[j.shape].c).multiplyScalar(0.25) })); return capMats.get(j.shape); };
const grpMat = {};
for (const k of Object.keys(G)) {
  grpMat[k] = musMat(k);
  if (OTHER.has(k)) { grpMat[k].color.set(0xd9c39a); grpMat[k].roughness = 0.6; grpMat[k].side = THREE.DoubleSide; }
}

/* ---------- stan ---------- */
const LAYERS0 = () => ({ bones: true, muscles: true, ctx: false, other: false, att: false, joints: false, cap: false, skull: false, lig: false, nerv: false, vess: false });
const S = {
  region: 'all', tab: 'mus', layers: LAYERS0(), side: 'r',
  hidden: new Set(), ghosted: new Set(), focused: new Set(), hiddenB: new Set(), undo: [], hov: null, sel: null, // {t:'grp'|'part'|'bone'|'lm'|'joint', id, side?}
  multiMode: false, multi: new Map(), // klucz grupy -> indeks koloru
  ghostBg: true, showPins: false, muscleOpacity: 1, axial: false, trunk: false, leg: false, ana: null,
};
try { const sv = localStorage.getItem('anatomia.side'); if (sv === 'r' || sv === 'l' || sv === 'b') S.side = sv; } catch (e) {}
const mkSide = (k) => ({ k, mus: new Map(), bone: new Map(), patch: new Map(), cap: new Map(), mk: new Map(), str: new Map() });
const SIDE = { r: mkSide('r'), l: mkSide('l') };
const objs = { mus: SIDE.r.mus, bone: SIDE.r.bone, patch: SIDE.r.patch, str: SIDE.r.str, lm: new Map() };
const root = new THREE.Group(), rootL = new THREE.Group(); scene.add(root, rootL);
rootL.scale.x = -1; rootL.position.x = 2 * MIDX; // lewa strona = lustro prawej względem płaszczyzny środkowej
const pickables = []; const markerMeshes = [];
const STR = new Map((DATA.structs || []).map((x) => [x.id, x]));
const STRK = { lig: 'lig', nerv: 'nerv', art: 'vess', ven: 'vess' }; // typ -> plik / warstwa
const STRC = { lig: 0xbfe6ff, nerv: 0xffd23f, art: 0xff3b3b, ven: 0x3b82f6 };
const STRCSS = { lig: '#bfe6ff', nerv: '#ffd23f', art: '#ff3b3b', ven: '#3b82f6' };
const STRTYP = { lig: 'Więzadło', nerv: 'Nerw', art: 'Tętnica', ven: 'Żyła' };
const STRMAT = {}, STRHI = {};
for (const k of Object.keys(STRC)) {
  STRMAT[k] = new THREE.MeshStandardMaterial({ color: STRC[k], roughness: 0.55, metalness: 0.0, side: THREE.DoubleSide });
  STRHI[k] = new THREE.MeshStandardMaterial({ color: STRC[k], emissive: STRC[k], emissiveIntensity: 0.55, roughness: 0.4, metalness: 0.0, side: THREE.DoubleSide });
}
const defSide = () => (S.side === 'l' ? 'l' : 'r');
const O = (kind, id, side) => (SIDE[side] || SIDE[defSide()])[kind].get(id);
const activeSides = () => (S.side === 'b' ? [SIDE.r, SIDE.l] : [SIDE[defSide()]]);
const lmPos = (id, side) => { let p = objs.lm.get(id); if (!p) return null; const l = LMS.get(id); if (l && !POSE.isRest()) p = POSE.xp(POSE.segOfBone(l.bone), p); return (side || defSide()) === 'l' ? new THREE.Vector3(2 * MIDX - p.x, p.y, p.z) : p; };
const toastEl = $('#toast'); let toastT = 0;
const toast = (t, act) => { // act: { label, fn } — przycisk w komunikacie (np. „Cofnij”)
  clearTimeout(toastT); toastEl.textContent = t;
  if (t && act) { const b = document.createElement('button'); b.textContent = act.label; b.addEventListener('click', () => { act.fn(); toast(''); }); toastEl.append(' ', b); toastT = setTimeout(() => toast(''), 7000); }
  else if (t) toastT = setTimeout(() => toast(''), /^Wczytywanie/.test(t) ? 30000 : 3500); // każdy komunikat sam znika (wcześniej zostawał na dole i zasłaniał pasek paneli)
  toastEl.classList.toggle('show', !!t);
};

/* ---------- poza: silnik ruchu stawów (pose.js) ---------- */
const JSEG = { J_scj: 'thx', J_acj: 'scap', J_ghj: 'scap', J_lok: 'uln', J_hu: 'uln', J_hr: 'rad', J_pru: 'uln', J_dru: 'uln' }; // reszta stawów dłoni → 'hand'
const jointSegIdx = (jid) => { const j = JMAP.get(jid); const n = JSEG[jid] || (j && j.reg === 'dlon' ? 'hand' : 'thx'); return POSE.segIndex(n); };
const markerRest = new Map();
function poseChanged() { updateMarkers(); updatePins(); dirty(); syncPoseUI(); }
const POSE = createPose({ onPose: poseChanged });
function updateMarkers() {
  for (const m of markerMeshes) { const r = markerRest.get(m); if (!r) continue; const p = POSE.isRest() ? r.p : POSE.xp(jointSegIdx(r.j), r.p); m.position.set(m.userData.side === 'l' ? 2 * MIDX - p.x : p.x, p.y, p.z); }
}

/* ---------- ładowanie ---------- */
const loadEl = $('#loading'); const loadTxt = $('#loadtxt'); const loadBar = $('#loadbar');
const progress = { a: 0, b: 0, c: 0 };
const setProg = () => { const p = (progress.a + progress.b + progress.c) / 3; loadBar.style.width = (p * 100).toFixed(0) + '%'; };
function loadGLB(url, k) {
  return new Promise((res, rej) => new GLTFLoader().load(url, (g) => res(g.scene), (e) => { if (e.total && k in progress) { progress[k] = e.loaded / e.total; setProg(); } }, rej));
}
const SPH = new THREE.SphereGeometry(1, 20, 14);
const ready = Promise.all([loadGLB('muscles.glb', 'a'), loadGLB('bones.glb', 'b'), loadGLB('joints.glb', 'c')]).then(([mus, bones, jts]) => {
  mus.updateMatrixWorld(true); bones.updateMatrixWorld(true); jts.updateMatrixWorld(true);
  const box = new THREE.Box3();
  mus.traverse((o) => {
    if (!o.isMesh) return;
    const m = MUS.get(o.name); if (!m) return;
    o.userData = { kind: 'mus', id: m.id, grp: m.grp, side: 'r' };
    o.material = grpMat[m.grp]; o.geometry.computeBoundsTree(); if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    objs.mus.set(m.id, o); box.expandByObject(o);
  });
  bones.traverse((o) => {
    if (!o.isMesh) return;
    const b = BON.get(o.name);
    if (b) { o.userData = { kind: 'bone', id: b.id, side: 'r' }; o.material = b.kind === 'ctx' ? MAT.ctx : MAT.bone; o.geometry.computeBoundsTree(); objs.bone.set(b.id, o); box.expandByObject(o); }
    else if (/^P\d+$/.test(o.name)) { o.userData = { kind: 'patch', id: o.name, side: 'r' }; o.geometry.computeBoundsTree(); objs.patch.set(o.name, o); }
  });
  const midCap = new Set(JN.filter((j) => j.mid).flatMap((j) => j.caps));
  jts.traverse((o) => { if (o.isMesh && /^C\d+$/.test(o.name)) { o.userData = { kind: 'cap', id: o.name, side: 'r' }; o.material = MAT.cap; o.visible = false; SIDE.r.cap.set(o.name, o); } });
  for (const l of DATA.lms) objs.lm.set(l.id, new THREE.Vector3(l.p[0], l.p[1], l.p[2]));
  for (const o of [...objs.mus.values(), ...objs.bone.values(), ...objs.patch.values(), ...SIDE.r.cap.values()]) root.attach(o);
  for (const o of objs.patch.values()) o.visible = false;
  // lustrzana lewa strona (tylko elementy parzyste; struktury środkowe wspólne)
  const L = SIDE.l;
  const cl = (o) => { const c = new THREE.Mesh(o.geometry, o.material); c.position.copy(o.position); c.quaternion.copy(o.quaternion); c.scale.copy(o.scale); c.userData = { ...o.userData, side: 'l' }; c.visible = o.visible; rootL.add(c); return c; };
  for (const [id, o] of objs.mus) L.mus.set(id, cl(o));
  for (const [id, o] of objs.bone) L.bone.set(id, MIDB.has(id) ? o : cl(o));
  for (const [id, o] of objs.patch) L.patch.set(id, cl(o));
  for (const [id, o] of SIDE.r.cap) if (!midCap.has(id)) L.cap.set(id, cl(o));
  // znaczniki stawów (kolor wg typu stawu)
  for (const j of JN) {
    const mat = new THREE.MeshBasicMaterial({ color: SHP[j.shape].c, transparent: true, opacity: 0.45, depthTest: false, depthWrite: false }); j.mat = mat;
    const mk = (m, side) => { const x = side === 'l' ? 2 * MIDX - m.p[0] : m.p[0]; const s = new THREE.Mesh(SPH, mat); s.position.set(x, m.p[1], m.p[2]); s.scale.setScalar(m.r * 0.6); s.renderOrder = 6; s.visible = false; s.userData = { kind: 'joint', id: j.id, side }; scene.add(s); markerMeshes.push(s); markerRest.set(s, { p: new THREE.Vector3(m.p[0], m.p[1], m.p[2]), j: j.id }); return s; };
    SIDE.r.mk.set(j.id, j.marks.map((m) => mk(m, 'r')));
    if (!j.mid) L.mk.set(j.id, j.marks.map((m) => mk(m, 'l')));
  }
  for (const [id, o] of objs.mus) POSE.skinned('muscles', id, [o, L.mus.get(id)]);
  for (const [id, o] of objs.bone) { const c = L.bone.get(id); POSE.rigid(c && c !== o ? [o, c] : [o], () => POSE.segOfBone(id)); }
  for (const [id, o] of objs.patch) POSE.rigid([o, L.patch.get(id)], () => POSE.segOfBone(patchBone(id)));
  for (const [id, o] of SIDE.r.cap) { const c = L.cap.get(id); POSE.rigid(c ? [o, c] : [o], () => jointSegIdx(capOwn.get(id)[0].id)); }
  S.box = box;
  for (const SDx of [SIDE.r, SIDE.l]) for (const o of [...SDx.mus.values(), ...SDx.bone.values()]) if (!pickables.includes(o)) pickables.push(o);
  loadEl.classList.add('hide'); setTimeout(() => loadEl.remove(), 500);
}).catch((e) => { loadTxt.textContent = 'Nie udało się wczytać modelu 3D: ' + e.message; console.error(e); });

let axialP = null; // czaszka i kręgi szyjne — wczytywane dopiero na żądanie (1,8 MB)
function ensureAxial() {
  if (S.axial) return Promise.resolve(); if (axialP) return axialP;
  toast('Wczytywanie głowy i szyi (czaszka, kręgi, mięśnie)…');
  axialP = ready.then(() => Promise.all([loadGLB('axial.glb', 'x'), loadGLB('headmus.glb', 'x')])).then(([g, hm]) => {
    hm.updateMatrixWorld(true);
    const hl = []; hm.traverse((o) => { if (o.isMesh && MUS.has(o.name)) hl.push(o); });
    const cl2 = (o) => { const c = new THREE.Mesh(o.geometry, o.material); c.position.copy(o.position); c.quaternion.copy(o.quaternion); c.scale.copy(o.scale); c.userData = { ...o.userData, side: 'l' }; c.visible = false; rootL.add(c); return c; };
    for (const o of hl) { const m = MUS.get(o.name); o.userData = { kind: 'mus', id: m.id, grp: m.grp, side: 'r' }; o.material = grpMat[m.grp]; o.geometry.computeBoundsTree(); o.visible = false; root.attach(o); objs.mus.set(m.id, o); SIDE.r.mus.set(m.id, o); const c = cl2(o); SIDE.l.mus.set(m.id, c); pickables.push(o, c); }
    g.updateMatrixWorld(true); const list = [];
    g.traverse((o) => { if (o.isMesh && BON.has(o.name)) list.push(o); });
    for (const o of list) { const b = BON.get(o.name); o.userData = { kind: 'bone', id: b.id, side: 'r' }; o.material = MAT.bone; o.geometry.computeBoundsTree(); root.attach(o); objs.bone.set(b.id, o); SIDE.l.bone.set(b.id, o); pickables.push(o); }
    S.axial = true; toast(''); apply();
  }).catch((e) => { toast('Nie udało się wczytać czaszki: ' + e.message); axialP = null; });
  return axialP;
}
const needAxial = (sel) => { if (!sel) return false; if (sel.t === 'bone') return BON.get(sel.id)?.kind === 'axial'; if (sel.t === 'joint') { const j = JMAP.get(sel.id); return j.reg === 'glowa' || j.bones.some((b) => BON.get(b)?.kind === 'axial'); } if (sel.t === 'grp' || sel.t === 'part') return G[grpOf(sel)].region === 'glowa'; return false; };

let trunkP = null; // tułów, miednica, udo — wczytywane na żądanie (6 MB)
function ensureTrunk() {
  if (S.trunk) return Promise.resolve(); if (trunkP) return trunkP;
  toast('Wczytywanie tułowia, miednicy i uda (ok. 6 MB)…');
  trunkP = ready.then(() => loadGLB('trunk.glb', 'x')).then((g) => {
    g.updateMatrixWorld(true); const ml = [], bl = [];
    g.traverse((o) => { if (!o.isMesh) return; if (MUS.has(o.name)) ml.push(o); else if (BON.has(o.name)) bl.push(o); });
    const cl2 = (o) => { const c = new THREE.Mesh(o.geometry, o.material); c.position.copy(o.position); c.quaternion.copy(o.quaternion); c.scale.copy(o.scale); c.userData = { ...o.userData, side: 'l' }; c.visible = false; rootL.add(c); return c; };
    for (const o of ml) { const m = MUS.get(o.name); o.userData = { kind: 'mus', id: m.id, grp: m.grp, side: 'r' }; o.material = grpMat[m.grp]; o.geometry.computeBoundsTree(); o.visible = false; root.attach(o); objs.mus.set(m.id, o); const c = cl2(o); SIDE.l.mus.set(m.id, c); pickables.push(o, c); POSE.skinned('trunk', m.id, [o, c]); }
    for (const o of bl) { const b = BON.get(o.name); o.userData = { kind: 'bone', id: b.id, side: 'r' }; o.material = MAT.bone; o.geometry.computeBoundsTree(); o.visible = false; root.attach(o); objs.bone.set(b.id, o); pickables.push(o); if (MIDB.has(b.id)) SIDE.l.bone.set(b.id, o); else { const c = cl2(o); SIDE.l.bone.set(b.id, c); pickables.push(c); } }
    S.trunk = true; toast(''); apply();
  }).catch((e) => { toast('Nie udało się wczytać tułowia: ' + e.message); trunkP = null; });
  return trunkP;
}
const needTrunk = (sel) => { if (!sel) return false; if (sel.t === 'bone') return BON.get(sel.id)?.kind === 'trunk'; if (sel.t === 'joint') return JMAP.get(sel.id).reg === 'tulow'; if (sel.t === 'grp' || sel.t === 'part') return G[grpOf(sel)].region === 'tulow'; return false; };

let legP = null; // podudzie i stopa — wczytywane na żądanie (2 MB); udo i kość udowa pochodzą z pliku tułowia
function ensureLeg() {
  if (S.leg) return Promise.resolve(); if (legP) return legP;
  toast('Wczytywanie podudzia i stopy (ok. 2 MB)…');
  legP = ready.then(() => Promise.all([loadGLB('lower.glb', 'x'), ensureTrunk()])).then(([g]) => {
    g.updateMatrixWorld(true); const ml = [], bl = [];
    g.traverse((o) => { if (!o.isMesh) return; if (MUS.has(o.name)) ml.push(o); else if (BON.has(o.name)) bl.push(o); });
    const cl2 = (o) => { const c = new THREE.Mesh(o.geometry, o.material); c.position.copy(o.position); c.quaternion.copy(o.quaternion); c.scale.copy(o.scale); c.userData = { ...o.userData, side: 'l' }; c.visible = false; rootL.add(c); return c; };
    for (const o of ml) { const m = MUS.get(o.name); o.userData = { kind: 'mus', id: m.id, grp: m.grp, side: 'r' }; o.material = grpMat[m.grp]; o.geometry.computeBoundsTree(); o.visible = false; root.attach(o); objs.mus.set(m.id, o); const c = cl2(o); SIDE.l.mus.set(m.id, c); pickables.push(o, c); }
    for (const o of bl) { const b = BON.get(o.name); o.userData = { kind: 'bone', id: b.id, side: 'r' }; o.material = MAT.bone; o.geometry.computeBoundsTree(); o.visible = false; root.attach(o); objs.bone.set(b.id, o); pickables.push(o); const c = cl2(o); SIDE.l.bone.set(b.id, c); pickables.push(c); }
    S.leg = true; toast(''); apply();
  }).catch((e) => { toast('Nie udało się wczytać podudzia: ' + e.message); legP = null; });
  return legP;
}
const needLeg = (sel) => { if (!sel) return false; if (sel.t === 'bone') return BON.get(sel.id)?.kind === 'leg'; if (sel.t === 'joint') return JMAP.get(sel.id).reg === 'podudzie'; if (sel.t === 'grp' || sel.t === 'part') return G[grpOf(sel)].region === 'podudzie'; return false; };

const structP = {};
function ensureStruct(f) { // f: 'lig' | 'nerv' | 'vess'
  if (structP[f]) return structP[f];
  toast('Wczytywanie: ' + ({ lig: 'więzadła', nerv: 'nerwy', vess: 'naczynia' })[f] + '…');
  structP[f] = ready.then(() => loadGLB(f + '.glb', 'x')).then((g) => {
    g.updateMatrixWorld(true); const list = [];
    g.traverse((o) => { if (o.isMesh && STR.has(o.name)) list.push(o); });
    for (const o of list) {
      const m = STR.get(o.name); o.userData = { kind: 'str', id: m.id, side: 'r' }; o.material = STRMAT[m.t]; o.geometry.computeBoundsTree(); o.visible = false; root.attach(o);
      SIDE.r.str.set(m.id, o); objs.str.set(m.id, o);
      const c = new THREE.Mesh(o.geometry, o.material); c.position.copy(o.position); c.quaternion.copy(o.quaternion); c.scale.copy(o.scale); c.userData = { ...o.userData, side: 'l' }; c.visible = false; rootL.add(c); SIDE.l.str.set(m.id, c);
      pickables.push(o, c); POSE.skinned(f, m.id, [o, c]);
    }
    toast(''); apply();
  }).catch((e) => { toast('Nie udało się wczytać: ' + e.message); structP[f] = null; });
  return structP[f];
}
function useStructLayer(f, on) { S.layers[f] = on; const el = $('#l' + ({ lig: 'Lig', nerv: 'Nerv', vess: 'Vess' })[f]); if (el) el.checked = on; if (on) ensureStruct(f); }

/* ---------- widoczność / materiały ---------- */
const grpRegion = (k) => G[k].region;
const regionOk = (r) => S.region === 'all' || S.region === r;
const jointRegionOk = (j) => regionOk(j.reg) && (j.reg !== 'glowa' || S.layers.skull || S.region === 'glowa') && ((j.reg !== 'tulow' && j.reg !== 'podudzie') || S.region === j.reg);
function curGroups() { // Map: klucz grupy -> indeks koloru
  const m = new Map(S.multi); const s = S.sel;
  if (s && (s.t === 'grp' || s.t === 'part')) { const k = s.t === 'grp' ? s.id : MUS.get(s.id).grp; if (!m.has(k)) m.set(k, 0); }
  for (const k of S.focused) if (!m.has(k)) m.set(k, 0);
  const ac = anaColors(); if (ac) for (const k of ac.keys()) if (!m.has(k)) m.set(k, 0);
  return m;
}
function neededBones(gs) { // kości, na których leżą przyczepy zaznaczonych mięśni
  const out = new Set();
  for (const g of gs) for (const p of patchesByGrp.get(g) || []) out.add(p.bone);
  return out;
}
function apply() {
  if (!S.box) return;
  { const op = S.muscleOpacity; for (const k of Object.keys(grpMat)) { const m = grpMat[k]; if (m.opacity !== op) { m.opacity = op; m.transparent = op < 1; m.depthWrite = op >= 0.65; m.needsUpdate = true; } } }
  const sel = S.sel, gm = curGroups(), gs = new Set(gm.keys()), need = neededBones(gs);
  if (!S.axial) for (const k of gs) if (G[k].region === 'glowa') { ensureAxial(); break; }
  if (!S.trunk) for (const k of gs) if (G[k].region === 'tulow') { ensureTrunk(); break; }
  if (!S.leg) for (const k of gs) if (G[k].region === 'podudzie') { ensureLeg(); break; }
  const AC = anaColors(), AP = anaParts(), anaRegs = S.ana ? new Set(anaAllKeys(S.ana).map((k) => G[k].region)) : null;
  const sj = sel && sel.t === 'joint' ? JMAP.get(sel.id) : null;
  const jb = new Set(sj ? sj.bones : []);
  const bonesOn = S.layers.bones || (sel && (sel.t === 'bone' || sel.t === 'lm')) || !!sj;
  const hasSel = !!sel || gm.size > 0;
  const selBone = sel && sel.t === 'bone' ? sel.id : sel && sel.t === 'lm' ? LMS.get(sel.id).bone : null;
  const partSel = sel && sel.t === 'part' ? sel.id : null;
  const patchOn = new Map(); // id znacznika przyczepu -> rola
  for (const g of gs) for (const p of patchesByGrp.get(g) || []) patchOn.set(p.id, p.role);
  if (selBone) for (const p of patchesByBone.get(selBone) || []) patchOn.set(p.id, p.role);
  if (S.layers.att) for (const p of DATA.patches) if (!patchOn.has(p.id) && regionOk(G[p.grp].region)) patchOn.set(p.id, p.role);
  for (const SD of [SIDE.r, SIDE.l]) {
    const on = S.side === 'b' || S.side === SD.k;
    for (const [id, o] of SD.str) {
      const x = STR.get(id), isSel = !!(sel && sel.t === 'str' && sel.id === id);
      const lay = S.layers[STRK[x.t]], rok = x.reg === 'glowa' ? S.region === 'glowa' : regionOk(x.reg);
      o.visible = on && (isSel || (lay && rok)); o.material = isSel ? STRHI[x.t] : STRMAT[x.t];
    }
  }
  for (const SD of [SIDE.r, SIDE.l]) {
    const on = S.side === 'b' || S.side === SD.k;
    for (const [id, o] of SD.mus) {
      const m = MUS.get(id), g = G[m.grp], k = m.grp;
      let vis = on && S.layers.muscles && !S.hidden.has(k) && (OTHER.has(k) ? S.layers.other : true);
      let ghost = vis && S.ghosted.has(k);
      if (g.region === 'glowa' || g.region === 'tulow' || g.region === 'podudzie') vis = vis && (S.region === g.region || gs.has(k) || (S.region === 'podudzie' && LEGX.has(k)));
      else if (!regionOk(g.region)) { if (S.ghostBg && S.layers.muscles && !OTHER.has(k) && on) { vis = true; ghost = true; } else vis = false; }
      if (anaRegs && !gs.has(k)) { vis = on && S.layers.muscles && !S.hidden.has(k) && !OTHER.has(k) && anaRegs.has(g.region); ghost = vis && S.ghosted.has(k); }
      if (on && gs.has(k)) { vis = true; ghost = false; }
      o.visible = vis;
      let mat = grpMat[k];
      const isSel = gs.has(k) && !(partSel && MUS.get(partSel).grp === k && partSel !== id && !S.multi.has(k));
      if (AC && AC.has(k)) { const v = AC.get(k); mat = AP.get(k) && !AP.get(k).test(m.en) ? MAT.ghost : tintOf(k, v.em, v.op); }
      else if (isSel) mat = tintOf(k, 0.24, 1);
      else if (ghost || (hasSel && vis)) mat = MAT.ghost;
      o.userData.gh = mat === MAT.ghost; o.material = mat; o.renderOrder = mat === MAT.ghost ? 2 : 0;
    }
    for (const [id, o] of SD.bone) {
      const b = BON.get(id), mid = MIDB.has(id); if (SD.k === 'l' && mid) continue;
      const sideOn = mid || on, ctxLayer = b.kind === 'ctx', ax = b.kind === 'axial', tr = b.kind === 'trunk', lg = b.kind === 'leg';
      const legCtx = LEGXB.has(id) && (S.region === 'podudzie' || !!(anaRegs && anaRegs.has('podudzie')));
      let vis = bonesOn && sideOn && !S.hiddenB.has(id) && (ctxLayer ? (S.layers.ctx || need.has(id)) : ax ? (S.layers.skull || S.region === 'glowa') : tr ? (S.region === 'tulow' || !!(anaRegs && anaRegs.has('tulow')) || legCtx) : lg ? (S.region === 'podudzie' || !!(anaRegs && anaRegs.has('podudzie'))) : true);
      let ghost = false;
      if (!ctxLayer && !ax && !tr && !lg && !regionOk(b.region)) { if (S.ghostBg && bonesOn && sideOn) { vis = true; ghost = true; } else vis = false; }
      if ((need.has(id) || selBone === id || jb.has(id)) && sideOn && (!S.hiddenB.has(id) || selBone === id)) { vis = true; ghost = false; }
      o.visible = vis;
      let mat = ctxLayer ? MAT.ctx : MAT.bone;
      if (selBone === id) mat = MAT.hiBone;
      else if (ghost || (gs.size && !need.has(id)) || (sj && !jb.has(id))) mat = MAT.ghostBone;
      o.userData.gh = mat === MAT.ghostBone; o.material = mat; o.renderOrder = mat === MAT.ghostBone ? 2 : 0;
    }
    for (const [id, o] of SD.patch) {
      const role = patchOn.get(id); o.visible = !!role && on && SD.bone.get(patchBone(id))?.visible !== false;
      if (role) o.material = role === 'o' ? MAT.org : MAT.ins;
    }
    for (const [id, o] of SD.cap) {
      const own = capOwn.get(id) || [], midCap = own.some((j) => j.mid);
      let show = false, mat = MAT.cap;
      if (sj && sj.caps.includes(id)) { show = true; mat = capMatFor(sj); } else if (S.layers.cap && own.some(jointRegionOk)) show = true;
      o.visible = show && (midCap || on); if (show) o.material = mat; o.renderOrder = 3;
    }
    for (const [jid, arr] of SD.mk) {
      const j = JMAP.get(jid); const isSel = !!sj && sj.id === jid;
      const show = isSel || (S.layers.joints && !(j.children && j.children.length) && jointRegionOk(j));
      for (const m of arr) m.visible = show && (j.mid || on);
      j.mat.opacity = sj ? (isSel ? (j.caps.length ? 0.4 : 0.62) : 0.2) : 0.5;
    }
  }
  applyHover(); updatePins(); dirty(); POSE.sync();
}
function applyHover() { // najechany mięsień / kość zostaje w pełni widoczny, reszta modelu ma o 40% mniejsze krycie
  const h = S.hov; if (!h) return;
  for (const SD of [SIDE.r, SIDE.l]) {
    for (const [id, o] of SD.mus) {
      if (!o.visible) continue; const k = MUS.get(id).grp;
      if (h.t === 'grp' && h.id === k) { o.material = tintOf(k, 0.2, 1); o.renderOrder = 0; } else o.material = fadeOf(o.material);
    }
    for (const [id, o] of SD.bone) { if (!o.visible || (SD.k === 'l' && MIDB.has(id))) continue; if (h.t === 'bone' && h.id === id) { o.material = MAT.hiBone; o.renderOrder = 0; } else o.material = fadeOf(o.material); }
    for (const [id, o] of SD.str) if (o.visible) o.material = fadeOf(o.material);
  }
}
function setHover(h) {
  const a = S.hov, same = (!a && !h) || (a && h && a.t === h.t && a.id === h.id); if (same) return; S.hov = h; apply();
}
const patchBoneMap = new Map(DATA.patches.map((p) => [p.id, p.bone]));
const patchBone = (id) => patchBoneMap.get(id);

/* ---------- pinezki punktów kostnych ---------- */
const pinTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  x.beginPath(); x.arc(32, 32, 26, 0, 7); x.fillStyle = '#fff'; x.fill(); x.lineWidth = 6; x.strokeStyle = '#0a84ff'; x.stroke();
  x.beginPath(); x.arc(32, 32, 9, 0, 7); x.fillStyle = '#0a84ff'; x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const pins = new Map(); const pinGroup = new THREE.Group(); pinGroup.renderOrder = 10; scene.add(pinGroup);
function updatePins() {
  pinGroup.clear(); pins.clear();
  const s = S.sel; if (!s) { labelEl.classList.remove('show'); return; }
  let list = [];
  if (s.t === 'lm') list = [LMS.get(s.id)];
  else if (s.t === 'bone' && S.showPins) list = lmsByBone.get(s.id) || [];
  for (const l of list) {
    const p = lmPos(l.id, s.side); if (!p) continue;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: pinTex, depthTest: false, depthWrite: false, sizeAttenuation: false, transparent: true }));
    const active = s.t === 'lm' && s.id === l.id;
    sp.scale.setScalar(active ? 0.03 : 0.015); sp.position.copy(p); sp.renderOrder = 10; sp.userData = { kind: 'lm', id: l.id };
    pinGroup.add(sp); pins.set(l.id, sp);
  }
  if (s.t === 'lm') { labelEl.innerHTML = `<b>${esc(LMS.get(s.id).pl)}</b><small>(${esc(LMS.get(s.id).la)})</small>`; labelEl.classList.add('show'); } else labelEl.classList.remove('show');
}
const labelEl = $('#pinlabel');
const tmpV = new THREE.Vector3();
function placeLabel() {
  if (!S.sel || S.sel.t !== 'lm') return;
  const p = lmPos(S.sel.id, S.sel.side); if (!p) return;
  tmpV.copy(p).project(camera); const r = canvas.getBoundingClientRect();
  const x = (tmpV.x * 0.5 + 0.5) * r.width, y = (-tmpV.y * 0.5 + 0.5) * r.height;
  labelEl.style.transform = `translate(${x + 18}px, ${y - 16}px)`;
  labelEl.style.opacity = tmpV.z < 1 ? 1 : 0;
}

/* ---------- kamera ---------- */
let anim = null;
function flyTo(target, dist, dir, ms = 700) {
  const from = { t: controls.target.clone(), p: camera.position.clone() };
  const d = dir ? dir.clone().normalize() : camera.position.clone().sub(controls.target).normalize();
  const to = { t: target.clone(), p: target.clone().add(d.multiplyScalar(dist)) };
  anim = { from, to, t0: performance.now(), ms };
}
function stepAnim(now) {
  if (!anim) return;
  let k = Math.min(1, (now - anim.t0) / anim.ms); const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  controls.target.lerpVectors(anim.from.t, anim.to.t, e); camera.position.lerpVectors(anim.from.p, anim.to.p, e);
  if (k >= 1) anim = null; dirty();
}
const fitDist = (radius) => radius / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2) * 1.05;
function boxOf(list) {
  const b = new THREE.Box3(); for (const o of list) if (o) { o.updateWorldMatrix(true, false); b.expandByObject(o); } return b;
}
function focusObjects(list, dir, minD = 0.12) {
  const b = boxOf(list); if (b.isEmpty()) return; const c = b.getCenter(new THREE.Vector3()); const r = b.getSize(new THREE.Vector3()).length() / 2;
  flyTo(c, Math.max(fitDist(r), minD), dir);
}
const DIRS = { front: [0, 0.05, 1], back: [0, 0.05, -1], lat: [-1, 0.05, 0.12], med: [1, 0.05, 0.12], top: [0, 1, 0.08] };
function regionBox(region) {
  const list = []; const R = region;
  for (const SD of activeSides()) {
    for (const [id, o] of SD.mus) { const k = MUS.get(id).grp; if (R === 'all' ? !OTHER.has(k) && G[k].region !== 'podudzie' && G[k].region !== 'tulow' && G[k].region !== 'glowa' : (G[k].region === R || (R === 'podudzie' && LEGX.has(k)))) list.push(o); }
    for (const [id, o] of SD.bone) { const b = BON.get(id); if (R === 'all' ? b.kind === 'bone' : (b.region === R || (R === 'podudzie' && LEGXB.has(id)))) list.push(o); }
  }
  return list;
}
function viewRegion(dirName) {
  const dir = new THREE.Vector3(...DIRS[dirName || 'front']);
  if (S.side === 'l' && (dirName === 'lat' || dirName === 'med')) dir.x *= -1;
  focusObjects(regionBox(S.region), dir);
}

/* ---------- wybór ---------- */
const selSide = (sel) => (sel && sel.side) || defSide();
const grpOf = (sel) => (sel.t === 'grp' ? sel.id : MUS.get(sel.id).grp);
function select(sel, opts = {}) {
  if (S.multiMode && sel && (sel.t === 'grp' || sel.t === 'part')) { toggleMulti(grpOf(sel), undefined, opts); return; }
  if (S.multiMode && sel) exitMulti(true);
  if (sel && needAxial(sel) && !S.axial) { ensureAxial().then(() => select(sel, opts)); return; }
  if (sel && needTrunk(sel) && !S.trunk) { ensureTrunk().then(() => select(sel, opts)); return; }
  if (sel && needLeg(sel) && !S.leg) { ensureLeg().then(() => select(sel, opts)); return; }
  if (sel && (sel.t === 'grp' || sel.t === 'part')) { const k = grpOf(sel); S.hidden.delete(k); S.ghosted.delete(k); } // klik w nazwę nigdy nie chowa mięśnia
  if (sel && sel.t === 'bone') S.hiddenB.delete(sel.id);
  if (sel && sel.t === 'str') { const f = STRK[STR.get(sel.id).t]; if (!SIDE.r.str.has(sel.id)) { S.layers[f] = true; const el = $('#l' + ({ lig: 'Lig', nerv: 'Nerv', vess: 'Vess' })[f]); if (el) el.checked = true; ensureStruct(f).then(() => select(sel, opts)); return; } if (STR.get(sel.id).reg === 'glowa' && !S.axial) { ensureAxial(); } }
  S.sel = sel;
  apply(); renderInfo(); markList();
  if (!sel) return;
  if (opts.noFly) return;
  const sd = selSide(sel);
  if (sel.t === 'grp') { const g = G[sel.id]; focusObjects([...g.ids.map((i) => O('mus', i, sd)), ...(patchesByGrp.get(sel.id) || []).map((p) => O('patch', p.id, sd))]); }
  else if (sel.t === 'part') focusObjects([O('mus', sel.id, sd)]);
  else if (sel.t === 'bone') focusObjects([O('bone', sel.id, sd)]);
  else if (sel.t === 'str') focusObjects([O('str', sel.id, sd)], null, 0.1);
  else if (sel.t === 'lm') { const p = lmPos(sel.id, sd); if (p) flyTo(p, 0.11); }
  else if (sel.t === 'joint') { const j = JMAP.get(sel.id); const ms = (SIDE[j.mid ? 'r' : sd].mk.get(j.id) || []); { const bb = boxOf(ms); if (!bb.isEmpty()) { const r = bb.getSize(new THREE.Vector3()).length() / 2; flyTo(bb.getCenter(new THREE.Vector3()), Math.max(fitDist(r) * 1.9, 0.19)); } } }
  if (window.innerWidth < 820) closeDrawer();
}
/* wielokrotny wybór mięśni */
const nextIdx = () => 0; // kolory mięśni są własne (data.groups[k].col); wartość w S.multi nie wpływa już na kolor
function enterMulti() {
  if (S.multiMode) return; S.multiMode = true; $('#multiBtn').classList.add('on');
  if (S.sel && (S.sel.t === 'grp' || S.sel.t === 'part')) S.multi.set(grpOf(S.sel), 0);
  S.sel = null;
}
function exitMulti(silent) {
  if (!S.multiMode) return; S.multiMode = false; $('#multiBtn').classList.remove('on');
  const keys = [...S.multi.keys()]; S.multi.clear();
  if (!silent) { S.sel = keys.length === 1 ? { t: 'grp', id: keys[0] } : null; apply(); renderInfo(); markList(); }
}
function toggleMulti(k, idx, opts = {}) {
  enterMulti();
  if (S.multi.has(k)) S.multi.delete(k); else { S.multi.set(k, idx ?? nextIdx()); if (!opts.noFly && S.multi.size === 1) focusObjects([...G[k].ids.map((i) => O('mus', i, defSide()))]); }
  apply(); renderInfo(); markList();
}
function setMulti(entries, fly = true) { // entries: [[klucz, indeks]]
  enterMulti(); S.multi = new Map(entries); apply(); renderInfo(); markList();
  if (fly) focusObjects([...S.multi.keys()].flatMap((k) => G[k].ids.map((i) => O('mus', i, defSide()))), null, 0.16);
}

/* ---------- picking ---------- */
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
function pick(ev) {
  const r = canvas.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera); ray.firstHitOnly = true;
  if (pinGroup.children.length) { const h = ray.intersectObjects(pinGroup.children, false); if (h.length) return { pin: h[0].object.userData }; }
  const mk = markerMeshes.filter((m) => m.visible); if (mk.length) { const h = ray.intersectObjects(mk, false); if (h.length) return { obj: h[0].object }; }
  const vis = pickables.filter((o) => o.visible && !o.userData.gh);
  const h = ray.intersectObjects(vis, false); return h.length ? { obj: h[0].object } : null;
}
let down = null; let lpT = 0; let lpFired = false;
const ctxEl = $('#ctx');
canvas.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY, t: performance.now(), b: e.button }; anim = null; lpFired = false; closeCtx();
  if (e.pointerType === 'touch') { clearTimeout(lpT); const ev = { clientX: e.clientX, clientY: e.clientY }; lpT = setTimeout(() => { if (down) { lpFired = true; openCtx(ev); } }, 550); }
});
canvas.addEventListener('pointermove', (e) => { if (down && lpT) { const dx = e.clientX - down.x, dy = e.clientY - down.y; if (dx * dx + dy * dy > 64) clearTimeout(lpT); } });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerup', (e) => {
  clearTimeout(lpT);
  if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; const moved = dx * dx + dy * dy > 25; const btn = down.b; down = null; if (moved || lpFired) return;
  if (btn === 2) { openCtx(e); return; }
  if (btn !== 0) return;
  const h = pick(e); if (!h) { if (S.sel) select(null); return; }
  if (h.pin) { select({ t: 'lm', id: h.pin.id, side: S.sel && S.sel.side }); return; }
  const u = h.obj.userData;
  if (e.shiftKey) { // Shift+klik = ukryj to, co jest pod kursorem (odsłania struktury głębsze)
    if (u.kind === 'mus') hideMuscle(u.grp); else if (u.kind === 'bone') hideBone(u.id); else toast('Shift+klik ukrywa mięśnie i kości; warstwy struktur wyłączysz w menu „Warstwy”.');
    return;
  }
  const multiKey = e.ctrlKey || e.metaKey; // Ctrl / ⌘ + klik = dodaj lub usuń z wyboru wielu mięśni
  if (u.kind === 'mus') {
    const g = G[u.grp];
    if (S.multiMode || multiKey) { toggleMulti(u.grp); return; }
    if (S.sel && ((S.sel.t === 'grp' && S.sel.id === u.grp) || (S.sel.t === 'part' && MUS.get(S.sel.id).grp === u.grp)) && g.parts.length > 1) select({ t: 'part', id: u.id, side: u.side }, { noFly: true });
    else select({ t: 'grp', id: u.grp, side: u.side }, { noFly: false });
  } else if (u.kind === 'bone') { if (!S.multiMode) select({ t: 'bone', id: u.id, side: u.side }); }
  else if (u.kind === 'joint') select({ t: 'joint', id: u.id, side: u.side });
  else if (u.kind === 'str') { if (!S.multiMode) select({ t: 'str', id: u.id, side: u.side }); }
});
/* ---------- ukrywanie na modelu: Shift+klik, menu PPM / długie przytrzymanie, H, Ctrl+Z ---------- */
function pushUndo(fn, label) { S.undo.push({ fn, label }); if (S.undo.length > 60) S.undo.shift(); }
function dropFromSel(k) {
  let ch = false;
  if (S.sel && (S.sel.t === 'grp' || S.sel.t === 'part') && grpOf(S.sel) === k) { S.sel = null; ch = true; }
  if (S.multi.has(k)) { S.multi.delete(k); ch = true; }
  S.focused.delete(k); S.ghosted.delete(k); return ch;
}
function hideMuscle(k) {
  if (!G[k] || S.hidden.has(k)) return;
  const was = { g: S.ghosted.has(k), f: S.focused.has(k) };
  dropFromSel(k); S.hidden.add(k);
  pushUndo(() => { S.hidden.delete(k); if (was.g) S.ghosted.add(k); if (was.f) S.focused.add(k); }, G[k].pl);
  afterVisChange(); toast(`Ukryto: ${G[k].pl}`, { label: 'Cofnij', fn: undoVis });
}
function hideBone(id) {
  if (S.hiddenB.has(id)) return; const b = BON.get(id);
  if (S.sel && S.sel.t === 'bone' && S.sel.id === id) S.sel = null;
  S.hiddenB.add(id); pushUndo(() => S.hiddenB.delete(id), b.pl);
  afterVisChange(); toast(`Ukryto kość: ${b.pl}`, { label: 'Cofnij', fn: undoVis });
}
function undoVis() { const u = S.undo.pop(); if (!u) { toast('Nie ma czego cofać.'); return; } u.fn(); afterVisChange(); toast(`Przywrócono: ${u.label}`); }
function showAllHidden() {
  const n = S.hidden.size + S.hiddenB.size; if (!n) return; const h = [...S.hidden], hb = [...S.hiddenB];
  S.hidden.clear(); S.hiddenB.clear(); pushUndo(() => { h.forEach((k) => S.hidden.add(k)); hb.forEach((k) => S.hiddenB.add(k)); }, `${n} ukrytych`);
  afterVisChange(); toast(`Pokazano wszystkie ukryte (${n})`, { label: 'Cofnij', fn: undoVis });
}
function restoreOne(kind, id) {
  if (kind === 'm') S.hidden.delete(id); else S.hiddenB.delete(id);
  afterVisChange();
}
function afterVisChange() { syncVis(); apply(); renderInfo(); markList(); if (typeof renderVisPanel === 'function') renderVisPanel(); setHover(null); tip.classList.remove('show'); }
const hiddenCount = () => S.hidden.size + S.hiddenB.size;

function closeCtx() { ctxEl.classList.remove('show'); }
function openCtx(e) {
  const h = pick(e); if (!h || !h.obj) { closeCtx(); return; } const u = h.obj.userData; let items = [], title = '';
  if (u.kind === 'mus') {
    const k = u.grp, g = G[k]; title = g.pl;
    items = [['sel', 'Zaznacz'], ['hide', 'Ukryj (odsłoń głębsze)'], ['ghost', 'Tło (półprzezroczysty)'], ['focus', 'Wyróżnij'], ['only', 'Pokaż tylko ten'], ['multi', 'Dodaj do wyboru wielu'], ['pose', 'Pokaż w ruchu…']];
    ctxEl.dataset.k = k; ctxEl.dataset.kind = 'm';
  } else if (u.kind === 'bone') {
    const b = BON.get(u.id); title = b.pl; items = [['sel', 'Zaznacz'], ['hideb', 'Ukryj kość']]; ctxEl.dataset.k = u.id; ctxEl.dataset.kind = 'b';
  } else { closeCtx(); return; }
  ctxEl.innerHTML = `<div class="ct">${esc(title)}</div>` + items.map(([a, n]) => `<button data-a="${a}">${esc(n)}</button>`).join('') + (hiddenCount() ? `<button data-a="all">Pokaż wszystkie ukryte (${hiddenCount()})</button>` : '');
  ctxEl.classList.add('show'); tip.classList.remove('show');
  const r = canvas.parentElement.getBoundingClientRect(); const w = ctxEl.offsetWidth, hh = ctxEl.offsetHeight;
  ctxEl.style.left = Math.max(4, Math.min(r.width - w - 4, e.clientX - r.left)) + 'px'; ctxEl.style.top = Math.max(4, Math.min(r.height - hh - 4, e.clientY - r.top)) + 'px';
}
ctxEl.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-a]'); if (!b) return; const a = b.dataset.a, k = ctxEl.dataset.k, kind = ctxEl.dataset.kind; closeCtx();
  if (a === 'all') { showAllHidden(); return; }
  if (kind === 'b') { if (a === 'sel') select({ t: 'bone', id: k }); else if (a === 'hideb') hideBone(k); return; }
  if (a === 'sel') select({ t: 'grp', id: k });
  else if (a === 'hide') hideMuscle(k);
  else if (a === 'ghost') { setVis(k, 'g'); dropFromSel(k) && (apply(), renderInfo()); }
  else if (a === 'focus') setVis(k, 'f');
  else if (a === 'only') { clearVis(); for (const x of Object.keys(G)) if (x !== k) S.hidden.add(x); S.hiddenB.clear(); afterVisChange(); }
  else if (a === 'multi') toggleMulti(k);
  else if (a === 'pose') showMusclePose(k);
});
document.addEventListener('pointerdown', (e) => { if (!e.target.closest('#ctx') && e.target !== canvas) closeCtx(); });
window.addEventListener('keydown', (e) => {
  if (/input|textarea|select/i.test(document.activeElement.tagName)) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undoVis(); return; }
  if (e.key === 'Escape') { closeCtx(); return; }
  if ((e.key === 'h' || e.key === 'H' || e.key === 'Delete') && !e.ctrlKey && !e.metaKey) {
    if (e.shiftKey && e.key.toLowerCase() === 'h') { showAllHidden(); return; }
    const s = S.sel; if (s && (s.t === 'grp' || s.t === 'part')) hideMuscle(grpOf(s)); else if (s && s.t === 'bone') hideBone(s.id);
  }
});
const tip = $('#tip'); let lastMove = 0;
canvas.addEventListener('pointermove', (e) => {
  const now = performance.now(); if (now - lastMove < 60 || (e.buttons & 1) || e.pointerType === 'touch' || ctxEl.classList.contains('show')) return; lastMove = now;
  const h = pick(e);
  if (!h || !h.obj) setHover(null); else { const u = h.obj.userData; setHover(u.kind === 'mus' ? { t: 'grp', id: u.grp } : u.kind === 'bone' ? { t: 'bone', id: u.id } : null); }
  if (!h) { tip.classList.remove('show'); canvas.style.cursor = 'grab'; return; }
  canvas.style.cursor = 'pointer';
  let pl, la;
  if (h.pin) { const l = LMS.get(h.pin.id); pl = l.pl; la = l.la; }
  else { const u = h.obj.userData; if (u.kind === 'mus') { const g = G[u.grp], m = MUS.get(u.id); pl = g.pl + (m.pl && g.parts.length > 1 ? ' — ' + m.pl.toLowerCase() : ''); la = g.la; } else if (u.kind === 'str') { const x = STR.get(u.id); pl = x.pl; la = x.la; } else if (u.kind === 'joint') { const j = JMAP.get(u.id); pl = j.pl; la = j.la; } else { const b = BON.get(u.id); pl = b.pl; la = b.la; } }
  tip.innerHTML = `<b>${esc(pl)}</b><small>(${esc(la)})</small>`; tip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`; tip.classList.add('show');
});
canvas.addEventListener('pointerleave', () => { tip.classList.remove('show'); setHover(null); });
canvas.addEventListener('dblclick', (e) => {
  const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
  const h = ray.intersectObjects(pickables.filter((o) => o.visible), false); if (h.length) flyTo(h[0].point, Math.max(0.1, camera.position.distanceTo(h[0].point) * 0.5), null, 500);
});

/* ---------- lista boczna ---------- */
const listEl = $('#list');
const rowHTML = (pl, la, extra = '') => `<span class="nm"><span class="pl">${esc(pl)}</span><span class="la">(${esc(la)})</span></span>${extra}`;
const sdot = (j) => `<i class="sdot" style="background:${SHP[j.shape].c}"></i>`;
const VIS_OPT = [['v', 'Pokaż'], ['g', 'Tło'], ['f', 'Wyróżnij'], ['h', 'Ukryj']];
const visOf = (k) => (S.hidden.has(k) ? 'h' : S.ghosted.has(k) ? 'g' : S.focused.has(k) ? 'f' : 'v');
const visSel = (k) => `<select class="vsel" data-vsel="${k}" data-v="${visOf(k)}" title="Widoczność mięśnia: widoczny / tło (półprzezroczysty) / wyróżniony / ukryty" aria-label="Widoczność mięśnia">${VIS_OPT.map(([x, n]) => `<option value="${x}"${x === visOf(k) ? ' selected' : ''}>${n}</option>`).join('')}</select>`;
const clearVis = () => { S.hidden.clear(); S.ghosted.clear(); S.focused.clear(); S.hiddenB.clear(); S.undo.length = 0; };
function setVis(k, v) {
  S.hidden.delete(k); S.ghosted.delete(k); S.focused.delete(k);
  if (v === 'h') S.hidden.add(k); else if (v === 'g') S.ghosted.add(k); else if (v === 'f') S.focused.add(k);
  syncVis(); apply(); if (PS.wid.on) renderVisPanel(); else layoutPanels();
}
function syncVis() { $$('select.vsel', listEl).forEach((el) => { const v = visOf(el.dataset.vsel); el.value = v; el.dataset.v = v; }); }
function renderList() {
  const regs = S.region === 'all' ? REG_ORDER : [S.region];
  let h = '';
  let tipOff = false; try { tipOff = localStorage.getItem('anatomia.tipMulti') === '1'; } catch (e) {}
  if (S.tab === 'mus' && !tipOff) h += '<div class="tip"><span>💡 <b>Ctrl + klik</b> = dodaj do wyboru wielu mięśni · <b>Shift + klik</b> = ukryj mięsień (odsłania głębsze) · <b>PPM</b> lub długie przytrzymanie = menu · <b>Ctrl+Z</b> cofa.</span><button data-tipx aria-label="Ukryj podpowiedź">×</button></div>';
  if (S.tab === 'mus') {
    for (const r of regs) {
      const gs = Object.values(G).filter((g) => g.region === r).sort((a, b) => a.pl.localeCompare(b.pl, 'pl'));
      if (!gs.length) continue;
      h += `<div class="sec">${esc(REGION_NAME[r])} <i>${gs.length}</i></div>`;
      for (const g of gs) {
        const multi = g.parts.length > 1;
        h += `<div class="grp" data-g="${g.key}"><div class="row" data-t="grp" data-id="${g.key}">
          <i class="dotc mdot" style="background:${OTHER.has(g.key) ? '#d9c39a' : g.col}"></i>
          ${rowHTML(g.pl, g.la, (multi ? `<button class="car" data-car="${g.key}" aria-label="Części">${g.parts.length}▾</button>` : '<span class="car0"></span>') + visSel(g.key))}</div>`;
        if (multi) { h += `<div class="parts" data-parts="${g.key}">`; for (const p of g.parts) h += `<div class="row sub" data-t="part" data-id="${p.id}">${rowHTML(p.pl, p.la)}</div>`; h += '</div>'; }
        h += '</div>';
      }
    }
  } else if (S.tab === 'lig' || S.tab === 'nerv' || S.tab === 'vess') {
    const types = S.tab === 'vess' ? ['art', 'ven'] : [S.tab];
    if (S.tab === 'vess') h += `<div class="jleg"><span><i class="sdot" style="background:${STRCSS.art}"></i>Tętnice</span><span><i class="sdot" style="background:${STRCSS.ven}"></i>Żyły</span></div>`;
    for (const r of regs) {
      const xs = DATA.structs.filter((x) => types.includes(x.t) && x.reg === r).sort((a, b) => a.pl.localeCompare(b.pl, 'pl'));
      if (!xs.length) continue;
      h += `<div class="sec">${esc(REGION_NAME[r])} <i>${xs.length}</i></div>`;
      for (const x of xs) h += `<div class="grp"><div class="row" data-t="str" data-id="${x.id}"><i class="sdot" style="background:${STRCSS[x.t]}"></i>${rowHTML(x.pl, x.la)}</div></div>`;
    }
  } else if (S.tab === 'jnt') {
    h += `<div class="jleg">${Object.values(SHP).map((s) => `<span><i class="sdot" style="background:${s.c}"></i>${esc(s.pl.split(' (')[0])}</span>`).join('')}</div>`;
    for (const r of regs) {
      const js = JN.filter((j) => j.reg === r && !j.parent);
      if (!js.length) continue;
      h += `<div class="sec">${esc(REGION_NAME[r])} <i>${JN.filter((j) => j.reg === r).length}</i></div>`;
      for (const j of js) {
        h += `<div class="grp"><div class="row" data-t="joint" data-id="${j.id}">${sdot(j)}${rowHTML(j.pl, j.la, `<span class="typ">${esc(SHP[j.shape].pl.split(' (')[0])}</span>`)}</div>`;
        for (const c of j.children || []) { const cj = JMAP.get(c); h += `<div class="row sub" data-t="joint" data-id="${cj.id}">${sdot(cj)}${rowHTML(cj.pl, cj.la, `<span class="typ">${esc(SHP[cj.shape].pl.split(' (')[0])}</span>`)}</div>`; }
        h += '</div>';
      }
    }
  } else {
    for (const r of regs) {
      const bs = DATA.bones.filter((b) => (b.kind === 'bone' || b.kind === 'axial' || b.kind === 'trunk' || b.kind === 'leg') && b.region === r).sort((a, b) => (a.pl.localeCompare(b.pl, 'pl', { numeric: true })));
      if (!bs.length) continue;
      h += `<div class="sec">${esc(REGION_NAME[r])} <i>${bs.length}</i></div>`;
      for (const b of bs) {
        const ls = lmsByBone.get(b.id) || [];
        h += `<div class="grp"><div class="row" data-t="bone" data-id="${b.id}">${rowHTML(b.pl, b.la, ls.length ? `<button class="car" data-lcar="${b.id}" aria-label="Punkty kostne">${ls.length}▾</button>` : '')}</div>`;
        if (ls.length) { h += `<div class="parts" data-lparts="${b.id}">`; for (const l of [...ls].sort((a, b) => a.pl.localeCompare(b.pl, 'pl'))) h += `<div class="row sub" data-t="lm" data-id="${l.id}">${rowHTML(l.pl, l.la)}</div>`; h += '</div>'; }
        h += '</div>';
      }
    }
    if (S.region === 'all' || S.region === 'bark') {
      const cs = DATA.bones.filter((b) => b.kind === 'ctx');
      h += `<div class="sec">Kontekst: tułów <i>${cs.length}</i></div>`;
      for (const b of cs) h += `<div class="grp"><div class="row" data-t="bone" data-id="${b.id}">${rowHTML(b.pl, b.la)}</div></div>`;
    }
  }
  if (!h) h = '<div class="more">Brak pozycji w tym zakresie (w tej wersji: kości i stawy głowy i szyi).</div>';
  listEl.innerHTML = h; markList();
}
const eyeSvg = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>';
function markList() {
  syncVis(); $$('.row.on', listEl).forEach((e) => e.classList.remove('on'));
  if (S.multiMode) { for (const k of S.multi.keys()) { const el = $(`.row[data-t="grp"][data-id="${k}"]`, listEl); if (el) el.classList.add('on'); } return; }
  const s = S.sel; if (!s) return;
  let el = $(`.row[data-t="${s.t}"][data-id="${s.id}"]`, listEl);
  if (!el && s.t === 'part') el = $(`.row[data-t="grp"][data-id="${MUS.get(s.id).grp}"]`, listEl);
  if (el) { el.classList.add('on'); const p = el.closest('.parts'); if (p) p.classList.add('open'); if (!searchActive) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}
listEl.addEventListener('click', (e) => {
  if (e.target.closest('[data-tipx]')) { try { localStorage.setItem('anatomia.tipMulti', '1'); } catch (x) {} renderList(); return; }
  if (e.target.closest('select')) { e.stopPropagation(); return; }
  const car = e.target.closest('[data-car],[data-lcar]');
  if (car) { const p = $(`[data-parts="${car.dataset.car}"],[data-lparts="${car.dataset.lcar}"]`, listEl); p && p.classList.toggle('open'); e.stopPropagation(); return; }
  const row = e.target.closest('.row'); if (!row) return;
  if ((e.ctrlKey || e.metaKey) && row.dataset.t === 'grp') { toggleMulti(row.dataset.id); return; }
  if (e.shiftKey && row.dataset.t === 'grp') { hideMuscle(row.dataset.id); return; }
  if (e.shiftKey && row.dataset.t === 'bone') { hideBone(row.dataset.id); return; }
  select({ t: row.dataset.t, id: row.dataset.id });
});

listEl.addEventListener('change', (e) => { const sel = e.target.closest('select.vsel'); if (sel) setVis(sel.dataset.vsel, sel.value); });
// najechanie na pozycję listy podświetla ją na modelu (reszta wygaszona o 40%)
listEl.addEventListener('pointerover', (e) => {
  if (e.pointerType && e.pointerType !== 'mouse') return; const row = e.target.closest('.row[data-t]'); if (!row || e.target.closest('select')) return;
  const t = row.dataset.t; if (t === 'grp') setHover({ t: 'grp', id: row.dataset.id }); else if (t === 'part') setHover({ t: 'grp', id: MUS.get(row.dataset.id).grp }); else if (t === 'bone') setHover({ t: 'bone', id: row.dataset.id });
});
listEl.addEventListener('pointerleave', () => setHover(null));

/* ---------- szukajka ---------- */
const searchEl = $('#q'); const resEl = $('#results'); let searchActive = false;
const IDX = [];
for (const g of Object.values(G)) IDX.push({ t: 'grp', id: g.key, pl: g.pl, la: g.la, typ: OTHER.has(g.key) ? 'Powięź / troczek' : 'Mięsień', hay: norm([g.pl, g.la, g.alt, ...g.parts.map((p) => p.en)].join(' ')), w: 0 });
for (const m of DATA.muscles) { const g = G[m.grp]; if (g.parts.length > 1) IDX.push({ t: 'part', id: m.id, pl: `${g.pl} — ${m.pl.toLowerCase()}`, la: `${g.la}, ${m.la.toLowerCase()}`, typ: 'Część mięśnia', hay: norm([m.pl, m.la, g.pl, g.la, m.en].join(' ')), w: 1 }); }
for (const b of DATA.bones) IDX.push({ t: 'bone', id: b.id, pl: b.pl, la: b.la, typ: b.kind === 'ctx' ? 'Kość (kontekst)' : 'Kość', hay: norm([b.pl, b.la, b.en].join(' ')), w: 0 });
for (const j of JN) IDX.push({ t: 'joint', id: j.id, pl: j.pl, la: j.la, typ: 'Staw · ' + SHP[j.shape].pl.split(' (')[0], hay: norm([j.pl, j.la, j.alt, SHP[j.shape].pl, j.ksztalt, j.rodzaj, 'staw', j.piet ? 'pietrowy dwujamowy dwukomorowy' : ''].join(' ')), w: 0 });
for (const x of DATA.structs || []) IDX.push({ t: 'str', id: x.id, pl: x.pl, la: x.la, typ: STRTYP[x.t] + ' · ' + REGION_NAME[x.reg].toLowerCase(), hay: norm([x.pl, x.la, x.en, STRTYP[x.t], x.t === 'nerv' ? 'nerwy unerwienie' : x.t === 'lig' ? 'wiezadla wiezadlo' : 'naczynia krew'].join(' ')), w: 1 });
for (const l of DATA.lms) { const b = BON.get(l.bone); IDX.push({ t: 'lm', id: l.id, pl: l.pl, la: l.la, typ: 'Punkt kostny · ' + b.pl.toLowerCase(), hay: norm([l.pl, l.la, l.en, b.pl, b.la].join(' ')), w: 2 }); }
function doSearch(q) {
  const toks = norm(q).split(/\s+/).filter(Boolean);
  if (!toks.length) { searchActive = false; resEl.classList.remove('show'); listEl.classList.remove('hide'); return; }
  searchActive = true;
  const out = [];
  for (const it of IDX) {
    if (!toks.every((t) => it.hay.includes(t))) continue;
    const npl = norm(it.pl); let sc = it.w * 10; if (npl.startsWith(toks[0])) sc -= 6; else if (npl.includes(' ' + toks[0])) sc -= 3; if (npl === toks.join(' ')) sc -= 10;
    out.push({ it, sc });
  }
  out.sort((a, b) => a.sc - b.sc || a.it.pl.localeCompare(b.it.pl, 'pl'));
  const top = out.slice(0, 80);
  resEl.innerHTML = top.length ? top.map(({ it }, i) => `<div class="row res" data-t="${it.t}" data-id="${it.id}" data-i="${i}">${rowHTML(it.pl, it.la)}<span class="typ">${esc(it.typ)}</span></div>`).join('') + (out.length > 80 ? `<div class="more">+${out.length - 80} kolejnych — doprecyzuj wyszukiwanie</div>` : '') : '<div class="more">Brak wyników</div>';
  resEl.classList.add('show'); listEl.classList.add('hide');
}
searchEl.addEventListener('input', () => doSearch(searchEl.value));
searchEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { const f = $('.row.res', resEl); if (f) f.click(); }
  if (e.key === 'Escape') { searchEl.value = ''; doSearch(''); searchEl.blur(); }
});
resEl.addEventListener('click', (e) => {
  const row = e.target.closest('.row.res'); if (!row) return;
  const t = row.dataset.t, id = row.dataset.id;
  if (t === 'lm' || t === 'bone') { S.tab = 'bone'; syncTabs(); renderList(); } else if (t === 'joint') { S.tab = 'jnt'; syncTabs(); renderList(); } else if (t === 'str') { S.tab = STRK[STR.get(id).t]; syncTabs(); renderList(); }
  searchEl.value = ''; doSearch('');
  select({ t, id });
});
window.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement !== searchEl && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openDrawer(); searchEl.focus(); } });

/* ---------- panele informacyjne (każdy temat osobno: włącz / zwiń / przenieś / zamknij) ---------- */
const PDEF = [
  { id: 'karta', t: 'Karta', ico: 'ℹ️', zone: 'r', on: true, auto: true, tip: 'Opis wybranej struktury: przyczepy, czynność, unerwienie' },
  { id: 'pow', t: 'Powiązania', ico: '🔗', zone: 'l', on: true, auto: true, tip: 'Antagoniści, części, kości, stawy, więzadła' },
  { id: 'ruchy', t: 'Ruchy', ico: '↔️', zone: 'l', on: false, tip: 'Komplet ruchów w stawach (bark → stopa, kręgosłup, szyja) i mięśnie, które je wykonują' },
  { id: 'poza', t: 'Poza', ico: '🦾', zone: 'r', on: false, tip: 'Ruchome stawy: suwaki z zakresami ruchu zdrowego człowieka' },
  { id: 'testy', t: 'Testy', ico: '🩺', zone: 'r', on: false, tip: 'Testy ruchowe: ustaw pozycję i sprawdź, które mięśnie mogą boleć' },
  { id: 'wid', t: 'Widoczność', ico: '👁', zone: 'l', on: false, tip: 'Ukryte, tło i wyróżnione mięśnie; przywracanie' },
  { id: 'ana', t: 'Analiza', ico: '🔎', zone: 'r', on: false, tip: 'Analiza objawów (offline): przyczyny %, mięśnie, co wzmocnić' },
];
const PD = Object.fromEntries(PDEF.map((d) => [d.id, d]));
const PS = {}; let mobActive = null;
{ let sv = {}; try { sv = JSON.parse(localStorage.getItem('anatomia.panels2') || '{}'); } catch (e) {}
  for (const d of PDEF) { const o = sv[d.id] || {}; PS[d.id] = { on: typeof o.on === 'boolean' ? o.on : d.on, min: !!o.min, zone: o.zone === 'l' || o.zone === 'r' ? o.zone : d.zone, html: null }; } }
const infoEl = $('#panels'), dockEl = $('#dock'); const zoneEl = { l: $('#zoneL'), r: $('#zoneR') };
const isMobile = () => window.innerWidth < 820;
const savePanels = () => { try { localStorage.setItem('anatomia.panels2', JSON.stringify(Object.fromEntries(PDEF.map((d) => [d.id, { on: PS[d.id].on, min: PS[d.id].min, zone: PS[d.id].zone }])))); } catch (e) {} };
const pEl = {};
for (const d of PDEF) { const e = document.createElement('section'); e.className = 'pnl'; e.dataset.p = d.id; e.hidden = true; e.innerHTML = `<div class="ph" title="Kliknij, aby zwinąć / rozwinąć"><b class="pt">${d.ico} ${d.t}</b><span class="pbs"><button data-pa="min" title="Zwiń / rozwiń" aria-label="Zwiń">–</button><button data-pa="zone" title="Przenieś na drugą stronę ekranu" aria-label="Przenieś">⇆</button><button data-pa="off" title="Wyłącz panel (włączysz go ponownie na dolnym pasku)" aria-label="Zamknij panel">×</button></span></div><div class="pb"></div>`; pEl[d.id] = e; }
const PLACEHOLDER = {
  karta: '<p class="small">Zaznacz mięsień, kość lub staw (klik w model albo na liście po lewej) — tu pojawi się jego opis: przyczepy, czynność, unerwienie.</p>',
  pow: '<p class="small">Po zaznaczeniu struktury pojawią się tu antagoniści, części, kości, stawy i więzadła.</p>',
  ruchy: '',
  poza: '', wid: '', ana: '<p class="small">Opisz ból lub ruch, a zaznaczę mięśnie, ich udział % i co wzmocnić lub rozciągnąć.</p><div class="btns"><button id="anaNew" class="pri">🔎 Nowa analiza</button></div>' };
for (const d of PDEF) if (d.auto) $('.pb', pEl[d.id]).innerHTML = PLACEHOLDER[d.id];
const panelVisible = (id) => { const p = PS[id]; if (!p.on) return false; if (PD[id].auto) return p.html != null || !!p.pin; return true; };
// dolny pasek budowany raz — potem tylko aktualizowany w miejscu (przebudowa w trakcie kliknięcia gubiła kliknięcie)
dockEl.innerHTML = PDEF.map((d) => `<button class="dk" data-dk="${d.id}" aria-pressed="false"><span class="ck">☐</span><span class="di">${d.ico}</span><span class="dl">${d.t}</span><i class="bd" hidden></i></button>`).join('') + '<button class="dk help" data-dk="_help" title="Skróty i obsługa">?</button>';
const dockHome = dockEl.parentNode, mainEl = $('main');
function placeDock() { const m = isMobile(); dockEl.classList.toggle('mob', m); const to = m ? mainEl : dockHome; if (dockEl.parentNode !== to) { if (m) to.appendChild(dockEl); else to.insertBefore(dockEl, $('#menuBtn')); } }
window.addEventListener('resize', placeDock); placeDock();
$('#menu').insertAdjacentHTML('afterbegin', '<div class="mh">Panele</div>' + PDEF.map((d) => `<button data-mp="${d.id}"><span class="mck">☐</span> ${d.ico} ${d.t}</button>`).join('') + '<hr>');
const mnEl = Object.fromEntries(PDEF.map((d) => [d.id, $(`#menu [data-mp="${d.id}"] .mck`)]));
const dkEl = Object.fromEntries(PDEF.map((d) => [d.id, dockEl.querySelector(`[data-dk="${d.id}"]`)]));
function layoutPanels() {
  const mob = isMobile();
  if (mob) { if (!mobActive || !panelVisible(mobActive)) mobActive = PDEF.map((d) => d.id).find(panelVisible) || null; }
  const want = { l: [], r: [] };
  for (const d of PDEF) {
    const e = pEl[d.id], p = PS[d.id], show = panelVisible(d.id) && (!mob || d.id === mobActive);
    e.hidden = !show; e.classList.toggle('min', p.min);
    (mob ? want.r : want[p.zone]).push(e);
  }
  for (const z of ['l', 'r']) { const cur = [...zoneEl[z].children]; if (cur.length !== want[z].length || cur.some((c, i) => c !== want[z][i])) { for (const e of want[z]) zoneEl[z].appendChild(e); } }
  // dolny pasek (dock) — aktualizacja w miejscu
  for (const d of PDEF) {
    const b = dkEl[d.id], vis = panelVisible(d.id) && (!mob || d.id === mobActive), armed = PS[d.id].on && !vis && PD[d.id].auto && !mob;
    const bt = d.id === 'wid' && hiddenCount() ? String(hiddenCount()) : d.id === 'poza' && POSE.ready && !POSE.isRest() ? '●' : '';
    const cls = 'dk' + (vis ? ' on' : '') + (armed ? ' armed' : '') + (d.auto && PS[d.id].html == null ? ' empty' : '');
    if (b.className !== cls) b.className = cls;
    const ti = d.tip + (armed ? ' — kliknij, aby pokazać panel (wypełni się po wyborze struktury)' : '');
    if (b.title !== ti) b.title = ti;
    const ap = String(vis); if (b.getAttribute('aria-pressed') !== ap) b.setAttribute('aria-pressed', ap);
    const ck = b.firstChild, ct = vis ? '☑' : '☐'; if (ck.textContent !== ct) ck.textContent = ct;
    const bd = b.lastChild; if (bd.textContent !== bt) { bd.textContent = bt; bd.hidden = !bt; }
    const mk = mnEl[d.id]; if (mk.textContent !== ct) mk.textContent = ct;
  }
  updHintTop(); measureInsets();
}
let panelInset = { l: 0, r: 0, b: 0 };
function measureInsets() {
  const mob = isMobile(); let l = 0, r = 0, b = 0;
  if (mob) { const e = mobActive && pEl[mobActive]; if (e && !e.hidden) b = Math.min(e.offsetHeight, e.parentElement.offsetHeight) + 74; }
  else for (const z of ['l', 'r']) { if ([...zoneEl[z].children].some((e) => !e.hidden)) { const w = zoneEl[z].offsetWidth + 12; if (z === 'l') l = w; else r = w; } }
  panelInset = { l, r, b };
}
function setPanel(id, html, opts = {}) { // html === null → brak treści (panele „auto” znikają)
  const p = PS[id], body = $('.pb', pEl[id]), st = body.scrollTop; p.html = html;
  body.innerHTML = html != null ? html : (PLACEHOLDER[id] ?? ''); if (opts.keep) body.scrollTop = st; else body.scrollTop = 0;
  if (html != null && p.on && isMobile() && !opts.quiet) mobActive = id;
  layoutPanels();
}
function togglePanel(id, v) {
  const p = PS[id]; p.on = v === undefined ? !p.on : v;
  if (PD[id].auto) p.pin = p.on && p.html == null; // jawnie otwarty pusty panel pokazuje podpowiedź zamiast znikać
  if (p.on) { p.min = false; if (isMobile()) mobActive = id; if (id === 'poza' && typeof renderPose === 'function') renderPose(); if (id === 'testy' && typeof renderTests === 'function') renderTests(); if (id === 'ruchy') renderRuchy({ keep: true }); if (id === 'wid') renderVisPanel(); if (id === 'ana' && !S.ana) setPanel('ana', null, { quiet: true }); }
  else if (id === 'ana' && S.ana) { S.ana = null; apply(); renderInfo(); markList(); }
  savePanels(); layoutPanels();
}
const showPanel = (id) => { if (!PS[id].on) togglePanel(id, true); else { PS[id].min = false; layoutPanels(); } };
function updHintTop() { // panele prawe zaczynają się pod paskiem widoków tylko wtedy, gdy by go zasłoniły (wąskie okno)
  const v = $('#views'); if (!v) return; const h = Math.round(v.offsetHeight + 24) + 'px', zr = $('#zoneR');
  panelsRoot.style.setProperty('--vh', h);
  const over = zr && innerWidth > 820 && v.getBoundingClientRect().right > zr.getBoundingClientRect().left - 8;
  panelsRoot.style.setProperty('--vr', over ? h : '12px');
}
addEventListener('resize', () => updHintTop());
const panelsRoot = infoEl;
new ResizeObserver(updHintTop).observe($('#views'));
window.addEventListener('resize', () => layoutPanels());
infoEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-pa]'); if (b) { const id = b.closest('.pnl').dataset.p, a = b.dataset.pa, p = PS[id]; if (a === 'min') p.min = !p.min; else if (a === 'zone') p.zone = p.zone === 'r' ? 'l' : 'r'; else if (a === 'off') { togglePanel(id, false); return; } savePanels(); layoutPanels(); return; }
  const ph = e.target.closest('.ph'); if (ph && !e.target.closest('button')) { const p = PS[ph.parentNode.dataset.p]; p.min = !p.min; savePanels(); layoutPanels(); }
});
dockEl.addEventListener('wheel', (e) => { if (dockEl.scrollWidth > dockEl.clientWidth + 2) { dockEl.scrollLeft += e.deltaY || e.deltaX; e.preventDefault(); } }, { passive: false });
const dockToggle = (id) => togglePanel(id, panelVisible(id) && (!isMobile() || id === mobActive) ? false : true);
dockEl.addEventListener('click', (e) => { const b = e.target.closest('[data-dk]'); if (!b) return; if (b.dataset.dk === '_help') { showHelp(); return; } dockToggle(b.dataset.dk); });

layoutPanels();
function chip(pl, la, t, id, cls = '', dot = '') { return `<button class="chip ${cls}" data-t="${t}" data-id="${id}">${dot}${esc(pl)} <small>(${esc(la)})</small></button>`; }
const gchip = (k, cls = '') => chip(G[k].pl, G[k].la, 'grp', k, cls);
const mchips = (arr) => arr.map((m) => (isG(m) ? gchip(m) : `<span class="chip txt">${esc(m)}</span>`)).join('');
const head = (pl, la, tag) => `<div class="ihead"><div><div class="itag">${esc(tag)}</div><h2>${esc(pl)}</h2><div class="ila">(${esc(la)})</div></div></div>`;
const PIET = 'Staw piętrowy (dwujamowy / dwukomorowy): krążek lub łąkotka dzieli jamę stawową na dwa piętra, w których zachodzą różne ruchy.';
function renderMulti() {
  const keys = [...S.multi.keys()];
  let h = head(`Wybrane mięśnie (${keys.length})`, 'wybór wielokrotny', 'Tryb wielu mięśni'), pw = '';
  if (!keys.length) h += '<p class="desc">Klikaj mięśnie na modelu albo na liście, aby dodać lub usunąć je z zaznaczenia. Na komputerze działa też <b>Ctrl</b> + klik. <b>Shift</b> + klik ukrywa mięsień.</p>';
  else {
    h += `<div class="chips mt">${keys.map((k) => `<span class="chip sel"><i class="dotc" style="background:${G[k].col}"></i><button class="cn" data-t="grp" data-id="${k}">${esc(G[k].pl)} <small>(${esc(G[k].la)})</small></button><button class="rm" data-rm="${k}" aria-label="Usuń">×</button></span>`).join('')}</div>`;
    const rel = []; const seen = new Set();
    for (const a of keys) for (const b of ANT.get(a) || []) if (S.multi.has(b) && S.multi.get(a) !== S.multi.get(b)) { const id = [a, b].sort().join('|'); if (!seen.has(id)) { seen.add(id); rel.push([a, b]); } }
    if (rel.length) pw += `<div class="subt">Antagoniści w zaznaczeniu</div><ul class="rel">${rel.map(([a, b]) => `<li>${esc(G[a].pl)} <b>⇄</b> ${esc(G[b].pl)}</li>`).join('')}</ul>`;
    const allAnt = new Set(); for (const k of keys) for (const b of ANT.get(k) || []) if (!S.multi.has(b)) allAnt.add(b);
    if (allAnt.size) pw += `<div class="subt">Antagoniści spoza zaznaczenia</div><div class="chips">${[...allAnt].sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => gchip(k)).join('')}</div>`;
    if (patchesByGrp.size) h += `<div class="legend"><span><i class="o"></i>początki</span><span><i class="i"></i>przyczepy końcowe</span></div>`;
  }
  h += `<div class="btns">${keys.length ? '<button id="bMultiFocus">Przybliż</button>' : ''}${keys.length && [...ANT.keys()].some((k) => S.multi.has(k)) ? '<button id="bAddAnt">Dodaj antagonistów</button>' : ''}${keys.length ? '<button id="bMultiClear">Wyczyść</button>' : ''}<button id="bMultiOff" class="pri">Zakończ wybór wielu</button></div>`;
  setPanel('karta', h); setPanel('pow', pw || null); setRuchy('');
}
function renderInfo() {
  if (S.multiMode) { renderMulti(); return; }
  const s = S.sel; if (!s) { setPanel('karta', null); setPanel('pow', null); setRuchy(''); return; }
  let h = '', pw = '', rv = '';
  if (s.t === 'grp' || s.t === 'part') {
    const gk = grpOf(s); const g = G[gk]; const part = s.t === 'part' ? MUS.get(s.id) : null;
    h += head(part ? `${g.pl} — ${part.pl.toLowerCase()}` : g.pl, part ? `${g.la}, ${part.la.toLowerCase()}` : g.la, OTHER.has(gk) ? 'Powięź / troczek · ' + REGION_NAME[g.region].toLowerCase() : 'Mięsień · ' + REGION_NAME[g.region].toLowerCase());
    h += `<dl><dt>Początek</dt><dd>${esc(g.org)}</dd><dt>Przyczep końcowy</dt><dd>${esc(g.ins)}</dd><dt>Czynność</dt><dd>${esc(g.fn)}</dd><dt>Unerwienie</dt><dd>${esc(g.inn)}</dd></dl>`;
    if (patchesByGrp.get(gk)) h += `<div class="legend"><span><i class="o"></i>początek</span><span><i class="i"></i>przyczep końcowy</span><em>zaznaczone na kościach (orientacyjnie, wg modelu)</em></div>`;
    const an = ANT.get(gk); if (an && an.size) pw += `<div class="subt">Antagoniści</div><div class="chips">${[...an].sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => gchip(k)).join('')}</div>`;
    if (g.parts.length > 1) { pw += '<div class="subt">Części</div><div class="chips">'; for (const p of g.parts) pw += chip(p.pl, p.la, 'part', p.id, part && part.id === p.id ? 'on' : ''); pw += '</div>'; }
    const mj = MJ.get(gk); if (mj && mj.length) { rv += '<div class="subt">Ten mięsień wykonuje ruchy — kliknij, aby zobaczyć</div><div class="chips">' + mj.map((x) => mvChip(x.j, x.ruch, gk)).join('') + '</div>'; }
  } else if (s.t === 'bone') {
    const b = BON.get(s.id); const ls = lmsByBone.get(b.id) || [];
    h += head(b.pl, b.la, b.kind === 'ctx' ? 'Kość · kontekst' : 'Kość · ' + REGION_NAME[b.region].toLowerCase());
    h += `<p class="desc">${esc(b.d)}</p>`;
    if (ls.length) h += `<label class="chk"><input type="checkbox" id="pinsToggle" ${S.showPins ? 'checked' : ''}> Pokaż punkty kostne na modelu (${ls.length})</label>`;
    const ps = patchesByBone.get(b.id) || [];
    if (ps.length) {
      const byG = new Map(); for (const p of ps) { const k = p.grp; if (!byG.has(k) || p.role === 'o') byG.set(k, p.role); }
      const og = [...byG].filter(([, r]) => r === 'o').map(([k]) => k), ig = [...byG].filter(([, r]) => r === 'i').map(([k]) => k);
      const mk = (arr) => arr.sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => gchip(k)).join('');
      if (og.length) pw += `<div class="subt"><i class="dot o"></i>Początki mięśni</div><div class="chips">${mk(og)}</div>`;
      if (ig.length) pw += `<div class="subt"><i class="dot i"></i>Przyczepy końcowe mięśni</div><div class="chips">${mk(ig)}</div>`;
    }
    const js = JN.filter((j) => j.bones.includes(b.id));
    if (js.length) pw += `<div class="subt">Stawy z udziałem kości</div><div class="chips">${js.map((j) => chip(j.pl, j.la, 'joint', j.id, '', sdot(j))).join('')}</div>`;
    if (ls.length) pw += `<div class="subt">Punkty kostne</div><div class="chips">${[...ls].sort((a, b) => a.pl.localeCompare(b.pl, 'pl')).map((l) => chip(l.pl, l.la, 'lm', l.id)).join('')}</div>`;
  } else if (s.t === 'lm') {
    const l = LMS.get(s.id), b = BON.get(l.bone);
    h += head(l.pl, l.la, 'Punkt kostny');
    if (l.d) h += `<p class="desc">${esc(l.d)}</p>`;
    pw += `<div class="subt">Kość</div><div class="chips">${chip(b.pl, b.la, 'bone', b.id)}</div>`;
  } else if (s.t === 'str') {
    const x = STR.get(s.id);
    h += head(x.pl, x.la, `${STRTYP[x.t]} · ${REGION_NAME[x.reg].toLowerCase()}`);
    h += `<p class="desc">${esc(x.d)}</p>`;
    if (x.j && x.j.length) pw += `<div class="subt">Staw</div><div class="chips">${x.j.map((id) => chip(JMAP.get(id).pl, JMAP.get(id).la, 'joint', id, '', sdot(JMAP.get(id)))).join('')}</div>`;
    const sib = DATA.structs.filter((y) => y.t === x.t && y.reg === x.reg && y.id !== x.id && y.pl.split(' ')[0] === x.pl.split(' ')[0]).slice(0, 8);
    if (sib.length) pw += `<div class="subt">Podobne struktury</div><div class="chips">${sib.map((y) => chip(y.pl, y.la, 'str', y.id)).join('')}</div>`;
  } else if (s.t === 'joint') {
    const j = JMAP.get(s.id), sh = SHP[j.shape];
    h += head(j.pl, j.la, 'Staw · ' + REGION_NAME[j.reg].toLowerCase());
    h += `<dl><dt>Rodzaj</dt><dd>${esc(j.rodzaj)}</dd><dt>Kształt (typ)</dt><dd><i class="dotc" style="background:${sh.c}"></i><b>${esc(j.ksztalt)}</b><div class="small">${esc(sh.d)}</div></dd>`;
    h += `<dt>Liczba osi ruchu</dt><dd>${esc(j.osie)}</dd><dt>Powierzchnie stawowe</dt><dd><b>${j.n}</b> — ${esc(j.pow)}</dd>`;
    if (j.piet) h += `<dt>Piętrowy / dwujamowy</dt><dd><b>tak</b><div class="small">${PIET}</div></dd>`;
    h += `<dt>Cechy</dt><dd>${esc(j.cechy)}</dd></dl>`;
    if (j.children && j.children.length) pw += `<div class="subt">Stawy składowe</div><div class="chips">${j.children.map((c) => chip(JMAP.get(c).pl, JMAP.get(c).la, 'joint', c, '', sdot(JMAP.get(c)))).join('')}</div>`;
    if (j.parent) pw += `<div class="subt">Część stawu złożonego</div><div class="chips">${chip(JMAP.get(j.parent).pl, JMAP.get(j.parent).la, 'joint', j.parent, '', sdot(JMAP.get(j.parent)))}</div>`;
    pw += `<div class="subt">Kości</div><div class="chips">${j.bones.map((b) => chip(BON.get(b).pl, BON.get(b).la, 'bone', b)).join('')}</div>`;
    const lg = (DATA.structs || []).filter((x) => x.j && x.j.includes(j.id)); if (lg.length) pw += `<div class="subt">Więzadła i struktury stawu (${lg.length})</div><div class="chips">${lg.map((x) => chip(x.pl, x.la, 'str', x.id, '', `<i class="sdot" style="background:${STRCSS[x.t]}"></i>`)).join('')}</div>`;
    if (j.pairs.length) {
      rv += '<div class="subt">Ruchy i mięśnie (antagoniści ⇄)</div>';
      j.pairs.forEach((pr, i) => { rv += `<div class="mv"><button class="mvb" data-mv="${j.id}|${i}" title="Zaznacz oba zespoły mięśni">${esc(pr[0])} <b>⇄</b> ${esc(pr[2])}</button><div class="mvr"><span class="mvl">${esc(pr[0])}</span>${mchips(pr[1])}</div><div class="mvr"><span class="mvl">${esc(pr[2])}</span>${mchips(pr[3])}</div></div>`; });
      const pj = typeof poseJointInfo === 'function' ? poseJointInfo(j.id) : null; if (pj) rv += `<div class="btns"><button id="bPoseJ" data-j="${j.id}">🦾 Poruszaj tym stawem</button></div>`;
    } else rv += '<p class="small">Ruchomość znikoma — brak wyodrębnionych ruchów czynnych.</p>';
    h += '<div class="legend"><em>znacznik stawu jest półprzezroczysty, widoczny przez kości; torebka i krążek — w kolorze typu stawu</em></div>';
  }
  const jm = s.t === 'joint' && JMAP.get(s.id).pairs.some((p) => p[1].some(isG) || p[3].some(isG));
  const isM = s.t === 'grp' || s.t === 'part';
  h += `<div class="btns"><button id="bFocus">Przybliż</button>${isM ? '<button id="bHide" title="Ukryj ten mięsień, aby dotrzeć do głębszych (Shift+klik lub H)">Ukryj mięsień</button><button id="bIso">Ukryj resztę</button>' : ''}${s.t === 'bone' ? '<button id="bHide" title="Ukryj kość (Shift+klik lub H)">Ukryj kość</button>' : ''}${isM && ANT.has(grpOf(s)) ? '<button id="bAnt">Z antagonistami</button>' : ''}${jm ? '<button id="bJm">Pokaż mięśnie stawu</button>' : ''}<button id="bClear">Odznacz</button></div>`;
  setPanel('karta', h); setPanel('pow', pw || null); setRuchy(rv);
}
infoEl.addEventListener('click', (e) => {
  const t = e.target;
  const at = t.closest('[data-at]'); if (at && S.ana) { S.ana.tab = at.dataset.at; S.ana.focus = null; S.ana.cause = null; apply(); renderAna(); anaFly(); return; }
  const ac = t.closest('[data-ac]'); if (ac && S.ana) { const i = +ac.dataset.ac; S.ana.cause = S.ana.cause === i ? null : i; S.ana.focus = null; apply(); renderAna(true); anaFly(); return; }
  const ak = t.closest('[data-ak]'); if (ak && S.ana) { S.ana.focus = ak.dataset.ak; apply(); renderAna(true); const o = G[ak.dataset.ak].ids.map((i) => O('mus', i, defSide())); focusObjects(o, null, 0.14); return; }
  const ai = t.closest('[data-ai]'); if (ai) { select({ t: 'grp', id: ai.dataset.ai }); return; }
  if (t.closest('#anaClose')) { closeAna(); return; }
  if (t.closest('#anaNew')) { openAna(S.ana ? S.ana.q : ''); return; }
  if (t.closest('#anaFocus')) { anaFly(); return; }
  if (t.closest('#bClear')) { select(null); return; }
  if (t.closest('#bHide')) { const s0 = S.sel; if (s0 && s0.t === 'bone') hideBone(s0.id); else if (s0) hideMuscle(grpOf(s0)); return; }
  const mvj = t.closest('[data-mvj]'); if (mvj) { const [jid, ruch, gk] = mvj.dataset.mvj.split('|'); moveShow(jid, ruch, gk); return; }
  const mjt = t.closest('[data-mjt]'); if (mjt) { const id = mjt.dataset.mjt; if (moveOpen.has(id)) moveOpen.delete(id); else moveOpen.add(id); renderRuchy(); return; }
  if (t.closest('#bPoseJ')) { if (typeof poseOpenJoint === 'function') poseOpenJoint(t.closest('#bPoseJ').dataset.j); return; }
  if (t.closest('#bFocus')) { const s = S.sel; S.sel = null; select(s); return; }
  if (t.closest('#bIso')) { S.ghostBg = false; S.layers.bones = true; const s = S.sel; $('#ghostBg').checked = false; const gk = grpOf(s); clearVis(); for (const k of Object.keys(G)) if (k !== gk) S.hidden.add(k); renderList(); apply(); return; }
  if (t.closest('#bAnt')) { const k = grpOf(S.sel); setMulti([[k, 0], ...[...ANT.get(k)].map((a) => [a, 1])]); return; }
  if (t.closest('#bJm')) { const j = JMAP.get(S.sel.id); const m = new Map(); for (const pr of j.pairs) { for (const k of pr[1].filter(isG)) m.set(k, 0); } for (const pr of j.pairs) for (const k of pr[3].filter(isG)) if (!m.has(k)) m.set(k, 1); setMulti([...m]); return; }
  const mv = t.closest('[data-mv]'); if (mv) { const [jid, i] = mv.dataset.mv.split('|'); const pr = JMAP.get(jid).pairs[+i]; const m = new Map(); for (const k of pr[1].filter(isG)) m.set(k, 0); for (const k of pr[3].filter(isG)) if (!m.has(k)) m.set(k, 1); if (m.size) setMulti([...m]); return; }
  if (t.closest('#bMultiOff')) { exitMulti(); return; }
  if (t.closest('#bMultiClear')) { S.multi.clear(); apply(); renderInfo(); markList(); return; }
  if (t.closest('#bMultiFocus')) { focusObjects([...S.multi.keys()].flatMap((k) => G[k].ids.map((i) => O('mus', i, defSide()))), null, 0.16); return; }
  if (t.closest('#bAddAnt')) { for (const k of [...S.multi.keys()]) for (const a of ANT.get(k) || []) if (!S.multi.has(a)) S.multi.set(a, 1); apply(); renderInfo(); markList(); return; }
  const rm = t.closest('[data-rm]'); if (rm) { S.multi.delete(rm.dataset.rm); apply(); renderInfo(); markList(); return; }
  const c = t.closest('[data-t]'); if (c && (c.classList.contains('chip') || c.classList.contains('cn'))) { if (S.multiMode && c.dataset.t === 'grp') { if (!S.multi.has(c.dataset.id)) toggleMulti(c.dataset.id, undefined, { noFly: true }); return; } select({ t: c.dataset.t, id: c.dataset.id }); return; }
});
infoEl.addEventListener('change', (e) => { if (e.target.id === 'pinsToggle') { S.showPins = e.target.checked; updatePins(); dirty(); } });


/* ---------- panel „Poza”: suwaki stawów w zakresach ruchu zdrowego człowieka ---------- */
const PRESETS = [
  ['Pozycja anatomiczna', {}],
  ['Ręka w górze — zgięcie 180°', { F: 180 }],
  ['Ręka w górze — odwodzenie 180°', { A: 180 }],
  ['Ramię w bok 90°', { A: 90 }],
  ['Ramię do przodu 90°', { F: 90 }],
  ['Łokieć 90° — płaszczyzna strzałkowa', { E: 90 }],
  ['Łokieć 90° — płaszczyzna poprzeczna', { A: 90, R: 0, E: 90 }],
  ['Ręka w górze, łokieć 90° („stop”)', { A: 90, E: 90 }],
  ['Dłoń do barku', { E: 145, F: 20 }],
  ['Ręka za plecami (wyprost)', { F: -55, R: 40 }],
];
const poseTarget = (p) => { const t = { ...REST, ...p }; if (!('R' in p)) delete t.R; return t; }; // bez jawnego R: skręt naturalny (liczy silnik)
const fmtDeg = (d, v) => { const a = Math.round(Math.abs(v)); if (a === 0) return '0°'; return `${a}° ${v >= 0 ? d.pos : d.neg}`; };
const HATCH = 'repeating-linear-gradient(45deg,#272c37,#272c37 3px,#5b6372 3px,#5b6372 5px)';
function trackBg(d, L) { // zielone = norma, bursztynowe = do maksymalnego zdrowego zakresu, szare = niedostępne w tej pozie, kreska = 0°
  const pc = (x) => ((x - d.min) / (d.max - d.min) * 100).toFixed(2), z = pc(0);
  const base = `linear-gradient(90deg,#d8a13a ${pc(d.nmin)}%,#4da96a ${pc(d.nmin)}%,#4da96a ${pc(d.nmax)}%,#d8a13a ${pc(d.nmax)}%)`;
  const zero = `linear-gradient(90deg,transparent calc(${z}% - 1px),#000c calc(${z}% - 1px),#000c calc(${z}% + 1px),transparent calc(${z}% + 1px))`;
  if (!L) return `${zero},${base}`;
  const lw = Math.max(0, pc(L[0])), rw = Math.max(0, 100 - pc(L[1]));
  return `${HATCH} left/${lw}% 100% no-repeat,${HATCH} right/${rw}% 100% no-repeat,${zero},${base}`;
}
let poseBuilt = false, poseBadge = null;
function renderPose() {
  let h = '<p class="small">Poruszaj stawami w zakresach ruchu zdrowego człowieka. <b>0° = pozycja anatomiczna modelu.</b> Mięśnie odkształcają się razem z kośćmi (skinning z zachowaniem grubości, wagi rozłożone wzdłuż mięśnia, owijanie wokół kości). Poza działa symetrycznie na obie ręce.</p>';
  h += `<label class="chk"><input type="checkbox" id="pRhythm" ${POSE.rhythm ? 'checked' : ''}> Rytm łopatkowo-ramienny (łopatka i obojczyk podążają za ramieniem)</label>`;
  h += `<label class="chk"><input type="checkbox" id="pWrap" ${POSE.st.wrap ? 'checked' : ''}> Owijanie mięśni wokół kości (kolizje z główką kości ramiennej, łopatką, żebrami)</label>`;
  h += `<div class="subt">Gotowe pozy</div><div class="chips">${PRESETS.map(([n], i) => `<button class="chip" data-preset="${i}">${esc(n)}</button>`).join('')}</div>`;
  let g = '';
  for (const d of DOF) {
    if (d.g !== g) { g = d.g; h += `<div class="subt pg" data-pg="${esc(g)}">${esc(g)}</div>`; }
    const maxl = `${esc(d.neg)} ${Math.abs(d.min)}° · ${esc(d.pos)} ${d.max}°`;
    h += `<div class="prow" data-k="${d.k}"><div class="pl"><b>${esc(d.n)}</b><span class="pv" id="pv-${d.k}"></span></div><input type="range" class="psl" data-k="${d.k}" min="${d.min}" max="${d.max}" step="1" value="${POSE.vals[d.k]}" aria-label="${esc(d.n)}" style="--bg:${trackBg(d)}"><div class="pe"><span>◀ ${esc(d.neg)} ${Math.abs(d.min)}°</span><span>${esc(d.pos)} ${d.max}° ▶</span></div><div class="pn">🟩 norma: ${esc(d.norm)}<br>🟧 maks. zdrowy: ${maxl}${d.k === 'R' || d.k === 'A' ? ' <i>(zależny od pozycji — szare pola = niedostępne teraz)</i>' : ''}</div></div>`;
  }
  h += '<div class="btns"><button id="pReset" class="pri">Reset pozy</button><button id="pLat" title="Widok z boku — dobry do zgięcia i wyprostu">Widok z boku</button><button id="pFront" title="Widok z przodu — dobry do odwodzenia">Widok z przodu</button></div>';
  h += '<p class="small"><b>Zielone</b> pole suwaka = norma (typowy zdrowy dorosły), <b>bursztynowe</b> = do maksymalnego zdrowego zakresu (AAOS / Kapandji, ruch bierny do końca). Granice rotacji i przywiedzenia zależą od pozycji ramienia (szare pola). Obojczyk i łopatka poruszają się automatycznie (rytm ok. 2:1) lub ręcznie suwakami „Obręcz barkowa”. Palce pozostają w spoczynku.</p>';
  setPanel('poza', h, { keep: true, quiet: true }); poseBuilt = true; syncPoseUI();
}
function syncPoseUI() {
  if (!poseBuilt) { layoutPanels(); return; }
  const root = pEl.poza; if (!root) return;
  for (const d of DOF) {
    const sl = $(`input.psl[data-k="${d.k}"]`, root), v = POSE.vals[d.k]; if (!sl) continue;
    if (document.activeElement !== sl) sl.value = v; const pv = $(`#pv-${d.k}`, root); if (pv) pv.textContent = fmtDeg(d, v);
  }
  const L = POSE.limits(); for (const k of ['R', 'A']) { const d = DOF.find((x) => x.k === k), sl = $(`input.psl[data-k="${k}"]`, root); if (sl) sl.style.setProperty('--bg', trackBg(d, L[k])); }
  const rb = $('#pRhythm', root); if (rb) rb.checked = POSE.rhythm;
  layoutPanels();
}
infoEl.addEventListener('input', (e) => { const sl = e.target.closest('input.psl'); if (!sl) return; POSE.set({ [sl.dataset.k]: +sl.value }); const d = DOF.find((x) => x.k === sl.dataset.k); const v = POSE.vals[d.k]; sl.value = v; const pv = $(`#pv-${d.k}`, pEl.poza); if (pv) pv.textContent = fmtDeg(d, v); });
infoEl.addEventListener('change', (e) => { if (e.target.id === 'pRhythm') POSE.setRhythm(e.target.checked); else if (e.target.id === 'pWrap') POSE.setWrap(e.target.checked); });
infoEl.addEventListener('click', (e) => {
  const t = e.target; const pr = t.closest('[data-preset]');
  if (pr) { const p = PRESETS[+pr.dataset.preset]; POSE.animateTo(poseTarget(p[1]), 900); toast(p[0]); return; }
  if (t.closest('#pReset')) { POSE.animateTo({ ...REST }, 700); return; }
  if (t.closest('#pLat')) { viewRegion('lat'); return; } if (t.closest('#pFront')) { viewRegion('front'); return; }
});
/* ---------- panel „Testy”: ruch → pozycja → podejrzane mięśnie przy bólu ---------- */
let testZone = 'all', testOpen = null;
const TKIND = { 'z oporem': 'z oporem (izometrycznie)', czynny: 'ruch czynny', bierny: 'ruch bierny' };
function renderTests() {
  const list = TESTS.filter((t) => testZone === 'all' || t.zones.includes(testZone));
  let h = `<p class="small">${TEST_INTRO}</p><div class="subt">Gdzie boli?</div><div class="chips">${TEST_ZONES.map(([k, n]) => `<button class="chip${k === testZone ? ' sel' : ''}" data-tz="${k}">${esc(n)}</button>`).join('')}</div>`;
  h += `<div class="subt">${list.length} ${list.length === 1 ? 'test' : 'testów'}</div>`;
  let g = '';
  for (const t of list) {
    if (t.g !== g) { g = t.g; h += `<div class="subt pg">${esc(g)}</div>`; }
    h += `<details class="tcard" data-test="${t.id}"${testOpen === t.id ? ' open' : ''}><summary><b>${esc(t.n)}</b><span class="tk">${esc(TKIND[t.kind] || t.kind)}</span></summary><div class="tb">`
      + `<p class="small"><b>Jak wykonać:</b> ${esc(t.how)}</p>`
      + `<div class="btns"><button class="pri" data-tpose="${t.id}">▶ Pokaż w pozie</button><button data-tmus="${t.id}">🎯 Same mięśnie</button></div>`
      + `<div class="subt">Jeśli boli — podejrzane mięśnie</div><div class="chips">${t.main.map((k) => gchip(k, 'sel')).join('')}${t.sec.map((k) => gchip(k)).join('')}</div>`
      + `<p class="small"><b>Główne</b> (wypełnione) i <b>współpracujące</b>.</p><p class="small">${esc(t.pain)}</p>`
      + (t.alt ? `<p class="small"><b>Pomyśl też o:</b> ${esc(t.alt)}</p>` : '') + '</div></details>';
  }
  h += `<p class="small">${esc(TEST_DISCLAIMER)}</p>`;
  setPanel('testy', h, { keep: true, quiet: true });
}
const testMuscles = (t, fly) => setMulti([...t.main.map((k) => [k, 0]), ...t.sec.filter((k) => !t.main.includes(k)).map((k) => [k, 1])], fly);
infoEl.addEventListener('click', (e) => {
  const t = e.target, z = t.closest('[data-tz]');
  if (z) { testZone = z.dataset.tz; renderTests(); return; }
  const dtl = t.closest('.tcard'); if (dtl) testOpen = dtl.dataset.test;
  const bp = t.closest('[data-tpose]'), bm = t.closest('[data-tmus]');
  if (bp) { const x = TESTS.find((q) => q.id === bp.dataset.tpose); testMuscles(x, false); POSE.animateTo(poseTarget(x.pose), 900); toast(x.n); if (S.box || true) setTimeout(() => viewRegion(x.view || 'front'), 60); return; }
  if (bm) { testMuscles(TESTS.find((q) => q.id === bm.dataset.tmus), true); return; }
});
// powiązanie mięśni i stawów z ruchem: nazwa ruchu → docelowe kąty
function poseMoveFor(j, ruch) {
  const r = norm(ruch), has = (x) => r.includes(x);
  const gh = ['J_ghj'], el = ['J_lok', 'J_hu', 'J_hr'], pr = ['J_pru', 'J_dru', 'J_lok', 'J_hr'], wr = ['J_rcj', 'J_mcj'], gd = ['J_scj', 'J_acj'];
  if (gh.includes(j)) { if (has('zgiecie')) return { F: 140 }; if (has('wyprost')) return { F: -45 }; if (has('odwodz')) return { A: 120 }; if (has('przywodz')) return { A: -25 }; if (has('zewn')) return { R: -70, E: 90 }; if (has('wewn')) return { R: 55, E: 90 }; }
  if (has('nawroc') || has('pronac')) return pr.includes(j) ? { E: 90, Pr: 55 } : null;
  if (has('odwroc') || has('supinac')) return pr.includes(j) ? { E: 90, Pr: -90 } : null;
  if (el.includes(j)) { if (has('zgiecie')) return { E: 125 }; if (has('wyprost')) return { E: 0 }; }
  if (wr.includes(j)) { if (has('dloniow')) return { wFE: 65 }; if (has('grzbiet') || has('wyprost')) return { wFE: -55 }; if (has('promien')) return { wDev: -15 }; if (has('lokciow')) return { wDev: 25 }; }
  if (gd.includes(j)) { if (has('unoszen')) return { gElev: 30 }; if (has('opuszcz')) return { gElev: -8 }; if (has('protrak')) return { gProt: 22 }; if (has('retrak')) return { gProt: -16 }; }
  return null;
}
const poseJointInfo = (jid) => (['J_ghj', 'J_lok', 'J_hu', 'J_hr', 'J_pru', 'J_dru', 'J_rcj', 'J_mcj', 'J_scj', 'J_acj'].includes(jid) ? true : null);
function poseDemo(jid, ruch, gk) {
  const tg = poseMoveFor(jid, ruch); if (!tg) { toast('Ten ruch nie ma jeszcze animacji.'); return; }
  showPanel('poza'); renderPose();
  if (gk && G[gk]) { S.sel = { t: 'grp', id: gk }; S.hidden.delete(gk); apply(); renderInfo(); markList(); }
  POSE.animateTo(poseTarget(tg), 900); toast(`${ruch} (${JMAP.get(jid).pl})`);
  const side = /zgiecie|wyprost|protrak|retrak/.test(norm(ruch)) ? 'lat' : /odwodz|przywodz|unoszen|opuszcz/.test(norm(ruch)) ? 'front' : null; if (side && S.box) viewRegion(side);
}
/* ---------- komplet ruchów (wszystkie stawy) ---------- */
const moveOpen = new Set(); let ruchyRv = '';
const mvChip = (jid, ruch, gk = '') => `<button class="chip mvp" data-mvj="${jid}|${esc(ruch)}|${gk}" title="${poseMoveFor(jid, ruch) ? 'Pokaż ruch na modelu' : 'Pokaż mięśnie wykonujące ruch'}">${poseMoveFor(jid, ruch) ? '▶' : '◎'} ${esc(ruch)} <small>(${esc(JMAP.get(jid).pl)})</small></button>`;
function movesCatalog() {
  let h = '<div class="subt">Wszystkie ruchy — rozwiń staw, kliknij ruch</div><p class="small">▶ pokazuje ruch na modelu · ◎ pokazuje mięśnie, które go wykonują.</p>';
  for (const r of REG_ORDER) {
    const js = JN.filter((j) => j.reg === r && j.pairs.length); if (!js.length) continue;
    h += `<div class="mvreg">${esc(REGION_NAME[r])}</div>`;
    for (const j of js) {
      const open = moveOpen.has(j.id);
      h += `<div class="mvj"><button class="mvh${open ? ' open' : ''}" data-mjt="${j.id}">${open ? '▾' : '▸'} ${esc(j.pl)}</button>`;
      if (open) for (const pr of j.pairs) for (const [ruch, mus] of [[pr[0], pr[1]], [pr[2], pr[3]]]) {
        h += `<div class="mvr"><button class="chip mvp" data-mvj="${j.id}|${esc(ruch)}|">${poseMoveFor(j.id, ruch) ? '▶' : '◎'} ${esc(ruch)}</button><div class="mvm">${mus.map((k) => (isG(k) ? gchip(k) : `<span class="small">${esc(k)}</span>`)).join('')}</div></div>`;
      }
      h += '</div>';
    }
  }
  return h;
}
const renderRuchy = (opts = {}) => setPanel('ruchy', (ruchyRv || '') + movesCatalog(), { keep: opts.keep !== false, quiet: true });
function setRuchy(rv) { ruchyRv = rv || ''; setPanel('ruchy', ruchyRv + movesCatalog(), { quiet: true }); }
async function moveShow(jid, ruch, gk) {
  const j = JMAP.get(jid), pr = j && j.pairs.find((p) => p[0] === ruch || p[2] === ruch); if (!pr) return;
  const first = pr[0] === ruch, ag = (first ? pr[1] : pr[3]).filter(isG), dof = poseMoveFor(jid, ruch);
  if (dof && gk && G[gk]) { poseDemo(jid, ruch, gk); return; }
  S.region = 'all'; $$('#regions button').forEach((x) => x.classList.toggle('on', x.dataset.r === 'all'));
  S.layers.muscles = true; S.layers.bones = true; $('#lMus').checked = true; $('#lBones').checked = true;
  const regs = new Set(ag.map((k) => G[k].region));
  if (regs.has('tulow') || regs.has('bark') || regs.has('podudzie')) { S.layers.ctx = true; $('#lCtx').checked = true; }
  if (regs.has('glowa')) { S.layers.skull = true; $('#lSkull').checked = true; }
  if (window.innerWidth < 820) closeDrawer();
  toast(`${ruch} — ${j.pl}`);
  await Promise.all([regs.has('tulow') || regs.has('podudzie') ? ensureTrunk() : null, regs.has('podudzie') ? ensureLeg() : null, regs.has('glowa') ? ensureAxial() : null]);
  if (ag.length) setMulti(ag.map((k) => [k, 0]), !dof);
  if (dof) { showPanel('poza'); renderPose(); POSE.animateTo(poseTarget(dof), 900); const side = /zgiecie|wyprost|protrak|retrak/.test(norm(ruch)) ? 'lat' : /odwodz|przywodz|unoszen|opuszcz/.test(norm(ruch)) ? 'front' : null; if (side && S.box) setTimeout(() => viewRegion(side), 60); }
}
function poseOpenJoint(jid) {
  showPanel('poza'); renderPose();
  const g = ({ J_ghj: 'Staw ramienny', J_lok: 'Łokieć', J_hu: 'Łokieć', J_hr: 'Łokieć', J_pru: 'Przedramię', J_dru: 'Przedramię', J_rcj: 'Nadgarstek', J_mcj: 'Nadgarstek', J_scj: 'Obręcz barkowa', J_acj: 'Obręcz barkowa' })[jid];
  const el = g && $(`[data-pg="${g}"]`, pEl.poza); if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
function showMusclePose(k) {
  const mj = MJ.get(k) || []; for (const x of mj) if (poseMoveFor(x.j, x.ruch)) { poseDemo(x.j, x.ruch, k); return; }
  toast('Dla tego mięśnia nie ma jeszcze animacji ruchu (obejmuje kończynę górną).');
}

/* ---------- panel Widoczność ---------- */
function renderVisPanel() {
  const row = (kind, id, pl, la, col) => `<div class="vrow"><i class="dotc" style="background:${col}"></i><span class="vn">${esc(pl)} <small>(${esc(la)})</small></span><button data-vr="${kind}|${id}" title="Pokaż ponownie">Pokaż</button></div>`;
  const hm = [...S.hidden].sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')), hb = [...S.hiddenB].sort((a, b) => BON.get(a).pl.localeCompare(BON.get(b).pl, 'pl'));
  const gh = [...S.ghosted], fo = [...S.focused];
  let h = `<p class="small"><b>Shift + klik</b> na modelu ukrywa mięsień pod kursorem — odsłaniasz głębszy. <b>PPM</b> = menu, <b>H</b> ukrywa zaznaczony, <b>Ctrl+Z</b> cofa.</p>`;
  h += `<div class="btns"><button id="vUndo"${S.undo.length ? '' : ' disabled'}>↶ Cofnij</button><button id="vAll"${hiddenCount() ? '' : ' disabled'}>Pokaż wszystkie ukryte</button><button id="vReset"${hiddenCount() + gh.length + fo.length ? '' : ' disabled'}>Reset widoczności</button></div>`;
  h += `<div class="subt">Ukryte mięśnie (${hm.length})</div>${hm.length ? hm.map((k) => row('m', k, G[k].pl, G[k].la, OTHER.has(k) ? '#d9c39a' : G[k].col)).join('') : '<p class="small">Brak — kliknij mięsień z Shiftem, aby go ukryć.</p>'}`;
  if (hb.length) h += `<div class="subt">Ukryte kości (${hb.length})</div>${hb.map((k) => row('b', k, BON.get(k).pl, BON.get(k).la, '#e9e0c9')).join('')}`;
  if (gh.length) h += `<div class="subt">Tło — półprzezroczyste (${gh.length})</div><div class="chips">${gh.map((k) => `<button class="chip" data-vset="${k}|v" title="Przywróć">${esc(G[k].pl)} ✕</button>`).join('')}</div>`;
  if (fo.length) h += `<div class="subt">Wyróżnione (${fo.length})</div><div class="chips">${fo.map((k) => `<button class="chip" data-vset="${k}|v" title="Zdejmij wyróżnienie">${esc(G[k].pl)} ✕</button>`).join('')}</div>`;
  setPanel('wid', h, { keep: true, quiet: true }); layoutPanels();
}
infoEl.addEventListener('click', (e) => {
  const t = e.target; const vr = t.closest('[data-vr]'); if (vr) { const [kind, id] = vr.dataset.vr.split('|'); restoreOne(kind, id); return; }
  const vs = t.closest('[data-vset]'); if (vs) { const [k, v] = vs.dataset.vset.split('|'); setVis(k, v); renderVisPanel(); return; }
  if (t.closest('#vUndo')) { undoVis(); return; } if (t.closest('#vAll')) { showAllHidden(); return; }
  if (t.closest('#vReset')) { clearVis(); afterVisChange(); return; }
});

/* ---------- analiza objawów (offline, bez AI) ---------- */
const anaAllKeys = (a) => [...new Set([...a.res.miesnie, ...a.res.oslabione, ...a.res.rozciagac, ...(a.res.poz ? a.res.poz.miesnie : []), ...a.res.przyczyny.flatMap((c) => (c.m || []).map(([k]) => ({ k })))].map((x) => x.k))];
function anaItems() { // klucz grupy -> { em: poświata, op: krycie, p: RegExp części mięśnia | null }
  const a = S.ana; if (!a) return null; const m = new Map(); const r = a.res;
  const put = (k, em, op = 1, p = '') => m.set(k, { em, op, p: p ? new RegExp(p, 'i') : null });
  if (a.tab === 'w') for (const x of r.oslabione) put(x.k, 0.3);
  else if (a.tab === 'r') for (const x of r.rozciagac) put(x.k, 0.3);
  else if (a.tab === 'z' && r.poz) for (const x of r.poz.miesnie) put(x.k, { g: 0.34, p: 0.2, s: 0.08 }[x.rola], x.rola === 's' ? 0.85 : 1, x.p);
  else if (a.tab === 'p' && a.cause != null && r.przyczyny[a.cause]) for (const [k, w, p] of r.przyczyny[a.cause].m || []) put(k, { 3: 0.34, 2: 0.2, 1: 0.08 }[w], w === 1 ? 0.85 : 1, p);
  else for (const x of r.miesnie) put(x.k, 0.08 + 0.3 * Math.min(1, x.pct / 60), x.pct < 22 ? 0.85 : 1, x.p);
  if (a.focus && m.has(a.focus)) { const v = m.get(a.focus); m.set(a.focus, { ...v, em: 0.6, op: 1 }); }
  return m;
}
const anaColors = () => anaItems();
function anaParts() { const m = new Map(); const it = anaItems(); if (it) for (const [k, v] of it) if (v.p) m.set(k, v.p); return m; }
function anaFly() {
  const ac = anaColors(), ap = anaParts(); if (!ac || !S.ana) return; const list = [];
  for (const SD of activeSides()) for (const k of ac.keys()) { const pr = ap.get(k); for (const i of G[k].ids) { const o = SD.mus.get(i); if (o && (!pr || pr.test(MUS.get(i).en))) list.push(o); } }
  const dir = new THREE.Vector3(...DIRS[{ przod: 'front', tyl: 'back', bok: 'lat' }[S.ana.res.widok] || 'back']); if (S.side === 'l' && dir.x) dir.x *= -1;
  focusObjects(list, dir, 0.2);
}
const LAB = (p) => (p >= 40 ? 'bardzo prawdopodobne' : p >= 22 ? 'prawdopodobne' : 'możliwe');
function renderAna(keep) {
  const a = S.ana, r = a.res;
  const tabs = [['p', 'Przyczyny'], ['m', 'Mięśnie'], ['w', `Wzmocnić (${r.oslabione.length})`], ['r', `Rozciągać (${r.rozciagac.length})`]]; if (r.poz) tabs.push(['z', 'Pozycja']);
  const dot = (k) => (OTHER.has(k) ? '#d9c39a' : G[k].col);
  const nm = (k) => `<button class="an" data-ak="${k}"><i class="dotc" style="background:${dot(k)}"></i>${esc(G[k].pl)} <small>(${esc(G[k].la)})</small></button><button class="ai" data-ai="${k}" title="Karta mięśnia" aria-label="Karta mięśnia">ⓘ</button>`;
  let h = `<div class="ihead"><div><div class="itag">Analiza objawów · działa offline, bez AI</div><h2>${esc(r.pozycja)}</h2><div class="ila">${esc(r.okolica)}</div></div></div>`;
  h += `<p class="desc">${esc(r.podsumowanie)}</p><div class="atabs">${tabs.map(([k, n]) => `<button data-at="${k}" class="${a.tab === k ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>`;
  if (a.tab === 'p') {
    h += '<div class="subt">Możliwe przyczyny — prawdopodobieństwo</div><p class="small">Kliknij przyczynę, aby zobaczyć jej mięśnie na modelu.</p>';
    r.przyczyny.forEach((x, i) => { h += `<div class="arow cause ${a.cause === i ? 'on' : ''}" data-ac="${i}"><div class="atop"><b class="ctit">${esc(x.t)}</b><span class="apct">${x.pct}%</span></div><div class="abar"><i style="width:${Math.min(100, x.pct * 1.6)}%;background:var(--acc)"></i></div><div class="asub">${esc(x.dlaczego)}</div></div>`; });
    h += '<p class="small">% = szacunek: częstość danej przyczyny w tej okolicy × zaznaczone czynniki, znormalizowany do 100% (pokazane są przyczyny ≥ 4%). To heurystyka edukacyjna, nie diagnoza.</p>';
  } else if (a.tab === 'm') {
    h += '<div class="subt">Mięśnie, które mogą boleć — szansa zaangażowania</div>';
    for (const x of r.miesnie) h += `<div class="arow ${a.focus === x.k ? 'on' : ''}"><div class="atop">${nm(x.k)}<span class="apct">${x.pct}%</span></div><div class="abar"><i style="width:${Math.min(100, x.pct * 1.6)}%;background:${dot(x.k)}"></i></div><div class="asub"><span class="tr">${LAB(x.pct)}</span> ${esc(x.opis)}</div></div>`;
    h += '<p class="small">% = szansa, że mięsień uczestniczy w dolegliwości (suma po przyczynach, nie sumuje się do 100%). Kolor kropki = kolor mięśnia na modelu.</p>';
  } else if (a.tab === 'w') {
    h += '<div class="subt">Mięśnie do wzmocnienia (od najważniejszych)</div>';
    for (const x of r.oslabione) h += `<div class="arow ${a.focus === x.k ? 'on' : ''}"><div class="atop">${nm(x.k)}</div><div class="asub">${esc(x.dlaczego)}</div><div class="aex">💪 ${esc(x.cwiczenie)}</div>${x.przez && x.przez.length ? `<div class="asub by">Dotyczy: ${esc(x.przez.join('; '))}</div>` : ''}</div>`;
    if (!r.oslabione.length) h += '<p class="small">Brak wskazań do wzmacniania — to przypadek do oceny lekarza / dentysty.</p>';
    h += '<p class="small">Zacznij od lżejszych wariantów, bez bólu ostrego; progresję ustal z fizjoterapeutą.</p>';
  } else if (a.tab === 'r') {
    h += '<div class="subt">Mięśnie do rozciągania / rozluźnienia</div>';
    for (const x of r.rozciagac) h += `<div class="arow ${a.focus === x.k ? 'on' : ''}"><div class="atop">${nm(x.k)}</div><div class="aex">🧘 ${esc(x.jak)}</div>${x.przez && x.przez.length ? `<div class="asub by">Dotyczy: ${esc(x.przez.join('; '))}</div>` : ''}</div>`;
    if (!r.rozciagac.length) h += '<p class="small">Brak wskazań.</p>';
    h += '<p class="small">Rozciągaj do lekkiego napięcia — bez bólu; przy ostrym bólu najpierw odpoczynek.</p>';
  } else if (a.tab === 'z' && r.poz) {
    const z = r.poz;
    h += `<div class="subt">${esc(z.pozycja)}</div><p class="small">${esc(z.podsumowanie)}</p><div class="legend aleg">${['g', 'p', 's'].map((k) => `<span>${ROLA[k][0]}</span>`).join('')}</div>`;
    for (const k of ['g', 'p', 's']) {
      const xs = z.miesnie.filter((x) => x.rola === k); if (!xs.length) continue;
      h += `<div class="subt">${{ g: 'Główna praca', p: 'Mięśnie pomocnicze', s: 'Stabilizatory' }[k]} · ${xs.reduce((q, x) => q + x.pct, 0)}%</div>`;
      for (const x of xs) h += `<div class="arow ${a.focus === x.k ? 'on' : ''}"><div class="atop">${nm(x.k)}<span class="apct">${x.pct}%</span></div><div class="abar"><i style="width:${Math.min(100, x.pct * 3.2)}%;background:${dot(x.k)}"></i></div><div class="asub"><span class="tr">${esc(TRYB[x.tryb][0])}</span> ${esc(x.opis)}</div></div>`;
    }
    h += '<p class="small">% = szacowany udział mięśnia w napięciu/pracy w tej pozycji (suma = 100%) — oszacowanie edukacyjne, nie pomiar EMG.</p>';
  }
  if (r.alarm.length) h += `<div class="alarm"><b>⚠ Kiedy do lekarza:</b><ul>${r.alarm.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  h += '<p class="small">Narzędzie edukacyjne — nie jest diagnozą ani poradą medyczną. Przy bólu, który narasta, nie mija lub ma towarzyszące objawy, skonsultuj się z lekarzem lub fizjoterapeutą.</p>';
  h += `<div class="btns"><button id="anaFocus">Przybliż</button><button id="anaNew">Nowa analiza</button><button id="anaClose2" class="pri">Zamknij analizę</button></div>`;
  setPanel('ana', h, { keep: !!keep });
}
function closeAna() { S.ana = null; PS.ana.on = false; savePanels(); setPanel('ana', null, { quiet: true }); apply(); renderInfo(); markList(); }
infoEl.addEventListener('click', (e) => { if (e.target.closest('#anaClose2')) closeAna(); });

// formularz: okolica + czynniki + strona + opis własnymi słowami
const AF = { area: null, trig: new Set(), side: 'b', auto: false };
const anaAreaOf = (id) => AREAS.find((x) => x.id === id);
function anaFormHTML() {
  const A = AF.area ? anaAreaOf(AF.area) : null;
  return `<div class="subt">1. Gdzie boli?</div><div class="achips" id="anaAreas">${AREAS.map((a) => `<button class="achip ${AF.area === a.id ? 'on' : ''}" data-aarea="${a.id}">${a.e} ${esc(a.n)}</button>`).join('')}</div>
  <div class="subt">2. Kiedy boli / co nasila? <small>(zaznacz wszystko, co pasuje)</small></div>
  <div class="achips" id="anaTrig">${A ? A.tr.map((t) => `<button class="achip tr ${AF.trig.has(t) ? 'on' : ''}" data-atrig="${t}">${esc(TRIG[t][0])}</button>`).join('') : '<span class="small">Wybierz okolicę — pokażę pasujące czynniki.</span>'}</div>
  <div class="subt">3. Strona</div><div class="achips" id="anaSide">${[['r', 'Prawa'], ['l', 'Lewa'], ['b', 'Obie']].map(([k, n]) => `<button class="achip ${AF.side === k ? 'on' : ''}" data-aside="${k}">${n}</button>`).join('')}</div>`;
}
function refreshForm() { const f = $('#anaForm'); if (f) f.innerHTML = anaFormHTML(); }
const anaInputHTML = (q = '', err = '') => `<h3>🔎 Analiza objawów</h3><p class="small">Wybierz okolicę i zaznacz, co się dzieje — albo opisz ból własnymi słowami (rozpoznam okolicę i czynniki). Wynik: prawdopodobne przyczyny (%), mięśnie na modelu, co wzmocnić i co rozciągać. Działa w przeglądarce, bez AI.</p>${err ? `<div class="anote">${esc(err)}</div>` : ''}
<div id="anaForm">${anaFormHTML()}</div>
<div class="subt">Opis własnymi słowami <small>(opcjonalnie — uzupełni wybór powyżej)</small></div>
<textarea id="anaQ" rows="3" maxlength="1000" placeholder="np. Boli mnie kolano przy schodzeniu po schodach i po długim siedzeniu…">${esc(q)}</textarea>
<div class="btns"><button id="anaGo" class="pri">Analizuj</button></div>
<details class="aex2"><summary>Przykłady (kliknij, aby wstawić)</summary><div class="achips">${SYMPTOM_EXAMPLES.map((t) => `<button class="achip ex" data-aex="${esc(t)}">${esc(t)}</button>`).join('')}</div><div class="subt">Pozycje i ruchy — rozkład pracy mięśni</div><div class="achips">${POS_EXAMPLES.map((x) => `<button class="achip ex" data-aex="${esc(x.text)}">${esc(x.text)}</button>`).join('')}</div></details>`;
function openAna(q = '', err = '') { showModal(anaInputHTML(q, err)); setTimeout(() => { const t = $('#anaQ'); if (t && !AF.area) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } }, 60); }
function fillFromText(txt, force) { // podgląd rozpoznanej okolicy i czynników
  const p = parseText(txt);
  if (force || AF.auto || !AF.area) { if (p.area !== AF.area) AF.trig = new Set(); AF.area = p.area; AF.auto = true; }
  if (p.area && p.area === AF.area) for (const x of p.triggers) AF.trig.add(x);
  if (p.side && p.side !== 'b') AF.side = p.side;
  refreshForm();
}
let fillT = null;
async function showAna(res, q) {
  if (!res || !res.miesnie.length) { openAna(q, 'Nie udało się wskazać mięśni dla tego opisu — wybierz okolicę lub opisz dokładniej.'); return; }
  exitMulti(true); S.sel = null; clearVis();
  S.ana = { res, q, tab: 'p', cause: null, focus: null };
  S.side = AF.side || 'b'; $$('#sides button').forEach((b) => b.classList.toggle('on', b.dataset.s === S.side));
  S.region = 'all'; $$('#regions button').forEach((x) => x.classList.toggle('on', x.dataset.r === 'all'));
  S.layers.muscles = true; S.layers.bones = true; $('#lMus').checked = true; $('#lBones').checked = true;
  const regs = new Set(anaAllKeys(S.ana).map((k) => G[k].region));
  if (regs.has('tulow') || regs.has('bark')) { S.layers.ctx = true; $('#lCtx').checked = true; }
  if (regs.has('glowa')) { S.layers.skull = true; $('#lSkull').checked = true; }
  modal.classList.remove('show'); renderList();
  await Promise.all([regs.has('tulow') ? ensureTrunk() : null, regs.has('glowa') ? ensureAxial() : null, regs.has('podudzie') ? ensureLeg() : null]);
  if (!S.ana || S.ana.res !== res) return;
  PS.ana.on = true; savePanels(); apply(); renderInfo(); renderAna(); markList(); anaFly();
  if (window.innerWidth < 820) closeDrawer();
}
function runAnalysis() {
  const q = ($('#anaQ') ? $('#anaQ').value : '').trim();
  if (!AF.area) fillFromText(q, true);
  if (!AF.area) { openAna(q, 'Wybierz okolicę, w której boli, albo opisz ból dokładniej (np. „ból kolana przy schodzeniu po schodach”).'); return; }
  const res = runSym({ area: AF.area, triggers: AF.trig, side: AF.side, text: q }, (k) => !!G[k] && !OTHER.has(k));
  showAna(res, q);
}

/* ---------- sterowanie ---------- */
const syncTabs = () => $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === S.tab));
$('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S.tab = b.dataset.tab; syncTabs(); renderList(); if (S.tab === 'lig' || S.tab === 'nerv' || S.tab === 'vess') { useStructLayer(S.tab, true); apply(); } });
$('#regions').innerHTML = DATA.regions.map(([k, n]) => `<button data-r="${k}" class="${k === 'all' ? 'on' : ''}">${esc(n)}</button>`).join('');
const selRegionOk = (s) => s.t === 'grp' ? regionOk(G[s.id].region) : s.t === 'part' ? regionOk(G[MUS.get(s.id).grp].region) : s.t === 'bone' ? (BON.get(s.id).kind === 'ctx' || regionOk(BON.get(s.id).region)) : s.t === 'joint' ? regionOk(JMAP.get(s.id).reg) : s.t === 'str' ? regionOk(STR.get(s.id).reg) : regionOk(BON.get(LMS.get(s.id).bone).region);
function setRegion(r, after) {
  S.region = r; $$('#regions button').forEach((x) => x.classList.toggle('on', x.dataset.r === r));
  clearVis(); if (S.sel && !selRegionOk(S.sel)) { S.sel = null; renderInfo(); }
  if (r === 'glowa') { S.layers.skull = true; $('#lSkull').checked = true; }
  if (r === 'tulow' || r === 'podudzie') { S.layers.ctx = true; $('#lCtx').checked = true; }
  renderList(); apply();
  (r === 'glowa' ? ensureAxial() : r === 'tulow' ? ensureTrunk() : r === 'podudzie' ? ensureLeg() : Promise.resolve()).then(() => { apply(); viewRegion('front'); if (after) after(); });
}
$('#regions').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setRegion(b.dataset.r); });
const bindChk = (id, fn) => { const el = $('#' + id); el.addEventListener('change', () => { fn(el.checked); apply(); }); };
bindChk('lBones', (v) => (S.layers.bones = v)); bindChk('lMus', (v) => (S.layers.muscles = v)); bindChk('lCtx', (v) => (S.layers.ctx = v));
bindChk('lOther', (v) => (S.layers.other = v)); bindChk('lAtt', (v) => (S.layers.att = v)); bindChk('ghostBg', (v) => (S.ghostBg = v));
bindChk('lLig', (v) => { S.layers.lig = v; if (v) ensureStruct('lig'); }); bindChk('lNerv', (v) => { S.layers.nerv = v; if (v) ensureStruct('nerv'); }); bindChk('lVess', (v) => { S.layers.vess = v; if (v) ensureStruct('vess'); });
bindChk('lJoints', (v) => (S.layers.joints = v)); bindChk('lCap', (v) => (S.layers.cap = v));
$('#lSkull').addEventListener('change', (e) => { S.layers.skull = e.target.checked; if (S.layers.skull) ensureAxial(); apply(); });
$('#opa').addEventListener('input', (e) => { S.muscleOpacity = +e.target.value; apply(); });
function setSide(v) {
  S.side = v; try { localStorage.setItem('anatomia.side', v); } catch (e) {}
  $$('#sides button').forEach((b) => b.classList.toggle('on', b.dataset.s === v));
  if (S.sel && S.sel.side) S.sel = { ...S.sel, side: v === 'b' ? S.sel.side : v };
  apply(); renderInfo(); if (S.box) viewRegion('front');
}
$('#sides').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setSide(b.dataset.s); });
$('#multiBtn').addEventListener('click', () => { if (S.multiMode) exitMulti(); else { enterMulti(); apply(); renderInfo(); markList(); } });
$('#views').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || b.id === 'panelBtn' || b.id === 'multiBtn' || b.id === 'anaBtn' || b.id === 'bodyBtn') return;
  if (b.dataset.v === 'rot') { controls.autoRotate = !controls.autoRotate; b.classList.toggle('on', controls.autoRotate); dirty(); return; }
  if (b.dataset.v === 'reset') {
    exitMulti(true); S.ana = null; clearVis(); S.sel = null; S.layers = LAYERS0(); S.muscleOpacity = 1; S.ghostBg = true; S.region = 'all';
    $$('#regions button').forEach((x) => x.classList.toggle('on', x.dataset.r === 'all'));
    for (const [i, v] of [['lBones', 1], ['lMus', 1], ['lCtx', 0], ['lOther', 0], ['lAtt', 0], ['lJoints', 0], ['lCap', 0], ['lSkull', 0], ['lLig', 0], ['lNerv', 0], ['lVess', 0]]) $('#' + i).checked = !!v;
    $('#ghostBg').checked = true; $('#opa').value = 1; renderList(); apply(); renderInfo(); markList(); viewRegion('front'); return;
  }
  viewRegion(b.dataset.v);
});
const drawer = $('#side');
function openDrawer() { drawer.classList.add('open'); } function closeDrawer() { drawer.classList.remove('open'); }
$('#burger').addEventListener('click', () => drawer.classList.toggle('open'));
$('#closeSide').addEventListener('click', closeDrawer);
$('#panelBtn').addEventListener('click', () => $('#layers').classList.toggle('open'));
$('#legendJ').innerHTML = Object.values(SHP).map((s) => `<span title="${esc(s.d)}"><i class="sdot" style="background:${s.c}"></i>${esc(s.pl)}</span>`).join('');

/* ---------- modale: O autorze / Sugestie ---------- */
const modal = $('#modal'), mbody = $('#mbody');
function showModal(html) { mbody.innerHTML = html; modal.classList.add('show'); }
$('#menuBtn').addEventListener('click', () => $('#menu').classList.toggle('show'));
document.addEventListener('pointerdown', (e) => {
  let closed = false; const t = e.target;
  if (!t.closest('#menu,#menuBtn') && $('#menu').classList.contains('show')) { $('#menu').classList.remove('show'); closed = true; }
  if (!t.closest('#layers,#panelBtn') && $('#layers').classList.contains('open')) { $('#layers').classList.remove('open'); closed = true; }
  if (window.innerWidth < 820 && !t.closest('#side,#burger') && drawer.classList.contains('open')) { closeDrawer(); closed = true; }
  if (closed && t === canvas) { e.stopPropagation(); e.preventDefault(); }
}, true);
$('#menu').addEventListener('click', (e) => {
  const a = e.target.closest('button'); if (!a) return; $('#menu').classList.remove('show');
  if (a.dataset.mp) { dockToggle(a.dataset.mp); return; }
  if (a.dataset.m === 'about') showModal(`<h3>O autorze</h3><p><b>Anatomia</b> — wersja <b>v${VERSION}</b></p><p>Autor: <b>Michał Rzekiecki</b><br>Kontakt: <a href="mailto:michus@gmail.com">michus@gmail.com</a></p><hr><p class="small">Model 3D: <a href="https://www.z-anatomy.com" target="_blank" rel="noopener">Z-Anatomy</a> (CC BY-SA 4.0), oparty na BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japan). Nazwy łacińskie wg Terminologia Anatomica. Opisy mają charakter edukacyjny — w razie wątpliwości sprawdź w podręczniku anatomii.</p>`);
  if (a.dataset.m === 'sug') showModal(`<h3>Sugestie</h3><p class="small">Napisz, co sprawiłoby, że aplikacja będzie jeszcze lepsza.</p><textarea id="sugTxt" rows="6" placeholder="Twoja sugestia…"></textarea><div class="btns"><button id="sugSend" class="pri">Wyślij e-mailem</button><button id="sugCopy">Kopiuj</button></div><p class="small">Otworzy się Twój program pocztowy (adres: michus@gmail.com).</p>`);
  if (a.dataset.m === 'help') showHelp();
  if (a.dataset.m === 'testy') { showPanel('testy'); renderTests(); }
});
modal.addEventListener('pointerdown', (e) => { if (e.target === modal) modal.classList.remove('show'); });
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('#mclose')) { modal.classList.remove('show'); return; }
  const t = () => ($('#sugTxt') ? $('#sugTxt').value.trim() : '');
  if (e.target.id === 'sugSend') { const b = encodeURIComponent(t() || '(wpisz sugestię)'); location.href = `mailto:michus@gmail.com?subject=${encodeURIComponent('Anatomia v' + VERSION + ' — sugestia')}&body=${b}`; }
  if (e.target.id === 'sugCopy') { navigator.clipboard?.writeText(t()); e.target.textContent = 'Skopiowano'; }
});


function showHelp() {
  showModal(`<h3>Obsługa</h3><ul class="small">
<li><b>Obrót</b> — przeciągnij myszą / palcem; <b>przesuwanie</b> — prawy przycisk (przeciągnij) lub dwa palce; <b>zoom</b> — kółko / uszczypnięcie.</li>
<li><b>Klik</b> — wybór; kolejny klik w mięsień wielogłowy wybiera konkretną głowę. <b>Niebieski</b> = początek, <b>pomarańczowy</b> = przyczep końcowy.</li>
<li><b>Ctrl + klik</b> (⌘ na Mac) — dodaje mięsień do wyboru wielu (jak przycisk ☑ Wiele mięśni).</li>
<li><b>Testy</b> (dolny pasek lub Menu) — ruchy, które możesz wykonać, i mięśnie podejrzane, gdy dany ruch boli; „Pokaż w pozie” ustawia model i podświetla mięśnie.</li>
<li><b>Shift + klik</b> — <b>ukrywa</b> mięsień lub kość pod kursorem, więc możesz sięgnąć do głębszych warstw. <b>PPM</b> (kliknięcie bez przeciągania) albo długie przytrzymanie na telefonie — menu: ukryj, tło, wyróżnij, pokaż tylko ten. <b>H</b> ukrywa zaznaczony, <b>Shift+H</b> pokazuje wszystkie, <b>Ctrl+Z</b> cofa.</li>
<li><b>Dolny pasek paneli</b> — włączasz i wyłączasz panele tematyczne: Karta, Powiązania, Ruchy, Poza, Widoczność, Analiza. Każdy panel można zwinąć (–), przenieść na drugą stronę (⇆) lub zamknąć (×); układ jest zapamiętywany.</li>
<li><b>🦾 Poza</b> — poruszaj stawami kończyny górnej suwakami w zakresach ruchu zdrowego człowieka; mięśnie odkształcają się razem z kośćmi. Gotowe pozy: ręka w górze, łokieć 90° w płaszczyźnie strzałkowej i poprzecznej.</li>
<li><b>Najechanie</b> na mięsień wygasza resztę modelu o 40%. <b>Lista</b>: mały wybór przy mięśniu — Pokaż / Tło / Wyróżnij / Ukryj; kolor kropki = kolor mięśnia.</li>
<li><b>🔎 Analiza</b> działa bez internetu i bez AI: wybierz okolicę i czynniki albo opisz ból lub pozycję (np. „ból w lędźwiach w pozycji dziecka”) — dostaniesz przyczyny (%), mięśnie z udziałem %, co wzmocnić i co rozciągnąć. To edukacja, nie diagnoza.</li>
<li><b>Prawa / Lewa / Obie</b> — strona ciała; lewa to lustrzane odbicie prawej (poza obejmuje obie strony symetrycznie).</li>
<li><b>Stawy</b> — typ, osie, powierzchnie i mięśnie (agoniści ⇄ antagoniści). <b>Tułów i biodro</b> — mięśnie grzbietu, brzucha, miednicy i uda oraz kości.</li>
<li>Klawisz <b>/</b> — szukaj (nazwy polskie, łacińskie i angielskie).</li></ul>`);
}

/* ---------- mapa ciała: wybór obszaru ---------- */
const BM_ZONES = [ // [region, kształt SVG (dla prawej kończyny osoby = lewa strona rysunku)]
  ['bark', '<ellipse cx="88" cy="94" rx="24" ry="17" transform="rotate(-14 88 94)"/>'],
  ['ramie', '<rect x="49" y="104" width="23" height="84" rx="11" transform="rotate(11 60 146)"/>'],
  ['przedramie', '<rect x="30" y="190" width="21" height="78" rx="10" transform="rotate(6 40 229)"/>'],
  ['dlon', '<path d="M24 272h22l-2 22q-1 12-9 24-3 5-5 0-6-12-6-24z"/>'],
  ['tulow', '<path d="M97 248h23l-3 84-3 5h-16q-3-40-1-89z"/>'],
  ['podudzie', '<path d="M100 342h16l-1 62q-1 8 4 20h-24q4-12 3-20z"/>'],
];
function bodyMapHTML() {
  const side = (sd, flip) => `<g ${flip ? 'transform="translate(240 0) scale(-1 1)"' : ''} data-side="${sd}">${BM_ZONES.map(([r, shape]) => `<g class="bz" data-r="${r}" data-sd="${sd}" tabindex="0" role="button" aria-label="${esc(REGION_NAME[r])} ${sd === 'r' ? 'prawy' : 'lewy'}">${shape}</g>`).join('')}</g>`;
  return `<h3>Wybierz obszar ciała</h3><p class="small">Kliknij część sylwetki. Lewa strona rysunku to <b>prawa</b> strona ciała (jak patrzysz na człowieka z przodu).</p>
  <svg id="bmsvg" viewBox="0 0 240 440" role="img" aria-label="Sylwetka człowieka">
    <g class="bz" data-r="glowa" data-sd="x" tabindex="0" role="button" aria-label="Głowa i szyja"><ellipse cx="120" cy="38" rx="23" ry="29"/><rect x="107" y="62" width="26" height="24" rx="6"/></g>
    <g class="bz" data-r="tulow" data-sd="x" tabindex="0" role="button" aria-label="Tułów i biodro"><path d="M96 92h48q8 6 6 30l-4 112q-2 12-26 12t-26-12l-4-112q-2-24 6-30z"/></g>
    ${side('r', false)}${side('l', true)}
    <text x="120" y="190" class="bmt" text-anchor="middle">tułów</text><text x="120" y="236" class="bmt" text-anchor="middle">biodro</text>
  </svg>
  <div class="bmleg"><span><i class="bz-d on"></i>wybrany obszar</span><span>udo, kolano → „Tułów i biodro” / „Podudzie i stopa”</span></div>
  <div class="btns"><button data-bm="all">Wszystko (kończyna górna)</button><button data-bm="both">Obie strony</button></div>`;
}
function markBodyMap() {
  $$('#bmsvg .bz[data-r]').forEach((z) => { const r = z.dataset.r, sd = z.dataset.sd; z.classList.toggle('on', (S.region === r) && (sd === 'x' || S.side === 'b' || S.side === sd)); });
}
$('#bodyBtn').addEventListener('click', () => { showModal(bodyMapHTML()); markBodyMap(); });
mbody.addEventListener('click', (e) => {
  const bt = e.target.closest('[data-bm]');
  if (bt) { if (bt.dataset.bm === 'both') { setSide('b'); } else { setRegion('all'); } modal.classList.remove('show'); return; }
  const z = e.target.closest('#bmsvg .bz[data-r]'); if (!z) return;
  const sd = z.dataset.sd; if (sd === 'r' || sd === 'l') setSide(sd);
  modal.classList.remove('show'); setRegion(z.dataset.r);
});
mbody.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('#bmsvg .bz')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });

$('#anaBtn').addEventListener('click', () => openAna(S.ana ? S.ana.q : ''));
mbody.addEventListener('click', (e) => {
  const t = e.target;
  const ar = t.closest('[data-aarea]'); if (ar) { const id = ar.dataset.aarea; if (AF.area !== id) AF.trig = new Set(); AF.area = AF.area === id ? null : id; AF.auto = false; refreshForm(); return; }
  const tg = t.closest('[data-atrig]'); if (tg) { const id = tg.dataset.atrig; AF.trig.has(id) ? AF.trig.delete(id) : AF.trig.add(id); tg.classList.toggle('on'); return; }
  const sd = t.closest('[data-aside]'); if (sd) { AF.side = sd.dataset.aside; refreshForm(); return; }
  const ex = t.closest('[data-aex]'); if (ex) { const q = $('#anaQ'); if (q) { q.value = ex.dataset.aex; AF.trig = new Set(); fillFromText(q.value, true); } return; }
  if (t.closest('#anaGo')) runAnalysis();
});
mbody.addEventListener('input', (e) => { if (e.target.id === 'anaQ') { clearTimeout(fillT); fillT = setTimeout(() => fillFromText(e.target.value, false), 350); } });
mbody.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.target.id === 'anaQ') runAnalysis(); });


/* ---------- pętla ---------- */
let shiftX = 0, shiftY = 0;
function resize() {
  const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.clearViewOffset(); shiftX = shiftY = 0; camera.updateProjectionMatrix(); dirty();
}
new ResizeObserver(resize).observe(canvas.parentElement); resize();
let zoomNow = 1;
function applyShift() {
  const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight, mobile = window.innerWidth < 820;
  const tx = mobile ? 0 : (panelInset.r - panelInset.l) / 2, ty = mobile ? panelInset.b / 2 : 0;
  const tz = mobile ? Math.max(0.55, Math.min(1, (h - panelInset.b) / h)) : 1; // na telefonie panel dolny zasłania połowę ekranu: oddal model, by mieścił się w wolnej części
  if (Math.abs(shiftX - tx) < 0.5 && Math.abs(shiftY - ty) < 0.5 && Math.abs(zoomNow - tz) < 0.004) { if (shiftX === tx && shiftY === ty && zoomNow === tz) return; shiftX = tx; shiftY = ty; zoomNow = tz; }
  else { shiftX += (tx - shiftX) * 0.16; shiftY += (ty - shiftY) * 0.16; zoomNow += (tz - zoomNow) * 0.16; }
  camera.zoom = zoomNow;
  if (Math.abs(shiftX) < 0.5 && Math.abs(shiftY) < 0.5) camera.clearViewOffset(); else camera.setViewOffset(w, h, shiftX, shiftY, w, h);
  camera.updateProjectionMatrix(); dirty();
}
function frame(now) {
  requestAnimationFrame(frame);
  stepAnim(now); applyShift(); POSE.tick(now); POSE.flush();
  const ch = controls.update(); if (ch || needsRender) {
    headlight.position.copy(camera.position); headlight.target.position.copy(controls.target);
    renderer.render(scene, camera); needsRender = controls.autoRotate; placeLabel();
  }
}
renderList(); syncTabs(); $$('#sides button').forEach((b) => b.classList.toggle('on', b.dataset.s === S.side));
ready.then(() => {
  apply();
  const b = boxOf(regionBox('all')); const c = b.getCenter(new THREE.Vector3()); const r = b.getSize(new THREE.Vector3()).length() / 2;
  controls.target.copy(c); camera.position.copy(c).add(new THREE.Vector3(0.12, 0.05, 1).normalize().multiplyScalar(fitDist(r) * 1.0)); controls.update(); dirty();
  window.__anat = { setRegion, setHover, openAna, AF, runAnalysis, ensureLeg, ensureTrunk, MUS, BON, setVis, STR, ensureStruct, S, select, G, DATA, objs, SIDE, camera, controls, apply, viewRegion, setSide, toggleMulti, setMulti, ensureAxial, JMAP, POSE, renderPose };
});
requestAnimationFrame(frame);
setRuchy('');
