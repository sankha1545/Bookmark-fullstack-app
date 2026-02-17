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
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    if (bookmark) {

      setTitle(bookmark.title || "")
      setUrl(bookmark.url || "")
      setNote(bookmark.note || "")

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

      const { error } = await supabase
        .from("bookmarks")
        .update({
          title,
          url,
          note,
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookmark.id)
        .eq("user_id", user.id)


      if (error) throw error


      onSuccess()
      onClose()

    }

    catch (err) {

      console.error("Update failed:", err)
      alert("Failed to update bookmark")

    }

    finally {

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

            <label className="text-sm font-medium">
              Title
            </label>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

          </div>



          <div>

            <label className="text-sm font-medium">
              URL
            </label>

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

          </div>



          <div>

            <label className="text-sm font-medium">
              Note
            </label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-md p-2 bg-transparent"
              rows={3}
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
