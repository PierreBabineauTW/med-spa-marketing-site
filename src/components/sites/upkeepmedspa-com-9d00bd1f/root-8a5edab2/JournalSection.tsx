/**
 * Home page "How to UPKEEP" journal/blog grid, captured verbatim from
 * https://upkeepmedspa.com/ — site-key: upkeepmedspa-com-9d00bd1f
 * page-key: root-8a5edab2
 *
 * Every string, href and image path comes from `journal` in
 * @/lib/upkeepmedspa-data. All visual styling is the ported sheet
 * (upkeep.css) via the class names below, so this file adds no CSS.
 *
 * The entrance reveal is the native scroll-driven animation the ported sheet
 * already defines for `.fade-in`, and the card hover zoom is
 * `.blog-card:hover .blog-card__image` — both CSS-only, so this stays a
 * server component with no client JS and no observer.
 */

import Image from "next/image";

import { journal } from "@/lib/upkeepmedspa-data";

export function JournalSection() {
  return (
    <section className="section" aria-label="Latest from the blog">
      <div className="container">
        <div
          className="flex"
          style={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div className="fade-in">
            <p className="eyebrow">{journal.eyebrow}</p>
            <h2 className="heading-section">{journal.heading}</h2>
          </div>
          <a
            className="btn btn--small btn--arrow fade-in"
            href={journal.cta.href}
          >
            {journal.cta.label}
          </a>
        </div>
        <div className="grid-3 fade-in">
          {journal.cards.map((card) => (
            <a className="blog-card" href={card.href} key={card.href}>
              <div className="overflow-hidden">
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  width={card.image.width}
                  height={card.image.height}
                  className="blog-card__image"
                />
              </div>
              <div className="blog-card__content">
                <p className="blog-card__category">{card.category}</p>
                <h3 className="blog-card__title">{card.title}</h3>
                <p className="blog-card__excerpt">{card.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
