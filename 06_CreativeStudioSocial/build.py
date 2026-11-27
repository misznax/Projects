"""Buduje index.html z src/ (jedna samowystarczalna strona). Wdrożenie: wspólny Worker `projects` (00_Worker) kopiuje index.html i płaskie pliki z public/ do dist/06/.
Fonty marki (Barlow Condensed, Inter; podzbiór Latin + polskie znaki) są wbudowane jako base64 (vendor/fonts), logo z public/logo.svg.
Creative Studio Social · Autor: Michał Rzekiecki · michus@gmail.com"""
import pathlib, re, base64, json
r = pathlib.Path(__file__).parent
order = ['dsp.js', 'aacshim.js', 'core.js', 'brandpack.js', 'render.js', 'ui.js', 'stage.js', 'templates.js', 'ai.js', 'brand.js', 'creative.js', 'fastvid.js', 'video.js', 'audio.js', 'import.js', 'drive.js', 'cover.js', 'publish.js', 'learn.js', 'ideas.js', 'rolka.js', 'brandlib.js', 'app.js']
fonts = {p.stem: base64.b64encode(p.read_bytes()).decode() for p in sorted((r / 'vendor' / 'fonts').glob('*.woff2'))}
logo = (r / 'public' / 'logo.svg').read_text(encoding='utf-8') if (r / 'public' / 'logo.svg').exists() else ''
gas = (r / 'apps-script' / 'Code.gs').read_text(encoding='utf-8')
gen = 'const FONT_B64 = ' + json.dumps(fonts) + ';\nconst LOGO_SVG = ' + json.dumps(logo) + ';\nconst GAS_CODE = ' + json.dumps(gas) + ';\n'
js = gen + '\n'.join((r / 'src' / p).read_text(encoding='utf-8') for p in order)
vendor = (r / 'vendor' / 'mp4-muxer.min.js').read_text(encoding='utf-8').replace('</script', '<\\/script')
tpl = (r / 'src/app.src.html').read_text(encoding='utf-8')
html = tpl.replace('/*VENDOR*/', vendor).replace('/*SCRIPT*/', "'use strict';\n" + js.replace('</script', '<\\/script'))
(r / 'index.html').write_text(html, encoding='utf-8')
ver = re.search(r"const APP = \{[^}]*?ver: '(v[\d.]+)'", js).group(1)
(r / 'public' / 'version.json').write_text(json.dumps({'ver': ver, 'size': len(html)}), encoding='utf-8')
print('OK', len(html), ver)
