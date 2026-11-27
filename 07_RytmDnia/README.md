# Rytm Dnia

Mały widget na pulpit Windows (Python, tkinter, SQLite – **zero zależności**, próbkowanie aktywnego okna co 2 s).
Autor: Michał Rzekiecki · kontakt: kontakt@smialo.org · wersja: **v0.01**

- Pobierz: Releases → `rytmdnia-latest` → `RytmDnia_v0.01.zip`, rozpakuj i uruchom `RytmDnia.exe`.
- Źródła: `src/` (`rytm_core.py` logika, `rytm_dnia.py` widget), testy: `python -m unittest discover -s tests -v`, build: `python build_exe.py`, kopie wersji (od v1.0): `backup/`.

## Co robi
1. **Czas:** przy komputerze (aktywnie), w przeglądarce i na **aktywnej karcie** (Chrome, Edge, Firefox, Brave, Opera, Vivaldi). Karta = tytuł okna przeglądarki, więc bez rozszerzeń i bez dostępu do adresów URL. Przerwa (domyślnie 5 min bez ruchu myszą/klawiaturą) i uśpienie komputera nie są liczone. Okna prywatne (Incognito/InPrivate) są zapisywane bez tytułu.
2. **Sen:** pierwszego uruchomienia danego dnia (po 4:00) pyta o godzinę pójścia spać (wczoraj/w nocy) i wstania (dziś), liczy długość snu.
3. **Co 1 lub 2 godziny** (Menu → Ustawienia) pyta o samopoczucie (1–5, opcjonalna notatka) oraz **co jadłeś i o której** (lista ostatnich posiłków, można dodać kilka). Pytanie pojawia się tylko, gdy ktoś jest przy komputerze; „Zapytaj za 15 min” odkłada, Esc = odłożenie.
4. **Płyny:** wybierasz Woda / Kawa / Herbata / Inne i klikasz „Dodaj szklankę (300 ml)”. Prawy przycisk: 150 / 250 / 500 ml, własna ilość, cofnij ostatni wpis. Pasek postępu do dziennego celu (domyślnie 2000 ml).
5. **Podsumowanie dnia** (Menu): sen, czas, aplikacje, karty, posiłki, samopoczucie, płyny; przeglądanie wcześniejszych dni. **Eksport CSV** (dwa pliki z wersją w nazwie, otwierają się w Excelu).

## Widget
Bez ramki systemowej: przeciągasz za pasek tytułu, „Zwiń/Rozwiń” przełącza tryb jednolinijkowy, prawy przycisk myszy lub „Menu” otwiera menu (Podsumowanie, Zapytaj teraz, Sen, Ustawienia, Eksport, Sugestie, O autorze, Zakończ). Dzień logiczny zaczyna się o **4:00** (praca po północy liczy się do poprzedniego dnia).

## Dane i prywatność
Wszystko lokalnie: `%LOCALAPPDATA%\smialo\RytmDnia\` – `rytmdnia.db` (SQLite), `kopie\` (dzienna kopia, 7 ostatnich), `rytmdnia.log`. Nic nie jest wysyłane do sieci. Aplikacja musi działać na komputerze, bo tylko tam widzi aktywne okno.

## Oszczędność zasobów
Biblioteka standardowa i trzy wywołania systemowe na próbkę (aktywne okno, nazwa procesu z pamięci podręcznej, czas bezczynności); przy bezczynności próbkowanie co 5 s; zapis do bazy raz na minutę; brak wątków i brak odpytywania sieci.

## Wersje
- **v0.01** – pierwsza wersja: czas PC / przeglądarka / karta, sen, pytania co 1–2 h, posiłki, płyny, podsumowanie, eksport CSV, autostart z Windows (Ustawienia), jedna instancja.
