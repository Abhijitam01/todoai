"use client";

import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navigation } from "@/components/navigation"
import { UltimateHeroSection } from "@/components/landing/ultimate-hero-section"
import { FeaturesShowcase } from "@/components/landing/features-showcase"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { WhyTodoAI } from "@/components/landing/why-todoai"
import { FAQSection } from "@/components/landing/faq-section"
import { FinalCTA } from "@/components/landing/final-cta"
import { UltimateFooter } from "@/components/landing/ultimate-footer"

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <UltimateHeroSection />
      <FeaturesShowcase />
      <TestimonialsSection />
      <PricingSection />
      <HowItWorks />
      <FeaturesSection />
      <WhyTodoAI />
      <FAQSection />
      <FinalCTA />
      <UltimateFooter />
    </main>
  )
} 