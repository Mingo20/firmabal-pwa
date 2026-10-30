/* FirmAbal: notificaciones + alertas (sonido/vibracion) */
(function(){
"use strict";
const NKEY="firmabal-notifs-v1";
const PKEY="firmabal-prefs-v1";
const getN=()=>{try{return JSON.parse(localStorage.getItem(NKEY)||"[]")}catch(e){return[]}};
const setN=a=>{try{localStorage.setItem(NKEY,JSON.stringify(a.slice(-200)))}catch(e){}};
const prefs=()=>{try{return JSON.parse(localStorage.getItem(PKEY)||"{}")}catch(e){return{}}};
const setPrefs=p=>{try{localStorage.setItem(PKEY,JSON.stringify(p))}catch(e){}};

function beep(){
  try{
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    const c=new AC();const o=c.createOscillator(),g=c.createGain();
    o.type="sine";o.frequency.value=880;g.gain.value=0.0001;
    o.connect(g);g.connect(c.destination);o.start();
    g.gain.exponentialRampToValueAtTime(0.14,c.currentTime+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+0.32);
    o.stop(c.currentTime+0.34);
    setTimeout(()=>{try{c.close()}catch(e){}},600);
  }catch(e){}
}
function vibrate(pattern){
  try{if(navigator.vibrate)navigator.vibrate(pattern||[35])}catch(e){}
}
/* Aviso: sonido y/o vibracion segun preferencias del usuario */
function alert_(kind){
  const p=prefs();
  if(kind==="success"){ if(p.sound!==false)beep(); if(p.vibra!==false)vibrate([25]); return; }
  if(kind==="location"){ if(p.sound!==false)beep(); if(p.vibra!==false)vibrate([20,60,20]); return; }
  if(p.sound!==false)beep(); if(p.vibra!==false)vibrate([30]);
}
function push(n){
  const a=getN();const item=Object.assign({nid:"N-"+Date.now()+Math.random().toString(36).slice(2,6),t:Date.now(),leida:false},n);
  a.push(item);setN(a);
  try{if(window.FASync)FASync.pushNotif({nid:item.nid,para:item.para||"admin",tipo:item.tipo||"sistema",titulo:item.titulo,texto:item.texto||"",t:item.t})}catch(e){}
  paintBadge();alert_(item.tipo==="ubicacion"?"location":"notif");
  return item;
}
const unread=()=>getN().filter(n=>!n.leida).length;
function paintBadge(){
  const b=document.getElementById("nBadge");if(!b)return;const n=unread();
  b.textContent=n>99?"99+":String(n);b.hidden=n===0;
}
function markAllRead(){
  const a=getN().map(n=>Object.assign(n,{leida:true}));setN(a);paintBadge();
  try{if(window.FASync)getN().forEach(n=>FASync.readNotif(n.nid,(window.__me&&window.__me())||"U-1"))}catch(e){}
}
const WHEN=t=>{const d=new Date(t),h=Math.floor((Date.now()-t)/3600000);
  if(h<1)return"Ahora mismo";if(h<24)return"Hace "+h+" h";
  if(h<48)return"Ayer";return d.toLocaleDateString("es-DO")};

function paintList(host){
  const a=getN().slice().reverse();
  if(!a.length){host.innerHTML='<p class="sub" style="text-align:center;padding:34px 10px">No tiene notificaciones todavía.</p>';return}
  host.innerHTML=a.map(n=>`<div class="ncard ${n.leida?"":"unread"}">
   <div class="nico">${n.tipo==="ubicacion"?'<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#10131A" stroke-width="1.8"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg>':n.tipo==="registro"?'<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#10131A" stroke-width="1.8"><path d="M7 3.5h7.2L19 8.3V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V9h5"/></svg>':'<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="#10131A" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5l3 2"/></svg>'}</div>
   <div style="min-width:0"><b>${esc0(n.titulo)}</b><small>${esc0(n.texto||"")}</small><small style="color:#9AA0AC;margin-top:5px">${WHEN(n.t)}</small></div></div>`).join("");
}
const esc0=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const Notifs={push,alert:alert_,prefs,setPrefs,unread,paintBadge,markAllRead,paintList,getN,setN};
window.FANotif=Notifs;
})();
