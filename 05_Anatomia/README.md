# 05 Anatomia — v0.12

Interaktywny model 3D **kończyny górnej, głowy i szyi, tułowia, miednicy, uda oraz podudzia i stopy** (prawa / lewa = lustro / obie): 32 kości, 67 siatek mięśniowych (51 mięśni), 109 punktów kostnych, **22 stawy** (typ, osie, powierzchnie, antagoniści, torebki) oraz czaszka i kręgi szyjne (wczytywane na żądanie). Nazwy polskie (duże) i łacińskie (pod spodem, w nawiasie), wyszukiwarka po wszystkich nazwach (PL/łac./ang.), regiony (bark · ramię · przedramię · dłoń), obrót modelu, początki (niebieski) i przyczepy końcowe (pomarańczowy) mięśni na kościach.

- Adres: https://anatomia.smialo.org/ (domena Workera podpięta 2026-11-16, tymczasowo do 2026-12-31) oraz https://projects.michus.workers.dev/05/ (stały). Żaden z nich nie jest za Cloudflare Access.
- Technologia: three.js (WebGL) + three-mesh-bvh; jeden `index.html` + pliki GLB i dane pozy (`public/`).
- Dane: `data/data.json` (nazwy, opisy, przyczepy, pozycje punktów).

## v0.12
- **Poza i animacja kończyny dolnej**: suwaki Staw biodrowy (zgięcie/wyprost, odwodzenie/przywodzenie, rotacja), Kolano (zgięcie), Kostka i stopa (grzbietowe/podeszwowe, inwersja/ewersja). Mięśnie uda i podudzia odkształcają się razem z kośćmi (skinning + kolizje z kością udową, piszczelą i stopą).
- Kliknięcie ▶ przy ruchu biodra / kolana / kostki / stawu podskokowego w panelu „Ruchy” wykonuje ruch na modelu (region „Podudzie i stopa” włącza się i wczytuje automatycznie); kadr kamery dopasowuje się do ułożonej nogi.
- Nowe gotowe pozy: siad, przysiad głęboki, noga w górę, noga w bok, wspięcie na palce, pięta do pośladka.
- Dane pozy nogi: `public/skin_lower.bin`, `col_lower.bin`, `dlt_lower.bin` (generuje `tools/pose_build.py`).

## v0.11
- Pasek przełączników paneli (Karta, Powiązania, Ruchy, Poza, Testy, Widoczność, Analiza) przeniesiony do górnego paska obok „Menu”; te same przełączniki są też w Menu → „Panele” (na telefonie pasek zostaje na dole).
- Panel „Ruchy”: komplet ruchów wszystkich stawów (bark → palce, szyja, kręgosłup piersiowy i lędźwiowy, biodro, kolano, kostka, staw podskokowy, palce stopy) z listą mięśni wykonujących każdy ruch; ▶ = animacja na modelu, ◎ = podświetla mięśnie ruchu.
- Nowe stawy w danych (`tools/add_joints.py`): biodrowy, krzyżowo-biodrowy, kolanowy, skokowo-goleniowy, podskokowy, MTP, kręgosłup lędźwiowy / piersiowy / szyjny.
- Wybrany mięsień (np. biodrowo-lędźwiowy) pokazuje teraz ruchy, które wykonuje, także w kończynie dolnej i tułowiu.

