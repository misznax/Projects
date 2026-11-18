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
   [nazwa, opis, pozycja startowa, pozycja końcowa] */
const LVN=[[1,'Podstawowy'],[2,'Średni'],[3,'Zaawansowany']];
const WL={
upper:{
1:[
['Pompki o ścianę','Najłagodniejsza wersja pompki — bez obciążania nadgarstków i barków.','Stań na wyciągnięcie ręki od ściany, dłonie na ścianie na wysokości barków, ręce proste.','Zegnij łokcie i przybliż klatkę do ściany, ciało w jednej linii; wypchnij się z powrotem.'],
['Wyciskanie nad głowę z butelkami','W siadzie na krześle, w każdej dłoni butelka z wodą (0,5 l).','Butelki przy barkach, łokcie zgięte, plecy oparte.','Wyprostuj ręce nad głową bez wyginania pleców, potem wolno opuść do barków.'],
['Unoszenie ramion bokiem','Stojąc lub siedząc, w dłoniach butelki. Ruch jest wolny i kontrolowany.','Ręce wzdłuż ciała, barki luźno w dół.','Unieś ręce bokiem do wysokości barków (nie wyżej), opuść w 3 sekundy.'],
['Ściąganie łopatek na siedząco','Siedzisz prosto, ręce zgięte w łokciach. Ćwiczenie dla postawy.','Ręce przed sobą, łopatki rozsunięte.','Przyciągnij łokcie do tyłu, ściągnij łopatki do siebie na 2 sekundy i wróć.'],
['Prostowanie ramienia z butelką','Triceps: w siadzie, butelka w jednej dłoni, drugą ręką podeprzyj łokieć. Pierwsze 8 powtórzeń jedna ręka, potem druga.','Łokieć przy głowie wskazuje w górę, butelka za głową.','Wyprostuj rękę nad głową i wolno zegnij z powrotem.'],
],
2:[
['Pompki o stół lub blat','Im wyższy blat, tym łatwiej. Stabilny stół lub parapet.','Dłonie na krawędzi blatu, ciało proste jak deska, ręce wyprostowane.','Zegnij łokcie, klatka do krawędzi blatu, wypchnij w górę.'],
['Pompki na kolanach','Kolana na miękkim podłożu, ciało prosto od kolan do głowy.','Dłonie pod barkami, ręce proste.','Opuść klatkę nisko nad podłogę i wypchnij.'],
['Dipy na krześle (nogi ugięte)','Stabilne krzesło oparte o ścianę. Nogi ugięte = łatwiej.','Dłonie na brzegu siedziska obok bioder, pośladki przed krzesłem, ręce proste.','Zegnij łokcie do tyłu (ok. 90°) i wypchnij się w górę.'],
['Wiosłowanie z plecakiem','Plecak z książkami. Jedną ręką oprzyj się o stół, plecy proste.','Plecak zwisa, ręka prosta.','Przyciągnij plecak do biodra, łokieć wzdłuż ciała, i opuść.'],
['Plank na przedramionach (na kolanach)','Przytrzymaj 20–30 sekund, oddychaj spokojnie.','Przedramiona i kolana na podłodze.','Ciało w linii od kolan do głowy, brzuch napięty, biodra nie opadają.'],
['Superman','Leżąc na brzuchu. Wzmacnia plecy.','Ręce wyprostowane przed sobą, czoło nisko.','Unieś ręce i nogi kilka centymetrów, przytrzymaj 2 sekundy i opuść.'],
],
3:[
['Pompki klasyczne','Ciało proste jak deska, brzuch napięty.','Dłonie pod barkami, ręce proste, stopy złączone.','Opuść klatkę prawie do podłogi, wypchnij w górę.'],
['Pompki z nogami na krześle','Trudniejsze, bo więcej ciężaru idzie na ramiona.','Stopy na krześle, dłonie na podłodze pod barkami.','Opuść głowę w kierunku podłogi i wypchnij.'],
['Pike push-up','Pozycja odwróconego „V”, ciężar na barkach.','Biodra wysoko, ręce i nogi proste.','Zegnij łokcie, czubek głowy do podłogi, wypchnij w górę.'],
['Wiosłowanie pod stołem','Bardzo stabilny, ciężki stół. Jeśli się chwieje — nie rób.','Leżysz pod stołem, ręce prosto na krawędzi, ciało w linii.','Przyciągnij klatkę do blatu, ściągnij łopatki i wolno opuść.'],
['Dipy na krześle (nogi proste)','Stopy na podłodze, nogi proste.','Dłonie na siedzisku, ręce proste, biodra tuż przed krzesłem.','Zegnij łokcie do 90° i wypchnij w górę.'],
['Plank pełny z dotknięciem barku','40 sekund; biodra stoją w miejscu.','Podpór na dłoniach, ciało w jednej linii.','Na zmianę dotykaj dłonią przeciwległego barku, nie kołysząc biodrami.'],
],
},
lower:{
1:[
['Wstawanie z krzesła','Najważniejsze ćwiczenie codzienne. Krzesło oparte o ścianę.','Siedzisz na brzegu krzesła, stopy na szerokość bioder.','Wstań bez pomocy rąk (lub z lekkim podparciem), wyprostuj się i usiądź wolno.'],
['Półprzysiad przy oparciu','Trzymaj się oparcia krzesła lub blatu.','Stoisz prosto, stopy na szerokość bioder.','Zegnij kolana jak do siadania (do ok. 45°), kolana nad stopami, i wstań.'],
['Marsz z wysokim kolanem','Przy oparciu, wolno i równo.','Stoisz prosto, ręka na oparciu.','Unieś kolano do wysokości bioder, opuść, zmień nogę.'],
['Wspięcia na palce przy oparciu','Dla łydek i równowagi.','Stoisz przy oparciu, pięty na podłodze.','Wejdź na palce, przytrzymaj sekundę, wolno opuść.'],
['Odwodzenie nogi w bok','Dla bioder i stabilności. Trzymaj się oparcia.','Stoisz prosto, stopy razem.','Unieś nogę bokiem na ok. 30 cm, tułów prosto, i opuść. Potem druga noga.'],
],
2:[
['Przysiady','Stopy na szerokość barków, plecy proste.','Stoisz prosto, ręce przed sobą.','Biodra do tyłu i w dół jak do siadania, kolana nad stopami, wstań.'],
['Wykroki w tył','Z lekkim podparciem o oparcie, jeśli trzeba.','Stoisz prosto.','Krok jedną nogą w tył, opuść tylne kolano w stronę podłogi i wróć.'],
['Mostek biodrowy','Leżąc na plecach, stopy blisko pośladków.','Leżysz, kolana ugięte, ręce wzdłuż ciała.','Unieś biodra, aż tułów i uda tworzą linię, ściśnij pośladki, opuść.'],
['Wspięcia na palce','Bez podparcia, jeśli czujesz się pewnie.','Stoisz prosto.','Wejdź na palce jak najwyżej, wolno opuść.'],
['Przysiad przy ścianie','Trzymaj 20–30 sekund, oddychaj.','Plecy oparte o ścianę.','Zsuń się do kąta ok. 90° w kolanach i trzymaj.'],
],
3:[
['Przysiad bułgarski','Tylna stopa na krześle. Pierwsze 20 s jedna noga, potem druga.','Przednia stopa pół kroku przed krzesłem.','Opuść tylne kolano w dół i wróć.'],
['Martwy ciąg na jednej nodze','Dla równowagi i tyłu uda.','Stoisz na jednej nodze, lekko ugiętej.','Pochyl tułów, druga noga idzie prosto w tył do litery T; wróć.'],
['Przysiady z wyskokiem','Tylko jeśli kolana nie bolą. Miękkie lądowanie.','Stoisz w przysiadzie.','Wyskocz do góry i miękko wróć do przysiadu.'],
['Mostek biodrowy na jednej nodze','Trudniejsza wersja mostku.','Leżysz, jedna noga zgięta, druga prosta w górze.','Unieś biodra na jednej nodze i opuść.'],
['Wykroki chodzone','Krok po kroku w jednym kierunku.','Stoisz prosto.','Duży krok do przodu, opuść tylne kolano i wstań na drugą nogę.'],
['Pistolet z podparciem','Przysiad na jednej nodze z podparciem o oparcie.','Stoisz na jednej nodze, ręka na oparciu.','Zejdź w dół tak nisko, jak potrafisz, wstań.'],
],
},
grip:{
1:[
['Ściskanie ręcznika','Zwiń ręcznik lub miękką piłkę. Bez bólu w stawach.','Ręcznik w dłoni, palce rozluźnione.','Ściśnij mocno przez 3 sekundy i rozluźnij na 2.'],
['Wyżymanie ręcznika (lekko)','Jak wyżymanie prania. Bez szarpania.','Ręcznik zwinięty, dwie ręce.','Skręć raz w jedną, raz w drugą stronę.'],
['Rozprost palców gumką','Gumka recepturka na palce — przeciwwaga dla chwytu.','Dłoń zamknięta, gumka na palcach.','Otwórz dłoń szeroko pod oporem, zamknij.'],
['Zginanie nadgarstków z butelką','Przedramię oparte na udzie, dłoń poza kolanem.','Dłoń z butelką zgięta w dół.','Unieś nadgarstek w górę i wolno opuść.'],
['Chwyt szczypcowy','Kartka lub cienka książka, 15 sekund.','Chwyt kciuk – palce.','Utrzymaj przedmiot w powietrzu.'],
],
2:[
['Zwis z podparciem stóp','Stopy na krześle, ręce na drążku. Ciężar rozłożony.','Chwyt nachwytem, ręce proste.','Utrzymaj zwis 20 sekund, łopatki lekko w dół.'],
['Spacer farmera (lekki)','Dwie torby z zakupami lub butelki.','Torby po bokach.','Idź wolno prosto 20–30 sekund, barki w dół.'],
['Zwis na ręczniku','Ręcznik przerzucony przez drążek.','Chwyt za oba końce ręcznika.','Zwisaj 15–20 sekund.'],
['Zaciskanie dłoni z przytrzymaniem','Piłka lub zwinięty ręcznik.','Dłoń otwarta.','Maksymalnie zaciśnij, przytrzymaj 5 sekund.'],
['Wyżymanie ręcznika mocno','Silniej, ale z kontrolą.','Zwinięty ręcznik.','Skręcaj z siłą w obie strony.'],
],
3:[
['Zwis aktywny na drążku','30 sekund.','Chwyt nachwytem, ręce proste.','Przyciągnij łopatki w dół, zwisaj aktywnie.'],
['Podciąganie negatywne','Wejdź na krzesło, zacznij u góry. Tylko z bezpiecznym drążkiem.','Broda nad drążkiem.','Opuszczaj się wolno przez 4 sekundy.'],
['Spacer farmera (ciężki)','Dwa ciężkie ładunki.','Ładunki po bokach.','Idź 30–40 sekund, plecy proste.'],
['Zwis na ręczniku na drążku','Trudniejszy chwyt.','Ręcznik na drążku.','Zwisaj 20–30 sekund.'],
['Chwyt szczypcowy z książką','30 sekund, gruba książka.','Książka za grzbiet.','Utrzymaj przedmiot w powietrzu.'],
],
},
};
