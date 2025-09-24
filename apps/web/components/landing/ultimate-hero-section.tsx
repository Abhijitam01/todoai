"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { BorderBeam } from "@/components/ui/aceternity/border-beam";
import { AdvancedSpotlight } from "@/components/ui/aceternity/advanced-spotlight";
import { ParticleBackground } from "@/components/ui/aceternity/particle-background";
import { GlassCard } from "@/components/ui/aceternity/glass-card";
import { TypingAnimation } from "@/components/ui/aceternity/typing-animation";
import { ModernButton } from "@/components/ui/aceternity/modern-button";
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Star, 
  Users, 
  CheckCircle,
  Play,
  Award,
  Shield,
  Rocket,
  Brain,
  Heart,
  Globe,
  Code,
  Database,
  Cpu,
  Layers,
  BarChart3,
  Lightbulb,
  Clock,
  Target as TargetIcon,
  ChevronDown
} from "lucide-react";
import { JoinBetaModal } from "@/components/join-beta-modal";
import Image from "next/image";

export function UltimateHeroSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleQuickSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'hero_section'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
      } else {
        setError(data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Brain, text: "AI-Powered Planning", color: "from-purple-500 to-pink-500" },
    { icon: Calendar, text: "Daily Action Plans", color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, text: "Progress Tracking", color: "from-green-500 to-emerald-500" },
    { icon: Zap, text: "Smart Automation", color: "from-yellow-500 to-orange-500" }
  ];

  const stats = [
    { value: "10,000+", label: "Goals Achieved", icon: Target },
    { value: "95%", label: "Success Rate", icon: Award },
    { value: "2.5x", label: "Faster Progress", icon: Rocket },
    { value: "24/7", label: "AI Support", icon: Shield }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      content: "TodoAI transformed how I approach goal setting. The AI planning is incredibly accurate.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Entrepreneur",
      company: "StartupXYZ",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "Finally, a tool that breaks down complex goals into manageable daily actions.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Student",
      company: "University",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "The progress tracking keeps me motivated. I've achieved more in 3 months than the past year.",
      rating: 5
    }
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <ParticleBackground />
          <AdvancedSpotlight 
            className="top-1/4 left-1/4" 
            fill="white" 
            size={800} 
            intensity={0.1}
          />
          <AdvancedSpotlight 
            className="bottom-1/4 right-1/4" 
            fill="white" 
            size={600} 
            intensity={0.05}
          />
        </div>

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
              animation: 'grid-move 20s linear infinite'
            }}
          />
        </div>

        {/* Mouse Follower Effect */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-red-500/20 to-blue-500/20 blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
          }}
        />

        <motion.div 
          className="container mx-auto px-4 py-20 relative z-10"
          style={{ y, opacity, scale }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <GlassCard className="px-6 py-3" intensity="medium">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Join 10,000+ users achieving their goals
                  </span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center mb-12"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight">
                Turn ambitious goals into
                <br />
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                  daily action plans
                </span>
              </h1>

              <div className="text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed">
                <TypingAnimation 
                  text="AI-powered goal planning that breaks down any objective into personalized, achievable daily tasks. From learning Spanish to building a startup."
                  speed={30}
                  className="block"
                />
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <GlassCard className="p-6 text-center group" intensity="low" hover>
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {feature.text}
                    </span>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <ModernButton
                size="lg"
                variant="gradient"
                onClick={() => setIsModalOpen(true)}
                icon={<Rocket className="w-5 h-5" />}
                className="px-8 py-4 text-lg"
              >
                Start Planning Free
              </ModernButton>
              
              <ModernButton
                size="lg"
                variant="glass"
                icon={<Play className="w-5 h-5" />}
                className="px-8 py-4 text-lg"
              >
                Watch Demo
              </ModernButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <GlassCard className="p-6" intensity="low">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative max-w-6xl mx-auto mb-20"
            >
              <GlassCard className="p-8" intensity="medium">
                <div className="bg-black/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">TodoAI Dashboard</h3>
                      <p className="text-gray-400">Your AI-powered goal management center</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Today's Tasks</h4>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-4 h-4 border border-gray-400 rounded"></div>
                          <span className="text-gray-300 text-sm">Task {i}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Active Goals</h4>
                      {[1, 2].map((i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-lg">
                          <div className="text-white text-sm font-medium mb-2">Goal {i}</div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full" style={{ width: `${60 + i * 20}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-white font-semibold">Progress</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">78%</div>
                        <div className="text-gray-400 text-sm">This Week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Loved by thousands of users
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <GlassCard className="p-6" intensity="low">
                      <div className="flex items-center mb-4">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <div className="text-white font-medium">{testimonial.name}</div>
                          <div className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">"{testimonial.content}"</p>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="max-w-2xl mx-auto"
            >
              <GlassCard className="p-8" intensity="medium">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to get started?</h3>
                  <p className="text-gray-400">Join the beta waitlist and be among the first to experience TodoAI</p>
                </div>
                
                <form onSubmit={handleQuickSignup} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error || isSuccess) {
                        setError("");
                        setIsSuccess(false);
                      }
                    }}
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                    disabled={isLoading}
                    required
                  />
                  <ModernButton
                    type="submit"
                    variant="gradient"
                    size="lg"
                    loading={isLoading}
                    disabled={isLoading || !email.trim()}
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    Join Beta
                  </ModernButton>
                </form>
                
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-4 text-center"
                  >
                    {error}
                  </motion.p>
                )}
                
                {isSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm mt-4 text-center flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    You're on the waitlist! We'll notify you when TodoAI launches.
                  </motion.p>
                )}
              </GlassCard>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center text-gray-400"
              >
                <span className="text-sm mb-2">Scroll to explore</span>
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Modal */}
      <JoinBetaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
