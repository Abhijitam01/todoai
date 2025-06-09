import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { DemoPreview } from "@/components/landing/demo-preview"
import { WhyTodoAI } from "@/components/landing/why-todoai"
import { FAQSection } from "@/components/landing/faq-section"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <DemoPreview />
      <WhyTodoAI />
      <FAQSection />
      <FinalCTA />
      <Footer />
    </main>
  )
} 