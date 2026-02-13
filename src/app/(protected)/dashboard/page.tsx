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
  tags: string[]
  note: string
  favourite: boolean
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
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  /* ==============================
     CREATE BOOKMARK (NEW FIX)
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

    if (error) {
      console.error(error)
      return
    }

    // 🔥 Update current tab instantly
    setBookmarks((prev) => {
      if (prev.find((b) => b.id === data.id)) {
        return prev
      }
      return [data, ...prev]
    })

    // 🔥 Sync other tabs
    localStorage.setItem(
      "bookmark_added",
      JSON.stringify(data)
    )
    setTimeout(() => {
      localStorage.removeItem("bookmark_added")
    }, 300)
  }

  /* ==============================
     STORAGE LISTENER (TAB SYNC)
  ============================== */
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === "bookmark_added" && e.newValue) {
        const newBookmark = JSON.parse(e.newValue)

        setBookmarks((prev) => {
          if (prev.find((b) => b.id === newBookmark.id)) {
            return prev
          }
          return [newBookmark, ...prev]
        })
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => {
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
      list = list.filter((b) =>
        b.tags?.includes(selectedTag)
      )
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
      case "az":
        list.sort((a, b) =>
          a.title.localeCompare(b.title)
        )
        break
      case "za":
        list.sort((a, b) =>
          b.title.localeCompare(a.title)
        )
        break
    }

    return list
  }, [bookmarks, search, activeTab, selectedTag, sortBy])

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
     DELETE
  ============================== */
  async function confirmDelete() {
    if (!deleting) return

    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", deleting.id)

    setBookmarks((prev) =>
      prev.filter((b) => b.id !== deleting.id)
    )

    setDeleting(null)
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
          <h1 className="text-3xl font-semibold">
            Your Bookmarks
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage, filter and organize your saved links.
          </p>
        </div>

        <Button onClick={() => setShowAdd(true)}>
          + Add Bookmark
        </Button>
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
