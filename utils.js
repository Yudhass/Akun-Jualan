/* ============================================================
   utils.js — Shared utility functions
   Dipakai oleh dashboard.html & accounts.html
============================================================ */

/* ---- Sidebar ---- */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebar-overlay").classList.toggle("open");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("open");
}

function renderSidebarUser(user) {
  if (!user) return;
  document.getElementById("sidebar-avatar").textContent = (user.username || "A")[0].toUpperCase();
  document.getElementById("sidebar-name").textContent = user.username || "Admin";
  document.getElementById("sidebar-email").textContent = user.email || "";
}

/* ---- Escape helpers ---- */
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escAttr(str) {
  return String(str).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

/* ---- Platform badge class ---- */
function platformClass(name) {
  const n = String(name || "").toLowerCase();
  if (n.includes("netflix")) return "plt-netflix";
  if (n.includes("capcut")) return "plt-capcut";
  if (n.includes("spotify")) return "plt-spotify";
  if (n.includes("disney")) return "plt-disney";
  if (n.includes("youtube")) return "plt-youtube";
  if (n.includes("apple")) return "plt-apple";
  if (n.includes("canva")) return "plt-canva";
  if (n.includes("adobe")) return "plt-adobe";
  if (n.includes("amazon")) return "plt-amazon";
  return "plt-default";
}

/* ---- Date / Time formatters ---- */
function formatDate(val) {
  if (!val) return "-";
  try {
    const d = new Date(val);
    if (isNaN(d)) return String(val);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return String(val); }
}

/**
 * Format nilai Time dari Sheets.
 * Sheets kadang mengembalikan time sebagai ISO "1899-12-30T14:30:00.000Z".
 * Ekstrak HH:MM dari format apapun.
 */
function formatTime(val) {
  if (!val) return "-";
  const s = String(val).trim();
  if (/^\d{1,2}:\d{2}/.test(s)) return s.slice(0, 5);
  try {
    const d = new Date(s);
    if (!isNaN(d)) {
      return String(d.getUTCHours()).padStart(2, "0") + ":" +
        String(d.getUTCMinutes()).padStart(2, "0");
    }
  } catch { /* fallthrough */ }
  return s;
}

/* ---- Clipboard ---- */
function copyText(text, label) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => toast("success", "Disalin!", label + " berhasil disalin."))
      .catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
}

function fallbackCopy(text, label) {
  const ta = document.createElement("textarea");
  ta.value = text;
  Object.assign(ta.style, { position: "fixed", opacity: "0" });
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  toast("success", "Disalin!", label + " berhasil disalin.");
}

/* ---- Password cell toggle ---- */
function togglePassCell(i) {
  document.getElementById("pd-" + i).classList.toggle("hidden");
  document.getElementById("pt-" + i).classList.toggle("hidden");
}

/* ============================================================
   Alert Banner — untuk halaman app (dashboard & accounts)
   Memerlukan elemen: #alert-banner, #alert-icon, #alert-title, #alert-msg
============================================================ */
const _ALERT_ICONS = {
  success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

/**
 * Tampilkan alert banner di antara header dan konten.
 * @param {"success"|"error"|"warning"|"info"} type
 * @param {string} title
 * @param {string} [msg]
 */
function showAlert(type, title, msg) {
  const el = document.getElementById("alert-banner");
  if (!el) return;
  el.className = "alert-banner " + type;
  const iconEl = document.getElementById("alert-icon");
  if (iconEl) iconEl.innerHTML = _ALERT_ICONS[type] || _ALERT_ICONS.info;
  const titleEl = document.getElementById("alert-title");
  if (titleEl) titleEl.textContent = title || "";
  const msgEl = document.getElementById("alert-msg");
  if (msgEl) { msgEl.textContent = msg || ""; msgEl.style.display = msg ? "" : "none"; }
}

/** Sembunyikan alert banner. */
function hideAlert() {
  const el = document.getElementById("alert-banner");
  if (el) el.classList.add("hidden");
}

/* ============================================================
   Alert Inline — untuk halaman auth (login & register)
   Memerlukan elemen: #alert-inline, #alert-inline-icon,
                      #alert-inline-title, #alert-inline-msg
============================================================ */

/**
 * Tampilkan alert inline di dalam auth card.
 * @param {"success"|"error"|"warning"|"info"} type
 * @param {string} title
 * @param {string} [msg]
 */
function showInlineAlert(type, title, msg) {
  const el = document.getElementById("alert-inline");
  if (!el) return;
  el.className = "alert-inline " + type;
  const iconEl = document.getElementById("alert-inline-icon");
  if (iconEl) iconEl.innerHTML = _ALERT_ICONS[type] || _ALERT_ICONS.info;
  const titleEl = document.getElementById("alert-inline-title");
  if (titleEl) titleEl.textContent = title || "";
  const msgEl = document.getElementById("alert-inline-msg");
  if (msgEl) { msgEl.textContent = msg || ""; msgEl.style.display = msg ? "" : "none"; }
}

/** Sembunyikan alert inline. */
function hideInlineAlert() {
  const el = document.getElementById("alert-inline");
  if (el) el.classList.add("hidden");
}
