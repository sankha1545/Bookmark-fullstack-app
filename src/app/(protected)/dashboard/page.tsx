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
  useEffect(() => {
    fetchBookmarks()
  }, [])

  async function fetchBookmarks() {
    setLoading(true)

    const { data } = await supabase
      .from("bookmarks")
      .select("*")

    setBookmarks(data || [])
    setLoading(false)
  }

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

    /* FAV TAB */
    if (activeTab === "favourites") {
      list = list.filter((b) => b.favourite)
    }

    /* TAG FILTER */
    if (selectedTag !== "all") {
      list = list.filter((b) =>
        b.tags?.includes(selectedTag)
      )
    }

    /* SEARCH */
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

    /* SORTING */
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

      {/* HEADER */}
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
          <Select
            value={viewMode}
            onValueChange={(v: any) => setViewMode(v)}
          >
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

          {/* FAV TAB */}
          <Select
            value={activeTab}
            onValueChange={(v: any) => setActiveTab(v)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="favourites">Favourites</SelectItem>
            </SelectContent>
          </Select>

          {/* TAG FILTER */}
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
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

          {/* SORT */}
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
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
                  onToggleFavourite={() =>
                    toggleFavourite(bookmark)
                  }
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

      {/* MODALS */}
      <AddBookmarkModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={fetchBookmarks}
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
