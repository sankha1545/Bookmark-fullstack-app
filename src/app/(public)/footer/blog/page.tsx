"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "@/modules/landing/animations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      title: "Building Real-Time Sync with Supabase",
      description:
        "How we implemented instant multi-tab synchronization using Supabase Realtime.",
      tag: "Engineering",
      date: "Jan 10, 2026",
    },
    {
      title: "Designing a Modern Bookmark Experience",
      description:
        "Why minimal design and performance matter in productivity tools.",
      tag: "Design",
      date: "Jan 5, 2026",
    },
    {
      title: "Security First: Our Authentication Architecture",
      description:
        "Deep dive into Google OAuth and row-level security.",
      tag: "Security",
      date: "Dec 28, 2025",
    },
  ]

  return (
    <div className="min-h-screen px-6 py-24 max-w-6xl mx-auto space-y-20">

      {/* Page Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6 max-w-3xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Smart Bookmark Blog
        </h1>

        <p className="text-lg text-muted-foreground">
          Insights, engineering deep-dives, and product updates
          from the team building Smart Bookmark.
        </p>
      </motion.div>

      {/* Featured Post */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-10 shadow-lg">
          <CardContent className="space-y-6">
            <span className="text-sm text-primary font-medium">
              Featured
            </span>

            <h2 className="text-3xl font-semibold">
              How We Built a Real-Time Bookmark Manager
            </h2>

            <p className="text-muted-foreground">
              Explore how Smart Bookmark leverages Next.js App Router
              and Supabase Realtime to deliver seamless cloud
              synchronization across devices.
            </p>

            <Button variant="outline">
              Read Article
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blog Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-8"
      >
        {posts.map((post) => (
          <motion.div key={post.title} variants={fadeUp}>
            <Card className="h-full hover:shadow-md transition">
              <CardContent className="p-6 space-y-4">
                <div className="text-xs text-primary font-medium">
                  {post.tag}
                </div>

                <h3 className="text-lg font-semibold">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {post.description}
                </p>

                <div className="flex justify-between items-center pt-4 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <Link
                    href="#"
                    className="hover:underline"
                  >
                    Read →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-muted/40 rounded-2xl p-10 text-center space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Stay Updated
        </h2>

        <p className="text-muted-foreground">
          Get product updates, engineering insights, and
          productivity tips delivered to your inbox.
        </p>

        <div className="flex justify-center gap-4">
          <Input
            placeholder="Enter your email"
            className="max-w-xs"
          />
          <Button>
            Subscribe
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
