"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Calendar,
  Target,
  Clock,
  Trophy,
  Tag,
  Zap,
  Timer,
  Edit,
  Play,
  Pause,
  CheckCircle2,
  Code,
  Palette,
  Dumbbell,
  Briefcase,
  Heart,
  BookOpen,
  Star,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGoalStore, Goal, Task } from "@/lib/stores/goalStore";

// Helper Functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getProgressColor = (progress: number, status: Goal["status"]) => {
  if (status === "COMPLETED") return "bg-green-500";
  if (status === "MISSED") return "bg-red-500";
  if (status === "PAUSED") return "bg-orange-500";
  if (progress >= 80) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-gray-500";
};

// Components
const StatusBadge = ({ status }: { status: Goal["status"] }) => {
  const variants = {
    ACTIVE: { color: "bg-green-100 text-green-800", text: "Active" },
    COMPLETED: { color: "bg-blue-100 text-blue-800", text: "Completed" },
    PAUSED: { color: "bg-orange-100 text-orange-800", text: "Paused" },
    MISSED: { color: "bg-red-100 text-red-800", text: "Missed" }
  };

  const variant = variants[status];
  
  return (
    <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", variant.color)}>
      {variant.text}
    </span>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  const [isCompleted, setIsCompleted] = useState(task.status === "COMPLETED");
  
  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    // TODO: Update task status in store
  };

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg border bg-card",
      isCompleted && "opacity-60"
    )}>
      <button
        onClick={handleToggleComplete}
        className={cn(
          "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          isCompleted 
            ? "bg-green-500 border-green-500 text-white" 
            : "border-muted-foreground hover:border-primary"
        )}
      >
        {isCompleted && <CheckCircle2 className="h-3 w-3" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium text-sm",
          isCompleted && "line-through text-muted-foreground"
        )}>
          {task.task}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          {task.estimatedTime && (
            <span className="flex items-center gap-1">
              <Timer className="h-3 w-3" />
              {task.estimatedTime}
            </span>
          )}
          {task.difficulty && (
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">
              {task.difficulty}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const goalId = params.goalId as string;
  
  const { goals, dailyTasks, fetchDailyTasks } = useGoalStore();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [goalTasks, setGoalTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Find the goal by ID
    const foundGoal = goals.find(g => g.id === goalId);
    setGoal(foundGoal || null);
    
    // Fetch tasks for this goal
    fetchDailyTasks();
  }, [goalId, goals, fetchDailyTasks]);

  useEffect(() => {
    // Filter tasks for this specific goal
    const filtered = dailyTasks.filter(task => task.goalId === goalId);
    setGoalTasks(filtered);
  }, [dailyTasks, goalId]);

  if (!goal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Goal not found</h3>
          <p className="text-muted-foreground mb-4">The goal you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/goals')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(goal.category);
  const daysRemaining = getDaysRemaining(goal.endDate);
  const completedTasks = goalTasks.filter(t => t.status === "COMPLETED").length;
  const totalTasks = goalTasks.length;

  const handleEdit = () => {
    console.log("Edit goal:", goal.id);
    // TODO: Navigate to edit page or open modal
  };

  const handleToggleStatus = () => {
    console.log("Toggle goal status:", goal.id);
    // TODO: Implement play/pause functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/goals')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Goals
            </Button>
          </div>

          {/* Goal Header Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{goal.title}</CardTitle>
                      <StatusBadge status={goal.status} />
                    </div>
                    {goal.description && (
                      <p className="text-muted-foreground mb-4">{goal.description}</p>
                    )}
                    
                    {/* Goal Metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(goal.startDate)} → {formatDate(goal.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4" />
                        <span>{goal.priority}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{goal.difficulty}</span>
                      </div>
                      {goal.streak && goal.streak > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Zap className="h-4 w-4" />
                          <span>{goal.streak} day streak</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleToggleStatus}
                    className={goal.status === "PAUSED" ? "text-green-600" : "text-orange-600"}
                  >
                    {goal.status === "PAUSED" ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Progress and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-6"
        >
          {/* Progress Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall</span>
                  <span className="text-lg font-bold">{goal.progress}%</span>
                </div>
                <Progress 
                  value={goal.progress} 
                  className="h-3"
                  indicatorClassName={getProgressColor(goal.progress, goal.status)}
                />
                <div className="text-xs text-muted-foreground">
                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Goal completed or overdue'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="text-lg font-bold">{completedTasks}/{totalTasks}</span>
                </div>
                <Progress 
                  value={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0} 
                  className="h-3"
                  indicatorClassName="bg-green-500"
                />
                <div className="text-xs text-muted-foreground">
                  {totalTasks - completedTasks} tasks remaining
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Logged</span>
                  <span className="text-lg font-bold">
                    {goal.actualHours || 0}h
                    {goal.estimatedHours && ` / ${goal.estimatedHours}h`}
                  </span>
                </div>
                {goal.estimatedHours && (
                  <>
                    <Progress 
                      value={((goal.actualHours || 0) / goal.estimatedHours) * 100} 
                      className="h-3"
                      indicatorClassName="bg-blue-500"
                    />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(((goal.actualHours || 0) / goal.estimatedHours) * 100)}% of estimated time
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tags */}
        {goal.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {goal.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Daily Tasks
                <span className="ml-auto px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                  {completedTasks} / {totalTasks}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {goalTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks available for this goal yet.</p>
                  <p className="text-sm">Tasks will appear as you progress through your plan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {goalTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 