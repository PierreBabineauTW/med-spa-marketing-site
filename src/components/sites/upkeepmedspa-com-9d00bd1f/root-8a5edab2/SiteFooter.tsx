/**
 * Site footer — https://upkeepmedspa.com/ (home page).
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Static server component: no `"use client"`, no state, no handlers. Every
 * hover state (`.footer__link`, `.footer__social-link`, `.btn--accent`) is the
 * target's own `transition` in the ported sheet, so no transition utilities.
 *
 * Class names are the target's own, verbatim — `.footer`, `.footer__grid`,
 * `.footer__brand-logo`, `.footer__logo-img`, `.footer__tagline`,
 * `.footer__socials`, `.footer__social-link`, `.footer__heading`,
 * `.footer__link`, `.footer__bottom`, `.footer__legal-links`,
 * `.footer__a11y-notice` and `.btn.btn--small.btn--accent` all come from
 * upkeep.css, which is imported unlayered and therefore owns the 4 / 2 / 1
 * `.footer__grid` breakpoints and every fluid `clamp()` size. Nothing here sets
 * a colour, spacing or font-size outside those classes.
 *
 * Only three values are inline because they are inline on the live page: the
 * `--space-3` / `--space-4` offsets on the contact note and the Book Now
 * button, and the faint colour of the note. The `tel:` / `mailto:` anchors and
 * the bare `<a>` legal links are styled by the sheet, so no `text-decoration`
 * override is needed here.
 */

import Image from "next/image";
import type { ReactNode } from "react";

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons";
import { footer } from "@/lib/upkeepmedspa-data";

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
} as const;

/** The target wraps the notice lead and its closing call to action. */
const NOTICE_LEAD = "Accessibility:";
const NOTICE_STATEMENT = "Accessibility Statement";

type NoticeLink = { text: string; node: ReactNode };

/**
 * Split `text` into plain runs and the supplied linked fragments, earliest
 * match first. The a11y notice is stored as one flat string but is three links
 * (phone, email, statement) in the live markup, so the copy stays in the data
 * module while the anchors are re-attached here.
 */
function withLinks(text: string, links: NoticeLink[]): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  while (rest.length > 0) {
    const next = links
      .map((link) => ({ link, index: rest.indexOf(link.text) }))
      .filter((candidate) => candidate.index >= 0)
      .sort((a, b) => a.index - b.index)[0];
    if (next === undefined) break;
    if (next.index > 0) nodes.push(rest.slice(0, next.index));
    nodes.push(next.link.node);
    rest = rest.slice(next.index + next.link.text.length);
  }
  if (rest.length > 0) nodes.push(rest);
  return nodes;
}

export function SiteFooter() {
  const { logo, tagline, socials, columns, contact, bottom, accessibilityNotice } = footer;

  const noticeBody = accessibilityNotice.startsWith(NOTICE_LEAD)
    ? accessibilityNotice.slice(NOTICE_LEAD.length)
    : accessibilityNotice;

  // The live page joins the phone's area code and prefix with a non-breaking
  // space (`(833)&nbsp;875-3377`) so the number never wraps mid-number.
  const noticeLinks: NoticeLink[] = [
    {
      text: contact.phone,
      node: (
        <a key="notice-phone" href={contact.phoneHref}>
          {contact.phone.replace(" ", "\u00a0")}
        </a>
      ),
    },
    {
      text: contact.email,
      node: (
        <a key="notice-email" href={contact.emailHref}>
          {contact.email}
        </a>
      ),
    },
    {
      text: NOTICE_STATEMENT,
      node: (
        <a key="notice-statement" href="/accessibility">
          {NOTICE_STATEMENT}
        </a>
      ),
    },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div>
            <a className="footer__brand-logo" href="/">
              <Image
                src={logo.src}
                alt={logo.alt}
                className="footer__logo-img"
                width={logo.width}
                height={logo.height}
              />
            </a>
            <p className="footer__tagline">{tagline}</p>
            <div className="footer__socials">
              {socials.map((social) => {
                const SocialIcon = SOCIAL_ICONS[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <SocialIcon width={18} height={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="footer__heading">{column.heading}</p>
              {column.links.map((link) => (
                <a key={`${column.heading}-${link.href}`} className="footer__link" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}

          <div>
            <p className="footer__heading">Contact</p>
            <a href={contact.phoneHref} className="footer__link">
              {contact.phone}
            </a>
            <a href={contact.emailHref} className="footer__link">
              {contact.email}
            </a>
            <p
              className="footer__link"
              style={{ marginTop: "var(--space-3)", color: "var(--color-text-faint)" }}
            >
              {contact.note}
            </p>
            <a
              href={contact.cta.href}
              className="btn btn--small btn--accent"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: "var(--space-4)" }}
            >
              {contact.cta.label}
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>{bottom.copyright}</p>
          <div className="footer__legal-links">
            {bottom.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__a11y-notice">
          <p>
            <strong>{NOTICE_LEAD}</strong> {withLinks(noticeBody, noticeLinks)}
          </p>
        </div>
      </div>
    </footer>
  );
}
