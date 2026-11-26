/* MARKA Z AUTOMATU: fonty wbudowane (Barlow Condensed, Inter), paleta Śmiało, dane synchronizowane z Drive i Instagramu (public/*.json) */
const rgba = (hex, a) => { const [r, g, b] = hex2rgb(hex); return `rgba(${r},${g},${b},${a})`; };
// Wbudowana kopia marki (używana offline i zanim wczyta się brand.json). Źródło prawdy: .claude/instagram/kolory-marki.md w repo smialo (stan 19.11.2026).
const BRAND_BUILTIN = {
  updated: '2026-11-19', source: 'wbudowana kopia (kolory-marki.md, repo smialo)',
  colors: { primary: '#FF5A00', background: '#05070A', accent: '#FFE600' },
  pal: { a: '#FF5A00', m: '#FFA000', b: '#FFE600', v: '#8B6CFF', bg: '#05070A', sf: '#0B1014', ink: '#E9EDF2', mut: '#98A2AD', on: '#1A0800' },
  fonts: { heading: 'Barlow Condensed', body: 'Inter' }, handle: '@trenuj.smialo',
  style: 'Ciemne tło z fioletową i pomarańczową poświatą, gradient pomarańcz → żółć, szkło, nagłówki Barlow Condensed kursywą',
  rules: ['Tło ciemne #05070A, kolor główny pomarańcz → żółć, fiolet tylko jako akcent (10–20%).', 'Bez błękitu, cyjanu, limonki i magenty.', 'Napis na gradiencie pomarańcz → żółć: #1A0800 (nigdy biały).', 'Nagłówki: Barlow Condensed kursywa 800/900 wersaliki; tekst: Inter.', 'Na grafikach tylko znak logo (lewy dolny róg) i @trenuj.smialo (prawy dolny róg), bez imienia i nazwiska.'],
};
const PAL_FALLBACK = BRAND_BUILTIN.pal;

// ── Fonty ──
const Fonts = {
  ready: null,
  load() {
    if (this.ready) return this.ready;
    const LAT = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD', EXT = 'U+0100-017F,U+2116';
    const defs = [['Barlow Condensed', 'italic', '800', 'bc800'], ['Barlow Condensed', 'italic', '900', 'bc900'], ['Inter', 'normal', '400', 'in400'], ['Inter', 'normal', '600', 'in600']], jobs = [];
    for (const [fam, style, weight, key] of defs) for (const [suf, unicodeRange] of [['', LAT], ['x', EXT]]) {
      const b64 = typeof FONT_B64 !== 'undefined' ? FONT_B64[key + suf] : null; if (!b64) continue;
      try { const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)), ff = new FontFace(fam, bin.buffer, { style, weight, unicodeRange }); jobs.push(ff.load().then(() => { document.fonts.add(ff); }).catch((e) => console.warn('font', fam, e))); } catch (e) { console.warn('font', fam, e); }
    }
    return (this.ready = Promise.all(jobs).then(() => { if (typeof _lay !== 'undefined') _lay.clear(); }));
  },
};

// ── Paleta marki: pełna (auto) albo wyprowadzona z 3 ról kolorów (marka ręczna) ──
function palOf(b) {
  b = b || (P.cur && P.cur.brand) || {}; if (b.pal) return b.pal;
  const C = b.colors || {}, a = C.accent || '#D49B65', p = C.primary || '#123456', bg0 = C.background || '#F5F2ED';
  const dark = lum(bg0) < 0.12 ? bg0 : lum(p) < 0.12 ? p : mix(p, '#000000', 0.78), bb = mix(a, '#FFFFFF', 0.45);
  return { a, m: mix(a, bb, 0.5), b: bb, v: lum(p) > 0.1 ? p : mix(p, '#FFFFFF', 0.5), bg: dark, sf: mix(dark, '#FFFFFF', 0.045), ink: '#F2F4F7', mut: mix('#F2F4F7', dark, 0.5), on: readable(a) };
}
const gradStops = (pal) => [[0, pal.a], [0.35, pal.a], [0.675, pal.m], [1, pal.b]];

// ── Dane synchronizowane (public/*.json: brand, ideas, ig, ref) ──
const SYNC = { brand: null, ideas: null, ig: null, ref: null, at: 0 };
async function syncLoad(force) {
  const get = async (f) => { try { const r = await fetch(f + '?t=' + (force ? Date.now() : Math.floor(Date.now() / 600000)), { cache: force ? 'reload' : 'default' }); return r.ok ? await r.json() : null; } catch (e) { return null; } };
  const [brand, ideas, ig, ref] = await Promise.all([get('brand.json'), get('ideas.json'), get('ig.json'), get('ref.json')]);
  Object.assign(SYNC, { brand, ideas, ig, ref, at: Date.now() }); return SYNC;
}
const brandSrc = () => SYNC.brand || BRAND_BUILTIN;
// Przypina markę projektu do danych z automatu (kolory, fonty, uchwyt, zasady, DNA układu)
function applyAutoBrand(b) {
  const s = brandSrc(); b.auto = true; b.autoVer = s.updated; b.colors = jclone(s.colors); b.pal = jclone(s.pal); b.headingFont = s.fonts.heading; b.bodyFont = s.fonts.body; b.handle = s.handle || b.handle; b.style = s.style || b.style; b.rules = (s.rules || []).join(' ');
  b.site = s.site || b.site || null; b.dna = b.dnaUser ? jclone(b.dnaUser) : (SYNC.ref && SYNC.ref.dna ? jclone(SYNC.ref.dna) : null); b.look = b.look || 'glow'; return b;
}
async function ensureLogo(b) {
  if ((b.logos || []).length || typeof LOGO_SVG === 'undefined' || !LOGO_SVG) return;
  try { const id = await Assets.add(new File([LOGO_SVG], 'logo-smialo.svg', { type: 'image/svg+xml' }), 'logo'); b.logos = [id]; touch(); } catch (e) { console.warn('logo', e); }
}
async function brandBoot() {
  await Promise.all([Fonts.load(), SYNC.at ? null : syncLoad()]); const b = P.cur.brand;
  if (b.auto) { applyAutoBrand(b); await ensureLogo(b); }
  const ids = (b.logos || []).slice(0, 2); for (const id of ids) { try { const im = await Assets.img(id); if (im) IMGS.set(id, im); } catch (e) { /* logo opcjonalne */ } }
}
