"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/aceternity/glass-card";
import { ModernButton } from "@/components/ui/aceternity/modern-button";
import { 
  Target, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram,
  ArrowRight,
  Sparkles,
  Heart,
  Globe,
  Shield,
  Award,
  Users,
  Rocket
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" },
    { name: "Integrations", href: "#integrations" },
    { name: "Changelog", href: "#changelog" }
  ],
  Company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" },
    { name: "Partners", href: "#partners" }
  ],
  Resources: [
    { name: "Help Center", href: "#help" },
    { name: "Documentation", href: "#docs" },
    { name: "Community", href: "#community" },
    { name: "Tutorials", href: "#tutorials" },
    { name: "Status", href: "#status" }
  ],
  Legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" },
    { name: "Security", href: "#security" }
  ]
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" }
];

const stats = [
  { icon: Users, value: "10,000+", label: "Active Users" },
  { icon: Award, value: "95%", label: "Success Rate" },
  { icon: Globe, value: "50+", label: "Countries" },
  { icon: Rocket, value: "24/7", label: "AI Support" }
];

export function UltimateFooter() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-16 border-b border-white/10"
        >
          <GlassCard className="p-8 text-center" intensity="medium">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Stay updated</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Get the latest updates on TodoAI features, tips, and success stories.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                />
                <ModernButton
                  variant="gradient"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Subscribe
                </ModernButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">TodoAI</span>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Transform your ambitious goals into daily action plans with the power of AI. 
                  Join thousands of achievers who are already reaching their dreams.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <stat.icon className="w-4 h-4 text-white" />
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <social.icon className="w-5 h-5 text-white" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + categoryIndex * 0.1 }}
              >
                <h4 className="text-white font-semibold mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© 2024 TodoAI. Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for goal achievers worldwide.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
