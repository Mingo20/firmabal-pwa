(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const view=$("#view");
const KEY="firmabal-db-v2";
const db=JSON.parse(localStorage.getItem(KEY)||"null")||{meta:10,collector:{id:"REC-001",name:"Domingo Guerra",sharing:false},records:[
 {id:"R-1",nombre:"CARMEN CHALAS MENA",cedula:"224-0009987-9",nac:"1975-03-20",sexo:"F",lugar:"Santo Domingo",whatsapp:"8296469885",direccion:"San José casa 37",municipio:"Santo Domingo Oeste",distrito:"",sector:"Hato Nuevo",circ:"4",firma:null,estado:"verificado",fecha:Date.now()-86400000*3,rec:"REC-001",lat:18.4861,lng:-69.9712},
 {id:"R-2",nombre:"MIGUEL ANGEL GUERRA CHALAS",cedula:"402-2990201-2",nac:"1999-08-11",sexo:"M",lugar:"Santo Domingo",whatsapp:"8095550002",direccion:"Calle Principal 5",municipio:"Santo Domingo",distrito:"",sector:"Hato Nuevo",circ:"4",firma:null,estado:"pendiente",fecha:Date.now()-86400000*3,rec:"REC-001",lat:18.4722,lng:-69.9961}]};
const save=()=>localStorage.setItem(KEY,JSON.stringify(db));
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2400)};
const ICONS={"dash": "<path d=\"M3 11l9-8 9 8\"/><path d=\"M5 10v10h5v-6h4v6h5V10\"/>", "reg": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6\"/><circle cx=\"17\" cy=\"9\" r=\"2.5\"/><path d=\"M17 14c2.8 0 4.5 1.9 4.5 5\"/>", "captura": "<path d=\"M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z\"/><circle cx=\"12\" cy=\"13\" r=\"3.6\"/>", "monitor": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M8 20h8M12 16v4\"/>", "terr": "<path d=\"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z\"/><circle cx=\"12\" cy=\"9.5\" r=\"2.6\"/>", "recol": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6\"/><path d=\"M16 11l2 2 4-4\"/>", "firmas": "<path d=\"M12 19l7-7-4-4-7 7-1.5 5.5L12 19z\"/><path d=\"M15 5l4 4\"/>", "audit": "<path d=\"M7 3h11a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2z\"/><path d=\"M10 8h6M10 12h6\"/>", "export": "<path d=\"M12 4v11M7 11l5 5 5-5M4 20h16\"/>", "config": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z\"/>"};
const MENU=[["dash", "Inicio"], ["reg", "Registros"], ["captura", "Captura"], ["monitor", "Monitor"], ["terr", "Territorios"], ["recol", "Recolectores"], ["firmas", "Firmas"], ["audit", "Auditor\u00eda"], ["export", "Exportaci\u00f3n"], ["config", "Configuraci\u00f3n"]];
const isToday=ts=>new Date(ts).toDateString()===new Date().toDateString();
const stats=()=>({total:db.records.length,hoy:db.records.filter(r=>isToday(r.fecha)).length,pen:db.records.filter(r=>r.estado==="pendiente").length,dup:db.records.filter(r=>r.estado==="duplicado").length,auto:db.records.filter(r=>r.auto).length});
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let cur="dash",map=null,wiz=null;

/* ---- Auto registro sheet ---- */
const link=()=>location.origin+location.pathname+"?auto=1&rec="+db.collector.id;
const sheet=show=>{$("#sheetMask").hidden=!show;$("#autoSheet").hidden=!show};
$("#btnShare").onclick=()=>sheet(true);$("#btnCloseSheet").onclick=()=>sheet(false);
$("#btnWa").onclick=()=>window.open("https://wa.me/?text="+encodeURIComponent("Regístrate como afiliado aquí: "+link()),"_blank");
$("#btnCopy").onclick=async()=>{try{await navigator.clipboard.writeText(link());toast("Enlace copiado")}catch{prompt("Copie el enlace:",link())}};

