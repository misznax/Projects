"""Dodaje do data/data.json stawy kończyny dolnej, kręgosłupa i szyi (biodro, kolano, kostka, stopa, kręgosłup) z parami ruch–mięśnie.
Idempotentne: usuwa wcześniej dodane stawy o tych id. Uruchamiać: cd /tmp && python3 -I /home/claude/work/app/tools/add_joints.py"""
import sys, json
sys.path.insert(0, '/home/claude/work/app/tools')
import numpy as np, glbread as g
import pose_geom as pg

PUB = pg.PUB; DP = '/home/claude/work/app/data/data.json'
D = json.load(open(DP, encoding='utf-8'))
W = {}
for f in ('trunk.glb', 'lower.glb', 'bones.glb', 'axial.glb'):
    for k, m in g.meshes(PUB + f).items(): W[k] = g.world(m)
r5 = lambda v: [round(float(x), 5) for x in v]

# --- środki stawów
fem = W['Q001']; c0 = np.array([-0.06, 0.85, -0.01])
for _ in range(8):
    d = np.linalg.norm(fem - c0, axis=1); sel = fem[(d > 0.015) & (d < 0.032) & (fem[:, 1] > 0.80) & (fem[:, 0] > -0.095)]
    c0, hr = pg.sphere_fit(sel)
HIP = c0
tib = W['Q115']
KNEE = (fem[fem[:, 1] < 0.48].mean(0) + tib[tib[:, 1] > 0.403].mean(0)) / 2
ANK = W['Q113'][W['Q113'][:, 1] > 0.07].mean(0)
STJ = (W['Q113'].mean(0) + W['Q100'].mean(0)) / 2
mt = []
for k in ['Q104', 'Q112', 'Q114', 'Q105', 'Q103']:
    P = W[k]; mt.append(P[P[:, 2] > P[:, 2].max() - 0.012].mean(0))
cen = lambda k: W[k].mean(0)
lumb = [cen(k) for k in ['Q004', 'Q005', 'Q006', 'Q007', 'Q008']]
thor = [cen(k) for k in ['B047', 'B051', 'B052', 'B053', 'B054', 'B055', 'B056', 'B057', 'B058', 'B048', 'B049', 'B050']]
cerv = [cen(k) for k in ['S001', 'S021', 'S022', 'S023', 'S024', 'B046']]
mid = lambda L: [(L[i] + L[i + 1]) / 2 for i in range(len(L) - 1)]
SI_ = (W['Q003'][W['Q003'][:, 0] < -0.02].mean(0))

