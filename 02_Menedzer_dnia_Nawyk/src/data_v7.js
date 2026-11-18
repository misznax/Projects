/* ───────── v0.07: podzielność uwagi, oddech 9D, brief, cytaty, ilustracje ───────── */

/* PODZIELNOŚĆ UWAGI — 31 ćwiczeń, 3 poziomy (lv 1 → 3, wyższy poziom zawiera też łatwiejsze).
   Zasada: dwa zadania naraz, z których jedno jest automatyczne (pisanie, chodzenie, rytm), a drugie wymaga uwagi (mowa, liczenie, słuch).
   Wzorce: trening „dual-task” (chodzenie + mówienie), zadanie Stroopa, tłumaczenie symultaniczne (shadowing), proste zadania wielozadaniowe (pisanie + mówienie). */
const UW=[
// ── poziom 1: jedno zadanie prawie automatyczne + jedno proste
{c:'Pisanie + głos',lv:1,t:'Imię i równe „mmm”',m:2,sec:90,when:'Dziś, 1,5 minuty. Potrzebujesz kartki i długopisu.',steps:['Weź wdech i zacznij równe „mmm” na jednej, wygodnej wysokości (jak mruczenie).','Nie przerywając dźwięku, pisz swoje imię i nazwisko raz pod drugim.','Dźwięk ma się nie zmieniać, a pismo ma być czytelne. Oddech łap bez paniki i wracaj do „mmm”.'],ok:'dźwięk jest równy, a pismo czytelne przez całe 90 sekund.'},
{c:'Pisanie + głos',lv:1,t:'Litery na głos, imię na kartce',m:2,sec:120,when:'Dziś, 2 minuty.',steps:['Wybierz słowo, np. „koncentracja”.','Mów na głos jego litery po kolei (k-o-n-c-e-n-t-r-a-c-j-a), a jednocześnie pisz na kartce swoje imię.','Zmierz, ile to trwa. Powtórz 3 razy i spróbuj być szybszy bez błędów.'],ok:'zrobisz 3 podejścia bez pomyłek w literach i w piśmie.'},
{c:'Liczenie + ruch',lv:1,t:'Marsz i liczenie parzystych',m:2,sec:90,when:'Dziś, 1,5 minuty, w pokoju lub na spacerze.',steps:['Maszeruj równo w miejscu albo po pokoju.','Na każdy krok licz na głos co drugą liczbę: 2, 4, 6, 8… do 60.','Zgubisz się? Zacznij od dwóch. Tempo kroków się nie zmienia.'],ok:'dojdziesz do 60 bez zatrzymania marszu.'},
{c:'Liczenie + ruch',lv:1,t:'Przekładanie i odliczanie wstecz',m:2,sec:90,when:'Dziś, 1,5 minuty. Potrzebujesz 30 drobnych rzeczy (spinacze, monety) i dwóch pudełek.',steps:['Postaw dwa pudełka obok siebie.','Przekładaj jedną ręką po jednym przedmiocie z pudełka do pudełka.','Jednocześnie odliczaj głośno wstecz od 30 do 0.','Pomyliłeś się? Odłóż i zacznij liczyć od liczby, na której jesteś.'],ok:'przełożysz wszystkie przedmioty i skończysz na zerze równocześnie.'},
{c:'Rytm i ręce',lv:1,t:'Brzuch i głowa',m:1,sec:60,when:'Dziś, 1 minuta. Klasyk na rozgrzewkę mózgu.',steps:['Jedną ręką głaszcz się kółkami po brzuchu.','Drugą ręką jednocześnie klep się lekko po głowie, w równym rytmie.','Po 30 sekundach zamień ręce.'],ok:'oba ruchy idą równo przez 30 sekund na każdą stronę.'},
{c:'Rytm i ręce',lv:1,t:'Klaskanie i dni tygodnia',m:1,sec:60,when:'Dziś, 1 minuta.',steps:['Klaszcz równo, raz na sekundę (jak metronom).','Na każde klaśnięcie wymawiaj jeden dzień tygodnia po kolei: poniedziałek, wtorek…','Po tygodniu idź dalej w kółko. Rytm klaskania się nie zmienia.'],ok:'przez minutę nie gubisz rytmu ani kolejności.'},
{c:'Słowa i ruch',lv:1,t:'Spacer i opowieść',m:3,sec:180,when:'Dziś, 3 minuty. Dobre w domu lub na spacerze.',steps:['Chodź po pokoju albo po okolicy.','Opowiadaj na głos, co dziś robiłeś, pełnymi zdaniami, spokojnym tempem.','Nie zatrzymuj się i nie mów „yyy”: gdy brakuje słowa, zrób pauzę i idź dalej.'],ok:'mówisz i idziesz przez 3 minuty bez zatrzymania.'},
{c:'Słowa i ruch',lv:1,t:'Zmywanie z opowieścią',m:5,sec:300,when:'Dziś, przy zwykłej czynności: zmywanie, składanie prania, gotowanie.',steps:['Wybierz czynność, którą robisz bez zastanowienia.','Opowiadaj na głos plan jutrzejszego dnia (sam do siebie lub do kogoś).','Mów wolno, kończąc zdania w dół. Ręce robią swoje.'],ok:'opowiesz plan jutra w pełnych zdaniach i skończysz czynność.'},
{c:'Słuch + mowa',lv:1,t:'Nucenie i przepisywanie',m:2,sec:120,when:'Dziś, 2 minuty. Potrzebujesz kartki i krótkiego tekstu do przepisania.',steps:['Wybierz prostą melodię (np. „Sto lat”).','Nucąc ją równo, przepisuj krótki akapit.','Melodia ma się nie urwać i nie zmieniać tempa.'],ok:'melodia płynie bez przerwy, a tekst jest przepisany bez błędów.'},
{c:'Słuch + mowa',lv:1,t:'Nazywanie przedmiotów w rytmie',m:1,sec:60,when:'Dziś, 1 minuta.',steps:['Stukaj palcem w stół równo, raz na sekundę.','Na każde stuknięcie nazwij jedną rzecz w pokoju, bez powtórek.','Gdy zabraknie przedmiotów, przejdź do kolejnego pomieszczenia (w myślach).'],ok:'nazwiesz 40 rzeczy bez powtórki i bez zgubienia rytmu.'},
// ── poziom 2: dwa zadania wymagające uwagi
{c:'Pisanie + głos',lv:2,t:'Własne zdania i stałe „aaa”',m:3,sec:150,when:'Dziś, 2,5 minuty. Twoje zadanie główne: mówić jednolity dźwięk i pisać.',steps:['Weź wdech i wydaj równe, niskie „aaa” na jednej wysokości.','Jednocześnie pisz własne zdania (np. plan na jutro). Nie przepisuj — wymyślaj na bieżąco.','Gdy musisz złapać powietrze, zrób to szybko i wróć na tę samą wysokość dźwięku.','Po 75 sekundach zamień dźwięk na „ooo” i kontynuuj.'],ok:'dźwięk nie spada i nie skacze, a zdania mają sens.'},
{c:'Pisanie + głos',lv:2,t:'Pisz jedno, mów drugie',m:3,sec:150,when:'Dziś, 2,5 minuty.',steps:['Pisz na kartce plan na jutro.','Jednocześnie opowiadaj na głos przepis na herbatę lub jajecznicę, krok po kroku.','Gdy się pomylisz, nie przerywaj: popraw jedno słowo i jedź dalej.','Po minucie zamień: pisz przepis, mów plan.'],ok:'oba teksty są sensowne, a Ty nie zatrzymałeś żadnego z nich na dłużej niż 3 sekundy.'},
{c:'Liczenie + ruch',lv:2,t:'Co siedem w dół i linia',m:3,sec:150,when:'Dziś, 2,5 minuty. Potrzebujesz prostej linii na podłodze (np. szwu panelu lub taśmy).',steps:['Idź stopa za stopą po linii (pięta dotyka palców).','Jednocześnie odliczaj na głos od 100 co 7: 100, 93, 86, 79…','Przy pomyłce nie zatrzymuj się: popraw liczbę i idź dalej.'],ok:'dojdziesz do liczby poniżej 30 i nie zejdziesz z linii.'},
{c:'Liczenie + ruch',lv:2,t:'Wstecz po trzy i klaskanie',m:2,sec:120,when:'Dziś, 2 minuty.',steps:['Licz na głos od 60 w dół co 3: 60, 57, 54…','Klaszcz na każdą drugą liczbę.','Idź w miejscu w równym tempie.'],ok:'dojdziesz do zera bez pomyłki w rytmie klaskania.'},
{c:'Rytm i ręce',lv:2,t:'Koło i kwadrat naraz',m:2,sec:90,when:'Dziś, 1,5 minuty.',steps:['Jedną ręką rysuj w powietrzu koło, drugą jednocześnie kwadrat.','Zacznij bardzo wolno. Ruchy mają być płynne, nie szarpane.','Po 40 sekundach zamień ręce.'],ok:'oba kształty są rozpoznawalne i rysujesz je równocześnie.'},
{c:'Rytm i ręce',lv:2,t:'Rytm 2 na 3',m:2,sec:90,when:'Dziś, 1,5 minuty. Odgłosy stukania o stół.',steps:['Licz w głowie do sześciu: 1-2-3-4-5-6 i zaczynaj od nowa.','Prawa ręka stuka na 1 i 4 (dwa uderzenia).','Lewa ręka stuka na 1, 3 i 5 (trzy uderzenia).','Zacznij bardzo wolno. Gdy zadziała, przyspiesz o odrobinę.'],ok:'utrzymasz oba rytmy przez 30 sekund bez rozsypania się.'},
{c:'Słowa i ruch',lv:2,t:'Stroop na głos',m:3,sec:120,when:'Dziś, 2 minuty. Potrzebujesz kartki i 4 flamastrów w różnych kolorach.',steps:['Napisz na kartce 12 słów: nazwy kolorów (czerwony, zielony, niebieski, żółty), każde napisane flamastrem innego koloru niż jego znaczenie (słowo „zielony” czerwonym).','Czytaj na głos kolor, jakim słowo jest napisane, a NIE samo słowo.','Idź po liście w równym tempie. Zrób dwie rundy.'],ok:'druga runda idzie szybciej i z mniejszą liczbą pomyłek niż pierwsza.'},
{c:'Słowa i ruch',lv:2,t:'Litery i cyfry na przemian',m:2,sec:90,when:'Dziś, 1,5 minuty.',steps:['Maszeruj w miejscu równym krokiem.','Mów na przemian literę i cyfrę: A-1, B-2, C-3, D-4…','Jeśli dojdziesz do końca alfabetu, zacznij od nowa albo od drugiej strony.'],ok:'dojdziesz do końca alfabetu bez zatrzymania marszu.'},
{c:'Słuch + mowa',lv:2,t:'Radio i trzy słowa kluczowe',m:3,sec:150,when:'Dziś, 2,5 minuty. Potrzebujesz wiadomości lub podcastu i kartki.',steps:['Włącz nagranie (wiadomości lub podcast po polsku).','Słuchając, zapisuj trzy słowa kluczowe co 30 sekund.','Nie pauzuj nagrania. Na końcu powiedz na głos jedno zdanie, o czym było.'],ok:'masz 15 słów kluczowych i potrafisz powiedzieć, o czym było nagranie.'},
{c:'Słuch + mowa',lv:2,t:'Echo z opóźnieniem (shadowing)',m:3,sec:120,when:'Dziś, 2 minuty. Potrzebujesz nagrania z mową (podcast, wiadomości).',steps:['Włącz nagranie z wyraźną mową.','Powtarzaj półgłosem to, co słyszysz, z opóźnieniem ok. 2 sekund (jak tłumacz symultaniczny).','Nie próbuj wszystkiego — łap całe frazy. Mów spokojnie, nie przyspieszaj.'],ok:'powtarzasz fragmenty bez zgubienia rytmu przez co najmniej 60 sekund.'},
// ── poziom 3: zadanie kontrolowane + wymagające + zmiana sytuacji
{c:'Pisanie + głos',lv:3,t:'Dwa teksty naraz',m:3,sec:150,when:'Dziś, 2,5 minuty. Potrzebujesz kartki i czytanego tekstu (artykuł, książka).',steps:['Czytaj na głos akapit z książki lub artykułu.','Jednocześnie pisz z pamięci przepis na swoją ulubioną potrawę.','Nie wolno zatrzymać czytania. Jeśli zgubisz miejsce w tekście, odszukaj je i jedź dalej.'],ok:'przez 2,5 minuty robisz obie rzeczy i potrafisz opowiedzieć, co przeczytałeś.'},
{c:'Pisanie + głos',lv:3,t:'Niski, wolny głos i notatki',m:3,sec:150,when:'Dziś, 2,5 minuty. Połączenie z charyzmą: głos pod kontrolą mimo rozproszenia.',steps:['Opowiadaj głośno plan tygodnia niskim, wolnym głosem, kończąc zdania w dół.','Równocześnie zapisuj trzy słowa kluczowe z tego, co mówisz.','Pilnuj tempa: jeśli zaczynasz mówić szybciej, zwolnij o 20% i zrób pauzę po zdaniu.'],ok:'tempo i wysokość głosu zostają stałe, mimo że piszesz.'},
{c:'Liczenie + ruch',lv:3,t:'Opowieść i „co siedem” w głowie',m:3,sec:180,when:'Dziś, 3 minuty.',steps:['Opowiadaj na głos dowolną historię (np. wakacje).','W myślach odejmuj 7 od 100: 93, 86, 79…','Co 20 sekund przerwij opowieść, powiedz aktualną liczbę i wróć do historii.'],ok:'historia jest spójna, a liczby są poprawne.'},
{c:'Liczenie + ruch',lv:3,t:'Linia, kubek i liczenie',m:3,sec:150,when:'Dziś, 2,5 minuty. Potrzebujesz kubka z wodą i linii na podłodze. Idź ostrożnie.',steps:['Weź kubek wypełniony do połowy wodą.','Idź stopa za stopą po linii, kubek trzymaj w ręce.','Jednocześnie licz wstecz od 90 co 3.','Zmień rękę z kubkiem po 75 sekundach.'],ok:'nie rozlałeś wody i nie zszedłeś z linii.'},
{c:'Rytm i ręce',lv:3,t:'Ósemka, kółko i alfabet',m:3,sec:120,when:'Dziś, 2 minuty.',steps:['Jedną ręką rysuj w powietrzu ósemkę (leżącą), drugą kółko.','Równocześnie mów na głos alfabet.','Zacznij wolno. Po 60 sekundach zamień ręce.'],ok:'oba ruchy są płynne, a alfabet nie ma przerw.'},
{c:'Rytm i ręce',lv:3,t:'Krok, klaśnięcie i miesiące',m:3,sec:120,when:'Dziś, 2 minuty.',steps:['Maszeruj równym krokiem w miejscu.','Klaszcz na co trzeci krok.','Wymieniaj miesiące od stycznia do grudnia, jeden na każdy krok.','Gdy skończysz rok, idź od grudnia wstecz.'],ok:'rytm klaskania i kroków jest stały, a miesiące bez pomyłek.'},
{c:'Słowa i ruch',lv:3,t:'Kategorie na kolejne litery',m:3,sec:150,when:'Dziś, 2,5 minuty.',steps:['Idź po pokoju równym krokiem.','Na każdą kolejną literę alfabetu nazywaj na przemian: zwierzę, miasto, imię (A: Antylopa, Amsterdam, Anna; B: Bocian…).','Bez powtórzeń. Nie wiesz? Pomiń i idź dalej, nie stój.'],ok:'dojdziesz co najmniej do litery M bez zatrzymywania marszu.'},
{c:'Słowa i ruch',lv:3,t:'Miesiące wspak z krokiem',m:2,sec:90,when:'Dziś, 1,5 minuty. Potrzebujesz linii na podłodze.',steps:['Idź po linii stopa za stopą.','Wymawiaj miesiące od grudnia do stycznia, jedna sylaba na krok.','Gdy skończysz, zacznij od nowa, ale tym razem co drugi miesiąc.'],ok:'dwie rundy bez zejścia z linii i bez pomyłki w miesiącach.'},
{c:'Słuch + mowa',lv:3,t:'Streszczenie na żywo',m:4,sec:180,when:'Dziś, 3 minuty. Potrzebujesz podcastu lub wystąpienia (np. TED po polsku).',steps:['Włącz nagranie z przemową.','Co 20 sekund powiedz półgłosem jedno zdanie streszczenia tego, co właśnie usłyszałeś — nie pauzuj nagrania.','Mów spokojnie, niskim głosem, bez „yyy”.'],ok:'po 3 minutach masz 8–9 zdań streszczenia, które mają sens.'},
{c:'Słuch + mowa',lv:3,t:'Rozmowa i notatka',m:5,when:'Dziś, w prawdziwej rozmowie (telefon, spotkanie, w domu), min. 5 minut.',steps:['Podczas rozmowy zapisuj trzy słowa kluczowe z tego, co mówi rozmówca.','Pilnuj swojego tempa: nie przyspieszaj, kończ zdania w dół.','Po rozmowie sprawdź notatkę: czy oddaje sedno?'],ok:'zrobiłeś notatkę i nie przyspieszyłeś mówienia mimo pisania.'},
{c:'Przełączanie',lv:3,t:'Zmiana zadań co 20 sekund',m:3,tm:[['Pisz + równe „mmm”',20],['Licz co 3 + klaszcz',20],['Mów alfabet + stukaj rytm',20],['Pisz + licz wstecz',20],['Opowiadaj + marsz',20],['Cisza: rozluźnij się',20]],when:'Dziś, 2 minuty. Przygotuj kartkę i długopis.',steps:['Timer podaje zadanie na 20 sekund: wykonuj je od razu po zmianie.','Zadania: pisanie + dźwięk „mmm”, liczenie co 3 + klaskanie, alfabet + stukanie, pisanie + liczenie wstecz, opowieść + marsz.','Zmiana jest szybka i nieuprzedzona. To trenuje przełączanie, a nie perfekcję.'],ok:'przejdziesz wszystkie sześć zmian bez zatrzymania.'},
];

