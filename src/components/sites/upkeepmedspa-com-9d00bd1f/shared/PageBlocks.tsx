/**
 * SectionHeading — the standard eyebrow / H2 / lede stack used across the
 * reference site (`.eyebrow` + `.heading-section` + `.body-text`), so subpage
 * sections carry the same rhythm as the home page.
 */
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  /** Renders as the page's H2. Use only one per page for a clean outline. */
  as?: "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
  className,
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div
      className={[
        "fade-in",
        center ? "text-center" : "",
        "mb-8",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <p className={`eyebrow${center ? " text-center" : ""}`}>{eyebrow}</p> : null}
      <Tag className={`heading-section${center ? " text-center" : ""} mb-4`}>{title}</Tag>
      {lede ? (
        <p className={`body-text${center ? " text-center mx-auto" : ""}`} style={{ maxWidth: center ? 680 : undefined }}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/**
 * CtaBand — a closing call to action built from the same `.booking-cta`
 * component the home page uses, so the sign-off on every subpage is identical
 * to the one a visitor already saw.
 */
type CtaBandProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  cta: { label: string; href: string };
  /** Set when the link is external (adds target=_blank). */
  external?: boolean;
  background?: { src: string; alt: string };
};

export function CtaBand({ eyebrow, title, body, cta, external, background }: CtaBandProps) {
  return (
    <section className="booking-cta" aria-label={title}>
      {background ? (
        <div className="booking-cta__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={background.src} alt="" />
        </div>
      ) : null}
      <div className="booking-cta__content fade-in">
        {eyebrow ? <p className="eyebrow text-center">{eyebrow}</p> : null}
        <h2 className="heading-section text-center mb-4">{title}</h2>
        {body ? <p className="body-text text-center mx-auto mb-8">{body}</p> : null}
        <div className="text-center">
          <a
            className="btn btn--filled"
            href={cta.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * FaqList — question/answer pairs. The FAQPage schema is emitted by the page
 * that renders this, so the visible copy and the structured data can never
 * drift apart.
 */
type FaqListProps = {
  items: { q: string; a: string }[];
  heading?: string;
};

export function FaqList({ items, heading = "Common questions" }: FaqListProps) {
  if (!items.length) return null;
  return (
    <div className="fade-in">
      <SectionHeading title={heading} eyebrow="Good to know" align="center" />
      <div className="container" style={{ maxWidth: 820 }}>
        {items.map((item) => (
          <details className="menu-accordion" key={item.q}>
            <summary className="menu-accordion__trigger">
              <span className="menu-accordion__brand">{item.q}</span>
              <span className="menu-accordion__icon" aria-hidden="true">
                <svg viewBox="0 0 10 6" width="14" height="9" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </span>
            </summary>
            <div className="menu-accordion__body">
              <p className="body-text mb-4" style={{ fontSize: "var(--text-sm)" }}>
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Breadcrumbs — matches the visual language of `.footer__legal-links`. */
type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className="footer__legal-links"
        style={{ justifyContent: "center", display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              {item.href && !last ? (
                <a href={item.href} className="footer__link" style={{ fontSize: "var(--text-xs)" }}>
                  {item.label}
                </a>
              ) : (
                <span className="footer__link" style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden="true" style={{ color: "var(--color-text-faint)" }}>
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
