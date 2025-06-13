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
  category?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "completed" | "paused";
}

interface GoalCardProps {
  goal: Goal;
}

const statusBadge = (status: "active" | "completed" | "paused") => {
  if (status === "completed") {
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">✅ Completed</Badge>;
  }
  if (status === "paused") {
    return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">⏸️ Paused</Badge>;
  }
  return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">🔵 Active</Badge>;
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
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <span className="text-2xl mr-2">🎯</span>
          <CardTitle className="text-lg flex-1">{goal.title}</CardTitle>
          {statusBadge(goal.status)}
        </CardHeader>
        <CardContent className="space-y-3">
          {goal.description && (
            <p className="text-sm text-gray-600">{goal.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {goal.startDate} - {goal.endDate}
            </span>
          </div>
          {goal.category && (
            <Badge variant="outline" className="text-xs">
              {goal.category}
            </Badge>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <Button
            size="sm"
            className="w-full mt-2"
            onClick={() => console.log(goal.id)}
            variant="secondary"
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard; 