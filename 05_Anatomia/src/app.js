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
const REG_ORDER = ['bark', 'ramie', 'przedramie', 'dlon'];
const G = DATA.groups; // key -> grupa mięśniowa
const MUS = new Map(DATA.muscles.map((m) => [m.id, m]));
const BON = new Map(DATA.bones.map((b) => [b.id, b]));
const LMS = new Map(DATA.lms.map((l) => [l.id, l]));
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
  hiMus: new THREE.MeshStandardMaterial({ color: 0xff4b3a, roughness: 0.4, emissive: 0x4a0a05, envMapIntensity: 1 }),
  hiBone: new THREE.MeshStandardMaterial({ color: 0xffe08a, roughness: 0.5, emissive: 0x3a2a00 }),
  org: new THREE.MeshBasicMaterial({ color: 0x2f8cff, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }),
  ins: new THREE.MeshBasicMaterial({ color: 0xffa21f, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3, side: THREE.DoubleSide }),
};
const grpMat = {}; const grpHi = {};
for (const k of Object.keys(G)) {
  grpMat[k] = musMat(k);
  if (OTHER.has(k)) { grpMat[k].color.set(0xd9c39a); grpMat[k].roughness = 0.6; grpMat[k].side = THREE.DoubleSide; }
  grpHi[k] = MAT.hiMus;
}

/* ---------- stan ---------- */
const S = {
  region: 'all', tab: 'mus', layers: { bones: true, muscles: true, ctx: false, other: false, att: false },
  hidden: new Set(), sel: null, // {t:'grp'|'part'|'bone'|'lm', id}
  ghostBg: true, showPins: false, muscleOpacity: 1,
};
const objs = { mus: new Map(), bone: new Map(), patch: new Map(), lm: new Map() };
const root = new THREE.Group(); scene.add(root);
const pickables = [];

/* ---------- ładowanie ---------- */
const loadEl = $('#loading'); const loadTxt = $('#loadtxt'); const loadBar = $('#loadbar');
const progress = { a: 0, b: 0 };
const setProg = () => { const p = (progress.a + progress.b) / 2; loadBar.style.width = (p * 100).toFixed(0) + '%'; };
function loadGLB(url, k) {
  return new Promise((res, rej) => new GLTFLoader().load(url, (g) => res(g.scene), (e) => { if (e.total) { progress[k] = e.loaded / e.total; setProg(); } }, rej));
}
const ready = Promise.all([loadGLB('muscles.glb', 'a'), loadGLB('bones.glb', 'b')]).then(([mus, bones]) => {
  mus.updateMatrixWorld(true); bones.updateMatrixWorld(true);
  const box = new THREE.Box3();
  mus.traverse((o) => {
    if (!o.isMesh) return;
    const m = MUS.get(o.name); if (!m) return;
    const g = G[m.grp]; o.userData = { kind: 'mus', id: m.id, grp: m.grp };
    o.material = grpMat[m.grp]; o.geometry.computeBoundsTree(); if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    objs.mus.set(m.id, o); box.expandByObject(o);
  });
  bones.traverse((o) => {
    if (o.isMesh) {
      const b = BON.get(o.name);
      if (b) { o.userData = { kind: 'bone', id: b.id }; o.material = b.kind === 'ctx' ? MAT.ctx : MAT.bone; o.geometry.computeBoundsTree(); objs.bone.set(b.id, o); box.expandByObject(o); }
      else if (/^P\d+$/.test(o.name)) { o.userData = { kind: 'patch', id: o.name }; o.geometry.computeBoundsTree(); objs.patch.set(o.name, o); }
    }
  });
  for (const l of DATA.lms) objs.lm.set(l.id, new THREE.Vector3(l.p[0], l.p[1], l.p[2]));
  // zbierz węzły do wspólnej sceny (zachowaj transformacje świata)
  const grab = (o) => { root.attach(o); };
  for (const o of [...objs.mus.values(), ...objs.bone.values(), ...objs.patch.values()]) grab(o);
  for (const o of objs.patch.values()) o.visible = false;
  S.box = box;
  for (const o of [...objs.mus.values(), ...objs.bone.values()]) pickables.push(o);
  loadEl.classList.add('hide'); setTimeout(() => loadEl.remove(), 500);
}).catch((e) => { loadTxt.textContent = 'Nie udało się wczytać modelu 3D: ' + e.message; console.error(e); });

