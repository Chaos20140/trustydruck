// Reusable NASSDRUCK blocks.
import { ICON, SITE } from "./layout.mjs";
import { KEYWORDS } from "./data.mjs";

export function kicker(text, swatches = "cmyk") {
  const sw = swatches.split("").map((c) => `<span class="sw sw-${c}"></span>`).join("");
  return `<span class="kicker">${sw}${text}</span>`;
}

export function sepLabel(no, name, chan) {
  return `<div class="sep-label chan-${chan}"><span class="no" style="color:var(--chan)">${no}</span><span>Separation ${no} / ${name}</span><span class="bar" style="background:var(--chan)"></span></div>`;
}

export function marquee() {
  const set = KEYWORDS.map((k) => `<span>${k}</span>`).join("");
  return `<section class="marquee" aria-hidden="true"><div class="marquee-track">${set}${set}</div></section>`;
}

export function cutline(label) {
  return `<div class="cutline"${label ? "" : ""}>${label ? `<span>${label}</span>` : ""}</div>`;
}

// image as an approved press proof
export function proof(src, { cap = "", stamp = "Gut zum Druck", chan = "m", contain = false, cmyk = false } = {}) {
  return `<figure class="proof${contain ? " proof--contain" : ""} chan-${chan}"${cmyk ? " data-cmyk" : ""} data-cursor="view">
    <div class="inner">
      <img src="${src}" alt="${cap || "Trustydruck Arbeitsprobe"}" loading="lazy">
      ${cap ? `<figcaption class="cap">${cap}</figcaption>` : ""}
      <span class="stamp">${stamp}</span>
      <span class="marks"><span class="p1"></span><span class="p2"></span><span class="p3"></span><span class="p4"></span></span>
    </div>
  </figure>`;
}

export function ctaBand() {
  return `<section class="section section--tight ink-window">
    <div class="container">
      <div class="cta-band reveal">
        <span class="dots" aria-hidden="true"></span>
        ${kicker("Freigabe erteilen")}
        <h2 class="display ink-title" data-split>Gemeinsam bringen wir Ihr <em class="glow-c">Unternehmen</em> voran!</h2>
        <p class="reveal">Geben Sie Ihrem Geschäft neuen Schwung. Kontaktieren Sie uns noch heute, um zu erfahren, wie wir Ihre Unternehmensbedürfnisse erfüllen können.</p>
        <div class="btn-row">
          <a class="btn btn--c btn--lg magnetic" href="kontakt.html">Angebot anfragen ${ICON.arrow}</a>
          <a class="btn btn--wa btn--lg magnetic" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${ICON.wa} WhatsApp</a>
        </div>
      </div>
    </div>
  </section>`;
}

// Full-bleed statement band — big kinetic line over the live ink.
export function statementBand(lines) {
  return `<section class="statement ink-window">
    <div class="container">
      <p class="st-eyebrow mono reveal">// Vier Farben, ein Handwerk</p>
      <h2 class="st-head display" data-marquee-line>${lines}</h2>
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
  return `<div class="grid-4 reveal">
    ${items.map((i) => `<div class="cell"><div class="ic">${i[0]}</div><h4>${i[1]}</h4><p>${i[2]}</p></div>`).join("")}
  </div>`;
}
