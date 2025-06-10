"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Archive,
  Star,
  Tag,
  Timer,
  Trophy,
  Zap,
  BookOpen,
  Code,
  Palette,
  Dumbbell,
  Briefcase,
  Heart,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoalStore, Goal } from "@/lib/stores/goalStore";

// Enhanced Types
interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "MISSED" | "PAUSED";
  category: "Programming" | "Design" | "Fitness" | "Business" | "Personal" | "Learning";
  priority: "HIGH" | "MEDIUM" | "LOW";
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedHours?: number;
  actualHours?: number;
  streak?: number;
  lastUpdated: string;
}

// Enhanced Sample Data
const goals: Goal[] = [
  {
    id: "g1",
    title: "Learn Python Programming",
    description: "Master Python from basics to advanced concepts with hands-on projects",
    startDate: "2025-06-01",
    endDate: "2025-09-01",
    progress: 40,
    status: "ACTIVE",
    category: "Programming",
    priority: "HIGH",
    tags: ["coding", "backend", "automation"],
    difficulty: "Medium",
    estimatedHours: 120,
    actualHours: 48,
    streak: 7,
    lastUpdated: "2025-01-15"
  },
  {
    id: "g2",
    title: "Launch Portfolio Website",
    description: "Design and develop a professional portfolio showcasing my work",
    startDate: "2025-05-10",
    endDate: "2025-06-01",
    progress: 100,
    status: "COMPLETED",
    category: "Design",
    priority: "HIGH",
    tags: ["portfolio", "web design", "career"],
    difficulty: "Medium",
    estimatedHours: 60,
    actualHours: 58,
    streak: 15,
    lastUpdated: "2025-01-01"
  },
  {
    id: "g3",
    title: "Master React & Next.js",
    description: "Build modern web applications with React ecosystem",
    startDate: "2025-04-15",
    endDate: "2025-08-15",
    progress: 75,
    status: "ACTIVE",
    category: "Programming",
    priority: "HIGH",
    tags: ["react", "frontend", "javascript"],
    difficulty: "Hard",
    estimatedHours: 150,
    actualHours: 112,
    streak: 12,
    lastUpdated: "2025-01-14"
  },
  {
    id: "g4",
    title: "Build Mobile App",
    description: "Create a cross-platform mobile application using React Native",
    startDate: "2025-03-01",
    endDate: "2025-05-01",
    progress: 25,
    status: "PAUSED",
    category: "Programming",
    priority: "MEDIUM",
    tags: ["mobile", "react native", "app"],
    difficulty: "Hard",
    estimatedHours: 200,
    actualHours: 50,
    streak: 0,
    lastUpdated: "2025-01-10"
  },
  {
    id: "g5",
    title: "Morning Workout Routine",
    description: "Establish a consistent morning exercise habit",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    progress: 85,
    status: "ACTIVE",
    category: "Fitness",
    priority: "MEDIUM",
    tags: ["health", "routine", "wellness"],
    difficulty: "Easy",
    estimatedHours: 365,
    actualHours: 310,
    streak: 21,
    lastUpdated: "2025-01-16"
  },
  {
    id: "g6",
    title: "Start Freelance Business",
    description: "Build a sustainable freelance development business",
    startDate: "2025-02-01",
    endDate: "2025-12-01",
    progress: 30,
    status: "ACTIVE",
    category: "Business",
    priority: "LOW",
    tags: ["entrepreneurship", "freelance", "income"],
    difficulty: "Hard",
    estimatedHours: 500,
    actualHours: 150,
    streak: 5,
    lastUpdated: "2025-01-12"
  }
];

// Helper Functions
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startMonth = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return `${startMonth} – ${endMonth}`;
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
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

const getPriorityColor = (priority: Goal["priority"]) => {
  switch (priority) {
    case "HIGH": return "text-red-500";
    case "MEDIUM": return "text-yellow-500";
    case "LOW": return "text-green-500";
    default: return "text-gray-500";
  }
};

// Enhanced Components
const StatusBadge = ({ status }: { status: Goal["status"] }) => {
  const badges = {
    COMPLETED: {
      icon: CheckCircle2,
      text: "✅ Completed",
      className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
    },
    ACTIVE: {
      icon: Clock,
      text: "🟡 Active",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
    },
    MISSED: {
      icon: ExternalLink,
      text: "🔴 Missed",
      className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
    },
    PAUSED: {
      icon: AlertTriangle,
      text: "⏸️ Paused",
      className: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
    }
  };

  const badge = badges[status];
  const Icon = badge.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      badge.className
    )}>
      <Icon className="h-3 w-3" />
      {badge.text}
    </div>
  );
};

const PriorityBadge = ({ priority }: { priority: Goal["priority"] }) => {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium",
      getPriorityColor(priority)
    )}>
      <Star className="h-3 w-3" />
      {priority}
    </div>
  );
};

