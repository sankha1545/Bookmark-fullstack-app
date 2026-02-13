"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

type Props = {
  bookmark: any
  onClose: () => void
  onSuccess: () => void
}

export default function EditBookmarkDrawer({
  bookmark,
  onClose,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [tags, setTags] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title)
      setUrl(bookmark.url)
      setTags(bookmark.tags?.join(", ") || "")
      setNote(bookmark.note || "")
    }
  }, [bookmark])

  async function handleUpdate() {
    await supabase
      .from("bookmarks")
      .update({
        title,
        url,
        tags: tags.split(",").map((t) => t.trim()),
        note,
      })
      .eq("id", bookmark.id)

    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* Backdrop */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white p-6 shadow-2xl overflow-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Edit Bookmark
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">

          <div>
            <label className="text-sm">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Tags (comma separated)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-md p-2"
              rows={4}
            />
          </div>

          <Button onClick={handleUpdate} className="w-full">
            Save Changes
          </Button>

        </div>
      </div>
    </div>
  )
}
