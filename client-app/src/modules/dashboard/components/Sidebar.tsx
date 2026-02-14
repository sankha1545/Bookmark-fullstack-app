"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import ConfirmLogoutModal from "./ConfirmLogoutModal"

export default function Sidebar({ user }: any) {
  const pathname = usePathname()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function confirmLogout() {
    await fetch("/api/logout", { method: "POST" })
    window.location.replace("/login")
  }

  /* =============================
     Prevent body scroll when open
  ============================= */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  function navItem(href: string, label: string, Icon: any) {
    const active = pathname === href

    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
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
      {/* MOBILE TOP BAR BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-background border rounded-lg p-2 shadow-sm"
      >
        <Menu size={18} />
      </button>

      {/* BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          h-dvh lg:h-auto
          w-64
          bg-background
          border-r
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          z-50
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* CLOSE BUTTON (Mobile Only) */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

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
