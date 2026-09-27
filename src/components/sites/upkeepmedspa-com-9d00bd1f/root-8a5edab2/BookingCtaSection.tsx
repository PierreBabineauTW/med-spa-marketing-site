/**
 * Booking CTA section — https://upkeepmedspa.com/ (home page).
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Static server component: the entrance reveal is the target's own native CSS
 * (`.fade-in` + `animation-timeline: view()`) and the button inversion is in the
 * ported sheet, so no client JS is needed here.
 *
 * Class names are the target's own, verbatim — `.text-center`, `.mx-auto`,
 * `.mb-4` and `.mb-8` are ported utilities in upkeep.css (lines 1375-1389), not
 * Tailwind. The darkening over the photo is `opacity: 0.3` on
 * `.booking-cta__bg img` (upkeep.css:1224-1229), so no extra overlay element is
 * needed and none is rendered.
 */

import Image from "next/image";

import { bookingCta } from "@/lib/upkeepmedspa-data";

export function BookingCtaSection() {
  return (
    <section className="booking-cta" aria-label="Book your visit">
      <div className="booking-cta__bg">
        <Image
          src={bookingCta.background.src}
          alt={bookingCta.background.alt}
          fill
          sizes="100vw"
        />
      </div>
      <div className="booking-cta__content fade-in">
        <p className="eyebrow text-center">{bookingCta.eyebrow}</p>
        <h2 className="heading-section text-center mb-4">{bookingCta.heading}</h2>
        <p className="body-text text-center mx-auto mb-8">{bookingCta.body}</p>
        <div className="text-center">
          <a
            className="btn btn--filled"
            href={bookingCta.cta.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {bookingCta.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
