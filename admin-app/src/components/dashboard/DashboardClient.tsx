"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Switch } from "@/src/components/ui/switch"
import { Badge } from "@/src/components/ui/badge"
import { RefreshCw, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import StatsCard from "@/src/components/analytics/StatsCard"
import DailyUsersBarChart from "@/src/components/analytics/DailyUsersBarChart"
import BookmarksLineChart from "@/src/components/analytics/BookmarksLineChart"



type DashboardStats = {
  totalUsers: number
  activeUsers: number
  totalMessages: number
}

type DailyUser = {
  date: string
  value: number
}

type BookmarkData = {
  date: string
  value: number
}



function sanitizeNumber(value: any) {
  return Number(value) || 0
}

function sanitizeArray(arr: any[] | undefined) {
  if (!Array.isArray(arr)) return []
  return arr.map((item) => ({
    ...item,
    value: sanitizeNumber(item.value),
  }))
}



type Props = {
  initialStats: DashboardStats
  initialDailyUsers: DailyUser[]
  initialBookmarks: BookmarkData[]
}

export default function DashboardClient({
  initialStats,
  initialDailyUsers,
  initialBookmarks,
}: Props) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: sanitizeNumber(initialStats?.totalUsers),
    activeUsers: sanitizeNumber(initialStats?.activeUsers),
    totalMessages: sanitizeNumber(initialStats?.totalMessages),
  })

  const [dailyUsers, setDailyUsers] = useState<DailyUser[]>(
    sanitizeArray(initialDailyUsers)
  )

  const [bookmarksData, setBookmarksData] = useState<BookmarkData[]>(
    sanitizeArray(initialBookmarks)
  )

  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

 

  useEffect(() => {
    setMounted(true)
    setLastUpdated(new Date())
  }, [])

 

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshDashboard()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh])



  async function refreshDashboard() {
    setLoading(true)

    try {
    const res = await fetch("/api/admin/admin-dashboard")

      const data = await res.json()

      if (!res.ok) {
        toast.error("Failed to refresh analytics")
        return
      }

      setStats({
        totalUsers: sanitizeNumber(data.stats?.totalUsers),
        activeUsers: sanitizeNumber(data.stats?.activeUsers),
        totalMessages: sanitizeNumber(data.stats?.totalMessages),
      })

      setDailyUsers(sanitizeArray(data.dailyUsers))
      setBookmarksData(sanitizeArray(data.bookmarks))
      setLastUpdated(new Date())

      toast.success("Dashboard updated")
    } catch {
      toast.error("Server error occurred")
    } finally {
      setLoading(false)
    }
  }



  const growthRate = useMemo(() => {
    if (dailyUsers.length < 2) return 0
    const last = dailyUsers[dailyUsers.length - 1].value
    const prev = dailyUsers[dailyUsers.length - 2].value
    if (!prev) return 0
    return (((last - prev) / prev) * 100).toFixed(1)
  }, [dailyUsers])

  

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            <h2 className="text-3xl font-bold tracking-tight">
              Dashboard Overview
            </h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Monitor platform performance and growth insights
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">

          {mounted && lastUpdated && (
            <Badge variant="secondary" className="text-xs">
              Updated at{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Badge>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Auto Refresh
            </span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>

          <Button
            variant="outline"
            onClick={refreshDashboard}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing
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

      {/* STATS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          highlight
        />

   

        <StatsCard
          title="Total Messages"
          value={stats.totalMessages}
        />
      </motion.div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        <Card className="p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-4">
            Daily Active Users
          </h3>

          {dailyUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No data available
            </p>
          ) : (
            <DailyUsersBarChart data={dailyUsers} />
          )}
        </Card>

        <Card className="p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-4">
            Bookmark Growth
          </h3>

          {bookmarksData.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No data available
            </p>
          ) : (
            <BookmarksLineChart data={bookmarksData} />
          )}
        </Card>

      </div>
    </div>
  )
}
