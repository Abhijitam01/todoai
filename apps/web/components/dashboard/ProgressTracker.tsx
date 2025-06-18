"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  TrendingUp, 
  Trophy, 
  Target, 
  Zap,
  Clock,
  CheckCircle2,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DayProgress {
  date: string;
  completed: boolean;
  tasksCompleted: number;
  totalTasks: number;
  timeSpent: number; // in minutes
  streak: number;
}

interface WeeklyStats {
  week: number;
  completionRate: number;
  totalTasks: number;
  completedTasks: number;
  timeSpent: number;
  milestone?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'streak' | 'completion' | 'time' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressTrackerProps {
  goalId?: string;
  className?: string;
}

export function ProgressTracker({ goalId, className }: ProgressTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentWeek, setCurrentWeek] = useState(0);

  // Mock data - replace with actual API calls
  const mockDailyProgress: DayProgress[] = [
    { date: '2024-01-01', completed: true, tasksCompleted: 3, totalTasks: 3, timeSpent: 120, streak: 1 },
    { date: '2024-01-02', completed: true, tasksCompleted: 2, totalTasks: 3, timeSpent: 90, streak: 2 },
    { date: '2024-01-03', completed: true, tasksCompleted: 3, totalTasks: 3, timeSpent: 150, streak: 3 },
    { date: '2024-01-04', completed: false, tasksCompleted: 1, totalTasks: 3, timeSpent: 45, streak: 0 },
    { date: '2024-01-05', completed: true, tasksCompleted: 3, totalTasks: 3, timeSpent: 135, streak: 1 },
    { date: '2024-01-06', completed: true, tasksCompleted: 2, totalTasks: 2, timeSpent: 80, streak: 2 },
    { date: '2024-01-07', completed: true, tasksCompleted: 4, totalTasks: 4, timeSpent: 200, streak: 3 },
  ];

  const mockWeeklyStats: WeeklyStats[] = [
    { week: 1, completionRate: 85, totalTasks: 21, completedTasks: 18, timeSpent: 820, milestone: "Python Basics" },
    { week: 2, completionRate: 92, totalTasks: 21, completedTasks: 19, timeSpent: 950, milestone: "Control Flow & Loops" },
    { week: 3, completionRate: 78, totalTasks: 21, completedTasks: 16, timeSpent: 740, milestone: "Functions & Modules" },
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first task',
      icon: '🎯',
      earnedAt: '2024-01-01',
      type: 'completion',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete all tasks for a full week',
      icon: '⚡',
      earnedAt: '2024-01-07',
      type: 'completion',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Time Master',
      description: 'Spend 10+ hours learning this week',
      icon: '⏰',
      earnedAt: '2024-01-07',
      type: 'time',
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Streak Legend',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      earnedAt: '2024-01-08',
      type: 'streak',
      rarity: 'legendary'
    }
  ];

  const currentStreak = Math.max(...mockDailyProgress.map(d => d.streak));
  const totalTasksCompleted = mockDailyProgress.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const totalTimeSpent = mockDailyProgress.reduce((sum, day) => sum + day.timeSpent, 0);
  const overallCompletion = mockDailyProgress.filter(d => d.completed).length / mockDailyProgress.length * 100;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Current Streak</p>
                  <p className="text-lg font-bold text-white">{currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tasks Done</p>
                  <p className="text-lg font-bold text-white">{totalTasksCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Time Spent</p>
                  <p className="text-lg font-bold text-white">{Math.round(totalTimeSpent / 60)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Completion</p>
                  <p className="text-lg font-bold text-white">{Math.round(overallCompletion)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Progress Visualization
              </CardTitle>
              <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
                <TabsList className="bg-gray-800/50">
                  <TabsTrigger value="daily" className="data-[state=active]:bg-blue-600">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-blue-600">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-600">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {selectedPeriod === 'daily' && (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-7 gap-2">
                    {mockDailyProgress.map((day, index) => (
                      <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-xs text-gray-400 mb-2">
                          {getDayOfWeek(day.date)}
                        </div>
                        <div
                          className={cn(
                            "w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all",
                            day.completed
                              ? "bg-green-500/20 border-green-500/50 text-green-400"
                              : day.tasksCompleted > 0
                              ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                              : "bg-gray-800 border-gray-600 text-gray-500"
                          )}
                        >
                          {day.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            `${day.tasksCompleted}/${day.totalTasks}`
                          )}
                        </div>
                        {day.streak > 0 && (
                          <div className="text-xs text-orange-400 mt-1 flex items-center justify-center gap-1">
                            <Zap className="w-3 h-3" />
                            {day.streak}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {selectedPeriod === 'weekly' && (
                <motion.div
                  key="weekly"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {mockWeeklyStats.map((week, index) => (
                    <motion.div
                      key={week.week}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white">Week {week.week}</h3>
                          {week.milestone && (
                            <p className="text-sm text-gray-400">{week.milestone}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
                          {week.completionRate}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={week.completionRate} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{week.completedTasks}/{week.totalTasks} tasks</span>
                          <span>{Math.round(week.timeSpent / 60)}h {week.timeSpent % 60}m</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {selectedPeriod === 'monthly' && (
                <motion.div
                  key="monthly"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Monthly Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Completion Rate</span>
                          <span className="text-white font-medium">{Math.round(overallCompletion)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Best Streak</span>
                          <span className="text-orange-400 font-medium">{currentStreak} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Hours</span>
                          <span className="text-blue-400 font-medium">{Math.round(totalTimeSpent / 60)}h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Achievements</span>
                          <span className="text-purple-400 font-medium">{mockAchievements.length}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Trend Analysis</h3>
                      <div className="h-32 bg-gray-800/30 rounded-lg flex items-center justify-center">
                        <Activity className="w-8 h-8 text-gray-600" />
                        <span className="text-gray-500 ml-2">Chart Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all hover:scale-105",
                    getRarityColor(achievement.rarity)
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-white">{achievement.title}</h3>
                        <Badge variant="secondary" className={cn("text-xs", getRarityColor(achievement.rarity))}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                      <p className="text-xs text-gray-500">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="p-3 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4">
                <Star className="w-10 h-10 text-blue-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Keep Going Strong!
              </h3>
              <p className="text-gray-300 mb-4">
                You're on fire! 🔥 Your {currentStreak}-day streak shows real dedication. 
                You've completed {totalTasksCompleted} tasks and spent {Math.round(totalTimeSpent / 60)} hours learning.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">On Track</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400">{mockAchievements.length} Achievements</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 