## v0.10
- **Zakresy ruchu = maksymalny zdrowy zakres + zaznaczona norma**: suwaki w panelu Poza mają pasek: 🟩 zielone = norma (typowy zdrowy dorosły, WHO / Luttgens), 🟧 bursztynowe = do maksymalnego zdrowego zakresu (AAOS / Kapandji, ruch bierny do końca), kreska = 0°; szare (kreskowane) pola = niedostępne w tej pozie. Nowe maksima: rotacja zewnętrzna 100°, wewnętrzna 90°, przywiedzenie 50°, zgięcie łokcia 150° (przeprost −10°), nawrót/odwrót ±90°.
- **Rotacja barku zależna od pozycji**: dozwolony zakres rotacji zewn. 90→100° i wewn. 70→90° rośnie z uniesieniem ramienia (do 90°) i maleje powyżej; przywiedzenie 12° przy ramieniu opuszczonym do 50° przy ramieniu przed tułowiem. Suwak R pokazuje teraz **rzeczywisty skręt** kości ramiennej (naturalny skręt zewnętrzny przy odwodzeniu — paradoks Codmana — dodawany automatycznie do R przy ruchu F/A; wcześniej był ukryty w modelu, przez co granice rotacji w uniesieniu były błędne).
- **🩺 Testy** (menu + dolny pasek): 31 testów ruchowych (bark, obręcz barkowa, łokieć, przedramię, nadgarstek: rotacje z oporem, test puszki, łuk bolesny, Hawkins–Kennedy, Neer, przywodzenie, Gerber, Hornblower, Speed, Yergason, Cozen, Mills, Maudsley, łokieć golfisty, Finkelstein…). Każdy: jak wykonać, rodzaj (czynny / bierny / z oporem), „Pokaż w pozie” (ustawia model, widok i podświetla mięśnie: główne i współpracujące), podejrzane mięśnie przy bólu, „pomyśl też o”. Filtr „Gdzie boli?” (11 okolic). Dane: `src/tests.js`. Materiał edukacyjny — nie diagnoza.
- **Zawijanie przy łopatce / skrajne pozy**: warstwy mięśni zachowują odstęp od kości (do 35 mm, 4 kolidery na wierzchołek); przedramię skręca się wzdłuż długości (segmenty pomocnicze tw1/tw2) — koniec z pętlą zginacza promieniowego i „konfetti” przy nawrocie; wagi harmoniczne z przyczepami wg grup kinematycznych; kolizje przez zawias łokcia/nadgarstka tylko symboliczne (bez „szrapneli” przy zgięciu 120–150°).
- Poprawki interfejsu (bez zmiany wersji): komunikaty na dole (np. nazwa pozy) same znikają po kilku sekundach i nie zasłaniają paska paneli; prawy panel w wąskim oknie zaczyna się pod paskiem widoków (Obrót/Reset/Ciało…), nie na nim; pasek paneli w oknie <1180 px pokazuje same ikony (cały mieści się na ekranie, kółko myszy przewija).
- Poprawki klikania (bez zmiany wersji): pasek paneli nie jest już przebudowywany przy każdej klatce animacji (gubiło to kliknięcia) — przyciski aktualizują się w miejscu; kliknięcie „Karta / Powiązania / Ruchy” bez zaznaczonej struktury od razu pokazuje panel z podpowiedzią i ☑; w oknie <1180 px aktywne przyciski też mają same ikony.
- Układ paneli (bez zmiany wersji): kilka paneli w jednej kolumnie dzieli teraz dostępną wysokość i przewija się w środku — wcześniej drugi i kolejne panele lądowały pod pierwszym, poza ekranem, więc włączenie ich z dolnego paska wyglądało jak brak reakcji.
- Ograniczenia: brak kolizji mięsień–mięsień (drobne przebicia), zgięcie łokcia >130° marszczy tkanki w zgięciu łokciowym; rotacja zależna od pozycji jest uproszczeniem (funkcja stopnia uniesienia), wartości do weryfikacji przez fizjoterapeutę.

