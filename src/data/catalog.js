// Archiv aller Skills und Uebungen (Calisthenics / Eigengewicht).
// type: 'hold' = in Sekunden getrackt, 'reps' = in Wiederholungen getrackt.
// cat:  'skill' | 'pull' | 'push' | 'legs' | 'core'
// progressions: Stufen von leicht nach schwer (nur wo sinnvoll).
// Jede Uebung hat eine stabile id. Namen/Labels auf Deutsch.

export const CATEGORIES = {
  skill: { name: "Skills", emoji: "⭐", hint: "Statische Halte-Skills" },
  pull:  { name: "Zug",    emoji: "🤚", hint: "Ziehen (Ruecken, Bizeps)" },
  push:  { name: "Druck",  emoji: "💪", hint: "Druecken (Brust, Schulter, Trizeps)" },
  legs:  { name: "Beine",  emoji: "🦵", hint: "Beine und Po" },
  core:  { name: "Core",   emoji: "🔥", hint: "Rumpf und Bauch" },
};

// Kurzform fuer Progression-Objekte
const p = (id, name) => ({ id, name });

export const CATALOG = [
  // ---------- SKILLS (Holds) ----------
  {
    id: "front-lever", name: "Front Lever", emoji: "🔻", type: "hold", cat: "skill",
    level: "Fortgeschritten", muscles: ["Ruecken", "Core"],
    info: "Waagerecht am Reck, Bauch zum Himmel, Koerper gerade.",
    progressions: [
      p("tuck", "Tuck (angehockt)"),
      p("adv-tuck", "Advanced Tuck"),
      p("oneleg", "One Leg (ein Bein)"),
      p("straddle", "Straddle (Graetsche)"),
      p("full", "Full (gestreckt)"),
    ],
  },
  {
    id: "back-lever", name: "Back Lever", emoji: "🔼", type: "hold", cat: "skill",
    level: "Fortgeschritten", muscles: ["Ruecken", "Schulter", "Core"],
    info: "Waagerecht, Bauch zum Boden, Koerper gerade.",
    progressions: [
      p("tuck", "Tuck (angehockt)"),
      p("adv-tuck", "Advanced Tuck"),
      p("straddle", "Straddle (Graetsche)"),
      p("full", "Full (gestreckt)"),
    ],
  },
  {
    id: "planche", name: "Planche", emoji: "✈️", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Schulter", "Brust", "Core"],
    info: "Waagerecht ueber den Haenden, Fuesse frei in der Luft.",
    progressions: [
      p("lean", "Planche Lean"),
      p("tuck", "Tuck Planche"),
      p("adv-tuck", "Advanced Tuck"),
      p("straddle", "Straddle (Graetsche)"),
      p("full", "Full Planche"),
    ],
  },
  {
    id: "handstand", name: "Handstand", emoji: "🤸", type: "hold", cat: "skill",
    level: "Fortgeschritten", muscles: ["Schulter", "Core"],
    info: "Freier Handstand, Balance ueber den Haenden.",
    progressions: [
      p("wall", "An der Wand"),
      p("free", "Freistehend"),
      p("wall-oa", "One Arm an der Wand"),
      p("oa", "One Arm (einarmig)"),
    ],
  },
  {
    id: "human-flag", name: "Human Flag", emoji: "🏳️", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Schulter", "Core", "Ruecken"],
    info: "Seitlich an der Stange, Koerper waagerecht wie eine Fahne.",
    progressions: [
      p("chamber", "Chamber (angehockt)"),
      p("oneleg", "One Leg"),
      p("straddle", "Straddle (Graetsche)"),
      p("full", "Full Flag"),
    ],
  },
  {
    id: "l-sit", name: "L-Sit", emoji: "🪑", type: "hold", cat: "skill",
    level: "Anfaenger", muscles: ["Core", "Huefte", "Trizeps"],
    info: "Gestuetzt, Beine gerade nach vorn, Koerper bildet ein L.",
    progressions: [
      p("foot", "Fuss am Boden"),
      p("oneleg", "One Leg"),
      p("tuck", "Tuck (angehockt)"),
      p("full", "Full L-Sit"),
      p("v-sit", "V-Sit"),
    ],
  },
  {
    id: "elbow-lever", name: "Elbow Lever", emoji: "🛋️", type: "hold", cat: "skill",
    level: "Anfaenger", muscles: ["Schulter", "Core"],
    info: "Koerper waagerecht, auf den Ellbogen abgestuetzt.",
    progressions: [ p("tuck", "Tuck"), p("straddle", "Straddle"), p("full", "Full") ],
  },
  {
    id: "dragon-flag", name: "Dragon Flag", emoji: "🐉", type: "hold", cat: "core",
    level: "Fortgeschritten", muscles: ["Core", "Ruecken"],
    info: "Auf dem Ruecken, Koerper gerade nur auf Schulterblaettern gehalten.",
    progressions: [ p("tuck", "Tuck"), p("straddle", "Straddle"), p("full", "Full") ],
  },
  {
    id: "iron-cross", name: "Iron Cross", emoji: "✝️", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Schulter", "Brust", "Ruecken"],
    info: "An den Ringen, Arme waagerecht ausgestreckt.",
    progressions: [ p("assist", "Mit Band"), p("full", "Full Cross") ],
  },
  {
    id: "maltese", name: "Maltese", emoji: "🔱", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Brust", "Schulter", "Core"],
    info: "Koerper waagerecht, Arme seitlich, sehr flache Stuetze.",
    progressions: [ p("straddle", "Straddle"), p("full", "Full") ],
  },
  {
    id: "manna", name: "Manna", emoji: "🧘", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Core", "Huefte", "Schulter"],
    info: "Gestuetzt, Beine nach oben ueber den Kopf, extreme Kompression.",
    progressions: [ p("adv-lsit", "V-Sit"), p("full", "Full Manna") ],
  },
  {
    id: "plank", name: "Plank (Unterarmstuetz)", emoji: "➖", type: "hold", cat: "core",
    level: "Anfaenger", muscles: ["Core"],
    info: "Klassischer Unterarmstuetz, Koerper gerade.",
  },
  {
    id: "hollow-hold", name: "Hollow Hold", emoji: "🌙", type: "hold", cat: "core",
    level: "Anfaenger", muscles: ["Core"],
    info: "Auf dem Ruecken, Arme und Beine leicht angehoben, unterer Ruecken am Boden.",
  },
  {
    id: "wall-sit", name: "Wall Sit", emoji: "🦵", type: "hold", cat: "legs",
    level: "Anfaenger", muscles: ["Quadrizeps"],
    info: "Ruecken an der Wand, Oberschenkel waagerecht.",
  },

  // ---------- ZUG (Pull) ----------
  {
    id: "pull-up", name: "Klimmzug", emoji: "🤾", type: "reps", cat: "pull",
    level: "Anfaenger", muscles: ["Ruecken", "Bizeps"], weight: true,
    info: "Obergriff, Kinn ueber die Stange.",
    progressions: [
      p("negativ", "Negativ (langsam runter)"),
      p("band", "Mit Band"),
      p("full", "Voll"),
      p("weighted", "Mit Zusatzgewicht"),
      p("archer", "Archer"),
      p("oa", "One Arm (einarmig)"),
    ],
  },
  {
    id: "chin-up", name: "Chin-Up (Untergriff)", emoji: "🤾", type: "reps", cat: "pull",
    level: "Anfaenger", muscles: ["Bizeps", "Ruecken"], weight: true,
    info: "Untergriff, mehr Bizeps.",
  },
  {
    id: "muscle-up", name: "Muscle-Up", emoji: "🚀", type: "reps", cat: "pull",
    level: "Fortgeschritten", muscles: ["Ruecken", "Brust", "Trizeps"], weight: true,
    info: "Klimmzug in den Dip ueber die Stange.",
    progressions: [
      p("negativ", "Negativ"),
      p("band", "Mit Band"),
      p("bar", "Bar Muscle-Up"),
      p("ring", "Ring Muscle-Up"),
      p("strict", "Strict (ohne Schwung)"),
    ],
  },
  {
    id: "row", name: "Australian Row (Ruderzug)", emoji: "🛶", type: "reps", cat: "pull",
    level: "Anfaenger", muscles: ["Ruecken"], weight: true,
    info: "Schraeg unter der Stange, Brust zur Stange ziehen.",
  },
  {
    id: "front-lever-row", name: "Front Lever Row", emoji: "🔻", type: "reps", cat: "pull",
    level: "Elite", muscles: ["Ruecken", "Core"],
    info: "Aus dem Front Lever heraus ziehen.",
  },
  {
    id: "explosive-pull", name: "Explosiver Klimmzug", emoji: "💥", type: "reps", cat: "pull",
    level: "Fortgeschritten", muscles: ["Ruecken"],
    info: "Explosiv hoch, Brust oder Huefte zur Stange.",
  },

  // ---------- DRUCK (Push) ----------
  {
    id: "push-up", name: "Liegestuetz", emoji: "🔽", type: "reps", cat: "push",
    level: "Anfaenger", muscles: ["Brust", "Trizeps", "Schulter"], weight: true,
    info: "Klassischer Liegestuetz, Koerper gerade.",
    progressions: [
      p("knee", "Auf den Knien"),
      p("full", "Voll"),
      p("diamond", "Diamond (enge Haende)"),
      p("archer", "Archer"),
      p("pseudo", "Pseudo Planche"),
      p("oa", "One Arm"),
    ],
  },
  {
    id: "dip", name: "Dips (Barren)", emoji: "💪", type: "reps", cat: "push",
    level: "Anfaenger", muscles: ["Brust", "Trizeps", "Schulter"], weight: true,
    info: "Am Barren absenken bis Schulter unter Ellbogen.",
    progressions: [
      p("bench", "Bench Dips"),
      p("band", "Mit Band"),
      p("bar", "Barren"),
      p("straight", "Straight Bar Dip"),
      p("ring", "Ring Dips"),
      p("weighted", "Mit Zusatzgewicht"),
    ],
  },
  {
    id: "pike-push-up", name: "Pike Push-Up", emoji: "🔺", type: "reps", cat: "push",
    level: "Anfaenger", muscles: ["Schulter", "Trizeps"], weight: true,
    info: "Huefte hoch, Kopf Richtung Boden. Vorstufe zum HSPU.",
  },
  {
    id: "hspu", name: "Handstand Push-Up", emoji: "🤸", type: "reps", cat: "push",
    level: "Fortgeschritten", muscles: ["Schulter", "Trizeps"], weight: true,
    info: "Liegestuetz im Handstand an der Wand oder frei.",
    progressions: [ p("wall", "An der Wand"), p("deficit", "Mit Erhoehung"), p("free", "Freistehend") ],
  },
  {
    id: "pseudo-planche-pushup", name: "Pseudo Planche Push-Up", emoji: "✈️", type: "reps", cat: "push",
    level: "Fortgeschritten", muscles: ["Schulter", "Brust", "Core"],
    info: "Haende an der Huefte, weit nach vorn gelehnt. Aufbau fuer Planche.",
  },

  // ---------- BEINE (Legs) ----------
  {
    id: "squat", name: "Kniebeuge", emoji: "🦵", type: "reps", cat: "legs",
    level: "Anfaenger", muscles: ["Quadrizeps", "Po"], weight: true,
    info: "Tiefe Kniebeuge, Ruecken gerade.",
  },
  {
    id: "pistol-squat", name: "Pistol Squat", emoji: "🔫", type: "reps", cat: "legs",
    level: "Fortgeschritten", muscles: ["Quadrizeps", "Po", "Balance"], weight: true,
    info: "Einbeinige Kniebeuge, anderes Bein gerade nach vorn.",
    progressions: [ p("box", "Auf Box"), p("assist", "Mit Halt"), p("full", "Full") ],
  },
  {
    id: "bulgarian", name: "Bulgarian Split Squat", emoji: "🦵", type: "reps", cat: "legs",
    level: "Anfaenger", muscles: ["Quadrizeps", "Po"], weight: true,
    info: "Hinteres Bein erhoeht, vorderes Bein arbeitet.",
  },
  {
    id: "nordic-curl", name: "Nordic Curl", emoji: "🦵", type: "reps", cat: "legs",
    level: "Fortgeschritten", muscles: ["Beinbeuger"],
    info: "Fuesse fixiert, langsam nach vorn absenken.",
  },
  {
    id: "calf-raise", name: "Wadenheben", emoji: "🦶", type: "reps", cat: "legs",
    level: "Anfaenger", muscles: ["Waden"], weight: true,
    info: "Auf die Zehenspitzen hoch.",
  },

  // ---------- CORE ----------
  {
    id: "hanging-leg-raise", name: "Hanging Leg Raise", emoji: "🦵", type: "reps", cat: "core",
    level: "Anfaenger", muscles: ["Core", "Huefte"],
    info: "Haengend die Beine anheben.",
    progressions: [ p("knee", "Knie anziehen"), p("straight", "Beine gerade"), p("ttb", "Toes to Bar") ],
  },
  {
    id: "toes-to-bar", name: "Toes to Bar", emoji: "🦶", type: "reps", cat: "core",
    level: "Fortgeschritten", muscles: ["Core"],
    info: "Zehen bis zur Stange anheben.",
  },
  {
    id: "leg-raise", name: "Beinheben (liegend)", emoji: "🛏️", type: "reps", cat: "core",
    level: "Anfaenger", muscles: ["Core"],
    info: "Auf dem Ruecken die Beine heben und senken.",
  },
  {
    id: "windshield", name: "Windshield Wiper", emoji: "🔄", type: "reps", cat: "core",
    level: "Fortgeschritten", muscles: ["Core", "Schraege Bauch"],
    info: "Beine wie ein Scheibenwischer seitlich bewegen.",
  },
  {
    id: "ab-wheel", name: "Ab Wheel Rollout", emoji: "⚙️", type: "reps", cat: "core",
    level: "Fortgeschritten", muscles: ["Core"],
    info: "Mit dem Rad nach vorn ausrollen.",
  },
];

// Lookup-Helfer
const BY_ID = Object.fromEntries(CATALOG.map((x) => [x.id, x]));
export function getItem(id) { return BY_ID[id] || null; }
export function itemsByCat(cat) { return CATALOG.filter((x) => x.cat === cat); }
export function progressionName(item, progId) {
  if (!item || !item.progressions) return "";
  const pr = item.progressions.find((x) => x.id === progId);
  return pr ? pr.name : "";
}
