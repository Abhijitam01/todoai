"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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
  Info,
  ArrowRight,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/lib/stores/taskStore";
import { useTaskToasts } from "@/components/ui/toast";
import { SnoozeDialog } from "@/components/tasks/SnoozeDialog";

// Form validation schema
const formSchema = z.object({
  goalName: z.string().min(1, "Goal name is required").max(100, "Goal name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  duration: z.string().min(1, "Duration is required"),
  timePerDay: z.number().min(0.5, "Minimum 0.5 hours per day").max(16, "Maximum 16 hours per day"),
  skillLevel: z.string().min(1, "Skill level is required"),
  successMetric: z.string().min(1, "Success metric is required"),
});

type FormData = z.infer<typeof formSchema>;

const categoryOptions = [
  { value: "learning", label: "Learning & Education", icon: BookOpen, color: "text-blue-400" },
  { value: "fitness", label: "Health & Fitness", icon: Dumbbell, color: "text-green-400" },
  { value: "career", label: "Career & Business", icon: Briefcase, color: "text-purple-400" },
  { value: "creative", label: "Creative & Arts", icon: Palette, color: "text-pink-400" },
  { value: "financial", label: "Financial", icon: DollarSign, color: "text-yellow-400" },
  { value: "personal", label: "Personal Development", icon: Heart, color: "text-red-400" },
  { value: "social", label: "Relationships & Social", icon: Users, color: "text-indigo-400" },
  { value: "lifestyle", label: "Lifestyle & Habits", icon: Home, color: "text-orange-400" },
];

const priorityOptions = [
  { value: "low", label: "Low Priority", description: "Nice to have, flexible timeline", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { value: "medium", label: "Medium Priority", description: "Important but not urgent", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { value: "high", label: "High Priority", description: "Critical and time-sensitive", color: "bg-red-500/10 text-red-400 border-red-500/20" },
];

const durationOptions = [
  { value: "7", label: "1 Week", description: "Quick sprint goal" },
  { value: "14", label: "2 Weeks", description: "Short-term focus" },
  { value: "30", label: "1 Month", description: "Build momentum" },
  { value: "60", label: "2 Months", description: "Establish habits" },
  { value: "90", label: "3 Months", description: "Significant progress" },
  { value: "180", label: "6 Months", description: "Life-changing goal" },
  { value: "365", label: "1 Year", description: "Annual achievement" },
];

const skillLevelOptions = [
  { value: "beginner", label: "Beginner", description: "New to this area" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "advanced", label: "Advanced", description: "Experienced practitioner" },
];

const successMetrics = [
  { value: "completion", label: "Task Completion", description: "Complete specific tasks or milestones" },
  { value: "skill", label: "Skill Acquisition", description: "Learn new skills or improve existing ones" },
  { value: "quantity", label: "Quantity Target", description: "Achieve specific numbers or amounts" },
  { value: "quality", label: "Quality Improvement", description: "Enhance quality or performance" },
  { value: "habit", label: "Habit Formation", description: "Build consistent daily practices" },
  { value: "project", label: "Project Delivery", description: "Complete a specific project or creation" },
];

const motivationalQuotes = [
  "The journey of a thousand miles begins with one step.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Dreams don't work unless you do.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Your limitation—it's only your imagination.",
  "Progress, not perfection, is the goal.",
];

export default function CreateGoalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [motivationalQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Add toast notifications
  const toasts = useTaskToasts();

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
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    console.log("🎯 Goal Creation Form submitted:", data);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional failures for demonstration
          if (Math.random() > 0.9) {
            reject(new Error("Plan generation service temporarily unavailable"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      // Show success toast
      toasts.onSuccess(`Goal "${data.goalName}" created successfully! Generating your AI plan...`);
      
      setIsLoading(false);
      // Redirect to plan preview with the form data
      router.push("/plan-preview");
    } catch (error) {
      setIsLoading(false);
      // Show error toast
      toasts.onError(error instanceof Error ? error.message : "Failed to create goal. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = form.watch("goalName") && form.watch("category");
  const canProceedToStep3 = canProceedToStep2 && form.watch("priority") && form.watch("duration");

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            Create Goal
          </h1>
          <p className="text-gray-400 mt-2">
            Turn your vision into reality with AI-powered planning
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => router.push("/dashboard")}
          className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span className={currentStep >= 1 ? "text-purple-400" : ""}>Basic Info</span>
              <span className={currentStep >= 2 ? "text-purple-400" : ""}>Configuration</span>
              <span className={currentStep >= 3 ? "text-purple-400" : ""}>Review</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-8">
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
                      <h2 className="text-2xl font-bold text-white mb-2">What's your goal?</h2>
                      <p className="text-gray-400">Tell us what you want to achieve and why it matters</p>
                    </div>

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
                              placeholder="e.g., Learn Python programming, Write a novel, Run a marathon"
                              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 text-lg py-6"
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
                            <Textarea
                              placeholder="Describe your motivation and what success looks like..."
                              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Understanding your "why" helps create a more personalized plan.
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
                            Category
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
                                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
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

                {/* Step 2: Configuration */}
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
                            Priority Level
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
                                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                                }`}
                                onClick={() => field.onChange(priority.value)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium text-white">{priority.label}</h3>
                                    <p className="text-sm text-gray-400">{priority.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={priority.color}>
                                      {priority.value}
                                    </Badge>
                                    {field.value === priority.value && (
                                      <CheckCircle className="w-5 h-5 text-purple-400" />
                                    )}
                                  </div>
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
                            How long do you want to work on this goal?
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white text-lg py-6">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {durationOptions.map((duration) => (
                                <SelectItem 
                                  key={duration.value} 
                                  value={duration.value}
                                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                                >
                                  <div>
                                    <div className="font-medium">{duration.label}</div>
                                    <div className="text-sm text-gray-400">{duration.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Time Per Day */}
                    <FormField
                      control={form.control}
                      name="timePerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-400" />
                            Daily time commitment (hours)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <Input
                                type="number"
                                min="0.5"
                                max="16"
                                step="0.5"
                                className="bg-gray-800/50 border-gray-600 text-white text-lg py-6"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                              <div className="flex justify-between text-sm text-gray-400">
                                <span>0.5 hrs (Quick progress)</span>
                                <span className="text-purple-400 font-medium">{field.value} hours daily</span>
                                <span>16 hrs (Intensive)</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-gray-400 flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-blue-400" />
                            Consider your schedule. Consistency matters more than intensity.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Step 3: Review & Finalize */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Final touches</h2>
                      <p className="text-gray-400">Complete your profile and review your goal</p>
                    </div>

                    {/* Skill Level */}
                    <FormField
                      control={form.control}
                      name="skillLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                            Current experience level
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
                                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
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

                    {/* Success Metric */}
                    <FormField
                      control={form.control}
                      name="successMetric"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            How will you measure success?
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white text-lg py-6">
                                <SelectValue placeholder="Select success metric" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              {successMetrics.map((metric) => (
                                <SelectItem 
                                  key={metric.value} 
                                  value={metric.value}
                                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                                >
                                  <div>
                                    <div className="font-medium">{metric.label}</div>
                                    <div className="text-sm text-gray-400">{metric.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Goal Summary */}
                    <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Your Goal Summary</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div><span className="text-gray-400">Goal:</span> <span className="text-white font-medium">{form.watch("goalName") || "Not specified"}</span></div>
                        <div><span className="text-gray-400">Category:</span> <span className="text-white">{categoryOptions.find(c => c.value === form.watch("category"))?.label || "Not selected"}</span></div>
                        <div><span className="text-gray-400">Duration:</span> <span className="text-white">{durationOptions.find(d => d.value === form.watch("duration"))?.label || "Not selected"}</span></div>
                        <div><span className="text-gray-400">Daily Time:</span> <span className="text-white">{form.watch("timePerDay")} hours</span></div>
                        <div><span className="text-gray-400">Priority:</span> <span className="text-white capitalize">{form.watch("priority") || "Not selected"}</span></div>
                      </div>
                    </div>

                    {/* Motivational Quote */}
                    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6 text-center">
                      <Quote className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <p className="text-blue-300 italic font-medium text-lg">{motivationalQuote}</p>
                    </div>
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
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !canProceedToStep2) ||
                        (currentStep === 2 && !canProceedToStep3)
                      }
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Your AI Plan...
                        </>
                      ) : (
                        <>
                          Generate My AI Plan
                          <Sparkles className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-blue-300 font-medium mb-2">Personalized Roadmap</h3>
            <p className="text-blue-200/70 text-sm">Custom plan tailored to your goals</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-purple-300 font-medium mb-2">Adaptive Scheduling</h3>
            <p className="text-purple-200/70 text-sm">AI adjusts to your progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-green-300 font-medium mb-2">Success Tracking</h3>
            <p className="text-green-200/70 text-sm">Monitor your journey to success</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 