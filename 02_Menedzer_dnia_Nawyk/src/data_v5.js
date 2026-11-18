/* ───────── v0.05: cytaty do czytania na głos (utwory z domeny publicznej) ───────── */
const QUOTES=[
{a:'Adam Mickiewicz',w:'„Pan Tadeusz” (Inwokacja)',x:'Litwo! Ojczyzno moja! ty jesteś jak zdrowie;\nIle cię trzeba cenić, ten tylko się dowie,\nKto cię stracił.'},
{a:'Adam Mickiewicz',w:'„Romantyczność”',x:'Czucie i wiara silniej mówi do mnie\nNiż mędrca szkiełko i oko.'},
{a:'Adam Mickiewicz',w:'„Oda do młodości”',x:'Młodości! dodaj mi skrzydła!\nNiech nad martwym wzlecę światem\nW rajską dziedzinę fantazji'},
{a:'Jan Kochanowski',w:'„Na zdrowie” (Fraszki)',x:'Szlachetne zdrowie,\nNikt się nie dowie,\nJako smakujesz,\nAż się zepsujesz.'},
{a:'Juliusz Słowacki',w:'„Testament mój”',x:'Lecz zaklinam – niech żywi nie tracą nadziei\nI przed narodem niosą oświaty kaganiec;'},
{a:'Cyprian Norwid',w:'„Moja piosnka (II)”',x:'Do kraju tego, gdzie kruszynę chleba\nPodnoszą z ziemi przez uszanowanie\nDla darów Nieba…\nTęskno mi, Panie.'},
{a:'Julian Tuwim',w:'„Lokomotywa”',x:'Stoi na stacji lokomotywa,\nCiężka, ogromna i pot z niej spływa'},
{a:'Maria Konopnicka',w:'„Rota”',x:'Nie rzucim ziemi, skąd nasz ród,\nNie damy pogrześć mowy!'},
{a:'William Shakespeare',w:'„Hamlet”',x:'To be, or not to be, that is the question:\nWhether ’tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,'},
{a:'William Shakespeare',w:'„As You Like It” (Jak wam się podoba)',x:'All the world’s a stage,\nAnd all the men and women merely players;\nThey have their exits and their entrances,'},
{a:'Rudyard Kipling',w:'„If—”',x:'If you can keep your head when all about you\nAre losing theirs and blaming it on you,'},
{a:'John Keats',w:'„Endymion”',x:'A thing of beauty is a joy for ever:\nIts loveliness increases; it will never\nPass into nothingness;'},
{a:'William Wordsworth',w:'„I Wandered Lonely as a Cloud”',x:'I wandered lonely as a cloud\nThat floats on high o’er vales and hills,'},
{a:'Walt Whitman',w:'„Song of Myself”',x:'I celebrate myself, and sing myself,\nAnd what I assume you shall assume,'},
];

/* ───────── v0.05: baza ćwiczeń ruchowych wg poziomu ─────────
   [nazwa, opis, pozycja startowa, pozycja końcowa, id rysunku Everkinetic] — v1.0: każde ćwiczenie ma parę rysunków start/koniec */
