import { Navigation } from "./components/navigation"
import { HeroStatic } from "./components/hero-static"
import { TrustBanner } from "./components/trust-banner"
import { FeaturesSection } from "./components/features-section"
import { HowItWorksSection } from "./components/how-it-works-section"
import { FAQSection } from "./components/faq-section"
import { CTASection } from "./components/cta-section"
import { Footer } from "./components/footer"

export const dynamic = "force-static"

export default function LandingPage() {
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
