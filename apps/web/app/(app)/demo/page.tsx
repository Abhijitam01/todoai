"use client";

import React, { useState } from "react";
import { NotionWorkspace } from "@/components/layout/notion-workspace";
import { NotionAIAssistant } from "@/components/ai/notion-ai-assistant";
import { 
  NotionButton, 
  NotionCard, 
  NotionInput, 
  NotionModal,
  NotionDropdown,
  NotionDropdownItem,
  NotionToggle,
  NotionBadge,
  NotionProgress,
  NotionSpinner,
  NotionTooltip
} from "@/components/ui/notion-components";
import { 
  Sparkles, 
  Star, 
  CheckSquare, 
  Target, 
  Calendar, 
  Database,
  FileText,
  Plus,
  Settings,
  Bell,
  User,
  Search,
  Command,
  Moon,
  Sun,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Share2,
  Copy,
  Edit3,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Lightbulb,
  Brain,
  Zap,
  MessageSquare,
  Wand2,
  Send,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from "lucide-react";

export default function DemoPage() {
  const [showAI, setShowAI] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState('workspace');
  const [toggleValue, setToggleValue] = useState(false);
  const [progress, setProgress] = useState(65);

  const demoPages = [
    {
      id: '1',
      title: 'Project Planning',
      icon: '📋',
      type: 'page' as const,
      isFavorited: true,
      isPublic: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Task Management',
      icon: '✅',
      type: 'database' as const,
      isFavorited: false,
      isPublic: true,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-14'
    },
    {
      id: '3',
      title: 'Goal Setting',
      icon: '🎯',
      type: 'page' as const,
      isFavorited: true,
      isPublic: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-13'
    }
  ];

  const renderComponentDemo = () => (
    <div className="p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="notion-page-title mb-8">TodoAI Notion Demo - All Features</h1>
        
        {/* Component Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Buttons */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Buttons</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <NotionButton>Default Button</NotionButton>
                <NotionButton variant="secondary">Secondary</NotionButton>
                <NotionButton variant="ghost">Ghost</NotionButton>
                <NotionButton variant="text">Text</NotionButton>
                <NotionButton variant="danger">Danger</NotionButton>
              </div>
              <div className="flex flex-wrap gap-3">
                <NotionButton size="sm" icon={<Plus className="w-4 h-4" />}>Small</NotionButton>
                <NotionButton size="md" icon={<Plus className="w-4 h-4" />}>Medium</NotionButton>
                <NotionButton size="lg" icon={<Plus className="w-4 h-4" />}>Large</NotionButton>
              </div>
              <div className="flex flex-wrap gap-3">
                <NotionButton loading>Loading</NotionButton>
                <NotionButton disabled>Disabled</NotionButton>
                <NotionButton fullWidth>Full Width</NotionButton>
              </div>
            </div>
          </NotionCard>

          {/* Inputs */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Inputs</h2>
            <div className="space-y-4">
              <NotionInput 
                placeholder="Enter text..." 
                label="Basic Input"
              />
              <NotionInput 
                placeholder="Search..." 
                icon={<Search className="w-4 h-4" />}
                label="With Icon"
              />
              <NotionInput 
                placeholder="Enter email..." 
                type="email"
                label="Email Input"
                helper="We'll never share your email"
              />
              <NotionInput 
                placeholder="Enter text..." 
                error="This field is required"
                label="Error State"
              />
            </div>
          </NotionCard>

          {/* Cards */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Cards</h2>
            <div className="space-y-4">
              <NotionCard padding="sm">
                <h3 className="notion-h4">Small Padding</h3>
                <p className="notion-body-small">This card has small padding.</p>
              </NotionCard>
              <NotionCard padding="md" hover>
                <h3 className="notion-h4">Medium Padding (Hoverable)</h3>
                <p className="notion-body-small">This card has medium padding and hover effects.</p>
              </NotionCard>
              <NotionCard padding="lg" border={false}>
                <h3 className="notion-h4">Large Padding (No Border)</h3>
                <p className="notion-body-small">This card has large padding and no border.</p>
              </NotionCard>
            </div>
          </NotionCard>

          {/* Dropdowns */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Dropdowns</h2>
            <div className="space-y-4">
              <NotionDropdown
                trigger={
                  <NotionButton variant="secondary">
                    Actions <ChevronDown className="w-4 h-4 ml-1" />
                  </NotionButton>
                }
              >
                <NotionDropdownItem icon={<Edit3 className="w-4 h-4" />}>
                  Edit
                </NotionDropdownItem>
                <NotionDropdownItem icon={<Copy className="w-4 h-4" />}>
                  Duplicate
                </NotionDropdownItem>
                <NotionDropdownItem icon={<Share2 className="w-4 h-4" />}>
                  Share
                </NotionDropdownItem>
                <NotionDropdownItem icon={<Trash2 className="w-4 h-4" />} danger>
                  Delete
                </NotionDropdownItem>
              </NotionDropdown>

              <NotionDropdown
                trigger={
                  <NotionButton variant="ghost" icon={<Settings className="w-4 h-4" />}>
                    Settings
                  </NotionButton>
                }
              >
                <NotionDropdownItem icon={<User className="w-4 h-4" />}>
                  Profile
                </NotionDropdownItem>
                <NotionDropdownItem icon={<Bell className="w-4 h-4" />}>
                  Notifications
                </NotionDropdownItem>
                <NotionDropdownItem icon={<Moon className="w-4 h-4" />}>
                  Theme
                </NotionDropdownItem>
              </NotionDropdown>
            </div>
          </NotionCard>

          {/* Toggles */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Toggles</h2>
            <div className="space-y-4">
              <NotionToggle
                checked={toggleValue}
                onChange={setToggleValue}
                label="Enable notifications"
                description="Receive email notifications for important updates"
              />
              <NotionToggle
                checked={true}
                onChange={() => {}}
                label="Dark mode"
                description="Switch to dark theme"
              />
              <NotionToggle
                checked={false}
                onChange={() => {}}
                label="Auto-save"
                description="Automatically save changes"
                disabled
              />
            </div>
          </NotionCard>

          {/* Badges */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Badges</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <NotionBadge>Default</NotionBadge>
                <NotionBadge variant="secondary">Secondary</NotionBadge>
                <NotionBadge variant="success">Success</NotionBadge>
                <NotionBadge variant="warning">Warning</NotionBadge>
                <NotionBadge variant="error">Error</NotionBadge>
                <NotionBadge variant="info">Info</NotionBadge>
              </div>
              <div className="flex flex-wrap gap-2">
                <NotionBadge size="sm">Small</NotionBadge>
                <NotionBadge size="md">Medium</NotionBadge>
              </div>
              <div className="flex flex-wrap gap-2">
                <NotionBadge removable onRemove={() => {}}>
                  Removable
                </NotionBadge>
                <NotionBadge variant="success" removable onRemove={() => {}}>
                  Success Removable
                </NotionBadge>
              </div>
            </div>
          </NotionCard>

          {/* Progress */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Progress</h2>
            <div className="space-y-4">
              <NotionProgress 
                value={progress} 
                showLabel 
                label="Project Progress"
              />
              <NotionProgress 
                value={30} 
                variant="success" 
                size="sm"
              />
              <NotionProgress 
                value={70} 
                variant="warning" 
                size="lg"
                showLabel 
                label="Task Completion"
              />
              <NotionProgress 
                value={90} 
                variant="error" 
                showLabel 
                label="Overdue Tasks"
              />
            </div>
          </NotionCard>

          {/* Spinners & Tooltips */}
          <NotionCard>
            <h2 className="notion-h3 mb-4">Spinners & Tooltips</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <NotionSpinner size="sm" />
                <NotionSpinner size="md" />
                <NotionSpinner size="lg" />
                <NotionSpinner size="md" variant="primary" />
                <NotionSpinner size="md" variant="white" />
              </div>
              <div className="flex items-center space-x-4">
                <NotionTooltip content="This is a helpful tooltip">
                  <NotionButton variant="ghost">Hover me</NotionButton>
                </NotionTooltip>
                <NotionTooltip content="Tooltip on the right" placement="right">
                  <NotionButton variant="ghost">Right tooltip</NotionButton>
                </NotionTooltip>
                <NotionTooltip content="Tooltip below" placement="bottom">
                  <NotionButton variant="ghost">Bottom tooltip</NotionButton>
                </NotionTooltip>
              </div>
            </div>
          </NotionCard>

        </div>

        {/* Feature Demo */}
        <div className="mt-12">
          <NotionCard>
            <h2 className="notion-h3 mb-4">Feature Demo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="notion-h4 mb-2">AI Assistant</h3>
                <p className="notion-body-small mb-4">Smart task breakdown and planning</p>
                <NotionButton onClick={() => setShowAI(true)} icon={<Brain className="w-4 h-4" />}>
                  Try AI Assistant
                </NotionButton>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <Database className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="notion-h4 mb-2">Database Views</h3>
                <p className="notion-body-small mb-4">Table, board, calendar, gallery</p>
                <NotionButton onClick={() => setCurrentView('workspace')} icon={<Grid3X3 className="w-4 h-4" />}>
                  View Database
                </NotionButton>
              </div>
              
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="notion-h4 mb-2">Page Editor</h3>
                <p className="notion-body-small mb-4">Block-based editing with slash commands</p>
                <NotionButton onClick={() => setCurrentView('workspace')} icon={<Edit3 className="w-4 h-4" />}>
                  Try Editor
                </NotionButton>
              </div>
            </div>
          </NotionCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <NotionCard>
            <h2 className="notion-h3 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <NotionButton 
                onClick={() => setCurrentView('workspace')} 
                icon={<Command className="w-4 h-4" />}
                variant="secondary"
              >
                Open Workspace
              </NotionButton>
              <NotionButton 
                onClick={() => setShowModal(true)} 
                icon={<Plus className="w-4 h-4" />}
                variant="secondary"
              >
                Create New
              </NotionButton>
              <NotionButton 
                onClick={() => setShowAI(true)} 
                icon={<Sparkles className="w-4 h-4" />}
                variant="secondary"
              >
                AI Help
              </NotionButton>
            </div>
          </NotionCard>
        </div>

      </div>

      {/* AI Assistant Modal */}
      <NotionAIAssistant
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        context="project planning and task management"
        onAction={(action, data) => {
          console.log('AI Action:', action, data);
          // Handle AI actions here
        }}
      />

      {/* Demo Modal */}
      <NotionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Item"
        size="md"
      >
        <div className="space-y-4">
          <NotionInput
            label="Title"
            placeholder="Enter title..."
          />
          <NotionInput
            label="Description"
            placeholder="Enter description..."
          />
          <NotionToggle
            checked={true}
            onChange={() => {}}
            label="Make it public"
            description="Allow others to view this item"
          />
          <div className="flex justify-end space-x-3">
            <NotionButton variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </NotionButton>
            <NotionButton onClick={() => setShowModal(false)}>
              Create
            </NotionButton>
          </div>
        </div>
      </NotionModal>
    </div>
  );

  if (currentView === 'workspace') {
    return <NotionWorkspace initialPage="dashboard" />;
  }

  return renderComponentDemo();
}
