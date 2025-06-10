"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Calendar, CheckCircle2 } from "lucide-react";

interface Task {
  id: string;
  goal: string;
  title: string;
  status: "PENDING" | "COMPLETED";
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
    details: {
      description: "Sketch the layout and define call-to-action text.",
      links: []
    }
  }
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(todayTasks);
  const [showCompleted, setShowCompleted] = useState(false);

  const pendingTasks = tasks.filter(task => task.status === "PENDING");
  const completedTasks = tasks.filter(task => task.status === "COMPLETED");
  const taskCount = pendingTasks.length;

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: "COMPLETED" as const }
        : task
    ));
  };

  const handleTaskSnooze = (taskId: string) => {
    console.log(`Snoozed task ${taskId} to tomorrow`);
    // For now, just log the action
  };

  const handleTaskReschedule = (taskId: string, newDate: Date) => {
    console.log(`Rescheduled task ${taskId} to ${newDate.toDateString()}`);
    // For now, just log the action
  };

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sticky Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-slate-900 tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Today
              </motion.h1>
              <motion.p 
                className="text-slate-600 mt-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {taskCount > 0 
                  ? `${taskCount} ${taskCount === 1 ? 'thing' : 'things'} to move your goals forward`
                  : "You're all caught up for today!"
                }
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center gap-3 text-sm text-slate-500"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Calendar className="h-4 w-4" />
              <span>{dateString}</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {taskCount > 0 ? (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {pendingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <TaskCard
                  task={task}
                  onComplete={handleTaskComplete}
                  onSnooze={handleTaskSnooze}
                  onReschedule={handleTaskReschedule}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              You're all caught up for today! 🎉
            </h2>
            <p className="text-slate-600 text-lg">
              Take a break, or plan your next step.
            </p>
          </motion.div>
        )}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <motion.div
            className="mt-12 pt-8 border-t border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
            >
              <span className="text-sm font-medium">
                {showCompleted ? 'Hide' : 'Show'} completed tasks ({completedTasks.length})
              </span>
            </button>
            
            {showCompleted && (
              <motion.div
                className="space-y-3"
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
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          className="mt-16 text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="italic">
            "The secret to getting ahead is getting started." — Mark Twain
          </p>
        </motion.footer>
      </main>
    </div>
  );
} 