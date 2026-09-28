import { LegalPage } from "@/app/_components/LegalPage";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/**
 * /cancellation-policy
 *
 * A summary of terms, not a contract: no notice window, fee or percentage is
 * stated, because none has been agreed. The renderer surfaces that it is
 * placeholder wording.
 */

const page = content.legal.cancellation;

export const metadata = pageMetadata({
  title: page.title,
  description:
    "How to rearrange an appointment, and what a short-notice cancellation can mean for the cost. A summary of terms, not a legal agreement.",
  path: site.routes.cancellation,
});

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      title={page.title}
      intro={page.intro}
      sections={page.sections}
      path={site.routes.cancellation}
    />
  );
}
