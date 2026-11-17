"""Animowane makiety interfejsów (sterowane krokami: data-s ustawia main.js).
Atrybuty: data-from / data-to (widoczne od/do kroku -> klasa .on), data-at / data-at2 (tylko w kroku -> .at/.at2), data-pv (wartości pierścienia)."""
import html

esc = html.escape


def sk(*ws, c=""):
    return "".join(f'<s class="{c}" style="width:{w}%"></s>' for w in ws)


def bar(title):
    return f'<div class="bar"><i></i><i></i><i></i><span>{title}</span></div>'


def dem(inner, caps=None, dark=False, cls="", ms=2800):
    """Opakowanie makiety. caps = lista podpisów kroków (None = bez podpisu, np. w hero)."""
    c = f' data-caps="{esc("|".join(caps))}"' if caps else ""
    return f'<div class="mock" data-demo data-ms="{ms}"{c}>{inner}</div>'


def tile(name, state, body, cls="", extra=""):
    return (f'<div class="tl {cls}" {extra}><div class="th"><b>{name}</b><em>{state}</em></div>'
            f'<div class="tb">{body}</div></div>')


# ─────────────────────────────── 01 StartupBoard ───────────────────────────────
def mock_board(caps=True):
    pop = lambda i: f'data-at2="5" style="--i:{i}"'
    t4 = tile(
        '<span class="sh" data-at="1">— pusty —</span><span class="sh" data-at="2,3,4,5">umowa.txt</span>',
        '<span class="sh" data-at="2">● zapisany · 3,1 KB</span><span class="sh" data-at="3">◐ zmieniony · 3,4 KB</span>'
        '<span class="sh" data-at="4,5">● zapisany · 3,4 KB</span>',
        '<div class="ph2 sb" data-at="1">przeciągnij tu plik</div>'
        '<div class="sbf" data-from="2">' + sk(88, 70, 82, 60, 76) + '<s class="new sh" data-at="3" style="width:64%"></s></div>',
        "hlt", 'data-at="1,3"')
    t = [
        tile("plan_dnia.txt", "● zapisany · 1,8 KB", sk(92, 78, 85, 60, 88, 70, 45), "act rem", pop(0)),
        tile("kontakty.txt", "● zapisany · 0,9 KB", sk(70, 88, 55, 80, 64), "rem", pop(1)),
        tile("oferta_v3.txt", "◐ zmieniony · 4,2 KB", sk(90, 82, 86, 74, 92, 58, 80, 66), "dirty rem", pop(2)),
        t4.replace('class="tl hlt"', 'class="tl hlt rem" data-at2="5" style="--i:3"', 1),
        tile("notatki.txt", "● zapisany · 2,6 KB", sk(84, 60, 90, 72, 50, 78), "rem", pop(4)),
        tile("todo.txt", "● zapisany · 0,4 KB", sk(60, 74, 48, 66), "rem", pop(5)),
    ]
    ghost = '<div class="drag sb" data-at="1"><i></i>umowa.txt</div>'
    toast = '<div class="toast2 sb" data-at="5"><b>✔</b> Układ zapamiętany. Jutro wszystko czeka otwarte.</div>'
    c = ["Przeciągasz plik w wolne pole", "Plik otwiera się od razu, z zawijaniem wierszy",
         "Piszesz, a pole pokazuje „zmieniony”", "Ctrl+S i znów „zapisany”", "Jutro układ wraca sam, bez szukania"] if caps else None
    return dem(f'<div class="win">{bar("StartupBoard")}<div class="board">{"".join(t)}</div>{ghost}{toast}</div><div class="dcap"></div>' if caps
               else f'<div class="win">{bar("StartupBoard")}<div class="board">{"".join(t)}</div>{ghost}{toast}</div>', c)


