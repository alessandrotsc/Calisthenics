// Persistenz ueber localStorage. Ein einziges JSON-Objekt, einfach und robust.
// Bewusst kein IndexedDB: die Datenmengen sind klein, Export/Import als Datei reicht.

const KEY = "calis.v1";

const DEFAULT = {
  version: 1,
  settings: {
    trainingDays: [1, 3, 5], // 0=So ... 6=Sa
    name: "",
  },
  myItems: [], // [{ itemId, progId }]
  plans: [],   // [{ id, name, emoji, entries: [{ itemId, progId }] }]
  sessions: [], // [{ id, date:'YYYY-MM-DD', planId, note, entries:[{itemId, progId, sets:[{reps,seconds,weight}]}] }]
};

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw);
    return { ...structuredClone(DEFAULT), ...parsed };
  } catch (e) {
    console.warn("Store laden fehlgeschlagen, Standard wird genutzt.", e);
    return structuredClone(DEFAULT);
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Speichern fehlgeschlagen.", e);
  }
}

// Eindeutige ID ohne Date.now/Math.random-Abhaengigkeit an einer Stelle zentralisiert.
let idCounter = 0;
function uid(prefix) {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`;
}

// ---------- Getter ----------
export function getState() { return state; }
export function getSettings() { return state.settings; }
export function getMyItems() { return state.myItems; }
export function getPlans() { return state.plans; }
export function getSessions() { return state.sessions.slice().sort((a, b) => (a.date < b.date ? 1 : -1)); }

export function isMyItem(itemId) { return state.myItems.some((m) => m.itemId === itemId); }

// ---------- Einstellungen ----------
export function setTrainingDays(days) {
  state.settings.trainingDays = days.slice().sort();
  persist();
}
export function setName(name) { state.settings.name = name; persist(); }

// ---------- Meine Uebungen ----------
export function addMyItem(itemId, progId) {
  if (!isMyItem(itemId)) state.myItems.push({ itemId, progId: progId || null });
  persist();
}
export function removeMyItem(itemId) {
  state.myItems = state.myItems.filter((m) => m.itemId !== itemId);
  persist();
}
export function setItemProgression(itemId, progId) {
  const m = state.myItems.find((x) => x.itemId === itemId);
  if (m) { m.progId = progId; persist(); }
}

// ---------- Plaene ----------
export function addPlan(name, emoji, entries) {
  const plan = { id: uid("plan"), name, emoji: emoji || "🏋️", entries: entries || [] };
  state.plans.push(plan);
  persist();
  return plan;
}
export function updatePlan(id, patch) {
  const pl = state.plans.find((x) => x.id === id);
  if (pl) { Object.assign(pl, patch); persist(); }
}
export function deletePlan(id) {
  state.plans = state.plans.filter((x) => x.id !== id);
  persist();
}
export function getPlan(id) { return state.plans.find((x) => x.id === id) || null; }

// ---------- Sessions (Trainingseinheiten) ----------
export function createSession(date, planId) {
  const s = { id: uid("sess"), date, planId: planId || null, note: "", entries: [] };
  state.sessions.push(s);
  persist();
  return s;
}
export function getSession(id) { return state.sessions.find((x) => x.id === id) || null; }
export function saveSession(session) {
  const i = state.sessions.findIndex((x) => x.id === session.id);
  if (i >= 0) state.sessions[i] = session; else state.sessions.push(session);
  persist();
}
export function deleteSession(id) {
  state.sessions = state.sessions.filter((x) => x.id !== id);
  persist();
}
export function sessionsForDate(date) {
  return state.sessions.filter((x) => x.date === date);
}

// ---------- Analyse / Vergleich ----------
// Bester Wert eines Entries: hoechste Sekunden (hold) bzw. hoechste Reps (reps).
export function bestOfEntry(entry, type) {
  if (!entry || !entry.sets || !entry.sets.length) return null;
  const vals = entry.sets
    .map((s) => (type === "hold" ? s.seconds : s.reps))
    .filter((v) => typeof v === "number" && !isNaN(v));
  if (!vals.length) return null;
  return Math.max(...vals);
}

// Summe aller Reps (Trainingsvolumen fuer reps-Uebungen).
export function volumeOfEntry(entry) {
  if (!entry || !entry.sets) return 0;
  return entry.sets.reduce((sum, s) => sum + (s.reps || 0), 0);
}

// Findet die letzte Session VOR einer bestimmten (nach Datum), die dieses Item enthaelt.
// Gibt { session, entry, best } zurueck oder null.
export function previousResult(itemId, type, beforeDate, excludeSessionId) {
  const cands = state.sessions
    .filter((s) => s.id !== excludeSessionId && s.date <= beforeDate)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const s of cands) {
    const entry = s.entries.find((e) => e.itemId === itemId);
    if (entry) {
      const best = bestOfEntry(entry, type);
      if (best != null) return { session: s, entry, best };
    }
  }
  return null;
}

// Verlaufsdaten fuer einen Skill/Uebung: [{date, best}], chronologisch aufsteigend.
export function historyForItem(itemId, type) {
  return state.sessions
    .filter((s) => s.entries.some((e) => e.itemId === itemId))
    .map((s) => {
      const entry = s.entries.find((e) => e.itemId === itemId);
      return { date: s.date, best: bestOfEntry(entry, type), sets: entry.sets.length };
    })
    .filter((x) => x.best != null)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

// Persoenliche Bestleistung ueber alle Sessions.
export function personalBest(itemId, type) {
  const hist = historyForItem(itemId, type);
  if (!hist.length) return null;
  return Math.max(...hist.map((h) => h.best));
}

// Streak: aufeinanderfolgende Trainings-Tage (nach Datum, Luecke > 1 geplanter Rhythmus toleriert grob).
// Einfache Variante: Anzahl Tage von heute rueckwaerts mit Training, Kette bricht bei > 3 Tagen Pause.
export function trainingStreak(todayStr) {
  const dates = [...new Set(state.sessions.map((s) => s.date))].sort().reverse();
  if (!dates.length) return 0;
  let streak = 0;
  let cursor = todayStr;
  for (const d of dates) {
    const gap = dayDiff(d, cursor);
    if (gap <= 3) { streak += 1; cursor = d; }
    else break;
  }
  return streak;
}

export function totalSessions() { return state.sessions.length; }

// ---------- Export / Import ----------
export function exportJSON() { return JSON.stringify(state, null, 2); }
export function importJSON(text) {
  const parsed = JSON.parse(text);
  state = { ...structuredClone(DEFAULT), ...parsed };
  persist();
}
export function resetAll() { state = structuredClone(DEFAULT); persist(); }

// ---------- Datum-Helfer ----------
export function dayDiff(a, b) {
  // ganze Tage zwischen zwei YYYY-MM-DD
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.abs(Math.round((db - da) / 86400000));
}
