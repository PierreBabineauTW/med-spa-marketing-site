/**
 * Homepage hero — https://upkeepmedspa.com/
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * DOM is captured verbatim from the live page; every class name below is styled
 * by the ported stylesheet (upkeep.css, imported unlayered) and no new CSS is
 * introduced here. Type scale, palette, easings and the reveal / hover
 * behaviours all come from that sheet, so this component is pure markup.
 */

import Image from "next/image";

import { ScrollArrowIcon } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons";
import { hero } from "@/lib/upkeepmedspa-data";
import { cn } from "@/lib/utils";

/** Bookings open the BLVD widget in a new tab; the rest are same-page/site anchors. */
const isExternal = (href: string) => /^https?:\/\//.test(href);

export function HeroSection() {
  return (
    <section className="hero" aria-label="Welcome to UPKEEP Med Spa">
      <div className="hero__bg">
        <Image
          src={hero.background.src}
          alt={hero.background.alt}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="hero__overlay" />

      <div className="hero__content fade-in">
        <p className={cn("eyebrow", "text-center")}>{hero.eyebrow}</p>

        <h1 className={cn("heading-hero", "text-center")}>
          {hero.titleLines[0]}
          <br />
          {hero.titleLines[1]}
        </h1>

        <div className="hero__ctas">
          {hero.ctas.map((cta) =>
            isExternal(cta.href) ? (
              <a
                key={cta.href}
                className="btn"
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cta.label}
              </a>
            ) : (
              <a key={cta.href} className="btn" href={cta.href}>
                {cta.label}
              </a>
            ),
          )}
        </div>

        <div className="hero__ctas hero__ctas--specials">
          <a className="btn btn--pink" href={hero.specials.href}>
            {hero.specials.label}
          </a>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span>{hero.scrollHint}</span>
        <ScrollArrowIcon width={16} height={24} />
      </div>
    </section>
  );
}