/* ---------- widoczność / materiały ---------- */
const grpRegion = (k) => G[k].region;
const regionOk = (r) => S.region === 'all' || S.region === r;
function selGroups() { // zbiór grup mięśniowych objętych wyborem
  const s = S.sel; if (!s) return null;
  if (s.t === 'grp') return new Set([s.id]); if (s.t === 'part') return new Set([MUS.get(s.id).grp]);
  return null;
}
function neededBones() { // kości, na których leżą przyczepy zaznaczonego mięśnia
  const out = new Set(); const gs = selGroups(); if (!gs) return out;
  for (const g of gs) for (const p of patchesByGrp.get(g) || []) out.add(p.bone);
  return out;
}
function apply() {
  if (!S.box) return;
  const sel = S.sel, gs = selGroups(), need = neededBones();
  const bonesOn = S.layers.bones || (sel && sel.t === 'bone') || (sel && sel.t === 'lm');
  const hasSel = !!sel;
  const selBone = sel && sel.t === 'bone' ? sel.id : sel && sel.t === 'lm' ? LMS.get(sel.id).bone : null;
  const patchOn = new Map(); // patch id -> role
  if (gs) for (const g of gs) for (const p of patchesByGrp.get(g) || []) patchOn.set(p.id, p.role);
  if (selBone) for (const p of patchesByBone.get(selBone) || []) patchOn.set(p.id, p.role);
  if (S.layers.att) for (const p of DATA.patches) if (!patchOn.has(p.id) && regionOk(G[p.grp].region)) patchOn.set(p.id, p.role);
  for (const [id, o] of objs.mus) {
    const m = MUS.get(id), g = G[m.grp];
    let vis = S.layers.muscles && !S.hidden.has(m.grp) && (OTHER.has(m.grp) ? S.layers.other : true);
    const inReg = regionOk(g.region);
    let ghost = false;
    if (!inReg) { if (S.ghostBg && S.layers.muscles && !OTHER.has(m.grp)) { vis = true; ghost = true; } else vis = false; }
    if (gs && gs.has(m.grp)) { vis = true; ghost = false; }
    o.visible = vis;
    let mat = grpMat[m.grp];
    const isSel = gs && gs.has(m.grp) && (sel.t === 'grp' || sel.id === id);
    if (isSel) mat = MAT.hiMus; else if (ghost || (hasSel && vis)) mat = MAT.ghost;
    o.material = mat; o.renderOrder = mat === MAT.ghost ? 2 : 0;
  }
  for (const [id, o] of objs.bone) {
    const b = BON.get(id); const ctxLayer = b.kind === 'ctx';
    let vis = bonesOn && (ctxLayer ? (S.layers.ctx || need.has(id)) : true);
    let ghost = false;
    if (!ctxLayer && !regionOk(b.region)) { if (S.ghostBg && bonesOn) { vis = true; ghost = true; } else vis = false; }
    if (need.has(id) || selBone === id) { vis = true; ghost = false; }
    o.visible = vis;
    let mat = ctxLayer ? MAT.ctx : MAT.bone;
    if (selBone === id) mat = MAT.hiBone;
    else if (ghost || (gs && !need.has(id))) mat = MAT.ghostBone;
    o.material = mat; o.renderOrder = mat === MAT.ghostBone ? 2 : 0;
  }
  for (const [id, o] of objs.patch) {
    const role = patchOn.get(id); o.visible = !!role && objs.bone.get(patchBone(id))?.visible !== false;
    if (role) o.material = role === 'o' ? MAT.org : MAT.ins;
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
    const p = objs.lm.get(l.id); if (!p) continue;
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
  const p = objs.lm.get(S.sel.id); if (!p) return;
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
  const b = new THREE.Box3(); for (const o of list) if (o) b.expandByObject(o); return b;
}
function focusObjects(list, dir) {
  const b = boxOf(list); if (b.isEmpty()) return; const c = b.getCenter(new THREE.Vector3()); const r = b.getSize(new THREE.Vector3()).length() / 2;
  flyTo(c, Math.max(fitDist(r), 0.12), dir);
}
const DIRS = { front: [0, 0.05, 1], back: [0, 0.05, -1], lat: [-1, 0.05, 0.12], med: [1, 0.05, 0.12], top: [0, 1, 0.08] };
function regionBox(region) {
  const list = [];
  const R = region;
  for (const [id, o] of objs.mus) if (R === 'all' ? !OTHER.has(MUS.get(id).grp) : G[MUS.get(id).grp].region === R) list.push(o);
  for (const [id, o] of objs.bone) { const b = BON.get(id); if (R === 'all' ? b.kind === 'bone' : b.region === R) list.push(o); }
  return list;
}
function viewRegion(dirName) {
  const list = regionBox(S.region);
  focusObjects(list, new THREE.Vector3(...DIRS[dirName || 'front']));
}

/* ---------- wybór ---------- */
function select(sel, opts = {}) {
  S.sel = sel;
  apply(); renderInfo(); markList();
  if (!sel) return;
  if (opts.noFly) return;
  if (sel.t === 'grp') { const g = G[sel.id]; focusObjects([...g.ids.map((i) => objs.mus.get(i)), ...(patchesByGrp.get(sel.id) || []).map((p) => objs.patch.get(p.id))]); }
  else if (sel.t === 'part') focusObjects([objs.mus.get(sel.id)]);
  else if (sel.t === 'bone') focusObjects([objs.bone.get(sel.id)]);
  else if (sel.t === 'lm') { const p = objs.lm.get(sel.id); if (p) flyTo(p, 0.11); }
  if (window.innerWidth < 820) closeDrawer();
}

/* ---------- picking ---------- */
const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
function pick(ev) {
  const r = canvas.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera); ray.firstHitOnly = true;
  if (pinGroup.children.length) { const h = ray.intersectObjects(pinGroup.children, false); if (h.length) return { pin: h[0].object.userData }; }
  const vis = pickables.filter((o) => o.visible && o.material !== MAT.ghost && o.material !== MAT.ghostBone);
  const h = ray.intersectObjects(vis, false); return h.length ? { obj: h[0].object } : null;
}
let down = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; anim = null; });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; const moved = dx * dx + dy * dy > 25; down = null; if (moved) return;
  const h = pick(e); if (!h) { if (S.sel) select(null); return; }
  if (h.pin) { select({ t: 'lm', id: h.pin.id }); return; }
  const u = h.obj.userData;
  if (u.kind === 'mus') {
    const g = G[u.grp];
    if (S.sel && ((S.sel.t === 'grp' && S.sel.id === u.grp) || (S.sel.t === 'part' && MUS.get(S.sel.id).grp === u.grp)) && g.parts.length > 1) select({ t: 'part', id: u.id }, { noFly: true });
    else select({ t: 'grp', id: u.grp }, { noFly: false });
  } else if (u.kind === 'bone') select({ t: 'bone', id: u.id });
});
const tip = $('#tip'); let lastMove = 0;
canvas.addEventListener('pointermove', (e) => {
  const now = performance.now(); if (now - lastMove < 60 || (e.buttons & 1) || e.pointerType === 'touch') return; lastMove = now;
  const h = pick(e);
  if (!h) { tip.classList.remove('show'); canvas.style.cursor = 'grab'; return; }
  canvas.style.cursor = 'pointer';
  let pl, la;
  if (h.pin) { const l = LMS.get(h.pin.id); pl = l.pl; la = l.la; }
  else { const u = h.obj.userData; if (u.kind === 'mus') { const g = G[u.grp], m = MUS.get(u.id); pl = g.pl + (m.pl && g.parts.length > 1 ? ' — ' + m.pl.toLowerCase() : ''); la = g.la; } else { const b = BON.get(u.id); pl = b.pl; la = b.la; } }
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
function renderList() {
  const regs = S.region === 'all' ? REG_ORDER : [S.region];
  let h = '';
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
  } else {
    for (const r of regs) {
      const bs = DATA.bones.filter((b) => b.kind === 'bone' && b.region === r).sort((a, b) => (a.pl.localeCompare(b.pl, 'pl', { numeric: true })));
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
  listEl.innerHTML = h; markList();
}
const eyeSvg = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>';
function markList() {
  $$('.row.on', listEl).forEach((e) => e.classList.remove('on'));
  const s = S.sel; if (!s) return;
  let el = $(`.row[data-t="${s.t}"][data-id="${s.id}"]`, listEl);
  if (!el && s.t === 'part') el = $(`.row[data-t="grp"][data-id="${MUS.get(s.id).grp}"]`, listEl);
  if (el) { el.classList.add('on'); const p = el.closest('.parts'); if (p) p.classList.add('open'); if (!searchActive) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
}
listEl.addEventListener('click', (e) => {
  const eye = e.target.closest('[data-eye]');
  if (eye) { const k = eye.dataset.eye; S.hidden.has(k) ? S.hidden.delete(k) : S.hidden.add(k); eye.classList.toggle('off'); apply(); e.stopPropagation(); return; }
  const car = e.target.closest('[data-car],[data-lcar]');
  if (car) { const p = $(`[data-parts="${car.dataset.car}"],[data-lparts="${car.dataset.lcar}"]`, listEl); p && p.classList.toggle('open'); e.stopPropagation(); return; }
  const row = e.target.closest('.row'); if (!row) return;
  select({ t: row.dataset.t, id: row.dataset.id });
});

/* ---------- szukajka ---------- */
const searchEl = $('#q'); const resEl = $('#results'); let searchActive = false;
const IDX = [];
for (const g of Object.values(G)) IDX.push({ t: 'grp', id: g.key, pl: g.pl, la: g.la, typ: OTHER.has(g.key) ? 'Powięź / troczek' : 'Mięsień', hay: norm([g.pl, g.la, g.alt, ...g.parts.map((p) => p.en)].join(' ')), w: 0 });
for (const m of DATA.muscles) { const g = G[m.grp]; if (g.parts.length > 1) IDX.push({ t: 'part', id: m.id, pl: `${g.pl} — ${m.pl.toLowerCase()}`, la: `${g.la}, ${m.la.toLowerCase()}`, typ: 'Część mięśnia', hay: norm([m.pl, m.la, g.pl, g.la, m.en].join(' ')), w: 1 }); }
for (const b of DATA.bones) IDX.push({ t: 'bone', id: b.id, pl: b.pl, la: b.la, typ: b.kind === 'ctx' ? 'Kość (kontekst)' : 'Kość', hay: norm([b.pl, b.la, b.en].join(' ')), w: 0 });
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
  if (row.dataset.t === 'lm') { const l = LMS.get(row.dataset.id); S.tab = 'bone'; syncTabs(); }
  const t = row.dataset.t, id = row.dataset.id;
  searchEl.value = ''; doSearch('');
  select({ t, id });
});
window.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement !== searchEl && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openDrawer(); searchEl.focus(); } });

