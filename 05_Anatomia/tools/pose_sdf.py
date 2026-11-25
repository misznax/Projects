"""Pola odległości (SDF) kości segmentów, w układzie spoczynkowym świata: do wypychania mięśni z kości po pozie (owijanie).
Kodowanie: int16, jednostka 0.1 mm, ujemne = wnętrze kości, obcięcie ±50 mm."""
import numpy as np
from scipy import ndimage as ndi

def subdivide(P, T, h):
    """dzieli trójkąty tak, by najdłuższa krawędź <= h; zwraca punkty (próbki powierzchni)"""
    tri = P[T]  # (n,3,3)
    out = []
    for _ in range(14):
        e = np.stack([np.linalg.norm(tri[:, 1] - tri[:, 0], axis=1), np.linalg.norm(tri[:, 2] - tri[:, 1], axis=1), np.linalg.norm(tri[:, 0] - tri[:, 2], axis=1)], 1)
        big = e.max(1) > h
        out.append(tri[~big].reshape(-1, 3))
        if not big.any(): break
        t = tri[big]; k = e[big].argmax(1)
        a = t[np.arange(len(t)), k]; b = t[np.arange(len(t)), (k + 1) % 3]; c = t[np.arange(len(t)), (k + 2) % 3]
        m = (a + b) / 2
        tri = np.concatenate([np.stack([a, m, c], 1), np.stack([m, b, c], 1)])
    else:
        out.append(tri.reshape(-1, 3))
    return np.vstack(out)

def build(meshes, h, margin=0.04, bbox=None, name=''):
    """meshes: lista (P świat, idx) -> dict(o, h, n, data int16)"""
    allP = np.vstack([P for P, _ in meshes])
    if bbox is None: lo, hi = allP.min(0) - margin, allP.max(0) + margin
    else: lo, hi = np.array(bbox[0]), np.array(bbox[1])
    n = np.ceil((hi - lo) / h).astype(int) + 1
    pts = []
    for P, T in meshes:
        if T is None: pts.append(P); continue
        if bbox is not None:
            c = P[T].mean(1); keep = ((c > lo - 0.02) & (c < hi + 0.02)).all(1); T = T[keep]
            if not len(T): continue
        pts.append(subdivide(P, T, h * 0.7))
    pts = np.vstack(pts)
    ij = np.floor((pts - lo) / h + 0.5).astype(int)
    ok = ((ij >= 0) & (ij < n)).all(1); ij = ij[ok]
    mask = np.zeros(n, bool); mask[ij[:, 0], ij[:, 1], ij[:, 2]] = True
    closed = ndi.binary_closing(mask, iterations=1)
    filled = ndi.binary_fill_holes(closed)
    inner = filled & ~closed
    frac = inner.sum() / max(1, closed.sum())
    solid = filled if frac > 0.3 else closed
    do = ndi.distance_transform_edt(~solid) * h
    di = ndi.distance_transform_edt(solid) * h
    sd = np.where(solid, -(di - 0.5 * h), do - 0.5 * h)
    sd = ndi.gaussian_filter(sd, 0.8)
    q = np.clip(np.rint(sd / 1e-4), -500, 500).astype(np.int16)
    print(f'  sdf {name}: dims {tuple(n)} vox {h*1000:.1f}mm wnętrze/powierzchnia {frac:.2f} {"(bryła)" if frac > 0.3 else "(powłoka)"} MB {q.nbytes/1e6:.2f}')
    return {'o': lo, 'h': h, 'n': n, 'data': q}

def sample(S, P):
    """trilinear: odległość w punktach P (k,3); poza siatką = +0.05"""
    f = (P - S['o']) / S['h']; i0 = np.floor(f).astype(int); t = f - i0
    n = S['n']; D = S['data'].astype(np.float64) * 1e-4
    out = np.full(len(P), 0.05)
    ok = ((i0 >= 0) & (i0 < n - 1)).all(1)
    if not ok.any(): return out
    a = i0[ok]; u = t[ok]; acc = np.zeros(len(a))
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (u[:, 0] if dx else 1 - u[:, 0]) * (u[:, 1] if dy else 1 - u[:, 1]) * (u[:, 2] if dz else 1 - u[:, 2])
                acc += w * D[a[:, 0] + dx, a[:, 1] + dy, a[:, 2] + dz]
    out[ok] = acc; return out
