import { LegalPage } from "@/app/_components/LegalPage";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

/**
 * /safety-prescribing
 *
 * The copy states that a licensed practitioner assesses every patient, which
 * comes from config. It names no regulator, registration number, clinical
 * guideline or licence class, because none is configured.
 */

const page = content.legal.safety;

export const metadata = pageMetadata({
  title: page.title,
  description:
    "Who delivers prescriptive treatment, why a consultation comes first, how prescriptions are issued, and what to do if something does not settle as expected.",
  path: site.routes.safety,
});

export default function SafetyPrescribingPage() {
  return (
    <LegalPage
      title={page.title}
      intro={page.intro}
      sections={page.sections}
      path={site.routes.safety}
    />
  );
}
