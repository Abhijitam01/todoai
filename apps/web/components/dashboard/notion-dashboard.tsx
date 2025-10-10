"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Home, 
  Target, 
  CheckSquare, 
  Calendar, 
  Settings, 
  User,
  ChevronRight,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Star,
  Archive
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  dueDate: string;
  tasks: number;
  completedTasks: number;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  goalTitle?: string;
}

export function NotionDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const goals: Goal[] = [
    {
      id: '1',
      title: 'Learn React Development',
      progress: 65,
      status: 'active',
      dueDate: '2024-03-15',
      tasks: 24,
      completedTasks: 16
    },
    {
      id: '2',
      title: 'Complete Data Science Course',
      progress: 30,
      status: 'active',
      dueDate: '2024-04-20',
      tasks: 45,
      completedTasks: 14
    },
    {
      id: '3',
      title: 'Write Technical Blog',
      progress: 100,
      status: 'completed',
      dueDate: '2024-02-28',
      tasks: 12,
      completedTasks: 12
    }
  ];

  const todayTasks: Task[] = [
    {
      id: '1',
      title: 'Complete React hooks tutorial',
      completed: false,
      priority: 'high',
      goalTitle: 'Learn React Development'
    },
    {
      id: '2',
      title: 'Practice data visualization with Python',
      completed: true,
      priority: 'medium',
      goalTitle: 'Complete Data Science Course'
    },
    {
      id: '3',
      title: 'Review machine learning concepts',
      completed: false,
      priority: 'low',
      goalTitle: 'Complete Data Science Course'
    },
    {
      id: '4',
      title: 'Plan next blog post structure',
      completed: false,
      priority: 'medium'
    }
  ];

  const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
        active 
          ? 'bg-gray-100 text-gray-900' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4 mr-3" />
      {!sidebarCollapsed && <span>{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-200 border-r border-gray-200 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="ml-3 text-lg font-semibold text-gray-900">TodoAI</span>
            )}
          </div>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-0"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          <SidebarItem icon={Home} label="Dashboard" active={true} />
          <SidebarItem icon={Target} label="Goals" />
          <SidebarItem icon={CheckSquare} label="Tasks" />
          <SidebarItem icon={Calendar} label="Calendar" />
          <SidebarItem icon={TrendingUp} label="Analytics" />
          
          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              {!sidebarCollapsed && (
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Goals
                </span>
              )}
            </div>
            <div className="space-y-1">
              {goals.slice(0, 3).map((goal) => (
                <button
                  key={goal.id}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    goal.status === 'active' ? 'bg-blue-500' :
                    goal.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="truncate">{goal.title}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
                <div className="text-xs text-gray-500">john@example.com</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back! Here's what you're working on.</p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Goals</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {goals.filter(g => g.status === 'active').length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tasks Today</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {todayTasks.filter(t => !t.completed).length}
                    </p>
                  </div>
                  <CheckSquare className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">78%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <button className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center mr-4 hover:border-gray-400">
                      {task.completed && <CheckSquare className="w-3 h-3 text-green-600" />}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.goalTitle && (
                        <p className="text-xs text-gray-500">{task.goalTitle}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">High</Badge>
                      )}
                      {task.priority === 'medium' && (
                        <Badge variant="secondary" className="text-xs">Medium</Badge>
                      )}
                      {task.priority === 'low' && (
                        <Badge variant="outline" className="text-xs">Low</Badge>
                      )}
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{goal.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <CheckSquare className="w-4 h-4 mr-1" />
                            {goal.completedTasks}/{goal.tasks} tasks
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Due {new Date(goal.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={goal.status === 'active' ? 'default' : 
                                 goal.status === 'completed' ? 'secondary' : 'outline'}
                        >
                          {goal.status}
                        </Badge>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
