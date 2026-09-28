import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import {
  Breadcrumbs,
  CtaBand,
  SectionHeading,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { content } from "@/config/content";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
  pageMetadata,
} from "@/lib/seo";

/**
 * Journal article — /blog/[slug]
 *
 * One code path, one header treatment: `.page-hero` via the shared `PageHero`,
 * the same band every other subpage opens with, with the post image dimmed
 * behind it. The alternative in the sheet (`.blog-post-hero`) is the reference
 * site's own article masthead, but mixing the two would make this page look
 * different from the subpages it sits next to, so `PageHero` is used
 * consistently.
 *
 * Honesty: every post in `content.posts` is currently flagged `sample: true`,
 * so a visible notice is rendered above the body. The notice is what stops a
 * half-written template page reading as finished copy.
 *
 * `params` is a Promise in Next 16, so it is awaited in both `generateMetadata`
 * and the page itself. An unknown slug 404s rather than rendering an empty
 * article.
 *
 * The page shell lives in the root layout, so this file renders `<main>` only.
 */

type PostParams = { params: Promise<{ slug: string }> };

/** Only real posts are pre-rendered; everything else falls through to notFound(). */
export function generateStaticParams() {
  return content.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostParams): Promise<Metadata> {
  const { slug } = await params;
  const post = content.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: PostParams) {
  const { slug } = await params;
  const post = content.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = content.posts.filter((p) => p.slug !== post.slug);
  const path = `/blog/${post.slug}`;

  return (
    <main id="main-content">
      <JsonLd
        id="ld-post"
        data={[
          // No datePublished or author: neither is configured, and inventing
          // them would be a fabricated claim about a real publication.
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path,
            image: { url: post.image.src },
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Journal", path: "/blog" },
            { name: post.title, path },
          ]),
        ]}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        intro={post.excerpt}
        image={post.image}
      />

      <div className="section section--tight">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Journal", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article className="section section--tight">
        <div className="container container--narrow">
          {post.sample ? (
            <aside className="menu-highlight" aria-label="Sample content notice">
              <p className="eyebrow">Sample article</p>
              <p className="body-text">
                The copy below is placeholder text written to hold this page&apos;s
                layout in place. Replace it with your own writing — and set
                sample to false in src/config/content.ts — before this page goes
                live.
              </p>
            </aside>
          ) : null}

          <div className="blog-post-content">
            {post.body.map((block, i) => {
              if (block.type === "ul") {
                return (
                  <ul key={`${block.type}-${i}`}>
                    {(block.items ?? []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (!block.text) return null;
              return block.type === "h3" ? (
                <h3 key={`${block.type}-${i}`}>{block.text}</h3>
              ) : (
                <p key={`${block.type}-${i}`}>{block.text}</p>
              );
            })}
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="section section--tight" aria-label="More from the journal">
          <div className="container">
            <SectionHeading
              eyebrow="Expert insights"
              title="More from the journal"
              align="center"
            />
            <div
              className="flex items-center justify-center gap-4"
              style={{ flexWrap: "wrap" }}
            >
              {related.map((other) => (
                <a
                  className="btn btn--small btn--arrow"
                  href={`/blog/${other.slug}`}
                  key={other.slug}
                  // `.btn` is `white-space: nowrap`; post titles are long enough
                  // to overflow a phone viewport, so the label wraps instead.
                  style={{ whiteSpace: "normal" }}
                >
                  {other.title}
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        eyebrow="Talk it through"
        title="Want to talk it through?"
        body="Every treatment starts with a consultation. Tell us what you are considering and we will answer the practical questions — what it involves, what it costs and what recovery looks like."
        cta={{ label: "Contact us", href: "/contact" }}
      />
    </main>
  );
}
