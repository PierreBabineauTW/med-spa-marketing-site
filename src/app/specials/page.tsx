import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { CtaBand, SectionHeading } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { site } from "@/config/site";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";

/**
 * /specials
 *
 * NO OFFERS ARE CONFIGURED, so this page renders an empty state that says so.
 * There is no bundle, no "limited time" countdown, no crossed-out price and no
 * "book now and save 20%" — a discount that does not exist is the single most
 * damaging thing a template can put on a live site.
 *
 * WHEN YOU HAVE REAL OFFERS
 * Add an `offers` array to `src/config/content.ts` (alongside `services`,
 * `studios`, `gallery` and `posts`) with a shape such as:
 *
 *   offers: {
 *     title: string;
 *     blurb: string;
 *     price?: string;      // omit rather than write "TBD" — the row is hidden
 *     conditions?: string; // e.g. "New clients only" — required, not optional
 *     bookingUrl: string;
 *     startsOn: string;    // ISO date, so an expired offer can be hidden
 *     endsOn: string;
 *   }[]
 *
 * then map over `content.offers` below, replacing the empty state, and keep the
 * empty state as the `offers.length === 0` branch.
 *
 * The page shell lives in the root layout, so this file renders `<main>` only.
 */

const intro =
  "This is where current offers, packages and promotions would be published. Nothing is running at the moment.";

export const metadata = pageMetadata({
  title: "Current specials",
  description:
    "Current offers, packages and promotions. Nothing is running at the moment — ask us directly, or book online to see what is available to you.",
  path: "/specials",
});

export default function SpecialsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="ld-specials"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Current specials", path: "/specials" },
        ])}
      />

      <PageHero eyebrow="Current specials" title="Specials" intro={intro} />

      <section className="section fade-in" aria-label="Current offers">
        <div className="container container--narrow">
          <SectionHeading
            align="center"
            eyebrow="Nothing running"
            title="No offers are published here today"
            lede="When a promotion is live it appears on this page with its conditions attached. Until then, pricing is the pricing published on the relevant treatment page, and anything else is agreed at your consultation — never assumed."
          />

          {/*
            Reuses the sheet's existing callout box rather than a new style. The
            point of the line is the same one the box makes elsewhere: the honest
            boundary of what is actually stated.
          */}
          <div className="pricing-disclosure">
            <p>
              A price you are quoted is confirmed in writing before anything is
              done. We do not run pre-booking discounts, so there is no early
              rate to miss by reading this page late.
            </p>
          </div>

          <div
            className="text-center mt-8"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <a className="btn btn--arrow" href={site.routes.contact}>
              Ask about pricing
            </a>
            <a
              className="btn btn--arrow"
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book online
            </a>
          </div>
        </div>
      </section>

      <section className="section--tight fade-in" aria-label="See published pricing">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Pricing that is published"
            title="Where prices are actually shown"
            lede="Only the treatments whose prices we publish carry a price on their own page. The rest are priced after a consultation, once a practitioner has assessed what is actually needed."
          />
          <div
            className="flex items-center justify-center gap-4"
            style={{ flexWrap: "wrap" }}
          >
            <a className="btn btn--small btn--arrow" href={site.routes.services}>
              All treatments
            </a>
            <a className="btn btn--small btn--arrow" href="/financing">
              Paying over time
            </a>
            <a className="btn btn--small btn--arrow" href="/events">
              Events
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Asking about a specific offer?"
        body="If you have seen something promoted elsewhere, tell us and we will confirm whether it applies to you. We would rather you knew exactly what you are paying for."
        cta={{ label: "Contact us", href: site.routes.contact }}
      />
    </main>
  );
}
