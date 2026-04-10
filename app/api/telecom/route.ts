import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    const where: any = {}
    if (providerId) where.id = providerId

    const providers = await prisma.telecomProvider.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    const bundles = await prisma.dataBundle.findMany({
      orderBy: { price: 'asc' },
    })

    const voiceRates = await prisma.voiceRate.findMany({
      orderBy: { ratePerMin: 'asc' },
    })

    return NextResponse.json({ providers, bundles, voiceRates })
  } catch (error: any) {
    console.error("Telecom Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
