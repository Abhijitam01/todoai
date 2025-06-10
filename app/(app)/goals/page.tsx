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

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  targetDate: string;
  status: "active" | "completed" | "paused";
  priority: "high" | "medium" | "low";
  color: string;
  tasks: {
    total: number;
    completed: number;
  };
  createdAt: string;
}

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
  
  // Mock goal data
  const goals: Goal[] = [
    {
      id: "1",
      title: "Master React & Next.js",
      description: "Complete comprehensive React and Next.js learning path with hands-on projects",
      category: "Learning",
      progress: 65,
      targetDate: "2024-03-15",
      status: "active",
      priority: "high",
      color: "bg-blue-500",
      tasks: { total: 12, completed: 8 },
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Build SaaS Product",
      description: "Design, develop and launch a SaaS application from scratch",
      category: "Business",
      progress: 45,
      targetDate: "2024-06-30",
      status: "active",
      priority: "high",
      color: "bg-purple-500",
      tasks: { total: 25, completed: 11 },
      createdAt: "2024-01-01"
    },
    {
      id: "3",
      title: "Fitness Transformation",
      description: "Complete 90-day fitness program with diet and exercise plan",
      category: "Health",
      progress: 82,
      targetDate: "2024-04-01",
      status: "active",
      priority: "medium",
      color: "bg-green-500",
      tasks: { total: 90, completed: 74 },
      createdAt: "2024-01-01"
    },
    {
      id: "4",
      title: "Read 24 Books This Year",
      description: "Build a consistent reading habit and expand knowledge",
      category: "Personal",
      progress: 33,
      targetDate: "2024-12-31",
      status: "active",
      priority: "low",
      color: "bg-orange-500",
      tasks: { total: 24, completed: 8 },
      createdAt: "2024-01-01"
    },
    {
      id: "5",
      title: "Learn Spanish Fluency",
      description: "Achieve conversational Spanish proficiency",
      category: "Learning",
      progress: 100,
      targetDate: "2024-02-28",
      status: "completed",
      priority: "medium",
      color: "bg-yellow-500",
      tasks: { total: 50, completed: 50 },
      createdAt: "2023-10-01"
    },
    {
      id: "6",
      title: "Side Project MVP",
      description: "Build and validate a minimum viable product for side business",
      category: "Business",
      progress: 20,
      targetDate: "2024-05-15",
      status: "paused",
      priority: "low",
      color: "bg-indigo-500",
      tasks: { total: 15, completed: 3 },
      createdAt: "2024-01-20"
    }
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

  const GoalCard = ({ goal }: { goal: Goal }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="bg-gray-900/50 border-gray-700/50 hover:bg-gray-900/70 transition-all duration-300 group h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${goal.color}`} />
              <div>
                <CardTitle className="text-lg text-white group-hover:text-red-400 transition-colors">
                  {goal.title}
                </CardTitle>
                <p className="text-sm text-gray-400 mt-1">{goal.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPriorityIcon(goal.priority)}
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            {goal.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-lg font-bold text-white">{goal.progress}%</span>
            </div>
            <Progress 
              value={goal.progress} 
              className="h-2 bg-gray-800"
            />
            <div className="text-xs text-gray-500">
              {goal.tasks.completed} of {goal.tasks.total} tasks completed
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{getDaysRemaining(goal.targetDate)}</span>
            </div>
            {getStatusBadge(goal.status)}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-gray-800/50 hover:bg-gray-700 border border-gray-600 hover:border-gray-500"
              onClick={() => router.push(`/goals/${goal.id}`)}
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {goal.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return <GoalsPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            My Goals
          </h1>
          <p className="text-gray-400 mt-2">
            Track your progress and achieve your dreams
          </p>
        </div>
        
        <Button 
          onClick={() => router.push("/create-goal")}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </motion.div>

      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          description="Start your journey by creating your first goal."
          action={{
            label: "Create Goal",
            href: "/create-goal"
          }}
          className="py-16"
        />
      ) : (
        <>
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Active Goals</p>
                    <p className="text-2xl font-bold text-white">{activeGoals.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400 text-sm font-medium">Completed</p>
                    <p className="text-2xl font-bold text-white">{completedGoals.length}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-400 text-sm font-medium">Avg Progress</p>
                    <p className="text-2xl font-bold text-white">
                      {activeGoals.length > 0 
                        ? Math.round(activeGoals.reduce((acc, goal) => acc + goal.progress, 0) / activeGoals.length)
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Total Tasks</p>
                    <p className="text-2xl font-bold text-white">
                      {goals.reduce((acc, goal) => acc + goal.tasks.total, 0)}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Goals Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                  All Goals ({filteredGoals.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-gray-700">
                  Active ({activeGoals.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-gray-700">
                  Completed ({completedGoals.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <AnimatePresence mode="wait">
                  {filteredGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGoals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="🔍"
                      title="No goals found"
                      description={searchQuery ? "Try adjusting your search terms" : "Create your first goal to get started"}
                      action={{
                        label: "Create Goal",
                        onClick: () => router.push("/create-goal")
                      }}
                      className="py-12"
                    />
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="active">
                {activeGoals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="⚡"
                    title="No active goals"
                    description="Create a new goal or reactivate a paused one to get started."
                    action={{
                      label: "Create Goal",
                      onClick: () => router.push("/create-goal")
                    }}
                    className="py-12"
                  />
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedGoals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="🏆"
                    title="No completed goals yet"
                    description="Keep working on your active goals to see them here when completed!"
                    className="py-12"
                  />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </div>
  );
} 