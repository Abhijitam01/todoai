"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Quote, 
  Trophy, 
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Heart,
  Coffee
} from "lucide-react";

interface MotivationalSectionProps {
  completionRate: number;
}

export function MotivationalSection({ completionRate }: MotivationalSectionProps) {
  const [randomQuote, setRandomQuote] = useState<{
    text: string;
    author: string;
    category: string;
  } | null>(null);

  const motivationalQuotes = [
    {
      text: "The secret to getting ahead is getting started.",
      author: "Mark Twain",
      category: "Action"
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      category: "Consistency"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
      category: "Persistence"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
      category: "Action"
    }
  ];

  // Set random quote after hydration to avoid SSR mismatch
  useEffect(() => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setRandomQuote(quote);
  }, []);

  const achievements = [
    { icon: Trophy, title: "Goal Achiever", description: "Completed 5 goals this month", color: "text-yellow-400" },
    { icon: Zap, title: "Speed Demon", description: "Completed 10 tasks in one day", color: "text-orange-400" },
    { icon: Star, title: "Consistency Master", description: "7-day streak active", color: "text-purple-400" },
    { icon: Heart, title: "Self Care", description: "Balanced work and wellness", color: "text-pink-400" }
  ];

  const getMotivationalMessage = () => {
    if (completionRate >= 80) {
      return {
        message: "You're absolutely crushing it today! 🔥",
        submessage: "Your dedication is truly inspiring. Keep this momentum!",
        color: "text-green-400",
        bgColor: "bg-green-500/10"
      };
    } else if (completionRate >= 60) {
      return {
        message: "Great progress today! 👏",
        submessage: "You're well on your way to achieving your goals.",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10"
      };
    } else if (completionRate >= 40) {
      return {
        message: "You're building momentum! 💪",
        submessage: "Every step forward counts. Keep pushing!",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10"
      };
    } else if (completionRate > 0) {
      return {
        message: "Every start is a victory! 🌟",
        submessage: "You've begun the journey - that's the hardest part.",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10"
      };
    } else {
      return {
        message: "Ready to make today amazing? ✨",
        submessage: "Your next achievement is just one task away!",
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10"
      };
    }
  };

  const motivation = getMotivationalMessage();

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      {/* Motivational Message */}
      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${motivation.bgColor}`}>
            <Sparkles className={`h-5 w-5 ${motivation.color}`} />
          </div>
          <h3 className="text-lg font-semibold text-white">Daily Motivation</h3>
        </div>
        
        <div className={`${motivation.bgColor} rounded-lg p-4 mb-4`}>
          <p className={`text-lg font-semibold ${motivation.color} mb-2`}>
            {motivation.message}
          </p>
          <p className="text-gray-300 text-sm">
            {motivation.submessage}
          </p>
        </div>

        {/* Quote of the Day */}
        {randomQuote && (
          <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-red-500">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-300 italic mb-2">"{randomQuote.text}"</p>
                <p className="text-sm text-gray-400">— {randomQuote.author}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                  {randomQuote.category}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/70 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className={`p-2 rounded-lg bg-gray-800`}>
                <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">{achievement.title}</h4>
                <p className="text-xs text-gray-400">{achievement.description}</p>
              </div>
              <div className="flex">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wellness Reminder */}
        <motion.div
          className="mt-6 pt-6 border-t border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <Coffee className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Take a break!</p>
              <p className="text-xs text-gray-400">You've been working hard. Time for a coffee? ☕</p>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
} 