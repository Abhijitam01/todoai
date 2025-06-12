import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import React from "react";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "completed" | "paused" | "planning";
  category?: string;
  priority?: "high" | "medium" | "low";
  tags?: string[];
  difficulty?: "Easy" | "Medium" | "Hard";
  estimatedHours?: number;
  actualHours?: number;
  streak?: number;
  lastUpdated?: string;
}

interface GoalCardProps {
  goal: Goal;
}

const statusBadge = (status: Goal["status"]) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">✅ Completed</Badge>;
    case "active":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">🔵 Active</Badge>;
    case "paused":
      return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">⏸️ Paused</Badge>;
    case "planning":
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">📋 Planning</Badge>;
    default:
      return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">❓ Unknown</Badge>;
  }
};

const getCategoryEmoji = (category?: string) => {
  switch (category) {
    case "Programming": return "💻";
    case "Design": return "🎨";
    case "Fitness": return "💪";
    case "Business": return "💼";
    case "Personal": return "🌟";
    case "Learning": return "📚";
    default: return "🎯";
  }
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={goal.status === "completed" ? "opacity-60" : ""}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full bg-gray-900/50 border-gray-700/50">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <span className="text-2xl mr-2">{getCategoryEmoji(goal.category)}</span>
          <div className="flex-1">
            <CardTitle className="text-lg text-white">{goal.title}</CardTitle>
            {goal.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">{goal.description}</p>
            )}
          </div>
          {statusBadge(goal.status)}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {goal.startDate} - {goal.endDate}
            </span>
          </div>
          
          {goal.category && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                {goal.category}
              </Badge>
              {goal.priority && (
                <Badge 
                  variant="outline" 
                  className={`text-xs border-gray-600 ${
                    goal.priority === "high" ? "text-red-400" : 
                    goal.priority === "medium" ? "text-yellow-400" : 
                    "text-green-400"
                  }`}
                >
                  {goal.priority}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs font-semibold text-white">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          
          {goal.estimatedHours && (
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Time: {goal.actualHours || 0}h / {goal.estimatedHours}h</span>
              {goal.streak && goal.streak > 0 && (
                <span className="text-orange-400">🔥 {goal.streak} day streak</span>
              )}
            </div>
          )}
          
          <Button
            size="sm"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => console.log(goal.id)}
            variant="default"
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard; 