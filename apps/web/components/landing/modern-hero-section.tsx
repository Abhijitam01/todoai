"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { BorderBeam } from "@/components/ui/aceternity/border-beam";
import { Spotlight } from "@/components/ui/aceternity/spotlight";
import { BackgroundBeams } from "@/components/ui/aceternity/background-beams";
import { ArrowRight, Sparkles, Target, Calendar, TrendingUp, Zap, Star, Users, CheckCircle } from "lucide-react";
import { JoinBetaModal } from "@/components/join-beta-modal";

export function ModernHeroSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    { icon: Target, text: "AI-Powered Planning" },
    { icon: Calendar, text: "Daily Action Plans" },
    { icon: TrendingUp, text: "Progress Tracking" },
    { icon: Zap, text: "Smart Automation" }
  ];

  const stats = [
    { value: "10,000+", label: "Goals Achieved" },
    { value: "95%", label: "Success Rate" },
    { value: "2.5x", label: "Faster Progress" },
    { value: "24/7", label: "AI Support" }
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <BackgroundBeams />
        </div>
        
        {/* Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <BackgroundGradient className="rounded-full p-[1px]">
                <div className="bg-black rounded-full px-6 py-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Join 10,000+ users achieving their goals</span>
                </div>
              </BackgroundGradient>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                Turn ambitious goals into
                <br />
                <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  daily action plans
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                AI-powered goal planning that breaks down any objective into personalized, 
                achievable daily tasks. From learning Spanish to building a startup.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm">
                  <feature.icon className="w-6 h-6 text-red-500 mb-2" />
                  <span className="text-sm text-gray-300">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Planning Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <BorderBeam />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-xl transform transition-all duration-300 hover:scale-105 hover:border-red-500/50 group"
              >
                <Star className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Quick Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-md mx-auto"
            >
              <p className="text-gray-400 mb-4 text-lg">Join the beta waitlist:</p>
              <form onSubmit={handleQuickSignup} className="flex flex-col sm:flex-row gap-3">
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
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 bg-gray-900/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 hover:bg-gray-800/50 ${
                    error ? 'border-red-500' : isSuccess ? 'border-green-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  disabled={isLoading}
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:transform-none disabled:hover:scale-100"
                >
                  {isLoading ? "Joining..." : "Join Beta"}
                </Button>
              </form>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
              
              {isSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm mt-2 flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  You're on the waitlist! We'll notify you when TodoAI launches.
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <JoinBetaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
