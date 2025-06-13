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
import { Calendar, Clock } from "lucide-react";

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (newDate: Date) => void;
  taskTitle: string;
}

export function RescheduleDialog({ 
  open, 
  onOpenChange, 
  onReschedule, 
  taskTitle 
}: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleReschedule = () => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      onReschedule(date);
      setSelectedDate("");
    }
  };

  const handleCancel = () => {
    setSelectedDate("");
    onOpenChange(false);
  };

  // Generate quick date options
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const quickOptions = [
    { label: "Tomorrow", date: tomorrow },
    { label: "Next Week", date: nextWeek },
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
      <DialogContent className="sm:max-w-md bg-black border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white/90 font-light">
            <Calendar className="w-4 h-4 text-white/50" />
            Reschedule
          </DialogTitle>
          <DialogDescription className="text-white/60 font-light">
            When would you like to complete "{taskTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Options */}
          <div>
            <label className="text-xs text-white/40 mb-3 block font-medium tracking-wide uppercase">
              Quick Options
            </label>
            <div className="grid grid-cols-2 gap-3">
              {quickOptions.map((option, index) => (
                <motion.div
                  key={option.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 text-left bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white"
                    onClick={() => setSelectedDate(option.date.toISOString().split('T')[0])}
                  >
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-white/50 mt-1">
                        {formatDate(option.date)}
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
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
            />
          </div>

          {/* Selected Date Preview */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/20 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 text-white/70">
                <Clock className="w-3 h-3" />
                <span className="text-sm">
                  Rescheduled to {formatDate(new Date(selectedDate))}
                </span>
              </div>
            </motion.div>
          )}
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
            className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40"
          >
            Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 