/* TEKSTY pomocnicze (blok „text”) */
const TEXTS={
  nine:'<p><b>Co to jest:</b> 9D to format oddechu z immersyjnym dźwiękiem (słuchawki: dźwięk „krąży” wokół głowy) i prowadzeniem głosem. To komercyjna nazwa, a dane naukowe o niej są ograniczone — oddech sam w sobie działa wyciszająco.</p><p><b>Ta wersja jest łagodna:</b> wolny, połączony oddech bez hiperwentylacji i bez wstrzymań ponad kilka sekund. Własny dźwięk 9D włącz osobno (linki poniżej), a timer poniżej poprowadzi rytm.</p><p class="warnp">⚠️ Nie rób w trakcie prowadzenia auta, kąpieli ani na stojąco. Przy ciąży, padaczce, chorobach serca lub płuc, zaburzeniach lękowych i napadach paniki skonsultuj się z lekarzem. Zawroty głowy, mrowienie, lęk lub szum w uszach: przerwij, oddychaj normalnie i usiądź.</p>',
};

/* ŁAGODNA SESJA 9D (dodawana do GS; 5 minut, ×2 przy 10 min) */
const NINE_STEPS=[
  {t:'Ułóż się',sec:20,sub:'Połóż się lub usiądź wygodnie, słuchawki na uszach, dłoń na brzuchu. Włącz własny dźwięk 9D (linki poniżej) na niskiej głośności. Zamknij oczy.'},
  {t:'Spokojny oddech 4–6',sec:60,pace:BREATH,sub:'Wdech nosem 4 s, wydech ustami 6 s. Tylko tyle — bez pogłębiania na siłę.'},
  {t:'Połączony oddech 5–5',sec:90,pace:[['WDECH',5,1],['WYDECH',5,0]],sub:'Wdech i wydech bez przerwy, jak fala. Oddech jest cichy i łatwy. Zawroty głowy lub mrowienie: wróć do zwykłego oddechu.'},
  {t:'Fala z pauzą',sec:60,pace:[['WDECH',4,1],['ZATRZYMAJ',2,2],['WYDECH',6,0]],sub:'Wdech 4 s, krótka pauza 2 s, wydech 6 s. Poczuj, jak oddech uspokaja ciało.'},
  {t:'Cisza i skan ciała',sec:50,sub:'Oddychaj samoistnie, bez liczenia. Przejdź uwagą od stóp po głowę i zauważ, gdzie ciało jest cięższe i spokojniejsze.'},
  {t:'Powrót',sec:20,sub:'Poruszaj palcami rąk i stóp, weź trzy głębsze oddechy, otwórz oczy. Usiądź powoli, zanim wstaniesz.'},
];

