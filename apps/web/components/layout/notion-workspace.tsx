"use client";

import React, { useState, useEffect } from "react";
import { NotionSidebar } from "./notion-sidebar";
import { NotionEditor } from "../editor/notion-editor";
import { NotionDatabase } from "../database/notion-database";
import { FeatureNavigator } from "../navigation/feature-navigator";
import { 
  Search, 
  Command, 
  Plus, 
  Settings, 
  HelpCircle,
  Moon,
  Sun,
  User,
  Bell
} from "lucide-react";

interface NotionWorkspaceProps {
  initialPage?: string;
}

export function NotionWorkspace({ initialPage = "dashboard" }: NotionWorkspaceProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const mockProperties = [
    { id: 'title', name: 'Name', type: 'title' as const },
    { id: 'status', name: 'Status', type: 'select' as const, options: ['To Do', 'In Progress', 'Done'] },
    { id: 'priority', name: 'Priority', type: 'select' as const, options: ['High', 'Medium', 'Low'] },
    { id: 'dueDate', name: 'Due Date', type: 'date' as const },
    { id: 'assignee', name: 'Assignee', type: 'person' as const },
    { id: 'tags', name: 'Tags', type: 'multi_select' as const, options: ['Work', 'Personal', 'Urgent', 'Learning'] }
  ];

  const mockRows = [
    {
      id: '1',
      properties: {
        title: 'Complete React project setup',
        status: 'In Progress',
        priority: 'High',
        dueDate: '2024-01-15',
        assignee: 'John Doe',
        tags: ['Work', 'Urgent']
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10'
    },
    {
      id: '2',
      properties: {
        title: 'Review design system documentation',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2024-01-20',
        assignee: 'Jane Smith',
        tags: ['Learning']
      },
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02'
    },
    {
      id: '3',
      properties: {
        title: 'Update team on project progress',
        status: 'Done',
        priority: 'Low',
        dueDate: '2024-01-12',
        assignee: 'John Doe',
        tags: ['Work']
      },
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12'
    }
  ];

  useEffect(() => {
    // Toggle dark mode on body
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [darkMode]);

  useEffect(() => {
    // Keyboard shortcuts
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
            // Create new page
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="p-8">
            <div className="max-w-4xl">
              <h1 className="notion-page-title mb-8">Dashboard</h1>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-notion-white border border-notion rounded-lg p-6 hover:shadow-notion transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Active Tasks</p>
                      <p className="notion-h2 text-notion-default">12</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-accent rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-notion-white border border-notion rounded-lg p-6 hover:shadow-notion transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Goals</p>
                      <p className="notion-h2 text-notion-default">5</p>
                    </div>
                    <div className="w-12 h-12 bg-green-accent rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-notion-white border border-notion rounded-lg p-6 hover:shadow-notion transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="notion-caption mb-1">Completion Rate</p>
                      <p className="notion-h2 text-notion-default">87%</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-accent rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-notion-white border border-notion rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="notion-h3">Recent Tasks</h2>
                  <button className="text-notion-default hover-notion px-3 py-1 rounded-md transition-colors">
                    View all
                  </button>
                </div>
                
                <div className="space-y-3">
                  {mockRows.slice(0, 3).map((row) => (
                    <div key={row.id} className="flex items-center space-x-3 p-3 rounded-lg hover-notion-light transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        checked={row.properties.status === 'Done'}
                        readOnly
                      />
                      <div className="flex-1">
                        <p className="notion-body">{row.properties.title}</p>
                        <p className="notion-caption">{row.properties.tags.join(', ')}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.properties.status === 'Done' ? 'bg-success text-success' :
                        row.properties.status === 'In Progress' ? 'bg-warning text-warning' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {row.properties.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="p-8">
            <NotionDatabase 
              title="Tasks"
              properties={mockProperties}
              rows={mockRows}
            />
          </div>
        );
      
      case 'goals':
        return (
          <div className="p-8">
            <NotionDatabase 
              title="Goals"
              properties={mockProperties}
              rows={mockRows}
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
      {/* Feature Navigator */}
      <FeatureNavigator />
      
      {/* Sidebar */}
      <NotionSidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-notion-gray-100 rounded-md">
                  <Plus className="w-4 h-4 text-notion-gray" />
                  <div>
                    <div className="notion-body">New page</div>
                    <div className="notion-caption">Create a new page</div>
                  </div>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-notion-gray-100 rounded-md">
                  <span className="text-notion-gray">📊</span>
                  <div>
                    <div className="notion-body">New database</div>
                    <div className="notion-caption">Create a new database</div>
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
