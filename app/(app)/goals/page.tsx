"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Target,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Edit,
  Archive,
  Star,
  Trophy,
  Flame,
  Users,
  Settings as SettingsIcon,
  ArrowRight,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GoalCard, Goal } from "@/components/goals/GoalCard";

// Loading skeleton components
const GoalCardSkeleton = () => (
  <Card className="bg-gray-900/50 border-gray-700/50">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-4 h-4 rounded-full bg-gray-800" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48 bg-gray-800 mb-2" />
            <Skeleton className="h-4 w-24 bg-gray-800" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 bg-gray-800" />
          <Skeleton className="w-8 h-8 bg-gray-800" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full bg-gray-800" />
      <Skeleton className="h-4 w-3/4 bg-gray-800" />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16 bg-gray-800" />
          <Skeleton className="h-6 w-12 bg-gray-800" />
        </div>
        <Skeleton className="h-2 w-full bg-gray-800" />
        <Skeleton className="h-3 w-32 bg-gray-800" />
      </div>
      
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 bg-gray-800" />
        <Skeleton className="h-6 w-20 bg-gray-800" />
      </div>
      
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-8 flex-1 bg-gray-800" />
        <Skeleton className="h-8 w-10 bg-gray-800" />
      </div>
    </CardContent>
  </Card>
);

const GoalsPageSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Skeleton className="h-9 w-48 bg-gray-800 mb-2" />
        <Skeleton className="h-5 w-64 bg-gray-800" />
      </div>
      <Skeleton className="h-10 w-32 bg-gray-800" />
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 bg-gray-800 mb-2" />
                <Skeleton className="h-8 w-12 bg-gray-800" />
              </div>
              <Skeleton className="w-8 h-8 bg-gray-800" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Filters Skeleton */}
    <div className="flex flex-col md:flex-row gap-4">
      <Skeleton className="h-10 flex-1 bg-gray-800" />
      <Skeleton className="h-10 w-40 bg-gray-800" />
      <Skeleton className="h-10 w-32 bg-gray-800" />
    </div>

    {/* Goals Grid Skeleton */}
    <div className="space-y-6">
      <Skeleton className="h-10 w-80 bg-gray-800" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <GoalCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default function GoalsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(loadingTimer);
  }, []);
  
  // Use lowercase status values to match the GoalCard type
  const goals: Goal[] = [
    {
      id: "goal-1",
      title: "Learn Python",
      startDate: "2025-06-01",
      endDate: "2025-09-01",
      progress: 40,
      status: "active",
    },
    {
      id: "goal-2",
      title: "Build Portfolio Website",
      startDate: "2025-05-01",
      endDate: "2025-06-15",
      progress: 100,
      status: "completed",
    },
  ];

  // For demo purposes, uncomment the line below to test empty state
  // const goals: Goal[] = [];

  const categories = ["all", ...Array.from(new Set(goals.map(goal => goal.category)))];
  const statuses = ["all", "active", "completed", "paused"];

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || goal.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || goal.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeGoals = goals.filter(goal => goal.status === "active");
  const completedGoals = goals.filter(goal => goal.status === "completed");
  const pausedGoals = goals.filter(goal => goal.status === "paused");

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <Flame className="w-4 h-4 text-red-400" />;
      case "medium": return <Star className="w-4 h-4 text-yellow-400" />;
      case "low": return <Zap className="w-4 h-4 text-green-400" />;
      default: return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Active</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Completed</Badge>;
      case "paused":
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Paused</Badge>;
      default:
        return null;
    }
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  if (isLoading) {
    return <div className="py-16 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Goals</h1>
      {goals.length === 0 ? (
        <div className="py-16 text-center text-gray-400">No goals yet. Start by creating one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
} 