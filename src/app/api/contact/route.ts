/**
 * ---------------------------------------------------------------------------
 * POST /api/contact
 * ---------------------------------------------------------------------------
 *
 * The contact form's only server-side endpoint. It is deliberately boring:
 * `fetch`, `AbortSignal.timeout`, and `Response.json`. No dependencies.
 *
 * THE HONESTY CONTRACT
 *
 * This endpoint must never report a delivery that did not happen. Concretely:
 *
 *   - A submission is only `{ ok: true }` when a mail provider actually
 *     accepted it (2xx from `CONTACT_WEBHOOK_URL`).
 *   - When no provider is configured, it says so with `503` and
 *     `code: "not_configured"`. The UI is required to surface that verbatim
 *     rather than showing a thank-you. This is the single most important
 *     branch in the file.
 *   - When the provider is configured but fails, it says `502` — a real
 *     delivery attempt that did not land, which is not the same as "no
 *     provider".
 *
 * The client component owns whether to show a success state; this file only
 * decides which of those states is true.
 *
 * NOTHING IS ECHOED
 *
 * The message body, email address and phone number are never logged and never
 * returned to the client. Error messages name the field that needs attention
 * because a visitor cannot fix what they cannot see, but they never quote the
 * value back.
 */

/** Explicitly dynamic: this must never be prerendered or statically cached. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LIMITS = {
  nameMin: 2,
  nameMax: 120,
  emailMax: 200,
  phoneMax: 40,
  messageMin: 10,
  messageMax: 5000,
} as const;

/** Deliberately permissive but not a rubber stamp: one @, no spaces, a TLD. */
const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\]+@[^\s@,;:<>()[\]\\]+\.[A-Za-z]{2,}$/;

/** Upstream must answer within this or we treat it as a failure. */
const UPSTREAM_TIMEOUT_MS = 8000;

/**
 * Honeypot field names.
 *
 * A bot that fills a hidden field is answered exactly as a person would be
 * (`200 { ok: true }`) while nothing is forwarded anywhere. Telling a bot it
 * was caught just teaches it to retry without the field.
 *
 * `company_website` is the field the site's `ContactForm` posts under; the
 * others are accepted so a future form that picked a different name is still
 * protected rather than silently passing every bot through.
 */
const HONEYPOT_FIELDS = [
  "company_website",
  "company",
  "website",
  "fax",
  "nickname",
  "honeypot",
] as const;

type ValidatedSubmission = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ValidationResult =
  | { ok: true; data: ValidatedSubmission }
  | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read an arbitrary JSON value as a trimmed string without throwing. */
function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return Response.json(body, { status, headers });
}

function isHoneypotTripped(body: Record<string, unknown>): boolean {
  return HONEYPOT_FIELDS.some((field) => readString(body, field).length > 0);
}

/**
 * Parse the request body without ever throwing.
 *
 * The body is entirely attacker-controlled, so a bad payload is a normal
 * outcome to handle rather than an exception. Non-objects (arrays, strings,
 * numbers, null) are treated as an empty object and fail validation normally.
 */
function parseBody(raw: unknown): Record<string, unknown> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  return raw as Record<string, unknown>;
}

/**
 * Server-side validation. The client is not trusted: it may be stale, broken,
 * or absent entirely.
 */
function validate(body: Record<string, unknown>): ValidationResult {
  const name = readString(body, "name");
  if (!name) {
    return { ok: false, error: "Please tell us your name so we know who to reply to." };
  }
  if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) {
    return {
      ok: false,
      error: `Your name should be between ${LIMITS.nameMin} and ${LIMITS.nameMax} characters.`,
    };
  }

  const email = readString(body, "email");
  if (!email) {
    return { ok: false, error: "We need an email address to reply to." };
  }
  if (email.length > LIMITS.emailMax || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "That email address does not look right. Please check it." };
  }

  const phone = readString(body, "phone");
  if (phone.length > LIMITS.phoneMax) {
    return { ok: false, error: "That phone number is too long to be a real number." };
  }

  const message = readString(body, "message");
  if (!message) {
    return { ok: false, error: "Your message is empty, so there is nothing to send." };
  }
  if (message.length < LIMITS.messageMin) {
    return { ok: false, error: "Please add a little more detail to your message." };
  }
  if (message.length > LIMITS.messageMax) {
    return {
      ok: false,
      error: `Your message is too long — please keep it under ${LIMITS.messageMax} characters.`,
    };
  }

  return { ok: true, data: { name, email, phone, message } };
}

/**
 * The configured endpoint, or null.
 *
 * A missing value and a value that is not a usable http(s) URL are treated
 * identically, because both mean "nothing is wired up" and both deserve the
 * same honest 503. The value is never logged: webhook URLs usually carry a
 * secret token in the path or query string.
 */
function readWebhookUrl(): string | null {
  const configured = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!configured) return null;

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  return url.toString();
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

/** Everything other than POST is refused, and says so plainly. */
export function GET(): Response {
  return json(
    { ok: false, error: "Method not allowed" },
    405,
    { Allow: "POST" },
  );
}

export async function POST(request: Request): Promise<Response> {
  // 1. Read the body defensively. Anything unparseable becomes an empty object
  //    and is rejected by validation below with a message a person can act on.
  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return json(
      { ok: false, error: "We could not read that submission. Please try again." },
      400,
    );
  }
  const body = parseBody(parsed);

  // 2. Honeypot. Answered exactly as a genuine submission would be, and
  //    nothing is forwarded. Never reveal the trap.
  if (isHoneypotTripped(body)) {
    return json({ ok: true }, 200);
  }

  // 3. Validate what the visitor actually typed.
  const result = validate(body);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 400);
  }

  // 4. Is anything listening? If not, say so — do not fake a delivery.
  const webhookUrl = readWebhookUrl();
  if (!webhookUrl) {
    return json(
      {
        ok: false,
        code: "not_configured",
        error:
          "This form is not connected to a mail provider yet. Please email or call us directly.",
      },
      503,
    );
  }

  // 5. Forward. Only the validated, trimmed values are sent — the raw body is
  //    never passed through, so nothing unexpected reaches the provider.
  const { name, email, phone, message } = result.data;
  const payload: Record<string, unknown> = {
    name,
    email,
    message,
    submittedAt: new Date().toISOString(),
    source: "website-contact-form",
  };
  if (phone) payload.phone = phone;

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!upstream.ok) {
      // A non-2xx means the provider did not accept the message. That is a
      // failed delivery, so it is reported as one.
      return json(
        {
          ok: false,
          code: "upstream_error",
          error:
            "We could not send your message just now. Please try again or contact us directly.",
        },
        502,
      );
    }
  } catch {
    // Timeout, DNS failure, TLS error, connection refused — all of them mean
    // the message did not arrive, and all of them get the same honest answer.
    return json(
      {
        ok: false,
        code: "upstream_error",
        error:
          "We could not send your message just now. Please try again or contact us directly.",
      },
      502,
    );
  }

  // The provider accepted it. Only now is a success true.
  return json({ ok: true }, 200);
}
