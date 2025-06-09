"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])

  const resetStatus = () => {
    setIsSuccess(false)
    setError("")
  }

  const handleQuickSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError("")
    setIsSuccess(false)

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
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail("")
      } else {
        setError(data.error || 'Failed to join waitlist')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 bg-purple-500 rounded-full"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 text-sm text-purple-300 mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Goal Planning
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
          >
            Turn Your Goals Into{" "}
            <span className="text-purple-400 glow-purple">Daily Action</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            TodoAI transforms your ambitions into personalized day-by-day plans 
            with the power of AI. Never wonder what to do next again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button 
              variant="glow" 
              size="xl"
              className="group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Quick Email Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-gray-400 mb-4">Or join our waitlist for early access:</p>
            <form onSubmit={handleQuickSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error || isSuccess) resetStatus()
                }}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                  error ? 'border-red-500' : isSuccess ? 'border-green-500' : 'border-slate-600'
                }`}
                disabled={isLoading}
                required
              />
              <Button 
                type="submit"
                variant="secondary" 
                disabled={isLoading || !email.trim()}
                className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/50 text-purple-300"
              >
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
            
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            
            {isSuccess && (
              <p className="text-green-400 text-sm mt-2">✅ You're on the waitlist!</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm text-gray-400"
          >
            ✨ No credit card required • ✨ Setup in 30 seconds • ✨ Start achieving today
          </motion.div>
        </div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
    </section>
  )
} 