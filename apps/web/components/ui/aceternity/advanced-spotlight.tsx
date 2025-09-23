"use client";
import React from "react";
import { cn } from "@/lib/utils";

type AdvancedSpotlightProps = {
  className?: string;
  fill?: string;
  size?: number;
  intensity?: number;
};

export const AdvancedSpotlight = ({ 
  className, 
  fill = "white",
  size = 2000,
  intensity = 0.3
}: AdvancedSpotlightProps) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <radialGradient id="spotlight-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={fill} stopOpacity={intensity} />
            <stop offset="50%" stopColor={fill} stopOpacity={intensity * 0.5} />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx="50%"
          cy="50%"
          r="50%"
          fill="url(#spotlight-gradient)"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
