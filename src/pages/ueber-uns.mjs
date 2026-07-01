import { ICON, SITE } from "../layout.mjs";
import { eyebrow, ctaBand, whyRow } from "../components.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Über uns</div>
    ${eyebrow("Wer wir sind")}
    <h1 class="display reveal">Ihre Ideen, <span class="grad neon">zum Leben</span> erweckt.</h1>
    <p class="lede reveal" data-d="1">Willkommen bei Trustydruck – Ihrer Werbeagentur für hochwertige und individuelle Bedruckungslösungen aus dem Herzen des Sauerlands.</p>
  </div>
</section>`;

const story = `
<section class="section section--tight">
  <div class="container">
    <div class="split">
      <div class="reveal">
        ${eyebrow("Unsere Geschichte")}
        <h2 class="display">Kreatives Handwerk trifft <span class="grad">moderne Technik</span>.</h2>
        <p class="lede" style="margin-top:22px">Wir bieten unseren Kunden erstklassige Drucke auf einer Vielzahl von Textilien an, sowie professionelle Werbung für Ihr Unternehmen. Unsere Leidenschaft für kreative Gestaltung und unsere modernen Drucktechniken ermöglichen es uns, maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden anzubieten.</p>
        <p class="dim" style="margin-top:18px">Von einzigartigen Designs bis hin zu Firmenlogos und Werbebotschaften – wir bringen Ihre Ideen zum Leben. Mit einem engagierten Team und einem Fokus auf Qualität und Kundenzufriedenheit sind wir stolz darauf, unseren Kunden einen herausragenden Service und einzigartige Produkte zu bieten.</p>
      </div>
      <div class="split-media reveal" data-d="2">
        <img src="assets/img/gallery-1.jpg" alt="Trustydruck Leuchtreklame">
      </div>
    </div>
  </div>
</section>`;

const values = (() => {
  const items = [
    [ICON.star, "Qualität", "Wir liefern nur Ergebnisse, hinter denen wir voll und ganz stehen – vom Material bis zur letzten Naht."],
    [ICON.spark, "Kreativität", "Individuelle Designs statt Schablonen. Ihre Marke bekommt einen unverwechselbaren Auftritt."],
    [ICON.shield, "Verlässlichkeit", "Feste Ansprechpartner, transparente Kommunikation und Termine, auf die Sie sich verlassen können."],
  ];
  return `
<section class="section section--tight">
  <div class="container">
    <div class="section-head center reveal">
      ${eyebrow("Was uns antreibt", true)}
      <h2 class="display">Unsere Werte.</h2>
    </div>
    <div class="services" style="grid-template-columns:repeat(3,1fr)">
      ${items
        .map(
          (v, i) => `<article class="svc reveal" data-d="${i + 1}" style="padding:0">
        <div class="svc-body" style="padding:32px">
          <div class="ic" style="width:48px;height:48px;border-radius:14px;display:grid;place-items:center;background:rgba(24,182,243,.12);color:var(--brand-2);border:1px solid rgba(24,182,243,.25)">${v[0]}</div>
          <h3 style="margin-top:8px">${v[1]}</h3>
          <p>${v[2]}</p>
        </div>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>`;
})();

const audience = (() => {
  const who = ["Unternehmen", "Schulen", "Vereine", "Privatkunden"];
  return `
<section class="section section--tight">
  <div class="container">
    <div class="cta-band reveal" style="box-shadow:none">
      ${eyebrow("Für wen wir arbeiten")}
      <h2 class="display">Vom Start-up bis zum <span class="grad">Verein</span>.</h2>
      <p class="lede">Wir gestalten maßgeschneiderte Bedruckungs- und Werbelösungen für alle, die auffallen wollen.</p>
      <div class="hero-badges" style="margin-top:26px">
        ${who.map((w) => `<span class="chip"><i></i>${w}</span>`).join("")}
      </div>
    </div>
  </div>
</section>`;
})();

const why = `
<section class="section section--tight">
  <div class="container">
    <div class="section-head center reveal">
      ${eyebrow("Ihr Vorteil", true)}
      <h2 class="display">Darum Trustydruck.</h2>
    </div>
    ${whyRow()}
  </div>
</section>`;

const location = `
<section class="section section--tight">
  <div class="container">
    <div class="split">
      <div class="reveal">
        ${eyebrow("Standort")}
        <h2 class="display">Zuhause im <span class="grad">Sauerland</span>.</h2>
        <p class="lede" style="margin-top:22px">Sie finden uns in Meschede – persönlich, nahbar und immer für Sie erreichbar. Ob vor Ort oder digital: Wir begleiten Ihr Projekt von der ersten Idee bis zur fertigen Umsetzung.</p>
        <div class="info-stack" style="margin-top:26px">
          <div class="info-card"><span class="ic">${ICON.pin}</span><div><div class="k">Adresse</div><div class="v">${SITE.street}, ${SITE.city}</div></div></div>
          <div class="info-card"><span class="ic">${ICON.phone}</span><div><div class="k">Telefon</div><div class="v"><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a></div></div></div>
        </div>
      </div>
      <div class="map-wrap reveal" data-d="2">
        <iframe title="Standort Trustydruck Meschede" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Ruhrstra%C3%9Fe%207,%2059872%20Meschede&output=embed"></iframe>
      </div>
    </div>
  </div>
</section>`;

export default {
  slug: "ueber-uns",
  title: "Über uns",
  desc: "Trustydruck aus Meschede: Leidenschaft für kreative Gestaltung und moderne Drucktechnik. Maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden.",
  body: pageHero + story + values + audience + why + location + ctaBand(),
};
