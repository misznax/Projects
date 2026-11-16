# 00_Worker — jeden Worker `projects` dla wszystkich aplikacji

Nowa aplikacja = nowy folder `NN_Nazwa` z `index.html` (albo `build.py`, który go tworzy) **+ wpis w `catalog.json` i `apps.json`** (+ ikona `portal/icons/<id>.svg`). Żadnego nowego Workera.

## Jak to działa

- Build: `python3 00_Worker/build.py` → `dist/NN/index.html` + `dist/_p/` (czcionki i ikony portalu). Strony portalu (logowanie, panel, administracja) renderuje sam Worker.
- Adres aplikacji: `projects.smialo.org/NN/` (portal linkuje tylko ścieżki). Podadresy z `apps.json` działają jako zgodność wsteczna i można je odpiąć.
- Deploy: `.github/workflows/deploy.yml` (push do `main`): testy → build → `wrangler deploy`. Sekrety GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- **Konto = adres e-mail.** Logowanie linkiem z poczty (bez hasła), ciasteczko `ps` tylko dla `projects.smialo.org` (jedno logowanie do wszystkich aplikacji).
- **Próba i abonament na każdą aplikację osobno.** Pierwsze wejście = „Zacznij próbę” (`TRIAL_DAYS`, domyślnie 3 dni, raz na aplikację i konto). Abonament 1/6/12 miesięcy albo „wszystkie aplikacje” nadaje właściciel w `/admin`.
- Aliasy adresu (`jan.k+x@gmail.com`, `googlemail.com`) to to samo konto, więc próby nie da się namnażać.
- Limity dzienne kosztownych wywołań na konto (`access.js` → `QUOTA`, nadpisywalne zmienną `QUOTAS` jako JSON): streszczenia, napisy YouTube, mowa na tekst, Claude w Notatniku, zapisy stanu. Wartości: `[próba, abonament]`.
- Plakietka „Próba: zostało …” wstrzykiwana do stron aplikacji (HTMLRewriter); właściciel jej nie widzi.

## Pliki

| plik | rola |
|---|---|
| `worker.js` | routing: `/auth/*`, `/api/*`, `/admin`, `/trial`, bramka aplikacji, panel |
| `access.js` | model dostępu: D1, próba/abonament/blokada, limity, audyt |
| `auth.js` | tożsamość: Cloudflare Access (JWT) lub sesja z logowania mailem; wysyłka linku |
| `pages.js` | strony HTML (bez JS po stronie klienta, CSP `default-src 'self'`) |
| `catalog.json` | aplikacje w portalu: numer, subdomena, nazwa, kolory, `state` (zapis w chmurze) |
| `portal/` | czcionki i ikony → `dist/_p/` |
| `test/` | testy (`node:test`, D1 na `node:sqlite`) |

## Konfiguracja Workera

Sekrety (Settings → Variables and Secrets → **Secret**; przeżywają każdy deploy):

| nazwa | do czego |
|---|---|
| `SESSION_SECRET` | podpis ciasteczka sesji, min. 32 znaki losowe |
| `OWNER_EMAILS` | adresy właściciela, po przecinku; pełny dostęp + `/admin` |
| `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` | opcjonalnie: lepsze streszczenia / mówcy w Notatniku |

Zmienne jawne (w `wrangler.jsonc` → `vars`, `keep_vars: true` zostawia też te dodane w panelu):

| nazwa | domyślnie | do czego |
|---|---|---|
| `MAIL_FROM` | `logowanie@mail.smialo.org` | nadawca linków; domena musi być w Email Service → Email Sending |
| `MAIL_NAME` | `Projects · Web Elegance` | nazwa nadawcy |
| `TRIAL_DAYS` | `3` | długość próby |
| `MAIL_DAILY` | `300` | dzienny sufit wysyłanych linków (ochrona przed nadużyciem) |
| `QUOTAS` | – | JSON z własnymi limitami dziennymi |
| `GATE` | – | `off` = wyłącznik awaryjny: każdy zalogowany ma dostęp |
| `ACCESS_TEAM`, `ACCESS_AUD` | – | plan B: akceptuj tożsamość z Cloudflare Access (podpis JWT weryfikowany kluczami zespołu) |
| `COOKIE_DOMAIN` | brak (ciasteczko tylko dla hosta) | np. `.smialo.org`, gdyby aplikacje wróciły na podadresy |

Poczta: Email Service → Email Sending wymaga planu **Workers Paid** (od 5 USD/mies., 3000 maili miesięcznie w cenie). Domena nadawcy: Compute → Email Service → Email Sending → Onboard Domain (polecany podadres `mail.smialo.org`, nie dotyka poczty na domenie głównej).

## Testy

```
node --import ./00_Worker/test/register.mjs --test "00_Worker/test/*.test.mjs"
```

Podgląd lokalny z przykładowymi danymi: `SEED=ania@example.com DEV_EMAIL=ania@example.com node --import ./00_Worker/test/register.mjs 00_Worker/test/preview.mjs 8796` (po `python3 00_Worker/build.py`).

## Inne API

`/api/transcript?id=` (napisy YouTube, Esencja), `/api/ask` (streszczanie: z `ANTHROPIC_API_KEY` Claude, bez niego Workers AI), `/api/n/*` (Notatnik: mowa na tekst i Claude), `/api/state/<app>` (zapis stanu w D1 na konto), `/api/me` (stan dostępu zalogowanego), `/api/stats` (tylko właściciel). Każde wymaga zalogowania i dostępu do właściwej aplikacji, zapisy wymagają zgodnego nagłówka `Origin`.
