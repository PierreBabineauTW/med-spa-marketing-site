import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import { CtaBand } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { content } from "@/config/content";
import { JsonLd, breadcrumbSchema, organizationSchema, pageMetadata } from "@/lib/seo";

/**
 * Journal index — /blog
 *
 * The card anatomy is deliberately identical to the home page's
 * `JournalSection` (`.grid-3` → `.blog-card` → `.blog-card__image` /
 * `__content` / `__category` / `__title` / `__excerpt`) so a visitor moving
 * from the home page into the journal sees the same cards they were just
 * looking at, one for one.
 *
 * `content.posts` is the single source of truth: three real entries, rendered
 * as three entries. Nothing is padded out to fill the grid.
 *
 * The page shell (skip link, nav, footer, overlays) lives in the root layout,
 * so this file renders `<main>` only.
 */
export const metadata: Metadata = pageMetadata({
  title: "Journal",
  description:
    "Our journal covers neurotoxins, filler, microneedling and laser in plain language — what each treatment targets and what actually happens at the appointment.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <main id="main-content">
      <JsonLd
        id="ld-blog"
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Expert insights"
        title="Journal"
        intro="A short journal on neurotoxins, filler, microneedling and laser — what each treatment targets, what the appointment involves and what to plan for. Read one before you book, or bring it to your consultation and we will go through it together."
      />

      <section className="section" aria-label="All journal articles">
        <div className="container">
          <div className="grid-3 fade-in">
            {content.posts.map((post) => (
              <a className="blog-card" href={`/blog/${post.slug}`} key={post.slug}>
                <div className="overflow-hidden">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    width={post.image.width}
                    height={post.image.height}
                    className="blog-card__image"
                  />
                </div>
                <div className="blog-card__content">
                  <p className="blog-card__category">{post.category}</p>
                  <h3 className="blog-card__title">{post.title}</h3>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Talk it through"
        title="Want to talk it through?"
        body="Every treatment starts with a consultation. Tell us what you are considering and we will answer the practical questions — what it involves, what it costs and what recovery looks like."
        cta={{ label: "Contact us", href: "/contact" }}
      />
    </main>
  );
}
