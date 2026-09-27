"use client";

/**
 * Fixed site header — logo, primary nav with two hover dropdowns, the events
 * and booking CTAs, and the mobile hamburger.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Every pixel of layout, type and colour comes from the ported stylesheet
 * (`upkeep.css`, imported unlayered) via the class names below — this file adds
 * no CSS and no responsive utilities; the sheet's own media queries decide that
 * `.nav__book--desktop` and `.nav__hamburger` are mutually exclusive.
 *
 * The two dropdowns are intentionally pure CSS: the sheet reveals them with
 * `.nav__dropdown:hover .nav__dropdown-menu` and rotates the chevron with
 * `.nav__dropdown:hover .nav__dropdown-trigger svg`, so adding any JavaScript
 * here would break parity with the source. The only behaviour here is the
 * scroll-shrink class and the hamburger's `open` toggle for `MobileMenu`.
 */

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  ChevronDownIcon,
  HamburgerIcon,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons";
import { nav } from "@/lib/upkeepmedspa-data";
import { cn } from "@/lib/utils";

import { MobileMenu } from "./MobileMenu";

/** The source adds `nav--scrolled` above this offset — strictly greater than, and back off above 60. */
const SCROLL_THRESHOLD = 60;

/** The logo always returns to the site home — same href as the nav's Home item. */
const HOME_HREF = "/";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Passive scroll listener mirroring the source: shrink the bar once the page
  // has moved past the threshold, restore it at the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn("nav", scrolled && "nav--scrolled")}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="nav__inner">
          <a className="nav__logo" aria-label="UPKEEP Med Spa home" href={HOME_HREF}>
            <Image
              src={nav.logo.src}
              alt={nav.logo.alt}
              width={nav.logo.width}
              height={nav.logo.height}
              className="nav__logo-img"
              loading="eager"
              fetchPriority="high"
            />
          </a>

          <ul className="nav__links" role="list">
            {nav.items.map((item) =>
              item.children ? (
                <li className="nav__dropdown" key={item.href}>
                  <a className="nav__link nav__dropdown-trigger" href={item.href}>
                    {item.label}
                    <ChevronDownIcon width={10} height={10} />
                  </a>
                  <div className="nav__dropdown-menu" role="menu">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        className="nav__dropdown-item"
                        href={child.href}
                        role="menuitem"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <a
                    className={cn("nav__link", item.active && "nav__link--active")}
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <div className="nav__cta-group">
            <a
              className="nav__events"
              aria-label="Upcoming Events"
              href={nav.events.href}
            >
              {nav.events.label}
            </a>
            {/* Bookings open the BLVD booking widget off-site. */}
            <a
              className="nav__book nav__book--desktop"
              href={nav.book.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nav.book.label}
            </a>
          </div>

          <button
            type="button"
            className="nav__hamburger"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <HamburgerIcon width={24} height={24} />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
