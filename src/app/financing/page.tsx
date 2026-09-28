import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import {
  CtaBand,
  FaqList,
  SectionHeading,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { site } from "@/config/site";
import { JsonLd, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

/**
 * /financing
 *
 * NO FINANCING PARTNER IS CONFIGURED. A real lender must be agreed, integrated
 * and reviewed before this page says anything more specific than it currently
 * does — including a rate, a term, an APR, a fee or a "no credit check"
 * promise. Every figure in this category is a regulated claim about a named
 * provider, so none of them are written here.
 *
 * What the page does instead is describe how medical-aesthetic financing
 * generally works, so a visitor knows what questions to ask. Each answer is
 * framed as general information and says plainly where the answer belongs to
 * the provider rather than to the clinic.
 *
 * BEFORE LAUNCH
 * 1. Agree a provider and put its name and link in `site.ts`.
 * 2. Replace the first FAQ answer with the terms actually offered.
 * 3. Only state a rate, term or fee if the provider has confirmed it in
 *    writing, and link to the provider's own terms page.
 * 4. `faqSchema()` below already mirrors the visible questions, so updating the
 *    `faq` array updates the structured data at the same time.
 *
 * The page shell lives in the root layout, so this file renders `<main>` only.
 */

const intro =
  "Paying for treatment in instalments is common in this sector. No financing partner is set up for this site yet, so nothing is being offered here at the moment — this page explains how it usually works so you know what to ask.";

const faq: { q: string; a: string }[] = [
  {
    q: "Is financing available for treatments?",
    a: "Financing for medical-aesthetic treatments is widely available in this sector, and it is normally arranged through a third-party finance provider rather than by the clinic itself. That means the provider — not us — sets the terms, and the clinic simply accepts the payment. No provider is configured for this site at the moment, so there is nothing to offer you today. Ask us and we will tell you honestly what is and is not available.",
  },
  {
    q: "How does a credit check usually work?",
    a: "Most providers run a soft credit check to decide whether to offer terms, which is a lighter enquiry than a full application and generally does not affect your score in the same way. The exact process, the information they ask for and how the decision is reached all belong to the provider, and they will explain it before you commit. We are not able to speak for a provider we do not work with, so treat this as general information rather than a promise.",
  },
  {
    q: "What does the process usually look like?",
    a: "In most cases: pick a provider, find out what you qualify for, agree to a schedule of payments, and settle whatever is left at the end of the agreed term. Some providers charge an upfront fee, some waive it, and the schedule is often shorter for smaller amounts. All of that varies by provider, which is why you should be shown the terms before you sign anything.",
  },
  {
    q: "Does paying over time change the price of a treatment?",
    a: "Not necessarily, and it is worth assuming it does not. A provider's fees and interest rate are part of what you agree to, not a discount on the treatment. When you compare options, ask for the total amount you would repay over the full term and put it next to the price of paying up front, so the comparison is like for like.",
  },
  {
    q: "Can I pay for a course of treatment over time?",
    a: "Treatments that need a series of appointments — lip top-ups, laser sessions, body contouring plans — often span months, and that kind of schedule is what a payment plan is usually aimed at. Whether a plan can be arranged depends on the provider and the amount involved. Talk to us about the schedule you would need first, then take that to the provider with you.",
  },
];

export const metadata = pageMetadata({
  title: "Financing",
  description:
    "How paying for aesthetic treatment in instalments generally works — availability, credit checks and the usual process.",
  path: "/financing",
});

export default function FinancingPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="ld-financing"
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Financing", path: "/financing" },
          ]),
          // `faqSchema` returns null for an empty list; filtering keeps the
          // array type honest rather than asserting a non-null.
          faqSchema(faq),
        ].filter((node) => node !== null)}
      />

      <PageHero eyebrow="Pay over time" title="Financing" intro={intro} />

      <section className="section fade-in" aria-label="How financing works">
        <div className="container container--narrow">
          <SectionHeading
            eyebrow="The general picture"
            title="How financing usually works here"
            lede="The important thing to know is who you are entering an agreement with. A payment plan for a treatment is a contract between you and a finance provider; the clinic is the place the treatment happens and is paid for, not the party that decides your terms."
          />

          {/*
            The sheet's existing callout box, reused for the one thing this page
            must not leave ambiguous: nothing quantitative is claimed.
          */}
          <div className="pricing-disclosure">
            <p>
              No interest rate, term length, fee, credit requirement or approval
              rate is stated on this page, because none has been agreed. Anything
              you are shown will come from the provider&apos;s own terms, and you
              should read those before you agree to anything.
            </p>
          </div>
        </div>
      </section>

      <section className="section--tight fade-in" aria-label="Financing questions">
        <FaqList items={faq} heading="Common questions" />
      </section>

      <section className="section--tight fade-in" aria-label="Ask a question">
        <div className="container container--narrow text-center">
          <h2 className="heading-section mb-4">Questions about paying?</h2>
          <p className="body-text mx-auto mb-8">
            Send us a question before you speak to any provider and we will tell
            you what we know, and be clear about what we do not. You are welcome
            to ask about the cost of a treatment, the timing of a course, or how
            to work out whether a plan is worth it.
          </p>
          <a className="btn btn--arrow" href={site.routes.contact}>
            Ask us about payment
          </a>

          <div
            className="flex items-center justify-center gap-4 mt-8"
            style={{ flexWrap: "wrap" }}
          >
            <a className="btn btn--small btn--arrow" href={site.routes.services}>
              Treatment categories
            </a>
            <a className="btn btn--small btn--arrow" href="/specials">
              Current specials
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Start with a consultation"
        body="Cost and timing are both clearer after a conversation. Book in, talk through what you are considering, and take the details with you when you speak to a provider."
        cta={{ label: "Contact us", href: site.routes.contact }}
      />
    </main>
  );
}
