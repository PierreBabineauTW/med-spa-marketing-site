import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { CtaBand, SectionHeading } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { site } from "@/config/site";
import { JsonLd, breadcrumbSchema, pageMetadata } from "@/lib/seo";

/**
 * /events
 *
 * NO EVENTS ARE CONFIGURED, so this page renders an empty state that says so.
 * It does not invent an event, a date, a price, a giveaway or a "next event"
 * countdown — a fabricated date is a claim about a real business, and it would
 * be wrong the moment the real schedule exists.
 *
 * WHEN YOU HAVE REAL EVENTS
 * Add an `events` array to `src/config/content.ts` (alongside `services`,
 * `studios` and `posts`) with a shape such as:
 *
 *   events: {
 *     title: string;
 *     studioId: Studio["id"];
 *     date: string;        // ISO date — sort and format from this, not by hand
 *     blurb: string;
 *     signupUrl: string;
 *   }[]
 *
 * then map over `content.events` below, replacing the empty state. Keep the
 * empty state as the `events.length === 0` branch so the page is never a
 * placeholder waiting to be forgotten.
 *
 * The page shell lives in the root layout, so this file renders `<main>` only.
 */

const intro =
  "Events are the open evenings, education sessions and treatment previews our studios run from time to time. There is nothing in the diary at the moment.";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Open evenings, education sessions and treatment previews at our studios. Nothing is in the diary at the moment — ask us what is coming up.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="ld-events"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ])}
      />

      <PageHero eyebrow="Events" title="Upcoming events" intro={intro} />

      <section className="section fade-in" aria-label="Scheduled events">
        <div className="container container--narrow">
          <SectionHeading
            align="center"
            eyebrow="Nothing scheduled"
            title="The diary is empty for now"
            lede="We do not publish a standing events calendar, so when something is not here it genuinely is not happening. If you have heard about a session from someone, check with us directly rather than relying on a listing — we will tell you either way."
          />

          <div className="text-center">
            <a className="btn btn--arrow" href={site.routes.contact}>
              Ask what is coming up
            </a>
          </div>
        </div>
      </section>

      <section className="section--tight fade-in" aria-label="Related pages">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="While you are here"
            title="Other things worth a look"
            lede="Offers are kept on their own page, and every treatment page covers what an appointment involves and what we publish about price."
          />
          <div
            className="flex items-center justify-center gap-4"
            style={{ flexWrap: "wrap" }}
          >
            <a className="btn btn--small btn--arrow" href="/specials">
              Current specials
            </a>
            <a className="btn btn--small btn--arrow" href={site.routes.services}>
              All treatments
            </a>
            <a className="btn btn--small btn--arrow" href={site.routes.contact}>
              Contact us
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Talk it through"
        title="Want to know what is planned?"
        body="Tell us what you are interested in — a particular treatment, a studio near you, or simply what a first appointment involves — and we will tell you what is actually running."
        cta={{ label: "Contact us", href: site.routes.contact }}
      />
    </main>
  );
}
