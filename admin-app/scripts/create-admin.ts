import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL!
  const password = process.env.ADMIN_PASSWORD!

  const hash = await bcrypt.hash(password, 12)

  const { error } = await supabase.from("admin_users").insert({
    email,
    password_hash: hash,
  })

  if (error) console.error(error)
  else console.log("Admin created successfully")
}

createAdmin()
