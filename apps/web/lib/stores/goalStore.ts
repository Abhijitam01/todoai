import { create } from 'zustand';

// Types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "MISSED" | "PAUSED";
  category: "Programming" | "Design" | "Fitness" | "Business" | "Personal" | "Learning";
  priority: "HIGH" | "MEDIUM" | "LOW";
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedHours?: number;
  actualHours?: number;
  streak?: number;
  lastUpdated: string;
}

export interface Task {
  id: string;
  goalId: string;
  day: number;
  task: string;
  status: "COMPLETED" | "MISSED" | "PENDING";
  description?: string;
  estimatedTime?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  category?: string;
  dueDate: string;
}

interface GoalStore {
  // State
  goals: Goal[];
  currentGoal: Goal | null;
  dailyTasks: Task[];
  planPreview: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Search and filter state
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  sortBy: string;

  // Actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setCurrentGoal: (goal: Goal | null) => void;
  
  // API Actions
  fetchGoals: () => Promise<void>;
  fetchDailyTasks: () => Promise<void>;
  createGoal: (goalData: Partial<Goal>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => Promise<void>;
  generatePlanPreview: (goalDetails: any) => Promise<void>;
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sortBy: string) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Mock API functions (to be replaced with real API calls)
const mockApi = {
  async getGoals(): Promise<Goal[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data (same as in our component)
    return [
      {
        id: "g1",
        title: "Learn Python Programming",
        description: "Master Python from basics to advanced concepts with hands-on projects",
        startDate: "2025-06-01",
        endDate: "2025-09-01",
        progress: 40,
        status: "ACTIVE" as const,
        category: "Programming" as const,
        priority: "HIGH" as const,
        tags: ["coding", "backend", "automation"],
        difficulty: "Medium" as const,
        estimatedHours: 120,
        actualHours: 48,
        streak: 7,
        lastUpdated: "2025-01-15"
      },
      {
        id: "g2",
        title: "Launch Portfolio Website",
        description: "Design and develop a professional portfolio showcasing my work",
        startDate: "2025-05-10",
        endDate: "2025-06-01",
        progress: 100,
        status: "COMPLETED" as const,
        category: "Design" as const,
        priority: "HIGH" as const,
        tags: ["portfolio", "web design", "career"],
        difficulty: "Medium" as const,
        estimatedHours: 60,
        actualHours: 58,
        streak: 15,
        lastUpdated: "2025-01-01"
      },
      {
        id: "g3",
        title: "Master React & Next.js",
        description: "Build modern web applications with React ecosystem",
        startDate: "2025-04-15",
        endDate: "2025-08-15",
        progress: 75,
        status: "ACTIVE" as const,
        category: "Programming" as const,
        priority: "HIGH" as const,
        tags: ["react", "frontend", "javascript"],
        difficulty: "Hard" as const,
        estimatedHours: 150,
        actualHours: 112,
        streak: 12,
        lastUpdated: "2025-01-14"
      },
      {
        id: "g4",
        title: "Build Mobile App",
        description: "Create a cross-platform mobile application using React Native",
        startDate: "2025-03-01",
        endDate: "2025-05-01",
        progress: 25,
        status: "PAUSED" as const,
        category: "Programming" as const,
        priority: "MEDIUM" as const,
        tags: ["mobile", "react native", "app"],
        difficulty: "Hard" as const,
        estimatedHours: 200,
        actualHours: 50,
        streak: 0,
        lastUpdated: "2025-01-10"
      },
      {
        id: "g5",
        title: "Morning Workout Routine",
        description: "Establish a consistent morning exercise habit",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        progress: 85,
        status: "ACTIVE" as const,
        category: "Fitness" as const,
        priority: "MEDIUM" as const,
        tags: ["health", "routine", "wellness"],
        difficulty: "Easy" as const,
        estimatedHours: 365,
        actualHours: 310,
        streak: 21,
        lastUpdated: "2025-01-16"
      },
      {
        id: "g6",
        title: "Start Freelance Business",
        description: "Build a sustainable freelance development business",
        startDate: "2025-02-01",
        endDate: "2025-12-01",
        progress: 30,
        status: "ACTIVE" as const,
        category: "Business" as const,
        priority: "LOW" as const,
        tags: ["entrepreneurship", "freelance", "income"],
        difficulty: "Hard" as const,
        estimatedHours: 500,
        actualHours: 150,
        streak: 5,
        lastUpdated: "2025-01-12"
      }
    ];
  },

  async getDailyTasks(): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: "t1",
        goalId: "g1",
        day: 1,
        task: "Review Python basics and set up development environment",
        status: "PENDING" as const,
        description: "Install Python, VS Code, and configure workspace",
        estimatedTime: "2 hours",
        difficulty: "Easy" as const,
        category: "Setup",
        dueDate: "2025-01-16"
      },
      {
        id: "t2",
        goalId: "g3",
        day: 15,
        task: "Build a React component library",
        status: "PENDING" as const,
        description: "Create reusable components for future projects",
        estimatedTime: "4 hours",
        difficulty: "Medium" as const,
        category: "Development",
        dueDate: "2025-01-16"
      }
    ];
  },

  async createGoal(goalData: Partial<Goal>): Promise<Goal> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newGoal: Goal = {
      id: `g${Date.now()}`,
      title: goalData.title || "New Goal",
      description: goalData.description,
      startDate: goalData.startDate || new Date().toISOString().split('T')[0],
      endDate: goalData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      status: "ACTIVE",
      category: goalData.category || "Personal",
      priority: goalData.priority || "MEDIUM",
      tags: goalData.tags || [],
      difficulty: goalData.difficulty || "Medium",
      estimatedHours: goalData.estimatedHours,
      actualHours: 0,
      streak: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    return newGoal;
  },

  async updateTaskStatus(taskId: string, status: Task["status"]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // In real implementation, this would update the task on the server
  }
};

