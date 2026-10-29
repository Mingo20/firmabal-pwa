(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let view=$("#view");
const KEY="firmabal-db-v4";
const db=JSON.parse(localStorage.getItem(KEY)||"null")||{meta:10,collector:{id:"REC-001",name:"Domingo Guerra",sharing:false},records:[
 {id:"R-1",nombre:"CARMEN CHALAS MENA",cedula:"224-0009987-9",nac:"1975-03-20",sexo:"F",lugar:"Santo Domingo",whatsapp:"8296469885",direccion:"San José casa 37",municipio:"Santo Domingo Oeste",distrito:"",sector:"Hato Nuevo",circ:"4",firma:null,estado:"verificado",fecha:Date.now()-86400000*3,rec:"REC-001",lat:18.4861,lng:-69.9712},
 {id:"R-2",nombre:"MIGUEL ANGEL GUERRA CHALAS",cedula:"402-2990201-2",nac:"1999-08-11",sexo:"M",lugar:"Santo Domingo",whatsapp:"8095550002",direccion:"Calle Principal 5",municipio:"Santo Domingo",distrito:"",sector:"Hato Nuevo",circ:"4",firma:null,estado:"pendiente",fecha:Date.now()-86400000*3,rec:"REC-001",lat:18.4722,lng:-69.9961}]};
const ROLES={administrador:{n:"Administrador",d:"Acceso completo al sistema.",p:["capturar","consultar","cedula","telefono","firmas","modificar","eliminar","exportar","auditoria","configurar","usuarios","monitor"]},supervisor:{n:"Supervisor",d:"Consulta, revisión y supervisión de registros.",p:["capturar","consultar","cedula","telefono","firmas","modificar","exportar","monitor"]},recolector:{n:"Recolector",d:"Captura de registros y consulta mínima.",p:["capturar","consultar"]},auditor:{n:"Auditor",d:"Consulta de registros de auditoría.",p:["consultar","auditoria"]}};
const GEO={"Distrito Nacional":[18.4861,-69.9312,{"Santo Domingo de Guzmán":[18.4861,-69.9312]}],"Santo Domingo":[18.5,-69.85,{"Santo Domingo Este":[18.4885,-69.857],"Santo Domingo Oeste":[18.495,-70.018],"Santo Domingo Norte":[18.556,-69.91],"Boca Chica":[18.4497,-69.6061],"San Antonio de Guerra":[18.543,-69.699],"Pedro Brand":[18.583,-70.099],"Los Alcarrizos":[18.508,-70.017]}],"Santiago":[19.45,-70.69,{"Santiago de los Caballeros":[19.4517,-70.697],"Villa Bisonó (Navarrete)":[19.56,-70.88],"Licey al Medio":[19.392,-70.593],"Tamboril":[19.48,-70.61],"Jánico":[19.319,-70.833],"Puñal":[19.383,-70.787],"Villa González":[19.5,-70.8]}],"La Vega":[19.22,-70.53,{"La Vega":[19.221,-70.529],"Jarabacoa":[19.117,-70.636],"Constanza":[18.909,-70.745]}],"San Cristóbal":[18.42,-70.11,{"San Cristóbal":[18.418,-70.109],"Villa Altagracia":[18.67,-70.169],"Bajos de Haina":[18.417,-70.035],"Yaguate":[18.335,-70.2]}],"Puerto Plata":[19.79,-70.69,{"Puerto Plata":[19.7934,-70.6884],"Sosúa":[19.75,-70.517],"Imbert":[19.75,-70.82]}],"La Altagracia":[18.58,-68.4,{"Higüey":[18.615,-68.708],"Punta Cana (Verón)":[18.582,-68.405],"San Rafael del Yuma":[18.425,-68.669]}],"San Pedro de Macorís":[18.46,-69.3,{"San Pedro de Macorís":[18.4539,-69.3086],"Consuelo":[18.57,-69.29]}],"Duarte":[19.3,-70.25,{"San Francisco de Macorís":[19.3009,-70.2528],"Pimentel":[19.206,-70.297]}],"Espaillat":[19.62,-70.39,{"Moca":[19.394,-70.526],"Gaspar Hernández":[19.627,-70.281]}],"La Romana":[18.43,-68.97,{"La Romana":[18.4273,-68.9728]}],"Azua":[18.45,-70.73,{"Azua de Compostela":[18.453,-70.734]}],"Barahona":[18.21,-71.1,{"Barahona":[18.2085,-71.1008]}],"Monseñor Nouel":[18.92,-70.4,{"Bonao":[18.936,-70.409]}],"Peravia":[18.28,-70.33,{"Baní":[18.279,-70.331]}],"Valverde":[19.59,-70.98,{"Mao":[19.552,-70.987]}],"Monte Cristi":[19.85,-71.64,{"Monte Cristi":[19.849,-71.646]}],"Dajabón":[19.55,-71.7,{"Dajabón":[19.5499,-71.7088]}],"Santiago Rodríguez":[19.47,-71.34,{"San Ignacio de Sabaneta":[19.478,-71.344]}],"María Trinidad Sánchez":[19.38,-69.85,{"Nagua":[19.383,-69.847]}],"Samaná":[19.2,-69.34,{"Samaná":[19.2056,-69.3364]}],"Hermanas Mirabal":[19.37,-70.38,{"Salcedo":[19.377,-70.417]}],"Sánchez Ramírez":[19.05,-70.15,{"Cotuí":[19.052,-70.15]}],"Monte Plata":[18.81,-69.79,{"Monte Plata":[18.808,-69.785]}],"Hato Mayor":[18.76,-69.25,{"Hato Mayor del Rey":[18.763,-69.257]}],"El Seibo":[18.77,-69.04,{"El Seibo":[18.765,-69.039]}],"San Juan":[18.81,-71.23,{"San Juan de la Maguana":[18.806,-71.23]}],"Elías Piña":[18.88,-71.7,{"Comendador":[18.876,-71.705]}],"Independencia":[18.48,-71.85,{"Jimaní":[18.498,-71.85]}],"Bahoruco":[18.48,-71.42,{"Neiba":[18.481,-71.419]}],"Pedernales":[18.04,-71.74,{"Pedernales":[18.038,-71.744]}],"San José de Ocoa":[18.54,-70.5,{"San José de Ocoa":[18.546,-70.504]}]};
const MUNIS=Object.fromEntries(Object.entries(GEO).map(([p,v])=>[p,Object.keys(v[2])]));
const PROVS=Object.keys(MUNIS);
db.users=db.users||[{id:"U-1",nombre:db.collector.name,rol:"administrador",whatsapp:"8296469885",provincia:"Santo Domingo",municipio:"Santo Domingo Oeste",activo:true}];
db.org=db.org||"FirmAbal";db.ses=db.ses||"U-1";db.audit=db.audit||[{t:Date.now()-86400000*2,u:db.collector.name,a:"Creación de registro",reg:"R-1",det:"Cédula 224-0009987-9",ok:true},{t:Date.now()-86400000*2,u:db.collector.name,a:"Creación de registro",reg:"R-2",det:"Cédula 402-2990201-2",ok:true},{t:Date.now()-86400000,u:db.collector.name,a:"Cambio de permisos / config",reg:"—",det:"Permisos rol administrador",ok:true}];
db.me=db.me||"U-1";
const me=()=>db.users.find(u=>u.id===db.ses)||db.users[0];
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
const PERMV={dash:[],captura:["capturar"],reg:["consultar"],firmas:["firmas"],monitor:["monitor"],terr:["consultar"],recol:["usuarios"],audit:["auditoria"],export:["exportar"],config:["configurar"]};
const can=v=>{const u=me();const p=(ROLES[u.rol]||{p:[]}).p;return (PERMV[v]||[]).every(x=>p.includes(x))};
const logA=(a,reg,det,ok=true)=>{db.audit.unshift({t:Date.now(),u:me().nombre,a,reg:reg||"—",det:det||"—",ok});db.audit=db.audit.slice(0,300);save()};
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2400)};
const WAI=(w,c)=>`<svg viewBox="0 0 32 32" width="${w}" height="${w}" aria-hidden="true"><path fill="${c}" d="M16 3C8.8 3 3 8.8 3 16c0 2.5.7 4.8 1.9 6.8L3 29l6.4-1.8A13 13 0 0 0 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.7c-2 0-3.9-.6-5.6-1.6l-.4-.2-3.8 1.100 1-3.700-.3-.4A10.700 10.700 0 1 1 16 26.700zm5.900-8c-.3-.2-1.900-.9-2.200-1-.3-.1-.5-.2-.7.2-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.400-.5-2.600-1.600-1-.9-1.600-1.900-1.800-2.200-.2-.3 0-.5.100-.7l.5-.5c.1-.2.200-.3.300-.5.100-.2.100-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.300 4.700 3.100 1.300 3.100.9 3.700.8.600-.1 1.900-.8 2.100-1.500.3-.7.300-1.400.2-1.500-.1-.2-.3-.3-.6-.4z"/></svg>`;
const ICONS={
dash:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
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
const recName=r=>{const u=db.users.find(x=>x.id===r.rec||x.id===String(r.rec).replace("REC-","U-"));return u?u.nombre:(r.rec||"—")};
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
$("#btnWa").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent("Hola, puede completar su autorregistro desde su celular, solo necesita su cédula: "+shareLink()),"_blank");
$("#btnQr").onclick=()=>{closeS($("#autoSheet"),()=>{const b=$("#qrBox");b.innerHTML="";try{new QRCode(b,{text:shareLink(),width:230,height:230,colorDark:"#10131A",colorLight:"#ffffff"})}catch{b.innerHTML="<p class='sub'>No se pudo generar el QR sin conexión.</p>"}openS($("#qrSheet"))})};
$("#btnCloseQr").onclick=()=>closeS($("#qrSheet"));
$("#btnQrBack").onclick=()=>closeS($("#qrSheet"),()=>openS($("#autoSheet")));


