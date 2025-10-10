import * as React from "react";
import { cn } from "@/lib/utils";

export interface NotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const NotionCard = React.forwardRef<HTMLDivElement, NotionCardProps>(
  ({ className, hover = false, padding = "md", children, ...props }, ref) => {
    const paddingStyles = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white",
          paddingStyles[padding],
          hover && "hover:border-gray-300 hover:shadow-sm transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NotionCard.displayName = "NotionCard";

export interface NotionCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const NotionCardHeader = React.forwardRef<HTMLDivElement, NotionCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  )
);

NotionCardHeader.displayName = "NotionCardHeader";

export interface NotionCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const NotionCardTitle = React.forwardRef<HTMLParagraphElement, NotionCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    />
  )
);

NotionCardTitle.displayName = "NotionCardTitle";

export interface NotionCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const NotionCardContent = React.forwardRef<HTMLDivElement, NotionCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-gray-600", className)} {...props} />
  )
);

NotionCardContent.displayName = "NotionCardContent";

export { NotionCard, NotionCardHeader, NotionCardTitle, NotionCardContent };
