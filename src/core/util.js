// Kleine Helfer für Datum, Zeit und DOM.

export const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export const WEEKDAYS_LONG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
export const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

// YYYY-MM-DD für ein Date-Objekt (lokale Zeit).
export function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayStr() { return ymd(new Date()); }

export function parseYmd(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function weekdayOf(dateStr) { return parseYmd(dateStr).getDay(); }

// "Mo, 15. Juli"
export function prettyDate(dateStr) {
  const d = parseYmd(dateStr);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}

// "vor 3 Tagen", "heute", "gestern"
export function relativeDays(dateStr, todayS) {
  const [ay, am, ad] = dateStr.split("-").map(Number);
  const [by, bm, bd] = todayS.split("-").map(Number);
  const diff = Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
  if (diff === 0) return "heute";
  if (diff === 1) return "gestern";
  if (diff < 0) return `in ${-diff} Tagen`;
  return `vor ${diff} Tagen`;
}

// Sekunden schön: 42s, 1:05, 2:03
export function fmtSeconds(sec) {
  if (sec == null) return "–";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Delta-Anzeige mit Vorzeichen
export function fmtDelta(delta, unit) {
  if (delta == null) return "";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}${unit}`;
}

// ---------- DOM ----------
export function el(tag, opts = {}, children = []) {
  const node = document.createElement(tag);
  if (opts.class) node.className = opts.class;
  if (opts.text != null) node.textContent = opts.text;
  if (opts.html != null) node.innerHTML = opts.html;
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  if (opts.on) for (const [k, v] of Object.entries(opts.on)) node.addEventListener(k, v);
  for (const c of [].concat(children)) if (c) node.appendChild(c);
  return node;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
