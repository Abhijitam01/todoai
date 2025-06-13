"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Target, 
  Calendar, 
  Zap,
  Settings,
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  const quickActions = [
    {
      label: "Create Goal",
      icon: Target,
      action: () => router.push("/create-goal"),
      color: "text-blue-400"
    },
    {
      label: "Add Task",
      icon: Plus,
      action: () => console.log("Add task"),
      color: "text-green-400"
    },
    {
      label: "Time Block",
      icon: Calendar,
      action: () => console.log("Schedule time block"),
      color: "text-purple-400"
    },
    {
      label: "Quick Win",
      icon: Zap,
      action: () => console.log("Quick 5-min task"),
      color: "text-yellow-400"
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-gray-700 bg-gray-800/50 hover:bg-gray-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Quick Action
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-gray-800 border-gray-700"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <DropdownMenuItem
              onClick={action.action}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 text-gray-200 hover:text-white"
            >
              <action.icon className={`w-4 h-4 ${action.color}`} />
              <span>{action.label}</span>
            </DropdownMenuItem>
          </motion.div>
        ))}
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 text-gray-400 hover:text-gray-200"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 