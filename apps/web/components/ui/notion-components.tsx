"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  MoreHorizontal, 
  X, 
  Check, 
  Search,
  Star,
  StarOff,
  Copy,
  Trash2,
  Edit3,
  Share2,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from "lucide-react";

// Enhanced Button Component
export interface NotionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "text" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const NotionButton = React.forwardRef<HTMLButtonElement, NotionButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    icon, 
    children, 
    loading = false,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border border-gray-200",
      ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
      text: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
      danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm"
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-6 text-base"
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          icon && <span className="mr-2">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

NotionButton.displayName = "NotionButton";

// Enhanced Input Component
export interface NotionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  label?: string;
  helper?: string;
}

export const NotionInput = React.forwardRef<HTMLInputElement, NotionInputProps>(
  ({ className, type, icon, error, label, helper, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              icon && "pl-10",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500">{helper}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

NotionInput.displayName = "NotionInput";

// Enhanced Card Components
export interface NotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  border?: boolean;
}

export const NotionCard = React.forwardRef<HTMLDivElement, NotionCardProps>(
  ({ className, hover = false, padding = "md", border = true, children, ...props }, ref) => {
    const paddingStyles = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg bg-white",
          border && "border border-gray-200",
          paddingStyles[padding],
          hover && "hover:border-gray-300 hover:shadow-md transition-all duration-150",
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

// Dropdown Component
export interface NotionDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export const NotionDropdown: React.FC<NotionDropdownProps> = ({
  trigger,
  children,
  align = "left",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
export interface NotionDropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  danger?: boolean;
}

export const NotionDropdownItem: React.FC<NotionDropdownItemProps> = ({
  icon,
  children,
  danger = false,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "w-full flex items-center px-3 py-2 text-sm text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors",
        danger && "text-red-600 hover:bg-red-50",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

// Modal Component
export interface NotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const NotionModal: React.FC<NotionModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className={cn(
        "relative w-full rounded-lg bg-white shadow-xl",
        sizeClasses[size],
        className
      )}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Toggle Component
export interface NotionToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const NotionToggle: React.FC<NotionToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className="flex items-start space-x-3">
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          checked ? "bg-blue-600" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

// Badge Component
export interface NotionBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
}

export const NotionBadge = React.forwardRef<HTMLDivElement, NotionBadgeProps>(
  ({ className, variant = "default", size = "md", removable = false, onRemove, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full";
    
    const variants = {
      default: "bg-gray-100 text-gray-800",
      secondary: "bg-gray-50 text-gray-600 border border-gray-200",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800"
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
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 p-0.5 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }
);

NotionBadge.displayName = "NotionBadge";

// Progress Component
export interface NotionProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  label?: string;
}

export const NotionProgress = React.forwardRef<HTMLDivElement, NotionProgressProps>(
  ({ className, value, max = 100, size = "md", variant = "default", showLabel = false, label, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3"
    };

    const variantStyles = {
      default: "bg-blue-600",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600"
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {label || "Progress"}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeStyles[size])}>
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              variantStyles[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

NotionProgress.displayName = "NotionProgress";

// Loading Spinner Component
export interface NotionSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "white";
}

export const NotionSpinner = React.forwardRef<HTMLDivElement, NotionSpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeStyles = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8"
    };

    const variantStyles = {
      default: "text-gray-600",
      primary: "text-blue-600",
      white: "text-white"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

NotionSpinner.displayName = "NotionSpinner";

// Tooltip Component
export interface NotionTooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export const NotionTooltip: React.FC<NotionTooltipProps> = ({
  content,
  children,
  placement = "top",
  delay = 300
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const placementStyles = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap",
            placementStyles[placement]
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              placement === "top" && "top-full left-1/2 transform -translate-x-1/2 -mt-1",
              placement === "bottom" && "bottom-full left-1/2 transform -translate-x-1/2 -mb-1",
              placement === "left" && "left-full top-1/2 transform -translate-y-1/2 -ml-1",
              placement === "right" && "right-full top-1/2 transform -translate-y-1/2 -mr-1"
            )}
          />
        </div>
      )}
    </div>
  );
};
