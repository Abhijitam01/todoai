import { 
  LayoutDashboard, 
  Target, 
  Plus, 
  Settings 
} from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface NavigationItem {
  href: string
  label: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/goals",
    label: "My Goals",
    icon: Target,
  },
  {
    href: "/create-goal",
    label: "Create Goal",
    icon: Plus,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
] 