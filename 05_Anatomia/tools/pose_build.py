"""Buduje dane pozy: public/pose.json (szkielet, osie, przypisanie kości do segmentów) oraz
public/skin_<plik>.bin (wagi skinningu mięśni/więzadeł/nerwów/naczyń względem segmentów, 4 wpływy na wierzchołek).
Uruchamiać: cd /tmp && python3 -I /home/claude/work/app/tools/pose_build.py"""
import sys, json
sys.path.insert(0, '/home/claude/work/app/tools')
import numpy as np, glbread as g, pose_geom as pg, pose_sdf as sdfm
from scipy.spatial import cKDTree
import scipy.sparse as sp

PUB = pg.PUB; D = pg.D
SEGS = ['thx', 'clav', 'scap', 'hum', 'uln', 'rad', 'hand', 'tw1', 'tw2', 'fem', 'tib', 'foot']   # tw1/tw2 = pomocnicze segmenty skrętu przedramienia (1/3 i 2/3 nawrócenia); fem/tib/foot = udo, podudzie (+strzałka, rzepka), stopa
BSEGS = SEGS[:7] + SEGS[9:]   # segmenty z kośćmi (kolumny wag przed rozszerzeniem o tw1/tw2)
CLUS = [[0], [1, 2], [3], [4, 5], [6], [7], [8], [9]]   # grupy kinematyczne do wyznaczania przyczepów: tułów(+miednica), obręcz, ramię, przedramię (łokieć+promień), dłoń, udo, podudzie, stopa
bones = {b['id']: b for b in D['bones']}
segOf = {'B002': 'clav', 'B033': 'scap', 'B017': 'hum', 'B045': 'uln', 'B031': 'rad'}
for b in D['bones']:
    if b['kind'] == 'bone' and b['region'] == 'dlon': segOf[b['id']] = 'hand'
segOf['Q001'] = 'fem'
for k in ('Q115', 'Q102', 'Q110'): segOf[k] = 'tib'
for b in D['bones']:
    if b['kind'] == 'leg' and b['id'] not in segOf: segOf[b['id']] = 'foot'
SI = {s: i for i, s in enumerate(SEGS)}

def dense(P, idx):
    if idx is None: return P
    a, b, c = P[idx[:, 0]], P[idx[:, 1]], P[idx[:, 2]]
    return np.vstack([P, (a + b + c) / 3, (a + b) / 2, (b + c) / 2, (a + c) / 2])

# ---------- chmury punktów segmentów (świat) ----------
B = g.meshes(PUB + 'bones.glb'); TR = g.meshes(PUB + 'trunk.glb'); AX = g.meshes(PUB + 'axial.glb'); LO = g.meshes(PUB + 'lower.glb')
clouds = {s: [] for s in BSEGS}
for k, m in B.items():
    if k in segOf: clouds[segOf[k]].append(dense(g.world(m), m['idx']))
    elif k in bones and bones[k]['kind'] == 'ctx': clouds['thx'].append(dense(g.world(m), m['idx']))
for src in (TR, AX):
    for k, m in src.items():
        if k in segOf: clouds[segOf[k]].append(dense(g.world(m), m['idx']))
        elif k in bones and bones[k]['kind'] in ('trunk', 'axial'): clouds['thx'].append(dense(g.world(m), m['idx']))
for k, m in LO.items():
    if k in segOf: clouds[segOf[k]].append(dense(g.world(m), m['idx']))
trees = {s: cKDTree(np.vstack(v)) for s, v in clouds.items()}
print({s: len(t.data) for s, t in trees.items()})
o0, W0 = pg.compute()

# ---------- pola odległości kości (owijanie / kolizje) ----------
def tris(src, pred):
    L = []
    for k, m in src.items():
        if pred(k): L.append((g.world(m), m['idx']))
    return L
