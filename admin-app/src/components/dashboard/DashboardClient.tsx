"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"

import StatsCard from "@/src/components/analytics/StatsCard"
import DailyUsersBarChart from "@/src/components/analytics/DailyUsersBarChart"
import BookmarksLineChart from "@/src/components/analytics/BookmarksLineChart"

type Props = {
  initialStats: any
  initialDailyUsers: any[]
  initialBookmarks: any[]
}

export default function DashboardClient({
  initialStats,
  initialDailyUsers,
  initialBookmarks,
}: Props) {
  const [stats, setStats] = useState(initialStats)
  const [dailyUsers, setDailyUsers] = useState(initialDailyUsers)
  const [bookmarksData, setBookmarksData] = useState(initialBookmarks)
  const [loading, setLoading] = useState(false)

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  /* ✅ Prevent Hydration Mismatch */
  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

  async function refreshDashboard() {
    setLoading(true)

    try {
      const res = await fetch("/api/admin/analytics")
      const data = await res.json()

      if (!res.ok) {
        toast.error("Failed to refresh data")
        return
      }

      setStats(data.stats)
      setDailyUsers(data.dailyUsers)
      setBookmarksData(data.bookmarks)
      setLastUpdated(new Date())

      toast.success("Dashboard refreshed")
    } catch {
      toast.error("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>

        <div className="flex items-center gap-4">
          {mounted && lastUpdated && (
            <p className="text-xs text-neutral-500">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          )}

          <Button
            variant="outline"
            onClick={refreshDashboard}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard title="Total Users" value={stats.totalUsers} />
        <StatsCard title="Active Users (24h)" value={stats.activeUsers} />
        <StatsCard title="Total Messages" value={stats.totalMessages} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <DailyUsersBarChart data={dailyUsers} />
        <BookmarksLineChart data={bookmarksData} />
      </div>

    </div>
  )
}
