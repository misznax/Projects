# -*- coding: utf-8 -*-
# Treści: nazwy polskie (nazwa główna) + łacińskie (Terminologia Anatomica), opisy. Klucze = nazwy angielskie z Z-Anatomy (bez sufiksu strony).
# Format kości: en -> (pl, la, opis)
BONES = {
 'Clavicle': ('Obojczyk','Clavicula','Esowato wygięta kość łącząca mostek z wyrostkiem barkowym łopatki; jedyne kostne połączenie kończyny górnej z tułowiem.'),
 'Scapula': ('Łopatka','Scapula','Płaska, trójkątna kość leżąca na tylnej ścianie klatki piersiowej (żebra II–VII); tworzy panewkę stawu ramiennego i jest miejscem przyczepu wielu mięśni.'),
 'Humerus': ('Kość ramienna','Humerus','Jedyna kość ramienia; głowa tworzy staw ramienny, bloczek i główeczka — staw łokciowy.'),
 'Radius': ('Kość promieniowa','Radius','Kość boczna (kciukowa) przedramienia; wraz z kością łokciową umożliwia nawracanie i odwracanie.'),
 'Ulna': ('Kość łokciowa','Ulna','Kość przyśrodkowa (po stronie małego palca) przedramienia; wyrostek łokciowy tworzy „czubek łokcia”.'),
 'Scaphoid bone': ('Kość łódeczkowata','Os scaphoideum','Największa kość bliższego szeregu nadgarstka po stronie promieniowej; najczęściej łamana kość nadgarstka.'),
 'Lunate bone': ('Kość księżycowata','Os lunatum','Środkowa kość bliższego szeregu nadgarstka; styka się z kością promieniową.'),
 'Triquetrum bone': ('Kość trójgraniasta','Os triquetrum','Kość bliższego szeregu nadgarstka po stronie łokciowej.'),
 'Pisiform bone': ('Kość grochowata','Os pisiforme','Mała kość trzeszczkowata w ścięgnie mięśnia zginacza łokciowego nadgarstka.'),
 'Trapezium bone': ('Kość czworoboczna większa','Os trapezium','Kość dalszego szeregu nadgarstka; tworzy staw kciuka (nadgarstkowo-śródręczny).'),
 'Trapezoid bone': ('Kość czworoboczna mniejsza','Os trapezoideum','Mała kość dalszego szeregu nadgarstka, articuluje z kością śródręcza II.'),
 'Capitate bone': ('Kość główkowata','Os capitatum','Największa kość nadgarstka, w jego centrum; łączy się z kością śródręcza III.'),
 'Hamate bone': ('Kość haczykowata','Os hamatum','Kość dalszego szeregu nadgarstka z wystającym haczykiem; łączy się z kośćmi śródręcza IV i V.'),
 'Manubrium of sternum': ('Rękojeść mostka','Manubrium sterni','Górna część mostka; łączy się z obojczykami i chrząstką żebra I.'),
 'Body of sternum': ('Trzon mostka','Corpus sterni','Środkowa część mostka; miejsce przyczepu mięśnia piersiowego większego.'),
 'Xiphoid process': ('Wyrostek mieczykowaty','Processus xiphoideus','Dolny, chrzęstny (z wiekiem kostniejący) koniec mostka.'),
}
NUM = ['I','II','III','IV','V']
ORD = {'First':1,'Second':2,'Third':3,'Fourth':4,'Fifth':5,'Sixth':6,'Seventh':7,'Eighth':8,'Ninth':9,'Tenth':10,'Eleventh':11,'Twelfth':12}
ROMAN = ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII']
FINGER = {'first':('kciuka','I','pollicis'), 'second':('palca wskazującego','II','indicis'), 'third':('palca środkowego','III','medii'), 'fourth':('palca serdecznego','IV','annularis'), 'fifth':('palca małego','V','minimi')}

