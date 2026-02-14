"use client"

import { Button } from "@/components/ui/button"

type Props = {
  bookmark: any
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmModal({
  bookmark,
  onClose,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-6">

        <div>
          <h2 className="text-lg font-semibold">
            Delete Bookmark?
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Are you sure you want to delete
            <span className="font-medium"> "{bookmark.title}"</span> ?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>

      </div>
    </div>
  )
}