/* ---------- panel informacyjny ---------- */
const infoEl = $('#info');
function chip(pl, la, t, id, cls = '') { return `<button class="chip ${cls}" data-t="${t}" data-id="${id}">${esc(pl)} <small>(${esc(la)})</small></button>`; }
function renderInfo() {
  const s = S.sel; if (!s) { infoEl.classList.remove('show'); return; }
  let h = '';
  const head = (pl, la, tag) => `<div class="ihead"><div><div class="itag">${esc(tag)}</div><h2>${esc(pl)}</h2><div class="ila">(${esc(la)})</div></div><button class="x" id="ix" aria-label="Zamknij">×</button></div>`;
  if (s.t === 'grp' || s.t === 'part') {
    const gk = s.t === 'grp' ? s.id : MUS.get(s.id).grp; const g = G[gk]; const part = s.t === 'part' ? MUS.get(s.id) : null;
    h += head(part ? `${g.pl} — ${part.pl.toLowerCase()}` : g.pl, part ? `${g.la}, ${part.la.toLowerCase()}` : g.la, OTHER.has(gk) ? 'Powięź / troczek · ' + REGION_NAME[g.region].toLowerCase() : 'Mięsień · ' + REGION_NAME[g.region].toLowerCase());
    h += `<dl><dt>Początek</dt><dd>${esc(g.org)}</dd><dt>Przyczep końcowy</dt><dd>${esc(g.ins)}</dd><dt>Czynność</dt><dd>${esc(g.fn)}</dd><dt>Unerwienie</dt><dd>${esc(g.inn)}</dd></dl>`;
    if (patchesByGrp.get(gk)) h += `<div class="legend"><span><i class="o"></i>początek</span><span><i class="i"></i>przyczep końcowy</span><em>zaznaczone na kościach (orientacyjnie, wg modelu)</em></div>`;
    if (g.parts.length > 1) { h += '<div class="subt">Części</div><div class="chips">'; for (const p of g.parts) h += chip(p.pl, p.la, 'part', p.id, part && part.id === p.id ? 'on' : ''); h += '</div>'; }
  } else if (s.t === 'bone') {
    const b = BON.get(s.id); const ls = lmsByBone.get(b.id) || [];
    h += head(b.pl, b.la, b.kind === 'ctx' ? 'Kość · kontekst' : 'Kość · ' + REGION_NAME[b.region].toLowerCase());
    h += `<p class="desc">${esc(b.d)}</p>`;
    const ps = patchesByBone.get(b.id) || [];
    if (ps.length) {
      const byG = new Map(); for (const p of ps) { const k = p.grp; if (!byG.has(k) || p.role === 'o') byG.set(k, p.role); }
      const og = [...byG].filter(([, r]) => r === 'o').map(([k]) => k), ig = [...byG].filter(([, r]) => r === 'i').map(([k]) => k);
      const mk = (arr) => arr.sort((a, b) => G[a].pl.localeCompare(G[b].pl, 'pl')).map((k) => chip(G[k].pl, G[k].la, 'grp', k)).join('');
      if (og.length) h += `<div class="subt"><i class="dot o"></i>Początki mięśni</div><div class="chips">${mk(og)}</div>`;
      if (ig.length) h += `<div class="subt"><i class="dot i"></i>Przyczepy końcowe mięśni</div><div class="chips">${mk(ig)}</div>`;
    }
    if (ls.length) h += `<label class="chk"><input type="checkbox" id="pinsToggle" ${S.showPins ? 'checked' : ''}> Pokaż punkty kostne na modelu (${ls.length})</label>`;
    if (ls.length) h += `<div class="subt">Punkty kostne</div><div class="chips">${[...ls].sort((a, b) => a.pl.localeCompare(b.pl, 'pl')).map((l) => chip(l.pl, l.la, 'lm', l.id)).join('')}</div>`;
  } else if (s.t === 'lm') {
    const l = LMS.get(s.id), b = BON.get(l.bone);
    h += head(l.pl, l.la, 'Punkt kostny');
    if (l.d) h += `<p class="desc">${esc(l.d)}</p>`;
    h += `<div class="subt">Kość</div><div class="chips">${chip(b.pl, b.la, 'bone', b.id)}</div>`;
  }
  h += `<div class="btns"><button id="bFocus">Przybliż</button>${s.t === 'grp' || s.t === 'part' ? '<button id="bIso">Ukryj resztę</button>' : ''}<button id="bClear">Odznacz</button></div>`;
  infoEl.innerHTML = h; infoEl.classList.add('show');
}
infoEl.addEventListener('click', (e) => {
  if (e.target.closest('#ix') || e.target.closest('#bClear')) { select(null); return; }
  if (e.target.closest('#bFocus')) { const s = S.sel; S.sel = null; select(s); return; }
  if (e.target.closest('#bIso')) { S.ghostBg = false; S.layers.bones = true; const s = S.sel; $('#ghostBg').checked = false; const gk = s.t === 'grp' ? s.id : MUS.get(s.id).grp; for (const k of Object.keys(G)) { if (k !== gk) S.hidden.add(k); else S.hidden.delete(k); } renderList(); apply(); return; }
  const c = e.target.closest('.chip'); if (c) { select({ t: c.dataset.t, id: c.dataset.id }); return; }
});
infoEl.addEventListener('change', (e) => { if (e.target.id === 'pinsToggle') { S.showPins = e.target.checked; updatePins(); dirty(); } });

