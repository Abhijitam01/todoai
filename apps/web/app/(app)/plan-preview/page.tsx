"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Target, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Play,
  Edit,
  Save,
  RotateCcw,
  Download,
  Share,
  Star,
  Trophy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Link,
  Lightbulb,
  Zap,
  Loader2,
  CheckCircle2,
  PlayCircle,
  Copy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTaskToasts } from "@/components/ui/toast";

// Types
interface Resource {
  type: "article" | "video" | "tutorial" | "tool" | "book";
  title: string;
  url: string;
  description: string;
  duration?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  resources: Resource[];
  completed: boolean;
}

interface Milestone {
  id: string;
  week: number;
  title: string;
  description: string;
  tasks: Task[];
  progress: number;
}

interface PlanData {
  goalName: string;
  category: string;
  duration: string;
  totalWeeks: number;
  estimatedHours: number;
  milestones: Milestone[];
  skillLevel: string;
  priority: string;
}

// Sample plan data
const mockPlanData: PlanData = {
  goalName: "Learn Python Programming",
  category: "Learning & Education",
  duration: "3 months",
  totalWeeks: 12,
  estimatedHours: 120,
  skillLevel: "beginner",
  priority: "high",
  milestones: [
    {
      id: "week-1",
      week: 1,
      title: "Python Fundamentals",
      description: "Set up development environment and learn basic syntax",
      progress: 0,
      tasks: [
        {
          id: "task-1-1",
          title: "Install Python & Setup IDE",
          description: "Download Python, install VS Code, and configure Python extension for development",
          estimatedTime: "30 min",
          difficulty: "easy",
          completed: false,
          resources: [
            {
              type: "tutorial",
              title: "Python Installation Guide",
              url: "https://python.org",
              description: "Official Python installation guide",
              duration: "10 min"
            },
            {
              type: "video",
              title: "VS Code Python Setup",
              url: "https://youtube.com",
              description: "Complete VS Code setup for Python development",
              duration: "15 min"
            }
          ]
        },
        {
          id: "task-1-2",
          title: "Variables and Data Types",
          description: "Learn about strings, integers, floats, booleans, and type conversion",
          estimatedTime: "2 hours",
          difficulty: "easy",
          completed: false,
          resources: [
            {
              type: "article",
              title: "Python Data Types",
              url: "https://realpython.com",
              description: "Comprehensive guide to Python data types"
            },
            {
              type: "tutorial",
              title: "Interactive Python Tutorial",
              url: "https://codecademy.com",
              description: "Hands-on practice with Python basics"
            }
          ]
        },
        {
          id: "task-1-3",
          title: "Input/Output Operations",
          description: "Master print() and input() functions for user interaction",
          estimatedTime: "1 hour",
          difficulty: "easy",
          completed: false,
          resources: [
            {
              type: "tutorial",
              title: "Python I/O Tutorial",
              url: "https://w3schools.com",
              description: "Learn input and output in Python",
              duration: "30 min"
            }
          ]
        }
      ]
    },
    {
      id: "week-2",
      week: 2,
      title: "Control Structures",
      description: "Learn conditional statements and loops",
      progress: 0,
      tasks: [
        {
          id: "task-2-1",
          title: "If-Else Statements",
          description: "Master conditional logic and decision making in Python",
          estimatedTime: "2 hours",
          difficulty: "medium",
          completed: false,
          resources: [
            {
              type: "video",
              title: "Python Conditionals Explained",
              url: "https://youtube.com",
              description: "Visual explanation of if-else statements",
              duration: "25 min"
            }
          ]
        },
        {
          id: "task-2-2",
          title: "For and While Loops",
          description: "Learn iteration and repetition in programming",
          estimatedTime: "3 hours",
          difficulty: "medium",
          completed: false,
          resources: [
            {
              type: "tutorial",
              title: "Python Loops Masterclass",
              url: "https://realpython.com",
              description: "Complete guide to Python loops"
            }
          ]
        }
      ]
    },
    {
      id: "week-3",
      week: 3,
      title: "Functions and Modules",
      description: "Create reusable code with functions and organize with modules",
      progress: 0,
      tasks: [
        {
          id: "task-3-1",
          title: "Defining Functions",
          description: "Learn to create and use functions effectively",
          estimatedTime: "2.5 hours",
          difficulty: "medium",
          completed: false,
          resources: [
            {
              type: "article",
              title: "Python Functions Guide",
              url: "https://docs.python.org",
              description: "Official Python functions documentation"
            }
          ]
        }
      ]
    }
  ]
};

