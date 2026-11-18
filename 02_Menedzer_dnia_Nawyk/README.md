# 02 · Nawyk — menedżer dnia (v0.05)

Codzienny zestaw małych zadań z sekcjami, które można dowolnie zmieniać. Autor: Michał Rzekiecki · kontakt@smialo.org

- **Nowe w v0.05**: notatki z poprzednich dni wracają jako przypomnienie (pasek na górze + w karcie); jedna ankieta „Jak poszło?” na dole strony (zamiast pod każdym ćwiczeniem) z informacją po co; Podsumowanie raz na 3 dni (wykres samopoczucie ↔ wynik) i tygodniowe dodatki raz na 7 dni, w pozostałe dni krótka zapowiedź; osobno „Co zrobić” (Kiedy / Zrobione, gdy / Do kiedy) i zwijana „Jak wykonać”; cytaty z klasyki (domena publiczna, tytuł, „Pokaż następny”); ćwiczenia oddechowe przed dźwiękowymi; 3 poziomy (podstawowy/średni/zaawansowany) z bazą ruchów i opisem pozycji startowej i końcowej; terminy „do kiedy” przy zadaniach i „Wróć wieczorem odhaczyć listę”; wyraźne przyciski „Zrobione — zalicz na dziś”; kolorowe, zróżnicowane nagłówki.
- Nowe w v0.04: pytania na start dnia (sen 1–5, chęć do ćwiczeń 1–5; można pominąć), ocena pod każdym wykonanym zadaniem (czy wykonane dobrze 1–5, czy lepiej po ćwiczeniu 1–5; mały druk o podsumowaniu tygodnia), karta **Notatki i postępy** dostępna codziennie (nie liczy się do postępu; dokładana też do zestawów i istniejących układów), **Podsumowanie** (menu ⋯ lub samo po zrobieniu wszystkich zadań): wykres samopoczucie ↔ wynik z 14 dni, wykres siły nawyku, wnioski z danych i tekst „Ćwicz dalej, a efekty już masz ;)”.
- **Zestawy nawyków** (menu ⋯): Charyzma, Rozciąganie i ruch, Skupienie i porządek, Pusty (własny). Wczytanie zestawu można cofnąć.
- **Edytuj układ**: nazwa i ikona sekcji, kolejność, dodawanie/usuwanie bloków: nagrania YouTube (własne linki), sesja z timerem (także własna), ćwiczenie dnia (zestaw + własne ćwiczenia, filtr rodzaju), trening, dziennik (własne pytania), lista zadań, checklista.
- **Wygląd**: 8 kolorów, tryb auto/ciemny/jasny, delikatne odcienie sekcji.
- **Kopia danych**: eksport/import JSON. Zapis: urządzenie + chmura (Claude: baza artefaktu; własny hosting: D1 przez Worker `/api/state/nawyk`, tożsamość = e-mail z Access albo klucz synchronizacji z okna „Kopia danych”; drugie urządzenie łączysz wklejając klucz).
- Ćwiczenia rozciągania: 30 (relaks, statyczne, dynamiczne, zabawa, biuro), skupienie: 15, charyzma: 42, niski głos: 14.

## Budowa
`python3 build.py` składa `index.html` z `src/` (figs.js, figs_stretch.js, data_charyzma.js, data_zestawy.js, core.js, app.src.html).
Wdrożenie: push do `main` → wspólny Worker `projects` (00_Worker) → **https://projects.michus.workers.dev/02/** (domena smialo.org nie jest podpięta).
`backup/` — kopie wersji finalnych (od v1.0).
