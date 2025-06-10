// API Configuration and Utilities
// Following frontend.md recommendations for API integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  clearAuthToken() {
    this.token = null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      if (isJson) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Fallback to status text if JSON parsing fails
        }
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        code: response.status.toString()
      };

      throw error;
    }

    if (isJson) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Convenience functions for common operations
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    signup: (userData: { email: string; password: string; name: string }) =>
      apiClient.post('/auth/signup', userData),
    logout: () => apiClient.post('/auth/logout'),
    refreshToken: () => apiClient.post('/auth/refresh'),
  },

  // Goals
  goals: {
    getAll: () => apiClient.get('/goals'),
    getById: (id: string) => apiClient.get(`/goals/${id}`),
    create: (goalData: any) => apiClient.post('/goals', goalData),
    update: (id: string, updates: any) => apiClient.patch(`/goals/${id}`, updates),
    delete: (id: string) => apiClient.delete(`/goals/${id}`),
    generatePlan: (goalDetails: any) => apiClient.post('/goals/generate-plan', goalDetails),
    updatePlan: (id: string) => apiClient.put(`/goals/${id}/update-plan`),
    getProgress: (id: string) => apiClient.get(`/goals/${id}/progress`),
  },

  // Tasks
  tasks: {
    getToday: () => apiClient.get('/tasks/today'),
    getByGoal: (goalId: string) => apiClient.get(`/tasks/goal/${goalId}`),
    updateStatus: (id: string, status: string) => 
      apiClient.patch(`/tasks/${id}`, { status }),
    reschedule: (id: string, newDate: string) =>
      apiClient.patch(`/tasks/${id}`, { dueDate: newDate }),
    markComplete: (id: string) =>
      apiClient.patch(`/tasks/${id}`, { status: 'COMPLETED' }),
  },

  // Calendar Integration
  calendar: {
    sync: () => apiClient.post('/calendar/sync'),
    connect: (provider: string, token: string) =>
      apiClient.post('/calendar/connect', { provider, token }),
    disconnect: (provider: string) =>
      apiClient.delete(`/calendar/disconnect/${provider}`),
  },
};

// Error handling utilities
export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string' && typeof error.status === 'number';
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// HTTP status code helpers
export const isUnauthorized = (error: unknown): boolean => {
  return isApiError(error) && error.status === 401;
};

export const isForbidden = (error: unknown): boolean => {
  return isApiError(error) && error.status === 403;
};

export const isNotFound = (error: unknown): boolean => {
  return isApiError(error) && error.status === 404;
};

export const isServerError = (error: unknown): boolean => {
  return isApiError(error) && error.status >= 500;
};

// Request retry utility
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx), only server errors (5xx) or network issues
      if (isApiError(error) && error.status < 500) {
        throw error;
      }

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}

export default api; 