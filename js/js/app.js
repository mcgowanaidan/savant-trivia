import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logout } from "./auth.js";

export function renderNav(activePage) {
  const nav = document.getElementById("main-nav");
  if (!nav) return;

  onAuthStateChanged(auth, async user => {
    let profileHTML = "";
    let role = null;

    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid));
      const profile = snap.exists() ? snap.data() : {};
      role = profile.role || "player";
      const initial = (profile.displayName || user.email)[0].toUpperCase();
      profileHTML = `
        <div class="nav-user">
          <div class="nav-avatar">${initial}</div>
          <span class="nav-username">${profile.displayName || user.email}</span>
          <span class="nav-role-badge ${role}">${role}</span>
          <button class="nav-signout" id="signout-btn">Sign out</button>
        </div>`;
    } else {
      profileHTML = `<a href="login.html" class="nav-signin-btn">Sign in</a>`;
    }

    const pages = [
      { id: "dashboard", label: "Dashboard", href: "dashboard.html" },
      { id: "standings", label: "Standings", href: "standings.html" },
      { id: "stats", label: "Stats", href: "stats.html" },
      { id: "historical", label: "Historical", href: "historical.html" },
      { id: "question-history", label: "Questions", href: "question-history.html" },
      { id: "scoreboard", label: "Scoreboard", href: "scoreboard.html", commissionerOnly: true },
      { id: "schedule", label: "Schedule", href: "schedule.html" },
      { id: "lets-play", label: "Let's Play", href: "lets-play.html" },
    ];

    const tabs = pages
      .filter(p => !p.commissionerOnly || role === "commissioner")
      .map(p => `<a href="${p.href}" class="nav-tab${activePage === p.id ? " active" : ""}">${p.label}</a>`)
      .join("");

    nav.innerHTML = `
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5DCAA5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.54-4.83 2.5 2.5 0 0 1 1.5-4.71z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.54-4.83 2.5 2.5 0 0 0-1.5-4.71z"/></svg>
          THE <span class="logo-accent">SAVANT</span> TRIVIA
        </a>
        <div class="nav-tabs">${tabs}</div>
        <div class="nav-right">${profileHTML}</div>
      </div>`;

    const signoutBtn = document.getElementById("signout-btn");
    if (signoutBtn) signoutBtn.addEventListener("click", logout);
  });
}

export function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) { el.textContent = message; el.style.display = "block"; }
}

export function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.style.display = "none";
}
