"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Timer, 
  Calendar, 
  Brain,
  Trophy,
  BookOpen,
  Zap,
  BarChart3
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Add Task",
      description: "Create a new task",
      icon: Plus,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      hoverColor: "hover:bg-green-500/20"
    },
    {
      title: "Pomodoro Timer",
      description: "Start focus session",
      icon: Timer,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      hoverColor: "hover:bg-red-500/20"
    },
    {
      title: "Schedule Review",
      description: "Plan your week",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      hoverColor: "hover:bg-blue-500/20"
    },
    {
      title: "AI Suggestions",
      description: "Get smart recommendations",
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      hoverColor: "hover:bg-purple-500/20"
    },
    {
      title: "Goals Dashboard",
      description: "Track your progress",
      icon: Trophy,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      hoverColor: "hover:bg-yellow-500/20"
    },
    {
      title: "Learning Path",
      description: "Discover new skills",
      icon: BookOpen,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      hoverColor: "hover:bg-indigo-500/20"
    },
    {
      title: "Quick Notes",
      description: "Capture ideas instantly",
      icon: Zap,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      hoverColor: "hover:bg-orange-500/20"
    },
    {
      title: "Analytics",
      description: "View detailed insights",
      icon: BarChart3,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      hoverColor: "hover:bg-cyan-500/20"
    }
  ];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={`
                ${action.bgColor} ${action.borderColor} 
                border backdrop-blur-sm p-4 cursor-pointer 
                transition-all duration-300 ${action.hoverColor}
                group
              `}>
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white group-hover:text-white/90">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 