const GoalProgress = ({ progress, status }: { progress: number; status: Goal["status"] }) => {
  const getProgressColorClass = (progress: number, status: string) => {
    if (status === "COMPLETED") return "bg-green-500";
    if (status === "MISSED") return "bg-red-500";
    if (status === "PAUSED") return "bg-orange-500";
    if (progress >= 80) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2"
        indicatorClassName={getProgressColorClass(progress, status)}
      />
    </div>
  );
};

const GoalCard = ({ goal, index }: { goal: Goal; index: number }) => {
  const handleViewDetails = () => {
    console.log(`Viewing details for goal: ${goal.id}`);
    // Future: Navigate to /goals/[id]
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Editing goal: ${goal.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Deleting goal: ${goal.id}`);
  };

  const CategoryIcon = getCategoryIcon(goal.category);
  const daysRemaining = getDaysRemaining(goal.endDate);

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
      className="group"
    >
      <Card className="h-full bg-card/50 backdrop-blur-sm border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CategoryIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors truncate">
                  {goal.title}
                </CardTitle>
                {goal.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {goal.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <PriorityBadge priority={goal.priority} />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleEdit}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDateRange(goal.startDate, goal.endDate)}</span>
            </div>
            <StatusBadge status={goal.status} />
          </div>

          {/* Goal Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              {goal.streak && goal.streak > 0 && (
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-orange-500" />
                  <span>{goal.streak} day streak</span>
                </div>
              )}
              {daysRemaining > 0 && (
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  <span>{daysRemaining} days left</span>
                </div>
              )}
            </div>
            <div className="text-xs">
              {goal.difficulty}
            </div>
          </div>

          {/* Tags */}
          {goal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {goal.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
              {goal.tags.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-0.5">
                  +{goal.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <GoalProgress progress={goal.progress} status={goal.status} />
          
          {/* Time Tracking */}
          {goal.estimatedHours && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Time: {goal.actualHours || 0}h / {goal.estimatedHours}h</span>
              <span className="text-primary">
                {Math.round(((goal.actualHours || 0) / goal.estimatedHours) * 100)}%
              </span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleViewDetails}
              className="flex-1 group/btn bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 hover:border-primary transition-all duration-300"
              variant="outline"
              size="sm"
            >
              <span>View Details</span>
              <TrendingUp className="ml-2 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-3 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatsCard = ({ icon: Icon, title, value, change }: { 
  icon: any; 
  title: string; 
  value: string | number; 
  change?: string 
}) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className="text-xs text-green-600">
                {change}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState = () => {
  const handleCreateFirstGoal = () => {
    console.log("Creating first goal...");
    // Future: Navigate to /create-goal
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Target className="h-12 w-12 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">You haven't created any goals yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Start your journey to success by creating your first goal. Break down your ambitions into achievable milestones.
      </p>
      
      <Button 
        onClick={handleCreateFirstGoal}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Start Your First Goal
      </Button>
    </motion.div>
  );
};

// Main Component
export default function GoalsOverviewPage() {
  const [goalsList] = useState<Goal[]>(goals);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("lastUpdated");

  const handleCreateNewGoal = () => {
    console.log("Creating new goal...");
    // Future: Navigate to /create-goal
  };

  // Filtered and sorted goals
  const filteredAndSortedGoals = useMemo(() => {
    let filtered = goalsList.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           goal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           goal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "ALL" || goal.status === statusFilter;
      const matchesCategory = categoryFilter === "ALL" || goal.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort goals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.progress - a.progress;
        case "endDate":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case "priority":
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "lastUpdated":
        default:
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

    return filtered;
  }, [goalsList, searchQuery, statusFilter, categoryFilter, sortBy]);

  const activeGoals = goalsList.filter(goal => goal.status === "ACTIVE");
  const completedGoals = goalsList.filter(goal => goal.status === "COMPLETED");
  const totalHours = goalsList.reduce((sum, goal) => sum + (goal.actualHours || 0), 0);
  const avgProgress = Math.round(goalsList.reduce((sum, goal) => sum + goal.progress, 0) / goalsList.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
                Track your current goals, or create new ones.
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

          {/* Stats Dashboard */}
          {goalsList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              <StatsCard
                icon={Target}
                title="Total Goals"
                value={goalsList.length}
              />
              <StatsCard
                icon={TrendingUp}
                title="Active Goals"
                value={activeGoals.length}
                change="+2 this week"
              />
              <StatsCard
                icon={Trophy}
                title="Completed"
                value={completedGoals.length}
              />
              <StatsCard
                icon={Clock}
                title="Hours Logged"
                value={`${totalHours}h`}
                change="+12h this week"
              />
            </motion.div>
          )}

          {/* Search and Filters */}
          {goalsList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search goals, tags, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                    <SelectItem value="MISSED">Missed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastUpdated">Last Updated</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="endDate">Due Date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Goals Grid */}
        {filteredAndSortedGoals.length === 0 && goalsList.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </motion.div>
        ) : goalsList.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedGoals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
} 