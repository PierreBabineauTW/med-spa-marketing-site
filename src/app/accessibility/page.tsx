import { LegalPage } from "@/app/_components/LegalPage";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/**
 * /accessibility
 *
 * Reached from the accessibility widget, the footer notice and the consent
 * banner, so it carries the accommodations contact route as well as the
 * statement itself.
 */

const page = content.legal.accessibility;

export const metadata = pageMetadata({
  title: page.title,
  description:
    "What has been done to make this site usable by everyone, the limitations we already know about, and how to report a barrier so it can be fixed.",
  path: site.routes.accessibility,
});

export default function AccessibilityPage() {
  return (
    <LegalPage
      title={page.title}
      intro={page.intro}
      sections={page.sections}
      path={site.routes.accessibility}
    />
  );
}
