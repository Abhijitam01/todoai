"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  let id = React.useId();
  return (
    <div
      className={cn(
        "relative h-full w-full bg-black p-[4px] group",
        containerClassName
      )}
    >
      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center bg-black",
          className
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 z-0",
          animate && "group-hover:duration-700"
        )}
        style={{
          background: `linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000)`,
          backgroundSize: "300% 300%",
          animation: animate ? "gradient 6s ease infinite" : "none",
        }}
      />
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};
