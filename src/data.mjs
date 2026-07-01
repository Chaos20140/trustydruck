// Shared content — original Trustydruck copy preserved verbatim.
// Each of the four services maps 1:1 to one of the four print inks (CMYK).
import { ICON } from "./layout.mjs";

export const SERVICES = [
  {
    slug: "leuchtreklame", num: "01", icon: ICON.sign, chan: "c", channel: "Cyan",
    title: "Leuchtreklame", img: "assets/img/svc-leuchtreklame.jpg", fit: "cover", stamp: "Gut zum Druck",
    lead: "Setzen Sie Ihre Marke ins richtige Licht!",
    short: "Wir gestalten und produzieren hochwertige Leuchtreklamen, die Ihre Botschaft bei Tag und Nacht perfekt präsentieren. Mit modernster LED-Technik und langlebigen Materialien sorgen wir dafür, dass Ihre Werbung immer auffällt und im besten Licht erstrahlt.",
    tags: ["LED-Technik", "Leuchtkästen", "Profilbuchstaben", "Tag & Nacht"],
    features: [
      ["Profil- & Leuchtbuchstaben", "Plastisch, hochwertig und weithin sichtbar – individuell für Ihre Fassade gefertigt."],
      ["Leuchtkästen & Displays", "Homogen ausgeleuchtete Werbeflächen mit langlebiger LED-Technik."],
      ["Energieeffiziente LEDs", "Moderne Technik für maximale Wirkung bei minimalem Verbrauch."],
      ["Montage & Beratung", "Von der Planung über die Genehmigung bis zur fertigen Montage."],
    ],
  },
  {
    slug: "textildruck", num: "02", icon: ICON.shirt, chan: "m", channel: "Magenta",
    title: "Textildruck", img: "assets/img/textildruck.jpg", fit: "cover", stamp: "Freigegeben",
    lead: "Individueller Textildruck für jeden Anlass!",
    short: "Ob Firmenkleidung, Vereinsbedarf oder persönliche Geschenke – wir bringen Ihre Ideen auf Textil. Mit hochwertigen Drucktechniken wie Siebdruck und Flexdruck sowie präziser Stickerei garantieren wir langanhaltende Ergebnisse, die überzeugen.",
    tags: ["Siebdruck", "Flexdruck", "Stickerei", "Firmenkleidung"],
    features: [
      ["Siebdruck", "Brillante, deckende Farben – ideal für höhere Auflagen und kräftige Motive."],
      ["Flex- & Flockdruck", "Perfekt für Namen, Nummern und kleine Serien mit sauberer Kante."],
      ["Stickerei", "Edel und langlebig für Polos, Caps, Jacken und Workwear."],
      ["Firmen- & Vereinsbedarf", "Einheitliche Teamkleidung, die Ihre Marke professionell trägt."],
    ],
  },
  {
    slug: "print-medien", num: "03", icon: ICON.printer, chan: "y", channel: "Yellow",
    title: "Print & Medien", img: "assets/img/svc-print-medien.jpg", fit: "cover", stamp: "Gut zum Druck",
    lead: "Hochwertige Druckprodukte für jeden Bedarf.",
    short: "Von Visitenkarten über Flyer bis hin zu großformatigen Bannern – wir bieten Ihnen alles, was Sie für Ihre Drucksachen benötigen. Unsere Druckprodukte zeichnen sich durch exzellente Qualität und schnelle Lieferung aus.",
    tags: ["Visitenkarten", "Flyer & Broschüren", "Banner", "Großformat"],
    features: [
      ["Visitenkarten & Flyer", "Hochwertige Veredelung, die in Erinnerung bleibt."],
      ["Broschüren & Kataloge", "Durchdachtes Layout und sauberer Druck für Ihren Auftritt."],
      ["Banner & Großformat", "Wetterfeste Werbung für Messe, Bau und Außenwerbung."],
      ["Schnelle Lieferung", "Verlässliche Termine ohne Kompromisse bei der Qualität."],
    ],
  },
  {
    slug: "grafik", num: "04", icon: ICON.spark, chan: "k", channel: "Key / Schwarz",
    title: "Grafik & Logo", img: "assets/img/svc-grafik.jpg", fit: "cover", stamp: "Freigegeben",
    lead: "Kreative Designs, die begeistern!",
    short: "Wir verwandeln Ihre Ideen in visuell ansprechende und professionelle Medien, die Ihre Zielgruppe ansprechen. Vom Logo über Broschüren bis hin zu digitalen Grafiken bieten wir maßgeschneiderte Lösungen, die Ihr Unternehmen perfekt widerspiegeln.",
    tags: ["Logo-Design", "Corporate Design", "Digitale Grafik", "Layout"],
    features: [
      ["Logo & Markenidentität", "Ein prägnantes Zeichen, das Ihre Marke unverwechselbar macht."],
      ["Corporate Design", "Einheitliche Gestaltung über alle Werbemittel hinweg."],
      ["Digitale Grafiken", "Content für Social Media, Web und Präsentationen."],
      ["Druckvorstufe", "Druckfertige Daten – perfekt vorbereitet für beste Ergebnisse."],
    ],
  },
];

export const KEYWORDS = [
  "Leuchtreklame", "Textildruck", "Siebdruck", "Stickerei", "Visitenkarten",
  "Flyer", "Banner", "Logo-Design", "Corporate Design", "Beschriftung",
  "Großformat", "Werbetechnik", "Firmenkleidung", "Vier Farben",
];