T = 'm. te same mięśnie po stronie przeciwnej'
J = [
 dict(id='J_hip', pl='Staw biodrowy', la='Articulatio coxae', reg='tulow', rodzaj='prosty', shape='kulisty', ksztalt='kulisty (panewkowy, głęboki)', osie='3', n=2,
  pow='Głowa kości udowej ↔ panewka kości miednicznej (pogłębiona obrąbkiem stawowym).',
  cechy='Staw nośny: głęboka panewka i mocna torebka z więzadłami biodrowo-udowym, kulszowo-udowym i łonowo-udowym. Mniejszy zakres niż w barku, za to duża stabilność. Zakres zdrowy (AAOS): zgięcie ok. 120°, wyprost 20°, odwodzenie 45°, przywodzenie 30°, rotacja wewnętrzna 45° i zewnętrzna 45°.',
  piet=False, alt='staw biodra', bones=['Q002', 'Q001'], caps=[], marks=[dict(p=r5(HIP), r=round(float(hr), 4))], mid=False, parent=None, children=[],
  pairs=[['Zgięcie', ['iliopsoas', 'rectfem', 'sartorius', 'tfl', 'pectineus', 'addlong'], 'Wyprost', ['glutmax', 'bicfem', 'semitend', 'semimem', 'addmag']],
         ['Odwodzenie', ['glutmed', 'glutmin', 'tfl', 'piriformis', 'sartorius'], 'Przywodzenie', ['addlong', 'addbrev', 'addmag', 'gracilis', 'pectineus']],
         ['Rotacja zewnętrzna', ['piriformis', 'gemelli', 'obtint', 'obtext', 'qfem', 'glutmax', 'sartorius'], 'Rotacja wewnętrzna', ['glutmin', 'tfl', 'glutmed']]]),
 dict(id='J_si', pl='Staw krzyżowo-biodrowy', la='Articulatio sacroiliaca', reg='tulow', rodzaj='prosty (amfiartroza)', shape='plaski', ksztalt='płaski (prawie nieruchomy)', osie='0 (ślizg 1–3°)', n=2,
  pow='Powierzchnie uszkowate kości krzyżowej ↔ kości biodrowej.', cechy='Praktycznie nieruchomy, bardzo silne więzadła; przenosi ciężar tułowia na miednicę i kończyny dolne.',
  piet=False, alt='', bones=['Q003', 'Q002'], caps=[], marks=[dict(p=r5(SI_), r=0.011)], mid=False, parent=None, children=[], pairs=[]),
 dict(id='J_lum', pl='Stawy międzykręgowe lędźwiowe', la='Articulationes intervertebrales lumbales', reg='tulow', rodzaj='złożony (krążek międzykręgowy + stawy maziówkowe)', shape='nieregularny', ksztalt='trzon–krążek–trzon i stawy wyrostków stawowych', osie='3 (zgięcie–wyprost, skłon boczny, niewielka rotacja)', n=8,
  pow='Trzony kręgów L1–L5 połączone krążkami międzykręgowymi oraz stawy między wyrostkami stawowymi sąsiednich kręgów.',
  cechy='Odcinek lędźwiowy: duża ruchomość w zgięciu (ok. 60°) i wyproście (ok. 25°), skłon boczny ok. 25° na stronę, rotacja tylko ok. 5° — ogranicza ją ustawienie powierzchni stawowych.',
  piet=False, alt='kręgosłup lędźwiowy', bones=['Q004', 'Q005', 'Q006', 'Q007', 'Q008', 'Q003'], caps=[], marks=[dict(p=r5(p), r=0.012) for p in mid([lumb[0]] + lumb)] , mid=True, parent=None, children=[],
  pairs=[['Skłon do przodu (zgięcie)', ['rectabd', 'extobl', 'intobl', 'iliopsoas'], 'Odgięcie (wyprost)', ['iliocostalis', 'longissimus', 'spinalis', 'multifidus', 'ql', 'rotatores', 'interspinales']],
         ['Skłon boczny w jedną stronę', ['ql', 'extobl', 'intobl', 'intertrans', 'iliocostalis'], 'Skłon boczny w stronę przeciwną', [T]],
         ['Rotacja w stronę przeciwną (kontralateralnie)', ['extobl', 'multifidus', 'rotatores'], 'Rotacja w tę samą stronę (ipsilateralnie)', ['intobl', 'iliocostalis']]]),
 dict(id='J_thor', pl='Stawy międzykręgowe piersiowe i żebrowo-kręgowe', la='Articulationes intervertebrales thoracicae et costovertebrales', reg='tulow', rodzaj='złożony (krążek + stawy maziówkowe + żebra)', shape='nieregularny', ksztalt='trzon–krążek–trzon, stawy wyrostków i stawy żebrowo-kręgowe', osie='3 (rotacja główna, skłon boczny, niewielkie zgięcie)', n=24,
  pow='Trzony kręgów Th1–Th12 połączone krążkami, stawy wyrostków stawowych oraz stawy głów i guzków żeber z kręgami.',
  cechy='Klatka piersiowa ogranicza zgięcie (ok. 45°) i wyprost (ok. 25°); za to rotacja jest tu największa w kręgosłupie (ok. 35° na stronę), skłon boczny ok. 25°.',
  piet=False, alt='kręgosłup piersiowy', bones=['B047', 'B051', 'B052', 'B053', 'B054', 'B055', 'B056', 'B057', 'B058', 'B048', 'B049', 'B050'], caps=[], marks=[dict(p=r5(p), r=0.011) for p in thor], mid=True, parent=None, children=[],
  pairs=[['Skłon do przodu (zgięcie)', ['rectabd', 'extobl', 'intobl'], 'Odgięcie (wyprost)', ['iliocostalis', 'longissimus', 'spinalis', 'semithor', 'multifidus', 'rotatores', 'interspinales']],
         ['Skłon boczny w jedną stronę', ['extobl', 'intobl', 'intertrans', 'iliocostalis', 'longissimus', 'ql'], 'Skłon boczny w stronę przeciwną', [T]],
         ['Rotacja w stronę przeciwną (kontralateralnie)', ['extobl', 'multifidus', 'rotatores', 'semithor'], 'Rotacja w tę samą stronę (ipsilateralnie)', ['intobl', 'iliocostalis']]]),
 dict(id='J_cerv', pl='Stawy międzykręgowe szyjne (C2–C7)', la='Articulationes intervertebrales cervicales', reg='glowa', rodzaj='złożony (krążek + stawy maziówkowe + półksiężycowate)', shape='nieregularny', ksztalt='trzon–krążek–trzon i stawy wyrostków stawowych', osie='3 (zgięcie–wyprost, skłon boczny, rotacja)', n=10,
  pow='Trzony kręgów C2–C7 połączone krążkami (ze szparami półksiężycowatymi) oraz stawy między wyrostkami stawowymi.',
  cechy='Zgięcie szyi ok. 45–50°, wyprost ok. 70°, skłon boczny ok. 40° i rotacja ok. 50° na stronę (z atlasem i obrotowym razem do 80–90°).',
  piet=False, alt='kręgosłup szyjny', bones=['S001', 'S021', 'S022', 'S023', 'S024', 'B046'], caps=[], marks=[dict(p=r5(p), r=0.011) for p in mid(cerv)], mid=True, parent=None, children=[],
  pairs=[['Skłon szyi (zgięcie)', ['longuscolli', 'scm', 'scalenea', 'scaleneb', 'scalenec'], 'Odgięcie szyi (wyprost)', ['splcerv', 'semicerv', 'multcerv', 'longcap', 'spincap', 'levator', 'trapezius']],
         ['Skłon boczny w jedną stronę', ['scalenea', 'scaleneb', 'scalenec', 'scm', 'levator', 'splcerv', 'longuscolli'], 'Skłon boczny w stronę przeciwną', [T]],
         ['Rotacja w stronę przeciwną (kontralateralnie)', ['scm', 'semicerv', 'multcerv'], 'Rotacja w tę samą stronę (ipsilateralnie)', ['splcerv', 'levator', 'scalenea', 'scaleneb', 'scalenec']]]),
 dict(id='J_knee', pl='Staw kolanowy', la='Articulatio genus', reg='podudzie', rodzaj='złożony (staw udowo-piszczelowy + udowo-rzepkowy)', shape='zawiasowy', ksztalt='zawiasowo-obrotowy (kłykciowy, z łąkotkami)', osie='1 (zgięcie–wyprost) + rotacja przy zgiętym kolanie', n=6,
  pow='Kłykcie kości udowej ↔ kłykcie piszczeli (z łąkotkami) oraz rzepka ↔ powierzchnia rzepkowa kości udowej.',
  cechy='Największy staw ciała; stabilizują go więzadła poboczne i krzyżowe oraz łąkotki. Zakres: zgięcie ok. 135–140°, wyprost 0° (do −5°). Rotacja możliwa tylko przy zgiętym kolanie (wewnętrzna ok. 10°, zewnętrzna ok. 20°).',
  piet=False, alt='staw kolana', bones=['Q001', 'Q115', 'Q110'], caps=[], marks=[dict(p=r5(KNEE), r=0.022)], mid=False, parent=None, children=[],
  pairs=[['Zgięcie', ['bicfem', 'semitend', 'semimem', 'gracilis', 'sartorius', 'gastroc', 'popliteus', 'plantaris'], 'Wyprost', ['rectfem', 'vastlat', 'vastmed', 'vastint']],
         ['Rotacja wewnętrzna (przy zgiętym kolanie)', ['semitend', 'semimem', 'popliteus', 'sartorius', 'gracilis'], 'Rotacja zewnętrzna (przy zgiętym kolanie)', ['bicfem']]]),
 dict(id='J_ankle', pl='Staw skokowo-goleniowy (górny staw skokowy)', la='Articulatio talocruralis', reg='podudzie', rodzaj='prosty', shape='zawiasowy', ksztalt='zawiasowy (bloczkowy, „widełki” goleni)', osie='1', n=2,
  pow='Kostki goleni (piszczelowa i strzałkowa) tworzące „widełki” ↔ bloczek kości skokowej.',
  cechy='Zgięcie grzbietowe do ok. 20°, podeszwowe do ok. 50°. Stabilizują go więzadło trójgraniaste (przyśrodkowo) i więzadła boczne (skokowo-strzałkowe i piętowo-strzałkowe) — najczęściej ulegają skręceniu.',
  piet=False, alt='staw skokowy górny, kostka', bones=['Q115', 'Q102', 'Q113'], caps=[], marks=[dict(p=r5(ANK), r=0.016)], mid=False, parent=None, children=[],
  pairs=[['Zgięcie grzbietowe (unoszenie stopy)', ['tibant', 'edl', 'ehl', 'fibtert'], 'Zgięcie podeszwowe (opuszczanie stopy)', ['gastroc', 'soleus', 'plantaris', 'tibpost', 'fdl', 'fhl', 'fiblong', 'fibbrev']]]),
 dict(id='J_stj', pl='Staw podskokowy (skokowo-piętowy i skokowo-piętowo-łódkowy)', la='Articulatio subtalaris et talocalcaneonavicularis', reg='podudzie', rodzaj='złożony', shape='nieregularny', ksztalt='nieregularny (ślizg skośny)', osie='1 (skośna): inwersja–ewersja', n=4,
  pow='Kość skokowa ↔ piętowa oraz skokowa ↔ łódkowata.',
  cechy='Odpowiada za przechylanie stopy na boki (inwersja ok. 35°, ewersja ok. 15°); razem ze stawem poprzecznym stępu dopasowuje stopę do nierówności podłoża.',
  piet=False, alt='staw podtalarny', bones=['Q113', 'Q100', 'Q109'], caps=[], marks=[dict(p=r5(STJ), r=0.014)], mid=False, parent=None, children=[],
  pairs=[['Inwersja (podeszwa do środka)', ['tibant', 'tibpost', 'fdl', 'fhl'], 'Ewersja (podeszwa na zewnątrz)', ['fiblong', 'fibbrev', 'fibtert']]]),
 dict(id='J_mtp', pl='Stawy śródstopno-paliczkowe (MTP)', la='Articulationes metatarsophalangeae', reg='podudzie', rodzaj='prosty (5 stawów)', shape='elipsoidalny', ksztalt='elipsoidalny (kłykciowy)', osie='2 (zgięcie–wyprost, odwodzenie–przywodzenie)', n=2,
  pow='Głowy kości śródstopia ↔ podstawy paliczków bliższych.', cechy='Wyprost palucha (do ok. 70°) jest kluczowy w fazie odbicia podczas chodu i biegu.',
  piet=False, alt='stawy palców stopy', bones=['Q104', 'Q112', 'Q114', 'Q105', 'Q103', 'Q111'], caps=[], marks=[dict(p=r5(p), r=0.008) for p in mt], mid=False, parent=None, children=[],
  pairs=[['Zgięcie palców', ['fdl', 'fhl', 'fdbrev', 'fhbrev', 'quadpl', 'lumbf', 'fdmf', 'intpf'], 'Wyprost palców', ['edl', 'ehl', 'edb', 'ehb']],
         ['Odwodzenie palców', ['abdhall', 'abddmf', 'intdf'], 'Przywodzenie palców', ['addhall', 'intpf']]]),
]
ids = {j['id'] for j in J}
bad = []
for j in J:
    for pr in j['pairs']:
        for lst in (pr[1], pr[3]):
            for k in lst:
                if k not in D['groups'] and not k.startswith('m. '): bad.append((j['id'], k))
    for b in j['bones']:
        if b not in {x['id'] for x in D['bones']}: bad.append((j['id'], 'kość ' + b))
print('brakujące klucze:', bad)
D['joints'] = [j for j in D['joints'] if j['id'] not in ids] + J
json.dump(D, open(DP, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('stawów:', len(D['joints']))
