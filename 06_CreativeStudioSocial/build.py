"""Buduje index.html z src/ (jedna samowystarczalna strona). Wdrożenie: wspólny Worker `projects` (00_Worker) kopiuje index.html do dist/06/.
Creative Studio Social · Autor: Michał Rzekiecki · kontakt@smialo.org"""
import pathlib, re
r = pathlib.Path(__file__).parent
order = ['dsp.js', 'core.js', 'render.js', 'ui.js', 'stage.js', 'templates.js', 'ai.js', 'brand.js', 'creative.js', 'video.js', 'audio.js', 'publish.js', 'app.js']
js = '\n'.join((r / 'src' / p).read_text(encoding='utf-8') for p in order)
vendor = (r / 'vendor' / 'mp4-muxer.min.js').read_text(encoding='utf-8').replace('</script', '<\\/script')
tpl = (r / 'src/app.src.html').read_text(encoding='utf-8')
html = tpl.replace('/*VENDOR*/', vendor).replace('/*SCRIPT*/', "'use strict';\n" + js.replace('</script', '<\\/script'))
(r / 'index.html').write_text(html, encoding='utf-8')
print('OK', len(html))
