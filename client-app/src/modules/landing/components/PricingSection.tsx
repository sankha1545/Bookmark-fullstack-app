"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "../animations"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-32 px-6 overflow-hidden"
    >
      
      <div className="absolute left-[-200px] bottom-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto space-y-20"
      >
        
        <motion.div
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>

          <p className="text-lg text-muted-foreground">
            Built to be accessible for everyone.
            Start free — scale when you need more.
          </p>
        </motion.div>

      
        <div className="grid md:grid-cols-2 gap-12">

         
          <motion.div
            variants={fadeUp}
            className="p-10 rounded-2xl border bg-card shadow-sm"
          >
            <h3 className="text-2xl font-semibold mb-4">
              Free Plan
            </h3>

            <p className="text-muted-foreground mb-6">
              Perfect for individuals managing bookmarks
              across devices.
            </p>

            <div className="text-4xl font-bold mb-6">
              $0
              <span className="text-base font-normal text-muted-foreground">
                /forever
              </span>
            </div>

            <ul className="space-y-4 mb-8 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Check size={18} />
                Unlimited bookmarks
              </li>
              <li className="flex gap-3">
                <Check size={18} />
                Real-time sync
              </li>
              <li className="flex gap-3">
                <Check size={18} />
                Google OAuth login
              </li>
              <li className="flex gap-3">
                <Check size={18} />
                Secure cloud storage
              </li>
            </ul>

            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </motion.div>

         
          <motion.div
            variants={fadeUp}
            className="relative p-10 rounded-2xl border-2 border-primary bg-card shadow-lg"
          >
          
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
              Coming Soon
            </div>

            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              Pro Plan
            </h3>

            <p className="text-muted-foreground mb-6">
              Designed for power users who want advanced
              organization and productivity tools.
            </p>

            <div className="text-4xl font-bold mb-6">
              $9
              <span className="text-base font-normal text-muted-foreground">
                /month
              </span>
            </div>

            <ul className="space-y-4 mb-8 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Check size={18} />
                All Free features
              </li>
              <li className="flex gap-3">
                <Check size={18} />
                Bookmark collections & folders
              </li>
              <li className="flex gap-3">
                <Check size={18} />
                Priority support
              </li>
              <li className="flex gap-3">
                <Check size={18} />
                Advanced search & filtering
              </li>
            </ul>

            <Button size="lg" variant="outline" className="w-full">
              Join Waitlist
            </Button>
          </motion.div>
        </div>

      
        <motion.div
          variants={fadeUp}
          className="text-center text-sm text-muted-foreground pt-8"
        >
          No hidden fees. No credit card required.
          Cancel anytime.
        </motion.div>
      </motion.div>
    </section>
  )
}
