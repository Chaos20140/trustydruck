# CLAUDE.md — Arbeitsanleitung für Trustydruck (nur für mich, Claude)

> Mein persönliches Projekt-Handbuch. Hier stehen Kontext, Architektur, harte Learnings und
> das Vorgehen. **Immer aktuell halten**: Nach jeder Session/größeren Änderung ergänzen.

## Projekt
- **Kunde:** TRUSTYDRUCK – Print & Media, Werbeagentur in Meschede/Sauerland.
  Leistungen: Leuchtreklame, Textildruck, Print & Medien, Grafik & Logo.
- **Ziel:** Awwwards-würdige Marketing-Website. Logo + Originaltexte immer erhalten.
- **Repo:** `Chaos20140/trustydruck` (GitHub-Account des Users = **Chaos20140**, nicht "Trusty").
- **Live:** https://chaos20140.github.io/trustydruck/ (GitHub Pages, branch `main`, root).
- **Working dir:** `c:\Users\Tolun\Trusty` (Windows, PowerShell primär, Bash-Tool vorhanden).

## Kunden-Präferenzen (wichtig!)
- Will **dunkles** Design (helles Papier wurde abgelehnt).
- Will das **Logo groß**.
- Messlatte = **echte Awwwards-Seiten**: Preloader, Smooth-Scroll, choreografierte
  Scroll-Animationen, Custom-Cursor, magnetische Buttons, kinetische Typo, Glow, Grain.
- „Bau viele Features ein, die zu Grafikdesign passen und gut aussehen." → großzügig sein.
- Reagiert kritisch auf „generisch/templatehaft". Immer eine starke, eigene Art-Direction.

## Iterations-Historie
- **v1 „Electric Neon Studio"** (dunkel, CSS-only) → abgelehnt: „ideenlos, wie Template".
- **v2 „NASSDRUCK"** (helles Druckpapier + WebGL-Ink subtraktiv) → abgelehnt: zu hell, Logo zu klein, nicht Awwwards genug.
- **v3 „INK IN THE DARK"** (aktuell): dunkel, CMYK-Ink **glüht** (emissiv), GSAP+Lenis Motion,
  Preloader (Counter+Reveal), Custom-Cursor, magnetische Buttons, Parallax, Stats-Counter,
  großes Logo. Motion-Libs self-hosted in `assets/js/vendor/` (gsap, ScrollTrigger, lenis).
