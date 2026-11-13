"""Buduje index.html (src/) i worker.js (Cloudflare Worker serwujący index.html)."""
import json, pathlib
r = pathlib.Path(__file__).parent
html = (r/'src/app.src.html').read_text(encoding='utf-8').replace('/*FIGS*/', (r/'src/figs.js').read_text(encoding='utf-8'))
(r/'index.html').write_text(html, encoding='utf-8')
(r/'worker.js').write_text(
 "const HTML = " + json.dumps(html, ensure_ascii=False) + ";\n"
 "export default { async fetch(req) {\n"
 "  const u = new URL(req.url);\n"
 "  if (u.pathname !== '/' && u.pathname !== '/index.html') return new Response('Not found', {status: 404});\n"
 "  return new Response(HTML, {headers: {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache'}});\n"
 "} };\n", encoding='utf-8')
print('OK', len(html))
