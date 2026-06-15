import { Navigation } from "./landing/components/navigation"
import { HeroStatic } from "./landing/components/hero-static"
import { TrustBanner } from "./landing/components/trust-banner"
import { FeaturesSection } from "./landing/components/features-section"
import { HowItWorksSection } from "./landing/components/how-it-works-section"
import { FAQSection } from "./landing/components/faq-section"
import { CTASection } from "./landing/components/cta-section"
import { Footer } from "./landing/components/footer"

export const dynamic = "force-static"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navigation />
      <HeroStatic />
      <TrustBanner />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
