# TRUSTYDRUCK — Website (Electric Neon Studio)

Redesign der Website für **Trustydruck – Print & Media**, Werbeagentur für hochwertige und
individuelle Bedruckungslösungen aus Meschede (Leuchtreklame, Textildruck, Print & Medien,
Grafik & Design).

**Live:** https://chaos20140.github.io/trustydruck/

---

## Konzept

Kreative Richtung **„Electric Neon Studio“** — dunkles, kinetisches Design mit elektrischem
Cyan-Blau (aus dem Logo) und echtem Neon-Glow, der die *Leuchtreklame*-Kompetenz zum Leitmotiv
der ganzen Seite macht. Bold, kondensierte Display-Typografie (Anton) trifft auf sauberes Inter.

- 6 Seiten: **Home · Leistungen · Über uns · Kontakt · Impressum · Datenschutz**
- Voll responsive inkl. eigener Mobile-Navigation & Sticky-Action-Bar (Anrufen / WhatsApp)
- Alle Originaltexte und das Logo von der bestehenden Seite übernommen
- Scroll-Reveals, Marquee-Ticker, Custom-Cursor-Glow, animierte Zahlen

## Technik

Handgebautes **Static Site** (HTML/CSS/JS, kein Framework, kein Runtime-Build). Ein kleiner
Node-Generator setzt die Seiten aus wiederverwendbaren Bausteinen zu fertigem, statischem HTML
zusammen — genau das, was deployt wird.

```
build.mjs              → generiert index.html, leistungen.html, … (+ sitemap, robots)
src/
  layout.mjs           → <head>, Header, Mobile-Menü, Footer, Cookie-Hinweis, Icons
  data.mjs             → Leistungen + Keywords (Originaltexte)
  components.mjs       → wiederverwendbare Blöcke (Cards, CTA, Marquee …)
  pages/*.mjs          → Seiteninhalte
assets/
  css/style.css        → Design-System & Komponenten
  css/fonts.css        → selbst gehostete Schriften (@font-face)
  js/head.js           → setzt html.js (No-JS-Fallback)
  js/main.js           → Interaktionen (Menü, Reveal, Cursor, Formular …)
  fonts/*.woff2        → Anton, Inter, Space Grotesk (lokal, DSGVO-freundlich)
  img/*                → Logo & Produktbilder
scripts/fetch-fonts.mjs → lädt die Google-Fonts einmalig lokal herunter
```

### Entwicklung

```bash
npm run fonts   # einmalig: Schriften lokal herunterladen (bereits geschehen)
npm run build   # HTML neu generieren
npm run serve   # lokal unter http://localhost:5173 ansehen
```

## Qualität & Datenschutz

- **Schriften selbst gehostet** — keine Anfragen an Google Fonts (DSGVO-freundlich)
- **Content-Security-Policy**, `referrer`-Policy, `rel="noopener noreferrer"` auf externen Links
- **Kein JavaScript nötig**, um Inhalte zu sehen (Reveal-Effekte sind reine Progressive Enhancement)
- Semantisches HTML, `prefers-reduced-motion`-Support, sichtbarer Fokus, Alt-Texte
- SEO: Title/Description je Seite, Open Graph, JSON-LD (LocalBusiness), `sitemap.xml`, `robots.txt`

## Noch zu ergänzen (durch Trustydruck)

In **Impressum** und **Datenschutz** sind einige Angaben als `[ … ]` markiert
(u. a. Name des Inhabers, ggf. USt-IdNr.). Bitte ergänzen und vor dem Live-Gang rechtlich prüfen.

---

© TRUSTYDRUCK – Print & Media. Logo und Texte © Trustydruck.
