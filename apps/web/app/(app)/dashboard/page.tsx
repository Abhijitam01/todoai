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
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/stores/taskStore";
import { ProgressBar } from '@/components/dashboard/GoalProgress';
import { TodayTasks } from '@/components/dashboard/TodayTasks';
import { AddTask } from '@/components/dashboard/AddTask';
import { useTasksToday } from '@/lib/hooks/useTasksToday';

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

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 py-8">
      {/* Progress Bar with milestones */}
      <ProgressBar />

      {/* Motivational Section */}
      <DailyMotivation />

      {/* Today's Tasks List */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Today's Tasks</h2>
        {tasksLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg bg-gray-800" />)}
          </div>
        ) : error ? (
          <div className="text-red-500">Failed to load tasks.</div>
        ) : (
          <TodayTasks tasks={tasks ?? []} />
        )}
      </section>

      {/* Add Task Button (floating/fixed) */}
      <div className="fixed bottom-8 right-8 z-50">
        <AddTask />
      </div>

      {/* TODO: Add microinteractions (confetti on complete, shimmer on AI, etc.) */}
    </div>
  );
} 