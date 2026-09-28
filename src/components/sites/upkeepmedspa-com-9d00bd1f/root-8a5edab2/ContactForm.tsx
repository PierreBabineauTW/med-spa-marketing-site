"use client";

/**
 * ---------------------------------------------------------------------------
 * Contact form — /contact
 * ---------------------------------------------------------------------------
 *
 * A real client component because it owns the request state. The page that
 * renders it stays a server component, so it keeps its `metadata` export and
 * the sheet's `.page-hero` markup arrives fully rendered.
 *
 * STATES
 *   idle        → the form, with the submit button live
 *   submitting  → same form, button disabled and relabelled "Sending…"
 *   success     → the form is replaced by a confirmation (and can be reset)
 *   error       → the form stays, with an inline `role="alert"` message
 *
 * THE HONESTY RULE THAT MATTERS HERE
 * A success screen is only ever rendered from `res.ok`. If the server refuses
 * the message — including the 503 the endpoint returns while no delivery
 * transport is configured — the server's own explanation is shown instead, and
 * the page says plainly that nothing was sent. There is no optimistic success
 * and no simulated send anywhere in this file.
 *
 * STYLING
 * No new CSS. The ported sheet's own form language is `.signup-popup__*`
 * (`.signup-popup__form` for the stack and the underlined inputs, `__label`
 * for the visible uppercase label, `__req` / `__optional` for the required and
 * optional markers, `__fineprint` for the small print), so the contact form
 * and the newsletter dialog are visibly the same form. `.btn btn--filled` is
 * the same submit treatment used across the site.
 */

import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";

import { site } from "@/config/site";

/** Where the form posts. The route is owned by the API layer, not by this file. */
const ENDPOINT = "/api/contact";

/** Field names. Also the keys sent in the JSON body. */
const FIELD = {
  name: "name",
  email: "email",
  phone: "phone",
  message: "message",
  /** Honeypot: bots fill it, humans never see it, the API is expected to drop it. */
  honeypot: "company_website",
} as const;

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The ported sheet styles `.signup-popup__form input` but ships no `textarea`
 * rule, so a raw <textarea> falls back to the browser's white box on a dark
 * page. This mirrors that rule token-for-token using the sheet's own custom
 * properties. `outline` is deliberately left alone so the sheet's global
 * `textarea:focus-visible` ring still applies.
 */
const textareaStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(245, 240, 235, 0.22)",
  padding: "var(--space-3) 0",
  color: "var(--color-text)",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-base)",
  letterSpacing: "normal",
  textTransform: "none",
  borderRadius: 0,
  resize: "vertical",
};

/**
 * Reads a human-readable message out of a response body without assuming the
 * shape: the endpoint may answer with `{ message }`, with `{ error }`, or with a
 * bare string. Returns null when there is nothing usable, so the caller falls
 * back to wording it can stand behind.
 */
