// Reusable RASTER blocks.
import { ICON, SITE } from "./layout.mjs";
import { KEYWORDS, REVIEWS } from "./data.mjs";

export function kicker(text) {
  return `<span class="kicker"><span class="dot"></span>${text}</span>`;
}
export function sepLabel(no, name) {
  return `<div class="sep-label"><span class="no">${no}</span><span>${name}</span><span class="bar"></span></div>`;
}
export function marquee() {
  const set = KEYWORDS.map((k) => `<span>${k}</span>`).join("");
  return `<section class="marquee" aria-hidden="true"><div class="marquee-track">${set}${set}</div></section>`;
}
export function controlStrip(label, no) {
  return `<div class="control" aria-hidden="true">
    <span class="lbl">${label}</span>
    <span class="steps"><i></i><i></i><i></i><i></i><i></i></span>
    <span class="swatch"></span>
    <span class="no">Bogen № ${no}</span>
  </div>`;
}
const marks = `<span class="marks"><span class="p1"></span><span class="p2"></span><span class="p3"></span><span class="p4"></span></span>`;

// the interactive halftone-loupe figure (hero / feature)
export function rasterFigure(src, { alt = "", mark = "Rasterprobe", hint = "Cursor = Lupe", gl = false } = {}) {
  return `<figure class="raster" data-loupe${gl ? " data-loupe3d" : ""}>
    <img src="${src}" alt="${alt}" width="1000" height="1250">
    <canvas class="rc" aria-hidden="true"></canvas>
    <span class="rmark">${mark}</span>
    <span class="rhint">${hint}</span>
    ${marks}
  </figure>`;
}

// image proof with registration-wipe reveal + crop marks + stamp
export function proof(src, { cap = "", stamp = "Gut zum Druck", contain = false, alt = "" } = {}) {
  return `<figure class="proof${contain ? " contain" : ""}">
    <img src="${src}" alt="${alt || cap || "Trustydruck Arbeitsprobe"}" loading="lazy">
    ${cap ? `<figcaption class="cap">${cap}</figcaption>` : ""}
    <span class="stamp">${stamp}</span>
    ${marks}
  </figure>`;
}

export function statement(quoteHtml, by) {
  return `<section class="statement">
    <div class="container">
      <figure class="st-block">
        <span class="st-quotemark" aria-hidden="true">&ldquo;</span>
        <blockquote class="st-quote" data-split>${quoteHtml}</blockquote>
        <figcaption class="st-foot reveal" data-d="1">
          ${by ? `<span class="st-by">${by}</span>` : ""}
          <ul class="st-themes" aria-hidden="true">
            <li>Leuchtreklame</li><li>Textildruck</li><li>Print &amp; Medien</li><li>Grafik &amp; Logo</li>
          </ul>
        </figcaption>
      </figure>
    </div>
  </section>`;
}

// full-width "why us" band with big print-plate cards (home)
export function whyBand() {
  const items = [
    [ICON.star, "Höchste Qualität", "Erstklassige Materialien und moderne Drucktechnik für Ergebnisse, die überzeugen."],
    [ICON.spark, "Individuell", "Maßgeschneiderte Lösungen von der ersten Idee bis zum fertigen Produkt."],
    [ICON.bolt, "Schnelle Lieferung", "Verlässliche Termine, damit Ihre Werbung pünktlich zum Einsatz kommt."],
    [ICON.shield, "Persönlicher Service", "Ein engagiertes Team und ein fester Ansprechpartner an Ihrer Seite."],
  ];
  return `<section class="section why">
    <div class="container">
      <div class="section-head reveal">
        ${kicker("Warum Trustydruck")}
        <h2 class="display split">Vier Versprechen, ein Anspruch.</h2>
      </div>
      <div class="why-grid">
        ${items.map((it, i) => `<article class="why-card reveal" data-d="${i}">
          <span class="wc-no">0${i + 1}</span>
          <span class="wc-ic">${it[0]}</span>
          <h3 class="wc-title">${it[1]}</h3>
          <p class="wc-copy">${it[2]}</p>
          <span class="wc-bar" aria-hidden="true"></span>
        </article>`).join("")}
      </div>
    </div>
  </section>`;
}

