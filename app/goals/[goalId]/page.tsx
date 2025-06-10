"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Calendar,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Award,
  Zap,
  BookOpen,
  Users,
  Share2,
  Edit,
  MoreHorizontal,
  PlayCircle,
  Clock3,
  Star,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Task {
  id: string;
  day: number;
  task: string;
  status: "COMPLETED" | "MISSED" | "PENDING";
  description?: string;
  links?: { title: string; url: string; type: "video" | "article" | "docs" | "practice" }[];
  estimatedTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  category?: string;
}

interface Week {
  week: number;
  milestone: string;
  description?: string;
  tasks: Task[];
  focus?: string;
  learningGoals?: string[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  currentWeek: number;
  plan: Week[];
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  totalEstimatedHours: number;
}

// Enhanced Mock data
const goal: Goal = {
  id: "goal-python-90",
  title: "Learn Python in 90 Days",
  description: "Master Python programming from basics to advanced concepts with hands-on projects and real-world applications.",
  startDate: "2025-01-10",
  endDate: "2025-04-10",
  currentWeek: 3,
  category: "Programming",
  difficulty: "Beginner",
  totalEstimatedHours: 180,
  plan: [
    {
      week: 1,
      milestone: "Python Basics & Environment Setup",
      description: "Get your development environment ready and learn Python fundamentals",
      focus: "Foundation Building",
      learningGoals: ["Install Python", "Understand variables and data types", "Basic input/output operations"],
      tasks: [
        { 
          id: "t1", 
          day: 1, 
          task: "Install Python and IDE Setup", 
          status: "COMPLETED",
          description: "Set up Python 3.11+, VS Code, and essential extensions for Python development",
          estimatedTime: "2 hours",
          difficulty: "Easy",
          category: "Setup",
          links: [
            { title: "Python Official Installation Guide", url: "https://python.org/downloads", type: "docs" },
            { title: "VS Code Python Setup", url: "https://code.visualstudio.com/docs/python", type: "docs" }
          ]
        },
        { 
          id: "t2", 
          day: 2, 
          task: "Learn Variables and Data Types", 
          status: "COMPLETED",
          description: "Master strings, integers, floats, booleans, and type conversion",
          estimatedTime: "3 hours",
          difficulty: "Easy",
          category: "Fundamentals",
          links: [
            { title: "Python Variables Tutorial", url: "https://pythontutorial.net/python-basics/python-variables/", type: "article" },
            { title: "Data Types in Python", url: "https://realpython.com/python-data-types/", type: "article" }
          ]
        },
        { 
          id: "t3", 
          day: 3, 
          task: "Practice Basic Input/Output", 
          status: "MISSED",
          description: "Learn print(), input(), and string formatting methods",
          estimatedTime: "2 hours",
          difficulty: "Easy",
          category: "Practice",
          links: [
            { title: "Python Input/Output Tutorial", url: "https://pythonspot.com/input-and-output/", type: "article" },
            { title: "Python Print Function", url: "https://realpython.com/python-print/", type: "article" }
          ]
        }
      ]
    },
    {
      week: 2,
      milestone: "Control Flow & Logic",
      description: "Master decision-making and loops in Python",
      focus: "Logic & Flow Control",
      learningGoals: ["Conditional statements", "Loop structures", "Boolean logic"],
      tasks: [
        { 
          id: "t4", 
          day: 1, 
          task: "If/Else Statements & Conditionals", 
          status: "COMPLETED",
          description: "Learn conditional logic, comparison operators, and nested if statements",
          estimatedTime: "3 hours",
          difficulty: "Easy",
          category: "Control Flow",
          links: [
            { title: "Python If Statements", url: "https://realpython.com/python-conditional-statements/", type: "article" },
            { title: "Conditional Logic Video", url: "https://youtube.com/watch?v=conditionals", type: "video" }
          ]
        },
        { 
          id: "t5", 
          day: 2, 
          task: "Loops: For and While", 
          status: "PENDING",
          description: "Master iteration with for loops, while loops, and loop control statements",
          estimatedTime: "4 hours",
          difficulty: "Medium",
          category: "Control Flow",
          links: [
            { title: "Python Loops Tutorial", url: "https://realpython.com/python-for-loop/", type: "article" },
            { title: "Loop Practice Exercises", url: "https://codingbat.com/python", type: "practice" }
          ]
        }
      ]
    },
    {
      week: 3,
      milestone: "Data Structures Fundamentals",
      description: "Learn Python's built-in data structures and their applications",
      focus: "Data Organization",
      learningGoals: ["Lists and tuples", "Dictionaries", "Sets and their operations"],
      tasks: [
        { 
          id: "t6", 
          day: 1, 
          task: "Lists and Tuples", 
          status: "PENDING",
          description: "Master list operations, methods, and understand tuple immutability",
          estimatedTime: "4 hours",
          difficulty: "Medium",
          category: "Data Structures",
          links: [
            { title: "Python Lists Tutorial", url: "https://realpython.com/python-lists-tuples/", type: "article" },
            { title: "List Methods Video", url: "https://youtube.com/watch?v=lists", type: "video" }
          ]
        },
        { 
          id: "t7", 
          day: 2, 
          task: "Dictionaries and Key-Value Pairs", 
          status: "PENDING",
          description: "Learn dictionary operations, methods, and nested dictionaries",
          estimatedTime: "3 hours",
          difficulty: "Medium",
          category: "Data Structures",
          links: [
            { title: "Python Dictionaries", url: "https://realpython.com/python-dicts/", type: "article" },
            { title: "Dictionary Practice", url: "https://pythonprinciples.com/lessons/dictionaries/", type: "practice" }
          ]
        },
        { 
          id: "t8", 
          day: 3, 
          task: "Sets and Set Operations", 
          status: "PENDING",
          description: "Understand set theory, operations, and when to use sets vs lists",
          estimatedTime: "2 hours",
          difficulty: "Medium",
          category: "Data Structures",
          links: [
            { title: "Python Sets Tutorial", url: "https://realpython.com/python-sets/", type: "article" }
          ]
        }
      ]
    },
    {
      week: 4,
      milestone: "Functions & Modules",
      description: "Learn to write reusable code with functions and organize code with modules",
      focus: "Code Organization",
      learningGoals: ["Function definition", "Parameters and arguments", "Module imports"],
      tasks: [
        { 
          id: "t9", 
          day: 1, 
          task: "Function Basics", 
          status: "PENDING",
          description: "Define functions, parameters, return values, and scope",
          estimatedTime: "4 hours",
          difficulty: "Medium",
          category: "Functions"
        },
        { 
          id: "t10", 
          day: 2, 
          task: "Advanced Function Concepts", 
          status: "PENDING",
          description: "Lambda functions, *args, **kwargs, and decorators",
          estimatedTime: "5 hours",
          difficulty: "Hard",
          category: "Functions"
        }
      ]
    }
  ]
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const getTaskStats = (tasks: Task[]) => {
  const completed = tasks.filter(t => t.status === "COMPLETED").length;
  const missed = tasks.filter(t => t.status === "MISSED").length;
  const pending = tasks.filter(t => t.status === "PENDING").length;
  return { completed, missed, pending, total: tasks.length };
};

const getOverallProgress = (plan: Week[]) => {
  const allTasks = plan.flatMap(week => week.tasks);
  const completedTasks = allTasks.filter(task => task.status === "COMPLETED").length;
  return { completed: completedTasks, total: allTasks.length };
};

const getDaysRemaining = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Enhanced Components
const TaskRow = ({ task, isAnimated = true }: { task: Task; isAnimated?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusConfig = {
    COMPLETED: {
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/20 border-green-500/30",
      label: "Completed",
      labelColor: "text-green-400 bg-green-500/20 border-green-500/30"
    },
    MISSED: {
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20 border-red-500/30",
      label: "Missed",
      labelColor: "text-red-400 bg-red-500/20 border-red-500/30"
    },
    PENDING: {
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20 border-amber-500/30",
      label: "Pending",
      labelColor: "text-amber-400 bg-amber-500/20 border-amber-500/30"
    }
  };

  const difficultyColors = {
    Easy: "text-green-400 bg-green-500/20",
    Medium: "text-amber-400 bg-amber-500/20",
    Hard: "text-red-400 bg-red-500/20"
  };

  const config = statusConfig[task.status];
  const Icon = config.icon;

  return (
    <motion.div
      className="rounded-lg bg-gray-800/40 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 overflow-hidden"
      initial={isAnimated ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 p-4">
        <div className={cn("p-2 rounded-full border", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-400">Day {task.day}</span>
            <span className="text-gray-600">•</span>
            <span className="text-white font-medium truncate">{task.task}</span>
            {task.difficulty && (
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", difficultyColors[task.difficulty])}>
                {task.difficulty}
              </span>
            )}
          </div>
          {task.estimatedTime && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock3 className="h-3 w-3" />
              <span>{task.estimatedTime}</span>
              {task.category && (
                <>
                  <span className="text-gray-600">•</span>
                  <span>{task.category}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className={cn("px-3 py-1 rounded-full text-xs font-medium border", config.labelColor)}>
            {config.label}
          </div>
          
          {(task.description || task.links) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white p-1"
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-700/50"
          >
            <div className="p-4 space-y-3">
              {task.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
              )}
              
              {task.links && task.links.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Resources</h4>
                  <div className="space-y-2">
                    {task.links.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {link.type === "video" && <PlayCircle className="h-4 w-4" />}
                        {link.type === "article" && <BookOpen className="h-4 w-4" />}
                        {link.type === "docs" && <ExternalLink className="h-4 w-4" />}
                        {link.type === "practice" && <Zap className="h-4 w-4" />}
                        <span>{link.title}</span>
                        <ExternalLink className="h-3 w-3" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const WeekAccordion = ({ week, isCurrentWeek, onJumpToWeek }: { 
  week: Week; 
  isCurrentWeek: boolean;
  onJumpToWeek: () => void;
}) => {
  const stats = getTaskStats(week.tasks);
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  const getWeekStatusChip = () => {
    if (stats.completed === stats.total && stats.total > 0) {
      return { text: `✅ Complete`, color: "text-green-400 bg-green-500/20 border-green-500/30" };
    } else if (stats.missed > 0) {
      return { text: `⚠️ ${stats.missed} Missed`, color: "text-red-400 bg-red-500/20 border-red-500/30" };
    } else if (isCurrentWeek) {
      return { text: `🎯 In Progress`, color: "text-blue-400 bg-blue-500/20 border-blue-500/30" };
    } else {
      return { text: `📋 ${stats.completed}/${stats.total}`, color: "text-gray-400 bg-gray-500/20 border-gray-500/30" };
    }
  };

  const statusChip = getWeekStatusChip();

  return (
    <AccordionItem 
      value={`week-${week.week}`} 
      className="border border-gray-700/50 rounded-lg overflow-hidden bg-gray-800/20"
    >
      <AccordionTrigger className="hover:no-underline px-6 py-4">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all",
              isCurrentWeek 
                ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25" 
                : stats.completed === stats.total && stats.total > 0
                ? "border-green-500 bg-green-500/20 text-green-400"
                : "border-gray-600 bg-gray-700/30 text-gray-300"
            )}>
              {week.week}
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Week {week.week} – {week.milestone}
                {isCurrentWeek && <Star className="h-4 w-4 text-blue-400" />}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                {isCurrentWeek && (
                  <span className="text-blue-400 font-medium">Current Week</span>
                )}
                {week.focus && (
                  <>
                    {isCurrentWeek && <span>•</span>}
                    <span>Focus: {week.focus}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn("px-3 py-1 rounded-full text-sm font-medium border", statusChip.color)}>
              {statusChip.text}
            </div>
            <div className="text-sm text-gray-400 font-medium">
              {completionRate}%
            </div>
            {isCurrentWeek && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onJumpToWeek();
                }}
                className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                variant="outline"
              >
                Jump Here
              </Button>
            )}
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-6 pb-6">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {week.description && (
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <p className="text-gray-300 text-sm">{week.description}</p>
            </div>
          )}
          
          {week.learningGoals && (
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Learning Goals
              </h4>
              <ul className="space-y-1">
                {week.learningGoals.map((goal, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-3">
            {week.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TaskRow task={task} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default function GoalDetailsPage({ params }: { params: { goalId: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const currentWeekRef = useRef<HTMLDivElement>(null);
  
  const overallProgress = getOverallProgress(goal.plan);
  const progressPercentage = Math.round((overallProgress.completed / overallProgress.total) * 100);
  const daysRemaining = getDaysRemaining(goal.endDate);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const jumpToCurrentWeek = () => {
    currentWeekRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-400">Loading your roadmap...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Goal Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-6 sm:p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            
            <div className="relative">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <Target className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{goal.title}</h1>
                    <p className="text-gray-400 mb-3">{goal.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(goal.startDate)} – {formatDate(goal.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>Week {goal.currentWeek} of {goal.plan.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>{daysRemaining} days remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={jumpToCurrentWeek}
                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 transition-all"
                    variant="outline"
                  >
                    Jump to This Week
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-2xl font-bold text-green-400">{overallProgress.completed}</div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-2xl font-bold text-amber-400">{overallProgress.total - overallProgress.completed}</div>
                  <div className="text-sm text-gray-400">Remaining</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-2xl font-bold text-blue-400">{goal.difficulty}</div>
                  <div className="text-sm text-gray-400">Level</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-2xl font-bold text-purple-400">{goal.totalEstimatedHours}h</div>
                  <div className="text-sm text-gray-400">Est. Time</div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-lg font-semibold text-white">Overall Progress</span>
                  <span className="text-lg font-bold text-white">
                    {overallProgress.completed} of {overallProgress.total} tasks completed
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={progressPercentage} 
                    className="h-4 bg-gray-700"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{progressPercentage}% Complete</span>
                    <span>{overallProgress.total - overallProgress.completed} tasks remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Weekly Roadmap */}
        <motion.div
          ref={currentWeekRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Weekly Roadmap</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Accordion type="multiple" className="space-y-4" defaultValue={[`week-${goal.currentWeek}`]}>
              {goal.plan.map((week, index) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <WeekAccordion 
                    week={week} 
                    isCurrentWeek={week.week === goal.currentWeek}
                    onJumpToWeek={jumpToCurrentWeek}
                  />
                </motion.div>
              ))}
            </Accordion>
          </Card>
        </motion.div>

        {/* Floating Action Button - Mobile */}
        <motion.div
          className="fixed bottom-6 right-6 sm:hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={jumpToCurrentWeek}
            size="lg"
            className="rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
} 