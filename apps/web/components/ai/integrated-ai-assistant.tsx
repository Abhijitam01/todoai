"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Lightbulb, 
  Target, 
  Calendar, 
  CheckSquare, 
  Brain,
  Zap,
  MessageSquare,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Settings,
  Wand2,
  Plus,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { NotionButton, NotionModal, NotionDropdown, NotionDropdownItem, NotionCard } from "../ui/notion-components";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";
import { Task, Goal } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: AIAction[];
  data?: any;
}

interface AIAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface IntegratedAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  onAction?: (action: string, data: any) => void;
}

export function IntegratedAIAssistant({ isOpen, onClose, context, onAction }: IntegratedAIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Real data hooks
  const { tasks, createTask, updateTask, completeTask } = useTasks();
  const { goals, createGoal, updateGoal } = useGoals();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && context) {
      // Auto-suggest based on context and current data
      const activeTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
      const activeGoals = goals.filter(g => g.status === 'active');
      const overdueTasks = tasks.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        return new Date(t.dueDate) < new Date();
      });

      const welcomeMessage: AIMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `I can help you with "${context}". Here's what I see in your workspace:

📋 **Active Tasks**: ${activeTasks.length}
🎯 **Active Goals**: ${activeGoals.length}
⚠️ **Overdue Tasks**: ${overdueTasks.length}

What would you like me to help you with?`,
        timestamp: new Date(),
        suggestions: [
          overdueTasks.length > 0 ? "Help me prioritize overdue tasks" : "Break down my current goals into tasks",
          "Create a daily schedule",
          "Analyze my productivity patterns",
          "Suggest improvements to my workflow"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, context, tasks, goals]);

  const quickActions = [
    {
      id: 'breakdown',
      label: 'Break down into tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      prompt: 'Break this down into actionable tasks with deadlines'
    },
    {
      id: 'schedule',
      label: 'Create schedule',
      icon: <Calendar className="w-4 h-4" />,
      prompt: 'Create a realistic timeline and schedule for today'
    },
    {
      id: 'prioritize',
      label: 'Prioritize tasks',
      icon: <Target className="w-4 h-4" />,
      prompt: 'Help me prioritize my current tasks based on importance and urgency'
    },
    {
      id: 'analyze',
      label: 'Analyze progress',
      icon: <TrendingUp className="w-4 h-4" />,
      prompt: 'Analyze my progress and suggest improvements'
    }
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response with real data integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(message),
        timestamp: new Date(),
        suggestions: generateSuggestions(message),
        actions: generateActions(message)
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('overdue') || lowerMessage.includes('urgent')) {
      const overdueTasks = tasks.filter(t => {
        if (!t.dueDate || t.status === 'completed') return false;
        return new Date(t.dueDate) < new Date();
      });

      if (overdueTasks.length === 0) {
        return "Great news! You don't have any overdue tasks. 🎉\n\nYour task management is on track. Would you like me to help you with:\n\n• Planning upcoming tasks\n• Optimizing your workflow\n• Setting new goals";
      }

      return `I found ${overdueTasks.length} overdue tasks that need attention:\n\n${overdueTasks.slice(0, 3).map(task => 
        `• **${task.title}** - Due ${new Date(task.dueDate!).toLocaleDateString()}\n  Priority: ${task.priority}`
      ).join('\n')}\n\n**Recommended Actions:**\n1. Review and reschedule if needed\n2. Break down large tasks into smaller ones\n3. Set realistic deadlines going forward\n\nWould you like me to help you reschedule these tasks or break them down into smaller, manageable pieces?`;
    }
    
    if (lowerMessage.includes('break down') || lowerMessage.includes('tasks')) {
      const activeGoals = goals.filter(g => g.status === 'active');
      
      if (activeGoals.length === 0) {
        return "I don't see any active goals to break down. Would you like me to help you create some goals first?";
      }

      const goal = activeGoals[0];
      return `I'll help you break down **${goal.title}** into actionable tasks:\n\n**Phase 1: Planning & Setup (Week 1)**\n• Research and gather requirements\n• Set up necessary tools and resources\n• Create initial project structure\n\n**Phase 2: Core Development (Weeks 2-4)**\n• Implement main features\n• Regular progress reviews\n• Adjust timeline as needed\n\n**Phase 3: Testing & Refinement (Week 5)**\n• Quality assurance\n• User feedback integration\n• Final adjustments\n\n**Phase 4: Launch & Review (Week 6)**\n• Final testing\n• Launch preparation\n• Post-launch review\n\nWould you like me to create these tasks in your workspace?`;
    }
    
    if (lowerMessage.includes('schedule') || lowerMessage.includes('today')) {
      const todayTasks = tasks.filter(t => {
        if (t.status === 'completed') return false;
        const today = new Date().toDateString();
        const dueDate = t.dueDate ? new Date(t.dueDate).toDateString() : null;
        return dueDate === today || !dueDate;
      });

      const totalEstimatedTime = todayTasks.reduce((sum, task) => sum + (task.estimatedMinutes || 30), 0);
      const hours = Math.floor(totalEstimatedTime / 60);
      const minutes = totalEstimatedTime % 60;

      return `Here's your recommended schedule for today:\n\n**Morning (9:00 AM - 12:00 PM)**\n• Focus on high-priority tasks\n• Complete 2-3 important items\n\n**Afternoon (1:00 PM - 4:00 PM)**\n• Work on medium-priority tasks\n• Handle communications\n\n**Evening (4:00 PM - 5:00 PM)**\n• Review progress\n• Plan tomorrow's priorities\n\n**Today's Tasks:** ${todayTasks.length} items\n**Estimated Time:** ${hours}h ${minutes}m\n\nWould you like me to create a more detailed schedule or adjust the priorities?`;
    }
    
    if (lowerMessage.includes('analyze') || lowerMessage.includes('progress')) {
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
      const activeGoals = goals.filter(g => g.status === 'active');
      const avgGoalProgress = activeGoals.length > 0 ? 
        Math.round(activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length) : 0;

      return `Here's your productivity analysis:\n\n**Task Performance**\n• Total Tasks: ${tasks.length}\n• Completed: ${completedTasks.length}\n• Completion Rate: ${completionRate}%\n\n**Goal Progress**\n• Active Goals: ${activeGoals.length}\n• Average Progress: ${avgGoalProgress}%\n\n**Recommendations:**\n${completionRate < 70 ? '• Focus on completing existing tasks before adding new ones\n' : ''}${avgGoalProgress < 50 ? '• Break down large goals into smaller milestones\n' : ''}• Set daily priorities to maintain momentum\n• Use time-blocking for better focus\n\nWould you like me to help you implement any of these recommendations?`;
    }
    
    return `I understand you're working on "${userMessage}". Based on your current workspace, here are some ways I can help:\n\n🎯 **Goal Management**: I can help you break down goals into actionable tasks\n📋 **Task Planning**: I can create realistic schedules and priorities\n📊 **Progress Analysis**: I can analyze your productivity patterns\n⚡ **Quick Actions**: I can help with overdue tasks and urgent items\n\nWhat specific aspect would you like to focus on?`;
  };

  const generateSuggestions = (userMessage: string): string[] => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('overdue')) {
      return [
        'Create a priority list',
        'Reschedule overdue tasks',
        'Break down large tasks',
        'Set up daily reminders'
      ];
    }
    
    if (lowerMessage.includes('break down')) {
      return [
        'Create subtasks',
        'Add deadlines',
        'Assign priorities',
        'Set up progress tracking'
      ];
    }
    
    if (lowerMessage.includes('schedule')) {
      return [
        'Add time blocks',
        'Set reminders',
        'Optimize task order',
        'Create recurring schedule'
      ];
    }
    
    return [
      'Create follow-up tasks',
      'Set new goals',
      'Review progress',
      'Optimize workflow'
    ];
  };

  const generateActions = (userMessage: string): AIAction[] => {
    return [
      {
        id: 'create-tasks',
        label: 'Create Tasks',
        icon: <CheckSquare className="w-4 h-4" />,
        onClick: () => {
          // Create tasks based on AI suggestions
          onAction?.('create-tasks', { message: userMessage, tasks: tasks });
        }
      },
      {
        id: 'create-goals',
        label: 'Create Goals',
        icon: <Target className="w-4 h-4" />,
        onClick: () => {
          onAction?.('create-goals', { message: userMessage, goals: goals });
        }
      },
      {
        id: 'schedule',
        label: 'Add to Calendar',
        icon: <Calendar className="w-4 h-4" />,
        onClick: () => {
          onAction?.('schedule', { message: userMessage });
        }
      }
    ];
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputValue(action.prompt);
    setSelectedSuggestion(action.id);
  };

  const handleSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) return null;

  return (
    <NotionModal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Assistant"
      size="lg"
      className="max-w-4xl"
    >
      <div className="flex h-[600px]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.type === 'user'
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestion(suggestion)}
                            className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 flex space-x-2">
                      {message.actions.map((action) => (
                        <NotionButton
                          key={action.id}
                          size="sm"
                          variant="ghost"
                          icon={action.icon}
                          onClick={action.onClick}
                        >
                          {action.label}
                        </NotionButton>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Analyzing your workspace...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    "flex items-center space-x-2 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
                    selectedSuggestion === action.id && "border-blue-500 bg-blue-50"
                  )}
                >
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
                placeholder="Ask me anything about your tasks and goals..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <NotionButton
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              >
                Send
              </NotionButton>
            </div>
          </div>
        </div>

        {/* Sidebar with Real Data */}
        <div className="w-64 border-l border-gray-200 p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Your Workspace</h3>
            </div>
            
            {/* Quick Stats */}
            <NotionCard padding="sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Tasks</span>
                  <span className="text-sm font-medium">{tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Goals</span>
                  <span className="text-sm font-medium">{goals.filter(g => g.status === 'active').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <span className="text-sm font-medium text-red-600">
                    {tasks.filter(t => {
                      if (!t.dueDate || t.status === 'completed') return false;
                      return new Date(t.dueDate) < new Date();
                    }).length}
                  </span>
                </div>
              </div>
            </NotionCard>

            {/* AI Features */}
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Smart Suggestions</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Quick Actions</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm">Context Help</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-md">
                <Wand2 className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Auto-Complete</span>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h4>
              <div className="space-y-1">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="text-xs text-gray-600 p-1 hover:bg-gray-50 rounded">
                    {task.status === 'completed' ? '✅' : '📋'} {task.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NotionModal>
  );
}
