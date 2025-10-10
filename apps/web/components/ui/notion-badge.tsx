import * as React from "react";
import { cn } from "@/lib/utils";

export interface NotionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

const NotionBadge = React.forwardRef<HTMLDivElement, NotionBadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-medium rounded-md";
    
    const variants = {
      default: "bg-gray-100 text-gray-700",
      secondary: "bg-gray-50 text-gray-600 border border-gray-200",
      success: "bg-green-100 text-green-700",
      warning: "bg-yellow-100 text-yellow-700",
      error: "bg-red-100 text-red-700"
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-2.5 py-1.5 text-sm"
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NotionBadge.displayName = "NotionBadge";

export { NotionBadge };
