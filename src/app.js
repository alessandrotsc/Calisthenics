// Router + Bottom-Navigation. Hash-basiert, damit es als PWA sauber läuft.
import { el, clear } from "./core/util.js";
import { renderHome } from "./ui/screens_home.js";
import { renderTraining, renderSession } from "./ui/screens_session.js";
import { renderLibrary, renderArchive, renderItemDetail } from "./ui/screens_library.js";
import { renderCalendar } from "./ui/screens_calendar.js";
import { renderMore, renderPlanEdit } from "./ui/screens_more.js";

const app = document.getElementById("app");

const TABS = [
  { id: "home", ic: "🏠", label: "Heute" },
  { id: "training", ic: "➕", label: "Training" },
  { id: "library", ic: "⭐", label: "Meine" },
  { id: "calendar", ic: "📅", label: "Kalender" },
  { id: "more", ic: "⚙️", label: "Mehr" },
];

export function navigate(hash) {
  if (location.hash === "#/" + hash) render();
  else location.hash = "#/" + hash;
}

// Route parsen: "#/session/sess_1" -> ["session","sess_1"]
function parseRoute() {
  const raw = (location.hash || "#/home").replace(/^#\//, "");
  return raw.split("/").filter(Boolean);
}

function tabForRoute(head) {
  if (["home"].includes(head)) return "home";
  if (["training", "session"].includes(head)) return "training";
  if (["library", "archive", "item"].includes(head)) return "library";
  if (["calendar"].includes(head)) return "calendar";
  if (["more", "plan", "settings"].includes(head)) return "more";
  return "home";
}

function renderTabbar(activeTab) {
  const bar = el("nav", { class: "tabbar" });
  for (const t of TABS) {
    const btn = el("button", {
      class: "tab" + (t.id === activeTab ? " on" : ""),
      on: { click: () => navigate(t.id) },
    }, [
      el("span", { class: "ic", text: t.ic }),
      el("span", { text: t.label }),
    ]);
    bar.appendChild(btn);
  }
  return bar;
}

function render() {
  const parts = parseRoute();
  const head = parts[0] || "home";
  clear(app);

  // Sheets beim Navigieren schließen
  const openSheetEl = document.querySelector(".sheet-wrap");
  if (openSheetEl) openSheetEl.remove();

  let view;
  switch (head) {
    case "home": view = renderHome(); break;
    case "training": view = renderTraining(); break;
    case "session": view = renderSession(parts[1]); break;
    case "library": view = renderLibrary(); break;
    case "archive": view = renderArchive(); break;
    case "item": view = renderItemDetail(parts[1]); break;
    case "calendar": view = renderCalendar(parts[1]); break;
    case "more": view = renderMore(); break;
    case "plan": view = renderPlanEdit(parts[1]); break;
    default: view = renderHome();
  }
  app.appendChild(view);
  app.appendChild(renderTabbar(tabForRoute(head)));
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) location.hash = "#/home";
  else render();
});
// Falls DOMContentLoaded schon durch ist
if (document.readyState !== "loading") {
  if (!location.hash) location.hash = "#/home"; else render();
}
