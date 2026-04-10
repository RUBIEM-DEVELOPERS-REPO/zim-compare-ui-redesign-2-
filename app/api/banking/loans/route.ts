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

    const loans = await prisma.bankLoan.findMany({
      where,
      orderBy: { apr: 'asc' },
    })

    return NextResponse.json({ loans })
  } catch (error: any) {
    console.error("Banking Loans Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
