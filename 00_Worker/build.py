"""Składa dist/ ze wszystkich folderów NN_*: dist/NN/index.html + strona główna z 00_Worker/home. Folder z build.py buduje się sam."""
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
home = pathlib.Path(__file__).resolve().parent / 'home'
subprocess.run([sys.executable, str(home/'build.py')], check=True)
shutil.copy(home/'index.html', dist/'index.html')
if (home/'media').is_dir(): shutil.copytree(home/'media', dist/'media')
print('OK', [n for n, _ in items])
