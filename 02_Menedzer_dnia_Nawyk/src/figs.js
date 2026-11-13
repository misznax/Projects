const FIGS={
face:`<svg viewBox="0 0 420 275" role="img" aria-label="Profil twarzy: zęby się nie dotykają (odstęp ok. 5 mm), język płasko, mięsień żucia miękki">
<g transform="translate(96,0)">
<path class="l" d="M95 24C140 18 168 44 170 78L184 98L170 102L172 112C173 117 170 119 168 121C172 124 172 128 168 131L166 146C160 160 140 166 122 164L104 160C86 152 70 136 66 112C60 76 66 34 95 24Z"/>
<ellipse class="l" cx="98" cy="98" rx="8" ry="14"/>
<circle class="d" cx="152" cy="76" r="3"/>
<path class="l" d="M140 64Q152 58 162 64"/>
<ellipse class="fa" cx="112" cy="126" rx="17" ry="22" transform="rotate(-18 112 126)"/>
<rect class="l" x="144" y="113" width="22" height="7" rx="2"/>
<rect class="l" x="144" y="127" width="22" height="7" rx="2"/>
<path class="a" d="M104 150C122 140 146 142 162 138"/>
</g>
<g class="t">
<text x="6" y="130">mięsień żucia</text><text x="6" y="144">(przy kącie żuchwy)</text><text x="6" y="158">ma być miękki</text>
<path class="a" d="M100 134L196 128"/>
<text x="300" y="112">zęby się</text><text x="300" y="126">NIE dotykają</text><text x="300" y="140">(ok. 5 mm)</text>
<text x="300" y="168">język płasko</text><text x="300" y="182">na dnie ust</text>
</g>
<g class="t">
<text x="20" y="206">ŹLE: zęby zaciśnięte</text>
<rect class="w" x="40" y="216" width="70" height="9" rx="2"/><rect class="w" x="40" y="225" width="70" height="9" rx="2"/>
<path class="w" d="M122 214L138 236M138 214L122 236"/>
<text x="230" y="206">DOBRZE: zęby osobno</text>
<rect class="l" x="250" y="214" width="70" height="9" rx="2"/><rect class="l" x="250" y="232" width="70" height="9" rx="2"/>
<path class="ar" d="M335 223V232M331 226L335 222L339 226M331 229L335 233L339 229"/>
<text x="344" y="232">5 mm</text>
<path class="a" d="M244 255C270 247 300 247 326 255"/>
<text x="250" y="270">język leży płasko</text>
</g>
</svg>`,

posture:`<svg viewBox="0 0 280 200" role="img" aria-label="Postawa z boku: ucho, bark, biodro i kostka w jednej linii pionowej">
<line class="a" x1="110" y1="4" x2="110" y2="190" stroke-dasharray="5 5"/>
<path class="a" d="M110 22V8"/>
<circle class="l" cx="110" cy="38" r="16"/>
<path class="l" d="M112 54V66"/>
<path class="l" d="M104 66C92 80 94 108 104 124L120 124C130 108 128 80 116 66Z"/>
<path class="l" d="M110 72L113 116"/>
<path class="l" d="M106 124V174M116 124V174"/>
<path class="l" d="M104 174H134V180H104Z"/>
<path class="l" d="M118 50H134"/>
<circle class="da" cx="110" cy="40" r="3.5"/><circle class="da" cx="110" cy="70" r="3.5"/><circle class="da" cx="110" cy="122" r="3.5"/><circle class="da" cx="110" cy="176" r="3.5"/>
<g class="t">
<text x="146" y="14">nitka ciągnie</text><text x="146" y="28">czubek głowy w górę</text>
<text x="146" y="54">broda równolegle</text><text x="146" y="68">do podłogi</text>
<text x="146" y="92">ucho · bark · biodro</text><text x="146" y="106">· kostka = jedna</text><text x="146" y="120">pionowa linia</text>
<text x="146" y="150">kolana nie zablokowane</text><text x="146" y="164">(lekko luźne)</text>
</g>
</svg>`,

chest:`<svg viewBox="0 0 340 200" role="img" aria-label="Dłoń na mostku, wibracja w klatce piersiowej podczas mruczenia">
<circle class="l" cx="100" cy="34" r="18"/>
<path class="l" d="M94 44H106"/>
<path class="l" d="M100 52V60"/>
<path class="l" d="M50 86C50 70 72 62 100 62C128 62 150 70 150 86L144 180H56Z"/>
<circle class="a" cx="100" cy="102" r="22" stroke-dasharray="3 4"/>
<circle class="a" cx="100" cy="102" r="34" stroke-dasharray="3 5" opacity=".7"/>
<circle class="a" cx="100" cy="102" r="46" stroke-dasharray="3 6" opacity=".45"/>
<ellipse class="fa2" cx="100" cy="102" rx="18" ry="12"/>
<path class="l" d="M86 98L82 92M94 94L92 88M102 93L102 87M110 94L112 88M118 98L122 92"/>
<g class="t">
<text x="166" y="36">usta zamknięte, zęby się</text><text x="166" y="50">nie dotykają: „mmm”</text>
<text x="166" y="96">dłoń płasko na mostku</text><text x="166" y="110">(środek klatki, między</text><text x="166" y="124">piersiami)</text>
<text x="166" y="162">pod dłonią czuć drżenie</text>
</g>
</svg>`,

belly:`<svg viewBox="0 0 360 200" role="img" aria-label="Oddech brzuszny: wdech nosem, brzuch wychodzi; wydech ustami, brzuch wraca">
<g transform="translate(40,0)">
<circle class="l" cx="90" cy="30" r="16"/>
<path class="l" d="M94 30H102"/>
<path class="l" d="M88 46V58"/>
<path class="l" d="M80 58C74 90 74 124 82 176"/>
<path class="l" d="M98 58C112 76 110 96 108 112C112 126 110 150 100 176"/>
<path class="a" d="M108 112C132 124 128 152 100 176" stroke-dasharray="4 4"/>
<ellipse class="fa2" cx="118" cy="132" rx="11" ry="7"/>
<path class="ar" d="M146 128H170M164 122L172 128L164 134"/>
<path class="ar" d="M170 156H146M152 150L144 156L152 162"/>
</g>
<g class="t">
<text x="6" y="112">dłoń na brzuchu</text><text x="6" y="126">nad pępkiem</text>
<path class="a" d="M80 128L142 132"/>
<text x="226" y="126">WDECH nosem:</text><text x="226" y="140">brzuch wychodzi</text>
<text x="226" y="158">WYDECH ustami:</text><text x="226" y="172">brzuch wraca</text>
<text x="160" y="20">barki zostają nisko,</text><text x="160" y="34">nie unosisz ich</text>
</g>
</svg>`,

eyes:`<svg viewBox="0 0 300 215" role="img" aria-label="Dwie osoby patrzące sobie w oczy przez trzy sekundy">
<circle class="l" cx="62" cy="64" r="22"/>
<path class="l" d="M84 62L92 70L84 72M72 82H82"/>
<circle class="d" cx="76" cy="58" r="2.8"/>
<path class="l" d="M30 130C36 102 88 102 94 130"/>
<circle class="l" cx="238" cy="64" r="22"/>
<path class="l" d="M216 62L208 70L216 72M228 82H218"/>
<circle class="d" cx="224" cy="58" r="2.8"/>
<path class="l" d="M206 130C212 102 264 102 270 130"/>
<line class="a" x1="82" y1="58" x2="218" y2="58" stroke-dasharray="6 5"/>
<text class="t" x="150" y="44" text-anchor="middle">raz… dwa… trzy…</text>
<g class="t">
<text x="150" y="156" text-anchor="middle">patrz w jedno oko albo w punkt</text>
<text x="150" y="170" text-anchor="middle">między oczami, nie uciekaj wzrokiem</text>
<text x="150" y="196" text-anchor="middle">dopiero po „trzy” możesz spojrzeć na bok</text>
</g>
</svg>`,

hands:`<svg viewBox="0 0 340 200" role="img" aria-label="Strefa gestów między pępkiem a klatką piersiową, dłonie otwarte i widoczne">
<circle class="l" cx="110" cy="28" r="16"/>
<path class="l" d="M110 44V54"/>
<path class="l" d="M70 62H150L146 176H74Z"/>
<rect class="fa" x="46" y="86" width="128" height="46" rx="10"/>
<path class="l" d="M72 66L52 112M148 66L168 112"/>
<ellipse class="a" cx="46" cy="118" rx="9" ry="13"/><ellipse class="a" cx="174" cy="118" rx="9" ry="13"/>
<path class="a" d="M40 108L38 100M46 106V98M52 108L54 100M174 106V98M180 108L182 100M168 108L166 100"/>
<g class="t">
<text x="196" y="92">STREFA GESTÓW:</text><text x="196" y="106">od pępka do klatki</text>
<text x="196" y="134">dłonie otwarte,</text><text x="196" y="148">widoczne, nie w</text><text x="196" y="162">kieszeniach</text>
</g>
</svg>`,

stance:`<svg viewBox="0 0 300 210" role="img" aria-label="Pewna postawa: stopy na szerokość bioder, barki w tył, ręce widoczne">
<circle class="l" cx="110" cy="26" r="16"/>
<path class="l" d="M110 42V54"/>
<path class="l" d="M72 58H148M80 58L84 118H136L140 58"/>
<path class="l" d="M72 60L52 110M148 60L168 110"/>
<circle class="l" cx="50" cy="114" r="5"/><circle class="l" cx="170" cy="114" r="5"/>
<path class="l" d="M92 118V176M128 118V176"/>
<path class="l" d="M82 178H100M120 178H138"/>
<path class="ar" d="M84 192H136"/><path class="ar" d="M92 187L84 192L92 197M128 187L136 192L128 197"/>
<path class="a" d="M64 48C58 56 58 66 64 72M156 48C162 56 162 66 156 72"/>
<g class="t">
<text x="184" y="52">barki lekko w tył</text><text x="184" y="66">i w dół</text>
<text x="184" y="108">ręce widoczne,</text><text x="184" y="122">nie skrzyżowane</text>
<text x="146" y="200">stopy na szerokość bioder</text>
</g>
</svg>`,

trill:`<svg viewBox="0 0 320 190" role="img" aria-label="Twarz z drżącymi wargami: dźwięk brrr">
<circle class="l" cx="110" cy="84" r="52"/>
<circle class="d" cx="92" cy="72" r="3"/><circle class="d" cx="128" cy="72" r="3"/>
<ellipse class="l" cx="110" cy="108" rx="13" ry="6"/>
<path class="a" d="M84 108q4 -6 8 0t8 0M120 108q4 -6 8 0t8 0"/>
<text class="t" x="110" y="128" text-anchor="middle">brrrrr</text>
<circle class="fa2" cx="68" cy="112" r="7"/><circle class="fa2" cx="152" cy="112" r="7"/>
<g class="t">
<text x="176" y="60">wargi luźno złączone,</text><text x="176" y="74">dmuchasz: drżą jak przy</text><text x="176" y="88">udawaniu silnika</text>
<text x="176" y="118">nie drżą? dociśnij palcami</text><text x="176" y="132">policzki po bokach ust</text><text x="176" y="146">(zielone kółka)</text>
</g>
</svg>`
};
