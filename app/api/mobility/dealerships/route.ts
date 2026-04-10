import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    const where = city ? { city } : {}

    const dealerships = await prisma.carDealership.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ dealerships })
  } catch (error: any) {
    console.error("Dealerships Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
