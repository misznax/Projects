/* Jądro skinningu pozy: dual-quaternion skinning (bez zapadania mięśni przy dużych kątach) + wypychanie wierzchołków z kości (owijanie).
   Czyste funkcje na tablicach typowanych (testowalne bez przeglądarki). Wszystko w układzie świata modelu. */

/* segment: kwaternion q (x,y,z,w; ciągły względem parametrów pozy — bez zmiany półkuli) i translacja t, p' = R(q) p + t */
export function segDQ(QR, QD, i, q, t) {
  const o = i * 4; QR[o] = q.x; QR[o + 1] = q.y; QR[o + 2] = q.z; QR[o + 3] = q.w;
  const tx = t[0], ty = t[1], tz = t[2];
  QD[o] = 0.5 * (tx * q.w + ty * q.z - tz * q.y);
  QD[o + 1] = 0.5 * (-tx * q.z + ty * q.w + tz * q.x);
  QD[o + 2] = 0.5 * (tx * q.y - ty * q.x + tz * q.w);
  QD[o + 3] = 0.5 * (-tx * q.x - ty * q.y - tz * q.z);
}

/* W: 8 B/wierzchołek [4 id segmentów, 4 wagi 0..255]; p0/n0: pozycje i normalne (świat); wynik do P/N */
export function skinDQ(cnt, W, p0, n0, QR, QD, P, N, mix) {
  const lbs = mix > 0; // mix 0 = czysty DQS; >0 = domieszka LBS (kontrola „wybrzuszeń”)
  for (let i = 0; i < cnt; i++) {
    const b = i * 8, i3 = i * 3, x = p0[i3], y = p0[i3 + 1], z = p0[i3 + 2];
    let qx = 0, qy = 0, qz = 0, qw = 0, dx = 0, dy = 0, dz = 0, dw = 0, ok = false;
    for (let k = 0; k < 4; k++) {
      const w8 = W[b + 4 + k]; if (!w8) break; const w = w8 / 255, o = W[b + k] * 4; ok = true;
      qx += w * QR[o]; qy += w * QR[o + 1]; qz += w * QR[o + 2]; qw += w * QR[o + 3];
      dx += w * QD[o]; dy += w * QD[o + 1]; dz += w * QD[o + 2]; dw += w * QD[o + 3];
    }
    const n = Math.hypot(qx, qy, qz, qw);
    if (!ok || n < 1e-9) { P[i3] = x; P[i3 + 1] = y; P[i3 + 2] = z; if (n0) { N[i3] = n0[i3]; N[i3 + 1] = n0[i3 + 1]; N[i3 + 2] = n0[i3 + 2]; } continue; }
    const iv = 1 / n; qx *= iv; qy *= iv; qz *= iv; qw *= iv; dx *= iv; dy *= iv; dz *= iv; dw *= iv;
    const dd = qx * dx + qy * dy + qz * dz + qw * dw; dx -= qx * dd; dy -= qy * dd; dz -= qz * dd; dw -= qw * dd;
    // t = 2 * D * conj(q)
    const tx = 2 * (-dw * qx + dx * qw - dy * qz + dz * qy), ty = 2 * (-dw * qy + dx * qz + dy * qw - dz * qx), tz = 2 * (-dw * qz - dx * qy + dy * qx + dz * qw);
    // R(q) p
    let c1x = qy * z - qz * y, c1y = qz * x - qx * z, c1z = qx * y - qy * x;
    let px = x + 2 * (qw * c1x + qy * c1z - qz * c1y) + tx, py = y + 2 * (qw * c1y + qz * c1x - qx * c1z) + ty, pz = z + 2 * (qw * c1z + qx * c1y - qy * c1x) + tz;
    if (n0) {
      const a = n0[i3], bb = n0[i3 + 1], c = n0[i3 + 2];
      c1x = qy * c - qz * bb; c1y = qz * a - qx * c; c1z = qx * bb - qy * a;
      N[i3] = a + 2 * (qw * c1x + qy * c1z - qz * c1y); N[i3 + 1] = bb + 2 * (qw * c1y + qz * c1x - qx * c1z); N[i3 + 2] = c + 2 * (qw * c1z + qx * c1y - qy * c1x);
    }
    P[i3] = px; P[i3 + 1] = py; P[i3 + 2] = pz;
  }
}

