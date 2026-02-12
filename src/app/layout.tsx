import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Smart Bookmark",
  description:
    "A secure, real-time personal bookmark manager built with Next.js and Supabase.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          font-sans 
          antialiased 
          bg-background 
          text-foreground
          min-h-screen
          selection:bg-primary/20
        `}
      >
        {/* Main App Wrapper */}
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>

        {/* Global Toast Notifications */}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: "rounded-xl",
          }}
        />
      </body>
    </html>
  )
}
