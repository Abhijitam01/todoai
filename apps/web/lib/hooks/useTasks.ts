import { useState, useEffect, useCallback } from 'react';
import { tasksApi, Task, CreateTaskRequest, UpdateTaskRequest } from '../api/tasks';
import { realtimeService } from '../realtime';

export interface UseTasksOptions {
  goalId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<Task | null>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<Task | null>;
  completeTask: (id: string) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  markOverdueTasks: () => Promise<boolean>;
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasks(options);
      
      if (response.success) {
        setTasks(response.data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [options.goalId, options.status, options.startDate, options.endDate]);

  const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task | null> => {
    try {
      const response = await tasksApi.createTask(data);
      if (response.success) {
        await fetchTasks(); // Refresh the list
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to create task:', err);
      return null;
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, data: UpdateTaskRequest): Promise<Task | null> => {
    try {
      const response = await tasksApi.updateTask(id, data);
      if (response.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...response.data } : task
        ));
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to update task:', err);
      return null;
    }
  }, []);

  const completeTask = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const response = await tasksApi.completeTask(id);
      if (response.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...response.data } : task
        ));
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to complete task:', err);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await tasksApi.deleteTask(id);
      if (response.success) {
        // Remove from local state
        setTasks(prev => prev.filter(task => task.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete task:', err);
      return false;
    }
  }, []);

  const markOverdueTasks = useCallback(async (): Promise<boolean> => {
    try {
      const response = await tasksApi.markOverdueTasks();
      if (response.success) {
        await fetchTasks(); // Refresh the list
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to mark overdue tasks:', err);
      return false;
    }
  }, [fetchTasks]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Real-time updates
  useEffect(() => {
    const handleTaskUpdated = (data: any) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, ...data.updates } : task
      ));
    };

    const handleTaskCompleted = (data: any) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, status: 'completed', completedAt: new Date().toISOString() } : task
      ));
    };

    const handlePlanAdapted = (data: any) => {
      // Refresh tasks when plan is adapted
      fetchTasks();
    };

    realtimeService.on('task_updated', handleTaskUpdated);
    realtimeService.on('task_completed', handleTaskCompleted);
    realtimeService.on('plan_adapted', handlePlanAdapted);

    return () => {
      realtimeService.off('task_updated', handleTaskUpdated);
      realtimeService.off('task_completed', handleTaskCompleted);
      realtimeService.off('plan_adapted', handlePlanAdapted);
    };
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    markOverdueTasks,
  };
}

export function useTodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodayTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTodayTasks();
      
      if (response.success) {
        setTasks(response.data);
      } else {
        setError('Failed to fetch today\'s tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch today\'s tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const completeTask = useCallback(async (id: string): Promise<Task | null> => {
    try {
      const response = await tasksApi.completeTask(id);
      if (response.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...response.data } : task
        ));
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to complete task:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchTodayTasks();
  }, [fetchTodayTasks]);

  // Real-time updates for today's tasks
  useEffect(() => {
    const handleTaskCompleted = (data: any) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, status: 'completed', completedAt: new Date().toISOString() } : task
      ));
    };

    const handleTaskUpdated = (data: any) => {
      setTasks(prev => prev.map(task => 
        task.id === data.taskId ? { ...task, ...data.updates } : task
      ));
    };

    realtimeService.on('task_completed', handleTaskCompleted);
    realtimeService.on('task_updated', handleTaskUpdated);

    return () => {
      realtimeService.off('task_completed', handleTaskCompleted);
      realtimeService.off('task_updated', handleTaskUpdated);
    };
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTodayTasks,
    completeTask,
  };
}

export function useTask(id: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTask(id);
      
      if (response.success) {
        setTask(response.data);
      } else {
        setError('Failed to fetch task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateTask = useCallback(async (data: UpdateTaskRequest): Promise<Task | null> => {
    try {
      const response = await tasksApi.updateTask(id, data);
      if (response.success) {
        setTask(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to update task:', err);
      return null;
    }
  }, [id]);

  const completeTask = useCallback(async (): Promise<Task | null> => {
    try {
      const response = await tasksApi.completeTask(id);
      if (response.success) {
        setTask(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to complete task:', err);
      return null;
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  // Real-time updates for specific task
  useEffect(() => {
    const handleTaskUpdated = (data: any) => {
      if (data.taskId === id) {
        setTask(prev => prev ? { ...prev, ...data.updates } : null);
      }
    };

    const handleTaskCompleted = (data: any) => {
      if (data.taskId === id) {
        setTask(prev => prev ? { ...prev, status: 'completed', completedAt: new Date().toISOString() } : null);
      }
    };

    realtimeService.on('task_updated', handleTaskUpdated);
    realtimeService.on('task_completed', handleTaskCompleted);

    return () => {
      realtimeService.off('task_updated', handleTaskUpdated);
      realtimeService.off('task_completed', handleTaskCompleted);
    };
  }, [id]);

  return {
    task,
    loading,
    error,
    refetch: fetchTask,
    updateTask,
    completeTask,
  };
}
