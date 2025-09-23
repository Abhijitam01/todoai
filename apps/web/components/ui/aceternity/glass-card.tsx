"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  hover?: boolean;
  border?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  intensity = "medium",
  hover = true,
  border = true
}: GlassCardProps) => {
  const intensityClasses = {
    low: "bg-white/5 backdrop-blur-sm",
    medium: "bg-white/10 backdrop-blur-md",
    high: "bg-white/15 backdrop-blur-lg"
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl p-6 transition-all duration-300",
        intensityClasses[intensity],
        border && "border border-white/20",
        hover && "hover:bg-white/20 hover:border-white/30",
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -2 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {children}
    </motion.div>
  );
};
