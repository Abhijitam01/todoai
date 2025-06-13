"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { NavItem } from "./NavItem"
import { navigationItems } from "@/lib/navigation"

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname()

  const handleNavItemClick = (href: string) => {
    console.log(`Navigate to: ${href}`)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-72 border-gray-800 bg-gray-900">
        <div className="flex h-full flex-col">
          {/* Header with logo */}
          <div className="flex items-center p-6 border-b border-gray-800">
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
          <nav className="flex flex-1 flex-col px-4 py-6 overflow-y-auto">
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
                    onClick={() => handleNavItemClick(item.href)}
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
      </SheetContent>
    </Sheet>
  )
} 