"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, CheckCircle, Clock, Target } from "lucide-react"

export function DemoPreview() {
  return (
    <section className="py-24 bg-slate-800/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            See TodoAI in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch how Sarah transformed her goal "Learn Python in 90 days" into a structured daily plan
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Demo Interface Mockup */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-slate-800 px-6 py-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <h3 className="text-white font-semibold">TodoAI Dashboard</h3>
                  </div>
                  <div className="text-sm text-gray-400">Day 15 of 90</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                {/* Goal Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Target className="w-6 h-6 text-purple-400" />
                      Learn Python in 90 Days
                    </h3>
                    <div className="text-purple-400 font-semibold">83% on track</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>17%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "17%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      ></motion.div>
                    </div>
                  </div>
                </div>

                {/* Today's Tasks */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Today's Tasks
                  </h4>
                  <div className="space-y-3">
                    {[
                      { task: "Complete Python functions tutorial", done: true },
                      { task: "Practice writing 3 simple functions", done: true },
                      { task: "Read about function parameters and return values", done: false },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          item.done ? 'bg-green-900/30 border border-green-700/50' : 'bg-slate-800 border border-slate-700'
                        }`}
                      >
                        <CheckCircle className={`w-5 h-5 ${item.done ? 'text-green-400' : 'text-gray-500'}`} />
                        <span className={`${item.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {item.task}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Play Button Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Button
                variant="glow"
                size="xl"
                className="group"
              >
                <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                Try the Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-lg">
              🎯 Interactive demo • 🎯 No signup required • 🎯 See real AI planning
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 