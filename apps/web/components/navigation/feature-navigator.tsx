"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NotionButton, NotionDropdown, NotionDropdownItem } from "../ui/notion-components";
import { 
  Home, 
  Eye, 
  Sparkles, 
  Database, 
  FileText, 
  Settings, 
  User, 
  Bell,
  Search,
  Command,
  Moon,
  Sun,
  Grid3X3,
  List,
  Filter,
  Plus,
  Target,
  CheckSquare,
  Calendar,
  Brain,
  Zap,
  MessageSquare,
  Wand2
} from "lucide-react";

export function FeatureNavigator() {
  const [darkMode, setDarkMode] = useState(false);

  const features = [
    {
      title: "Main Dashboard",
      href: "/dashboard",
      icon: <Home className="w-4 h-4" />,
      description: "Main workspace with sidebar and navigation"
    },
    {
      title: "Feature Demo",
      href: "/demo",
      icon: <Eye className="w-4 h-4" />,
      description: "Complete showcase of all components and features"
    },
    {
      title: "Tasks View",
      href: "/dashboard?view=tasks",
      icon: <CheckSquare className="w-4 h-4" />,
      description: "View and manage all tasks"
    },
    {
      title: "Goals View",
      href: "/dashboard?view=goals",
      icon: <Target className="w-4 h-4" />,
      description: "View and manage all goals"
    },
    {
      title: "AI Assistant",
      href: "/dashboard?ai=true",
      icon: <Sparkles className="w-4 h-4" />,
      description: "Smart task breakdown and planning assistant"
    }
  ];

  const quickActions = [
    {
      title: "Create Task",
      icon: <CheckSquare className="w-4 h-4" />,
      action: () => console.log("Create task")
    },
    {
      title: "Set Goal",
      icon: <Target className="w-4 h-4" />,
      action: () => console.log("Set goal")
    },
    {
      title: "Schedule Event",
      icon: <Calendar className="w-4 h-4" />,
      action: () => console.log("Schedule event")
    },
    {
      title: "AI Help",
      icon: <Brain className="w-4 h-4" />,
      action: () => console.log("AI help")
    }
  ];

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col space-y-2">
      {/* Main Navigation */}
      <NotionDropdown
        trigger={
          <NotionButton 
            variant="secondary" 
            icon={<Grid3X3 className="w-4 h-4" />}
            className="shadow-lg"
          >
            Features
          </NotionButton>
        }
      >
        {features.map((feature) => (
          <NotionDropdownItem
            key={feature.href}
            icon={feature.icon}
            onClick={() => window.location.href = feature.href}
          >
            <div>
              <div className="font-medium">{feature.title}</div>
              <div className="text-xs text-gray-500">{feature.description}</div>
            </div>
          </NotionDropdownItem>
        ))}
      </NotionDropdown>

      {/* Quick Actions */}
      <NotionDropdown
        trigger={
          <NotionButton 
            variant="ghost" 
            icon={<Plus className="w-4 h-4" />}
            className="shadow-lg"
          >
            Quick
          </NotionButton>
        }
      >
        {quickActions.map((action) => (
          <NotionDropdownItem
            key={action.title}
            icon={action.icon}
            onClick={action.action}
          >
            {action.title}
          </NotionDropdownItem>
        ))}
      </NotionDropdown>

      {/* Theme Toggle */}
      <NotionButton
        variant="ghost"
        icon={darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        onClick={() => setDarkMode(!darkMode)}
        className="shadow-lg"
      />

      {/* Help */}
      <NotionButton
        variant="ghost"
        icon={<MessageSquare className="w-4 h-4" />}
        onClick={() => window.open('/demo', '_blank')}
        className="shadow-lg"
      />
    </div>
  );
}
