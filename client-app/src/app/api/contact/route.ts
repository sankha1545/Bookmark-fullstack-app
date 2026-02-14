import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      country,
      state,
      dialCode,
      phone,
      message,
    } = body

    // Validation
    if (
      !name ||
      !email ||
      !country ||
      !state ||
      !dialCode ||
      !phone ||
      !message
    ) {
      return NextResponse.json(
        { error: "Fill up all the fields" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          country,
          state,
          dial_code: dialCode,
          phone,
          message,
        },
      ])

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Message stored successfully",
    })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
  
}
