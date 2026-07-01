# TRUSTYDRUCK — Website („NASSDRUCK — Vier Farben, ein Handwerk")

Website für **Trustydruck – Print & Media**, Werbeagentur für hochwertige und individuelle
Bedruckungslösungen aus Meschede (Leuchtreklame, Textildruck, Print & Medien, Grafik & Logo).

**Live:** https://chaos20140.github.io/trustydruck/

---

## Konzept

Die Seite ist eine **lebende Vierfarb-Druckmaschine**. Der Hero ist eine echte
**WebGL2-Fluid-Simulation**: Der Cursor ist die Feder — Cyan, Magenta und Gelb bluten, wirbeln
und mischen sich in Echtzeit wie nasse Druckfarbe. Die Farbmischung ist **echt subtraktiv**
(Beer-Lambert): C+M→Blau, C+Y→Grün, M+Y→Rot — genau wie im echten Druck. Die Farbe „trocknet"
langsam zurück aufs warme Druckpapier.

Drumherum: ein **editoriales Print-Handwerk-Layout** — Schnitt- und Registermarken, mono
Auftrags-Slugs, „Gut zum Druck"-Proof-Rahmen, kinetisch verschiebbare Titel und ein
CMYK-Fehlregister-Effekt auf Überschriften. Die vier Leistungen sind den vier Druckfarben
zugeordnet: **Leuchtreklame = Cyan · Textildruck = Magenta · Print & Medien = Yellow ·
Grafik & Logo = Key/Schwarz**.

6 Seiten: **Home · Leistungen · Über uns · Kontakt · Impressum · Datenschutz**. Voll responsive
inkl. Mobile-Menü, Touch-Ink und Sticky-Action-Bar (Anrufen / WhatsApp). Logo und alle
Original­texte von der bestehenden Seite übernommen.

## Technik

Handgebautes **Static Site** (HTML/CSS/JS, kein Framework, kein Runtime-Build, keine CDN).
Ein Node-Generator setzt die Seiten aus wiederverwendbaren Bausteinen zu fertigem HTML zusammen.

```
build.mjs               → generiert index.html, leistungen.html, … (+ sitemap, robots)
src/layout.mjs          → <head>, Print-Furniture (Slug, Crop-Marks), Header, Footer, Icons
src/data.mjs            → Leistungen ↔ CMYK-Kanäle (Originaltexte)
src/components.mjs      → Proof-Frames, Marquee, CTA, Separations-Label …
src/pages/*.mjs         → Seiteninhalte
assets/js/ink.js        → WebGL2-Fluid-Ink-Engine (subtraktives CMY, Wet-Look, Fallbacks)
assets/js/main.js       → Menü, Reveal, kinetische Titel, Formular, Cookie
assets/js/head.js       → setzt html.js (No-JS-Fallback)
assets/css/style.css    → Design-System (Print/CMYK/Editorial)
assets/css/fonts.css    → selbst gehostete Schriften (@font-face)
assets/fonts/*.woff2    → Archivo Black · Fraunces · IBM Plex Mono (lokal, DSGVO)
assets/img/*            → Logo & Produktbilder (als „Proofs")
scripts/fetch-fonts.mjs → lädt die Google-Fonts einmalig lokal herunter
```

### Die Ink-Engine (`assets/js/ink.js`)

Echte Navier–Stokes-Fluid-Simulation in WebGL2 (Advektion, Vortizität, Druck-Jacobi,
Gradienten-Subtraktion). Der Farbstoff wird als **C/M/Y-Dichten** gespeichert und im
Display-Shader **subtraktiv** über warmes Papier gerechnet — dadurch echte Druckfarben-Mischung
plus „nasser" Glanz an den Farbrändern.

**Robustheit / Performance:**
- Läuft nur bei WebGL2 + Float-Buffern; sonst bleibt ein CSS-Ink-Fallback sichtbar.
- Deaktiviert bei `prefers-reduced-motion`, wenig Gerätespeicher und ohne JS.
- Geringere Auflösung auf Mobile; Pause wenn Hero außerhalb des Sichtfelds / Tab im Hintergrund.
- **FPS-Watchdog**: bei anhaltend niedriger Bildrate wird automatisch auf den statischen
  Fallback umgeschaltet.

### Entwicklung

```bash
npm run fonts   # einmalig: Schriften lokal laden (bereits geschehen)
npm run build   # HTML neu generieren
npm run serve   # lokal unter http://localhost:5173 ansehen
```

## Qualität & Datenschutz

- **Schriften selbst gehostet**, **keine CDN** → strenge Content-Security-Policy (`script-src 'self'`)
- `referrer`-Policy, `rel="noopener noreferrer"` auf externen Links, `object-src 'none'`
- **Kein JavaScript nötig**, um Inhalte zu sehen (Effekte sind Progressive Enhancement)
- Semantisches HTML, `prefers-reduced-motion`, sichtbarer Fokus, Alt-Texte, WCAG-AA-Kontrast
  (Gelb nie als Text)
- SEO: Title/Description je Seite, Open Graph, JSON-LD (LocalBusiness), `sitemap.xml`, `robots.txt`

## Noch zu ergänzen (durch Trustydruck)

In **Impressum** und **Datenschutz** sind einige Angaben als `[ … ]` markiert (u. a. Name des
Inhabers, ggf. USt-IdNr.). Bitte ergänzen und vor dem Live-Gang rechtlich prüfen.

---

© TRUSTYDRUCK – Print & Media. Logo und Texte © Trustydruck.
