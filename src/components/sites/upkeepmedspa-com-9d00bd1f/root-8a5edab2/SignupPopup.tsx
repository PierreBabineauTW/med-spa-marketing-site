"use client";

/**
 * Newsletter signup modal for the UPKEEP Med Spa home page clone.
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Ported verbatim from the live site's runtime-injected markup and inline
 * script. The target injects this dialog hidden on load and auto-opens it after
 * a delay; all visual styling comes from the ported stylesheet (`upkeep.css`)
 * via the class names below, so this file adds no CSS. The open state is
 * driven entirely by the `is-open` class, which the ported sheet transitions on.
 *
 * Two deliberate deviations from the source, both noted in the data types:
 *  - Submission never hits the network. The source posts to a Mailchimp JSONP
 *    endpoint, a real backend that is out of scope for a clone, so a valid
 *    non-empty email simply swaps in the success block. `novalidate` is kept
 *    (as in the source) and the required-email check is done by hand.
 *  - Close targets are wired the way the source wires them — a delegated
 *    `querySelectorAll('[data-signup-close]')` pass over native click
 *    listeners — which also keeps the non-interactive backdrop out of the
 *    accessibility tree, exactly as the source leaves it.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { CloseIcon } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/icons";
import { signupPopup } from "@/lib/upkeepmedspa-data";
import { cn } from "@/lib/utils";

/** Which of the two stacked blocks is showing inside the card. */
type SignupView = "form" | "success";

/** Matches the source: the email field is focused once the fade-in settles. */
const FOCUS_DELAY_MS = 250;

export function SignupPopup() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<SignupView>("form");

  const rootRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const openPopup = useCallback(() => {
    const active = document.activeElement;
    lastFocusRef.current = active instanceof HTMLElement ? active : null;
    setOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(
        signupPopup.storageKey,
        `dismissed:${Date.now()}`,
      );
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The source
      // swallows this too — the popup then re-opens on the next visit.
    }
    lastFocusRef.current?.focus();
  }, []);

  // Close triggers: backdrop, close button and the success state's Close button.
  // Queried once on mount, mirroring the source's `data-signup-close` pass.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const closers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-signup-close]"),
    );
    for (const closer of closers) {
      closer.addEventListener("click", closePopup);
    }
    return () => {
      for (const closer of closers) {
        closer.removeEventListener("click", closePopup);
      }
    };
  }, [closePopup]);

  // Auto-open (only for visitors who have never dismissed it) plus the
  // delegated manual trigger. The storage read happens here, never during
  // render, so SSR and hydration are unaffected.
  useEffect(() => {
    const onTriggerClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target?.closest("[data-open-signup]")) return;
      event.preventDefault();
      openPopup();
    };
    document.addEventListener("click", onTriggerClick);

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(signupPopup.storageKey);
    } catch {
      stored = null;
    }

    const autoOpenTimer = stored
      ? undefined
      : setTimeout(openPopup, signupPopup.autoOpenDelayMs);

    return () => {
      document.removeEventListener("click", onTriggerClick);
      if (autoOpenTimer !== undefined) clearTimeout(autoOpenTimer);
    };
  }, [openPopup]);

  // While open: lock body scroll, close on Escape, and move focus to the email
  // field. The teardown releases the scroll lock and cancels the pending focus.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      emailRef.current?.focus();
    }, FOCUS_DELAY_MS);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      clearTimeout(focusTimer);
    };
  }, [open, closePopup]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // The Mailchimp JSONP post is intentionally not reproduced: there is no
    // backend in the clone and no request should leave the browser.
    event.preventDefault();

    const email = emailRef.current;
    if (!email || email.value.trim() === "") {
      email?.focus();
      email?.reportValidity();
      return;
    }
    setView("success");
  };

  const [formTitleLine1, formTitleLine2] = signupPopup.titleLines;
  const [successTitleLine1, successTitleLine2] = signupPopup.success.titleLines;

  return (
    <div
      ref={rootRef}
      id="signupPopup"
      className={cn("signup-popup", open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signupHeading"
      aria-hidden={!open}
    >
      <div className="signup-popup__backdrop" data-signup-close />

      <div className="signup-popup__card" role="document">
        <button
          type="button"
          className="signup-popup__close"
          data-signup-close
          aria-label="Close"
        >
          <CloseIcon width={18} height={18} />
        </button>

        <div
          className="signup-popup__inner"
          data-signup-state="form"
          hidden={view === "success"}
        >
          <p className="eyebrow signup-popup__eyebrow">
            {signupPopup.eyebrow}
          </p>
          <h2 id="signupHeading" className="signup-popup__title">
            {formTitleLine1}
            <br />
            {formTitleLine2}
          </h2>
          <p className="signup-popup__lede">{signupPopup.lede}</p>

          <form
            className="signup-popup__form"
            name="signup_form"
            noValidate
            onSubmit={handleSubmit}
          >
            <label className="signup-popup__label" htmlFor="signupEmail">
              <span>
                {signupPopup.emailLabel}{" "}
                <span aria-hidden="true" className="signup-popup__req">
                  *
                </span>
              </span>
              <input
                ref={emailRef}
                type="email"
                id="signupEmail"
                name="email"
                autoComplete="email"
                required
                placeholder={signupPopup.emailPlaceholder}
              />
            </label>

            <label className="signup-popup__label" htmlFor="signupPhone">
              <span>
                {signupPopup.phoneLabel}{" "}
                <span className="signup-popup__optional">
                  {signupPopup.phoneOptionalLabel}
                </span>
              </span>
              <input
                type="tel"
                id="signupPhone"
                name="phone"
                autoComplete="tel"
                placeholder={signupPopup.phonePlaceholder}
              />
            </label>

            <button
              type="submit"
              className="btn btn--filled signup-popup__submit"
            >
              {signupPopup.submitLabel}
            </button>

            <p className="signup-popup__fineprint">
              {signupPopup.fineprint}
            </p>
          </form>
        </div>

        <div
          className="signup-popup__inner signup-popup__inner--success"
          data-signup-state="success"
          hidden={view !== "success"}
        >
          <p className="eyebrow signup-popup__eyebrow">
            {signupPopup.success.eyebrow}
          </p>
          <h2 className="signup-popup__title">
            {successTitleLine1}
            <br />
            {successTitleLine2}
          </h2>
          <p className="signup-popup__lede">{signupPopup.success.lede}</p>
          <button type="button" className="btn" data-signup-close>
            {signupPopup.success.closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
