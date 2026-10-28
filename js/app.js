(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const view=$("#view");
const KEY="firmabal-db-v3";
const db=JSON.parse(localStorage.getItem(KEY)||"null")||{meta:10,collector:{id:"REC-001",name:"Domingo Guerra",sharing:false},records:[
 {id:"R-1",nombre:"CARMEN CHALAS MENA",cedula:"224-0009987-9",nac:"1975-03-20",sexo:"F",lugar:"Santo Domingo",whatsapp:"8296469885",direccion:"San José casa 37",municipio:"Santo Domingo Oeste",distrito:"",sector:"Hato Nuevo",circ:"4",firma:null,estado:"verificado",fecha:Date.now()-86400000*3,rec:"REC-001",lat:18.4861,lng:-69.9712},
 {id:"R-2",nombre:"MIGUEL ANGEL GUERRA CHALAS",cedula:"402-2990201-2",nac:"1999-08-11",sexo:"M",lugar:"Santo Domingo",whatsapp:"8095550002",direccion:"Calle Principal 5",municipio:"Santo Domingo",distrito:"",sector:"Hato Nuevo",circ:"4",firma:null,estado:"pendiente",fecha:Date.now()-86400000*3,rec:"REC-001",lat:18.4722,lng:-69.9961}]};
const ROLES={administrador:{n:"Administrador",d:"Acceso completo al sistema.",p:["capturar","consultar","cedula","telefono","firmas","modificar","eliminar","exportar","auditoria","configurar","usuarios","monitor"]},supervisor:{n:"Supervisor",d:"Consulta, revisión y supervisión de registros.",p:["capturar","consultar","cedula","telefono","firmas","modificar","exportar","monitor"]},recolector:{n:"Recolector",d:"Captura de registros y consulta mínima.",p:["capturar","consultar"]},auditor:{n:"Auditor",d:"Consulta de registros de auditoría.",p:["consultar","auditoria"]}};
const PROVS=["Distrito Nacional","Santo Domingo","Santiago","La Vega","San Cristóbal","Puerto Plata","La Altagracia","San Pedro de Macorís","Duarte","Espaillat","La Romana","Azua","Barahona","Monseñor Nouel","Peravia","Valverde","Otra"];
db.users=db.users||[{id:"U-1",nombre:db.collector.name,rol:"administrador",whatsapp:"8296469885",provincia:"Santo Domingo",municipio:"Santo Domingo Oeste",activo:true}];
db.audit=db.audit||[{t:Date.now()-86400000*2,u:db.collector.name,a:"Creación de registro",reg:"R-1",det:"Cédula 224-0009987-9",ok:true},{t:Date.now()-86400000*2,u:db.collector.name,a:"Creación de registro",reg:"R-2",det:"Cédula 402-2990201-2",ok:true},{t:Date.now()-86400000,u:db.collector.name,a:"Cambio de permisos / config",reg:"—",det:"Permisos rol administrador",ok:true}];
db.me=db.me||"U-1";
const me=()=>db.users.find(u=>u.id===db.me)||db.users[0];
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
const logA=(a,reg,det,ok=true)=>{db.audit.unshift({t:Date.now(),u:me().nombre,a,reg:reg||"—",det:det||"—",ok});db.audit=db.audit.slice(0,300);save()};
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2400)};
const WAI=(w,c)=>`<svg viewBox="0 0 32 32" width="${w}" height="${w}" aria-hidden="true"><path fill="${c}" d="M16 3C8.8 3 3 8.8 3 16c0 2.5.7 4.8 1.9 6.8L3 29l6.4-1.8A13 13 0 0 0 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.7c-2 0-3.9-.6-5.6-1.6l-.4-.2-3.8 1.100 1-3.700-.3-.4A10.700 10.700 0 1 1 16 26.700zm5.900-8c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.2-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.100-.7l.5-.5c.1-.2.200-.3.300-.5.100-.2.100-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.300 4.700 3.100 1.300 3.100.9 3.700.8.600-.1 1.900-.8 2.100-1.500.3-.7.300-1.400.2-1.500-.1-.2-.3-.3-.6-.4z"/></svg>`;
const ICONS={"dash": "<path d=\"M3 11l9-8 9 8\"/><path d=\"M5 10v10h5v-6h4v6h5V10\"/>", "reg": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M17 14c2.8 0 4.5 1.9 4.5 5\"/>", "captura": "<path d=\"M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z\"/><circle cx=\"12\" cy=\"13\" r=\"3.6\"/>", "monitor": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M8 20h8M12 16v4\"/>", "terr": "<path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.6\"/>", "recol": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6\"/><path d=\"M16 11l2 2 4-4\"/>", "firmas": "<path d=\"M12 19l7-7-4-4-7 7-1.5 5.5L12 19z\"/><path d=\"M15 5l4 4\"/>", "audit": "<path d=\"M7 3h11a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z\"/><path d=\"M10 8h6M10 12h6\"/>", "export": "<path d=\"M12 4v11M7 11l5 5 5-5M4 20h16\"/>", "config": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z\"/>"};
const MENU=[["dash", "Inicio"], ["reg", "Registros"], ["captura", "Captura"], ["monitor", "Monitor"], ["terr", "Territorios"], ["recol", "Recolectores"], ["firmas", "Firmas"], ["audit", "Auditor\u00eda"], ["export", "Exportaci\u00f3n"], ["config", "Configuraci\u00f3n"]];
const isToday=ts=>new Date(ts).toDateString()===new Date().toDateString();
const stats=()=>({total:db.records.length,hoy:db.records.filter(r=>isToday(r.fecha)).length,pen:db.records.filter(r=>r.estado==="pendiente").length,dup:db.records.filter(r=>r.estado==="duplicado").length,auto:db.records.filter(r=>r.auto).length});
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let cur="dash",map=null,wiz=null;

/* ---- Auto registro sheet ---- */
const link=()=>location.origin+location.pathname+"?auto=1&rec="+db.collector.id;
const openS=(el)=>{const m=$("#sheetMask");m.hidden=false;el.hidden=false;void el.offsetWidth;m.classList.add("show");el.classList.add("show")};
const closeS=(el,done)=>{const m=$("#sheetMask");el.classList.remove("show");m.classList.remove("show");setTimeout(()=>{el.hidden=true;if(!$$(".sheet.show").length)m.hidden=true;done&&done()},430)};
const sheet=show=>show?openS($("#autoSheet")):closeS($("#autoSheet"));
const closeAll=()=>{$$(".sheet.show").forEach(s=>closeS(s))};
function dyn(html,build){const w=document.createElement("div");w.innerHTML=html;document.body.appendChild(w);const mask=w.querySelector(".dmask"),sh=w.querySelector(".dsheet");
 requestAnimationFrame(()=>{mask.classList.add("show");sh.classList.add("show")});
 const close=()=>{sh.classList.remove("show");mask.classList.remove("show");setTimeout(()=>w.remove(),430)};
 mask.onclick=close;const x=w.querySelector("[data-x]");if(x)x.onclick=close;build&&build(w,close);return close}
