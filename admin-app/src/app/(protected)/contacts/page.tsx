"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import ContactsHeader from "@/src/components/contacts/ContactsHeader"
import ContactCard from "@/src/components/contacts/ContactCard"
import EmptyState from "@/src/components/contacts/EmptyState"
import LoadingState from "@/src/components/contacts/LoadingState"
import { toast } from "sonner"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Message = {
  id: string
  name: string
  email: string
  country: string
  state: string
  dial_code: string
  phone: string
  message: string
  created_at: string
  is_read: boolean
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast.error("Failed to load messages")
      return
    }

    setMessages(data ?? [])
    setLoading(false)
  }

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id)

    if (!error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, is_read: true } : msg
        )
      )
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  if (loading) return <LoadingState />

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-10 space-y-8">
      <ContactsHeader
        unreadCount={messages.filter((m) => !m.is_read).length}
        onRefresh={fetchMessages}
      />

      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <ContactCard
              key={msg.id}
              message={msg}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
