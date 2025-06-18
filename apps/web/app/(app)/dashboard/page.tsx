"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { DailyMotivation } from "@/components/dashboard/DailyMotivation";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
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
  Flame,
  Settings,
  BookOpen,
  ArrowRight,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/stores/taskStore";
import { ProgressBar } from '@/components/dashboard/GoalProgress';
import { TodayTasks } from '@/components/dashboard/TodayTasks';
import { AddTask } from '@/components/dashboard/AddTask';
import { useTasksToday } from '@/lib/hooks/useTasksToday';
import { useGoals } from "@/lib/hooks/useGoals";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { GoalRevisionModal } from "@/components/goals/GoalRevisionModal";
import { PlanPreview } from "@/components/PlanPreview";

// Loading skeleton components
const TaskSkeleton = () => (
  <Card className="bg-gray-900/50 border-gray-700/50">
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48 bg-gray-800" />
          <Skeleton className="h-6 w-16 bg-gray-800" />
        </div>
        <Skeleton className="h-3 w-32 bg-gray-800" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12 bg-gray-800" />
          <Skeleton className="h-5 w-12 bg-gray-800" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Skeleton className="h-10 w-80 bg-gray-800 mb-2" />
        <Skeleton className="h-6 w-64 bg-gray-800 mb-4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-32 bg-gray-800" />
          <Skeleton className="h-6 w-28 bg-gray-800" />
          <Skeleton className="h-6 w-36 bg-gray-800" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-24 bg-gray-800" />
        <Skeleton className="h-10 w-10 bg-gray-800" />
      </div>
    </div>

    {/* Analytics Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 bg-gray-800 mb-2" />
            <Skeleton className="h-8 w-16 bg-gray-800" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Tasks Skeleton */}
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-gray-800" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 bg-gray-800" />
          <Skeleton className="h-8 w-20 bg-gray-800" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 bg-gray-800" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 bg-gray-800" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showPlanPreview, setShowPlanPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  // Mock data for dashboard
  const analyticsData = {
    totalTasks: 8,
    completedToday: 4,
    timeRemaining: 6.5,
    completionRate: 78
  };

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
    },
    {
      id: "4",
      title: "Update project documentation",
      description: "Document new API endpoints and usage",
      priority: "low",
      timeEstimate: "45m",
      tags: ["documentation"],
      completed: false,
      dueTime: "4:00 PM",
      dueDate: "2024-01-20",
      goal: "Documentation",
      status: "PENDING",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z"
    },
    {
      id: "5",
      title: "Review pull requests",
      description: "Code review for 3 pending PRs",
      priority: "medium",
      timeEstimate: "1h",
      tags: ["code-review", "development"],
      completed: false,
      dueTime: "3:00 PM",
      dueDate: "2024-01-20",
      goal: "Code Quality",
      status: "PENDING",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z"
    }
  ];

  // For demo purposes, uncomment the line below to test empty state
  // const todaysTasks: Task[] = [];

  const completedTasks = todaysTasks.filter(task => task.completed);
  const pendingTasks = todaysTasks.filter(task => !task.completed);

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Fetch today's tasks (replace with real hook)
  const { data: tasks, loading: tasksLoading, error } = useTasksToday();

  const { goals, isLoading: goalsLoading } = useGoals();

  useEffect(() => {
    setActiveGoals(goals.filter(g => g.status === 'active'));
  }, [goals]);

  const totalActiveGoals = activeGoals.length;
  const totalTasksToday = tasks?.length || 8;
  const completedTasksToday = tasks?.filter(t => t.completed)?.length || 3;
  const avgProgress = activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length || 0;

  const handleReviseGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowRevisionModal(true);
  };

  const handleGoalRevision = async (revisions: any) => {
    console.log('Goal revisions:', revisions);
    // TODO: Implement actual revision API call
    setShowRevisionModal(false);
    setSelectedGoal(null);
  };

  const handleCreateNewGoal = () => {
    setShowPlanPreview(true);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back! 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Track your progress and achieve your learning goals
            </p>
          </div>
          <Button
            onClick={handleCreateNewGoal}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Goals</p>
                  <p className="text-2xl font-bold text-white">{totalActiveGoals}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Today's Tasks</p>
                  <p className="text-2xl font-bold text-white">
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

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Progress</p>
                  <p className="text-2xl font-bold text-white">{Math.round(avgProgress)}%</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Week</p>
                  <p className="text-2xl font-bold text-white">7 days</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <p className="text-xs text-orange-400 mt-2">🔥 Streak active</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                <Target className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-blue-600">
                <BookOpen className="w-4 h-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
                <Trophy className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="overview" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Today's Tasks */}
                  <div className="lg:col-span-2">
                    <Card className="bg-gray-900/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          Today's Focus
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TodayTasks />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <QuickActions />
                    <DailyMotivation />
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
                      <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
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
                              onClick={() => handleReviseGoal(goal)}
                              className="flex-1 border-gray-600 hover:border-gray-500"
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Revise
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => window.location.href = `/goals/${goal.id}`}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Add New Goal Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: activeGoals.length * 0.1 }}
                  >
                    <Card 
                      className="bg-gray-900/30 border-gray-700 border-dashed hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={handleCreateNewGoal}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="p-4 bg-blue-500/10 rounded-full w-16 h-16 mx-auto mb-4">
                          <Plus className="w-8 h-8 text-blue-400 mx-auto mt-1" />
                        </div>
                        <h3 className="text-white font-medium mb-2">Create New Goal</h3>
                        <p className="text-gray-400 text-sm">
                          Start a new learning journey with AI-powered planning
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <ProgressTracker />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Learning Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Advanced analytics coming soon</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Detailed insights coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Modals */}
        <GoalRevisionModal
          isOpen={showRevisionModal}
          onClose={() => setShowRevisionModal(false)}
          onSave={handleGoalRevision}
          currentGoal={selectedGoal || undefined}
        />

        <PlanPreview
          isOpen={showPlanPreview}
          onClose={() => setShowPlanPreview(false)}
          onAccept={() => {
            console.log("New goal plan accepted");
            setShowPlanPreview(false);
          }}
          onReject={() => {
            console.log("Plan rejected, regenerating...");
          }}
          plan={[]} // Mock empty plan for new goal
          goalName="New Learning Goal"
          totalDays={84}
          timePerDay={2}
          skillLevel="beginner"
        />
      </div>
    </div>
  );
} 