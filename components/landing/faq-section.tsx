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
    question: "How does TodoAI create personalized plans?",
    answer: "TodoAI uses advanced AI to analyze your goal, timeframe, and available time per day. It then breaks down your goal into weekly milestones and daily tasks, considering your skill level and learning curve. Each plan is unique to your specific situation and adapts as you progress."
  },
  {
    question: "What happens if I miss tasks or fall behind?",
    answer: "No worries! TodoAI's adaptive planning automatically adjusts your remaining tasks when you miss a day. It redistributes the workload across your remaining timeline while keeping your end goal achievable. You'll get notifications about plan changes and suggestions to get back on track."
  },
  {
    question: "Can I manage multiple goals at the same time?",
    answer: "Yes! Premium users can create and manage multiple goals simultaneously. TodoAI will balance your daily tasks across all active goals, ensuring you make progress on everything without overwhelming your schedule. Free users can have one active goal at a time."
  },
  {
    question: "What types of goals work best with TodoAI?",
    answer: "TodoAI excels with skill-based goals (learning programming, languages, instruments), project goals (building a portfolio, writing a book), fitness goals (training for a marathon), and study goals (preparing for exams). Any goal that can be broken into progressive steps works great!"
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. Your goals and progress data are encrypted and stored securely. We never share your personal information or goals with third parties. You can export your data anytime and delete your account if needed. Privacy is a core principle of our platform."
  },
  {
    question: "How much does TodoAI cost?",
    answer: "TodoAI offers a generous free tier that includes one active goal with basic features. Our Premium plan ($9/month) includes unlimited goals, advanced customization, priority support, and AI chat assistance. You can cancel anytime with no questions asked."
  }
]

export function FAQSection() {
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
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about TodoAI
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
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-6 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-white text-lg font-medium hover:text-purple-300 py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 text-base leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6">
            <p className="text-blue-300 font-medium">
              Still have questions? <span className="text-white font-bold">Contact our team</span> - we respond within 2 hours
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 