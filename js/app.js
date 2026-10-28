(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let view=$("#view");
const KEY="firmabal-db-v4";
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
const ICONS={
dash:'<rect x="3.5" y="3.5" width="7.5" height="9" rx="2.2"/><rect x="13" y="3.5" width="7.5" height="5.5" rx="2.2"/><rect x="13" y="11" width="7.5" height="9.5" rx="2.2"/><rect x="3.5" y="14.5" width="7.5" height="6" rx="2.2"/>',
reg:'<path d="M7 3.5h7.2L19 8.300V19a1.500 1.500 0 0 1-1.500 1.500H7A1.500 1.500 0 0 1 5.500 19V5A1.500 1.500 0 0 1 7 3.500z"/><path d="M14 3.800V8.500h4.700"/><path d="M8.800 12.500h6.400M8.800 16h4"/>',
captura:'<path d="M4 8.500h2.800l1.400-2.300h7.600l1.400 2.300H20a.9.900 0 0 1 .9.900v8.600a.9.900 0 0 1-.9.900H4a.9.900 0 0 1-.9-.9V9.400A.9.900 0 0 1 4 8.500z"/><circle cx="12" cy="13.600" r="3.300"/>',
monitor:'<circle cx="12" cy="12" r="2.200"/><path d="M7.300 7.300a6.600 6.600 0 0 0 0 9.400M16.700 7.300a6.600 6.600 0 0 1 0 9.400M4.500 4.500a10.500 10.500 0 0 0 0 15M19.500 4.500a10.500 10.500 0 0 1 0 15"/>',
terr:'<path d="M9 4.500L3.500 6.800v12.700L9 17.200l6 2.300 5.500-2.300V4.500L15 6.800z"/><path d="M9 4.500v12.700M15 6.800v12.700"/>',
recol:'<circle cx="9.500" cy="8" r="3.300"/><path d="M3.500 19.500c.4-3.300 2.700-5.300 6-5.300s5.600 2 6 5.300"/><path d="M16.300 5.200a3.100 3.100 0 0 1 0 5.700M18.500 14.600c1.500.7 2.500 2.200 2.800 4.400"/>',
firmas:'<path d="M4 20.200h4.300L19.300 9.200a2.200 2.200 0 0 0 0-3.100l-1.400-1.400a2.200 2.200 0 0 0-3.100 0L3.800 15.700z"/><path d="M13.200 6.400l4.400 4.400"/><path d="M12 20.200h8.500"/>',
audit:'<path d="M12 3.200l7 2.700v5.600c0 4.300-2.900 7.700-7 9.300-4.100-1.600-7-5-7-9.300V5.900z"/><path d="M8.800 12.100l2.200 2.200 4.200-4.400"/>',
export:'<path d="M12 4v11.200M7.500 10.800l4.500 4.500 4.500-4.500"/><path d="M4.500 16.500v1.700a1.800 1.800 0 0 0 1.800 1.800h11.400a1.800 1.800 0 0 0 1.800-1.800v-1.700"/>',
config:'<path d="M5 6.500h8.500M17.500 6.500H19M5 12h2.500M11.500 12H19M5 17.500h9M18 17.500h1"/><circle cx="15.500" cy="6.500" r="2"/><circle cx="9.500" cy="12" r="2"/><circle cx="16" cy="17.500" r="2"/>'};
const ico=(k,s=24,w=1.7,c="currentColor")=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>`;
const XI='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1A1D21" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const isPC=()=>matchMedia("(min-width:900px)").matches;
const AUTO=new URLSearchParams(location.search).get("auto")==="1";
const REC=new URLSearchParams(location.search).get("rec")||"REC-001";
const MENU=[["dash", "Inicio"], ["reg", "Registros"], ["captura", "Captura"], ["monitor", "Monitor"], ["terr", "Territorios"], ["recol", "Recolectores"], ["firmas", "Firmas"], ["audit", "Auditor\u00eda"], ["export", "Exportaci\u00f3n"], ["config", "Configuraci\u00f3n"]];
const isToday=ts=>new Date(ts).toDateString()===new Date().toDateString();
const stats=()=>({total:db.records.length,hoy:db.records.filter(r=>isToday(r.fecha)).length,pen:db.records.filter(r=>r.estado==="pendiente").length,dup:db.records.filter(r=>r.estado==="duplicado").length,auto:db.records.filter(r=>r.auto).length});
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let cur="dash",map=null,wiz=null;

/* ---- Auto registro sheet ---- */
const base=()=>location.origin+location.pathname;
const link=(rid)=>base()+"?auto=1&rec="+encodeURIComponent(rid||me().id);
const shareLink=(rid)=>base()+"?auto=1&rec="+encodeURIComponent(rid||me().id)+"&via=ciudadano";
const openS=(el)=>{const m=$("#sheetMask");m.hidden=false;el.hidden=false;void el.offsetWidth;m.classList.add("show");el.classList.add("show")};
const closeS=(el,done)=>{const m=$("#sheetMask");el.classList.remove("show");m.classList.remove("show");setTimeout(()=>{el.hidden=true;if(!$$(".sheet.show").length)m.hidden=true;done&&done()},430)};
const sheet=show=>show?openS($("#autoSheet")):closeS($("#autoSheet"));
const closeAll=()=>{$$(".sheet.show").forEach(s=>closeS(s))};
function dyn(html,build){const w=document.createElement("div");w.innerHTML=html;document.body.appendChild(w);const mask=w.querySelector(".dmask"),sh=w.querySelector(".dsheet");
 requestAnimationFrame(()=>{mask.classList.add("show");sh.classList.add("show")});
 const close=()=>{sh.classList.remove("show");mask.classList.remove("show");setTimeout(()=>w.remove(),430)};
 mask.onclick=close;const x=w.querySelector("[data-x]");if(x)x.onclick=close;build&&build(w,close);return close}
$("#btnShare").onclick=()=>sheet(true);$("#btnCloseSheet").onclick=()=>sheet(false);$("#btnCloseSheet").innerHTML=XI;$("#btnCloseQr").innerHTML=XI;
$("#btnWa").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent("Hola, puede completar su autorregistro desde su celular, solo necesita su cédula: "+shareLink()),"_blank");
$("#btnQr").onclick=()=>{closeS($("#autoSheet"),()=>{const b=$("#qrBox");b.innerHTML="";try{new QRCode(b,{text:shareLink(),width:230,height:230,colorDark:"#10131A",colorLight:"#ffffff"})}catch{b.innerHTML="<p class='sub'>No se pudo generar el QR sin conexión.</p>"}openS($("#qrSheet"))})};
$("#btnCloseQr").onclick=()=>closeS($("#qrSheet"));
$("#btnQrBack").onclick=()=>closeS($("#qrSheet"),()=>openS($("#autoSheet")));


const HELP={
dash:{t:"Inicio",d:"Resumen en vivo de la captura territorial.",p:["Cada tarjeta muestra un indicador: totales, capturados hoy, pendientes por validar, duplicados, auto registros y recolectores activos.","La gráfica compara los registros de los últimos 7 días.","Para capturar un afiliado use el botón de la cámara (o el menú lateral en PC)."]},
reg:{t:"Registros",d:"Todas las afiliaciones capturadas.",p:["Escriba en el buscador un nombre, apellido o cédula para filtrar al instante.","Use el filtro Estado para ver solo validados, pendientes o duplicados.","Toque una tarjeta para abrir la ficha completa y editar la circunscripción.","Con Contactar por WhatsApp abre un chat directo con el ciudadano."]},
captura:{t:"Captura",d:"Flujo guiado de 4 pasos para registrar un afiliado.",p:["Paso 1: pida el WhatsApp del ciudadano y presente la hoja de protección de datos.","Paso 2: fotografíe frente y reverso de la cédula con buena luz.","Paso 3: revise los datos leídos. Los verificados quedan bloqueados.","Paso 4: el ciudadano firma con el dedo y se guarda el registro."]},
firmas:{t:"Firmas",d:"Galería de firmas con su expediente.",p:["Toque una tarjeta para ver la firma, la cédula frontal y trasera y los datos electorales.","Descargar PDF genera un expediente ordenado, válido como evidencia."]},
monitor:{t:"Monitor",d:"Mapa del territorio y estado del equipo.",p:["Los puntos del mapa son los registros capturados (verde validado, ámbar pendiente).","Deslice las tarjetas para ver recolectores activos y registros.","El botón circular inferior comparte su ubicación en vivo; se anima mientras está activo. Tóquelo de nuevo para detenerlo."]},
terr:{t:"Territorios",d:"Registros agrupados por municipio, sector y circunscripción.",p:["Cada tarjeta indica la zona y cuántos afiliados tiene.","Úselo para detectar zonas con poca cobertura."]},
recol:{t:"Recolectores",d:"Equipo de captura y su rendimiento.",p:["Toque un reclutador para ver su rendimiento, cambiar su rol y estado, copiar su enlace único y escribirle por WhatsApp.","El botón + inferior agrega un nuevo reclutador."]},
audit:{t:"Auditoría",d:"Bitácora de eventos y revisión de firmas.",p:["La tabla registra quién hizo qué, sobre qué registro, el resultado y la fecha. Deslice horizontalmente para ver todas las columnas.","En Revisión de firmas valide con el botón del check o marque duplicado con el botón de copias.","Exporte los expedientes en PDF o la bitácora en CSV."]},
export:{t:"Exportación",d:"Descarga de expedientes y datos.",p:["PDF de todos los expedientes: un documento ordenado por afiliado.","CSV de registros: datos en hoja de cálculo."]},
config:{t:"Configuración",d:"Su perfil y los accesos del equipo.",p:["Actualice su foto, nombre, WhatsApp, provincia y municipio.","Roles y permisos muestra qué puede hacer cada rol.","El administrador asigna roles y activa o suspende reclutadores."]}
};
function ayuda(){const h=HELP[cur]||HELP.dash;dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:88vh;overflow-y:auto"><div class="sheet-head"><div class="sheet-ico"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.500 9.200a2.600 2.600 0 1 1 3.600 2.400c-.9.4-1.100 1-1.100 1.900"/></svg></div><div class="sheet-title"><h2>${h.t}</h2><p>${h.d}</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <div class="help-box" style="margin-top:14px"><div class="help-sec" style="margin:0"><h4>Cómo usar esta pantalla</h4><ol style="padding-left:20px;margin:8px 0 0">${h.p.map(x=>`<li>${x}</li>`).join("")}</ol></div></div></section>`)}
$("#btnHelp").onclick=ayuda;
/* ---- Navegación ---- */
const TABS=[["dash","Inicio"],["reg","Registros"],["captura","Captura"],["firmas","Firmas"],["menu","Menú"]];
$("#tabbar").innerHTML=TABS.map(([k,l])=>k==="captura"?`<button class="tab tab-cam" data-v="captura" aria-label="${l}">${ico("captura",30,1.9,"#fff")}</button>`:k==="menu"?`<button class="tab" data-v="menu" aria-label="${l}"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.700" y="3.700" width="6.600" height="6.600" rx="2"/><rect x="13.700" y="3.700" width="6.600" height="6.600" rx="2"/><rect x="3.700" y="13.700" width="6.600" height="6.600" rx="2"/><rect x="13.700" y="13.700" width="6.600" height="6.600" rx="2"/></svg></button>`:`<button class="tab" data-v="${k}" aria-label="${l}">${ico(k,26)}</button>`).join("");
$("#sideLinks").innerHTML=MENU.map(([k,l])=>`<button class="sb-link" data-v="${k}" title="${l}">${ico(k,22)}<span class="sb-name">${l}</span></button>`).join("");
const sbKey="firmabal-sb";let sbOpen=localStorage.getItem(sbKey)!=="0";
const applySb=()=>{document.body.classList.toggle("sb-collapsed",!sbOpen);$("#btnSideToggle").innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${sbOpen?"M15 6l-6 6 6 6":"M9 6l6 6-6 6"}"/></svg>`;$("#btnSideToggle").title=sbOpen?"Contraer":"Desplegar"};
$("#btnSideToggle").onclick=()=>{sbOpen=!sbOpen;localStorage.setItem(sbKey,sbOpen?"1":"0");applySb()};applySb();
const menuSheet=show=>{if(!show)return closeS($("#menuSheet"));{$("#menuGrid").innerHTML=MENU.map(([k,l])=>`<button data-go="${k}" class="${cur===k?"on":""}">${ico(k,30,1.6,"#2B2F38")}${l}</button>`).join("");$$("[data-go]").forEach(b=>b.onclick=()=>{closeS($("#menuSheet"),()=>go(b.dataset.go))});openS($("#menuSheet"))}};
$("#btnCloseMenu").onclick=()=>menuSheet(false);$("#btnCloseMenu").innerHTML=XI;
$("#sheetMask").onclick=closeAll;
$$(".tab,.sb-link").forEach(b=>b.onclick=()=>b.dataset.v==="menu"?menuSheet(true):go(b.dataset.v));
let navBusy=false;
function go(v){if(navBusy)return;navBusy=true;const bar=document.querySelector(".pagebar")||(()=>{const b=document.createElement("div");b.className="pagebar";document.body.appendChild(b);return b})();
 bar.style.opacity=1;bar.classList.remove("go");void bar.offsetWidth;bar.classList.add("go");view.classList.add("out");
 setTimeout(()=>{goNow(v);view.classList.remove("out");view.classList.remove("in");void view.offsetWidth;view.classList.add("in");setTimeout(()=>{bar.style.opacity=0;setTimeout(()=>{bar.classList.remove("go");bar.style.width=0},350);navBusy=false},1000)},900)}
function goNow(v){cur=v;document.body.dataset.page=v;$$(".tab,.sb-link").forEach(b=>b.classList.toggle("on",b.dataset.v===v));if(map){map.remove();map=null}
 ({dash:vDash,equipo:vEquipo,monitor:vEquipo,terr:vTerr,recol:vRecol,captura:vCaptura,reg:vReg,firmas:vFirmas,audit:vAdmin,export:vExport,config:vConfig})[v]();view.scrollTop=0}

/* ---- Centro de control ---- */
function vDash(){const s=stats();
 view.innerHTML=`<div class="pad"><div class="grid"><div class="stat dark"><small>Totales</small><b>${s.total}</b></div><div class="stat"><small>Capturados hoy</small><b>${s.hoy}</b></div>
 <div class="stat amber"><small>Pendientes</small><b>${s.pen}</b></div><div class="stat red"><small>Duplicados</small><b>${s.dup}</b></div>
 <div class="stat"><small>Auto registros</small><b>${s.auto}</b></div><div class="stat"><small>Recolectores</small><b>${db.users.filter(u=>u.activo).length}</b></div></div>
 <div class="card" style="padding:22px 18px 16px"><div style="display:flex;gap:10px;align-items:center;font-size:16px;font-weight:600"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10131A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18.500l5-5.500 3.500 3.500L20 8"/><path d="M15 8h5v5"/></svg>Registros por día (últimos 7)</div>${chart()}</div></div>`}
function chart(){const d=last7().filter(x=>x.n>0).length?last7().filter(x=>x.n>0):last7().slice(-1);const mx=Math.max(2,...d.map(x=>x.n));const ticks=[mx,mx*.75,mx/2,mx/4,0].map(v=>Math.round(v*10)/10);
 return `<div style="display:flex;margin-top:18px;height:340px;position:relative"><div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;padding-right:14px;color:#8A909C;font-size:15px;height:300px">${ticks.map(t=>`<span>${t}</span>`).join("")}</div>
 <div style="flex:1;position:relative;height:300px;border-bottom:1px solid #EDEFF3"><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between">${ticks.map(()=>'<i style="border-top:1px dashed #E7E9EE;display:block"></i>').join("")}</div>
 <div style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;gap:14px">${d.map(x=>`<div style="flex:0 1 ${d.length===1?"88%":"40px"};height:${x.n/mx*100}%;background:#E31E2D;border-radius:14px 14px 0 0"></div>`).join("")}</div>
 <div style="position:absolute;left:0;right:0;top:308px;display:flex;justify-content:center;gap:14px;color:#8A909C;font-size:15px">${d.map(x=>`<span style="flex:0 1 ${d.length===1?"88%":"40px"};text-align:center">${x.f}</span>`).join("")}</div></div></div>`}
function last7(){const o=[];for(let i=6;i>=0;i--){const d=new Date(Date.now()-i*86400000);o.push({l:["D","L","M","M","J","V","S"][d.getDay()],f:String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),n:db.records.filter(r=>new Date(r.fecha).toDateString()===d.toDateString()).length})}return o}