const HELP={
dash:{t:"Inicio",d:"Resumen en vivo de la captura territorial.",p:["Cada tarjeta muestra un indicador: totales, capturados hoy, pendientes por validar, duplicados, auto registros y recolectores activos.","La gráfica compara los registros de los últimos 7 días.","Para capturar un afiliado use el botón de la cámara (o el menú lateral en PC)."]},
reg:{t:"Registros",d:"Todas las afiliaciones capturadas.",p:["Escriba en el buscador un nombre, apellido o cédula para filtrar al instante.","Use el filtro Estado para ver solo validados, pendientes o duplicados.","Toque una tarjeta para abrir la ficha completa y editar la circunscripción.","Con Contactar por WhatsApp abre un chat directo con el ciudadano."]},
captura:{t:"Captura",d:"Flujo guiado de 4 pasos para registrar un afiliado.",p:["Paso 1: pida el WhatsApp del ciudadano y, si lo desea, su circunscripción y presente la hoja de protección de datos.","Paso 2: fotografíe frente y reverso de la cédula con buena luz.","Paso 3: revise los datos leídos. Los verificados quedan bloqueados.","Paso 4: el ciudadano firma con el dedo y se guarda el registro."]},
firmas:{t:"Firmas",d:"Galería de firmas con su expediente.",p:["Toque una tarjeta para ver la firma, la cédula frontal y trasera y los datos electorales.","Descargar PDF genera un expediente ordenado, válido como evidencia."]},
monitor:{t:"Monitor",d:"Mapa del territorio y estado del equipo.",p:["Los puntos del mapa son los registros capturados (verde validado, ámbar pendiente).","Deslice las tarjetas para ver recolectores activos y registros.","El botón circular inferior comparte su ubicación en vivo; se anima mientras está activo. Tóquelo de nuevo para detenerlo."]},
terr:{t:"Territorios",d:"Registros agrupados por municipio, sector y circunscripción.",p:["Cada tarjeta indica la zona y cuántos afiliados tiene.","Úselo para detectar zonas con poca cobertura."]},
recol:{t:"Recolectores",d:"Equipo de captura y su rendimiento.",p:["Toque un reclutador para ver su rendimiento, cambiar su rol y estado, copiar su enlace único y escribirle por WhatsApp.","El botón + inferior agrega un nuevo reclutador."]},
audit:{t:"Auditoría",d:"Bitácora de eventos y revisión de firmas.",p:["La tabla registra quién hizo qué, sobre qué registro, el resultado y la fecha. Deslice horizontalmente para ver todas las columnas.","En Revisión de firmas valide con el botón del check o marque duplicado con el botón de copias.","Exporte los expedientes en PDF o la bitácora en CSV."]},
export:{t:"Exportación",d:"Descarga de expedientes y datos.",p:["PDF de todos los expedientes: un documento ordenado por afiliado.","CSV de registros: datos en hoja de cálculo."]},
config:{t:"Configuración",d:"Su perfil y los accesos del equipo.",p:["Actualice su foto, nombre, WhatsApp, provincia y municipio.","Roles y permisos muestra qué puede hacer cada rol.","El administrador asigna roles y activa o suspende reclutadores."]}
};
function ayuda(){const h=HELP[cur]||HELP.dash;dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:88vh;overflow-y:auto"><div class="sheet-head"><div class="sheet-title"><h2>${h.t}</h2><p>${h.d}</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <div class="help-box" style="margin-top:14px"><div class="help-sec" style="margin:0"><h4>Cómo usar esta pantalla</h4><ol style="padding-left:20px;margin:8px 0 0">${h.p.map(x=>`<li>${x}</li>`).join("")}</ol></div></div></section>`)}
$("#btnHelp").onclick=ayuda;

/* ---- Tarjeta de instalacion (solo navegador) ---- */
let ibPrompt=null,ibTimer=null;
const ibStandalone=()=>{try{return !!(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true}catch(e){return false}};
function ibHide(permanent){
 const el=$("#installBar");if(!el)return;
 el.classList.add("out");setTimeout(()=>el.classList.remove("show","out"),420);
 if(permanent){try{sessionStorage.setItem("firmabal-ib","off")}catch(e){}}
}
function ibShow(){
 const el=$("#installBar");if(!el||ibStandalone())return;
 try{if(sessionStorage.getItem("firmabal-ib")==="off")return}catch(e){}
 el.classList.add("show");ibTimer=setTimeout(()=>el.classList.add("show"),10);
 /* deslizar a los lados para ocultar */
 let x0=null;
 el.addEventListener("touchstart",e=>{x0=e.touches[0].clientX},{passive:true});
 el.addEventListener("touchmove",e=>{if(x0===null)return;const dx=e.touches[0].clientX-x0;
  if(Math.abs(dx)>8){el.style.transform="translate("+dx+"px,"+(Math.abs(dx)>120?"-120%":0)+"px)";el.style.opacity=String(Math.max(0,1-Math.abs(dx)/260))}},{passive:true});
 el.addEventListener("touchend",e=>{const dx=(e.changedTouches[0].clientX-(x0||0));x0=null;
  if(Math.abs(dx)>70){el.style.transform="";el.style.opacity="";ibHide(true)}else{el.style.transform="";el.style.opacity=""}},{passive:true});
 const x=$("#ibX");if(x)x.onclick=()=>ibHide(true);
 const go=$("#ibGo");if(go)go.onclick=async()=>{
  if(ibPrompt){ibPrompt.prompt();const r=await ibPrompt.userChoice.catch(()=>({outcome:"dismissed"}));
   ibPrompt=null;if(r&&r.outcome==="accepted"){ibHide(true);return}toast("Instalación cancelada");return}
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  toast(ios?"En Safari: Compartir → Añadir a pantalla de inicio":"Use el menú del navegador → Instalar aplicación");
 };
}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();ibPrompt=e;ibShow()});
window.addEventListener("appinstalled",()=>ibHide(true));
if(document.readyState!=="loading")setTimeout(ibShow,1200);else window.addEventListener("load",()=>setTimeout(ibShow,1200));

