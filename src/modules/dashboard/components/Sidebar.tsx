"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react"
import { useState } from "react"
import ConfirmLogoutModal from "./ConfirmLogoutModal"

export default function Sidebar({ user }: any) {
  const pathname = usePathname()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
async function confirmLogout() {
  await fetch("/api/logout", { method: "POST" })
  window.location.replace("/login")
}


  function navItem(
    href: string,
    label: string,
    Icon: any
  ) {
    const active = pathname === href

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 p-3 rounded-lg transition ${
          active
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted text-muted-foreground"
        }`}
      >
        <Icon size={16} />
        {label}
      </Link>
    )
  }

  return (
    <>
      <aside className="w-64 bg-white border-r flex flex-col justify-between">

        {/* TOP */}
        <div>
          <div className="p-6 font-bold text-lg tracking-tight">
            Smart Bookmark
          </div>

          <nav className="px-4 space-y-2 text-sm">
            {navItem("/dashboard", "All Bookmarks", LayoutDashboard)}
            
            {navItem("/dashboard/settings", "Settings", Settings)}
          </nav>
        </div>

        {/* PROFILE */}
        <div className="p-4 border-t space-y-3">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
              {user.email?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="text-xs text-muted-foreground">
                Signed in as
              </div>
              <div className="font-medium truncate text-sm">
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-sm text-red-500 hover:underline"
          >
            <LogOut size={14} />
            Logout
          </button>

        </div>
      </aside>

    {showLogoutConfirm && (
  <ConfirmLogoutModal
    onCancel={() => setShowLogoutConfirm(false)}
    onConfirm={confirmLogout}
  />
)}

    </>
  )
}
