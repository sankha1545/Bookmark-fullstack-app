import { createServerSupabaseClient } from "@/src/lib/supabase/server"
import UserProfileClient from "./UserProfileClient"

interface Props {
  params: Promise<{ id: string }>
}

export default async function UserDetailsPage({ params }: Props) {
  const { id } = await params // ✅ FIX: unwrap params

  const supabase = createServerSupabaseClient()

  const { data: user, error } = await supabase
    .from("admin_user_overview")
    .select("*")
    .eq("auth_user_id", id)
    .maybeSingle()

  if (error) {
    console.error("User fetch error:", error)
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        User not found.
      </div>
    )
  }

  let bookmarks: any[] = []

  if (user.profile_id) {
    const { data: bookmarkData } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("profile_id", user.profile_id)
      .order("created_at", { ascending: false })

    bookmarks = bookmarkData ?? []
  }

  return (
    <div className="p-8">
      <UserProfileClient
        user={user}
        bookmarks={bookmarks}
      />
    </div>
  )
}
