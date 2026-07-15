// Kalender: Monatsansicht mit Trainingstagen und erledigten Einheiten.
import { el, todayStr, ymd, MONTHS, WEEKDAYS, prettyDate, fmtSeconds } from "../core/util.js";
import * as store from "../core/store.js";
import { getItem } from "../data/catalog.js";
import { openSheet, closeSheet } from "./components.js";
import { navigate } from "../app.js";

export function renderCalendar(monthParam) {
  const view = el("div", { class: "view" });
  const today = todayStr();
  // aktueller Monat
  let [year, month] = (monthParam || today.slice(0, 7)).split("-").map(Number); // month 1-12

  view.appendChild(el("div", { class: "page-head" }, [
    el("div", {}, [
      el("div", { class: "eyebrow", text: "Uebersicht" }),
      el("h1", { class: "page-title", text: "Kalender" }),
    ]),
  ]));

  const settings = store.getSettings();
  const sessions = store.getSessions();
  const doneDates = new Set(sessions.map((s) => s.date));

  const card = el("div", { class: "card" });
  // Kopf mit Navigation
  const goMonth = (delta) => {
    let m = month + delta, y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    navigate(`calendar/${y}-${String(m).padStart(2, "0")}`);
  };
  card.appendChild(el("div", { class: "cal-head" }, [
    el("button", { class: "iconbtn", text: "‹", on: { click: () => goMonth(-1) } }),
    el("div", { class: "cal-month", text: `${MONTHS[month - 1]} ${year}` }),
    el("button", { class: "iconbtn", text: "›", on: { click: () => goMonth(1) } }),
  ]));

  // Wochentag-Kopf (Mo..So)
  const grid = el("div", { class: "cal-grid", attrs: { style: "margin-top:12px" } });
  ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].forEach((d) => grid.appendChild(el("div", { class: "cal-dow", text: d })));

  // erster Tag, Offset auf Montag
  const firstDow = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Mo=0
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevDays = new Date(year, month - 1, 0).getDate();

  // fuehrende Tage (Vormonat)
  for (let i = 0; i < firstDow; i++) {
    grid.appendChild(el("div", { class: "cal-cell out", text: String(prevDays - firstDow + 1 + i) }));
  }
  // Monatstage
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dow = new Date(year, month - 1, day).getDay();
    const isPlan = settings.trainingDays.includes(dow);
    const isDone = doneDates.has(dateStr);
    const isToday = dateStr === today;
    const cls = ["cal-cell"];
    if (isPlan) cls.push("plan");
    if (isDone) cls.push("done");
    if (isToday) cls.push("today");
    const cell = el("div", { class: cls.join(" "), on: { click: () => openDay(dateStr) } }, [
      el("span", { text: String(day) }),
    ]);
    if (isDone) cell.appendChild(el("div", { class: "cal-dot" }));
    grid.appendChild(cell);
  }
  card.appendChild(grid);
  view.appendChild(card);

  // Legende
  view.appendChild(el("div", { class: "muscle-tags", attrs: { style: "justify-content:center" } }, [
    legend("done", "Trainiert"),
    legend("plan", "Trainingstag"),
    legend("today", "Heute"),
  ]));

  // Monatsstatistik
  const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
  const monthSessions = sessions.filter((s) => s.date.startsWith(monthPrefix));
  view.appendChild(el("div", { class: "stat-row" }, [
    stat("🏋️", monthSessions.length, "Einheiten"),
    stat("📆", `${new Set(monthSessions.map((s) => s.date)).size}`, "Trainingstage"),
    stat("🔥", store.trainingStreak(today), "Streak"),
  ]));

  return view;
}

function legend(cls, label) {
  const dot = el("span", { attrs: { style: "display:inline-flex;align-items:center;gap:6px" } }, [
    el("span", { attrs: { style: `width:12px;height:12px;border-radius:4px;display:inline-block;${dotStyle(cls)}` } }),
    el("span", { text: label }),
  ]);
  return el("span", { class: "muscle-tag" }, [dot]);
}
function dotStyle(cls) {
  if (cls === "done") return "background:linear-gradient(135deg,var(--cyan-hell),var(--cyan2))";
  if (cls === "plan") return "background:transparent;border:1px solid var(--line)";
  return "background:transparent;border:1px solid var(--cyan)";
}
function stat(icon, value, label) {
  return el("div", { class: "stat" }, [
    el("div", { class: "stat-icon", text: icon }),
    el("div", { class: "stat-value", text: String(value) }),
    el("div", { class: "stat-label", text: label }),
  ]);
}

function openDay(dateStr) {
  const daySessions = store.sessionsForDate(dateStr);
  const content = [];
  if (!daySessions.length) {
    content.push(el("div", { class: "info-line", text: "Kein Training an diesem Tag." }));
    if (dateStr <= todayStr()) {
      content.push(el("button", {
        class: "btn primary block", text: "Training hier eintragen", attrs: { style: "margin-top:14px" },
        on: { click: () => { const s = store.createSession(dateStr, null); closeSheet(); navigate("session/" + s.id); } },
      }));
    }
  } else {
    daySessions.forEach((s) => {
      const inner = el("div", { class: "list" });
      s.entries.forEach((e) => {
        const item = getItem(e.itemId);
        if (!item) return;
        const best = store.bestOfEntry(e, item.type);
        inner.appendChild(el("div", { class: "item", on: { click: () => { closeSheet(); navigate("session/" + s.id); } } }, [
          el("div", { class: "item-emoji", text: item.emoji }),
          el("div", { class: "item-body" }, [
            el("div", { class: "item-name", text: item.name }),
            el("div", { class: "item-meta", text: `${e.sets.length} ${e.sets.length === 1 ? "Satz" : "Saetze"}` }),
          ]),
          el("div", { class: "item-big", text: best == null ? "–" : (item.type === "hold" ? fmtSeconds(best) : best + " Wdh") }),
        ]));
      });
      if (!s.entries.length) inner.appendChild(el("div", { class: "info-line", text: "Leere Einheit." }));
      content.push(inner);
      content.push(el("button", { class: "btn ghost block", text: "Einheit oeffnen", attrs: { style: "margin-top:6px" }, on: { click: () => { closeSheet(); navigate("session/" + s.id); } } }));
    });
  }
  openSheet(prettyDate(dateStr), content);
}
