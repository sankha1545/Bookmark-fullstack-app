

import { supabase } from "@/lib/supabase/client"

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Google sign-in error:", error.message)
    throw error
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Sign out error:", error.message)
    throw error
  }
}
