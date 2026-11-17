#!/usr/bin/env python3
"""Strona główna projects.michus.workers.dev  (v0.01)
Autor: Michał Rzekiecki · michus@gmail.com
Składa src/template.html + src/style.css + src/main.js + dane aplikacji z tego pliku -> index.html
Uruchom:  python3 build.py
"""
import html
from pathlib import Path
from urllib.parse import quote

VERSION = "v0.02"
IMG = "https://twojastrona.smialo.org/img/apps/"
SHOTS = {"nawyk": ["nawyk-1", "nawyk-2", "nawyk-3", "nawyk-4"], "esencja": ["esencja-2", "esencja-1", "esencja-3", "esencja-4"],
         "notatnik": ["notatnik-2", "notatnik-1", "notatnik-3", "notatnik-4"], "anatomia": ["anatomia-1", "anatomia-2", "anatomia-3"]}
MAIL = "michus@gmail.com"
HERE = Path(__file__).parent
esc = html.escape


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


# ───────────────────────── makiety interfejsów (CSS, bez obrazków) ─────────────────────────
def sk(*ws, c=""):
    return "".join(f'<s class="{c}" style="width:{w}%"></s>' for w in ws)


def bar(title):
    return f'<div class="bar"><i></i><i></i><i></i><span>{title}</span></div>'


def tile(name, state, body, cls=""):
    return (f'<div class="tl {cls}"><div class="th"><b>{name}</b><em>{state}</em></div>'
            f'<div class="tb">{body}</div></div>')


def mock_board():
    t = [
        tile("plan_dnia.txt", "● zapisany · 1,8 KB", sk(92, 78, 85, 60, 88, 70, 45), "act"),
        tile("kontakty.txt", "● zapisany · 0,9 KB", sk(70, 88, 55, 80, 64)),
        tile("oferta_v3.txt", "◐ zmieniony · 4,2 KB", sk(90, 82, 86, 74, 92, 58, 80, 66), "dirty"),
        tile("— pusty —", "", '<div class="ph2">przeciągnij tu plik</div>', "empty"),
        tile("notatki.txt", "● zapisany · 2,6 KB", sk(84, 60, 90, 72, 50, 78)),
        tile("todo.txt", "● zapisany · 0,4 KB", sk(60, 74, 48, 66)),
    ]
    return f'<div class="mock"><div class="win">{bar("StartupBoard")}<div class="board">{"".join(t)}</div></div></div>'


def mock_nawyk():
    tasks = [
        ("done", "Szklanka wody i okno", "2 min"),
        ("done", "Plan pierwszych 25 minut", "3 min"),
        ("done", "Rozgrzewka głosu", "6 min"),
        ("", "Jedna karta, jedno zadanie", "5 min"),
        ("", "Domknięcie dnia", "5 min"),
    ]
    rows = "".join(f'<div class="task {c}"><i></i><span>{n}</span><em>{m}</em></div>' for c, n, m in tasks)
    strip = "".join(f'<i class="{"on" if i < 9 else ""}"></i>' for i in range(14))
    return (f'<div class="mock"><div class="win">{bar("Nawyk — menedżer dnia")}<div class="nb">'
            '<div class="nh"><div><small>Dzień dobry</small><b>Wtorek, 17 listopada</b></div>'
            '<div class="ring" style="--p:60"><span>60%</span></div></div>'
            f'<div class="nstrip">{strip}</div>{rows}'
            '<div class="ex"><div><small>Ćwiczenie dnia</small><b>Poranna mobilność</b></div>'
            '<div class="tm">02:00</div></div></div></div></div>')


