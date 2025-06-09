"use client"

import { motion } from "framer-motion"
import { Target, Brain, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Target,
    title: "Set Your Goal",
    description: "Tell us what you want to achieve, when you want to finish, and how much time you can dedicate daily.",
    step: "01"
  },
  {
    icon: Brain,
    title: "AI Creates Your Plan",
    description: "Our AI breaks down your goal into weekly milestones and actionable daily tasks tailored to your schedule.",
    step: "02"
  },
  {
    icon: CheckCircle,
    title: "Execute Daily",
    description: "Follow your personalized roadmap, track progress, and let AI adapt your plan as you go.",
    step: "03"
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform any goal into a step-by-step action plan in minutes
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent z-0 transform translate-x-4"></div>
                )}
                
                <div className="relative z-10 text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full glow-purple mb-4">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-purple-400/30 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 -z-10">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-6">
            <p className="text-purple-300 font-medium">
              ⚡ Average setup time: <span className="text-white">30 seconds</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 