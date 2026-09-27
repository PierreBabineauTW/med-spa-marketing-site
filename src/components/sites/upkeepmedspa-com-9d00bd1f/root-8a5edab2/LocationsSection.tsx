/**
 * Locations section — https://upkeepmedspa.com/ (home page).
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Static server component: the entrance reveal is the target's own native CSS
 * (`.fade-in` + `animation-timeline: view()`) and the photo zoom is a
 * `transition: transform` on `.location-card__bg img` (upkeep.css:1004-1012),
 * so neither needs client JS.
 *
 * Class names are the target's own, verbatim — `.text-center`, `.mb-4`, `.mb-8`
 * and `.grid-4` are ported utilities in upkeep.css, not Tailwind. `.btn--arrow`
 * draws its arrow from an `::after` in the sheet, so no glyph is rendered here.
 *
 * Three layout values are inline because they are inline on the target:
 *   - the section's `var(--color-surface)` band (#111) between the #0a0a0a page
 *     background and the sections either side of it;
 *   - the grid's `auto-fill` track, which is what yields 4 / 2 / 2 columns at
 *     1440 / 768 / 390 and the ragged 4+3 second row — not a fixed count;
 *   - `text-decoration: none` per card, the sheet styles bare `a` as links.
 */

import Image from "next/image";

import { locations } from "@/lib/upkeepmedspa-data";

export function LocationsSection() {
  return (
    <section
      className="section"
      aria-label="Our locations"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container">
        <div className="text-center mb-8 fade-in">
          <p className="eyebrow">{locations.eyebrow}</p>
          <h2 className="heading-section mb-4">{locations.heading}</h2>
        </div>

        <div
          className="grid-4 fade-in"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {locations.cards.map((card) => (
            <a
              key={card.href}
              className="location-card"
              href={card.href}
              style={{ textDecoration: "none" }}
            >
              <div className="location-card__bg">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 45vw, 21vw"
                />
              </div>
              <div className="location-card__overlay" />
              <div className="location-card__content">
                <h3 className="location-card__name">{card.name}</h3>
                <p className="location-card__address">{card.address}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center fade-in" style={{ marginTop: "var(--space-8)" }}>
          <a className="btn btn--arrow" href={locations.cta.href}>
            {locations.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
