"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Contacts", href: "/contacts", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-6 text-xl font-bold">Smart Bookmark</div>

      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  active
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Icon size={18} />
                {item.name}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
