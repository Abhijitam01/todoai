"use client"

import { motion } from "framer-motion"
import { Target, Mail, MessageCircle, Heart } from "lucide-react"

const footerSections = [
  {
    title: "PRODUCT",
    links: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "Goal Templates", href: "#templates" },
      { name: "Integrations", href: "#integrations" }
    ]
  },
  {
    title: "RESOURCES",
    links: [
      { name: "Blog", href: "#blog" },
      { name: "Success Stories", href: "#stories" },
      { name: "Goal Setting Guide", href: "#guide" },
      { name: "API Documentation", href: "#api" },
      { name: "Help Center", href: "#help" }
    ]
  },
  {
    title: "COMPANY",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Contact", href: "#contact" }
    ]
  },
  {
    title: "COMMUNITY",
    links: [
      { name: "Discord Community", href: "#discord" },
      { name: "Twitter", href: "#twitter" },
      { name: "LinkedIn", href: "#linkedin" },
      { name: "YouTube", href: "#youtube" }
    ]
  }
]

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-gray-800">
      <div className="container mx-auto px-6">
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
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Turn ambitious goals into daily action plans with AI-powered planning that adapts to your life.
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
                        className="text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center mb-12"
          >
            <h3 className="text-xl font-bold text-white mb-4">Stay updated with TodoAI</h3>
            <p className="text-gray-400 mb-6">Get productivity tips, feature updates, and goal achievement strategies.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
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
              © 2024 TodoAI. All rights reserved. Made with 
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              for goal achievers.
            </div>
            
            <div className="flex items-center gap-6 text-gray-400">
              <a href="#status" className="hover:text-white transition-colors">
                Status
              </a>
              <a href="#security" className="hover:text-white transition-colors">
                Security
              </a>
              <a href="#cookies" className="hover:text-white transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 