"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { GoalCard, Goal } from "@/components/goals/GoalCard";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  PlusCircle,
  Search,
  Filter,
  Flame,
  Star,
  Zap
} from "lucide-react";

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
  
  // Updated mock data with proper structure
  const goals: Goal[] = [
    {
      id: "goal-1",
      title: "Learn Python",
      description: "Master Python programming fundamentals",
      startDate: "2025-06-01",
      endDate: "2025-09-01",
      progress: 40,
      status: "active",
      category: "Programming",
      priority: "high",
      difficulty: "Medium",
      estimatedHours: 120,
      actualHours: 48,
      streak: 5,
      tags: ["python", "programming", "backend"],
    },
    {
      id: "goal-2",
      title: "Build Portfolio Website",
      description: "Create a professional portfolio website",
      startDate: "2025-05-01",
      endDate: "2025-06-15",
      progress: 100,
      status: "completed",
      category: "Design",
      priority: "medium",
      difficulty: "Easy",
      estimatedHours: 40,
      actualHours: 35,
      streak: 0,
      tags: ["web", "portfolio", "design"],
    },
    {
      id: "goal-3",
      title: "Learn React Native",
      description: "Build mobile apps with React Native",
      startDate: "2025-06-15",
      endDate: "2025-08-15",
      progress: 15,
      status: "active",
      category: "Programming",
      priority: "low",
      difficulty: "Hard",
      estimatedHours: 80,
      actualHours: 12,
      streak: 2,
      tags: ["react", "mobile", "javascript"],
    },
  ];

  // For demo purposes, uncomment the line below to test empty state
  // const goals: Goal[] = [];

  const categories = ["all", ...Array.from(new Set(goals.map(goal => goal.category).filter(Boolean) as string[]))];
  const statuses = ["all", "active", "completed", "paused", "planning"];

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (goal.description && goal.description.toLowerCase().includes(searchQuery.toLowerCase()));
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
      case "planning":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Planning</Badge>;
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
    return <GoalsPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Goals</h1>
          <p className="text-gray-400 mt-1">Track your progress and achieve your objectives</p>
        </div>
        <Button 
          onClick={() => router.push('/goals/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Goals</p>
                <p className="text-2xl font-bold text-white">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">{activeGoals.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">{completedGoals.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-white">{pausedGoals.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-400"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-40 bg-gray-900/50 border-gray-700/50 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-white hover:bg-gray-800">
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full md:w-32 bg-gray-900/50 border-gray-700/50 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="text-white hover:bg-gray-800">
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Goals Grid */}
      <div className="space-y-6">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {goals.length === 0 ? "No goals yet" : "No goals match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {goals.length === 0 
                ? "Start your journey by creating your first goal" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {goals.length === 0 && (
              <Button 
                onClick={() => router.push('/goals/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {filteredGoals.length} {filteredGoals.length === 1 ? 'Goal' : 'Goals'}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
                {selectedStatus !== "all" && ` • ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 