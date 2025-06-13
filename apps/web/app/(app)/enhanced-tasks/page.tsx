"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { BulkActionsToolbar } from "@/components/tasks/BulkActionsToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Plus, 
  Volume2, 
  VolumeX, 
  Settings, 
  Filter,
  Calendar,
  Clock,
  Users,
  Target,
  BarChart3,
  CheckCircle2,
  Moon,
  Calendar as CalendarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import useTaskStore, { Task } from "@/lib/stores/taskStore";
import { ToastProvider, useTaskToasts } from "@/components/ui/toast";
import { useSoundEffects } from "@/lib/hooks/useSoundEffects";

// Sample tasks data
const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Review quarterly performance metrics",
    description: "Analyze Q4 performance data and prepare executive summary for board meeting next week.",
    priority: "high",
    timeEstimate: "3 hours",
    tags: ["analysis", "executive", "quarterly"],
    completed: false,
    dueTime: "2:00 PM",
    dueDate: "2024-01-20",
    goal: "Q4 Review",
    status: "PENDING"
  },
  {
    title: "Update team documentation",
    description: "Revise onboarding materials and API documentation based on recent changes.",
    priority: "medium",
    timeEstimate: "2 hours",
    tags: ["documentation", "team", "api"],
    completed: false,
    dueTime: "10:00 AM",
    dueDate: "2024-01-18",
    goal: "Documentation",
    status: "PENDING"
  },
  {
    title: "Schedule client feedback session",
    description: "Coordinate with product team to gather user feedback on new feature release.",
    priority: "high",
    timeEstimate: "1 hour",
    tags: ["client", "feedback", "coordination"],
    completed: false,
    dueTime: "3:30 PM",
    dueDate: "2024-01-19",
    goal: "Client Relations",
    status: "PENDING"
  },
  {
    title: "Optimize database queries",
    description: "Investigate and improve slow-performing queries in the analytics dashboard.",
    priority: "medium",
    timeEstimate: "4 hours",
    tags: ["database", "optimization", "performance"],
    completed: false,
    dueTime: "9:00 AM",
    dueDate: "2024-01-22",
    goal: "Performance",
    status: "PENDING"
  },
  {
    title: "Prepare presentation for stakeholders",
    description: "Create slides for upcoming project milestone review with key stakeholders.",
    priority: "high",
    timeEstimate: "2.5 hours",
    tags: ["presentation", "stakeholders", "milestone"],
    completed: false,
    dueTime: "11:00 AM",
    dueDate: "2024-01-21",
    goal: "Stakeholder Management",
    status: "PENDING"
  },
  {
    title: "Code review for authentication system",
    description: "Review pull requests for the new multi-factor authentication implementation.",
    priority: "low",
    timeEstimate: "1.5 hours",
    tags: ["code-review", "security", "authentication"],
    completed: true,
    dueTime: "4:00 PM",
    dueDate: "2024-01-17",
    goal: "Security",
    status: "COMPLETED"
  }
];

// Loading skeleton components
const TaskCardSkeleton = () => (
  <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4 bg-gray-800" />
          <Skeleton className="h-5 w-64 bg-gray-800" />
        </div>
        <Skeleton className="w-6 h-6 bg-gray-800" />
      </div>
      <Skeleton className="h-4 w-full bg-gray-800" />
      <Skeleton className="h-4 w-3/4 bg-gray-800" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 bg-gray-800" />
        <Skeleton className="h-5 w-20 bg-gray-800" />
        <Skeleton className="h-5 w-18 bg-gray-800" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 bg-gray-800" />
        <Skeleton className="h-6 w-16 bg-gray-800" />
      </div>
    </div>
  </div>
);

const EnhancedTasksSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <Skeleton className="h-10 w-80 bg-gray-800 mb-2" />
        <Skeleton className="h-6 w-96 bg-gray-800" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-24 bg-gray-800" />
        <Skeleton className="h-10 w-10 bg-gray-800" />
        <Skeleton className="h-10 w-10 bg-gray-800" />
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
          <Skeleton className="h-4 w-16 bg-gray-800 mb-2" />
          <Skeleton className="h-8 w-12 bg-gray-800" />
        </div>
      ))}
    </div>

    {/* Filters Skeleton */}
    <div className="flex flex-col md:flex-row gap-4">
      <Skeleton className="h-10 flex-1 bg-gray-800" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 bg-gray-800" />
        ))}
      </div>
    </div>

    {/* Tasks Grid Skeleton */}
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

