"use client";

import { TaskCard } from "./TaskCard";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: string;
  timeEstimate?: string;
  tags?: string[];
  completed?: boolean;
  dueTime?: string;
  dueDate?: string;
  goal?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TodayTasksProps {
  tasks: Task[];
}

export function TodayTasks({ tasks }: TodayTasksProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-white/10 backdrop-blur shadow-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-lg font-semibold text-white mb-2">No tasks for today!</div>
            <div className="text-sm text-purple-200 mb-4 text-center">You're all caught up. Enjoy your day or add something new to accomplish!</div>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg" size="lg">
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const validPriorities = ["low", "medium", "high"] as const;
        const normalizedPriority = validPriorities.includes(task.priority as any)
          ? task.priority
          : "medium";
        const validStatuses = ["PENDING", "COMPLETED", "SNOOZED"] as const;
        const normalizedStatus = validStatuses.includes(task.status as any)
          ? task.status
          : "PENDING";
        return (
          <TaskCard
            key={task.id}
            task={{
              ...task,
              description: task.description ?? "",
              priority: normalizedPriority as "low" | "medium" | "high",
              timeEstimate: task.timeEstimate ?? "",
              tags: task.tags ?? [],
              completed: task.completed ?? false,
              dueTime: task.dueTime ?? "",
              dueDate: task.dueDate ?? "",
              goal: task.goal ?? "",
              status: normalizedStatus as "PENDING" | "COMPLETED" | "SNOOZED",
              createdAt: task.createdAt ?? "",
              updatedAt: task.updatedAt ?? "",
            }}
          />
        );
      })}
    </div>
  );
} 