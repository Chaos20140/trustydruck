import { SITE } from "../layout.mjs";
import { eyebrow } from "../components.mjs";

const body = `
<section class="page-hero">
  <div class="container">
    <div class="crumbs reveal"><a href="index.html">Home</a> / Impressum</div>
    ${eyebrow("Rechtliches")}
    <h1 class="display reveal">Impressum</h1>
  </div>
</section>
<section class="section" style="padding-top:clamp(20px,3vw,40px)">
  <div class="container">
    <div class="prose reveal">
      <div class="note">Hinweis für Trustydruck: Bitte prüft die mit <strong>[ … ]</strong> markierten Felder und ergänzt sie mit euren echten Angaben (u.&nbsp;a. Name des Inhabers und ggf. USt-IdNr.). Lasst das Impressum im Zweifel rechtlich prüfen.</div>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <strong>${SITE.full}</strong><br>
        [Vor- und Nachname des Inhabers / der Inhaberin]<br>
        ${SITE.street}<br>
        ${SITE.city}<br>
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a><br>
        E-Mail: <a href="mailto:${SITE.email}">${SITE.email}</a>
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br>[USt-IdNr., sofern vorhanden]</p>

      <h2>Redaktionell verantwortlich</h2>
      <p>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br>[Vor- und Nachname]<br>${SITE.street}, ${SITE.city}</p>

      <h2>EU-Streitschlichtung</h2>
      <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.<br>
        Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>

      <h2>Verbraucher­streit­beilegung / Universal­schlichtungs­stelle</h2>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2>Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.</p>

      <h2>Haftung für Links</h2>
      <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>

      <h2>Urheberrecht</h2>
      <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
    </div>
  </div>
</section>`;

export default {
  slug: "impressum",
  title: "Impressum",
  desc: "Impressum von Trustydruck – Print & Media, Meschede. Anbieterkennzeichnung gemäß § 5 DDG.",
  body,
};
