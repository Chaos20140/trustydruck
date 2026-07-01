// Reusable content blocks shared across pages.
import { ICON, SITE } from "./layout.mjs";
import { KEYWORDS } from "./data.mjs";

export function eyebrow(text, center = false) {
  return `<span class="eyebrow${center ? " eyebrow--center" : ""}">${text}</span>`;
}

export function sectionHead({ eyebrow: eb, title, lead, center = false }) {
  return `<div class="section-head${center ? " center" : ""} reveal">
    ${eb ? eyebrow(eb, center) : ""}
    <h2 class="display">${title}</h2>
    ${lead ? `<p class="lede${center ? " mx-auto" : ""}">${lead}</p>` : ""}
  </div>`;
}

export function marquee() {
  const set = KEYWORDS.map((k) => `<span${/Print/.test(k) ? ' class="fill"' : ""}>${k}</span>`).join("");
  return `<section class="marquee" aria-hidden="true">
    <div class="marquee-track">${set}${set}</div>
  </section>`;
}

// Home service card (image + copy + link into detail page)
export function serviceCard(svc) {
  return `<article class="svc reveal" data-d="${svc.num.replace(/^0/, "")}">
    <div class="svc-media">
      <span class="svc-num">${svc.num} / Leistung</span>
      <img src="${svc.img}" alt="${svc.title} – Trustydruck" loading="lazy"${svc.fit === "contain" ? ' style="object-fit:contain;background:#fff"' : ""}>
    </div>
    <div class="svc-body">
      <h3>${svc.title}</h3>
      <p>${svc.lead} ${svc.short.split("!")[0].length < 40 ? "" : ""}${trimShort(svc.short)}</p>
      <div class="svc-tags">${svc.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <a class="arrow-link" href="leistungen.html#${svc.slug}">Mehr Infos ${ICON.arrow}</a>
    </div>
  </article>`;
}
function trimShort(s) {
  return s.length > 150 ? s.slice(0, 147).trim() + "…" : s;
}

export function ctaBand() {
  return `<section class="section section--tight">
    <div class="container">
      <div class="cta-band reveal">
        ${eyebrow("Legen wir los")}
        <h2 class="display">Gemeinsam bringen wir Ihr <span class="grad">Unternehmen</span> voran!</h2>
        <p class="lede">Geben Sie Ihrem Geschäft neuen Schwung. Kontaktieren Sie uns noch heute, um zu erfahren, wie wir Ihre Unternehmensbedürfnisse erfüllen können.</p>
        <div class="btn-row">
          <a class="btn btn--primary btn--lg" href="kontakt.html">Angebot anfragen ${ICON.arrow}</a>
          <a class="btn btn--wa btn--lg" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${ICON.wa} WhatsApp schreiben</a>
        </div>
      </div>
    </div>
  </section>`;
}

export function whyRow() {
  const items = [
    [ICON.star, "Höchste Qualität", "Erstklassige Materialien und moderne Drucktechnik für Ergebnisse, die überzeugen."],
    [ICON.spark, "Individuell", "Maßgeschneiderte Lösungen – von der ersten Idee bis zum fertigen Produkt."],
    [ICON.bolt, "Schnelle Lieferung", "Verlässliche Termine, damit Ihre Werbung pünktlich zum Einsatz kommt."],
    [ICON.shield, "Persönlicher Service", "Ein engagiertes Team und ein fester Ansprechpartner an Ihrer Seite."],
  ];
  return `<div class="trust">
    ${items
      .map(
        (i, n) => `<div class="cell reveal" data-d="${n + 1}">
        <div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(24,182,243,.12);color:var(--brand-2);border:1px solid rgba(24,182,243,.25);margin-bottom:16px">${i[0]}</div>
        <div class="n" style="font-size:1.35rem">${i[1]}</div>
        <p class="k">${i[2]}</p>
      </div>`
      )
      .join("")}
  </div>`;
}
