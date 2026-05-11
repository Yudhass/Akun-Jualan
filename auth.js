/* ============================================================
   auth.js — Session management & API helper
   Dipakai bersama oleh login.html, register.html, app.html
============================================================ */

/* ---- API Fetch Wrapper ---- */
async function api(action, payload, token) {
  const body = { action };
  if (token !== undefined) body.token = token;
  if (payload !== undefined) body.payload = payload;

  // Content-Type: text/plain menghindari CORS preflight (OPTIONS)
  // GAS tetap membaca body via e.postData.contents
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

/* ---- Session Helpers ---- */
function saveSession(token, user) {
  localStorage.setItem(LS_TOKEN, token);
  localStorage.setItem(LS_USER, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
}

function getToken() {
  return localStorage.getItem(LS_TOKEN) || null;
}

function getUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER)); } catch { return null; }
}

/* ---- Toast ---- */
const TOAST_ICONS = {
  success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

function toast(type, title, msg, duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${msg ? `<div class="toast-msg">${msg}</div>` : ""}
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

/* ---- Loading ---- */
function showLoading() { document.getElementById("loading-overlay")?.classList.remove("hidden"); }
function hideLoading() { document.getElementById("loading-overlay")?.classList.add("hidden"); }

/* ---- Toggle password visibility ---- */
function togglePass(inputId) {
  const input = document.getElementById(inputId);
  const btn = input.nextElementSibling || input.parentElement.querySelector(".input-toggle");
  input.type = input.type === "password" ? "text" : "password";
  if (btn) btn.title = input.type === "password" ? "Tampilkan" : "Sembunyikan";
}
