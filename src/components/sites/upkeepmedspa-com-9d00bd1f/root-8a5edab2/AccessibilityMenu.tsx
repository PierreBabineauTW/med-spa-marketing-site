"use client";

/**
 * Floating accessibility widget for the UPKEEP Med Spa home page clone.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * The live site builds this overlay at runtime in `accessibility-menu.js`: a
 * fixed bottom-left button that opens a small popover with two persisted
 * preferences (larger text, reduce motion), a reset, a link to the full
 * Accessibility Statement, and the contact details.
 *
 * The markup below is the overlay's DOM captured verbatim
 * (docs/research/.../overlays/a11y-menu.html); every visual style comes from the
 * ported stylesheet (`upkeep.css`) via the captured ids/classes, so this file
 * adds no CSS. The script's behaviour is ported as-is: open/close through the
 * `hidden` attribute with `aria-expanded` in sync, Escape and outside-click
 * dismissal, focus moved to the heading on open, the two `<html>` preference
 * classes, and the same `localStorage` keys.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { AccessibilityIcon } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons";
import { footer } from "@/lib/upkeepmedspa-data";

const LARGE_TEXT_STORAGE_KEY = "upkeep-a11y-large-text";
const REDUCE_MOTION_STORAGE_KEY = "upkeep-a11y-reduce-motion";

const LARGE_TEXT_CLASS = "a11y-large-text";
const REDUCE_MOTION_CLASS = "a11y-reduce-motion";

/* ── preference store ────────────────────────────────────────────────
   The two preferences live in localStorage, outside React, so they are
   read through `useSyncExternalStore`. The server snapshot is `false`, which
   keeps the server markup and the first client render identical; the stored
   value lands right after hydration, so there is no hydration mismatch and no
   branching on storage during render. */

const preferenceListeners = new Set<() => void>();

function notifyPreferenceListeners() {
  for (const listener of preferenceListeners) listener();
}

function subscribeToPreferences(onStoreChange: () => void) {
  preferenceListeners.add(onStoreChange);
  // Keep other tabs of the same site in sync.
  window.addEventListener("storage", onStoreChange);
  return () => {
    preferenceListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/** Every storage access is guarded: private mode / blocked storage throws. */
function readPreference(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writePreference(key: string, enabled: boolean) {
  try {
    if (enabled) window.localStorage.setItem(key, "1");
    else window.localStorage.removeItem(key);
  } catch {
    // Storage unavailable — the preference still applies for this visit.
  }
  notifyPreferenceListeners();
}

function usePreference(key: string): boolean {
  return useSyncExternalStore(
    subscribeToPreferences,
    () => readPreference(key),
    () => false,
  );
}

export function AccessibilityMenu() {
  const largeText = usePreference(LARGE_TEXT_STORAGE_KEY);
  const reduceMotion = usePreference(REDUCE_MOTION_STORAGE_KEY);

  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Re-apply the persisted preferences to <html>; the ported sheet owns the
  // visual result of these classes.
  useEffect(() => {
    document.documentElement.classList.toggle(LARGE_TEXT_CLASS, largeText);
  }, [largeText]);
  useEffect(() => {
    document.documentElement.classList.toggle(REDUCE_MOTION_CLASS, reduceMotion);
  }, [reduceMotion]);

  // The script moves focus to the heading (tabindex="-1") when the panel opens.
  useEffect(() => {
    if (!open) return;
    headingRef.current?.focus();
  }, [open]);

  // Escape and outside-click dismissal, as in the source.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClick);
    };
  }, [open, setOpen]);

  const togglePanel = useCallback(() => {
    setOpen((wasOpen) => !wasOpen);
  }, [setOpen]);

  const handleLargeTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    writePreference(LARGE_TEXT_STORAGE_KEY, event.target.checked);
  }, []);

  const handleReduceMotionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    writePreference(REDUCE_MOTION_STORAGE_KEY, event.target.checked);
  }, []);

  const handleReset = useCallback(() => {
    writePreference(LARGE_TEXT_STORAGE_KEY, false);
    writePreference(REDUCE_MOTION_STORAGE_KEY, false);
  }, []);

  const { contact } = footer;

  return (
    <div id="a11y-menu-root" ref={rootRef}>
      <button
        id="a11y-menu-button"
        ref={buttonRef}
        type="button"
        aria-label="Open accessibility menu"
        aria-expanded={open}
        aria-controls="a11y-menu-panel"
        onClick={togglePanel}
      >
        <AccessibilityIcon width={28} height={28} />
      </button>

      <div
        id="a11y-menu-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="a11y-menu-heading"
        hidden={!open}
      >
        <h2 id="a11y-menu-heading" tabIndex={-1} ref={headingRef}>
          Accessibility
        </h2>
        <p className="a11y-menu__intro">Quick controls for a more comfortable visit.</p>
        <div className="a11y-menu__controls">
          <label className="a11y-menu__toggle">
            <input
              type="checkbox"
              id="a11y-toggle-text"
              checked={largeText}
              onChange={handleLargeTextChange}
            />
            <span className="a11y-menu__toggle-label">Larger text</span>
            <span className="a11y-menu__toggle-switch" aria-hidden="true" />
          </label>
          <label className="a11y-menu__toggle">
            <input
              type="checkbox"
              id="a11y-toggle-motion"
              checked={reduceMotion}
              onChange={handleReduceMotionChange}
            />
            <span className="a11y-menu__toggle-label">Reduce motion</span>
            <span className="a11y-menu__toggle-switch" aria-hidden="true" />
          </label>
          <button type="button" className="a11y-menu__reset" id="a11y-reset" onClick={handleReset}>
            Reset preferences
          </button>
        </div>
        <div className="a11y-menu__divider" role="presentation" />
        <a className="a11y-menu__link" href="/accessibility">
          Read full Accessibility Statement
        </a>
        <div className="a11y-menu__contact">
          <p className="a11y-menu__contact-label">Need help? Contact us:</p>
          <a href={contact.emailHref}>{contact.email}</a>
          <a href={contact.phoneHref}>{contact.phone}</a>
        </div>
      </div>
    </div>
  );
}
