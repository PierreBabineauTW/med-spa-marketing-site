import type { NextConfig } from "next";

/**
 * ---------------------------------------------------------------------------
 * HTTP security headers
 * ---------------------------------------------------------------------------
 *
 * Only headers that are safe, useful and verifiable from inside this repository
 * are set here. They apply to every response, including static assets.
 *
 * A Content-Security-Policy is deliberately NOT set. It needs deployment
 * knowledge this repository does not have:
 *
 *   - the Next.js App Router emits inline bootstrap scripts, so `script-src`
 *     needs either `'unsafe-inline'` (defeats the purpose) or a per-request
 *     nonce, which requires `middleware.ts` and forces dynamic rendering;
 *   - 20 inline `style` attributes remain in 8 component files (mostly the
 *     ported testimonial carousel, which sets colour and visibility
 *     imperatively), so `style-src` needs `'unsafe-inline'. Counted by
 *     `node scripts/audit-inline-styles.mjs`, not estimated;
 *   - the contact form's destination is operator-supplied via
 *     `CONTACT_WEBHOOK_URL`, so `connect-src` cannot be known at build time.
 *
 * Guessing here would either break the site or ship a policy with no teeth.
 * TEMPLATE_GUIDE.md documents the recommended policy and the nonce trade-off so
 * it can be enabled deliberately once the real integrations are known.
 */
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Nothing here needs camera, microphone, geolocation or payment access.
    // `interest-cohort` is deprecated and deliberately not requested.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  // `output: "standalone"` bundles a minimal server with its own node_modules.
  // scripts/qa-headers.mjs asserts these headers are really sent by the
  // standalone build, so a change here that silently drops them fails QA.
  output: "standalone",

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  poweredByHeader: false,
};

export default nextConfig;
