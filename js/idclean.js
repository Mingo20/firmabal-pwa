/* FirmAbal: limpieza de fondo de fotos de cedula.
   Detecta la tarjeta (rectangulo claro que contrasta con la mesa/mano), recorta con un margen minimo,
   pinta de BLANCO todo lo que quede fuera de la tarjeta y mejora ligeramente el contraste.
   Si la tarjeta no se detecta con confianza, devuelve la imagen original (nunca la estropea). */
(function(){
"use strict";

function loadImg(src){return new Promise((ok,ko)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=ko;im.src=src})}

/* Analiza en baja resolucion: devuelve {x0,y0,x1,y1} de la tarjeta en coordenadas relativas 0..1, o null */
function detect(im){
  const W=160,H=Math.max(40,Math.round(160*im.height/im.width));
  const c=document.createElement("canvas");c.width=W;c.height=H;
  const g=c.getContext("2d",{willReadFrequently:true});g.drawImage(im,0,0,W,H);
  const d=g.getImageData(0,0,W,H).data;
  /* color de fondo = mediana de los bordes (la mesa o superficie que rodea la tarjeta) */
  const border=[];
  const px=(x,y)=>{const i=(y*W+x)*4;return [d[i],d[i+1],d[i+2]]};
  for(let x=0;x<W;x+=3){border.push(px(x,0),px(x,H-1))}
  for(let y=0;y<H;y+=3){border.push(px(0,y),px(W-1,y))}
  const med=k=>{const a=border.map(p=>p[k]).sort((p,q)=>p-q);return a[a.length>>1]};
  const bg=[med(0),med(1),med(2)];
  const dist=(p)=>Math.abs(p[0]-bg[0])+Math.abs(p[1]-bg[1])+Math.abs(p[2]-bg[2]);
  /* mascara: pixeles que difieren del fondo */
  const mask=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){mask[y*W+x]=dist(px(x,y))>70?1:0}
  /* proyeccion por filas y columnas: la tarjeta es la zona con mayor densidad */
  const col=new Array(W).fill(0),row=new Array(H).fill(0);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(mask[y*W+x]){col[x]++;row[y]++}
  const thr=(arr,len,f)=>{const lim=len*f;let a=0,b=arr.length-1;while(a<arr.length&&arr[a]<lim)a++;while(b>a&&arr[b]<lim)b--;return [a,b]};
  const [x0,x1]=thr(col,H,0.30),[y0,y1]=thr(row,W,0.30);
  const bw=(x1-x0+1)/W,bh=(y1-y0+1)/H;
  /* validaciones: tamano razonable y proporcion de tarjeta (~1.58) */
  if(bw<0.35||bh<0.25||x1<=x0||y1<=y0)return null;
  const ratio=((x1-x0+1)*im.width/W)/((y1-y0+1)*im.height/H);
  if(ratio<1.15||ratio>2.1)return null;
  return {x0:x0/W,y0:y0/H,x1:(x1+1)/W,y1:(y1+1)/H,bg};
}

/* Devuelve una dataURL JPEG limpia: fondo blanco, tarjeta recortada */
async function clean(src,opts){
  opts=opts||{};
  try{
    const im=await loadImg(src);
    const box=detect(im);
    if(!box)return opts.fallback===false?null:src;
    const pad=0.012;
    const sx=Math.max(0,(box.x0-pad))*im.width,sy=Math.max(0,(box.y0-pad))*im.height;
    const sw=Math.min(1,(box.x1+pad))*im.width-sx,sh=Math.min(1,(box.y1+pad))*im.height-sy;
    const maxW=opts.maxW||900,k=Math.min(1,maxW/sw);
    const out=document.createElement("canvas");out.width=Math.round(sw*k);out.height=Math.round(sh*k);
    const g=out.getContext("2d");
    g.fillStyle="#fff";g.fillRect(0,0,out.width,out.height);
    g.filter="contrast(1.08) brightness(1.04) saturate(1.02)";
    g.drawImage(im,sx,sy,sw,sh,0,0,out.width,out.height);
    g.filter="none";
    /* esquinas redondeadas de la tarjeta: lo que queda fuera del borde redondeado se pinta de blanco */
    const r=Math.round(Math.min(out.width,out.height)*0.045);
    const m=document.createElement("canvas");m.width=out.width;m.height=out.height;
    const mg=m.getContext("2d");mg.fillStyle="#fff";mg.fillRect(0,0,m.width,m.height);
    mg.globalCompositeOperation="destination-out";
    mg.beginPath();
    mg.moveTo(r,0);mg.lineTo(m.width-r,0);mg.quadraticCurveTo(m.width,0,m.width,r);
    mg.lineTo(m.width,m.height-r);mg.quadraticCurveTo(m.width,m.height,m.width-r,m.height);
    mg.lineTo(r,m.height);mg.quadraticCurveTo(0,m.height,0,m.height-r);
    mg.lineTo(0,r);mg.quadraticCurveTo(0,0,r,0);mg.closePath();mg.fill();
    g.drawImage(m,0,0);
    return out.toDataURL("image/jpeg",0.92);
  }catch(e){return src}
}

window.FAIdClean={clean,detect};
})();
