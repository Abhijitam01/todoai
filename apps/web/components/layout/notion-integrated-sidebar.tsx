"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Search, 
  Star, 
  Home, 
  Target, 
  CheckSquare, 
  Calendar, 
  Database,
  FileText,
  Settings,
  User,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";
import { useTasks } from "@/lib/hooks/useTasks";
import { useGoals } from "@/lib/hooks/useGoals";
import { NotionButton, NotionDropdown, NotionDropdownItem } from "../ui/notion-components";
import { cn } from "@/lib/utils";

interface NotionIntegratedSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function NotionIntegratedSidebar({ 
  collapsed, 
  onToggleCollapse, 
  currentPage, 
  onPageChange 
}: NotionIntegratedSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['workspace']));

  // Real data hooks
  const { tasks, createTask } = useTasks();
  const { goals, createGoal } = useGoals();

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const quickStats = {
    activeTasks: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length,
    activeGoals: goals.filter(g => g.status === 'active').length,
    overdueTasks: tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      section: 'workspace'
    },
    {
      id: 'tasks',
      title: 'Tasks',
      icon: <CheckSquare className="w-4 h-4" />,
      section: 'workspace',
      count: quickStats.activeTasks
    },
    {
      id: 'goals',
      title: 'Goals',
      icon: <Target className="w-4 h-4" />,
      section: 'workspace',
      count: quickStats.activeGoals
    },
    {
      id: 'calendar',
      title: 'Calendar',
      icon: <Calendar className="w-4 h-4" />,
      section: 'workspace'
    },
    {
      id: 'databases',
      title: 'Databases',
      icon: <Database className="w-4 h-4" />,
      section: 'workspace'
    }
  ];

  const renderSidebarItem = (item: typeof sidebarItems[0]) => {
    const isActive = currentPage === item.id;
    const isFavorite = favorites.includes(item.id);

    return (
      <button
        key={item.id}
        onClick={() => onPageChange(item.id)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group",
          isActive 
            ? "bg-blue-100 text-blue-900" 
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <span className="flex-shrink-0">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="truncate">{item.title}</span>
              {item.count !== undefined && (
                <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full ml-auto">
                  {item.count}
                </span>
              )}
            </>
          )}
        </div>
        
        {!collapsed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
          >
            <Star className={cn(
              "w-3 h-3",
              isFavorite ? "text-yellow-500 fill-current" : "text-gray-400"
            )} />
          </button>
        )}
      </button>
    );
  };

  const renderSection = (sectionId: string, title: string, items: typeof sidebarItems) => {
    const isExpanded = expandedSections.has(sectionId);
    const sectionItems = items.filter(item => item.section === sectionId);

    return (
      <div key={sectionId} className="mb-4">
        {!collapsed && (
          <button
            onClick={() => toggleSection(sectionId)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide hover:bg-gray-50 rounded-md transition-colors"
          >
            <span>{title}</span>
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        
        {isExpanded && (
          <div className="space-y-1 mt-1">
            {sectionItems.map(renderSidebarItem)}
          </div>
        )}
      </div>
    );
  };

  if (collapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2 space-y-1">
          {sidebarItems.slice(0, 6).map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center justify-center p-3 rounded-md transition-colors",
                currentPage === item.id 
                  ? "bg-blue-100 text-blue-900" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title={item.title}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">TodoAI</h1>
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded-md">
            <div className="text-lg font-semibold text-blue-600">{quickStats.activeTasks}</div>
            <div className="text-xs text-blue-600">Tasks</div>
          </div>
          <div className="p-2 bg-green-50 rounded-md">
            <div className="text-lg font-semibold text-green-600">{quickStats.activeGoals}</div>
            <div className="text-xs text-green-600">Goals</div>
          </div>
          <div className="p-2 bg-red-50 rounded-md">
            <div className="text-lg font-semibold text-red-600">{quickStats.overdueTasks}</div>
            <div className="text-xs text-red-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <NotionButton
                size="sm"
                variant="secondary"
                icon={<Plus className="w-3 h-3" />}
                className="flex-1"
                onClick={() => createTask({ title: "New Task", description: "" })}
              >
                Task
              </NotionButton>
              <NotionButton
                size="sm"
                variant="secondary"
                icon={<Plus className="w-3 h-3" />}
                className="flex-1"
                onClick={() => createGoal({ title: "New Goal", description: "" })}
              >
                Goal
              </NotionButton>
            </div>
          </div>

          {/* Workspace Section */}
          {renderSection('workspace', 'Workspace', sidebarItems)}

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Favorites
              </div>
              <div className="space-y-1 mt-1">
                {favorites.map(favId => {
                  const item = sidebarItems.find(i => i.id === favId);
                  return item ? renderSidebarItem(item) : null;
                })}
              </div>
            </div>
          )}

          {/* Recent Section */}
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Recent
            </div>
            <div className="space-y-1 mt-1">
              {tasks.slice(0, 3).map((task) => (
                <button
                  key={task.id}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <CheckSquare className="w-3 h-3 text-gray-400" />
                  <span className="truncate">{task.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <Bell className="w-4 h-4" />
            <span className="text-sm">Notifications</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">User</div>
            <div className="text-xs text-gray-500">user@example.com</div>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
