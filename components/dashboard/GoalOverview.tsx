"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Play,
  Pause,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  category: string;
  color: string;
}

interface GoalOverviewProps {
  goals: Goal[];
}

export function GoalOverview({ goals }: GoalOverviewProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-semibold text-white">Active Goals</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="bg-gray-900/50 border-gray-700/50 p-5 hover:bg-gray-900/70 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${goal.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{goal.name}</h3>
                      <p className="text-sm text-gray-400">{goal.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-white">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={cn(
                        "h-2 rounded-full",
                        goal.color.replace('bg-', 'bg-')
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{goal.completedTasks}</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{goal.totalTasks - goal.completedTasks}</p>
                    <p className="text-xs text-gray-400">Remaining</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{goal.totalTasks}</p>
                    <p className="text-xs text-gray-400">Total</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                    variant="outline"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-700"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add New Goal */}
        <motion.div
          className="mt-6 pt-6 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Button 
            className="w-full bg-gray-700/50 text-gray-300 hover:bg-gray-700 border-2 border-dashed border-gray-600 hover:border-gray-500"
            variant="outline"
          >
            <Target className="h-4 w-4 mr-2" />
            Create New Goal
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
} 