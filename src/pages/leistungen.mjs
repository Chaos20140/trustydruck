import { ICON } from "../layout.mjs";
import { SERVICES } from "../data.mjs";
import { marquee, ctaBand, kicker, plate } from "../components.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Leistungen</div>
    ${kicker("Was wir für Sie drucken")}
    <h1 class="display reveal" data-d="1">Unsere <em>Leistungen</em>.</h1>
    <p class="lede reveal" data-d="2" style="margin-top:22px">Vier Kernbereiche, vier Druckplatten. Von leuchtender Außenwerbung über veredelte Textilien bis zu druckfrischen Medien und starkem Grafikdesign.</p>
    <div class="btn-row reveal" data-d="3" style="margin-top:26px">
      ${SERVICES.map((s) => `<a class="btn btn--ghost" href="#${s.slug}">${s.num} · ${s.title}</a>`).join("")}
    </div>
  </div>
</section>`;

export default {
  slug: "leistungen",
  title: "Leistungen",
  desc: "Leistungen von Trustydruck: Leuchtreklame & LED-Technik, Textildruck (Siebdruck, Flexdruck, Stickerei), Print & Medien sowie Grafik- und Logo-Design.",
  body: pageHero + marquee() + SERVICES.map((s, i) => plate(s, i, true)).join("") + ctaBand(),
};
