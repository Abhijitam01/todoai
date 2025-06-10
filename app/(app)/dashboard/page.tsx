"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { DailyMotivation } from "@/components/dashboard/DailyMotivation";
import { 
  Circle,
  Plus,
  Sparkles,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Zap,
  Trophy,
  Filter,
  SortAsc,
  MoreHorizontal,
  Star,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for dashboard
  const analyticsData = {
    totalTasks: 8,
    completedToday: 4,
    timeRemaining: 6.5,
    completionRate: 78
  };

  const mockGoals = [
    {
      id: "1",
      title: "Master React & Next.js",
      progress: 65,
      color: "bg-blue-500",
      category: "Learning"
    },
    {
      id: "2", 
      title: "Build SaaS Product",
      progress: 45,
      color: "bg-purple-500",
      category: "Business"
    },
    {
      id: "3",
      title: "Fitness Transformation",
      progress: 82,
      color: "bg-green-500",
      category: "Health"
    },
    {
      id: "4",
      title: "Read 24 Books This Year",
      progress: 33,
      color: "bg-orange-500",
      category: "Personal"
    }
  ];

  const todaysTasks = [
    {
      id: "1",
      title: "Review Q4 performance metrics",
      description: "Analyze team productivity and revenue growth",
      priority: "high",
      timeEstimate: "2h",
      tags: ["analytics", "business"],
      completed: false,
      dueTime: "10:00 AM"
    },
    {
      id: "2",
      title: "Complete React component design",
      description: "Finish the user dashboard mockups",
      priority: "medium",
      timeEstimate: "1.5h",
      tags: ["design", "react"],
      completed: true,
      dueTime: "2:00 PM"
    },
    {
      id: "3",
      title: "Team standup meeting",
      description: "Daily sync with development team",
      priority: "high",
      timeEstimate: "30m",
      tags: ["meeting", "team"],
      completed: true,
      dueTime: "9:30 AM"
    },
    {
      id: "4",
      title: "Update project documentation",
      description: "Document new API endpoints and usage",
      priority: "low",
      timeEstimate: "45m",
      tags: ["documentation"],
      completed: false,
      dueTime: "4:00 PM"
    },
    {
      id: "5",
      title: "Review pull requests",
      description: "Code review for 3 pending PRs",
      priority: "medium",
      timeEstimate: "1h",
      tags: ["code-review", "development"],
      completed: false,
      dueTime: "3:00 PM"
    }
  ];

  const completedTasks = todaysTasks.filter(task => task.completed);
  const pendingTasks = todaysTasks.filter(task => !task.completed);

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl">👋</span>
            {getTimeOfDayGreeting()}, John
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
              <Circle className="w-2 h-2 fill-current mr-2" />
              {completedTasks.length} completed today
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Target className="w-3 h-3 mr-2" />
              {pendingTasks.length} remaining
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <QuickActions />
          <Button 
            variant="outline" 
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <AnalyticsCards {...analyticsData} />
      </motion.div>

      {/* Daily Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <DailyMotivation />
      </motion.div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <GoalProgress goals={mockGoals} />
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-400" />
              Today's Focus
            </h2>
            <Badge variant="secondary" className="bg-gray-800 text-gray-300">
              {todaysTasks.length} tasks
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {/* Task Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Up Next</h3>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                <Flame className="w-3 h-3 mr-1" />
                {pendingTasks.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Completed</h3>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                <Star className="w-3 h-3 mr-1" />
                {completedTasks.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {completedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-gray-900/30 border-gray-700/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{analyticsData.completionRate}%</div>
                  <div className="text-sm text-gray-400">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{Math.round(analyticsData.timeRemaining)}</div>
                  <div className="text-sm text-gray-400">Hours Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{mockGoals.length}</div>
                  <div className="text-sm text-gray-400">Active Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 