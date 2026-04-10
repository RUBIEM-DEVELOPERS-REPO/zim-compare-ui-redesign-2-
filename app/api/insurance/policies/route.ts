import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const category = searchParams.get("category")

    const where: any = {}
    if (providerId) where.providerId = providerId
    if (category) where.category = category

    const policies = await prisma.policy.findMany({
      where,
      orderBy: { monthlyPremium: 'asc' },
    })

    return NextResponse.json({ policies })
  } catch (error: any) {
    console.error("Insurance Policies Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