/* ---- Navegación ---- */
const TABS=[["dash","Inicio"],["reg","Registros"],["captura","Captura"],["firmas","Firmas"],["menu","Menú"]];
$("#tabbar").innerHTML=TABS.map(([k,l])=>k==="captura"?`<button class="tab tab-cam" data-v="captura" aria-label="${l}">${ico("captura",30,1.9,"#fff")}</button>`:k==="menu"?`<button class="tab" data-v="menu" aria-label="${l}"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.700" y="3.700" width="6.600" height="6.600" rx="2"/><rect x="13.700" y="3.700" width="6.600" height="6.600" rx="2"/><rect x="3.700" y="13.700" width="6.600" height="6.600" rx="2"/><rect x="13.700" y="13.700" width="6.600" height="6.600" rx="2"/></svg></button>`:`<button class="tab" data-v="${k}" aria-label="${l}">${ico(k,26)}</button>`).join("");
$("#sideLinks").innerHTML=MENU.filter(m=>can(m[0])).map(([k,l])=>`<button class="sb-link" data-v="${k}" title="${l}">${ico(k,22)}<span class="sb-name">${l}</span></button>`).join("");
const sbKey="firmabal-sb";let sbOpen=localStorage.getItem(sbKey)!=="0";
const applySb=()=>{document.body.classList.toggle("sb-collapsed",!sbOpen);$("#btnSideToggle").innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${sbOpen?"M15 6l-6 6 6 6":"M9 6l6 6-6 6"}"/></svg>`;$("#btnSideToggle").title=sbOpen?"Contraer":"Desplegar"};
$("#btnSideToggle").onclick=()=>{sbOpen=!sbOpen;localStorage.setItem(sbKey,sbOpen?"1":"0");applySb()};applySb();
const menuSheet=show=>{if(!show)return closeS($("#menuSheet"));{$("#menuGrid").innerHTML=MENU.filter(m=>can(m[0])).map(([k,l])=>`<button data-go="${k}" class="${cur===k?"on":""}">${ico(k,30,1.6,"#2B2F38")}${l}</button>`).join("");$$("[data-go]").forEach(b=>b.onclick=()=>{closeS($("#menuSheet"),()=>go(b.dataset.go))});openS($("#menuSheet"))}};
$("#btnShare").onclick=()=>sheet(true);
let navBusy=false;
$("#btnCloseMenu").onclick=()=>menuSheet(false);$("#btnCloseMenu").innerHTML=XI;
$("#sheetMask").onclick=closeAll;
$$(".tab,.sb-link").forEach(b=>b.onclick=()=>b.dataset.v==="menu"?menuSheet(true):go(b.dataset.v));
function go(v){if(navBusy)return;navBusy=true;const bar=document.querySelector(".pagebar")||(()=>{const b=document.createElement("div");b.className="pagebar";document.body.appendChild(b);return b})();
 bar.style.opacity=1;bar.classList.remove("go");void bar.offsetWidth;bar.classList.add("go");view.classList.add("out");
 setTimeout(()=>{goNow(v);view.classList.remove("out");view.classList.remove("in");void view.offsetWidth;view.classList.add("in");setTimeout(()=>{bar.style.opacity=0;setTimeout(()=>{bar.classList.remove("go");bar.style.width=0},200);navBusy=false},500)},280)}
function goNow(v){if(!can(v)){toast("Su rol no tiene acceso a esta pantalla");return}cur=v;document.body.dataset.page=v;$$(".tab,.sb-link").forEach(b=>b.classList.toggle("on",b.dataset.v===v));if(map){map.remove();map=null}
 ({dash:vDash,equipo:vEquipo,monitor:vEquipo,terr:vTerr,recol:vRecol,captura:vCaptura,reg:vReg,firmas:vFirmas,audit:vAdmin,export:vExport,config:vConfig})[v]();view.scrollTop=0}

/* ---- Centro de control ---- */
/* ---- Mapa de cobertura nacional: provincia > municipio > distrito/sector ---- */
let covMap=null,covLv={p:null,m:null};
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
function provDe(r){if(r.provincia&&GEO[r.provincia])return r.provincia;const m=norm(r.municipio);if(!m)return null;for(const [p,v] of Object.entries(GEO)){if(norm(p)===m)return p;for(const mu of Object.keys(v[2])){const n=norm(mu);if(n===m||m.includes(n)||(n.includes(m)&&m.length>5))return p}}return null}
function munDe(r,p){const m=norm(r.municipio);if(!p||!GEO[p]||!m)return null;for(const mu of Object.keys(GEO[p][2])){const n=norm(mu);if(n===m||m.includes(n)||(n.includes(m)&&m.length>5))return mu}return null}
function covData(){const P={};let sinUbic=0;db.records.forEach(r=>{const p=provDe(r);if(!p){sinUbic++;return}
  const m=munDe(r,p)||"(otro municipio)";const area=((r.distrito||"").trim())||((r.sector||"").trim())||"Sin sector";
  P[p]=P[p]||{n:0,M:{}};P[p].n++;P[p].M[m]=P[p].M[m]||{n:0,S:{}};P[p].M[m].n++;P[p].M[m].S[area]=(P[p].M[m].S[area]||0)+1});return {P,sinUbic}}
function vCov(){const w=document.getElementById("covmap");if(!w)return;
 if(covMap){covMap.remove();covMap=null}
 covMap=L.map("covmap",{zoomControl:false,attributionControl:false,scrollWheelZoom:false,zoomSnap:.25}).setView([18.95,-70.35],7.2);
 L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{maxZoom:19}).addTo(covMap);
 L.control.zoom({position:"bottomright"}).addTo(covMap);
 const layer=L.layerGroup().addTo(covMap);const bar=document.getElementById("covbar");
 const bub=(pos,n,label,cls,fn)=>{const h=`<div class="covbub ${cls||""}">${n}<span>${esc(label)}</span></div>`;const mk=L.marker(pos,{icon:L.divIcon({className:"",html:h,iconSize:null,iconAnchor:[20,14]})}).addTo(layer);if(fn)mk.on("click",fn);return mk};
 const draw=()=>{layer.clearLayers();const {P,sinUbic}=covData();const tot=db.records.length;
  const crumbs=[`<button class="covpill" data-lv="n">Nacional · ${tot}</button>`];
  if(covLv.p)crumbs.push(`<button class="covpill" data-lv="p">${esc(covLv.p)} · ${(P[covLv.p]||{n:0}).n}</button>`);
  if(covLv.m)crumbs.push(`<span class="covpill ghost">${esc(covLv.m)} · ${((P[covLv.p]||{M:{}}).M[covLv.m]||{n:0}).n}</span>`);
  bar.innerHTML=crumbs.join("")+(sinUbic&&!covLv.p?`<span class="covpill ghost" title="Registros cuyo municipio no pudo ubicarse">Sin ubicar · ${sinUbic}</span>`:"");
  $$("[data-lv]",bar).forEach(b=>b.onclick=()=>{if(b.dataset.lv==="n"){covLv={p:null,m:null};covMap.flyTo([18.95,-70.35],7.2,{duration:.9})}else{covLv.m=null;const g=GEO[covLv.p];covMap.flyTo([g[0],g[1]],10,{duration:.9})}draw()});
  if(!covLv.p){Object.entries(P).forEach(([p,d])=>{const g=GEO[p];bub([g[0],g[1]],d.n,p,"",()=>{covLv.p=p;covMap.flyTo([g[0],g[1]],10,{duration:.9});draw()})});
   if(!Object.keys(P).length)bub([18.95,-70.35],0,"Sin registros ubicados","g")}
  else if(!covLv.m){const g=GEO[covLv.p],d=P[covLv.p]||{M:{}};Object.entries(d.M).forEach(([m,v],i)=>{const c=g[2][m]||[g[0]+Math.sin(i*2.4)*.05,g[1]+Math.cos(i*2.4)*.05];bub(c,v.n,m,"g",()=>{covLv.m=m;covMap.flyTo(c,12.5,{duration:.9});draw()})})}
  else{const g=GEO[covLv.p],c=g[2][covLv.m]||[g[0],g[1]],S=((P[covLv.p]||{M:{}}).M[covLv.m]||{S:{}}).S;const ks=Object.keys(S);
   ks.forEach((s,i)=>{const a=(i/Math.max(1,ks.length))*Math.PI*2,rad=ks.length>1?.012:0;bub([c[0]+Math.sin(a)*rad,c[1]+Math.cos(a)*rad*1.1],S[s],s,"g")})}};
 draw();setTimeout(()=>covMap.invalidateSize(),250)}

function vDash(){const s=stats();covLv={p:null,m:null};setTimeout(vCov,60);
 view.innerHTML=`<div class="pad"><div class="grid"><div class="stat dark"><small>Totales</small><b>${s.total}</b></div><div class="stat"><small>Capturados hoy</small><b>${s.hoy}</b></div>
 <div class="stat amber"><small>Pendientes</small><b>${s.pen}</b></div><div class="stat red"><small>Duplicados</small><b>${s.dup}</b></div>
 <div class="stat"><small>Auto registros</small><b>${s.auto}</b></div><div class="stat"><small>Recolectores</small><b>${db.users.filter(u=>u.activo).length}</b></div></div>
 <div class="card" style="padding:18px 16px 16px"><div style="display:flex;gap:10px;align-items:center;font-size:16px;font-weight:600;margin-bottom:12px"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10131A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5L3.5 6.8v12.7L9 17.2l6 2.3 5.5-2.3V4.5L15 6.8z"/><path d="M9 4.5v12.7M15 6.8v12.7"/></svg>Cobertura nacional</div>
 <div class="covwrap"><div id="covmap"></div><div class="covbar" id="covbar"></div></div></div></div>`}

function chart(){const d=last7().filter(x=>x.n>0).length?last7().filter(x=>x.n>0):last7().slice(-1);const mx=Math.max(2,...d.map(x=>x.n));const ticks=[mx,mx*.75,mx/2,mx/4,0].map(v=>Math.round(v*10)/10);
 return `<div style="display:flex;margin-top:18px;height:340px;position:relative"><div style="display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;padding-right:14px;color:#8A909C;font-size:15px;height:300px">${ticks.map(t=>`<span>${t}</span>`).join("")}</div>
 <div style="flex:1;position:relative;height:300px;border-bottom:1px solid #EDEFF3"><div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between">${ticks.map(()=>'<i style="border-top:1px dashed #E7E9EE;display:block"></i>').join("")}</div>
 <div style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;gap:14px">${d.map(x=>`<div style="flex:0 1 ${d.length===1?"88%":"40px"};height:${x.n/mx*100}%;background:#E31E2D;border-radius:14px 14px 0 0"></div>`).join("")}</div>
 <div style="position:absolute;left:0;right:0;top:308px;display:flex;justify-content:center;gap:14px;color:#8A909C;font-size:15px">${d.map(x=>`<span style="flex:0 1 ${d.length===1?"88%":"40px"};text-align:center">${x.f}</span>`).join("")}</div></div></div>`}
function last7(){const o=[];for(let i=6;i>=0;i--){const d=new Date(Date.now()-i*86400000);o.push({l:["D","L","M","M","J","V","S"][d.getDay()],f:String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),n:db.records.filter(r=>new Date(r.fecha).toDateString()===d.toDateString()).length})}return o}

