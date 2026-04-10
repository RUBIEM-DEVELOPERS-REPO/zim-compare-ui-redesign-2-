import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    const providers = await prisma.insuranceProvider.findMany({
      where,
      orderBy: { transparencyScore: 'desc' },
    })

    return NextResponse.json({ providers })
  } catch (error: any) {
    console.error("Insurance Providers Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