const resourceIcons = {
  article: FileText,
  video: Video,
  tutorial: BookOpen,
  tool: Zap,
  book: BookOpen
};

const difficultyColors = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20"
};

// Loading skeleton components
const PlanSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-10 w-64 bg-gray-800 mb-2" />
        <Skeleton className="h-6 w-80 bg-gray-800" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24 bg-gray-800" />
        <Skeleton className="h-10 w-20 bg-gray-800" />
      </div>
    </div>

    {/* Plan Summary Skeleton */}
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-16 h-16 rounded-full bg-gray-800 mx-auto mb-3" />
              <Skeleton className="h-8 w-12 bg-gray-800 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 bg-gray-800 mx-auto" />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Skeleton className="h-12 w-48 bg-gray-800 mx-auto" />
        </div>
      </CardContent>
    </Card>

    {/* Tabs Skeleton */}
    <div className="space-y-6">
      <Skeleton className="h-10 w-full bg-gray-800" />
      
      {/* Progress Overview Skeleton */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-gray-800" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 bg-gray-800" />
            <Skeleton className="h-4 w-12 bg-gray-800" />
          </div>
          <Skeleton className="h-2 w-full bg-gray-800" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                <Skeleton className="h-5 w-20 bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-32 bg-gray-800 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16 bg-gray-800" />
                  <Skeleton className="h-3 w-8 bg-gray-800" />
                </div>
                <Skeleton className="h-1 w-full bg-gray-800 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones Skeleton */}
      <Card className="bg-gray-900/50 border-gray-700/50">
        <CardHeader>
          <Skeleton className="h-6 w-48 bg-gray-800" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-800" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 bg-gray-800 mb-2" />
                  <Skeleton className="h-4 w-64 bg-gray-800" />
                </div>
                <Skeleton className="w-16 h-6 bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function PlanPreviewPage() {
  const router = useRouter();
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Add toast notifications
  const toasts = useTaskToasts();

  useEffect(() => {
    // Simulate plan generation loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes: uncomment the line below to test error state
      // setHasError(true);
      
      // Set the mock plan data if no error
      if (!hasError) {
        setPlanData(mockPlanData);
        toasts.onSuccess("Your AI plan has been generated successfully!");
      } else {
        toasts.onError("Failed to generate your AI plan. Please try again.");
      }
    }, 2000);
    
    return () => clearTimeout(loadingTimer);
  }, [hasError, toasts]);

  const toggleTaskCompletion = (milestoneId: string, taskId: string) => {
    setPlanData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        milestones: prev.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            const updatedTasks = milestone.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            const completedTasks = updatedTasks.filter(task => task.completed).length;
            const progress = (completedTasks / updatedTasks.length) * 100;
            
            return {
              ...milestone,
              tasks: updatedTasks,
              progress
            };
          }
          return milestone;
        })
      } as PlanData;
    });
  };

  const startPlan = async () => {
    setIsStarting(true);
    try {
      // Simulate API call to start the plan
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.95) {
            reject(new Error("Failed to start plan"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      toasts.onSuccess(`Plan "${planData?.goalName}" started! Your journey begins now.`);
      router.push("/dashboard");
    } catch (error) {
      setIsStarting(false);
      toasts.onError("Failed to start plan. Please try again.");
    }
  };

  const handleRetryGeneration = () => {
    setIsLoading(true);
    setHasError(false);
    toasts.onSuccess("Retrying plan generation...");
    // This would normally trigger a new plan generation request
  };

  const copyPlanSummary = async () => {
    if (!planData) return;
    
    const summary = `
🎯 Goal: ${planData.goalName}
📚 Category: ${planData.category}
⏱️ Duration: ${planData.duration}
📈 Skill Level: ${planData.skillLevel}
🔥 Priority: ${planData.priority}
📊 Total Weeks: ${planData.totalWeeks}
⭐ Estimated Hours: ${planData.estimatedHours}

📋 Milestones:
${planData.milestones.map((milestone, index) => 
  `${index + 1}. Week ${milestone.week}: ${milestone.title}
   ${milestone.description}
   Tasks: ${milestone.tasks.length}`
).join('\n\n')}

Generated by TodoAI 🤖
    `.trim();

    try {
      await navigator.clipboard.writeText(summary);
      toasts.onSuccess("Plan summary copied to clipboard!");
    } catch (error) {
      toasts.onError("Failed to copy to clipboard");
    }
  };

  if (isLoading) {
    return <PlanSkeleton />;
  }

  if (hasError || !planData) {
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
              Plan Generation
            </h1>
            <p className="text-gray-400 mt-2">
              Unable to generate your AI plan
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => router.push("/create-goal")}
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Create Goal
          </Button>
        </motion.div>

        <EmptyState
          icon="⚠️"
          title="Unable to generate plan"
          description="We encountered an issue while creating your personalized plan. Please try again or modify your goal parameters."
          action={{
            label: "Try Again",
            onClick: handleRetryGeneration
          }}
          className="py-16"
        />
      </div>
    );
  }

  const overallProgress = planData.milestones.reduce((acc, milestone) => acc + milestone.progress, 0) / planData.milestones.length;

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
            Your AI Plan
          </h1>
          <p className="text-gray-400 mt-2">
            Personalized roadmap for "{planData.goalName}"
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push("/create-goal")}
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Goal
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline"
            onClick={copyPlanSummary}
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Summary
          </Button>
        </div>
      </motion.div>

      {/* Plan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-500/30">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{planData.totalWeeks}</p>
                <p className="text-gray-400 text-sm">Weeks</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{planData.estimatedHours}</p>
                <p className="text-gray-400 text-sm">Total Hours</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{planData.milestones.length}</p>
                <p className="text-gray-400 text-sm">Milestones</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white capitalize">{planData.skillLevel}</p>
                <p className="text-gray-400 text-sm">Level</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button
                onClick={startPlan}
                disabled={isStarting}
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3"
              >
                {isStarting ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Starting Your Journey...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start This Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              Detailed Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Overall Progress</span>
                  <span className="text-purple-400 font-medium">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {planData.milestones.slice(0, 3).map((milestone) => (
                    <div key={milestone.id} className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">Week {milestone.week}</h4>
                      <p className="text-sm text-gray-400 mb-3">{milestone.title}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-purple-400">{Math.round(milestone.progress)}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones Summary */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-purple-400" />
                  Weekly Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {planData.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-semibold">{milestone.week}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{milestone.title}</h4>
                        <p className="text-sm text-gray-400">{milestone.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {milestone.tasks.length} tasks
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {milestone.tasks.filter(t => t.completed).length} completed
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-purple-400 font-medium">{Math.round(milestone.progress)}%</p>
                        <Progress value={milestone.progress} className="w-20 h-1 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Detailed Learning Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {planData.milestones.map((milestone) => (
                    <AccordionItem
                      key={milestone.id}
                      value={milestone.id}
                      className="bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-400 font-semibold text-sm">{milestone.week}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{milestone.title}</h4>
                            <p className="text-sm text-gray-400">{milestone.description}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-4">
                          {milestone.tasks.map((task) => (
                            <div
                              key={task.id}
                              className={`p-4 rounded-lg border transition-all duration-200 ${
                                task.completed 
                                  ? 'bg-green-500/10 border-green-500/30' 
                                  : 'bg-gray-800/50 border-gray-600'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleTaskCompletion(milestone.id, task.id)}
                                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                    task.completed
                                      ? 'bg-green-500 border-green-500'
                                      : 'border-gray-400 hover:border-purple-400'
                                  }`}
                                >
                                  {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                                </button>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className={`font-medium ${task.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                                      {task.title}
                                    </h5>
                                    <div className="flex items-center gap-2">
                                      <Badge className={difficultyColors[task.difficulty]}>
                                        {task.difficulty}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {task.estimatedTime}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                                  
                                  {task.resources.length > 0 && (
                                    <div>
                                      <h6 className="text-sm font-medium text-gray-300 mb-2">Resources:</h6>
                                      <div className="space-y-2">
                                        {task.resources.map((resource, index) => {
                                          const ResourceIcon = resourceIcons[resource.type];
                                          return (
                                            <a
                                              key={index}
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors group"
                                            >
                                              <ResourceIcon className="w-4 h-4" />
                                              <span className="underline underline-offset-2">{resource.title}</span>
                                              {resource.duration && (
                                                <Badge variant="outline" className="text-xs ml-auto">
                                                  {resource.duration}
                                                </Badge>
                                              )}
                                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-blue-300 font-medium mb-2">AI-Powered</h3>
            <p className="text-blue-200/70 text-sm">Adaptive learning path that evolves with your progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-purple-500/30">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-purple-300 font-medium mb-2">Goal-Oriented</h3>
            <p className="text-purple-200/70 text-sm">Every task is designed to move you closer to your goal</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-green-500/30">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-green-300 font-medium mb-2">Track Progress</h3>
            <p className="text-green-200/70 text-sm">Real-time progress tracking and milestone celebrations</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 