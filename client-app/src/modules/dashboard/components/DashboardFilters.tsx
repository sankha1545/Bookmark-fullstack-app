"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal } from "lucide-react"

type Props = {
  tags: string[]
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  sort: string
  setSort: (value: string) => void
}

export default function DashboardFilters({
  tags,
  selectedTags,
  setSelectedTags,
  sort,
  setSort,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2" size={16} />
          Filters
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
          Sort
        </div>

        <DropdownMenuCheckboxItem
          checked={sort === "newest"}
          onCheckedChange={() => setSort("newest")}
        >
          Newest First
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sort === "oldest"}
          onCheckedChange={() => setSort("oldest")}
        >
          Oldest First
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
          Tags
        </div>

        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag}
            checked={selectedTags.includes(tag)}
            onCheckedChange={() => {
              if (selectedTags.includes(tag)) {
                setSelectedTags(
                  selectedTags.filter((t) => t !== tag)
                )
              } else {
                setSelectedTags([...selectedTags, tag])
              }
            }}
          >
            #{tag}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
