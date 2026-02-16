"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "../animations"
import { ShieldCheck, Infinity, Lock, Cloud, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import TutorialOverlay from "@/app/(public)/features/TutorialOverlay"

export default function SecuritySection() {
  const [showTutorial, setShowTutorial] = useState(false)

  return (
    <>
      <section
        id="security"
        className="relative py-32 px-6 overflow-hidden"
      >
        <div className="absolute left-[-200px] top-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 max-w-6xl mx-auto space-y-20"
        >
          {/* HEADER */}
          <motion.div
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Built for Security.
              <span className="block text-primary mt-2">
                Designed for Freedom.
              </span>
            </h2>

            <p className="text-lg text-muted-foreground">
              Smart Bookmark is engineered with enterprise-grade
              infrastructure while remaining simple, fast,
              and completely free to use.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-16 items-start">

            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary" />
                <h3 className="text-2xl font-semibold">
                  Safe & Secure
                </h3>
              </div>

              <p className="text-muted-foreground">
                Your data is protected with row-level security,
                encrypted connections, and strict authentication.
              </p>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <Lock size={18} />
                  SSL encryption on every request
                </li>
                <li className="flex gap-3">
                  <Cloud size={18} />
                  Cloud-native infrastructure
                </li>
                <li className="flex gap-3">
                  <ShieldCheck size={18} />
                  Row-level security enforcement
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex items-center gap-3">
                <Infinity className="text-primary" />
                <h3 className="text-2xl font-semibold">
                  No Limits. Starting at $0
                </h3>
              </div>

              <p className="text-muted-foreground">
                Unlimited bookmarks and instant sync.
              </p>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <Zap size={18} />
                  Real-time multi-tab sync
                </li>
                <li className="flex gap-3">
                  <Cloud size={18} />
                  Always available across devices
                </li>
                <li className="flex gap-3">
                  <Infinity size={18} />
                  Unlimited bookmarks forever
                </li>
              </ul>
            </motion.div>

          </div>

          {/* FEATURE CARDS */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 pt-12"
          >
            {[
              {
                title: "Google Authentication",
                description:
                  "Secure OAuth login with no password storage.",
              },
              {
                title: "Realtime Infrastructure",
                description:
                  "Instant bookmark updates using realtime sync.",
              },
              {
                title: "Modern Architecture",
                description:
                  "Built with Next.js App Router and scalable cloud services.",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-semibold text-lg mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="text-center pt-8">
            <Button size="lg" onClick={() => setShowTutorial(true)}>
              Explore Features
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <TutorialOverlay
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </>
  )
}
