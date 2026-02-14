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
    <div className="flex flex-col h-full space-y-8">

      {/* Profile Header */}
      <Card className="border bg-background/70 backdrop-blur-xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback>
              {user?.display_name
                ? user.display_name[0]
                : user?.email?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-2xl">
              {user?.display_name ?? "No Profile"}
            </CardTitle>
            <p className="text-muted-foreground">
              {user?.email ?? "No Email"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex gap-6 flex-wrap items-center">
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

      {/* Filters */}
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

      <div className="flex justify-end">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Scrollable Bookmark Section */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">

        {visibleBookmarks.length === 0 ? (
          <p className="text-muted-foreground">
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
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {favicon && (
                      <img
                        src={favicon}
                        alt="favicon"
                        className="h-6 w-6 rounded-sm"
                      />
                    )}

                    <div>
                      <p className="font-medium">
                        {bookmark?.title ?? "Untitled"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {bookmark?.url ?? "No URL"}
                      </p>
                    </div>
                  </div>

                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            )
          })
        )}

        {/* Observer Trigger */}
        <div ref={observerRef} className="h-10" />
      </div>

      <BookmarkModal
        bookmark={selectedBookmark}
        onClose={() =>
          setSelectedBookmark(null)
        }
      />
    </div>
  )
}
