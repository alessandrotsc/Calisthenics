// Startseite "Heute": Status, Streak, letzte Fortschritte, Skill-Überblick.
import { el } from "../core/util.js";
import { todayStr, weekdayOf, WEEKDAYS_LONG, prettyDate, relativeDays, fmtSeconds } from "../core/util.js";
import * as store from "../core/store.js";
import { getItem, progressionName } from "../data/catalog.js";
import { sparkline, deltaNode } from "./components.js";
import { navigate } from "../app.js";

export function renderHome() {
  const today = todayStr();
  const settings = store.getSettings();
  const dow = weekdayOf(today);
  const isTrainingDay = settings.trainingDays.includes(dow);
  const todaysSessions = store.sessionsForDate(today);
  const trainedToday = todaysSessions.length > 0;

  const view = el("div", { class: "view" });

  // Kopf
  view.appendChild(el("div", { class: "page-head" }, [
    el("div", {}, [
      el("div", { class: "eyebrow", text: "Calisthenics" }),
      el("h1", { class: "page-title", text: greet(settings.name) }),
      el("div", { class: "page-sub", text: prettyDate(today) }),
    ]),
  ]));

  // Hero-Status
  view.appendChild(heroCard(isTrainingDay, trainedToday, todaysSessions, settings));

  // Statistik
  view.appendChild(statRow(today));

  // Letzte Fortschritte
  const highlights = recentHighlights();
  if (highlights.length) {
    view.appendChild(sectionHead("Letzte Fortschritte", null));
    const list = el("div", { class: "list" });
    highlights.forEach((h) => list.appendChild(highlightRow(h)));
    view.appendChild(list);
  }

  // Skill-Überblick
  const skills = store.getMyItems()
    .map((m) => ({ m, item: getItem(m.itemId) }))
    .filter((x) => x.item);
  if (skills.length) {
    view.appendChild(sectionHead("Deine Übungen", { text: "Alle", to: "library" }));
    const list = el("div", { class: "list" });
    skills.slice(0, 4).forEach((x) => list.appendChild(skillMiniRow(x.item, x.m)));
    view.appendChild(list);
  } else {
    view.appendChild(el("div", { class: "card" }, [
      el("div", { class: "info-line", text: "Noch keine Übungen ausgewählt. Leg im Archiv fest, was du trackst." }),
      el("button", { class: "btn primary block", text: "Zum Archiv", on: { click: () => navigate("archive") }, attrs: { style: "margin-top:12px" } }),
    ]));
  }

  return view;
}

function greet(name) {
  const h = new Date().getHours();
  const base = h < 11 ? "Guten Morgen" : h < 18 ? "Los geht's" : "Guten Abend";
  return name ? `${base}, ${name}` : base;
}

function heroCard(isTrainingDay, trainedToday, todaysSessions, settings) {
  const hero = el("div", { class: "hero" });
  if (trainedToday) {
    const nEx = todaysSessions.reduce((a, s) => a + s.entries.length, 0);
    hero.appendChild(el("div", { class: "hero-day", text: "Heute erledigt ✅" }));
    hero.appendChild(el("div", { class: "hero-headline", text: `${nEx} ${nEx === 1 ? "Übung" : "Übungen"} getrackt` }));
    hero.appendChild(el("div", { class: "hero-sub", text: "Stark. Du kannst weiter tracken oder das Training ansehen." }));
    hero.appendChild(el("button", {
      class: "btn primary block", text: "Training ansehen", attrs: { style: "margin-top:14px" },
      on: { click: () => navigate("session/" + todaysSessions[0].id) },
    }));
  } else {
    hero.appendChild(el("div", { class: "hero-day", text: isTrainingDay ? "Trainingstag 💪" : "Freier Tag" }));
    hero.appendChild(el("div", { class: "hero-headline", text: isTrainingDay ? "Zeit zu trainieren" : "Lust auf eine Einheit?" }));
    hero.appendChild(el("div", { class: "hero-sub", text: nextTrainingHint(settings) }));
    hero.appendChild(el("button", {
      class: "btn primary block", text: "Training starten", attrs: { style: "margin-top:14px" },
      on: { click: () => navigate("training") },
    }));
  }
  return hero;
}

