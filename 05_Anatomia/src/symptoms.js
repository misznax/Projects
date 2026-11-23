// Silnik analizy objawów — w pełni offline, bez AI. Okolica + czynniki → prawdopodobieństwa przyczyn → mięśnie, ćwiczenia.
// Prawdopodobieństwo = częstość przyczyny w danej okolicy × mnożniki czynników, znormalizowane do 100% w obrębie okolicy.
import { AREAS, TRIG, AREA_RX, EXW, EXR } from './kb_core.js';
import { COND_AXIAL } from './kb_axial.js';
import { COND_LIMBS } from './kb_limbs.js';
import { norm, matchLocal, normalize, sideHint, EXAMPLES as POS_EXAMPLES } from './analysis.js';

export { AREAS, TRIG, POS_EXAMPLES, sideHint };
export const CONDS = [...COND_AXIAL, ...COND_LIMBS];

export const SYMPTOM_EXAMPLES = [
  'Ból pleców po całym dniu przy biurku, najgorzej po wstaniu z krzesła',
  'Ból krzyża po dźwignięciu ciężkiego przedmiotu, schylanie boli',
  'Strzela mi w żuchwie przy ziewaniu, rano boli po nocnym zaciskaniu zębów',
  'Ból barku w nocy, nie mogę spać na boku ani unosić ręki nad głowę',
  'Ból kolana przy schodzeniu po schodach i po długim siedzeniu',
  'Kostka po skręceniu ciągle ucieka na nierównym terenie',
  'Ból pięty przy pierwszych krokach rano',
  'Ból z boku biodra, gdy leżę na boku',
  'Ból po zewnętrznej stronie łokcia przy chwytaniu i pracy myszką',
  'Ból karku i szyi po pracy przy laptopie',
];

const ALARM = {
  ledzwie: ['Drętwienie lub osłabienie nogi, „opadanie” stopy albo ból poniżej kolana', 'Problemy z oddawaniem moczu/stolca lub drętwienie krocza — pilnie do lekarza (SOR)', 'Ból nocny niezależny od pozycji, gorączka, nagła utrata masy ciała lub ból po urazie', 'Ból narastający lub niezmieniony mimo odpoczynku dłużej niż 2–3 tygodnie'],
  plecy_g: ['Ból w klatce piersiowej z dusznością, potami lub promieniujący do ręki / żuchwy — wezwij pomoc (112)', 'Osłabienie rąk lub nóg, drętwienie', 'Ból nocny, gorączka lub ból po urazie'],
  kark: ['Drętwienie lub osłabienie ręki, ból promieniujący do palców', 'Nagły, bardzo silny ból głowy, zawroty, zaburzenia widzenia, mowy lub równowagi — pilnie do lekarza', 'Ból po urazie (wypadek, upadek), gorączka z sztywnością karku'],
  zuchwa: ['Szczękościsk lub niemożność zamknięcia ust po urazie', 'Obrzęk twarzy, gorączka, silny ból zęba — stomatolog / laryngolog', 'Ból w klatce piersiowej promieniujący do żuchwy i lewej ręki — wezwij pomoc (112)'],
  bark: ['Niemożność uniesienia ręki lub nagłe osłabienie po urazie', 'Ból w klatce piersiowej promieniujący do ramienia — wezwij pomoc (112)', 'Obrzęk, zaczerwienienie, gorączka lub ból nocny niezależny od pozycji'],
  lokiec: ['Drętwienie palców, osłabienie chwytu lub „upuszczanie” przedmiotów', 'Nagły „strzał” w łokciu i osłabienie zginania lub prostowania', 'Obrzęk, zaczerwienienie, gorączka lub ból po urazie'],
  nadgarstek: ['Postępujące drętwienie, zanik mięśni kłębu kciuka', 'Obrzęk, zaczerwienienie, gorączka lub ból po upadku na rękę', 'Ból nocny niezmieniony mimo odpoczynku dłużej niż 3–4 tygodnie'],
  biodro: ['Niemożność obciążenia nogi po upadku lub urazie', 'Gorączka, zaczerwienienie lub obrzęk biodra, ból nocny niezależny od pozycji', 'Drętwienie lub osłabienie nogi, zaburzenia kontroli pęcherza/stolca — pilnie'],
  udo: ['Silny ból, obrzęk i krwiak po urazie z niemożnością obciążenia nogi', 'Obrzęk i ból jednej nogi z ciepłem lub zaczerwienieniem (możliwa zakrzepica) — pilnie', 'Drętwienie lub osłabienie nogi'],
  kolano: ['Brak możliwości obciążenia nogi, całkowite zablokowanie kolana lub nagła niestabilność po urazie', 'Obrzęk z ciepłem, zaczerwienieniem i gorączką (możliwe zapalenie stawu)', 'Ból i obrzęk łydki, ciepło, zaczerwienienie — pilnie (zakrzepica)'],
  podudzie: ['Jednostronny obrzęk, ból, ciepło i zaczerwienienie łydki — pilnie (zakrzepica żył głębokich)', 'Nagły ból łydki po „kopnięciu” w tył (możliwe zerwanie ścięgna Achillesa)', 'Drętwienie stopy, silny ból niereagujący na odpoczynek, ból po urazie'],
  kostka: ['Niemożność obciążenia stopy po urazie lub wyraźna deformacja', 'Obrzęk z zasinieniem po skręceniu utrzymujący się ponad 1–2 tygodnie', 'Zaczerwienienie, ciepło, gorączka lub ból nocny niezależny od pozycji'],
};
const SIDE_TXT = { r: 'prawa strona', l: 'lewa strona', b: 'obie strony' };

