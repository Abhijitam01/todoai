'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Target, 
  Calendar, 
  Users, 
  MessageSquare, 
  Brain,
  RefreshCw,
  Archive,
  Edit,
  Trash2
} from 'lucide-react';
import { Goal } from '../../lib/api/goals';
import { useGoals } from '../../lib/hooks/useGoals';
import { realtimeService } from '../../lib/realtime';

interface EnhancedGoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  className?: string;
}

export function EnhancedGoalCard({ goal, onEdit, onDelete, className }: EnhancedGoalCardProps) {
  const { updateGoal, reviseGoal, deleteGoal } = useGoals();
  const [isRevising, setIsRevising] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);

  // Real-time connection status
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(realtimeService.isSocketConnected());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Real-time collaboration events
  useEffect(() => {
    const handleUserJoined = (data: any) => {
      if (data.goalId === goal.id) {
        setCollaborators(prev => [...prev, data.userData]);
      }
    };

    const handleUserLeft = (data: any) => {
      if (data.goalId === goal.id) {
        setCollaborators(prev => prev.filter(user => user.id !== data.userId));
      }
    };

    const handleUserTyping = (data: any) => {
      if (data.goalId === goal.id) {
        setTypingUsers(prev => [...prev.filter(user => user.id !== data.userId), data.userData]);
      }
    };

    const handleUserStoppedTyping = (data: any) => {
      if (data.goalId === goal.id) {
        setTypingUsers(prev => prev.filter(user => user.id !== data.userId));
      }
    };

    realtimeService.on('user_joined_goal', handleUserJoined);
    realtimeService.on('user_left_goal', handleUserLeft);
    realtimeService.on('user_typing', handleUserTyping);
    realtimeService.on('user_stopped_typing', handleUserStoppedTyping);

    // Join the goal room for real-time updates
    realtimeService.joinGoal(goal.id);

    return () => {
      realtimeService.off('user_joined_goal', handleUserJoined);
      realtimeService.off('user_left_goal', handleUserLeft);
      realtimeService.off('user_typing', handleUserTyping);
      realtimeService.off('user_stopped_typing', handleUserStoppedTyping);
      realtimeService.leaveGoal(goal.id);
    };
  }, [goal.id]);

  const handleRevise = async () => {
    setIsRevising(true);
    try {
      const success = await reviseGoal(goal.id);
      if (success) {
        // Show success message
        console.log('Goal revision requested successfully');
      }
    } catch (error) {
      console.error('Failed to revise goal:', error);
    } finally {
      setIsRevising(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateGoal(goal.id, { status: newStatus as any });
    } catch (error) {
      console.error('Failed to update goal status:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        const success = await deleteGoal(goal.id);
        if (success && onDelete) {
          onDelete(goal.id);
        }
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className={`relative ${className}`}>
      {/* Real-time indicators */}
      {isConnected && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{goal.title}</CardTitle>
            {goal.description && (
              <CardDescription className="mt-1">{goal.description}</CardDescription>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(goal)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRevise} disabled={isRevising}>
                <Brain className="h-4 w-4 mr-2" />
                {isRevising ? 'Revising...' : 'Revise with AI'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('paused')}>
                <Archive className="h-4 w-4 mr-2" />
                Pause
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={getPriorityColor(goal.priority)}>
            {goal.priority}
          </Badge>
          <Badge variant="outline" className={getStatusColor(goal.status)}>
            {goal.status}
          </Badge>
          {goal.category && (
            <Badge variant="secondary">{goal.category}</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {/* Task Statistics */}
        {goal.taskStats && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>{goal.taskStats.completed}/{goal.taskStats.total} tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{goal.taskStats.pending} pending</span>
            </div>
          </div>
        )}

        {/* Target Date */}
        {goal.targetDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Real-time Collaboration */}
        {(collaborators.length > 0 || typingUsers.length > 0) && (
          <div className="space-y-2">
            {collaborators.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {collaborators.length} collaborator{collaborators.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {typingUsers.map(user => user.name).join(', ')} typing...
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {goal.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleRevise}
            disabled={isRevising}
          >
            <Brain className="h-4 w-4 mr-2" />
            {isRevising ? 'Revising...' : 'AI Revise'}
          </Button>
          
          {goal.status === 'active' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStatusChange('completed')}
            >
              <Target className="h-4 w-4 mr-2" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
