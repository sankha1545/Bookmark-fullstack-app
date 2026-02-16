"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { fadeUp } from "../animations"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Sparkles } from "lucide-react"

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative py-32 px-6 overflow-hidden bg-primary text-primary-foreground"
    >
     
      <div className="absolute left-[-200px] top-10 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute right-[-200px] bottom-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center space-y-10"
      >
        
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Start Organizing Smarter Today
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of users who rely on Smart Bookmark
            to organize links, sync instantly, and stay productive
            across devices.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="px-10 shadow-lg"
            >
              Get Started Free
            </Button>
          </Link>

          <Link href="#pricing">
            <Button
              size="lg"
              variant="outline"
              className="px-10 border-white text-white hover:bg-white hover:text-primary"
            >
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-6 space-y-4">
          <div className="flex justify-center gap-6 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} />
              Secure Authentication
            </span>

            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              Free Forever Plan
            </span>
          </div>

          <p className="text-xs text-primary-foreground/70">
            No credit card required. Cancel anytime. Your data remains yours.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
