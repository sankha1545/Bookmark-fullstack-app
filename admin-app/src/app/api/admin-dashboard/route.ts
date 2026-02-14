import { NextResponse } from "next/server"
import {
  getDashboardStats,
  getDailyUsers,
} from "@/lib/analytics"

export async function GET() {
  const stats = await getDashboardStats()
  const dailyUsers = await getDailyUsers()

  return NextResponse.json({
    stats,
    dailyUsers,
  })
}
