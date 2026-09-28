import Image from "next/image";

import {
  Breadcrumbs,
  CtaBand,
  SectionHeading,
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
 * /about
 * ---------------------------------------------------------------------------
 *
 * Adds no CSS. Every block reuses the reference sheet's own vocabulary:
 * `.manifesto` for the pull statement, `.grid-4` + `.svc-tile` for the
 * treatment grid (identical to `ServicesSection` on the home page and to
 * `/services`, so the cards are the same cards a visitor has already seen) and
 * `.menu-simple__row` for the numbered visit steps.
 *
 * THE GRID IS LINKING, NOT DECORATION
 * The eight tiles are the page's onward navigation: each one points at
 * `/services/${slug}`, so every treatment page gets an internal link from a
 * second place on the site, and a visitor who only reads `/about` can still
 * reach every category.
 *
 * HONESTY
 * - `content.foundedYear` is null, so nothing here claims a year, an
 *   anniversary or a "since" date. The manifesto sentence deliberately makes no
 *   chronological claim.
 * - The visit steps describe the shape of an appointment only. No turn-around
 *   time, no guarantee, no clinical outcome — a page about a med spa is exactly
 *   where that kind of claim sneaks in, and none of it is stated here.
 * - No invented team, awards, review counts or certifications. The page says
 *   what the config actually says and nothing more.
 *
 * The page shell (skip link, nav, footer, overlays) lives in the root layout,
 * so this file renders `<main>` only.
 */

const studioCount = content.studios.length;

const serviceCount = content.services.length;

/**
 * Four steps, described generically. Each says what happens, never what it
 * achieves or how long anything takes.
 */
const visitSteps = [
  {
    title: "01 — Consultation",
    body: "You talk through what you want to change and what is realistic for your face. Nothing is treated at this appointment, and nothing is sold to you as a package.",
  },
  {
    title: "02 — Assessment",
    body: "A licensed practitioner examines the area and maps out what they plan to do. If a treatment is not the right answer for you, that is what you will hear.",
  },
  {
    title: "03 — The treatment",
    body: "Carried out by the practitioner you met, staged where staging makes sense, with aftercare explained out loud before you leave the chair.",
  },
  {
    title: "04 — Follow-up",
    body: "A plan for when to come back, arranged around your schedule. It is part of the treatment, not an extra you have to ask twice for.",
  },
];

// No ownership, founding-year or qualification claim here: a template cannot
// assert facts about a business it knows nothing about. `site.ownership` is
// appended only once a real business sets it.
const intro = `${site.name} is a medical spa with ${studioCount} studios across New York and Dallas. We treat injectables, skin, laser and body contouring, and every visit starts with a consultation rather than a prescription.`;

const description = `How ${site.name} works: our approach to consultations, the ${serviceCount} treatment categories we offer, and what a first visit involves.`;

export const metadata = pageMetadata({
  title: "About",
  description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Our approach" title="About us" intro={intro}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </PageHero>

      {/*
        The manifesto carries the philosophy in the sheet's own large italic
        pull-quote style. One sentence, and no year claim anywhere in it.
      */}
      <section className="section" aria-label="Our philosophy">
        <div className="container fade-in">
          <p className="manifesto">
            <span className="manifesto__text">
              Aesthetic medicine only earns its place when it is explained
              properly before it happens, judged honestly by the person
              treating you, and never oversold.
            </span>
          </p>
        </div>
      </section>

      <section className="section" aria-label="Treatment categories">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title={`${serviceCount} treatment categories, one approach`}
            lede="Every category below is a page of its own: what the appointment involves, what we publish about price, and the questions people ask most. The two categories that carry published pricing are marked on their own pages; the rest are priced at your consultation."
            align="center"
          />

          <div className="grid-4 fade-in">
            {content.services.map((service) => (
              <a className="svc-tile" href={`/services/${service.slug}`} key={service.slug}>
                {/*
                  Identical anatomy to the home page's `ServicesSection` and to
                  `/services`. The sheet's `object-fit: cover` crops the mixed
                  portrait and landscape originals to the tile's 3:4 box.
                */}
                <div className="svc-tile__img relative">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 296px"
                  />
                </div>
                <h3 className="svc-tile__title">{service.name}</h3>
                <p className="svc-tile__desc">{service.tagline}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight" aria-label="The stages of a visit">
        <div className="container">
          <SectionHeading
            eyebrow="Your visit"
            title="How a visit works"
            lede="The same shape whether you come in for a neurotoxin appointment or a laser consultation: talk first, assess second, treat only once both of you agree on the plan."
            align="center"
          />

          {/*
            `container--narrow` + `mx-auto` rather than a nested `.container`,
            so the step list is capped at the reading width without doubling
            the gutter.
          */}
          <ol role="list" className="container--narrow mx-auto fade-in">
            {visitSteps.map((step) => (
              <li className="menu-simple__row" key={step.title}>
                <h3 className="menu-simple__name">{step.title}</h3>
                {/* The dotted leader is decorative; it is not a text separator. */}
                <span className="menu-simple__dots" aria-hidden="true" />
                <span className="body-text">{step.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section--tight" aria-label="Studios and gallery">
        <div className="container container--narrow text-center">
          <SectionHeading
            eyebrow="Come and see us"
            title="Where to find us"
            lede={`${site.contact.locationsSummary} — the studios page lists every address, and the gallery shows what the rooms and the work actually look like.`}
            align="center"
          />

          <div className="flex gap-4" style={{ flexWrap: "wrap", justifyContent: "center" }}>
            <a className="btn" href={site.routes.locations}>
              Find a studio
            </a>
            <a className="btn btn--arrow" href={site.routes.gallery}>
              See the gallery
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Want to talk it through first?"
        body="Send us a question before you book and we will answer it plainly — including telling you when a treatment is not the right route."
        cta={{ label: "Contact us", href: site.routes.contact }}
      />

      <JsonLd
        id="ld-about"
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
    </main>
  );
}
