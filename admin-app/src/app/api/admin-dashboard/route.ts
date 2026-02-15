import { NextResponse } from "next/server"
import {
  getDashboardStats,
  getDailyUsers,
  getBookmarksAnalytics,
} from "@/src/lib/analytics"

export async function GET() {
  try {
    const stats = await getDashboardStats()
    const dailyUsers = await getDailyUsers()
    const bookmarks = await getBookmarksAnalytics({
      type: "daily",
      range: 7,
    })

    return NextResponse.json({
      stats,
      dailyUsers,
      bookmarks, // ✅ THIS WAS MISSING
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)

    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    )
  }
}
