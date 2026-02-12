// src/app/api/contact/route.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic server-side validation
    const { name, email, gender, country, countryCode, state, dialCode, phone, message } = body ?? {}

    if (!name || !email || !country) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("contacts")
      .insert([{
        name,
        email,
        gender: gender ?? null,
        country,
        country_code: countryCode ?? null,
        state: state ?? null,
        dial_code: dialCode ?? null,
        phone: phone ?? null,
        message: message ?? null,
      }])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Optionally: send welcome/ack email here (via external transactional provider)
    return NextResponse.json({ ok: true, contact: data }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
