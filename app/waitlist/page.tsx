"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle, AlertCircle, Loader2, Sparkles, ArrowLeft, Share2, Copy } from "lucide-react"
import Link from "next/link"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showShareOptions, setShowShareOptions] = useState(false)

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
          source: 'dedicated_waitlist_page'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail("")
        setShowShareOptions(true)
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

  const shareUrl = 'https://todoai.klashr.com'
  const shareText = '🚀 Discover TodoAI - the revolutionary AI that transforms your biggest goals into personalized daily action plans! No more overwhelm, just clear steps to success. Join thousands already achieving more with AI-powered productivity. Try it free:'

  const handleCopyLink = async () => {
    try {
      const fullShareText = `${shareText} ${shareUrl}`
      await navigator.clipboard.writeText(fullShareText)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TodoAI - AI-Powered Goal Achievement',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Back to Home */}
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Home
      </Link>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="absolute top-8 right-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-600"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Header */}
              <div className="mb-12">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Join the <span className="text-red-500">TodoAI Beta</span>
                </h1>
                <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
                  Be among the first to experience AI-powered goal achievement. Turn your ambitions into personalized daily action plans.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Early Access</h3>
                  <p className="text-gray-400 text-sm">Get exclusive access before public launch</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Priority Support</h3>
                  <p className="text-gray-400 text-sm">Direct feedback channel with our team</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Free Forever</h3>
                  <p className="text-gray-400 text-sm">Beta users get lifetime free access</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-lg ${
                      error ? 'border-red-500' : 'border-gray-600'
                    }`}
                    disabled={isLoading}
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm justify-center"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <Button 
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-medium text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 group relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Join Beta Waitlist</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  We'll notify you as soon as TodoAI beta is available. No spam, unsubscribe anytime.
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Welcome to TodoAI Beta!</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                You're on the waitlist! We'll send you an email as soon as beta access is available.
              </p>
              
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 max-w-md mx-auto mb-8"
                >
                  <h3 className="text-white font-semibold mb-4">Help us grow! Share with friends</h3>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleShare}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-green-400 mb-8">
                <CheckCircle className="w-4 h-4" />
                Successfully added to waitlist
              </div>
              
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
} 