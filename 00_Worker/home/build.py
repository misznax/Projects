#!/usr/bin/env python3
"""Strona główna projects.michus.workers.dev  (v0.01)
Autor: Michał Rzekiecki · kontakt@smialo.org
Składa src/template.html + src/style.css + src/main.js + dane aplikacji z tego pliku -> index.html
Uruchom:  python3 build.py
"""
import html
import urllib.request
from pathlib import Path
from urllib.parse import quote

VERSION = "v0.06"
HOSTS = ["https://stronywww.michus.workers.dev/img/", "https://twojastrona.smialo.org/img/"]
MEDIA = Path(__file__).parent / "media" / "img"
SHOTS = {"nawyk": ["nawyk-1", "nawyk-2", "nawyk-3", "nawyk-4"], "esencja": ["esencja-2", "esencja-1", "esencja-3", "esencja-4"],
         "notatnik": [f"notatnik-{i}" for i in range(1, 11)], "anatomia": ["anatomia-1", "anatomia-2", "anatomia-3"]}
MAIL = "kontakt@smialo.org"
HERE = Path(__file__).parent
esc = html.escape


def asset(rel):
    """Obraz hostowany u nas (pobrany przy buildzie). Gdy pobranie się nie uda, link do źródła."""
    dest = MEDIA / rel
    local = HERE / "shots" / rel   # aktualne zrzuty z aplikacji (mają pierwszeństwo)
    if local.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(local.read_bytes())
    if not dest.exists():
        for h in HOSTS:
            try:
                req = urllib.request.Request(h + rel, headers={"User-Agent": "Mozilla/5.0 (build)"})
                with urllib.request.urlopen(req, timeout=20) as r:
                    data = r.read()
                if len(data) > 500:
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_bytes(data)
                    break
            except Exception:
                continue
    return f"/media/img/{rel}" if dest.exists() else HOSTS[1] + rel


def consult(subject, body_hint=""):
    body = (
        "Dzień dobry,\n\n"
        f"chcę umówić konsultację. Temat: {body_hint or subject}.\n\n"
        "Co zabiera mi najwięcej czasu:\n\n"
        "Preferowany termin:\n\n"
        "Pozdrawiam"
    )
    return f"mailto:{MAIL}?subject={quote('Konsultacja – ' + subject)}&body={quote(body)}"


def trial(subject):
    body = f"Dzień dobry,\n\nmam pytanie o: {subject}.\n\nPozdrawiam"
    return f"mailto:{MAIL}?subject={quote('Pytanie – ' + subject)}&body={quote(body)}"


from demos import mock_board, mock_nawyk, mock_esencja, mock_notatnik, mock_anatomia  # animowane makiety


def mini_ring():
    return ('<div class="mini ringcard"><div class="ring" style="--p:72"><span>72%</span></div>'
            '<div><small>Postęp dnia</small><b>5 z 7 zadań</b></div></div>')


def mini_rec():
    bars = "".join(f'<i style="--d:{(i * 7) % 11 / 10:.1f}s"></i>' for i in range(16))
    return (f'<div class="mini reccard"><div class="rec"><span class="dot"></span>REC <b>00:42:10</b></div>'
            f'<div class="wv">{bars}</div><div class="ln q"><span class="sp b">❓ Pytanie</span>wyłapane automatycznie</div></div>')


def placeholder(n):
    return (f'<div class="mock ph"><div class="skh"></div><div class="skg"><i></i><i></i><i></i><i></i></div>'
            f'<span class="phl">Podgląd {n}</span></div>')