SDFS = {}
SD_SEGS = ['thx', 'clav', 'scap', 'hum', 'uln', 'rad', 'fem', 'tib', 'foot']
SDFS['clav'] = sdfm.build(tris(B, lambda k: segOf.get(k) == 'clav'), 0.003, name='clav')
SDFS['scap'] = sdfm.build(tris(B, lambda k: segOf.get(k) == 'scap'), 0.003, name='scap')
SDFS['hum'] = sdfm.build(tris(B, lambda k: segOf.get(k) == 'hum'), 0.003, name='hum')
SDFS['uln'] = sdfm.build(tris(B, lambda k: segOf.get(k) == 'uln'), 0.003, name='uln')
SDFS['rad'] = sdfm.build(tris(B, lambda k: segOf.get(k) == 'rad'), 0.003, name='rad')
thx_t = tris(B, lambda k: k in bones and bones[k]['kind'] == 'ctx') + tris(TR, lambda k: k in bones and bones[k]['kind'] == 'trunk' and k not in segOf) + tris(AX, lambda k: k in bones and bones[k]['kind'] == 'axial')
SDFS['thx'] = sdfm.build(thx_t, 0.006, bbox=([-0.42, 0.76, -0.26], [0.06, 1.62, 0.26]), name='thx')
SDFS['fem'] = sdfm.build(tris(TR, lambda k: segOf.get(k) == 'fem'), 0.004, name='fem')
SDFS['tib'] = sdfm.build(tris(LO, lambda k: segOf.get(k) == 'tib'), 0.004, name='tib')
SDFS['foot'] = sdfm.build(tris(LO, lambda k: segOf.get(k) == 'foot'), 0.0035, name='foot')

# ---------- wagi ----------
EPS, POW = 0.006, 4.0
def weights(P, idx):
    d = np.stack([trees[s].query(P, k=1)[0] for s in BSEGS], 1)
    w = 1.0 / (d + EPS) ** POW
    w /= w.sum(1, keepdims=True)
    if idx is not None and len(P) > 4:  # wygładzenie po siatce (3 iteracje)
        n = len(P); e = np.r_[idx[:, [0, 1]], idx[:, [1, 2]], idx[:, [0, 2]]]
        A = sp.coo_matrix((np.ones(len(e)), (e[:, 0], e[:, 1])), shape=(n, n)); A = ((A + A.T) > 0).astype(float).tocsr()
        deg = np.asarray(A.sum(1)).ravel(); deg[deg == 0] = 1
        for _ in range(3): w = 0.5 * w + 0.5 * (A @ w) / deg[:, None]
        w /= w.sum(1, keepdims=True)
    return w

def smooth_delta(P, idx, iters=100, lam=0.5):
    """delta = P − (P po wielokrotnym wygładzaniu Laplace'a). Wygładzona siatka ≈ „oś” mięśnia (przekrój kurczy się do osi),
    delta niesie grubość i szczegóły. Wierzchołki o tej samej pozycji (szwy) są sklejane na czas wygładzania."""
    if idx is None or len(P) < 4: return np.zeros_like(P)
    key = np.rint(P * 1e5).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True)
    inv = inv.ravel(); U = P[first]; T = inv[idx]
    n = len(U); e = np.r_[T[:, [0, 1]], T[:, [1, 2]], T[:, [0, 2]]]; e = e[e[:, 0] != e[:, 1]]
    A = sp.coo_matrix((np.ones(len(e)), (e[:, 0], e[:, 1])), shape=(n, n)); A = ((A + A.T) > 0).astype(float).tocsr()
    deg = np.asarray(A.sum(1)).ravel(); isol = deg == 0; deg[isol] = 1
    X = U.copy()
    for _ in range(iters):
        X = (1 - lam) * X + lam * (A @ X) / deg[:, None]
        X[isol] = U[isol]
    return P - X[inv]

