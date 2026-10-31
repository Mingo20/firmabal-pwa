/* FirmAbal · SaaS: alta de organizacion y aceptacion de invitaciones por rol.
   Flujo:
   - Enlace principal (sin parametros): cualquier organizacion puede crear su espacio.
   - Enlace de invitacion (?inv=TOKEN): el lider se registra con el rol que le asignaron.      */
(function () {
  "use strict";
  const Q = new URLSearchParams(location.search);
  const INV = Q.get("inv") || Q.get("invitacion") || "";
  const NEW = Q.get("nueva") === "1" || Q.get("org") === "1";
  const base = location.href.split("?")[0].split("#")[0];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const api = () => window.FASync;
  const ROLN = { administrador: "Administrador", supervisor: "Supervisor", recolector: "Recolector", auditor: "Auditor" };

  function shell(inner) {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
    document.body.innerHTML = `<div style="min-height:100dvh;background:#FAFBFC;padding:calc(env(safe-area-inset-top) + 26px) 18px calc(env(safe-area-inset-bottom) + 34px);overflow-y:auto;-webkit-overflow-scrolling:touch">
      <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #EEF0F3;border-radius:28px;padding:26px 22px;box-shadow:0 18px 50px rgba(16,19,26,.10)">
      <img src="icons/logo-badge-96.png" width="60" height="60" alt="FirmAbal" style="border-radius:17px;display:block;margin:0 auto 12px">
      <h1 style="font-size:23px;margin:6px 0 6px;text-align:center;color:#10131A">${inner.t}</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 18px;text-align:center;line-height:1.5">${inner.s}</p>
      ${inner.body}</div></div>`;
  }
  const field = (id, label, ph, extra = "") =>
    `<label style="display:block;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#6B7280;margin:14px 0 7px">${label}</label>
     <input id="${id}" ${extra} placeholder="${ph}" autocomplete="off" style="width:100%;box-sizing:border-box;font-size:17px;padding:14px 16px;border:1px solid #E1E4EA;border-radius:16px;background:#fff;color:#10131A">`;

  /* ---------- 1) Alta de organizacion (enlace principal) ---------- */
  function newOrg() {
    shell({
      t: "Cree su organización",
      s: "Al registrarse obtiene su propio espacio independiente, con datos separados del resto de organizaciones.",
      body: `<div style="text-align:left">
        ${field("oNombre", "Nombre de la organización", "Ej. Colectivo Ciudadano RD")}
        ${field("oAdmin", "Su nombre completo", "Ej. Ana Pérez")}
        ${field("oCed", "Cédula (11 dígitos)", "001-0000000-0", 'inputmode="numeric" maxlength="13"')}
        ${field("oWa", "WhatsApp", "809-000-0000", 'inputmode="tel"')}
        <div id="oMsg" style="color:#B3261E;font-size:14px;margin-top:10px;min-height:18px"></div>
        <button id="oGo" style="width:100%;margin-top:8px;padding:16px;border:0;border-radius:18px;background:#10131A;color:#fff;font-size:17px;font-weight:600;font-family:inherit;cursor:pointer">Crear mi organización</button>
        <p style="color:#8A909C;font-size:13px;margin:14px 2px 0;line-height:1.5">Usted quedará como administrador y podrá invitar a su equipo con enlaces por rol.</p>
      </div>`,
    });
    const msg = document.getElementById("oMsg");
    document.getElementById("oGo").onclick = async () => {
      const nombre = document.getElementById("oNombre").value.trim();
      const admin = document.getElementById("oAdmin").value.trim();
      const ced = document.getElementById("oCed").value.replace(/\D/g, "");
      const wa = document.getElementById("oWa").value.replace(/\D/g, "");
      if (!nombre || !admin) return (msg.textContent = "Complete el nombre de la organización y su nombre.");
      if (ced.length !== 11) return (msg.textContent = "La cédula debe tener 11 dígitos.");
      msg.textContent = "";
      const btn = document.getElementById("oGo");
      btn.disabled = true; btn.textContent = "Creando su espacio…";
      try {
        const r = await api().createOrg(nombre, admin, ced, wa);
        if (!r || !r.ok) throw new Error((r && r.error) || "No se pudo crear la organización");
        api().setScope(r.org.oid, r.user.uid);
        localStorage.removeItem("firmabal-db-v4");
        sessionStorage.setItem("fb-auth", r.user.uid);
        location.replace(base + "?login=" + encodeURIComponent(r.user.uid) + "&nuevo=1");
      } catch (e) {
        btn.disabled = false; btn.textContent = "Crear mi organización";
        msg.textContent = e.message || "Error de conexión. Intente de nuevo.";
      }
    };
  }

  /* ---------- 2) Aceptar invitacion (enlace por rol) ---------- */
  async function invite() {
    shell({ t: "Verificando invitación…", s: "Un momento.", body: "" });
    let info = null;
    try { info = await api().getInvite(INV); } catch (e) { info = null; }
    if (!info || !info.ok) {
      shell({ t: "Invitación no válida", s: esc((info && info.error) || "Este enlace no está activo. Pida uno nuevo a su organización."), body: "" });
      return;
    }
    shell({
      t: "Únase a " + esc(info.org.nombre),
      s: "Le invitaron con el rol de <b>" + esc(ROLN[info.rol] || info.rol) + "</b>. Complete sus datos para activar su acceso.",
      body: `<div style="text-align:left">
        ${field("iNombre", "Nombre completo", "Ej. Luis Ramírez", 'value="' + esc(info.nombre || "") + '"')}
        ${field("iCed", "Cédula (11 dígitos)", "001-0000000-0", 'inputmode="numeric" maxlength="13"')}
        ${field("iWa", "WhatsApp", "809-000-0000", 'inputmode="tel"')}
        <div id="iMsg" style="color:#B3261E;font-size:14px;margin-top:10px;min-height:18px"></div>
        <button id="iGo" style="width:100%;margin-top:8px;padding:16px;border:0;border-radius:18px;background:#10131A;color:#fff;font-size:17px;font-weight:600;font-family:inherit;cursor:pointer">Activar mi acceso</button>
        <p style="color:#8A909C;font-size:13px;margin:14px 2px 0;line-height:1.5">Entrará con los <b>últimos 4 dígitos</b> de su cédula. Guarde este enlace: es su acceso personal.</p>
      </div>`,
    });
    const msg = document.getElementById("iMsg");
    document.getElementById("iGo").onclick = async () => {
      const nombre = document.getElementById("iNombre").value.trim();
      const ced = document.getElementById("iCed").value.replace(/\D/g, "");
      const wa = document.getElementById("iWa").value.replace(/\D/g, "");
      if (!nombre) return (msg.textContent = "Escriba su nombre completo.");
      if (ced.length !== 11) return (msg.textContent = "La cédula debe tener 11 dígitos.");
      msg.textContent = "";
      const btn = document.getElementById("iGo");
      btn.disabled = true; btn.textContent = "Activando…";
      try {
        const r = await api().acceptInvite(INV, nombre, ced, wa);
        if (!r || !r.ok) throw new Error((r && r.error) || "No se pudo activar el acceso");
        api().setScope(r.user.org, r.user.uid);
        localStorage.removeItem("firmabal-db-v4");
        sessionStorage.setItem("fb-auth", r.user.uid);
        location.replace(base + "?login=" + encodeURIComponent(r.user.uid) + "&nuevo=1");
      } catch (e) {
        btn.disabled = false; btn.textContent = "Activar mi acceso";
        msg.textContent = e.message || "Error de conexión. Intente de nuevo.";
      }
    };
  }

  /* Se ejecuta antes de app.js: si hay invitacion, toma el control de la pantalla. */
  if (INV && api()) { api().setScope("", ""); invite(); window.__FA_SAAS_TAKEOVER = true; }
  else if (NEW && api() && !new URLSearchParams(location.search).get("login")) { newOrg(); window.__FA_SAAS_TAKEOVER = true; }

  window.FASaas = {
    /* Enlace de invitacion que un administrador comparte con su lider */
    inviteLink(token) { return base + "?inv=" + encodeURIComponent(token); },
    newOrgScreen: newOrg,
    async makeInvite(org, rol, by, nombre) {
      const r = await api().createInvite(org, rol, by, nombre);
      if (!r || !r.ok) throw new Error((r && r.error) || "No se pudo crear la invitación");
      return window.FASaas.inviteLink(r.token);
    },
    ROLN,
  };
})();