/* ---------- sterowanie ---------- */
const syncTabs = () => $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === S.tab));
$('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S.tab = b.dataset.tab; syncTabs(); renderList(); });
$('#regions').innerHTML = DATA.regions.map(([k, n]) => `<button data-r="${k}" class="${k === 'all' ? 'on' : ''}">${esc(n)}</button>`).join('');
$('#regions').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return; S.region = b.dataset.r;
  $$('#regions button').forEach((x) => x.classList.toggle('on', x === b));
  S.hidden.clear(); if (S.sel) { const s = S.sel; const ok = s.t === 'grp' ? regionOk(G[s.id].region) : s.t === 'part' ? regionOk(G[MUS.get(s.id).grp].region) : s.t === 'bone' ? regionOk(BON.get(s.id).region) : regionOk(BON.get(LMS.get(s.id).bone).region); if (!ok) { S.sel = null; renderInfo(); } }
  renderList(); apply(); viewRegion('front');
});
const bindChk = (id, fn) => { const el = $('#' + id); el.addEventListener('change', () => { fn(el.checked); apply(); }); };
bindChk('lBones', (v) => (S.layers.bones = v)); bindChk('lMus', (v) => (S.layers.muscles = v)); bindChk('lCtx', (v) => (S.layers.ctx = v));
bindChk('lOther', (v) => (S.layers.other = v)); bindChk('lAtt', (v) => (S.layers.att = v)); bindChk('ghostBg', (v) => (S.ghostBg = v));
$('#opa').addEventListener('input', (e) => { S.muscleOpacity = +e.target.value; apply(); });
$('#views').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.v === 'rot') { controls.autoRotate = !controls.autoRotate; b.classList.toggle('on', controls.autoRotate); dirty(); return; } if (b.dataset.v === 'reset') { S.hidden.clear(); S.sel = null; S.layers = { bones: true, muscles: true, ctx: false, other: false, att: false }; S.muscleOpacity = 1; S.ghostBg = true; ['lBones', 'lMus'].forEach((i) => ($('#' + i).checked = true)); ['lCtx', 'lOther', 'lAtt'].forEach((i) => ($('#' + i).checked = false)); $('#ghostBg').checked = true; $('#opa').value = 1; renderList(); apply(); renderInfo(); viewRegion('front'); return; } viewRegion(b.dataset.v); });
const drawer = $('#side');
function openDrawer() { drawer.classList.add('open'); } function closeDrawer() { drawer.classList.remove('open'); }
$('#burger').addEventListener('click', () => drawer.classList.toggle('open'));
$('#closeSide').addEventListener('click', closeDrawer);
$('#panelBtn').addEventListener('click', () => $('#layers').classList.toggle('open'));

