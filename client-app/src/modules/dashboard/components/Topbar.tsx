"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, Menu } from "lucide-react"
import { useState } from "react"
import AddBookmarkModal from "./AddBookmarkModal"



export default function Topbar({}) {
  
  return (
    <header className="h-16 bg-background border-b px-4 sm:px-6 flex items-center justify-between gap-4">

      {/* LEFT: Mobile Hamburger */}
      <div className="flex items-center gap-3">

        <span className="font-semibold text-sm sm:text-base ml-10">
          Dashboard
        </span>
      </div>

  
    </header>
  )
}