## v0.09
- **Mięśnie w ruchu — zawijanie i fizyka (poprawka po v0.08)**: w v0.08 mięśnie przy dużych kątach (ręka w górze) zapadały się do osi lub rozciągały w cienkie „nitki”, a główka kości ramiennej przebijała mięśnie. Teraz:
  1. **Skinning „oś + obrócona delta”** (`src/dqs.js`, `skinDelta`): siatka mięśnia dzielona offline na wygładzoną „oś” (Laplace ×100) i deltę (grubość/szczegóły, `public/dlt_*.bin`); oś jest skinowana liniowo (cięciwa jak napięty mięsień), delta obracana mieszanym kwaternionem — grubość zachowana, bez zapadania (test: przy 200° LBS zostawia 17% promienia, tu 100%) i bez „pompowania” czystego dual-quaternion. Kwaterniony ciągłe względem parametrów pozy (bez przeskoku półkuli powyżej 180°).
  2. **Wagi harmoniczne** (`tools/pose_build.py`, `harmonic`): wierzchołki przy przyczepach stałe, odcinek swobodny między nimi = rozwiązanie równania Laplace'a po siatce → rozciąganie rozłożone równomiernie wzdłuż mięśnia.
  3. **Owijanie / kolizje z kośćmi** (`public/pose_sdf.bin`, `col_*.bin`, `tools/pose_sdf.py`): pola odległości (SDF 3–6 mm) obojczyka, łopatki, kości ramiennej, łokciowej, promieniowej i klatki piersiowej; po skinningu wierzchołki wypychane z kości (min. odstęp = odstęp spoczynkowy ≤ 2 mm) — najszerszy grzbietu, piersiowy większy i obły zawijają się przed główką kości ramiennej. Przełącznik „Owijanie mięśni wokół kości” w panelu Poza.
  Dane pozy (~9 MB) doczytywane przy pierwszym ruchu, nie przy starcie. Ograniczenia: brak kolizji mięsień–mięsień (drobne przebicia), SDF powłok kości (łopatka, obojczyk) przybliżony.
- Panel Poza na telefonie: dolna szuflada ograniczona do 46% wysokości, model oddala się i mieści nad nią.

## v0.08
- **🦾 Poza — model ruchomy w stawach**: suwaki w zakresach ruchu zdrowego dorosłego (AAOS / Kapandji): ramię zgięcie/wyprost (−60…180°), odwodzenie/przywodzenie (−30…180°), rotacja (−90…70°), łokieć (0…145°), nawrócenie/odwrócenie (−90…85°), nadgarstek (−70…80°, odchylenie −20…30°), obojczyk i łopatka (unoszenie, protrakcja) + **rytm łopatkowo-ramienny** (≈2:1, włączany). Gotowe pozy: ręka w górze (zgięcie/odwodzenie 180°), ramię w bok/do przodu 90°, łokieć 90° w płaszczyźnie strzałkowej i poprzecznej, „stop”, dłoń do barku, ręka za plecami. Pozycja 0° = pozycja anatomiczna modelu. Chipy w panelu „Ruchy” oraz PPM → „Pokaż w ruchu…” ustawiają pozę dla wybranego mięśnia.
- **Jak to działa**: kości i płytki sztywne (segmenty: tułów, obojczyk, łopatka, ramię, łokieć/kość łokciowa, promień, dłoń); mięśnie, więzadła, nerwy i naczynia odkształcają się przez skinning liniowy (4 wpływy, wagi wg odległości od kości, offline: `tools/pose_*.py` → `public/pose.json`, `skin_*.bin`). Wybieranie myszą działa na pozie (BVH odświeżany). Pozycja jest symetryczna dla obu rąk; palce, szyja i kończyna dolna na razie nieruchome. To przybliżenie wizualne — nie symulacja biomechaniczna; zakresy z literatury do weryfikacji przez fizjoterapeutę.
- **Panele tematyczne zamiast jednego panelu po prawej**: Karta · Powiązania · Ruchy · Poza · Widoczność · Analiza — włączane/wyłączane pasek-dokiem u dołu (z odznakami), zwijane, przenoszone lewo↔prawo, zamykane; układ pamiętany. Kamera przesuwa model w wolne miejsce (na telefonie panel jest dolną szufladą).
- **Ukrywanie na modelu (dostęp do mięśni głębszych)**: `Shift + klik` ukrywa mięsień/kość pod kursorem, kolejny klik w to samo miejsce odsłania warstwę niżej; `PPM` / długie przytrzymanie → menu (Zaznacz · Ukryj · Tło · Wyróżnij · Pokaż tylko ten · Dodaj do wyboru · Pokaż w ruchu); `H` / `Delete` ukrywa zaznaczony, `Shift+H` pokazuje wszystkie, `Ctrl+Z` cofa; panel „Widoczność” i licznik ukrytych z przywracaniem pojedynczo.
- **`Ctrl` ≠ `Shift`**: Ctrl (⌘) + klik = dodaj do wyboru wielu mięśni; Shift + klik = ukryj.
- Karta mięśnia podzielona na zakładki (karta / powiązania / ruchy), Analiza objawów we własnym panelu.

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
