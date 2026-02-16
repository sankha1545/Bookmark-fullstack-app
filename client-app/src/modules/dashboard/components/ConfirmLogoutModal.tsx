"use client"

import { Button } from "@/components/ui/button"

type Props = {
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmLogoutModal({
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

    
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6">

        <div>
          <h2 className="text-lg font-semibold">
            Confirm Logout
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Are you sure you want to log out?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={onConfirm}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
