"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Target } from "lucide-react"
import { JoinBetaModal } from "@/components/join-beta-modal"
import Link from "next/link"

export function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Target className="w-6 md:w-8 h-6 md:h-8 text-red-500 mr-2 md:mr-3" />
              <span className="text-lg md:text-xl font-bold text-white">TodoAI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-105">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-105">
                Pricing
              </a>
              <a href="#examples" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-105">
                Examples
              </a>
              <Link href="/feedback" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-105">
                Feedback
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-105">
                Dashboard
              </Link>
              <Link href="/waitlist">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 md:px-6 py-2 rounded-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group relative overflow-hidden"
                >
                  <span className="relative z-10">Join Beta</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link href="/waitlist">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm transform transition-all duration-300 hover:scale-105"
                >
                  Join Beta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal - keeping for compatibility with existing hero section */}
      <JoinBetaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 