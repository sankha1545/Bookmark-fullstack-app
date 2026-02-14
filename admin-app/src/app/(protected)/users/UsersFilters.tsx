"use client"

import { Input } from "@/src/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"
import { Search } from "lucide-react"

interface Props {
  searchQuery: string
  setSearchQuery: (v: string) => void
  sortBy: string
  setSortBy: (v: any) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  onClear: () => void
}

export default function UsersFilters({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-sm">

      {/* SEARCH */}
      <div className="relative w-full lg:w-96">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* SORT */}
      <div className="w-full lg:w-60">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="az">A–Z</SelectItem>
            <SelectItem value="za">Z–A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DATE RANGE */}
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

      {/* CLEAR */}
      <Button
        variant="outline"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  )
}
