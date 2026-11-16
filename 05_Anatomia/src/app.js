import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

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
const REG_ORDER = ['bark', 'ramie', 'przedramie', 'dlon', 'glowa'];
const G = DATA.groups; // key -> grupa mięśniowa
const MUS = new Map(DATA.muscles.map((m) => [m.id, m]));
const BON = new Map(DATA.bones.map((b) => [b.id, b]));
const LMS = new Map(DATA.lms.map((l) => [l.id, l]));
const JN = DATA.joints, JMAP = new Map(JN.map((j) => [j.id, j])), SHP = DATA.shapes, MIDX = DATA.mid;
const MIDB = new Set(DATA.bones.filter((b) => b.kind === 'axial' || /sternum|Xiphoid|^Vertebra/.test(b.en)).map((b) => b.id));
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
const musMat = (g) => {
  const h = hash(g), c = new THREE.Color().setHSL((3 + (h % 9)) / 360, 0.62 + (h % 5) * 0.02, 0.29 + (h % 7) * 0.012);
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0.52, metalness: 0, envMapIntensity: 0.9 });
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
const HI_COL = ['#ff4b3a', '#35c46a', '#f2c53d', '#e05bd0', '#2fc7d6', '#9b7bff', '#ff8a8a'];
const HI = HI_COL.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, emissive: new THREE.Color(c).multiplyScalar(0.22), envMapIntensity: 1 }));
const capMats = new Map(); const capMatFor = (j) => { if (!capMats.has(j.shape)) capMats.set(j.shape, new THREE.MeshStandardMaterial({ color: SHP[j.shape].c, roughness: 0.5, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, emissive: new THREE.Color(SHP[j.shape].c).multiplyScalar(0.25) })); return capMats.get(j.shape); };
const grpMat = {};
for (const k of Object.keys(G)) {
  grpMat[k] = musMat(k);
  if (OTHER.has(k)) { grpMat[k].color.set(0xd9c39a); grpMat[k].roughness = 0.6; grpMat[k].side = THREE.DoubleSide; }
}

/* ---------- stan ---------- */
const LAYERS0 = () => ({ bones: true, muscles: true, ctx: false, other: false, att: false, joints: false, cap: false, skull: false });
const S = {
  region: 'all', tab: 'mus', layers: LAYERS0(), side: 'r',
  hidden: new Set(), sel: null, // {t:'grp'|'part'|'bone'|'lm'|'joint', id, side?}
  multiMode: false, multi: new Map(), // klucz grupy -> indeks koloru
  ghostBg: true, showPins: false, muscleOpacity: 1, axial: false,
};
try { const sv = localStorage.getItem('anatomia.side'); if (sv === 'r' || sv === 'l' || sv === 'b') S.side = sv; } catch (e) {}
const mkSide = (k) => ({ k, mus: new Map(), bone: new Map(), patch: new Map(), cap: new Map(), mk: new Map() });
const SIDE = { r: mkSide('r'), l: mkSide('l') };
const objs = { mus: SIDE.r.mus, bone: SIDE.r.bone, patch: SIDE.r.patch, lm: new Map() };
const root = new THREE.Group(), rootL = new THREE.Group(); scene.add(root, rootL);
rootL.scale.x = -1; rootL.position.x = 2 * MIDX; // lewa strona = lustro prawej względem płaszczyzny środkowej
const pickables = []; const markerMeshes = [];
const defSide = () => (S.side === 'l' ? 'l' : 'r');
const O = (kind, id, side) => (SIDE[side] || SIDE[defSide()])[kind].get(id);
const activeSides = () => (S.side === 'b' ? [SIDE.r, SIDE.l] : [SIDE[defSide()]]);
const lmPos = (id, side) => { const p = objs.lm.get(id); if (!p) return null; return (side || defSide()) === 'l' ? new THREE.Vector3(2 * MIDX - p.x, p.y, p.z) : p; };
const toastEl = $('#toast'); const toast = (t) => { toastEl.textContent = t; toastEl.classList.toggle('show', !!t); };

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
    const mk = (m, side) => { const x = side === 'l' ? 2 * MIDX - m.p[0] : m.p[0]; const s = new THREE.Mesh(SPH, mat); s.position.set(x, m.p[1], m.p[2]); s.scale.setScalar(m.r * 0.6); s.renderOrder = 6; s.visible = false; s.userData = { kind: 'joint', id: j.id, side }; scene.add(s); markerMeshes.push(s); return s; };
    SIDE.r.mk.set(j.id, j.marks.map((m) => mk(m, 'r')));
    if (!j.mid) L.mk.set(j.id, j.marks.map((m) => mk(m, 'l')));
  }
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

