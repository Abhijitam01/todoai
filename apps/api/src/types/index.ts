import { Request } from 'express';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  preferences: UserPreferences;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  PREMIUM = 'premium',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  timezone: string;
  language: string;
}

// Goal types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority: Priority;
  status: GoalStatus;
  targetDate?: Date;
  completedAt?: Date;
  userId: string;
  tasks: Task[];
  progress: number;
  aiInsights?: AIInsight[];
  createdAt: Date;
  updatedAt: Date;
}

export enum GoalCategory {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
  HEALTH = 'health',
  EDUCATION = 'education',
  FINANCE = 'finance',
  RELATIONSHIPS = 'relationships',
  HOBBIES = 'hobbies',
  OTHER = 'other',
}

export enum GoalStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  goalId?: string;
  userId: string;
  tags: string[];
  dependencies: string[]; // task IDs
  createdAt: Date;
  updatedAt: Date;
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// AI types
export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  content: string;
  confidence: number; // 0-1
  actionable: boolean;
  goalId?: string;
  taskId?: string;
  userId: string;
  createdAt: Date;
}

export enum AIInsightType {
  PROGRESS_ANALYSIS = 'progress_analysis',
  TASK_SUGGESTION = 'task_suggestion',
  DEADLINE_WARNING = 'deadline_warning',
  PRODUCTIVITY_TIP = 'productivity_tip',
  GOAL_RECOMMENDATION = 'goal_recommendation',
}

// API Request/Response types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Goal/Task request types
export interface CreateGoalRequest {
  title: string;
  description?: string;
  category: GoalCategory;
  priority: Priority;
  targetDate?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  category?: GoalCategory;
  priority?: Priority;
  status?: GoalStatus;
  targetDate?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  estimatedDuration?: number;
  goalId?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  tags?: string[];
}

// Filter types
export interface GoalFilters extends PaginationQuery {
  category?: GoalCategory;
  status?: GoalStatus;
  priority?: Priority;
  search?: string;
}

export interface TaskFilters extends PaginationQuery {
  status?: TaskStatus;
  priority?: Priority;
  goalId?: string;
  search?: string;
  dueDate?: string;
  overdue?: boolean;
} 