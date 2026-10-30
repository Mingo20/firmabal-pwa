/* FirmAbal: sincronizacion con la base de datos central (entidades Fa* en Base44).
   Estrategia "local primero": todo se guarda en el dispositivo y se replica a la nube.
   Si no hay internet, las operaciones quedan en una cola y se reenvian al volver la conexion. */
(function(){
"use strict";
const URL="https://nuevo-agente-49974e4b.base44.app/functions/firmabalSync";
const KEY="fa_Si1-LJUQdawIpDEhLwtL94BNgZCTbqJV";
const QK="firmabal-queue-v1";
const S={online:false,last:0,busy:false,listeners:[]};

const q=()=>{try{return JSON.parse(localStorage.getItem(QK)||"[]")}catch(e){return[]}};
const sq=a=>{try{localStorage.setItem(QK,JSON.stringify(a.slice(-400)))}catch(e){}};

async function call(action,payload,ms){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),ms||20000);
  try{
    const r=await fetch(URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.assign({key:KEY,action},payload||{})),signal:c.signal});
    const j=await r.json().catch(()=>({}));
    if(!r.ok&&r.status!==200)throw new Error(j.error||("HTTP "+r.status));
    S.online=true;return j;
  }catch(e){S.online=false;throw e}finally{clearTimeout(t)}
}

/* ---- traduccion app <-> nube ---- */
const toCloudUser=u=>({uid:u.id,nombre:u.nombre,rol:u.rol,whatsapp:u.whatsapp||"",cedula:u.cedula||"",provincia:u.provincia||"",municipio:u.municipio||"",activo:u.activo!==false,nuevo:u.nuevo!==false,foto:u.foto||"",org:u.org||""});
const fromCloudUser=c=>({id:c.uid,nombre:c.nombre,rol:c.rol,whatsapp:c.whatsapp||"",cedula:c.cedula||"",provincia:c.provincia||"",municipio:c.municipio||"",activo:c.activo!==false,nuevo:c.nuevo!==false,foto:c.foto||""});
const toCloudRec=(r,recName)=>({rid:r.id,nombre:r.nombre,cedula:r.cedula,nac:r.nac||"",sexo:r.sexo||"",lugar:r.lugar||"",whatsapp:r.whatsapp||"",direccion:r.direccion||"",provincia:r.provincia||"",municipio:r.municipio||"",distrito:r.distrito||"",sector:r.sector||"",circ:String(r.circ||""),estado:r.estado||"pendiente",auto:!!r.auto,rec:String(r.rec||""),rec_nombre:recName||"",fecha:new Date(r.fecha||Date.now()).toISOString(),firma:r.firma||"",lat:r.lat==null?undefined:r.lat,lng:r.lng==null?undefined:r.lng});
const fromCloudRec=c=>({id:c.rid,nombre:c.nombre,cedula:c.cedula,nac:c.nac||"",sexo:c.sexo||"",lugar:c.lugar||"",whatsapp:c.whatsapp||"",direccion:c.direccion||"",provincia:c.provincia||"",municipio:c.municipio||"",distrito:c.distrito||"",sector:c.sector||"",circ:c.circ||"",estado:c.estado||"pendiente",auto:!!c.auto,rec:c.rec||"",fecha:Date.parse(c.fecha)||Date.now(),firma:c.firma||"",lat:c.lat==null?undefined:c.lat,lng:c.lng==null?undefined:c.lng});

/* ---- cola de envio ---- */
function enqueue(action,payload){const a=q();a.push({action,payload,t:Date.now()});sq(a);flush()}
async function flush(){
  if(S.busy)return;const a=q();if(!a.length)return;S.busy=true;
  try{
    while(a.length){const it=a[0];await call(it.action,it.payload,25000);a.shift();sq(a)}
  }catch(e){/* queda en cola */}finally{S.busy=false}
}

/* ---- API publica ---- */
const Sync={
  state:S,
  onChange(fn){S.listeners.push(fn)},
  saveUser(u){enqueue("saveUser",{user:toCloudUser(u)})},
  saveRecord(r,recName){enqueue("saveRecord",{record:toCloudRec(r,recName)})},
  setState(id,estado){enqueue("setRecordState",{rid:id,estado})},
  deleteRecord(id){enqueue("deleteRecord",{rid:id})},
  saveLocation(l){enqueue("saveLocation",{loc:l})},
  pushNotif(n){enqueue("pushNotif",{notif:n})},
  readNotif(nid,uid){enqueue("readNotif",{nid,uid})},
  audit(e){enqueue("logAudit",{entry:e})},
  login(uid,ult4){return call("login",{uid,ult4},15000)},
  /* Descarga de la nube y mezcla con lo local. Gana la nube para registros ya sincronizados. */
  async pull(db,save){
    const j=await call("pull",{},30000);if(!j||!j.ok)return false;
    const pend=new Set(q().filter(x=>x.action==="saveRecord").map(x=>x.payload.record.rid));
    const gone=new Set(j.deleted||[]);
    db.records=(db.records||[]).filter(r=>!gone.has(r.id));
    const map=new Map(db.records.map(r=>[r.id,r]));
    (j.records||[]).forEach(c=>{if(pend.has(c.rid))return;const n=fromCloudRec(c),o=map.get(n.id);
      if(o){Object.assign(o,n,{imgFRONTAL:o.imgFRONTAL,imgTRASERA:o.imgTRASERA,firma:n.firma||o.firma})}else{db.records.push(n)}});
    const um=new Map((db.users||[]).map(u=>[u.id,u]));
    (j.users||[]).forEach(c=>{const n=fromCloudUser(c),o=um.get(n.id);if(o)Object.assign(o,n);else db.users.push(n)});
    db.cloud={locs:j.locations||[],notifs:j.notifs||[],audit:j.audit||[],t:j.t};
    /* Notificaciones llegadas de otros equipos: se suman y avisan (sonido/vibracion) */
    try{
      const N=window.FANotif;
      if(N&&Array.isArray(j.notifs)&&j.notifs.length){
        const mine=new Set(N.getN().map(x=>x.nid));const add=[];
        j.notifs.forEach(c=>{if(c&&c.nid&&!mine.has(c.nid))add.push({nid:c.nid,para:c.para||"admin",tipo:c.tipo||"sistema",titulo:c.titulo,texto:c.texto||"",t:c.t||Date.now(),leida:false})});
        if(add.length){const all=N.getN().concat(add);N.setN(all);N.paintBadge();
          const last=add[add.length-1];N.alert(last.tipo==="ubicacion"?"location":"notif")}
      }
    }catch(e){}
    S.last=Date.now();save();S.listeners.forEach(f=>{try{f()}catch(e){}});return true;
  },
  /* Sube todo lo local la primera vez (siembra la base central). */
  async seed(db,recName){
    if(localStorage.getItem("firmabal-seeded-v1"))return;
    try{
      for(const u of (db.users||[]))await call("saveUser",{user:toCloudUser(u)},20000);
      for(const r of (db.records||[]))await call("saveRecord",{record:toCloudRec(r,recName(r))},30000);
      localStorage.setItem("firmabal-seeded-v1","1");
    }catch(e){/* se reintenta en el proximo arranque */}
  },
  flush,
  start(db,save,recName){
    const tick=async()=>{try{await Sync.seed(db,recName);await flush();await Sync.pull(db,save)}catch(e){}};
    tick();setInterval(tick,20000);
    window.addEventListener("online",tick);
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick()});
  }
};
window.FASync=Sync;
})();
