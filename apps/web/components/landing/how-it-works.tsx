"use client"

import { motion } from "framer-motion"
import { 
  Target, 
  Brain, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  BarChart3
} from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Target,
    title: "Define Your Goal",
    description: "Tell TodoAI what you want to achieve. Whether it's learning Spanish, launching a startup, or running a marathon - just describe your goal in natural language.",
    details: [
      "Describe your goal in plain English",
      "Set your target completion date",
      "Specify your available time per day",
      "Choose your skill level"
    ],
    image: "goal-setup"
  },
  {
    number: "02", 
    icon: Brain,
    title: "AI Creates Your Plan",
    description: "Our AI analyzes your goal and creates a personalized roadmap with weekly milestones and daily tasks that fit your schedule and learning style.",
    details: [
      "AI breaks down complex goals",
      "Creates realistic daily tasks",
      "Schedules around your availability", 
      "Adapts to your learning pace"
    ],
    image: "ai-planning"
  },
  {
    number: "03",
    icon: Calendar,
    title: "Follow Daily Actions",
    description: "Get clear, actionable tasks each day. No more wondering what to do next - TodoAI tells you exactly what steps to take to make progress.",
    details: [
      "Clear daily task lists",
      "Estimated time for each task",
      "Progress tracking built-in",
      "Streak counters for motivation"
    ],
    image: "daily-tasks"
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track & Adjust",
    description: "Watch your progress unfold with beautiful analytics. TodoAI learns from your patterns and adjusts future plans to optimize your success.",
    details: [
      "Visual progress dashboards",
      "Completion rate analytics",
      "Automatic plan adjustments",
      "Achievement celebrations"
    ],
    image: "progress-tracking"
  }
]

const benefits = [
  {
    icon: CheckCircle,
    title: "90% Success Rate",
    description: "Users who follow TodoAI plans complete their goals 3x more often than traditional methods."
  },
  {
    icon: Sparkles,
    title: "Personalized Experience", 
    description: "Every plan is unique to you - your schedule, preferences, and learning style."
  },
  {
    icon: BarChart3,
    title: "Data-Driven Optimization",
    description: "AI continuously improves your plans based on your progress patterns and feedback."
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-900/30" id="how-it-works">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-sm font-semibold text-red-400 mb-4 tracking-wider">
            HOW IT WORKS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            From dream to done in four steps
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            TodoAI makes goal achievement systematic and sustainable. Here's exactly how we turn your ambitious goals into daily progress.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-6xl font-bold text-gray-800">{step.number}</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white">
                  {step.title}
                </h3>
                
                <p className="text-lg text-gray-400 leading-relaxed">
                  {step.description}
                </p>
                
                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Placeholder */}
              <div className="flex-1">
                <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                  <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <step.icon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <div className="text-gray-400 text-sm">
                        {step.title} Interface Preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Why TodoAI works where others fail
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Most goal-setting approaches fail because they're too vague or inflexible. TodoAI solves this with AI-powered personalization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 