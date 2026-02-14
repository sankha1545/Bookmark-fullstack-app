"use client"

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { ExternalLink } from "lucide-react"

import BookmarkFilters from "./BookmarkFilters"
import BookmarkModal from "./BookmarkModal"

interface Props {
  user: any
  bookmarks?: any[]
}

const ITEMS_PER_PAGE = 10

export default function UserProfileClient({
  user,
  bookmarks,
}: Props) {
  const [selectedBookmark, setSelectedBookmark] =
    useState<any | null>(null)

  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [visibleCount, setVisibleCount] =
    useState(ITEMS_PER_PAGE)

  const observerRef = useRef<HTMLDivElement | null>(null)

  const safeBookmarks = Array.isArray(bookmarks)
    ? bookmarks
    : []

  const clearFilters = () => {
    setSearch("")
    setSortBy("newest")
    setStartDate("")
    setEndDate("")
    setVisibleCount(ITEMS_PER_PAGE)
  }

  /* ================= FILTER + SORT ================= */
  const filteredBookmarks = useMemo(() => {
    let data = [...safeBookmarks]

    if (search.trim()) {
      const query = search.toLowerCase()
      data = data.filter(
        (b) =>
          b.title?.toLowerCase().includes(query) ||
          b.url?.toLowerCase().includes(query)
      )
    }

    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)

      data = data.filter(
        (b) =>
          b.created_at &&
          new Date(b.created_at).getTime() >= start.getTime()
      )
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)

      data = data.filter(
        (b) =>
          b.created_at &&
          new Date(b.created_at).getTime() <= end.getTime()
      )
    }

    switch (sortBy) {
      case "oldest":
        data.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        break
      case "az":
        data.sort((a, b) =>
          (a.title ?? "").localeCompare(b.title ?? "")
        )
        break
      case "za":
        data.sort((a, b) =>
          (b.title ?? "").localeCompare(a.title ?? "")
        )
        break
      default:
        data.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
    }

    return data
  }, [safeBookmarks, search, sortBy, startDate, endDate])

  const visibleBookmarks =
    filteredBookmarks.slice(0, visibleCount)

  const loadMore = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredBookmarks.length)
    )
  }, [filteredBookmarks.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [loadMore])

  const totalBookmarks = filteredBookmarks.length

  return (
    <div className="flex flex-col h-full min-h-0 w-full space-y-6 sm:space-y-8">

      {/* ================= PROFILE HEADER ================= */}
      <Card className="border bg-background/70 backdrop-blur-xl shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">

          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 shrink-0">
            <AvatarFallback>
              {user?.display_name
                ? user.display_name[0]
                : user?.email?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <CardTitle className="text-xl sm:text-2xl">
              {user?.display_name ?? "No Profile"}
            </CardTitle>
            <p className="text-muted-foreground break-all text-sm sm:text-base">
              {user?.email ?? "No Email"}
            </p>
          </div>

        </CardHeader>

        <CardContent className="flex flex-wrap gap-3 sm:gap-4 items-center">
          <Badge variant="secondary">
            {totalBookmarks} Filtered Bookmarks
          </Badge>

          {user?.country && (
            <Badge variant="outline">
              {user.country}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* ================= FILTERS ================= */}
      <BookmarkFilters
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="flex justify-start sm:justify-end">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      </div>

      {/* ================= SCROLLABLE BOOKMARK AREA ================= */}
      {/* IMPORTANT: min-h-0 enables proper flex scroll behavior */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 sm:pr-2">

        {visibleBookmarks.length === 0 ? (
          <p className="text-muted-foreground text-sm sm:text-base">
            No bookmarks found.
          </p>
        ) : (
          visibleBookmarks.map((bookmark) => {
            const favicon = bookmark?.url
              ? `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`
              : ""

            return (
              <Card
                key={bookmark.id}
                onClick={() =>
                  setSelectedBookmark(bookmark)
                }
                className="cursor-pointer hover:shadow-md transition border bg-background/60 backdrop-blur-lg"
              >
                <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4">

                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">

                    {favicon && (
                      <img
                        src={favicon}
                        alt="favicon"
                        className="h-5 w-5 sm:h-6 sm:w-6 rounded-sm shrink-0"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {bookmark?.title ?? "Untitled"}
                      </p>

                      <p className="text-xs sm:text-sm text-muted-foreground break-all">
                        {bookmark?.url ?? "No URL"}
                      </p>
                    </div>

                  </div>

                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />

                </CardContent>
              </Card>
            )
          })
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={observerRef} className="h-10" />

      </div>

      {/* ================= MODAL ================= */}
      <BookmarkModal
        bookmark={selectedBookmark}
        onClose={() =>
          setSelectedBookmark(null)
        }
      />
    </div>
  )
}
