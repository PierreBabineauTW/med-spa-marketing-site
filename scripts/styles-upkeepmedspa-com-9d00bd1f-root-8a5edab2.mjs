// Corrected computed-style extraction with the real class vocabulary, at 1440 and 390.
// site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2

import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const SITE = "upkeepmedspa-com-9d00bd1f";
const PAGE = "root-8a5edab2";
const URL = "https://upkeepmedspa.com/";
const OUT = `docs/research/${SITE}/${PAGE}/extracted`;
mkdirSync(OUT, { recursive: true });

const PROPS = [
  "fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","color","fontStyle",
  "textTransform","textDecoration","textAlign","backgroundColor","backgroundImage",
  "padding","paddingTop","paddingRight","paddingBottom","paddingLeft",
  "margin","marginTop","marginRight","marginBottom","marginLeft",
  "width","height","maxWidth","minWidth","maxHeight","minHeight","aspectRatio",
  "display","flexDirection","flexWrap","justifyContent","alignItems","alignSelf","gap","rowGap","columnGap","flexGrow","flexShrink","flexBasis",
  "gridTemplateColumns","gridTemplateRows","gridAutoFlow","placeItems",
  "borderRadius","borderTop","borderRight","borderBottom","borderLeft","outline","outlineOffset",
  "boxShadow","overflow","overflowX","overflowY","objectFit","objectPosition",
  "position","top","right","bottom","left","zIndex",
  "opacity","transform","transformOrigin","transition","transitionDuration","transitionTimingFunction","animation","animationName","animationDuration","animationTimingFunction","animationDelay","animationFillMode","animationIterationCount",
  "cursor","pointerEvents","visibility","mixBlendMode","filter","backdropFilter","clipPath",
  "whiteSpace","textOverflow","WebkitLineClamp","textShadow","verticalAlign","float","fill","stroke",
];

const COLLECT = ([pairs, PROPS]) => {
  const skip = new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","0s","static","visible","0","1","row","1fr","nowrap","baseline","start","stretch","content-box","border-box","disc","none 0% 0% 0%","0deg","0% 0%","0px 0px 0px 0px","0px 0px 0px","0 0 auto","0px 0px 0px 0px","0px 0px"]);
  const out = {};
  for (const { name, selector, max } of pairs) {
    const nodes = [...document.querySelectorAll(selector)];
    if (!nodes.length) { out[name] = { error: "not found", selector }; continue; }
    const take = (el, idx) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const s = {};
      for (const p of PROPS) { const v = cs[p]; if (v && !skip.has(v)) s[p] = v; }
      const kids = [...el.children].filter((c) => c.tagName !== "SCRIPT" && c.tagName !== "STYLE");
      return {
        idx,
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString ? el.className.toString() : "").trim().slice(0, 120),
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 110),
        rect: { w: Math.round(r.width), h: Math.round(r.height) },
        childCount: kids.length,
        childClasses: kids.slice(0, 8).map((c) => c.tagName.toLowerCase() + "." + (c.className.toString ? c.className.toString() : "").split(/\s+/).filter(Boolean).slice(0, 3).join(".")),
        style: s,
      };
    };
    out[name] = { selector, count: nodes.length, nodes: nodes.slice(0, max || 2).map((el, i) => take(el, i)) };
  }
  return out;
};

