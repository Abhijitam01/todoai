"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/ui/aceternity/glass-card";
import { ModernButton } from "@/components/ui/aceternity/modern-button";
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Shield, 
  Users, 
  BarChart3,
  Clock,
  Award,
  Rocket,
  Heart,
  Globe,
  Code,
  Database,
  Cpu,
  Layers,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    id: 1,
    title: "AI-Powered Goal Planning",
    description: "Our advanced AI analyzes your goals and creates personalized, step-by-step action plans tailored to your learning style and schedule.",
    icon: Brain,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    color: "from-purple-500 to-pink-500",
    stats: { value: "95%", label: "Accuracy Rate" }
  },
  {
    id: 2,
    title: "Daily Action Plans",
    description: "Break down complex goals into manageable daily tasks with intelligent scheduling that adapts to your progress and availability.",
    icon: Calendar,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    color: "from-blue-500 to-cyan-500",
    stats: { value: "2.5x", label: "Faster Progress" }
  },
  {
    id: 3,
    title: "Smart Progress Tracking",
    description: "Monitor your advancement with detailed analytics, milestone celebrations, and adaptive recommendations to keep you motivated.",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    color: "from-green-500 to-emerald-500",
    stats: { value: "89%", label: "Completion Rate" }
  },
  {
    id: 4,
    title: "Intelligent Automation",
    description: "Automate routine tasks, set smart reminders, and let AI optimize your learning path based on your performance patterns.",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    color: "from-yellow-500 to-orange-500",
    stats: { value: "24/7", label: "AI Support" }
  }
];

const benefits = [
  { icon: Target, text: "Clear Goal Setting", description: "Define and structure your objectives" },
  { icon: Clock, text: "Time Management", description: "Optimize your daily schedule" },
  { icon: Award, text: "Achievement Tracking", description: "Celebrate milestones and progress" },
  { icon: Users, text: "Community Support", description: "Connect with like-minded achievers" },
  { icon: Shield, text: "Privacy First", description: "Your data is secure and private" },
  { icon: Globe, text: "Global Access", description: "Available anywhere, anytime" }
];

export function FeaturesShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.1, once: true });

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
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
            Powerful features for
            <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              goal achievement
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to turn your ambitious goals into reality, powered by cutting-edge AI technology.
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8`}
            >
              <div className="flex-1">
                <GlassCard className="p-8" intensity="medium">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{feature.stats.value}</span>
                        <span className="text-gray-400">{feature.stats.label}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <div className="flex gap-4">
                    <ModernButton variant="glass" size="md" icon={<Play className="w-4 h-4" />}>
                      Learn More
                    </ModernButton>
                    <ModernButton variant="gradient" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                      Try Now
                    </ModernButton>
                  </div>
                </GlassCard>
              </div>
              
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative rounded-2xl overflow-hidden"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Why choose TodoAI?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <GlassCard className="p-6 text-center group hover:scale-105 transition-transform" intensity="low">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{benefit.text}</h4>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "10,000+", label: "Active Users", icon: Users },
            { value: "95%", label: "Success Rate", icon: Award },
            { value: "2.5x", label: "Faster Progress", icon: Rocket },
            { value: "24/7", label: "AI Support", icon: Brain }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 + index * 0.1 }}
              className="text-center"
            >
              <GlassCard className="p-6" intensity="low">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
