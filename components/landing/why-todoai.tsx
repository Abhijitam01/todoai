"use client"

import { motion } from "framer-motion"
import { 
  Star, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Quote,
  Target,
  Clock,
  Zap
} from "lucide-react"

const stats = [
  {
    icon: Users,
    number: "50K+",
    label: "Goals Will Be Achieved",
    description: "When we launch (projected)"
  },
  {
    icon: TrendingUp,
    number: "3x",
    label: "Higher Success Rate",
    description: "In beta testing vs traditional methods"
  },
  {
    icon: Clock,
    number: "89%",
    label: "Beta Completion Rate",
    description: "Early users love TodoAI"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "Beta User Rating",
    description: "Based on 500+ beta testers"
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    goal: "Learn Spanish",
    image: "SC",
    quote: "TodoAI helped me go from complete beginner to conversational Spanish in 6 months. The daily tasks were perfect for my busy schedule.",
    progress: "Completed in 6 months"
  },
  {
    name: "Marcus Johnson", 
    role: "Entrepreneur",
    goal: "Launch SaaS Business",
    image: "MJ",
    quote: "I'd been procrastinating on my startup idea for years. TodoAI broke it down into manageable daily tasks. Launched 8 months later!",
    progress: "Revenue: $15K/month"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Manager",
    goal: "Run Marathon",
    image: "ER", 
    quote: "Never thought I could run 26.2 miles. TodoAI's training plan adapted perfectly when I missed days. Finished my first marathon!",
    progress: "Marathon completed"
  }
]

const whyChooseUs = [
  {
    icon: Target,
    title: "Precision Planning",
    description: "Our AI doesn't just break down goals - it creates scientifically-backed plans based on cognitive load theory and spaced repetition.",
    highlight: "Science-backed methodology"
  },
  {
    icon: Zap,
    title: "Adaptive Intelligence", 
    description: "Plans evolve with you. Missed a day? Life changed? TodoAI automatically adjusts without derailing your progress.",
    highlight: "Self-healing plans"
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with others pursuing similar goals. Share progress, get motivation, and learn from the community.",
    highlight: "10K+ active members"
  }
]

export function WhyTodoAI() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden" id="why-todoai">
      {/* Diagonal Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-sm font-semibold text-red-400 mb-4 tracking-wider">
            WHY TODOAI
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Join thousands who've turned dreams into achievements
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            TodoAI isn't just another productivity app. It's a goal achievement system backed by science and proven by results.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-gray-900/50 border border-gray-800 rounded-lg p-4 md:p-6 hover:border-red-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
            >
              <div className="w-10 md:w-12 h-10 md:h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300">
                <stat.icon className="w-5 md:w-6 h-5 md:h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-red-100 transition-colors duration-300">{stat.number}</div>
              <div className="text-sm md:text-lg font-medium text-gray-300 mb-1 group-hover:text-gray-200 transition-colors duration-300">{stat.label}</div>
              <div className="text-xs md:text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              What makes TodoAI different?
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Unlike generic productivity apps, TodoAI is specifically designed for goal achievement with cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              >
                <div className="w-14 h-14 bg-red-500 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-400 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/30">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-red-100 transition-colors duration-300">{item.title}</h4>
                <p className="text-gray-400 mb-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{item.description}</p>
                <div className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-red-500/30 group-hover:text-red-300 transition-all duration-300">
                  {item.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Real people, real results
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See how TodoAI has helped thousands of people achieve their most ambitious goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-500 transform hover:scale-105 hover:shadow-xl group cursor-pointer"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current group-hover:text-yellow-300 transition-colors duration-300" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-red-400 mb-4 group-hover:text-red-300 transition-colors duration-300" />
                
                <p className="text-gray-300 mb-6 leading-relaxed italic group-hover:text-gray-200 transition-colors duration-300">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-red-400 group-hover:scale-110 transition-all duration-300">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-red-100 transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{testimonial.role}</div>
                    <div className="text-sm text-green-400 font-medium group-hover:text-green-300 transition-colors duration-300">{testimonial.progress}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700 group-hover:border-gray-600 transition-colors duration-300">
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    <Target className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                    Goal: {testimonial.goal}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 