import { ICON, SITE } from "../layout.mjs";
import { SERVICES } from "../data.mjs";
import { marquee, ctaBand, eyebrow } from "../components.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Leistungen</div>
    ${eyebrow("Was wir für Sie tun")}
    <h1 class="display reveal">Unsere <span class="grad neon">Leistungen</span>.</h1>
    <p class="lede reveal" data-d="1">Von leuchtender Außenwerbung über veredelte Textilien bis zu druckfrischen Medien – vier Kernbereiche, mit denen wir Ihre Marke sichtbar machen.</p>
    <div class="btn-row reveal" data-d="2" style="margin-top:30px">
      ${SERVICES.map((s) => `<a class="btn btn--ghost" href="#${s.slug}">${s.title}</a>`).join("")}
    </div>
  </div>
</section>`;

function block(svc, i) {
  const rev = i % 2 === 1;
  const mediaClass = svc.fit === "contain" ? "split-media split-media--contain" : "split-media";
  return `
<section class="section${i === 0 ? "" : " section--tight"}" id="${svc.slug}">
  <div class="container">
    <div class="split${rev ? " split--rev" : ""}">
      <div class="${mediaClass} reveal">
        <img src="${svc.img}" alt="${svc.title} – Trustydruck">
      </div>
      <div class="reveal" data-d="2">
        <span class="eyebrow"><span style="display:inline-flex;width:20px;height:20px;color:var(--brand-2)">${svc.icon}</span>${svc.num} · Leistung</span>
        <h2 class="display">${svc.title}</h2>
        <p class="lede" style="margin-top:20px"><strong>${svc.lead}</strong> ${svc.short}</p>
        <ul class="feature-list" style="margin-top:26px">
          ${svc.features.map((f) => `<li><span class="ic">${ICON.check}</span><span><b>${f[0]}</b>${f[1]}</span></li>`).join("")}
        </ul>
        <div class="svc-tags" style="margin-top:24px">${svc.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="btn-row" style="margin-top:28px">
          <a class="btn btn--primary" href="kontakt.html">Angebot anfragen ${ICON.arrow}</a>
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
  body:
    pageHero +
    marquee() +
    SERVICES.map(block).join("") +
    ctaBand(),
};
