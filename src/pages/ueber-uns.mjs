import { ICON, SITE } from "../layout.mjs";
import { kicker, ctaBand, whyRow, proof, sepLabel } from "../components.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Über uns</div>
    ${kicker("Wer wir sind", "cm")}
    <h1 class="display ink-title reveal">Ihre Ideen, <em>zum Leben</em> erweckt.</h1>
    <p class="lede reveal" data-d="1">Willkommen bei Trustydruck – Ihrer Werbeagentur für hochwertige und individuelle Bedruckungslösungen aus dem Herzen des Sauerlands.</p>
  </div>
</section>`;

const story = `
<section class="section section--tight">
  <div class="container">
    <div class="split">
      <div class="reveal">
        ${sepLabel("00", "Kolophon", "k")}
        <h2 class="display ink-title">Handwerk trifft <em style="font-style:normal;color:var(--c)">moderne Technik</em>.</h2>
        <p class="lede" style="margin-top:20px">Wir bieten unseren Kunden erstklassige Drucke auf einer Vielzahl von Textilien an, sowie professionelle Werbung für Ihr Unternehmen. Unsere Leidenschaft für kreative Gestaltung und unsere modernen Drucktechniken ermöglichen es uns, maßgeschneiderte Lösungen für Unternehmen, Schulen, Vereine und Privatkunden anzubieten.</p>
        <p style="margin-top:16px;color:var(--ink-soft)">Von einzigartigen Designs bis hin zu Firmenlogos und Werbebotschaften – wir bringen Ihre Ideen zum Leben. Mit einem engagierten Team und einem Fokus auf Qualität und Kundenzufriedenheit sind wir stolz darauf, unseren Kunden einen herausragenden Service und einzigartige Produkte zu bieten.</p>
      </div>
      <div class="reveal" data-d="2">${proof("assets/img/gallery-1.jpg", { cap: "Trustydruck · Leuchtreklame", stamp: "Freigegeben", chan: "c" })}</div>
    </div>
  </div>
</section>`;

const values = (() => {
  const items = [
    ["Qualität", "Wir liefern nur Ergebnisse, hinter denen wir voll und ganz stehen – vom Material bis zur letzten Naht.", "c"],
    ["Kreativität", "Individuelle Designs statt Schablonen. Ihre Marke bekommt einen unverwechselbaren Auftritt.", "m"],
    ["Verlässlichkeit", "Feste Ansprechpartner, transparente Kommunikation und Termine, auf die Sie sich verlassen können.", "y"],
  ];
  return `
<div class="container"><div class="cutline"><span>Was uns antreibt</span></div></div>
<section class="section section--tight">
  <div class="container">
    <div class="section-head center reveal">${kicker("Unsere Werte")}<h2 class="display ink-title">Drei Prinzipien.</h2></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);border:1.5px solid var(--ink)" class="reveal">
      ${items.map((v, i) => `<div class="chan-${v[2]}" style="padding:clamp(24px,3vw,34px);border-right:${i < 2 ? "1.5px solid var(--ink)" : "0"}">
        <span class="mono" style="font-size:2.4rem;font-weight:700;color:var(--chan);line-height:1;font-family:var(--f-display)">0${i + 1}</span>
        <h3 class="display" style="text-transform:uppercase;font-size:1.5rem;margin:14px 0 10px">${v[0]}</h3>
        <p style="color:var(--ink-soft)">${v[1]}</p>
      </div>`).join("")}
    </div>
  </div>
</section>`;
})();

const audience = (() => {
  const who = ["Unternehmen", "Schulen", "Vereine", "Privatkunden"];
  return `
<section class="section section--tight">
  <div class="container">
    <div class="cta-band reveal">
      <span class="dots" aria-hidden="true"></span>
      ${kicker("Für wen wir arbeiten")}
      <h2 class="display ink-title">Vom Start-up bis zum <em>Verein</em>.</h2>
      <p>Wir gestalten maßgeschneiderte Bedruckungs- und Werbelösungen für alle, die auffallen wollen.</p>
      <div class="hero-badges" style="margin-top:24px">
        ${who.map((w, i) => `<span class="chip" style="border-color:var(--paper);color:var(--paper)"><i style="background:var(--${["c", "m", "y", "brand"][i]})"></i>${w}</span>`).join("")}
      </div>
    </div>
  </div>
</section>`;
})();

const why = `
<div class="container"><div class="cutline"><span>Ihr Vorteil</span></div></div>
<section class="section section--tight">
  <div class="container">
    <div class="section-head center reveal">${kicker("Darum Trustydruck")}<h2 class="display ink-title">Qualität, die man sieht.</h2></div>
    ${whyRow()}
  </div>
</section>`;

const location = `
<section class="section section--tight">
  <div class="container">
    <div class="split">
      <div class="reveal">
        ${kicker("Standort", "my")}
        <h2 class="display ink-title">Zuhause im <em style="font-style:normal;color:var(--m)">Sauerland</em>.</h2>
        <p class="lede" style="margin-top:20px">Sie finden uns in Meschede – persönlich, nahbar und immer für Sie erreichbar. Ob vor Ort oder digital: Wir begleiten Ihr Projekt von der ersten Idee bis zur fertigen Umsetzung.</p>
        <div class="info-stack" style="margin-top:24px">
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
