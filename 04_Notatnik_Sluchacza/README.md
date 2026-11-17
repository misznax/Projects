# 04_Notatnik_Sluchacza (v0.12)
Autor: Michał Rzekiecki, michus@gmail.com · adres: `projects.smialo.org/04/` (po dodaniu DNS/trasy także `notatnik.smialo.org`)

Aplikacja WWW (jeden `index.html`, mobilna) do nagrywania wykładów:
- nagrywanie ciągłe, plik audio (Opus 64 kb/s) co 30 s, zapis lokalny (IndexedDB), ekran sam się zaciemnia po 20 s (Wake Lock + czerń);
- transkrypcja w chmurze (OpenAI `gpt-4o-transcribe-diarize`) z rozpoznaniem mówców: Wykładowca / Pytanie / Odpowiedź; bez internetu audio czeka w kolejce + podgląd na żywo (Web Speech), po powrocie sieci kolejka dogania sama;
- notatki tematyczne co ~5 min (Claude), przyciski „Autorzy" i „Zweryfikuj" (Claude + web search);
- eksport Markdown; menu: Ustawienia, Sugestie, O autorze.

## Klucze (sekrety Workera `projects`, nic w kodzie)
`OPENAI_API_KEY` (opcjonalnie: rozpoznawanie mówców; bez niego transkrypcja przez Workers AI Whisper, bez podziału na mówców) i `ANTHROPIC_API_KEY` (już używany przez /api/ask). Endpointy: `/api/n/status`, `/api/n/stt`, `/api/n/claude`. Bez sekretów aplikacja prosi o klucze w Ustawieniach (zapis w telefonie).

## Ograniczenia
iOS Safari ubija mikrofon przy blokadzie ekranu → nagrywać z włączonym ekranem (zaciemnienie je zastępuje). Rozpoznanie wykładowcy: najdłużej mówiący w 30 s fragmencie.
Wersja natywna iOS (SwiftUI, nagrywanie przy zablokowanym ekranie, rozpoznawanie głosu offline): źródła w dokumentach projektu „App Startup" (`claude/04_Notatnik_Sluchacza/Sources`).

## v0.05
Godzina zegarowa w transkrypcji (Ustawienia: godzina / czas nagrania / oba), przycisk ⛁ Kopia (JSON, ZIP z audio, Google Drive), „Sporządź notatki”, prośba o trwały zapis danych (storage.persist). Baza IndexedDB `ns` bez zmian — aktualizacje nie kasują wykładów.
Google Drive: Cloud Console → Credentials → OAuth client ID (Web), origin `https://projects.smialo.org`, włączone Drive API; ID wpisać w Ustawieniach. Zakres `drive.file` (aplikacja widzi tylko własne pliki).