const PAIRS = [
  // ---- global
  ["body", "body"], ["html", "html"],
  ["btnBase", ".btn"], ["btnArrow", ".btn--arrow"], ["btnPink", ".btn--pink"],
  ["btnFilled", ".btn--filled"], ["btnSmall", ".btn--small"], ["btnAccent", ".btn--accent"],
  ["eyebrow", ".eyebrow"], ["headingHero", ".heading-hero"], ["headingSection", ".heading-section"],
  ["bodyText", ".body-text"], ["textCenter", ".text-center"], ["container", ".container"],
  // ---- nav
  ["nav", "nav.nav"], ["navInner", ".nav__inner"], ["navLogo", ".nav__logo"], ["navLogoImg", ".nav__logo-img"],
  ["navLinks", ".nav__links"], ["navLink", ".nav__links > li"], ["navLinkA", ".nav__link"],
  ["navLinkActive", ".nav__link--active"], ["navDropdownTrigger", ".nav__dropdown-trigger"],
  ["navDropdownMenu", ".nav__dropdown-menu"], ["navDropdownItem", ".nav__dropdown-item"],
  ["navCtaGroup", ".nav__cta-group"], ["navEvents", ".nav__events"], ["navBook", ".nav__book"],
  ["navBookDesktop", ".nav__book--desktop"], ["navHamburger", ".nav__hamburger"],
  ["mobileMenu", ".mobile-menu"], ["mobileMenuClose", ".mobile-menu__close"], ["mobileMenuLink", ".mobile-menu__link"],
  // ---- hero
  ["hero", "section.hero"], ["heroBg", ".hero__bg"], ["heroBgImg", ".hero__bg img"], ["heroOverlay", ".hero__overlay"],
  ["heroContent", ".hero__content"], ["heroEyebrow", ".hero__content .eyebrow"], ["heroH1", ".hero__content h1"],
  ["heroCtas", ".hero__ctas"], ["heroCtasSpecials", ".hero__ctas--specials"],
  ["heroScrollHint", ".hero__scroll-hint"],
  // ---- intro
  ["introSection", "main > section:nth-of-type(2)"], ["introContainer", "main > section:nth-of-type(2) .container"],
  ["split", ".split"], ["splitMedia", ".split > *:first-child"], ["splitBody", ".split > *:last-child"],
  ["introH2", "main > section:nth-of-type(2) h2"], ["introEyebrow", "main > section:nth-of-type(2) .eyebrow"],
  ["introText", "main > section:nth-of-type(2) .body-text"], ["introBtn", "main > section:nth-of-type(2) .btn"],
  ["introImg", "main > section:nth-of-type(2) img"],
  // ---- services
  ["servicesSection", "main > section:nth-of-type(3)"], ["servicesContainer", "main > section:nth-of-type(3) .container"],
  ["servicesRow", ".services-row"], ["svcTile", ".svc-tile"], ["svcTileImg", ".svc-tile__img"],
  ["svcTileImgEl", ".svc-tile__img img"], ["svcTileTitle", ".svc-tile__title"], ["svcTileDesc", ".svc-tile__desc"],
  ["pricingDisclosure", ".pricing-disclosure"], ["servicesBtn", "main > section:nth-of-type(3) .btn"],
  // ---- testimonials
  ["testiSection", "main > section:nth-of-type(4)"], ["testiContainer", "main > section:nth-of-type(4) .container"],
  ["testiPanel", "[data-testimonial]"], ["testiStars", ".testimonial__stars"],
  ["testiQuote", ".testimonial__quote"], ["testiName", ".testimonial__name"],
  ["testiDots", ".testimonial-dots"], ["testiDot", ".testimonial-dot"],
  // ---- locations
  ["locSection", "main > section:nth-of-type(5)"], ["locGrid", ".grid-4"],
  ["locCard", ".location-card"], ["locCardBg", ".location-card__bg"], ["locCardBgImg", ".location-card__bg img"],
  ["locCardOverlay", ".location-card__overlay"], ["locCardContent", ".location-card__content"],
  ["locCardName", ".location-card__name"], ["locCardAddr", ".location-card__address"],
  // ---- press
  ["pressSection", "main > section:nth-of-type(6)"], ["pressBar", ".press-bar"], ["pressItem", ".press-bar__item"],
  // ---- journal
  ["journalSection", "main > section:nth-of-type(7)"], ["journalHeaderRow", "main > section:nth-of-type(7) .flex"],
  ["journalGrid", ".grid-3"], ["blogCard", ".blog-card"], ["blogCardImage", ".blog-card__image"],
  ["blogCardImageEl", ".blog-card__image img"], ["blogCardContent", ".blog-card__content"],
  ["blogCardCategory", ".blog-card__category"], ["blogCardTitle", ".blog-card__title"], ["blogCardExcerpt", ".blog-card__excerpt"],
  // ---- booking cta
  ["ctaSection", "section.booking-cta"], ["ctaBg", ".booking-cta__bg"], ["ctaBgImg", ".booking-cta__bg img"],
  ["ctaContent", ".booking-cta__content"], ["ctaH2", "section.booking-cta h2"], ["ctaText", "section.booking-cta .body-text"],
  // ---- footer
  ["footer", "footer.footer"], ["footerContainer", "footer .container"], ["footerGrid", ".footer__grid"],
  ["footerBrandLogo", ".footer__brand-logo"], ["footerLogoImg", ".footer__logo-img"], ["footerTagline", ".footer__tagline"],
  ["footerSocials", ".footer__socials"], ["footerSocialLink", ".footer__social-link"],
  ["footerHeading", ".footer__heading"], ["footerLink", ".footer__link"],
  ["footerBottom", ".footer__bottom"], ["footerLegalLinks", ".footer__legal-links"], ["a11yNotice", ".footer__a11y-notice"],
  // ---- overlays
  ["signupPopup", "#signupPopup"], ["signupCard", ".signup-popup__card"], ["signupClose", ".signup-popup__close"],
  ["flashOverlay", ".upk-flash-overlay"], ["flashCard", ".upk-flash-card"], ["flashMedia", ".upk-flash-media"],
  ["flashBody", ".upk-flash-body"], ["flashClose", ".upk-flash-close"],
  ["consentBanner", "#upkeep-consent-banner"], ["consentInner", ".upkeep-consent__inner"],
  ["consentText", ".upkeep-consent__text"], ["consentActions", ".upkeep-consent__actions"],
  ["a11yRoot", "#a11y-menu-root"], ["a11yButton", "#a11y-menu-button"], ["a11yPanel", "#a11y-menu-panel"],
];

