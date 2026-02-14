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
  setSortBy: (v: string) => void
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
    <div className="w-full flex flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:items-end lg:justify-between rounded-2xl border bg-background/60 backdrop-blur-xl p-4 sm:p-5 shadow-sm">

      {/* ================= SEARCH ================= */}
      <div className="relative w-full sm:w-full md:w-full lg:w-80 xl:w-96">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ================= SORT ================= */}
      <div className="w-full sm:w-full md:w-full lg:w-56">
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

      {/* ================= DATE RANGE ================= */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-auto"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>

      {/* ================= CLEAR ================= */}
      <Button
        variant="outline"
        onClick={onClear}
        className="w-full sm:w-auto"
      >
        Clear
      </Button>

    </div>
  )
}
