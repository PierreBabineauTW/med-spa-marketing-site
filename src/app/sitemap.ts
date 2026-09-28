import type { MetadataRoute } from "next";

import { content } from "@/config/content";
import { site } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Sitemap. Built from config, so adding a service, post or page automatically
 * appears here — there is no second list to keep in sync.
 *
 * `lastModified` is intentionally not fabricated per page; the framework build
 * time is used so the value stays truthful.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(site.routes.services), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl(site.routes.contact), changeFrequency: "yearly", priority: 0.9 },
    { url: absoluteUrl(site.routes.locations), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl(site.routes.about), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl(site.routes.gallery), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl(site.routes.blog), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/events"), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/specials"), changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/financing"), changeFrequency: "yearly", priority: 0.4 },
  ];

  const services: MetadataRoute.Sitemap = content.services.map((s) => ({
    url: absoluteUrl(`/services/${s.slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = content.posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const legal: MetadataRoute.Sitemap = [
    { url: absoluteUrl(site.routes.privacy), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl(site.routes.cancellation), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl(site.routes.safety), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl(site.routes.accessibility), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [...core, ...services, ...posts, ...legal].map((e) => ({ ...e, lastModified: now }));
}
