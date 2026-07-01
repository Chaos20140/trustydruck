import { ICON, SITE } from "../layout.mjs";
import { SERVICES } from "../data.mjs";
import { marquee, serviceCard, ctaBand, whyRow, eyebrow } from "../components.mjs";

const hero = `
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-copy">
        ${eyebrow("Werbeagentur · Meschede · Sauerland")}
        <h1 class="display">
          <span class="sub-line">Ihre Agentur</span>
          <span class="sub-line">für <span class="grad neon">Werbung</span>.</span>
        </h1>
        <p class="lede">Willkommen bei Trustydruck – Ihrer Werbeagentur für hochwertige und individuelle Bedruckungslösungen. Von Leuchtreklame über Textildruck bis Print &amp; Medien bringen wir Ihre Ideen zum Leben.</p>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="leistungen.html">Leistungen entdecken ${ICON.arrow}</a>
          <a class="btn btn--ghost btn--lg" href="kontakt.html">Kontakt aufnehmen</a>
        </div>
        <div class="hero-badges">
          <span class="chip"><i></i>LED-Leuchtreklame</span>
          <span class="chip"><i></i>Siebdruck &amp; Stickerei</span>
          <span class="chip"><i></i>Banner &amp; Großformat</span>
          <span class="chip"><i></i>Grafik &amp; Logo</span>
        </div>
        <div class="scroll-cue"><span class="line"></span>Scrollen</div>
      </div>
      <div class="hero-visual reveal" data-d="2">
        <div class="hero-frame">
          <span class="hero-orb" aria-hidden="true"></span>
          <img src="assets/img/gallery-1.jpg" alt="Beleuchtete Trustydruck Leuchtreklame an einer Industriefassade" width="1022" height="663">
          <span class="hero-tag"><i></i>Trustydruck · Print &amp; Media</span>
        </div>
      </div>
    </div>
  </div>
</section>`;

const about = `
<section class="section" id="ueber">
  <div class="container">
    <div class="split">
      <div class="reveal">
        ${eyebrow("Über Trustydruck")}
        <h2 class="display">Leidenschaft für <span class="grad">kreative</span> Gestaltung.</h2>
        <p class="lede" style="margin-top:22px">Unsere Leidenschaft für kreative Gestaltung und unsere modernen Drucktechniken ermöglichen es uns, maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden anzubieten.</p>
        <p class="dim" style="margin-top:18px">Von einzigartigen Designs bis hin zu Firmenlogos und Werbebotschaften – wir bringen Ihre Ideen zum Leben. Mit einem engagierten Team und einem Fokus auf Qualität und Kundenzufriedenheit bieten wir einen herausragenden Service und einzigartige Produkte.</p>
        <div class="btn-row" style="margin-top:30px">
          <a class="btn btn--ghost" href="ueber-uns.html">Mehr über uns ${ICON.arrow}</a>
        </div>
      </div>
      <div class="split-media reveal" data-d="2">
        <img src="assets/img/leuchtreklame.png" alt="Leuchtende LED-Buchstaben – Leuchtreklame von Trustydruck">
      </div>
    </div>
  </div>
</section>`;

const why = `
<section class="section section--tight">
  <div class="container">
    <div class="section-head center reveal">
      ${eyebrow("Warum Trustydruck", true)}
      <h2 class="display">Qualität, die man sieht.</h2>
    </div>
    ${whyRow()}
  </div>
</section>`;

const services = `
<section class="section" id="leistungen">
  <div class="container">
    <div class="section-head reveal">
      ${eyebrow("Unsere Leistungen")}
      <h2 class="display">Alles aus einer Hand.</h2>
      <p class="lede">Drei Kernbereiche, ein Anspruch: Ihre Marke perfekt in Szene setzen – auf jedem Material und in jeder Größe.</p>
    </div>
    <div class="services">
      ${SERVICES.slice(0, 3).map(serviceCard).join("")}
    </div>
    <div class="center reveal" style="margin-top:44px">
      <a class="btn btn--ghost btn--lg" href="leistungen.html">Alle Leistungen ansehen ${ICON.arrow}</a>
    </div>
  </div>
</section>`;

