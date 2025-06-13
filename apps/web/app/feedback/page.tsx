"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2, MessageSquare, ArrowLeft, Share2, Copy, Star, Heart, DollarSign, Lightbulb } from "lucide-react"
import Link from "next/link"

interface FeedbackData {
  email: string
  love: string
  want: string
  changes: string
  pricing: string
  rating: number
  recommendation: number
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackData>({
    email: "",
    love: "",
    want: "",
    changes: "",
    pricing: "",
    rating: 0,
    recommendation: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showShareOptions, setShowShareOptions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    if (!formData.love.trim()) {
      setError("Please tell us what you love")
      return
    }
    if (formData.rating === 0) {
      setError("Please provide a rating")
      return
    }

    setIsLoading(true)
    setError("")
    setIsSuccess(false)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'dedicated_feedback_page'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setShowShareOptions(true)
        // Reset form
        setFormData({
          email: "",
          love: "",
          want: "",
          changes: "",
          pricing: "",
          rating: 0,
          recommendation: 0
        })
      } else {
        setError(data.error || 'Failed to submit feedback')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FeedbackData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const shareUrl = 'https://todoai.klashr.com'
  const shareText = '🚀 Discover TodoAI - the revolutionary AI that transforms your biggest goals into personalized daily action plans! No more overwhelm, just clear steps to success. Join thousands already achieving more with AI-powered productivity. Try it free:'

  const handleCopyLink = async () => {
    try {
      const fullShareText = `${shareText} ${shareUrl}`
      await navigator.clipboard.writeText(fullShareText)
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

  const StarRating = ({ value, onChange, label }: { value: number, onChange: (rating: number) => void, label: string }) => (
    <div className="space-y-2">
      <label className="block text-white font-medium">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              star <= value 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'border-gray-600 text-gray-400 hover:border-red-400'
            }`}
          >
            {star}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {value === 0 ? 'Click to rate' : 
         value <= 3 ? 'Poor' : 
         value <= 6 ? 'Good' : 
         value <= 8 ? 'Great' : 'Excellent!'}
      </p>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20 overflow-hidden">
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
        <div className="max-w-3xl mx-auto">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-blue-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Help Shape <span className="text-red-500">TodoAI</span>
                </h1>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Your feedback is invaluable to us. Help us understand what you love, what you want, and how we can make TodoAI even better.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Email */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <label className="block text-white font-medium mb-3">
                    <span className="flex items-center gap-2">
                      <span>Your email</span>
                      <span className="text-red-400">*</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* What do you love */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <label className="block text-white font-medium mb-3">
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      <span>What do you love about TodoAI?</span>
                      <span className="text-red-400">*</span>
                    </span>
                  </label>
                  <textarea
                    value={formData.love}
                    onChange={(e) => handleInputChange('love', e.target.value)}
                    placeholder="Tell us what features, aspects, or experiences you enjoy most..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                {/* What do you want */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <label className="block text-white font-medium mb-3">
                    <span className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>What features or improvements do you want to see?</span>
                    </span>
                  </label>
                  <textarea
                    value={formData.want}
                    onChange={(e) => handleInputChange('want', e.target.value)}
                    placeholder="Share your ideas for new features, integrations, or enhancements..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Changes */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <label className="block text-white font-medium mb-3">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-green-400" />
                      <span>What would you change or improve?</span>
                    </span>
                  </label>
                  <textarea
                    value={formData.changes}
                    onChange={(e) => handleInputChange('changes', e.target.value)}
                    placeholder="What aspects could be better? Any pain points or frustrations..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Pricing */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <label className="block text-white font-medium mb-3">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span>How much would you be willing to pay per month?</span>
                    </span>
                  </label>
                  <select
                    value={formData.pricing}
                    onChange={(e) => handleInputChange('pricing', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a price range</option>
                    <option value="free">Free only</option>
                    <option value="1-5">$1 - $5/month</option>
                    <option value="5-10">$5 - $10/month</option>
                    <option value="10-20">$10 - $20/month</option>
                    <option value="20-50">$20 - $50/month</option>
                    <option value="50+">$50+/month</option>
                  </select>
                </div>

                {/* Rating */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <StarRating
                    value={formData.rating}
                    onChange={(rating) => handleInputChange('rating', rating)}
                    label="On a scale of 1-10, how much do you love TodoAI? *"
                  />
                </div>

                {/* Recommendation */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <StarRating
                    value={formData.recommendation}
                    onChange={(rating) => handleInputChange('recommendation', rating)}
                    label="How likely are you to recommend TodoAI to a friend? (1-10)"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-medium text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 group relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Submit Feedback</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your feedback helps us build a better TodoAI for everyone. Thank you for taking the time!
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
              <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Your feedback has been submitted successfully. We read every single response and use them to improve TodoAI.
              </p>
              
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 max-w-md mx-auto mb-8"
                >
                  <h3 className="text-white font-semibold mb-4">Help us get more feedback!</h3>
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
                Feedback submitted successfully
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