"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, Calendar, TrendingUp } from "lucide-react"
import { useState } from "react"
import { JoinBetaModal } from "@/components/join-beta-modal"

export function HeroSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white px-6 py-20">
        {/* Notification Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gray-900/80 border-b border-gray-800 py-3 px-4 text-center text-sm text-gray-300 z-50">
          🚀 TodoAI Beta is launching soon - Join the waitlist for early access
        </div>

        <div className="container mx-auto pt-24 pb-12">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white max-w-5xl mx-auto">
                Turn ambitious goals into
                <br />
                <span className="text-red-500">daily action plans</span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
                AI-powered goal planning that breaks down any objective into personalized, 
                achievable daily tasks. From learning Spanish to building a startup.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  size="lg"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Start Planning Free
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg"
                >
                  Watch Demo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <p className="text-gray-400 text-sm mb-12">
                <Sparkles className="inline w-4 h-4 mr-1 text-red-400" />
                No credit card required • Setup in 30 seconds • 10,000+ goals achieved
              </p>
            </motion.div>

            {/* Enhanced Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-5xl mx-auto mb-20"
            >
              {/* Browser Frame */}
              <div className="bg-gray-900 rounded-t-lg border border-gray-700 p-3 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded px-3 py-1 ml-4">
                    <div className="text-xs text-gray-400">app.todoai.com/dashboard</div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-gray-800 rounded-lg p-6 min-h-[450px]">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-1">My Goals Dashboard</h2>
                      <p className="text-gray-400 text-sm">Track your AI-generated action plans</p>
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                        <Target className="w-4 h-4 mr-2" />
                        New Goal
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        Analytics
                        <TrendingUp className="ml-1 w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-400">3</div>
                      <div className="text-xs text-gray-400">Active Goals</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">89%</div>
                      <div className="text-xs text-gray-400">Completion Rate</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">45</div>
                      <div className="text-xs text-gray-400">Days Streak</div>
                    </div>
                  </div>

                  {/* Project Tabs */}
                  <div className="flex gap-6 mb-6 border-b border-gray-700">
                    <button className="pb-3 px-1 border-b-2 border-red-500 text-red-500 font-medium text-sm">
                      TODAY'S TASKS
                    </button>
                    <button className="pb-3 px-1 text-gray-400 font-medium text-sm">
                      THIS WEEK
                    </button>
                    <button className="pb-3 px-1 text-gray-400 font-medium text-sm">
                      MILESTONES
                    </button>
                  </div>

                  {/* Goal Progress Cards */}
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { 
                        title: "Learn Spanish Fluency", 
                        progress: 78, 
                        timeLeft: "2 months left",
                        todayTask: "Complete 30min conversation practice",
                        category: "Language"
                      },
                      { 
                        title: "Launch SaaS MVP", 
                        progress: 34, 
                        timeLeft: "4 months left",
                        todayTask: "Design user authentication flow",
                        category: "Business"
                      },
                      { 
                        title: "Run Half Marathon", 
                        progress: 91, 
                        timeLeft: "2 weeks left",
                        todayTask: "12km training run + stretching",
                        category: "Fitness"
                      }
                    ].map((goal, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-white">{goal.title}</h3>
                            <span className="text-xs px-2 py-1 bg-gray-600 rounded text-gray-300 mr-2">
                              {goal.category}
                            </span>
                            <span className="text-xs text-gray-400">{goal.timeLeft}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">{goal.progress}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-2 text-red-400" />
                          Today: {goal.todayTask}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <p className="text-gray-400 mb-4 text-lg">Join the beta waitlist:</p>
              <form onSubmit={handleQuickSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error || isSuccess) resetStatus()
                  }}
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                    error ? 'border-red-500' : isSuccess ? 'border-green-500' : 'border-gray-600'
                  }`}
                  disabled={isLoading}
                  required
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  {isLoading ? "Joining..." : "Join Beta"}
                </Button>
              </form>
              
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
              
              {isSuccess && (
                <p className="text-green-400 text-sm mt-2">✅ You're on the waitlist! We'll notify you when TodoAI launches.</p>
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
  )
} 