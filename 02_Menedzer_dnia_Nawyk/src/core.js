/* ───────── Nawyk v0.06 — logika aplikacji ───────── */
const VER='v0.06', MAIL='kontakt@smialo.org', LS='nawyk.v1', APPKEY='nawyk';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const keyOf=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const dnum=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5);
const uid=()=>'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const clone=o=>JSON.parse(JSON.stringify(o));
let TODAY=keyOf(new Date()), DN=dnum(new Date());
const NOTES_CARD=id=>({id:'n_'+id,title:'Notatki i postępy',ic:'📝',blocks:[{id:'n_'+id+'_b',type:'notes',h:'',cfg:{}}]});
TEMPLATES.forEach(t=>t.layout.push(NOTES_CARD(t.id)));

/* ───────── STAN ───────── */
const DEF=()=>({v:3,t:0,days:{},todos:[],journal:{},chk:{},layout:null,tpl:'charyzma',prev:null,ci:{},rt:{},notes:{},mig4:0,mig5:0,mig6:0,start:'',sm:'',sw:'',set:{quiet:1,snd:1,fx:1,hue:-1,mode:'auto'}});
let S=DEF(), ref=null, cloudTimer=0, writing=Promise.resolve(), syncState='local', EDIT=false, EMBED_BLOCKED=false;
const OFF={}, CUR={}, TIM={};
const LAY=()=>S.layout||(S.layout=clone(TEMPLATES[0].layout));
const okLayout=l=>Array.isArray(l)&&l.every(c=>c&&c.id&&Array.isArray(c.blocks)&&c.blocks.every(b=>b&&b.id&&BT[b.type]&&b.cfg));
function migrate(c){
  if(!c||typeof c!=='object')return {};
  if((c.v||1)<3){
    const L=clone(TEMPLATES[0].layout), s=c.set||{};
    const tr=c.tracks&&c.tracks.length?c.tracks:null;
    const fb=(c.links||[]).map(l=>({id:l.id,title:l.title,len:''}));
    const fix=(id,fn)=>L.forEach(cd=>cd.blocks.forEach(b=>{if(b.id===id)fn(b)}));
    fix('g_m',b=>{b.cfg.tracks=tr||b.cfg.tracks.concat(fb)});
    fix('r_w',b=>{if(s.train)b.cfg.train=s.train;if(s.len)b.cfg.len=s.len});
    fix('g_w',b=>{if(s.wlen)b.cfg.len=s.wlen});
    c.layout=L;c.tpl='charyzma';
    const j={};
    Object.keys(c.journal||{}).forEach(k=>{const e=c.journal[k]||{};j[k]=('a' in e||'b' in e||'c' in e)?{b_j:[e.a||'',e.b||'',e.c||'']}:e});
    c.journal=j;c.v=3;
    if(c.set){delete c.set.train;delete c.set.len;delete c.set.wlen}
  }
  return c;
}
const thaw=d=>{
  let c;try{c=migrate(clone(d))}catch(e){c={}}
  const n=Object.assign(DEF(),c);n.set=Object.assign(DEF().set,c.set||{});
  if(!okLayout(n.layout)){n.layout=clone(TEMPLATES[0].layout);n.tpl='charyzma'}
  if(!n.mig5){n.layout.forEach(c=>{const i=c.blocks.findIndex(b=>b.id==='g_v'&&b.type==='daily'&&b.cfg.pack==='glos');if(i>=0&&!c.blocks.some(b=>b.id==='g_vb')){c.blocks[i].h='Potem dźwięk — ćwiczenie dnia';c.blocks[i].cfg.cat='Dźwiękowe';c.blocks.splice(i,0,{id:'g_vb',type:'daily',h:'Najpierw oddech — ćwiczenie dnia',cfg:{pack:'glos',own:[],cat:'Oddechowe'}})}});n.mig5=1}
  if(!n.mig6){if(n.set.hue===168||!n.set.hue)n.set.hue=-1;n.mig6=1}
  if(!n.start){const ks=[].concat(Object.keys(n.days||{}),Object.keys(n.ci||{}),Object.keys(n.rt||{})).sort();n.start=ks[0]||keyOf(new Date())}
  if(!n.mig4){if(!n.layout.some(c=>c.blocks.some(b=>b.type==='notes')))n.layout.push(NOTES_CARD('m'));n.mig4=1}
  return n;
};
function prune(){
  const lim=new Date();lim.setDate(lim.getDate()-7);const lk=keyOf(lim);
  S.todos=S.todos.filter(t=>!(t.done&&t.done<lk));
  const jk=Object.keys(S.journal).sort();while(jk.length>120)delete S.journal[jk.shift()];
  const ck=Object.keys(S.chk).sort();while(ck.length>40)delete S.chk[ck.shift()];
  ['ci','rt'].forEach(f=>{const k=Object.keys(S[f]).sort();while(k.length>400)delete S[f][k.shift()]});
  const nk=Object.keys(S.notes).sort();while(nk.length>1&&JSON.stringify(S.notes).length>150000)delete S.notes[nk.shift()];
}
function persistLocal(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
function save(){prune();S.t=Date.now();persistLocal();queueCloud()}
function queueCloud(){
  if(!ref)return;
  clearTimeout(cloudTimer);
  cloudTimer=setTimeout(()=>{writing=writing.then(()=>ref.set(clone(S))).then(()=>setSync('ok')).catch(()=>setSync('err'))},900);
}
const SYNC={local:'Zapis tylko na tym urządzeniu',wait:'Łączenie z chmurą…',ok:'Zapisane w chmurze',err:'Chmura niedostępna — zapis lokalny',slow:'Chmura odpowiada wolno'};
function setSync(s){syncState=s;const e=$('#sync');if(e)e.textContent=SYNC[s]||''}
const anyRunning=()=>Object.values(TIM).some(t=>t.running());
function applyRemote(d,live){
  if(anyRunning())return;
  S=thaw(d);persistLocal();renderAll();if(live)setSync('ok');
}
async function initCloud(){      // podgląd w Claude (artefakt)
  try{
    const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
    if(!db||!user||!user.id)return;
    const id=await user.id();if(!id)return;
    ref=db.collection('data/users/'+id).doc(APPKEY);
    setSync('wait');
    const slow=setTimeout(()=>setSync('slow'),10000);
    ref.onSnapshot(snap=>{
      const live=!snap.metadata.fromCache;if(live)clearTimeout(slow);
      const d=snap.exists?snap.data():null;
      if(d&&(d.t||0)>S.t)applyRemote(d,live);
      else if(live&&!snap.metadata.hasPendingWrites){if(S.t>0&&(!d||(d.t||0)<S.t))queueCloud();else setSync('ok')}
    },()=>setSync('err'));
  }catch(e){setSync('err')}
}
const KEYLS='nawyk.key';
function syncKey(){
  let k='';try{k=localStorage.getItem(KEYLS)||''}catch(e){}
  if(!/^[A-Za-z0-9_-]{24,64}$/.test(k)){
    const a=new Uint8Array(24);(window.crypto||{getRandomValues:x=>x.forEach((_,i)=>x[i]=Math.random()*256)}).getRandomValues(a);
    k=btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    try{localStorage.setItem(KEYLS,k)}catch(e){}
  }
  return k;
}
async function initWorker(force){  // własny hosting (workers.dev / smialo.org): D1 przez Workera; tożsamość = e-mail z Access albo tajny klucz synchronizacji
  try{
    const url='/api/state/'+APPKEY,hd={'X-Sync-Key':syncKey()};
    setSync('wait');
    const r=await fetch(url,{credentials:'same-origin',cache:'no-store',headers:hd});if(!r.ok)throw new Error('http '+r.status);
    const j=await r.json();
    ref={set:d=>fetch(url,{method:'PUT',credentials:'same-origin',headers:Object.assign({'content-type':'application/json'},hd),body:JSON.stringify(d)}).then(x=>{if(!x.ok)throw new Error('put')})};
    const d=j&&j.data;
    if(d&&(force||(d.t||0)>S.t))applyRemote(d,true);
    else{if(S.t>0)queueCloud();setSync('ok')}
  }catch(e){ref=null;setSync('local')}
}

/* ───────── DŹWIĘK ───────── */
let AC=null;
function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}}
function beep(f,d){
  if(!S.set.snd||!AC)return;
  try{const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}
}

