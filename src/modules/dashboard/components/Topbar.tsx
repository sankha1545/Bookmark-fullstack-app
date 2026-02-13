"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import AddBookmarkModal from "./AddBookmarModal"

type Props = {
  searchQuery: string
  setSearchQuery: (value: string) => void
  onBookmarkAdded: () => void
}

export default function Topbar({
  searchQuery,
  setSearchQuery,
  onBookmarkAdded,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-16 bg-white border-b px-6 flex items-center justify-between gap-6">

      {/* SEARCH */}
      <div className="relative w-full max-w-md">
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

      {/* ADD BUTTON */}
      <Button onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-2" />
        New Bookmark
      </Button>

      <AddBookmarkModal
        open={open}
        setOpen={setOpen}
        onBookmarkAdded={onBookmarkAdded}
      />
    </div>
  )
}
