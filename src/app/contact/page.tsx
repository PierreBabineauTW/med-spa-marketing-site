import { ContactForm } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ContactForm";
import {
  Breadcrumbs,
  CtaBand,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
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
 * /contact
 * ---------------------------------------------------------------------------
 *
 * A two-column page built on the sheet's `.split` (two columns, collapsing to
 * one at 768px): the form on the left, the ways to reach us on the right. This
 * file stays a server component so it keeps its `metadata` export; the
 * interactive part is `ContactForm`.
 *
 * HONESTY
 * - `content.hours` is null, so there are no opening hours anywhere on this
 *   page. The contact block is phone, email, the booking link and the
 *   locations pointer — the four things `site.contact` actually configures.
 * - The booking button points at `site.bookingUrl`, which is external, so it
 *   carries `target="_blank" rel="noopener noreferrer"`.
 * - No response-time promise, no "we reply within X", no claim that a
 *   consultation is free. The intro says what happens next without putting a
 *   number on it.
 * - `form` posts to `/api/contact`; if that endpoint is not configured it
 *   answers 503 and the form says so, rather than reporting a send that never
 *   happened. See `ContactForm` for that state machine.
 *
 * The page shell (skip link, nav, footer, overlays) lives in the root layout,
 * so this file renders `<main>` only.
 */

const studioCount = content.studios.length;

const intro = "Send us a message with the form and it goes straight to the studio team. Prefer to skip that? Call, email, or book online — and tell us which studio and which treatment you have in mind so we can answer properly.";

const description = `Contact ${site.name}: send a message with the form, call or email us, or book your appointment online. ${studioCount} studios across New York and Dallas.`;

export const metadata = pageMetadata({
  title: "Contact",
  description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Get in touch" title="Contact" intro={intro}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      </PageHero>

      <section className="section" aria-label="Contact form and studio details">
        <div className="container">
          {/*
            `alignItems: "start"` rather than the sheet's default `center`:
            the two columns are a form and a details block, so they should share
            a top edge rather than float centred against each other.
          */}
          <div className="split" style={{ alignItems: "start" }}>
            <div>
              <p className="eyebrow">Send a message</p>
              <h2 className="heading-section mb-4">
                Tell us what you are considering
              </h2>
              <p className="body-text mb-8">
                The more you can tell us up front, the more useful our reply
                will be. A question, a treatment you have read about, a studio
                that is convenient for you — whatever it is, that is a fine
                place to start.
              </p>

              <ContactForm />
            </div>

            <div className="fade-in">
              <p className="eyebrow">Or reach us directly</p>
              <h2 className="heading-section mb-4">
                Phone, email or book online
              </h2>
              <p className="body-text mb-6">
                Booking online is the quickest route to an appointment. If you
                would rather talk it through first, the details below go
                straight to us.
              </p>

              {/* The sheet's name / value row: label, dotted leader, detail. */}
              <div className="menu-simple__row">
                <span className="menu-simple__name">Phone</span>
                <span className="menu-simple__dots" aria-hidden="true" />
                <a className="footer__link" href={site.contact.phoneHref}>
                  {site.contact.phone}
                </a>
              </div>
              <div className="menu-simple__row">
                <span className="menu-simple__name">Email</span>
                <span className="menu-simple__dots" aria-hidden="true" />
                <a className="footer__link" href={site.contact.emailHref}>
                  {site.contact.email}
                </a>
              </div>

              <p className="body-text mt-8 mb-6">
                {site.contact.locationsSummary}. Every address is on the{" "}
                <a href={site.routes.locations}>locations page</a>, and you can
                choose a studio while you are booking.
              </p>

              <a
                className="btn btn--filled"
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book online
              </a>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Not sure what to ask?"
        title="Read up before you write"
        body="Every treatment page covers what the appointment involves, what we publish about price, and the questions people ask most. It is usually an easier place to start than a blank message box."
        cta={{ label: "Our services", href: site.routes.services }}
      />

      <JsonLd
        id="ld-contact"
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
    </main>
  );
}
