"use client";

/**
 * Marketing cookie consent bar for the UPKEEP Med Spa home page clone.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Ported verbatim from the live site's runtime-injected `consent-banner.js`
 * markup. All visual styling comes from the ported stylesheet (`upkeep.css`,
 * imported unlayered from src/app/globals.css) via `#upkeep-consent-banner`
 * and the `upkeep-consent__*` class names below — this file adds no CSS.
 *
 * Behaviour mirrored from the source script:
 * - visible on load (no delay, no scroll trigger);
 * - either button records the choice in `localStorage` under
 *   `consentBanner.storageKey` and removes the bar for good, so a later visit
 *   does not see it again;
 * - `localStorage` is touched inside `try/catch` because private-mode Safari
 *   throws on access and the source tolerates that failure.
 *
 * No focus trap, no Escape handling, no scroll lock: this is a passive bar, and
 * the privacy-policy link inside it navigates normally. Hover states on both
 * buttons are CSS-only in the sheet.
 */

import { useState, useSyncExternalStore } from "react";

import { consentBanner } from "@/lib/upkeepmedspa-data";
import { cn } from "@/lib/utils";

type ConsentChoice = "accepted" | "declined";

/**
 * The persisted answer is external to React, so it is read as an external store
 * snapshot: the server snapshot hides the bar during SSR and hydration, and the
 * client snapshot reveals it once the visitor's storage has been read. That
 * ordering is what keeps a returning visitor's markup from mismatching, and it
 * avoids a setState-in-effect cascade. A primitive is cached fine, so returning
 * a boolean never trips the snapshot-identity check.
 */
function getConsentSnapshot(): boolean {
  try {
    return window.localStorage.getItem(consentBanner.storageKey) === null;
  } catch {
    // Storage blocked (private mode, disabled cookies): ask anyway.
    return true;
  }
}

/** Nothing pushes changes into this store; only the visitor's own click does. */
function subscribeToConsent(): () => void {
  return () => {};
}

const getServerSnapshot = (): boolean => false;

export function ConsentBanner() {
  const awaitingAnswer = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerSnapshot,
  );
  // Kept in React state rather than derived from the snapshot so a click still
  // hides the bar immediately when the write to storage fails.
  const [dismissed, setDismissed] = useState(false);

  const decide = (choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(consentBanner.storageKey, choice);
    } catch {
      // Nothing to persist to; the choice applies to this visit only.
    }
    setDismissed(true);
  };

  if (dismissed || !awaitingAnswer) return null;

  return (
    <div
      id="upkeep-consent-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="upkeep-consent__inner">
        <p className="upkeep-consent__text">
          {consentBanner.before}
          <a href={consentBanner.link.href}>{consentBanner.link.label}</a>
          {consentBanner.after}
        </p>
        <div className="upkeep-consent__actions">
          <button
            type="button"
            className={cn("upkeep-consent__btn", "upkeep-consent__btn--secondary")}
            data-consent="decline"
            onClick={() => decide("declined")}
          >
            {consentBanner.declineLabel}
          </button>
          <button
            type="button"
            className={cn("upkeep-consent__btn", "upkeep-consent__btn--primary")}
            data-consent="accept"
            onClick={() => decide("accepted")}
          >
            {consentBanner.acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
