# 05 Anatomia — v0.07

Interaktywny model 3D **kończyny górnej, głowy i szyi, tułowia, miednicy, uda oraz podudzia i stopy** (prawa / lewa = lustro / obie): 32 kości, 67 siatek mięśniowych (51 mięśni), 109 punktów kostnych, **22 stawy** (typ, osie, powierzchnie, antagoniści, torebki) oraz czaszka i kręgi szyjne (wczytywane na żądanie). Nazwy polskie (duże) i łacińskie (pod spodem, w nawiasie), wyszukiwarka po wszystkich nazwach (PL/łac./ang.), regiony (bark · ramię · przedramię · dłoń), obrót modelu, początki (niebieski) i przyczepy końcowe (pomarańczowy) mięśni na kościach.

- Adres: https://anatomia.smialo.org/ (domena Workera podpięta 2026-11-16, tymczasowo do 2026-12-31) oraz https://projects.michus.workers.dev/05/ (stały). Żaden z nich nie jest za Cloudflare Access.
- Technologia: three.js (WebGL) + three-mesh-bvh; jeden `index.html` + dwa pliki GLB (`public/`).
- Dane: `data/data.json` (nazwy, opisy, przyczepy, pozycje punktów).

## v0.07
- **Kolory**: każdy mięsień ma własny kolor (`data.groups[k].col`, 113 odcieni rozłożonych tak, by sąsiadujące mięśnie się różniły — `tools/colors.py`: graf sąsiedztwa z siatek 3D + kolorowanie DSATUR w przestrzeni Lab).
- **Najechanie kursorem** (na model lub na pozycję listy) na mięsień/kość: reszta modelu traci 40% krycia.
- **Lista mięśni**: zamiast „oka” mały `select` (Pokaż / Tło / Wyróżnij / Ukryj) + kolorowa kropka; klik w nazwę nigdy nie chowa mięśnia (zdejmuje Ukryj/Tło).
- Nowy region **Podudzie i stopa**: 29 grup mięśni (goleń, łydka, Achilles, rozcięgno podeszwowe, mięśnie stopy), 16 kości (piszczel, strzałka, rzepka, kości stopy), `lower.glb` doczytywany na żądanie; udo i kość udowa z regionu Tułów (widoczne razem w widoku kolana). Mapa ciała: osobne strefy uda i podudzia.
- **🔎 Analiza objawów bez AI** (działa w przeglądarce, offline): okolica (12: lędźwie, górne plecy, kark, żuchwa, bark, łokieć, nadgarstek, biodro, udo, kolano, podudzie, kostka/stopa) + czynniki (siedzenie, dźwiganie, schody, bieganie, noc, ulga w zgięciu…) + opis własnymi słowami → 72 przyczyny z prawdopodobieństwem %, mięśnie, które mogą boleć (szansa %), co wzmocnić (ćwiczenia z dawkowaniem), co rozciągać, kiedy do lekarza. Pozycje (dziecka, deska…) dają dodatkową zakładkę „Pozycja” z podziałem pracy mięśni. Baza wiedzy: `src/kb_*.js`, silnik: `src/symptoms.js`. Prawdopodobieństwa = częstość × czynniki (heurystyka edukacyjna, nie diagnoza; treści do przeglądu przez fizjoterapeutę).
- Z Workera usunięto endpoint `/api/anatomia/analyze` (AI nie jest już używane).
- Brak stawów biodra/kolana/kostki w zakładce Stawy (planowane).

## v0.06
- **🔎 Analiza objawów**: opisz pozycję/ruch i dyskomfort (np. „ból w lędźwiach w pozycji dziecka”) → mięśnie na modelu w kolorach (główne / pomocnicze / stabilizatory), szacunkowy udział % (suma = 100), tryb pracy (czynny / izometryczny / rozciągany / skrócony), możliwe przyczyny, co **wzmocnić** (zielone), co **rozciągać** (niebieskie) z konkretnymi ćwiczeniami, objawy alarmowe. 9 wzorców wbudowanych działa offline (`src/analysis.js`), a dla innych opisów — AI przez Workera (`/api/anatomia/analyze`: Claude, gdy jest `ANTHROPIC_API_KEY`, inaczej Workers AI/Llama; limit 15 zapytań/h/IP, hash w D1 `ana_rl`). Procenty to oszacowania edukacyjne, nie pomiar EMG; narzędzie nie jest diagnozą.
- Nowy region **Tułów i biodro**: 41 grup mięśni (prostownik grzbietu, mięśnie głębokie, brzucha, pośladki, rotatory biodra, dno miednicy, udo — czworogłowy, kulszowo-goleniowe, przywodziciele) + kości (L1–L5, kość krzyżowa i guziczna, miednica, kość udowa); `trunk.glb` ładowany na żądanie (6 MB). Mapa ciała: tułów i biodro/udo aktywne.