/* LBS dla porównania: Mw[i] = 12 liczb (kolumnowo 3x4: r00 r10 r20 r01 r11 r21 r02 r12 r22 tx ty tz) */
export function skinLBS(cnt, W, p0, n0, MA, P, N) {
  for (let i = 0; i < cnt; i++) {
    const b = i * 8, i3 = i * 3, x = p0[i3], y = p0[i3 + 1], z = p0[i3 + 2];
    let px = 0, py = 0, pz = 0, nx = 0, ny = 0, nz = 0; const a = n0 ? n0[i3] : 0, bb = n0 ? n0[i3 + 1] : 0, c = n0 ? n0[i3 + 2] : 0;
    for (let k = 0; k < 4; k++) {
      const w8 = W[b + 4 + k]; if (!w8) break; const w = w8 / 255, m = W[b + k] * 12;
      px += w * (MA[m] * x + MA[m + 3] * y + MA[m + 6] * z + MA[m + 9]); py += w * (MA[m + 1] * x + MA[m + 4] * y + MA[m + 7] * z + MA[m + 10]); pz += w * (MA[m + 2] * x + MA[m + 5] * y + MA[m + 8] * z + MA[m + 11]);
      nx += w * (MA[m] * a + MA[m + 3] * bb + MA[m + 6] * c); ny += w * (MA[m + 1] * a + MA[m + 4] * bb + MA[m + 7] * c); nz += w * (MA[m + 2] * a + MA[m + 5] * bb + MA[m + 8] * c);
    }
    P[i3] = px; P[i3 + 1] = py; P[i3 + 2] = pz; if (n0) { const l = Math.hypot(nx, ny, nz) || 1; N[i3] = nx / l; N[i3 + 1] = ny / l; N[i3 + 2] = nz / l; }
  }
}

/* SDF: {o:[3], h, n:[3], d:Int16Array (jednostka 0.1 mm)}; zwraca odległość i gradient (analityczny, trilinear) lub false poza siatką */
const G = { d: 0, gx: 0, gy: 0, gz: 0 };
export function sdfSample(S, x, y, z) {
  const h = S.h, fx = (x - S.o[0]) / h, fy = (y - S.o[1]) / h, fz = (z - S.o[2]) / h;
  const nx = S.n[0], ny = S.n[1], nz = S.n[2];
  const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz);
  if (ix < 0 || iy < 0 || iz < 0 || ix >= nx - 1 || iy >= ny - 1 || iz >= nz - 1) return false;
  const tx = fx - ix, ty = fy - iy, tz = fz - iz, D = S.d, sy = nz, sx = ny * nz, o = ix * sx + iy * sy + iz;
  const c000 = D[o], c001 = D[o + 1], c010 = D[o + sy], c011 = D[o + sy + 1], c100 = D[o + sx], c101 = D[o + sx + 1], c110 = D[o + sx + sy], c111 = D[o + sx + sy + 1];
  const ux = 1 - tx, uy = 1 - ty, uz = 1 - tz;
  G.d = 1e-4 * (ux * (uy * (uz * c000 + tz * c001) + ty * (uz * c010 + tz * c011)) + tx * (uy * (uz * c100 + tz * c101) + ty * (uz * c110 + tz * c111)));
  const k = 1e-4 / h;
  G.gx = k * (uy * (uz * (c100 - c000) + tz * (c101 - c001)) + ty * (uz * (c110 - c010) + tz * (c111 - c011)));
  G.gy = k * (ux * (uz * (c010 - c000) + tz * (c011 - c001)) + tx * (uz * (c110 - c100) + tz * (c111 - c101)));
  G.gz = k * (ux * (uy * (c001 - c000) + ty * (c011 - c010)) + tx * (uy * (c101 - c100) + ty * (c111 - c110)));
  return G;
}

/* Wypychanie z kości: C = Int8Array 4 B/wierzchołek [seg1, c1, seg2, c2] (c w jednostkach 0.5 mm = wymagany odstęp od kości);
   INV[s] = 12 liczb (odwrotność macierzy segmentu), ROT[s] = 9 liczb (część obrotowa segmentu) */
