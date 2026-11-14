"""Składa index.html: src/index.src.html + style.css + bundle (esbuild) + data/data.json.
Wymaga Node + `npm i` tylko przy zmianach w src/app.js (bundle jest zapisywany w src/app.bundle.js i commitowany)."""
import json, pathlib, subprocess, shutil, sys
r = pathlib.Path(__file__).resolve().parent
bundle = r/'src/app.bundle.js'
if (r/'node_modules/.bin/esbuild').exists() and (r/'src/app.js').exists():
    subprocess.run([str(r/'node_modules/.bin/esbuild'), str(r/'src/app.js'), '--bundle', '--minify', '--format=iife', '--target=es2020', f'--outfile={bundle}', '--log-level=warning'], check=True)
elif not bundle.exists():
    sys.exit('brak src/app.bundle.js i esbuild (npm i)')
data = json.loads((r/'data/data.json').read_text(encoding='utf-8'))
html = (r/'src/index.src.html').read_text(encoding='utf-8')
html = html.replace('/*CSS*/', (r/'src/style.css').read_text(encoding='utf-8')) \
           .replace('/*VER*/', data['version']) \
           .replace('/*DATA*/', json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')) \
           .replace('/*JS*/', bundle.read_text(encoding='utf-8').replace('</script', '<\\/script'))
(r/'index.html').write_text(html, encoding='utf-8')
print('OK 05_Anatomia index.html', len(html)//1024, 'KB')
