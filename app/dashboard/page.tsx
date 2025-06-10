"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Navigation } from "@/components/navigation";
import { 
  Circle,
  Plus,
  Sparkles,
  Target,
  Clock,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  goal: string;
  title: string;
  status: "PENDING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  estimatedTime: string;
  dueDate: string;
  category: string;
  details: {
    description: string;
    links: Array<{ label: string; url: string }>;
    screenshot?: string;
  };
}

const todayTasks: Task[] = [
  {
    id: "task-1",
    goal: "Learn Python",
    title: "Install Python & VS Code",
    status: "PENDING",
    priority: "HIGH",
    estimatedTime: "30 min",
    dueDate: "Today",
    category: "Development",
    details: {
      description: "Visit python.org and download Python. Then install VS Code from code.visualstudio.com.",
      links: [
        { label: "Python", url: "https://python.org" },
        { label: "VS Code", url: "https://code.visualstudio.com" }
      ]
    }
  },
  {
    id: "task-2",
    goal: "Launch Portfolio",
    title: "Design the hero section",
    status: "PENDING",
    priority: "MEDIUM",
    estimatedTime: "2 hours",
    dueDate: "Today",
    category: "Design",
    details: {
      description: "Sketch the layout and define call-to-action text. Focus on creating a compelling first impression.",
      links: [
        { label: "Figma", url: "https://figma.com" },
        { label: "Inspiration", url: "https://dribbble.com" }
      ]
    }
  },
  {
    id: "task-3",
    goal: "Fitness Journey",
    title: "Morning workout routine",
    status: "PENDING",
    priority: "HIGH",
    estimatedTime: "45 min",
    dueDate: "Today",
    category: "Health",
    details: {
      description: "Complete 30 minutes of cardio followed by 15 minutes of strength training.",
      links: []
    }
  }
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(todayTasks);
  const [showCompleted, setShowCompleted] = useState(false);

  const pendingTasks = tasks.filter(task => task.status === "PENDING");
  const completedTasks = tasks.filter(task => task.status === "COMPLETED");

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: "COMPLETED" as const }
        : task
    ));
  };

  const handleTaskSnooze = (taskId: string) => {
    console.log(`Snoozed task ${taskId} to tomorrow`);
  };

  const handleTaskReschedule = (taskId: string, newDate: Date) => {
    console.log(`Rescheduled task ${taskId} to ${newDate.toDateString()}`);
  };

  const totalTime = pendingTasks.reduce((total, task) => {
    const time = parseFloat(task.estimatedTime.match(/\d+/)?.[0] || "0");
    return total + time;
  }, 0);

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}></div>
      </div>

      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        <div className="max-w-2xl mx-auto px-6">
          
          {/* Zen Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            >
              <Circle className="w-6 h-6 text-white/70" />
            </motion.div>
            
            <h1 className="text-3xl font-light text-white/90 mb-2 tracking-wide">
              Today
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{pendingTasks.length} tasks</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{totalTime}h remaining</span>
              </div>
              {completionRate > 0 && (
                <>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{completionRate}% complete</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Tasks Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {pendingTasks.length > 0 ? (
              <div className="space-y-6">
                {pendingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.1 * index,
                      ease: "easeOut"
                    }}
                  >
                    <TaskCard
                      task={task}
                      onComplete={handleTaskComplete}
                      onSnooze={handleTaskSnooze}
                      onReschedule={handleTaskReschedule}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              // Zen Empty State
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                >
                  <CheckCircle2 className="w-8 h-8 text-white/70" />
                </motion.div>
                
                <h3 className="text-xl font-light text-white/90 mb-3">
                  Perfect clarity
                </h3>
                <p className="text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
                  Your mind is clear, your tasks are complete. 
                  <br />
                  Rest in this moment of accomplishment.
                </p>
                
                <Button 
                  variant="ghost" 
                  className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/20 hover:border-white/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add tomorrow's intent
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Completed Tasks - Minimal */}
          {completedTasks.length > 0 && (
            <motion.div
              className="mt-16 pt-8 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-3 text-white/40 hover:text-white/70 transition-colors text-sm mb-6"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {showCompleted ? 'Hide' : 'View'} completed ({completedTasks.length})
                </span>
              </button>
              
              <AnimatePresence>
                {showCompleted && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {completedTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <TaskCard
                          task={task}
                          onComplete={handleTaskComplete}
                          onSnooze={handleTaskSnooze}
                          onReschedule={handleTaskReschedule}
                          isCompleted
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Breathing space at bottom */}
          <div className="h-32"></div>
        </div>
      </div>
    </div>
  );
} 