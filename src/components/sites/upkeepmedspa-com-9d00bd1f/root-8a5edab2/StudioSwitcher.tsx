"use client";

import { useEffect, useState } from "react";

import { content } from "@/config/content";
import { site } from "@/config/site";

/**
 * Studio switcher — built from the reference site's own `.loc-region-tabs`,
 * `.loc-pill` and `.loc-card` styles (ported in upkeep.css), so it looks like it
 * was designed with the rest of the site.
 *
 * INTERACTION MODEL: click-driven, with three levels of narrowing —
 * region tab (New York / Texas) → studio pill → full studio card. No scroll
 * driving, no timers.
 *
 * Honesty rules baked in: a studio with no configured phone, hours or map URL
 * simply omits that row rather than showing a placeholder value.
 */
export function StudioSwitcher() {
  const [region, setRegion] = useState<string>(content.regions[0].id);
  const [studioId, setStudioId] = useState<string>(content.studios[0].id);

  const studiosInRegion = content.studios.filter((s) => s.region === region);
  const active = content.studios.find((s) => s.id === studioId) ?? studiosInRegion[0];

  function pickRegion(next: string) {
    setRegion(next);
    const first = content.studios.find((s) => s.region === next);
    if (first) setStudioId(first.id);
  }

  // Deep links. The home page, the nav dropdown and the footer all point at
  // /locations#<id>, so a shared link has to open the right card rather than
  // silently landing on the first one. Read on mount and on hash change.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const match = content.studios.find((s) => s.id === id);
      if (!match) return;
      setRegion(match.region);
      setStudioId(match.id);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <>
      <div className="loc-region-tabs" role="tablist" aria-label="Filter studios by region">
        {content.regions.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={region === r.id}
            className={`loc-region-tab${region === r.id ? " loc-region-tab--active" : ""}`}
            onClick={() => pickRegion(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="loc-pills" role="tablist" aria-label="Choose a studio">
        {studiosInRegion.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active.id === s.id}
            className={`loc-pill${active.id === s.id ? " loc-pill--active" : ""}`}
            onClick={() => setStudioId(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <article className="loc-card loc-card--active" id={active.id} role="tabpanel" aria-label={active.name}>
        <div className="loc-card__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={active.image.src} alt={active.image.alt} width={active.image.width} height={active.image.height} />
        </div>

        <div className="loc-card__details">
          <h2 className="loc-card__name">
            {active.name} <span className="loc-card__sub">{active.city}</span>
          </h2>

          <div className="loc-card__meta">
            <div className="loc-card__row">
              <span className="loc-card__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span>
                <span className="loc-card__address">{active.address}</span>
                <br />
                <span className="loc-card__city">{active.city}</span>
              </span>
            </div>

            {active.phone ? (
              <div className="loc-card__row">
                <span className="loc-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
                  </svg>
                </span>
                <a className="loc-card__phone" href={`tel:${active.phone.replace(/[^\d+]/g, "")}`}>
                  {active.phone}
                </a>
              </div>
            ) : null}

            {active.hours || content.hours ? (
              <div className="loc-card__row">
                <span className="loc-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </span>
                <span className="loc-card__hours">
                  {active.hours ?? (content.hours ?? []).map((h) => `${h.label}: ${h.value}`).join(" · ")}
                </span>
              </div>
            ) : null}
          </div>

          <div className="loc-card__actions">
            <a
              className="btn btn--accent"
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Now
            </a>
            {active.mapUrl ? (
              <a className="btn btn--small" href={active.mapUrl} target="_blank" rel="noopener noreferrer">
                Directions
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </>
  );
}