$("#btnShare").onclick=()=>sheet(true);$("#btnCloseSheet").onclick=()=>sheet(false);
$("#btnWa").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent("Regístrate como afiliado aquí: "+link()),"_blank");
$("#btnQr").onclick=()=>{closeS($("#autoSheet"),()=>{const b=$("#qrBox");b.innerHTML="";try{new QRCode(b,{text:link(),width:230,height:230,colorDark:"#10131A",colorLight:"#ffffff"})}catch{b.innerHTML="<p class='sub'>No se pudo generar el QR sin conexión.</p>"}openS($("#qrSheet"))})};
$("#btnCloseQr").onclick=()=>closeS($("#qrSheet"));
$("#btnQrBack").onclick=()=>closeS($("#qrSheet"),()=>openS($("#autoSheet")));

/* ---- Navegación ---- */
const menuSheet=show=>{if(!show)return closeS($("#menuSheet"));{$("#menuGrid").innerHTML=MENU.map(([k,l])=>`<button data-go="${k}" class="${cur===k?"on":""}"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#2B2F38" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>${l}</button>`).join("");$$("[data-go]").forEach(b=>b.onclick=()=>{closeS($("#menuSheet"),()=>go(b.dataset.go))});openS($("#menuSheet"))}};
$("#btnCloseMenu").onclick=()=>menuSheet(false);
$("#sheetMask").onclick=closeAll;
$$(".tab").forEach(b=>b.onclick=()=>b.dataset.v==="menu"?menuSheet(true):go(b.dataset.v));
let navBusy=false;
function go(v){if(navBusy)return;navBusy=true;const bar=document.querySelector(".pagebar")||(()=>{const b=document.createElement("div");b.className="pagebar";document.body.appendChild(b);return b})();
 bar.style.opacity=1;bar.classList.remove("go");void bar.offsetWidth;bar.classList.add("go");view.classList.add("out");
 setTimeout(()=>{goNow(v);view.classList.remove("out");view.classList.remove("in");void view.offsetWidth;view.classList.add("in");setTimeout(()=>{bar.style.opacity=0;setTimeout(()=>{bar.classList.remove("go");bar.style.width=0},350);navBusy=false},1000)},900)}
function goNow(v){cur=v;$$(".tab").forEach(b=>b.classList.toggle("on",b.dataset.v===v||(b.dataset.v==='equipo'&&['monitor','terr','recol'].includes(v))));if(map){map.remove();map=null}
 ({dash:vDash,equipo:vEquipo,monitor:vEquipo,terr:vTerr,recol:vRecol,captura:vCaptura,reg:vReg,firmas:vFirmas,audit:vAdmin,export:vExport,config:vConfig})[v]();view.scrollTop=0}

/* ---- Centro de control ---- */
function vDash(){const s=stats(),pct=Math.min(100,Math.round(s.total/db.meta*100));
 view.innerHTML=`<div class="pad"><h1>Centro de control</h1><p class="sub">Resumen general de la captura territorial</p>
 <div class="grid"><div class="stat dark"><small>Registros totales</small><b>${s.total}</b></div><div class="stat"><small>Capturados hoy</small><b>${s.hoy}</b></div>
 <div class="stat amber"><small>Pendientes</small><b>${s.pen}</b></div><div class="stat red"><small>Duplicados</small><b>${s.dup}</b></div>
 <div class="stat"><small>Auto registros</small><b>${s.auto}</b></div><div class="stat"><small>Recolectores</small><b>${(db.users||[]).filter(u=>u.rol==="recolector"||u.rol==="administrador").length||1}</b></div></div>
 <div class="card" style="padding:26px 20px 20px"><div style="display:flex;gap:14px;align-items:center;font-size:21px;font-weight:600"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#10131A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>Registros por día (últimos 7)</div>${chart()}</div>`;
}
function chart(){const d=last7().filter(x=>x.n>0).length?last7().filter(x=>x.n>0):last7().slice(-1);const mx=Math.max(2,...d.map(x=>x.n));const ticks=[mx,mx*.75,mx/2,mx/4,0].map(v=>Math.round(v*10)/10);
 return `<div style="display:flex;margin-top:18px;height:340px;position:relative"><div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;padding-right:14px;color:#8A909C;font-size:18px;height:300px">${ticks.map(t=>`<span>${t}</span>`).join("")}</div>
 <div style="flex:1;position:relative;height:300px;border-bottom:1px solid #EDEFF3"><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between">${ticks.map(()=>'<i style="border-top:1px dashed #E7E9EE;display:block"></i>').join("")}</div>
 <div style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;gap:14px">${d.map(x=>`<div style="flex:0 1 ${d.length===1?"88%":"40px"};height:${x.n/mx*100}%;background:#E31E2D;border-radius:14px 14px 0 0"></div>`).join("")}</div>
 <div style="position:absolute;left:0;right:0;top:308px;display:flex;justify-content:center;gap:14px;color:#8A909C;font-size:18px">${d.map(x=>`<span style="flex:0 1 ${d.length===1?"88%":"40px"};text-align:center">${x.f}</span>`).join("")}</div></div></div>`}
function last7(){const o=[];for(let i=6;i>=0;i--){const d=new Date(Date.now()-i*86400000);o.push({l:["D","L","M","M","J","V","S"][d.getDay()],f:String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),n:db.records.filter(r=>new Date(r.fecha).toDateString()===d.toDateString()).length})}return o}

/* ---- Equipo / mapa ---- */
function vEquipo(){const s=stats();
 view.innerHTML=`<div class="mapwrap"><div id="map"></div></div>
 <div class="chips"><div class="chip"><span style="font-size:24px">👥</span><b>1</b><span>Recolectores activos</span></div>
 <div class="chip"><span style="font-size:24px">📍</span><b>${db.collector.sharing?1:0}</b><span>Compartiendo ubicación</span></div>
 <div class="chip"><span style="font-size:24px">✍️</span><b>${s.total}</b><span>Registros</span></div></div>
 <div class="pad"><button class="btn btn-dark" id="shareLoc">${db.collector.sharing?"Dejar de compartir ubicación":"Compartir mi ubicación en vivo"}</button></div>`;
 map=L.map("map",{zoomControl:true}).setView([18.4861,-69.9312],11);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:19}).addTo(map);
 db.records.filter(r=>r.lat).forEach(r=>L.circleMarker([r.lat,r.lng],{radius:9,color:"#10131A",fillColor:r.estado==="verificado"?"#0B9D6B":"#E8A317",fillOpacity:.9}).addTo(map).bindPopup(`<b>${esc(r.nombre)}</b><br>${esc(r.sector)} · Circ. ${esc(r.circ)}`));
 $("#shareLoc").onclick=()=>{if(db.collector.sharing){db.collector.sharing=false;save();return vEquipo()}
  navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{db.collector.sharing=true;db.collector.pos=[p.coords.latitude,p.coords.longitude];save();vEquipo();toast("Ubicación compartida")},()=>toast("No se pudo obtener la ubicación")):toast("Geolocalización no disponible")}}


