"use client";

import React, { useState, useEffect } from "react";
import { NotionIntegratedSidebar } from "../layout/notion-integrated-sidebar";
import { NotionEditor } from "../editor/notion-editor";
import { IntegratedNotionDatabase } from "../database/integrated-notion-database";
import { IntegratedAIAssistant } from "../ai/integrated-ai-assistant";
import { FeatureNavigator } from "../navigation/feature-navigator";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";
import { Task, Goal } from "@/lib/api";
import { 
  Search, 
  Command, 
  Plus, 
  Settings, 
  HelpCircle,
  Moon,
  Sun,
  User,
  Bell,
  Target,
  CheckSquare,
  Calendar,
  TrendingUp,
  Clock,
  Star
} from "lucide-react";
import { NotionButton, NotionCard, NotionProgress, NotionBadge } from "../ui/notion-components";

interface NotionIntegratedWorkspaceProps {
  initialPage?: string;
}

export function NotionIntegratedWorkspace({ initialPage = "dashboard" }: NotionIntegratedWorkspaceProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAI, setShowAI] = useState(false);

  // Real data hooks
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask, 
    completeTask, 
    deleteTask 
  } = useTasks();

  const { 
    goals, 
    loading: goalsLoading, 
    error: goalsError, 
    createGoal, 
    updateGoal, 
    deleteGoal 
  } = useGoals();

  // Convert real data to Notion database format
  const taskProperties = [
    { id: 'title', name: 'Task', type: 'title' as const },
    { id: 'status', name: 'Status', type: 'select' as const, options: ['pending', 'in_progress', 'completed', 'cancelled'] },
    { id: 'priority', name: 'Priority', type: 'select' as const, options: ['low', 'medium', 'high', 'urgent'] },
    { id: 'dueDate', name: 'Due Date', type: 'date' as const },
    { id: 'goal', name: 'Goal', type: 'select' as const, options: goals.map(g => g.title) },
    { id: 'estimatedMinutes', name: 'Est. Time', type: 'number' as const }
  ];

  const goalProperties = [
    { id: 'title', name: 'Goal', type: 'title' as const },
    { id: 'status', name: 'Status', type: 'select' as const, options: ['active', 'completed', 'paused', 'cancelled'] },
    { id: 'priority', name: 'Priority', type: 'select' as const, options: ['low', 'medium', 'high', 'urgent'] },
    { id: 'category', name: 'Category', type: 'select' as const, options: ['Personal', 'Work', 'Health', 'Learning', 'Finance'] },
    { id: 'targetDate', name: 'Target Date', type: 'date' as const },
    { id: 'progress', name: 'Progress', type: 'number' as const }
  ];

  const convertTasksToRows = (tasks: Task[]) => {
    return tasks.map(task => ({
      id: task.id,
      properties: {
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        goal: goals.find(g => g.id === task.goalId)?.title || 'No Goal',
        estimatedMinutes: task.estimatedMinutes
      },
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
  };

  const convertGoalsToRows = (goals: Goal[]) => {
    return goals.map(goal => ({
      id: goal.id,
      properties: {
        title: goal.title,
        status: goal.status,
        priority: goal.priority,
        category: goal.category || 'Personal',
        targetDate: goal.targetDate,
        progress: goal.progress
      },
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt
    }));
  };

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
          case '\\':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case 'n':
            e.preventDefault();
            // Create new item based on current page
            if (currentPage === 'tasks') {
              // Create new task
            } else if (currentPage === 'goals') {
              // Create new goal
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="p-8">
            <div className="max-w-4xl">
              <h1 className="notion-page-title mb-8">Dashboard</h1>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <NotionCard hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Active Tasks</p>
                      <p className="notion-h2 text-notion-default">
                        {tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-accent rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </NotionCard>
                
                <NotionCard hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Goals</p>
                      <p className="notion-h2 text-notion-default">
                        {goals.filter(g => g.status === 'active').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-accent rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </NotionCard>
                
                <NotionCard hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Completed Today</p>
                      <p className="notion-h2 text-notion-default">
                        {tasks.filter(t => {
                          const today = new Date().toDateString();
                          const completedDate = t.completedAt ? new Date(t.completedAt).toDateString() : null;
                          return completedDate === today;
                        }).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-accent rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </NotionCard>

                <NotionCard hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Overdue</p>
                      <p className="notion-h2 text-notion-default">
                        {tasks.filter(t => {
                          if (!t.dueDate || t.status === 'completed') return false;
                          return new Date(t.dueDate) < new Date();
                        }).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-accent rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </NotionCard>
              </div>

              {/* Recent Tasks */}
              <NotionCard className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="notion-h3">Recent Tasks</h2>
                  <NotionButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentPage('tasks')}
                  >
                    View all
                  </NotionButton>
                </div>
                
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        checked={task.status === 'completed'}
                        onChange={() => {
                          if (task.status === 'completed') {
                            updateTask(task.id, { status: 'pending' });
                          } else {
                            completeTask(task.id);
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className={`notion-body ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <NotionBadge 
                            variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                            size="sm"
                          >
                            {task.priority}
                          </NotionBadge>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {task.estimatedMinutes && (
                          <span className="text-xs text-gray-500">
                            {Math.round(task.estimatedMinutes / 60)}h
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </NotionCard>

              {/* Goals Progress */}
              <NotionCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="notion-h3">Goals Progress</h2>
                  <NotionButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentPage('goals')}
                  >
                    View all
                  </NotionButton>
                </div>
                
                <div className="space-y-4">
                  {goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="notion-h4">{goal.title}</h3>
                        <NotionBadge 
                          variant={goal.status === 'active' ? 'success' : 'default'}
                          size="sm"
                        >
                          {goal.status}
                        </NotionBadge>
                      </div>
                      <NotionProgress 
                        value={goal.progress} 
                        showLabel 
                        label={`${goal.progress}% complete`}
                        variant={goal.progress >= 80 ? 'success' : goal.progress >= 50 ? 'warning' : 'default'}
                      />
                      {goal.targetDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </NotionCard>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="p-8">
            <IntegratedNotionDatabase 
              title="Tasks"
              properties={taskProperties}
              rows={convertTasksToRows(tasks)}
              loading={tasksLoading}
              onRowClick={(row) => {
                // Handle task row click
                console.log('Task clicked:', row);
              }}
              onRowUpdate={(rowId, updates) => {
                // Handle task update
                updateTask(rowId, updates.properties);
              }}
              onRowDelete={(rowId) => {
                // Handle task deletion
                deleteTask(rowId);
              }}
              onCreateNew={() => {
                createTask({
                  title: "New Task",
                  description: "",
                  priority: "medium"
                });
              }}
            />
          </div>
        );
      
      case 'goals':
        return (
          <div className="p-8">
            <IntegratedNotionDatabase 
              title="Goals"
              properties={goalProperties}
              rows={convertGoalsToRows(goals)}
              loading={goalsLoading}
              onRowClick={(row) => {
                // Handle goal row click
                console.log('Goal clicked:', row);
              }}
              onRowUpdate={(rowId, updates) => {
                // Handle goal update
                updateGoal(rowId, updates.properties);
              }}
              onRowDelete={(rowId) => {
                // Handle goal deletion
                deleteGoal(rowId);
              }}
              onCreateNew={() => {
                createGoal({
                  title: "New Goal",
                  description: "",
                  category: "Personal",
                  priority: "medium"
                });
              }}
            />
          </div>
        );
      
      default:
        return (
          <div className="p-8">
            <NotionEditor />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-notion-gray-50">
      {/* Feature Navigator - Fixed positioning to avoid overlap */}
      <div className="fixed top-4 left-4 z-50">
        <FeatureNavigator />
      </div>
      
      {/* Sidebar */}
      <NotionIntegratedSidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-notion-white border-b border-notion px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-notion-gray" />
                <input
                  type="text"
                  placeholder="Search or type a command"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-notion-base placeholder-notion-placeholder min-w-96"
                  onFocus={() => setShowCommandPalette(true)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NotionButton
                onClick={() => setShowAI(true)}
                variant="secondary"
                size="sm"
                icon={<Star className="w-4 h-4" />}
              >
                AI Assistant
              </NotionButton>

              <button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center space-x-2 px-3 py-1 text-notion-sm bg-notion-gray-100 hover:bg-notion-gray-200 rounded-md transition-colors"
              >
                <Command className="w-4 h-4" />
                <span>⌘K</span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-notion-gray hover:bg-notion-gray-100 rounded-md transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button className="p-2 text-notion-gray hover:bg-notion-gray-100 rounded-md transition-colors">
                <Bell className="w-4 h-4" />
              </button>

              <button className="p-2 text-notion-gray hover:bg-notion-gray-100 rounded-md transition-colors">
                <User className="w-4 h-4" />
              </button>

              <button className="p-2 text-notion-gray hover:bg-notion-gray-100 rounded-md transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderCurrentPage()}
        </div>
      </div>

      {/* AI Assistant */}
      <IntegratedAIAssistant
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        context="task and goal management"
        onAction={(action, data) => {
          console.log('AI Action:', action, data);
          switch (action) {
            case 'create-tasks':
              // Create tasks from AI suggestion
              if (data.tasks) {
                data.tasks.forEach((task: any) => {
                  createTask({
                    title: task.title,
                    description: task.description || '',
                    priority: task.priority || 'medium',
                    dueDate: task.dueDate
                  });
                });
              }
              break;
            case 'create-goals':
              // Create goals from AI suggestion
              if (data.goals) {
                data.goals.forEach((goal: any) => {
                  createGoal({
                    title: goal.title,
                    description: goal.description || '',
                    category: goal.category || 'Personal',
                    priority: goal.priority || 'medium',
                    targetDate: goal.targetDate
                  });
                });
              }
              break;
            case 'schedule':
              // Schedule tasks
              break;
          }
        }}
      />

      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50">
          <div className="bg-notion-white border border-notion rounded-lg shadow-notion-lg w-full max-w-2xl mx-4">
            <div className="p-4 border-b border-notion">
              <div className="flex items-center space-x-3">
                <Command className="w-5 h-5 text-notion-gray" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-notion-base"
                  autoFocus
                />
                <button
                  onClick={() => setShowCommandPalette(false)}
                  className="text-notion-gray hover:bg-notion-gray-100 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-2">
              <div className="space-y-1">
                <div className="px-3 py-2 text-notion-xs text-notion-gray uppercase tracking-wide">
                  Quick Actions
                </div>
                <button 
                  onClick={() => {
                    setCurrentPage('tasks');
                    setShowCommandPalette(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-notion-gray-100 rounded-md"
                >
                  <CheckSquare className="w-4 h-4 text-notion-gray" />
                  <div>
                    <div className="notion-body">Go to Tasks</div>
                    <div className="notion-caption">View and manage your tasks</div>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('goals');
                    setShowCommandPalette(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-notion-gray-100 rounded-md"
                >
                  <Target className="w-4 h-4 text-notion-gray" />
                  <div>
                    <div className="notion-body">Go to Goals</div>
                    <div className="notion-caption">View and manage your goals</div>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setShowAI(true);
                    setShowCommandPalette(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-notion-gray-100 rounded-md"
                >
                  <Star className="w-4 h-4 text-notion-gray" />
                  <div>
                    <div className="notion-body">Open AI Assistant</div>
                    <div className="notion-caption">Get help with planning and tasks</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
