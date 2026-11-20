# Startup Board

Do 8 swobodnych paneli roboczych z pamięcią stanu: pliki tekstowe (kolorowanie Python/HTML/SQL), PDF i obrazy.
Autor: Michał Rzekiecki · kontakt: kontakt@smialo.org

- Pobierz: Releases → `startupboard-latest` → `StartupBoard_v1.1.zip`, rozpakuj i uruchom `StartupBoard.exe`.
- Źródła: `src/`, build: `python build_exe.py`, kopie wersji: `backup/`.
- Stan zapisuje się w `%LOCALAPPDATA%\smialo\StartupBoard\` (menu Pomoc → „Folder z ustawieniami"): `state.json`, `zestawy\`, `obrazy\`, `startupboard.log`.

## Najważniejsze
- Pusty panel ma **+** → nowy plik tekstowy gotowy do pisania (nazwę wybierasz przy pierwszym Ctrl+S). **Ctrl+V** wkleja do pustego panelu skopiowany plik, tekst (nowy dokument) albo obraz; w edytorze działa jak zwykle. Obok: obraz ze schowka (Ctrl+Shift+V), obraz z pliku, otwórz plik; można też przeciągnąć plik na panel.
- Wygląd **Morze i limonka** (ciemny i jasny): subtelny gradient limonka ↔ morski w paskach, ramkach i tle (można wyłączyć w Ustawieniach). Starsze motywy nadal dostępne.
- Kolorowanie: słowa kluczowe (if, for, SELECT…), definicje, stałe, funkcje, klasy, dekoratory, znaczniki i atrybuty HTML, adresy www/e-mail, daty, TODO/UWAGA oraz interpunkcja – każda rola ma własny kolor (Ustawienia → Składnia).
- **Folder w panelu** (Ctrl+Shift+O, przycisk „Folder…”, przeciągnięcie lub wklejenie folderu): lista jak w Total Commanderze. Enter/dwuklik otwiera (plik trafia do wolnego panelu), Backspace w górę, F2 nazwa, F5 kopiuj, F6 przenieś do drugiego panelu folderu, F7 nowy folder, Del do kosza. Lekki: czyta jeden katalog naraz, a widok znika z pamięci po zamknięciu panelu.
- **Przypomnienia** (Ctrl+Shift+R, przycisk „Przypomnienia” w pustym panelu; Ctrl+Alt+N = szybkie nowe): okno z treścią, datą, godziną i kolorem. Wpisz np. „skaling jutro 10:00” – termin rozpoznawany sam. Każde przypomnienie ma swój kolor (zmiana: prawy przycisk → Kolor), w terminie wyskakuje okno z „Gotowe / Za 10 minut”.
- **Ustawienia** (Widok → Ustawienia…, Ctrl+,): motyw, kolory składni i interfejsu, ramki, czcionka, ikona – z podglądem na żywo; Anuluj cofa zmiany.
- **Zestawy**: zapisz bieżący układ paneli z otwartymi plikami pod nazwą i wracaj do niego jednym kliknięciem.
- **Autozapis** (Plik → Autozapis, domyślnie włączony): zmiany trafiają do pliku 2 s po ostatnim naciśniętym znaku, zamknięcie programu też zapisuje. **Historia wersji** (Plik → Historia wersji pliku…, Ctrl+Alt+H): ostatnie 5 kopii każdego pliku z podglądem i przywracaniem (Ctrl+Z cofa przywrócenie). Gdy plik zmieni inny program (np. Notatnik), autozapis wstrzymuje się i nie nadpisuje go, a poprzednia wersja ląduje w historii. Kopie: `historia\` w folderze ustawień.
- Stan okien (układ, kursor, szkice) zapisuje się po każdej zmianie, bez zapisu w tle, gdy nic się nie dzieje.
- Ctrl+F / F3 / Shift+F3 – szukanie, Ctrl+Shift+S – zapisz jako, Ostatnie pliki w menu Plik.
