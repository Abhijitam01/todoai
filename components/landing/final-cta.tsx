"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function FinalCTA() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const resetStatus = () => {
    setIsSuccess(false)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
          source: 'final_cta'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail("") // Clear the input on success
      } else {
        setError(data.error || 'Failed to join waitlist')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error || isSuccess) {
      resetStatus() // Clear status when user starts typing again
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 text-sm text-purple-300 mb-8">
              <Users className="w-4 h-4" />
              Join 50,000+ Goal Achievers
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight"
          >
            Ready to Crush
            <br />
            <span className="text-purple-400 glow-purple">Your Goals?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Stop dreaming, start achieving. Get your AI-powered action plan in 30 seconds 
            and transform any goal into daily progress.
          </motion.p>

          {/* Email Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email for early access"
                  className={`w-full pl-10 pr-4 py-4 bg-slate-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    error ? 'border-red-500' : isSuccess ? 'border-green-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button 
                type="submit"
                variant="glow" 
                size="lg"
                disabled={isLoading || !email.trim()}
                className="group whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Status Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-green-400"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">🎉 You're on the waitlist! We'll notify you when TodoAI launches.</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-sm text-gray-400 mb-12"
          >
            🔒 We respect your privacy. No spam, unsubscribe anytime.
          </motion.div>

          {/* Alternative CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="border-t border-slate-700 pt-12"
          >
            <p className="text-gray-400 mb-6">
              Want to see how it works first?
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Try Interactive Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: "50K+", label: "Goals Achieved" },
              { number: "98%", label: "User Satisfaction" },
              { number: "30s", label: "Average Setup" },
              { number: "3x", label: "Higher Success Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
} 