/* ───────── TIMER (z rytmem oddechu; dir: 1 wdech, 0 wydech, 2 zatrzymanie pełne, 3 zatrzymanie puste) ───────── */
function pacePhase(pace,el){
  const cyc=pace.reduce((a,p)=>a+p[1],0);let pos=el%cyc,i=0;
  while(pos>=pace[i][1]){pos-=pace[i][1];i++}
  return{i,n:Math.floor(pos)+1,len:pace[i][1],f:pos/pace[i][1]};
}
const pscale=(dir,f)=>.55+.45*(dir===1?f:dir===0?1-f:dir===2?1:0);
function makeTimer(root,build,onDone){
  root.innerHTML='<div class="tm" data-kind="idle"><div class="tm-tag"></div><div class="tm-lbl"></div><div class="tm-sub"></div><div class="tm-pace" hidden><div class="pring"><i></i></div><div class="pp"><b></b><span></span></div></div><div class="tm-clock">0:00</div><div class="bar"><i></i></div><div class="tm-row"><button class="btn pri" data-a="go" type="button">Start</button><button class="btn" data-a="skip" type="button">Dalej ›</button><button class="btn ghost" data-a="rst" type="button">Od nowa</button></div><div class="tm-tot"></div></div>';
  const q=s=>$(s,root), tm=$('.tm',root);
  const T={steps:[],i:0,rem:0,end:0,run:false,iv:0,started:false,total:0,lp:-1};
  const fmt=s=>Math.floor(s/60)+':'+pad(s%60);
  const msLeft=()=>T.run?Math.max(0,T.end-Date.now()):T.rem;
  const totalLeft=()=>{let s=msLeft()/1000;for(let k=T.i+1;k<T.steps.length;k++)s+=T.steps[k].sec;return Math.ceil(s)};
  function paint(){
    const s=T.steps[T.i],pc=q('.tm-pace');
    if(!s){
      tm.dataset.kind=T.steps.length?'done':'idle';pc.hidden=true;
      q('.tm-tag').textContent='';q('.tm-lbl').textContent=T.steps.length?'Gotowe':'';
      q('.tm-sub').textContent=T.steps.length?'Dobra robota — to się liczy.':'';
      q('.tm-clock').textContent='0:00';q('.bar i').style.width='100%';q('.tm-tot').textContent='';
      q('[data-a=go]').textContent='Od nowa';return;
    }
    const ms=msLeft();
    tm.dataset.kind=T.started?(s.kind||'work'):'idle';
    q('.tm-tag').textContent=s.tag||'';q('.tm-lbl').textContent=s.label;q('.tm-sub').textContent=s.sub||'';
    q('.tm-clock').textContent=fmt(Math.ceil(ms/1000));
    q('.bar i').style.width=Math.max(0,100-ms/(s.sec*10))+'%';
    q('.tm-tot').textContent='Pozostało '+fmt(totalLeft())+' z '+fmt(T.total);
    q('[data-a=go]').textContent=T.run?'Pauza':(T.started?'Wznów':'Start');
    if(s.pace){
      pc.hidden=false;
      if(T.started){
        const p=pacePhase(s.pace,Math.max(0,s.sec-ms/1000));
        q('.pp b').textContent=s.pace[p.i][0];q('.pp span').textContent=p.n+' / '+p.len;
        q('.pring i').style.transform='scale('+pscale(s.pace[p.i][2],p.f).toFixed(3)+')';
      }else{q('.pp b').textContent='Gotowy?';q('.pp span').textContent='Start';q('.pring i').style.transform='scale(.55)'}
    }else pc.hidden=true;
  }
  function load(){
    clearInterval(T.iv);T.steps=build();T.i=0;T.rem=(T.steps[0]?T.steps[0].sec:0)*1000;
    T.run=false;T.started=false;T.lp=-1;T.total=T.steps.reduce((a,s)=>a+s.sec,0);paint();
  }
  function adv(){
    T.i++;T.lp=-1;const s=T.steps[T.i];
    if(!s){clearInterval(T.iv);T.run=false;beep(880,.15);setTimeout(()=>beep(1100,.25),200);paint();onDone&&onDone();return}
    T.rem=s.sec*1000;T.end=Date.now()+T.rem;beep((s.kind||'work')==='work'?880:520,.12);paint();
  }
  function tick(){
    if(!T.run)return;
    if(Date.now()>=T.end){adv();return}
    const s=T.steps[T.i];
    if(s&&s.pace){const p=pacePhase(s.pace,s.sec-(T.end-Date.now())/1000);if(p.i!==T.lp){if(T.lp!==-1)beep(s.pace[p.i][2]===1||s.pace[p.i][2]===2?520:400,.1);T.lp=p.i}}
    paint();
  }
  function go(){
    unlock();
    if(!T.steps[T.i])load();
    if(T.run){T.rem=Math.max(0,T.end-Date.now());T.run=false;clearInterval(T.iv)}
    else{T.run=true;T.started=true;T.end=Date.now()+T.rem;clearInterval(T.iv);T.iv=setInterval(tick,250);beep(660,.1)}
    paint();
  }
  root.onclick=e=>{
    const b=e.target.closest('[data-a]');if(!b)return;
    if(b.dataset.a==='go')go();
    else if(b.dataset.a==='skip'){if(T.steps[T.i])adv()}
    else load();
  };
  load();
  return{load,running:()=>T.run,destroy:()=>{clearInterval(T.iv);T.run=false}};
}

/* ───────── POMOCNICZE ───────── */
function seg(box,opts,cur,fn){
  box.classList.add('seg');
  box.innerHTML=opts.map(o=>`<button type="button" data-v="${esc(o[0])}" aria-pressed="${String(o[0])===String(cur)}">${esc(o[1])}</button>`).join('');
  box.onclick=e=>{const b=e.target.closest('button');if(!b)return;$$('button',box).forEach(x=>x.setAttribute('aria-pressed',x===b));fn(b.dataset.v)};
}
const pk=(arr,n,seed)=>Array.from({length:n},(_,i)=>arr[(seed*n+i)%arr.length]);
const doneKeys=()=>S.days[TODAY]||{};
const isDone=k=>!!doneKeys()[k];
const isInfo=c=>c.blocks.length>0&&c.blocks.every(b=>b.type==='notes');
const TASKS=()=>LAY().filter(c=>!isInfo(c));
const allDone=()=>{const t=TASKS();return t.length>0&&t.every(c=>isDone(c.id))};
let SUM_OPEN=false, CI_EDIT=false;
const sumReady=()=>S.sm===TODAY||dd(TODAY)-dd(S.sm||S.start||TODAY)>=3;
const weekReady=()=>S.sw===TODAY||dd(TODAY)-dd(S.sw||S.start||TODAY)>=7;
const nextSumKey=()=>{const d=new Date((S.sm===TODAY?TODAY:(S.sm||S.start||TODAY))+'T12:00:00');d.setDate(d.getDate()+3);return keyOf(d)};
function issueSum(){if(S.sm!==TODAY&&dd(TODAY)-dd(S.sm||S.start||TODAY)>=3){if(weekReady())S.sw=TODAY;S.sm=TODAY;save()}}
const scrollTo=(sel,b)=>{const e=$(sel);if(e&&e.scrollIntoView)try{e.scrollIntoView({behavior:'smooth',block:b||'nearest'})}catch(x){}};
function openSum(){SUM_OPEN=true;renderSummary();scrollTo('#sumCard','start')}
function setDone(k,v){
  const was=allDone(),d=S.days[TODAY]||(S.days[TODAY]={});
  if(v)d[k]=1;else delete d[k];
  if(!Object.keys(d).length)delete S.days[TODAY];
  save();paintDone();
  const fin=v&&!was&&allDone();
  if(fin&&sumReady())SUM_OPEN=true;
  renderSurvey();renderSummary();
  if(v)cheer(k,fin);
  if(fin)scrollTo(sumReady()?'#sumCard':'#survey');
}
const CHEER=['Dobra robota! Tak buduje się nawyk.','Jest! Kolejny krok za Tobą.','Świetnie — małe kroki wygrywają.','Brawo! Tak trzymać.','Zrobione — to się liczy najbardziej.'];
const MILES=[3,7,14,21,30,50,100];
function cheer(k,fin){
  const el=document.querySelector('[data-tick="'+k+'"]'),tk=TASKS(),cnt=tk.filter(c=>isDone(c.id)).length,tot=tk.length,first=Object.keys(doneKeys()).length===1,st=streak();
  FX.celebrate(el,fin);FX.haptic(fin?[20,40,20]:14);unlock();
  if(S.set.snd){beep(660,.09);setTimeout(()=>beep(880,.09),110);if(fin)setTimeout(()=>beep(1175,.2),230)}
  let m;
  if(fin)m='🎉 Wszystko na dziś zrobione! Wróć jutro po kolejną porcję.';
  else if(first&&MILES.includes(st))m='🔥 Seria '+st+' dni z rzędu — niesamowite!';
  else if(first)m='⚡ Pierwsze zrobione — najtrudniejszy krok za Tobą!';
  else m='✨ '+CHEER[(cnt+DN)%CHEER.length]+' Jeszcze '+(tot-cnt)+' do końca.';
  FX.toast(m);
}
const yid=u=>{const s=String(u).trim();const m=s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);if(m)return m[1];return /^[\w-]{11}$/.test(s)?s:null};
const exMin=e=>e.m||Math.max(1,Math.round((e.sec||60)/60));
const exLabel=e=>(e.c?e.c+' · ':'')+'ok. '+exMin(e)+' min';
const QI={};
const hueOf=c=>{let h=0;for(const ch of String(c||'x'))h=(h*31+ch.charCodeAt(0))%360;return h};
const learning=()=>Object.keys(S.days).length<4;
const deadline=e=>{const w=e.when||'';return /wieczor|przed snem/i.test(w)?'dziś, najlepiej wieczorem — najpóźniej przed snem':/rano/i.test(w)?'najlepiej rano; najpóźniej do końca dnia':'dziś, do końca dnia'};
const quoteHTML=bid=>{const q=QUOTES[(QI[bid]||0)%QUOTES.length];return `<h5>Przeczytaj na głos</h5><blockquote class="qt"><p>${esc(q.x).replace(/\n/g,'<br>')}</p><cite>— ${esc(q.a)}, ${esc(q.w)}</cite></blockquote><button class="btn sm" type="button" data-a="nq">Pokaż następny ›</button>`};
function exHTML(e,label,bid){
  const fig=e.img&&FIGS[e.img]?`<figure class="fig">${FIGS[e.img]}</figure>`:'';
  const L=learning();
  return `<div class="task"><span class="pill" style="--ch:${hueOf(e.c||label)}">${esc(label)}</span><h4>${esc(e.t)}</h4>
  <dl class="what">${e.when?`<dt>Kiedy</dt><dd>${esc(e.when)}</dd>`:''}<dt>Zrobione, gdy</dt><dd>${esc(e.ok||'wykonasz ćwiczenie do końca, bez bólu.')}</dd><dt>Do kiedy</dt><dd>${esc(deadline(e))}</dd></dl></div>
  ${e.read?`<div class="read">${quoteHTML(bid)}</div>`:''}
  <details class="how"${L?' open':''}><summary>Instrukcja krok po kroku<small>${L?'':' — rozwiń, gdy potrzebujesz przypomnienia'}</small></summary>
  <ol class="exsteps">${(e.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
  ${fig}
  ${e.say?`<h5>Powiedz np.</h5><p class="say">${esc(e.say)}</p>`:''}
  ${e.solo?`<h5>Nie masz dziś z kim?</h5><p>${esc(e.solo)}</p>`:''}</details>`;
}
const exTimer=e=>{
  if(e.tm&&e.tm.length)return e.tm.map(x=>({label:x[0],sub:x[2]||'Według instrukcji powyżej.',tag:e.t,sec:x[1],kind:'work',pace:e.pace}));
  if(e.sec)return[{label:e.t,sub:'Ćwicz teraz — aplikacja odmierza czas.',sec:e.sec,kind:'work',pace:e.pace}];
  return[];
};
function armed(btn,fn){
  if(btn.dataset.armed){fn();return}
  btn.dataset.armed='1';const o=btn.textContent;btn.textContent='Na pewno?';
  setTimeout(()=>{if(btn.isConnected){delete btn.dataset.armed;btn.textContent=o}},3000);
}
const findC=id=>LAY().find(c=>c.id===id);
function findB(bid){const L=LAY();for(const c of L){const i=c.blocks.findIndex(b=>b.id===bid);if(i>=0)return{c,b:c.blocks[i],i}}return null}
const blockEl=bid=>$('section.blk[data-b="'+bid+'"]');
const mountAll=type=>LAY().forEach(c=>c.blocks.forEach(b=>{if(b.type===type)mountBlock(b.id)}));
function mountBlock(bid){
  const f=findB(bid);if(!f)return;
  const sec=blockEl(bid),el=sec&&$('.bb',sec);if(!el)return;
  if(TIM[bid]){TIM[bid].destroy();delete TIM[bid]}
  BT[f.b.type].mount(el,f.b,f.c);
}
function showEmbedNote(){
  $$('.embedNote').forEach(n=>{
    n.hidden=!EMBED_BLOCKED;
    if(EMBED_BLOCKED)n.textContent='Ta strona (podgląd w Claude) nie pozwala osadzać wideo — nagrania otwieraj przyciskiem „YouTube ↗”. Na własnym hostingu odtwarzacz zagra tutaj, z przyciskiem play i paskiem postępu.';
  });
}
const ytUrl=t=>t.id?'https://www.youtube.com/watch?v='+t.id:'';
const ytHref=t=>t.id?ytUrl(t):(t.q?'https://www.youtube.com/results?search_query='+encodeURIComponent(t.q):'https://www.youtube.com/');
const PARSE={
  lines:v=>v.split('\n').map(s=>s.trim().slice(0,120)).filter(Boolean).slice(0,12),
  steps:v=>v.split('\n').map(l=>l.split('|').map(s=>s.trim())).filter(p=>p[0]).slice(0,30).map(p=>({t:p[0].slice(0,50),sec:Math.min(1800,Math.max(5,parseInt(p[1],10)||30)),sub:(p[2]||'').slice(0,200)})),
  items:(v,b)=>{const old=b.cfg.items||[];return v.split('\n').map(s=>s.trim().slice(0,100)).filter(Boolean).slice(0,30).map(x=>{const o=old.find(i=>i.x===x);return{id:o?o.id:uid(),x}})},
};
const shortT=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
const lastNote=bid=>{const k=Object.keys(S.notes).filter(d=>d<TODAY&&S.notes[d][bid]).sort().pop();return k?{k,t:S.notes[k][bid]}:null};
const lastNoteAny=()=>{const k=Object.keys(S.notes).filter(d=>d<TODAY&&Object.keys(S.notes[d]).length).sort().pop();return k?{k,t:Object.keys(S.notes[k]).map(b=>S.notes[k][b]).join(' · ')}:null};
const dd=k=>Math.floor(Date.UTC(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8,10))/864e5);
const dlabel=k=>new Date(k+'T12:00:00').toLocaleDateString('pl-PL',{weekday:'short',day:'numeric',month:'short'});
const selOpts=(arr,cur)=>arr.map(([k,n])=>`<option value="${esc(k)}" ${String(cur)===String(k)?'selected':''}>${esc(n)}</option>`).join('');

