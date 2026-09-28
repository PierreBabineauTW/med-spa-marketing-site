import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Breadcrumbs,
  CtaBand,
  FaqList,
  SectionHeading,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { content } from "@/config/content";
import { site } from "@/config/site";
import {
  breadcrumbSchema,
  faqSchema,
  JsonLd,
  pageMetadata,
  serviceSchema,
} from "@/lib/seo";

/**
 * `/services/[slug]` — one detail page for all eight treatment categories.
 *
 * Every slug is pre-rendered through `generateStaticParams`, so the page is a
 * server component with no client state and no data fetching. Copy comes
 * entirely from `@/config/content`: `whatToExpect` drives the bullet list, `faq`
 * drives both the visible accordion and the FAQPage schema, and `pricing`
 * drives the price rows.
 *
 * Two honesty guards are load-bearing here:
 *
 *  1. The pricing block renders only when `service.pricing` is non-empty. Six of
 *     the eight categories publish no price, so those pages show no price table
 *     at all rather than a placeholder row or a "call for pricing" invention.
 *  2. `faqSchema()` returns `null` for an empty FAQ and `JsonLd` renders
 *     nothing, so the structured data can never describe questions the page
 *     does not show.
 */

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

function findService(slug: string) {
  return content.services.find((service) => service.slug === slug);
}

export function generateStaticParams() {
  return content.services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  return pageMetadata({
    title: service.name,
    description: service.description,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const otherServices = content.services.filter((other) => other.slug !== service.slug);

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Service"
        title={service.name}
        intro={service.tagline}
        image={service.image}
      />

      <div className="container section--tight fade-in">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.name },
          ]}
        />
      </div>

      <section className="section fade-in" aria-label="What to expect">
        <div className="container">
          <SectionHeading
            eyebrow="The appointment"
            title="What to expect"
            lede="The appointment follows the same shape every time: a conversation about what you want to change and what is realistic, then the treatment, then aftercare advice. Nothing is carried out until you and your practitioner agree on a plan."
          />

          {/* `.blog-post-content ul li` is the sheet's dotted-marker list. */}
          <ul className="blog-post-content">
            {service.whatToExpect.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {service.pricing.length > 0 ? (
        <section className="section--tight fade-in" aria-label="Pricing">
          <div className="container container--narrow">
            <SectionHeading
              eyebrow="Published prices"
              title="Pricing"
              lede="These are the prices we publish. How much you actually need is decided at your consultation, before anything is done."
              align="center"
            />

            <div>
              {service.pricing.map((row) => (
                <div className="menu-simple__row" key={row.label}>
                  <span className="menu-simple__name">{row.label}</span>
                  <span className="menu-simple__dots" aria-hidden="true" />
                  <span className="menu-simple__price">{row.amount}</span>
                  {/* Omitted rather than rendered empty when a row carries no unit. */}
                  {row.unit ? <span className="menu-simple__unit">{row.unit}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section fade-in">
        <FaqList items={service.faq} />
      </section>

      <section className="section fade-in" aria-label="Related services">
        <div className="container">
          <SectionHeading
            eyebrow="Also available"
            title="Related services"
            lede="The other treatments we offer, in case the conversation starts somewhere else."
            align="center"
          />

          {/*
            `.btn` is `display: inline-flex`, so these are inline-level boxes and
            wrap at the whitespace between them on narrow screens — no extra
            flex utility needed.
          */}
          <div className="text-center mt-4">
            {otherServices.map((other) => (
              <a className="btn btn--small" href={`/services/${other.slug}`} key={other.slug}>
                {other.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title={`Ready to talk about ${service.name.toLowerCase()}?`}
        body={`Book a consultation at ${site.name} and bring your questions. We will tell you what is realistic, what it costs, and what we would rather you did not do.`}
        cta={{ label: "Get in touch", href: "/contact" }}
      />

      {/*
        `faqSchema()` returns null for an empty FAQ, so the null is filtered
        out here: a service with no questions emits no FAQPage node at all
        rather than a null entry.
      */}
      <JsonLd
        id="ld-service"
        data={[
          serviceSchema({ name: service.name, description: service.description, path }),
          faqSchema(service.faq),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path },
          ]),
        ].filter((node) => node !== null)}
      />
    </main>
  );
}
