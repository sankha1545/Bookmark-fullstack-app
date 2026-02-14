"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import clsx from "clsx"

type NavItemType = {
  label: string
  href: string
  icon: React.ComponentType<any>
  badge?: number
}

const NAV: NavItemType[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Users", href: "/users", icon: Users },
  { label: "Contacts", href: "/contacts", icon: Mail, badge: 3 },
]

export default function Sidebar() {
  const pathname = usePathname() || "/"
  const [isCollapsed, setIsCollapsed] = useState(false)

  function NavItem({ item }: { item: NavItemType }) {
    const Icon = item.icon
    const active = pathname.startsWith(item.href)

    return (
      <Link
        href={item.href}
        className={clsx(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200",
          isCollapsed ? "justify-center" : "justify-start",
          active
            ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className={clsx("w-5 h-5 flex-none", active && "text-primary")} />

        {!isCollapsed && (
          <span className="flex-1 text-sm font-medium truncate">
            {item.label}
          </span>
        )}

        {!isCollapsed && item.badge && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={clsx(
        "flex flex-col h-full bg-background/60 backdrop-blur-xl shadow-sm transition-all duration-300"
      )}
      style={{ width: isCollapsed ? 72 : 288 }}
    >
      <div className="flex flex-col h-full p-4">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm bg-gradient-to-br from-primary to-indigo-500 text-white shadow-md">
              SB
            </div>

            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  Smart Bookmark
                </h1>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            )}
          </div>

          <button
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1 rounded-md hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto space-y-1 px-1">
          {NAV.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t">
          <div className={clsx("flex items-center gap-3", isCollapsed && "justify-center")}>
            <div className="rounded-full w-10 h-10 flex items-center justify-center bg-primary/10 text-primary font-semibold">
              A
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-muted-foreground truncate">
                  Master Account
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </aside>
  )
}
