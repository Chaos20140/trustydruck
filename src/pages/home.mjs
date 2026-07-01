import { ICON, SITE } from "../layout.mjs";
import { SERVICES } from "../data.mjs";
import { marquee, ctaBand, whyRow, kicker, sepLabel, proof, cutline, statementBand } from "../components.mjs";

const statement = statementBand('Wir bringen Ideen <em>zum Leuchten</em> — auf Textil, Papier und Fassade.');

const hero = `
<section class="hero ink-window">
  <div class="hero-veil" aria-hidden="true"></div>
  <div class="density" aria-hidden="true">
    <span>Dichte</span><b class="d-c"></b><b class="d-m"></b><b class="d-y"></b><b class="d-k"></b>
  </div>
  <span class="hero-hint"><i></i>Bewege den Cursor — du druckst.</span>
  <div class="container">
    <div class="hero-copy">
      <div class="hero-lockup" data-hero-fade>
        <img src="assets/img/logo.png" alt="TRUSTYDRUCK Logo">
        <span class="hl-txt">Print &amp; Media —<br>Meschede · Sauerland · seit Tag&nbsp;eins vierfarbig.</span>
      </div>
      ${kicker("Werbeagentur · 4/4-farbig")}
      <h1 class="display ink-title">
        <span class="line"><span>Ihre Agentur</span></span>
        <span class="line"><span>für <em class="glow-m">Werbung</em>.</span></span>
      </h1>
      <p class="lede" data-hero-fade>Willkommen bei Trustydruck – Ihrer Werbeagentur für hochwertige und individuelle Bedruckungslösungen. Von Leuchtreklame über Textildruck bis Print &amp; Medien bringen wir Ihre Ideen zum Leben.</p>
      <div class="btn-row" data-hero-fade>
        <a class="btn btn--c btn--lg magnetic" href="leistungen.html">Leistungen entdecken ${ICON.arrow}</a>
        <a class="btn btn--ghost btn--lg magnetic" href="kontakt.html">Kontakt aufnehmen</a>
        <button class="btn btn--ghost btn--lg magnetic" type="button" data-reink aria-label="Neu einfärben">Neu einfärben</button>
      </div>
      <div class="hero-badges" data-hero-fade>
        <span class="chip"><i style="background:var(--c)"></i>LED-Leuchtreklame</span>
        <span class="chip"><i style="background:var(--m)"></i>Siebdruck &amp; Stickerei</span>
        <span class="chip"><i style="background:var(--y)"></i>Banner &amp; Großformat</span>
        <span class="chip"><i style="background:var(--k)"></i>Grafik &amp; Logo</span>
      </div>
      <div class="scroll-cue" data-hero-fade><span class="ln"></span>Scrollen</div>
    </div>
  </div>
</section>`;

const stats = `
<section class="section--tight" style="padding-top:clamp(30px,4vw,50px)">
  <div class="container">
    <div class="stats reveal">
      <div class="stat"><div class="n" data-count="4">0</div><div class="k">Farben · ein Handwerk</div></div>
      <div class="stat"><div class="n" data-count="100" data-suffix="%">0</div><div class="k">individuell gefertigt</div></div>
      <div class="stat"><div class="n" data-count="3">0</div><div class="k">Drucktechniken im Textil</div></div>
      <div class="stat"><div class="n">∞</div><div class="k">Ideen für Ihre Marke</div></div>
    </div>
  </div>
</section>`;

const about = `
<section class="section" id="ueber">
  <div class="container">
    <div class="split">
      <div class="reveal">
        ${kicker("Über Trustydruck", "cm")}
        <h2 class="display ink-title">Leidenschaft fürs <em style="font-style:normal;color:var(--m)">Handwerk</em>.</h2>
        <p class="lede" style="margin-top:22px">Unsere Leidenschaft für kreative Gestaltung und unsere modernen Drucktechniken ermöglichen es uns, maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden anzubieten.</p>
        <p style="margin-top:16px;color:var(--ink-soft)">Von einzigartigen Designs bis hin zu Firmenlogos und Werbebotschaften – wir bringen Ihre Ideen zum Leben. Mit einem engagierten Team und einem Fokus auf Qualität und Kundenzufriedenheit bieten wir einen herausragenden Service und einzigartige Produkte.</p>
        <div class="btn-row" style="margin-top:28px"><a class="arrow" href="ueber-uns.html">Mehr über uns ${ICON.arrow}</a></div>
      </div>
      <div class="reveal" data-d="2" data-parallax>${proof("assets/img/leuchtreklame.png", { cap: "LED · Leuchtbuchstaben", stamp: "Gut zum Druck", chan: "c" })}</div>
    </div>
  </div>
</section>`;

const why = `
<div class="container"><div class="cutline"><span>Warum Trustydruck</span></div></div>
<section class="section section--tight">
  <div class="container">
    <div class="section-head reveal">${kicker("Vier gute Gründe")}<h2 class="display ink-title">Qualität, die man sieht.</h2></div>
    ${whyRow()}
  </div>
</section>`;