# Punkty kostne (landmarki): en -> (pl, la, opis opcjonalny)
LM = {
 # łopatka
 'Acromial angle':('Kąt barkowy','Angulus acromialis','Miejsce przejścia grzebienia łopatki w wyrostek barkowy.'),
 'Acromion':('Wyrostek barkowy','Acromion','Przedłużenie grzebienia łopatki; tworzy „czubek barku”, początek części barkowej m. naramiennego.'),
 'Clavicular facet':('Powierzchnia stawowa obojczykowa','Facies articularis clavicularis','Powierzchnia stawu barkowo-obojczykowego na wyrostku barkowym.'),
 'Coracoid process':('Wyrostek kruczy','Processus coracoideus','Haczykowaty wyrostek; przyczep m. piersiowego mniejszego, kruczo-ramiennego i krótkiej głowy m. dwugłowego.'),
 'Costal surface of scapula':('Powierzchnia żebrowa łopatki','Facies costalis scapulae','Przednia (przyżebrowa) powierzchnia łopatki z dołem podłopatkowym.'),
 'Deltoid tubercle':('Guzek naramienny','Tuberculum deltoideum','Guzek na grzebieniu łopatki — miejsce przyczepu m. naramiennego.'),
 'Glenoid fossa':('Panewka stawu ramiennego','Cavitas glenoidalis','Płytka panewka, w której spoczywa głowa kości ramiennej.'),
 'Glenoid process of scapula':('Okolica panewki łopatki','Processus glenoidalis scapulae',''),
 'Inferior angle of scapula':('Kąt dolny łopatki','Angulus inferior','Dolny róg łopatki; początek m. obłego większego, przyczep m. najszerszego grzbietu (pęczek łopatkowy).'),
 'Infraglenoid tubercle':('Guzek podpanewkowy','Tuberculum infraglenoidale','Początek głowy długiej m. trójgłowego ramienia.'),
 'Infraspinous fossa':('Dół podgrzebieniowy','Fossa infraspinata','Początek m. podgrzebieniowego.'),
 'Lateral angle of scapula':('Kąt boczny łopatki','Angulus lateralis','Zgrubiały róg łopatki z panewką stawową.'),
 'Lateral border of scapula':('Brzeg boczny łopatki','Margo lateralis','Początek m. obłego mniejszego i większego.'),
 'Medial border of scapula':('Brzeg przyśrodkowy łopatki','Margo medialis','Przyczep m. równoległobocznych, dźwigacza łopatki i zębatego przedniego.'),
 'Neck of scapula':('Szyjka łopatki','Collum scapulae','Zwężenie tuż poniżej panewki.'),
 'Posterior surface of scapula':('Powierzchnia tylna łopatki','Facies posterior scapulae','Powierzchnia z grzebieniem łopatki, dołem nad- i podgrzebieniowym.'),
 'Scapular notch':('Wcięcie łopatki','Incisura scapulae','Wcięcie w górnym brzegu, nad którym przebiega więzadło poprzeczne górne łopatki; pod nim przechodzi n. nadłopatkowy.'),
 'Spine of scapula':('Grzebień łopatki','Spina scapulae','Poprzeczny wał na tylnej powierzchni łopatki; rozdziela dół nad- i podgrzebieniowy.'),
 'Spinoglenoid notch':('Wcięcie podgrzebieniowe','Incisura spinoglenoidalis','Przejście n. nadłopatkowego do dołu podgrzebieniowego.'),
 'Subscapular fossa':('Dół podłopatkowy','Fossa subscapularis','Początek m. podłopatkowego.'),
 'Superior angle of scapula':('Kąt górny łopatki','Angulus superior','Przyczep m. dźwigacza łopatki.'),
 'Superior border of scapula':('Brzeg górny łopatki','Margo superior','Górny brzeg łopatki z wcięciem łopatki; początek brzuśca dolnego m. łopatkowo-gnykowego.'),
 'Supraglenoid tubercle':('Guzek nadpanewkowy','Tuberculum supraglenoidale','Początek głowy długiej m. dwugłowego ramienia.'),
 'Supraspinous fossa':('Dół nadgrzebieniowy','Fossa supraspinata','Początek m. nadgrzebieniowego.'),
 # obojczyk
 'Acromial end':('Koniec barkowy obojczyka','Extremitas acromialis','Koniec boczny obojczyka, łączy się z wyrostkiem barkowym.'),
 'Acromial facet':('Powierzchnia stawowa barkowa','Facies articularis acromialis','Powierzchnia stawu barkowo-obojczykowego na obojczyku.'),
 'Body of clavicle':('Trzon obojczyka','Corpus claviculae',''),
 'Conoid tubercle':('Guzek stożkowaty','Tuberculum conoideum','Przyczep więzadła stożkowatego (część więzadła kruczo-obojczykowego).'),
 'Groove for subclavius muscle':('Bruzda mięśnia podobojczykowego','Sulcus musculi subclavii','Przyczep m. podobojczykowego na dolnej powierzchni obojczyka.'),
 'Impression for costoclavicular ligament':('Wycisk więzadła żebrowo-obojczykowego','Impressio ligamenti costoclavicularis','Przyczep więzadła łączącego obojczyk z I żebrem.'),
 'Sternal articular surface':('Powierzchnia stawowa mostkowa','Facies articularis sternalis','Powierzchnia stawu mostkowo-obojczykowego.'),
 'Sternal end':('Koniec mostkowy obojczyka','Extremitas sternalis','Koniec przyśrodkowy obojczyka, łączy się z rękojeścią mostka.'),
 'Trapezoid line':('Kresa czworoboczna','Linea trapezoidea','Przyczep więzadła czworobocznego (część więzadła kruczo-obojczykowego).'),
 'Tuberosity for coracoclavicular ligament':('Guzowatość więzadła kruczo-obojczykowego','Tuberositas ligamenti coracoclavicularis',''),
 # ramienna
 'Anatomical neck of humerus':('Szyjka anatomiczna kości ramiennej','Collum anatomicum','Linia oddzielająca głowę od guzków; przyczep torebki stawowej.'),
 'Anterior border of humerus':('Brzeg przedni kości ramiennej','Margo anterior humeri',''),
 'Anterolateral surface of humerus':('Powierzchnia przednio-boczna kości ramiennej','Facies anterolateralis humeri','Z guzowatością naramienną; początek m. ramiennego.'),
 'Anteromedial surface of humerus':('Powierzchnia przednio-przyśrodkowa kości ramiennej','Facies anteromedialis humeri','Przyczep m. kruczo-ramiennego; początek m. ramiennego.'),
 'Body of humerus':('Trzon kości ramiennej','Corpus humeri',''),
 'Capitulum of humerus':('Główeczka kości ramiennej','Capitulum humeri','Kulista powierzchnia stawowa dla głowy kości promieniowej.'),
 'Condyle of humerus':('Kłykieć kości ramiennej','Condylus humeri','Dystalna powierzchnia stawowa: główeczka i bloczek.'),
 'Coronoid fossa':('Dół wieńcowy','Fossa coronoidea','Zagłębienie na przedniej powierzchni; przyjmuje wyrostek dziobiasty przy zgięciu łokcia.'),
 'Crest of greater tubercle':('Grzebień guzka większego','Crista tuberculi majoris','Przyczep m. piersiowego większego.'),
 'Crest of lesser tubercle':('Grzebień guzka mniejszego','Crista tuberculi minoris','Przyczep m. najszerszego grzbietu i obłego większego.'),
 'Deltoid tuberosity':('Guzowatość naramienna','Tuberositas deltoidea','Przyczep końcowy m. naramiennego.'),
 'Greater tubercle':('Guzek większy','Tuberculum majus','Przyczep m. nadgrzebieniowego, podgrzebieniowego i obłego mniejszego.'),
 'Groove for ulnar nerve':('Bruzda nerwu łokciowego','Sulcus nervi ulnaris','Za nadkłykciem przyśrodkowym („kość łokciowa” — miejsce, gdzie nerw łatwo uderzyć).'),
 'Head of humerus':('Głowa kości ramiennej','Caput humeri','Kulista powierzchnia stawowa stawu ramiennego.'),
 'Intertubercular sulcus':('Bruzda międzyguzkowa','Sulcus intertubercularis','Przebiega w niej ścięgno głowy długiej m. dwugłowego ramienia.'),
 'Lateral border of humerus':('Brzeg boczny kości ramiennej','Margo lateralis humeri',''),
 'Lateral epicondyle of humerus':('Nadkłykieć boczny kości ramiennej','Epicondylus lateralis humeri','Wspólny początek prostowników przedramienia.'),
 'Lateral supracondylar ridge':('Grzebień nadkłykciowy boczny','Crista supracondylaris lateralis','Początek m. ramienno-promieniowego i prostownika promieniowego długiego nadgarstka.'),
 'Lesser tubercle':('Guzek mniejszy','Tuberculum minus','Przyczep m. podłopatkowego.'),
 'Medial border of humerus':('Brzeg przyśrodkowy kości ramiennej','Margo medialis humeri',''),
 'Medial epicondyle of humerus':('Nadkłykieć przyśrodkowy kości ramiennej','Epicondylus medialis humeri','Wspólny początek zginaczy przedramienia.'),
 'Medial supracondylar ridge':('Grzebień nadkłykciowy przyśrodkowy','Crista supracondylaris medialis',''),
 'Olecranon fossa':('Dół wyrostka łokciowego','Fossa olecrani','Zagłębienie na tylnej powierzchni; przyjmuje wyrostek łokciowy przy wyproście łokcia.'),
 'Posterior surface of humerus':('Powierzchnia tylna kości ramiennej','Facies posterior humeri','Początek głowy bocznej i przyśrodkowej m. trójgłowego.'),
 'Radial fossa':('Dół promieniowy','Fossa radialis','Przyjmuje głowę kości promieniowej przy zgięciu łokcia.'),
 'Radial groove':('Bruzda nerwu promieniowego','Sulcus nervi radialis','Spiralna bruzda na tylnej powierzchni trzonu; przebiega w niej n. promieniowy.'),
 'Surgical neck of humerus':('Szyjka chirurgiczna','Collum chirurgicum','Poniżej guzków; częste miejsce złamań.'),
 'Trochlea of humerus':('Bloczek kości ramiennej','Trochlea humeri','Powierzchnia stawowa dla wcięcia bloczkowego kości łokciowej.'),
 # promieniowa
 'Anterior border of radius':('Brzeg przedni kości promieniowej','Margo anterior radii',''),
 'Anterior surface of radius':('Powierzchnia przednia kości promieniowej','Facies anterior radii','Początek m. zginacza długiego kciuka i nawrotnego czworobocznego.'),
 'Articular circumference of head of radius':('Obwód stawowy głowy kości promieniowej','Circumferentia articularis radii','Powierzchnia stawu promieniowo-łokciowego bliższego.'),
 'Articular facet of head of radius':('Dołek stawowy głowy kości promieniowej','Fovea articularis capitis radii','Powierzchnia stawowa dla główeczki kości ramiennej.'),
 'Body of radius':('Trzon kości promieniowej','Corpus radii',''),
 'Carpal articular surface':('Powierzchnia stawowa nadgarstkowa','Facies articularis carpalis','Powierzchnia stawu promieniowo-nadgarstkowego (kość łódeczkowata i księżycowata).'),
 'Dorsal radial tubercle':('Guzek grzbietowy (guzek Listera)','Tuberculum dorsale (Listeri)','Bloczek dla ścięgna m. prostownika długiego kciuka.'),
 'Grooves for extensor tendons':('Bruzdy ścięgien prostowników','Sulci tendinum musculorum extensorum','Bruzdy na grzbietowej stronie dalszego końca kości promieniowej.'),
 'Head of radius':('Głowa kości promieniowej','Caput radii','Okrągła głowa; obraca się w więzadle pierścieniowym podczas nawracania i odwracania.'),
 'Interosseous border of radius':('Brzeg międzykostny kości promieniowej','Margo interosseus radii','Przyczep błony międzykostnej przedramienia.'),
 'Lateral surface of radius':('Powierzchnia boczna kości promieniowej','Facies lateralis radii','Przyczep m. nawrotnego obłego.'),
 'Neck of radius':('Szyjka kości promieniowej','Collum radii',''),
 'Posterior border of radius':('Brzeg tylny kości promieniowej','Margo posterior radii',''),
 'Posterior surface of radius':('Powierzchnia tylna kości promieniowej','Facies posterior radii','Początek m. odwodziciela długiego i prostownika krótkiego kciuka.'),
 'Pronator tuberosity':('Guzowatość nawrotna','Tuberositas pronatoria','Przyczep m. nawrotnego obłego na powierzchni bocznej trzonu.'),
 'Radial styloid process':('Wyrostek rylcowaty kości promieniowej','Processus styloideus radii','Dalszy koniec kości; przyczep m. ramienno-promieniowego.'),
 'Radial tuberosity':('Guzowatość kości promieniowej','Tuberositas radii','Przyczep końcowy m. dwugłowego ramienia.'),
 'Suprastyloid crest':('Grzebień nadrylcowy','Crista suprastyloidea',''),
 'Ulnar notch':('Wcięcie łokciowe','Incisura ulnaris radii','Powierzchnia stawu promieniowo-łokciowego dalszego.'),
 # łokciowa
 'Anterior border of ulna':('Brzeg przedni kości łokciowej','Margo anterior ulnae',''),
 'Articular circumference of head of ulna':('Obwód stawowy głowy kości łokciowej','Circumferentia articularis ulnae','Powierzchnia stawu promieniowo-łokciowego dalszego.'),
 'Body of ulna':('Trzon kości łokciowej','Corpus ulnae',''),
 'Coronoid process of ulna':('Wyrostek dziobiasty','Processus coronoideus ulnae','Przyczep m. ramiennego i początek m. nawrotnego obłego (głowa łokciowa).'),
 'Head of ulna':('Głowa kości łokciowej','Caput ulnae','Dalszy koniec kości łokciowej.'),
 'Interosseous border of ulna':('Brzeg międzykostny kości łokciowej','Margo interosseus ulnae','Przyczep błony międzykostnej.'),
 'Medial surface of ulna':('Powierzchnia przyśrodkowa kości łokciowej','Facies medialis ulnae','Początek m. zginacza głębokiego palców.'),
 'Olecranon':('Wyrostek łokciowy','Olecranon','„Czubek łokcia”; przyczep końcowy m. trójgłowego ramienia.'),
 'Posterior border of ulna':('Brzeg tylny kości łokciowej','Margo posterior ulnae','Wyczuwalny pod skórą na całej długości.'),
 'Posterior surface of ulna':('Powierzchnia tylna kości łokciowej','Facies posterior ulnae','Początek prostowników kciuka i wskaziciela oraz m. odwodziciela długiego kciuka.'),
 'Radial notch':('Wcięcie promieniowe','Incisura radialis','Powierzchnia stawu promieniowo-łokciowego bliższego.'),
 'Sublime tubercle':('Guzek wyniosły','Tuberculum sublime','Na wyrostku dziobiastym; przyczep części więzadła pobocznego łokciowego.'),
 'Supinator crest':('Grzebień mięśnia odwracacza','Crista musculi supinatoris','Początek części m. odwracacza.'),
 'Trochlear notch':('Wcięcie bloczkowe','Incisura trochlearis','Powierzchnia stawowa dla bloczka kości ramiennej.'),
 'Tuberosity of ulna':('Guzowatość kości łokciowej','Tuberositas ulnae','Przyczep końcowy m. ramiennego.'),
 'Ulnar styloid process':('Wyrostek rylcowaty kości łokciowej','Processus styloideus ulnae','Dalszy koniec kości, po stronie małego palca.'),
 # ręka
 'Base of phalanx of hand':('Podstawa paliczka (ręka)','Basis phalangis manus',''),
 'Body of phalanx of hand':('Trzon paliczka (ręka)','Corpus phalangis manus',''),
 'Head of phalanx of hand':('Głowa paliczka (ręka)','Caput phalangis manus',''),
 'Trochlea of phalanx of hand':('Bloczek paliczka (ręka)','Trochlea phalangis manus',''),
 'Body of metacarpal bone':('Trzon kości śródręcza','Corpus ossis metacarpi',''),
 'Head of metacarpal bone':('Głowa kości śródręcza','Caput ossis metacarpi','Tworzy „kostkę” pięści.'),
 'Metacarpal base':('Podstawa kości śródręcza','Basis ossis metacarpi',''),
 'Styloid process of third metacarpal bone':('Wyrostek rylcowaty kości śródręcza III','Processus styloideus ossis metacarpi III','Przyczep m. prostownika promieniowego krótkiego nadgarstka.'),
 'Hook of hamate bone':('Haczyk kości haczykowatej','Hamulus ossis hamati','Początek m. zginacza krótkiego i przeciwstawiacza palca małego; ściana kanału Guyona.'),
 'Tubercle of scaphoid bone':('Guzek kości łódeczkowatej','Tuberculum ossis scaphoidei','Początek m. odwodziciela krótkiego kciuka; przyczep troczka zginaczy.'),
 'Tubercle of trapezium bone':('Guzek kości czworobocznej większej','Tuberculum ossis trapezii','Przyczep troczka zginaczy; początek mięśni kłębu.'),
 'Tuberosity of distal phalanx of hand':('Guzowatość paliczka dalszego','Tuberositas phalangis distalis','Rozszerzony koniec paliczka dalszego pod opuszką palca.'),
}

