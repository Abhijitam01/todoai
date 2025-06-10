"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SnoozeDialog } from "./SnoozeDialog";
import { RescheduleDialog } from "./RescheduleDialog";
import { Clock, Calendar, Target, CheckCircle2 } from "lucide-react";

// Sample task data
const sampleTask = {
  id: "task-1",
  title: "Design hero section",
  date: "2025-06-10",
  goal: "Launch Portfolio",
  status: "PENDING"
};

export function TaskDialogDemo() {
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  const handleSnooze = (taskId: string) => {
    console.log(`✅ Snooze confirmed for task: ${taskId}`);
    // TODO: Implement actual snooze logic
  };

  const handleReschedule = (taskId: string, newDate: string, reason?: string) => {
    console.log(`✅ Reschedule confirmed for task: ${taskId} to ${newDate}${reason ? ` (${reason})` : ''}`);
    // TODO: Implement actual reschedule logic
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Task Management Dialogs</h1>
        <p className="text-white/60">Demo of Snooze and Reschedule functionality</p>
      </div>

      {/* Sample Task Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-700/50 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-blue-400" />
              Sample Task
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Task Info */}
            <div className="space-y-2">
              <h3 className="font-medium text-white">{sampleTask.title}</h3>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {sampleTask.date}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {sampleTask.goal}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {sampleTask.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSnoozeOpen(true)}
                className="h-8 px-3 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300"
              >
                <Clock className="w-3 h-3 mr-1" />
                Snooze
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRescheduleOpen(true)}
                className="h-8 px-3 text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <Card className="bg-blue-500/10 border-blue-500/20 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-blue-400" />
              Snooze Dialog
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70 space-y-2">
            <p>• Simple confirmation modal</p>
            <p>• Pushes task to tomorrow</p>
            <p>• Framer Motion animations</p>
            <p>• Console logging for demo</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/20 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-4 h-4 text-orange-400" />
              Reschedule Dialog
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-white/70 space-y-2">
            <p>• Custom date picker</p>
            <p>• Quick date options</p>
            <p>• Optional reason field</p>
            <p>• Rich preview with animations</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-white/50 bg-white/5 border border-white/10 rounded-lg p-4"
      >
        <p className="mb-2">🎯 <strong>Try it out:</strong> Click the Snooze or Reschedule buttons above</p>
        <p>Check the browser console to see the logged output from both dialogs</p>
      </motion.div>

      {/* Dialogs */}
      <SnoozeDialog
        open={snoozeOpen}
        onOpenChange={setSnoozeOpen}
        onSnooze={handleSnooze}
        task={sampleTask}
      />

      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onReschedule={handleReschedule}
        task={sampleTask}
      />
    </div>
  );
} 