/* ---- Navegación ---- */
const menuSheet=show=>{$("#sheetMask").hidden=!show;$("#menuSheet").hidden=!show;if(show){$("#menuGrid").innerHTML=MENU.map(([k,l])=>`<button data-go="${k}" class="${cur===k?"on":""}"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#2B2F38" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</svg>${l}</button>`).join("");$$("[data-go]").forEach(b=>b.onclick=()=>{menuSheet(false);go(b.dataset.go)})}};
$("#btnCloseMenu").onclick=()=>menuSheet(false);
$("#sheetMask").onclick=()=>{sheet(false);menuSheet(false)};
$$(".tab").forEach(b=>b.onclick=()=>b.dataset.v==="menu"?menuSheet(true):go(b.dataset.v));
function go(v){cur=v;$$(".tab").forEach(b=>b.classList.toggle("on",b.dataset.v===v||(b.dataset.v==='equipo'&&['monitor','terr','recol'].includes(v))));if(map){map.remove();map=null}
 ({dash:vDash,equipo:vEquipo,monitor:vEquipo,terr:vTerr,recol:vRecol,captura:vCaptura,reg:vReg,firmas:vFirmas,audit:vAdmin,export:vExport,config:vConfig})[v]();view.scrollTop=0}

/* ---- Centro de control ---- */
function vDash(){const s=stats(),pct=Math.min(100,Math.round(s.total/db.meta*100));
 view.innerHTML=`<div class="pad"><h1>Centro de control</h1><p class="sub">Resumen general de la captura territorial</p>
 <div class="grid"><div class="stat dark"><small>Registros totales</small><b>${s.total}</b></div><div class="stat"><small>Capturados hoy</small><b>${s.hoy}</b></div>
 <div class="stat amber"><small>Pendientes</small><b>${s.pen}</b></div><div class="stat red"><small>Duplicados</small><b>${s.dup}</b></div>
 <div class="stat"><small>Auto registros</small><b>${s.auto}</b></div><div class="stat"><small>Recolectores</small><b>1</b></div></div>
 <div class="card"><div class="meta-row"><b>🎯 Meta</b><input id="metaIn" type="text" inputmode="numeric" value="${db.meta}"><button class="btn btn-dark sm" id="setMeta">Establecer</button></div>
 <div class="row-between" style="margin-top:14px"><span>${s.total} / ${db.meta}</span><b style="color:#10131A">${pct}%</b></div><div class="prog"><i style="width:${pct}%"></i></div></div>
 <div class="card" style="padding:26px 20px 20px"><div style="display:flex;gap:14px;align-items:center;font-size:21px;font-weight:600"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#10131A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>Registros por día (últimos 7)</div>${chart()}</div>`;
 $("#setMeta").onclick=()=>{const n=parseInt($("#metaIn").value);if(n>0){db.meta=n;save();toast("Meta establecida");vDash()}}}
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
function vFirmas(){view.innerHTML=`<div class="pad"><h1>Firmas</h1><p class="sub">${db.records.length} firmas registradas · toque una tarjeta para ver el detalle y descargar el PDF</p><div class="firmas">${db.records.map(r=>`<div class="fcard" data-id="${r.id}"><div class="fsig">${r.firma?`<img src="${r.firma}">`:`<svg viewBox="0 0 120 50" width="110"><path d="M5 35c15-30 20 5 30-15s15 30 30 0 20-10 30 5" fill="none" stroke="#10131A" stroke-width="2"/></svg>`}</div><b>${esc(r.nombre)}</b><small>${new Date(r.fecha).toLocaleDateString("es-DO")}</small></div>`).join("")}</div></div>`;
 $$(".fcard").forEach(c=>c.onclick=()=>detalle(c.dataset.id))}
