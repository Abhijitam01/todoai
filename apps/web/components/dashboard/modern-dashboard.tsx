"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundGradient } from "@/components/ui/aceternity/background-gradient";
import { BorderBeam } from "@/components/ui/aceternity/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Trophy, 
  BookOpen,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Edit3,
  Sparkles,
  Flame,
  BarChart3,
  Users,
  Award
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  description: string;
  timeline: number;
  timePerDay: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  currentWeek: number;
  completedTasks: number;
  totalTasks: number;
  progress: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeEstimate: string;
  tags: string[];
  completed: boolean;
  dueTime: string;
  dueDate: string;
  goal: string;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export function ModernDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  // Mock data
  const mockGoals: Goal[] = [
    {
      id: '1',
      name: 'Master Python Programming',
      description: 'Complete Python mastery in 12 weeks with hands-on projects',
      timeline: 12,
      timePerDay: 2,
      difficulty: 'beginner',
      topics: ['Python Basics', 'OOP', 'Data Structures', 'Web Development'],
      currentWeek: 3,
      completedTasks: 23,
      totalTasks: 84,
      progress: 27,
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Learn React & Next.js',
      description: 'Build modern web applications with React ecosystem',
      timeline: 8,
      timePerDay: 1.5,
      difficulty: 'intermediate',
      topics: ['React Fundamentals', 'Next.js', 'State Management', 'Testing'],
      currentWeek: 1,
      completedTasks: 5,
      totalTasks: 56,
      progress: 9,
      status: 'active',
      createdAt: '2024-01-15'
    }
  ];

  const todaysTasks: Task[] = [
    {
      id: "1",
      title: "Review Q4 performance metrics",
      description: "Analyze team productivity and revenue growth",
      priority: "high",
      timeEstimate: "2h",
      tags: ["analytics", "business"],
      completed: false,
      dueTime: "10:00 AM",
      dueDate: "2024-01-20",
      goal: "Business Growth",
      status: "PENDING",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z"
    },
    {
      id: "2",
      title: "Complete React component design",
      description: "Finish the user dashboard mockups",
      priority: "medium",
      timeEstimate: "1.5h",
      tags: ["design", "react"],
      completed: true,
      dueTime: "2:00 PM",
      dueDate: "2024-01-20",
      goal: "Product Development",
      status: "COMPLETED",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T14:00:00Z"
    },
    {
      id: "3",
      title: "Team standup meeting",
      description: "Daily sync with development team",
      priority: "high",
      timeEstimate: "30m",
      tags: ["meeting", "team"],
      completed: true,
      dueTime: "9:30 AM",
      dueDate: "2024-01-20",
      goal: "Team Coordination",
      status: "COMPLETED",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T09:30:00Z"
    }
  ];

  useEffect(() => {
    setActiveGoals(mockGoals.filter(g => g.status === 'active'));
  }, []);

  const totalActiveGoals = activeGoals.length;
  const totalTasksToday = todaysTasks.length;
  const completedTasksToday = todaysTasks.filter(t => t.completed).length;
  const avgProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length || 0;

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {getTimeOfDayGreeting()}! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Ready to achieve your goals today?
            </p>
          </div>
          <BackgroundGradient className="rounded-xl">
            <Button
              className="bg-black text-white px-6 py-3 rounded-xl font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </BackgroundGradient>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <BackgroundGradient className="rounded-xl">
            <Card className="bg-black border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Goals</p>
                    <p className="text-3xl font-bold text-white">{totalActiveGoals}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-xl">
            <Card className="bg-black border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Today's Tasks</p>
                    <p className="text-3xl font-bold text-white">
                      {completedTasksToday}/{totalTasksToday}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <Progress 
                  value={(completedTasksToday / totalTasksToday) * 100} 
                  className="mt-3 h-2" 
                />
              </CardContent>
            </Card>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-xl">
            <Card className="bg-black border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Progress</p>
                    <p className="text-3xl font-bold text-white">{Math.round(avgProgress)}%</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </BackgroundGradient>

          <BackgroundGradient className="rounded-xl">
            <Card className="bg-black border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Streak</p>
                    <p className="text-3xl font-bold text-white">7 days</p>
                  </div>
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <Flame className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <p className="text-xs text-orange-400 mt-2">🔥 Keep it up!</p>
              </CardContent>
            </Card>
          </BackgroundGradient>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Today's Tasks */}
                  <div className="lg:col-span-2">
                    <BackgroundGradient className="rounded-xl">
                      <Card className="bg-black border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            Today's Focus
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {todaysTasks.map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  task.completed 
                                    ? 'bg-green-500 border-green-500' 
                                    : 'border-gray-600'
                                }`} />
                                <div>
                                  <h3 className="text-white font-medium">{task.title}</h3>
                                  <p className="text-gray-400 text-sm">{task.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {task.priority}
                                </Badge>
                                <span className="text-gray-400 text-sm">{task.timeEstimate}</span>
                              </div>
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>
                    </BackgroundGradient>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <BackgroundGradient className="rounded-xl">
                      <Card className="bg-black border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full justify-start bg-gray-800 hover:bg-gray-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Task
                          </Button>
                          <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Review
                          </Button>
                          <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800">
                            <Award className="w-4 h-4 mr-2" />
                            View Achievements
                          </Button>
                        </CardContent>
                      </Card>
                    </BackgroundGradient>

                    <BackgroundGradient className="rounded-xl">
                      <Card className="bg-black border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Daily Motivation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 text-sm italic">
                            "The way to get started is to quit talking and begin doing."
                          </p>
                          <p className="text-gray-500 text-xs mt-2">- Walt Disney</p>
                        </CardContent>
                      </Card>
                    </BackgroundGradient>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <BackgroundGradient className="rounded-xl">
                        <Card className="bg-black border-gray-800 hover:border-gray-700 transition-colors">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-white mb-2">{goal.name}</CardTitle>
                                <p className="text-gray-400 text-sm">{goal.description}</p>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className="bg-green-500/10 text-green-400 border-green-500/20"
                              >
                                Active
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Progress */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">Progress</span>
                                <span className="text-white font-medium">{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <p className="text-gray-400">Week</p>
                                <p className="text-white font-medium">{goal.currentWeek}/{goal.timeline}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Tasks</p>
                                <p className="text-white font-medium">{goal.completedTasks}/{goal.totalTasks}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">Daily</p>
                                <p className="text-white font-medium">{goal.timePerDay}h</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-gray-600 hover:border-gray-500"
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Revise
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 bg-red-500 hover:bg-red-600"
                              >
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </BackgroundGradient>
                    </motion.div>
                  ))}

                  {/* Add New Goal Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: activeGoals.length * 0.1 }}
                  >
                    <BackgroundGradient className="rounded-xl">
                      <Card 
                        className="bg-black border-gray-800 border-dashed hover:border-gray-700 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-8 text-center">
                          <div className="p-4 bg-red-500/10 rounded-full w-16 h-16 mx-auto mb-4">
                            <Plus className="w-8 h-8 text-red-400 mx-auto mt-1" />
                          </div>
                          <h3 className="text-white font-medium mb-2">Create New Goal</h3>
                          <p className="text-gray-400 text-sm">
                            Start a new learning journey with AI-powered planning
                          </p>
                        </CardContent>
                      </Card>
                    </BackgroundGradient>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <BackgroundGradient className="rounded-xl">
                  <Card className="bg-black border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Progress Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Progress tracking coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </BackgroundGradient>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BackgroundGradient className="rounded-xl">
                    <Card className="bg-black border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white">Learning Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Advanced analytics coming soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  </BackgroundGradient>

                  <BackgroundGradient className="rounded-xl">
                    <Card className="bg-black border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white">Performance Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Detailed insights coming soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  </BackgroundGradient>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