# Mięśnie: klucz grupy -> opis. Każda siatka (mesh) ma przypisaną grupę i nazwę części.
# region: bark | ramie | przedramie | dlon
M = {}
def m(key,pl,la,region,org,ins,fn,inn,alt=''):
    M[key]=dict(pl=pl,la=la,region=region,org=org,ins=ins,fn=fn,inn=inn,alt=alt)
m('trapezius','Mięsień czworoboczny grzbietu','Musculus trapezius','bark','Kresa karkowa górna, guz potyliczny zewnętrzny, więzadło karkowe, wyrostki kolczyste C7–Th12.','Koniec barkowy obojczyka (część zstępująca), wyrostek barkowy i grzebień łopatki (części poprzeczna i wstępująca).','Część zstępująca unosi łopatkę, poprzeczna przywodzi ją do kręgosłupa, wstępująca obniża; całość obraca łopatkę ku górze (przy odwodzeniu ramienia powyżej 90°).','N. dodatkowy (XI) i gałęzie splotu szyjnego (C3–C4).','kaptur trapez')
m('latissimus','Mięsień najszerszy grzbietu','Musculus latissimus dorsi','bark','Wyrostki kolczyste Th7–L5, powięź piersiowo-lędźwiowa, grzebień kości krzyżowej, tylna część grzebienia biodrowego, żebra X–XII, kąt dolny łopatki.','Grzebień guzka mniejszego kości ramiennej.','Przywodzi, prostuje i rotuje ramię do wewnątrz; przy ustalonej kończynie podciąga tułów (np. podciąganie na drążku).','N. piersiowo-grzbietowy (C6–C8).','')
m('rhomboids','Mięsień równoległoboczny','Musculus rhomboideus','bark','Większy: wyrostki kolczyste Th2–Th5; mniejszy: wyrostki kolczyste C6–C7.','Brzeg przyśrodkowy łopatki (większy — poniżej, mniejszy — na wysokości grzebienia).','Przywodzą i unoszą łopatkę, przyciskają ją do klatki piersiowej.','N. grzbietowy łopatki (C4–C5).','')
m('levator','Mięsień dźwigacz łopatki','Musculus levator scapulae','bark','Guzki tylne wyrostków poprzecznych C1–C4.','Kąt górny i górna część brzegu przyśrodkowego łopatki.','Unosi łopatkę, obraca ją w dół; przy ustalonej łopatce pochyla szyję w bok.','N. grzbietowy łopatki (C5) i nn. szyjne (C3–C4).','')
m('serratus','Mięsień zębaty przedni','Musculus serratus anterior','bark','Zewnętrzna powierzchnia żeber I–VIII/IX (zęby mięśnia).','Brzeg przyśrodkowy łopatki od strony żebrowej oraz kąt dolny.','Przyciąga łopatkę do przodu i dociska ją do klatki piersiowej, obraca ku górze; porażenie powoduje „łopatkę skrzydłowatą”.','N. piersiowy długi (C5–C7).','')
m('pecminor','Mięsień piersiowy mniejszy','Musculus pectoralis minor','bark','Żebra III–V (przy chrząstkach).','Wyrostek kruczy łopatki.','Obniża łopatkę i pochyla ją do przodu; przy ustalonej łopatce unosi żebra (pomocniczy mięsień wdechowy).','Nn. piersiowe przyśrodkowy i boczny (C5–Th1).','')
m('subclavius','Mięsień podobojczykowy','Musculus subclavius','bark','Chrząstka I żebra.','Bruzda mięśnia podobojczykowego na dolnej powierzchni obojczyka.','Stabilizuje obojczyk w stawie mostkowo-obojczykowym i obniża go.','N. podobojczykowy (C5–C6).','')
m('pecmajor','Mięsień piersiowy większy','Musculus pectoralis major','bark','Część obojczykowa — przyśrodkowa połowa obojczyka; mostkowo-żebrowa — mostek i chrząstki żeber II–VI; brzuszna — blaszka przednia pochewki m. prostego brzucha.','Grzebień guzka większego kości ramiennej.','Przywodzi i rotuje ramię do wewnątrz; część obojczykowa zgina, dolna prostuje ramię ze zgięcia.','Nn. piersiowe boczny i przyśrodkowy (C5–Th1).','klatka')
m('deltoid','Mięsień naramienny','Musculus deltoideus','bark','Część obojczykowa — koniec barkowy obojczyka; barkowa — wyrostek barkowy; grzebieniowa — grzebień łopatki.','Guzowatość naramienna kości ramiennej.','Odwodzi ramię (głównie część barkowa); część obojczykowa zgina i rotuje do wewnątrz, grzebieniowa prostuje i rotuje na zewnątrz.','N. pachowy (C5–C6).','')
m('supraspinatus','Mięsień nadgrzebieniowy','Musculus supraspinatus','bark','Dół nadgrzebieniowy łopatki.','Guzek większy kości ramiennej (górna powierzchnia).','Rozpoczyna odwodzenie ramienia (0–15°); stabilizuje głowę kości ramiennej w panewce (stożek rotatorów).','N. nadłopatkowy (C4–C6).','stożek rotatorów')
m('infraspinatus','Mięsień podgrzebieniowy','Musculus infraspinatus','bark','Dół podgrzebieniowy łopatki.','Guzek większy kości ramiennej (powierzchnia środkowa).','Rotuje ramię na zewnątrz; stabilizuje staw ramienny (stożek rotatorów).','N. nadłopatkowy (C5–C6).','stożek rotatorów')
m('teresminor','Mięsień obły mniejszy','Musculus teres minor','bark','Górna część brzegu bocznego łopatki.','Guzek większy kości ramiennej (powierzchnia dolna).','Rotuje ramię na zewnątrz, słabo przywodzi; stabilizuje staw (stożek rotatorów).','N. pachowy (C5–C6).','stożek rotatorów')
m('teresmajor','Mięsień obły większy','Musculus teres major','bark','Dolna część brzegu bocznego łopatki, kąt dolny.','Grzebień guzka mniejszego kości ramiennej.','Przywodzi, prostuje i rotuje ramię do wewnątrz.','N. podłopatkowy dolny (C5–C7).','')
m('subscapularis','Mięsień podłopatkowy','Musculus subscapularis','bark','Dół podłopatkowy.','Guzek mniejszy kości ramiennej.','Rotuje ramię do wewnątrz; stabilizuje przednią część stawu ramiennego (stożek rotatorów).','Nn. podłopatkowe (C5–C7).','stożek rotatorów')
m('biceps','Mięsień dwugłowy ramienia','Musculus biceps brachii','ramie','Głowa długa — guzek nadpanewkowy łopatki; głowa krótka — wyrostek kruczy łopatki.','Guzowatość kości promieniowej oraz rozcięgno m. dwugłowego (powięź przedramienia).','Zgina łokieć i odwraca przedramię (supinacja); słabo zgina ramię w stawie ramiennym.','N. mięśniowo-skórny (C5–C6).','biceps')
m('coracobrachialis','Mięsień kruczo-ramienny','Musculus coracobrachialis','ramie','Wyrostek kruczy łopatki.','Przyśrodkowa powierzchnia trzonu kości ramiennej (w połowie długości).','Zgina i przywodzi ramię.','N. mięśniowo-skórny (C6–C7).','')
m('brachialis','Mięsień ramienny','Musculus brachialis','ramie','Dolna połowa przedniej powierzchni kości ramiennej.','Guzowatość kości łokciowej i wyrostek dziobiasty.','Główny zginacz łokcia (niezależnie od ustawienia przedramienia).','N. mięśniowo-skórny (C5–C6) i n. promieniowy (C7).','')
m('triceps','Mięsień trójgłowy ramienia','Musculus triceps brachii','ramie','Głowa długa — guzek podpanewkowy łopatki; boczna — powierzchnia tylna kości ramiennej powyżej bruzdy n. promieniowego; przyśrodkowa — poniżej bruzdy.','Wyrostek łokciowy kości łokciowej.','Prostuje łokieć; głowa długa dodatkowo przywodzi i prostuje ramię.','N. promieniowy (C6–C8).','triceps')
m('anconeus','Mięsień łokciowy','Musculus anconeus','ramie','Nadkłykieć boczny kości ramiennej.','Wyrostek łokciowy i górna część powierzchni tylnej kości łokciowej.','Wspomaga prostowanie łokcia, napina torebkę stawu łokciowego.','N. promieniowy (C7–C8).','')
m('pronatorteres','Mięsień nawrotny obły','Musculus pronator teres','przedramie','Głowa ramienna — nadkłykieć przyśrodkowy; głowa łokciowa — wyrostek dziobiasty kości łokciowej.','Powierzchnia boczna środkowej części trzonu kości promieniowej.','Nawraca przedramię (pronacja) i zgina łokieć.','N. pośrodkowy (C6–C7).','')
m('fcr','Zginacz promieniowy nadgarstka','Musculus flexor carpi radialis','przedramie','Nadkłykieć przyśrodkowy kości ramiennej (wspólne ścięgno zginaczy).','Podstawa kości śródręcza II (i III).','Zgina i odwodzi rękę (odchylenie promieniowe).','N. pośrodkowy (C6–C7).','')
m('pl','Mięsień dłoniowy długi','Musculus palmaris longus','przedramie','Nadkłykieć przyśrodkowy kości ramiennej.','Rozcięgno dłoniowe i troczek zginaczy.','Napina rozcięgno dłoniowe, słabo zgina nadgarstek (brak u ok. 14% ludzi).','N. pośrodkowy (C7–C8).','')
m('fcu','Zginacz łokciowy nadgarstka','Musculus flexor carpi ulnaris','przedramie','Głowa ramienna — nadkłykieć przyśrodkowy; głowa łokciowa — wyrostek łokciowy i brzeg tylny kości łokciowej.','Kość grochowata, hak kości haczykowatej, podstawa kości śródręcza V.','Zgina i przywodzi rękę (odchylenie łokciowe).','N. łokciowy (C7–Th1).','')
m('fds','Zginacz powierzchowny palców','Musculus flexor digitorum superficialis','przedramie','Głowa ramienno-łokciowa — nadkłykieć przyśrodkowy i wyrostek dziobiasty; głowa promieniowa — przednia powierzchnia kości promieniowej.','Boczne brzegi paliczków środkowych palców II–V.','Zgina paliczki środkowe palców II–V (staw międzypaliczkowy bliższy) oraz nadgarstek.','N. pośrodkowy (C7–Th1).','')
m('fdp','Zginacz głęboki palców','Musculus flexor digitorum profundus','przedramie','Powierzchnia przyśrodkowa i przednia kości łokciowej, błona międzykostna.','Podstawy paliczków dalszych palców II–V.','Zgina paliczki dalsze (i pozostałe stawy palców) oraz nadgarstek.','N. międzykostny przedni (palce II–III) i n. łokciowy (IV–V); C8–Th1.','')
m('fpl','Zginacz długi kciuka','Musculus flexor pollicis longus','przedramie','Przednia powierzchnia kości promieniowej, błona międzykostna.','Podstawa paliczka dalszego kciuka.','Zgina kciuk (staw międzypaliczkowy), pomaga zginać nadgarstek.','N. międzykostny przedni (C7–C8).','')
m('pq','Mięsień nawrotny czworoboczny','Musculus pronator quadratus','przedramie','Dolna ćwiartka przedniej powierzchni kości łokciowej.','Dolna ćwiartka przedniej powierzchni kości promieniowej.','Nawraca przedramię (główny nawracacz).','N. międzykostny przedni (C8–Th1).','')
m('brachioradialis','Mięsień ramienno-promieniowy','Musculus brachioradialis','przedramie','Grzebień nadkłykciowy boczny kości ramiennej.','Wyrostek rylcowaty kości promieniowej.','Zgina łokieć, najsilniej przy przedramieniu w pozycji pośredniej.','N. promieniowy (C5–C7).','')
m('ecrl','Prostownik promieniowy długi nadgarstka','Musculus extensor carpi radialis longus','przedramie','Grzebień nadkłykciowy boczny kości ramiennej.','Podstawa kości śródręcza II (grzbietowo).','Prostuje i odwodzi rękę.','N. promieniowy (C6–C7).','')
m('ecrb','Prostownik promieniowy krótki nadgarstka','Musculus extensor carpi radialis brevis','przedramie','Nadkłykieć boczny kości ramiennej (wspólne ścięgno prostowników).','Podstawa kości śródręcza III.','Prostuje rękę i stabilizuje nadgarstek podczas chwytu.','Gałąź głęboka n. promieniowego (C7–C8).','')
m('ed','Prostownik palców','Musculus extensor digitorum','przedramie','Nadkłykieć boczny kości ramiennej (wspólne ścięgno prostowników).','Rozcięgno grzbietowe palców II–V (paliczki środkowe i dalsze).','Prostuje palce II–V oraz nadgarstek.','N. międzykostny tylny (C7–C8).','')
m('edm','Prostownik palca małego','Musculus extensor digiti minimi','przedramie','Nadkłykieć boczny kości ramiennej.','Rozcięgno grzbietowe palca V.','Prostuje palec mały.','N. międzykostny tylny (C7–C8).','')
m('ecu','Prostownik łokciowy nadgarstka','Musculus extensor carpi ulnaris','przedramie','Głowa ramienna — nadkłykieć boczny; głowa łokciowa — brzeg tylny kości łokciowej.','Podstawa kości śródręcza V.','Prostuje i przywodzi rękę (odchylenie łokciowe).','N. międzykostny tylny (C7–C8).','')
m('supinator','Mięsień odwracacz','Musculus supinator','przedramie','Nadkłykieć boczny kości ramiennej, więzadło poboczne promieniowe, grzebień mięśnia odwracacza kości łokciowej.','Bliższa 1/3 kości promieniowej (powierzchnia boczna, przednia i tylna).','Odwraca przedramię (supinacja).','Gałąź głęboka n. promieniowego (C6–C7).','')
m('apl','Odwodziciel długi kciuka','Musculus abductor pollicis longus','przedramie','Tylna powierzchnia kości łokciowej i promieniowej, błona międzykostna.','Podstawa kości śródręcza I.','Odwodzi kciuk i rękę.','N. międzykostny tylny (C7–C8).','')
m('epb','Prostownik krótki kciuka','Musculus extensor pollicis brevis','przedramie','Tylna powierzchnia kości promieniowej, błona międzykostna.','Podstawa paliczka bliższego kciuka.','Prostuje kciuk w stawie śródręczno-paliczkowym, odwodzi go.','N. międzykostny tylny (C7–C8).','')
m('epl','Prostownik długi kciuka','Musculus extensor pollicis longus','przedramie','Środkowa część tylnej powierzchni kości łokciowej, błona międzykostna.','Podstawa paliczka dalszego kciuka.','Prostuje kciuk (wszystkie stawy), przywodzi go.','N. międzykostny tylny (C7–C8).','')
m('ei','Prostownik wskaziciela','Musculus extensor indicis','przedramie','Dolna część tylnej powierzchni kości łokciowej, błona międzykostna.','Rozcięgno grzbietowe palca II.','Prostuje palec wskazujący (niezależnie od pozostałych).','N. międzykostny tylny (C7–C8).','')
m('abp','Odwodziciel krótki kciuka','Musculus abductor pollicis brevis','dlon','Troczek zginaczy, guzek kości łódeczkowatej i czworobocznej większej.','Podstawa paliczka bliższego kciuka (strona promieniowa).','Odwodzi kciuk (w płaszczyźnie prostopadłej do dłoni).','N. pośrodkowy (C8–Th1).','kłąb kciuka')
m('fpb','Zginacz krótki kciuka','Musculus flexor pollicis brevis','dlon','Głowa powierzchowna — troczek zginaczy, kość czworoboczna większa; głowa głęboka — kości czworoboczna większa i główkowata.','Podstawa paliczka bliższego kciuka.','Zgina kciuk w stawie śródręczno-paliczkowym.','Głowa powierzchowna — n. pośrodkowy; głęboka — n. łokciowy (C8–Th1).','kłąb kciuka')
m('opp','Mięsień przeciwstawiacz kciuka','Musculus opponens pollicis','dlon','Guzek kości czworobocznej większej, troczek zginaczy.','Brzeg promieniowy kości śródręcza I.','Przeciwstawia kciuk pozostałym palcom (chwyt).','N. pośrodkowy (C8–Th1).','kłąb kciuka')
m('adp','Mięsień przywodziciel kciuka','Musculus adductor pollicis','dlon','Głowa skośna — kość główkowata, podstawy kości śródręcza II–III; głowa poprzeczna — trzon kości śródręcza III.','Podstawa paliczka bliższego kciuka (przyśrodkowo).','Przywodzi kciuk ku dłoni (chwyt kluczowy).','Gałąź głęboka n. łokciowego (C8–Th1).','')
m('adm','Odwodziciel palca małego','Musculus abductor digiti minimi manus','dlon','Kość grochowata, ścięgno m. zginacza łokciowego nadgarstka.','Podstawa paliczka bliższego palca V.','Odwodzi palec mały.','N. łokciowy (C8–Th1).','kłąb palca małego')
m('fdm','Zginacz krótki palca małego','Musculus flexor digiti minimi brevis manus','dlon','Hak kości haczykowatej, troczek zginaczy.','Podstawa paliczka bliższego palca V.','Zgina palec mały w stawie śródręczno-paliczkowym.','N. łokciowy (C8–Th1).','kłąb palca małego')
m('odm','Przeciwstawiacz palca małego','Musculus opponens digiti minimi manus','dlon','Hak kości haczykowatej, troczek zginaczy.','Brzeg łokciowy kości śródręcza V.','Przeciwstawia palec mały kciukowi.','N. łokciowy (C8–Th1).','kłąb palca małego')
m('lumb','Mięśnie glistowate ręki','Musculi lumbricales manus','dlon','Ścięgna m. zginacza głębokiego palców.','Rozcięgno grzbietowe palców II–V (od strony promieniowej).','Zginają w stawach śródręczno-paliczkowych, prostują w międzypaliczkowych.','Mm. I–II: n. pośrodkowy; III–IV: n. łokciowy.','')
m('dio','Mięśnie międzykostne grzbietowe','Musculi interossei dorsales manus','dlon','Sąsiadujące powierzchnie kości śródręcza (po dwie głowy).','Podstawy paliczków bliższych palców II–IV, rozcięgno grzbietowe.','Odwodzą palce od palca środkowego (DAB), zginają w stawach śródręczno-paliczkowych.','Gałąź głęboka n. łokciowego (C8–Th1).','')
m('pio','Mięśnie międzykostne dłoniowe','Musculi interossei palmares','dlon','Kości śródręcza II, IV i V (powierzchnie zwrócone do palca III).','Rozcięgno grzbietowe palców II, IV i V.','Przywodzą palce ku palcowi środkowemu (PAD).','Gałąź głęboka n. łokciowego (C8–Th1).','')
m('extret','Troczek prostowników','Retinaculum musculorum extensorum','dlon','Brzeg boczny kości promieniowej, kość łokciowa.','Kości trójgraniasta i grochowata.','Utrzymuje ścięgna prostowników przy nadgarstku (sześć przedziałów).','—','')
m('flexret','Troczek zginaczy','Retinaculum musculorum flexorum','dlon','Kość grochowata i hak kości haczykowatej.','Guzek kości łódeczkowatej i czworobocznej większej.','Zamyka kanał nadgarstka; zespół kanału nadgarstka = ucisk n. pośrodkowego.','—','')
m('palmapo','Rozcięgno dłoniowe','Aponeurosis palmaris','dlon','Ścięgno m. dłoniowego długiego, troczek zginaczy.','Skóra dłoni i pochewki ścięgien palców II–V.','Chroni struktury dłoni i wzmacnia chwyt; przykurcz = choroba Dupuytrena.','—','')

