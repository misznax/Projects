# Startup Board

Do 8 swobodnych paneli roboczych z pamięcią stanu: pliki tekstowe (kolorowanie Python/HTML/SQL), PDF i obrazy.
Autor: Michał Rzekiecki · kontakt: michus@gmail.com

- Pobierz: Releases → `startupboard-latest` → `StartupBoard_v1.1.zip`, rozpakuj i uruchom `StartupBoard.exe`.
- Źródła: `src/`, build: `python build_exe.py`, kopie wersji: `backup/`.
- Stan zapisuje się w `%LOCALAPPDATA%\smialo\StartupBoard\` (menu Pomoc → „Folder z ustawieniami"): `state.json`, `zestawy\`, `obrazy\`, `startupboard.log`.

## Najważniejsze
- Pusty panel ma **+** → nowy plik tekstowy gotowy do pisania (nazwę wybierasz przy pierwszym Ctrl+S). **Ctrl+V** wkleja do pustego panelu skopiowany plik, tekst (nowy dokument) albo obraz; w edytorze działa jak zwykle. Obok: obraz ze schowka (Ctrl+Shift+V), obraz z pliku, otwórz plik; można też przeciągnąć plik na panel.
- Wygląd **Morze i limonka** (ciemny i jasny): subtelny gradient limonka ↔ morski w paskach, ramkach i tle (można wyłączyć w Ustawieniach). Starsze motywy nadal dostępne.
- Kolorowanie: słowa kluczowe (if, for, SELECT…), definicje, stałe, funkcje, klasy, dekoratory, znaczniki i atrybuty HTML, adresy www/e-mail, daty, TODO/UWAGA oraz interpunkcja – każda rola ma własny kolor (Ustawienia → Składnia).
- **Ustawienia** (Widok → Ustawienia…, Ctrl+,): motyw, kolory składni i interfejsu, ramki, czcionka, ikona – z podglądem na żywo; Anuluj cofa zmiany.
- **Zestawy**: zapisz bieżący układ paneli z otwartymi plikami pod nazwą i wracaj do niego jednym kliknięciem.
- Ctrl+F / F3 / Shift+F3 – szukanie, Ctrl+Shift+S – zapisz jako, Ostatnie pliki w menu Plik.
