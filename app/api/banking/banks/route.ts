import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where = type ? { type } : {}

    const rawBanks = await prisma.bank.findMany({
      where,
      orderBy: { transparencyScore: 'desc' }
    })

    const banks = filterVerifiedRecords(rawBanks, "banking")

    return NextResponse.json({ banks })
  } catch (error: any) {
    console.error("Banking Banks API Error:", error)
    return NextResponse.json({ banks: [] }, { status: 500 })
  }
}
