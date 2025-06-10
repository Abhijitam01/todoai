"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  CalendarDays,
  ArrowRight,
  CalendarPlus,
  Users,
  Briefcase,
  Home,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/lib/stores/taskStore";
import { useTaskToasts } from "@/components/ui/toast";

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

const RESCHEDULE_PRESETS = [
  {
    label: "Tomorrow",
    value: "tomorrow",
    icon: <CalendarDays className="w-4 h-4" />,
    description: "Move to tomorrow",
    getDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    },
  },
  {
    label: "Next Week",
    value: "next_week",
    icon: <Calendar className="w-4 h-4" />,
    description: "Monday next week",
    getDate: () => {
      const nextWeek = new Date();
      const daysUntilMonday = (8 - nextWeek.getDay()) % 7;
      nextWeek.setDate(nextWeek.getDate() + daysUntilMonday);
      return nextWeek.toISOString().split('T')[0];
    },
  },
  {
    label: "Next Month",
    value: "next_month",
    icon: <CalendarPlus className="w-4 h-4" />,
    description: "First Monday",
    getDate: () => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
      // Find first Monday
      const firstMonday = 1 + ((8 - nextMonth.getDay()) % 7);
      nextMonth.setDate(firstMonday);
      return nextMonth.toISOString().split('T')[0];
    },
  },
];

const REASON_TEMPLATES = [
  {
    label: "Meeting Conflict",
    icon: <Users className="w-4 h-4" />,
    text: "Conflicting meeting scheduled",
  },
  {
    label: "Work Priority",
    icon: <Briefcase className="w-4 h-4" />,
    text: "Higher priority work item emerged",
  },
  {
    label: "Personal Commitment",
    icon: <Home className="w-4 h-4" />,
    text: "Personal commitment takes priority",
  },
  {
    label: "Need More Time",
    icon: <Clock className="w-4 h-4" />,
    text: "Need additional time to prepare",
  },
  {
    label: "Urgent Request",
    icon: <Zap className="w-4 h-4" />,
    text: "Urgent request from stakeholder",
  },
];

const getSmartSuggestion = (task: Task) => {
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const daysDifference = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  // Smart suggestions based on current due date and priority
  if (daysDifference <= 1) {
    return task.priority === 'high' ? 'tomorrow' : 'next_week';
  } else if (daysDifference <= 7) {
    return task.priority === 'high' ? 'next_week' : 'next_month';
  } else {
    return 'next_month';
  }
};