/* ---- Equipo / mapa ---- */
function vEquipo(){const s=stats();const live=!!db.collector.sharing;
 view.innerHTML=`<div class="mapwrap"><div id="map"></div></div>
 <div class="chips"><div class="chip">${ico("recol",26,1.7)}<b>${db.users.filter(u=>u.activo).length}</b><span>Recolectores activos</span></div>
 <div class="chip">${ico("monitor",26,1.7)}<b>${live?1:0}</b><span>Compartiendo ubicación</span></div>
 <div class="chip">${ico("firmas",26,1.7)}<b>${s.total}</b><span>Registros</span></div></div>
 <button class="fab ${live?"live":""}" id="shareLoc" title="${live?"Dejar de compartir ubicación":"Compartir mi ubicación en vivo"}" aria-label="Ubicación en vivo"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.500-5.700-6.500-10.800a6.500 6.500 0 0 1 13 0C18.500 15.300 12 21 12 21z"/><circle cx="12" cy="10.200" r="2.400"/></svg></button>`;
 map=L.map("map",{zoomControl:true}).setView([18.4861,-69.9312],11);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:19}).addTo(map);
 db.records.filter(r=>r.lat).forEach(r=>L.circleMarker([r.lat,r.lng],{radius:9,color:"#10131A",fillColor:r.estado==="verificado"?"#0B9D6B":"#E8A317",fillOpacity:.9}).addTo(map).bindPopup(`<b>${esc(r.nombre)}</b><br>${esc(r.sector)} · Circ. ${esc(r.circ)}`));
 if(live&&db.collector.pos)L.circleMarker(db.collector.pos,{radius:11,color:"#059B69",fillColor:"#059B69",fillOpacity:.6}).addTo(map);
 $("#shareLoc").onclick=()=>{if(db.collector.sharing){clearInterval(window._gps);db.collector.sharing=false;save();toast("Ubicación en vivo desactivada");return vEquipo()}
  if(!navigator.geolocation)return toast("Geolocalización no disponible");
  navigator.geolocation.getCurrentPosition(p=>{db.collector.sharing=true;db.collector.pos=[p.coords.latitude,p.coords.longitude];save();toast("Compartiendo ubicación en vivo");vEquipo();
   window._gps=setInterval(()=>navigator.geolocation.getCurrentPosition(q=>{db.collector.pos=[q.coords.latitude,q.coords.longitude];save()}),15000)},()=>toast("No se pudo obtener la ubicación"))}}