/* BRIEF: krótkie przypomnienie na dole strony (po jednej linijce na punkt) */
const BRIEF={
  charyzma:{n:'Pamiętaj w rozmowie',items:[
    ['🐢','Mów o 20% wolniej, pauza po zdaniu'],
    ['⬇️','Kończ zdania w dół (kropka, nie pytajnik)'],
    ['⏸️','Cisza zamiast „yyy”'],
    ['👁️','Kontakt wzrokowy: 3 sekundy na start'],
    ['🙌','Dłonie widoczne, gesty wolne'],
    ['🫁','Trzy oddechy przed wejściem'],
    ['👂','Nie przerywaj: po cudzym zdaniu „raz”'],
    ['🎯','Sedno na początek, potem powód'],
    ['🙂','Imię rozmówcy i uśmiech oczami'],
  ]},
  roz:{n:'Pamiętaj w ruchu',items:[
    ['🫁','Oddychaj spokojnie, nie wstrzymuj powietrza'],
    ['🐢','Wolno i płynnie, bez szarpania'],
    ['🚫','Ból to stop; lekkie ciągnięcie jest w porządku'],
    ['🔥','Najpierw rozruch, potem rozciąganie'],
    ['🦶','Stopy stabilnie, kolana miękkie'],
    ['💧','Woda po ćwiczeniu'],
  ]},
  skup:{n:'Pamiętaj w pracy',items:[
    ['🎯','Jedno zadanie naraz'],
    ['📵','Telefon poza zasięgiem na blok pracy'],
    ['⏱️','25 minut skupienia, 5 minut przerwy'],
    ['✍️','Rozproszyła Cię myśl? Zapisz i wróć'],
    ['🧹','Na biurku tylko to, co potrzebne'],
    ['🌙','Wieczorem: pierwszy krok na jutro'],
  ]},
};

