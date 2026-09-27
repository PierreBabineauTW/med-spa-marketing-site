// Behavioural regression test for the UPKEEP clone. Asserts every interaction
// model captured off the live site: nav scroll state, hover dropdowns, the mobile
// menu, the testimonial carousel (click + 6s auto-advance), the 12s newsletter
// auto-open with focus/scroll-lock/restore, and both persistent widgets.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";
let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? "  -> " + detail : ""}`); }
}

const browser = await chromium.launch();

// ---------------------------------------------------------------- desktop ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  console.log("\n== nav scroll state ==");
  const navAtTop = await page.evaluate(() => document.querySelector("nav.nav").className);
  check("nav has no --scrolled at scrollY 0", !navAtTop.includes("nav--scrolled"), navAtTop);
  const padTop = await page.evaluate(() => getComputedStyle(document.querySelector("nav.nav")).paddingTop);
  check("nav padding-block is 16px at top (--space-4)", padTop === "16px", padTop);

  await page.evaluate(() => window.scrollTo(0, 40));
  await page.waitForTimeout(250);
  let cls = await page.evaluate(() => document.querySelector("nav.nav").className);
  check("no --scrolled at scrollY 40 (threshold is >60)", !cls.includes("nav--scrolled"), cls);

  await page.evaluate(() => window.scrollTo(0, 61));
  await page.waitForTimeout(250);
  cls = await page.evaluate(() => document.querySelector("nav.nav").className);
  const padScrolled = parseFloat(await page.evaluate(() => getComputedStyle(document.querySelector("nav.nav")).paddingTop));
  check("--scrolled applied at scrollY 61", cls.includes("nav--scrolled"), cls);
  check("nav shrinks to ~12px padding when scrolled (--space-3)", Math.abs(padScrolled - 12) < 0.5, String(padScrolled));

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  cls = await page.evaluate(() => document.querySelector("nav.nav").className);
  check("--scrolled removed back at top", !cls.includes("nav--scrolled"), cls);

  console.log("\n== nav dropdown (hover, CSS-only) ==");
  await page.evaluate(() => window.scrollTo(0, 0));
  const svcMenu = page.locator(".nav__dropdown").first().locator(".nav__dropdown-menu");
  const before = await svcMenu.evaluate((e) => getComputedStyle(e).visibility);
  check("dropdown hidden without hover", before === "hidden", before);
  await page.locator(".nav__dropdown").first().hover();
  await page.waitForTimeout(350);
  const after = await svcMenu.evaluate((e) => getComputedStyle(e).visibility);
  const chev = await page.locator(".nav__dropdown").first().locator("svg").evaluate((e) => getComputedStyle(e).transform);
  check("dropdown visible on hover", after === "visible", after);
  check("chevron rotates 180deg on hover", /matrix\(-1, 0, 0, -1/.test(chev) || chev.includes("-1"), chev);
  const items = await page.locator(".nav__dropdown").first().locator(".nav__dropdown-item").count();
  check("Services dropdown has 8 items", items === 8, String(items));
  await page.mouse.move(0, 500);
  await page.waitForTimeout(300);

  console.log("\n== testimonial carousel ==");
  const panels = page.locator("[data-testimonial]");
  const dots = page.locator(".testimonial-dot");
  check("6 testimonial panels", (await panels.count()) === 6, String(await panels.count()));
  check("6 dots", (await dots.count()) === 6, String(await dots.count()));
  const visibleIdx = async () =>
    page.evaluate(() => {
      const p = [...document.querySelectorAll("[data-testimonial]")].findIndex((e) => getComputedStyle(e).display !== "none");
      const d = [...document.querySelectorAll(".testimonial-dot")].findIndex((e) => e.style.background && !/transparent/.test(e.style.background));
      return { panel: p, dot: d };
    });
  const v0 = await visibleIdx();
  check("exactly one panel visible initially", v0.panel >= 0, JSON.stringify(v0));
  check("active dot matches visible panel", v0.panel === v0.dot, JSON.stringify(v0));

  await dots.nth(4).click();
  await page.waitForTimeout(250);
  const v4 = await visibleIdx();
  check("clicking dot 5 shows panel 4", v4.panel === 4 && v4.dot === 4, JSON.stringify(v4));

  console.log("\n== signup popup: 12s auto-open ==");
  const t0 = Date.now();
  await page.waitForSelector("#signupPopup.is-open", { timeout: 20000 });
  const elapsed = Date.now() - t0;
  check(`popup auto-opened (waited ${elapsed}ms after the earlier interactions)`, true);
  // the source focuses the email input 250ms AFTER the is-open class lands, so
  // give that timer room to fire before asserting focus
  await page.waitForTimeout(500);
  const popupState = await page.evaluate(() => ({
    ariaHidden: document.getElementById("signupPopup").getAttribute("aria-hidden"),
    bodyOverflow: document.body.style.overflow,
    focused: document.activeElement?.id,
  }));
  check("aria-hidden=false when open", popupState.ariaHidden === "false", popupState.ariaHidden);
  check("body scroll locked", popupState.bodyOverflow === "hidden", popupState.bodyOverflow);
  check("email input focused after 250ms", popupState.focused === "signupEmail", popupState.focused);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const closed = await page.evaluate(() => ({
    isOpen: document.getElementById("signupPopup").classList.contains("is-open"),
    ariaHidden: document.getElementById("signupPopup").getAttribute("aria-hidden"),
    bodyOverflow: document.body.style.overflow,
    stored: localStorage.getItem("upkeep_signup_v1"),
  }));
  check("Escape closes the popup", !closed.isOpen, JSON.stringify(closed));
  check("aria-hidden=true when closed", closed.ariaHidden === "true", closed.ariaHidden);
  check("body scroll restored", closed.bodyOverflow === "", JSON.stringify(closed.bodyOverflow));
  check("dismissal persisted to upkeep_signup_v1", /^dismissed:\d+$/.test(closed.stored || ""), String(closed.stored));

  // form -> success swap, no network. Nothing on the home page carries
  // data-open-signup (same as the source), so inject one to exercise the
  // delegated trigger the component is supposed to wire up.
  let requested = false;
  page.on("request", (r) => { if (r.url().includes("list-manage")) requested = true; });
  await page.evaluate(() => {
    const b = document.createElement("button");
    b.id = "qa-signup-trigger";
    b.type = "button";
    b.setAttribute("data-open-signup", "");
    b.textContent = "open";
    b.style.cssText = "position:fixed;top:8px;left:8px;z-index:2147483647";
    document.body.appendChild(b);
  });
  await page.click("#qa-signup-trigger");
  await page.waitForTimeout(300);
  const reopened = await page.evaluate(() => document.getElementById("signupPopup").classList.contains("is-open"));
  check("[data-open-signup] trigger reopens the popup", reopened, String(reopened));
  if (reopened) {
    await page.fill("#signupEmail", "qa@example.com");
    await page.click(".signup-popup__submit");
    await page.waitForTimeout(300);
    const swap = await page.evaluate(() => ({
      form: document.querySelector('[data-signup-state="form"]').hasAttribute("hidden"),
      success: !document.querySelector('[data-signup-state="success"]').hasAttribute("hidden"),
    }));
    check("submit swaps form -> success state", swap.form && swap.success, JSON.stringify(swap));
    check("submit makes no Mailchimp request", !requested);
  }

  console.log("\n== consent banner ==");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const bannerVisible = await page.evaluate(() => !!document.getElementById("upkeep-consent-banner"));
  check("consent banner visible on a fresh visit", bannerVisible, String(bannerVisible));
  await page.locator('[data-consent="accept"]').click();
  await page.waitForTimeout(300);
  const afterAccept = await page.evaluate(() => ({
    gone: !document.getElementById("upkeep-consent-banner"),
    stored: localStorage.getItem("upkeep-consent-v1"),
  }));
  check("accepting hides the banner", afterAccept.gone, JSON.stringify(afterAccept));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  check("banner stays dismissed after reload", await page.evaluate(() => !document.getElementById("upkeep-consent-banner")));

  console.log("\n== accessibility widget ==");
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  check("a11y button present on load", await page.evaluate(() => !!document.getElementById("a11y-menu-button")));
  // Parity note: on the live target the fixed consent bar (z 9999, 78px tall,
  // bottom 0) sits on top of the a11y button (z 9998, bottom 20px), so the button
  // is not clickable while the banner is up. Verified identical on upkeepmedspa.com
  // via scripts/tmp-check-overlap.mjs — do not "fix" this, it is target behaviour.
  const overlap = await page.evaluate(() => {
    const c = document.getElementById("upkeep-consent-banner");
    const a = document.getElementById("a11y-menu-root");
    if (!c || !a) return null;
    const rc = c.getBoundingClientRect(), ra = a.getBoundingClientRect();
    return !(rc.top + rc.height <= ra.top || ra.top + ra.height <= rc.top);
  });
  check("consent bar overlaps a11y button exactly as the target does", overlap === true, String(overlap));
  await page.locator('[data-consent="accept"]').click();
  await page.waitForTimeout(300);
  const btnBox = await page.locator("#a11y-menu-button").boundingBox();
  check("a11y button is 52x52", Math.round(btnBox.width) === 52 && Math.round(btnBox.height) === 52, JSON.stringify(btnBox));
  const panelHiddenBefore = await page.evaluate(() => document.getElementById("a11y-menu-panel").hasAttribute("hidden"));
  check("panel hidden initially", panelHiddenBefore);
  await page.click("#a11y-menu-button");
  await page.waitForTimeout(250);
  const opened = await page.evaluate(() => ({
    hidden: document.getElementById("a11y-menu-panel").hasAttribute("hidden"),
    expanded: document.getElementById("a11y-menu-button").getAttribute("aria-expanded"),
  }));
  check("button opens the panel", !opened.hidden, JSON.stringify(opened));
  check("aria-expanded=true when open", opened.expanded === "true", opened.expanded);

  // The checkbox itself is visually hidden and the visible target is the label
  // row (native <label> wrapping), so click the label like a user would.
  await page.locator(".a11y-menu__toggle").first().click();
  await page.waitForTimeout(200);
  check("clicking the Larger text row checks the box", await page.evaluate(() => document.getElementById("a11y-toggle-text").checked));
  const larger = await page.evaluate(() => ({
    htmlClass: document.documentElement.classList.contains("a11y-large-text"),
    stored: localStorage.getItem("upkeep-a11y-large-text"),
  }));
  check("Larger text adds html.a11y-large-text", larger.htmlClass, JSON.stringify(larger));
  check("Larger text persists to upkeep-a11y-large-text=1", larger.stored === "1", String(larger.stored));

  await page.locator(".a11y-menu__toggle").nth(1).click();
  await page.waitForTimeout(200);
  check("clicking the Reduce motion row checks the box", await page.evaluate(() => document.getElementById("a11y-toggle-motion").checked));
  check("Reduce motion adds html.a11y-reduce-motion", await page.evaluate(() => document.documentElement.classList.contains("a11y-reduce-motion")));
  check("Reduce motion persists to upkeep-a11y-reduce-motion=1", (await page.evaluate(() => localStorage.getItem("upkeep-a11y-reduce-motion"))) === "1");

  await page.click("#a11y-reset");
  await page.waitForTimeout(250);
  const reset = await page.evaluate(() => ({
    html: document.documentElement.className,
    keys: [localStorage.getItem("upkeep-a11y-large-text"), localStorage.getItem("upkeep-a11y-reduce-motion")],
  }));
  check("reset clears both html classes", !reset.html.includes("a11y-"), reset.html);
  check("reset clears both localStorage keys", reset.keys[0] === null && reset.keys[1] === null, JSON.stringify(reset.keys));

  console.log("\n== reduced motion actually neutralises reveals ==");
  await page.evaluate(() => { localStorage.setItem("upkeep-a11y-reduce-motion", "1"); });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const reveal = await page.evaluate(() => {
    const el = document.querySelectorAll("main .fade-in")[3];
    return { opacity: getComputedStyle(el).opacity, name: getComputedStyle(el).animationName };
  });
  check("a11y-reduce-motion forces .fade-in visible", reveal.opacity === "1", JSON.stringify(reveal));

  console.log(`\ndesktop console errors: ${errors.length}`);
  for (const e of errors.slice(0, 5)) console.log("   ", e.slice(0, 160));
  check("no console/page errors on desktop", errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// ----------------------------------------------------------------- mobile ----
{
  console.log("\n== mobile menu (390px) ==");
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const vis = await page.evaluate(() => ({
    links: getComputedStyle(document.querySelector(".nav__links")).display,
    hamburger: getComputedStyle(document.querySelector(".nav__hamburger")).display,
    book: getComputedStyle(document.querySelector(".nav__book--desktop")).display,
  }));
  check(".nav__links hidden at 390", vis.links === "none", vis.links);
  check(".nav__hamburger visible at 390", vis.hamburger === "flex", vis.hamburger);
  check(".nav__book--desktop hidden at 390", vis.book === "none", vis.book);

  const menuBefore = await page.evaluate(() => document.querySelector(".mobile-menu").className);
  check("mobile menu closed initially", !menuBefore.includes("mobile-menu--open"), menuBefore);
  await page.click(".nav__hamburger");
  await page.waitForTimeout(500);
  const menuAfter = await page.evaluate(() => {
    const m = document.querySelector(".mobile-menu");
    return { cls: m.className, opacity: getComputedStyle(m).opacity, links: m.querySelectorAll(".mobile-menu__link").length };
  });
  check("hamburger opens the mobile menu", menuAfter.cls.includes("mobile-menu--open"), menuAfter.cls);
  check("open menu is fully opaque", menuAfter.opacity === "1", menuAfter.opacity);
  check("mobile menu has 15 links", menuAfter.links === 15, String(menuAfter.links));
  await page.click(".mobile-menu__close");
  await page.waitForTimeout(500);
  check("close button shuts the menu", !(await page.evaluate(() => document.querySelector(".mobile-menu").className)).includes("mobile-menu--open"));

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("no horizontal overflow at 390px", overflow <= 0, String(overflow));
  await ctx.close();
}

await browser.close();
console.log(`\n================  ${pass} passed, ${fail} failed  ================`);
process.exitCode = fail ? 1 : 0;
