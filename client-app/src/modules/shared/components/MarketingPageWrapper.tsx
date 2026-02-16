"use client"
import { MotionDiv } from "@/components/motion/motion"
import { motion } from "framer-motion"
import { fadeUp } from "@/modules/landing/animations"

export default function MarketingPageWrapper({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen px-6 py-24 max-w-4xl mx-auto">
      <MotionDiv
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {children}
        </div>
      </MotionDiv>
    </div>
  )
}