/* CYTATY po ukończeniu dnia: osoby, które coś osiągnęły (tłumaczenia własne; krótkie) */
const WIN=[
{a:'Thomas Edison',w:'wynalazca',x:'Geniusz to jeden procent natchnienia i dziewięćdziesiąt dziewięć procent potu.'},
{a:'Maria Skłodowska-Curie',w:'dwukrotna laureatka Nobla',x:'Musimy wierzyć, że jesteśmy do czegoś zdolni, i że to coś musimy osiągnąć.'},
{a:'Michael Jordan',w:'koszykarz',x:'Przegrywałem w życiu raz za razem. I właśnie dlatego odnoszę sukcesy.'},
{a:'Nelson Mandela',w:'prezydent RPA, laureat Nobla',x:'Nauczyłem się, że odwaga to nie brak strachu, ale zwycięstwo nad nim.'},
{a:'Muhammad Ali',w:'mistrz świata w boksie',x:'Nie rezygnuj. Pocierp teraz i żyj resztę życia jak mistrz.'},
{a:'Wayne Gretzky',w:'hokeista',x:'Nie trafisz stu procent rzutów, których nie oddasz.'},
{a:'Theodore Roosevelt',w:'prezydent USA',x:'Rób, co możesz, tym, co masz, tam, gdzie jesteś.'},
{a:'J. K. Rowling',w:'pisarka, przemowa na Harvardzie, 2008',x:'Nie da się żyć bez porażek, chyba że żyjesz tak ostrożnie, że równie dobrze mogłoby Cię nie być.'},
{a:'Steve Jobs',w:'współzałożyciel Apple, Stanford 2005',x:'Jedynym sposobem na wykonanie świetnej pracy jest kochać to, co się robi.'},
{a:'Isaac Newton',w:'fizyk',x:'Jeśli widziałem dalej, to dlatego, że stałem na ramionach gigantów.'},
{a:'Marek Aureliusz',w:'cesarz i filozof, „Rozmyślania”',x:'To, co stoi na drodze, staje się drogą.'},
{a:'Seneka',w:'filozof, „Listy do Lucyliusza”',x:'Nie dlatego nie ośmielamy się, że rzeczy są trudne. Są trudne, bo się nie ośmielamy.'},
{a:'Lao-tsy',w:'„Tao te king”',x:'Podróż tysiąca mil zaczyna się od jednego kroku.'},
{a:'James Clear',w:'autor „Atomic Habits”',x:'Każde działanie to głos oddany na osobę, którą chcesz się stać.'},
{a:'Will Durant',w:'historyk, o Arystotelesie',x:'Jesteśmy tym, co powtarzamy każdego dnia. Doskonałość nie jest aktem, lecz nawykiem.'},
{a:'Neil Armstrong',w:'pierwszy człowiek na Księżycu, 1969',x:'To jeden mały krok dla człowieka, ale wielki skok dla ludzkości.'},
{a:'Winston Churchill',w:'premier Wielkiej Brytanii, 1941',x:'Nigdy, przenigdy się nie poddawaj, w niczym, wielkim czy małym.'},
{a:'Eliud Kipchoge',w:'maratończyk, pierwszy poniżej 2 godzin, 2019',x:'Żaden człowiek nie ma granic.'},
{a:'Jan Paweł II',w:'homilia, 22 października 1978',x:'Nie lękajcie się!'},
];

/* Ilustracje: Everkinetic (CC BY-SA 4.0), pliki w public/ — pozycja startowa (a) i końcowa (b) */
const EKIMG={
  'Pompki klasyczne':'0077','Pompki z nogami na krześle':'0075','Superman':'0105','Mostek biodrowy':'0109',
  'Wiosłowanie pod stołem':'0086','Dipy na krześle (nogi ugięte)':'0162','Dipy na krześle (nogi proste)':'0162','Wykroki chodzone':'0121','Kark w bok':'0002',
};
/* v1.0: rysunki do całej bazy Ruchu (WL) — 5. element każdego wpisu to id Everkinetic */
Object.values(WL).forEach(g=>Object.values(g).forEach(a=>a.forEach(e=>{if(e[4])EKIMG[e[0]]=e[4]})));
