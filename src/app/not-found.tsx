import type { Metadata } from "next";

import { SectionHeading } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { JsonLd, organizationSchema } from "@/lib/seo";

/**
 * ---------------------------------------------------------------------------
 * not-found.tsx — the 404
 * ---------------------------------------------------------------------------
 *
 * A lost visitor should never be stranded, so this page is built as a way out
 * rather than as an apology: a hero that says what happened, then every
 * primary page and every treatment as a one-tap link. Thirteen links is a lot
 * of markup, but it is the only thing a visitor who arrived on a dead URL
 * actually needs.
 *
 * DESIGN
 * Only classes already in `upkeep.css` are used. `.btn` sets
 * `white-space: nowrap`, which is right for a button and wrong for a long
 * treatment name on a 320px phone, so `whiteSpace: "normal"` is set inline on
 * the links and the row itself is allowed to wrap.
 *
 * SEO
 * `robots: noindex, nofollow` — a 404 should never be indexed, and it should
 * not pass crawl equity on to its own link farm. The title still resolves
 * through the root layout's `%s | <name>` template.
 */

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page has moved or never existed. Every treatment and every main page of the site is one tap away from here.",
  robots: { index: false, follow: false },
  // The root layout sets canonical "/" for the home page. Inheriting it here
  // would tell a crawler this 404 *is* the home page, so it is cleared: a
  // not-found response should carry no canonical of its own.
  alternates: { canonical: undefined },
};

/** The primary pages, taken from the shared route map so they cannot drift. */
const mainLinks: { label: string; href: string }[] = [
  { label: "All services", href: site.routes.services },
  { label: "Contact", href: site.routes.contact },
  { label: "Locations", href: site.routes.locations },
  { label: "Gallery", href: site.routes.gallery },
  { label: "Blog", href: site.routes.blog },
];

export default function NotFound() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="404"
        title="Page not found"
        intro="That page has moved or never existed. Here is the way back."
      >
        <div className="text-center">
          <a className="btn btn--filled" href="/">
            Back to the home page
          </a>
        </div>
      </PageHero>

      <section className="section" aria-label="Main pages">
        <div className="container">
          <SectionHeading
            eyebrow="Start again"
            title="The main pages"
            lede="Everything the site is built around is below. Pick whichever is closest to what you were looking for."
            align="center"
          />

          <div
            className="flex items-center justify-center gap-4"
            style={{ flexWrap: "wrap" }}
          >
            {mainLinks.map((link) => (
              <a
                className="btn btn--small"
                href={link.href}
                key={link.href}
                style={{ whiteSpace: "normal" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="Treatments">
        <div className="container">
          <SectionHeading
            eyebrow="Treatments"
            title="Every treatment we offer"
            lede="Each page covers what the appointment involves, what it costs where we publish pricing, and the questions people actually ask at a consultation."
            align="center"
          />

          <div
            className="flex items-center justify-center gap-4"
            style={{ flexWrap: "wrap" }}
          >
            {content.services.map((service) => (
              <a
                className="btn btn--small"
                href={`/services/${service.slug}`}
                key={service.slug}
                style={{ whiteSpace: "normal" }}
              >
                {service.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <JsonLd id="ld-404" data={organizationSchema()} />
    </main>
  );
}
