import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")

    const where: any = {}
    if (origin) where.origin = origin
    if (destination) where.destination = destination

    const rawRoutes = await prisma.busRoute.findMany({
      where,
      orderBy: { price: 'asc' },
    })

    const routes = filterVerifiedRecords(rawRoutes, "mobility")

    return NextResponse.json({ routes, busRoutes: routes })
  } catch (error: any) {
    console.error("Bus Routes Error:", error)
    return NextResponse.json({ error: "Failed to load bus routes. Please try again later." }, { status: 500 })
  }
}
