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
import {
  Moon,
  Sunrise,
  Clock,
  Calendar,
  Coffee,
  Sun,
  Sunset,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/lib/stores/taskStore";
import { useTaskToasts } from "@/components/ui/toast";

interface SnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

const SNOOZE_PRESETS = [
  {
    label: "2 Hours",
    value: "2h",
    icon: <Coffee className="w-4 h-4" />,
    description: "Short break",
    getTime: () => new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  {
    label: "End of Day",
    value: "eod",
    icon: <Sunset className="w-4 h-4" />,
    description: "6:00 PM today",
    getTime: () => {
      const today = new Date();
      today.setHours(18, 0, 0, 0);
      return today;
    },
  },
  {
    label: "Tomorrow Morning",
    value: "tomorrow_morning",
    icon: <Sunrise className="w-4 h-4" />,
    description: "9:00 AM tomorrow",
    getTime: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    },
  },
  {
    label: "Tomorrow Afternoon",
    value: "tomorrow",
    icon: <Sun className="w-4 h-4" />,
    description: "2:00 PM tomorrow",
    getTime: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      return tomorrow;
    },
  },
  {
    label: "Next Week",
    value: "next_week",
    icon: <Calendar className="w-4 h-4" />,
    description: "Monday 9:00 AM",
    getTime: () => {
      const nextWeek = new Date();
      const daysUntilMonday = (8 - nextWeek.getDay()) % 7;
      nextWeek.setDate(nextWeek.getDate() + daysUntilMonday);
      nextWeek.setHours(9, 0, 0, 0);
      return nextWeek;
    },
  },
];

const getSmartSuggestion = (task: Task) => {
  const hour = new Date().getHours();
  const priority = task.priority;
  
  // Smart suggestions based on time and priority
  if (hour < 9) {
    return priority === 'high' ? 'tomorrow_morning' : '2h';
  } else if (hour < 15) {
    return priority === 'high' ? 'eod' : 'tomorrow';
  } else {
    return priority === 'high' ? 'tomorrow_morning' : 'tomorrow';
  }
};

export function SnoozeDialog({ open, onOpenChange, task }: SnoozeDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customTime, setCustomTime] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
  const snoozeTask = useTaskStore(state => state.snoozeTask);
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
      if (num >= 1 && num <= SNOOZE_PRESETS.length) {
        e.preventDefault();
        setSelectedPreset(SNOOZE_PRESETS[num - 1].value);
        setIsCustom(false);
      }
      
      // Enter to confirm
      if (e.key === 'Enter' && selectedPreset) {
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
  }, [open, selectedPreset]);

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setIsCustom(false);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setSelectedPreset('');
    
    // Set default custom values
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCustomDate(tomorrow.toISOString().split('T')[0]);
    setCustomTime('09:00');
  };

  const handleConfirm = () => {
    let snoozeUntil: string;

    if (isCustom) {
      if (!customDate || !customTime) return;
      snoozeUntil = `${customDate}T${customTime}:00.000Z`;
    } else {
      const preset = SNOOZE_PRESETS.find(p => p.value === selectedPreset);
      if (!preset) return;
      snoozeUntil = preset.getTime().toISOString();
    }

    // Update task in store
    snoozeTask(task.id, snoozeUntil);
    
    // Show toast notification
    const until = new Date(snoozeUntil).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
    toasts.onTaskSnoozed(task.title, until);

    console.log(`Task ${task.id} snoozed until ${until}`);
    onOpenChange(false);
  };

  const selectedPresetData = SNOOZE_PRESETS.find(p => p.value === selectedPreset);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border-gray-700">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Moon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-white">Snooze Task</DialogTitle>
              <p className="text-sm text-gray-400 mt-1">
                When would you like to be reminded?
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
          {/* Task Preview */}
          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <h4 className="text-white text-sm font-medium mb-1">{task.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Badge variant="secondary" className="text-xs">
                {task.priority}
              </Badge>
              <span>Due: {task.dueDate}</span>
            </div>
          </div>

          {/* Snooze Presets */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Quick Options</Label>
            <div className="grid grid-cols-1 gap-2">
              {SNOOZE_PRESETS.map((preset, index) => (
                <motion.button
                  key={preset.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  onClick={() => handlePresetSelect(preset.value)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                    "hover:border-blue-500/50 hover:bg-blue-500/5",
                    selectedPreset === preset.value
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-gray-700/50 bg-gray-900/30"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      "p-1.5 rounded-md",
                      selectedPreset === preset.value
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-700/50 text-gray-400"
                    )}>
                      {preset.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-white">
                        {preset.label}
                      </div>
                      <div className="text-xs text-gray-400">
                        {preset.description}
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

          {/* Custom Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 + SNOOZE_PRESETS.length * 0.05 }}
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
              <Timer className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-medium text-white">
                Custom Time
              </div>
              <div className="text-xs text-gray-400">
                Set specific date and time
              </div>
            </div>
          </motion.button>

          {/* Custom Time Inputs */}
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
                    Time
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

          {/* Preview */}
          {(selectedPresetData || (isCustom && customDate && customTime)) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <Clock className="w-4 h-4" />
                <span>Will be reminded on:</span>
              </div>
              <div className="text-white font-medium mt-1">
                {isCustom && customDate && customTime
                  ? new Date(`${customDate}T${customTime}`).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  : selectedPresetData?.getTime().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                }
              </div>
            </motion.div>
          )}

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-gray-500 text-center">
            Press 1-{SNOOZE_PRESETS.length} for quick selection • Enter to confirm • Esc to cancel
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
            disabled={!selectedPreset && !isCustom}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Moon className="w-4 h-4 mr-2" />
            Snooze Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 