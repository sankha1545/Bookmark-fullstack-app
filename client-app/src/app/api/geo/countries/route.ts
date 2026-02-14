import dns from "dns"
dns.setDefaultResultOrder("ipv4first")

import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,idd",
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "External API failed", status: response.status },
        { status: 500 }
      )
    }

    const data = await response.json()

    const countries = data
      .map((c: any) => {
        const dial =
          c?.idd?.root && c?.idd?.suffixes?.[0]
            ? `${c.idd.root}${c.idd.suffixes[0]}`
            : ""

        return {
          name: c?.name?.common || "",
          dialCode: dial,
        }
      })
      .filter((c: any) => c.name)
      .sort((a: any, b: any) =>
        a.name.localeCompare(b.name)
      )

    return NextResponse.json(countries)
  } catch (error: any) {
    console.error("SERVER FETCH ERROR:", error)
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    )
  }
}
