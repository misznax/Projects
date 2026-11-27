# Creative Studio Social · v0.22

Studio treści na social media w przeglądarce: marka → grafiki (karuzele) → wideo (rolki 9:16) → audio → publikacja na Instagram, YouTube Shorts, TikTok i Facebook Reels.
Autor: Michał Rzekiecki · kontakt: michus@gmail.com · adres: https://projects.michus.workers.dev/06/

## Architektura

1. Jedna samowystarczalna strona `index.html` budowana przez `python3 build.py` z `src/*.js` + `src/app.src.html` + `vendor/mp4-muxer.min.js` (MIT).
2. Wdrożenie: wspólny Worker `projects` (`00_Worker/build.py` kopiuje plik do `dist/06/`), GitHub Actions po pushu na `main`.
3. Dane projektu: IndexedDB w przeglądarce użytkownika (`css-v1`: projekty, zasoby, wersje) + autozapis, migawki, eksport/import ZIP.
4. Jedna warstwa modelu (tekst, obraz, kształt, wideo, efekt, animacje wejścia/wyjścia/pętla, klatki kluczowe) i jedna funkcja `drawScene` dla edycji, podglądu i eksportu.
5. Dźwięk: własny silnik DSP w czystym JS (`src/dsp.js`): WSOLA (tempo), zmiana wysokości tonu, redukcja szumu STFT, usuwanie trzasków, korektor, kompresor, de-esser, usuwanie ciszy, głośność BS.1770 (LUFS), true peak, limiter, ducking, miks. Podgląd rolki gra dokładnie ten sam miks, który trafia do eksportu.
6. Eksport wideo: WebCodecs (H.264 + AAC) + mp4-muxer → MP4. Gdy przeglądarka nie ma własnego AAC (Firefox): wbudowany koder AAC-LC w WASM (`public/aac-worker.js`, ładowany dopiero wtedy); bez WebAssembly: Opus w MP4 z ostrzeżeniem; gdy brak WebCodecs: WebM (MediaRecorder).
7. AI przez Worker (klucze tylko jako sekrety): `/api/n/claude` (Claude, a bez klucza Llama), `/api/n/stt` (Whisper), `/api/s/img` (FLUX.1 schnell, Workers AI), `/api/s/status` (uczciwy stan integracji), `/api/s/drive/list|get` (folder Google Drive udostępniony linkiem: lista i pobranie plików, bez kluczy), `/api/s/link?url=` (pobranie pliku z linku Drive / GitHub / Dropbox; inne hosty odrzucone, brak otwartego proxy), `/api/s/doc?id=` (tekst Dokumentu Google udostępnionego linkiem, np. „Rolki” z Agent John), `/api/s/gas` i `/api/s/gput` (wysyłka gotowych rolek na Twój Drive: tylko skrypt `script.google.com/macros/s/…/exec` i sesja uploadu `googleapis.com/upload/drive/v3/files…`, inne adresy odrzucone).

## Moduły (zakładki)

| Zakładka | Co robi |
|---|---|
| Marka | karta „Marka z automatu” (kolory, fonty, uchwyt, zasady z repo marki; odśwież / odepnij), ręczna edycja, logo, referencje, 12 szablonów |
| Pomysły | pomysły z Drive + posty z Instagrama → plan rolki lub karuzeli, ostrzeżenia o powtórkach, balans formatów, slot „materiał instruktażowy” (uczenie stylu z karuzeli / rolki) |
| Grafiki | karuzele i posty: slajdy, warstwy, tło, usuwanie tła, obrazy AI, eksport PNG/JPG/ZIP |
| Wideo | oś czasu (10 ścieżek: Tło, Wideo, **Głowa**, Obrazy, Tekst, Grafiki, Animacje, Głos, Muzyka, Efekty dźw.), przyciski ⏮ ▶ ⏸ ⏹ + Spacja nad osią, klipy przeciągane w poziomie (czas) i w pionie (zmiana ścieżki, np. Wideo → Tło), lista **Warstw** z ikonami, ukryj / zablokuj / wyżej / niżej, sceny z szablonów, animacje, klatki kluczowe, napisy z nagrania, miks, eksport MP4; **🗣 Gadająca głowa** (wideo w kole / zaokrąglonym / prostokącie / pełnym ekranie, 4 rozmiary, 9 pozycji w bezpiecznej strefie, ramka, poświata, kadr, lustro, **miękkie krawędzie** i **miękkie przejście** wejścia i wyjścia z płynnym zanikiem dźwięku; po zaznaczeniu wideo pływający panel w lewym marginesie podglądu + te same opcje na górze panelu po prawej; dźwięk idzie na ścieżkę „Głos” i jest miksowany). Kolejność warstw: tła sceny → animowane tła → wideo → reszta (animowane tło nie zasłania już wideo, a pełnoekranowy efekt łapie kliknięcie dopiero, gdy pod kursorem nie ma nic innego); **📥 Rolka z dokumentu (Agent John)**: wklejony tekst dokumentu „Rolki” albo link → rolka z kartami w czasie, skrypt do telepromptera i opis |
| Import materiałów | jedno okno w każdym miejscu, gdzie dodajesz obraz / wideo / dźwięk: 🗂 biblioteka (też materiały z innych projektów aplikacji), ☁ folder Google Drive (z podfolderami), 🔗 link do pliku (Drive, GitHub, Dropbox), 📁 plik z urządzenia. Materiały z innych czatów i projektów Claude: zapis na Drive → folder udostępniony linkiem → wybór z listy |
| Audio | import nagrań z telefonu z Google Drive („☁ Z Drive”: folder Creative Studio > Audio Input udostępniony linkiem, link wklejany raz), nagrywanie z teleprompterem (okno rozciągalne i przeciągane, edytowalny tekst, wolne przewijanie w słowach/min, czcionka, szerokość, położenie, lustro, pełny ekran), edycja nieniszcząca (oryginał zostaje), łańcuch obróbki, raport jakości (LUFS, true peak, clipping, DC) |
| Publikacja | walidacja pod 4 sieci, opisy i hashtagi, bramka zatwierdzenia (6 kroków), FINAL PUBLISH, dziennik, kalendarz (ICS) |
| Asystent | z jednego pomysłu: koncepcja, hook, scenariusz → rolka lub karuzela + opis |

