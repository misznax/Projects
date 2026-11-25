"""Buduje dane pozy: public/pose.json (szkielet, osie, przypisanie kości do segmentów) oraz
public/skin_<plik>.bin (wagi skinningu mięśni/więzadeł/nerwów/naczyń względem segmentów, 4 wpływy na wierzchołek).
Uruchamiać: cd /tmp && python3 -I /home/claude/work/app/tools/pose_build.py"""
import sys, json
sys.path.insert(0, '/home/claude/work/app/tools')
import numpy as np, glbread as g, pose_geom as pg
from scipy.spatial import cKDTree
import scipy.sparse as sp

PUB = pg.PUB; D = pg.D
SEGS = ['thx', 'clav', 'scap', 'hum', 'uln', 'rad', 'hand']
bones = {b['id']: b for b in D['bones']}
segOf = {'B002': 'clav', 'B033': 'scap', 'B017': 'hum', 'B045': 'uln', 'B031': 'rad'}
for b in D['bones']:
    if b['kind'] == 'bone' and b['region'] == 'dlon': segOf[b['id']] = 'hand'
SI = {s: i for i, s in enumerate(SEGS)}

def dense(P, idx):
    if idx is None: return P
    a, b, c = P[idx[:, 0]], P[idx[:, 1]], P[idx[:, 2]]
    return np.vstack([P, (a + b + c) / 3, (a + b) / 2, (b + c) / 2, (a + c) / 2])

# ---------- chmury punktów segmentów (świat) ----------
B = g.meshes(PUB + 'bones.glb'); TR = g.meshes(PUB + 'trunk.glb'); AX = g.meshes(PUB + 'axial.glb')
clouds = {s: [] for s in SEGS}
for k, m in B.items():
    if k in segOf: clouds[segOf[k]].append(dense(g.world(m), m['idx']))
    elif k in bones and bones[k]['kind'] == 'ctx': clouds['thx'].append(dense(g.world(m), m['idx']))
for src in (TR, AX):
    for k, m in src.items():
        if k in bones and bones[k]['kind'] in ('trunk', 'axial'): clouds['thx'].append(dense(g.world(m), m['idx']))
trees = {s: cKDTree(np.vstack(v)) for s, v in clouds.items()}
print({s: len(t.data) for s, t in trees.items()})

# ---------- wagi ----------
EPS, POW = 0.006, 4.0
def weights(P, idx):
    d = np.stack([trees[s].query(P, k=1)[0] for s in SEGS], 1)
    w = 1.0 / (d + EPS) ** POW
    w /= w.sum(1, keepdims=True)
    if idx is not None and len(P) > 4:  # wygładzenie po siatce (3 iteracje)
        n = len(P); e = np.r_[idx[:, [0, 1]], idx[:, [1, 2]], idx[:, [0, 2]]]
        A = sp.coo_matrix((np.ones(len(e)), (e[:, 0], e[:, 1])), shape=(n, n)); A = ((A + A.T) > 0).astype(float).tocsr()
        deg = np.asarray(A.sum(1)).ravel(); deg[deg == 0] = 1
        for _ in range(3): w = 0.5 * w + 0.5 * (A @ w) / deg[:, None]
        w /= w.sum(1, keepdims=True)
    return w

def top4(w):
    ids = np.argsort(-w, 1)[:, :4]; ww = np.take_along_axis(w, ids, 1)
    ww[ww < 0.04] = 0; ww /= ww.sum(1, keepdims=True)
    q = np.rint(ww * 255).astype(np.int32); q[:, 0] += 255 - q.sum(1)  # suma = 255
    q = np.clip(q, 0, 255)
    ids = np.where(q > 0, ids, 0)
    return ids.astype(np.uint8), q.astype(np.uint8)

meta = {}
def run(fn, key, namefilter):
    M = g.meshes(PUB + fn); ent = []; blob = []; off = 0; stat = 0
    for name, m in M.items():
        if not namefilter(name): continue
        P = g.world(m); w = weights(P, m['idx'])
        if (1 - w[:, 0]).max() < 0.10: stat += 1; continue
        ids, q = top4(w)
        blob.append(np.concatenate([ids, q], 1).astype(np.uint8).tobytes())
        ent.append({'n': name, 'off': off, 'cnt': int(len(P)), 'mx': float(1 - w[:, 0].min())})
        off += len(P)
    open(PUB + f'skin_{key}.bin', 'wb').write(b''.join(blob))
    meta[key] = ent
    print(key, 'meshy z wagami:', len(ent), 'statyczne:', stat, 'wierzchołków:', off, 'bajtów:', off * 8)

MUSIDS = {m['id'] for m in D['muscles']}; STRIDS = {s['id'] for s in D.get('structs', [])}
run('muscles.glb', 'muscles', lambda n: n in MUSIDS)
run('trunk.glb', 'trunk', lambda n: n in MUSIDS)
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
r = {k: [round(float(x), 5) for x in v] for k, v in J.items()}
r['gh_r'] = round(float(o['gh_r']), 4)
pose = {'segs': SEGS, 'joint': r, 'bone': {k: SI[v] for k, v in segOf.items()}, 'skin': meta}
json.dump(pose, open(PUB + 'pose.json', 'w'), separators=(',', ':'))
for k, v in r.items(): print(k, v)
