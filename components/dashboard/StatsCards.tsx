"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  Zap
} from "lucide-react";

interface StatsCardsProps {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalTime: number;
}

export function StatsCards({ 
  totalTasks, 
  completedTasks, 
  completionRate, 
  totalTime 
}: StatsCardsProps) {
  const stats = [
    {
      title: "Tasks Today",
      value: totalTasks,
      subtitle: `${completedTasks} completed`,
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: "+2 from yesterday"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: "Daily progress",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: completionRate >= 80 ? "Excellent!" : completionRate >= 60 ? "Good pace" : "Keep going!"
    },
    {
      title: "Time Remaining",
      value: `${Math.round(totalTime)}h`,
      subtitle: "Estimated work",
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      change: "Focus time"
    },
    {
      title: "Streak",
      value: "7 days",
      subtitle: "Daily consistency",
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "Keep it up!"
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
        >
          <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700/50 p-6 hover:bg-gray-800/60 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.subtitle}</p>
                  <p className={`text-xs font-medium ${
                    stat.change.includes('Excellent') || stat.change.includes('Keep it up') 
                      ? 'text-green-400' 
                      : stat.change.includes('Good') 
                        ? 'text-blue-400' 
                        : 'text-gray-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
} 