# ───────────────────────── dane aplikacji ─────────────────────────
APPS = [
    dict(id="01", slug="startupboard", name="Startup Board", cat="Produktywność", plat=["Windows", "Program offline"],
         tag="Jedno okno na start dnia. Pliki, których potrzebujesz, czekają już otwarte.",
         problem="Każdy poranek zaczyna się od szukania tych samych plików i okien.",
         solution="Układasz dowolną liczbę pól raz. Następnego dnia pracujesz od razu, bez szukania.",
         benefits=["Dowolna liczba paneli (z paskiem kart): tekst z kolorową składnią, PDF, obrazy i foldery",
                   "Pamięta układ i pliki; autozapis i historia 5 wersji chronią przed utratą zmian",
                   "Panel folderu jak w Total Commanderze: kopiuj i przenoś pliki (F5, F6)",
                   "Przypomnienia z datą, godziną i własnym kolorem",
                   "Lekki program na Windows: rozpakuj ZIP i uruchom"],
         roadmap="W planie: edycja docx · xlsx · okna innych programów",
         price="49 zł na stałe lub 10 zł miesięcznie netto",
         demo=None, mock=mock_board),
    dict(id="02", slug="nawyk", name="Nawyk", cat="Organizacja dnia", plat=["Przeglądarka", "Chmura"],
         tag="Plan dnia na jednym ekranie: zadania, krótkie ćwiczenia i podsumowanie postępów.",
         problem="Dobre intencje giną, bo nikt nie mówi, co dokładnie zrobić teraz.",
         solution="Dostajesz gotową listę kroków na dziś, timer prowadzący przez ćwiczenia i wykres postępu.",
         benefits=["100+ gotowych ćwiczeń: charyzma, głos, rozciąganie, skupienie",
                   "Sesje z timerem: rozgrzewka głosu, poranna mobilność",
                   "Dwa pytania na start dnia i podsumowanie z wykresami",
                   "Dane w chmurze: klucz synchronizacji łączy telefon i komputer"],
         demo="/02/", mock=mock_nawyk),
    dict(id="03", slug="esencja", name="Esencja", cat="Wiedza", plat=["Przeglądarka", "Wersja próbna"],
         tag="Wklej link do filmu z YouTube. Dostajesz esencję w minutę, nie w godzinę.",
         problem="Godzinny film, z którego liczy się pięć minut, a nie wiesz których.",
         solution="Esencja pobiera transkrypcję, streszcza ją i wyróżnia konkrety. Możesz też posłuchać lektora.",
         benefits=["Ctrl+V i gotowe: streszczenie po polsku",
                   "Wersja krótka oraz barwna z wyróżnionymi konkretami",
                   "Lektor czyta na głos: tempo 0,5–4×, przewijanie co 5 s",
                   "Długie filmy dzielone na części automatycznie"],
         demo="/03/", mock=mock_esencja),
    dict(id="04", slug="notatnik", name="Notatnik Słuchacza", cat="Nauka i spotkania",
         plat=["iPhone", "Przeglądarka"],
         tag="Nagrywa wykład lub szkolenie i sam robi z niego uporządkowane notatki.",
         problem="Na wykładzie albo szkoleniu nie da się jednocześnie słuchać i notować.",
         solution="Nagrywa w tle, transkrybuje, odróżnia wykładowcę od pytań z sali i składa notatki tematyczne.",
         benefits=["Pytania i odpowiedzi wyłapane osobno",
                   "Notatki co ok. 5 minut, podzielone tematycznie",
                   "Weryfikacja faktów całości jednym kliknięciem: tezy błędne, sporne, nieaktualne",
                   "Optymalizacja audio: ucina ciszę, wyrównuje głośność, usuwa szelesty, MP3 trafia na Dysk Google",
                   "Pauza, przerwanie i wznawianie długiej obróbki, nawet po odświeżeniu strony",
                   "Kolorowy eksport HTML ze spisem treści; na iPhonie działa po zgaszeniu ekranu"],
         demo="/04/", mock=mock_notatnik),
    dict(id="05", slug="anatomia", name="Anatomia 3D", cat="Edukacja", plat=["Przeglądarka", "WebGL"],
         tag="Kończyna górna, głowa i szyja w 3D. Obracasz, klikasz, rozumiesz.",
         problem="Płaski atlas nie pokazuje, jak struktury leżą względem siebie.",
         solution="Interaktywny model z nazwami po polsku i łacinie. Włączasz tylko warstwy, których potrzebujesz.",
         benefits=["6 warstw: kości, mięśnie, stawy, więzadła, nerwy, naczynia",
                   "Przy stawach: typ, osie ruchu, powierzchnie, antagoniści",
                   "Strona prawa, lewa lub obie; wybór wielu mięśni naraz",
                   "Mapa ciała do szybkiej nawigacji"],
         demo="/05/", mock=mock_anatomia),
]

CHECK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ARROW = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'


EXTRA = {'startupboard': ('Użytkownicy komputerów, którzy codziennie otwierają te same pliki.', 'Windows 10 / 11 · bez instalacji · pliki nie są wysyłane do internetu', '1.2'), 'nawyk': ('Sportowcy, osoby pracujące zdalnie, mówcy i trenerzy.', 'Komputer · tablet · telefon', '1.03'), 'esencja': ('Studenci, osoby uczące się języków i zapracowani.', 'Komputer · tablet · telefon', '0.05'), 'notatnik': ('Studenci i uczestnicy szkoleń.', 'Komputer · tablet · telefon', '0.34'), 'anatomia': ('Studenci medycyny i fizjoterapii, trenerzy i masażyści.', 'Komputer · tablet · telefon', '0.05')}


