"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Mail, Settings } from "lucide-react"
import clsx from "clsx"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Contacts",
    href: "/contacts",
    icon: Mail,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-72 flex flex-col border-r bg-background/80 backdrop-blur-xl shadow-sm">

      {/* ================= LOGO AREA ================= */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-xl font-semibold tracking-tight">
          Smart Bookmark
        </h1>
      </div>

      {/* ================= NAVIGATION ================= */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* ================= FOOTER / USER ================= */}
      <div className="px-4 py-4 border-t">
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
            A
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-muted-foreground">
              Master Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
