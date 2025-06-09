"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Target } from "lucide-react"
import { JoinBetaModal } from "@/components/join-beta-modal"

export function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleJoinBeta = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800 z-40 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center text-white font-bold text-xl">
                <Target className="w-6 h-6 text-red-500 mr-2" />
                TodoAI
                <span className="text-red-500 ml-1">●</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#examples" className="text-gray-300 hover:text-white transition-colors">
                Examples
              </a>
              <div className="relative group">
                <button className="flex items-center text-gray-300 hover:text-white transition-colors">
                  Resources
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {/* Dropdown menu could go here */}
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button 
                onClick={handleJoinBeta}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Join Beta
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal */}
      <JoinBetaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 