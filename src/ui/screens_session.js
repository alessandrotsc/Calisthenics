// Trainings-Start und Live-Logger.
import { el, clear, todayStr, prettyDate, relativeDays, fmtSeconds } from "../core/util.js";
import * as store from "../core/store.js";
import { getItem, progressionName, CATEGORIES } from "../data/catalog.js";
import { stepper, deltaNode, toast, openSheet, closeSheet } from "./components.js";
import { navigate } from "../app.js";

// ---------------- Training starten ----------------
export function renderTraining() {
  const view = el("div", { class: "view" });
  view.appendChild(el("div", { class: "page-head" }, [
    el("div", {}, [
      el("div", { class: "eyebrow", text: "Neue Einheit" }),
      el("h1", { class: "page-title", text: "Training" }),
      el("div", { class: "page-sub", text: prettyDate(todayStr()) }),
    ]),
  ]));

  // Heutige, offene Einheiten fortsetzen
  const todays = store.sessionsForDate(todayStr());
  if (todays.length) {
    view.appendChild(el("div", { class: "section-head" }, [el("div", { class: "section-title", text: "Heute" })]));
    const list = el("div", { class: "list" });
    todays.forEach((s) => {
      list.appendChild(el("div", {
        class: "card tap", on: { click: () => navigate("session/" + s.id) },
      }, [
        el("div", { class: "card-title", text: (planNameFor(s) || "Freies Training") }),
        el("div", { class: "card-sub", text: `${s.entries.length} Übungen • weiter tracken` }),
      ]));
    });
    view.appendChild(list);
  }

  // Freies Training
  view.appendChild(el("button", {
    class: "btn primary big block", attrs: { style: "margin-top:6px" },
    on: { click: () => startSession(null) },
  }, [el("span", { text: "＋ Freies Training" })]));

  // Pläne
  const plans = store.getPlans();
  view.appendChild(el("div", { class: "section-head", attrs: { style: "margin-top:8px" } }, [
    el("div", { class: "section-title", text: "Deine Pläne" }),
    el("button", { class: "link", text: "+ Neuer Plan", on: { click: () => navigate("plan/new") } }),
  ]));
  if (!plans.length) {
    view.appendChild(el("div", { class: "empty" }, [
      el("span", { class: "big", text: "🗂️" }),
      el("div", { text: "Noch keine Pläne. Erstelle einen Trainingsplan mit deinen Lieblingsübungen." }),
    ]));
  } else {
    const list = el("div", { class: "list" });
    plans.forEach((pl) => {
      list.appendChild(el("div", { class: "item", on: { click: () => startSession(pl.id) } }, [
        el("div", { class: "item-emoji", text: pl.emoji || "🏋️" }),
        el("div", { class: "item-body" }, [
          el("div", { class: "item-name", text: pl.name }),
          el("div", { class: "item-meta", text: `${pl.entries.length} Übungen` }),
        ]),
        el("button", {
          class: "iconbtn", text: "✎",
          on: { click: (e) => { e.stopPropagation(); navigate("plan/" + pl.id); } },
        }),
      ]));
    });
    view.appendChild(list);
  }

  return view;
}

function planNameFor(s) {
  if (!s.planId) return null;
  const pl = store.getPlan(s.planId);
  return pl ? pl.name : null;
}

function startSession(planId) {
  const s = store.createSession(todayStr(), planId);
  if (planId) {
    const pl = store.getPlan(planId);
    if (pl) {
      s.entries = pl.entries.map((e) => ({ itemId: e.itemId, progId: e.progId || null, sets: [] }));
      store.saveSession(s);
    }
  }
  navigate("session/" + s.id);
}

// ---------------- Live-Logger ----------------
export function renderSession(id) {
  const session = store.getSession(id);
  const view = el("div", { class: "view" });
  if (!session) {
    view.appendChild(el("div", { class: "empty", text: "Diese Einheit gibt es nicht mehr." }));
    return view;
  }

  // Topbar
  view.appendChild(el("div", { class: "topbar" }, [
    el("button", { class: "iconbtn", text: "‹", on: { click: () => history.length > 1 ? history.back() : navigate("home") } }),
    el("div", { class: "tb-title", text: planNameFor(session) || "Freies Training" }),
    el("button", { class: "iconbtn", text: "🗑", on: { click: () => confirmDelete(session) } }),
  ]));
  view.appendChild(el("div", { class: "page-sub", attrs: { style: "margin:-8px 2px 0" }, text: prettyDate(session.date) }));

  // Einträge
  const entriesWrap = el("div", { class: "list" });
  view.appendChild(entriesWrap);

  function renderEntries() {
    clear(entriesWrap);
    if (!session.entries.length) {
      entriesWrap.appendChild(el("div", { class: "empty" }, [
        el("span", { class: "big", text: "🏋️" }),
        el("div", { text: "Füge deine erste Übung hinzu." }),
      ]));
    }
    session.entries.forEach((entry, idx) => {
      entriesWrap.appendChild(renderLogEntry(session, entry, idx, renderEntries));
    });
  }
  renderEntries();

  // Übung hinzufügen
  view.appendChild(el("button", {
    class: "btn ghost block", text: "＋ Übung hinzufügen",
    on: { click: () => openAddExercise(session, renderEntries) },
  }));

  // Notiz
  const note = el("textarea", { class: "note-in", attrs: { placeholder: "Notiz zum Training (optional)" } });
  note.value = session.note || "";
  note.addEventListener("input", () => { session.note = note.value; store.saveSession(session); });
  view.appendChild(note);

  // Fertig
  view.appendChild(el("button", {
    class: "btn primary big block", text: "✓ Training fertig",
    on: { click: () => { store.saveSession(session); toast("Gespeichert 💪"); navigate("home"); } },
  }));

  return view;
}

