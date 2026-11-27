// ── Biblioteka marki: zakończenia, podkłady i dzwonki z Drive + składanie rolki wg receptury jednym przyciskiem ──
// Manifest: public/marka-biblioteka.json (aktualizuje agent). Pliki leżą na Drive w folderze udostępnionym linkiem, import przez Workera (api/s/drive/get).
// Receptura: zakończenie po ostatnim klipie wideo lub głosie, podkład pod cały film (zapętlony, bez duckingu, ok. 15% głośności głosu), dzwonek razem z zakończeniem, potem „Wyrównaj poziomy”. Głos nie jest ruszany.
const BrandLib = {
  man: null,
  async manifest(force) {
    if (this.man && !force) return this.man;
    let r; try { r = await fetch('marka-biblioteka.json?t=' + (force ? Date.now() : Math.floor(Date.now() / 600000)), { cache: force ? 'reload' : 'default' }); } catch (e) { throw new Error('Brak połączenia z serwerem: ' + errText(e)); }
    if (!r.ok) throw new Error('Biblioteka marki: HTTP ' + r.status);
    this.man = await r.json(); return this.man;
  },
  // zasób z biblioteki (jeśli już pobrany) albo pobranie z Drive
  async asset(it, cls) {
    try {
      const all = await DBI.all('assets'), hit = all.filter((a) => a.name === it.fname).sort((a, b) => b.created - a.created)[0];
      if (hit) { const rec = await Assets.rec(hit.id); if (rec && !rec.err && rec.dur) return rec; }
    } catch (e) { /* pobierz od nowa */ }
    return Importer.fetchAsset('api/s/drive/get?id=' + encodeURIComponent(it.file), it.fname, cls);
  },
  // początek zakończenia = koniec treści (ostatni klip wideo lub głos), nie koniec osi czasu
  contentEnd(r) {
    const body = [...r.layers.filter((l) => l.type === 'video' && !l.brand).map((l) => Math.min(l.t1, r.dur)), ...r.audio.filter((a) => a.track === 'voice' && !a.brand).map((a) => Math.min(a.t0 + a.dur, r.dur))];
    return body.length ? Math.max(...body) : (r.brandBase != null ? r.brandBase : r.dur);
  },
  clear(r) { for (let i = r.layers.length - 1; i >= 0; i--) if (r.layers[i].brand) r.layers.splice(i, 1); for (let i = r.audio.length - 1; i >= 0; i--) if (r.audio[i].brand) r.audio.splice(i, 1); },
  async assemble(sel) {
    const V = Video, r = V.reel; if (!r) { toast('Najpierw otwórz rolkę (zakładka Wideo).', 'warn'); return false; }
    const man = await this.manifest(), by = (arr, id) => (arr || []).find((x) => x.id === id);
    const end = by(man.endings, sel.ending), bed = by(man.beds, sel.bed), bell = by(man.bells, sel.bell);
    if (!end && !bed && !bell) { toast('Nic nie wybrano.', 'warn'); return false; }
    const tt = toast('Składam rolkę wg marki…', 'info', 120000);
    try {
      V.pause(); this.clear(r); const mx = P.cur.mix, tEnd = sel.t != null && isFinite(sel.t) ? sel.t : this.contentEnd(r); let tot = tEnd;
      // 1. pobranie plików (zanim cokolwiek zmienimy w rolce)
      const eRec = end ? await this.asset(end, 'video') : null, bRec = bed ? await this.asset(bed, 'audio') : null, kRec = bell ? await this.asset(bell, 'audio') : null;
      if ((end && !eRec) || (bed && !bRec) || (bell && !kRec)) { tt.remove(); return false; } // komunikat błędu pokazał importer
      // 2. zakończenie: wideo bez dźwięku, od razu po treści
      if (eRec) {
        const l = mkLayer('video', { x: r.w / 2, y: r.h / 2 }); l.t0 = tEnd; l.t1 = tEnd + (eRec.dur || 2.4); l.w = r.w; l.h = r.h; l.video.assetId = eRec.id; l.video.fit = 'cover'; l.name = 'Zakończenie: ' + end.name; l.brand = 'end';
        r.layers.splice(V.zIns(r, zRank(l)), 0, l); animateLayers([l], r.style, l.t1 - l.t0); l.anim.in = { p: 'none', d: 0.6, dl: 0, e: 'outCubic', dir: 'bottom' }; Object.assign(l.anim.out, { p: 'none' }); tot = l.t1;
      }
      const dur = Math.max(1, Math.ceil(tot - 1e-6)); // film kończy się na pełnej sekundzie; ostatnia klatka zakończenia trzyma się do końca (bez czarnej dziury)
      if (eRec) { const l = r.layers.find((x) => x.brand === 'end'); if (l) l.t1 = dur; }
      // 3. podkład pod cały film, zapętlony, bez duckingu (stały poziom)
      if (bRec) r.audio.push({ id: uid('au'), track: 'music', assetId: bRec.id, name: bed.name.slice(0, 30), t0: 0, in: 0, dur: dur, srcDur: bRec.dur, gain: mx.musicDb, fi: 1, fo: 1.5, loop: true, duck: false, brand: 'bed' });
      // 4. dzwonek razem z zakończeniem (plik ma 0,45 s ciszy na początku, więc wchodzi z logo)
      if (kRec) r.audio.push({ id: uid('au'), track: 'sfx', assetId: kRec.id, name: bell.name.slice(0, 30), t0: tEnd, in: 0, dur: Math.max(0.5, Math.min(kRec.dur, dur - tEnd)), srcDur: kRec.dur, gain: -6, fi: 0.01, fo: 0.3, loop: false, duck: false, brand: 'bell' });
      r.dur = dur; V.fitBase(); r.brandBase = tEnd; mx.duckDepth = 0; V.mc = null; V.commit(true); await V.ensureVideos(); tt.remove();
      await V.autoLevel(); // głos −18 LUFS, podkład 17 LU niżej (ok. 14% amplitudy), dzwonek −24 LUFS
      V.seek(Math.max(0, Math.min(tEnd - 1, r.dur)));
      toast('Złożone wg marki: ' + [end && end.name, bed && bed.name, bell && bell.name].filter(Boolean).join(' + ') + '. Zakończenie od ' + tEnd.toFixed(1) + ' s, rolka trwa ' + dur + ' s. Ducking wyłączony, podkład stały.', 'ok', 10000);
      return true;
    } catch (e) { tt.remove(); console.error(e); toast('Nie udało się złożyć rolki: ' + errText(e), 'bad', 12000); return false; }
  },
  async dialog() {
    const r = Video.reel; if (!r) { toast('Najpierw otwórz rolkę (zakładka Wideo).', 'warn'); return; }
    let man; try { man = await this.manifest(true); } catch (e) { toast(errText(e), 'bad', 9000); return; }
    const mk = (arr, none) => { const s = h('select', {}, [['', none], ...(arr || []).map((x) => [x.id, x.name + (x.for ? ' (' + x.for + ')' : '') + (x.default ? ' ★' : '')])].map(([v, n]) => h('option', { value: v }, n))); const d = (arr || []).find((x) => x.default); if (d) s.value = d.id; return s; };
    const end = mk(man.endings, 'Bez zakończenia'), bed = mk(man.beds, 'Bez podkładu'), bell = mk(man.bells, 'Bez dzwonka'), t = this.contentEnd(r);
    const body = h('div', {}, h('div', { class: 'hint', style: { marginBottom: '8px' } }, man.recipe || ''),
      h('div', { class: 'fld' }, h('label', {}, 'Zakończenie'), end), h('div', { class: 'fld' }, h('label', {}, 'Podkład'), bed), h('div', { class: 'fld' }, h('label', {}, 'Dzwonek'), bell),
      h('div', { class: 'fine', style: { marginTop: '6px' } }, 'Zakończenie zacznie się w ' + t.toFixed(1) + ' s (koniec treści). Ponowne złożenie zastępuje poprzednie. ★ = domyślne. Folder: ', man.folder ? h('a', { href: man.folder, target: '_blank', rel: 'noopener' }, 'Biblioteka marki na Drive') : ''));
    modal('🏷 Złóż rolkę wg marki', body, [{ t: 'Złóż', cls: 'pri', keep: true, fn: (close) => { close(); this.assemble({ ending: end.value, bed: bed.value, bell: bell.value }); } }, { t: 'Zamknij' }]);
  },
};
