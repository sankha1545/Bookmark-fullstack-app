import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { country } = await req.json()

    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      }
    )

    if (!res.ok) {
      return NextResponse.json([], { status: 500 })
    }

    const data = await res.json()

    return NextResponse.json(data?.data?.states || [])
  } catch (err) {
    console.error("Geo states error:", err)
    return NextResponse.json([], { status: 500 })
  }
}
