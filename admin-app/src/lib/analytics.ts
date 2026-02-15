import { createClient } from "@supabase/supabase-js"

/* ======================================================
   🔐 SERVER-ONLY SUPABASE ADMIN CLIENT
====================================================== */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
)

/* ======================================================
   🧮 DASHBOARD STATS
====================================================== */

export async function getDashboardStats(): Promise<{
  totalUsers: number
  activeUsers: number
  totalMessages: number
}> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) console.error("User fetch error:", error)

  const users = data?.users ?? []
  const totalUsers = users.length

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const activeUsers = users.filter((user) => {
    if (!user.last_sign_in_at) return false
    return new Date(user.last_sign_in_at) >= yesterday
  }).length

  const { count: totalMessages } = await supabaseAdmin
    .from("contact_messages")
    .select("*", { count: "exact", head: true })

  return {
    totalUsers,
    activeUsers,
    totalMessages: totalMessages ?? 0,
  }
}

/* ======================================================
   📊 DAILY USER REGISTRATIONS (ISO SAFE)
====================================================== */

export async function getDailyUsers(): Promise<
  { date: string; value: number }[]
> {
  const { data } = await supabaseAdmin.auth.admin.listUsers()
  const users = data?.users ?? []

  const grouped: Record<string, number> = {}

  users.forEach((user) => {
    if (!user.created_at) return

    const date = new Date(user.created_at)
      .toISOString()
      .split("T")[0]

    grouped[date] = (grouped[date] || 0) + 1
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      value: count, // ✅ unified chart shape
    }))
}

/* ======================================================
   📈 BOOKMARK ANALYTICS (WITH FILTER SUPPORT)
====================================================== */

export async function getBookmarksAnalytics(
  {
    type = "daily",
    range = 7,
  }: {
    type?: "daily" | "monthly" | "yearly"
    range?: number
  } = {}
): Promise<{ date: string; value: number }[]> {
  let query = supabaseAdmin
    .from("bookmarks")
    .select("created_at")

  const now = new Date()

  /* 🔥 Daily Range Filter */
  if (type === "daily") {
    const startDate = new Date()
    startDate.setDate(now.getDate() - range)

    query = query.gte("created_at", startDate.toISOString())
  }

  const { data } = await query

  const grouped: Record<string, number> = {}

  data?.forEach((bookmark) => {
    if (!bookmark.created_at) return

    const dateObj = new Date(bookmark.created_at)

    let key = ""

    if (type === "daily") {
      key = dateObj.toISOString().split("T")[0]
    }

    if (type === "monthly") {
      key = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1
      ).padStart(2, "0")}`
    }

    if (type === "yearly") {
      key = `${dateObj.getFullYear()}`
    }

    grouped[key] = (grouped[key] || 0) + 1
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      value: count, // ✅ FIXED (previously bookmarks: count)
    }))
}
