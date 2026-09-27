// State + computed-style extraction for https://upkeepmedspa.com/ (root page)
// site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
// Writes compact JSON per concern under docs/research/<site>/<page>/extracted/

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "upkeepmedspa-com-9d00bd1f";
const PAGE = "root-8a5edab2";
const URL = "https://upkeepmedspa.com/";
const SHOTS = `docs/design-references/${SITE}/${PAGE}`;
const OUT = `docs/research/${SITE}/${PAGE}/extracted`;
mkdirSync(OUT, { recursive: true });

const PROPS = [
  "fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","color","fontStyle","fontVariantNumeric",
  "textTransform","textDecoration","textAlign","backgroundColor","backgroundImage",
  "padding","paddingTop","paddingRight","paddingBottom","paddingLeft",
  "margin","marginTop","marginRight","marginBottom","marginLeft",
  "width","height","maxWidth","minWidth","maxHeight","minHeight","aspectRatio",
  "display","flexDirection","flexWrap","justifyContent","alignItems","alignSelf","gap","rowGap","columnGap","flex",
  "gridTemplateColumns","gridTemplateRows","gridAutoFlow","placeItems",
  "borderRadius","border","borderTop","borderRight","borderBottom","borderLeft","borderColor","borderWidth","outline","outlineOffset",
  "boxShadow","overflow","overflowX","overflowY","objectFit","objectPosition",
  "position","top","right","bottom","left","zIndex",
  "opacity","transform","transformOrigin","transition","transitionDuration","transitionTimingFunction","animation",
  "cursor","pointerEvents","visibility","mixBlendMode","filter","backdropFilter","clipPath",
  "whiteSpace","textOverflow","WebkitLineClamp","listStyleType","textShadow","verticalAlign","float",
];

// Runs in the page. Collects computed styles for a set of {name, selector} pairs.
// PROPS must arrive as an argument — this function is serialized into the page
// and cannot close over module scope.
const COLLECT = ([pairs, PROPS]) => {
  const clean = (v) => (v === "none" || v === "normal" || v === "auto" || v === "0px" || v === "rgba(0, 0, 0, 0)" || v === "0s" || v === "static" || v === "visible" ? undefined : v);
  const out = {};
  for (const { name, selector, all } of pairs) {
    const nodes = [...document.querySelectorAll(selector)];
    if (!nodes.length) { out[name] = { error: "not found", selector }; continue; }
    const take = (el, idx) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const s = {};
      for (const p of PROPS) { const v = cs[p]; const c = clean(v); if (c !== undefined) s[p] = c; }
      return {
        idx,
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString ? el.className.toString() : "").trim().slice(0, 120),
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
        rect: { w: Math.round(r.width), h: Math.round(r.height) },
        style: s,
      };
    };
    out[name] = { selector, count: nodes.length, nodes: all ? nodes.map((el, i) => take(el, i)) : [take(nodes[0], 0)] };
  }
  return out;
};