# mesh (en, bez sufiksu .r) -> (grupa, część pl, część la)
MESH = {
 'Ascending part of trapezius muscle':('trapezius','Część wstępująca','Pars ascendens'),
 'Transverse part of trapezius muscle':('trapezius','Część poprzeczna','Pars transversa'),
 'Descending part of trapezius muscle':('trapezius','Część zstępująca','Pars descendens'),
 'Latissimus dorsi muscle':('latissimus','',''),
 'Rhomboid major muscle':('rhomboids','Większy','Major'),
 'Rhomboid minor muscle':('rhomboids','Mniejszy','Minor'),
 'Levator scapulae':('levator','',''),
 'Serratus anterior muscle':('serratus','',''),
 'Pectoralis minor muscle':('pecminor','',''),
 'Subclavius muscle':('subclavius','',''),
 'Clavicular head of pectoralis major muscle':('pecmajor','Głowa obojczykowa','Caput claviculare'),
 'Sternocostal head of pectoralis major muscle':('pecmajor','Głowa mostkowo-żebrowa','Caput sternocostale'),
 '(Abdominal part of pectoralis major muscle)':('pecmajor','Część brzuszna','Pars abdominalis'),
 'Clavicular part of deltoid muscle':('deltoid','Część obojczykowa','Pars clavicularis'),
 'Acromial part of deltoid muscle':('deltoid','Część barkowa','Pars acromialis'),
 'Scapular spinal part of deltoid muscle':('deltoid','Część grzebieniowa','Pars spinalis'),
 'Supraspinatus muscle':('supraspinatus','',''),
 'Infraspinatus muscle':('infraspinatus','',''),
 'Teres minor muscle':('teresminor','',''),
 'Teres major muscle':('teresmajor','',''),
 'Subscapularis muscle':('subscapularis','',''),
 'Long head of biceps brachii':('biceps','Głowa długa','Caput longum'),
 'Short head of biceps brachii':('biceps','Głowa krótka','Caput breve'),
 'Coracobrachialis muscle':('coracobrachialis','',''),
 'Brachialis muscle':('brachialis','',''),
 'Long head of triceps brachii':('triceps','Głowa długa','Caput longum'),
 'Lateral head of triceps brachii':('triceps','Głowa boczna','Caput laterale'),
 'Medial head of triceps brachii':('triceps','Głowa przyśrodkowa','Caput mediale'),
 'Anconeus muscle':('anconeus','',''),
 'Superficial head of pronator teres':('pronatorteres','Głowa ramienna (powierzchowna)','Caput humerale'),
 'Deep head of pronator teres':('pronatorteres','Głowa łokciowa (głęboka)','Caput ulnare'),
 'Flexor carpi radialis':('fcr','',''),
 'Palmaris longus muscle':('pl','',''),
 'Humeral head of flexor carpi ulnaris':('fcu','Głowa ramienna','Caput humerale'),
 'Ulnar head of flexor carpi ulnaris':('fcu','Głowa łokciowa','Caput ulnare'),
 'Humero-ulnar head of flexor digitorum superficialis':('fds','Głowa ramienno-łokciowa','Caput humeroulnare'),
 'Radial head of flexor digitorum superficialis':('fds','Głowa promieniowa','Caput radiale'),
 'Flexor digitorum profundus':('fdp','',''),
 'Flexor pollicis longus':('fpl','',''),
 'Pronator quadratus':('pq','',''),
 'Brachioradialis muscle':('brachioradialis','',''),
 'Extensor carpi radialis longus':('ecrl','',''),
 'Extensor carpi radialis brevis':('ecrb','',''),
 'Extensor digitorum':('ed','',''),
 'Extensor digiti minimi':('edm','',''),
 'Humeral head of extensor carpi ulnaris':('ecu','Głowa ramienna','Caput humerale'),
 'Ulnar head of extensor carpi ulnaris':('ecu','Głowa łokciowa','Caput ulnare'),
 'Supinator':('supinator','',''),
 'Abductor pollicis longus':('apl','',''),
 'Extensor pollicis brevis':('epb','',''),
 'Extensor pollicis longus':('epl','',''),
 'Extensor indicis':('ei','',''),
 'Abductor pollicis brevis':('abp','',''),
 'Superficial head of flexor pollicis brevis':('fpb','Głowa powierzchowna','Caput superficiale'),
 'Deep head of flexor pollicis brevis':('fpb','Głowa głęboka','Caput profundum'),
 'Opponens pollicis muscle':('opp','',''),
 'Oblique head of adductor pollicis':('adp','Głowa skośna','Caput obliquum'),
 'Transverse head of adductor pollicis':('adp','Głowa poprzeczna','Caput transversum'),
 'Abductor digiti minimi of hand':('adm','',''),
 'Flexor digiti minimi of hand':('fdm','',''),
 'Opponens digiti minimi muscle of hand':('odm','',''),
 'Lumbrical muscles of hand':('lumb','',''),
 'Dorsal interossei muscles of hand':('dio','',''),
 'Palmar interossei muscles':('pio','',''),
 'Extensor retinaculum of wrist':('extret','',''),
 'Flexor retinaculum of wrist':('flexret','',''),
 'Palmar aponeurosis':('palmapo','',''),
}
OTHERGROUPS = {'extret','flexret','palmapo'}  # warstwa "Powięzie i troczki"