function nextTrainingHint(settings) {
  if (!settings.trainingDays.length) return "Trage in den Einstellungen deine Trainingstage ein.";
  const names = settings.trainingDays.map((d) => WEEKDAYS_LONG[d]).join(", ");
  return `Deine Trainingstage: ${names}.`;
}

function statRow(today) {
  const streak = store.trainingStreak(today);
  const total = store.totalSessions();
  const week = sessionsThisWeek(today);
  const row = el("div", { class: "stat-row" });
  row.appendChild(stat("🔥", streak, "Streak"));
  row.appendChild(stat("📅", week, "Diese Woche"));
  row.appendChild(stat("🏋️", total, "Einheiten"));
  return row;
}
function stat(icon, value, label) {
  return el("div", { class: "stat" }, [
    el("div", { class: "stat-icon", text: icon }),
    el("div", { class: "stat-value", text: String(value) }),
    el("div", { class: "stat-label", text: label }),
  ]);
}
function sessionsThisWeek(today) {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Mo=0
  const monday = new Date(d); monday.setDate(d.getDate() - day);
  const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  return store.getSessions().filter((s) => s.date >= mondayStr && s.date <= today).length;
}

function sectionHead(title, link) {
  const h = el("div", { class: "section-head" }, [el("div", { class: "section-title", text: title })]);
  if (link) h.appendChild(el("button", { class: "link", text: link.text, on: { click: () => navigate(link.to) } }));
  return h;
}

// Fortschritts-Highlights aus der letzten Session
function recentHighlights() {
  const sessions = store.getSessions();
  if (!sessions.length) return [];
  const last = sessions[0];
  const out = [];
  for (const entry of last.entries) {
    const item = getItem(entry.itemId);
    if (!item) continue;
    const best = store.bestOfEntry(entry, item.type);
    if (best == null) continue;
    const prev = store.previousResult(entry.itemId, item.type, last.date, last.id);
    if (prev && best > prev.best) {
      out.push({ item, best, delta: best - prev.best, date: last.date });
    }
  }
  return out.sort((a, b) => b.delta - a.delta).slice(0, 3);
}

function highlightRow({ item, best, delta }) {
  return el("div", { class: "item" }, [
    el("div", { class: "item-emoji", text: item.emoji }),
    el("div", { class: "item-body" }, [
      el("div", { class: "item-name", text: item.name }),
      el("div", { class: "item-meta", text: item.type === "hold" ? "Neue Bestzeit im letzten Training" : "Mehr Wiederholungen als zuvor" }),
    ]),
    el("div", { class: "item-right" }, [
      el("div", { class: "item-big", text: item.type === "hold" ? fmtSeconds(best) : best }),
      deltaNode(delta, item.type),
    ]),
  ]);
}

function skillMiniRow(item, myItem) {
  const hist = store.historyForItem(item.itemId || item.id, item.type);
  const values = hist.map((h) => h.best);
  const pb = values.length ? Math.max(...values) : null;
  const progTxt = myItem.progId ? progressionName(item, myItem.progId) : "";
  const meta = el("div", { class: "item-meta" });
  if (progTxt) meta.appendChild(el("span", { text: progTxt }));
  meta.appendChild(el("span", { class: `badge type-${item.type}`, text: item.type === "hold" ? "Sekunden" : "Wdh" }));

  return el("div", {
    class: "item", on: { click: () => navigate("item/" + item.id) },
  }, [
    el("div", { class: "item-emoji", text: item.emoji }),
    el("div", { class: "item-body" }, [el("div", { class: "item-name", text: item.name }), meta]),
    el("div", { class: "item-right", attrs: { style: "display:flex;align-items:center;gap:10px" } }, [
      sparkline(values),
      el("div", {}, [
        el("div", { class: "item-big", text: pb == null ? "–" : (item.type === "hold" ? fmtSeconds(pb) : pb) }),
        el("div", { class: "sub", text: "Best" }),
      ]),
    ]),
  ]);
}