/* ---------- modale: O autorze / Sugestie ---------- */
const modal = $('#modal'), mbody = $('#mbody');
function showModal(html) { mbody.innerHTML = html; modal.classList.add('show'); }
$('#menuBtn').addEventListener('click', () => $('#menu').classList.toggle('show'));
document.addEventListener('click', (e) => { if (!e.target.closest('#menu') && !e.target.closest('#menuBtn')) $('#menu').classList.remove('show'); });
$('#menu').addEventListener('click', (e) => {
  const a = e.target.closest('button'); if (!a) return; $('#menu').classList.remove('show');
  if (a.dataset.m === 'about') showModal(`<h3>O autorze</h3><p><b>Anatomia</b> — wersja <b>v${VERSION}</b></p><p>Autor: <b>Michał Rzekiecki</b><br>Kontakt: <a href="mailto:michus@gmail.com">michus@gmail.com</a></p><hr><p class="small">Model 3D: <a href="https://www.z-anatomy.com" target="_blank" rel="noopener">Z-Anatomy</a> (CC BY-SA 4.0), oparty na BodyParts3D © The Database Center for Life Science (CC BY-SA 2.1 Japan). Nazwy łacińskie wg Terminologia Anatomica. Opisy mają charakter edukacyjny — w razie wątpliwości sprawdź w podręczniku anatomii.</p>`);
  if (a.dataset.m === 'sug') showModal(`<h3>Sugestie</h3><p class="small">Napisz, co sprawiłoby, że aplikacja będzie jeszcze lepsza.</p><textarea id="sugTxt" rows="6" placeholder="Twoja sugestia…"></textarea><div class="btns"><button id="sugSend" class="pri">Wyślij e-mailem</button><button id="sugCopy">Kopiuj</button></div><p class="small">Otworzy się Twój program pocztowy (adres: michus@gmail.com).</p>`);
  if (a.dataset.m === 'help') showModal(`<h3>Obsługa</h3><ul class="small"><li><b>Obrót</b> — przeciągnij myszą / palcem; <b>przesuwanie</b> — prawy przycisk lub dwa palce; <b>zoom</b> — kółko / uszczypnięcie.</li><li><b>Klik</b> w strukturę — wybór; kolejny klik w mięsień wielogłowy — wybór konkretnej głowy.</li><li><b>Niebieski</b> = początek mięśnia, <b>pomarańczowy</b> = przyczep końcowy.</li><li>Klawisz <b>/</b> — szukaj. Szukajka obejmuje nazwy polskie, łacińskie i angielskie.</li></ul>`);
});
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('#mclose')) { modal.classList.remove('show'); return; }
  const t = () => ($('#sugTxt') ? $('#sugTxt').value.trim() : '');
  if (e.target.id === 'sugSend') { const b = encodeURIComponent(t() || '(wpisz sugestię)'); location.href = `mailto:michus@gmail.com?subject=${encodeURIComponent('Anatomia v' + VERSION + ' — sugestia')}&body=${b}`; }
  if (e.target.id === 'sugCopy') { navigator.clipboard?.writeText(t()); e.target.textContent = 'Skopiowano'; }
});

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
renderList(); syncTabs();
ready.then(() => {
  apply();
  const b = boxOf(regionBox('all')); const c = b.getCenter(new THREE.Vector3()); const r = b.getSize(new THREE.Vector3()).length() / 2;
  controls.target.copy(c); camera.position.copy(c).add(new THREE.Vector3(0.12, 0.05, 1).normalize().multiplyScalar(fitDist(r) * 1.0)); controls.update(); dirty();
  window.__anat = { S, select, G, DATA, objs, camera, controls, apply, viewRegion };
});
requestAnimationFrame(frame);
