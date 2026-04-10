import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    const utilities = await prisma.utilityProvider.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json({ utilities })
  } catch (error: any) {
    console.error("Utilities Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
