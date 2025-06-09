"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does TodoAI create personalized goal plans?",
    answer: "TodoAI uses advanced machine learning to analyze your goal, available time, current skill level, and preferences. It then breaks down your objective into weekly milestones and daily tasks that fit your schedule and learning style, ensuring realistic and achievable progress."
  },
  {
    question: "What happens if I miss a day or fall behind?",
    answer: "Life happens! TodoAI automatically adjusts your plan when you miss tasks. It redistributes your workload across upcoming days and adjusts timelines to keep you on track without overwhelming you. The AI learns from your patterns to create more realistic future plans."
  },
  {
    question: "What types of goals work best with TodoAI?", 
    answer: "TodoAI works with virtually any goal that can be broken into smaller actions. Popular categories include learning new skills (languages, instruments, coding), fitness goals, business objectives, creative projects, and academic achievements. Our AI has templates for 100+ goal types."
  },
  {
    question: "How much time do I need to spend on TodoAI daily?",
    answer: "TodoAI is designed to fit your life, not control it. Most users spend 2-5 minutes daily reviewing tasks and updating progress. You can set your available time (15 minutes to several hours), and TodoAI creates plans that match your schedule."
  },
  {
    question: "Is my goal and progress data secure?",
    answer: "Absolutely. Your data is encrypted end-to-end and stored securely. We never share your personal goals or progress with third parties. You own your data and can export or delete it anytime. We're GDPR compliant and take privacy seriously."
  },
  {
    question: "Can I use TodoAI for multiple goals simultaneously?",
    answer: "Yes! TodoAI can manage multiple goals and coordinate them intelligently. It considers your total available time and energy to balance progress across all goals without burnout. Premium users can track unlimited goals with advanced scheduling optimization."
  }
]

export function FAQSection() {
  return (
    <section className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-red-400 mb-4 tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Everything you need to know about TodoAI
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions? We've got answers. Here are the most common questions about how TodoAI works.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className="bg-gray-900/50 border border-gray-800 rounded-lg px-6 hover:bg-gray-800/50 hover:border-red-500/30 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-white text-lg font-medium hover:text-gray-300 py-6 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 