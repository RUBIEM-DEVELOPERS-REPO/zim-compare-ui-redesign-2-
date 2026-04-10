import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    const where = providerId ? { providerId } : {}

    const voiceRates = await prisma.voiceRate.findMany({
      where,
      orderBy: { ratePerMin: 'asc' },
    })

    return NextResponse.json({ voiceRates })
  } catch (error: any) {
    console.error("Telecom Voice Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
