"use client"

import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { motion } from "framer-motion"

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen bg-background overflow-hidden">

      {/* ================= Background Glow ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* ================= Sidebar (Fixed) ================= */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* ================= Main Column ================= */}
      <div className="flex flex-1 flex-col overflow-hidden relative">

        {/* ================= Topbar (Fixed) ================= */}
        <div className="flex-shrink-0 z-10">
          <Topbar />
        </div>

        {/* ================= Scrollable Content ================= */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 overflow-y-auto p-10"
        >
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>

      </div>
    </div>
  )
}
