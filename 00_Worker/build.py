"""Składa dist/ ze wszystkich folderów NN_*: dist/NN/index.html + strona główna z listą. Folder z build.py buduje się sam."""
import pathlib, subprocess, sys, shutil, re, html
root = pathlib.Path(__file__).resolve().parent.parent
dist = pathlib.Path(__file__).resolve().parent / 'dist'
shutil.rmtree(dist, ignore_errors=True); dist.mkdir()
items = []
for d in sorted(root.glob('[0-9][0-9]_*')):
    if d.name.startswith('00_'): continue
    if (d/'build.py').exists(): subprocess.run([sys.executable, str(d/'build.py')], check=True)
    if not (d/'index.html').exists(): continue
    nn = d.name[:2]; (dist/nn).mkdir(); shutil.copy(d/'index.html', dist/nn/'index.html'); items.append((nn, d.name[3:].replace('_', ' ')))
li = ''.join(f'<li><a href="/{n}/">{n} · {html.escape(t)}</a></li>' for n, t in items)
(dist/'index.html').write_text(f'<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Projects</title><body style="font:18px system-ui;max-width:520px;margin:12vh auto;padding:0 16px"><h1>Projects</h1><ul>{li}</ul>', encoding='utf-8')
print('OK', [n for n, _ in items])
