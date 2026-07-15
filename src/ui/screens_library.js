// "Meine" Uebungen, Archiv (alle Skills/Uebungen) und Detail mit Verlauf.
import { el, clear, fmtSeconds, prettyDate, relativeDays, todayStr } from "../core/util.js";
import * as store from "../core/store.js";
import { CATALOG, CATEGORIES, getItem, itemsByCat, progressionName } from "../data/catalog.js";
import { sparkline, progressChart, openSheet, closeSheet, toast } from "./components.js";
import { navigate } from "../app.js";

// ---------------- Meine ----------------
export function renderLibrary() {
  const view = el("div", { class: "view" });
  view.appendChild(el("div", { class: "page-head" }, [
    el("div", {}, [
      el("div", { class: "eyebrow", text: "Dein Arsenal" }),
      el("h1", { class: "page-title", text: "Meine Uebungen" }),
    ]),
    el("button", { class: "iconbtn", text: "＋", on: { click: () => navigate("archive") } }),
  ]));

  const my = store.getMyItems().map((m) => ({ m, item: getItem(m.itemId) })).filter((x) => x.item);
  if (!my.length) {
    view.appendChild(el("div", { class: "empty" }, [
      el("span", { class: "big", text: "⭐" }),
      el("div", { text: "Waehle im Archiv die Skills und Uebungen aus, die du trackst." }),
      el("button", { class: "btn primary block", text: "Archiv oeffnen", attrs: { style: "margin-top:16px;max-width:240px" }, on: { click: () => navigate("archive") } }),
    ]));
    return view;
  }

  // Nach Kategorie gruppieren
  const byCat = {};
  my.forEach((x) => { (byCat[x.item.cat] = byCat[x.item.cat] || []).push(x); });
  for (const catKey of Object.keys(CATEGORIES)) {
    const group = byCat[catKey];
    if (!group || !group.length) continue;
    view.appendChild(el("div", { class: "section-head" }, [
      el("div", { class: "section-title", text: `${CATEGORIES[catKey].emoji} ${CATEGORIES[catKey].name}` }),
    ]));
    const list = el("div", { class: "list" });
    group.forEach(({ item, m }) => list.appendChild(myItemRow(item, m)));
    view.appendChild(list);
  }
  return view;
}

function myItemRow(item, m) {
  const hist = store.historyForItem(item.id, item.type);
  const values = hist.map((h) => h.best);
  const pb = values.length ? Math.max(...values) : null;
  const meta = el("div", { class: "item-meta" });
  if (m.progId) meta.appendChild(el("span", { text: progressionName(item, m.progId) }));
  meta.appendChild(el("span", { text: `${hist.length}× trainiert` }));

  return el("div", { class: "item", on: { click: () => navigate("item/" + item.id) } }, [
    el("div", { class: "item-emoji", text: item.emoji }),
    el("div", { class: "item-body" }, [el("div", { class: "item-name", text: item.name }), meta]),
    sparkline(values),
    el("div", { class: "item-right" }, [
      el("div", { class: "item-big", text: pb == null ? "–" : (item.type === "hold" ? fmtSeconds(pb) : pb) }),
      el("div", { class: "sub", text: "Best" }),
    ]),
  ]);
}

// ---------------- Archiv ----------------
let archiveFilter = "all";
export function renderArchive() {
  const view = el("div", { class: "view" });
  view.appendChild(el("div", { class: "topbar" }, [
    el("button", { class: "iconbtn", text: "‹", on: { click: () => navigate("library") } }),
    el("div", { class: "tb-title", text: "Archiv" }),
  ]));
  view.appendChild(el("div", { class: "page-sub", attrs: { style: "margin:-8px 2px 0" }, text: "Alle Skills und Uebungen. Tippe den Stern zum Merken." }));

  // Kategorie-Filter
  const chips = el("div", { class: "chip-row" });
  const cats = [["all", "Alle", "📋"], ...Object.entries(CATEGORIES).map(([k, v]) => [k, v.name, v.emoji])];
  const listWrap = el("div", { class: "list" });
  cats.forEach(([key, name, emoji]) => {
    chips.appendChild(el("button", {
      class: "chip" + (archiveFilter === key ? " on" : ""),
      text: `${emoji} ${name}`,
      on: { click: () => { archiveFilter = key; renderList(); refreshChips(); } },
    }));
  });
  function refreshChips() {
    [...chips.children].forEach((c, i) => c.classList.toggle("on", cats[i][0] === archiveFilter));
  }
  view.appendChild(chips);

  function renderList() {
    clear(listWrap);
    const items = archiveFilter === "all" ? CATALOG : itemsByCat(archiveFilter);
    items.forEach((item) => listWrap.appendChild(archiveRow(item, renderList)));
  }
  renderList();
  view.appendChild(listWrap);
  return view;
}

