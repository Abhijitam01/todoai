"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Zap,
  Trophy,
  Calendar,
  Timer
} from "lucide-react";

interface AnalyticsCardsProps {
  totalTasks: number;
  completedToday: number;
  timeRemaining: number;
  completionRate: number;
}

export function AnalyticsCards({ 
  totalTasks, 
  completedToday, 
  timeRemaining, 
  completionRate 
}: AnalyticsCardsProps) {
  const analytics = [
    {
      title: "Tasks Today",
      value: totalTasks,
      subtitle: "remaining",
      icon: Target,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Completed",
      value: completedToday,
      subtitle: "tasks done",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      title: "Focus Time",
      value: `${Math.round(timeRemaining * 60)}`,
      subtitle: "minutes left",
      icon: Timer,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Progress",
      value: `${completionRate}%`,
      subtitle: "completion rate",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {analytics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className={`
            ${metric.bgColor} ${metric.borderColor} 
            border-2 bg-gray-900/50 backdrop-blur-sm 
            hover:bg-gray-900/70 transition-all duration-300
          `}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">
                  {metric.value}
                </div>
                <p className="text-xs text-gray-400">
                  {metric.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 