def mock_esencja():
    return ('<div class="mock"><div class="win">' + bar("Esencja") +
            '<div class="eb"><div class="inp"><span>youtube.com/watch?v=…</span><b>Streść</b></div>'
            '<div class="vid"><div class="thumb"><i></i></div><div><b>Jak zbudować nawyk w 30 dni</b>'
            '<small>24:10 min → czytasz w 1:30</small></div></div>'
            '<div class="quote"><b>Esencja:</b> małe kroki wygrywają z wielkimi planami.</div>'
            '<div class="pt"><i></i><span>Zacznij od <mark>2 minut</mark> dziennie</span></div>'
            '<div class="pt"><i></i><span>Dopisz nawyk do <mark>istniejącej rutyny</mark></span></div>'
            '<div class="pt"><i></i><span>Mierz <mark>serię dni</mark>, nie perfekcję</span></div>'
            '<div class="pt"><i></i><span>Zaplanuj <mark>pierwszy krok</mark> na jutro</span></div>'
            '<div class="tg"><b>Mini</b><b class="on">Barwny</b><b>Lektor</b></div>'
            '<div class="pl"><b>▶</b><span class="pg"><u></u></span><em>1,3×</em></div>'
            '</div></div></div>')


def mock_notatnik():
    bars = "".join(f'<i style="--d:{(i * 7) % 11 / 10:.1f}s"></i>' for i in range(30))
    return ('<div class="mock"><div class="win dk">' + bar("Notatnik Słuchacza") +
            '<div class="rb"><div class="rec"><span class="dot"></span>REC <b>00:42:10</b></div>'
            f'<div class="wv">{bars}</div>'
            '<div class="ln"><span class="sp a">Wykładowca</span>Kluczem jest regularność, nie intensywność.</div>'
            '<div class="ln q"><span class="sp b">❓ Pytanie</span>Ile czasu dziennie wystarczy?</div>'
            '<div class="ln"><span class="sp c">✔ Odpowiedź</span>Dwie minuty, ale każdego dnia.</div>'
            '<div class="nt"><small>Notatka · temat 1</small><b>Regularność wygrywa z intensywnością</b>'
            '<span>• krótkie, codzienne sesje</span><span>• serie dni jako miara postępu</span></div>'
            '<div class="acts"><b>Notatki</b><b>Autorzy</b><b>Zweryfikuj</b></div>'
            '</div></div></div>')


