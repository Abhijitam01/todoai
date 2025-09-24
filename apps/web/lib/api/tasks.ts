import { api } from '../api';

export interface Task {
  id: string;
  userId: string;
  goalId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  dueDate?: string;
  completedAt?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
  dependencies?: string[];
  isRecurring?: boolean;
  recurringPattern?: string;
  parentTaskId?: string;
  order: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  goalId?: string;
  dueDate?: string;
  estimatedMinutes?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  dueDate?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  tags?: string[];
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

// Tasks API functions
export const tasksApi = {
  // Get all tasks with optional filtering
  async getTasks(params?: {
    goalId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TasksResponse> {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Get today's tasks
  async getTodayTasks(): Promise<TasksResponse> {
    const response = await api.get('/tasks/today');
    return response.data;
  },

  // Get a specific task by ID
  async getTask(id: string): Promise<TaskResponse> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Update a task
  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Partial update a task
  async patchTask(id: string, data: Partial<UpdateTaskRequest>): Promise<TaskResponse> {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  // Mark task as completed
  async completeTask(id: string): Promise<TaskResponse> {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  },

  // Delete (archive) a task
  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Mark overdue tasks
  async markOverdueTasks(): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/tasks/mark-overdue');
    return response.data;
  },
};
