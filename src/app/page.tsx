import { BookingCtaSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/BookingCtaSection";
import { HeroSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/HeroSection";
import { IntroSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/IntroSection";
import { JournalSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/JournalSection";
import { LocationsSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/LocationsSection";
import { PressBar } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/PressBar";
import { ServicesSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/ServicesSection";
import { TestimonialsSection } from "@/components/sites/upkeepmedspa-com-9d00bd1f/root-8a5edab2/TestimonialsSection";

/**
 * The site shell (skip link, nav, footer, overlays) lives in the root layout, so
 * this page is only the home content. Body child order is unchanged from the
 * single-page version: skip-link → nav → main → footer → overlays.
 */
export default function Home() {
  return (
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
  );
}