const LVN=[[1,'Podstawowy'],[2,'Średni'],[3,'Zaawansowany']];
const WL={
upper:{
1:[
['Unoszenie ramion bokiem','Stojąc lub siedząc, w dłoniach butelki. Ruch jest wolny i kontrolowany.','Ręce wzdłuż ciała, barki luźno w dół.','Unieś ręce bokiem do wysokości barków (nie wyżej), opuść w 3 sekundy.','0018'],
['Unoszenie ramion przodem','W dłoniach butelki. Nie bujaj tułowiem.','Ręce wzdłuż ciała, dłonie zwrócone do ud.','Unieś ręce prosto przed siebie do wysokości barków i wolno opuść.','0033'],
['Wyciskanie nad głowę z butelką','Stojąc lub w siadzie na krześle, butelka (0,5 l) w jednej dłoni; po połowie czasu zmień rękę.','Butelka przy barku, łokieć zgięty, plecy proste.','Wyprostuj rękę nad głową bez wyginania pleców, potem wolno opuść do barku.','0038'],
['Wzruszanie barkami z butelkami','Dla karku i postawy. W dłoniach butelki lub torby.','Ręce wzdłuż ciała, barki luźno w dół.','Unieś barki do uszu, przytrzymaj sekundę i wolno opuść.','0005'],
['Ściąganie łopatek z gumą lub ręcznikiem','Ćwiczenie dla postawy: guma lub mocno napięty ręcznik trzymany przed sobą.','Ręce wyprostowane przed sobą na wysokości barków, guma lekko napięta.','Rozciągnij gumę na boki, ściągnij łopatki do siebie na 2 sekundy i wróć.','0020'],
['Prostowanie ramienia z butelką','Triceps: w siadzie, butelka w jednej dłoni; po połowie czasu druga ręka.','Łokieć przy głowie wskazuje w górę, butelka za głową.','Wyprostuj rękę nad głową i wolno zegnij z powrotem.','0173'],
],
2:[
['Dipy na krześle (nogi ugięte)','Stabilne krzesło oparte o ścianę. Nogi ugięte = łatwiej.','Dłonie na brzegu siedziska obok bioder, pośladki przed krzesłem, ręce proste.','Zegnij łokcie do tyłu (ok. 90°) i wypchnij się w górę.','0162'],
['Wiosłowanie jedną ręką','Plecak lub ciężka torba. Jedną dłonią i kolanem oprzyj się o stabilny stół lub krzesło, plecy proste.','Ręka z plecakiem zwisa prosto w dół, wzrok w podłogę.','Przyciągnij plecak do biodra, ściągnij łopatkę do kręgosłupa i wolno opuść. Po połowie czasu zmień rękę.','0024'],
['Prostowanie ramienia w opadzie','Triceps: oprzyj się o stół jak przy wiosłowaniu, łokieć wysoko przy tułowiu.','Łokieć zgięty pod kątem 90°, butelka lub plecak przy żebrach.','Wyprostuj rękę do tyłu, przytrzymaj sekundę i wolno wróć.','0204'],
['Wiosłowanie pionowe z butelkami','Butelki lub torby w dłoniach. Łokcie nie wyżej niż barki.','Ręce przed udami, dłonie nachwytem.','Przyciągnij ciężar wzdłuż tułowia do klatki (łokcie na zewnątrz), wolno opuść.','0016'],
['Plank boczny','Przytrzymaj 20–30 sekund na stronę, oddychaj spokojnie.','Leżysz na boku, łokieć pod barkiem, nogi proste.','Unieś biodra tak, by ciało tworzyło linię od stóp do głowy; po czasie zmień stronę.','0113'],
['Superman','Leżąc na brzuchu. Wzmacnia plecy.','Ręce wyprostowane przed sobą, czoło nisko.','Unieś ręce i nogi kilka centymetrów, przytrzymaj 2 sekundy i opuść.','0105'],
],
3:[
['Pompki klasyczne','Ciało proste jak deska, brzuch napięty.','Dłonie pod barkami, ręce proste, stopy złączone.','Opuść klatkę prawie do podłogi, wypchnij w górę.','0077'],
['Pompki z nogami na krześle','Trudniejsze, bo więcej ciężaru idzie na ramiona.','Stopy na krześle, dłonie na podłodze pod barkami.','Opuść głowę w kierunku podłogi i wypchnij.','0075'],
['Pompki wąskie (triceps)','Dłonie blisko siebie pod klatką, łokcie wzdłuż ciała.','Podpór na wąsko ustawionych dłoniach, ciało w jednej linii.','Zegnij łokcie wzdłuż tułowia, klatka niemal do podłogi, wypchnij.','0188'],
['Wiosłowanie pod stołem','Bardzo stabilny, ciężki stół. Jeśli się chwieje — nie rób.','Leżysz pod stołem, ręce prosto na krawędzi, ciało w linii.','Przyciągnij klatkę do blatu, ściągnij łopatki i wolno opuść.','0086'],
['Dipy na krześle (nogi proste)','Stopy na podłodze, nogi proste.','Dłonie na siedzisku, ręce proste, biodra tuż przed krzesłem.','Zegnij łokcie do 90° i wypchnij w górę.','0162'],
['Podciąganie podchwytem (negatywne)','Tylko z bezpiecznym drążkiem. Wejdź na krzesło, zacznij u góry.','Broda nad drążkiem, chwyt podchwytem na szerokość barków.','Opuszczaj się wolno przez 4 sekundy do pełnego zwisu.','0090'],
],
},
lower:{
1:[
['Wstawanie z krzesła','Najważniejsze ćwiczenie codzienne. Krzesło oparte o ścianę.','Siedzisz na brzegu krzesła, stopy na szerokość bioder.','Wstań bez pomocy rąk (lub z lekkim podparciem), wyprostuj się i usiądź wolno.','0136'],
['Wejście na schodek','Stabilny, niski stopień lub dolny schodek; trzymaj się poręczy.','Stoisz przed stopniem, jedna stopa już na nim.','Wejdź na stopień, wyprostuj biodro i zejdź wolno; po połowie czasu zmień nogę.','0137'],
['Odwodzenie nogi w tył','Dla pośladków i bioder. Trzymaj się oparcia lub ściany.','Stoisz prosto, ręka na ścianie.','Wyprostowaną nogę unieś w tył na ok. 30 cm, tułów prosto, i opuść. Potem druga noga.','0111'],
['Wspięcia na palce przy oparciu','Dla łydek i równowagi. Rysunek pokazuje sztangę — Ty rób bez ciężaru.','Stoisz przy oparciu, pięty na podłodze.','Wejdź na palce, przytrzymaj sekundę, wolno opuść.','0281'],
['Unoszenie nóg leżąc','Brzuch i biodra. Dolny odcinek pleców dociśnięty do podłogi.','Leżysz na plecach, nogi proste tuż nad podłogą, ręce pod pośladkami.','Unieś proste nogi do pionu i wolno opuść, bez wyginania pleców.','0021'],
],
2:[
['Przysiady','Stopy na szerokość barków, plecy proste. Rysunek z ciężarkami — Ty bez albo z butelkami.','Stoisz prosto, ręce przed sobą.','Biodra do tyłu i w dół jak do siadania, kolana nad stopami, wstań.','0130'],
['Wykroki w tył','Z lekkim podparciem o oparcie, jeśli trzeba.','Stoisz prosto.','Krok jedną nogą w tył, opuść tylne kolano w stronę podłogi i wróć.','0129'],
['Mostek biodrowy','Leżąc na plecach, stopy blisko pośladków.','Leżysz, kolana ugięte, ręce wzdłuż ciała.','Unieś biodra, aż tułów i uda tworzą linię, ściśnij pośladki, opuść.','0109'],
['Przysiad sumo','Stopy szeroko, palce na zewnątrz; butelka lub torba trzymana przed sobą.','Stoisz w rozkroku, ręce splecione przed sobą.','Zegnij kolana nad stopami, plecy proste, i wstań.','0152'],
['Przysiad w bok','Szeroki rozkrok; ciężar przenosisz z nogi na nogę. Rysunek pokazuje sztangę — Ty rób bez.','Stoisz w szerokim rozkroku, stopy skierowane na zewnątrz.','Zegnij jedno kolano i przenieś na nie ciężar, druga noga prosta; wróć i zmień stronę.','0131'],
['Wspięcia na palce','Bez podparcia, jeśli czujesz się pewnie; najlepiej na krawędzi stopnia. Rysunek pokazuje sztangę — Ty rób bez ciężaru.','Stoisz prosto.','Wejdź na palce jak najwyżej, wolno opuść.','0281'],
],
3:[
['Wykroki chodzone','Krok po kroku w jednym kierunku.','Stoisz prosto.','Duży krok do przodu, opuść tylne kolano i wstań na drugą nogę.','0121'],
['Wykroki w przód z ciężarem','Butelki lub plecak w dłoniach; kolano przedniej nogi nad stopą.','Stoisz prosto, ciężar wzdłuż ciała.','Duży krok w przód, opuść tylne kolano w stronę podłogi i wróć do stania.','0115'],
['Martwy ciąg z torbami','Dla pleców i tyłu uda. Torby lub butelki w dłoniach, plecy proste jak deska.','Stoisz prosto, ciężar przed udami.','Biodra do tyłu, tułów pochyla się, ciężar zsuwa się po udach; wróć do stania.','0107'],
['Przysiad na jednej nodze','Z podparciem o oparcie; druga noga zgięta za Tobą. Rysunek pokazuje sztangę — Ty rób bez.','Stoisz na jednej nodze, ręka na oparciu.','Zejdź w dół tak nisko, jak potrafisz, kolano nad stopą, wstań. Po połowie czasu zmień nogę.','0132'],
['Wejścia na stopień z plecakiem','Stabilne krzesło lub wysoki stopień, plecak z książkami. Rysunek pokazuje sztangę.','Stoisz przed stopniem, jedna stopa na nim.','Wejdź, wyprostuj biodro, zejdź wolno; po połowie czasu zmień nogę.','0134'],
],
},
grip:{
1:[
['Zginanie ramion z butelkami','Biceps i chwyt. Butelki, naprzemiennie, bez bujania tułowiem.','Ręce wzdłuż ciała, dłonie do przodu.','Zegnij łokcie, butelki do barków; wolno opuść.','0223'],
['Zginanie młotkowe','Dłonie zwrócone do siebie, „jak przy młotku” — wzmacnia przedramię.','Ręce wzdłuż ciała, kciuki skierowane do przodu.','Zegnij łokcie, butelki do barków, kciuki w górę; wolno opuść.','0213'],
['Zginanie odwrotne (nachwytem)','Przedramiona i chwyt; lekkie butelki, nadgarstki proste.','Ręce wzdłuż ciała, dłonie skierowane w dół.','Zegnij łokcie, dłonie w dół, do wysokości barków; wolno opuść.','0257'],
['Zginanie ramienia w siadzie','Łokieć oprzyj o wewnętrzną stronę uda; ruch tylko w łokciu.','Siedzisz, ramię z butelką zwisa między kolanami.','Zegnij łokieć do barku, przytrzymaj sekundę, opuść; po połowie czasu druga ręka.','0220'],
['Zginanie skrośne','Butelka przechodzi w poprzek klatki; chwyt młotkowy.','Ręka wzdłuż ciała, kciuk w górę.','Przenieś butelkę w poprzek klatki do przeciwnego barku i opuść.','0221'],
],
2:[
['Zottman (zginanie z obrotem)','Podnosisz dłonią w górę, opuszczasz dłonią w dół — wzmacnia chwyt i przedramiona.','Ręce wzdłuż ciała, dłonie do przodu.','Zegnij łokcie, na górze obróć dłonie w dół i wolno opuść.','0251'],
['Zginanie z talerzem lub książką','Gruba książka, talerz lub pełna torba trzymana oburącz za boki — chwyt szczypcowy.','Ramiona wzdłuż ciała, ciężar przed udami.','Zegnij łokcie, ciężar do klatki, wolno opuść.','0241'],
['Zginanie z cięższymi butelkami','Butelki 1–1,5 l, wolne tempo (3 s w dół).','Ręce wzdłuż ciała, dłonie do przodu.','Zegnij łokcie z lekkim obrotem dłoni na zewnątrz; wolno opuść.','0246'],
['Zwis z podparciem stóp','Zwis na bezpiecznym drążku, stopy mogą dotykać krzesła. Ciężar rozłożony.','Chwyt nachwytem, ręce proste.','Utrzymaj zwis 20 sekund, łopatki lekko w dół; możesz lekko się podciągnąć.','0087'],
['Zwis podchwytem','Drążek lub poręcz; stopy na krześle, jeśli trzeba.','Chwyt podchwytem na szerokość barków.','Zwisaj 15–20 sekund, łopatki lekko w dół.','0090'],
],
3:[
['Zwis aktywny na drążku','30 sekund, tylko na bezpiecznym drążku.','Chwyt nachwytem, ręce proste.','Przyciągnij łopatki w dół, zwisaj aktywnie.','0087'],
['Podciąganie negatywne','Wejdź na krzesło, zacznij u góry. Tylko z bezpiecznym drążkiem.','Broda nad drążkiem.','Opuszczaj się wolno przez 4 sekundy.','0090'],
['Podciąganie szerokim chwytem (negatywne)','Chwyt szerzej niż barki. Tylko z bezpiecznym drążkiem.','Broda nad drążkiem, chwyt szeroki.','Opuszczaj się wolno przez 4 sekundy.','0091'],
['Zginanie odwrotne z ciężarem','Cięższe butelki lub torby (1,5–2 l); nadgarstki proste.','Ręce wzdłuż ciała, dłonie w dół.','Zegnij łokcie, wolno 4 s w dół.','0257'],
['Zottman z ciężkimi butelkami','Wolne tempo, 4 s w dół.','Ręce wzdłuż ciała, dłonie do przodu.','Zegnij łokcie, na górze obróć dłonie w dół i wolno opuść.','0251'],
],
},
};