/* ---------- widoczność / materiały ---------- */
const grpRegion = (k) => G[k].region;
const regionOk = (r) => S.region === 'all' || S.region === r;
const jointRegionOk = (j) => regionOk(j.reg) && (j.reg !== 'glowa' || S.layers.skull || S.region === 'glowa');
function curGroups() { // Map: klucz grupy -> indeks koloru
  const m = new Map(S.multi); const s = S.sel;
  if (s && (s.t === 'grp' || s.t === 'part')) { const k = s.t === 'grp' ? s.id : MUS.get(s.id).grp; if (!m.has(k)) m.set(k, 0); }
  return m;
}
function neededBones(gs) { // kości, na których leżą przyczepy zaznaczonych mięśni
  const out = new Set();
  for (const g of gs) for (const p of patchesByGrp.get(g) || []) out.add(p.bone);
  return out;
}
function apply() {
  if (!S.box) return;
  const sel = S.sel, gm = curGroups(), gs = new Set(gm.keys()), need = neededBones(gs);
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
    for (const [id, o] of SD.mus) {
      const m = MUS.get(id), g = G[m.grp];
      let vis = on && S.layers.muscles && !S.hidden.has(m.grp) && (OTHER.has(m.grp) ? S.layers.other : true);
      let ghost = false;
      if (g.region === 'glowa') vis = vis && (S.region === 'glowa' || gs.has(m.grp));
      else if (!regionOk(g.region)) { if (S.ghostBg && S.layers.muscles && !OTHER.has(m.grp) && on) { vis = true; ghost = true; } else vis = false; }
      if (on && gs.has(m.grp)) { vis = true; ghost = false; }
      o.visible = vis;
      let mat = grpMat[m.grp];
      const isSel = gs.has(m.grp) && !(partSel && MUS.get(partSel).grp === m.grp && partSel !== id && !S.multi.has(m.grp));
      if (isSel) mat = HI[gm.get(m.grp) % HI.length]; else if (ghost || (hasSel && vis)) mat = MAT.ghost;
      o.material = mat; o.renderOrder = mat === MAT.ghost ? 2 : 0;
    }
    for (const [id, o] of SD.bone) {
      const b = BON.get(id), mid = MIDB.has(id); if (SD.k === 'l' && mid) continue;
      const sideOn = mid || on, ctxLayer = b.kind === 'ctx', ax = b.kind === 'axial';
      let vis = bonesOn && sideOn && (ctxLayer ? (S.layers.ctx || need.has(id)) : ax ? (S.layers.skull || S.region === 'glowa') : true);
      let ghost = false;
      if (!ctxLayer && !ax && !regionOk(b.region)) { if (S.ghostBg && bonesOn && sideOn) { vis = true; ghost = true; } else vis = false; }
      if ((need.has(id) || selBone === id || jb.has(id)) && sideOn) { vis = true; ghost = false; }
      o.visible = vis;
      let mat = ctxLayer ? MAT.ctx : MAT.bone;
      if (selBone === id) mat = MAT.hiBone;
      else if (ghost || (gs.size && !need.has(id)) || (sj && !jb.has(id))) mat = MAT.ghostBone;
      o.material = mat; o.renderOrder = mat === MAT.ghostBone ? 2 : 0;
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
  const op = S.muscleOpacity;
  for (const k of Object.keys(grpMat)) { const m = grpMat[k]; m.opacity = op; m.transparent = op < 1; m.depthWrite = op >= 0.65; m.needsUpdate = true; }
  updatePins(); dirty();
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
    for (const [id, o] of SD.mus) if (R === 'all' ? !OTHER.has(MUS.get(id).grp) : G[MUS.get(id).grp].region === R) list.push(o);
    for (const [id, o] of SD.bone) { const b = BON.get(id); if (R === 'all' ? b.kind === 'bone' : b.region === R) list.push(o); }
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
  S.sel = sel;
  apply(); renderInfo(); markList();
  if (!sel) return;
  if (opts.noFly) return;
  const sd = selSide(sel);
  if (sel.t === 'grp') { const g = G[sel.id]; focusObjects([...g.ids.map((i) => O('mus', i, sd)), ...(patchesByGrp.get(sel.id) || []).map((p) => O('patch', p.id, sd))]); }
  else if (sel.t === 'part') focusObjects([O('mus', sel.id, sd)]);
  else if (sel.t === 'bone') focusObjects([O('bone', sel.id, sd)]);
  else if (sel.t === 'lm') { const p = lmPos(sel.id, sd); if (p) flyTo(p, 0.11); }
  else if (sel.t === 'joint') { const j = JMAP.get(sel.id); const ms = (SIDE[j.mid ? 'r' : sd].mk.get(j.id) || []); { const bb = boxOf(ms); if (!bb.isEmpty()) { const r = bb.getSize(new THREE.Vector3()).length() / 2; flyTo(bb.getCenter(new THREE.Vector3()), Math.max(fitDist(r) * 1.9, 0.19)); } } }
  if (window.innerWidth < 820) closeDrawer();
}
/* wielokrotny wybór mięśni */
const nextIdx = () => { const used = new Set(S.multi.values()); for (let i = 0; i < HI.length; i++) if (!used.has(i)) return i; return S.multi.size % HI.length; };
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
  const vis = pickables.filter((o) => o.visible && o.material !== MAT.ghost && o.material !== MAT.ghostBone);
  const h = ray.intersectObjects(vis, false); return h.length ? { obj: h[0].object } : null;
}
let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; anim = null; });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; const moved = dx * dx + dy * dy > 25; down = null; if (moved) return;
  const h = pick(e); if (!h) { if (S.sel) select(null); return; }
  if (h.pin) { select({ t: 'lm', id: h.pin.id, side: S.sel && S.sel.side }); return; }
  const u = h.obj.userData; const multiKey = e.ctrlKey || e.metaKey || e.shiftKey;
  if (u.kind === 'mus') {
    const g = G[u.grp];
    if (S.multiMode || multiKey) { toggleMulti(u.grp); return; }
    if (S.sel && ((S.sel.t === 'grp' && S.sel.id === u.grp) || (S.sel.t === 'part' && MUS.get(S.sel.id).grp === u.grp)) && g.parts.length > 1) select({ t: 'part', id: u.id, side: u.side }, { noFly: true });
    else select({ t: 'grp', id: u.grp, side: u.side }, { noFly: false });
  } else if (u.kind === 'bone') { if (!S.multiMode) select({ t: 'bone', id: u.id, side: u.side }); }
  else if (u.kind === 'joint') select({ t: 'joint', id: u.id, side: u.side });
});
const tip = $('#tip'); let lastMove = 0;
canvas.addEventListener('pointermove', (e) => {
  const now = performance.now(); if (now - lastMove < 60 || (e.buttons & 1) || e.pointerType === 'touch') return; lastMove = now;
  const h = pick(e);
  if (!h) { tip.classList.remove('show'); canvas.style.cursor = 'grab'; return; }
  canvas.style.cursor = 'pointer';
  let pl, la;
  if (h.pin) { const l = LMS.get(h.pin.id); pl = l.pl; la = l.la; }
  else { const u = h.obj.userData; if (u.kind === 'mus') { const g = G[u.grp], m = MUS.get(u.id); pl = g.pl + (m.pl && g.parts.length > 1 ? ' — ' + m.pl.toLowerCase() : ''); la = g.la; } else if (u.kind === 'joint') { const j = JMAP.get(u.id); pl = j.pl; la = j.la; } else { const b = BON.get(u.id); pl = b.pl; la = b.la; } }
  tip.innerHTML = `<b>${esc(pl)}</b><small>(${esc(la)})</small>`; tip.style.transform = `translate(${e.clientX + 14}px, ${e.clientY + 14}px)`; tip.classList.add('show');
});
canvas.addEventListener('pointerleave', () => tip.classList.remove('show'));
canvas.addEventListener('dblclick', (e) => {
  const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera);
  const h = ray.intersectObjects(pickables.filter((o) => o.visible), false); if (h.length) flyTo(h[0].point, Math.max(0.1, camera.position.distanceTo(h[0].point) * 0.5), null, 500);
});

