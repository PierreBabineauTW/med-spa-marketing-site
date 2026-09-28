"use client";

/**
 * Home page client-testimonial rotator — captured verbatim from
 * https://upkeepmedspa.com/ — site-key: upkeepmedspa-com-9d00bd1f
 * page-key: root-8a5edab2
 *
 * Every class name below is styled by the ported stylesheet (upkeep.css,
 * imported unlayered), so this file introduces no CSS: the fluid
 * `.testimonial__quote` / `.testimonial__stars` clamps, the serif italic
 * quote, the rose-gold accent star colour and the `.fade-in` scroll-driven
 * reveal all come from that sheet.
 *
 * Interaction mirrors the source script exactly (`showTestimonial(i)`):
 * all six `[data-testimonial]` panels stay in the DOM and only the active one
 * is displayed, clicking a `.testimonial-dot` jumps to that panel, and a
 * 6000 ms interval advances `(current + 1) % length`. The swap is an instant
 * `display` toggle — there is deliberately no transition, no fade and no
 * motion library, and the interval is *not* reset by a manual click.
 *
 * `.testimonial-dots`, `.testimonial-dot` and `.testimonial__name` have no
 * rules in the ported sheet: the dot geometry comes from the inline style
 * below (as on the live page) and the active dot's background is switched
 * imperatively by the source's JS, so it is set here as an inline value too.
 */

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { testimonials } from "@/lib/upkeepmedspa-data";

/** Auto-advance cadence of the source's `setInterval`, in ms. */
const ROTATE_INTERVAL_MS = 6000;

/** Non-breaking space — the source writes these as `&nbsp;` in the markup. */
const NBSP = "\u00a0";

/**
 * The source wraps the location separator in non-breaking spaces
 * (`— Henga B. &nbsp;·&nbsp; Brooklyn`) but leaves any later middot alone
 * (`— Michele S. &nbsp;·&nbsp; Dallas · Knox Henderson`), so only the first
 * `" · "` is converted.
 */
function withNonBreakingSeparator(name: string): string {
  return name.replace(" · ", `${NBSP}·${NBSP}`);
}

/**
 * Dot geometry, copied from the live page's inline `style` attribute. Key
 * order matches the source so the serialised `style` attribute reads the
 * same; only `background` differs between states.
 */
const DOT_STYLE: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  border: "1px solid var(--color-accent)",
  background: "transparent",
  cursor: "pointer",
  padding: 0,
};

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.items.length;

  useEffect(() => {
    if (!total) return;
    const timer = window.setInterval(() => {
      setCurrent((previous) => (previous + 1) % total);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [total]);

  return (
    <section className="section" aria-label="Client testimonials">
      <div className="container text-center">
        <p className="eyebrow fade-in">{testimonials.eyebrow}</p>
        <h2 className="heading-section mb-4 fade-in">{testimonials.heading}</h2>
        <p
          className="fade-in"
          style={{
            fontSize: "var(--text-sm)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-8)",
          }}
        >
          <span style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}>
            ★★★★★
          </span>
          {`${NBSP}${NBSP}5.0 average across verified reviews`}
        </p>

        <div className="fade-in" style={{ maxWidth: "760px", margin: "0 auto" }}>
          {testimonials.items.map((item, index) => (
            <div
              key={item.name}
              data-testimonial={index}
              style={{ display: index === current ? undefined : "none" }}
            >
              <div
                className="testimonial__stars"
                aria-label="5 out of 5 stars"
                style={{ color: "var(--color-accent)", letterSpacing: "0.15em" }}
              >
                {item.stars}
              </div>
              <blockquote className="testimonial__quote">{item.quote}</blockquote>
              <p className="testimonial__name">{withNonBreakingSeparator(item.name)}</p>
            </div>
          ))}

          <div
            className="testimonial-dots"
            style={{
              marginTop: "var(--space-8)",
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-2)",
              flexWrap: "wrap",
            }}
          >
            {testimonials.items.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className="testimonial-dot"
                data-dot={index}
                aria-label={`Show testimonial ${index + 1}`}
                /* Marks the visible panel's dot. The 10px circle is the visual;
                   this drives the coarse-pointer target in polish.css, where the
                   inline background below is suppressed. */
                aria-current={index === current ? "true" : undefined}
                onClick={() => setCurrent(index)}
                style={{
                  ...DOT_STYLE,
                  background: index === current ? "var(--color-accent)" : "transparent",
                }}
              />
            ))}
          </div>

          {/*
            Review-attribution line, inline-styled exactly as captured. Copy and
            the Yelp link both come from `testimonials.note`; the two
            non-breaking spaces around the middot are part of `note.after`.
          */}
          <p
            style={{
              marginTop: "var(--space-6)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
            }}
          >
            {`${testimonials.note.before} `}
            <a
              href={testimonials.note.link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--color-text-muted)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {testimonials.note.link.label}
            </a>
            {testimonials.note.after}
          </p>
        </div>
      </div>
    </section>
  );
}
