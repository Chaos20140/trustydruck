import { ICON, SITE } from "../layout.mjs";
import { eyebrow } from "../components.mjs";
import { SERVICES } from "../data.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Kontakt</div>
    ${eyebrow("Kontakt")}
    <h1 class="display reveal">Lassen Sie uns <span class="grad neon">reden</span>.</h1>
    <p class="lede reveal" data-d="1">Erzählen Sie uns von Ihrem Projekt – wir melden uns schnellstmöglich mit einem passenden Angebot. Ganz unverbindlich.</p>
  </div>
</section>`;

const quick = `
<section class="section--tight" style="padding-top:0">
  <div class="container">
    <div class="trust reveal">
      <div class="cell"><div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(24,182,243,.12);color:var(--brand-2);border:1px solid rgba(24,182,243,.25);margin-bottom:14px">${ICON.phone}</div><div class="k">Telefon</div><div class="v" style="font-size:1.05rem;font-weight:600;margin-top:4px"><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a></div></div>
      <div class="cell"><div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(24,182,243,.12);color:var(--brand-2);border:1px solid rgba(24,182,243,.25);margin-bottom:14px">${ICON.mail}</div><div class="k">E-Mail</div><div class="v" style="font-size:1.05rem;font-weight:600;margin-top:4px"><a href="mailto:${SITE.email}">${SITE.email}</a></div></div>
      <div class="cell"><div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(37,211,102,.14);color:#2ee88f;border:1px solid rgba(37,211,102,.3);margin-bottom:14px">${ICON.wa}</div><div class="k">WhatsApp</div><div class="v" style="font-size:1.05rem;font-weight:600;margin-top:4px"><a href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">Direkt schreiben</a></div></div>
      <div class="cell"><div class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:rgba(24,182,243,.12);color:var(--brand-2);border:1px solid rgba(24,182,243,.25);margin-bottom:14px">${ICON.pin}</div><div class="k">Adresse</div><div class="v" style="font-size:1.05rem;font-weight:600;margin-top:4px">${SITE.street}, ${SITE.city}</div></div>
    </div>
  </div>
</section>`;

const main = `
<section class="section" style="padding-top:clamp(30px,4vw,50px)">
  <div class="container">
    <div class="contact-grid">
      <div class="reveal">
        <form class="form" id="contact-form" novalidate>
          <h3 class="display" style="font-size:1.6rem;margin-bottom:8px">Projekt anfragen</h3>
          <p class="dim" style="margin-bottom:24px;font-size:.95rem">Felder mit <span style="color:var(--brand-2)">*</span> sind Pflichtfelder.</p>
          <div class="field-row">
            <div class="field"><label for="name">Name <span class="req">*</span></label><input id="name" name="name" type="text" autocomplete="name" placeholder="Ihr Name" required></div>
            <div class="field"><label for="phone">Telefon</label><input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="Optional"></div>
          </div>
          <div class="field"><label for="email">E-Mail <span class="req">*</span></label><input id="email" name="email" type="email" autocomplete="email" placeholder="name@beispiel.de" required></div>
          <div class="field"><label for="service">Leistung</label>
            <select id="service" name="service">
              <option value="">Bitte wählen …</option>
              ${SERVICES.map((s) => `<option value="${s.title}">${s.title}</option>`).join("")}
              <option value="Sonstiges">Sonstiges</option>
            </select>
          </div>
          <div class="field"><label for="message">Nachricht <span class="req">*</span></label><textarea id="message" name="message" placeholder="Beschreiben Sie kurz Ihr Vorhaben – Menge, Material, Wunschtermin …" required></textarea></div>
          <label class="consent"><input type="checkbox" name="consent"><span>Ich habe die <a href="datenschutz.html" style="color:var(--brand-2)">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.</span></label>
          <button class="btn btn--primary btn--block btn--lg" type="submit">Anfrage senden ${ICON.arrow}</button>
          <p class="form-note">Hinweis: Das Formular öffnet Ihr E-Mail-Programm mit der fertig ausgefüllten Nachricht. Alternativ erreichen Sie uns direkt unter <a href="mailto:${SITE.email}" style="color:var(--brand-2)">${SITE.email}</a>.</p>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="info-stack reveal" data-d="2">
        <div class="map-wrap" style="min-height:280px">
          <iframe title="Standort Trustydruck Meschede" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Ruhrstra%C3%9Fe%207,%2059872%20Meschede&output=embed"></iframe>
        </div>
        <div class="info-card"><span class="ic">${ICON.clock}</span><div><div class="k">Erreichbarkeit</div><div class="v">Mo–Fr nach Vereinbarung</div><p class="dim" style="font-size:.9rem;margin-top:6px">Schreiben Sie uns jederzeit – wir melden uns zeitnah zurück.</p></div></div>
        <div class="info-card"><span class="ic">${ICON.instagram}</span><div><div class="k">Social</div><div class="v"><a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer">@trustydruck</a></div><p class="dim" style="font-size:.9rem;margin-top:6px">Aktuelle Projekte auf Instagram.</p></div></div>
      </div>
    </div>
  </div>
</section>`;

export default {
  slug: "kontakt",
  title: "Kontakt",
  desc: "Kontakt zu Trustydruck in Meschede: Anfrage für Leuchtreklame, Textildruck, Print & Medien oder Grafikdesign. Telefon, E-Mail, WhatsApp und Anfrageformular.",
  body: pageHero + quick + main,
};