// powiązanie wzorców pozycji (SCEN) z okolicą i czynnikami — gdy użytkownik opisze tylko pozycję
const SCEN_MAP = {
  dziecka: ['ledzwie', ['ulga_zgiecie']], siedzenie: ['ledzwie', ['siedz']], sklon: ['ledzwie', ['schyl']],
  bok_biodra: ['biodro', ['bok_lez', 'jedna_noga']], gruszkowaty: ['biodro', ['siedz', 'promien']], kark: ['kark', ['tel']],
  bark_lopatki: ['plecy_g', ['siedz', 'tel']], lokiec: ['lokiec', ['chwyt', 'powtarzal']], deska: ['ledzwie', ['ciezar_tr']],
};

const AREA_RXC = Object.fromEntries(Object.entries(AREA_RX).map(([k, v]) => [k, new RegExp(v, 'g')]));
const TRIG_RXC = Object.fromEntries(Object.entries(TRIG).map(([k, [, r]]) => [k, new RegExp(r)]));
const AMAP = Object.fromEntries(AREAS.map((a) => [a.id, a]));

// wolny tekst → okolica + czynniki (do podglądu w formularzu i do analizy)
export function parseText(q) {
  const t = norm(q); const out = { area: null, triggers: new Set(), side: null, scen: null };
  if (t.length < 3) return out;
  let bs = 0;
  for (const a of AREAS) { const m = t.match(AREA_RXC[a.id]); const sc = m ? m.length : 0; if (sc > bs) { bs = sc; out.area = a.id; } }
  for (const [k, rx] of Object.entries(TRIG_RXC)) if (rx.test(t)) out.triggers.add(k);
  const sh = sideHint(q); out.side = sh;
  const loc = matchLocal(q); if (loc) out.scen = loc;
  if (!out.area && loc && SCEN_MAP[loc.res.id]) { const [a, tr] = SCEN_MAP[loc.res.id]; out.area = a; for (const x of tr) out.triggers.add(x); }
  if (out.area) for (const x of [...out.triggers]) if (!AMAP[out.area].tr.includes(x)) out.triggers.delete(x);
  return out;
}

const INV = { 3: 0.9, 2: 0.6, 1: 0.3 };
const short = (s) => s.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