def mock_anatomia():
    svg = ('<svg viewBox="0 0 300 240" aria-hidden="true">'
           '<defs><linearGradient id="mus" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/>'
           '<stop offset="1" stop-color="#0f766e"/></linearGradient></defs>'
           '<ellipse cx="150" cy="222" rx="118" ry="11" fill="rgba(45,212,191,.16)"/>'
           '<ellipse cx="150" cy="222" rx="78" ry="6" fill="none" stroke="rgba(94,234,212,.35)"/>'
           '<g class="limb"><circle cx="88" cy="44" r="19" fill="#e9f2f0"/>'
           '<path d="M88 40 C96 36 108 40 112 50 L150 132 C153 140 148 148 140 147 C132 146 128 140 125 134 L84 56 C81 50 82 44 88 40Z" fill="#dfeceb"/>'
           '<path d="M104 52 C138 54 160 92 148 132 C132 124 106 96 98 62Z" fill="url(#mus)" opacity=".95"/>'
           '<line x1="146" y1="148" x2="226" y2="204" stroke="#e9f2f0" stroke-width="10" stroke-linecap="round"/>'
           '<line x1="136" y1="152" x2="214" y2="212" stroke="#c9dcda" stroke-width="8" stroke-linecap="round"/>'
           '<circle cx="142" cy="146" r="9" fill="#f3fbfa"/></g>'
           '<g class="pin"><circle cx="128" cy="92" r="5" fill="#ffb347"/><circle cx="128" cy="92" r="11" fill="none" stroke="#ffb347"/></g>'
           '<path d="M133 88 L190 56" stroke="#ffb347" stroke-width="1.4" fill="none"/>'
           '<rect x="190" y="38" width="104" height="38" rx="9" fill="rgba(6,42,50,.85)" stroke="rgba(94,234,212,.5)"/>'
           '<text x="198" y="54" fill="#fff" font-size="10" font-weight="700">Biceps brachii</text>'
           '<text x="198" y="68" fill="#99f6e4" font-size="8.5" font-style="italic">Musculus biceps brachii</text>'
           '</svg>')
    layers = "".join(f'<li class="{"on" if i < 3 else ""}"><i></i>{n}</li>' for i, n in enumerate(
        ["Kości", "Mięśnie", "Stawy", "Więzadła", "Nerwy", "Naczynia"]))
    return ('<div class="mock"><div class="win dk an">' + bar("Anatomia 3D") +
            f'<div class="ab"><div class="scene">{svg}</div>'
            f'<div class="side"><small>Warstwy</small><ul>{layers}</ul>'
            '<div class="card"><small>Antagonista</small><b>Triceps brachii</b></div></div></div></div></div>')


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
    dict(id="01", slug="startupboard", name="StartupBoard", cat="Produktywność", plat=["Windows", "Program offline"],
         tag="Jedno okno na start dnia. Pliki, których potrzebujesz, czekają już otwarte.",
         problem="Każdy poranek zaczyna się od szukania tych samych plików i okien.",
         solution="Układasz 6 pól raz. Następnego dnia pracujesz od razu, bez szukania.",
         benefits=["6 pól na pliki w jednym oknie",
                   "Edytor w każdym polu: zawijanie wierszy, stan zapisu, rozmiar pliku",
                   "Przeciągnij i upuść plik, bez przeszukiwania folderów",
                   "Lekki program na Windows: rozpakuj ZIP i uruchom"],
         roadmap="W planie: docx · xlsx · pdf · okna innych programów",
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
                   "Przyciski „Autorzy” i „Zweryfikuj” sprawdzają źródła w sieci",
                   "Eksport do Markdown; na iPhonie działa po zgaszeniu ekranu"],
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


def render_app(a, i):
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
    if a["slug"] in ("startupboard", "notatnik"):   # animowana makieta zostaje jako pierwszy ekran
        slides.append(f'<div class="vslide on" data-i="0">{a["mock"]()}</div>')
        thumbs.append('<button class="vthumb on anim" data-i="0" aria-label="Animacja"><span>▶</span><em>Na żywo</em></button>')
    off = len(slides)
    for k, im in enumerate(imgs if a["slug"] != "notatnik" else imgs[1:]):
        on = " on" if off == 0 and k == 0 else ""
        slides.append(f'<div class="vslide{on}" data-i="{off + k}"><img src="{IMG}{im}.webp" alt="{esc(a["name"])} — ekran {k + 1}" loading="lazy" decoding="async"></div>')
        thumbs.append(f'<button class="vthumb{on}" data-i="{off + k}" aria-label="Ekran {k + 1}" style="background-image:url({IMG}{im}-t.webp)"></button>')
    slides = "".join(slides)
    thumbs = f'<div class="vthumbs" style="--n:{len(thumbs)}">{"".join(thumbs)}</div>' if len(thumbs) > 1 else ""
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
           .replace("{{HERO_MOCK}}", mock_board()).replace("{{MINI_RING}}", mini_ring())
           .replace("{{MINI_REC}}", mini_rec()).replace("{{LOGO1}}", logo("lg1")).replace("{{LOGO2}}", logo("lg2"))
           .replace("{{OPTIONS}}", options()).replace("{{VERSION}}", VERSION).replace("{{MAIL}}", MAIL)
           .replace("{{CONSULT}}", consult("ogólna", "wybór aplikacji / wdrożenie pod moją firmę"))
           .replace("{{SUGGEST}}", f"mailto:{MAIL}?subject={quote('Sugestia – strona aplikacji')}"))
    (HERE / "index.html").write_text(out, encoding="utf-8")
    print(f"OK index.html  {len(out) / 1024:.1f} KB  ({VERSION})")


if __name__ == "__main__":
    main()