function confirmDelete(session) {
  openSheet("Training löschen?", [
    el("div", { class: "info-line", text: "Diese Einheit wird komplett entfernt. Das kann nicht rückgängig gemacht werden." }),
    el("button", {
      class: "btn danger block", text: "Ja, löschen", attrs: { style: "margin-top:14px" },
      on: { click: () => { store.deleteSession(session.id); closeSheet(); toast("Gelöscht"); navigate("home"); } },
    }),
    el("button", { class: "btn ghost block", text: "Abbrechen", attrs: { style: "margin-top:8px" }, on: { click: closeSheet } }),
  ]);
}

// Eine Übungs-Karte im Logger
function renderLogEntry(session, entry, idx, rerender) {
  const item = getItem(entry.itemId);
  if (!item) return el("div");
  const isHold = item.type === "hold";
  const prev = store.previousResult(entry.itemId, item.type, session.date, session.id);
  const currentBest = store.bestOfEntry(entry, item.type);
  const beat = prev && currentBest != null && currentBest > prev.best;

  const card = el("div", { class: "log-entry" + (beat ? " beat" : "") });

  // Kopf mit Live-Best + Delta
  const bestNode = el("span", { class: "item-big", text: currentBest == null ? "–" : (isHold ? fmtSeconds(currentBest) : currentBest + " Wdh") });
  const deltaWrap = el("span", {});
  if (prev && currentBest != null) {
    const d = deltaNode(currentBest - prev.best, item.type);
    if (d) deltaWrap.appendChild(d);
  }
  const progTxt = entry.progId ? progressionName(item, entry.progId) : "";
  card.appendChild(el("div", { class: "log-head" }, [
    el("div", { class: "item-emoji", text: item.emoji }),
    el("div", { class: "n" }, [
      el("div", { class: "t", text: item.name }),
      el("div", { class: "s", text: progTxt || (isHold ? "Halte-Skill (Sekunden)" : "Wiederholungen") }),
    ]),
    el("div", { attrs: { style: "text-align:right" } }, [bestNode, el("div", {}, [deltaWrap])]),
    el("button", { class: "iconbtn", text: "✕", attrs: { style: "width:32px;height:32px;font-size:14px" }, on: { click: () => { session.entries.splice(idx, 1); store.saveSession(session); rerender(); } } }),
  ]));

  // "Letztes Mal"
  if (prev) {
    card.appendChild(el("div", { class: "log-last" }, [
      el("span", { text: "Letztes Mal:" }),
      el("strong", { text: isHold ? fmtSeconds(prev.best) : prev.best + " Wdh" }),
      el("span", { class: "muscle-tag", text: relativeDays(prev.session.date, session.date) }),
    ]));
  } else {
    card.appendChild(el("div", { class: "log-last", text: "Erstes Mal, dein Startwert." }));
  }

  // Live-Update-Funktion für Kopf
  const refreshHead = () => {
    const cb = store.bestOfEntry(entry, item.type);
    bestNode.textContent = cb == null ? "–" : (isHold ? fmtSeconds(cb) : cb + " Wdh");
    clear(deltaWrap);
    if (prev && cb != null) { const d = deltaNode(cb - prev.best, item.type); if (d) deltaWrap.appendChild(d); }
    card.classList.toggle("beat", !!(prev && cb != null && cb > prev.best));
  };

  // Sätze
  const setsWrap = el("div", {});
  const renderSets = () => {
    clear(setsWrap);
    entry.sets.forEach((set, si) => setsWrap.appendChild(renderSet(session, entry, set, si, item, () => { refreshHead(); }, renderSets)));
  };
  renderSets();
  card.appendChild(setsWrap);

  // Timer (nur Holds) oder Satz hinzufügen
  if (isHold) {
    card.appendChild(timerControl(session, entry, () => { renderSets(); refreshHead(); }));
  }
  card.appendChild(el("button", {
    class: "addset", text: isHold ? "＋ Zeit manuell eintragen" : "＋ Satz",
    on: { click: () => {
      const lastReps = entry.sets.length ? entry.sets[entry.sets.length - 1].reps : 8;
      entry.sets.push(isHold ? { seconds: 0 } : { reps: lastReps || 8, weight: null });
      store.saveSession(session); renderSets(); refreshHead();
    } },
  }));

  return card;
}

