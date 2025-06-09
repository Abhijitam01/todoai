"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Shield,
  ArrowRight,
  Target,
  BarChart3,
  Users,
  Smartphone
} from "lucide-react"

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Goal Breakdown",
    subtitle: "Intelligent planning that adapts to your schedule and learning style.",
    description: "Our advanced AI analyzes your goal, available time, and skill level to create a personalized roadmap with weekly milestones and daily tasks that actually fit your life.",
    tags: ["Smart Planning", "Personalized", "Adaptive AI"]
  },
  {
    icon: RefreshCw,
    title: "Adaptive Progress Tracking",
    subtitle: "Plans that evolve with you, ensuring you never fall behind.",
    description: "Missed a day? Life happens. TodoAI automatically redistributes your workload and adjusts timelines to keep you on track without overwhelming you.",
    tags: ["Auto-Adjustment", "Smart Scheduling", "Resilient Planning"]
  }
]

const platformFeatures = [
  {
    icon: Target,
    title: "Goal Templates Library",
    description: "Choose from 100+ proven goal templates or create your own. Learning languages, building businesses, fitness goals - we've got you covered.",
    metrics: "100+ Templates"
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Detailed insights into your goal completion patterns, productivity trends, and areas for improvement with beautiful visualizations.",
    metrics: "Smart Insights"
  },
  {
    icon: Users,
    title: "Achievement Community",
    description: "Connect with like-minded goal achievers, share progress, get motivation, and learn from others on similar journeys.",
    metrics: "10K+ Members"
  }
]

const coreQualities = [
  {
    icon: Brain,
    title: "Intelligent Planning",
    description: "Advanced AI that understands your goals, constraints, and preferences to create realistic, achievable plans that actually work.",
    tags: ["AI-Powered", "Personalized Roadmaps", "Smart Scheduling"]
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your goals and progress data are encrypted and secure. We never share your information. Your dreams stay private.",
    tags: ["End-to-End Encryption", "GDPR Compliant", "Zero Data Sharing"]
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Sync",
    description: "Access your goals anywhere - web, mobile, or desktop. Real-time sync ensures you're always up to date across all devices.",
    tags: ["Mobile Apps", "Real-time Sync", "Offline Support"]
  }
]

const integrations = [
  { name: "Google Calendar", description: "Sync tasks with your calendar" },
  { name: "Notion", description: "Export plans to your workspace" },
  { name: "Todoist", description: "Import existing task lists" },
  { name: "Apple Health", description: "Track fitness goals automatically" },
  { name: "GitHub", description: "Monitor coding project progress" },
  { name: "Spotify", description: "Track music practice sessions" }
]

export function FeaturesSection() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Main Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Powerful features that make goal achievement inevitable
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              TodoAI combines cutting-edge AI with proven productivity science to help you turn any ambitious goal into consistent daily progress.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-red-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-red-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-500">
                  {feature.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-sm font-semibold text-red-400 mb-4 tracking-wider">
              PLATFORM FEATURES
            </h3>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Everything you need to achieve any goal
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 p-6 rounded-lg hover:bg-gray-800/30 transition-colors border border-gray-800/50"
              >
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-red-400" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white text-lg">{feature.title}</h4>
                    <span className="text-sm text-red-400 bg-red-500/20 px-3 py-1 rounded-full">
                      {feature.metrics}
                    </span>
                  </div>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Connects with your favorite tools
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              TodoAI integrates seamlessly with the apps you already use, making goal tracking effortless.
            </p>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg">
              View All Integrations
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center hover:border-red-500/30 transition-all duration-300"
              >
                <h4 className="font-medium text-white mb-2">{integration.name}</h4>
                <p className="text-sm text-gray-400">{integration.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Qualities Section */}
      <section className="py-24 bg-gray-900/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Built for serious goal achievers
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {coreQualities.map((quality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6 bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-red-500/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <quality.icon className="w-8 h-8 text-red-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white">
                  {quality.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {quality.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {quality.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 