/* ---- Equipo / mapa ---- */
function vEquipo(){const s=stats();const live=!!db.collector.sharing;
 view.innerHTML=`<div class="mapwrap"><div id="map"></div></div>
 <div class="krow">
  <div class="kcard"><div class="ico">${ico("recol",20,1.8)}</div><b>${db.users.filter(u=>u.activo).length}</b><span class="kcard-l">Recolectores activos</span></div>
  <div class="kcard"><div class="ico">${ico("monitor",20,1.8)}</div><b>${live?1:0}</b><span class="kcard-l">Compartiendo ubicación</span></div>
  <div class="kcard"><div class="ico">${ico("firmas",20,1.8)}</div><b>${s.total}</b><span class="kcard-l">Registros</span></div>
  <div class="kcard dark"><div class="ico">${ico("terr",20,1.8,"#fff")}</div><b>${new Set(db.records.map(r=>(r.municipio||"")+"|"+(r.sector||""))).size}</b><span class="kcard-l">Sectores cubiertos</span></div>
  <div class="kcard"><div class="ico">${ico("dash",20,1.8)}</div><b>${db.users.filter(u=>u.activo).length?Math.round(s.hoy/Math.max(1,db.users.filter(u=>u.activo).length)*10)/10:0}</b><span class="kcard-l">Promedio por recolector</span></div>
  <div class="kcard amber"><div class="ico">${ico("audit",20,"1.8","#B4640B")}</div><b style="color:#B4640B">${s.pen}</b><span class="kcard-l">Por validar</span></div>
 </div>
 <button class="fab ${live?"live":""}" id="shareLoc" title="${live?"Dejar de compartir ubicación":"Compartir mi ubicación en vivo"}" aria-label="Ubicación en vivo"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.500-5.700-6.500-10.800a6.500 6.500 0 0 1 13 0C18.500 15.300 12 21 12 21z"/><circle cx="12" cy="10.200" r="2.400"/></svg></button>`;
 map=L.map("map",{zoomControl:true}).setView([18.4861,-69.9312],11);
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap",maxZoom:19}).addTo(map);
 db.records.filter(r=>r.lat).forEach(r=>L.circleMarker([r.lat,r.lng],{radius:9,color:"#10131A",fillColor:r.estado==="verificado"?"#0B9D6B":"#E8A317",fillOpacity:.9}).addTo(map).bindPopup(`<b>${esc(r.nombre)}</b><br>${esc(r.sector)} · Circ. ${esc(r.circ)}`));
 if(live&&db.collector.pos){const u=me();const img=u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:`<span style="font-size:20px;font-weight:600;color:#fff">${esc((u.nombre||"?")[0].toUpperCase())}</span>`;
 L.marker(db.collector.pos,{icon:L.divIcon({className:"",iconSize:[52,52],iconAnchor:[26,26],html:`<div class="pinme">${img}</div>`})}).addTo(map).bindPopup("<b>Ubicación en vivo compartida</b>")}
 $("#shareLoc").onclick=()=>{if(db.collector.sharing){clearInterval(window._gps);db.collector.sharing=false;save();toast("Ubicación en vivo desactivada");return vEquipo()}
  if(!navigator.geolocation)return toast("Geolocalización no disponible");
  navigator.geolocation.getCurrentPosition(p=>{db.collector.sharing=true;db.collector.pos=[p.coords.latitude,p.coords.longitude];save();toast("Compartiendo ubicación en vivo");vEquipo();
   window._gps=setInterval(()=>navigator.geolocation.getCurrentPosition(q=>{db.collector.pos=[q.coords.latitude,q.coords.longitude];save()}),15000)},()=>toast("No se pudo obtener la ubicación"))}}
/* ---- Firmas ---- */
function vFirmas(){view.innerHTML=`<div class="pad"><div class="firmas">${db.records.map(r=>`<div class="fcard" data-id="${r.id}"><div class="fsig">${r.firma?`<img src="${r.firma}">`:`<svg viewBox="0 0 120 50" width="110"><path d="M5 35c15-30 20 5 30-15s15 30 30 0 20-10 30 5" fill="none" stroke="#10131A" stroke-width="2"/></svg>`}</div><b>${esc(r.nombre)}</b><small style="display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%"><span style="color:#3A3F4A;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(recName(r))}</span><span>${new Date(r.fecha).toLocaleDateString("es-DO")}</span></small></div>`).join("")}</div></div>`;
 $$(".fcard").forEach(c=>c.onclick=()=>detalle(c.dataset.id))}
function detalle(id){const r=db.records.find(x=>x.id===id);
 const lbl=(t,svg)=>`<div style="display:flex;gap:8px;align-items:center;font-weight:700;letter-spacing:.06em;color:#3A3F4A;font-size:14px;margin:0 0 10px">${svg}${t}</div>`;
 const IMG='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3A3F4A" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>';
 const box=(t,k)=>`<div>${lbl(t,IMG)}<div style="border:1px solid #E7E9EE;border-radius:20px;min-height:130px;display:grid;place-items:center;color:#9AA0AC;font-size:16px;background:#fff;padding:8px;overflow:hidden">${r[k]?`<img src="${r[k]}" style="max-width:100%;max-height:200px;background:#fff;border-radius:10px">`:"No disponible"}</div></div>`;
 const dato=(k,v)=>`<div class="kv"><span>${k}</span><b style="text-align:right">${esc(v||"—")}</b></div>`;
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:93vh;display:flex;flex-direction:column;padding-bottom:0">
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3"><div class="sheet-title"><h2 style="font-size:18px;text-transform:uppercase">${esc(r.nombre)}</h2><p>${esc(r.cedula)}</p></div><button class="iconbtn" data-x>✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:16px 0">
  ${lbl("FIRMA MANUSCRITA",'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3A3F4A" stroke-width="1.7"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>')}
  <div style="border:1px solid #E7E9EE;border-radius:22px;height:190px;display:grid;place-items:center;background:#fff">${r.firma?`<img src="${r.firma}" style="max-width:92%;max-height:92%;background:#fff">`:`<span style="color:#9AA0AC">No disponible</span>`}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px">${box("FRONTAL","imgFRONTAL")}${box("TRASERA","imgTRASERA")}</div>
  <div class="card" style="margin-top:18px;padding:6px 16px">${lbl("DATOS DEL FIRMANTE","")}${dato("Nombre",r.nombre)}${dato("Cédula",r.cedula)}${dato("Nacimiento",r.nac)}${dato("Sexo",r.sexo)}${dato("Lugar de nacimiento",r.lugar)}${dato("WhatsApp",r.whatsapp)}${dato("Dirección",r.direccion)}</div>
  <div class="card" style="margin-top:14px;padding:6px 16px">${lbl("DATOS ELECTORALES","")}${dato("Municipio",r.municipio)}${r.distrito?dato("Distrito municipal",r.distrito):""}${dato("Sector",r.sector)}${dato("Circunscripción",r.circ)}${dato("Estado",r.estado)}${dato("Reclutador",recName(r))}${dato("Fecha y hora",new Date(r.fecha).toLocaleString("es-DO"))}</div></div>
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="dpdf" style="margin:0;display:flex;align-items:center;justify-content:center;gap:10px"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.500 10.500L12 15l4.500-4.500"/><path d="M5 19h14"/></svg> Descargar PDF</button></div></section>`,(w)=>{$("#dpdf",w).onclick=()=>pdfExpediente(r)})}

/* ---- PDF de expediente: profesional, evidencia ---- */
function pdfExpediente(r){if(!window.jspdf)return toast("Cargando exportador, intente de nuevo");const {jsPDF}=window.jspdf;const d=new jsPDF({unit:"mm",format:"a4"});const W=210,M=14;
 d.setFillColor(16,19,26);d.rect(0,0,W,26,"F");d.setTextColor(255);d.setFont("helvetica","bold");d.setFontSize(17);d.text(db.org||"FirmAbal",M,12);d.setFont("helvetica","normal");d.setFontSize(9);d.text("Expediente de afiliación · Evidencia de registro",M,19);
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
 view.innerHTML=`<div class="pad"><div class="tgrid">${Object.entries(g).map(([k,n])=>`<div class="item terr-item" data-terr="${esc(k)}" style="gap:14px;padding:16px"><div style="flex:1;min-width:0"><b style="font-size:16px;overflow-wrap:anywhere">${esc(k)}</b><small>${n} afiliado(s)</small></div><span class="pill ok">${n}</span></div>`).join("")||"<p class='sub'>Sin datos aún.</p>"}</div></div>`}

function terrDetalle(k){
 const rs=db.records.filter(r=>((r.municipio+" · "+r.sector+" · Circ. "+r.circ)===k));
 const tot=rs.length,val=rs.filter(r=>r.estado==="verificado").length,pen=rs.filter(r=>r.estado==="pendiente").length,dup=rs.filter(r=>r.estado==="duplicado").length;
 const recs={};rs.forEach(r=>{const n=recName(r);recs[n]=(recs[n]||0)+1});
 const wa=rs.filter(r=>r.whatsapp).length;
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-width:520px;max-height:90vh;overflow-y:auto"><div class="sheet-head"><div class="sheet-title"><h2 style="font-size:18px">${esc(k)}</h2><p>Detalle del territorio</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <div class="mkpis" style="margin-top:14px"><div class="stat dark"><small>Registros</small><b>${tot}</b></div><div class="stat"><small>Validados</small><b>${val}</b></div><div class="stat amber"><small>Pendientes</small><b>${pen}</b></div></div>
 <div class="card" style="margin-top:14px"><div class="kv"><span>Cobertura validada</span><b>${tot?Math.round(val/tot*100):0}%</b></div><div class="kv"><span>Duplicados</span><b>${dup}</b></div><div class="kv"><span>Con WhatsApp</span><b>${wa} de ${tot}</b></div><div class="kv"><span>Reclutadores activos</span><b>${Object.keys(recs).length}</b></div></div>
 <div class="card" style="margin-top:12px"><b style="font-size:16px">Aportes por reclutador</b>${Object.entries(recs).map(([n,c])=>`<div class="kv"><span>${esc(n)}</span><b>${c}</b></div>`).join("")||"<p class='sub'>Sin datos.</p>"}</div>
 <button class="btn btn-dark" id="tver" style="margin-top:14px">Ver registros de este territorio</button></section>`,(w2,close2)=>{$("#tver",w2).onclick=()=>{close2();go("reg")}})}

document.addEventListener("click",e=>{const t=e.target.closest(".terr-item");if(t&&t.dataset.terr)terrDetalle(t.dataset.terr)});

const avt=(u,s=56)=>`<div style="width:${s}px;height:${s}px;border-radius:50%;background:#10131A;color:#fff;display:grid;place-items:center;font-size:${Math.round(s*.4)}px;font-weight:600;overflow:hidden;flex:0 0 auto">${u.foto?`<img src="${u.foto}" style="width:100%;height:100%;object-fit:cover">`:esc((u.nombre||"?")[0].toUpperCase())}</div>`;
const nReg=u=>db.records.filter(r=>r.rec===u.id||(u.id==="U-1"&&r.rec==="REC-001")).length;
function vRecol(){view.innerHTML=`<div class="pad"><div class="agrid">${db.users.map(u=>`<div class="card" data-uid="${u.id}" style="margin:0;display:flex;gap:14px;align-items:center;cursor:pointer;padding:16px;min-width:0">${avt(u)}<div style="min-width:0;flex:1"><b style="font-size:16px;overflow-wrap:anywhere">${esc(u.nombre)}</b><div style="color:#8A909C;font-size:13px;margin-top:3px">${ROLES[u.rol].n} · ${nReg(u)} firmas</div><span class="chipx" style="margin-top:8px;display:inline-block;${u.activo?"background:#E3F7EE;border-color:#BFEBD6;color:#0A7A52":"background:#FCE9E8;border-color:#F6CFCC;color:#B3261E"}">${u.activo?"Activo":"Suspendido"}</span></div></div>`).join("")}</div></div>
 <button class="fab" id="fabAdd" aria-label="Agregar recolector"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>`;
 $$("[data-uid]").forEach(c=>c.onclick=()=>reclutador(c.dataset.uid));$("#fabAdd").onclick=nuevoReclutador}
function munisFor(p,sel){const s=$("#nm");if(!s)return;s.innerHTML='<option value="">Seleccione</option>'+(MUNIS[p]||[]).map(m=>`<option ${m===sel?"selected":""}>${m}</option>`).join("")}
function nuevoReclutador(){dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:92vh;overflow-y:auto"><div class="sheet-head"><div class="sheet-title"><h2>Nuevo recolector</h2><p>Todos los campos son obligatorios</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <label>Nombre *</label><input type="text" id="nn" autocomplete="off"><label>WhatsApp *</label><input type="tel" id="nw" inputmode="tel" placeholder="809-000-0000"><label>Cédula de identidad *</label><input type="text" id="nc" inputmode="numeric" maxlength="13" placeholder="000-0000000-0"><label>Provincia *</label><select id="np"><option value="">Seleccione</option>${PROVS.map(p=>`<option>${p}</option>`).join("")}</select><label>Municipio *</label><select id="nm"><option value="">Seleccione</option></select><label>Rol *</label><select id="nr"><option value="">Seleccione</option>${Object.entries(ROLES).map(([k,r])=>`<option value="${k}">${r.n}</option>`).join("")}</select>
 <button class="btn btn-dark" id="ns" style="margin-top:18px">Agregar recolector</button></section>`,(w,close)=>{munisFor($("#np",w).value);$("#np",w).onchange=e=>munisFor(e.target.value);
  const fmtC=s=>{const d=s.replace(/\D/g,"").slice(0,11);return d.length>10?d.slice(0,3)+"-"+d.slice(3,10)+"-"+d.slice(10):d.length>3?d.slice(0,3)+"-"+d.slice(3):d};
  $("#nc",w).oninput=e=>{e.target.value=fmtC(e.target.value)};
  $("#ns",w).onclick=()=>{const n=$("#nn",w).value.trim(),wa=$("#nw",w).value.replace(/\D/g,""),ce=$("#nc",w).value.replace(/\D/g,""),pv=$("#np",w).value,mn=$("#nm",w).value,rl=$("#nr",w).value;
   const bad=[["nn",!n],["nw",wa.length<10],["nc",ce.length!==11],["np",!pv],["nm",!mn],["nr",!rl]];
   bad.forEach(([id,e])=>{$("#"+id,w).style.borderColor=e?"#B3261E":"";$("#"+id,w).style.background=e?"#FFF1F0":""});
   if(!n)return toast("Escriba el nombre");if(wa.length<10)return toast("WhatsApp inválido (10 dígitos)");if(ce.length!==11)return toast("La cédula debe tener 11 dígitos");if(!pv)return toast("Seleccione la provincia");if(!mn)return toast("Seleccione el municipio");if(!rl)return toast("Seleccione el rol");
   if(db.users.some(u=>String(u.cedula||"").replace(/\D/g,"")===ce))return toast("Ya existe un recolector con esa cédula");
   const id="U-"+(db.users.length+1);db.users.push({id,nombre:n,rol:rl,whatsapp:wa,cedula:ce.slice(0,3)+"-"+ce.slice(3,10)+"-"+ce.slice(10),provincia:pv,municipio:mn,nuevo:true,activo:true});logA("Cambio de permisos / config",id,"Alta de recolector "+n);toast("Recolector agregado");close();setTimeout(vRecol,420)}})}
