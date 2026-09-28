import { StudioSwitcher } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/StudioSwitcher";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import {
  Breadcrumbs,
  CtaBand,
  SectionHeading,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { content } from "@/config/content";
import { site } from "@/config/site";
import {
  JsonLd,
  breadcrumbSchema,
  organizationSchema,
  pageMetadata,
} from "@/lib/seo";

/**
 * ---------------------------------------------------------------------------
 * /locations
 * ---------------------------------------------------------------------------
 *
 * The studio data and the switch interaction belong to `StudioSwitcher`; this
 * page only supplies the shell, the answer-first copy and the closing CTA.
 *
 * DEEP LINKS
 * The home page and the footer both link to `/locations#ues`, `/locations#dal`
 * and so on. Those fragments are only present on the card the switcher is
 * currently showing, so the page also renders a complete, crawlable list of
 * every studio as anchor targets. That list is what guarantees a link to any
 * studio resolves to this page rather than 404ing.
 *
 * HONESTY
 * `content.studios[*].phone`, `.hours` and `.mapUrl` are all null, and
 * `content.hours` is null. `StudioSwitcher` omits those rows, and this page
 * adds nothing in their place: no page-level phone block, no opening hours, no
 * directions button. The only way to reach the business is the configured
 * `site.contact.phone` (in the footer) or the contact form.
 */

const studios = content.studios;

/** "5 in New York and 2 in Texas" — derived, so the copy cannot drift from config. */
const regionBreakdown = content.regions
  .map((region) => {
    const count = studios.filter((s) => s.region === region.id).length;
    return `${count} in ${region.label}`;
  })
  .join(" and ");

const intro = `${studios.length} studios — ${regionBreakdown}. Choose one above to see its address, or use the list below to jump between them.`;

const description = `Every studio location with its address: ${studios.length} in total, ${regionBreakdown}. Pick a studio, see where it is and book your visit.`;

export const metadata = pageMetadata({
  title: "Locations",
  description,
  path: "/locations",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Locations", path: "/locations" },
];

export default function LocationsPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Find us" title="Locations" intro={intro}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      </PageHero>

      <section className="section" aria-label="Studio switcher">
        <div className="container">
          <StudioSwitcher />
        </div>
      </section>

      {/*
        Every studio as a link target. The switcher only mounts one card at a
        time, so this list is what makes each studio reachable by anchor and
        visible to a crawler or a link preview.
      */}
      <section className="section--tight" aria-label="All studios">
        <div className="container">
          <SectionHeading
            as="h3"
            align="center"
            eyebrow="All studios"
            title="Jump to a location"
            lede="The pills above switch between studios. Every studio is also listed here, so a shared link to a particular location always lands on this page."
          />
          <nav className="loc-pills" aria-label="Jump to a studio">
            {studios.map((studio) => (
              <a
                key={studio.id}
                id={`${studio.id}-link`}
                className="loc-pill"
                href={`#${studio.id}`}
              >
                {studio.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="section--tight" aria-labelledby="closest-heading">
        <div className="container container--narrow text-center">
          <h2 className="heading-section mb-4" id="closest-heading">
            Not sure which is closest?
          </h2>
          <p className="body-text">
            Say roughly where you are and we will point you to the studio that
            works best. The contact form is the fastest way to reach us, and you
            can also book online and choose a location there.
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Get in touch"
        title="Not sure which studio to pick?"
        body="Tell us where you are and what you are considering, and we will help you choose. Questions about a treatment, a booking or an existing appointment all come to the same place."
        cta={{ label: "Contact us", href: site.routes.contact }}
      />

      <JsonLd
        id="ld-locations"
        data={[organizationSchema(), breadcrumbSchema(crumbs)]}
      />
    </main>
  );
}
