import { api } from '../api';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  targetDate?: string;
  progress: number;
  tags?: string[];
  taskStats?: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    progress: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  targetDate?: string;
  tags?: string[];
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  targetDate?: string;
  tags?: string[];
}

export interface GoalsResponse {
  success: boolean;
  message: string;
  data: Goal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GoalResponse {
  success: boolean;
  message: string;
  data: Goal;
}

// Goals API functions
export const goalsApi = {
  // Get all goals with optional filtering
  async getGoals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    includeStats?: boolean;
  }): Promise<GoalsResponse> {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  // Get a specific goal by ID
  async getGoal(id: string): Promise<GoalResponse> {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // Create a new goal
  async createGoal(data: CreateGoalRequest): Promise<GoalResponse> {
    const response = await api.post('/goals', data);
    return response.data;
  },

  // Update a goal
  async updateGoal(id: string, data: UpdateGoalRequest): Promise<GoalResponse> {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  },

  // Partial update a goal
  async patchGoal(id: string, data: Partial<UpdateGoalRequest>): Promise<GoalResponse> {
    const response = await api.patch(`/goals/${id}`, data);
    return response.data;
  },

  // Delete (archive) a goal
  async deleteGoal(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  // Request AI plan revision
  async reviseGoal(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/goals/${id}/revise`);
    return response.data;
  },
};
