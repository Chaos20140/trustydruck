# Design-Spec — Trustydruck Redesign (2026-07-01)

## Ausgangslage
Bestehende Wix-Seite (trustydruck.de) einer Werbeagentur für hochwertige, individuelle
Bedruckungslösungen in Meschede. Analyse übernommen: Logo (weißes „Blade“-Zeichen +
Wortmarke TRUSTY/DRUCK), Marken-DNA schwarz + elektrisches Cyan-Blau, 3 Leistungen
(Leuchtreklame, Textildruck, Print & Medien) sowie alle Originaltexte und Kontaktdaten.

## Entscheidungen
- **Ästhetik:** „Electric Neon Studio“ (dunkel, Neon-Glow als Leitmotiv zur Leuchtreklame).
- **Struktur:** Multi-Page — Home, Leistungen, Über uns, Kontakt, Impressum, Datenschutz.
- **Technik:** Statisch (HTML/CSS/JS), Node-Generator, kein Runtime-Build.
- **Deployment:** GitHub Pages.
- **Referenzen „bisherige Projekte“:** liegen lokal nicht vor → Premium-Richtung nach
  modernem Agentur-Standard, aufbauend auf der bestehenden Marken-DNA.

## Designsystem
- Farben: `--bg:#05060a`, Ink `#eef2f8`, Brand `#18b6f3` / `#3ee0ff`, Glow-Effekte.
  Sparsame CMYK-Akzente (Magenta/Lime/Amber) als Print-Nod.
- Typografie: Anton (Display, kondensiert), Inter (Body/UI), Space Grotesk (Labels/Zahlen).
- Komponenten: Header + Mobile-Overlay, Hero, Marquee, Service-Cards, Split-Sections,
  Trust-/Process-/Gallery-Grids, CTA-Band, Kontaktformular + Map, Footer, Cookie-Hinweis.
- Motion: Scroll-Reveal (IntersectionObserver), Custom-Cursor, animierte Zähler,
  respektiert `prefers-reduced-motion`.

## Bilder
Echte Assets von der Seite: Logo, beleuchtetes Trustydruck-Schild (Hero), LED-Leuchtbuchstaben,
bestickte Firmenjacke, Grafikdesign-Splash, bedruckter Werbeschirm. Zusätzliche Atmosphäre
rein über CSS (Neon/Glow/Grain) statt fremder, urheberrechtlich geschützter Dribbble-Shots.

## Qualität
Selbst gehostete Schriften (DSGVO), CSP + Security-Header, No-JS-Fallback, SEO (Meta, OG,
JSON-LD, Sitemap), Accessibility (Fokus, Alt-Texte, semantisches HTML).

## Offen
Impressum/Datenschutz enthalten Platzhalter `[ … ]` (Inhabername, USt-IdNr.) — durch
Trustydruck zu ergänzen und rechtlich zu prüfen.