/* ---------- lista boczna ---------- */
const listEl = $('#list');
const rowHTML = (pl, la, extra = '') => `<span class="nm"><span class="pl">${esc(pl)}</span><span class="la">(${esc(la)})</span></span>${extra}`;
const sdot = (j) => `<i class="sdot" style="background:${SHP[j.shape].c}"></i>`;
function renderList() {
  const regs = S.region === 'all' ? REG_ORDER : [S.region];
  let h = '';
  let tipOff = false; try { tipOff = localStorage.getItem('anatomia.tipMulti') === '1'; } catch (e) {}
  if (S.tab === 'mus' && !tipOff) h += '<div class="tip"><span>💡 <b>Kilka mięśni naraz:</b> przycisk <b>☑ Wiele mięśni</b> nad modelem (na komputerze także <b>Ctrl / Shift + klik</b>). Każdy dostaje inny kolor; w karcie mięśnia znajdziesz antagonistów.</span><button data-tipx aria-label="Ukryj podpowiedź">×</button></div>';
  if (S.tab === 'mus') {
    for (const r of regs) {
      const gs = Object.values(G).filter((g) => g.region === r).sort((a, b) => a.pl.localeCompare(b.pl, 'pl'));
      if (!gs.length) continue;
      h += `<div class="sec">${esc(REGION_NAME[r])} <i>${gs.length}</i></div>`;
      for (const g of gs) {
        const multi = g.parts.length > 1;
        h += `<div class="grp" data-g="${g.key}"><div class="row" data-t="grp" data-id="${g.key}">
          <button class="eye ${S.hidden.has(g.key) ? 'off' : ''}" data-eye="${g.key}" title="Pokaż / ukryj" aria-label="Pokaż lub ukryj">${eyeSvg}</button>
          ${rowHTML(g.pl, g.la, multi ? `<button class="car" data-car="${g.key}" aria-label="Części">${g.parts.length}▾</button>` : '')}</div>`;
        if (multi) { h += `<div class="parts" data-parts="${g.key}">`; for (const p of g.parts) h += `<div class="row sub" data-t="part" data-id="${p.id}">${rowHTML(p.pl, p.la)}</div>`; h += '</div>'; }
        h += '</div>';
      }
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
      const bs = DATA.bones.filter((b) => (b.kind === 'bone' || b.kind === 'axial') && b.region === r).sort((a, b) => (a.pl.localeCompare(b.pl, 'pl', { numeric: true })));
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
  $$('.row.on', listEl).forEach((e) => e.classList.remove('on'));
  if (S.multiMode) { for (const k of S.multi.keys()) { const el = $(`.row[data-t="grp"][data-id="${k}"]`, listEl); if (el) el.classList.add('on'); } return; }
  const s = S.sel; if (!s) return;
  let el = $(`.row[data-t="${s.t}"][data-id="${s.id}"]`, listEl);
  if (!el && s.t === 'part') el = $(`.row[data-t="grp"][data-id="${MUS.get(s.id).grp}"]`, listEl);
  if (el) { el.classList.add('on'); const p = el.closest('.parts'); if (p) p.classList.add('open'); if (!searchActive) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}
listEl.addEventListener('click', (e) => {
  if (e.target.closest('[data-tipx]')) { try { localStorage.setItem('anatomia.tipMulti', '1'); } catch (x) {} renderList(); return; }
  const eye = e.target.closest('[data-eye]');
  if (eye) { const k = eye.dataset.eye; S.hidden.has(k) ? S.hidden.delete(k) : S.hidden.add(k); eye.classList.toggle('off'); apply(); e.stopPropagation(); return; }
  const car = e.target.closest('[data-car],[data-lcar]');
  if (car) { const p = $(`[data-parts="${car.dataset.car}"],[data-lparts="${car.dataset.lcar}"]`, listEl); p && p.classList.toggle('open'); e.stopPropagation(); return; }
  const row = e.target.closest('.row'); if (!row) return;
  if ((e.ctrlKey || e.metaKey || e.shiftKey) && row.dataset.t === 'grp') { toggleMulti(row.dataset.id); return; }
  select({ t: row.dataset.t, id: row.dataset.id });
});

/* ---------- szukajka ---------- */
const searchEl = $('#q'); const resEl = $('#results'); let searchActive = false;
const IDX = [];
for (const g of Object.values(G)) IDX.push({ t: 'grp', id: g.key, pl: g.pl, la: g.la, typ: OTHER.has(g.key) ? 'Powięź / troczek' : 'Mięsień', hay: norm([g.pl, g.la, g.alt, ...g.parts.map((p) => p.en)].join(' ')), w: 0 });
for (const m of DATA.muscles) { const g = G[m.grp]; if (g.parts.length > 1) IDX.push({ t: 'part', id: m.id, pl: `${g.pl} — ${m.pl.toLowerCase()}`, la: `${g.la}, ${m.la.toLowerCase()}`, typ: 'Część mięśnia', hay: norm([m.pl, m.la, g.pl, g.la, m.en].join(' ')), w: 1 }); }
for (const b of DATA.bones) IDX.push({ t: 'bone', id: b.id, pl: b.pl, la: b.la, typ: b.kind === 'ctx' ? 'Kość (kontekst)' : 'Kość', hay: norm([b.pl, b.la, b.en].join(' ')), w: 0 });
for (const j of JN) IDX.push({ t: 'joint', id: j.id, pl: j.pl, la: j.la, typ: 'Staw · ' + SHP[j.shape].pl.split(' (')[0], hay: norm([j.pl, j.la, j.alt, SHP[j.shape].pl, j.ksztalt, j.rodzaj, 'staw', j.piet ? 'pietrowy dwujamowy dwukomorowy' : ''].join(' ')), w: 0 });
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
  if (t === 'lm' || t === 'bone') { S.tab = 'bone'; syncTabs(); renderList(); } else if (t === 'joint') { S.tab = 'jnt'; syncTabs(); renderList(); }
  searchEl.value = ''; doSearch('');
  select({ t, id });
});
window.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement !== searchEl && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openDrawer(); searchEl.focus(); } });

