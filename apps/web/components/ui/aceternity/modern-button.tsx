"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "./border-beam";

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "gradient" | "glass" | "neon";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    loading = false, 
    icon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 transform hover:scale-105 active:scale-95";
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-xl"
    };

    const variantClasses = {
      default: "bg-gray-900 border border-gray-700 text-white hover:bg-gray-800 hover:border-gray-600",
      gradient: "bg-gradient-to-r from-red-500 to-blue-500 text-white hover:from-red-600 hover:to-blue-600",
      glass: "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md",
      neon: "bg-black border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300 shadow-lg shadow-red-500/25"
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          isDisabled && "opacity-50 cursor-not-allowed hover:scale-100",
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        {...props}
      >
        {/* Background gradient animation for gradient variant */}
        {variant === "gradient" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 opacity-0"
            animate={{ opacity: loading ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        {/* Content */}
        <motion.div
          className={cn(
            "flex items-center justify-center gap-2",
            loading && "opacity-0"
          )}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </motion.div>
        
        {/* Border beam for neon variant */}
        {variant === "neon" && !isDisabled && (
          <BorderBeam 
            size={200}
            duration={15}
            borderWidth={1.5}
            colorFrom="#ef4444"
            colorTo="#3b82f6"
          />
        )}
      </motion.button>
    );
  }
);

ModernButton.displayName = "ModernButton";
