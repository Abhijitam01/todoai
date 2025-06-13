"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
  isAnimating?: boolean;
}

export function CustomCheckbox({ 
  checked, 
  onCheckedChange, 
  disabled = false,
  isAnimating = false 
}: CustomCheckboxProps) {
  return (
    <motion.button
      type="button"
      onClick={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300",
        "focus:outline-none focus:ring-1 focus:ring-white/30 focus:ring-offset-0",
        "disabled:cursor-not-allowed",
        checked 
          ? "bg-white border-white text-black" 
          : "border-white/30 hover:border-white/50 bg-transparent",
        isAnimating && "border-green-400 bg-green-400/20"
      )}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <Check className="w-3 h-3" strokeWidth={2} />
      </motion.div>

      {/* Completion ripple effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full border border-green-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </motion.button>
  );
} 