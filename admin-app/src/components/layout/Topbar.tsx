"use client"

import React from "react"
import { Bell, Menu } from "lucide-react"

export default function Topbar({
  onMenuClick,
  title = "Admin Dashboard",
}: {
  onMenuClick: () => void
  title?: string
}) {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">

        {/* Hamburger - visible only on mobile */}
        <button
          aria-label="Open menu"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-muted transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <Bell size={18} className="text-neutral-600" />
        <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </div>
  )
}
