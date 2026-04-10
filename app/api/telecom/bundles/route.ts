import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const category = searchParams.get("category")

    const where: any = {}
    if (providerId) where.operator = providerId
    if (category) where.bundle_group = category

    const bundles = await prisma.dataBundle.findMany({
      where,
      orderBy: { price: 'asc' },
    })

    return NextResponse.json({ bundles })
  } catch (error: any) {
    console.error("Telecom Bundles Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
