"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { MobileNavDrawer } from "./MobileNavDrawer"
import { Topbar } from "./Topbar"
import { ToastProvider } from "@/components/ui/toast"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
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
    </ToastProvider>
  )
} 