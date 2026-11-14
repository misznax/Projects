# 05 Anatomia — v0.01

Interaktywny model 3D **prawej kończyny górnej**: 32 kości, 67 siatek mięśniowych (51 mięśni), 109 punktów kostnych. Nazwy polskie (duże) i łacińskie (pod spodem, w nawiasie), wyszukiwarka po wszystkich nazwach (PL/łac./ang.), regiony (bark · ramię · przedramię · dłoń), obrót modelu, początki (niebieski) i przyczepy końcowe (pomarańczowy) mięśni na kościach.

- Adres: `projects.smialo.org/05/` (oraz `anatomia.smialo.org`, wpis w `00_Worker/apps.json`)
- Technologia: three.js (WebGL) + three-mesh-bvh; jeden `index.html` + dwa pliki GLB (`public/`).
- Dane: `data/data.json` (nazwy, opisy, przyczepy, pozycje punktów).

## Budowanie
`python3 build.py` → `index.html` (skleja `src/` + `data/data.json`; przy zmianie `src/app.js`: `npm i`, potem ponownie `python3 build.py` — esbuild odświeży `src/app.bundle.js`). Deploy: push do `main` (workflow `deploy.yml`).

## Potok danych (`tools/`, tylko przy zmianie modelu)
1. Źródło modelu: repo `LluisV/Z-Anatomy` → `Resources/Models/FBX/{Skeletal,Muscular}System100.fbx`.
2. `tools/export_glb.py` (Blender jako moduł Pythona: `pip install bpy`) → `muscles.glb`, `bones.glb`, mapowanie ID, pozycje punktów (przyciągane do powierzchni kości).
3. `tools/content.py` — tłumaczenia PL/łac. i opisy (do ręcznej korekty), `tools/build_data.py` → `data/data.json`.

## Licencje
Model: **Z-Anatomy** (CC BY-SA 4.0) na bazie **BodyParts3D** © The Database Center for Life Science (CC BY-SA 2.1 Japan). Praca pochodna — ta sama licencja dla modeli i danych (`LICENSE-DATA.md`). Opisy edukacyjne; przyczepy na modelu orientacyjne.

## TODO (kolejne wersje)
Lewa strona / pełne ciało, więzadła i stawy, nerwy i naczynia, tryb quizu, przekroje, eksport widoku.
