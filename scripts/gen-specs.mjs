// Generates the remaining component specs. Every computed value comes from the
// browser capture (extracted/styles-{1440,768,390}.json); only the behaviour
// sections are hand-written. The responsive table is generated from the same
// capture at all three widths, so no mobile value is ever guessed.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const ART = "docs/research/upkeepmedspa-com-9d00bd1f/root-8a5edab2";
const OUT = `${ART}/components`;
mkdirSync(OUT, { recursive: true });

const S = {};
for (const w of [1440, 768, 390]) S[w] = JSON.parse(readFileSync(`${ART}/extracted/styles-${w}.json`, "utf8"));
const R = {};
for (const w of [1440, 768, 390]) R[w] = JSON.parse(readFileSync(`${ART}/extracted/responsive-${w}.json`, "utf8"));

const NOISE = new Set([
  "borderTop","borderRight","borderBottom","borderLeft","objectFit","objectPosition","transformOrigin",
  "fill","stroke","transitionTimingFunction","animationTimingFunction","animationFillMode","animationIterationCount",
  "pointerEvents","textDecoration","textOverflow","verticalAlign","float","flexBasis","flexShrink",
  "gridAutoFlow","placeItems","whiteSpace","mixBlendMode","backdropFilter","transform","opacity","visibility",
  "cursor","outline","outlineOffset","aspectRatio","maxWidth",
]);
const KEEP = ["display","position","top","right","bottom","left","zIndex","width","height","minHeight",
  "padding","paddingTop","paddingRight","paddingBottom","paddingLeft","margin","marginTop","marginBottom",
  "flexDirection","flexWrap","justifyContent","alignItems","gap","rowGap","columnGap","gridTemplateColumns",
  "fontFamily","fontSize","fontWeight","fontStyle","lineHeight","letterSpacing","textTransform","textAlign",
  "textShadow","color","backgroundColor","backgroundImage","borderRadius","boxShadow","overflow","filter",
  "clipPath","transition","animationName","animationDuration"];

function cssBlock(name, w = 1440, nodes = 1) {
  const v = S[w][name];
  if (!v || v.error) return `_no probe for \`${name}\`_\n`;
  let out = "";
  for (const n of v.nodes.slice(0, nodes)) {
    const label = n.cls ? n.cls.split(/\s+/).map((c) => "." + c).join("") : n.tag;
    out += `\n**${label}** — ${n.rect.w}×${n.rect.h}px, ${n.childCount} child element(s)\n`;
    if (n.text) out += `\n> \`${n.text.slice(0, 100)}\`\n`;
    const parts = KEEP.filter((k) => n.style[k] !== undefined && !NOISE.has(k)).map((k) => `- \`${k}\`: \`${n.style[k]}\``);
    if (parts.length) out += "\n" + parts.join("\n") + "\n";
    if (n.childClasses?.length) out += `- children: ${n.childClasses.map((c) => `\`${c}\``).join(", ")}\n`;
  }
  return out;
}

function respTable(probes) {
  let out = "| element | 1440 | 768 | 390 |\n| --- | --- | --- | --- |\n";
  for (const p of probes) {
    const cells = [1440, 768, 390].map((w) => {
      const v = S[w][p];
      if (!v || v.error) return "n/a";
      const n = v.nodes[0];
      if (!n) return "n/a";
      const b = [];
      if (n.style.fontSize) b.push(n.style.fontSize);
      if (n.style.lineHeight) b.push("lh " + n.style.lineHeight);
      if (n.style.letterSpacing && n.style.letterSpacing !== "normal") b.push("ls " + n.style.letterSpacing);
      if (n.style.gridTemplateColumns) b.push("cols " + n.style.gridTemplateColumns);
      if (n.style.flexDirection && n.style.flexDirection !== "row") b.push("dir " + n.style.flexDirection);
      if (n.style.display === "none") b.push("**hidden**");
      if (n.rect.w) b.push("w " + Math.round(n.rect.w));
      return b.join(" · ") || "—";
    });
    out += `| \`${p}\` | ${cells[0]} | ${cells[1]} | ${cells[2]} |\n`;
  }
  return out;
}

