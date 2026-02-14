"use client"

import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

interface Props {
  search: string
  setSearch: (val: string) => void
  sortBy: string
  setSortBy: (val: string) => void
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
}

export default function BookmarkFilters({
  search,
  setSearch,
  sortBy,
  setSortBy,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-end bg-background/60 backdrop-blur-xl border rounded-xl p-4 shadow-sm">

      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sort */}
      <div className="w-full lg:w-56">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest → Oldest</SelectItem>
            <SelectItem value="oldest">Oldest → Newest</SelectItem>
            <SelectItem value="az">A → Z</SelectItem>
            <SelectItem value="za">Z → A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range */}
      <div className="flex gap-3">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  )
}