// has: (klucz) => czy istnieje taka grupa mięśniowa (bez powięzi)
export function analyze({ area, triggers, side, text }, has) {
  const A = AMAP[area]; if (!A) return null;
  const sel = [...(triggers || [])].filter((x) => A.tr.includes(x));
  const list = CONDS.filter((c) => c.a.includes(area));
  let sc = list.map((c) => { let s = c.pr * ((c.ps && c.ps[area]) || 1); for (const x of sel) if (c.t[x]) s *= c.t[x]; return { c, s }; });
  const sum = sc.reduce((a, b) => a + b.s, 0) || 1; sc.forEach((x) => { x.p = x.s / sum; }); sc.sort((a, b) => b.p - a.p);
  const top = sc.filter((x) => x.p >= 0.04).slice(0, 6);
  const przyczyny = top.map((x) => ({ t: x.c.n, dlaczego: x.c.o, pct: Math.round(x.p * 100), m: x.c.m.filter(([k]) => has(k)) }));
  // mięśnie: P(mięsień zaangażowany) = 1 − Π(1 − P(przyczyny) · udział)
  const mm = new Map();
  for (const x of sc) {
    if (x.p < 0.02) continue;
    for (const [k, w, part] of x.c.m) {
      if (!has(k)) continue; let e = mm.get(k); if (!e) { e = { k, q: 1, parts: [], any: false, by: [] }; mm.set(k, e); }
      e.q *= 1 - x.p * INV[w]; e.by.push([x.c.n, x.p]);
      if (part) e.parts.push(part); else e.any = true;
    }
  }
  const miesnie = [...mm.values()].map((e) => ({ k: e.k, pct: Math.round((1 - e.q) * 100), p: e.any || !e.parts.length ? '' : [...new Set(e.parts)].join('|'), by: e.by.sort((a, b) => b[1] - a[1]).slice(0, 2).map((z) => short(z[0])) }))
    .filter((m) => m.pct >= 8).sort((a, b) => b.pct - a.pct).slice(0, 12)
    .map((m) => ({ ...m, rola: m.pct >= 40 ? 'g' : m.pct >= 22 ? 'p' : 's', opis: 'Dotyczy: ' + m.by.join('; ') }));
  const agg = (key, ex, fb) => {
    const m = new Map();
    for (const x of sc) { if (x.p < 0.03) continue; for (const k of x.c[key]) { if (!has(k)) continue; const e = m.get(k) || { k, s: 0, by: [] }; e.s += x.p; e.by.push([x.c.n, x.p]); m.set(k, e); } }
    return [...m.values()].sort((a, b) => b.s - a.s).slice(0, 6).map((e) => ({ k: e.k, s: e.s, przez: e.by.sort((a, b) => b[1] - a[1]).slice(0, 2).map((z) => short(z[0])), ...ex(e.k, fb) }));
  };
  const oslabione = agg('w', (k) => { const x = EXW[k] || ['Wzmacnianie poprawia stabilizację i odciąża bolesną okolicę.', 'Ćwiczenie izometryczne 3×20–30 s, potem dynamiczne 3×10–12 — pod kontrolą fizjoterapeuty.']; return { dlaczego: x[0], cwiczenie: x[1] }; });
  const rozciagac = agg('r', (k) => ({ jak: EXR[k] || 'Delikatne rozciąganie 20–30 s × 2–3, bez bólu; ewentualnie ciepło lub automasaż.' }));
  const labs = sel.map((x) => TRIG[x][0]);
  const t0 = top[0];
  const podsumowanie = (sel.length ? '' : 'Nie zaznaczono czynników — pokazuję najczęstsze przyczyny w tej okolicy. Zaznacz, kiedy boli, aby zawęzić wynik. ')
    + `Najbardziej prawdopodobne: ${short(t0.c.n)} (${Math.round(t0.p * 100)}%). ${t0.c.o}`;
  return {
    src: 'objawy', mode: 'objaw', id: area, area, pozycja: A.n, okolica: (side && SIDE_TXT[side] ? SIDE_TXT[side] + ' · ' : '') + (labs.length ? labs.join(', ') : 'bez dodatkowych czynników'), podsumowanie,
    widok: A.v === 'przod' ? 'przod' : A.v === 'tyl' ? 'tyl' : 'bok', przyczyny, miesnie, oslabione, rozciagac, alarm: ALARM[area] || [], trig: sel,
  };
}

// pełna analiza z formularza: łączy okolicę/czynniki wybrane przyciskami z rozpoznanymi z tekstu i (opcjonalnie) wzorcem pozycji
export function run({ area, triggers, side, text }, has) {
  const parsed = parseText(text || '');
  const a = area || parsed.area; if (!a) return null;
  const tr = new Set([...(triggers || []), ...(!area || area === parsed.area ? parsed.triggers : [])]);
  const res = analyze({ area: a, triggers: tr, side: side || parsed.side, text }, has);
  if (res && parsed.scen && (SCEN_MAP[parsed.scen.res.id] || [])[0] === a) {
    const poz = normalize(parsed.scen.res, has);
    if (poz.miesnie.length) res.poz = poz;
  }
  return res;
}