const COMMON = `## Styling contract (read this first)

The target's own stylesheet is already ported to
\`src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css\` and imported **unlayered** by
\`src/app/globals.css\`, so it beats Tailwind preflight and wins the cascade. That sheet also
contains the site's own **utility classes** (\`.text-center\`, \`.mx-auto\`, \`.mb-4\`, \`.mb-6\`,
\`.mb-8\`, \`.flex\`, \`.overflow-hidden\`), so the class strings in the captured DOM resolve
without any Tailwind at all.

**Use the ported class names verbatim and write no new CSS.** Do not add Tailwind colour,
spacing, font-size or font-family utilities — the type scale, palette and easings live in the
ported sheet. Combine classes with \`cn()\` from \`@/lib/utils\` when you need a conditional.

- Icons: \`@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons\`
- Content: \`@/lib/upkeepmedspa-data\` — every string, href and image path (with intrinsic
  \`width\`/\`height\`) is already the live site's. Read from it; do not hardcode copy.
- Types: \`@/types/upkeepmedspa\`
- Images: \`next/image\`. In Next 16 \`priority\` is **deprecated** — use
  \`loading="eager"\` + \`fetchPriority="high"\` above the fold, default lazy below it.
  \`fill\` requires a positioned parent; where the ported sheet already gives the wrapper
  \`position: absolute\` (e.g. \`.location-card__bg\`) \`fill\` works directly. Where the class
  carries its own \`aspect-ratio\` (e.g. \`.svc-tile__img\`, \`.blog-card__image\`) prefer explicit
  \`width\`/\`height\` props from the data. Always pass \`sizes\` with \`fill\`.
  A global rule in the sheet already colour-grades images — do not add filters.
- **Before you finish:** \`npx tsc --noEmit\` must pass. On this machine run it as
  \`npx.cmd tsc --noEmit\` (PowerShell blocks \`npx.ps1\`).
`;

const REVEAL = `### Entrance reveal — CSS only
\`fade-in\` elements animate via **native CSS scroll-driven animation already in the ported
sheet**: \`opacity: 0\` + \`animation: revealFade linear both\`, \`animation-timeline: view()\`,
\`animation-range: entry 0% entry 80%\`, ending at \`opacity: 1\`. **Add the class and stop.**
No IntersectionObserver, no framer-motion, no opacity state. Where \`animation-timeline\` is
unsupported the sheet keeps \`opacity: 1\`, so content stays visible without JS.`;

const EXTERNAL = `Render \`https://…\` links with \`target="_blank" rel="noopener noreferrer"\`
(matches the source) and internal hrefs as plain \`<a>\`. Do **not** use \`next/link\` — the target
is a static site with plain anchors and the ported CSS styles bare \`a\`.`;

