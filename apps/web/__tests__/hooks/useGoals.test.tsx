import { renderHook, act } from '@testing-library/react';
import { useGoals, useGoal } from '../../lib/hooks/useGoals';
import { goalsApi } from '../../lib/api/goals';
import { realtimeService } from '../../lib/realtime';

// Mock the API
jest.mock('../../lib/api/goals');
jest.mock('../../lib/realtime');

const mockGoalsApi = goalsApi as jest.Mocked<typeof goalsApi>;
const mockRealtimeService = realtimeService as jest.Mocked<typeof realtimeService>;

describe('useGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useGoals hook', () => {
    it('should fetch goals on mount', async () => {
      const mockResponse = {
        success: true,
        message: 'Goals retrieved successfully',
        data: [
          {
            id: '1',
            title: 'Test Goal',
            description: 'Test Description',
            priority: 'high',
            status: 'active',
            progress: 50,
            tags: ['test'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            taskStats: {
              total: 10,
              completed: 5,
              pending: 5,
              overdue: 0,
              progress: 50
            }
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      };

      mockGoalsApi.getGoals.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useGoals());

      expect(result.current.loading).toBe(true);
      expect(result.current.goals).toEqual([]);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.goals).toEqual(mockResponse.data);
      expect(result.current.pagination).toEqual(mockResponse.pagination);
    });

    it('should handle API errors', async () => {
      mockGoalsApi.getGoals.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useGoals());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('API Error');
      expect(result.current.goals).toEqual([]);
    });

    it('should create a goal', async () => {
      const mockCreateResponse = {
        success: true,
        message: 'Goal created successfully',
        data: {
          id: '2',
          title: 'New Goal',
          description: 'New Description',
          priority: 'medium',
          status: 'active',
          progress: 0,
          tags: [],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      };

      mockGoalsApi.createGoal.mockResolvedValue(mockCreateResponse);
      mockGoalsApi.getGoals.mockResolvedValue({
        success: true,
        message: 'Goals retrieved successfully',
        data: [mockCreateResponse.data],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      });

      const { result } = renderHook(() => useGoals());

      await act(async () => {
        const newGoal = await result.current.createGoal({
          title: 'New Goal',
          description: 'New Description'
        });
        expect(newGoal).toEqual(mockCreateResponse.data);
      });

      expect(mockGoalsApi.createGoal).toHaveBeenCalledWith({
        title: 'New Goal',
        description: 'New Description'
      });
    });

    it('should update a goal', async () => {
      const mockUpdateResponse = {
        success: true,
        message: 'Goal updated successfully',
        data: {
          id: '1',
          title: 'Updated Goal',
          description: 'Updated Description',
          priority: 'high',
          status: 'active',
          progress: 50,
          tags: ['test'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      };

      mockGoalsApi.updateGoal.mockResolvedValue(mockUpdateResponse);

      const { result } = renderHook(() => useGoals());

      await act(async () => {
        const updatedGoal = await result.current.updateGoal('1', {
          title: 'Updated Goal',
          description: 'Updated Description'
        });
        expect(updatedGoal).toEqual(mockUpdateResponse.data);
      });

      expect(mockGoalsApi.updateGoal).toHaveBeenCalledWith('1', {
        title: 'Updated Goal',
        description: 'Updated Description'
      });
    });

    it('should delete a goal', async () => {
      mockGoalsApi.deleteGoal.mockResolvedValue({
        success: true,
        message: 'Goal deleted successfully'
      });

      const { result } = renderHook(() => useGoals());

      await act(async () => {
        const success = await result.current.deleteGoal('1');
        expect(success).toBe(true);
      });

      expect(mockGoalsApi.deleteGoal).toHaveBeenCalledWith('1');
    });

    it('should revise a goal', async () => {
      mockGoalsApi.reviseGoal.mockResolvedValue({
        success: true,
        message: 'Goal revision requested successfully'
      });

      const { result } = renderHook(() => useGoals());

      await act(async () => {
        const success = await result.current.reviseGoal('1');
        expect(success).toBe(true);
      });

      expect(mockGoalsApi.reviseGoal).toHaveBeenCalledWith('1');
    });
  });

  describe('useGoal hook', () => {
    it('should fetch a specific goal', async () => {
      const mockResponse = {
        success: true,
        message: 'Goal retrieved successfully',
        data: {
          id: '1',
          title: 'Test Goal',
          description: 'Test Description',
          priority: 'high',
          status: 'active',
          progress: 50,
          tags: ['test'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          taskStats: {
            total: 10,
            completed: 5,
            pending: 5,
            overdue: 0,
            progress: 50
          }
        }
      };

      mockGoalsApi.getGoal.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useGoal('1'));

      expect(result.current.loading).toBe(true);
      expect(result.current.goal).toBeNull();

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.goal).toEqual(mockResponse.data);
    });

    it('should handle real-time updates', async () => {
      const { result } = renderHook(() => useGoal('1'));

      // Simulate real-time goal update
      await act(async () => {
        const updateHandler = mockRealtimeService.on.mock.calls
          .find(call => call[0] === 'goal_updated')?.[1];
        
        if (updateHandler) {
          updateHandler({
            goalId: '1',
            updates: { title: 'Updated Title' }
          });
        }
      });

      // The goal should be updated in real-time
      expect(result.current.goal?.title).toBe('Updated Title');
    });
  });

  describe('Real-time event handling', () => {
    it('should handle goal progress updates', async () => {
      const { result } = renderHook(() => useGoals());

      await act(async () => {
        const progressHandler = mockRealtimeService.on.mock.calls
          .find(call => call[0] === 'goal_progress_updated')?.[1];
        
        if (progressHandler) {
          progressHandler({
            goalId: '1',
            progress: 75
          });
        }
      });

      // The goal progress should be updated
      expect(result.current.goals.find(g => g.id === '1')?.progress).toBe(75);
    });

    it('should handle plan adaptation', async () => {
      const { result } = renderHook(() => useGoals());

      await act(async () => {
        const planHandler = mockRealtimeService.on.mock.calls
          .find(call => call[0] === 'plan_adapted')?.[1];
        
        if (planHandler) {
          planHandler({
            goalId: '1',
            changes: {
              createdIds: ['task1', 'task2'],
              updatedIds: ['task3'],
              archivedIds: ['task4']
            }
          });
        }
      });

      // The goals should be refetched
      expect(mockGoalsApi.getGoals).toHaveBeenCalled();
    });
  });
});