## Dane z automatu (v0.02): nic nie wgrywasz ręcznie

1. Aplikacja przy starcie wczytuje cztery pliki z `public/` (obok `index.html`): `brand.json` (paleta, fonty, zasady marki), `ideas.json` (pomysły z Drive), `ig.json` (ostatnie posty z Instagrama), `ref.json` + `ref-01..09.jpg` (wzorcowa karuzela i jej „DNA” układu).
2. Gdy pliku brak (offline), działa wbudowana kopia marki (`BRAND_BUILTIN`); aplikacja nie przestaje działać.
3. Odświeżanie: zaplanowane zadanie w chmurze czyta Drive (folder „Agent John”) i Instagram (Windsor), nadpisuje te pliki i commituje do `misznax/projects`; Worker wdraża się sam (~40 s). Przycisk „Odśwież” w aplikacji pobiera najnowsze pliki bez cache.
4. Źródło prawdy marki: repo `misznax/smialo` → `.claude/instagram/kolory-marki.md`. Zmiana ręczna kolorów/fontów/uchwytu odpina projekt od automatu (przycisk „Przypnij do automatu” przywraca).

### Schemat `ideas.json`

1. `items[]`: `id`, `title`, opcjonalnie `status`, `level` (M/U/O/H = siła dowodów), `hook`, `dur`, `spoken[]` (lektor), `cards[{t,text}]` (tekst na ekranie z czasem w sekundach), `shots[]`, `facts[{label,value,max,txt}]`, `summary`, `compare`, `note`, `src`, `doc` (id dokumentu w Drive), `variants[]`.
2. Pomysł z `cards` → rolka (pierwsza karta = okładka, karta z procentem = liczba, ostatnia = zakończenie); pomysł tylko z tematem → karuzela dobrana do struktury (spór → ostrzeżenie, ≥2 liczby → paski, źródło → osobny slajd).
3. „Rozwiń z AI” prosi model o 7–9 slajdów różnych rodzajów, wyłącznie z faktów pomysłu.

### Uczenie się z materiału (`src/learn.js`)

1. Analiza w przeglądarce (canvas, bez kluczy): poświaty (kolor i pozycja), pasek postępu, stopka, bloki tekstu, zdjęcie, akcenty → „DNA” układu, które steruje wszystkimi szablonami.
2. Wzorzec domyślny: karuzela „Po kontuzji” (v4). Własny materiał (obrazy lub wideo rolki) nadpisuje DNA w projekcie; rodzaje slajdów są rozpoznawane zgrubnie.

## Zmiany v0.22 (usuwanie rolek, Marka, spontaniczne pomysły)

1. Błąd: po zaznaczeniu „nie pytaj więcej” w natywnym oknie przeglądarki confirm() zwracał na stałe false i nie dało się usunąć żadnej rolki. Wszystkie confirm() i prompt() zastąpiły własne okna (`askYes`, `askText` w `core.js`), których przeglądarka nie zablokuje.
2. Wideo i Grafiki: zamiast menu „⋯” są przyciski ✎ (nazwa) i ✕ (usuń). Usunięcie jest od razu, z przyciskiem „Cofnij” (10 s); cofnięcie ostatniej rolki usuwa automatycznie utworzoną pustą.
3. Marka: trzy kolory w jednej kompaktowej linii (ustawia się je raz na długo), mniejsza karta „Marka z automatu”; duży Brand Kit i przykładowy nagłówek wyszły z panelu: otwiera je mały przycisk „🎨 Brand kit”.
4. „💡 Pomysł” (pasek u góry, menu ⋯, okno Nowa rolka): spontaniczny pomysł w 1-2 zdaniach, zapis jako nowy wiersz (status „pomysł”) w arkuszu **Lista rolek** na Drive (kolumna „Hook roboczy” = cały pomysł). Okno pokazuje potwierdzenie z numerem wiersza i linkiem. Pomysł najpierw trafia do kolejki w przeglądarce (`css-quick-ideas`) i znika z niej po potwierdzeniu zapisu, więc nie ginie bez Drive lub przy awarii sieci; zaległe wysyłają się same.
5. Skrypt Drive w wersji 3 (`apps-script/Code.gs`, akcja `idea`, blokada LockService, wykrywanie duplikatów, ID arkusza wstawia aplikacja). Wymaga jednorazowej aktualizacji: ⚙ Ustawienia Drive → skopiuj kod → wklej → Wdróż → Zarządzaj wdrożeniami → ołówek → Nowa wersja → zaakceptuj uprawnienie do arkuszy. Starszy skrypt nadal obsługuje wysyłkę rolek.

