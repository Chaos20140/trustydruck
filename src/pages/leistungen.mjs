import { ICON, SITE } from "../layout.mjs";
import { SERVICES } from "../data.mjs";
import { marquee, ctaBand, kicker, sepLabel, proof } from "../components.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Leistungen</div>
    ${kicker("Was wir für Sie drucken")}
    <h1 class="display ink-title reveal">Unsere <em>Leistungen</em>.</h1>
    <p class="lede reveal" data-d="1">Vier Kernbereiche – wie die vier Druckfarben. Von leuchtender Außenwerbung über veredelte Textilien bis zu druckfrischen Medien und starkem Grafikdesign.</p>
    <div class="btn-row reveal" data-d="2" style="margin-top:26px">
      ${SERVICES.map((s) => `<a class="btn btn--ghost" href="#${s.slug}">${s.num} · ${s.title}</a>`).join("")}
    </div>
  </div>
</section>`;

function block(s, i) {
  const rev = i % 2 === 1;
  return `
<section class="svc-block chan-${s.chan}" id="${s.slug}">
  <div class="container">
    <div class="split${rev ? " split--rev" : ""}">
      <div class="reveal" data-parallax>${proof(s.img, { cap: s.title, stamp: s.stamp, chan: s.chan, contain: s.fit === "contain", cmyk: true })}</div>
      <div class="reveal" data-d="2">
        ${sepLabel(s.num, s.channel, s.chan)}
        <h2 class="display ink-title kinetic">${s.title}</h2>
        <p class="lede" style="margin-top:18px"><strong>${s.lead}</strong> ${s.short}</p>
        <ul class="feature-list chan-${s.chan}">
          ${s.features.map((f) => `<li><span class="ic">${ICON.check}</span><span><b>${f[0]}</b>${f[1]}</span></li>`).join("")}
        </ul>
        <div class="tags">${s.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="btn-row" style="margin-top:26px">
          <a class="btn btn--c" href="kontakt.html">Angebot anfragen ${ICON.arrow}</a>
          <a class="btn btn--wa" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${ICON.wa} Kurz fragen</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

export default {
  slug: "leistungen",
  title: "Leistungen",
  desc: "Leistungen von Trustydruck: Leuchtreklame & LED-Technik, Textildruck (Siebdruck, Flexdruck, Stickerei), Print & Medien sowie Grafik- und Logo-Design.",
  body: pageHero + marquee() + SERVICES.map(block).join("") + ctaBand(),
};
