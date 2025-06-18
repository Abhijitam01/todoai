"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Edit3, 
  CheckCircle2,
  Circle,
  ArrowLeft,
  Settings,
  MoreHorizontal,
  AlertCircle,
  Zap,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlanPreview, PlanWeek } from "@/components/PlanPreview";
import { cn } from "@/lib/utils";
import { useGoal } from "@/lib/hooks/useGoal";
import { useTasksToday } from "@/lib/hooks/useTasksToday";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedTime?: number;
  actualTime?: number;
  dueDate: string;
  week: number;
  day: number;
}

interface GoalProgress {
  totalTasks: number;
  completedTasks: number;
  currentWeek: number;
  totalWeeks: number;
  onTrack: boolean;
  daysAhead: number;
  daysBehind: number;
}

export default function GoalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;
  
  const { goal, isLoading: goalLoading } = useGoal(goalId);
  const { tasks, isLoading: tasksLoading } = useTasksToday();
  
  const [showPlanPreview, setShowPlanPreview] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Mock data - replace with actual API calls
  const mockProgress: GoalProgress = {
    totalTasks: 84,
    completedTasks: 23,
    currentWeek: 3,
    totalWeeks: 12,
    onTrack: true,
    daysAhead: 2,
    daysBehind: 0
  };

  const mockWeeks: PlanWeek[] = [
    {
      week: 1,
      milestone: "Learn Python Basics",
      days: [
        { day: 1, task: "Install Python & Set up IDE", estimatedTime: 60 },
        { day: 2, task: "Understand variables and data types", estimatedTime: 90 },
        { day: 3, task: "Practice basic input/output", estimatedTime: 45 },
        { day: 4, task: "Work with strings and string methods", estimatedTime: 75 },
        { day: 5, task: "Lists and list operations", estimatedTime: 80 },
        { day: 6, task: "Dictionaries and key-value pairs", estimatedTime: 70 },
        { day: 7, task: "Week 1 Practice Project", estimatedTime: 120 }
      ]
    },
    {
      week: 2,
      milestone: "Control Flow & Loops",
      days: [
        { day: 1, task: "If/Else statements and conditionals", estimatedTime: 60 },
        { day: 2, task: "For loops and iteration", estimatedTime: 75 },
        { day: 3, task: "While loops and loop control", estimatedTime: 65 },
        { day: 4, task: "Nested loops and advanced iteration", estimatedTime: 90 },
        { day: 5, task: "List comprehensions", estimatedTime: 85 },
        { day: 6, task: "Exception handling basics", estimatedTime: 70 },
        { day: 7, task: "Week 2 Practice Project", estimatedTime: 150 }
      ]
    },
    {
      week: 3,
      milestone: "Functions & Modules",
      days: [
        { day: 1, task: "Creating and using functions", estimatedTime: 80 },
        { day: 2, task: "Function parameters and arguments", estimatedTime: 90 },
        { day: 3, task: "Lambda functions and map/filter", estimatedTime: 100 },
        { day: 4, task: "Modules and packages", estimatedTime: 85 },
        { day: 5, task: "Standard library exploration", estimatedTime: 95 },
        { day: 6, task: "File handling and I/O operations", estimatedTime: 110 },
        { day: 7, task: "Week 3 Practice Project", estimatedTime: 180 }
      ]
    }
  ];

  const currentWeekTasks = mockWeeks.find(w => w.week === activeWeek)?.days || [];
  const progressPercentage = (mockProgress.completedTasks / mockProgress.totalTasks) * 100;

  const handleTaskComplete = (taskId: string) => {
    // Implementation for task completion
    console.log("Task completed:", taskId);
  };

  const handleReviseGoal = () => {
    setShowPlanPreview(true);
  };

  if (goalLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-gray-800 rounded"></div>
              <div className="h-96 bg-gray-800 rounded"></div>
              <div className="h-96 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {goal?.name || "Master Python Programming"}
              </h1>
              <p className="text-gray-400 mt-1">
                {goal?.description || "Complete Python mastery in 12 weeks"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleReviseGoal}
              variant="outline"
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Revise Plan
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-gray-300 hover:text-white">
                  Export Progress
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white">
                  Share Goal
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 hover:text-red-300">
                  Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(progressPercentage)}%
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <Progress value={progressPercentage} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Week</p>
                  <p className="text-2xl font-bold text-white">
                    {mockProgress.currentWeek}/{mockProgress.totalWeeks}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {mockProgress.totalWeeks - mockProgress.currentWeek} weeks remaining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tasks Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {mockProgress.completedTasks}/{mockProgress.totalTasks}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {mockProgress.totalTasks - mockProgress.completedTasks} tasks remaining
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {mockProgress.onTrack ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">On Track</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Behind</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
              </div>
              {mockProgress.daysAhead > 0 && (
                <p className="text-xs text-green-400 mt-2">
                  {mockProgress.daysAhead} days ahead of schedule
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Timeline */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Learning Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={`week-${activeWeek}`} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
                      {mockWeeks.map((week) => (
                        <TabsTrigger
                          key={week.week}
                          value={`week-${week.week}`}
                          onClick={() => setActiveWeek(week.week)}
                          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        >
                          Week {week.week}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {mockWeeks.map((week) => (
                      <TabsContent key={week.week} value={`week-${week.week}`} className="mt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-6">
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              Week {week.week} Milestone
                            </Badge>
                            <h3 className="text-lg font-semibold text-white">{week.milestone}</h3>
                          </div>

                          <div className="space-y-3">
                            {week.days.map((day, index) => {
                              const isCompleted = index < 3; // Mock completion status
                              const isCurrent = index === 3;
                              
                              return (
                                <motion.div
                                  key={day.day}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200",
                                    isCompleted
                                      ? "bg-green-500/5 border-green-500/20"
                                      : isCurrent
                                      ? "bg-blue-500/5 border-blue-500/20"
                                      : "bg-gray-800/30 border-gray-700 hover:border-gray-600"
                                  )}
                                >
                                  <button
                                    onClick={() => handleTaskComplete(`${week.week}-${day.day}`)}
                                    className="flex-shrink-0"
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                                    )}
                                  </button>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-medium text-gray-400">
                                        Day {day.day}
                                      </span>
                                      {isCurrent && (
                                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 text-xs">
                                          Current
                                        </Badge>
                                      )}
                                    </div>
                                    <p className={cn(
                                      "text-sm font-medium",
                                      isCompleted ? "text-green-300" : "text-gray-300"
                                    )}>
                                      {day.task}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs text-gray-400">
                                    {day.estimatedTime && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {day.estimatedTime}min
                                      </div>
                                    )}
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Focus */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Today's Focus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs font-medium text-blue-400">Day 4 - Week 3</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium">
                      Modules and packages
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">85 minutes estimated</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400">This Week's Milestone</h4>
                    <p className="text-sm text-gray-300">Functions & Modules</p>
                    <Progress value={57} className="h-2" />
                    <p className="text-xs text-gray-400">4/7 tasks completed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Streak</span>
                    <span className="text-sm font-medium text-orange-400">7 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Avg. Time/Day</span>
                    <span className="text-sm font-medium text-blue-400">1.2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Best Week</span>
                    <span className="text-sm font-medium text-green-400">Week 2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Completion Rate</span>
                    <span className="text-sm font-medium text-purple-400">94%</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Motivational Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 bg-purple-500/10 rounded-full w-12 h-12 mx-auto mb-4">
                      <Trophy className="w-6 h-6 text-purple-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      You're Crushing It!
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      You're 2 days ahead of schedule. Keep up the amazing work!
                    </p>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      View Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Plan Preview Modal */}
        <PlanPreview
          isOpen={showPlanPreview}
          onClose={() => setShowPlanPreview(false)}
          onAccept={() => {
            console.log("Plan accepted");
            setShowPlanPreview(false);
          }}
          onReject={() => {
            console.log("Plan rejected, regenerating...");
            // Handle plan regeneration
          }}
          plan={mockWeeks}
          goalName={goal?.name || "Master Python Programming"}
          totalDays={84}
          timePerDay={2}
          skillLevel="beginner"
        />
      </div>
    </div>
  );
} 