function renderSet(session, entry, set, si, item, onChange, rerender) {
  const isHold = item.type === "hold";
  const row = el("div", { class: "set-row" });
  row.appendChild(el("div", { class: "set-idx", text: String(si + 1) }));

  if (isHold) {
    row.appendChild(stepper(set.seconds || 0, (v) => { set.seconds = v; store.saveSession(session); onChange(); }, { min: 0, step: 1, max: 3600 }));
    row.appendChild(el("div", { class: "set-unit", text: "Sek." }));
  } else {
    row.appendChild(stepper(set.reps || 0, (v) => { set.reps = v; store.saveSession(session); onChange(); }, { min: 0, step: 1, max: 999 }));
    row.appendChild(el("div", { class: "set-unit", text: "Wdh" }));
    if (item.weight) {
      const w = el("input", { class: "weight-in", attrs: { type: "number", inputmode: "decimal", placeholder: "+kg", value: set.weight != null ? String(set.weight) : "" } });
      w.addEventListener("input", () => { const v = parseFloat(w.value); set.weight = isNaN(v) ? null : v; store.saveSession(session); });
      row.appendChild(w);
    }
  }
  row.appendChild(el("button", {
    class: "set-del", text: "✕",
    on: { click: () => { entry.sets.splice(si, 1); store.saveSession(session); rerender(); onChange(); } },
  }));
  return row;
}

// Timer, der beim Stoppen die gehaltene Zeit als Satz einträgt
function timerControl(session, entry, onDone) {
  let running = false;
  let start = 0;
  let interval = null;
  const btn = el("button", { class: "timer-btn", text: "▶ Timer starten" });
  const display = () => {
    const el2 = Math.round((Date.now() - start) / 1000);
    btn.textContent = `⏱ ${fmtSeconds(el2)}  •  Stopp`;
  };
  btn.addEventListener("click", () => {
    if (!running) {
      running = true; start = Date.now();
      btn.classList.add("running");
      display();
      interval = setInterval(display, 200);
    } else {
      running = false;
      clearInterval(interval);
      btn.classList.remove("running");
      const secs = Math.round((Date.now() - start) / 1000);
      entry.sets.push({ seconds: secs });
      store.saveSession(session);
      btn.textContent = "▶ Timer starten";
      toast(`${fmtSeconds(secs)} gehalten 🔥`);
      onDone();
    }
  });
  return btn;
}

// Übung zum Training hinzufügen (aus "Meine", sonst Hinweis aufs Archiv)
function openAddExercise(session, rerender) {
  const my = store.getMyItems().map((m) => ({ m, item: getItem(m.itemId) })).filter((x) => x.item);
  const already = new Set(session.entries.map((e) => e.itemId));
  const content = [];

  if (!my.length) {
    content.push(el("div", { class: "info-line", text: "Du hast noch keine Übungen ausgewählt. Wähle sie im Archiv aus." }));
    content.push(el("button", { class: "btn primary block", text: "Zum Archiv", attrs: { style: "margin-top:12px" }, on: { click: () => { closeSheet(); navigate("archive"); } } }));
    openSheet("Übung hinzufügen", content);
    return;
  }

  const list = el("div", { class: "list" });
  my.forEach(({ m, item }) => {
    if (already.has(item.id)) return;
    list.appendChild(el("div", { class: "item", on: { click: () => {
      session.entries.push({ itemId: item.id, progId: m.progId || null, sets: [] });
      store.saveSession(session); closeSheet(); rerender();
    } } }, [
      el("div", { class: "item-emoji", text: item.emoji }),
      el("div", { class: "item-body" }, [
        el("div", { class: "item-name", text: item.name }),
        el("div", { class: "item-meta", text: (CATEGORIES[item.cat] || {}).name + (m.progId ? " • " + progressionName(item, m.progId) : "") }),
      ]),
      el("span", { class: `badge type-${item.type}`, text: item.type === "hold" ? "Sek." : "Wdh" }),
    ]));
  });
  if (!list.children.length) content.push(el("div", { class: "info-line", text: "Alle deine Übungen sind schon im Training." }));
  content.push(list);
  content.push(el("button", { class: "btn ghost block", text: "Weitere im Archiv wählen", attrs: { style: "margin-top:10px" }, on: { click: () => { closeSheet(); navigate("archive"); } } }));
  openSheet("Übung hinzufügen", content);
}
