import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dealershipId = searchParams.get("dealershipId")

    const where = dealershipId ? { dealershipId } : {}

    const rawVehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { price: 'asc' },
    })

    const vehicles = filterVerifiedRecords(rawVehicles, "mobility")

    return NextResponse.json({ vehicles })
  } catch (error: any) {
    console.error("Vehicles Error:", error)
    return NextResponse.json({ error: "Failed to load vehicles data. Please try again later." }, { status: 500 })
  }
}