## v0.05
- Nowe zakładki: Więzadła (77), Nerwy (52), Naczynia (63: tętnice i żyły) kończyny górnej — modele 3D z opisami PL/LA, doczytywane na żądanie; warstwy w menu „Warstwy”.
- Karta stawu wypisuje jego więzadła i torebki; wyszukiwarka indeksuje nowe struktury.

## v0.04
- Głowa i szyja: 55 mięśni 3D (żucia, mimiczne, nad-/podgnykowe, szyi, podpotyliczne, karku), doczytywane przy wejściu w region.
- Weryfikacja stawów (Kenhub, Gray, WikiMSK, anatomy.app): ruchy TMJ i szczytowo-potyliczno-obrotowych podpięte do prawdziwych mięśni modelu; MOS jako prostownik głowy; przesunięcia boczne żuchwy.

## v0.03
- Przycisk „🧍 Ciało": mapa sylwetki, klik w obszar ustawia stronę (prawa/lewa) i region.
- Podpowiedź o zaznaczaniu wielu mięśni (zamykana) + opis w pomocy.

## v0.02
- Lewa strona: lustrzane odbicie prawej (kości i mięśnie kończyny), przełącznik Prawa/Lewa/Obie; struktury środkowe (mostek, kręgi, czaszka) bez dublowania.
- Zakładka **Stawy**: rodzaj (prosty/złożony), kształt i kolor, liczba osi, liczba powierzchni, stawy piętrowe (dwujamowe), ruchy z agonistami i antagonistami; torebki i krążki jako siatki 3D; znaczniki styków kości policzone z modelu.
- **Wiele mięśni** naraz (przycisk lub Ctrl/Shift + klik), „Z antagonistami”, „Pokaż mięśnie stawu”.
- Licznik unikalnych IP: Worker zapisuje tylko skrót SHA-256 (IP + sól) w D1 `projects-stats` (tabela `visits`); podgląd: `/api/stats` (za Cloudflare Access) lub zapytanie D1.
- Adres tymczasowy `anatomia.smialo.org` wygasa 2026-12-31 (stała `PUBLIC_UNTIL` w `00_Worker/worker.js`).

## Budowanie
`python3 build.py` → `index.html` (skleja `src/` + `data/data.json`; przy zmianie `src/app.js`: `npm i`, potem ponownie `python3 build.py` — esbuild odświeży `src/app.bundle.js`). Deploy: push do `main` (workflow `deploy.yml`).

## Potok danych (`tools/`, tylko przy zmianie modelu)
1. Źródło modelu: repo `LluisV/Z-Anatomy` → `Resources/Models/FBX/{Skeletal,Muscular}System100.fbx`.
2. `tools/export_glb.py` (Blender jako moduł Pythona: `pip install bpy`) → `muscles.glb`, `bones.glb`, mapowanie ID, pozycje punktów; `tools/export_joints.py` → `axial.glb` (czaszka, C1–C6), `joints.glb` (torebki, krążki), `joint_pos.json` (styki kości).
3. `tools/content.py`, `tools/joints.py` — tłumaczenia i opisy stawów PL/łac. i opisy (do ręcznej korekty), `tools/build_data.py` → `data/data.json`.

## Licencje
Model: **Z-Anatomy** (CC BY-SA 4.0) na bazie **BodyParts3D** © The Database Center for Life Science (CC BY-SA 2.1 Japan). Praca pochodna — ta sama licencja dla modeli i danych (`LICENSE-DATA.md`). Opisy edukacyjne; przyczepy na modelu orientacyjne.

## TODO (kolejne wersje)
Lewa strona / pełne ciało, więzadła i stawy, nerwy i naczynia, tryb quizu, przekroje, eksport widoku.
