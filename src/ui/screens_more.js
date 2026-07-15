// "Mehr": Trainingstage, Plaene, Export/Import, Reset.
import { el, clear } from "../core/util.js";
import * as store from "../core/store.js";
import { getItem, CATEGORIES, progressionName } from "../data/catalog.js";
import { toast, openSheet, closeSheet } from "./components.js";
import { navigate } from "../app.js";

const APP_VERSION = "0.1";
const PLAN_EMOJIS = ["🏋️", "💪", "🔥", "⭐", "🤸", "🦵", "🚀", "🔻", "🔼", "✈️", "🏳️", "🧗"];

export function renderMore() {
  const view = el("div", { class: "view" });
  view.appendChild(el("div", { class: "page-head" }, [
    el("div", {}, [el("div", { class: "eyebrow", text: "Einstellungen" }), el("h1", { class: "page-title", text: "Mehr" })]),
  ]));

  const settings = store.getSettings();

  // Name
  const nameCard = el("div", { class: "card" }, [
    el("div", { class: "card-title", text: "Dein Name" }),
    el("div", { class: "card-sub", text: "Fuer die Begruessung auf der Startseite." }),
  ]);
  const nameIn = el("input", { class: "weight-in", attrs: { type: "text", placeholder: "Name", value: settings.name || "", style: "width:100%;text-align:left;margin-top:12px;height:46px;padding:0 14px" } });
  nameIn.addEventListener("input", () => store.setName(nameIn.value.trim()));
  nameCard.appendChild(nameIn);
  view.appendChild(nameCard);

  // Trainingstage
  const daysCard = el("div", { class: "card" }, [
    el("div", { class: "card-title", text: "Trainingstage" }),
    el("div", { class: "card-sub", text: "Diese Tage werden im Kalender und auf der Startseite markiert." }),
  ]);
  const dayRow = el("div", { class: "chip-row", attrs: { style: "margin-top:12px;overflow:visible;flex-wrap:wrap" } });
  const dayDefs = [[1, "Mo"], [2, "Di"], [3, "Mi"], [4, "Do"], [5, "Fr"], [6, "Sa"], [0, "So"]];
  dayDefs.forEach(([dow, label]) => {
    const on = settings.trainingDays.includes(dow);
    const chip = el("button", { class: "chip" + (on ? " on" : ""), text: label });
    chip.addEventListener("click", () => {
      let days = store.getSettings().trainingDays.slice();
      if (days.includes(dow)) days = days.filter((d) => d !== dow);
      else days.push(dow);
      store.setTrainingDays(days);
      chip.classList.toggle("on");
    });
    dayRow.appendChild(chip);
  });
  daysCard.appendChild(dayRow);
  view.appendChild(daysCard);

  // Plaene
  view.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "section-title", text: "Trainingsplaene" }),
    el("button", { class: "link", text: "+ Neu", on: { click: () => navigate("plan/new") } }),
  ]));
  const plans = store.getPlans();
  if (!plans.length) {
    view.appendChild(el("div", { class: "info-line", attrs: { style: "padding:4px 4px 8px" }, text: "Noch keine Plaene. Ein Plan buendelt deine Lieblingsuebungen fuer einen schnellen Start." }));
  } else {
    const list = el("div", { class: "list" });
    plans.forEach((pl) => {
      list.appendChild(el("div", { class: "item", on: { click: () => navigate("plan/" + pl.id) } }, [
        el("div", { class: "item-emoji", text: pl.emoji || "🏋️" }),
        el("div", { class: "item-body" }, [
          el("div", { class: "item-name", text: pl.name }),
          el("div", { class: "item-meta", text: `${pl.entries.length} Uebungen` }),
        ]),
        el("span", { class: "iconbtn", text: "›" }),
      ]));
    });
    view.appendChild(list);
  }

  // Daten
  view.appendChild(el("div", { class: "section-head" }, [el("div", { class: "section-title", text: "Daten" })]));
  const dataCard = el("div", { class: "card" }, [
    el("div", { class: "info-line", text: "Alle Daten liegen nur auf diesem Geraet. Sichere sie regelmaessig als Datei." }),
  ]);
  dataCard.appendChild(el("button", { class: "btn ghost block", text: "⬇ Backup exportieren", attrs: { style: "margin-top:12px" }, on: { click: exportData } }));
  const importBtn = el("button", { class: "btn ghost block", text: "⬆ Backup importieren", attrs: { style: "margin-top:8px" } });
  const fileIn = el("input", { attrs: { type: "file", accept: "application/json", style: "display:none" } });
  fileIn.addEventListener("change", () => importData(fileIn.files[0]));
  importBtn.addEventListener("click", () => fileIn.click());
  dataCard.appendChild(importBtn);
  dataCard.appendChild(fileIn);
  dataCard.appendChild(el("button", { class: "btn danger block", text: "Alles zuruecksetzen", attrs: { style: "margin-top:8px" }, on: { click: confirmReset } }));
  view.appendChild(dataCard);

  view.appendChild(el("div", { class: "info-line", attrs: { style: "text-align:center;margin-top:6px" }, text: `Calisthenics-Tracker · Version ${APP_VERSION}` }));
  return view;
}

