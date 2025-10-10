"use client";

import React, { useState } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Search, 
  Settings, 
  HelpCircle,
  MessageSquare,
  Calendar,
  Database,
  FileText,
  Star,
  Trash2,
  MoreHorizontal,
  User,
  Bell,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Page {
  id: string;
  title: string;
  icon?: string;
  type: 'page' | 'database';
  children?: Page[];
  isExpanded?: boolean;
  isFavorited?: boolean;
}

interface NotionSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function NotionSidebar({ collapsed = false, onToggleCollapse }: NotionSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set(['workspace']));

  // Mock data structure exactly like Notion
  const workspacePages: Page[] = [
    {
      id: 'workspace',
      title: 'TodoAI Workspace',
      icon: '🏠',
      type: 'page',
      isExpanded: true,
      children: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          icon: '📝',
          type: 'page',
          isFavorited: true
        },
        {
          id: 'goals-database',
          title: 'Goals',
          icon: '🎯',
          type: 'database',
          isFavorited: true,
          children: [
            { id: 'active-goals', title: 'Active Goals', type: 'page' },
            { id: 'completed-goals', title: 'Completed Goals', type: 'page' }
          ]
        },
        {
          id: 'tasks-database',
          title: 'Tasks',
          icon: '✅',
          type: 'database',
          isFavorited: true,
          children: [
            { id: 'today-tasks', title: 'Today', type: 'page' },
            { id: 'this-week', title: 'This Week', type: 'page' },
            { id: 'overdue', title: 'Overdue', type: 'page' }
          ]
        },
        {
          id: 'projects',
          title: 'Projects',
          icon: '📁',
          type: 'page'
        },
        {
          id: 'resources',
          title: 'Resources',
          icon: '📚',
          type: 'page'
        }
      ]
    }
  ];

  const toggleExpanded = (pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const SidebarItem = ({ page, level = 0 }: { page: Page; level?: number }) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const indentLevel = level * 16;

    return (
      <div>
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer group hover:bg-gray-100 transition-colors",
            level === 0 && "font-medium text-gray-900",
            level > 0 && "text-gray-700"
          )}
          style={{ paddingLeft: `${8 + indentLevel}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(page.id)}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          {page.icon && (
            <span className="mr-2 text-sm">{page.icon}</span>
          )}
          
          {!hasChildren && page.type === 'database' && (
            <Database className="w-3 h-3 mr-2 text-gray-500" />
          )}
          
          {!hasChildren && page.type === 'page' && (
            <FileText className="w-3 h-3 mr-2 text-gray-500" />
          )}

          {!collapsed && (
            <>
              <span className="flex-1 truncate">{page.title}</span>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {page.isFavorited && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                <button className="p-0.5 hover:bg-gray-200 rounded">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
            </>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {page.children?.map((child) => (
              <SidebarItem key={child.id} page={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-200",
      collapsed ? "w-12" : "w-64"
    )}>
      {/* Workspace Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <span className="font-semibold text-gray-900">TodoAI</span>
            </div>
          )}
          {collapsed && (
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center mx-auto">
              <span className="text-white text-xs font-bold">T</span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Quick Actions
            </span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Pages */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {!collapsed && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pages
              </span>
              <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100">
                <Plus className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          {workspacePages.map((page) => (
            <SidebarItem key={page.id} page={page} />
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-gray-200">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                John Doe
              </div>
              <div className="text-xs text-gray-500 truncate">
                john@example.com
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Bell className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Help & Settings */}
      {!collapsed && (
        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 flex-1 text-sm text-gray-600">
              <HelpCircle className="w-4 h-4" />
              <span>Help & Support</span>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
