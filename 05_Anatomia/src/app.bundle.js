(()=>{var Rs={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Cs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},_m=0,td=1,xm=2;var Ba=1,ym=2,po=3,Vn=0,qe=1,Ie=2,ur=0,mo=1,ed=2,nd=3,id=4,vm=5;var hr=100,Sm=101,Mm=102,bm=103,Tm=104,wm=200,Em=201,Am=202,Rm=203,sd=204,rd=205,Cm=206,Pm=207,Im=208,Lm=209,Nm=210,Dm=211,Um=212,Om=213,Fm=214,ic=0,sc=1,rc=2,jr=3,oc=4,ac=5,lc=6,cc=7,Ac=0,Bm=1,zm=2,Ai=0,od=1,ad=2,ld=3,za=4,cd=5,ud=6,hd=7,kh="attached",km="detached",dd=300,dr=301,go=302,Rc=303,Cc=304,Ss=1e3,jn=1001,Jr=1002,De=1003,Pc=1004;var fr=1005;var We=1006,_o=1007;var ti=1008;var On=1009,fd=1010,pd=1011,xo=1012,Ic=1013,ei=1014,wn=1015,ui=1016,Lc=1017,Nc=1018,pr=1020,md=35902,gd=35899,_d=1021,xd=1022,Nn=1023,Yi=1026,is=1027,Dc=1028,ka=1029,Ps=1030,Uc=1031;var Oc=1033,Ha=33776,Va=33777,Ga=33778,Wa=33779,Fc=35840,Bc=35841,zc=35842,kc=35843,Hc=36196,Vc=37492,Gc=37496,Wc=37488,Xc=37489,Xa=37490,qc=37491,Yc=37808,$c=37809,Kc=37810,Zc=37811,jc=37812,Jc=37813,Qc=37814,tu=37815,eu=37816,nu=37817,iu=37818,su=37819,ru=37820,ou=37821,au=36492,lu=36494,cu=36495,uu=36283,hu=36284,qa=36285,du=36286;var er=2300,nr=2301,ec=2302,Hh=2303,Vh=2400,Gh=2401,Wh=2402,Hm=2500;var yd=0,Ya=1,yo=2,Vm=3200;var $a=0,Gm=1,ss="",Ce="srgb",En="srgb-linear",da="linear",ae="srgb";var nc=7680;var Wm=519,Xm=512,qm=513,Ym=514,vd=515,$m=516,Km=517,Sd=518,Md=519,bd=35044;var Td="300 es",Jn=2e3,Qr=2001;function o0(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function a0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function to(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Zm(){let i=to("canvas");return i.style.display="block",i}var Tp={},eo=null;function fa(...i){let t="THREE."+i.shift();eo?eo("log",t,...i):console.log(t,...i)}function jm(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Et(...i){i=jm(i);let t="THREE."+i.shift();if(eo)eo("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Dt(...i){i=jm(i);let t="THREE."+i.shift();if(eo)eo("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function tr(...i){let t=i.join(" ");t in Tp||(Tp[t]=!0,Et(...i))}function Jm(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Qm={[ic]:ic,[rc]:lc,[oc]:oc,[jr]:ac,[sc]:sc,[lc]:rc,[cc]:cc,[ac]:jr},ci=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wp=1234567,ua=Math.PI/180,ir=180/Math.PI;function Ri(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(dn[i&255]+dn[i>>8&255]+dn[i>>16&255]+dn[i>>24&255]+"-"+dn[t&255]+dn[t>>8&255]+"-"+dn[t>>16&15|64]+dn[t>>24&255]+"-"+dn[e&63|128]+dn[e>>8&255]+"-"+dn[e>>16&255]+dn[e>>24&255]+dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]).toLowerCase()}function zt(i,t,e){return Math.max(t,Math.min(e,i))}function wd(i,t){return(i%t+t)%t}function l0(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function c0(i,t,e){return i!==t?(e-i)/(t-i):0}function ha(i,t,e){return(1-e)*i+e*t}function u0(i,t,e,n){return ha(i,t,1-Math.exp(-e*n))}function h0(i,t=1){return t-Math.abs(wd(i,t*2)-t)}function d0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function f0(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function p0(i,t){return i+Math.floor(Math.random()*(t-i+1))}function m0(i,t){return i+Math.random()*(t-i)}function g0(i){return i*(.5-Math.random())}function _0(i){i!==void 0&&(wp=i);let t=wp+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function x0(i){return i*ua}function y0(i){return i*ir}function v0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function S0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ed(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function M0(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),d=r((t-n)/2),h=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*u,l*d,l*h,a*c);break;case"YZY":i.set(l*h,a*u,l*d,a*c);break;case"ZXZ":i.set(l*d,l*h,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*u,a*c);break;default:Et("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function fu(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ad(i,t){if(t.constructor===Float32Array)return i;let e=fu(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/e,-1)}function Rd(i,t){if(t.constructor===Float32Array)return i;let e=fu(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*e)}var Is={DEG2RAD:ua,RAD2DEG:ir,generateUUID:Ri,clamp:zt,euclideanModulo:wd,mapLinear:l0,inverseLerp:c0,lerp:ha,damp:u0,pingpong:h0,smoothstep:d0,smootherstep:f0,randInt:p0,randFloat:m0,randFloatSpread:g0,seededRandom:_0,degToRad:x0,radToDeg:y0,isPowerOfTwo:v0,ceilPowerOfTwo:S0,floorPowerOfTwo:Ed,setQuaternionFromProperEuler:M0,normalize:Rd,denormalize:Ad},Nd=class Nd{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Nd.prototype.isVector2=!0;var xt=Nd,mn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],h=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(d!==v||l!==h||c!==f||u!==g){let p=l*h+c*f+u*g+d*v;p<0&&(h=-h,f=-f,g=-g,v=-v,p=-p);let m=1-a;if(p<.9995){let x=Math.acos(p),S=Math.sin(x);m=Math.sin(m*x)/S,a=Math.sin(a*x)/S,l=l*m+h*a,c=c*m+f*a,u=u*m+g*a,d=d*m+v*a}else{l=l*m+h*a,c=c*m+f*a,u=u*m+g*a,d=d*m+v*a;let x=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=x,c*=x,u*=x,d*=x}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[o],h=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+u*d+l*f-c*h,t[e+1]=l*g+u*h+c*d-a*f,t[e+2]=c*g+u*f+a*h-l*d,t[e+3]=u*g-a*d-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),d=a(r/2),h=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:Et("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],d=e[10],h=n+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(zt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Dd=class Dd{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ep.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ep.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*u,this.y=n+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this.z=zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this.z=zt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return hh.copy(this).projectOnVector(t),this.sub(hh)}reflect(t){return this.sub(hh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Dd.prototype.isVector3=!0;var I=Dd,hh=new I,Ep=new mn,Ud=class Ud{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],v=s[0],p=s[3],m=s[6],x=s[1],S=s[4],y=s[7],M=s[2],w=s[5],_=s[8];return r[0]=o*v+a*x+l*M,r[3]=o*p+a*S+l*w,r[6]=o*m+a*y+l*_,r[1]=c*v+u*x+d*M,r[4]=c*p+u*S+d*w,r[7]=c*m+u*y+d*_,r[2]=h*v+f*x+g*M,r[5]=h*p+f*S+g*w,r[8]=h*m+f*y+g*_,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],d=u*o-a*c,h=a*l-u*r,f=c*r-o*l,g=e*d+n*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/g;return t[0]=d*v,t[1]=(s*c-u*n)*v,t[2]=(a*n-s*o)*v,t[3]=h*v,t[4]=(u*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return tr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(dh.makeScale(t,e)),this}rotate(t){return tr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(dh.makeRotation(-t)),this}translate(t,e){return tr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(dh.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Ud.prototype.isMatrix3=!0;var Ot=Ud,dh=new Ot,Ap=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Rp=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function b0(){let i={enabled:!0,workingColorSpace:En,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ae&&(s.r=Xi(s.r),s.g=Xi(s.g),s.b=Xi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ae&&(s.r=Zr(s.r),s.g=Zr(s.g),s.b=Zr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ss?da:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[En]:{primaries:t,whitePoint:n,transfer:da,toXYZ:Ap,fromXYZ:Rp,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ce},outputColorSpaceConfig:{drawingBufferColorSpace:Ce}},[Ce]:{primaries:t,whitePoint:n,transfer:ae,toXYZ:Ap,fromXYZ:Rp,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ce}}}),i}var Wt=b0();function Xi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Pr,uc=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Pr===void 0&&(Pr=to("canvas")),Pr.width=t.width,Pr.height=t.height;let s=Pr.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Pr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=to("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Xi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Xi(e[n]/255)*255):e[n]=Xi(e[n]);return{data:e,width:t.width,height:t.height}}else return Et("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},T0=0,no=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:T0++}),this.uuid=Ri(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(fh(s[o].image)):r.push(fh(s[o]))}else r=fh(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function fh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?uc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Et("Texture: Unable to serialize Texture."),{})}var w0=0,ph=new I,Xe=class i extends ci{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=jn,s=jn,r=We,o=ti,a=Nn,l=On,c=i.DEFAULT_ANISOTROPY,u=ss){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:w0++}),this.uuid=Ri(),this.name="",this.source=new no(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ph).x}get height(){return this.source.getSize(ph).y}get depth(){return this.source.getSize(ph).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Et(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Et(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==dd)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ss:t.x=t.x-Math.floor(t.x);break;case jn:t.x=t.x<0?0:1;break;case Jr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ss:t.y=t.y-Math.floor(t.y);break;case jn:t.y=t.y<0?0:1;break;case Jr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Xe.DEFAULT_IMAGE=null;Xe.DEFAULT_MAPPING=dd;Xe.DEFAULT_ANISOTROPY=1;var Od=class Od{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,y=(f+1)/2,M=(m+1)/2,w=(u+h)/4,_=(d+v)/4,b=(g+p)/4;return S>y&&S>M?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=w/n,r=_/n):y>M?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=w/s,r=b/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=_/r,s=b/r),this.set(n,s,r,e),this}let x=Math.sqrt((p-g)*(p-g)+(d-v)*(d-v)+(h-u)*(h-u));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(d-v)/x,this.z=(h-u)/x,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this.z=zt(this.z,t.z,e.z),this.w=zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this.z=zt(this.z,t,e),this.w=zt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Od.prototype.isVector4=!0;var ue=Od,hc=class extends ci{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:We,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e),this.textures=[];let s=n.count;for(let r=0;r<s;r++)this.textures[r]=new Xe({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:We,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new no(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Hn=class extends hc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},pa=class extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var dc=class extends Xe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=jn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Ec=class Ec{constructor(t,e,n,s,r,o,a,l,c,u,d,h,f,g,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,d,h,f,g,v,p)}set(t,e,n,s,r,o,a,l,c,u,d,h,f,g,v,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=d,m[14]=h,m[3]=f,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ec().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Ir.setFromMatrixColumn(t,0).length(),r=1/Ir.setFromMatrixColumn(t,1).length(),o=1/Ir.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let h=o*u,f=o*d,g=a*u,v=a*d;e[0]=l*u,e[4]=-l*d,e[8]=c,e[1]=f+g*c,e[5]=h-v*c,e[9]=-a*l,e[2]=v-h*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let h=l*u,f=l*d,g=c*u,v=c*d;e[0]=h+v*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*u,e[9]=-a,e[2]=f*a-g,e[6]=v+h*a,e[10]=o*l}else if(t.order==="ZXY"){let h=l*u,f=l*d,g=c*u,v=c*d;e[0]=h-v*a,e[4]=-o*d,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*u,e[9]=v-h*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let h=o*u,f=o*d,g=a*u,v=a*d;e[0]=l*u,e[4]=g*c-f,e[8]=h*c+v,e[1]=l*d,e[5]=v*c+h,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let h=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*u,e[4]=v-h*d,e[8]=g*d+f,e[1]=d,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*d+g,e[10]=h-v*d}else if(t.order==="XZY"){let h=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*u,e[4]=-d,e[8]=c*u,e[1]=h*d+v,e[5]=o*u,e[9]=f*d-g,e[2]=g*d-f,e[6]=a*u,e[10]=v*d+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(E0,t,A0)}lookAt(t,e,n){let s=this.elements;return zn.subVectors(t,e),zn.lengthSq()===0&&(zn.z=1),zn.normalize(),ms.crossVectors(n,zn),ms.lengthSq()===0&&(Math.abs(n.z)===1?zn.x+=1e-4:zn.z+=1e-4,zn.normalize(),ms.crossVectors(n,zn)),ms.normalize(),Tl.crossVectors(zn,ms),s[0]=ms.x,s[4]=Tl.x,s[8]=zn.x,s[1]=ms.y,s[5]=Tl.y,s[9]=zn.y,s[2]=ms.z,s[6]=Tl.z,s[10]=zn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],v=n[6],p=n[10],m=n[14],x=n[3],S=n[7],y=n[11],M=n[15],w=s[0],_=s[4],b=s[8],P=s[12],A=s[1],R=s[5],L=s[9],O=s[13],N=s[2],z=s[6],G=s[10],W=s[14],et=s[3],q=s[7],Q=s[11],tt=s[15];return r[0]=o*w+a*A+l*N+c*et,r[4]=o*_+a*R+l*z+c*q,r[8]=o*b+a*L+l*G+c*Q,r[12]=o*P+a*O+l*W+c*tt,r[1]=u*w+d*A+h*N+f*et,r[5]=u*_+d*R+h*z+f*q,r[9]=u*b+d*L+h*G+f*Q,r[13]=u*P+d*O+h*W+f*tt,r[2]=g*w+v*A+p*N+m*et,r[6]=g*_+v*R+p*z+m*q,r[10]=g*b+v*L+p*G+m*Q,r[14]=g*P+v*O+p*W+m*tt,r[3]=x*w+S*A+y*N+M*et,r[7]=x*_+S*R+y*z+M*q,r[11]=x*b+S*L+y*G+M*Q,r[15]=x*P+S*O+y*W+M*tt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],d=t[6],h=t[10],f=t[14],g=t[3],v=t[7],p=t[11],m=t[15],x=l*f-c*h,S=a*f-c*d,y=a*h-l*d,M=o*f-c*u,w=o*h-l*u,_=o*d-a*u;return e*(v*x-p*S+m*y)-n*(g*x-p*M+m*w)+s*(g*S-v*M+m*_)-r*(g*y-v*w+p*_)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],u=t[10];return e*(o*u-a*c)-n*(r*u-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],d=t[9],h=t[10],f=t[11],g=t[12],v=t[13],p=t[14],m=t[15],x=e*a-n*o,S=e*l-s*o,y=e*c-r*o,M=n*l-s*a,w=n*c-r*a,_=s*c-r*l,b=u*v-d*g,P=u*p-h*g,A=u*m-f*g,R=d*p-h*v,L=d*m-f*v,O=h*m-f*p,N=x*O-S*L+y*R+M*A-w*P+_*b;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/N;return t[0]=(a*O-l*L+c*R)*z,t[1]=(s*L-n*O-r*R)*z,t[2]=(v*_-p*w+m*M)*z,t[3]=(h*w-d*_-f*M)*z,t[4]=(l*A-o*O-c*P)*z,t[5]=(e*O-s*A+r*P)*z,t[6]=(p*y-g*_-m*S)*z,t[7]=(u*_-h*y+f*S)*z,t[8]=(o*L-a*A+c*b)*z,t[9]=(n*A-e*L-r*b)*z,t[10]=(g*w-v*y+m*x)*z,t[11]=(d*y-u*w-f*x)*z,t[12]=(a*P-o*R-l*b)*z,t[13]=(e*R-n*P+s*b)*z,t[14]=(v*S-g*M-p*x)*z,t[15]=(u*M-d*S+h*x)*z,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,d=a+a,h=r*c,f=r*u,g=r*d,v=o*u,p=o*d,m=a*d,x=l*c,S=l*u,y=l*d,M=n.x,w=n.y,_=n.z;return s[0]=(1-(v+m))*M,s[1]=(f+y)*M,s[2]=(g-S)*M,s[3]=0,s[4]=(f-y)*w,s[5]=(1-(h+m))*w,s[6]=(p+x)*w,s[7]=0,s[8]=(g+S)*_,s[9]=(p-x)*_,s[10]=(1-(h+v))*_,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Ir.set(s[0],s[1],s[2]).length(),a=Ir.set(s[4],s[5],s[6]).length(),l=Ir.set(s[8],s[9],s[10]).length();r<0&&(o=-o),oi.copy(this);let c=1/o,u=1/a,d=1/l;return oi.elements[0]*=c,oi.elements[1]*=c,oi.elements[2]*=c,oi.elements[4]*=u,oi.elements[5]*=u,oi.elements[6]*=u,oi.elements[8]*=d,oi.elements[9]*=d,oi.elements[10]*=d,e.setFromRotationMatrix(oi),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=Jn,l=!1){let c=this.elements,u=2*r/(e-t),d=2*r/(n-s),h=(e+t)/(e-t),f=(n+s)/(n-s),g,v;if(l)g=r/(o-r),v=o*r/(o-r);else if(a===Jn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Qr)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Jn,l=!1){let c=this.elements,u=2/(e-t),d=2/(n-s),h=-(e+t)/(e-t),f=-(n+s)/(n-s),g,v;if(l)g=1/(o-r),v=o/(o-r);else if(a===Jn)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Qr)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Ec.prototype.isMatrix4=!0;var Tt=Ec,Ir=new I,oi=new Tt,E0=new I(0,0,0),A0=new I(1,1,1),ms=new I,Tl=new I,zn=new I,Cp=new Tt,Pp=new mn,Mi=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-zt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Et("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Cp.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Cp,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Pp.setFromEuler(this),this.setFromQuaternion(Pp,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mi.DEFAULT_ORDER="XYZ";var io=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},R0=0,Ip=new I,Lr=new mn,zi=new Tt,wl=new I,Jo=new I,C0=new I,P0=new mn,Lp=new I(1,0,0),Np=new I(0,1,0),Dp=new I(0,0,1),Up={type:"added"},I0={type:"removed"},Nr={type:"childadded",child:null},mh={type:"childremoved",child:null},_e=class i extends ci{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:R0++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new I,e=new Mi,n=new mn,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Tt},normalMatrix:{value:new Ot}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new io,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Lr.setFromAxisAngle(t,e),this.quaternion.multiply(Lr),this}rotateOnWorldAxis(t,e){return Lr.setFromAxisAngle(t,e),this.quaternion.premultiply(Lr),this}rotateX(t){return this.rotateOnAxis(Lp,t)}rotateY(t){return this.rotateOnAxis(Np,t)}rotateZ(t){return this.rotateOnAxis(Dp,t)}translateOnAxis(t,e){return Ip.copy(t).applyQuaternion(this.quaternion),this.position.add(Ip.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Lp,t)}translateY(t){return this.translateOnAxis(Np,t)}translateZ(t){return this.translateOnAxis(Dp,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(zi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?wl.copy(t):wl.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Jo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zi.lookAt(Jo,wl,this.up):zi.lookAt(wl,Jo,this.up),this.quaternion.setFromRotationMatrix(zi),s&&(zi.extractRotation(s.matrixWorld),Lr.setFromRotationMatrix(zi),this.quaternion.premultiply(Lr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Dt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Up),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null):Dt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(I0),mh.child=t,this.dispatchEvent(mh),mh.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),zi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),zi.multiply(t.parent.matrixWorld)),t.applyMatrix4(zi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Up),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jo,t,C0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Jo,P0,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),d=o(t.shapes),h=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};_e.DEFAULT_UP=new I(0,1,0);_e.DEFAULT_MATRIX_AUTO_UPDATE=!0;_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Tn=class extends _e{constructor(){super(),this.isGroup=!0,this.type="Group"}},L0={type:"move"},so=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(L0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Tn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},tg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gs={h:0,s:0,l:0},El={h:0,s:0,l:0};function gh(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var At=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Wt.workingColorSpace){if(t=wd(t,1),e=zt(e,0,1),n=zt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=gh(o,r,t+1/3),this.g=gh(o,r,t),this.b=gh(o,r,t-1/3)}return Wt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ce){function n(r){r!==void 0&&parseFloat(r)<1&&Et("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Et("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Et("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ce){let n=tg[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Et("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Xi(t.r),this.g=Xi(t.g),this.b=Xi(t.b),this}copyLinearToSRGB(t){return this.r=Zr(t.r),this.g=Zr(t.g),this.b=Zr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ce){return Wt.workingToColorSpace(fn.copy(this),t),Math.round(zt(fn.r*255,0,255))*65536+Math.round(zt(fn.g*255,0,255))*256+Math.round(zt(fn.b*255,0,255))}getHexString(t=Ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.workingToColorSpace(fn.copy(this),e);let n=fn.r,s=fn.g,r=fn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Wt.workingColorSpace){return Wt.workingToColorSpace(fn.copy(this),e),t.r=fn.r,t.g=fn.g,t.b=fn.b,t}getStyle(t=Ce){Wt.workingToColorSpace(fn.copy(this),t);let e=fn.r,n=fn.g,s=fn.b;return t!==Ce?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(gs),this.setHSL(gs.h+t,gs.s+e,gs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(gs),t.getHSL(El);let n=ha(gs.h,El.h,e),s=ha(gs.s,El.s,e),r=ha(gs.l,El.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fn=new At;At.NAMES=tg;var sr=class extends _e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mi,this.environmentIntensity=1,this.environmentRotation=new Mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},ai=new I,ki=new I,_h=new I,Hi=new I,Dr=new I,Ur=new I,Op=new I,xh=new I,yh=new I,vh=new I,Sh=new ue,Mh=new ue,bh=new ue,an=class i{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ai.subVectors(t,e),s.cross(ai);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ai.subVectors(s,e),ki.subVectors(n,e),_h.subVectors(t,e);let o=ai.dot(ai),a=ai.dot(ki),l=ai.dot(_h),c=ki.dot(ki),u=ki.dot(_h),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,g=(o*u-a*l)*h;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Hi)===null?!1:Hi.x>=0&&Hi.y>=0&&Hi.x+Hi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hi.x),l.addScaledVector(o,Hi.y),l.addScaledVector(a,Hi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Sh.setScalar(0),Mh.setScalar(0),bh.setScalar(0),Sh.fromBufferAttribute(t,e),Mh.fromBufferAttribute(t,n),bh.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Sh,r.x),o.addScaledVector(Mh,r.y),o.addScaledVector(bh,r.z),o}static isFrontFacing(t,e,n,s){return ai.subVectors(n,e),ki.subVectors(t,e),ai.cross(ki).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ai.subVectors(this.c,this.b),ki.subVectors(this.a,this.b),ai.cross(ki).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Dr.subVectors(s,n),Ur.subVectors(r,n),xh.subVectors(t,n);let l=Dr.dot(xh),c=Ur.dot(xh);if(l<=0&&c<=0)return e.copy(n);yh.subVectors(t,s);let u=Dr.dot(yh),d=Ur.dot(yh);if(u>=0&&d<=u)return e.copy(s);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0&&l-u>0)return o=l/(l-u),e.copy(n).addScaledVector(Dr,o);vh.subVectors(t,r);let f=Dr.dot(vh),g=Ur.dot(vh);if(g>=0&&f<=g)return e.copy(r);let v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Ur,a);let p=u*g-f*d;if(p<=0&&d-u>=0&&f-g>=0)return Op.subVectors(r,s),a=(d-u)/(d-u+(f-g)),e.copy(s).addScaledVector(Op,a);let m=1/(p+v+h);return o=v*m,a=h*m,e.copy(n).addScaledVector(Dr,o).addScaledVector(Ur,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},jt=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(li.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(li.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=li.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,li):li.fromBufferAttribute(r,o),li.applyMatrix4(t.matrixWorld),this.expandByPoint(li);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Al.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Al.copy(n.boundingBox)),Al.applyMatrix4(t.matrixWorld),this.union(Al)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,li),li.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Qo),Rl.subVectors(this.max,Qo),Or.subVectors(t.a,Qo),Fr.subVectors(t.b,Qo),Br.subVectors(t.c,Qo),_s.subVectors(Fr,Or),xs.subVectors(Br,Fr),Ks.subVectors(Or,Br);let e=[0,-_s.z,_s.y,0,-xs.z,xs.y,0,-Ks.z,Ks.y,_s.z,0,-_s.x,xs.z,0,-xs.x,Ks.z,0,-Ks.x,-_s.y,_s.x,0,-xs.y,xs.x,0,-Ks.y,Ks.x,0];return!Th(e,Or,Fr,Br,Rl)||(e=[1,0,0,0,1,0,0,0,1],!Th(e,Or,Fr,Br,Rl))?!1:(Cl.crossVectors(_s,xs),e=[Cl.x,Cl.y,Cl.z],Th(e,Or,Fr,Br,Rl))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,li).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(li).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Vi=[new I,new I,new I,new I,new I,new I,new I,new I],li=new I,Al=new jt,Or=new I,Fr=new I,Br=new I,_s=new I,xs=new I,Ks=new I,Qo=new I,Rl=new I,Cl=new I,Zs=new I;function Th(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Zs.fromArray(i,r);let a=s.x*Math.abs(Zs.x)+s.y*Math.abs(Zs.y)+s.z*Math.abs(Zs.z),l=t.dot(Zs),c=e.dot(Zs),u=n.dot(Zs);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var ze=new I,Pl=new xt,N0=0,we=class extends ci{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:N0++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=bd,this.updateRanges=[],this.gpuType=wn,this.version=0,this._normalizationScale=t!==void 0?fu(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Pl.fromBufferAttribute(this,e),Pl.applyMatrix3(t),this.setXY(e,Pl.x,Pl.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Ad(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Rd(t,this.array)}};var ma=class extends we{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ga=class extends we{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var en=class extends we{constructor(t,e,n){super(new Float32Array(t),e,n)}},D0=new jt,ta=new I,wh=new I,ke=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):D0.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ta.subVectors(t,this.center);let e=ta.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ta,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(wh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ta.copy(t.center).add(wh)),this.expandByPoint(ta.copy(t.center).sub(wh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},U0=0,Zn=new Tt,Eh=new _e,zr=new I,kn=new jt,ea=new jt,tn=new I,Ue=class i extends ci{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:U0++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(o0(t)?ga:ma)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Zn.makeRotationFromQuaternion(t),this.applyMatrix4(Zn),this}rotateX(t){return Zn.makeRotationX(t),this.applyMatrix4(Zn),this}rotateY(t){return Zn.makeRotationY(t),this.applyMatrix4(Zn),this}rotateZ(t){return Zn.makeRotationZ(t),this.applyMatrix4(Zn),this}translate(t,e,n){return Zn.makeTranslation(t,e,n),this.applyMatrix4(Zn),this}scale(t,e,n){return Zn.makeScale(t,e,n),this.applyMatrix4(Zn),this}lookAt(t){return Eh.lookAt(t),Eh.updateMatrix(),this.applyMatrix4(Eh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zr).negate(),this.translate(zr.x,zr.y,zr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new en(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Et("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jt);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Dt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];kn.setFromBufferAttribute(r),this.morphTargetsRelative?(tn.addVectors(this.boundingBox.min,kn.min),this.boundingBox.expandByPoint(tn),tn.addVectors(this.boundingBox.max,kn.max),this.boundingBox.expandByPoint(tn)):(this.boundingBox.expandByPoint(kn.min),this.boundingBox.expandByPoint(kn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Dt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ke);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Dt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let n=this.boundingSphere.center;if(kn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];ea.setFromBufferAttribute(a),this.morphTargetsRelative?(tn.addVectors(kn.min,ea.min),kn.expandByPoint(tn),tn.addVectors(kn.max,ea.max),kn.expandByPoint(tn)):(kn.expandByPoint(ea.min),kn.expandByPoint(ea.max))}kn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)tn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(tn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)tn.fromBufferAttribute(a,c),l&&(zr.fromBufferAttribute(t,c),tn.add(zr)),s=Math.max(s,n.distanceToSquared(tn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Dt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Dt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new we(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let P=0;P<n.count;P++)a[P]=new I,l[P]=new I;let u=new I,d=new I,h=new I,f=new xt,g=new xt,v=new xt,p=new I,m=new I;function x(P,A,R){c[P]=c[A]=c[R]=1,u.fromBufferAttribute(n,P),d.fromBufferAttribute(n,A),h.fromBufferAttribute(n,R),f.fromBufferAttribute(r,P),g.fromBufferAttribute(r,A),v.fromBufferAttribute(r,R),d.sub(u),h.sub(u),g.sub(f),v.sub(f);let L=1/(g.x*v.y-v.x*g.y);isFinite(L)&&(p.copy(d).multiplyScalar(v.y).addScaledVector(h,-g.y).multiplyScalar(L),m.copy(h).multiplyScalar(g.x).addScaledVector(d,-v.x).multiplyScalar(L),a[P].add(p),a[A].add(p),a[R].add(p),l[P].add(m),l[A].add(m),l[R].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let P=0,A=S.length;P<A;++P){let R=S[P],L=R.start,O=R.count;for(let N=L,z=L+O;N<z;N+=3)x(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let y=new I,M=new I,w=new I,_=new I;function b(P){w.fromBufferAttribute(s,P),_.copy(w);let A=a[P];y.copy(A),y.sub(w.multiplyScalar(w.dot(A))).normalize(),M.crossVectors(_,A);let L=M.dot(l[P])<0?-1:1;o.setXYZW(P,y.x,y.y,y.z,L)}for(let P=0,A=n.count;P<A;++P)c[P]&&b(P);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new we(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,u=new I,d=new I;if(t)for(let h=0,f=t.count;h<f;h+=3){let g=t.getX(h+0),v=t.getX(h+1),p=t.getX(h+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,p),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,f=e.count;h<f;h+=3)s.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)tn.fromBufferAttribute(t,e),tn.normalize(),t.setXYZ(e,tn.x,tn.y,tn.z)}toNonIndexed(){function t(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,g=0;for(let v=0,p=l.length;v<p;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*u;for(let m=0;m<u;m++)h[g++]=c[f++]}return new we(h,u,d)}if(this.index===null)return Et("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=t(h,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(e))}let r=t.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},rr=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=bd,this.updateRanges=[],this.version=0,this.uuid=Ri()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});let e=Fp(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=this.array.slice(0).buffer);let n=new this.array.constructor(t.arrayBuffers[e]),s=new this.constructor(n,this.stride);return s.setUsage(this.usage),s}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={});let e=Fp(this.array);t.arrayBuffers[e]===void 0&&(t.arrayBuffers[e]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:e,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Fp(i){return i.buffer._uuid===void 0&&(i.buffer._uuid=Ri()),i.byteOffset===0&&i.byteLength===i.buffer.byteLength?i.buffer._uuid:i.buffer._uuid+":"+i.byteOffset+":"+i.byteLength}var bn=new I,Ms=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s,this._normalizationScale=t!==void 0?fu(t.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)bn.fromBufferAttribute(this,e),bn.applyMatrix4(t),this.setXYZ(e,bn.x,bn.y,bn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)bn.fromBufferAttribute(this,e),bn.applyNormalMatrix(t),this.setXYZ(e,bn.x,bn.y,bn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)bn.fromBufferAttribute(this,e),bn.transformDirection(t),this.setXYZ(e,bn.x,bn.y,bn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=this._denormalize(e)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=this._denormalize(e)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=this._denormalize(e)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=this._denormalize(e)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),r=this._normalize(r)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){fa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new we(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){fa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Ad(t,this.data.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Rd(t,this.data.array)}},Ah=new I,O0=new I,F0=new Ot,on=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Ah.subVectors(n,e).cross(O0.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Ah),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||F0.getNormalMatrix(t),s=this.coplanarPoint(Ah).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},B0=0,gn=class extends ci{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:B0++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=mo,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sd,this.blendDst=rd,this.blendEquation=hr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new At(0,0,0),this.blendAlpha=0,this.depthFunc=jr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=nc,this.stencilZFail=nc,this.stencilZPass=nc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Et(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Et(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new At().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new on().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new xt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new xt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ro=class extends gn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new At(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},kr,na=new I,Hr=new I,Vr=new I,Gr=new xt,ia=new xt,eg=new Tt,Il=new I,sa=new I,Ll=new I,Bp=new xt,Rh=new xt,zp=new xt,_a=class extends _e{constructor(t=new ro){if(super(),this.isSprite=!0,this.type="Sprite",kr===void 0){kr=new Ue;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new rr(e,5);kr.setIndex([0,1,2,0,2,3]),kr.setAttribute("position",new Ms(n,3,0,!1)),kr.setAttribute("uv",new Ms(n,2,3,!1))}this.geometry=kr,this.material=t,this.center=new xt(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Dt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hr.setFromMatrixScale(this.matrixWorld),eg.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Vr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hr.multiplyScalar(-Vr.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let o=this.center;Nl(Il.set(-.5,-.5,0),Vr,o,Hr,s,r),Nl(sa.set(.5,-.5,0),Vr,o,Hr,s,r),Nl(Ll.set(.5,.5,0),Vr,o,Hr,s,r),Bp.set(0,0),Rh.set(1,0),zp.set(1,1);let a=t.ray.intersectTriangle(Il,sa,Ll,!1,na);if(a===null&&(Nl(sa.set(-.5,.5,0),Vr,o,Hr,s,r),Rh.set(0,1),a=t.ray.intersectTriangle(Il,Ll,sa,!1,na),a===null))return;let l=t.ray.origin.distanceTo(na);l<t.near||l>t.far||e.push({distance:l,point:na.clone(),uv:an.getInterpolation(na,Il,sa,Ll,Bp,Rh,zp,new xt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}toJSON(t){let e=super.toJSON(t);return e.object.center=this.center.toArray(),e}};function Nl(i,t,e,n,s,r){Gr.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(ia.x=r*Gr.x-s*Gr.y,ia.y=s*Gr.x+r*Gr.y):ia.copy(Gr),i.copy(t),i.x+=ia.x,i.y+=ia.y,i.applyMatrix4(eg)}var Gi=new I,Ch=new I,Dl=new I,Ul=new I,Qn=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Gi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Gi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Gi.copy(this.origin).addScaledVector(this.direction,e),Gi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ch.copy(t).add(e).multiplyScalar(.5),Dl.copy(e).sub(t).normalize(),Ul.copy(this.origin).sub(Ch);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Dl),a=Ul.dot(this.direction),l=-Ul.dot(Dl),c=Ul.lengthSq(),u=Math.abs(1-o*o),d,h,f,g;if(u>0)if(d=o*l-a,h=o*a-l,g=r*u,d>=0)if(h>=-g)if(h<=g){let v=1/u;d*=v,h*=v,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Ch).addScaledVector(Dl,h),f}intersectSphere(t,e){if(t.radius<0)return null;Gi.subVectors(t.center,this.origin);let n=Gi.dot(this.direction),s=Gi.dot(Gi)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,s=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,s=(t.min.x-h.x)*c),u>=0?(r=(t.min.y-h.y)*u,o=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,o=(t.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-h.z)*d,l=(t.max.z-h.z)*d):(a=(t.max.z-h.z)*d,l=(t.min.z-h.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Gi)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,d=t.x-o.x,h=t.y-o.y,f=t.z-o.z,g=e.x-o.x,v=e.y-o.y,p=e.z-o.z,m=n.x-o.x,x=n.y-o.y,S=n.z-o.z,y=Math.abs(l),M=Math.abs(c),w=Math.abs(u),_,b,P,A,R,L,O,N,z,G,W,et;if(y>=M&&y>=w?(P=l,L=d,z=g,et=m,l>=0?(_=c,b=u,A=h,R=f,O=v,N=p,G=x,W=S):(_=u,b=c,A=f,R=h,O=p,N=v,G=S,W=x)):M>=w?(P=c,L=h,z=v,et=x,c>=0?(_=u,b=l,A=f,R=d,O=p,N=g,G=S,W=m):(_=l,b=u,A=d,R=f,O=g,N=p,G=m,W=S)):(P=u,L=f,z=p,et=S,u>=0?(_=l,b=c,A=d,R=h,O=g,N=v,G=m,W=x):(_=c,b=l,A=h,R=d,O=v,N=g,G=x,W=m)),P===0)return null;let q=_/P,Q=b/P,tt=1/P,vt=A-q*L,Ut=R-Q*L,Z=O-q*z,ut=N-Q*z,yt=G-q*et,Pt=W-Q*et,pt=yt*ut-Pt*Z,Ft=vt*Pt-Ut*yt,Re=Z*Ut-ut*vt;if(s){if(pt<0||Ft<0||Re<0)return null}else if((pt<0||Ft<0||Re<0)&&(pt>0||Ft>0||Re>0))return null;let Lt=pt+Ft+Re;if(Lt===0)return null;let te=tt*(pt*L+Ft*z+Re*et);return(Lt>0?te<0:te>0)?null:this.at(te/Lt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Dn=class extends gn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new At(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=Ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},kp=new Tt,js=new Qn,Ol=new ke,Hp=new I,Fl=new I,Bl=new I,zl=new I,Ph=new I,kl=new I,Vp=new I,Hl=new I,Jt=class extends _e{constructor(t=new Ue,e=new Dn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){kl.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(Ph.fromBufferAttribute(d,t),o?kl.addScaledVector(Ph,u):kl.addScaledVector(Ph.sub(e),u))}e.add(kl)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ol.copy(n.boundingSphere),Ol.applyMatrix4(r),js.copy(t.ray).recast(t.near),!(Ol.containsPoint(js.origin)===!1&&(js.intersectSphere(Ol,Hp)===null||js.origin.distanceToSquared(Hp)>(t.far-t.near)**2))&&(kp.copy(r).invert(),js.copy(t.ray).applyMatrix4(kp),!(n.boundingBox!==null&&js.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,js)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){let p=h[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),S=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let y=x,M=S;y<M;y+=3){let w=a.getX(y),_=a.getX(y+1),b=a.getX(y+2);s=Vl(this,m,t,n,c,u,d,w,_,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){let x=a.getX(p),S=a.getX(p+1),y=a.getX(p+2);s=Vl(this,o,t,n,c,u,d,x,S,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=h.length;g<v;g++){let p=h[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),S=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=x,M=S;y<M;y+=3){let w=y,_=y+1,b=y+2;s=Vl(this,m,t,n,c,u,d,w,_,b),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let p=g,m=v;p<m;p+=3){let x=p,S=p+1,y=p+2;s=Vl(this,o,t,n,c,u,d,x,S,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function z0(i,t,e,n,s,r,o,a){let l;if(t.side===qe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Vn,a),l===null)return null;Hl.copy(a),Hl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Hl);return c<e.near||c>e.far?null:{distance:c,point:Hl.clone(),object:i}}function Vl(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Fl),i.getVertexPosition(l,Bl),i.getVertexPosition(c,zl);let u=z0(i,t,e,n,Fl,Bl,zl,Vp);if(u){let d=new I;an.getBarycoord(Vp,Fl,Bl,zl,d),s&&(u.uv=an.getInterpolatedAttribute(s,a,l,c,d,new xt)),r&&(u.uv1=an.getInterpolatedAttribute(r,a,l,c,d,new xt)),o&&(u.normal=an.getInterpolatedAttribute(o,a,l,c,d,new I),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new I,materialIndex:0};an.getNormal(Fl,Bl,zl,h.normal),u.face=h,u.barycoord=d}return u}var ra=new ue,Gp=new ue,Wp=new ue,k0=new ue,Xp=new Tt,Gl=new I,Ih=new ke,qp=new Tt,Lh=new Qn,xa=class extends Jt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=kh,this.bindMatrix=new Tt,this.bindMatrixInverse=new Tt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new jt),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Gl),this.boundingBox.expandByPoint(Gl)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ke),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Gl),this.boundingSphere.expandByPoint(Gl)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}raycast(t,e){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ih.copy(this.boundingSphere),Ih.applyMatrix4(s),t.ray.intersectsSphere(Ih)!==!1&&(qp.copy(s).invert(),Lh.copy(t.ray).applyMatrix4(qp),!(this.boundingBox!==null&&Lh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Lh)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new ue,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===kh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===km?this.bindMatrixInverse.copy(this.bindMatrix).invert():Et("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,s=this.geometry;Gp.fromBufferAttribute(s.attributes.skinIndex,t),Wp.fromBufferAttribute(s.attributes.skinWeight,t),e.isVector4?(ra.copy(e),e.set(0,0,0,0)):(ra.set(e.x,e.y,e.z,1),e.set(0,0,0)),ra.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=Wp.getComponent(r);if(o!==0){let a=Gp.getComponent(r);Xp.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(k0.copy(ra).applyMatrix4(Xp),o)}}return e.isVector4&&(e.w=ra.w),e.applyMatrix4(this.bindMatrixInverse)}},oo=class extends _e{constructor(){super(),this.isBone=!0,this.type="Bone"}},qi=class extends Xe{constructor(t=null,e=1,n=1,s,r,o,a,l,c=De,u=De,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yp=new Tt,H0=new Tt,ya=class i{constructor(t=[],e=[]){this.uuid=Ri(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){Et("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Tt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new Tt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:H0;Yp.multiplyMatrices(a,e[r]),Yp.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new qi(e,t,t,Nn,wn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){let r=t.bones[n],o=e[r];o===void 0&&(Et("Skeleton: No bone found with UUID:",r),o=new oo),this.bones.push(o),this.boneInverses.push(new Tt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){let o=e[s];t.bones.push(o.uuid);let a=n[s];t.boneInverses.push(a.toArray())}return t}},$i=class extends we{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Wr=new Tt,$p=new Tt,Wl=[],Kp=new jt,V0=new Tt,oa=new Jt,aa=new ke,or=class extends Jt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new $i(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,V0)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new jt),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Wr),Kp.copy(t.boundingBox).applyMatrix4(Wr),this.boundingBox.union(Kp)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ke),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Wr),aa.copy(t.boundingSphere).applyMatrix4(Wr),this.boundingSphere.union(aa)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(oa.geometry=this.geometry,oa.material=this.material,oa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),aa.copy(this.boundingSphere),aa.applyMatrix4(n),t.ray.intersectsSphere(aa)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Wr),$p.multiplyMatrices(n,Wr),oa.matrixWorld=$p,oa.raycast(t,Wl);for(let o=0,a=Wl.length;o<a;o++){let l=Wl[o];l.instanceId=r,l.object=this,e.push(l)}Wl.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new $i(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new qi(new Float32Array(s*this.count),s,this.count,Dc,wn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Js=new ke,G0=new xt(.5,.5),Xl=new I,Ki=class{constructor(t=new on,e=new on,n=new on,s=new on,r=new on,o=new on){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Jn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],g=r[8],v=r[9],p=r[10],m=r[11],x=r[12],S=r[13],y=r[14],M=r[15];if(s[0].setComponents(c-o,f-u,m-g,M-x).normalize(),s[1].setComponents(c+o,f+u,m+g,M+x).normalize(),s[2].setComponents(c+a,f+d,m+v,M+S).normalize(),s[3].setComponents(c-a,f-d,m-v,M-S).normalize(),n)s[4].setComponents(l,h,p,y).normalize(),s[5].setComponents(c-l,f-h,m-p,M-y).normalize();else if(s[4].setComponents(c-l,f-h,m-p,M-y).normalize(),e===Jn)s[5].setComponents(c+l,f+h,m+p,M+y).normalize();else if(e===Qr)s[5].setComponents(l,h,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Js.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Js.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Js)}intersectsSprite(t){Js.center.set(0,0,0);let e=G0.distanceTo(t.center);return Js.radius=.7071067811865476+e,Js.applyMatrix4(t.matrixWorld),this.intersectsSphere(Js)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Xl.x=s.normal.x>0?t.max.x:t.min.x,Xl.y=s.normal.y>0?t.max.y:t.min.y,Xl.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Xl)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Zp=new Tt,va=class i{constructor(){this.coordinateSystem=Jn,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,n=this._frustums;for(let s=0;s<e.length;s++){let r=e[s];Zp.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[s]===void 0&&(n[s]=new Ki),n[s].setFromProjectionMatrix(Zp,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,n=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new Ki),e[s].copy(n[s]);return this._count=t._count,this}clone(){return new i().copy(this)}};function Nh(i,t){return i-t}function W0(i,t){return i.z-t.z}function X0(i,t){return t.z-i.z}var Xh=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,n,s){let r=this.pool,o=this.list;this.index>=r.length&&r.push({start:-1,count:-1,z:-1,index:-1});let a=r[this.index];o.push(a),this.index++,a.start=t,a.count=e,a.z=n,a.index=s}reset(){this.list.length=0,this.index=0}},Ln=new Tt,q0=new At(1,1,1),Y0=new Ki,$0=new va,ql=new jt,Qs=new ke,Dh=new I,jp=new I,Jp=new I,K0=new I,Uh=new Xh,pn=new Jt,Yl=[];function Z0(i,t,e=0){let n=t.itemSize;if(i.isInterleavedBufferAttribute||i.array.constructor!==t.array.constructor){let s=i.count;for(let r=0;r<s;r++)for(let o=0;o<n;o++)t.setComponent(r+e,o,i.getComponent(r,o))}else t.array.set(i.array,e*n);t.needsUpdate=!0}function yi(i,t){if(i.constructor!==t.constructor){let e=Math.min(i.length,t.length);for(let n=0;n<e;n++)t[n]=i[n]}else{let e=Math.min(i.length,t.length);t.set(new i.constructor(i.buffer,0,e))}}var Sa=class extends Jt{constructor(t,e,n=e*2,s){super(new Ue,s),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._mergedDrawCounts=new Int32Array(t),this._mergedDrawStarts=new Int32Array(t),this._mergedDrawInstanceCounts=new Int32Array(t),this._mergedDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._previousMatricesTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4),n=new qi(e,t,t,Nn,wn);this._matricesTexture=n}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);let e=new Uint32Array(t*t),n=new qi(e,t,t,ka,ei);this._indirectTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);let e=new Float32Array(t*t*4).fill(1),n=new qi(e,t,t,Nn,wn);n.colorSpace=Wt.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){let e=this.geometry,n=this._maxVertexCount,s=this._maxIndexCount;if(this._geometryInitialized===!1){for(let r in t.attributes){let o=t.getAttribute(r),{array:a,itemSize:l,normalized:c}=o,u=new a.constructor(n*l),d=new we(u,l,c);e.setAttribute(r,d)}if(t.getIndex()!==null){let r=n>65535?new Uint32Array(s):new Uint16Array(s);e.setIndex(new we(r,1))}this._geometryInitialized=!0}}_validateGeometry(t){let e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in e.attributes){if(!t.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let s=t.getAttribute(n),r=e.getAttribute(n);if(s.itemSize!==r.itemSize||s.normalized!==r.normalized)throw new Error(`THREE.BatchedMesh: Added geometry attribute "${n}" has an inconsistent itemSize or normalized value.`)}}validateInstanceId(t){let e=this._instanceInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${t}. Instance is either out of range or has been deleted.`)}validateGeometryId(t){let e=this._geometryInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${t}. Geometry is either out of range or has been deleted.`)}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jt);let t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let n=0,s=e.length;n<s;n++){if(e[n].active===!1)continue;let r=e[n].geometryIndex;this.getMatrixAt(n,Ln),this.getBoundingBoxAt(r,ql).applyMatrix4(Ln),t.union(ql)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ke);let t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let n=0,s=e.length;n<s;n++){if(e[n].active===!1)continue;let r=e[n].geometryIndex;this.getMatrixAt(n,Ln),this.getBoundingSphereAt(r,Qs).applyMatrix4(Ln),t.union(Qs)}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:t},s=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Nh),s=this._availableInstanceIds.shift(),this._instanceInfo[s]=n):(s=this._instanceInfo.length,this._instanceInfo.push(n));let r=this._matricesTexture;Ln.identity().toArray(r.image.data,s*16),r.needsUpdate=!0;let o=this._colorsTexture;return o&&(q0.toArray(o.image.data,s*4),o.needsUpdate=!0),this._visibilityChanged=!0,s}addGeometry(t,e=-1,n=-1){this._initializeGeometry(t),this._validateGeometry(t);let s={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},r=this._geometryInfo;s.vertexStart=this._nextVertexStart,s.reservedVertexCount=e===-1?t.getAttribute("position").count:e;let o=t.getIndex();if(o!==null&&(s.indexStart=this._nextIndexStart,s.reservedIndexCount=n===-1?o.count:n),s.indexStart!==-1&&s.indexStart+s.reservedIndexCount>this._maxIndexCount||s.vertexStart+s.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Nh),l=this._availableGeometryIds.shift(),r[l]=s):(l=this._geometryCount,this._geometryCount++,r.push(s)),this.setGeometryAt(l,t),this._nextIndexStart=s.indexStart+s.reservedIndexCount,this._nextVertexStart=s.vertexStart+s.reservedVertexCount,l}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);let n=this.geometry,s=n.getIndex()!==null,r=n.getIndex(),o=e.getIndex(),a=this._geometryInfo[t];if(s&&o.count>a.reservedIndexCount||e.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let l=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=e.getAttribute("position").count;for(let u in n.attributes){let d=e.getAttribute(u),h=n.getAttribute(u);Z0(d,h,l);let f=d.itemSize;for(let g=d.count,v=c;g<v;g++){let p=l+g;for(let m=0;m<f;m++)h.setComponent(p,m,0)}h.needsUpdate=!0,h.addUpdateRange(l*f,c*f)}if(s){let u=a.indexStart,d=a.reservedIndexCount;a.indexCount=e.getIndex().count;for(let h=0;h<o.count;h++)r.setX(u+h,l+o.getX(h));for(let h=o.count,f=d;h<f;h++)r.setX(u+h,l);r.needsUpdate=!0,r.addUpdateRange(u,a.reservedIndexCount)}return a.start=s?a.indexStart:a.vertexStart,a.count=s?a.indexCount:a.vertexCount,a.boundingBox=null,e.boundingBox!==null&&(a.boundingBox=e.boundingBox.clone()),a.boundingSphere=null,e.boundingSphere!==null&&(a.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t}deleteGeometry(t){let e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;let n=this._instanceInfo;for(let s=0,r=n.length;s<r;s++)n[s].active&&n[s].geometryIndex===t&&this.deleteInstance(s);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this}deleteInstance(t){return this.validateInstanceId(t),this._instanceInfo[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this}optimize(){let t=0,e=0,n=this._geometryInfo,s=n.map((o,a)=>a).sort((o,a)=>n[o].vertexStart-n[a].vertexStart),r=this.geometry;for(let o=0,a=n.length;o<a;o++){let l=s[o],c=n[l];if(c.active!==!1){if(r.index!==null){if(c.indexStart!==e){let{indexStart:u,vertexStart:d,reservedIndexCount:h}=c,f=r.index,g=f.array,v=t-d;for(let p=u;p<u+h;p++)g[p]=g[p]+v;f.array.copyWithin(e,u,u+h),f.addUpdateRange(e,h),f.needsUpdate=!0,c.indexStart=e}e+=c.reservedIndexCount}if(c.vertexStart!==t){let{vertexStart:u,reservedVertexCount:d}=c,h=r.attributes;for(let f in h){let g=h[f],{array:v,itemSize:p}=g;v.copyWithin(t*p,u*p,(u+d)*p),g.addUpdateRange(t*p,d*p),g.needsUpdate=!0}c.vertexStart=t}t+=c.reservedVertexCount,c.start=r.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=e,this._nextVertexStart=t,this._visibilityChanged=!0,this}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;let n=this.geometry,s=this._geometryInfo[t];if(s.boundingBox===null){let r=new jt,o=n.index,a=n.attributes.position;for(let l=s.start,c=s.start+s.count;l<c;l++){let u=l;o&&(u=o.getX(u)),r.expandByPoint(Dh.fromBufferAttribute(a,u))}s.boundingBox=r}return e.copy(s.boundingBox),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;let n=this.geometry,s=this._geometryInfo[t];if(s.boundingSphere===null){let r=new ke;this.getBoundingBoxAt(t,ql),ql.getCenter(r.center);let o=n.index,a=n.attributes.position,l=0;for(let c=s.start,u=s.start+s.count;c<u;c++){let d=c;o&&(d=o.getX(d)),Dh.fromBufferAttribute(a,d),l=Math.max(l,r.center.distanceToSquared(Dh))}r.radius=Math.sqrt(l),s.boundingSphere=r}return e.copy(s.boundingSphere),e}setMatrixAt(t,e){this.validateInstanceId(t);let n=this._matricesTexture,s=this._matricesTexture.image.data;return e.toArray(s,t*16),n.needsUpdate=!0,this}getMatrixAt(t,e){return this.validateInstanceId(t),e.fromArray(this._matricesTexture.image.data,t*16)}setColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null&&this._initColorsTexture(),e.toArray(this._colorsTexture.image.data,t*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null?e.isVector4?e.set(1,1,1,1):e.setRGB(1,1,1):e.fromArray(this._colorsTexture.image.data,t*4)}setVisibleAt(t,e){return this.validateInstanceId(t),this._instanceInfo[t].visible===e?this:(this._instanceInfo[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){return this.validateInstanceId(t),this._instanceInfo[t].visible}setGeometryIdAt(t,e){return this.validateInstanceId(t),this.validateGeometryId(e),this._instanceInfo[t].geometryIndex=e,this._visibilityChanged=!0,this}getGeometryIdAt(t){return this.validateInstanceId(t),this._instanceInfo[t].geometryIndex}getGeometryRangeAt(t,e={}){this.validateGeometryId(t);let n=this._geometryInfo[t];return e.vertexStart=n.vertexStart,e.vertexCount=n.vertexCount,e.reservedVertexCount=n.reservedVertexCount,e.indexStart=n.indexStart,e.indexCount=n.indexCount,e.reservedIndexCount=n.reservedIndexCount,e.start=n.start,e.count=n.count,e}setInstanceCount(t){let e=this._availableInstanceIds,n=this._instanceInfo;for(e.sort(Nh);e[e.length-1]===n.length-1;)n.pop(),e.pop();if(t<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);let s=new Int32Array(t),r=new Int32Array(t);yi(this._multiDrawCounts,s),yi(this._multiDrawStarts,r),this._multiDrawCounts=s,this._multiDrawStarts=r;let o=new Int32Array(t),a=new Int32Array(t),l=new Int32Array(t);yi(this._mergedDrawCounts,o),yi(this._mergedDrawStarts,a),yi(this._mergedDrawInstanceCounts,l),this._mergedDrawCounts=o,this._mergedDrawStarts=a,this._mergedDrawInstanceCounts=l,this._maxInstanceCount=t;let c=this._indirectTexture,u=this._matricesTexture,d=this._colorsTexture;c.dispose(),this._initIndirectTexture(),yi(c.image.data,this._indirectTexture.image.data),u.dispose(),this._initMatricesTexture(),yi(u.image.data,this._matricesTexture.image.data),d&&(d.dispose(),this._initColorsTexture(),yi(d.image.data,this._colorsTexture.image.data)),this._previousMatricesTexture!==null&&(this._previousMatricesTexture.dispose(),this._previousMatricesTexture=null)}setGeometrySize(t,e){let n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);let r=this.geometry;r.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new Ue,this._initializeGeometry(r));let o=this.geometry;r.index&&yi(r.index.array,o.index.array);for(let a in r.attributes)yi(r.attributes[a].array,o.attributes[a].array);this._visibilityChanged=!0}raycast(t,e){let n=this._instanceInfo,s=this._geometryInfo,r=this.matrixWorld,o=this.geometry;pn.material=this.material,pn.geometry.index=o.index,pn.geometry.attributes=o.attributes,pn.geometry.boundingBox===null&&(pn.geometry.boundingBox=new jt),pn.geometry.boundingSphere===null&&(pn.geometry.boundingSphere=new ke);for(let a=0,l=n.length;a<l;a++){if(!n[a].visible||!n[a].active)continue;let c=n[a].geometryIndex,u=s[c];pn.geometry.setDrawRange(u.start,u.count),this.getMatrixAt(a,pn.matrixWorld).premultiply(r),this.getBoundingBoxAt(c,pn.geometry.boundingBox),this.getBoundingSphereAt(c,pn.geometry.boundingSphere),pn.raycast(t,Yl);for(let d=0,h=Yl.length;d<h;d++){let f=Yl[d];f.object=this,f.batchId=a,e.push(f)}Yl.length=0}pn.material=null,pn.geometry.index=null,pn.geometry.attributes={},pn.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._availableInstanceIds=t._availableInstanceIds.slice(),this._availableGeometryIds=t._availableGeometryIds.slice(),this._nextIndexStart=t._nextIndexStart,this._nextVertexStart=t._nextVertexStart,this._geometryCount=t._geometryCount,this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._multiDrawBytesPerElement=t._multiDrawBytesPerElement,this._mergedDrawCounts=t._mergedDrawCounts.slice(),this._mergedDrawStarts=t._mergedDrawStarts.slice(),this._mergedDrawInstanceCounts=t._mergedDrawInstanceCounts.slice(),this._indirectTexture=t._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),t._colorsTexture!==null?(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()):this._colorsTexture=null,this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this._previousMatricesTexture!==null&&(this._previousMatricesTexture.dispose(),this._previousMatricesTexture=null)}_updateDrawParameters(t,e,n,s="multiDraw"){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let r=e.getIndex(),o=r===null?1:r.array.BYTES_PER_ELEMENT,a=1;n.wireframe&&(a=2,o=e.attributes.position.count>65535?4:2);let l=this._instanceInfo,c=this._multiDrawStarts,u=this._multiDrawCounts,d=this._mergedDrawStarts,h=this._mergedDrawCounts,f=this._mergedDrawInstanceCounts,g=this._geometryInfo,v=this.perObjectFrustumCulled,p=this._indirectTexture,m=p.image.data,x=t.isArrayCamera?$0:Y0;v&&(t.isArrayCamera?x.setFromArrayCamera(t):(Ln.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse).multiply(this.matrixWorld),x.setFromProjectionMatrix(Ln,t.coordinateSystem,t.reversedDepth)));let S=0,y=0;if(this.sortObjects){Ln.copy(this.matrixWorld).invert(),jp.setFromMatrixPosition(t.matrixWorld).applyMatrix4(Ln),Jp.set(0,0,-1).transformDirection(t.matrixWorld).transformDirection(Ln);for(let _=0,b=l.length;_<b;_++)if(l[_].visible&&l[_].active){let P=l[_].geometryIndex;this.getMatrixAt(_,Ln),this.getBoundingSphereAt(P,Qs).applyMatrix4(Ln);let A=!1;if(v&&(A=!x.intersectsSphere(Qs)),!A){let R=g[P],L=K0.subVectors(Qs.center,jp).dot(Jp);Uh.push(R.start,R.count,L,_)}}let M=Uh.list,w=this.customSort;w===null?M.sort(n.transparent?X0:W0):w.call(this,M,t);for(let _=0,b=M.length;_<b;_++){let P=M[_],A=P.start*o*a,R=P.count*a;s==="merged"?y>0&&d[y-1]===A&&h[y-1]===R?f[y-1]++:(d[y]=A,h[y]=R,f[y]=1,y++):(c[S]=A,u[S]=R),m[S]=P.index,S++}Uh.reset()}else for(let M=0,w=l.length;M<w;M++)if(l[M].visible&&l[M].active){let _=l[M].geometryIndex,b=!1;if(v&&(this.getMatrixAt(M,Ln),this.getBoundingSphereAt(_,Qs).applyMatrix4(Ln),b=!x.intersectsSphere(Qs)),!b){let P=g[_],A=P.start*o*a,R=P.count*a;s==="merged"?y>0&&d[y-1]===A&&h[y-1]===R?f[y-1]++:(d[y]=A,h[y]=R,f[y]=1,y++):(c[S]=A,u[S]=R),m[S]=M,S++}}p.needsUpdate=!0,this._multiDrawCount=S,this._mergedDrawCount=y,this._multiDrawBytesPerElement=o,this._visibilityChanged=!1}onBeforeRender(t,e,n,s,r){t.isWebGPURenderer===!0?(this._visibilityChanged||this.perObjectFrustumCulled||this.sortObjects)&&(this._indirectTexture.needsUpdate=!0):this._updateDrawParameters(n,s,r)}onBeforeShadow(t,e,n,s,r,o){t.isWebGPURenderer!==!0&&this._updateDrawParameters(s,r,o)}},ao=class extends gn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new At(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},fc=new I,pc=new I,Qp=new Tt,la=new Qn,$l=new ke,Oh=new I,tm=new I,bi=class extends _e{constructor(t=new Ue,e=new ao){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)fc.fromBufferAttribute(e,s-1),pc.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=fc.distanceTo(pc);t.setAttribute("lineDistance",new en(n,1))}else Et("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$l.copy(n.boundingSphere),$l.applyMatrix4(s),$l.radius+=r,t.ray.intersectsSphere($l)===!1)return;Qp.copy(s).invert(),la.copy(t.ray).applyMatrix4(Qp);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,p=g-1;v<p;v+=c){let m=u.getX(v),x=u.getX(v+1),S=Kl(this,t,la,l,m,x,v);S&&e.push(S)}if(this.isLineLoop){let v=u.getX(g-1),p=u.getX(f),m=Kl(this,t,la,l,v,p,g-1);m&&e.push(m)}}else{let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,p=g-1;v<p;v+=c){let m=Kl(this,t,la,l,v,v+1,v);m&&e.push(m)}if(this.isLineLoop){let v=Kl(this,t,la,l,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Kl(i,t,e,n,s,r,o){let a=i.geometry.attributes.position;if(fc.fromBufferAttribute(a,s),pc.fromBufferAttribute(a,r),e.distanceSqToSegment(fc,pc,Oh,tm)>n)return;Oh.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Oh);if(!(c<t.near||c>t.far))return{distance:c,point:tm.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var em=new I,nm=new I,bs=class extends bi{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)em.fromBufferAttribute(e,s),nm.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+em.distanceTo(nm);t.setAttribute("lineDistance",new en(n,1))}else Et("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ts=class extends bi{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}},lo=class extends gn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new At(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},im=new Tt,qh=new Qn,Zl=new ke,jl=new I,ws=class extends _e{constructor(t=new Ue,e=new lo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zl.copy(n.boundingSphere),Zl.applyMatrix4(s),Zl.radius+=r,t.ray.intersectsSphere(Zl)===!1)return;im.copy(s).invert(),qh.copy(t.ray).applyMatrix4(im);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,v=f;g<v;g++){let p=c.getX(g);jl.fromBufferAttribute(d,p),sm(jl,p,l,s,t,e,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,v=f;g<v;g++)jl.fromBufferAttribute(d,g),sm(jl,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function sm(i,t,e,n,s,r,o){let a=qh.distanceSqToPoint(i);if(a<e){let l=new I;qh.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Ma=class extends Xe{constructor(t=[],e=dr,n,s,r,o,a,l,c,u){super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ba=class extends Xe{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Zi=class extends Xe{constructor(t,e,n=ei,s,r,o,a=De,l=De,c,u=Yi,d=1){if(u!==Yi&&u!==is)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:t,height:e,depth:d};super(h,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new no(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ta=class extends Zi{constructor(t,e=ei,n=dr,s,r,o=De,a=De,l,c=Yi){let u={width:t,height:t,depth:1},d=[u,u,u,u,u,u];super(t,t,e,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},wa=class extends Xe{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Es=class i extends Ue{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new en(c,3)),this.setAttribute("normal",new en(u,3)),this.setAttribute("uv",new en(d,2));function g(v,p,m,x,S,y,M,w,_,b,P){let A=y/_,R=M/b,L=y/2,O=M/2,N=w/2,z=_+1,G=b+1,W=0,et=0,q=new I;for(let Q=0;Q<G;Q++){let tt=Q*R-O;for(let vt=0;vt<z;vt++){let Ut=vt*A-L;q[v]=Ut*x,q[p]=tt*S,q[m]=N,c.push(q.x,q.y,q.z),q[v]=0,q[p]=0,q[m]=w>0?1:-1,u.push(q.x,q.y,q.z),d.push(vt/_),d.push(1-Q/b),W+=1}}for(let Q=0;Q<b;Q++)for(let tt=0;tt<_;tt++){let vt=h+tt+z*Q,Ut=h+tt+z*(Q+1),Z=h+(tt+1)+z*(Q+1),ut=h+(tt+1)+z*Q;l.push(vt,Ut,ut),l.push(Ut,Z,ut),et+=6}a.addGroup(f,et,P),f+=et,h+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Ea=class i extends Ue{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,d=t/a,h=e/l,f=[],g=[],v=[],p=[];for(let m=0;m<u;m++){let x=m*h-o;for(let S=0;S<c;S++){let y=S*d-r;g.push(y,-x,0),v.push(0,0,1),p.push(S/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<a;x++){let S=x+c*m,y=x+c*(m+1),M=x+1+c*(m+1),w=x+1+c*m;f.push(S,y,w),f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new en(g,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Aa=class i extends Ue{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],d=new I,h=new I,f=[],g=[],v=[],p=[];for(let m=0;m<=n;m++){let x=[],S=m/n,y=o+S*a,M=t*Math.cos(y),w=Math.sqrt(t*t-M*M),_=0;m===0&&o===0?_=.5/e:m===n&&l===Math.PI&&(_=-.5/e);for(let b=0;b<=e;b++){let P=b/e,A=s+P*r;d.x=-w*Math.cos(A),d.y=M,d.z=w*Math.sin(A),g.push(d.x,d.y,d.z),h.copy(d).normalize(),v.push(h.x,h.y,h.z),p.push(P+_,1-S),x.push(c++)}u.push(x)}for(let m=0;m<n;m++)for(let x=0;x<e;x++){let S=u[m][x+1],y=u[m][x],M=u[m+1][x],w=u[m+1][x+1];(m!==0||o>0)&&f.push(S,y,w),(m!==n-1||l<Math.PI)&&f.push(y,M,w)}this.setIndex(f),this.setAttribute("position",new en(g,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function mr(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(rm(s))s.isRenderTargetTexture?(Et("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(rm(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function _n(i){let t={};for(let e=0;e<i.length;e++){let n=mr(i[e]);for(let s in n)t[s]=n[s]}return t}function rm(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function j0(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Cd(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}var ng={clone:mr,merge:_n},J0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Q0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ti=class extends gn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=J0,this.fragmentShader=Q0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=mr(t.uniforms),this.uniformsGroups=j0(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new At().setHex(s.value);break;case"v2":this.uniforms[n].value=new xt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ue().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ot().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Tt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},mc=class extends Ti{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Pe=class extends gn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new At(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new At(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$a,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},An=class extends Pe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new xt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return zt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new At(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new At(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new At(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return tr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){tr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Ra=class extends gn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new At(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new At(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$a,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=Ac,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},gc=class extends gn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},_c=class extends gn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function vs(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function ca(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function tx(i){function t(s,r){return i[s]-i[r]}let e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function om(i,t,e){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=e[r]*t;for(let l=0;l!==t;++l)s[o++]=i[a+l]}return s}function ex(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(t.push(r.time),e.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(t.push(r.time),o.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(t.push(r.time),e.push(o)),r=i[s++];while(r!==void 0)}var wi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},xc=class extends wi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Vh,endingEnd:Vh}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Gh:r=t,a=2*e-n;break;case Wh:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Gh:o=t,l=2*n-e;break;case Wh:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),v=g*g,p=v*g,m=-h*p+2*h*v-h*g,x=(1+h)*p+(-1.5-2*h)*v+(-.5+h)*g+1,S=(-1-f)*p+(1.5+f)*v+.5*g,y=f*p-f*v;for(let M=0;M!==a;++M)r[M]=m*o[u+M]+x*o[c+M]+S*o[l+M]+y*o[d+M];return r}},yc=class extends wi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=(n-e)/(s-e),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}},vc=class extends wi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Sc=class extends wi{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let g=(n-e)/(s-e),v=1-g;for(let p=0;p!==a;++p)r[p]=o[c+p]*v+o[l+p]*g;return r}let h=a*2,f=t-1;for(let g=0;g!==a;++g){let v=o[c+g],p=o[l+g],m=f*h+g*2,x=d[m],S=d[m+1],y=t*h+g*2,M=u[y],w=u[y+1],_=ix(n,e,x,M,s);r[g]=ig(_,v,S,w,p)}return r}};function ig(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function nx(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function ix(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=ig(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=nx(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Un=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=vs(e,this.TimeBufferType),this.values=vs(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:vs(t.times,Array),values:vs(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),ca(t.settings)&&(n.settings={inTangents:vs(t.settings.inTangents,Array),outTangents:vs(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new vc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new yc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new xc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Sc(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case er:e=this.InterpolantFactoryMethodDiscrete;break;case nr:e=this.InterpolantFactoryMethodLinear;break;case ec:e=this.InterpolantFactoryMethodSmooth;break;case Hh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Et("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return er;case this.InterpolantFactoryMethodLinear:return nr;case this.InterpolantFactoryMethodSmooth:return ec;case this.InterpolantFactoryMethodBezier:return Hh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t;ca(this.settings)&&(am(this.settings.inTangents,t),am(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;ca(this.settings)&&(lm(this.settings.inTangents,t),lm(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Dt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Dt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Dt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Dt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&a0(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Dt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ec,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(s)l=!0;else{let d=a*n,h=d-n,f=d+n;for(let g=0;g!==n;++g){let v=e[d+g];if(v!==e[h+g]||v!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,h=o*n;for(let f=0;f!==n;++f)e[h+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,ca(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function am(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]+=t}function lm(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Un.prototype.ValueTypeName="";Un.prototype.TimeBufferType=Float32Array;Un.prototype.ValueBufferType=Float32Array;Un.prototype.DefaultInterpolation=nr;var ji=class extends Un{constructor(t,e,n){super(t,e,n)}};ji.prototype.ValueTypeName="bool";ji.prototype.ValueBufferType=Array;ji.prototype.DefaultInterpolation=er;ji.prototype.InterpolantFactoryMethodLinear=void 0;ji.prototype.InterpolantFactoryMethodSmooth=void 0;var Ca=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}};Ca.prototype.ValueTypeName="color";var Ji=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}};Ji.prototype.ValueTypeName="number";var Mc=class extends wi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let u=c+a;c!==u;c+=4)mn.slerpFlat(r,0,o,c-a,o,c,l);return r}},Qi=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Mc(this.times,this.values,this.getValueSize(),t)}};Qi.prototype.ValueTypeName="quaternion";Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var ts=class extends Un{constructor(t,e,n){super(t,e,n)}};ts.prototype.ValueTypeName="string";ts.prototype.ValueBufferType=Array;ts.prototype.DefaultInterpolation=er;ts.prototype.InterpolantFactoryMethodLinear=void 0;ts.prototype.InterpolantFactoryMethodSmooth=void 0;var As=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}};As.prototype.ValueTypeName="vector";var Pa=class{constructor(t="",e=-1,n=[],s=Hm){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=Ri(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,s=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(rx(n[o]).scale(s));let r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r.userData=JSON.parse(t.userData||"{}"),r}static toJSON(t){let e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let r=0,o=n.length;r!==o;++r)e.push(Un.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){let r=e.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let u=tx(l);l=om(l,1,u),c=om(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new Ji(".morphTargetInfluences["+e[a].name+"]",l,c).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=t.length;a<l;a++){let c=t[a],u=c.name.match(r);if(u&&u.length>1){let d=u[1],h=s[d];h||(s[d]=h=[]),h.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],e,n));return o}resetDuration(){let t=this.tracks,e=0;for(let n=0,s=t.length;n!==s;++n){let r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());let e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}};function sx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ji;case"vector":case"vector2":case"vector3":case"vector4":return As;case"color":return Ca;case"quaternion":return Qi;case"bool":case"boolean":return ji;case"string":return ts}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function rx(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=sx(i.type);if(i.times===void 0){let n=[],s=[];ex(i.keys,n,s,"value"),i.times=n,i.values=s}let e;return t.parse!==void 0?e=t.parse(i):e=new t(i.name,i.times,i.values,i.interpolation),ca(i.settings)&&(e.settings={inTangents:vs(i.settings.inTangents,Float32Array),outTangents:vs(i.settings.outTangents,Float32Array)}),e}var Si={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(cm(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!cm(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function cm(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var bc=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},sg=new bc,Ei=class{constructor(t){this.manager=t!==void 0?t:sg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};Ei.DEFAULT_MATERIAL_NAME="__DEFAULT";var Wi={},Yh=class extends Error{constructor(t,e){super(t),this.response=e}},co=class extends Ei{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Si.get(`file:${t}`);if(r!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0);return}if(Wi[t]!==void 0){Wi[t].push({onLoad:e,onProgress:n,onError:s});return}Wi[t]=[],Wi[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Et("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Wi[t],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=h?parseInt(h):0,g=f!==0,v=0,p=new ReadableStream({start(m){x();function x(){d.read().then(({done:S,value:y})=>{if(S)m.close();else{v+=y.byteLength;let M=new ProgressEvent("progress",{lengthComputable:g,loaded:v,total:f});for(let w=0,_=u.length;w<_;w++){let b=u[w];b.onProgress&&b.onProgress(M)}m.enqueue(y),x()}},S=>{m.error(S)})}}});return new Response(p)}else throw new Yh(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Si.add(`file:${t}`,c);let u=Wi[t];delete Wi[t];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=Wi[t];if(u===void 0)throw this.manager.itemError(t),c;delete Wi[t];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Xr=new WeakMap,Tc=class extends Ei{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Si.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let d=Xr.get(o);d===void 0&&(d=[],Xr.set(o,d)),d.push({onLoad:e,onError:s})}return o}let a=to("img");function l(){u(),e&&e(this);let d=Xr.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}Xr.delete(this),r.manager.itemEnd(t)}function c(d){u(),s&&s(d),Si.remove(`image:${t}`);let h=Xr.get(this)||[];for(let f=0;f<h.length;f++){let g=h[f];g.onError&&g.onError(d)}Xr.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Si.add(`image:${t}`,a),r.manager.itemStart(t),a.fetchPriority=this.priority,a.src=t,a}};var Ia=class extends Ei{constructor(t){super(t)}load(t,e,n,s){let r=new Xe,o=new Tc(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},ar=class extends _e{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new At(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},La=class extends ar{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new At(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Fh=new Tt,um=new I,hm=new I,uo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.mapType=On,this.map=null,this.mapPass=null,this.matrix=new Tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ki,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;um.setFromMatrixPosition(t.matrixWorld),e.position.copy(um),hm.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(hm),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){Fh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Fh,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Qr||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Fh)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Jl=new I,Ql=new mn,vi=new I,Na=class extends _e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=Jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Jl,Ql,vi),vi.x===1&&vi.y===1&&vi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Jl,Ql,vi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Jl,Ql,vi),vi.x===1&&vi.y===1&&vi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Jl,Ql,vi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ys=new I,dm=new xt,fm=new xt,Ge=class extends Na{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=ir*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ua*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ir*2*Math.atan(Math.tan(ua*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ys.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ys.x,ys.y).multiplyScalar(-t/ys.z),ys.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ys.x,ys.y).multiplyScalar(-t/ys.z)}getViewSize(t,e){return this.getViewBounds(t,dm,fm),e.subVectors(fm,dm)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ua*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},$h=class extends uo{constructor(){super(new Ge(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){let e=this.camera,n=ir*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){let t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}},Da=class extends ar{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new $h}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}},Kh=class extends uo{constructor(){super(new Ge(90,1,.5,500)),this.isPointLightShadow=!0}},lr=class extends ar{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Kh}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},cr=class extends Na{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Zh=class extends uo{constructor(){super(new cr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},es=class extends ar{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.shadow=new Zh}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var ns=class{static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}};var Bh=new WeakMap,Ua=class extends Ei{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Et("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Et("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Si.get(`image-bitmap:${t}`);if(o!==void 0){if(r.manager.itemStart(t),o.then){o.then(c=>{Bh.has(o)===!0?(s&&s(Bh.get(o)),r.manager.itemError(t),r.manager.itemEnd(t)):(e&&e(c),r.manager.itemEnd(t))});return}setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);return}let a={};a.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",a.headers=this.requestHeader,a.priority=this.priority,a.cache=this.cache,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(t,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Si.add(`image-bitmap:${t}`,c),e&&e(c),r.manager.itemEnd(t),c}).catch(function(c){s&&s(c),Bh.set(l,c),Si.remove(`image-bitmap:${t}`),r.manager.itemError(t),r.manager.itemEnd(t)});Si.add(`image-bitmap:${t}`,l),r.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var qr=-90,Yr=1,ho=class extends _e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ge(qr,Yr,t,e);s.layers=this.layers,this.add(s);let r=new Ge(qr,Yr,t,e);r.layers=this.layers,this.add(r);let o=new Ge(qr,Yr,t,e);o.layers=this.layers,this.add(o);let a=new Ge(qr,Yr,t,e);a.layers=this.layers,this.add(a);let l=new Ge(qr,Yr,t,e);l.layers=this.layers,this.add(l);let c=new Ge(qr,Yr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=v,t.setRenderTarget(n,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(d,h,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},wc=class extends Ge{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}};var Pd="\\[\\]\\.:\\/",ox=new RegExp("["+Pd+"]","g"),Id="[^"+Pd+"]",ax="[^"+Pd.replace("\\.","")+"]",lx=/((?:WC+[\/:])*)/.source.replace("WC",Id),cx=/(WCOD+)?/.source.replace("WCOD",ax),ux=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Id),hx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Id),dx=new RegExp("^"+lx+cx+ux+hx+"$"),fx=["material","materials","bones","map"],jh=class{constructor(t,e,n){let s=n||ge.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ge=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(ox,"")}static parseTrackName(t){let e=dx.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);fx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Et("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Dt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Dt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Dt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Dt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Dt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Dt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Dt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;Dt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Dt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Dt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ge.Composite=jh;ge.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ge.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ge.prototype.GetterByBindingType=[ge.prototype._getValue_direct,ge.prototype._getValue_array,ge.prototype._getValue_arrayElement,ge.prototype._getValue_toArray];ge.prototype.SetterByBindingTypeAndVersioning=[[ge.prototype._setValue_direct,ge.prototype._setValue_direct_setNeedsUpdate,ge.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_array,ge.prototype._setValue_array_setNeedsUpdate,ge.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_arrayElement,ge.prototype._setValue_arrayElement_setNeedsUpdate,ge.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ge.prototype._setValue_fromArray,ge.prototype._setValue_fromArray_setNeedsUpdate,ge.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var CT=new Float32Array(1);var pm=new Tt,Oa=class{constructor(t,e,n=0,s=1/0){this.ray=new Qn(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new io,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Dt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return pm.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pm),this}intersectObject(t,e=!0,n=[]){return Jh(t,this,n,e),n.sort(mm),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Jh(t[s],this,n,e);return n.sort(mm),n}};function mm(i,t){return i.distance-t.distance}function Jh(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Jh(r[o],t,e,!0)}}var fo=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=zt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(zt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Fd=class Fd{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Fd.prototype.isMatrix2=!0;var Qh=Fd;var gm=new I,tc=new I,$r=new I,Kr=new I,zh=new I,px=new I,mx=new I,Rn=class{constructor(t=new I,e=new I){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){gm.subVectors(t,this.start),tc.subVectors(this.end,this.start);let n=tc.dot(tc);if(n===0)return 0;let r=tc.dot(gm)/n;return e&&(r=zt(r,0,1)),r}closestPointToPoint(t,e,n){let s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}distanceSqToLine3(t,e=px,n=mx){let s=10000000000000001e-32,r,o,a=this.start,l=t.start,c=this.end,u=t.end;$r.subVectors(c,a),Kr.subVectors(u,l),zh.subVectors(a,l);let d=$r.dot($r),h=Kr.dot(Kr),f=Kr.dot(zh);if(d<=s&&h<=s)return e.copy(a),n.copy(l),e.distanceToSquared(n);if(d<=s)r=0,o=f/h,o=zt(o,0,1);else{let g=$r.dot(zh);if(h<=s)o=0,r=zt(-g/d,0,1);else{let v=$r.dot(Kr),p=d*h-v*v;p!==0?r=zt((v*f-g*h)/p,0,1):r=0,o=(v*r+f)/h,o<0?(o=0,r=zt(-g/d,0,1)):o>1&&(o=1,r=zt((v-g)/d,0,1))}}return e.copy(a).addScaledVector($r,r),n.copy(l).addScaledVector(Kr,o),e.distanceToSquared(n)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};var Fa=class extends ci{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Ld(i,t,e,n){let s=gx(n);switch(e){case _d:return i*t;case Dc:return i*t/s.components*s.byteLength;case ka:return i*t/s.components*s.byteLength;case Ps:return i*t*2/s.components*s.byteLength;case Uc:return i*t*2/s.components*s.byteLength;case xd:return i*t*3/s.components*s.byteLength;case Nn:return i*t*4/s.components*s.byteLength;case Oc:return i*t*4/s.components*s.byteLength;case Ha:case Va:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ga:case Wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Bc:case kc:return Math.max(i,16)*Math.max(t,8)/4;case Fc:case zc:return Math.max(i,8)*Math.max(t,8)/2;case Hc:case Vc:case Wc:case Xc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Gc:case Xa:case qc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yc:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case $c:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Kc:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Zc:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case jc:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Jc:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Qc:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case tu:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case eu:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case nu:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case iu:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case su:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case ru:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ou:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case au:case lu:case cu:return Math.ceil(i/4)*Math.ceil(t/4)*16;case uu:case hu:return Math.ceil(i/4)*Math.ceil(t/4)*8;case qa:case du:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function gx(i){switch(i){case On:case fd:return{byteLength:1,components:1};case xo:case pd:case ui:return{byteLength:2,components:1};case Lc:case Nc:return{byteLength:2,components:4};case ei:case Ic:case wn:return{byteLength:4,components:1};case md:case gd:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Et("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function Eg(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function _x(i){let t=new WeakMap;function e(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){let g=d[h],v=d[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++h,d[h]=v)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){let v=d[f];i.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var xx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,vx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Sx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,wx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ex=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Ax=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Px=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ix=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Lx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Dx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ux=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ox=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Bx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,zx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,kx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Hx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Gx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yx="gl_FragColor = linearToOutputTexel( gl_FragColor );",$x=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Zx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,jx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Jx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Qx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,ty=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ey=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ny=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,iy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ry=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,oy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ay=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ly=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,cy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,uy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,py=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,my=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,gy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,_y=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,xy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yy=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,vy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,My=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,by=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ty=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ey=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ay=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ry=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Py=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Iy=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ly=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ny=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Dy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Oy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Fy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,By=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ky=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Hy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Yy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,$y=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ky=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Zy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,jy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,tv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ev=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,nv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,iv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,rv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ov=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,av=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,hv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,dv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,gv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,_v=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vv=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Tv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,wv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ev=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Av=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Iv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Lv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ov=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Bv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,zv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Vv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,qv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Yv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$v=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Kv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xt={alphahash_fragment:xx,alphahash_pars_fragment:yx,alphamap_fragment:vx,alphamap_pars_fragment:Sx,alphatest_fragment:Mx,alphatest_pars_fragment:bx,aomap_fragment:Tx,aomap_pars_fragment:wx,batching_pars_vertex:Ex,batching_vertex:Ax,begin_vertex:Rx,beginnormal_vertex:Cx,bsdfs:Px,iridescence_fragment:Ix,bumpmap_pars_fragment:Lx,clipping_planes_fragment:Nx,clipping_planes_pars_fragment:Dx,clipping_planes_pars_vertex:Ux,clipping_planes_vertex:Ox,color_fragment:Fx,color_pars_fragment:Bx,color_pars_vertex:zx,color_vertex:kx,common:Hx,defaultnormal_vertex:Vx,displacementmap_pars_vertex:Gx,displacementmap_vertex:Wx,emissivemap_fragment:Xx,emissivemap_pars_fragment:qx,colorspace_fragment:Yx,colorspace_pars_fragment:$x,envmap_fragment:Kx,envmap_common_pars_fragment:Zx,envmap_pars_fragment:jx,envmap_pars_vertex:Jx,envmap_physical_pars_fragment:cy,envmap_vertex:Qx,fog_vertex:ty,fog_pars_vertex:ey,fog_fragment:ny,fog_pars_fragment:iy,gradientmap_pars_fragment:sy,lightmap_pars_fragment:ry,lights_lambert_fragment:oy,lights_lambert_pars_fragment:ay,lights_pars_begin:ly,lights_toon_fragment:uy,lights_toon_pars_fragment:hy,lights_phong_fragment:dy,lights_phong_pars_fragment:fy,lights_physical_fragment:py,lights_physical_pars_fragment:my,lights_fragment_begin:gy,lights_fragment_maps:_y,lights_fragment_end:xy,lightprobes_pars_fragment:yy,logdepthbuf_fragment:vy,logdepthbuf_pars_fragment:Sy,logdepthbuf_pars_vertex:My,logdepthbuf_vertex:by,map_fragment:Ty,map_pars_fragment:wy,map_particle_fragment:Ey,map_particle_pars_fragment:Ay,metalnessmap_fragment:Ry,metalnessmap_pars_fragment:Cy,morphinstance_vertex:Py,morphcolor_vertex:Iy,morphnormal_vertex:Ly,morphtarget_pars_vertex:Ny,morphtarget_vertex:Dy,normal_fragment_begin:Uy,normal_fragment_maps:Oy,normal_pars_fragment:Fy,normal_pars_vertex:By,normal_vertex:zy,normalmap_pars_fragment:ky,clearcoat_normal_fragment_begin:Hy,clearcoat_normal_fragment_maps:Vy,clearcoat_pars_fragment:Gy,iridescence_pars_fragment:Wy,opaque_fragment:Xy,packing:qy,premultiplied_alpha_fragment:Yy,project_vertex:$y,dithering_fragment:Ky,dithering_pars_fragment:Zy,roughnessmap_fragment:jy,roughnessmap_pars_fragment:Jy,shadowmap_pars_fragment:Qy,shadowmap_pars_vertex:tv,shadowmap_vertex:ev,shadowmask_pars_fragment:nv,skinbase_vertex:iv,skinning_pars_vertex:sv,skinning_vertex:rv,skinnormal_vertex:ov,specularmap_fragment:av,specularmap_pars_fragment:lv,tonemapping_fragment:cv,tonemapping_pars_fragment:uv,transmission_fragment:hv,transmission_pars_fragment:dv,uv_pars_fragment:fv,uv_pars_vertex:pv,uv_vertex:mv,worldpos_vertex:gv,background_vert:_v,background_frag:xv,backgroundCube_vert:yv,backgroundCube_frag:vv,cube_vert:Sv,cube_frag:Mv,depth_vert:bv,depth_frag:Tv,distance_vert:wv,distance_frag:Ev,equirect_vert:Av,equirect_frag:Rv,linedashed_vert:Cv,linedashed_frag:Pv,meshbasic_vert:Iv,meshbasic_frag:Lv,meshlambert_vert:Nv,meshlambert_frag:Dv,meshmatcap_vert:Uv,meshmatcap_frag:Ov,meshnormal_vert:Fv,meshnormal_frag:Bv,meshphong_vert:zv,meshphong_frag:kv,meshphysical_vert:Hv,meshphysical_frag:Vv,meshtoon_vert:Gv,meshtoon_frag:Wv,points_vert:Xv,points_frag:qv,shadow_vert:Yv,shadow_frag:$v,sprite_vert:Kv,sprite_frag:Zv},gt={common:{diffuse:{value:new At(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new At(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new At(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new At(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},Pi={basic:{uniforms:_n([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:_n([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new At(0)},envMapIntensity:{value:1}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:_n([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new At(0)},specular:{value:new At(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:_n([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new At(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:_n([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new At(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:_n([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:_n([gt.points,gt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:_n([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:_n([gt.common,gt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:_n([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:_n([gt.sprite,gt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distance:{uniforms:_n([gt.common,gt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distance_vert,fragmentShader:Xt.distance_frag},shadow:{uniforms:_n([gt.lights,gt.fog,{color:{value:new At(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Pi.physical={uniforms:_n([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ot},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new At(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new At(0)},specularColor:{value:new At(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};var pu={r:0,b:0,g:0},jv=new Tt,Ag=new Ot;Ag.set(-1,0,0,0,1,0,0,0,1);function Jv(i,t,e,n,s,r){let o=new At(0),a=s===!0?0:1,l,c,u=null,d=0,h=null;function f(x){let S=x.isScene===!0?x.background:null;if(S&&S.isTexture){let y=x.backgroundBlurriness>0;S=t.get(S,y)}return S}function g(x){let S=!1,y=f(x);y===null?p(o,a):y&&y.isColor&&(p(y,1),S=!0);let M=i.xr.getEnvironmentBlendMode();M==="additive"?e.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(x,S){let y=f(S);y&&y.isCubeTexture?(c===void 0&&(c=new Jt(new Es(1,1,1),new Ti({name:"BackgroundCubeMaterial",uniforms:mr(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,w,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(jv.makeRotationFromEuler(S.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ag),c.material.toneMapped=Wt.getTransfer(y.colorSpace)!==ae,(u!==y||d!==y.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,h=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Jt(new Ea(2,2),new Ti({name:"BackgroundMaterial",uniforms:mr(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=Wt.getTransfer(y.colorSpace)!==ae,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,h=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,S){x.getRGB(pu,Cd(i)),e.buffers.color.setClear(pu.r,pu.g,pu.b,S,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),a=S,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,p(o,a)},render:g,addToRenderList:v,dispose:m}}function Qv(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=!1;function a(R,L,O,N,z){let G=!1,W=d(R,N,O,L);r!==W&&(r=W,c(r.object)),G=f(R,N,O,z),G&&g(R,N,O,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,y(R,L,O,N),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(R){return i.bindVertexArray(R)}function u(R){return i.deleteVertexArray(R)}function d(R,L,O,N){let z=N.wireframe===!0,G=n[L.id];G===void 0&&(G={},n[L.id]=G);let W=R.isInstancedMesh===!0?R.id:0,et=G[W];et===void 0&&(et={},G[W]=et);let q=et[O.id];q===void 0&&(q={},et[O.id]=q);let Q=q[z];return Q===void 0&&(Q=h(l()),q[z]=Q),Q}function h(R){let L=[],O=[],N=[];for(let z=0;z<e;z++)L[z]=0,O[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:O,attributeDivisors:N,object:R,attributes:{},index:null}}function f(R,L,O,N){let z=r.attributes,G=L.attributes,W=0,et=O.getAttributes();for(let q in et)if(et[q].location>=0){let tt=z[q],vt=G[q];if(vt===void 0&&(q==="instanceMatrix"&&R.instanceMatrix&&(vt=R.instanceMatrix),q==="instanceColor"&&R.instanceColor&&(vt=R.instanceColor)),tt===void 0||tt.attribute!==vt||vt&&tt.data!==vt.data)return!0;W++}return r.attributesNum!==W||r.index!==N}function g(R,L,O,N){let z={},G=L.attributes,W=0,et=O.getAttributes();for(let q in et)if(et[q].location>=0){let tt=G[q];tt===void 0&&(q==="instanceMatrix"&&R.instanceMatrix&&(tt=R.instanceMatrix),q==="instanceColor"&&R.instanceColor&&(tt=R.instanceColor));let vt={};vt.attribute=tt,tt&&tt.data&&(vt.data=tt.data),z[q]=vt,W++}r.attributes=z,r.attributesNum=W,r.index=N}function v(){let R=r.newAttributes;for(let L=0,O=R.length;L<O;L++)R[L]=0}function p(R){m(R,0)}function m(R,L){let O=r.newAttributes,N=r.enabledAttributes,z=r.attributeDivisors;O[R]=1,N[R]===0&&(i.enableVertexAttribArray(R),N[R]=1),z[R]!==L&&(i.vertexAttribDivisor(R,L),z[R]=L)}function x(){let R=r.newAttributes,L=r.enabledAttributes;for(let O=0,N=L.length;O<N;O++)L[O]!==R[O]&&(i.disableVertexAttribArray(O),L[O]=0)}function S(R,L,O,N,z,G,W){W===!0?i.vertexAttribIPointer(R,L,O,z,G):i.vertexAttribPointer(R,L,O,N,z,G)}function y(R,L,O,N){v();let z=N.attributes,G=O.getAttributes(),W=L.defaultAttributeValues;for(let et in G){let q=G[et];if(q.location>=0){let Q=z[et];if(Q===void 0&&(et==="instanceMatrix"&&R.instanceMatrix&&(Q=R.instanceMatrix),et==="instanceColor"&&R.instanceColor&&(Q=R.instanceColor)),Q!==void 0){let tt=Q.normalized,vt=Q.itemSize,Ut=t.get(Q);if(Ut===void 0)continue;let Z=Ut.buffer,ut=Ut.type,yt=Ut.bytesPerElement,Pt=ut===i.INT||ut===i.UNSIGNED_INT||Q.gpuType===Ic;if(Q.isInterleavedBufferAttribute){let pt=Q.data,Ft=pt.isInterleavedBuffer===!0?pt.stride:pt.itemSize,Re=Q.offset;if(pt.isInstancedInterleavedBuffer||pt.isInstancedBufferAttribute){for(let Lt=0;Lt<q.locationSize;Lt++)m(q.location+Lt,pt.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let Lt=0;Lt<q.locationSize;Lt++)p(q.location+Lt);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let Lt=0;Lt<q.locationSize;Lt++)S(q.location+Lt,vt/q.locationSize,ut,tt,Ft*yt,(Re+vt/q.locationSize*Lt)*yt,Pt)}else{if(Q.isInstancedBufferAttribute){for(let pt=0;pt<q.locationSize;pt++)m(q.location+pt,Q.meshPerAttribute);R.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let pt=0;pt<q.locationSize;pt++)p(q.location+pt);i.bindBuffer(i.ARRAY_BUFFER,Z);for(let pt=0;pt<q.locationSize;pt++)S(q.location+pt,vt/q.locationSize,ut,tt,vt*yt,vt/q.locationSize*pt*yt,Pt)}}else if(W!==void 0){let tt=W[et];if(tt!==void 0)switch(tt.length){case 2:i.vertexAttrib2fv(q.location,tt);break;case 3:i.vertexAttrib3fv(q.location,tt);break;case 4:i.vertexAttrib4fv(q.location,tt);break;default:i.vertexAttrib1fv(q.location,tt)}}}}x()}function M(){P();for(let R in n){let L=n[R];for(let O in L){let N=L[O];for(let z in N){let G=N[z];for(let W in G)u(G[W].object),delete G[W];delete N[z]}}delete n[R]}}function w(R){if(n[R.id]===void 0)return;let L=n[R.id];for(let O in L){let N=L[O];for(let z in N){let G=N[z];for(let W in G)u(G[W].object),delete G[W];delete N[z]}}delete n[R.id]}function _(R){for(let L in n){let O=n[L];for(let N in O){let z=O[N];if(z[R.id]===void 0)continue;let G=z[R.id];for(let W in G)u(G[W].object),delete G[W];delete z[R.id]}}}function b(R){for(let L in n){let O=n[L],N=R.isInstancedMesh===!0?R.id:0,z=O[N];if(z!==void 0){for(let G in z){let W=z[G];for(let et in W)u(W[et].object),delete W[et];delete z[G]}delete O[N],Object.keys(O).length===0&&delete n[L]}}}function P(){A(),o=!0,r!==s&&(r=s,c(r.object))}function A(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:A,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfObject:b,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:p,disableUnusedAttributes:x}}function tS(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function a(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];e.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function eS(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let _=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(_){return!(_!==Nn&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){let b=_===ui&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==On&&_!==wn&&!b&&n.convert(_)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",u=l(c);u!==c&&(Et("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=e.logarithmicDepthBuffer===!0&&d===!1;e.reversedDepthBuffer===!0&&d===!1&&Et("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&d===!0&&Et("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),x=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=i.getParameter(i.MAX_SAMPLES),w=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:y,maxSamples:M,samples:w}}function nS(i){let t=this,e=null,n=0,s=!1,r=!1,o=new on,a=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){e=u(d,h,0)},this.setState=function(d,h,f){let g=d.clippingPlanes,v=d.clipIntersection,p=d.clipShadows,m=i.get(d);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{let x=r?0:n,S=x*4,y=m.clippingState||null;l.value=y,y=u(g,h,S,f);for(let M=0;M!==S;++M)y[M]=e[M];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(d,h,f,g){let v=d!==null?d.length:0,p=null;if(v!==0){if(p=l.value,g!==!0||p===null){let m=f+v*4,x=h.matrixWorldInverse;a.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let S=0,y=f;S!==v;++S,y+=4)o.copy(d[S]).applyMatrix4(x,a),o.normal.toArray(p,y),p[y+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}var ja=class extends Hn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ma(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Es(5,5,5),r=new Ti({name:"CubemapFromEquirect",uniforms:mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:ur});r.uniforms.tEquirect.value=e;let o=new Jt(s,r),a=e.minFilter;return e.minFilter===ti&&(e.minFilter=We),new ho(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},rg=256,iS=3,sS=20,Rg=256,Cg=16,rS=3,oS=new I,aS=new At,So=class i{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ho(1,10,null),this._boxMesh=new Jt(new Es(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=oS}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),u=this._getSourceTarget(!0);e>0&&(u.texture.mipmapsAutoUpdate=!1);let d=l.autoClear,h=l.autoClearColor,f=l.autoClearDepth,g=l.autoClearStencil,v=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(t.background=l.getClearColor(aS));let p=new ho(n,s,u);return p.position.copy(a),p.update(l,t),l.autoClear=d,l.autoClearColor=h,l.autoClearDepth=f,l.autoClearStencil=g,t.background=v,e>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ag(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(rg,Ed(t))}_fromTexture(t,e){t.mapping===dr||t.mapping===go?this._setSize(t.image.length===0?rg:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){let t=this._cubeSize,e=og(t,!1,!1),n=Math.log2(t)-iS;for(let s=0;s<=n;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=og(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){let s=this._boxMesh,r=this._cubeCamera;s.material=n,r.renderTarget=t,r.activeMipmapLevel=e;let o=t.width>>e;t.viewport.set(0,0,o,o),r.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===dr||t.mapping===go?(this._cubemapMaterial===null&&(this._cubemapMaterial=lg()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ag()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=lS(),this._integrationMaterial=cS());let e=this._cubeSize,n=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/Cg);for(let o=0;o<=n;o++){let a=i.lodToRoughness(o,n);if(o>n-rS)r.roughness.value=a,this._renderCube(t,o,this._integrationMaterial);else{let l=a>0?Math.log2(e)+.5*Math.log2(6/(Rg*Math.pow(a,4)))+.5:0;s.roughness.value=a,s.lodBias.value=l,this._renderCube(t,o,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=uS());let n=this._blurMaterial,s=n.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(t,0,n),s.envMap.value=t.texture,this._renderCube(r,0,n)}};function og(i,t,e){return new ja(i,{minFilter:ti,generateMipmaps:t,type:ui,colorSpace:En,depthBuffer:e})}function Ja(i,t,e){return new Ti({name:i,uniforms:t,vertexShader:Xt.cube_vert,fragmentShader:e,side:qe,blending:ur,depthTest:!1,depthWrite:!1})}function lS(){return Ja("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Rg}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function cS(){return Ja("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Cg}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function uS(){return Ja("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${sS}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function ag(){return Ja("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function lg(){return Ja("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function hS(i){let t=new WeakMap,e=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===Rc||f===Cc)if(t.has(h)){let g=t.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let v=new ja(g.height);return v.fromEquirectangularTexture(i,h),t.set(h,v),h.addEventListener("dispose",c),a(v.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){let f=h.mapping,g=f===Rc||f===Cc,v=f===dr||f===go;if(g||v){let p=e.get(h),m=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return n===null&&(n=new So(i)),p=g?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),p.texture;if(p!==void 0)return p.texture;{let x=h.image;return g&&x&&x.height>0||v&&x&&l(x)?(n===null&&(n=new So(i)),p=g?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function a(h,f){return f===Rc?h.mapping=dr:f===Cc&&(h.mapping=go),h}function l(h){let f=0,g=6;for(let v=0;v<g;v++)h[v]!==void 0&&f++;return f===g}function c(h){let f=h.target;f.removeEventListener("dispose",c);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function dS(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&tr("WebGLRenderer: "+n+" extension not supported."),s}}}function fS(i,t,e,n){let s={},r=new WeakMap,o=new FinalizationRegistry(g=>delete s[g]);function a(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(let p in g.attributes)t.remove(g.attributes[p]);g.removeEventListener("dispose",a),delete s[g.id],o.unregister(g);let v=r.get(g);v&&(t.remove(v),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function c(g,v){return s[v.id]!==void 0||(v.addEventListener("dispose",a),s[v.id]=new WeakRef(v),o.register(v,v.id,v),e.memory.geometries++),v}function u(g){let v=g.attributes;for(let p in v)t.update(v[p],i.ARRAY_BUFFER)}function d(g){let v=g.index,p=g.attributes.position,m=0;if(p===void 0)return;let x=v!==null?v.array.length:p.array.length/3-1,S=p.count>=65535?ga:ma,y=new S(Math.ceil(x/3)*6,1),M=y.array;if(v!==null){let _=v.array;m=v.version;for(let b=0,P=0;b<x;b+=3){let A=_[b+0],R=_[b+1],L=_[b+2];M[P++]=A,M[P++]=R,M[P++]=R,M[P++]=L,M[P++]=L,M[P++]=A}}else{m=p.version;for(let _=0,b=0;_<x;_+=3){let P=_+0,A=_+1,R=_+2;M[b++]=P,M[b++]=A,M[b++]=A,M[b++]=R,M[b++]=R,M[b++]=P}}y.version=m;let w=r.get(g);w&&t.remove(w),r.set(g,y)}function h(g){let v=r.get(g);if(v){let p=g.index;p!==null&&v.version<p.version&&d(g)}else d(g);return r.get(g)}function f(){for(let g in s){let v=s[g].deref();v!==void 0&&l(v)}}return{get:c,update:u,getWireframeAttribute:h,dispose:f}}function pS(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,h){i.drawElements(n,h,r,d*o),e.update(h,n,1)}function c(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,d*o,f),e.update(h,n,f))}function u(d,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let v=0;for(let p=0;p<f;p++)v+=h[p];e.update(v,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function mS(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:Dt("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function gS(i,t,e){let n=new WeakMap,s=new ue;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let P=function(){_.dispose(),n.delete(a),a.removeEventListener("dispose",P)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],x=a.morphAttributes.color||[],S=0;f===!0&&(S=1),g===!0&&(S=2),v===!0&&(S=3);let y=a.attributes.position.count*S,M=1;y>t.maxTextureSize&&(M=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let w=new Float32Array(y*M*4*d),_=new pa(w,y,M,d);_.type=wn,_.needsUpdate=!0;let b=S*4;for(let A=0;A<d;A++){let R=p[A],L=m[A],O=x[A],N=y*M*4*A;for(let z=0;z<R.count;z++){let G=z*b;f===!0&&(s.fromBufferAttribute(R,z),w[N+G+0]=s.x,w[N+G+1]=s.y,w[N+G+2]=s.z,w[N+G+3]=0),g===!0&&(s.fromBufferAttribute(L,z),w[N+G+4]=s.x,w[N+G+5]=s.y,w[N+G+6]=s.z,w[N+G+7]=0),v===!0&&(s.fromBufferAttribute(O,z),w[N+G+8]=s.x,w[N+G+9]=s.y,w[N+G+10]=s.z,w[N+G+11]=O.itemSize===4?s.w:1)}}h={count:d,texture:_,size:new xt(y,M)},n.set(a,h),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function _S(i,t,e,n,s){let r=new WeakMap;function o(c){let u=s.render.frame,d=c.geometry,h=t.get(c,d);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:o,dispose:a}}var xS={[od]:"LINEAR_TONE_MAPPING",[ad]:"REINHARD_TONE_MAPPING",[ld]:"CINEON_TONE_MAPPING",[za]:"ACES_FILMIC_TONE_MAPPING",[ud]:"AGX_TONE_MAPPING",[hd]:"NEUTRAL_TONE_MAPPING",[cd]:"CUSTOM_TONE_MAPPING"};function yS(i,t,e,n,s,r){let o=new Hn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,u=new Ue;u.setAttribute("position",new en([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new en([0,2,0,0,2,0],2));let d=new mc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Jt(u,d),f=new cr(-1,1,1,-1,0,1),g=null,v=null,p=!1,m,x=null,S=[],y=!1;this.setSize=function(M,w){o.setSize(M,w),a!==null&&a.setSize(M,w),l!==null&&l.setSize(M,w);for(let _=0;_<S.length;_++){let b=S[_];b.setSize&&b.setSize(M,w)}},this.setEffects=function(M){S=M,y=S.length>0&&S[0].isRenderPass===!0;let w=o.width,_=o.height;S.length>0&&a===null&&(a=new Hn(w,_,{type:ui,depthBuffer:!1,stencilBuffer:!1}),l=new Hn(w,_,{type:ui,depthBuffer:!1,stencilBuffer:!1}));let b=s===!0&&S.some(P=>P.needsDepthTexture===!0);b!==(o.depthTexture!==null)&&(b===!0&&c===null&&(c=new Zi(w,_),r===!0&&(c.format=is,c.type=pr)),o.dispose(),o.depthTexture=b?c:null,o.resolveDepthBuffer=b,o.storeMultisampledDepthBuffer=b);for(let P=0;P<S.length;P++){let A=S[P];A.setSize&&A.setSize(w,_),b&&A.needsDepthTexture===!0&&A.setDepthTexture&&A.setDepthTexture(c)}},this.begin=function(M,w){if(p||M.toneMapping===Ai&&S.length===0)return!1;if(x=w,w!==null){let _=w.width,b=w.height;(o.width!==_||o.height!==b)&&this.setSize(_,b)}return y===!1&&M.setRenderTarget(o),m=M.toneMapping,M.toneMapping=Ai,!0},this.hasRenderPass=function(){return y},this.end=function(M,w){M.toneMapping=m,p=!0;let _=o,b=a;for(let P=0;P<S.length;P++){let A=S[P];A.enabled!==!1&&(A.render(M,b,_,w),A.needsSwap!==!1&&(_=b,b=b===a?l:a))}if(g!==M.outputColorSpace||v!==M.toneMapping){g=M.outputColorSpace,v=M.toneMapping,d.defines={},Wt.getTransfer(g)===ae&&(d.defines.SRGB_TRANSFER="");let P=xS[v];P&&(d.defines[P]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=_.texture,M.setRenderTarget(x),M.render(h,f),x=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),u.dispose(),d.dispose()}}var Pg=new Xe,Ig=new Zi(1,1),Lg=new Ta(1),Ng=new pa,Dg=new dc,Ug=new Ma,cg=[],ug=[],hg=new Float32Array(16),dg=new Float32Array(9),fg=new Float32Array(4);function bo(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=cg[s];if(r===void 0&&(r=new Float32Array(s),cg[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ye(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function $e(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function _u(i,t){let e=ug[t];e===void 0&&(e=new Int32Array(t),ug[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function vS(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function SS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;i.uniform2fv(this.addr,t),$e(e,t)}}function MS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ye(e,t))return;i.uniform3fv(this.addr,t),$e(e,t)}}function bS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;i.uniform4fv(this.addr,t),$e(e,t)}}function TS(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ye(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),$e(e,t)}else{if(Ye(e,n))return;fg.set(n),i.uniformMatrix2fv(this.addr,!1,fg),$e(e,n)}}function wS(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ye(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),$e(e,t)}else{if(Ye(e,n))return;dg.set(n),i.uniformMatrix3fv(this.addr,!1,dg),$e(e,n)}}function ES(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ye(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),$e(e,t)}else{if(Ye(e,n))return;hg.set(n),i.uniformMatrix4fv(this.addr,!1,hg),$e(e,n)}}function AS(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function RS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;i.uniform2iv(this.addr,t),$e(e,t)}}function CS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;i.uniform3iv(this.addr,t),$e(e,t)}}function PS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;i.uniform4iv(this.addr,t),$e(e,t)}}function IS(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function LS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;i.uniform2uiv(this.addr,t),$e(e,t)}}function NS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;i.uniform3uiv(this.addr,t),$e(e,t)}}function DS(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;i.uniform4uiv(this.addr,t),$e(e,t)}}function xu(i){return i.version===0&&(i.compareFunction=Md,i.needsUpdate=!0),i}function US(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?r=xu(Ig):r=Pg,e.setTexture2D(t||r,s)}function OS(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Dg,s)}function FS(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_CUBE_SHADOW?r=xu(Lg):r=Ug,e.setTextureCube(t||r,s)}function BS(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ng,s)}function zS(i){switch(i){case 5126:return vS;case 35664:return SS;case 35665:return MS;case 35666:return bS;case 35674:return TS;case 35675:return wS;case 35676:return ES;case 5124:case 35670:return AS;case 35667:case 35671:return RS;case 35668:case 35672:return CS;case 35669:case 35673:return PS;case 5125:return IS;case 36294:return LS;case 36295:return NS;case 36296:return DS;case 35678:case 36198:case 36298:case 36306:case 35682:return US;case 35679:case 36299:case 36307:return OS;case 35680:case 36300:case 36308:case 36293:return FS;case 36289:case 36303:case 36311:case 36292:return BS}}function kS(i,t){i.uniform1fv(this.addr,t)}function HS(i,t){let e=bo(t,this.size,2);i.uniform2fv(this.addr,e)}function VS(i,t){let e=bo(t,this.size,3);i.uniform3fv(this.addr,e)}function GS(i,t){let e=bo(t,this.size,4);i.uniform4fv(this.addr,e)}function WS(i,t){let e=bo(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function XS(i,t){let e=bo(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function qS(i,t){let e=bo(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function YS(i,t){i.uniform1iv(this.addr,t)}function $S(i,t){i.uniform2iv(this.addr,t)}function KS(i,t){i.uniform3iv(this.addr,t)}function ZS(i,t){i.uniform4iv(this.addr,t)}function jS(i,t){i.uniform1uiv(this.addr,t)}function JS(i,t){i.uniform2uiv(this.addr,t)}function QS(i,t){i.uniform3uiv(this.addr,t)}function tM(i,t){i.uniform4uiv(this.addr,t)}function eM(i,t,e){let n=this.cache,s=t.length,r=_u(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),$e(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=xu(Ig):o=Pg;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function nM(i,t,e){let n=this.cache,s=t.length,r=_u(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),$e(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Dg,r[o])}function iM(i,t,e){let n=this.cache,s=t.length,r=_u(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),$e(n,r));let o;this.type===i.SAMPLER_CUBE_SHADOW?o=xu(Lg):o=Ug;for(let a=0;a!==s;++a)e.setTextureCube(t[a]||o,r[a])}function sM(i,t,e){let n=this.cache,s=t.length,r=_u(e,s);Ye(n,r)||(i.uniform1iv(this.addr,r),$e(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ng,r[o])}function rM(i){switch(i){case 5126:return kS;case 35664:return HS;case 35665:return VS;case 35666:return GS;case 35674:return WS;case 35675:return XS;case 35676:return qS;case 5124:case 35670:return YS;case 35667:case 35671:return $S;case 35668:case 35672:return KS;case 35669:case 35673:return ZS;case 5125:return jS;case 36294:return JS;case 36295:return QS;case 36296:return tM;case 35678:case 36198:case 36298:case 36306:case 35682:return eM;case 35679:case 36299:case 36307:return nM;case 35680:case 36300:case 36308:case 36293:return iM;case 36289:case 36303:case 36311:case 36292:return sM}}var kd=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=zS(e.type)}},Hd=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=rM(e.type)}},Vd=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Bd=/(\w+)(\])?(\[|\.)?/g;function pg(i,t){i.seq.push(t),i.map[t.id]=t}function oM(i,t,e){let n=i.name,s=n.length;for(Bd.lastIndex=0;;){let r=Bd.exec(n),o=Bd.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){pg(e,c===void 0?new kd(a,i,t):new Hd(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Vd(a),pg(e,d)),e=d}}}var vo=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);oM(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function mg(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var aM=37297,lM=0;function cM(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var gg=new Ot;function uM(i){Wt._getMatrix(gg,Wt.workingColorSpace,i);let t=`mat3( ${gg.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(i)){case da:return[t,"LinearTransferOETF"];case ae:return[t,"sRGBTransferOETF"];default:return Et("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function _g(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+cM(i.getShaderSource(t),a)}else return r}function hM(i,t){let e=uM(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var dM={[od]:"Linear",[ad]:"Reinhard",[ld]:"Cineon",[za]:"ACESFilmic",[ud]:"AgX",[hd]:"Neutral",[cd]:"Custom"};function fM(i,t){let e=dM[t];return e===void 0?(Et("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var mu=new I;function pM(){Wt.getLuminanceCoefficients(mu);let i=mu.x.toFixed(4),t=mu.y.toFixed(4),e=mu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function mM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Za).join(`
`)}function gM(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function _M(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Za(i){return i!==""}function xg(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function yg(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var xM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gd(i){return i.replace(xM,yM)}function yM(i,t){let e=Xt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Gd(e)}var vM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vg(i){return i.replace(vM,SM)}function SM(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sg(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var MM={[Ba]:"SHADOWMAP_TYPE_PCF",[po]:"SHADOWMAP_TYPE_VSM"};function bM(i){return MM[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var TM={[go]:"ENVMAP_MODE_REFRACTION"};function wM(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":TM[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var EM={[Ac]:"ENVMAP_BLENDING_MULTIPLY",[Bm]:"ENVMAP_BLENDING_MIX",[zm]:"ENVMAP_BLENDING_ADD"};function AM(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":EM[i.combine]||"ENVMAP_BLENDING_NONE"}function RM(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=bM(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=wM(e),d=AM(e),h=mM(e),f=gM(r),g=s.createProgram(),v,p,m=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Za).join(`
`),v.length>0&&(v+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(Za).join(`
`),p.length>0&&(p+=`
`)):(v=[Sg(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Za).join(`
`),p=[Sg(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+d:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ai?"#define TONE_MAPPING":"",e.toneMapping!==Ai?Xt.tonemapping_pars_fragment:"",e.toneMapping!==Ai?fM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,hM("linearToOutputTexel",e.outputColorSpace),pM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Za).join(`
`)),o=Gd(o),o=xg(o,e),o=yg(o,e),a=Gd(a),a=xg(a,e),a=yg(a,e),o=vg(o),a=vg(a),e.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,v=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,p=["#define varying in",e.glslVersion===Td?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Td?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=m+v+o,S=m+p+a,y=mg(s,s.VERTEX_SHADER,x),M=mg(s,s.FRAGMENT_SHADER,S);s.attachShader(g,y),s.attachShader(g,M),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function w(A){if(i.debug.checkShaderErrors){let R=s.getProgramInfoLog(g)||"",L=s.getShaderInfoLog(y)||"",O=s.getShaderInfoLog(M)||"",N=R.trim(),z=L.trim(),G=O.trim(),W=!0,et=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,y,M);else{let q=_g(s,y,"vertex"),Q=_g(s,M,"fragment");Dt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+N+`
`+q+`
`+Q)}else N!==""?Et("WebGLProgram: Program Info Log:",N):(z===""||G==="")&&(et=!1);et&&(A.diagnostics={runnable:W,programLog:N,vertexShader:{log:z,prefix:v},fragmentShader:{log:G,prefix:p}})}s.deleteShader(y),s.deleteShader(M),_=new vo(s,g),b=_M(s,g)}let _;this.getUniforms=function(){return _===void 0&&w(this),_};let b;this.getAttributes=function(){return b===void 0&&w(this),b};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(g,aM)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=lM++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=y,this.fragmentShader=M,this}var CM=0,Wd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xd(t),e.set(t,n)),n}},Xd=class{constructor(t){this.id=CM++,this.code=t,this.usedTimes=0}};function PM(i){return i===Ps||i===Xa||i===qa}function IM(i,t,e,n,s,r){let o=new io,a=new Wd,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,b,P,A,R,L){let O=A.fog,N=R.geometry,z=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?A.environment:null,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,W=t.get(_.envMap||z,G),et=h[_.type],q=n.precision;_.precision!==null&&(q=n.getMaxPrecision(_.precision),q!==_.precision&&Et("WebGLProgram.getParameters:",_.precision,"not supported, using",q,"instead."));let Q=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,tt=Q!==void 0?Q.length:0,vt=0;N.morphAttributes.position!==void 0&&(vt=1),N.morphAttributes.normal!==void 0&&(vt=2),N.morphAttributes.color!==void 0&&(vt=3);let Ut,Z,ut,yt;if(et){let mt=Pi[et];Ut=mt.vertexShader,Z=mt.fragmentShader}else{Ut=_.vertexShader,Z=_.fragmentShader;let mt=a.getVertexShaderStage(_),ce=a.getFragmentShaderStage(_);a.update(_,mt,ce),ut=mt.id,yt=ce.id}let Pt=i.getRenderTarget(),pt=i.state.buffers.depth.getReversed(),Ft=R.isInstancedMesh===!0,Re=R.isBatchedMesh===!0,Lt=!!_.map,te=!!_.matcap,pe=!!W,$t=pe&&W.isPMREMTexture===!0,sn=!!_.aoMap,He=!!_.lightMap,In=!!_.bumpMap&&_.wireframe===!1,be=!!_.normalMap,xi=!!_.displacementMap,je=!!_.emissiveMap,qn=!!_.metalnessMap,Yn=!!_.roughnessMap,$n=_.anisotropy>0,F=_.clearcoat>0,Kn=_.diffuseRoughness>0,Se=_.dispersion>0,Me=_.retroreflectivity>0,ft=_.iridescence>0,Ve=_.sheen>0,Nt=_.transmission>0,Bt=$n&&!!_.anisotropyMap,C=F&&!!_.clearcoatMap,T=F&&!!_.clearcoatNormalMap,H=F&&!!_.clearcoatRoughnessMap,nt=Kn&&!!_.diffuseRoughnessMap,J=ft&&!!_.iridescenceMap,rt=ft&&!!_.iridescenceThicknessMap,ht=Ve&&!!_.sheenColorMap,$=Ve&&!!_.sheenRoughnessMap,K=!!_.specularMap,at=!!_.specularColorMap,D=!!_.specularIntensityMap,j=Nt&&!!_.transmissionMap,Y=Nt&&!!_.thicknessMap,lt=!!_.gradientMap,st=!!_.alphaMap,ot=_.alphaTest>0,Rt=!!_.alphaHash,Gt=!!_.extensions,it=Ai;_.toneMapped&&(Pt===null||Pt.isXRRenderTarget===!0)&&(it=i.toneMapping);let Ct=$t?W.isCompressedCubeTexture?W.image[0].mipmaps:W.mipmaps:null,Vt={shaderID:et,shaderType:_.type,shaderName:_.name,vertexShader:Ut,fragmentShader:Z,defines:_.defines,customVertexShaderID:ut,customFragmentShaderID:yt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:q,batching:Re,batchingColor:Re&&R._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&R.instanceColor!==null,instancingMorph:Ft&&R.morphTexture!==null,outputColorSpace:Pt===null?i.outputColorSpace:Pt.isXRRenderTarget===!0?Pt.texture.colorSpace:Wt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Lt,matcap:te,envMap:pe,envMapMode:pe&&W.mapping,envMapPMREM:$t,envMapMaxLod:$t?Ct.length-1:null,envMapSize:$t?Ct[0].width:null,aoMap:sn,lightMap:He,bumpMap:In,normalMap:be,displacementMap:xi,emissiveMap:je,normalMapObjectSpace:be&&_.normalMapType===Gm,normalMapTangentSpace:be&&_.normalMapType===$a,packedNormalMap:be&&_.normalMapType===$a&&PM(_.normalMap.format),metalnessMap:qn,roughnessMap:Yn,anisotropy:$n,anisotropyMap:Bt,clearcoat:F,clearcoatMap:C,clearcoatNormalMap:T,clearcoatRoughnessMap:H,diffuseRoughness:Kn,diffuseRoughnessMap:nt,dispersion:Se,retroreflection:Me,iridescence:ft,iridescenceMap:J,iridescenceThicknessMap:rt,sheen:Ve,sheenColorMap:ht,sheenRoughnessMap:$,specularMap:K,specularColorMap:at,specularIntensityMap:D,transmission:Nt,transmissionMap:j,thicknessMap:Y,gradientMap:lt,opaque:_.transparent===!1&&_.blending===mo&&_.alphaToCoverage===!1,alphaMap:st,alphaTest:ot,alphaHash:Rt,combine:_.combine,mapUv:Lt&&f(_.map.channel),aoMapUv:sn&&f(_.aoMap.channel),lightMapUv:He&&f(_.lightMap.channel),bumpMapUv:In&&f(_.bumpMap.channel),normalMapUv:be&&f(_.normalMap.channel),displacementMapUv:xi&&f(_.displacementMap.channel),emissiveMapUv:je&&f(_.emissiveMap.channel),metalnessMapUv:qn&&f(_.metalnessMap.channel),roughnessMapUv:Yn&&f(_.roughnessMap.channel),anisotropyMapUv:Bt&&f(_.anisotropyMap.channel),clearcoatMapUv:C&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:T&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:H&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:nt&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:J&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:ht&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:$&&f(_.sheenRoughnessMap.channel),specularMapUv:K&&f(_.specularMap.channel),specularColorMapUv:at&&f(_.specularColorMap.channel),specularIntensityMapUv:D&&f(_.specularIntensityMap.channel),transmissionMapUv:j&&f(_.transmissionMap.channel),thicknessMapUv:Y&&f(_.thicknessMap.channel),alphaMapUv:st&&f(_.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(be||$n),vertexNormals:!!N.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!N.attributes.uv&&(Lt||st),fog:!!O,useFog:_.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||N.attributes.normal===void 0&&be===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:pt,skinning:R.isSkinnedMesh===!0,hasPositionAttribute:N.attributes.position!==void 0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:vt,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:L.filter(mt=>mt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:it,decodeVideoTexture:Lt&&_.map.isVideoTexture===!0&&Wt.getTransfer(_.map.colorSpace)===ae,decodeVideoTextureEmissive:je&&_.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(_.emissiveMap.colorSpace)===ae,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ie,flipSided:_.side===qe,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Gt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Gt&&_.extensions.multiDraw===!0||Re)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Vt.vertexUv1s=l.has(1),Vt.vertexUv2s=l.has(2),Vt.vertexUv3s=l.has(3),l.clear(),Vt}function v(_){let b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(let P in _.defines)b.push(P),b.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(p(b,_),m(b,_),b.push(i.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function p(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapPMREM),_.push(b.envMapMaxLod),_.push(b.envMapSize),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.diffuseRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.numSunLights),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numSunLightShadows),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.numLightProbeGrids),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function m(_,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.retroreflection&&o.enable(24),b.diffuseRoughness&&o.enable(25),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),b.packedNormalMap&&o.enable(22),b.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),b.numLightProbeGrids>0&&o.enable(22),b.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function x(_){let b=h[_.type],P;if(b){let A=Pi[b];P=ng.clone(A.uniforms)}else P=_.uniforms;return P}function S(_,b){let P=u.get(b);return P!==void 0?++P.usedTimes:(P=new RM(i,b,_,s),c.push(P),u.set(b,P)),P}function y(_){if(--_.usedTimes===0){let b=c.indexOf(_);c[b]=c[c.length-1],c.pop(),u.delete(_.cacheKey),_.destroy()}}function M(_){a.remove(_)}function w(){a.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:S,releaseProgram:y,releaseShaderCache:M,programs:c,dispose:w}}function LM(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function NM(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Mg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function bg(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,v,p,m){let x=i[t];return x===void 0?(x={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:v,renderOrder:h.renderOrder,z:p,group:m},i[t]=x):(x.id=h.id,x.object=h,x.geometry=f,x.material=g,x.materialVariant=o(h),x.groupOrder=v,x.renderOrder=h.renderOrder,x.z=p,x.group=m),t++,x}function l(h,f,g,v,p,m,x){x.reversedDepth===!0&&(p=-p);let S=a(h,f,g,v,p,m);g.transmission>0?n.push(S):g.transparent===!0?s.push(S):e.push(S)}function c(h,f,g,v,p,m){let x=a(h,f,g,v,p,m);g.transmission>0?n.unshift(x):g.transparent===!0?s.unshift(x):e.unshift(x)}function u(h,f){e.length>1&&e.sort(h||NM),n.length>1&&n.sort(f||Mg),s.length>1&&s.sort(f||Mg)}function d(){for(let h=t,f=i.length;h<f;h++){let g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function DM(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new bg,i.set(n,[o])):s>=r.length?(o=new bg,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function UM(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new I,color:new At};break;case"SpotLight":e={position:new I,direction:new I,color:new At,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new At,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new At,groundColor:new At};break;case"RectAreaLight":e={color:new At,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function OM(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var FM=0;function BM(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function zM(i){let t=new UM,e=OM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let s=new I,r=new Tt,o=new Tt;function a(c){let u=0,d=0,h=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let f=0,g=0,v=0,p=0,m=0,x=0,S=0,y=0,M=0,w=0,_=0,b=0,P=0,A=0;c.sort(BM);for(let L=0,O=c.length;L<O;L++){let N=c[L],z=N.color,G=N.intensity,W=N.distance,et=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Ps?et=N.shadow.map.texture:et=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=z.r*G,d+=z.g*G,h+=z.b*G;else if(N.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(N.sh.coefficients[q],G);A++}else if(N.isSunLight){let q=t.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Q=N.shadow,tt=e.get(N);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),n.sunShadow[g]=tt,n.sunShadowMap[g]=et;let vt=Q.getViewportCount();for(let Ut=0;Ut<vt;Ut++)n.sunShadowMatrix[v+Ut]=Q.getMatrix(Ut),n.sunShadowCascade[v+Ut]=Q._cascadeData[Ut];v+=vt,g++}n.sun[f]=q,f++}else if(N.isDirectionalLight){let q=t.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let Q=N.shadow,tt=e.get(N);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,n.directionalShadow[p]=tt,n.directionalShadowMap[p]=et,n.directionalShadowMatrix[p]=N.shadow.matrix,M++}n.directional[p]=q,p++}else if(N.isSpotLight){let q=t.get(N);q.position.setFromMatrixPosition(N.matrixWorld),q.color.copy(z).multiplyScalar(G),q.distance=W,q.coneCos=Math.cos(N.angle),q.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),q.decay=N.decay,n.spot[x]=q;let Q=N.shadow;if(N.map&&(n.spotLightMap[b]=N.map,b++,Q.updateMatrices(N),N.castShadow&&P++),n.spotLightMatrix[x]=Q.matrix,N.castShadow){let tt=e.get(N);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,n.spotShadow[x]=tt,n.spotShadowMap[x]=et,_++}x++}else if(N.isRectAreaLight){let q=t.get(N);q.color.copy(z).multiplyScalar(G),q.halfWidth.set(N.width*.5,0,0),q.halfHeight.set(0,N.height*.5,0),n.rectArea[S]=q,S++}else if(N.isPointLight){let q=t.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),q.distance=N.distance,q.decay=N.decay,N.castShadow){let Q=N.shadow,tt=e.get(N);tt.shadowIntensity=Q.intensity,tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,tt.shadowCameraNear=Q.camera.near,tt.shadowCameraFar=Q.camera.far,n.pointShadow[m]=tt,n.pointShadowMap[m]=et,n.pointShadowMatrix[m]=N.shadow.matrix,w++}n.point[m]=q,m++}else if(N.isHemisphereLight){let q=t.get(N);q.skyColor.copy(N.color).multiplyScalar(G),q.groundColor.copy(N.groundColor).multiplyScalar(G),n.hemi[y]=q,y++}}S>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=gt.LTC_FLOAT_1,n.rectAreaLTC2=gt.LTC_FLOAT_2):(n.rectAreaLTC1=gt.LTC_HALF_1,n.rectAreaLTC2=gt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let R=n.hash;(R.sunLength!==f||R.directionalLength!==p||R.pointLength!==m||R.spotLength!==x||R.rectAreaLength!==S||R.hemiLength!==y||R.numSunShadows!==g||R.numDirectionalShadows!==M||R.numPointShadows!==w||R.numSpotShadows!==_||R.numSpotMaps!==b||R.numLightProbes!==A)&&(n.sun.length=f,n.directional.length=p,n.spot.length=x,n.rectArea.length=S,n.point.length=m,n.hemi.length=y,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.directionalShadowMatrix.length=M,n.pointShadow.length=w,n.pointShadowMap.length=w,n.pointShadowMatrix.length=w,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+b-P,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=A,R.sunLength=f,R.directionalLength=p,R.pointLength=m,R.spotLength=x,R.rectAreaLength=S,R.hemiLength=y,R.numSunShadows=g,R.numDirectionalShadows=M,R.numPointShadows=w,R.numSpotShadows=_,R.numSpotMaps=b,R.numLightProbes=A,n.version=FM++)}function l(c,u){let d=0,h=0,f=0,g=0,v=0,p=0,m=u.matrixWorldInverse;for(let x=0,S=c.length;x<S;x++){let y=c[x];if(y.isSunLight){let M=n.sun[d];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),d++}else if(y.isDirectionalLight){let M=n.directional[h];M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),h++}else if(y.isSpotLight){let M=n.spot[g];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),g++}else if(y.isRectAreaLight){let M=n.rectArea[v];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(y.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(y.width*.5,0,0),M.halfHeight.set(0,y.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),v++}else if(y.isPointLight){let M=n.point[f];M.position.setFromMatrixPosition(y.matrixWorld),M.position.applyMatrix4(m),f++}else if(y.isHemisphereLight){let M=n.hemi[p];M.direction.setFromMatrixPosition(y.matrixWorld),M.direction.transformDirection(m),p++}}}return{setup:a,setupView:l,state:n}}function Tg(i){let t=new zM(i),e=[],n=[],s=[];function r(d){u.camera=d,e.length=0,n.length=0,s.length=0}function o(d){d.isLightProbeGrid?s.push(d):e.push(d)}function a(d){n.push(d)}function l(){t.setup(e),s.sort((d,h)=>d.priority-h.priority||d.id-h.id)}function c(d){t.setupView(e,d)}let u={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function kM(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Tg(i),t.set(s,[a])):r>=o.length?(a=new Tg(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var HM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,VM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,GM=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],WM=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],wg=new Tt,Ka=new I,zd=new I;function XM(i,t,e){let n=new Ki,s=new xt,r=new xt,o=new ue,a=new gc,l=new _c,c={},u=e.maxTextureSize,d={[Vn]:qe,[qe]:Vn,[Ie]:Ie},h=new Ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:HM,fragmentShader:VM}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new Ue;g.setAttribute("position",new we(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Jt(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ba;let m=this.type;this.render=function(w,_,b){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;this.type===ym&&(Et("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ba);let P=i.getRenderTarget(),A=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),L=i.state;L.setBlending(ur),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let O=m!==this.type;O&&_.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(z=>z.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,z=w.length;N<z;N++){let G=w[N],W=G.shadow;if(W===void 0){Et("WebGLShadowMap:",G,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let et=W.getFrameExtents();s.multiply(et),r.copy(W.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/et.x),s.x=r.x*et.x,W.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/et.y),s.y=r.y*et.y,W.mapSize.y=r.y));let q=i.state.buffers.depth.getReversed();if(W.camera._reversedDepth=q,W.map===null||O===!0){if(W.map!==null&&(W.map.depthTexture!==null&&(W.map.depthTexture.dispose(),W.map.depthTexture=null),W.map.dispose()),this.type===po){if(G.isPointLight){Et("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}W.map=new Hn(s.x,s.y,{format:Ps,type:ui,minFilter:We,magFilter:We,generateMipmaps:!1}),W.map.texture.name=G.name+".shadowMap",W.map.depthTexture=new Zi(s.x,s.y,wn),W.map.depthTexture.name=G.name+".shadowMapDepth",W.map.depthTexture.format=Yi,W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=De,W.map.depthTexture.magFilter=De}else G.isPointLight?(W.map=new ja(s.x),W.map.depthTexture=new Ta(s.x,ei)):(W.map=new Hn(s.x,s.y),W.map.depthTexture=new Zi(s.x,s.y,ei)),W.map.depthTexture.name=G.name+".shadowMap",W.map.depthTexture.format=Yi,this.type===Ba?(W.map.depthTexture.compareFunction=q?Sd:vd,W.map.depthTexture.minFilter=We,W.map.depthTexture.magFilter=We):(W.map.depthTexture.compareFunction=null,W.map.depthTexture.minFilter=De,W.map.depthTexture.magFilter=De);W.camera.updateProjectionMatrix()}W.map.isWebGLCubeRenderTarget!==!0&&(W.map.width!==s.x||W.map.height!==s.y)&&W.map.setSize(s.x,s.y);let Q=W.map.isWebGLCubeRenderTarget?6:W.getViewportCount();G.isPointLight!==!0&&W.updateMatrices(G,b);let tt=(W.camera.layers.mask&4294967294)!==0?W.camera.layers:b.layers;for(let vt=0;vt<Q;vt++){let Ut=W.getCamera(vt);if(G.isPointLight){let Z=W.camera,ut=W.matrix,yt=G.distance||Z.far;yt!==Z.far&&(Z.far=yt,Z.updateProjectionMatrix()),Ka.setFromMatrixPosition(G.matrixWorld),Z.position.copy(Ka),zd.copy(Z.position),zd.add(GM[vt]),Z.up.copy(WM[vt]),Z.lookAt(zd),Z.updateMatrixWorld(),ut.makeTranslation(-Ka.x,-Ka.y,-Ka.z),wg.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),W._frustum.setFromProjectionMatrix(wg,Z.coordinateSystem,Z.reversedDepth)}if(W.map.isWebGLCubeRenderTarget)i.setRenderTarget(W.map,vt),i.clear();else{vt===0&&(i.setRenderTarget(W.map),i.clear());let Z=W.getViewport(vt);o.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),L.viewport(o)}n=W.getFrustum(vt),y(_,b,Ut,G,tt,this.type)}W.isPointLightShadow!==!0&&this.type===po&&x(W,b),W.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(P,A,R)};function x(w,_){let b=t.update(v);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new Hn(s.x,s.y,{format:Ps,type:ui}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value.set(w.map.width,w.map.height),h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(_,null,b,h,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(_,null,b,f,v,null)}function S(w,_,b,P){let A=null,R=b.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)A=R;else if(A=b.isPointLight===!0?l:a,i.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let L=A.uuid,O=_.uuid,N=c[L];N===void 0&&(N={},c[L]=N);let z=N[O];z===void 0&&(z=A.clone(),N[O]=z,_.addEventListener("dispose",M)),A=z}if(A.visible=_.visible,A.wireframe=_.wireframe,P===po?A.side=_.shadowSide!==null?_.shadowSide:_.side:A.side=_.shadowSide!==null?_.shadowSide:d[_.side],A.alphaMap=_.alphaMap,A.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,A.map=_.map,A.clipShadows=_.clipShadows,A.clippingPlanes=_.clippingPlanes,A.clipIntersection=_.clipIntersection,A.displacementMap=_.displacementMap,A.displacementScale=_.displacementScale,A.displacementBias=_.displacementBias,A.wireframeLinewidth=_.wireframeLinewidth,A.linewidth=_.linewidth,b.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let L=i.properties.get(A);L.light=b}return A}function y(w,_,b,P,A,R){if(w.visible===!1)return;if(w.layers.test(A)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&R===po)&&(!w.frustumCulled||w.intersectsFrustum(n))){w.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,w.matrixWorld);let N=t.update(w),z=w.material;if(Array.isArray(z)){let G=N.groups;for(let W=0,et=G.length;W<et;W++){let q=G[W],Q=z[q.materialIndex];if(Q&&Q.visible){let tt=S(w,Q,P,R);w.onBeforeShadow(i,w,_,b,N,tt,q),i.renderBufferDirect(b,null,N,tt,w,q),w.onAfterShadow(i,w,_,b,N,tt,q)}}}else if(z.visible){let G=S(w,z,P,R);w.onBeforeShadow(i,w,_,b,N,G,null),i.renderBufferDirect(b,null,N,G,w,null),w.onAfterShadow(i,w,_,b,N,G,null)}}let O=w.children;for(let N=0,z=O.length;N<z;N++)y(O[N],_,b,P,A,R)}function M(w){w.target.removeEventListener("dispose",M);for(let b in c){let P=c[b],A=w.target.uuid;A in P&&(P[A].dispose(),delete P[A])}}}function qM(i,t){function e(){let D=!1,j=new ue,Y=null,lt=new ue(0,0,0,0);return{setMask:function(st){Y!==st&&!D&&(i.colorMask(st,st,st,st),Y=st)},setLocked:function(st){D=st},setClear:function(st,ot,Rt,Gt,it){it===!0&&(st*=Gt,ot*=Gt,Rt*=Gt),j.set(st,ot,Rt,Gt),lt.equals(j)===!1&&(i.clearColor(st,ot,Rt,Gt),lt.copy(j))},reset:function(){D=!1,Y=null,lt.set(-1,0,0,0)}}}function n(){let D=!1,j=!1,Y=null,lt=null,st=null;return{setReversed:function(ot){if(j!==ot){let Rt=t.get("EXT_clip_control");ot?Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.ZERO_TO_ONE_EXT):Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.NEGATIVE_ONE_TO_ONE_EXT),j=ot;let Gt=st;st=null,this.setClear(Gt)}},getReversed:function(){return j},setTest:function(ot){ot?pt(i.DEPTH_TEST):Ft(i.DEPTH_TEST)},setMask:function(ot){Y!==ot&&!D&&(i.depthMask(ot),Y=ot)},setFunc:function(ot){if(j&&(ot=Qm[ot]),lt!==ot){switch(ot){case ic:i.depthFunc(i.NEVER);break;case sc:i.depthFunc(i.ALWAYS);break;case rc:i.depthFunc(i.LESS);break;case jr:i.depthFunc(i.LEQUAL);break;case oc:i.depthFunc(i.EQUAL);break;case ac:i.depthFunc(i.GEQUAL);break;case lc:i.depthFunc(i.GREATER);break;case cc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}lt=ot}},setLocked:function(ot){D=ot},setClear:function(ot){st!==ot&&(st=ot,j&&(ot=1-ot),i.clearDepth(ot))},reset:function(){D=!1,Y=null,lt=null,st=null,j=!1}}}function s(){let D=!1,j=null,Y=null,lt=null,st=null,ot=null,Rt=null,Gt=null,it=null;return{setTest:function(Ct){D||(Ct?pt(i.STENCIL_TEST):Ft(i.STENCIL_TEST))},setMask:function(Ct){j!==Ct&&!D&&(i.stencilMask(Ct),j=Ct)},setFunc:function(Ct,Vt,mt){(Y!==Ct||lt!==Vt||st!==mt)&&(i.stencilFunc(Ct,Vt,mt),Y=Ct,lt=Vt,st=mt)},setOp:function(Ct,Vt,mt){(ot!==Ct||Rt!==Vt||Gt!==mt)&&(i.stencilOp(Ct,Vt,mt),ot=Ct,Rt=Vt,Gt=mt)},setLocked:function(Ct){D=Ct},setClear:function(Ct){it!==Ct&&(i.clearStencil(Ct),it=Ct)},reset:function(){D=!1,j=null,Y=null,lt=null,st=null,ot=null,Rt=null,Gt=null,it=null}}}let r=new e,o=new n,a=new s,l={},c=new WeakMap,u={},d={},h={},f=new WeakMap,g=[],v=null,p=!1,m=null,x=null,S=null,y=null,M=null,w=null,_=null,b=new At(0,0,0),P=0,A=!1,R=null,L=null,O=null,N=null,z=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),W=!1,et=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(q)[1]),W=et>=1):q.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),W=et>=2);let Q=null,tt={},vt=i.getParameter(i.SCISSOR_BOX),Ut=i.getParameter(i.VIEWPORT),Z=new ue().fromArray(vt),ut=new ue().fromArray(Ut);function yt(D,j,Y,lt){let st=new Uint8Array(4),ot=i.createTexture();i.bindTexture(D,ot),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Rt=0;Rt<Y;Rt++)D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY?i.texImage3D(j,0,i.RGBA,1,1,lt,0,i.RGBA,i.UNSIGNED_BYTE,st):i.texImage2D(j+Rt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,st);return ot}let Pt={};Pt[i.TEXTURE_2D]=yt(i.TEXTURE_2D,i.TEXTURE_2D,1),Pt[i.TEXTURE_CUBE_MAP]=yt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Pt[i.TEXTURE_2D_ARRAY]=yt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Pt[i.TEXTURE_3D]=yt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),pt(i.DEPTH_TEST),o.setFunc(jr),In(!1),be(td),pt(i.CULL_FACE),sn(ur);function pt(D){u[D]!==!0&&(i.enable(D),u[D]=!0)}function Ft(D){u[D]!==!1&&(i.disable(D),u[D]=!1)}function Re(D,j){return h[D]!==j?(i.bindFramebuffer(D,j),h[D]=j,D===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=j),D===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=j),!0):!1}function Lt(D,j){let Y=g,lt=!1;if(D){Y=f.get(j),Y===void 0&&(Y=[],f.set(j,Y));let st=D.textures;if(Y.length!==st.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let ot=0,Rt=st.length;ot<Rt;ot++)Y[ot]=i.COLOR_ATTACHMENT0+ot;Y.length=st.length,lt=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,lt=!0);lt&&i.drawBuffers(Y)}function te(D){return v!==D?(i.useProgram(D),v=D,!0):!1}let pe={[hr]:i.FUNC_ADD,[Sm]:i.FUNC_SUBTRACT,[Mm]:i.FUNC_REVERSE_SUBTRACT};pe[bm]=i.MIN,pe[Tm]=i.MAX;let $t={[wm]:i.ZERO,[Em]:i.ONE,[Am]:i.SRC_COLOR,[sd]:i.SRC_ALPHA,[Nm]:i.SRC_ALPHA_SATURATE,[Im]:i.DST_COLOR,[Cm]:i.DST_ALPHA,[Rm]:i.ONE_MINUS_SRC_COLOR,[rd]:i.ONE_MINUS_SRC_ALPHA,[Lm]:i.ONE_MINUS_DST_COLOR,[Pm]:i.ONE_MINUS_DST_ALPHA,[Dm]:i.CONSTANT_COLOR,[Um]:i.ONE_MINUS_CONSTANT_COLOR,[Om]:i.CONSTANT_ALPHA,[Fm]:i.ONE_MINUS_CONSTANT_ALPHA};function sn(D,j,Y,lt,st,ot,Rt,Gt,it,Ct){if(D===ur){p===!0&&(Ft(i.BLEND),p=!1);return}if(p===!1&&(pt(i.BLEND),p=!0),D!==vm){if(D!==m||Ct!==A){if((x!==hr||M!==hr)&&(i.blendEquation(i.FUNC_ADD),x=hr,M=hr),Ct)switch(D){case mo:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ed:i.blendFunc(i.ONE,i.ONE);break;case nd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case id:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Dt("WebGLState: Invalid blending: ",D);break}else switch(D){case mo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ed:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nd:Dt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case id:Dt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Dt("WebGLState: Invalid blending: ",D);break}S=null,y=null,w=null,_=null,b.set(0,0,0),P=0,m=D,A=Ct}return}st=st||j,ot=ot||Y,Rt=Rt||lt,(j!==x||st!==M)&&(i.blendEquationSeparate(pe[j],pe[st]),x=j,M=st),(Y!==S||lt!==y||ot!==w||Rt!==_)&&(i.blendFuncSeparate($t[Y],$t[lt],$t[ot],$t[Rt]),S=Y,y=lt,w=ot,_=Rt),(Gt.equals(b)===!1||it!==P)&&(i.blendColor(Gt.r,Gt.g,Gt.b,it),b.copy(Gt),P=it),m=D,A=!1}function He(D,j){D.side===Ie?Ft(i.CULL_FACE):pt(i.CULL_FACE);let Y=D.side===qe;j&&(Y=!Y),In(Y),D.blending===mo&&D.transparent===!1?sn(ur):sn(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),o.setFunc(D.depthFunc),o.setTest(D.depthTest),o.setMask(D.depthWrite),r.setMask(D.colorWrite);let lt=D.stencilWrite;a.setTest(lt),lt&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),je(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?pt(i.SAMPLE_ALPHA_TO_COVERAGE):Ft(i.SAMPLE_ALPHA_TO_COVERAGE)}function In(D){R!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),R=D)}function be(D){D!==_m?(pt(i.CULL_FACE),D!==L&&(D===td?i.cullFace(i.BACK):D===xm?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ft(i.CULL_FACE),L=D}function xi(D){D!==O&&(W&&i.lineWidth(D),O=D)}function je(D,j,Y){D?(pt(i.POLYGON_OFFSET_FILL),(N!==j||z!==Y)&&(N=j,z=Y,o.getReversed()&&(j=-j,Y=-Y),i.polygonOffset(j,Y))):Ft(i.POLYGON_OFFSET_FILL)}function qn(D){D?pt(i.SCISSOR_TEST):Ft(i.SCISSOR_TEST)}function Yn(D){D===void 0&&(D=i.TEXTURE0+G-1),Q!==D&&(i.activeTexture(D),Q=D)}function $n(D,j,Y){Y===void 0&&(Q===null?Y=i.TEXTURE0+G-1:Y=Q);let lt=tt[Y];lt===void 0&&(lt={type:void 0,texture:void 0},tt[Y]=lt),(lt.type!==D||lt.texture!==j)&&(Q!==Y&&(i.activeTexture(Y),Q=Y),i.bindTexture(D,j||Pt[D]),lt.type=D,lt.texture=j)}function F(){let D=tt[Q];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Kn(){try{i.compressedTexImage2D(...arguments)}catch(D){Dt("WebGLState:",D)}}function Se(){try{i.compressedTexImage3D(...arguments)}catch(D){Dt("WebGLState:",D)}}function Me(){try{i.texSubImage2D(...arguments)}catch(D){Dt("WebGLState:",D)}}function ft(){try{i.texSubImage3D(...arguments)}catch(D){Dt("WebGLState:",D)}}function Ve(){try{i.compressedTexSubImage2D(...arguments)}catch(D){Dt("WebGLState:",D)}}function Nt(){try{i.compressedTexSubImage3D(...arguments)}catch(D){Dt("WebGLState:",D)}}function Bt(){try{i.texStorage2D(...arguments)}catch(D){Dt("WebGLState:",D)}}function C(){try{i.texStorage3D(...arguments)}catch(D){Dt("WebGLState:",D)}}function T(){try{i.texImage2D(...arguments)}catch(D){Dt("WebGLState:",D)}}function H(){try{i.texImage3D(...arguments)}catch(D){Dt("WebGLState:",D)}}function nt(D){return d[D]!==void 0?d[D]:i.getParameter(D)}function J(D,j){d[D]!==j&&(i.pixelStorei(D,j),d[D]=j)}function rt(D){Z.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),Z.copy(D))}function ht(D){ut.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),ut.copy(D))}function $(D,j){let Y=c.get(j);Y===void 0&&(Y=new WeakMap,c.set(j,Y));let lt=Y.get(D);lt===void 0&&(lt=i.getUniformBlockIndex(j,D.name),i.uniformBlockBinding(j,lt,lt),Y.set(D,lt))}function K(D,j,Y){let st=c.get(j).get(D);l[st]!==Y&&(i.bindBufferBase(i.UNIFORM_BUFFER,st,Y),l[st]=Y)}function at(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},Q=null,tt={},h={},l={},f=new WeakMap,g=[],v=null,p=!1,m=null,x=null,S=null,y=null,M=null,w=null,_=null,b=new At(0,0,0),P=0,A=!1,R=null,L=null,O=null,N=null,z=null,Z.set(0,0,i.canvas.width,i.canvas.height),ut.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:pt,disable:Ft,bindFramebuffer:Re,drawBuffers:Lt,useProgram:te,setBlending:sn,setMaterial:He,setFlipSided:In,setCullFace:be,setLineWidth:xi,setPolygonOffset:je,setScissorTest:qn,activeTexture:Yn,bindTexture:$n,unbindTexture:F,compressedTexImage2D:Kn,compressedTexImage3D:Se,texImage2D:T,texImage3D:H,pixelStorei:J,getParameter:nt,updateUBOMapping:$,uniformBlockBinding:K,texStorage2D:Bt,texStorage3D:C,texSubImage2D:Me,texSubImage3D:ft,compressedTexSubImage2D:Ve,compressedTexSubImage3D:Nt,scissor:rt,viewport:ht,reset:at}}function YM(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xt,u=new WeakMap,d=new Set,h,f=new WeakMap,g=new Set,v=new FinalizationRegistry(C=>g.delete(C)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(C,T){return p?new OffscreenCanvas(C,T):to("canvas")}function x(C,T,H){let nt=1,J=Bt(C);if((J.width>H||J.height>H)&&(nt=H/Math.max(J.width,J.height)),nt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let rt=Math.floor(nt*J.width),ht=Math.floor(nt*J.height);h===void 0&&(h=m(rt,ht));let $=T?m(rt,ht):h;return $.width=rt,$.height=ht,$.getContext("2d").drawImage(C,0,0,rt,ht),Et("WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+rt+"x"+ht+")."),$}else return"data"in C&&Et("WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),C;return C}function S(C){return C.generateMipmaps}function y(C){i.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(C,T,H,nt,J,rt=!1){if(C!==null){if(i[C]!==void 0)return i[C];Et("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ht;nt&&(ht=t.get("EXT_texture_norm16"),ht||Et("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=T;if(T===i.RED&&(H===i.FLOAT&&($=i.R32F),H===i.HALF_FLOAT&&($=i.R16F),H===i.UNSIGNED_BYTE&&($=i.R8),H===i.UNSIGNED_SHORT&&ht&&($=ht.R16_EXT),H===i.SHORT&&ht&&($=ht.R16_SNORM_EXT)),T===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.R8UI),H===i.UNSIGNED_SHORT&&($=i.R16UI),H===i.UNSIGNED_INT&&($=i.R32UI),H===i.BYTE&&($=i.R8I),H===i.SHORT&&($=i.R16I),H===i.INT&&($=i.R32I)),T===i.RG&&(H===i.FLOAT&&($=i.RG32F),H===i.HALF_FLOAT&&($=i.RG16F),H===i.UNSIGNED_BYTE&&($=i.RG8),H===i.UNSIGNED_SHORT&&ht&&($=ht.RG16_EXT),H===i.SHORT&&ht&&($=ht.RG16_SNORM_EXT)),T===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RG8UI),H===i.UNSIGNED_SHORT&&($=i.RG16UI),H===i.UNSIGNED_INT&&($=i.RG32UI),H===i.BYTE&&($=i.RG8I),H===i.SHORT&&($=i.RG16I),H===i.INT&&($=i.RG32I)),T===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGB8UI),H===i.UNSIGNED_SHORT&&($=i.RGB16UI),H===i.UNSIGNED_INT&&($=i.RGB32UI),H===i.BYTE&&($=i.RGB8I),H===i.SHORT&&($=i.RGB16I),H===i.INT&&($=i.RGB32I)),T===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGBA8UI),H===i.UNSIGNED_SHORT&&($=i.RGBA16UI),H===i.UNSIGNED_INT&&($=i.RGBA32UI),H===i.BYTE&&($=i.RGBA8I),H===i.SHORT&&($=i.RGBA16I),H===i.INT&&($=i.RGBA32I)),T===i.RGB&&(H===i.UNSIGNED_SHORT&&ht&&($=ht.RGB16_EXT),H===i.SHORT&&ht&&($=ht.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),T===i.RGBA){let K=rt?da:Wt.getTransfer(J);H===i.FLOAT&&($=i.RGBA32F),H===i.HALF_FLOAT&&($=i.RGBA16F),H===i.UNSIGNED_BYTE&&($=K===ae?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&ht&&($=ht.RGBA16_EXT),H===i.SHORT&&ht&&($=ht.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function _(C,T){let H;return C?T===null||T===ei||T===pr?H=i.DEPTH24_STENCIL8:T===wn?H=i.DEPTH32F_STENCIL8:T===xo&&(H=i.DEPTH24_STENCIL8,Et("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ei||T===pr?H=i.DEPTH_COMPONENT24:T===wn?H=i.DEPTH_COMPONENT32F:T===xo&&(H=i.DEPTH_COMPONENT16),H}function b(C,T){return S(C)===!0||C.isFramebufferTexture&&C.minFilter!==De&&C.minFilter!==We?Math.log2(Math.max(T.width,T.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?T.mipmaps.length:1}function P(C){let T=new WeakRef(C);n.get(C).__ref=T,g.add(T),v.register(C,T,T)}function A(C){let T=n.get(C).__ref;T!==void 0&&(g.delete(T),v.unregister(T))}function R(C){O(C.target)}function L(C){N(C.target)}function O(C){C.removeEventListener("dispose",R),A(C),G(C),C.isVideoTexture&&u.delete(C),C.isHTMLTexture&&d.delete(C)}function N(C){C.removeEventListener("dispose",L),A(C),et(C)}function z(){for(let C of g){let T=C.deref();T!==void 0&&(T.isRenderTarget===!0?N(T):O(T))}g.clear(),d.clear()}function G(C){let T=n.get(C);if(T.__webglInit===void 0)return;let H=C.source,nt=f.get(H);if(nt){let J=nt[T.__cacheKey];J.usedTimes--,J.usedTimes===0&&W(C),Object.keys(nt).length===0&&f.delete(H)}n.remove(C)}function W(C){let T=n.get(C);i.deleteTexture(T.__webglTexture);let H=C.source,nt=f.get(H);delete nt[T.__cacheKey],o.memory.textures--}function et(C){let T=n.get(C);T.__depthDisposeCallback&&T.__depthDisposeCallback();let H=C.depthTexture;if(H&&H.renderTarget===C&&O(H),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(T.__webglFramebuffer[J]))for(let rt=0;rt<T.__webglFramebuffer[J].length;rt++)i.deleteFramebuffer(T.__webglFramebuffer[J][rt]);else i.deleteFramebuffer(T.__webglFramebuffer[J]);T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer[J])}else{if(Array.isArray(T.__webglFramebuffer))for(let J=0;J<T.__webglFramebuffer.length;J++)i.deleteFramebuffer(T.__webglFramebuffer[J]);else i.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&i.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&i.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let J=0;J<T.__webglColorRenderbuffer.length;J++)T.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(T.__webglColorRenderbuffer[J]);T.__webglDepthRenderbuffer&&i.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let nt=C.textures;for(let J=0,rt=nt.length;J<rt;J++){let ht=n.get(nt[J]);ht.__webglTexture&&(i.deleteTexture(ht.__webglTexture),o.memory.textures--),n.remove(nt[J])}n.remove(C)}let q=0;function Q(){q=0}function tt(){return q}function vt(C){q=C}function Ut(){let C=q;return C>=s.maxTextures&&Et("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+s.maxTextures),q+=1,C}function Z(C){let T=[];return T.push(C.wrapS),T.push(C.wrapT),T.push(C.wrapR||0),T.push(C.magFilter),T.push(C.minFilter),T.push(C.anisotropy),T.push(C.internalFormat),T.push(C.format),T.push(C.type),T.push(C.generateMipmaps),T.push(C.mipmapsAutoUpdate),T.push(C.premultiplyAlpha),T.push(C.flipY),T.push(C.unpackAlignment),T.push(C.colorSpace),T.join()}function ut(C,T){let H=n.get(C);if(C.isVideoTexture&&Ve(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&H.__version!==C.version){let nt=C.image;if(nt===null)Et("WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)Et("WebGLRenderer: Texture marked for update but image is incomplete");else{He(H,C,T);return}}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+T)}function yt(C,T){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){He(H,C,T);return}else C.isExternalTexture&&(H.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+T)}function Pt(C,T){let H=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){He(H,C,T);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+T)}function pt(C,T){let H=n.get(C);if(C.version>0&&H.__version!==C.version){In(H,C,T);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+T)}let Ft={[Ss]:i.REPEAT,[jn]:i.CLAMP_TO_EDGE,[Jr]:i.MIRRORED_REPEAT},Re={[De]:i.NEAREST,[Pc]:i.NEAREST_MIPMAP_NEAREST,[fr]:i.NEAREST_MIPMAP_LINEAR,[We]:i.LINEAR,[_o]:i.LINEAR_MIPMAP_NEAREST,[ti]:i.LINEAR_MIPMAP_LINEAR},Lt={[Xm]:i.NEVER,[Md]:i.ALWAYS,[qm]:i.LESS,[vd]:i.LEQUAL,[Ym]:i.EQUAL,[Sd]:i.GEQUAL,[$m]:i.GREATER,[Km]:i.NOTEQUAL};function te(C,T){if(T.type===wn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===We||T.magFilter===_o||T.magFilter===fr||T.magFilter===ti||T.minFilter===We||T.minFilter===_o||T.minFilter===fr||T.minFilter===ti)&&Et("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,Ft[T.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,Ft[T.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,Ft[T.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Re[T.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Re[T.minFilter]),T.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Lt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===De||T.minFilter!==fr&&T.minFilter!==ti||T.type===wn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function pe(C,T){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,T.addEventListener("dispose",R),P(T));let nt=T.source,J=f.get(nt);J===void 0&&(J={},f.set(nt,J));let rt=Z(T);if(rt!==C.__cacheKey){J[rt]===void 0&&(J[rt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),J[rt].usedTimes++;let ht=J[C.__cacheKey];ht!==void 0&&(J[C.__cacheKey].usedTimes--,ht.usedTimes===0&&W(T)),C.__cacheKey=rt,C.__webglTexture=J[rt].texture}return H}function $t(C,T,H){return Math.floor(Math.floor(C/H)/T)}function sn(C,T,H,nt){let rt=C.updateRanges;if(rt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,T.width,T.height,H,nt,T.data);else{rt.sort((D,j)=>D.start-j.start);let ht=0;for(let D=1;D<rt.length;D++){let j=rt[ht],Y=rt[D],lt=j.start+j.count,st=$t(Y.start,T.width,4),ot=$t(j.start,T.width,4);Y.start<=lt+1&&st===ot&&$t(Y.start+Y.count-1,T.width,4)===st?j.count=Math.max(j.count,Y.start+Y.count-j.start):(++ht,rt[ht]=Y)}rt.length=ht+1;let $=e.getParameter(i.UNPACK_ROW_LENGTH),K=e.getParameter(i.UNPACK_SKIP_PIXELS),at=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,T.width);for(let D=0,j=rt.length;D<j;D++){let Y=rt[D],lt=Math.floor(Y.start/4),st=Math.ceil(Y.count/4),ot=lt%T.width,Rt=Math.floor(lt/T.width),Gt=st,it=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,ot),e.pixelStorei(i.UNPACK_SKIP_ROWS,Rt),e.texSubImage2D(i.TEXTURE_2D,0,ot,Rt,Gt,it,H,nt,T.data)}C.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,$),e.pixelStorei(i.UNPACK_SKIP_PIXELS,K),e.pixelStorei(i.UNPACK_SKIP_ROWS,at)}}function He(C,T,H){let nt=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(nt=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(nt=i.TEXTURE_3D);let J=pe(C,T),rt=T.source;e.bindTexture(nt,C.__webglTexture,i.TEXTURE0+H);let ht=n.get(rt);if(rt.version!==ht.__version||J===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){let it=Wt.getPrimaries(Wt.workingColorSpace),Ct=T.colorSpace===ss?null:Wt.getPrimaries(T.colorSpace),Vt=T.colorSpace===ss||it===Ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt)}e.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment);let K=x(T.image,!1,s.maxTextureSize);K=Nt(T,K);let at=r.convert(T.format,T.colorSpace),D=r.convert(T.type),j=w(T.internalFormat,at,D,T.normalized,T.colorSpace,T.isVideoTexture);te(nt,T);let Y,lt=T.mipmaps,st=T.isVideoTexture!==!0,ot=ht.__version===void 0||J===!0,Rt=rt.dataReady,Gt=b(T,K);if(T.isDepthTexture)j=_(T.format===is,T.type),ot&&(st?e.texStorage2D(i.TEXTURE_2D,1,j,K.width,K.height):e.texImage2D(i.TEXTURE_2D,0,j,K.width,K.height,0,at,D,null));else if(T.isDataTexture)if(lt.length>0){st&&ot&&e.texStorage2D(i.TEXTURE_2D,Gt,j,lt[0].width,lt[0].height);for(let it=0,Ct=lt.length;it<Ct;it++)Y=lt[it],st?Rt&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Y.width,Y.height,at,D,Y.data):e.texImage2D(i.TEXTURE_2D,it,j,Y.width,Y.height,0,at,D,Y.data);T.generateMipmaps=!1}else st?(ot&&e.texStorage2D(i.TEXTURE_2D,Gt,j,K.width,K.height),Rt&&sn(T,K,at,D)):e.texImage2D(i.TEXTURE_2D,0,j,K.width,K.height,0,at,D,K.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){st&&ot&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Gt,j,lt[0].width,lt[0].height,K.depth);for(let it=0,Ct=lt.length;it<Ct;it++)if(Y=lt[it],T.format!==Nn)if(at!==null)if(st){if(Rt)if(T.layerUpdates.size>0){let Vt=Ld(Y.width,Y.height,T.format,T.type);for(let mt of T.layerUpdates){let ce=Y.data.subarray(mt*Vt/Y.data.BYTES_PER_ELEMENT,(mt+1)*Vt/Y.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,mt,Y.width,Y.height,1,at,ce)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Y.width,Y.height,K.depth,at,Y.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,it,j,Y.width,Y.height,K.depth,0,Y.data,0,0);else Et("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else st?Rt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,it,0,0,0,Y.width,Y.height,K.depth,at,D,Y.data):e.texImage3D(i.TEXTURE_2D_ARRAY,it,j,Y.width,Y.height,K.depth,0,at,D,Y.data);T.layerUpdates.size>0&&T.clearLayerUpdates()}else{st&&ot&&e.texStorage2D(i.TEXTURE_2D,Gt,j,lt[0].width,lt[0].height);for(let it=0,Ct=lt.length;it<Ct;it++)Y=lt[it],T.format!==Nn?at!==null?st?Rt&&e.compressedTexSubImage2D(i.TEXTURE_2D,it,0,0,Y.width,Y.height,at,Y.data):e.compressedTexImage2D(i.TEXTURE_2D,it,j,Y.width,Y.height,0,Y.data):Et("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):st?Rt&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,Y.width,Y.height,at,D,Y.data):e.texImage2D(i.TEXTURE_2D,it,j,Y.width,Y.height,0,at,D,Y.data)}else if(T.isDataArrayTexture)if(st){if(ot&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Gt,j,K.width,K.height,K.depth),Rt)if(T.layerUpdates.size>0){let it=Ld(K.width,K.height,T.format,T.type);for(let Ct of T.layerUpdates){let Vt=K.data.subarray(Ct*it/K.data.BYTES_PER_ELEMENT,(Ct+1)*it/K.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ct,K.width,K.height,1,at,D,Vt)}T.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,at,D,K.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,j,K.width,K.height,K.depth,0,at,D,K.data);else if(T.isData3DTexture)st?(ot&&e.texStorage3D(i.TEXTURE_3D,Gt,j,K.width,K.height,K.depth),Rt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,at,D,K.data)):e.texImage3D(i.TEXTURE_3D,0,j,K.width,K.height,K.depth,0,at,D,K.data);else if(T.isFramebufferTexture){if(ot)if(st)e.texStorage2D(i.TEXTURE_2D,Gt,j,K.width,K.height);else{let it=K.width,Ct=K.height;for(let Vt=0;Vt<Gt;Vt++)e.texImage2D(i.TEXTURE_2D,Vt,j,it,Ct,0,at,D,null),it>>=1,Ct>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in i){let it=i.canvas;if(it.hasAttribute("layoutsubtree")||it.setAttribute("layoutsubtree","true"),K.parentNode!==it){it.appendChild(K),d.add(T),it.onpaint=Ct=>{let Vt=Ct.changedElements;for(let mt of d)Vt.includes(mt.image)&&(mt.needsUpdate=!0)},it.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,K);else{let Vt=i.RGBA,mt=i.RGBA,ce=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Vt,mt,ce,K)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(lt.length>0){if(st&&ot){let it=Bt(lt[0]);e.texStorage2D(i.TEXTURE_2D,Gt,j,it.width,it.height)}for(let it=0,Ct=lt.length;it<Ct;it++)Y=lt[it],st?Rt&&e.texSubImage2D(i.TEXTURE_2D,it,0,0,at,D,Y):e.texImage2D(i.TEXTURE_2D,it,j,at,D,Y);T.generateMipmaps=!1}else if(st){if(ot){let it=Bt(K);e.texStorage2D(i.TEXTURE_2D,Gt,j,it.width,it.height)}Rt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,at,D,K)}else e.texImage2D(i.TEXTURE_2D,0,j,at,D,K);S(T)&&T.mipmapsAutoUpdate===!0&&y(nt),ht.__version=rt.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function In(C,T,H){if(T.image.length!==6)return;let nt=pe(C,T),J=T.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+H);let rt=n.get(J);if(J.version!==rt.__version||nt===!0){e.activeTexture(i.TEXTURE0+H);let ht=Wt.getPrimaries(Wt.workingColorSpace),$=T.colorSpace===ss?null:Wt.getPrimaries(T.colorSpace),K=T.colorSpace===ss||ht===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);let at=T.isCompressedTexture||T.image[0].isCompressedTexture,D=T.image[0]&&T.image[0].isDataTexture,j=[];for(let mt=0;mt<6;mt++)!at&&!D?j[mt]=x(T.image[mt],!0,s.maxCubemapSize):j[mt]=D?T.image[mt].image:T.image[mt],j[mt]=Nt(T,j[mt]);let Y=j[0],lt=r.convert(T.format,T.colorSpace),st=r.convert(T.type),ot=w(T.internalFormat,lt,st,T.normalized,T.colorSpace),Rt=T.isVideoTexture!==!0,Gt=rt.__version===void 0||nt===!0,it=J.dataReady,Ct=b(T,Y);te(i.TEXTURE_CUBE_MAP,T);let Vt;if(T.isDepthTexture){if(ot=_(T.format===is,T.type),Gt)if(Rt)e.texStorage2D(i.TEXTURE_CUBE_MAP,1,ot,Y.width,Y.height);else for(let mt=0;mt<6;mt++)e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ot,Y.width,Y.height,0,lt,st,null)}else if(at){Rt&&Gt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,ot,Y.width,Y.height);for(let mt=0;mt<6;mt++){Vt=j[mt].mipmaps;for(let ce=0;ce<Vt.length;ce++){let Je=Vt[ce];T.format!==Nn?lt!==null?Rt?it&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce,0,0,Je.width,Je.height,lt,Je.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce,ot,Je.width,Je.height,0,Je.data):Et("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Rt?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce,0,0,Je.width,Je.height,lt,st,Je.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce,ot,Je.width,Je.height,0,lt,st,Je.data)}}}else{if(Vt=T.mipmaps,Rt&&Gt){Vt.length>0&&Ct++;let mt=Bt(j[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,ot,mt.width,mt.height)}for(let mt=0;mt<6;mt++)if(D){Rt?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,j[mt].width,j[mt].height,lt,st,j[mt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ot,j[mt].width,j[mt].height,0,lt,st,j[mt].data);for(let ce=0;ce<Vt.length;ce++){let fs=Vt[ce].image[mt].image;Rt?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce+1,0,0,fs.width,fs.height,lt,st,fs.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce+1,ot,fs.width,fs.height,0,lt,st,fs.data)}}else{Rt?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,lt,st,j[mt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,ot,lt,st,j[mt]);for(let ce=0;ce<Vt.length;ce++){let Je=Vt[ce];Rt?it&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce+1,0,0,lt,st,Je.image[mt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,ce+1,ot,lt,st,Je.image[mt])}}}S(T)&&T.mipmapsAutoUpdate===!0&&y(i.TEXTURE_CUBE_MAP),rt.__version=J.version,T.onUpdate&&T.onUpdate(T)}C.__version=T.version}function be(C,T,H,nt,J,rt){let ht=r.convert(H.format,H.colorSpace),$=r.convert(H.type),K=w(H.internalFormat,ht,$,H.normalized,H.colorSpace),at=n.get(T),D=n.get(H);if(D.__renderTarget=T,!at.__hasExternalTextures){let j=Math.max(1,T.width>>rt),Y=Math.max(1,T.height>>rt);J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?e.texImage3D(J,rt,K,j,Y,T.depth,0,ht,$,null):e.texImage2D(J,rt,K,j,Y,0,ht,$,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),ft(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,nt,J,D.__webglTexture,0,Me(T)):(J===i.TEXTURE_2D||J>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,nt,J,D.__webglTexture,rt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function xi(C,T,H){if(i.bindRenderbuffer(i.RENDERBUFFER,C),T.depthBuffer){let nt=T.depthTexture,J=nt&&nt.isDepthTexture?nt.type:null,rt=_(T.stencilBuffer,J),ht=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ft(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me(T),rt,T.width,T.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me(T),rt,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,rt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,C)}else{let nt=T.textures;for(let J=0;J<nt.length;J++){let rt=nt[J],ht=r.convert(rt.format,rt.colorSpace),$=r.convert(rt.type),K=w(rt.internalFormat,ht,$,rt.normalized,rt.colorSpace);ft(T)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me(T),K,T.width,T.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me(T),K,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,K,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function je(C,T,H){let nt=T.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let J=n.get(T.depthTexture);J.__renderTarget=T;let rt=nt?T.depthTexture.image[0]:T.depthTexture.image;(!J.__webglTexture||rt.width!==T.width||rt.height!==T.height)&&(rt.width=T.width,rt.height=T.height,T.depthTexture.needsUpdate=!0),nt?pt(T.depthTexture,0):ut(T.depthTexture,0);let ht=J.__webglTexture,$=Me(T),K=nt?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,at=T.depthTexture.format===is?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(T.depthTexture.format===Yi)ft(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,K,ht,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,at,K,ht,0);else if(T.depthTexture.format===is)ft(T)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,K,ht,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,at,K,ht,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function qn(C){let T=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==C.depthTexture){let nt=C.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),nt){let J=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,nt.removeEventListener("dispose",J)};nt.addEventListener("dispose",J),T.__depthDisposeCallback=J}T.__boundDepthTexture=nt}if(C.depthTexture&&!T.__autoAllocateDepthBuffer)if(H)for(let nt=0;nt<6;nt++)je(T.__webglFramebuffer[nt],C,nt);else C.texture.mipmaps.length>0?je(T.__webglFramebuffer[0],C,0):je(T.__webglFramebuffer,C,0);else if(H){T.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[nt]),T.__webglDepthbuffer[nt]===void 0)T.__webglDepthbuffer[nt]=i.createRenderbuffer(),xi(T.__webglDepthbuffer[nt],C,!1);else{let J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=T.__webglDepthbuffer[nt];i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,rt)}}else if(C.texture.mipmaps.length>0?e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=i.createRenderbuffer(),xi(T.__webglDepthbuffer,C,!1);else{let J=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=T.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,rt),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,rt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Yn(C,T,H){let nt=n.get(C);T!==void 0&&be(nt.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&qn(C)}function $n(C){let T=C.texture,H=n.get(C),nt=n.get(T);C.addEventListener("dispose",L),P(C);let J=C.textures,rt=C.isWebGLCubeRenderTarget===!0,ht=J.length>1;if(ht||(nt.__webglTexture===void 0&&(nt.__webglTexture=i.createTexture()),nt.__version=T.version,o.memory.textures++),rt){H.__webglFramebuffer=[];for(let $=0;$<6;$++)if(T.mipmaps.length>0){H.__webglFramebuffer[$]=[];for(let K=0;K<T.mipmaps.length;K++)H.__webglFramebuffer[$][K]=i.createFramebuffer()}else H.__webglFramebuffer[$]=i.createFramebuffer()}else{if(T.mipmaps.length>0){H.__webglFramebuffer=[];for(let $=0;$<T.mipmaps.length;$++)H.__webglFramebuffer[$]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(ht)for(let $=0,K=J.length;$<K;$++){let at=n.get(J[$]);at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&ft(C)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let $=0;$<J.length;$++){let K=J[$];H.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[$]);let at=r.convert(K.format,K.colorSpace),D=r.convert(K.type),j=w(K.internalFormat,at,D,K.normalized,K.colorSpace,C.isXRRenderTarget===!0),Y=Me(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Y,j,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,H.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),xi(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,nt.__webglTexture),te(i.TEXTURE_CUBE_MAP,T);for(let $=0;$<6;$++)if(T.mipmaps.length>0)for(let K=0;K<T.mipmaps.length;K++)be(H.__webglFramebuffer[$][K],C,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,K);else be(H.__webglFramebuffer[$],C,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);S(T)?y(i.TEXTURE_CUBE_MAP):T.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,T.mipmaps.length-1),e.unbindTexture()}else if(ht){for(let $=0,K=J.length;$<K;$++){let at=J[$],D=n.get(at),j=i.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(j=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(j,D.__webglTexture),te(j,at),be(H.__webglFramebuffer,C,at,i.COLOR_ATTACHMENT0+$,j,0),S(at)&&y(j)}e.unbindTexture()}else{let $=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&($=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture($,nt.__webglTexture),te($,T),T.mipmaps.length>0)for(let K=0;K<T.mipmaps.length;K++)be(H.__webglFramebuffer[K],C,T,i.COLOR_ATTACHMENT0,$,K);else be(H.__webglFramebuffer,C,T,i.COLOR_ATTACHMENT0,$,0);S(T)?y($):T.mipmaps.length>0&&i.texParameteri($,i.TEXTURE_MAX_LEVEL,T.mipmaps.length-1),e.unbindTexture()}C.depthBuffer&&qn(C)}function F(C){let T=C.textures;for(let H=0,nt=T.length;H<nt;H++){let J=T[H];if(S(J)&&J.mipmapsAutoUpdate===!0){let rt=M(C),ht=n.get(J).__webglTexture;e.bindTexture(rt,ht),y(rt),e.unbindTexture()}}}let Kn=[];function Se(C){if(C.samples>0){if(ft(C)===!1){let T=C.textures,H=C.width,nt=C.height,J=i.COLOR_BUFFER_BIT,rt=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=n.get(C),$=T.length>1;if($)for(let at=0;at<T.length;at++)e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let at=0;at<T.length;at++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(J|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(J|=i.STENCIL_BUFFER_BIT)),$){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ht.__webglColorRenderbuffer[at]);let D=n.get(T[at]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,D,0)}i.blitFramebuffer(0,0,H,nt,0,0,H,nt,J,i.NEAREST),l===!0&&(Kn.length=0,Kn.push(i.COLOR_ATTACHMENT0+at),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&Kn.push(rt),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Kn))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let at=0;at<T.length;at++){e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.RENDERBUFFER,ht.__webglColorRenderbuffer[at]);let D=n.get(T[at]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.TEXTURE_2D,D,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let T=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[T])}}}function Me(C){return Math.min(s.maxSamples,C.samples)}function ft(C){let T=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Ve(C){let T=o.render.frame;u.get(C)!==T&&(u.set(C,T),C.update())}function Nt(C,T){let H=C.colorSpace,nt=C.format,J=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==En&&H!==ss&&(Wt.getTransfer(H)===ae?(nt!==Nn||J!==On)&&Et("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Dt("WebGLTextures: Unsupported texture color space:",H)),T}function Bt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=Ut,this.resetTextureUnits=Q,this.getTextureUnits=tt,this.setTextureUnits=vt,this.setTexture2D=ut,this.setTexture2DArray=yt,this.setTexture3D=Pt,this.setTextureCube=pt,this.rebindTextures=Yn,this.setupRenderTarget=$n,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=Se,this.setupDepthRenderbuffer=qn,this.setupFrameBufferTexture=be,this.useMultisampledRTT=ft,this.dispose=z}function $M(i,t){function e(n,s=ss){let r,o=Wt.getTransfer(s);if(n===On)return i.UNSIGNED_BYTE;if(n===Lc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Nc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===md)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gd)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===fd)return i.BYTE;if(n===pd)return i.SHORT;if(n===xo)return i.UNSIGNED_SHORT;if(n===Ic)return i.INT;if(n===ei)return i.UNSIGNED_INT;if(n===wn)return i.FLOAT;if(n===ui)return i.HALF_FLOAT;if(n===_d)return i.ALPHA;if(n===xd)return i.RGB;if(n===Nn)return i.RGBA;if(n===Yi)return i.DEPTH_COMPONENT;if(n===is)return i.DEPTH_STENCIL;if(n===Dc)return i.RED;if(n===ka)return i.RED_INTEGER;if(n===Ps)return i.RG;if(n===Uc)return i.RG_INTEGER;if(n===Oc)return i.RGBA_INTEGER;if(n===Ha||n===Va||n===Ga||n===Wa)if(o===ae)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ha)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Va)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ha)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Va)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ga)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Wa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fc||n===Bc||n===zc||n===kc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Fc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===zc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===kc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Hc||n===Vc||n===Gc||n===Wc||n===Xc||n===Xa||n===qc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Hc||n===Vc)return o===ae?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Gc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Wc)return r.COMPRESSED_R11_EAC;if(n===Xc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Xa)return r.COMPRESSED_RG11_EAC;if(n===qc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Yc||n===$c||n===Kc||n===Zc||n===jc||n===Jc||n===Qc||n===tu||n===eu||n===nu||n===iu||n===su||n===ru||n===ou)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Yc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===$c)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Kc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Zc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===jc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Qc)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===tu)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===eu)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===nu)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===iu)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===su)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ru)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ou)return o===ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===au||n===lu||n===cu)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===au)return o===ae?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===lu)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===cu)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===uu||n===hu||n===qa||n===du)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===uu)return r.COMPRESSED_RED_RGTC1_EXT;if(n===hu)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===qa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===du)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===pr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var KM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ZM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,qd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new wa(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ti({vertexShader:KM,fragmentShader:ZM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Jt(new Ea(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Yd=class extends ci{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null,v=typeof XRWebGLBinding<"u",p=new qd,m={},x=e.getContextAttributes(),S=null,y=null,M=[],w=[],_=new xt,b=null,P=null,A=new Ge;A.viewport=new ue;let R=new Ge;R.viewport=new ue;let L=[A,R],O=new wc,N=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ut=M[Z];return ut===void 0&&(ut=new so,M[Z]=ut),ut.getTargetRaySpace()},this.getControllerGrip=function(Z){let ut=M[Z];return ut===void 0&&(ut=new so,M[Z]=ut),ut.getGripSpace()},this.getHand=function(Z){let ut=M[Z];return ut===void 0&&(ut=new so,M[Z]=ut),ut.getHandSpace()};function G(Z){let ut=w.indexOf(Z.inputSource);if(ut===-1)return;let yt=M[ut];yt!==void 0&&(yt.update(Z.inputSource,Z.frame,c||o),yt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function W(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",et);for(let Z=0;Z<M.length;Z++){let ut=w[Z];ut!==null&&(w[Z]=null,M[Z].disconnect(ut))}N=null,z=null,p.reset();for(let Z in m)delete m[Z];if(t.setRenderTarget(S),f=null,h=null,d=null,s=null,y=null,Ut.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(_.width,_.height,!1),P!==null){let Z=P.camera;Z.fov=P.fov,Z.zoom=P.zoom,Z.updateProjectionMatrix(),P=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Et("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&Et("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(S=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",W),s.addEventListener("inputsourceschange",et),x.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let yt=null,Pt=null,pt=null;x.depth&&(pt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,yt=x.stencil?is:Yi,Pt=x.stencil?pr:ei);let Ft={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(Ft),s.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),y=new Hn(h.textureWidth,h.textureHeight,{format:Nn,type:On,depthTexture:new Zi(h.textureWidth,h.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let yt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,yt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Hn(f.framebufferWidth,f.framebufferHeight,{format:Nn,type:On,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ut.setContext(s),Ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function et(Z){for(let ut=0;ut<Z.removed.length;ut++){let yt=Z.removed[ut],Pt=w.indexOf(yt);Pt>=0&&(w[Pt]=null,M[Pt].disconnect(yt))}for(let ut=0;ut<Z.added.length;ut++){let yt=Z.added[ut],Pt=w.indexOf(yt);if(Pt===-1){for(let Ft=0;Ft<M.length;Ft++)if(Ft>=w.length){w.push(yt),Pt=Ft;break}else if(w[Ft]===null){w[Ft]=yt,Pt=Ft;break}if(Pt===-1)break}let pt=M[Pt];pt&&pt.connect(yt)}}function q(Z,ut){ut===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ut.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ut=Z.near,yt=Z.far;p.texture!==null&&(p.depthNear>0&&(ut=p.depthNear),p.depthFar>0&&(yt=p.depthFar)),O.near=R.near=A.near=ut,O.far=R.far=A.far=yt,(N!==O.near||z!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),N=O.near,z=O.far),O.layers.mask=Z.layers.mask|6,A.layers.mask=O.layers.mask&-5,R.layers.mask=O.layers.mask&-3;let Pt=Z.parent,pt=O.cameras;q(O,Pt);for(let Ft=0;Ft<pt.length;Ft++)q(pt[Ft],Pt);O.projectionMatrix.copy(A.projectionMatrix),O.projectionMatrixInverse.copy(A.projectionMatrixInverse),P===null&&Z.isPerspectiveCamera&&(P={camera:Z,fov:Z.fov,zoom:Z.zoom}),Q(Z,O,Pt)};function Q(Z,ut,yt){yt===null?Z.matrix.copy(ut.matrixWorld):(Z.matrix.copy(yt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ut.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ut.projectionMatrix),Z.projectionMatrixInverse.copy(ut.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ir*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Z){l=Z,h!==null&&(h.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(O)},this.getCameraTexture=function(Z){return m[Z]};let tt=null;function vt(Z,ut){if(u=ut.getViewerPose(c||o),g=ut,u!==null){let yt=u.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Pt=!1;yt.length!==O.cameras.length&&(O.cameras.length=0,Pt=!0);for(let Lt=0;Lt<yt.length;Lt++){let te=yt[Lt],pe=null;if(f!==null)pe=f.getViewport(te);else{let sn=d.getViewSubImage(h,te);pe=sn.viewport,Lt===0&&(t.setRenderTargetTextures(y,sn.colorTexture,sn.depthStencilTexture),t.setRenderTarget(y))}let $t=L[Lt];$t===void 0&&($t=new Ge,$t.layers.enable(Lt),$t.viewport=new ue,L[Lt]=$t),$t.matrix.fromArray(te.transform.matrix),$t.matrix.decompose($t.position,$t.quaternion,$t.scale),$t.projectionMatrix.fromArray(te.projectionMatrix),$t.projectionMatrixInverse.copy($t.projectionMatrix).invert(),$t.viewport.set(pe.x,pe.y,pe.width,pe.height),Lt===0&&(O.matrix.copy($t.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pt===!0&&O.cameras.push($t)}let pt=s.enabledFeatures;if(pt&&pt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){d=n.getBinding();let Lt=d.getDepthInformation(yt[0]);Lt&&Lt.isValid&&Lt.texture&&p.init(Lt,s.renderState)}if(pt&&pt.includes("camera-access")&&v){t.state.unbindTexture(),d=n.getBinding();for(let Lt=0;Lt<yt.length;Lt++){let te=yt[Lt].camera;if(te){let pe=m[te];pe||(pe=new wa,m[te]=pe);let $t=d.getCameraImage(te);pe.sourceTexture=$t}}}}for(let yt=0;yt<M.length;yt++){let Pt=w[yt],pt=M[yt];Pt!==null&&pt!==void 0&&pt.update(Pt,ut,c||o)}tt&&tt(Z,ut),ut.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ut}),g=null}let Ut=new Eg;Ut.setAnimationLoop(vt),this.setAnimationLoop=function(Z){tt=Z},this.dispose=function(){}}},jM=new Tt,Og=new Ot;Og.set(-1,0,0,0,1,0,0,0,1);function JM(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Cd(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,x,S,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),d(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),h(p,m),m.isMeshPhysicalMaterial&&f(p,m,y)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,x,S):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===qe&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===qe&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let x=t.get(m),S=x.envMap,y=x.envMapRotation;S&&(p.envMap.value=S,p.envMapRotation.value.setFromMatrix4(jM.makeRotationFromEuler(y)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Og),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,x,S){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=S*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,e(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===qe&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){let x=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function QM(i,t,e,n){let s={},r={};function o(x,S){let y=S.program;n.uniformBlockBinding(x,y,s[x.id])}function a(x,S){let y=s[x.id];y===void 0&&(g(x),y=l(x),s[x.id]=y,x.addEventListener("dispose",p));let M=S.program;n.updateUBOMapping(x,M);let w=t.render.frame;r[x.id]!==w&&(c(x),r[x.id]=w)}function l(x){let S=i.createBuffer(),y=x.__size,M=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,y,M),i.bindBuffer(i.UNIFORM_BUFFER,null),S}function c(x){let S=s[x.id],y=x.uniforms,M=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let w=0,_=y.length;w<_;w++){let b=y[w];if(Array.isArray(b))for(let P=0,A=b.length;P<A;P++)u(b[P],w,P,M);else u(b,w,0,M)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(x,S,y,M){if(h(x,S,y,M)===!0){let w=x.__offset,_=x.value;if(Array.isArray(_)){let b=0;for(let P=0;P<_.length;P++){let A=_[P],R=v(A,!0);d(A,x.__data,b),b+=R.storage/Float32Array.BYTES_PER_ELEMENT}}else d(_,x.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,w,x.__data)}}function d(x,S,y){typeof x=="number"||typeof x=="boolean"?S[y]=x:x.isMatrix3?(S[y]=x.elements[0],S[y+1]=x.elements[1],S[y+2]=x.elements[2],S[y+3]=0,S[y+4]=x.elements[3],S[y+5]=x.elements[4],S[y+6]=x.elements[5],S[y+7]=0,S[y+8]=x.elements[6],S[y+9]=x.elements[7],S[y+10]=x.elements[8],S[y+11]=0):ArrayBuffer.isView(x)?S.set(x.subarray(0,S.length-y),y):x.toArray(S,y)}function h(x,S,y,M){let w=x.value,_=S+"_"+y;if(Array.isArray(w)){M[_]===void 0&&(M[_]=[]);let b=M[_],P=!1;for(let A=0;A<w.length;A++)f(w[A],b,A)===!0&&(P=!0);return P}return f(w,M,_)}function f(x,S,y){if(S[y]===void 0)return typeof x=="number"||typeof x=="boolean"?S[y]=x:ArrayBuffer.isView(x)?S[y]=x.slice():S[y]=x.clone(),!0;{let M=S[y];if(typeof x=="number"||typeof x=="boolean"){if(M!==x)return S[y]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(M.equals(x)===!1)return M.copy(x),!0}}return!1}function g(x){let S=x.uniforms,y=0,M=16;for(let _=0,b=S.length;_<b;_++){let P=Array.isArray(S[_])?S[_]:[S[_]];for(let A=0,R=P.length;A<R;A++){let L=P[A],O=Array.isArray(L.value)?L.value:[L.value],N=Array.isArray(S[_])||Array.isArray(L.value),z=y;for(let W=0,et=O.length;W<et;W++){let q=O[W],Q=v(q,N),tt=y%M,vt=tt%Q.boundary,Ut=tt+vt;y+=vt,Ut!==0&&M-Ut<Q.storage&&(y+=M-Ut),W===0&&(z=y),y+=Q.storage}let G=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new G((y-z)/Float32Array.BYTES_PER_ELEMENT),L.__offset=z}}let w=y%M;return w>0&&(y+=M-w),x.__size=y,x.__cache={},this}function v(x,S){let y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=16,y.storage=48):x.isMatrix4?(y.boundary=16,y.storage=64):x.isTexture?Et("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(y.boundary=16,y.storage=x.byteLength):Et("WebGLRenderer: Unsupported uniform value type.",x),S===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function p(x){let S=x.target;S.removeEventListener("dispose",p),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function m(){for(let x in s)i.deleteBuffer(s[x]);s={},r={}}return{bind:o,update:a,dispose:m}}var tb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ci=null;function eb(){return Ci===null&&(Ci=new qi(tb,16,16,Ps,ui),Ci.name="DFG_LUT",Ci.minFilter=We,Ci.magFilter=We,Ci.wrapS=jn,Ci.wrapT=jn,Ci.generateMipmaps=!1,Ci.needsUpdate=!0),Ci}var gu=class{constructor(t={}){let{canvas:e=Zm(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=On}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let v=f,p=new Set([Oc,Uc,ka]),m=new Set([On,ei,xo,pr,Lc,Nc]),x=new Uint32Array(4),S=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},M=null,w=null,_=[],b=[],P=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,R=!1,L=null,O=null,N=null,z=null;this._outputColorSpace=Ce;let G=0,W=0,et=null,q=-1,Q=null,tt=new ue,vt=new ue,Ut=null,Z=new At(0),ut=0,yt=e.width,Pt=e.height,pt=1,Ft=null,Re=null,Lt=new ue(0,0,yt,Pt),te=new ue(0,0,yt,Pt),pe=!1,$t=new Ki,sn=new va,He=!1,In=!1,be=new Tt,xi=new I,je=new ue,qn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Yn=!1;function $n(){return et===null?pt:1}let F=n;function Kn(E,U){return e.getContext(E,U)}let Se,Me,ft,Ve,Nt,Bt,C,T,H,nt,J,rt,ht,$,K,at,D,j,Y,lt,st,ot,Rt;try{let E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",Ct,!1),e.addEventListener("webglcontextrestored",Vt,!1),e.addEventListener("webglcontextcreationerror",mt,!1),F===null){let U="webgl2";if(F=Kn(U,E),F===null)throw Kn(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Gt()}catch(E){throw e.removeEventListener("webglcontextlost",Ct,!1),e.removeEventListener("webglcontextrestored",Vt,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),Dt("WebGLRenderer: "+E.message),E}function Gt(){Se=new dS(F),Se.init(),st=new $M(F,Se),Me=new eS(F,Se,t,st),ft=new qM(F,Se),Me.reversedDepthBuffer&&h&&ft.buffers.depth.setReversed(!0),O=F.createFramebuffer(),N=F.createFramebuffer(),z=F.createFramebuffer(),Ve=new mS(F),Nt=new LM,Bt=new YM(F,Se,ft,Nt,Me,st,Ve),C=new hS(A),T=new _x(F),ot=new Qv(F,T),H=new fS(F,T,Ve,ot),nt=new _S(F,H,T,ot,Ve),j=new gS(F,Me,Bt),K=new nS(Nt),J=new IM(A,C,Se,Me,ot,K),rt=new JM(A,Nt),ht=new DM,$=new kM(Se),D=new Jv(A,C,ft,nt,g,l),at=new XM(A,nt,Me),Rt=new QM(F,Ve,Me,ft),Y=new tS(F,Se,Ve),lt=new pS(F,Se,Ve),Ve.programs=J.programs,A.capabilities=Me,A.extensions=Se,A.properties=Nt,A.renderLists=ht,A.shadowMap=at,A.state=ft,A.info=Ve}v!==On&&(P=new yS(v,e.width,e.height,a,s,r));let it=new Yd(A,F);this.xr=it,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let E=Se.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=Se.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return pt},this.setPixelRatio=function(E){E!==void 0&&(pt=E,this.setSize(yt,Pt,!1))},this.getSize=function(E){return E.set(yt,Pt)},this.setSize=function(E,U,X=!0){if(it.isPresenting){Et("WebGLRenderer: Can't change size while VR device is presenting.");return}yt=E,Pt=U,e.width=Math.floor(E*pt),e.height=Math.floor(U*pt),X===!0&&(e.style.width=E+"px",e.style.height=U+"px"),P!==null&&P.setSize(e.width,e.height),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(yt*pt,Pt*pt).floor()},this.setDrawingBufferSize=function(E,U,X){yt=E,Pt=U,pt=X,e.width=Math.floor(E*X),e.height=Math.floor(U*X),this.setViewport(0,0,E,U)},this.setEffects=function(E){if(v===On){Dt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let U=0;U<E.length;U++)if(E[U].isOutputPass===!0){Et("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(tt)},this.getViewport=function(E){return E.copy(Lt)},this.setViewport=function(E,U,X,k){E.isVector4?Lt.set(E.x,E.y,E.z,E.w):Lt.set(E,U,X,k),ft.viewport(tt.copy(Lt).multiplyScalar($n()).round())},this.getScissor=function(E){return E.copy(te)},this.setScissor=function(E,U,X,k){E.isVector4?te.set(E.x,E.y,E.z,E.w):te.set(E,U,X,k),ft.scissor(vt.copy(te).multiplyScalar($n()).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(E){ft.setScissorTest(pe=E)},this.setOpaqueSort=function(E){Ft=E},this.setTransparentSort=function(E){Re=E},this.getClearColor=function(E){return E.copy(D.getClearColor())},this.setClearColor=function(){D.setClearColor(...arguments)},this.getClearAlpha=function(){return D.getClearAlpha()},this.setClearAlpha=function(){D.setClearAlpha(...arguments)},this.clear=function(E=!0,U=!0,X=!0){let k=0;if(E){let V=!1;if(et!==null){let dt=et.texture.format;V=p.has(dt)}if(V){let dt=et.texture.type,St=m.has(dt),ct=D.getClearColor(),_t=D.getClearAlpha(),wt=ct.r,Ht=ct.g,Kt=ct.b;St?(x[0]=wt,x[1]=Ht,x[2]=Kt,x[3]=_t,F.clearBufferuiv(F.COLOR,0,x)):(S[0]=wt,S[1]=Ht,S[2]=Kt,S[3]=_t,F.clearBufferiv(F.COLOR,0,S))}else k|=F.COLOR_BUFFER_BIT}U&&(k|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(k|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&F.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),L=E},this.dispose=function(){e.removeEventListener("webglcontextlost",Ct,!1),e.removeEventListener("webglcontextrestored",Vt,!1),e.removeEventListener("webglcontextcreationerror",mt,!1),D.dispose(),ht.dispose(),$.dispose(),Bt.dispose(),Nt.dispose(),C.dispose(),nt.dispose(),H.dispose(),ot.dispose(),Rt.dispose(),J.dispose(),it.dispose(),it.removeEventListener("sessionstart",pp),it.removeEventListener("sessionend",mp),qs.stop()};function Ct(E){E.preventDefault(),fa("WebGLRenderer: Context Lost."),R=!0}function Vt(){fa("WebGLRenderer: Context Restored."),R=!1;let E=Ve.autoReset,U=at.enabled,X=at.autoUpdate,k=at.needsUpdate,V=at.type;Gt(),Ve.autoReset=E,at.enabled=U,at.autoUpdate=X,at.needsUpdate=k,at.type=V}function mt(E){Dt("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function ce(E){let U=E.target;U.removeEventListener("dispose",ce),Je(U)}function Je(E){fs(E),Nt.remove(E)}function fs(E){let U=Nt.get(E).programs;U!==void 0&&(U.forEach(function(X){J.releaseProgram(X)}),E.isShaderMaterial&&J.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,X,k,V,dt){U===null&&(U=qn);let St=V.isMesh&&V.matrixWorld.determinantAffine()<0,ct=i0(E,U,X,k,V);ft.setMaterial(k,St);let _t=X.index,wt=1;if(k.wireframe===!0){if(_t=H.getWireframeAttribute(X),_t===void 0)return;wt=2}let Ht=X.drawRange,Kt=X.attributes.position,Mt=Ht.start*wt,Zt=(Ht.start+Ht.count)*wt;dt!==null&&(Mt=Math.max(Mt,dt.start*wt),Zt=Math.min(Zt,(dt.start+dt.count)*wt)),_t!==null?(Mt=Math.max(Mt,0),Zt=Math.min(Zt,_t.count)):Kt!=null&&(Mt=Math.max(Mt,0),Zt=Math.min(Zt,Kt.count));let Be=Zt-Mt;if(Be<0||Be===1/0)return;ot.setup(V,k,ct,X,_t);let ve,me=Y;if(_t!==null&&(ve=T.get(_t),me=lt,me.setIndex(ve)),V.isMesh)k.wireframe===!0?(ft.setLineWidth(k.wireframeLinewidth*$n()),me.setMode(F.LINES)):me.setMode(F.TRIANGLES);else if(V.isLine){let un=k.linewidth;un===void 0&&(un=1),ft.setLineWidth(un*$n()),V.isLineSegments?me.setMode(F.LINES):V.isLineLoop?me.setMode(F.LINE_LOOP):me.setMode(F.LINE_STRIP)}else V.isPoints?me.setMode(F.POINTS):V.isSprite&&me.setMode(F.TRIANGLES);if(V.isBatchedMesh)if(Se.get("WEBGL_multi_draw"))me.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{let un=V._multiDrawStarts,bt=V._multiDrawCounts,Mn=V._multiDrawCount,ie=_t?T.get(_t).bytesPerElement:1,Ys=Nt.get(k).currentProgram.getUniforms();for(let hn=0;hn<Mn;hn++)Ys.setValue(F,"_gl_DrawID",hn),me.render(un[hn]/ie,bt[hn])}else if(V.isInstancedMesh)me.renderInstances(Mt,Be,V.count);else if(X.isInstancedBufferGeometry){let un=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,bt=Math.min(X.instanceCount,un);me.renderInstances(Mt,Be,bt)}else me.render(Mt,Be)};function fp(E,U,X,k){L!==null&&E.isNodeMaterial&&L.setObject(k,E),He===!0&&K.setState(E,X,!1),E.transparent===!0&&E.side===Ie&&E.forceSinglePass===!1?(E.side=qe,E.needsUpdate=!0,jo(E,U,k),E.side=Vn,E.needsUpdate=!0,jo(E,U,k),E.side=Ie):jo(E,U,k)}this.compile=function(E,U,X=null){X===null&&(X=E),L!==null&&L.renderStart(E,U,X),w=$.get(X),w.init(U),b.push(w),X.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(w.pushLight(V),V.castShadow&&w.pushShadow(V))}),E!==X&&E.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(w.pushLight(V),V.castShadow&&w.pushShadow(V))}),w.setupLights(),L!==null&&L.updateLights(w.state.lightsArray),In=this.localClippingEnabled,He=K.init(this.clippingPlanes,In),He===!0&&K.setGlobalState(this.clippingPlanes,U),L!==null&&at.render(w.state.shadowsArray,X,U);let k=new Set;return E.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;let dt=V.material;if(dt)if(Array.isArray(dt))for(let St=0;St<dt.length;St++){let ct=dt[St];fp(ct,X,U,V),k.add(ct)}else fp(dt,X,U,V),k.add(dt)}),w=b.pop(),L!==null&&L.renderEnd(),k},this.compileAsync=function(E,U,X=null){let k=this.compile(E,U,X);return new Promise(V=>{function dt(){if(k.forEach(function(St){let _t=Nt.get(St).currentProgram;(_t===void 0||_t.isReady())&&k.delete(St)}),k.size===0){V(E);return}setTimeout(dt,10)}Se.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let ch=null;function e0(E){ch&&ch(E)}function pp(){qs.stop()}function mp(){qs.start()}let qs=new Eg;qs.setAnimationLoop(e0),typeof self<"u"&&qs.setContext(self),this.setAnimationLoop=function(E){ch=E,it.setAnimationLoop(E),E===null?qs.stop():qs.start()},it.addEventListener("sessionstart",pp),it.addEventListener("sessionend",mp),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){Dt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;L!==null&&L.renderStart(E,U);let X=it.enabled===!0&&it.isPresenting===!0,k=P!==null&&(et===null||X)&&P.begin(A,et);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),it.enabled===!0&&it.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(it.cameraAutoUpdate===!0&&it.updateCamera(U),U=it.getCamera()),E.isScene===!0&&E.onBeforeRender(A,E,U,et),w=$.get(E,b.length),w.init(U),w.state.textureUnits=Bt.getTextureUnits(),b.push(w),be.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?sn.setFromArrayCamera(U):$t.setFromProjectionMatrix(be,Jn,U.reversedDepth),In=this.localClippingEnabled,He=K.init(this.clippingPlanes,In),M=ht.get(E,_.length),M.init(),_.push(M),this.info.render.frame++,it.enabled===!0&&it.isPresenting===!0){let St=A.xr.getDepthSensingMesh();St!==null&&uh(St,U,-1/0,A.sortObjects)}uh(E,U,0,A.sortObjects),M.finish(),L!==null&&L.updateLights(w.state.lightsArray),A.sortObjects===!0&&M.sort(Ft,Re),Yn=it.enabled===!1||it.isPresenting===!1||it.hasDepthSensing()===!1,Yn&&D.addToRenderList(M,E),this.info.autoReset===!0&&this.info.reset(),He===!0&&K.beginShadows();let V=w.state.shadowsArray;if(at.render(V,E,U),He===!0&&K.endShadows(),(k&&P.hasRenderPass())===!1){let St=M.opaque,ct=M.transmissive;if(w.setupLights(),U.isArrayCamera){let _t=U.cameras;if(ct.length>0)for(let wt=0,Ht=_t.length;wt<Ht;wt++){let Kt=_t[wt];_p(St,ct,E,Kt)}Yn&&D.render(E);for(let wt=0,Ht=_t.length;wt<Ht;wt++){let Kt=_t[wt];gp(M,E,Kt,Kt.viewport)}}else ct.length>0&&_p(St,ct,E,U),Yn&&D.render(E),gp(M,E,U)}et!==null&&W===0&&(Bt.updateMultisampleRenderTarget(et),Bt.updateRenderTargetMipmap(et)),k&&P.end(A),E.isScene===!0&&E.onAfterRender(A,E,U),ot.resetDefaultState(),q=-1,Q=null,b.pop(),b.length>0?(w=b[b.length-1],Bt.setTextureUnits(w.state.textureUnits),He===!0&&K.setGlobalState(A.clippingPlanes,w.state.camera)):w=null,_.pop(),_.length>0?M=_[_.length-1]:M=null,L!==null&&L.renderEnd()};function uh(E,U,X,k){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)w.pushLight(E),E.castShadow&&w.pushShadow(E);else if(E.isSprite){let St=U.isArrayCamera?sn:$t;if(!E.frustumCulled||E.intersectsFrustum(St)){k&&je.setFromMatrixPosition(E.matrixWorld).applyMatrix4(be);let ct=nt.update(E),_t=E.material;_t.visible&&M.push(E,ct,_t,X,je.z,null,U)}}else if(E.isMesh||E.isLine||E.isPoints){let St=U.isArrayCamera?sn:$t;if(!E.frustumCulled||E.intersectsFrustum(St)){let ct=nt.update(E),_t=E.material;if(k&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),je.copy(E.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),je.copy(ct.boundingSphere.center)),je.applyMatrix4(E.matrixWorld).applyMatrix4(be)),Array.isArray(_t)){let wt=ct.groups;for(let Ht=0,Kt=wt.length;Ht<Kt;Ht++){let Mt=wt[Ht],Zt=_t[Mt.materialIndex];Zt&&Zt.visible&&M.push(E,ct,Zt,X,je.z,Mt,U)}}else _t.visible&&M.push(E,ct,_t,X,je.z,null,U)}}}let dt=E.children;for(let St=0,ct=dt.length;St<ct;St++)uh(dt[St],U,X,k)}function gp(E,U,X,k){let{opaque:V,transmissive:dt,transparent:St}=E;w.setupLightsView(X),He===!0&&K.setGlobalState(A.clippingPlanes,X),k&&ft.viewport(tt.copy(k)),V.length>0&&Ml(V,U,X),dt.length>0&&Ml(dt,U,X),St.length>0&&Ml(St,U,X),ft.buffers.depth.setTest(!0),ft.buffers.depth.setMask(!0),ft.buffers.color.setMask(!0),ft.setPolygonOffset(!1)}function _p(E,U,X,k){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[k.id]===void 0){let Mt=Se.has("EXT_color_buffer_half_float")||Se.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[k.id]=new Hn(1,1,{generateMipmaps:!0,type:Mt?ui:On,minFilter:ti,samples:Math.max(4,Me.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Wt.workingColorSpace})}let dt=w.state.transmissionRenderTarget[k.id],St=k.viewport||tt;dt.setSize(St.z*A.transmissionResolutionScale,St.w*A.transmissionResolutionScale);let ct=A.getRenderTarget(),_t=A.getActiveCubeFace(),wt=A.getActiveMipmapLevel();A.setRenderTarget(dt),A.getClearColor(Z),ut=A.getClearAlpha(),ut<1&&A.setClearColor(16777215,.5),A.clear(),Yn&&D.render(X);let Ht=A.toneMapping;A.toneMapping=Ai;let Kt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),w.setupLightsView(k),He===!0&&K.setGlobalState(A.clippingPlanes,k),Ml(E,X,k),Bt.updateMultisampleRenderTarget(dt),Bt.updateRenderTargetMipmap(dt),Se.has("WEBGL_multisampled_render_to_texture")===!1){let Mt=!1;for(let Zt=0,Be=U.length;Zt<Be;Zt++){let ve=U[Zt],{object:me,geometry:un,material:bt,group:Mn}=ve;if(bt.side===Ie&&me.layers.test(k.layers)){let ie=bt.side;bt.side=qe,bt.needsUpdate=!0,xp(me,X,k,un,bt,Mn),bt.side=ie,bt.needsUpdate=!0,Mt=!0}}Mt===!0&&(Bt.updateMultisampleRenderTarget(dt),Bt.updateRenderTargetMipmap(dt))}A.setRenderTarget(ct,_t,wt),A.setClearColor(Z,ut),Kt!==void 0&&(k.viewport=Kt),A.toneMapping=Ht}function Ml(E,U,X){let k=U.isScene===!0?U.overrideMaterial:null;for(let V=0,dt=E.length;V<dt;V++){let St=E[V],{object:ct,geometry:_t,group:wt}=St,Ht=St.material;Ht.allowOverride===!0&&k!==null&&(Ht=k),ct.layers.test(X.layers)&&xp(ct,U,X,_t,Ht,wt)}}function xp(E,U,X,k,V,dt){L!==null&&V.isNodeMaterial&&L.setObject(E,V),E.onBeforeRender(A,U,X,k,V,dt),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),V.onBeforeRender(A,U,X,k,E,dt),V.transparent===!0&&V.side===Ie&&V.forceSinglePass===!1?(V.side=qe,V.needsUpdate=!0,A.renderBufferDirect(X,U,k,V,E,dt),V.side=Vn,V.needsUpdate=!0,A.renderBufferDirect(X,U,k,V,E,dt),V.side=Ie):A.renderBufferDirect(X,U,k,V,E,dt),E.onAfterRender(A,U,X,k,V,dt)}function yp(E){let U=0;for(let X of E)X.texture!==null&&U++;return U}function jo(E,U,X){U.isScene!==!0&&(U=qn);let k=Nt.get(E),V=w.state.lights,dt=w.state.shadowsArray,St=V.state.version,ct=J.getParameters(E,V.state,dt,U,X,w.state.lightProbeGridArray),_t=J.getProgramCacheKey(ct),wt=k.programs;k.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?U.environment:null,k.fog=U.fog;let Ht=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;k.envMap=C.get(E.envMap||k.environment,Ht),k.envMapRotation=k.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,wt===void 0&&(E.addEventListener("dispose",ce),wt=new Map,k.programs=wt,k.programVariants=new Map);let Kt=wt.get(_t);if(Kt!==void 0){if(k.currentProgram===Kt&&k.lightsStateVersion===St)return Sp(E,ct),Kt}else ct.uniforms=J.getUniforms(E),L!==null&&E.isNodeMaterial&&L.build(E,X,ct),E.onBeforeCompile(ct,A),Kt=J.acquireProgram(ct,_t),wt.set(_t,Kt),k.uniforms=ct.uniforms;let Mt=k.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Mt.clippingPlanes=K.uniform),Sp(E,ct),k.needsLights=r0(E),k.lightsStateVersion=St,k.needsLights&&(Mt.ambientLightColor.value=V.state.ambient,Mt.lightProbe.value=V.state.probe,Mt.sunLights.value=V.state.sun,Mt.sunLightShadows.value=V.state.sunShadow,Mt.directionalLights.value=V.state.directional,Mt.directionalLightShadows.value=V.state.directionalShadow,Mt.spotLights.value=V.state.spot,Mt.spotLightShadows.value=V.state.spotShadow,Mt.rectAreaLights.value=V.state.rectArea,Mt.ltc_1.value=V.state.rectAreaLTC1,Mt.ltc_2.value=V.state.rectAreaLTC2,Mt.pointLights.value=V.state.point,Mt.pointLightShadows.value=V.state.pointShadow,Mt.hemisphereLights.value=V.state.hemi,Mt.sunShadowMatrix.value=V.state.sunShadowMatrix,Mt.sunShadowCascade.value=V.state.sunShadowCascade,Mt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Mt.spotLightMatrix.value=V.state.spotLightMatrix,Mt.spotLightMap.value=V.state.spotLightMap,Mt.pointShadowMatrix.value=V.state.pointShadowMatrix),k.numLightProbeGrids=yp(w.state.lightProbeGridArray),k.currentProgram=Kt,k.uniformsList=null,Kt}function n0(E,U,X,k,V){let dt=Nt.get(E),St=dt.currentProgram.id+","+k+","+V,ct=dt.programVariants.get(St);return ct===void 0?(ct=jo(E,U,X),dt.programVariants.set(St,ct)):(dt.currentProgram=ct,dt.uniformsList=null,dt.outputColorSpace=k,dt.toneMapping=V),ct}function vp(E){if(E.uniformsList===null){let U=E.currentProgram.getUniforms();E.uniformsList=vo.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function Sp(E,U){let X=Nt.get(E);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function i0(E,U,X,k,V){U.isScene!==!0&&(U=qn),Bt.resetTextureUnits();let dt=U.fog,St=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?U.environment:null,ct=et===null?A.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Wt.workingColorSpace,_t=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,wt=C.get(k.envMap||St,_t),Ht=k.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Kt=!!X.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Mt=!!X.morphAttributes.position,Zt=!!X.morphAttributes.normal,Be=!!X.morphAttributes.color,ve=Ai;k.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(ve=A.toneMapping);let me=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,un=me!==void 0?me.length:0,bt=Nt.get(k),Mn=w.state.lights;if(He===!0&&(In===!0||E!==Q)){let Te=E===Q&&k.id===q;K.setState(k,E,Te)}let ie=!1,Ys=!1;k.version===bt.__version?bt.needsLights&&bt.lightsStateVersion!==Mn.state.version||V.isBatchedMesh&&bt.batching===!1||!V.isBatchedMesh&&bt.batching===!0||V.isBatchedMesh&&bt.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&bt.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&bt.instancing===!1||!V.isInstancedMesh&&bt.instancing===!0||V.isSkinnedMesh&&bt.skinning===!1||!V.isSkinnedMesh&&bt.skinning===!0||V.isInstancedMesh&&bt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&bt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&bt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&bt.instancingMorph===!1&&V.morphTexture!==null||bt.envMap!==wt||k.fog===!0&&bt.fog!==dt||bt.numClippingPlanes!==void 0&&(bt.numClippingPlanes!==K.numPlanes||bt.numIntersection!==K.numIntersection)||bt.vertexAlphas!==Ht||bt.vertexTangents!==Kt||bt.morphTargets!==Mt||bt.morphNormals!==Zt||bt.morphColors!==Be||bt.morphTargetsCount!==un||bt.numLightProbeGrids!==yp(w.state.lightProbeGridArray)?ie=!0:(bt.outputColorSpace!==ct||bt.toneMapping!==ve)&&(Ys=!0):(ie=!0,bt.__version=k.version);let hn=bt.currentProgram;(ie===!0||Ys===!0)&&(hn=Ys===!0?n0(k,U,V,ct,ve):jo(k,U,V),L&&k.isNodeMaterial&&L.onUpdateProgram(k,hn,bt));let bl=!1,ps=!1,$s=!1,ee=hn.getUniforms(),rn=bt.uniforms;if(ft.useProgram(hn.program)&&(bl=!0,ps=!0,$s=!0),k.id!==q&&(q=k.id,ps=!0),bl||Q!==E){ft.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),ee.setValue(F,"projectionMatrix",E.projectionMatrix),ee.setValue(F,"viewMatrix",E.matrixWorldInverse);let Qe=ee.map.cameraPosition;Qe!==void 0&&Qe.setValue(F,xi.setFromMatrixPosition(E.matrixWorld)),Me.logarithmicDepthBuffer&&ee.setValue(F,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ee.setValue(F,"isOrthographic",E.isOrthographicCamera===!0),Q!==E&&(Q=E,ps=!0,$s=!0)}if(bt.needsLights&&(Mn.state.sunShadowMap.length>0&&ee.setValue(F,"sunShadowMap",Mn.state.sunShadowMap,Bt),Mn.state.directionalShadowMap.length>0&&ee.setValue(F,"directionalShadowMap",Mn.state.directionalShadowMap,Bt),Mn.state.spotShadowMap.length>0&&ee.setValue(F,"spotShadowMap",Mn.state.spotShadowMap,Bt),Mn.state.pointShadowMap.length>0&&ee.setValue(F,"pointShadowMap",Mn.state.pointShadowMap,Bt)),V.isSkinnedMesh){ee.setOptional(F,V,"bindMatrix"),ee.setOptional(F,V,"bindMatrixInverse");let Te=V.skeleton;Te&&(Te.boneTexture===null&&Te.computeBoneTexture(),ee.setValue(F,"boneTexture",Te.boneTexture,Bt))}V.isBatchedMesh&&(ee.setOptional(F,V,"batchingTexture"),ee.setValue(F,"batchingTexture",V._matricesTexture,Bt),ee.setOptional(F,V,"batchingIdTexture"),ee.setValue(F,"batchingIdTexture",V._indirectTexture,Bt),ee.setOptional(F,V,"batchingColorTexture"),V._colorsTexture!==null&&ee.setValue(F,"batchingColorTexture",V._colorsTexture,Bt));let ri=X.morphAttributes;if((ri.position!==void 0||ri.normal!==void 0||ri.color!==void 0)&&j.update(V,X,hn),(ps||bt.receiveShadow!==V.receiveShadow)&&(bt.receiveShadow=V.receiveShadow,ee.setValue(F,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&U.environment!==null&&(rn.envMapIntensity.value=U.environmentIntensity),rn.dfgLUT!==void 0&&(rn.dfgLUT.value=eb()),ps){if(ee.setValue(F,"toneMappingExposure",A.toneMappingExposure),bt.needsLights&&s0(rn,$s),dt&&k.fog===!0&&rt.refreshFogUniforms(rn,dt),rt.refreshMaterialUniforms(rn,k,pt,Pt,w.state.transmissionRenderTarget[E.id]),bt.needsLights&&bt.numLightProbeGrids>0){let Te=y,Qe=0;for(let Bi of w.state.lightProbeGridArray)Bi.texture!==null&&(Te.textures[Qe]=Bi.texture,Te.min[Qe]=Bi.boundingBox.min,Te.max[Qe]=Bi.boundingBox.max,Te.resolution[Qe]=Bi.resolution,Qe++);for(let Bi in Te)Te[Bi].length=Qe;rn.probesSH.value=Te.textures,rn.probesMin.value=Te.min,rn.probesMax.value=Te.max,rn.probesResolution.value=Te.resolution}vo.upload(F,vp(bt),rn,Bt)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(vo.upload(F,vp(bt),rn,Bt),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ee.setValue(F,"center",V.center),ee.setValue(F,"modelViewMatrix",V.modelViewMatrix),ee.setValue(F,"normalMatrix",V.normalMatrix),ee.setValue(F,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){let Te=k.uniformsGroups;for(let Qe=0,Bi=Te.length;Qe<Bi;Qe++){let bp=Te[Qe];Rt.update(bp,hn),Rt.bind(bp,hn)}}return hn}function s0(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.sunLights.needsUpdate=U,E.sunLightShadows.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function r0(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return et},this.setRenderTargetTextures=function(E,U,X){let k=Nt.get(E);k.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),Nt.get(E.texture).__webglTexture=U,Nt.get(E.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:X,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,U){let X=Nt.get(E);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(E,U=0,X=0){et=E,G=U,W=X;let k=null,V=!1,dt=!1;if(E){let ct=Nt.get(E);if(ct.__useDefaultFramebuffer!==void 0){ft.bindFramebuffer(F.FRAMEBUFFER,ct.__webglFramebuffer),tt.copy(E.viewport),vt.copy(E.scissor),Ut=E.scissorTest,ft.viewport(tt),ft.scissor(vt),ft.setScissorTest(Ut),q=-1;return}else if(ct.__webglFramebuffer===void 0)Bt.setupRenderTarget(E);else if(ct.__hasExternalTextures)Bt.rebindTextures(E,Nt.get(E.texture).__webglTexture,Nt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Ht=E.depthTexture;if(ct.__boundDepthTexture!==Ht){if(Ht!==null&&Nt.has(Ht)&&(E.width!==Ht.image.width||E.height!==Ht.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Bt.setupDepthRenderbuffer(E)}}let _t=E.texture;(_t.isData3DTexture||_t.isDataArrayTexture||_t.isCompressedArrayTexture)&&(dt=!0);let wt=Nt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(wt[U])?k=wt[U][X]:k=wt[U],V=!0):E.samples>0&&Bt.useMultisampledRTT(E)===!1?k=Nt.get(E).__webglMultisampledFramebuffer:Array.isArray(wt)?k=wt[X]:k=wt,tt.copy(E.viewport),vt.copy(E.scissor),Ut=E.scissorTest}else tt.copy(Lt).multiplyScalar(pt).floor(),vt.copy(te).multiplyScalar(pt).floor(),Ut=pe;if(X!==0&&(k=O),ft.bindFramebuffer(F.FRAMEBUFFER,k)&&ft.drawBuffers(E,k),ft.viewport(tt),ft.scissor(vt),ft.setScissorTest(Ut),V){let ct=Nt.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+U,ct.__webglTexture,X)}else if(dt){let ct=U;for(let _t=0;_t<E.textures.length;_t++){let wt=Nt.get(E.textures[_t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+_t,wt.__webglTexture,X,ct)}}else if(E!==null&&X!==0){let ct=Nt.get(E.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ct.__webglTexture,X)}q=-1};function Mp(E){let U=Nt.get(E);return(U.__readFormat!==E.format||U.__readType!==E.type)&&(U.__readFormat=E.format,U.__readType=E.type,U.__formatReadable=Me.textureFormatReadable(E.format),U.__typeReadable=Me.textureTypeReadable(E.type)),U}this.readRenderTargetPixels=function(E,U,X,k,V,dt,St,ct=0){if(!(E&&E.isWebGLRenderTarget)){Dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=Nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&St!==void 0&&(_t=_t[St],Array.isArray(_t)&&(_t=_t[0])),_t){ft.bindFramebuffer(F.FRAMEBUFFER,_t);try{let wt=E.textures[ct],Ht=wt.format,Kt=wt.type;E.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ct);let Mt=Mp(wt);if(Mt.__formatReadable===!1){Dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Mt.__typeReadable===!1){Dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-k&&X>=0&&X<=E.height-V&&F.readPixels(U,X,k,V,st.convert(Ht),st.convert(Kt),dt)}finally{let wt=et!==null?Nt.get(et).__webglFramebuffer:null;ft.bindFramebuffer(F.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(E,U,X,k,V,dt,St,ct=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=Nt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&St!==void 0&&(_t=_t[St],Array.isArray(_t)&&(_t=_t[0])),_t)if(U>=0&&U<=E.width-k&&X>=0&&X<=E.height-V){ft.bindFramebuffer(F.FRAMEBUFFER,_t);let wt=E.textures[ct],Ht=wt.format,Kt=wt.type;E.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+ct);let Mt=Mp(wt);if(Mt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Mt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Zt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Zt),F.bufferData(F.PIXEL_PACK_BUFFER,dt.byteLength,F.STREAM_READ),F.readPixels(U,X,k,V,st.convert(Ht),st.convert(Kt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let Be=et!==null?Nt.get(et).__webglFramebuffer:null;ft.bindFramebuffer(F.FRAMEBUFFER,Be);let ve=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Jm(F,ve,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Zt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,dt),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(Zt),F.deleteSync(ve),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,U=null,X=0){let k=Math.pow(2,-X),V=Math.floor(E.image.width*k),dt=Math.floor(E.image.height*k),St=U!==null?U.x:0,ct=U!==null?U.y:0;Bt.setTexture2D(E,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,St,ct,V,dt),ft.unbindTexture()},this.copyTextureToTexture=function(E,U,X=null,k=null,V=0,dt=0){let St,ct,_t,wt,Ht,Kt,Mt,Zt,Be,ve=E.isCompressedTexture?E.mipmaps[dt]:E.image;if(X!==null)St=X.max.x-X.min.x,ct=X.max.y-X.min.y,_t=X.isBox3?X.max.z-X.min.z:1,wt=X.min.x,Ht=X.min.y,Kt=X.isBox3?X.min.z:0;else{let ee=Math.pow(2,-V);St=Math.floor(ve.width*ee),ct=Math.floor(ve.height*ee),E.isDataArrayTexture?_t=ve.depth:E.isData3DTexture?_t=Math.floor(ve.depth*ee):_t=1,wt=0,Ht=0,Kt=0}k!==null?(Mt=k.x,Zt=k.y,Be=k.z):(Mt=0,Zt=0,Be=0);let me=st.convert(U.format),un=st.convert(U.type),bt;U.isData3DTexture?(Bt.setTexture3D(U,0),bt=F.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Bt.setTexture2DArray(U,0),bt=F.TEXTURE_2D_ARRAY):(Bt.setTexture2D(U,0),bt=F.TEXTURE_2D),ft.activeTexture(F.TEXTURE0),ft.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,U.flipY),ft.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),ft.pixelStorei(F.UNPACK_ALIGNMENT,U.unpackAlignment);let Mn=ft.getParameter(F.UNPACK_ROW_LENGTH),ie=ft.getParameter(F.UNPACK_IMAGE_HEIGHT),Ys=ft.getParameter(F.UNPACK_SKIP_PIXELS),hn=ft.getParameter(F.UNPACK_SKIP_ROWS),bl=ft.getParameter(F.UNPACK_SKIP_IMAGES);ft.pixelStorei(F.UNPACK_ROW_LENGTH,ve.width),ft.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ve.height),ft.pixelStorei(F.UNPACK_SKIP_PIXELS,wt),ft.pixelStorei(F.UNPACK_SKIP_ROWS,Ht),ft.pixelStorei(F.UNPACK_SKIP_IMAGES,Kt);let ps=E.isDataArrayTexture||E.isData3DTexture,$s=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){let ee=Nt.get(E),rn=Nt.get(U),ri=Nt.get(ee.__renderTarget),Te=Nt.get(rn.__renderTarget);ft.bindFramebuffer(F.READ_FRAMEBUFFER,ri.__webglFramebuffer),ft.bindFramebuffer(F.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let Qe=0;Qe<_t;Qe++)ps&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Nt.get(E).__webglTexture,V,Kt+Qe),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Nt.get(U).__webglTexture,dt,Be+Qe)),F.blitFramebuffer(wt,Ht,wt+St,Ht+ct,Mt,Zt,Mt+St,Zt+ct,F.DEPTH_BUFFER_BIT,F.NEAREST);ft.bindFramebuffer(F.READ_FRAMEBUFFER,null),ft.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(V!==0||E.isRenderTargetTexture||Nt.has(E)){let ee=Nt.get(E),rn=Nt.get(U);ft.bindFramebuffer(F.READ_FRAMEBUFFER,N),ft.bindFramebuffer(F.DRAW_FRAMEBUFFER,z);for(let ri=0;ri<_t;ri++)ps?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ee.__webglTexture,V,Kt+ri):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ee.__webglTexture,V),$s?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,rn.__webglTexture,dt,Be+ri):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,rn.__webglTexture,dt),V!==0?F.blitFramebuffer(wt,Ht,wt+St,Ht+ct,Mt,Zt,Mt+St,Zt+ct,F.COLOR_BUFFER_BIT,F.NEAREST):$s?F.copyTexSubImage3D(bt,dt,Mt,Zt,Be+ri,wt,Ht,St,ct):F.copyTexSubImage2D(bt,dt,Mt,Zt,wt,Ht,St,ct);ft.bindFramebuffer(F.READ_FRAMEBUFFER,null),ft.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else $s?E.isDataTexture||E.isData3DTexture?F.texSubImage3D(bt,dt,Mt,Zt,Be,St,ct,_t,me,un,ve.data):U.isCompressedArrayTexture?F.compressedTexSubImage3D(bt,dt,Mt,Zt,Be,St,ct,_t,me,ve.data):F.texSubImage3D(bt,dt,Mt,Zt,Be,St,ct,_t,me,un,ve):E.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,dt,Mt,Zt,St,ct,me,un,ve.data):E.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,dt,Mt,Zt,ve.width,ve.height,me,ve.data):F.texSubImage2D(F.TEXTURE_2D,dt,Mt,Zt,St,ct,me,un,ve);ft.pixelStorei(F.UNPACK_ROW_LENGTH,Mn),ft.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ie),ft.pixelStorei(F.UNPACK_SKIP_PIXELS,Ys),ft.pixelStorei(F.UNPACK_SKIP_ROWS,hn),ft.pixelStorei(F.UNPACK_SKIP_IMAGES,bl),dt===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&F.generateMipmap(bt),ft.unbindTexture()},this.initRenderTarget=function(E){Nt.get(E).__webglFramebuffer===void 0&&Bt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Bt.setTextureCube(E,0):E.isData3DTexture?Bt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Bt.setTexture2DArray(E,0):Bt.setTexture2D(E,0),ft.unbindTexture()},this.resetState=function(){G=0,W=0,et=null,ft.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}};var Fg={type:"change"},Kd={type:"start"},zg={type:"end"},yu=new Qn,Bg=new on,ib=Math.cos(70*Is.DEG2RAD),Ke=new I,Fn=2*Math.PI,se={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},$d=1e-6,vu=class extends Fa{constructor(t,e=null){super(t,e),this.state=se.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Rs.ROTATE,MIDDLE:Rs.DOLLY,RIGHT:Rs.PAN},this.touches={ONE:Cs.ROTATE,TWO:Cs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new mn,this._lastTargetPosition=new I,this._quat=new mn().setFromUnitVectors(t.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new fo,this._sphericalDelta=new fo,this._scale=1,this._panOffset=new I,this._rotateStart=new xt,this._rotateEnd=new xt,this._rotateDelta=new xt,this._panStart=new xt,this._panEnd=new xt,this._panDelta=new xt,this._dollyStart=new xt,this._dollyEnd=new xt,this._dollyDelta=new xt,this._dollyDirection=new I,this._mouse=new xt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=rb.bind(this),this._onPointerDown=sb.bind(this),this._onPointerUp=ob.bind(this),this._onContextMenu=fb.bind(this),this._onMouseWheel=cb.bind(this),this._onKeyDown=ub.bind(this),this._onTouchStart=hb.bind(this),this._onTouchMove=db.bind(this),this._onMouseDown=ab.bind(this),this._onMouseMove=lb.bind(this),this._interceptControlDown=pb.bind(this),this._interceptControlUp=mb.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=se.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Fg),this.update(),this.state=se.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;Ke.copy(e).sub(this.target),Ke.applyQuaternion(this._quat),this._spherical.setFromVector3(Ke),this.autoRotate&&this.state===se.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Fn:n>Math.PI&&(n-=Fn),s<-Math.PI?s+=Fn:s>Math.PI&&(s-=Fn),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ke.setFromSpherical(this._spherical),Ke.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ke),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Ke.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new I(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Ke.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(yu.origin.copy(this.object.position),yu.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(yu.direction))<ib?this.object.lookAt(this.target):(Bg.setFromNormalAndCoplanarPoint(this.object.up,this.target),yu.intersectPlane(Bg,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>$d||8*(1-this._lastQuaternion.dot(this.object.quaternion))>$d||this._lastTargetPosition.distanceToSquared(this.target)>$d?(this.dispatchEvent(Fg),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Fn/60*this.autoRotateSpeed*t:Fn/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ke.setFromMatrixColumn(e,0),Ke.multiplyScalar(-t),this._panOffset.add(Ke)}_panUp(t,e){this.screenSpacePanning===!0?Ke.setFromMatrixColumn(e,1):(Ke.setFromMatrixColumn(e,0),Ke.crossVectors(this.object.up,Ke)),Ke.multiplyScalar(t),this._panOffset.add(Ke)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Ke.copy(s).sub(this.target);let r=Ke.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientY),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/e.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new xt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function sb(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function rb(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ob(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(zg),this.state=se.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function ab(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Rs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=se.DOLLY;break;case Rs.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=se.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=se.ROTATE}break;case Rs.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=se.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=se.PAN}break;default:this.state=se.NONE}this.state!==se.NONE&&this.dispatchEvent(Kd)}function lb(i){switch(this.state){case se.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case se.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case se.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function cb(i){this.enabled===!1||this.enableZoom===!1||this.state!==se.NONE||(i.preventDefault(),this.dispatchEvent(Kd),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(zg))}function ub(i){this.enabled!==!1&&this._handleKeyDown(i)}function hb(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Cs.ROTATE:if(this.enableRotate===!1){this.state=se.NONE;break}this._handleTouchStartRotate(i),this.state=se.TOUCH_ROTATE;break;case Cs.PAN:if(this.enablePan===!1){this.state=se.NONE;break}this._handleTouchStartPan(i),this.state=se.TOUCH_PAN;break;default:this.state=se.NONE}break;case 2:switch(this.touches.TWO){case Cs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=se.TOUCH_DOLLY_PAN;break;case Cs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=se.TOUCH_DOLLY_ROTATE;break;default:this.state=se.NONE}break;default:this.state=se.NONE}this.state!==se.NONE&&this.dispatchEvent(Kd)}function db(i){switch(this._trackPointer(i),this.state){case se.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case se.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case se.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case se.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=se.NONE}}function fb(i){this.enabled!==!1&&i.preventDefault()}function pb(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function mb(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Zd(i,t){if(t===yd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(t===yo||t===Ya){let e=i.getIndex();if(e===null){let r=[],o=i.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);i.setIndex(r),e=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=e.count-2,s=[];if(t===yo)for(let r=1;r<=n;r++)s.push(e.getX(0)),s.push(e.getX(r)),s.push(e.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(e.getX(r)),s.push(e.getX(r+1)),s.push(e.getX(r+2))):(s.push(e.getX(r+2)),s.push(e.getX(r+1)),s.push(e.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",t),i}function kg(i){let t=new Map,e=new Map,n=i.clone();return Hg(i,n,function(s,r){t.set(r,s),e.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=t.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(l){return e.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Hg(i,t,e){e(i,t);for(let n=0;n<i.children.length;n++)Hg(i.children[n],t.children[n],e)}var Su=class extends Ei{constructor(t){super(t),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(e){return new sf(e)}),this.register(function(e){return new rf(e)}),this.register(function(e){return new of(e)}),this.register(function(e){return new mf(e)}),this.register(function(e){return new gf(e)}),this.register(function(e){return new _f(e)}),this.register(function(e){return new lf(e)}),this.register(function(e){return new cf(e)}),this.register(function(e){return new uf(e)}),this.register(function(e){return new hf(e)}),this.register(function(e){return new nf(e)}),this.register(function(e){return new df(e)}),this.register(function(e){return new af(e)}),this.register(function(e){return new pf(e)}),this.register(function(e){return new ff(e)}),this.register(function(e){return new tf(e)}),this.register(function(e){return new Mu(e,qt.EXT_MESHOPT_COMPRESSION)}),this.register(function(e){return new Mu(e,qt.KHR_MESHOPT_COMPRESSION)}),this.register(function(e){return new xf(e)})}load(t,e,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=ns.extractUrlBase(t);o=ns.resolveURL(c,this.path)}else o=ns.extractUrlBase(t);this.manager.itemStart(t);let a=function(c){s?s(c):console.error(c),r.manager.itemError(t),r.manager.itemEnd(t)},l=new co(this.manager);l.setPriority(this.priority),l.setCache(this.cache),l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(t,function(c){try{r.parse(c,o,function(u){e(u),r.manager.itemEnd(t)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(t){return this.dracoLoader=t,this}setKTX2Loader(t){return this.ktx2Loader=t,this}setMeshoptDecoder(t){return this.meshoptDecoder=t,this}register(t){return this.pluginCallbacks.indexOf(t)===-1&&this.pluginCallbacks.push(t),this}unregister(t){return this.pluginCallbacks.indexOf(t)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(t),1),this}parse(t,e,n,s){let r,o={},a={},l=new TextDecoder;if(typeof t=="string")r=JSON.parse(t);else if(t instanceof ArrayBuffer)if(l.decode(new Uint8Array(t,0,4))===qg){try{o[qt.KHR_BINARY_GLTF]=new yf(t)}catch(d){s&&s(d);return}r=JSON.parse(o[qt.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(t));else r=t;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Ef(r,{path:e||this.resourcePath||"",crossOrigin:this.crossOrigin,priority:this.priority,cache:this.cache,withCredentials:this.withCredentials,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case qt.KHR_MATERIALS_UNLIT:o[d]=new ef;break;case qt.KHR_DRACO_MESH_COMPRESSION:o[d]=new vf(r,this.dracoLoader);break;case qt.KHR_TEXTURE_TRANSFORM:o[d]=new Sf;break;case qt.KHR_MESH_QUANTIZATION:o[d]=new Mf;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(t,e){let n=this;return new Promise(function(s,r){n.parse(t,e,s,r)})}};function gb(){let i={};return{get:function(t){return i[t]},add:function(t,e){i[t]=e},remove:function(t){delete i[t]},removeAll:function(){i={}}}}function Ee(i,t,e){let n=i.json.materials[t];return n.extensions&&n.extensions[e]?n.extensions[e]:null}var qt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DIFFUSE_ROUGHNESS:"KHR_materials_diffuse_roughness",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},tf=class{constructor(t){this.parser=t,this.name=qt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let t=this.parser,e=this.parser.json.nodes||[];for(let n=0,s=e.length;n<s;n++){let r=e[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&t._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(t){let e=this.parser,n="light:"+t,s=e.cache.get(n);if(s)return s;let r=e.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[t],c,u=new At(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],En);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new es(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new lr(u),c.distance=d;break;case"spot":c=new Da(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Ii(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=e.createUniqueName(l.name||"light_"+t),s=Promise.resolve(c),e.cache.add(n,s),s}getDependency(t,e){if(t==="light")return this._loadLight(e)}createNodeAttachment(t){let e=this,n=this.parser,r=n.json.nodes[t],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(e.cache,a,l)})}},ef=class{constructor(){this.name=qt.KHR_MATERIALS_UNLIT}getMaterialType(){return Dn}extendParams(t,e,n){let s=[];t.color=new At(1,1,1),t.opacity=1;let r=e.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;t.color.setRGB(o[0],o[1],o[2],En),t.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(t,"map",r.baseColorTexture,Ce))}return Promise.all(s)}},nf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);return n===null||n.emissiveStrength!==void 0&&(e.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},sf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_CLEARCOAT}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(e.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(e,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(e.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(e,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(e,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;e.clearcoatNormalScale=new xt(r,r)}return Promise.all(s)}},rf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_DIFFUSE_ROUGHNESS}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];return e.diffuseRoughness=n.diffuseRoughnessFactor!==void 0?n.diffuseRoughnessFactor:0,n.diffuseRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(e,"diffuseRoughnessMap",n.diffuseRoughnessTexture)),Promise.all(s)}},of=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_DISPERSION}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);return n===null||(e.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},af=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(e.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(e,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(e.iridescenceIOR=n.iridescenceIor),n.iridescenceThicknessMinimum!==void 0&&(e.iridescenceThicknessMinimum=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(e.iridescenceThicknessMaximum=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(e,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},lf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_SHEEN}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];if(e.sheenColor=new At(0,0,0),e.sheenRoughness=0,e.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;e.sheenColor.setRGB(r[0],r[1],r[2],En)}return n.sheenRoughnessFactor!==void 0&&(e.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(e,"sheenColorMap",n.sheenColorTexture,Ce)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(e,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},cf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_TRANSMISSION}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(e.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(e,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},uf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_VOLUME}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];e.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(e,"thicknessMap",n.thicknessTexture)),e.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return e.attenuationColor=new At().setRGB(r[0],r[1],r[2],En),Promise.all(s)}},hf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_IOR}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);return n===null||(e.ior=n.ior!==void 0?n.ior:1.5,e.ior===0&&(e.ior=1e3)),Promise.resolve()}},df=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_SPECULAR}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];e.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(e,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return e.specularColor=new At().setRGB(r[0],r[1],r[2],En),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(e,"specularColorMap",n.specularColorTexture,Ce)),Promise.all(s)}},ff=class{constructor(t){this.parser=t,this.name=qt.EXT_MATERIALS_BUMP}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];return e.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(e,"bumpMap",n.bumpTexture)),Promise.all(s)}},pf=class{constructor(t){this.parser=t,this.name=qt.KHR_MATERIALS_ANISOTROPY}getMaterialType(t){return Ee(this.parser,t,this.name)!==null?An:null}extendMaterialParams(t,e){let n=Ee(this.parser,t,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(e.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(e.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(e,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},mf=class{constructor(t){this.parser=t,this.name=qt.KHR_TEXTURE_BASISU}loadTexture(t){let e=this.parser,n=e.json,s=n.textures[t];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=e.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return e.loadTextureImage(t,r.source,o)}},gf=class{constructor(t){this.parser=t,this.name=qt.EXT_TEXTURE_WEBP}loadTexture(t){let e=this.name,n=this.parser,s=n.json,r=s.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(t,o.source,l)}},_f=class{constructor(t){this.parser=t,this.name=qt.EXT_TEXTURE_AVIF}loadTexture(t){let e=this.name,n=this.parser,s=n.json,r=s.textures[t];if(!r.extensions||!r.extensions[e])return null;let o=r.extensions[e],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(t,o.source,l)}},Mu=class{constructor(t,e){this.name=e,this.parser=t}loadBufferView(t){let e=this.parser.json,n=e.bufferViews[t];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(e.extensionsRequired&&e.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}},xf=class{constructor(t){this.name=qt.EXT_MESH_GPU_INSTANCING,this.parser=t}createNodeMesh(t){let e=this.parser.json,n=e.nodes[t];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=e.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==ni.TRIANGLES&&c.mode!==ni.TRIANGLE_STRIP&&c.mode!==ni.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(t)),Promise.all(a).then(c=>{let u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,f=[];for(let g of d){let v=new Tt,p=new I,m=new mn,x=new I(1,1,1),S=new or(g.geometry,g.material,h);for(let M=0;M<h;M++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,M),l.SCALE&&x.fromBufferAttribute(l.SCALE,M),S.setMatrixAt(M,v.compose(p,m,x));let y=null;for(let M in l)if(M==="_COLOR_0"){let w=l[M];S.instanceColor=new $i(w.array,w.itemSize,w.normalized)}else if(M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"){if(y===null){let _=S.geometry;y=new Ue,y.name=_.name;for(let b in _.attributes)y.setAttribute(b,_.attributes[b]);for(let b in _.morphAttributes)y.morphAttributes[b]=_.morphAttributes[b];_.index!==null&&y.setIndex(_.index),y.morphTargetsRelative=_.morphTargetsRelative;for(let b of _.groups)y.addGroup(b.start,b.count,b.materialIndex);_.boundingBox!==null&&(y.boundingBox=_.boundingBox.clone()),_.boundingSphere!==null&&(y.boundingSphere=_.boundingSphere.clone()),y.drawRange.start=_.drawRange.start,y.drawRange.count=_.drawRange.count,y.userData=Object.assign({},_.userData),S.geometry=y}let w=l[M];y.setAttribute(M,new $i(w.array,w.itemSize,w.normalized))}_e.prototype.copy.call(S,g),this.parser.assignFinalMaterial(S),f.push(S)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},qg="glTF",Qa=12,Vg={JSON:1313821514,BIN:5130562},yf=class{constructor(t){this.name=qt.KHR_BINARY_GLTF,this.content=null,this.body=null;let e=new DataView(t,0,Qa),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(t.slice(0,4))),version:e.getUint32(4,!0),length:e.getUint32(8,!0)},this.header.magic!==qg)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Qa,r=new DataView(t,Qa),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===Vg.JSON){let c=new Uint8Array(t,Qa+o,a);this.content=n.decode(c)}else if(l===Vg.BIN){let c=Qa+o;this.body=t.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},vf=class{constructor(t,e){if(!e)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=qt.KHR_DRACO_MESH_COMPRESSION,this.json=t,this.dracoLoader=e,this.dracoLoader.preload()}decodePrimitive(t,e){let n=this.json,s=this.dracoLoader,r=t.extensions[this.name].bufferView,o=t.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let d=Tf[u]||u.toLowerCase();a[d]=o[u]}for(let u in t.attributes){let d=Tf[u]||u.toLowerCase();if(o[u]!==void 0){let h=n.accessors[t.attributes[u]],f=To[h.componentType];c[d]=f.name,l[d]=h.normalized===!0}}return e.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(let g in f.attributes){let v=f.attributes[g],p=l[g];p!==void 0&&(v.normalized=p)}d(f)},a,c,En,h)})})}},Sf=class{constructor(){this.name=qt.KHR_TEXTURE_TRANSFORM}extendTexture(t,e){if((e.texCoord===void 0||e.texCoord===t.channel)&&e.offset===void 0&&e.rotation===void 0&&e.scale===void 0)return t;if(t=t.clone(),e.texCoord!==void 0&&(t.channel=e.texCoord),e.offset!==void 0&&t.offset.fromArray(e.offset),e.rotation!==void 0&&(t.rotation=e.rotation),e.scale!==void 0&&t.repeat.fromArray(e.scale),e.rotation!==void 0){let n=Math.cos(t.rotation),s=Math.sin(t.rotation);t.matrix.set(t.repeat.x*n,t.repeat.y*s,t.offset.x,-t.repeat.x*s,t.repeat.y*n,t.offset.y,0,0,1),t.matrixAutoUpdate=!1}return t.needsUpdate=!0,t}},Mf=class{constructor(){this.name=qt.KHR_MESH_QUANTIZATION}},bu=class extends wi{constructor(t,e,n,s){super(t,e,n,s)}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s*3+s;for(let o=0;o!==s;o++)e[o]=n[r+o];return e}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-e,d=(n-e)/u,h=d*d,f=h*d,g=t*c,v=g-c,p=-2*f+3*h,m=f-h,x=1-p,S=m-h+d;for(let y=0;y!==a;y++){let M=o[v+y+a],w=o[v+y+l]*u,_=o[g+y+a],b=o[g+y]*u;r[y]=x*M+S*w+p*_+m*b}return r}},_b=new mn,bf=class extends bu{interpolate_(t,e,n,s){let r=super.interpolate_(t,e,n,s);return _b.fromArray(r).normalize().toArray(r),r}},ni={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},To={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Gg={9728:De,9729:We,9984:Pc,9985:_o,9986:fr,9987:ti},Wg={33071:jn,33648:Jr,10497:Ss},jd={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Tf={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ls={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},xb={CUBICSPLINE:void 0,LINEAR:nr,STEP:er},Jd={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function yb(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Pe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Vn})),i.DefaultMaterial}function gr(i,t,e){for(let n in e.extensions)i[n]===void 0&&(t.userData.gltfExtensions=t.userData.gltfExtensions||{},t.userData.gltfExtensions[n]=e.extensions[n])}function Ii(i,t){t.extras!==void 0&&(typeof t.extras=="object"?Object.assign(i.userData,t.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+t.extras))}function vb(i,t,e){let n=!1,s=!1,r=!1;for(let c=0,u=t.length;c<u;c++){let d=t[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],l=[];for(let c=0,u=t.length;c<u;c++){let d=t[c];if(n){let h=d.POSITION!==void 0?e.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){let h=d.NORMAL!==void 0?e.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){let h=d.COLOR_0!==void 0?e.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function Sb(i,t){if(i.updateMorphTargets(),t.weights!==void 0)for(let e=0,n=t.weights.length;e<n;e++)i.morphTargetInfluences[e]=t.weights[e];if(t.extras&&Array.isArray(t.extras.targetNames)){let e=t.extras.targetNames;if(i.morphTargetInfluences.length===e.length){i.morphTargetDictionary={};for(let n=0,s=e.length;n<s;n++)i.morphTargetDictionary[e[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Mb(i){let t,e=i.extensions&&i.extensions[qt.KHR_DRACO_MESH_COMPRESSION];if(e?t="draco:"+e.bufferView+":"+e.indices+":"+Qd(e.attributes):t=i.indices+":"+Qd(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)t+=":"+Qd(i.targets[n]);return t}function Qd(i){let t="",e=Object.keys(i).sort();for(let n=0,s=e.length;n<s;n++)t+=e[n]+":"+i[e[n]]+";";return t}function wf(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function bb(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Tb=new Tt,Ef=class{constructor(t={},e={}){this.json=t,this.extensions={},this.plugins={},this.options=e,this.cache=new gb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?(this.textureLoader=new Ia(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)):(this.textureLoader=new Ua(this.options.manager),this.textureLoader.setPriority(this.options.priority),this.textureLoader.setCache(this.options.cache)),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setWithCredentials(this.options.withCredentials),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new co(this.options.manager),this.fileLoader.setPriority(this.options.priority),this.fileLoader.setCache(this.options.cache),this.fileLoader.setResponseType("arraybuffer"),(this.options.withCredentials||this.options.crossOrigin==="use-credentials")&&this.fileLoader.setWithCredentials(!0)}setExtensions(t){this.extensions=t}setPlugins(t){this.plugins=t}parse(t,e){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return gr(r,a,s),Ii(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();t(a)})}).catch(e)}_markDefs(){let t=this.json.nodes||[],e=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=e.length;s<r;s++){let o=e[s].joints;for(let a=0,l=o.length;a<l;a++)t[o[a]].isBone=!0}for(let s=0,r=t.length;s<r;s++){let o=t[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(t,e){e!==void 0&&(t.refs[e]===void 0&&(t.refs[e]=t.uses[e]=0),t.refs[e]++)}_getNodeRef(t,e,n){if(t.refs[e]<=1)return n;let s=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+t.uses[e]++,s}_invokeOne(t){let e=Object.values(this.plugins);e.push(this);for(let n=0;n<e.length;n++){let s=t(e[n]);if(s)return s}return null}_invokeAll(t){let e=Object.values(this.plugins);e.unshift(this);let n=[];for(let s=0;s<e.length;s++){let r=t(e[s]);r&&n.push(r)}return n}getDependency(t,e){let n=t+":"+e,s=this.cache.get(n);if(!s){switch(t){case"scene":s=this.loadScene(e);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(e)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(e)});break;case"accessor":s=this.loadAccessor(e);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(e)});break;case"buffer":s=this.loadBuffer(e);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(e)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(e)});break;case"skin":s=this.loadSkin(e);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(e)});break;case"camera":s=this.loadCamera(e);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(t,e)}),!s)throw new Error("Unknown type: "+t);break}this.cache.add(n,s)}return s}getDependencies(t){let e=this.cache.get(t);if(!e){let n=this,s=this.json[t+(t==="mesh"?"es":"s")]||[];e=Promise.all(s.map(function(r,o){return n.getDependency(t,o)})),this.cache.add(t,e)}return e}loadBuffer(t){let e=this.json.buffers[t],n=this.fileLoader;if(e.type&&e.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+e.type+" buffer type is not supported.");if(e.uri===void 0&&t===0)return Promise.resolve(this.extensions[qt.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(ns.resolveURL(e.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+e.uri+'".'))})})}loadBufferView(t){let e=this.json.bufferViews[t];return this.getDependency("buffer",e.buffer).then(function(n){let s=e.byteLength||0,r=e.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(t){let e=this,n=this.json,s=this.json.accessors[t];if(s.bufferView===void 0&&s.sparse===void 0){let o=jd[s.type],a=To[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new we(c,o,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=jd[s.type],c=To[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,v,p;if(f&&f!==d){let m=Math.floor(h/f),x="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count,S=e.cache.get(x);S||(v=new c(a,m*f,s.count*f/u),S=new rr(v,f/u),e.cache.add(x,S)),p=new Ms(S,l,h%f/u,g)}else a===null?v=new c(s.count*l):v=new c(a,h,s.count*l),p=new we(v,l,g);if(s.sparse!==void 0){let m=jd.SCALAR,x=To[s.sparse.indices.componentType],S=s.sparse.indices.byteOffset||0,y=s.sparse.values.byteOffset||0,M=new x(o[1],S,s.sparse.count*m),w=new c(o[2],y,s.sparse.count*l);a!==null&&(p=new we(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let _=0,b=M.length;_<b;_++){let P=M[_];if(p.setX(P,w[_*l]),l>=2&&p.setY(P,w[_*l+1]),l>=3&&p.setZ(P,w[_*l+2]),l>=4&&p.setW(P,w[_*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(t){let e=this.json,n=this.options,r=e.textures[t].source,o=e.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(t,r,a)}loadTextureImage(t,e,n){let s=this,r=this.json,o=r.textures[t],a=r.images[e],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(e,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return u.magFilter=Gg[h.magFilter]||We,u.minFilter=Gg[h.minFilter]||ti,u.wrapS=Wg[h.wrapS]||Ss,u.wrapT=Wg[h.wrapT]||Ss,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==De&&u.minFilter!==We,s.associations.set(u,{textures:t}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(t,e){let n=this,s=this.json,r=this.options;if(this.sourceCache[t]!==void 0)return this.sourceCache[t].then(h=>h.clone());let o=s.images[t],a=self.URL||self.webkitURL,l=o.uri||"",c=!1,u;if(e.isKTX2Loader===!0&&o.bufferView!==void 0)u=n.getDependency("bufferView",o.bufferView).then(function(h){return new Promise(function(f,g){e.parse(h,f,g)})});else{if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(h){c=!0;let f=new Blob([h],{type:o.mimeType});return l=a.createObjectURL(f),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+t+" is missing URI and bufferView");u=Promise.resolve(l).then(function(h){return new Promise(function(f,g){let v=f;e.isImageBitmapLoader===!0&&(v=function(p){let m=new Xe(p);m.needsUpdate=!0,f(m)}),e.load(ns.resolveURL(h,r.path),v,void 0,g)})})}let d=u.then(function(h){return c===!0&&a.revokeObjectURL(l),Ii(h,o),h.userData.mimeType=o.mimeType||bb(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[t]=d,d}assignTexture(t,e,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[qt.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[qt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[qt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),t[e]=o,o})}assignFinalMaterial(t){let e=t.geometry,n=t.material,s=e.attributes.tangent===void 0,r=e.attributes.color!==void 0,o=e.attributes.normal===void 0;if(t.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new lo,gn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(t.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new ao,gn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}t.material=n}getMaterialType(){return Pe}loadMaterial(t){let e=this,n=this.json,s=this.extensions,r=n.materials[t],o,a={},l=r.extensions||{},c=[];if(l[qt.KHR_MATERIALS_UNLIT]){let d=s[qt.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,r,e))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new At(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],En),a.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(e.assignTexture(a,"map",d.baseColorTexture,Ce)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(e.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(e.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(t)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(t,a)})))}r.doubleSided===!0&&(a.side=Ie);let u=r.alphaMode||Jd.OPAQUE;if(u===Jd.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Jd.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Dn&&(c.push(e.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new xt(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==Dn&&(c.push(e.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Dn){let d=r.emissiveFactor;a.emissive=new At().setRGB(d[0],d[1],d[2],En)}return r.emissiveTexture!==void 0&&o!==Dn&&c.push(e.assignTexture(a,"emissiveMap",r.emissiveTexture,Ce)),Promise.all(c).then(function(){let d=new o(a);return r.name&&(d.name=r.name),Ii(d,r),e.associations.set(d,{materials:t}),r.extensions&&gr(s,d,r),d})}createUniqueName(t){let e=ge.sanitizeNodeName(t||"");return e in this.nodeNamesUsed?e+"_"+ ++this.nodeNamesUsed[e]:(this.nodeNamesUsed[e]=0,e)}loadGeometries(t){let e=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[qt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,e).then(function(l){return Xg(l,a,e)})}let o=[];for(let a=0,l=t.length;a<l;a++){let c=t[a],u=Mb(c),d=s[u];if(d)o.push(d.promise);else{let h;c.extensions&&c.extensions[qt.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=Xg(new Ue,c,e),c.mode===ni.TRIANGLE_STRIP?h=h.then(f=>Zd(f,Ya)):c.mode===ni.TRIANGLE_FAN&&(h=h.then(f=>Zd(f,yo))),s[u]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(t){let e=this,n=this.json,s=this.extensions,r=n.meshes[t],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?yb(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(e.loadGeometries(o)),Promise.all(a).then(async function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let f=0,g=u.length;f<g;f++){let v=u[f],p=o[f],m,x=c[f];if(p.mode===ni.TRIANGLES||p.mode===ni.TRIANGLE_STRIP||p.mode===ni.TRIANGLE_FAN||p.mode===void 0){let S=r.isSkinnedMesh===!0,y=v.hasAttribute("skinIndex")&&v.hasAttribute("skinWeight");S&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=S&&y?new xa(v,x):new Jt(v,x),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(p.mode===ni.LINES)m=new bs(v,x);else if(p.mode===ni.LINE_STRIP)m=new bi(v,x);else if(p.mode===ni.LINE_LOOP)m=new Ts(v,x);else if(p.mode===ni.POINTS)m=new ws(v,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&Sb(m,r),m.name=e.createUniqueName(r.name||"mesh_"+t),Ii(m,r),p.extensions&&gr(s,m,p),e.assignFinalMaterial(m),d.push(m)}for(let f=0,g=d.length;f<g;f++)e.associations.set(d[f],{meshes:t,primitives:f});if(d.length===1)return r.extensions&&gr(s,d[0],r),d[0];let h=new Tn;r.extensions&&gr(s,h,r),e.associations.set(h,{meshes:t});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);return h})}loadCamera(t){let e,n=this.json.cameras[t],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?e=new Ge(Is.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(e=new cr(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(e.name=this.createUniqueName(n.name)),Ii(e,n),Promise.resolve(e)}loadSkin(t){let e=this.json.skins[t],n=[];for(let s=0,r=e.joints.length;s<r;s++)n.push(this._loadNodeShallow(e.joints[s]));return e.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",e.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let d=o[c];if(d){a.push(d);let h=new Tt;r!==null&&h.fromArray(r.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',e.joints[c])}return new ya(a,l)})}loadAnimation(t){let e=this.json,n=this,s=e.animations[t],r=s.name?s.name:"animation_"+t,o=[],a=[],l=[],c=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){let f=s.channels[d],g=s.samplers[f.sampler],v=f.target,p=v.node,m=s.parameters!==void 0?s.parameters[g.input]:g.input,x=s.parameters!==void 0?s.parameters[g.output]:g.output;v.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",x)),c.push(g),u.push(v))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){let h=d[0],f=d[1],g=d[2],v=d[3],p=d[4],m=[];for(let S=0,y=h.length;S<y;S++){let M=h[S],w=f[S],_=g[S],b=v[S],P=p[S];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();let A=n._createAnimationTracks(M,w,_,b,P);if(A)for(let R=0;R<A.length;R++)m.push(A[R])}let x=new Pa(r,void 0,m);return Ii(x,s),x})}createNodeMesh(t){let e=this.json,n=this,s=e.nodes[t];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(t){let e=this.json,n=this,s=e.nodes[t],r=n._loadNodeShallow(t),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,Tb)});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){let f=u.userData.pivot,g=d[0];u.pivot=new I().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(t){let e=this.json,n=this.extensions,s=this;if(this.nodeCache[t]!==void 0)return this.nodeCache[t];let r=e.nodes[t],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(t)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(t)}).forEach(function(c){a.push(c)}),this.nodeCache[t]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new oo:c.length>1?u=new Tn:c.length===1?u=c[0]:u=new _e,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=o),Ii(u,r),r.extensions&&gr(n,u,r),r.matrix!==void 0){let d=new Tt;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=t,u}),this.nodeCache[t]}loadScene(t){let e=this.extensions,n=this.json.scenes[t],s=this,r=new Tn;n.name&&(r.name=s.createUniqueName(n.name)),Ii(r,n),n.extensions&&gr(e,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,d=l.length;u<d;u++){let h=l[u];h.parent!==null?r.add(kg(h)):r.add(h)}let c=u=>{let d=new Map;for(let[h,f]of s.associations)(h instanceof gn||h instanceof Xe)&&d.set(h,f);return u.traverse(h=>{let f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=c(r),r})}_createAnimationTracks(t,e,n,s,r){let o=[],a=t.name?t.name:t.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ls[r.path]===Ls.weights?(c(t),t.isGroup&&t.children.forEach(c)):l.push(a);let u;switch(Ls[r.path]){case Ls.weights:u=Ji;break;case Ls.rotation:u=Qi;break;case Ls.translation:case Ls.scale:u=As;break;default:n.itemSize===1?u=Ji:u=As;break}let d=s.interpolation!==void 0?xb[s.interpolation]:nr,h=this._getArrayFromAccessor(n);for(let f=0,g=l.length;f<g;f++){let v=new u(l[f]+"."+Ls[r.path],e.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),o.push(v)}return o}_getArrayFromAccessor(t){let e=t.array;if(t.normalized){let n=wf(e.constructor),s=new Float32Array(e.length);for(let r=0,o=e.length;r<o;r++)s[r]=e[r]*n;e=s}return e}_createCubicSplineTrackInterpolant(t){t.createInterpolant=function(n){let s=this instanceof Qi?bf:bu;return new s(this.times,this.values,this.getValueSize()/3,n)},t.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function wb(i,t,e){let n=t.attributes,s=new jt;if(n.POSITION!==void 0){let a=e.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new I(l[0],l[1],l[2]),new I(c[0],c[1],c[2])),a.normalized){let u=wf(To[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=t.targets;if(r!==void 0){let a=new I,l=new I;for(let c=0,u=r.length;c<u;c++){let d=r[c];if(d.POSITION!==void 0){let h=e.json.accessors[d.POSITION],f=h.min,g=h.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),h.normalized){let v=wf(To[h.componentType]);l.multiplyScalar(v)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new ke;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function Xg(i,t,e){let n=t.attributes,s=[];function r(o,a){return e.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(let o in n){let a=Tf[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(t.indices!==void 0&&!i.index){let o=e.getDependency("accessor",t.indices).then(function(a){i.setIndex(a)});s.push(o)}return Wt.workingColorSpace!==En&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Wt.workingColorSpace}" not supported.`),Ii(i,t),wb(i,t,e),Promise.all(s).then(function(){return t.targets!==void 0?vb(i,t.targets,e):i})}var Tu=class extends sr{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new Es;t.deleteAttribute("uv");let e=new Pe({side:qe}),n=new Pe,s=new lr(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new Jt(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new or(t,n,6),a=new _e;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new Jt(t,wo(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new Jt(t,wo(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let u=new Jt(t,wo(17));u.position.set(14.904,12.198,-1.832),u.scale.set(.15,4.265,6.331),this.add(u);let d=new Jt(t,wo(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let h=new Jt(t,wo(20));h.position.set(3.235,11.486,-12.541),h.scale.set(2.5,2,.1),this.add(h);let f=new Jt(t,wo(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function wo(i){return new Ra({color:0,emissive:16777215,emissiveIntensity:i})}var Eo=Math.pow(2,-24),tl=Symbol("SKIP_GENERATION"),wu={strategy:0,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[tl]:!1};function xe(i,t,e){return e.min.x=t[i],e.min.y=t[i+1],e.min.z=t[i+2],e.max.x=t[i+3],e.max.y=t[i+4],e.max.z=t[i+5],e}function el(i){let t=-1,e=-1/0;for(let n=0;n<3;n++){let s=i[n+3]-i[n];s>e&&(e=s,t=n)}return t}function Af(i,t,e){for(let n=0;n<3;n++){let s=t[i+2*n],r=t[i+2*n+1],o=s-r,a=s+r;o<e[n]&&(e[n]=o),a>e[n+3]&&(e[n+3]=a)}}function Eu(i){let t=i[3]-i[0],e=i[4]-i[1],n=i[5]-i[2];return 2*(t*e+e*n+n*t)}function Qt(i,t){return t[i+15]===65535}function le(i,t){return t[i+6]}function de(i,t){return t[i+14]}function re(i){return i+8}function oe(i,t){let e=t[i+6];return i+e*8}function Ao(i,t){return t[i+7]}function Au(i,t,e,n,s){let r=1/0,o=1/0,a=1/0,l=-1/0,c=-1/0,u=-1/0,d=1/0,h=1/0,f=1/0,g=-1/0,v=-1/0,p=-1/0,m=i.offset||0;for(let x=(t-m)*6,S=(t+e-m)*6;x<S;x+=6){let y=i[x+0],M=i[x+1],w=y-M,_=y+M;w<r&&(r=w),_>l&&(l=_),y<d&&(d=y),y>g&&(g=y);let b=i[x+2],P=i[x+3],A=b-P,R=b+P;A<o&&(o=A),R>c&&(c=R),b<h&&(h=b),b>v&&(v=b);let L=i[x+4],O=i[x+5],N=L-O,z=L+O;N<a&&(a=N),z>u&&(u=z),L<f&&(f=L),L>p&&(p=L)}n[0]=r,n[1]=o,n[2]=a,n[3]=l,n[4]=c,n[5]=u,s[0]=d,s[1]=h,s[2]=f,s[3]=g,s[4]=v,s[5]=p}var Ni=8,Cf=8,Rf=new Int32Array(Ni),Li=new Float32Array(Ni*6),Ro=new Float32Array(Ni*6),hi=new Float32Array(6),Ru=new Float32Array(6),Ns=new Int32Array(Cf),$g=new Float32Array(Cf*6);function Rb(i,t,e,n){for(let s=0;s<3;s++){let r=t[i+2*s],o=t[i+2*s+1],a=r-o,l=r+o;a<e[n+s]&&(e[n+s]=a),l>e[n+s+3]&&(e[n+s+3]=l)}}function Kg(i,t){let e=i[t+3]-i[t],n=i[t+4]-i[t+1],s=i[t+5]-i[t+2];return 2*(e*n+n*s+s*e)}function Zg(i,t,e,n,s,r){let o=-1,a=0;if(r===0)o=el(t),o!==-1&&(a=(t[o]+t[o+3])/2);else if(r===1)o=el(i),o!==-1&&(a=Cb(e,n,s,o));else if(r===2){let l=Eu(i),c=1.25*s,u=e.offset||0,d=(n-u)*6,h=(n+s-u)*6;for(let f=0;f<3;f++){let g=t[f],m=(t[f+3]-g)/Ni;if(s<Cf){for(let x=0;x<s;x++){let S=d+x*6,y=e[S+2*f],M=x;for(;M>0&&e[Ns[M-1]+2*f]>y;)Ns[M]=Ns[M-1],M--;Ns[M]=S}for(let x=0;x<3;x++)hi[x]=1/0,hi[x+3]=-1/0,Ru[x]=1/0,Ru[x+3]=-1/0;for(let x=s-1;x>=0;x--)Af(Ns[x],e,Ru),$g.set(Ru,x*6);for(let x=0;x<s-1;x++){Af(Ns[x],e,hi);let S=e[Ns[x+1]+2*f];if(e[Ns[x]+2*f]===S)continue;let y=x+1,M=s-y,w=Eu(hi)/l,_=Kg($g,y*6)/l,b=1+1.25*(w*y+_*M);b<c&&(o=f,c=b,a=S)}}else{for(let y=0;y<Ni;y++){Rf[y]=0;for(let M=0;M<3;M++)Li[y*6+M]=1/0,Li[y*6+M+3]=-1/0}for(let y=d;y<h;y+=6){let _=~~((e[y+2*f]-g)/m);_>=Ni&&(_=Ni-1),Rf[_]++,Rb(y,e,Li,_*6)}let x=(Ni-1)*6;for(let y=0;y<6;y++)Ro[x+y]=Li[x+y];for(let y=Ni-2;y>=0;y--){let M=y*6,w=M+6;for(let _=0;_<3;_++)Ro[M+_]=Math.min(Li[M+_],Ro[w+_]),Ro[M+_+3]=Math.max(Li[M+_+3],Ro[w+_+3])}let S=0;for(let y=0;y<Ni-1;y++){let M=y*6,w=Rf[y];if(w!==0)for(let R=0;R<3;R++)S===0?(hi[R]=Li[M+R],hi[R+3]=Li[M+R+3]):(hi[R]=Math.min(hi[R],Li[M+R]),hi[R+3]=Math.max(hi[R+3],Li[M+R+3]));S+=w;let _=0,b=0;S!==0&&(_=Eu(hi)/l);let P=s-S;P!==0&&(b=Kg(Ro,M+6)/l);let A=1+1.25*(_*S+b*P);A<c&&(o=f,c=A,a=g+m+y*m)}}}}else console.warn(`BVH: Invalid build strategy value ${r} used.`);return{axis:o,pos:a}}function Cb(i,t,e,n){let s=0,r=i.offset;for(let o=t,a=t+e;o<a;o++)s+=i[(o-r)*6+n*2];return s/e}function jg(i,t,e,n,s,r){let o=n,a=n+s-1,l=r.pos,c=r.axis*2,u=e.offset||0;for(;;){for(;o<=a&&e[(o-u)*6+c]<l;)o++;for(;o<=a&&e[(a-u)*6+c]>=l;)a--;if(o<a){for(let d=0;d<t;d++){let h=i[o*t+d];i[o*t+d]=i[a*t+d],i[a*t+d]=h}for(let d=0;d<6;d++){let h=o-u,f=a-u,g=e[h*6+d];e[h*6+d]=e[f*6+d],e[f*6+d]=g}o++,a--}else return o}}var Pb=Math.pow(2,32),Co=new Float32Array(6),Cu=new Float32Array(6);function Ib(i,t,e,n,s,r){let{maxDepth:o,verbose:a,targetLeafSize:l,_strictLeafSize:c=1/0,strategy:u,onProgress:d,useSharedArrayBuffer:h=!1}=s,f=i.primitiveBuffer,g=i.primitiveBufferStride,v=h?SharedArrayBuffer:ArrayBuffer,p=new v(32*Math.max(1,2*Math.ceil(n)-1)),m=new Float32Array(p),x=new Uint32Array(p),S=new Uint16Array(p),y=0,M=!1;return Au(t,e,n,Co,Cu),b(e,n,0),p.slice(0,y*32);function w(P){d&&d((P-r.offset)/r.count)}function _(P,A,R){let L=P*2;x[P+6]=A,S[L+14]=R,S[L+15]=65535,w(A+R)}function b(P,A,R){let L=y++,O=L*8;m.set(Co,O),!M&&R>=o&&(M=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));let N=A>c;if(A<=l&&!N||R>=o){_(O,P,A);return}let z=Zg(Co,Cu,t,P,A,u),G=z.axis===-1?-1:jg(f,g,t,P,A,z);if(z.axis===-1||G===P||G===P+A){if(!N){_(O,P,A);return}z.axis=Math.max(0,el(Co)),G=P+Math.max(1,Math.floor(A/2))}x[O+7]=z.axis;let W=G-P;Au(t,P,W,Co,Cu),b(P,W,R+1);let et=y-L;if(et>Pb)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");x[O+6]=et;let q=A-W;Au(t,G,q,Co,Cu),b(G,q,R+1)}}function Jg(i,t){let e=i.getRootRanges(t.range),n=e[0],s=e[e.length-1],r={offset:n.offset,count:s.offset+s.count-n.offset},o=new Float32Array(6*r.count);o.offset=r.offset,i.computePrimitiveBounds(r.offset,r.count,o),i._roots=e.map(a=>Ib(i,o,a.offset,a.count,t,r))}var Ds=class{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){let t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}};var Pf=class{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let t=[],e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}},Yt=new Pf;var Us,Io,Po=[],Pu=new Ds(()=>new jt);function Qg(i,t,e,n,s,r){Us=Pu.getPrimitive(),Io=Pu.getPrimitive(),Po.push(Us,Io),Yt.setBuffer(i._roots[t]);let o=If(0,i.geometry,e,n,s,r);Yt.clearBuffer(),Pu.releasePrimitive(Us),Pu.releasePrimitive(Io),Po.pop(),Po.pop();let a=Po.length;return a>0&&(Io=Po[a-1],Us=Po[a-2]),o}function If(i,t,e,n,s=null,r=0,o=0){let{float32Array:a,uint16Array:l,uint32Array:c}=Yt,u=i*2;if(Qt(u,l)){let h=le(i,c),f=de(u,l);return xe(i,a,Us),n(h,f,!1,o,r+i/8,Us)}else{let A=function(L){let{uint16Array:O,uint32Array:N}=Yt,z=L*2;for(;!Qt(z,O);)L=re(L),z=L*2;return le(L,N)},R=function(L){let{uint16Array:O,uint32Array:N}=Yt,z=L*2;for(;!Qt(z,O);)L=oe(L,N),z=L*2;return le(L,N)+de(z,O)},h=re(i),f=oe(i,c),g=h,v=f,p,m,x,S;if(s&&(x=Us,S=Io,xe(g,a,x),xe(v,a,S),p=s(x),m=s(S),m<p)){g=f,v=h;let L=p;p=m,m=L,x=S}x||(x=Us,xe(g,a,x));let y=Qt(g*2,l),M=e(x,y,p,o+1,r+g/8),w;if(M===2){let L=A(g),N=R(g)-L;w=n(L,N,!0,o+1,r+g/8,x)}else w=M&&If(g,t,e,n,s,r,o+1);if(w)return!0;S=Io,xe(v,a,S);let _=Qt(v*2,l),b=e(S,_,m,o+1,r+v/8),P;if(b===2){let L=A(v),N=R(v)-L;P=n(L,N,!0,o+1,r+v/8,S)}else P=b&&If(v,t,e,n,s,r,o+1);return!!P}}var nl=new Yt.constructor,Iu=new Yt.constructor,Os=new Ds(()=>new jt),Lo=new jt,No=new jt,Nf=new jt,Df=new jt,Uf=!1;function t_(i,t,e,n){if(Uf)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");Uf=!0;let s=i._roots,r=t._roots,o,a=0,l=0,c=new Tt().copy(e).invert();for(let u=0,d=s.length;u<d;u++){nl.setBuffer(s[u]),l=0;let h=Os.getPrimitive();xe(0,nl.float32Array,h),h.applyMatrix4(c);for(let f=0,g=r.length;f<g&&(Iu.setBuffer(r[f]),o=di(0,0,e,c,n,a,l,0,0,h),Iu.clearBuffer(),l+=r[f].byteLength/32,!o);f++);if(Os.releasePrimitive(h),nl.clearBuffer(),a+=s[u].byteLength/32,o)break}return Uf=!1,o}function di(i,t,e,n,s,r=0,o=0,a=0,l=0,c=null,u=!1){let d,h;u?(d=Iu,h=nl):(d=nl,h=Iu);let f=d.float32Array,g=d.uint32Array,v=d.uint16Array,p=h.float32Array,m=h.uint32Array,x=h.uint16Array,S=i*2,y=t*2,M=Qt(S,v),w=Qt(y,x),_=!1;if(w&&M)u?_=s(le(t,m),de(t*2,x),le(i,g),de(i*2,v),l,o+t/8,a,r+i/8):_=s(le(i,g),de(i*2,v),le(t,m),de(t*2,x),a,r+i/8,l,o+t/8);else if(w){let b=Os.getPrimitive();xe(t,p,b),b.applyMatrix4(e);let P=re(i),A=oe(i,g);xe(P,f,Lo),xe(A,f,No);let R=b.intersectsBox(Lo),L=b.intersectsBox(No);_=R&&di(t,P,n,e,s,o,r,l,a+1,b,!u)||L&&di(t,A,n,e,s,o,r,l,a+1,b,!u),Os.releasePrimitive(b)}else{let b=re(t),P=oe(t,m);xe(b,p,Nf),xe(P,p,Df);let A=c.intersectsBox(Nf),R=c.intersectsBox(Df);if(A&&R)_=di(i,b,e,n,s,r,o,a,l+1,c,u)||di(i,P,e,n,s,r,o,a,l+1,c,u);else if(A)if(M)_=di(i,b,e,n,s,r,o,a,l+1,c,u);else{let L=Os.getPrimitive();L.copy(Nf).applyMatrix4(e);let O=re(i),N=oe(i,g);xe(O,f,Lo),xe(N,f,No);let z=L.intersectsBox(Lo),G=L.intersectsBox(No);_=z&&di(b,O,n,e,s,o,r,l,a+1,L,!u)||G&&di(b,N,n,e,s,o,r,l,a+1,L,!u),Os.releasePrimitive(L)}else if(R)if(M)_=di(i,P,e,n,s,r,o,a,l+1,c,u);else{let L=Os.getPrimitive();L.copy(Df).applyMatrix4(e);let O=re(i),N=oe(i,g);xe(O,f,Lo),xe(N,f,No);let z=L.intersectsBox(Lo),G=L.intersectsBox(No);_=z&&di(P,O,n,e,s,o,r,l,a+1,L,!u)||G&&di(P,N,n,e,s,o,r,l,a+1,L,!u),Os.releasePrimitive(L)}}return _}var Lu=new class{constructor(){let i=null,t=null,e=null,n=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(r,o)=>{if(n)throw new Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=o,this.buffer=i=r._roots[o],this.uint16Array=e=new Uint16Array(i),this.uint32Array=t=new Uint32Array(i)},this.reset=()=>{this.root=null,this.buffer=i=null,this.uint16Array=e=null,this.uint32Array=t=null},this.getRangeStart=r=>{let o=r*2;for(;!Qt(o,e);)r=re(r),o=r*2;return le(r,t)},this.getRangeEnd=r=>{let o=r*2;for(;!Qt(o,e);)r=oe(r,t),o=r*2;return le(r,t)+de(o,e)};let s=(r,o,a)=>{let l=o*2,c=Qt(l,e);if(!r(a,c,o)&&!c){let d=re(o),h=oe(o,t);s(r,d,a+1),s(r,h,a+1)}};this.traverseBuffer=r=>{if(n)throw new Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");n=!0;try{s(r,0,0)}finally{n=!1}},this.traverse=r=>{this.traverseBuffer((o,a,l)=>{if(a){let c=l*2,u=t[l+6],d=e[c+14];return r(o,a,new Float32Array(i,l*4,6),u,d)}else{let c=Ao(l,t);return r(o,a,new Float32Array(i,l*4,6),c)}})}}};var e_=new jt,Do=new Float32Array(6),Nu=class{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(t){t={...wu,...t},"maxLeafSize"in t&&(console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafSize}),Jg(this,t)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(t,e,n,s){let r=1/0,o=1/0,a=1/0,l=-1/0,c=-1/0,u=-1/0;for(let d=t,h=t+e;d<h;d++){this.writePrimitiveBounds(d,Do,0);let[f,g,v,p,m,x]=Do;f<r&&(r=f),p>l&&(l=p),g<o&&(o=g),m>c&&(c=m),v<a&&(a=v),x>u&&(u=x)}return n[s+0]=r,n[s+1]=o,n[s+2]=a,n[s+3]=l,n[s+4]=c,n[s+5]=u,n}computePrimitiveBounds(t,e,n){let s=n.offset||0;for(let r=t,o=t+e;r<o;r++){this.writePrimitiveBounds(r,Do,0);let[a,l,c,u,d,h]=Do,f=(a+u)/2,g=(l+d)/2,v=(c+h)/2,p=(u-a)/2,m=(d-l)/2,x=(h-c)/2,S=(r-s)*6;n[S+0]=f,n[S+1]=p+(Math.abs(f)+p)*Eo,n[S+2]=g,n[S+3]=m+(Math.abs(g)+m)*Eo,n[S+4]=v,n[S+5]=x+(Math.abs(v)+x)*Eo}return n}shiftPrimitiveOffsets(t){let e=this._indirectBuffer;if(e)for(let n=0,s=e.length;n<s;n++)e[n]+=t;else{let n=this._roots;for(let s=0;s<n.length;s++){let r=n[s],o=new Uint32Array(r),a=new Uint16Array(r),l=r.byteLength/32;for(let c=0;c<l;c++){let u=8*c,d=2*u;Qt(d,a)&&(o[u+6]+=t)}}}}traverse(t,e=0){Lu.setBVH(this,e),Lu.traverse(t),Lu.reset()}refit(){let t=this._roots;for(let e=0,n=t.length;e<n;e++){let s=t[e],r=new Uint32Array(s),o=new Uint16Array(s),a=new Float32Array(s),l=s.byteLength/32;for(let c=l-1;c>=0;c--){let u=c*8,d=u*2;if(Qt(d,o)){let f=le(u,r),g=de(d,o);this.writePrimitiveRangeBounds(f,g,Do,0),a.set(Do,u)}else{let f=re(u),g=oe(u,r);for(let v=0;v<3;v++){let p=a[f+v],m=a[f+v+3],x=a[g+v],S=a[g+v+3];a[u+v]=p<x?p:x,a[u+v+3]=m>S?m:S}}}}}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{xe(0,new Float32Array(n),e_),t.union(e_)}),t}shapecast(t){let{boundsTraverseOrder:e,intersectsBounds:n,intersectsRange:s,intersectsPrimitive:r,scratchPrimitive:o,iterate:a}=t;if(s&&r){let d=s;s=(h,f,g,v,p)=>d(h,f,g,v,p)?!0:a(h,f,this,r,g,v,o)}else s||(r?s=(d,h,f,g)=>a(d,h,this,r,f,g,o):s=(d,h,f)=>f);let l=!1,c=0,u=this._roots;for(let d=0,h=u.length;d<h;d++){let f=u[d];if(l=Qg(this,d,n,s,e,c),l)break;c+=f.byteLength/32}return l}bvhcast(t,e,n){let{intersectsRanges:s}=n;return t_(this,t,e,s)}};function n_(){return typeof SharedArrayBuffer<"u"}function Of(i){return i.index?i.index.count:i.attributes.position.count}function Fs(i){return Of(i)/3}function Nb(i,t=ArrayBuffer){return i>65535?new Uint32Array(new t(4*i)):new Uint16Array(new t(2*i))}function i_(i,t){if(!i.index){let e=i.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,s=Nb(e,n);i.setIndex(new we(s,1));for(let r=0;r<e;r++)s[r]=r}}function Db(i,t,e){let n=Of(i)/e,s=t||i.drawRange,r=s.start/e,o=(s.start+s.count)/e,a=Math.max(0,r),l=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(l)}}function Ub(i,t){return i.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function Ff(i,t,e){let n=Db(i,t,e),s=Ub(i,e);if(!s.length)return[n];let r=[],o=n.offset,a=n.offset+n.count,l=Of(i)/e,c=[];for(let h of s){let{offset:f,count:g}=h,v=f,p=isFinite(g)?g:l-f,m=f+p;v<a&&m>o&&(c.push({pos:Math.max(o,v),isStart:!0}),c.push({pos:Math.min(a,m),isStart:!1}))}c.sort((h,f)=>h.pos!==f.pos?h.pos-f.pos:h.type==="end"?-1:1);let u=0,d=null;for(let h of c){let f=h.pos;u!==0&&f!==d&&r.push({offset:d,count:f-d}),u+=h.isStart?1:-1,d=f}return r}function Ob(i,t){let e=i[i.length-1],n=e.offset+e.count>2**16,s=i.reduce((c,u)=>c+u.count,0),r=n?4:2,o=t?new SharedArrayBuffer(s*r):new ArrayBuffer(s*r),a=n?new Uint32Array(o):new Uint16Array(o),l=0;for(let c=0;c<i.length;c++){let{offset:u,count:d}=i[c];for(let h=0;h<d;h++)a[l+h]=u+h;l+=d}return a}var Du=class extends Nu{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(t){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(t){}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(e.useSharedArrayBuffer&&!n_())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=t,this.resolvePrimitiveIndex=e.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,e={...wu,...e},e[tl]||this.init(e)}init(t){let{geometry:e,primitiveStride:n}=this;if(t.indirect){let s=Ff(e,t.range,n),r=Ob(s,t.useSharedArrayBuffer);this._indirectBuffer=r}else i_(e,t);super.init(t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new jt))}getRootRanges(t){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:Ff(this.geometry,t,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}};var Wn=class{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,s=-1/0;for(let r=0,o=t.length;r<o;r++){let l=t[r][e];n=l<n?l:n,s=l>s?l:s}this.min=n,this.max=s}setFromPoints(t,e){let n=1/0,s=-1/0;for(let r=0,o=e.length;r<o;r++){let a=e[r],l=t.dot(a);n=l<n?l:n,s=l>s?l:s}this.min=n,this.max=s}isSeparated(t){return this.min>t.max||t.min>this.max}};Wn.prototype.setFromBox=(function(){let i=new I;return function(e,n){let s=n.min,r=n.max,o=1/0,a=-1/0;for(let l=0;l<=1;l++)for(let c=0;c<=1;c++)for(let u=0;u<=1;u++){i.x=s.x*l+r.x*(1-l),i.y=s.y*c+r.y*(1-c),i.z=s.z*u+r.z*(1-u);let d=e.dot(i);o=Math.min(d,o),a=Math.max(d,a)}this.min=o,this.max=a}})();var Fb=(function(){let i=new I,t=new I,e=new I;return function(s,r,o){let a=s.start,l=i,c=r.start,u=t;e.subVectors(a,c),i.subVectors(s.end,s.start),t.subVectors(r.end,r.start);let d=e.dot(u),h=u.dot(l),f=u.dot(u),g=e.dot(l),p=l.dot(l)*f-h*h,m,x;p!==0?m=(d*h-g*f)/p:m=0,x=(d+m*h)/f,o.x=m,o.y=x}})(),il=(function(){let i=new xt,t=new I,e=new I;return function(s,r,o,a){Fb(s,r,i);let l=i.x,c=i.y;if(l>=0&&l<=1&&c>=0&&c<=1){s.at(l,o),r.at(c,a);return}else if(l>=0&&l<=1){c<0?r.at(0,a):r.at(1,a),s.closestPointToPoint(a,!0,o);return}else if(c>=0&&c<=1){l<0?s.at(0,o):s.at(1,o),r.closestPointToPoint(o,!0,a);return}else{let u;l<0?u=s.start:u=s.end;let d;c<0?d=r.start:d=r.end;let h=t,f=e;if(s.closestPointToPoint(d,!0,t),r.closestPointToPoint(u,!0,e),h.distanceToSquared(d)<=f.distanceToSquared(u)){o.copy(h),a.copy(d);return}else{o.copy(u),a.copy(f);return}}}})(),s_=(function(){let i=new I,t=new I,e=new on,n=new Rn;return function(r,o){let{radius:a,center:l}=r,{a:c,b:u,c:d}=o;if(n.start=c,n.end=u,n.closestPointToPoint(l,!0,i).distanceTo(l)<=a||(n.start=c,n.end=d,n.closestPointToPoint(l,!0,i).distanceTo(l)<=a)||(n.start=u,n.end=d,n.closestPointToPoint(l,!0,i).distanceTo(l)<=a))return!0;let v=o.getPlane(e);if(Math.abs(v.distanceToPoint(l))<=a){let m=v.projectPoint(l,t);if(o.containsPoint(m))return!0}return!1}})();var Bb=["x","y","z"],rs=1e-15,r_=rs*rs;function ii(i){return Math.abs(i)<rs}var ln=class extends an{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new I),this.satBounds=new Array(4).fill().map(()=>new Wn),this.points=[this.a,this.b,this.c],this.plane=new on,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new Rn,this.needsUpdate=!0}intersectsSphere(t){return s_(t,this)}update(){let t=this.a,e=this.b,n=this.c,s=this.points,r=this.satAxes,o=this.satBounds,a=r[0],l=o[0];this.getNormal(a),l.setFromPoints(a,s);let c=r[1],u=o[1];c.subVectors(t,e),u.setFromPoints(c,s);let d=r[2],h=o[2];d.subVectors(e,n),h.setFromPoints(d,s);let f=r[3],g=o[3];f.subVectors(n,t),g.setFromPoints(f,s);let v=c.length(),p=d.length(),m=f.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,v<rs?p<rs||m<rs?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(n)):p<rs?m<rs?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(t)):m<rs&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(e)),this.plane.setFromNormalAndCoplanarPoint(a,t),this.needsUpdate=!1}};ln.prototype.closestPointToSegment=(function(){let i=new I,t=new I,e=new Rn;return function(s,r=null,o=null){this.needsUpdate&&this.update();let{start:a,end:l}=s,c=this.points,u,d=1/0,h=this.plane.distanceToPoint(a),f=this.plane.distanceToPoint(l);if(h*f<0&&this.plane.intersectLine(s,i)!==null&&this.containsPoint(i))return r&&r.copy(i),o&&o.copy(i),0;for(let g=0;g<3;g++){let v=(g+1)%3;e.start.copy(c[g]),e.end.copy(c[v]),il(e,s,i,t),u=i.distanceToSquared(t),u<d&&(d=u,r&&r.copy(i),o&&o.copy(t))}return this.closestPointToPoint(a,i),u=a.distanceToSquared(i),u<d&&(d=u,r&&r.copy(i),o&&o.copy(a)),this.closestPointToPoint(l,i),u=l.distanceToSquared(i),u<d&&(d=u,r&&r.copy(i),o&&o.copy(l)),Math.sqrt(d)}})();ln.prototype.intersectsTriangle=(function(){let i=new ln,t=new Wn,e=new Wn,n=new I,s=new I,r=new I,o=new I,a=new Rn,l=new Rn,c=new I,u=new xt,d=new xt;function h(S,y,M,w){let _=n;!S.isDegenerateIntoPoint&&!S.isDegenerateIntoSegment?_.copy(S.plane.normal):_.copy(y.plane.normal);let b=S.satBounds,P=S.satAxes;for(let L=1;L<4;L++){let O=b[L],N=P[L];if(t.setFromPoints(N,y.points),O.isSeparated(t)||(o.copy(_).cross(N),t.setFromPoints(o,S.points),e.setFromPoints(o,y.points),t.isSeparated(e)))return!1}let A=y.satBounds,R=y.satAxes;for(let L=1;L<4;L++){let O=A[L],N=R[L];if(t.setFromPoints(N,S.points),O.isSeparated(t)||(o.crossVectors(_,N),t.setFromPoints(o,S.points),e.setFromPoints(o,y.points),t.isSeparated(e)))return!1}return M&&(w||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),M.start.set(0,0,0),M.end.set(0,0,0)),!0}function f(S,y,M,w,_,b,P,A,R,L,O){let N=P/(P-A);L.x=w+(_-w)*N,O.start.subVectors(y,S).multiplyScalar(N).add(S),N=P/(P-R),L.y=w+(b-w)*N,O.end.subVectors(M,S).multiplyScalar(N).add(S)}function g(S,y,M,w,_,b,P,A,R,L,O){if(_>0)f(S.c,S.a,S.b,w,y,M,R,P,A,L,O);else if(b>0)f(S.b,S.a,S.c,M,y,w,A,P,R,L,O);else if(A*R>0||P!=0)f(S.a,S.b,S.c,y,M,w,P,A,R,L,O);else if(A!=0)f(S.b,S.a,S.c,M,y,w,A,P,R,L,O);else if(R!=0)f(S.c,S.a,S.b,w,y,M,R,P,A,L,O);else return!0;return!1}function v(S,y,M,w){let _=y.degenerateSegment,b=S.plane.distanceToPoint(_.start),P=S.plane.distanceToPoint(_.end);return ii(b)?ii(P)?h(S,y,M,w):(M&&(M.start.copy(_.start),M.end.copy(_.start)),S.containsPoint(_.start)):ii(P)?(M&&(M.start.copy(_.end),M.end.copy(_.end)),S.containsPoint(_.end)):S.plane.intersectLine(_,n)!=null?(M&&(M.start.copy(n),M.end.copy(n)),S.containsPoint(n)):!1}function p(S,y,M){let w=y.a;return ii(S.plane.distanceToPoint(w))&&S.containsPoint(w)?(M&&(M.start.copy(w),M.end.copy(w)),!0):!1}function m(S,y,M){let w=S.degenerateSegment,_=y.a;return w.closestPointToPoint(_,!0,n),_.distanceToSquared(n)<r_?(M&&(M.start.copy(_),M.end.copy(_)),!0):!1}function x(S,y,M,w){if(S.isDegenerateIntoSegment)if(y.isDegenerateIntoSegment){let _=S.degenerateSegment,b=y.degenerateSegment,P=s,A=r;_.delta(P),b.delta(A);let R=n.subVectors(b.start,_.start),L=P.x*A.y-P.y*A.x;if(ii(L))return!1;let O=(R.x*A.y-R.y*A.x)/L,N=-(P.x*R.y-P.y*R.x)/L;if(O<0||O>1||N<0||N>1)return!1;let z=_.start.z+P.z*O,G=b.start.z+A.z*N;return ii(z-G)?(M&&(M.start.copy(_.start).addScaledVector(P,O),M.end.copy(_.start).addScaledVector(P,O)),!0):!1}else return y.isDegenerateIntoPoint?m(S,y,M):v(y,S,M,w);else{if(S.isDegenerateIntoPoint)return y.isDegenerateIntoPoint?y.a.distanceToSquared(S.a)<r_?(M&&(M.start.copy(S.a),M.end.copy(S.a)),!0):!1:y.isDegenerateIntoSegment?m(y,S,M):p(y,S,M);if(y.isDegenerateIntoPoint)return p(S,y,M);if(y.isDegenerateIntoSegment)return v(S,y,M,w)}}return function(y,M=null,w=!1){this.needsUpdate&&this.update(),y.isExtendedTriangle?y.needsUpdate&&y.update():(i.copy(y),i.update(),y=i);let _=x(this,y,M,w);if(_!==void 0)return _;let b=this.plane,P=y.plane,A=P.distanceToPoint(this.a),R=P.distanceToPoint(this.b),L=P.distanceToPoint(this.c);ii(A)&&(A=0),ii(R)&&(R=0),ii(L)&&(L=0);let O=A*R,N=A*L;if(O>0&&N>0)return!1;let z=b.distanceToPoint(y.a),G=b.distanceToPoint(y.b),W=b.distanceToPoint(y.c);ii(z)&&(z=0),ii(G)&&(G=0),ii(W)&&(W=0);let et=z*G,q=z*W;if(et>0&&q>0)return!1;s.copy(b.normal),r.copy(P.normal);let Q=s.cross(r),tt=0,vt=Math.abs(Q.x),Ut=Math.abs(Q.y);Ut>vt&&(vt=Ut,tt=1),Math.abs(Q.z)>vt&&(tt=2);let ut=Bb[tt],yt=this.a[ut],Pt=this.b[ut],pt=this.c[ut],Ft=y.a[ut],Re=y.b[ut],Lt=y.c[ut];if(g(this,yt,Pt,pt,O,N,A,R,L,u,a))return h(this,y,M,w);if(g(y,Ft,Re,Lt,et,q,z,G,W,d,l))return h(this,y,M,w);if(u.y<u.x){let te=u.y;u.y=u.x,u.x=te,c.copy(a.start),a.start.copy(a.end),a.end.copy(c)}if(d.y<d.x){let te=d.y;d.y=d.x,d.x=te,c.copy(l.start),l.start.copy(l.end),l.end.copy(c)}return u.y<d.x||d.y<u.x?!1:(M&&(d.x>u.x?M.start.copy(l.start):M.start.copy(a.start),d.y<u.y?M.end.copy(l.end):M.end.copy(a.end)),!0)}})();ln.prototype.distanceToPoint=(function(){let i=new I;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();ln.prototype.distanceToTriangle=(function(){let i=new I,t=new I,e=["a","b","c"],n=new Rn,s=new Rn;return function(o,a=null,l=null){let c=a||l?n:null;if(this.intersectsTriangle(o,c,!0))return(a||l)&&(a&&c.getCenter(a),l&&c.getCenter(l)),0;let u=1/0;for(let d=0;d<3;d++){let h,f=e[d],g=o[f];this.closestPointToPoint(g,i),h=g.distanceToSquared(i),h<u&&(u=h,a&&a.copy(i),l&&l.copy(g));let v=this[f];o.closestPointToPoint(v,i),h=v.distanceToSquared(i),h<u&&(u=h,a&&a.copy(v),l&&l.copy(i))}for(let d=0;d<3;d++){let h=e[d],f=e[(d+1)%3];n.set(this[h],this[f]);for(let g=0;g<3;g++){let v=e[g],p=e[(g+1)%3];s.set(o[v],o[p]),il(n,s,i,t);let m=i.distanceToSquared(t);m<u&&(u=m,a&&a.copy(i),l&&l.copy(t))}}return Math.sqrt(u)}})();var Le=class{constructor(t,e,n){this.isOrientedBox=!0,this.min=new I,this.max=new I,this.matrix=new Tt,this.invMatrix=new Tt,this.points=new Array(8).fill().map(()=>new I),this.satAxes=new Array(3).fill().map(()=>new I),this.satBounds=new Array(3).fill().map(()=>new Wn),this.alignedSatBounds=new Array(3).fill().map(()=>new Wn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}};Le.prototype.update=(function(){return function(){let t=this.matrix,e=this.min,n=this.max,s=this.points;for(let c=0;c<=1;c++)for(let u=0;u<=1;u++)for(let d=0;d<=1;d++){let h=1*c|2*u|4*d,f=s[h];f.x=c?n.x:e.x,f.y=u?n.y:e.y,f.z=d?n.z:e.z,f.applyMatrix4(t)}let r=this.satBounds,o=this.satAxes,a=s[0];for(let c=0;c<3;c++){let u=o[c],d=r[c],h=1<<c,f=s[h];u.subVectors(a,f),d.setFromPoints(u,s)}let l=this.alignedSatBounds;l[0].setFromPointsField(s,"x"),l[1].setFromPointsField(s,"y"),l[2].setFromPointsField(s,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}})();Le.prototype.intersectsBox=(function(){let i=new Wn;return function(e){this.needsUpdate&&this.update();let n=e.min,s=e.max,r=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(i.min=n.x,i.max=s.x,a[0].isSeparated(i)||(i.min=n.y,i.max=s.y,a[1].isSeparated(i))||(i.min=n.z,i.max=s.z,a[2].isSeparated(i)))return!1;for(let l=0;l<3;l++){let c=o[l],u=r[l];if(i.setFromBox(c,e),u.isSeparated(i))return!1}return!0}})();Le.prototype.intersectsTriangle=(function(){let i=new ln,t=new Array(3),e=new Wn,n=new Wn,s=new I;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(i.copy(o),i.update(),o=i);let a=this.satBounds,l=this.satAxes;t[0]=o.a,t[1]=o.b,t[2]=o.c;for(let h=0;h<3;h++){let f=a[h],g=l[h];if(e.setFromPoints(g,t),f.isSeparated(e))return!1}let c=o.satBounds,u=o.satAxes,d=this.points;for(let h=0;h<3;h++){let f=c[h],g=u[h];if(e.setFromPoints(g,d),f.isSeparated(e))return!1}for(let h=0;h<3;h++){let f=l[h];for(let g=0;g<4;g++){let v=u[g];if(s.crossVectors(f,v),e.setFromPoints(s,t),n.setFromPoints(s,d),e.isSeparated(n))return!1}}return!0}})();Le.prototype.closestPointToPoint=(function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}})();Le.prototype.distanceToPoint=(function(){let i=new I;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}})();Le.prototype.distanceToBox=(function(){let i=["x","y","z"],t=new Array(12).fill().map(()=>new Rn),e=new Array(12).fill().map(()=>new Rn),n=new I,s=new I;return function(o,a=0,l=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(l||c)&&(o.getCenter(s),this.closestPointToPoint(s,n),o.closestPointToPoint(n,s),l&&l.copy(n),c&&c.copy(s)),0;let u=a*a,d=o.min,h=o.max,f=this.points,g=1/0;for(let p=0;p<8;p++){let m=f[p];s.copy(m).clamp(d,h);let x=m.distanceToSquared(s);if(x<g&&(g=x,l&&l.copy(m),c&&c.copy(s),x<u))return Math.sqrt(x)}let v=0;for(let p=0;p<3;p++)for(let m=0;m<=1;m++)for(let x=0;x<=1;x++){let S=(p+1)%3,y=(p+2)%3,M=m<<S|x<<y,w=1<<p|m<<S|x<<y,_=f[M],b=f[w];t[v].set(_,b);let A=i[p],R=i[S],L=i[y],O=e[v],N=O.start,z=O.end;N[A]=d[A],N[R]=m?d[R]:h[R],N[L]=x?d[L]:h[L],z[A]=h[A],z[R]=m?d[R]:h[R],z[L]=x?d[L]:h[L],v++}for(let p=0;p<=1;p++)for(let m=0;m<=1;m++)for(let x=0;x<=1;x++){s.x=p?h.x:d.x,s.y=m?h.y:d.y,s.z=x?h.z:d.z,this.closestPointToPoint(s,n);let S=s.distanceToSquared(n);if(S<g&&(g=S,l&&l.copy(n),c&&c.copy(s),S<u))return Math.sqrt(S)}for(let p=0;p<12;p++){let m=t[p];for(let x=0;x<12;x++){let S=e[x];il(m,S,n,s);let y=n.distanceToSquared(s);if(y<g&&(g=y,l&&l.copy(n),c&&c.copy(s),y<u))return Math.sqrt(y)}}return Math.sqrt(g)}})();var Bf=class extends Ds{constructor(){super(()=>new ln)}},Cn=new Bf;var sl=new I,zf=new I;function o_(i,t,e={},n=0,s=1/0){let r=n*n,o=s*s,a=1/0,l=null;if(i.shapecast({boundsTraverseOrder:u=>(sl.copy(t).clamp(u.min,u.max),sl.distanceToSquared(t)),intersectsBounds:(u,d,h)=>h<a&&h<o,intersectsTriangle:(u,d)=>{u.closestPointToPoint(t,sl);let h=t.distanceToSquared(sl);return h<a&&(zf.copy(sl),a=h,l=d),h<r}}),a===1/0)return null;let c=Math.sqrt(a);return e.point?e.point.copy(zf):e.point=zf.clone(),e.distance=c,e.faceIndex=l,e}var Uu=parseInt("187")>=169,zb=parseInt("187")<=161,_r=new I,xr=new I,yr=new I,Ou=new xt,Fu=new xt,Bu=new xt,a_=new I,l_=new I,c_=new I,rl=new I;function kb(i,t,e,n,s,r,o,a){let l;if(r===qe?l=i.intersectTriangle(n,e,t,!0,s):l=i.intersectTriangle(t,e,n,r!==Ie,s),l===null)return null;let c=i.origin.distanceTo(s);return c<o||c>a?null:{distance:c,point:s.clone()}}function u_(i,t,e,n,s,r,o,a,l,c,u){_r.fromBufferAttribute(t,r),xr.fromBufferAttribute(t,o),yr.fromBufferAttribute(t,a);let d=kb(i,_r,xr,yr,rl,l,c,u);if(d){if(n){Ou.fromBufferAttribute(n,r),Fu.fromBufferAttribute(n,o),Bu.fromBufferAttribute(n,a),d.uv=new xt;let f=an.getInterpolation(rl,_r,xr,yr,Ou,Fu,Bu,d.uv);Uu||(d.uv=f)}if(s){Ou.fromBufferAttribute(s,r),Fu.fromBufferAttribute(s,o),Bu.fromBufferAttribute(s,a),d.uv1=new xt;let f=an.getInterpolation(rl,_r,xr,yr,Ou,Fu,Bu,d.uv1);Uu||(d.uv1=f),zb&&(d.uv2=d.uv1)}if(e){a_.fromBufferAttribute(e,r),l_.fromBufferAttribute(e,o),c_.fromBufferAttribute(e,a),d.normal=new I;let f=an.getInterpolation(rl,_r,xr,yr,a_,l_,c_,d.normal);d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1),Uu||(d.normal=f)}let h={a:r,b:o,c:a,normal:new I,materialIndex:0};if(an.getNormal(_r,xr,yr,h.normal),d.face=h,d.faceIndex=r,Uu){let f=new I;an.getBarycoord(rl,_r,xr,yr,f),d.barycoord=f}}return d}function h_(i){return i&&i.isMaterial?i.side:i}function Uo(i,t,e,n,s,r,o){let a=n*3,l=a+0,c=a+1,u=a+2,{index:d,groups:h}=i;i.index&&(l=d.getX(l),c=d.getX(c),u=d.getX(u));let{position:f,normal:g,uv:v,uv1:p}=i.attributes;if(Array.isArray(t)){let m=n*3;for(let x=0,S=h.length;x<S;x++){let{start:y,count:M,materialIndex:w}=h[x];if(m>=y&&m<y+M){let _=h_(t[w]),b=u_(e,f,g,v,p,l,c,u,_,r,o);if(b)if(b.faceIndex=n,b.face.materialIndex=w,s)s.push(b);else return b}}}else{let m=h_(t),x=u_(e,f,g,v,p,l,c,u,m,r,o);if(x)if(x.faceIndex=n,x.face.materialIndex=0,s)s.push(x);else return x}return null}function ye(i,t,e,n){let s=i.a,r=i.b,o=i.c,a=t,l=t+1,c=t+2;e&&(a=e.getX(a),l=e.getX(l),c=e.getX(c)),s.x=n.getX(a),s.y=n.getY(a),s.z=n.getZ(a),r.x=n.getX(l),r.y=n.getY(l),r.z=n.getZ(l),o.x=n.getX(c),o.y=n.getY(c),o.z=n.getZ(c)}function d_(i,t,e,n,s,r,o,a){let{geometry:l,_indirectBuffer:c}=i;for(let u=n,d=n+s;u<d;u++)Uo(l,t,e,u,r,o,a)}function f_(i,t,e,n,s,r,o){let{geometry:a,_indirectBuffer:l}=i,c=1/0,u=null;for(let d=n,h=n+s;d<h;d++){let f;f=Uo(a,t,e,d,null,r,o),f&&f.distance<c&&(u=f,c=f.distance)}return u}function p_(i,t,e,n,s,r,o){let{geometry:a}=e,{index:l}=a,c=a.attributes.position;for(let u=i,d=t+i;u<d;u++){let h;if(h=u,ye(o,h*3,l,c),o.needsUpdate=!0,n(o,h,s,r))return!0}return!1}function m_(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));let e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position,r,o,a,l,c=0,u=i._roots;for(let h=0,f=u.length;h<f;h++)r=u[h],o=new Uint32Array(r),a=new Uint16Array(r),l=new Float32Array(r),d(0,c),c+=r.byteLength;function d(h,f,g=!1){let v=h*2;if(Qt(v,a)){let p=le(h,o),m=de(v,a),x=1/0,S=1/0,y=1/0,M=-1/0,w=-1/0,_=-1/0;for(let b=3*p,P=3*(p+m);b<P;b++){let A=n[b],R=s.getX(A),L=s.getY(A),O=s.getZ(A);R<x&&(x=R),R>M&&(M=R),L<S&&(S=L),L>w&&(w=L),O<y&&(y=O),O>_&&(_=O)}return l[h+0]!==x||l[h+1]!==S||l[h+2]!==y||l[h+3]!==M||l[h+4]!==w||l[h+5]!==_?(l[h+0]=x,l[h+1]=S,l[h+2]=y,l[h+3]=M,l[h+4]=w,l[h+5]=_,!0):!1}else{let p=re(h),m=oe(h,o),x=g,S=!1,y=!1;if(t){if(!x){let A=p/8+f/32,R=m/8+f/32;S=t.has(A),y=t.has(R),x=!S&&!y}}else S=!0,y=!0;let M=x||S,w=x||y,_=!1;M&&(_=d(p,f,x));let b=!1;w&&(b=d(m,f,x));let P=_||b;if(P)for(let A=0;A<3;A++){let R=p+A,L=m+A,O=l[R],N=l[R+3],z=l[L],G=l[L+3];l[h+A]=O<z?O:z,l[h+A+3]=N>G?N:G}return P}}}function xn(i,t,e,n,s){let r,o,a,l,c,u,d=1/e.direction.x,h=1/e.direction.y,f=1/e.direction.z,g=e.origin.x,v=e.origin.y,p=e.origin.z,m=t[i],x=t[i+3],S=t[i+1],y=t[i+3+1],M=t[i+2],w=t[i+3+2];return d>=0?(r=(m-g)*d,o=(x-g)*d):(r=(x-g)*d,o=(m-g)*d),h>=0?(a=(S-v)*h,l=(y-v)*h):(a=(y-v)*h,l=(S-v)*h),r>l||a>o||((a>r||isNaN(r))&&(r=a),(l<o||isNaN(o))&&(o=l),f>=0?(c=(M-p)*f,u=(w-p)*f):(c=(w-p)*f,u=(M-p)*f),r>u||c>o)?!1:((c>r||r!==r)&&(r=c),(u<o||o!==o)&&(o=u),r<=s&&o>=n)}function g_(i,t,e,n,s,r,o,a){let{geometry:l,_indirectBuffer:c}=i;for(let u=n,d=n+s;u<d;u++){let h=c?c[u]:u;Uo(l,t,e,h,r,o,a)}}function __(i,t,e,n,s,r,o){let{geometry:a,_indirectBuffer:l}=i,c=1/0,u=null;for(let d=n,h=n+s;d<h;d++){let f;f=Uo(a,t,e,l?l[d]:d,null,r,o),f&&f.distance<c&&(u=f,c=f.distance)}return u}function x_(i,t,e,n,s,r,o){let{geometry:a}=e,{index:l}=a,c=a.attributes.position;for(let u=i,d=t+i;u<d;u++){let h;if(h=e.resolveTriangleIndex(u),ye(o,h*3,l,c),o.needsUpdate=!0,n(o,h,s,r))return!0}return!1}function y_(i,t,e,n,s,r,o){Yt.setBuffer(i._roots[t]),xn(0,Yt.float32Array,n,r,o)&&kf(0,i,e,n,s,r,o),Yt.clearBuffer()}function kf(i,t,e,n,s,r,o){let{float32Array:a,uint16Array:l,uint32Array:c}=Yt,u=i*2;if(Qt(u,l)){let h=le(i,c),f=de(u,l);d_(t,e,n,h,f,s,r,o)}else{let h=re(i);xn(h,a,n,r,o)&&kf(h,t,e,n,s,r,o);let f=oe(i,c);xn(f,a,n,r,o)&&kf(f,t,e,n,s,r,o)}}var Hb=["x","y","z"];function v_(i,t,e,n,s,r){Yt.setBuffer(i._roots[t]);let o=null;return xn(0,Yt.float32Array,n,s,r)&&(o=Hf(0,i,e,n,s,r)),Yt.clearBuffer(),o}function Hf(i,t,e,n,s,r){let{float32Array:o,uint16Array:a,uint32Array:l}=Yt,c=i*2;if(Qt(c,a)){let d=le(i,l),h=de(c,a);return f_(t,e,n,d,h,s,r)}else{let d=Ao(i,l),h=Hb[d],g=n.direction[h]>=0,v,p;g?(v=re(i),p=oe(i,l)):(v=oe(i,l),p=re(i));let x=xn(v,o,n,s,r)?Hf(v,t,e,n,s,r):null;if(x){let M=x.point[h];if(g?M<=o[p+d]:M>=o[p+d+3])return x}let y=xn(p,o,n,s,r)?Hf(p,t,e,n,s,r):null;return x&&y?x.distance<=y.distance?x:y:x||y||null}}var zu=new jt,Oo=new ln,Fo=new ln,ol=new Tt,S_=new Le,ku=new Le;function M_(i,t,e,n){Yt.setBuffer(i._roots[t]);let s=Vf(0,i,e,n);return Yt.clearBuffer(),s}function Vf(i,t,e,n,s=null){let{float32Array:r,uint16Array:o,uint32Array:a}=Yt,l=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),S_.set(e.boundingBox.min,e.boundingBox.max,n),s=S_),Qt(l,o)){let u=t.geometry,d=u.index,h=u.attributes.position,f=e.index,g=e.attributes.position,v=le(i,a),p=de(l,o);if(ol.copy(n).invert(),e.boundsTree)return xe(i,r,ku),ku.matrix.copy(ol),ku.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:x=>ku.intersectsBox(x),intersectsTriangle:x=>{x.a.applyMatrix4(n),x.b.applyMatrix4(n),x.c.applyMatrix4(n),x.needsUpdate=!0;for(let S=v*3,y=(p+v)*3;S<y;S+=3)if(ye(Fo,S,d,h),Fo.needsUpdate=!0,x.intersectsTriangle(Fo))return!0;return!1}});{let m=Fs(e);for(let x=v*3,S=(p+v)*3;x<S;x+=3){ye(Oo,x,d,h),Oo.a.applyMatrix4(ol),Oo.b.applyMatrix4(ol),Oo.c.applyMatrix4(ol),Oo.needsUpdate=!0;for(let y=0,M=m*3;y<M;y+=3)if(ye(Fo,y,f,g),Fo.needsUpdate=!0,Oo.intersectsTriangle(Fo))return!0}}}else{let u=re(i),d=oe(i,a);return xe(u,r,zu),!!(s.intersectsBox(zu)&&Vf(u,t,e,n,s)||(xe(d,r,zu),s.intersectsBox(zu)&&Vf(d,t,e,n,s)))}}var Hu=new Tt,Gf=new Le,al=new Le,Vb=new I,Gb=new I,Wb=new I,Xb=new I;function b_(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),Gf.set(t.boundingBox.min,t.boundingBox.max,e),Gf.needsUpdate=!0;let a=i.geometry,l=a.attributes.position,c=a.index,u=t.attributes.position,d=t.index,h=Cn.getPrimitive(),f=Cn.getPrimitive(),g=Vb,v=Gb,p=null,m=null;s&&(p=Wb,m=Xb);let x=1/0,S=null,y=null;return Hu.copy(e).invert(),al.matrix.copy(Hu),i.shapecast({boundsTraverseOrder:M=>Gf.distanceToBox(M),intersectsBounds:(M,w,_)=>_<x&&_<o?(w&&(al.min.copy(M.min),al.max.copy(M.max),al.needsUpdate=!0),!0):!1,intersectsRange:(M,w)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:b=>al.distanceToBox(b),intersectsBounds:(b,P,A)=>A<x&&A<o,intersectsRange:(b,P)=>{for(let A=b,R=b+P;A<R;A++){ye(f,3*A,d,u),f.a.applyMatrix4(e),f.b.applyMatrix4(e),f.c.applyMatrix4(e),f.needsUpdate=!0;for(let L=M,O=M+w;L<O;L++){ye(h,3*L,c,l),h.needsUpdate=!0;let N=h.distanceToTriangle(f,g,p);if(N<x&&(v.copy(g),m&&m.copy(p),x=N,S=L,y=A),N<r)return!0}}}});{let _=Fs(t);for(let b=0,P=_;b<P;b++){ye(f,3*b,d,u),f.a.applyMatrix4(e),f.b.applyMatrix4(e),f.c.applyMatrix4(e),f.needsUpdate=!0;for(let A=M,R=M+w;A<R;A++){ye(h,3*A,c,l),h.needsUpdate=!0;let L=h.distanceToTriangle(f,g,p);if(L<x&&(v.copy(g),m&&m.copy(p),x=L,S=A,y=b),L<r)return!0}}}}}),Cn.releasePrimitive(h),Cn.releasePrimitive(f),x===1/0?null:(n.point?n.point.copy(v):n.point=v.clone(),n.distance=x,n.faceIndex=S,s&&(s.point?s.point.copy(m):s.point=m.clone(),s.point.applyMatrix4(Hu),v.applyMatrix4(Hu),s.distance=v.sub(s.point).length(),s.faceIndex=y),n)}function T_(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));let e=i.geometry,n=e.index?e.index.array:null,s=e.attributes.position,r,o,a,l,c=0,u=i._roots;for(let h=0,f=u.length;h<f;h++)r=u[h],o=new Uint32Array(r),a=new Uint16Array(r),l=new Float32Array(r),d(0,c),c+=r.byteLength;function d(h,f,g=!1){let v=h*2;if(Qt(v,a)){let p=le(h,o),m=de(v,a),x=1/0,S=1/0,y=1/0,M=-1/0,w=-1/0,_=-1/0;for(let b=p,P=p+m;b<P;b++){let A=3*i.resolveTriangleIndex(b);for(let R=0;R<3;R++){let L=A+R;L=n?n[L]:L;let O=s.getX(L),N=s.getY(L),z=s.getZ(L);O<x&&(x=O),O>M&&(M=O),N<S&&(S=N),N>w&&(w=N),z<y&&(y=z),z>_&&(_=z)}}return l[h+0]!==x||l[h+1]!==S||l[h+2]!==y||l[h+3]!==M||l[h+4]!==w||l[h+5]!==_?(l[h+0]=x,l[h+1]=S,l[h+2]=y,l[h+3]=M,l[h+4]=w,l[h+5]=_,!0):!1}else{let p=re(h),m=oe(h,o),x=g,S=!1,y=!1;if(t){if(!x){let A=p/8+f/32,R=m/8+f/32;S=t.has(A),y=t.has(R),x=!S&&!y}}else S=!0,y=!0;let M=x||S,w=x||y,_=!1;M&&(_=d(p,f,x));let b=!1;w&&(b=d(m,f,x));let P=_||b;if(P)for(let A=0;A<3;A++){let R=p+A,L=m+A,O=l[R],N=l[R+3],z=l[L],G=l[L+3];l[h+A]=O<z?O:z,l[h+A+3]=N>G?N:G}return P}}}function w_(i,t,e,n,s,r,o){Yt.setBuffer(i._roots[t]),xn(0,Yt.float32Array,n,r,o)&&Wf(0,i,e,n,s,r,o),Yt.clearBuffer()}function Wf(i,t,e,n,s,r,o){let{float32Array:a,uint16Array:l,uint32Array:c}=Yt,u=i*2;if(Qt(u,l)){let h=le(i,c),f=de(u,l);g_(t,e,n,h,f,s,r,o)}else{let h=re(i);xn(h,a,n,r,o)&&Wf(h,t,e,n,s,r,o);let f=oe(i,c);xn(f,a,n,r,o)&&Wf(f,t,e,n,s,r,o)}}var qb=["x","y","z"];function E_(i,t,e,n,s,r){Yt.setBuffer(i._roots[t]);let o=null;return xn(0,Yt.float32Array,n,s,r)&&(o=Xf(0,i,e,n,s,r)),Yt.clearBuffer(),o}function Xf(i,t,e,n,s,r){let{float32Array:o,uint16Array:a,uint32Array:l}=Yt,c=i*2;if(Qt(c,a)){let d=le(i,l),h=de(c,a);return __(t,e,n,d,h,s,r)}else{let d=Ao(i,l),h=qb[d],g=n.direction[h]>=0,v,p;g?(v=re(i),p=oe(i,l)):(v=oe(i,l),p=re(i));let x=xn(v,o,n,s,r)?Xf(v,t,e,n,s,r):null;if(x){let M=x.point[h];if(g?M<=o[p+d]:M>=o[p+d+3])return x}let y=xn(p,o,n,s,r)?Xf(p,t,e,n,s,r):null;return x&&y?x.distance<=y.distance?x:y:x||y||null}}var Vu=new jt,Bo=new ln,zo=new ln,ll=new Tt,A_=new Le,Gu=new Le;function R_(i,t,e,n){Yt.setBuffer(i._roots[t]);let s=qf(0,i,e,n);return Yt.clearBuffer(),s}function qf(i,t,e,n,s=null){let{float32Array:r,uint16Array:o,uint32Array:a}=Yt,l=i*2;if(s===null&&(e.boundingBox||e.computeBoundingBox(),A_.set(e.boundingBox.min,e.boundingBox.max,n),s=A_),Qt(l,o)){let u=t.geometry,d=u.index,h=u.attributes.position,f=e.index,g=e.attributes.position,v=le(i,a),p=de(l,o);if(ll.copy(n).invert(),e.boundsTree)return xe(i,r,Gu),Gu.matrix.copy(ll),Gu.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:x=>Gu.intersectsBox(x),intersectsTriangle:x=>{x.a.applyMatrix4(n),x.b.applyMatrix4(n),x.c.applyMatrix4(n),x.needsUpdate=!0;for(let S=v,y=p+v;S<y;S++)if(ye(zo,3*t.resolveTriangleIndex(S),d,h),zo.needsUpdate=!0,x.intersectsTriangle(zo))return!0;return!1}});{let m=Fs(e);for(let x=v,S=p+v;x<S;x++){let y=t.resolveTriangleIndex(x);ye(Bo,3*y,d,h),Bo.a.applyMatrix4(ll),Bo.b.applyMatrix4(ll),Bo.c.applyMatrix4(ll),Bo.needsUpdate=!0;for(let M=0,w=m*3;M<w;M+=3)if(ye(zo,M,f,g),zo.needsUpdate=!0,Bo.intersectsTriangle(zo))return!0}}}else{let u=re(i),d=oe(i,a);return xe(u,r,Vu),!!(s.intersectsBox(Vu)&&qf(u,t,e,n,s)||(xe(d,r,Vu),s.intersectsBox(Vu)&&qf(d,t,e,n,s)))}}var Wu=new Tt,Yf=new Le,cl=new Le,Yb=new I,$b=new I,Kb=new I,Zb=new I;function C_(i,t,e,n={},s={},r=0,o=1/0){t.boundingBox||t.computeBoundingBox(),Yf.set(t.boundingBox.min,t.boundingBox.max,e),Yf.needsUpdate=!0;let a=i.geometry,l=a.attributes.position,c=a.index,u=t.attributes.position,d=t.index,h=Cn.getPrimitive(),f=Cn.getPrimitive(),g=Yb,v=$b,p=null,m=null;s&&(p=Kb,m=Zb);let x=1/0,S=null,y=null;return Wu.copy(e).invert(),cl.matrix.copy(Wu),i.shapecast({boundsTraverseOrder:M=>Yf.distanceToBox(M),intersectsBounds:(M,w,_)=>_<x&&_<o?(w&&(cl.min.copy(M.min),cl.max.copy(M.max),cl.needsUpdate=!0),!0):!1,intersectsRange:(M,w)=>{if(t.boundsTree){let _=t.boundsTree;return _.shapecast({boundsTraverseOrder:b=>cl.distanceToBox(b),intersectsBounds:(b,P,A)=>A<x&&A<o,intersectsRange:(b,P)=>{for(let A=b,R=b+P;A<R;A++){let L=_.resolveTriangleIndex(A);ye(f,3*L,d,u),f.a.applyMatrix4(e),f.b.applyMatrix4(e),f.c.applyMatrix4(e),f.needsUpdate=!0;for(let O=M,N=M+w;O<N;O++){let z=i.resolveTriangleIndex(O);ye(h,3*z,c,l),h.needsUpdate=!0;let G=h.distanceToTriangle(f,g,p);if(G<x&&(v.copy(g),m&&m.copy(p),x=G,S=O,y=A),G<r)return!0}}}})}else{let _=Fs(t);for(let b=0,P=_;b<P;b++){ye(f,3*b,d,u),f.a.applyMatrix4(e),f.b.applyMatrix4(e),f.c.applyMatrix4(e),f.needsUpdate=!0;for(let A=M,R=M+w;A<R;A++){let L=i.resolveTriangleIndex(A);ye(h,3*L,c,l),h.needsUpdate=!0;let O=h.distanceToTriangle(f,g,p);if(O<x&&(v.copy(g),m&&m.copy(p),x=O,S=A,y=b),O<r)return!0}}}}}),Cn.releasePrimitive(h),Cn.releasePrimitive(f),x===1/0?null:(n.point?n.point.copy(v):n.point=v.clone(),n.distance=x,n.faceIndex=S,s&&(s.point?s.point.copy(m):s.point=m.clone(),s.point.applyMatrix4(Wu),v.applyMatrix4(Wu),s.distance=v.sub(s.point).length(),s.faceIndex=y),n)}function $f(i,t,e){return i===null?null:(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i)}var Xu=new Le,qu=new Qn,P_=new I,I_=new Tt,L_=new I,Kf=["getX","getY","getZ"],Yu=class i extends Du{static serialize(t,e={}){e={cloneBuffers:!0,...e};let n=t.geometry,s=t._roots,r=t._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return e.cloneBuffers?(a.roots=s.map(l=>l.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=r?r.slice():null):(a.roots=s,a.index=o?o.array:null,a.indirectBuffer=r),a}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};let{index:s,roots:r,indirectBuffer:o}=t;t.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),l(r));let a=new i(e,{...n,[tl]:!0});if(a._roots=r,a._indirectBuffer=o||null,n.setIndex){let c=e.getIndex();if(c===null){let u=new we(t.index,1,!1);e.setIndex(u)}else c.array!==s&&(c.array.set(s),c.needsUpdate=!0)}return a;function l(c){for(let u=0;u<c.length;u++){let d=c[u],h=new Uint32Array(d),f=new Uint16Array(d);for(let g=0,v=d.byteLength/32;g<v;g++){let p=8*g,m=2*p;Qt(m,f)||(h[p+6]=h[p+6]/8-g)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(t,e={}){e.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafTris}),super(t,e)}shiftTriangleOffsets(t){return super.shiftPrimitiveOffsets(t)}writePrimitiveBounds(t,e,n){let s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,c=(r?r[t]:t)*3,u=c+0,d=c+1,h=c+2;a&&(u=a[u],d=a[d],h=a[h]);for(let f=0;f<3;f++){let g=o[Kf[f]](u),v=o[Kf[f]](d),p=o[Kf[f]](h),m=g;v<m&&(m=v),p<m&&(m=p);let x=g;v>x&&(x=v),p>x&&(x=p),e[n+f]=m,e[n+f+3]=x}return e}computePrimitiveBounds(t,e,n){let s=this.geometry,r=this._indirectBuffer,o=s.attributes.position,a=s.index?s.index.array:null,l=o.normalized;if(t<0||e+t-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");let c=o.array,u=o.offset||0,d=3;o.isInterleavedBufferAttribute&&(d=o.data.stride);let h=["getX","getY","getZ"],f=n.offset;for(let g=t,v=t+e;g<v;g++){let m=(r?r[g]:g)*3,x=(g-f)*6,S=m+0,y=m+1,M=m+2;a&&(S=a[S],y=a[y],M=a[M]),l||(S=S*d+u,y=y*d+u,M=M*d+u);for(let w=0;w<3;w++){let _,b,P;l?(_=o[h[w]](S),b=o[h[w]](y),P=o[h[w]](M)):(_=c[S+w],b=c[y+w],P=c[M+w]);let A=_;b<A&&(A=b),P<A&&(A=P);let R=_;b>R&&(R=b),P>R&&(R=P);let L=(R-A)/2,O=w*2;n[x+O+0]=A+L,n[x+O+1]=L+(Math.abs(A)+L)*Eo}}return n}raycastObject3D(t,e,n=[]){let{material:s}=t;if(s===void 0)return;I_.copy(t.matrixWorld).invert(),qu.copy(e.ray).applyMatrix4(I_),L_.setFromMatrixScale(t.matrixWorld),P_.copy(qu.direction).multiply(L_);let r=P_.length(),o=e.near/r,a=e.far/r;if(e.firstHitOnly===!0){let l=this.raycastFirst(qu,s,o,a);l=$f(l,t,e),l&&n.push(l)}else{let l=this.raycast(qu,s,o,a);for(let c=0,u=l.length;c<u;c++){let d=$f(l[c],t,e);d&&n.push(d)}}return n}refit(t=null){return(this.indirect?T_:m_)(this,t)}raycast(t,e=Vn,n=0,s=1/0){let r=this._roots,o=[],a=this.indirect?w_:y_;for(let l=0,c=r.length;l<c;l++)a(this,l,e,t,o,n,s);return o}raycastFirst(t,e=Vn,n=0,s=1/0){let r=this._roots,o=null,a=this.indirect?E_:v_;for(let l=0,c=r.length;l<c;l++){let u=a(this,l,e,t,n,s);u!=null&&(o==null||u.distance<o.distance)&&(o=u)}return o}intersectsGeometry(t,e){let n=!1,s=this._roots,r=this.indirect?R_:M_;for(let o=0,a=s.length;o<a&&(n=r(this,o,t,e),!n);o++);return n}shapecast(t){let e=Cn.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsTriangle,scratchPrimitive:e,iterate:this.indirect?x_:p_});return Cn.releasePrimitive(e),n}bvhcast(t,e,n){let{intersectsRanges:s,intersectsTriangles:r}=n,o=Cn.getPrimitive(),a=this.geometry.index,l=this.geometry.attributes.position,c=this.indirect?g=>{let v=this.resolveTriangleIndex(g);ye(o,v*3,a,l)}:g=>{ye(o,g*3,a,l)},u=Cn.getPrimitive(),d=t.geometry.index,h=t.geometry.attributes.position,f=t.indirect?g=>{let v=t.resolveTriangleIndex(g);ye(u,v*3,d,h)}:g=>{ye(u,g*3,d,h)};if(r){if(!(t instanceof i))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');let g=(v,p,m,x,S,y,M,w)=>{for(let _=m,b=m+x;_<b;_++){f(_),u.a.applyMatrix4(e),u.b.applyMatrix4(e),u.c.applyMatrix4(e),u.needsUpdate=!0;for(let P=v,A=v+p;P<A;P++)if(c(P),o.needsUpdate=!0,r(o,u,P,_,S,y,M,w))return!0}return!1};if(s){let v=s;s=function(p,m,x,S,y,M,w,_){return v(p,m,x,S,y,M,w,_)?!0:g(p,m,x,S,y,M,w,_)}}else s=g}return super.bvhcast(t,e,{intersectsRanges:s})}intersectsBox(t,e){return Xu.set(t.min,t.max,e),Xu.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Xu.intersectsBox(n),intersectsTriangle:n=>Xu.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},s={},r=0,o=1/0){return(this.indirect?C_:b_)(this,t,e,n,s,r,o)}closestPointToPoint(t,e={},n=0,s=1/0){return o_(this,t,e,n,s)}};var LC=parseInt("187")>=166,ko={Mesh:Jt.prototype.raycast,Line:bi.prototype.raycast,LineSegments:bs.prototype.raycast,LineLoop:Ts.prototype.raycast,Points:ws.prototype.raycast,BatchedMesh:Sa.prototype.raycast},cn=new Jt,$u=[];function N_(i,t){if(this.isBatchedMesh)jb.call(this,i,t);else{let{geometry:e}=this;if(e.boundsTree)e.boundsTree.raycastObject3D(this,i,t);else{let n;if(this instanceof Jt)n=ko.Mesh;else if(this instanceof bs)n=ko.LineSegments;else if(this instanceof Ts)n=ko.LineLoop;else if(this instanceof bi)n=ko.Line;else if(this instanceof ws)n=ko.Points;else throw new Error("BVH: Fallback raycast function not found.");n.call(this,i,t)}}}function jb(i,t){if(this.boundsTrees){let e=this.boundsTrees,n=this._drawInfo||this._instanceInfo,s=this._drawRanges||this._geometryInfo,r=this.matrixWorld;cn.material=this.material,cn.geometry=this.geometry;let o=cn.geometry.boundsTree,a=cn.geometry.drawRange;cn.geometry.boundingSphere===null&&(cn.geometry.boundingSphere=new ke);for(let l=0,c=n.length;l<c;l++){if(!this.getVisibleAt(l))continue;let u=n[l].geometryIndex;if(cn.geometry.boundsTree=e[u],this.getMatrixAt(l,cn.matrixWorld).premultiply(r),!cn.geometry.boundsTree){this.getBoundingBoxAt(u,cn.geometry.boundingBox),this.getBoundingSphereAt(u,cn.geometry.boundingSphere);let d=s[u];cn.geometry.setDrawRange(d.start,d.count)}cn.raycast(i,$u);for(let d=0,h=$u.length;d<h;d++){let f=$u[d];f.object=this,f.batchId=l,t.push(f)}$u.length=0}cn.geometry.boundsTree=o,cn.geometry.drawRange=a,cn.material=null,cn.geometry=null}else ko.BatchedMesh.call(this,i,t)}function D_(i={}){let{type:t=Yu}=i;return this.boundsTree=new t(this,i),this.boundsTree}function U_(){this.boundsTree=null}Ue.prototype.computeBoundsTree=D_;Ue.prototype.disposeBoundsTree=U_;Jt.prototype.raycast=N_;var he=JSON.parse(document.getElementById("data").textContent),G_=he.version,It=(i,t=document)=>t.querySelector(i),Er=(i,t=document)=>[...t.querySelectorAll(i)],kt=i=>String(i??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Ws=i=>String(i||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ł/g,"l").replace(/Ł/g,"L").toLowerCase(),pi=Object.fromEntries(he.regions),Jb=["bark","ramie","przedramie","dlon","glowa"],ne=he.groups,Bn=new Map(he.muscles.map(i=>[i.id,i])),Sn=new Map(he.bones.map(i=>[i.id,i])),Mr=new Map(he.lms.map(i=>[i.id,i])),ds=he.joints,Ae=new Map(ds.map(i=>[i.id,i])),mi=he.shapes,np=he.mid,W_=new Set(he.bones.filter(i=>i.kind==="axial"||/sternum|Xiphoid|^Vertebra/.test(i.en)).map(i=>i.id)),as=i=>Object.prototype.hasOwnProperty.call(he.groups,i),Xn=new Map,dl=new Map;for(let i of ds)for(let t of i.pairs){let e=t[1].filter(as),n=t[3].filter(as);for(let[s,r]of[[e,t[0]],[n,t[2]]])for(let o of s)dl.has(o)||dl.set(o,[]),dl.get(o).some(a=>a.j===i.id&&a.ruch===r)||dl.get(o).push({j:i.id,ruch:r});for(let s of e)for(let r of n)s!==r&&(Xn.has(s)||Xn.set(s,new Set),Xn.has(r)||Xn.set(r,new Set),Xn.get(s).add(r),Xn.get(r).add(s))}var ju=new Map;for(let i of ds)for(let t of i.caps)ju.has(t)||ju.set(t,[]),ju.get(t).push(i);var qo=new Set(["extret","flexret","palmapo"]);for(let[i,t]of Object.entries(ne))t.key=i,t.parts=he.muscles.filter(e=>e.grp===i),t.lms=[];var Go=new Map;for(let i of he.lms)Go.has(i.bone)||Go.set(i.bone,[]),Go.get(i.bone).push(i);var Vs=new Map,ml=new Map;for(let i of he.patches)Vs.has(i.grp)||Vs.set(i.grp,[]),Vs.get(i.grp).push(i),ml.has(i.bone)||ml.set(i.bone,[]),ml.get(i.bone).push(i);var nn=It("#c"),Ar=new gu({canvas:nn,antialias:!0,alpha:!0,powerPreference:"high-performance"});Ar.setPixelRatio(Math.min(window.devicePixelRatio||1,2));Ar.outputColorSpace=Ce;Ar.toneMapping=za;Ar.toneMappingExposure=.95;var Fi=new sr,Qb=new So(Ar);Fi.environment=Qb.fromScene(new Tu,.04).texture;Fi.environmentIntensity=.42;var Ze=new Ge(32,1,.01,30),Fe=new vu(Ze,nn);Fe.enableDamping=!0;Fe.dampingFactor=.09;Fe.minDistance=.025;Fe.maxDistance=4;Fe.screenSpacePanning=!0;Fe.rotateSpeed=.9;Fe.zoomSpeed=1;Fe.autoRotateSpeed=1.6;var X_=new es(16774118,1.05);X_.position.set(.6,1.2,1.4);Fi.add(X_);var q_=new es(12374783,.55);q_.position.set(-1.2,.4,-1);Fi.add(q_);Fi.add(new La(16777215,2764346,.22));var eh=new es(16777215,.22);Fi.add(eh,eh.target);var jf=!0,Xs=()=>{jf=!0};Fe.addEventListener("change",Xs);var tT=i=>{let t=0;for(let e of i)t=t*31+e.charCodeAt(0)>>>0;return t},eT=i=>{let t=tT(i),e=new At().setHSL((3+t%9)/360,.62+t%5*.02,.29+t%7*.012);return new Pe({color:e,roughness:.52,metalness:0,envMapIntensity:.9})},vn={bone:new Pe({color:15327433,roughness:.68,metalness:0,envMapIntensity:.8}),ctx:new Pe({color:12170926,roughness:.8,metalness:0}),ghost:new Pe({color:10134450,roughness:.9,transparent:!0,opacity:.11,depthWrite:!1}),ghostBone:new Pe({color:13620966,roughness:.9,transparent:!0,opacity:.16,depthWrite:!1}),cap:new Pe({color:11126783,roughness:.6,transparent:!0,opacity:.22,depthWrite:!1,side:Ie}),hiBone:new Pe({color:16769162,roughness:.5,emissive:3811840}),org:new Dn({color:3116287,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,side:Ie}),ins:new Dn({color:16753183,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,side:Ie})},Jf=["#ff4b3a","#35c46a","#f2c53d","#e05bd0","#2fc7d6","#9b7bff","#ff8a8a"],nh=Jf.map(i=>new Pe({color:i,roughness:.4,emissive:new At(i).multiplyScalar(.22),envMapIntensity:1})),Zf=new Map,nT=i=>(Zf.has(i.shape)||Zf.set(i.shape,new Pe({color:mi[i.shape].c,roughness:.5,transparent:!0,opacity:.5,depthWrite:!1,side:Ie,emissive:new At(mi[i.shape].c).multiplyScalar(.25)})),Zf.get(i.shape)),ls={};for(let i of Object.keys(ne))ls[i]=eT(i),qo.has(i)&&(ls[i].color.set(14271386),ls[i].roughness=.6,ls[i].side=Ie);var Y_=()=>({bones:!0,muscles:!0,ctx:!1,other:!1,att:!1,joints:!1,cap:!1,skull:!1,lig:!1,nerv:!1,vess:!1}),B={region:"all",tab:"mus",layers:Y_(),side:"r",hidden:new Set,sel:null,multiMode:!1,multi:new Map,ghostBg:!0,showPins:!1,muscleOpacity:1,axial:!1};try{let i=localStorage.getItem("anatomia.side");(i==="r"||i==="l"||i==="b")&&(B.side=i)}catch{}var O_=i=>({k:i,mus:new Map,bone:new Map,patch:new Map,cap:new Map,mk:new Map,str:new Map}),fe={r:O_("r"),l:O_("l")},yn={mus:fe.r.mus,bone:fe.r.bone,patch:fe.r.patch,str:fe.r.str,lm:new Map},yl=new Tn,Ko=new Tn;Fi.add(yl,Ko);Ko.scale.x=-1;Ko.position.x=2*np;var Tr=[],$_=[],Oi=new Map((he.structs||[]).map(i=>[i.id,i])),ip={lig:"lig",nerv:"nerv",art:"vess",ven:"vess"},Ku={lig:12576511,nerv:16765503,art:16726843,ven:3900150},Ju={lig:"#bfe6ff",nerv:"#ffd23f",art:"#ff3b3b",ven:"#3b82f6"},Qf={lig:"Wi\u0119zad\u0142o",nerv:"Nerw",art:"T\u0119tnica",ven:"\u017By\u0142a"},sp={},K_={};for(let i of Object.keys(Ku))sp[i]=new Pe({color:Ku[i],roughness:.55,metalness:0,side:Ie}),K_[i]=new Pe({color:Ku[i],emissive:Ku[i],emissiveIntensity:.55,roughness:.4,metalness:0,side:Ie});var Rr=()=>B.side==="l"?"l":"r",ks=(i,t,e)=>(fe[e]||fe[Rr()])[i].get(t),iT=()=>B.side==="b"?[fe.r,fe.l]:[fe[Rr()]],rp=(i,t)=>{let e=yn.lm.get(i);return e?(t||Rr())==="l"?new I(2*np-e.x,e.y,e.z):e:null},F_=It("#toast"),Wo=i=>{F_.textContent=i,F_.classList.toggle("show",!!i)},B_=It("#loading"),sT=It("#loadtxt"),rT=It("#loadbar"),gl={a:0,b:0,c:0},oT=()=>{let i=(gl.a+gl.b+gl.c)/3;rT.style.width=(i*100).toFixed(0)+"%"};function Xo(i,t){return new Promise((e,n)=>new Su().load(i,s=>e(s.scene),s=>{s.total&&t in gl&&(gl[t]=s.loaded/s.total,oT())},n))}var aT=new Aa(1,20,14),op=Promise.all([Xo("muscles.glb","a"),Xo("bones.glb","b"),Xo("joints.glb","c")]).then(([i,t,e])=>{i.updateMatrixWorld(!0),t.updateMatrixWorld(!0),e.updateMatrixWorld(!0);let n=new jt;i.traverse(a=>{if(!a.isMesh)return;let l=Bn.get(a.name);l&&(a.userData={kind:"mus",id:l.id,grp:l.grp,side:"r"},a.material=ls[l.grp],a.geometry.computeBoundsTree(),a.geometry.attributes.normal||a.geometry.computeVertexNormals(),yn.mus.set(l.id,a),n.expandByObject(a))}),t.traverse(a=>{if(!a.isMesh)return;let l=Sn.get(a.name);l?(a.userData={kind:"bone",id:l.id,side:"r"},a.material=l.kind==="ctx"?vn.ctx:vn.bone,a.geometry.computeBoundsTree(),yn.bone.set(l.id,a),n.expandByObject(a)):/^P\d+$/.test(a.name)&&(a.userData={kind:"patch",id:a.name,side:"r"},a.geometry.computeBoundsTree(),yn.patch.set(a.name,a))});let s=new Set(ds.filter(a=>a.mid).flatMap(a=>a.caps));e.traverse(a=>{a.isMesh&&/^C\d+$/.test(a.name)&&(a.userData={kind:"cap",id:a.name,side:"r"},a.material=vn.cap,a.visible=!1,fe.r.cap.set(a.name,a))});for(let a of he.lms)yn.lm.set(a.id,new I(a.p[0],a.p[1],a.p[2]));for(let a of[...yn.mus.values(),...yn.bone.values(),...yn.patch.values(),...fe.r.cap.values()])yl.attach(a);for(let a of yn.patch.values())a.visible=!1;let r=fe.l,o=a=>{let l=new Jt(a.geometry,a.material);return l.position.copy(a.position),l.quaternion.copy(a.quaternion),l.scale.copy(a.scale),l.userData={...a.userData,side:"l"},l.visible=a.visible,Ko.add(l),l};for(let[a,l]of yn.mus)r.mus.set(a,o(l));for(let[a,l]of yn.bone)r.bone.set(a,W_.has(a)?l:o(l));for(let[a,l]of yn.patch)r.patch.set(a,o(l));for(let[a,l]of fe.r.cap)s.has(a)||r.cap.set(a,o(l));for(let a of ds){let l=new Dn({color:mi[a.shape].c,transparent:!0,opacity:.45,depthTest:!1,depthWrite:!1});a.mat=l;let c=(u,d)=>{let h=d==="l"?2*np-u.p[0]:u.p[0],f=new Jt(aT,l);return f.position.set(h,u.p[1],u.p[2]),f.scale.setScalar(u.r*.6),f.renderOrder=6,f.visible=!1,f.userData={kind:"joint",id:a.id,side:d},Fi.add(f),$_.push(f),f};fe.r.mk.set(a.id,a.marks.map(u=>c(u,"r"))),a.mid||r.mk.set(a.id,a.marks.map(u=>c(u,"l")))}B.box=n;for(let a of[fe.r,fe.l])for(let l of[...a.mus.values(),...a.bone.values()])Tr.includes(l)||Tr.push(l);B_.classList.add("hide"),setTimeout(()=>B_.remove(),500)}).catch(i=>{sT.textContent="Nie uda\u0142o si\u0119 wczyta\u0107 modelu 3D: "+i.message,console.error(i)}),ul=null;function Yo(){return B.axial?Promise.resolve():ul||(Wo("Wczytywanie g\u0142owy i szyi (czaszka, kr\u0119gi, mi\u0119\u015Bnie)\u2026"),ul=op.then(()=>Promise.all([Xo("axial.glb","x"),Xo("headmus.glb","x")])).then(([i,t])=>{t.updateMatrixWorld(!0);let e=[];t.traverse(r=>{r.isMesh&&Bn.has(r.name)&&e.push(r)});let n=r=>{let o=new Jt(r.geometry,r.material);return o.position.copy(r.position),o.quaternion.copy(r.quaternion),o.scale.copy(r.scale),o.userData={...r.userData,side:"l"},o.visible=!1,Ko.add(o),o};for(let r of e){let o=Bn.get(r.name);r.userData={kind:"mus",id:o.id,grp:o.grp,side:"r"},r.material=ls[o.grp],r.geometry.computeBoundsTree(),r.visible=!1,yl.attach(r),yn.mus.set(o.id,r),fe.r.mus.set(o.id,r);let a=n(r);fe.l.mus.set(o.id,a),Tr.push(r,a)}i.updateMatrixWorld(!0);let s=[];i.traverse(r=>{r.isMesh&&Sn.has(r.name)&&s.push(r)});for(let r of s){let o=Sn.get(r.name);r.userData={kind:"bone",id:o.id,side:"r"},r.material=vn.bone,r.geometry.computeBoundsTree(),yl.attach(r),yn.bone.set(o.id,r),fe.l.bone.set(o.id,r),Tr.push(r)}B.axial=!0,Wo(""),Ne()}).catch(i=>{Wo("Nie uda\u0142o si\u0119 wczyta\u0107 czaszki: "+i.message),ul=null}),ul)}var lT=i=>{if(!i)return!1;if(i.t==="bone")return Sn.get(i.id)?.kind==="axial";if(i.t==="joint"){let t=Ae.get(i.id);return t.reg==="glowa"||t.bones.some(e=>Sn.get(e)?.kind==="axial")}return i.t==="grp"||i.t==="part"?ne[wr(i)].region==="glowa":!1},hl={};function Zo(i){return hl[i]||(Wo("Wczytywanie: "+{lig:"wi\u0119zad\u0142a",nerv:"nerwy",vess:"naczynia"}[i]+"\u2026"),hl[i]=op.then(()=>Xo(i+".glb","x")).then(t=>{t.updateMatrixWorld(!0);let e=[];t.traverse(n=>{n.isMesh&&Oi.has(n.name)&&e.push(n)});for(let n of e){let s=Oi.get(n.name);n.userData={kind:"str",id:s.id,side:"r"},n.material=sp[s.t],n.geometry.computeBoundsTree(),n.visible=!1,yl.attach(n),fe.r.str.set(s.id,n),yn.str.set(s.id,n);let r=new Jt(n.geometry,n.material);r.position.copy(n.position),r.quaternion.copy(n.quaternion),r.scale.copy(n.scale),r.userData={...n.userData,side:"l"},r.visible=!1,Ko.add(r),fe.l.str.set(s.id,r),Tr.push(n,r)}Wo(""),Ne()}).catch(t=>{Wo("Nie uda\u0142o si\u0119 wczyta\u0107: "+t.message),hl[i]=null})),hl[i]}function cT(i,t){B.layers[i]=t;let e=It("#l"+{lig:"Lig",nerv:"Nerv",vess:"Vess"}[i]);e&&(e.checked=t),t&&Zo(i)}var fi=i=>B.region==="all"||B.region===i,z_=i=>fi(i.reg)&&(i.reg!=="glowa"||B.layers.skull||B.region==="glowa");function uT(){let i=new Map(B.multi),t=B.sel;if(t&&(t.t==="grp"||t.t==="part")){let e=t.t==="grp"?t.id:Bn.get(t.id).grp;i.has(e)||i.set(e,0)}return i}function hT(i){let t=new Set;for(let e of i)for(let n of Vs.get(e)||[])t.add(n.bone);return t}function Ne(){if(!B.box)return;let i=B.sel,t=uT(),e=new Set(t.keys()),n=hT(e);if(!B.axial){for(let h of e)if(ne[h].region==="glowa"){Yo();break}}let s=i&&i.t==="joint"?Ae.get(i.id):null,r=new Set(s?s.bones:[]),o=B.layers.bones||i&&(i.t==="bone"||i.t==="lm")||!!s,a=!!i||t.size>0,l=i&&i.t==="bone"?i.id:i&&i.t==="lm"?Mr.get(i.id).bone:null,c=i&&i.t==="part"?i.id:null,u=new Map;for(let h of e)for(let f of Vs.get(h)||[])u.set(f.id,f.role);if(l)for(let h of ml.get(l)||[])u.set(h.id,h.role);if(B.layers.att)for(let h of he.patches)!u.has(h.id)&&fi(ne[h.grp].region)&&u.set(h.id,h.role);for(let h of[fe.r,fe.l]){let f=B.side==="b"||B.side===h.k;for(let[g,v]of h.str){let p=Oi.get(g),m=!!(i&&i.t==="str"&&i.id===g),x=B.layers[ip[p.t]],S=p.reg==="glowa"?B.region==="glowa":fi(p.reg);v.visible=f&&(m||x&&S),v.material=m?K_[p.t]:sp[p.t]}}for(let h of[fe.r,fe.l]){let f=B.side==="b"||B.side===h.k;for(let[g,v]of h.mus){let p=Bn.get(g),m=ne[p.grp],x=f&&B.layers.muscles&&!B.hidden.has(p.grp)&&(qo.has(p.grp)?B.layers.other:!0),S=!1;m.region==="glowa"?x=x&&(B.region==="glowa"||e.has(p.grp)):fi(m.region)||(B.ghostBg&&B.layers.muscles&&!qo.has(p.grp)&&f?(x=!0,S=!0):x=!1),f&&e.has(p.grp)&&(x=!0,S=!1),v.visible=x;let y=ls[p.grp];e.has(p.grp)&&!(c&&Bn.get(c).grp===p.grp&&c!==g&&!B.multi.has(p.grp))?y=nh[t.get(p.grp)%nh.length]:(S||a&&x)&&(y=vn.ghost),v.material=y,v.renderOrder=y===vn.ghost?2:0}for(let[g,v]of h.bone){let p=Sn.get(g),m=W_.has(g);if(h.k==="l"&&m)continue;let x=m||f,S=p.kind==="ctx",y=p.kind==="axial",M=o&&x&&(S?B.layers.ctx||n.has(g):y?B.layers.skull||B.region==="glowa":!0),w=!1;!S&&!y&&!fi(p.region)&&(B.ghostBg&&o&&x?(M=!0,w=!0):M=!1),(n.has(g)||l===g||r.has(g))&&x&&(M=!0,w=!1),v.visible=M;let _=S?vn.ctx:vn.bone;l===g?_=vn.hiBone:(w||e.size&&!n.has(g)||s&&!r.has(g))&&(_=vn.ghostBone),v.material=_,v.renderOrder=_===vn.ghostBone?2:0}for(let[g,v]of h.patch){let p=u.get(g);v.visible=!!p&&f&&h.bone.get(fT(g))?.visible!==!1,p&&(v.material=p==="o"?vn.org:vn.ins)}for(let[g,v]of h.cap){let p=ju.get(g)||[],m=p.some(y=>y.mid),x=!1,S=vn.cap;s&&s.caps.includes(g)?(x=!0,S=nT(s)):B.layers.cap&&p.some(z_)&&(x=!0),v.visible=x&&(m||f),x&&(v.material=S),v.renderOrder=3}for(let[g,v]of h.mk){let p=Ae.get(g),m=!!s&&s.id===g,x=m||B.layers.joints&&!(p.children&&p.children.length)&&z_(p);for(let S of v)S.visible=x&&(p.mid||f);p.mat.opacity=s?m?p.caps.length?.4:.62:.2:.5}}let d=B.muscleOpacity;for(let h of Object.keys(ls)){let f=ls[h];f.opacity=d,f.transparent=d<1,f.depthWrite=d>=.65,f.needsUpdate=!0}Z_(),Xs()}var dT=new Map(he.patches.map(i=>[i.id,i.bone])),fT=i=>dT.get(i),pT=(()=>{let i=document.createElement("canvas");i.width=i.height=64;let t=i.getContext("2d");t.beginPath(),t.arc(32,32,26,0,7),t.fillStyle="#fff",t.fill(),t.lineWidth=6,t.strokeStyle="#0a84ff",t.stroke(),t.beginPath(),t.arc(32,32,9,0,7),t.fillStyle="#0a84ff",t.fill();let e=new ba(i);return e.colorSpace=Ce,e})(),k_=new Map,$o=new Tn;$o.renderOrder=10;Fi.add($o);function Z_(){$o.clear(),k_.clear();let i=B.sel;if(!i){Vo.classList.remove("show");return}let t=[];i.t==="lm"?t=[Mr.get(i.id)]:i.t==="bone"&&B.showPins&&(t=Go.get(i.id)||[]);for(let e of t){let n=rp(e.id,i.side);if(!n)continue;let s=new _a(new ro({map:pT,depthTest:!1,depthWrite:!1,sizeAttenuation:!1,transparent:!0})),r=i.t==="lm"&&i.id===e.id;s.scale.setScalar(r?.03:.015),s.position.copy(n),s.renderOrder=10,s.userData={kind:"lm",id:e.id},$o.add(s),k_.set(e.id,s)}i.t==="lm"?(Vo.innerHTML=`<b>${kt(Mr.get(i.id).pl)}</b><small>(${kt(Mr.get(i.id).la)})</small>`,Vo.classList.add("show")):Vo.classList.remove("show")}var Vo=It("#pinlabel"),Zu=new I;function mT(){if(!B.sel||B.sel.t!=="lm")return;let i=rp(B.sel.id,B.sel.side);if(!i)return;Zu.copy(i).project(Ze);let t=nn.getBoundingClientRect(),e=(Zu.x*.5+.5)*t.width,n=(-Zu.y*.5+.5)*t.height;Vo.style.transform=`translate(${e+18}px, ${n-16}px)`,Vo.style.opacity=Zu.z<1?1:0}var Di=null;function ih(i,t,e,n=700){let s={t:Fe.target.clone(),p:Ze.position.clone()},r=e?e.clone().normalize():Ze.position.clone().sub(Fe.target).normalize(),o={t:i.clone(),p:i.clone().add(r.multiplyScalar(t))};Di={from:s,to:o,t0:performance.now(),ms:n}}function gT(i){if(!Di)return;let t=Math.min(1,(i-Di.t0)/Di.ms),e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;Fe.target.lerpVectors(Di.from.t,Di.to.t,e),Ze.position.lerpVectors(Di.from.p,Di.to.p,e),t>=1&&(Di=null),Xs()}var ap=i=>i/Math.sin(Is.degToRad(Ze.fov)/2)*1.05;function lp(i){let t=new jt;for(let e of i)e&&(e.updateWorldMatrix(!0,!1),t.expandByObject(e));return t}function Hs(i,t,e=.12){let n=lp(i);if(n.isEmpty())return;let s=n.getCenter(new I),r=n.getSize(new I).length()/2;ih(s,Math.max(ap(r),e),t)}var _T={front:[0,.05,1],back:[0,.05,-1],lat:[-1,.05,.12],med:[1,.05,.12],top:[0,1,.08]};function j_(i){let t=[],e=i;for(let n of iT()){for(let[s,r]of n.mus)(e==="all"?!qo.has(Bn.get(s).grp):ne[Bn.get(s).grp].region===e)&&t.push(r);for(let[s,r]of n.bone){let o=Sn.get(s);(e==="all"?o.kind==="bone":o.region===e)&&t.push(r)}}return t}function vl(i){let t=new I(..._T[i||"front"]);B.side==="l"&&(i==="lat"||i==="med")&&(t.x*=-1),Hs(j_(B.region),t)}var xT=i=>i&&i.side||Rr(),wr=i=>i.t==="grp"?i.id:Bn.get(i.id).grp;function Pn(i,t={}){if(B.multiMode&&i&&(i.t==="grp"||i.t==="part")){Sl(wr(i),void 0,t);return}if(B.multiMode&&i&&ah(!0),i&&lT(i)&&!B.axial){Yo().then(()=>Pn(i,t));return}if(i&&i.t==="str"){let n=ip[Oi.get(i.id).t];if(!fe.r.str.has(i.id)){B.layers[n]=!0;let s=It("#l"+{lig:"Lig",nerv:"Nerv",vess:"Vess"}[n]);s&&(s.checked=!0),Zo(n).then(()=>Pn(i,t));return}Oi.get(i.id).reg==="glowa"&&!B.axial&&Yo()}if(B.sel=i,Ne(),gi(),Ui(),!i||t.noFly)return;let e=xT(i);if(i.t==="grp"){let n=ne[i.id];Hs([...n.ids.map(s=>ks("mus",s,e)),...(Vs.get(i.id)||[]).map(s=>ks("patch",s.id,e))])}else if(i.t==="part")Hs([ks("mus",i.id,e)]);else if(i.t==="bone")Hs([ks("bone",i.id,e)]);else if(i.t==="str")Hs([ks("str",i.id,e)],null,.1);else if(i.t==="lm"){let n=rp(i.id,e);n&&ih(n,.11)}else if(i.t==="joint"){let n=Ae.get(i.id),s=fe[n.mid?"r":e].mk.get(n.id)||[];{let r=lp(s);if(!r.isEmpty()){let o=r.getSize(new I).length()/2;ih(r.getCenter(new I),Math.max(ap(o)*1.9,.19))}}}window.innerWidth<820&&hp()}var yT=()=>{let i=new Set(B.multi.values());for(let t=0;t<nh.length;t++)if(!i.has(t))return t;return B.multi.size%nh.length};function cp(){B.multiMode||(B.multiMode=!0,It("#multiBtn").classList.add("on"),B.sel&&(B.sel.t==="grp"||B.sel.t==="part")&&B.multi.set(wr(B.sel),0),B.sel=null)}function ah(i){if(!B.multiMode)return;B.multiMode=!1,It("#multiBtn").classList.remove("on");let t=[...B.multi.keys()];B.multi.clear(),i||(B.sel=t.length===1?{t:"grp",id:t[0]}:null,Ne(),gi(),Ui())}function Sl(i,t,e={}){cp(),B.multi.has(i)?B.multi.delete(i):(B.multi.set(i,t??yT()),!e.noFly&&B.multi.size===1&&Hs([...ne[i].ids.map(n=>ks("mus",n,Rr()))])),Ne(),gi(),Ui()}function Qu(i,t=!0){cp(),B.multi=new Map(i),Ne(),gi(),Ui(),t&&Hs([...B.multi.keys()].flatMap(e=>ne[e].ids.map(n=>ks("mus",n,Rr()))),null,.16)}var vr=new Oa,sh=new xt;function J_(i){let t=nn.getBoundingClientRect();if(sh.set((i.clientX-t.left)/t.width*2-1,-((i.clientY-t.top)/t.height)*2+1),vr.setFromCamera(sh,Ze),vr.firstHitOnly=!0,$o.children.length){let r=vr.intersectObjects($o.children,!1);if(r.length)return{pin:r[0].object.userData}}let e=$_.filter(r=>r.visible);if(e.length){let r=vr.intersectObjects(e,!1);if(r.length)return{obj:r[0].object}}let n=Tr.filter(r=>r.visible&&r.material!==vn.ghost&&r.material!==vn.ghostBone),s=vr.intersectObjects(n,!1);return s.length?{obj:s[0].object}:null}var fl=null;nn.addEventListener("pointerdown",i=>{fl={x:i.clientX,y:i.clientY,t:performance.now()},Di=null});nn.addEventListener("pointerup",i=>{if(!fl)return;let t=i.clientX-fl.x,e=i.clientY-fl.y,n=t*t+e*e>25;if(fl=null,n)return;let s=J_(i);if(!s){B.sel&&Pn(null);return}if(s.pin){Pn({t:"lm",id:s.pin.id,side:B.sel&&B.sel.side});return}let r=s.obj.userData,o=i.ctrlKey||i.metaKey||i.shiftKey;if(r.kind==="mus"){let a=ne[r.grp];if(B.multiMode||o){Sl(r.grp);return}B.sel&&(B.sel.t==="grp"&&B.sel.id===r.grp||B.sel.t==="part"&&Bn.get(B.sel.id).grp===r.grp)&&a.parts.length>1?Pn({t:"part",id:r.id,side:r.side},{noFly:!0}):Pn({t:"grp",id:r.grp,side:r.side},{noFly:!1})}else r.kind==="bone"?B.multiMode||Pn({t:"bone",id:r.id,side:r.side}):r.kind==="joint"?Pn({t:"joint",id:r.id,side:r.side}):r.kind==="str"&&(B.multiMode||Pn({t:"str",id:r.id,side:r.side}))});var pl=It("#tip"),H_=0;nn.addEventListener("pointermove",i=>{let t=performance.now();if(t-H_<60||i.buttons&1||i.pointerType==="touch")return;H_=t;let e=J_(i);if(!e){pl.classList.remove("show"),nn.style.cursor="grab";return}nn.style.cursor="pointer";let n,s;if(e.pin){let r=Mr.get(e.pin.id);n=r.pl,s=r.la}else{let r=e.obj.userData;if(r.kind==="mus"){let o=ne[r.grp],a=Bn.get(r.id);n=o.pl+(a.pl&&o.parts.length>1?" \u2014 "+a.pl.toLowerCase():""),s=o.la}else if(r.kind==="str"){let o=Oi.get(r.id);n=o.pl,s=o.la}else if(r.kind==="joint"){let o=Ae.get(r.id);n=o.pl,s=o.la}else{let o=Sn.get(r.id);n=o.pl,s=o.la}}pl.innerHTML=`<b>${kt(n)}</b><small>(${kt(s)})</small>`,pl.style.transform=`translate(${i.clientX+14}px, ${i.clientY+14}px)`,pl.classList.add("show")});nn.addEventListener("pointerleave",()=>pl.classList.remove("show"));nn.addEventListener("dblclick",i=>{let t=nn.getBoundingClientRect();sh.set((i.clientX-t.left)/t.width*2-1,-((i.clientY-t.top)/t.height)*2+1),vr.setFromCamera(sh,Ze);let e=vr.intersectObjects(Tr.filter(n=>n.visible),!1);e.length&&ih(e[0].point,Math.max(.1,Ze.position.distanceTo(e[0].point)*.5),null,500)});var cs=It("#list"),os=(i,t,e="")=>`<span class="nm"><span class="pl">${kt(i)}</span><span class="la">(${kt(t)})</span></span>${e}`,Sr=i=>`<i class="sdot" style="background:${mi[i.shape].c}"></i>`;function us(){let i=B.region==="all"?Jb:[B.region],t="",e=!1;try{e=localStorage.getItem("anatomia.tipMulti")==="1"}catch{}if(B.tab==="mus"&&!e&&(t+='<div class="tip"><span>\u{1F4A1} <b>Kilka mi\u0119\u015Bni naraz:</b> przycisk <b>\u2611 Wiele mi\u0119\u015Bni</b> nad modelem (na komputerze tak\u017Ce <b>Ctrl / Shift + klik</b>). Ka\u017Cdy dostaje inny kolor; w karcie mi\u0119\u015Bnia znajdziesz antagonist\xF3w.</span><button data-tipx aria-label="Ukryj podpowied\u017A">\xD7</button></div>'),B.tab==="mus")for(let n of i){let s=Object.values(ne).filter(r=>r.region===n).sort((r,o)=>r.pl.localeCompare(o.pl,"pl"));if(s.length){t+=`<div class="sec">${kt(pi[n])} <i>${s.length}</i></div>`;for(let r of s){let o=r.parts.length>1;if(t+=`<div class="grp" data-g="${r.key}"><div class="row" data-t="grp" data-id="${r.key}">
          <button class="eye ${B.hidden.has(r.key)?"off":""}" data-eye="${r.key}" title="Poka\u017C / ukryj" aria-label="Poka\u017C lub ukryj">${vT}</button>
          ${os(r.pl,r.la,o?`<button class="car" data-car="${r.key}" aria-label="Cz\u0119\u015Bci">${r.parts.length}\u25BE</button>`:"")}</div>`,o){t+=`<div class="parts" data-parts="${r.key}">`;for(let a of r.parts)t+=`<div class="row sub" data-t="part" data-id="${a.id}">${os(a.pl,a.la)}</div>`;t+="</div>"}t+="</div>"}}}else if(B.tab==="lig"||B.tab==="nerv"||B.tab==="vess"){let n=B.tab==="vess"?["art","ven"]:[B.tab];B.tab==="vess"&&(t+=`<div class="jleg"><span><i class="sdot" style="background:${Ju.art}"></i>T\u0119tnice</span><span><i class="sdot" style="background:${Ju.ven}"></i>\u017By\u0142y</span></div>`);for(let s of i){let r=he.structs.filter(o=>n.includes(o.t)&&o.reg===s).sort((o,a)=>o.pl.localeCompare(a.pl,"pl"));if(r.length){t+=`<div class="sec">${kt(pi[s])} <i>${r.length}</i></div>`;for(let o of r)t+=`<div class="grp"><div class="row" data-t="str" data-id="${o.id}"><i class="sdot" style="background:${Ju[o.t]}"></i>${os(o.pl,o.la)}</div></div>`}}}else if(B.tab==="jnt"){t+=`<div class="jleg">${Object.values(mi).map(n=>`<span><i class="sdot" style="background:${n.c}"></i>${kt(n.pl.split(" (")[0])}</span>`).join("")}</div>`;for(let n of i){let s=ds.filter(r=>r.reg===n&&!r.parent);if(s.length){t+=`<div class="sec">${kt(pi[n])} <i>${ds.filter(r=>r.reg===n).length}</i></div>`;for(let r of s){t+=`<div class="grp"><div class="row" data-t="joint" data-id="${r.id}">${Sr(r)}${os(r.pl,r.la,`<span class="typ">${kt(mi[r.shape].pl.split(" (")[0])}</span>`)}</div>`;for(let o of r.children||[]){let a=Ae.get(o);t+=`<div class="row sub" data-t="joint" data-id="${a.id}">${Sr(a)}${os(a.pl,a.la,`<span class="typ">${kt(mi[a.shape].pl.split(" (")[0])}</span>`)}</div>`}t+="</div>"}}}}else{for(let n of i){let s=he.bones.filter(r=>(r.kind==="bone"||r.kind==="axial")&&r.region===n).sort((r,o)=>r.pl.localeCompare(o.pl,"pl",{numeric:!0}));if(s.length){t+=`<div class="sec">${kt(pi[n])} <i>${s.length}</i></div>`;for(let r of s){let o=Go.get(r.id)||[];if(t+=`<div class="grp"><div class="row" data-t="bone" data-id="${r.id}">${os(r.pl,r.la,o.length?`<button class="car" data-lcar="${r.id}" aria-label="Punkty kostne">${o.length}\u25BE</button>`:"")}</div>`,o.length){t+=`<div class="parts" data-lparts="${r.id}">`;for(let a of[...o].sort((l,c)=>l.pl.localeCompare(c.pl,"pl")))t+=`<div class="row sub" data-t="lm" data-id="${a.id}">${os(a.pl,a.la)}</div>`;t+="</div>"}t+="</div>"}}}if(B.region==="all"||B.region==="bark"){let n=he.bones.filter(s=>s.kind==="ctx");t+=`<div class="sec">Kontekst: tu\u0142\xF3w <i>${n.length}</i></div>`;for(let s of n)t+=`<div class="grp"><div class="row" data-t="bone" data-id="${s.id}">${os(s.pl,s.la)}</div></div>`}}t||(t='<div class="more">Brak pozycji w tym zakresie (w tej wersji: ko\u015Bci i stawy g\u0142owy i szyi).</div>'),cs.innerHTML=t,Ui()}var vT='<svg viewBox="0 0 24 24" width="16" height="16"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>';function Ui(){if(Er(".row.on",cs).forEach(e=>e.classList.remove("on")),B.multiMode){for(let e of B.multi.keys()){let n=It(`.row[data-t="grp"][data-id="${e}"]`,cs);n&&n.classList.add("on")}return}let i=B.sel;if(!i)return;let t=It(`.row[data-t="${i.t}"][data-id="${i.id}"]`,cs);if(!t&&i.t==="part"&&(t=It(`.row[data-t="grp"][data-id="${Bn.get(i.id).grp}"]`,cs)),t){t.classList.add("on");let e=t.closest(".parts");e&&e.classList.add("open"),tp||t.scrollIntoView({block:"nearest",behavior:"smooth"})}}cs.addEventListener("click",i=>{if(i.target.closest("[data-tipx]")){try{localStorage.setItem("anatomia.tipMulti","1")}catch{}us();return}let t=i.target.closest("[data-eye]");if(t){let s=t.dataset.eye;B.hidden.has(s)?B.hidden.delete(s):B.hidden.add(s),t.classList.toggle("off"),Ne(),i.stopPropagation();return}let e=i.target.closest("[data-car],[data-lcar]");if(e){let s=It(`[data-parts="${e.dataset.car}"],[data-lparts="${e.dataset.lcar}"]`,cs);s&&s.classList.toggle("open"),i.stopPropagation();return}let n=i.target.closest(".row");if(n){if((i.ctrlKey||i.metaKey||i.shiftKey)&&n.dataset.t==="grp"){Sl(n.dataset.id);return}Pn({t:n.dataset.t,id:n.dataset.id})}});var Gs=It("#q"),_l=It("#results"),tp=!1,Cr=[];for(let i of Object.values(ne))Cr.push({t:"grp",id:i.key,pl:i.pl,la:i.la,typ:qo.has(i.key)?"Powi\u0119\u017A / troczek":"Mi\u0119sie\u0144",hay:Ws([i.pl,i.la,i.alt,...i.parts.map(t=>t.en)].join(" ")),w:0});for(let i of he.muscles){let t=ne[i.grp];t.parts.length>1&&Cr.push({t:"part",id:i.id,pl:`${t.pl} \u2014 ${i.pl.toLowerCase()}`,la:`${t.la}, ${i.la.toLowerCase()}`,typ:"Cz\u0119\u015B\u0107 mi\u0119\u015Bnia",hay:Ws([i.pl,i.la,t.pl,t.la,i.en].join(" ")),w:1})}for(let i of he.bones)Cr.push({t:"bone",id:i.id,pl:i.pl,la:i.la,typ:i.kind==="ctx"?"Ko\u015B\u0107 (kontekst)":"Ko\u015B\u0107",hay:Ws([i.pl,i.la,i.en].join(" ")),w:0});for(let i of ds)Cr.push({t:"joint",id:i.id,pl:i.pl,la:i.la,typ:"Staw \xB7 "+mi[i.shape].pl.split(" (")[0],hay:Ws([i.pl,i.la,i.alt,mi[i.shape].pl,i.ksztalt,i.rodzaj,"staw",i.piet?"pietrowy dwujamowy dwukomorowy":""].join(" ")),w:0});for(let i of he.structs||[])Cr.push({t:"str",id:i.id,pl:i.pl,la:i.la,typ:Qf[i.t]+" \xB7 "+pi[i.reg].toLowerCase(),hay:Ws([i.pl,i.la,i.en,Qf[i.t],i.t==="nerv"?"nerwy unerwienie":i.t==="lig"?"wiezadla wiezadlo":"naczynia krew"].join(" ")),w:1});for(let i of he.lms){let t=Sn.get(i.bone);Cr.push({t:"lm",id:i.id,pl:i.pl,la:i.la,typ:"Punkt kostny \xB7 "+t.pl.toLowerCase(),hay:Ws([i.pl,i.la,i.en,t.pl,t.la].join(" ")),w:2})}function up(i){let t=Ws(i).split(/\s+/).filter(Boolean);if(!t.length){tp=!1,_l.classList.remove("show"),cs.classList.remove("hide");return}tp=!0;let e=[];for(let s of Cr){if(!t.every(a=>s.hay.includes(a)))continue;let r=Ws(s.pl),o=s.w*10;r.startsWith(t[0])?o-=6:r.includes(" "+t[0])&&(o-=3),r===t.join(" ")&&(o-=10),e.push({it:s,sc:o})}e.sort((s,r)=>s.sc-r.sc||s.it.pl.localeCompare(r.it.pl,"pl"));let n=e.slice(0,80);_l.innerHTML=n.length?n.map(({it:s},r)=>`<div class="row res" data-t="${s.t}" data-id="${s.id}" data-i="${r}">${os(s.pl,s.la)}<span class="typ">${kt(s.typ)}</span></div>`).join("")+(e.length>80?`<div class="more">+${e.length-80} kolejnych \u2014 doprecyzuj wyszukiwanie</div>`:""):'<div class="more">Brak wynik\xF3w</div>',_l.classList.add("show"),cs.classList.add("hide")}Gs.addEventListener("input",()=>up(Gs.value));Gs.addEventListener("keydown",i=>{if(i.key==="Enter"){let t=It(".row.res",_l);t&&t.click()}i.key==="Escape"&&(Gs.value="",up(""),Gs.blur())});_l.addEventListener("click",i=>{let t=i.target.closest(".row.res");if(!t)return;let e=t.dataset.t,n=t.dataset.id;e==="lm"||e==="bone"?(B.tab="bone",xl(),us()):e==="joint"?(B.tab="jnt",xl(),us()):e==="str"&&(B.tab=ip[Oi.get(n).t],xl(),us()),Gs.value="",up(""),Pn({t:e,id:n})});window.addEventListener("keydown",i=>{i.key==="/"&&document.activeElement!==Gs&&!/input|textarea/i.test(document.activeElement.tagName)&&(i.preventDefault(),TT(),Gs.focus())});var br=It("#info");function si(i,t,e,n,s="",r=""){return`<button class="chip ${s}" data-t="${e}" data-id="${n}">${r}${kt(i)} <small>(${kt(t)})</small></button>`}var rh=(i,t="")=>si(ne[i].pl,ne[i].la,"grp",i,t),V_=i=>i.map(t=>as(t)?rh(t):`<span class="chip txt">${kt(t)}</span>`).join(""),Ho=(i,t,e)=>`<div class="ihead"><div><div class="itag">${kt(e)}</div><h2>${kt(i)}</h2><div class="ila">(${kt(t)})</div></div><button class="x" id="ix" aria-label="Zamknij">\xD7</button></div>`,ST="Staw pi\u0119trowy (dwujamowy / dwukomorowy): kr\u0105\u017Cek lub \u0142\u0105kotka dzieli jam\u0119 stawow\u0105 na dwa pi\u0119tra, w kt\xF3rych zachodz\u0105 r\xF3\u017Cne ruchy.";function MT(){let i=[...B.multi.keys()],t=Ho(`Wybrane mi\u0119\u015Bnie (${i.length})`,"wyb\xF3r wielokrotny","Tryb wielu mi\u0119\u015Bni");if(!i.length)t+='<p class="desc">Klikaj mi\u0119\u015Bnie na modelu albo na li\u015Bcie, aby doda\u0107 lub usun\u0105\u0107 je z zaznaczenia. Na komputerze dzia\u0142a te\u017C <b>Ctrl</b> / <b>Shift</b> + klik.</p>';else{t+=`<div class="chips mt">${i.map(r=>`<span class="chip sel"><i class="dotc" style="background:${Jf[B.multi.get(r)%Jf.length]}"></i><button class="cn" data-t="grp" data-id="${r}">${kt(ne[r].pl)} <small>(${kt(ne[r].la)})</small></button><button class="rm" data-rm="${r}" aria-label="Usu\u0144">\xD7</button></span>`).join("")}</div>`;let e=[],n=new Set;for(let r of i)for(let o of Xn.get(r)||[])if(B.multi.has(o)&&B.multi.get(r)!==B.multi.get(o)){let a=[r,o].sort().join("|");n.has(a)||(n.add(a),e.push([r,o]))}e.length&&(t+=`<div class="subt">Antagoni\u015Bci w zaznaczeniu</div><ul class="rel">${e.map(([r,o])=>`<li>${kt(ne[r].pl)} <b>\u21C4</b> ${kt(ne[o].pl)}</li>`).join("")}</ul>`);let s=new Set;for(let r of i)for(let o of Xn.get(r)||[])B.multi.has(o)||s.add(o);s.size&&(t+=`<div class="subt">Antagoni\u015Bci spoza zaznaczenia</div><div class="chips">${[...s].sort((r,o)=>ne[r].pl.localeCompare(ne[o].pl,"pl")).map(r=>rh(r)).join("")}</div>`),Vs.size&&(t+='<div class="legend"><span><i class="o"></i>pocz\u0105tki</span><span><i class="i"></i>przyczepy ko\u0144cowe</span></div>')}t+=`<div class="btns">${i.length?'<button id="bMultiFocus">Przybli\u017C</button>':""}${i.length&&[...Xn.keys()].some(e=>B.multi.has(e))?'<button id="bAddAnt">Dodaj antagonist\xF3w</button>':""}${i.length?'<button id="bMultiClear">Wyczy\u015B\u0107</button>':""}<button id="bMultiOff" class="pri">Zako\u0144cz wyb\xF3r wielu</button></div>`,br.innerHTML=t,br.classList.add("show")}function gi(){if(B.multiMode){MT();return}let i=B.sel;if(!i){br.classList.remove("show");return}let t="";if(i.t==="grp"||i.t==="part"){let n=wr(i),s=ne[n],r=i.t==="part"?Bn.get(i.id):null;t+=Ho(r?`${s.pl} \u2014 ${r.pl.toLowerCase()}`:s.pl,r?`${s.la}, ${r.la.toLowerCase()}`:s.la,qo.has(n)?"Powi\u0119\u017A / troczek \xB7 "+pi[s.region].toLowerCase():"Mi\u0119sie\u0144 \xB7 "+pi[s.region].toLowerCase()),t+=`<dl><dt>Pocz\u0105tek</dt><dd>${kt(s.org)}</dd><dt>Przyczep ko\u0144cowy</dt><dd>${kt(s.ins)}</dd><dt>Czynno\u015B\u0107</dt><dd>${kt(s.fn)}</dd><dt>Unerwienie</dt><dd>${kt(s.inn)}</dd></dl>`,Vs.get(n)&&(t+='<div class="legend"><span><i class="o"></i>pocz\u0105tek</span><span><i class="i"></i>przyczep ko\u0144cowy</span><em>zaznaczone na ko\u015Bciach (orientacyjnie, wg modelu)</em></div>');let o=Xn.get(n);o&&o.size&&(t+=`<div class="subt">Antagoni\u015Bci</div><div class="chips">${[...o].sort((l,c)=>ne[l].pl.localeCompare(ne[c].pl,"pl")).map(l=>rh(l)).join("")}</div>`);let a=dl.get(n);if(a&&a.length&&(t+=`<div class="subt">Dzia\u0142a na stawy</div><div class="chips">${a.map(l=>si(Ae.get(l.j).pl,l.ruch,"joint",l.j,"",Sr(Ae.get(l.j)))).join("")}</div>`),s.parts.length>1){t+='<div class="subt">Cz\u0119\u015Bci</div><div class="chips">';for(let l of s.parts)t+=si(l.pl,l.la,"part",l.id,r&&r.id===l.id?"on":"");t+="</div>"}}else if(i.t==="bone"){let n=Sn.get(i.id),s=Go.get(n.id)||[];t+=Ho(n.pl,n.la,n.kind==="ctx"?"Ko\u015B\u0107 \xB7 kontekst":"Ko\u015B\u0107 \xB7 "+pi[n.region].toLowerCase()),t+=`<p class="desc">${kt(n.d)}</p>`;let r=ml.get(n.id)||[];if(r.length){let a=new Map;for(let d of r){let h=d.grp;(!a.has(h)||d.role==="o")&&a.set(h,d.role)}let l=[...a].filter(([,d])=>d==="o").map(([d])=>d),c=[...a].filter(([,d])=>d==="i").map(([d])=>d),u=d=>d.sort((h,f)=>ne[h].pl.localeCompare(ne[f].pl,"pl")).map(h=>rh(h)).join("");l.length&&(t+=`<div class="subt"><i class="dot o"></i>Pocz\u0105tki mi\u0119\u015Bni</div><div class="chips">${u(l)}</div>`),c.length&&(t+=`<div class="subt"><i class="dot i"></i>Przyczepy ko\u0144cowe mi\u0119\u015Bni</div><div class="chips">${u(c)}</div>`)}let o=ds.filter(a=>a.bones.includes(n.id));o.length&&(t+=`<div class="subt">Stawy z udzia\u0142em ko\u015Bci</div><div class="chips">${o.map(a=>si(a.pl,a.la,"joint",a.id,"",Sr(a))).join("")}</div>`),s.length&&(t+=`<label class="chk"><input type="checkbox" id="pinsToggle" ${B.showPins?"checked":""}> Poka\u017C punkty kostne na modelu (${s.length})</label>`),s.length&&(t+=`<div class="subt">Punkty kostne</div><div class="chips">${[...s].sort((a,l)=>a.pl.localeCompare(l.pl,"pl")).map(a=>si(a.pl,a.la,"lm",a.id)).join("")}</div>`)}else if(i.t==="lm"){let n=Mr.get(i.id),s=Sn.get(n.bone);t+=Ho(n.pl,n.la,"Punkt kostny"),n.d&&(t+=`<p class="desc">${kt(n.d)}</p>`),t+=`<div class="subt">Ko\u015B\u0107</div><div class="chips">${si(s.pl,s.la,"bone",s.id)}</div>`}else if(i.t==="str"){let n=Oi.get(i.id);t+=Ho(n.pl,n.la,`${Qf[n.t]} \xB7 ${pi[n.reg].toLowerCase()}`),t+=`<p class="desc">${kt(n.d)}</p>`,n.j&&n.j.length&&(t+=`<div class="subt">Staw</div><div class="chips">${n.j.map(r=>si(Ae.get(r).pl,Ae.get(r).la,"joint",r,"",Sr(Ae.get(r)))).join("")}</div>`);let s=he.structs.filter(r=>r.t===n.t&&r.reg===n.reg&&r.id!==n.id&&r.pl.split(" ")[0]===n.pl.split(" ")[0]).slice(0,8);s.length&&(t+=`<div class="subt">Podobne struktury</div><div class="chips">${s.map(r=>si(r.pl,r.la,"str",r.id)).join("")}</div>`)}else if(i.t==="joint"){let n=Ae.get(i.id),s=mi[n.shape];t+=Ho(n.pl,n.la,"Staw \xB7 "+pi[n.reg].toLowerCase()),t+=`<dl><dt>Rodzaj</dt><dd>${kt(n.rodzaj)}</dd><dt>Kszta\u0142t (typ)</dt><dd><i class="dotc" style="background:${s.c}"></i><b>${kt(n.ksztalt)}</b><div class="small">${kt(s.d)}</div></dd>`,t+=`<dt>Liczba osi ruchu</dt><dd>${kt(n.osie)}</dd><dt>Powierzchnie stawowe</dt><dd><b>${n.n}</b> \u2014 ${kt(n.pow)}</dd>`,n.piet&&(t+=`<dt>Pi\u0119trowy / dwujamowy</dt><dd><b>tak</b><div class="small">${ST}</div></dd>`),t+=`<dt>Cechy</dt><dd>${kt(n.cechy)}</dd></dl>`,n.children&&n.children.length&&(t+=`<div class="subt">Stawy sk\u0142adowe</div><div class="chips">${n.children.map(o=>si(Ae.get(o).pl,Ae.get(o).la,"joint",o,"",Sr(Ae.get(o)))).join("")}</div>`),n.parent&&(t+=`<div class="subt">Cz\u0119\u015B\u0107 stawu z\u0142o\u017Conego</div><div class="chips">${si(Ae.get(n.parent).pl,Ae.get(n.parent).la,"joint",n.parent,"",Sr(Ae.get(n.parent)))}</div>`),t+=`<div class="subt">Ko\u015Bci</div><div class="chips">${n.bones.map(o=>si(Sn.get(o).pl,Sn.get(o).la,"bone",o)).join("")}</div>`,n.pairs.length?(t+='<div class="subt">Ruchy i mi\u0119\u015Bnie (antagoni\u015Bci \u21C4)</div>',n.pairs.forEach((o,a)=>{t+=`<div class="mv"><button class="mvb" data-mv="${n.id}|${a}" title="Zaznacz oba zespo\u0142y mi\u0119\u015Bni">${kt(o[0])} <b>\u21C4</b> ${kt(o[2])}</button><div class="mvr"><span class="mvl">${kt(o[0])}</span>${V_(o[1])}</div><div class="mvr"><span class="mvl">${kt(o[2])}</span>${V_(o[3])}</div></div>`})):t+='<p class="small">Ruchomo\u015B\u0107 znikoma \u2014 brak wyodr\u0119bnionych ruch\xF3w czynnych.</p>';let r=(he.structs||[]).filter(o=>o.j&&o.j.includes(n.id));r.length&&(t+=`<div class="subt">Wi\u0119zad\u0142a i struktury stawu (${r.length})</div><div class="chips">${r.map(o=>si(o.pl,o.la,"str",o.id,"",`<i class="sdot" style="background:${Ju[o.t]}"></i>`)).join("")}</div>`),t+='<div class="legend"><em>znacznik stawu jest p\xF3\u0142przezroczysty, widoczny przez ko\u015Bci; torebka i kr\u0105\u017Cek \u2014 w kolorze typu stawu</em></div>'}let e=i.t==="joint"&&Ae.get(i.id).pairs.some(n=>n[1].some(as)||n[3].some(as));t+=`<div class="btns"><button id="bFocus">Przybli\u017C</button>${i.t==="grp"||i.t==="part"?'<button id="bIso">Ukryj reszt\u0119</button>':""}${(i.t==="grp"||i.t==="part")&&Xn.has(wr(i))?'<button id="bAnt">Z antagonistami</button>':""}${e?'<button id="bJm">Poka\u017C mi\u0119\u015Bnie stawu</button>':""}<button id="bClear">Odznacz</button></div>`,br.innerHTML=t,br.classList.add("show")}br.addEventListener("click",i=>{let t=i.target;if(t.closest("#ix")||t.closest("#bClear")){Pn(null);return}if(t.closest("#bFocus")){let r=B.sel;B.sel=null,Pn(r);return}if(t.closest("#bIso")){B.ghostBg=!1,B.layers.bones=!0;let r=B.sel;It("#ghostBg").checked=!1;let o=wr(r);for(let a of Object.keys(ne))a!==o?B.hidden.add(a):B.hidden.delete(a);us(),Ne();return}if(t.closest("#bAnt")){let r=wr(B.sel);Qu([[r,0],...[...Xn.get(r)].map(o=>[o,1])]);return}if(t.closest("#bJm")){let r=Ae.get(B.sel.id),o=new Map;for(let a of r.pairs)for(let l of a[1].filter(as))o.set(l,0);for(let a of r.pairs)for(let l of a[3].filter(as))o.has(l)||o.set(l,1);Qu([...o]);return}let e=t.closest("[data-mv]");if(e){let[r,o]=e.dataset.mv.split("|"),a=Ae.get(r).pairs[+o],l=new Map;for(let c of a[1].filter(as))l.set(c,0);for(let c of a[3].filter(as))l.has(c)||l.set(c,1);l.size&&Qu([...l]);return}if(t.closest("#bMultiOff")){ah();return}if(t.closest("#bMultiClear")){B.multi.clear(),Ne(),gi(),Ui();return}if(t.closest("#bMultiFocus")){Hs([...B.multi.keys()].flatMap(r=>ne[r].ids.map(o=>ks("mus",o,Rr()))),null,.16);return}if(t.closest("#bAddAnt")){for(let r of[...B.multi.keys()])for(let o of Xn.get(r)||[])B.multi.has(o)||B.multi.set(o,1);Ne(),gi(),Ui();return}let n=t.closest("[data-rm]");if(n){B.multi.delete(n.dataset.rm),Ne(),gi(),Ui();return}let s=t.closest("[data-t]");if(s&&(s.classList.contains("chip")||s.classList.contains("cn"))){if(B.multiMode&&s.dataset.t==="grp"){B.multi.has(s.dataset.id)||Sl(s.dataset.id,void 0,{noFly:!0});return}Pn({t:s.dataset.t,id:s.dataset.id});return}});br.addEventListener("change",i=>{i.target.id==="pinsToggle"&&(B.showPins=i.target.checked,Z_(),Xs())});var xl=()=>Er("#tabs button").forEach(i=>i.classList.toggle("on",i.dataset.tab===B.tab));It("#tabs").addEventListener("click",i=>{let t=i.target.closest("button");t&&(B.tab=t.dataset.tab,xl(),us(),(B.tab==="lig"||B.tab==="nerv"||B.tab==="vess")&&(cT(B.tab,!0),Ne()))});It("#regions").innerHTML=he.regions.map(([i,t])=>`<button data-r="${i}" class="${i==="all"?"on":""}">${kt(t)}</button>`).join("");var bT=i=>i.t==="grp"?fi(ne[i.id].region):i.t==="part"?fi(ne[Bn.get(i.id).grp].region):i.t==="bone"?Sn.get(i.id).kind==="ctx"||fi(Sn.get(i.id).region):i.t==="joint"?fi(Ae.get(i.id).reg):i.t==="str"?fi(Oi.get(i.id).reg):fi(Sn.get(Mr.get(i.id).bone).region);function ep(i,t){B.region=i,Er("#regions button").forEach(e=>e.classList.toggle("on",e.dataset.r===i)),B.hidden.clear(),B.sel&&!bT(B.sel)&&(B.sel=null,gi()),i==="glowa"&&(B.layers.skull=!0,It("#lSkull").checked=!0),us(),Ne(),(i==="glowa"?Yo():Promise.resolve()).then(()=>{Ne(),vl("front"),t&&t()})}It("#regions").addEventListener("click",i=>{let t=i.target.closest("button");t&&ep(t.dataset.r)});var _i=(i,t)=>{let e=It("#"+i);e.addEventListener("change",()=>{t(e.checked),Ne()})};_i("lBones",i=>B.layers.bones=i);_i("lMus",i=>B.layers.muscles=i);_i("lCtx",i=>B.layers.ctx=i);_i("lOther",i=>B.layers.other=i);_i("lAtt",i=>B.layers.att=i);_i("ghostBg",i=>B.ghostBg=i);_i("lLig",i=>{B.layers.lig=i,i&&Zo("lig")});_i("lNerv",i=>{B.layers.nerv=i,i&&Zo("nerv")});_i("lVess",i=>{B.layers.vess=i,i&&Zo("vess")});_i("lJoints",i=>B.layers.joints=i);_i("lCap",i=>B.layers.cap=i);It("#lSkull").addEventListener("change",i=>{B.layers.skull=i.target.checked,B.layers.skull&&Yo(),Ne()});It("#opa").addEventListener("input",i=>{B.muscleOpacity=+i.target.value,Ne()});function oh(i){B.side=i;try{localStorage.setItem("anatomia.side",i)}catch{}Er("#sides button").forEach(t=>t.classList.toggle("on",t.dataset.s===i)),B.sel&&B.sel.side&&(B.sel={...B.sel,side:i==="b"?B.sel.side:i}),Ne(),gi(),B.box&&vl("front")}It("#sides").addEventListener("click",i=>{let t=i.target.closest("button");t&&oh(t.dataset.s)});It("#multiBtn").addEventListener("click",()=>{B.multiMode?ah():(cp(),Ne(),gi(),Ui())});It("#views").addEventListener("click",i=>{let t=i.target.closest("button");if(!(!t||t.id==="panelBtn"||t.id==="multiBtn")){if(t.dataset.v==="rot"){Fe.autoRotate=!Fe.autoRotate,t.classList.toggle("on",Fe.autoRotate),Xs();return}if(t.dataset.v==="reset"){ah(!0),B.hidden.clear(),B.sel=null,B.layers=Y_(),B.muscleOpacity=1,B.ghostBg=!0,B.region="all",Er("#regions button").forEach(e=>e.classList.toggle("on",e.dataset.r==="all"));for(let[e,n]of[["lBones",1],["lMus",1],["lCtx",0],["lOther",0],["lAtt",0],["lJoints",0],["lCap",0],["lSkull",0],["lLig",0],["lNerv",0],["lVess",0]])It("#"+e).checked=!!n;It("#ghostBg").checked=!0,It("#opa").value=1,us(),Ne(),gi(),Ui(),vl("front");return}vl(t.dataset.v)}});var lh=It("#side");function TT(){lh.classList.add("open")}function hp(){lh.classList.remove("open")}It("#burger").addEventListener("click",()=>lh.classList.toggle("open"));It("#closeSide").addEventListener("click",hp);It("#panelBtn").addEventListener("click",()=>It("#layers").classList.toggle("open"));It("#legendJ").innerHTML=Object.values(mi).map(i=>`<span title="${kt(i.d)}"><i class="sdot" style="background:${i.c}"></i>${kt(i.pl)}</span>`).join("");var hs=It("#modal"),dp=It("#mbody");function th(i){dp.innerHTML=i,hs.classList.add("show")}It("#menuBtn").addEventListener("click",()=>It("#menu").classList.toggle("show"));document.addEventListener("pointerdown",i=>{let t=!1,e=i.target;!e.closest("#menu,#menuBtn")&&It("#menu").classList.contains("show")&&(It("#menu").classList.remove("show"),t=!0),!e.closest("#layers,#panelBtn")&&It("#layers").classList.contains("open")&&(It("#layers").classList.remove("open"),t=!0),window.innerWidth<820&&!e.closest("#side,#burger")&&lh.classList.contains("open")&&(hp(),t=!0),t&&e===nn&&(i.stopPropagation(),i.preventDefault())},!0);It("#menu").addEventListener("click",i=>{let t=i.target.closest("button");t&&(It("#menu").classList.remove("show"),t.dataset.m==="about"&&th(`<h3>O autorze</h3><p><b>Anatomia</b> \u2014 wersja <b>v${G_}</b></p><p>Autor: <b>Micha\u0142 Rzekiecki</b><br>Kontakt: <a href="mailto:kontakt@smialo.org">kontakt@smialo.org</a></p><hr><p class="small">Model 3D: <a href="https://www.z-anatomy.com" target="_blank" rel="noopener">Z-Anatomy</a> (CC BY-SA 4.0), oparty na BodyParts3D \xA9 The Database Center for Life Science (CC BY-SA 2.1 Japan). Nazwy \u0142aci\u0144skie wg Terminologia Anatomica. Opisy maj\u0105 charakter edukacyjny \u2014 w razie w\u0105tpliwo\u015Bci sprawd\u017A w podr\u0119czniku anatomii.</p>`),t.dataset.m==="sug"&&th('<h3>Sugestie</h3><p class="small">Napisz, co sprawi\u0142oby, \u017Ce aplikacja b\u0119dzie jeszcze lepsza.</p><textarea id="sugTxt" rows="6" placeholder="Twoja sugestia\u2026"></textarea><div class="btns"><button id="sugSend" class="pri">Wy\u015Blij e-mailem</button><button id="sugCopy">Kopiuj</button></div><p class="small">Otworzy si\u0119 Tw\xF3j program pocztowy (adres: kontakt@smialo.org).</p>'),t.dataset.m==="help"&&th('<h3>Obs\u0142uga</h3><ul class="small"><li><b>Obr\xF3t</b> \u2014 przeci\u0105gnij mysz\u0105 / palcem; <b>przesuwanie</b> \u2014 prawy przycisk lub dwa palce; <b>zoom</b> \u2014 k\xF3\u0142ko / uszczypni\u0119cie.</li><li><b>Klik</b> w struktur\u0119 \u2014 wyb\xF3r; kolejny klik w mi\u0119sie\u0144 wielog\u0142owy \u2014 wyb\xF3r konkretnej g\u0142owy.</li><li><b>Niebieski</b> = pocz\u0105tek mi\u0119\u015Bnia, <b>pomara\u0144czowy</b> = przyczep ko\u0144cowy.</li><li><b>Prawa / Lewa / Obie</b> (u g\xF3ry) \u2014 wyb\xF3r strony cia\u0142a; lewa strona to lustrzane odbicie prawej (ko\u015Bci i mi\u0119\u015Bnie ko\u0144czyny s\u0105 symetryczne).</li><li><b>\u2611 Wiele mi\u0119\u015Bni</b> \u2014 zaznaczasz kilka mi\u0119\u015Bni naraz (na komputerze tak\u017Ce Ctrl/Shift + klik). W karcie mi\u0119\u015Bnia: antagoni\u015Bci i stawy, na kt\xF3re dzia\u0142a.</li><li><b>Stawy</b> \u2014 zak\u0142adka z typem, osiami, liczb\u0105 powierzchni i mi\u0119\u015Bniami (agoni\u015Bci \u21C4 antagoni\u015Bci); kolor znacznika = typ stawu (Warstwy \u25B8 Stawy).</li><li>Klawisz <b>/</b> \u2014 szukaj. Szukajka obejmuje nazwy polskie, \u0142aci\u0144skie i angielskie.</li></ul>'))});hs.addEventListener("pointerdown",i=>{i.target===hs&&hs.classList.remove("show")});hs.addEventListener("click",i=>{if(i.target===hs||i.target.closest("#mclose")){hs.classList.remove("show");return}let t=()=>It("#sugTxt")?It("#sugTxt").value.trim():"";if(i.target.id==="sugSend"){let e=encodeURIComponent(t()||"(wpisz sugesti\u0119)");location.href=`mailto:kontakt@smialo.org?subject=${encodeURIComponent("Anatomia v"+G_+" \u2014 sugestia")}&body=${e}`}i.target.id==="sugCopy"&&(navigator.clipboard?.writeText(t()),i.target.textContent="Skopiowano")});var wT=[["bark",'<ellipse cx="88" cy="94" rx="24" ry="17" transform="rotate(-14 88 94)"/>'],["ramie",'<rect x="49" y="104" width="23" height="84" rx="11" transform="rotate(11 60 146)"/>'],["przedramie",'<rect x="30" y="190" width="21" height="78" rx="10" transform="rotate(6 40 229)"/>'],["dlon",'<path d="M24 272h22l-2 22q-1 12-9 24-3 5-5 0-6-12-6-24z"/>']];function ET(){let i=(t,e)=>`<g ${e?'transform="translate(240 0) scale(-1 1)"':""} data-side="${t}">${wT.map(([n,s])=>`<g class="bz" data-r="${n}" data-sd="${t}" tabindex="0" role="button" aria-label="${kt(pi[n])} ${t==="r"?"prawy":"lewy"}">${s}</g>`).join("")}</g>`;return`<h3>Wybierz obszar cia\u0142a</h3><p class="small">Kliknij cz\u0119\u015B\u0107 sylwetki. Lewa strona rysunku to <b>prawa</b> strona cia\u0142a (jak patrzysz na cz\u0142owieka z przodu).</p>
  <svg id="bmsvg" viewBox="0 0 240 440" role="img" aria-label="Sylwetka cz\u0142owieka">
    <g class="bz" data-r="glowa" data-sd="x" tabindex="0" role="button" aria-label="G\u0142owa i szyja"><ellipse cx="120" cy="38" rx="23" ry="29"/><rect x="107" y="62" width="26" height="24" rx="6"/></g>
    <g class="bz off" title="Tu\u0142\xF3w \u2014 wkr\xF3tce"><path d="M96 92h48q8 6 6 30l-4 112q-2 12-26 12t-26-12l-4-112q-2-24 6-30z"/></g>
    <g class="bz off" title="Miednica i nogi \u2014 wkr\xF3tce"><path d="M95 244h50l-3 60-6 126h-14l-4-90-4 90h-14l-6-126z"/></g>
    ${i("r",!1)}${i("l",!0)}
    <text x="120" y="270" class="bmt" text-anchor="middle">tu\u0142\xF3w</text><text x="120" y="360" class="bmt" text-anchor="middle">nogi</text>
  </svg>
  <div class="bmleg"><span><i class="bz-d on"></i>obszar dost\u0119pny</span><span><i class="bz-d"></i>wkr\xF3tce (tu\u0142\xF3w, nogi)</span></div>
  <div class="btns"><button data-bm="all">Ca\u0142a ko\u0144czyna g\xF3rna</button><button data-bm="both">Obie strony</button></div>`}function AT(){Er("#bmsvg .bz[data-r]").forEach(i=>{let t=i.dataset.r,e=i.dataset.sd;i.classList.toggle("on",B.region===t&&(e==="x"||B.side==="b"||B.side===e))})}It("#bodyBtn").addEventListener("click",()=>{th(ET()),AT()});dp.addEventListener("click",i=>{let t=i.target.closest("[data-bm]");if(t){t.dataset.bm==="both"?oh("b"):ep("all"),hs.classList.remove("show");return}let e=i.target.closest("#bmsvg .bz[data-r]");if(!e)return;let n=e.dataset.sd;(n==="r"||n==="l")&&oh(n),hs.classList.remove("show"),ep(e.dataset.r)});dp.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&i.target.matches("#bmsvg .bz")&&(i.preventDefault(),i.target.dispatchEvent(new MouseEvent("click",{bubbles:!0})))});var Bs=0,zs=0;function Q_(){let i=nn.parentElement.clientWidth,t=nn.parentElement.clientHeight;Ar.setSize(i,t,!1),Ze.aspect=i/t,Ze.clearViewOffset(),Bs=zs=0,Ze.updateProjectionMatrix(),Xs()}new ResizeObserver(Q_).observe(nn.parentElement);Q_();function RT(){let i=nn.parentElement.clientWidth,t=nn.parentElement.clientHeight,e=window.innerWidth<820,n=B.sel&&!e?195:0,s=B.sel&&e?t*.2:0;if(Math.abs(Bs-n)<.5&&Math.abs(zs-s)<.5){if(Bs===n&&zs===s)return;Bs=n,zs=s}else Bs+=(n-Bs)*.16,zs+=(s-zs)*.16;Math.abs(Bs)<.5&&Math.abs(zs)<.5?Ze.clearViewOffset():Ze.setViewOffset(i,t,Bs,zs,i,t),Ze.updateProjectionMatrix(),Xs()}function t0(i){requestAnimationFrame(t0),gT(i),RT(),(Fe.update()||jf)&&(eh.position.copy(Ze.position),eh.target.position.copy(Fe.target),Ar.render(Fi,Ze),jf=Fe.autoRotate,mT())}us();xl();Er("#sides button").forEach(i=>i.classList.toggle("on",i.dataset.s===B.side));op.then(()=>{Ne();let i=lp(j_("all")),t=i.getCenter(new I),e=i.getSize(new I).length()/2;Fe.target.copy(t),Ze.position.copy(t).add(new I(.12,.05,1).normalize().multiplyScalar(ap(e)*1)),Fe.update(),Xs(),window.__anat={STR:Oi,ensureStruct:Zo,S:B,select:Pn,G:ne,DATA:he,objs:yn,SIDE:fe,camera:Ze,controls:Fe,apply:Ne,viewRegion:vl,setSide:oh,toggleMulti:Sl,setMulti:Qu,ensureAxial:Yo,JMAP:Ae}});requestAnimationFrame(t0);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
