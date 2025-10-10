import * as React from "react";
import { cn } from "@/lib/utils";

export interface NotionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const NotionButton = React.forwardRef<HTMLButtonElement, NotionButtonProps>(
  ({ className, variant = "default", size = "md", icon, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-gray-900 text-white hover:bg-gray-800",
      ghost: "hover:bg-gray-100 text-gray-700",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
      text: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-9 px-4 text-sm rounded-lg",
      lg: "h-11 px-6 text-base rounded-lg"
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

NotionButton.displayName = "NotionButton";

export { NotionButton };
