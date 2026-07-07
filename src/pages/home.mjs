import { ICON, SITE } from "../layout.mjs";
import { SERVICES } from "../data.mjs";
import { marquee, ctaBand, whyBand, reviews, kicker, statement, plate, rasterFigure } from "../components.mjs";

const hero = `
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-copy">
        ${kicker("Werbeagentur · Meschede · Sauerland")}
        <h1 class="display">
          <span class="line"><span>Ihre Agentur</span></span>
          <span class="line"><span>für <em>Werbung</em>.</span></span>
        </h1>
        <p class="lede" data-hero-fade>Willkommen bei Trustydruck, Ihrer Werbeagentur für hochwertige und individuelle Bedruckungslösungen. Von Leuchtreklame über Textildruck bis Print &amp; Medien bringen wir Ihre Ideen zum Leben.</p>
        <div class="btn-row" data-hero-fade>
          <a class="btn magnetic" href="leistungen.html">Leistungen entdecken ${ICON.arrow}</a>
          <a class="btn btn--ghost magnetic" href="kontakt.html">Kontakt aufnehmen</a>
        </div>
        <div class="hero-badges" data-hero-fade>
          <span class="chip"><i></i>LED-Leuchtreklame</span>
          <span class="chip"><i></i>Siebdruck &amp; Stickerei</span>
          <span class="chip"><i></i>Banner &amp; Großformat</span>
          <span class="chip"><i></i>Grafik &amp; Logo</span>
        </div>
        <div class="scroll-cue" data-hero-fade><span class="ln"></span>Scrollen &amp; entdecken</div>
      </div>
      <div class="hero-media" data-hero-fade>
        ${rasterFigure("assets/img/gallery-1.jpg", { alt: "Beleuchtete Trustydruck-Leuchtreklame", mark: "Andruck № 01", hint: "Fadenzähler · bewegen", gl: true })}
      </div>
    </div>
  </div>
</section>`;

const statsBand = `
<section class="section--tight" style="padding-top:clamp(30px,4vw,52px)">
  <div class="container">
    <div class="stats reveal">
      <div class="stat"><div class="n" data-count="4">0</div><div class="k">Kernbereiche</div></div>
      <div class="stat"><div class="n" data-count="100" data-suffix="%">0</div><div class="k">individuell gefertigt</div></div>
      <div class="stat"><div class="n" data-count="3">0</div><div class="k">Techniken im Textil</div></div>
      <div class="stat"><div class="n">∞</div><div class="k">Ideen für Ihre Marke</div></div>
    </div>
  </div>
</section>`;

const about = `
<section class="section about">
  <div class="container">
    <div class="plate-grid">
      <div class="logo3d reveal" data-logo3d>
        <img class="l3-fallback" src="assets/img/logo.png" alt="Trustydruck Bildmarke" width="220" height="220">
      </div>
      <div class="reveal" data-d="1">
        ${kicker("Über Trustydruck")}
        <h2 class="display split">Leidenschaft fürs <em>Handwerk</em>.</h2>
        <p class="lede" style="margin-top:20px">Unsere Leidenschaft für kreative Gestaltung und unsere modernen Drucktechniken ermöglichen es uns, maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden anzubieten.</p>
        <p style="margin-top:16px;color:var(--ink-soft)">Von einzigartigen Designs bis hin zu Firmenlogos und Werbebotschaften bringen wir Ihre Ideen zum Leben. Mit einem engagierten Team und einem Fokus auf Qualität und Kundenzufriedenheit bieten wir einen herausragenden Service und einzigartige Produkte.</p>
        <div class="btn-row" style="margin-top:28px"><a class="link" href="ueber-uns.html">Mehr über uns ${ICON.arrow}</a></div>
      </div>
    </div>
  </div>
</section>`;

const servicesIntro = `
<section class="section--tight" style="padding-bottom:0">
  <div class="container">
    <div class="section-head reveal">
      ${kicker("Vier Druckplatten")}
      <h2 class="display split">Alles aus einer Hand.</h2>
      <p class="lede">Vier Kernbereiche, jede Leistung eine eigene Platte. Zusammen ergeben sie das perfekte Bild für Ihre Marke.</p>
    </div>
  </div>
</section>`;

const plates = SERVICES.map((s, i) => plate(s, i, false)).join("");

export default {
  slug: "home",
  title: "Home",
  desc: "Trustydruck, Ihre Werbeagentur aus Meschede für hochwertige, individuelle Bedruckungslösungen: Leuchtreklame, Textildruck, Print & Medien und Grafik. Gut zum Druck.",
  body:
    hero + marquee() + statsBand +
    statement('Wir bringen Ideen <em>in Register</em> auf Textil, Papier und Fassade.', "Trustydruck · Print &amp; Media") +
    servicesIntro + plates + about + whyBand() + reviews() + ctaBand(),
};
