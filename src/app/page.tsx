/**
 * UPKEEP Med Spa — home page clone of https://upkeepmedspa.com/
 * site-key: upkeepmedspa-com-9d00bd1f   page-key: root-8a5edab2
 *
 * Section order, the fixed nav, the overlays and their z-index ladder mirror the
 * captured live page. All styling comes from the ported stylesheet
 * `src/components/sites/upkeepmedspa-com-9d00bd1f/upkeep.css`.
 */
import { AccessibilityMenu } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/AccessibilityMenu";
import { BookingCtaSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/BookingCtaSection";
import { ConsentBanner } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ConsentBanner";
import { HeroSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/HeroSection";
import { IntroSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/IntroSection";
import { JournalSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/JournalSection";
import { LocationsSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/LocationsSection";
import { PressBar } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/PressBar";
import { ServicesSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ServicesSection";
import { SignupPopup } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SignupPopup";
import { SiteFooter } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SiteFooter";
import { SiteNav } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/SiteNav";
import { TestimonialsSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/TestimonialsSection";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteNav />

      <main id="main-content">
        <HeroSection />
        <IntroSection />
        <ServicesSection />
        <TestimonialsSection />
        <LocationsSection />
        <PressBar />
        <JournalSection />
        <BookingCtaSection />
      </main>

      <SiteFooter />

      <ConsentBanner />
      <SignupPopup />
      <AccessibilityMenu />
    </>
  );
}
