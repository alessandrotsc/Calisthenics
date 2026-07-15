// Archiv aller Skills und Übungen (Calisthenics / Eigengewicht).
// type: 'hold' = in Sekunden getrackt, 'reps' = in Wiederholungen getrackt.
// cat:  'skill' | 'pull' | 'push' | 'legs' | 'core'
// progressions: Stufen von leicht nach schwer (nur wo sinnvoll).
// Jede Übung hat eine stabile id. Namen/Labels auf Deutsch.

export const CATEGORIES = {
  skill: { name: "Skills", emoji: "⭐", hint: "Statische Halte-Skills" },
  pull:  { name: "Zug",    emoji: "🤚", hint: "Ziehen (Rücken, Bizeps)" },
  push:  { name: "Druck",  emoji: "💪", hint: "Drücken (Brust, Schulter, Trizeps)" },
  legs:  { name: "Beine",  emoji: "🦵", hint: "Beine und Po" },
  core:  { name: "Core",   emoji: "🔥", hint: "Rumpf und Bauch" },
};

// Kurzform für Progression-Objekte
const p = (id, name) => ({ id, name });

export const CATALOG = [
  // ---------- SKILLS (Holds) ----------
  {
    id: "front-lever", name: "Front Lever", emoji: "🔻", type: "hold", cat: "skill",
    level: "Fortgeschritten", muscles: ["Rücken", "Core"],
    info: "Waagerecht am Reck, Bauch zum Himmel, Körper gerade.",
    progressions: [
      p("tuck", "Tuck (angehockt)"),
      p("adv-tuck", "Advanced Tuck"),
      p("oneleg", "One Leg (ein Bein)"),
      p("straddle", "Straddle (Grätsche)"),
      p("full", "Full (gestreckt)"),
    ],
  },
  {
    id: "back-lever", name: "Back Lever", emoji: "🔼", type: "hold", cat: "skill",
    level: "Fortgeschritten", muscles: ["Rücken", "Schulter", "Core"],
    info: "Waagerecht, Bauch zum Boden, Körper gerade.",
    progressions: [
      p("tuck", "Tuck (angehockt)"),
      p("adv-tuck", "Advanced Tuck"),
      p("straddle", "Straddle (Grätsche)"),
      p("full", "Full (gestreckt)"),
    ],
  },
  {
    id: "planche", name: "Planche", emoji: "✈️", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Schulter", "Brust", "Core"],
    info: "Waagerecht über den Händen, Füße frei in der Luft.",
    progressions: [
      p("lean", "Planche Lean"),
      p("tuck", "Tuck Planche"),
      p("adv-tuck", "Advanced Tuck"),
      p("straddle", "Straddle (Grätsche)"),
      p("full", "Full Planche"),
    ],
  },
  {
    id: "handstand", name: "Handstand", emoji: "🤸", type: "hold", cat: "skill",
    level: "Fortgeschritten", muscles: ["Schulter", "Core"],
    info: "Freier Handstand, Balance über den Händen.",
    progressions: [
      p("wall", "An der Wand"),
      p("free", "Freistehend"),
      p("wall-oa", "One Arm an der Wand"),
      p("oa", "One Arm (einarmig)"),
    ],
  },
  {
    id: "human-flag", name: "Human Flag", emoji: "🏳️", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Schulter", "Core", "Rücken"],
    info: "Seitlich an der Stange, Körper waagerecht wie eine Fahne.",
    progressions: [
      p("chamber", "Chamber (angehockt)"),
      p("oneleg", "One Leg"),
      p("straddle", "Straddle (Grätsche)"),
      p("full", "Full Flag"),
    ],
  },
  {
    id: "l-sit", name: "L-Sit", emoji: "🪑", type: "hold", cat: "skill",
    level: "Anfänger", muscles: ["Core", "Hüfte", "Trizeps"],
    info: "Gestützt, Beine gerade nach vorn, Körper bildet ein L.",
    progressions: [
      p("foot", "Fuß am Boden"),
      p("oneleg", "One Leg"),
      p("tuck", "Tuck (angehockt)"),
      p("full", "Full L-Sit"),
      p("v-sit", "V-Sit"),
    ],
  },
  {
    id: "elbow-lever", name: "Elbow Lever", emoji: "🛋️", type: "hold", cat: "skill",
    level: "Anfänger", muscles: ["Schulter", "Core"],
    info: "Körper waagerecht, auf den Ellbogen abgestützt.",
    progressions: [ p("tuck", "Tuck"), p("straddle", "Straddle"), p("full", "Full") ],
  },
  {
    id: "dragon-flag", name: "Dragon Flag", emoji: "🐉", type: "hold", cat: "core",
    level: "Fortgeschritten", muscles: ["Core", "Rücken"],
    info: "Auf dem Rücken, Körper gerade nur auf Schulterblättern gehalten.",
    progressions: [ p("tuck", "Tuck"), p("straddle", "Straddle"), p("full", "Full") ],
  },
  {
    id: "iron-cross", name: "Iron Cross", emoji: "✝️", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Schulter", "Brust", "Rücken"],
    info: "An den Ringen, Arme waagerecht ausgestreckt.",
    progressions: [ p("assist", "Mit Band"), p("full", "Full Cross") ],
  },
  {
    id: "maltese", name: "Maltese", emoji: "🔱", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Brust", "Schulter", "Core"],
    info: "Körper waagerecht, Arme seitlich, sehr flache Stütze.",
    progressions: [ p("straddle", "Straddle"), p("full", "Full") ],
  },
  {
    id: "manna", name: "Manna", emoji: "🧘", type: "hold", cat: "skill",
    level: "Elite", muscles: ["Core", "Hüfte", "Schulter"],
    info: "Gestützt, Beine nach oben über den Kopf, extreme Kompression.",
    progressions: [ p("adv-lsit", "V-Sit"), p("full", "Full Manna") ],
  },
  {
    id: "plank", name: "Plank (Unterarmstütz)", emoji: "➖", type: "hold", cat: "core",
    level: "Anfänger", muscles: ["Core"],
    info: "Klassischer Unterarmstütz, Körper gerade.",
  },
  {
    id: "hollow-hold", name: "Hollow Hold", emoji: "🌙", type: "hold", cat: "core",
    level: "Anfänger", muscles: ["Core"],
    info: "Auf dem Rücken, Arme und Beine leicht angehoben, unterer Rücken am Boden.",
  },
  {
    id: "wall-sit", name: "Wall Sit", emoji: "🦵", type: "hold", cat: "legs",
    level: "Anfänger", muscles: ["Quadrizeps"],
    info: "Rücken an der Wand, Oberschenkel waagerecht.",
  },

  // ---------- ZUG (Pull) ----------
  {
    id: "pull-up", name: "Klimmzug", emoji: "🤾", type: "reps", cat: "pull",
    level: "Anfänger", muscles: ["Rücken", "Bizeps"], weight: true,
    info: "Obergriff, Kinn über die Stange.",
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
    level: "Anfänger", muscles: ["Bizeps", "Rücken"], weight: true,
    info: "Untergriff, mehr Bizeps.",
  },
  {
    id: "muscle-up", name: "Muscle-Up", emoji: "🚀", type: "reps", cat: "pull",
    level: "Fortgeschritten", muscles: ["Rücken", "Brust", "Trizeps"], weight: true,
    info: "Klimmzug in den Dip über die Stange.",
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
    level: "Anfänger", muscles: ["Rücken"], weight: true,
    info: "Schräg unter der Stange, Brust zur Stange ziehen.",
  },
  {
    id: "front-lever-row", name: "Front Lever Row", emoji: "🔻", type: "reps", cat: "pull",
    level: "Elite", muscles: ["Rücken", "Core"],
    info: "Aus dem Front Lever heraus ziehen.",
  },
  {
    id: "explosive-pull", name: "Explosiver Klimmzug", emoji: "💥", type: "reps", cat: "pull",
    level: "Fortgeschritten", muscles: ["Rücken"],
    info: "Explosiv hoch, Brust oder Hüfte zur Stange.",
  },

  // ---------- DRUCK (Push) ----------
  {
    id: "push-up", name: "Liegestütz", emoji: "🔽", type: "reps", cat: "push",
    level: "Anfänger", muscles: ["Brust", "Trizeps", "Schulter"], weight: true,
    info: "Klassischer Liegestütz, Körper gerade.",
    progressions: [
      p("knee", "Auf den Knien"),
      p("full", "Voll"),
      p("diamond", "Diamond (enge Hände)"),
      p("archer", "Archer"),
      p("pseudo", "Pseudo Planche"),
      p("oa", "One Arm"),
    ],
  },
  {
    id: "dip", name: "Dips (Barren)", emoji: "💪", type: "reps", cat: "push",
    level: "Anfänger", muscles: ["Brust", "Trizeps", "Schulter"], weight: true,
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
    level: "Anfänger", muscles: ["Schulter", "Trizeps"], weight: true,
    info: "Hüfte hoch, Kopf Richtung Boden. Vorstufe zum HSPU.",
  },
  {
    id: "hspu", name: "Handstand Push-Up", emoji: "🤸", type: "reps", cat: "push",
    level: "Fortgeschritten", muscles: ["Schulter", "Trizeps"], weight: true,
    info: "Liegestütz im Handstand an der Wand oder frei.",
    progressions: [ p("wall", "An der Wand"), p("deficit", "Mit Erhöhung"), p("free", "Freistehend") ],
  },
  {
    id: "pseudo-planche-pushup", name: "Pseudo Planche Push-Up", emoji: "✈️", type: "reps", cat: "push",
    level: "Fortgeschritten", muscles: ["Schulter", "Brust", "Core"],
    info: "Hände an der Hüfte, weit nach vorn gelehnt. Aufbau für Planche.",
  },

  // ---------- BEINE (Legs) ----------
  {
    id: "squat", name: "Kniebeuge", emoji: "🦵", type: "reps", cat: "legs",
    level: "Anfänger", muscles: ["Quadrizeps", "Po"], weight: true,
    info: "Tiefe Kniebeuge, Rücken gerade.",
  },
  {
    id: "pistol-squat", name: "Pistol Squat", emoji: "🔫", type: "reps", cat: "legs",
    level: "Fortgeschritten", muscles: ["Quadrizeps", "Po", "Balance"], weight: true,
    info: "Einbeinige Kniebeuge, anderes Bein gerade nach vorn.",
    progressions: [ p("box", "Auf Box"), p("assist", "Mit Halt"), p("full", "Full") ],
  },
  {
    id: "bulgarian", name: "Bulgarian Split Squat", emoji: "🦵", type: "reps", cat: "legs",
    level: "Anfänger", muscles: ["Quadrizeps", "Po"], weight: true,
    info: "Hinteres Bein erhöht, vorderes Bein arbeitet.",
  },
  {
    id: "nordic-curl", name: "Nordic Curl", emoji: "🦵", type: "reps", cat: "legs",
    level: "Fortgeschritten", muscles: ["Beinbeuger"],
    info: "Füße fixiert, langsam nach vorn absenken.",
  },
  {
    id: "calf-raise", name: "Wadenheben", emoji: "🦶", type: "reps", cat: "legs",
    level: "Anfänger", muscles: ["Waden"], weight: true,
    info: "Auf die Zehenspitzen hoch.",
  },

  // ---------- CORE ----------
  {
    id: "hanging-leg-raise", name: "Hanging Leg Raise", emoji: "🦵", type: "reps", cat: "core",
    level: "Anfänger", muscles: ["Core", "Hüfte"],
    info: "Hängend die Beine anheben.",
    progressions: [ p("knee", "Knie anziehen"), p("straight", "Beine gerade"), p("ttb", "Toes to Bar") ],
  },
  {
    id: "toes-to-bar", name: "Toes to Bar", emoji: "🦶", type: "reps", cat: "core",
    level: "Fortgeschritten", muscles: ["Core"],
    info: "Zehen bis zur Stange anheben.",
  },
  {
    id: "leg-raise", name: "Beinheben (liegend)", emoji: "🛏️", type: "reps", cat: "core",
    level: "Anfänger", muscles: ["Core"],
    info: "Auf dem Rücken die Beine heben und senken.",
  },
  {
    id: "windshield", name: "Windshield Wiper", emoji: "🔄", type: "reps", cat: "core",
    level: "Fortgeschritten", muscles: ["Core", "Schräge Bauch"],
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
