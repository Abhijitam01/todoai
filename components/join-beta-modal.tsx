"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Mail, CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react"

interface JoinBetaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinBetaModal({ isOpen, onClose }: JoinBetaModalProps) {
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
          source: 'join_beta_modal'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setEmail("")
        // Auto-close modal after success
        setTimeout(() => {
          onClose()
          setIsSuccess(false)
        }, 2000)
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

  const handleClose = () => {
    onClose()
    // Reset form when modal closes
    setTimeout(() => {
      setEmail("")
      setIsSuccess(false)
      setError("")
      setIsLoading(false)
    }, 300)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Join TodoAI Beta</h2>
          <p className="text-gray-400">
            Be among the first to experience AI-powered goal achievement. Get early access and exclusive updates.
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`w-full pl-11 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
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
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <Button 
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Beta Waitlist'
                )}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                We'll notify you as soon as TodoAI beta is available. No spam, unsubscribe anytime.
              </p>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Welcome to TodoAI Beta!</h3>
            <p className="text-gray-400 mb-4">
              You're on the waitlist! We'll send you an email as soon as beta access is available.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              Successfully added to waitlist
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  )
} 