# ─────────────────────────────── 02 Nawyk ───────────────────────────────
def mock_nawyk():
    tasks = [(2, "Szklanka wody i okno", "2 min"), (2, "Plan pierwszych 25 minut", "3 min"), (2, "Rozgrzewka głosu", "6 min"),
             (3, "Jedna karta, jedno zadanie", "5 min"), (4, "Domknięcie dnia", "5 min")]
    rows = "".join(f'<div class="task" data-from="{d}" style="--i:{i}"><i></i><span>{n}</span><em>{m}</em></div>' for i, (d, n, m) in enumerate(tasks))
    strip = "".join(f'<i class="{"on" if i < 9 else ""}"></i>' for i in range(14))
    bars = "".join(f'<u style="--h:{h}%;--i:{i}"></u>' for i, h in enumerate([55, 70, 40, 85, 65, 92, 100]))
    caps = ["Rano dostajesz gotowy plan dnia", "Odhaczasz zadania, pierścień rośnie", "Timer prowadzi przez ćwiczenie",
            "Wieczorem: wykres postępu i synchronizacja z telefonem"]
    return dem(
        f'<div class="win">{bar("Nawyk — menedżer dnia")}<div class="nb">'
        '<div class="nh"><div><small>Dzień dobry</small><b>Wtorek, 17 listopada</b></div>'
        '<div class="ring" data-pv="0 60 80 100" style="--p:0"><span>0%</span></div></div>'
        f'<div class="nstrip">{strip}</div>{rows}'
        '<div class="ex" data-at2="3"><div><small>Ćwiczenie dnia</small><b>Poranna mobilność</b></div>'
        '<div class="tm"><span class="sh" data-at="1,2">02:00</span><span class="sh" data-at="3">01:12</span><span class="sh" data-at="4">✔</span></div>'
        '<span class="exbar" data-at="3"></span></div>'
        f'<div class="sum" data-at="4"><b>Ten tydzień</b><div class="cht">{bars}</div>'
        '<div class="syn">☁ Zsynchronizowano: telefon ↔ komputer</div></div>'
        '</div></div><div class="dcap"></div>', caps)


# ─────────────────────────────── 03 Esencja ───────────────────────────────
def mock_esencja():
    caps = ["Wklejasz link do filmu", "Esencja pobiera transkrypcję", "Konkrety po polsku, najważniejsze podświetlone",
            "Lektor czyta na głos, tempo 0,5–4×"]
    pts = ["Zacznij od <mark>2 minut</mark> dziennie", "Dopisz nawyk do <mark>istniejącej rutyny</mark>",
           "Mierz <mark>serię dni</mark>, nie perfekcję", "Zaplanuj <mark>pierwszy krok</mark> na jutro"]
    ptsh = "".join(f'<div class="pt" data-at="3,4" style="--i:{i}"><i></i><span>{p}</span></div>' for i, p in enumerate(pts))
    return dem(
        '<div class="win">' + bar("Esencja") +
        '<div class="eb"><div class="inp"><span><i class="typ" data-at="1"></i><i class="typ full" data-from="2"></i></span><b data-at="2" class="btn2">Streść</b></div>'
        '<div class="hint sb" data-at="1">Wklej link i kliknij „Streść”</div>'
        '<div class="ldg sb" data-at="2"><span>Pobieram transkrypcję…</span><u></u></div>'
        '<div class="vid svf" data-from="2" data-to="3"><div class="thumb"><i></i></div><div><b>Jak zbudować nawyk w 30 dni</b>'
        '<small>24:10 min → czytasz w 1:30</small></div></div>'
        '<div class="quote sv" data-from="3" data-to="3"><b>Esencja:</b> małe kroki wygrywają z wielkimi planami.</div>'
        + ptsh +
        '<div class="tg"><b data-to="3">Mini</b><b data-to="3" class="on">Barwny</b><b data-from="4">Lektor</b></div>'
        '<div class="pl svf" data-from="4" data-at="4"><b>▶</b><span class="pg"><u></u></span><em>1,3×</em></div>'
        '</div></div><div class="dcap"></div>', caps)


# ─────────────────────────────── 04 Notatnik Słuchacza ───────────────────────────────
def mock_notatnik():
    bars = "".join(f'<i style="--d:{(i * 7) % 11 / 10:.1f}s"></i>' for i in range(30))
    caps = ["Nagrywasz wykład w tle, także przy wygaszonym ekranie", "Pytanie z sali wyłapane osobno",
            "Co ok. 5 minut powstaje notatka tematyczna", "Autorzy, Zweryfikuj i eksport do Markdown"]
    return dem(
        '<div class="win dk">' + bar("Notatnik Słuchacza") +
        '<div class="rb"><div class="rec"><span class="dot"></span>REC <b>00:42:10</b></div>'
        f'<div class="wv">{bars}</div>'
        '<div class="ln sf" data-from="1"><span class="sp a">Wykładowca</span>Kluczem jest regularność, nie intensywność.</div>'
        '<div class="ln q sf" data-from="2"><span class="sp b">❓ Pytanie</span>Ile czasu dziennie wystarczy?</div>'
        '<div class="ln sf" data-from="2"><span class="sp c">✔ Odpowiedź</span>Dwie minuty, ale każdego dnia.</div>'
        '<div class="nt sv" data-from="3"><small>Notatka · temat 1</small><b>Regularność wygrywa z intensywnością</b>'
        '<span>• krótkie, codzienne sesje</span><span>• serie dni jako miara postępu</span></div>'
        '<div class="acts"><b data-at="4" class="a1">Notatki</b><b data-at="4" class="a2">Autorzy</b><b data-at="4" class="a3">Zweryfikuj</b>'
        '<span class="ok sh" data-at="4">✔ Źródło potwierdzone</span></div>'
        '</div></div><div class="dcap"></div>', caps)


