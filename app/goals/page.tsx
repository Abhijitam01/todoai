"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Code,
  Palette,
  Dumbbell,
  Briefcase,
  Heart,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoalStore, Goal } from "@/lib/stores/goalStore";

// Helper Functions
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return `${startMonth} – ${endMonth}`;
};

const getCategoryIcon = (category: Goal["category"]) => {
  const icons = {
    Programming: Code,
    Design: Palette,
    Fitness: Dumbbell,
    Business: Briefcase,
    Personal: Heart,
    Learning: BookOpen
  };
  return icons[category] || Target;
};

// Components
const StatusBadge = ({ status }: { status: Goal["status"] }) => {
  const badges = {
    COMPLETED: {
      text: "✅ Completed",
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    },
    ACTIVE: {
      text: "🟢 Active",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    },
    MISSED: {
      text: "🔴 Missed",
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    },
    PAUSED: {
      text: "⏸️ Paused",
      className: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    }
  };

  const badge = badges[status];

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      badge.className
    )}>
      {badge.text}
    </span>
  );
};

const GoalCard = ({ goal, index }: { goal: Goal; index: number }) => {
  const router = useRouter();
  
  const handleViewDetails = () => {
    router.push(`/goals/${goal.id}`);
  };

  const CategoryIcon = getCategoryIcon(goal.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CategoryIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold leading-tight hover:text-primary transition-colors">
                  {goal.title}
                </CardTitle>
                {goal.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                )}
              </div>
            </div>
            <StatusBadge status={goal.status} />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange(goal.startDate, goal.endDate)}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{goal.progress}%</span>
            </div>
            <Progress 
              value={goal.progress} 
              className="h-2"
              indicatorClassName={
                goal.status === "COMPLETED" ? "bg-green-500" :
                goal.status === "MISSED" ? "bg-red-500" :
                goal.status === "PAUSED" ? "bg-orange-500" :
                goal.progress >= 80 ? "bg-blue-500" :
                goal.progress >= 50 ? "bg-yellow-500" :
                "bg-gray-500"
              }
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{goal.category} • {goal.difficulty}</span>
            {goal.actualHours && goal.estimatedHours && (
              <span>{goal.actualHours}h / {goal.estimatedHours}h</span>
            )}
          </div>
          
          <Button 
            onClick={handleViewDetails}
            className="w-full group/btn"
            variant="outline"
          >
            <span>View Details</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState = () => {
  const router = useRouter();
  
  const handleCreateFirstGoal = () => {
    console.log("Creating first goal...");
    // Future: Navigate to /create-goal
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Target className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start your journey by creating your first goal. Break down your ambitions into achievable milestones.
      </p>
      
      <Button 
        onClick={handleCreateFirstGoal}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create Your First Goal
      </Button>
    </motion.div>
  );
};

// Main Component
export default function GoalsOverviewPage() {
  const {
    goals,
    isLoading,
    error,
    fetchGoals
  } = useGoalStore();

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateNewGoal = () => {
    console.log("Creating new goal...");
    // Future: Navigate to /create-goal
  };

  const activeGoals = goals.filter((goal: Goal) => goal.status === "ACTIVE");
  const completedGoals = goals.filter((goal: Goal) => goal.status === "COMPLETED");

  if (isLoading && goals.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load goals</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchGoals}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Goals</h1>
              <p className="text-muted-foreground mt-2">
                Track your progress and achieve your ambitions.
              </p>
            </div>
            
            <Button 
              onClick={handleCreateNewGoal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground self-start sm:self-auto"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Goal
            </Button>
          </div>

          {/* Simple Stats */}
          {goals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
            >
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Goals</p>
                      <p className="text-2xl font-bold">{goals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold">{activeGoals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{completedGoals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {goals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 