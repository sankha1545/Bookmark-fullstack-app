"use client"

import { motion } from "framer-motion"
import { fadeUp, staggerContainer } from "@/modules/landing/animations"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { blogPosts } from "@/data/blogPosts"
import  Navbar  from "@/modules/landing/components/LandingNavbar"
import  Footer  from "@/modules/landing/components/Footer"
export default function BlogPage() {
  return (
    
    <section className="relative min-h-screen px-6 py-24 overflow-hidden">
  <Navbar />
      {/* Hero Gradient */}
      <div className="absolute left-[-250px] top-0 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute right-[-250px] bottom-0 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl animate-pulse" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-6xl mx-auto space-y-20"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Smart Bookmark
            <span className="block text-primary mt-2">Blog & Insights</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Engineering deep-dives, design thinking, and product updates
            from the team building Smart Bookmark.
          </p>
        </motion.div>

        {/* Featured */}
        <motion.div variants={fadeUp}>
          <Card className="overflow-hidden shadow-xl">
            <img
              src={blogPosts[0].cover}
              className="w-full h-80 object-cover"
              alt=""
            />
            <CardContent className="p-10 space-y-6">
              <span className="text-primary text-sm font-medium">
                Featured
              </span>

              <h2 className="text-3xl font-semibold">
                {blogPosts[0].title}
              </h2>

              <p className="text-muted-foreground">
                {blogPosts[0].description}
              </p>

              <Link href={`/footer/blog/${blogPosts[0].slug}`}>
                <Button variant="outline">
                  Read Article
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {blogPosts.slice(1).map((post) => (
            <motion.div key={post.slug} variants={fadeUp}>
              <Card className="h-full hover:shadow-lg transition">
                <img
                  src={post.cover}
                  className="h-48 w-full object-cover"
                  alt=""
                />
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

                  <Link
                    href={`/footer/blog/${post.slug}`}
                    className="text-sm hover:underline"
                  >
                    Read →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div
          variants={fadeUp}
          className="bg-muted/40 rounded-2xl p-10 text-center space-y-6"
        >
          <h2 className="text-2xl font-semibold">
            Stay Updated
          </h2>

          <p className="text-muted-foreground">
            Product updates and engineering insights directly to your inbox.
          </p>

          <div className="flex justify-center gap-4">
            <Input placeholder="Enter your email" className="max-w-xs" />
            <Button>Subscribe</Button>
          </div>
        </motion.div>

      </motion.div>
      <br/>
       <Footer />
    </section>
   
  )
}
