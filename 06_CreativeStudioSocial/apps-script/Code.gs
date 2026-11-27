/* PO CO TO JEST: ten skrypt pozwala aplikacji Creative Studio Social wysyłać i porządkować rolki na Twoim Google Drive. Robisz to raz.
   Co zrobić: 1) wklej ten kod w script.google.com i zapisz, 2) Wdróż → Nowe wdrożenie → Aplikacja internetowa (Wykonaj jako: Ja, Dostęp: Wszyscy), 3) skopiuj adres kończący się na /exec do Studio (okno ⚙ Drive).
   Po aktualizacji kodu: Wdróż → Zarządzaj wdrożeniami → ołówek → Wersja: Nowa wersja → Wdróż (adres zostaje ten sam).
   Creative Studio Social: odbiornik rolek -> Google Drive. Struktura (wersja 2):
     Śmiało – Rolki (folder główny, ID wstawia aplikacja)
       Lista rolek (arkusz: numer, tytuł, kategoria, autorzy badań, status)
       Materiały/R001-Efekt reflektora   (rolka w produkcji: wideo, podkład, miniatura, opis, projekt Studia)
       Opublikowane/R001-Efekt reflektora (rolka po publikacji; folder przenosi akcja „move”)
   Wersja 3: przycisk „Spontaniczny pomysł” dopisuje wiersz (status: pomysł) do arkusza Lista rolek; skrypt prosi wtedy o dodatkowe uprawnienie do arkuszy Google (Autoryzuj raz).
   Aplikacja wysyła plik kawałkami prosto do Drive; skrypt zakłada folder, sesję wysyłania, przenosi folder i sprawdza hasło.
   Autor: Michał Rzekiecki · michus@gmail.com */
const TOKEN = '__TOKEN__';          // hasło wygenerowane przez aplikację (to samo jest zapisane w aplikacji; nie zmieniaj)
const FOLDER_NAME = 'Śmiało – Rolki'; // folder w Moim dysku (używany, gdy poniżej nie ma ID); powstaje sam
const FOLDER_ID = '__FOLDER_ID__';  // ID folderu głównego wstawia aplikacja (zamiast nazwy powyżej)
const VER = 3;                      // wersja skryptu: aplikacja odmawia pracy ze starszą (v3: akcja „idea” dopisuje wiersz do arkusza Lista rolek)
const LIST_ID = '__LIST_ID__';      // ID arkusza „Lista rolek” wstawia aplikacja (gdy brak: szukam arkusza o tej nazwie w folderze głównym)
const LIST_NAME = 'Lista rolek';
const DIR_WORK = 'Materiały', DIR_DONE = 'Opublikowane';