function archiveRow(item, rerender) {
  const isMine = store.isMyItem(item.id);
  const star = el("button", {
    class: "iconbtn", text: isMine ? "★" : "☆",
    attrs: { style: isMine ? "color:var(--gelb);border-color:rgba(255,209,102,0.4)" : "" },
    on: { click: (e) => {
      e.stopPropagation();
      if (store.isMyItem(item.id)) { store.removeMyItem(item.id); toast("Entfernt"); rerender(); }
      else if (item.progressions) { openProgressionPicker(item, () => rerender()); }
      else { store.addMyItem(item.id, null); toast("Gemerkt ⭐"); rerender(); }
    } },
  });
  return el("div", { class: "item", on: { click: () => navigate("item/" + item.id) } }, [
    el("div", { class: "item-emoji", text: item.emoji }),
    el("div", { class: "item-body" }, [
      el("div", { class: "item-name", text: item.name }),
      el("div", { class: "item-meta" }, [
        el("span", { class: `badge type-${item.type}`, text: item.type === "hold" ? "Sekunden" : "Wdh" }),
        el("span", { class: "badge lvl", text: item.level }),
      ]),
    ]),
    star,
  ]);
}

function openProgressionPicker(item, onDone) {
  const current = (store.getMyItems().find((m) => m.itemId === item.id) || {}).progId || null;
  const list = el("div", { class: "prog-list" });
  item.progressions.forEach((pr, i) => {
    list.appendChild(el("button", {
      class: "prog-opt" + (current === pr.id ? " on" : ""),
      on: { click: () => {
        if (store.isMyItem(item.id)) store.setItemProgression(item.id, pr.id);
        else store.addMyItem(item.id, pr.id);
        toast("Gemerkt ⭐"); closeSheet(); onDone();
      } },
    }, [
      el("span", { class: "num", text: String(i + 1) }),
      el("span", { text: pr.name }),
    ]));
  });
  openSheet(`${item.emoji} ${item.name} · Stufe`, [
    el("div", { class: "info-line", attrs: { style: "margin-bottom:10px" }, text: "Auf welcher Stufe bist du gerade? Kannst du spaeter aendern." }),
    list,
  ]);
}