const separations = `
<section class="section" id="leistungen">
  <div class="container">
    <div class="section-head reveal">
      ${kicker("Vier Farben, vier Leistungen")}
      <h2 class="display ink-title">Alles aus <em style="font-style:normal;color:var(--c)">einer</em> Hand.</h2>
      <p class="lede">Wie im Vierfarbdruck: Jede Leistung ist ein eigener Farbauszug — zusammen ergeben sie das perfekte Bild für Ihre Marke.</p>
    </div>
    <div class="sep-grid reveal">
      ${SERVICES.map((s) => `
      <a href="leistungen.html#${s.slug}" class="sep-cell chan-${s.chan}">
        <div class="sc-top">
          <div>
            <span class="sc-lbl">SEPARATION ${s.num} / ${s.channel.toUpperCase()}</span>
            <h3>${s.title}</h3>
            <p>${s.short.split("!")[0]}${s.short.includes("!") ? "!" : ""}</p>
          </div>
          <span class="sc-icon">${s.icon}</span>
        </div>
        <div class="tags">${s.tags.slice(0, 3).map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <span class="arrow">Mehr Infos ${ICON.arrow}</span>
      </a>`).join("")}
    </div>
  </div>
</section>`;

const showcase = `
<section class="section section--tight">
  <div class="container">
    <div class="split split--rev">
      <div class="reveal" data-parallax>${proof("assets/img/gallery-1.jpg", { cap: "Leuchtreklame · Fassade", stamp: "Freigegeben", chan: "c" })}</div>
      <div class="reveal" data-d="2">
        ${sepLabel("01", "Cyan", "c")}
        <h2 class="display ink-title">Ihre Marke, im <em style="font-style:normal;color:var(--c)">besten Licht</em>.</h2>
        <p class="lede" style="margin-top:20px">Setzen Sie Ihre Marke ins richtige Licht! Wir gestalten und produzieren hochwertige Leuchtreklamen, die Ihre Botschaft bei Tag und Nacht perfekt präsentieren – mit modernster LED-Technik.</p>
        <ul class="feature-list chan-c">
          <li><span class="ic">${ICON.check}</span><span><b>Sichtbar bei Tag &amp; Nacht</b>Leuchtstark und energieeffizient dank moderner LED-Technik.</span></li>
          <li><span class="ic">${ICON.check}</span><span><b>Langlebige Materialien</b>Gefertigt für den dauerhaften Außeneinsatz.</span></li>
          <li><span class="ic">${ICON.check}</span><span><b>Individuell geplant</b>Von der Idee über die Montage bis zum Betrieb.</span></li>
        </ul>
        <div class="btn-row" style="margin-top:26px"><a class="btn btn--c" href="leistungen.html#leuchtreklame">Leuchtreklame entdecken ${ICON.arrow}</a></div>
      </div>
    </div>
  </div>
</section>`;

const steps = [
  ["Beratung", "Wir hören zu, verstehen Ihr Ziel und beraten Sie ehrlich zur besten Lösung."],
  ["Design", "Unser Team gestaltet Ihr Motiv – kreativ, markengerecht und druckfertig."],
  ["Produktion", "Modernste Technik veredelt Textil, Print oder Leuchtreklame in Top-Qualität."],
  ["Lieferung", "Pünktlich, verlässlich und auf Wunsch mit Montage vor Ort."],
];
const process = `
<div class="container"><div class="cutline"><span>Ablauf</span></div></div>
<section class="section section--tight" id="ablauf">
  <div class="container">
    <div class="section-head reveal">${kicker("So arbeiten wir", "my")}<h2 class="display ink-title">Von der Idee zum <em style="font-style:normal;color:var(--m)">Ergebnis</em>.</h2></div>
    <div class="steps reveal">
      ${steps.map((s, i) => `<div class="step"><span class="no">Schritt 0${i + 1}</span><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join("")}
    </div>
  </div>
</section>`;

const gallery = `
<section class="section section--tight ink-window" id="arbeiten">
  <div class="container">
    <div class="section-head reveal">${kicker("Ausgewählte Arbeiten")}<h2 class="display ink-title" data-split>Frisch aus der Presse.</h2></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px" class="reveal">
      ${proof("assets/img/gallery-1.jpg", { cap: "Leuchtreklame", stamp: "01 / C", chan: "c" })}
      ${proof("assets/img/textildruck.jpg", { cap: "Textildruck", stamp: "02 / M", chan: "m" })}
      ${proof("assets/img/gallery-2.jpg", { cap: "Werbeartikel", stamp: "03 / Y", chan: "y" })}
    </div>
  </div>
</section>`;

export default {
  slug: "home",
  title: "Home",
  desc: "Trustydruck – Ihre Werbeagentur aus Meschede für hochwertige, individuelle Bedruckungslösungen: Leuchtreklame, Textildruck, Print & Medien und Grafik. Vier Farben, ein Handwerk.",
  body: hero + marquee() + stats + about + why + separations + showcase + statement + process + gallery + ctaBand(),
};
