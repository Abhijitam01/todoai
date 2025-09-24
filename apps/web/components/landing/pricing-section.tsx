"use client";

import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/ui/aceternity/glass-card";
import { ModernButton } from "@/components/ui/aceternity/modern-button";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { BorderBeam } from "@/components/ui/aceternity/border-beam";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Rocket, 
  Shield, 
  Users, 
  BarChart3,
  Brain,
  Calendar,
  TrendingUp,
  Award,
  Globe,
  Clock,
  Sparkles
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with basic goal tracking",
    icon: Star,
    color: "from-gray-500 to-gray-600",
    popular: false,
    features: [
      "Up to 3 active goals",
      "Basic AI planning",
      "Daily task tracking",
      "Progress analytics",
      "Mobile app access",
      "Email support"
    ],
    limitations: [
      "Limited AI features",
      "Basic analytics only"
    ]
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Advanced features for serious goal achievers",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    popular: true,
    features: [
      "Unlimited goals",
      "Advanced AI planning",
      "Smart scheduling",
      "Detailed analytics",
      "Priority support",
      "Team collaboration",
      "Custom integrations",
      "Advanced reporting"
    ],
    limitations: []
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "per month",
    description: "Complete solution for teams and organizations",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced admin controls",
      "Custom AI training",
      "Dedicated support",
      "API access",
      "White-label options",
      "Custom integrations",
      "Advanced security"
    ],
    limitations: []
  }
];

const features = [
  { icon: Brain, text: "AI-Powered Planning", description: "Advanced goal breakdown" },
  { icon: Calendar, text: "Smart Scheduling", description: "Optimized daily planning" },
  { icon: TrendingUp, text: "Analytics", description: "Detailed progress tracking" },
  { icon: Users, text: "Team Collaboration", description: "Work together on goals" },
  { icon: Shield, text: "Security", description: "Enterprise-grade protection" },
  { icon: Globe, text: "Global Access", description: "Available worldwide" }
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const getPrice = (basePrice: string) => {
    if (basePrice === "$0") return "$0";
    const price = parseInt(basePrice.replace("$", ""));
    const annualPrice = isAnnual ? Math.round(price * 10) : price;
    return `$${annualPrice}`;
  };

  const getPeriod = (period: string) => {
    if (period === "forever") return "forever";
    return isAnnual ? "per year" : period;
  };

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, transparent
            <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. Start free and upgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-white/10 rounded-full p-1 transition-all duration-300"
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full"
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual <span className="text-green-400">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <BackgroundGradient className="rounded-full p-[2px]">
                    <div className="bg-black rounded-full px-4 py-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Most Popular</span>
                    </div>
                  </BackgroundGradient>
                </div>
              )}
              
              <GlassCard 
                className={`p-8 h-full ${plan.popular ? 'border-2 border-white/30' : ''}`}
                intensity={plan.popular ? "high" : "medium"}
              >
                {plan.popular && <BorderBeam />}
                
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">{getPrice(plan.price)}</span>
                    <span className="text-gray-400 ml-2">/{getPeriod(plan.period)}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 border border-gray-500 rounded flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                <ModernButton
                  variant={plan.popular ? "gradient" : "glass"}
                  size="lg"
                  className="w-full"
                  icon={plan.popular ? <Rocket className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                >
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </ModernButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            All plans include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <GlassCard className="p-6 text-center" intensity="low">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{feature.text}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Frequently asked questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, you can start with our free plan and upgrade when you're ready for more features."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
              }
            ].map((faq, index) => (
              <GlassCard key={index} className="p-6 text-left" intensity="low">
                <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                <p className="text-gray-400">{faq.answer}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
