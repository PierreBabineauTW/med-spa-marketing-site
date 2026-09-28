import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * robots.txt
 *
 * The whole site is indexable. Only the API endpoint and the 404 are excluded —
 * there is nothing here a crawler should not reach, because every page carries
 * real, crawlable HTML.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
