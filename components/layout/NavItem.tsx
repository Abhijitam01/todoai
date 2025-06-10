"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick?: () => void
}

export function NavItem({ href, icon: Icon, label, isActive, onClick }: NavItemProps) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        className={cn(
          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
          isActive 
            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon 
          className={cn(
            "mr-3 h-5 w-5 shrink-0 transition-colors",
            isActive 
              ? "text-red-400" 
              : "text-gray-400 group-hover:text-white"
          )} 
        />
        <span className="truncate">{label}</span>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="ml-auto h-2 w-2 rounded-full bg-red-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>
    </Link>
  )
} 