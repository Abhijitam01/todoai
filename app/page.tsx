import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { WhyTodoAI } from "@/components/landing/why-todoai"
import { FAQSection } from "@/components/landing/faq-section"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <WhyTodoAI />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  )
} 