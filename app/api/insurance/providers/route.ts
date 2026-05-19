import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    const rawProviders = await prisma.insuranceProvider.findMany({
      where,
      orderBy: { transparencyScore: 'desc' },
    })

    const providers = filterVerifiedRecords(rawProviders, "insurance")

    return NextResponse.json({ providers })
  } catch (error: any) {
    console.error("Insurance Providers Error:", error)
    return NextResponse.json({ error: "Failed to load insurance providers" }, { status: 500 })
  }
}