// customer voices ("Kundenstimmen")
export function reviews() {
  if (!REVIEWS || !REVIEWS.length) return "";
  const stars = (n) => `<span class="rv-stars" aria-label="${n} von 5 Sternen">${Array.from({ length: 5 }, (_, i) => `<span class="${i < n ? "on" : ""}">${ICON.star}</span>`).join("")}</span>`;
  return `<section class="section reviews">
    <div class="container">
      <div class="section-head reveal">
        ${kicker("Kundenstimmen")}
        <h2 class="display split">Was Kunden sagen.</h2>
        <p class="lede">Echte Stimmen aus Meschede und dem Sauerland, von Vereinen bis Unternehmen.</p>
      </div>
      <div class="rv-grid">
        ${REVIEWS.map((r, i) => `<figure class="rv-card reveal" data-d="${i % 3}">
          ${stars(r.stars)}
          <blockquote class="rv-quote">${r.quote}</blockquote>
          <figcaption class="rv-by">
            <span class="rv-avatar" aria-hidden="true">${(r.name || "?").trim().charAt(0)}</span>
            <span class="rv-id"><span class="rv-name">${r.name}</span><span class="rv-role">${r.role}${r.area ? ` · ${r.area}` : ""}</span></span>
          </figcaption>
        </figure>`).join("")}
      </div>
    </div>
  </section>`;
}

export function ctaBand() {
  return `<section class="section section--tight">
    <div class="container">
      <div class="cta reveal">
        <span class="dots" aria-hidden="true"></span>
        ${kicker("Gut zum Druck")}
        <h2 class="display split">Gemeinsam bringen wir Ihr <em>Unternehmen</em> voran.</h2>
        <p>Geben Sie Ihrem Geschäft neuen Schwung. Kontaktieren Sie uns noch heute, um zu erfahren, wie wir Ihre Unternehmensbedürfnisse erfüllen können.</p>
        <div class="btn-row">
          <a class="btn magnetic" href="kontakt.html">Angebot anfragen ${ICON.arrow}</a>
          <a class="btn btn--wa magnetic" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${ICON.wa} WhatsApp</a>
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
  return `<div class="grid-4 reveal">
    ${items.map((i) => `<div class="cell"><div class="ic">${i[0]}</div><h4>${i[1]}</h4><p>${i[2]}</p></div>`).join("")}
  </div>`;
}

// a print plate for a service. full=true adds the feature list (Leistungen page).
export function plate(s, i, full = false) {
  const rev = i % 2 === 1;
  return `<section class="plate" id="${s.slug}">
    <div class="container">
      <div class="plate-grid${rev ? " plate--rev" : ""}">
        <div class="plate-media reveal" data-parallax>${proof(s.img, { cap: s.title, stamp: s.stamp, contain: false, alt: s.title })}</div>
        <div class="reveal" data-d="1">
          <div class="sep-label"><span class="no">${s.num}</span><span>Druckplatte ${s.num}</span><span class="bar"></span></div>
          <h2 class="display split kinetic">${s.title}</h2>
          <p class="lede" style="margin-top:18px"><strong>${s.lead}</strong> ${s.short}</p>
          ${full ? `<ul class="feature-list">${s.features.map((f) => `<li><span class="ic">${ICON.check}</span><span><b>${f[0]}</b>${f[1]}</span></li>`).join("")}</ul>
          <div class="tags">${s.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <div class="btn-row" style="margin-top:26px"><a class="btn magnetic" href="kontakt.html">Angebot anfragen ${ICON.arrow}</a><a class="btn btn--wa magnetic" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">${ICON.wa} Kurz fragen</a></div>`
      : `<div class="btn-row" style="margin-top:24px"><a class="btn magnetic" href="leistungen.html#${s.slug}">${s.title} entdecken ${ICON.arrow}</a></div>`}
        </div>
      </div>
    </div>
  </section>`;
}