# patch base (en) -> lista grup (przyczepy)
PATCH = {
 'Abductor digiti minimi of hand':['adm'],'Abductor pollicis longus':['apl'],'Acromial part of deltoid muscle':['deltoid'],
 'Adductor pollicis':['adp'],'Anconeus muscle':['anconeus'],'Ascending part of trapezius muscle':['trapezius'],
 'Biceps brachii muscle':['biceps'],'Long head of biceps brachii':['biceps'],'Brachialis muscle':['brachialis'],
 'Brachioradialis muscle':['brachioradialis'],'Clavicular part of deltoid muscle':['deltoid'],
 'Common extensor tendon':['ecrb','ed','edm','ecu'],'Common flexor tendon':['fcr','pl','fcu','fds'],
 'Coracobrachialis muscle':['coracobrachialis'],'Deep head of flexor pollicis brevis':['fpb'],
 'Deltoid muscle':['deltoid'],'Descending part of trapezius muscle':['trapezius'],
 'Dorsal interossei muscles of hand':['dio'],'Extensor carpi radialis brevis':['ecrb'],'Extensor carpi radialis longus':['ecrl'],
 'Extensor carpi ulnaris':['ecu'],'Extensor digitorum':['ed'],'Extensor indicis':['ei'],'Extensor pollicis brevis':['epb'],
 'Extensor pollicis longus':['epl'],'Flexor carpi ulnaris':['fcu'],'Flexor digiti minimi of hand':['fdm'],
 'Flexor digitorum profundus':['fdp'],'Flexor digitorum superficialis':['fds'],'Flexor pollicis longus':['fpl'],
 'Infraspinatus muscle':['infraspinatus'],'Lateral head of triceps brachii':['triceps'],'Latissimus dorsi muscle':['latissimus'],
 'Levator scapulae':['levator'],'Long head of triceps brachii':['triceps'],'Medial head of triceps brachii':['triceps'],
 'Opponens digiti minimi muscle of hand':['odm'],'Pectoralis major muscle':['pecmajor'],'Pectoralis minor muscle':['pecminor'],
 'Rhomboid major muscle':['rhomboids'],'Rhomboid minor muscle':['rhomboids'],'Scapular spinal part of deltoid muscle':['deltoid'],
 'Serratus anterior muscle':['serratus'],'Sternocostal head of pectoralis major muscle':['pecmajor'],'Subclavius muscle':['subclavius'],
 'Subscapularis muscle':['subscapularis'],'Supinator':['supinator'],'Supraspinatus muscle':['supraspinatus'],
 'Teres major muscle':['teresmajor'],'Teres minor muscle':['teresminor'],'Transverse part of trapezius muscle':['trapezius'],
 'Triceps brachii muscle':['triceps'],'Ulnar head of flexor carpi ulnaris':['fcu'],'Pronator teres':['pronatorteres'],
}
ORIGIN_ONLY = {'teresmajor','coracobrachialis','latissimus','dio','odm'}
INSERT_ONLY = {'ed','trapezius','rhomboids','levator','subclavius'}
