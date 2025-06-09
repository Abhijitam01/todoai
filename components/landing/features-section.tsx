"use client"

import { motion } from "framer-motion"
import { 
  Brain, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Shield 
} from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Goal Planning",
    description: "Advanced AI analyzes your goal and creates a personalized roadmap with weekly milestones and daily tasks.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: RefreshCw,
    title: "Adaptive Todos",
    description: "Smart plan adjustments when life happens. Missed a day? AI redistributes tasks to keep you on track.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Calendar,
    title: "Smart Rescheduling",
    description: "Seamlessly reschedule tasks with intelligent suggestions that maintain your goal timeline.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "Progress Checkpoints",
    description: "Regular milestone reviews with insights and recommendations to accelerate your progress.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "From goal to actionable plan in under 30 seconds. No complex configurations or planning required.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Built for Success",
    description: "Designed by productivity experts and powered by cutting-edge AI to maximize your achievement rate.",
    color: "from-indigo-500 to-purple-500"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to turn ambitious goals into daily wins
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 h-full hover:border-purple-500/50 transition-all duration-300">
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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
              🚀 Join <span className="text-white font-bold">10,000+</span> goal achievers who switched to AI-powered planning
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 