function detalle(id){const r=db.records.find(x=>x.id===id);const w=document.createElement("div");
 const box=(t)=>`<div><div style="display:flex;gap:8px;align-items:center;font-weight:700;letter-spacing:.06em;color:#3A3F4A;font-size:17px;margin:0 0 10px"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3A3F4A" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="9" cy="9" r="1.5"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>${t}</div><div style="border:1px solid #E7E9EE;border-radius:22px;height:130px;display:grid;place-items:center;color:#9AA0AC;font-size:21px;background:#fff">${r["img"+t]?`<img src="${r["img"+t]}" style="max-width:100%;max-height:100%">`:"No disponible"}</div></div>`;
 w.innerHTML=`<div class="sheet-mask" id="dm" style="z-index:60"></div><section class="sheet" style="z-index:61;max-height:92vh;display:flex;flex-direction:column;padding-bottom:0">
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#10131A" stroke-width="1.8"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/></svg></div><div class="sheet-title"><h2 style="font-size:21px;text-transform:uppercase">${esc(r.nombre)}</h2><p>${esc(r.cedula)}</p></div><button class="iconbtn" id="dx">✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:18px 0">
  <div style="display:flex;gap:10px;align-items:center;font-weight:700;letter-spacing:.06em;color:#3A3F4A;font-size:17px;margin-bottom:10px"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#3A3F4A" stroke-width="1.7"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>FIRMA MANUSCRITA</div>
  <div style="border:1px solid #E7E9EE;border-radius:24px;height:230px;display:grid;place-items:center;background:#fff">${r.firma?`<img src="${r.firma}" style="max-width:92%;max-height:92%">`:`<span style="color:#9AA0AC">No disponible</span>`}</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:22px">${box("FRONTAL")}${box("TRASERA")}</div>
  <div class="card" style="margin-top:18px">${[["Estado",r.estado],["Nacimiento",r.nac],["Sexo",r.sexo],["Lugar",r.lugar],["WhatsApp",r.whatsapp],["Direccion",r.direccion||"-"],["Municipio",r.municipio],["Sector",r.sector],["Circunscripción",r.circ],["Recolector",r.rec]].map(p=>`<div class="kv"><span>${p[0]}</span><b>${esc(p[1])}</b></div>`).join("")}</div></div>
 <div style="padding:14px 0 calc(env(safe-area-inset-bottom) + 16px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="dpdf" style="margin:0;padding:22px;border-radius:22px">⬇ Descargar PDF</button></div></section>`;
 document.body.appendChild(w);const close=()=>w.remove();$("#dx",w).onclick=$("#dm",w).onclick=close;
 $("#dpdf",w).onclick=()=>{const keep=db.records;db.records=[r];exportPdf();db.records=keep}}
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
function vConfig(){view.innerHTML=`<div class="pad"><h1>Configuración</h1><p class="sub">Datos del recolector</p><div class="card">
 <div class="set-row"><span>Nombre</span><input type="text" id="cn" value="${esc(db.collector.name)}"></div>
 <div class="set-row"><span>Código</span><b>${db.collector.id}</b></div></div>
 <button class="btn btn-dark" id="cs">Guardar</button><button class="btn btn-red" id="cr">Borrar datos locales</button></div>`;
 $("#cs").onclick=()=>{db.collector.name=$("#cn").value.trim()||db.collector.name;save();toast("Guardado")};
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
   <div style="display:flex;justify-content:space-between;gap:10px"><div><b style="font-size:21px;text-transform:uppercase;font-weight:500">${esc(r.nombre)}</b><div style="font-family:ui-monospace,monospace;color:#6B7280;font-size:19px;letter-spacing:.06em;margin-top:6px">${esc(r.cedula)}</div></div>
   <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px"><span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:5px 14px;font-size:17px;color:#3A3F4A">${r.auto?"Auto registro":"Promotor"}</span>
   <span style="background:${v?"#E3F7EE":d?"#FCE9E8":"#FDF3DD"};border:1px solid ${v?"#BFEBD6":d?"#F6CFCC":"#EEDDB0"};border-radius:99px;padding:5px 14px;font-size:17px;color:${v?"#0A7A52":d?"#B3261E":"#B4640B"}">${v?"Validado":d?"Duplicado":"Pendiente"}</span></div></div>
   <div style="display:flex;justify-content:space-between;color:#8A909C;font-size:19px;margin-top:14px;text-transform:uppercase"><span>${esc(r.municipio)} · Circ. ${esc(r.circ)}</span><span style="text-transform:none">${new Date(r.fecha).toLocaleDateString("es-DO")}</span></div>
   <a href="https://wa.me/1${String(r.whatsapp).replace(/\D/g,"")}" target="_blank" data-wa style="display:flex;gap:12px;align-items:center;color:#059B69;font-size:20px;margin-top:16px;text-decoration:none;font-weight:500"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#059B69" stroke-width="1.8"><path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12z"/></svg>Contactar por WhatsApp</a></div>`}).join("")||"<p class='sub'>Sin resultados.</p>";
  $$("#lista [data-id]").forEach(c=>c.onclick=e=>{if(e.target.closest("[data-wa]"))return;ficha(c.dataset.id)})};
 $("#q").oninput=draw;$("#est").onchange=draw;draw()}