function exportData() {
  const blob = new Blob([store.exportJSON()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { attrs: { href: url, download: `calisthenics-backup-${new Date().toISOString().slice(0, 10)}.json` } });
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast("Backup exportiert");
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { store.importJSON(String(reader.result)); toast("Import erfolgreich"); navigate("home"); }
    catch (e) { toast("Datei ungueltig"); }
  };
  reader.readAsText(file);
}

function confirmReset() {
  openSheet("Wirklich alles loeschen?", [
    el("div", { class: "info-line", text: "Alle Trainings, Plaene und Einstellungen werden entfernt. Exportiere vorher ein Backup, wenn du sichergehen willst." }),
    el("button", { class: "btn danger block", text: "Ja, alles zuruecksetzen", attrs: { style: "margin-top:14px" }, on: { click: () => { store.resetAll(); closeSheet(); toast("Zurueckgesetzt"); navigate("home"); } } }),
    el("button", { class: "btn ghost block", text: "Abbrechen", attrs: { style: "margin-top:8px" }, on: { click: closeSheet } }),
  ]);
}

// ---------------- Plan bearbeiten ----------------
export function renderPlanEdit(id) {
  const isNew = id === "new";
  const plan = isNew ? { name: "", emoji: "🏋️", entries: [] } : store.getPlan(id);
  const view = el("div", { class: "view" });
  if (!plan) { view.appendChild(el("div", { class: "empty", text: "Plan nicht gefunden." })); return view; }

  // Arbeitskopie
  const draft = { name: plan.name, emoji: plan.emoji || "🏋️", entries: plan.entries.map((e) => ({ itemId: e.itemId, progId: e.progId || null })) };

  view.appendChild(el("div", { class: "topbar" }, [
    el("button", { class: "iconbtn", text: "‹", on: { click: () => navigate("more") } }),
    el("div", { class: "tb-title", text: isNew ? "Neuer Plan" : "Plan bearbeiten" }),
    isNew ? null : el("button", { class: "iconbtn", text: "🗑", on: { click: () => { store.deletePlan(id); toast("Plan geloescht"); navigate("more"); } } }),
  ]));

  // Name + Emoji
  const nameIn = el("input", { class: "weight-in", attrs: { type: "text", placeholder: "Name (z.B. Push Day)", value: draft.name, style: "flex:1;text-align:left;height:48px;padding:0 14px" } });
  nameIn.addEventListener("input", () => { draft.name = nameIn.value; });
  const emojiBtn = el("button", { class: "item-emoji", attrs: { style: "width:48px;height:48px;font-size:24px;border:1px solid var(--line);cursor:pointer" }, text: draft.emoji });
  emojiBtn.addEventListener("click", () => {
    const grid = el("div", { attrs: { style: "display:grid;grid-template-columns:repeat(6,1fr);gap:8px" } });
    PLAN_EMOJIS.forEach((em) => grid.appendChild(el("button", { class: "item-emoji", attrs: { style: "width:100%;height:48px;font-size:24px;cursor:pointer" }, text: em, on: { click: () => { draft.emoji = em; emojiBtn.textContent = em; closeSheet(); } } })));
    openSheet("Symbol waehlen", [grid]);
  });
  view.appendChild(el("div", { attrs: { style: "display:flex;gap:10px" } }, [emojiBtn, nameIn]));

  // Uebungen im Plan
  view.appendChild(el("div", { class: "section-head" }, [
    el("div", { class: "section-title", text: "Uebungen im Plan" }),
    el("button", { class: "link", text: "+ Hinzufuegen", on: { click: () => openPicker() } }),
  ]));
  const listWrap = el("div", { class: "list" });
  view.appendChild(listWrap);

  function renderDraftList() {
    clear(listWrap);
    if (!draft.entries.length) {
      listWrap.appendChild(el("div", { class: "empty", text: "Noch keine Uebungen. Tippe auf Hinzufuegen." }));
      return;
    }
    draft.entries.forEach((e, i) => {
      const item = getItem(e.itemId);
      if (!item) return;
      listWrap.appendChild(el("div", { class: "item" }, [
        el("div", { class: "item-emoji", text: item.emoji }),
        el("div", { class: "item-body" }, [
          el("div", { class: "item-name", text: item.name }),
          el("div", { class: "item-meta", text: (CATEGORIES[item.cat] || {}).name + (e.progId ? " • " + progressionName(item, e.progId) : "") }),
        ]),
        el("button", { class: "set-del", text: "✕", on: { click: () => { draft.entries.splice(i, 1); renderDraftList(); } } }),
      ]));
    });
  }
  renderDraftList();

  function openPicker() {
    const my = store.getMyItems().map((m) => ({ m, item: getItem(m.itemId) })).filter((x) => x.item);
    const chosen = new Set(draft.entries.map((e) => e.itemId));
    const content = [];
    if (!my.length) {
      content.push(el("div", { class: "info-line", text: "Waehle zuerst im Archiv deine Uebungen aus." }));
      content.push(el("button", { class: "btn primary block", text: "Zum Archiv", attrs: { style: "margin-top:12px" }, on: { click: () => { closeSheet(); navigate("archive"); } } }));
    } else {
      const list = el("div", { class: "list" });
      my.forEach(({ m, item }) => {
        if (chosen.has(item.id)) return;
        list.appendChild(el("div", { class: "item", on: { click: () => { draft.entries.push({ itemId: item.id, progId: m.progId || null }); closeSheet(); renderDraftList(); } } }, [
          el("div", { class: "item-emoji", text: item.emoji }),
          el("div", { class: "item-body" }, [el("div", { class: "item-name", text: item.name })]),
          el("span", { class: `badge type-${item.type}`, text: item.type === "hold" ? "Sek." : "Wdh" }),
        ]));
      });
      if (!list.children.length) content.push(el("div", { class: "info-line", text: "Alle deine Uebungen sind schon im Plan." }));
      content.push(list);
    }
    openSheet("Uebung hinzufuegen", content);
  }

  // Speichern
  view.appendChild(el("button", {
    class: "btn primary big block", text: "Plan speichern", attrs: { style: "margin-top:10px" },
    on: { click: () => {
      if (!draft.name.trim()) { toast("Bitte einen Namen eingeben"); return; }
      if (isNew) store.addPlan(draft.name.trim(), draft.emoji, draft.entries);
      else store.updatePlan(id, { name: draft.name.trim(), emoji: draft.emoji, entries: draft.entries });
      toast("Plan gespeichert"); navigate("more");
    } },
  }));

  return view;
}