/* ---- Firmas ---- */
function vFirmas(){view.innerHTML=`<div class="pad"><div class="firmas">${db.records.map(r=>`<div class="fcard" data-id="${r.id}"><div class="fsig">${r.firma?`<img src="${r.firma}">`:`<svg viewBox="0 0 120 50" width="110"><path d="M5 35c15-30 20 5 30-15s15 30 30 0 20-10 30 5" fill="none" stroke="#10131A" stroke-width="2"/></svg>`}</div><b>${esc(r.nombre)}</b><small>${new Date(r.fecha).toLocaleDateString("es-DO")}</small></div>`).join("")}</div></div>`;
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
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="dpdf" style="margin:0;display:flex;align-items:center;justify-content:center;gap:10px"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.500 10.500L12 15l4.500-4.500"/><path d="M5 19h14"/></svg> Descargar PDF</button></div></section>`,(w)=>{$("#dpdf",w).onclick=()=>pdfExpediente(r)})}

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
 view.innerHTML=`<div class="pad"><div class="tgrid">${Object.entries(g).map(([k,n])=>`<div class="item" style="gap:14px;padding:16px"><div style="width:46px;height:46px;border-radius:14px;background:#F1F2F5;display:grid;place-items:center;flex:0 0 auto;color:#10131A">${ico("terr",24,1.7)}</div><div style="flex:1;min-width:0"><b style="font-size:16px;overflow-wrap:anywhere">${esc(k)}</b><small>${n} afiliado(s)</small></div><span class="pill ok">${n}</span></div>`).join("")||"<p class='sub'>Sin datos aún.</p>"}</div></div>`}