- **v4 „RASTER — Gut zum Druck"** (aktuell, Kunden-Pivot: HELL + dunkle Schrift + andere Animation):
  warmes Druckpapier (`--paper #f0eadc`), tiefschwarzer Text (`--ink #16130e`), EIN Spot-Rot (`--spot #da3a1f`).
  Signatur = **Halbton-Raster-Lupe** (`assets/js/raster.js`, Canvas2D, KEIN WebGL): Bild lebt als schwarze
  Rasterpunkte auf Papier; Cursor = Lupe, die lokal das Raster verdichtet, den Rasterwinkel auf 15° dreht und
  das Bild „in Register" entwickelt; roter Fokus-Ring; Klick = Impression-Ripple; Load = Wortmarke „druckt sich
  in Register" (Preloader, ersetzt Counter). Fonts: **Bricolage Grotesque** (Display, neu), Fraunces (Serif),
  IBM Plex Mono (Utility). Druck-Furniture: Schnittmarken, Kontrollstreifen („Bogen №"), 12-Spalten-Editorial,
  keine border-radius, Haarlinien. Bilder = echte Farbfotos mit Register-Wisch-Reveal (clip-path). Motion:
  Lenis + GSAP (splitHeading, reveals, parallax, marquee-skew, magnetic). Fallbacks: kein Canvas2D/JS/reduced-
  motion/low-mem → statisches Farb-`<img>`. **raster.js braucht same-origin Bilder** (getImageData sonst tainted).
- v3.1 „WOW everywhere": Die Tinte ist EIN globaler, fixierter WebGL-Hintergrund
  (`.ink-bg` in layout, `#ink`). Sektionen sind per Default **opak** (`background:var(--bg)`,
  lesbar); „Ink-Fenster" (`.ink-window`: Hero, Statement-Band, CTA, Galerie, `.page-hero`)
  sind transparent und lassen die Tinte durchleuchten. Pro-Sektion-Effekte (main.js, GSAP):
  Wort-Reveals (`splitHeading`), Bild-Clip-Mask-Reveals, 3D-Tilt (.proof/.sep-cell),
  Marquee-Skew nach Scroll-Tempo, Statement-Drift, **CMYK-Farbaufbau** (`[data-cmyk]`,
  `--cmyk` von 1→0 gescrubbt), Prozess-Linie zeichnet sich. Preloader nur **einmal pro Session**
  (`sessionStorage 'td_loaded'`, in head.js `html.preloaded` gesetzt → CSS blendet ihn sofort aus).
- **Service-Bilder (neu, Unsplash, lizenzfrei):** `svc-leuchtreklame.jpg` (Neon),
  `svc-print-medien.jpg` (Typo-Specimen), `svc-grafik.jpg` (Farbfächer/Logo-Studien).
  Unsplash-Download zuverlässig via `unsplash.com/photos/<shortId>/download?w=1200` (nicht IDs raten!).

## Feedback-Details (v3, unbedingt beachten)
- „Logo größer" heißt: nur die **Bildmarke** (`logo.png`, `.brand img`) — **NICHT** den
  Wortlaut „TRUSTYDRUCK" (`.brand .wm`). Aktuell: Marke 74px (Desktop) / 46px (mobil), Wortmarke ~1.5rem.
- Auf mobil dürfen sich **Logo/Wortmarke und Burger nicht überschneiden** → `.brand` bei
  `<=560px` verkleinern (img 46, wm 1.1rem). Nach Änderungen Geometrie prüfen (brand.right < burger.left).

## Architektur (Static Site, kein Runtime-Build, KEIN CDN)
```
build.mjs            → generiert *.html + sitemap.xml + robots.txt (node build.mjs)
src/layout.mjs       → <head> (CSP!), Slug/Crop-Marks, Preloader, Header, Footer, Icons, SITE/NAV
src/data.mjs         → SERVICES (↔ CMYK-Kanäle) + KEYWORDS  (Originaltexte verbatim)
src/components.mjs   → kicker/sepLabel/marquee/proof/ctaBand/whyRow …
src/pages/*.mjs      → Seiteninhalte (default export {slug,title,desc,body})
assets/js/head.js    → setzt html.js früh (vor Paint) — No-JS-Fallback-Schalter
assets/js/ink.js     → WebGL2-Fluid-Ink-Engine (glüht dunkel), window.TDInk.burst()
assets/js/main.js    → Preloader, Lenis, GSAP ScrollTrigger, Cursor, Magnetic, Menü, Form, Cookie
assets/js/vendor/    → gsap.min.js, ScrollTrigger.min.js, lenis.min.js (self-hosted!)
assets/css/style.css → Design-System (dark)
assets/css/fonts.css → @font-face (self-hosted, generiert von scripts/fetch-fonts.mjs)
assets/fonts/*.woff2  → Archivo Black · Fraunces · IBM Plex Mono (latin + latin-ext)
assets/img/*         → logo.png (weiß, transparent) + Produktbilder
scripts/fetch-fonts.mjs → lädt Google-Fonts einmalig lokal (dann committen)
```

### Build / Serve / Deploy
- `node build.mjs` nach jeder Änderung in `src/**` (HTML neu generieren). CSS/JS werden direkt
  referenziert → **kein** Rebuild nötig bei reinen CSS/JS-Edits (nur Browser-Reload).
- **Dev-Preview (bevorzugt):** `npm run dev` → `scripts/dev-preview.mjs` startet ein GUI unter
  http://127.0.0.1:4321/__preview mit **Desktop + iPhone nebeneinander**, **Live-Reload** und
  einem **Publish-Button**. Siehe Memory [[dev-preview-workflow]] — das ist der Standard für JEDES Projekt.
- Alternativ nur ansehen: `npx --yes serve -l 5173 .` (301 clean-URL-Redirects; Pages nicht — `.html`-Links korrekt).
- **Deploy-Disziplin:** NICHT mehr automatisch pushen. Der Kunde deployt über den **Publish-Button**
  (oder wenn er es ausdrücklich sagt). Publish macht `build → git add -A → commit → push origin main`.
  Pages baut dann automatisch (~30–90s). Status: `gh api repos/Chaos20140/trustydruck/pages --jq '.status'` bis `built`.
- gh ist authentifiziert als Chaos20140 (repo+workflow scopes). git-Identität ist global gesetzt.

## Design-System (dark)
- Farben: `--bg #060609`, Ink `#f4f4f7`, C `#00dffd`, M `#ff2f8e`, Y `#ffd23e`, Overlap-Blau `#4b53ff`.
- Typo: Archivo Black (Display/HUGE), Fraunces (Serif/Editorial-Copy + Akzente), IBM Plex Mono (Labels/Zahlen).
- Leistungen ↔ Druckfarben: Leuchtreklame=C, Textildruck=M, Print&Medien=Y, Grafik&Logo=K (`.chan-c/m/y/k`).
- Motiv: Register-/Schnittmarken, mono Auftrags-Slugs, „Gut zum Druck"-Proof-Rahmen, CMYK-Fehlregister auf Headlines.

## HARTE LEARNINGS (nicht nochmal reintappen)
1. **Ink-Engine Skalierung:** Splat-Geschwindigkeiten klein halten (< ~340). Zu hoch → Dye
   „explodiert" und ist unsichtbar (Alpha steigt, RGB=0). Dye-Dissipation moderat (~0.8) →
   Ink bleibt sichtbar und „trocknet" dann. Splat schreibt RGB nur bei niedriger Velocity.
2. **`data-ink-stage` NIEMALS `position:absolute`** geben — sonst fällt der Hero aus dem Flow
   und alle Sektionen stapeln oben. Hero = relativer Stage, nur `#ink` ist absolut inset:0.
3. **Lazy `<img>` braucht definierte Höhe** (`aspect-ratio` am Rahmen `.proof .inner`), sonst
   0-Höhe → nie im Viewport → lädt nie.
4. **CSP ist streng** (`script-src 'self'`): KEINE inline-Event-Handler (`onmouseover=…`),
   KEINE CDN-Scripts, KEIN Google Fonts `<link>`. Alles self-hosten. Nur `frame-src` erlaubt
   Google Maps. Inline-`style="…"`-Attribute sind ok (`style-src 'unsafe-inline'`).
5. **Logo** (`logo.png`) ist **weiß auf transparent**: auf hell → `filter:invert(1)`, auf dunkel → ohne Filter.
6. **Reveal-Gating:** Content per Default sichtbar; nur unter `html.gsap`/`html.js` verstecken,
   damit ohne JS/GSAP nichts unsichtbar bleibt. Preloader nur unter `html.js` zeigen.
7. **Headless-Test (Playwright):** WebGL2 läuft (ANGLE). `document.hidden=false`. FullPage-
   Screenshots triggern Lazy-Load unten NICHT zuverlässig → vorher durchscrollen. Zum Prüfen
   der Reveals langsam scrollen (IntersectionObserver-Timing).
8. **Windows/Bash:** `find`/`grep` sparsam; dedizierte Tools nutzen. LF→CRLF-Warnungen bei git sind harmlos.
9. **Headless (Playwright) meldet `pointer: coarse`** → Lenis/Custom-Cursor/Magnetic werden
   dort (korrekt) NICHT aktiv. Nur GSAP-Reveals/Preloader/Parallax/Counter laufen headless.
   Auf echtem Desktop (`pointer: fine`) laufen alle. Nicht drüber wundern.
10. **GSAP „target not found"-Warnungen** vermeiden: Selektor-Existenz prüfen bevor `gsap.set/to`
    (Hero-Targets gibt's nur auf der Home, nicht auf Subpages). Sonst laute (harmlose) Warnungen.
11. **`.btn` ohne `::before`-Fill** gebaut (reiner Background-Transition) — spart `<span>`-Wrapper
    in jedem Button. Nicht wieder ein z-index-Overlay einführen, das Text verdeckt.
12. **`serve` stirbt** manchmal (Background-Prozess) → vor Playwright-Tests neu starten
    (`npx --yes serve -l 5173 .`). HTTP 000 = Server tot.
13. **Preloader** muss bombensicher verschwinden: nur unter `html.js` zeigen, GSAP-Timeline
    + Hard-Timeout (6s) + `called`-Guard. Sonst kann die Seite „hängen".

## Robustheit / Fallbacks (immer beibehalten)
- Ink: WebGL2+Float-Check, sonst CSS-Ink-Fallback (`[data-ink-stage]::before`). Aus bei
  reduced-motion, `deviceMemory<=2`, No-JS. Pause offscreen/hidden. FPS-Watchdog → static.
- Motion: GSAP/Lenis nur wenn geladen; sonst native Scroll + sichtbarer Content.
- A11y: WCAG-AA-Kontrast, Gelb nie als Text, Fokus sichtbar, Alt-Texte, semantisches HTML.
- SEO: Title/Description je Seite, OG, JSON-LD (LocalBusiness), sitemap.xml, robots.txt.

## Offene Punkte
- Impressum/Datenschutz haben Platzhalter `[ … ]` (Inhabername, USt-IdNr.) → Kunde muss ergänzen + rechtlich prüfen.
- Optional später: eigene Domain trustydruck.de, echte Referenz-Fotos, „Nachtdruck"-Toggle.

## Arbeitsweise
- Skills: bei kreativer Arbeit erst brainstorming/relevante Skills. Prozess vor Umsetzung.
- Nach ~jeder 2. Anfrage kurzer Security-Check des zuletzt geänderten Codes (Hook verlangt das).
- Vor „fertig": lokal + live visuell verifizieren (Desktop + Mobile), Konsole 0 Fehler, CSP ok.
- Diese Datei nach relevanten Änderungen ergänzen.
