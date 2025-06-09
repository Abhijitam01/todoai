"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, CheckCircle, AlertCircle, Loader2, Users, TrendingUp, Clock, Target, Shield, Play } from "lucide-react"
import { JoinBetaModal } from "@/components/join-beta-modal"

const stats = [
  {
    icon: Users,
    number: "50K+",
    label: "Goals Achieved",
    description: "Dreams turned into reality"
  },
  {
    icon: TrendingUp,
    number: "98%",
    label: "User Satisfaction",
    description: "Love their goal progress"
  },
  {
    icon: Clock,
    number: "30s",
    label: "Average Setup",
    description: "Quick and easy start"
  },
  {
    icon: Target,
    number: "3x",
    label: "Higher Success Rate",
    description: "vs traditional methods"
  }
]

export function FinalCTA() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error || isSuccess) {
      resetStatus()
    }
  }

  return (
    <>
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 overflow-hidden">
        {/* Enhanced Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Animated Accent Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.5) 2px, transparent 2px)
            `,
            backgroundSize: '120px 120px',
            animation: 'grid-pulse 15s ease-in-out infinite'
          }}></div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Beta Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-3 mb-8">
              <Users className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Join 50,000+ Goal Achievers</span>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
                Ready to Crush
                <br />
                <span className="text-red-500">Your Goals?</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Stop dreaming, start achieving. Get your AI-powered action plan in 30 seconds and transform any goal into daily progress.
              </p>
            </motion.div>

            {/* Email Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email for early access"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                      error ? 'border-red-500' : isSuccess ? 'border-green-500' : 'border-gray-600'
                    }`}
                    disabled={isLoading}
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Status Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center justify-center gap-2 text-red-400"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-center"
                >
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <p className="text-green-400 text-sm">🎉 You're on the waitlist! We'll notify you when TodoAI launches.</p>
                  </div>
                </motion.div>
              )}

              {/* Privacy Notice */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
                <Shield className="w-4 h-4 text-green-400" />
                We respect your privacy. No spam, unsubscribe anytime.
              </div>
            </motion.div>

            {/* Demo Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <p className="text-gray-400 mb-4">Want to see how it works first?</p>
              <Button 
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg"
              >
                <Play className="mr-2 w-4 h-4" />
                Try Interactive Demo
              </Button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-lg font-medium text-gray-300 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </motion.div>
              ))}
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
  )
} 