/* Warstwa dostawców AI (adaptery): tekst = Claude albo Llama (Worker), obrazy = FLUX (Workers AI), STT = Whisper (Worker). Klucze tylko w Workerze. */
const AI = {
  st: null,
  async status(force) { if (this.st && !force) return this.st; try { const r = await fetch('api/s/status'); this.st = r.ok ? await r.json() : { error: 'HTTP ' + r.status }; } catch (e) { this.st = { error: errText(e) }; } return this.st; },
  async post(url, body, isForm) {
    let r; try { r = await fetch(url, { method: 'POST', headers: isForm ? undefined : { 'content-type': 'application/json' }, body: isForm ? body : JSON.stringify(body) }); } catch (e) { throw new Error('Brak połączenia z serwerem (' + (navigator.onLine ? 'online' : 'offline') + '): ' + errText(e)); }
    const txt = await r.text(); let j; try { j = JSON.parse(txt); } catch { j = { raw: txt.slice(0, 200) }; }
    if (!r.ok) throw new Error(({ no_key: 'Brak klucza dostawcy w Workerze (' + url + ')', rate: 'Limit zapytań na godzinę (spróbuj za chwilę)', forbidden: 'Odmowa dostępu (403)', ai_error: 'Błąd modelu: ' + (j.msg || '') }[j.code]) || ('HTTP ' + r.status + ' ' + (j.msg || j.raw || j.code || ''))); return j;
  },
  async text(system, user, max = 2200, model) { // zwraca tekst; model: 'claude-haiku-5-5' (domyślnie) | 'claude-sonnet-5-5'
    const j = await this.post('api/n/claude', { model: model || 'claude-sonnet-5-5', max_tokens: max, system, messages: [{ role: 'user', content: user }] });
    return ((j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n') || '').trim();
  },
  async json(system, user, max = 2800) {
    const t = await this.text(system + '\nOdpowiadaj WYŁĄCZNIE poprawnym JSON, bez komentarzy i bez bloków markdown.', user, max);
    const m = t.match(/[\[{][\s\S]*[\]}]/); if (!m) throw new Error('Model nie zwrócił JSON: ' + t.slice(0, 120));
    try { return JSON.parse(m[0]); } catch (e) { throw new Error('Niepoprawny JSON od modelu: ' + errText(e)); }
  },
  async vision(system, images, user, max = 1800) { // wymaga klucza Anthropic w Workerze
    const st = await this.status(); if (!st.ckey) throw new Error('Analiza obrazów wymaga klucza ANTHROPIC_API_KEY w Workerze (nie jest ustawiony).');
    const content = images.map((b64) => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } })); content.push({ type: 'text', text: user });
    const j = await this.post('api/n/claude', { model: 'claude-sonnet-5-5', max_tokens: max, system, messages: [{ role: 'user', content }] });
    return ((j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n') || '').trim();
  },
  async translate(s) { try { return await this.text('Przetłumacz opis obrazu na angielski. Zwróć tylko tłumaczenie, bez cudzysłowów.', s, 400, 'claude-haiku-5-5'); } catch { return s; } },
  async image(prompt, o) { // {w,h,steps,seed} → Blob. FLUX schnell zwraca 1024×1024; proporcje ustawiamy kadrowaniem (bez skalowania w górę)
    o = o || {}; const j = await this.post('api/s/img', { prompt, steps: o.steps || 4, provider: 'flux' });
    const bin = atob(j.image), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); const raw = new Blob([u8], { type: j.mime || 'image/jpeg' });
    if (!o.w || !o.h || Math.abs(o.w / o.h - 1) < 0.02) return raw; const im = await Assets.imgFromBlob(raw), ar = o.w / o.h; let cw = im.naturalWidth, ch = im.naturalHeight; if (cw / ch > ar) cw = Math.round(ch * ar); else ch = Math.round(cw / ar);
    const c = document.createElement('canvas'); c.width = cw; c.height = ch; c.getContext('2d').drawImage(im, (im.naturalWidth - cw) / 2, (im.naturalHeight - ch) / 2, cw, ch, 0, 0, cw, ch); return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Nie udało się przyciąć obrazu'))), 'image/jpeg', 0.93));
  },
  async stt(blob) { const fd = new FormData(); fd.append('file', blob, 'glos.wav'); return (await this.post('api/n/stt', fd, true)).segments || []; },
};
const BRAND_CTX = () => { const b = P.cur.brand; return `Marka: kolory ${b.colors.primary} / ${b.colors.background} / ${b.colors.accent}; styl: ${b.style}.` + (b.rules ? ' Zasady wizualne z referencji: ' + b.rules.slice(0, 600) : ''); };
// Asystent treści: temat → koncepcja, hook, sceny, lektor, CTA, opis, karuzela, stories
async function assistantPlan(brief, opts) {
  const sys = 'Jesteś strategiem treści social media dla polskiego trenera personalnego i twórcy stron WWW (marka: zdrowie, trening, konkret, bez waty i bez marketingowego żargonu). Piszesz po polsku, zwięźle, naturalnie, bez myślników jako ozdobników i bez fraz „w dzisiejszym świecie”. ' + BRAND_CTX();
  const usr = `Brief: ${brief}\nCzas rolki: ok. ${opts.dur || 30} s. Zwróć JSON o strukturze:\n{"concept":"1 zdanie","hook":"pierwsze 2 sekundy, max 9 słów","scenes":[{"dur":sekundy,"kind":"cover|point|list|quote|stat|photo|cta","title":"tekst na ekranie (max 10 słów)","text":"opcjonalny dopisek","items":["dla list"],"num":"dla stat","voice":"tekst lektora do tej sceny","visual":"propozycja ujęcia/grafiki","anim":"propozycja animacji"}],"music":"sugestia muzyki (nastrój, tempo)","cta":"końcowe wezwanie","caption":"opis publikacji, pierwsza linia zatrzymuje, max 600 znaków","hashtags":["max 8"],"carousel":[{"kind":"cover|point|list|quote|stat|steps|flow|chips|meter|recap|cta","title":"","text":"","key":"","items":[],"nodes":[]}],"stories":[{"title":"","text":""}]}\nSceny: 4–7, suma dur ≈ ${opts.dur || 30}. Karuzela: 6–8 slajdów, pierwszy = hook, ostatni = cta lub recap; różnicuj rodzaje slajdów do treści (liczby → stat/meter, kroki → steps, mechanizm → flow). Stories: 3.`;
  return AI.json(sys, usr, 3000);
}
