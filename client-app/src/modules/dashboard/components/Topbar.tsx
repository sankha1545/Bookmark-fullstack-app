"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search, Menu } from "lucide-react"
import { useState } from "react"
import AddBookmarkModal from "./AddBookmarkModal"

type Props = {
  searchQuery?: string
  setSearchQuery?: (value: string) => void
  onBookmarkAdded?: () => void
  onMenuClick: () => void
}

export default function Topbar({
  searchQuery = "",
  setSearchQuery,
  onBookmarkAdded,
  onMenuClick,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 bg-background border-b px-4 sm:px-6 flex items-center justify-between gap-4">

      {/* LEFT: Mobile Hamburger */}
      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-muted"
        >
          <Menu size={18} />
        </button>

        <span className="font-semibold text-sm sm:text-base">
          Dashboard
        </span>
      </div>

      {/* CENTER: Search (optional) */}
      {setSearchQuery && (
        <div className="hidden md:block relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* RIGHT: Add Button */}
      {onBookmarkAdded && (
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </Button>
      )}

      {onBookmarkAdded && (
        <AddBookmarkModal
          open={open}
          setOpen={setOpen}
          onBookmarkAdded={onBookmarkAdded}
        />
      )}
    </header>
  )
}
