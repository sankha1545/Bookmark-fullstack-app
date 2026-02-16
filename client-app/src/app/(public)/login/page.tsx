"use client"
import { MotionDiv } from "@/components/motion/motion"

import { motion } from "framer-motion"
import { GoogleLoginButton } from "@/modules/auth/components/GoogleLoginButton"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ShieldCheck, Zap, Cloud } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

    
      <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center">

        <MotionDiv
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 hidden md:block"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to
              <span className="block text-primary">
                Smart Bookmark
              </span>
            </h1>

            <p className="text-muted-foreground text-lg">
              Organize, sync, and access your bookmarks securely
              across all your devices — in real time.
            </p>
          </div>

         
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              Google OAuth Secure Authentication
            </div>

            <div className="flex items-center gap-3">
              <Zap size={18} />
              Real-Time Multi-Tab Sync
            </div>

            <div className="flex items-center gap-3">
              <Cloud size={18} />
              Cloud-Native Infrastructure
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Built with Next.js App Router and Supabase Realtime.
          </p>
        </MotionDiv>

      
        <MotionDiv
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full max-w-md mx-auto shadow-xl backdrop-blur-lg bg-card/90">
            <CardContent className="p-10 space-y-8">

              {/* Brand */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">
                  Sign in to continue
                </h2>
                <p className="text-sm text-muted-foreground">
                  Secure authentication powered by Google.
                </p>
              </div>

             
              <GoogleLoginButton />

             
              <div className="text-center text-xs text-muted-foreground space-y-2">
                <p>
                  By continuing, you agree to our{" "}
                  <Link href="#" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline">
                    Privacy Policy
                  </Link>.
                </p>

                <p>
                  No passwords stored. Your data remains private.
                </p>
              </div>

            
              <div className="text-center pt-4">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  ← Back to Home
                </Link>
              </div>

            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </div>
  )
}
