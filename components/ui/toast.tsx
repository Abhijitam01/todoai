"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Moon, Calendar, Trash2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface TaskToastMethods {
  onTaskCompleted: (taskTitle: string) => void;
  onTaskSnoozed: (taskTitle: string, snoozeTime: string) => void;
  onTaskRescheduled: (taskTitle: string, newDate: string, reason?: string) => void;
  onTaskDeleted: (taskTitle: string) => void;
  onTaskCreated: (taskTitle: string) => void;
  onBulkAction: (action: string, count: number) => void;
  onUndoAction: (action: string) => void;
  onRedoAction: (action: string) => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function useTaskToasts(): TaskToastMethods {
  const { addToast } = useToast();

  return {
    onTaskCompleted: useCallback((taskTitle: string) => {
      addToast({
        type: 'success',
        title: 'Task Completed! 🎉',
        description: `"${taskTitle}" has been marked as complete`,
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 4000,
      });
    }, [addToast]),

    onTaskSnoozed: useCallback((taskTitle: string, snoozeTime: string) => {
      addToast({
        type: 'info',
        title: 'Task Snoozed 😴',
        description: `"${taskTitle}" will remind you ${snoozeTime}`,
        icon: <Moon className="w-4 h-4" />,
        duration: 4000,
      });
    }, [addToast]),

    onTaskRescheduled: useCallback((taskTitle: string, newDate: string, reason?: string) => {
      addToast({
        type: 'info',
        title: 'Task Rescheduled 📅',
        description: `"${taskTitle}" moved to ${new Date(newDate).toLocaleDateString()}${reason ? ` - ${reason}` : ''}`,
        icon: <Calendar className="w-4 h-4" />,
        duration: 5000,
      });
    }, [addToast]),

    onTaskDeleted: useCallback((taskTitle: string) => {
      addToast({
        type: 'warning',
        title: 'Task Deleted 🗑️',
        description: `"${taskTitle}" has been removed`,
        icon: <Trash2 className="w-4 h-4" />,
        duration: 4000,
      });
    }, [addToast]),

    onTaskCreated: useCallback((taskTitle: string) => {
      addToast({
        type: 'success',
        title: 'Task Created ✨',
        description: `"${taskTitle}" has been added to your list`,
        duration: 3000,
      });
    }, [addToast]),

    onBulkAction: useCallback((action: string, count: number) => {
      addToast({
        type: 'success',
        title: `Bulk Action: ${action} ⚡`,
        description: `${count} tasks have been ${action.toLowerCase()}`,
        duration: 4000,
      });
    }, [addToast]),

    onUndoAction: useCallback((action: string) => {
      addToast({
        type: 'info',
        title: 'Action Undone ↶',
        description: `${action} has been undone`,
        duration: 3000,
      });
    }, [addToast]),

    onRedoAction: useCallback((action: string) => {
      addToast({
        type: 'info',
        title: 'Action Redone ↷',
        description: `${action} has been redone`,
        duration: 3000,
      });
    }, [addToast]),

    onError: useCallback((message: string) => {
      addToast({
        type: 'error',
        title: 'Error ❌',
        description: message,
        duration: 6000,
      });
    }, [addToast]),

    onSuccess: useCallback((message: string) => {
      addToast({
        type: 'success',
        title: 'Success ✅',
        description: message,
        duration: 4000,
      });
    }, [addToast]),
  };
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 15);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const getTypeIcon = () => {
    if (toast.icon) return toast.icon;
    
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className={cn(
        "relative bg-black/90 backdrop-blur-lg border rounded-xl p-4 shadow-2xl",
        "flex items-start gap-3 max-w-full",
        getTypeStyles()
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getTypeIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-medium text-white mb-1">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm text-gray-300 leading-relaxed">
            {toast.description}
          </div>
        )}
        
        {/* Action Button */}
        {toast.action && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toast.action.onClick}
              className="h-7 px-2 text-xs hover:bg-white/10"
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 h-6 w-6 p-0 hover:bg-white/10 text-gray-400 hover:text-white"
      >
        <X className="w-3 h-3" />
      </Button>

      {/* Progress Bar */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-0 h-1 rounded-b-xl",
          toast.type === 'success' ? 'bg-green-400' :
          toast.type === 'error' ? 'bg-red-400' :
          toast.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
        )}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ 
          duration: (toast.duration || 4000) / 1000,
          ease: "linear"
        }}
      />
    </motion.div>
  );
} 