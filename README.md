# Calisthenics-Tracker

Private PWA zum Tracken von Eigengewichts-Training: Trainingsplan mit Wiederholungen und Halte-Skills in Sekunden, Kalender, Fortschritt im Vergleich zum letzten Training.

## Idee

- **Skills (Holds):** Front Lever, Back Lever, Planche, Handstand, Human Flag, L-Sit, Iron Cross usw. werden in **Sekunden** getrackt, inkl. Progression (z.B. Tuck bis Full).
- **Uebungen (Reps):** Klimmzug, Muscle-Up, Dips, Pistol Squat usw. werden in **Wiederholungen** getrackt (optional mit Zusatzgewicht).
- Bei jedem Training traegst du die Zeit oder Wiederholungen ein und siehst sofort den **Vergleich zum letzten Mal** (z.B. +4s).
- **Kalender** markiert Trainingstage und erledigte Einheiten.
- **Archiv** mit allen Skills und Uebungen, du waehlst dein persoenliches Set ("Meine").
- **Plaene** buendeln Lieblingsuebungen fuer den schnellen Start.

## Technik

Reines HTML/CSS/JS (ES-Module), **kein Build**, offline-faehig (Service Worker), Daten in `localStorage`, Backup als JSON-Export/Import. Design-Familie Syncrate (dunkles Marineblau + Tuerkis).

## Lokal starten

```bash
cd "~/Desktop/Privat/Calisthenics"
python3 -m http.server 8891
# dann http://localhost:8891 im Browser oeffnen
```

## Struktur

```
index.html            App-Shell + Service-Worker-Registrierung
manifest.webmanifest  PWA-Manifest
sw.js                 Offline-Cache (bei Deploy CACHE-Version hochzaehlen)
src/
  styles.css          Design (Syncrate dark)
  app.js              Router + Bottom-Navigation
  core/
    store.js          Persistenz + Vergleichslogik (localStorage)
    util.js           Datum/Zeit/DOM-Helfer
  data/
    catalog.js        Archiv aller Skills und Uebungen
  ui/
    components.js     Stepper, Sparkline, Chart, Sheet, Toast
    screens_home.js       Startseite "Heute"
    screens_session.js    Training starten + Live-Logger (mit Timer)
    screens_library.js    Meine / Archiv / Detail mit Verlauf
    screens_calendar.js   Monatskalender
    screens_more.js       Einstellungen, Plaene, Export/Import
tools/
  make_icon.py        App-Icon-Generator (Front-Lever-Silhouette)
assets/               App-Icons
```

## Icon neu bauen

```bash
python3 tools/make_icon.py
```

## Offen / Ideen

- Echtes Logo und exakte Markenfarben aus der Syncrate-Website ziehen.
- Ruhezeiten-Timer zwischen Saetzen, Wochen-/Monatsziele, Foto/Video pro Skill.
- Deploy als GitHub Pages (wie Instrumente/Sprachen-App).
