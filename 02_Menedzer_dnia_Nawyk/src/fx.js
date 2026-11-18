/* ───────── Nawyk v0.06 — efekty: żywe tło, konfetti, fala przy dotyku, podświetlenie karty, toasty ───────── */
const FX=(()=>{
  const d=document, mq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):null;
  let on=true, cv=null, cx=null, parts=[], raf=0, tt=0, px=0, py=0, pr=0, sr=0, sx=0, sy=0, sel=null;
  const calm=()=>!on||!!(mq&&mq.matches);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const COL=['#ff7a45','#ffc43d','#ff4d8d','#8b5cf6','#2dd4bf','#38bdf8','#a3e635'];
  const hasCanvas=()=>typeof CanvasRenderingContext2D!=='undefined';

  /* konfetti na jednej kanwie, usuwanej po zakończeniu */
  function fit(){const r=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(innerWidth*r);cv.height=Math.round(innerHeight*r);cx.setTransform(r,0,0,r,0,0)}
  function ensure(){
    if(!hasCanvas())return false;
    if(cv)return true;
    const c=d.createElement('canvas');c.id='fxc';c.setAttribute('aria-hidden','true');
    let x=null;try{x=c.getContext('2d')}catch(e){}
    if(!x)return false;
    cv=c;cx=x;fit();d.body.appendChild(cv);
    return true;
  }
  function loop(){
    cx.clearRect(0,0,innerWidth,innerHeight);
    parts=parts.filter(p=>p.l>0&&p.y<innerHeight+30);
    for(const p of parts){
      p.vy+=.2;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;p.l--;
      cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.globalAlpha=Math.min(1,p.l/25);cx.fillStyle=p.c;
      if(p.sq)cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);else{cx.beginPath();cx.arc(0,0,p.w/2.2,0,7);cx.fill()}
      cx.restore();
    }
    if(parts.length)raf=requestAnimationFrame(loop);
    else{raf=0;if(cv){cv.remove();cv=null;cx=null}}
  }
  function burst(x,y,n,pw){
    if(calm()||!ensure())return;
    n=Math.min(n,Math.max(0,260-parts.length));
    for(let i=0;i<n;i++){
      const a=rnd(-Math.PI,0)+rnd(-.35,.35),v=rnd(4,(pw||9));
      parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,w:rnd(6,11),h:rnd(4,8),a:rnd(0,6),va:rnd(-.3,.3),l:rnd(70,120),c:COL[(Math.random()*COL.length)|0],sq:Math.random()<.65});
    }
    if(!raf)raf=requestAnimationFrame(loop);
  }
  function center(el){
    if(el&&el.getBoundingClientRect){const r=el.getBoundingClientRect();if(r.width||r.height)return[r.left+r.width/2,r.top+r.height/2]}
    return[innerWidth/2,innerHeight*.4];
  }
  /* świętowanie: małe konfetti z miejsca kliknięcia, duże fajerwerki po skończeniu wszystkiego */
  function celebrate(el,big){
    if(calm())return;
    const [x,y]=center(el);
    burst(x,y,big?60:26,big?12:9);
    if(big){
      [[.2,.28],[.8,.3],[.5,.18]].forEach((p,i)=>setTimeout(()=>burst(innerWidth*p[0],innerHeight*p[1]+120,50,13),220+i*260));
    }
  }
  function haptic(n){try{if(!calm()&&navigator.vibrate)navigator.vibrate(n||14)}catch(e){}}
  function toast(msg,ms){
    let t=d.getElementById('toast');
    if(!t){t=d.createElement('div');t.id='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');d.body.appendChild(t)}
    clearTimeout(tt);t.textContent=msg;t.classList.remove('on');void t.offsetWidth;t.classList.add('on');
    tt=setTimeout(()=>t.classList.remove('on'),ms||3200);
  }
  function bump(el){if(!el||calm())return;el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}

  /* fala (ripple) przy dotknięciu przycisków */
  const RIP='.btn,.tick,.scale button,.seg button,.mi,.sw,.icon';
  function ripple(e){
    if(calm())return;
    const t=e.target.closest&&e.target.closest(RIP);if(!t)return;
    const r=t.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,i=d.createElement('span');
    i.className='rip';i.style.cssText='width:'+s+'px;height:'+s+'px;left:'+(e.clientX-r.left-s/2)+'px;top:'+(e.clientY-r.top-s/2)+'px';
    t.appendChild(i);setTimeout(()=>i.remove(),650);
  }
  /* podświetlenie karty za kursorem + delikatny paralaks tła */
  const SPOT='details.card,.cibox,.remindbar,.tpl';
  function frame(){
    pr=0;
    const a=d.getElementById('aurora');if(a)a.style.transform='translate3d('+(px*-22).toFixed(1)+'px,'+(py*-16).toFixed(1)+'px,0)';
    if(sel){sel.style.setProperty('--mx',sx+'px');sel.style.setProperty('--my',sy+'px')}
  }
  function move(e){
    if(calm())return;
    px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2;
    const c=e.target.closest&&e.target.closest(SPOT);
    if(sel&&sel!==c){sel.style.setProperty('--mx','-999px');sel.style.setProperty('--my','-999px')}
    sel=c||null;
    if(c){const r=c.getBoundingClientRect();sx=Math.round(e.clientX-r.left);sy=Math.round(e.clientY-r.top)}
    if(!pr)pr=requestAnimationFrame(frame);
  }
  function setOn(v){on=!!v;d.body.classList.toggle('nofx',!on);if(!on){parts=[];if(cv){cv.remove();cv=null;cx=null}}}
  function init(){
    d.addEventListener('pointerdown',ripple,{passive:true});
    d.addEventListener('pointermove',move,{passive:true});
    d.addEventListener('visibilitychange',()=>d.body.classList.toggle('paused',d.hidden));
    window.addEventListener('resize',()=>{if(cv)fit()});
  }
  return{init,setOn,celebrate,burst,toast,bump,haptic,calm};
})();
