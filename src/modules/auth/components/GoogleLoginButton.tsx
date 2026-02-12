"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "../services/auth.service"

export const GoogleLoginButton = () => {
  return (
    <Button onClick={signInWithGoogle} className="w-full">
      Continue with Google
    </Button>
  )
}
