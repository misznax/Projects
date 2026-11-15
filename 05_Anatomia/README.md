# 05 Anatomia — v0.02

Interaktywny model 3D **kończyny górnej** (prawa / lewa = lustro / obie): 32 kości, 67 siatek mięśniowych (51 mięśni), 109 punktów kostnych, **22 stawy** (typ, osie, powierzchnie, antagoniści, torebki) oraz czaszka i kręgi szyjne (wczytywane na żądanie). Nazwy polskie (duże) i łacińskie (pod spodem, w nawiasie), wyszukiwarka po wszystkich nazwach (PL/łac./ang.), regiony (bark · ramię · przedramię · dłoń), obrót modelu, początki (niebieski) i przyczepy końcowe (pomarańczowy) mięśni na kościach.

- Adres: `projects.smialo.org/05/` (oraz `anatomia.smialo.org`, wpis w `00_Worker/apps.json`)
- Technologia: three.js (WebGL) + three-mesh-bvh; jeden `index.html` + dwa pliki GLB (`public/`).
- Dane: `data/data.json` (nazwy, opisy, przyczepy, pozycje punktów).

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
