"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ExternalLink, Image as ImageIcon, Calendar, Target, CheckCircle2, ArrowRight, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Types
interface Resource {
  label: string
  url: string
}

interface TaskDetails {
  description: string
  resources: Resource[]
  screenshot?: string
}

interface DayTask {
  day: number
  task: string
  details: TaskDetails
  estimatedTime?: number
}

interface WeekPlan {
  week: number
  milestone: string
  days: DayTask[]
}

interface PlanPreviewProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onReject: () => void
  plan: WeekPlan[]
  goalName: string
  totalDays: number
  timePerDay: number
  skillLevel: string
  isLoading?: boolean
}

// TaskItem Component for modularity
interface TaskItemProps {
  task: DayTask
  weekNumber: number
  isExpanded: boolean
  onToggle: () => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, weekNumber, isExpanded, onToggle }) => {
  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800/50 transition-all duration-200 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-sm font-semibold">
            {task.day}
          </div>
          <span className="text-white font-medium">{task.task}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-800">
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{task.details.description}</p>
                </div>

                {/* Resources */}
                {task.details.resources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Resources</h4>
                    <div className="space-y-2">
                      {task.details.resources.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ExternalLink className="h-3 w-3 group-hover:scale-110 transition-transform" />
                          <span className="underline underline-offset-2">{resource.label}</span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Screenshot */}
                {task.details.screenshot && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Preview</h4>
                    <div className="relative group">
                      <img
                        src={task.details.screenshot}
                        alt={`Screenshot for ${task.task}`}
                        className="w-full max-w-md rounded-lg border border-gray-700 transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback when image doesn't exist
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.nextSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                      <div 
                        className="hidden w-full max-w-md h-32 rounded-lg border border-gray-700 bg-gray-800 items-center justify-center"
                        style={{ display: 'none' }}
                      >
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-sm">Preview not available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main PlanPreview Component
export function PlanPreview({
  isOpen,
  onClose,
  onAccept,
  onReject,
  plan,
  goalName,
  totalDays,
  timePerDay,
  skillLevel,
  isLoading = false
}: PlanPreviewProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]))

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks)
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber)
    } else {
      newExpanded.add(weekNumber)
    }
    setExpandedWeeks(newExpanded)
  }

  const totalTasks = plan.reduce((sum, week) => sum + week.days.length, 0)
  const estimatedWeeks = Math.ceil(totalDays / 7)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gray-900 border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-white">
                Your AI-Generated Plan
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-1">
                Review your personalized roadmap for "{goalName}"
              </p>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">AI is crafting your perfect plan...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Plan Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{totalDays}</div>
                <div className="text-xs text-gray-400">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{plan.length}</div>
                <div className="text-xs text-gray-400">Weeks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{totalTasks}</div>
                <div className="text-xs text-gray-400">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{timePerDay}h</div>
                <div className="text-xs text-gray-400">Per Day</div>
              </div>
            </div>

            {/* Plan Timeline */}
            <ScrollArea className="flex-1 max-h-96 pr-4">
              <div className="space-y-4 py-4">
                {plan.map((week, weekIndex) => (
                  <motion.div
                    key={week.week}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: weekIndex * 0.1 }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                      <button
                        onClick={() => toggleWeek(week.week)}
                        className="w-full p-4 text-left hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              Week {week.week}
                            </Badge>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Target className="w-4 h-4" />
                              <span className="font-medium">{week.milestone}</span>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedWeeks.has(week.week) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedWeeks.has(week.week) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-2 border-t border-gray-700/50">
                              {week.days.map((day, dayIndex) => (
                                <motion.div
                                  key={day.day}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: dayIndex * 0.05 }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/20 transition-colors"
                                >
                                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300">
                                    {day.day}
                                  </div>
                                  <div className="flex-1 text-sm text-gray-300">
                                    {day.task}
                                  </div>
                                  {day.estimatedTime && (
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                      <Clock className="w-3 h-3" />
                                      {day.estimatedTime}min
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-gray-400">
              Skill Level: <span className="capitalize font-medium">{skillLevel}</span> • 
              Estimated completion: {estimatedWeeks} weeks
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onReject}
                className="border-gray-600 hover:border-gray-500"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={onAccept}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Start This Plan
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 