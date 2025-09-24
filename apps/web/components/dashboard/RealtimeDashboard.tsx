'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useGoals } from '../../lib/hooks/useGoals';
import { useTodayTasks } from '../../lib/hooks/useTasks';
import { realtimeService, UserStats, AIInsights, Achievement } from '../../lib/realtime';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Brain, 
  Trophy,
  Zap,
  Users,
  MessageSquare,
  Activity
} from 'lucide-react';

interface RealtimeDashboardProps {
  className?: string;
}

export function RealtimeDashboard({ className }: RealtimeDashboardProps) {
  const { goals, loading: goalsLoading } = useGoals({ includeStats: true });
  const { tasks, loading: tasksLoading } = useTodayTasks();
  
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Real-time event handlers
  useEffect(() => {
    const handleUserStats = (stats: UserStats) => {
      setUserStats(stats);
    };

    const handleAIInsights = (insights: AIInsights) => {
      setAIInsights(insights);
    };

    const handleAchievements = (data: { achievements: Achievement[] }) => {
      setAchievements(prev => [...prev, ...data.achievements]);
    };

    const handleNotification = (notification: any) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    };

    const handleConnectionChange = () => {
      setIsConnected(realtimeService.isSocketConnected());
    };

    // Subscribe to real-time events
    realtimeService.on('user_stats', handleUserStats);
    realtimeService.on('ai_insights', handleAIInsights);
    realtimeService.on('achievements_unlocked', handleAchievements);
    realtimeService.on('notification', handleNotification);

    // Check connection status
    handleConnectionChange();
    const interval = setInterval(handleConnectionChange, 1000);

    return () => {
      realtimeService.off('user_stats', handleUserStats);
      realtimeService.off('ai_insights', handleAIInsights);
      realtimeService.off('achievements_unlocked', handleAchievements);
      realtimeService.off('notification', handleNotification);
      clearInterval(interval);
    };
  }, []);

  const completedTasksToday = tasks.filter(task => task.status === 'completed').length;
  const totalTasksToday = tasks.length;
  const progressToday = totalTasksToday > 0 ? (completedTasksToday / totalTasksToday) * 100 : 0;

  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time Dashboard</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasksToday}/{totalTasksToday}</div>
            <Progress value={progressToday} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progressToday)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals}</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aiInsights ? `${aiInsights.productivityScore}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Productivity Score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">
              Recently unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>
                  {completedTasksToday} of {totalTasksToday} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' : 
                          task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        <span className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      <Badge variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Active Goals
                </CardTitle>
                <CardDescription>
                  {activeGoals} goals in progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {goals.filter(goal => goal.status === 'active').slice(0, 3).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      {goal.taskStats && (
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{goal.taskStats.completed}/{goal.taskStats.total} tasks</span>
                          <span>{goal.category}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {aiInsights ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Productivity Score</span>
                  <div className="flex items-center gap-2">
                    <Progress value={aiInsights.productivityScore} className="w-24" />
                    <span className="text-sm font-medium">{aiInsights.productivityScore}%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {aiInsights.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">AI insights will appear here as you use the app</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <Badge variant="outline" className="mt-1">
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Complete tasks to unlock achievements!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Real-time updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
