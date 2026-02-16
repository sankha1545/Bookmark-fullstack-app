"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "../animations"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldCheck, Zap, Cloud } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">

     
      <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl space-y-10"
      >
       
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl font-bold leading-tight tracking-tight"
        >
          Organize the Web
          <span className="block text-primary mt-2">
            Smarter & Securely
          </span>
        </motion.h1>

       
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Smart Bookmark is a real-time bookmark manager built
          for modern users. Secure authentication, instant sync,
          and cloud-powered reliability — all in one simple interface.
        </motion.p>

       
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Google OAuth Secure
          </span>

          <span className="flex items-center gap-2">
            <Zap size={16} />
            Real-Time Sync
          </span>

          <span className="flex items-center gap-2">
            <Cloud size={16} />
            Cloud-Based Infrastructure
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row justify-center gap-6 pt-4"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="px-10 shadow-lg"
            >
              Get Started Free
            </Button>
          </Link>

          <Link href="#security">
            <Button
              size="lg"
              variant="outline"
              className="px-10"
            >
              Learn More
            </Button>
          </Link>
        </motion.div>

        
        <motion.div
          variants={fadeUp}
          className="pt-6 text-sm text-muted-foreground"
        >
          No credit card required · Free forever plan · Built with Next.js & Supabase
        </motion.div>

        
        <motion.div
          variants={fadeUp}
          className="pt-12 text-xs text-muted-foreground animate-bounce"
        >
          ↓ Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  )
}
