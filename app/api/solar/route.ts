import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const solarProviders = await prisma.solarProvider.findMany({
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ solarProviders })
  } catch (error: any) {
    console.error("Solar Providers Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
