import { GalleryGrid } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/GalleryGrid";
import { PageHero } from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageHero";
import {
  Breadcrumbs,
  CtaBand,
} from "@/components/sites/upkeepmedspa-com-9d00bd1f/shared/PageBlocks";
import { content } from "@/config/content";
import { site } from "@/config/site";
import {
  JsonLd,
  breadcrumbSchema,
  organizationSchema,
  pageMetadata,
} from "@/lib/seo";

/**
 * ---------------------------------------------------------------------------
 * /gallery
 * ---------------------------------------------------------------------------
 *
 * The filtering, the grid and the lightbox all belong to `GalleryGrid`; this
 * page supplies the shell, the answer-first copy and the closing CTA.
 *
 * HONESTY
 * The captions come from `content.gallery`, which states plainly where the
 * imagery comes from. Nothing here adds a claim about results, clients or
 * outcomes, and no before/after claim is made anywhere on the page.
 */

const images = content.gallery;

/** "injectables, skin, bodies and studio" — derived, so the copy cannot drift. */
const categoryList = content.galleryCategories
  .slice(1)
  .map((category) => category.toLowerCase())
  .join(", ")
  .replace(/, ([^,]+)$/, " and $1");

const intro = `${images.length} images across ${categoryList} — filter by category, or select any image to view it larger.`;

const description = `Browse ${images.length} images from the studio: ${categoryList}. Filter by category and open any image full size.`;

export const metadata = pageMetadata({
  title: "Gallery",
  description,
  path: "/gallery",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
];

export default function GalleryPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Our work" title="Gallery" intro={intro}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery" }]} />
      </PageHero>

      <section className="section" aria-label="Image gallery">
        <div className="container">
          <GalleryGrid />
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Want to talk through a treatment?"
        body="Every treatment here starts with a consultation. Pick a studio, or send us a question and we will come back to you."
        cta={{ label: "Contact us", href: site.routes.contact }}
      />

      <JsonLd
        id="ld-gallery"
        data={[organizationSchema(), breadcrumbSchema(crumbs)]}
      />
    </main>
  );
}
