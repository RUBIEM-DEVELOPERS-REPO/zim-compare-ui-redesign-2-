import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")

    const where: any = {}
    if (providerId) where.id = providerId

    const dbProviders = await prisma.telecomProvider.findMany({
      where,
      orderBy: [{ name: 'asc' }],
    })

    const dbBundles = await prisma.dataBundle.findMany({
      orderBy: [{ price: 'asc' }],
    })

    const voiceRateWhere = providerId ? { operator: providerId } : {}

    const dbVoiceRates = await prisma.voiceRate.findMany({
      where: voiceRateWhere,
      orderBy: [{ price: 'asc' }],
    })

    // Filter using our dynamic Data Quality Verification Engine
    const providers = filterVerifiedRecords(dbProviders, "telecom")
    const bundles = filterVerifiedRecords(dbBundles, "telecom")
    const voiceRates = filterVerifiedRecords(dbVoiceRates, "telecom")

    return NextResponse.json({ providers, bundles, voiceRates })
  } catch (error: any) {
    console.error("Telecom API Error:", error)
    return NextResponse.json({ error: "Failed to load comparison data. Please try again later." }, { status: 500 })
  }
}
