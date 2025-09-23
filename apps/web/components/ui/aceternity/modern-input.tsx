"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "modern" | "glass";
}

export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, label, error, icon, variant = "modern", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value);

    React.useEffect(() => {
      setHasValue(!!props.value);
    }, [props.value]);

    const baseClasses = "w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none";
    
    const variantClasses = {
      default: "bg-gray-900 border border-gray-700 text-white placeholder-gray-400 focus:border-red-500",
      modern: "bg-gray-900/50 border border-gray-700/50 text-white placeholder-gray-400 focus:border-red-500 focus:bg-gray-800/50 backdrop-blur-sm",
      glass: "bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-red-500/50 focus:bg-white/10 backdrop-blur-md"
    };

    return (
      <div className="space-y-2">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-medium text-gray-300"
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <motion.input
            ref={ref}
            className={cn(
              baseClasses,
              variantClasses[variant],
              icon && "pl-10",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />
          
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isFocused ? 1 : 0,
              scale: isFocused ? 1.02 : 1
            }}
            transition={{ duration: 0.2 }}
            style={{
              background: "linear-gradient(45deg, #ef4444, #3b82f6, #ef4444)",
              backgroundSize: "200% 200%",
              animation: isFocused ? "gradient 2s ease infinite" : "none",
              zIndex: -1
            }}
          />
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

ModernInput.displayName = "ModernInput";