const showcase = `
<section class="section section--tight">
  <div class="container">
    <div class="split split--rev">
      <div class="split-media reveal">
        <img src="assets/img/gallery-1.jpg" alt="Trustydruck Leuchtreklame in Szene gesetzt">
      </div>
      <div class="reveal" data-d="2">
        ${eyebrow("In Szene gesetzt")}
        <h2 class="display">Ihre Marke, im <span class="grad">besten Licht</span>.</h2>
        <p class="lede" style="margin-top:22px">Setzen Sie Ihre Marke ins richtige Licht! Wir gestalten und produzieren hochwertige Leuchtreklamen, die Ihre Botschaft bei Tag und Nacht perfekt präsentieren – mit modernster LED-Technik und langlebigen Materialien.</p>
        <ul class="feature-list" style="margin-top:26px">
          <li><span class="ic">${ICON.check}</span><span><b>Sichtbar bei Tag &amp; Nacht</b>Leuchtstark und energieeffizient dank moderner LED-Technik.</span></li>
          <li><span class="ic">${ICON.check}</span><span><b>Langlebige Materialien</b>Gefertigt für den dauerhaften Außeneinsatz.</span></li>
          <li><span class="ic">${ICON.check}</span><span><b>Individuell geplant</b>Von der Idee über die Montage bis zum Betrieb.</span></li>
        </ul>
        <div class="btn-row" style="margin-top:30px">
          <a class="btn btn--primary" href="leistungen.html#leuchtreklame">Leuchtreklame entdecken ${ICON.arrow}</a>
        </div>
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
<section class="section" id="ablauf">
  <div class="container">
    <div class="section-head reveal">
      ${eyebrow("So arbeiten wir")}
      <h2 class="display">Von der Idee zum Ergebnis.</h2>
      <p class="lede">Ein klarer Ablauf, der Ihnen jederzeit den Überblick gibt – und Ihnen die Arbeit abnimmt.</p>
    </div>
    <div class="steps">
      ${steps
        .map(
          (s, i) => `<div class="step reveal" data-d="${i + 1}">
        <span class="dot"></span>
        <span class="no">Schritt 0${i + 1}</span>
        <h4>${s[0]}</h4>
        <p>${s[1]}</p>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>`;

const gallery = `
<section class="section section--tight" id="arbeiten">
  <div class="container">
    <div class="section-head reveal">
      ${eyebrow("Unsere Arbeiten")}
      <h2 class="display">Ausgewählte Projekte.</h2>
      <p class="lede">Ein kleiner Einblick in das, was wir für Unternehmen, Vereine und Privatkunden umsetzen.</p>
    </div>
    <div class="gallery reveal">
      <figure class="shot shot--wide"><span class="badge">Leuchtreklame</span><img src="assets/img/gallery-1.jpg" alt="Trustydruck Leuchtreklame Schild" loading="lazy"><figcaption>Beleuchtete Fassadenwerbung</figcaption></figure>
      <figure class="shot shot--sq"><span class="badge">Leuchtreklame</span><img src="assets/img/leuchtreklame.png" alt="LED Leuchtbuchstaben" loading="lazy"><figcaption>LED-Leuchtbuchstaben</figcaption></figure>
      <figure class="shot shot--tall"><span class="badge">Textildruck</span><img src="assets/img/textildruck.jpg" alt="Bestickte Arbeitsjacke" loading="lazy"><figcaption>Bestickte Firmenkleidung</figcaption></figure>
      <figure class="shot shot--sq"><span class="badge">Merch</span><img src="assets/img/gallery-2.jpg" alt="Bedruckter Trustydruck Regenschirm" loading="lazy"><figcaption>Bedruckte Werbeartikel</figcaption></figure>
      <figure class="shot shot--sq" style="background:#fff"><span class="badge">Grafik</span><img src="assets/img/print-medien.png" alt="Grafikdesign" loading="lazy" style="object-fit:contain"><figcaption>Grafik &amp; Design</figcaption></figure>
    </div>
  </div>
</section>`;

export default {
  slug: "home",
  title: "Home",
  desc: "Trustydruck – Ihre Werbeagentur aus Meschede für hochwertige, individuelle Bedruckungslösungen: Leuchtreklame, Textildruck, Print & Medien und Grafikdesign.",
  body: hero + marquee() + about + why + services + showcase + process + gallery + ctaBand(),
};
