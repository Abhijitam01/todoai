"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "./CustomCheckbox";
import { TaskDetails } from "./TaskDetails";
import { RescheduleDialog } from "./RescheduleDialog";
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Calendar,
  Dot
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onSnooze: (taskId: string) => void;
  onReschedule: (taskId: string, newDate: Date) => void;
  isCompleted?: boolean;
}

export function TaskCard({ 
  task, 
  onComplete, 
  onSnooze, 
  onReschedule, 
  isCompleted = false 
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const handleComplete = async () => {
    if (isCompleted) return;
    
    setIsCompleting(true);
    
    // Add a small delay for the animation
    setTimeout(() => {
      onComplete(task.id);
      setIsCompleting(false);
    }, 600);
  };

  const handleSnooze = () => {
    onSnooze(task.id);
  };

  const handleReschedule = (newDate: Date) => {
    onReschedule(task.id, newDate);
    setShowRescheduleDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-400";
      case "MEDIUM":
        return "text-yellow-400";
      case "LOW":
        return "text-green-400";
      default:
        return "text-white/40";
    }
  };

  return (
    <>
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
          isCompleted && "opacity-40"
        )}
      >
        <div className={cn(
          "relative border border-white/10 rounded-lg p-6 transition-all duration-300",
          "hover:border-white/20 hover:bg-white/[0.02]",
          isCompleted && "border-white/5",
          isCompleting && "border-green-400/30 bg-green-400/5"
        )}>
          <div className="flex items-start gap-4">
            {/* Custom Checkbox */}
            <div className="pt-1">
              <CustomCheckbox
                checked={isCompleted || isCompleting}
                onCheckedChange={handleComplete}
                disabled={isCompleted}
                isAnimating={isCompleting}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Goal and Priority */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
                  {task.goal}
                </span>
                <Dot className={cn("w-3 h-3", getPriorityColor(task.priority))} />
                <span className={cn("text-xs font-medium", getPriorityColor(task.priority))}>
                  {task.priority.toLowerCase()}
                </span>
              </div>

              {/* Task Title */}
              <h3 className={cn(
                "text-lg font-light text-white mb-4 leading-relaxed",
                isCompleted && "line-through text-white/40",
                isCompleting && "text-green-400"
              )}>
                {task.title}
              </h3>

              {/* Task Meta Info */}
              <div className="flex items-center gap-6 mb-4 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{task.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                  <span>{task.category}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {!isCompleted && (
                <div className="flex items-center gap-1 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSnooze}
                    className="h-7 px-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/5"
                  >
                    Later
                  </Button>
                  <span className="text-white/20">•</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRescheduleDialog(true)}
                    className="h-7 px-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/5"
                  >
                    Schedule
                  </Button>
                </div>
              )}

              {/* Expand/Collapse Button */}
              {task.details.description && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-7 px-0 text-xs text-white/40 hover:text-white/70 hover:bg-transparent"
                >
                  {isExpanded ? (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-3 h-3 mr-1" />
                      More
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Expandable Task Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="ml-10 pt-6 border-t border-white/10 mt-6">
                  <TaskDetails task={task} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion Animation Overlay */}
          {isCompleting && (
            <motion.div
              className="absolute inset-0 bg-green-400/5 rounded-lg border border-green-400/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </motion.div>

      {/* Reschedule Dialog */}
      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        onReschedule={handleReschedule}
        taskTitle={task.title}
      />
    </>
  );
} 