const avt=(u,s=56)=>`<div style="width:${s}px;height:${s}px;border-radius:50%;background:#10131A;color:#fff;display:grid;place-items:center;font-size:${Math.round(s*.4)}px;font-weight:600;overflow:hidden;flex:0 0 auto">${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover">`:esc((u.nombre||"?")[0].toUpperCase())}</div>`;
const nReg=u=>db.records.filter(r=>r.rec===u.id||(u.id==="U-1"&&r.rec==="REC-001")).length;
function vRecol(){view.innerHTML=`<div class="pad"><div class="agrid">${db.users.map(u=>`<div class="card" data-uid="${u.id}" style="margin:0;display:flex;gap:14px;align-items:center;cursor:pointer;padding:16px;min-width:0">${avt(u)}<div style="min-width:0;flex:1"><b style="font-size:16px;overflow-wrap:anywhere">${esc(u.nombre)}</b><div style="color:#8A909C;font-size:13px;margin-top:3px">${ROLES[u.rol].n} · ${nReg(u)} firmas</div><span class="chipx" style="margin-top:8px;display:inline-block;${u.activo?"background:#E3F7EE;border-color:#BFEBD6;color:#0A7A52":"background:#FCE9E8;border-color:#F6CFCC;color:#B3261E"}">${u.activo?"Activo":"Suspendido"}</span></div></div>`).join("")}</div></div>
 <button class="fab" id="fabAdd" aria-label="Agregar reclutador"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>`;
 $$("[data-uid]").forEach(c=>c.onclick=()=>reclutador(c.dataset.uid));$("#fabAdd").onclick=nuevoReclutador}
function nuevoReclutador(){dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:92vh;overflow-y:auto"><div class="sheet-head"><div class="sheet-ico">${ico("recol",22,1.8,"#fff")}</div><div class="sheet-title"><h2>Nuevo reclutador</h2><p>Agregue sus datos y asigne un rol</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <label>Nombre</label><input type="text" id="nn"><label>WhatsApp</label><input type="tel" id="nw" inputmode="tel" placeholder="809-000-0000"><label>Provincia</label><select id="np"><option value="">Seleccione</option>${PROVS.map(p=>`<option>${p}</option>`).join("")}</select><label>Municipio</label><input type="text" id="nm"><label>Rol</label><select id="nr">${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${k==="recolector"?"selected":""}>${r.n}</option>`).join("")}</select>
 <button class="btn btn-dark" id="ns" style="margin-top:18px">Agregar reclutador</button></section>`,(w,close)=>{$("#ns",w).onclick=()=>{const n=$("#nn",w).value.trim(),wa=$("#nw",w).value.replace(/\D/g,"");if(!n)return toast("Escriba el nombre");if(wa.length<10)return toast("WhatsApp inválido (10 dígitos)");
  const id="U-"+(db.users.length+1);db.users.push({id,nombre:n,rol:$("#nr",w).value,whatsapp:wa,provincia:$("#np",w).value,municipio:$("#nm",w).value.trim(),activo:true});logA("Cambio de permisos / config",id,"Alta de reclutador "+n);toast("Reclutador agregado");close();setTimeout(vRecol,420)}})}
function reclutador(id){const u=db.users.find(x=>x.id===id);const n=nReg(u),hoy=db.records.filter(r=>(r.rec===u.id||(u.id==="U-1"&&r.rec==="REC-001"))&&isToday(r.fecha)).length,val=db.records.filter(r=>(r.rec===u.id||(u.id==="U-1"&&r.rec==="REC-001"))&&r.estado==="verificado").length,pct=Math.min(100,Math.round(n/Math.max(1,db.meta)*100));
 const lk=shareLink(u.id);
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:92vh;overflow-y:auto"><div class="sheet-head">${avt(u,64)}<div class="sheet-title"><h2 style="font-size:19px">${esc(u.nombre)}</h2><p>${esc(u.municipio||"—")}${u.provincia?", "+esc(u.provincia):""}</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <div class="grid" style="margin-top:14px;grid-template-columns:repeat(3,minmax(0,1fr))"><div class="stat dark"><small>Firmas</small><b>${n}</b></div><div class="stat"><small>Hoy</small><b>${hoy}</b></div><div class="stat"><small>Validadas</small><b>${val}</b></div></div>
 <div class="card" style="margin-top:12px;padding:16px"><div class="row-between"><span>Rendimiento frente a la meta (${db.meta})</span><b style="color:#10131A">${pct}%</b></div><div class="prog"><i style="width:${pct}%"></i></div></div>
 <div class="hgrid" style="margin-top:6px"><div><label>Rol</label><select id="ur" ${me().rol==="administrador"?"":"disabled"}>${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${u.rol===k?"selected":""}>${r.n}</option>`).join("")}</select></div><div><label>Estado</label><select id="ue" ${me().rol==="administrador"&&u.id!==db.me?"":"disabled"}><option value="1" ${u.activo?"selected":""}>Activo</option><option value="0" ${u.activo?"":"selected"}>Suspendido</option></select></div></div>
 <label>Enlace único de autorregistro</label><div style="display:flex;gap:8px"><input type="text" readonly value="${lk}" id="ul" style="font-size:13px"><button class="btn btn-light sm" id="uc" style="padding:0 16px">Copiar</button></div><p class="pin-note" style="margin:6px 2px 0">Cada ciudadano que se registre con este enlace queda atribuido a ${esc(u.nombre.split(" ")[0])}.</p>
 <div class="two" style="margin-top:14px"><button class="btn btn-wa" id="uw">${WAI(22,"#fff")} WhatsApp</button><button class="btn btn-dark" id="uq">${ico("captura",20,1.8,"#fff")} Código QR</button></div></section>`,(w,close)=>{
  $("#ur",w).onchange=e=>{u.rol=e.target.value;logA("Cambio de permisos / config",u.id,"Permisos rol "+u.rol+" para "+u.nombre);toast("Rol actualizado");vRecol()};
  $("#ue",w).onchange=e=>{u.activo=e.target.value==="1";logA("Cambio de permisos / config",u.id,(u.activo?"Activación de ":"Suspensión de ")+u.nombre);toast(u.activo?"Acceso activado":"Acceso suspendido");vRecol()};
  $("#uc",w).onclick=async()=>{try{await navigator.clipboard.writeText(lk);toast("Enlace copiado")}catch{$("#ul",w).select()}};
  $("#uw",w).onclick=()=>window.open("https://wa.me/"+(String(u.whatsapp).length===10?"1":"")+String(u.whatsapp).replace(/\D/g,""),"_blank");
  $("#uq",w).onclick=()=>{close();setTimeout(()=>qrModal(lk),430)}})}
function qrModal(url){dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61"><div class="sheet-head"><div class="sheet-ico">${ico("captura",22,1.8,"#fff")}</div><div class="sheet-title"><h2>Código QR</h2><p>Escanee para autorregistrarse</p></div><button class="iconbtn" data-x>${XI}</button></div><div id="qq" style="display:grid;place-items:center;padding:22px 0"></div></section>`,w=>{try{new QRCode($("#qq",w),{text:url,width:230,height:230,colorDark:"#10131A",colorLight:"#ffffff"})}catch{$("#qq",w).textContent="No se pudo generar el QR sin conexión."}})}
/* ---- Exportación ---- */
function vExport(){view.innerHTML=`<div class="pad"><div class="agrid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))"><button class="btn btn-dark" id="e1" style="margin:0;display:flex;align-items:center;justify-content:center;gap:10px">${ico("export",22,1.8,"#fff")} PDF de todos los expedientes</button><button class="btn btn-light" id="e2" style="margin:0;border:1px solid #E1E4EA;display:flex;align-items:center;justify-content:center;gap:10px">${ico("export",22,1.8)} CSV de registros</button></div></div>`;$("#e1").onclick=exportPdf;$("#e2").onclick=exportCsv}
function vConfig(){const u=me();const can=db.users.length&&ROLES[u.rol].p.includes("usuarios");
 const avatar=u.foto?`<img src="${u.foto}">`:esc((u.nombre||"?")[0].toUpperCase());
 view.innerHTML=`<div class="pad"><div class="card" style="margin-top:0"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><circle cx="10" cy="8" r="3.5"/><path d="M3 20c0-3.5 3-6 7-6"/><circle cx="18" cy="16" r="2.4"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Mi perfil</h2><p>Nombre, foto y datos del reclutador</p></div></div>
 <div class="avwrap"><div class="avatar" id="av">${avatar}</div><label class="avcam"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="1.9"><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg><input type="file" accept="image/*" id="fFoto" hidden></label></div>
 <div class="fgrid2"><div><label>Nombre</label><input type="text" id="pn" value="${esc(u.nombre)}"></div>
 <div><label>WhatsApp del reclutador</label><div style="position:relative"><span style="position:absolute;left:14px;top:50%;transform:translateY(-50%)">${WAI(22,"#25D366")}</span><input type="tel" id="pw" inputmode="tel" placeholder="809-000-0000" value="${esc(u.whatsapp||"")}" style="padding-left:48px"></div></div>
 <div><label>Provincia</label><select id="pp"><option value="">Seleccione</option>${PROVS.map(p=>`<option ${u.provincia===p?"selected":""}>${p}</option>`).join("")}</select></div>
 <div><label>Municipio</label><input type="text" id="pm" placeholder="Ej. Santo Domingo Oeste" value="${esc(u.municipio||"")}"></div></div>
 <button class="btn btn-dark" id="ps">Guardar perfil</button></div>
 <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><path d="M12 3l8 3v6c0 4.5-3.200 8-8 9-4.800-1-8-4.500-8-9V6l8-3z"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Roles y permisos</h2></div></div>
 ${Object.entries(ROLES).map(([k,r])=>`<div class="role ${u.rol===k?"on":""}"><h3>${r.n}${u.rol===k?"<em>Actual</em>":""}</h3><p>${r.d}</p>${r.p.map(t=>`<span class="tag">${t}</span>`).join("")}</div>`).join("")}</div>
 <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><circle cx="9" cy="8" r="3.5"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><path d="M17 8v6M14 11h6"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Reclutadores y accesos</h2><p>${can?"Asigne el rol y active o suspenda accesos":"Solo el administrador puede asignar accesos"}</p></div></div>
 <div class="lst" style="margin-top:14px">${db.users.map(x=>`<div class="item" style="flex-wrap:wrap"><div style="min-width:0"><b style="font-size:16px">${esc(x.nombre)}</b><small>${esc(x.municipio||"—")}${x.provincia?", "+esc(x.provincia):""} · ${esc(x.whatsapp||"sin WhatsApp")}</small></div>
  <div style="display:flex;gap:8px;align-items:center"><select data-uid="${x.id}" class="urol" ${can?"":"disabled"} style="width:auto;padding:9px;font-size:14px">${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${x.rol===k?"selected":""}>${r.n}</option>`).join("")}</select>
  <button class="btn btn-light sm utog" data-uid="${x.id}" ${can&&x.id!==db.me?"":"disabled"} style="padding:9px 12px;font-size:13px">${x.activo?"Activo":"Suspendido"}</button></div></div>`).join("")}</div>
 ${can?`<button class="btn btn-light" id="addU">+ Agregar reclutador</button>`:""}</div>
 <button class="btn btn-red" id="cr">Borrar datos locales</button></div>`;
 $("#fFoto").onchange=e=>{const f=e.target.files[0];if(!f)return;const x=new FileReader();x.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d"),k=Math.max(256/im.width,256/im.height);g.drawImage(im,(256-im.width*k)/2,(256-im.height*k)/2,im.width*k,im.height*k);u.foto=c.toDataURL("image/jpeg",.8);save();$("#av").innerHTML=`<img src="${u.foto}">`;toast("Foto actualizada")};im.src=x.result};x.readAsDataURL(f)};
 $("#ps").onclick=()=>{const wa=$("#pw").value.replace(/\D/g,"");if($("#pw").value&&wa.length<10)return toast("WhatsApp inválido (10 dígitos)");u.nombre=$("#pn").value.trim()||u.nombre;u.whatsapp=wa;u.provincia=$("#pp").value;u.municipio=$("#pm").value.trim();db.collector.name=u.nombre;logA("Cambio de permisos / config",u.id,"Perfil de "+u.nombre);toast("Perfil guardado");vConfig()};
 $$(".urol").forEach(s=>s.onchange=()=>{const x=db.users.find(y=>y.id===s.dataset.uid);x.rol=s.value;logA("Cambio de permisos / config",x.id,"Permisos rol "+x.rol+" para "+x.nombre);toast("Rol actualizado");vConfig()});
 $$(".utog").forEach(b=>b.onclick=()=>{const x=db.users.find(y=>y.id===b.dataset.uid);x.activo=!x.activo;logA("Cambio de permisos / config",x.id,(x.activo?"Activación de ":"Suspensión de ")+x.nombre);toast(x.activo?"Acceso activado":"Acceso suspendido");vConfig()});
 if($("#addU"))$("#addU").onclick=()=>{const n=prompt("Nombre del reclutador:");if(!n||!n.trim())return;const id="U-"+(db.users.length+1);db.users.push({id,nombre:n.trim(),rol:"recolector",whatsapp:"",provincia:"",municipio:"",activo:true});logA("Cambio de permisos / config",id,"Alta de reclutador "+n.trim());toast("Reclutador agregado");vConfig()};
 $("#cr").onclick=()=>{if(confirm("¿Borrar todos los registros locales?")){localStorage.removeItem(KEY);location.reload()}}}

/* ---- Registros (buscador + filtro + tarjetas) ---- */
let fQ="",fE="";
function vReg(){view.innerHTML=`<div class="pad"><div class="card" style="margin-top:0;padding:16px"><div class="filters"><div style="position:relative"><span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#8A909C">${SRCH}</span><input type="text" id="q" placeholder="Buscar por nombre, apellido, cédula…" value="${esc(fQ)}" style="padding-left:50px;font-size:17px;border-radius:16px;height:56px"></div>
 <select id="est" style="height:56px;font-size:17px;border-radius:16px;color:#6B7280"><option value="">Estado</option><option value="verificado">Validado</option><option value="pendiente">Pendiente</option><option value="duplicado">Duplicado</option></select></div></div>
 <div class="rgrid" id="lista" style="margin-top:16px"></div></div>`;
 $("#est").value=fE;const draw=()=>{fQ=$("#q").value;fE=$("#est").value;const q=fQ.toLowerCase().replace(/-/g,"");
  const L=db.records.filter(r=>(!fE||r.estado===fE)&&(!q||(r.nombre+" "+r.cedula).toLowerCase().replace(/-/g,"").includes(q))).slice().reverse();
  $("#lista").innerHTML=L.map(r=>{const v=r.estado==="verificado",d=r.estado==="duplicado";return `<div class="card" data-id="${r.id}" style="margin:0;cursor:pointer;padding:18px;min-width:0">
   <div style="display:flex;justify-content:space-between;gap:8px"><div style="min-width:0"><b style="font-size:16px;text-transform:uppercase;font-weight:500;overflow-wrap:anywhere">${esc(r.nombre)}</b><div style="font-family:ui-monospace,monospace;color:#6B7280;font-size:14px;letter-spacing:.04em;margin-top:5px">${esc(r.cedula)}</div></div>
   <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><span class="chipx">${r.auto?"Auto registro":"Promotor"}</span><span class="chipx" style="background:${v?"#E3F7EE":d?"#FCE9E8":"#FDF3DD"};border-color:${v?"#BFEBD6":d?"#F6CFCC":"#EEDDB0"};color:${v?"#0A7A52":d?"#B3261E":"#B4640B"}">${v?"Validado":d?"Duplicado":"Pendiente"}</span></div></div>
   <div style="display:flex;justify-content:space-between;gap:8px;color:#8A909C;font-size:13px;margin-top:12px;text-transform:uppercase"><span>${esc(r.municipio)} · Circ. ${esc(r.circ)}</span><span style="text-transform:none;white-space:nowrap">${new Date(r.fecha).toLocaleDateString("es-DO")}</span></div>
   <a href="https://wa.me/1${String(r.whatsapp).replace(/\D/g,"")}" target="_blank" data-wa style="display:flex;gap:10px;align-items:center;color:#059B69;font-size:15px;margin-top:12px;text-decoration:none;font-weight:500">${WAI(22,"#25D366")}Contactar por WhatsApp</a></div>`}).join("")||"<p class='sub'>Sin resultados.</p>";
  $$("#lista [data-id]").forEach(c=>c.onclick=e=>{if(e.target.closest("[data-wa]"))return;ficha(c.dataset.id)})};
 $("#q").oninput=draw;$("#est").onchange=draw;draw()}
const CAMI=`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.500h2.800l1.400-2.300h7.600l1.400 2.300H20a.9.900 0 0 1 .9.900v8.600a.9.900 0 0 1-.9.900H4a.9.900 0 0 1-.9-.9V9.400A.9.900 0 0 1 4 8.500z"/><circle cx="12" cy="13.600" r="3.300"/></svg>`;const SRCH='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="6.500"/><path d="M20 20l-4.200-4.200"/></svg>';
const PIN='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>';
const USR0='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/></svg>';
const TEL='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
const CASA='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const CAL='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
const USR='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 11l2 2 4-4"/></svg>';
function ficha(id){const r=db.records.find(x=>x.id===id);
 const fila=(ico,k,v,extra="")=>`<div style="display:flex;gap:18px;align-items:flex-start;padding:13px 0;border-bottom:1px solid #F0F1F4">${ico}<div style="flex:1"><div style="color:#9AA0AC;letter-spacing:.08em;font-size:13px;text-transform:uppercase">${k}</div><div style="font-size:18px;margin-top:3px;color:#10131A">${v||"—"}</div></div>${extra}</div>`;
 const tipo=r.auto?"Auto registro":"Promotor",val=r.estado==="verificado";
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:93vh;display:flex;flex-direction:column;padding-bottom:0">
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3"><div style="width:68px;height:68px;border-radius:50%;background:#10131A;color:#fff;display:grid;place-items:center;font-size:30px;font-weight:600;flex:0 0 auto">${esc((r.nombre||"?")[0].toUpperCase())}</div>
 <div class="sheet-title"><h2 style="font-size:18px;text-transform:uppercase">${esc(r.nombre)}</h2><div style="display:flex;gap:8px;margin-top:6px"><span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:4px 12px;font-size:13px;color:#3A3F4A">${tipo}</span><span style="background:${val?"#E3F7EE":r.estado==="duplicado"?"#FCE9E8":"#FDF3DD"};border:1px solid ${val?"#BFEBD6":"#EEDDB0"};border-radius:99px;padding:4px 12px;font-size:13px;color:${val?"#0A7A52":r.estado==="duplicado"?"#B3261E":"#B4640B"}">${val?"Validado":r.estado==="duplicado"?"Duplicado":"Pendiente"}</span></div></div><button class="iconbtn" data-x>✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:4px 0 20px">
 ${fila(USR0,"Nombre completo",esc(r.nombre).toUpperCase())}${fila(USR0,"Cédula",esc(r.cedula))}${fila(TEL,"WhatsApp",esc(r.whatsapp))}${fila(CASA,"Dirección",esc(r.direccion).toUpperCase())}${fila(PIN,"Municipio",esc(r.municipio).toUpperCase())}${r.distrito&&r.distrito.trim()?fila(PIN,"Distrito municipal",esc(r.distrito).toUpperCase()):""}${fila(PIN,"Sector",esc(r.sector).toUpperCase())}
 ${fila(PIN,"Circunscripción","Circunscripción "+esc(r.circ),'<button id="edCirc" style="border:0;background:none;font-size:15px;color:#10131A;cursor:pointer;font-family:inherit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L18.500 9.500a2.100 2.100 0 0 0 0-3l-1-1a2.100 2.100 0 0 0-3 0L4 16z"/><path d="M13 7l4 4"/></svg> Editar</button>')}
 ${fila(CAL,"Fecha y hora",new Date(r.fecha).toLocaleString("es-DO"))}${fila(USR,"Tipo de registro",tipo)}${fila(USR,"Recolector responsable",esc(db.collector.name))}
 <div style="display:flex;gap:12px;align-items:center;color:#9AA0AC;font-size:14px;margin:18px 0 10px"><svg viewBox="0 0 24 24" width="22" height="24" fill="none" stroke="#8A909C" stroke-width="1.6"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>FIRMA</div>
 <div style="border:1px solid #E7E9EE;border-radius:24px;height:190px;display:grid;place-items:center;background:#FAFBFC">${r.firma?`<img src="${r.firma}" style="max-width:90%;max-height:90%">`:'<span style="color:#9AA0AC;font-size:16px">No disponible</span>'}</div></div>
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="fpdf" style="margin:0;display:flex;align-items:center;justify-content:center;gap:10px"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.500 10.500L12 15l4.500-4.500"/><path d="M5 19h14"/></svg> Descargar PDF</button></div></section>`,(w,close)=>{
 $("#edCirc",w).onclick=()=>{const n=prompt("Circunscripción electoral:",r.circ);if(n&&n.trim()){r.circ=n.trim();save();close();toast("Circunscripción actualizada");setTimeout(()=>{ficha(id);if(cur==="reg")vReg()},450)}};
 $("#fpdf",w).onclick=()=>pdfExpediente(r)})}

