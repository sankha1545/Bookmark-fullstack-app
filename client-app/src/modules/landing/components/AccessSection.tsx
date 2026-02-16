"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "../animations"
import {
  Monitor,
  Smartphone,
  Tablet,
  Cloud,
  Zap,
  Globe,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccessSection() {
  return (
    <section
      id="access"
      className="relative py-32 px-6 bg-muted/30 overflow-hidden"
    >
      
      <div className="absolute right-[-200px] top-20 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl" />

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
            Access Anywhere.
            <span className="block text-primary mt-2">
              Sync Everywhere.
            </span>
          </h2>

          <p className="text-lg text-muted-foreground">
            Smart Bookmark works seamlessly across browsers,
            devices, and sessions — delivering instant updates
            wherever you are.
          </p>
        </motion.div>

      
        <div className="grid md:grid-cols-2 gap-16 items-start">

        
          <motion.div variants={fadeUp} className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Real-Time Multi-Device Sync
            </h3>

            <p className="text-muted-foreground">
              Whether you’re working from your laptop,
              browsing on your tablet, or checking links
              on your phone — your bookmarks update instantly.
            </p>

            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Zap size={18} />
                Instant sync between open tabs
              </li>
              <li className="flex gap-3">
                <Wifi size={18} />
                Live updates without refreshing
              </li>
              <li className="flex gap-3">
                <Cloud size={18} />
                Cloud-native infrastructure
              </li>
            </ul>
          </motion.div>

          
          <motion.div variants={fadeUp} className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Browser & Device Agnostic
            </h3>

            <p className="text-muted-foreground">
              Built for modern web users. Works flawlessly
              across Chrome, Edge, Safari, and any modern browser.
            </p>

            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Monitor size={18} />
                Desktop optimized experience
              </li>
              <li className="flex gap-3">
                <Tablet size={18} />
                Tablet responsive interface
              </li>
              <li className="flex gap-3">
                <Smartphone size={18} />
                Mobile-friendly design
              </li>
            </ul>
          </motion.div>
        </div>

      
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 pt-12"
        >
          {[
            {
              icon: <Globe size={20} />,
              title: "Web First",
              description:
                "Access your bookmarks from anywhere with a secure browser session.",
            },
            {
              icon: <Cloud size={20} />,
              title: "Cloud Backed",
              description:
                "All data stored securely with Supabase cloud infrastructure.",
            },
            {
              icon: <Zap size={20} />,
              title: "Performance Optimized",
              description:
                "Fast loading, instant UI updates, minimal latency.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4 text-primary">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-lg mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        
        <motion.div
          variants={fadeUp}
          className="text-center pt-8 space-y-4"
        >
          <p className="text-sm text-muted-foreground">
            Engineered with Next.js App Router,
            Supabase Realtime, and modern cloud architecture.
          </p>

          <Button size="lg">
            Experience Real-Time Sync
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
