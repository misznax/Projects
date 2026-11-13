# 00_Worker — jeden Worker `projects` dla wszystkich aplikacji

Nowa aplikacja = nowy folder `NN_Nazwa` z `index.html` (albo `build.py`, który go tworzy). Żadnego nowego Workera.

- Build: `python3 00_Worker/build.py` → `dist/NN/index.html` (+ lista na stronie głównej)
- Adres: `projects.smialo.org/NN/` albo subdomena z `apps.json` (np. `esencja.smialo.org` → 03)
- Deploy: `.github/workflows/deploy.yml` (push do `main`), sekrety GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- API wspólne: `/api/transcript?id=` (napisy YouTube), `/api/ask` (streszczanie)
- Streszczanie: z sekretem Workera `ANTHROPIC_API_KEY` = Claude (zalecane); bez niego = Workers AI (darmowe, słabszy polski, krótszy kontekst)
- Dostęp: Cloudflare Access przed Workerem; `/api/*` odrzuca zapytania bez tokena Access. Opcjonalnie zmienna `ACCESS_TEAM` (`twoj-zespol.cloudflareaccess.com`) włącza pełną weryfikację podpisu.