/* ---- Firmas ---- */
function vFirmas(){view.innerHTML=`<div class="pad"><h1>Firmas</h1><p class="sub">${db.records.length} firmas registradas · toque una tarjeta para ver el expediente y descargar el PDF</p><div class="firmas">${db.records.map(r=>`<div class="fcard" data-id="${r.id}"><div class="fsig">${r.firma?`<img src="${r.firma}">`:`<svg viewBox="0 0 120 50" width="110"><path d="M5 35c15-30 20 5 30-15s15 30 30 0 20-10 30 5" fill="none" stroke="#10131A" stroke-width="2"/></svg>`}</div><b>${esc(r.nombre)}</b><small>${new Date(r.fecha).toLocaleDateString("es-DO")}</small></div>`).join("")}</div></div>`;
 $$(".fcard").forEach(c=>c.onclick=()=>detalle(c.dataset.id))}
function detalle(id){const r=db.records.find(x=>x.id===id);
 const lbl=(t,svg)=>`<div style="display:flex;gap:8px;align-items:center;font-weight:700;letter-spacing:.06em;color:#3A3F4A;font-size:14px;margin:0 0 10px">${svg}${t}</div>`;
 const IMG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3A3F4A" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>';
 const box=(t,k)=>`<div>${lbl(t,IMG)}<div style="border:1px solid #E7E9EE;border-radius:20px;min-height:130px;display:grid;place-items:center;color:#9AA0AC;font-size:16px;background:#fff;padding:8px;overflow:hidden">${r[k]?`<img src="${r[k]}" style="max-width:100%;max-height:200px;background:#fff;border-radius:10px">`:"No disponible"}</div></div>`;
 const dato=(k,v)=>`<div class="kv"><span>${k}</span><b style="text-align:right">${esc(v||"—")}</b></div>`;
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:93vh;display:flex;flex-direction:column;padding-bottom:0">
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/></svg></div><div class="sheet-title"><h2 style="font-size:18px;text-transform:uppercase">${esc(r.nombre)}</h2><p>${esc(r.cedula)}</p></div><button class="iconbtn" data-x>✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:16px 0">
  ${lbl("FIRMA MANUSCRITA",'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3A3F4A" stroke-width="1.7"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>')}
  <div style="border:1px solid #E7E9EE;border-radius:22px;height:190px;display:grid;place-items:center;background:#fff">${r.firma?`<img src="${r.firma}" style="max-width:92%;max-height:92%;background:#fff">`:`<span style="color:#9AA0AC">No disponible</span>`}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">${box("FRONTAL","imgFRONTAL")}${box("TRASERA","imgTRASERA")}</div>
  <div class="card" style="margin-top:18px;padding:6px 16px">${lbl("DATOS DEL FIRMANTE","")}${dato("Nombre",r.nombre)}${dato("Cédula",r.cedula)}${dato("Nacimiento",r.nac)}${dato("Sexo",r.sexo)}${dato("Lugar de nacimiento",r.lugar)}${dato("WhatsApp",r.whatsapp)}${dato("Dirección",r.direccion)}</div>
  <div class="card" style="margin-top:14px;padding:6px 16px">${lbl("DATOS ELECTORALES","")}${dato("Municipio",r.municipio)}${dato("Distrito municipal",r.distrito)}${dato("Sector",r.sector)}${dato("Circunscripción",r.circ)}${dato("Estado",r.estado)}${dato("Recolector",r.rec)}${dato("Fecha y hora",new Date(r.fecha).toLocaleString("es-DO"))}</div></div>
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="dpdf" style="margin:0">⬇ Descargar PDF</button></div></section>`,(w)=>{$("#dpdf",w).onclick=()=>pdfExpediente(r)})}

/* ---- PDF de expediente: profesional, evidencia ---- */
function pdfExpediente(r){if(!window.jspdf)return toast("Cargando exportador, intente de nuevo");const {jsPDF}=window.jspdf;const d=new jsPDF({unit:"mm",format:"a4"});const W=210,M=14;
 d.setFillColor(16,19,26);d.rect(0,0,W,26,"F");d.setTextColor(255);d.setFont("helvetica","bold");d.setFontSize(17);d.text("FirmAbal",M,12);d.setFont("helvetica","normal");d.setFontSize(9);d.text("Expediente de afiliación · Evidencia de registro",M,19);
 d.setFontSize(8);d.text("Generado: "+new Date().toLocaleString("es-DO"),W-M,19,{align:"right"});
 d.setTextColor(16,19,26);d.setFont("helvetica","bold");d.setFontSize(14);d.text(String(r.nombre||"").toUpperCase(),M,38);d.setFont("helvetica","normal");d.setFontSize(10);d.setTextColor(90);d.text("Cédula "+(r.cedula||"—")+"   ·   Registro "+r.id,M,44);
 const sec=(t,y)=>{d.setFillColor(241,242,245);d.rect(M,y,W-2*M,7,"F");d.setTextColor(16,19,26);d.setFont("helvetica","bold");d.setFontSize(9);d.text(t,M+3,y+5);return y+10};
 const rows=(arr,y)=>{arr.forEach((p,i)=>{d.setFont("helvetica","normal");d.setFontSize(9);d.setTextColor(120);d.text(p[0],M+3,y);d.setTextColor(16,19,26);d.setFont("helvetica","bold");d.text(String(p[1]||"—"),M+55,y);y+=6.2});return y+2};
 let y=sec("DATOS DEL FIRMANTE",50);y=rows([["Nombre completo",r.nombre],["Cédula",r.cedula],["Fecha de nacimiento",r.nac],["Sexo",r.sexo],["Lugar de nacimiento",r.lugar],["WhatsApp",r.whatsapp],["Dirección",r.direccion]],y);
 y=sec("DATOS ELECTORALES",y+1);y=rows([["Municipio",r.municipio],["Distrito municipal",r.distrito],["Sector",r.sector],["Circunscripción",r.circ],["Estado del registro",r.estado],["Recolector responsable",r.rec],["Fecha y hora",new Date(r.fecha).toLocaleString("es-DO")]],y);
 y=sec("FIRMA MANUSCRITA",y+1);d.setDrawColor(210);d.setFillColor(255,255,255);d.rect(M,y,W-2*M,34,"FD");
 if(r.firma)try{d.addImage(r.firma,"PNG",M+30,y+2,W-2*M-60,30)}catch{} y+=38;
 y=sec("DOCUMENTO DE IDENTIDAD",y);const bw=(W-2*M-6)/2,bh=44;
 [["Frontal",r.imgFRONTAL,M],["Trasera",r.imgTRASERA,M+bw+6]].forEach(([t,img,x])=>{d.setDrawColor(210);d.setFillColor(255,255,255);d.rect(x,y,bw,bh,"FD");d.setFont("helvetica","normal");d.setFontSize(8);d.setTextColor(120);
  if(img)try{const p=d.getImageProperties(img),k=Math.min((bw-4)/p.width,(bh-4)/p.height);const iw=p.width*k,ih=p.height*k;d.addImage(img,"JPEG",x+(bw-iw)/2,y+(bh-ih)/2,iw,ih)}catch{d.text("No disponible",x+bw/2,y+bh/2,{align:"center"})}else d.text("No disponible",x+bw/2,y+bh/2,{align:"center"});
  d.text(t,x+2,y+bh+4)});
 d.setDrawColor(200);d.line(M,285,W-M,285);d.setFontSize(7.5);d.setTextColor(130);d.text("Documento generado por FirmAbal. Datos tratados conforme a la legislación dominicana de protección de datos personales.",M,290);
 d.save("expediente-"+String(r.cedula||r.id).replace(/\W/g,"")+".pdf")}

/* ---- Territorios ---- */
function vTerr(){const g={};db.records.forEach(r=>{const k=r.municipio+" · "+r.sector+" · Circ. "+r.circ;g[k]=(g[k]||0)+1});
 view.innerHTML=`<div class="pad"><h1>Territorios</h1><p class="sub">Segmentación político-administrativa</p><div class="lst">${Object.entries(g).map(([k,n])=>`<div class="item"><div><b>${esc(k)}</b><small>${n} afiliado(s)</small></div><span class="pill ok">${n}</span></div>`).join("")||"<p class='sub'>Sin datos aún.</p>"}</div></div>`}
/* ---- Recolectores ---- */
function vRecol(){const s=stats();view.innerHTML=`<div class="pad"><h1>Recolectores</h1><p class="sub">Responsabilidad directa de cada inscripción</p>
 <div class="item"><div><b>${esc(db.collector.name)}</b><small>${db.collector.id} · ${s.total} firmas · ${db.collector.sharing?"ubicación en vivo":"sin ubicación"}</small></div><span class="pill ok">activo</span></div></div>`}
/* ---- Exportación ---- */
function vExport(){view.innerHTML=`<div class="pad"><h1>Exportación</h1><p class="sub">Descargue los expedientes individualizados</p>
 <button class="btn btn-dark" id="e1">PDF de todos los expedientes</button><button class="btn btn-light" id="e2">CSV de registros</button></div>`;$("#e1").onclick=exportPdf;$("#e2").onclick=exportCsv}
/* ---- Configuración ---- */
function vConfig(){const u=me();const can=db.users.length&&ROLES[u.rol].p.includes("usuarios");
 const avatar=u.foto?`<img src="${u.foto}">`:esc((u.nombre||"?")[0].toUpperCase());
 view.innerHTML=`<div class="pad"><div class="card" style="margin-top:0"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><circle cx="10" cy="8" r="3.5"/><path d="M3 20c0-3.5 3-6 7-6"/><circle cx="18" cy="16" r="2.4"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Mi perfil</h2><p>Nombre, foto y datos del reclutador</p></div></div>
 <div class="avwrap"><div class="avatar" id="av">${avatar}</div><label class="avcam"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="1.9"><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg><input type="file" accept="image/*" id="fFoto" hidden></label></div>
 <label>Nombre</label><input type="text" id="pn" value="${esc(u.nombre)}">
 <label>WhatsApp del reclutador</label><div style="position:relative"><span style="position:absolute;left:14px;top:50%;transform:translateY(-50%)">${WAI(22,"#25D366")}</span><input type="tel" id="pw" inputmode="tel" placeholder="809-000-0000" value="${esc(u.whatsapp||"")}" style="padding-left:48px"></div>
 <label>Provincia</label><select id="pp"><option value="">Seleccione</option>${PROVS.map(p=>`<option ${u.provincia===p?"selected":""}>${p}</option>`).join("")}</select>
 <label>Municipio</label><input type="text" id="pm" placeholder="Ej. Santo Domingo Oeste" value="${esc(u.municipio||"")}">
 <button class="btn btn-dark" id="ps">💾 Guardar perfil</button></div>
 <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><path d="M12 3l8 3v6c0 4.5-3.200 8-8 9-4.800-1-8-4.500-8-9V6l8-3z"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Roles y permisos</h2></div></div>
 ${Object.entries(ROLES).map(([k,r])=>`<div class="role ${u.rol===k?"on":""}"><h3>${r.n}${u.rol===k?"<em>Actual</em>":""}</h3><p>${r.d}</p>${r.p.map(t=>`<span class="tag">${t}</span>`).join("")}</div>`).join("")}</div>
 <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><circle cx="9" cy="8" r="3.5"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><path d="M17 8v6M14 11h6"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Reclutadores y accesos</h2><p>${can?"Asigne el rol y active o suspenda accesos":"Solo el administrador puede asignar accesos"}</p></div></div>
 <div class="lst" style="margin-top:14px">${db.users.map(x=>`<div class="item" style="flex-wrap:wrap"><div style="min-width:0"><b style="font-size:16px">${esc(x.nombre)}</b><small>${esc(x.municipio||"—")}${x.provincia?", "+esc(x.provincia):""} · ${esc(x.whatsapp||"sin WhatsApp")}</small></div>
  <div style="display:flex;gap:8px;align-items:center"><select data-uid="${x.id}" class="urol" ${can?"":"disabled"} style="width:auto;padding:9px;font-size:14px">${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${x.rol===k?"selected":""}>${r.n}</option>`).join("")}</select>
  <button class="btn btn-light sm utog" data-uid="${x.id}" ${can&&x.id!==db.me?"":"disabled"} style="padding:9px 12px;font-size:13px">${x.activo?"Activo":"Suspendido"}</button></div></div>`).join("")}</div>
 ${can?`<button class="btn btn-light" id="addU">+ Agregar reclutador</button>`:""}</div>
 <div class="card"><b style="font-size:18px">🎯 Meta de afiliaciones</b><div class="meta-row" style="margin-top:12px"><input id="metaIn" type="text" inputmode="numeric" value="${db.meta}"><button class="btn btn-dark sm" id="setMeta">Establecer</button></div></div>
 <button class="btn btn-red" id="cr">Borrar datos locales</button></div>`;
 $("#fFoto").onchange=e=>{const f=e.target.files[0];if(!f)return;const x=new FileReader();x.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d"),k=Math.max(256/im.width,256/im.height);g.drawImage(im,(256-im.width*k)/2,(256-im.height*k)/2,im.width*k,im.height*k);u.foto=c.toDataURL("image/jpeg",.8);save();$("#av").innerHTML=`<img src="${u.foto}">`;toast("Foto actualizada")};im.src=x.result};x.readAsDataURL(f)};
 $("#ps").onclick=()=>{const wa=$("#pw").value.replace(/\D/g,"");if($("#pw").value&&wa.length<10)return toast("WhatsApp inválido (10 dígitos)");u.nombre=$("#pn").value.trim()||u.nombre;u.whatsapp=wa;u.provincia=$("#pp").value;u.municipio=$("#pm").value.trim();db.collector.name=u.nombre;logA("Cambio de permisos / config",u.id,"Perfil de "+u.nombre);toast("Perfil guardado");vConfig()};
 $$(".urol").forEach(s=>s.onchange=()=>{const x=db.users.find(y=>y.id===s.dataset.uid);x.rol=s.value;logA("Cambio de permisos / config",x.id,"Permisos rol "+x.rol+" para "+x.nombre);toast("Rol actualizado");vConfig()});
 $$(".utog").forEach(b=>b.onclick=()=>{const x=db.users.find(y=>y.id===b.dataset.uid);x.activo=!x.activo;logA("Cambio de permisos / config",x.id,(x.activo?"Activación de ":"Suspensión de ")+x.nombre);toast(x.activo?"Acceso activado":"Acceso suspendido");vConfig()});
 if($("#addU"))$("#addU").onclick=()=>{const n=prompt("Nombre del reclutador:");if(!n||!n.trim())return;const id="U-"+(db.users.length+1);db.users.push({id,nombre:n.trim(),rol:"recolector",whatsapp:"",provincia:"",municipio:"",activo:true});logA("Cambio de permisos / config",id,"Alta de reclutador "+n.trim());toast("Reclutador agregado");vConfig()};
 $("#setMeta").onclick=()=>{const n=parseInt($("#metaIn").value);if(n>0){db.meta=n;save();toast("Meta establecida")}};
 $("#cr").onclick=()=>{if(confirm("¿Borrar todos los registros locales?")){localStorage.removeItem(KEY);location.reload()}}}

/* ---- Registros (buscador + filtro + tarjetas) ---- */
let fQ="",fE="";
function vReg(){view.innerHTML=`<div class="pad"><h1>Registros</h1><p class="sub" id="regCount"></p>
 <div class="card" style="margin-top:0;padding:16px"><div style="position:relative"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.8" style="position:absolute;left:16px;top:50%;transform:translateY(-50%)"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input type="text" id="q" placeholder="Buscar por nombre, apellido, cédula…" value="${esc(fQ)}" style="padding-left:54px;font-size:19px;border-radius:18px;height:64px"></div>
 <select id="est" style="margin-top:14px;height:64px;font-size:19px;border-radius:18px;color:#6B7280"><option value="">Estado</option><option value="verificado">Validado</option><option value="pendiente">Pendiente</option><option value="duplicado">Duplicado</option></select></div>
 <div class="lst" id="lista" style="margin-top:18px"></div></div>`;
 $("#est").value=fE;const draw=()=>{fQ=$("#q").value;fE=$("#est").value;const q=fQ.toLowerCase().replace(/-/g,"");
  const L=db.records.filter(r=>(!fE||r.estado===fE)&&(!q||(r.nombre+" "+r.cedula).toLowerCase().replace(/-/g,"").includes(q))).slice().reverse();
  $("#regCount").textContent=`${L.length} de ${db.records.length} registros`;
  $("#lista").innerHTML=L.map(r=>{const v=r.estado==="verificado",d=r.estado==="duplicado";return `<div class="card" data-id="${r.id}" style="margin:0;cursor:pointer;padding:20px">
   <div style="display:flex;justify-content:space-between;gap:10px"><div><b style="font-size:17px;text-transform:uppercase;font-weight:500">${esc(r.nombre)}</b><div style="font-family:ui-monospace,monospace;color:#6B7280;font-size:15px;letter-spacing:.05em;margin-top:5px">${esc(r.cedula)}</div></div>
   <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px"><span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:4px 12px;font-size:14px;color:#3A3F4A">${r.auto?"Auto registro":"Promotor"}</span>
   <span style="background:${v?"#E3F7EE":d?"#FCE9E8":"#FDF3DD"};border:1px solid ${v?"#BFEBD6":d?"#F6CFCC":"#EEDDB0"};border-radius:99px;padding:4px 12px;font-size:14px;color:${v?"#0A7A52":d?"#B3261E":"#B4640B"}">${v?"Validado":d?"Duplicado":"Pendiente"}</span></div></div>
   <div style="display:flex;justify-content:space-between;color:#8A909C;font-size:15px;margin-top:12px;text-transform:uppercase"><span>${esc(r.municipio)} · Circ. ${esc(r.circ)}</span><span style="text-transform:none">${new Date(r.fecha).toLocaleDateString("es-DO")}</span></div>
   <a href="https://wa.me/1${String(r.whatsapp).replace(/\D/g,"")}" target="_blank" data-wa style="display:flex;gap:12px;align-items:center;color:#059B69;font-size:16px;margin-top:14px;text-decoration:none;font-weight:500">${WAI(24,"#25D366")}Contactar por WhatsApp</a></div>`}).join("")||"<p class='sub'>Sin resultados.</p>";
  $$("#lista [data-id]").forEach(c=>c.onclick=e=>{if(e.target.closest("[data-wa]"))return;ficha(c.dataset.id)})};
 $("#q").oninput=draw;$("#est").onchange=draw;draw()}
const PIN='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>';
const USR0='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/></svg>';
const TEL='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
const CASA='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const CAL='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
const USR='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 11l2 2 4-4"/></svg>';
function ficha(id){const r=db.records.find(x=>x.id===id);
 const fila=(ico,k,v,extra="")=>`<div style="display:flex;gap:18px;align-items:flex-start;padding:16px 0;border-bottom:1px solid #F0F1F4">${ico}<div style="flex:1"><div style="color:#9AA0AC;letter-spacing:.08em;font-size:13px;text-transform:uppercase">${k}</div><div style="font-size:18px;margin-top:3px;color:#10131A">${v||"—"}</div></div>${extra}</div>`;
 const tipo=r.auto?"Auto registro":"Promotor",val=r.estado==="verificado";
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:93vh;display:flex;flex-direction:column;padding-bottom:0">
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3"><div style="width:68px;height:68px;border-radius:50%;background:#10131A;color:#fff;display:grid;place-items:center;font-size:30px;font-weight:600;flex:0 0 auto">${esc((r.nombre||"?")[0].toUpperCase())}</div>
 <div class="sheet-title"><h2 style="font-size:18px;text-transform:uppercase">${esc(r.nombre)}</h2><div style="display:flex;gap:8px;margin-top:6px"><span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:4px 12px;font-size:13px;color:#3A3F4A">${tipo}</span><span style="background:${val?"#E3F7EE":r.estado==="duplicado"?"#FCE9E8":"#FDF3DD"};border:1px solid ${val?"#BFEBD6":"#EEDDB0"};border-radius:99px;padding:4px 12px;font-size:13px;color:${val?"#0A7A52":r.estado==="duplicado"?"#B3261E":"#B4640B"}">${val?"Validado":r.estado==="duplicado"?"Duplicado":"Pendiente"}</span></div></div><button class="iconbtn" data-x>✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:4px 0 20px">
 ${fila(USR0,"Nombre completo",esc(r.nombre).toUpperCase())}${fila(USR0,"Cédula",esc(r.cedula))}${fila(TEL,"WhatsApp",esc(r.whatsapp),'<a href="https://wa.me/1'+String(r.whatsapp).replace(/\D/g,"")+'" target="_blank" style="display:flex;gap:8px;align-items:center;color:#059B69;font-size:16px;text-decoration:none;font-weight:500;margin-top:22px">${WAI(22,"#25D366")}Contactar</a>')}${fila(CASA,"Dirección",esc(r.direccion).toUpperCase())}${fila(PIN,"Municipio",esc(r.municipio).toUpperCase())}${fila(PIN,"Distrito municipal",esc(r.distrito).toUpperCase())}${fila(PIN,"Sector",esc(r.sector).toUpperCase())}
 ${fila(PIN,"Circunscripción","Circunscripción "+esc(r.circ),'<button id="edCirc" style="border:0;background:none;font-size:15px;color:#10131A;cursor:pointer;font-family:inherit">✎ Editar</button>')}
 ${fila(CAL,"Fecha y hora",new Date(r.fecha).toLocaleString("es-DO"))}${fila(USR,"Tipo de registro",tipo)}${fila(USR,"Recolector responsable",esc(db.collector.name))}
 <div style="display:flex;gap:12px;align-items:center;color:#9AA0AC;font-size:14px;margin:18px 0 10px"><svg viewBox="0 0 24 24" width="22" height="24" fill="none" stroke="#8A909C" stroke-width="1.6"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>FIRMA</div>
 <div style="border:1px solid #E7E9EE;border-radius:24px;height:190px;display:grid;place-items:center;background:#FAFBFC">${r.firma?`<img src="${r.firma}" style="max-width:90%;max-height:90%">`:'<span style="color:#9AA0AC;font-size:16px">No disponible</span>'}</div></div>
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="fpdf" style="margin:0">⬇ Descargar PDF</button></div></section>`,(w,close)=>{
 $("#edCirc",w).onclick=()=>{const n=prompt("Circunscripción electoral:",r.circ);if(n&&n.trim()){r.circ=n.trim();save();close();toast("Circunscripción actualizada");setTimeout(()=>{ficha(id);if(cur==="reg")vReg()},450)}};
 $("#fpdf",w).onclick=()=>pdfExpediente(r)})}

/* ---- Admin / auditoría ---- */
function vAdmin(){const A=db.audit;const ok=A.filter(x=>x.ok).length;
 view.innerHTML=`<div class="pad"><h1>Auditoría</h1><p class="sub">Registro de eventos del sistema</p>
 <div class="grid" style="margin-bottom:14px"><div class="stat dark"><small>Eventos</small><b>${A.length}</b></div><div class="stat"><small>Exitosos</small><b>${ok}</b></div></div>
 <div class="card" style="padding:0;overflow:hidden"><div class="scrollx"><table class="atable"><thead><tr><th>Usuario</th><th>Acción</th><th>Registro</th><th>Detalles</th><th>Resultado</th><th>Fecha/Hora</th></tr></thead><tbody>
 ${A.map(x=>`<tr><td><b>${esc(x.u)}</b></td><td>${esc(x.a)}</td><td class="mono">${esc(x.reg)}</td><td>${esc(x.det)}</td><td style="color:${x.ok?"#059B69":"#B3261E"};font-weight:600">${x.ok?"Éxito":"Fallo"}</td><td style="white-space:nowrap">${new Date(x.t).toLocaleString("es-DO")}</td></tr>`).join("")||'<tr><td colspan="6" style="text-align:center;color:#8A909C">Sin eventos.</td></tr>'}</tbody></table></div></div>
 <div class="card"><b style="font-size:18px">Revisión de firmas</b><p class="sub" style="font-size:15px;margin:6px 0 0">Valide cada registro o márquelo como duplicado.</p>
 ${db.records.map(r=>`<div class="item" style="margin-top:10px"><div style="min-width:0"><b style="font-size:15px">${esc(r.nombre)}</b><small>${esc(r.cedula)} · ${r.estado}</small></div><div style="display:flex;gap:6px"><button class="btn btn-light sm" data-a="ok" data-id="${r.id}">✓</button><button class="btn btn-light sm" data-a="dup" data-id="${r.id}">⚠</button></div></div>`).join("")}</div>
 <button class="btn btn-dark" id="btnPdf">Exportar expedientes PDF</button><button class="btn btn-light" id="btnCsv">Exportar bitácora CSV</button></div>`;
 $$("[data-a]").forEach(b=>b.onclick=()=>{const r=db.records.find(x=>x.id===b.dataset.id);r.estado=b.dataset.a==="ok"?"verificado":"duplicado";logA("Cambio de estado",r.id,r.cedula+" → "+r.estado);toast("Registro actualizado");vAdmin()});
 $("#btnPdf").onclick=exportPdf;$("#btnCsv").onclick=()=>{const csv=["usuario,accion,registro,detalles,resultado,fecha"].concat(A.map(x=>[x.u,x.a,x.reg,x.det,x.ok?"Exito":"Fallo",new Date(x.t).toISOString()].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","))).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="firmabal-auditoria.csv";a.click()}}
function exportCsv(){const h=["nombre","cedula","nac","sexo","lugar","whatsapp","municipio","distrito","sector","circ","estado"];
 const csv=[h.join(",")].concat(db.records.map(r=>h.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="firmabal-registros.csv";a.click()}
function exportPdf(){if(!window.jspdf)return toast("Cargando exportador, intente de nuevo");const {jsPDF}=window.jspdf;const doc=new jsPDF();
 db.records.forEach((r,i)=>{if(i)doc.addPage();doc.setFontSize(18);doc.text("FirmAbal · Expediente de afiliación",15,20);doc.setFontSize(12);
  [["Nombre",r.nombre],["Cédula",r.cedula],["Nacimiento",r.nac],["Sexo",r.sexo],["Lugar",r.lugar],["WhatsApp",r.whatsapp],["Direccion",r.direccion||"-"],["Municipio",r.municipio],["Distrito",r.distrito],["Sector",r.sector],["Circunscripción",r.circ],["Estado",r.estado],["Recolector",r.rec],["Fecha",new Date(r.fecha).toLocaleString()]].forEach((p,j)=>doc.text(p[0]+": "+p[1],15,40+j*10));
  if(r.firma)try{doc.addImage(r.firma,"PNG",15,180,80,35);doc.text("Firma manuscrita",15,178)}catch{}});
 doc.save("firmabal-expedientes.pdf")}

/* ---- Captura: 4 pasos (Configurar, Cedula, Revisar, Firmar) ---- */
function vCaptura(){wiz={step:1,d:{}};renderWiz()}
const NAMES=["Configurar","Cédula","Revisar datos","Firmar"];
function head(s){return `<div class="steps">${[1,2,3,4].map(i=>`<i class="${i<=s?"on":""}"></i>`).join("")}</div><p class="sub" style="font-size:17px;margin:-6px 0 18px">Paso ${s} de 4 · ${NAMES[s-1]}</p>`}
function renderWiz(){const s=wiz.step,bar=head(s);
 if(s===1)view.innerHTML=`<div class="pad" style="padding-top:18px">${bar}
  <div class="card" style="margin-top:0"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10131A" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></div><div class="sheet-title"><h2 style="font-size:19px">Cómo realizar la captura</h2><p>Pasos para un registro correcto</p></div></div>
  <ol style="font-size:18px;line-height:1.55;color:#3A3F4A;padding-left:24px;margin:16px 0 4px"><li>Pida el número de WhatsApp del ciudadano.</li><li>Capture el frente y luego el reverso de la cédula, con buena iluminación.</li><li>Revise los datos extraídos automáticamente. Los campos verificados quedan bloqueados.</li><li>El ciudadano firma en pantalla y se guarda el registro.</li></ol></div>
  <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5">${WAI(26,"#25D366")}</div><div class="sheet-title"><h2 style="font-size:19px">WhatsApp del ciudadano</h2><p>Número de contacto para futuras comunicaciones</p></div></div>
  <input type="tel" id="fWa" inputmode="tel" placeholder="809-000-0000" value="${esc(wiz.d.whatsapp)}" style="margin-top:16px;font-size:20px;padding:18px;border-radius:18px"></div>
  <button class="btn btn-dark" id="next" style="padding:22px;font-size:20px;border-radius:24px">📷 Iniciar captura</button></div>`;
 if(s===2)view.innerHTML=`<div class="pad">${bar}<h1>Cédula</h1><p class="sub">Fotografíe el frente y luego el reverso</p>
  <label class="cedula" id="fr">📷 Frente de la cédula${wiz.d.imgF?`<br><img src="${wiz.d.imgF}">`:""}<input type="file" accept="image/*" capture="environment" hidden id="fFront"></label>
  <label class="cedula" id="bk">📷 Reverso de la cédula${wiz.d.imgB?`<br><img src="${wiz.d.imgB}">`:""}<input type="file" accept="image/*" capture="environment" hidden id="fBack"></label>
  <div id="ocrMsg" class="sub" style="font-size:15px"></div><button class="btn btn-dark" id="next">Leer y continuar</button></div>`;
 if(s===3)view.innerHTML=`<div class="pad">${bar}<h1>Revisar datos</h1><p class="sub">${wiz.d.lock?"Los campos verificados quedan bloqueados":"Complete los datos manualmente"}</p>
  <label>Nombre completo</label><input type="text" id="fNombre" value="${esc(wiz.d.nombre)}" ${wiz.d.lock&&wiz.d.nombre?"readonly":""}>
  <label>Cédula</label><input type="text" id="fCed" value="${esc(wiz.d.cedula)}" inputmode="numeric" ${wiz.d.lock&&wiz.d.cedula?"readonly":""}>
  <label>Fecha de nacimiento</label><input type="text" id="fNac" placeholder="AAAA-MM-DD" value="${esc(wiz.d.nac)}" ${wiz.d.lock&&wiz.d.nac?"readonly":""}>
  <label>Sexo</label><select id="fSexo"><option value="">Seleccione</option><option ${wiz.d.sexo==="M"?"selected":""}>M</option><option ${wiz.d.sexo==="F"?"selected":""}>F</option></select>
  <label>Lugar de nacimiento</label><input type="text" id="fLugar" value="${esc(wiz.d.lugar)}">
  <label>Dirección</label><input type="text" id="fDir" value="${esc(wiz.d.direccion)}">
  <label>Municipio</label><input type="text" id="fMun" value="${esc(wiz.d.municipio||"Santo Domingo Oeste")}">
  <label>Distrito municipal</label><input type="text" id="fDis" value="${esc(wiz.d.distrito||"")}">
  <label>Sector</label><input type="text" id="fSec" value="${esc(wiz.d.sector||"Hato Nuevo")}">
  <label>Circunscripción</label><input type="text" id="fCirc" value="${esc(wiz.d.circ||"4")}">
  <button class="btn btn-dark" id="next">Continuar</button></div>`;
 if(s===4)view.innerHTML=`<div class="pad">${bar}<h1>Firma manuscrita</h1><p class="sub">El ciudadano firma en pantalla</p><canvas id="sig"></canvas>
  <div style="display:flex;gap:10px"><button class="btn btn-light" id="clr">Borrar</button><button class="btn btn-dark" id="next">Guardar registro</button></div></div>`;
 bindWiz()}
/* Consentimiento: bottom sheet "Proteccion de datos" */
function consentSheet(onOk){dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:92vh;display:flex;flex-direction:column"><div class="sheet-head"><div class="sheet-ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg></div><div class="sheet-title"><h2>Protección de datos</h2><p>Consentimiento del ciudadano</p></div><button class="iconbtn" data-x>✕</button></div>
 <div style="overflow-y:auto;flex:1;margin:12px 0;font-size:18px;color:#3A3F4A;line-height:1.55"><p style="margin-top:0">Antes de continuar, es importante que el ciudadano conozca cómo se tratarán sus datos:</p><ul style="padding-left:22px;line-height:1.65">
 <li>Se capturarán datos de identidad (nombre, cédula, fecha de nacimiento, sexo y lugar de nacimiento).</li><li>Se capturará una firma manuscrita como respaldo del registro.</li><li>Los datos se utilizarán únicamente para los fines del proceso de afiliación del partido.</li><li>Las imágenes de la cédula se usan solo para la extracción de datos y no se almacenan permanentemente.</li><li>El responsable del tratamiento es el partido o agrupación política que realiza la afiliación.</li><li>El ciudadano puede ejercer sus derechos de acceso, rectificación y oposición.</li></ul>
 <p style="color:#9AA0AC;font-size:15px">No se garantiza una protección absoluta, pero se aplican medidas técnicas razonables para resguardar la información, conforme a la legislación dominicana aplicable sobre protección de datos personales.</p></div>
 <label id="accWrap" style="text-transform:none;letter-spacing:0;font-size:17px;color:#10131A;display:flex;gap:14px;align-items:flex-start;background:#F7F8FA;border:1px solid #E7E9EE;border-radius:20px;padding:16px;margin:0;transition:border-color .25s,background .25s"><input type="checkbox" id="acc" style="width:26px;height:26px;margin-top:2px">El ciudadano ha leído y acepta el tratamiento de sus datos personales según lo descrito.</label>
 <div style="display:flex;gap:12px;margin-top:12px"><button class="btn btn-light" id="no" style="margin:0;background:#fff;border:1px solid #E7E9EE">No aceptar</button><button class="btn btn-dark" id="ok" style="margin:0">Aceptar</button></div></section>`,(w,close)=>{
  $("#no",w).onclick=()=>{close();toast("Consentimiento rechazado. Registro cancelado");go("dash")};
  $("#acc",w).onchange=()=>{const wr=$("#accWrap",w);wr.style.borderColor="#E7E9EE";wr.style.background="#F7F8FA"};
  $("#ok",w).onclick=()=>{if(!$("#acc",w).checked){const wr=$("#accWrap",w);wr.style.borderColor="#B3261E";wr.style.background="#FFF1F0";toast("Debe marcar la casilla de aceptación antes de continuar");return}close();setTimeout(onOk,380)}})}
