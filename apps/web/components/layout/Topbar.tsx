"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

interface TopbarProps {
  onMenuClick: () => void
}

// Page title mapping based on pathname
const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/dashboard":
      return "Today"
    case "/goals":
      return "My Goals"
    case "/create-goal":
      return "Create Goal"
    case "/settings":
      return "Settings"
    default:
      return "TodoAI"
  }
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <motion.header 
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 px-4 sm:gap-x-6 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left side - Mobile menu button and logo */}
      <div className="flex items-center gap-x-4">
        {/* Mobile menu button */}
        <Button
          variant="outline"
          size="sm"
          className="md:hidden border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open sidebar</span>
        </Button>

        {/* App logo/name for mobile */}
        <div className="md:hidden flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-lg font-bold text-white">TodoAI</span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-6 md:hidden bg-gray-700" />

      {/* Page title - hidden on mobile */}
      <div className="hidden md:flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center">
          <motion.h1 
            className="text-xl font-semibold text-white"
            key={pageTitle}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {pageTitle}
          </motion.h1>
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <ThemeToggle />
        <Separator orientation="vertical" className="h-6 bg-gray-700" />
        {/* User avatar */}
        <div className="flex items-center gap-x-3">
          {/* TODO: Replace with real user data */}
          <div className="hidden sm:flex sm:flex-col sm:items-end sm:leading-none">
            <div className="text-sm font-medium text-white">John Doe</div>
            <div className="text-xs text-gray-400">john@example.com</div>
          </div>
          <Avatar className="h-8 w-8 border border-gray-700">
            <AvatarFallback className="bg-gray-800 text-gray-300 text-sm">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.header>
  )
} 