function folder_() {
  if (FOLDER_ID && FOLDER_ID.indexOf('__') !== 0) return DriveApp.getFolderById(FOLDER_ID);
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) return f; }
  return DriveApp.createFolder(FOLDER_NAME);
}
function clean_(s) { return String(s || '').replace(/[\\:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100); }
// folder pod ścieżką „Materiały/R001-Efekt reflektora” (poziom po poziomie); create=true zakłada brakujące, create=false zwraca null, gdy czegoś brak
function path_(root, path, create) {
  const parts = String(path || '').split('/').map(clean_).filter(Boolean);
  let cur = root;
  for (let i = 0; i < parts.length; i++) {
    let found = null; const it = cur.getFoldersByName(parts[i]);
    while (it.hasNext()) { const x = it.next(); if (!x.isTrashed()) { found = x; break; } }
    if (!found) { if (!create) return null; found = cur.createFolder(parts[i]); }
    cur = found;
  }
  return cur;
}
function list_(root) { // arkusz „Lista rolek”: po ID, a gdy go nie ma, po nazwie w folderze głównym
  if (LIST_ID && LIST_ID.indexOf('__') !== 0) { try { return SpreadsheetApp.openById(LIST_ID); } catch (e) { /* szukam po nazwie */ } }
  const it = root.getFilesByName(LIST_NAME);
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed() && f.getMimeType() === MimeType.GOOGLE_SHEETS) return SpreadsheetApp.open(f); }
  return null;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet() { return out_({ ok: true, app: 'Creative Studio Social: odbiornik rolek', ver: VER, folder: folder_().getUrl() }); }

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.token !== TOKEN) return out_({ ok: false, error: 'token' });
    const root = folder_();
    if (b.action === 'ping') { // sprawdzenie połączenia; z polem sub zakłada też folder pod tą ścieżką
      const f = path_(root, b.sub, true);
      return out_({ ok: true, ver: VER, folder: f.getUrl(), folderId: f.getId(), name: f.getName() });
    }
    if (b.action === 'names') { // nazwy folderów rolek w Materiały i Opublikowane (z nich aplikacja liczy kolejny numer)
      const res = {}; [DIR_WORK, DIR_DONE].forEach(function (d) {
        res[d] = []; const df = path_(root, d, false); if (!df) return;
        const it = df.getFolders(); while (it.hasNext()) { const x = it.next(); if (!x.isTrashed()) res[d].push(x.getName()); }
      });
      return out_({ ok: true, ver: VER, names: res });
    }
    if (b.action === 'move') { // przeniesienie folderu rolki, np. z „Materiały/R001-…” do „Opublikowane”
      const src = path_(root, b.from, false);
      if (!src) { // może już leży w miejscu docelowym (przeniesiony wcześniej ręcznie): wtedy nic do zrobienia
        const d0 = path_(root, b.to, false), n0 = clean_(String(b.from).split('/').pop());
        if (d0) { const t0 = d0.getFoldersByName(n0); while (t0.hasNext()) { const y = t0.next(); if (!y.isTrashed()) return out_({ ok: true, already: true, name: n0, folder: y.getUrl() }); } }
        return out_({ ok: false, error: 'Nie ma folderu: ' + b.from });
      }
      const dst = path_(root, b.to, true), nm = src.getName(), ps = src.getParents();
      while (ps.hasNext()) if (ps.next().getId() === dst.getId()) return out_({ ok: true, already: true, name: nm, folder: src.getUrl() });
      const clash = dst.getFoldersByName(nm); while (clash.hasNext()) if (!clash.next().isTrashed()) return out_({ ok: false, error: 'W folderze ' + b.to + ' jest już folder ' + nm });
      src.moveTo(dst);
      return out_({ ok: true, name: nm, folder: src.getUrl() });
    }
    if (b.action === 'idea') { // spontaniczny pomysł: nowy wiersz na końcu arkusza (kolumny: Nr, Typ, Tytuł, Status, Prio, Kategoria, Autorzy badań, Źródło, Hook roboczy, Temat (bank), Data publikacji, Folder, Uwagi)
      const text = String(b.text || '').replace(/\s+/g, ' ').trim().slice(0, 600); if (!text) return out_({ ok: false, error: 'Pusty pomysł.' });
      const lock = LockService.getScriptLock(); lock.waitLock(20000);
      try {
        const ss = list_(root); if (!ss) return out_({ ok: false, error: 'Nie znalazłem arkusza „' + LIST_NAME + '” w folderze głównym.' });
        const sh = ss.getSheetByName('Lista') || ss.getSheets()[0], last = sh.getLastRow(), col = 9; // kolumna I = „Hook roboczy” (cały pomysł)
        if (last > 1) { const vals = sh.getRange(2, col, last - 1, 1).getValues(); for (let i = 0; i < vals.length; i++) if (String(vals[i][0]).replace(/\s+/g, ' ').trim() === text) return out_({ ok: true, dup: true, row: i + 2, url: ss.getUrl() + '#gid=' + sh.getSheetId() }); }
        const title = text.length > 70 ? text.slice(0, 67).replace(/\s+\S*$/, '') + '…' : text, typ = ({ R: 'Rolka', K: 'Karuzela', P: 'Post' })[b.typ] || 'do ustalenia';
        sh.appendRow(['', typ, title, 'pomysł', 2, 'spontaniczny', '', '', text, '', '', '', 'spontaniczny pomysł ze Studia, ' + Utilities.formatDate(new Date(), 'Europe/Warsaw', 'yyyy-MM-dd HH:mm')]);
        SpreadsheetApp.flush(); const row = sh.getLastRow();
        return out_({ ok: true, row: row, url: ss.getUrl() + '#gid=' + sh.getSheetId() });
      } finally { lock.releaseLock(); }
    }
    const f = path_(root, b.sub, true);
    if (b.action === 'text') { // mały plik tekstowy (opis rolki obok pliku wideo); ta sama nazwa = nadpisanie, bez duplikatów
      const nm = String(b.name || 'opis.txt'), same = f.getFilesByName(nm);
      while (same.hasNext()) { const x = same.next(); if (!x.isTrashed()) { x.setContent(String(b.text || '')); return out_({ ok: true, id: x.getId(), url: x.getUrl(), replaced: true }); } }
      const file = f.createFile(nm, String(b.text || ''), MimeType.PLAIN_TEXT);
      return out_({ ok: true, id: file.getId(), url: file.getUrl() });
    }
    if (b.action === 'init') { // sesja wznawialnego uploadu: kawałki wysyła aplikacja
      const mime = String(b.mime || 'video/mp4');
      if (b.replace) { const old = f.getFilesByName(String(b.name)); while (old.hasNext()) { const x = old.next(); if (!x.isTrashed()) x.setTrashed(true); } } // archiwum tej samej nazwy: stary plik trafia do kosza Drive (do odzyskania), nie powstaje duplikat
      const r = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,webViewLink', {
        method: 'post', contentType: 'application/json; charset=UTF-8', muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': mime, 'X-Upload-Content-Length': String(b.size) },
        payload: JSON.stringify({ name: String(b.name), mimeType: mime, parents: [f.getId()] })
      });
      if (r.getResponseCode() !== 200) return out_({ ok: false, error: 'Drive ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 300) });
      const h = r.getAllHeaders();
      return out_({ ok: true, url: h['Location'] || h['location'], folder: f.getUrl() });
    }
    return out_({ ok: false, error: 'action' });
  } catch (err) { return out_({ ok: false, error: String((err && err.message) || err) }); }
}
