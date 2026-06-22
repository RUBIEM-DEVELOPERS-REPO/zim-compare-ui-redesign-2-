import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { filterVerifiedRecords } from "@/lib/data-quality"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bankId = searchParams.get("bankId")
    const category = searchParams.get("category")

    const where: any = {}
    if (bankId) where.bankId = bankId
    if (category) where.category = category

    const rawLoans = await prisma.bankLoan.findMany({
      where,
      orderBy: [{ isManual: 'desc' }, { apr: 'asc' }],
    })

    const loans = filterVerifiedRecords(rawLoans, "banking")

    return NextResponse.json({ loans })
  } catch (error: any) {
    console.error("Banking Loans Error:", error)
    return NextResponse.json({ error: "Failed to load banking loans. Please try again later." }, { status: 500 })
  }
}