export function collide(cnt, C, SDF, INV, ROT, P, passes = 2) {
  let moved = 0;
  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < cnt; i++) {
      for (let j = 0; j < 2; j++) {
        const s = C[i * 4 + 2 * j]; if (!s) continue; const S = SDF[s]; if (!S) continue;
        const i3 = i * 3, X = P[i3], Y = P[i3 + 1], Z = P[i3 + 2], m = INV[s];
        const g = sdfSample(S, m[0] * X + m[3] * Y + m[6] * Z + m[9], m[1] * X + m[4] * Y + m[7] * Z + m[10], m[2] * X + m[5] * Y + m[8] * Z + m[11]);
        if (!g) continue;
        const need = C[i * 4 + 2 * j + 1] * 0.0005; if (g.d >= need) continue;
        const gl = Math.hypot(g.gx, g.gy, g.gz); if (gl < 1e-6) continue;
        const push = Math.min(0.06, need - g.d) / gl, r = ROT[s];
        const lx = g.gx * push, ly = g.gy * push, lz = g.gz * push;
        P[i3] += r[0] * lx + r[3] * ly + r[6] * lz; P[i3 + 1] += r[1] * lx + r[4] * ly + r[7] * lz; P[i3 + 2] += r[2] * lx + r[5] * ly + r[8] * lz; moved++;
      }
    }
  }
  return moved;
}

/* LBS osi + obrócona delta (grubość i szczegóły): p' = LBS(p0 − D) + R(q_mieszane)·D. Przy wadze 100% na jednym segmencie = ruch sztywny.
   D = delta względem wygładzonej siatki (liczona offline), q_mieszane = znormalizowana średnia kwaternionów (bez zmiany półkuli). */
export function skinDelta(cnt, W, p0, D, n0, MA, QR, P, N) {
  for (let i = 0; i < cnt; i++) {
    const b = i * 8, i3 = i * 3, dx = D[i3], dy = D[i3 + 1], dz = D[i3 + 2], sx = p0[i3] - dx, sy = p0[i3 + 1] - dy, sz = p0[i3 + 2] - dz;
    let px = 0, py = 0, pz = 0, qx = 0, qy = 0, qz = 0, qw = 0, ok = false;
    for (let k = 0; k < 4; k++) {
      const w8 = W[b + 4 + k]; if (!w8) break; const w = w8 / 255, sg = W[b + k], m = sg * 12, o = sg * 4; ok = true;
      px += w * (MA[m] * sx + MA[m + 3] * sy + MA[m + 6] * sz + MA[m + 9]); py += w * (MA[m + 1] * sx + MA[m + 4] * sy + MA[m + 7] * sz + MA[m + 10]); pz += w * (MA[m + 2] * sx + MA[m + 5] * sy + MA[m + 8] * sz + MA[m + 11]);
      qx += w * QR[o]; qy += w * QR[o + 1]; qz += w * QR[o + 2]; qw += w * QR[o + 3];
    }
    const n = Math.hypot(qx, qy, qz, qw);
    if (!ok || n < 1e-9) { P[i3] = p0[i3]; P[i3 + 1] = p0[i3 + 1]; P[i3 + 2] = p0[i3 + 2]; if (n0) { N[i3] = n0[i3]; N[i3 + 1] = n0[i3 + 1]; N[i3 + 2] = n0[i3 + 2]; } continue; }
    const iv = 1 / n; qx *= iv; qy *= iv; qz *= iv; qw *= iv;
    let c1x = qy * dz - qz * dy, c1y = qz * dx - qx * dz, c1z = qx * dy - qy * dx;
    P[i3] = px + dx + 2 * (qw * c1x + qy * c1z - qz * c1y); P[i3 + 1] = py + dy + 2 * (qw * c1y + qz * c1x - qx * c1z); P[i3 + 2] = pz + dz + 2 * (qw * c1z + qx * c1y - qy * c1x);
    if (n0) {
      const a = n0[i3], bb = n0[i3 + 1], c = n0[i3 + 2];
      c1x = qy * c - qz * bb; c1y = qz * a - qx * c; c1z = qx * bb - qy * a;
      N[i3] = a + 2 * (qw * c1x + qy * c1z - qz * c1y); N[i3 + 1] = bb + 2 * (qw * c1y + qz * c1x - qx * c1z); N[i3 + 2] = c + 2 * (qw * c1z + qx * c1y - qy * c1x);
    }
  }
}