export const useGoalStore = create<GoalStore>()((set, get) => ({
  // Initial state
  goals: [],
  currentGoal: null,
  dailyTasks: [],
  planPreview: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  statusFilter: "ALL",
  categoryFilter: "ALL",
  sortBy: "lastUpdated",

  // Basic setters
  setGoals: (goals: Goal[]) => set({ goals }),
  addGoal: (goal: Goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id: string, updates: Partial<Goal>) => set((state) => ({
    goals: state.goals.map(goal => goal.id === id ? { ...goal, ...updates } : goal)
  })),
  deleteGoal: (id: string) => set((state) => ({
    goals: state.goals.filter(goal => goal.id !== id)
  })),
  setCurrentGoal: (goal: Goal | null) => set({ currentGoal: goal }),

  // API Actions
  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const goals = await mockApi.getGoals();
      set({ goals, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch goals',
        isLoading: false 
      });
    }
  },

  fetchDailyTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await mockApi.getDailyTasks();
      set({ dailyTasks: tasks, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch daily tasks',
        isLoading: false 
      });
    }
  },

  createGoal: async (goalData: Partial<Goal>) => {
    set({ isLoading: true, error: null });
    try {
      const newGoal = await mockApi.createGoal(goalData);
      set((state) => ({ 
        goals: [...state.goals, newGoal],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create goal',
        isLoading: false 
      });
      throw error;
    }
  },

  updateTaskStatus: async (taskId: string, status: Task["status"]) => {
    // Optimistic update
    set((state) => ({
      dailyTasks: state.dailyTasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      )
    }));

    try {
      await mockApi.updateTaskStatus(taskId, status);
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        dailyTasks: state.dailyTasks.map(task =>
          task.id === taskId ? { ...task, status: status === "COMPLETED" ? "PENDING" : "COMPLETED" } : task
        ),
        error: error instanceof Error ? error.message : 'Failed to update task'
      }));
      throw error;
    }
  },

  generatePlanPreview: async (goalDetails: any) => {
    set({ isLoading: true, error: null, planPreview: null });
    try {
      // Simulate AI plan generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const preview = {
        title: goalDetails.goalName,
        duration: goalDetails.duration,
        totalTasks: 42,
        weeklyMilestones: 6,
        estimatedHours: 90
      };
      set({ planPreview: preview, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to generate plan preview',
        isLoading: false 
      });
      throw error;
    }
  },

  // Filter actions
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setStatusFilter: (status: string) => set({ statusFilter: status }),
  setCategoryFilter: (category: string) => set({ categoryFilter: category }),
  setSortBy: (sortBy: string) => set({ sortBy }),

  // UI actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
})); 