function readServerMessage(body: unknown): string | null {
  if (typeof body === "string") return body.trim() || null;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["message", "error"] as const) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return null;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitting = status === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    /*
     * Read the payload synchronously, before the first `await`. Once the
     * handler yields, the synthetic event is done and `currentTarget` is gone.
     */
    const form = event.currentTarget;
    const data = new FormData(form);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    const payload = {
      name: field(FIELD.name),
      email: field(FIELD.email),
      phone: field(FIELD.phone),
      message: field(FIELD.message),
      [FIELD.honeypot]: field(FIELD.honeypot),
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // A body that is missing, empty or not JSON is not a reason to invent a
      // message, and it is not a reason to treat the send as a success.
      let serverMessage: string | null = null;
      try {
        serverMessage = readServerMessage(await res.json());
      } catch {
        serverMessage = null;
      }

      if (res.ok) {
        setStatus("success");
        return;
      }

      setStatus("error");
      setErrorMessage(
        serverMessage ??
          `Your message was not sent — the server replied with status ${res.status}. Nothing has been delivered.`,
      );
    } catch {
      setStatus("error");
      setErrorMessage(
        "Your message was not sent: the server could not be reached. Check your connection and try again, or call us instead.",
      );
    }
  }

  return (
    /*
     * The outer `.signup-popup__form` is what keeps the `role="status"` live
     * region mounted across the form → confirmation swap. A live region
     * inserted into the DOM together with its text is announced unreliably; one
     * that is already present and only has its text changed is not.
     */
    <div className="signup-popup__form">
      <p role="status" className="sr-only">
        {status === "success"
          ? "Your message was sent. We will reply using the details you gave us."
          : ""}
      </p>

      {status === "success" ? (
        <div>
          <p className="eyebrow">Message sent</p>
          <h3 className="heading-section mb-4">Thanks — that reached us.</h3>
          <p className="body-text mb-6">
            It has landed with the studio team. We will come back to you using
            the details you gave us, and we will ask if anything is unclear
            before you book anything.
          </p>
          <p className="body-text mb-6">
            If you would rather not wait, call{" "}
            <a href={site.contact.phoneHref}>{site.contact.phone}</a> or email{" "}
            <a href={site.contact.emailHref}>{site.contact.email}</a>.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setErrorMessage(null);
              setStatus("idle");
            }}
          >
            Send another message
          </button>
        </div>
      ) : (
        /*
         * `action` + `method` are real, not decorative: without JavaScript the
         * browser still posts to the same endpoint rather than back to the page.
         */
        <form
          className="signup-popup__form"
          method="post"
          action={ENDPOINT}
          onSubmit={handleSubmit}
          aria-busy={submitting}
        >
          {/*
            Honeypot. `aria-hidden` keeps it out of the accessibility tree and
            `tabIndex={-1}` stops it being focusable, which is what makes
            hiding it from assistive tech legitimate. `.sr-only` clips it and the
            `left` offset takes it fully off-screen.
          */}
          <div
            className="sr-only"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px" }}
          >
            <label htmlFor="contact-website">
              Leave this field empty
            </label>
            <input
              id="contact-website"
              name={FIELD.honeypot}
              type="text"
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          <label className="signup-popup__label" htmlFor="contact-name">
            <span>
              Your name{" "}
              <span aria-hidden="true" className="signup-popup__req">
                *
              </span>
            </span>
            <input
              id="contact-name"
              name={FIELD.name}
              type="text"
              autoComplete="name"
              required
            />
          </label>

          <label className="signup-popup__label" htmlFor="contact-email">
            <span>
              Email address{" "}
              <span aria-hidden="true" className="signup-popup__req">
                *
              </span>
            </span>
            <input
              id="contact-email"
              name={FIELD.email}
              type="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="signup-popup__label" htmlFor="contact-phone">
            <span>
              Phone number{" "}
              <span className="signup-popup__optional">optional</span>
            </span>
            <input
              id="contact-phone"
              name={FIELD.phone}
              type="tel"
              autoComplete="tel"
            />
          </label>

          <label className="signup-popup__label" htmlFor="contact-message">
            <span>
              Your message{" "}
              <span aria-hidden="true" className="signup-popup__req">
                *
              </span>
            </span>
            <textarea
              id="contact-message"
              name={FIELD.message}
              rows={5}
              required
              aria-describedby="contact-message-hint"
              style={textareaStyle}
            />
          </label>
          <p id="contact-message-hint" className="signup-popup__fineprint">
            Tell us which studio and which treatment you have in mind, and
            anything practical we should know — dates you are working around,
            questions you want answered, and how you would prefer to be
            contacted.
          </p>

          {/*
            The alert is always in the DOM. While there is no error it is
            `.sr-only`, so the live region exists but takes up no space; the
            swap to a visible paragraph and the arrival of the text happen in
            the same commit, which is what makes screen readers announce it.
          */}
          <p
            role="alert"
            className={errorMessage ? "body-text" : "sr-only"}
            style={errorMessage ? { color: "var(--color-accent)" } : undefined}
          >
            {errorMessage ?? ""}
            {errorMessage ? (
              <>
                {" "}
                You can also call{" "}
                <a href={site.contact.phoneHref}>{site.contact.phone}</a>.
              </>
            ) : null}
          </p>

          <button
            type="submit"
            className="btn btn--filled"
            disabled={submitting}
            style={
              submitting ? { opacity: 0.6, cursor: "not-allowed" } : undefined
            }
          >
            {submitting ? "Sending…" : "Send message"}
          </button>

          <p className="signup-popup__fineprint">
            We use what you send here only to reply to you. Nothing on this form
            is an appointment — booking happens once you have spoken to us.
          </p>
        </form>
      )}
    </div>
  );
}
