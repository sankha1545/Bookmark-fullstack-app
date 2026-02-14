import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

/* =========================================================
   SUPABASE (SERVICE ROLE — SERVER ONLY)
========================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* =========================================================
   SECURITY CONFIG
========================================================= */

const MAX_ATTEMPTS = 3
const LOCK_DURATION = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 10 // 10 requests per minute per IP

/* =========================================================
   IN-MEMORY RATE LIMITER
   (For production use Redis / Upstash)
========================================================= */

const ipAttempts = new Map<
  string,
  { count: number; time: number }
>()

function checkRateLimit(ip: string) {
  const now = Date.now()
  const record = ipAttempts.get(ip)

  if (!record) {
    ipAttempts.set(ip, { count: 1, time: now })
    return false
  }

  // Reset window
  if (now - record.time > RATE_LIMIT_WINDOW) {
    ipAttempts.set(ip, { count: 1, time: now })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true
  }

  record.count++
  ipAttempts.set(ip, record)
  return false
}

/* =========================================================
   LOGIN HANDLER
========================================================= */

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"

    /* 🔥 RATE LIMIT CHECK */
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait." },
        { status: 429 }
      )
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      )
    }

    /* =====================================================
       FETCH ADMIN USER
    ===================================================== */

    const { data: admin, error: fetchError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError || !admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    /* =====================================================
       ACCOUNT LOCK CHECK
    ===================================================== */

    if (
      admin.locked_until &&
      new Date(admin.locked_until) > new Date()
    ) {
      return NextResponse.json(
        { error: "Account locked. Try again later." },
        { status: 403 }
      )
    }

    /* =====================================================
       PASSWORD VERIFY (bcrypt)
    ===================================================== */

    const valid = await bcrypt.compare(
      password,
      admin.password_hash
    )

    if (!valid) {
      const attempts = admin.failed_attempts + 1

      if (attempts >= MAX_ATTEMPTS) {
        await supabase
          .from("admin_users")
          .update({
            failed_attempts: 0,
            locked_until: new Date(
              Date.now() + LOCK_DURATION
            ).toISOString(),
          })
          .eq("email", email)

        return NextResponse.json(
          {
            error:
              "Too many failed attempts. Account locked for 1 hour.",
          },
          { status: 403 }
        )
      }

      await supabase
        .from("admin_users")
        .update({ failed_attempts: attempts })
        .eq("email", email)

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    /* =====================================================
       RESET FAILED ATTEMPTS
    ===================================================== */

    await supabase
      .from("admin_users")
      .update({
        failed_attempts: 0,
        locked_until: null,
      })
      .eq("email", email)

    /* =====================================================
       CREATE SECURE JWT SESSION
    ===================================================== */

    const secret = new TextEncoder().encode(
      process.env.ADMIN_JWT_SECRET!
    )

    const token = await new SignJWT({
      email: admin.email,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret)

    const response = NextResponse.json({ success: true })

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
