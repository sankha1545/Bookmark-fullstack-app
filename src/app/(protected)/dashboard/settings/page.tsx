"use client"

import { useEffect, useMemo, useState } from "react"
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
  tags?: string[]
  note?: string
  favourite?: boolean
  created_at: string
}

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  /* FILTER STATES */
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "favourites">("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<
    "cards" | "list" | "headlines" | "moodboard"
  >("cards")

  /* MODALS */
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState<Bookmark | null>(null)
  const [deleting, setDeleting] = useState<Bookmark | null>(null)

  /* ======================================================
     Helper: safe upsert/remove handlers (dedupe + stable)
     ====================================================== */
  function addOrReplaceBookmark(b: Bookmark) {
    setBookmarks((prev) => {
      // if exists, replace and keep order
      if (prev.find((p) => p.id === b.id)) {
        return prev.map((p) => (p.id === b.id ? b : p))
      }
      // otherwise add to front
      return [b, ...prev]
    })
  }

  function updateBookmark(b: Bookmark) {
    setBookmarks((prev) =>
      prev.map((p) => (p.id === b.id ? { ...p, ...b } : p))
    )
  }

  function removeBookmarkById(id: string) {
    setBookmarks((prev) => prev.filter((p) => p.id !== id))
  }

  /* ==============================
     FETCH BOOKMARKS
  ============================== */
  async function fetchBookmarks() {
    setLoading(true)

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    } else {
      // optional: handle/log error
      console.error("Failed to fetch bookmarks:", error)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  /* ======================================================
     Multi-tab & realtime syncing
     - Supabase realtime (user-scoped)
     - CustomEvent (optimistic local updates)
     - BroadcastChannel + storage fallback
     ====================================================== */
  useEffect(() => {
    let channel: any = null
    const bcSupported = typeof BroadcastChannel !== "undefined"
    const bc = bcSupported ? new BroadcastChannel("bookmarks") : null
    let isSubscribed = true // guard for race conditions

    // handle payload from supabase realtime
    const handleRealtimePayload = (payload: any) => {
      // payload shape from supabase: eventType, new, old
      const eventType = payload.eventType || payload.type || payload.event
      const newRow = payload.new ?? payload.record ?? payload
      const oldRow = payload.old ?? null

      if (!eventType) return

      if (eventType === "INSERT" || eventType === "INSERT:") {
        addOrReplaceBookmark(newRow as Bookmark)
      } else if (eventType === "UPDATE" || eventType === "UPDATE:") {
        updateBookmark(newRow as Bookmark)
      } else if (eventType === "DELETE" || eventType === "DELETE:") {
        const id = (oldRow && oldRow.id) || (payload.old?.id ?? null)
        if (id) removeBookmarkById(id)
      }
    }

    // setup supabase realtime (user-scoped if possible)
    async function setupRealtime() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // If no authenticated user, skip realtime (still keep other fallbacks)
        if (!user) return

        // subscribe to user's bookmarks only
        channel = supabase
          .channel("realtime-bookmarks")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "bookmarks",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (!isSubscribed) return
              try {
                handleRealtimePayload(payload)
              } catch (err) {
                console.error("Realtime payload handling error:", err)
              }
            }
          )
          .subscribe((status) => {
            // optional: you can inspect status for errors
            // console.log("realtime status", status)
          })
      } catch (err) {
        console.error("Failed to set up realtime:", err)
      }
    }

    setupRealtime()

    // CustomEvent: optimistic local updates from AddBookmarkModal (dispatchEvent)
    function handleLocalCustomEvent(e: any) {
      const detail = e?.detail
      if (!detail) return

      // expected shape: the inserted bookmark row (with id)
      addOrReplaceBookmark(detail)
    }
    window.addEventListener("bookmark-added", handleLocalCustomEvent as EventListener)

    // BroadcastChannel fallback
    if (bc) {
      bc.onmessage = (msg) => {
        const data = msg?.data
        if (!data) return

        if (data.type === "BOOKMARK_CREATED" && data.payload) {
          addOrReplaceBookmark(data.payload as Bookmark)
        } else if (data.type === "BOOKMARK_UPDATED" && data.payload) {
          updateBookmark(data.payload as Bookmark)
        } else if (data.type === "BOOKMARK_DELETED" && data.payload?.id) {
          removeBookmarkById(data.payload.id)
        }
      }
    }

    // storage event fallback (cross-tab)
    function handleStorage(e: StorageEvent) {
      if (!e.key) return
      if (e.key === "bookmark_added") {
        try {
          const parsed = JSON.parse(e.newValue || "null")
          if (parsed) addOrReplaceBookmark(parsed as Bookmark)
        } catch (err) {
          // ignore parse errors
        }
      } else if (e.key === "bookmark_updated") {
        try {
          const parsed = JSON.parse(e.newValue || "null")
          if (parsed) updateBookmark(parsed as Bookmark)
        } catch (err) {}
      } else if (e.key === "bookmark_deleted") {
        try {
          const parsed = JSON.parse(e.newValue || "null")
          if (parsed?.id) removeBookmarkById(parsed.id)
        } catch (err) {}
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      isSubscribed = false

      // cleanup supabase channel
      if (channel) {
        try {
          supabase.removeChannel(channel)
        } catch (err) {
          // try a best-effort remove
          console.warn("Failed to remove supabase channel:", err)
        }
      }

      // cleanup broadcast
      if (bc) {
        try {
          bc.close()
        } catch (err) {}
      }

      window.removeEventListener("bookmark-added", handleLocalCustomEvent as EventListener)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  /* ==============================
     EXTRACT UNIQUE TAGS
  ============================== */
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    bookmarks.forEach((b) => {
      b.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [bookmarks])

  /* ==============================
     FILTER + SORT
  ============================== */
  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarks]

    if (activeTab === "favourites") {
      list = list.filter((b) => b.favourite)
    }

    if (selectedTag !== "all") {
      list = list.filter((b) => b.tags?.includes(selectedTag))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.note?.toLowerCase().includes(q) ||
          b.tags?.join(" ").toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        break
      case "az":
        list.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "za":
        list.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return list
  }, [bookmarks, search, activeTab, selectedTag, sortBy])

  /* ==============================
     TOGGLE FAVOURITE
     (we update DB; realtime or storage will sync)
  ============================== */
  async function toggleFavourite(bookmark: Bookmark) {
    try {
      const { error, data } = await supabase
        .from("bookmarks")
        .update({ favourite: !bookmark.favourite })
        .eq("id", bookmark.id)
        .select()
        .single()

      if (error) throw error

      // update optimistically in this tab
      if (data) updateBookmark(data as Bookmark)

      // also broadcast to other tabs (fallback)
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("bookmarks")
          bc.postMessage({ type: "BOOKMARK_UPDATED", payload: data })
          bc.close()
        } else {
          localStorage.setItem("bookmark_updated", JSON.stringify(data))
          // small cleanup to avoid filling storage
          setTimeout(() => localStorage.removeItem("bookmark_updated"), 500)
        }
      } catch (err) {}
    } catch (err) {
      console.error("toggleFavourite error:", err)
    }
  }

  /* ==============================
     DELETE
  ============================== */
  async function confirmDelete() {
    if (!deleting) return

    try {
      const { error, data } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", deleting.id)
        .select()

      if (error) throw error

      // optimistic remove in this tab
      removeBookmarkById(deleting.id)

      // broadcast fallback
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("bookmarks")
          bc.postMessage({ type: "BOOKMARK_DELETED", payload: { id: deleting.id } })
          bc.close()
        } else {
          localStorage.setItem("bookmark_deleted", JSON.stringify({ id: deleting.id }))
          setTimeout(() => localStorage.removeItem("bookmark_deleted"), 500)
        }
      } catch (err) {}

      setDeleting(null)
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  /* ==============================
     CLEAR FILTERS
  ============================== */
  function clearFilters() {
    setSearch("")
    setSelectedTag("all")
    setSortBy("newest")
    setActiveTab("all")
    setViewMode("cards")
  }

  /* ==============================
     UI
  ============================== */
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Your Bookmarks</h1>
          <p className="text-muted-foreground text-sm">
            Manage, filter and organize your saved links.
          </p>
        </div>

        <Button onClick={() => setShowAdd(true)}>+ Add Bookmark</Button>
      </div>

      <div className="bg-card border rounded-2xl p-5 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-3 flex-wrap">
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

          <Select value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="favourites">Favourites</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  #{tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="az">Title A-Z</SelectItem>
              <SelectItem value="za">Title Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

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

      {/* NOTE: AddBookmarkModal no longer needs onSuccess — it should dispatch
          a `bookmark-added` CustomEvent and optionally broadcast to other tabs.
          If your modal still calls onSuccess, it's safe but may cause an extra fetch. */}
      <AddBookmarkModal open={showAdd} onClose={() => setShowAdd(false)} />

      {editing && (
        <EditBookmarkDrawer
          bookmark={editing}
          onClose={() => setEditing(null)}
          // keep onSuccess here for backward compatibility if your drawer still uses it
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
