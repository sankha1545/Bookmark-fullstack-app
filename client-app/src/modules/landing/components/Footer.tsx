"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { fadeUp } from "../animations"
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function FooterSection() {
  return (
    <footer className="bg-muted/40 border-t px-6 py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        {/* Top Grid */}
        <div className="grid md:grid-cols-5 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-6 md:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight">
              Smart Bookmark
            </h3>

            <p className="text-sm text-muted-foreground max-w-sm">
              A modern, real-time bookmark manager built with
              Next.js and Supabase. Secure. Fast. Minimal.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium">
                Stay updated
              </p>

              <div className="flex gap-3">
                <Input
                  placeholder="Enter your email"
                  className="max-w-xs"
                />
                <Button size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
          <li><Link href="/#security">Security</Link></li>
<li><Link href="/#access">Access</Link></li>
<li><Link href="/#pricing">Pricing</Link></li>

              <li><Link href="/login">Login</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/footer/about">About</Link></li>
              <li><Link href="/footer/blog">Blog</Link></li>
              <li><Link href="/footer/faq">FAQ</Link></li>
              <li><Link href="/footer/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/footer/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/footer/terms-of-service">Terms of Service</Link></li>
              <li><Link href="/footer/cookies">Cookies</Link></li>
              <li><Link href="/footer/security">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Smart Bookmark.
            All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-6 text-muted-foreground">
            <Link href="#">
              <Github size={18} />
            </Link>
            <Link href="#">
              <Twitter size={18} />
            </Link>
            <Link href="#">
              <Linkedin size={18} />
            </Link>
            <Link href="#">
              <Mail size={18} />
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
