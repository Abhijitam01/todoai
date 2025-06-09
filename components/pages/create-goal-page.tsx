"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Target, Clock, TrendingUp, Loader2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Form validation schema
const formSchema = z.object({
  goalName: z.string().min(1, "Goal name is required").max(100, "Goal name must be less than 100 characters"),
  duration: z.string().min(1, "Duration is required"),
  timePerDay: z.number().min(0.5, "Minimum 0.5 hours per day").max(16, "Maximum 16 hours per day"),
  skillLevel: z.string().min(1, "Skill level is required"),
})

type FormData = z.infer<typeof formSchema>

const durationOptions = [
  { value: "7", label: "1 Week" },
  { value: "14", label: "2 Weeks" },
  { value: "30", label: "1 Month" },
  { value: "60", label: "2 Months" },
  { value: "90", label: "3 Months" },
  { value: "120", label: "4 Months" },
  { value: "180", label: "6 Months" },
]

const skillLevelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

export function CreateGoalPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalName: "",
      duration: "",
      timePerDay: 1,
      skillLevel: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    console.log("🎯 Form submitted with data:", data)
    
    // Simulate API call with 2-second delay
    setTimeout(() => {
      console.log("🤖 Mock AI Plan Generated:", {
        goal: data.goalName,
        duration: `${data.duration} days`,
        dailyTime: `${data.timePerDay} hours`,
        skillLevel: data.skillLevel,
        mockPlan: {
          weeklyMilestones: Math.ceil(parseInt(data.duration) / 7),
          dailyTasks: `~${Math.ceil(data.timePerDay * 2)} tasks per day`,
          estimatedCompletion: `${Math.ceil(parseInt(data.duration) * 0.85)} days`,
        }
      })
      setIsLoading(false)
      // Here you would typically redirect to the plan page or show success
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <Button 
            variant="ghost" 
            size="sm"
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-4 py-2 text-sm text-purple-300 mb-6">
              <Target className="w-4 h-4" />
              Create New Goal
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              What do you want to achieve?
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tell us about your goal and we'll create a personalized AI-powered plan to help you succeed.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Goal Name */}
                <FormField
                  control={form.control}
                  name="goalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        Goal Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Learn Python programming, Write a novel, Get fit for marathon"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Be specific about what you want to achieve.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        Duration
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white focus:bg-slate-700">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400">
                        How long do you want to spend achieving this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time per Day */}
                <FormField
                  control={form.control}
                  name="timePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-400" />
                        Time per Day (hours)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0.5"
                          max="16"
                          step="0.5"
                          placeholder="1"
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        How many hours per day can you dedicate to this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Skill Level */}
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        Skill Level
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select your current level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {skillLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white focus:bg-slate-700">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400">
                        What's your current skill level in this area?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    variant="glow"
                    size="lg"
                    disabled={isLoading}
                    className="flex-1 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        Generate Plan
                        <Target className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => form.reset()}
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4">
              <p className="text-purple-300 text-sm">
                🤖 Our AI will create a personalized plan with weekly milestones and daily tasks
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 