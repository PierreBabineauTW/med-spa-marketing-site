import Image from "next/image";

import {
  CtaBand,
  SectionHeading,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { content } from "@/config/content";
import { site } from "@/config/site";
import {
  breadcrumbSchema,
  JsonLd,
  organizationSchema,
  pageMetadata,
} from "@/lib/seo";

/**
 * `/services` — the index of every treatment category.
 *
 * This page adds no CSS. The tile anatomy below is deliberately identical to
 * `ServicesSection` on the home page (`.svc-tile` > `.svc-tile__img` >
 * `.svc-tile__title` + `.svc-tile__desc`) so a visitor moving between the two
 * cannot tell which page they are on; only the links differ. The grid is
 * `.grid-4` from the ported sheet, which collapses 4 → 2 → 1 like the home
 * page's row does.
 *
 * The intro and the meta description are both assembled from `@/config`
 * (service names, studio count, brand name) rather than hand-written, so
 * adding or removing a service in `content.ts` cannot leave stale copy or an
 * inaccurate claim behind. Nothing here asserts a price, a result or a
 * qualification that the config does not already state.
 */

const studioCount = content.studios.length;

export const metadata = pageMetadata({
  title: "Our Services",
  // Kept under ~160 characters so it is not truncated in a search result. The
  // service list is abbreviated rather than spelled out, and the whole thing is
  // capped so adding a longer brand name cannot silently break the limit.
  description: [
    `${content.services.length} treatment categories at ${site.name}: neurotoxins, fillers, facials, laser and body contouring.`,
    "Published pricing where available, and a consultation before every treatment.",
  ].join(" ").slice(0, 160),
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="What we do"
        title="Our Services"
        intro={`${site.name} is a women-owned medical spa offering injectables, skin, laser and body contouring treatments across ${studioCount} studios in New York and Dallas. Every treatment starts with a consultation.`}
      />

      <section className="section fade-in" aria-label="All services">
        <div className="container">
          <SectionHeading
            eyebrow="Treatment categories"
            title="Every treatment, in one place"
            lede="Pick a category to see what the appointment involves, what we publish about price, and the common questions we answer. We only list prices we actually publish; the rest are confirmed at your consultation."
            align="center"
          />

          <div className="grid-4">
            {content.services.map((service) => (
              <a className="svc-tile" href={`/services/${service.slug}`} key={service.slug}>
                {/*
                  The wrapper is the 3:4 aspect box from the sheet, so the image
                  fills it and `object-fit: cover` crops the mixed portrait
                  (1080×1610) and landscape (2752×1536) originals to one ratio.
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

          {/* Same disclosure box the home page places beneath its service row. */}
          <div className="pricing-disclosure">
            <p>
              Prices are published only where we list them. Everything else is priced at
              your consultation, once your practitioner has assessed what you actually
              need — and you are told before anything is done.
            </p>
          </div>

          <div className="text-center mt-8">
            <a className="btn btn--arrow" href="/">
              Back to home
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Not sure what to book?"
        body="Tell us what you are looking for and we will point you at the right category — including telling you when the answer is a different treatment, or a surgical consultation."
        cta={{ label: "Get in touch", href: "/contact" }}
      />

      <JsonLd
        id="ld-services"
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
    </main>
  );
}
