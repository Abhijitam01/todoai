"use client";

import { useState, useEffect } from "react";
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
  MoreHorizontal,
  Moon,
  Undo2,
  Redo2
} from "lucide-react";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/lib/stores/taskStore";
import { useTaskToasts } from "@/components/ui/toast";
import { SnoozeDialog } from "@/components/tasks/SnoozeDialog";
import { RescheduleDialog } from "@/components/tasks/RescheduleDialog";

interface TaskCardProps {
  task: Task;
  onSelect?: (taskId: string, selected: boolean) => void;
  isSelected?: boolean;
  showBulkActions?: boolean;
}

export function TaskCard({ 
  task, 
  onSelect,
  isSelected = false,
  showBulkActions = false
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // Zustand store actions
  const completeTask = useTaskStore(state => state.completeTask);
  const canUndo = useTaskStore(state => state.canUndo);
  const canRedo = useTaskStore(state => state.canRedo);
  const undo = useTaskStore(state => state.undo);
  const redo = useTaskStore(state => state.redo);
  const { recentlyCreatedTaskIds, recentlyUpdatedTaskIds } = useTaskStore(state => ({
    recentlyCreatedTaskIds: state.recentlyCreatedTaskIds,
    recentlyUpdatedTaskIds: state.recentlyUpdatedTaskIds,
  }));
  
  // Toast notifications
  const toasts = useTaskToasts();

  const handleComplete = async () => {
    if (task.completed) return;
    
    setIsCompleting(true);
    
    // Add a small delay for the animation
    setTimeout(() => {
      completeTask(task.id);
      toasts.onTaskCompleted(task.title);
      setIsCompleting(false);
    }, 600);
  };

  const handleSelectToggle = () => {
    if (onSelect) {
      onSelect(task.id, !isSelected);
    }
  };

  useEffect(() => {
    const wasCreated = recentlyCreatedTaskIds.has(task.id);
    const wasUpdated = recentlyUpdatedTaskIds.has(task.id);
    if (wasCreated) {
      setIsNew(true);
      // Remove highlight after animation
      setTimeout(() => setIsNew(false), 2000);
    }
    if (wasUpdated) {
      setIsUpdated(true);
      setTimeout(() => setIsUpdated(false), 2000);
    }
  }, [recentlyCreatedTaskIds, recentlyUpdatedTaskIds, task.id]);

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

  const getStatusBadge = () => {
    switch (task.status) {
      case "SNOOZED":
        return (
          <Badge variant="secondary" className="text-xs bg-blue-500/10 border-blue-500/20 text-blue-400">
            <Moon className="w-2 h-2 mr-1" />
            Snoozed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="text-xs bg-green-500/10 border-green-500/20 text-green-400">
            <CheckCircle2 className="w-2 h-2 mr-1" />
            Done
          </Badge>
        );
      default:
        return null;
    }
  };

  const isOverdue = () => {
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today && task.status !== 'COMPLETED';
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isCompleting ? 0.98 : isSelected ? 1.02 : 1
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
          task.completed && "opacity-60",
          isSelected && "ring-2 ring-blue-500/50",
          isNew && "highlight-new",
          isUpdated && "highlight-updated"
        )}
      >
        <div className={cn(
          "relative bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 transition-all duration-300",
          "hover:border-gray-600/50 hover:bg-gray-900/70",
          task.completed && "border-gray-700/30 bg-gray-900/30",
          isCompleting && "border-green-400/30 bg-green-400/5",
          isOverdue() && "border-red-500/30 bg-red-500/5",
          isSelected && "border-blue-500/50 bg-blue-500/5"
        )}>
          <div className="flex items-start gap-4">
            {/* Selection Checkbox (if bulk actions enabled) */}
            {showBulkActions && (
              <button
                onClick={handleSelectToggle}
                className={cn(
                  "mt-1 flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-300",
                  isSelected 
                    ? "bg-blue-500 border-blue-500 text-white" 
                    : "border-gray-600 hover:border-gray-500 hover:bg-gray-800"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </motion.div>
                )}
              </button>
            )}

            {/* Completion Checkbox */}
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">{getPriorityIcon(task.priority)}</span>
                  <Badge variant="secondary" className={cn("text-xs", getPriorityColor(task.priority))}>
                    {task.priority}
                  </Badge>
                  {getStatusBadge()}
                  <span className={cn(
                    "text-xs",
                    isOverdue() ? "text-red-400" : "text-gray-400"
                  )}>
                    {task.dueTime}
                  </span>
                  {isOverdue() && (
                    <Badge variant="secondary" className="text-xs bg-red-500/10 border-red-500/20 text-red-400">
                      Overdue
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Undo/Redo buttons (only show if actions available) */}
                  {(canUndo() || canRedo()) && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={undo}
                        disabled={!canUndo()}
                        className="h-6 w-6 p-0"
                      >
                        <Undo2 className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={redo}
                        disabled={!canRedo()}
                        className="h-6 w-6 p-0"
                      >
                        <Redo2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
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
                {task.rescheduledFrom && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <Calendar className="w-3 h-3" />
                    <span>Moved from {task.rescheduledFrom}</span>
                  </div>
                )}
                {task.snoozeUntil && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Moon className="w-3 h-3" />
                    <span>Snoozed until {new Date(task.snoozeUntil).toLocaleDateString()}</span>
                  </div>
                )}
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

              {/* Reschedule Reason */}
              {task.rescheduledReason && (
                <div className="mb-4 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-xs text-orange-400 font-medium mb-1">Reschedule Reason:</div>
                  <div className="text-xs text-orange-300">{task.rescheduledReason}</div>
                </div>
              )}

              {/* Action Buttons */}
              {!task.completed && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSnoozeDialog(true)}
                    className="h-8 px-3 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Moon className="w-3 h-3 mr-1" />
                    Snooze
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRescheduleDialog(true)}
                    className="h-8 px-3 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Reschedule
                  </Button>
                </div>
              )}

              {/* Completed indicator */}
              {task.completed && (
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : ''}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Dialogs */}
      <SnoozeDialog
        open={showSnoozeDialog}
        onOpenChange={setShowSnoozeDialog}
        task={task}
      />
      
      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        task={task}
      />
    </>
  );
} 