"""Minimalny czytnik GLB (numpy): pozycje wierzchołków, indeksy i macierze węzłów (TRS)."""
import json, struct
import numpy as np

CT = {5120: np.int8, 5121: np.uint8, 5122: np.int16, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
NC = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}

def load(fn):
    b = open(fn, 'rb').read()
    l = struct.unpack('<I', b[12:16])[0]
    j = json.loads(b[20:20 + l])
    off = 20 + l
    bl = struct.unpack('<I', b[off:off + 4])[0]
    bin_ = b[off + 8:off + 8 + bl]
    return j, bin_

def acc(j, bin_, i):
    a = j['accessors'][i]; bv = j['bufferViews'][a['bufferView']]
    dt = CT[a['componentType']]; nc = NC[a['type']]
    start = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = bv.get('byteStride') or nc * np.dtype(dt).itemsize
    n = a['count']
    if stride == nc * np.dtype(dt).itemsize:
        arr = np.frombuffer(bin_, dtype=dt, count=n * nc, offset=start).reshape(n, nc)
    else:
        arr = np.ndarray((n, nc), dtype=dt, buffer=bin_, offset=start, strides=(stride, np.dtype(dt).itemsize))
    return np.array(arr)

def quat_mat(q):
    x, y, z, w = q
    return np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)],
                     [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)],
                     [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])

def node_matrix(n):
    if 'matrix' in n:
        return np.array(n['matrix']).reshape(4, 4).T
    M = np.eye(4)
    R = quat_mat(n.get('rotation', [0, 0, 0, 1]))
    S = np.diag(n.get('scale', [1, 1, 1]))
    M[:3, :3] = R @ S
    M[:3, 3] = n.get('translation', [0, 0, 0])
    return M

def meshes(fn):
    """-> {nazwa_węzła: {pos (n,3) lokalne, idx (m,3) lub None, M 4x4}}"""
    j, bin_ = load(fn)
    out = {}
    for n in j['nodes']:
        if 'mesh' not in n: continue
        m = j['meshes'][n['mesh']]
        pos = []; idx = []; base = 0
        for p in m['primitives']:
            P = acc(j, bin_, p['attributes']['POSITION']).astype(np.float64)
            pos.append(P)
            if 'indices' in p: idx.append(acc(j, bin_, p['indices']).astype(np.int64).reshape(-1, 3) + base)
            base += len(P)
        out[n['name']] = {'pos': np.vstack(pos), 'idx': np.vstack(idx) if idx else None, 'M': node_matrix(n)}
    return out

def world(mesh):
    M = mesh['M']; P = mesh['pos']
    return P @ M[:3, :3].T + M[:3, 3]
