/**
 * Home page "Our Services" tile grid — captured verbatim from
 * https://upkeepmedspa.com/ — site-key: upkeepmedspa-com-9d00bd1f
 * page-key: root-8a5edab2
 *
 * Every class name below is styled by the ported stylesheet (upkeep.css,
 * imported unlayered), so this file introduces no CSS. The grid's 4 / 2 / 2
 * column breakpoints, the 3:4 image crop, the 20.16px tile titles and the
 * fine-print disclosure box all come from that sheet.
 *
 * Both behaviours are CSS-only by design: `.fade-in` runs the sheet's native
 * scroll-driven `animation-timeline: view()` reveal, and `.svc-tile:hover`
 * scales the photo via a `transition` on the inner `img`. So this stays a
 * server component — no observer, no motion library, no opacity state.
 *
 * `id="services"` is load-bearing: the hero's first CTA anchors to `#services`.
 */

import Image from "next/image";
import type { ReactNode } from "react";

import { services } from "@/lib/upkeepmedspa-data";

/** Rose-gold the source uses for the inline price highlights (`#d4a090`). */
const PRICE_HIGHLIGHT_COLOR = "#d4a090";

/**
 * The source wraps prices in a rose-gold span *inside* `.svc-tile__desc`, but
 * the data model keeps `description` as clean text and lists the highlighted
 * substrings separately. This splits the string on those substrings and wraps
 * only the real matches, so the em dash and spacing survive untouched.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderDescription(description: string, highlights?: string[]): ReactNode {
  if (!highlights || highlights.length === 0) return description;

  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "g");
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of description.matchAll(pattern)) {
    const [value] = match;
    const start = match.index;

    if (start > cursor) nodes.push(description.slice(cursor, start));
    nodes.push(
      <span key={`price-${start}`} style={{ color: PRICE_HIGHLIGHT_COLOR }}>
        {value}
      </span>,
    );
    cursor = start + value.length;
  }

  if (cursor < description.length) nodes.push(description.slice(cursor));

  return nodes;
}

export function ServicesSection() {
  return (
    <section id="services" className="section--tight" aria-label="Service categories">
      <div className="container">
        <div className="text-center mb-8 fade-in">
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 className="heading-section mb-4">{services.heading}</h2>
        </div>

        <div className="services-row fade-in">
          {services.tiles.map((tile) => (
            <a key={tile.href} className="svc-tile" href={tile.href}>
              {/*
                The wrapper is the 3:4 aspect box, so the image fills it and the
                sheet's `object-fit: cover` crops the mixed portrait (1080×1610)
                and landscape (2752×1536) originals to that ratio.
              */}
              <div className="svc-tile__img relative">
                <Image
                  src={tile.image.src}
                  alt={tile.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 296px"
                />
              </div>
              <h3 className="svc-tile__title">{tile.title}</h3>
              <p className="svc-tile__desc">
                {renderDescription(tile.description, tile.highlights)}
              </p>
            </a>
          ))}
        </div>

        <div className="pricing-disclosure">
          <p>{services.pricingDisclosure}</p>
        </div>

        <div className="text-center fade-in" style={{ marginTop: "var(--space-8)" }}>
          <a className="btn btn--arrow" href={services.cta.href}>
            {services.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