import scipy.sparse.linalg as spl
def harmonic(P, w, idx, thr=0.8, eps=1e-4):
    """Wagi „harmoniczne”: wierzchołki silnie przypisane do kości (w >= thr) są stałe, reszta (odcinek swobodny między przyczepami)
    dostaje wagi z równania Laplace'a po siatce -> rozciąganie rozłożone równomiernie wzdłuż mięśnia zamiast skupionego w wąskim pasie
    (to tworzyło cienkie „nitki”)."""
    if idx is None or len(P) < 8: return w
    key = np.rint(P * 1e5).astype(np.int64)
    _, first, inv = np.unique(key, axis=0, return_index=True, return_inverse=True); inv = inv.ravel()
    n = len(first); T = inv[idx]
    cnt = np.bincount(inv, minlength=n).astype(float)
    wu = np.zeros((n, w.shape[1])); np.add.at(wu, inv, w); wu /= cnt[:, None]
    e = np.r_[T[:, [0, 1]], T[:, [1, 2]], T[:, [0, 2]]]; e = e[e[:, 0] != e[:, 1]]
    A = sp.coo_matrix((np.ones(len(e)), (e[:, 0], e[:, 1])), shape=(n, n)); A = ((A + A.T) > 0).astype(float).tocsr()
    wc = np.stack([wu[:, c].sum(1) for c in CLUS], 1)
    seed = wc.max(1) >= thr
    if seed.sum() == 0 or len(set(wc[seed].argmax(1))) < 2: return w
    free = np.where(~seed)[0]; sd = np.where(seed)[0]
    if len(free) == 0: return w
    deg = np.asarray(A.sum(1)).ravel()
    Lff = sp.diags(deg[free]) - A[free][:, free] + eps * sp.eye(len(free))
    rhs = A[free][:, sd] @ wu[sd] + eps * wu[free]
    X = spl.spsolve(Lff.tocsc(), rhs)
    if X.ndim == 1: X = X[:, None]
    out = wu.copy(); out[free] = np.clip(X, 0, None)
    out /= out.sum(1, keepdims=True)
    return out[inv]


def forearm_twist(P, w):
    """Skręt przedramienia: tkanki w strefie przedramienia dostają udział segmentów uln→tw1→tw2→rad wg położenia wzdłuż osi łokieć→nadgarstek
    (zamiast przypisania do najbliższej z dwóch kości, co rozrywało mięśnie przy nawróceniu)."""
    w9 = np.zeros((len(P), len(SEGS))); w9[:, :7] = w[:, :7]; w9[:, 9:12] = w[:, 7:10]
    el = np.array(o0['el']); wr = np.array(o0['wr']); ax = wr - el
    t = ((P - el) @ ax) / (ax @ ax)
    sh = w[:, 4] + w[:, 5]
    m = (sh >= 0.3) & (t > -0.05) & (t < 1.2)
    r = np.clip(t, 0, 1) * 3; k = np.minimum(np.floor(r).astype(int), 2); f = r - k
    ws = np.zeros((len(P), 4)); ws[np.arange(len(P)), k] = 1 - f; ws[np.arange(len(P)), k + 1] = f
    ids = [4, 7, 8, 5]
    for j, sg in enumerate(ids): w9[m, sg] = (sh[:, None] * ws)[m, j]
    return w9

def top4(w):
    ids = np.argsort(-w, 1)[:, :4]; ww = np.take_along_axis(w, ids, 1)
    ww[ww < 0.04] = 0; ww /= ww.sum(1, keepdims=True)
    q = np.rint(ww * 255).astype(np.int32); q[:, 0] += 255 - q.sum(1)  # suma = 255
    q = np.clip(q, 0, 255)
    ids = np.where(q > 0, ids, 0)
    return ids.astype(np.uint8), q.astype(np.uint8)

