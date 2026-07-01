# Design-Spec — Trustydruck „NASSDRUCK" (2026-07-01, v2)

## Kontext
Erste Version (dunkles Neon-Template) wurde als „ideenlos/innovationslos" abgelehnt. Danach
zwei Zusatz-Anforderungen: **echte Animation im Hintergrund (WebGL/3D)** und Orientierung an
**Awwwards**-Niveau. Konzept-Workflow (6 Konzepte → 3 Jurys → Synthese) lieferte Print-/CMYK-
Richtungen; der Kunde wählte **„CMYK Ink-Fluid (WebGL-Shader)"**.

## Konzept „NASSDRUCK — Vier Farben, ein Handwerk"
Die Website ist eine lebende Vierfarb-Druckmaschine. Hero = WebGL2-Fluid: Cursor = Feder,
CMY-Farben bluten und mischen **echt subtraktiv** (Beer-Lambert), Farbe „trocknet" zurück
aufs Papier. Editoriales Print-Layout mit Register-/Schnittmarken, mono Auftrags-Slugs,
Proof-Rahmen („Gut zum Druck"), kinetische Titel, CMYK-Fehlregister auf Headlines.

## Entscheidungen
- **Hintergrund:** echte WebGL2-Navier–Stokes-Fluid-Simulation (self-hosted, kein Three.js/CDN nötig).
- **Grundton:** warmes Druckpapier (`#f4f1ea`) — hält Header/Text lesbar; Ink als Wet-Overlay.
- **Farbsystem:** CMYK-Tinten (C `#00aeef`, M `#ec008c`, Y `#ffd200`, K `#111`), Papier, Overlap-Blau `#2e3192`.
- **Typo:** Archivo Black (Display), Fraunces (editorial Serif), IBM Plex Mono (Labels/Zahlen) — self-hosted.
- **Leistungen ↔ Kanäle:** Leuchtreklame=C, Textildruck=M, Print&Medien=Y, Grafik&Logo=K.
- **Struktur:** Multi-Page (Home, Leistungen, Über uns, Kontakt, Impressum, Datenschutz).
- **Deployment:** GitHub Pages.

## Robustheit (wichtig gelernt)
- 16F-Framebuffer-Skalierung: Splat-Geschwindigkeiten müssen klein sein, sonst „explodiert"
  der Farbstoff und ist unsichtbar. Dye-Dissipation moderat → Ink bleibt sichtbar, dann trocknet.
- `data-ink-stage` NICHT absolut positionieren (sonst fällt der Hero aus dem Fluss).
- Lazy-Bilder brauchen definierte `aspect-ratio` am Rahmen, sonst laden sie nie (0-Höhe).
- Fallbacks: WebGL-Check, `prefers-reduced-motion`, `deviceMemory`, No-JS, Offscreen-Pause,
  FPS-Watchdog → statischer CSS-Ink-Fallback.

## Offen
Impressum/Datenschutz-Platzhalter `[ … ]` durch Trustydruck ergänzen + rechtlich prüfen.