# ─────────────────────────────── 05 Anatomia 3D ───────────────────────────────
def mock_anatomia():
    svg = ('<svg viewBox="0 0 300 240" aria-hidden="true">'
           '<defs><linearGradient id="mus" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/>'
           '<stop offset="1" stop-color="#0f766e"/></linearGradient>'
           '<linearGradient id="mus2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7dd3fc"/>'
           '<stop offset="1" stop-color="#1d6fa5"/></linearGradient></defs>'
           '<ellipse cx="150" cy="222" rx="118" ry="11" fill="rgba(45,212,191,.16)"/>'
           '<ellipse cx="150" cy="222" rx="78" ry="6" fill="none" stroke="rgba(94,234,212,.35)"/>'
           '<g class="limb">'
           '<g class="l-bone"><circle cx="88" cy="44" r="19" fill="#e9f2f0"/>'
           '<line x1="92" y1="50" x2="144" y2="144" stroke="#e9f2f0" stroke-width="11" stroke-linecap="round"/>'
           '<line x1="146" y1="148" x2="226" y2="204" stroke="#e9f2f0" stroke-width="10" stroke-linecap="round"/>'
           '<line x1="136" y1="152" x2="214" y2="212" stroke="#c9dcda" stroke-width="8" stroke-linecap="round"/>'
           '<circle cx="142" cy="146" r="9" fill="#f3fbfa"/></g>'
           '<g class="l-mus sv" data-from="2">'
           '<path class="m-bi" data-at="2" d="M104 52 C138 54 160 92 148 132 C132 124 106 96 98 62Z" fill="url(#mus)"/>'
           '<path class="m-tri" data-at="3" d="M82 60 C66 96 92 136 128 152 C140 150 142 142 134 136 C112 118 96 92 94 64Z" fill="url(#mus2)"/></g>'
           '<path class="l-ner sv" data-from="4" pathLength="1" d="M98 58 C116 88 132 116 150 142 C172 164 200 186 226 202" stroke="#ffd36b" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
           '<path class="l-ves sv" data-from="4" pathLength="1" d="M110 50 C142 62 160 100 150 136 C176 162 202 180 220 196" stroke="#ff6b6b" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
           '</g></svg>')
    layers = [("Kości", 1), ("Mięśnie", 2), ("Stawy", 1), ("Więzadła", 99), ("Nerwy", 4), ("Naczynia", 4)]
    lis = "".join(f'<li data-from="{d}"><i></i>{n}</li>' for n, d in layers)
    caps = ["Zaczynasz od szkieletu, warstwy włączasz osobno", "Włączasz mięśnie i klikasz: biceps brachii",
            "Antagonista jednym kliknięciem: triceps brachii", "Dokładasz nerwy i naczynia", "Strona prawa, lewa lub obie"]
    return dem(
        '<div class="win dk an">' + bar("Anatomia 3D") +
        f'<div class="ab"><div class="scene" data-at="5">{svg}'
        '<div class="lab"><b><span class="sh" data-at="1">Kość ramienna</span><span class="sh" data-at="2">Biceps brachii</span>'
        '<span class="sh" data-at="3">Triceps brachii</span><span class="sh" data-at="4,5">Nerwy i naczynia</span></b>'
        '<i><span class="sh" data-at="1">Humerus</span><span class="sh" data-at="2">Musculus biceps brachii</span>'
        '<span class="sh" data-at="3">antagonista · Musculus triceps brachii</span><span class="sh" data-at="4,5">Nervi et vasa</span></i></div></div>'
        f'<div class="side"><small>Warstwy</small><ul>{lis}</ul>'
        '<div class="tg"><b data-to="4">Prawa</b><b data-from="5">Lewa</b><b>Obie</b></div>'
        '<div class="card"><small><span class="sh" data-at="1">Zaznaczono</span><span class="sh" data-at="2">Zaznaczono</span>'
        '<span class="sh" data-at="3">Antagonista</span><span class="sh" data-at="4">Aktywne warstwy</span><span class="sh" data-at="5">Strona</span></small>'
        '<b><span class="sh" data-at="1">Kość ramienna</span><span class="sh" data-at="2">Biceps brachii</span><span class="sh" data-at="3">Triceps brachii</span>'
        '<span class="sh" data-at="4">5 z 6</span><span class="sh" data-at="5">lewa</span></b></div></div></div>'
        '</div><div class="dcap"></div>', caps)
