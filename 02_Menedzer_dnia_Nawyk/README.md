# 02 · Nawyk — menedżer dnia (v0.03)

Codzienny zestaw małych zadań z sekcjami, które można dowolnie zmieniać. Autor: Michał Rzekiecki · michus@gmail.com

- **Zestawy nawyków** (menu ⋯): Charyzma, Rozciąganie i ruch, Skupienie i porządek, Pusty (własny). Wczytanie zestawu można cofnąć.
- **Edytuj układ**: nazwa i ikona sekcji, kolejność, dodawanie/usuwanie bloków: nagrania YouTube (własne linki), sesja z timerem (także własna), ćwiczenie dnia (zestaw + własne ćwiczenia, filtr rodzaju), trening, dziennik (własne pytania), lista zadań, checklista.
- **Wygląd**: 8 kolorów, tryb auto/ciemny/jasny, delikatne odcienie sekcji.
- **Kopia danych**: eksport/import JSON. Zapis: urządzenie + chmura (Claude: baza artefaktu; własny hosting: D1 przez Worker, `/api/state/nawyk`).
- Ćwiczenia rozciągania: 30 (relaks, statyczne, dynamiczne, zabawa, biuro), skupienie: 15, charyzma: 42, niski głos: 14.

## Budowa
`python3 build.py` składa `index.html` z `src/` (figs.js, figs_stretch.js, data_charyzma.js, data_zestawy.js, core.js, app.src.html).
Wdrożenie: push do `main` → wspólny Worker `projects` (00_Worker) → `nawyk.smialo.org` / `projects.smialo.org/02/`.
`backup/` — kopie wersji finalnych (od v1.0).
