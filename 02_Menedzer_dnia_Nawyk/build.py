"""Buduje index.html z src/ (jedna samowystarczalna strona). Wdrożenie: wspólny Worker `projects` (00_Worker) kopiuje index.html do dist/02/."""
import pathlib
r = pathlib.Path(__file__).parent
parts = ['figs.js', 'figs_stretch.js', 'data_charyzma.js', 'data_v5.js', 'data_zestawy.js', 'fx.js', 'core.js']
js = '\n'.join((r / 'src' / p).read_text(encoding='utf-8') for p in parts)
html = (r / 'src/app.src.html').read_text(encoding='utf-8').replace('/*SCRIPT*/', "(function(){\n'use strict';\n" + js + "\n})();")
(r / 'index.html').write_text(html, encoding='utf-8')
print('OK', len(html))
