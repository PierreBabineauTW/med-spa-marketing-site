import { LegalPage } from "@/app/_components/LegalPage";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/**
 * /privacy-policy
 *
 * Metadata stays here rather than in `LegalPage` so each policy's canonical URL
 * and description describe that policy and not the shared template. The
 * description summarises this page's own intro.
 */

const page = content.legal.privacy;

export const metadata = pageMetadata({
  title: page.title,
  description:
    "What personal information this website collects, why, and the choices you have — including how to ask to see, correct or delete it.",
  path: site.routes.privacy,
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={page.title}
      intro={page.intro}
      sections={page.sections}
      path={site.routes.privacy}
    />
  );
}
