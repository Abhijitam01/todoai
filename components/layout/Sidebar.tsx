"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { NavItem } from "./NavItem"
import { navigationItems } from "@/lib/navigation"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-800">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-white">TodoAI</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <motion.ul 
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {navigationItems.map((item, index) => (
            <motion.li 
              key={item.href}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-xs text-gray-400 text-center"
        >
          v1.0.0
        </motion.div>
      </div>
    </div>
  )
} 