## Zmiany v0.21

1. Pliki archiwum mają w nazwie numer i tytuł rolki (np. `R001-Efekt reflektora - rolka (final).mp4`), tak jak pliki już leżące w folderze R001.

## Zmiany v0.20 (numeracja rolek, porządek na Drive)

1. Każda rolka ma od początku stały numer: litera typu (R rolka, K karuzela, P post) + 3 cyfry, np. R001. Numer nadaje się raz i nigdy nie jest używany ponownie. Kolejny wolny numer to największy znany (rolki.json `numeracja` i `topics[].num`, projekty w przeglądarce, foldery na Drive) + 1.
2. Folder rolki na Drive nazywa się `R001-Efekt reflektora` (numer, myślnik, tytuł; bez numeru banku tematów T04). Leży w `Śmiało – Rolki / Materiały` w produkcji, po publikacji w `Opublikowane`. Wszystko jednej rolki jest w tym jednym folderze: rolka (final), podkład muzyczny, miniatura, opis i hashtagi, projekt Studia (ZIP); szkice w podfolderze Szkice.
3. Nowa rolka: lista pokazuje numery; temat bez numeru (format do ustalenia) wybierasz „jako rolka” lub „jako karuzela” i numer nadaje się od razu; pusta rolka ma wybór typu. Folder na Drive zakłada się od razu, gdy Drive jest połączony.
4. Publikacja, sekcja 8: Archiwizuj na Drive (ponowna archiwizacja nadpisuje pliki o tych samych nazwach, stare idą do kosza Drive), „Opublikowana: przenieś do Opublikowane” (przenosi cały folder).
5. Skrypt Drive w wersji 2 (`apps-script/Code.gs`): ścieżki, akcje `names` i `move`, nadpisywanie opisu. Studio odmawia pracy ze starszym skryptem (zakładałby foldery o złych nazwach): wklej nowy kod z ⚙ Drive i zrób Wdróż → Zarządzaj wdrożeniami → ołówek → Nowa wersja.
6. Rejestr pomysłów to arkusz „Lista rolek” na Drive (numer, typ, tytuł, status, kategoria, autorzy badań, źródło, hook, temat z banku, data, folder). Studio go nie edytuje: status i datę wpisuje Agent John. W `rolki.json` temat R1 przemianowany na T27.

## Zmiany v0.19 (lista tematów, pusta rolka, status projektów)

1. Okno "Nowa rolka" (⋯ → Nowa rolka, przycisk w Wideo, Projekty, po archiwizacji): lista tematów T01–T26 z banku (public/rolki.json → topics, pole prio 1/2/3) albo "Pusta rolka" z własną nazwą. Wybrany temat ustawia nazwę "Tnn Tytuł" i planId (folder na Drive "Tnn Tytuł")
2. Pusty bieżący projekt jest używany ponownie (nie powstaje kolejny). Temat, który ma już projekt, ma przycisk "Otwórz projekt"
3. ⋯ → Projekty: status każdego projektu (pusty / temat bez materiałów / zawartość: grafiki, rolki, pliki, nagrania, rolka, miniatura, opis), znacznik archiwum na Drive, przycisk "Usuń puste" (pomija bieżący projekt i projekty z tematem)
4. Usunięto okno z domyślną nazwą "Nowa rolka <data>", które tworzyło projekty bez identyfikacji

## Zmiany v0.18 (zamykanie projektu)

1. W pasku Wideo przycisk "✕ Zamknij i nowa rolka": zapisuje bieżący projekt i otwiera pusty (stary zostaje w ⋯ → Projekty…)

## Zmiany v0.17 (archiwum rolki na Drive, folder główny Rolki do publikacji)

1. Sekcja 8 w Publikacji i pozycja w menu ⋯: "Archiwizuj na Drive" zapisuje w podfolderze "numer nazwa" (np. T04 Efekt reflektora) projekt Studia (ZIP ze wszystkimi materiałami), gotową rolkę, miniaturę i opis. Powrót: pobierz ZIP i ⋯ → Import projektu
2. Skrypt Apps Script (nowa wersja kodu, trzeba wkleić i wdrożyć nową wersję) umie podfoldery (pole sub) i pisze do istniejącego folderu głównego (ROOT_ID w drive.js) zamiast do nowego "Gotowe rolki"
3. Przycisk "➕ Nowa rolka" tworzy nowy projekt (stary zostaje zapisany w przeglądarce)

