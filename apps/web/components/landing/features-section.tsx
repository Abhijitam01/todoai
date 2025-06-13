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
    <div className="bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Features Section */}
      <section className="py-24 relative z-10">
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
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-red-500 rounded-lg flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-red-400 group-hover:shadow-lg group-hover:shadow-red-500/30">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-100 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 group-hover:bg-red-500/20 group-hover:text-red-300 transition-all duration-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
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
                className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 p-4 md:p-6 rounded-lg hover:bg-gray-800/30 transition-all duration-300 border border-gray-800/50 hover:border-red-500/30 group cursor-pointer transform hover:scale-[1.01]"
              >
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h4 className="font-semibold text-white text-lg group-hover:text-red-100 transition-colors duration-300">{feature.title}</h4>
                    <span className="text-sm text-red-400 bg-red-500/20 px-3 py-1 rounded-full mt-2 md:mt-0 self-start group-hover:bg-red-500/30 group-hover:text-red-300 transition-all duration-300">
                      {feature.metrics}
                    </span>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8">
              Connects with your favorite tools
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto">
              TodoAI integrates seamlessly with the apps you already use, making goal tracking effortless.
            </p>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-3 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 group">
              <span>View All Integrations</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center hover:border-red-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer"
              >
                <h4 className="font-medium text-white mb-2 group-hover:text-red-100 transition-colors duration-300">{integration.name}</h4>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{integration.description}</p>
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8">
              Built for serious goal achievers
            </h2>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {coreQualities.map((quality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6 bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300">
                  <quality.icon className="w-8 h-8 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                </div>
                
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-red-100 transition-colors duration-300">
                  {quality.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {quality.description}
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {quality.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 group-hover:bg-red-500/20 group-hover:text-red-300 transition-all duration-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg"
                >
                  <span>Learn More</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 