def render_app(a, i):
    fw, dev, ver = EXTRA[a["slug"]]
    flip = " flip" if i % 2 else ""
    ben = "".join(f"<li>{CHECK}<span>{esc(b)}</span></li>" for b in a["benefits"])
    chips = "".join(f"<span>{esc(p)}</span>" for p in a["plat"])
    road = f'<p class="road"><b>W planie:</b> {esc(a["roadmap"].replace("W planie: ", ""))}</p>' if a.get("roadmap") else ""
    if a["demo"]:
        second = f'<a class="btn btn-line" href="{a["demo"]}">Demo online {ARROW}</a>'
    else:
        second = f'<a class="btn btn-line" href="{trial(a["name"])}">Zadaj pytanie {ARROW}</a>'
    price = f'<p class="price"><b>Cena:</b> {esc(a["price"])}</p>' if a.get("price") else ""
    n = a["id"]
    imgs = SHOTS.get(a["slug"], [])
    slides, thumbs = [], []
    if True:   # animowane demo jako pierwszy ekran
        slides.append(f'<div class="vslide on" data-i="0">{a["mock"]()}</div>')
        thumbs.append('<button class="vthumb on anim" data-i="0" aria-label="Animacja"><span>▶</span><em>Na żywo</em></button>')
    off = len(slides)
    for k, im in enumerate(imgs):
        on = " on" if off == 0 and k == 0 else ""
        slides.append(f'<div class="vslide{on}" data-i="{off + k}"><img src="{asset(f"apps/{im}.webp")}" alt="{esc(a["name"])} — ekran {k + 1}" loading="lazy" decoding="async"></div>')
        thumbs.append(f'<button class="vthumb{on}" data-i="{off + k}" aria-label="Ekran {k + 1}" style="background-image:url({asset(f"apps/{im}-t.webp")})"></button>')
    slides = "".join(slides)
    thumbs = f'<div class="vthumbs" style="--n:{min(len(thumbs), 6)}">{"".join(thumbs)}</div>' if len(thumbs) > 1 else ""
    return f'''
<article class="app reveal{flip}" id="{a["slug"]}" data-spot>
  <div class="media">
    <div class="viewer">
      <div class="vstage">
        {slides}
      </div>
      {thumbs}
    </div>
  </div>
  <div class="copy">
    <div class="kicker"><span class="num">{n}</span>{esc(a["cat"])}</div>
    <h3>{esc(a["name"])}</h3>
    <p class="lead">{esc(a["tag"])}</p>
    <div class="pr">
      <div><span class="lbl p">Problem</span><p>{esc(a["problem"])}</p></div>
      <div><span class="lbl s">Rozwiązanie</span><p>{esc(a["solution"])}</p></div>
    </div>
    <ul class="ben">{ben}</ul>
    <dl class="meta"><div><dt>Dla kogo</dt><dd>{esc(fw)}</dd></div><div><dt>Urządzenia</dt><dd>{esc(dev)}</dd></div><div><dt>Wersja</dt><dd>{ver}</dd></div></dl>
    {road}
    {price}
    <div class="chips">{chips}</div>
    <div class="cta-row">
      <button type="button" class="btn btn-cta" data-want="{esc(a["name"])}">Zapisz się na dostęp {ARROW}</button>
      {second}
    </div>
  </div>
</article>'''


def logo(uid):
    return (f'<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="{uid}" x1="0" y1="0" x2="1" y2="1">'
            '<stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#0f766e"/></linearGradient></defs>'
            f'<rect width="40" height="40" rx="12" fill="url(#{uid})"/>'
            '<path d="M7 24c4-7 7-7 10 0s6 7 10 0c1.4-3 3-4 6-3" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>')


def options():
    return "".join(f'<option>{esc(a["name"])}</option>' for a in APPS)


def main():
    src = HERE / "src"
    tpl = (src / "template.html").read_text(encoding="utf-8")
    css = (src / "style.css").read_text(encoding="utf-8")
    js = (src / "main.js").read_text(encoding="utf-8")
    pills = "".join(f'<a href="#{a["slug"]}" data-p="{a["slug"]}"><b>{a["id"]}</b>{esc(a["name"])}</a>' for a in APPS)
    apps = "\n".join(render_app(a, i) for i, a in enumerate(APPS))
    marquee = "".join(f"<span>{esc(t)}</span>" for t in
                      ["Start dnia", "Nawyki", "Streszczenia wideo", "Notatki z wykładów", "Anatomia 3D",
                       "Po polsku", "Demo w przeglądarce", "3 dni próby"])
    out = (tpl.replace("{{CSS}}", css).replace("{{JS}}", js).replace("{{PILLS}}", pills)
           .replace("{{APPS}}", apps).replace("{{MARQUEE}}", marquee * 2)
           .replace("{{HERO_MOCK}}", mock_board(False)).replace("{{MINI_RING}}", mini_ring())
           .replace("{{MINI_REC}}", mini_rec()).replace("{{LOGO1}}", logo("lg1")).replace("{{LOGO2}}", logo("lg2"))
           .replace("{{OPTIONS}}", options()).replace("{{HERO_APPS}}", asset("apps/hero-apps.webp")).replace("{{VERSION}}", VERSION).replace("{{MAIL}}", MAIL)
           .replace("{{CONSULT}}", consult("ogólna", "wybór aplikacji / wdrożenie pod moją firmę"))
           .replace("{{SUGGEST}}", f"mailto:{MAIL}?subject={quote('Sugestia – strona aplikacji')}"))
    (HERE / "index.html").write_text(out, encoding="utf-8")
    print(f"OK index.html  {len(out) / 1024:.1f} KB  ({VERSION})")


if __name__ == "__main__":
    main()