const COMPONENTS = [
  {
    file: "servicessection", component: "ServicesSection", outline: "03-services",
    shot: "sec-03-services.png", data: "`services`",
    model: "static (four `fade-in` blocks: header, grid, CTA wrapper)",
    probes: [["servicesSection",1],["servicesRow",1],["svcTile",1],["svcTileImg",1],["svcTileImgEl",1],["svcTileTitle",1],["svcTileDesc",1],["pricingDisclosure",1]],
    respProbes: ["servicesRow","svcTileTitle","svcTileDesc","pricingDisclosure","btnArrow","headingSection"],
    behaviour: `${REVEAL}

### Grid
- \`.services-row\` is a CSS grid. Columns measured: **4** at 1440 (296px each), **2** at 768
  (341.28px), **2** at 390 (171px). The sheet owns the breakpoint — do not add Tailwind grid
  classes. Render all **8** tiles in source order:
  \`services.tiles\` is already in order (Neurotoxins, Lip Enhancement, Dermal Fillers,
  Facials & Skin, Regenerative, Specialty, Laser, Body Contouring).

### Service tile anatomy
- \`<a class="svc-tile" href={tile.href}>\` wrapping \`<div class="svc-tile__img">\` +
  \`<h3 class="svc-tile__title">\` + \`<p class="svc-tile__desc">\`.
- \`.svc-tile__img\` = \`width: 100%; aspect-ratio: 3/4; border-radius: 8px; overflow: hidden\`
  and its inner \`img\` is \`width:100%; height:100%; object-fit:cover\`. So the **wrapper is the
  aspect box**: add \`relative\` to it and use \`<Image fill className="object-cover">\`, or pass the
  data's \`width\`/\`height\`. Either is fine — the sheet's \`aspect-ratio\` governs the box.
  The source images are a mix of portrait (1080×1610) and landscape (2752×1536) originals,
  all cropped to 3:4 by \`object-fit: cover\`. Reproduce the crop.
- Note the source images have **different intrinsic ratios on purpose**; do not normalise them.

### Price highlighting (easy to miss — two tiles only)
The source wraps prices in a rose-gold span **inside** \`.svc-tile__desc\`:
- \`<p class="svc-tile__desc">\` for **Neurotoxins**:
  \`Botox, Dysport & Xeomin — starting at <span style="color:#d4a090">$5/unit</span>\`
- for **Lip Enhancement**:
  \`Quick Lips from <span style="color:#d4a090">$275</span> — full syringes from <span style="color:#d4a090">$550</span>\`

Do **not** hand-write that markup into the string. Each \`ServiceTile\` carries an optional
\`highlights: string[]\` listing the substrings to emphasise (\`["$5/unit"]\` and
\`["$275", "$550"]\`; the other six tiles have none). Split \`tile.description\` on those
substrings and wrap each match in \`<span style={{ color: "#d4a090" }}>\`. Keep the em dash and
spacing exactly as-is.

### Pricing disclosure
- \`.pricing-disclosure\` sits **between** the grid and the CTA, as its own block. Full text is
  in \`services.pricingDisclosure\` — reproduce it verbatim, including the "3% surcharge" wording.
- It is \`font-size: 17px; line-height: 27.2px; width: 720px\` at 1440 and wraps to ~111px tall
  at 390. Do not shorten it.

### CTA
- \`<div class="text-center fade-in">\` containing \`<a class="btn btn--arrow">\` "View All Services".
  \`.btn--arrow\`'s arrow glyph is a \`::after\` in the sheet and renders itself.

### Hover
- The whole tile is a link; hover states are CSS-only in the sheet (image scale / title colour
  over 180–800ms). Add no JS, no transition utilities.`,
  },
  {
    file: "locationssection", component: "LocationsSection", outline: "05-locations",
    shot: "sec-05-locations.png", data: "`locations`",
    model: "static (`fade-in` on the header, grid and CTA wrapper)",
    probes: [["locSection",1],["locGrid",1],["locCard",1],["locCardBg",1],["locCardBgImg",1],["locCardOverlay",1],["locCardContent",1],["locCardName",1],["locCardAddr",1]],
    respProbes: ["grid4","locCardName","locCardAddr","btnArrow","headingSection"],
    behaviour: `${REVEAL}

### Three-layer card (important — all three layers exist)
\`\`\`
<a class="location-card" href={card.href}>
  <div class="location-card__bg">
    <img />                                  <- fill, object-cover
  <div class="location-card__overlay">        <- bottom-up darkening gradient
  <div class="location-card__content">
    <h3 class="location-card__name">…
    <p class="location-card__address">…
\`\`\`
- The overlay is \`linear-gradient(rgba(0,0,0,0) 40%, rgba(10,10,10,0.9) 100%)\` — a real element
  in the markup, not a CSS-only gradient. Do not merge or drop it.
- \`.location-card__bg\` is \`position: absolute; inset: 0\`, so it is already a valid parent for
  \`next/image\` \`fill\` + \`className="object-cover"\` + \`sizes\`.
- The card has a fixed height and the text is anchored to the **bottom** via
  \`.location-card__content\` — do not add flex wrappers of your own.

### Grid
- \`.grid-4\` columns measured: **4** at 1440 (299px each), **2** at 768 (343.28px),
  **2** at 390 (173px). Seven cards, so row 1 has 4 and row 2 has 3 — that ragged second row is
  the target's real layout. Do not force a 3+4 split.

### Content
- \`locations.cards\` is in source order: Upper East Side, Greenwich Village, Brooklyn, Chelsea,
  Long Island, Dallas, Addison — with the exact address strings and the anchor hrefs
  (\`/locations#ues\`, \`#gv\`, \`#bk\`, \`#ch\`, \`#li\`, \`#dal\`, \`#add\`).
- CTA after the grid: \`<a class="btn btn--arrow">\` "View All Locations" → \`/locations\`.

### Hover
- \`.location-card__bg img\` has \`transition: transform 800ms var(--ease-out)\` and the card
  scales the photo on hover. CSS-only in the sheet — add no JS.`,
  },
  {
    file: "journalsection", component: "JournalSection", outline: "07-journal",
    shot: "sec-07-journal.png", data: "`journal`",
    model: "static (`fade-in` on the header row and each card)",
    probes: [["journalSection",1],["journalGrid",1],["blogCard",1],["blogCardImage",1],["blogCardContent",1],["blogCardCategory",1],["blogCardTitle",1],["blogCardExcerpt",1]],
    respProbes: ["grid3","blogCardCategory","blogCardTitle","blogCardExcerpt","btnSmall","headingSection"],
    behaviour: `${REVEAL}

### Header row
- The header is a flex row: eyebrow + \`<h2 class="heading-section">\` "How to UPKEEP" on the left,
  and \`<a class="btn btn--small btn--arrow fade-in">\` "Read All Articles" on the right.
  The \`.flex\` utility (with \`justify-content\`/\`gap\` from the sheet) handles the split — do not
  rebuild it with a grid.

### Blog card anatomy
\`\`\`
<a class="blog-card overflow-hidden" href={card.href}>
  <img class="blog-card__image" />
  <div class="blog-card__content">
    <p class="blog-card__category">…
    <h3 class="blog-card__title">…
    <p class="blog-card__excerpt">…
\`\`\`
- **\`blog-card__image\` is on the \`<img>\` itself, not a wrapper.** It carries
  \`width: 100%; aspect-ratio: 16/10; object-fit: cover\` — so it *is* the aspect box. Use explicit
  \`width\`/\`height\` props from \`card.image\` and let the sheet's \`aspect-ratio\` + \`object-fit\`
  do the work; a \`fill\` image would collapse here because there is no positioned parent.
- The three source photos are **portrait** (500×649, 500×745, 500×750) cropped into a 16:10
  landscape box — a heavy centre crop. Reproduce it; do not "fix" the orientation.
- \`.grid-3\` columns measured: **3** at 1440 (402.66px), **1** at 768, **1** at 390.

### Content
- \`journal.cards\` in order: Neurotoxin / "The Subtle Lift You Didn't Know You Needed: Nefertiti +
  DAO Neurotoxin"; Filler / "Under Eye Filler: The Secret to Looking Well-Rested";
  Skin Health / "Microneedling vs. Laser: Which Treatment Is Right for You?".
  Excerpts and hrefs (\`/blog/nefertiti-lift\`, \`/blog/under-eye-filler\`,
  \`/blog/microneedling-vs-laser\`) are in the data module — reproduce verbatim.

### Hover
- \`.blog-card:hover .blog-card__image { transform: scale(1.03) }\` with
  \`transition: transform 600ms var(--ease-out)\`. CSS-only — add no JS.`,
  },
];

