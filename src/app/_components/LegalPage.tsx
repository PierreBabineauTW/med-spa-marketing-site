import { Breadcrumbs } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";

/**
 * ---------------------------------------------------------------------------
 * LegalPage — one renderer for the four policy pages
 * ---------------------------------------------------------------------------
 *
 * /privacy-policy, /cancellation-policy, /safety-prescribing and
 * /accessibility are the same page with different copy. Rather than let four
 * files drift apart — a different hero, a different breadcrumb position, one
 * page quietly growing a heading the others lack — all four call this.
 *
 * `content.legal` is the single source of the copy: each page hands its own
 * slice in and nothing here invents wording, so the rendered text is exactly
 * what config says.
 *
 * METADATA LIVES IN THE PAGE FILE, NOT HERE. `pageMetadata()` needs a `path`,
 * and putting it in this component would fix all four canonicals to one URL —
 * the exact duplicate-content mistake the helper exists to prevent. Each page
 * exports its own `metadata`.
 *
 * HONESTY
 * The legal copy in config is deliberately generic: it names no legal entity,
 * regulator, registration number, tax ID, data-controller address or governing
 * law, because none of those are known. This component adds no identifiers of
 * its own. It does surface one visible line saying the wording is placeholder
 * text, using the sheet's existing `.pricing-disclosure` callout — the closest
 * thing the locked stylesheet already has to a boxed note, and reusing it keeps
 * the design system intact without a new CSS file.
 *
 * The page shell (skip link, nav, footer, overlays) lives in the root layout, so
 * this renders `<main>` only.
 */

type LegalSection = { readonly h: string; readonly p: string };

type LegalPageProps = {
  /** Page H1, e.g. "Privacy Policy". */
  title: string;
  /** Answer-first opening paragraph. */
  intro: string;
  /** One `.heading-section` + `.body-text` pair per entry, in order. */
  sections: readonly LegalSection[];
  /** This page's own route, used for the breadcrumb trail and the schema. */
  path: string;
};

/**
 * Every policy page, in the order the footer's legal row uses. Paths come from
 * `site.routes` and titles from `content.legal`, so the cross-links at the foot
 * of each page can never point at a renamed route or a stale label.
 */
const ALL_POLICIES = [
  { path: site.routes.privacy, title: content.legal.privacy.title },
  { path: site.routes.cancellation, title: content.legal.cancellation.title },
  { path: site.routes.safety, title: content.legal.safety.title },
  { path: site.routes.accessibility, title: content.legal.accessibility.title },
] as const;

export function LegalPage({ title, intro, sections, path }: LegalPageProps) {
  const others = ALL_POLICIES.filter((p) => p.path !== path);

  return (
    <main id="main-content">
      <JsonLd
        id="ld-legal"
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: title, path },
        ])}
      />

      <PageHero eyebrow="Information" title={title}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      </PageHero>

      <section className="section fade-in" aria-label={title}>
        <div className="container container--narrow">
          <p className="body-text">{intro}</p>

          <div className="pricing-disclosure">
            <p>
              This is placeholder wording. Replace it with terms reviewed for your
              business and jurisdiction before launch.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.h} className="mt-8">
              <h2 className="heading-section mb-4">{section.h}</h2>
              <p className="body-text">{section.p}</p>
            </div>
          ))}

          <div className="mt-8">
            <h2 className="heading-section mb-4">Questions about this page?</h2>
            <p className="body-text mb-8">
              If anything here is unclear, or you want something confirmed in
              writing, ask us directly. We would rather answer a question than
              have you guess.
            </p>
            <div className="text-center">
              <a className="btn btn--arrow" href={site.routes.contact}>
                Contact us
              </a>
            </div>
          </div>

          <nav className="mt-8" aria-label="Other policies">
            <p className="eyebrow text-center">Other policies</p>
            <ul
              className="footer__legal-links"
              style={{
                justifyContent: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-4)",
              }}
            >
              {others.map((policy) => (
                <li key={policy.path}>
                  <a className="footer__link" href={policy.path}>
                    {policy.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
}