meta = {}
def run(fn, key, namefilter):
    M = g.meshes(PUB + fn); ent = []; blob = []; cblob = []; dblob = []; ncol = 0; off = 0; stat = 0
    for name, m in M.items():
        if not namefilter(name): continue
        P = g.world(m); w = weights(P, m['idx']); w = harmonic(P, w, m['idx'])
        if (1 - w[:, 0]).max() < 0.10: stat += 1; continue
        w = forearm_twist(P, w)
        ids, q = top4(w)
        blob.append(np.concatenate([ids, q], 1).astype(np.uint8).tobytes())
        cand = []  # (d0, seg) dla każdego segmentu-kolidera
        for sn in SD_SEGS:
            d0 = sdfm.sample(SDFS[sn], P); ws = w[:, SI[sn]]
            cand.append(np.where((d0 < 0.035) & (ws < 0.9), d0, 9.0))
        cand = np.stack(cand, 1); o2 = np.argsort(cand, 1)[:, :4]; d2 = np.take_along_axis(cand, o2, 1)
        dom = np.argmax(w, 1)
        col = np.zeros((len(P), 8), np.int8)   # 4 kolidery: [seg, wymagany odstęp w 0.5 mm]
        for j in range(4):
            okj = d2[:, j] < 9.0
            col[okj, 2 * j] = np.array([SI[SD_SEGS[i]] for i in o2[okj, j]], np.int8)
            # zachowaj odstęp spoczynkowy od kości (do 35 mm) — warstwy mięśni nie zamieniają się miejscami względem kości;
            # po drugiej stronie zawiasu (łokieć, nadgarstek) tkanka się ściska przy zgięciu, więc odstęp tylko symboliczny (0,5 mm: bez wnikania w kość)
            cap = np.full(len(P), 0.035)
            cn = np.array([SD_SEGS[i] for i in o2[:, j]])
            cross = ((cn == 'hum') & np.isin(dom, [4, 5, 6, 7, 8])) | (np.isin(cn, ['uln', 'rad']) & np.isin(dom, [3, 6])) | ((cn == 'fem') & np.isin(dom, [10, 11])) | ((cn == 'tib') & np.isin(dom, [9, 11])) | ((cn == 'foot') & np.isin(dom, [10])) | ((cn == 'thx') & (dom == 9))
            cap[cross] = 0.0035
            col[okj, 2 * j + 1] = np.clip(np.rint((np.minimum(d2[okj, j], cap[okj]) - 0.003) / 0.0005), -100, 127).astype(np.int8)
        cblob.append(col.tobytes()); ncol += int((col[:, 0] != 0).sum())
        dl = smooth_delta(P, m['idx']); dblob.append(np.clip(np.rint(dl / 1e-4), -32000, 32000).astype('<i2').tobytes())
        ent.append({'n': name, 'off': off, 'cnt': int(len(P)), 'mx': float(1 - w[:, 0].min())})
        off += len(P)
    open(PUB + f'skin_{key}.bin', 'wb').write(b''.join(blob)); open(PUB + f'col_{key}.bin', 'wb').write(b''.join(cblob)); open(PUB + f'dlt_{key}.bin', 'wb').write(b''.join(dblob))
    meta[key] = ent
    print(key, 'meshy z wagami:', len(ent), 'statyczne:', stat, 'wierzchołków:', off, 'kolidujących:', ncol)

MUSIDS = {m['id'] for m in D['muscles']}; STRIDS = {s['id'] for s in D.get('structs', [])}
run('muscles.glb', 'muscles', lambda n: n in MUSIDS)
run('trunk.glb', 'trunk', lambda n: n in MUSIDS)
run('lower.glb', 'lower', lambda n: n in MUSIDS)
run('lig.glb', 'lig', lambda n: n in STRIDS)
run('nerv.glb', 'nerv', lambda n: n in STRIDS)
run('vess.glb', 'vess', lambda n: n in STRIDS)

# ---------- geometria stawów ----------
o, W = pg.compute()
unit = pg.unit
J = {}
def sgn_axis(pivot, axis, pt, want, deg=10):
    """zwraca oś (±), dla której dodatni obrót (reguła prawej dłoni) przesuwa punkt pt w kierunku want"""
    from math import radians, cos, sin
    a = unit(axis); t = radians(deg); v = pt - pivot
    r = v * cos(t) + np.cross(a, v) * sin(t) + a * (a @ v) * (1 - cos(t))
    return a if (r - v) @ want > 0 else -a
