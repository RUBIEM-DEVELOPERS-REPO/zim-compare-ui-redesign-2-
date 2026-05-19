import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const rawSolarProviders = await prisma.solarProvider.findMany({
      orderBy: { rating: 'desc' },
    })

    const solarProviders = filterVerifiedRecords(rawSolarProviders, "energy")

    return NextResponse.json({ solarProviders })
  } catch (error: any) {
    console.error("Solar Providers Error:", error)
    return NextResponse.json({ error: "Failed to load solar providers" }, { status: 500 })
  }
}
