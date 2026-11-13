# 02_Menedzer_dnia_Nawyk — „Nawyk — menedżer dnia" (v0.02)
Codzienne nawyki: głos (YouTube + rozgrzewka + niski głos), charyzma (42 ćwiczenia), ruch, dziennik 3 zdań, lista na dziś.
Autor: Michał Rzekiecki · michus@gmail.com

- `src/` — źródła (app.src.html + figs.js z rysunkami), `python build.py` → `index.html` + `worker.js`
- Hosting: Cloudflare Worker `nawyk` (workflow `.github/workflows/nawyk-deploy.yml`, sekrety CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- `backup/` — kopie wersji finalnych (od v1.0)
