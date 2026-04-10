import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    const banks = await prisma.bank.findMany({
      where,
      orderBy: { transparencyScore: 'desc' }
    })

    return NextResponse.json({ banks })
  } catch (error: any) {
    console.error("Banking Banks Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
