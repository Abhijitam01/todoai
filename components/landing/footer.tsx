"use client"

import { motion } from "framer-motion"
import { Target, Mail, MessageCircle, Heart, Rocket, Clock, Code, Users } from "lucide-react"
import { useState } from "react"

const footerSections = [
  {
    title: "PRODUCT",
    links: [
      { name: "Features (Coming Soon)", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Beta Pricing", href: "#pricing" },
      { name: "Goal Templates (Beta)", href: "#templates" },
      { name: "Integrations (Preview)", href: "#integrations" }
    ]
  },
  {
    title: "BETA ACCESS",
    links: [
      { name: "Join Waitlist", href: "#waitlist" },
      { name: "Early Access", href: "#early-access" },
      { name: "Beta Features", href: "#beta" },
      { name: "Development Updates", href: "#updates" },
      { name: "Feedback Portal", href: "#feedback" }
    ]
  },
  {
    title: "COMPANY",
    links: [
      { name: "About Our Mission", href: "#about" },
      { name: "We're Hiring!", href: "#careers" },
      { name: "Beta Privacy Policy", href: "#privacy" },
      { name: "Terms (Beta)", href: "#terms" },
      { name: "Contact Founders", href: "#contact" }
    ]
  },
  {
    title: "COMMUNITY",
    links: [
      { name: "Discord (Beta Users)", href: "#discord" },
      { name: "Twitter Updates", href: "#twitter" },
      { name: "LinkedIn", href: "#linkedin" },
      { name: "Building in Public", href: "#youtube" }
    ]
  }
]

const launchStats = [
  { icon: Users, label: "Beta Signups", value: "10,000+" },
  { icon: Clock, label: "Days to Launch", value: "45" },
  { icon: Code, label: "Features Built", value: "25/30" },
  { icon: Rocket, label: "Progress", value: "83%" }
]

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-gray-800 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Launch Progress Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-b border-gray-800"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
              <Rocket className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-medium text-sm">Building TodoAI</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">We're launching soon!</h3>
            <p className="text-gray-400">Follow our journey as we build the future of goal achievement</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {launchStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-gray-900/50 rounded-lg p-4"
              >
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          {/* Footer Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-red-500 mr-3" />
              <h3 className="text-2xl font-bold">TodoAI</h3>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">BETA</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Currently in development: AI-powered goal achievement that turns ambitious dreams into daily action plans. Coming soon!
            </p>
          </motion.div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {footerSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-semibold text-red-400 mb-6 tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Development Updates Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="w-5 h-5 text-red-400" />
              <h3 className="text-xl font-bold text-white">Development Updates</h3>
            </div>
            <p className="text-gray-400 mb-6">Get weekly updates on our progress, beta features, and launch timeline.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Get development updates"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              🚀 Join 5,000+ following our building journey
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 flex items-center">
              © 2024 TodoAI (Beta). All rights reserved. Built with 
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              for ambitious goal achievers.
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#status" className="hover:text-white transition-colors flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Building Live
              </a>
              <a href="#security" className="hover:text-white transition-colors">
                Security
              </a>
              <a href="#changelog" className="hover:text-white transition-colors">
                Changelog
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 