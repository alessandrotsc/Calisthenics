// Geteilte UI-Bausteine.
import { el, fmtSeconds } from "../core/util.js";

// ---------- Toast ----------
let toastTimer = null;
export function toast(msg) {
  const old = document.querySelector(".toast");
  if (old) old.remove();
  const t = el("div", { class: "toast", text: msg });
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 1900);
}

// ---------- Bottom-Sheet ----------
export function openSheet(title, contentNodes) {
  const existing = document.querySelector(".sheet-wrap");
  if (existing) existing.remove();
  const sheet = el("div", { class: "sheet" }, [
    el("div", { class: "sheet-grip" }),
    title ? el("h3", { class: "sheet-title", text: title }) : null,
    ...[].concat(contentNodes),
  ]);
  const wrap = el("div", { class: "sheet-wrap" }, [sheet]);
  wrap.addEventListener("click", (e) => { if (e.target === wrap) wrap.remove(); });
  document.body.appendChild(wrap);
  return wrap;
}
export function closeSheet() {
  const w = document.querySelector(".sheet-wrap");
  if (w) w.remove();
}

// ---------- Zahlen-Stepper ----------
// onChange(value). step default 1, min default 0.
export function stepper(value, onChange, { min = 0, step = 1, max = 9999 } = {}) {
  let v = value;
  const input = el("input", { attrs: { type: "number", inputmode: "numeric", value: String(v) } });
  const clampSet = (nv) => {
    v = Math.max(min, Math.min(max, nv));
    input.value = String(v);
    onChange(v);
  };
  input.addEventListener("input", () => {
    const nv = parseInt(input.value, 10);
    if (!isNaN(nv)) { v = Math.max(min, Math.min(max, nv)); onChange(v); }
  });
  input.addEventListener("blur", () => { if (input.value === "" || isNaN(parseInt(input.value, 10))) clampSet(min); });
  const minus = el("button", { text: "−", on: { click: () => clampSet(v - step) } });
  const plus = el("button", { text: "+", on: { click: () => clampSet(v + step) } });
  return el("div", { class: "stepper" }, [minus, input, plus]);
}

// ---------- Sparkline (Mini-Trend) ----------
export function sparkline(values) {
  const ns = "http://www.w3.org/2000/svg";
  const w = 90, h = 40, pad = 4;
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "spark");
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("preserveAspectRatio", "none");
  if (!values || values.length < 2) {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", pad); line.setAttribute("y1", h / 2);
    line.setAttribute("x2", w - pad); line.setAttribute("y2", h / 2);
    line.setAttribute("stroke", "rgba(159,184,207,0.3)"); line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "3 3");
    svg.appendChild(line);
    return svg;
  }
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (values.length - 1);
  const pts = values.map((val, i) => {
    const x = pad + i * stepX;
    const y = h - pad - ((val - min) / span) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#7fe3ee");
  path.setAttribute("stroke-width", "2.5");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-linecap", "round");
  svg.appendChild(path);
  // Endpunkt markieren
  const last = pts[pts.length - 1];
  const dot = document.createElementNS(ns, "circle");
  dot.setAttribute("cx", last[0]); dot.setAttribute("cy", last[1]); dot.setAttribute("r", "2.6");
  dot.setAttribute("fill", "#7fe3ee");
  svg.appendChild(dot);
  return svg;
}

// ---------- Vollständiges Verlaufsdiagramm ----------
// data: [{date, best}], type 'hold'|'reps'
export function progressChart(data, type) {
  const ns = "http://www.w3.org/2000/svg";
  const W = 320, H = 160, padL = 34, padR = 12, padT = 14, padB = 22;
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "chart-svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("preserveAspectRatio", "none");

  const defs = document.createElementNS(ns, "defs");
  defs.innerHTML = `<linearGradient id="grad-area" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2ecbe0" stop-opacity="0.45"/>
    <stop offset="100%" stop-color="#2ecbe0" stop-opacity="0"/></linearGradient>`;
  svg.appendChild(defs);

  if (!data.length) return svg;
  const vals = data.map((d) => d.best);
  const min = Math.min(...vals, 0), max = Math.max(...vals);
  const span = max - min || 1;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = data.length;
  const xOf = (i) => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yOf = (v) => padT + plotH - ((v - min) / span) * plotH;

  // Achsen (nur Grundlinie)
  const axis = document.createElementNS(ns, "line");
  axis.setAttribute("class", "chart-axis");
  axis.setAttribute("x1", padL); axis.setAttribute("y1", padT + plotH);
  axis.setAttribute("x2", W - padR); axis.setAttribute("y2", padT + plotH);
  svg.appendChild(axis);

  // Y-Labels: max und min
  const yLabels = [max, min + span / 2, min].map((v) => Math.round(v));
  [...new Set(yLabels)].forEach((v) => {
    const t = document.createElementNS(ns, "text");
    t.setAttribute("class", "chart-lbl");
    t.setAttribute("x", 2); t.setAttribute("y", yOf(v) + 3);
    t.textContent = type === "hold" ? fmtSeconds(v) : v;
    svg.appendChild(t);
  });

  const pts = data.map((d, i) => [xOf(i), yOf(d.best)]);
  const lineD = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  // Fläche
  const areaD = `${lineD} L${pts[pts.length - 1][0].toFixed(1)} ${padT + plotH} L${pts[0][0].toFixed(1)} ${padT + plotH} Z`;
  const area = document.createElementNS(ns, "path");
  area.setAttribute("class", "chart-area"); area.setAttribute("d", areaD);
  svg.appendChild(area);
  const line = document.createElementNS(ns, "path");
  line.setAttribute("class", "chart-line"); line.setAttribute("d", lineD);
  svg.appendChild(line);
  pts.forEach((p) => {
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("class", "chart-dot");
    c.setAttribute("cx", p[0]); c.setAttribute("cy", p[1]); c.setAttribute("r", "3");
    svg.appendChild(c);
  });
  return svg;
}

// ---------- Delta-Anzeige ----------
export function deltaNode(delta, type) {
  if (delta == null) return null;
  const unit = type === "hold" ? "s" : "";
  let cls = "same", txt = "±0";
  if (delta > 0) { cls = "up"; txt = `+${delta}${unit} ↑`; }
  else if (delta < 0) { cls = "down"; txt = `${delta}${unit} ↓`; }
  else { txt = `±0${unit}`; }
  return el("span", { class: `delta ${cls}`, text: txt });
}
