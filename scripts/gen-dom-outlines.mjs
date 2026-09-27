// Produces a clean, indented DOM outline for each captured section by parsing the
// saved outerHTML in a real browser DOM (regex parsing mis-attributes text and
// drifts in depth). Text is attached to the element that actually contains it.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const ART = "docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const OUT = `${ART}/dom-outlines`;
mkdirSync(OUT, { recursive: true });

const files = [
  ["00-nav", "00-nav.html"],
  ["01-hero", "01-hero.html"],
  ["02-intro", "02-intro.html"],
  ["03-services", "03-services.html"],
  ["04-testimonials", "04-testimonials.html"],
  ["05-locations", "05-locations.html"],
  ["06-press", "06-press.html"],
  ["07-journal", "07-journal.html"],
  ["08-booking-cta", "08-booking-cta.html"],
  ["09-footer", "09-footer.html"],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!doctype html><html><body></body></html>");

for (const [key, file] of files) {
  const html = readFileSync(`${ART}/sections/${file}`, "utf8");
  const outline = await page.evaluate((markup) => {
    const host = document.createElement("div");
    host.innerHTML = markup;
    const lines = [];
    const ownText = (el) =>
      [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" ");
    const walk = (el, d) => {
      const tag = el.tagName.toLowerCase();
      if (tag === "script" || tag === "style") return;
      const bits = [];
      if (el.id) bits.push(`#${el.id}`);
      const cls = (el.className && el.className.toString ? el.className.toString().trim() : "")
        .split(/\s+/).filter(Boolean).map((c) => "." + c).join("");
      if (cls) bits.push(cls);
      const t = ownText(el);
      if (t) bits.push(JSON.stringify(t.length > 100 ? t.slice(0, 100) + "…" : t));
      for (const a of ["alt", "aria-label", "href", "src", "data-src", "data-testimonial", "data-dot", "data-signup-close", "data-open-signup", "style", "type", "role", "hidden", "autocomplete"]) {
        const v = el.getAttribute(a);
        if (v) bits.push(`${a}="${v.length > 100 ? v.slice(0, 100) + "…" : v}"`);
      }
      if (el.tagName === "IMG") {
        const d = document.createElement("div");
        d.appendChild(el.cloneNode());
      }
      lines.push("  ".repeat(d) + `<${tag}${bits.length ? " " + bits.join(" ") : ""}>`);
      for (const c of el.children) walk(c, d + 1);
    };
    for (const c of host.children) walk(c, 0);
    return lines.join("\n");
  }, html);
  writeFileSync(`${OUT}/${key}.txt`, outline);
  console.log(`${key}: ${outline.split("\n").length} nodes, ${(outline.length / 1024).toFixed(1)} KB`);
}

await browser.close();
console.log("done");
