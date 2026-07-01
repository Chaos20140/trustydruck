import { SITE } from "../layout.mjs";
import { kicker } from "../components.mjs";

const body = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Datenschutz</div>
    ${kicker("Rechtliches", "k")}
    <h1 class="display ink-title reveal">Datenschutz&shy;erklärung</h1>
  </div>
</section>
<section class="section" style="padding-top:clamp(20px,3vw,40px)">
  <div class="container">
    <div class="prose reveal">
      <div class="note">Hinweis für Trustydruck: Diese Datenschutzerklärung ist eine sorgfältig vorbereitete Vorlage auf Basis der DSGVO und der eingesetzten Technik (GitHub Pages Hosting, selbst gehostete Schriften, Google-Maps-Karte, Kontakt per E-Mail). Bitte ergänzt die mit <strong>[ … ]</strong> markierten Angaben und lasst den Text vor dem Live-Gang rechtlich prüfen.</div>

      <h2>1. Verantwortlicher</h2>
      <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
      <p><strong>${SITE.full}</strong><br>[Vor- und Nachname des Inhabers / der Inhaberin]<br>${SITE.street}, ${SITE.city}<br>Telefon: <a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a><br>E-Mail: <a href="mailto:${SITE.email}">${SITE.email}</a></p>

      <h2>2. Allgemeines zur Datenverarbeitung</h2>
      <p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a, lit. b und lit. f DSGVO.</p>

      <h2>3. Hosting (GitHub Pages)</h2>
      <p>Diese Website wird bei GitHub Pages gehostet, einem Dienst der GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA. Beim Aufruf der Website erhebt GitHub technisch notwendige Server-Logdaten (u.&nbsp;a. IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Seite, Browsertyp). Dies dient dem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO). Weitere Informationen: <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a>.</p>

      <h2>4. Server-Logfiles</h2>
      <p>Bei jedem Zugriff werden automatisch Informationen erfasst, die Ihr Browser übermittelt: Browsertyp/-version, Betriebssystem, Referrer-URL, Hostname, Uhrzeit der Serveranfrage und IP-Adresse. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und dienen ausschließlich der technischen Bereitstellung und Sicherheit (Art. 6 Abs. 1 lit. f DSGVO).</p>

      <h2>5. Cookies &amp; lokale Speicherung</h2>
      <p>Diese Website verwendet ausschließlich technisch notwendige Speicherung. Es werden keine Tracking- oder Marketing-Cookies eingesetzt. Lediglich Ihre Entscheidung zum Cookie-Hinweis wird lokal in Ihrem Browser (localStorage) gespeichert; diese Information verlässt Ihr Gerät nicht.</p>

      <h2>6. Schriftarten (self-hosted)</h2>
      <p>Die verwendeten Schriftarten werden lokal von unserem Server ausgeliefert. Es findet <strong>keine</strong> Verbindung zu Servern von Google (Google Fonts) statt; hierfür werden keine personenbezogenen Daten an Dritte übertragen.</p>

      <h2>7. Google Maps</h2>
      <p>Auf einzelnen Seiten (z.&nbsp;B. Kontakt) binden wir eine Karte des Dienstes Google Maps der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland, ein. Beim Laden der Karte kann Ihre IP-Adresse an Google übertragen werden. Rechtsgrundlage ist unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) bzw. Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Datenschutzerklärung von Google</a>.</p>

      <h2>8. Kontaktaufnahme</h2>
      <p>Wenn Sie uns per E-Mail, Telefon, WhatsApp oder über das Kontaktformular kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage gespeichert. Das Kontaktformular sendet keine Daten an einen Server, sondern öffnet Ihr E-Mail-Programm mit einer vorbereiteten Nachricht (mailto). Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Bei Nutzung von WhatsApp gelten zusätzlich die Datenschutzbestimmungen der Meta Platforms Ireland Ltd.</p>

      <h2>9. Ihre Rechte</h2>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig ist u.&nbsp;a. die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.</p>

      <h2>10. Aktualität</h2>
      <p>Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher Vorgaben kann es notwendig werden, sie anzupassen.</p>
    </div>
  </div>
</section>`;

export default {
  slug: "datenschutz",
  title: "Datenschutz",
  desc: "Datenschutzerklärung von Trustydruck – Print & Media, Meschede. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
  body,
};
