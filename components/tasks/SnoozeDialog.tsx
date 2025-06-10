"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Moon, Sunrise } from "lucide-react";

interface Task {
  id: string;
  title: string;
  date: string;
  goal: string;
  status: string;
}

interface SnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSnooze: (taskId: string) => void;
  task: Task;
}

export function SnoozeDialog({ 
  open, 
  onOpenChange, 
  onSnooze, 
  task 
}: SnoozeDialogProps) {
  const handleSnooze = () => {
    console.log(`Task ${task.id} snoozed to tomorrow`);
    onSnooze(task.id);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Get tomorrow's date for display
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border-white/20 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white/90 font-light">
              <Moon className="w-4 h-4 text-blue-400" />
              Snooze Task
            </DialogTitle>
            <DialogDescription className="text-white/60 font-light">
              Snooze this task until tomorrow?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            {/* Task Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/20 rounded-lg p-4"
            >
              <div className="space-y-2">
                <h4 className="font-medium text-white/90 text-sm">
                  {task.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>Goal: {task.goal}</span>
                  <span>Status: {task.status}</span>
                </div>
              </div>
            </motion.div>

            {/* Snooze Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
                  <Sunrise className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-300">
                    Will appear tomorrow
                  </div>
                  <div className="text-xs text-blue-400/70">
                    {formatDate(tomorrow)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-2 p-3 bg-white/5 border border-white/10 rounded-lg"
            >
              <Clock className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/60 leading-relaxed">
                This task will be moved to tomorrow's list and you'll see it again when you start your day.
              </p>
            </motion.div>

            {/* TODO Comment */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-white/30 bg-white/5 border border-white/10 rounded p-2"
            >
              {/* TODO: Hook up backend integration for snooze functionality */}
              💤 Ready for backend integration
            </motion.div>
          </div>

          <DialogFooter>
            <Button 
              variant="ghost" 
              onClick={handleCancel}
              className="bg-transparent border border-white/20 text-white/60 hover:bg-white/5 hover:text-white/80"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSnooze}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Moon className="w-3 h-3 mr-2" />
              Snooze
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 