// ---------------- Detail ----------------
export function renderItemDetail(id) {
  const item = getItem(id);
  const view = el("div", { class: "view" });
  if (!item) { view.appendChild(el("div", { class: "empty", text: "Uebung nicht gefunden." })); return view; }

  const isMine = store.isMyItem(item.id);
  const myItem = store.getMyItems().find((m) => m.itemId === item.id);

  view.appendChild(el("div", { class: "topbar" }, [
    el("button", { class: "iconbtn", text: "‹", on: { click: () => history.length > 1 ? history.back() : navigate("library") } }),
    el("div", { class: "tb-title", text: item.name }),
    el("button", {
      class: "iconbtn", text: isMine ? "★" : "☆",
      attrs: { style: isMine ? "color:var(--gelb);border-color:rgba(255,209,102,0.4)" : "" },
      on: { click: () => {
        if (store.isMyItem(item.id)) store.removeMyItem(item.id);
        else if (item.progressions) { openProgressionPicker(item, () => navigate("item/" + item.id)); return; }
        else store.addMyItem(item.id, null);
        navigate("item/" + item.id);
      } },
    }),
  ]));

  // Kopf-Karte
  const head = el("div", { class: "card" }, [
    el("div", { attrs: { style: "display:flex;align-items:center;gap:14px" } }, [
      el("div", { class: "item-emoji", attrs: { style: "width:54px;height:54px;font-size:28px" }, text: item.emoji }),
      el("div", {}, [
        el("div", { class: "card-title", text: item.name }),
        el("div", { class: "card-sub", text: `${CATEGORIES[item.cat].name} • ${item.level}` }),
      ]),
    ]),
  ]);
  if (item.info) head.appendChild(el("div", { class: "info-line", attrs: { style: "margin-top:12px" }, text: item.info }));
  if (item.muscles) {
    const tags = el("div", { class: "muscle-tags", attrs: { style: "margin-top:12px" } });
    item.muscles.forEach((mu) => tags.appendChild(el("span", { class: "muscle-tag", text: mu })));
    head.appendChild(tags);
  }
  view.appendChild(head);

  // Progression waehlen (nur wenn gemerkt)
  if (item.progressions) {
    const cur = myItem ? myItem.progId : null;
    view.appendChild(el("div", { class: "section-head" }, [el("div", { class: "section-title", text: "Deine Stufe" })]));
    const list = el("div", { class: "prog-list" });
    item.progressions.forEach((pr, i) => {
      list.appendChild(el("button", {
        class: "prog-opt" + (cur === pr.id ? " on" : ""),
        on: { click: () => {
          if (!store.isMyItem(item.id)) store.addMyItem(item.id, pr.id);
          else store.setItemProgression(item.id, pr.id);
          toast("Stufe gesetzt"); navigate("item/" + item.id);
        } },
      }, [el("span", { class: "num", text: String(i + 1) }), el("span", { text: pr.name })]));
    });
    view.appendChild(list);
  }

  // Verlauf
  const hist = store.historyForItem(item.id, item.type);
  view.appendChild(el("div", { class: "section-head" }, [el("div", { class: "section-title", text: "Fortschritt" })]));
  if (!hist.length) {
    view.appendChild(el("div", { class: "empty", text: "Noch keine Daten. Trag die Uebung in einem Training ein." }));
  } else {
    const pb = Math.max(...hist.map((h) => h.best));
    const first = hist[0].best;
    const last = hist[hist.length - 1].best;
    const gain = last - first;
    // Stat-Reihe
    view.appendChild(el("div", { class: "stat-row" }, [
      statMini("🏆", item.type === "hold" ? fmtSeconds(pb) : pb, "Bestwert"),
      statMini("📈", (gain >= 0 ? "+" : "") + (item.type === "hold" ? gain + "s" : gain), "Seit Start"),
      statMini("🔁", hist.length, "Einheiten"),
    ]));
    // Chart
    view.appendChild(el("div", { class: "chart-card" }, [progressChart(hist, item.type)]));
    // Verlaufsliste
    const list = el("div", { class: "list" });
    hist.slice().reverse().forEach((h, i, arr) => {
      const prevBest = i < arr.length - 1 ? arr[i + 1].best : null;
      const d = prevBest != null ? h.best - prevBest : null;
      list.appendChild(el("div", { class: "item" }, [
        el("div", { class: "item-body" }, [
          el("div", { class: "item-name", text: item.type === "hold" ? fmtSeconds(h.best) : h.best + " Wdh" }),
          el("div", { class: "item-meta", text: `${prettyDate(h.date)} • ${h.sets} ${h.sets === 1 ? "Satz" : "Saetze"}` }),
        ]),
        d != null && d !== 0 ? el("span", { class: "delta " + (d > 0 ? "up" : "down"), text: (d > 0 ? "+" : "") + d + (item.type === "hold" ? "s" : "") }) : null,
      ]));
    });
    view.appendChild(list);
  }
  return view;
}

function statMini(icon, value, label) {
  return el("div", { class: "stat" }, [
    el("div", { class: "stat-icon", text: icon }),
    el("div", { class: "stat-value", text: String(value) }),
    el("div", { class: "stat-label", text: label }),
  ]);
}
