"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { motion } from "framer-motion"

interface Props {
  title: string
  value: number
}

export default function StatsCard({ title, value }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-2xl shadow-sm border bg-white">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </CardContent>
      </Card>
    </motion.div>
  )
}
