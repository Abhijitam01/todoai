"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Calendar,
  Tag,
  CheckCircle2,
  Circle,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeEstimate: string;
  tags: string[];
  completed: boolean;
  dueTime: string;
}

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onSnooze?: (taskId: string) => void;
  onReschedule?: (taskId: string, newDate: Date) => void;
}

export function TaskCard({ 
  task, 
  onComplete, 
  onSnooze, 
  onReschedule
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (task.completed) return;
    
    setIsCompleting(true);
    
    // Add a small delay for the animation
    setTimeout(() => {
      onComplete?.(task.id);
      setIsCompleting(false);
    }, 600);
  };

  const handleSnooze = () => {
    onSnooze?.(task.id);
  };

  const handleReschedule = (newDate: Date) => {
    onReschedule?.(task.id, newDate);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isCompleting ? 0.98 : 1
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.95,
        y: -10
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "group relative",
        task.completed && "opacity-60"
      )}
    >
      <div className={cn(
        "relative bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 transition-all duration-300",
        "hover:border-gray-600/50 hover:bg-gray-900/70",
        task.completed && "border-gray-700/30 bg-gray-900/30",
        isCompleting && "border-green-400/30 bg-green-400/5"
      )}>
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={handleComplete}
            disabled={task.completed}
            className={cn(
              "mt-1 flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-300",
              task.completed || isCompleting 
                ? "bg-green-500 border-green-500 text-white" 
                : "border-gray-600 hover:border-gray-500 hover:bg-gray-800"
            )}
          >
            {(task.completed || isCompleting) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 className="w-3 h-3" />
              </motion.div>
            )}
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Task Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getPriorityIcon(task.priority)}</span>
                <Badge variant="secondary" className={cn("text-xs", getPriorityColor(task.priority))}>
                  {task.priority}
                </Badge>
                <span className="text-xs text-gray-400">{task.dueTime}</span>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Task Title */}
            <h3 className={cn(
              "text-base font-medium text-white mb-2 leading-relaxed",
              task.completed && "line-through text-gray-400",
              isCompleting && "text-green-400"
            )}>
              {task.title}
            </h3>

            {/* Task Description */}
            <p className="text-sm text-gray-400 mb-3 leading-relaxed">
              {task.description}
            </p>

            {/* Task Meta Info */}
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{task.timeEstimate}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {task.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-gray-800/50 text-gray-400 border-gray-700/50"
                >
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            {!task.completed && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSnooze}
                  className="h-8 px-3 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  Later
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReschedule(new Date())}
                  className="h-8 px-3 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Schedule
                </Button>
              </div>
            )}

            {/* Completed indicator */}
            {task.completed && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 