export function RescheduleDialog({ open, onOpenChange, task }: RescheduleDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
  const rescheduleTask = useTaskStore(state => state.rescheduleTask);
  const toasts = useTaskToasts();

  // Smart suggestion on open
  useEffect(() => {
    if (open && task) {
      const suggestion = getSmartSuggestion(task);
      setSelectedPreset(suggestion);
    }
  }, [open, task]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys for quick selection
      const num = parseInt(e.key);
      if (num >= 1 && num <= RESCHEDULE_PRESETS.length) {
        e.preventDefault();
        setSelectedPreset(RESCHEDULE_PRESETS[num - 1].value);
        setIsCustom(false);
      }
      
      // Enter to confirm (if not in textarea)
      if (e.key === 'Enter' && e.target !== document.querySelector('textarea') && (selectedPreset || customDate)) {
        e.preventDefault();
        handleConfirm();
      }
      
      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedPreset, customDate]);

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setIsCustom(false);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setSelectedPreset('');
    
    // Set default custom date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCustomDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleReasonTemplate = (template: string) => {
    setReason(template);
  };

  const handleConfirm = () => {
    let newDate: string;

    if (isCustom) {
      if (!customDate) return;
      newDate = customDate;
    } else {
      const preset = RESCHEDULE_PRESETS.find(p => p.value === selectedPreset);
      if (!preset) return;
      newDate = preset.getDate();
    }

    // Update task in store
    rescheduleTask(task.id, newDate, reason || undefined);
    
    // Show toast notification
    const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    toasts.onTaskRescheduled(task.title, formattedDate, reason);

    console.log(`Task ${task.id} rescheduled to ${formattedDate}${reason ? ` - Reason: ${reason}` : ''}`);
    onOpenChange(false);
  };

  const selectedPresetData = RESCHEDULE_PRESETS.find(p => p.value === selectedPreset);
  const currentDate = new Date(task.dueDate);
  const newDate = isCustom && customDate 
    ? new Date(customDate)
    : selectedPresetData 
    ? new Date(selectedPresetData.getDate())
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-black border-gray-700">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <DialogTitle className="text-white">Reschedule: {task.title}</DialogTitle>
              <p className="text-sm text-gray-400 mt-1">
                Move this task to a new date
              </p>
            </div>
          </motion.div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Current vs New Date Preview */}
          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-1">Current Date</div>
                <div className="text-sm font-medium text-white">
                  {currentDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="text-right">
                <div className="text-xs text-gray-400 mb-1">New Date</div>
                <div className="text-sm font-medium text-orange-300">
                  {newDate ? newDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  }) : 'Select date'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Badge variant="secondary" className="text-xs">
                {task.priority}
              </Badge>
              <span>Goal: {task.goal}</span>
            </div>
          </div>

          {/* Quick Date Options */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Quick Options</Label>
            <div className="grid grid-cols-1 gap-2">
              {RESCHEDULE_PRESETS.map((preset, index) => (
                <motion.button
                  key={preset.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  onClick={() => handlePresetSelect(preset.value)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                    "hover:border-orange-500/50 hover:bg-orange-500/5",
                    selectedPreset === preset.value
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-gray-700/50 bg-gray-900/30"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      "p-1.5 rounded-md",
                      selectedPreset === preset.value
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-gray-700/50 text-gray-400"
                    )}>
                      {preset.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">
                        {preset.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {preset.description} - {new Date(preset.getDate()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {index + 1}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Date Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 + RESCHEDULE_PRESETS.length * 0.05 }}
            onClick={handleCustomSelect}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 w-full",
              "hover:border-purple-500/50 hover:bg-purple-500/5",
              isCustom
                ? "border-purple-500/50 bg-purple-500/10"
                : "border-gray-700/50 bg-gray-900/30"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-md",
              isCustom
                ? "bg-purple-500/20 text-purple-400"
                : "bg-gray-700/50 text-gray-400"
            )}>
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-medium text-white">
                Custom Date
              </div>
              <div className="text-xs text-gray-400">
                Pick any date
              </div>
            </div>
          </motion.button>

          {/* Custom Date Input */}
          {isCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 pl-12"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customDate" className="text-xs text-gray-400">
                    Date
                  </Label>
                  <Input
                    id="customDate"
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="mt-1 bg-gray-900/50 border-gray-700/50"
                  />
                </div>
                <div>
                  <Label htmlFor="customTime" className="text-xs text-gray-400">
                    Time (optional)
                  </Label>
                  <Input
                    id="customTime"
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="mt-1 bg-gray-900/50 border-gray-700/50"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Reason Section */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-300">Reason (Optional)</Label>
            
            {/* Reason Templates */}
            <div className="grid grid-cols-2 gap-2">
              {REASON_TEMPLATES.map((template, index) => (
                <motion.button
                  key={template.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.03 }}
                  onClick={() => handleReasonTemplate(template.text)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left",
                    "hover:border-gray-600/50 hover:bg-gray-800/50",
                    "border-gray-700/50 bg-gray-900/30"
                  )}
                >
                  <div className="p-1 rounded bg-gray-700/50 text-gray-400">
                    {template.icon}
                  </div>
                  <div className="text-xs text-gray-300">
                    {template.label}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Custom Reason */}
            <Textarea
              placeholder="Enter a reason for rescheduling..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Summary Preview */}
          {newDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20"
            >
              <div className="flex items-center gap-2 text-sm text-orange-300 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Reschedule Summary</span>
              </div>
              <div className="text-white text-sm space-y-1">
                <div>
                  <strong>Task:</strong> {task.title}
                </div>
                <div>
                  <strong>New Date:</strong> {newDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                {reason && (
                  <div>
                    <strong>Reason:</strong> {reason}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-gray-500 text-center">
            Press 1-{RESCHEDULE_PRESETS.length} for quick selection • Enter to confirm • Esc to cancel
          </div>
        </motion.div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPreset && !customDate}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reschedule Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 