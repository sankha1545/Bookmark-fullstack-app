"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"

import BookmarkCard from "@/modules/dashboard/components/BookmarkCard"
import BookmarkListView from "@/modules/dashboard/components/BookmarkListView"
import BookmarkHeadlineView from "@/modules/dashboard/components/BookmarkHeadlineView"
import BookmarkMoodboardView from "@/modules/dashboard/components/BookmarkMoodboardView"

import AddBookmarkModal from "@/modules/dashboard/components/AddBookmarModal"
import EditBookmarkDrawer from "@/modules/dashboard/components/EditBookmarkDrawer"
import DeleteConfirmModal from "@/modules/dashboard/components/DeleteBookmarkModal"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

type Bookmark = {
  id: string
  title: string
  url: string
  tags: string[]
  note: string
  favourite: boolean
  created_at: string
}

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "favourites">("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<
    "cards" | "list" | "headlines" | "moodboard"
  >("cards")

  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Bookmark | null>(null)
  const [deleting, setDeleting] = useState<Bookmark | null>(null)

  const channelRef = useRef<BroadcastChannel | null>(null)

  /* ==============================
     BROADCAST CHANNEL SETUP
  ============================== */
  useEffect(() => {
    const channel = new BroadcastChannel("bookmarks")
    channelRef.current = channel

    channel.onmessage = (event) => {
      const { type, payload } = event.data

      if (type === "BOOKMARK_CREATED") {
        setBookmarks((prev) => {
          if (prev.find((b) => b.id === payload.id)) return prev
          return [payload, ...prev]
        })
      }

      if (type === "BOOKMARK_DELETED") {
        setBookmarks((prev) =>
          prev.filter((b) => b.id !== payload.id)
        )
      }
    }

    return () => {
      channel.close()
    }
  }, [])

  /* ==============================
     FETCH BOOKMARKS
  ============================== */
  async function fetchBookmarks() {
    setLoading(true)

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    setBookmarks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  /* ==============================
     CREATE BOOKMARK
  ============================== */
  async function createBookmark(title: string, url: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) return

    setBookmarks((prev) => {
      if (prev.find((b) => b.id === data.id)) return prev
      return [data, ...prev]
    })

    channelRef.current?.postMessage({
      type: "BOOKMARK_CREATED",
      payload: data,
    })
  }

  /* ==============================
     DELETE BOOKMARK
  ============================== */
  async function confirmDelete() {
    if (!deleting) return

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", deleting.id)

    if (error) return

    setBookmarks((prev) =>
      prev.filter((b) => b.id !== deleting.id)
    )

    channelRef.current?.postMessage({
      type: "BOOKMARK_DELETED",
      payload: { id: deleting.id },
    })

    setDeleting(null)
  }

  /* ==============================
     TOGGLE FAVOURITE
  ============================== */
  async function toggleFavourite(bookmark: Bookmark) {
    await supabase
      .from("bookmarks")
      .update({ favourite: !bookmark.favourite })
      .eq("id", bookmark.id)

    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === bookmark.id
          ? { ...b, favourite: !bookmark.favourite }
          : b
      )
    )
  }

  /* ==============================
     FILTER + SORT
  ============================== */
  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarks]

    // Favourite filter
    if (activeTab === "favourites") {
      list = list.filter((b) => b.favourite)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.note?.toLowerCase().includes(q)
      )
    }

    // Sorting
    switch (sortBy) {
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        break
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )
        break
    }

    return list
  }, [bookmarks, search, activeTab, sortBy])

  function clearFilters() {
    setSearch("")
    setActiveTab("all")
    setSortBy("newest")
    setViewMode("cards")
  }

  /* ==============================
     UI
  ============================== */
  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Your Bookmarks
          </h1>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          + Add Bookmark
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-card border rounded-2xl p-5 shadow-sm flex flex-wrap gap-4 items-center justify-between">

        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-3 flex-wrap">

          {/* VIEW MODE */}
          <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cards">Cards</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="headlines">Headlines</SelectItem>
              <SelectItem value="moodboard">Moodboard</SelectItem>
            </SelectContent>
          </Select>

          {/* FAV FILTER */}
          <Select value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="favourites">Favourites</SelectItem>
            </SelectContent>
          </Select>

          {/* SORT FILTER */}
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
              <SelectItem value="newest">Newest-Oldest</SelectItem>
              <SelectItem value="oldest">Oldest-Newest</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>

        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div>Loading bookmarks...</div>
      ) : filteredBookmarks.length === 0 ? (
        <div>No bookmarks found.</div>
      ) : (
        <>
          {viewMode === "cards" && (
            <div className="grid md:grid-cols-3 gap-6">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onEdit={() => setEditing(bookmark)}
                  onDelete={() => setDeleting(bookmark)}
                  onToggleFavourite={() => toggleFavourite(bookmark)}
                />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <BookmarkListView
              bookmarks={filteredBookmarks}
              onToggleFavourite={toggleFavourite}
              onEdit={(b) => setEditing(b)}
              onDelete={(b) => setDeleting(b)}
            />
          )}

          {viewMode === "headlines" && (
            <BookmarkHeadlineView
              bookmarks={filteredBookmarks}
              onEdit={(b) => setEditing(b)}
              onDelete={(b) => setDeleting(b)}
            />
          )}

          {viewMode === "moodboard" && (
            <BookmarkMoodboardView
              bookmarks={filteredBookmarks}
              onEdit={(b) => setEditing(b)}
              onDelete={(b) => setDeleting(b)}
              onToggleFavourite={toggleFavourite}
            />
          )}
        </>
      )}

      <AddBookmarkModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createBookmark}
      />

      {editing && (
        <EditBookmarkDrawer
          bookmark={editing}
          onClose={() => setEditing(null)}
          onSuccess={fetchBookmarks}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          bookmark={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}

    </div>
  )
}