const PIN='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>';
const USR0='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/></svg>';
const TEL='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
const CASA='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>';
const CAL='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
const USR='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8A909C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 11l2 2 4-4"/></svg>';
function ficha(id){const r=db.records.find(x=>x.id===id);const w=document.createElement("div");
 const fila=(ico,k,v,extra="")=>`<div style="display:flex;gap:18px;align-items:flex-start;padding:16px 0;border-bottom:1px solid #F0F1F4">${ico}<div style="flex:1"><div style="color:#9AA0AC;letter-spacing:.08em;font-size:17px;text-transform:uppercase">${k}</div><div style="font-size:23px;margin-top:4px;color:#10131A">${v||"—"}</div></div>${extra}</div>`;
 const tipo=r.auto?"Auto registro":"Promotor",val=r.estado==="verificado";
 w.innerHTML=`<div class="sheet-mask" id="fm" style="z-index:60"></div><section class="sheet" style="z-index:61;max-height:93vh;display:flex;flex-direction:column;padding-bottom:0">
 <div class="sheet-head" style="padding-bottom:14px;border-bottom:1px solid #EEF0F3"><div style="width:82px;height:82px;border-radius:50%;background:#10131A;color:#fff;display:grid;place-items:center;font-size:30px;font-weight:600;flex:0 0 auto">${esc((r.nombre||"?")[0].toUpperCase())}</div>
 <div class="sheet-title"><h2 style="font-size:22px;text-transform:uppercase">${esc(r.nombre)}</h2><div style="display:flex;gap:10px;margin-top:8px"><span style="background:#F1F2F5;border:1px solid #E1E4EA;border-radius:99px;padding:6px 16px;font-size:17px;color:#3A3F4A">${tipo}</span><span style="background:${val?"#E3F7EE":r.estado==="duplicado"?"#FCE9E8":"#FDF3DD"};border:1px solid ${val?"#BFEBD6":"#EEDDB0"};border-radius:99px;padding:6px 16px;font-size:17px;color:${val?"#0A7A52":r.estado==="duplicado"?"#B3261E":"#B4640B"}">${val?"Validado":r.estado==="duplicado"?"Duplicado":"Pendiente"}</span></div></div><button class="iconbtn" id="fx">✕</button></div>
 <div style="overflow-y:auto;flex:1;padding:4px 0 20px">
 ${fila(USR0,"Nombre completo",esc(r.nombre).toUpperCase())}${fila(USR0,"Cédula",esc(r.cedula))}${fila(TEL,"WhatsApp",esc(r.whatsapp),'<a href="https://wa.me/1'+String(r.whatsapp).replace(/\D/g,"")+'" target="_blank" style="display:flex;gap:8px;align-items:center;color:#059B69;font-size:21px;text-decoration:none;font-weight:500;margin-top:30px">💬 Contactar</a>')}${fila(CASA,"Dirección",esc(r.direccion).toUpperCase())}${fila(PIN,"Municipio",esc(r.municipio).toUpperCase())}${fila(PIN,"Distrito municipal",esc(r.distrito).toUpperCase())}${fila(PIN,"Sector",esc(r.sector).toUpperCase())}
 ${fila(PIN,"Circunscripción","Circunscripción "+esc(r.circ),'<button id="edCirc" style="border:0;background:none;font-size:20px;color:#10131A;cursor:pointer;font-family:inherit">✎ Editar</button>')}
 ${fila(CAL,"Fecha y hora",new Date(r.fecha).toLocaleString("es-DO"))}${fila(USR,"Tipo de registro",tipo)}${fila(USR,"Recolector responsable",esc(db.collector.name))}
 <div style="display:flex;gap:12px;align-items:center;color:#9AA0AC;font-size:19px;margin:20px 0 10px"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#8A909C" stroke-width="1.6"><path d="M12 19l7-7-4-4-7 7-1.5 5.5L12 19z"/><path d="M15 5l4 4"/></svg>FIRMA</div>
 <div style="border:1px solid #E7E9EE;border-radius:24px;height:190px;display:grid;place-items:center;background:#FAFBFC">${r.firma?`<img src="${r.firma}" style="max-width:90%;max-height:90%">`:'<span style="color:#9AA0AC;font-size:20px">No disponible</span>'}</div></div>
 <div style="padding:12px 0 calc(env(safe-area-inset-bottom) + 14px);border-top:1px solid #EEF0F3"><button class="btn btn-dark" id="fpdf" style="margin:0">⬇ Descargar PDF</button></div></section>`;
 document.body.appendChild(w);const close=()=>w.remove();$("#fx",w).onclick=$("#fm",w).onclick=close;
 $("#edCirc",w).onclick=()=>{const n=prompt("Circunscripción electoral:",r.circ);if(n&&n.trim()){r.circ=n.trim();save();close();toast("Circunscripción actualizada");ficha(id);if(cur==="reg")vReg()}};
 $("#fpdf",w).onclick=()=>{const keep=db.records;db.records=[r];exportPdf();db.records=keep}}