/* ───────── BLOKI ───────── */
const dItems=b=>((PACKS[b.cfg.pack]||PACKS.wlasne).items).concat(b.cfg.own||[]);
const gSteps=b=>b.cfg.set==='custom'?(b.cfg.steps||[]):(GS[b.cfg.set]||GS.mob).steps;
const moveList=(t,lv,d)=>{const g=k=>WL[k][lv]||WL[k][1];return t==='upper'?pk(g('upper'),5,d):t==='lower'?pk(g('lower'),5,d):t==='grip'?pk(g('grip'),5,d):[...pk(g('upper'),2,d),...pk(g('lower'),2,d+1),...pk(g('grip'),1,d+2)]};
const moveListOld=(t,d)=>t==='upper'?pk(UP,5,d):t==='lower'?pk(LO,5,d):t==='grip'?pk(GR,5,d):[...pk(UP,2,d),...pk(LO,2,d+1),...pk(GR,1,d+2)];
const BT={
  media:{ic:'▶️',n:'Nagrania YouTube',sp:7,
    def:()=>({h:'Nagrania',cfg:{tracks:[]}}),
    sum:b=>(b.cfg.tracks||[]).length+' nagrań',
    mount(el,b){
      const tr=b.cfg.tracks||(b.cfg.tracks=[]);
      const row=(t,i)=>`<li data-i="${i}"><div class="trk-top"><input class="tn" type="text" value="${esc(t.title)}" maxlength="60" aria-label="Nazwa nagrania ${i+1}"><span class="len">${esc(t.len||'')}</span></div><div class="trk-url"><input class="tu" type="url" value="${esc(ytUrl(t))}" placeholder="${t.q?'Kliknij „Szukaj ↗”, wybierz film i wklej tu jego link':'Wklej link YouTube'}" aria-label="Link YouTube ${i+1}"><button class="btn sm" type="button" data-a="play">▶ Odtwórz</button><a class="btn sm" data-a="yt" href="${esc(ytHref(t))}" target="_blank" rel="noopener noreferrer">${t.id?'YouTube ↗':'Szukaj ↗'}</a><button class="btn sm ghost" type="button" data-a="del" aria-label="Usuń nagranie">×</button></div><div class="msg"></div><div class="pl"></div></li>`;
      el.innerHTML=`<ul class="trk">${tr.map(row).join('')}</ul><div class="note warn embedNote" hidden></div><div class="fin"><button class="btn sm" data-a="add" type="button">+ Dodaj nagranie</button></div>`;
      showEmbedNote();
      el.onchange=e=>{
        const li=e.target.closest('li[data-i]');if(!li)return;const t=tr[+li.dataset.i];if(!t)return;
        if(e.target.classList.contains('tn')){t.title=e.target.value.trim().slice(0,60)||'Nagranie';save();return}
        if(e.target.classList.contains('tu')){
          const id=yid(e.target.value),m=$('.msg',li);$('.pl',li).innerHTML='';
          if(!e.target.value.trim()){t.id=null;m.textContent='';save();return}
          if(!id){m.textContent='To nie wygląda na link YouTube. Wklej adres z paska przeglądarki.';m.className='msg err';return}
          t.id=id;m.textContent='Zapisano.';m.className='msg';
          const a=$('[data-a=yt]',li);a.href=ytUrl(t);a.textContent='YouTube ↗';
          e.target.value=ytUrl(t);save();
        }
      };
      el.onclick=e=>{
        const bt=e.target.closest('[data-a]');if(!bt)return;
        if(bt.dataset.a==='add'){tr.push({id:null,title:'Nowe nagranie',len:''});save();mountBlock(b.id);const l=$$('.tu',el);l[l.length-1].focus();return}
        const li=bt.closest('li[data-i]');if(!li)return;const i=+li.dataset.i;
        if(bt.dataset.a==='del'){tr.splice(i,1);save();mountBlock(b.id);paintSums();return}
        if(bt.dataset.a==='play'){
          const box=$('.pl',li),m=$('.msg',li);
          if(box.firstChild){box.innerHTML='';return}
          const id=yid($('.tu',li).value);
          if(!id){m.textContent='Najpierw wklej poprawny link YouTube (przycisk „Szukaj ↗” otwiera wyniki).';m.className='msg err';return}
          box.innerHTML=`<div class="ytw"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1" title="YouTube" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
        }
      };
    }},

  guided:{ic:'⏱️',n:'Prowadzona sesja z timerem',sp:2,
    def:()=>({h:'Sesja z timerem',cfg:{set:'mob',len:5}}),
    sum:b=>b.cfg.set==='custom'?'Własna sesja':(GS[b.cfg.set]||GS.mob).n,
    cfgUI:b=>`<label>Sesja</label><select data-cf="set" data-rc="1" data-b="${b.id}">${selOpts(SET_NAMES().concat([['custom','Własna sesja (wpiszę kroki)']]),b.cfg.set)}</select>${b.cfg.set==='custom'?`<label>Kroki — jedna linia: Nazwa | sekundy | opis</label><textarea data-cf="steps" data-ty="steps" data-b="${b.id}" rows="5" placeholder="Rozciąganie karku | 30 | Ucho do barku">${esc((b.cfg.steps||[]).map(s=>[s.t,s.sec,s.sub||''].join(' | ')).join('\n'))}</textarea>`:''}`,
    mount(el,b,c){
      const custom=b.cfg.set==='custom',k=custom?1:(b.cfg.len||5)/5,base=gSteps(b);
      const scale=s=>Math.max(5,Math.round(s*k));
      el.innerHTML=(custom?'':'<div class="rowline"><span>Czas sesji</span><span class="lenSeg"></span></div>')+
        (base.length?`<ul class="steps gl">${(()=>{let g='',n=0;return base.map(s=>{const h=s.grp&&s.grp!==g?(g=s.grp,`<li class="gh">${s.grp==='Oddechowe'?'Część 1 — ćwiczenia oddechowe':'Część 2 — ćwiczenia dźwiękowe'}</li>`):'';n++;return h+`<li><b>${n}. ${esc(s.t)}</b> · ${s.sides?'2 × ':''}${scale(s.sec)} s<br><span class="sb">${esc(s.sub||'')}</span></li>`}).join('')})()}</ul><div class="tmr"></div>`:'<p class="note">Brak kroków. Włącz „Edytuj układ” (menu ⋯) i wpisz kroki sesji.</p>');
      if(!custom)seg($('.lenSeg',el),[[5,'5 min'],[10,'10 min']],b.cfg.len||5,v=>{b.cfg.len=+v;save();mountBlock(b.id)});
      if(!base.length)return;
      TIM[b.id]=makeTimer($('.tmr',el),()=>{
        const out=[];
        base.forEach(s=>{
          const sec=scale(s.sec);
          if(s.sides)['Lewa strona','Prawa strona'].forEach(sd=>out.push({label:s.t,tag:sd,sub:s.sub,sec,kind:'work',pace:s.pace}));
          else out.push({label:s.t,tag:s.grp,sub:s.sub,sec,kind:'work',pace:s.pace});
        });
        return out;
      },()=>setDone(c.id,true));
    }},

  daily:{ic:'🎯',n:'Ćwiczenie dnia',sp:1,
    def:()=>({h:'',cfg:{pack:'roz',own:[],cat:''}}),
    sum:b=>CUR[b.id]?CUR[b.id].t:'',
    cfgUI:b=>`<label>Zestaw ćwiczeń</label><select data-cf="pack" data-b="${b.id}">${selOpts(Object.entries(PACKS).map(([k,p])=>[k,p.n]),b.cfg.pack)}</select>
      <label>Moje ćwiczenia (dołączone do zestawu)</label>
      <ul class="owns">${(b.cfg.own||[]).map((o,i)=>`<li><span>${esc(o.t)} <small>· ${esc(o.c||'Moje')}</small></span><button class="btn sm danger" type="button" data-act="owndel" data-b="${b.id}" data-i="${i}">Usuń</button></li>`).join('')||'<li><span class="note">Brak.</span></li>'}</ul>
      <div class="addrow"><input class="ow-t" type="text" placeholder="Nazwa" maxlength="60" aria-label="Nazwa ćwiczenia"><input class="ow-c" type="text" placeholder="Rodzaj, np. Relaks" maxlength="20" aria-label="Rodzaj"><input class="ow-m" type="number" min="1" max="60" placeholder="Min" style="flex:0 0 74px" aria-label="Minuty"></div>
      <textarea class="ow-s" rows="3" placeholder="Kroki — każdy w osobnej linii" aria-label="Kroki ćwiczenia" style="margin-top:6px"></textarea>
      <div class="drow" style="margin-top:6px"><button class="btn sm" type="button" data-act="ownadd" data-b="${b.id}">+ Dodaj ćwiczenie</button></div>`,
    mount(el,b,c){
      const all0=dItems(b),hasLv=all0.some(e=>e.lv),LV=b.cfg.lv||1,all=hasLv?all0.filter(e=>!e.lv||e.lv<=LV):all0;
      const cats=[...new Set(all.map(e=>e.c).filter(Boolean))];
      const cat=cats.includes(b.cfg.cat)?b.cfg.cat:'',list=cat?all.filter(e=>e.c===cat):all;
      if(!list.length){CUR[b.id]=null;el.innerHTML='<p class="note">Brak ćwiczeń w tym zestawie. Włącz „Edytuj układ” (menu ⋯) i dodaj własne albo zmień zestaw.</p>';return}
      const ex=list[(DN+(OFF[b.id]||0))%list.length];CUR[b.id]=ex;
      if(QI[b.id]==null)QI[b.id]=DN%QUOTES.length;
      el.innerHTML=(hasLv?'<div class="rowline"><span>Poziom</span><span class="lvSeg"></span></div>':'')+(cats.length>1?'<div class="rowline"><span>Rodzaj ćwiczenia</span><span class="catSeg"></span></div>':'')+`<div class="ex">${exHTML(ex,exLabel(ex),b.id)}</div><div class="tmr"></div><div class="fin"><button class="btn ghost" data-a="next" type="button">Inne ćwiczenie ↻</button></div>`;
      if(hasLv)seg($('.lvSeg',el),LVN,LV,v=>{b.cfg.lv=+v;OFF[b.id]=0;save();mountBlock(b.id);paintSums()});
      if(cats.length>1)seg($('.catSeg',el),[['','Wszystkie']].concat(cats.map(x=>[x,x])),cat,v=>{b.cfg.cat=v;OFF[b.id]=0;save();mountBlock(b.id);paintSums()});
      const steps=exTimer(ex);
      if(steps.length)TIM[b.id]=makeTimer($('.tmr',el),()=>steps,()=>setDone(c.id,true));else $('.tmr',el).remove();
      $('[data-a=next]',el).onclick=()=>{OFF[b.id]=(OFF[b.id]||0)+1;QI[b.id]=(QI[b.id]||0)+1;mountBlock(b.id);paintSums()};
      el.onclick=e=>{const q=e.target.closest('[data-a=nq]');if(q){QI[b.id]=(QI[b.id]||0)+1;const r=$('.read',el);if(r)r.innerHTML=quoteHTML(b.id)}};
    }},

  workout:{ic:'💪',n:'Trening (losowy zestaw, 3 poziomy)',sp:3,
    def:()=>({h:'Trening',cfg:{train:'mix',len:5,lv:1}}),
    sum:b=>TRAIN[b.cfg.train||'mix']+' · '+(LVN.find(x=>x[0]===(b.cfg.lv||1))||LVN[0])[1].toLowerCase()+' · '+(b.cfg.len||5)+' min',
    mount(el,b,c){
      const cfg=b.cfg,LV=cfg.lv||1,list=moveList(cfg.train||'mix',LV,DN+(OFF[b.id]||0)),rounds=(cfg.len||5)>=10?2:1;
      const lvNote={1:'Wersja łagodna: z oparciem lub ścianą, bez schodzenia na podłogę. Przerwij przy bólu lub zawrotach głowy.',2:'Wymaga trochę siły i ruchomości stawów. Rób wolno, bez bólu.',3:'Dla osób z dobrą sprawnością. Przy bólu stawów wróć do poziomu niżej.'}[LV];
      el.innerHTML=`<div class="rowline"><span>Poziom</span><span class="lvSeg"></span></div><p class="note" style="margin-top:0">${lvNote}</p><div class="rowline"><span>Jaki trening</span><span class="trSeg"></span></div><div class="rowline"><span>Czas</span><span class="lenSeg"></span></div>
      <div class="task"><span class="pill" style="--ch:${hueOf('trening'+LV)}">${esc(LVN[LV-1][1])} · ${cfg.len||5} min</span><h4>Dziś: ${list.length} ćwiczeń po 40 s</h4><dl class="what"><dt>Kiedy</dt><dd>Teraz albo w wolnej chwili, 5–10 minut.</dd><dt>Zrobione, gdy</dt><dd>przejdziesz całą serię w swoim tempie (liczy się ruch, nie liczba powtórzeń).</dd><dt>Do kiedy</dt><dd>dziś, do końca dnia</dd></dl><ol class="steps wl">${list.map(e=>`<li><b>${esc(e[0])}</b> — ${esc(e[1])}</li>`).join('')}</ol></div>
      <details class="how"${learning()?' open':''}><summary>Jak wykonać — pozycja startowa i końcowa<small>${learning()?'':' — rozwiń, gdy potrzebujesz przypomnienia'}</small></summary><ol class="exsteps">${list.map(e=>`<li><b>${esc(e[0])}</b><br><span class="ps">▶ Start:</span> ${esc(e[2])}<br><span class="pe">■ Koniec:</span> ${esc(e[3])}</li>`).join('')}</ol></details>
      <div class="tmr"></div><div class="fin"><button class="btn ghost" data-a="next" type="button">Inne ćwiczenia ↻</button></div><p class="note">Lekko, byle zrobić. 40 s pracy, 20 s przerwy.</p>`;
      seg($('.lvSeg',el),LVN,LV,v=>{cfg.lv=+v;OFF[b.id]=0;save();mountBlock(b.id);paintSums()});
      seg($('.trSeg',el),Object.entries(TRAIN),cfg.train||'mix',v=>{cfg.train=v;OFF[b.id]=0;save();mountBlock(b.id);paintSums()});
      seg($('.lenSeg',el),[[5,'5 min'],[10,'10 min']],cfg.len||5,v=>{cfg.len=+v;save();mountBlock(b.id);paintSums()});
      TIM[b.id]=makeTimer($('.tmr',el),()=>{
        const out=[{label:'Przygotuj się',sub:'Pierwsze ćwiczenie: '+list[0][0],sec:5,kind:'rest'}];
        for(let r=0;r<rounds;r++)list.forEach((e,i)=>{
          out.push({label:e[0],sub:e[1],sec:40,kind:'work',tag:(rounds>1?'Runda '+(r+1)+' · ':'')+(i+1)+'/'+list.length});
          if(!(r===rounds-1&&i===list.length-1))out.push({label:'Odpoczynek',sub:'Następne: '+list[(i+1)%list.length][0],sec:20,kind:'rest'});
        });
        return out;
      },()=>setDone(c.id,true));
      $('[data-a=next]',el).onclick=()=>{OFF[b.id]=(OFF[b.id]||0)+1;mountBlock(b.id)};
    }},

  journal:{ic:'📓',n:'Dziennik (pytania)',sp:6,
    def:()=>({h:'Dziennik',cfg:{p:J3.slice()}}),
    sum:b=>{const n=(b.cfg.p||[]).length;return n+' '+(n===1?'pytanie':n<5?'pytania':'pytań')},
    cfgUI:b=>`<label>Pytania — jedno w linii</label><textarea data-cf="p" data-ty="lines" data-b="${b.id}" rows="4">${esc((b.cfg.p||[]).join('\n'))}</textarea>`,
    mount(el,b,c){
      const P=b.cfg.p&&b.cfg.p.length?b.cfg.p:J3,cur=(S.journal[TODAY]||{})[b.id]||[];
      const y=new Date();y.setDate(y.getDate()-1);
      const prev=((S.journal[keyOf(y)]||{})[b.id]||[])[P.length-1];
      el.innerHTML='<p class="dl">⏱ Wypełnij wieczorem, najpóźniej do końca dnia — to 3 krótkie zdania.</p>'+(prev?`<div class="prev">Wczoraj — ${esc(P[P.length-1])}: „${esc(prev)}”</div>`:'')+P.map((q,i)=>`<label class="jl" for="j-${b.id}-${i}">${esc(q)}</label><textarea id="j-${b.id}-${i}" rows="2" maxlength="600">${esc(cur[i]||'')}</textarea>`).join('');
      let jt=0;
      const flush=()=>{
        clearTimeout(jt);
        const v=$$('textarea',el).map(t=>t.value.trim()),day=S.journal[TODAY]||(S.journal[TODAY]={});
        if(v.some(Boolean))day[b.id]=v;else delete day[b.id];
        if(!Object.keys(day).length)delete S.journal[TODAY];
        if(v.some(Boolean)&&!isDone(c.id))setDone(c.id,true);else save();
      };
      el.oninput=()=>{clearTimeout(jt);jt=setTimeout(flush,700)};
      el.onchange=flush;
    }},

  todo:{ic:'✅',n:'Lista zadań',sp:4,
    def:()=>({h:'',cfg:{}}),
    sum:()=>{const it=S.todos.filter(t=>!t.done||t.done===TODAY),o=it.filter(t=>!t.done).length;return it.length?(o?o+' do zrobienia':'Wszystko zrobione'):'Pusta lista'},
    mount(el,b,c){
      const items=S.todos.filter(t=>!t.done||t.done===TODAY);
      el.innerHTML=`<p class="dl">🔔 Wróć wieczorem odhaczyć listę — niezrobione przechodzą na jutro.</p><div class="addrow"><input class="tdIn" type="text" placeholder="Dodaj rzecz do zrobienia i Enter" aria-label="Nowe zadanie" maxlength="140"><button class="btn" data-a="add" type="button">Dodaj</button></div><ul class="td">${items.length?items.map(t=>`<li class="${t.done?'on':''}"><label><input type="checkbox" data-t="${esc(t.id)}" ${t.done?'checked':''}><span>${esc(t.x)}</span></label><button class="x" type="button" data-x="${esc(t.id)}" aria-label="Usuń">×</button></li>`).join(''):'<li class="empty">Pusto. Dodaj jedną małą rzecz.</li>'}</ul>`;
      const add=()=>{
        const i=$('.tdIn',el),x=i.value.trim();if(!x)return;
        S.todos.push({id:uid(),x:x.slice(0,140),done:0,c:TODAY});save();mountAll('todo');paintSums();
        const n=blockEl(b.id)&&$('.tdIn',blockEl(b.id));if(n)n.focus();
      };
      el.onclick=e=>{
        if(e.target.closest('[data-a=add]'))return add();
        const x=e.target.closest('[data-x]');
        if(x){S.todos=S.todos.filter(t=>t.id!==x.dataset.x);save();mountAll('todo');paintSums()}
      };
      el.onkeydown=e=>{if(e.key==='Enter'&&e.target.classList.contains('tdIn')){e.preventDefault();add()}};
      el.onchange=e=>{
        const ch=e.target.closest('input[data-t]');if(!ch)return;
        const t=S.todos.find(t=>t.id===ch.dataset.t);if(!t)return;
        t.done=ch.checked?TODAY:0;save();mountAll('todo');paintSums();
        if(S.todos.some(t=>t.done===TODAY))setDone(c.id,true);
      };
    }},

  notes:{ic:'📝',n:'Notatki i postępy',sp:8,
    def:()=>({h:'Notatki',cfg:{}}),
    sum:b=>{const t=(S.notes[TODAY]||{})[b.id];if(t)return 'Dziś: '+shortT(t,40);const p=lastNote(b.id);return p?'Ostatnio: '+shortT(p.t,40):'Zapisz spostrzeżenia'},
    mount(el,b){
      const cur=(S.notes[TODAY]||{})[b.id]||'',p=lastNote(b.id);
      const hist=Object.keys(S.notes).filter(k=>k<TODAY&&S.notes[k][b.id]&&(!p||k!==p.k)).sort().reverse().slice(0,13);
      el.innerHTML=`<p class="dl">⏱ Zapisz do końca dnia — jutro zobaczysz tę notatkę na górze strony jako przypomnienie.</p>${p?`<div class="remind"><b>📌 Z ${esc(dlabel(p.k))}:</b> ${esc(p.t)}</div>`:'<p class="note">Zapisz dziś jedno spostrzeżenie — jutro zobaczysz je tutaj jako przypomnienie, zamiast pustego pola.</p>'}<label class="jl" for="nt-${b.id}">Dzisiejsze spostrzeżenia i postępy</label><textarea id="nt-${b.id}" rows="4" maxlength="1500" placeholder="${p?'Co się zmieniło od ostatniej notatki? Co szło lepiej, co trudniej?':'Co zauważyłeś/aś? Co szło lepiej, co było trudne, jaki widzisz postęp?'}">${esc(cur)}</textarea>${hist.length?`<details class="nh"><summary>Starsze notatki (${hist.length})</summary><ul class="nhl">${hist.map(k=>`<li><b>${esc(dlabel(k))}</b> ${esc(S.notes[k][b.id])}</li>`).join('')}</ul></details>`:''}`;
      let jt=0;
      const flush=()=>{
        clearTimeout(jt);
        const v=$('textarea',el).value.trim(),day=S.notes[TODAY]||(S.notes[TODAY]={});
        if(v)day[b.id]=v;else delete day[b.id];
        if(!Object.keys(day).length)delete S.notes[TODAY];
        save();paintSums();renderSummary();
      };
      el.oninput=()=>{clearTimeout(jt);jt=setTimeout(flush,700)};
      el.onchange=flush;
    }},

  routine:{ic:'☑️',n:'Checklista dnia',sp:5,
    def:()=>({h:'Checklista',cfg:{items:[]}}),
    sum:b=>{const it=b.cfg.items||[],ck=S.chk[TODAY]||{};return it.length?it.filter(i=>ck[i.id]).length+'/'+it.length+' zrobione':''},
    cfgUI:b=>`<label>Pozycje — jedna w linii</label><textarea data-cf="items" data-ty="items" data-b="${b.id}" rows="4" placeholder="Szklanka wody&#10;10 minut spaceru">${esc((b.cfg.items||[]).map(i=>i.x).join('\n'))}</textarea>`,
    mount(el,b,c){
      const it=b.cfg.items||[],ck=S.chk[TODAY]||{};
      el.innerHTML=it.length?`<p class="dl">⏱ Odhaczaj w ciągu dnia — rozliczasz się do wieczora.</p><ul class="td">${it.map(i=>`<li class="${ck[i.id]?'on':''}"><label><input type="checkbox" data-i="${esc(i.id)}" ${ck[i.id]?'checked':''}><span>${esc(i.x)}</span></label></li>`).join('')}</ul>`:'<p class="note">Pusto. Włącz „Edytuj układ” (menu ⋯) i dopisz pozycje.</p>';
      el.onchange=e=>{
        const t=e.target.closest('input[data-i]');if(!t)return;
        const day=S.chk[TODAY]||(S.chk[TODAY]={});
        if(t.checked)day[t.dataset.i]=1;else delete day[t.dataset.i];
        t.closest('li').classList.toggle('on',t.checked);
        if(it.length&&it.every(i=>day[i.id]))setDone(c.id,true);else save();
        paintSums();
      };
    }},
};

/* ───────── KARTY ───────── */
function blockHTML(c,b){
  const T=BT[b.type];
  const ed=EDIT?`<div class="edblk"><span class="chip">${T.ic} ${esc(T.n)}</span><input class="eh" type="text" data-f="bh" data-b="${b.id}" value="${esc(b.h||'')}" placeholder="Nagłówek (opcjonalny)" maxlength="60" aria-label="Nagłówek bloku"><button class="btn sm" type="button" data-act="bup" data-b="${b.id}" aria-label="Wyżej">↑</button><button class="btn sm" type="button" data-act="bdn" data-b="${b.id}" aria-label="Niżej">↓</button><button class="btn sm danger" type="button" data-act="bdel" data-b="${b.id}">Usuń blok</button></div>${T.cfgUI?`<div class="bcfg">${T.cfgUI(b)}</div>`:''}`:'';
  return `<section class="blk" data-b="${b.id}">${ed}${b.h?`<h3 class="bh">${esc(b.h)}</h3>`:''}<div class="bb"></div></section>`;
}
const SC=(k,v)=>`<div class="scale" role="group" aria-label="${k==='q'?'Ocena wykonania':'Samopoczucie po ćwiczeniach'}, skala 1 do 5">${[1,2,3,4,5].map(n=>`<button type="button" data-sc="${k}" data-v="${n}" aria-pressed="${v===n}">${n}</button>`).join('')}</div>`;
function cardHTML(c,i,n){
  const ed=EDIT?`<div class="edcard"><input class="et" type="text" data-f="ctitle" data-c="${c.id}" value="${esc(c.title)}" maxlength="40" aria-label="Nazwa sekcji"><input class="et" type="text" style="flex:0 0 64px;width:64px;text-align:center" data-f="cicon" data-c="${c.id}" value="${esc(c.ic||'')}" maxlength="4" aria-label="Ikona sekcji"><button class="btn sm" type="button" data-act="cup" data-c="${c.id}" ${i?'':'disabled'} aria-label="Sekcja wyżej">↑</button><button class="btn sm" type="button" data-act="cdn" data-c="${c.id}" ${i<n-1?'':'disabled'} aria-label="Sekcja niżej">↓</button><button class="btn sm danger" type="button" data-act="cdel" data-c="${c.id}">Usuń sekcję</button></div>`:'';
  const add=EDIT?`<div class="adder"><select class="addType" aria-label="Typ nowego bloku">${Object.entries(BT).map(([k,t])=>`<option value="${k}">${t.ic} ${esc(t.n)}</option>`).join('')}</select><button class="btn sm" type="button" data-act="badd" data-c="${c.id}">+ Dodaj blok</button></div>`:'';
  const info=isInfo(c);
  return `<details class="card" id="card-${c.id}" data-card="${c.id}"><summary>${info?'':`<button class="tick" type="button" data-tick="${c.id}" aria-pressed="false" aria-label="Oznacz: ${esc(c.title)}"></button>`}<span class="ic">${esc(c.ic||'•')}</span><span class="ttl"><b>${esc(c.title)}</b><small id="sum-${c.id}"></small></span><span class="chev"></span></summary><div class="body">${ed}${c.blocks.map(b=>blockHTML(c,b)).join('')}${add}${info?'':`<div class="fin"><button class="btn pri" data-done="${c.id}" type="button"></button></div><p class="tiny donehint">Dotknij, gdy wykonasz tę sekcję — zaliczy się do dzisiejszego postępu (kółko u góry).</p>`}</div></details>`;
}
function renderCards(){
  const open=new Set($$('#cards details[open]').map(d=>d.dataset.card));
  Object.values(TIM).forEach(t=>t.destroy());for(const k in TIM)delete TIM[k];
  const L=LAY();
  $('#cards').innerHTML=L.length?L.map((c,i)=>cardHTML(c,i,L.length)).join(''):'<p class="note">Brak sekcji. Menu ⋯ → „Zestawy nawyków” albo „Edytuj układ”.</p>';
  $$('#cards details.card').forEach(d=>{if(EDIT||open.has(d.dataset.card))d.open=true});
  L.forEach(c=>c.blocks.forEach(b=>mountBlock(b.id)));
  $('#addCard').innerHTML=EDIT?'<button class="btn" data-act="cadd" type="button">+ Nowa sekcja</button>':'';
  if(!POPPED&&!FX.calm()){$$('#cards details.card').forEach((d,i)=>{d.style.setProperty('--i',i);d.classList.add('pop')});POPPED=true}
  applyTones();paintDone();paintSums();
}
let POPPED=false;
function paintSums(){
  LAY().forEach(c=>{
    const e=$('#sum-'+c.id);if(!e)return;
    const parts=c.blocks.slice().sort((a,b)=>BT[a.type].sp-BT[b.type].sp).map(b=>BT[b.type].sum?BT[b.type].sum(b):'').filter(Boolean);
    e.textContent=parts.slice(0,2).join(' · ');
  });
}
function streak(){
  const n=k=>Object.keys(S.days[k]||{}).length;let c=0,d=new Date();
  if(!n(keyOf(d)))d.setDate(d.getDate()-1);
  while(n(keyOf(d))){c++;d.setDate(d.getDate()-1)}
  return c;
}
const RC=2*Math.PI*22;
let LASTCNT=-1;
function paintDone(){
  const L=TASKS(),dk=doneKeys(),total=L.length,cnt=L.filter(c=>dk[c.id]).length;
  L.forEach(c=>{
    const on=!!dk[c.id],e=$('#card-'+c.id);if(!e)return;
    e.classList.toggle('done',on);
    $('[data-tick]',e).setAttribute('aria-pressed',on);
    const b=$('[data-done]',e);b.textContent=on?'✓ Zaliczone na dziś — kliknij, aby odznaczyć':'✓ Zrobione — zalicz na dziś';b.setAttribute('aria-label',on?'Odznacz sekcję jako niezrobioną':'Zalicz sekcję na dziś');b.classList.toggle('pri',!on);b.classList.toggle('ghost',on);
    const dh=$('.donehint',e);if(dh)dh.hidden=on;
  });
  const r=$('#ring');
  if(!$('svg',r))r.innerHTML=`<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc)"/><stop offset="1" style="stop-color:var(--warm)"/></linearGradient></defs><circle class="rt" cx="26" cy="26" r="22"/><circle class="rp" cx="26" cy="26" r="22" stroke="url(#rg)" stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="${RC.toFixed(1)}"/></svg><b></b>`;
  r.classList.toggle('full',total>0&&cnt===total);
  if(cnt>LASTCNT)FX.bump(r);LASTCNT=cnt;
  const nx=L.find(c=>!dk[c.id]);$$('#cards details.card').forEach(e=>e.classList.toggle('next',!!nx&&e.dataset.card===nx.id));
  $('.rp',r).setAttribute('stroke-dashoffset',(RC*(1-(total?cnt/total:0))).toFixed(1));
  $('b',r).textContent=cnt+'/'+total;
  $('#ptxt').textContent=cnt+' / '+total+' dziś';
  $('#hint').hidden=cnt>0||!total;
  let wk=0,h='';
  for(let i=13;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);const k=keyOf(d),n=Object.keys(S.days[k]||{}).length;
    if(i<7&&n)wk++;
    const lv=n?Math.min(5,Math.ceil(5*Math.min(n,total||n)/(total||n))):0;
    h+=`<i class="l${lv}${i===0?' today':''}" title="${esc(d.toLocaleDateString('pl-PL',{weekday:'short',day:'numeric',month:'short'}))}: ${n}"></i>`;
  }
  $('#strip').innerHTML=h;
  $('#week').textContent='tydzień: '+wk+'/7';
  const s=streak();$('#streak').textContent=s?'seria: '+s+' '+(s===1?'dzień':'dni'):'';
}
const ZAR=[14,268,172,42,332,204,96];   // koral, fiolet, turkus, złoto, magenta, błękit, limonka
const HUES=[[-1,'Żar'],[168,'Morski'],[210,'Niebo'],[262,'Fiolet'],[328,'Róż'],[10,'Koral'],[38,'Bursztyn'],[100,'Mech'],[190,'Turkus']];
const OFFS=[0,26,-26,52,-52,78];
const zar=()=>!(+S.set.hue>0);
function applyTones(){
  const dark=document.documentElement.dataset.dark==='1',h=+S.set.hue||168,Z=zar();
  const paint=(e,ch)=>{
    e.style.setProperty('--tone',dark?`hsl(${ch} ${Z?46:30}% ${Z?13:15}%)`:`hsl(${ch} ${Z?100:55}% ${Z?95:93}%)`);
    e.style.setProperty('--edge',dark?`hsl(${ch} ${Z?92:58}% ${Z?60:52}%)`:`hsl(${ch} ${Z?85:55}% ${Z?48:40}%)`);
    e.style.setProperty('--cacc',dark?`hsl(${ch} ${Z?100:78}% ${Z?78:74}%)`:`hsl(${ch} ${Z?85:66}% 30%)`);
  };
  const hu=i=>Z?ZAR[i%ZAR.length]:(h+i*47)%360;
  LAY().forEach((c,i)=>{const e=$('#card-'+c.id);if(e)paint(e,hu(i))});
  const sc=$('#sumCard');if(sc)paint(sc,hu(LAY().length));
  [['#checkin .cibox',3],['#survey',2],['#remind',0]].forEach(([q,zi],i)=>{const e=$(q);if(e)paint(e,Z?ZAR[zi]:(h+200+i*40)%360)});
}
function applyLook(){
  const m=S.set.mode,mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)').matches:true;
  const dark=m==='dark'||(m!=='light'&&mq),r=document.documentElement;
  r.dataset.dark=dark?'1':'0';r.style.setProperty('--h',zar()?262:+S.set.hue);if(zar())r.dataset.th='zar';else delete r.dataset.th;
  FX.setOn(S.set.fx!==0);
  document.body.classList.toggle('quiet',!!S.set.quiet);
  applyTones();
}
function renderLook(){
  $('#sws').innerHTML=HUES.map(([h,n])=>`<button class="sw" type="button" data-h="${h}" aria-pressed="${h<0?zar():+S.set.hue===h}"><i style="background:${h<0?'conic-gradient(#ff7a45,#ffc43d,#ff4d8d,#8b5cf6,#2dd4bf,#ff7a45)':`hsl(${h} 50% 55%)`}"></i>${esc(n)}</button>`).join('');
  seg($('#modeSeg'),[['auto','Auto'],['dark','Ciemny'],['light','Jasny']],S.set.mode,v=>{S.set.mode=v;save();applyLook()});
  $('#setQuiet').checked=!!S.set.quiet;$('#setSnd').checked=!!S.set.snd;$('#setFx').checked=S.set.fx!==0;
}
function greet(){const h=new Date().getHours();return h<12?'Dzień dobry':h<18?'Miłego dnia':'Dobry wieczór'}

/* ───────── PYTANIA PORANNE ───────── */
const CIQ=[['s','Czy wyspałeś/aś się dzisiaj?','1 — wcale','5 — w pełni'],['w','Jak duża jest Twoja chęć do ćwiczeń?','1 — żadna','5 — ogromna']];
function renderCheckin(){
  const el=$('#checkin');if(!el)return;
  const c=S.ci[TODAY]||{};
  if(!CI_EDIT&&c.skip){el.innerHTML='<div class="cirow"><span>Pytania poranne pominięte.</span><button class="lnk" type="button" data-cie="edit">odpowiedz</button></div>';return}
  if(!CI_EDIT&&c.s&&c.w){el.innerHTML=`<div class="cirow"><span>Sen <b>${c.s}/5</b> · Chęć <b>${c.w}/5</b></span><button class="lnk" type="button" data-cie="edit">zmień</button></div>`;return}
  el.innerHTML=`<div class="cibox"><h3>Na start dnia — 2 pytania</h3><p class="why">Odpowiedz rano, przed ćwiczeniami (najpóźniej do końca dnia). To pozwoli w Podsumowaniu zobaczyć, jak sen i chęć wpływają na wynik.</p>${CIQ.map(([k,q,a,b])=>`<p class="q">${q}</p><div class="scale" role="group" aria-label="${esc(q)} Skala 1 do 5">${[1,2,3,4,5].map(v=>`<button type="button" data-ck="${k}" data-v="${v}" aria-pressed="${c[k]===v}">${v}</button>`).join('')}</div><div class="scl"><span>${a}</span><span>${b}</span></div>`).join('')}<div class="cifoot">${CI_EDIT?'<button class="btn sm pri" type="button" data-cie="done">Gotowe</button>':'<button class="lnk" type="button" data-cie="skip">Pomiń dziś</button>'}</div></div>`;
}
function renderRemind(){
  const el=$('#remind');if(!el)return;
  const p=lastNoteAny();el.hidden=!p;
  if(p)el.innerHTML=`<b>📌 Przypomnienie z ${esc(dlabel(p.k))}</b><p>${esc(shortT(p.t,260))}</p>`;
}
function renderSurvey(){
  const el=$('#survey');if(!el)return;
  const any=TASKS().some(c=>isDone(c.id)),r=normRt(TODAY);
  el.classList.toggle('wait',!any);
  if(!any){el.innerHTML='<h3>Jak poszło?</h3><p class="why">Po ćwiczeniach wróć tu: pojawią się 2 krótkie pytania (10 sekund).</p>';return}
  el.innerHTML=`<h3>Jak poszło?</h3><p class="why">Informacja na potrzeby podsumowania efektów — Twoje odpowiedzi zobaczysz w Podsumowaniu (raz na 3 dni).</p><p class="q">Czy czujesz, że wykonałeś/aś to dobrze?</p>${SC('q',r.q)}<div class="scl"><span>1 — słabo</span><span>5 — świetnie</span></div><p class="q">Czy czujesz się lepiej po ćwiczeniach?</p>${SC('b',r.b)}<div class="scl"><span>1 — nie</span><span>5 — zdecydowanie</span></div><p class="tiny">⏱ Wypełnij po ćwiczeniach, najpóźniej do końca dnia. Możesz pominąć.</p>`;
}

/* ───────── PODSUMOWANIE ───────── */
const avgOf=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
const f1=v=>v==null?'–':(Math.round(v*10)/10).toString().replace('.',',');
const dayKey=n=>{const d=new Date();d.setDate(d.getDate()-n);return keyOf(d)};
function normRt(k){
  const r=S.rt[k]||{};
  if(typeof r.q==='number'||typeof r.b==='number'){const o={};if(r.q)o.q=r.q;if(r.b)o.b=r.b;return o}
  const o={},cs=Object.keys(r).map(c=>r[c]||{});
  ['q','b'].forEach(f=>{const v=cs.map(x=>x[f]).filter(n=>n>0);if(v.length)o[f]=Math.round(v.reduce((a,b)=>a+b,0)/v.length)});
  return o;
}
const dayRt=(k,f)=>{const v=normRt(k)[f];return v>0?[v]:[]};
const dayCnt=k=>Object.keys(S.days[k]||{}).length;
const dayP=k=>{const t=TASKS().length;return t?Math.min(1,dayCnt(k)/t):0};
const ciV=(k,f)=>{const c=S.ci[k];return c&&c[f]>0?c[f]:null};
const HAB_A=0.06;
function habit(){
  const ks=Object.keys(S.days).filter(k=>dayCnt(k)).sort();
  if(!ks.length)return null;
  const t=new Date(TODAY+'T12:00:00');
  let f=new Date(ks[0]+'T12:00:00');
  const lim=new Date(t);lim.setDate(lim.getDate()-400);if(f<lim)f=lim;
  const span=Math.round((t-f)/864e5)+1,out=[];let e=0;
  for(let i=0;i<span;i++){
    const d=new Date(f);d.setDate(d.getDate()+i);const k=keyOf(d),p=dayP(k);
    if(!(k===TODAY&&p===0))e+=HAB_A*(p-e);
    out.push(e);
  }
  return {span,v:out};
}
function chartA(){
  const W=340,H=178,L=32,R=28,T=10,B=24,N=14,pw=W-L-R,ph=H-T-B;
  const X=i=>L+pw*(i+.5)/N,Y=v=>T+ph*(1-v),sc=v=>(v-1)/4;
  let g='';
  [0,.25,.5,.75,1].forEach(t=>{
    g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}"/>`;
    if(t===0||t===.5||t===1)g+=`<text class="ax" x="${L-5}" y="${(Y(t)+3).toFixed(1)}" text-anchor="end">${t*100}%</text>`;
    g+=`<text class="ax" x="${W-R+5}" y="${(Y(t)+3).toFixed(1)}">${t*4+1}</text>`;
  });
  const ds=[],S1=[],W1=[],B1=[];
  for(let i=0;i<N;i++){
    const ago=N-1-i,k=dayKey(ago),p=dayP(k);
    ds.push(k);
    const bw=pw/N*.56,h=ph*p;
    if(p>0)g+=`<rect class="cbar" x="${(X(i)-bw/2).toFixed(1)}" y="${(Y(p)).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2"/>`;
    S1.push(ciV(k,'s'));W1.push(ciV(k,'w'));const bb=avgOf(dayRt(k,'b'));B1.push(bb);
    if(ago%3===0)g+=`<text class="ax" x="${X(i).toFixed(1)}" y="${H-8}" text-anchor="middle">${ago===0?'dziś':new Date(k+'T12:00:00').getDate()}</text>`;
  }
  const line=(vals,cls)=>{
    let d='',pen=false,dots='';
    vals.forEach((v,i)=>{if(v==null){pen=false;return}const x=X(i).toFixed(1),y=Y(sc(v)).toFixed(1);d+=(pen?'L':'M')+x+' '+y;pen=true;dots+=`<circle class="${cls}d" cx="${x}" cy="${y}" r="2.6"/>`});
    return d?`<path class="ln ${cls}" d="${d}"/>${dots}`:'';
  };
  g+=line(S1,'ls')+line(W1,'lw')+line(B1,'lb');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Wykres 14 dni: wykonanie zadań oraz sen, chęć i samopoczucie po ćwiczeniach w skali 1 do 5"><title>Ostatnie 14 dni</title>${g}</svg>`;
}
function chartB(h){
  const W=340,H=150,L=32,R=14,T=12,B=22,pw=W-L-R,ph=H-T-B;
  const n=Math.max(14,Math.min(66,h.span)),vals=h.v.slice(-n),off=n-vals.length;
  const X=i=>L+pw*(i+off)/(n-1),Y=v=>T+ph*(1-v);
  let g='';
  [0,.5,1].forEach(t=>{g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}"/><text class="ax" x="${L-5}" y="${(Y(t)+3).toFixed(1)}" text-anchor="end">${t*100}%</text>`});
  g+=`<line class="thr" x1="${L}" x2="${W-R}" y1="${Y(.8).toFixed(1)}" y2="${Y(.8).toFixed(1)}"/><text class="ax" x="${W-R}" y="${(Y(.8)-4).toFixed(1)}" text-anchor="end">umowny próg 80%</text>`;
  const pts=vals.map((v,i)=>[X(i),Y(v)]);
  const ln=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join('');
  g+=`<path class="area" d="${ln}L${pts[pts.length-1][0].toFixed(1)} ${Y(0).toFixed(1)}L${pts[0][0].toFixed(1)} ${Y(0).toFixed(1)}Z"/><path class="ln lb" d="${ln}"/>`;
  const last=pts[pts.length-1];
  g+=`<circle class="lbd" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4"/>`;
  g+=`<text class="ax" x="${L}" y="${H-7}">${n-1} dni temu</text><text class="ax" x="${W-R}" y="${H-7}" text-anchor="end">dziś</text>`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Wykres siły nawyku w czasie, obecnie ${Math.round(vals[vals.length-1]*100)} procent"><title>Siła nawyku</title>${g}</svg>`;
}
const stRow=(t,a)=>`<h4>${t}</h4><div class="stats">${a.map(([l,v,u])=>`<div class="st"><b>${v}${v!=='–'&&u?`<small>${u}</small>`:''}</b><span>${l}</span></div>`).join('')}</div>`;
function insights(){
  const out=[],ks=[];
  for(let i=0;i<60;i++)ks.push(dayKey(i));
  const lowW=ks.filter(k=>{const w=ciV(k,'w');return w&&w<=2&&dayCnt(k)>0});
  if(lowW.length)out.push(`W dni z niską chęcią (1–2) i tak ćwiczyłeś/aś: ${lowW.length} ${lowW.length===1?'raz':'razy'}. Tak buduje się nawyk.`);
  const hi=ks.filter(k=>ciV(k,'s')>=4),lo=ks.filter(k=>{const v=ciV(k,'s');return v&&v<=2});
  if(hi.length>=2&&lo.length>=2){
    const a=Math.round(100*avgOf(hi.map(dayP))),b=Math.round(100*avgOf(lo.map(dayP)));
    out.push(`Po dobrze przespanej nocy (4–5) wykonujesz średnio ${a}% zadań dnia, po słabej (1–2): ${b}%.`);
  }
  const bs=ks.flatMap(k=>dayRt(k,'b'));
  if(bs.length>=3){
    const m=avgOf(bs);
    out.push(m>=4?`Po ćwiczeniach zwykle czujesz się lepiej (śr. ${f1(m)}/5) — przypomnij to sobie w dni bez chęci.`:m<3?`Po ćwiczeniach czujesz się średnio (śr. ${f1(m)}/5) — spróbuj lżejszych wersji lub innej pory dnia.`:`Po ćwiczeniach czujesz się umiarkowanie lepiej (śr. ${f1(m)}/5).`);
  }
  return out.slice(0,3);
}
function renderSummary(){
  const sc=$('#sumCard'),bd=$('#sumBody');if(!sc||!bd)return;
  if(SUM_OPEN)issueSum();
  if(sc.open!==SUM_OPEN)sc.open=SUM_OPEN;
  const ready=S.sm===TODAY,due=sumReady();
  $('#sumSub').textContent=ready?'gotowe':due?'gotowe — rozwiń':'następne: '+dlabel(nextSumKey());
  if(!ready){
    bd.innerHTML=due?'<p class="moti2">Podsumowanie jest gotowe. Rozwiń tę kartę, kiedy skończysz ćwiczenia.</p>':`<p class="moti2">To Twoje podsumowanie, będzie gotowe raz na 3 dni (następne: ${esc(dlabel(nextSumKey()))}), a teraz — miłych ćwiczeń :)</p>`;
    applyTones();return;
  }
  const week=S.sw===TODAY,h=habit();
  const days=n=>{const a=[];for(let i=0;i<n;i++)a.push(dayKey(i));return a};
  const row=(t,ks)=>{
    const q=ks.flatMap(k=>dayRt(k,'q')),b=ks.flatMap(k=>dayRt(k,'b')),sl=ks.map(k=>ciV(k,'s')).filter(Boolean),wl=ks.map(k=>ciV(k,'w')).filter(Boolean);
    return stRow(t,[['Dni ćwiczeń',ks.filter(k=>dayCnt(k)>0).length+'/'+ks.length,''],['Sen',f1(avgOf(sl)),'/5'],['Chęć',f1(avgOf(wl)),'/5'],['Wykonanie',f1(avgOf(q)),'/5'],['Lepiej po ćw.',f1(avgOf(b)),'/5']]);
  };
  let o=row('Ostatnie 3 dni',days(3));
  o+=`<h4>Samopoczucie a wynik — 14 dni</h4>${chartA()}<div class="leg"><span><i class="k kb"></i>Wykonanie zadań (słupki, %)</span><span><i class="k klb"></i>Lepiej po ćwiczeniu</span><span><i class="k klw"></i>Chęć</span><span><i class="k kls"></i>Sen</span></div><p class="tiny">Linie: skala 1–5 (prawa oś), słupki: odsetek zadań dnia (lewa oś).</p>`;
  if(week){
    o+=`<h3 class="wk">Podsumowanie tygodnia</h3>`+row('Ostatnie 7 dni',days(7));
    if(h)o+=`<h4>Kształtowanie nawyku</h4>${chartB(h)}<p class="note">Siła nawyku: <b>${Math.round(h.v[h.v.length-1]*100)}%</b> — wskaźnik orientacyjny (nowsze dni liczą się bardziej). Utrwalenie nawyku zajmuje średnio ok. 66 dni (Lally i in., 2009), więc pojedyncza przerwa niczego nie psuje.</p>`;
    const ins=insights();
    if(ins.length)o+=`<h4>Co widać w danych</h4><ul class="ins">${ins.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
    const nk=Object.keys(S.notes).sort().reverse().slice(0,3);
    if(nk.length)o+=`<h4>Twoje spostrzeżenia</h4><ul class="nhl">${nk.map(k=>{const t=Object.keys(S.notes[k]).map(b=>S.notes[k][b]).join(' · ');return `<li><b>${esc(dlabel(k))}</b> ${esc(shortT(t,180))}</li>`}).join('')}</ul>`;
  }
  o+=`<p class="moti"><b>Ćwicz dalej, a efekty już masz ;)</b></p><p class="tiny">Podsumowanie pojawia się raz na 3 dni, a podsumowanie tygodnia raz na 7 dni.</p>`;
  bd.innerHTML=o;
  applyTones();
}
function renderAll(){
  {const nd=keyOf(new Date());if(nd!==TODAY)SUM_OPEN=false;TODAY=nd}DN=dnum(new Date());
  $('#greet').textContent=greet();
  $('#date').textContent=new Date().toLocaleDateString('pl-PL',{weekday:'long',day:'numeric',month:'long'});
  applyLook();renderCards();renderCheckin();renderRemind();renderSurvey();renderSummary();setSync(syncState);
}

/* ───────── EDYCJA UKŁADU ───────── */
const moveIn=(arr,i,d)=>{const j=i+d;if(j<0||j>=arr.length)return;const t=arr[i];arr[i]=arr[j];arr[j]=t};
function setBH(b){
  const sec=blockEl(b.id);if(!sec)return;let h=$('h3.bh',sec);
  if(b.h){if(!h){h=document.createElement('h3');h.className='bh';sec.insertBefore(h,$('.bb',sec))}h.textContent=b.h}else if(h)h.remove();
}
function refreshCfg(b){const f=blockEl(b.id),x=f&&$('.bcfg',f);if(x)x.innerHTML=BT[b.type].cfgUI(b)}
function act(a){
  const d=a.dataset,L=LAY();
  switch(d.act){
    case'cadd':L.push({id:uid(),title:'Nowa sekcja',ic:'🌱',blocks:[]});break;
    case'cup':case'cdn':moveIn(L,L.findIndex(c=>c.id===d.c),d.act==='cup'?-1:1);break;
    case'cdel':return armed(a,()=>{S.layout=L.filter(c=>c.id!==d.c);save();renderCards()});
    case'badd':{const c=findC(d.c),t=$('.addType',a.closest('.adder')).value,df=BT[t].def();c.blocks.push({id:uid(),type:t,h:df.h,cfg:df.cfg});break}
    case'bup':case'bdn':{const f=findB(d.b);moveIn(f.c.blocks,f.i,d.act==='bup'?-1:1);break}
    case'bdel':return armed(a,()=>{const f=findB(d.b);f.c.blocks.splice(f.i,1);save();renderCards()});
    case'ownadd':{
      const f=findB(d.b),w=a.closest('.bcfg'),t=$('.ow-t',w).value.trim();
      if(!t){$('.ow-t',w).focus();return}
      const m=Math.min(60,Math.max(1,parseInt($('.ow-m',w).value,10)||2));
      const steps=$('.ow-s',w).value.split('\n').map(s=>s.trim()).filter(Boolean);
      (f.b.cfg.own||(f.b.cfg.own=[])).push({c:$('.ow-c',w).value.trim().slice(0,20)||'Moje',t:t.slice(0,60),m,sec:m*60,steps:steps.length?steps:['Wykonaj ćwiczenie spokojnie, bez bólu.'],ok:'wykonasz ćwiczenie do końca, bez bólu.'});
      save();refreshCfg(f.b);mountBlock(f.b.id);paintSums();return;
    }
    case'owndel':return armed(a,()=>{const f=findB(d.b);f.b.cfg.own.splice(+d.i,1);save();refreshCfg(f.b);mountBlock(f.b.id);paintSums()});
    default:return;
  }
  save();renderCards();
}
function toggleEdit(on){
  EDIT=on;$('#miEditT').textContent=on?'Zakończ edycję':'Edytuj układ';$('#editBar').hidden=!on;
  renderCards();
}
function renderTpl(){
  $('#tplList').innerHTML=TEMPLATES.map(t=>`<div class="tpl"><b>${t.ic} ${esc(t.n)}</b><p>${esc(t.d)}</p><button class="btn sm pri" type="button" data-tpl="${t.id}">${S.tpl===t.id?'Wczytaj ponownie':'Wczytaj'}</button></div>`).join('')+(S.prev?'<div class="tpl"><b>↩ Poprzedni układ</b><p>Przywróć układ sprzed ostatniego wczytania zestawu.</p><button class="btn sm" type="button" data-tpl="__prev">Przywróć</button></div>':'');
}
function loadTpl(id){
  const cur={layout:clone(LAY()),tpl:S.tpl};
  if(id==='__prev'){if(!S.prev)return;S.layout=S.prev.layout;S.tpl=S.prev.tpl}
  else{const t=TEMPLATES.find(x=>x.id===id);if(!t)return;S.layout=clone(t.layout);S.tpl=t.id}
  S.prev=cur;
  for(const k in OFF)delete OFF[k];
  save();renderCards();renderTpl();
}

/* ───────── OKNA I MENU ───────── */
function wire(){
  const cards=$('#cards');
  cards.addEventListener('click',e=>{
    const t=e.target.closest('[data-tick]');
    if(t){e.preventDefault();e.stopPropagation();setDone(t.dataset.tick,!isDone(t.dataset.tick));return}
    const a=e.target.closest('[data-act]');if(a){act(a);return}
    const b=e.target.closest('[data-done]');
    if(b)setDone(b.dataset.done,!isDone(b.dataset.done));
  });
  $('#checkin').addEventListener('click',e=>{
    const b=e.target.closest('[data-ck]'),x=e.target.closest('[data-cie]');
    if(b){
      const c=S.ci[TODAY]||(S.ci[TODAY]={}),k=b.dataset.ck,v=+b.dataset.v;delete c.skip;
      if(c[k]===v)delete c[k];else c[k]=v;
      if(!Object.keys(c).length)delete S.ci[TODAY];
      save();renderCheckin();renderSummary();return;
    }
    if(x){
      const a=x.dataset.cie;
      if(a==='edit')CI_EDIT=true;
      else if(a==='done')CI_EDIT=false;
      else{S.ci[TODAY]={skip:1};CI_EDIT=false;save()}
      renderCheckin();renderSummary();
    }
  });
  $('#sumCard').addEventListener('toggle',e=>{const o=e.target.open;if(o!==SUM_OPEN){SUM_OPEN=o;if(o)renderSummary()}});
  $('#miSum').onclick=()=>{closeMenu();openSum()};
  $('#survey').addEventListener('click',e=>{
    const b=e.target.closest('[data-sc]');if(!b)return;
    const k=b.dataset.sc,v=+b.dataset.v,o=normRt(TODAY);
    if(o[k]===v)delete o[k];else o[k]=v;
    if(Object.keys(o).length)S.rt[TODAY]=o;else delete S.rt[TODAY];
    save();renderSurvey();
  });
  $('#remind').addEventListener('click',()=>{const t=$('#cards textarea[id^="nt-"]'),n=t&&t.closest('details.card');if(n){n.open=true;scrollTo('#'+n.id,'center')}});
  $('#addCard').addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(a)act(a)});
  cards.addEventListener('change',e=>{
    const t=e.target,f=t.dataset.f,cf=t.dataset.cf;
    if(f==='ctitle'){const c=findC(t.dataset.c);if(!c)return;c.title=t.value.trim().slice(0,40)||'Sekcja';save();$('#card-'+c.id+' .ttl b').textContent=c.title}
    else if(f==='cicon'){const c=findC(t.dataset.c);if(!c)return;c.ic=t.value.trim().slice(0,4)||'•';save();$('#card-'+c.id+' .ic').textContent=c.ic}
    else if(f==='bh'){const x=findB(t.dataset.b);if(!x)return;x.b.h=t.value.trim().slice(0,60);save();setBH(x.b)}
    else if(cf){
      const x=findB(t.dataset.b);if(!x)return;
      x.b.cfg[cf]=t.dataset.ty&&PARSE[t.dataset.ty]?PARSE[t.dataset.ty](t.value,x.b):t.value;
      if(cf==='pack'||cf==='set'){x.b.cfg.cat='';OFF[x.b.id]=0}
      save();if(t.dataset.rc)refreshCfg(x.b);
      mountBlock(x.b.id);paintSums();
    }
  });
  document.addEventListener('securitypolicyviolation',e=>{
    const d=e.effectiveDirective||e.violatedDirective||'';
    if(!/frame|child/.test(d))return;
    EMBED_BLOCKED=true;
    $$('.pl').forEach(b=>{if(b.querySelector('iframe'))b.innerHTML='<div class="blocked">Claude blokuje osadzone wideo na tej stronie. Użyj „YouTube ↗”.</div>'});
    showEmbedNote();
  });

  const menu=$('#menu'),mb=$('#menuBtn');
  const closeMenu=()=>{menu.hidden=true;mb.setAttribute('aria-expanded','false')};
  mb.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden;mb.setAttribute('aria-expanded',String(!menu.hidden))};
  document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('#menu'))closeMenu()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  const openD=d=>{closeMenu();typeof d.showModal==='function'?d.showModal():d.setAttribute('open','')};
  const closeD=d=>typeof d.close==='function'?d.close():d.removeAttribute('open');
  $$('dialog [data-close]').forEach(b=>b.onclick=()=>closeD(b.closest('dialog')));
  $$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)closeD(d)}));

  $('#miAbout').onclick=()=>{$('#verA').textContent=VER;openD($('#dAbout'))};
  $('#miSug').onclick=()=>openD($('#dSug'));
  $('#miLook').onclick=()=>{renderLook();openD($('#dLook'))};
  $('#miEdit').onclick=()=>{closeMenu();toggleEdit(!EDIT)};
  $('#editDone').onclick=()=>toggleEdit(false);
  $('#miPacks').onclick=()=>{renderTpl();openD($('#dPacks'))};
  $('#miBackup').onclick=()=>{$('#bkOut').value=JSON.stringify(S);$('#bkMsg').textContent='';$('#bkIn').value='';const hosted=!(window.claude&&window.claude.use);$('#keyBox').hidden=!hosted;if(hosted){$('#keyOut').value=syncKey();$('#keyIn').value='';$('#keyMsg').textContent=''}openD($('#dBackup'))};
  $('#keyCopy').onclick=async()=>{const m=$('#keyMsg');try{await navigator.clipboard.writeText($('#keyOut').value);m.textContent='Skopiowano klucz. Nie udostępniaj go nikomu.'}catch(e){$('#keyOut').select();m.textContent='Zaznaczone — skopiuj (Ctrl/Cmd+C).'}};
  $('#keySet').onclick=async()=>{
    const m=$('#keyMsg'),k=$('#keyIn').value.trim();
    if(!/^[A-Za-z0-9_-]{24,64}$/.test(k)){m.textContent='To nie wygląda na klucz synchronizacji (24–64 znaki: litery, cyfry, - _).';m.className='msg err';return}
    try{localStorage.setItem(KEYLS,k)}catch(e){}
    m.className='msg';m.textContent='Łączenie…';await initWorker(true);
    $('#keyOut').value=k;$('#keyIn').value='';m.textContent=syncState==='ok'?'Połączono — dane z chmury wczytane.':'Nie udało się połączyć z chmurą.';if(syncState!=='ok')m.className='msg err';
  };

  $('#sws').onclick=e=>{const b=e.target.closest('[data-h]');if(!b)return;S.set.hue=+b.dataset.h;save();applyLook();renderLook()};
  $('#setQuiet').onchange=e=>{S.set.quiet=e.target.checked?1:0;save();applyLook()};
  $('#setSnd').onchange=e=>{S.set.snd=e.target.checked?1:0;save()};
  $('#setFx').onchange=e=>{S.set.fx=e.target.checked?1:0;save();applyLook()};
  $('#tplList').onclick=e=>{const b=e.target.closest('[data-tpl]');if(b)armed(b,()=>loadTpl(b.dataset.tpl))};

  $('#bkCopy').onclick=async()=>{
    const m=$('#bkMsg');
    try{await navigator.clipboard.writeText($('#bkOut').value);m.textContent='Skopiowano. Wklej do notatki lub pliku w bezpiecznym miejscu.'}
    catch(e){$('#bkOut').select();m.textContent='Zaznaczone — skopiuj (Ctrl/Cmd+C).'}
  };
  $('#bkLoad').onclick=()=>{
    const m=$('#bkMsg');
    try{
      const d=JSON.parse($('#bkIn').value);
      if(!d||typeof d!=='object'||!(d.layout||d.days||d.todos))throw new Error('format');
      S=thaw(d);save();renderAll();m.textContent='Wczytano kopię.';m.className='msg';
    }catch(e){m.textContent='To nie wygląda na kopię danych Nawyku. Wklej cały tekst z „Kopiuj kopię”.';m.className='msg err'}
  };

  const sugT=$('#sugT'),updMail=()=>{$('#sugMail').href='mailto:'+MAIL+'?subject='+encodeURIComponent('Nawyk '+VER+' – sugestia')+'&body='+encodeURIComponent(sugT.value)};
  sugT.addEventListener('input',updMail);updMail();
  $('#sugCopy').onclick=async()=>{
    const m=$('#sugM');
    try{await navigator.clipboard.writeText(sugT.value);m.textContent='Skopiowano. Wklej w wiadomości na '+MAIL+'.'}
    catch(e){sugT.select();m.textContent='Zaznaczone — skopiuj (Ctrl/Cmd+C) i wyślij na '+MAIL+'.'}
  };
  if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(S.set.mode==='auto')applyLook()})}catch(e){}
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden&&keyOf(new Date())!==TODAY&&!anyRunning()){for(const k in OFF)delete OFF[k];renderAll()}
  });
}

/* ───────── START ───────── */
S=thaw({});
try{const raw=localStorage.getItem(LS);if(raw)S=thaw(JSON.parse(raw))}catch(e){}
FX.init();
wire();
renderAll();
if(window.claude&&window.claude.use)initCloud();else if(/^https?:$/.test(location.protocol))initWorker();