// The captured outlines contain 7-8 structurally identical sibling cards, which
// blows the spec past the ~150-line budget a builder can absorb. Collapse runs of
// consecutive siblings that share a class signature, keeping the first and
// annotating the count. Real structural differences are always preserved.
function collapseRepeats(text) {
  const lines = text.split("\n");
  const N = lines.length;
  const ind = new Array(N);
  const sig = new Array(N);
  for (let k = 0; k < N; k++) {
    const t = lines[k];
    ind[k] = t.length - t.replace(/^ +/, "").length;
    sig[k] = t.trim()
      .replace(/"[^"]*"/g, '"…"')
      .replace(/href="[^"]*"/g, 'href="…"')
      .replace(/src="[^"]*"/g, 'src="…"');
  }
  const out = [];
  // Collapse on TAG + CLASS only. Text, href, src and alt all come from the data
  // module, so cards that differ only in those are structurally identical and a
  // builder needs to see one of them, not eight.
  // The outline format writes classes in dot-notation (".location-card__bg"),
  // not class="…", so match the token right after the tag name.
  const classSig = (line) => {
    const t = line.trim();
    const head = /^<([a-zA-Z][\w-]*)\s*([^\s>]*)/.exec(t);
    const tag = head?.[1] ?? "?";
    const rest = head?.[2] ?? "";
    const classes = (rest.match(/\.[\w-]+/g) || []).join("");
    return `${tag}|${classes}`;
  };
  for (let k = 0; k < N; k++) {
    out.push(lines[k]);
    if (k + 1 >= N) break;
    if (ind[k + 1] !== ind[k] || classSig(lines[k + 1]) !== classSig(lines[k])) continue;
    const target = classSig(lines[k]);
    let count = 0;
    let j = k + 1;
    while (j < N && ind[j] >= ind[k]) {
      if (ind[j] === ind[k] && classSig(lines[j]) === target) count++;
      j++;
    }
    if (count > 0) {
      out.push(
        " ".repeat(ind[k]) +
          `… and ${count} more sibling${count > 1 ? "s" : ""} with the same tag and classes as the above (their text/href/src differ and come from the data module)`
      );
      k = j - 1;
    }
  }
  return out.join("\n");
}

