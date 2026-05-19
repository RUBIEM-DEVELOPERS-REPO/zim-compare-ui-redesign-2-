import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")

    const where = city ? { city } : {}

    const rawDealerships = await prisma.carDealership.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    const dealerships = filterVerifiedRecords(rawDealerships, "mobility")

    return NextResponse.json({ dealerships })
  } catch (error: any) {
    console.error("Dealerships Error:", error)
    return NextResponse.json({ error: "Failed to load dealerships data. Please try again later." }, { status: 500 })
  }
}