## Zmiany v0.16 (czytelniejsze opisy wysyłki na Drive i polecenia dla agenta)

1. Okno (⚙ Drive) zaczyna się od "Po co to jest" i podaje alternatywę bez skryptu (ręczne przeciągnięcie mp4 na Drive)
2. Nagłówek kodu skryptu Apps Script mówi, do czego służy i co zrobić
3. Krok 2 w Publikacji wyjaśnia, że polecenie to zwykłe zdanie do czatu z agentem (wystarczy napisać: publikuj)

## Zmiany v0.15 (Publikacja: 3 kroki do Metricool, Instagram i Facebook)

1. Sekcja 7 w trybie Metricool ma 3 numerowane kroki: wyślij na Drive, skopiuj polecenie, agent ustawia publikację
2. Polecenie dla agenta uwzględnia zaznaczone sieci (np. Instagram i Facebook) i mówi, że publikacja idzie przez Metricool
3. Przycisk wysyłki na Drive podaje wprost, dlaczego jest wyszarzony (brak eksportu, zatwierdzeń lub sieci)
4. Sieci z planu (rolki.json) wpisują się ponownie, gdy agent zmieni listę sieci rolki

## Zmiany v0.14 (Publikacja w sekcjach, opis i miniatura automatycznie, Audio przed Wideo)

1. **Kolejność zakładek**: Audio stoi przed Wideo (Marka, Pomysły, Grafiki, Audio, Wideo, Publikacja). Skróty Ctrl+1 do 6 idą za kolejnością.
2. **Publikacja w 7 numerowanych sekcjach**: 1 Materiał, 2 Miniatura z hookiem, 3 Opis i hashtagi, 4 Termin (lewa kolumna), 5 Sieci i kontrola, 6 Zatwierdzenie, 7 Publikacja (prawa kolumna), pod spodem Historia i Kalendarz.
3. **Tryb publikacji**: Automatyczna (zalecana: „☁ Wyślij pakiet do agenta” wysyła na Drive plik, miniaturę i opis, potem agent ustawia publikację w Metricool na polecenie) albo Ręczna (FINAL PUBLISH: pakiet ZIP i strony wgrywania). Oba tryby wymagają kompletu zatwierdzeń.
4. **Opis, hashtagi i tekst miniatury wpisują się same**: Studio czyta `public/rolki.json` (plan agenta: opis ze źródłami, hashtagi, sieci, tekst miniatury; pole `active` = rolka czekająca na publikację). Wpisuje tylko puste pola, nic nie nadpisuje. Wybór innej rolki z planu pyta o zastąpienie. Kontrola ostrzega, gdy w opisie brakuje linii „Źródło:”.
5. **Miniatura z hookiem** (`src/cover.js`): rysowana w kodzie, bez AI, 1080×1920: ciemne tło marki, stożek reflektora, siatka sześciokątów, nazwa zjawiska w fioletowej pigułce, hook w 3 liniach (środkowa linia z gradientem pomarańcz → żółć), podpis, logo lewy dół, @trenuj.smialo prawy dół. Treść w pasie bezpiecznym siatki profilu (3:4). Opcja „Z klatki rolki” używa klatki wyeksportowanego filmu jako tła. Powstaje sama, gdy jest tekst z planu, a miniatury brak. Trafia do pakietu ZIP i na Drive.
6. Test: Chrome headless (budowa, zakładki, Publikacja z planem, miniatura, eksport do Drive z atrapą).

## Zmiany v0.13 (Biblioteka marki, Szkic na Drive z odtwarzaczem)

