import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    const rawUtilities = await prisma.utilityProvider.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    const utilities = filterVerifiedRecords(rawUtilities, "energy")

    return NextResponse.json({ utilities })
  } catch (error: any) {
    console.error("Utilities Error:", error)
    return NextResponse.json({ error: "Failed to load utilities data" }, { status: 500 })
  }
}