function bindWiz(){const s=wiz.step,next=$("#next");
 if(s===1)next.onclick=()=>{const wa=$("#fWa").value.replace(/\D/g,"");if(wa.length<10)return toast("WhatsApp obligatorio (10 dígitos)");wiz.d.whatsapp=wa;consentSheet(()=>{wiz.step=2;renderWiz()})};
 if(s===2){const rd=f=>new Promise(r=>{const x=new FileReader();x.onload=()=>{const im=new Image();im.onload=()=>{const m=900,k=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",.72))};im.onerror=()=>r(x.result);im.src=x.result};x.readAsDataURL(f)});
  $("#fFront").onchange=async e=>{if(e.target.files[0]){wiz.d.imgF=await rd(e.target.files[0]);renderWiz()}};$("#fBack").onchange=async e=>{if(e.target.files[0]){wiz.d.imgB=await rd(e.target.files[0]);renderWiz()}};
  next.onclick=async()=>{if(!wiz.d.imgF)return toast("Capture primero el frente de la cédula");$("#ocrMsg").textContent="Leyendo cédula con OCR…";
   try{const txt=await puter.ai.chat("Extrae de esta cédula dominicana un JSON puro con llaves nombre, cedula, nac (AAAA-MM-DD), sexo (M/F), lugar. Sin texto adicional.",wiz.d.imgF);
    const j=JSON.parse(String(txt?.message?.content??txt).replace(/```json|```/g,"").trim());Object.assign(wiz.d,j,{lock:true});toast("Datos extraídos")}
   catch(e){toast("No se pudo leer. Complete manualmente.")}
   wiz.step=3;renderWiz()}}
 if(s===3)next.onclick=()=>{Object.assign(wiz.d,{nombre:$("#fNombre").value.trim(),cedula:$("#fCed").value.trim(),nac:$("#fNac").value.trim(),sexo:$("#fSexo").value,lugar:$("#fLugar").value.trim(),direccion:$("#fDir").value.trim(),municipio:$("#fMun").value.trim(),distrito:$("#fDis").value.trim(),sector:$("#fSec").value.trim(),circ:$("#fCirc").value.trim()});
   if(!wiz.d.nombre||!/\d{3}-?\d{7}-?\d/.test(wiz.d.cedula))return toast("Complete nombre y cédula válida");
   if(db.records.some(r=>r.cedula.replace(/\D/g,"")===wiz.d.cedula.replace(/\D/g,"")))wiz.d.dup=true;wiz.step=4;renderWiz()};
 if(s===4){const c=$("#sig");c.width=c.offsetWidth*2;c.height=440;const x=c.getContext("2d");x.lineWidth=5;x.lineCap="round";x.strokeStyle="#10131A";let dr=false,has=false;
  const pt=e=>{const r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return[(t.clientX-r.left)*2,(t.clientY-r.top)*2]};
  const st=e=>{e.preventDefault();dr=true;const[a,b]=pt(e);x.beginPath();x.moveTo(a,b)},mv=e=>{if(!dr)return;e.preventDefault();const[a,b]=pt(e);x.lineTo(a,b);x.stroke();has=true},en=()=>dr=false;
  c.addEventListener("mousedown",st);c.addEventListener("mousemove",mv);addEventListener("mouseup",en);c.addEventListener("touchstart",st,{passive:false});c.addEventListener("touchmove",mv,{passive:false});c.addEventListener("touchend",en);
  $("#clr").onclick=()=>{x.clearRect(0,0,c.width,c.height);has=false};
  next.onclick=()=>{if(!has)return toast("Se requiere la firma");const d=wiz.d;
   const rec={id:"R-"+Date.now(),nombre:d.nombre,cedula:d.cedula,nac:d.nac,sexo:d.sexo,lugar:d.lugar,whatsapp:d.whatsapp,direccion:d.direccion,municipio:d.municipio,distrito:d.distrito,sector:d.sector,circ:d.circ,firma:c.toDataURL("image/png"),imgFRONTAL:d.imgF||null,imgTRASERA:d.imgB||null,estado:d.dup?"duplicado":"pendiente",fecha:Date.now(),rec:db.collector.id,lat:18.4861+(Math.random()-.5)*.08,lng:-69.9312+(Math.random()-.5)*.1};
   db.records.push(rec);logA("Creación de registro",rec.id,"Cédula "+rec.cedula);save();toast(d.dup?"Cédula ya registrada: marcada como duplicado":"Afiliación guardada");go("dash")}}}

if(new URLSearchParams(location.search).get("auto")){db.records.auto=true}
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
goNow("dash");
})();
