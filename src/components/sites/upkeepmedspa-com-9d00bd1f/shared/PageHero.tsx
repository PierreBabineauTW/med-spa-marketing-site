import type { ReactNode } from "react";

/**
 * PageHero — the subpage header, built from the reference site's own
 * `.page-hero` styles (ported in upkeep.css) so every subpage header matches
 * the home page hero's visual language.
 *
 * `.page-hero` is a solid dark band with an optional image dimmed to
 * `brightness(0.4)`, centred content capped at `--content-narrow` (680px), and
 * the H1 dropped to `--text-2xl` by `.page-hero .heading-hero`.
 */
type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Optional background image; the sheet dims it automatically. */
  image?: { src: string; alt: string };
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, image, children }: PageHeroProps) {
  return (
    <header className="page-hero">
      {image ? (
        <div className="page-hero__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt="" />
        </div>
      ) : null}
      <div className="page-hero__content">
        {eyebrow ? <p className="eyebrow text-center">{eyebrow}</p> : null}
        <h1 className="heading-hero text-center">{title}</h1>
        {intro ? <p className="body-text text-center mx-auto mb-8">{intro}</p> : null}
        {children}
      </div>
    </header>
  );
}
