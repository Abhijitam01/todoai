import { useState, useEffect, useCallback } from 'react';
import { goalsApi, Goal, CreateGoalRequest, UpdateGoalRequest } from '../api/goals';
import { realtimeService } from '../realtime';

export interface UseGoalsOptions {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  includeStats?: boolean;
}

export interface UseGoalsReturn {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => Promise<void>;
  createGoal: (data: CreateGoalRequest) => Promise<Goal | null>;
  updateGoal: (id: string, data: UpdateGoalRequest) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<boolean>;
  reviseGoal: (id: string) => Promise<boolean>;
}

export function useGoals(options: UseGoalsOptions = {}): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseGoalsReturn['pagination']>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await goalsApi.getGoals(options);
      
      if (response.success) {
        setGoals(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch goals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.status, options.category, options.includeStats]);

  const createGoal = useCallback(async (data: CreateGoalRequest): Promise<Goal | null> => {
    try {
      const response = await goalsApi.createGoal(data);
      if (response.success) {
        await fetchGoals(); // Refresh the list
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to create goal:', err);
      return null;
    }
  }, [fetchGoals]);

  const updateGoal = useCallback(async (id: string, data: UpdateGoalRequest): Promise<Goal | null> => {
    try {
      const response = await goalsApi.updateGoal(id, data);
      if (response.success) {
        // Update local state
        setGoals(prev => prev.map(goal => 
          goal.id === id ? { ...goal, ...response.data } : goal
        ));
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to update goal:', err);
      return null;
    }
  }, []);

  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await goalsApi.deleteGoal(id);
      if (response.success) {
        // Remove from local state
        setGoals(prev => prev.filter(goal => goal.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete goal:', err);
      return false;
    }
  }, []);

  const reviseGoal = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await goalsApi.reviseGoal(id);
      return response.success;
    } catch (err) {
      console.error('Failed to revise goal:', err);
      return false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Real-time updates
  useEffect(() => {
    const handleGoalUpdated = (data: any) => {
      setGoals(prev => prev.map(goal => 
        goal.id === data.goalId ? { ...goal, ...data.updates } : goal
      ));
    };

    const handleGoalProgressUpdated = (data: any) => {
      setGoals(prev => prev.map(goal => 
        goal.id === data.goalId ? { ...goal, progress: data.progress } : goal
      ));
    };

    const handlePlanAdapted = (data: any) => {
      // Refresh goals when plan is adapted
      fetchGoals();
    };

    realtimeService.on('goal_updated', handleGoalUpdated);
    realtimeService.on('goal_progress_updated', handleGoalProgressUpdated);
    realtimeService.on('plan_adapted', handlePlanAdapted);

    return () => {
      realtimeService.off('goal_updated', handleGoalUpdated);
      realtimeService.off('goal_progress_updated', handleGoalProgressUpdated);
      realtimeService.off('plan_adapted', handlePlanAdapted);
    };
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    pagination,
    refetch: fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    reviseGoal,
  };
}

export function useGoal(id: string) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoal = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await goalsApi.getGoal(id);
      
      if (response.success) {
        setGoal(response.data);
      } else {
        setError('Failed to fetch goal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goal');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateGoal = useCallback(async (data: UpdateGoalRequest): Promise<Goal | null> => {
    try {
      const response = await goalsApi.updateGoal(id, data);
      if (response.success) {
        setGoal(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to update goal:', err);
      return null;
    }
  }, [id]);

  const reviseGoal = useCallback(async (): Promise<boolean> => {
    try {
      const response = await goalsApi.reviseGoal(id);
      return response.success;
    } catch (err) {
      console.error('Failed to revise goal:', err);
      return false;
    }
  }, [id]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  // Real-time updates for specific goal
  useEffect(() => {
    const handleGoalUpdated = (data: any) => {
      if (data.goalId === id) {
        setGoal(prev => prev ? { ...prev, ...data.updates } : null);
      }
    };

    const handleGoalProgressUpdated = (data: any) => {
      if (data.goalId === id) {
        setGoal(prev => prev ? { ...prev, progress: data.progress } : null);
      }
    };

    realtimeService.on('goal_updated', handleGoalUpdated);
    realtimeService.on('goal_progress_updated', handleGoalProgressUpdated);

    return () => {
      realtimeService.off('goal_updated', handleGoalUpdated);
      realtimeService.off('goal_progress_updated', handleGoalProgressUpdated);
    };
  }, [id]);

  return {
    goal,
    loading,
    error,
    refetch: fetchGoal,
    updateGoal,
    reviseGoal,
  };
}