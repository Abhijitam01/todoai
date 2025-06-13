"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  ArrowRight, 
  Play, 
  Pause,
  Plus,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Goal {
  id: string;
  title: string;
  progress: number;
  color: string;
  category: string;
}

interface GoalProgressProps {
  goals: Goal[];
}

export function GoalProgress({ goals }: GoalProgressProps) {
  const router = useRouter();

  const handleViewAllGoals = () => {
    router.push("/goals");
  };

  const handleCreateGoal = () => {
    router.push("/create-goal");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            Goal Progress
          </h2>
          <span className="text-sm text-gray-400">
            {goals.length} active goals
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateGoal}
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllGoals}
            className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-gray-300"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gray-900/50 border-gray-700/50 hover:bg-gray-900/70 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${goal.color}`} />
                    <div>
                      <CardTitle className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
                        {goal.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mt-1">{goal.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-lg font-bold text-white">{goal.progress}%</span>
                  </div>
                  <Progress 
                    value={goal.progress} 
                    className="h-2 bg-gray-800"
                    indicatorClassName={goal.color.replace('bg-', 'bg-')}
                  />
                  <div className="text-xs text-gray-500">
                    {goal.progress >= 80 ? "Almost there! 🎯" : 
                     goal.progress >= 50 ? "Great progress! 💪" : 
                     goal.progress >= 25 ? "Getting started 🚀" : 
                     "Just beginning ⭐"}
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/goals/${goal.id}`)}
                  className="w-full bg-gray-800/50 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white transition-all duration-300"
                  variant="outline"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Card className="bg-gray-900/30 border-gray-700/50 border-dashed">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No goals yet</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Create your first goal and start building momentum towards your dreams.
              </p>
              <Button 
                onClick={handleCreateGoal}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
} 