/* ---- Admin / auditoría ---- */
function vAdmin(){const A=db.audit;const ok=A.filter(x=>x.ok).length;
 view.innerHTML=`<div class="pad">
 <div class="grid" style="margin-bottom:14px"><div class="stat dark"><small>Eventos</small><b>${A.length}</b></div><div class="stat"><small>Exitosos</small><b>${ok}</b></div></div>
 <div class="card" style="padding:0;overflow:hidden"><div class="scrollx"><table class="atable"><thead><tr><th>Usuario</th><th>Acción</th><th>Registro</th><th>Detalles</th><th>Resultado</th><th>Fecha/Hora</th></tr></thead><tbody>
 ${A.map(x=>`<tr><td><b>${esc(x.u)}</b></td><td>${esc(x.a)}</td><td class="mono">${esc(x.reg)}</td><td>${esc(x.det)}</td><td style="color:${x.ok?"#059B69":"#B3261E"};font-weight:600">${x.ok?"Éxito":"Fallo"}</td><td style="white-space:nowrap">${new Date(x.t).toLocaleString("es-DO")}</td></tr>`).join("")||'<tr><td colspan="6" style="text-align:center;color:#8A909C">Sin eventos.</td></tr>'}</tbody></table></div></div>
 <div class="card"><b style="font-size:18px">Revisión de firmas</b><p class="sub" style="font-size:15px;margin:6px 0 0">Valide cada registro o márquelo como duplicado.</p>
 ${db.records.map(r=>`<div class="item" style="margin-top:10px"><div style="min-width:0"><b style="font-size:15px">${esc(r.nombre)}</b><small>${esc(r.cedula)} · ${r.estado}</small></div><div style="display:flex;gap:6px"><button class="btn btn-light sm" data-a="ok" data-id="${r.id}" aria-label="Validar" title="Validar"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></button><button class="btn btn-light sm" data-a="dup" data-id="${r.id}" aria-label="Marcar duplicado" title="Marcar duplicado"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8.500" y="8.500" width="11" height="11" rx="2.500"/><path d="M15.500 8.500V6.500a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg></button></div></div>`).join("")}</div>
 <div class="two" style="margin-top:14px"><button class="btn btn-dark" id="btnPdf">Exportar expedientes PDF</button><button class="btn btn-light" id="btnCsv" style="border:1px solid #E1E4EA">Exportar bitácora CSV</button></div></div>`;
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


function citizenDone(){const v=document.getElementById("view");v.innerHTML=`<div class="cwrap" style="text-align:center;padding-top:40px"><div style="width:84px;height:84px;border-radius:50%;background:#E3F7EE;display:grid;place-items:center;margin:0 auto 18px"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#059B69" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></div><h2 style="margin:0 0 8px">¡Registro completado!</h2><p class="sub" style="font-size:17px">Gracias por afiliarse. Puede compartir este enlace con sus familiares, amigos y conocidos para que también se registren.</p>
 <button class="btn btn-wa" id="cShare2" style="display:flex;align-items:center;justify-content:center;gap:10px">${WAI(22,"#fff")} Compartir con mis contactos</button></div>`;
 document.getElementById("cShare2").onclick=()=>document.getElementById("cShare").click()}
/* ---- MODO CIUDADANO: solo autorregistro ---- */
function citizenMode(){
 document.body.innerHTML=`<div id="citz"><header class="ctop"><div style="display:flex;gap:12px;align-items:center"><div class="clogo"><img src="icons/logo-96.png" width="34" height="34" alt="FirmAbal"></div><div><div style="font-size:21px;font-weight:600">FirmAbal</div><div style="color:#8A909C;font-size:15px">Autorregistro ciudadano</div></div></div><button class="iconbtn" id="cShare" aria-label="Compartir">${ico("captura",0)}<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1A1D21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.600 13.400l6.800 4M8.600 10.600l6.800-4"/></svg></button></header>
 <main id="view" class="cview"></main><div class="sheet-mask" id="sheetMask" hidden></div><div class="toast" id="toast"></div></div>`;
 view=document.getElementById("view");
 cStart()}
function cStart(){const v=document.getElementById("view");
 v.innerHTML=`<div class="cwrap"><div class="card" style="margin-top:0;padding:22px"><h2 style="margin:0 0 12px;font-size:20px">Registro desde su celular</h2><ol style="font-size:17px;line-height:1.55;color:#5B6270;padding-left:22px;margin:0"><li>Tenga su cédula a mano, en un lugar bien iluminado.</li><li>Capture el <b>frente</b> y luego el <b>reverso</b> de su cédula.</li><li>Revise sus datos y firme con el dedo.</li><li>Su registro quedará asociado al promotor que le invitó.</li></ol></div>
 <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5">${WAI(26,"#25D366")}</div><div class="sheet-title"><h2 style="font-size:18px">Su WhatsApp</h2><p>Número de contacto</p></div></div><input type="tel" id="cWa" inputmode="tel" placeholder="809-000-0000" style="margin-top:16px;font-size:20px;padding:17px;border-radius:18px"></div>
 <button class="btn btn-dark" id="cGo" style="padding:20px;font-size:19px;border-radius:24px;display:flex;align-items:center;justify-content:center;gap:12px">${ico("captura",24,1.8,"#fff")} Comenzar registro</button></div>`;
 document.getElementById("cGo").onclick=()=>{const wa=document.getElementById("cWa").value.replace(/\D/g,"");if(wa.length<10)return toast("Escriba su WhatsApp (10 dígitos)");
  view=v;wiz={step:1,d:{whatsapp:wa,auto:true,recSrc:REC}};consentSheet(()=>{wiz.step=2;citizenWiz()})};
 document.getElementById("cShare").onclick=()=>{const url=shareLink(REC),txt="Complete su autorregistro de afiliación desde el celular, solo necesita su cédula: "+url;
  if(navigator.share)navigator.share({title:"FirmAbal",text:txt,url}).catch(()=>{});else window.open("https://wa.me/?text="+encodeURIComponent(txt),"_blank")}}
function citizenWiz(){renderWiz()}

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
  <button class="btn btn-dark" id="next" style="padding:22px;font-size:20px;border-radius:24px;display:flex;align-items:center;justify-content:center;gap:12px">${ico("captura",24,1.8,"#fff")} Iniciar captura</button></div>`;
 if(s===2)view.innerHTML=`<div class="pad">${bar}<h1>Cédula</h1><p class="sub">Fotografíe el frente y luego el reverso</p>
  <label class="cedula" id="fr" style="display:flex;flex-direction:column;align-items:center;gap:8px">${CAMI} Frente de la cédula${wiz.d.imgF?`<br><img src="${wiz.d.imgF}">`:""}<input type="file" accept="image/*" capture="environment" hidden id="fFront"></label>
  <label class="cedula" id="bk" style="display:flex;flex-direction:column;align-items:center;gap:8px">${CAMI} Reverso de la cédula${wiz.d.imgB?`<br><img src="${wiz.d.imgB}">`:""}<input type="file" accept="image/*" capture="environment" hidden id="fBack"></label>
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
  $("#no",w).onclick=()=>{close();toast("Consentimiento rechazado. Registro cancelado");AUTO?setTimeout(cStart,420):go("dash")};
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
   const rec={auto:!!d.auto,id:"R-"+Date.now(),nombre:d.nombre,cedula:d.cedula,nac:d.nac,sexo:d.sexo,lugar:d.lugar,whatsapp:d.whatsapp,direccion:d.direccion,municipio:d.municipio,distrito:d.distrito,sector:d.sector,circ:d.circ,firma:c.toDataURL("image/png"),imgFRONTAL:d.imgF||null,imgTRASERA:d.imgB||null,estado:d.dup?"duplicado":"pendiente",fecha:Date.now(),rec:d.recSrc||db.collector.id,lat:18.4861+(Math.random()-.5)*.08,lng:-69.9312+(Math.random()-.5)*.1};
   db.records.push(rec);logA("Creación de registro",rec.id,"Cédula "+rec.cedula);save();if(AUTO){citizenDone();return}toast(d.dup?"Cédula ya registrada: marcada como duplicado":"Afiliación guardada");go("dash")}}}

if(new URLSearchParams(location.search).get("auto")){db.records.auto=true}
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
if(AUTO){document.body.classList.add("citizen");citizenMode()}else goNow("dash");
})();