/* ---------- panel informacyjny ---------- */
const infoEl = $('#info');
function chip(pl, la, t, id, cls = '', dot = '') { return `<button class="chip ${cls}" data-t="${t}" data-id="${id}">${dot}${esc(pl)} <small>(${esc(la)})</small></button>`; }
const gchip = (k, cls = '') => chip(G[k].pl, G[k].la, 'grp', k, cls);
const mchips = (arr) => arr.map((m) => (isG(m) ? gchip(m) : `<span class="chip txt">${esc(m)}</span>`)).join('');
const head = (pl, la, tag) => `<div class="ihead"><div><div class="itag">${esc(tag)}</div><h2>${esc(pl)}</h2><div class="ila">(${esc(la)})</div></div><button class="x" id="ix" aria-label="Zamknij">×</button></div>`;
const PIET = 'Staw piętrowy (dwujamowy / dwukomorowy): krążek lub łąkotka dzieli jamę stawową na dwa piętra, w których zachodzą różne ruchy.';
function renderMulti() {
  const keys = [...S.multi.keys()];
  let h = head(`Wybrane mięśnie (${keys.length})`, 'wybór wielokrotny', 'Tryb wielu mięśni');
  if (!keys.length) h += '<p class="desc">Klikaj mięśnie na modelu albo na liście, aby dodać lub usunąć je z zaznaczenia. Na komputerze działa też <b>Ctrl</b> / <b>Shift</b> + klik.</p>';
  else {
    h += `<div class="chips mt">${keys.map((k) => `<span class="chip sel"><i class="dotc" style="background:${HI_COL[S.multi.get(k) % HI_COL.length]}"></i><button class="cn" data-t="grp" data-id="${k}">${esc(G[k].pl)} <small>(${esc(G[k].la)})</small></button><button class="rm" data-rm="${k}" aria-label="Usuń">×</button></span>`).join('')}</div>`;
    const rel = []; const seen = new Set();
    for (const a of keys) for (const b of ANT.get(a) || []) if (S.multi.has(b) && S.multi.get(a) !== S.multi.get(b)) { const id = [a, b].sort().join('|'); if (!seen.has(id)) { seen.add(id); rel.push([a, b]); } }
    if (rel.length) h += `<div class="subt">Antagoniści w zaznaczeniu</div><ul class="rel">${rel.map(([a, b]) => `<li>${esc(G[a].pl)} <b>⇄</b> ${esc(G[b].pl)}</li>`).join('')}</ul>`;
    const allAnt = new Set(); for (const k of keys) for (const b of ANT.get(k) || []) if (!S.multi.has(b)) allAnt.add(b);
    if (allAnt.size) h += `<div class="subt">Antagoniści spoza zaznaczenia</div><div class="chips">${[...allAnt].sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => gchip(k)).join('')}</div>`;
    if (patchesByGrp.size) h += `<div class="legend"><span><i class="o"></i>początki</span><span><i class="i"></i>przyczepy końcowe</span></div>`;
  }
  h += `<div class="btns">${keys.length ? '<button id="bMultiFocus">Przybliż</button>' : ''}${keys.length && [...ANT.keys()].some((k) => S.multi.has(k)) ? '<button id="bAddAnt">Dodaj antagonistów</button>' : ''}${keys.length ? '<button id="bMultiClear">Wyczyść</button>' : ''}<button id="bMultiOff" class="pri">Zakończ wybór wielu</button></div>`;
  infoEl.innerHTML = h; infoEl.classList.add('show');
}
function renderInfo() {
  if (S.multiMode) { renderMulti(); return; }
  const s = S.sel; if (!s) { infoEl.classList.remove('show'); return; }
  let h = '';
  if (s.t === 'grp' || s.t === 'part') {
    const gk = grpOf(s); const g = G[gk]; const part = s.t === 'part' ? MUS.get(s.id) : null;
    h += head(part ? `${g.pl} — ${part.pl.toLowerCase()}` : g.pl, part ? `${g.la}, ${part.la.toLowerCase()}` : g.la, OTHER.has(gk) ? 'Powięź / troczek · ' + REGION_NAME[g.region].toLowerCase() : 'Mięsień · ' + REGION_NAME[g.region].toLowerCase());
    h += `<dl><dt>Początek</dt><dd>${esc(g.org)}</dd><dt>Przyczep końcowy</dt><dd>${esc(g.ins)}</dd><dt>Czynność</dt><dd>${esc(g.fn)}</dd><dt>Unerwienie</dt><dd>${esc(g.inn)}</dd></dl>`;
    if (patchesByGrp.get(gk)) h += `<div class="legend"><span><i class="o"></i>początek</span><span><i class="i"></i>przyczep końcowy</span><em>zaznaczone na kościach (orientacyjnie, wg modelu)</em></div>`;
    const an = ANT.get(gk); if (an && an.size) h += `<div class="subt">Antagoniści</div><div class="chips">${[...an].sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => gchip(k)).join('')}</div>`;
    const mj = MJ.get(gk); if (mj && mj.length) h += `<div class="subt">Działa na stawy</div><div class="chips">${mj.map((x) => chip(JMAP.get(x.j).pl, x.ruch, 'joint', x.j, '', sdot(JMAP.get(x.j)))).join('')}</div>`;
    if (g.parts.length > 1) { h += '<div class="subt">Części</div><div class="chips">'; for (const p of g.parts) h += chip(p.pl, p.la, 'part', p.id, part && part.id === p.id ? 'on' : ''); h += '</div>'; }
  } else if (s.t === 'bone') {
    const b = BON.get(s.id); const ls = lmsByBone.get(b.id) || [];
    h += head(b.pl, b.la, b.kind === 'ctx' ? 'Kość · kontekst' : 'Kość · ' + REGION_NAME[b.region].toLowerCase());
    h += `<p class="desc">${esc(b.d)}</p>`;
    const ps = patchesByBone.get(b.id) || [];
    if (ps.length) {
      const byG = new Map(); for (const p of ps) { const k = p.grp; if (!byG.has(k) || p.role === 'o') byG.set(k, p.role); }
      const og = [...byG].filter(([, r]) => r === 'o').map(([k]) => k), ig = [...byG].filter(([, r]) => r === 'i').map(([k]) => k);
      const mk = (arr) => arr.sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => gchip(k)).join('');
      if (og.length) h += `<div class="subt"><i class="dot o"></i>Początki mięśni</div><div class="chips">${mk(og)}</div>`;
      if (ig.length) h += `<div class="subt"><i class="dot i"></i>Przyczepy końcowe mięśni</div><div class="chips">${mk(ig)}</div>`;
    }
    const js = JN.filter((j) => j.bones.includes(b.id));
    if (js.length) h += `<div class="subt">Stawy z udziałem kości</div><div class="chips">${js.map((j) => chip(j.pl, j.la, 'joint', j.id, '', sdot(j))).join('')}</div>`;
    if (ls.length) h += `<label class="chk"><input type="checkbox" id="pinsToggle" ${S.showPins ? 'checked' : ''}> Pokaż punkty kostne na modelu (${ls.length})</label>`;
    if (ls.length) h += `<div class="subt">Punkty kostne</div><div class="chips">${[...ls].sort((a, b) => a.pl.localeCompare(b.pl, 'pl')).map((l) => chip(l.pl, l.la, 'lm', l.id)).join('')}</div>`;
  } else if (s.t === 'lm') {
    const l = LMS.get(s.id), b = BON.get(l.bone);
    h += head(l.pl, l.la, 'Punkt kostny');
    if (l.d) h += `<p class="desc">${esc(l.d)}</p>`;
    h += `<div class="subt">Kość</div><div class="chips">${chip(b.pl, b.la, 'bone', b.id)}</div>`;
  } else if (s.t === 'joint') {
    const j = JMAP.get(s.id), sh = SHP[j.shape];
    h += head(j.pl, j.la, 'Staw · ' + REGION_NAME[j.reg].toLowerCase());
    h += `<dl><dt>Rodzaj</dt><dd>${esc(j.rodzaj)}</dd><dt>Kształt (typ)</dt><dd><i class="dotc" style="background:${sh.c}"></i><b>${esc(j.ksztalt)}</b><div class="small">${esc(sh.d)}</div></dd>`;
    h += `<dt>Liczba osi ruchu</dt><dd>${esc(j.osie)}</dd><dt>Powierzchnie stawowe</dt><dd><b>${j.n}</b> — ${esc(j.pow)}</dd>`;
    if (j.piet) h += `<dt>Piętrowy / dwujamowy</dt><dd><b>tak</b><div class="small">${PIET}</div></dd>`;
    h += `<dt>Cechy</dt><dd>${esc(j.cechy)}</dd></dl>`;
    if (j.children && j.children.length) h += `<div class="subt">Stawy składowe</div><div class="chips">${j.children.map((c) => chip(JMAP.get(c).pl, JMAP.get(c).la, 'joint', c, '', sdot(JMAP.get(c)))).join('')}</div>`;
    if (j.parent) h += `<div class="subt">Część stawu złożonego</div><div class="chips">${chip(JMAP.get(j.parent).pl, JMAP.get(j.parent).la, 'joint', j.parent, '', sdot(JMAP.get(j.parent)))}</div>`;
    h += `<div class="subt">Kości</div><div class="chips">${j.bones.map((b) => chip(BON.get(b).pl, BON.get(b).la, 'bone', b)).join('')}</div>`;
    if (j.pairs.length) {
      h += '<div class="subt">Ruchy i mięśnie (antagoniści ⇄)</div>';
      j.pairs.forEach((pr, i) => { h += `<div class="mv"><button class="mvb" data-mv="${j.id}|${i}" title="Zaznacz oba zespoły mięśni">${esc(pr[0])} <b>⇄</b> ${esc(pr[2])}</button><div class="mvr"><span class="mvl">${esc(pr[0])}</span>${mchips(pr[1])}</div><div class="mvr"><span class="mvl">${esc(pr[2])}</span>${mchips(pr[3])}</div></div>`; });
    } else h += '<p class="small">Ruchomość znikoma — brak wyodrębnionych ruchów czynnych.</p>';
    h += '<div class="legend"><em>znacznik stawu jest półprzezroczysty, widoczny przez kości; torebka i krążek — w kolorze typu stawu</em></div>';
  }
  const jm = s.t === 'joint' && JMAP.get(s.id).pairs.some((p) => p[1].some(isG) || p[3].some(isG));
  h += `<div class="btns"><button id="bFocus">Przybliż</button>${s.t === 'grp' || s.t === 'part' ? '<button id="bIso">Ukryj resztę</button>' : ''}${(s.t === 'grp' || s.t === 'part') && ANT.has(grpOf(s)) ? '<button id="bAnt">Z antagonistami</button>' : ''}${jm ? '<button id="bJm">Pokaż mięśnie stawu</button>' : ''}<button id="bClear">Odznacz</button></div>`;
  infoEl.innerHTML = h; infoEl.classList.add('show');
}
infoEl.addEventListener('click', (e) => {
  const t = e.target;
  if (t.closest('#ix') || t.closest('#bClear')) { select(null); return; }
  if (t.closest('#bFocus')) { const s = S.sel; S.sel = null; select(s); return; }
  if (t.closest('#bIso')) { S.ghostBg = false; S.layers.bones = true; const s = S.sel; $('#ghostBg').checked = false; const gk = grpOf(s); for (const k of Object.keys(G)) { if (k !== gk) S.hidden.add(k); else S.hidden.delete(k); } renderList(); apply(); return; }
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

/* ---------- sterowanie ---------- */
const syncTabs = () => $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === S.tab));
$('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S.tab = b.dataset.tab; syncTabs(); renderList(); });
$('#regions').innerHTML = DATA.regions.map(([k, n]) => `<button data-r="${k}" class="${k === 'all' ? 'on' : ''}">${esc(n)}</button>`).join('');
const selRegionOk = (s) => s.t === 'grp' ? regionOk(G[s.id].region) : s.t === 'part' ? regionOk(G[MUS.get(s.id).grp].region) : s.t === 'bone' ? (BON.get(s.id).kind === 'ctx' || regionOk(BON.get(s.id).region)) : s.t === 'joint' ? regionOk(JMAP.get(s.id).reg) : regionOk(BON.get(LMS.get(s.id).bone).region);
function setRegion(r, after) {
  S.region = r; $$('#regions button').forEach((x) => x.classList.toggle('on', x.dataset.r === r));
  S.hidden.clear(); if (S.sel && !selRegionOk(S.sel)) { S.sel = null; renderInfo(); }
  if (r === 'glowa') { S.layers.skull = true; $('#lSkull').checked = true; }
  renderList(); apply();
  (r === 'glowa' ? ensureAxial() : Promise.resolve()).then(() => { apply(); viewRegion('front'); if (after) after(); });
}
$('#regions').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setRegion(b.dataset.r); });
const bindChk = (id, fn) => { const el = $('#' + id); el.addEventListener('change', () => { fn(el.checked); apply(); }); };
bindChk('lBones', (v) => (S.layers.bones = v)); bindChk('lMus', (v) => (S.layers.muscles = v)); bindChk('lCtx', (v) => (S.layers.ctx = v));
bindChk('lOther', (v) => (S.layers.other = v)); bindChk('lAtt', (v) => (S.layers.att = v)); bindChk('ghostBg', (v) => (S.ghostBg = v));
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
  const b = e.target.closest('button'); if (!b || b.id === 'panelBtn' || b.id === 'multiBtn') return;
  if (b.dataset.v === 'rot') { controls.autoRotate = !controls.autoRotate; b.classList.toggle('on', controls.autoRotate); dirty(); return; }
  if (b.dataset.v === 'reset') {
    exitMulti(true); S.hidden.clear(); S.sel = null; S.layers = LAYERS0(); S.muscleOpacity = 1; S.ghostBg = true; S.region = 'all';
    $$('#regions button').forEach((x) => x.classList.toggle('on', x.dataset.r === 'all'));
    for (const [i, v] of [['lBones', 1], ['lMus', 1], ['lCtx', 0], ['lOther', 0], ['lAtt', 0], ['lJoints', 0], ['lCap', 0], ['lSkull', 0]]) $('#' + i).checked = !!v;
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
  if (a.dataset.m === 'about') showModal(`<h3>O autorze</h3><p><b>Anatomia</b> — wersja <b>v${VERSION}</b></p><p>Autor: <b>Michał Rzekiecki</b><br>Kontakt: <a href="mailto:michus@gmail.com">michus@gmail.com</a></p><hr><p class="small">Model 3D: <a href="https://www.z-anatomy.com" target="_blank" rel="noopener">Z-Anatomy</a> (CC BY-SA 4.0), oparty na BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japan). Nazwy łacińskie wg Terminologia Anatomica. Opisy mają charakter edukacyjny — w razie wątpliwości sprawdź w podręczniku anatomii.</p>`);
  if (a.dataset.m === 'sug') showModal(`<h3>Sugestie</h3><p class="small">Napisz, co sprawiłoby, że aplikacja będzie jeszcze lepsza.</p><textarea id="sugTxt" rows="6" placeholder="Twoja sugestia…"></textarea><div class="btns"><button id="sugSend" class="pri">Wyślij e-mailem</button><button id="sugCopy">Kopiuj</button></div><p class="small">Otworzy się Twój program pocztowy (adres: michus@gmail.com).</p>`);
  if (a.dataset.m === 'help') showModal(`<h3>Obsługa</h3><ul class="small"><li><b>Obrót</b> — przeciągnij myszą / palcem; <b>przesuwanie</b> — prawy przycisk lub dwa palce; <b>zoom</b> — kółko / uszczypnięcie.</li><li><b>Klik</b> w strukturę — wybór; kolejny klik w mięsień wielogłowy — wybór konkretnej głowy.</li><li><b>Niebieski</b> = początek mięśnia, <b>pomarańczowy</b> = przyczep końcowy.</li><li><b>Prawa / Lewa / Obie</b> (u góry) — wybór strony ciała; lewa strona to lustrzane odbicie prawej (kości i mięśnie kończyny są symetryczne).</li><li><b>☑ Wiele mięśni</b> — zaznaczasz kilka mięśni naraz (na komputerze także Ctrl/Shift + klik). W karcie mięśnia: antagoniści i stawy, na które działa.</li><li><b>Stawy</b> — zakładka z typem, osiami, liczbą powierzchni i mięśniami (agoniści ⇄ antagoniści); kolor znacznika = typ stawu (Warstwy ▸ Stawy).</li><li>Klawisz <b>/</b> — szukaj. Szukajka obejmuje nazwy polskie, łacińskie i angielskie.</li></ul>`);
});
modal.addEventListener('pointerdown', (e) => { if (e.target === modal) modal.classList.remove('show'); });
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('#mclose')) { modal.classList.remove('show'); return; }
  const t = () => ($('#sugTxt') ? $('#sugTxt').value.trim() : '');
  if (e.target.id === 'sugSend') { const b = encodeURIComponent(t() || '(wpisz sugestię)'); location.href = `mailto:michus@gmail.com?subject=${encodeURIComponent('Anatomia v' + VERSION + ' — sugestia')}&body=${b}`; }
  if (e.target.id === 'sugCopy') { navigator.clipboard?.writeText(t()); e.target.textContent = 'Skopiowano'; }
});