/* ---- Admin / auditoría ---- */
function vAdmin(){const s=stats();
 view.innerHTML=`<div class="pad"><h1>Panel</h1><p class="sub">Auditoría y exportación</p>
 <div class="card"><b>Recolectores</b><div class="item" style="margin-top:12px"><div><b>${esc(db.collector.name)}</b><small>${s.total} firmas · ${db.collector.sharing?"ubicación en vivo":"sin ubicación"}</small></div><span class="pill ok">activo</span></div></div>
 <div class="card"><b>Auditoría de firmas</b><p class="sub" style="font-size:15px;margin:8px 0 0">Verifique la veracidad de cada registro antes de exportar.</p>
 ${db.records.map(r=>`<div class="item" style="margin-top:10px"><div><b>${esc(r.nombre)}</b><small>${esc(r.cedula)}</small></div><div style="display:flex;gap:6px"><button class="btn btn-light sm" data-a="ok" data-id="${r.id}">✓</button><button class="btn btn-light sm" data-a="dup" data-id="${r.id}">⚠</button></div></div>`).join("")}</div>
 <button class="btn btn-dark" id="btnPdf">Exportar expedientes PDF</button>
 <button class="btn btn-light" id="btnCsv">Exportar CSV</button></div>`;
 $$("[data-a]").forEach(b=>b.onclick=()=>{const r=db.records.find(x=>x.id===b.dataset.id);r.estado=b.dataset.a==="ok"?"verificado":"duplicado";save();toast("Registro actualizado");vAdmin()});
 $("#btnPdf").onclick=exportPdf;$("#btnCsv").onclick=exportCsv}
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
  <div class="card"><div class="sheet-head"><div class="sheet-ico" style="background:#F1F2F5"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10131A" stroke-width="1.8"><path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12z"/></svg></div><div class="sheet-title"><h2 style="font-size:19px">WhatsApp del ciudadano</h2><p>Número de contacto para futuras comunicaciones</p></div></div>
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
function consentSheet(onOk){const w=document.createElement("div");w.innerHTML=`<div class="sheet-mask" id="cm" style="z-index:60"></div><section class="sheet" style="z-index:61;max-height:92vh;display:flex;flex-direction:column"><div class="sheet-head"><div class="sheet-ico"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg></div><div class="sheet-title"><h2>Protección de datos</h2><p>Consentimiento del ciudadano</p></div><button class="iconbtn" id="cx">✕</button></div>
 <div style="overflow-y:auto;flex:1;margin:12px 0;font-size:19px;color:#3A3F4A;line-height:1.6"><p style="margin-top:0">Antes de continuar, es importante que el ciudadano conozca cómo se tratarán sus datos:</p><ul style="padding-left:22px;line-height:1.7">
 <li>Se capturarán datos de identidad (nombre, cédula, fecha de nacimiento, sexo y lugar de nacimiento).</li><li>Se capturará una firma manuscrita como respaldo del registro.</li><li>Los datos se utilizarán únicamente para los fines del proceso de afiliación del partido.</li><li>Las imágenes de la cédula se usan solo para la extracción de datos y no se almacenan permanentemente.</li><li>El responsable del tratamiento es el partido o agrupación política que realiza la afiliación.</li><li>El ciudadano puede ejercer sus derechos de acceso, rectificación y oposición.</li></ul>
 <p style="color:#9AA0AC;font-size:16px">No se garantiza una protección absoluta, pero se aplican medidas técnicas razonables para resguardar la información, conforme a la legislación dominicana aplicable sobre protección de datos personales.</p></div>
 <label style="text-transform:none;letter-spacing:0;font-size:18px;color:#10131A;display:flex;gap:14px;align-items:flex-start;background:#F7F8FA;border:1px solid #E7E9EE;border-radius:20px;padding:16px;margin:0"><input type="checkbox" id="acc" style="width:26px;height:26px;margin-top:2px">El ciudadano ha leído y acepta el tratamiento de sus datos personales según lo descrito.</label>
 <div style="display:flex;gap:12px;margin-top:12px"><button class="btn btn-light" id="no" style="margin:0;background:#fff;border:1px solid #E7E9EE">No aceptar</button><button class="btn btn-dark" id="ok" style="margin:0">Aceptar y continuar</button></div></section>`;
 document.body.appendChild(w);const close=()=>w.remove();$("#cx",w).onclick=$("#cm",w).onclick=close;$("#no",w).onclick=()=>{close();toast("Consentimiento rechazado. Registro cancelado");go("dash")};
 $("#ok",w).onclick=()=>{if(!$("#acc",w).checked)return toast("Debe aceptar para continuar");close();onOk()}}
