"""Składa dist/ ze wszystkich folderów NN_*: dist/NN/index.html + dist/_p/ (zasoby portalu). Folder z build.py buduje się sam."""
import pathlib, subprocess, sys, shutil, re, html
root = pathlib.Path(__file__).resolve().parent.parent
dist = pathlib.Path(__file__).resolve().parent / 'dist'
shutil.rmtree(dist, ignore_errors=True); dist.mkdir()
items = []
for d in sorted(root.glob('[0-9][0-9]_*')):
    if d.name.startswith('00_'): continue
    if (d/'build.py').exists(): subprocess.run([sys.executable, str(d/'build.py')], check=True)
    if not (d/'index.html').exists(): continue
    nn = d.name[:2]; (dist/nn).mkdir(); shutil.copy(d/'index.html', dist/nn/'index.html')
    if (d/'public').is_dir():
        for f in (d/'public').iterdir():
            if f.is_file(): shutil.copy(f, dist/nn/f.name)
    items.append((nn, d.name[3:].replace('_', ' ')))
# Zasoby portalu (czcionki, ikony): /_p/*. Strony portalu (logowanie, panel, admin) renderuje Worker, więc dist/index.html nie istnieje.
portal = pathlib.Path(__file__).resolve().parent / 'portal'
if portal.is_dir(): shutil.copytree(portal, dist / '_p')
print('OK', [n for n, _ in items])