/* ---------- mapa ciała: wybór obszaru ---------- */
const BM_ZONES = [ // [region, kształt SVG (dla prawej kończyny osoby = lewa strona rysunku)]
  ['bark', '<ellipse cx="88" cy="94" rx="24" ry="17" transform="rotate(-14 88 94)"/>'],
  ['ramie', '<rect x="49" y="104" width="23" height="84" rx="11" transform="rotate(11 60 146)"/>'],
  ['przedramie', '<rect x="30" y="190" width="21" height="78" rx="10" transform="rotate(6 40 229)"/>'],
  ['dlon', '<path d="M24 272h22l-2 22q-1 12-9 24-3 5-5 0-6-12-6-24z"/>'],
];
function bodyMapHTML() {
  const side = (sd, flip) => `<g ${flip ? 'transform="translate(240 0) scale(-1 1)"' : ''} data-side="${sd}">${BM_ZONES.map(([r, shape]) => `<g class="bz" data-r="${r}" data-sd="${sd}" tabindex="0" role="button" aria-label="${esc(REGION_NAME[r])} ${sd === 'r' ? 'prawy' : 'lewy'}">${shape}</g>`).join('')}</g>`;
  return `<h3>Wybierz obszar ciała</h3><p class="small">Kliknij część sylwetki. Lewa strona rysunku to <b>prawa</b> strona ciała (jak patrzysz na człowieka z przodu).</p>
  <svg id="bmsvg" viewBox="0 0 240 440" role="img" aria-label="Sylwetka człowieka">
    <g class="bz" data-r="glowa" data-sd="x" tabindex="0" role="button" aria-label="Głowa i szyja"><ellipse cx="120" cy="38" rx="23" ry="29"/><rect x="107" y="62" width="26" height="24" rx="6"/></g>
    <g class="bz off" title="Tułów — wkrótce"><path d="M96 92h48q8 6 6 30l-4 112q-2 12-26 12t-26-12l-4-112q-2-24 6-30z"/></g>
    <g class="bz off" title="Miednica i nogi — wkrótce"><path d="M95 244h50l-3 60-6 126h-14l-4-90-4 90h-14l-6-126z"/></g>
    ${side('r', false)}${side('l', true)}
    <text x="120" y="270" class="bmt" text-anchor="middle">tułów</text><text x="120" y="360" class="bmt" text-anchor="middle">nogi</text>
  </svg>
  <div class="bmleg"><span><i class="bz-d on"></i>obszar dostępny</span><span><i class="bz-d"></i>wkrótce (tułów, nogi)</span></div>
  <div class="btns"><button data-bm="all">Cała kończyna górna</button><button data-bm="both">Obie strony</button></div>`;
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

/* ---------- pętla ---------- */
let shiftX = 0, shiftY = 0;
function resize() {
  const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.clearViewOffset(); shiftX = shiftY = 0; camera.updateProjectionMatrix(); dirty();
}
new ResizeObserver(resize).observe(canvas.parentElement); resize();
function applyShift() {
  const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight, mobile = window.innerWidth < 820;
  const tx = S.sel && !mobile ? 195 : 0, ty = S.sel && mobile ? h * 0.2 : 0;
  if (Math.abs(shiftX - tx) < 0.5 && Math.abs(shiftY - ty) < 0.5) { if (shiftX === tx && shiftY === ty) return; shiftX = tx; shiftY = ty; }
  else { shiftX += (tx - shiftX) * 0.16; shiftY += (ty - shiftY) * 0.16; }
  if (Math.abs(shiftX) < 0.5 && Math.abs(shiftY) < 0.5) camera.clearViewOffset(); else camera.setViewOffset(w, h, shiftX, shiftY, w, h);
  camera.updateProjectionMatrix(); dirty();
}
function frame(now) {
  requestAnimationFrame(frame);
  stepAnim(now); applyShift();
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
  window.__anat = { S, select, G, DATA, objs, SIDE, camera, controls, apply, viewRegion, setSide, toggleMulti, setMulti, ensureAxial, JMAP };
});
requestAnimationFrame(frame);
