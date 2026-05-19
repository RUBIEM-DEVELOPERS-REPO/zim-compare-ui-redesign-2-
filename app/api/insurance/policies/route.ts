import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const category = searchParams.get("category")

    const where: any = {}
    if (providerId) where.providerId = providerId
    if (category) where.category = category

    const rawPolicies = await prisma.policy.findMany({
      where,
      orderBy: { monthlyPremium: 'asc' },
    })

    const policies = filterVerifiedRecords(rawPolicies, "insurance")

    return NextResponse.json({ policies })
  } catch (error: any) {
    console.error("Insurance Policies Error:", error)
    return NextResponse.json({ error: "Failed to load policies" }, { status: 500 })
  }
}
