"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Loader2, 
  ArrowLeft, 
  Lightbulb,
  Star,
  Calendar,
  Trophy,
  BookOpen,
  Dumbbell,
  Heart,
  Briefcase,
  Palette,
  DollarSign,
  Users,
  Home,
  Sparkles,
  Quote,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

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

// Enhanced form validation schema
const formSchema = z.object({
  goalName: z.string().min(1, "Goal name is required").max(100, "Goal name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  duration: z.string().min(1, "Duration is required"),
  timePerDay: z.number().min(0.5, "Minimum 0.5 hours per day").max(16, "Maximum 16 hours per day"),
  skillLevel: z.string().min(1, "Skill level is required"),
  successMetric: z.string().min(1, "Success metric is required"),
})

type FormData = z.infer<typeof formSchema>

const categoryOptions = [
  { value: "learning", label: "Learning & Education", icon: BookOpen, color: "text-blue-400" },
  { value: "fitness", label: "Health & Fitness", icon: Dumbbell, color: "text-green-400" },
  { value: "career", label: "Career & Business", icon: Briefcase, color: "text-purple-400" },
  { value: "creative", label: "Creative & Arts", icon: Palette, color: "text-pink-400" },
  { value: "financial", label: "Financial", icon: DollarSign, color: "text-yellow-400" },
  { value: "personal", label: "Personal Development", icon: Heart, color: "text-red-400" },
  { value: "social", label: "Relationships & Social", icon: Users, color: "text-indigo-400" },
  { value: "lifestyle", label: "Lifestyle & Habits", icon: Home, color: "text-orange-400" },
]

const priorityOptions = [
  { value: "low", label: "Low Priority", description: "Nice to have, flexible timeline" },
  { value: "medium", label: "Medium Priority", description: "Important but not urgent" },
  { value: "high", label: "High Priority", description: "Critical and time-sensitive" },
]

const durationOptions = [
  { value: "7", label: "1 Week", description: "Quick sprint goal" },
  { value: "14", label: "2 Weeks", description: "Short-term focus" },
  { value: "30", label: "1 Month", description: "Build momentum" },
  { value: "60", label: "2 Months", description: "Establish habits" },
  { value: "90", label: "3 Months", description: "Significant progress" },
  { value: "120", label: "4 Months", description: "Major milestone" },
  { value: "180", label: "6 Months", description: "Life-changing goal" },
  { value: "365", label: "1 Year", description: "Annual achievement" },
]

const skillLevelOptions = [
  { value: "beginner", label: "Beginner", description: "New to this area" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Experienced practitioner" },
]

const successMetrics = [
  { value: "completion", label: "Task Completion", description: "Complete specific tasks or milestones" },
  { value: "skill", label: "Skill Acquisition", description: "Learn new skills or improve existing ones" },
  { value: "quantity", label: "Quantity Target", description: "Achieve specific numbers or amounts" },
  { value: "quality", label: "Quality Improvement", description: "Enhance quality or performance" },
  { value: "habit", label: "Habit Formation", description: "Build consistent daily practices" },
  { value: "project", label: "Project Delivery", description: "Complete a specific project or creation" },
]

const motivationalQuotes = [
  "The journey of a thousand miles begins with one step.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Dreams don't work unless you do.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your limitation—it's only your imagination.",
  "Progress, not perfection, is the goal.",
]

export function CreateGoalPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [motivationalQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  )

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalName: "",
      description: "",
      category: "",
      priority: "",
      duration: "",
      timePerDay: 1,
      skillLevel: "",
      successMetric: "",
    },
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    console.log("🎯 Enhanced Form submitted with data:", data)
    
    // Simulate API call with enhanced data processing
    setTimeout(() => {
      console.log("🤖 Enhanced AI Plan Generated:", {
        goal: data.goalName,
        description: data.description,
        category: data.category,
        priority: data.priority,
        duration: `${data.duration} days`,
        dailyTime: `${data.timePerDay} hours`,
        skillLevel: data.skillLevel,
        successMetric: data.successMetric,
        enhancedPlan: {
          weeklyMilestones: Math.ceil(parseInt(data.duration) / 7),
          dailyTasks: `~${Math.ceil(data.timePerDay * 2)} tasks per day`,
          estimatedCompletion: `${Math.ceil(parseInt(data.duration) * 0.85)} days`,
          difficultyScore: data.skillLevel === "beginner" ? "Easy" : data.skillLevel === "intermediate" ? "Medium" : "Challenging",
          priorityImpact: data.priority === "high" ? "High Impact" : data.priority === "medium" ? "Medium Impact" : "Low Impact",
        }
      })
      setIsLoading(false)
      // Here you would typically redirect to the plan page or show success
    }, 3000)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToStep2 = form.watch("goalName") && form.watch("category") && form.watch("description")
  const canProceedToStep3 = canProceedToStep2 && form.watch("priority") && form.watch("duration")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-8"
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
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/50 rounded-full px-6 py-3 text-sm text-purple-300 mb-6">
              <Target className="w-4 h-4" />
              Create New Goal
              <span className="ml-2 bg-purple-500/30 rounded-full px-2 py-1 text-xs">Step {currentStep} of {totalSteps}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Turn Your Vision Into Reality
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Our AI will create a personalized roadmap with daily tasks, weekly milestones, and adaptive strategies to ensure your success.
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Motivational Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg px-6 py-3"
            >
              <Quote className="w-5 h-5 text-blue-400" />
              <p className="text-blue-300 italic font-medium">{motivationalQuote}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Multi-Step Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Step 1: Goal Basics */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Let's start with the basics</h2>
                      <p className="text-gray-400">Tell us what you want to achieve and why it matters to you</p>
                    </div>

                    {/* Goal Name */}
                    <FormField
                      control={form.control}
                      name="goalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            What's your goal?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Learn Python programming, Write a novel, Run a marathon, Start a business"
                              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 text-lg py-3"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Be specific and inspiring. This will be your north star.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Goal Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            Why is this goal important to you?
                          </FormLabel>
                          <FormControl>
                            <textarea
                              placeholder="Describe your motivation, the impact this goal will have on your life, and what success looks like to you..."
                              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 rounded-md px-3 py-3 min-h-[120px] resize-vertical focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Understanding your "why" helps create a more personalized and motivating plan.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category Selection */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-orange-400" />
                            What category best describes your goal?
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryOptions.map((category) => (
                              <motion.div
                                key={category.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                  field.value === category.value
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                }`}
                                onClick={() => field.onChange(category.value)}
                              >
                                <div className="flex items-center gap-3">
                                  <category.icon className={`w-6 h-6 ${category.color}`} />
                                  <div>
                                    <h3 className="font-medium text-white">{category.label}</h3>
                                  </div>
                                  {field.value === category.value && (
                                    <CheckCircle className="w-5 h-5 text-purple-400 ml-auto" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Step 2: Goal Configuration */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Configure your journey</h2>
                      <p className="text-gray-400">Set your timeline, commitment level, and success criteria</p>
                    </div>

                    {/* Priority Level */}
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            How important is this goal to you?
                          </FormLabel>
                          <div className="space-y-3">
                            {priorityOptions.map((priority) => (
                              <motion.div
                                key={priority.value}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                  field.value === priority.value
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                }`}
                                onClick={() => field.onChange(priority.value)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium text-white">{priority.label}</h3>
                                    <p className="text-sm text-gray-400">{priority.description}</p>
                                  </div>
                                  {field.value === priority.value && (
                                    <CheckCircle className="w-5 h-5 text-purple-400" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
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
                            <Calendar className="w-5 h-5 text-blue-400" />
                            What's your target timeline?
                          </FormLabel>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {durationOptions.map((duration) => (
                              <motion.div
                                key={duration.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                  field.value === duration.value
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                }`}
                                onClick={() => field.onChange(duration.value)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium text-white">{duration.label}</h3>
                                    <p className="text-sm text-gray-400">{duration.description}</p>
                                  </div>
                                  {field.value === duration.value && (
                                    <CheckCircle className="w-5 h-5 text-purple-400" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Success Metric */}
                    <FormField
                      control={form.control}
                      name="successMetric"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            How will you measure success?
                          </FormLabel>
                          <div className="space-y-3">
                            {successMetrics.map((metric) => (
                              <motion.div
                                key={metric.value}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                  field.value === metric.value
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                }`}
                                onClick={() => field.onChange(metric.value)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium text-white">{metric.label}</h3>
                                    <p className="text-sm text-gray-400">{metric.description}</p>
                                  </div>
                                  {field.value === metric.value && (
                                    <CheckCircle className="w-5 h-5 text-purple-400" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Step 3: Personal Details */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Personalize your plan</h2>
                      <p className="text-gray-400">Help us tailor the perfect roadmap for your experience level and availability</p>
                    </div>

                    {/* Time per Day */}
                    <FormField
                      control={form.control}
                      name="timePerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-400" />
                            How much time can you dedicate daily?
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                min="0.5"
                                max="16"
                                step="0.5"
                                placeholder="1"
                                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-purple-500 text-lg py-3"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                              <div className="flex justify-between text-sm text-gray-400">
                                <span>0.5 hrs (Quick daily progress)</span>
                                <span>{field.value} hours</span>
                                <span>16 hrs (Intensive focus)</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-gray-400 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-blue-400" />
                            Consider your other commitments. It's better to be consistent with less time than ambitious and inconsistent.
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
                            What's your current experience level?
                          </FormLabel>
                          <div className="space-y-3">
                            {skillLevelOptions.map((skill) => (
                              <motion.div
                                key={skill.value}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                                  field.value === skill.value
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                                }`}
                                onClick={() => field.onChange(skill.value)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium text-white">{skill.label}</h3>
                                    <p className="text-sm text-gray-400">{skill.description}</p>
                                  </div>
                                  {field.value === skill.value && (
                                    <CheckCircle className="w-5 h-5 text-purple-400" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* AI Plan Preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Your AI Plan Preview</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-2xl font-bold text-purple-400">{Math.ceil(parseInt(form.watch("duration") || "30") / 7)}</p>
                          <p className="text-sm text-gray-400">Weekly Milestones</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-2xl font-bold text-blue-400">{Math.ceil((form.watch("timePerDay") || 1) * 2)}</p>
                          <p className="text-sm text-gray-400">Daily Tasks</p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-2xl font-bold text-green-400">{Math.ceil(parseInt(form.watch("duration") || "30") * 0.85)}</p>
                          <p className="text-sm text-gray-400">Days to Success</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={prevStep}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      variant="glow"
                      size="lg"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !canProceedToStep2) ||
                        (currentStep === 2 && !canProceedToStep3)
                      }
                      className="flex-1 group"
                    >
                      Continue
                      <Target className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    </Button>
                  ) : (
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
                          Creating Your AI Plan...
                        </>
                      ) : (
                        <>
                          Generate My AI Plan
                          <Sparkles className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}
                  
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

          {/* Enhanced Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 text-sm font-medium mb-1">Personalized Roadmap</p>
              <p className="text-blue-200/70 text-xs">Custom plan tailored to your goals</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 text-sm font-medium mb-1">Adaptive Scheduling</p>
              <p className="text-purple-200/70 text-xs">AI adjusts to your progress</p>
            </div>
            <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 text-sm font-medium mb-1">Success Tracking</p>
              <p className="text-green-200/70 text-xs">Monitor your journey to success</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 