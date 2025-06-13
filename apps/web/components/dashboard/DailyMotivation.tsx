"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  RefreshCw,
  Quote
} from "lucide-react";

const motivationalQuotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers"
  },
  {
    text: "You learn more from failure than from success. Don't let it stop you.",
    author: "Unknown"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  }
];

export function DailyMotivation() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Get a quote based on the day to ensure consistency throughout the day
    const today = new Date().getDate();
    const quoteIndex = today % motivationalQuotes.length;
    setCurrentQuote(motivationalQuotes[quoteIndex]);
  }, []);

  const refreshQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border-purple-500/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Daily Inspiration</span>
              </div>
              
              <motion.div
                key={currentQuote.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-purple-400/60 mt-1 flex-shrink-0" />
                  <blockquote className="text-lg font-medium text-white leading-relaxed italic">
                    "{currentQuote.text}"
                  </blockquote>
                </div>
                <p className="text-purple-300/80 text-sm ml-8">
                  — {currentQuote.author}
                </p>
              </motion.div>
            </div>
            
            <Button
              onClick={refreshQuote}
              variant="ghost"
              size="sm"
              className="ml-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 