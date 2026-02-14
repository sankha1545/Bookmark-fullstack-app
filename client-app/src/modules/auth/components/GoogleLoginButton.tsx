"use client"

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("OAuth error:", error.message)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3"
      size="lg"
    >
      <FcGoogle size={20} />
      {loading ? "Redirecting..." : "Continue with Google"}
    </Button>
  )
}