1. **🏷 Złóż wg marki** (panel Wideo, sekcja „Marka”): jeden przycisk dokłada zakończenie, podkład i dzwonek z biblioteki marki i wyrównuje poziomy. Zakończenie startuje po ostatnim klipie wideo lub głosie, podkład idzie pod cały film (zapętlony, fade-in 1 s, fade-out 1,5 s, ducking wyłączony, stały poziom: ok. 17 LU pod głosem, czyli ok. 14% amplitudy), dzwonek startuje razem z zakończeniem. Głos nie jest ruszany. Ponowne złożenie zastępuje poprzednie (elementy mają znacznik `brand`).
2. **Biblioteka marki** = `public/marka-biblioteka.json` (zakończenia, podkłady, dzwonki z domyślnym wyborem ★) + pliki na Drive w folderze udostępnionym linkiem. Pliki pobiera Worker (`api/s/drive/get`), pobrane raz zostają w bibliotece projektu. Manifest aktualizuje agent (zmiana jednego małego pliku, bez zmiany kodu).
3. **Szkic na Drive**: „☁ Eksportuj na Drive” działa też dla jakości „Szkic” (540×960, 15 fps, 2 Mb/s). Plik ma w nazwie `_SZKIC`, nie zapisuje `_opis.txt` i nie nadpisuje rekordu publikacji. Po eksporcie szkicu okno wyników ma odtwarzacz, więc rolkę (z zakończeniem, podkładem i lektorem) obejrzysz przed pełnym eksportem i wysyłką. Szkic nadal nie trafia do Publikacji.
4. **Zakładka 🏷 Marka w oknie importu** (wideo: zakończenia, dźwięk: podkłady i dzwonki) i okno „Złóż wg marki” pokazują karty: nazwę, opis, projekt źródłowy, podgląd (miniatura i odtwarzacz wideo, odsłuch dźwięku) prosto z Drive, bez wgrywania. Plik trafia do biblioteki projektu po „Użyj”, z opisem (`desc`) i źródłem (`origin`).
5. **Biblioteka projektu** (zakładka 🗂): pełne nazwy, miniatury wideo, ▶ odsłuch przy dźwięku, opis, typ, czas, rozmiar i nazwa projektu przy każdym elemencie.
6. Długość: rolka kończy się na pełnej sekundzie po zakończeniu (np. treść 10 s + zakończenie 2,43 s = 13 s), ostatnia klatka zakończenia trzyma się do końca, podkład sięga do końca.
7. Test (Chrome headless, atrapa Workera i Drive): składanie, ponowne składanie (zamiana, bez duplikatów), poziomy (głos −18 LUFS, podkład −35, dzwonek −24), klatki zakończenia, eksport Szkicu 540×960 H.264 + AAC z odtwarzaczem i nazwą `_SZKIC`. Niesprawdzone: prawdziwy upload na Drive (Apps Script), odsłuch na urządzeniu.

## Zmiany v0.12 (AAC w Firefoxie, eksport na Drive)

1. **Koder AAC w WASM** (`src/aacshim.js` + `public/aac-worker.js`): przeglądarka bez własnego AAC (Firefox) nie zapisuje już Opus w MP4, tylko AAC-LC, który przyjmują Instagram, TikTok i YouTube. Plik workera to niezmieniony koder z paczki `@mediabunny/aac-encoder` (MPL-2.0, libavcodec/FFmpeg LGPL; patrz `public/aac-NOTICE.txt`), ok. 0,9 MB, ładowany tylko gdy natywnego AAC brak. Opóźnienie kodera (1024 próbki) jest kompensowane: sygnały dźwięku i błyski obrazu zgodne co do ok. 1 ms. Test: Chrome z wymuszonym brakiem AAC (`window.__forceAacWasm = true`).
2. **☁ Eksportuj na Drive** (okno eksportu) i **☁ Wyślij na Drive** (Publikacja, dla już wyeksportowanej rolki): plik trafia do folderu „Gotowe rolki” na Twoim Google Drive, razem z plikiem `…_opis.txt` (koncepcja, hook, tytuł, opis, hashtagi, termin), jeśli są wpisane. Biblioteka projektu to IndexedDB w przeglądarce, więc czat agenta jej nie widzi; Drive widzi.
3. **Jak to działa**: przeglądarka → Worker → skrypt Google (Apps Script) na Twoim koncie → sesja wznawialnego uploadu Drive. Plik idzie kawałkami po 8 MB przez Workera (bez problemów CORS), z ponawianiem po błędzie sieci i wznawianiem od miejsca, które Drive już ma. Skrypt: `apps-script/Code.gs` (hasło generuje aplikacja i wstawia do kodu).
4. **⚙ Ustawienia Drive** (jednorazowo, ok. 3 min): okno pokazuje kod skryptu z przyciskiem „Kopiuj”, kroki wdrożenia (script.google.com → Nowy projekt → wklej → Wdróż → Aplikacja internetowa → Wykonaj jako: Ja, Dostęp: Wszyscy → autoryzuj) i pole na adres `…/exec`. „Zapisz i sprawdź” robi test połączenia; folder „Gotowe rolki” powstaje sam. Zmiana nazwy lub ID folderu: stałe `FOLDER_NAME` / `FOLDER_ID` na górze skryptu.
5. (Od v0.13 Szkic można wysłać na Drive, patrz „Zmiany v0.13”.) Test na prawdziwym Google niewykonany (sprawdzono z atrapą skryptu i sesji uploadu oraz kod Workera: obce adresy odrzucane).

## Zmiany v0.11 (parowanie dźwięku, „zastosuj do wszystkich”, odświeżanie podglądu, eksport do biblioteki)

