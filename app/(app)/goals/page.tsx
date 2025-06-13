"use client";

import { GoalCard, Goal } from "@/components/goals/GoalCard";

export default function GoalsPage() {
  // Use lowercase status values to match the GoalCard type
  const goals: Goal[] = [
    {
      id: "goal-1",
      title: "Learn Python",
      description: "Master Python programming from basics to advanced topics",
      category: "education",
      startDate: "2025-06-01",
      endDate: "2025-09-01",
      progress: 40,
      status: "active",
    },
    {
      id: "goal-2",
      title: "Build Portfolio Website",
      description: "Create a professional portfolio to showcase my work",
      category: "career",
      startDate: "2025-05-01",
      endDate: "2025-06-15",
      progress: 100,
      status: "completed",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Goals</h1>
      {goals.length === 0 ? (
        <div className="py-16 text-center text-gray-400">No goals yet. Start by creating one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
} 