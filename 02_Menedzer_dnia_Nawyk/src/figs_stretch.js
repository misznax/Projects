/* Rysunki pozycji rozciągania (postać patyczkowa, generowana z współrzędnych) */
(()=>{
const P=a=>'M'+a.map(p=>p[0]+' '+p[1]).join('L');
const ln=(c,a)=>`<path class="${c}" d="${P(a)}"/>`;
const tx=(x,y,s,an)=>`<text class="t" x="${x}" y="${y}"${an?` text-anchor="${an}"`:''}>${s}</text>`;
const ar=(a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,h=7;
  const p1=[b[0]-ux*h+uy*h*.6,b[1]-uy*h-ux*h*.6],p2=[b[0]-ux*h-uy*h*.6,b[1]-uy*h+ux*h*.6];
  return `<path class="ar" d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${b[0]} ${b[1]}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}"/>`};
const hd=(x,y,r)=>`<circle class="l" cx="${x}" cy="${y}" r="${r||10}"/>`;
const gr=(x1,x2,y)=>`<path class="l2" d="M${x1} ${y}H${x2}"/>`;
const zone=(x,y,rx,ry,rot)=>`<ellipse class="fa2" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${rot?` transform="rotate(${rot} ${x} ${y})"`:''}/>`;
const svg=(vb,aria,b)=>`<svg viewBox="${vb}" role="img" aria-label="${aria}">${b}</svg>`;

// Poza dziecka
FIGS.child=svg('0 0 320 220','Poza dziecka: klęk, pośladki na piętach, tułów złożony do przodu, ręce wyciągnięte, czoło na podłodze',
 gr(20,300,198)+zone(100,160,22,12,-8)+
 ln('l',[[60,196],[116,196],[78,168]])+          // goleń i udo
 ln('l',[[78,168],[138,158]])+                   // tułów
 ln('l',[[138,158],[190,184],[238,196]])+        // ręka
 hd(158,180,10)+
 tx(14,120,'pośladki na piętach')+ar([50,126],[72,158])+
 tx(160,140,'czoło na podłodze')+
 tx(200,214,'ręce przed siebie')+
 tx(150,56,'oddychaj w plecy:')+tx(150,71,'wdech rozszerza żebra')+ar([140,80],[112,148]));

// Koci grzbiet
{const one=(ox,cow)=>{
  const sp=cow?`M${ox+50} 126Q${ox+90} 150 ${ox+130} 126`:`M${ox+50} 126Q${ox+90} 92 ${ox+130} 126`;
  const head=cow?[ox+162,100]:[ox+146,156];
  const neck=cow?[[ox+130,126],[ox+152,108]]:[[ox+130,126],[ox+142,148]];
  return `<path class="l" d="${sp}"/>`+ln('l',neck)+hd(head[0],head[1],9)+
    ln('l',[[ox,190],[ox+50,190],[ox+50,126]])+ln('l',[[ox+130,126],[ox+130,190]]);};
  FIGS.catcow=svg('0 0 360 220','Koci grzbiet: na czworaka; krowa (plecy w dół, głowa w górę) i kot (plecy w górę, broda do klatki)',
   gr(0,350,192)+one(8,true)+tx(62,40,'KROWA — wdech',null)+tx(46,56,'brzuch w dół, głowa w górę')+
   one(190,false)+tx(240,40,'KOT — wydech')+tx(232,56,'plecy w górę,')+tx(232,71,'broda do klatki')+
   ar([60,98],[60,112])+ar([268,84],[268,70]));}

// Wykrok biodrowy
FIGS.lunge=svg('0 0 320 220','Wykrok biodrowy: klęk na jednym kolanie, druga stopa z przodu, tułów prosto, biodra lekko do przodu',
 gr(10,300,198)+ln('l',[[40,196],[95,194],[110,128]])+ln('l',[[110,128],[180,138],[186,198]])+
 ln('l',[[110,128],[112,68]])+ln('l',[[112,72],[92,98],[106,126]])+hd(112,56,10)+
 zone(126,142,14,18)+ar([112,150],[146,150])+
 tx(180,100,'biodra lekko do przodu')+tx(180,114,'zielone pole:')+tx(180,128,'tu czuć rozciąganie')+
 tx(14,176,'kolano na poduszce')+tx(194,176,'kolano nad kostką'));

// Tył uda na krześle
FIGS.ham=svg('0 0 320 220','Rozciąganie tyłu uda w siadzie na krześle: jedna noga wyprostowana piętą na podłodze, tułów prosto pochylony od bioder',
 gr(10,300,200)+ln('l2',[[50,70],[50,128],[120,128]])+ln('l2',[[55,128],[55,200]])+ln('l2',[[115,128],[115,200]])+
 ln('l',[[80,124],[132,124],[132,198]])+ln('l',[[80,124],[180,190],[192,178]])+
 ln('l',[[80,124],[118,76]])+ln('l',[[118,78],[146,100],[172,128]])+hd(131,66,10)+
 zone(130,158,34,8,32)+ar([100,70],[128,86])+
 tx(190,72,'plecy proste,')+tx(190,86,'ruch z bioder')+tx(196,150,'prosta noga:')+tx(196,164,'tu czuć rozciąganie')+tx(14,60,'krzesło'));

// Przód uda (czwórka) przy ścianie
FIGS.quad=svg('0 0 320 220','Rozciąganie przodu uda w staniu: dłoń na ścianie, drugą ręką pięta przy pośladku, kolana obok siebie',
 ln('l2',[[262,12],[262,204]])+gr(60,262,204)+
 ln('l',[[150,204],[152,148],[150,98]])+ln('l',[[150,98],[158,150],[112,120]])+
 ln('l',[[150,98],[150,38]])+ln('l',[[150,42],[200,52],[258,62]])+ln('l',[[150,42],[130,72],[114,118]])+hd(150,26,10)+
 zone(154,126,10,18)+ar([150,108],[178,108])+
 tx(168,90,'biodra do przodu')+tx(20,100,'pięta do pośladka')+ar([50,106],[100,118])+
 tx(176,30,'dłoń na ścianie')+tx(14,176,'kolana obok siebie'));

// Kark w bok
FIGS.neck=svg('0 0 320 220','Rozciąganie karku w bok: ucho do barku, dłoń lekko na głowie, drugi bark w dół',
 ln('l',[[150,102],[150,196]])+ln('l',[[92,102],[208,102]])+ln('l',[[92,102],[84,150],[88,190]])+ln('l',[[208,102],[216,150],[212,190]])+
 ln('l',[[150,102],[164,88]])+hd(178,66,22)+ln('l',[[92,102],[72,62],[120,26],[176,40]])+
 zone(138,92,8,18)+ar([186,34],[208,52])+ar([240,104],[240,134])+
 tx(206,76,'dłoń tylko opiera')+tx(206,90,'się o głowę')+tx(206,104,'(bez siły)')+
 tx(226,150,'ten bark w dół')+tx(8,184,'tu czuć rozciąganie')+ar([30,172],[128,104])+tx(200,24,'ucho do barku'));
})();
