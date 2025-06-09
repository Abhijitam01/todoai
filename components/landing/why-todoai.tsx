"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager → Python Developer",
    content: "TodoAI turned my overwhelming career change goal into daily bite-sized tasks. I actually did it - landed my first dev job!",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Mark Rodriguez",
    role: "Freelance Designer",
    content: "Finally launched my portfolio after months of procrastination. The AI knew exactly how to break down my project into manageable pieces.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Priya Patel",
    role: "Engineering Student",
    content: "Studying for my engineering exams was chaos until TodoAI. The adaptive planning saved me when I fell behind. Passed with flying colors!",
    rating: 5,
    avatar: "PP"
  }
]

const benefits = [
  {
    title: "Save 10+ Hours Per Week",
    description: "Stop planning and start doing. Our AI handles the complexity while you focus on execution."
  },
  {
    title: "Reduce Overwhelm by 80%",
    description: "Transform big, scary goals into small, manageable daily tasks that build momentum."
  },
  {
    title: "3x Higher Success Rate",
    description: "Users with AI-generated plans are 3x more likely to achieve their goals compared to self-planning."
  }
]

export function WhyTodoAI() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Why TodoAI Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands who transformed their ambitions into achievements
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 h-full hover:border-purple-500/50 transition-all duration-300">
                  <Quote className="w-8 h-8 text-purple-400 mb-4" />
                  
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
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
          <div className="inline-block bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6">
            <p className="text-green-300 font-medium">
              ⭐ 4.9/5 rating from <span className="text-white font-bold">1,200+</span> verified users
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 