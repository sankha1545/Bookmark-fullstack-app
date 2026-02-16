"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";



export default function ConfirmDialog({
  title = "Are you sure?",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: any) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel?.();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#061025] rounded-2xl shadow-2xl border overflow-hidden">
        <div className="p-6 flex items-start gap-4">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end p-4 border-t">
          <Button variant="ghost" onClick={onCancel} aria-label="Cancel">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading} aria-label={confirmLabel}>
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
