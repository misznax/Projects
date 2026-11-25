"""Geometria stawów kończyny górnej z modelu: środki obrotu i osie (współrzędne świata modelu, prawa strona)."""
import sys, json
sys.path.insert(0, '/home/claude/work/app/tools')
import numpy as np, glbread as g

PUB = '/home/claude/work/app/public/'
D = json.load(open('/home/claude/work/app/data/data.json'))
LM = {l['en'] + '|' + next(b['en'] for b in D['bones'] if b['id'] == l['bone']): np.array(l['p']) for l in D['lms']}
def lm(name, bone):
    return LM[name + '|' + bone]
unit = lambda v: v / np.linalg.norm(v)

def sphere_fit(P):
    A = np.c_[2 * P, np.ones(len(P))]; b = (P ** 2).sum(1)
    x, *_ = np.linalg.lstsq(A, b, rcond=None)
    c = x[:3]; r = np.sqrt(x[3] + c @ c); return c, r

def compute():
    B = g.meshes(PUB + 'bones.glb')
    W = {k: g.world(v) for k, v in B.items()}
    out = {}
    # --- staw ramienny: kula dopasowana do główki kości ramiennej
    hum = W['B017']
    c0 = np.array([-0.160, 1.388, -0.030])
    for _ in range(6):
        d = np.linalg.norm(hum - c0, axis=1)
        sel = hum[(d > 0.012) & (d < 0.034) & (hum[:, 1] > 1.36)]
        c0, r = sphere_fit(sel)
    out['gh'] = c0; out['gh_r'] = r
    # --- obojczyk: staw mostkowo-obojczykowy, barkowo-obojczykowy
    out['sc'] = np.mean([lm('Sternal articular surface', 'Clavicle'), lm('Sternal end', 'Clavicle')], 0)
    out['ac'] = np.mean([lm('Acromial facet', 'Clavicle'), lm('Clavicular facet', 'Scapula')], 0)
    # --- łopatka: normalna płaszczyzny ostrza (PCA wierzchołków)
    sc = W['B033']; cen = sc.mean(0)
    u, s, vt = np.linalg.svd(sc - cen, full_matrices=False)
    out['scap_n'] = vt[2]; out['scap_c'] = cen
    out['scap_ia'] = lm('Inferior angle of scapula', 'Scapula')
    out['scap_ac_ang'] = lm('Acromial angle', 'Scapula')
    # --- łokieć: oś zgięcia = linia nadkłykci (przyśrodkowy -> boczny), środek = ich środek
    me = lm('Medial epicondyle of humerus', 'Humerus'); le = lm('Lateral epicondyle of humerus', 'Humerus')
    out['el'] = (me + le) / 2; out['el_axis'] = unit(me - le)
    # --- przedramię: oś nawrotu = główka kości promieniowej -> główka kości łokciowej
    rh = np.mean([lm('Head of radius', 'Radius'), lm('Articular facet of head of radius', 'Radius')], 0)
    uh = np.mean([lm('Head of ulna', 'Ulna'), lm('Ulnar styloid process', 'Ulna')], 0)
    out['pr_a'] = rh; out['pr_b'] = uh; out['pr_axis'] = unit(rh - uh)
    # --- nadgarstek: środek = środek kości głowiastej i księżycowatej
    out['wr'] = np.mean([W['B001'].mean(0), W['B018'].mean(0)], 0)
    rs = lm('Radial styloid process', 'Radius'); us = lm('Ulnar styloid process', 'Ulna')
    out['rs'] = rs; out['us'] = us
    tip = W['B007'].mean(0)  # paliczek dalszy III
    out['tip'] = tip
    return out, W

if __name__ == '__main__':
    o, W = compute()
    for k, v in o.items(): print(k, np.round(v, 4))
