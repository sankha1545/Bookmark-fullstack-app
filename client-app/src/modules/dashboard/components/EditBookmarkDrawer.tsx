"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2 } from "lucide-react"

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
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title || "")
      setUrl(bookmark.url || "")
      setTags(bookmark.tags?.join(", ") || "") 
      setNote(bookmark.note || "")
      setDescription(bookmark.description || "")
    }
  }, [bookmark])



  async function handleUpdate() {
    if (!bookmark?.id) return

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("User not authenticated")
      setLoading(false)
      return
    }

    try {
      
      const cleanedTags =
        tags.trim().length > 0
          ? tags
              .split(",")
              .map((t) => t.trim().toLowerCase())
              .filter(Boolean)
          : []

    
      const { error: bookmarkError } = await supabase
        .from("bookmarks")
        .update({
          title,
          url,
          note,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookmark.id)
        .eq("user_id", user.id)

      if (bookmarkError) throw bookmarkError

 
      const { error: deleteError } = await supabase
        .from("bookmark_tags")
        .delete()
        .eq("bookmark_id", bookmark.id)

      if (deleteError) throw deleteError

      
      if (cleanedTags.length > 0) {
        for (const tagName of cleanedTags) {
         
          const { data: tagData, error: tagError } = await supabase
            .from("tags")
            .upsert(
              { name: tagName },
              { onConflict: "name" }
            )
            .select()
            .single()

          if (tagError) throw tagError

       
          const { error: relationError } = await supabase
            .from("bookmark_tags")
            .insert({
              bookmark_id: bookmark.id,
              tag_id: tagData.id,
            })

          if (relationError) throw relationError
        }
      }

      onSuccess()
      onClose()

    } catch (err) {
      console.error("Update failed:", err)
      alert("Failed to update bookmark")
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="fixed inset-0 z-50 flex">

    
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

   
      <div className="w-full max-w-md bg-white dark:bg-neutral-950 p-6 shadow-2xl overflow-auto">

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
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

       
          <div>
            <label className="text-sm font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

     
          <div>
            <label className="text-sm font-medium">
              Tags (comma separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, nextjs, productivity"
            />
          </div>

         
          <div>
            <label className="text-sm font-medium">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-md p-2 bg-transparent"
              rows={3}
            />
          </div>

        
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2 bg-transparent"
              rows={4}
            />
          </div>

       
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>

        </div>
      </div>
    </div>
  )
}