function TaskManagementDemo() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'snoozed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Zustand store
  const tasks = useTaskStore(state => state.tasks);
  const addTask = useTaskStore(state => state.addTask);
  const canUndo = useTaskStore(state => state.canUndo);
  const canRedo = useTaskStore(state => state.canRedo);
  const undo = useTaskStore(state => state.undo);
  const redo = useTaskStore(state => state.redo);

  // Toast notifications
  const toasts = useTaskToasts();

  // Sound effects
  const { playSound, settings: soundSettings, updateSettings: updateSoundSettings } = useSoundEffects();

  // Initialize with sample data and loading simulation
  useEffect(() => {
    // Simulate loading for 2 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (tasks.length === 0) {
      sampleTasks.forEach(task => addTask(task));
    }

    return () => clearTimeout(loadingTimer);
  }, [tasks.length, addTask]);

  // Handle task selection
  const handleTaskSelection = (taskId: string, selected: boolean) => {
    setSelectedTasks(prev => {
      if (selected) {
        const newSelection = [...prev, taskId];
        playSound('select');
        return newSelection;
      } else {
        return prev.filter(id => id !== taskId);
      }
    });
  };

  const handleSelectAll = () => {
    const filteredTaskIds = getFilteredTasks().map(task => task.id);
    setSelectedTasks(filteredTaskIds);
    toasts.onSuccess(`Selected ${filteredTaskIds.length} tasks`);
    playSound('bulk_action');
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
    playSound('select');
  };

  // Filter tasks
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Status filter
      if (filter !== 'all' && task.status.toLowerCase() !== filter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  // For demo purposes, uncomment the line below to test empty state
  // const filteredTasks: Task[] = [];

  // Task statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    snoozed: tasks.filter(t => t.status === 'SNOOZED').length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    overdue: tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.dueDate < today && t.status !== 'COMPLETED';
    }).length
  };

  const handleAddSampleTask = () => {
    const newTaskData = {
      title: `New Task ${tasks.length + 1}`,
      description: "This is a sample task created for demonstration.",
      priority: "medium" as const,
      timeEstimate: "1 hour",
      tags: ["sample", "demo"],
      completed: false,
      dueTime: "2:00 PM",
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      goal: "Demo Goal",
      status: "PENDING" as const
    };
    
    addTask(newTaskData);
    toasts.onTaskCreated(newTaskData.title);
    playSound('success');
  };

  if (isLoading) {
    return <EnhancedTasksSkeleton />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Enhanced Task Management</h1>
              <p className="text-gray-400 text-sm">
                Advanced task management with bulk operations, sound effects, and smart notifications
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { undo(); playSound('undo'); }}
                  disabled={!canUndo()}
                  title="Undo last action"
                >
                  ↶
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { redo(); playSound('redo'); }}
                  disabled={!canRedo()}
                  title="Redo last action"
                >
                  ↷
                </Button>
              </div>

              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  updateSoundSettings({ enabled: !soundSettings.enabled });
                  if (soundSettings.enabled) {
                    toasts.onSuccess('Sound effects disabled');
                  } else {
                    playSound('success');
                    toasts.onSuccess('Sound effects enabled');
                  }
                }}
                title={soundSettings.enabled ? 'Disable sound effects' : 'Enable sound effects'}
              >
                {soundSettings.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {/* Bulk Actions Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowBulkActions(!showBulkActions);
                  if (!showBulkActions) {
                    toasts.onSuccess('Bulk selection mode enabled');
                    playSound('success');
                  }
                }}
                className={cn(showBulkActions && "bg-blue-500/20 text-blue-400")}
              >
                <Users className="w-4 h-4 mr-2" />
                Bulk Actions
              </Button>

              <Button onClick={handleAddSampleTask} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Done</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Snoozed</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{stats.snoozed}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">High Priority</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.highPriority}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-900/50 border-gray-700/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'completed', 'snoozed'] as const).map((status) => (
              <Button
                key={status}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(status)}
                className={cn(
                  "capitalize",
                  filter === status && "bg-blue-500/20 text-blue-400"
                )}
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
              <Button
                key={priority}
                variant="ghost"
                size="sm"
                onClick={() => setPriorityFilter(priority)}
                className={cn(
                  "capitalize",
                  priorityFilter === priority && "bg-orange-500/20 text-orange-400"
                )}
              >
                {priority}
              </Button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSelect={showBulkActions ? handleTaskSelection : undefined}
                isSelected={selectedTasks.includes(task.id)}
                showBulkActions={showBulkActions}
              />
            ))}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <>
              {searchQuery || filter !== 'all' || priorityFilter !== 'all' ? (
                <EmptyState
                  icon="🔍"
                  title="No tasks match your filters"
                  description="Try adjusting your search terms or filters to find what you're looking for."
                  action={{
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchQuery('');
                      setFilter('all');
                      setPriorityFilter('all');
                    }
                  }}
                  className="py-12"
                />
              ) : (
                <EmptyState
                  icon="📝"
                  title="No tasks yet"
                  description="Create your first task to get started with enhanced task management."
                  action={{
                    label: "Create First Task",
                    onClick: handleAddSampleTask
                  }}
                  className="py-12"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedTasks={selectedTasks}
        allTasks={filteredTasks}
        onClearSelection={handleClearSelection}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
}

export default function EnhancedTasksPage() {
  return (
    <ToastProvider>
      <TaskManagementDemo />
    </ToastProvider>
  );
} 