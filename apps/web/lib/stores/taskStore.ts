import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeEstimate: string;
  tags: string[];
  completed: boolean;
  dueTime: string;
  dueDate: string;
  goal: string;
  status: "PENDING" | "COMPLETED" | "SNOOZED";
  snoozeUntil?: string;
  rescheduledFrom?: string;
  rescheduledReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskAction {
  type: 'COMPLETE' | 'SNOOZE' | 'RESCHEDULE' | 'UPDATE' | 'DELETE' | 'CREATE';
  taskId: string;
  previousState: Partial<Task>;
  newState: Partial<Task>;
  timestamp: string;
}

interface TaskStore {
  // State
  tasks: Task[];
  history: TaskAction[];
  historyIndex: number;
  isLoading: boolean;
  recentlyCreatedTaskIds: Set<string>;
  recentlyUpdatedTaskIds: Set<string>;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  snoozeTask: (id: string, snoozeUntil: string) => void;
  rescheduleTask: (id: string, newDate: string, reason?: string) => void;
  
  // Bulk operations
  bulkComplete: (taskIds: string[]) => void;
  bulkSnooze: (taskIds: string[], snoozeUntil: string) => void;
  bulkReschedule: (taskIds: string[], newDate: string, reason?: string) => void;
  bulkDelete: (taskIds: string[]) => void;
  
  // Undo/Redo
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
  
  // Utility
  getTask: (id: string) => Task | undefined;
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByPriority: (priority: Task['priority']) => Task[];
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
  setAdaptedTasks: (data: { createdIds: string[], updatedIds: string[] }) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const useTaskStore = create<TaskStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    tasks: [],
    history: [],
    historyIndex: -1,
    isLoading: false,
    recentlyCreatedTaskIds: new Set(),
    recentlyUpdatedTaskIds: new Set(),

    // Helper function to create action
    createAction: (
      type: TaskAction['type'],
      taskId: string,
      previousState: Partial<Task>,
      newState: Partial<Task>
    ): TaskAction => ({
      type,
      taskId,
      previousState,
      newState,
      timestamp: new Date().toISOString(),
    }),

    // Helper function to add to history
    addToHistory: (action: TaskAction) => {
      const { history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(action);
      
      // Limit history to 50 actions
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        set({ historyIndex: historyIndex + 1 });
      }
      
      set({ history: newHistory });
    },

    // Add task
    addTask: (taskData) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };

      set((state) => ({ tasks: [...state.tasks, newTask] }));
      
      const action = (get() as any).createAction('CREATE', newTask.id, {}, newTask);
      (get() as any).addToHistory(action);
    },

    // Update task
    updateTask: (id, updates) => {
      const { tasks } = get();
      const taskIndex = tasks.findIndex(task => task.id === id);
      
      if (taskIndex === -1) return;
      
      const previousTask = tasks[taskIndex];
      const updatedTask = {
        ...previousTask,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const newTasks = [...tasks];
      newTasks[taskIndex] = updatedTask;
      
      set({ tasks: newTasks });
      
      const action = (get() as any).createAction('UPDATE', id, previousTask, updatedTask);
      (get() as any).addToHistory(action);
    },

    // Delete task
    deleteTask: (id) => {
      const { tasks } = get();
      const task = tasks.find(t => t.id === id);
      
      if (!task) return;
      
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      }));
      
      const action = (get() as any).createAction('DELETE', id, task, {});
      (get() as any).addToHistory(action);
    },

    // Complete task
    completeTask: (id) => {
      get().updateTask(id, {
        completed: true,
        status: 'COMPLETED',
      });
    },

    // Snooze task
    snoozeTask: (id, snoozeUntil) => {
      get().updateTask(id, {
        status: 'SNOOZED',
        snoozeUntil,
      });
    },

    // Reschedule task
    rescheduleTask: (id, newDate, reason) => {
      const task = get().getTask(id);
      if (!task) return;
      
      get().updateTask(id, {
        rescheduledFrom: task.dueDate,
        dueDate: newDate,
        rescheduledReason: reason,
        status: 'PENDING',
      });
    },

    // Bulk operations
    bulkComplete: (taskIds) => {
      taskIds.forEach(id => get().completeTask(id));
    },

    bulkSnooze: (taskIds, snoozeUntil) => {
      taskIds.forEach(id => get().snoozeTask(id, snoozeUntil));
    },

    bulkReschedule: (taskIds, newDate, reason) => {
      taskIds.forEach(id => get().rescheduleTask(id, newDate, reason));
    },

    bulkDelete: (taskIds) => {
      taskIds.forEach(id => get().deleteTask(id));
    },

    // Undo/Redo functionality
    canUndo: () => {
      const { historyIndex } = get();
      return historyIndex >= 0;
    },

    canRedo: () => {
      const { history, historyIndex } = get();
      return historyIndex < history.length - 1;
    },

    undo: () => {
      const { history, historyIndex, tasks } = get();
      
      if (historyIndex < 0) return;
      
      const action = history[historyIndex];
      let newTasks = [...tasks];
      
      switch (action.type) {
        case 'CREATE':
          newTasks = newTasks.filter(t => t.id !== action.taskId);
          break;
          
        case 'DELETE':
          newTasks.push(action.previousState as Task);
          break;
          
        case 'UPDATE':
        case 'COMPLETE':
        case 'SNOOZE':
        case 'RESCHEDULE':
          const taskIndex = newTasks.findIndex(t => t.id === action.taskId);
          if (taskIndex !== -1) {
            newTasks[taskIndex] = { ...newTasks[taskIndex], ...action.previousState };
          }
          break;
      }
      
      set({
        tasks: newTasks,
        historyIndex: historyIndex - 1,
      });
    },

    redo: () => {
      const { history, historyIndex, tasks } = get();
      
      if (historyIndex >= history.length - 1) return;
      
      const action = history[historyIndex + 1];
      let newTasks = [...tasks];
      
      switch (action.type) {
        case 'CREATE':
          newTasks.push(action.newState as Task);
          break;
          
        case 'DELETE':
          newTasks = newTasks.filter(t => t.id !== action.taskId);
          break;
          
        case 'UPDATE':
        case 'COMPLETE':
        case 'SNOOZE':
        case 'RESCHEDULE':
          const taskIndex = newTasks.findIndex(t => t.id === action.taskId);
          if (taskIndex !== -1) {
            newTasks[taskIndex] = { ...newTasks[taskIndex], ...action.newState };
          }
          break;
      }
      
      set({
        tasks: newTasks,
        historyIndex: historyIndex + 1,
      });
    },

    // Utility functions
    getTask: (id) => {
      return get().tasks.find(task => task.id === id);
    },

    getTasksByStatus: (status) => {
      return get().tasks.filter(task => task.status === status);
    },

    getTasksByPriority: (priority) => {
      return get().tasks.filter(task => task.priority === priority);
    },

    clearHistory: () => {
      set({ history: [], historyIndex: -1 });
    },

    setLoading: (loading) => {
      set({ isLoading: loading });
    },

    setAdaptedTasks: ({ createdIds, updatedIds }) => {
      set({
        recentlyCreatedTaskIds: new Set(createdIds),
        recentlyUpdatedTaskIds: new Set(updatedIds),
      });

      // Clear the highlights after a delay to ensure they are temporary
      setTimeout(() => {
        set({
          recentlyCreatedTaskIds: new Set(),
          recentlyUpdatedTaskIds: new Set(),
        });
      }, 5000); // Highlight for 5 seconds
    },
  }))
);

export default useTaskStore; 