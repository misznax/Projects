# Startup Board

Dowolna liczba swobodnych paneli roboczych (start: 6) z pamięcią stanu: pliki tekstowe (kolorowanie Python/HTML/SQL), PDF i obrazy.
Autor: Michał Rzekiecki · kontakt: kontakt@smialo.org

- Pobierz: Releases → `startupboard-latest` → `StartupBoard_v1.42.zip`, rozpakuj i uruchom `StartupBoard.exe`.
- Źródła: `src/`, build: `python build_exe.py`, kopie wersji: `backup/`.
- Stan zapisuje się w `%LOCALAPPDATA%\smialo\StartupBoard (v1.3 sama przenosi stan, który v1.1–1.2 zapisały w folderze „Startup Board” ze spacją)\` (menu Pomoc → „Folder z ustawieniami"): `state.json`, `zestawy\`, `obrazy\`, `startupboard.log`.

## Najważniejsze
- Pusty panel ma **+** → nowy plik tekstowy gotowy do pisania (nazwę wybierasz przy pierwszym Ctrl+S). **Ctrl+V** wkleja do pustego panelu skopiowany plik, tekst (nowy dokument) albo obraz; w edytorze działa jak zwykle. Obok: obraz ze schowka (Ctrl+Shift+V), obraz z pliku, otwórz plik; można też przeciągnąć plik na panel.
- Wygląd **Morze i limonka** (ciemny i jasny): subtelny gradient limonka ↔ morski w paskach, ramkach i tle (można wyłączyć w Ustawieniach). Starsze motywy nadal dostępne.
- Kolorowanie: słowa kluczowe (if, for, SELECT…), definicje, stałe, funkcje, klasy, dekoratory, znaczniki i atrybuty HTML, adresy www/e-mail, daty, TODO/UWAGA oraz interpunkcja – każda rola ma własny kolor (Ustawienia → Składnia).
- **Folder w panelu** (Ctrl+Shift+O, przycisk „Folder…”, przeciągnięcie lub wklejenie folderu): lista jak w Total Commanderze. Enter/dwuklik otwiera (plik trafia do wolnego panelu), Backspace w górę, F2 nazwa, F5 kopiuj, F6 przenieś do drugiego panelu folderu, F7 nowy folder, Del do kosza. Lekki: czyta jeden katalog naraz, a widok znika z pamięci po zamknięciu panelu.
- **Przypomnienia** (Ctrl+Shift+R, przycisk „Przypomnienia” w pustym panelu; Ctrl+Alt+N = szybkie nowe): okno z treścią, datą, godziną i kolorem. Wpisz np. „skaling jutro 10:00” – termin rozpoznawany sam. Każde przypomnienie ma swój kolor (zmiana: prawy przycisk → Kolor), w terminie wyskakuje okno z „Gotowe / Za 10 minut”.
- **Schowek** (Ctrl+Shift+H, przycisk „Schowek” w pustym panelu): historia skopiowanych **tekstów** i **grafik** w dwóch zakładkach. Domyślnie wyłączona; włączasz polem „Przechwytuj schowek” (albo Widok → Przechwytuj schowek). Bez nasłuchu, gdy wyłączona; włączona korzysta ze zdarzenia systemu (bez odpytywania). Enter/dwuklik tekstu = kopiuj, dwuklik grafiki = otwórz w nowym panelu, Del = usuń. Tylko w pamięci i w folderze tymczasowym – po zamknięciu programu znika (w schowku bywają hasła; menedżery haseł są pomijane). Limit: 100 tekstów i 30 grafik.
- **Ustawienia** (Widok → Ustawienia…, Ctrl+,): motyw, kolory składni i interfejsu, ramki, czcionka, ikona – z podglądem na żywo; Anuluj cofa zmiany.
- **Zestawy**: zapisz bieżący układ paneli z otwartymi plikami pod nazwą i wracaj do niego jednym kliknięciem.
- **Autozapis** (Plik → Autozapis, domyślnie włączony): zmiany trafiają do pliku 2 s po ostatnim naciśniętym znaku, zamknięcie programu też zapisuje. **Historia wersji** (Plik → Historia wersji pliku…, Ctrl+Alt+H): ostatnie 5 kopii każdego pliku z podglądem i przywracaniem (Ctrl+Z cofa przywrócenie). Gdy plik zmieni inny program (np. Notatnik), autozapis wstrzymuje się i nie nadpisuje go, a poprzednia wersja ląduje w historii. Kopie: `historia\` w folderze ustawień.
- **Pasek kart** (Widok → Pasek kart): wąski pasek z jedną kartą na panel – klik przechodzi do panelu i wynosi go na wierzch, × lub środkowy przycisk zamyka, ● = niezapisany, ⚠ = konflikt/brak pliku. Tryby: **autoukrywanie** (domyślny; wysuwa się po najechaniu na górną krawędź i chowa po odjechaniu), zawsze widoczny, ukryty. **Ctrl+Tab / Ctrl+Shift+Tab** – następny / poprzedni panel (pasek mignie na chwilę), Alt+1..9 – panel o danym numerze. Limit paneli zdjęty (każdy dodatkowy to ok. 1 MB pamięci).
- Stan okien (układ, kursor, szkice) zapisuje się po każdej zmianie, bez zapisu w tle, gdy nic się nie dzieje.
- Ctrl+F / F3 / Shift+F3 – szukanie, Ctrl+Shift+S – zapisz jako, Ostatnie pliki w menu Plik.

## v1.4
- Pasek przypomnień u dołu okna: wpisz np. `skaling jutro 10:00` / `za 30 min` + Enter (Ctrl+Shift+P = fokus). Bez daty/godziny pole świeci na czerwono; po dodaniu „✔ dodano”. Domyślny kolor: zielony.
- Sprawdzanie co 3 min + dokładny budzik; alarm: 6 sygnałów co 10 s (okno na wierzchu). Własny dźwięk: Widok → Przypomnienia i alarm → „Dźwięk alarmu: wybierz plik…” (mp3/wav).
- Podwójny Shift przywołuje program (Windows; do wyłączenia w menu).
- Zamknięty program: zadanie w Harmonogramie zadań Windows uruchamia go na czas przypomnienia (`--alarm`).
- Ctrl+Tab / Ctrl+PgDn przełączają panele niezależnie od fokusu; pasek kart wysuwa się też przy pasku tytułu/menu.
- Drugie uruchomienie wyciąga działające okno. Przypomnienia ze starego folderu stanu są dołączane; dzienna kopia stanu w `kopie_stanu\`.

## v1.42
- **No Names**: tekst, który nie ma jeszcze nazwy, zapisuje się sam 2 s po ostatnim znaku jako `No Name 1.txt`, `No Name 2.txt`… w folderze `No Names` obok ustawień (Plik → „Folder No Names…” otwiera go w panelu). Zamknięcie programu lub wylogowanie Windows nie pyta o zapis i niczego nie gubi; Ctrl+S nadal pozwala nadać własną nazwę. Pusty szkic znika przy zamknięciu panelu.
- **Zoom tekstu Ctrl + kółko** (też Ctrl +/−, Ctrl+0 = 100%, Widok): równomierny, ×1,1 na ząbek (5–96 pt), osobno dla każdego panelu; skaluje się razem z nagłówkami i tabulatorem, rozmiar jest zapamiętywany.
- **Nagłówki w zwykłym tekście** (`# Temat`, `### Temat`, `1. Początek`, `1.2. Podpunkt`) są pogrubione i lekko powiększone – tylko w widoku, plik zostaje bez zmian. Wyłączysz w Widok → „Wyróżniaj nagłówki…”.
- **Widoki folderu** (przycisk „Widok” w panelu folderu lub prawy przycisk): Szczegóły, Lista, Ikony; **Ctrl + kółko** zmienia rozmiar ikon (12–48 px w Szczegółach i Liście, 24–128 px w Ikonach), wybór jest zapamiętywany w panelu.

## v1.41
- **Ctrl+V z samym obrazem** w schowku otwiera go w nowym panelu także wtedy, gdy kursor jest w edytorze (tekst + obraz, np. z Excela, wkleja się jak zwykle jako tekst). Bez nasłuchu, nic nie obciąża programu.
- **Schowek**: panel historii tekstów i grafik (opcjonalny, domyślnie wyłączony) – patrz „Najważniejsze”.
- **Podwójny Shift przełącza**: pierwszy raz wyciąga program na pierwszy plan, kolejny (gdy jest aktywny) chowa go.
- **Zasobnik** (Widok → Minimalizuj do zasobnika): minimalizacja i podwójny Shift chowają okno całkiem, bez przycisku na pasku zadań; ikona w zasobniku: klik = pokaż, prawy = Pokaż / Ukryj / Zakończ. Krzyżyk okna nadal zamyka program.
- Wersje to liczby dziesiętne (v1.41 < v1.5); zabezpieczenie przed nadpisaniem stanu przez starszy program działa też dla setnych.
