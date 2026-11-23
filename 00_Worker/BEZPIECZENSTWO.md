# Bezpieczeństwo i zgodność (stan na 23.11.2026, strona v0.06)

## Wdrożone (kod)
1. Nagłówki na stronach i plikach: X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy (mikrofon tylko własny, reszta wyłączona), COOP same-origin, X-Frame-Options SAMEORIGIN, HSTS 1 rok.
2. Strona główna: CSP (meta) z hashami skryptów, bez zewnętrznych skryptów, fontów i trackerów (connect/form tylko 'self').
3. Formularz zapisu: zapytania z parametrami (brak SQL injection), pole pułapka na boty, walidacja imienia/e-maila/aplikacji, sprawdzenie Origin, limit rozmiaru 2 KB, limit 10 zapisów/godz./IP, limit 5000 rekordów, UNIQUE(email, app), zgoda wymagana polem wyboru.
4. IP: tylko jako skrót SHA-256 z solą (statystyki i limity), bez zapisu adresu.
5. Limity kosztowych API (/api/ask, /api/n/claude, /api/n/stt, /api/transcript): 120/godz./IP; analiza Anatomii: 15/godz./IP; /api/stats tylko z tokenem Cloudflare Access.
6. Fonty Fraunces hostowane lokalnie w aplikacjach 02 i 03 (koniec przekazywania IP do Google, ryzyko RODO).
7. Zależności: npm audit 05_Anatomia (three, three-mesh-bvh, esbuild) 0 luk; pip-audit 01_StartupBoard (PySide6, pypdfium2) 0 znanych luk; strona główna i aplikacje bez bibliotek z CDN.
8. HTTPS i certyfikat: Cloudflare (automatyczne odnawianie). Sekrety kluczy API tylko w Cloudflare/GitHub secrets, nie w kodzie.

## Otwarte (wymagają decyzji lub panelu)
1. ACCESS_TEAM i STATS_SALT: nie da się ich odczytać narzędziami; bez STATS_SALT skrót IP używa domyślnej soli z repo (słaba pseudonimizacja). Ustawić jako secret.
2. Endpointy API 02-04 są publiczne na tym samym adresie co strona (ochrona = same-origin + limit). Pełna ochrona: Cloudflare Access na ścieżkach /02 /03 /04 lub osobnych hostach.
3. Klucze użytkownika (04 wysyła do api.anthropic.com/api.openai.com z przeglądarki) i Google Drive (04): wymagają osobnego opisu w polityce prywatności.
4. Polityka prywatności i regulamin są na twojastrona.smialo.org: sprawdzić, czy opisują listę zapisów (imię, e-mail, zgoda, okres przechowywania), statystyki (skrót IP, kraj), Cloudflare jako procesora i transfer poza EOG (art. 13 RODO).
5. Dyrektywa 2019/770 (treści cyfrowe) i ustawa o prawach konsumenta dla konsumentów: aktualizacje (w tym bezpieczeństwa) przez okres umowy, zgodność z opisem, prawo odstąpienia/zgoda na natychmiastowe dostarczenie, reklamacje. Dotyczy sprzedaży konsumentom; przy B2B stosuje się umowę i KC. Wymaga przeglądu regulaminu przez prawnika.
6. Kompatybilność przeglądarek: nie testowane w Safari i Firefox (tylko Chromium).
7. EAA (dostępność): mikroprzedsiębiorca jest zwolniony z obowiązku dla usług, ale dobre praktyki (kontrast, klawiatura, aria) warto zachować.
8. Okresowe: npm audit/pip-audit co miesiąc, przegląd po zmianach przeglądarek.
