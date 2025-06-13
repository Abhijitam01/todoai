"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Moon, 
  Calendar, 
  Clock, 
  Target, 
  Sparkles,
  CheckCircle2,
  Star
} from "lucide-react";
import { SnoozeDialog } from "./SnoozeDialog";
import { RescheduleDialog } from "./RescheduleDialog";
import { Task } from "@/lib/stores/taskStore";

export function TaskDialogDemo() {
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  // Complete sample task matching our enhanced Task interface
  const sampleTask: Task = {
    id: "demo-task-1",
    title: "Complete quarterly performance review",
    description: "Analyze team productivity metrics and prepare comprehensive report for management review",
    priority: "high",
    timeEstimate: "3 hours",
    tags: ["quarterly", "performance", "analysis", "management"],
    completed: false,
    dueTime: "2:00 PM",
    dueDate: "2024-01-25",
    goal: "Q4 Performance Analysis",
    status: "PENDING",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z"
  };

  const handleSnooze = (taskId: string, snoozeUntil: string) => {
    console.log(`Task ${taskId} snoozed until ${snoozeUntil}`);
    setSnoozeOpen(false);
  };

  const handleReschedule = (taskId: string, newDate: string, reason?: string) => {
    console.log(`Task ${taskId} rescheduled to ${newDate}${reason ? ` - ${reason}` : ''}`);
    setRescheduleOpen(false);
  };

  const features = [
    {
      icon: <Moon className="w-5 h-5 text-blue-400" />,
      title: "Smart Snooze",
      description: "Quick presets and custom scheduling",
      color: "bg-blue-500/10 border-blue-500/20"
    },
    {
      icon: <Calendar className="w-5 h-5 text-orange-400" />,
      title: "Flexible Reschedule",
      description: "Date picker with reason tracking",
      color: "bg-orange-500/10 border-orange-500/20"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      title: "Smart Suggestions",
      description: "Context-aware recommendations",
      color: "bg-purple-500/10 border-purple-500/20"
    },
    {
      icon: <Target className="w-5 h-5 text-green-400" />,
      title: "Keyboard Shortcuts",
      description: "1-5 for quick selection, Enter/Esc",
      color: "bg-green-500/10 border-green-500/20"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold text-white">
          Enhanced Task Dialogs
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Experience the next generation of task management with smart snooze options, 
          flexible rescheduling, and intuitive keyboard shortcuts.
        </p>
      </motion.div>

      {/* Sample Task Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-white flex items-center gap-2">
                  {sampleTask.title}
                  <Badge 
                    variant="secondary" 
                    className="bg-red-500/10 text-red-400 border-red-500/20"
                  >
                    {sampleTask.priority}
                  </Badge>
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  {sampleTask.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {sampleTask.timeEstimate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {sampleTask.dueDate} at {sampleTask.dueTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {sampleTask.goal}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {sampleTask.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                {sampleTask.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setSnoozeOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Moon className="w-4 h-4 mr-2" />
                Snooze Task
              </Button>
              <Button
                onClick={() => setRescheduleOpen(true)}
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className={`${feature.color} border backdrop-blur-sm`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gray-900/30 border-gray-700/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              How to Test
            </h3>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong className="text-white">Snooze Dialog:</strong> Click "Snooze Task" to explore smart preset options, 
                custom scheduling, and keyboard shortcuts (1-5 for quick selection).
              </p>
              <p>
                <strong className="text-white">Reschedule Dialog:</strong> Click "Reschedule" to test the date picker, 
                quick date options, and optional reason field.
              </p>
              <p>
                <strong className="text-white">Keyboard Navigation:</strong> Use Tab to navigate, Enter to confirm, 
                and Escape to cancel any dialog.
              </p>
              <p>
                <strong className="text-white">Console Output:</strong> Open developer tools to see the action 
                results logged to console.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialogs */}
      <SnoozeDialog
        open={snoozeOpen}
        onOpenChange={setSnoozeOpen}
        task={sampleTask}
      />

      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        task={sampleTask}
      />
    </div>
  );
} 