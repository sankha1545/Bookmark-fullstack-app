"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface Props {
  open: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function LogoutModal({
  open,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">

              <div>
                <h2 className="text-lg font-semibold">
                  Confirm Logout
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to logout from the admin panel?
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  onClick={onConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Logout"
                  )}
                </Button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
