# Creative Studio Social · v0.03

Studio treści na social media w przeglądarce: marka → grafiki (karuzele) → wideo (rolki 9:16) → audio → publikacja na Instagram, YouTube Shorts, TikTok i Facebook Reels.
Autor: Michał Rzekiecki · kontakt: michus@gmail.com · adres: https://projects.michus.workers.dev/06/

## Architektura

1. Jedna samowystarczalna strona `index.html` budowana przez `python3 build.py` z `src/*.js` + `src/app.src.html` + `vendor/mp4-muxer.min.js` (MIT).
2. Wdrożenie: wspólny Worker `projects` (`00_Worker/build.py` kopiuje plik do `dist/06/`), GitHub Actions po pushu na `main`.
3. Dane projektu: IndexedDB w przeglądarce użytkownika (`css-v1`: projekty, zasoby, wersje) + autozapis, migawki, eksport/import ZIP.
4. Jedna warstwa modelu (tekst, obraz, kształt, wideo, efekt, animacje wejścia/wyjścia/pętla, klatki kluczowe) i jedna funkcja `drawScene` dla edycji, podglądu i eksportu.
5. Dźwięk: własny silnik DSP w czystym JS (`src/dsp.js`): WSOLA (tempo), zmiana wysokości tonu, redukcja szumu STFT, usuwanie trzasków, korektor, kompresor, de-esser, usuwanie ciszy, głośność BS.1770 (LUFS), true peak, limiter, ducking, miks. Podgląd rolki gra dokładnie ten sam miks, który trafia do eksportu.
6. Eksport wideo: WebCodecs (H.264 + AAC) + mp4-muxer → MP4. Gdy brak AAC w przeglądarce: Opus w MP4 z ostrzeżeniem; gdy brak WebCodecs: WebM (MediaRecorder).
7. AI przez Worker (klucze tylko jako sekrety): `/api/n/claude` (Claude, a bez klucza Llama), `/api/n/stt` (Whisper), `/api/s/img` (FLUX.1 schnell, Workers AI), `/api/s/status` (uczciwy stan integracji).

## Moduły (zakładki)

| Zakładka | Co robi |
|---|---|
| Marka | karta „Marka z automatu” (kolory, fonty, uchwyt, zasady z repo marki; odśwież / odepnij), ręczna edycja, logo, referencje, 12 szablonów |
| Pomysły | pomysły z Drive + posty z Instagrama → plan rolki lub karuzeli, ostrzeżenia o powtórkach, balans formatów, slot „materiał instruktażowy” (uczenie stylu z karuzeli / rolki) |
| Grafiki | karuzele i posty: slajdy, warstwy, tło, usuwanie tła, obrazy AI, eksport PNG/JPG/ZIP |
| Wideo | oś czasu (9 ścieżek), sceny z szablonów, animacje, klatki kluczowe, napisy z nagrania, miks, eksport MP4 |
| Audio | nagrywanie z teleprompterem (okno rozciągalne i przeciągane, edytowalny tekst, wolne przewijanie w słowach/min, czcionka, szerokość, położenie, lustro, pełny ekran), edycja nieniszcząca (oryginał zostaje), łańcuch obróbki, raport jakości (LUFS, true peak, clipping, DC) |
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

## Co działa naprawdę (przetestowane w Chrome)

1. Wszystkie zakładki bez błędów w konsoli, autozapis, historia, eksport i import projektu (ZIP z zasobami).
2. Eksport MP4 1080×1920 30 fps (ffprobe: h264 + audio), miks rolki dokładnie na celu LUFS.
3. Obróbka głosu, raport jakości, nagrywanie z mikrofonu, pakiet do wgrania (wideo, opisy per sieć, metadane, CZYTAJ.txt), plik kalendarza ICS.

## Wymaga konfiguracji (sekrety Workera lub kont)

1. `ANTHROPIC_API_KEY`: lepsze teksty i analiza obrazów (bez niego działa Llama).
2. Automatyczna publikacja (Metricool, Meta Graph API, YouTube Data API, TikTok Content Posting API) oraz R2 na publiczne adresy plików: **jeszcze nie podłączone**, w v0.01 publikacja = walidacja + pakiet + otwarcie stron wgrywania. Nic nie jest wysyłane bez Twojego zatwierdzenia w serwisie.

## Ograniczenia v0.02 (uczciwie)

1. Rolki tylko 9:16; dźwięk z klipów wideo nie jest miksowany (tylko ścieżki głos/muzyka/efekty).
2. Obrazy AI: FLUX generuje 1024×1024, aplikacja kadruje do formatu; brak zachowania tożsamości osoby.
3. AAC zależy od przeglądarki (Windows i macOS: tak; Linux headless: Opus). Nie sprawdzono jeszcze na prawdziwym Chrome z AAC.
4. Zmiana tempa/tonu bez Rubber Band (licencja GPL); własny WSOLA, jakość dobra dla mowy, słabsza dla muzyki przy skrajnych wartościach.
5. Brak analizy PDF, brak synchronizacji projektów między urządzeniami.
6. Szkło (rozmycie) używa `ctx.filter`: w Safari zastępuje je półprzezroczysta warstwa; w eksporcie MP4 rozmycie spowalnia kodowanie.
7. Rozpoznawanie rodzajów slajdów w wgranym materiale jest heurystyczne; automat zadziałał na jednej karuzeli wzorcowej, różnicowanie pomysłów zależy od danych w `ideas.json`.
8. Test produkcyjny przeglądarką Chrome na prawdziwym koncie niewykonany (sprawdzono lokalnie z atrapą Workera i przez pobranie wdrożonego pliku).

## Plan

1. v0.03: R2 (chmura projektów i publiczne adresy mediów) + adapter Metricool (planowanie wpisów).
2. v0.04: bezpośrednie API (YouTube, Meta, TikTok), dźwięk klipów w miksie, format 4:5 w wideo.
3. v1.0 po zatwierdzeniu; od tej wersji kopie w `backup/`.
