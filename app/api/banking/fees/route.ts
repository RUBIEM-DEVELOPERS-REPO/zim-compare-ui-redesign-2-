import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bankId = searchParams.get("bankId")
    const category = searchParams.get("category")

    const where: any = {}
    if (bankId) where.bankId = bankId
    if (category) where.category = category

    const fees = await prisma.bankFee.findMany({
      where,
      orderBy: { amount: 'asc' },
    })

    return NextResponse.json({ fees })
  } catch (error: any) {
    console.error("Banking Fees Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
