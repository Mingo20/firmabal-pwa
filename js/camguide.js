/* FirmAbal: visor de camara con marco guia para la cedula.
   Abre la camara trasera, muestra un marco con la proporcion real de la cedula (ISO ID-1, 85.6 x 54 mm = 1.586),
   oscurece lo que queda fuera y, al capturar, recorta SOLO el area dentro del marco.
   Si la camara no esta disponible (permiso negado, navegador sin soporte), devuelve null y la app usa el selector de siempre. */
(function(){
"use strict";
const RATIO=85.6/54; // 1.585...

function css(){
  if(document.getElementById("cgcss"))return;
  const s=document.createElement("style");s.id="cgcss";
  s.textContent=`
  .cg{position:fixed;inset:0;z-index:3000;background:#000;display:flex;flex-direction:column;color:#fff;font-family:inherit}
  .cg video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}
  .cg-top{position:absolute;top:0;left:0;right:0;padding:calc(env(safe-area-inset-top) + 14px) 16px 14px;display:flex;align-items:center;justify-content:space-between;z-index:3;background:linear-gradient(#000a,#0000)}
  .cg-top b{font-size:17px}
  .cg-x{width:42px;height:42px;border-radius:50%;border:0;background:#ffffff26;color:#fff;font-size:20px;cursor:pointer;backdrop-filter:blur(6px)}
  .cg-mask{position:absolute;inset:0;z-index:2;pointer-events:none}
  .cg-frame{position:absolute;z-index:3;pointer-events:none;border-radius:16px;box-shadow:0 0 0 9999px rgba(0,0,0,.62);border:2px solid #fff;transition:border-color .2s}
  .cg-frame i{position:absolute;width:26px;height:26px;border:4px solid #fff;border-radius:6px}
  .cg-frame i:nth-child(1){left:-4px;top:-4px;border-right:0;border-bottom:0}
  .cg-frame i:nth-child(2){right:-4px;top:-4px;border-left:0;border-bottom:0}
  .cg-frame i:nth-child(3){left:-4px;bottom:-4px;border-right:0;border-top:0}
  .cg-frame i:nth-child(4){right:-4px;bottom:-4px;border-left:0;border-top:0}
  .cg-hint{position:absolute;left:0;right:0;z-index:3;text-align:center;font-size:15px;padding:0 24px;text-shadow:0 1px 4px #000}
  .cg-bot{position:absolute;bottom:0;left:0;right:0;padding:18px 16px calc(env(safe-area-inset-bottom) + 22px);display:flex;align-items:center;justify-content:center;z-index:3;background:linear-gradient(#0000,#000a)}
  .cg-shot{width:74px;height:74px;border-radius:50%;border:5px solid #fff;background:#ffffff33;cursor:pointer;padding:0;position:relative}
  .cg-shot:active{transform:scale(.94)}
  .cg-shot:after{content:"";position:absolute;inset:7px;border-radius:50%;background:#fff}
  .cg-flash{position:absolute;inset:0;background:#fff;opacity:0;z-index:5;pointer-events:none;transition:opacity .25s}
  .cg-prev{position:absolute;inset:0;z-index:6;background:#101319;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px}
  .cg-prev img{max-width:100%;max-height:60vh;border-radius:14px;background:#fff;box-shadow:0 10px 30px #0008}
  .cg-prev .row{display:flex;gap:12px;width:100%;max-width:420px}
  .cg-prev button{flex:1;padding:15px;border-radius:16px;border:0;font-size:16px;font-weight:600;font-family:inherit;cursor:pointer}
  .cg-prev .ok{background:#fff;color:#10131A}.cg-prev .re{background:#ffffff26;color:#fff}`;
  document.head.appendChild(s);
}

/* Calcula el marco (en pixeles de pantalla) centrado, con la proporcion de la cedula y ocupando ~88% del ancho */
function frameBox(W,H){
  let w=Math.min(W*0.88,(H*0.5)*RATIO),h=w/RATIO;
  const x=(W-w)/2,y=Math.max(90,(H-h)/2-30);
  return {x,y,w,h};
}

/* Recorta del video SOLO lo que hay dentro del marco. El video usa object-fit:cover, asi que hay que mapear pantalla -> video. */
function cropFromVideo(video,box,W,H){
  const vw=video.videoWidth,vh=video.videoHeight;
  const sc=Math.max(W/vw,H/vh);             // escala de "cover"
  const offX=(vw*sc-W)/2,offY=(vh*sc-H)/2; // parte del video que queda fuera de la pantalla
  const sx=(box.x+offX)/sc,sy=(box.y+offY)/sc,sw=box.w/sc,sh=box.h/sc;
  const maxW=1100,k=Math.min(1,maxW/sw);
  const c=document.createElement("canvas");c.width=Math.round(sw*k);c.height=Math.round(sh*k);
  const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);
  g.drawImage(video,sx,sy,sw,sh,0,0,c.width,c.height);
  return c.toDataURL("image/jpeg",0.85);
}

/* API: capture({titulo}) -> Promise<dataURL|null>.  null = camara no disponible o cancelado sin foto. */
async function capture(opts){
  opts=opts||{};
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return {unavailable:true};
  css();
  let stream;
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1080}},audio:false});
  }catch(e){return {unavailable:true,error:e&&e.name}}

  return new Promise(resolve=>{
    const root=document.createElement("div");root.className="cg";
    root.innerHTML=`<video playsinline muted autoplay></video>
      <div class="cg-top"><b>${opts.titulo||"Cédula"}</b><button class="cg-x" aria-label="Cerrar">✕</button></div>
      <div class="cg-frame"><i></i><i></i><i></i><i></i></div>
      <div class="cg-hint"></div>
      <div class="cg-bot"><button class="cg-shot" aria-label="Capturar"></button></div>
      <div class="cg-flash"></div>`;
    document.body.appendChild(root);
    const video=root.querySelector("video"),frame=root.querySelector(".cg-frame"),hint=root.querySelector(".cg-hint");
    video.srcObject=stream;
    let box;
    const layout=()=>{const W=window.innerWidth,H=window.innerHeight;box=frameBox(W,H);
      frame.style.left=box.x+"px";frame.style.top=box.y+"px";frame.style.width=box.w+"px";frame.style.height=box.h+"px";
      hint.style.top=(box.y+box.h+16)+"px";hint.textContent=opts.hint||"Coloque la cédula dentro del marco y toque el botón"};
    layout();window.addEventListener("resize",layout);
    const done=v=>{window.removeEventListener("resize",layout);try{stream.getTracks().forEach(t=>t.stop())}catch(e){}root.remove();resolve(v)};
    root.querySelector(".cg-x").onclick=()=>done({cancelled:true});
    root.querySelector(".cg-shot").onclick=()=>{
      if(!video.videoWidth)return;
      const data=cropFromVideo(video,box,window.innerWidth,window.innerHeight);
      const fl=root.querySelector(".cg-flash");fl.style.opacity=".85";setTimeout(()=>fl.style.opacity="0",120);
      /* vista previa: aceptar o repetir */
      const pv=document.createElement("div");pv.className="cg-prev";
      pv.innerHTML=`<img src="${data}" alt="Captura"><div class="row"><button class="re">Repetir</button><button class="ok">Usar foto</button></div>`;
      root.appendChild(pv);
      pv.querySelector(".re").onclick=()=>pv.remove();
      pv.querySelector(".ok").onclick=()=>done({data});
    };
  });
}

const available=()=>{try{return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&(window.isSecureContext||location.hostname==="localhost"))}catch(e){return false}};
window.FACam={capture,available,RATIO,_crop:cropFromVideo,_frame:frameBox};
})();
