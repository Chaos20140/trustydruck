import { ICON, SITE } from "../layout.mjs";
import { kicker } from "../components.mjs";
import { SERVICES } from "../data.mjs";

const pageHero = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Kontakt</div>
    ${kicker("Auftrag erteilen")}
    <h1 class="display reveal" data-d="1">Lassen Sie uns <em>reden</em>.</h1>
    <p class="lede reveal" data-d="2" style="margin-top:22px">Erzählen Sie uns von Ihrem Projekt – wir melden uns schnellstmöglich mit einem passenden Angebot. Ganz unverbindlich.</p>
  </div>
</section>`;

const quick = `
<section class="section--tight" style="padding-top:clamp(24px,3vw,40px)">
  <div class="container">
    <div class="grid-4 reveal">
      <div class="cell"><div class="ic">${ICON.phone}</div><h4>Telefon</h4><p><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a></p></div>
      <div class="cell"><div class="ic">${ICON.mail}</div><h4>E-Mail</h4><p><a href="mailto:${SITE.email}">${SITE.email}</a></p></div>
      <div class="cell"><div class="ic">${ICON.wa}</div><h4>WhatsApp</h4><p><a href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer">Direkt schreiben</a></p></div>
      <div class="cell"><div class="ic">${ICON.pin}</div><h4>Adresse</h4><p>${SITE.street}, ${SITE.city}</p></div>
    </div>
  </div>
</section>`;

const main = `
<section class="section" style="padding-top:clamp(24px,3vw,44px)">
  <div class="container">
    <div class="contact-grid">
      <div class="reveal">
        <form class="ticket" id="contact-form" novalidate>
          <div class="th"><span>Auftragsformular · TD-2026</span><span>Gut zum Druck</span></div>
          <div class="tb">
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
            <label class="consent"><input type="checkbox" name="consent"><span>Ich habe die <a href="datenschutz.html">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.</span></label>
            <button class="btn btn--spot btn--block btn--lg magnetic" type="submit">Zum Druck freigeben ${ICON.arrow}</button>
            <p class="form-note">Das Formular öffnet Ihr E-Mail-Programm mit der fertig ausgefüllten Nachricht. Alternativ direkt: <a href="mailto:${SITE.email}" style="color:var(--spot)">${SITE.email}</a></p>
            <p class="form-status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
      <div class="reveal" data-d="1">
        <div class="map-wrap" style="min-height:260px;margin-bottom:20px">
          <iframe title="Standort Trustydruck Meschede" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Ruhrstra%C3%9Fe%207,%2059872%20Meschede&output=embed"></iframe>
        </div>
        <div class="info-stack">
          <div class="info-card"><span class="ic">${ICON.clock}</span><div><div class="k">Erreichbarkeit</div><div class="v">Mo–Fr nach Vereinbarung</div></div></div>
          <div class="info-card"><span class="ic">${ICON.instagram}</span><div><div class="k">Social</div><div class="v"><a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer">@trustydruck</a></div></div></div>
        </div>
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
