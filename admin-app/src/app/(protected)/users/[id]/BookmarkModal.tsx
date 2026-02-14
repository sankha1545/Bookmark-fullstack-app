"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"

interface Props {
  bookmark: any | null
  onClose: () => void
}

export default function BookmarkModal({
  bookmark,
  onClose,
}: Props) {
  return (
    <Dialog open={!!bookmark} onOpenChange={onClose}>
      {bookmark && (
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {bookmark.title ?? "Bookmark"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {bookmark.url && (
              <p>
                <span className="font-medium">URL:</span>{" "}
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline break-all"
                >
                  {bookmark.url}
                </a>
              </p>
            )}

            {bookmark.created_at && (
              <p>
                <span className="font-medium">
                  Created At:
                </span>{" "}
                {new Date(
                  bookmark.created_at
                ).toLocaleString()}
              </p>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
