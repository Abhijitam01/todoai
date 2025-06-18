"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNavDrawer } from "./MobileNavDrawer"
import { Topbar } from "./Topbar"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { useAuthStore } from "@/lib/store/auth"
import useTaskStore from "@/lib/stores/taskStore"
import { io, Socket } from "socket.io-client"
import { mutate } from "swr"

interface AppShellProps {
  children: React.ReactNode
}

function InnerAppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useToast()
  const { token } = useAuthStore()
  const setAdaptedTasks = useTaskStore(state => state.setAdaptedTasks)

  useEffect(() => {
    if (!token) return;

    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');

    socket.on('connect', () => {
      console.log('🔗 Connected to real-time server');
      socket.emit('authenticate', token);
    });

    socket.on('authenticated', () => {
      console.log('✅ Authenticated with real-time server');
    });

    socket.on('userNotification', (notification) => {
      if (notification.payload?.goalId) {
        // This is a plan adaptation notification
        toast({
          title: notification.title,
          description: notification.message,
          variant: "default",
        });

        // Update the store with the changed task IDs
        setAdaptedTasks({
          createdIds: notification.payload.createdIds || [],
          updatedIds: notification.payload.updatedIds || [],
        });

        // Trigger a re-fetch of goals and tasks data
        mutate(`/api/v1/goals/${notification.payload.goalId}`);
        mutate('/api/v1/tasks/today');
        mutate('/api/v1/tasks');
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time server');
    });

    socket.on('auth_error', (error) => {
      console.error('Authentication error:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, toast, setAdaptedTasks]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
        <Sidebar />
      </div>

      {/* Mobile navigation drawer */}
      <MobileNavDrawer 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content area */}
      <div className="md:pl-72">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ToastProvider>
      <InnerAppShell>{children}</InnerAppShell>
    </ToastProvider>
  )
} 