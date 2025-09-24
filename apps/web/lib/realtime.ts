import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './store/auth';

export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: string;
}

export interface UserStats {
  totalGoals: number;
  completedGoals: number;
  totalTasks: number;
  completedTasks: number;
  tasksCompletedToday: number;
  timestamp: string;
}

export interface GoalProgressUpdate {
  goalId: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  timestamp: string;
}

export interface TaskUpdate {
  taskId: string;
  title: string;
  status: string;
  priority: string;
  updatedBy: number;
  timestamp: string;
}

export interface PlanAdaptation {
  goalId: string;
  changes: {
    createdIds: string[];
    updatedIds: string[];
    archivedIds: string[];
  };
  timestamp: string;
}

export interface AIInsights {
  productivityScore: number;
  recommendations: string[];
  patterns: any;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
}

export interface AchievementUnlock {
  achievements: Achievement[];
  timestamp: string;
}

class RealtimeService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event handlers
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const token = useAuthStore.getState().accessToken;
    if (!token) {
      console.warn('No auth token available for realtime connection');
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    this.setupEventHandlers();
    this.connect();
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('🔌 Connected to realtime service');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Authenticate with the server
      const token = useAuthStore.getState().accessToken;
      if (token) {
        this.socket?.emit('authenticate', token);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from realtime service');
      this.isConnected = false;
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.handleReconnect();
    });

    // Authentication events
    this.socket.on('authenticated', (userData) => {
      console.log('✅ Authenticated with realtime service:', userData);
    });

    this.socket.on('auth_error', (error) => {
      console.error('❌ Authentication error:', error);
    });

    // User statistics
    this.socket.on('user_stats', (stats: UserStats) => {
      this.emit('user_stats', stats);
    });

    // Goal progress updates
    this.socket.on('goal_progress_updated', (data: GoalProgressUpdate) => {
      this.emit('goal_progress_updated', data);
    });

    // Task updates
    this.socket.on('task_completed', (data: any) => {
      this.emit('task_completed', data);
    });

    this.socket.on('task_updated', (data: TaskUpdate) => {
      this.emit('task_updated', data);
    });

    // Goal updates
    this.socket.on('goal_updated', (data: any) => {
      this.emit('goal_updated', data);
    });

    // Plan adaptation
    this.socket.on('plan_adapted', (data: PlanAdaptation) => {
      this.emit('plan_adapted', data);
    });

    // AI insights
    this.socket.on('ai_insights', (data: AIInsights) => {
      this.emit('ai_insights', data);
    });

    // Achievements
    this.socket.on('achievements_unlocked', (data: AchievementUnlock) => {
      this.emit('achievements_unlocked', data);
    });

    // Notifications
    this.socket.on('notification', (data: any) => {
      this.emit('notification', data);
    });

    // Collaboration events
    this.socket.on('user_joined_goal', (data: any) => {
      this.emit('user_joined_goal', data);
    });

    this.socket.on('user_left_goal', (data: any) => {
      this.emit('user_left_goal', data);
    });

    this.socket.on('user_typing', (data: any) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_stopped_typing', (data: any) => {
      this.emit('user_stopped_typing', data);
    });

    this.socket.on('user_cursor_move', (data: any) => {
      this.emit('user_cursor_move', data);
    });

    this.socket.on('user_selection_change', (data: any) => {
      this.emit('user_selection_change', data);
    });

    this.socket.on('comment_added', (data: any) => {
      this.emit('comment_added', data);
    });

    // System events
    this.socket.on('system_announcement', (data: any) => {
      this.emit('system_announcement', data);
    });

    this.socket.on('deadline_warning', (data: any) => {
      this.emit('deadline_warning', data);
    });

    this.socket.on('streak_update', (data: any) => {
      this.emit('streak_update', data);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.socket && !this.isConnected) {
        this.socket.connect();
      }
    }, delay);
  }

  public connect() {
    if (this.socket && !this.isConnected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Event subscription
  public on(event: string, handler: (data: any) => void) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  public off(event: string, handler: (data: any) => void) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  private emit(event: string, data: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  // Collaboration methods
  public joinGoal(goalId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_goal', goalId);
    }
  }

  public leaveGoal(goalId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_goal', goalId);
    }
  }

  public startTyping(goalId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', goalId);
    }
  }

  public stopTyping(goalId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', goalId);
    }
  }

  public updateCursor(goalId: string, x: number, y: number, element: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('cursor_move', { goalId, x, y, element });
    }
  }

  public updateSelection(goalId: string, selection: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('selection_change', { goalId, selection });
    }
  }

  public addComment(goalId: string, taskId: string | undefined, comment: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('add_comment', { goalId, taskId, comment });
    }
  }

  // Task and goal updates
  public updateTask(taskId: string, updates: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('task_updated', { taskId, updates });
    }
  }

  public updateGoal(goalId: string, updates: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('goal_updated', { goalId, updates });
    }
  }

  public completeTask(taskId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('task_completed', { taskId });
    }
  }

  public updateGoalProgress(goalId: string, progress: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('goal_progress_update', { goalId, progress });
    }
  }

  // Utility methods
  public isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
export default realtimeService;
