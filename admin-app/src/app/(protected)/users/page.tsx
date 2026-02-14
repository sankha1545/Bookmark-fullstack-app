import { createServerSupabaseClient } from "@/src/lib/supabase/server"
import UsersClient from "./UsersClient"

export default async function UsersPage() {
  const supabase = createServerSupabaseClient()

  const { data: users, error } = await supabase
    .from("admin_user_overview")
    .select("*")

  if (error) {
    console.error(error)
    return <div>Error loading users</div>
  }

  const usersWithCounts = await Promise.all(
    users.map(async (user) => {
      if (!user.profile_id) {
        return { ...user, bookmarkCount: 0 }
      }

      const { count } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", user.profile_id)

      return {
        ...user,
        bookmarkCount: count ?? 0,
      }
    })
  )

  return <UsersClient initialUsers={usersWithCounts} />
}