1. **Fragmenty po usunięciu ciszy zostają sparowane z wideo**: dźwięk powiązany z wideo po cięciu dalej podąża za obrazem (położenie i tempo wynikają z warstwy wideo), więc zmiana tempa i przesunięcie wideo działają na wszystkie fragmenty. Fragment zna swój zakres w pliku; przycięcie wideo ucina fragmenty poza zakresem (po wydłużeniu wracają). Przycięcie fragmentu ręcznie jest zapamiętywane, cięcie (S) dzieli zakres.
2. **Parowanie i odparowanie**: w panelu klipu dźwięku „🔓 Odparuj od wideo” / „Odparuj wszystkie (N)” oraz „🔗 Sparuj z wideo” / „Sparuj wszystkie (N)” (dla dźwięku z tego samego pliku co wideo na osi). Odparowany klip ma własne tempo: suwak ⏩ działa też dla klipów dźwięku.
3. **⇉ Zastosuj do wszystkich**: tempo (przycisk „⇉ wszystkie” przy suwaku na pasku osi i w panelu wideo), głośność i wyciszenie wideo, cały wygląd wideo / głowy (kształt, rozmiar, miejsce, kadr, ramka, poświata, przejścia), animacje wejścia i wyjścia, głośność i fade klipów dźwięku, a w oknie „Usuń ciszę” opcja dla wszystkich klipów ścieżki (każdy z własnym progiem). Kopiowanie dotyczy klipów tego samego typu i ścieżki; cofnij: Ctrl+Z.
4. **⟳ Odśwież podgląd** (obok ⏹): odtwarza elementy wideo, dekoduje dźwięk od nowa i rysuje klatkę, gdy obraz zamarł albo dźwięk nie gra.
5. **📚 Eksportuj do biblioteki** (okno eksportu): gotowy plik trafia do biblioteki projektu i do Publikacji bez pobierania na urządzenie (pobierzesz go potem z Publikacji). Automatyczne publikowanie na Instagramie wymaga adaptera Metricool (plan).

## Zmiany v0.10 (synchronizacja eksportu, usuwanie ciszy)

1. **Eksport trzyma rzeczywisty czas klatek**: DTS liczony jest z numerów klatek wyświetlania, a nie z kolejności wyjścia kodera. Gdy koder pominie klatki (w teście symulującym brak co 3. klatki obraz miał 6 s przy 9 s dźwięku), czas obrazu już się nie ściska, a pominięta klatka po prostu trwa dłużej. Test: 30/15 kl./s, tempo 1× i 1,5×, źródło ze zmienną liczbą klatek i klatkami B: błyski obrazu i sygnały dźwięku zgodne co do kilku ms.
2. **Okno „Eksport zakończony”**: wiersze „Klatki obrazu (np. 90 z 90)” i „Czas obrazu / dźwięku”, z ostrzeżeniem ⚠ przy różnicy powyżej 0,15 s.
3. **🔇 Usuń ciszę** (pasek osi czasu i panel klipu dźwięku): klip dzieli się na fragmenty z mową, a przerwy znikają. Nic się nie przesuwa: w miejscu ciszy zostaje luka, obraz i inne klipy stoją na swoich miejscach. Próg ciszy dobiera się automatycznie (tło vs. mowa), a można go zmienić; ustawiane są też minimalna długość przerwy i margines przy mowie. Opcja „Zamknij luki” przysuwa fragmenty jednego klipu do siebie (nie dla dźwięku powiązanego z wideo, który po cięciu zostaje odłączony od warstwy). Cofanie: Ctrl+Z.
4. Tempo (⏩ na pasku osi czasu) działa na zaznaczone wideo i jego dźwięk razem (0,5–2×); przy tempie 1× nic się nie zmienia.

## Zmiany v0.09 (eksport: Baseline, HEVC, szkic, baner nowej wersji)

1. **Kodowanie H.264 Baseline** (bez klatek B): kolejność klatek nie może się już rozjechać, więc błąd „Timestamps must be monotonically increasing” nie ma jak wystąpić. Składanie pliku nadal liczy DTS i PTS niezależnie od kodera (zabezpieczenie na Safari / inne kodery), a dźwięk trafia do bufora i jest składany z gwarancją niemalejących czasów. Przy błędzie komunikat zawiera dane diagnostyczne (kodek, kolejność klatek).
2. **HEVC (iPhone) w szybkim dekodowaniu**: pliki H.265 (`hvc1`/`hev1`, także 10-bit) są dekodowane po kolei przez WebCodecs, jeśli dekoder przeglądarki je obsługuje. Wcześniej szły wolną metodą z przewijaniem (4K HEVC: ok. 1 s na klatkę). Po eksporcie okno pokazuje, które wideo szło szybko, a które wolno, z powodem.
3. **Szkic ok. 30%** w oknie eksportu: 540×960, 15 kl./s, 2 Mb/s, ok. 3× szybciej niż pełna wersja przy tym samym materiale i bez zmiany czasu i dźwięku. Plik tylko się pobiera i nie trafia do Publikacji. Dodatkowo „Średnia” (720×1280).
4. **Baner „nowa wersja”**: aplikacja co 5 minut i po powrocie do karty czyta `version.json`; jeśli na serwerze jest nowsza wersja, pokazuje zielony pasek „Odśwież teraz” (projekt zapisuje się sam). Wersja jest też w komunikatach błędów.

## Zmiany v0.08 (eksport MP4: błąd DTS i szybkość)

