"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BorderBeam = ({
  className,
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}) => {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        // mask styles
        "[background:linear-gradient(transparent,transparent),conic-gradient(from_180deg_at_50%_50%,var(--color-from),var(--color-to),var(--color-from))] [background-clip:padding-box,border-box] [background-origin:border-box]",
        // animation
        "animate-[border-dance_calc(var(--duration)*1s)_infinite_linear_var(--delay)]",
        className
      )}
    />
  );
};