const log = [];
const say = (m) => { console.log(m); log.push(m); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

async function warmLazy() {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(80); }
  await page.waitForTimeout(1000);
  await page.evaluate(async () => {
    await Promise.all([...document.querySelectorAll("img")].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    if (document.fonts) await document.fonts.ready;
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1500);
await warmLazy();
// The 12s signup timer fires during warmLazy and locks body overflow; hide the
// JS-injected overlays so they can't interfere with visibility/hover probing.
await page.addStyleTag({
  content: `#upkeep-consent-banner, #a11y-menu-root, .signup-popup, .upk-flash-overlay, .upk-rsvp-overlay { display: none !important; }`,
});

// ---------------------------------------------------------------- 1. STYLES
const PAIRS = [
  ["body", "body"],
  ["nav", "nav.nav"],
  ["navInner", ".nav__inner"],
  ["navLogo", ".nav__logo"],
  ["navLogoImg", ".nav__logo img"],
  ["navLinks", ".nav__links"],
  ["navLink", ".nav__links > li > .nav__link"],
  ["navDropdown", ".nav__dropdown"],
  ["navCtaGroup", ".nav__cta-group"],
  ["btnAccent", ".nav__cta-group .btn--accent, .btn.btn--accent"],
  ["hamburger", ".nav__hamburger"],
  ["hero", "section.hero"],
  ["heroBg", ".hero__bg"],
  ["heroBgImg", ".hero__bg img"],
  ["heroOverlay", ".hero__overlay"],
  ["heroContent", ".hero__content"],
  ["heroEyebrow", ".hero__eyebrow"],
  ["heroH1", ".hero__title, .hero__content h1"],
  ["heroLead", ".hero__lead, .hero__sub"],
  ["heroActions", ".hero__actions"],
  ["heroSpecials", ".hero__specials, .hero__content a.btn--ghost"],
  ["heroScrollHint", ".hero__scroll-hint"],
  ["section", "main > section:nth-of-type(2)"],
  ["container", "main > section:nth-of-type(2) .container"],
  ["eyebrow", ".eyebrow"],
  ["h2", "main > section:nth-of-type(2) h2"],
  ["lede", ".lede, .section__lede"],
  ["btnOutline", ".btn--outline"],
  ["servicesSection", "main > section:nth-of-type(3)"],
  ["servicesHeader", "main > section:nth-of-type(3) .section-head, main > section:nth-of-type(3) .container > *:first-child"],
  ["svcGrid", ".svc-grid, #services .services-grid, #services [class*=grid]"],
  ["svcTile", ".svc-tile"],
  ["svcTileImgWrap", ".svc-tile__img, .svc-tile__media"],
  ["svcTileImg", ".svc-tile__img img"],
  ["svcTileBody", ".svc-tile__body"],
  ["svcTileTitle", ".svc-tile__title, .svc-tile h3"],
  ["svcTileText", ".svc-tile__text, .svc-tile p"],
  ["svcNote", ".svc-note, #services [class*=note]"],
  ["testiSection", "main > section:nth-of-type(4)"],
  ["testiRating", ".testi-rating, [class*=rating]"],
  ["testiStars", ".stars, [class*=star]"],
  ["testiQuote", ".testimonial__quote, [data-testimonial] blockquote, [data-testimonial] p"],
  ["testiAuthor", ".testimonial__author, [data-testimonial] cite"],
  ["testiDots", ".testimonial-dots"],
  ["testiDot", ".testimonial-dot"],
  ["testiNote", ".testi-note, [class*=note]"],
  ["locSection", "main > section:nth-of-type(5)"],
  ["locGrid", ".locations-grid, main > section:nth-of-type(5) [class*=grid]"],
  ["locCard", ".location-card"],
  ["locCardBg", ".location-card__bg"],
  ["locCardBgImg", ".location-card__bg img"],
  ["locCardOverlay", ".location-card__overlay"],
  ["locCardBody", ".location-card__body"],
  ["locCardName", ".location-card__name, .location-card h3"],
  ["locCardAddr", ".location-card__addr, .location-card address"],
  ["pressSection", "main > section:nth-of-type(6)"],
  ["pressList", ".press-row, .press-grid, main > section:nth-of-type(6) [class*=press]"],
  ["pressItem", ".press-item, .press-row > *"],
  ["journalSection", "main > section:nth-of-type(7)"],
  ["journalHead", "main > section:nth-of-type(7) .section-head"],
  ["journalGrid", ".blog-grid, .journal-grid, main > section:nth-of-type(7) [class*=grid]"],
  ["blogCard", ".blog-card, .post-card, [class*=card]"],
  ["blogCardImgWrap", ".blog-card__img, .post-card__img"],
  ["blogCat", ".blog-card__cat, .post-card__cat, .card-cat"],
  ["blogTitle", ".blog-card__title, .post-card__title"],
  ["blogExcerpt", ".blog-card__excerpt, .post-card__excerpt"],
  ["ctaSection", "section.booking-cta"],
  ["ctaBg", ".booking-cta__bg"],
  ["ctaBgImg", ".booking-cta__bg img"],
  ["ctaContent", ".booking-cta__content"],
  ["ctaH2", "section.booking-cta h2"],
  ["ctaLead", "section.booking-cta p"],
  ["footer", "footer.footer"],
  ["footerGrid", ".footer__grid"],
  ["footerBrandLogo", ".footer__brand-logo"],
  ["footerTagline", ".footer__tagline"],
  ["footerSocial", ".footer__social"],
  ["footerSocialLink", ".footer__social-link"],
  ["footerCol", ".footer__col"],
  ["footerColTitle", ".footer__col h3, .footer__col-title"],
  ["footerBottom", ".footer__bottom"],
  ["a11yNotice", ".footer__a11y-notice"],
  ["btnBase", ".btn"],
  ["btnVariants", ".btn--accent"],
];

const styles = await page.evaluate(COLLECT, [PAIRS.map(([name, sel]) => ({ name, selector: sel, all: true })), PROPS]);
writeFileSync(`${OUT}/styles-1440.json`, JSON.stringify(styles, null, 1));
say(`styles-1440.json: ${Object.keys(styles).length} probes, errors=${Object.values(styles).filter((v) => v.error).length}`);
for (const [k, v] of Object.entries(styles)) if (v.error) say(`  MISS ${k} (${v.selector})`);

// ------------------------------------------------- 2. ALL TESTIMONIAL STATES
const testi = await page.evaluate(() => {
  const panels = [...document.querySelectorAll("[data-testimonial]")];
  const dots = [...document.querySelectorAll(".testimonial-dot")];
  return {
    count: panels.length,
    dotCount: dots.length,
    panels: panels.map((p, i) => ({
      i,
      display: getComputedStyle(p).display,
      text: p.textContent.replace(/\s+/g, " ").trim(),
      innerHTML: p.innerHTML.slice(0, 2500),
    })),
    dots: dots.map((d, i) => ({ i, dataDot: d.dataset.dot, ariaLabel: d.getAttribute("aria-label"), text: d.textContent.trim() })),
  };
});
writeFileSync(`${OUT}/testimonials.json`, JSON.stringify(testi, null, 1));
say(`testimonials: ${testi.count} panels, ${testi.dotCount} dots`);
testi.panels.forEach((p) => say(`  [${p.i}] ${p.text.slice(0, 100)}`));

// --------------------------------------------------- 3. NAV SCROLLED STATES
const navBefore = await page.evaluate(COLLECT, [[{ name: "nav", selector: "nav.nav", all: false }], PROPS]);
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(600);
const navAfter = await page.evaluate(() => ({
  classes: document.querySelector("nav.nav").className,
  scrollY: window.scrollY,
}));
const navScrolled = await page.evaluate(COLLECT, [[{ name: "nav", selector: "nav.nav", all: false }], PROPS]);
writeFileSync(`${OUT}/nav-scrolled.json`, JSON.stringify({ before: navBefore.nav, after: navAfter, scrolled: navScrolled.nav }, null, 1));
say(`nav scroll: before="${navBefore.nav.cls}" after="${navAfter.classes}" @y=${navAfter.scrollY}`);
await page.screenshot({ path: join(SHOTS, "state-nav-scrolled-1440.png"), clip: { x: 0, y: 0, width: 1440, height: 200 }, fullPage: true });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

// ------------------------------------------------------ 4. HOVER STATE DIFFS
const HOVER_TARGETS = [
  ["btnAccent", "nav.nav .btn--accent"],
  ["btnOutline", ".hero__actions .btn--outline"],
  ["btnGhost", ".hero__content .btn--ghost"],
  ["navLink", ".nav__links .nav__link"],
  ["svcTile", ".svc-tile"],
  ["svcTileImg", ".svc-tile img"],
  ["locCard", ".location-card"],
  ["blogCard", ".blog-card"],
  ["footerLink", ".footer__col a"],
  ["socialLink", ".footer__social-link"],
  ["pressItem", ".press-row > *"],
  ["testiDot", ".testimonial-dot"],
];
const hover = {};
for (const [name, sel] of HOVER_TARGETS) {
  const el = page.locator(sel).first();
  const read = () =>
    el.evaluate((n) => {
      const cs = getComputedStyle(n);
      return { color: cs.color, backgroundColor: cs.backgroundColor, borderColor: cs.borderColor, transform: cs.transform, boxShadow: cs.boxShadow, opacity: cs.opacity, textDecoration: cs.textDecoration, filter: cs.filter, transition: cs.transition };
    });
  try {
    if ((await el.count()) === 0) { hover[name] = { error: "not found", selector: sel }; continue; }
    if (!(await el.isVisible())) { hover[name] = { error: "not visible at 1440", selector: sel }; continue; }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const before = await read();
    await el.hover({ timeout: 5000 });
    await page.waitForTimeout(500);
    const after = await read();
    const diff = {};
    for (const k of Object.keys(before)) if (before[k] !== after[k]) diff[k] = { from: before[k], to: after[k] };
    hover[name] = { selector: sel, transition: before.transition, diff };
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
  } catch (e) {
    hover[name] = { error: e.message.split("\n")[0], selector: sel };
  }
}
writeFileSync(`${OUT}/hover-states.json`, JSON.stringify(hover, null, 1));
say(`hover states: ${Object.entries(hover).filter(([, v]) => v.diff && Object.keys(v.diff).length).length}/${HOVER_TARGETS.length} have changes`);

// ------------------------------------------------------ 5. FULL TEXT CONTENT
const text = await page.evaluate(() => {
  const grab = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return el.textContent.replace(/\s+/g, " ").trim();
  };
  const linksOf = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return [];
    return [...el.querySelectorAll("a")].map((a) => ({ text: a.textContent.replace(/\s+/g, " ").trim(), href: a.getAttribute("href") }));
  };
  return {
    hero: grab("section.hero"),
    intro: grab("main > section:nth-of-type(2)"),
    services: grab("main > section:nth-of-type(3)"),
    testimonials: grab("main > section:nth-of-type(4)"),
    locations: grab("main > section:nth-of-type(5)"),
    press: grab("main > section:nth-of-type(6)"),
    journal: grab("main > section:nth-of-type(7)"),
    bookingCta: grab("section.booking-cta"),
    footer: grab("footer.footer"),
    navLinks: linksOf("nav.nav"),
    footerLinks: linksOf("footer.footer"),
    servicesCards: [...document.querySelectorAll(".svc-tile")].map((t) => t.textContent.replace(/\s+/g, " ").trim()),
    locationCards: [...document.querySelectorAll(".location-card")].map((t) => t.textContent.replace(/\s+/g, " ").trim()),
    blogCards: [...document.querySelectorAll(".blog-card, .post-card")].map((t) => t.textContent.replace(/\s+/g, " ").trim()),
    pressItems: [...document.querySelectorAll(".press-row > *, .press-grid > *")].map((t) => t.textContent.replace(/\s+/g, " ").trim()),
  };
});
writeFileSync(`${OUT}/text-content.json`, JSON.stringify(text, null, 1));
say("text-content.json written");

// --------------------------------------------- 6. SVG ICON INVENTORY (full)
const svgs = await page.evaluate(() =>
  [...document.querySelectorAll("svg")].map((s, i) => ({
    i,
    parent: s.parentElement ? s.parentElement.tagName.toLowerCase() + "." + s.parentElement.className.toString().split(" ").filter(Boolean).slice(0, 2).join(".") : null,
    parentText: s.parentElement ? (s.parentElement.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40) : null,
    viewBox: s.getAttribute("viewBox"),
    w: Math.round(s.getBoundingClientRect().width),
    h: Math.round(s.getBoundingClientRect().height),
    outerHTML: s.outerHTML,
  }))
);
writeFileSync(`${OUT}/svgs.json`, JSON.stringify(svgs, null, 1));
say(`svgs.json: ${svgs.length} icons`);

writeFileSync(`${OUT}/extract-log.txt`, log.join("\n"));
await browser.close();
say("done");
