// Static site generator — assembles src/pages/* with the shared layout into
// plain HTML files at the project root. No runtime build: the output is what ships.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { layout, SITE } from "./src/layout.mjs";

import home from "./src/pages/home.mjs";
import leistungen from "./src/pages/leistungen.mjs";
import ueber from "./src/pages/ueber-uns.mjs";
import kontakt from "./src/pages/kontakt.mjs";
import impressum from "./src/pages/impressum.mjs";
import datenschutz from "./src/pages/datenschutz.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const pages = [home, leistungen, ueber, kontakt, impressum, datenschutz];

for (const p of pages) {
  const file = p.slug === "home" ? "index.html" : `${p.slug}.html`;
  const html = layout(p);
  await writeFile(path.join(ROOT, file), html, "utf8");
  console.log(`  ✓ ${file.padEnd(20)} ${(html.length / 1024).toFixed(1)} KB`);
}

// sitemap.xml
const urls = pages.map((p) => (p.slug === "home" ? "" : `${p.slug}.html`));
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">\n`.replace(
    "sitemap.org",
    "sitemaps.org"
  ) +
  urls.map((u) => `  <url><loc>${SITE.url}/${u}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
await writeFile(path.join(ROOT, "sitemap.xml"), sitemap, "utf8");

// robots.txt
await writeFile(
  path.join(ROOT, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`,
  "utf8"
);

// .nojekyll so GitHub Pages serves files as-is
await writeFile(path.join(ROOT, ".nojekyll"), "", "utf8");

console.log(`\n${pages.length} pages + sitemap.xml + robots.txt generated.`);
