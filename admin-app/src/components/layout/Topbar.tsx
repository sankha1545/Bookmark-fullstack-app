"use client"

import { Bell } from "lucide-react"

export default function Topbar() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      <div className="flex items-center gap-6">
        <Bell size={18} className="text-neutral-600" />
        <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center text-sm">
          A
        </div>
      </div>
    </div>
  )
}
