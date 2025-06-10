"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, CalendarDays, ArrowRight } from "lucide-react";

interface Task {
  id: string;
  title: string;
  date: string;
  goal: string;
  status: string;
}

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (taskId: string, newDate: string, reason?: string) => void;
  task: Task;
}

export function RescheduleDialog({ 
  open, 
  onOpenChange, 
  onReschedule, 
  task 
}: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const handleReschedule = () => {
    if (selectedDate) {
      console.log(`Task ${task.id} rescheduled to ${selectedDate}${reason ? ` - Reason: ${reason}` : ''}`);
      onReschedule(task.id, selectedDate, reason || undefined);
      setSelectedDate("");
      setReason("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedDate("");
    setReason("");
    onOpenChange(false);
  };

  // Generate quick date options
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const quickOptions = [
    { label: "Tomorrow", date: tomorrow },
    { label: "Next Week", date: nextWeek },
    { label: "Next Month", date: nextMonth },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-black border-white/20 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white/90 font-light">
              <Calendar className="w-4 h-4 text-orange-400" />
              Reschedule: {task.title}
            </DialogTitle>
            <DialogDescription className="text-white/60 font-light">
              When would you like to complete this task?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
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
                  <span>Current: {task.date}</span>
                  <span>Goal: {task.goal}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Options */}
            <div>
              <label className="text-xs text-white/40 mb-3 block font-medium tracking-wide uppercase">
                Quick Options
              </label>
              <div className="grid grid-cols-3 gap-3">
                {quickOptions.map((option, index) => (
                  <motion.div
                    key={option.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (0.05 * index) }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-200"
                      onClick={() => setSelectedDate(option.date.toISOString().split('T')[0])}
                    >
                      <div className="w-full">
                        <div className="font-medium text-xs">{option.label}</div>
                        <div className="text-xs text-white/50 mt-1">
                          {option.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Date Picker */}
            <div>
              <label className="text-xs text-white/40 mb-2 block font-medium tracking-wide uppercase">
                Or choose a specific date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-orange-400/50 focus:border-orange-400/50 transition-colors"
              />
            </div>

            {/* Optional Reason */}
            <div>
              <label className="text-xs text-white/40 mb-2 block font-medium tracking-wide uppercase">
                Reason (Optional)
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you rescheduling this task?"
                className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 focus:border-orange-400/50 focus:ring-orange-400/50 resize-none"
                rows={3}
              />
            </div>

            {/* Selected Date Preview */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20">
                    <CalendarDays className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-white/60">{task.date}</span>
                      <ArrowRight className="w-3 h-3 text-orange-400" />
                      <span className="text-orange-300 font-medium">
                        {formatDate(new Date(selectedDate))}
                      </span>
                    </div>
                    {reason && (
                      <div className="text-xs text-orange-400/70 mt-1">
                        "{reason}"
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TODO Comment */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-white/30 bg-white/5 border border-white/10 rounded p-2"
            >
              {/* TODO: Hook up backend integration for reschedule functionality */}
              💡 Ready for backend integration
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
              onClick={handleReschedule}
              disabled={!selectedDate}
              className="bg-orange-600 text-white hover:bg-orange-700 disabled:bg-white/20 disabled:text-white/40"
            >
              <Calendar className="w-3 h-3 mr-2" />
              Reschedule
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 