Z = np.array([0, 0, 1.]); X = np.array([1., 0, 0]); Y = np.array([0, 1., 0])
# obojczyk (SC): unoszenie bocznego końca (AC w górę), cofanie (AC do tyłu)
J['sc'] = o['sc']; J['ac'] = o['ac']
J['clav_elev'] = sgn_axis(o['sc'], Z, o['ac'], Y)
J['clav_retr'] = sgn_axis(o['sc'], Y, o['ac'], -Z)
# łopatka (obrót w górę wokół AC): kąt dolny odchodzi na zewnątrz (−x dla prawej strony)
J['scap_up'] = sgn_axis(o['ac'], o['scap_n'], o['scap_ia'], -X)
# staw ramienny
J['gh'] = o['gh']
# łokieć: zgięcie — przedramię do przodu (+z)
J['el'] = o['el']; J['el_axis'] = sgn_axis(o['el'], o['el_axis'], o['wr'], Z)
# przedramię: nawrót — kolec promieniowy ku przyśrodkowi (+x)
J['pr_p'] = o['pr_b']; J['pr_axis'] = sgn_axis(o['pr_b'], o['pr_axis'], o['rs'], X)
# nadgarstek
J['wr'] = o['wr']
u = unit(o['pr_axis']); fe = o['us'] - o['rs']; fe = unit(fe - (fe @ u) * u)
J['wr_fe'] = sgn_axis(o['wr'], fe, o['tip'], Z)             # zgięcie dłoniowe: palce do przodu (+z)
dev = np.cross(fe, u)
J['wr_dev'] = sgn_axis(o['wr'], dev, o['tip'], X)           # odchylenie łokciowe: palce przyśrodkowo (+x)
# ---------- kończyna dolna ----------
WL = {k: g.world(m) for src in (TR, LO) for k, m in src.items() if k in segOf}
fem_p = WL['Q001']; hc = np.array([-0.06, 0.85, -0.01])
for _ in range(8):
    dd = np.linalg.norm(fem_p - hc, axis=1); sel = fem_p[(dd > 0.015) & (dd < 0.032) & (fem_p[:, 1] > 0.80) & (fem_p[:, 0] > -0.095)]
    hc, hr_ = pg.sphere_fit(sel)
tib_p = WL['Q115']
kc = (fem_p[fem_p[:, 1] < 0.48].mean(0) + tib_p[tib_p[:, 1] > 0.403].mean(0)) / 2
ac_ = WL['Q113'][WL['Q113'][:, 1] > 0.07].mean(0)
sc_ = (WL['Q113'].mean(0) + WL['Q100'].mean(0)) / 2
toe = WL['Q111'].mean(0); lat = WL['Q103'][WL['Q103'][:, 2] > WL['Q103'][:, 2].max() - 0.012].mean(0)
J['hip'] = hc; J['hip_r_ax'] = None
J['hip_f'] = sgn_axis(hc, X, kc, Z)                 # zgięcie biodra: kolano do przodu (+z)
J['hip_a'] = sgn_axis(hc, Z, kc, -X)                # odwodzenie: kolano na zewnątrz (−x dla prawej)
J['hip_r'] = sgn_axis(hc, unit(kc - hc), toe, X)    # rotacja wewnętrzna: palce stopy ku przyśrodkowi (+x)
J['knee'] = kc; J['knee_f'] = sgn_axis(kc, X, ac_, -Z)   # zgięcie kolana: stopa do tyłu (−z)
J['ank'] = ac_; J['ank_f'] = sgn_axis(ac_, X, toe, Y)    # zgięcie grzbietowe: palce w górę (+y)
miter = unit(np.array([0.36, 0.64, 0.68]))               # skośna oś stawu podskokowego (od tyłu-dołu-boku ku przodowi-górze-przyśrodkowi)
J['stj'] = sc_; J['stj_axis'] = sgn_axis(sc_, miter, lat, Y)   # inwersja: boczny brzeg stopy w górę
del J['hip_r_ax']
r = {k: [round(float(x), 5) for x in v] for k, v in J.items()}
r['gh_r'] = round(float(o['gh_r']), 4)
blob = []; off = 0; sdfmeta = {}
for sn in SD_SEGS:
    S = SDFS[sn]; blob.append(S['data'].tobytes()); sdfmeta[str(SI[sn])] = {'o': [round(float(x), 5) for x in S['o']], 'h': S['h'], 'n': [int(x) for x in S['n']], 'off': off}; off += S['data'].size
open(PUB + 'pose_sdf.bin', 'wb').write(b''.join(blob)); print('pose_sdf.bin', off * 2, 'B')
pose = {'segs': SEGS, 'joint': r, 'bone': {k: SI[v] for k, v in segOf.items()}, 'skin': meta, 'sdf': sdfmeta}
json.dump(pose, open(PUB + 'pose.json', 'w'), separators=(',', ':'))
for k, v in r.items(): print(k, v)
