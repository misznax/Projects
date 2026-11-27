/* Creative Studio Social: odbiornik gotowych rolek -> Google Drive (folder „Gotowe rolki”).
   Wklej do nowego projektu na script.google.com i wdróż jako Aplikację internetową (Wykonaj jako: Ja, Dostęp: Wszyscy).
   Aplikacja Creative Studio Social wysyła plik kawałkami prosto do Drive; skrypt tylko zakłada sesję wysyłania i sprawdza hasło.
   Autor: Michał Rzekiecki · michus@gmail.com */
const TOKEN = '__TOKEN__';          // hasło wygenerowane przez aplikację (to samo jest zapisane w aplikacji; nie zmieniaj)
const FOLDER_NAME = 'Gotowe rolki'; // folder w Moim dysku; powstaje sam
const FOLDER_ID = '';               // opcjonalnie: ID istniejącego folderu (zamiast nazwy powyżej)

function folder_() {
  if (FOLDER_ID) return DriveApp.getFolderById(FOLDER_ID);
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  while (it.hasNext()) { const f = it.next(); if (!f.isTrashed()) return f; }
  return DriveApp.createFolder(FOLDER_NAME);
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet() { return out_({ ok: true, app: 'Creative Studio Social: odbiornik rolek', folder: folder_().getUrl() }); }

function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.token !== TOKEN) return out_({ ok: false, error: 'token' });
    const f = folder_();
    if (b.action === 'ping') return out_({ ok: true, folder: f.getUrl(), folderId: f.getId(), name: f.getName() });
    if (b.action === 'text') { // mały plik tekstowy (opis rolki obok pliku wideo)
      const file = f.createFile(String(b.name || 'opis.txt'), String(b.text || ''), MimeType.PLAIN_TEXT);
      return out_({ ok: true, id: file.getId(), url: file.getUrl() });
    }
    if (b.action === 'init') { // sesja wznawialnego uploadu: kawałki wysyła aplikacja
      const mime = String(b.mime || 'video/mp4');
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