const HIDDEN = `#upkeep-consent-banner, #a11y-menu-root, .signup-popup, .upk-flash-overlay, .upk-rsvp-overlay { display: none !important; }`;

async function warmLazy(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(70); }
  await page.waitForTimeout(900);
  await page.evaluate(async () => {
    await Promise.all([...document.querySelectorAll("img")].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    if (document.fonts) await document.fonts.ready;
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
for (const [label, width, height] of [["1440", 1440, 900], ["768", 768, 1024], ["390", 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);
  await warmLazy(page);
  await page.addStyleTag({ content: HIDDEN });
  await page.waitForTimeout(400);
  const data = await page.evaluate(COLLECT, [PAIRS.map(([name, selector]) => ({ name, selector })), PROPS]);
  writeFileSync(`${OUT}/styles-${label}.json`, JSON.stringify(data, null, 1));
  const miss = Object.entries(data).filter(([, v]) => v.error).map(([k]) => k);
  console.log(`styles-${label}.json: ${Object.keys(data).length} probes, ${miss.length} missed${miss.length ? ": " + miss.join(", ") : ""}`);
  // responsive visibility of nav variants
  const resp = await page.evaluate(() => {
    const g = (s) => { const e = document.querySelector(s); if (!e) return "missing"; const cs = getComputedStyle(e); return `${cs.display} ${cs.visibility}`; };
    return {
      navLinks: g(".nav__links"), navCtaGroup: g(".nav__cta-group"),
      navBookDesktop: g(".nav__book--desktop"), navEvents: g(".nav__events"),
      hamburger: g(".nav__hamburger"), split: getComputedStyle(document.querySelector(".split")).flexDirection,
      servicesRow: getComputedStyle(document.querySelector(".services-row")).gridTemplateColumns,
      grid4: getComputedStyle(document.querySelector(".grid-4")).gridTemplateColumns,
      grid3: getComputedStyle(document.querySelector(".grid-3")).gridTemplateColumns,
      footerGrid: getComputedStyle(document.querySelector(".footer__grid")).gridTemplateColumns,
      container: getComputedStyle(document.querySelector(".container")).maxWidth,
      heroH1: getComputedStyle(document.querySelector(".hero__content h1")).fontSize,
    };
  });
  writeFileSync(`${OUT}/responsive-${label}.json`, JSON.stringify(resp, null, 1));
  console.log(`  responsive-${label}:`, JSON.stringify(resp));
  await ctx.close();
}
await browser.close();
console.log("done");
