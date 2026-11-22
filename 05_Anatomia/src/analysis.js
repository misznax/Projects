// Analiza objawów: wzorce offline (działają bez internetu i bez klucza AI) + normalizacja wyniku z AI.
// Procenty = oszacowanie edukacyjne udziału mięśnia w napięciu/pracy w danej pozycji (suma = 100), NIE pomiar EMG.
export const norm = (s) => String(s || '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

export const TRYB = { c: ['czynny', 'pracuje czynnie (skurcz)'], i: ['izometryczny', 'stabilizuje (napięcie bez ruchu)'], r: ['rozciągany', 'bierne rozciągnięcie'], k: ['skrócony', 'skrócony / „wyłączony”'] };
export const ROLA = { g: ['główny', '#ff3b30'], p: ['pomocniczy', '#ff9f0a'], s: ['stabilizator', '#30c4d6'] };
export const roleOf = (pct) => (pct >= 14 ? 'g' : pct >= 6 ? 'p' : 's');

const ALARM_LEDZ = ['Drętwienie, osłabienie nogi lub ból promieniujący poniżej kolana', 'Problemy z kontrolą pęcherza/stolca lub drętwienie w okolicy krocza — pilnie do lekarza', 'Ból nocny, gorączka, nagła utrata masy ciała lub ból po urazie', 'Ból narastający lub niezmieniony mimo odpoczynku dłużej niż 2–3 tygodnie'];
const ALARM_SZYJA = ['Drętwienie lub osłabienie ręki, ból promieniujący do palców', 'Silny, nagły ból głowy, zawroty, zaburzenia widzenia lub mowy — pilnie do lekarza', 'Ból po urazie (np. wypadek, upadek)'];
const ALARM_REKA = ['Drętwienie palców, osłabienie chwytu lub „upuszczanie” przedmiotów', 'Obrzęk, zaczerwienienie, gorączka lub ból po urazie', 'Ból nocny albo niezmieniony mimo odpoczynku dłużej niż 3–4 tygodnie'];

// m: [klucz grupy, tryb(c/i/r/k), waga, opis]; rola wyliczana z udziału procentowego
export const SCEN = [
  {
    id: 'dziecka', ex: 'Ból w lędźwiach w pozycji dziecka — ulga przy powolnym zbliżaniu kolan do głowy',
    kw: [['dziecka|balasan|child s pose|child pose', 3], ['zbliz\\w* kolan|kolan\\w* .{0,25}glow|glow\\w* .{0,25}kolan|kolana pod|miedzy kolan', 2], ['ledzw|krzyz|dol plec', 1], ['ulg|rozluzn|powoln', 1]],
    poz: 'Pozycja dziecka — powolne zbliżanie kolan, głowa między nimi', okolica: 'Lędźwie i miednica', widok: 'tyl',
    pods: 'Głębokie zgięcie bioder i kręgosłupa lędźwiowego rozciąga bierne mięśnie przykręgosłupowe, mięsień czworoboczny lędźwi i pośladki. Ulga przy powolnym ruchu wskazuje na napiętą tylną taśmę lędźwi (odruchowe napięcie ochronne), a szybki ruch wywołuje ich obronny skurcz.',
    m: [['iliocostalis', 'r', 14, 'Bierne rozciągnięcie prostownika grzbietu (część lędźwiowa)', 'lumborum'], ['longissimus', 'r', 14, 'Najsilniejszy prostownik; rozciągany przy zgięciu lędźwi', 'thoracis'], ['multifidus', 'r', 10, 'Głębokie mięśnie segmentowe; często napięte „ochronnie” przy bólu krzyża', 'lumborum'], ['ql', 'r', 6, 'Rozciągany, gdy kolana lub ręce ustawiasz na bok'], ['glutmax', 'r', 12, 'Rozciągany przy głębokim zgięciu bioder'], ['glutmed', 'r', 4, 'Włókna tylne rozciągane przy zgięciu bioder'], ['piriformis', 'r', 4, 'Rozciągany przy zgięciu i rozstawieniu kolan'], ['addmag', 'r', 6, 'Rozciągany, gdy kolana są szeroko'], ['iliopsoas', 'c', 10, 'Zgina biodro przy zbliżaniu kolan; skrócony w siedzeniu'], ['rectfem', 'k', 4, 'Rozluźniony w zgięciu bioder, rozciągany w zgięciu kolana'], ['rectabd', 'c', 4, 'Lekko pomaga w zgięciu tułowia i miednicy'], ['transabd', 'i', 5, 'Stabilizuje przy spokojnym oddechu (przepona)'], ['levani', 'i', 2, 'Dno miednicy rozluźnia się przy oddechu']],
    przyczyny: [['Napięcie ochronne mięśni przykręgosłupowych lędźwi', 'Częste po długim siedzeniu lub przy stresie; zgięcie kręgosłupa je rozciąga i zmniejsza napięcie, a gwałtowny ruch wywołuje odruchowy skurcz.'], ['Przykurcz zginaczy bioder (m. biodrowo-lędźwiowy) i pogłębiona lordoza', 'Skrócony mięsień ciągnie lędźwie w lordozę; zgięcie bioder go rozluźnia, więc przynosi ulgę.'], ['Przeciążenie stawów międzywyrostkowych lub zwężenie kanału (ulga w zgięciu)', 'Ulga przy pochyleniu do przodu bywa typowa dla tych stanów — warto omówić z lekarzem lub fizjoterapeutą, zwłaszcza gdy objaw wraca.']],
    osl: [['transabd', 'Słaby „gorset” słabo stabilizuje lędźwie, więc prostowniki muszą pracować za nich.', 'Dead bug: 3×8–10 na stronę, wolny oddech; zacznij od ugiętych kolan.'], ['multifidus', 'Słabsze mięśnie segmentowe = gorsza kontrola ruchu między kręgami.', 'Bird-dog z przytrzymaniem 5 s: 3×6 na stronę, bez „bujania” miednicy.'], ['glutmax', 'Słabe pośladki przerzucają pracę na lędźwie.', 'Mostek biodrowy: 3×12, 2 s napięcia pośladków na górze.'], ['glutmed', 'Boczna stabilizacja miednicy odciąża mięsień czworoboczny lędźwi.', 'Odwodzenie nogi w leżeniu bokiem lub boczna deska na kolanach: 3×12 / 3×20 s.']],
    roz: [['iliopsoas', 'Wykrok w klęku podpartym z napięciem pośladka (miednica „pod”): 2×30–45 s na stronę.'], ['iliocostalis', 'Delikatnie: pozycja dziecka na wydechu, 5–8 powolnych oddechów, bez szarpania i bez dociskania.'], ['ql', 'Pozycja dziecka z rękami przesuniętymi w prawo / lewo: 30 s na stronę.'], ['piriformis', 'Figura „4” w leżeniu na plecach: 30–45 s na stronę.']],
    alarm: ALARM_LEDZ,
  },
  {
    id: 'siedzenie', ex: 'Ból krzyża i sztywne biodra po całym dniu przy biurku',
    kw: [['siedz|biurk|krzesl|za komputer|praca przy|samochod', 2], ['krzyz|ledzw|biodr|posladk|tyl uda', 1], ['godzin|caly dzien|po pracy', 1]],
    poz: 'Długie siedzenie (praca biurowa)', okolica: 'Lędźwie, biodra, pośladki', widok: 'tyl',
    pods: 'W siedzeniu biodra są zgięte, a miednica często „zapada się” do tyłu: zginacze bioder się skracają, pośladki „wyłączają”, a mięśnie przykręgosłupowe pracują izometrycznie przez wiele godzin — stąd zmęczenie i ból krzyża po wstaniu.',
    m: [['iliocostalis', 'i', 16, 'Utrzymuje wyprostowany tułów godzinami (praca izometryczna)', 'lumborum|thoracis'], ['longissimus', 'i', 16, 'Główny prostownik; zmęczenie = ból krzyża', 'thoracis'], ['multifidus', 'i', 9, 'Stabilizuje segmenty lędźwi w stałej pozycji', 'lumborum'], ['ql', 'i', 7, 'Stabilizuje miednicę i XII żebro, często zaciska się przy asymetrii'], ['iliopsoas', 'k', 10, 'Skrócony przez zgięcie biodra, po wstaniu ciągnie lędźwie w lordozę'], ['rectfem', 'k', 4, 'Skrócony w zgięciu biodra'], ['glutmax', 'r', 9, 'Rozciągnięty i słabo aktywny („śpiące pośladki”)'], ['glutmed', 'k', 3, 'Mało obciążony, osłabia stabilizację miednicy'], ['piriformis', 'k', 4, 'Napinany przy zgięciu biodra i ucisku siedziska'], ['bicfem', 'k', 5, 'Skrócony i uciskany przez siedzisko'], ['semitend', 'k', 3, 'Skrócony w zgięciu kolan'], ['semimem', 'k', 3, 'Skrócony w zgięciu kolan'], ['transabd', 'i', 5, 'Słabo włączany przy zapadniętej postawie'], ['trapezius', 'i', 3, 'Górna część utrzymuje barki przy klawiaturze'], ['levator', 'i', 3, 'Napięty przy pochyleniu głowy do ekranu']],
    przyczyny: [['Zmęczenie mięśni przykręgosłupowych (praca statyczna)', 'Izometryczny wysiłek bez przerw prowadzi do przeciążenia i bólu krzyża po godzinie lub dwóch.'], ['Przykurcz zginaczy bioder i osłabienie pośladków', 'Po wstaniu lędźwie „ciągną się” w lordozę, a pośladki nie odciążają krzyża.'], ['Brak zmiany pozycji (nawyk)', 'Sam brak ruchu zwiększa sztywność tkanek; często pomagają krótkie przerwy co 30–45 min.']],
    osl: [['glutmax', 'Pośladki są „wyłączone” siedzeniem i słabo odciążają lędźwie.', 'Mostek biodrowy 3×12 lub hip thrust z ławki 3×10; 2 s napięcia na górze.'], ['transabd', 'Słaby głęboki brzuch → lędźwie stabilizują się same.', 'Dead bug 3×8 na stronę lub deska na łokciach 3×20–30 s.'], ['glutmed', 'Boczne pośladki stabilizują miednicę przy chodzeniu.', 'Clamshell lub odwodzenie w leżeniu bokiem 3×15.'], ['multifidus', 'Głębokie mięśnie kręgosłupa tracą wytrzymałość.', 'Bird-dog 3×6 z przytrzymaniem 5 s.']],
    roz: [['iliopsoas', 'Wykrok w klęku podpartym z napięciem pośladka: 2×45 s na stronę, kilka razy dziennie.'], ['rectfem', 'Rozciąganie przodu uda w leżeniu bokiem / przy ścianie: 30–45 s na stronę.'], ['bicfem', 'Skłon z prostymi plecami lub rozciąganie w leżeniu z pasem: 30–45 s na stronę.'], ['piriformis', 'Figura „4” w leżeniu: 30–45 s na stronę.']],
    alarm: ALARM_LEDZ,
  },
  {
    id: 'sklon', ex: 'Ból krzyża przy schylaniu się i podnoszeniu rzeczy z podłogi',
    kw: [['sklon|schyl|pochyl|podnos|podnie|zawiaz|zbier|dotknac palc', 2], ['krzyz|ledzw|tyl uda|uda|plecy', 1]],
    poz: 'Skłon tułowia do przodu / podnoszenie z podłogi', okolica: 'Lędźwie i tył uda', widok: 'tyl',
    pods: 'Skłon to połączenie zgięcia bioder i kręgosłupa: pośladki i mięśnie kulszowo-goleniowe oraz prostowniki grzbietu pracują ekscentrycznie („hamują” ruch), a przy dalszym zgięciu rozciągają się biernie. Ból zdradza zwykle ich napięcie lub przeciążenie przy słabych pośladkach.',
    m: [['glutmax', 'c', 12, 'Hamuje skłon i prostuje biodra przy powrocie'], ['longissimus', 'c', 12, 'Ekscentrycznie kontroluje zgięcie tułowia', 'thoracis'], ['iliocostalis', 'c', 11, 'Jak wyżej; w pełnym skłonie rozciągany biernie', 'lumborum|thoracis'], ['bicfem', 'r', 11, 'Rozciągany; sztywne tylne uda ograniczają skłon'], ['semitend', 'r', 8, 'Rozciągany i hamujący zgięcie bioder'], ['semimem', 'r', 8, 'Jak wyżej'], ['multifidus', 'i', 7, 'Stabilizuje segmenty lędźwi', 'lumborum'], ['spinalis', 'c', 4, 'Przyśrodkowa część prostownika grzbietu', 'thoracis'], ['ql', 'i', 4, 'Stabilizuje miednicę'], ['addmag', 'c', 4, 'Tylna część pomaga prostować biodro'], ['transabd', 'i', 4, 'Napina brzuch i chroni lędźwie'], ['rectabd', 'i', 3, 'Przeciwdziała nadmiernemu uwypukleniu brzucha'], ['glutmed', 'i', 3, 'Stabilizuje miednicę'], ['piriformis', 'r', 3, 'Rozciągany przy zgięciu bioder'], ['extobl', 'i', 2, 'Stabilizuje tułów'], ['intobl', 'i', 2, 'Stabilizuje tułów'], ['iliopsoas', 'k', 2, 'Zgina biodro, skrócony przy schylaniu']],
    przyczyny: [['Przeciążenie prostowników grzbietu przy słabych pośladkach', 'Gdy biodra nie „pracują”, schylanie odbywa się głównie kosztem lędźwi.'], ['Sztywne mięśnie kulszowo-goleniowe', 'Ograniczają zgięcie bioder, więc miednica „ucieka” i zwiększa obciążenie krzyża.'], ['Przeciążenie krążka międzykręgowego (szczególnie przy dźwiganiu)', 'Ból przy skłonie pod obciążeniem bywa związany z krążkami — przy nawracających objawach warto się zbadać.']],
    osl: [['glutmax', 'Słabe pośladki = praca „krzyżem” zamiast biodrami.', 'Martwy ciąg rumuński z lekkim ciężarem 3×8–10 lub „good morning” z kijem 3×10.'], ['bicfem', 'Mocne i elastyczne tylne uda odciążają krzyż.', 'Mostek biodrowy na jednej nodze 3×8 lub zginanie nóg z gumą 3×10.'], ['transabd', 'Napięcie brzucha stabilizuje lędźwie pod obciążeniem.', 'Dead bug 3×8; zasada „napnij brzuch jak przed ciosem” przy podnoszeniu.'], ['multifidus', 'Stabilizacja segmentowa chroni stawy kręgosłupa.', 'Bird-dog 3×6 z przytrzymaniem 5 s.']],
    roz: [['bicfem', 'Rozciąganie w leżeniu z pasem lub skłon z lekko ugiętymi kolanami: 30–45 s na stronę.'], ['semimem', 'Jak wyżej; unikaj „zaokrąglania” pleców.'], ['glutmax', 'Przyciąganie kolana do klatki w leżeniu: 30–45 s na stronę.'], ['iliocostalis', 'Delikatne zgięcie w pozycji dziecka: 5–8 powolnych oddechów.']],
    alarm: ALARM_LEDZ,
  },
  {
    id: 'bok_biodra', ex: 'Ból z boku biodra, gdy leżę na boku albo stoję na jednej nodze',
    kw: [['na boku|bok biodra|boku biodra|boczn\\w* biodr|jednej nodze|na jednej|kretarz|zewnetrzn\\w* biodr', 2], ['biodr|posladk', 1], ['schod|chodz|bieg', 1]],
    poz: 'Leżenie na boku / stanie na jednej nodze (okolica krętarza większego)', okolica: 'Zewnętrzna strona biodra', widok: 'tyl',
    pods: 'Przy staniu na jednej nodze mięśnie pośladkowe średni i mały utrzymują poziom miednicy; ucisk na krętarz przy leżeniu na boku drażni ich przyczepy i kaletki. Ból zwykle oznacza przeciążenie lub osłabienie odwodzicieli.',
    m: [['glutmed', 'i', 28, 'Główny stabilizator miednicy w staniu na jednej nodze'], ['glutmin', 'i', 12, 'Współpracuje z m. pośladkowym średnim'], ['tfl', 'c', 12, 'Napina pasmo biodrowo-piszczelowe po zewnętrznej stronie uda'], ['glutmax', 'c', 8, 'Górna część odwodzi i stabilizuje'], ['ql', 'i', 10, 'Utrzymuje miednicę po stronie nogi zakrocznej'], ['extobl', 'i', 5, 'Stabilizuje tułów w płaszczyźnie bocznej'], ['intobl', 'i', 5, 'Jak wyżej'], ['piriformis', 'c', 5, 'Pomaga w odwodzeniu przy zgiętym biodrze'], ['vastlat', 'k', 3, 'Pasmo biodrowo-piszczelowe łączy się z jego powięzią'], ['addlong', 'r', 4, 'Przywodziciele rozciągane przy odwodzeniu'], ['iliopsoas', 'i', 4, 'Stabilizuje biodro z przodu']],
    przyczyny: [['Przeciążenie przyczepu mięśni pośladkowych (tendinopatia) lub zapalenie kaletki krętarzowej', 'Typowo boli przy leżeniu na boku i po wejściu po schodach; bywa związane z osłabieniem odwodzicieli.'], ['Osłabienie m. pośladkowego średniego (opadanie miednicy)', 'Miednica „ucieka” w bok przy chodzeniu, przeciążając pasmo biodrowo-piszczelowe.'], ['Napięcie napinacza powięzi szerokiej i pasma biodrowo-piszczelowego', 'Przejmuje pracę słabych pośladków.']],
    osl: [['glutmed', 'Najczęściej osłabiony odwodziciel.', 'Odwodzenie nogi w leżeniu bokiem 3×12–15 lub boczny krok z gumą 3×10 na stronę.'], ['glutmin', 'Wspiera m. średni.', 'Clamshell z gumą 3×15.'], ['glutmax', 'Odciąża odwodzicieli przy wstawaniu i schodach.', 'Mostek biodrowy 3×12.'], ['ql', 'Boczna stabilizacja tułowia.', 'Boczna deska (na kolanach lub na stopach) 3×20–30 s.']],
    roz: [['tfl', 'Rozciąganie bocznej strony uda: skrzyżuj nogi, przechyl tułów w bok 30 s na stronę (bez bólu).'], ['piriformis', 'Figura „4” w leżeniu 30–45 s na stronę.'], ['vastlat', 'Delikatny masaż wałkiem po zewnętrznej stronie uda (bez bólu na krętarzu).']],
    alarm: ['Ból po upadku/urazie lub niemożność obciążenia nogi', 'Gorączka, zaczerwienienie lub obrzęk biodra', 'Ból nocny niezmieniony mimo zmiany pozycji', 'Drętwienie lub osłabienie nogi'],
  },
  {
    id: 'gruszkowaty', ex: 'Ból pośladka przy siedzeniu, promieniuje do nogi',
    kw: [['gruszk|rwa |kulszow|promieniuj|noga drewn|dretw\\w* nog|posladk\\w* .{0,20}bol|bol \\w* posladk', 2], ['siedz|samochod|roweru', 1], ['posladk', 1]],
    poz: 'Siedzenie z bólem pośladka (okolica m. gruszkowatego)', okolica: 'Głęboki pośladek i tył uda', widok: 'tyl',
    pods: 'M. gruszkowaty i inne rotatory zewnętrzne biodra leżą tuż nad nerwem kulszowym. Ich napięcie (a także dysfunkcja okolicy krzyżowo-lędźwiowej) może powodować ból głębokiego pośladka z promieniowaniem do uda.',
    m: [['piriformis', 'k', 24, 'Napięty i skrócony przy siedzeniu, ucisk na n. kulszowy'], ['glutmax', 'r', 14, 'Rozciągnięty i obciążony ciężarem ciała'], ['glutmed', 'i', 10, 'Tylne włókna pomagają stabilizować miednicę'], ['gemelli', 'k', 8, 'Rotatory zewnętrzne, współpracują z m. gruszkowatym'], ['obtint', 'k', 7, 'Rotator zewnętrzny uda'], ['qfem', 'k', 5, 'Rotator zewnętrzny, stabilizuje staw biodrowy'], ['glutmin', 'i', 6, 'Stabilizacja stawu biodrowego'], ['bicfem', 'k', 8, 'Napięte tylne uda zwiększają napięcie okolicy'], ['ql', 'i', 6, 'Przeciążony przy asymetrii miednicy'], ['multifidus', 'i', 6, 'Stabilizacja okolicy krzyżowo-lędźwiowej', 'lumborum'], ['iliopsoas', 'k', 6, 'Skrócony w siedzeniu']],
    przyczyny: [['Zespół mięśnia gruszkowatego (napięcie uciskające n. kulszowy)', 'Ból głębokiego pośladka nasila się po dłuższym siedzeniu i przy rotacji biodra.'], ['Rwa kulszowa z kręgosłupa lędźwiowego (L4–S1)', 'Objawy bywają podobne — decyduje badanie lekarskie/fizjoterapeutyczne; ból zwykle schodzi poniżej kolana.'], ['Dysfunkcja stawu krzyżowo-biodrowego', 'Ból bocznie od kości krzyżowej, nasila się przy zmianie pozycji.']],
    osl: [['glutmax', 'Słabe pośladki wielkie → przeciążone rotatory.', 'Mostek biodrowy 3×12, 2 s napięcia.'], ['glutmed', 'Stabilizacja miednicy odciąża głębokie rotatory.', 'Odwodzenie nogi w leżeniu bokiem 3×15.'], ['transabd', 'Stabilizacja miednicy od środka.', 'Dead bug 3×8.']],
    roz: [['piriformis', 'Figura „4” w leżeniu lub przyciągnięcie kolana do przeciwległego barku: 30–45 s na stronę (bez nasilania promieniowania).'], ['gemelli', 'Jak wyżej; piłka do masażu pod pośladkiem 1–2 min, bez bólu ostrego.'], ['bicfem', 'Rozciąganie tylnej strony uda z pasem: 30–45 s.']],
    alarm: ['Drętwienie, osłabienie stopy lub „opadanie” stopy', 'Zaburzenia kontroli pęcherza lub stolca, drętwienie krocza — pilnie do lekarza', 'Ból nocny, gorączka, ból po urazie'],
  },
  {
    id: 'kark', ex: 'Ból karku i szyi po pracy przy komputerze i telefonie',
    kw: [['kark|szyj|text neck|telefon|smartfon|ekran', 2], ['komputer|glow\\w* .{0,15}przod|pochyl', 1], ['barki|ramion|bol glowy|potyl', 1]],
    poz: 'Pochylona głowa nad ekranem (tzw. text neck)', okolica: 'Kark i szyja', widok: 'tyl',
    pods: 'Głowa wysunięta do przodu zwiększa efektywny ciężar, który muszą utrzymać prostowniki karku. Górny trapez i dźwigacz łopatki zaciskają się z przeciążenia, a głębokie zginacze szyi słabną.',
    m: [['trapezius', 'i', 16, 'Część zstępująca utrzymuje łopatki i głowę'], ['levator', 'i', 13, 'Napięty przy pochyleniu głowy i uniesionych barkach'], ['splcap', 'c', 10, 'Utrzymuje głowę przeciwko grawitacji'], ['splcerv', 'c', 8, 'Jak wyżej (szyja)'], ['semicerv', 'c', 8, 'Głęboki prostownik szyi'], ['multcerv', 'i', 4, 'Stabilizacja segmentów szyi'], ['rcap_pmaj', 'c', 5, 'Mięśnie podpotyliczne utrzymują ustawienie głowy'], ['rcap_pmin', 'c', 3, 'Jak wyżej'], ['oblsup', 'c', 3, 'Jak wyżej'], ['scm', 'i', 6, 'Napięty przy wysuniętej głowie'], ['scaleneb', 'i', 4, 'Pomocniczy przy oddychaniu i stabilizacji szyi'], ['longuscolli', 'r', 5, 'Głęboki zginacz szyi: słabnie, bo jest rozciągnięty'], ['rhomboids', 'r', 5, 'Rozciągane przy zaokrąglonych barkach'], ['pecminor', 'k', 5, 'Skrócony, ciągnie łopatki do przodu']],
    przyczyny: [['Przeciążenie górnego trapeza i dźwigacza łopatki (napięcie statyczne)', 'Skutek utrzymywania głowy w wysunięciu do przodu przez wiele godzin.'], ['Osłabienie głębokich zginaczy szyi (m. długi szyi)', 'Mięsień stabilizujący szyję przy pochylaniu — gdy słaby, więcej pracują powierzchowne mięśnie.'], ['Zaokrąglone barki / skrócony piersiowy mniejszy', 'Przesuwa łopatki do przodu i zwiększa obciążenie karku.']],
    osl: [['longuscolli', 'Głębokie zginacze szyi słabną przy pochylonej głowie.', 'Chin tuck: 10×10 s leżąc lub siedząc („podwójny podbródek”), bez unoszenia głowy.'], ['rhomboids', 'Cofnięcie łopatek odciąża kark.', 'Wiosłowanie z gumą 3×12 lub „W” na ścianie 3×10.'], ['serratus', 'Stabilizuje łopatkę przy pracy rąk przed sobą.', 'Wall slides lub pompka z ruchem łopatek (plus) 3×10.'], ['trapezius', 'Dolna i środkowa część trapeza „odpuszczają” zaciśnięty górny.', 'Prostowanie ramion w opadzie tułowia („Y” i „T”) 3×8.']],
    roz: [['levator', 'Pochyl głowę w bok i lekko w kierunku pachy, ręka na głowie: 30 s na stronę, bez bólu.'], ['trapezius', 'Opuszczenie barku z pochyleniem głowy w drugą stronę: 30 s na stronę.'], ['scm', 'Delikatny skręt i odchylenie głowy: 20–30 s na stronę, tylko do lekkiego rozciągnięcia.'], ['pecminor', 'Rozciąganie w progu drzwi (łokcie na wysokości barków): 30 s.']],
    alarm: ALARM_SZYJA,
  },
  {
    id: 'bark_lopatki', ex: 'Ból między łopatkami i zaokrąglone, wysunięte do przodu barki',
    kw: [['miedzy lopatk|zaokragl|garb|przygarb|barki do przodu|barki wysuni|kifoz|kyfoz|gorna cz\\w* plec', 2], ['bark|lopatk|plec', 1]],
    poz: 'Zaokrąglone barki (postawa siedząca / kyfotyczna)', okolica: 'Górna część pleców i łopatki', widok: 'tyl',
    pods: 'Wysunięte do przodu barki skracają mięśnie piersiowe, a mięśnie między łopatkami (równoległoboczne, środkowy i dolny trapez) są rozciągnięte i osłabione — bolą „z przeciążenia na rozciągnięciu”.',
    m: [['rhomboids', 'r', 18, 'Rozciągnięte i osłabione przy wysuniętych barkach'], ['trapezius', 'r', 16, 'Część środkowa i dolna rozciągnięta, górna napięta'], ['serratus', 'i', 8, 'Stabilizuje łopatkę na klatce piersiowej'], ['pecminor', 'k', 14, 'Skrócony, ciągnie łopatkę do przodu i w dół'], ['pecmajor', 'k', 10, 'Skrócony, obraca ramię do wewnątrz'], ['levator', 'i', 6, 'Napięty przy uniesionych barkach'], ['longissimus', 'i', 6, 'Prostownik odcinka piersiowego utrzymuje tułów'], ['infraspinatus', 'r', 6, 'Rozciągnięty przy rotacji wewnętrznej ramion'], ['teresminor', 'r', 4, 'Jak wyżej'], ['deltoid', 'i', 4, 'Utrzymuje ramiona przed sobą'], ['latissimus', 'k', 4, 'Skrócony, pogłębia zaokrąglenie']],
    przyczyny: [['Osłabienie i rozciągnięcie mięśni międzyłopatkowych', 'Bolą, bo stale pracują na rozciągnięciu, nie bo są „za krótkie”.'], ['Skrócenie mięśni piersiowych', 'Ciągną barki do przodu, nasilając postawę zgarbioną.'], ['Przeciążenie stawów żebrowo-kręgowych', 'Ból punktowy między łopatkami, nasilający się przy oddychaniu — warto zbadać.']],
    osl: [['rhomboids', 'Przyciągają łopatki do kręgosłupa.', 'Wiosłowanie z gumą 3×12, ściśnięcie łopatek 5 s.'], ['trapezius', 'Środkowa i dolna część trapeza prostują postawę.', '„Y” i „T” w opadzie lub leżeniu przodem 3×8.'], ['serratus', 'Stabilizuje łopatkę.', 'Pompka z ruchem łopatek 3×10.'], ['infraspinatus', 'Rotacja zewnętrzna ramienia otwiera klatkę.', 'Rotacja zewnętrzna z gumą 3×12 (łokcie przy tułowiu).']],
    roz: [['pecminor', 'Rozciąganie w progu drzwi: 30 s, łokcie nieco niżej niż barki.'], ['pecmajor', 'Rozciąganie w progu drzwi z rękami wyżej: 30 s.'], ['latissimus', 'Zwis na drążku lub „pozycja dziecka” z rękami przed sobą: 30 s.']],
    alarm: ['Ból w klatce piersiowej z dusznością lub promieniujący do ręki/żuchwy — wezwij pomoc', 'Osłabienie rąk lub drętwienie', 'Ból nocny, gorączka lub ból po urazie'],
  },
  {
    id: 'lokiec', ex: 'Ból po zewnętrznej stronie łokcia przy chwytaniu i pracy myszką',
    kw: [['lokie|tenisist|chwyt|nadgarst|mysz|zewnetrzn\\w* lokcia|prostownik\\w* nadgarst|przedramie', 2], ['bol|napiec|boli', 1]],
    poz: 'Chwyt i praca nadgarstkiem (okolica nadkłykcia bocznego)', okolica: 'Zewnętrzna strona łokcia i przedramię', widok: 'bok',
    pods: 'Wspólne ścięgno prostowników przedramienia przyczepia się do nadkłykcia bocznego kości ramiennej. Powtarzalny chwyt i praca nadgarstkiem przeciążają je (łokieć tenisisty), a głównie m. prostownik promieniowy krótki nadgarstka.',
    m: [['ecrb', 'c', 24, 'Najczęściej przeciążany: stabilizuje nadgarstek przy chwycie'], ['ed', 'c', 14, 'Prostownik palców — wspólny przyczep'], ['ecrl', 'c', 12, 'Prostownik promieniowy długi nadgarstka'], ['ecu', 'i', 7, 'Stabilizuje nadgarstek od strony łokciowej'], ['supinator', 'c', 6, 'Odwraca przedramię; leży pod prostownikami'], ['brachioradialis', 'i', 7, 'Pomaga w zgięciu łokcia przy chwycie'], ['fcr', 'i', 4, 'Antagonista; współpracuje przy chwycie'], ['fcu', 'i', 4, 'Jak wyżej'], ['fds', 'c', 5, 'Zginacz palców przy chwycie'], ['fdp', 'c', 4, 'Jak wyżej'], ['pronatorteres', 'i', 5, 'Stabilizuje przedramię'], ['triceps', 'i', 4, 'Stabilizuje łokieć'], ['biceps', 'i', 4, 'Stabilizuje łokieć']],
    przyczyny: [['Przeciążenie wspólnego ścięgna prostowników (łokieć tenisisty)', 'Częsty przy powtarzalnej pracy ręką i mocnym chwycie, niekoniecznie przy tenisie.'], ['Osłabienie stabilizatorów barku i łopatki', 'Brak „fundamentu” przerzuca obciążenie na przedramię.'], ['Ucisk nerwu promieniowego na przedramieniu (rzadziej)', 'Daje ból i drętwienie przedramienia, nie tylko przy chwycie.']],
    osl: [['ecrb', 'Mocne prostowniki nadgarstka znoszą większe obciążenie.', 'Ćwiczenie ekscentryczne: wolne opuszczanie nadgarstka z lekkim ciężarkiem 3×12–15, 1 raz dziennie.'], ['supinator', 'Pracuje w odwracaniu przedramienia.', 'Obroty przedramienia z lekkim młotkiem/hantlem 3×12.'], ['serratus', 'Stabilność łopatki odciąża łokieć.', 'Wall slides 3×10.'], ['trapezius', 'Silne łopatki = mniej przeciążenia dalszych odcinków.', 'Wiosłowanie z gumą 3×12.']],
    roz: [['ecrb', 'Wyprost łokcia, nadgarstek zgięty w dół (grzbiet dłoni do siebie): 30 s, 3 razy.'], ['ed', 'Jak wyżej, z zaciśniętą pięścią: 20–30 s.'], ['ecrl', 'Wyprost łokcia, nadgarstek zgięty łokciowo: 20–30 s.'], ['supinator', 'Delikatne nawracanie przedramienia z lekkim naciskiem: 20–30 s.']],
    alarm: ALARM_REKA,
  },
  {
    id: 'deska', ex: 'Ból w lędźwiach w pozycji deski (plank) i podczas pompek',
    kw: [['desk|plank|pompk|podpor|podporz', 2], ['ledzw|krzyz|brzuch|miednic', 1]],
    poz: 'Deska (plank) — podpór przodem', okolica: 'Lędźwie i brzuch', widok: 'bok',
    pods: 'W desce brzuch, pośladki i mięśnie łopatek utrzymują ciało jak „most”. Gdy miednica opada w lordozę, a pośladki i brzuch się poddają, ciężar przechodzi na lędźwia i je przeciąża.',
    m: [['rectabd', 'i', 15, 'Przeciwdziała opadaniu miednicy'], ['transabd', 'i', 14, 'Napina brzuch i stabilizuje lędźwie'], ['extobl', 'i', 10, 'Utrzymuje tułów w osi'], ['intobl', 'i', 10, 'Jak wyżej'], ['glutmax', 'i', 8, 'Utrzymuje wyprost bioder'], ['iliopsoas', 'i', 6, 'Hamuje wyprost; często przejmuje pracę brzucha'], ['rectfem', 'i', 6, 'Utrzymuje kolana prosto'], ['serratus', 'i', 7, 'Stabilizuje łopatki'], ['pecmajor', 'i', 4, 'Pomaga przy podporze na rękach'], ['deltoid', 'i', 5, 'Utrzymuje ramiona'], ['multifidus', 'i', 6, 'Stabilizacja segmentowa', 'lumborum'], ['ql', 'i', 5, 'Stabilizuje miednicę']],
    przyczyny: [['Opadanie miednicy (nadmierna lordoza) z osłabienia brzucha i pośladków', 'Lędźwia dźwigają ciężar zamiast brzucha i pośladków.'], ['Przykurcz zginaczy bioder', 'Ciągnie miednicę do przodu i pogłębia lordozę.'], ['Zbyt długi czas utrzymania pozycji', 'Zmęczenie mięśni stabilizujących → utrata techniki → ból.']],
    osl: [['transabd', 'Utrzymuje „gorset” brzucha.', 'Dead bug 3×8 na stronę; w desce — wdech i napięcie brzucha „do kręgosłupa”.'], ['glutmax', 'Utrzymuje miednicę w osi.', 'Mostek biodrowy 3×12; w desce ściśnij pośladki.'], ['serratus', 'Stabilizuje łopatki w podporze.', 'Plank plus: 3×8 ruchów łopatek.'], ['rectabd', 'Przeciwdziała zapadaniu miednicy.', 'Deska na łokciach z krótszym czasem: 5×15–20 s z przerwami (jakość > czas).']],
    roz: [['iliopsoas', 'Wykrok w klęku podpartym: 2×30–45 s na stronę.'], ['rectfem', 'Rozciąganie przodu uda w leżeniu bokiem: 30–45 s na stronę.'], ['iliocostalis', 'Delikatna pozycja dziecka po treningu: 5–8 powolnych oddechów.']],
    alarm: ALARM_LEDZ,
  },
];

export const EXAMPLES = SCEN.map((s) => ({ id: s.id, text: s.ex }));
for (const s of SCEN) s.rx = s.kw.map(([r, w]) => [new RegExp(r), w]);

export function sideHint(q) {
  const t = norm(q), r = /\bpraw(y|a|e|ej|ego|ym|ą)\b/.test(t) || /\bprawy|prawa|prawej|prawego|prawym\b/.test(t), l = /\blew(y|a|e|ej|ego|ym|ą)\b/.test(t) || /\blewy|lewa|lewej|lewego|lewym\b/.test(t);
  return r && !l ? 'r' : l && !r ? 'l' : 'b';
}

// zwraca { res, score } lub null
export function matchLocal(q) {
  const t = norm(q); if (t.length < 5) return null;
  let best = null;
  for (const s of SCEN) { let sc = 0; for (const [rx, w] of s.rx) if (rx.test(t)) sc += w; if (sc >= 2 && (!best || sc > best.score)) best = { s, score: sc }; }
  if (!best) return null;
  const s = best.s;
  return { score: best.score, res: { src: 'wzorzec', id: s.id, pozycja: s.poz, podsumowanie: s.pods, okolica: s.okolica, widok: s.widok, miesnie: s.m.map(([k, tr, w, o, pp]) => ({ k, tryb: tr, pct: w, opis: o, p: pp || '' })), przyczyny: s.przyczyny.map(([t1, d]) => ({ t: t1, dlaczego: d })), oslabione: s.osl.map(([k, d, c]) => ({ k, dlaczego: d, cwiczenie: c })), rozciagac: s.roz.map(([k, j]) => ({ k, jak: j })), alarm: s.alarm } };
}

// ujednolica wynik (wzorzec lub AI): usuwa nieznane klucze, normalizuje % do 100, wylicza rolę
export function normalize(r, has) {
  const out = { src: r.src || 'ai', id: r.id, pozycja: String(r.pozycja || 'Analiza').slice(0, 140), podsumowanie: String(r.podsumowanie || '').slice(0, 700), okolica: String(r.okolica || '').slice(0, 80), widok: ['przod', 'tyl', 'bok'].includes(r.widok) ? r.widok : 'tyl' };
  const seen = new Set(); let ms = [];
  for (const m of r.miesnie || []) { if (!m || !has(m.k) || seen.has(m.k)) continue; seen.add(m.k); ms.push({ k: m.k, tryb: ['c', 'i', 'r', 'k'].includes(m.tryb) ? m.tryb : { czynny: 'c', izometryczny: 'i', rozciagany: 'r', skrocony: 'k' }[m.tryb] || (m.rola === 'rozciagany' ? 'r' : 'c'), pct: Math.max(0.5, +m.pct || 1), opis: String(m.opis || '').slice(0, 140), p: /^[a-z|]{0,40}$/i.test(m.p || '') ? m.p || '' : '' }); }
  ms = ms.slice(0, 16); const sum = ms.reduce((a, m) => a + m.pct, 0) || 1;
  let acc = 0; ms.forEach((m) => { m.pct = Math.round((m.pct / sum) * 100); acc += m.pct; });
  if (ms.length) { ms.sort((a, b) => b.pct - a.pct); ms[0].pct += 100 - acc; }
  ms.forEach((m) => { m.rola = roleOf(m.pct); });
  out.miesnie = ms;
  out.przyczyny = (r.przyczyny || []).slice(0, 4).map((x) => ({ t: String(x.t || '').slice(0, 160), dlaczego: String(x.dlaczego || '').slice(0, 280) })).filter((x) => x.t);
  out.oslabione = (r.oslabione || []).filter((x) => x && has(x.k)).slice(0, 5).map((x) => ({ k: x.k, dlaczego: String(x.dlaczego || '').slice(0, 220), cwiczenie: String(x.cwiczenie || '').slice(0, 220) }));
  out.rozciagac = (r.rozciagac || []).filter((x) => x && has(x.k)).slice(0, 5).map((x) => ({ k: x.k, jak: String(x.jak || '').slice(0, 220) }));
  out.alarm = (r.alarm || []).slice(0, 4).map((x) => String(x).slice(0, 200));
  return out;
}