1. **Naprawa błędu „Timestamps must be monotonically increasing (DTS went from … to …)”**: sprzętowy koder H.264 zwraca klatki B w kolejności dekodowania. Eksport buforuje je, wylicza opóźnienie i zapisuje osobno DTS (rosnący) i PTS (przesunięcie kompozycji), a dźwięk dostaje tyle samo ciszy na starcie (synchronizacja A/V bez zmian). Test syntetyczny z przestawionymi klatkami: plik poprawny (DTS ściśle rosnące, PTS unikalne, ffmpeg dekoduje bez błędów).
2. **Szybkie dekodowanie wideo** (`src/fastvid.js`): zamiast przewijania każdego `<video>` do każdej klatki (dekodowanie od klatki kluczowej, ~15 s na 6 s materiału z dwiema warstwami) eksport dekoduje pliki MP4/MOV po kolei przez WebCodecs, z obsługą klatek B, listy edycji i obrotu iPhone'a. Każda warstwa przechodzi na przewijanie osobno, gdy kodek lub plik jest nieobsługiwany. Wynik: ok. 3× szybciej (5 s zamiast 16 s w teście), obraz zgodny z metodą starą (różnica ≈ szum kodera). Okno eksportu ma przełącznik „Szybkie dekodowanie” (wyłączenie = stara metoda).
3. **Rozdzielczość**: domyślnie 1080×1920 (standard Instagram); opcja „720×1280 (szybka próba)” skraca eksport ok. 2×. Podczas eksportu podgląd nie renderuje się przy każdym `seeked`.
4. **💾 Zapisz projekt** na pasku osi czasu: pobiera ZIP z konfiguracją i zasobami (to samo co „Eksport projektu” w menu ⋯; wczytanie: „Import projektu”). Postęp eksportu pokazuje klatki/s, a czas w minutach przy dłuższych operacjach.

## Zmiany v0.07 (kadr głowy i widoczny suwak tempa)

1. **Suwak tempa na pasku osi czasu** („⏩ Tempo” obok „Wyrównaj poziomy”): zawsze w widoku, aktywny po zaznaczeniu wideo, gadającej głowy albo ich dźwięku. Wcześniej leżał na dole długich paneli i na laptopie (1366×768) wypadał poza ekran. W panelu po prawej sekcja „Tempo i dźwięk” jest teraz pierwsza.
2. **Oddalanie kadru głowy**: suwak „Kadr” 0,35–3× (wcześniej tylko 1–3×), przyciski „⤢ Cały obraz” (całe wideo w kształcie), 0,75×, 1×, 1,5×. Puste miejsca w kole wypełnia rozmyty, przyciemniony obraz z tego samego wideo (podgląd = eksport, bez `ctx.filter`). Domyślny schemat „Koło u dołu” startuje z 0,8× (twarz plus otoczenie). Tło z rozmytego obrazu dotyczy ścieżki Głowa.
3. Pływający panel nad podglądem: kolejność Kształt, Rozmiar, Kadr, Miękkie krawędzie, Przejście, potem Ścieżka i Schemat miejsca (krótszy, mniej przewijania).

## Zmiany v0.06 (dźwięk i tempo)

1. **Dodawanie muzyki i efektów**: przy każdej ścieżce na osi czasu jest przycisk ＋, puste paski mają podpowiedź, a **dwuklik** w pusty pasek dodaje klip w tym miejscu (dźwięk: okno wyboru źródła, reszta: menu). W lewym panelu są osobne przyciski „🎙 Głos", „🎵 Muzyka", „🔔 Efekt". Muzyka może pochodzić z Audio Studio, biblioteki, Drive, linku lub pliku.
2. **🔊 Wyrównaj poziomy** (pasek nad osią): mierzy głośność (LUFS) użytej części każdego klipu i ustawia wzmocnienie: głos −18 LUFS (każdy klip jednakowo, także dźwięk z wideo), muzyka 11 LU pod głosem (17 LU bez ducking), efekty 6 LU pod głosem. Eksport i tak normalizuje całość do celu z ustawień rolki.
3. **Tempo wideo i mowy**: suwak 0,5–2× (+ szybkie 0,8 / 1 / 1,15 / 1,25 / 1,5 / 2×) na pasku osi czasu i w panelu po prawej. Klip skraca się lub wydłuża, żeby pokazać ten sam fragment pliku; dźwięk jest rozciągany algorytmem WSOLA bez zmiany wysokości głosu (nieniszcząco, w miksie podglądu i eksportu). Wcześniej zmiana prędkości wyciszała dźwięk.

## Zmiany v0.05 (wideo)