function bindWiz(){const s=wiz.step,next=$("#next");
 if(s===1)next.onclick=()=>{const wa=$("#fWa").value.replace(/\D/g,"");if(wa.length<10)return toast("WhatsApp obligatorio (10 dígitos)");wiz.d.whatsapp=wa;consentSheet(()=>{wiz.step=2;renderWiz()})};
 if(s===2){const rd=f=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
  $("#fFront").onchange=async e=>{if(e.target.files[0]){wiz.d.imgF=await rd(e.target.files[0]);renderWiz()}};$("#fBack").onchange=async e=>{if(e.target.files[0]){wiz.d.imgB=await rd(e.target.files[0]);renderWiz()}};
  next.onclick=async()=>{if(!wiz.d.imgF)return toast("Capture primero el frente de la cédula");$("#ocrMsg").textContent="Leyendo cédula con OCR…";
   try{const txt=await puter.ai.chat("Extrae de esta cédula dominicana un JSON puro con llaves nombre, cedula, nac (AAAA-MM-DD), sexo (M/F), lugar. Sin texto adicional.",wiz.d.imgF);
    const j=JSON.parse(String(txt?.message?.content??txt).replace(/```json|```/g,"").trim());Object.assign(wiz.d,j,{lock:true});toast("Datos extraídos")}
   catch(e){toast("No se pudo leer. Complete manualmente.")}
   delete wiz.d.imgF;delete wiz.d.imgB;wiz.step=3;renderWiz()}}
 if(s===3)next.onclick=()=>{Object.assign(wiz.d,{nombre:$("#fNombre").value.trim(),cedula:$("#fCed").value.trim(),nac:$("#fNac").value.trim(),sexo:$("#fSexo").value,lugar:$("#fLugar").value.trim(),direccion:$("#fDir").value.trim(),municipio:$("#fMun").value.trim(),distrito:$("#fDis").value.trim(),sector:$("#fSec").value.trim(),circ:$("#fCirc").value.trim()});
   if(!wiz.d.nombre||!/\d{3}-?\d{7}-?\d/.test(wiz.d.cedula))return toast("Complete nombre y cédula válida");
   if(db.records.some(r=>r.cedula.replace(/\D/g,"")===wiz.d.cedula.replace(/\D/g,"")))wiz.d.dup=true;wiz.step=4;renderWiz()};
 if(s===4){const c=$("#sig");c.width=c.offsetWidth*2;c.height=440;const x=c.getContext("2d");x.lineWidth=5;x.lineCap="round";x.strokeStyle="#10131A";let dr=false,has=false;
  const pt=e=>{const r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return[(t.clientX-r.left)*2,(t.clientY-r.top)*2]};
  const st=e=>{e.preventDefault();dr=true;const[a,b]=pt(e);x.beginPath();x.moveTo(a,b)},mv=e=>{if(!dr)return;e.preventDefault();const[a,b]=pt(e);x.lineTo(a,b);x.stroke();has=true},en=()=>dr=false;
  c.addEventListener("mousedown",st);c.addEventListener("mousemove",mv);addEventListener("mouseup",en);c.addEventListener("touchstart",st,{passive:false});c.addEventListener("touchmove",mv,{passive:false});c.addEventListener("touchend",en);
  $("#clr").onclick=()=>{x.clearRect(0,0,c.width,c.height);has=false};
  next.onclick=()=>{if(!has)return toast("Se requiere la firma");const d=wiz.d;
   const rec={id:"R-"+Date.now(),nombre:d.nombre,cedula:d.cedula,nac:d.nac,sexo:d.sexo,lugar:d.lugar,whatsapp:d.whatsapp,direccion:d.direccion,municipio:d.municipio,distrito:d.distrito,sector:d.sector,circ:d.circ,firma:c.toDataURL("image/png"),estado:d.dup?"duplicado":"pendiente",fecha:Date.now(),rec:db.collector.id,lat:18.4861+(Math.random()-.5)*.08,lng:-69.9312+(Math.random()-.5)*.1};
   db.records.push(rec);save();toast(d.dup?"Cédula ya registrada: marcada como duplicado":"Afiliación guardada");go("dash")}}}

if(new URLSearchParams(location.search).get("auto")){db.records.auto=true}
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
go("dash");
})();
