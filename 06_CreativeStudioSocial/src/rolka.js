// ── Import rolki z dokumentu „Rolki” (projekt Agent John): skrypt lektora, karty tekstu z czasami, opis ──
const Rolka = {
  clean(t) { return String(t || '').replace(/\r/g, '').replace(/ /g, ' ').replace(/\\([#*_\\\-.!()[\]<>~`])/g, '$1').replace(/\*\*|__/g, '').replace(/^#{1,6}[ \t]*/gm, '').replace(/^[ \t]*\*(\S.*?)\*[ \t]*$/gm, '$1'); },
  // tekst dokumentu → lista rolek [{n,title,status,spoken[],how[],cards[{t,text}],total,hook,shots,frame,limits,caption,caution}]
  parse(text) {
    const t = this.clean(text), hits = [...t.matchAll(/^[ \t]*ROLKA[ \t]*#?[ \t]*(\d+)[ \t]*[:.\-–—]*[ \t]*(.*)$/gim)];
    const blocks = hits.length ? hits.map((m, i) => ({ n: +m[1], title: m[2].trim(), body: t.slice(m.index + m[0].length, i + 1 < hits.length ? hits[i + 1].index : t.length) })) : [{ n: 1, title: (t.split('\n').find((x) => x.trim()) || 'Rolka').trim().slice(0, 80), body: t }];
    return blocks.map((b) => this.one(b)).filter((r) => r.cards.length || r.spoken.length);
  },
  one(b) {
    let mode = '', status = ''; const spoken = [], how = [], rest = [], all = [];
    for (const raw of b.body.split('\n')) {
      const ln = raw.trim(); if (!ln) continue; all.push(ln); let m;
      if ((m = ln.match(/^STATUS\s*:\s*(.*)$/i))) { status = m[1].trim(); continue; }
      if (/^M[ÓO]WIONE\s*:?$/i.test(ln)) { mode = 'say'; continue; } if (/^JAK M[ÓO]WI[ĆC]\s*:?$/i.test(ln)) { mode = 'how'; continue; } if (/^DO KOPIUJ[- ]?WKLEJ\s*:?$/i.test(ln)) { mode = 'copy'; continue; }
      if (mode === 'say') spoken.push(ln); else if (mode === 'how') how.push(ln); else rest.push(ln);
    }
    const src = rest.length ? rest : all, joined = src.join('\n'), first = (re) => { const m = joined.match(re); return m ? m[1].trim() : ''; }, cards = [];
    for (const ln of src) { const m = ln.match(/^(\d{1,2}):(\d{2})(?:[.,]\d+)?\s+(.+)$/); if (m) cards.push({ t: +m[1] * 60 + +m[2], text: m[3].trim() }); }
    cards.sort((a, c) => a.t - c.t); const frame = first(/^Kadr\s*:\s*(.+)$/im), num = (re) => { const m = frame.match(re); return m ? +m[1] : 0; };
    return { n: b.n, title: b.title || 'Rolka ' + b.n, status, spoken, how, cards, total: +first(/Czas\s*:\s*(?:ok\.?\s*)?(\d+)/i) || 0, hook: first(/Hook\s*(?:\([^)]*\))?\s*:\s*(.+)$/im), shots: first(/^Uj[ęe]cia[^:\n]*:\s*(.+)$/im), frame, limits: { y0: num(/nie wy[żz]ej ni[żz] y\s*=\s*(\d+)/i), y1: num(/nie ni[żz]ej ni[żz] y\s*=\s*(\d+)/i), right: num(/prawe\s+(\d+)\s*px/i) }, caption: first(/^Opis(?:\s*\([^)]*\))?\s*:\s*(.+)$/im), caution: first(/^Zastrze[żz]enia\s*:\s*(.+)$/im) };
  },
  // rolka → nowa rolka w edytorze: tło marki, karty tekstu w czasie, skrypt do prompteru, opis do publikacji
  build(rk) {
    const p = P.cur, r = newReel(('Rolka ' + rk.n + ': ' + rk.title).slice(0, 34)), W = r.w, H = r.h; r.style = 'dynamic';
    const last = rk.cards.length ? rk.cards[rk.cards.length - 1].t : 0, total = Math.max(rk.total || 0, last + 3, 5); r.dur = Math.ceil(total);
    r.meta = { concept: rk.title, hook: rk.hook, caption: rk.caption, source: 'Agent John', shots: rk.shots, frame: rk.frame, how: rk.how.join(' '), status: rk.status, caution: rk.caution };
    const sc = makeScene('cover', { title: 'x', total: 0, idx: null }, 'story', 0); r.layers.push(bgToLayer(sc.bg, W, H, 0, total));
    const y0 = rk.limits.y0 || SAFE.top, y1 = rk.limits.y1 || (H - SAFE.bottom), rightPad = rk.limits.right || SAFE.right, cw = W - SAFE.left - rightPad, cx = SAFE.left + cw / 2, yy = Math.round(y0 + (y1 - y0) * 0.3), hf = p.brand.headingFont;
    rk.cards.forEach((c, i) => {
      const end = i + 1 < rk.cards.length ? rk.cards[i + 1].t : total, n = c.text.replace(/[*~]/g, '').length, size = n <= 14 ? 150 : n <= 26 ? 128 : n <= 42 ? 110 : 94;
      const l = TXT(autoHL(c.text), { x: cx, y: yy, w: cw, font: hf, size, weight: 800, italic: true, upper: false, color: '#ffffff', align: 'center', lh: 1.04, name: 'Karta ' + (i + 1) + ': ' + c.text.slice(0, 18) });
      l.text.shadow = { on: true, x: 0, y: 8, b: 28, c: 'rgba(0,0,0,.65)' }; l.t0 = c.t; l.t1 = Math.max(c.t + 0.5, end); l.anim.in = { p: 'words', d: 0.6, dl: 0, e: 'outCubic', dir: 'bottom' }; l.anim.out = { p: 'fade', d: 0.2, dl: 0, e: 'inCubic', dir: 'bottom' }; r.layers.push(l);
    });
    p.reels.push(r); p.curReel = r.id; if (rk.spoken.length) p.audio.script = rk.spoken.join('\n\n');
    if (rk.caption) p.publish.caption = (p.publish.caption ? p.publish.caption + '\n\n' : '') + rk.caption;
    touch(); return r;
  },
  docId(s) { const m = String(s || '').match(/\/document\/d\/([\w-]{10,})/) || String(s || '').match(/^([\w-]{25,})$/); return m ? m[1] : ''; },
  async fetchDoc(link) {
    const id = this.docId(link); if (!id) throw new Error('To nie wygląda na link do Dokumentu Google.');
    let r; try { r = await fetch('api/s/doc?id=' + encodeURIComponent(id)); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); } let j = {}; try { j = await r.json(); } catch { /* nie JSON */ }
    if (!r.ok) throw new Error(({ private: 'Dokument nie jest udostępniony linkiem. Otwórz go, kliknij Udostępnij → „Każdy, kto ma link” (Wyświetlający), albo wklej tekst ręcznie.', not_found: 'Nie znaleziono dokumentu.', rate: 'Limit zapytań na godzinę.', too_big: 'Dokument jest za duży.' }[j.code]) || ('Błąd pobierania dokumentu (HTTP ' + r.status + ')')); return j.text || '';
  },
  dialog() {
    const ta = h('textarea', { rows: 8, placeholder: 'Wklej tutaj treść dokumentu „Rolki” (Google Docs: Ctrl+A, Ctrl+C, wklej)…', style: { width: '100%', resize: 'vertical' } }), link = h('input', { type: 'text', placeholder: 'albo link do dokumentu (udostępnionego linkiem)', style: { flex: 1, minWidth: 0 } }), list = h('div', { style: { marginTop: '8px' } });
    let found = [], pick = 0, M;
    const draw = () => {
      list.innerHTML = ''; if (!ta.value.trim()) return;
      if (!found.length) { list.append(h('div', { class: 'warnrow bad' }, 'Nie znalazłem w tekście rolki. Szukam nagłówka „ROLKA #1 …”, sekcji „MÓWIONE” albo linii z czasem i tekstem karty (np. „0:03  DO 60 s: SPADEK 1-2%”).')); return; }
      found.forEach((rk, i) => list.append(h('label', { class: 'row', style: { gap: '8px', alignItems: 'flex-start', cursor: 'pointer', margin: '6px 0' } }, h('input', { type: 'radio', name: 'rk', checked: i === pick, style: { flex: 'none', width: 'auto', marginTop: '4px' }, onchange: () => { pick = i; } }), h('span', {}, h('b', {}, 'ROLKA #' + rk.n + ' · ' + rk.title), h('span', { class: 'hint' }, '  ' + [rk.status, rk.total ? rk.total + ' s' : '', rk.cards.length + ' ' + plu(rk.cards.length, 'karta', 'karty', 'kart'), rk.spoken.length + ' ' + plu(rk.spoken.length, 'linia', 'linie', 'linii') + ' lektora'].filter(Boolean).join(' · '))))));
    };
    const reparse = () => { found = this.parse(ta.value); pick = Math.min(pick, Math.max(0, found.length - 1)); draw(); }; ta.addEventListener('input', debounce(reparse, 250));
    const body = h('div', {}, h('div', { class: 'hint', style: { marginBottom: '6px' } }, 'Dokument „Rolki” z projektu Agent John: wklej treść (Ctrl+A, Ctrl+C w Google Docs) albo podaj link udostępniony linkiem.'), ta, h('div', { class: 'row', style: { marginTop: '6px', gap: '6px' } }, link, h('button', { class: 'btn', onclick: async (e) => { const b = e.currentTarget; b.disabled = true; try { ta.value = await this.fetchDoc(link.value); reparse(); } catch (x) { toast(errText(x), 'bad', 9000); } b.disabled = false; } }, 'Pobierz z linku')), list);
    M = modal('📥 Rolka z dokumentu (Agent John)', body, [{ t: 'Utwórz rolkę', cls: 'pri', keep: true, fn: (close) => { const rk = found[pick]; if (!rk) { toast('Najpierw wklej tekst z rolką.', 'warn'); return false; } const r = this.build(rk); close(); S.go('video', true); toast('Rolka „' + r.name + '”: ' + rk.cards.length + ' ' + plu(rk.cards.length, 'karta', 'karty', 'kart') + ' tekstu z czasami. Skrypt lektora jest w Audio (prompter), opis w Publikacji. Dodaj teraz „🗣 Gadająca głowa” ze swoim nagraniem.', 'ok', 10000); } }, { t: 'Zamknij' }]);
    setTimeout(() => ta.focus(), 30); return M;
  },
};