function reclutador(id){const u=db.users.find(x=>x.id===id);const n=nReg(u),hoy=db.records.filter(r=>(r.rec===u.id||(u.id==="U-1"&&r.rec==="REC-001"))&&isToday(r.fecha)).length,val=db.records.filter(r=>(r.rec===u.id||(u.id==="U-1"&&r.rec==="REC-001"))&&r.estado==="verificado").length,pct=Math.min(100,Math.round(n/Math.max(1,db.meta)*100));
 const lk=location.href.split("?")[0].split("#")[0]+"?login="+u.id;
 dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61;max-height:92vh;overflow-y:auto"><div class="sheet-head"><div class="sheet-title"><h2 style="font-size:19px">${esc(u.nombre)}</h2><p>${esc(u.municipio||"—")}${u.provincia?", "+esc(u.provincia):""}</p></div><button class="iconbtn" data-x>${XI}</button></div>
 <div class="grid" style="margin-top:14px;grid-template-columns:repeat(3,minmax(0,1fr))"><div class="stat dark"><small>Firmas</small><b>${n}</b></div><div class="stat"><small>Hoy</small><b>${hoy}</b></div><div class="stat"><small>Validadas</small><b>${val}</b></div></div>
 <div class="card" style="margin-top:12px;padding:16px"><div class="row-between"><span>Rendimiento frente a la meta (${db.meta})</span><b style="color:#10131A">${pct}%</b></div><div class="prog"><i style="width:${pct}%"></i></div></div>
 <div class="hgrid" style="margin-top:6px"><div><label>Rol</label><select id="ur" ${me().rol==="administrador"?"":"disabled"}>${Object.entries(ROLES).map(([k,r])=>`<option value="${k}" ${u.rol===k?"selected":""}>${r.n}</option>`).join("")}</select></div><div><label>Estado</label><select id="ue" ${me().rol==="administrador"&&u.id!==db.me?"":"disabled"}><option value="1" ${u.activo?"selected":""}>Activo</option><option value="0" ${u.activo?"":"selected"}>Suspendido</option></select></div></div>
 <p class="pin-note" style="margin:6px 2px 0">Envíele su enlace de acceso por WhatsApp o compártalo con el código QR.</p>
 <div class="two" style="margin-top:14px"><button class="btn btn-wa" id="uw">${WAI(22,"#fff")} WhatsApp</button><button class="btn btn-dark" id="uq">${ico("captura",20,1.8,"#fff")} Código QR</button></div></section>`,(w,close)=>{
  $("#ur",w).onchange=e=>{u.rol=e.target.value;logA("Cambio de permisos / config",u.id,"Permisos rol "+u.rol+" para "+u.nombre);toast("Rol actualizado");vRecol()};
  $("#ue",w).onchange=e=>{u.activo=e.target.value==="1";logA("Cambio de permisos / config",u.id,(u.activo?"Activación de ":"Suspensión de ")+u.nombre);toast(u.activo?"Acceso activado":"Acceso suspendido");vRecol()};
  $("#uw",w).onclick=()=>window.open("https://wa.me/"+(String(u.whatsapp).length===10?"1":"")+String(u.whatsapp).replace(/\D/g,"")+"?text="+encodeURIComponent("Bienvenido a FirmAbal, "+u.nombre+". Acceda a la plataforma con su enlace personalizado: "+lk),"_blank");
  $("#uq",w).onclick=()=>{close();setTimeout(()=>qrModal(lk,"Escanee para acceder a la plataforma"),430)}})}
function qrModal(url,sub){dyn(`<div class="dmask sheet-mask" style="z-index:60"></div><section class="dsheet sheet" style="z-index:61"><div class="sheet-head"><div class="sheet-ico">${ico("captura",22,1.8,"#fff")}</div><div class="sheet-title"><h2>Código QR</h2><p>${sub||"Escanee para autorregistrarse"}</p></div><button class="iconbtn" data-x>${XI}</button></div><div id="qq" style="display:grid;place-items:center;padding:22px 0"></div></section>`,w=>{try{new QRCode($("#qq",w),{text:url,width:230,height:230,colorDark:"#10131A",colorLight:"#ffffff"})}catch{$("#qq",w).textContent="No se pudo generar el QR sin conexión."}})}
/* ---- Exportación ---- */
function vExport(){view.innerHTML=`<div class="pad"><div class="agrid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))"><button class="btn btn-dark" id="e1" style="margin:0;display:flex;align-items:center;justify-content:center;gap:10px">${ico("export",22,1.8,"#fff")} PDF de todos los expedientes</button><button class="btn btn-light" id="e2" style="margin:0;border:1px solid #E1E4EA;display:flex;align-items:center;justify-content:center;gap:10px">${ico("export",22,1.8)} CSV de registros</button></div></div>`;$("#e1").onclick=exportPdf;$("#e2").onclick=exportCsv}
function vConfig(){const u=me();const can=db.users.length&&ROLES[u.rol].p.includes("usuarios");
 const avatar=u.foto?`<img src="${u.foto}">`:esc((u.nombre||"?")[0].toUpperCase());
 view.innerHTML=`<div class="pad"><div class="card" style="margin-top:0"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><circle cx="10" cy="8" r="3.5"/><path d="M3 20c0-3.5 3-6 7-6"/><circle cx="18" cy="16" r="2.4"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Mi perfil</h2><p>Nombre, foto y datos del reclutador</p></div></div>
 <div class="avwrap"><div class="avatar" id="av">${avatar}</div><label class="avcam"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="1.9"><path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg><input type="file" accept="image/*" id="fFoto" hidden></label></div>
 <div class="fgrid2"><div><label>Nombre</label><input type="text" id="pn" value="${esc(u.nombre)}"><div><label>Organización</label><input type="text" id="po" value="${esc(db.org)}" placeholder="Nombre de su organización" ${me().rol==="administrador"?"":"disabled"}></div></div>
 <div><label>Cédula de identidad</label><input type="text" id="pc" inputmode="numeric" maxlength="13" placeholder="000-0000000-0" value="${esc(u.cedula||"")}"></div>
 <div><label>WhatsApp del reclutador</label><div style="position:relative"><span style="position:absolute;left:14px;top:50%;transform:translateY(-50%)">${WAI(22,"#25D366")}</span><input type="tel" id="pw" inputmode="tel" placeholder="809-000-0000" value="${esc(u.whatsapp||"")}" style="padding-left:48px"></div></div>
 <div><label>Provincia</label><select id="pp"><option value="">Seleccione</option>${PROVS.map(p=>`<option ${u.provincia===p?"selected":""}>${p}</option>`).join("")}</select></div>
 <div><label>Municipio</label><select id="pm"><option value="">Seleccione</option>${(MUNIS[u.provincia]||[]).map(m=>`<option ${m===u.municipio?"selected":""}>${m}</option>`).join("")}</select></div></div>
 <button class="btn btn-dark" id="ps">Guardar perfil</button></div>
 <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.7"><path d="M12 3l8 3v6c0 4.5-3.200 8-8 9-4.800-1-8-4.500-8-9V6l8-3z"/></svg></div><div class="sheet-title"><h2 style="font-size:20px">Roles y permisos</h2></div></div>
 ${Object.entries(ROLES).filter(([k])=>k===u.rol).map(([k,r])=>`<div class="role ${u.rol===k?"on":""}"><h3>${r.n}${u.rol===k?"<em>Actual</em>":""}</h3><p>${r.d}</p>${r.p.map(t=>`<span class="tag">${t}</span>`).join("")}</div>`).join("")}</div>
 <button class="btn btn-red" id="cr">Borrar datos locales</button></div>`;
 $("#fFoto").onchange=e=>{const f=e.target.files[0];if(!f)return;const x=new FileReader();x.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d"),k=Math.max(256/im.width,256/im.height);g.drawImage(im,(256-im.width*k)/2,(256-im.height*k)/2,im.width*k,im.height*k);u.foto=c.toDataURL("image/jpeg",.8);save();$("#av").innerHTML=`<img src="${u.foto}">`;toast("Foto actualizada")};im.src=x.result};x.readAsDataURL(f)};
 $("#pp").onchange=e=>{$("#pm").innerHTML='<option value="">Seleccione</option>'+(MUNIS[e.target.value]||[]).map(m=>`<option>${m}</option>`).join("")};$("#ps").onclick=()=>{const ced=($("#pc")?$("#pc").value:"").replace(/\D/g,"");if(ced&&ced.length!==11)return toast("La cédula debe tener 11 dígitos");if(ced){if(db.users.some(x=>x.id!==u.id&&String(x.cedula||"").replace(/\D/g,"")===ced))return toast("Esa cédula ya está registrada");u.cedula=ced.slice(0,3)+"-"+ced.slice(3,10)+"-"+ced.slice(10)}if($("#po")&&$("#po").value.trim())db.org=$("#po").value.trim();const wa=$("#pw").value.replace(/\D/g,"");if($("#pw").value&&wa.length<10)return toast("WhatsApp inválido (10 dígitos)");u.nombre=$("#pn").value.trim()||u.nombre;u.whatsapp=wa;u.provincia=$("#pp").value;u.municipio=$("#pm").value.trim();db.collector.name=u.nombre;logA("Cambio de permisos / config",u.id,"Perfil de "+u.nombre);toast("Perfil guardado");vConfig()};
 $$(".urol").forEach(s=>s.onchange=()=>{const x=db.users.find(y=>y.id===s.dataset.uid);x.rol=s.value;logA("Cambio de permisos / config",x.id,"Permisos rol "+x.rol+" para "+x.nombre);toast("Rol actualizado");vConfig()});
 $$(".utog").forEach(b=>b.onclick=()=>{const x=db.users.find(y=>y.id===b.dataset.uid);x.activo=!x.activo;logA("Cambio de permisos / config",x.id,(x.activo?"Activación de ":"Suspensión de ")+x.nombre);toast(x.activo?"Acceso activado":"Acceso suspendido");vConfig()});
 if($("#addU"))$("#addU").onclick=()=>{const n=prompt("Nombre del reclutador:");if(!n||!n.trim())return;const id="U-"+(db.users.length+1);db.users.push({id,nombre:n.trim(),rol:"recolector",whatsapp:"",provincia:"",municipio:"",activo:true,nuevo:true});logA("Cambio de permisos / config",id,"Alta de reclutador "+n.trim());toast("Reclutador agregado");vConfig()};
 $("#cr").onclick=()=>{if(confirm("¿Borrar todos los registros locales?")){localStorage.removeItem(KEY);location.reload()}}}

/* ---- Registros (buscador + filtro + tarjetas) ---- */
let fQ="",fE="",fR="";
function vReg(){view.innerHTML=`<div class="pad"><div class="card" style="margin-top:0;padding:16px"><div class="filters"><div style="position:relative"><span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#8A909C">${SRCH}</span><input type="text" id="q" placeholder="Buscar por nombre, apellido, cédula…" value="${esc(fQ)}" style="padding-left:50px;font-size:17px;border-radius:16px;height:56px"></div>
 <select id="est" style="height:56px;font-size:17px;border-radius:16px;color:#6B7280"><option value="">Estado</option><option value="verificado">Validado</option><option value="pendiente">Pendiente</option><option value="duplicado">Duplicado</option></select><select id="rec" style="height:56px;font-size:17px;border-radius:16px;color:#6B7280"><option value="">Reclutador</option>${db.users.map(u=>`<option value="${u.id}">${esc(u.nombre)}</option>`).join("")}</select></div></div>
 <div class="rgrid" id="lista" style="margin-top:16px"></div></div>`;
 $("#est").value=fE;if($("#rec"))$("#rec").value=fR;const draw=()=>{fQ=$("#q").value;fE=$("#est").value;fR=$("#rec")?$("#rec").value:"";const q=fQ.toLowerCase().replace(/-/g,"");
  const L=db.records.filter(r=>(!fE||r.estado===fE)&&(!fR||String(r.rec)===fR||recName(r)===((db.users.find(u=>u.id===fR)||{}).nombre))&&(!q||(r.nombre+" "+r.cedula).toLowerCase().replace(/-/g,"").includes(q))).slice().reverse();
  $("#lista").innerHTML=L.map(r=>{const v=r.estado==="verificado",d=r.estado==="duplicado";return `<div class="card" data-id="${r.id}" style="margin:0;cursor:pointer;padding:18px;min-width:0">
   <div style="display:flex;justify-content:space-between;gap:8px"><div style="min-width:0"><b style="font-size:16px;text-transform:uppercase;font-weight:500;overflow-wrap:anywhere">${esc(r.nombre)}</b><div style="color:#6B7280;font-size:14px;margin-top:5px">${esc(recName(r))}</div></div>
   <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><span class="chipx" style="background:${v?"#E3F7EE":d?"#FCE9E8":"#FDF3DD"};border-color:${v?"#BFEBD6":d?"#F6CFCC":"#EEDDB0"};color:${v?"#0A7A52":d?"#B3261E":"#B4640B"}">${v?"Validado":d?"Duplicado":"Pendiente"}</span></div></div>
   <div style="display:flex;justify-content:space-between;gap:8px;color:#8A909C;font-size:13px;margin-top:12px;text-transform:uppercase"><span>${esc(r.municipio)} · Circ. ${esc(r.circ)}</span><span style="text-transform:none;white-space:nowrap">${new Date(r.fecha).toLocaleDateString("es-DO")}</span></div>
   <a href="https://wa.me/1${String(r.whatsapp).replace(/\D/g,"")}" target="_blank" data-wa style="display:flex;gap:10px;align-items:center;color:#059B69;font-size:15px;margin-top:12px;text-decoration:none;font-weight:500">${WAI(22,"#25D366")}Contactar por WhatsApp</a></div>`}).join("")||"<p class='sub'>Sin resultados.</p>";
  $$("#lista [data-id]").forEach(c=>c.onclick=e=>{if(e.target.closest("[data-wa]"))return;ficha(c.dataset.id)})};
 $("#q").oninput=draw;$("#est").onchange=draw;$("#rec").onchange=draw;draw()}
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
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3">
 <div class="sheet-title"><h2 style="font-size:18px;text-transform:uppercase">${esc(r.nombre)}</h2><div style="display:flex;gap:8px;margin-top:6px"><span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:4px 12px;font-size:13px;color:#3A3F4A">${tipo}</span><span style="background:${val?"#E3F7EE":r.estado==="duplicado"?"#FCE9E8":"#FDF3DD"};border:1px solid ${val?"#BFEBD6":"#EEDDB0"};border-radius:99px;padding:4px 12px;font-size:13px;color:${val?"#0A7A52":r.estado==="duplicado"?"#B3261E":"#B4640B"}">${val?"Validado":r.estado==="duplicado"?"Duplicado":"Pendiente"}</span></div></div><button class="iconbtn" data-x>✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:4px 0 20px">
 ${fila(USR0,"Nombre completo",esc(r.nombre).toUpperCase())}${fila(USR0,"Cédula",esc(r.cedula))}${fila(TEL,"WhatsApp",esc(r.whatsapp))}${fila(CASA,"Dirección",esc(r.direccion).toUpperCase())}${fila(PIN,"Municipio",esc(r.municipio).toUpperCase())}${r.distrito&&r.distrito.trim()?fila(PIN,"Distrito municipal",esc(r.distrito).toUpperCase()):""}${fila(PIN,"Sector",esc(r.sector).toUpperCase())}
 ${fila(PIN,"Circunscripción","Circunscripción "+esc(r.circ),'<button id="edCirc" style="border:0;background:none;font-size:15px;color:#10131A;cursor:pointer;font-family:inherit"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L18.500 9.500a2.100 2.100 0 0 0 0-3l-1-1a2.100 2.100 0 0 0-3 0L4 16z"/><path d="M13 7l4 4"/></svg> Editar</button>')}
 ${fila(CAL,"Fecha y hora",new Date(r.fecha).toLocaleString("es-DO"))}${fila(USR,"Tipo de registro",tipo)}${fila(USR,"Recolector responsable",esc(db.collector.name))}
 <div style="display:flex;gap:12px;align-items:center;color:#9AA0AC;font-size:14px;margin:18px 0 10px"><svg viewBox="0 0 24 24" width="22" height="24" fill="none" stroke="#8A909C" stroke-width="1.6"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>FIRMA</div>
 <div style="border:1px solid #E7E9EE;border-radius:24px;height:190px;display:grid;place-items:center;background:#FAFBFC">${r.firma?`<img src="${r.firma}" style="max-width:90%;max-height:90%">`:'<span style="color:#9AA0AC;font-size:16px">No disponible</span>'}</div></div>
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="fpdf" style="margin:0;display:flex;align-items:center;justify-content:center;gap:10px"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.500 10.500L12 15l4.500-4.500"/><path d="M5 19h14"/></svg> Descargar PDF</button></div></section>`,(w,close)=>{
 $("#edCirc",w).onclick=()=>{close();setTimeout(()=>{dyn(`<div class="dmask sheet-mask" style="z-index:62"></div><section class="dsheet sheet" style="z-index:63;max-width:420px"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10131A" stroke-width="1.7"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/></svg></div><div class="sheet-title"><h2>Circunscripción</h2><p>Seleccione el número de la circunscripción electoral</p></div><button class="iconbtn" data-x>${XI}</button></div>
  <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:6px 0 10px">${[1,2,3,4,5,6,7].map(n=>`<button class="cbtn ${String(n)===String(r.circ)?"on":""}" data-n="${n}" style="border:1px solid ${String(n)===String(r.circ)?"#10131A":"#E1E4EA"};background:${String(n)===String(r.circ)?"#10131A":"#fff"};color:${String(n)===String(r.circ)?"#fff":"#3A3F4A"};border-radius:16px;padding:14px 0;font-size:18px;font-weight:600;cursor:pointer;font-family:inherit">${n}</button>`).join("")}</div>
  <button class="btn btn-dark" id="cs" style="width:100%;padding:15px">Guardar</button></section>`,(w2,close2)=>{let sel=String(r.circ);$$(".cbtn",w2).forEach(b=>b.onclick=()=>{sel=b.dataset.n;$$(".cbtn",w2).forEach(x=>{x.classList.toggle("on",x===b);x.style.borderColor=x===b?"#10131A":"#E1E4EA";x.style.background=x===b?"#10131A":"#fff";x.style.color=x===b?"#fff":"#3A3F4A"})});$("#cs",w2).onclick=()=>{if(!sel)return toast("Seleccione la circunscripción");r.circ=sel;logA("Cambio de circunscripción",r.id,"Circunscripción "+sel+" para cédula "+r.cedula);save();close2();toast("Circunscripción actualizada");setTimeout(()=>{ficha(id);if(cur==="reg")vReg()},450)}})},430)};
 $("#fpdf",w).onclick=()=>pdfExpediente(r)})}

/* ---- Admin / auditoría ---- */
function vAdmin(){const A=db.audit;const ok=A.filter(x=>x.ok).length;
 view.innerHTML=`<div class="pad">
 <div class="kgrid3" style="margin-bottom:14px"><div class="stat dark"><small>Eventos</small><b>${A.length}</b></div><div class="stat"><small>Exitosos</small><b>${ok}</b></div><div class="stat red"><small>Fallidos</small><b>${A.length-ok}</b></div></div>
 <div class="card" style="padding:0;overflow:hidden"><div class="scrollx"><table class="atable"><thead><tr><th>Usuario</th><th>Acción</th><th>Registro</th><th>Detalles</th><th>Resultado</th><th>Fecha/Hora</th></tr></thead><tbody>
 ${A.map(x=>`<tr><td><b>${esc(x.u)}</b></td><td>${esc(x.a)}</td><td class="mono">${esc(x.reg)}</td><td>${esc(x.det)}</td><td style="color:${x.ok?"#059B69":"#B3261E"};font-weight:600">${x.ok?"Éxito":"Fallo"}</td><td style="white-space:nowrap">${new Date(x.t).toLocaleString("es-DO")}</td></tr>`).join("")||'<tr><td colspan="6" style="text-align:center;color:#8A909C">Sin eventos.</td></tr>'}</tbody></table></div></div>
 <div class="card"><b style="font-size:18px">Revisión de firmas</b><p class="sub" style="font-size:15px;margin:6px 0 0">Valide cada registro o márquelo como duplicado.</p><div class="revgrid">
 ${db.records.map(r=>`<div class="item" style="margin-top:10px"><div style="min-width:0"><b style="font-size:15px">${esc(r.nombre)}</b><small>${esc(r.cedula)} · ${r.estado}</small></div><div style="display:flex;gap:6px"><button class="btn btn-light sm" data-a="ok" data-id="${r.id}" aria-label="Validar" title="Validar"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></button><button class="btn btn-light sm" data-a="dup" data-id="${r.id}" aria-label="Marcar duplicado" title="Marcar duplicado"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8.500" y="8.500" width="11" height="11" rx="2.500"/><path d="M15.500 8.500V6.500a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/></svg></button></div></div>`).join("")}</div>
</div> <div class="two" style="margin-top:14px"><button class="btn btn-dark" id="btnPdf">Exportar expedientes PDF</button><button class="btn btn-light" id="btnCsv" style="border:1px solid #E1E4EA">Exportar bitácora CSV</button></div></div>`;
 $$("[data-a]").forEach(b=>b.onclick=()=>{const r=db.records.find(x=>x.id===b.dataset.id);r.estado=b.dataset.a==="ok"?"verificado":"duplicado";logA("Cambio de estado",r.id,r.cedula+" → "+r.estado);toast("Registro actualizado");vAdmin()});
 $("#btnPdf").onclick=exportPdf;$("#btnCsv").onclick=()=>{const csv=["usuario,accion,registro,detalles,resultado,fecha"].concat(A.map(x=>[x.u,x.a,x.reg,x.det,x.ok?"Exito":"Fallo",new Date(x.t).toISOString()].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(","))).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="firmabal-auditoria.csv";a.click()}}
function exportCsv(){const h=["nombre","cedula","nac","sexo","lugar","whatsapp","municipio","distrito","sector","circ","estado"];
 const csv=[h.join(",")].concat(db.records.map(r=>h.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(","))).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="firmabal-registros.csv";a.click()}
function exportPdf(){if(!window.jspdf)return toast("Cargando exportador, intente de nuevo");const {jsPDF}=window.jspdf;const doc=new jsPDF();
 db.records.forEach((r,i)=>{if(i)doc.addPage();doc.setFontSize(18);doc.text((db.org||"FirmAbal")+" · Evidencia de registro",15,20);doc.setFontSize(12);
  [["Nombre",r.nombre],["Cédula",r.cedula],["Nacimiento",r.nac],["Sexo",r.sexo],["Lugar",r.lugar],["WhatsApp",r.whatsapp],["Direccion",r.direccion||"-"],["Municipio",r.municipio],["Distrito",r.distrito],["Sector",r.sector],["Circunscripción",r.circ],["Estado",r.estado],["Recolector",r.rec],["Fecha",new Date(r.fecha).toLocaleString()]].forEach((p,j)=>doc.text(p[0]+": "+p[1],15,40+j*10));
  if(r.firma)try{doc.addImage(r.firma,"PNG",15,180,80,35);doc.text("Firma manuscrita",15,178)}catch{}});
 doc.save("firmabal-expedientes.pdf")}


function citizenDone(){const v=document.getElementById("view");v.innerHTML=`<div class="cwrap" style="text-align:center;padding-top:40px"><div style="width:84px;height:84px;border-radius:50%;background:#E3F7EE;display:grid;place-items:center;margin:0 auto 18px"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#059B69" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg></div><h2 style="margin:0 0 8px">¡Registro completado!</h2><p class="sub" style="font-size:17px">Gracias por afiliarse. Puede compartir este enlace con sus familiares, amigos y conocidos para que también se registren.</p>
 <button class="btn btn-wa" id="cShare2" style="display:flex;align-items:center;justify-content:center;gap:10px">${WAI(22,"#fff")} Compartir con mis contactos</button></div>`;
 document.getElementById("cShare2").onclick=()=>document.getElementById("cShare").click()}

/* ---- Acceso de reclutadores por enlace unico ---- */
const LOGN=new URLSearchParams(location.search).get("login");
function onboarding(u){const R=ROLES[u.rol];document.body.style.overflow="auto";document.documentElement.style.overflow="auto";
 document.body.innerHTML=`<div style="min-height:100dvh;background:#FAFBFC;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(env(safe-area-inset-top) + 24px) 20px calc(env(safe-area-inset-bottom) + 40px)">
 <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #EEF0F3;border-radius:28px;padding:34px 28px;box-shadow:0 18px 50px rgba(16,19,26,.10);text-align:center">
  <img src="icons/logo-badge-96.png" width="64" height="64" alt="FirmAbal" style="margin:0 auto 10px;border-radius:18px;display:block">
  <h1 style="font-size:24px;margin:6px 0 2px">Bienvenido, ${esc(u.nombre.split(" ")[0])}</h1>
  <p style="color:#6B7280;font-size:16px;margin:0 0 20px">La administración le ha otorgado acceso a la plataforma.</p>
  <div style="border:1px solid #E7E9EE;border-radius:20px;padding:16px;margin:0 0 14px;text-align:left">
   <div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:17px">${R.n}</b><span style="color:#059B69;font-size:14px;font-weight:600">Rol asignado</span></div>
   <p style="color:#6B7280;font-size:15px;margin:4px 0 10px">${R.d}</p>
   <div style="display:flex;flex-wrap:wrap;gap:6px">${R.p.map(x=>`<span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:4px 12px;font-size:13px;color:#3A3F4A">${x}</span>`).join("")}</div>
  </div>
  <div style="border:1px solid #E7E9EE;border-radius:20px;padding:16px;margin:0 0 18px;text-align:left">
   <b style="font-size:16px">Antes de comenzar</b>
   <p style="color:#6B7280;font-size:15px;margin:6px 0 0;line-height:1.55">1. Guarde su enlace personalizado: es su llave de acceso.<br>2. Solo verá las pantallas que su rol permite.<br>3. Cada registro que capture quedará a su nombre.<br>4. Su enlace es personal e intransferible.</p>
  </div>
  <button id="obGo" style="width:100%;padding:16px;border-radius:18px;border:0;background:#10131A;color:#fff;font-size:17px;font-weight:600;cursor:pointer;font-family:inherit">Entrar a la plataforma</button>
 </div></div>`;
 document.getElementById("obGo").onclick=()=>{u.nuevo=false;db.ses=u.id;save();location.replace(location.pathname)};}


/* ---- Inicio de sesion del recolector: usuario = ultimos 4 digitos de la cedula; el enlace = contrasena ---- */
function loginRecolector(u){document.body.style.overflow="auto";document.documentElement.style.overflow="auto";
 const intentos=()=>+sessionStorage.getItem("fb-try-"+u.id)||0;
 document.body.innerHTML=`<div id="loginwrap" style="min-height:100dvh;background:#FAFBFC;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(env(safe-area-inset-top) + 28px) 20px calc(env(safe-area-inset-bottom) + 40px)">
 <div style="max-width:460px;margin:0 auto;background:#fff;border:1px solid #EEF0F3;border-radius:28px;padding:32px 26px;box-shadow:0 18px 50px rgba(16,19,26,.10);text-align:center">
  <img src="icons/logo-badge-96.png" width="68" height="68" alt="FirmAbal" style="margin:0 auto 12px;border-radius:19px;display:block">
  <h1 style="font-size:23px;margin:4px 0 2px">Hola, ${esc(u.nombre.split(" ")[0])}</h1>
  <p style="color:#6B7280;font-size:15.5px;margin:0 0 20px;line-height:1.5">Este es su enlace personal de acceso. Para entrar, confirme su identidad.</p>
  <div style="text-align:left"><label style="display:block;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6B7280;margin:0 0 8px">Número de usuario</label>
  <input type="text" id="lgU" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="0000" style="width:100%;font-size:30px;letter-spacing:.5em;text-align:center;padding:16px;border:1px solid #E1E4EA;border-radius:18px;font-family:ui-monospace,monospace">
  <p style="color:#8A909C;font-size:13.5px;margin:10px 2px 0;line-height:1.5">Escriba los <b>últimos 4 dígitos</b> de su cédula de identidad.</p></div>
  <p id="lgErr" style="color:#B3261E;font-size:14px;min-height:20px;margin:12px 0 4px"></p>
  <button id="lgGo" style="width:100%;padding:17px;border-radius:18px;border:0;background:#10131A;color:#fff;font-size:17px;font-weight:600;cursor:pointer;font-family:inherit">Iniciar sesión</button>
  <p style="color:#9AA0AC;font-size:12.5px;margin:16px 0 0;line-height:1.5">Su enlace es personal e intransferible. Si no puede entrar, comuníquese con la administración.</p>
 </div></div>`;
 const go=()=>{const v=document.getElementById("lgU").value.replace(/\D/g,""),err=document.getElementById("lgErr");
  if(intentos()>=5){err.textContent="Demasiados intentos. Comuníquese con la administración.";return}
  if(v.length!==4){err.textContent="Escriba los 4 dígitos.";return}
  const ced=String(u.cedula||"").replace(/\D/g,"");
  if(!ced){err.textContent="Su cédula aún no está registrada. Comuníquese con la administración.";return}
  if(ced.slice(-4)!==v){sessionStorage.setItem("fb-try-"+u.id,intentos()+1);err.textContent="Número de usuario incorrecto. Intentos restantes: "+Math.max(0,5-intentos());document.getElementById("lgU").value="";return}
  sessionStorage.setItem("fb-auth",u.id);sessionStorage.removeItem("fb-try-"+u.id);location.reload()};
 document.getElementById("lgGo").onclick=go;document.getElementById("lgU").onkeydown=e=>{if(e.key==="Enter")go()};
 document.getElementById("lgU").oninput=e=>{e.target.value=e.target.value.replace(/\D/g,"").slice(0,4);document.getElementById("lgErr").textContent=""}}

/* ---- MODO CIUDADANO: solo autorregistro ---- */
function citizenMode(){
 document.body.innerHTML=`<div id="citz"><header class="ctop"><div style="display:flex;gap:12px;align-items:center"><div class="clogo" style="background:transparent;box-shadow:none"><img src="icons/logo-badge-96.png" width="52" height="52" alt="FirmAbal" style="border-radius:15px"></div><div><div style="font-size:21px;font-weight:600">FirmAbal</div><div style="color:#8A909C;font-size:15px">Autorregistro ciudadano</div></div></div><button class="iconbtn" id="cShare" aria-label="Compartir">${ico("captura",0)}<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1A1D21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.600 13.400l6.800 4M8.600 10.600l6.800-4"/></svg></button></header>
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
 if(s===1)view.innerHTML=`<div class="pad view-pad" style="padding-top:18px">${bar}
  <div class="card" style="margin-top:0"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10131A" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></div><div class="sheet-title"><h2 style="font-size:19px">Cómo realizar la captura</h2><p>Pasos para un registro correcto</p></div></div>
  <ol style="font-size:18px;line-height:1.55;color:#3A3F4A;padding-left:24px;margin:16px 0 4px"><li>Pida el número de WhatsApp del ciudadano.</li><li>Capture el frente y luego el reverso de la cédula, con buena iluminación.</li><li>Revise los datos extraídos automáticamente. Los campos verificados quedan bloqueados.</li><li>El ciudadano firma en pantalla y se guarda el registro.</li></ol></div>
  <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5">${WAI(26,"#25D366")}</div><div class="sheet-title"><h2 style="font-size:19px">WhatsApp y circunscripción</h2><p>Contacto del ciudadano y su circunscripción electoral</p></div></div>
  <div class="two-col"><input type="tel" id="fWa" inputmode="tel" placeholder="809-000-0000" value="${esc(wiz.d.whatsapp)}" style="font-size:18px;padding:16px;border-radius:18px;min-width:0"><input type="text" id="fCirc1" inputmode="numeric" maxlength="2" placeholder="Opcional" value="${esc(wiz.d.circ||"")}" style="font-size:18px;padding:16px;border-radius:18px;min-width:0"></div></div>
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
 if(s===1)next.onclick=()=>{const wa=$("#fWa").value.replace(/\D/g,"");if(wa.length<10)return toast("WhatsApp obligatorio (10 dígitos)");wiz.d.whatsapp=wa;const ci=$("#fCirc1")?$("#fCirc1").value.replace(/\D/g,""):"";if(ci)wiz.d.circ=ci;consentSheet(()=>{wiz.step=2;renderWiz()})};
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
if(LOGN){const u=db.users.find(x=>x.id===LOGN);if(!u){document.body.innerHTML="<p style='padding:40px;font-family:sans-serif'>Enlace de acceso no válido.</p>";return}
 if(u.activo===false){document.body.innerHTML="<p style='padding:40px;font-family:sans-serif'>Su acceso está suspendido. Comuníquese con la administración.</p>";return}
 if(sessionStorage.getItem("fb-auth")!==u.id){loginRecolector(u);return}
 db.ses=u.id;save();if(u.nuevo!==false){onboarding(u);return}}
if(AUTO){document.body.classList.add("citizen");citizenMode()}else goNow("dash");
})();
