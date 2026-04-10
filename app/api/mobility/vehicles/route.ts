import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dealershipId = searchParams.get("dealershipId")

    const where = dealershipId ? { dealershipId } : {}

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ vehicles })
  } catch (error: any) {
    console.error("Vehicles Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
