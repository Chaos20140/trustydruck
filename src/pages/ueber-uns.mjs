import { ICON, SITE } from "../layout.mjs";
import { kicker, ctaBand, whyRow, proof } from "../components.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Über uns</div>
    ${kicker("Wer wir sind")}
    <h1 class="display reveal" data-d="1">Ihre Ideen, <em>zum Leben</em> erweckt.</h1>
    <p class="lede reveal" data-d="2" style="margin-top:22px">Willkommen bei Trustydruck – Ihrer Werbeagentur für hochwertige und individuelle Bedruckungslösungen aus dem Herzen des Sauerlands.</p>
  </div>
</section>`;

const story = `
<section class="section">
  <div class="container">
    <div class="plate-grid">
      <div class="plate-media reveal" data-parallax>${proof("assets/img/gallery-1.jpg", { cap: "Trustydruck · Leuchtreklame", stamp: "Freigegeben" })}</div>
      <div class="reveal plate--rev" data-d="1">
        <div class="sep-label"><span class="no">00</span><span>Kolophon</span><span class="bar"></span></div>
        <h2 class="display split">Handwerk trifft <em>moderne Technik</em>.</h2>
        <p class="lede" style="margin-top:20px">Wir bieten unseren Kunden erstklassige Drucke auf einer Vielzahl von Textilien an, sowie professionelle Werbung für Ihr Unternehmen. Unsere Leidenschaft für kreative Gestaltung und unsere modernen Drucktechniken ermöglichen es uns, maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden anzubieten.</p>
        <p style="margin-top:16px;color:var(--ink-soft)">Von einzigartigen Designs bis hin zu Firmenlogos und Werbebotschaften – wir bringen Ihre Ideen zum Leben. Mit einem engagierten Team und einem Fokus auf Qualität und Kundenzufriedenheit sind wir stolz darauf, unseren Kunden einen herausragenden Service und einzigartige Produkte zu bieten.</p>
      </div>
    </div>
  </div>
</section>`;

const values = (() => {
  const items = [
    ["Qualität", "Wir liefern nur Ergebnisse, hinter denen wir voll und ganz stehen – vom Material bis zur letzten Naht."],
    ["Kreativität", "Individuelle Designs statt Schablonen. Ihre Marke bekommt einen unverwechselbaren Auftritt."],
    ["Verlässlichkeit", "Feste Ansprechpartner, transparente Kommunikation und Termine, auf die Sie sich verlassen können."],
  ];
  return `
<section class="section--tight">
  <div class="container">
    <div class="section-head reveal">${kicker("Was uns antreibt")}<h2 class="display split">Drei Prinzipien.</h2></div>
    <div class="stats reveal" style="grid-template-columns:repeat(3,1fr)">
      ${items.map((v, i) => `<div class="stat"><div class="n" style="font-size:2.2rem">0${i + 1}</div><h3 class="display" style="font-size:1.5rem;margin:12px 0 10px">${v[0]}</h3><p style="color:var(--ink-soft);font-family:var(--f-serif)">${v[1]}</p></div>`).join("")}
    </div>
  </div>
</section>`;
})();

const why = `
<section class="section--tight">
  <div class="container">
    <div class="section-head reveal">${kicker("Ihr Vorteil")}<h2 class="display split">Darum Trustydruck.</h2></div>
    ${whyRow()}
  </div>
</section>`;

const location = `
<section class="section">
  <div class="container">
    <div class="plate-grid">
      <div class="reveal">
        ${kicker("Standort")}
        <h2 class="display split">Zuhause im <em>Sauerland</em>.</h2>
        <p class="lede" style="margin-top:20px">Sie finden uns in Meschede – persönlich, nahbar und immer für Sie erreichbar. Ob vor Ort oder digital: Wir begleiten Ihr Projekt von der ersten Idee bis zur fertigen Umsetzung.</p>
        <div class="info-stack" style="margin-top:24px">
          <div class="info-card"><span class="ic">${ICON.pin}</span><div><div class="k">Adresse</div><div class="v">${SITE.street}, ${SITE.city}</div></div></div>
          <div class="info-card"><span class="ic">${ICON.phone}</span><div><div class="k">Telefon</div><div class="v"><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a></div></div></div>
        </div>
      </div>
      <div class="map-wrap reveal" data-d="1">
        <iframe title="Standort Trustydruck Meschede" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Ruhrstra%C3%9Fe%207,%2059872%20Meschede&output=embed"></iframe>
      </div>
    </div>
  </div>
</section>`;

export default {
  slug: "ueber-uns",
  title: "Über uns",
  desc: "Trustydruck aus Meschede: Leidenschaft für kreative Gestaltung und moderne Drucktechnik. Maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden.",
  body: pageHero + story + values + why + location + ctaBand(),
};
