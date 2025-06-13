"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Moon, 
  Calendar, 
  Trash2, 
  X, 
  MoreHorizontal,
  ChevronDown,
  Users,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/lib/stores/taskStore";
import { useTaskToasts } from "@/components/ui/toast";
import { SnoozeDialog } from "./SnoozeDialog";
import { RescheduleDialog } from "./RescheduleDialog";

interface BulkActionsToolbarProps {
  selectedTasks: string[];
  allTasks: Task[];
  onClearSelection: () => void;
  onSelectAll: () => void;
  className?: string;
}

export function BulkActionsToolbar({ 
  selectedTasks, 
  allTasks,
  onClearSelection,
  onSelectAll,
  className 
}: BulkActionsToolbarProps) {
  const [showActions, setShowActions] = useState(false);
  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [bulkTask, setBulkTask] = useState<Task | null>(null);

  // Zustand store actions
  const bulkComplete = useTaskStore(state => state.bulkComplete);
  const bulkSnooze = useTaskStore(state => state.bulkSnooze);
  const bulkReschedule = useTaskStore(state => state.bulkReschedule);
  const deleteTask = useTaskStore(state => state.deleteTask);
  
  // Toast notifications
  const toasts = useTaskToasts();

  const selectedTaskObjects = allTasks.filter(task => selectedTasks.includes(task.id));
  const allSelected = selectedTasks.length === allTasks.filter(t => !t.completed).length;

  const handleBulkComplete = () => {
    bulkComplete(selectedTasks);
    toasts.onBulkAction('Completed', selectedTasks.length);
    onClearSelection();
  };

  const handleBulkSnooze = () => {
    // Create a representative task for the dialog
    setBulkTask({
      id: 'bulk',
      title: `${selectedTasks.length} tasks`,
      description: `Bulk operation on ${selectedTasks.length} selected tasks`,
      priority: 'medium',
      timeEstimate: '',
      tags: [],
      completed: false,
      dueTime: '',
      dueDate: new Date().toISOString().split('T')[0],
      goal: '',
      status: 'PENDING',
      createdAt: '',
      updatedAt: ''
    });
    setShowSnoozeDialog(true);
  };

  const handleBulkReschedule = () => {
    // Create a representative task for the dialog
    setBulkTask({
      id: 'bulk',
      title: `${selectedTasks.length} tasks`,
      description: `Bulk operation on ${selectedTasks.length} selected tasks`,
      priority: 'medium',
      timeEstimate: '',
      tags: [],
      completed: false,
      dueTime: '',
      dueDate: new Date().toISOString().split('T')[0],
      goal: '',
      status: 'PENDING',
      createdAt: '',
      updatedAt: ''
    });
    setShowRescheduleDialog(true);
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach(taskId => deleteTask(taskId));
    toasts.onBulkAction('Deleted', selectedTasks.length);
    onClearSelection();
  };

  const handleSnoozeDialogClose = () => {
    setShowSnoozeDialog(false);
    setBulkTask(null);
  };

  const handleRescheduleDialogClose = () => {
    setShowRescheduleDialog(false);
    setBulkTask(null);
  };

  const getPriorityDistribution = () => {
    const distribution = { high: 0, medium: 0, low: 0 };
    selectedTaskObjects.forEach(task => {
      distribution[task.priority]++;
    });
    return distribution;
  };

  const priorityDist = getPriorityDistribution();

  if (selectedTasks.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
          "bg-black/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl",
          "p-4 min-w-96",
          className
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-white font-medium">
                {selectedTasks.length} selected
              </span>
            </div>

            {/* Priority Distribution */}
            <div className="flex items-center gap-1">
              {priorityDist.high > 0 && (
                <Badge variant="secondary" className="text-xs bg-red-500/10 border-red-500/20 text-red-400">
                  {priorityDist.high} high
                </Badge>
              )}
              {priorityDist.medium > 0 && (
                <Badge variant="secondary" className="text-xs bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                  {priorityDist.medium} med
                </Badge>
              )}
              {priorityDist.low > 0 && (
                <Badge variant="secondary" className="text-xs bg-green-500/10 border-green-500/20 text-green-400">
                  {priorityDist.low} low
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={allSelected ? onClearSelection : onSelectAll}
              className="text-xs text-gray-400 hover:text-white"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary Actions */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkComplete}
              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete ({selectedTasks.length})
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkSnooze}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              <Moon className="w-4 h-4 mr-2" />
              Snooze
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBulkReschedule}
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reschedule
            </Button>
          </motion.div>

          {/* Secondary Actions */}
          <motion.div
            className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700/50"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="w-4 h-4 mr-1" />
              <ChevronDown className={cn(
                "w-3 h-3 transition-transform",
                showActions && "rotate-180"
              )} />
            </Button>
          </motion.div>
        </div>

        {/* Extended Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedTasks.length})
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Assign
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Group
                </Button>
              </div>

              {/* Task Preview */}
              <div className="mt-3 p-2 rounded-lg bg-gray-900/50 border border-gray-700/50">
                <div className="text-xs text-gray-400 mb-1">Selected Tasks Preview:</div>
                <div className="space-y-1">
                  {selectedTaskObjects.slice(0, 3).map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.priority === 'high' ? 'bg-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      )} />
                      <span className="text-white truncate">{task.title}</span>
                    </motion.div>
                  ))}
                  {selectedTaskObjects.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{selectedTaskObjects.length - 3} more tasks...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b-2xl"
          initial={{ width: 0 }}
          animate={{ width: `${(selectedTasks.length / allTasks.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Bulk Dialogs */}
      {bulkTask && (
        <>
          <SnoozeDialog
            open={showSnoozeDialog}
            onOpenChange={(open) => {
              if (!open) {
                handleSnoozeDialogClose();
              }
            }}
            task={bulkTask}
          />
          
          <RescheduleDialog
            open={showRescheduleDialog}
            onOpenChange={(open) => {
              if (!open) {
                handleRescheduleDialogClose();
              }
            }}
            task={bulkTask}
          />
        </>
      )}
    </>
  );
} 