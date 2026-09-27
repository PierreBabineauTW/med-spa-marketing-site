/**
 * Home page "Refined Results" intro split, captured verbatim from
 * https://upkeepmedspa.com/ — site-key: upkeepmedspa-com-9d00bd1f
 * page-key: root-8a5edab2
 *
 * Every string, href and image path comes from `intro` in
 * @/lib/upkeepmedspa-data. All visual styling is the ported sheet
 * (upkeep.css) via the class names below, so this file adds no CSS.
 *
 * The entrance reveal is the native scroll-driven animation the ported sheet
 * already defines for `.fade-in`, so this stays a server component with no
 * client JS and no observer.
 */

import Image from "next/image";

import { intro } from "@/lib/upkeepmedspa-data";

export function IntroSection() {
  return (
    <section className="section" aria-label="Signature treatments">
      <div className="container">
        <div className="split fade-in">
          <div>
            <Image
              src={intro.image.src}
              alt={intro.image.alt}
              width={intro.image.width}
              height={intro.image.height}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 660px"
            />
          </div>
          <div>
            <p className="eyebrow">{intro.eyebrow}</p>
            <h2 className="heading-section mb-4">{intro.heading}</h2>
            <p className="body-text mb-6">{intro.body}</p>
            <a className="btn btn--arrow" href={intro.cta.href}>
              {intro.cta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
