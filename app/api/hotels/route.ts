import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")

    const where = location ? { location } : {}

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ hotels })
  } catch (error: any) {
    console.error("Hotels Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
