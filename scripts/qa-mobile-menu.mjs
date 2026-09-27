// Verifies the mobile menu is fully usable at every target viewport: every link
// and the Book Now button reachable, no overlap with the close button.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3100";
const SIZES = [[360, 640], [360, 800], [375, 812], [390, 844], [430, 932], [768, 1024]];

const browser = await chromium.launch();
for (const [w, h] of SIZES) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.click(".nav__hamburger");
  await page.waitForTimeout(400);

  const top = await page.evaluate(() => {
    const el = document.querySelector(".mobile-menu");
    const links = [...el.querySelectorAll(".mobile-menu__link")];
    const btn = el.querySelector(".btn");
    const lb = links[links.length - 1].getBoundingClientRect();
    const bb = btn.getBoundingClientRect();
    return {
      content: el.scrollHeight, box: el.clientHeight, overflowY: getComputedStyle(el).overflowY,
      fitsWithoutScroll: lb.bottom <= window.innerHeight && bb.bottom <= window.innerHeight,
    };
  });

  await page.evaluate(() => { document.querySelector(".mobile-menu").scrollTop = 99999; });
  await page.waitForTimeout(300);
  const end = await page.evaluate(() => {
    const el = document.querySelector(".mobile-menu");
    const links = [...el.querySelectorAll(".mobile-menu__link")];
    const btn = el.querySelector(".btn");
    const lb = links[links.length - 1].getBoundingClientRect();
    const bb = btn.getBoundingClientRect();
    return {
      lastLink: lb.top >= 0 && lb.bottom <= window.innerHeight,
      book: bb.top >= 0 && bb.bottom <= window.innerHeight,
    };
  });

  await page.evaluate(() => { document.querySelector(".mobile-menu").scrollTop = 0; });
  await page.waitForTimeout(250);
  const start = await page.evaluate(() => {
    const f = document.querySelector(".mobile-menu .mobile-menu__link").getBoundingClientRect();
    const c = document.querySelector(".mobile-menu__close").getBoundingClientRect();
    const overlap = !(f.right <= c.left || c.right <= f.left || f.bottom <= c.top || c.bottom <= f.top);
    return { firstLinkTop: Math.round(f.top), closeBottom: Math.round(c.bottom), overlap };
  });

  // is the close button actually clickable at the top?
  await page.click(".mobile-menu__close", { timeout: 4000 }).then(() => {}).catch(() => {});
  const closed = await page.evaluate(() => !document.querySelector(".mobile-menu").className.includes("mobile-menu--open"));

  const ok = end.lastLink && end.book && !start.overlap && closed;
  console.log(
    `  ${String(w).padStart(3)}x${h}: content=${String(top.content).padStart(4)} box=${String(top.box).padStart(4)} overflowY=${top.overflowY.padEnd(7)}` +
    ` fitsNoScroll=${String(top.fitsWithoutScroll).padEnd(5)} lastLinkReachable=${String(end.lastLink).padEnd(5)} bookReachable=${String(end.book).padEnd(5)}` +
    ` firstLinkTop=${String(start.firstLinkTop).padStart(3)} closeBottom=${String(start.closeBottom).padStart(2)} overlap=${String(start.overlap).padEnd(5)} closeWorks=${closed}  ${ok ? "OK" : "*** PROBLEM ***"}`
  );
  await ctx.close();
}
await browser.close();
console.log("done");
