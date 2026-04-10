import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")

    const where: any = {}
    if (origin) where.origin = origin
    if (destination) where.destination = destination

    const routes = await prisma.busRoute.findMany({
      where,
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ routes })
  } catch (error: any) {
    console.error("Bus Routes Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