1. **Kolejność warstw wg ścieżki**: Tło < animowane tło < wideo w tle < Wideo < Głowa < obrazy / teksty / grafiki. Nowa gadająca głowa zawsze ląduje nad zwykłym wideo (wcześniej trafiała pod pełnoekranowe wideo i klik zaznaczał wideo). Starsze rolki naprawiają się przy otwarciu.
2. **Przeciąganie klipu między ścieżkami** (Wideo ⇄ Tło ⇄ Głowa; obraz ⇄ grafika; dźwięk głos / muzyka / efekty). Ścieżka docelowa podświetla się na zielono, niedozwolona na czerwono. To samo: przełącznik „Ścieżka” w panelu wideo. Wideo na ścieżce Tło nie reaguje na klik w podglądzie (zaznaczasz je na osi czasu).
3. **Transport nad osią czasu**: ⏮ ▶ Odtwarzaj, ⏸ Pauza, ⏹ Stop, czas, pętla. **Spacja** = odtwarzaj / pauza wszędzie poza polami tekstowymi i liczbowymi (także po kliknięciu w podgląd, suwak, pole wyboru, przycisk).
4. **Rozróżnienie warstw**: osobna ścieżka „Głowa” (różowa), tło w paski, ikony ścieżek, opisowe nazwy efektów (np. „Tło: płynący gradient”) i panel „Warstwy” w lewej kolumnie.
5. **Schemat miejsca gadającej głowy**: „📌 Zapamiętaj to miejsce” zapisuje miejsce, kształt, rozmiar, ramkę, poświatę i przejścia; domyślny schemat stosuje się do każdej nowej głowy. Okno „Schematy…”: zastosuj, ustaw domyślny, usuń. Zapis w przeglądarce (wspólny dla wszystkich projektów).
6. **Przycinanie i cięcie wideo**: lewa krawędź nie cofa się przed początek pliku, prawa nie wychodzi poza długość pliku; druga połowa po cięciu i duplikat dostają własny obraz i powiązany dźwięk; duplikat leży tuż nad oryginałem.

## Co działa naprawdę (przetestowane w Chrome)

1. Wszystkie zakładki bez błędów w konsoli, autozapis, historia, eksport i import projektu (ZIP z zasobami).
2. Eksport MP4 1080×1920 30 fps (ffprobe: h264 + audio), miks rolki dokładnie na celu LUFS.
3. Obróbka głosu, raport jakości, nagrywanie z mikrofonu, pakiet do wgrania (wideo, opisy per sieć, metadane, CZYTAJ.txt), plik kalendarza ICS.

## Wymaga konfiguracji (sekrety Workera lub kont)

1. `ANTHROPIC_API_KEY`: lepsze teksty i analiza obrazów (bez niego działa Llama).
2. Automatyczna publikacja (Metricool, Meta Graph API, YouTube Data API, TikTok Content Posting API) oraz R2 na publiczne adresy plików: **jeszcze nie podłączone**, w v0.01 publikacja = walidacja + pakiet + otwarcie stron wgrywania. Nic nie jest wysyłane bez Twojego zatwierdzenia w serwisie.

## Ograniczenia v0.02 (uczciwie)

1. Rolki tylko 9:16. Wideo HEVC/H.265 (domyślny format iPhone'a) Chrome zwykle nie odczyta (widać wtedy tylko ramkę, a dźwięk gra): aplikacja pokazuje komunikat; nagrywaj w trybie „Najbardziej zgodny” (H.264).
2. Obrazy AI: FLUX generuje 1024×1024, aplikacja kadruje do formatu; brak zachowania tożsamości osoby.
3. AAC: Chrome na Windows i macOS oraz Safari 26+ mają własny; w pozostałych (Firefox, Linux) działa wbudowany koder WASM (v0.12). Opus w MP4 zostaje tylko tam, gdzie nie ma WebAssembly.
4. Zmiana tempa/tonu bez Rubber Band (licencja GPL); własny WSOLA, jakość dobra dla mowy, słabsza dla muzyki przy skrajnych wartościach.
5. Brak analizy PDF, brak synchronizacji projektów między urządzeniami.
6. Szkło (rozmycie) używa `ctx.filter`: w Safari zastępuje je półprzezroczysta warstwa; w eksporcie MP4 rozmycie spowalnia kodowanie.
7. Rozpoznawanie rodzajów slajdów w wgranym materiale jest heurystyczne; automat zadziałał na jednej karuzeli wzorcowej, różnicowanie pomysłów zależy od danych w `ideas.json`.
8. Test produkcyjny przeglądarką Chrome na prawdziwym koncie niewykonany (sprawdzono lokalnie z atrapą Workera i przez pobranie wdrożonego pliku).
9. Lista folderu Drive czyta publiczny widok `embeddedfolderview` (HTML): jeśli Google zmieni układ strony, lista może przestać działać; wtedy zostaje import z linku do pojedynczego pliku. Nie sprawdzono na żywym Drive.

## Plan

1. v0.13: adapter Metricool (planowanie wpisów na Instagramie z pliku z Drive) + R2 (chmura projektów, publiczne adresy mediów); nagrywanie gadającej głowy kamerą w aplikacji.
2. v0.14: bezpośrednie API (YouTube, Meta, TikTok), format 4:5 w wideo.
3. v1.0 po zatwierdzeniu; od tej wersji kopie w `backup/`.