for (const c of COMPONENTS) {
  const domPath = `${ART}/dom-outlines/${c.outline}.txt`;
  const dom = existsSync(domPath) ? collapseRepeats(readFileSync(domPath, "utf8")) : "_outline not captured_";
  const css = c.probes.map(([n, k]) => `### \`${n}\`\n${cssBlock(n, 1440, k)}`).join("\n");
  const md = `# ${c.component} Specification

## Overview
- **Target file:** \`src/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/${c.component}.tsx\`
- **Screenshot:** \`docs/design-references/upkeepmedspa-com-9d00bd1f/root-8a5edab2/${c.shot}\`
- **Interaction model:** ${c.model}
- **Export:** named \`${c.component}\`, **no props** — read content from ${c.data} in \`@/lib/upkeepmedspa-data\`.
${COMMON}
## DOM Structure — captured verbatim from the live page

Repeated sibling cards are collapsed to the first instance plus a count; their text,
hrefs and image paths all come from ${c.data}.

\`\`\`text
${dom}
\`\`\`

## Computed Styles — getComputedStyle() at 1440×900, defaults filtered out
${css}
## States & Behaviors
${c.behaviour}
## Responsive — measured at all three widths (not estimated)

${respTable(c.respProbes)}
All of the above is driven by the ported sheet's own media queries and fluid \`clamp()\` type
scale. Do not add Tailwind breakpoints or hardcode pixel font sizes.

## External vs internal links
${EXTERNAL}`;
  writeFileSync(`${OUT}/${c.file}.spec.md`, md);
  console.log(`${c.file}.spec.md  ${(md.length / 1024).toFixed(1)} KB  ${md.split("\n").length} lines`);
}
console.log("done");
